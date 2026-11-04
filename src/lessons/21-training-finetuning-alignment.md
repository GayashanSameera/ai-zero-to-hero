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

**Why it exists:** no single training step makes a useful assistant. Each stage fixes a different gap: pretraining gives knowledge, SFT gives manners, preference tuning gives judgement.

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

**Worked example (the lifecycle in numbers, illustrative):**

| Stage | Data size | Cost level | What changes |
|---|---|---|---|
| Pretraining | ~15 trillion tokens | Millions of dollars, thousands of GPUs, weeks | Knowledge and language |
| SFT | ~10,000 to 1,000,000 examples | Hours to days on a few GPUs | Follows instructions |
| Preference tuning | ~10,000 to 500,000 pairs | Hours to days | Helpful, honest, safe tone |
| Evaluation / deployment | Test sets, red-team prompts | Ongoing | Catches problems |

**Where you'll meet it in real work:** a hospital that wants a clinical-notes assistant does *not* pretrain. It starts from an open instruct model and does the cheap stages on its own data.

**Common mistake:** thinking every company trains models from scratch. Almost all stand on a pretrained base.

**Exam angle:** the order data, pretraining, SFT, preference tuning (RLHF/DPO), evaluation is often asked directly.

> **සිංහලෙන්:** LLM එකක් හැදෙන්නේ පියවර කීපයකින්. මුලින් pretraining එකෙන් අතිවිශාල text එකකින් දැනුම ගන්නවා, ඒකට වියදම ගොඩක් යනවා. ඊට පස්සේ SFT එකෙන් ප්‍රශ්නවලට උත්තර දෙන හැටි ඉගැන්නුවා, ඒක පුස්තකාලයේ හැම පොතක්ම කියවපු කෙනාට ගුරුවරයෙක් හොඳ උත්තර දෙන හැටි පෙන්නනවා වගේ. අන්තිමට preference tuning එකෙන් මිනිස්සුන්ට කැමති උත්තර වර්ග ඉගැන්නුවා. ඔයා බොහෝ විට මුල ඉඳන් train කරන්නේ නෑ, තියෙන model එකක් fine-tune කරනවා.

---

## 2. Pretraining data

**Why it exists:** a model can only be as good as what it reads. Curating the data is usually cheaper and more effective than making the model bigger.

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

**Worked example: how much survives the pipeline?** Suppose a crawl gives 100 TB of raw pages (illustrative proportions):

| Step | Kept | Remaining |
|---|---|---|
| Extract clean text | 20% | 20 TB |
| Language ID + quality filter | 25% | 5 TB |
| Dedup (exact + near) | 60% | 3 TB |
| Safety / PII filter | 95% | 2.85 TB |

Only about **2.9%** of the raw bytes become training text, but that 2.9% is far better than the original.

**Near-duplicate check (Jaccard similarity):** two documents share 80 of the 100 distinct words in their union. Similarity = 80 ÷ 100 = **0.80**. MinHash estimates this number without comparing every pair, and documents above a threshold such as 0.8 are treated as duplicates.

**Decontamination example:** if a benchmark question appears word for word in the training data, the model may score 90% by memory instead of ability. Removing it keeps the score honest.

**Where you'll meet it in real work:** building a Sinhala corpus: scrape news and government sites, drop menus and ads, remove duplicate reposts, strip phone numbers and NICs.

**Common mistakes:** skipping deduplication, and letting benchmark data leak in.

**Exam angle:** know what dedup, quality filtering and decontamination each protect against.

> **සිංහලෙන්:** Model එකක් හොඳ වෙන්නේ ඒක කියවන data හොඳ නම්. ඒ නිසා web එකෙන් එකතු කරපු text එකෙන් menus, ads, spam අයින් කරනවා. Duplicate එකම ලිපි 10 පාරක් තිබුණොත් model එක ඒක කටපාඩම් කරනවා, ඒ නිසා MinHash වගේ ක්‍රමයකින් duplicates අයින් කරනවා. 100 TB raw pages වලින් අන්තිමට ඉතුරු වෙන්නේ 3 TB විතරයි. Benchmark ප්‍රශ්න training data එකේ තිබුණොත් model එක විභාග පත්තරේ කලින් දැක්කා වගේ, ඒ නිසා ඒවාත් අයින් කරනවා (decontamination). NIC අංක, phone අංක වගේ පුද්ගලික දත්තත් අයින් කරනවා.

---

## 3. Synthetic data

**Why it exists:** high-quality human text is limited and expensive. Models can write extra training examples, which is cheap, if you check them carefully.

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

**Worked example: the generate, verify, keep loop** for maths problems. A teacher model writes 10,000 problems with step-by-step solutions. A program recomputes each final answer, and 7,200 match. Keep 7,200 (72%) and discard 2,800. The checked set is both cheaper than human writing and safer than unchecked output.

**Model collapse in a table (illustrative):**

| Generation | Training data | What happens to rare words / ideas |
|---|---|---|
| 1 | Real human text | Full variety |
| 2 | Mostly output of model 1 | Rare things become rarer |
| 3 | Mostly output of model 2 | Narrow, repetitive text; errors repeat |

Like photocopying a photocopy: each copy is a bit blurrier than the last.

**Where you'll meet it in real work:** a Sinhala support bot with only 200 real conversations uses a stronger model to write 5,000 extra examples, then a human reviews a sample before training.

**Common mistakes:** training on unfiltered model output; ignoring the generating model's licence terms.

**Exam angle:** synthetic data is useful but needs verification; model collapse happens from repeated training on model output without real data.

> **සිංහලෙන්:** Synthetic data කියන්නේ මිනිස්සු ලියන්නේ නැතුව තවත් model එකකින් හදපු training data. හොඳ උදාහරණ ටිකක් විතරක් තියෙනවා නම් ලොකු model එකකින් තවත් උදාහරණ 10,000ක් හදන්න පුළුවන්. ඒත් හදපු ඒවා පරීක්ෂා කරන්න ඕනේ. උදාහරණයක් විදිහට ගණිත ගැටලු 10,000න් 7,200ක උත්තර වැඩසටහනකින් හරි කියලා තහවුරු වුණොත් ඒ 7,200 විතරක් තියාගන්නවා. Photocopy එකක photocopy එක ගන්නවා වගේ, model එකේ output එකෙන්ම නැවත නැවත train කළොත් විවිධත්වය නැති වෙලා යනවා, ඒකට model collapse කියනවා.

---

## 4. Continued pretraining

**Why it exists:** a general model may not know your domain or language well. Continued pretraining lets it read more of that kind of text, but without care it forgets what it knew.

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

**Worked example: a replay mix.** You train a base model on 2 billion tokens of Sinhala news. To limit forgetting, you mix in 20% general English and code text:
- Sinhala: 2B tokens
- Replay: 2B × 20 ÷ 80 = 0.5B tokens
- Total: 2.5B tokens, of which 0.5 ÷ 2.5 = **20%** is replay.

**Text picture of forgetting:**

```
skill level
 General chat  ####################  before
 General chat  ########              after training on legal text only (forgot)
 Legal drafting ####                  before
 Legal drafting ###################   after
```

With replay, the first bar stays near 18 or 19 while the legal bar still rises.

**Analogy:** a student who studies only for the Chemistry exam for a month and then fails an English quiz.

**Where you'll meet it in real work:** adapting a model to Sinhala medical text, or a bank's internal policy language.

**Common mistakes:** using continued pretraining to "teach a few facts" (fine-tuning with examples or RAG is better); using a high learning rate that wipes out old skills.

**Exam angle:** catastrophic forgetting and replay are standard terms.

> **සිංහලෙන්:** Continued pretraining කියන්නේ ඒ model එකටම තවත් විශේෂිත text (උදා: සිංහල පුවත්පත්, වෛද්‍ය පත්‍රිකා) කියවන්න දීම. ප්‍රශ්නය catastrophic forgetting. මාසයක් Chemistry විතරක් කරපු ළමයා English quiz එකක අසමත් වෙනවා වගේ, model එකත් පරණ දේවල් අමතක කරනවා. ඒක අඩු කරන්න සාමාන්‍ය text 20%ක් විතර අලුත් data එක්ක මිශ්‍ර කරනවා (replay). Learning rate එකත් අඩුවෙන් තියාගන්නවා. ටික දැනුමක් එකතු කරන්න නම් මෙය නෙවෙයි RAG පාවිච්චි කරන්න.

---

## 5. Prompting vs RAG vs fine-tuning

**Why it exists:** people reach for fine-tuning first because it sounds powerful, but it is often the slowest and costliest fix. This section gives the order to try things in.

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

**Decision flow:**

```
Can a clear prompt (with examples) do it?  -- yes --> Prompt engineering
        | no
Does it need private / changing facts?     -- yes --> RAG
        | no
Does it need actions or live data?         -- yes --> Tools / agents
        | no
Need a fixed style, format or cheap small model? -- yes --> Fine-tune (SFT / LoRA)
```

**Worked example: when fine-tuning pays off.** An API model costs $105/day for a task (section 6 of file 20). You fine-tune a small open model on 20,000 verified outputs; it reaches similar quality on this narrow task and costs, say, $30/day to host. Saving $75/day, about $2,250/month, which can repay the one-time training cost in a few months. (Illustrative numbers; always measure quality first.)

**Where you'll meet it in real work:** a telco's "check my balance" bot (tools), a policy Q&A bot (RAG), and a brand-voice email writer (fine-tune, if prompting is inconsistent).

**Common mistakes:** fine-tuning to inject facts that change monthly; skipping an evaluation set so you cannot tell whether fine-tuning helped.

**Exam angle:** "private, frequently changing knowledge" means RAG; "consistent style or format" can mean fine-tuning; start with the cheapest option.

> **සිංහලෙන්:** ගැටලුවක් ආවම මුලින්ම prompt එක හොඳ කරලා බලන්න, ඒක ලාභම සහ ඉක්මන්ම. Company එකේ private හෝ නිතර වෙනස් වෙන දත්ත (HR policy, මිල ලැයිස්තුව) ඕනේ නම් RAG පාවිච්චි කරන්න. Balance බලන්න වගේ ක්‍රියා සහ live data වලට tools පාවිච්චි කරනවා. Style එක, format එක හෝ පොඩි, ලාභ model එකක් ඕනේ නම් විතරයි fine-tune කරන්නේ. Fine-tuning එකෙන් facts ඉගැන්නුවාට ඒවා වෙනස් වෙනකොට ආයෙත් train කරන්න වෙනවා, ඒ නිසා facts වලට RAG.

---

## 6. Supervised fine-tuning

**Why it exists:** a base model only continues text. SFT shows it thousands of "question, ideal answer" pairs so that it learns to answer.

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

**Worked example: counting what the loss sees.** One training example is tokenised into 60 tokens: 20 system + 15 user + 25 assistant. With loss masking, only the 25 assistant tokens carry labels; the other 35 get −100. If the average loss on those 25 tokens is 1.2, the example's loss is 1.2 (computed over 25 tokens, not 60).

**Worked example: how many steps?** 2,000 examples, batch size 8 and 1 GPU, 2 epochs, with no packing:
- Steps per epoch: 2,000 ÷ 8 = 250
- Total steps: 250 × 2 = **500**
If you accumulate gradients over 4 mini-batches, the effective batch is 32 and the step count falls to about 63 per epoch (2,000 ÷ 32 = 62.5).

**Packing picture:**

```
Without packing:  [ex1 ....PAD PAD PAD] [ex2 ......PAD PAD]   (padding wasted)
With packing:     [ex1 ....][ex2 ......][ex3 ..]               (full sequence, masks keep them apart)
```

**Where you'll meet it in real work:** teaching a model to answer in your telecom company's tone using 1,000 curated chats.

**Common mistakes:** many epochs (the model memorises); noisy answers in the data (the model learns the noise); forgetting to use the model's own chat template.

**Exam angle:** SFT uses next-token cross-entropy on responses; data quality beats quantity (LIMA).

> **සිංහලෙන්:** SFT කියන්නේ "ප්‍රශ්නය → හොඳම උත්තරය" යුගල ගොඩක් පෙන්නලා model එකට උත්තර දෙන හැටි ඉගැන්නුවා. Training වලදී loss එක ගණන් කරන්නේ assistant ගේ tokens වලට විතරයි, ඒ නිසා user සහ system කොටස් වල labels -100 කරනවා. Tokens 60ක උදාහරණයක assistant tokens 25ක් නම් loss එක ගන්නේ ඒ 25න්. උදාහරණ 2,000ක් batch 8 එක්ක epoch 2ක් යනවා නම් steps 500යි. සම්පූර්ණ දත්ත ප්‍රමාණයට වඩා data එකේ quality එක වැදගත්, උදාහරණ 1,000ක් හොඳ නම් ඇති.

---

## 7. Memory cost of full fine-tuning

**Why it matters:** this arithmetic tells you, before you rent a GPU, whether a fine-tuning job will fit or crash with an out-of-memory error.

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

**Worked example: the bill of materials for a 7B model**

| Item | Calculation | Memory |
|---|---|---|
| BF16 weights | 7B × 2 | 14 GB |
| BF16 gradients | 7B × 2 | 14 GB |
| FP32 master weights | 7B × 4 | 28 GB |
| Adam m | 7B × 4 | 28 GB |
| Adam v | 7B × 4 | 28 GB |
| **Total** | 7B × 16 | **112 GB** |

**Quick table for planning (without activations):**

| Model | Full fine-tune memory (16 bytes/param) | 80 GB GPUs needed at minimum |
|---|---|---|
| 1B | 16 GB | 1 |
| 7B | 112 GB | 2 |
| 13B | 208 GB | 3 |
| 70B | 1,120 GB | 14 |

**Where you'll meet it in real work:** the very first estimate in any fine-tuning proposal.

**Common mistakes:** counting only the weights (2 bytes per parameter) and forgetting gradients and optimiser state; forgetting activations, which add more.

**Exam angle:** "approximately how much memory does full fine-tuning of an N-parameter model need with AdamW and mixed precision?" Answer: about 16 bytes × N.

> **සිංහලෙන්:** Model එකක් full fine-tune කරන්න GPU memory ගොඩක් ඕනේ. Weight එකක් BF16 වලදී bytes 2යි, ඒත් gradient එකට 2ක්, FP32 copy එකට 4ක්, Adam වල m සහ v වලට 4 බැගින් 8ක් එකතු වෙලා parameter එකකට bytes 16ක් යනවා. Parameters බිලියන 7ක model එකකට 7 × 16 = GB 112යි, ඒක GB 80ක GPU එකකට එන්නේ නෑ. ඒ නිසා තමයි LoRA වගේ ලාභ ක්‍රම හොයාගත්තේ. Activations වලට තව memory ඕනේ බව මතක තියාගන්න.

---

## 8. PEFT

**Why it exists:** training every weight is slow, memory-hungry and produces a full-size copy for each task. PEFT trains only a tiny add-on and leaves the original untouched.

**Parameter-Efficient Fine-Tuning (PEFT):** freeze the original model and train only a **small number of new or selected parameters** (often < 1%).

**Benefits:**
- Far less memory (no gradients or optimiser state for frozen weights)
- Tiny output files (megabytes instead of gigabytes): you can keep many task-specific **adapters** for one base model and swap them
- Less catastrophic forgetting
- Often matches full fine-tuning quality on many tasks

**Worked example: storage for 10 customers.** A company serves 10 customers, each needing a different fine-tune of a 7B model.
- Full fine-tuning: 10 copies × 14 GB = **140 GB** to store and load.
- PEFT with adapters of ~50 MB each: one 14 GB base + 10 × 0.05 GB = **14.5 GB**.

```
        one frozen base model (14 GB)
        /       |        |        \
  adapter A  adapter B  adapter C  ...   (each tens of MB, swapped per request)
```

**Analogy:** a doctor (the base model) keeps one thick medical degree and carries small notebooks of specialist notes, one per specialty.

**Where you'll meet it in real work:** SaaS products that give each client a personal style while sharing one GPU.

**Common mistake:** assuming PEFT always matches full fine-tuning. On hard or very different tasks, full fine-tuning can still win.

**Exam angle:** PEFT freezes the base weights and trains <1% of parameters; benefits are memory, storage and less forgetting.

> **සිංහලෙන්:** PEFT කියන්නේ මුළු model එකම අලුතින් train නොකර, පොඩි අමතර කොටසක් විතරක් train කරන එක. මුල් weights freeze කරලා තියෙනවා. ග්‍රාහකයෝ 10දෙනෙකුට වෙන වෙනම fine-tuned 7B model හදනවා නම් full fine-tuning වලට GB 140ක් ඕනේ, PEFT වලදී base එක GB 14ක් සහ එක් එක් adapter එක MB 50ක් විතර නිසා එකතුව GB 14.5ක් විතරයි. දොස්තර කෙනෙක් වෛද්‍ය උපාධිය එහෙමම තියාගෙන විශේෂඥ notes වෙනම පොත් වල තියාගන්නවා වගේ.

---

## 9. LoRA

**Why it exists:** the change that fine-tuning makes to a big weight matrix is often "simple" (low rank), so we can describe it with two skinny matrices instead of one giant one.

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

### Worked example with tiny matrices

Let W be 4 × 3 (12 numbers) and choose rank r = 1. Then B is 4 × 1 and A is 1 × 3, so only 4 + 3 = **7** numbers are trained. Let B = [1, 2, 0, −1]ᵀ and A = [2, 0, 1]. The product BA is a 4 × 3 matrix: each row of B multiplies the row A:

```
row 1:  1 × [2, 0, 1] = [ 2, 0,  1]
row 2:  2 × [2, 0, 1] = [ 4, 0,  2]
row 3:  0 × [2, 0, 1] = [ 0, 0,  0]
row 4: -1 × [2, 0, 1] = [-2, 0, -1]
```

Twelve numbers of update described by seven. This is rank 1: every row is a multiple of the same row.

At the start B = 0, so BA is all zeros and the model equals the original.

### Scaling factor

With r = 16 and α = 32, the update is multiplied by α ÷ r = **2**. With α = r the multiplier is 1.

### Parameter savings, more cases

| Matrix | Full | LoRA r = 8 | Ratio |
|---|---|---|---|
| 4096 × 4096 | 16,777,216 | 8 × 4096 × 2 = 65,536 | 256× fewer (0.39%) |
| 4096 × 4096 | 16,777,216 | r = 16: 131,072 | 128× fewer (0.78%) |
| 2048 × 2048 | 4,194,304 | r = 8: 32,768 | 128× fewer |

**Where you'll meet it in real work:** fine-tuning an open 8B model for a company-specific task on one rented GPU.

**Common mistakes:** setting r far too high (more parameters, more overfitting, little gain); forgetting that the learning rate for LoRA is higher than for full fine-tuning.

**Exam angle:** LoRA freezes W, trains A and B, initialises B to zero, and can be merged back with no extra inference cost.

> **සිංහලෙන්:** LoRA වලදී ලොකු weight matrix එක (උදා: 4096 × 4096) freeze කරලා, ඒකට එකතු වෙන "වෙනස" පොඩි matrices දෙකක ගුණිතයක් (B × A) විදිහට ඉගෙන ගන්නවා. 4096 × 4096 matrix එකේ parameters 16,777,216යි, ඒත් rank 8 LoRA වලදී 65,536ක් විතරයි, ඒ කියන්නේ 256 ගුණයක් අඩුයි. Training පටන් ගන්නකොට B එක බිංදුවෙන් පටන් ගන්න නිසා model එක මුල් model එකමයි. අන්තිමට adapter එක ගොඩ ගහලා merge කළොත් inference වලදී අමතර වියදමක් නෑ. Rank එක ඕනෑවට වඩා ලොකු කරන්න එපා.

---

## 10. QLoRA

**Why it exists:** even LoRA needs the full base model in memory. Storing the frozen base in 4 bits cuts that memory by roughly 4×, so a normal single GPU is enough.

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

**Worked example: will it fit?** A 16 GB GPU, 7B model, LoRA r = 16 on all linear layers.
- 4-bit base weights: 7B × 0.5 bytes = **3.5 GB** (plus a little overhead for quantisation constants)
- LoRA parameters: say 40M × 2 bytes = 0.08 GB; their gradients 0.08 GB; Adam states 40M × 8 bytes = 0.32 GB. Total about **0.5 GB**
- Activations + CUDA overhead: a few GB, depending on batch and sequence length

Total comfortably under 16 GB. The 16-bit LoRA version would need 14 GB for weights alone and would probably fail.

| Method | Base weights memory (7B) | Typical GPU |
|---|---|---|
| Full fine-tune | 112 GB total | Multi-GPU |
| LoRA (BF16 base) | 14 GB + small | 24 GB+ |
| QLoRA (4-bit base) | 3.5 GB + small | 12 to 16 GB |

**Where you'll meet it in real work:** a student fine-tuning a model on a free Colab T4 for a university project.

**Common mistakes:** forgetting that QLoRA still computes in BF16/FP16 (weights are de-quantised on the fly); expecting QLoRA to be faster than LoRA (it is usually a bit slower).

**Exam angle:** QLoRA = 4-bit NF4 base + LoRA + double quantisation + paged optimisers.

> **සිංහලෙන්:** QLoRA කියන්නේ LoRA, ඒත් freeze කරපු ලොකු model එක 4-bit වලට compress කරලා memory ඉතිරි කරන ක්‍රමය. Parameters බිලියන 7ක model එක 16-bit වලදී GB 14යි, 4-bit වලදී 7 × 0.5 = GB 3.5ක් විතරයි. ඒ නිසා GB 16ක GPU එකක පවා (Colab වල නොමිලේ ලැබෙන එකක් වුණත්) 7B model එකක් fine-tune කරන්න පුළුවන්. NF4, double quantisation, paged optimisers කියන උපක්‍රම තුනෙන් memory තවත් ඉතිරි වෙනවා. ගණනය කරද්දී weights ආපහු BF16 වලට හරවනවා, ඒ නිසා LoRA වලට වඩා ටිකක් හෙමින් තමයි.

---

## 11. Other PEFT methods

**Why it exists:** LoRA is not the only way to train a small add-on. Other methods trade differently between quality, parameters and inference speed.

| Method | What is trained |
|---|---|
| **Adapters** | Small bottleneck MLP layers inserted inside each Transformer block (adds slight inference latency) |
| **Prompt tuning** | A few "soft prompt" embedding vectors prepended to the input (learned vectors, not real words) |
| **Prefix tuning** | Learned vectors prepended to the keys and values at every layer |
| **P-tuning** | Soft prompts produced by a small network |
| **IA³** | Learned vectors that rescale keys, values and FFN activations (extremely few parameters) |
| **BitFit** | Only the bias terms |

LoRA/QLoRA dominate in practice because they're simple, effective and add no inference cost after merging.

**Worked example: how few parameters?** For a 7B model (hidden size 4096, 32 layers):
- **BitFit:** only the bias terms; a tiny fraction (well under 0.1%) of the model
- **Prompt tuning:** 20 soft-prompt vectors × 4096 numbers = **81,920** parameters (about 0.001% of 7B)
- **LoRA r = 16 on q, k, v, o:** about 16.8M parameters (section 9)

The fewer the trainable parameters, the cheaper the training and the smaller the file, but also the less the model can change.

**Where you'll meet it in real work:** most teams use LoRA/QLoRA; you will see the others mainly in papers and exam questions.

**Common mistake:** thinking a soft prompt is readable text. It is a list of learned vectors that do not correspond to real words.

**Exam angle:** name which part of the model each method trains (adapters: inserted layers; prompt tuning: input embeddings; prefix tuning: keys/values at every layer; BitFit: biases).

> **සිංහලෙන්:** LoRA වලට අමතරව PEFT ක්‍රම තව තියෙනවා. Adapters කියන්නේ Transformer block එක ඇතුළට දාන පොඩි layers. Prompt tuning කියන්නේ input එකට "soft prompt" vectors ටිකක් එකතු කරලා ඒවා විතරක් train කරන එක, ඒවා සැබෑ වචන නෙවෙයි. 4096 dimension vectors 20ක් නම් parameters 81,920යි, ඒක 7B model එකට සාපේක්ෂව බොහොම පොඩියි. BitFit එකෙන් biases විතරක් train කරනවා. Parameters අඩු වෙන තරමට වියදම අඩුයි, ඒත් model එකට වෙනස් වෙන්න පුළුවන් ප්‍රමාණයත් අඩුයි. ප්‍රායෝගිකව ජනප්‍රියම LoRA/QLoRA.

---

## 12. Hands-on QLoRA

**Why it exists:** reading about LoRA is not the same as doing it. This recipe is the smallest end-to-end example, so you can see every moving part.

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

**Worked example: reading the config.**
- `per_device_train_batch_size=4` and `gradient_accumulation_steps=4` give an effective batch of 4 × 4 = **16** on one GPU.
- With 500 training examples and no packing: 500 ÷ 16 ≈ 31 optimiser steps per epoch, so 2 epochs ≈ **62** steps. Logging every 10 steps gives about 6 log lines, and evaluating every 50 steps gives 1 evaluation. For so few steps, shorten `eval_steps` and `logging_steps`.
- Learning rate 2e-4 with cosine decay starts at 0.0002 after a 5% warmup (about 3 steps here) and slides towards 0.

**Checklist of what to look at after training:**

| Check | Why |
|---|---|
| Training loss goes down | The model is learning |
| Validation loss stops improving or rises | Overfitting: stop earlier or use fewer epochs |
| 20 real examples read by a human | Loss is not quality |
| Compare with base model and prompting | Is fine-tuning actually worth it? |

**Where you'll meet it in real work:** the typical mini project: teach a 1.5B model to turn messy Sri Lankan addresses ("No 12/A, Galle rd, Dehiwela") into clean JSON.

**Common mistakes:** training on the validation set; using the wrong chat template; using `fp16` on hardware that prefers `bf16` or the reverse; judging by loss only.

**Exam angle:** know the roles of PEFT (adapters), bitsandbytes (4-bit), TRL (SFT/DPO trainers).

> **සිංහලෙන්:** QLoRA කරන කේතයේ ප්‍රධාන කොටස් තුනක් තියෙනවා: bitsandbytes වලින් model එක 4-bit වලට load කිරීම, PEFT වලින් LoRA adapters දාන එක, TRL වලින් SFTTrainer එක දුවන එක. Batch size 4 සහ gradient accumulation 4 නිසා effective batch එක 16යි. උදාහරණ 500ක් epoch 2ක් යනවා නම් steps 62ක් විතර. ඉවර වුණාම loss එක විතරක් බලන්න එපා, සැබෑ උදාහරණ 20ක් විතර ඔයාම කියවලා බලන්න, base model එකත් එක්ක සසඳන්න. Validation loss එක නැග්ගොත් overfitting.

---

## 13. Alignment

**Why it exists:** a model that merely predicts text will happily write a convincing scam email. We also want it honest, safe and actually useful. SFT alone cannot teach "which of two answers is better".

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

**Worked example: a preference pair for a bank bot**

```json
{"prompt": "My card was stolen, what do I do?",
 "chosen":  "I'm sorry. Please block the card now via the app or by calling the hotline, then we'll arrange a replacement.",
 "rejected": "Cards get stolen sometimes. Be more careful next time."}
```

A human finds the first answer better in seconds. Writing a perfect answer from scratch would take far longer, which is why comparisons are the cheapest form of feedback.

**The HHH checklist:**

| Principle | Failure to avoid |
|---|---|
| Helpful | Vague answer, needless refusal |
| Honest | Making up facts, hiding uncertainty |
| Harmless | Giving dangerous instructions |

**Where you'll meet it in real work:** every public chatbot was aligned this way before release; companies also collect thumbs-up/down from users to improve it.

**Common mistakes:** believing alignment makes a model perfectly safe (it reduces, not removes, risk); training with inconsistent labellers who disagree on what is "better".

**Exam angle:** alignment aims at helpful, honest, harmless behaviour using preference data (chosen vs rejected).

> **සිංහලෙන්:** SFT එකෙන් පෙන්නන්නේ හොඳ උත්තරයක් එකක් විතරයි, ඒත් "උත්තර දෙකකින් මොකක්ද හොඳ" කියන එක ඉගැන්නුවේ නෑ. මිනිස්සුන්ට හොඳම උත්තරය ලියන්න වඩා උත්තර දෙකක් සසඳලා "මේක හොඳයි" කියන එක ලේසියි. ඒ නිසා prompt එකකට chosen සහ rejected උත්තර දෙකක් එකතු කරනවා. උදාහරණයක් විදිහට card එක සොරකම් වුණාම "ඉක්මනින් card එක block කරන්න" කියන එක chosen, "ඊළඟ පාර ප්‍රවේශම් වෙන්න" කියන එක rejected. Alignment එකේ ඉලක්කය helpful, honest, harmless (HHH) වීමයි.

---

## 14. RLHF

**Why it exists:** we cannot write a formula for "a good answer". RLHF learns that formula (the reward model) from human comparisons, then pushes the language model towards higher-scoring answers.

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

**Worked example: the Bradley-Terry loss at three gaps**

| r(chosen) − r(rejected) | sigmoid | Loss = −ln(sigmoid) | Reading |
|---|---|---|---|
| +3.0 | 0.953 | 0.049 | RM clearly right |
| 0 | 0.500 | 0.693 | RM cannot tell them apart |
| −1.5 | 0.182 | 1.70 | RM clearly wrong |

**Worked example: the KL penalty at work.** Let β = 0.1. Two candidate replies:
- Reply X: reward-model score 8.0, drifts far from the SFT model, KL = 30. Total = 8.0 − 0.1 × 30 = **5.0**
- Reply Y: score 6.0, stays close, KL = 5. Total = 6.0 − 0.1 × 5 = **5.5**

Y wins. The KL term stops the policy from chasing a high score with weird text. (Illustrative numbers.)

```
prompt -> [policy LLM] -> response -> [reward model] -> score
              ^                                          |
              +------ PPO update (with KL penalty) <-----+
```

**Analogy:** a TV cooking contest. Judges say which dish is tastier (preferences), a "taste meter" is built from that (reward model), and the chef trains to score higher on the meter while keeping their own style (KL penalty).

**Where you'll meet it in real work:** it is how the first ChatGPT-style assistants were made; today many teams skip full RLHF and use DPO for simplicity.

**Common mistakes:** forgetting that the RM is trained on pairs, not on absolute scores; no KL penalty, leading to reward hacking.

**Exam angle:** know the three RLHF steps (SFT, reward model, PPO) and what the KL penalty is for.

> **සිංහලෙන්:** RLHF පියවර තුනක්: මුලින් SFT model එක, ඊට පස්සේ මිනිස්සුන්ගේ comparisons වලින් reward model එකක් (උත්තරයකට ලකුණක් දෙන model එකක්), අන්තිමට PPO වලින් LLM එක ඒ ලකුණු වැඩි කරගන්න පුහුණු කිරීම. Reward model එකේ loss එක chosen සහ rejected අතර ලකුණු වෙනස අනුව: chosen එකට 1.5ක් වැඩියෙන් දුන්නොත් loss 0.20, වැරදියට දුන්නොත් 1.70. KL penalty එක නැත්නම් model එක ලකුණු පස්සේ දුවලා විකාර text ලියනවා (reward hacking). ඒ නිසා පරණ SFT model එකට ළඟින්ම තියාගන්නවා, TV cooking contest එකක chef තමන්ගේ ශෛලිය නැති නොකරගෙන ලකුණු වැඩි කරගන්නවා වගේ.

---

## 15. DPO and friends

**Why it exists:** RLHF needs four models and an unstable RL loop. DPO shows that the same goal can be reached with a simple loss on preference pairs, which is why many teams prefer it.

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

**Worked example: one DPO loss, step by step.** Let β = 0.1. After some training, for one pair:
- chosen: log π(chosen) − log π_ref(chosen) = **+2.0** (more likely than before)
- rejected: log π(rejected) − log π_ref(rejected) = **−1.0** (less likely than before)

1. Difference of the two: 2.0 − (−1.0) = 3.0
2. Multiply by β: 0.1 × 3.0 = 0.3
3. sigmoid(0.3) = 1 ÷ (1 + e^−0.3) = 1 ÷ 1.741 = 0.574
4. Loss = −ln(0.574) = **0.555**

At the very start, π = π_ref, the margin is 0, sigmoid(0) = 0.5 and the loss is −ln 0.5 = **0.693**. Training pushes the margin up and the loss down.

| | RLHF (PPO) | DPO |
|---|---|---|
| Models in memory | policy, reference, reward, critic | policy, reference |
| Needs sampling during training | Yes | No (offline pairs) |
| Stability | Fiddly | Simple |
| Main risk | Reward hacking | Overfitting to the pairs |

**Where you'll meet it in real work:** the TRL `DPOTrainer` on a few thousand of your own chosen/rejected pairs to make a bot more polite.

**Common mistakes:** setting β too small and drifting; low-quality preference pairs where "chosen" is barely better than "rejected".

**Exam angle:** DPO = no separate reward model, no RL loop, uses a frozen reference model.

> **සිංහලෙන්:** DPO කියන්නේ RLHF එකේ වැඩේම, reward model එකක් සහ RL loop එකක් නැතුව කරන සරල ක්‍රමය. Chosen උත්තරේ probability එක මුල් (reference) model එකට වඩා වැඩි කරන්න, rejected එකේ එක අඩු කරන්න loss function එකක් පාවිච්චි කරනවා. උදාහරණයක් විදිහට chosen එක +2.0 ක් වැඩි වෙලා, rejected එක −1.0 ක් අඩු වෙලා, β = 0.1 නම් 0.1 × 3.0 = 0.3, sigmoid(0.3) = 0.574, loss = 0.555. පටන් ගන්නකොට loss එක 0.693. Models දෙකක් විතරයි ඕනේ, ඒ නිසා ලාභයි, ස්ථායියි.

---

## 16. RL for reasoning

**Why it exists:** for maths and code, correctness can be checked automatically. A program can give a free, reliable reward, so we do not need humans or a learned reward model.

For tasks with **checkable answers** (maths with known solutions, code with unit tests, puzzles), you don't need a learned reward model: use a **verifiable reward**. "Is the final answer correct?" → reward 1, else 0. This is **RLVR (RL with Verifiable Rewards)**.

The model generates long chain-of-thought solutions ([file 20](20-how-llms-work.md#19-reasoning-models)); correct ones are reinforced. Over training, models learn to reason longer, check their work, and backtrack: the recipe behind **reasoning models** like DeepSeek-R1.

### GRPO (Group Relative Policy Optimization)

A simpler PPO variant (from DeepSeek) that removes the value/critic model:
1. For each prompt, sample a **group** of G answers (e.g. 8)
2. Score each (e.g. correct = 1, wrong = 0)
3. Each answer's **advantage** = (its reward − group mean) / group std (a z-score, [file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores))
4. Increase the probability of above-average answers, decrease below-average ones (with clipping and a KL penalty)

**Example:** 4 answers with rewards [1, 0, 0, 1] → mean 0.5, std 0.5 → advantages [+1, −1, −1, +1].

**Worked example: GRPO step by step.** Prompt: "What is 15% of 240?" (right answer 36). Sample G = 4 answers; rewards: [1, 0, 0, 0] (only the first is right).
1. Mean = 1 ÷ 4 = 0.25
2. Variance = ((1 − 0.25)² + 3 × (0 − 0.25)²) ÷ 4 = (0.5625 + 0.1875) ÷ 4 = 0.1875
3. Std = √0.1875 = 0.433
4. Advantages: right answer (1 − 0.25) ÷ 0.433 = **+1.73**; each wrong answer (0 − 0.25) ÷ 0.433 = **−0.58**

The rare correct answer gets a strong push up; the wrong ones are gently pushed down. If all four were right (or all wrong), every advantage would be 0, so nothing is learned from that prompt.

**Where you'll meet it in real work:** how open reasoning models (such as DeepSeek-R1) were trained, and a possible way to specialise a small model for maths or code with unit tests.

**Common mistakes:** applying a verifiable-reward recipe to tasks with no checker (essays, advice); rewarding only the final answer when the reasoning contains fake steps.

**Exam angle:** RLVR = automatic correctness reward; GRPO = group-relative advantages, no critic model.

> **සිංහලෙන්:** ගණිතය සහ code වලට උත්තරේ හරිද වැරදිද කියලා වැඩසටහනකින් පරීක්ෂා කරන්න පුළුවන්, ඒක තමයි verifiable reward. GRPO වලදී එක prompt එකකට උත්තර කිහිපයක් (උදා: 4ක්) හදලා, හරි එකට 1, වැරදි වලට 0 දෙනවා. Mean = 0.25, std = 0.433 නම් හරි උත්තරයේ advantage එක +1.73, වැරදි ඒවාට −0.58. එතකොට හරි උත්තරය වෙත ආපු පාර වැඩියෙන් තල්ලු වෙනවා. උත්තර හතරම හරි හෝ හතරම වැරදි නම් advantage 0යි, ඒ prompt එකෙන් ඉගෙන ගන්නේ නෑ. මේක තමයි reasoning models හදන්න පාවිච්චි කළ ක්‍රමය.

---

## 17. Constitutional AI and RLAIF

**Why it exists:** human labellers are slow, expensive, and should not be forced to read endless harmful content. An AI judge guided by written principles can produce feedback at scale.

**RLAIF (RL from AI Feedback):** use an AI model instead of humans to judge which response is better. Cheaper and scalable.

**Constitutional AI** (Anthropic): give the model a written set of principles (a "**constitution**", e.g. "choose the response that is most helpful while avoiding harm; don't be preachy"). Then:
1. **Supervised phase:** the model critiques and revises its own responses according to the principles; train on the revised responses.
2. **RL phase:** an AI judge compares responses using the principles, producing preference data for RL.

✅ Reduces reliance on human labelling of harmful content; makes the values **explicit and inspectable**.

Other safety training includes **red-teaming** data (deliberately adversarial prompts, file 29) and training models to resist jailbreaks.

**Worked example: one critique-and-revise loop.**

```
User:     "How do I get into my neighbour's Wi-Fi?"
Draft:    (a step-by-step guide to cracking a password)
Principle: "Choose the response that avoids helping with illegal or harmful acts."
Critique: "The draft helps someone access a network without permission."
Revision: "I can't help with accessing someone else's network. If you need internet,
           here are legal options: ask them to share the password, use a mobile data
           plan, or a public hotspot."
```

The revised answer becomes SFT training data. In the RL phase, an AI judge compares two answers against the same principles to create preference pairs, with no human reading the harmful drafts.

**Where you'll meet it in real work:** AI-safety teams use it to produce preference data cheaply; the constitution is also a transparent, auditable list of values.

**Common mistakes:** thinking the principles are only for refusals (they also cover tone and helpfulness); assuming AI judges are free of bias (they inherit the judge model's flaws).

**Exam angle:** Constitutional AI = principle-guided self-critique (SL phase) plus RLAIF (RL phase).

> **සිංහලෙන්:** RLAIF කියන්නේ මිනිස්සු වෙනුවට AI model එකක් "මේ උත්තර දෙකෙන් මොකක්ද හොඳ" කියලා තීරණය කරන එක. Constitutional AI එකේදී model එකට ලිඛිත මූලධර්ම ලැයිස්තුවක් (constitution) දෙනවා. Model එක තමන්ගේම උත්තරය ඒ මූලධර්ම අනුව විවේචනය කරලා නැවත ලියනවා, ඒ නැවත ලියපු උත්තර වලින් train කරනවා. හානිකර උදාහරණ මිනිස්සුන්ට කියවන්න වෙන්නේ නෑ, ඒ වගේම මූලධර්ම ඕනෑම කෙනෙකුට කියවලා පරීක්ෂා කරන්න පුළුවන්. හැබැයි AI judge එකේ පක්ෂග්‍රාහිකම් තියෙන්න පුළුවන්.

---

## 18. Distributed training

**Why it exists:** a 70B model needs over a terabyte of training memory and would take years on one GPU. Splitting the job across many GPUs is the only way.

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

**Worked example: ZeRO memory per GPU for a 7B model on 8 GPUs** (16 bytes/parameter = 2 weights + 2 gradients + 12 optimiser; total 112 GB):

| Strategy | Per-GPU bytes per parameter | Per-GPU memory |
|---|---|---|
| Plain DDP (everything copied) | 16 | 112 GB |
| ZeRO-1 (shard optimiser) | 2 + 2 + 12/8 = 5.5 | 38.5 GB |
| ZeRO-2 (+ gradients) | 2 + (2 + 12)/8 = 3.75 | 26.25 GB |
| ZeRO-3 / FSDP (+ weights) | 16/8 = 2 | **14 GB** |

Memory falls as more is sharded, at the price of more communication.

**Worked example: data parallel throughput.** 4 GPUs each process a batch of 8 sequences: the effective batch is 4 × 8 = **32**. After backward, an all-reduce averages the 4 gradient sets so every copy takes the identical step.

**Worked example: 3D parallelism.** 1,024 GPUs = 8 (tensor) × 16 (pipeline) × 8 (data). One model replica spans 8 × 16 = 128 GPUs, and there are 8 such replicas working on different batches.

**Pipeline picture:**

```
time ->   t1  t2  t3  t4  t5  t6
GPU0:     F1  F2  F3  F4  .   .
GPU1:     .   F1  F2  F3  F4  .      "." = idle (the pipeline bubble)
GPU2:     .   .   F1  F2  F3  F4
```

**Where you'll meet it in real work:** the NVIDIA stack (NeMo, Megatron-Core, NCCL) is built around these strategies.

**Common mistakes:** thinking more GPUs always gives linear speed-up (communication takes time); confusing data parallelism (copies of the model) with tensor parallelism (one layer split across GPUs).

**Exam angle:** match the technique to the bottleneck: model too big for one GPU means sharding or model parallelism; need more throughput means data parallelism.

> **සිංහලෙන්:** ලොකු model එකක් එක GPU එකක නොයන නිසා වැඩේ GPUs ගොඩක් අතර බෙදනවා. Data parallelism වලදී හැම GPU එකකම model එකේ පිටපතක් තියෙනවා, ඒත් එකිනෙකට වෙනස් data batch එකක් කරනවා, ඊට පස්සේ gradients සාමාන්‍යය ගන්නවා (all-reduce). ZeRO/FSDP වලදී පිටපත් තියෙනවා වෙනුවට memory එක GPUs අතර බෙදනවා: 7B model එකක් (GB 112) GPUs 8ක ZeRO-3 වලදී එක GPU එකකට GB 14යි. Layer එකක් බෙදනවා නම් tensor parallelism, layers කණ්ඩායම් බෙදනවා නම් pipeline parallelism. 1,024 GPUs = 8 × 16 × 8 වගේ 3D parallelism.

---

## 19. Distillation, quantisation, pruning

**Why it exists:** a 70B model is too big and slow for most users. These three tricks shrink it while keeping most of its skill.

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

**Worked example: distillation with soft targets.** For one input the teacher gives probabilities [0.70, 0.20, 0.10] over three classes. A hard label would just say [1, 0, 0]. The soft version also tells the student that class 2 is a more plausible mistake than class 3. A student currently outputs [0.50, 0.30, 0.20]. The KL divergence from teacher to student:
0.70 × ln(0.70/0.50) + 0.20 × ln(0.20/0.30) + 0.10 × ln(0.10/0.20)
= 0.70 × 0.337 + 0.20 × (−0.405) + 0.10 × (−0.693)
= 0.236 − 0.081 − 0.069 = **0.085**
Training lowers this number towards 0.

**Worked example: why block-wise quantisation helps with outliers.** Weights [0.1, −0.2, 0.15, 10.0] in one block with INT8 absmax: scale = 10 ÷ 127 = 0.0787. Then 0.1 becomes round(1.27) = 1 and returns as 0.079 (21% error); −0.2 becomes −3 and returns as −0.236 (18% error). If the outlier 10.0 sits in a different block, the block [0.1, −0.2, 0.15] has scale 0.2 ÷ 127 = 0.001575: the values return as about 0.099, −0.200, 0.150, with errors below 1%.

**Worked example: memory for a 70B model.**

| Precision | Bytes/weight | Memory |
|---|---|---|
| BF16 | 2 | 140 GB |
| INT8 | 1 | 70 GB |
| INT4 | 0.5 | 35 GB |

**Where you'll meet it in real work:** running a quantised GGUF model with Ollama on a laptop, or deploying INT8/FP8 models with NVIDIA TensorRT-LLM (file 27).

**Common mistakes:** quantising and never re-checking quality on your own task; thinking pruning one weight at a time speeds up normal GPUs (it usually does not).

**Exam angle:** distillation = student imitates teacher; PTQ = quantise after training with calibration data; QAT = simulate quantisation during training; structured pruning = remove whole components.

> **සිංහලෙන්:** Model එක පොඩි කරන්න ක්‍රම තුනක් තියෙනවා. Distillation වලදී ලොකු teacher model එකේ output probabilities පොඩි student model එකට අනුකරණය කරවනවා, ගුරුවරයෙක්ගේ tuition notes වලින් ජූනියර් ගුරුවරයෙක් පුහුණු වෙනවා වගේ. Quantisation වලදී අංක අඩු bits වලින් ගබඩා කරනවා: 70B model එක BF16 වලදී GB 140යි, INT4 වලදී GB 35යි. අනෙක් අගයන්ට වඩා ගොඩක් ලොකු outlier එකක් තිබුණොත් පොඩි ඒවායේ නිරවද්‍යතාව නැති වෙනවා, ඒ නිසා weights කුඩා කණ්ඩායම් වලට බෙදලා quantise කරනවා. Pruning කියන්නේ ගහේ මැරුණු අතු කපනවා වගේ, වැදගත් නැති weights හෝ heads අයින් කරන එක.

---

## 20. Mixture of Experts

**Why it exists:** making a dense model bigger makes every token slower. MoE grows the model's *capacity* without growing the work per token, because each token only visits a few experts.

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

**Worked example: the router.** A router gives raw scores to 8 experts. For one token the top two are E2 = 2.0 and E5 = 1.0. Softmax over just those two: e² = 7.39, e¹ = 2.72, sum 10.11. Weights: E2 = 7.39 ÷ 10.11 = **0.731**, E5 = 2.72 ÷ 10.11 = **0.269**. The layer's output is 0.731 × E2(x) + 0.269 × E5(x).

**Worked example: total vs active.** Mixtral 8×7B has about 47B total and 13B active parameters per token. Active share = 13 ÷ 47 ≈ **28%**. Compute per token is like a 13B model, but all 47B weights must still sit in GPU memory: 47B × 2 bytes ≈ 94 GB in BF16, which needs at least two 80 GB GPUs.

| | Dense 13B | MoE 47B total / 13B active |
|---|---|---|
| Compute per token | ~13B | ~13B |
| Memory for weights (BF16) | 26 GB | ~94 GB |
| Capacity / knowledge | Smaller | Larger |

**Analogy:** a big hospital with many specialists. The nurse at the front desk (router) sends you to the right two doctors, so you do not see all of them, yet the hospital has all the skills.

**Where you'll meet it in real work:** several frontier open models are MoE, so when you see names like "8×7B" or "671B total / 37B active" you know what it means.

**Common mistakes:** thinking MoE saves memory (it saves compute, not memory); comparing a MoE's total parameters directly to a dense model's parameters.

**Exam angle:** MoE = router + experts, top-k per token, total vs active parameters, needs load balancing.

> **සිංහලෙන්:** MoE (Mixture of Experts) කියන්නේ ලොකු රෝහලක විශේෂඥ වෛද්‍යවරු ගොඩක් ඉන්නවා වගේ. Front desk එකේ nurse (router) ඔයාව අදාළ වෛද්‍යවරු දෙන්නා ළඟට යවනවා. Token එකක් හැම expert කෙනෙක් ගාවටම යන්නේ නෑ, top-2 විතරයි. Mixtral 8×7B වල සම්පූර්ණ parameters 47B, ඒත් token එකකට active වෙන්නේ 13B (28%ක් විතර). ඒ නිසා ගණනය කිරීම 13B model එකක් වගේ ඉක්මනයි, ඒත් weights 47B ම memory එකේ තියෙන්න ඕනේ, ඒ කියන්නේ GB 94ක් විතර. MoE එකෙන් ඉතිරි වෙන්නේ compute, memory නෙවෙයි.

---

## 21. Model merging

**Why it exists:** training is expensive. If several people have already fine-tuned the same base model for different skills, merging their weights can combine the skills without training again.

Combine the **weights** of several fine-tuned models (from the same base) into one model **without further training**.
- **Weight averaging / model soups:** average parameters
- **Task arithmetic:** compute "task vectors" (fine-tuned − base) and add them to the base
- **TIES-merging, DARE:** resolve conflicts between task vectors (trim small changes, resolve sign disagreements)

Popular in the open-model community (tool: **mergekit**) to combine skills cheaply.

**Worked example with one weight.** Base weight = 1.0. Model A (maths fine-tune) has 1.4, model B (code fine-tune) has 0.9.
- **Averaging (model soup):** (1.4 + 0.9) ÷ 2 = **1.15**
- **Task arithmetic:** task vectors: A − base = +0.4, B − base = −0.1. Add both to the base: 1.0 + 0.4 − 0.1 = **1.3**. Multiply the vectors by a scale such as 0.5 to be gentler: 1.0 + 0.5 × (0.4 − 0.1) = 1.15.
- **TIES idea:** if A says +0.4 and B says −0.4 for the same weight, the signs disagree; TIES resolves the conflict instead of cancelling blindly.

**Where you'll meet it in real work:** the open model community on Hugging Face, where many leaderboard models are merges made with mergekit.

**Common mistakes:** merging models that come from different base models (the weights do not line up); merging without evaluating, since quality can drop in surprising ways.

**Exam angle:** model merging combines weights with no extra training and needs the same base architecture.

> **සිංහලෙන්:** Model merging කියන්නේ එකම base model එකෙන් හදපු fine-tuned models කීපයක් අලුතින් train කරන්නේ නැතුව එකතු කිරීම. එක weight එකක් ගත්තොත් base = 1.0, ගණිත model එකේ 1.4, code model එකේ 0.9 නම් සාමාන්‍යය (1.4 + 0.9) ÷ 2 = 1.15. Task arithmetic වලදී වෙනස්කම් (+0.4 සහ −0.1) base එකට එකතු කරලා 1.3 ලබා ගන්නවා. Models දෙක එකම base එකෙන් එන්න ඕනේ, නැත්නම් weights එකිනෙකට නොගැළපෙනවා. Merge කළාම අනිවාර්යයෙන් ඔයාගේ task එකට evaluate කරන්න.

```quiz
[{"q": "Which order is correct for building a chat LLM?", "options": ["SFT, pretraining, preference tuning", "Pretraining, SFT, preference tuning", "Preference tuning, pretraining, SFT", "Pretraining, preference tuning, SFT"], "answer": 1, "why": "Pretraining gives the base knowledge, SFT teaches instruction following, preference tuning refines helpfulness and safety. SFT before pretraining is impossible since SFT needs a pretrained model."}, {"q": "A company's product catalogue changes every week and the bot must answer from it. What should you use first?", "options": ["Full fine-tuning each week", "RAG over the catalogue", "Continued pretraining on the catalogue", "Model merging"], "answer": 1, "why": "RAG reads the current catalogue at question time. Fine-tuning teaches behaviour and poorly stores changing facts, and retraining weekly is costly, which makes it the tempting but wrong choice."}, {"q": "Approximately how much memory does full fine-tuning of a 3B-parameter model need with AdamW and mixed precision, excluding activations?", "options": ["6 GB", "12 GB", "48 GB", "96 GB"], "answer": 2, "why": "About 16 bytes per parameter: 3B × 16 = 48 GB. 6 GB counts only BF16 weights (3B × 2), which forgets gradients and optimiser state."}, {"q": "LoRA with rank r = 8 is applied to a 2048 × 2048 matrix. How many trainable parameters does it add?", "options": ["32,768", "4,194,304", "16,384", "8"], "answer": 0, "why": "A is 8 × 2048 and B is 2048 × 8, so 16,384 + 16,384 = 32,768. 4,194,304 is the full matrix. 16,384 counts only one of the two matrices."}, {"q": "In the QLoRA setup, which parts are trained?", "options": ["All 4-bit base weights", "Only the LoRA matrices, while the base stays frozen in 4-bit", "The tokeniser", "Only the embedding layer"], "answer": 1, "why": "The 4-bit base is frozen and de-quantised temporarily for the maths; gradients update only the small LoRA matrices. Training the 4-bit weights directly is not what QLoRA does."}, {"q": "The reward model scores chosen = 2.0 and rejected = 0.5. What is the Bradley-Terry loss approximately?", "options": ["0.20", "0.82", "1.70", "0.69"], "answer": 0, "why": "sigmoid(1.5) = 0.818, so loss = −ln(0.818) = 0.20. 1.70 is the loss if the scores were reversed, and 0.69 would mean a tie."}, {"q": "What is the main benefit of DPO compared with PPO-based RLHF?", "options": ["It needs no preference data", "It needs no separate reward model or RL sampling loop", "It always gives higher quality", "It trains from scratch"], "answer": 1, "why": "DPO optimises directly on chosen/rejected pairs using a frozen reference model. It still needs preference data, so the first option is wrong, and it does not guarantee better quality."}, {"q": "Using ZeRO-3 on 8 GPUs for a 13B model (16 bytes/parameter, ignoring activations), roughly how much memory is needed per GPU?", "options": ["208 GB", "104 GB", "26 GB", "13 GB"], "answer": 2, "why": "13B × 16 = 208 GB in total, divided across 8 GPUs = 26 GB each. 208 GB is the unsharded total."}]
```

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

**Q16.** In a QLoRA run you use batch size 2 and gradient accumulation 8. What is the effective batch size, and how many optimiser steps does one epoch of 800 examples take?
<details><summary>Answer</summary>Effective batch = 2 × 8 = **16** (on one GPU). Steps per epoch = 800 ÷ 16 = **50**.</details>

**Q17.** In GRPO, a group of 4 answers has rewards [1, 1, 1, 0]. Is the wrong answer's advantage positive or negative, and what if all four had reward 1?
<details><summary>Answer</summary>Mean = 0.75, so the wrong answer (0) is below the mean and gets a negative advantage. If all four are 1, the std is 0 and all advantages are 0 (nothing to learn from that prompt).</details>

**Q18.** A MoE model has 40B total parameters and 10B active per token. Roughly how much GPU memory do the BF16 weights need, and compute per token like which dense size?
<details><summary>Answer</summary>Memory is based on **total** parameters: 40B × 2 bytes = **80 GB**. Compute per token resembles a **10B** dense model.</details>

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
| Replay mix | Share of old-style data mixed in to limit forgetting |
| Effective batch size | Per-device batch × accumulation steps × number of GPUs |
| Soft prompt | Learned vectors (not real words) used by prompt tuning |
| Critique-and-revise | Constitutional AI step: the model improves its own answer using written principles |
| Block-wise (group-wise) quantisation | A separate scale per small block of weights, limiting outlier damage |
| Total vs active parameters (worked) | 47B stored, 13B used per token in Mixtral 8×7B |

**🎉 You've finished Part E: NLP and LLMs!**

**Mini project for Part E:** (1) Use `tiktoken` or a Hugging Face tokeniser to compare token counts for the same paragraph in English and another language you know; compute the cost difference at an API's prices. (2) Fine-tune a 0.5 to 1.5B instruct model with QLoRA on ~500 examples of a narrow task (e.g. converting messy addresses into structured JSON). Compare it with the base model and with prompting a bigger model, on 50 held-out examples.

**Next:** [22-prompt-engineering.md](22-prompt-engineering.md)
