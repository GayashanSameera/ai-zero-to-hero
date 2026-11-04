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

**Why it exists:** before 2017 the best language models were RNNs ([file 17](17-sequence-models-and-attention.md)). They read one word at a time, in order. Two problems followed: the start of a long sentence faded by the time the model reached the end, and a GPU could not speed things up because each step had to wait for the one before. The Transformer reads all the words at once and lets every word look straight at every other word.

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

**Analogy:** an RNN is a student reading a story aloud one word at a time and trying to remember it all. After ten pages the first page is forgotten. A Transformer lays the whole page on the table and draws highlighter lines between any two related words, all at the same moment.

### Worked example: the path between two words

Sentence: "Kamal went to Colombo, but **he** missed the bus." The word "he" is 5 words away from "Kamal".

| Model | Steps of processing between "Kamal" and "he" |
|---|---|
| RNN | 5 steps in a row; the information about Kamal must survive all of them |
| Transformer | **1** step: "he" attends directly to "Kamal" |

For 100 tokens an RNN needs 100 sequential steps, whereas a Transformer layer handles all 100 together. Parallel work is exactly what GPUs are good at, and that is why models could grow from millions to hundreds of billions of parameters.

| | RNN / LSTM | Transformer |
|---|---|---|
| Reads tokens | one by one | all at once |
| Distance between two tokens | grows with the gap | always 1 attention step |
| GPU-friendly | poor | excellent |
| Cost with length n | grows linearly (n steps) | grows with n² (every pair) |

The last row is the price you pay, and sections 19 onwards come back to it.

**Where you'll meet it in real work:** GPT, Claude, Gemini and Llama chatbots, Google Translate, BERT inside Google Search, and the vision models that read X-rays.

**Common mistakes:**
- Thinking "attention" in a Transformer means the model "focuses" like a human. It is a weighted average computed by matrix maths.
- Forgetting that "Transformer" is a design, not one model. GPT, BERT and T5 are all Transformers built differently (section 14).

**Exam angle:** know the paper title and year ("Attention Is All You Need", 2017), that Transformers process tokens in parallel, and that self-attention replaced recurrence.

> **සිංහලෙන්:** Transformer කියන්නේ 2017 දී "Attention Is All You Need" paper එකෙන් ආපු architecture එක, අද GPT, Claude, Llama ඔක්කොමගේ පදනම. කලින් තිබුණු RNN එක වචන කියවන්නේ එකින් එක, ඒ නිසා දිග වාක්‍යයක මුල අගට එනකොට අමතක වෙනවා, GPU එකෙනුත් වේගවත් කරන්න බෑ. Transformer එක මුළු වාක්‍යයම එකපාර බලනවා, හැම වචනයක්ම අනිත් හැම වචනයකට කෙළින්ම සම්බන්ධ කරනවා. "කමල් කොළඹ ගියා, ඒත් එයාට bus එක මග ඇරුණා" කියන එකේ "එයාට" කියන token එකට "කමල්" වෙත කෙළින්ම ඇහැ ගහන්න පුළුවන්, අතරමැද පියවර 5ක් ගියේ නෑ. මේ parallel වැඩේ නිසා තමයි models ලොකු කරන්න පුළුවන් වුණේ.

---

## 2. Token embeddings

**Why it exists:** a neural network can only multiply numbers, but a token ID like 3797 is just a label with no meaning (ID 3797 is not "bigger" than ID 3796 in any useful way). The embedding table swaps each ID for a learned vector, so tokens that behave alike can end up with similar vectors.

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

### Worked example: a tiny embedding table

Toy vocabulary of 5 tokens, d_model = 3 (real models: 50,000 to 200,000 tokens and 768 to 8,192 dimensions).

| ID | Token | Embedding row |
|---|---|---|
| 0 | the | [0.1, 0.4, −0.2] |
| 1 | cat | [0.7, −0.1, 0.5] |
| 2 | sat | [0.0, 0.9, 0.3] |
| 3 | on | [−0.3, 0.2, 0.1] |
| 4 | mat | [0.6, −0.2, 0.4] |

"The cat sat" → IDs [0, 1, 2] → pick rows 0, 1, 2 → a 3 × 3 matrix. There is no maths here: it is just a **lookup**.

**Size of the table.** GPT-2 small: 50,257 tokens × 768 = **38.6 million** numbers, learned during training like any other weights. A model with a 128,000-token vocabulary and d_model = 4096 has 128,000 × 4096 ≈ **524 million** in this table alone.

**Where you'll meet it in real work:** every LLM API call begins here. It is also why the embedding layers of different models are not interchangeable: a vector from one model's table is meaningless to another.

**Common mistakes:**
- Confusing "token embedding" (a fixed row per token, no context) with the "contextual embedding" that comes out after the Transformer layers.
- Mixing up vocab_size (number of rows) and d_model (length of each row).

**Exam angle:** "What are the shape and role of the embedding matrix?" (vocab_size × d_model; converts token IDs to vectors).

> **සිංහලෙන්:** Transformer එකට text එක යන්නේ tokens වලට කැඩිලා, ඒ හැම token එකකටම ID අංකයක් ලැබිලා. ඒත් "3797" කියන අංකයට තේරුමක් නෑ, ඒ නිසා embedding table එකකින් ඒ ID එකට අදාළ vector එකක් (අංක ලැයිස්තුවක්) ගන්නවා. ඒක හරියට පොතක index එකෙන් පිටු අංකය බලලා ඒ පිටුවේ තියෙන දේ ගන්නවා වගේ, ගණිතයක් නෑ, lookup එකක් විතරයි. GPT-2 small එකේ tokens 50,257ක් සහ d_model = 768 නිසා මේ table එකේ අංක 38.6 මිලියනයක් තියෙනවා. ඒත් මේ වෙලාවේ හැම vector එකක්ම දන්නේ තමන්ගේ token එක විතරයි, context එක මිශ්‍ර කරන්නේ ඊළඟ layers වලින්.

---

## 3. Positional encoding

**Why it exists:** attention looks at tokens like items in a bag. Without extra help, it cannot tell "dog bites man" from "man bites dog". Positional encoding stamps each token with its place in the line.

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

### Worked example: sinusoidal positions with d_model = 4

Using PE(pos, 2i) = sin(pos / 10000^(2i/d)) and PE(pos, 2i+1) = cos(...) with d = 4:
- dimensions 0, 1 use i = 0: sin(pos) and cos(pos)
- dimensions 2, 3 use i = 1: the divisor is 10000^(2/4) = 100, so sin(pos/100) and cos(pos/100)

| Position | dim 0: sin(pos) | dim 1: cos(pos) | dim 2: sin(pos/100) | dim 3: cos(pos/100) |
|---|---|---|---|---|
| 0 | 0.000 | 1.000 | 0.000 | 1.000 |
| 1 | 0.841 | 0.540 | 0.010 | 1.000 |
| 2 | 0.909 | −0.416 | 0.020 | 1.000 |

Dims 0 and 1 spin fast (the "second hand"); dims 2 and 3 spin slowly (the "hour hand"). Every position has its own unique pattern.

**It is added to the token embedding.** If the embedding of "cat" is [0.5, −0.2, 0.1, 0.3] and it sits at position 1:

[0.5 + 0.841, −0.2 + 0.540, 0.1 + 0.010, 0.3 + 1.000] = **[1.341, 0.340, 0.110, 1.300]**

The same word at position 2 gets a different final vector, so the model can tell the places apart.

**Analogy:** a cricket team has 11 players, but the batting order matters: the opener and number 11 play very different roles. Positional encoding sews the jersey number onto each token. RoPE is more like each player knowing "I bat 3 places after you", a *relative* gap.

| Method | Where used | Handles longer text than trained? |
|---|---|---|
| Sinusoidal | original Transformer | in theory yes |
| Learned | BERT, GPT-2 | no (fixed table size, e.g. 1,024) |
| RoPE | Llama, Qwen, Mistral | can be stretched (interpolation, YaRN) |
| ALiBi | some open models | extrapolates well |

**Where you'll meet it in real work:** when someone says "this model has a 128k context window", the position scheme (usually RoPE-based) is part of what makes that possible.

**Common mistakes:**
- Forgetting that without positions the model is order-blind.
- Assuming a model trained with learned positions up to 1,024 can simply read 4,000 tokens. It has no row for position 1,025.

**Exam angle:** know that positions are *added* to embeddings (sinusoidal, learned) or *applied by rotating* queries and keys (RoPE), and that Llama-style models use RoPE.

> **සිංහලෙන්:** Attention එකට පිළිවෙළ ගැන දැනුමක් නෑ, ඒක tokens බලන්නේ බෑගයක තියෙන බඩු වගේ. ඒ නිසා "බල්ලා පූසාව හැපුවා" සහ "පූසා බල්ලාව හැපුවා" එකම වගේ පේනවා. Positional encoding කියන්නේ හැම token එකකටම "මම ඉන්නේ මෙච්චරවෙනි තැන" කියන සලකුණ එකතු කරන එක, cricket team එකේ jersey number එක වගේ. Original Transformer එකේ sin සහ cos තරංග පාවිච්චි කළා, BERT සහ GPT-2 වල position එකකට vector එකක් ඉගෙන ගත්තා, ඒත් අද Llama වගේ models පාවිච්චි කරන RoPE එකේදී Q සහ K vectors position එක අනුව කරකවනවා, ඒ නිසා tokens දෙකක් අතර දුර තමයි වැදගත් වෙන්නේ. හිතන්න "cat" එකේ vector එකට position 1 ගේ අංක එකතු කළාම [0.5, −0.2, 0.1, 0.3] එක [1.341, 0.340, 0.110, 1.300] වෙනවා.

---

## 4. Self-attention intuition

**Why it exists:** to understand a word you often need another word that sits far away. In "The animal didn't cross the street because it was too tired", the word "it" can only be understood by looking back at "animal". Self-attention is the mechanism that lets each word go and fetch what it needs from the others.

**Self-attention** lets every token gather information from every other token **in the same sequence**, weighted by relevance. (In [file 17](17-sequence-models-and-attention.md#13-attention-the-big-idea), attention went from decoder to encoder. "Self" means the sequence attends to *itself*.)

**Example:** "The **animal** didn't cross the street because **it** was too tired."

To understand "it", the model must work out that "it" refers to "animal" (not "street"). Self-attention lets the representation of "it" pull in information from "animal".

Change one word ("...because it was too **wide**") and "it" should now attend to "street". Attention is **dynamic**: computed fresh for each input.

**After self-attention, each token's vector is a context-aware blend** of information from the whole sentence. That's how "bank" gets different vectors in different sentences ([contextual embeddings, file 18](18-nlp-fundamentals.md#13-contextual-embeddings)).

### Worked picture: what "it" might attend to

Illustrative attention weights for the word **"it"** in the sentence above (made-up numbers to show the idea; a real model gives different values):

| Token | The | animal | didn't | cross | the | street | because | it | was | too | tired |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Weight | 0.02 | **0.60** | 0.03 | 0.04 | 0.02 | 0.15 | 0.05 | 0.05 | 0.02 | 0.01 | 0.01 |

The weights add up to 1.00. The new vector for "it" is a blend: 60% flavoured by "animal", 15% by "street", and small amounts from the rest. Change "tired" to "wide" and a trained model would shift weight from "animal" to "street".

```
 The animal didn't cross the street because it was too tired
       ▲                        ▲              │
       │          (15%)         │              │
       └────────────────────────┴──────────────┘
                 (60% to "animal")      "it" gathers information
```

**Analogy:** a staff meeting. Each person (token) asks a question to the room, listens to the answers, and then leaves the meeting with a better understanding of their own part. The word "self" means everyone in the meeting is from the same document.

**Where you'll meet it in real work:** resolving pronouns in translation, deciding that "bank" means a river bank in a travel blog, and finding the sentence in a long contract that a question refers to.

**Common mistakes:**
- Treating attention weights as a full explanation of what the model "understood". They show how information was mixed, but they are not proof of reasoning.
- Mixing up self-attention (a sequence attends to itself) and cross-attention (one sequence attends to another, section 9).

**Exam angle:** "What does self-attention compute?" A context-aware representation of each token as a weighted combination of all tokens in the same sequence. In a decoder-only model the weights over future tokens are blocked by a causal mask.

> **සිංහලෙන්:** Self-attention කියන්නේ වාක්‍යයක හැම වචනයක්ම අනිත් වචන දිහා බලලා, තමන්ට වැදගත් ඒවායින් තොරතුරු අරගන්නා විදිහ. "The animal didn't cross the street because it was too tired" කියන එකේ "it" කියන්නේ කාටද කියලා දැනගන්න "animal" දිහා බලන්න ඕනේ. උදාහරණයක් විදිහට "it" ගේ attention weights වලින් 0.60ක් "animal" ට, 0.15ක් "street" ට, ඉතුරු ටික අනිත් වචන වලට යනවා, මුළු එකතුව 1යි. "tired" වෙනුවට "wide" දැම්මොත් weight එක "street" පැත්තට යනවා. ඒ කියන්නේ attention එක හැම input එකකටම අලුතෙන් ගණනය වෙන දෙයක්. ඒත් මේ weights වලින් model එකේ හිතන විදිහ සම්පූර්ණයෙන්ම ඔප්පු වෙනවා කියලා හිතන්න එපා.

---

## 5. Query, Key, Value

**Why it exists:** if a word used its own vector for everything (matching, being found, and giving information), it would be forced to play three different roles at once. Splitting into Query, Key and Value gives each role its own learned view of the same word.

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

### Worked example: making q, k and v from one token

Let a token have x = [1, 2] and tiny learned matrices (d_model = d_k = 2):

- W_Q = [[1, 0], [0, 1]] (identity, keeps x unchanged)
- W_K = [[0, 1], [1, 0]] (swaps the two numbers)
- W_V = [[2, 0], [0, 2]] (doubles everything)

Row vector times matrix:
- q = x·W_Q = [1×1 + 2×0, 1×0 + 2×1] = **[1, 2]**
- k = x·W_K = [1×0 + 2×1, 1×1 + 2×0] = **[2, 1]**
- v = x·W_V = [1×2 + 2×0, 1×0 + 2×2] = **[2, 4]**

Same token, three different vectors. In a real model these matrices are learned, with thousands of entries, so the three views can be very different.

**Second analogy (online shopping):** on Daraz you type "cheap phone for a student" in the search bar: that is the **Query**. Every product listing has a title and tags that the search can match: those are the **Keys**. When you click a product, you get its full page: that is the **Value**. The search compares your query with the keys, and the best matches hand over their pages.

```
token x ──► W_Q ──► q  "what am I looking for?"
        ├─► W_K ──► k  "what can I be matched on?"
        └─► W_V ──► v  "what do I hand over if chosen?"
```

**Where you'll meet it in real work:** these three matrices are the biggest part of a Transformer's attention parameters, and LoRA fine-tuning ([file 21](21-training-finetuning-alignment.md)) often adds small updates to exactly W_Q and W_V.

**Common mistakes:**
- Thinking Q, K and V come from three different inputs. In self-attention they all come from the **same** x, just multiplied by different matrices.
- Forgetting that q and k must have the same length (d_k), because we take their dot product. v can differ in principle.

**Exam angle:** "Which vectors are compared to produce the attention scores?" Queries and keys. "Which vectors are averaged?" Values.

> **සිංහලෙන්:** හැම token එකකින්ම vectors තුනක් හදනවා: Query, Key, Value. Query කියන්නේ "මම හොයන්නේ මොකක්ද" කියන ප්‍රශ්නය, Key කියන්නේ "මා ගාව තියෙන්නේ මේ වගේ දෙයක්" කියන label එක, Value කියන්නේ තෝරගත්තාම දෙන ඇත්ත තොරතුරු. Daraz එකේ "cheap phone for a student" කියලා search කරනකොට ඒක Query එක, හැම product එකකම title සහ tags Keys, product එක open කළාම ලැබෙන page එක Value. හැම token එකකම x vector එක W_Q, W_K, W_V කියන matrices තුනෙන් වෙන වෙනම ගුණ කරලා q, k, v ගන්නවා, උදාහරණයක් විදිහට x = [1, 2] නම් q = [1, 2], k = [2, 1], v = [2, 4] වෙන්න පුළුවන්. තුනම එන්නේ එකම x එකෙන්.

---

## 6. Scaled dot-product attention

**Why it exists:** we need a number that says "how relevant is token j to token i?" and a way to turn those numbers into weights that add up to 1. The dot product measures relevance, softmax makes the weights, and the weighted sum of values gives the result.

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

### Checking one more row by hand: the token "love"

From the same example, Q·Kᵀ/√2 for row "love" is [0, 0.707, 0.707].
- e⁰ = 1, e^0.707 = 2.028, e^0.707 = 2.028; sum = 5.056
- weights = [1/5.056, 2.028/5.056, 2.028/5.056] = **[0.198, 0.401, 0.401]** (they add to 1.000)
- output = 0.198×[1, 0] + 0.401×[0, 2] + 0.401×[3, 1]
- first number: 0.198 + 0 + 1.203 = **1.401**
- second number: 0 + 0.802 + 0.401 = **1.203**
- so "love" becomes **[1.401, 1.203]**

All three rows are computed independently from the same Q, K and V. That is why the whole thing can be one matrix multiplication (section 7).

### The four steps in a table

| Step | Operation | Why |
|---|---|---|
| 1 | scores = Q·Kᵀ | how well does each query match each key? |
| 2 | scores ÷ √d_k | keep numbers small so softmax is not saturated |
| 3 | softmax per row | turn scores into weights that add up to 1 |
| 4 | weights · V | mix the value vectors by those weights |

With d_k = 64 you divide by √64 = 8; with d_k = 128 by about 11.3.

**Where you'll meet it in real work:** this one formula runs billions of times when an LLM answers a single question. FlashAttention (section 19) is a faster way to compute exactly this.

**Common mistakes:**
- Forgetting the transpose on K (shapes would not even match).
- Applying softmax down the columns instead of along each row. Each **row** (one query) must sum to 1.
- Forgetting the √d_k scaling and wondering why training is unstable.

**Exam angle:** you may be asked to write the formula, to explain √d_k, or to do a small calculation like the one in Check yourself Q4.

> **සිංහලෙන්:** Attention ගණනය කරන්නේ පියවර හතරකින්: (1) Query සහ Key dot product කරලා score එකක් ගන්නවා, (2) ඒක √d_k වලින් බෙදනවා ඒ score ඕනෑවට වඩා ලොකු වෙන එක නවත්වන්න, (3) softmax දාලා weights වලට හරවනවා, එතකොට එකතුව 1යි, (4) ඒ weights වලින් Values වල weighted sum එක ගන්නවා. උදාහරණයක් විදිහට "love" token එකේ scores [0, 0.707, 0.707] නම් softmax කළාම weights [0.198, 0.401, 0.401] වෙනවා, ඒ weights වලින් values මිශ්‍ර කළාම අලුත් vector එක [1.401, 1.203] වෙනවා. d_k = 64 නම් √64 = 8 න් බෙදනවා. බෙදුවේ නැත්නම් softmax එක එක token එකක් පැත්තට හැරිලා ඉගෙනීම නතර වෙනවා.

---

## 7. Matrix form and shapes

**Why it exists:** one token at a time would be slow. Writing attention as matrix multiplication lets a GPU process all tokens and all heads in one go, which is why Transformers train so fast.

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

### Worked example: following the shapes

Let n = 4 tokens, d_model = 8, a single head with d_k = 8.

| Step | Shapes multiplied | Result |
|---|---|---|
| Q = X·W_Q | (4 × 8) · (8 × 8) | (4 × 8) |
| K, V (the same way) | | (4 × 8) each |
| Kᵀ | transpose of (4 × 8) | (8 × 4) |
| Q·Kᵀ | (4 × 8) · (8 × 4) | **(4 × 4)** = 16 scores |
| weights · V | (4 × 4) · (4 × 8) | (4 × 8) |

The output has the same shape as the input X, which is what lets blocks be stacked.

```
  Q (n × d_k)   ×   Kᵀ (d_k × n)   =   scores (n × n)
  ┌───────┐        ┌───────────┐       ┌───────┐
  │       │   ×    │           │   =   │ n × n │
  └───────┘        └───────────┘       └───────┘
```

**Memory of the score matrix.** For n = 2,000 tokens and 32 heads, one layer holds 2,000 × 2,000 × 32 = 128 million scores. In 16-bit numbers (2 bytes) that is **256 MB for a single layer and a single sequence**, if you stored it all. That is exactly the cost FlashAttention avoids.

**Where you'll meet it in real work:** when a PyTorch program crashes with "shape mismatch" or "CUDA out of memory" while you experiment with long inputs.

**Common mistakes:**
- Mixing up the order of the batch, heads and token dimensions.
- Forgetting that the score tensor has an n × n part, so doubling the input quadruples it.

**Exam angle:** know the shape of Q·Kᵀ (n × n) and why it makes attention O(n²).

> **සිංහලෙන්:** Attention ගණනය කරන්නේ token එකින් එක නෙවෙයි, matrix multiplication එකකින් ඔක්කොම tokens එකපාර. ඒ නිසා GPU එකකට ඉක්මනින් කරන්න පුළුවන්. Tokens 4ක් සහ d_model = 8 නම් Q, K, V හැම එකම (4 × 8) matrices. Q ගුණ කරනවා Kᵀ (8 × 4) එක්ක, එතකොට (4 × 4) scores table එකක් එනවා, ඒ කියන්නේ scores 16ක්. ඒකට V (4 × 8) ගුණ කළාම (4 × 8) output එක ආයෙත් input එකේ හැඩයමයි. n × n කොටස නිසා tokens දෙගුණ කළොත් scores හතර ගුණයක් වෙනවා, tokens 2,000ක් සහ heads 32ක් තියෙනවා නම් එක layer එකක scores මිලියන 128ක්, 16-bit වලින් 256 MB.

---

## 8. Masking

**Why it exists:** a text generator must predict the next word using only the words before it. If it could peek at the answer during training it would learn nothing useful. Masks block the connections that should not exist.

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

### Worked example: a masked softmax

Token 2 ("cat") in a 3-token sentence has raw scores [1.0, 2.0, 0.5] against tokens 1, 2, 3. Token 3 is in the future, so its score becomes −∞:

[1.0, 2.0, **−∞**]

- e^1.0 = 2.718, e^2.0 = 7.389, e^(−∞) = 0
- sum = 10.107
- weights = [2.718/10.107, 7.389/10.107, 0] = **[0.269, 0.731, 0.000]**

The future token gets exactly zero weight, and the rest are renormalised to add up to 1.

**Training signal count.** For a 5-token sentence, one forward pass with the causal mask gives **4** next-token predictions at once (positions 1 to 4 predict tokens 2 to 5). In the 4 × 4 mask example above, 6 of the 16 cells are blocked and 10 are visible.

| | Causal mask | Padding mask |
|---|---|---|
| Blocks | future tokens | padding tokens |
| Used in | decoder-only (GPT) and decoders | any model that batches sequences of different lengths |
| Why | stop cheating on next-token prediction | stop attending to meaningless filler |

**Analogy:** like a cricket commentator who must describe the match ball by ball without knowing what happens next. He can only look at what has already happened.

**Where you'll meet it in real work:** when you batch customer messages of different lengths for BERT, the tokenizer returns an `attention_mask`. Forgetting to pass it silently gives slightly wrong results.

**Common mistakes:**
- Adding a causal mask to an encoder like BERT. BERT is meant to look both ways.
- Setting masked scores to 0 instead of −∞. A score of 0 still gets a positive weight after softmax (e⁰ = 1).

**Exam angle:** "Why does a decoder need a causal mask?" To prevent the model seeing future tokens during training. "What does the attention mask do?" It ignores padding.

> **සිංහලෙන්:** Masking දෙවර්ගයක් තියෙනවා. Causal mask එකෙන් අනාගත tokens වලට attention දෙන එක වහනවා, නැත්නම් "ඊළඟ වචනය අනුමාන කරන්න" කියන විභාගෙදී answer sheet එක බලනවා වගේ වැඩක් වෙනවා. Mask කරන්නේ score එක −∞ කරලා, ඒ නිසා softmax එකෙන් පස්සේ weight එක හරියටම 0. උදාහරණයක් විදිහට scores [1.0, 2.0, −∞] නම් weights [0.269, 0.731, 0] වෙනවා. Padding mask එකෙන් batch එකක කෙටි වාක්‍ය පිරවීමට දාපු හිස් tokens ignore කරනවා. Tokens 5ක වාක්‍යයක් එක පාරක් model එකට දුන්නාම ඊළඟ-token අනුමාන 4ක් එකම වෙලාවේ train වෙනවා, ඒක තමයි Transformers වේගයෙන් train වෙන එක හේතුවක්.

---

## 9. Multi-head attention

**Why it exists:** one attention can only mix tokens in one way at a time. But a sentence has many kinds of relationships at once: grammar, pronouns, topic, nearby words. Running several attentions side by side lets the model watch for several of them together.

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

### Worked example: sizes and parameter count

BERT-base style: d_model = 768, h = 12 heads.
- each head: d_k = 768 / 12 = **64**
- one head's W_Q is 768 × 64 = 49,152 numbers; Q, K and V together for one head = 3 × 49,152 = 147,456
- all 12 heads = 12 × 147,456 = **1,769,472** (the same as 3 × 768²: one big matrix cut into slices)
- output matrix W_O = 768 × 768 = 589,824
- total attention parameters = 1,769,472 + 589,824 = **2,359,296 = 4 × 768²** (this is the 4d² from section 18)

So 12 heads cost the same as one big head, but think in 12 different ways.

**KV cache saving with GQA.** With 32 query heads and 8 key/value heads, each K/V head is shared by 32 / 8 = 4 query heads, so the KV cache is **4 times smaller** than full multi-head attention. MQA (1 shared KV head) would make it 32 times smaller, at some cost in quality.

**Analogy:** reading the same exam paper with a team: one person checks grammar, another checks which pronoun belongs to whom, another checks the topic. Then the notes are merged.

**Honest caution:** it is common to say "head 3 handles grammar", but heads are not assigned jobs by a human. Researchers find specialisations after training (like induction heads) and many heads do not have a neat single role.

**Where you'll meet it in real work:** when a model card says "32 layers, 32 heads, 8 KV heads", the 8 KV heads tell you the model uses GQA and will use less memory when serving long chats.

**Common mistakes:**
- Thinking each head sees a different part of the sentence. All heads see all tokens; they differ in their learned projections.
- Believing more heads always means better quality.

**Exam angle:** "What does multi-head attention do after computing each head?" Concatenates the heads and multiplies by W_O. "What does GQA reduce?" The KV cache size during generation.

> **සිංහලෙන්:** Multi-head attention කියන්නේ එකම attention ගණනය head කිහිපයකින් එකට කරන එක. හැම head එකකටම තමන්ගේම W_Q, W_K, W_V තියෙන නිසා වෙනස් විදිහේ සම්බන්ධතා අල්ලගන්න පුළුවන්. d_model = 768 සහ heads 12ක් නම් හැම head එකකම d_k = 768/12 = 64. Heads 12ම එකතු කළාම ගණන් කිරීම එක ලොකු head එකක් වගේම, ඊට පස්සේ ඒවා ඔක්කොම ඇලෙව්වාම W_O එකෙන් මිශ්‍ර කරනවා. පන්තියේ කණ්ඩායමක් එකම ප්‍රශ්න පත්තරය කියවනවා වගේ: එක්කෙනෙක් grammar බලනවා, තව කෙනෙක් pronoun බලනවා. ඒත් "මේ head එක grammar බලනවා" කියලා කවුරුවත් කලින් නියම කරන්නේ නෑ, ඒක training එකෙන් පස්සේ තමයි පේන්නේ. GQA එකේ query heads 32ක් kv heads 8ක් බෙදාගන්නවා නම් KV cache එක 4 ගුණයක් පොඩියි.

---

## 10. The feed-forward network

**Why it exists:** attention only *mixes* information between tokens. Mixing alone does not give the model enough power to transform that information into new features. The FFN gives each token a private thinking step.

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

### Worked example: expand, activate, shrink

Use ReLU instead of GELU to keep the arithmetic easy. Let x = [1, −2] (d_model = 2) and expand to 3 hidden units:
- W₁ = [[1, −1, 0], [0, 1, 1]]
- x·W₁ = [1×1 + (−2)×0, 1×(−1) + (−2)×1, 1×0 + (−2)×1] = [1, −3, −2]
- ReLU (negatives become 0) → h = **[1, 0, 0]**
- W₂ = [[1, 0], [0, 1], [1, 1]]
- h·W₂ = [1×1 + 0 + 0, 1×0 + 0 + 0] = **[1, 0]**

The input had 2 numbers, the hidden layer 3, the output 2 again. Real models expand by 4×.

**Size.** For d_model = 768: hidden = 3,072. Parameters = 768 × 3,072 + 3,072 × 768 = 2 × 2,359,296 = **4,718,592 ≈ 4.7M**, which equals 8d² (8 × 589,824). The FFN holds about two-thirds of each block's parameters; attention holds the other third.

**Analogy:** in a meeting (attention) everybody exchanges information. Then everyone goes back to their own desk (FFN) to think it over alone, using the same method for every person.

| | Attention | FFN |
|---|---|---|
| Moves information | between tokens | none, each token alone |
| Share of block parameters | ~1/3 (4d²) | ~2/3 (8d²) |
| Typical role | gather context | process, recall facts |

**Where you'll meet it in real work:** Mixture-of-Experts models (file 21) replace one big FFN with many smaller ones and pick a few per token. The FFN is where almost all of the "extra" parameters of those models live.

**Common mistakes:**
- Thinking the FFN looks at neighbouring tokens. It treats each position separately.
- Forgetting the hidden size: the 4× expansion is where most parameters go.

**Exam angle:** "Which part of the block holds most of the parameters and much of the stored knowledge?" The feed-forward network.

> **සිංහලෙන්:** Attention එකෙන් tokens අතර තොරතුරු හුවමාරු කළාට පස්සේ හැම token එකක්ම තනියම Feed-Forward Network (FFN) එකක් හරහා යනවා. ඒක සරල MLP එකක්: vector එක 4 ගුණයකට පළල් කරනවා (768 → 3072), activation එකක් දානවා, ආයෙත් පොඩි කරනවා (3072 → 768). Meeting එකක් වගේ: attention එක meeting එක, හැමෝම අදහස් හුවමාරු කරනවා, FFN එක ඊට පස්සේ හැමෝම තමන්ගේ මේසෙට ගිහින් තනියම හිතන එක. FFN එකේ parameters 8d² = 8 × 768² ≈ 4.7 මිලියනයක් තියෙනවා, ඒක block එකේ parameters වලින් දෙකෙන් තුනක් විතර. Model එකේ කරුණු දැනුම ගොඩක් තියෙන්නේ මේ FFN එකේ කියලා researchers ලා හිතනවා.

---

## 11. Residuals and normalisation

**Why it exists:** a Transformer has dozens of layers stacked on top of each other. In such a deep stack, learning signals fade (vanishing gradients) and numbers can drift to huge or tiny values. Residual connections keep a clean path for gradients, and normalisation keeps the numbers tame.

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

### Worked example: residual plus normalisation

Let a token vector be x = [2.0, −1.0] and the attention sub-layer produce [0.3, 0.5].

**Residual:** x + sublayer = [2.0 + 0.3, −1.0 + 0.5] = **[2.3, −0.5]**. Notice that the old information is kept and only a small update is added: "new = old + change".

**LayerNorm** on [2.3, −0.5] (ignoring the tiny epsilon and the learned scale/shift):
- mean = (2.3 + (−0.5)) / 2 = **0.9**
- deviations = [1.4, −1.4]
- variance = (1.4² + 1.4²) / 2 = 1.96, standard deviation = **1.4**
- normalised = [1.4/1.4, −1.4/1.4] = **[1, −1]**

Whatever the scale of the numbers, they come out centred at 0 with spread 1.

**Analogy:** you never throw away the old report. You keep it and clip new notes onto it (residual). Then everyone rewrites the report in the same standard format so it stays readable (normalisation).

```
Post-norm:  x ──► Sublayer ──► (+) ──► Norm ──►     (the norm sits ON the main path)
             └───────────────────┘

Pre-norm:   x ──► Norm ──► Sublayer ──► (+) ──►     (the main path x → (+) is untouched)
             └──────────────────────────┘
```

**Where you'll meet it in real work:** if you ever fine-tune an LLM and the loss suddenly becomes NaN, unstable normalisation or a too-large learning rate is a first suspect. Llama-style models use RMSNorm, a cheaper normalisation.

**Common mistakes:**
- Mixing up pre-norm and post-norm. Modern LLMs use **pre-norm**.
- Thinking the residual adds extra parameters. It is just an addition and has none.

**Exam angle:** "Why do residual connections help train deep Transformers?" They give gradients a direct path through every layer. "Which normalisation do Llama models use?" RMSNorm.

> **සිංහලෙන්:** Transformer එකක layers දුසිම් ගණනක් තියෙනවා, ඒ නිසා දෙකක් ඕනේ. Residual connection එකෙන් හැම කොටසකම input එක output එකට ආයෙත් එකතු කරනවා: "අලුත් = පරණ + වෙනස". x = [2.0, −1.0] ට attention එකෙන් [0.3, 0.5] ආවොත් ප්‍රතිඵලය [2.3, −0.5], පරණ තොරතුරු නැති වුණේ නෑ. Layer norm එකෙන් vector එකේ අංක සමාන පරාසයකට ගේනවා: [2.3, −0.5] ගත්තාම mean 0.9, standard deviation 1.4 නිසා ප්‍රතිඵලය [1, −1]. අද models වල norm එක දාන්නේ sub-layer එකට කලින් (pre-norm), ඒ නිසා ප්‍රධාන ධාරාව සම්පූර්ණයෙන්ම පිරිසිදුයි, gradients layers 80ක් හරහාත් ගලනවා.

---

## 12. The full Transformer block

**Why it exists:** we now have all the ingredients (attention, FFN, residuals, norms). A block is the standard recipe that combines them, and because the recipe keeps input and output the same shape, you can stack as many copies as you like.

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

### Worked example: following a tensor through one block

Take 4 tokens and d_model = 768. The shape never changes:

| Stage | Shape |
|---|---|
| Input x | (4 × 768) |
| Norm | (4 × 768) |
| Masked multi-head attention | (4 × 768) |
| Residual add (x + attention) | (4 × 768) |
| Norm | (4 × 768) |
| FFN (inside: 4 × 3072) | (4 × 768) |
| Residual add | (4 × 768) |
| Output → next block | (4 × 768) |

With 12 such blocks (GPT-2 small), the 4 × 768 table is refined 12 times, each time reading from and writing to the residual stream.

**A mental model.** The residual stream is a conveyor belt carrying one vector per token. Each block is a worker standing beside the belt: first the attention worker reads from the other tokens and drops a small update on the belt, then the FFN worker reads this token and drops another update.

**What the layers tend to do:** early layers handle word identity and local syntax, middle layers build meaning, late layers get ready for the next-token choice. This is a tendency from research, not a strict rule.

**Where you'll meet it in real work:** "a 7B model with 32 layers" means 32 copies of this block. Making a model deeper (more blocks) or wider (bigger d_model) is the main way models are scaled.

**Common mistakes:**
- Thinking each block has different shapes. All blocks in a stack are identical in shape (but not in learned values).
- Forgetting the final norm after the last block.

**Exam angle:** be able to draw or list a decoder block (norm, masked self-attention, residual, norm, FFN, residual) and state that the number of layers is a key size dimension.

> **සිංහලෙන්:** Transformer block එකක ප්‍රධාන කොටස් දෙකයි: masked multi-head attention එකයි FFN එකයි. දෙකටම residual connection එකයි norm එකයි තියෙනවා. Block එකට යන tensor එකේ හැඩය (tokens 4 × 768) ඒ විදිහමයි එළියට එන්නේ, ඒ නිසා blocks එක උඩ එක ගොඩගහන්න පුළුවන්. GPT-2 small එකේ blocks 12ක්, Llama-3-8B එකේ 32ක්, 70B එකේ 80ක්. Residual stream එක conveyor belt එකක් වගේ, හැම block එකක්ම ඒකෙන් කියවලා පොඩි update එකක් ආපහු දානවා. මුල් layers වල word එක සහ ළඟ grammar, මැද layers වල තේරුම, අන්තිම layers වල ඊළඟ token එක තෝරන්න සූදානම් වීම වෙන්න ගොඩක් වෙලාවට සිද්ධ වෙනවා.

---

## 13. The output head

**Why it exists:** after all the mixing, each position holds a rich vector, but the model must give a *decision*: which token comes next? The output head turns the vector into a score for every token in the vocabulary.

After the last block (and a final norm), each position's vector is projected to the vocabulary:

```
logits = h · W_vocab        shape: (n × vocab_size)
probabilities = softmax(logits)
```

This **LM head** gives, at every position, a probability for every token in the vocabulary as the **next** token ([file 20](20-how-llms-work.md)).

**Weight tying:** many models reuse the input embedding matrix (transposed) as W_vocab, which saves parameters (vocab × d_model can be hundreds of millions).

For classification models (like BERT for sentiment), the head is instead a small classifier on top of one special token's vector (section 15).

### Worked example: from logits to probabilities

Suppose for the prompt "The cat sat on the" the model produces logits for three candidate tokens:

| Token | Logit | e^logit | Probability |
|---|---|---|---|
| mat | 2.0 | 7.389 | 7.389 / 11.212 = **0.659** |
| rug | 1.0 | 2.718 | 2.718 / 11.212 = **0.242** |
| dog | 0.1 | 1.105 | 1.105 / 11.212 = **0.099** |
| sum | | 11.212 | 1.000 |

(A real model does this for all 50,000 to 200,000 tokens at once.) Which token is actually chosen from this distribution depends on the decoding method (file 20).

**Sizes.** The logits for a 1,000-token prompt with a 128,000-token vocabulary form a (1,000 × 128,000) table, that is 128 million numbers. During text generation only the **last** position's row is needed, because that is the one that predicts the next token.

**Weight tying saves memory:** the LM head matrix is the embedding table turned on its side. For GPT-2 small that avoids a second copy of 50,257 × 768 ≈ **38.6M** parameters.

**Where you'll meet it in real work:** the same logits are what you inspect when you ask an API for "logprobs", and what temperature, top-k and top-p sampling operate on.

**Common mistakes:**
- Saying "the model outputs a word". It outputs a probability for every word, and a separate step picks one.
- Forgetting to apply softmax to logits before treating them as probabilities.

**Exam angle:** "What are logits?" Raw, unnormalised scores for each vocabulary token before softmax. "What does weight tying do?" Reuses the embedding matrix as the output projection to save parameters.

> **සිංහලෙන්:** අන්තිම block එකෙන් පස්සේ හැම position එකකම vector එක vocabulary එකේ හැම token එකකටම score එකක් (logit) බවට හරවනවා. ඊට පස්සේ softmax දාලා probabilities ගන්නවා. උදාහරණයක් විදිහට "The cat sat on the" ට පස්සේ logits mat = 2.0, rug = 1.0, dog = 0.1 නම් probabilities mat = 0.659, rug = 0.242, dog = 0.099. ඒ කියන්නේ model එක "වචනයක්" දෙන්නේ නෑ, හැම වචනයකටම probability එකක් දෙනවා, ඊට පස්සේ වෙනම පියවරකින් එකක් තෝරනවා. Weight tying කියන්නේ input embedding table එකම output එකටත් පාවිච්චි කරන එක, GPT-2 එකේ parameters 38.6 මිලියනයක් ඉතිරි වෙනවා.

---

## 14. Three families

**Why it exists:** different jobs want different attention patterns. Understanding a text (classifying it) benefits from seeing both sides of every word. Writing text must not look ahead. Translating needs both: fully read the source, then write the target. That gives three families.

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

### Worked example: who can see whom?

For a 4-token sentence, count the (token, token) pairs where one token can look at another (including itself):
- **Encoder-only (bidirectional):** every token sees all 4, so 4 × 4 = **16** pairs.
- **Decoder-only (causal):** token 1 sees 1, token 2 sees 2, token 3 sees 3, token 4 sees 4, so 1 + 2 + 3 + 4 = **10** pairs.

**Choosing a family for real jobs**

| Job | Good fit | Reason |
|---|---|---|
| Sort 100,000 Daraz reviews into positive / negative cheaply | Encoder-only (BERT-like) | needs understanding only, small and fast |
| Chatbot that writes a long answer for a customer | Decoder-only (GPT / Llama style) | generates text one token at a time |
| Translate English letters into Sinhala, or summarise news | Encoder-decoder (T5 / BART) or a decoder-only LLM | transforms one text into another |
| Embeddings for semantic search | Encoder-only | gives one vector per sentence |

**Analogy:** encoder-only is a teacher who reads the entire exam script and labels it "maths question". Decoder-only is a grandmother telling a story, choosing each next word from what she has already said. Encoder-decoder is a translator who first reads the whole English letter and then writes the Sinhala version while glancing back at the original.

**Where you'll meet it in real work:** picking the right model for a job decides the cost. A small BERT classifier can cost a fraction of an LLM call for a simple labelling task.

**Common mistakes:**
- Thinking "Transformer" means "GPT". BERT and T5 are Transformers too.
- Believing decoder-only models cannot do classification. They can, by prompting, but a fine-tuned encoder is often cheaper.

**Exam angle:** a favourite table question. Match: BERT = encoder-only, bidirectional, masked language modelling; GPT = decoder-only, causal, next-token prediction; T5 = encoder-decoder, text-to-text, span corruption.

> **සිංහලෙන්:** Transformer පවුල් තුනක් තියෙනවා. Encoder-only (BERT): හැම token එකක්ම දෙපැත්තටම බලනවා, ඒ නිසා text එක තේරුම් ගන්න (classification, search, embeddings) හොඳයි. Decoder-only (GPT, Claude, Llama): causal mask එක නිසා කලින් tokens විතරක් බලලා ඊළඟ token එක අනුමාන කරනවා, ඒ නිසා text ලියන්න හොඳයි, අද chat LLMs ඔක්කොම වගේ මේ වර්ගයේ. Encoder-decoder (T5): encoder එක input එක සම්පූර්ණයෙන් කියවනවා, decoder එක cross-attention වලින් ඒක බලාගෙන output එක ලියනවා, translation වගේ වැඩ වලට. Tokens 4ක වාක්‍යයක bidirectional එකේ බලන ජෝඩු 16ක්, causal එකේ 1 + 2 + 3 + 4 = 10ක්. Daraz reviews ලක්ෂයක් වර්ග කරන්න පොඩි BERT එකක් ලාභයි, chatbot එකකට decoder-only.

---

## 15. BERT

**Why it exists:** before BERT, a language model like GPT-1 read only left to right, so it never knew what came after a word. BERT was built to use both sides of every word, which makes it great at understanding, and it can be fine-tuned with very little labelled data.

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

### Worked example: how many tokens get masked?

Take 1,000 tokens of training text. BERT selects 15%: **150** tokens. Of those 150:
- 80% become `[MASK]`: **120** tokens
- 10% become a random other token: **15** tokens
- 10% stay unchanged: **15** tokens

The model must predict the original token for all 150. Because it never knows which tokens were disguised, it cannot rely on seeing `[MASK]`, which never appears at fine-tuning time.

**Parameter check (about):** BERT-base has 12 layers of 12 × 768² ≈ 7.08M each = about 84.9M, plus an embedding table of roughly 30,522 × 768 ≈ 23.4M and some small extras. That lands near the quoted **110M**.

**The classification head is tiny.** For a 2-class sentiment task the head is a linear layer from the 768-number [CLS] vector to 2 outputs: 768 × 2 + 2 = **1,538** new parameters. The other 110M parameters are the already-pretrained body.

```
[CLS] this movie was great [SEP]
  │
  └─► final vector (768 numbers) ─► Linear(768 → 2) ─► softmax ─► positive 0.97, negative 0.03
```

**Where you'll meet it in real work:** BERT-family encoders power much of web search, spam and toxicity filters, and the embedding models behind RAG.

**Common mistakes:**
- Thinking BERT generates text well. It was not trained to continue text.
- Believing NSP is still essential. RoBERTa dropped it and did better.
- Forgetting that the BERT classification head starts random until you fine-tune it.

**Exam angle:** MLM with 15% masking, [CLS] for classification, bidirectional encoder, and variants: RoBERTa (more data, no NSP), DistilBERT (smaller, via distillation).

> **සිංහලෙන්:** BERT කියන්නේ Google 2018 හදපු encoder-only model එකක්. Train කරන්නේ Masked Language Modelling වලින්: tokens වලින් 15%ක් හංගලා දෙපැත්තේම වචන බලලා ඒවා අනුමාන කරනවා. Tokens 1,000කින් 15% = 150ක් තෝරනවා, ඒවායින් 120ක් [MASK] කරනවා, 15ක් random token එකකින් මාරු කරනවා, 15ක් එහෙමම තියනවා. [CLS] කියන විශේෂ token එකේ අන්තිම vector එක මුළු වාක්‍යයේම සාරාංශය විදිහට classification වලට පාවිච්චි කරනවා. 2-class sentiment එකකට අලුතෙන් එකතු වෙන්නේ 768 × 2 + 2 = 1,538 parameters විතරයි, ඉතිරි 110 මිලියනය කලින්ම train වෙලා තියෙන්නේ. BERT text ලියන්න හදපු එකක් නෙවෙයි, තේරුම් ගන්න හදපු එකක්.

---

## 16. GPT

**Why it exists:** GPT bet on one simple, cheap-to-supervise task: predict the next token. Text itself supplies the answer for free, so any amount of text becomes training data, and the same recipe scales up to whatever size you can afford.

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

### Worked example: generating one token at a time

Prompt: "The cat sat". The model returns probabilities for the next token (illustrative):

| Step | Context so far | Top choices | Pick |
|---|---|---|---|
| 1 | The cat sat | on 0.62, down 0.15, in 0.08 | on |
| 2 | The cat sat on | the 0.70, a 0.20 | the |
| 3 | The cat sat on the | mat 0.45, sofa 0.18, floor 0.15 | mat |

Each chosen token is added to the context and the loop repeats until a stop token. That is all that "generation" means.

**Training signals in one pass.** A 1,000-token passage supplies **999** next-token training examples at once (thanks to the causal mask). A model trained on 1 trillion tokens has seen about 1 trillion such predictions.

**Memory for the biggest GPT-3.** 175 billion parameters × 2 bytes (16-bit) = **350 GB** just for the weights, far more than one GPU holds, so such models are split across many GPUs.

**Analogy:** you have heard the first half of a Sinhala proverb and your brain automatically supplies the rest. A GPT does that for every kind of text, billions of times, and in doing so it absorbs grammar, facts and some reasoning.

**Where you'll meet it in real work:** ChatGPT, Claude, Gemini, Llama-based assistants, GitHub Copilot, and any summariser or customer-support bot built on an LLM API.

**Common mistakes:**
- Treating the base GPT as a helpful assistant. Chat behaviour comes from later instruction tuning and RLHF (file 21).
- Assuming "bigger parameter count" always means "better". Data quality and training matter too.

**Exam angle:** GPT = decoder-only, pretrained with next-token prediction; GPT-3 showed in-context / few-shot learning; ChatGPT added instruction tuning and RLHF.

> **සිංහලෙන්:** GPT කියන්නේ decoder-only Transformer එකක්, train කරන්නේ ඊළඟ token එක අනුමාන කරන්න. Text එක ඇතුළේම උත්තරේ තියෙන නිසා කිසිම කෙනෙක් label කරන්න ඕනේ නෑ, ඒ නිසා internet එකේ තියෙන text ඔක්කොම training data වෙනවා. "The cat sat" දුන්නාම "on" 0.62, "down" 0.15 වගේ probabilities දෙනවා, එකක් තෝරලා context එකට එකතු කරලා ආයෙත් එකම වැඩේ කරනවා. ඒක තමයි "generate කිරීම" කියන්නේ. Tokens 1,000ක text එකකින් එක පාරටම ඊළඟ-token අනුමාන 999ක් train වෙනවා. GPT-3 එකේ parameters බිලියන 175ක්, 2 bytes බැගින් බර 350 GB, ඒ නිසා GPU ගොඩක් පාවිච්චි කරන්න වෙනවා. Chat එකට හොඳ වෙන්නේ instruction tuning සහ RLHF වලින් පස්සේ.

---

## 17. T5 and BART

**Why it exists:** many jobs are "text in, different text out": translate, summarise, rewrite. T5 and BART use a full encoder-decoder so that the whole input is read bidirectionally before a single output word is written.

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

### Worked example: span corruption, step by step

Original: "The monsoon rains flooded the road to Kandy."

Choose two spans to remove: "rains flooded" and "to Kandy".
- Corrupted input to the encoder: `The monsoon <X> the road <Y> .`
- Target the decoder must write: `<X> rains flooded <Y> to Kandy <Z>`

The model only has to write the missing pieces, not the whole sentence, which keeps training cheap.

**T5 prefixes.** One model, many jobs, chosen by the text prefix:
- `translate English to German: That is good.` → `Das ist gut.`
- `summarize: <article>` → a short summary

**Comparing the four models**

| | BERT | GPT | T5 | BART |
|---|---|---|---|---|
| Family | encoder-only | decoder-only | encoder-decoder | encoder-decoder |
| Pretraining | mask words, predict them | predict next token | span corruption | corrupt text, reconstruct it |
| Natural use | classify, embed | chat, write | any text-to-text task | summarise, rewrite |

**Where you'll meet it in real work:** news summarisation (BART, such as `facebook/bart-large-cnn` used in the Hugging Face pipeline in file 18), and FLAN-T5 as a small instruction-following model you can run on a single GPU. Whisper (speech to text) is also an encoder-decoder.

**Common mistakes:**
- Mixing up BART and BERT because of the similar names. BERT is encoder-only; BART is encoder-decoder.
- Forgetting that T5 turns even classification into text output (it writes the word "positive").

**Exam angle:** T5 = "text-to-text" framing and span corruption; BART = denoising autoencoder good at summarisation.

> **සිංහලෙන්:** T5 සහ BART කියන්නේ encoder-decoder models. T5 හැම වැඩක්ම "text එකක් දීලා text එකක් ගන්න" විදිහට හදනවා, "translate English to German: ..." හෝ "summarize: ..." වගේ prefix එකකින් වැඩේ කියනවා. T5 train කරන්නේ span corruption වලින්: "The monsoon rains flooded the road to Kandy" එකේ "rains flooded" සහ "to Kandy" කොටස් අයින් කරලා <X>, <Y> දාලා, decoder එකට අයින් කළ කොටස් ලියන්න දෙනවා. BART කරන්නේ text එක කැත කරලා (mask කරලා, වාක්‍ය මාරු කරලා) මුල් එක ආපහු හදන එක, ඒ නිසා summarization වලට හොඳයි. නම් සමාන වුණාට BERT = encoder-only, BART = encoder-decoder කියලා වෙන් කරගන්න.

---

## 18. Counting parameters

**Why it matters:** parameter count decides how much memory a model needs, how much GPU time it takes, and what it costs to run. With one simple rule you can estimate a model's size on the back of an envelope.

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

### Worked example 3: a smaller model

d = 2048, 16 layers, vocabulary 32,000, tied embeddings.
- per block: 12 × 2048² = 12 × 4,194,304 = 50,331,648 ≈ **50.3M**
- 16 blocks: 16 × 50.3M ≈ **805M**
- embeddings: 32,000 × 2048 ≈ **65.5M**
- total ≈ **871M** (a "0.9B" model)

**Memory to just load it:** 871M × 2 bytes (BF16) ≈ **1.74 GB**. A commonly quoted rule of thumb for *training* with the Adam optimiser in mixed precision is about 16 bytes per parameter (weights, gradients and optimiser states), so ≈ 871M × 16 ≈ **13.9 GB** before counting activations.

**Quick table**

| d_model | Layers | ≈ block params (12d²) | ≈ total of blocks |
|---|---|---|---|
| 768 | 12 | 7.1M | 85M |
| 1024 | 24 | 12.6M | 302M |
| 4096 | 32 | 201M | 6.4B |

**Analogy:** think of the 12d² rule as the area of a plot of land. A model's width d is the side length; double the side and the area (parameters) grows four times. That is why wide models get big so quickly.

**Where you'll meet it in real work:** deciding whether a model fits on your GPU. A 7B model in 16-bit needs about 14 GB just for weights, so it fits a 24 GB card for inference but not for full training.

**Common mistakes:**
- Forgetting the embeddings, which can be hundreds of millions of parameters.
- Forgetting that memory for inference also includes the KV cache and activations, not only weights.
- Applying 12d² to models with GQA or SwiGLU and expecting an exact answer. The rule is an estimate.

**Exam angle:** "Roughly how many parameters per Transformer block?" 12d². "How much memory do the weights of an 8B model take in BF16?" About 16 GB (parameters × 2 bytes).

> **සිංහලෙන්:** Transformer block එකක parameters ගණන ඉක්මනට හොයාගන්න සරල නීතියක් තියෙනවා: ආසන්න වශයෙන් 12d². Attention එකේ W_Q, W_K, W_V, W_O හතරම d × d නිසා 4d², FFN එකේ d → 4d → d නිසා 8d², එකතුව 12d². d = 2048, layers 16, vocabulary 32,000 නම්: block එකක් 12 × 2048² ≈ 50.3M, 16න් ≈ 805M, embeddings 32,000 × 2048 ≈ 65.5M, එකතුව ≈ 871M. බර බලන්න parameters × bytes: BF16 එකේ 2 bytes නිසා 871M × 2 ≈ 1.74 GB. 8B model එකක් BF16 වලින් load කරන්න විතරක් GB 16ක් ඕනේ. Embeddings අමතක කරන්න එපා, ඒවා මිලියන සිය ගණනක් වෙන්න පුළුවන්.

---

## 19. The cost of attention

**Why it matters:** the n × n score matrix means doubling the text length quadruples the work. If nothing were done about it, chatting with a 100,000-word document would be far too slow and expensive.

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

### Worked example: 4k vs 32k context

| Context length n | Scores per head per layer (n²) |
|---|---|
| 4,096 | 16,777,216 ≈ **16.8M** |
| 32,768 | 1,073,741,824 ≈ **1.07B** |

32,768 / 4,096 = 8 times longer, and 8² = **64 times** more scores.

**Sliding-window attention.** With a window w = 4,096 and n = 32,768, each token looks at only 4,096 others: 32,768 × 4,096 = 134,217,728 ≈ **134M** scores instead of 1.07B, about 8 times fewer. The cost grows linearly with n instead of quadratically.

**FlashAttention in one sentence:** it gives the *same answer* as normal attention but never writes the n × n table to the GPU's slow main memory; it works on small tiles in fast on-chip memory. It is a speed and memory optimisation, not an approximation.

**Analogy:** if every person at a wedding with 1,000 guests must shake hands with everybody else, that is about half a million handshakes. Doubling the guests quadruples the handshakes. Sliding window says "just greet the 50 people sitting nearest to you".

**Where you'll meet it in real work:** long-context models, RAG over big documents, and the price list of any LLM API where long inputs cost more.

**Common mistakes:**
- Thinking FlashAttention changes the maths or accuracy. It is exact.
- Thinking a larger context window is free. Cost and latency rise, and the model may use the middle of a long context less reliably.

**Exam angle:** "How does attention cost scale with sequence length?" Quadratically, O(n²). "What does FlashAttention do?" Computes exact attention in tiles to reduce memory traffic.

> **සිංහලෙන්:** Attention වල n × n table එක නිසා text එකේ දිග දෙගුණ කළොත් වැඩ හතර ගුණයක් වෙනවා. Context එක 4,096 සිට 32,768 දක්වා 8 ගුණයක් වැඩි කළොත් scores 8² = 64 ගුණයක් වැඩි වෙනවා (මිලියන 16.8 සිට බිලියන 1.07 දක්වා). මනුස්සයෝ 1,000ක් ඉන්න මඟුලක හැමෝම හැමෝටම අත දෙනවා කියලා හිතන්න, ආසන්න වශයෙන් අත්දීම් 5 ලක්ෂයක්. FlashAttention කරන්නේ එකම උත්තරය දෙන ගණනය GPU එකේ වේගවත් පොඩි memory කොටස් වලින් කරන එක, approximation එකක් නෙවෙයි. Sliding window එකේදී හැම token එකක්ම බලන්නේ ළඟම tokens w ගාණක් විතරයි, ඒ නිසා වියදම n එක්ක සරල රේඛීයව වැඩි වෙනවා.

---

## 20. Vision Transformer

**Why it exists:** if a Transformer can process any sequence of tokens, why not turn an image into a sequence of tokens too? That is the whole idea of ViT, and it lets vision and language share one architecture.

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

### Worked example: counting patches

A 224 × 224 image with 16 × 16 patches:
- patches per side: 224 / 16 = **14**
- total patches: 14 × 14 = **196**
- each patch has 16 × 16 × 3 colour channels = **768** numbers, which a linear layer maps to a d_model vector
- add a [CLS] token: 196 + 1 = **197 tokens**
- the attention score table is 197 × 197 = **38,809** entries per head

A bigger 384 × 384 image with the same patch size has 24 × 24 = **576** patches, nearly three times as many tokens (576 vs 196), so attention costs roughly 8 times more (about 2.94² = 8.6 times). This is the n² cost of section 19 appearing again.

**Where you'll meet it in real work:** the image encoder inside multimodal models (such as CLIP-style models and vision-language assistants), and medical-imaging models that look at X-rays or scans for a hospital.

**Common mistakes:**
- Thinking ViT works better than a CNN on a small dataset. Without lots of data or pretraining, a CNN can win because it has built-in assumptions about images.
- Forgetting that patches lose some fine detail inside each patch.

**Exam angle:** "How does ViT convert an image into a sequence?" It splits it into fixed-size patches, flattens and linearly projects each, adds positional embeddings, and prepends a [CLS] token.

> **සිංහලෙන්:** Vision Transformer (ViT) කියන්නේ Transformer එකක් පින්තූරයකට පාවිච්චි කරන ක්‍රමය. පින්තූරය 16 × 16 පොඩි කොටස් (patches) වලට කඩනවා, හැම patch එකක්ම text එකේ token එකක් වගේ සලකනවා. 224 × 224 පින්තූරයක patches 14 × 14 = 196ක් හැදෙනවා, හැම patch එකකම අංක 16 × 16 × 3 = 768ක්. ඒවා linear layer එකකින් vector එකකට හරවලා, position එකතු කරලා, [CLS] token එකත් දාලා සාමාන්‍ය Transformer encoder එකකට දෙනවා. පින්තූරය 384 × 384 කළොත් patches 576ක් වෙනවා, ඒ නිසා attention වියදම ගොඩක් වැඩියි. CNN එකට වඩා data ගොඩක් ඕනේ, ඒත් හොඳට pretrain කළාම CLIP වගේ multimodal models වල "ඇස" විදිහට වැඩ කරනවා.

---

## 21. Code from scratch

**Why it exists:** reading about attention is one thing; seeing it run is better. The code below is small enough to read in one sitting, and every number it prints can be checked against the hand calculation in section 6.

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

### Worked example: what the check prints, and how big is TinyGPT?

The attention function reproduces the hand calculation: for the token "AI" it gives weights [0.2483, 0.2483, 0.5035] and output [1.7587, 1.0000]. Section 6 shows 0.248, 0.248, 0.504 and [1.760, 1.000]. The tiny differences come from rounding e^0.707 and e^1.414 by hand, so the code and the paper calculation agree.

For TinyGPT with d_model = 256, 4 layers and vocab 1,000:
- per block: 12 × 256² = 786,432 (plus about 3,000 bias and norm numbers)
- 4 blocks: ≈ 3.15M
- token embedding: 1,000 × 256 = 256,000 (the output head is tied, so no extra)
- position embedding: 256 × 256 = 65,536
- total ≈ **3.5M** parameters

You can verify the real number with `sum(p.numel() for p in model.parameters())`.

**A debugging checklist for attention code**

| Symptom | Likely cause |
|---|---|
| Output shape is wrong | forgot to transpose heads back before `.view` |
| Loss is NaN | −∞ everywhere in a row (a fully masked row), or no scaling |
| Model "cheats" and loss is too low | forgot the causal mask |
| Weights do not sum to 1 | softmax applied over the wrong dimension (use `dim=-1`) |

**Where you'll meet it in real work:** this is the structure of every open LLM you will download, only larger. Reading nanoGPT or the Llama source code feels easy after this.

**Common mistakes:**
- Using `dim=0` instead of `dim=-1` in softmax.
- Forgetting `masked_fill` with −∞ and using 0 instead.
- Writing your own attention for production when `F.scaled_dot_product_attention` is faster.

**Exam angle:** code is rarely tested line by line, but shapes, the √d_k scaling, causal masking and the pre-norm residual pattern in the block are fair game.

> **සිංහලෙන්:** Attention එක මුල ඉඳන්ම code එකකින් ලියලා බලන්න පුළුවන්, පේළි ගාණක් විතරයි. attention() function එක scores = q @ kᵀ / √d_k ගණනය කරලා, ඕනේ නම් causal mask එක දාලා, softmax කරලා, v එක්ක ගුණ කරනවා. Section 6 හි අතින් කරපු උදාහරණය දුන්නාම "AI" token එකට weights [0.2483, 0.2483, 0.5035] සහ output [1.7587, 1.0000] එනවා, අතින් කළ ගණනට ගොඩක් ළඟයි. TinyGPT එකේ d_model = 256, layers 4, vocab 1,000 නම් parameters ආසන්න වශයෙන් මිලියන 3.5ක්. Bugs එන්නේ සාමාන්‍යයෙන් softmax වැරදි dimension එකක දාන එකෙන්, causal mask අමතක වෙන එකෙන්, නැත්නම් heads ආපහු හරවන්න අමතක වෙන එකෙන්.

```quiz
[{"q": "What is the main reason the Transformer replaced RNNs for large language models?", "options": ["Transformers use fewer parameters than RNNs", "Transformers process all tokens in parallel and let any two tokens interact directly", "Transformers do not need any training data", "Transformers cannot forget anything by design"], "answer": 1, "why": "Self-attention connects every token to every other token in one step and can be computed in parallel on GPUs. Fewer parameters is wrong (Transformers are usually bigger), and they certainly still need training data."}, {"q": "Self-attention has no built-in sense of order. What fixes this?", "options": ["A bigger vocabulary", "Positional information (sinusoidal, learned, RoPE or ALiBi)", "Using more attention heads", "Dropout"], "answer": 1, "why": "Positional encoding gives each token its place in the sequence. More heads would still treat the tokens as an unordered set."}, {"q": "In scaled dot-product attention, why divide the scores by sqrt(d_k)?", "options": ["To make the output shorter", "To make the weights add up to 1", "To keep the scores small so softmax does not saturate and gradients do not vanish", "To remove padding tokens"], "answer": 2, "why": "Dot products grow with d_k; large scores make softmax almost one-hot with tiny gradients. Making weights add up to 1 is the job of softmax, which is the tempting wrong answer."}, {"q": "Scores for one query are [1.0, 2.0, -inf] after the causal mask. What are the attention weights (to 3 decimals)?", "options": ["[0.333, 0.333, 0.333]", "[0.269, 0.731, 0.000]", "[0.500, 0.500, 0.000]", "[0.269, 0.731, 0.269]"], "answer": 1, "why": "e^1 = 2.718, e^2 = 7.389, e^-inf = 0; sum = 10.107, so the weights are 0.269, 0.731 and 0. The masked position gets exactly zero and the others still sum to 1."}, {"q": "A model has d_model = 768 and 12 attention heads. What is d_k per head, and how many parameters are in W_O?", "options": ["d_k = 64, W_O = 589,824", "d_k = 64, W_O = 49,152", "d_k = 768, W_O = 589,824", "d_k = 12, W_O = 9,216"], "answer": 0, "why": "d_k = 768 / 12 = 64. W_O is d_model x d_model = 768 x 768 = 589,824. 49,152 is the size of one head's W_Q (768 x 64), the tempting wrong answer."}, {"q": "Which pairing of model, family and pretraining task is correct?", "options": ["BERT: decoder-only, next-token prediction", "GPT: encoder-only, masked language modelling", "T5: encoder-decoder, span corruption", "BART: encoder-only, next-sentence prediction"], "answer": 2, "why": "T5 is an encoder-decoder pretrained with span corruption. BERT is encoder-only with masked language modelling and GPT is decoder-only with next-token prediction, so the first two swap the families."}, {"q": "Using the 12d^2 rule, about how many parameters are in the blocks of a model with d = 1024 and 24 layers (ignoring embeddings)?", "options": ["About 25M", "About 126M", "About 302M", "About 1.2B"], "answer": 2, "why": "12 x 1024^2 = 12.6M per block, times 24 = about 302M. 126M would come from using 10 layers, and 25M from forgetting the d^2."}, {"q": "Going from a 4,096-token context to 32,768 tokens, roughly how much bigger does the attention score matrix become (without FlashAttention)?", "options": ["8 times", "16 times", "64 times", "512 times"], "answer": 2, "why": "The matrix is n x n. The length grows 8 times, so the matrix grows 8 x 8 = 64 times. Choosing 8 times forgets that cost is quadratic."}]
```

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

**Q13.** A token embedding is [0.5, -0.2, 0.1, 0.3] and the sinusoidal position vector for position 1 is [0.841, 0.540, 0.010, 1.000]. What is the input to the first layer?
<details><summary>Answer</summary>They are added: [1.341, 0.340, 0.110, 1.300].</details>

**Q14.** An image of 224 × 224 pixels is cut into 16 × 16 patches. How many tokens does the ViT see (with a [CLS] token)?
<details><summary>Answer</summary>(224/16)² = 196 patches + 1 [CLS] = **197** tokens.</details>

**Q15.** With 32 query heads and 8 key/value heads (GQA), how many times smaller is the KV cache than with 32 full heads?
<details><summary>Answer</summary>32 / 8 = **4 times** smaller.</details>

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
| Residual / skip connection | Adding a layer's input to its output so information and gradients flow freely |
| Logits | Raw scores for every vocabulary token, before softmax |
| Patch | A small square piece of an image treated as one token in ViT |
| Span corruption | T5's pretraining: replace spans with placeholders and predict them |
| Saturated softmax | Softmax with one weight near 1 and the rest near 0, so gradients vanish |

**Next:** [20-how-llms-work.md](20-how-llms-work.md)
