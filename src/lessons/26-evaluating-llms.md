# 26: Evaluating LLMs and GenAI Applications

> **Before you start:** [07](07-math-probability-statistics.md) (confidence intervals, hypothesis tests, A/B tests, cross-entropy, perplexity, bootstrap), [13](13-evaluation-metrics-and-tuning.md) (precision/recall/F1, calibration, ECE), [18](18-nlp-fundamentals.md) (n-grams, BLEU/ROUGE preview, NLI), [20](20-how-llms-work.md) (logprobs, non-determinism, hallucination), [21](21-training-finetuning-alignment.md) (decontamination, Bradley-Terry), [22](22-prompt-engineering.md#19-prompts-are-code) (golden sets, regression tests), [23](23-embeddings-vector-databases-rag.md#18-evaluating-rag) (RAG metrics), [24](24-ai-agents.md#14-evaluating-agents) (agent evaluation).
>
> **After this file you can:** choose and compute the right evaluation for a language model or LLM application (perplexity, exact match, F1, BLEU, ROUGE, BERTScore, pass@k); understand standard benchmarks and their pitfalls; use LLM-as-a-judge correctly; run human evaluations and measure agreement; apply statistics so your conclusions are trustworthy; and build an evaluation pipeline for your own app.

> **"You can't improve what you can't measure."** Evaluation is what separates a demo from a product.

---

## Table of contents

1. [Why evaluating LLMs is hard](#1-why-evaluating-llms-is-hard)
2. [Kinds of evaluation](#2-kinds-of-evaluation)
3. [Perplexity](#3-perplexity)
4. [Exact match and token F1](#4-exact-match-and-token-f1)
5. [BLEU, ROUGE and friends (overlap metrics)](#5-overlap-metrics)
6. [Semantic metrics: BERTScore and embedding similarity](#6-semantic-metrics)
7. [Code evaluation: pass@k](#7-code-evaluation)
8. [Standard benchmarks](#8-standard-benchmarks)
9. [How benchmark harnesses score models](#9-how-harnesses-score)
10. [Contamination, saturation and Goodhart's law](#10-contamination-and-goodhart)
11. [LLM-as-a-judge](#11-llm-as-a-judge)
12. [Pairwise comparison, Elo and Chatbot Arena](#12-pairwise-and-elo)
13. [Human evaluation and inter-annotator agreement](#13-human-evaluation)
14. [Faithfulness and hallucination evaluation](#14-faithfulness-evaluation)
15. [Safety, bias and robustness evaluation](#15-safety-evaluation)
16. [Statistics for evals: is the difference real?](#16-statistics-for-evals)
17. [Building an eval pipeline for your application](#17-eval-pipeline)
18. [Online evaluation in production](#18-online-evaluation)
19. [Check yourself](#19-check-yourself)
20. [New words in this file](#20-new-words-in-this-file)

---

## 1. Why evaluating LLMs is hard

With a classifier ([file 13](13-evaluation-metrics-and-tuning.md)), there's one right label and accuracy is easy. With LLMs:
- **Many correct answers:** "Paris is the capital of France" and "France's capital city is Paris" are both right
- **Open-ended quality:** helpfulness, tone, clarity, creativity are subjective
- **Multiple dimensions at once:** correctness, faithfulness, safety, format, length, latency, cost
- **Non-determinism:** different runs give different outputs ([file 20](20-how-llms-work.md#11-other-generation-controls))
- **Prompt sensitivity:** small wording changes shift scores
- **Benchmarks leak** into training data (section 10)

So we combine several methods, each with strengths and weaknesses.

---

## 2. Kinds of evaluation

| Dimension | Options |
|---|---|
| **When** | **Offline** (before release, on test sets) vs **online** (in production, real users) |
| **Who/what judges** | **Automatic metrics** (code) vs **model-based** (LLM-as-a-judge) vs **human** |
| **Reference** | **Reference-based** (compare to a known good answer) vs **reference-free** (judge the output on its own, e.g. "is it faithful to the source?") |
| **Scope** | **Model evaluation** (general capability: benchmarks) vs **application/system evaluation** (your RAG bot on your users' questions) |
| **Format** | **Pointwise** (score each output alone) vs **pairwise** (which of two is better?) |

**Key insight for practitioners:** public benchmarks tell you which models are **generally** strong. Only **your own evaluation set** tells you whether a model + prompt works **for your task**.

---

## 3. Perplexity

**Perplexity (PPL)** measures how well a language model predicts a text ([file 07](07-math-probability-statistics.md#23-cross-entropy), [file 18](18-nlp-fundamentals.md#15-language-models)):

```
PPL = exp( average cross-entropy per token ) = exp( −(1/N) Σ log P(tokenᵢ | previous tokens) )
```

**Worked example:** a model predicts a 4-token text with probabilities for the actual tokens: 0.5, 0.25, 0.5, 0.125.
- log-probs (natural): −0.693, −1.386, −0.693, −2.079 → sum = −4.852
- average cross-entropy = 4.852 / 4 = 1.213
- PPL = e^1.213 ≈ **3.36**

**Interpretation:** "on average, the model was as uncertain as if choosing uniformly among ~3.4 tokens". Lower = better. A uniform guess over a 50,000-token vocabulary has PPL 50,000.

**Uses:** tracking pretraining progress; comparing models **with the same tokeniser** on the same text; detecting unusual text.

**Cautions:**
- **Not comparable across different tokenisers** (different token counts per text). Use **bits per byte (BPB)** or bits per character for fair comparisons.
- Low perplexity ≠ helpful or truthful answers. Chat models after alignment may have *higher* perplexity on raw web text but are far more useful.
- For long texts, compute with a **sliding window** if the text exceeds the context length.

```python
import torch, math
from transformers import AutoTokenizer, AutoModelForCausalLM
tok = AutoTokenizer.from_pretrained("gpt2"); model = AutoModelForCausalLM.from_pretrained("gpt2")
ids = tok("The cat sat on the mat.", return_tensors="pt").input_ids
with torch.no_grad():
    loss = model(ids, labels=ids).loss          # average cross-entropy (labels shifted internally)
print(math.exp(loss.item()))                    # perplexity
```

---

## 4. Exact match and token F1

For tasks with short reference answers (question answering, extraction).

### Exact Match (EM)

1 if the prediction equals the reference **after normalisation** (lowercase, remove punctuation and articles like "a/an/the", trim spaces), else 0.

- Reference "Sri Jayawardenepura Kotte", prediction "sri jayawardenepura kotte." → **EM = 1**
- Prediction "Kotte" → **EM = 0** (too strict for partial answers)

### Token F1

Treat prediction and reference as **bags of tokens**; compute precision and recall of overlapping tokens ([file 13](13-evaluation-metrics-and-tuning.md#4-f1-score-and-f-beta)).

**Example:** reference "the eiffel tower in paris", prediction "eiffel tower"
After normalisation (drop "the"): reference tokens {eiffel, tower, in, paris} (4), prediction {eiffel, tower} (2), overlap = 2
- Precision = 2/2 = 1.0; Recall = 2/4 = 0.5; **F1 = 2 × 1.0 × 0.5 / 1.5 = 0.667**

### For classification-style LLM outputs

If the LLM outputs labels (sentiment, category, yes/no), use **accuracy, precision, recall, F1, confusion matrices** ([file 13](13-evaluation-metrics-and-tuning.md)), and structured outputs to make parsing reliable ([file 22](22-prompt-engineering.md#9-structured-output-json)).

---

## 5. Overlap metrics

### BLEU (machine translation)

**BLEU** measures **n-gram precision** ([n-grams, file 18](18-nlp-fundamentals.md#7-n-grams)): what fraction of the prediction's 1-, 2-, 3- and 4-grams appear in the reference(s), combined with a geometric mean, times a **brevity penalty** (BP) so very short outputs aren't rewarded.

```
BLEU = BP × exp( (1/4) × Σₙ log pₙ )        n = 1..4
BP = 1 if prediction is longer than the reference, else e^(1 − ref_len/pred_len)
```

**Worked mini-example (unigrams and bigrams only):**
Reference: "the cat is on the mat" · Prediction: "the cat on the mat"
- Unigram precision: prediction words: the, cat, on, the, mat (5), all appear in the reference (with clipping: "the" appears twice in both) → p₁ = 5/5 = 1.0
- Bigram precision: "the cat" ✓, "cat on" ✗, "on the" ✓, "the mat" ✓ → p₂ = 3/4 = 0.75
- Geometric mean = √(1.0 × 0.75) = 0.866
- BP: pred length 5 < ref 6 → e^(1 − 6/5) = e^(−0.2) = 0.819
- BLEU (1-2 gram) ≈ 0.819 × 0.866 ≈ **0.71**

Use **SacreBLEU** for standardised, comparable scores.

### ROUGE (summarisation)

**ROUGE** is **recall-oriented**: how much of the reference's content appears in the prediction.
- **ROUGE-1 / ROUGE-2:** unigram / bigram overlap
- **ROUGE-L:** longest common subsequence (in-order matching, gaps allowed)

**Example (ROUGE-1 recall):** reference "the cat is on the mat" (6 words), prediction "the cat on the mat" → overlapping unigrams = 5 → recall = **5/6 = 0.83**.

### Others

- **chrF:** character n-gram F-score: better for languages with rich word forms (and for Sinhala/Tamil)
- **METEOR:** matches stems and synonyms, not just exact words

### The big limitation

Overlap metrics **reward wording, not meaning**. "The movie was fantastic" vs reference "The film was excellent" scores low despite meaning the same thing. And a fluent but factually wrong output can score high. They're fine for tracking progress on translation/summarisation with good references, but weak for judging open-ended LLM answers.

```python
import evaluate
bleu = evaluate.load("sacrebleu"); rouge = evaluate.load("rouge")
bleu.compute(predictions=["the cat on the mat"], references=[["the cat is on the mat"]])
rouge.compute(predictions=["the cat on the mat"], references=["the cat is on the mat"])
```

---

## 6. Semantic metrics

- **BERTScore:** embed each token of prediction and reference with a contextual model (BERT-like, [file 19](19-transformers.md#15-bert)); match each token to its most similar token on the other side (cosine similarity); compute precision/recall/F1 from those similarities. Captures paraphrases ("film" ≈ "movie").
- **Embedding similarity:** cosine similarity between sentence embeddings ([file 23](23-embeddings-vector-databases-rag.md#3-embeddings-revisited)) of prediction and reference.
- **NLI-based:** use a Natural Language Inference model ([file 18](18-nlp-fundamentals.md#14-core-nlp-tasks)) to check whether the prediction **entails** the reference (and vice versa).

Better at meaning than BLEU/ROUGE, but still can't fully judge correctness or helpfulness. That's why LLM-as-a-judge (section 11) became popular.

---

## 7. Code evaluation

For code generation, run the generated code against **unit tests**: **functional correctness**.

**pass@k:** the probability that **at least one of k** generated samples passes all tests (connected to pass@k vs pass^k in [file 24](24-ai-agents.md#13-reliability)).

**Unbiased estimator:** generate n samples per problem (n ≥ k), count c that pass:

```
pass@k = 1 − C(n − c, k) / C(n, k)
```

(C(a, b) = "a choose b", the number of ways to pick b items from a, [file 07](07-math-probability-statistics.md#11-probability-distributions).) The fraction is the probability that a random choice of k samples contains **no** passing sample.

**Worked example:** n = 10 samples, c = 3 pass, k = 1:
pass@1 = 1 − C(7, 1)/C(10, 1) = 1 − 7/10 = **0.3** (= c/n, as expected)
For k = 5: C(7, 5) = 21, C(10, 5) = 252 → pass@5 = 1 − 21/252 = 1 − 0.083 = **0.917**

Benchmarks: **HumanEval**, **MBPP** (function-level), **SWE-bench** (fixing real GitHub issues in real repositories), **LiveCodeBench** (new problems over time to avoid contamination).

⚠️ Run generated code in a **sandbox** ([file 24](24-ai-agents.md#15-safety-and-security)): it's untrusted.

---

## 8. Standard benchmarks

| Benchmark | Tests | Format |
|---|---|---|
| **MMLU** / MMLU-Pro | Knowledge across 57 subjects (law, medicine, maths...) | Multiple choice |
| **GPQA** | Very hard graduate-level science ("Google-proof") | Multiple choice |
| **HellaSwag** | Commonsense: choose the most plausible continuation | Multiple choice |
| **ARC** | Grade-school science reasoning | Multiple choice |
| **GSM8K** | Grade-school maths word problems | Free-form numeric answer |
| **MATH**, AIME | Competition maths | Free-form |
| **HumanEval, MBPP, SWE-bench** | Coding | Unit tests |
| **TruthfulQA** | Avoiding common misconceptions/falsehoods | MC or generation |
| **IFEval** | Following verifiable instructions ("answer in exactly 3 bullet points", "no commas") | Automatic rule checks |
| **BIG-bench (Hard)** | Diverse challenging tasks | Mixed |
| **MT-Bench** | Multi-turn chat quality | LLM-judged |
| **Chatbot Arena (LMArena)** | Human preference between anonymous models | Pairwise votes (section 12) |
| **Needle-in-a-haystack**, RULER | Long-context retrieval/reasoning | Synthetic tests |
| **Agent benchmarks** (τ-bench, WebArena, GAIA) | Tool use and multi-step tasks | Task success ([file 24](24-ai-agents.md#14-evaluating-agents)) |
| **Humanity's Last Exam** and other frontier sets | Extremely hard expert questions | Mixed |

**Multilingual:** benchmarks exist for many languages (e.g. translated MMLU variants, FLORES for translation), but coverage for low-resource languages like Sinhala is limited. Often you'll need to build your own evaluation set.

---

## 9. How harnesses score

Tools like **lm-evaluation-harness** (EleutherAI), **HELM** (Stanford), Hugging Face **lighteval** and NVIDIA **NeMo Evaluator** run benchmarks consistently.

### Multiple-choice by log-likelihood

Instead of generating text and parsing it, compute the model's **log-probability** of each answer option given the question ([logprobs, file 20](20-how-llms-work.md#7-next-token-prediction)) and pick the highest.

- **acc:** use the total log-probability of each option
- **acc_norm:** normalise by option length (in characters or tokens), because longer options get lower total probability just by having more tokens

### Generative scoring

Generate an answer (greedy), then extract it (e.g. the final number for GSM8K) and compare with exact match.

### Settings that change scores

- **Number of shots** (0-shot vs 5-shot, [file 22](22-prompt-engineering.md#6-zero-shot-and-few-shot)), **prompt template**, **chain-of-thought or not**, **chat template** use, decoding settings, answer extraction rules.

⚠️ **Scores from different harnesses or settings are not comparable.** "Model A: 72% MMLU" (5-shot, harness X) vs "Model B: 75%" (0-shot CoT, harness Y) tells you little. Compare models under identical conditions.

---

## 10. Contamination and Goodhart

### Benchmark contamination

If test questions (or close paraphrases) appear in the training data, the model may have **memorised** answers, inflating scores ([decontamination, file 21](21-training-finetuning-alignment.md#2-pretraining-data)).

**Detection:** n-gram overlap checks between test sets and training data; testing on **rephrased** or **newly created** questions (a big drop suggests memorisation); asking the model to complete test questions verbatim; **canary strings** (unique random strings embedded in benchmark files so their presence in training data can be detected).

**Mitigation:** private held-out test sets; **dynamic/live benchmarks** with fresh questions; evaluate on your own data.

### Saturation

When top models all score ~90%+, a benchmark stops distinguishing them. The field keeps creating harder benchmarks (MMLU → MMLU-Pro → GPQA → ...).

### Goodhart's law

> **"When a measure becomes a target, it ceases to be a good measure."**

Optimising heavily for a benchmark can produce models that are good at the benchmark but not at the underlying skill (e.g. memorising formats, exploiting quirks). The same applies to your own metrics: if you tune prompts against 50 test examples for weeks, you'll **overfit** to them ([file 11](11-ml-fundamentals.md#10-train-validation-test-splits)). Keep a held-out set you rarely look at.

---

## 11. LLM-as-a-judge

**Idea:** use a strong LLM to **grade** outputs according to a **rubric**, like a teacher marking essays. It scales human-like judgement to thousands of examples cheaply.

### Formats

| Format | Prompt asks | Use |
|---|---|---|
| **Pointwise (single-answer grading)** | "Score this answer 1 to 5 for correctness using the rubric" | Tracking quality over time |
| **Reference-guided** | "Compare the answer to this reference answer; is it correct?" | When ground truth exists (more reliable) |
| **Pairwise** | "Which answer is better, A or B (or tie)?" | Comparing two models/prompts (more reliable than absolute scores) |
| **Binary checks** | "Does the answer mention the refund deadline? yes/no" | Specific, objective criteria (most reliable) |

### Example judge prompt

```
You are evaluating a customer-support answer.

<question>{question}</question>
<reference_facts>{facts}</reference_facts>
<answer>{answer}</answer>

Evaluate these criteria. For each, think briefly, then give a verdict.
1. correctness: Does the answer agree with the reference facts? (pass/fail)
2. completeness: Does it address every part of the question? (pass/fail)
3. tone: Is it polite and professional? (pass/fail)

Return JSON: {"correctness": {"reasoning": "...", "verdict": "pass"}, ...}
```

**Tips:** specific, **binary or low-scale** criteria beat vague 1 to 10 scales; ask for reasoning **before** the verdict; use structured output; provide a reference answer when possible; one criterion per check when accuracy matters. **G-Eval** is a known recipe: rubric + chain-of-thought evaluation steps + probability-weighted scores.

### Known biases of LLM judges

| Bias | Description | Mitigation |
|---|---|---|
| **Position bias** | Prefers the first (or second) answer in pairwise comparisons | Evaluate both orders (A,B and B,A); count only consistent verdicts |
| **Verbosity / length bias** | Prefers longer answers | Rubric explicitly penalising padding; length-controlled comparisons |
| **Self-preference** | Prefers outputs from its own model family | Use a different model as judge, or a panel of judges |
| **Style over substance** | Fooled by confident, well-formatted wrong answers | Reference-guided grading; fact-checking criteria |
| **Leniency / score clustering** | Gives mostly 4/5s | Binary criteria; calibrated examples in the prompt |
| **Limited expertise** | Can't judge what it doesn't know (e.g. hard maths, niche law) | Reference answers; expert humans |

### Validate the judge!

Before trusting a judge: have **humans label 50 to 200 examples**, run the judge on the same examples, and measure **agreement** (accuracy, Cohen's kappa, section 13). Iterate on the judge prompt until agreement is acceptable. Re-check when you change the judge model.

**Panels:** averaging several different judge models reduces individual biases.

---

## 12. Pairwise and Elo

**Pairwise comparison:** show two outputs (from models A and B) for the same prompt; a human or judge picks the better one (or tie). Humans find this easier and more consistent than absolute scores.

**Win rate:** fraction of comparisons A wins (ties often counted as half). E.g. A wins 60, loses 30, ties 10 of 100 → win rate = (60 + 5)/100 = **65%**.

### Elo ratings

From chess: each model has a rating; after each "match", ratings update based on the result vs expectation.

```
Expected score of A vs B:  E_A = 1 / (1 + 10^((R_B − R_A)/400))
Update:                     R_A_new = R_A + K × (actual − E_A)        (actual: 1 win, 0.5 tie, 0 loss)
```

**Worked example:** R_A = 1200, R_B = 1300, K = 32. A **wins**.
E_A = 1 / (1 + 10^(100/400)) = 1 / (1 + 1.778) = **0.36**
R_A_new = 1200 + 32 × (1 − 0.36) = 1200 + 20.5 = **1220.5**; B drops by the same amount to 1279.5.
An underdog win moves ratings more than an expected win.

**Bradley-Terry model** ([same model as reward models, file 21](21-training-finetuning-alignment.md#14-rlhf)): fits all ratings jointly from all comparisons; more stable than sequential Elo updates. **Chatbot Arena** (LMArena) uses this with millions of crowd-sourced human votes on anonymous model pairs, producing a widely watched leaderboard.

**Caveats:** crowd preferences reward style, formatting and length; votes skew to certain question types and languages.

---

## 13. Human evaluation

The **gold standard** for subjective qualities, and the reference for validating automatic metrics.

### Designing it well

- **Clear guidelines** with definitions and examples of each score level (like labelling guidelines, [file 10](10-data-science-workflow.md#3-collect-data))
- **Blind** the raters (they shouldn't know which model produced which output) and **randomise** order
- Prefer **pairwise** or **binary** judgements over fine-grained 1 to 10 scales
- Use **domain experts** for specialised content (medical, legal); native speakers for language quality
- Multiple raters per item to measure **agreement**

### Inter-annotator agreement

If humans disagree a lot, the task is ambiguous, and no model can be "correct" beyond human agreement.

**Cohen's kappa (κ)** (two raters): agreement corrected for chance:

```
κ = (p_observed − p_chance) / (1 − p_chance)
```

**Worked example:** two raters label 100 answers as good/bad.

| | Rater 2: good | Rater 2: bad |
|---|---|---|
| **Rater 1: good** | 40 | 10 |
| **Rater 1: bad** | 20 | 30 |

- Observed agreement p_o = (40 + 30)/100 = **0.70**
- Rater 1 says good 50%, rater 2 says good 60%. Chance agreement p_e = 0.5×0.6 + 0.5×0.4 = 0.30 + 0.20 = **0.50**
- κ = (0.70 − 0.50)/(1 − 0.50) = **0.40**: "moderate" agreement

Rough guide: < 0.2 slight, 0.2 to 0.4 fair, 0.4 to 0.6 moderate, 0.6 to 0.8 substantial, > 0.8 almost perfect.

**Kappa paradox:** with very imbalanced labels (e.g. 95% "good"), kappa can be low even with high raw agreement. Report both.

**Krippendorff's alpha:** handles more than two raters, missing ratings and ordinal scales.

---

## 14. Faithfulness evaluation

**Faithfulness / groundedness:** is every claim in the output supported by the source (the document being summarised, or retrieved RAG context, [file 23](23-embeddings-vector-databases-rag.md#18-evaluating-rag))?

| Method | How |
|---|---|
| **Claim decomposition + verification** | Split the output into atomic claims; check each against the source (with an NLI model or LLM judge); faithfulness = supported claims / total claims |
| **NLI-based** | Does the source **entail** each sentence of the output? ([file 18](18-nlp-fundamentals.md#14-core-nlp-tasks)) |
| **QA-based** | Generate questions from the output; answer them from the source; compare |
| **SelfCheckGPT** | Sample several outputs for the same prompt; facts the model really knows are **consistent** across samples; hallucinated details vary. Low consistency → likely hallucination. Needs no external source. |
| **FActScore** | For long-form text (like biographies): fraction of atomic facts supported by a knowledge source (e.g. Wikipedia) |

**Worked example:** an answer has 5 atomic claims; 4 are supported by the retrieved context → **faithfulness = 0.8**.

**Calibration** ([file 13](13-evaluation-metrics-and-tuning.md#9-log-loss-and-calibration)): when the model says it's 80% confident (or its token logprobs indicate so), is it right 80% of the time? Measured with **ECE**. Alignment tuning (RLHF) often makes models **less** calibrated (overconfident) than base models.

---

## 15. Safety evaluation

Before deploying, test what the model/app **shouldn't** do:

| Area | How to test |
|---|---|
| **Harmful content** | Red-team prompt sets (requests for weapons, self-harm, hate); measure refusal rate on harmful prompts **and** over-refusal rate on harmless-but-sensitive prompts (e.g. XSTest) |
| **Jailbreak robustness** | Attack success rate (ASR) of known jailbreak techniques; automated scanners like **garak** (file 29) |
| **Prompt injection** | Indirect injection test cases in documents/tools ([file 22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks)) |
| **Bias and fairness** | Benchmarks (BBQ, CrowS-Pairs, WinoBias); counterfactual tests (swap names/genders/ethnicities and compare outputs) (file 29) |
| **Toxicity** | Toxicity classifiers on outputs (e.g. RealToxicityPrompts setup) |
| **Privacy** | Does it leak PII or training data? |
| **Robustness** | Typos, paraphrases, different languages, code-mixing; does performance hold? |

---

## 16. Statistics for evals

"Prompt B scored 82% vs prompt A's 79% on 100 examples." Is B really better? Probably **can't tell** yet.

### Confidence intervals

For accuracy p on n examples, the standard error ≈ √(p(1 − p)/n) ([file 07](07-math-probability-statistics.md#17-confidence-intervals)).
p = 0.80, n = 100: SE = √(0.16/100) = 0.04 → 95% CI ≈ 0.80 ± 1.96 × 0.04 = **[0.72, 0.88]**

With n = 1,000: SE = 0.0126 → CI ≈ **[0.775, 0.825]**.

**Rule of thumb:** with 100 examples, differences smaller than ~8 to 10 points are often noise.

### Paired comparisons (more powerful)

Both systems answer the **same** questions, so compare them **question by question**. Look at the questions where they **disagree**:

| | B correct | B wrong |
|---|---|---|
| **A correct** | 70 | 9 |
| **A wrong** | 12 | 9 |

Only the 21 discordant questions matter: B wins 12, A wins 9. A **McNemar test** (or a sign test) checks whether 12 vs 9 is more than chance: here p ≈ 0.66, so **not significant**.

### Bootstrap

Resample your test set **with replacement** ([bootstrap, file 07](07-math-probability-statistics.md#16-sampling-lln-clt)) 1,000+ times, recompute the metric (or the difference between systems) each time, and take the 2.5th and 97.5th percentiles as a 95% CI. Works for any metric (F1, BLEU, judge scores).

```python
import numpy as np
diff = np.array(scores_B) - np.array(scores_A)          # per-question differences (paired)
boot = [np.mean(np.random.choice(diff, len(diff), replace=True)) for _ in range(5000)]
print(np.percentile(boot, [2.5, 97.5]))                  # if the interval includes 0 → not clearly better
```

### Other pitfalls

- **Multiple comparisons:** testing 20 prompt variants and picking the best one will find a "winner" by luck ([Bonferroni, file 07](07-math-probability-statistics.md#18-hypothesis-testing-and-p-values)). Confirm on a fresh held-out set.
- **Non-determinism:** run stochastic evaluations several times and average; report variance.
- **Sample size planning:** decide how many examples you need to detect the difference you care about (power analysis).
- **Slices:** an overall improvement can hide a regression in an important subgroup (e.g. Sinhala queries, or premium customers). Report metrics per **slice**.

### Reproducibility

Record: model name **and version/date**, prompt version, decoding settings (temperature, top-p, max tokens), seeds, judge model and prompt, dataset version, code commit. Hosted models change over time; pin versions where possible ([file 20](20-how-llms-work.md#11-other-generation-controls)).

---

## 17. Eval pipeline

**A practical recipe for your own LLM application (e.g. a RAG chatbot):**

### Step 1: Define what "good" means

List the qualities that matter, from user and business needs: correct, grounded, complete, concise, polite, safe, correct language, cites sources, escalates when needed, fast, cheap.

### Step 2: Build an evaluation dataset (the "golden set")

- 100 to 500 examples to start; grow over time
- **Real user queries** (from logs, anonymised) + **synthetic** ones for coverage + **edge cases** + **adversarial** cases (injection, out-of-scope, harmful)
- For each: the expected answer or key facts, the relevant source documents (for RAG), and tags for **slices** (topic, language, difficulty)
- **Split:** a development set you iterate on + a held-out test set you check rarely (Goodhart, section 10)

### Step 3: Choose metrics per quality

| Quality | Metric |
|---|---|
| Retrieval | Recall@k, MRR ([file 23](23-embeddings-vector-databases-rag.md#18-evaluating-rag)) |
| Correctness | Reference-guided LLM judge; exact match/F1 for short answers |
| Faithfulness | Claim-level groundedness |
| Format | Code checks (valid JSON, length limits, required fields) |
| Safety | Refusal/over-refusal rates on test prompts |
| Efficiency | p50/p95 latency, tokens and **cost per request** |

**Prefer cheap, deterministic code checks** wherever possible; use LLM judges for what code can't check; use humans to validate judges and for final sign-off.

### Step 4: Automate it

Run the eval suite on **every change** (prompt, model, retrieval settings, code) in **CI** ([file 28](28-mlops-and-llmops.md)), like unit tests. Show a comparison report: overall + per slice + examples that got worse (**regressions**).

### Step 5: Error analysis

Read the failures. Group them into categories (retrieval miss, hallucination, wrong format, misunderstood question...). Fix the biggest category first. Add new failure cases to the test set.

### Step 6: Close the loop with production

Feed real failures and user feedback back into the dataset (section 18).

**Tools:** promptfoo, DeepEval, RAGAS, OpenAI Evals, Inspect (UK AISI), LangSmith, Langfuse, Arize Phoenix, Braintrust, Weights & Biases Weave, NVIDIA NeMo Evaluator.

---

## 18. Online evaluation

Offline tests can't capture everything. In production:
- **Explicit feedback:** thumbs up/down, ratings, comments
- **Implicit signals:** user rephrases the question (dissatisfaction), copies the answer (satisfaction), abandons, escalates to a human, task completion
- **Sampled LLM-judge scoring** of live traffic (e.g. faithfulness on 5% of conversations)
- **Monitoring** quality, safety flags, latency and cost over time; **drift** in the kinds of questions asked (file 28)
- **A/B tests** for changes ([file 07](07-math-probability-statistics.md#20-ab-testing)): randomise users between versions; measure business metrics (resolution rate, CSAT, conversion) with guardrail metrics (latency, cost, complaint rate); watch for novelty effects and peeking
- **Shadow mode / canary releases:** run the new version silently or on a small % of traffic first

---

## 19. Check yourself

**Q1.** A model assigns probabilities 0.5, 0.5, 0.25, 0.25 to the 4 actual tokens. What's its perplexity?
<details><summary>Answer</summary>log-probs: −0.693, −0.693, −1.386, −1.386 → mean = −1.040 → PPL = e^1.040 ≈ **2.83**.</details>

**Q2.** Why can't you compare perplexity between models with different tokenisers?
<details><summary>Answer</summary>Perplexity is per token; different tokenisers split the same text into different numbers of tokens. Use bits per byte instead.</details>

**Q3.** Reference "the red car", prediction "a red car" (after normalisation "a" and "the" are removed). Compute EM and token F1.
<details><summary>Answer</summary>Both become "red car": EM = 1, F1 = 1.0.</details>

**Q4.** Why are BLEU/ROUGE weak for evaluating chatbot answers?
<details><summary>Answer</summary>They measure word overlap with a reference, not meaning or correctness: paraphrases score low; fluent wrong answers can score high; open-ended questions have many valid answers.</details>

**Q5.** n = 20 samples, c = 5 pass. Compute pass@1.
<details><summary>Answer</summary>1 − C(15,1)/C(20,1) = 1 − 15/20 = **0.25**.</details>

**Q6.** What's benchmark contamination and how can you detect it?
<details><summary>Answer</summary>Test data leaked into training data, inflating scores. Detect via n-gram overlap, performance drop on rephrased/new questions, verbatim completion tests, canary strings.</details>

**Q7.** Name three LLM-judge biases and a mitigation for each.
<details><summary>Answer</summary>Position bias → swap orders; verbosity bias → rubric penalising padding/length control; self-preference → different judge model or panel. Also style over substance → reference-guided grading.</details>

**Q8.** How do you know whether to trust an LLM judge?
<details><summary>Answer</summary>Compare its verdicts with human labels on a sample and measure agreement (accuracy, kappa); iterate until acceptable.</details>

**Q9.** Elo: R_A = 1500, R_B = 1500, K = 32, A wins. New R_A?
<details><summary>Answer</summary>E_A = 0.5 → 1500 + 32 × 0.5 = **1516**.</details>

**Q10.** Two raters: observed agreement 0.85, chance agreement 0.60. Cohen's kappa?
<details><summary>Answer</summary>(0.85 − 0.60)/(1 − 0.60) = 0.25/0.40 = **0.625** (substantial).</details>

**Q11.** Prompt A: 76% accuracy; prompt B: 80%, on 50 test questions. Ship B?
<details><summary>Answer</summary>Not based on this alone. With n = 50 the CI is about ±11 points; run a paired test/bootstrap on more examples, check slices, and confirm on held-out data.</details>

**Q12.** An answer has 8 atomic claims; 6 are supported by the context. Faithfulness score?
<details><summary>Answer</summary>6/8 = **0.75**.</details>

---

## 20. New words in this file

| Word | Meaning |
|---|---|
| Offline vs online evaluation | Before release on test sets vs in production |
| Reference-based vs reference-free | Compare to a known answer vs judge on its own |
| Pointwise vs pairwise | Score one output vs compare two |
| Perplexity, bits per byte (BPB) | e^(cross-entropy) / tokeniser-independent version |
| Sliding window (perplexity) | Computing PPL over long texts in overlapping windows |
| Exact match (EM), normalisation | Identical after cleaning / lowercase, strip punctuation/articles |
| Token F1 | Token-overlap precision/recall/F1 |
| BLEU, brevity penalty, clipping, SacreBLEU | Translation n-gram precision metric and its parts |
| ROUGE-1/2/L | Summarisation recall-oriented overlap metrics |
| chrF, METEOR | Character-level / synonym-aware metrics |
| BERTScore | Embedding-based token matching metric |
| Functional correctness, unit tests | Code passes tests |
| pass@k, unbiased estimator | Probability ≥1 of k samples passes |
| HumanEval, MBPP, SWE-bench, LiveCodeBench | Code benchmarks |
| MMLU, GPQA, HellaSwag, ARC, GSM8K, MATH, TruthfulQA, IFEval, BIG-bench, MT-Bench | LLM benchmarks |
| Needle-in-a-haystack, RULER | Long-context tests |
| lm-evaluation-harness, HELM, lighteval, NeMo Evaluator | Evaluation harnesses |
| Log-likelihood scoring, acc, acc_norm | Scoring MC by option probability (length-normalised) |
| Contamination, canary string | Test data in training data / detection marker |
| Saturation | Benchmark no longer separates models |
| Goodhart's law | Optimising a measure ruins it |
| LLM-as-a-judge, rubric, G-Eval | Model grading outputs |
| Reference-guided grading, binary checks | Judging with a reference / yes-no criteria |
| Position, verbosity, self-preference bias | LLM judge biases |
| Judge panel | Several judges combined |
| Win rate | Fraction of pairwise wins |
| Elo rating, K-factor, expected score | Chess-style rating system |
| Bradley-Terry | Statistical model of pairwise preferences |
| Chatbot Arena / LMArena | Crowd-sourced pairwise leaderboard |
| Blind evaluation | Raters don't know the source |
| Inter-annotator agreement, Cohen's kappa, Krippendorff's alpha | Rater agreement measures |
| Kappa paradox | Low kappa despite high agreement with skewed labels |
| Faithfulness/groundedness, atomic claims | Support by source / smallest checkable statements |
| SelfCheckGPT, FActScore | Consistency-based / fact-based hallucination metrics |
| ECE (calibration) | Confidence vs accuracy gap |
| Refusal / over-refusal rate, XSTest | Safety balance measures |
| Attack success rate (ASR), garak | Jailbreak metric / scanner |
| Counterfactual testing | Swapping attributes to detect bias |
| Paired comparison, McNemar test, discordant pairs | Comparing systems on the same items |
| Bootstrap CI | Resampling-based confidence interval |
| Slice-based evaluation | Metrics per subgroup |
| Golden set, dev vs held-out test set | Evaluation dataset and its splits |
| Regression (in evals) | Something that got worse after a change |
| Error analysis | Studying and categorising failures |
| promptfoo, DeepEval, Inspect, Langfuse, Braintrust | Evaluation tools |
| Explicit vs implicit feedback | Ratings vs behavioural signals |
| Canary release, shadow mode | Gradual / silent rollout |

**Next:** [27-inference-and-serving.md](27-inference-and-serving.md)
