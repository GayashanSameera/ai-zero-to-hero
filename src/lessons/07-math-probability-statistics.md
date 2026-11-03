# 07: Maths 4: Probability, Statistics, and Information Theory

> **Before you start:** [04](04-math-numbers-and-functions.md) (fractions, Σ, mean, logs, e, exp), [05](05-math-linear-algebra.md) (vectors), [06](06-math-calculus.md) (integral = area).
>
> **After this file you can:** summarise data with mean, median and standard deviation; reason with probabilities and Bayes' theorem; recognise the main distributions; run and interpret hypothesis tests and A/B tests; and understand softmax, entropy, cross-entropy and KL divergence, the maths behind how classifiers and LLMs are trained.

**Why?** Data is noisy and the world is uncertain. **Statistics** helps us summarise data and decide what's real versus random chance. **Probability** is the language models use to express uncertainty. An LLM, for example, outputs a probability for every possible next word.

---

## Table of contents

**Part 1: Descriptive statistics (summarising data)**
1. [Population vs sample](#1-population-vs-sample)
2. [Measures of centre: mean, median, mode](#2-measures-of-centre)
3. [Measures of spread: range, variance, standard deviation](#3-measures-of-spread)
4. [Percentiles, quartiles, IQR, outliers](#4-percentiles-quartiles-iqr-outliers)
5. [Shape: skewness](#5-shape-skewness)

**Part 2: Probability**
6. [What is probability?](#6-what-is-probability)
7. [Probability rules: and, or, not](#7-probability-rules)
8. [Conditional probability and independence](#8-conditional-probability-and-independence)
9. [Bayes' theorem](#9-bayes-theorem)
10. [Random variables and expected value](#10-random-variables-and-expected-value)
11. [Probability distributions](#11-probability-distributions)
12. [The normal distribution and z-scores](#12-the-normal-distribution-and-z-scores)
13. [Softmax: turning scores into probabilities](#13-softmax)

**Part 3: Relationships between variables**
14. [Covariance and correlation](#14-covariance-and-correlation)
15. [Correlation is not causation](#15-correlation-is-not-causation)

**Part 4: Inferential statistics (drawing conclusions)**
16. [Sampling, Law of Large Numbers, Central Limit Theorem](#16-sampling-lln-clt)
17. [Confidence intervals](#17-confidence-intervals)
18. [Hypothesis testing and p-values](#18-hypothesis-testing-and-p-values)
19. [Common tests: t-test, chi-square](#19-common-tests)
20. [A/B testing](#20-ab-testing)
21. [Maximum Likelihood (MLE) and MAP](#21-maximum-likelihood-and-map)

**Part 5: Information theory**
22. [Information and entropy](#22-information-and-entropy)
23. [Cross-entropy: the classifier's loss](#23-cross-entropy)
24. [KL divergence](#24-kl-divergence)
25. [Mutual information](#25-mutual-information)

26. [Check yourself](#26-check-yourself)
27. [New words in this file](#27-new-words-in-this-file)

---

# Part 1: Descriptive statistics

## 1. Population vs sample

- **Population:** *everyone/everything* you care about. Example: all 22 million people in Sri Lanka.
- **Sample:** a smaller group you actually measure. Example: 1,000 people you surveyed.

We use a sample to **estimate** facts about the population, because measuring everyone is too expensive.

- A number describing a **population** is a **parameter** (written in Greek: μ for mean, σ for standard deviation).
- A number computed from a **sample** is a **statistic** (written in Latin letters: x̄ for mean, s for standard deviation).

(Note: "parameter" here means a population fact. In ML, "parameter" means a model's learned number. Same word, two meanings. Context makes it clear.)

**Sampling bias:** if your sample isn't representative, your conclusions are wrong. Surveying only university students about national income gives a biased answer. Models trained on biased samples become biased models (file 29).

---

## 2. Measures of centre

Data: daily sales (in items) for 7 days: **[2, 3, 3, 5, 7, 8, 100]**

### Mean (average)

Sum ÷ count ([file 04](04-math-numbers-and-functions.md#14-summation-σ-and-product-π-notation)):
(2+3+3+5+7+8+100) / 7 = 128 / 7 ≈ **18.3**

### Median

The **middle** value when sorted. With 7 values, it's the 4th: **5**.
With an even count, average the two middle values: median of [1, 3, 5, 9] = (3+5)/2 = 4.

### Mode

The **most frequent** value: **3** (appears twice). Useful for categories: "the most common city".

### Which to use?

That 100 is an **outlier** (an unusually extreme value, maybe a bulk order). It drags the mean up to 18.3, which doesn't describe a "typical" day at all. The median (5) is **robust**: outliers barely affect it.

> **Rule:** for skewed data or data with outliers (incomes, house prices, wait times), report the **median**. For symmetric data, mean and median are similar.

```python
import numpy as np
data = [2, 3, 3, 5, 7, 8, 100]
np.mean(data)     # 18.29
np.median(data)   # 5.0
from statistics import mode
mode(data)        # 3
```

---

## 3. Measures of spread

Two classes both average 70 marks:
- Class A: [68, 69, 70, 71, 72]: everyone similar
- Class B: [40, 55, 70, 85, 100]: very different

The mean alone hides this. We need **spread** (also called **dispersion** or **variability**).

### Range

max − min. A: 72 − 68 = 4. B: 100 − 40 = 60. Simple, but sensitive to outliers.

### Variance

**Idea:** the average **squared** distance from the mean.

```
            Σ (xᵢ − x̄)²
variance = ────────────
                n
```

**Worked example**, Class B: mean = 70

| xᵢ | xᵢ − x̄ | (xᵢ − x̄)² |
|---|---|---|
| 40 | −30 | 900 |
| 55 | −15 | 225 |
| 70 | 0 | 0 |
| 85 | 15 | 225 |
| 100 | 30 | 900 |
| | **sum** | **2250** |

Variance = 2250 / 5 = **450** (marks²)

Why square? Distances above and below the mean would cancel out if we just added them (−30 + 30 = 0). Squaring makes everything positive.

**n vs n − 1:** for a **sample**, we usually divide by **n − 1** instead of n (called **Bessel's correction**), because a sample tends to underestimate the population's spread slightly. With n − 1: 2250 / 4 = 562.5. NumPy's `np.var` uses n by default; pandas `.var()` uses n − 1. For big n, the difference is tiny.

### Standard deviation (σ or s)

**Idea:** the square root of the variance. It brings units back to normal ("marks" instead of "marks²").

Class B: √450 ≈ **21.2 marks**. Class A: variance = (4+1+0+1+4)/5 = 2 → std ≈ **1.4 marks**.

**Interpretation:** "a typical student is about 21 marks away from the average" (class B) vs "about 1.4 marks away" (class A).

```python
np.std([40, 55, 70, 85, 100])          # 21.21 (divides by n)
np.std([40, 55, 70, 85, 100], ddof=1)  # 23.72 (divides by n−1)
```

---

## 4. Percentiles, quartiles, IQR, outliers

**Percentile:** the value below which a given percentage of data falls. If your exam score is at the **90th percentile**, you scored higher than 90% of students.

**Quartiles** split sorted data into four equal parts:
- **Q1** (25th percentile): a quarter of the data is below this
- **Q2** (50th percentile): the median
- **Q3** (75th percentile)

**IQR (Interquartile Range)** = Q3 − Q1: the spread of the middle 50%. Robust to outliers.

**Outlier rule (Tukey's fences):** a value is an outlier if it's below **Q1 − 1.5×IQR** or above **Q3 + 1.5×IQR**.

**Example:** data = [2, 3, 3, 5, 7, 8, 100]
Q1 = 3, Q3 = 7.5 (using a common method), IQR = 4.5
Upper fence = 7.5 + 1.5 × 4.5 = 14.25 → **100 is an outlier** ✓

```python
q1, q3 = np.percentile(data, [25, 75])
iqr = q3 - q1
outliers = [x for x in data if x < q1 - 1.5*iqr or x > q3 + 1.5*iqr]   # [100]
```

**Box plot** (file 09) draws exactly these: a box from Q1 to Q3, a line at the median, "whiskers" to the fences, and dots for outliers.

```
   ├──────[  |   ]──────┤          •
  min    Q1  Q2  Q3    max      outlier
```

**Latency percentiles** (p50, p95, p99) are used to measure AI system speed (file 27): "p99 latency = 2s" means 99% of requests finish within 2 seconds.

---

## 5. Shape: skewness

- **Symmetric:** left and right sides mirror each other. Mean ≈ median. (Heights.)
- **Right-skewed (positive skew):** long tail to the right. A few huge values. **Mean > median.** (Incomes, house prices, number of followers.)
- **Left-skewed (negative skew):** long tail to the left. **Mean < median.** (Age at retirement, scores on an easy exam.)

```
Symmetric          Right-skewed           Left-skewed
    ▄█▄              █▄                        ▄█
   ▄███▄             ██▄▄                   ▄▄██
  ▄█████▄            ████▄▄▄▄___       ___▄▄▄▄████
```

Skewed features are often fixed with a **log transform** ([file 04](04-math-numbers-and-functions.md#13-logarithms)) before modelling (file 10).

---

# Part 2: Probability

## 6. What is probability?

**Idea:** **probability** is a number from **0 to 1** saying how likely something is.
- 0 = impossible; 1 = certain; 0.5 = 50/50

**Basic formula** (when all outcomes are equally likely):

```
P(event) = number of ways it can happen / total number of possible outcomes
```

**Examples:**
- Fair coin lands heads: P = 1/2 = 0.5
- Rolling a 6 on a die: P = 1/6 ≈ 0.167
- Rolling an even number: P = 3/6 = 0.5 (2, 4 or 6)

**Vocabulary:**
- **Experiment:** something with an uncertain result (rolling a die)
- **Outcome:** one possible result (rolling a 4)
- **Sample space:** all possible outcomes {1, 2, 3, 4, 5, 6}
- **Event:** a set of outcomes we care about ("even number" = {2, 4, 6})

**Frequency view:** probability = the long-run fraction. If 30 out of 1,000 emails are spam, we estimate P(spam) = 0.03. This is how models learn probabilities from data.

**All probabilities over all possible outcomes must add up to 1.**

---

## 7. Probability rules

### NOT (complement)

P(not A) = 1 − P(A)
P(not rolling a 6) = 1 − 1/6 = 5/6

### AND (both happen)

For **independent** events (one doesn't affect the other):
P(A and B) = P(A) × P(B)

Two coin flips both heads: 0.5 × 0.5 = 0.25.

### OR (at least one happens)

P(A or B) = P(A) + P(B) − P(A and B)

(Subtract the overlap so it isn't counted twice.)

Drawing a card that is a heart OR a king: 13/52 + 4/52 − 1/52 (king of hearts) = 16/52 ≈ 0.31

If A and B **can't both happen** (**mutually exclusive**), the overlap is 0: P(roll 1 or roll 2) = 1/6 + 1/6 = 1/3.

---

## 8. Conditional probability and independence

**Idea:** **conditional probability** P(A | B) = "probability of A **given that** B has happened". The bar | means "given".

```
             P(A and B)
P(A | B) = ────────────
                P(B)
```

**Example:** a class of 100 students:

| | Passed | Failed | Total |
|---|---|---|---|
| Studied | 45 | 5 | 50 |
| Didn't study | 15 | 35 | 50 |
| Total | 60 | 40 | 100 |

- P(passed) = 60/100 = 0.6
- P(passed | studied) = 45/50 = **0.9**
- P(passed | didn't study) = 15/50 = **0.3**

Knowing that someone studied changes the probability a lot. This kind of table is called a **contingency table**.

**Independence:** A and B are independent if knowing B doesn't change A's probability: P(A | B) = P(A). Here, passing and studying are clearly **not** independent.

**Why it matters:** ML classifiers basically estimate conditional probabilities: P(spam | the words in this email), P(cat | these pixels). An LLM computes P(next word | all previous words) (file 20).

---

## 9. Bayes' theorem

**Idea:** Bayes' theorem lets you **flip** a conditional probability: from P(B | A) to P(A | B). It's how you **update your belief** when you see new evidence.

```
              P(B | A) × P(A)
P(A | B) = ─────────────────────
                  P(B)
```

- **P(A)** = **prior**: your belief before seeing evidence
- **P(B | A)** = **likelihood**: how likely the evidence is if A is true
- **P(A | B)** = **posterior**: your updated belief after seeing evidence
- **P(B)** = total probability of seeing the evidence at all

### The famous medical test example (very commonly asked in interviews)

- A disease affects **1%** of people. → P(disease) = 0.01
- The test catches **90%** of sick people. → P(positive | disease) = 0.90
- The test wrongly says positive for **5%** of healthy people. → P(positive | healthy) = 0.05

**You test positive. What's the chance you actually have the disease?**

Most people guess ~90%. Let's calculate with **1,000 people**:

| | Count |
|---|---|
| Sick | 1% of 1000 = **10** |
| Healthy | **990** |
| Sick AND positive | 90% of 10 = **9** |
| Healthy AND positive (false alarms) | 5% of 990 = **49.5** |
| Total positive | 9 + 49.5 = **58.5** |

P(disease | positive) = 9 / 58.5 ≈ **0.154 = 15.4%**

Only about 15%! Because the disease is rare, false alarms from the huge healthy group outnumber the true cases.

With the formula: P(B) = 0.9 × 0.01 + 0.05 × 0.99 = 0.009 + 0.0495 = 0.0585 → 0.009 / 0.0585 = 0.154 ✓

**Lesson for ML:** when the thing you're detecting is rare (fraud, disease), even an accurate-sounding model produces many **false positives**. This is the **base rate fallacy**, and it's why we need precision and recall (file 13), not just accuracy.

**Naive Bayes** (file 12) is a classifier built directly on this theorem.

---

## 10. Random variables and expected value

**Random variable:** a variable whose value comes from a random process. Written with capitals: X.
- **Discrete:** countable values (dice roll, number of customers per hour)
- **Continuous:** any value in a range (height, waiting time)

### Expected value E[X]

**Idea:** the long-run average value if you repeated the experiment forever. It's a **probability-weighted average**:

```
E[X] = Σ xᵢ × P(xᵢ)
```

**Example:** a fair die: E[X] = 1×(1/6) + 2×(1/6) + ... + 6×(1/6) = 21/6 = **3.5**

(You can never roll 3.5, but it's the long-run average.)

**Example (a decision):** a lottery ticket costs $2. 1% chance to win $100, otherwise nothing.
E[winnings] = 0.01 × 100 + 0.99 × 0 = $1. Expected profit = $1 − $2 = **−$1 per ticket**. Don't buy it.

The **variance** of a random variable is E[(X − E[X])²]: the expected squared distance from the mean, the same idea as section 3.

In ML papers you'll see the loss written as an expected value: "**E**[loss]" means "the average loss over data". In practice, it's estimated by averaging over a batch.

---

## 11. Probability distributions

**Idea:** a **probability distribution** describes how likely each possible value is.

- Discrete: a **probability mass function (PMF)** gives P(X = x) for each value.
- Continuous: a **probability density function (PDF)** gives a curve, and the probability of a range = the **area under the curve** over that range ([integral, file 06](06-math-calculus.md#15-integrals-just-the-idea)). The total area is 1. The probability of *exactly* one value (like exactly 170.000 cm) is 0. Only ranges have probability.
- **CDF (cumulative distribution function):** P(X ≤ x), the probability of being at or below x.

### Distributions you should know

| Distribution | Type | Describes | Example |
|---|---|---|---|
| **Uniform** | either | every value equally likely | fair die; random number between 0 and 1 |
| **Bernoulli** | discrete | one yes/no trial with P(yes) = p | one coin flip; one customer churns or not |
| **Binomial** | discrete | number of "yes" in n independent trials | heads in 10 flips; clicks out of 1,000 views |
| **Categorical** | discrete | one outcome out of K categories | a die roll; **an LLM picking the next token** |
| **Poisson** | discrete | count of events in a fixed time/space, given an average rate λ | customers per hour; website errors per day |
| **Normal (Gaussian)** | continuous | bell curve, values cluster around the mean | heights, measurement errors |
| **Exponential** | continuous | waiting time between random events | time until next customer |

**Binomial example:** a fair coin flipped 10 times. P(exactly 7 heads)?
The formula is C(10,7) × 0.5⁷ × 0.5³ = 120 × 0.0078 × 0.125 ≈ **0.117**
(C(10,7) = "10 choose 7" = 120 = the number of ways to pick which 7 flips are heads.)

```python
from scipy import stats
stats.binom.pmf(7, n=10, p=0.5)   # 0.117
stats.poisson.pmf(3, mu=2)        # P(exactly 3 events | average 2) ≈ 0.18
```

---

## 12. The normal distribution and z-scores

The **normal distribution** (or **Gaussian**, or **bell curve**) is the most important distribution. It's described by just two numbers: the **mean μ** (centre) and the **standard deviation σ** (width).

```
                  ▄▄█▄▄
               ▄███████▄
            ▄█████████████▄
       ▄▄▄███████████████████▄▄▄
 ─────┼─────┼─────┼─────┼─────┼─────┼─────
    μ−3σ  μ−2σ  μ−σ    μ    μ+σ  μ+2σ  μ+3σ
          |←── 68% ──→|
       |←──────── 95% ────────→|
    |←───────────── 99.7% ─────────────→|
```

### The 68-95-99.7 rule

- ~**68%** of values are within 1 standard deviation of the mean
- ~**95%** within 2 standard deviations
- ~**99.7%** within 3 standard deviations

**Example:** adult heights: μ = 170 cm, σ = 10 cm
- 68% are between 160 and 180 cm
- 95% are between 150 and 190 cm
- Someone 200 cm tall is 3σ above the mean: rarer than 0.15%

### z-score (standard score)

**Idea:** how many standard deviations a value is from the mean.

```
z = (x − μ) / σ
```

- Height 185 cm: z = (185 − 170)/10 = **1.5** (1.5 std above average)
- Height 155 cm: z = (155 − 170)/10 = **−1.5**

**Uses:**
- **Comparing different scales:** maths score 80 (class mean 70, std 5) → z = 2; English score 85 (mean 80, std 10) → z = 0.5. The maths result is more impressive relative to classmates.
- **Outlier detection:** |z| > 3 is often flagged as an outlier.
- **Standardisation** (file 10): converting every feature to z-scores, so they all have mean 0 and std 1. This is a very common preprocessing step.

The **standard normal distribution** has μ = 0 and σ = 1.

**Why normal is everywhere:** when many small independent effects add up, the total tends to be normal (this is the Central Limit Theorem, section 16). Neural network weights are often **initialised** with random normal values (file 15). Diffusion models add normal (Gaussian) **noise** to images (file 25).

---

## 13. Softmax

**Problem:** a classifier (or an LLM) produces raw scores for each class, called **logits**, like [2.0, 1.0, 0.1]. These can be any numbers: negative, bigger than 1, not summing to 1. We need probabilities.

**Softmax** converts a vector of scores into a probability distribution:

```
                  e^(zᵢ)
softmax(zᵢ) = ─────────────
                Σⱼ e^(zⱼ)
```

In words: **raise e to each score** (makes everything positive, using exp from [file 04](04-math-numbers-and-functions.md#12-exponential-growth-and-the-number-e)), then **divide by the total** (so they add to 1).

**Worked example:** logits z = [2.0, 1.0, 0.1] for [cat, dog, bird]

| class | z | e^z | ÷ total (11.212) |
|---|---|---|---|
| cat | 2.0 | 7.389 | **0.659** |
| dog | 1.0 | 2.718 | **0.242** |
| bird | 0.1 | 1.105 | **0.099** |
| | | total 11.212 | sum = 1.000 ✓ |

The biggest score gets the biggest probability, and the gaps are exaggerated ("soft" version of max).

```python
import numpy as np
def softmax(z):
    z = np.array(z)
    e = np.exp(z - z.max())   # subtracting the max avoids huge numbers (numerically stable); same result
    return e / e.sum()
softmax([2.0, 1.0, 0.1])      # [0.659, 0.242, 0.099]
```

**Temperature preview:** dividing logits by a "temperature" T before softmax controls how sharp the distribution is. T < 1 makes the top choice more dominant (more confident/deterministic); T > 1 flattens it (more random/creative). This is the "temperature" setting in LLMs ([file 20](20-how-llms-work.md)).

For two classes, softmax reduces to the **sigmoid** function ([file 04](04-math-numbers-and-functions.md#16-common-function-shapes-youll-meet-in-ai)).

---

# Part 3: Relationships between variables

## 14. Covariance and correlation

### Covariance

**Idea:** do two variables move together?
- **Positive:** when one is above its mean, the other tends to be above its mean too (height & weight).
- **Negative:** one goes up, the other tends to go down (price & quantity sold).
- **Near zero:** no linear relationship.

```
cov(X, Y) = Σ (xᵢ − x̄)(yᵢ − ȳ) / n
```

Problem: the size of covariance depends on the units, so it's hard to interpret.

### Correlation (Pearson's r)

**Idea:** covariance scaled to always be between **−1 and +1**:

```
r = cov(X, Y) / (σ_X × σ_Y)
```

| r | Meaning |
|---|---|
| +1 | perfect positive straight-line relationship |
| +0.7 | strong positive |
| +0.3 | weak positive |
| 0 | no linear relationship |
| −0.7 | strong negative |
| −1 | perfect negative |

```
r ≈ +0.9          r ≈ 0             r ≈ −0.9
      • •         •   •  •          • •
    • •             •  •              • •
  • •            •   •    •             • •
• •                •   •                  • •
```

**Worked example:** hours studied X = [1, 2, 3, 4, 5], score Y = [50, 55, 65, 70, 80]

```python
import numpy as np
x = [1, 2, 3, 4, 5]; y = [50, 55, 65, 70, 80]
np.corrcoef(x, y)[0, 1]    # 0.99: strong positive
```

⚠️ **Pearson only measures straight-line relationships.** y = x² for x from −3 to 3 has r = 0 even though y is completely determined by x. Always plot your data (file 09).

**Spearman correlation:** uses ranks instead of raw values; catches any consistently increasing/decreasing relationship and is robust to outliers.

**Correlation matrix:** a table of correlations between every pair of features, often shown as a **heatmap** (file 09). Used in EDA and feature selection (file 10).

---

## 15. Correlation is not causation

Just because two things move together doesn't mean one **causes** the other.

**Classic example:** ice cream sales and drowning deaths are positively correlated. Does ice cream cause drowning? No. **Hot weather** causes both. Hot weather is a **confounding variable** (or **confounder**): a hidden third factor affecting both.

**Other traps:**
- **Reverse causation:** cities with more police have more crime. But it's likely crime → more police, not the other way round.
- **Coincidence:** with enough variables, some will correlate by pure chance (search "spurious correlations": e.g. cheese consumption vs deaths by bedsheet tangling).

**How to establish causation:** a **randomised controlled experiment**: randomly assign people to treatment or control groups, so confounders are balanced on average. In tech, this is an **A/B test** (section 20). When experiments aren't possible, **causal inference** methods try to estimate causes from observational data (file 30).

**For ML:** most models learn **correlations**, not causes. A model might learn "patients who got a certain test are sicker", but the test doesn't cause sickness; doctors order it for sick patients. Be careful using model predictions to make decisions.

---

# Part 4: Inferential statistics

## 16. Sampling, LLN, CLT

### Law of Large Numbers (LLN)

**Idea:** as your sample gets bigger, the sample average gets closer to the true average.

Flip a coin 10 times: maybe 7 heads (70%). Flip it 10,000 times: very close to 50%.

**Implication:** more data → more reliable estimates. Small samples can mislead.

### Central Limit Theorem (CLT)

**Idea:** if you take many random samples and compute each sample's mean, those **sample means form a normal distribution** around the true mean, **even if the original data isn't normal**, as long as the samples are reasonably large (n ≥ 30 is a common rule of thumb).

The spread of those sample means is the **standard error**:

```
standard error (SE) = σ / √n
```

**Example:** customer spending has σ = $40. With samples of n = 100, SE = 40/√100 = **$4**. So a sample mean is typically within about ±$8 (2 SE) of the true mean.

To halve the error, you need **4×** the data (because of the √n).

**Why CLT matters:** it's the reason we can build confidence intervals and do hypothesis tests using the normal distribution, which is what A/B testing relies on.

### Sampling methods

- **Simple random sampling:** everyone has an equal chance.
- **Stratified sampling:** split into groups (strata) and sample from each proportionally, e.g. ensure each province is represented. In ML, a **stratified train/test split** keeps the same class ratio in both parts (file 11).
- **Bootstrap:** resample *your own sample* with replacement many times to estimate uncertainty. Also the basis of **bagging** and **random forests** (file 12).

---

## 17. Confidence intervals

**Idea:** instead of a single estimate ("average spend is $52"), give a **range** that likely contains the true value: "**$52 ± $8**, with 95% confidence" → [$44, $60].

**95% confidence interval** for a mean (large samples):

```
x̄ ± 1.96 × SE        (1.96 ≈ 2 standard errors)
```

**Example:** sample of 100 customers: x̄ = $52, s = $40 → SE = $4
95% CI = 52 ± 1.96 × 4 = 52 ± 7.84 → **[$44.16, $59.84]**

**Correct interpretation:** if we repeated this sampling many times, about 95% of the intervals we built would contain the true mean.

**Wider interval** = more uncertainty. Get narrower intervals with more data.

**In AI evaluation:** "Model A scores 82% on the test set" is meaningless without knowing uncertainty. With only 100 test questions, the 95% CI is roughly ±8%, so a model scoring 80% might not be truly worse (file 26).

---

## 18. Hypothesis testing and p-values

**Idea:** a formal way to decide if an observed effect is **real** or could easily be **random chance**.

**Analogy: a courtroom.** The defendant is presumed innocent (**null hypothesis**) until evidence is strong enough to reject that "beyond reasonable doubt".

### The steps

1. **Null hypothesis (H₀):** "nothing interesting is happening": no difference, no effect. Example: "the new website design has the same sign-up rate as the old one".
2. **Alternative hypothesis (H₁ or Hₐ):** "there is an effect". Example: "the sign-up rates differ".
3. Choose a **significance level α** (alpha), usually **0.05**: how much risk of a false alarm you accept.
4. Collect data and compute a **test statistic** (a number summarising how far the data is from H₀).
5. Compute the **p-value**.
6. **Decide:** if p < α → **reject H₀** ("statistically significant"). Otherwise → **fail to reject H₀** (not enough evidence).

### What is a p-value?

> **p-value = the probability of seeing results at least this extreme, IF the null hypothesis were true.**

- Small p (e.g. 0.01): "if there were really no effect, data this extreme would happen only 1% of the time, which is suspicious, so there's probably a real effect."
- Large p (e.g. 0.40): "this could easily happen by chance."

**Example:** you flip a coin 100 times and get 60 heads. Is it unfair?
H₀: the coin is fair (p = 0.5). Under H₀, getting ≥60 or ≤40 heads has probability ≈ 0.057. p = 0.057 > 0.05 → **fail to reject**. Not enough evidence it's unfair (but borderline).

### Common misunderstandings ⚠️

- ❌ "p = 0.03 means there's a 3% chance H₀ is true." No: it's the chance of the *data* given H₀, not the chance of H₀.
- ❌ "Not significant means no effect." No: it may mean not enough data.
- ❌ "Significant means important." No: with huge samples, tiny useless effects become "significant". Always check the **effect size** (how big the difference is).

### Errors

| | H₀ actually true | H₀ actually false |
|---|---|---|
| **Reject H₀** | **Type I error** (false positive), probability = α | ✅ correct (probability = **power**) |
| **Fail to reject** | ✅ correct | **Type II error** (false negative), probability = β |

- **Type I:** convicting an innocent person; saying the new design works when it doesn't.
- **Type II:** letting a guilty person go; missing a real improvement.
- **Power** = 1 − β = probability of detecting a real effect. Usually target 80%. More data → more power.

**Multiple comparisons problem:** if you test 20 things at α = 0.05, you expect about 1 false "significant" result by chance alone. Fixes: **Bonferroni correction** (use α / number of tests) or similar methods.

---

## 19. Common tests

| Test | Question | Example |
|---|---|---|
| **t-test** (two-sample) | Are the means of two groups different? | Do users on design A spend more time than design B? |
| **Paired t-test** | Did the same subjects change between two conditions? | Same model, two prompts, scored on the same questions |
| **Chi-square test (χ²)** | Are two categorical variables related? | Is gender related to product choice? |
| **Z-test for proportions** | Are two rates (percentages) different? | Conversion rate A vs B |
| **ANOVA** | Do 3+ group means differ? | Sales across 4 regions |
| **Mann-Whitney U** | Like a t-test but without assuming normality | Skewed data like revenue |

```python
from scipy import stats
a = [12, 15, 14, 10, 13, 15, 16]
b = [18, 17, 16, 19, 20, 18, 17]
t, p = stats.ttest_ind(a, b)
print(p)    # ~0.0003 → significant difference
```

---

## 20. A/B testing

**Idea:** an **A/B test** is a randomised experiment comparing two versions: **A (control**, the current version) and **B (treatment**, the new version), to see which performs better on a chosen metric.

**Example:** does a green "Buy" button get more purchases than the blue one?

### Steps

1. **Define the metric:** e.g. **conversion rate** = purchases ÷ visitors.
2. **State hypotheses:** H₀: same conversion rate. H₁: different.
3. **Decide sample size** in advance (using a power calculation based on the smallest improvement you care about).
4. **Randomly split** users: 50% see A, 50% see B. Randomisation balances confounders (section 15).
5. **Run** until you reach the planned sample size.
6. **Analyse:** compute the difference, p-value, and confidence interval.

### Worked example

| | Visitors | Purchases | Conversion |
|---|---|---|---|
| A (blue) | 10,000 | 500 | 5.0% |
| B (green) | 10,000 | 580 | 5.8% |

Difference = 0.8 percentage points (a **16% relative lift**).

```python
from statsmodels.stats.proportion import proportions_ztest
stat, p = proportions_ztest([580, 500], [10000, 10000])
print(p)   # ≈ 0.012 → significant at α = 0.05
```

p ≈ 0.012 < 0.05 → reject H₀. Green probably really is better.

### Pitfalls

- **Peeking:** checking results every day and stopping as soon as p < 0.05 greatly inflates false positives. Decide the sample size up front (or use special "sequential testing" methods).
- **Novelty effect:** users click a new thing just because it's new; the effect fades.
- **Sample ratio mismatch (SRM):** if you planned 50/50 but got 52/48, something is broken in the assignment.
- **Too many metrics:** the multiple comparisons problem again.
- **Guardrail metrics:** also track things that must not get worse (page load time, complaints).

**In AI products:** A/B tests decide whether a new model, prompt, or recommendation algorithm actually helps real users (files 26, 28).

---

## 21. Maximum Likelihood and MAP

This is how most models are trained, explained in statistical terms.

### Likelihood

**Idea:** the **likelihood** is how probable the observed data is under a particular choice of model parameters. "If the coin's true P(heads) were θ, how likely is what we saw?"

**Example:** you flip a coin 10 times and see 7 heads.
- If θ = 0.5: likelihood = C(10,7) × 0.5⁷ × 0.5³ ≈ 0.117
- If θ = 0.7: likelihood = C(10,7) × 0.7⁷ × 0.3³ ≈ 0.267
- If θ = 0.9: ≈ 0.057

θ = 0.7 makes the data most likely.

### Maximum Likelihood Estimation (MLE)

**Idea:** choose the parameters that **maximise the likelihood** of the observed data. For the coin, MLE gives θ = 7/10 = 0.7 (just the observed frequency, as you'd guess).

In practice we maximise the **log-likelihood** (logs turn products into sums, [file 04](04-math-numbers-and-functions.md#13-logarithms)), or equivalently **minimise the negative log-likelihood (NLL)**. Since optimisers minimise, NLL becomes the **loss**.

**Big connections:**
- Minimising **MSE** = MLE if you assume errors are normally distributed (linear regression, file 12).
- Minimising **cross-entropy** = MLE for classification (section 23).
- **LLM pretraining** = MLE: maximise the probability of the actual next word in trillions of words of text (file 20).

### MAP (Maximum A Posteriori)

**Idea:** like MLE but also includes a **prior** belief about the parameters (from Bayes' theorem, section 9): choose parameters that maximise likelihood × prior.

**Example:** you flip a coin 3 times and get 3 heads. MLE says P(heads) = 1.0, which is absurd. A prior belief that "coins are usually fair" pulls the estimate back toward 0.5.

**Connection:** adding **L2 regularisation** to a model's loss (file 11) is mathematically the same as MAP with a normal-distribution prior that says "weights should be small". So regularisation = prior beliefs.

---

# Part 5: Information theory

Information theory (invented by Claude Shannon in 1948) measures **information** and **surprise**. It gives us the loss functions used to train classifiers and LLMs.

## 22. Information and entropy

### Information (surprise)

**Idea:** rare events carry more information (are more surprising) than common ones.
- "The sun rose today" carries almost no information (P ≈ 1).
- "It snowed in Colombo" is very surprising (P tiny), so it carries a lot of information.

```
information(x) = −log₂ P(x)     (measured in bits)
```

- P = 1/2 → 1 bit (a coin flip)
- P = 1/8 → 3 bits
- P = 1 → 0 bits (no surprise)

### Entropy H

**Idea:** the **average surprise** (the expected information) of a distribution: how unpredictable it is.

```
H(P) = − Σ P(x) × log P(x)
```

**Examples (log base 2):**
- Fair coin [0.5, 0.5]: H = −(0.5 log₂ 0.5 + 0.5 log₂ 0.5) = **1 bit** (maximally uncertain for 2 outcomes)
- Biased coin [0.9, 0.1]: H = −(0.9 × −0.152 + 0.1 × −3.32) ≈ **0.47 bits** (more predictable)
- Certain [1.0, 0.0]: H = **0** (no uncertainty)
- Fair 4-sided die: **2 bits**; fair 8-sided: **3 bits**. For K equally likely outcomes, H = log K (the maximum possible).

**Where used:**
- **Decision trees** (file 12) choose splits that reduce entropy the most (called **information gain**).
- Measuring how **uncertain** a model's prediction is.
- LLM sampling: a high-entropy next-token distribution means the model is unsure.

In ML code we usually use natural log (units called **nats** instead of bits). Same idea.

---

## 23. Cross-entropy

**Idea:** **cross-entropy** measures how well a predicted distribution Q matches the true distribution P. Lower = better match.

```
H(P, Q) = − Σ P(x) × log Q(x)
```

### The classification case (super important)

In classification, the true label is "one-hot": all probability on the correct class.
True: cat. P = [1, 0, 0] for [cat, dog, bird].

Then the sum has only one non-zero term:

```
cross-entropy = − log Q(correct class)
```

It's simply **minus the log of the probability the model gave to the right answer**. (We previewed this in [file 04](04-math-numbers-and-functions.md#13-logarithms).)

**Example:** model predicts Q = [0.659, 0.242, 0.099] (from the softmax example, section 13), true class = cat
Loss = −ln(0.659) ≈ **0.417**

If the true class had been bird: −ln(0.099) ≈ **2.31**, a much bigger loss, because the model gave bird a low probability.

| Prob. given to correct answer | Cross-entropy loss (−ln p) |
|---|---|
| 0.99 | 0.01 |
| 0.9 | 0.105 |
| 0.5 | 0.693 |
| 0.1 | 2.30 |
| 0.01 | 4.61 |

Training pushes the model to give **high probability to correct answers**. Cross-entropy loss with softmax is the standard for classification (files 11, 12, 15), and it's exactly the loss used to pretrain LLMs: at each position, −log P(actual next token) (file 20).

**Useful fact:** a model that guesses uniformly among K classes has loss ln(K). For 10 classes: ln(10) ≈ 2.30. If your training loss starts near ln(K), the model is guessing randomly, which is a good sanity check. For an LLM with a 50,000-token vocabulary, the starting loss is about ln(50,000) ≈ 10.8.

**Binary cross-entropy (BCE):** for yes/no problems with predicted probability p and true label y ∈ {0, 1}:
```
BCE = −[ y·log(p) + (1−y)·log(1−p) ]
```
If y = 1, it's −log p; if y = 0, it's −log(1 − p).

**Perplexity** (used for language models, file 26) = e^(cross-entropy). A perplexity of 10 means the model is, on average, as uncertain as if choosing uniformly among 10 words.

---

## 24. KL divergence

**Idea:** **KL divergence** (Kullback-Leibler) measures how different one distribution Q is from another P: the "extra surprise" from using Q when the truth is P.

```
KL(P ‖ Q) = Σ P(x) × log( P(x) / Q(x) )  =  H(P, Q) − H(P)
```

i.e. cross-entropy minus entropy.

- KL = 0 means the distributions are identical.
- KL is always ≥ 0.
- KL is **not symmetric**: KL(P‖Q) ≠ KL(Q‖P) in general. So it's not a true "distance".

**Example:** P = [0.5, 0.5], Q = [0.9, 0.1]
KL(P‖Q) = 0.5 ln(0.5/0.9) + 0.5 ln(0.5/0.1) = 0.5(−0.588) + 0.5(1.609) ≈ **0.51 nats**

**Where used:**
- **VAEs** (file 25): keep the learned distribution close to a standard normal.
- **RLHF** (file 21): a KL penalty keeps the fine-tuned LLM from drifting too far from the original model.
- **Knowledge distillation** (file 21): a small "student" model is trained to match a big "teacher" model's output distribution.

---

## 25. Mutual information

**Idea:** **mutual information** measures how much knowing one variable tells you about another. 0 means independent. Unlike correlation, it captures **any** relationship, not just straight lines.

**Where used:** **feature selection** (file 10): keep features with high mutual information with the label.

---

## 26. Check yourself

**Q1.** Salaries: [30, 32, 35, 38, 40, 250] (thousands). Mean or median to describe a typical salary? Compute both.
<details><summary>Answer</summary>Mean = 425/6 ≈ 70.8; median = (35+38)/2 = 36.5. Use the **median**: the 250 outlier distorts the mean.</details>

**Q2.** Compute the variance and standard deviation (divide by n) of [2, 4, 6].
<details><summary>Answer</summary>Mean 4. Squared deviations: 4, 0, 4 → sum 8 → variance 8/3 ≈ 2.67 → std ≈ 1.63.</details>

**Q3.** Exam scores are normal with mean 60, std 8. What % scored between 44 and 76? What is the z-score of 72?
<details><summary>Answer</summary>44 and 76 are ±2σ → ~95%. z = (72 − 60)/8 = 1.5.</details>

**Q4.** 2% of transactions are fraud. A model flags 95% of frauds and wrongly flags 3% of normal transactions. If a transaction is flagged, what's the probability it's fraud?
<details><summary>Answer</summary>Per 10,000: fraud 200 → 190 flagged. Normal 9,800 → 294 flagged. P = 190/(190+294) = 190/484 ≈ **39%**.</details>

**Q5.** Compute softmax of [1, 1, 1]. And of [0, ln 3] (hint: e^(ln 3) = 3)?
<details><summary>Answer</summary>[1/3, 1/3, 1/3]. For [0, ln 3]: e⁰ = 1, e^(ln 3) = 3 → [1/4, 3/4] = [0.25, 0.75].</details>

**Q6.** A study finds people who drink coffee live longer. Can we conclude coffee causes longer life?
<details><summary>Answer</summary>No. It's correlation. Confounders (e.g. wealth, health habits) could explain it. You'd need a randomised experiment or careful causal inference.</details>

**Q7.** An A/B test gives p = 0.30. What do you conclude?
<details><summary>Answer</summary>Fail to reject H₀: no convincing evidence of a difference. It doesn't prove there's no difference; there may be too little data.</details>

**Q8.** A model gives the correct class probability 0.25. What is the cross-entropy loss? What if it gave 0.8?
<details><summary>Answer</summary>−ln(0.25) ≈ 1.386. −ln(0.8) ≈ 0.223.</details>

**Q9.** A 4-class classifier starts training with loss ≈ 1.39. Is that expected?
<details><summary>Answer</summary>Yes: ln(4) ≈ 1.386 is the loss of uniform random guessing, a normal starting point.</details>

**Q10.** What's the entropy of a fair 8-sided die in bits?
<details><summary>Answer</summary>log₂ 8 = 3 bits.</details>

---

## 27. New words in this file

| Word | Meaning |
|---|---|
| Statistics / probability | Summarising data & drawing conclusions / measuring likelihood |
| Population / sample | Everyone / the group you measured |
| Parameter (statistics) / statistic | Population number / sample number |
| Sampling bias | Sample not representative |
| Mean, median, mode | Average, middle value, most common value |
| Outlier / robust | Extreme value / not affected much by outliers |
| Spread / dispersion | How varied data is |
| Range, variance, standard deviation | max−min; average squared distance from mean; its square root |
| Bessel's correction (n−1) | Dividing by n−1 for sample variance |
| Percentile, quartile (Q1, Q3), IQR | Value below which x% falls; 25th/75th percentile; Q3−Q1 |
| Tukey's fences | Outlier rule: beyond 1.5×IQR from the quartiles |
| Box plot | Chart of median, quartiles, outliers |
| p50 / p95 / p99 | 50th/95th/99th percentile (common for latency) |
| Skewness (right/left) | Asymmetry; long tail to right/left |
| Experiment, outcome, sample space, event | Probability vocabulary |
| Complement, mutually exclusive | "Not A"; can't both happen |
| Independent events | One doesn't affect the other |
| Conditional probability P(A\|B) | Probability of A given B |
| Contingency table | Counts table of two categorical variables |
| Bayes' theorem | P(A\|B) = P(B\|A)P(A)/P(B) |
| Prior, likelihood, posterior | Belief before / probability of evidence / belief after |
| Base rate fallacy | Ignoring how rare something is |
| False positive / false negative | Wrong alarm / missed case |
| Random variable (discrete/continuous) | Variable with a random value |
| Expected value E[X] | Probability-weighted long-run average |
| Probability distribution, PMF, PDF, CDF | How likely each value is; discrete/continuous/cumulative versions |
| Uniform, Bernoulli, binomial, categorical, Poisson, exponential | Common distributions |
| Normal / Gaussian distribution | Bell curve defined by μ and σ |
| 68-95-99.7 rule | Share of normal data within 1/2/3 σ |
| z-score / standardisation | (x−μ)/σ / converting to mean 0, std 1 |
| Logits | Raw unnormalised scores from a model |
| Softmax | Converts scores to probabilities summing to 1 |
| Temperature (preview) | Divides logits to make outputs sharper or flatter |
| Covariance / correlation (Pearson r, Spearman) | Whether variables move together / scaled to −1..1 |
| Correlation matrix / heatmap | All pairwise correlations / coloured grid chart |
| Confounder | Hidden variable affecting both |
| Reverse causation, spurious correlation | Effect causes the "cause"; correlation by chance |
| Randomised controlled experiment | Random assignment to establish cause |
| Law of Large Numbers | Bigger samples → averages closer to truth |
| Central Limit Theorem | Sample means are normally distributed |
| Standard error (σ/√n) | Spread of the sample mean |
| Stratified sampling, bootstrap | Sample within groups / resample with replacement |
| Confidence interval | Range likely to contain the true value |
| Hypothesis testing, H₀, H₁ | Testing an effect / no-effect / effect hypotheses |
| Significance level α, p-value | False-alarm threshold / P(data this extreme \| H₀) |
| Statistically significant, effect size | p < α / how big the difference actually is |
| Type I / Type II error, power | False positive / false negative / P(detect real effect) |
| Multiple comparisons, Bonferroni | Many tests → false positives / divide α by number of tests |
| t-test, paired t-test, chi-square, z-test, ANOVA, Mann-Whitney | Common statistical tests |
| A/B test, control, treatment | Randomised comparison of two versions |
| Conversion rate, lift | Success ÷ visitors / relative improvement |
| Peeking, novelty effect, SRM, guardrail metric | A/B testing pitfalls and safeguards |
| Likelihood, MLE, log-likelihood, NLL | Probability of data given parameters / maximise it / its log / minus log as a loss |
| MAP | MLE plus a prior |
| Information theory, information (bits/nats) | Measuring surprise; −log P |
| Entropy | Average surprise / unpredictability |
| Information gain | Entropy reduction (decision trees) |
| One-hot | Vector with 1 for the true class, 0 elsewhere |
| Cross-entropy, binary cross-entropy | −log P(correct answer); the classification loss |
| Perplexity | e^(cross-entropy): effective number of choices |
| KL divergence | How much one distribution differs from another |
| Knowledge distillation (preview) | Student model learns to match a teacher model |
| Mutual information | How much one variable tells about another |

**🎉 You've finished Part A: Foundations!**

**Mini project for Part A:** download any CSV dataset (e.g. from Kaggle: "Titanic" or "Students Performance"). Using plain Python and NumPy:
1. Load it with the `csv` module or `json`
2. Compute mean, median, std, min, max for every numeric column
3. Find outliers with the IQR rule
4. Compute the correlation between two columns
5. Commit the script to a new GitHub repo with a README explaining what you found

**Next:** [08-numpy-and-pandas.md](08-numpy-and-pandas.md)
