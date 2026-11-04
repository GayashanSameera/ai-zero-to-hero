# 27: Inference and Serving: Making Models Fast and Affordable

> **Before you start:** [05](05-math-linear-algebra.md#16-why-gpus) (GPUs, VRAM, Tensor Cores), [07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers) (percentiles p50/p95/p99), [15](15-neural-networks.md#20-gpus-memory-and-mixed-precision) (GPU memory, mixed precision), [19](19-transformers.md) (attention cost, GQA, FlashAttention, RoPE), [20](20-how-llms-work.md) (prefill vs decode, KV cache, TTFT, sampling, token pricing), [21](21-training-finetuning-alignment.md#19-distillation-quantisation-pruning) (quantisation, distillation, MoE, LoRA adapters).
>
> **After this file you can:** explain what limits LLM inference speed; calculate latency, throughput, GPU memory and maximum concurrency; describe how serving systems (continuous batching, PagedAttention, prefix caching, speculative decoding, quantisation) make LLMs fast and cheap; choose a serving stack; and run models on your own machine.

---

## Table of contents

1. [Training vs inference](#1-training-vs-inference)
2. [The two phases again: prefill and decode](#2-prefill-and-decode)
3. [Compute-bound vs memory-bound (arithmetic intensity)](#3-compute-vs-memory-bound)
4. [Latency and throughput metrics](#4-latency-and-throughput-metrics)
5. [GPU memory math](#5-gpu-memory-math)
6. [Batching: static, dynamic, continuous](#6-batching)
7. [PagedAttention and prefix caching](#7-pagedattention-and-prefix-caching)
8. [Chunked prefill and disaggregated serving](#8-chunked-prefill-and-disaggregation)
9. [Speculative decoding](#9-speculative-decoding)
10. [Quantisation for inference](#10-quantisation-for-inference)
11. [Long context at inference](#11-long-context-at-inference)
12. [Parallelism for serving big models](#12-parallelism-for-serving)
13. [Serving engines and tools](#13-serving-engines)
14. [Hardware choices](#14-hardware-choices)
15. [Cost per token and capacity planning](#15-cost-and-capacity)
16. [Running LLMs on your own machine](#16-running-locally)
17. [Benchmarking honestly](#17-benchmarking-honestly)
18. [Inference optimisation for classic ML and smaller models](#18-classic-ml-inference)
19. [Check yourself](#19-check-yourself)
20. [New words in this file](#20-new-words-in-this-file)

---

## 1. Training vs inference

**Why it matters:** training gets the headlines, but training happens once. Serving happens every time anyone uses the product, so that is where most of the money and engineering effort goes.

| | Training | Inference |
|---|---|---|
| Goal | Learn parameters | Use the model to make predictions |
| Happens | Once (or occasionally) | Millions of times, continuously |
| Cost driver | Total compute | Cost **per request** × huge volume |
| Key metrics | Time to train, final quality | **Latency**, **throughput**, **cost**, reliability |
| Memory | Weights + gradients + optimiser + activations (16+ bytes/param) | Weights + **KV cache** (+ small activations) |

For a successful product, **total inference cost usually far exceeds training cost**. That's why inference optimisation is a big field and a big job market.

---

### A worked example: the same 7B model in two jobs

- **Training** a 7-billion-parameter model with the usual recipe needs about 16 bytes per parameter (weights, gradients, optimiser state): 7×10⁹ × 16 = **112 GB**, before activations.
- **Inference** needs only the weights in 16-bit form: 7×10⁹ × 2 bytes = **14 GB**, plus the KV cache for the requests being served.

So a model that needed a cluster to train can often be served from one GPU.

**Where the cost lands:** imagine a company trains a model once for a few weeks, then serves 5 million requests a day for two years. After a few months the cumulative serving bill is bigger than the training bill, which is why saving even 20% per request matters.

**Latency, throughput and cost in a kottu shop:**

| Serving term | Kottu shop |
|---|---|
| Latency | How long one customer waits for their kottu |
| Throughput | Kottu made per hour by the whole shop |
| Cost | Gas, flour and wages per kottu |
| Batching | Chopping 5 kottu on the hot plate together: more per hour, but the first customer waits slightly longer |

**Where you'll meet it in real work:** every "model deployment" job: choose hardware, pick a serving engine, measure p95 latency, and keep the cost per request under budget.

**Common mistakes:**
- Planning GPU memory with the training formula (16 bytes/param) instead of the inference one.
- Forgetting that inference cost scales with traffic, not with how long you trained.

**Exam angle:** NCA-GENL-style questions contrast training and inference: inference needs weights plus KV cache, is judged by latency/throughput/cost, and dominates lifetime cost.

> **සිංහලෙන්:** Training කියන්නේ model එක එක පාරක් ඉගැන්නුවා වගේ වැඩක්, ඒත් inference කියන්නේ user කෙනෙක් ඇහුවම ඇහුවම ඒක run කරන එක, දවසට ලක්ෂ ගණන් වාරයක්. බිලියන 7ක parameter model එකක් train කරන්න බයිට් 16 බැගින් ඕනේ (GB 112ක් විතර), ඒත් serve කරන්න 16-bit weights ඉතුරු කරාම GB 14ක් විතරයි. Kottu කඩේ වගේ හිතන්න: latency = එක customer ට kottu ලැබෙන්න යන වෙලාව, throughput = පැයකට හදන kottu ගාන, cost = ගෑස්, පිටි, වැටුප්. Product එක සාර්ථක නම් කාලයක් යනකොට inference වියදම training වියදමට වඩා ගොඩක් වැඩි වෙනවා.


## 2. Prefill and decode

**Why it matters:** the two phases behave very differently on a GPU. Knowing which phase a problem belongs to tells you what to fix: slow first word (prefill) or slow typing speed (decode).

From [file 20](20-how-llms-work.md#12-the-kv-cache):

| Phase | Work | Parallel? | Bottleneck | Drives |
|---|---|---|---|---|
| **Prefill** | Process all prompt tokens at once, fill the KV cache, produce the 1st output token | Yes, across all prompt tokens | **Compute** (lots of matrix multiplications) | **TTFT** (time to first token) |
| **Decode** | Generate one token at a time | Only across different requests in a batch | **Memory bandwidth** (load all weights + KV cache for each token) | **Time per output token** |

**Analogy:** prefill is reading the whole question paper at once (fast, parallel); decode is writing the answer one word at a time, each time flipping through your entire notebook (the weights) to choose the next word.

---

### A worked example: counting forward passes

A user sends a 1,000-token prompt and the model writes a 200-token answer.
- **Prefill:** **1** forward pass processes all 1,000 prompt tokens together and produces the 1st output token.
- **Decode:** the other 199 tokens need **199** more passes, one token each.
- So only 1 of 200 passes is the big parallel one; almost all the passes are small and sequential, and each must re-read the weights.

```
time ─►
│ PREFILL (parallel, compute heavy) │ d │ d │ d │ d │ d │ ... │   d = decode step
└─ user waits: this is TTFT         ┘ └─ streaming: each d = one new word appears
```

**Streaming** sends each token to the user as soon as it is produced, so the page starts filling after TTFT instead of making the user wait for the whole answer. The total time is the same, but it feels faster.

| Symptom | Likely phase | Likely fix |
|---|---|---|
| Long pause before any text | Prefill / queueing | Shorter prompt, prefix caching, more compute |
| Text appears slowly | Decode | Quantise, smaller model, speculative decoding, more bandwidth |

**Where you'll meet it in real work:** a RAG chatbot with a 6,000-token retrieved context has a visible pause before the first word (prefill). Cutting the context to the best 3 chunks helps the pause; it does not change the typing speed.

**Common mistakes:**
- Thinking generation is one big parallel calculation (only the prompt is parallel).
- Optimising decode speed when the real complaint is time to first token.

**Exam angle:** know prefill (compute-bound, sets TTFT) vs decode (memory-bound, sets time per output token).

> **සිංහලෙන්:** LLM එකක් ප්‍රශ්නයකට උත්තර දෙද්දී අදියර දෙකක් තියෙනවා. Prefill එකේදී ඔයාගේ prompt එකේ tokens ඔක්කොම එකවර process කරනවා (ප්‍රශ්න පත්‍රය මුළුමනින්ම එක පාරට කියවනවා වගේ). Decode එකේදී උත්තරය token එකින් එක ලියනවා, හැම token එකකටම model එකේ weights ඔක්කොම නැවත කියවන්න වෙනවා. Tokens 1,000ක prompt එකකට tokens 200ක උත්තරයක් නම් prefill එක 1 පාරයි, decode පාර 199යි. පළවෙනි වචනේට කලින් ඉන්න වෙලාව TTFT, ඊට පස්සේ වචන එන වේගය TPOT. Streaming කරාම උත්තරේ ටික ටික පෙනෙන නිසා user ට වේගවත් බවක් දැනෙනවා.


## 3. Compute vs memory bound

**Why it exists:** a GPU is a factory with two limits: how fast it can calculate and how fast materials arrive. If you do not know which limit you hit, you will spend money on the wrong upgrade.

A GPU has two key limits:
- **Compute:** how many FLOPs per second it can do (e.g. ~1,000 TFLOP/s of BF16 for an H100-class GPU, i.e. 10¹⁵)
- **Memory bandwidth:** how fast data moves from GPU memory (**HBM**, High Bandwidth Memory) to the compute units (e.g. ~3.35 TB/s for H100)

**Arithmetic intensity** = FLOPs performed ÷ bytes moved from memory.

- If intensity is **high**, the GPU waits on maths → **compute-bound**
- If intensity is **low**, the GPU waits for data → **memory-bound**

The GPU's "balance point" ≈ 10¹⁵ FLOP/s ÷ 3.35×10¹² B/s ≈ **~300 FLOPs per byte**.

### Decode is memory-bound

For each new token, a dense model performs about **2 FLOPs per parameter** (one multiply + one add) and must read **every weight** from memory (2 bytes each in BF16). Intensity ≈ 2 FLOPs / 2 bytes = **1 FLOP per byte** for batch size 1. That's far below 300, so the GPU is mostly idle, waiting for memory.

**Decode speed limit (batch size 1):**
```
tokens per second ≈ memory bandwidth ÷ bytes of weights
```

**Worked example:** 8B model in BF16 = 16 GB of weights; GPU bandwidth 3.35 TB/s:
3,350 GB/s ÷ 16 GB ≈ **~210 tokens/s** (theoretical maximum; real systems reach maybe 60 to 80% of this)

**Two consequences:**
1. **Quantisation speeds up decode:** INT4 weights (≈4 GB) → ~4× fewer bytes to read → up to ~4× faster (section 10)
2. **Batching is nearly free:** reading the weights once can serve **many** requests' tokens at the same time; intensity rises with batch size. That's how servers get high throughput (section 6).

### Prefill is compute-bound

With a 2,000-token prompt, each weight is reused 2,000 times per load, so intensity is high. Prefill time ≈ 2 × parameters × prompt_tokens ÷ effective FLOP/s.

**Example:** 8B model, 2,000-token prompt: 2 × 8×10⁹ × 2,000 = 3.2×10¹³ FLOPs; at an effective 5×10¹⁴ FLOP/s → **~64 ms**.

---

### More worked examples

**A 70B model on one GPU.**
- BF16 weights: 70×10⁹ × 2 = **140 GB**. Does not fit on an 80 GB GPU.
- INT4 weights: about 70×10⁹ × 0.5 = **35 GB** (plus some overhead). Fits.
- Decode limit at batch 1 ≈ 3,350 GB/s ÷ 35 GB ≈ **96 tokens/s** (theoretical).

**Why batching is almost free.** At batch 1, the GPU reads 16 GB of weights to produce 1 token. At batch 32 it reads the *same* 16 GB once and produces 32 tokens (one per user).
- Intensity rises from ~1 to ~32 FLOPs per byte, still well below the ~300 balance point, so the step takes about the same time.
- Theoretical throughput ≈ 32 × 210 ≈ **6,700 tokens/s** for the GPU as a whole (real numbers are lower, because KV cache reads and scheduling also cost time).

```
   speed ▲                   ┌──────── compute roof (balance ≈ 300 FLOPs/byte)
         │                 ╱
         │              ╱      ← slope = memory-bound region
         │           ╱            (decode at small batch lives here)
         │        ╱
         └───────────────────────► arithmetic intensity (FLOPs per byte)
```

**Where you'll meet it in real work:** when someone says "buying a GPU with more TFLOPs will not make our chatbot type faster", this is why: decode needs bandwidth. A card with higher memory bandwidth, or a smaller (quantised) model, helps more.

**Common mistakes:**
- Using the compute rating (TFLOPs) to predict decode speed.
- Forgetting the KV cache also has to be read each step.
- Believing the theoretical limit is reachable in practice (expect 60 to 80% at best).

**Exam angle:** "LLM decoding is memory-bandwidth bound", "batching raises arithmetic intensity", "quantisation helps decode by reducing bytes read".

> **සිංහලෙන්:** GPU එකක සීමා දෙකක් තියෙනවා: ගණනය කරන වේගය (compute) සහ memory එකෙන් data එන වේගය (bandwidth). Decode කරද්දී හැම token එකටම model එකේ weights ඔක්කොම memory එකෙන් කියවන්න ඕනේ, ඒත් කරන ගණනය පොඩියි, ඒ නිසා GPU එක බලා ඉන්නේ data එන්න, ඒකට memory-bound කියනවා. GB 16ක model එකක් 3,350 GB/s bandwidth එකකින් කියවනවා නම් තත්පරයට tokens 210ක් විතර උපරිමයි. Users 32 දෙනෙක් එකවර serve කරද්දී weights එක පාරක් කියවලා සියලුදෙනාටම token එකක් හදන්න පුළුවන්, ඒ නිසා batching සෑහෙන තරම් නොමිලේ. Quantisation කරාම කියවන bytes අඩු වෙන නිසා decode වේගවත් වෙනවා.


## 4. Latency and throughput metrics

**Why it exists:** "it is fast" means nothing without numbers. These metrics say exactly what a user feels (waiting, typing speed) and what the business pays (throughput).

| Metric | Meaning | Matters for |
|---|---|---|
| **TTFT** (Time To First Token) | Request sent → first token received (queueing + prefill) | Chat responsiveness ("is it thinking?") |
| **TPOT / ITL** (Time Per Output Token / Inter-Token Latency) | Average time between output tokens | Streaming smoothness; reading speed (~5 to 10 tokens/s is faster than people read) |
| **E2E latency** | Total time for the full response | Non-streaming uses, agents, pipelines |
| **Throughput** | Tokens (or requests) per second the **whole system** handles | Cost efficiency |
| **Goodput** | Throughput of requests that **meet the latency targets** (SLOs) | Real useful capacity |

```
E2E latency ≈ TTFT + TPOT × (output_tokens − 1)
```

**Worked example:** TTFT = 0.4 s, TPOT = 25 ms, 300 output tokens:
E2E ≈ 0.4 + 0.025 × 299 ≈ 0.4 + 7.5 = **7.9 s**

**Report percentiles, not averages** ([file 07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers)): p50 (typical), **p95/p99** (the slow tail that frustrates users). An average of 1 s may hide 5% of requests taking 10 s.

**SLO (Service Level Objective):** a target such as "p95 TTFT < 1 s and p95 TPOT < 50 ms".

### The latency–throughput trade-off

Bigger batches → higher throughput (more tokens/s overall, cheaper per token) but each request's TPOT gets slower (more work per step), and TTFT can rise while requests wait. Serving is about finding the best balance for your SLOs.

### Little's Law

```
average number of requests in the system = arrival rate × average time in system
```

**Example:** 20 requests/s arrive, each takes 8 s end to end → on average **160 concurrent requests** must be handled. Your system must support that concurrency (section 5).

---

### Averages hide the slow tail

100 requests: 94 finish in 1 s and 6 take 10 s.
- Mean = (94 × 1 + 6 × 10)/100 = 154/100 = **1.54 s**: looks fine
- p50 = **1 s**; p95 = **10 s**: one in twenty users waits ten times longer

### Little's Law, a second example

5 requests per second arrive and each stays in the system for 4 s: 5 × 4 = **20 requests** in the system at any moment. If your KV cache can hold only 12, a queue will build up.

### Checking an SLO

SLO: p95 TTFT < 1 s and p95 TPOT < 50 ms. Measured: p95 TTFT = 0.8 s, p95 TPOT = 62 ms. TTFT passes, TPOT fails, so this configuration does **not** meet the SLO even though throughput looks great. Goodput counts only requests that meet both targets.

```
 throughput ▲                       ╱ ← past the knee, latency explodes
            │            ╱‾‾‾‾‾‾‾‾
            │        ╱             for the same load:
            │     ╱                 bigger batch = more tokens/s
            └────────────────────► but slower per-user typing
                     load / batch size
```

**Where you'll meet it in real work:** a customer-care bot has an SLO written in the contract. The on-call engineer watches p95 TTFT on a dashboard and adds replicas when it approaches the limit.

**Common mistakes:**
- Reporting mean latency only.
- Mixing up TTFT (before the first word) and TPOT (between words).
- Optimising throughput until the per-user latency becomes unacceptable.

**Exam angle:** know TTFT, TPOT/ITL, E2E ≈ TTFT + TPOT × (tokens − 1), throughput vs goodput, p95/p99, and Little's Law.

> **සිංහලෙන්:** "වේගවත්" කියන්න එපා, අංක වලින් කියන්න. TTFT = පළවෙනි වචනේ එනකම් යන වෙලාව, TPOT = වචන අතර වෙලාව. TTFT 0.4s, TPOT 25ms, tokens 300ක් නම් මුළු වෙලාව ≈ 0.4 + 0.025×299 = 7.9s. සාමාන්‍යය (mean) විතරක් බලන්න එපා. Requests 100න් 94ක් තත්පර 1ක් ගත්තත් 6ක් තත්පර 10ක් ගත්තොත් mean එක 1.54s, ඒත් p95 = 10s, එතකොට දරුණු user ලා 5%ක් තරහ වෙනවා. තත්පරයට requests 5ක් එනවා, හැම එකක්ම තත්පර 4ක් ඉන්නවා නම් එකවර requests 20ක් handle කරන්න ඕනේ (Little's Law).


## 5. GPU memory math

**Why it exists:** a GPU has a fixed amount of memory. Before buying or renting one, you must know whether the model fits and how many users it can serve at once.

**Total GPU memory needed ≈ weights + KV cache + activations/overhead**

### Weights

```
weights memory = parameters × bytes per parameter
```

| Model | FP16/BF16 (2 B) | FP8/INT8 (1 B) | INT4 (~0.5 B + overhead) |
|---|---|---|---|
| 8B | 16 GB | 8 GB | ~5 GB |
| 70B | 140 GB | 70 GB | ~40 GB |
| 405B | 810 GB | 405 GB | ~230 GB |

**MoE models** ([file 21](21-training-finetuning-alignment.md#20-mixture-of-experts)): **all** experts must be in memory (total parameters), even though only active parameters are used per token. Memory scales with total, speed with active.

### KV cache

From [file 20](20-how-llms-work.md#12-the-kv-cache):

```
KV bytes per token = 2 × layers × KV_heads × head_dim × bytes_per_value
KV total = KV bytes per token × tokens per sequence × number of concurrent sequences
```

**Worked example:** Llama-3-8B-like model: 32 layers, 8 KV heads, head_dim 128, BF16:
per token = 2 × 32 × 8 × 128 × 2 = **131,072 bytes ≈ 128 KB**

### Maximum concurrency

On an **80 GB GPU** serving this 8B model in BF16:
- Weights: 16 GB; overhead/activations: ~4 GB → **~60 GB free for KV cache**
- If each request uses up to 4,096 tokens (prompt + output): 4,096 × 128 KB = **512 MB per request**
- Max concurrent requests ≈ 60 GB / 0.5 GB ≈ **~120**

With 32k-token contexts: 4 GB per request → only ~15 concurrent. **Long contexts eat concurrency.**

**Ways to fit more:** GQA/MQA models (fewer KV heads), **KV cache quantisation** (FP8/INT8 halves it), PagedAttention (no waste, section 7), shorter max lengths, more GPUs.

---

### A second worked example: a 70B model

Assume 80 layers, 8 KV heads, head_dim 128, BF16:
- KV per token = 2 × 80 × 8 × 128 × 2 = **327,680 bytes ≈ 320 KB** (2.5× the 8B model above)
- One 8,192-token conversation: 8,192 × 320 KB ≈ **2.7 GB**
- Two 80 GB GPUs = 160 GB. Weights take 140 GB (BF16), so ~20 GB is left; after ~6 GB overhead that is ~14 GB → about **5 concurrent 8k conversations**. Quantising the weights to INT4 (~40 GB) would free about 100 GB more and allow roughly 40.

### Checking the 7B example from the old Sinhala course

7B parameters in FP16 = 7×10⁹ × 2 = **14 GB**; in 4-bit = 7×10⁹ × 0.5 = **3.5 GB**. That moves a 7B model from "needs a 24 GB GPU" to "runs on an 8 GB GPU or a good laptop" (the KV cache and overhead still need extra room).

```
 GPU memory (80 GB)
 ┌───────────────┬─────────────────────────────┬────────┐
 │ weights 16 GB │ KV cache pool ≈ 60 GB       │overhead│
 └───────────────┴─────────────────────────────┴────────┘
                  ▲ this part decides how many users fit
```

| Model size (BF16) | Weights | Fits on one 80 GB GPU? |
|---|---|---|
| 8B | 16 GB | Yes, lots of room for KV |
| 34B | 68 GB | Barely; very little KV room |
| 70B | 140 GB | No (needs 2+ GPUs or quantising) |

**Where you'll meet it in real work:** a capacity-planning meeting: "Our users send up to 8k-token documents. How many GPUs do we need for 100 users at once?" is answered with exactly this arithmetic.

**Common mistakes:**
- Counting only the weights and forgetting the KV cache.
- Using total layers instead of KV heads (grouped-query attention models have far fewer KV heads than attention heads).
- Assuming memory is the only limit: bandwidth and compute matter too.

**Exam angle:** be able to compute weights = params × bytes and KV per token = 2 × layers × KV_heads × head_dim × bytes; know that long contexts reduce concurrency.

> **සිංහලෙන්:** GPU එකක memory එක සීමිතයි. Model එක පිරෙනවද, එකවර user ලා කී දෙනෙක්ට serve කරන්න පුළුවන්ද කියලා දැනගන්න ගණන් කරනවා. Weights = parameters × bytes එකක්. බිලියන 7ක model එක FP16 වලින් GB 14යි, 4-bit වලින් GB 3.5යි. ඊට අමතරව හැම user කෙනෙක්ගේම conversation එකකට KV cache ඉඩක් ඕනේ. 80 GB GPU එකක 8B model එක (GB 16) දැම්මාම GB 60ක් විතර KV cache එකට ඉතුරු වෙනවා, user කෙනෙකුට tokens 4,096 බැගින් GB 0.5ක් යනවා නම් එකවර 120ක් විතර serve කරන්න පුළුවන්. Context එක දිග වුණොත් කෙනෙකුට යන ඉඩ වැඩි වෙලා එකවර serve කරන ගාන ගොඩක් අඩු වෙනවා.


## 6. Batching

**Why it exists:** a GPU is most efficient when it works on many requests at once. Batching is the art of grouping requests without making anyone wait too long.

### Static batching

Wait for a group of requests, process them together until **all** finish. Problem: requests have different output lengths; short ones finish early and their slots sit **idle** until the longest one ends; new requests must wait.

```
Static batch:
req A: ████████████████████████  (long)
req B: ██████░░░░░░░░░░░░░░░░░░  (finished early, slot wasted ░)
req C: ███████████░░░░░░░░░░░░░
```

### Dynamic batching

Collect requests for a short window (e.g. 10 ms) or until the batch is full, then run. Good for fixed-size models (classifiers, embeddings) where every request takes similar time.

### Continuous (in-flight) batching: the key LLM serving technique

Schedule at the level of **each decode step**: when a request finishes, a waiting request **immediately** takes its slot. The batch composition changes every iteration.

```
Continuous batching:
slot 1: A A A A A A A A A A A A
slot 2: B B B B D D D D D D D F F    ← D joins as soon as B finishes
slot 3: C C C C C C E E E E E E E    ← E joins when C finishes
```

Result: GPU stays busy; throughput often **several times higher** than static batching, with lower waiting time. Standard in vLLM, TensorRT-LLM, SGLang, TGI.

---

### A worked example: how much GPU time static batching wastes

Four requests are batched. Their answers need 20, 50, 100 and 400 tokens.
- A static batch runs until the longest finishes: 400 steps × 4 slots = **1,600 slot-steps** available.
- Actually used: 20 + 50 + 100 + 400 = **570**.
- Utilisation = 570/1,600 = **35.6%**. Nearly two thirds of the GPU's slots sat idle while waiting for the 400-token request.

With continuous batching, as soon as the 20-token request ends, a waiting request takes its slot at the next step, so slots stay almost full.

**Bus analogy:** static batching is a bus that waits at the terminus until *every* passenger gets off before anyone new boards. Continuous batching refills each empty seat at every stop.

| Strategy | Good for | Weakness |
|---|---|---|
| Static | Offline jobs with equal-length outputs | Idle slots, long waits |
| Dynamic (collect for ~10 ms) | Classifiers, embeddings, fixed-time models | Not suited to variable-length generation |
| Continuous | LLM chat and APIs | Needs a smart scheduler (vLLM, TensorRT-LLM, SGLang) |

**Where you'll meet it in real work:** nearly every LLM server you deploy (vLLM, TensorRT-LLM, TGI) uses continuous batching by default. Your job is mostly to set the max batch size and the memory limit sensibly.

**Common mistakes:**
- Using static batching for chat workloads.
- Raising batch size endlessly: past a point per-user latency violates the SLO.
- Forgetting that batch size is also limited by KV memory.

**Exam angle:** continuous (in-flight) batching schedules per decode step so finished requests are replaced immediately; it raises throughput and cuts waiting.

> **සිංහලෙන්:** Batching කියන්නේ requests කීපයක් එකතු කරලා GPU එකට එකවර දෙන එක. Static batching වලදී requests 4ක උත්තර දිග tokens 20, 50, 100, 400 නම්, සියල්ලම 400 ක් වෙනකම් බලාගෙන ඉන්න වෙනවා. එතකොට slots 1,600න් පාවිච්චි වෙන්නේ 570ක් විතරයි, ඒ කියන්නේ 35.6%ක්. බස් එක ඔක්කොම මගීන් බහින්නකම් අලුත් අය නොනඟින්න බලාගෙන ඉන්නවා වගේ. Continuous batching වලදී එක request එකක් ඉවර වුණු ගමන් ඊළඟ එක ඒ තැනට එනවා, ඒ නිසා GPU එක හැමවෙලේම කාර්යබහුලයි. Throughput ගොඩක් වැඩියි.


## 7. PagedAttention and prefix caching

**Why it exists:** reserving memory "just in case" wastes most of it. Paging gives each request only what it uses, and prefix caching avoids repeating work that many requests share.

### The KV memory problem

Naively, each request **reserves** KV memory for the **maximum** possible length (e.g. 4,096 tokens), even if it only uses 300. The waste (**fragmentation**) can be 60 to 80% of KV memory, which severely limits concurrency.

### PagedAttention (vLLM)

Inspired by **virtual memory** in operating systems: split the KV cache into small fixed-size **blocks** (pages), e.g. 16 tokens each. A request gets new blocks **only as it grows**; blocks don't need to be contiguous; a **block table** maps each request's logical positions to physical blocks.

✅ Near-zero waste → many more concurrent requests → much higher throughput.
✅ Enables **sharing** blocks between requests.

### Prefix caching

Many requests share the **same beginning**: the same system prompt, tool definitions, few-shot examples, or document. With prefix caching, the KV blocks for a shared prefix are computed **once** and reused.

✅ Skips most of the prefill for repeated prefixes → much lower TTFT and cost. This is the server-side mechanism behind API **prompt caching** ([file 22](22-prompt-engineering.md#16-streaming-errors-retries-caching)). Same rule: put stable content first.

**Preemption:** when KV memory runs out, the scheduler can pause a request (swap its KV to CPU memory, or drop and recompute later) to let others proceed.

---

### A worked example: waste with and without paging

One request reserves room for 4,096 tokens but only uses 300.
- Naive: wasted = 4,096 − 300 = 3,796 tokens → **92.7% of that request's reservation is empty**.
- Paged with 16-token blocks: 300 ÷ 16 = 18.75, so 19 blocks = 304 tokens; waste = 4 tokens → **about 1.3%**.

```
Naive:  [ used 300 ][ ........ reserved but empty (3,796) ........ ]
Paged:  [blk][blk][blk]...[blk(partly full)]   ← new blocks only when needed
        blocks can sit anywhere in memory; a block table maps them
```

### A worked example: prefix caching

A support bot has a 1,500-token system prompt (rules, tool descriptions, examples) shared by every request. 1,000 requests arrive.
- Without caching: prefill work on the prefix = 1,000 × 1,500 = **1,500,000 tokens**.
- With prefix caching: computed once = **1,500 tokens** (99.9% saved on that part), so a much lower TTFT and cost.

For this to work, put stable content (system prompt, documents) **first** and the changing user question **last**. Insert today's date or a user name at the very top and every request looks different, so the cache never hits.

**Where you'll meet it in real work:** API "prompt caching" discounts are the commercial face of this idea. Self-hosting vLLM with prefix caching switched on can serve a RAG app that reuses the same long document very cheaply.

**Common mistakes:**
- Placing changing text (timestamps, request IDs) at the start of the prompt, which breaks caching.
- Thinking paging changes model outputs (it does not, only memory management).

**Exam angle:** PagedAttention = OS-style paging for the KV cache (less fragmentation, more concurrency); prefix caching = reuse KV of shared prompt beginnings.

> **සිංහලෙන්:** හැම request එකකටම උපරිම දිගට (tokens 4,096) memory වෙන් කරලා තිබ්බොත්, ඇත්තටම tokens 300ක් විතරක් පාවිච්චි වුණොත් 92.7%ක් නිකම් නාස්ති වෙනවා. PagedAttention වලින් KV cache එක පොඩි blocks (tokens 16) වලට කඩලා, ඕනේ වෙනකොට විතරක් අලුත් block එකක් දෙනවා, එතකොට නාස්තිය 1%ක් විතර. ඒ වගේම හැම request එකටම එකම system prompt එක (tokens 1,500ක්) තියෙනවා නම් prefix caching වලින් ඒක එක පාරක් විතරයි ගණනය කරන්නේ, requests 1,000කදී 99.9%ක් ඉතුරුයි. ඒකට prompt එකේ මුලින්ම වෙනස් නොවන දේවල්, අන්තිමට user ගේ ප්‍රශ්නය දාන්න.


## 8. Chunked prefill and disaggregation

**Why it exists:** one huge prompt should not freeze everyone else's streams, and because prefill and decode need different hardware strengths, mixing them on one GPU is not always the best use.

**Problem:** a huge prefill (e.g. a 50k-token document) can block decode steps for everyone else, causing a visible stall in other users' streams.

**Chunked prefill:** split long prefills into chunks (e.g. 512 tokens) and mix them with decode steps of other requests in each iteration. Smoother TPOT for all.

**Disaggregated (split) serving:** run prefill and decode on **different GPU pools**, since they have different bottlenecks (compute vs memory). The KV cache is transferred from prefill workers to decode workers. Each pool can be sized and tuned independently. Used at large scale (e.g. NVIDIA Dynamo, vLLM, SGLang support variants).

---

### A worked example: how long does a big prompt block the GPU?

An 8B model reading a 50,000-token document: FLOPs ≈ 2 × 8×10⁹ × 50,000 = 8×10¹⁴. At an effective 5×10¹⁴ FLOP/s that is about **1.6 s** (ignoring the extra attention cost for long inputs). During those 1.6 s, other users' streams would freeze.

With **chunked prefill** at 512 tokens per chunk: 50,000 ÷ 512 ≈ 98 chunks. Each chunk takes about 2 × 8×10⁹ × 512 / 5×10¹⁴ ≈ **16 ms**, and the server slips one chunk plus ordinary decode steps into every iteration. Other users see a small hiccup instead of a 1.6 s freeze.

```
without chunking:  [########## big prefill ##########] others stall
with chunking:     [chunk][d d d][chunk][d d d][chunk][d d d] ...   (d = others' decode steps)

disaggregated:     prefill GPUs ──(KV cache transfer)──► decode GPUs
```

**Where you'll meet it in real work:** a legal-document assistant where users upload 100-page PDFs while others chat. Chunked prefill keeps chat responsive. Very large providers also separate prefill and decode GPU pools.

**Common mistakes:**
- Assuming long-prompt users do not affect other users (they do, unless scheduling handles it).
- Ignoring the cost of moving the KV cache between pools in disaggregated setups.

**Exam angle:** chunked prefill smooths TPOT; disaggregated serving splits compute-bound prefill from memory-bound decode.

> **සිංහලෙන්:** එක user කෙනෙක් පිටු 100ක PDF එකක් (tokens 50,000ක්) එවනකොට prefill එකට තත්පර 1.6ක් විතර GPU එක පිරිලා යනවා, ඒ වෙලාවේ අනිත් users ලාගේ උත්තර නතර වෙලා පේනවා. Chunked prefill එකේදී ඒ prompt එක tokens 512 බැගින් කොටස් වලට කඩලා, හැම පියවරකටම එක කොටසක් විතරක් දාලා අනිත් අයගේ decode එකත් ඒ ළඟම කරනවා. එතකොට හැමෝටම පොඩි අඩුවක් විතරයි දැනෙන්නේ. Disaggregated serving කියන්නේ prefill GPUs එකතුවක් සහ decode GPUs එකතුවක් වෙන වෙනම තියෙන ක්‍රමය, මොකද ඒ දෙකේ අවශ්‍යතා වෙනස්.


## 9. Speculative decoding

**Why it exists:** decoding is stuck waiting for memory, and checking several tokens costs almost the same as producing one. Speculative decoding uses that spare capacity to get several tokens per big-model pass.

**Idea:** decoding is memory-bound, so verifying **several** tokens at once costs about the same as generating **one**. So:
1. A small, fast **draft** model (or another method) **guesses** the next k tokens (e.g. k = 4)
2. The big **target** model checks all k guesses in **one** forward pass (like a mini prefill)
3. **Accept** the longest prefix of guesses the target agrees with; at the first disagreement, use the target's own token instead

```
Draft proposes:    " the" " cat" " sat" " on"
Target verifies:     ✓      ✓      ✗ (target says " is")
Output this round: " the" " cat" " is"     → 3 tokens for ~1 big-model step
```

**Exactness:** with the proper acceptance rule (accept a drafted token with probability min(1, p_target/p_draft), else resample from an adjusted distribution), the output distribution is **identical** to the target model alone. No quality loss.

**Expected speedup:** if each drafted token is accepted with probability α, the expected tokens per target step with k drafts ≈ (1 − α^(k+1)) / (1 − α).
**Example:** α = 0.8, k = 4: (1 − 0.8⁵)/(1 − 0.8) = (1 − 0.328)/0.2 = **3.36 tokens per target pass**. The real speedup is lower after counting the draft model's cost (often 2 to 3× overall).

**Variants:**
- **Draft model:** a small model from the same family (same tokeniser)
- **Medusa / EAGLE:** extra prediction heads on the target model itself guess future tokens (no separate model)
- **Prompt lookup / n-gram drafting:** copy candidate tokens from the prompt (great for summarisation/editing where output repeats input)
- **Multi-token prediction:** models trained to predict several future tokens

**Best when:** low batch sizes (latency-sensitive), predictable text (code, structured output). Less benefit at very high batch sizes (already compute-heavy).

---

### More worked numbers

Expected tokens per target pass = (1 − α^(k+1)) / (1 − α).

| α (acceptance) | k = 4 | Calculation |
|---|---|---|
| 0.5 | 1.94 | (1 − 0.5⁵)/0.5 = (1 − 0.031)/0.5 |
| 0.8 | 3.36 | (1 − 0.8⁵)/0.2 = 0.672/0.2 |
| 0.9 | 4.10 | (1 − 0.9⁵)/0.1 = 0.410/0.1 |

**Turning it into real speedup.** Suppose the draft model costs about 10% of a target step per drafted token. With k = 4, one round costs 1 (target) + 4 × 0.1 (draft) = **1.4** target-steps. With α = 0.8 we gain 3.36 tokens, so speedup ≈ 3.36 / 1.4 = **2.4×**. A poor draft (α = 0.5) gives 1.94 / 1.4 = 1.4×, hardly worth the trouble.

**Good fit vs poor fit:** code and JSON are predictable (high α); creative writing is not. At very large batch sizes the GPU is already busy, so the spare capacity this trick uses is gone.

**Where you'll meet it in real work:** a coding assistant where each user wants the fastest possible streaming and traffic is moderate. Turning on speculative decoding gives the same answers, only faster.

**Common mistakes:**
- Believing it lowers quality: with correct acceptance it does not change the distribution.
- Using a draft model with a different tokeniser.
- Expecting the full k-fold speedup; the draft model's cost and rejections reduce it.

**Exam angle:** draft model guesses, target verifies in one pass; output distribution is identical to the target alone; helps latency at low to medium batch sizes.

> **සිංහලෙන්:** Decode එක memory එකට බලාගෙන ඉන්න වැඩක් නිසා, tokens කීපයක් එකවර check කරන එක එකක් හදනවා තරම්ම වියදමයි. ඒක පාවිච්චි කරලා, පොඩි draft model එකක් ඊළඟ tokens 4ක් අනුමාන කරනවා, ලොකු model එක ඒ ඔක්කොම එක පාරින් verify කරනවා. ඒකෙන් හරි ඒවා තියාගන්නවා, පළවෙනි වැරදි එකේදී ලොකු model එකේම token එක ගන්නවා. Acceptance 0.8ක් නම් එක pass එකකට tokens 3.36ක් ලැබෙනවා. Draft model එකටත් වියදමක් තියෙන නිසා ඇත්ත වේගය ගුණයක් 2.4ක් විතර. උත්තරයේ quality එක කිසිසේත්ම වෙනස් වෙන්නේ නෑ.


## 10. Quantisation for inference

**Why it exists:** weights dominate memory and decode reads all of them for each token. Storing weights with fewer bits makes the model smaller and faster at a small cost in precision.

From [file 21](21-training-finetuning-alignment.md#19-distillation-quantisation-pruning). In serving, the main choices:

| Scheme | What's quantised | Benefit | Typical tools |
|---|---|---|---|
| **Weight-only INT4/INT8** (e.g. W4A16) | Weights; activations stay 16-bit | Smaller memory; faster **decode** (memory-bound) at small batch | AWQ, GPTQ, GGUF (llama.cpp), bitsandbytes |
| **W8A8 (INT8)** | Weights + activations | Faster **matrix maths** too (prefill, large batches) on INT8 Tensor Cores | SmoothQuant |
| **FP8** (W8A8 in 8-bit floating point) | Weights + activations | ~2× throughput vs BF16 on Hopper/Blackwell GPUs, minimal quality loss | TensorRT-LLM, vLLM, Transformer Engine |
| **FP4 / NVFP4, MXFP4** | Newest GPUs | Even more throughput | Blackwell-generation |
| **KV cache quantisation** (FP8/INT8) | KV cache | ~2× more concurrency/context | vLLM, TensorRT-LLM |

**Methods in one line each:**
- **GPTQ:** quantises weights layer by layer, adjusting the remaining weights to compensate for errors (uses calibration data)
- **AWQ (Activation-aware Weight Quantisation):** protects the small fraction of weights that matter most (those connected to large activations) by scaling them before quantising
- **SmoothQuant:** moves the difficulty of activation outliers into the weights with a mathematically equivalent rescaling, making W8A8 accurate

**Calibration data:** a few hundred representative samples used to measure value ranges. Use data similar to real traffic (including your languages!).

**Always evaluate quality after quantising** on your own eval set ([file 26](26-evaluating-llms.md#17-eval-pipeline)), especially for maths, code, long context and non-English text, where degradation shows first.

---

### What "rounding" does: a 4-bit example

4 bits give 2⁴ = 16 levels. If the weights lie between −1 and +1, the step size is 2/15 = 0.133 and the levels are −1, −0.867, ... 0.333, 0.467, ...
- A weight of 0.37 is stored as the nearest level, **0.333**, an error of 0.037.
- Each weight gets a small error. Across billions of weights these mostly average out, but a few "outlier" weights or activations can hurt, which is why AWQ and SmoothQuant exist.

### Speed and size together (8B model, theoretical decode ceiling)

| Format | Weights | Bytes read per token | Ceiling at 3,350 GB/s |
|---|---|---|---|
| BF16 | 16 GB | 16 GB | ≈ 210 tokens/s |
| FP8 / INT8 | 8 GB | 8 GB | ≈ 420 tokens/s |
| INT4 | ~5 GB | ~5 GB | ≈ 670 tokens/s |

**Distillation and pruning (other ways to shrink).** Distillation trains a small "student" model to copy a large "teacher" (for example DistilBERT). Pruning removes weights that matter little. Quantisation, the most common in LLM serving, keeps the same model but stores it more compactly.

**Where you'll meet it in real work:** a team serves a 70B model in FP8 on two GPUs instead of four BF16 GPUs, halving hardware cost, after checking on their own test set that quality held. For Sinhala or Tamil prompts, include such text in the calibration data.

**Common mistakes:**
- Quantising and shipping without re-running the evaluation set.
- Calibrating only on English and then serving Sinhala.
- Expecting the same speedup at large batch sizes (there, the weight-only INT4 gain shrinks).

**Exam angle:** know weight-only (W4A16) vs W8A8 vs FP8, what GPTQ/AWQ/SmoothQuant do in one line each, and that quantisation reduces memory and speeds up memory-bound decode.

> **සිංහලෙන්:** Quantisation කියන්නේ weights ගබඩා කරන bits ගාණ අඩු කරන එක. 4-bit වලට අගයන් 16ක් විතරයි, ඒ නිසා 0.37 වගේ weight එකක් ළඟම අගය 0.333 විදිහට සුරකිනවා (පොඩි වැරැද්දක්). ඒත් model එක GB 16ක සිට GB 5ක් විතරට අඩු වෙනවා, decode වලදී කියවන bytes අඩු නිසා වේගයත් වැඩි වෙනවා. ලොකු අගයන් (outliers) නිසා quality පහත වැටෙන්න පුළුවන්, ඒකට AWQ, SmoothQuant වගේ ක්‍රම තියෙනවා. Quantise කරාට පස්සේ ඔයාගේම test set එකෙන් (සිංහල ඇතුළුව) quality එක නැවත පරීක්ෂා කරන්න අමතක කරන්න එපා.


## 11. Long context at inference

**Why it exists:** users want to paste whole books and codebases, but every extra token costs compute and memory. This section shows what long context really costs and how models stretch beyond their training length.

### Cost

Prefill attention grows as O(n²) ([file 19](19-transformers.md#19-the-cost-of-attention)); the KV cache grows linearly with n (section 5). Long contexts → slow TTFT, low concurrency, high cost. FlashAttention makes long-context attention practical but doesn't change the underlying growth.

### Extending a model's context length

A model trained on 8k tokens usually breaks beyond 8k: RoPE ([file 19](19-transformers.md#3-positional-encoding)) sees rotation angles it never saw in training.
- **Position Interpolation (PI):** squeeze positions so 32k positions map into the trained 0 to 8k range (then fine-tune briefly)
- **NTK-aware scaling, YaRN:** smarter scaling that treats different RoPE frequencies differently; works with little or no fine-tuning
- Models are typically trained with a long-context phase at the end of pretraining

### Attention sinks and streaming

Models put a lot of attention on the very **first tokens** ("**attention sinks**"), regardless of content. **StreamingLLM** keeps those first few tokens plus a sliding window of recent tokens in the KV cache, allowing endless streaming generation with fixed memory (though it "forgets" the middle).

---

### Worked examples

**KV cache for one very long request.** The 8B model above uses 128 KB per token. For a 128,000-token context: 128,000 × 128 KB ≈ **16.8 GB**, as large as the entire 16 GB of weights, for a single user. That is why long contexts crush concurrency.

**Attention cost.** Attention work grows with n². Going from 8k to 32k tokens is 4× longer, so attention compute is 4² = **16×** larger. Hence the slow TTFT on long inputs.

**Position Interpolation.** A model trained on 8,192 positions must handle 32,768. Scale each position by 8,192/32,768 = 0.25: position 32,000 becomes 8,000, which is inside the range the model has seen.

| Length | KV per request (8B model) | Concurrency on 60 GB of KV memory |
|---|---|---|
| 4k tokens | 0.5 GB | ~120 |
| 32k tokens | 4 GB | ~15 |
| 128k tokens | 16.8 GB | ~3 |

**Where you'll meet it in real work:** a company wants its assistant to read a 300-page annual report. Instead of always sending the full text, they use RAG to send the best 5 pages, which is faster and cheaper than 128k tokens each time.

**Common mistakes:**
- Assuming a model that "supports 128k" is cheap or accurate at 128k.
- Ignoring that quality in the middle of long inputs can drop (check with needle tests).

**Exam angle:** long context raises TTFT (quadratic attention), KV memory (linear) and cost; RoPE scaling (PI, NTK, YaRN) extends the length.

> **සිංහලෙන්:** Context එක දිග වෙන තරමට වියදම වැඩි වෙනවා. Tokens 128,000ක request එකක KV cache එකම GB 16.8ක් විතර යනවා, ඒක model එකේ weights ටිකටම සමානයි, ඒ user එක කෙනාට විතරයි! Context එක 4 ගුණයකින් (8k සිට 32k) වැඩි වුණාම attention වැඩේ 16 ගුණයකින් වැඩි වෙනවා, ඒ නිසා TTFT එක ලොකු වෙනවා. 8k වලට train කරපු model එකකට 32k දෙනකොට RoPE positions හරියට වැඩ කරන්නේ නෑ. ඒකට position 32,000 ක්ව 8,000 කට හැරෙව්වා වගේ (×0.25) scale කරන Position Interpolation වගේ ක්‍රම තියෙනවා. පිටු 300ක report එකක් මුළුමනින්ම යවනවාට වඩා RAG වලින් හොඳම පිටු 5 යවන්න ලාභයි.


## 12. Parallelism for serving

**Why it exists:** a 70B or 405B model does not fit on one GPU, and sometimes one GPU is too slow. Parallelism splits the work, and replicas multiply capacity.

When a model doesn't fit on one GPU, or you need lower latency ([parallelism, file 21](21-training-finetuning-alignment.md#18-distributed-training)):

| Strategy | Serving use |
|---|---|
| **Tensor parallelism (TP)** | Split each layer across GPUs in one server (fast NVLink); reduces per-token latency; the standard way to serve 70B+ models across 2 to 8 GPUs |
| **Pipeline parallelism (PP)** | Split layers across servers; increases capacity; adds latency |
| **Expert parallelism (EP)** | Spread MoE experts across GPUs |
| **Data parallelism (replicas)** | Several independent copies behind a **load balancer** to scale throughput |

**Multi-LoRA serving:** one base model in memory + many small LoRA adapters ([file 21](21-training-finetuning-alignment.md#9-lora)), applied per request. Serve hundreds of fine-tuned variants (one per customer or task) at almost the cost of one model.

---

### A worked example: fitting a 70B model

BF16 weights = 140 GB.
- **TP = 2** (two 80 GB GPUs): 70 GB of weights each, only ~10 GB left each for KV cache; works but cramped.
- **TP = 4**: 35 GB each, ~45 GB free each for KV cache; comfortable, and each token's work is shared by 4 GPUs so latency drops.
- Total demand 15,000 tokens/s and one 4-GPU replica sustains 2,500 tokens/s → 6 replicas = **24 GPUs** (data parallelism on top of TP).

```
 one model, TP=4              many copies (replicas)
 ┌───┬───┬───┬───┐            ┌──────────┐
 │G0 │G1 │G2 │G3 │  ◄─┐       │ replica 1│◄─┐
 └───┴───┴───┴───┘    │       ├──────────┤  │
   NVLink (fast)      │       │ replica 2│◄─┼── load balancer ◄── users
                      │       ├──────────┤  │
              each layer is   │ replica 3│◄─┘
              split across GPUs
```

**Multi-LoRA serving:** the 8B base model uses 16 GB once; each customer's LoRA adapter is typically tens to hundreds of MB. Hundreds of fine-tuned variants can share one GPU instead of needing one GPU each.

**Where you'll meet it in real work:** an organisation serves a different fine-tuned assistant for each of its 50 branches (different policies and tone) from a single base model with 50 adapters.

**Common mistakes:**
- Using tensor parallelism across slow network links (it needs fast NVLink-class connections).
- Adding replicas when the real problem is that a single request is too slow (TP helps that, replicas do not).

**Exam angle:** TP splits layers' matrices (lower latency, same server); PP splits layers across servers; EP is for MoE experts; replicas scale throughput.

> **සිංහලෙන්:** Model එක GPU එකකට ඔබන්න බැරි වුණාම GPUs කීපයකට බෙදනවා. Tensor parallelism කියන්නේ හැම layer එකක්ම GPUs 4ක් අතර බෙදන එක. 70B model එකේ weights GB 140ක් නිසා GPU 4කින් හැම එකකටම GB 35ක් විතර යනවා, ඉතුරු ඉඩ KV cache එකට. මේකෙන් එක request එකක් වේගවත් වෙනවා. Replicas කියන්නේ එකම model එකේ පිටපත් කීපයක් load balancer එකක් පිටිපස්සේ තියන එක, ඒකෙන් එකවර serve කරන users ගාණ වැඩි වෙනවා. Multi-LoRA වලදී එක base model එකක් සහ පොඩි adapters ගොඩක් තියාගෙන, එක GPU එකකින්ම customers ලා 50ක්ට වෙන වෙනම fine-tuned model serve කරන්න පුළුවන්.


## 13. Serving engines

**Why it exists:** there are many ways to run a model, from one command on a laptop to a managed cloud endpoint. Choosing the right tool saves months of work.

| Tool | Notes |
|---|---|
| **vLLM** | Popular open-source LLM server: PagedAttention, continuous batching, prefix caching, quantisation, multi-LoRA, speculative decoding, OpenAI-compatible API |
| **SGLang** | Fast serving with **RadixAttention** (tree-structured prefix cache), great for structured/agentic workloads |
| **TensorRT-LLM** (NVIDIA) | Highly optimised kernels for NVIDIA GPUs (FP8/FP4, in-flight batching); usually the highest performance on NVIDIA hardware |
| **NVIDIA Triton Inference Server** | General model server (PyTorch, TensorFlow, ONNX, TensorRT, Python backends); dynamic batching; model ensembles |
| **NVIDIA NIM** | Pre-packaged, optimised model containers with standard (OpenAI-compatible) APIs; deploy anywhere |
| **NVIDIA Dynamo** | Distributed inference framework (disaggregated serving, KV-aware routing) |
| **Hugging Face TGI** | Text Generation Inference server |
| **llama.cpp / Ollama / LM Studio** | Local and edge inference, CPU/GPU/Apple Silicon, GGUF (section 16) |
| **Managed APIs / cloud** | Provider APIs, Amazon Bedrock, Azure AI, Google Vertex AI, Together, Fireworks, Groq... (no infrastructure to run) |

```bash
# Serve an open model with an OpenAI-compatible API using vLLM
pip install vllm
vllm serve Qwen/Qwen2.5-7B-Instruct --max-model-len 8192 --gpu-memory-utilization 0.9
# then call http://localhost:8000/v1/chat/completions with the OpenAI client (file 22)
```

**Self-host vs API:**
- **API:** fastest to start, no ops, best frontier models, pay per token; data leaves your environment
- **Self-host:** control, privacy, customisation (fine-tuned models), possibly cheaper at **high, steady** volume; but you pay for GPUs even when idle and need expertise

---

### How to choose (a simple decision guide)

| Situation | Reasonable choice |
|---|---|
| Quick prototype, no GPUs | Provider API (pay per token) |
| Open model, own GPUs, general use | vLLM (or SGLang for agentic/structured prompts) |
| Highest speed on NVIDIA hardware | TensorRT-LLM, packaged as NVIDIA NIM |
| Serving many kinds of models (classic ML + LLM) | NVIDIA Triton Inference Server |
| Huge multi-node deployment | NVIDIA Dynamo |
| Laptop or offline demo | Ollama or llama.cpp |

### Worked example: self-host or call an API?

Assume (illustrative numbers) a GPU server costs $3 per hour, which is 24 × 30 × $3 = **$2,160 per month** even when idle. An API charges $0.50 per 1M tokens for a similar model.
- Break-even volume = $2,160 / $0.50 = 4,320 million = **4.3 billion tokens per month**.
- Below that volume the API is cheaper (no idle GPU); above it, and if utilisation is high, self-hosting wins. Privacy or customisation needs may justify self-hosting earlier.

```python
# Calling any OpenAI-compatible server (vLLM, NIM, TGI...) looks the same.
from openai import OpenAI                                   # the standard client
client = OpenAI(base_url="http://localhost:8000/v1", api_key="none")  # point at your own server
reply = client.chat.completions.create(
    model="Qwen/Qwen2.5-7B-Instruct",                       # the model name the server loaded
    messages=[{"role": "user", "content": "Say hello in one sentence."}],  # a normal chat request
)
print(reply.choices[0].message.content)                     # the generated text
```

**Where you'll meet it in real work:** one company starts on an API, then moves its highest-volume, simplest task to a self-hosted small model once traffic is steady. The OpenAI-compatible interface makes switching a one-line change.

**Common mistakes:**
- Self-hosting at low traffic and paying for an idle GPU.
- Choosing a tool by popularity without testing on your own workload.
- Forgetting loading time: big models take minutes to start, which matters for autoscaling.

**Exam angle:** know what each NVIDIA tool is for: TensorRT-LLM (optimised engine), Triton (general server), NIM (ready-made container), Dynamo (distributed).

> **සිංහලෙන්:** Model එකක් run කරන්න ක්‍රම ගොඩක් තියෙනවා. ඉක්මනට try කරන්න නම් API එකක්, ඔයාගේම GPU තියෙනවා නම් vLLM, NVIDIA GPU වලින් උපරිම වේගය ඕනේ නම් TensorRT-LLM / NIM, laptop එකේ නම් Ollama. Self-host කරනවද API පාවිච්චි කරනවද කියන්න ගණන් බලන්න: GPU server එකක් පැයකට $3 නම් මාසෙකට $2,160ක්, කවුරුවත් පාවිච්චි නොකළත් ගෙවන්න ඕනේ. API එක ටෝකන් මිලියනයකට $0.50 නම් (උදාහරණයක් විතරයි) මාසෙකට tokens බිලියන 4.3ක් ඉක්මවුවොත් විතරයි self-host කිරීම ලාභ වෙන්නේ. OpenAI-compatible API නිසා දෙකම අතර මාරු වෙන එක code එකේ පේළියක වෙනසක් විතරයි.


## 14. Hardware choices

**Why it exists:** the right chip depends on the model size and traffic. Buying by brand or price alone leads to a GPU that is either too small to fit the model or too costly for the job.

| Hardware | Notes |
|---|---|
| **Data-centre GPUs** (NVIDIA H100/H200, B200/GB200, A100; AMD MI300 series) | 80 to 192 GB HBM, very high bandwidth, NVLink between GPUs; for training and large-scale serving |
| **Inference-oriented GPUs** (e.g. NVIDIA L4, L40S) | Cheaper, lower power; good for smaller models, embeddings, vision |
| **Consumer GPUs** (RTX 4090/5090: 24 to 32 GB) | Local development; 7 to 30B models with quantisation |
| **Apple Silicon** (M-series) | Unified memory (up to 128 GB+) can hold big quantised models; decent bandwidth |
| **CPUs** | Small models, classic ML, embeddings at low volume; quantised LLMs slowly |
| **Specialised chips** | Google TPUs, AWS Inferentia/Trainium, Groq LPUs, Cerebras: very high throughput/latency for specific setups |
| **Edge/mobile NPUs** | On-device models (1 to 4B) for privacy and offline use |

**What matters for LLM inference:** **memory capacity** (does the model + KV fit?), **memory bandwidth** (decode speed), compute (prefill and big batches), and **interconnect** (multi-GPU).

---

### Worked examples: does it fit, and how fast?

Decode ceiling ≈ memory bandwidth ÷ bytes read per token (approximate spec-sheet bandwidths).

| Hardware | Memory | Bandwidth (approx.) | 8B Q4 (≈5 GB) ceiling | 70B INT4 (≈40 GB) |
|---|---|---|---|---|
| Data-centre H100 | 80 GB | ≈3,350 GB/s | ≈670 tokens/s | fits (35-40 GB), ≈ 80 to 95 tokens/s |
| Consumer RTX 4090 | 24 GB | ≈1,000 GB/s | ≈200 tokens/s | does not fit |
| Apple laptop with 64 GB unified memory | 64 GB | ≈400 GB/s | ≈80 tokens/s | fits, ≈10 tokens/s |

(70B ceiling on H100: 3,350 ÷ 40 ≈ 84. On the laptop: 400 ÷ 40 = 10. These are upper bounds.)

**Reading the table:** memory *capacity* decides whether it fits at all; memory *bandwidth* decides how fast tokens come out. A cheap card with plenty of memory can run a big model slowly; an expensive card with little memory cannot run it.

**Where you'll meet it in real work:** a Colombo startup prototypes on a 24 GB consumer GPU with a quantised 8B to 14B model, then rents H100-class cloud GPUs only for the final high-traffic deployment.

**Common mistakes:**
- Comparing GPUs by TFLOPs alone for LLM serving.
- Forgetting the KV cache when checking whether a model fits.
- Choosing a very powerful GPU for tiny models that a CPU can run (wasting money).

**Exam angle:** memory capacity, memory bandwidth, compute and interconnect are the four factors; inference GPUs (L4, L40S) are cheaper for small models.

> **සිංහලෙන්:** GPU එකක් තෝරද්දී මතක තියාගන්න දේවල් දෙකක්: memory ප්‍රමාණය (model එක ඇතුළු වෙනවද) සහ memory bandwidth (tokens එන වේගය). උදාහරණයක් විදිහට 70B model එක 4-bit කරාම GB 40ක් විතර යනවා. H100 (GB 80) එකේ ඒක ඇතුළු වෙනවා, තත්පරයට tokens 80ක් විතර ලැබෙනවා (3,350 ÷ 40). Gaming GPU එකක (GB 24) ඒක ඇතුළු වෙන්නේම නෑ. Apple laptop එකක GB 64ක් තිබුණොත් ඇතුළු වෙනවා, ඒත් bandwidth අඩු නිසා tokens 10ක් විතරයි. පොඩි model සඳහා මිල අධික GPU එකක් අරන් සල්ලි නාස්ති කරන්න එපා.


## 15. Cost and capacity

**Why it exists:** a GPU costs the same whether it is busy or idle. Knowing the cost per token and how many GPUs your peak needs is how you avoid both overspending and outages.

### Cost per million tokens (self-hosted)

```
cost per 1M tokens = GPU cost per hour ÷ (tokens per second × 3,600) × 1,000,000
```

**Worked example:** a GPU costs $3/hour; with continuous batching it sustains **2,500 output tokens/s** (aggregate across many users):
tokens per hour = 2,500 × 3,600 = 9 million → cost = $3 / 9M × 1M ≈ **$0.33 per 1M tokens**

But at low utilisation (say 200 tokens/s because traffic is light): 0.72M tokens/hour → **$4.17 per 1M tokens**. **Utilisation is everything** for self-hosting economics.

### Capacity planning example

Target: 50 requests/s peak, average 1,500 input + 300 output tokens, p95 TTFT < 1.5 s.
1. Output token demand: 50 × 300 = 15,000 tokens/s
2. If one GPU replica sustains ~2,500 output tokens/s while meeting the SLOs (measured, section 17) → need **6 replicas** + headroom (say 8) for spikes and failures
3. Check KV memory: concurrency (Little's Law) = 50 × ~10 s = 500 concurrent → ~63 per replica × 1,800 tokens × 128 KB ≈ 14 GB per replica: fits ✓

### Reducing cost

- Smallest model that meets quality (measure!), plus **routing** easy requests to small models ([file 22](22-prompt-engineering.md#12-prompt-chaining-and-routing))
- Quantisation (FP8/INT4), speculative decoding
- Prefix caching (stable prompt prefixes), shorter prompts, output length limits
- Batch APIs for offline jobs
- **Autoscaling:** add/remove replicas with traffic (watch slow startup times for big models: loading weights takes time)
- Distil a small model for high-volume narrow tasks ([file 21](21-training-finetuning-alignment.md#19-distillation-quantisation-pruning))

---

### Two more worked examples

**Cost of one request.** At $0.33 per 1M output tokens (the busy-GPU example), a 300-token answer costs 300 × 0.33 / 1,000,000 ≈ **$0.0001**, about one hundredth of a cent. At the idle-GPU price of $4.17 per 1M it is $0.00125, a **12.6× higher** cost for the exact same answer.

**What utilisation does.** A GPU costs $3/hour and can sustain 2,500 tokens/s at full load (9 million tokens/hour).
| Utilisation | Tokens per hour | Cost per 1M tokens |
|---|---|---|
| 100% | 9.0M | $0.33 |
| 40% | 3.6M | $0.83 |
| 10% | 0.9M | $3.33 |

**Capacity planning checklist** (follow the example above): peak requests/s → output tokens/s needed → replicas = needed ÷ (measured tokens/s per replica) + headroom → check KV memory with Little's Law → check the SLO under load.

```
traffic ▲   ╱╲        ╱╲      ← peaks need many replicas
        │  ╱  ╲  ╱╲  ╱  ╲
        │ ╱    ╲╱  ╲╱    ╲___   ← nights: scale down (autoscaling)
        └──────────────────────► time of day
```

**Cheaper without hurting quality:** try a smaller model first and route only hard questions to the big one; turn on prefix caching; cap output length; use batch APIs for overnight jobs; and distil a small model for a narrow high-volume task. These ideas (small model for easy work, caching, streaming) were the key points of the old inference-optimisation lesson too.

**Where you'll meet it in real work:** a finance team asks "what will this chatbot cost per month at 100,000 conversations?" The answer comes from tokens per conversation × cost per token + the idle cost of reserved GPUs.

**Common mistakes:**
- Quoting the busy-GPU price while running at low load.
- Planning for average traffic, not the peak.
- Forgetting model start-up time when autoscaling.

**Exam angle:** know cost per 1M tokens = GPU $/hour ÷ (tokens/s × 3,600) × 10⁶ and that utilisation drives economics.

> **සිංහලෙන්:** GPU එකක් කාර්යබහුල වුණත් නැතත් පැයකට එකම මුදලක් ගෙවන්න වෙනවා. ඒ නිසා utilisation තමයි ප්‍රධානම දේ. පැයකට $3ක GPU එකක් තත්පරයට tokens 2,500ක් හදනවා නම් පැයකට tokens මිලියන 9ක්, ඒ කියන්නේ මිලියනයකට $0.33යි. ඒත් GPU එක 10%ක් විතරයි පාවිච්චි වෙන්නේ නම් මිලියනයකට $3.33ක් වෙනවා, ගුණයක් 10ක වැඩි වීමක්. Peak traffic එකට replicas ගාන ගණන් කරන්න, සාමාන්‍යය බලලා නෙවෙයි. පොඩි model එකකින් ලේසි වැඩ කරවන්න, prefix caching ඕන් කරන්න, උත්තර දිග සීමා කරන්න. රාත්‍රියට traffic අඩු නම් autoscaling වලින් replicas අඩු කරන්න.


## 16. Running locally

**Why it exists:** running a model on your own laptop is free per token, private, and works offline, which is great for learning and for sensitive data.

### GGUF and quantisation levels (llama.cpp / Ollama / LM Studio)

GGUF files come in quantisation levels named like `Q4_K_M`, `Q5_K_M`, `Q8_0`:
- The number ≈ bits per weight (Q4 ≈ 4 to 5 bits, Q8 = 8 bits)
- `K` = "k-quant" (smarter block-wise scheme); `_S/_M/_L` = small/medium/large variants (how many important layers get extra precision)

| Level | Size (8B model) | Quality |
|---|---|---|
| Q8_0 | ~8.5 GB | Nearly lossless |
| Q6_K | ~6.6 GB | Excellent |
| **Q5_K_M / Q4_K_M** | ~5.7 / ~4.9 GB | **Best balance for most people** |
| Q3_K / Q2_K | ~4 / ~3.2 GB | Noticeable quality loss |

**Rule of thumb:** a bigger model at Q4 usually beats a smaller model at Q8 with the same memory.

**Memory needed** ≈ GGUF file size + KV cache for your context length + ~1 GB overhead. llama.cpp can **offload** some layers to the GPU and run the rest on CPU.

```bash
ollama run llama3.1:8b                    # downloads a Q4_K_M build by default
ollama run qwen2.5:14b-instruct-q5_K_M
# llama.cpp server with GPU offload of all layers and 8k context:
llama-server -m model-Q4_K_M.gguf -ngl 99 -c 8192 --port 8080
```

**Typical speeds:** an 8B Q4 model gives ~30 to 100+ tokens/s on a modern GPU or Apple M-series chip; a few tokens/s on an older laptop CPU.

---

### Worked example: will it fit on my 8 GB GPU?

Model: 8B at Q4_K_M, file ≈ 4.9 GB. Context 8,192 tokens.
- KV cache = 8,192 × 128 KB ≈ **1.0 GB**
- Overhead ≈ **1 GB**
- Total ≈ 4.9 + 1.0 + 1.0 = **6.9 GB** → fits in 8 GB with a little room to spare.
- With a 32k context the KV cache would be ~4 GB, giving 9.9 GB total, which does not fit; llama.cpp would then offload some layers to the CPU, which is slower.

**Which quantisation?**

| If you have... | Try |
|---|---|
| Lots of memory to spare | Q6_K or Q8_0 (best quality) |
| Typical laptop | Q4_K_M or Q5_K_M |
| Very little memory | A smaller model rather than Q2 |

**Rule of thumb in action:** with 16 GB of memory, a 14B model at Q4_K_M (≈9 GB) usually answers better than an 8B at Q8_0 (≈8.5 GB), though they use similar memory.

**Where you'll meet it in real work:** a developer in a place with unreliable internet runs a local coding assistant with Ollama; a clinic tests a summariser on its own computer so patient notes never leave the building.

**Common mistakes:**
- Ignoring the KV cache and context length when sizing memory.
- Using Q2 to squeeze in a larger model (quality often falls apart).
- Judging a model's quality from one chat; run a few of your own test questions.

**Exam angle:** GGUF is the llama.cpp file format; Q4_K_M means about 4-bit k-quant, medium; offloading layers to the GPU is controlled by `-ngl`.

> **සිංහලෙන්:** ඔයාගේම laptop එකේ LLM එකක් run කරන එක නොමිලේ, private, offline වැඩ කරනවා. GGUF files වල Q4_K_M වගේ නම්වල අංකය ආසන්න bits ගාණයි. 8B model එකක Q4_K_M file එක GB 4.9යි. Context tokens 8,192ක් නම් KV cache එකට GB 1ක් සහ overhead GB 1ක් එකතු කරාම GB 6.9ක් විතර ඕනේ, ඒ නිසා GB 8 GPU එකක ඇතුළු වෙනවා. Context එක 32k කරොත් KV cache GB 4ක් වෙලා GB 9.9ක් ඕනේ වෙනවා, එතකොට සමහර layers CPU එකට යනවා (-ngl) සහ මන්දගාමී වෙනවා. සාමාන්‍යයෙන් Q4_K_M හෝ Q5_K_M තමයි හොඳම තුලනය.


## 17. Benchmarking honestly

**Why it exists:** vendors love showing the best-looking number. Honest benchmarking is how you tell a real improvement from marketing.

When measuring (or reading claims about) inference performance, check:
- **Same workload:** input/output length distributions (short chat vs long RAG prompts are very different), arrival pattern, concurrency levels
- **Report both latency and throughput** at a given concurrency; show the curve (throughput vs p95 latency as load increases)
- **Percentiles** (p50, p95, p99), not just averages
- **Warm-up:** exclude the first requests (compilation, cache warming)
- **Quality preserved:** the same quantisation/precision and sampling settings; check outputs aren't degraded or truncated
- **Prefix-cache effects:** repeated identical prompts can look unrealistically fast
- **Cost basis:** tokens/s per GPU **and** per dollar
- Tools: vLLM/SGLang benchmark scripts, NVIDIA GenAI-Perf, LLMPerf

---

### Worked example: two claims that cannot be compared

| | Server A | Server B |
|---|---|---|
| Claim | 3,000 tokens/s | 2,000 tokens/s |
| Concurrency used | 128 users | 32 users |
| p95 TPOT | 90 ms | 30 ms |
| GPU price | $4/hour | $2/hour |

- A has more throughput, but users there see slower typing (90 ms vs 30 ms). B may meet a 50 ms SLO and A may not.
- Tokens per dollar: A = 3,000 × 3,600 / 4 = **2.7M per $**; B = 2,000 × 3,600 / 2 = **3.6M per $**. B is the cheaper per token here.
- Without knowing both servers were tested with the same prompts and lengths, none of this is valid.

```
 throughput ▲                 ●────● ...      Always plot the curve:
            │         ●────●                   throughput vs p95 latency
            │    ●───●                         as concurrency rises
            └───────────────────────► p95 latency
```

**Where you'll meet it in real work:** before signing for a GPU service, an engineer replays a sample of real production prompts (not 10 identical ones) at several concurrency levels and records the whole curve, using a tool such as GenAI-Perf.

**Common mistakes:**
- Benchmarking with one prompt repeated (prefix caching makes it look unrealistically fast).
- Counting warm-up requests in the average.
- Comparing throughput without comparing latency or output quality.

**Exam angle:** an honest benchmark specifies workload, concurrency, percentiles, warm-up, quality checks and cost basis.

> **සිංහලෙන්:** "අපේ server එක වේගවත්" කියලා කවුරුහරි කිව්වොත් අහන්න ඕනේ: කොච්චර users එකවරද? Prompts මොන වගේද? p95 latency කීයද? Server A තත්පරයට tokens 3,000යි, ඒත් users 128ක් ඉන්නකොට p95 TPOT 90ms. Server B tokens 2,000යි, users 32ක් ඉන්නකොට 30ms. එක අංකයක් විතරක් බලලා සසඳන්න බෑ. මුදලින් බැලුවොත් A ට ඩොලරයකට tokens මිලියන 2.7යි, B ට 3.6යි. Benchmark කරද්දී එකම prompt එක නැවත නැවත යවන්න එපා (prefix cache නිසා බොරු වේගයක් පෙනෙනවා), warm-up requests අයින් කරන්න, ඇත්ත traffic එකට සමාන prompts පාවිච්චි කරන්න.


## 18. Classic ML inference

**Why it exists:** most production AI is not an LLM. A fraud check, a photo classifier or a recommender has to answer in milliseconds and cost almost nothing, and the toolbox for that is different.

Not everything is an LLM. For classic ML ([files 11 to 14](11-ml-fundamentals.md)) and smaller deep learning models:
- **Model formats:** **ONNX** (portable format; run with ONNX Runtime on CPU/GPU), **TensorRT** (NVIDIA-optimised engine), TorchScript/`torch.compile`, OpenVINO (Intel)
- **Batching** requests (dynamic batching, section 6) for GPU efficiency
- **Quantisation** (INT8) and **pruning** of CNNs/BERT models; **distillation** to smaller models (e.g. DistilBERT)
- **Caching** frequent predictions; **precomputing** features (feature stores, file 28)
- **CPU is often enough** for tree models (XGBoost/LightGBM predictions take microseconds to milliseconds)
- **Latency budget:** e.g. fraud scoring must finish within ~50 ms during a card payment, which shapes model choice (a boosted tree, not an LLM)

---

### Worked example: a 50 ms fraud-check budget

A card payment must be approved within 50 ms. A latency budget might look like this (illustrative):

| Step | Time |
|---|---|
| Network in and out | 10 ms |
| Look up the customer's recent features (feature store) | 5 ms |
| Model prediction (boosted trees, ONNX Runtime on CPU) | 2 ms |
| Business rules and logging | 5 ms |
| **Total** | **22 ms**, comfortably inside 50 ms |

An LLM taking 2 seconds simply cannot fit this budget, which is why the right model is a small tree model, not a large one.

**The toolbox in one picture:**

```
 trained model ─► export to ONNX ─► ONNX Runtime / TensorRT ─► fast engine on CPU/GPU
        │
        ├─ quantise to INT8 (smaller, faster)
        ├─ prune unimportant weights (remove what matters little)
        └─ distil into a smaller student model (e.g. BERT → DistilBERT)
```

Use **dynamic batching** (collect requests for a few milliseconds) for GPU image or embedding models; use **caching** for repeated inputs; use **precomputed features** so you do not recompute them per request.

**Where you'll meet it in real work:** a telecom scoring millions of SIM-activation attempts per day, a hospital running an image classifier on X-rays on a local server, or an e-commerce site ranking products in under 100 ms.

**Common mistakes:**
- Using an LLM for a problem a small classifier solves in 1 ms.
- Measuring only model time and forgetting feature lookup and network time.
- Training with one preprocessing code path and serving with another (training-serving skew).

**Exam angle:** know ONNX and TensorRT as optimisation/portable formats, plus quantisation, pruning and distillation as the main ways to speed up and shrink models.

> **සිංහලෙන්:** හැම AI වැඩක්ම LLM නෙවෙයි. කාඩ් එකකින් ගෙවද්දී fraud check එක මිලි තත්පර 50ක් ඇතුළත ඉවර වෙන්න ඕනේ. Network 10ms + features ගන්න 5ms + model එක 2ms + rules 5ms = 22ms, ඒ නිසා ඒකට හොඳම තේරීම XGBoost වගේ පොඩි tree model එකක්, තත්පර 2ක් ගන්න LLM එකක් නෙවෙයි. Model එක ONNX වලට හරවලා ONNX Runtime හෝ TensorRT වලින් run කරන්න පුළුවන්. Quantization (INT8), pruning (අඩු වැදගත් weights අයින් කිරීම), distillation (ලොකු model එකකින් පොඩි එකකට ඉගැන්වීම) මගින් model එක පොඩි සහ වේගවත් කරන්න පුළුවන්.

```quiz
[
  {"q": "Why is LLM decoding at batch size 1 memory-bound?", "options": ["It needs more FLOPs than prefill", "GPUs cannot do matrix multiplication quickly", "The prompt must be re-tokenised each step", "Each token reads all the weights from memory but does very little maths per byte"], "answer": 3, "why": "Decode does about 2 FLOPs per weight yet must read every weight (and the KV cache) for each token, so intensity is far below the GPU balance point and it waits on memory bandwidth. The first option is backwards: prefill is the compute-heavy phase."},
  {"q": "An 8B model in BF16 (16 GB) runs on a GPU with 3,350 GB/s bandwidth. What is the batch-1 decode ceiling?", "options": ["About 210 tokens/s", "About 21 tokens/s", "About 3,350 tokens/s", "About 16 tokens/s"], "answer": 0, "why": "tokens/s is about bandwidth / bytes of weights = 3,350 / 16 = 209. The tempting 3,350 ignores that every token needs the whole 16 GB read."},
  {"q": "TTFT = 0.5 s, TPOT = 20 ms and the answer has 201 tokens. What is the end-to-end latency?", "options": ["4.0 s", "5.0 s", "4.5 s", "0.52 s"], "answer": 2, "why": "E2E = TTFT + TPOT x (tokens - 1) = 0.5 + 0.020 x 200 = 4.5 s. Using 201 tokens gives 4.52 s; forgetting TTFT gives 4.0 s, because the first token is already counted in TTFT."},
  {"q": "A model has 40 layers, 8 KV heads, head_dim 128 and BF16 KV cache. How big is the KV cache per token?", "options": ["80 KB", "160 KB", "320 KB", "1.28 MB"], "answer": 1, "why": "2 x 40 x 8 x 128 x 2 bytes = 163,840 bytes = 160 KB. The leading 2 is for keys and values; forgetting it gives 80 KB, the tempting wrong answer."},
  {"q": "What does continuous (in-flight) batching improve over static batching?", "options": ["Finished requests free their slot immediately for waiting requests, keeping the GPU busy", "It makes the model smaller", "It removes the need for a KV cache", "It changes the model's answers"], "answer": 0, "why": "Static batching waits for the longest request, leaving slots idle (35.6% utilisation in the 20/50/100/400-token example). Continuous batching refills slots at every step; it does not change outputs or the cache."},
  {"q": "Speculative decoding with acceptance rate 0.8 and k = 4 drafts gives roughly how many tokens per target pass?", "options": ["0.8", "4", "5", "3.36"], "answer": 3, "why": "(1 - 0.8^5)/(1 - 0.8) = 0.672/0.2 = 3.36. The tempting 4 or 5 would require every guess to be accepted. Output quality stays identical to the target alone."},
  {"q": "A GPU costs $3/hour and sustains 2,500 output tokens/s. What is the cost per 1M tokens at full load?", "options": ["$0.033", "$0.33", "$3.33", "$33"], "answer": 1, "why": "2,500 x 3,600 = 9M tokens/hour, so $3 / 9M x 1M = $0.33. At low utilisation the same GPU would cost far more per token, which is why utilisation drives self-hosting economics."},
  {"q": "Your chatbot's average latency is fine but some users complain about long waits. Which metric should you check?", "options": ["Mean throughput", "Model parameter count", "p95/p99 latency", "Perplexity"], "answer": 2, "why": "Tail percentiles reveal the slow few: 94 requests at 1 s and 6 at 10 s give a 1.54 s mean but a 10 s p95. Mean hides the tail that frustrates users."}
]
```


## 19. Check yourself

**Q1.** Why is LLM decoding memory-bound at small batch sizes?
<details><summary>Answer</summary>Each new token requires reading all weights (and KV cache) from memory but only does ~2 FLOPs per weight, so arithmetic intensity is very low and the GPU waits on memory bandwidth.</details>

**Q2.** Estimate the max batch-1 decode speed of a 14B BF16 model on a GPU with 2 TB/s bandwidth.
<details><summary>Answer</summary>Weights = 28 GB. 2,000 GB/s ÷ 28 GB ≈ **71 tokens/s** (theoretical upper bound).</details>

**Q3.** TTFT = 0.6 s, TPOT = 40 ms, 200 output tokens. E2E latency?
<details><summary>Answer</summary>0.6 + 0.04 × 199 ≈ 0.6 + 7.96 ≈ **8.6 s**.</details>

**Q4.** Why report p95/p99 latency instead of the mean?
<details><summary>Answer</summary>The mean hides the slow tail that many users experience; percentiles show worst-case-ish behaviour relevant to SLOs.</details>

**Q5.** A model: 40 layers, 8 KV heads, head_dim 128, BF16. KV bytes per token? Memory for 100 concurrent requests of 8k tokens?
<details><summary>Answer</summary>2 × 40 × 8 × 128 × 2 = 163,840 B ≈ 160 KB/token. 8,192 × 160 KB ≈ 1.25 GB per request × 100 ≈ **125 GB**.</details>

**Q6.** What problem does continuous batching solve compared with static batching?
<details><summary>Answer</summary>Slots freed by finished requests are refilled immediately at each decode step, instead of idling until the longest request ends, so GPU utilisation and throughput are much higher.</details>

**Q7.** What does PagedAttention fix?
<details><summary>Answer</summary>KV cache memory fragmentation/over-reservation, by allocating KV memory in small blocks as needed (and enabling block sharing), allowing many more concurrent requests.</details>

**Q8.** How does prefix caching reduce cost, and how should prompts be structured to benefit?
<details><summary>Answer</summary>The KV cache for a shared prefix is computed once and reused, skipping that prefill. Put stable content (system prompt, tools, documents) first and variable content last.</details>

**Q9.** Speculative decoding: does it change output quality? When is it most helpful?
<details><summary>Answer</summary>With the correct acceptance rule, the output distribution is identical to the target model. Most helpful at low batch sizes and predictable text (high acceptance rate).</details>

**Q10.** Expected tokens per target pass with acceptance α = 0.6 and k = 3 drafts?
<details><summary>Answer</summary>(1 − 0.6⁴)/(1 − 0.6) = (1 − 0.1296)/0.4 ≈ **2.18**.</details>

**Q11.** Weight-only INT4 vs W8A8: which helps decode at batch 1 more, and which helps large-batch prefill more?
<details><summary>Answer</summary>Weight-only INT4 helps memory-bound decode most (fewer bytes to load). W8A8/FP8 helps compute-bound prefill and large batches (faster low-precision matrix maths).</details>

**Q12.** A GPU costs $2/hour and sustains 1,000 tokens/s. Cost per 1M tokens?
<details><summary>Answer</summary>3.6M tokens/hour → $2/3.6 ≈ **$0.56 per 1M tokens**.</details>

**Q13.** You have 16 GB of VRAM. Which is likely better: a 14B model at Q4_K_M (~9 GB) or a 7B model at Q8 (~8 GB)?
<details><summary>Answer</summary>Usually the 14B at Q4: larger models at 4-bit typically outperform smaller models at 8-bit (but evaluate on your task).</details>

---

## 20. New words in this file

| Word | Meaning |
|---|---|
| Inference | Using a trained model to make predictions |
| Prefill / decode | Process prompt in parallel / generate token by token |
| HBM | High Bandwidth Memory on GPUs |
| Memory bandwidth | Bytes per second moved from memory |
| Arithmetic intensity | FLOPs per byte moved |
| Compute-bound vs memory-bound | Limited by maths vs data movement |
| TTFT, TPOT / ITL, E2E latency | First-token time, per-token time, total time |
| Throughput, goodput | Total tokens/s / tokens/s meeting SLOs |
| SLO | Service level objective (target) |
| Little's Law | Concurrency = arrival rate × time in system |
| Max concurrency | Requests that fit in memory at once |
| KV cache quantisation | Storing KV in 8-bit to save memory |
| Static, dynamic, continuous (in-flight) batching | Ways of grouping requests |
| Fragmentation | Wasted reserved memory |
| PagedAttention, block table | Paged KV memory management |
| Prefix caching, RadixAttention | Reusing KV for shared prompt beginnings |
| Preemption | Pausing requests when memory runs out |
| Chunked prefill | Splitting long prefills to interleave with decode |
| Disaggregated serving | Separate prefill and decode GPU pools |
| Speculative decoding, draft/target model, acceptance rate | Guess-and-verify generation |
| Medusa, EAGLE, prompt lookup, multi-token prediction | Speculative decoding variants |
| Weight-only quantisation (W4A16), W8A8, FP8, FP4 | Quantisation schemes |
| GPTQ, AWQ, SmoothQuant, calibration data | Quantisation methods and their data |
| Position interpolation, NTK-aware scaling, YaRN | RoPE context extension |
| Attention sinks, StreamingLLM | Heavy attention to first tokens / streaming with fixed memory |
| Replicas, load balancer | Copies of a model / traffic distributor |
| Multi-LoRA serving | One base model with many adapters |
| vLLM, SGLang, TensorRT-LLM, Triton, NIM, Dynamo, TGI | Serving engines |
| Self-host vs API | Running models yourself vs using a provider |
| Data-centre vs inference vs consumer GPUs, NPU, TPU, LPU | Hardware categories |
| NVLink, interconnect | Fast links between GPUs |
| Utilisation | How busy the hardware is |
| Autoscaling | Automatically adjusting replicas to traffic |
| GGUF quant levels (Q4_K_M, Q5_K_M, Q8_0), k-quants | Local model quantisation formats |
| GPU offload (`-ngl`) | Putting layers on GPU in llama.cpp |
| Warm-up (benchmarking) | Excluding initial slow requests |
| GenAI-Perf, LLMPerf | Inference benchmarking tools |
| ONNX, ONNX Runtime, TensorRT, OpenVINO | Portable/optimised inference formats and engines |

**Next:** [28-mlops-and-llmops.md](28-mlops-and-llmops.md)
