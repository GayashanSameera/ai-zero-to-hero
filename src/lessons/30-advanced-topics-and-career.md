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

### Why it exists

Most machine learning learns from a table of **correct answers** ([supervised learning](11-ml-fundamentals.md#2-types-of-machine-learning)). But some problems have no answer key: nobody can tell a robot the "correct" angle of every joint, or tell a chess program the "correct" move in every position. What we *can* say is whether the final result was good or bad. RL solves the problem of **learning to act well when you only get a score, and the score may come late**.

### The ideas in one table

Take a tiny game: a robot stands on a 1 × 4 corridor, squares 1 to 4, and square 4 is the charger.

| RL word | In the corridor game |
|---|---|
| Agent | The robot |
| Environment | The corridor and its rules |
| State | Which square the robot is on (1, 2, 3 or 4) |
| Action | Move left or move right |
| Reward | +10 on reaching square 4, −1 for every other step (so wasting time costs) |
| Policy | "In squares 1 to 3, always move right" |
| Episode | One run from the start square until the charger is reached |

### Worked example: the discount factor

Suppose three rewards arrive in a row: 5, 5, 5. How much is that whole sequence worth **now**?

- With γ = 1 (patient): G = 5 + 5 + 5 = **15**
- With γ = 0.5 (impatient): G = 5 + 0.5 × 5 + 0.5² × 5 = 5 + 2.5 + 1.25 = **8.75**
- With γ = 0 (completely short-sighted): G = **5**, only the first reward counts

A small γ makes an agent greedy for quick rewards. A γ near 1 makes it plan far ahead. Typical values are 0.9 to 0.99.

### Worked example: ε-greedy with numbers

An agent has 10 possible actions and ε = 0.1. With probability 0.9 it picks the best-known action. With probability 0.1 it picks one of the 10 actions at random (which could again be the best one). So P(best action) = 0.9 + 0.1 × (1/10) = **0.91**, and each other action gets 0.1 × (1/10) = **0.01**. Over thousands of steps the agent still tries everything, so it can discover that its "favourite" was not actually the best.

### Where you'll meet it in real work

A food-delivery or e-commerce app deciding which offers to show over a whole month (the aim is long-term customer value, not one click) is an RL-style problem. So is controlling cooling in a data centre. In LLM work you meet RL every time someone says RLHF or GRPO.

### Common mistakes

- Mixing up **reward** (one step's feedback) and **return** (the discounted total). Agents maximise the return, not the next reward.
- Thinking the agent is told the right action. It is only told how good the outcome was.
- Forgetting that the same action can lead to different next states (transitions can be random).

**Exam angle:** exams ask you to name the parts (agent, environment, state, action, reward, policy) and to connect RL to LLMs: in RLHF the LLM is the policy, the reward model supplies the reward, and PPO is the update algorithm.

> **සිංහලෙන්:** Reinforcement learning කියන්නේ බල්ලෙක්ට "වාඩි වෙන්න" ඉගැන්නුවා වගේ දෙයක්. බල්ලට භාෂාව තේරෙන්නේ නැහැ, ඒත් වාඩි වුණාම biscuit එකක් (reward) ලැබෙනවා. ඒක නිසා ටික කාලෙකින් ඌ ඒ දේ කරන්න ඉගෙන ගන්නවා. RL වලත් agent කෙනෙක් environment එකක action එකක් කරනවා, හොඳ නම් reward එකක් ලැබෙනවා. Discount factor γ = 0.5 නම් ඊළඟ reward එකේ වටිනාකම අඩක් වෙනවා, ඒ නිසා 5, 5, 5 කියන rewards තුනේ එකතුව 15 නෙවෙයි, 8.75යි. Explore කරන්නේ අලුත් කඩේකට යනවා වගේ, exploit කරන්නේ හැමදාම යන කඩේටම යනවා වගේ.

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

### Why it exists

A robot cannot see the future. It needs a number for each "if I do this here, how good will things turn out?" question, and it must build those numbers from experience, one step at a time. Q-learning is the simplest method that does this without needing a map of the environment in advance.

### Reading the update in plain words

```
new guess = old guess + α × (better guess − old guess)
better guess (target) = reward you just got + γ × best value you expect from the next state
```

So you nudge your old estimate a fraction α of the way towards a slightly better, more informed estimate. That is all Q-learning is.

### Worked example with every step (a second one)

A robot in a corridor has Q(corridor, right) = 2. It moves right, gets reward 10, and lands in a state where the best Q value is 5. Take α = 0.1 and γ = 0.9.

1. Target = r + γ × max Q(s', ·) = 10 + 0.9 × 5 = 10 + 4.5 = **14.5**
2. TD error = target − old = 14.5 − 2 = **12.5**
3. New Q = old + α × TD error = 2 + 0.1 × 12.5 = 2 + 1.25 = **3.25**

The estimate moved from 2 to 3.25, only 10% of the way to 14.5. With a bigger α it moves faster but more noisily.

### The Q-table after each episode (from the corridor example above)

| After | Q(A, right) | Q(B, right) |
|---|---|---|
| Start | 0 | 0 |
| Episode 1 | 0 | 5 |
| Episode 2 | 2.25 | 7.5 |
| Many episodes | → 9 | → 10 |

Notice the **delay**: A only learns it is valuable *after* B has learned it is valuable. Value flows backwards from the reward, one step per visit.

### Where you'll meet it in real work

Plain Q-tables are used for small, discrete problems (a lift controller, a simple pricing ladder, game levels). The same idea scaled up with a neural network (DQN, next section) handles bigger problems.

### Common mistakes

- Forgetting the `max` over the **next** state's actions, and using the current state instead.
- Using a huge α (e.g. 1.0), which throws away old knowledge on every step.
- At a terminal state (the goal), the target should be just r, with no future term, because there is no next state.
- Never exploring (ε = 0): the agent can lock onto a mediocre route forever.

> **සිංහලෙන්:** Q-learning කියන්නේ "මෙතන මේ දේ කළොත් කොච්චර හොඳද?" කියන ලකුණ අත්දැකීමෙන් ටික ටික හදාගන්න ක්‍රමයක්. පරණ අනුමානය එක්කම හොඳ අනුමානයක් (target) සසඳලා, ඒ වෙනසෙන් α කොටසක් විතරක් එකතු කරනවා. උදාහරණයක් විදියට Q = 2, reward 10, ඊළඟ state එකේ හොඳම Q 5, α = 0.1, γ = 0.9 නම් target = 10 + 0.9 × 5 = 14.5. වෙනස 12.5ක්, ඒකෙන් 10%ක් එකතු කරාම අලුත් Q = 3.25 වෙනවා. Reward එක ලැබෙන තැනින් පටන් අරන් අගය ආපස්සට, එක පාරකට එක පියවරක් බැගින් පැතිරෙනවා.

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

### Why it exists

A Q-table needs one row per state. A game screen or a camera image has more possible states than there are atoms to write them on. Deep RL replaces the table with a neural network that **generalises**: similar states get similar values, even if the agent has never seen that exact state.

### Worked example: advantage

An actor-critic agent is in a state the critic values at V(s) = 6 (the critic expects a return of 6 from here). The agent takes an action and the actual return turns out to be 9.

- Advantage A = actual − expected = 9 − 6 = **+3**: "this action was 3 better than usual", so make it more likely.
- Another action gets an actual return of 4: A = 4 − 6 = **−2**: make it less likely.

Using the advantage instead of the raw return cuts the noise: a return of 9 might look great in one state and ordinary in another.

### Worked example: PPO's clipping

PPO compares the new policy with the old one using the ratio r = π_new(a|s) / π_old(a|s). Suppose ε = 0.2, so the ratio is clipped to the range [0.8, 1.2]. For an action with advantage A = +3, the update would like to raise the probability a lot: say r = 1.5.

- Unclipped score: r × A = 1.5 × 3 = 4.5
- Clipped score: 1.2 × 3 = 3.6
- PPO takes the **smaller**: min(4.5, 3.6) = **3.6**

So the gain is capped and the policy cannot lurch far away from the old one in a single step. That safety brake is why PPO is stable.

### A picture of the three main families

```
Value-based (DQN):        learn Q  ──► pick action with highest Q
Policy-based (REINFORCE): learn the policy directly ──► sample actions
Actor-critic (PPO):       actor = policy, critic = value ──► advantage guides the actor
```

### Where you'll meet it in real work

PPO is what trained many early chat models through RLHF. When you fine-tune an LLM with TRL, or read that a reasoning model was trained with GRPO, you are using this family of methods.

### Common mistakes

- Believing DQN works for any action type. It chooses from a **fixed list** of actions, so continuous actions (e.g. steering angle) need policy-gradient methods.
- Forgetting that RL training is unstable and needs many runs (different random seeds) before you trust a result.
- Confusing **reward hacking** (the agent finds a loophole) with a bug in the algorithm. Usually the reward was badly specified.

**Exam angle:** typical items ask which algorithm RLHF uses (PPO), what the reward model does, and how GRPO differs from PPO (group-relative advantage, no critic).

> **සිංහලෙන්:** Cricket එකේ batsman කෙනෙක් හිතන්න. Actor කියන්නේ batsman, shot එක තෝරන්නේ ඔහු. Critic කියන්නේ coach, "ඒ බෝලේට ඒ shot එක ගොඩක් හොඳයි" කියලා ලකුණු දෙන්නේ ඔහු. Advantage කියන්නේ සාමාන්‍යයෙන් බලාපොරොත්තු වුණාට වඩා කොච්චර හොඳද කියන වෙනස: බලාපොරොත්තුව 6, ලැබුණේ 9 නම් advantage = +3. PPO කියන්නේ coach "එක දවසෙන් ඔයාගේ batting style එක මුළුමනින්ම වෙනස් කරන්න එපා" කියනවා වගේ, update එකක් ගොඩක් ලොකු වෙන්න දෙන්නේ නැහැ (ratio එක 0.8 ඉඳන් 1.2 අතරට clip කරනවා).

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

### Why it exists

Business and policy decisions are about **actions**: "if we do X, what happens?" A model trained only to predict can say "customers who got the discount stayed longer" without telling you whether the discount **caused** it. Acting on a wrong cause wastes money: you might give discounts to people who would have stayed anyway.

### Worked example: potential outcomes and ATE

Four customers; the outcome is monthly spend in thousands of rupees. We imagine both worlds (in real life we only ever see one of them):

| Customer | Spend with discount | Spend without | Effect |
|---|---|---|---|
| Nimal | 8 | 5 | +3 |
| Kamala | 6 | 6 | 0 |
| Saman | 9 | 4 | +5 |
| Dilani | 5 | 3 | +2 |

ATE = (3 + 0 + 5 + 2) / 4 = 10 / 4 = **2.5 thousand rupees** per customer. Notice the effects differ: Kamala is not influenced at all, and Saman is influenced most. That variation is exactly what **uplift modelling** tries to predict.

### Worked example: why a naive comparison fools you

An e-commerce app finds that premium members spend Rs. 15,000 a month while non-members spend Rs. 5,000. Does membership triple spending? Look at the numbers **before** anyone joined: the people who later joined were already spending Rs. 12,000, and the others Rs. 5,000.

- Naive difference after: 15,000 − 5,000 = Rs. 10,000
- Difference-in-differences: (15,000 − 12,000) − (5,000 − 5,000) = 3,000 − 0 = **Rs. 3,000**

Most of the "effect" was just that big spenders were the ones who joined. (These are illustrative numbers.) The Rs. 3,000 estimate assumes both groups would have kept the same trend without the membership.

### Where you'll meet it in real work

A telecom deciding who should receive a retention offer: sending it to everyone wastes money, and sending it to people who were leaving anyway (or staying anyway) has no effect. Uplift models target the "persuadables". Also: measuring whether a new app screen really raised sales (A/B test).

### Common mistakes

- Concluding causation from a regression coefficient on observational data.
- Adjusting for **everything**. Controlling for a variable that is *caused by* the treatment (a mediator) or by both treatment and outcome (a collider) can create bias, so choose adjustment variables using a causal diagram.
- Ignoring that DiD relies on "parallel trends"; if the two groups were already diverging, the estimate is wrong.

> **සිංහලෙන්:** ඉස්කෝලේ tuition යන ළමයි A/L වල හොඳට කරනවා කියලා data පෙන්නනවා. ඒත් ඒක tuition නිසාමද? Tuition යන ළමයින්ට සල්ලි වැඩියි, ගෙදර පොත් වැඩියි වගේ දේවලුත් තියෙනවා. ඒවා තමයි confounders. Membership ගත්ත අය රු. 15,000ක් වියදම් කරනවා, අනිත් අය රු. 5,000යි කියලා "වියදම තුන් ගුණයක් වුණා" කියන්න බැහැ, මොකද membership ගන්නකොටම ඒ අය රු. 12,000ක් වියදම් කළා. Difference-in-differences එකෙන් (15,000 − 12,000) − (5,000 − 5,000) = රු. 3,000ක් විතරයි හැබෑ බලපෑම.

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

### Why it exists

With little data, a single number can lie. If a new player scores 100 and 80 in his first two innings, "average 90" is not believable. Bayesian thinking fixes this by blending what you already knew (the prior) with the new evidence, and by giving you a **range** instead of a single guess.

### Worked example: a simple weighted blend

Test batsmen average about 35. Treat that prior belief as being worth 10 innings of evidence. A new player has 2 innings averaging 90.

- Blended estimate = (10 × 35 + 2 × 90) / (10 + 2) = (350 + 180) / 12 = 530 / 12 ≈ **44.2**

The estimate is pulled strongly towards the prior because there are only 2 innings of data. After 40 innings averaging 60: (350 + 40 × 60) / 50 = 2,750 / 50 = **55**: now the data dominates. (This is a simplified version of how conjugate updates behave.)

### Worked example: uncertainty from MC dropout

Keep dropout on at prediction time and run the same house through the model 5 times. Predicted prices (in lakhs): 248, 252, 244, 256, 250.

1. Mean = (248 + 252 + 244 + 256 + 250) / 5 = 1,250 / 5 = **250**
2. Deviations from the mean: −2, +2, −6, +6, 0
3. Squares: 4, 4, 36, 36, 0, sum = 80
4. Variance = 80 / 5 = 16, standard deviation = **4**

Report: "about 250 lakhs, give or take 4". If the five runs had been 200, 300, 230, 270, 250, the spread would be far larger, which warns you that the model is unsure about this input.

### Where you'll meet it in real work

- **Hyperparameter tuning** with Bayesian optimisation ([file 13](13-evaluation-metrics-and-tuning.md#12-hyperparameter-tuning)): fewer expensive training runs.
- **A/B tests** with small traffic: "probability that version B is better is 94%" is easier for managers than a p-value.
- Medical or financial predictions where "how sure are we?" matters as much as the answer.

### Common mistakes

- Treating the prior as a free choice that cannot be questioned. A strong, wrong prior misleads; always check how much the answer changes with a weaker prior.
- Reading a Bayesian "credible interval" as a frequentist "confidence interval". The credible interval says directly "90% probability the value lies here".
- Assuming a Bayesian method is always slower to code. For simple cases (Beta-binomial) it is a one-line formula.

> **සිංහලෙන්:** Bayesian කියන්නේ "කලින් තියෙන විශ්වාසය + අලුත් data = අලුත් විශ්වාසය" කියන සිතීම. අලුත් cricket ක්‍රීඩකයෙක් innings 2කින් 100 සහ 80 ගහලා average 90 කියලා ඒක විශ්වාස කරන්න බැහැ. Test batsman කෙනෙක්ගේ සාමාන්‍ය average එක 35 (prior), ඒක innings 10ක වටිනාකමක් කියලා හිතුවොත් (10 × 35 + 2 × 90) ÷ 12 ≈ 44.2 වෙනවා. Data වැඩි වෙනකොට ඒ අගය data එකටම ළං වෙනවා. තව එක වාසියක් තමයි එක අගයක් විතරක් නෙවෙයි, "250ට ආසන්නව, ±4" වගේ අවිනිශ්චිතතාවයත් ලැබෙන එක.

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

### Why it exists

Ordinary neural networks expect a fixed-size row or a grid. But a social network, a molecule or a bank's payment network is a web of **connections**, where the number of neighbours differs from node to node. Who you are linked to tells a lot about you, and GNNs are built to use exactly that.

### A picture of message passing

```
        B(4)
         │
  A(2) ──┼── C(6)          Node A gets messages from B and C
         │
        (A's own value = 2, neighbours B = 4, C = 6)
```

### Worked example (one step, with plain numbers)

Pretend each node has a single number as its embedding. Node A has h = 2, its neighbours B and C have 4 and 6. Choose AGGREGATE = mean and UPDATE = average of own value and the aggregate.

1. AGGREGATE = (4 + 6) / 2 = **5**
2. UPDATE = 0.5 × 2 + 0.5 × 5 = 1 + 2.5 = **3.5**

A's new embedding (3.5) now reflects its neighbourhood. After a second layer, A also "hears" from neighbours of neighbours (two hops). Real GNNs use vectors and learned weight matrices, but the pattern is the same.

### Where you'll meet it in real work

A bank can represent accounts as nodes and transfers as edges. A fraud ring often shows up as a cluster of accounts passing money among themselves, something a table of single-account features cannot see but a GNN can. Drug discovery (molecules as graphs) and route or traffic prediction use the same idea.

### Common mistakes

- Stacking too many layers. Embeddings become more and more alike (**over-smoothing**) because each node averages over almost the whole graph. 2 to 4 layers is common.
- Forgetting to split train and test properly: in graphs, neighbours of test nodes are often in the training set, which can leak information.
- Using a GNN when a simple feature such as "number of transfers last week" would do. Try the baseline first.

> **සිංහලෙන්:** GNN කියන්නේ සම්බන්ධතා වල හැඩය පාවිච්චි කරන neural network එකක්. ඔයාගේ යාළුවෝ කවුද කියලා බැලුවාම ඔයා ගැන ගොඩක් දේවල් දැනගන්න පුළුවන් නේද, ඒ වගේමයි. Message passing වලදී node එකක් තමන්ගේ අසල්වැසියන්ගෙන් ලැබෙන අගයන් එකතු කරලා තමන්ගේ අගය අලුත් කරනවා. උදාහරණයක් විදියට A එකේ අගය 2, අසල්වැසියන් 4 සහ 6 නම්, mean එක 5, අලුත් අගය 0.5 × 2 + 0.5 × 5 = 3.5. බැංකුවක fraud කරන කණ්ඩායමක් එකිනෙකාට සල්ලි යවාගන්න එක graph එකේ cluster එකක් විදියට පේනවා.

---

## 7. State-space models

Transformers' attention costs O(n²) in sequence length ([file 19](19-transformers.md#19-the-cost-of-attention)), and the KV cache grows with context ([file 20](20-how-llms-work.md#12-the-kv-cache)).

**State-space models (SSMs)** like **Mamba** process sequences with a **fixed-size hidden state**, like an RNN ([file 17](17-sequence-models-and-attention.md#3-recurrent-neural-networks)), but:
- **Selective:** the state update depends on the input, so the model can choose what to remember or forget (like LSTM gates, [file 17](17-sequence-models-and-attention.md#7-lstm))
- **Trainable in parallel** using a **parallel scan** algorithm, unlike classic RNNs

**Benefits:** linear-time processing O(n); constant memory per token at inference (no growing KV cache) → fast for very long sequences.
**Weaknesses:** a fixed-size state can't perfectly recall arbitrary details from far back (e.g. exact copying), where attention excels.

**Hybrids** (mixing some attention layers with many SSM layers, e.g. Jamba, NVIDIA's Nemotron-H, and others) aim to get the best of both. **Linear attention** variants and **RWKV** pursue similar goals.

### Why it exists

A Transformer reads every token against every other token, so doubling the length makes the work about four times bigger. Books, long legal files and hours of audio then become very costly. State-space models try to read long inputs with **cost that grows in a straight line**.

### Worked example: how fast cost grows

| Sequence length n | Attention work (about n²) | SSM work (about n) |
|---|---|---|
| 1,000 tokens | 1,000,000 | 1,000 |
| 10,000 tokens | 100,000,000 | 10,000 |
| Ratio when n grows 10× | **100×** more | **10×** more |

Make the text 10 times longer and attention costs 100 times more, while an SSM costs 10 times more. (The counts show the *growth pattern*, not real seconds. Real systems add many optimisations.)

### A picture of the difference

```
Transformer:  every token looks back at ALL earlier tokens   (memory grows: KV cache)
SSM / Mamba:  every token updates ONE fixed-size summary      (memory stays constant)
```

It is like taking notes in a lecture: the Transformer keeps the full recording and re-listens whenever needed; the SSM keeps one page of notes and updates it as the lecture goes on. The page is small and fast, but it cannot hold every word.

### Where you'll meet it in real work

You will see SSM layers inside hybrid models marketed for long context and cheap serving. If your job is serving long documents at low cost, ask whether the model is a Transformer or a hybrid, because the memory per user differs a lot ([file 27](27-inference-and-serving.md)).

### Common mistakes

- Saying "SSMs have replaced Transformers". Today most strong LLMs are still Transformers; SSMs are an active alternative and appear in hybrids.
- Forgetting the trade-off: a fixed state is cheap but lossy for exact recall.

**Exam angle:** know that self-attention is O(n²) in sequence length, the KV cache grows with context, and SSMs/RNN-like models have constant state and linear cost.

> **සිංහලෙන්:** Transformer එකක් හැම token එකක්ම අනිත් හැම token එකක් එක්කම බලන නිසා, text එක දිග වෙන්න වෙන්න වියදම හතරගුණ, නවගුණ කියලා වේගයෙන් වැඩි වෙනවා. Tokens 1,000ක් නම් 1,000,000ක වැඩක්, 10,000ක් නම් 100,000,000ක්, ඒ කියන්නේ දිග 10 ගුණයක් වුණාම වියදම 100 ගුණයක්. Mamba වගේ SSM එකක් තියෙන්නේ එක පිටුවක නෝට්ස් වගේ ස්ථාවර ප්‍රමාණයේ state එකක් විතරයි, ඒක ඉක්මනින් අලුත් කරගෙන යනවා, ඒ නිසා වියදම වැඩි වෙන්නේ 10 ගුණයක් විතරයි. හැබැයි පිටුව පොඩි නිසා හැම වචනයක්ම හරියටම මතක තියාගන්න බැහැ.

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

### Why it exists

Powerful models are black boxes. We can test what a model *does* (behavioural testing) but not **why**. For medicine, law or safety-critical use we want to look inside, find the parts responsible for a behaviour, and notice hidden problems such as deception before they matter.

### Which technique answers which question

| Question | Technique |
|---|---|
| What information is stored in this layer? | Probing (train a small classifier on the hidden states) |
| Which part of the network caused this answer? | Activation patching / causal tracing |
| What concepts does the model use? | Sparse autoencoders (SAEs) |
| How does the prediction form layer by layer? | Logit lens |
| Can I change the behaviour by editing a concept? | Feature steering |

### Worked example: activation patching

Prompt A: "The capital of France is" → the model answers **Paris**. Prompt B: "The capital of Germany is" → **Berlin**. A researcher runs B, but at one chosen layer and position copies in the activations from the run on A. If the answer flips from Berlin to Paris only when this particular spot is patched, that spot holds the "France → Paris" information. Repeat for every layer and position and you get a map of where the fact lives.

### The doctor analogy

Behavioural testing is like a doctor who only asks the patient questions. Mechanistic interpretability is like an MRI scan: you see which regions are active, and can sometimes spot something the patient would never admit.

### Where you'll meet it in real work

Safety teams use these tools to audit models before release, and to check whether a model's stated reasoning (chain of thought) really matches its internal process (**CoT faithfulness**). For most application developers, the practical takeaway is simpler: treat explanations from a model as a story that may not describe its true computation.

### Common mistakes

- Assuming one neuron means one concept. Because of superposition, neurons are usually **polysemantic**.
- Accepting an attractive explanation without an **intervention test**. If you cannot change the behaviour by changing the supposed cause, you have a correlation, not a mechanism.

**Exam angle:** under trustworthy AI, know that explainability and transparency help detect bias and errors, and that a model's own explanation is not guaranteed to be faithful.

> **සිංහලෙන්:** Model එකක් කළු පෙට්ටියක් වගේ. එයාගෙන් ප්‍රශ්න අහලා විතරක් බලන එක (behavioural testing) ලෙඩාගෙන් ප්‍රශ්න අහන වෛද්‍යවරයෙක් වගේ. Mechanistic interpretability කියන්නේ MRI scan එකක් වගේ, ඇතුලේ මොන කොටසද වැඩ කරන්නේ කියලා බලනවා. Activation patching වලදී "France" prompt එකක activations "Germany" prompt එකකට මාරු කරලා බලනවා. එක තැනක් මාරු කරාම විතරක් උත්තරය Berlin ඉඳන් Paris වෙනවා නම්, ඒ තැනයි "ප්‍රංශයේ අගනුවර" තොරතුර තියෙන්නේ. එක neuron එකක් එක සංකල්පයක් විතරක් කියලා හිතන්න එපා, ඒවා ගොඩක් දේවල් එකට අරන් ඉන්නවා.

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

### Why it exists

Using a library lets you drive the car. Building a GPT yourself lets you take the engine apart and put it back together. After you have done it once, attention, loss curves, tokenisers and scaling stop being slogans and become things you have seen run.

### Worked example: check your parameter count

Karpathy's small Shakespeare model uses 6 layers and an embedding size d = 384. Each Transformer block has about 12 d² parameters (4 d² in attention plus 8 d² in the feed-forward part).

1. d² = 384 × 384 = 147,456
2. Per block: 12 × 147,456 = 1,769,472
3. For 6 blocks: 6 × 1,769,472 = **10,616,832**, about 10.6 million

That matches the "roughly 10 million parameters" quoted for this model (embeddings add a little more). If your own count differs wildly, you have a bug in your shapes.

### Worked example: is the loss sensible?

The character vocabulary for Shakespeare has about 65 symbols. A model that knows nothing guesses uniformly, so its starting loss should be about ln(65) ≈ **4.17**. If your first printed loss is 40 or 0.1, something is wrong before training even starts. After training for a few minutes on a GPU, a loss near 1.5 means the model has learnt spelling, word shapes and Shakespeare-like rhythm.

### A suggested weekly plan (10 hours a week)

| Week | Goal |
|---|---|
| 1 | Watch the video once without coding; read the repository |
| 2 | Re-type data loading, tokeniser and the bigram baseline |
| 3 | Add one self-attention head, then multi-head |
| 4 | Blocks, residuals, LayerNorm; train and plot the loss |
| 5 | Generate text; try temperature and top-k; write up what you saw |

### Where you'll meet it in real work

Nobody trains a GPT from scratch at work, yet interviewers for LLM and research roles love this project because it proves you understand shapes, masking, the training loop and evaluation. It also makes reading code from Hugging Face or vLLM far less scary.

### Common mistakes

- Copying code line by line without running and printing the shapes.
- Forgetting the causal mask, so the model cheats by looking at future tokens (the loss looks amazing, the generated text is nonsense).
- Training and judging on the same text. Hold out a validation set.

**Exam angle:** parameter counting (12 d² per block), the role of the causal mask, and the meaning of a cross-entropy loss of ln(vocabulary size) at random initialisation are fair game.

> **සිංහලෙන්:** Hugging Face එකෙන් model එකක් load කරන එක tuk-tuk එකක් පදවනවා වගේ. nanoGPT එක අතින් හදන එක engine එක ගලවලා ආයෙත් එකලස් කරනවා වගේ. Layers 6, embedding size 384 නම් එක block එකක parameters ආසන්න වශයෙන් 12 × 384² = 1,769,472ක්, blocks 6කට මිලියන 10.6ක්. Characters 65ක් තියෙන Shakespeare data වලදී model එක කිසිවක් නොදන්නා විට loss එක ln(65) ≈ 4.17 විය යුතුයි. ඒ අගය 40ක් වගේ අමුතු එකක් නම් code එකේ bug එකක් තියෙනවා. Causal mask එක අමතක කළොත් model එක අනාගත tokens බලලා රැවටෙනවා.

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

### Why it exists

AI changes fast, and a beginner can feel they must chase every headline. This list is a **map of directions**, so you recognise the names when you meet them and can decide what deserves your time.

### A quick guide

| Frontier | What problem it attacks | A small first step |
|---|---|---|
| AutoML | Trying many models by hand is slow | Run FLAML or AutoGluon on a Kaggle table and compare with your manual model |
| Time-series foundation models | Forecasting each new series from scratch | Forecast daily sales with a pretrained model, zero-shot, and compare with a naive baseline |
| AI for science | Slow lab experiments | Look at AlphaFold predictions for a protein you know |
| On-device AI | Privacy, latency, data cost | Run a small model with Ollama on your laptop |
| Synthetic data | Not enough labelled data | Generate examples for a rare class, then check them by hand |
| Long-horizon agents | Tasks that take hours | Build a small agent that works through a checklist ([file 24](24-ai-agents.md)) |

### Where you'll meet it in real work

A retailer forecasting demand for thousands of products may try a pretrained time-series model before building custom ones. A clinic app may need on-device models because patient data cannot leave the phone. In every case the first question stays the same: *does it beat a simple baseline on our data?*

### Common mistakes

- Chasing the newest name before the foundations are solid.
- Believing a demo. A frontier idea earns your trust only after you evaluate it honestly on your own problem.

> **සිංහලෙන්:** මේ කොටසේ තියෙන්නේ අනාගතයේ දිශාවන්වල සිතියමක්. ඒ හැම එකක්ම දැන් ඉගෙන ගන්න ඕන නැහැ, නම ඇහුණාම "ආ මේක මේ වගේ දෙයක්" කියලා දැනගත්තා නම් ඇති. උදාහරණයක් විදියට, දෙනවා කඩයක භාණ්ඩ ගණනාවක ඉල්ලුම අනුමාන කරන්න time-series foundation model එකක් try කරන්න පුළුවන්. ඒත් හැමවිටම මුලින් අහන්න ඕන ප්‍රශ්නය එකයි: සරල baseline එකකට වඩා මේක හොඳද? ඒකට ඔයාගේම data වලින් හරියට පරීක්ෂා කරලා බලන්න.

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

### Why it exists

Textbooks are years behind. Almost every technique in this course (Transformers, LoRA, RAG, DPO) first appeared in a paper. If you can read papers, you can learn a new idea the week it appears, and judge whether a blog post's claim is true.

### Worked example: the three passes on one paper (LoRA, 2021)

- **Pass 1 (10 minutes):** the abstract says LoRA reduces the number of trainable parameters for GPT-3 175B by about **10,000 times** compared with full fine-tuning, and cuts GPU memory needs, while keeping quality. Key idea: train small low-rank matrices, freeze the rest. Relevant to me? Yes, I fine-tune models on a small GPU.
- **Pass 2 (1 hour):** read the method, skip the proofs. Look at the table comparing LoRA, adapters and full fine-tuning on the same tasks. Note the questions: why low-rank? what rank values did they try?
- **Pass 3 (only if needed):** re-implement the LoRA layer in 20 lines of PyTorch and check that parameter counts match the paper's.

### A note-taking template

```
Title / year / link:
Problem in one sentence:
Key idea in one sentence:
Main result (with numbers and what it is compared to):
Baselines and datasets used:
What I do not believe yet / limitations:
Could I use this? How?
```

### Worked example: is the improvement real?

A paper reports accuracy 84.0 for its new method versus 83.5 for the baseline, from one run. Ask: how large is the run-to-run noise? If the same model trained with different random seeds ranges from 83.0 to 84.5, a 0.5 gain is inside the noise and proves nothing. Look for several seeds, error bars or a significance test ([file 26](26-evaluating-llms.md#16-statistics-for-evals)).

### Where you'll meet it in real work

When a manager says "I read that method X is 3 times better", you are the person who can open the paper, check the baseline and the dataset, and report honestly whether it applies to your product.

### Common mistakes

- Reading start to finish like a novel. Do pass 1 first and decide if the paper deserves more.
- Believing the abstract. Check the experiments table.
- Being discouraged by notation. Even experts skim the maths on the first pass.

> **සිංහලෙන්:** පත්තරයක් කියවනවා වගේ කියවන්න. මුලින් headlines ඔක්කොම බලනවා (පළමු වටය, විනාඩි 10). උනන්දු වෙන ඒවා සම්පූර්ණයෙන් කියවනවා (දෙවන වටය, පැයක්). හරිම වැදගත් එකක් නම් විතරක් code එකෙන් ආයෙත් හදලා බලනවා (තුන්වන වටය). උදාහරණයක් විදියට LoRA paper එකේ abstract එකෙන් කියනවා GPT-3 175B fine-tune කරද්දී trainable parameters 10,000 ගුණයක් අඩු කරන්න පුළුවන් කියලා. තව එකක්: accuracy 84.0 vs 83.5 කියන වෙනස seeds වෙනස් කරාම ඇති වෙන වෙනසට වඩා අඩු නම්, ඒක ඇත්තටම වැඩිදියුණුවක් නෙවෙයි.

---

## 12. Staying current

The field moves extremely fast. Don't try to follow everything.

- **Newsletters and blogs:** The Batch (DeepLearning.AI), Import AI, Simon Willison's blog, Sebastian Raschka's newsletter, Chip Huyen's blog, Lilian Weng's blog (excellent technical deep dives), Hugging Face blog, NVIDIA technical blog, provider engineering blogs (Anthropic, OpenAI, Google)
- **Videos:** Andrej Karpathy (Neural Networks: Zero to Hero), 3Blue1Brown (neural network and Transformer visualisations), StatQuest (clear statistics/ML explanations), Yannic Kilcher (paper reviews)
- **Communities:** Hugging Face forums/Discord, Kaggle, local meetups and AI communities, university clubs
- **Hands-on:** try new open models on Hugging Face/Ollama; reproduce small results

**Rule:** foundations (Parts A to D of this course) change slowly and pay off for years. Tools and model names change monthly. Invest most in foundations; learn tools as needed.

### Why it exists

If you try to follow every release, you will burn out and learn nothing deeply. A small, regular routine keeps you informed without eating your life.

### A realistic weekly plan (about 3 hours)

| Time | Activity |
|---|---|
| 30 min, twice | Read one newsletter issue; save at most **one** item to study |
| 1 hour | Try that item hands-on (run a model, read one paper's pass 1) |
| 30 min | Write 5 lines in a notes file: what I learnt, what I want to try |

In a year that is about 150 hours: enough to build two or three portfolio projects.

### Foundations vs news

```
Changes slowly (invest first):   maths, statistics, Python, ML basics, evaluation
Changes monthly (learn on demand): model names, library versions, benchmark leaders
```

### Where you'll meet it in real work

Teams often ask "what changed in the last quarter that matters for us?" A person with a note file of the last few months' items and their own small tests can answer in minutes, which is a big advantage.

### Common mistakes

- Saving hundreds of bookmarks and reading none.
- Mistaking leaderboard news for learning. Run something yourself.
- Skipping foundations because a new model name feels more exciting.

> **සිංහලෙන්:** AI ලෝකය ඉක්මනින් වෙනස් වෙනවා, ඒ හැම දෙයක්ම පස්සෙන් ගියොත් මහන්සි වෙලා කිසිවක් ඉගෙන ගන්නේ නැහැ. සතියකට පැය 3ක් වගේ පොඩි routine එකක් තියාගන්න: newsletter එකක් කියවලා, එකම එක දෙයක් තෝරලා, අතින් try කරලා, පේළි 5ක note එකක් ලියන්න. අවුරුද්දකට ඒක පැය 150ක් විතර වෙනවා. Maths, statistics, Python වගේ foundations ගොඩක් කල් පාවිච්චි වෙනවා, ඒත් model නම් සහ library versions මාසයෙන් මාසයට වෙනස් වෙනවා.

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

### Why it exists

"Work in AI" is not one job. Different roles need different mixes of maths, code, cloud and communication. Choosing a target role early lets you decide what to practise first and which jobs to apply for.

### The T-shaped profile

```
  broad:  Python | SQL | statistics | ML | LLMs | deployment | ethics     <- the whole course
                         │
                         │  deep: ONE area (e.g. RAG systems, forecasting, MLOps)
                         ▼                                            <- your portfolio
```

### How to pick a role

| If you enjoy... | Look at |
|---|---|
| Finding answers in data and explaining them | Data Analyst, Data Scientist |
| Building reliable pipelines | Data Engineer, MLOps |
| Writing code that ships models into products | ML Engineer, AI / LLM Engineer |
| Reading papers and running experiments | Research Engineer |
| Talking to users and deciding what to build | AI Product Manager, Solutions Engineer |

### Worked example: a student's plan

Ruwan likes building things and talking to people. He picks **AI / LLM Engineer**. From the table he needs files 01 to 05, 11, 15 and 18 to 29. He builds a RAG assistant over his university handbook (file 23), adds an evaluation set (file 26), deploys it in Docker (file 28) and lists it first on his CV. In six months he has both breadth (the course) and depth (one strong project).

### Where you'll meet it in real work

Job titles differ by company. A "data scientist" at one firm does the work of an "ML engineer" at another. Always read the **skills list** in the posting rather than the title.

### Common mistakes

- Thinking you need a PhD for every role. Research roles often do; applied roles value projects and engineering.
- Applying for everything with the same CV.

> **සිංහලෙන්:** AI වල වැඩ කරනවා කියන්නේ එක රස්සාවක් නෙවෙයි. Data Analyst, Data Engineer, ML Engineer, LLM Engineer වගේ ගොඩක් භූමිකාවන් තියෙනවා. T අකුරක් වගේ හිතන්න: උඩින් පළල් දැනුම (මේ පාඩම් මාලාව), පහළට ගැඹුරු එක දක්ෂතාවයක් (ඔයාගේ projects). උදාහරණයක් විදියට රුවන් LLM Engineer කෙනෙක් වෙන්න තීරණය කරලා, විශ්වවිද්‍යාලයේ handbook එක උඩ RAG assistant එකක් හදනවා. රැකියා දැන්වීමක title එකට වඩා skills ලැයිස්තුව කියවන්න.

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

### Why it exists

"I know ML" is vague. A skills matrix turns it into a checklist you can score honestly, so you know what to study next and what to show an employer.

### Worked example: a self-assessment

Score yourself 0 (never done) to 3 (could teach it) on each row.

| Area | My score | Evidence I can show |
|---|---|---|
| Python | 2 | Two scripts on GitHub |
| SQL | 1 | Only SELECT and WHERE |
| Git | 2 | Own repo, one pull request |
| Statistics | 1 | Mean and median, no hypothesis tests |
| ML | 2 | Churn model with cross-validation |
| Deep learning | 0 | Nothing yet |
| LLMs | 1 | Used ChatGPT, called an API once |

Total = 2 + 1 + 2 + 1 + 2 + 0 + 1 = **9 out of 21**. The lowest scores are deep learning (0), SQL (1), statistics (1) and LLMs (1). Plan: next month do SQL joins and window functions ([file 03](03-developer-tools.md)); the month after, statistics tests ([file 07](07-math-probability-statistics.md)); then file 15. Re-score after each month.

### Where you'll meet it in real work

Managers use the same idea in hiring rubrics and promotion ladders: "can explain", "can do with help", "can lead". If you collect evidence (a repo, a write-up), you are ready for those conversations.

### Common mistakes

- Scoring on how much you have *watched*, not what you can *do*. Evidence means code or results.
- Trying to raise every row at once. Pick the two lowest and work on those.

> **සිංහලෙන්:** "මම ML දන්නවා" කියන එක අපැහැදිලියි. ඒ නිසා වගුවක් හදාගෙන හැම පේළියටම 0 ඉඳන් 3 දක්වා ලකුණු දෙන්න, හැබෑවටම කරලා පෙන්නන්න පුළුවන් දේට විතරයි ලකුණු දෙන්න. උදාහරණයක් විදියට Python 2, SQL 1, Deep learning 0 වගේ ලකුණු 7ක එකතුව 21න් 9යි. අඩුම ලකුණු දෙක තෝරගෙන ඒවා මුලින් ඉගෙන ගන්න, මාසෙන් මාසෙට ආයෙත් ලකුණු දාලා බලන්න.

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

### Why it exists

A degree or certificate says what you studied. A project shows what you can **do**. For a beginner with no job history, a good portfolio is the strongest evidence.

### Worked example: a project ladder on 10 hours a week

| Projects | Weeks each | Weeks |
|---|---|---|
| 1 and 2 (analysis, A/B test) | 2 | 4 |
| 3 and 4 (churn, image classifier) | 3 | 6 |
| 5 (Sinhala text classification) | 3 | 3 |
| 6 (RAG assistant) | 3 | 3 |
| 7 (agent with tools) | 3 | 3 |
| 8 (fine-tuning or evaluation tool) | 2 | 2 |

Total = 4 + 6 + 3 + 3 + 3 + 2 = **21 weeks, about 5 months**, giving you 8 projects on GitHub. Like cricket training: under-13, under-19, club, then national team. A house-price notebook is the under-13 match; a deployed RAG system with evaluation is the national side.

### A README skeleton to copy

```
# Project name: one-line description
## Problem        (who has it, why it matters)
## Data           (source, size, licence, how you cleaned it)
## Approach       (baseline -> improvements)
## Results        (table + chart, with numbers)
## Limitations    (what fails, what you would do next)
## How to run     (3 commands)
```

### Where you'll meet it in real work

Recruiters and engineers skim a repository for about a minute. A clear README, a live demo link and honest limitations make them continue; a bare notebook makes them leave.

### Common mistakes

- Ten half-finished tutorial copies instead of three finished, original projects.
- Reporting only the best number. Show the baseline and what failed.
- Using only toy datasets. A local problem (Sinhala text, Sri Lankan tourism data) makes you memorable.
- Leaving API keys in the code.

> **සිංහලෙන්:** Cricket ක්‍රීඩකයෙක් වෙන්න පොත් කියවලා විතරක් බැහැ, nets වල practice කරන්න ඕනේ. මුලින් under-13, ඊට පස්සේ under-19, club, අන්තිමට national team. Projects වලත් ඒ වගේමයි. House price prediction කියන්නේ under-13 මැච් එක, FastAPI + Docker වලින් deploy කරපු RAG system එකක් evaluation එක්ක තියෙන්නේ national team එකේ මට්ටමේ. සතියකට පැය 10ක් දුන්නොත් සති 21කින් (මාස 5ක් විතර) projects 8ක් GitHub එකේ තියෙනවා. Tutorial 10ක් copy කරනවාට වඩා ඔයාගේම හොඳ projects 3ක් හොඳයි.

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

### Why it exists

Before anyone talks to you, a person (or a filter) scans your CV for about a minute. The CV, GitHub and LinkedIn have one job: make that minute convincing.

### Worked example: rewriting a bullet

Formula: **action verb + what you built + how + a number**.

| Weak | Strong |
|---|---|
| "Worked on a chatbot" | "Built a customer-support chatbot using retrieval over 200 FAQ pages" |
| "Improved the model" | "Raised F1 from 0.71 to 0.82 by adding class weights and tuning the threshold on a validation set" |
| "Used Docker" | "Packaged the API with Docker and deployed it to a free cloud tier; responses average under 1 second" |

Only write numbers you really measured. Interviewers will ask how you got them.

### A one-page CV checklist

- Contact and links at the top (GitHub, LinkedIn)
- Projects before experience (for students)
- Each project: 2 to 3 bullets, each with a result
- Skills list that matches the job posting honestly
- No photo, no long paragraphs; PDF format

### Where you'll meet it in real work

Many companies run automatic keyword filters before a human sees the CV, so mirror the job description's words where they are true (for example "PyTorch", "RAG", "SQL").

### Common mistakes

- A skills list of 40 tools you touched once.
- Dead links, an empty GitHub profile, or public repositories with secrets in them.
- Copying a friend's CV. Interviewers ask about every line.

> **සිංහලෙන්:** CV එක කියවන්නේ විනාඩියක් විතරයි, ඒ නිසා හැම bullet එකකම ඔයා කළ දේ සහ ප්‍රතිඵලයේ අංකයක් තියෙන්න ඕනේ. "Chatbot එකක් හැදුවා" කියනවාට වඩා "FAQ පිටු 200ක් උඩ retrieval සහිත chatbot එකක් හදලා F1 0.71 ඉඳන් 0.82 දක්වා වැඩි කළා" කියන එක ගොඩක් හොඳයි. අංක ලියන්නේ ඔයා හරියටම මැනපු ඒවා විතරයි, මොකද interview එකේදී ඒවා ගැන අහනවා. GitHub එකේ හොඳම repositories 3ක් 6ක් pin කරන්න, API keys code එකේ තියන්න එපා.

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

### Why it exists

Interviews test whether you can think and communicate under pressure. Practising the usual question types means that on the day you spend your energy on the problem, not on panic.

### An answer template for ML concept questions

1. **Definition** in one sentence.
2. **Intuition** with an everyday example.
3. **Example with numbers** or a tiny code idea.
4. **Trade-off or pitfall** (shows depth).

### Worked example: the Bayes medical-test question

A disease affects 1% of people. A test is positive for 90% of sick people and also (falsely) positive for 9% of healthy people. You test positive. What is the chance you are sick?

1. Sick and positive: 0.01 × 0.90 = **0.009**
2. Healthy and positive: 0.99 × 0.09 = **0.0891**
3. P(sick | positive) = 0.009 / (0.009 + 0.0891) = 0.009 / 0.0981 ≈ **0.092**, about 9%

Despite a "90% accurate" test, only about 9% of positives are truly sick, because the disease is rare. Interviewers love this one.

### A four-week preparation plan

| Week | Focus |
|---|---|
| 1 | Python, Pandas and SQL problems, 30 minutes a day |
| 2 | ML concept list above: answer each aloud in 2 minutes |
| 3 | Walk through two of your own projects, including what failed |
| 4 | Mock interviews with a friend; ML system design prompts; STAR stories |

### Where you'll meet it in real work

The same skills you practise here (explaining a trade-off, asking clarifying questions, structuring a design) are what you use in design reviews and stand-ups.

### Common mistakes

- Memorising definitions without being able to give an example.
- Going silent when stuck. Think aloud; interviewers often reward the process.
- Not asking clarifying questions in system design ("how many users? what latency?").
- Pretending to know. "I don't know, but I would try X" is a good answer.

> **සිංහලෙන්:** Interview එකට ලෑස්ති වෙන්නේ ප්‍රශ්න වර්ග පුරුදු කරලා. ML concept එකක් අහපුවාම මුලින් එක වාක්‍යයකින් අර්ථය, ඊට පස්සේ දෛනික උදාහරණයක්, ඊට පස්සේ අංක සහිත උදාහරණයක්, අන්තිමට trade-off එකක් කියන්න. Bayes ප්‍රශ්නය බලන්න: රෝගය 1%ක්, test එක රෝගීන්ගෙන් 90%කට positive, නිරෝගීන්ගෙන් 9%කටත් positive. Positive ආවොත් ඇත්තටම රෝගියෙක් වෙන්න තියෙන ඉඩ 0.009 ÷ 0.0981 ≈ 9%යි. දන්නේ නැති දේ දන්නවා කියන්න එපා, "දන්නේ නැහැ, ඒත් මම මේක try කරනවා" කියන එක හොඳ උත්තරයක්.

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

### Why it exists

Certifications give a clear syllabus and a deadline, and they help your CV get past the first filter when you have little experience. They are a **supplement** to projects, not a substitute.

### How this course connects to the NCA-GENL domains

| Exam area | Where to learn it | Where to practise on this site |
|---|---|---|
| ML fundamentals | Files 11 to 13 | Exam Practice, domain 1 |
| Neural networks and Transformers | Files 15, 17, 19 | Exam Practice, domain 2 |
| Tokenisation and LLM inference | Files 18, 20, 27 | Exam Practice, domain 3 |
| Prompting and agents | Files 22, 24 | Exam Practice, domain 4 |
| Embeddings and RAG | File 23 | Exam Practice, domain 5 |
| Training and adaptation | File 21 | Exam Practice, domain 6 |
| Evaluation | Files 13, 26 | Exam Practice, domain 7 |
| NVIDIA stack and deployment | Files 27, 28 | Exam Practice, domain 8 |
| Trustworthy AI | File 29 | Exam Practice, domain 9 |

### A simple study plan

1. Read the official study guide and note the domains and weights.
2. Study the matching lessons in order; mark topics as learned on this site.
3. Take a practice question set per domain, and write down every wrong answer with the reason.
4. Take a timed mock exam; revise the weakest domain; repeat.

Exam formats and rules change, so always check the official page for the current details.

### Where you'll meet it in real work

Some employers and partner programmes ask for a particular certificate, so it can unlock interviews. The knowledge itself matters more than the badge, as interviewers will ask follow-up questions.

### Common mistakes

- Memorising answer dumps. The exam uses scenario questions; if you only memorised, new wording defeats you.
- Collecting certificates instead of building projects.
- Studying only your favourite domain.

**Exam angle:** NCA-GENL style questions are multiple-choice and scenario-based ("which technique would you use when..."). Learn the *why* behind each concept, not only its name.

> **සිංහලෙන්:** Certificate එකක් කියන්නේ ඉගෙනීමට පැහැදිලි syllabus එකක් සහ කාල සීමාවක් දෙන දෙයක්, ඒක projects වලට විකල්පයක් නෙවෙයි. NCA-GENL exam එකට මේ පාඩම් මාලාවේ ෆයිල් 11 ඉඳන් 29 දක්වා ගැලපෙනවා, ඒ වගේම මේ website එකේ Exam Practice කොටසේ domain එකිනෙකට ප්‍රශ්න තියෙනවා. ප්‍රශ්න වල උත්තර ගබඩා කරගන්න එපා, ඇයි කියලා තේරුම් ගන්න. Exam එකේ ප්‍රශ්න වචන වෙනස් වුණාම ගබඩා කරපු උත්තර වැඩ කරන්නේ නැහැ.

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

### Why it exists

The first weeks at a new workplace are confusing, and interns often waste them being afraid to ask or trying to be perfect. A simple plan shows what "good" looks like.

### Worked example: the 15-minute rule for questions

If you are stuck, spend 15 minutes trying alone (read the docs, search the code, print values). Then ask, and show what you tried: "I'm seeing X. I checked A and B. My guess is C. Could you point me to where this is configured?" Over a 90-day internship that rule saves you hours and makes seniors happy to help.

### A weekly update to send your mentor (copy it)

```
This week I finished:   (1-3 bullets, with numbers)
Next week I will:       (1-3 bullets)
I am blocked by:        (or "nothing")
Question for you:       (one, specific)
```

### A picture of the 90 days

```
Day 1-30:   learn  ──►  small first win
Day 31-60:  own a scoped task  ──►  regular updates
Day 61-90:  deliver  ──►  present + document  ──►  ask for feedback
```

### Where you'll meet it in real work

Your final presentation (problem, approach, results, next steps, one chart) is also what you will use for your CV bullet and for the return-offer discussion.

### Common mistakes

- Staying silent about a blocker for days.
- Delivering a model without data sanity checks or a baseline.
- Forgetting documentation, so nobody can reuse your work when you leave.

> **සිංහලෙන්:** Internship එකේ මුල් සති ටිකේ බය වෙන්න එපා. ගැටලුවක් ආවොත් විනාඩි 15ක් තනියම උත්සාහ කරලා, ඊට පස්සේ "මම මේක බැලුවා, A සහ B try කළා, මගේ අනුමානය C" කියලා mentor ගෙන් අහන්න. සතියෙන් සතියට කෙටි update එකක් යවන්න: මම කළේ මොනවාද, ඊළඟ සතියේ කරන්නේ මොනවාද, මට තියෙන බාධාව මොකක්ද කියලා. දවස් 90 ඇතුළත ඔයා කරපු වැඩේ document කරන්න, එතකොට ඔයා ගියාට පස්සේත් අනිත් අයට ඒක පාවිච්චි කරන්න පුළුවන්.

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

### Why it exists

There are hundreds of free courses and books. Without an order, beginners jump between them (**tutorial hell**) and finish none. A staged list keeps you moving.

### A suggested order

| Stage | Pick one or two | Goal |
|---|---|---|
| Months 1 to 2 | Kaggle Learn (Python, Pandas, SQL); Google ML Crash Course | Hands-on basics |
| Months 3 to 4 | Andrew Ng's ML Specialization or *Introduction to Statistical Learning* | ML theory and practice |
| Months 5 to 6 | fast.ai or Karpathy's *Zero to Hero*; *Dive into Deep Learning* | Deep learning, from scratch |
| Months 7 to 9 | Hugging Face courses; *Build a Large Language Model (From Scratch)*; NVIDIA DLI | LLMs and applications |
| Always | Kaggle, Hugging Face Hub, LeetCode / HackerRank | Practice |

### The 70/30 rule

Spend about 70% of your study time **doing** (coding, projects, exercises) and 30% watching or reading. If the ratio flips, you are probably in tutorial hell.

### Where you'll meet it in real work

The habit of picking one resource, finishing it, and applying it in a project is exactly how professionals learn new tools on the job.

### Common mistakes

- Starting a fourth course before finishing the first.
- Watching at 2x speed without pausing to run the code.
- Ignoring free resources from universities because they look "academic". Stanford lectures are some of the clearest explanations available.

> **සිංහලෙන්:** නොමිලේ courses සහ පොත් සිය ගණනක් තියෙනවා. පිළිවෙලක් නැතුව එකක් අතහැරලා තව එකකට පැනපුවොත් කිසිම එකක් ඉවර වෙන්නේ නැහැ (tutorial hell). ඒ නිසා එක එක අදියර වලට එක-දෙක බැගින් තෝරාගන්න, ඒවා ඉවර කරන්න. ඔයාගේ ඉගෙනීමේ කාලයෙන් 70%ක් code කරන්න, projects කරන්න වෙන් කරන්න, 30%ක් විතරක් video බලන්න, කියවන්න. Video එක 2x වේගයෙන් බලලා code එක run නොකර ඉන්නවා නම් ඉගෙනීම වෙන්නේ නැහැ.

---

## 21. Final words

You've now seen the whole map: from what a variable is, all the way to how frontier LLMs are trained, served, evaluated and governed.

1. **Foundations compound.** Maths, statistics, Python and ML fundamentals make every new tool easy to learn.
2. **Build things.** Understanding comes from doing. Every concept here becomes real when you implement it.
3. **Evaluate honestly.** The most valuable skill in AI is knowing whether something actually works.
4. **Think about people.** Who benefits, who could be harmed, and how to make AI fair, safe and useful.
5. **Keep going.** Nobody understands everything. The best practitioners keep learning, stay curious, and aren't afraid to say "I don't know yet".

Good luck. Go build something!

### A four-week starter plan

| Week | Do this |
|---|---|
| 1 | Pick a target role (section 13) and score yourself on the skills matrix (section 14) |
| 2 | Choose project 1 from section 15 and write its README first |
| 3 | Build a baseline, evaluate honestly, write down what failed |
| 4 | Deploy a demo, post a short write-up, update your CV with one numbered bullet |

Then repeat with the next project. After a few months of this loop you will have more proof of skill than most people who only collect certificates.

### Why this matters

Every file in this course connected an idea to an action: a formula to a worked example, a concept to code, a model to an evaluation. That habit, not any single algorithm, is what lasts. Tools will change many times in your career; the habit of checking whether something truly works will not.

> **සිංහලෙන්:** ඔයා දැන් නිකම් variable එකක් කියන්නේ මොකක්ද කියන තැන ඉඳන් LLM එකක් train කරන්නේ, serve කරන්නේ, evaluate කරන්නේ කොහොමද කියන තැන දක්වා සිතියම පුරාම ඇවිදලා ඇවිත් ඉන්නවා. ඊළඟට කරන්න ඕනේ ලේසියි: target role එකක් තෝරන්න, project එකක් පටන් ගන්න, baseline එකකින් ආරම්භ කරලා අවංකව evaluate කරන්න. හැමෝම හැම දෙයක්ම දන්නේ නැහැ, හොඳම අය "මම තාම දන්නේ නැහැ" කියන්න බය නැති අය. ඉතින් දිගටම ඉගෙන ගන්න, යම්කිසි දෙයක් හදන්න පටන් ගන්න.

```quiz
[
{"q": "An RL agent receives rewards 5, 5, 5 and the discount factor is γ = 0.5. What is the return G?", "options": ["15", "8.75", "7.5", "5"], "answer": 1, "why": "G = 5 + 0.5×5 + 0.5²×5 = 5 + 2.5 + 1.25 = 8.75. 15 would be the sum with γ = 1 (no discounting), and 5 would be γ = 0 where only the first reward counts."},
{"q": "In Q-learning, Q(s,a) = 2, the reward is 10, the best Q in the next state is 5, α = 0.1 and γ = 0.9. What is the new Q(s,a)?", "options": ["14.5", "12.5", "3.25", "2.9"], "answer": 2, "why": "Target = 10 + 0.9×5 = 14.5, TD error = 14.5 − 2 = 12.5, new Q = 2 + 0.1×12.5 = 3.25. 14.5 is only the target, not the updated value; the update moves just a fraction α of the way."},
{"q": "Why does PPO clip the probability ratio between the new and old policy?", "options": ["To remove the need for a reward signal", "To make the model smaller", "To make the reward larger", "To stop the policy changing too much in one update, keeping training stable"], "answer": 3, "why": "Clipping caps how much one update can improve the objective, so the policy cannot lurch far from the old one. It does not change the reward, remove the need for it or shrink the model."},
{"q": "Premium members spent Rs. 15,000 vs Rs. 5,000 for others. Before joining, the future members already spent Rs. 12,000 and the others Rs. 5,000. What is the difference-in-differences estimate of the membership effect?", "options": ["Rs. 3,000", "Rs. 7,000", "Rs. 0", "Rs. 10,000"], "answer": 0, "why": "(15,000 − 12,000) − (5,000 − 5,000) = 3,000. Rs. 10,000 is the naive after-only difference, which wrongly credits membership with the pre-existing gap caused by confounding."},
{"q": "A prior of average 35 is worth 10 innings; a new player has 2 innings averaging 90. What is the simple blended estimate?", "options": ["About 62.5", "About 90", "About 44.2", "About 35"], "answer": 2, "why": "(10×35 + 2×90)/12 = 530/12 ≈ 44.2. The estimate stays close to the prior because there is little data; 62.5 would be the plain average of 35 and 90, ignoring the evidence weights."},
{"q": "A sequence becomes 10 times longer. Roughly how does the work of self-attention compare with that of a state-space model?", "options": ["Attention grows 10 times, the SSM about 100 times", "Neither grows", "Both grow 10 times", "Attention grows about 100 times, the SSM about 10 times"], "answer": 3, "why": "Attention is O(n²), so 10× longer means about 100× more work, while an SSM is O(n), about 10× more. The reverse option confuses which model scales quadratically."},
{"q": "A model with 6 layers and d = 384 has about how many parameters in its Transformer blocks (using 12d² per block)?", "options": ["About 10.6 million", "About 106 million", "About 884,000", "About 1.8 million"], "answer": 0, "why": "12 × 384² = 1,769,472 per block, and × 6 blocks ≈ 10.6 million. 1.8 million is a single block; forgetting to multiply by the layer count is the tempting mistake."},
{"q": "Which statement about mechanistic interpretability is correct?", "options": ["One neuron always represents exactly one concept", "Superposition means models can store more concepts than they have neurons, so neurons are often polysemantic", "A model's chain-of-thought is always a faithful record of its computation", "Probing proves a feature is used by the model"], "answer": 1, "why": "Superposition overlaps many features across neurons. Single-concept neurons are the exception, chain-of-thought can be unfaithful, and probing shows information is present, not that the model uses it (patching tests that)."}
]
```

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
| Discount factor effect (γ = 0 greedy, γ near 1 far-sighted) | How much future rewards count |
| PPO clipping, probability ratio | Limits how far one update can move the policy |
| Over-smoothing (GNN) | Too many layers make all node embeddings alike |
| 12d² rule | Parameters per Transformer block (4d² attention + 8d² feed-forward) |
| Intervention test | Changing the supposed cause to check that behaviour changes |
| Tutorial hell | Endless courses without building anything |
| 15-minute rule | Try alone for 15 minutes, then ask with what you tried |

**Reference:** [31-glossary.md](31-glossary.md): every term in the course, A to Z.
