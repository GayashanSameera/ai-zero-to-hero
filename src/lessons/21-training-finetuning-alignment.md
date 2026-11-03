# 21: Training LLMs: Pretraining Data, Fine-Tuning, LoRA, Alignment, and Efficiency

> **Before you start:** [05](05-math-linear-algebra.md#15-advanced-ideas-intuition-only) (rank, low-rank matrices), [07](07-math-probability-statistics.md) (KL divergence, cross-entropy, MLE, sigmoid), [11](11-ml-fundamentals.md) (overfitting, validation, regularisation), [15](15-neural-networks.md) (AdamW memory, mixed precision, gradient accumulation, checkpointing, learning rate schedules), [16](16-cnns-and-computer-vision.md#12-transfer-learning) (transfer learning, freezing), [19](19-transformers.md) (Transformer blocks, W_Q/W_K/W_V, parameter counting), [20](20-how-llms-work.md) (pretraining, chat templates, base vs instruct, scaling laws, reasoning models).
>
> **After this file you can:** describe the full LLM training lifecycle; decide between prompting, RAG and fine-tuning; prepare SFT data; explain and use LoRA and QLoRA (with parameter and memory calculations); explain RLHF, DPO and related alignment methods; understand distributed training; and explain distillation, quantisation, pruning and Mixture of Experts.

---

## Table of contents

1. [The LLM lifecycle](#1-the-llm-lifecycle)
2. [Pretraining data: curation, deduplication, decontamination](#2-pretraining-data)
3. [Synthetic data and model collapse](#3-synthetic-data)
4. [Continued pretraining and catastrophic forgetting](#4-continued-pretraining)
5. [Prompting vs RAG vs fine-tuning: when to use what](#5-prompting-vs-rag-vs-fine-tuning)
6. [Supervised fine-tuning (SFT) / instruction tuning](#6-supervised-fine-tuning)
7. [The memory cost of full fine-tuning](#7-memory-cost-of-full-fine-tuning)
8. [Parameter-efficient fine-tuning (PEFT)](#8-peft)
9. [LoRA in depth](#9-lora)
10. [QLoRA](#10-qlora)
11. [Other PEFT methods](#11-other-peft-methods)
12. [Hands-on: fine-tune a small model with QLoRA](#12-hands-on-qlora)
13. [Alignment: why SFT isn't enough](#13-alignment)
14. [RLHF: reward models and PPO](#14-rlhf)
15. [DPO and other preference methods](#15-dpo-and-friends)
16. [RL for reasoning: verifiable rewards and GRPO](#16-rl-for-reasoning)
17. [Constitutional AI and RLAIF](#17-constitutional-ai-and-rlaif)
18. [Distributed training](#18-distributed-training)
19. [Making models smaller and faster: distillation, quantisation, pruning](#19-distillation-quantisation-pruning)
20. [Mixture of Experts (MoE)](#20-mixture-of-experts)
21. [Model merging](#21-model-merging)
22. [Check yourself](#22-check-yourself)
23. [New words in this file](#23-new-words-in-this-file)

---

## 1. The LLM lifecycle

```
┌──────────────┐   ┌────────────────┐   ┌────────────────┐   ┌──────────────┐   ┌────────────┐
│ 1. Data       │──►│ 2. Pretraining  │──►│ 3. SFT          │──►│ 4. Preference │──►│ 5. Eval,   │
│ collection &  │   │ next-token on   │   │ (instruction    │   │ tuning        │   │ safety,    │
│ curation      │   │ trillions of    │   │ tuning)         │   │ RLHF / DPO /  │   │ deployment │
│               │   │ tokens          │   │ thousands to    │   │ RL for        │   │            │
│               │   │ → BASE model    │   │ millions of     │   │ reasoning     │   │            │
│               │   │                 │   │ examples        │   │ → CHAT model  │   │            │
└──────────────┘   └────────────────┘   └────────────────┘   └──────────────┘   └────────────┘
  most data,          most compute         teaches format &      teaches preferences,
  most effort         ($$$$$)              instruction following  helpfulness, safety
```

**Analogy:** pretraining = reading the entire library (general knowledge); SFT = apprenticeship where a mentor shows how to answer questions properly; preference tuning = feedback from customers about which answers they liked better.

As an AI engineer you'll rarely pretrain from scratch. You'll mostly **use** models, sometimes **fine-tune** them (SFT/LoRA), and occasionally run **preference tuning**.

---

## 2. Pretraining data

"Garbage in, garbage out" ([file 01](01-big-picture-and-data.md#7-what-is-data)) applies at enormous scale. Data quality is one of the biggest factors in model quality.

### Typical pipeline

1. **Collect:** web crawls, books, code, papers, multilingual text
2. **Extract** clean text from HTML/PDF (remove menus, ads, boilerplate)
3. **Language identification:** label each document's language
4. **Quality filtering:**
   - **Heuristics:** remove pages with too few words, too many symbols, lots of repeated lines, "lorem ipsum", etc.
   - **Model-based:** a small classifier scores how "high quality/educational" text is (e.g. trained to tell Wikipedia-like text from random web text) and keeps the best
   - **Perplexity filtering:** a small language model flags gibberish (very high perplexity)
5. **Safety filtering:** remove toxic content, adult content, malware
6. **PII removal:** mask emails, phone numbers, ID numbers (privacy, file 29)
7. **Deduplication:**
   - **Exact:** hash each document; remove identical ones
   - **Near-duplicate:** **MinHash + LSH** (Locality-Sensitive Hashing) quickly finds documents that are, say, 80%+ similar without comparing every pair
   - Why: duplicates waste compute, encourage **memorisation** (the model regurgitating training text) and privacy leaks
8. **Decontamination:** remove text that overlaps with **benchmark test sets** (file 26). Otherwise the model memorises test answers and evaluation scores become meaningless.
9. **Mixture weighting:** decide the proportions, e.g. 60% web, 15% code, 10% books, 10% academic, 5% maths; often upweighting high-quality sources. Later in training, high-quality data is often emphasised more (**annealing**).
10. **Tokenise** and pack into training sequences.

**Tools:** NVIDIA **NeMo Curator**, Hugging Face **datatrove**, Dolma toolkit. Public datasets: **FineWeb**, RedPajama, The Pile, The Stack (code).

---

## 3. Synthetic data

**Synthetic data** = training data **generated by models** rather than written by humans.

**Uses:**
- **Self-Instruct / instruction generation:** an LLM writes instructions and answers to create SFT data (e.g. Stanford **Alpaca** was 52k examples generated by a stronger model)
- **Rephrasing** web text into cleaner textbook-style text
- **Maths and code** problems with **verified** solutions (run the code, check the answer)
- **Distillation data:** a big "teacher" model's answers used to train a smaller "student" (section 19)
- Data for low-resource languages, rare scenarios, safety examples

**Risks:**
- Copies the generator's **errors and biases**
- **Model collapse:** training generation after generation on mostly synthetic data makes the output distribution narrow and degrade (rare things disappear first). Mixing in real data and verifying/filtering prevents this.
- **Licence terms:** some providers forbid using outputs to train competing models

**Best practice:** generate → **filter/verify** (rule checks, execution, LLM judges, humans) → deduplicate → mix with real data.

---

## 4. Continued pretraining

**Continued pretraining** (or **domain-adaptive pretraining**): take a pretrained base model and keep training it with next-token prediction on lots of **raw domain text** (medical papers, legal documents, a new language like Sinhala).

- ✅ Teaches new **knowledge, vocabulary and language**
- Needs lots of data (hundreds of millions to billions of tokens) and compute

### Catastrophic forgetting

When a model is trained on new data, it can **lose** previously learned abilities (e.g. after training only on legal text, it gets worse at general chat or coding).

**Mitigations:**
- **Replay:** mix some original-style general data into the new training data (e.g. 10 to 30%)
- Lower learning rate; **re-warming** the LR carefully (warmup again, then decay)
- Parameter-efficient methods like LoRA (section 9) change fewer weights, so they forget less
- Regularisation that keeps important weights close to their original values (e.g. **EWC**, Elastic Weight Consolidation)

---

## 5. Prompting vs RAG vs fine-tuning

**This decision comes up in almost every real project.**

| Need | Best first tool |
|---|---|
| Get the model to do a task, format output, adopt a tone | **Prompt engineering** ([file 22](22-prompt-engineering.md)) |
| Answer using **your private or up-to-date knowledge** (documents, policies, product catalogue) | **RAG** ([file 23](23-embeddings-vector-databases-rag.md)) |
| Take **actions**, use live data, do calculations | **Tools / agents** ([file 24](24-ai-agents.md)) |
| Consistent **style/format/behaviour** that prompting can't reliably achieve; a **specialised task** done cheaply at scale; a **smaller/faster** model matching a big one on a narrow task; new **language/domain skills** | **Fine-tuning** |

**Rules of thumb:**
- **Fine-tuning teaches behaviour/skills/form, not facts.** It's poor for injecting knowledge that changes (prices, policies): the model may still hallucinate, and updating means retraining. Use RAG for facts.
- **Start with prompting**, then RAG, then fine-tune only if needed. They combine well: e.g. fine-tune a small model to answer in your company's style **from retrieved documents** (RAG + fine-tuning).
- Fine-tuning needs good data (usually hundreds to tens of thousands of high-quality examples) and an evaluation set (file 26).

**Example decisions:**
- "Our bot must answer questions about our 500-page HR policy" → **RAG**
- "Extract 20 fields from invoices into JSON, 1M invoices/month, cheaply" → prompt a big model first; then **fine-tune a small model** on its verified outputs to cut cost
- "Respond in the friendly style of our brand, in Sinhala" → prompting first; **fine-tune** if style is inconsistent

---

## 6. Supervised fine-tuning

**SFT** (also called **instruction tuning**): train the model on **(instruction → ideal response)** examples using the usual next-token cross-entropy loss ([file 20](20-how-llms-work.md#7-next-token-prediction)). This turns a base model into an assistant, or specialises an assistant.

### Data format

Usually **JSONL** ([file 01](01-big-picture-and-data.md#12-common-file-formats)) with chat messages:

```json
{"messages": [
  {"role": "system", "content": "You are a helpful telecom support agent."},
  {"role": "user", "content": "How do I check my data balance?"},
  {"role": "assistant", "content": "Dial *456# and press call. You'll get an SMS with your remaining data."}
]}
```

The messages are formatted with the model's **chat template** ([file 20](20-how-llms-work.md#5-special-tokens-and-chat-templates)) before tokenising.

### Loss masking

We only want the model to learn to produce the **assistant's** responses, not to predict the user's questions or the system prompt. So the loss is computed **only on assistant tokens**. Other tokens get the label **−100**, which PyTorch's cross-entropy ignores.

```
Tokens:  [system...] [user: How do I check...] [assistant: Dial *456#...]
Labels:  -100 -100   -100 -100 -100 -100        Dial  *  456  #  ...
         (ignored)    (ignored)                  (learned)
```

### Packing

Many SFT examples are short. Instead of padding each one to the max length (wasting compute), **packing** concatenates several examples into one full-length sequence (with attention masks/boundaries so they don't attend to each other).

### Data quality > quantity

**LIMA** ("Less Is More for Alignment") showed that just **1,000 carefully curated** examples can produce a surprisingly good assistant from a strong base model. The **superficial alignment hypothesis**: the model's knowledge comes from pretraining; SFT mostly teaches **format and style**.

**Good SFT data:** correct, consistent in style, diverse (covering the real range of requests), includes edge cases and examples of politely refusing or saying "I don't know" when appropriate, and is free of test-set examples.

### Typical hyperparameters

- Epochs: 1 to 3 (more → overfitting: the model memorises responses)
- Learning rate: ~1e-5 to 2e-5 for full fine-tuning; ~1e-4 to 2e-4 for LoRA
- Warmup + cosine decay ([file 15](15-neural-networks.md#10-learning-rate-schedules))
- Watch validation loss and, more importantly, **task-specific evaluation** (file 26)

**NEFTune:** adding small random noise to the embeddings during SFT can improve chat quality (a regularisation trick).

---

## 7. Memory cost of full fine-tuning

**Full fine-tuning** updates **all** parameters. Memory needed with AdamW and mixed precision ([file 15](15-neural-networks.md#20-gpus-memory-and-mixed-precision)):

| Item | Bytes per parameter |
|---|---|
| BF16 weights | 2 |
| BF16 gradients | 2 |
| FP32 master copy of weights | 4 |
| Adam first moment (m), FP32 | 4 |
| Adam second moment (v), FP32 | 4 |
| **Total** | **≈ 16 bytes/parameter** |

Plus activations (depend on batch size and sequence length).

**Worked example:** a 7B model: 7 × 10⁹ × 16 bytes = **112 GB** before activations. That's more than one 80 GB GPU. A 70B model needs ~1.1 TB, so a multi-GPU cluster (section 18).

This is why **parameter-efficient** methods exist.

---

## 8. PEFT

**Parameter-Efficient Fine-Tuning (PEFT):** freeze the original model and train only a **small number of new or selected parameters** (often < 1%).

**Benefits:**
- Far less memory (no gradients or optimiser state for frozen weights)
- Tiny output files (megabytes instead of gigabytes): you can keep many task-specific **adapters** for one base model and swap them
- Less catastrophic forgetting
- Often matches full fine-tuning quality on many tasks

---

## 9. LoRA

**LoRA (Low-Rank Adaptation)** is the most popular PEFT method.

### The idea

When fine-tuning, a weight matrix W (d × k) changes by some update ΔW. The LoRA paper's hypothesis: this **change has low "intrinsic rank"**: it can be well approximated by a **low-rank** matrix ([file 05](05-math-linear-algebra.md#15-advanced-ideas-intuition-only)).

So instead of learning a full ΔW, learn two small matrices:

```
ΔW = B · A          A: (r × k),  B: (d × r),  with rank r ≪ d, k  (e.g. r = 8 or 16)

New forward pass:  h = W·x + (α/r) · B·A·x
                   └frozen┘  └── trainable ──┘
```

```
         x
         │
   ┌─────┴──────┐
   ▼            ▼
┌──────┐     ┌─────┐
│  W    │     │  A   │ (r × k)  ← small
│frozen │     └──┬──┘
│(d × k)│        ▼
└──┬───┘     ┌─────┐
   │         │  B   │ (d × r)  ← small
   │         └──┬──┘
   │            │ × (α/r)
   └────(+)─────┘
         │
         h
```

### Initialisation

- **A** is initialised randomly; **B** is initialised to **zeros**. So at the start BA = 0, and the model behaves exactly like the original. Training then gradually learns the update.

### Hyperparameters

| Hyperparameter | Meaning | Typical |
|---|---|---|
| **r** (rank) | Size of the bottleneck: capacity of the update | 8, 16, 32, 64 |
| **lora_alpha (α)** | Scaling factor; the update is multiplied by α/r | often α = r or 2r |
| **target_modules** | Which weight matrices get LoRA adapters | attention projections (q_proj, k_proj, v_proj, o_proj); often also the FFN (gate/up/down_proj) for better results |
| **lora_dropout** | Dropout on the LoRA path | 0 to 0.1 |
| Learning rate | Higher than full fine-tuning | ~1e-4 to 2e-4 |

**rsLoRA** scales by α/√r instead of α/r, which behaves better at high ranks.

### Worked parameter count

One weight matrix of size 4096 × 4096 (e.g. q_proj in a 7B model):
- Full fine-tuning: 4096 × 4096 = **16,777,216** parameters
- LoRA with r = 16: A (16 × 4096) + B (4096 × 16) = 65,536 + 65,536 = **131,072** parameters, which is **128× fewer**

For a 32-layer model with LoRA (r = 16) on q, k, v, o (all 4096 × 4096 for simplicity):
32 layers × 4 matrices × 131,072 ≈ **16.8M trainable parameters**, about **0.24% of 7B**.

(Real models with GQA have smaller k/v projections, so the exact count differs.)

### Merging

After training, you can **merge** the adapter into the weights: W_new = W + (α/r)·BA. The merged model has **no extra inference cost**. Or keep adapters separate to swap tasks quickly (serving systems can host many LoRA adapters on one base model).

**DoRA** (Weight-Decomposed LoRA): splits each weight into a magnitude and a direction and applies LoRA to the direction; often slightly better than LoRA.

```python
from peft import LoraConfig, get_peft_model
config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                                    "gate_proj", "up_proj", "down_proj"],
                    task_type="CAUSAL_LM")
model = get_peft_model(base_model, config)
model.print_trainable_parameters()   # e.g. "trainable params: 40M || all params: 8B || trainable%: 0.5"
```

---

## 10. QLoRA

**QLoRA** = LoRA on top of a base model whose frozen weights are **quantised to 4 bits** ([file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes); quantisation in section 19).

**Memory for a 7B model:**
- BF16 weights: 7B × 2 bytes = 14 GB
- 4-bit weights: 7B × 0.5 bytes ≈ **3.5 GB** (+ small overhead)
- Plus LoRA parameters, their gradients and optimiser states (small), plus activations

→ Fine-tuning a 7 to 8B model fits on a **single 16 to 24 GB GPU** (even a free Colab T4 for small sequence lengths). A 70B model fits on one 48 to 80 GB GPU.

### QLoRA's three tricks

1. **NF4 (4-bit NormalFloat):** a 4-bit data type designed for weights that are roughly normally distributed ([file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)): its 16 levels are placed where weights are most common, wasting less precision.
2. **Double quantisation:** the scaling constants used for quantisation are themselves quantised, saving ~0.4 bits per parameter more.
3. **Paged optimisers:** optimiser states can spill into CPU memory during memory spikes, avoiding out-of-memory crashes.

During the forward/backward pass, 4-bit weights are temporarily **de-quantised** to BF16 (the **compute dtype**) for the maths. Gradients flow only into the LoRA matrices.

**Trade-off:** slightly slower than LoRA in BF16 (de-quantisation overhead) and occasionally a little lower quality, but makes fine-tuning accessible to everyone.

---

## 11. Other PEFT methods

| Method | What is trained |
|---|---|
| **Adapters** | Small bottleneck MLP layers inserted inside each Transformer block (adds slight inference latency) |
| **Prompt tuning** | A few "soft prompt" embedding vectors prepended to the input (learned vectors, not real words) |
| **Prefix tuning** | Learned vectors prepended to the keys and values at every layer |
| **P-tuning** | Soft prompts produced by a small network |
| **IA³** | Learned vectors that rescale keys, values and FFN activations (extremely few parameters) |
| **BitFit** | Only the bias terms |

LoRA/QLoRA dominate in practice because they're simple, effective and add no inference cost after merging.

---

## 12. Hands-on QLoRA

A minimal fine-tune with Hugging Face **TRL** (Transformer Reinforcement Learning library: SFT, DPO, GRPO trainers), **PEFT**, and **bitsandbytes** (quantisation). Run on Colab with a GPU.

```python
# pip install transformers datasets peft trl bitsandbytes accelerate
import torch
from datasets import load_dataset
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

model_id = "Qwen/Qwen2.5-1.5B-Instruct"          # small instruct model

bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_use_double_quant=True,
                         bnb_4bit_compute_dtype=torch.bfloat16)
tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(model_id, quantization_config=bnb, device_map="auto")

# Data: a JSONL file of {"messages": [...]} examples (section 6)
ds = load_dataset("json", data_files={"train": "train.jsonl", "validation": "val.jsonl"})

peft_config = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                         target_modules="all-linear", task_type="CAUSAL_LM")

args = SFTConfig(
    output_dir="qlora-out",
    num_train_epochs=2,
    per_device_train_batch_size=4,
    gradient_accumulation_steps=4,          # effective batch 16 (file 15)
    learning_rate=2e-4,
    lr_scheduler_type="cosine",
    warmup_ratio=0.05,
    bf16=True,                              # use fp16=True on older GPUs like T4
    logging_steps=10,
    eval_strategy="steps", eval_steps=50,
    max_seq_length=1024,
    packing=True,
    gradient_checkpointing=True,            # activation checkpointing saves memory
)

trainer = SFTTrainer(model=model, args=args, train_dataset=ds["train"],
                     eval_dataset=ds["validation"], peft_config=peft_config,
                     processing_class=tokenizer)   # applies chat template + assistant-only loss options
trainer.train()
trainer.save_model("qlora-out/adapter")     # saves only the small LoRA adapter (MBs)
```

(Library APIs evolve quickly; check the current TRL docs if an argument name has changed.)

**After training:** evaluate on held-out examples against the base model and a strong API model (file 26). Look at real outputs, not just the loss.

---

## 13. Alignment

**Alignment** = making a model behave according to human intentions and values: **helpful, honest and harmless** ("HHH").

**Why SFT isn't enough:**
- SFT shows **one** good answer per prompt, but there are many possible answers of varying quality. It doesn't teach **which of two answers is better**.
- It's easier for humans to **compare** two answers ("A is better than B") than to write the perfect answer.
- We want to teach subtle qualities: not being verbose, admitting uncertainty, refusing harmful requests but not over-refusing harmless ones, being genuinely helpful.

**Preference data:** for a prompt, collect two (or more) model responses and a human (or AI) judgement of which is better:

```json
{"prompt": "Explain quantum computing simply.",
 "chosen": "Think of a normal bit as a coin lying heads or tails...",
 "rejected": "Quantum computing leverages superposition and entanglement of qubits in Hilbert space..."}
```

---

## 14. RLHF

**RLHF (Reinforcement Learning from Human Feedback)**: the method behind InstructGPT and the original ChatGPT.

### Step 1: SFT model

Start with an instruction-tuned model (section 6).

### Step 2: Train a reward model (RM)

A model (usually a copy of the LLM with a scalar output head) that takes (prompt, response) and outputs a **score** for how good the response is.

Trained on preference pairs with the **Bradley-Terry** model:

```
P(chosen preferred over rejected) = sigmoid( r(chosen) − r(rejected) )
loss = −log sigmoid( r(chosen) − r(rejected) )
```

In words: train the RM to give the chosen answer a **higher score** than the rejected one ([sigmoid](04-math-numbers-and-functions.md#16-common-function-shapes-youll-meet-in-ai) and [log loss](07-math-probability-statistics.md#23-cross-entropy)).

**Example:** r(chosen) = 2.0, r(rejected) = 0.5 → difference 1.5 → sigmoid(1.5) = 0.818 → loss = −ln(0.818) = **0.20** (small, good). If r(chosen) = 0.5 and r(rejected) = 2.0: sigmoid(−1.5) = 0.182 → loss = **1.70** (big, the RM is wrong).

### Step 3: Optimise the LLM with RL (PPO)

Treat the LLM as a **policy** ([reinforcement learning, file 11](11-ml-fundamentals.md#2-types-of-machine-learning)): given a prompt (state), it generates a response (actions = tokens) and receives a **reward** from the RM. Use **PPO (Proximal Policy Optimization)** to update the LLM to get higher rewards.

**KL penalty:** the reward is reduced if the new model drifts too far from the original SFT model ([KL divergence, file 07](07-math-probability-statistics.md#24-kl-divergence)):

```
total reward = RM score − β × KL(new model ‖ SFT model)
```

**Why the KL penalty?** Without it, the model finds ways to get high RM scores that aren't actually good: **reward hacking**. Examples: very long answers (if the RM liked length), flattering the user, repeating phrases the RM happens to like, or producing gibberish that fools the RM. Staying close to the SFT model keeps outputs natural.

**PPO clipping:** PPO limits how much the policy can change in one update (the probability ratio is clipped to e.g. [0.8, 1.2]), keeping training stable.

### RLHF drawbacks

- Complex: 4 models in memory at once (policy, reference/SFT model, reward model, value/critic model)
- Unstable and sensitive to hyperparameters
- Expensive human labelling
- Reward hacking

---

## 15. DPO and friends

**DPO (Direct Preference Optimization, 2023)**: gets the benefits of RLHF **without** a separate reward model or RL loop. It's now one of the most widely used methods.

**Key insight:** the optimal RLHF policy can be written directly in terms of the model's own probabilities, so you can train on preference pairs with a simple classification-like loss.

```
loss = −log sigmoid( β × [ (log π(chosen) − log π_ref(chosen))
                           − (log π(rejected) − log π_ref(rejected)) ] )
```

In words:
- π = the model being trained; π_ref = the frozen SFT reference model
- Increase the probability of the **chosen** response **relative to the reference** more than for the **rejected** one
- **β** controls how far the model may move from the reference (like the KL penalty): small β = more freedom; large β = stay close
- The quantity β × log(π/π_ref) acts as an **implicit reward**

✅ Simple (just 2 models: policy + frozen reference), stable, cheap, works with standard training code.
❌ Purely **offline** (learns from a fixed dataset of pairs); can overfit; quality depends heavily on the preference data.

**Other preference methods:**

| Method | Idea |
|---|---|
| **IPO** | DPO variant that's more robust to overfitting |
| **KTO** | Works with simple thumbs-up/thumbs-down labels instead of pairs |
| **ORPO** | Combines SFT and preference optimisation in one step, no reference model |
| **SimPO** | Reference-free, length-normalised DPO variant |
| **Online / iterative DPO** | Generate new pairs from the current model, label them, repeat |

```python
from trl import DPOTrainer, DPOConfig
trainer = DPOTrainer(model=model, ref_model=None,            # None: TRL makes a frozen copy
                     args=DPOConfig(output_dir="dpo", beta=0.1, learning_rate=5e-7),
                     train_dataset=pref_ds, processing_class=tokenizer)   # columns: prompt, chosen, rejected
```

---

## 16. RL for reasoning

For tasks with **checkable answers** (maths with known solutions, code with unit tests, puzzles), you don't need a learned reward model: use a **verifiable reward**. "Is the final answer correct?" → reward 1, else 0. This is **RLVR (RL with Verifiable Rewards)**.

The model generates long chain-of-thought solutions ([file 20](20-how-llms-work.md#19-reasoning-models)); correct ones are reinforced. Over training, models learn to reason longer, check their work, and backtrack: the recipe behind **reasoning models** like DeepSeek-R1.

### GRPO (Group Relative Policy Optimization)

A simpler PPO variant (from DeepSeek) that removes the value/critic model:
1. For each prompt, sample a **group** of G answers (e.g. 8)
2. Score each (e.g. correct = 1, wrong = 0)
3. Each answer's **advantage** = (its reward − group mean) / group std (a z-score, [file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores))
4. Increase the probability of above-average answers, decrease below-average ones (with clipping and a KL penalty)

**Example:** 4 answers with rewards [1, 0, 0, 1] → mean 0.5, std 0.5 → advantages [+1, −1, −1, +1].

---

## 17. Constitutional AI and RLAIF

**RLAIF (RL from AI Feedback):** use an AI model instead of humans to judge which response is better. Cheaper and scalable.

**Constitutional AI** (Anthropic): give the model a written set of principles (a "**constitution**", e.g. "choose the response that is most helpful while avoiding harm; don't be preachy"). Then:
1. **Supervised phase:** the model critiques and revises its own responses according to the principles; train on the revised responses.
2. **RL phase:** an AI judge compares responses using the principles, producing preference data for RL.

✅ Reduces reliance on human labelling of harmful content; makes the values **explicit and inspectable**.

Other safety training includes **red-teaming** data (deliberately adversarial prompts, file 29) and training models to resist jailbreaks.

---

## 18. Distributed training

Big models don't fit on one GPU, and training on one GPU would take years. So we spread the work.

### Data parallelism (DP / DDP)

Each GPU has a **full copy** of the model and processes **different batches**. After the backward pass, gradients are **averaged across GPUs** (an operation called **all-reduce**, implemented by NVIDIA's **NCCL** library), so all copies stay identical.

```
GPU 0: model copy, batch 0 ─┐
GPU 1: model copy, batch 1 ─┼─ all-reduce (average gradients) ─► same update everywhere
GPU 2: model copy, batch 2 ─┤
GPU 3: model copy, batch 3 ─┘
```

✅ Simple, scales throughput. ❌ Every GPU must hold the whole model + optimiser (16 bytes/param, section 7).

### ZeRO / FSDP (sharded data parallelism)

**ZeRO** (DeepSpeed) and **FSDP** (PyTorch Fully Sharded Data Parallel) split (**shard**) the memory across GPUs instead of copying it:
- **ZeRO-1:** shard optimiser states
- **ZeRO-2:** + gradients
- **ZeRO-3 / FSDP:** + the parameters themselves (gathered just in time for each layer's computation)

With 8 GPUs and ZeRO-3, each GPU holds ~1/8 of the 16 bytes/param.
**Example:** 7B model: 112 GB / 8 = **14 GB per GPU** (+ activations). It fits!

**Offloading:** move optimiser states or parameters to CPU RAM or NVMe disk when GPU memory is short (slower).

### Model parallelism

When even one layer is too big or you need more speed:
- **Tensor parallelism (TP):** split individual weight matrices across GPUs (e.g. each GPU computes some of the attention heads or part of the FFN). Needs very fast connections between GPUs (NVLink); used within a server. **Megatron-LM** popularised it.
- **Pipeline parallelism (PP):** put different **layers** on different GPUs (GPU 0: layers 1 to 8, GPU 1: 9 to 16...). Micro-batches flow through like an assembly line. Idle time at the start/end is called the **pipeline bubble**.
- **Sequence / context parallelism:** split long sequences across GPUs.
- **Expert parallelism:** put different MoE experts on different GPUs (section 20).

**3D parallelism** = data × tensor × pipeline combined. Example: 1,024 GPUs = 8 (TP) × 16 (PP) × 8 (DP).

### Other training stability tools

- BF16 mixed precision ([file 15](15-neural-networks.md#20-gpus-memory-and-mixed-precision)); **FP8** training on newest GPUs (NVIDIA **Transformer Engine**)
- Gradient clipping, warmup, cosine or **WSD (warmup-stable-decay)** schedules
- **Loss spikes:** sudden jumps in loss; handled by restarting from a checkpoint, skipping bad batches, lowering the LR
- Frequent **checkpointing** (saving training state) so hardware failures don't lose weeks of work
- **MFU (Model FLOPs Utilisation):** the fraction of the GPUs' theoretical maximum FLOP/s actually achieved; 40 to 60% is good

**Frameworks:** PyTorch FSDP, DeepSpeed, Megatron-LM / Megatron-Core, NVIDIA **NeMo**, Hugging Face Accelerate, torchtitan.

---

## 19. Distillation, quantisation, pruning

Making models **smaller, faster and cheaper** to run.

### Knowledge distillation

Train a small **student** model to imitate a large **teacher** model ([file 07](07-math-probability-statistics.md#24-kl-divergence)).
- **Logit distillation:** the student learns to match the teacher's full output **probability distribution** (soft targets, with a temperature), minimising KL divergence, not just the single correct label. The distribution carries extra information ("this is probably a 7, but looks a bit like a 1").
- **Sequence-level / synthetic-data distillation:** the teacher generates answers; the student is fine-tuned on them (common with LLM APIs).

**Example:** DistilBERT is 40% smaller and 60% faster than BERT while keeping ~97% of its performance. Many small open LLMs are distilled from larger ones.

### Quantisation

Store and compute with **lower-precision numbers** ([file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes)): FP16/BF16 → INT8 → INT4 (or FP8/FP4).

**Basic idea (absmax INT8):**
```
scale = max(|weights|) / 127
q = round(w / scale)            (an integer from −127 to 127)
w ≈ q × scale                   (de-quantised)
```

**Worked example:** weights [0.5, −1.2, 0.03, 2.54]. max|w| = 2.54 → scale = 2.54/127 = 0.02
q = [25, −60, 2, 127] (rounded: 0.5/0.02 = 25, −1.2/0.02 = −60, 0.03/0.02 = 1.5 → 2, 2.54/0.02 = 127)
De-quantised: [0.50, −1.20, 0.04, 2.54]: tiny error on 0.03 (→ 0.04).

**Outliers** are the main problem: one huge weight makes the scale large, so small weights lose precision. Solutions: quantise in small **groups/blocks** (e.g. 64 or 128 weights per scale), special handling for outlier channels.

| Type | When | Notes |
|---|---|---|
| **Post-Training Quantisation (PTQ)** | After training, using a small **calibration** dataset | Most common: GPTQ, AWQ (weight-only INT4), SmoothQuant (W8A8: weights and activations INT8), FP8 |
| **Quantisation-Aware Training (QAT)** | Simulate quantisation during training | Better quality at low bits; more effort |
| **Formats for local use** | GGUF (llama.cpp / Ollama) | Many quantisation levels (Q4_K_M, Q8_0...) (file 27) |

**Memory benefit (8B model):** BF16 16 GB → INT8 8 GB → INT4 ~4.5 GB.
**Speed benefit:** decoding is memory-bandwidth-bound ([file 20](20-how-llms-work.md#12-the-kv-cache)), so loading fewer bytes per token directly speeds generation.
**Quality:** INT8 is usually nearly lossless; 4-bit loses a little (more on small models and hard tasks); below 4 bits degrades noticeably. Always evaluate (file 26).

### Pruning

Remove unimportant weights or structures.
- **Unstructured pruning:** zero out individual small weights (sparsity). Hard to speed up on normal hardware, except special patterns like NVIDIA's **2:4 sparsity** (2 of every 4 weights zero).
- **Structured pruning:** remove whole neurons, attention heads or layers, so the model is genuinely smaller and faster. Usually followed by some retraining/distillation to recover quality (e.g. NVIDIA **Minitron**: prune + distill).

---

## 20. Mixture of Experts

**MoE (Mixture of Experts):** replace each FFN layer ([file 19](19-transformers.md#10-the-feed-forward-network)) with **many** FFNs (**experts**) plus a small **router** (gating network) that picks the **top-k** experts (e.g. 2 of 8, or 8 of 256) for **each token**.

```
            token vector
                 │
             ┌───┴────┐
             │ Router  │ → scores for each expert → pick top-2
             └───┬────┘
     ┌────┬────┬─┴──┬────┬────┬────┬────┐
     E1   E2   E3   E4   E5   E6   E7   E8      (8 expert FFNs)
          ✓              ✓                     only 2 run for this token
     output = w₂·E2(x) + w₅·E5(x)   (weighted by router probabilities)
```

**Why?** Huge **total** parameters (lots of capacity/knowledge) but only a fraction are **active** per token, so compute per token stays low.

**Example:** Mixtral 8×7B: ~47B total parameters, ~13B **active** per token, so it runs about as fast as a 13B dense model but performs like a much larger one. Many frontier models (e.g. DeepSeek-V3, ~671B total / ~37B active) are MoE.

**Challenges:**
- **Load balancing:** routers tend to overuse a few experts. An **auxiliary load-balancing loss** (or bias adjustments) encourages even usage.
- **Expert capacity:** a limit on tokens per expert per batch; overflow tokens get dropped or rerouted.
- **Memory:** all experts must be stored in GPU memory even though few are used per token, so MoE needs lots of memory (expert parallelism across GPUs, section 18).
- Training instability; fine-tuning is trickier.

---

## 21. Model merging

Combine the **weights** of several fine-tuned models (from the same base) into one model **without further training**.
- **Weight averaging / model soups:** average parameters
- **Task arithmetic:** compute "task vectors" (fine-tuned − base) and add them to the base
- **TIES-merging, DARE:** resolve conflicts between task vectors (trim small changes, resolve sign disagreements)

Popular in the open-model community (tool: **mergekit**) to combine skills cheaply.

---

## 22. Check yourself

**Q1.** Put in order and say what each produces: SFT, pretraining, preference tuning.
<details><summary>Answer</summary>Pretraining (base model with knowledge) → SFT (instruction-following assistant) → preference tuning (better-aligned, more helpful/harmless chat model).</details>

**Q2.** Why deduplicate and decontaminate pretraining data?
<details><summary>Answer</summary>Dedup: avoid wasted compute, memorisation and privacy leaks. Decontamination: prevent test-set leakage that would inflate benchmark scores.</details>

**Q3.** A company wants a chatbot that answers from its constantly changing product catalogue. Fine-tuning or RAG?
<details><summary>Answer</summary>RAG: facts change frequently, and fine-tuning is poor at reliably injecting/updating knowledge.</details>

**Q4.** Why are SFT labels for prompt tokens set to −100?
<details><summary>Answer</summary>So the loss ignores them: the model learns to generate assistant responses, not to predict user/system text.</details>

**Q5.** Estimate memory for full fine-tuning of a 3B model with AdamW + mixed precision (excluding activations).
<details><summary>Answer</summary>3B × 16 bytes ≈ **48 GB**.</details>

**Q6.** LoRA with r = 8 on a 2048 × 2048 matrix: how many trainable parameters vs full?
<details><summary>Answer</summary>8×2048 + 2048×8 = 32,768 vs 4,194,304, which is 128× fewer.</details>

**Q7.** Why is B initialised to zero in LoRA?
<details><summary>Answer</summary>So BA = 0 at the start and the adapted model initially equals the original; training learns the update from there.</details>

**Q8.** What three ideas make QLoRA memory-efficient?
<details><summary>Answer</summary>4-bit NF4 quantised frozen base weights, double quantisation of scaling constants, and paged optimisers (plus LoRA's small trainable parameter count).</details>

**Q9.** Reward model scores: chosen 1.0, rejected 3.0. Compute the Bradley-Terry loss. Is the RM right?
<details><summary>Answer</summary>sigmoid(1 − 3) = sigmoid(−2) ≈ 0.119 → loss = −ln(0.119) ≈ **2.13**. The RM is wrong (it prefers the rejected answer).</details>

**Q10.** What is reward hacking and how does RLHF limit it?
<details><summary>Answer</summary>The policy exploits flaws in the reward model to get high scores without being genuinely better (e.g. length, flattery). A KL penalty keeps the policy close to the SFT reference model.</details>

**Q11.** How does DPO differ from PPO-based RLHF?
<details><summary>Answer</summary>No separate reward model and no RL sampling loop; it directly optimises the policy on preference pairs with a classification-style loss relative to a frozen reference model.</details>

**Q12.** In GRPO, a group's rewards are [1, 1, 0, 0, 0, 0]. Which answers get positive advantage?
<details><summary>Answer</summary>Mean = 1/3; the two correct answers (reward 1) are above the mean → positive advantage; the others negative.</details>

**Q13.** 8 GPUs, a 13B model, ZeRO-3. Approximate memory per GPU for weights + grads + optimiser?
<details><summary>Answer</summary>13B × 16 bytes = 208 GB / 8 = **26 GB per GPU** (+ activations).</details>

**Q14.** INT8-quantise [1.0, −0.5, 0.254] with absmax. Show scale and integers.
<details><summary>Answer</summary>scale = 1.0/127 ≈ 0.007874. q = round([127, −63.5, 32.26]) = [127, −64 (or −63), 32]. De-quantised ≈ [1.0, −0.504, 0.252].</details>

**Q15.** An MoE has 8 experts of 1B parameters each (FFN only), top-2 routing. Roughly how many FFN parameters are active per token?
<details><summary>Answer</summary>2 × 1B = **2B** active (out of 8B total), plus the router and the shared attention parameters.</details>

---

## 23. New words in this file

| Word | Meaning |
|---|---|
| LLM lifecycle | Data → pretraining → SFT → preference tuning → evaluation/deployment |
| Quality filtering (heuristic, model-based, perplexity) | Removing low-quality text |
| PII removal | Masking personal information |
| Deduplication, MinHash, LSH | Removing (near-)duplicates efficiently |
| Memorisation | Model reproducing training text verbatim |
| Decontamination | Removing benchmark test data from training data |
| Data mixture, annealing | Source proportions / emphasising quality data late in training |
| NeMo Curator, datatrove, FineWeb | Data curation tools / a public dataset |
| Synthetic data, Self-Instruct, Alpaca | Model-generated training data |
| Model collapse | Degradation from training on model outputs repeatedly |
| Continued / domain-adaptive pretraining | Further next-token training on domain text |
| Catastrophic forgetting, replay, re-warming, EWC | Losing old skills / mitigations |
| SFT / instruction tuning | Training on instruction→response examples |
| Loss masking (−100) | Ignoring non-assistant tokens in the loss |
| Packing | Concatenating short examples into full sequences |
| LIMA, superficial alignment hypothesis | Few high-quality examples suffice / SFT teaches format |
| NEFTune | Noise on embeddings during SFT |
| Full fine-tuning, 16 bytes/parameter | Updating all weights / memory rule of thumb |
| PEFT, adapter | Training few parameters / small trainable add-on |
| LoRA, rank r, alpha α, target_modules | Low-rank update B·A and its settings |
| rsLoRA, DoRA | LoRA variants |
| Merging adapters, merge_and_unload | Folding LoRA into the base weights |
| QLoRA, NF4, double quantisation, paged optimisers, compute dtype | 4-bit base + LoRA and its tricks |
| bitsandbytes, PEFT, TRL | Libraries for quantisation, adapters, SFT/DPO/GRPO |
| Prompt tuning, prefix tuning, P-tuning, IA³, BitFit | Other PEFT methods |
| Alignment, HHH | Making models helpful, honest, harmless |
| Preference data (chosen/rejected) | Pairs of better/worse answers |
| RLHF | RL from human feedback |
| Reward model, Bradley-Terry | Model scoring responses / preference probability model |
| Policy, PPO, clipping | LLM as RL agent / optimisation algorithm / limiting update size |
| KL penalty, reference model, β | Keeping close to the SFT model |
| Reward hacking | Exploiting reward model flaws |
| DPO, implicit reward | Direct preference optimisation |
| IPO, KTO, ORPO, SimPO, online DPO | Other preference methods |
| RLVR, verifiable reward | RL with automatically checkable rewards |
| GRPO, group, advantage | Critic-free RL using group-relative scores |
| RLAIF, Constitutional AI, constitution | AI feedback / principle-guided self-improvement |
| Red-teaming | Adversarial testing |
| Data parallelism (DDP), all-reduce, NCCL | Replicated models, averaged gradients, communication library |
| ZeRO-1/2/3, FSDP, sharding, offloading | Splitting training memory across GPUs/CPU |
| Tensor, pipeline, sequence, context, expert parallelism | Ways to split models across GPUs |
| Pipeline bubble, 3D parallelism, NVLink | Idle time / combined parallelism / fast GPU links |
| Megatron-LM, DeepSpeed, NeMo, Accelerate | Training frameworks |
| FP8, Transformer Engine | 8-bit floating-point training |
| Loss spike, WSD schedule, MFU | Training instability / LR schedule / hardware efficiency |
| Knowledge distillation, teacher/student, soft targets | Small model imitating a big one |
| Quantisation, absmax, scale, calibration | Lower-precision numbers |
| PTQ, QAT, GPTQ, AWQ, SmoothQuant, W8A8, GGUF | Quantisation methods/formats |
| Group-wise quantisation, outliers | Per-block scales / extreme values hurting precision |
| Pruning (unstructured, structured), 2:4 sparsity, Minitron | Removing weights or structures |
| MoE, expert, router/gating, top-k routing | Sparse layers with many FFNs |
| Total vs active parameters | Stored vs used per token |
| Load balancing loss, expert capacity | MoE training mechanisms |
| Model merging, model soup, task arithmetic, TIES, DARE, mergekit | Combining fine-tuned weights |

**🎉 You've finished Part E: NLP and LLMs!**

**Mini project for Part E:** (1) Use `tiktoken` or a Hugging Face tokeniser to compare token counts for the same paragraph in English and another language you know; compute the cost difference at an API's prices. (2) Fine-tune a 0.5 to 1.5B instruct model with QLoRA on ~500 examples of a narrow task (e.g. converting messy addresses into structured JSON). Compare it with the base model and with prompting a bigger model, on 50 held-out examples.

**Next:** [22-prompt-engineering.md](22-prompt-engineering.md)
