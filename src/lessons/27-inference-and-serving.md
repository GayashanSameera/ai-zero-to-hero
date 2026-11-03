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

| | Training | Inference |
|---|---|---|
| Goal | Learn parameters | Use the model to make predictions |
| Happens | Once (or occasionally) | Millions of times, continuously |
| Cost driver | Total compute | Cost **per request** × huge volume |
| Key metrics | Time to train, final quality | **Latency**, **throughput**, **cost**, reliability |
| Memory | Weights + gradients + optimiser + activations (16+ bytes/param) | Weights + **KV cache** (+ small activations) |

For a successful product, **total inference cost usually far exceeds training cost**. That's why inference optimisation is a big field and a big job market.

---

## 2. Prefill and decode

From [file 20](20-how-llms-work.md#12-the-kv-cache):

| Phase | Work | Parallel? | Bottleneck | Drives |
|---|---|---|---|---|
| **Prefill** | Process all prompt tokens at once, fill the KV cache, produce the 1st output token | Yes, across all prompt tokens | **Compute** (lots of matrix multiplications) | **TTFT** (time to first token) |
| **Decode** | Generate one token at a time | Only across different requests in a batch | **Memory bandwidth** (load all weights + KV cache for each token) | **Time per output token** |

**Analogy:** prefill is reading the whole question paper at once (fast, parallel); decode is writing the answer one word at a time, each time flipping through your entire notebook (the weights) to choose the next word.

---

## 3. Compute vs memory bound

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

## 4. Latency and throughput metrics

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

## 5. GPU memory math

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

## 6. Batching

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

## 7. PagedAttention and prefix caching

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

## 8. Chunked prefill and disaggregation

**Problem:** a huge prefill (e.g. a 50k-token document) can block decode steps for everyone else, causing a visible stall in other users' streams.

**Chunked prefill:** split long prefills into chunks (e.g. 512 tokens) and mix them with decode steps of other requests in each iteration. Smoother TPOT for all.

**Disaggregated (split) serving:** run prefill and decode on **different GPU pools**, since they have different bottlenecks (compute vs memory). The KV cache is transferred from prefill workers to decode workers. Each pool can be sized and tuned independently. Used at large scale (e.g. NVIDIA Dynamo, vLLM, SGLang support variants).

---

## 9. Speculative decoding

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

## 10. Quantisation for inference

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

## 11. Long context at inference

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

## 12. Parallelism for serving

When a model doesn't fit on one GPU, or you need lower latency ([parallelism, file 21](21-training-finetuning-alignment.md#18-distributed-training)):

| Strategy | Serving use |
|---|---|
| **Tensor parallelism (TP)** | Split each layer across GPUs in one server (fast NVLink); reduces per-token latency; the standard way to serve 70B+ models across 2 to 8 GPUs |
| **Pipeline parallelism (PP)** | Split layers across servers; increases capacity; adds latency |
| **Expert parallelism (EP)** | Spread MoE experts across GPUs |
| **Data parallelism (replicas)** | Several independent copies behind a **load balancer** to scale throughput |

**Multi-LoRA serving:** one base model in memory + many small LoRA adapters ([file 21](21-training-finetuning-alignment.md#9-lora)), applied per request. Serve hundreds of fine-tuned variants (one per customer or task) at almost the cost of one model.

---

## 13. Serving engines

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

## 14. Hardware choices

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

## 15. Cost and capacity

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

## 16. Running locally

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

## 17. Benchmarking honestly

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

## 18. Classic ML inference

Not everything is an LLM. For classic ML ([files 11 to 14](11-ml-fundamentals.md)) and smaller deep learning models:
- **Model formats:** **ONNX** (portable format; run with ONNX Runtime on CPU/GPU), **TensorRT** (NVIDIA-optimised engine), TorchScript/`torch.compile`, OpenVINO (Intel)
- **Batching** requests (dynamic batching, section 6) for GPU efficiency
- **Quantisation** (INT8) and **pruning** of CNNs/BERT models; **distillation** to smaller models (e.g. DistilBERT)
- **Caching** frequent predictions; **precomputing** features (feature stores, file 28)
- **CPU is often enough** for tree models (XGBoost/LightGBM predictions take microseconds to milliseconds)
- **Latency budget:** e.g. fraud scoring must finish within ~50 ms during a card payment, which shapes model choice (a boosted tree, not an LLM)

---

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
