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

**Why this matters:** a maths exam has one right answer, so marking is easy. A language model writes sentences, and there are thousands of correct ways to say the same thing. If we cannot measure quality, we cannot tell whether a change made the system better or worse.

With a classifier ([file 13](13-evaluation-metrics-and-tuning.md)), there's one right label and accuracy is easy. With LLMs:
- **Many correct answers:** "Paris is the capital of France" and "France's capital city is Paris" are both right
- **Open-ended quality:** helpfulness, tone, clarity, creativity are subjective
- **Multiple dimensions at once:** correctness, faithfulness, safety, format, length, latency, cost
- **Non-determinism:** different runs give different outputs ([file 20](20-how-llms-work.md#11-other-generation-controls))
- **Prompt sensitivity:** small wording changes shift scores
- **Benchmarks leak** into training data (section 10)

So we combine several methods, each with strengths and weaknesses.

---

### A worked example: one question, three correct answers

Question: "Where does Sri Lanka's parliament sit?" Three model answers:

| Answer | Correct? | Exact match with "Sri Jayawardenepura Kotte" |
|---|---|---|
| "Sri Jayawardenepura Kotte" | Yes | 1 |
| "It is Kotte." | Yes | 0 |
| "The parliament sits in Sri Jayawardenepura Kotte, near Colombo." | Yes | 0 |

All three are right, but a simple string comparison marks two of them wrong. A classifier never has this problem because it only outputs one label. This is why LLM evaluation needs several tools instead of one number.

```
          one prompt
              │
   ┌──────────┼──────────┐
 answer 1   answer 2   answer 3     ← many valid outputs
   │          │          │
 correct?   helpful?   safe?        ← many dimensions to judge
   └──────────┴──────────┘
        run again tomorrow → different words again (non-determinism)
```

**Where you'll meet it in real work:** a bank launches a customer-support chatbot. Management asks "is it good enough?" and the team must answer with evidence (accuracy on real questions, how often it makes things up, how fast and how costly it is), not with "it feels good".

**Common mistakes:**
- Trusting one score (for example one benchmark number) as "the quality" of a model.
- Testing with five hand-picked questions and calling it evaluated.
- Forgetting that the same prompt can give different answers on different runs.

**Exam angle:** NCA-GENL-style questions ask why LLM evaluation is harder than classifier evaluation. Expect answers like "many valid outputs, subjective quality, non-determinism and prompt sensitivity".

> **සිංහලෙන්:** සාමාන්‍ය classifier එකක් හරි ලේසියි, "මේ පින්තූරේ බළලෙක්ද?" කියලා හරි උත්තරේ එකයි. ඒත් LLM එකකට "ශ්‍රී ලංකාවේ අගනුවර මොකක්ද?" කියලා ඇහුවම "කෝට්ටේ", "ශ්‍රී ජයවර්ධනපුර කෝට්ටේ" කියලා විවිධ විදිහට හරියටම උත්තර දෙන්න පුළුවන්. එතකොට string එක සමාන්ද බලලා mark කරන්න බෑ. ඒ වගේම helpful ද, safe ද, ඉක්මනින් ආවද කියලා දේවල් ගොඩක් එකවර බලන්න වෙනවා. අද එකම prompt එකට දෙන උත්තරේ හෙටත් වෙනස් වෙන්න පුළුවන්. ඒ නිසා එක ක්‍රමයක් විතරක් නෙවෙයි, ක්‍රම කීපයක් එකතු කරලා තමයි LLM එකක් මනින්නේ.


## 2. Kinds of evaluation

**Why this matters:** "How good is it?" has no single answer. It depends on *when* you test, *who* grades, and *what* you compare against. Naming the kinds of evaluation lets you pick the cheapest one that still answers your question.

| Dimension | Options |
|---|---|
| **When** | **Offline** (before release, on test sets) vs **online** (in production, real users) |
| **Who/what judges** | **Automatic metrics** (code) vs **model-based** (LLM-as-a-judge) vs **human** |
| **Reference** | **Reference-based** (compare to a known good answer) vs **reference-free** (judge the output on its own, e.g. "is it faithful to the source?") |
| **Scope** | **Model evaluation** (general capability: benchmarks) vs **application/system evaluation** (your RAG bot on your users' questions) |
| **Format** | **Pointwise** (score each output alone) vs **pairwise** (which of two is better?) |

**Key insight for practitioners:** public benchmarks tell you which models are **generally** strong. Only **your own evaluation set** tells you whether a model + prompt works **for your task**.

---

### A worked example: Daraz-style shopping assistant

Suppose a shop builds a chatbot that answers delivery questions.

| Step | Kind of evaluation | What you learn |
|---|---|---|
| Before launch | Offline, reference-based, automatic | 300 saved questions with known answers: 246 correct = 82% |
| Before launch | Offline, human, pairwise | Staff prefer the new prompt over the old one in 64 of 100 comparisons |
| After launch | Online, implicit signals | 9% of chats end with "talk to a human" |
| After launch | Online, A/B test | Resolution rate 62% (old) vs 66% (new) |

```
 offline (safe, repeatable, cheap)          online (real, but risky)
 ┌────────────────────────────┐   ship   ┌──────────────────────────┐
 │ golden set, benchmarks,    │ ───────► │ real users, feedback,    │
 │ judges, human review       │          │ A/B tests, monitoring    │
 └────────────────────────────┘ ◄─────── └──────────────────────────┘
                 failures become new test cases
```

**Where you'll meet it in real work:** every team keeps an offline suite that runs on each change (like unit tests) and an online dashboard that watches live behaviour.

**Common mistakes:**
- Picking a model only because it tops a public leaderboard, without testing on your own questions.
- Using only offline tests and never checking what real users do.
- Mixing up model evaluation (general ability) with system evaluation (model + prompt + retrieval + tools).

**Exam angle:** know the contrasts: offline vs online, reference-based vs reference-free, pointwise vs pairwise, model vs application evaluation.

> **සිංහලෙන්:** Evaluation කියන්නේ එක වර්ගයක් නෙවෙයි. පාසලේ වගේම හිතන්න: විභාගයට කලින් කරන mock paper එක offline (ආරක්ෂිතයි, ආයෙත් ආයෙත් කරන්න පුළුවන්), ඇත්තම විභාගය online (ඇත්ත තත්වය, වැරදුණොත් බලපෑම ලොකුයි). Chatbot එකක් නම් ප්‍රශ්න 300ක් save කරලා ඒවා හරිද බලන එක offline, ඇත්ත customers ලා thumbs up/down දෙන එක online. ලකුණු දෙන්නේ code එකද, තව LLM එකක්ද, මනුස්සයෝද කියලත් වෙනස් වෙනවා. Public benchmark එකෙන් කියන්නේ model එක සාමාන්‍යයෙන් හොඳද කියලා විතරයි. ඔයාගේ වැඩේට හරියනවද කියන්නේ ඔයාගේම test set එකෙන් විතරයි.


## 3. Perplexity

**Why it exists:** before a model can write good answers it must first be good at predicting the next token. Perplexity gives a single number for "how surprised is the model by real text?", cheap to compute with no human help.

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

### A second worked example: uniform guessing

A model that knows nothing and gives every token the same probability over a 4-token vocabulary: each actual token gets 0.25.
- ln(0.25) = −1.386 for every token, so the average cross-entropy = 1.386
- PPL = e^1.386 = **4.0**

So PPL = 4 means "as unsure as picking among 4 equally likely tokens". Perplexity is like the model's effective number of choices at each step.

### Why different tokenisers break comparisons

Model X cuts a 100-character sentence into 25 tokens with average cross-entropy 2.0 nats per token. Model Y cuts the same sentence into 50 tokens with average 1.2 nats per token.
- PPL of X = e^2.0 = 7.39; PPL of Y = e^1.2 = 3.32. Y *looks* far better.
- Total surprise for the sentence: X = 25 × 2.0 = 50 nats; Y = 50 × 1.2 = 60 nats.
- Per character: X = 0.50 nats, Y = 0.60 nats. **X is actually better.**

This is why bits per byte (or per character) is the fair measure across tokenisers. (Numbers are made up to show the effect.)

```
low PPL  ◄───────────────────────────────►  high PPL
sure, usually right                          confused, near random
  (e.g. 3)                                     (e.g. 50,000 = vocabulary size)
```

**Where you'll meet it in real work:** teams watch perplexity on a validation set while pretraining or continuing to train a model on, say, Sinhala news text. A steady fall means it is learning the language.

**Common mistakes:**
- Comparing perplexity of two models that use different tokenisers.
- Believing low perplexity means the answers are helpful or true.
- Computing it with natural log for one model and log base 2 for another (the numbers differ).

**Exam angle:** "lower perplexity is better", "PPL = exp(cross-entropy)", and "only compare with the same tokeniser and same text" are the classic points.

> **සිංහලෙන්:** Perplexity කියන්නේ model එකට ඊළඟ token එක ගැන තියෙන "අවිනිශ්චිතභාවය" මනින අංකයක්. PPL = 4 කිව්වොත් model එක හැම පියවරකදීම හිතන්නේ උත්තර 4ක් අතරින් එකක් තෝරනවා වගේ. අඩු වෙන තරමට හොඳයි. හැබැයි model දෙකක tokeniser වෙනස් නම් PPL සසඳන්න බෑ. උදාහරණයක් විදිහට එකම වාක්‍යය එක model එකක token 25කට කඩනවා, අනිත් එක token 50කට. එතකොට token එකක සාමාන්‍ය අගය වෙනස්. ඒ නිසා ඒවා සාධාරණව සසඳන්න bits per byte පාවිච්චි කරනවා. ඒ වගේම PPL අඩු වුණාට model එකේ උත්තර ඇත්තද, ප්‍රයෝජනවත්ද කියලා ඒකෙන් කියන්නේ නෑ.


## 4. Exact match and token F1

**Why it exists:** when the correct answer is short (a name, a date, a number), we want a quick automatic yes/no check, and a softer score when the answer is only partly right.

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

### More worked examples (all steps shown)

**Token F1 with a partial answer.** Reference "Sri Jayawardenepura Kotte" has 3 tokens; prediction "Kotte" has 1 token; overlap = 1.
- Precision = 1/1 = 1.0; Recall = 1/3 = 0.333
- F1 = 2 × 1.0 × 0.333 / (1.0 + 0.333) = 0.667 / 1.333 = **0.50**
- EM = 0, but F1 gives half credit.

**Token F1 with extra words.** Reference "Kotte"; prediction "Colombo Kotte" (overlap = 1).
- Precision = 1/2 = 0.5; Recall = 1/1 = 1.0
- F1 = 2 × 0.5 × 1.0 / 1.5 = **0.667**

**Normalisation matters.**

| Reference | Prediction | EM without cleaning | EM after cleaning |
|---|---|---|---|
| The Eiffel Tower | eiffel tower. | 0 | 1 |
| 1,500 | 1500 | 0 | 0 (unless you also normalise numbers) |

```
precision = of the words I said, how many were right?
recall    = of the right words, how many did I say?
F1        = balance of the two (harmonic mean)
```

**Where you'll meet it in real work:** extractive question answering over company documents (for example "What is the notice period?" → "30 days"), and standard QA benchmarks such as SQuAD report exactly EM and F1.

**Common mistakes:**
- Forgetting to normalise before comparing, so correct answers score 0.
- Using EM for long answers (almost always 0) instead of an LLM judge.
- Not reading failures: EM = 0 may hide a right answer in a different format (like "30 days" vs "thirty days").

**Exam angle:** know that EM is strict, token F1 gives partial credit, and both need normalisation.

> **සිංහලෙන්:** Exact Match කියන්නේ ලකුණු 1යි නැත්නම් 0යි. උත්තරේ සම්පූර්ණයෙන්ම සමාන නම් විතරයි ලකුණු. ඒක ටිකක් දරුණුයි. හරි උත්තරේ "ශ්‍රී ජයවර්ධනපුර කෝට්ටේ" (words 3ක්), model එක කිව්වේ "Kotte" විතරයි නම් EM = 0. Token F1 එකෙන් නම් precision = 1/1, recall = 1/3, ඒ නිසා F1 = 0.5 වගේ අඩක් ලකුණු ලැබෙනවා. ලකුණු දාන්න කලින් capital letters, punctuation, "the" වගේ words අයින් කරලා normalise කරන්න අමතක කරන්න එපා. නැත්නම් හරි උත්තරයක්වත් 0 වෙන්න පුළුවන්.


## 5. Overlap metrics

**Why they exist:** before LLM judges, people needed a fast, free and repeatable way to score translations and summaries against a human-written reference. Counting overlapping words (n-grams) is that cheap shortcut.

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

### ROUGE precision, recall and F1 on the same example

Reference "the cat is on the mat" (6 words); prediction "the cat on the mat" (5 words); overlap = 5 words.
- ROUGE-1 recall = 5/6 = 0.833
- ROUGE-1 precision = 5/5 = 1.0
- ROUGE-1 F1 = 2 × 1.0 × 0.833 / (1.0 + 0.833) = **0.909**
- ROUGE-L: the longest common subsequence is "the cat on the mat" (length 5), so LCS-recall = 5/6, same here.

### The "same meaning, low score" problem in numbers

Reference: "the film was excellent". Prediction: "the movie was fantastic".
- Unigram overlap = {the, was} = 2 of 4 → ROUGE-1 = 2/4 = **0.5**
- A human would give full marks. Overlap metrics see only the shared words.

| Metric | Direction | Typical task | Looks at |
|---|---|---|---|
| BLEU | Precision (with brevity penalty) | Machine translation | n-grams 1 to 4 |
| ROUGE | Recall | Summarisation | n-grams, longest common subsequence |
| chrF | Character n-gram F-score | Languages with many word forms | Characters |

**Where you'll meet it in real work:** a team that translates English product descriptions into Sinhala tracks chrF or SacreBLEU on a few hundred reference translations to see whether a new model version helps. They still read samples by hand.

**Common mistakes:**
- Comparing BLEU numbers computed with different tokenisation (use SacreBLEU).
- Using BLEU on a single sentence (too noisy; it is meant for a whole test set).
- Treating a high ROUGE as proof that a summary is true.

**Exam angle:** BLEU = precision-oriented (translation), ROUGE = recall-oriented (summarisation); both reward wording overlap, not meaning.

> **සිංහලෙන්:** BLEU සහ ROUGE කියන්නේ model එකේ උත්තරයේ words මිනිස් අතින් ලියපු හරි උත්තරයේ words එක්ක කොච්චර ගැළපෙනවද කියලා ගණන් කරන එක. BLEU precision බලනවා (model එක කියපු words වලින් කීයක් හරිද), ROUGE recall බලනවා (හරි උත්තරයේ words වලින් කීයක් model එක කිව්වද). "the film was excellent" සහ "the movie was fantastic" කියන වාක්‍ය දෙකේ තේරුම එකම, ඒත් ගැළපෙන්නේ "the", "was" දෙක විතරයි, ඒ නිසා ROUGE-1 = 2/4 = 0.5ක් විතරයි. ඒ කියන්නේ මේ metrics වචන බලනවා මිසක් තේරුම බලන්නේ නෑ. ඒ නිසා chatbot උත්තර මනින්න මේවා දුර්වලයි.


## 6. Semantic metrics

**Why they exist:** overlap metrics fail when the words differ but the meaning is the same. Semantic metrics compare *meaning* by turning text into vectors first.

- **BERTScore:** embed each token of prediction and reference with a contextual model (BERT-like, [file 19](19-transformers.md#15-bert)); match each token to its most similar token on the other side (cosine similarity); compute precision/recall/F1 from those similarities. Captures paraphrases ("film" ≈ "movie").
- **Embedding similarity:** cosine similarity between sentence embeddings ([file 23](23-embeddings-vector-databases-rag.md#3-embeddings-revisited)) of prediction and reference.
- **NLI-based:** use a Natural Language Inference model ([file 18](18-nlp-fundamentals.md#14-core-nlp-tasks)) to check whether the prediction **entails** the reference (and vice versa).

Better at meaning than BLEU/ROUGE, but still can't fully judge correctness or helpfulness. That's why LLM-as-a-judge (section 11) became popular.

---

### A worked example: cosine similarity with tiny vectors

Pretend two sentences have embeddings a = (1, 2) and b = (2, 3). Real embeddings have hundreds of numbers, but the steps are identical.
- Dot product = 1×2 + 2×3 = 8
- Length of a = √(1² + 2²) = √5 = 2.236; length of b = √(2² + 3²) = √13 = 3.606
- Cosine = 8 / (2.236 × 3.606) = 8 / 8.063 = **0.992** → almost the same direction, so very similar meaning

### BERTScore on made-up numbers

Prediction "movie was great", reference "film was excellent". For each prediction token, take its best cosine match among reference tokens (illustrative values):

| Prediction token | Best match | Similarity |
|---|---|---|
| movie | film | 0.90 |
| was | was | 1.00 |
| great | excellent | 0.80 |

Precision = (0.90 + 1.00 + 0.80)/3 = **0.90**. Do the same from the reference side (film→movie 0.90, was→was 1.00, excellent→great 0.80) for recall = **0.90**. F1 = 0.90. Compare ROUGE-1 = 1/3 on the same pair.

```
   words differ ──► BLEU/ROUGE: low
   meaning same ──► BERTScore / embeddings: high
   meaning flipped ("not good" vs "good") ──► can still look similar. Watch out!
```

**Where you'll meet it in real work:** checking whether a paraphrasing tool or a summariser keeps the meaning of the original text; also finding duplicate customer complaints.

**Common mistakes:**
- Assuming high similarity means the answer is correct (a wrong but on-topic answer still scores high).
- Mixing embedding models between the two texts being compared.

**Exam angle:** BERTScore and embedding similarity capture paraphrases; NLI checks entailment; none of them replace judging factual correctness.

> **සිංහලෙන්:** Semantic metrics වලින් කරන්නේ words නෙවෙයි තේරුම සසඳන එක. වාක්‍ය දෙකම embedding කියන අංක ලැයිස්තුවකට (vector) හරවලා, ඒ vectors දෙක එකම දිශාවට තියෙනවද කියලා cosine similarity එකෙන් බලනවා. උදාහරණයක් විදිහට vectors (1,2) සහ (2,3) වල cosine = 8 ÷ 8.06 = 0.99, ඒ කියන්නේ තේරුම ගොඩක් ළඟයි. BERTScore එකෙන් "film" සහ "movie" වගේ words එකම තේරුමින් ගැළපෙනවා කියලා අඳුනගන්නවා. ඒත් මේකෙනුත් උත්තරේ ඇත්තද කියලා සම්පූර්ණයෙන් කියන්න බෑ. ඒකයි LLM-as-a-judge ජනප්‍රිය වුණේ.


## 7. Code evaluation

**Why it exists:** code either works or it does not. Instead of comparing words, we can *run* the code against tests, which is the most objective check there is.

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

### More worked examples of pass@k

Why not just "did the first try pass"? Because users can often retry, and models are random. The estimator uses n samples per problem to estimate the chance that at least one of k passes.

| n | c (passing) | k | Calculation | pass@k |
|---|---|---|---|---|
| 5 | 1 | 1 | 1 − C(4,1)/C(5,1) = 1 − 4/5 | 0.20 |
| 5 | 1 | 3 | 1 − C(4,3)/C(5,3) = 1 − 4/10 | 0.60 |
| 5 | 1 | 5 | 1 − C(4,5)/C(5,5) = 1 − 0/1 | 1.00 |

(C(4,5) = 0 because you cannot pick 5 items from 4.) If *every* sample passes, c = n and pass@k = 1 for all k; if none pass, pass@k = 0.

```
 problem ──► model writes n=10 programs ──► run unit tests ──► c=3 pass
                                                           │
                         pass@1 = 3/10 = 0.30   pass@5 = 0.917
```

**Where you'll meet it in real work:** a software company deciding whether a coding assistant is good enough runs it on its own functions with their existing unit tests. SWE-bench does the same with real bug reports from open-source projects.

**Common mistakes:**
- Reporting pass@10 when the product only shows the user one answer (use pass@1).
- Weak unit tests: code can pass all tests and still be wrong.
- Running generated code on your own machine without a sandbox.

**Exam angle:** pass@k = probability at least one of k samples passes the tests; HumanEval and MBPP are function-level, SWE-bench is repository-level.

> **සිංහලෙන්:** Code එකේ නම් හරි වැරදි බලන්න ලේසියි, ඒක run කරලා unit tests pass වෙනවද බලනවා. හැබැයි model එක සෑම වෙලාවකම එකම code එක දෙන්නේ නෑ. ඒ නිසා එකම ප්‍රශ්නයට code 10ක් ලියවලා, ඒවා අතරින් 3ක් test pass කළා කියමු. එතකොට pass@1 = 3/10 = 0.30, ඒත් උත්සාහ 5ක් දුන්නොත් අඩු තරමින් එකක්වත් pass වෙන්න තියෙන ඉඩ pass@5 = 0.917. User ට පෙන්නන්නේ එක උත්තරයක් විතරනම් pass@1 බලන්න ඕනේ. Model එක ලියපු code ඔයාගේ machine එකේ කෙලින්ම run කරන්න එපා, sandbox එකක් ඇතුළේ විතරක් run කරන්න.


## 8. Standard benchmarks

**Why they exist:** to compare models fairly we need the same exam for everyone. A benchmark is a fixed set of questions with a fixed way of scoring, like a national exam paper.

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

### Reading a benchmark number

- **Random baseline matters.** MMLU has 4 options per question, so random guessing gets about 25%. A model scoring 30% has learned almost nothing; 85% is strong. (MMLU-Pro uses up to 10 options, so guessing is near 10%.)
- **Counting.** If a model answers 1,200 of 1,500 questions correctly, accuracy = 1,200/1,500 = **80%**.
- **Which benchmark for which question?**

| You want to know... | Look at |
|---|---|
| General knowledge | MMLU / MMLU-Pro, GPQA |
| Maths reasoning | GSM8K, MATH, AIME |
| Coding | HumanEval, MBPP, SWE-bench, LiveCodeBench |
| Follows instructions exactly | IFEval |
| Avoids repeating myths | TruthfulQA |
| Chat quality | MT-Bench, Chatbot Arena |
| Long documents | Needle-in-a-haystack, RULER |
| Tool use and multi-step tasks | τ-bench, WebArena, GAIA |

**Where you'll meet it in real work:** when a company chooses between three open models, it first shortlists using public benchmarks, then tests the shortlist on its own 200 questions. Benchmarks narrow the field; they do not make the final decision.

**Common mistakes:**
- Treating "higher MMLU" as "better for my chatbot".
- Ignoring that almost no benchmark covers Sinhala well.
- Comparing numbers reported under different settings (see the next section).

**Exam angle:** be ready to match a benchmark to what it tests (MMLU knowledge, GSM8K grade-school maths, HumanEval code, TruthfulQA myths, IFEval verifiable instructions, MT-Bench/Arena chat preference).

> **සිංහලෙන්:** Benchmark එකක් කියන්නේ හැම model එකටම එකම ප්‍රශ්න පත්‍රය දීලා ලකුණු සසඳන එක, ජාතික විභාගයක් වගේ. MMLU එකේ ප්‍රශ්නයකට පිළිතුරු 4ක් තියෙන නිසා නිකම් අනුමාන කළත් 25%ක් ලැබෙනවා, ඒ නිසා 30%ක් කියන්නේ ඉගෙන ගත්තේ නෑ වගේ. ප්‍රශ්න 1,500න් 1,200ක් හරි නම් 1,200 ÷ 1,500 = 80%. Maths වලට GSM8K, code වලට HumanEval, chat එකට MT-Bench වගේ එක එක දේට එක එක benchmark තියෙනවා. ඒත් බොහෝ benchmarks වල සිංහල පොඩ්ඩයි, ඒ නිසා ඔයාගේ වැඩේට ගැළපෙනවද බලන්න ඔයාගේම test set එකක් හදාගන්න ඕනේ.


## 9. How harnesses score

**Why it exists:** the same model can score 60% or 75% on the same benchmark depending on how it is prompted and scored. Harnesses fix those choices so numbers can be compared.

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

### A worked example: acc vs acc_norm

Question: "Which is the capital city where Sri Lanka's parliament meets?" Two options, with made-up total log-probabilities:

| Option | Length (characters) | Total log-prob | Per character (acc_norm) |
|---|---|---|---|
| A: "Colombo" | 7 | −4.2 | −4.2 / 7 = −0.60 |
| B: "Sri Jayawardenepura Kotte" | 25 | −9.0 | −9.0 / 25 = −0.36 |

- **acc** picks the highest total: A (−4.2 > −9.0).
- **acc_norm** picks the highest per-character value: B (−0.36 > −0.60).

Longer options collect more negative log-probs just by having more tokens, so normalising removes that bias. The two methods can pick different answers.

```
 question + option A ─► model ─► log P(A | question) ┐
 question + option B ─► model ─► log P(B | question) ├─► pick the best
 question + option C ─► model ─► log P(C | question) ┘
 (the model never "writes" an answer; we just score each choice)
```

### Same model, different settings

| Setting | MMLU score (illustrative) |
|---|---|
| 0-shot, plain prompt | 60% |
| 5-shot, same prompt | 66% |
| 5-shot + chain of thought | 71% |

The model did not change, only the exam conditions did. (Numbers are illustrative.)

**Where you'll meet it in real work:** if a vendor claims "our model beats yours on MMLU", ask for the harness, shots, prompt template and chat-template settings before you believe it. Reproducing a score with `lm-evaluation-harness` is a routine task.

**Common mistakes:**
- Comparing a number from a paper (5-shot) with your own 0-shot run.
- Forgetting the model's chat template, which can change accuracy noticeably.
- Writing a sloppy answer-extraction rule that marks right answers wrong.

**Exam angle:** know log-likelihood scoring for multiple choice, why acc_norm exists, and that scores are only comparable under identical settings.

> **සිංහලෙන්:** Harness එකක් කියන්නේ benchmark එක හැම model එකකටම එකම විදිහට run කරන මෙවලමක්. Multiple-choice වලදී model එක උත්තරයක් ලියන්නේ නෑ, හැම option එකකටම log-probability එක ගණන් බලලා වැඩිම එක තෝරනවා. දිග option එකක token වැඩි නිසා ස්වභාවයෙන්ම probability එක අඩු වෙනවා. ඒ නිසා acc_norm එකේදී දිගෙන් බෙදනවා. උදාහරණයක් විදිහට "Colombo" (අකුරු 7) -4.2 නම් එකකට -0.60, "Sri Jayawardenepura Kotte" (අකුරු 25) -9.0 නම් එකකට -0.36, ඒ නිසා normalise කරාම දෙවැන්න ජයග්‍රහණය කරනවා. Shots ගාණ, prompt එක වෙනස් වුණොත් ලකුණුත් වෙනස් වෙනවා, ඒ නිසා කොන්දේසි සමාන නැතිව ලකුණු සසඳන්න බෑ.


## 10. Contamination and Goodhart

**Why it matters:** a benchmark score is only meaningful if the model did not see the answers in advance. Contamination, saturation and Goodhart's law are the three ways a good-looking score can mislead you.

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

### A worked example: spotting memorisation

A model gets 90 of 100 benchmark questions right. A team rewrites the same 100 questions (same difficulty, different wording and numbers). Now it gets 70.
- Drop = 90% − 70% = **20 points**
- A model that truly understands should lose only a few points. A 20-point drop suggests it had partly memorised the originals.

```
 test set published online ──► scraped into training data ──► model memorises
                                                              │
                  high score on old test ◄────────────────────┘
                  low score on fresh, rephrased test  ← the tell-tale sign
```

**Sri Lankan analogy:** a student who memorised the answers of 10 years of past papers can score high on a repeated question but fails when the question is reworded. Goodhart's law is the same: if teachers only teach what appears in the scholarship exam, marks rise while real understanding may not.

| Problem | Symptom | Fix |
|---|---|---|
| Contamination | Great on the public test, weak on fresh data | Private test sets, live benchmarks, canary strings |
| Saturation | All top models at 90%+ | Move to harder benchmarks |
| Goodhart | Metric up, real quality flat or down | Keep a held-out set; track several metrics |

**Where you'll meet it in real work:** a team tunes its prompt on the same 50 questions for a month, reaches 96%, then sees 78% on new customer questions. That gap is Goodhart plus overfitting.

**Common mistakes:**
- Reusing the test set after every tweak.
- Assuming public benchmarks are clean.
- Celebrating a score without checking fresh data.

**Exam angle:** define contamination, name a detection method (n-gram overlap, rephrased tests, canary strings) and quote Goodhart's law.

> **සිංහලෙන්:** Contamination කියන්නේ test එකේ ප්‍රශ්න model එක train කරපු data වලට ඒ පිටින්ම පැටලිලා තියෙන එක. කලින් අවුරුදු 10ක past paper උත්තර කටපාඩම් කරපු ළමයා, ප්‍රශ්නය වචන වෙනස් කළාම අසමත් වෙනවා වගේ. Benchmark ප්‍රශ්න 100න් 90ක් හරි ගත්ත model එක, වචන වෙනස් කරපු එකම ප්‍රශ්න 100න් 70ක් විතරක් හරි ගත්තොත් ලකුණු 20ක් පහළ වැටුණා, ඒ කියන්නේ කටපාඩම් කරලා ඇති. Goodhart's law කියන්නේ මනින දේ ඉලක්කයක් වුණාම ඒක හොඳ මිනුමක් නොවී යනවා කියන එක. ඒ නිසා ඔයා කවදාවත් බලන්නේ නැති held-out test set එකක් තියාගන්න.


## 11. LLM-as-a-judge

**Why it exists:** humans are the best judges but slow and expensive, and automatic metrics are cheap but shallow. A strong LLM following a clear rubric sits in the middle: not perfect, but cheap and scalable.

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

### A worked example: fixing position bias

You compare model X and model Y on 100 prompts using a judge that sees "Answer 1" then "Answer 2". Each prompt is judged twice, once in each order.

| Result across both orders | Number of prompts |
|---|---|
| X wins in both orders | 40 |
| Y wins in both orders | 10 |
| Verdict flips with order (judge just prefers the first slot) | 50 |

Only consistent verdicts count; flips count as ties.
- X win rate = (40 + 50 × 0.5) / 100 = **65%**; Y = (10 + 25) / 100 = **35%**
- If you had judged only one order, a position-biased judge could have shown almost any result.

### Checking the judge itself

100 answers labelled by a human as pass/fail; the judge agrees on 88.
- Agreement = 88/100 = **88%**. Check also *where* it disagrees: if the 12 mistakes are all "judge says pass, human says fail", the judge is too lenient.

```
 question + answer + rubric ─► judge LLM ─► reasoning ─► verdict (pass/fail)
                                              ▲
                  validate on 50-200 human-labelled examples first
```

**Where you'll meet it in real work:** a support-bot team checks, on every release, whether answers are correct, complete and polite. They run a binary-criteria judge over 500 saved conversations in a few minutes, and have staff review 50 of them.

**Common mistakes:**
- Using a vague "rate 1 to 10" prompt and treating differences of 0.3 as meaningful.
- Using the same model family as both the system and the judge.
- Never comparing the judge with human labels.

**Exam angle:** know the common biases (position, verbosity, self-preference), mitigations (swap order, reference-guided grading, panels) and that judges must be validated against humans.

> **සිංහලෙන්:** LLM-as-a-judge කියන්නේ ශක්තිමත් LLM එකකට rubric එකක් දීලා, ගුරුවරයෙක් රචනා mark කරනවා වගේ අනිත් model එකේ උත්තර mark කරවන එක. ඒත් judge එකටත් අඩුපාඩු තියෙනවා. උදාහරණයක් විදිහට පළවෙනි උත්තරේට කැමති position bias එක. Prompts 100ක් දෙපැත්තට මාරු කරලා judge කළාම X දෙපාරම දිනපු 40, Y දිනපු 10, මාරු කරාම පිළිතුර වෙනස් වුණු 50 ලැබුණා නම්, ඒ 50 ටයි (tie) ගණන් ගන්න ඕනේ. එතකොට X ට win rate එක (40+25)/100 = 65%. ඒ වගේම judge එකේ තීරණ මනුස්සයෝ 100ක් label කරපු දේවල් එක්ක සසඳලා 88% ගැළපෙනවද කියලා පරීක්ෂා කරන්න ඕනේ.


## 12. Pairwise and Elo

**Why it exists:** people find it hard to say "this answer deserves 7.3 out of 10", but easy to say "A is better than B". Pairwise votes turn those easy choices into a ranking.

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

### More Elo arithmetic

**Favourite wins.** R_A = 1400, R_B = 1200, K = 32.
- Expected score E_A = 1 / (1 + 10^((1200 − 1400)/400)) = 1 / (1 + 10^(−0.5)) = 1 / (1 + 0.316) = **0.76**
- If A wins: R_A_new = 1400 + 32 × (1 − 0.76) = 1400 + 7.7 = **1407.7** (a small gain, it was expected)
- If A loses: R_A_new = 1400 + 32 × (0 − 0.76) = 1400 − 24.3 = **1375.7** (a big loss, it was an upset)

**Win rate with ties.** A beats B in 45 of 80 comparisons, loses 25, ties 10: win rate = (45 + 10 × 0.5)/80 = 50/80 = **62.5%**.

```
 rating gap (R_A − R_B):   0     +100    +200    +400
 chance A wins:           50%     64%     76%     91%
```

**Where you'll meet it in real work:** LMArena shows a leaderboard built from human votes on anonymous model pairs. A company can run a tiny private version: staff vote on 200 pairs of "old bot vs new bot" answers.

**Common mistakes:**
- Reading a 5-point rating gap as a real difference (always check the confidence interval).
- Forgetting that crowd voters prefer longer, nicely formatted answers.
- Treating Arena rank as the best model for your own task.

**Exam angle:** know the Elo formulas, that Bradley-Terry is the joint fitting version, and that Arena = pairwise human votes.

> **සිංහලෙන්:** "මේ උත්තරේට 10න් 7.3ක් දෙන්න" කියලා කියන්න අමාරුයි, ඒත් "A එක B ට වඩා හොඳයි" කියන්න ලේසියි. ඒ ජයග්‍රහණ වලින් ranking එකක් හදන්නේ Elo වලින්. Cricket team ranking එකක් වගේ, ශක්තිමත් කණ්ඩායමක් දුර්වලයෙක්ට දිනුවොත් points ටිකයි ලැබෙන්නේ, ඒත් දුර්වලයා දිනුවොත් points ගොඩක් ලැබෙනවා. උදාහරණයක් විදිහට 1400 rating එකක් තියෙන model එක 1200 එකකට එරෙහිව දිනුවොත් 7.7ක් විතරයි වැඩි වෙන්නේ, පැරදුණොත් 24.3ක් අඩු වෙනවා. Chatbot Arena වගේ තැන්වල මිනිසුන්ගේ votes වලින් තමයි මේ rating හදන්නේ.


## 13. Human evaluation

**Why it exists:** for tone, helpfulness or Sinhala fluency, there is no formula. People decide what "good" means, and every automatic metric is only trusted if it agrees with them.

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

### The kappa paradox with real numbers

Two raters label 100 answers, and 95% of answers are good.

| | Rater 2: good | Rater 2: bad |
|---|---|---|
| **Rater 1: good** | 92 | 3 |
| **Rater 1: bad** | 3 | 2 |

- Observed agreement p_o = (92 + 2)/100 = **0.94** (looks excellent)
- Each rater says "good" 95% of the time. p_e = 0.95 × 0.95 + 0.05 × 0.05 = 0.9025 + 0.0025 = **0.905**
- κ = (0.94 − 0.905)/(1 − 0.905) = 0.035/0.095 = **0.37** (only "fair")

High raw agreement, low kappa: nearly everything is "good", so agreeing by luck is easy, and the rare bad cases are where they disagree. Always report both.

```
 guidelines + examples ─► 2-3 blind raters ─► scores ─► agreement (kappa)
         ▲                                              │
         └────── low agreement? fix the guidelines ◄────┘
```

**Where you'll meet it in real work:** a team building a Sinhala chatbot asks three native speakers to rate 200 answers for fluency. If they disagree a lot, the question "is this fluent?" needs a clearer definition before any model can be judged.

**Common mistakes:**
- Rating without written guidelines or examples.
- Telling raters which model produced which answer.
- Reporting raw agreement only.

**Exam angle:** Cohen's kappa = (p_o − p_e)/(1 − p_e); human agreement is a ceiling for how "correct" any model can look; blind and randomise.

> **සිංහලෙන්:** මිනිස් evaluation කියන්නේ subjective දේවල් වලට (tone, fluency) තියෙන gold standard එක. ඒත් දෙන්නෙක් එකඟ නැත්නම් ප්‍රශ්නේ අපැහැදිලියි. Cohen's kappa එකෙන් අහම්බෙන් එකඟ වීම අයින් කරලා බලනවා. උදාහරණයක් විදිහට උත්තර 100ක් දෙන්නෙක් බලලා 94ක් එකඟ වුණා (94%), ඒත් 95%ක්ම "හොඳයි" කියලා දෙන්නම කියන නිසා අහම්බෙන් එකඟ වෙන්න තියෙන ප්‍රමාණය 90.5%ක්. එතකොට kappa = (0.94-0.905) ÷ (1-0.905) = 0.37ක් විතරයි. ඒ නිසා raw agreement සහ kappa දෙකම report කරන්න. Rater ලාට model එක කවුද කියලා කියන්නත් එපා.


## 14. Faithfulness evaluation

**Why it exists:** a fluent answer can still be false. Faithfulness asks a narrower, checkable question: does the answer stick to the source it was given, or did the model add things from nowhere?

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

### A worked example: claim-by-claim checking

Source (retrieved text): "The shop opens at 9 am and closes at 6 pm. Delivery is free for orders above Rs. 5,000."
Answer: "The shop opens at 9 am and closes at 8 pm. Delivery is free above Rs. 5,000, and there is a branch in Kandy."

| Atomic claim | Supported by the source? |
|---|---|
| Opens at 9 am | Yes |
| Closes at 8 pm | No (source says 6 pm: contradiction) |
| Free delivery above Rs. 5,000 | Yes |
| Has a branch in Kandy | No (not mentioned: unsupported) |

Faithfulness = 2 supported / 4 claims = **0.50**.

Note: "faithful" is not the same as "true in the world". The Kandy branch might really exist, but if the source does not say so, a RAG answer should not claim it.

### Calibration (ECE) with numbers

Split predictions into confidence bins and compare confidence with real accuracy.

| Bin | Share of predictions | Average confidence | Actual accuracy | Gap |
|---|---|---|---|---|
| High | 50% | 0.90 | 0.70 | 0.20 |
| Medium | 50% | 0.60 | 0.60 | 0.00 |

ECE = 0.5 × 0.20 + 0.5 × 0.00 = **0.10**. The model is overconfident when it sounds sure.

**Where you'll meet it in real work:** a hospital's document-summary tool must never state a dose that is not in the patient record. Checking every claim against the record is how that is tested.

**Common mistakes:**
- Confusing "faithful to the source" with "true".
- Checking whole answers instead of splitting them into atomic claims.
- Trusting the model's stated confidence without measuring calibration.

**Exam angle:** faithfulness/groundedness = supported claims ÷ total claims; SelfCheckGPT uses consistency across samples; ECE measures calibration.

> **සිංහලෙන්:** Faithfulness කියන්නේ model එකේ උත්තරේ දීපු source එකට අනුවද තියෙන්නේ කියලා බලන එක. ක්‍රමය: උත්තරේ පුංචි claims වලට කඩලා හැම එකක්ම source එකෙන් තහවුරු වෙනවද බලනවා. උදාහරණයක් විදිහට "කඩේ උදේ 9ට open, රාත්‍රී 8ට close, Rs. 5,000ට වැඩි නම් free delivery, Kandy එකේ branch එකක් තියෙනවා" කියලා model එක කිව්වා. Source එකේ 6ට close කියලා තියෙන නිසා ඒක වැරදියි, Kandy branch එක ගැන source එකේ නෑ. Claims 4න් 2ක් විතරක් support වෙන නිසා faithfulness = 0.5. Model එක "මට විශ්වාසයි" කියද්දී ඇත්තටම ඒ තරම් වතාවක් හරිද කියලා බලන්නේ calibration (ECE) එකෙන්.


## 15. Safety evaluation

**Why it exists:** a model can be accurate and still unsafe. Safety evaluation tries to break the model *before* real users or attackers do.

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

### A worked example: two numbers you must report together

A team tests a support assistant.
- 200 clearly harmful prompts: the model refuses 190. **Refusal rate = 190/200 = 95%.**
- 100 harmless but sensitive-sounding prompts (for example "how do I kill a Python process?"): it wrongly refuses 12. **Over-refusal rate = 12/100 = 12%.**
- 50 known jailbreak attacks: 4 succeed. **Attack success rate (ASR) = 4/50 = 8%.**

```
 stricter ◄──────────────────────────────► more permissive
 high refusal rate                          low refusal rate
 high over-refusal (annoying, useless)      high ASR (harmful content gets out)
            pick the balance that fits your product
```

**Counterfactual bias test:** send the same loan question twice, changing only the name (for example "Nimal" and "Fathima"). If the answers differ in tone or outcome, you found a bias worth fixing.

**Where you'll meet it in real work:** before a bank chatbot goes live, a red team tries prompt injection (hidden instructions in an uploaded document), asks for other customers' details, and tests Sinhala, Tamil and code-mixed messages. Results go in a safety report.

**Common mistakes:**
- Measuring only refusal of harmful prompts and ignoring over-refusal.
- Testing only in English.
- Running the safety test once and never again after a model or prompt update.

**Exam angle:** trustworthy-AI questions cover red-teaming, jailbreak and prompt-injection testing, bias via counterfactuals, toxicity, privacy leakage and the refusal vs over-refusal balance.

> **සිංහලෙන්:** Model එක නිවැරදි වුණාට ආරක්ෂිත නැති වෙන්න පුළුවන්, ඒ නිසා user ලා දැක්කට කලින් අපිම ඒක කඩන්න උත්සාහ කරනවා (red teaming). Refusal rate සහ over-refusal rate දෙකම බලන්න ඕනේ. හානිකර prompts 200න් 190ක් ප්‍රතික්ෂේප කළා නම් 95%ක්, ඒත් "Python process එකක් kill කරන්නේ කොහොමද?" වගේ හානි නැති ප්‍රශ්න 100න් 12ක් වැරදියට ප්‍රතික්ෂේප කළා නම් over-refusal 12%ක්. Jailbreak උත්සාහ 50න් 4ක් සාර්ථක නම් ASR = 8%. Bias බලන්න නම වෙනස් කරලා (නිමල්, ෆාතිමා) එකම ප්‍රශ්නය දෙපාරක් අහලා උත්තර වෙනස්ද බලනවා. සිංහල, දෙමළ, code-mixed messages වලිනුත් test කරන්න.


## 16. Statistics for evals

**Why it exists:** test sets are small samples, and samples are noisy. Statistics tells you whether a score difference is real or just luck, before you ship a change.

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

### Worked example: is 80% vs 76% on 50 questions real?

For prompt A: p = 0.76, n = 50.
- SE = √(0.76 × 0.24 / 50) = √0.003648 = 0.0604
- 95% CI = 0.76 ± 1.96 × 0.0604 = 0.76 ± 0.118 → **[0.64, 0.88]**

Prompt B at 0.80 sits comfortably inside A's interval, so we cannot say B is better.

### How many questions do I need?

To get a 95% interval of about ±3 points at p = 0.80:
n = 1.96² × p(1 − p) / 0.03² = 3.84 × 0.16 / 0.0009 = 0.614 / 0.0009 ≈ **683 questions**.
Halving the width needs four times as many questions.

### McNemar step by step (from the table above)

Discordant questions: B wins 12, A wins 9, total 21.
- Statistic = (|12 − 9| − 1)² / 21 = (2)² / 21 = 4/21 = **0.19**
- A chi-square value this small gives p ≈ 0.66. Not significant, so we cannot claim B is better.

```
 A: 76% ├──────●──────┤  (64% to 88%)
 B: 80%  ├───────●──────┤ (68% to 92%)   heavy overlap → can't tell
```

### Slices: an average can hide a regression

| Slice | Questions | Old prompt | New prompt |
|---|---|---|---|
| English | 140 | 119 right (85%) | 126 right (90%) |
| Sinhala | 60 | 37 right (62%) | 35 right (58%) |
| **All** | 200 | **156 (78%)** | **161 (80.5%)** |

(Illustrative numbers.) Overall improved, but Sinhala users got worse. Always report per slice.

**Where you'll meet it in real work:** before replacing a production prompt, an AI team shows a one-page report: scores with confidence intervals, a paired test, and the worst slices.

**Common mistakes:**
- Declaring a winner from a 2-point difference on 100 questions.
- Trying 20 prompt variants and reporting the best one without confirming on fresh data.
- Reporting a single run of a stochastic system.

**Exam angle:** know standard error, confidence intervals, paired tests, bootstrap and why multiple comparisons inflate false wins.

> **සිංහලෙන්:** Test එකේ ප්‍රශ්න 50ක් විතරයි නම්, 76% සහ 80% අතර වෙනස අහම්බයක් වෙන්න පුළුවන්. Standard error = √(0.76×0.24÷50) = 0.06, ඒ නිසා 95% interval එක 76% ± 12 ක්, ඒ කියන්නේ 64%ත් 88%ත් අතර. 80% ඒ ඇතුළේම තියෙනවා, ඒ නිසා B හොඳයි කියන්න බෑ. ප්‍රශ්න 683ක් විතර තිබුණොත් ±3 ක් ලැබෙනවා. ඒ වගේම සමස්ත ලකුණු හොඳ වුණාට සිංහල ප්‍රශ්න වලට ලකුණු අඩු වෙලා වෙන්න පුළුවන්, ඒ නිසා slice වලින් වෙන වෙනම බලන්න ඕනේ.


## 17. Eval pipeline

**Why it exists:** one-off testing finds today's bugs; an eval pipeline protects you from tomorrow's. It turns "I think it got better" into a repeatable report.

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

### A worked example: one golden-set row and one report

A mobile operator's support bot. One row of the golden set (stored as JSON):

```
{"id": 17, "question": "How do I check my data balance?",
 "expected_facts": ["dial the short code or use the app", "balance shows data and validity"],
 "source_doc": "faq-data-balance",
 "slice": {"language": "English", "topic": "data"}}
```

After a change, the automatic report looks like this (illustrative):

| Check | Before | After | Verdict |
|---|---|---|---|
| Retrieval recall@5 | 0.88 | 0.91 | better |
| Correctness (judge, 200 rows) | 78% | 80.5% | within noise |
| Faithfulness | 0.93 | 0.90 | slightly worse, investigate |
| Valid JSON format | 100% | 100% | same |
| p95 latency | 2.1 s | 2.6 s | worse |
| Cost per request | Rs. 1.8 | Rs. 2.1 | worse |

Then you read the 10 worst failures, group them (3 retrieval misses, 4 invented details, 3 wrong language) and fix the largest group first.

```
 define good ─► golden set ─► metrics ─► automate in CI ─► error analysis
      ▲                                                        │
      └────────── new failures from production ◄───────────────┘
```

**Where you'll meet it in real work:** tools like promptfoo, DeepEval or Inspect run in CI, so a pull request that breaks the bot is blocked automatically, like a failing unit test.

**Common mistakes:**
- Building the golden set only from easy, hand-written questions.
- Only tracking quality and forgetting latency and cost.
- Letting the golden set go stale instead of adding new failures.

**Exam angle:** know the steps (define quality, golden set, metrics, automation, error analysis, feedback loop) and that cheap deterministic checks come before LLM judges, and humans validate the judges.

> **සිංහලෙන්:** Eval pipeline එකක් කියන්නේ "හොඳ වෙලා වගේ" කියන හැඟීම වෙනුවට හැම වෙනස්කමකටම ස්වයංක්‍රීයව ලැබෙන වාර්තාවක්. පියවර: හොඳ කියන්නේ මොකක්ද නිර්වචනය කරනවා, ප්‍රශ්න 100-500ක golden set එකක් හදනවා (ඇත්ත user ලාගේ ප්‍රශ්න, edge cases, ප්‍රහාර ඇතුළුව), metrics තෝරනවා, CI එකේ හැම වෙනස්කමකටම run කරනවා. උදාහරණයක් විදිහට correctness 78% සිට 80.5% වුණාට latency 2.1s සිට 2.6s වුණා නම් ඒක සම්පූර්ණ දිනීමක් නෙවෙයි. අන්තිමට අසාර්ථක උත්තර කියවලා වැඩිම වර්ගය මුලින් හදනවා.


## 18. Online evaluation

**Why it exists:** real users ask things your test set never imagined, and the world changes after launch. Online evaluation watches the live system so problems are found in hours, not months.

Offline tests can't capture everything. In production:
- **Explicit feedback:** thumbs up/down, ratings, comments
- **Implicit signals:** user rephrases the question (dissatisfaction), copies the answer (satisfaction), abandons, escalates to a human, task completion
- **Sampled LLM-judge scoring** of live traffic (e.g. faithfulness on 5% of conversations)
- **Monitoring** quality, safety flags, latency and cost over time; **drift** in the kinds of questions asked (file 28)
- **A/B tests** for changes ([file 07](07-math-probability-statistics.md#20-ab-testing)): randomise users between versions; measure business metrics (resolution rate, CSAT, conversion) with guardrail metrics (latency, cost, complaint rate); watch for novelty effects and peeking
- **Shadow mode / canary releases:** run the new version silently or on a small % of traffic first

---

### A worked example: is version B really better?

An A/B test on a support bot, 1,000 users each:
- Version A resolved 620 chats: p_A = 0.62. Version B resolved 660: p_B = 0.66. Difference = **+4 points**.
- SE of the difference = √(0.62 × 0.38/1000 + 0.66 × 0.34/1000) = √(0.0002356 + 0.0002244) = √0.00046 = 0.0214
- 95% CI = 0.04 ± 1.96 × 0.0214 = 0.04 ± 0.042 → **[−0.002, +0.082]**

The interval includes 0, so the result is promising but not yet conclusive. Keep the test running to the planned size (do not stop the moment it looks good, which is called "peeking").

```
 new version ─► shadow mode (silent) ─► canary 5% ─► 25% ─► 100%
                  compare outputs       watch quality, latency, cost, complaints
                  roll back at any step if a guardrail metric breaks
```

| Signal | Example | Reads as |
|---|---|---|
| Explicit | Thumbs down | Dissatisfied |
| Implicit | User rephrases the same question | Probably not understood |
| Implicit | Chat ends in "talk to an agent" | Bot could not solve it |
| System | p95 latency rises from 2 s to 5 s | Capacity or model problem |

### Models also decay quietly

Even if nothing in your code changes, user questions can drift (for example, new offers or festival-season questions the bot never saw). Unlike an ordinary bug there is no error message; answers just slowly get worse. This is why you monitor distributions of inputs and quality, not only uptime (see [file 28](28-mlops-and-llmops.md)).

**Where you'll meet it in real work:** an online grocery shop samples 5% of live conversations for an LLM-judge faithfulness score and sends a daily alert if it drops below a threshold.

**Common mistakes:**
- Stopping an A/B test the first time the numbers look good.
- Watching only quality and ignoring guardrail metrics such as cost and complaints.
- Releasing to everyone at once with no rollback plan.

**Exam angle:** know explicit vs implicit feedback, A/B tests with guardrail metrics, shadow mode vs canary, and drift monitoring.

> **සිංහලෙන්:** Offline test වලින් හැමදේම අල්ලගන්න බෑ, ඇත්ත user ලා අහන දේවල් වෙනස්. ඒ නිසා live system එකත් බලනවා. Version A පරිශීලකයන් 1,000න් 620ක් විසඳුණා (62%), B 660ක් (66%) කියමු. වෙනස 4 points, ඒත් confidence interval එක -0.2ත් +8.2ත් අතර නිසා 0 ඇතුළත් වෙනවා, ඒ කියන්නේ තාම තහවුරු නෑ. ඒ නිසා test එක අවසන් වෙනකම් බලන්න, "හොඳ වගේ" කියලා මැදදී නතර කරන්න එපා. අලුත් version එක මුලින් 5% users ට විතරක් (canary) දීලා, latency, cost, ප්‍රශ්න ගණන බලලා පස්සේ සියල්ලන්ටම දෙන්න.

```quiz
[
  {"q": "Which statement best explains why evaluating LLMs is harder than evaluating a spam classifier?", "options": ["LLMs are always slower", "LLMs cannot be tested with code at all", "There are many valid outputs, several quality dimensions and non-deterministic generation", "Classifiers do not need test sets"], "answer": 2, "why": "A classifier has one right label, so accuracy works. LLMs can answer correctly in many wordings and must also be judged on safety, faithfulness, format and cost. Speed is not the reason, and code can test many LLM outputs."},
  {"q": "A model assigns probabilities 0.25, 0.25, 0.25, 0.25 to four actual tokens. What is its perplexity?", "options": ["4", "0.25", "1", "1.386"], "answer": 0, "why": "Average cross-entropy = ln 4 = 1.386 and PPL = e^1.386 = 4. The tempting 1.386 is the cross-entropy, not the perplexity; perplexity is exp of it, the effective number of equally likely choices."},
  {"q": "Reference: 'kotte'. Prediction: 'colombo kotte'. What is the token F1?", "options": ["0.5", "1.0", "0", "0.667"], "answer": 3, "why": "Overlap is 1 token. Precision = 1/2 = 0.5, recall = 1/1 = 1.0, F1 = 2 x 0.5 x 1.0 / 1.5 = 0.667. Exact match would be 0, which is the tempting wrong idea that the answer is simply wrong."},
  {"q": "Why can BLEU/ROUGE give a low score to a perfectly good chatbot answer?", "options": ["They only work on code", "They reward word overlap with a reference, not meaning", "They need a GPU", "They always favour longer answers"], "answer": 1, "why": "'The movie was fantastic' vs 'the film was excellent' share only two words, so ROUGE-1 is 0.5 even though the meaning is identical. Length preference is a judge bias, not how these metrics fail."},
  {"q": "You generate n = 10 code samples and c = 3 pass. What is pass@5?", "options": ["0.3", "0.5", "0.917", "1.0"], "answer": 2, "why": "pass@5 = 1 - C(7,5)/C(10,5) = 1 - 21/252 = 0.917. 0.3 is pass@1 (c/n), the tempting answer if you forget k is 5."},
  {"q": "A model scores 90% on a public benchmark but 70% on rewritten versions of the same questions. What is the most likely explanation?", "options": ["Possible contamination: the model memorised the originals", "The rewritten questions are always harder", "The model has low perplexity", "Pairwise judging was used"], "answer": 0, "why": "A large drop on rephrased, equally difficult questions is a classic sign of memorisation of leaked test data. Harder wording alone would not explain a 20-point gap if the model truly understood."},
  {"q": "In pairwise LLM judging, how do you reduce position bias?", "options": ["Always show the better model first", "Use a longer rubric", "Ask for a 1 to 10 score", "Judge each pair in both orders and count only consistent verdicts"], "answer": 3, "why": "Swapping the order exposes a judge that simply prefers the first slot. A longer rubric or numeric scale does not remove position preference, and showing one model first would add bias."},
  {"q": "Two systems score 76% and 80% on the same 50 questions. What is the best conclusion?", "options": ["The 80% system is clearly better", "The difference is within noise; use more examples and a paired test", "The 76% system is clearly better", "Accuracy cannot be used for LLMs"], "answer": 1, "why": "With n = 50 the 95% interval is about +/- 12 points, so 76% and 80% overlap heavily. The tempting 'the higher number wins' ignores sampling noise."}
]
```


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
