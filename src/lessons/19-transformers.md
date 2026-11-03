# 19: Transformers: The Architecture Behind Modern AI

> **Before you start:** [05](05-math-linear-algebra.md) (dot product, matrix multiplication, transpose, shapes, Big-O from [02](02-python-programming.md#23-algorithm-speed-big-o-notation)), [07](07-math-probability-statistics.md#13-softmax) (softmax), [15](15-neural-networks.md) (dense layers, GELU, LayerNorm/RMSNorm, residual connections, dropout, embedding layers, parameter counting), [17](17-sequence-models-and-attention.md) (attention, encoder-decoder, teacher forcing), [18](18-nlp-fundamentals.md) (tokens, contextual embeddings, NLP tasks).
>
> **After this file you can:** explain every part of a Transformer: embeddings, positional encoding, self-attention with Query/Key/Value, scaling, masking, multi-head attention, feed-forward layers, residuals and normalisation. You'll know the difference between encoder-only (BERT), decoder-only (GPT) and encoder-decoder (T5) models, count parameters, and implement attention from scratch.

> If you understand this file, you understand the core of ChatGPT, Claude, Gemini and Llama.

---

## Table of contents

1. [The big picture](#1-the-big-picture)
2. [Step 1: token embeddings](#2-token-embeddings)
3. [Step 2: positional encoding](#3-positional-encoding)
4. [Self-attention: the intuition](#4-self-attention-intuition)
5. [Query, Key, Value](#5-query-key-value)
6. [Scaled dot-product attention (worked example)](#6-scaled-dot-product-attention)
7. [Matrix form and shapes](#7-matrix-form-and-shapes)
8. [Masking: causal and padding masks](#8-masking)
9. [Multi-head attention](#9-multi-head-attention)
10. [The feed-forward network](#10-the-feed-forward-network)
11. [Residual connections and layer normalisation](#11-residuals-and-normalisation)
12. [The full Transformer block](#12-the-full-transformer-block)
13. [The output head](#13-the-output-head)
14. [Three families: encoder-only, decoder-only, encoder-decoder](#14-three-families)
15. [BERT in more detail](#15-bert)
16. [GPT in more detail](#16-gpt)
17. [T5 and BART](#17-t5-and-bart)
18. [Counting parameters](#18-counting-parameters)
19. [The cost of attention and how it's reduced](#19-the-cost-of-attention)
20. [Transformers beyond text: Vision Transformer](#20-vision-transformer)
21. [Code: attention and a Transformer block from scratch](#21-code-from-scratch)
22. [Check yourself](#22-check-yourself)
23. [New words in this file](#23-new-words-in-this-file)

---

## 1. The big picture

The **Transformer** (paper: "Attention Is All You Need", Vaswani et al., 2017) processes all tokens **in parallel** and lets every token **directly look at every other token** through **self-attention** ([file 17](17-sequence-models-and-attention.md#15-why-rnns-were-replaced) explained why this beat RNNs).

A decoder-only Transformer (the GPT/LLM style) looks like this:

```
     Output: probabilities for the next token
                    ▲
            ┌───────────────┐
            │  Softmax      │
            │  Linear (LM head)
            │  Final norm   │
            └───────▲───────┘
                    │
    ┌───────────────┴────────────────┐
    │  Transformer Block × N          │  (e.g. N = 32 layers)
    │  ┌───────────────────────────┐  │
    │  │ Norm → Masked Multi-Head   │  │
    │  │        Self-Attention  ─(+)│◄─┤ residual
    │  │ Norm → Feed-Forward    ─(+)│◄─┤ residual
    │  └───────────────────────────┘  │
    └───────────────▲────────────────┘
                    │
        Token embeddings + positional information
                    ▲
          Token IDs: [464, 3797, 3332]
                    ▲
             Text: "The cat sat"
```

We'll build it piece by piece.

---

## 2. Token embeddings

1. Text is split into tokens by a **tokeniser** (subwords, [file 18](18-nlp-fundamentals.md#4-tokenisation); details in [file 20](20-how-llms-work.md)) → **token IDs**.
2. Each ID looks up a row in the **embedding matrix** ([file 15](15-neural-networks.md#16-embedding-layers)) of shape (vocab_size × d_model).

**d_model** (also called the **hidden size** or **model dimension**) = the length of each token's vector. Examples: BERT-base 768; Llama-3-8B 4096.

```
"The cat sat" → IDs [464, 3797, 3332] → embeddings: a (3 × d_model) matrix
                                         row 1 = vector for "The"
                                         row 2 = vector for "cat"
                                         row 3 = vector for "sat"
```

At this point each vector only knows its own token, not its context. The Transformer layers will mix in context.

---

## 3. Positional encoding

**Problem:** attention treats the input as a **set**: it has no built-in sense of order. Without position information, "dog bites man" and "man bites dog" look identical.

**Solution:** add information about each token's **position** to its embedding.

### Sinusoidal positional encoding (original Transformer)

Fixed patterns of sine and cosine waves at different frequencies, **added** to the embeddings:

```
PE(pos, 2i)   = sin(pos / 10000^(2i/d_model))
PE(pos, 2i+1) = cos(pos / 10000^(2i/d_model))
```

**Intuition:** like the hands of a clock (second hand fast, minute hand slower, hour hand slowest). Together, the positions of all the hands identify the exact time. Each dimension pair is a "hand" rotating at a different speed, so each position gets a unique pattern, and nearby positions get similar patterns.

### Learned positional embeddings (BERT, GPT-2)

A second embedding table with one learnable vector per position (0, 1, 2, ..., max_length − 1). Simple, but can't handle sequences longer than the maximum trained length.

### RoPE (Rotary Position Embedding): used by most modern LLMs (Llama, Qwen, Mistral...)

Instead of adding a position vector, RoPE **rotates** the query and key vectors (section 5) by an angle proportional to the position. When two tokens' rotated vectors are compared with a dot product, the result depends on their **relative distance** (how far apart they are), which is what matters for language.

**Analogy:** two people on a merry-go-round. If both rotate by the same extra amount, the angle between them stays the same. Only the gap between their positions matters.

RoPE can be stretched to handle longer contexts than trained on (techniques like **position interpolation** and **YaRN**, file 27).

### ALiBi

Doesn't add position vectors at all; instead adds a **penalty to attention scores** proportional to the distance between tokens (far-away tokens get slightly less attention). Extrapolates well to longer inputs.

---

## 4. Self-attention intuition

**Self-attention** lets every token gather information from every other token **in the same sequence**, weighted by relevance. (In [file 17](17-sequence-models-and-attention.md#13-attention-the-big-idea), attention went from decoder to encoder. "Self" means the sequence attends to *itself*.)

**Example:** "The **animal** didn't cross the street because **it** was too tired."

To understand "it", the model must work out that "it" refers to "animal" (not "street"). Self-attention lets the representation of "it" pull in information from "animal".

Change one word ("...because it was too **wide**") and "it" should now attend to "street". Attention is **dynamic**: computed fresh for each input.

**After self-attention, each token's vector is a context-aware blend** of information from the whole sentence. That's how "bank" gets different vectors in different sentences ([contextual embeddings, file 18](18-nlp-fundamentals.md#13-contextual-embeddings)).

---

## 5. Query, Key, Value

Each token's vector is projected (multiplied by learned weight matrices) into **three** different vectors:

| Vector | Role | Analogy (library search) |
|---|---|---|
| **Query (Q)** | "What am I looking for?" | What you type into the search box |
| **Key (K)** | "What do I contain / what can I be matched on?" | The title/tags on each book |
| **Value (V)** | "What information do I give if selected?" | The actual content of the book |

```
q = x · W_Q        k = x · W_K        v = x · W_V
```

W_Q, W_K, W_V are learned (each d_model × d_k).

**The process for one token:**
1. Compare its **query** with every token's **key** (dot product): how relevant is each token to me?
2. Softmax those scores → attention weights
3. Take the weighted average of all tokens' **values**

**Why separate Q, K and V?** It lets a token be matched for one reason but contribute different information. The word "it" might **look for** (query) "a noun that can be tired", be **found by** (key) others as "a pronoun", and **give** (value) information about being the subject.

---

## 6. Scaled dot-product attention

### The formula (the most famous equation in modern AI)

```
                       ⎛  Q · Kᵀ  ⎞
Attention(Q, K, V) = softmax ⎜ ─────── ⎟ · V
                       ⎝  √d_k    ⎠
```

In words:
1. **Q · Kᵀ:** every query dotted with every key → a table of scores ([matrix multiplication and transpose, file 05](05-math-linear-algebra.md#11-transpose-identity-inverse))
2. **÷ √d_k:** scale down (explained below)
3. **softmax** each row → attention weights (each row sums to 1)
4. **· V:** weighted sum of value vectors

### Why divide by √d_k?

The dot product of two random vectors with d_k dimensions grows with d_k (its standard deviation is about √d_k). With d_k = 64, raw scores might be around ±8 to ±20. Softmax of large numbers becomes **extremely peaked** (almost all weight on one token), and its gradients become tiny, so learning stalls. Dividing by √d_k keeps scores in a reasonable range (standard deviation ≈ 1).

**Example:** scores [16, 8, 0]: softmax ≈ [0.9997, 0.0003, 0.0000] (saturated). Divided by √64 = 8: [2, 1, 0] → softmax ≈ [0.665, 0.245, 0.090] (healthy).

### Fully worked example

Three tokens, d_k = 2 (tiny for clarity). Suppose after projection:

```
       Q            K            V
"I"   [1, 0]      [1, 0]      [1, 0]
"love"[0, 1]      [0, 1]      [0, 2]
"AI"  [1, 1]      [1, 1]      [3, 1]
```

**Step 1: Q·Kᵀ** (row = query token, column = key token):

| | K "I" | K "love" | K "AI" |
|---|---|---|---|
| **Q "I"** [1,0] | 1 | 0 | 1 |
| **Q "love"** [0,1] | 0 | 1 | 1 |
| **Q "AI"** [1,1] | 1 | 1 | 2 |

**Step 2: ÷ √2 ≈ 1.414:**

| | I | love | AI |
|---|---|---|---|
| I | 0.707 | 0 | 0.707 |
| love | 0 | 0.707 | 0.707 |
| AI | 0.707 | 0.707 | 1.414 |

**Step 3: softmax each row.** Row "AI": e^0.707 = 2.028, e^0.707 = 2.028, e^1.414 = 4.113; sum = 8.169 → **[0.248, 0.248, 0.504]**

Row "I": e^0.707 = 2.028, e⁰ = 1, 2.028; sum = 5.056 → **[0.401, 0.198, 0.401]**

**Step 4: weighted sum of values** for "AI":
0.248×[1, 0] + 0.248×[0, 2] + 0.504×[3, 1]
= [0.248 + 0 + 1.512, 0 + 0.496 + 0.504] = **[1.760, 1.000]**

The new representation of "AI" now blends information from all three tokens, mostly from itself.

For "I": 0.401×[1,0] + 0.198×[0,2] + 0.401×[3,1] = [0.401 + 1.203, 0.396 + 0.401] = **[1.604, 0.797]**

---

## 7. Matrix form and shapes

All tokens are processed at once with matrix multiplications, which is why GPUs love Transformers.

For one sequence of n tokens:

| Tensor | Shape |
|---|---|
| X (input embeddings) | (n × d_model) |
| Q = X·W_Q, K = X·W_K, V = X·W_V | (n × d_k) each |
| Q·Kᵀ (scores) | (**n × n**) ← every token vs every token |
| softmax(scores) | (n × n) |
| output = weights · V | (n × d_k) |

With a batch and multiple heads (section 9), shapes become (batch, heads, n, d_k) and the score tensor is **(batch, heads, n, n)**.

**The n × n matrix is why attention cost grows with the square of the sequence length** (section 19).

---

## 8. Masking

### Causal mask (look-ahead mask): for generation

A model that generates text left to right must **not see future tokens** during training, otherwise predicting the next word would be cheating (it could just read it).

The **causal mask** sets scores for future positions to **−∞** before the softmax. Since e^(−∞) = 0, those positions get **zero** attention weight.

```
Scores matrix with causal mask (rows = query position, columns = key position):

          The   cat   sat   on
The     [  s    −∞    −∞    −∞ ]   "The" sees only itself
cat     [  s     s    −∞    −∞ ]   "cat" sees The, cat
sat     [  s     s     s    −∞ ]
on      [  s     s     s     s ]   "on" sees everything before it
```

This lower-triangular pattern means **one forward pass trains next-token prediction at every position simultaneously**: position 1 predicts token 2, position 2 predicts token 3, and so on. This is teacher forcing ([file 17](17-sequence-models-and-attention.md#11-teacher-forcing-and-decoding)) done in parallel, and a big reason Transformers train efficiently.

### Padding mask

Batches contain sequences of different lengths padded to the same length ([file 17](17-sequence-models-and-attention.md#9-bidirectional-and-stacked-rnns)). The **padding mask** (also called the **attention mask**) sets scores for padding tokens to −∞ so real tokens never attend to them.

```python
# Hugging Face tokenisers return it automatically:
batch = tokenizer(["Hi", "How are you today?"], padding=True, return_tensors="pt")
batch["attention_mask"]
# tensor([[1, 1, 0, 0, 0, 0],      1 = real token, 0 = padding
#         [1, 1, 1, 1, 1, 1]])
```

---

## 9. Multi-head attention

**Idea:** instead of one attention operation, run **several in parallel** (**heads**), each with its own W_Q, W_K, W_V. Each head can learn to focus on **different kinds of relationships**.

**Analogy:** a team reading the same sentence: one person tracks grammar (subject ↔ verb), another tracks who "it" refers to, another tracks the topic, another looks at the neighbouring word. Their notes are then combined.

**How:**
1. Split d_model into h heads, each of size d_k = d_model / h (e.g. 768 / 12 = 64)
2. Each head computes attention independently
3. **Concatenate** the h outputs → back to d_model
4. Multiply by an output matrix **W_O** (d_model × d_model) to mix the heads

```
X ──┬─► Head 1 (Q₁,K₁,V₁) ─┐
    ├─► Head 2 (Q₂,K₂,V₂) ─┤
    ├─► ...                ├─► Concat ─► W_O ─► output (n × d_model)
    └─► Head h (Qₕ,Kₕ,Vₕ) ─┘
```

Total computation is about the same as one big head, because each head is smaller.

Researchers have found heads specialising in things like "attend to the previous token", "match brackets", or "copy a pattern seen earlier" (**induction heads**, believed to be important for in-context learning, file 22).

### Cross-attention

In encoder-decoder models, the decoder has an extra attention layer where **queries come from the decoder** but **keys and values come from the encoder's output**. This is exactly the original attention from [file 17](17-sequence-models-and-attention.md#13-attention-the-big-idea): "while writing the translation, look at the source sentence". Cross-attention is also how text guides image generation in diffusion models (file 25).

### Saving memory: MQA and GQA

During generation, the keys and values of all previous tokens are stored (the **KV cache**, [file 20](20-how-llms-work.md)). With many heads, this uses a lot of memory.
- **Multi-Query Attention (MQA):** all query heads share **one** set of K and V.
- **Grouped-Query Attention (GQA):** groups of query heads share K/V (e.g. 32 query heads, 8 KV heads). A good balance; used in Llama 2/3, Mistral and many others.

---

## 10. The feed-forward network

After attention mixes information **between** tokens, each token goes through a small MLP ([file 15](15-neural-networks.md#3-multi-layer-perceptrons)) **independently** (the same MLP for every position):

```
FFN(x) = W₂ · activation(W₁ · x + b₁) + b₂
```

- Expands to a bigger hidden size (typically **4 × d_model**, e.g. 768 → 3072), applies an activation (GELU), then shrinks back.

**Division of labour:**
- **Attention:** tokens **communicate** ("gather information from others")
- **FFN:** each token **thinks** about what it gathered ("process it")

Research suggests FFN layers store much of a model's **factual knowledge** (like key-value memories: "Eiffel Tower" → "Paris").

### SwiGLU (modern LLMs)

Llama and most recent LLMs use a **gated** FFN:

```
FFN(x) = W₂ · ( SiLU(W₁·x) ⊙ (W₃·x) )
```

Two parallel projections; one passes through SiLU ([file 15](15-neural-networks.md#5-activation-functions)) and acts as a **gate** multiplying the other element-wise (⊙). It works better in practice. Because it has three matrices, the hidden size is usually set to about (8/3) × d_model to keep the parameter count similar.

---

## 11. Residuals and normalisation

Each sub-layer (attention, FFN) is wrapped with:
- a **residual connection** ([file 15](15-neural-networks.md#15-residual-connections)): output = x + SubLayer(...), so gradients flow through dozens of layers
- **layer normalisation** ([file 15](15-neural-networks.md#14-normalisation-layers)): LayerNorm or RMSNorm, to keep values stable

**Post-norm** (original 2017 paper):
```
x = LayerNorm(x + Attention(x))
x = LayerNorm(x + FFN(x))
```

**Pre-norm** (GPT-2 onward, **standard in modern LLMs**):
```
x = x + Attention(LayerNorm(x))
x = x + FFN(LayerNorm(x))
```

Pre-norm is more stable for very deep models (and needs less warmup), because the residual path stays completely clean: an unbroken "highway" from input to output, often called the **residual stream**. Each layer reads from the stream and writes an update back into it.

---

## 12. The full Transformer block

A modern **decoder block** (pre-norm, GPT/Llama style):

```
          x (n × d_model)  ──────────────────────┐
          │                                       │
          ▼                                       │
     RMSNorm / LayerNorm                          │
          ▼                                       │
  Masked Multi-Head Self-Attention (with RoPE)    │
          ▼                                       │
         (+) ◄────────────────────────────────────┘
          │  ─────────────────────────────────────┐
          ▼                                       │
     RMSNorm / LayerNorm                          │
          ▼                                       │
     Feed-Forward (SwiGLU)                        │
          ▼                                       │
         (+) ◄────────────────────────────────────┘
          │
          ▼
     output (n × d_model)  → next block
```

The input and output shapes are identical, so blocks can be **stacked**: 12 (GPT-2 small), 32 (Llama-3-8B), 80 (Llama-3-70B), 100+ in the biggest models.

**What happens across layers?** Lower layers tend to handle local syntax and word identity; middle layers build meaning and relationships; upper layers prepare the specific prediction.

---

## 13. The output head

After the last block (and a final norm), each position's vector is projected to the vocabulary:

```
logits = h · W_vocab        shape: (n × vocab_size)
probabilities = softmax(logits)
```

This **LM head** gives, at every position, a probability for every token in the vocabulary as the **next** token ([file 20](20-how-llms-work.md)).

**Weight tying:** many models reuse the input embedding matrix (transposed) as W_vocab, which saves parameters (vocab × d_model can be hundreds of millions).

For classification models (like BERT for sentiment), the head is instead a small classifier on top of one special token's vector (section 15).

---

## 14. Three families

| | **Encoder-only** | **Decoder-only** | **Encoder-decoder** |
|---|---|---|---|
| Attention | **Bidirectional**: each token sees all tokens | **Causal**: each token sees only previous tokens | Encoder bidirectional; decoder causal + **cross-attention** to encoder |
| Pretraining task | **Masked language modelling** (fill in blanks) | **Next-token prediction** (causal LM) | Text-to-text, e.g. **span corruption** (fill in removed spans) |
| Best at | **Understanding**: classification, NER, embeddings, search | **Generation**: chat, writing, code; and, at scale, almost everything | **Transforming input to output**: translation, summarisation |
| Examples | **BERT**, RoBERTa, DeBERTa, ELECTRA, most embedding models | **GPT** series, **Claude**, **Llama**, Mistral, Qwen, Gemini*, DeepSeek | **T5**, FLAN-T5, BART, mT5, Whisper (speech), original Transformer |

\*Exact architectures of some closed models aren't public, but modern chat LLMs are decoder-style.

```
Encoder-only (BERT)        Decoder-only (GPT)          Encoder-decoder (T5)
 every token ↔ every        each token → only            input ──► encoder ──┐
 token                      earlier tokens                                   │ cross-attention
 "The [MASK] sat"           "The cat sat" → "on"         output ◄── decoder ◄┘
   → "cat"
```

**Why did decoder-only win for LLMs?** It's simple, every token gives a training signal (no masking waste), it scales well, and generation naturally covers understanding tasks too ("Classify this review: ... Answer:").

---

## 15. BERT

**BERT** (Bidirectional Encoder Representations from Transformers, Google 2018): an encoder-only model.

### Pretraining tasks

1. **Masked Language Modelling (MLM):** randomly hide 15% of tokens and predict them using context from **both sides**.
   "The [MASK] sat on the mat" → predict "cat"
   (Of the chosen tokens, 80% become [MASK], 10% a random token, 10% stay unchanged, so the model doesn't rely on always seeing [MASK].)
2. **Next Sentence Prediction (NSP):** does sentence B follow sentence A? (Later found not very useful; RoBERTa dropped it.)

### Special tokens

- **[CLS]** at the start: its final vector is used as a summary of the whole input for classification
- **[SEP]** separates sentences
- **[MASK]** marks hidden tokens
- **[PAD]** padding

```
[CLS] my dog is cute [SEP] he likes playing [SEP]
```

### Using BERT

**Fine-tune** it for your task by adding a small head:
- Classification: a linear layer on the [CLS] vector
- NER: a linear layer on every token's vector (token classification with BIO tags, [file 18](18-nlp-fundamentals.md#14-core-nlp-tasks))
- Extractive QA: predict start and end positions of the answer span

Sizes: **BERT-base** (12 layers, d=768, 12 heads, 110M parameters), **BERT-large** (24 layers, d=1024, 16 heads, 340M).

**Variants:** **RoBERTa** (better training: more data, no NSP), **DistilBERT** (smaller, faster, via distillation, file 21), **DeBERTa** (improved attention), **ModernBERT** (2024 update with longer context and RoPE).

```python
from transformers import AutoTokenizer, AutoModelForSequenceClassification
tok = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModelForSequenceClassification.from_pretrained("bert-base-uncased", num_labels=2)
inputs = tok("This movie was great!", return_tensors="pt")
logits = model(**inputs).logits      # head is random until you fine-tune it (file 21)
```

---

## 16. GPT

**GPT** (Generative Pretrained Transformer, OpenAI): decoder-only, trained to predict the next token.

| Model | Year | Parameters | Notable |
|---|---|---|---|
| GPT-1 | 2018 | 117M | Pretrain + fine-tune works |
| GPT-2 | 2019 | 1.5B | Impressive text generation; zero-shot tasks |
| GPT-3 | 2020 | 175B | **In-context / few-shot learning** from prompts alone |
| ChatGPT (GPT-3.5) | 2022 | — | Instruction tuning + RLHF → helpful chat (file 21) |
| GPT-4 and later | 2023+ | not disclosed | Multimodal, much stronger reasoning |

Today's leading LLMs (Claude, Gemini, Llama, Qwen, Mistral, DeepSeek) follow the same core design: a stack of decoder blocks trained on next-token prediction, then **aligned** to follow instructions (file 21). Modern additions include RoPE, RMSNorm, SwiGLU, GQA, and often Mixture-of-Experts layers (file 21).

How GPT-style models generate text, why they hallucinate, and how sampling works: [file 20](20-how-llms-work.md).

---

## 17. T5 and BART

**T5** (Text-to-Text Transfer Transformer, Google 2019): frames **every** task as text in → text out, with a task prefix:
- "translate English to German: That is good." → "Das ist gut."
- "summarize: [article]" → "[summary]"
- "cola sentence: The course is jumping well." → "unacceptable"

Pretrained with **span corruption**: random spans of text are replaced with placeholder tokens, and the decoder must output the missing spans.

```
Input:  "Thank you <X> me to your party <Y> week."
Target: "<X> for inviting <Y> last <Z>"
```

**FLAN-T5:** T5 further trained on many instruction-style tasks; good at following instructions for its size.

**BART** (Meta): encoder-decoder pretrained by **corrupting** text (masking, deleting, shuffling sentences) and learning to reconstruct the original. Excellent for summarisation.

---

## 18. Counting parameters

For one Transformer block with model dimension d (ignoring small bias and norm parameters):

| Part | Parameters |
|---|---|
| Attention: W_Q, W_K, W_V, W_O (each d × d) | **4d²** |
| FFN: d → 4d → d (two matrices) | **8d²** |
| **Total per block** | **≈ 12d²** |

**Plus:** embeddings = vocab_size × d (and another vocab × d for the LM head if not tied).

### Worked example: GPT-2 small

d = 768, 12 layers, vocabulary 50,257, tied embeddings.
- Per block: 12 × 768² = 12 × 589,824 ≈ **7.08M**
- 12 blocks: ≈ **84.9M**
- Embeddings: 50,257 × 768 ≈ **38.6M** (plus 1,024 × 768 ≈ 0.8M learned positions)
- **Total ≈ 124M** ✓ (the official number is 124M)

### Worked example: a model with d = 4096, 32 layers

- Per block ≈ 12 × 4096² ≈ 201M; × 32 ≈ **6.4B**
- Embeddings (vocab 128k, untied): 2 × 128,000 × 4096 ≈ 1.05B
- **Total ≈ 7.5B** (roughly "an 8B model"; GQA and SwiGLU change the details)

**Memory rule of thumb** ([file 01](01-big-picture-and-data.md#how-numbers-are-stored-preview-for-later)): parameters × bytes per parameter. 8B in BF16 ≈ **16 GB** just to load the weights.

---

## 19. The cost of attention

The score matrix is **n × n**. Doubling the sequence length **quadruples** the attention compute and memory: **O(n²)** ([Big-O, file 02](02-python-programming.md#23-algorithm-speed-big-o-notation)).

| Sequence length n | Score entries per head per layer |
|---|---|
| 1,000 | 1 million |
| 10,000 | 100 million |
| 100,000 | 10 billion |

That's why long context windows are expensive (file 20, 27). Solutions:

| Technique | Idea |
|---|---|
| **FlashAttention** | Exact same maths, but computed in small **tiles** that fit in the GPU's fast on-chip memory, never storing the full n × n matrix. Much faster and uses far less memory. **Standard everywhere.** |
| **Sliding-window attention** | Each token attends only to the last w tokens (e.g. 4,096). Used in Mistral; often mixed with some full-attention layers. |
| **Sparse attention** | Attend to a structured subset (local + a few global tokens). |
| **Linear attention** | Approximations with O(n) cost; usually lower quality. |
| **MQA/GQA** (section 9) | Shrink the KV cache memory during generation. |
| **State-space models (Mamba)** and hybrids | Recurrent-style O(n) alternatives (file 30). |

---

## 20. Vision Transformer

**ViT** (Google, 2020) applies a standard Transformer **encoder** to images:

1. Split the image into **patches** (e.g. 16×16 pixels). A 224×224 image → 14 × 14 = **196 patches**.
2. Flatten each patch (16×16×3 = 768 numbers) and project it linearly into a d_model vector: a "visual token".
3. Add positional embeddings and a [CLS] token.
4. Run Transformer blocks; classify from the [CLS] output.

```
Image ─► [patch][patch][patch]...[patch] ─► linear ─► + positions ─► Transformer encoder ─► [CLS] ─► class
          16×16  16×16  16×16      16×16
```

ViTs lack CNNs' built-in assumptions (locality, translation invariance, [file 16](16-cnns-and-computer-vision.md#1-why-not-an-mlp-for-images)), so they need **lots of data** (or strong pretraining). At large scale they match or beat CNNs. ViT-style encoders are the "eyes" of multimodal models like CLIP and vision-language LLMs (file 25).

**The general lesson:** anything that can be turned into a sequence of tokens (text, image patches, audio frames, video, protein sequences, actions) can be processed by a Transformer.

---

## 21. Code from scratch

### Scaled dot-product attention

```python
import math, torch, torch.nn as nn, torch.nn.functional as F

def attention(q, k, v, causal=False):
    # q, k, v: (batch, heads, n, d_k)
    d_k = q.size(-1)
    scores = q @ k.transpose(-2, -1) / math.sqrt(d_k)       # (B, H, n, n)
    if causal:
        n = scores.size(-1)
        mask = torch.triu(torch.ones(n, n, dtype=torch.bool), diagonal=1)   # True above diagonal
        scores = scores.masked_fill(mask, float("-inf"))
    weights = F.softmax(scores, dim=-1)
    return weights @ v, weights

# Check with the worked example from section 6
Q = torch.tensor([[[[1., 0.], [0., 1.], [1., 1.]]]])
K = Q.clone()
V = torch.tensor([[[[1., 0.], [0., 2.], [3., 1.]]]])
out, w = attention(Q, K, V)
print(w[0, 0, 2])    # tensor([0.2483, 0.2483, 0.5035])
print(out[0, 0, 2])  # tensor([1.7587, 1.0000])
```

(In real code, use `F.scaled_dot_product_attention(q, k, v, is_causal=True)`, which automatically uses FlashAttention when available.)

### Multi-head attention and a decoder block

```python
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, n_heads):
        super().__init__()
        assert d_model % n_heads == 0
        self.h, self.d_k = n_heads, d_model // n_heads
        self.qkv = nn.Linear(d_model, 3 * d_model)     # W_Q, W_K, W_V in one matrix
        self.out = nn.Linear(d_model, d_model)         # W_O

    def forward(self, x):                              # x: (B, n, d_model)
        B, n, d = x.shape
        q, k, v = self.qkv(x).split(d, dim=-1)
        # reshape to (B, heads, n, d_k)
        q, k, v = [t.view(B, n, self.h, self.d_k).transpose(1, 2) for t in (q, k, v)]
        y = F.scaled_dot_product_attention(q, k, v, is_causal=True)
        y = y.transpose(1, 2).contiguous().view(B, n, d)   # concat heads
        return self.out(y)

class Block(nn.Module):
    def __init__(self, d_model=256, n_heads=4, dropout=0.1):
        super().__init__()
        self.ln1 = nn.LayerNorm(d_model)
        self.attn = MultiHeadAttention(d_model, n_heads)
        self.ln2 = nn.LayerNorm(d_model)
        self.ffn = nn.Sequential(nn.Linear(d_model, 4 * d_model), nn.GELU(),
                                 nn.Linear(4 * d_model, d_model), nn.Dropout(dropout))

    def forward(self, x):
        x = x + self.attn(self.ln1(x))     # pre-norm + residual
        x = x + self.ffn(self.ln2(x))
        return x

class TinyGPT(nn.Module):
    def __init__(self, vocab_size, d_model=256, n_heads=4, n_layers=4, max_len=256):
        super().__init__()
        self.tok = nn.Embedding(vocab_size, d_model)
        self.pos = nn.Embedding(max_len, d_model)                 # learned positions
        self.blocks = nn.Sequential(*[Block(d_model, n_heads) for _ in range(n_layers)])
        self.ln_f = nn.LayerNorm(d_model)
        self.head = nn.Linear(d_model, vocab_size, bias=False)
        self.head.weight = self.tok.weight                        # weight tying

    def forward(self, idx):                                       # idx: (B, n) token IDs
        n = idx.size(1)
        x = self.tok(idx) + self.pos(torch.arange(n, device=idx.device))
        x = self.blocks(x)
        return self.head(self.ln_f(x))                            # (B, n, vocab) logits

model = TinyGPT(vocab_size=1000)
logits = model(torch.randint(0, 1000, (2, 16)))
print(logits.shape)     # torch.Size([2, 16, 1000])
```

Train it with cross-entropy between `logits[:, :-1]` and the input shifted by one (`idx[:, 1:]`), i.e. next-token prediction, and you have a working mini-GPT. Andrej Karpathy's **nanoGPT** and his "Let's build GPT" video are excellent next steps (file 30).

---

## 22. Check yourself

**Q1.** Why does a Transformer need positional information?
<details><summary>Answer</summary>Self-attention treats tokens as an unordered set; without positions, word order would be invisible.</details>

**Q2.** Explain Query, Key and Value in one sentence each.
<details><summary>Answer</summary>Query: what this token is looking for. Key: what each token offers to be matched on. Value: the information each token passes on when attended to.</details>

**Q3.** Why divide by √d_k?
<details><summary>Answer</summary>Dot products grow with dimension; large scores make softmax saturate (one-hot-like) with tiny gradients. Scaling keeps scores around unit variance.</details>

**Q4.** Two tokens: q₁ = [1, 1], k₁ = [1, 0], k₂ = [0, 2], v₁ = [10, 0], v₂ = [0, 10], d_k = 2 (use √2 ≈ 1.414). Compute the attention output for token 1.
<details><summary>Answer</summary>Scores: 1, 2 → scaled 0.707, 1.414 → softmax: e^0.707 = 2.028, e^1.414 = 4.113, sum 6.141 → [0.330, 0.670]. Output = 0.330×[10,0] + 0.670×[0,10] = **[3.30, 6.70]**.</details>

**Q5.** What does the causal mask do, and why does it enable efficient training?
<details><summary>Answer</summary>It blocks attention to future tokens (−∞ before softmax). So every position can be trained to predict its next token in a single parallel forward pass without cheating.</details>

**Q6.** Why use multiple attention heads?
<details><summary>Answer</summary>Each head can learn a different type of relationship (syntax, coreference, position), and the results are combined.</details>

**Q7.** What are the roles of attention vs the FFN in a block?
<details><summary>Answer</summary>Attention moves information between tokens; the FFN processes each token's information individually (and stores much knowledge).</details>

**Q8.** Pre-norm vs post-norm: which do modern LLMs use and why?
<details><summary>Answer</summary>Pre-norm: normalise before each sub-layer and keep the residual path clean, which is more stable for deep models.</details>

**Q9.** Which family (encoder-only, decoder-only, encoder-decoder) fits: (a) a chatbot, (b) classifying support tickets with a small fast model, (c) translation?
<details><summary>Answer</summary>(a) decoder-only, (b) encoder-only (BERT-like), (c) encoder-decoder (or a decoder-only LLM).</details>

**Q10.** Approximately how many parameters per block for d = 1024? For 24 layers?
<details><summary>Answer</summary>12 × 1024² ≈ 12.6M per block; × 24 ≈ **302M** (plus embeddings).</details>

**Q11.** Going from 4k to 32k context, by roughly how much does attention's score-matrix memory grow (without FlashAttention)?
<details><summary>Answer</summary>8× longer → 8² = **64×**.</details>

**Q12.** How does ViT turn an image into tokens?
<details><summary>Answer</summary>Splits it into fixed-size patches (e.g. 16×16), flattens each and linearly projects it to a vector, then adds positional embeddings.</details>

---

## 23. New words in this file

| Word | Meaning |
|---|---|
| Transformer | Architecture built on self-attention, processing tokens in parallel |
| d_model / hidden size | Length of each token's vector |
| Positional encoding: sinusoidal, learned, RoPE, ALiBi | Ways to give the model word-order information |
| Relative position | Distance between tokens |
| Self-attention | Tokens attending to tokens in the same sequence |
| Query, Key, Value (Q, K, V), W_Q, W_K, W_V | Projections for looking, matching, and providing information |
| Scaled dot-product attention | softmax(QKᵀ/√d_k)·V |
| d_k | Dimension of each query/key vector |
| Causal (look-ahead) mask | Blocks attention to future tokens |
| Padding / attention mask | Blocks attention to padding |
| Multi-head attention, head, W_O | Parallel attentions / one of them / output mixing matrix |
| Induction heads | Heads that copy earlier patterns |
| Cross-attention | Queries from one sequence, keys/values from another |
| MQA, GQA | Shared key/value heads to save memory |
| KV cache (preview) | Stored keys/values during generation |
| Feed-forward network (FFN), SwiGLU | Per-token MLP / gated version |
| Pre-norm vs post-norm | Normalise before vs after sub-layers |
| Residual stream | The running vector each layer reads from and adds to |
| Transformer block / layer | Attention + FFN with residuals and norms |
| LM head, weight tying | Final projection to vocabulary / reuse embedding matrix |
| Encoder-only, decoder-only, encoder-decoder | The three Transformer families |
| Bidirectional vs causal attention | See all tokens vs only earlier ones |
| Masked Language Modelling (MLM), NSP | BERT's pretraining tasks |
| [CLS], [SEP], [MASK], [PAD] | BERT special tokens |
| BERT, RoBERTa, DistilBERT, DeBERTa, ModernBERT | Encoder models |
| GPT, causal language modelling | Decoder models / next-token pretraining |
| In-context / few-shot learning (preview) | Learning from examples in the prompt (file 22) |
| T5, FLAN-T5, BART, span corruption, text-to-text | Encoder-decoder models and their pretraining |
| 12d² rule | Approximate parameters per block |
| O(n²) attention cost | Quadratic growth with sequence length |
| FlashAttention, tiling | Exact attention computed in memory-efficient blocks |
| Sliding-window, sparse, linear attention | Cheaper attention variants |
| Vision Transformer (ViT), patches | Transformer for images using patch tokens |
| nanoGPT | Minimal GPT implementation for learning |

**Next:** [20-how-llms-work.md](20-how-llms-work.md)
