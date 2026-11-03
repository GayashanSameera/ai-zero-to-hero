# 30: Advanced Topics and Your Career Roadmap

> **Before you start:** Ideally everything up to [29](29-responsible-ai.md). In particular: [07](07-math-probability-statistics.md) (Bayes, confounders, A/B tests, expected value), [11](11-ml-fundamentals.md#2-types-of-machine-learning) (reinforcement learning vocabulary), [13](13-evaluation-metrics-and-tuning.md#12-hyperparameter-tuning) (Bayesian optimisation), [15](15-neural-networks.md) (neural networks, PyTorch), [17](17-sequence-models-and-attention.md) (RNNs), [19](19-transformers.md) (Transformers, nanoGPT), [21](21-training-finetuning-alignment.md) (PPO, RLHF, GRPO, distributed training).
>
> **After this file you can:** understand the basics of reinforcement learning (Q-learning, policy gradients, PPO), causal inference, Bayesian ML, graph neural networks, state-space models and interpretability research; read research papers efficiently; and follow a concrete plan to build a portfolio and get your first job or internship.

---

## Table of contents

**Part 1: Advanced topics**
1. [Reinforcement learning basics](#1-reinforcement-learning-basics)
2. [Q-learning (worked example)](#2-q-learning)
3. [Deep RL: DQN, policy gradients, actor-critic, PPO](#3-deep-rl)
4. [Causal inference](#4-causal-inference)
5. [Bayesian machine learning](#5-bayesian-ml)
6. [Graph neural networks](#6-graph-neural-networks)
7. [Beyond Transformers: state-space models and hybrids](#7-state-space-models)
8. [Mechanistic interpretability and AI safety research](#8-interpretability-and-safety-research)
9. [Build a GPT from scratch (the best advanced exercise)](#9-build-a-gpt-from-scratch)
10. [Other frontiers worth knowing](#10-other-frontiers)
11. [How to read research papers](#11-reading-papers)
12. [How to stay current](#12-staying-current)

**Part 2: Career**
13. [Roles and what they need](#13-roles)
14. [Skills matrix: what an intern should know](#14-skills-matrix)
15. [Portfolio projects that get interviews](#15-portfolio-projects)
16. [CV, GitHub and LinkedIn](#16-cv-github-linkedin)
17. [Interview preparation](#17-interview-preparation)
18. [Certifications](#18-certifications)
19. [Your first 90 days as an intern](#19-your-first-90-days-as-an-intern)
20. [Learning resources](#20-learning-resources)
21. [Final words](#21-final-words)
22. [New words in this file](#22-new-words-in-this-file)

---

# Part 1: Advanced topics

## 1. Reinforcement learning basics

**Reinforcement learning (RL)** ([file 11](11-ml-fundamentals.md#2-types-of-machine-learning)): an **agent** learns by **trial and error**, taking **actions** in an **environment** to maximise total **reward**.

```
         ┌────────── action aₜ ───────────┐
         │                                 ▼
     [ Agent ]                       [ Environment ]
         ▲                                 │
         └──── state sₜ₊₁, reward rₜ₊₁ ────┘
```

**Examples:** game-playing (AlphaGo, Atari), robotics, recommendation (long-term engagement), ad bidding, data-centre cooling, LLM alignment (RLHF, [file 21](21-training-finetuning-alignment.md#14-rlhf)) and reasoning training (GRPO, [file 21](21-training-finetuning-alignment.md#16-rl-for-reasoning)).

### Markov Decision Process (MDP)

The formal framework:
- **States (S):** situations the agent can be in (a position on a board)
- **Actions (A):** what it can do (move left/right/up/down)
- **Transition probabilities P(s' | s, a):** where an action leads (may be random)
- **Reward R(s, a):** immediate feedback (+10 for reaching the goal, −1 per step)
- **Discount factor γ (gamma),** 0 to 1: how much future rewards count compared with immediate ones

**Markov property:** the future depends only on the **current** state, not on how you got there.

### Key concepts

- **Policy π(a | s):** the agent's strategy: which action to take in each state
- **Return:** total discounted future reward: G = r₁ + γr₂ + γ²r₃ + ...
  **Example:** rewards [1, 1, 10] with γ = 0.9: G = 1 + 0.9 + 0.81 × 10 = **10.0**
- **Value function V(s):** expected return starting from state s (how good is this state?)
- **Q-function Q(s, a):** expected return taking action a in state s, then acting well (how good is this action here?)
- **Exploration vs exploitation:** try new actions to discover better ones (explore) vs use the best known action (exploit). The classic strategy is **ε-greedy:** with probability ε (e.g. 0.1) pick a random action, otherwise the best known one.

**Analogy:** choosing a restaurant: always going to your favourite (exploit) vs trying a new one that might be better (explore).

**The credit assignment problem:** a reward may come long after the actions that caused it (you win a chess game after 40 moves; which moves were good?). Discounting and value functions help spread credit backwards.

---

## 2. Q-learning

**Q-learning** learns Q(s, a) values from experience using this update (a form of the **Bellman equation**):

```
Q(s, a) ← Q(s, a) + α × [ r + γ × max_a' Q(s', a') − Q(s, a) ]
                          └────── target ────────┘
                         └──────────── TD error ─────────────┘
```

- α = learning rate; r = reward received; s' = next state; max_a' Q(s', a') = value of the best action from the next state
- **TD (temporal difference) error:** the gap between the new estimate (target) and the old one

### Worked example

A tiny corridor: states A → B → C (goal). Actions: "right" (and "left"). Reaching C gives reward +10; every other step gives 0. γ = 0.9, α = 0.5. All Q values start at 0.

**Episode 1:**
- In B, take "right" → reach C, r = 10. Q(B, right) ← 0 + 0.5 × (10 + 0.9 × 0 − 0) = **5**
- (Earlier, in A, "right" → B with r = 0: Q(A, right) ← 0 + 0.5 × (0 + 0.9 × max Q(B, ·) − 0); at that moment Q(B, ·) was still 0, so it stays **0**)

**Episode 2:**
- In A, "right" → B, r = 0: Q(A, right) ← 0 + 0.5 × (0 + 0.9 × 5 − 0) = **2.25** ← value propagates backwards!
- In B, "right" → C, r = 10: Q(B, right) ← 5 + 0.5 × (10 − 5) = **7.5**

Over many episodes, Q(B, right) → 10 and Q(A, right) → 9 (= 0.9 × 10). The agent learns "go right".

```python
import numpy as np
Q = np.zeros((3, 2))                # states A, B, C × actions left, right
alpha, gamma, eps = 0.5, 0.9, 0.1
for episode in range(200):
    s = 0
    while s != 2:
        a = np.random.randint(2) if np.random.rand() < eps else Q[s].argmax()
        s2 = min(s + 1, 2) if a == 1 else max(s - 1, 0)
        r = 10 if s2 == 2 else 0
        Q[s, a] += alpha * (r + gamma * Q[s2].max() - Q[s, a])
        s = s2
print(Q)    # right-actions approach [9, 10]
```

A table works for small problems. For huge state spaces (images, games), we use neural networks.

---

## 3. Deep RL

| Method | Idea |
|---|---|
| **DQN (Deep Q-Network, 2013/2015)** | A neural network approximates Q(s, a) from raw inputs (e.g. game pixels). Tricks: **experience replay** (store past transitions and train on random samples, breaking correlations) and a **target network** (a slowly updated copy for stable targets). Learned to play many Atari games from pixels. |
| **Policy gradient (REINFORCE)** | Learn the policy directly: increase the probability of actions that led to high returns, decrease those that led to low returns. Works with continuous actions; high variance. |
| **Actor-critic** | An **actor** (policy) chooses actions; a **critic** (value function) estimates how good things are, reducing variance via the **advantage** A = (actual return − expected value): "how much better than expected was this action?" |
| **PPO (Proximal Policy Optimization)** | Actor-critic with a **clipped** objective that prevents too-large policy updates. Stable and widely used, including in RLHF ([file 21](21-training-finetuning-alignment.md#14-rlhf)). |
| **GRPO** | PPO-like but uses **group-relative** advantages instead of a critic ([file 21](21-training-finetuning-alignment.md#16-rl-for-reasoning)) |
| **Model-based RL** | Learn a model of the environment and plan with it (e.g. AlphaZero/MuZero combine learning with **Monte Carlo Tree Search**) |
| **Offline RL** | Learn from a fixed dataset of past experience without interacting (useful where exploration is dangerous, e.g. healthcare) |

**Multi-armed bandits:** the simplest RL setting (one state; choose among options to maximise reward), used for A/B testing allocation, ad selection and recommendations ([file 28](28-mlops-and-llmops.md#15-safe-rollouts)).

**Tools:** **Gymnasium** (environments), Stable-Baselines3 (algorithms), TRL (RL for LLMs).

**Challenges:** sample inefficiency (needs lots of experience), reward design (agents exploit badly specified rewards: **reward hacking**, [file 21](21-training-finetuning-alignment.md#14-rlhf)), instability, sim-to-real gaps in robotics.

---

## 4. Causal inference

**Correlation is not causation** ([file 07](07-math-probability-statistics.md#15-correlation-is-not-causation)). Many business questions are causal: "Did the discount **cause** customers to stay?", "What **would happen** if we raised prices?" Standard ML predicts; it doesn't answer "what if".

### Key ideas

- **Treatment:** the intervention (a discount, a new feature, a drug)
- **Outcome:** what we measure (retention, revenue, recovery)
- **Potential outcomes / counterfactuals:** for each person, the outcome **with** treatment and **without**. We only ever see one of them (**the fundamental problem of causal inference**).
- **Average Treatment Effect (ATE):** average of (outcome with treatment − outcome without) across the population
- **Confounder:** affects both treatment and outcome ([file 07](07-math-probability-statistics.md#15-correlation-is-not-causation)), creating spurious association

**Example of confounding:** customers who received a loyalty discount churned less. But the discount was offered mostly to long-tenure customers, who churn less anyway. Tenure is a **confounder**; a naive comparison overstates the discount's effect.

### Causal diagrams (DAGs)

Draw variables as nodes and causes as arrows ([DAG, file 28](28-mlops-and-llmops.md#11-pipelines-and-orchestration)):

```
   Tenure ──────► Churn
     │              ▲
     ▼              │
   Discount ────────┘
```

DAGs make assumptions explicit and tell you which variables to adjust for.

### Methods

| Method | Idea |
|---|---|
| **Randomised controlled trials / A/B tests** | Randomisation balances confounders: the gold standard ([file 07](07-math-probability-statistics.md#20-ab-testing)) |
| **Regression adjustment** | Control for confounders in a model |
| **Propensity score methods** | Estimate each unit's probability of receiving treatment from its features; match or weight treated and untreated units with similar propensities |
| **Difference-in-differences (DiD)** | Compare the change over time in a treated group vs an untreated group (assumes parallel trends otherwise) |
| **Instrumental variables** | Use a variable that affects treatment but affects the outcome only through treatment |
| **Regression discontinuity** | Compare units just above vs just below a cut-off (e.g. a scholarship given at exactly 75 marks) |
| **Synthetic control** | Build a weighted combination of untreated units that mimics the treated unit before the intervention |
| **Uplift modelling / CATE** | Predict the treatment effect **per individual** (who will respond to a discount?) so you target only those who'd change their behaviour |

**DiD worked example:** a new app feature launched in Colombo but not Kandy. Weekly orders: Colombo 1,000 → 1,300 (+300); Kandy 800 → 900 (+100). DiD estimate = 300 − 100 = **+200 orders/week** caused by the feature (assuming both cities would otherwise have trended alike).

**Tools:** DoWhy, EconML, CausalML.

---

## 5. Bayesian ML

**Bayesian thinking** ([Bayes' theorem, file 07](07-math-probability-statistics.md#9-bayes-theorem)): treat unknown parameters as **probability distributions**, start with a **prior** belief, and update it with data to get a **posterior**.

**Why it's useful:**
- **Uncertainty estimates:** not just "the price will be 250k" but "240k to 265k with 90% probability", which is crucial for decisions and small data
- **Incorporates prior knowledge** (expert beliefs, earlier studies)
- Works well with **small data**

| Concept | Meaning |
|---|---|
| **Prior → posterior** | Belief before → after seeing data |
| **Conjugate priors** | Prior/likelihood pairs where the posterior has a simple formula (e.g. Beta prior + coin flips → Beta posterior) |
| **MCMC** (Markov Chain Monte Carlo) | Sampling algorithms to approximate complex posteriors |
| **Variational inference** | Approximate the posterior with a simpler distribution by optimisation (the same idea as the VAE, [file 25](25-generative-models-and-multimodal.md#4-vaes)) |
| **Gaussian Processes (GPs)** | Bayesian model over **functions**: gives predictions with uncertainty bands; great for small data |
| **Bayesian optimisation** | Uses a GP (or similar) to choose which hyperparameters to try next ([file 13](13-evaluation-metrics-and-tuning.md#12-hyperparameter-tuning)) |
| **Bayesian neural networks, MC dropout, deep ensembles** | Ways to get uncertainty from deep learning (e.g. keep dropout on at inference and run several times; or train several models) |

**Beta-binomial worked example:** you believe a new ad's click rate is around 5% (prior Beta(5, 95), like having seen 5 clicks in 100 views). You observe 30 clicks in 200 views. Posterior = Beta(5 + 30, 95 + 170) = Beta(35, 265) → posterior mean = 35/300 ≈ **11.7%**: pulled between the prior (5%) and the data (15%), weighted by how much evidence each represents.

**Tools:** PyMC, NumPyro, Stan, scikit-learn's GaussianProcessRegressor.

---

## 6. Graph neural networks

Many datasets are **graphs** ([file 02](02-python-programming.md#22-data-structures-you-should-know)): social networks (users + friendships), molecules (atoms + bonds), transport networks, knowledge graphs ([GraphRAG, file 23](23-embeddings-vector-databases-rag.md#17-advanced-rag)), transaction networks (accounts + transfers, useful for fraud rings).

**GNNs (Graph Neural Networks)** learn from graph structure using **message passing:** each node updates its embedding by aggregating its neighbours' embeddings, repeated over several layers (so information spreads several hops).

```
Layer update for node v:
h_v_new = UPDATE( h_v , AGGREGATE( h_u for each neighbour u of v ) )
```

**Tasks:** node classification (is this account fraudulent?), link prediction (will these users connect? which drug targets which protein?), graph classification (is this molecule toxic?).

**Architectures:** GCN, GraphSAGE, GAT (graph attention). **Libraries:** PyTorch Geometric, DGL.

---

## 7. State-space models

Transformers' attention costs O(n²) in sequence length ([file 19](19-transformers.md#19-the-cost-of-attention)), and the KV cache grows with context ([file 20](20-how-llms-work.md#12-the-kv-cache)).

**State-space models (SSMs)** like **Mamba** process sequences with a **fixed-size hidden state**, like an RNN ([file 17](17-sequence-models-and-attention.md#3-recurrent-neural-networks)), but:
- **Selective:** the state update depends on the input, so the model can choose what to remember or forget (like LSTM gates, [file 17](17-sequence-models-and-attention.md#7-lstm))
- **Trainable in parallel** using a **parallel scan** algorithm, unlike classic RNNs

**Benefits:** linear-time processing O(n); constant memory per token at inference (no growing KV cache) → fast for very long sequences.
**Weaknesses:** a fixed-size state can't perfectly recall arbitrary details from far back (e.g. exact copying), where attention excels.

**Hybrids** (mixing some attention layers with many SSM layers, e.g. Jamba, NVIDIA's Nemotron-H, and others) aim to get the best of both. **Linear attention** variants and **RWKV** pursue similar goals.

---

## 8. Interpretability and safety research

### Mechanistic interpretability

The goal: **reverse-engineer** what computations happen inside neural networks, like understanding a compiled program.

- **Features and superposition:** models represent more concepts than they have neurons by overlapping them ("superposition"), so individual neurons are often **polysemantic** (respond to unrelated things)
- **Sparse autoencoders (SAEs):** trained on a model's activations to decompose them into many **interpretable features** (e.g. a feature for "Golden Gate Bridge", "code bugs", "deception"), which can then be **steered** (turned up or down) to change behaviour
- **Circuits:** small subnetworks implementing specific algorithms (e.g. **induction heads** for in-context copying, [file 19](19-transformers.md#9-multi-head-attention))
- **Probing:** training simple classifiers on hidden states to test what information they encode ([file 29](29-responsible-ai.md#7-transparency-and-explainability))
- **Activation patching / causal tracing:** swapping activations between runs to find which components cause a behaviour (e.g. where a fact like "Eiffel Tower → Paris" is stored)
- **Logit lens:** reading intermediate layers' representations through the output head to see predictions forming

### AI safety and alignment research

As AI systems get more capable, ensuring they reliably do what we intend becomes harder:
- **Scalable oversight:** how can humans supervise AI on tasks too complex for humans to judge directly? (Ideas: AI-assisted evaluation, debate, decomposition)
- **Reward hacking / specification gaming** ([file 21](21-training-finetuning-alignment.md#14-rlhf))
- **Robustness** to adversarial inputs and distribution shift
- **Honesty and deception:** detecting whether models say what they "believe"; **CoT faithfulness**
- **Dangerous capability evaluations:** testing for misuse risks (cyber, bio, autonomous replication)
- **Governance** and **responsible scaling policies** ([file 29](29-responsible-ai.md#17-regulation-and-governance))

Organisations doing this work include frontier AI labs and research groups (such as Anthropic, Google DeepMind, OpenAI, independent institutes, and government AI safety/security institutes).

---

## 9. Build a GPT from scratch

**The single most valuable advanced exercise.** Following Andrej Karpathy's "Let's build GPT" video and **nanoGPT** repository:

1. **Data:** download a small text corpus (e.g. Shakespeare, ~1 MB; or a collection of Sinhala text)
2. **Tokeniser:** start with characters ([file 18](18-nlp-fundamentals.md#4-tokenisation)), then implement BPE yourself ([file 20](20-how-llms-work.md#3-bpe-step-by-step); Karpathy's "minbpe")
3. **Bigram baseline:** a model that predicts the next character from the current one only
4. **Self-attention head** → **multi-head** → **feed-forward** → **residuals + LayerNorm** → stack blocks ([file 19 code](19-transformers.md#21-code-from-scratch))
5. **Training loop** with AdamW, LR warmup + cosine decay, gradient clipping, mixed precision ([file 15](15-neural-networks.md))
6. **Generation** with temperature and top-k ([file 20](20-how-llms-work.md#10-sampling))
7. **Experiments:** plot loss curves; vary model size and data; observe overfitting; compute parameter counts with the 12d² rule
8. Optional: add RoPE, RMSNorm, SwiGLU, GQA ([file 19](19-transformers.md)); a KV cache; fine-tune your mini-model with SFT on a tiny instruction dataset

After this, every LLM paper will make much more sense.

---

## 10. Other frontiers

- **AutoML:** automating model selection and tuning (AutoGluon, H2O, FLAML)
- **Time-series foundation models:** pretrained forecasters (e.g. TimesFM, Chronos, Moirai) that forecast new series zero-shot ([file 14](14-unsupervised-learning-and-more.md#13-time-series-forecasting))
- **Tabular foundation models** (e.g. TabPFN) for small tabular datasets
- **World models and video prediction** for planning and robotics
- **Embodied AI and robotics:** vision-language-action models controlling robots; sim-to-real transfer
- **AI for science:** protein structure prediction (AlphaFold), materials discovery, weather forecasting (GraphCast and others), drug discovery
- **On-device AI:** small models running privately on phones and laptops
- **Synthetic data and self-improvement:** models generating and verifying their own training data ([file 21](21-training-finetuning-alignment.md#3-synthetic-data))
- **Long-horizon agents:** agents working for hours on complex tasks ([file 24](24-ai-agents.md))
- **Multimodal everything:** native audio/video/image understanding and generation in one model ([file 25](25-generative-models-and-multimodal.md))

---

## 11. Reading papers

Most AI research is published freely on **arXiv** (arxiv.org). New papers appear daily.

### The three-pass method

1. **Pass 1 (5 to 10 min):** title, abstract, introduction, section headings, figures, conclusion. Ask: what problem? what's the key idea? what's the main result? Is it relevant to me?
2. **Pass 2 (~1 hour):** read the whole paper, skipping heavy maths. Understand figures, tables, experiments, baselines. Note what you don't understand.
3. **Pass 3 (several hours, only for important papers):** work through the maths; re-implement key parts; think about weaknesses and extensions.

### Questions to ask

- What exactly is new compared with prior work?
- What are the baselines? Are comparisons fair (same data, compute, tuning)?
- How big are the improvements? Is there uncertainty reported (error bars, multiple seeds, [file 26](26-evaluating-llms.md#16-statistics-for-evals))?
- **Ablation studies:** experiments removing one component at a time to show which parts matter
- Limitations? Would it work on my data?

### Tips

- Use the maths cheat sheets in files 04 to 07 and the [glossary](31-glossary.md) for notation
- Read with code: many papers have official repositories (search the title + "GitHub", or the Hugging Face "Papers" pages)
- Read survey papers to get an overview of a field
- Start with famous, well-explained papers: "Attention Is All You Need", BERT, GPT-3 ("Language Models are Few-Shot Learners"), InstructGPT, LoRA, Chinchilla, DDPM, CLIP, RAG, ReAct, DPO

---

## 12. Staying current

The field moves extremely fast. Don't try to follow everything.

- **Newsletters and blogs:** The Batch (DeepLearning.AI), Import AI, Simon Willison's blog, Sebastian Raschka's newsletter, Chip Huyen's blog, Lilian Weng's blog (excellent technical deep dives), Hugging Face blog, NVIDIA technical blog, provider engineering blogs (Anthropic, OpenAI, Google)
- **Videos:** Andrej Karpathy (Neural Networks: Zero to Hero), 3Blue1Brown (neural network and Transformer visualisations), StatQuest (clear statistics/ML explanations), Yannic Kilcher (paper reviews)
- **Communities:** Hugging Face forums/Discord, Kaggle, local meetups and AI communities, university clubs
- **Hands-on:** try new open models on Hugging Face/Ollama; reproduce small results

**Rule:** foundations (Parts A to D of this course) change slowly and pay off for years. Tools and model names change monthly. Invest most in foundations; learn tools as needed.

---

# Part 2: Career

## 13. Roles

From [file 01](01-big-picture-and-data.md#14-jobs-in-this-field), in more detail:

| Role | Day-to-day | Must-have skills | Course files |
|---|---|---|---|
| **Data Analyst** | SQL queries, dashboards, reports, answering business questions | SQL, Excel, Pandas, visualisation, statistics basics, communication | 01 to 10 |
| **Data Scientist** | Analysis, experiments (A/B tests), predictive models, insights | + statistics, ML (scikit-learn, boosting), feature engineering, evaluation, storytelling | 01 to 14, 28, 29 |
| **Data Engineer** | Build reliable data pipelines and warehouses | Python, SQL, Spark, Airflow, cloud, data modelling | 02, 03, 08, 10, 28 |
| **ML Engineer** | Train, deploy, scale and monitor models | + software engineering, PyTorch, MLOps, Docker, APIs, cloud | 01 to 17, 27, 28 |
| **AI / LLM Engineer** | Build applications on LLMs: RAG, agents, evaluation, prompts | Python, APIs, prompt engineering, embeddings/vector DBs, evaluation, LLMOps, security | 01 to 05, 11, 15, 18 to 29 |
| **MLOps / AI Platform Engineer** | Infrastructure for training and serving | Kubernetes, Docker, CI/CD, GPUs, serving engines, monitoring | 03, 27, 28 |
| **Research Engineer / Scientist** | New models and methods; large-scale training | Deep maths, PyTorch, distributed training, papers, experiments | All, especially 15 to 21, 30 |
| **AI Product Manager** | Decide what to build, define success, coordinate | Product sense, AI capabilities and limits, metrics, ethics | 01, 11, 13, 20, 22, 26, 29 |
| **Applied AI / Solutions Engineer** | Help customers use AI products | Communication, prototyping, APIs, RAG/agents | 01, 03, 20 to 24, 26 |

**Advice for interns:** pick one target role, but keep a T-shaped profile: **broad** understanding of the whole field (this course) + **deep** skills in one area (your projects).

---

## 14. Skills matrix

What an intern-level candidate should be able to **show**:

| Area | Intern level |
|---|---|
| **Python** | Write clean functions/classes; use Pandas/NumPy fluently; read error messages; virtual environments ([files 02](02-python-programming.md), [08](08-numpy-and-pandas.md)) |
| **SQL** | JOINs, GROUP BY, window functions ([file 03](03-developer-tools.md)) |
| **Git** | Branches, commits, pull requests ([file 03](03-developer-tools.md)) |
| **Statistics** | Mean/median/std, distributions, hypothesis tests, A/B tests, correlation vs causation ([file 07](07-math-probability-statistics.md)) |
| **ML** | Train/val/test, overfitting, cross-validation, metrics, pipelines, boosting ([files 11 to 14](11-ml-fundamentals.md)) |
| **Deep learning** | Write a PyTorch training loop; transfer learning ([files 15](15-neural-networks.md), [16](16-cnns-and-computer-vision.md)) |
| **LLMs** | Explain tokens, attention, sampling, hallucination; call APIs; structured outputs ([files 19 to 22](19-transformers.md)) |
| **GenAI apps** | Build a RAG system with evaluation; a simple agent with tools ([files 23](23-embeddings-vector-databases-rag.md), [24](24-ai-agents.md), [26](26-evaluating-llms.md)) |
| **Deployment** | FastAPI + Docker; basic cloud ([file 28](28-mlops-and-llmops.md)) |
| **Responsible AI** | Spot bias/privacy/security risks; know OWASP LLM Top 10 ([file 29](29-responsible-ai.md)) |
| **Communication** | Explain a project's problem, approach, results and limitations to non-experts ([file 09](09-data-visualization.md#15-storytelling-and-dashboards)) |

---

## 15. Portfolio projects

**Quality beats quantity.** Three solid, well-documented projects beat ten tutorial copies.

### What makes a project stand out

- **A real problem** (ideally local or personal: Sri Lankan data, Sinhala/Tamil language, a problem you or someone you know actually has)
- **Your own data** collection or a less common dataset (not just Titanic/MNIST)
- **A baseline**, then improvements, with honest **evaluation** and error analysis
- **Deployment:** a live demo (Hugging Face Spaces, Streamlit Cloud) or an API in Docker
- **A great README:** problem, approach, results (with numbers and charts), limitations, how to run it
- **Clean code** with structure, requirements.txt, and some tests

### Project ideas by level

**Data analysis / data science**
1. Analyse public Sri Lankan data (e.g. Central Bank or Department of Census and Statistics data, tourism arrivals, weather, vehicle prices scraped responsibly) → dashboard + insights report
2. A/B test analysis of a simulated experiment with proper statistics, power analysis and pitfalls discussed
3. Customer churn prediction end to end (the Part C mini project) with SHAP explanations and a cost-based threshold

**Deep learning**
4. Image classifier for a local problem (crop/leaf disease, local food dishes, tuk-tuk vs car) using transfer learning, deployed as a web app
5. Sinhala/Tamil text classification (sentiment or news topic) comparing TF-IDF + logistic regression, a multilingual BERT model, and an LLM zero-shot

**LLM / GenAI (most in demand)**
6. **RAG assistant** over a real document set (university handbook, government regulations, a company's public FAQs) with hybrid search, reranking, citations, an evaluation set and metrics (Recall@k, faithfulness)
7. **Agent with tools**, e.g. a personal finance agent that reads CSV bank statements, categorises spending (structured outputs), answers questions with SQL, with guardrails and human approval for actions
8. **Fine-tuning project:** QLoRA fine-tune a small open model for a narrow task (e.g. extracting structured data from Sinhala/English SMS receipts), compared with prompting a large model on cost, latency and accuracy
9. **Evaluation tool:** an LLM-as-judge pipeline validated against your own human labels, with Cohen's kappa
10. **Multimodal:** voice question → Whisper → RAG → TTS answer; or receipt photo → VLM → JSON

**Research-flavoured**
11. Build nanoGPT from scratch; train on a Sinhala corpus; write up tokeniser and scaling experiments
12. Reproduce a small result from a paper and report what you found (including failures)

---

## 16. CV, GitHub, LinkedIn

### CV (resume)

- **One page** for interns
- Sections: contact & links (GitHub, LinkedIn, portfolio), education, **projects** (most important for students), experience, skills, certifications
- **Project bullets with impact and numbers:**
  - ❌ "Made a chatbot using LangChain"
  - ✅ "Built a RAG assistant over 300 university policy documents (hybrid BM25 + embedding search, cross-encoder reranking); improved Recall@5 from 0.62 to 0.88 and answer faithfulness to 0.93 on a 150-question eval set; deployed with FastAPI + Docker"
- Tailor it to each job: mirror the job description's key skills (truthfully)

### GitHub

- Pin your best 3 to 6 repositories
- Each with a clear README (problem, demo GIF/screenshot, results, how to run)
- Consistent commits over time > one giant upload
- No secrets or API keys in code ([file 03](03-developer-tools.md#3-environment-variables-and-secrets))

### LinkedIn and visibility

- Headline: target role + key skills ("Aspiring ML Engineer | Python, PyTorch, RAG, LLM evaluation")
- Share short posts about what you built and learned (a project write-up, a lesson from a bug)
- Write blog posts explaining concepts (teaching deepens your understanding)
- Contribute to open source (documentation fixes are a great first step), Kaggle competitions, hackathons

---

## 17. Interview preparation

### Typical stages

1. CV screen → 2. recruiter call → 3. technical screen (coding/SQL/ML concepts) → 4. take-home or live project → 5. technical deep dives (ML, system design) → 6. behavioural interview

### Coding

- Python fundamentals, data structures, Big-O ([file 02](02-python-programming.md))
- Easy-medium algorithm problems (LeetCode-style), especially arrays, strings, hash maps
- **Pandas and SQL tasks** (very common for data roles): groupby, joins, window functions

### ML concept questions (sample, with where to find answers)

- Explain the bias-variance trade-off. ([file 11](11-ml-fundamentals.md#12-bias-variance-trade-off))
- How do you handle imbalanced data? Why is accuracy misleading? ([file 13](13-evaluation-metrics-and-tuning.md#14-imbalanced-data))
- Precision vs recall; when to prefer each? ROC-AUC vs PR-AUC? ([file 13](13-evaluation-metrics-and-tuning.md))
- L1 vs L2 regularisation? ([file 11](11-ml-fundamentals.md#13-regularisation))
- How does a random forest differ from gradient boosting? ([file 12](12-supervised-learning-algorithms.md))
- What is data leakage? Give examples. ([file 10](10-data-science-workflow.md#13-data-leakage-preview))
- Explain backpropagation and vanishing gradients. ([files 06](06-math-calculus.md), [15](15-neural-networks.md))
- Explain self-attention and why we scale by √d_k. ([file 19](19-transformers.md))
- What are temperature and top-p? ([file 20](20-how-llms-work.md#10-sampling))
- Why do LLMs hallucinate, and how would you reduce it? ([file 20](20-how-llms-work.md#17-hallucinations))
- RAG vs fine-tuning: when to use each? ([file 21](21-training-finetuning-alignment.md#5-prompting-vs-rag-vs-fine-tuning))
- Explain LoRA. ([file 21](21-training-finetuning-alignment.md#9-lora))
- How would you evaluate a RAG system? ([files 23](23-embeddings-vector-databases-rag.md#18-evaluating-rag), [26](26-evaluating-llms.md))
- What is prompt injection and how do you defend against it? ([file 22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks))
- Bayes' theorem medical test question. ([file 07](07-math-probability-statistics.md#9-bayes-theorem))
- Design an A/B test for a new feature. ([file 07](07-math-probability-statistics.md#20-ab-testing))

### ML system design (for more senior roles, good to practise anyway)

Framework: **clarify requirements** (users, scale, latency, metrics) → **data** (sources, labels, features) → **model** (baseline → better) → **evaluation** (offline metrics, online A/B) → **serving** (batch vs online, latency, cost) → **monitoring** (drift, retraining) → **risks** (fairness, privacy, security).

Practice prompts: "Design a fraud detection system for a mobile payment app", "Design a customer-support chatbot for a bank", "Design a news recommendation system".

### Behavioural

Use the **STAR** method: **S**ituation, **T**ask, **A**ction, **R**esult. Prepare stories about: a project you're proud of, a time something failed and what you learned, working in a team, handling disagreement, learning something new quickly.

### Talking about your projects

Be ready for: why you chose this approach; what baseline you compared against; what didn't work; how you evaluated it; what you'd do with more time; trade-offs (cost, latency, accuracy); limitations and ethical considerations.

---

## 18. Certifications

Certifications don't replace projects, but they **structure your learning** and help your CV pass filters, especially early in your career.

| Area | Examples |
|---|---|
| **NVIDIA** | NVIDIA-Certified Associate: **Generative AI and LLMs (NCA-GENL)**; Generative AI Multimodal (NCA-GENM); AI Infrastructure and Operations (NCA-AIIO); Professional-level certifications (e.g. Agentic AI, AI Infrastructure, Generative AI LLMs) |
| **Cloud** | AWS (Certified AI Practitioner, Machine Learning Engineer Associate), Google Cloud (Professional Machine Learning Engineer), Microsoft Azure (AI Fundamentals AI-900, Azure AI Engineer) |
| **AI providers** | Model provider courses and certifications (e.g. Anthropic's courses on building with Claude, DeepLearning.AI short courses with various providers) |
| **Data** | Google Data Analytics, Databricks certifications |

**How this course maps to NCA-GENL topics:** ML fundamentals (11 to 13), deep learning (15), NLP and Transformers (18, 19), LLMs (20, 21), prompt engineering (22), RAG (23), evaluation (26), inference/optimisation (27), deployment (28), trustworthy AI (29). Practise with the official study guide and practice questions.

---

## 19. Your first 90 days as an intern

**Days 1 to 30: Learn and listen**
- Set up your environment; get access; read the team's documentation and code
- Understand the business: what problem does your team solve, for whom, and how is success measured?
- Ask questions (write them down and batch them; show you tried first)
- Deliver a small first win (fix a bug, improve documentation, a small analysis)

**Days 31 to 60: Contribute**
- Own a well-scoped task end to end
- Follow team practices: Git workflow, code reviews, testing ([file 03](03-developer-tools.md#5-github-sharing-and-collaborating))
- Communicate progress regularly; flag blockers early

**Days 61 to 90: Deliver and show impact**
- Finish and present your project: problem → approach → results → next steps (numbers + a clear chart)
- Document your work so others can continue it
- Ask for feedback; discuss a possible return offer or next steps

**Habits that make interns stand out:** reliability (do what you said, when you said); clear written updates; curiosity about the business; checking your own work (data sanity checks, evaluation); honesty about mistakes; kindness to colleagues.

---

## 20. Learning resources

**Courses (many free)**
- Andrej Karpathy: *Neural Networks: Zero to Hero* (YouTube): build everything from scratch
- fast.ai: *Practical Deep Learning for Coders*
- Andrew Ng / DeepLearning.AI: *Machine Learning Specialization*, *Deep Learning Specialization*, many short GenAI courses
- Hugging Face courses: LLM course, Diffusion course, Agents course
- Stanford CS229 (ML), CS231n (vision), CS224n (NLP), CS336 (language modelling from scratch): lectures online
- Google's Machine Learning Crash Course
- Kaggle Learn micro-courses (Python, Pandas, SQL, ML)
- NVIDIA Deep Learning Institute (DLI) courses

**Books**
- *Hands-On Machine Learning with Scikit-Learn, Keras and TensorFlow* (Aurélien Géron): practical ML/DL
- *An Introduction to Statistical Learning* (James, Witten, Hastie, Tibshirani): free PDF, with Python edition
- *Deep Learning* (Goodfellow, Bengio, Courville): free online, theory
- *Dive into Deep Learning* (d2l.ai): free, interactive, with code
- *Build a Large Language Model (From Scratch)* (Sebastian Raschka)
- *AI Engineering* and *Designing Machine Learning Systems* (Chip Huyen): production ML and LLM apps
- *Naked Statistics* (Charles Wheelan): friendly statistics intuition
- *The Book of Why* (Judea Pearl): causal thinking

**Practice**
- Kaggle (competitions, datasets, notebooks), Hugging Face Hub, LeetCode/HackerRank (coding and SQL), Papers with Code / Hugging Face Papers

---

## 21. Final words

You've now seen the whole map: from what a variable is, all the way to how frontier LLMs are trained, served, evaluated and governed.

1. **Foundations compound.** Maths, statistics, Python and ML fundamentals make every new tool easy to learn.
2. **Build things.** Understanding comes from doing. Every concept here becomes real when you implement it.
3. **Evaluate honestly.** The most valuable skill in AI is knowing whether something actually works.
4. **Think about people.** Who benefits, who could be harmed, and how to make AI fair, safe and useful.
5. **Keep going.** Nobody understands everything. The best practitioners keep learning, stay curious, and aren't afraid to say "I don't know yet".

Good luck. Go build something!

---

## 22. New words in this file

| Word | Meaning |
|---|---|
| MDP, state, action, transition, reward, discount factor γ | Formal RL framework |
| Markov property | Future depends only on the current state |
| Policy, return, value function V(s), Q-function Q(s,a) | RL core concepts |
| Exploration vs exploitation, ε-greedy | Trying new vs using known best actions |
| Credit assignment problem | Which past actions caused a delayed reward |
| Q-learning, Bellman equation, TD error | Learning action values from experience |
| DQN, experience replay, target network | Deep Q-learning and its stabilising tricks |
| Policy gradient (REINFORCE), actor-critic, advantage | Learning policies directly / with a value baseline |
| Model-based RL, MCTS, AlphaZero/MuZero | Planning with a learned/known model |
| Offline RL | Learning from a fixed dataset |
| Multi-armed bandit | Simplest RL: choose among options |
| Gymnasium, Stable-Baselines3 | RL tools |
| Causal inference, treatment, outcome | Estimating cause and effect |
| Potential outcomes, counterfactual, ATE | What would have happened / average effect |
| Causal DAG | Diagram of assumed causal relationships |
| Propensity score, difference-in-differences, instrumental variables, regression discontinuity, synthetic control | Causal methods |
| Uplift modelling, CATE | Individual-level treatment effects |
| DoWhy, EconML, CausalML | Causal inference libraries |
| Bayesian ML, prior, posterior, conjugate prior | Probabilistic modelling of parameters |
| MCMC, variational inference | Approximating posteriors |
| Gaussian Process | Bayesian model over functions with uncertainty |
| MC dropout, deep ensembles, Bayesian neural networks | Uncertainty in deep learning |
| PyMC, NumPyro, Stan | Bayesian libraries |
| GNN, message passing, GCN, GraphSAGE, GAT | Neural networks on graphs |
| Node classification, link prediction, graph classification | GNN tasks |
| PyTorch Geometric, DGL | GNN libraries |
| State-space model (SSM), Mamba, selective state, parallel scan | Linear-time sequence models |
| Hybrid models, RWKV, linear attention | Alternatives/complements to attention |
| Mechanistic interpretability, superposition, polysemantic neuron | Reverse-engineering networks |
| Sparse autoencoder (SAE), feature steering | Decomposing activations into features / adjusting them |
| Circuits, activation patching, causal tracing, logit lens | Interpretability techniques |
| Scalable oversight, specification gaming, dangerous capability evals | AI safety research topics |
| nanoGPT, minbpe | Minimal GPT and BPE implementations |
| AutoML, time-series/tabular foundation models, world models, embodied AI | Other frontiers |
| arXiv, three-pass method, ablation study, survey paper | Reading research |
| T-shaped profile | Broad knowledge + one deep skill |
| STAR method | Structure for behavioural interview answers |
| ML system design | Designing end-to-end ML systems in interviews |
| NCA-GENL and other certifications | Credentials for structured learning |

**Reference:** [31-glossary.md](31-glossary.md): every term in the course, A to Z.
