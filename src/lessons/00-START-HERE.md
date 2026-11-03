# AI Zero to Hero (English Edition): Start Here

Welcome. This is a complete, self-contained course that takes you from **absolute zero** to being able to work as an intern (and grow beyond) in:

- **Data Science**: getting insight from data
- **Machine Learning (ML)**: computers learning patterns from examples
- **Deep Learning (DL)**: ML with neural networks
- **Large Language Models (LLMs)**: models like ChatGPT, Claude, Gemini, Llama
- **Generative AI (GenAI)**: AI that creates text, images, audio, video, code

You do **not** need any previous knowledge. You don't need to be "good at maths". Every idea is explained in plain English, with an everyday analogy, a worked example with real numbers, and (where useful) a few lines of code.

---

## The one rule of this course: "Zero to Zero alignment"

> **No concept is ever used before it is explained.**

- Every file begins with a **"Before you start"** box listing which earlier files it depends on.
- When a file uses a term from earlier, it links back to where that term was taught, e.g. *"a [vector](05-math-linear-algebra.md#2-vectors)"*.
- Every file ends with a **"New words in this file"** list, so you always know what you've just learned.
- [31-glossary.md](31-glossary.md) lists every term in the course A to Z, with a one-line meaning and a link to the file that teaches it.

If you ever meet a word you don't know, look it up in the glossary. If it's not there, that's a bug in the course.

---

## How each file is built

Every concept follows the same pattern:

1. **Plain-English idea**: what it is, in one or two sentences
2. **Analogy**: an everyday picture to hang the idea on
3. **Worked example**: real numbers, step by step
4. **Code** (optional): short Python you can run
5. **Common mistakes / gotchas**
6. **Check yourself**: questions with answers hidden underneath

---

## The roadmap (follow in order)

```
PART A: FOUNDATIONS                PART B: DATA SCIENCE
01 Big picture & what data is  ──► 08 NumPy & Pandas
02 Python programming              09 Data visualization
03 Tools: terminal, Git, SQL, APIs 10 Data science workflow (clean, EDA, features)
04 Maths 1: numbers & functions
05 Maths 2: linear algebra          PART C: MACHINE LEARNING
06 Maths 3: calculus           ──► 11 ML fundamentals
07 Maths 4: probability & stats     12 Supervised learning algorithms
                                    13 Evaluation metrics & tuning
                                    14 Unsupervised learning & more
        │
        ▼
PART D: DEEP LEARNING              PART E: NLP & LLMs
15 Neural networks             ──► 18 NLP fundamentals
16 CNNs & computer vision           19 Transformers
17 Sequence models & attention      20 How LLMs work
                                    21 Training, fine-tuning & alignment of LLMs
        │
        ▼
PART F: GENERATIVE AI APPS         PART G: PRODUCTION, SAFETY & CAREER
22 Prompt engineering          ──► 26 Evaluating LLMs
23 Embeddings, vector DBs & RAG     27 Inference & serving
24 AI agents                        28 MLOps & LLMOps
25 Generative models: images,       29 Responsible AI: fairness, privacy, security
   audio, multimodal                30 Advanced topics & career roadmap
                                    31 Glossary (A to Z)
```

### File list

| # | File | What you'll be able to do after it |
|---|------|------------------------------------|
| 01 | [Big picture & data](01-big-picture-and-data.md) | Explain what AI/ML/DL/LLM/GenAI/Data Science are and how they relate; understand data types and file formats |
| 02 | [Python programming](02-python-programming.md) | Write Python programs: variables, lists, loops, functions, classes, packages |
| 03 | [Developer tools](03-developer-tools.md) | Use the terminal, Git/GitHub, SQL queries, JSON and REST APIs |
| 04 | [Maths 1: numbers & functions](04-math-numbers-and-functions.md) | Read formulas, use exponents, logs, summation sign, functions and graphs |
| 05 | [Maths 2: linear algebra](05-math-linear-algebra.md) | Work with vectors, matrices, dot products, tensors (the language of AI) |
| 06 | [Maths 3: calculus](06-math-calculus.md) | Understand slopes, derivatives, gradients, the chain rule: how models learn |
| 07 | [Maths 4: probability & statistics](07-math-probability-statistics.md) | Use mean, variance, distributions, Bayes, hypothesis tests, entropy |
| 08 | [NumPy & Pandas](08-numpy-and-pandas.md) | Load, slice, filter, group and join tabular data in Python |
| 09 | [Data visualization](09-data-visualization.md) | Pick the right chart and draw it with Matplotlib/Seaborn |
| 10 | [Data science workflow](10-data-science-workflow.md) | Collect, clean, explore and engineer features from real data |
| 11 | [ML fundamentals](11-ml-fundamentals.md) | Explain training, loss, gradient descent, overfitting, train/test splits |
| 12 | [Supervised algorithms](12-supervised-learning-algorithms.md) | Use linear/logistic regression, trees, kNN, SVM, random forests, boosting |
| 13 | [Evaluation & tuning](13-evaluation-metrics-and-tuning.md) | Measure models properly (precision, recall, F1, ROC-AUC, RMSE) and tune them |
| 14 | [Unsupervised & more](14-unsupervised-learning-and-more.md) | Cluster, reduce dimensions, detect anomalies, recommend, forecast, explain |
| 15 | [Neural networks](15-neural-networks.md) | Build and train a neural network in PyTorch; understand backprop and optimizers |
| 16 | [CNNs & vision](16-cnns-and-computer-vision.md) | Understand convolutions, classic CNNs, transfer learning, detection |
| 17 | [Sequence models & attention](17-sequence-models-and-attention.md) | Understand RNNs, LSTMs, seq2seq and where attention came from |
| 18 | [NLP fundamentals](18-nlp-fundamentals.md) | Process text, TF-IDF, word embeddings, NLP tasks, Hugging Face |
| 19 | [Transformers](19-transformers.md) | Explain self-attention, Q/K/V, multi-head attention, encoder vs decoder |
| 20 | [How LLMs work](20-how-llms-work.md) | Explain tokens, context windows, next-token prediction, sampling, hallucination |
| 21 | [Training LLMs](21-training-finetuning-alignment.md) | Explain pretraining, SFT, LoRA/QLoRA, RLHF/DPO, quantization, MoE |
| 22 | [Prompt engineering](22-prompt-engineering.md) | Write strong prompts, get structured output, call LLM APIs, defend against injection |
| 23 | [Embeddings, vector DBs & RAG](23-embeddings-vector-databases-rag.md) | Build a Retrieval-Augmented Generation system end to end |
| 24 | [AI agents](24-ai-agents.md) | Build tool-using agents; understand ReAct, memory, MCP, multi-agent systems |
| 25 | [Generative models & multimodal](25-generative-models-and-multimodal.md) | Explain VAEs, GANs, diffusion, CLIP, vision-language models, speech |
| 26 | [Evaluating LLMs](26-evaluating-llms.md) | Measure LLM quality: perplexity, BLEU/ROUGE, benchmarks, LLM-as-judge |
| 27 | [Inference & serving](27-inference-and-serving.md) | Explain latency, throughput, KV cache, batching, quantization, run models locally |
| 28 | [MLOps & LLMOps](28-mlops-and-llmops.md) | Deploy, version, monitor and maintain models in production |
| 29 | [Responsible AI](29-responsible-ai.md) | Handle bias, fairness, privacy, security, regulation |
| 30 | [Advanced topics & career](30-advanced-topics-and-career.md) | Know RL, causal inference, interpretability, and plan your career |
| 31 | [Glossary](31-glossary.md) | Look up any term in the course |

---

## How long will this take?

Roughly, if you study **1 to 2 hours a day**:

| Part | Files | Time |
|------|-------|------|
| A: Foundations | 01 to 07 | 6 to 8 weeks |
| B: Data Science | 08 to 10 | 3 to 4 weeks |
| C: Machine Learning | 11 to 14 | 5 to 6 weeks |
| D: Deep Learning | 15 to 17 | 4 to 5 weeks |
| E: NLP & LLMs | 18 to 21 | 4 to 6 weeks |
| F: GenAI Apps | 22 to 25 | 4 to 5 weeks |
| G: Production & Career | 26 to 30 | 4 to 6 weeks |

**About 7 to 9 months** to cover everything properly. You can be useful as an intern well before that. After Part C you can do junior data science work. After Part F you can build GenAI apps.

### Shortcuts by goal

You should still read Part A (at least 01, 02, 04), because everything builds on it. Then:

- **"I want to be a Data Analyst / Data Scientist"**: 01 to 14, then 28 and 29
- **"I want to be an ML Engineer"**: 01 to 17, then 27 and 28
- **"I want to build GenAI / LLM apps fast"**: 01, 02, 03, 04, 05 (vectors only), 11 (first half), 15 (first half), 18, 19, 20, 22, 23, 24, then 26 to 29
- **"I want to research / train LLMs"**: everything, in order

---

## How to study (this matters more than you think)

1. **Type the code yourself.** Don't copy-paste. Your fingers learn too.
2. **Do the "Check yourself" questions before peeking at answers.** Getting things wrong while practising is the fastest way to learn.
3. **Explain it out loud.** If you can explain a concept to a friend (or a rubber duck) in simple words, you understand it.
4. **Build small projects.** Each Part ends with a suggested mini project. Do them. They become your portfolio.
5. **Don't get stuck on maths.** If a formula looks scary, read the plain-English explanation and the worked example. The intuition matters more than the symbols.
6. **Revisit.** It's normal to understand 60% the first time. Come back after a later file and it will click.

---

## Setting up your computer (do this once)

You'll need Python. The easiest options:

**Option 1: No install (recommended to begin with):** use [Google Colab](https://colab.research.google.com). It's free, runs in your browser, has Python and most libraries pre-installed, and even gives you a free GPU (a chip that makes AI fast, explained in file 15).

**Option 2: On your computer:**
1. Install Python 3.11 or newer from [python.org](https://www.python.org/downloads/)
2. Install [VS Code](https://code.visualstudio.com/) (a code editor)
3. Later, file 02 shows you how to create a "virtual environment" and install libraries.

Ready? Open [01-big-picture-and-data.md](01-big-picture-and-data.md).
