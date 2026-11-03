# 20: How Large Language Models Work

> **Before you start:** [04](04-math-numbers-and-functions.md) (logs, exp, argmax), [07](07-math-probability-statistics.md) (softmax, temperature preview, cross-entropy, perplexity, MLE), [11](11-ml-fundamentals.md) (self-supervised learning, generalisation), [17](17-sequence-models-and-attention.md#11-teacher-forcing-and-decoding) (teacher forcing, greedy/beam/sampling), [18](18-nlp-fundamentals.md) (tokenisation, language models), [19](19-transformers.md) (decoder-only Transformers, causal mask, LM head, RoPE, GQA, parameter counting).
>
> **After this file you can:** explain exactly what happens from typing a prompt to receiving an answer: tokenisation (BPE), context windows and token costs, next-token prediction, decoding settings (temperature, top-k, top-p), the KV cache, pretraining and scaling laws, why LLMs hallucinate, base vs instruct models, reasoning models, and open vs closed models.

---

## Table of contents

1. [An LLM in one paragraph](#1-an-llm-in-one-paragraph)
2. [Tokens and tokenisers](#2-tokens-and-tokenisers)
3. [BPE step by step](#3-bpe-step-by-step)
4. [Tokeniser families and quirks](#4-tokeniser-families-and-quirks)
5. [Special tokens and chat templates](#5-special-tokens-and-chat-templates)
6. [Context window, token limits and cost](#6-context-window-limits-and-cost)
7. [Next-token prediction: from logits to probabilities](#7-next-token-prediction)
8. [The generation loop (autoregressive decoding)](#8-the-generation-loop)
9. [Decoding strategies: greedy and beam search](#9-greedy-and-beam-search)
10. [Sampling: temperature, top-k, top-p, min-p](#10-sampling)
11. [Other generation controls](#11-other-generation-controls)
12. [The KV cache](#12-the-kv-cache)
13. [Pretraining: how LLMs learn](#13-pretraining)
14. [Scaling laws](#14-scaling-laws)
15. [Emergent abilities and in-context learning](#15-emergent-abilities-and-in-context-learning)
16. [Base models vs instruction-tuned (chat) models](#16-base-vs-instruct-models)
17. [Hallucinations: why LLMs make things up](#17-hallucinations)
18. [Other limitations](#18-other-limitations)
19. [Reasoning models and test-time compute](#19-reasoning-models)
20. [Open vs closed models](#20-open-vs-closed-models)
21. [The life of a prompt (putting it all together)](#21-the-life-of-a-prompt)
22. [Check yourself](#22-check-yourself)
23. [New words in this file](#23-new-words-in-this-file)

---

## 1. An LLM in one paragraph

A **Large Language Model** is a decoder-only Transformer ([file 19](19-transformers.md#16-gpt)) with billions of parameters, **pretrained** on trillions of tokens of text to predict the **next token** ([file 18](18-nlp-fundamentals.md#15-language-models)). Given a sequence of tokens, it outputs a probability for every possible next token. To write text, it **samples** one token, appends it, and repeats. After pretraining, it's **fine-tuned and aligned** (file 21) to follow instructions and be helpful and safe. Everything it "knows" is stored in its parameters, learned from patterns in its training data.

---

## 2. Tokens and tokenisers

LLMs don't see letters or words. They see **tokens**: chunks of text from a fixed **vocabulary** (typically 32,000 to 256,000 entries), each with an integer ID ([file 18](18-nlp-fundamentals.md#4-tokenisation)).

**Example** (GPT-4-style tokeniser; exact splits vary between models):

```
"Tokenization is unbelievably useful!"
→ ["Token", "ization", " is", " unbel", "ievably", " useful", "!"]
→ [3404, 2065, 374, 41380, 89234, 5505, 0]   (illustrative IDs)
```

Notice:
- Common words are one token (" is", " useful")
- Rare words are split into pieces
- **Spaces are usually attached to the following word** (" is", not "is")

**Rules of thumb for English:**
- 1 token ≈ 4 characters ≈ ¾ of a word
- 100 tokens ≈ 75 words
- 1,000 words ≈ 1,300 to 1,400 tokens

**Why subwords?** ([file 18](18-nlp-fundamentals.md#4-tokenisation)) Word-level vocabularies can't handle new words; character-level sequences are too long. Subwords balance both, so **any** text can be encoded.

```python
import tiktoken                             # OpenAI's tokeniser library
enc = tiktoken.get_encoding("cl100k_base")
ids = enc.encode("Tokenization is unbelievably useful!")
print(len(ids), [enc.decode([i]) for i in ids])

from transformers import AutoTokenizer      # any Hugging Face model's tokeniser
tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
tok.tokenize("Hello world")
```

---

## 3. BPE step by step

**Byte Pair Encoding (BPE)** is the most common tokeniser algorithm. It learns a vocabulary from a training corpus by **repeatedly merging the most frequent adjacent pair** of symbols.

**Training corpus** (word: count): `low` ×5, `lower` ×2, `newest` ×6, `widest` ×3

**Start:** split every word into characters (with an end-of-word marker `_`):
```
l o w _ (5)    l o w e r _ (2)    n e w e s t _ (6)    w i d e s t _ (3)
```

**Count adjacent pairs** (weighted by word count):
- "e s": newest (6) + widest (3) = **9**
- "s t": 6 + 3 = **9**
- "t _": 9
- "l o": 5 + 2 = 7
- "o w": 7
- "w e": lower (2) + newest (6) = 8
- ...

**Merge 1:** most frequent is "e s" (tie broken by order) → new symbol "es":
```
n e w es t _ (6)    w i d es t _ (3)
```
**Merge 2:** "es t" (9) → "est":
```
n e w est _ (6)    w i d est _ (3)
```
**Merge 3:** "est _" (9) → "est_"
**Merge 4:** "l o" (7) → "lo"
**Merge 5:** "lo w" (7) → "low"
... continue until the vocabulary reaches the target size.

**Result:** frequent chunks like "est_" (as in newest, widest, biggest) and "low" become single tokens. A new word like "lowest" can be built as "low" + "est_", even though it never appeared in training.

**Encoding new text** applies the learned merges in the same order.

**Byte-level BPE** (GPT-2 onward): starts from the 256 possible **bytes** instead of characters, so **any** text (any language, emoji, code) can be encoded without "unknown" tokens.

---

## 4. Tokeniser families and quirks

| Algorithm | Used by | Idea |
|---|---|---|
| **BPE** (byte-level) | GPT family, Llama 3, Qwen, Mistral | Merge frequent pairs |
| **WordPiece** | BERT | Like BPE but merges pairs that most increase the training data's likelihood; continuation pieces marked with ## ("play", "##ing") |
| **Unigram** | T5, many multilingual models | Start with a big vocabulary and prune the least useful tokens |
| **SentencePiece** | Llama 1/2, T5, many others | A library/framework that treats raw text (including spaces, shown as ▁) as input, running BPE or Unigram; language-independent |
| **tiktoken** | OpenAI models | A fast BPE implementation |

### Tokenisation quirks that explain LLM mistakes

1. **Counting letters is hard.** "How many r's in strawberry?" The model sees tokens like ["str", "aw", "berry"], not individual letters, so it has to "remember" each token's spelling.
2. **Arithmetic is awkward.** Numbers split inconsistently: "1234567" might be ["123", "456", "7"]. Digit-by-digit maths is harder. (Some newer tokenisers split numbers into single digits.)
3. **Spaces matter.** "Hello" and " Hello" are different tokens. Trailing spaces in prompts can change outputs.
4. **Non-English costs more.** Tokenisers are mostly trained on English, so other languages split into more tokens. A Sinhala or Tamil sentence can need **3 to 10×** more tokens than its English translation ([file 18](18-nlp-fundamentals.md#17-low-resource-languages)): higher cost, slower, less fits in the context window.
5. **Glitch tokens:** rare tokens that were in the vocabulary but barely in training data can cause weird behaviour.
6. **Each model has its own tokeniser.** Token counts and IDs differ between models; never mix tokenisers and models.

---

## 5. Special tokens and chat templates

**Special tokens** have reserved meanings:
- **BOS** (beginning of sequence), e.g. `<s>` or `<|begin_of_text|>`
- **EOS** (end of sequence), e.g. `</s>` or `<|eot_id|>`. When the model generates it, generation stops
- **PAD** (padding, [file 19](19-transformers.md#8-masking))
- Role markers for chat

### Chat templates

A chat is a list of messages with **roles**:
- **system:** overall instructions and persona ("You are a helpful assistant for a bank...")
- **user:** the human's messages
- **assistant:** the model's replies
- (sometimes **tool**: results from tools the model called, file 24)

The model actually sees one long string, formatted with special tokens by a **chat template**. Example (Llama-3 style):

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>
What is the capital of Sri Lanka?<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

The model continues from there: "Sri Jayawardenepura Kotte is the official capital; Colombo is the commercial capital.<|eot_id|>"

```python
messages = [{"role": "system", "content": "You are helpful."},
            {"role": "user", "content": "Hi!"}]
prompt = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
```

⚠️ Using the **wrong template** for a model (or none) makes an instruct model behave badly. Libraries and APIs handle this for you.

---

## 6. Context window, limits and cost

### Context window

The **context window** (or **context length**) = the maximum number of tokens the model can process at once: **input + output combined**.

| Era | Typical context |
|---|---|
| GPT-2 (2019) | 1,024 tokens |
| GPT-3 (2020) | 2,048 |
| 2023 | 8k to 32k; some 100k+ |
| 2024 to 2026 | 128k to 1M+ tokens for leading models |

128k tokens ≈ 96,000 words ≈ a 300-page book.

**If your input + requested output exceeds the window**, you'll get an error, or the start of the conversation gets cut off (**truncation**).

**LLMs are stateless.** The model has **no memory between API calls**. A chat app "remembers" the conversation only by **sending the whole history again** with every message. Long chats therefore get slower and more expensive, and eventually the oldest messages must be dropped or summarised (agent memory, file 24).

### Longer isn't automatically better

- **Cost and latency** grow with input length (attention is O(n²), [file 19](19-transformers.md#19-the-cost-of-attention))
- **"Lost in the middle":** models use information at the **start and end** of long contexts better than information buried in the middle
- **Effective context** may be shorter than the advertised maximum

This is one reason RAG (file 23) is still useful even with huge context windows: retrieve only the relevant pieces.

### Token-based pricing

APIs charge per token, usually quoted **per million tokens**, with **output tokens costing more** than input tokens (often 3 to 5×), because generating is slower (section 12).

**Worked example** (illustrative prices: $3 per 1M input tokens, $15 per 1M output tokens):
A support bot handles 10,000 conversations/day, each with 2,000 input tokens (system prompt + history + question) and 300 output tokens.
- Input: 10,000 × 2,000 = 20M tokens × $3/1M = **$60/day**
- Output: 10,000 × 300 = 3M tokens × $15/1M = **$45/day**
- **Total ≈ $105/day ≈ $3,150/month**

Ways to reduce cost: shorter prompts, **prompt caching** (reuse a long fixed prefix at a discount, file 22), cheaper/smaller models for easy requests (routing), limiting output length.

---

## 7. Next-token prediction

Given tokens [t₁, ..., tₙ], the model outputs, for the last position, a **logit** (raw score, [file 07](07-math-probability-statistics.md#13-softmax)) for **every** token in the vocabulary. Softmax turns them into probabilities.

**Example:** prompt "The cat sat on the"

| Next token | Logit | Probability |
|---|---|---|
| " mat" | 5.1 | 0.42 |
| " floor" | 4.6 | 0.25 |
| " sofa" | 4.2 | 0.17 |
| " roof" | 3.5 | 0.08 |
| " table" | 3.2 | 0.06 |
| ... 100,000 others | lower | 0.02 total |

The model outputs a **distribution**, not one answer. How we pick from it is the **decoding strategy** (sections 9 to 10).

**Log-probabilities ("logprobs"):** many APIs can return ln(probability) for each generated token. Useful for measuring the model's confidence, building classifiers, and detecting uncertain (possibly hallucinated) answers.

### Training objective

At every position in the training text, the loss is the cross-entropy: **−log P(actual next token)** ([file 07](07-math-probability-statistics.md#23-cross-entropy)). Thanks to the causal mask ([file 19](19-transformers.md#8-masking)), one forward pass over a 4,096-token document gives 4,095 predictions and training signals at once. This is **Maximum Likelihood Estimation** of the text ([file 07](07-math-probability-statistics.md#21-maximum-likelihood-and-map)).

---

## 8. The generation loop

LLMs generate **autoregressively**: one token at a time, each new token fed back as input.

```
Step 1: "The capital of France is"            → predict " Paris"
Step 2: "The capital of France is Paris"      → predict "."
Step 3: "The capital of France is Paris."     → predict <EOS>  → stop
```

```python
# Simplified generation loop
ids = tokenizer.encode(prompt)
for _ in range(max_new_tokens):
    logits = model(ids)[-1]                 # logits for the next token
    next_id = choose(logits)                # greedy / sampling (below)
    if next_id == eos_id:
        break
    ids.append(next_id)
print(tokenizer.decode(ids))
```

**Consequences:**
- Output comes out **word by word**, which is why chat apps **stream** text ([generators, file 02](02-python-programming.md#21-generators-decorators-type-hints))
- **Each output token needs a full forward pass**, so long answers take longer
- **Early tokens commit the model.** Once it writes "The answer is 42", later tokens tend to justify that, even if wrong. That's partly why "think step by step before answering" helps (file 22).

---

## 9. Greedy and beam search

### Greedy decoding

Always pick the **highest-probability** token (argmax, [file 04](04-math-numbers-and-functions.md#15-absolute-value-min-max-argmax)).
- ✅ Deterministic (mostly, see section 11), fast
- ❌ Can be repetitive and dull; can miss better overall continuations

### Beam search

Keep the **top B partial sequences** (beams) at every step, expand each, keep the best B by total log-probability.

**Example, B = 2:**
- Step 1: " Paris" (0.6), " the" (0.3) → keep both
- Step 2: expand each: "Paris." (0.6×0.7 = 0.42), "Paris," (0.6×0.2 = 0.12), "the city" (0.3×0.8 = 0.24), ... → keep the best 2: "Paris." (0.42), "the city" (0.24)

- ✅ Good for tasks with a "correct" output: translation, summarisation, speech recognition
- ❌ For open-ended chat/creative text, produces bland, repetitive output. Rarely used for chat LLMs.

**Length penalty:** beam search favours short outputs (multiplying probabilities < 1 makes longer sequences score lower), so a length normalisation is applied.

---

## 10. Sampling

**Sampling** = randomly choosing the next token according to its probability. This gives varied, more natural text.

### Temperature (T)

Divide the logits by T before softmax ([file 07](07-math-probability-statistics.md#13-softmax)):

```
P(token i) = softmax(logits / T)
```

**Worked example:** logits [2.0, 1.0, 0.0] for tokens [A, B, C]

| Temperature | Logits ÷ T | Probabilities | Effect |
|---|---|---|---|
| T → 0 | [→ ∞ gaps] | [1.00, 0.00, 0.00] | = greedy |
| **T = 0.5** | [4, 2, 0] | e⁴=54.6, e²=7.39, 1 → **[0.867, 0.117, 0.016]** | sharper, more focused |
| **T = 1.0** | [2, 1, 0] | **[0.665, 0.245, 0.090]** | the model's natural distribution |
| **T = 2.0** | [1, 0.5, 0] | e¹=2.72, e^0.5=1.65, 1 → **[0.506, 0.307, 0.186]** | flatter, more random |

- **Low T (0 to 0.3):** factual Q&A, extraction, code, classification, anything where you want consistency
- **Medium T (0.5 to 0.8):** general chat
- **High T (0.9 to 1.2+):** brainstorming, creative writing (too high → nonsense)

### Top-k sampling

Only consider the **k most likely** tokens, renormalise, then sample.
With k = 2 on [0.665, 0.245, 0.090] → keep A, B → renormalised [0.731, 0.269].
❌ A fixed k is awkward: sometimes only 1 token is sensible, sometimes 50 are.

### Top-p (nucleus) sampling

Keep the **smallest set of tokens whose probabilities add up to at least p**, renormalise, sample.

Probabilities sorted: [0.42, 0.25, 0.17, 0.08, 0.06, ...] with **p = 0.9**:
cumulative 0.42 → 0.67 → 0.84 → **0.92** ≥ 0.9 → keep the top 4 tokens.

✅ Adapts automatically: when the model is confident, the nucleus is small; when uncertain, it's larger. Typical p = 0.9 to 0.95.

### Min-p sampling

Keep tokens whose probability is at least **min_p × (probability of the top token)**. With top = 0.42 and min_p = 0.1, keep tokens with P ≥ 0.042. Also adapts to confidence; popular in open-model tools.

**Order in practice:** logits → (penalties) → temperature → top-k / top-p / min-p filtering → softmax → sample.

**Tip:** usually change **either** temperature **or** top-p, not both aggressively.

---

## 11. Other generation controls

| Setting | What it does |
|---|---|
| **max_tokens / max_new_tokens** | Cap on output length (cost and latency control). If hit, the answer is cut off mid-sentence; APIs report a finish reason like "length". |
| **stop sequences** | Strings that end generation when produced (e.g. "\n\nUser:") |
| **Repetition penalty** | Lower the logits of tokens already used, to reduce loops |
| **Frequency penalty** | Penalty grows with how many times a token appeared |
| **Presence penalty** | Fixed penalty if the token appeared at all (encourages new topics) |
| **no_repeat_ngram_size** | Forbid repeating any n-gram |
| **logit bias** | Manually raise/lower specific tokens (e.g. ban a word) |
| **seed** | Makes sampling repeatable (where supported) |
| **Structured output / constrained decoding** | Only allow tokens that keep the output valid JSON or matching a schema/grammar (file 22) |

### Why "temperature 0" can still vary

Even with greedy decoding, outputs can differ between runs because of:
- GPU floating-point arithmetic isn't perfectly deterministic (the order of additions in parallel can change tiny rounding errors, which can flip a close tie)
- **Batching** with other users' requests on the server changes computation order
- Model updates behind the API

So never assume perfect reproducibility from hosted APIs (file 26).

---

## 12. The KV cache

**Problem:** to generate token 501, attention needs the keys and values ([file 19](19-transformers.md#5-query-key-value)) of all 500 previous tokens. Recomputing them for every new token would waste enormous effort.

**Solution:** the **KV cache** stores each layer's K and V vectors for all previous tokens. Each new step only computes Q, K, V for the **one new token** and reuses the cache.

```
Step 501: new token's q attends to [cached k₁..k₅₀₀ + new k₅₀₁], uses [cached v₁..v₅₀₀ + new v₅₀₁]
```

### Two phases of inference

| Phase | What happens | Speed limit |
|---|---|---|
| **Prefill** | Process the whole prompt at once (in parallel), filling the KV cache, and produce the first token | **Compute-bound** (lots of matrix maths); determines **time to first token (TTFT)** |
| **Decode** | Generate one token at a time using the cache | **Memory-bandwidth-bound** (loading all weights + cache for every token); determines **time per output token** |

This is why output tokens are slower and pricier than input tokens (section 6).

### KV cache memory

```
KV cache size = 2 (K and V) × layers × KV_heads × head_dim × sequence_length × bytes_per_number
```
(per sequence; multiply by the number of simultaneous requests)

**Worked example:** a Llama-3-8B-like model: 32 layers, 8 KV heads (GQA), head_dim 128, BF16 (2 bytes), 8,192 tokens:
2 × 32 × 8 × 128 × 8,192 × 2 bytes = **1,073,741,824 bytes ≈ 1 GB** per sequence.

Without GQA (32 KV heads), it would be 4 GB. This is why GQA/MQA matter ([file 19](19-transformers.md#9-multi-head-attention)). Serving systems like **vLLM** manage this memory cleverly (**PagedAttention**, file 27).

---

## 13. Pretraining

**Pretraining** = the first and most expensive training phase: self-supervised next-token prediction ([file 11](11-ml-fundamentals.md#2-types-of-machine-learning)) on a massive text corpus.

### The data

Trillions of tokens from:
- Web pages (filtered versions of **Common Crawl**, a huge public web scrape)
- Books, encyclopaedias (Wikipedia)
- Code (GitHub)
- Scientific papers, maths
- Multilingual text
- Increasingly, carefully generated **synthetic data**

**Data quality matters enormously.** Pipelines filter spam, low-quality pages, toxic content and personal information; **deduplicate** (repeated text gets memorised and wastes compute); and balance the **data mixture** (how much code vs web vs books). Covered more in [file 21](21-training-finetuning-alignment.md).

### The compute

Thousands of GPUs running for weeks or months. Frontier training runs cost tens to hundreds of millions of dollars.

**Training compute rule of thumb:**
```
FLOPs ≈ 6 × N × D
```
- N = number of parameters, D = number of training tokens
- (≈ 2ND for the forward pass + 4ND for the backward pass; a FLOP is one floating-point operation)

**Example:** 8B parameters × 15T tokens: 6 × 8×10⁹ × 15×10¹² = **7.2 × 10²³ FLOPs**. An H100 GPU delivers roughly 10¹⁵ useful FLOP/s in BF16 at good efficiency, so ≈ 7.2 × 10⁸ GPU-seconds ≈ **200,000 GPU-hours**.

### What the model learns

To predict the next token well across all that text, the model must implicitly learn grammar, facts, reasoning patterns, coding, styles, multiple languages, and how people think and argue. But it also absorbs the data's errors, biases and toxicity, which is why alignment and safety work (files 21, 29) are needed.

**Knowledge cutoff:** the model knows nothing about events after its training data was collected, unless you give it information in the prompt or via tools/RAG (files 23, 24).

---

## 14. Scaling laws

**Scaling laws** are empirical findings that LLM loss improves **smoothly and predictably** as you increase:
- **N:** model size (parameters)
- **D:** data (training tokens)
- **C:** compute

The loss falls as a **power law**: each 10× increase gives a consistent improvement (a straight line on a log-log plot). This predictability let labs plan billion-dollar training runs.

### Chinchilla (DeepMind, 2022)

For a **fixed compute budget**, what's the best split between model size and data? Chinchilla found earlier models (like GPT-3: 175B parameters on only 300B tokens) were **undertrained**. The **compute-optimal** ratio is roughly:

```
≈ 20 training tokens per parameter
```

**Example:** a 70B model should see ~1.4T tokens. Chinchilla (70B, 1.4T tokens) beat the much larger Gopher (280B, 300B tokens) using the same compute.

### Beyond Chinchilla: "over-training" for inference

Chinchilla optimises **training** cost. But a deployed model is used billions of times, so a **smaller model trained on far more data** is cheaper to run. Modern models are often trained way past 20 tokens/parameter (e.g. Llama-3-8B on ~15T tokens ≈ 1,875 tokens per parameter).

---

## 15. Emergent abilities and in-context learning

### Emergent abilities

Some capabilities seemed to **appear suddenly** once models got big enough: multi-step arithmetic, following complex instructions, chain-of-thought reasoning. Later research suggested much of this "suddenness" depends on how you measure (e.g. all-or-nothing exact-match metrics hide gradual progress), but it's clear that **scale unlocks qualitatively new behaviours**.

### In-context learning (ICL)

Large models can learn a new task **from examples given in the prompt**, with **no weight updates**:

```
Translate to French:
sea otter → loutre de mer
cheese → fromage
peppermint → menthe poivrée
plush giraffe →
```
→ "girafe en peluche"

- **Zero-shot:** just the instruction, no examples
- **One-shot:** one example
- **Few-shot:** a few examples

This was GPT-3's big discovery and is the basis of **prompt engineering** ([file 22](22-prompt-engineering.md)). Mechanistically, attention heads such as **induction heads** ([file 19](19-transformers.md#9-multi-head-attention)) help models copy and apply patterns from earlier in the context.

---

## 16. Base vs instruct models

| | **Base model** (pretrained) | **Instruct / chat model** (aligned) |
|---|---|---|
| Training | Next-token prediction on raw text | Base + **supervised fine-tuning (SFT)** on instruction-response examples + **preference tuning** (RLHF/DPO) (file 21) |
| Behaviour | **Continues** text; doesn't "answer" | Follows instructions, answers questions, refuses harmful requests |
| Prompt "What is the capital of France?" | Might continue: "What is the capital of Germany? What is the capital of Italy?..." (like a quiz list) | "The capital of France is Paris." |
| Use | Research, further fine-tuning, completion tasks | Chatbots, assistants, most applications |

On Hugging Face, look for names like `-Instruct`, `-Chat`, `-it`.

---

## 17. Hallucinations

A **hallucination** is when an LLM generates content that is **fluent and confident but false or unsupported**: invented facts, fake citations, wrong numbers, non-existent APIs, made-up quotes.

**Example:** "Give me 3 research papers on X with DOIs" → realistic-looking titles, authors and DOIs that don't exist.

### Why it happens

1. **The objective rewards plausibility, not truth.** The model learned to produce text that **looks like** training text. A plausible-sounding citation has the right *form* even if it's not real.
2. **Knowledge is compressed and lossy.** Trillions of tokens squeezed into billions of parameters. Rare facts (a small company's founding date) are stored weakly or not at all.
3. **No built-in "I don't know".** Generation always produces *some* next token. Training and evaluation have often rewarded guessing over abstaining (a confident guess sometimes scores, "I don't know" never does).
4. **Autoregressive commitment** (section 8): once a wrong claim starts, the model tends to continue consistently with it.
5. **Knowledge cutoff:** questions about recent events.
6. **Ambiguous or false-premise prompts:** "Why did Einstein win the Nobel Prize in 1950?" (He won in 1921.) The model may go along with the premise.
7. **Sycophancy:** alignment training can make models agree with the user too readily (file 22).

### Types

- **Factual (extrinsic):** contradicts the world ("The Eiffel Tower is in Berlin")
- **Faithfulness (intrinsic):** contradicts the **provided source** (a summary adding things not in the document; a RAG answer not supported by the retrieved text)

### Reducing hallucinations

| Method | File |
|---|---|
| **Grounding with RAG:** give the model relevant documents and ask it to answer only from them | 23 |
| **Tools:** calculators, search, code execution, databases instead of memory | 24 |
| **Prompting:** allow "I don't know"; ask for quotes from the source first; ask for citations | 22 |
| **Lower temperature** for factual tasks | this file |
| **Verification:** a second pass checking claims (self-verification, Chain-of-Verification), or checking consistency across samples (SelfCheckGPT) | 22, 26 |
| **Better training:** reward calibrated uncertainty; fine-tune on domain data | 21 |
| **Evaluation:** measure faithfulness/factuality | 26 |
| **Human review** for high-stakes uses | 29 |

You **cannot eliminate** hallucinations completely today. Design systems assuming they will happen.

---

## 18. Other limitations

| Limitation | Notes |
|---|---|
| **Statelessness** | No memory between calls (section 6) |
| **Knowledge cutoff** | Stale knowledge without tools/RAG |
| **Arithmetic and counting** | Tokenisation and next-token generation make exact maths unreliable → use a code/calculator tool |
| **Lost in the middle** | Weaker use of information buried in long contexts |
| **Sensitivity to wording** | Small prompt changes can change answers (file 22) |
| **Sycophancy** | Agreeing with the user's wrong claims |
| **Bias** | Learned from training data (file 29) |
| **Prompt injection** | Instructions hidden in input can hijack the model (files 22, 29) |
| **Non-determinism** | Different runs, different answers |
| **Cost and latency** | Large models are expensive and slow (file 27) |

---

## 19. Reasoning models

**Test-time compute** (or inference-time compute): letting the model **spend more computation while answering** to get better results, instead of only making the model bigger.

**Chain-of-thought (CoT):** writing intermediate reasoning steps before the final answer improves accuracy on maths, logic and multi-step problems ([file 22](22-prompt-engineering.md)). Each written step is extra computation the model can build on (since it reads its own previous tokens).

**Reasoning models** (e.g. OpenAI o-series, DeepSeek-R1, Claude with extended thinking, Gemini thinking models) are trained, largely with **reinforcement learning** on problems with checkable answers (maths, code, file 21), to produce long internal reasoning ("thinking tokens") before answering: exploring approaches, checking work, backtracking.

- ✅ Much better at maths, coding, science, planning
- ❌ Slower and more expensive (many thinking tokens); can **overthink** simple questions; reasoning text isn't always a faithful picture of what actually drove the answer

Other test-time compute methods: **self-consistency** (sample several answers, take a majority vote), **best-of-N with a verifier** (generate N answers, pick the one a checker rates best), search over reasoning paths (file 22).

---

## 20. Open vs closed models

| | **Closed (proprietary)** | **Open-weight** |
|---|---|---|
| Examples | GPT (OpenAI), Claude (Anthropic), Gemini (Google) | Llama (Meta), Mistral, Qwen (Alibaba), DeepSeek, Gemma (Google), Phi (Microsoft) |
| Access | API only | Download weights, run anywhere |
| Strengths | Typically the most capable; no infrastructure to manage; regularly updated | Full control; data stays on your servers (privacy); can fine-tune freely; predictable cost at scale; offline use |
| Weaknesses | Data leaves your environment; vendor dependence; less control; per-token costs | You manage GPUs/serving; usually somewhat behind the frontier; responsibility for safety |

**"Open-weight" vs "open-source":** most "open" LLMs release the **weights** but not the full training data or code. Also check the **licence**: some allow any commercial use (Apache 2.0, MIT), others have restrictions (e.g. user-count limits or acceptable-use policies) (file 29).

**Model sizes and where they run** (rough, with 4-bit quantisation, file 27):

| Size | Runs on | Typical use |
|---|---|---|
| 1 to 4B | Phone, laptop CPU | Simple tasks, on-device |
| 7 to 14B | Laptop/desktop GPU (8 to 16 GB) | Good general assistant, RAG, classification |
| 30 to 70B | One or two large GPUs | Strong general use |
| 100B to 1T+ (often MoE) | Multi-GPU servers | Frontier-level open models |

**Choosing a model:** start with the best affordable model to prove the task works; then try smaller/cheaper models and measure whether quality holds (file 26). Consider privacy, latency, cost, language support (e.g. Sinhala quality) and licence.

---

## 21. The life of a prompt

You send: *"Explain photosynthesis in one sentence."* to a chat API.

1. **Chat template:** the API wraps your message with the system prompt and role tokens (section 5).
2. **Tokenisation:** text → ~30 token IDs (section 2).
3. **Embedding:** each ID → a d_model vector ([file 19](19-transformers.md#2-token-embeddings)).
4. **Prefill:** all tokens flow through every Transformer block in parallel: attention (with RoPE positions, causal mask) and FFN, filling the **KV cache** (section 12).
5. **LM head + softmax:** the last position's vector → probabilities over the ~100k-token vocabulary (section 7).
6. **Decoding:** apply temperature/top-p, sample the first token, e.g. "Photos" (section 10).
7. **Decode loop:** feed the new token in (reusing the KV cache), get the next distribution, sample, repeat; **stream** each token back to you (section 8).
8. **Stop:** the model emits an end-of-turn token, or max_tokens is reached (section 11).
9. **Detokenise:** IDs → text: "Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to make glucose and release oxygen."
10. **Billing:** you're charged for input + output tokens (section 6).

Next time, the API won't remember this exchange unless you send it again.

---

## 22. Check yourself

**Q1.** Roughly how many tokens is a 3,000-word English document? Why would the same content in Sinhala use more?
<details><summary>Answer</summary>≈ 4,000 tokens (3,000 ÷ 0.75). Tokenisers are trained mostly on English, so Sinhala is split into many more, smaller pieces (and each character is 3 bytes in UTF-8).</details>

**Q2.** In BPE, what's merged at each step?
<details><summary>Answer</summary>The most frequent adjacent pair of symbols in the training corpus, which becomes a new vocabulary symbol.</details>

**Q3.** Why do LLMs struggle to count the letters in a word?
<details><summary>Answer</summary>They see subword tokens, not individual characters.</details>

**Q4.** Logits [1, 0] for tokens [A, B]. Compute P(A) at T = 1 and T = 0.5.
<details><summary>Answer</summary>T=1: e¹/(e¹+e⁰) = 2.718/3.718 ≈ **0.731**. T=0.5: logits [2, 0] → 7.389/8.389 ≈ **0.881**.</details>

**Q5.** Probabilities [0.5, 0.3, 0.1, 0.05, 0.05]. With top-p = 0.85, which tokens remain?
<details><summary>Answer</summary>Cumulative: 0.5, 0.8, 0.9 ≥ 0.85 → the first **three** tokens.</details>

**Q6.** Which settings for (a) extracting fields from invoices into JSON, (b) writing poems?
<details><summary>Answer</summary>(a) temperature 0 to 0.2 (plus structured output). (b) temperature ~0.8 to 1.0 with top-p ~0.95.</details>

**Q7.** Your chatbot forgot what the user said 3 messages ago. Why might that happen?
<details><summary>Answer</summary>LLMs are stateless; the app must resend history. It may have truncated history to fit the context window or budget, or failed to include it.</details>

**Q8.** What is the KV cache and why does it make generation faster?
<details><summary>Answer</summary>Stored keys and values of all previous tokens for each layer; each new token only computes its own K/V/Q instead of recomputing the whole sequence.</details>

**Q9.** Using FLOPs ≈ 6ND, how much compute to train a 1B-parameter model on 20B tokens?
<details><summary>Answer</summary>6 × 10⁹ × 2×10¹⁰ = **1.2 × 10²⁰ FLOPs**.</details>

**Q10.** By the Chinchilla rule, how many tokens for a compute-optimal 13B model?
<details><summary>Answer</summary>≈ 20 × 13B = **260B tokens**.</details>

**Q11.** You ask a base model "What is 2+2?" and it replies "What is 3+3? What is 4+4?". Why?
<details><summary>Answer</summary>A base model only continues text; it hasn't been instruction-tuned, so it continued the pattern of a quiz list.</details>

**Q12.** Give three causes of hallucination and three mitigations.
<details><summary>Answer</summary>Causes: training rewards plausible text; lossy knowledge of rare facts; no default abstention; knowledge cutoff; false premises. Mitigations: RAG grounding, tools, allowing "I don't know", low temperature, verification, citations.</details>

**Q13.** API price: $1/M input, $4/M output. 1M requests/month, 800 input + 200 output tokens each. Monthly cost?
<details><summary>Answer</summary>Input 800M tokens → $800. Output 200M → $800. Total **$1,600**.</details>

---

## 23. New words in this file

| Word | Meaning |
|---|---|
| LLM | Large decoder-only Transformer trained on next-token prediction, then aligned |
| Token, vocabulary, token ID | Text chunk / set of chunks / its integer |
| Tokeniser | Program converting text ↔ tokens |
| BPE, byte-level BPE | Merge-most-frequent-pair algorithm / starting from bytes |
| WordPiece, Unigram, SentencePiece, tiktoken | Other tokeniser algorithms/libraries |
| Glitch token | Rare token causing odd behaviour |
| Special tokens: BOS, EOS, PAD | Start, end, padding markers |
| Roles: system, user, assistant, tool | Chat message types |
| Chat template | Format turning messages into one token sequence |
| Context window / length, truncation | Max tokens in+out / cutting text to fit |
| Stateless | No memory between calls |
| Lost in the middle, effective context | Weaker use of mid-context info / usable context length |
| Per-token pricing, input vs output tokens | API billing model |
| Prompt caching (preview) | Discounted reuse of a repeated prompt prefix |
| Next-token prediction, logits, logprobs | Core task / raw scores / log-probabilities |
| Autoregressive generation, streaming | One token at a time fed back / sending tokens as produced |
| Decoding strategy | How the next token is chosen |
| Greedy decoding, beam search, length penalty | Argmax / keep top-B sequences / favour longer outputs |
| Sampling, temperature | Random choice by probability / sharpness control |
| Top-k, top-p (nucleus), min-p | Filtering candidate tokens before sampling |
| max_tokens, stop sequence, finish reason | Output length cap / ending strings / why generation stopped |
| Repetition / frequency / presence penalty, logit bias | Controls on token choice |
| Seed, non-determinism | Repeatability / run-to-run variation |
| Constrained decoding / structured output (preview) | Forcing valid formats (file 22) |
| KV cache | Stored keys/values for fast generation |
| Prefill vs decode | Process prompt in parallel vs generate token by token |
| TTFT, time per output token | Latency measures (file 27) |
| Compute-bound vs memory-bandwidth-bound | Limited by maths vs data movement |
| PagedAttention, vLLM (preview) | Efficient KV memory management / serving engine |
| Pretraining, corpus, Common Crawl | First training phase / text collection / web scrape |
| Deduplication, data mixture | Removing repeats / balance of data sources |
| FLOP, 6ND rule | Floating-point operation / training compute estimate |
| Knowledge cutoff | Date after which the model has no training data |
| Scaling laws, power law | Predictable improvement with scale |
| Chinchilla, compute-optimal, ~20 tokens/parameter | Optimal data/size balance |
| Over-training for inference | Smaller model, more data, cheaper to run |
| Emergent abilities | Capabilities appearing with scale |
| In-context learning, zero/one/few-shot | Learning from prompt examples |
| Base model vs instruct/chat model | Raw continuation vs aligned assistant |
| SFT, RLHF, DPO (preview) | Alignment methods (file 21) |
| Hallucination: factual vs faithfulness | Made-up content: contradicts world vs contradicts source |
| Grounding | Basing answers on provided sources |
| Sycophancy | Agreeing too readily with the user |
| Test-time compute | Spending more computation while answering |
| Chain-of-thought (CoT) | Writing reasoning steps before answering |
| Reasoning model, thinking tokens | Model trained to reason at length before answering |
| Self-consistency, best-of-N, verifier | Sample many, vote / pick best by checker |
| Overthinking | Excessive reasoning on easy problems |
| Closed vs open-weight models | API-only vs downloadable weights |
| Licence (Apache 2.0, MIT, custom) | Terms of use |

**Next:** [21-training-finetuning-alignment.md](21-training-finetuning-alignment.md)
