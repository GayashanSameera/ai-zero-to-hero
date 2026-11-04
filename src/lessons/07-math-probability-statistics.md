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

**Why it exists:** you can almost never measure everyone. Nobody asks all 22 million people a question, so we ask a few and use careful reasoning to say something about the rest. This section gives you the words for "the few" and "the everyone".

- **Population:** *everyone/everything* you care about. Example: all 22 million people in Sri Lanka.
- **Sample:** a smaller group you actually measure. Example: 1,000 people you surveyed.

We use a sample to **estimate** facts about the population, because measuring everyone is too expensive.

- A number describing a **population** is a **parameter** (written in Greek: μ for mean, σ for standard deviation).
- A number computed from a **sample** is a **statistic** (written in Latin letters: x̄ for mean, s for standard deviation).

(Note: "parameter" here means a population fact. In ML, "parameter" means a model's learned number. Same word, two meanings. Context makes it clear.)

**Sampling bias:** if your sample isn't representative, your conclusions are wrong. Surveying only university students about national income gives a biased answer. Models trained on biased samples become biased models (file 29).

### Worked example: tea estate

A tea estate has **2,000 workers** (the population). The manager wants the average kilograms of leaf plucked per worker per day. Weighing all 2,000 takes a week, so she picks **40 workers at random** and gets a sample mean **x̄ = 21.5 kg**. She uses 21.5 kg as her estimate of the true average **μ**.

If she picked a different random 40, she might get x̄ = 22.3 kg. Different samples give slightly different statistics. The population parameter μ never changes, but we never see it directly. The rest of this file (sections 16 to 18) is about measuring how far off x̄ might be.

```
Population (2,000 workers)  ──random pick──►  Sample (40 workers)
        μ = ? (unknown)                         x̄ = 21.5 kg (known)
              ◄───────── we estimate μ from x̄ ─────────
```

**Where you'll meet it in real work:** your **test set** is a sample of the future inputs your model will see. A bank's fraud model is tested on last year's transactions and then trusted with next year's. If last year was unusual, the test score lies.

**Common mistakes:**
- Thinking a bigger sample fixes bias. One million answers collected only from people who answer calls at 2 p.m. are still a biased sample. More data cures noise, not bias.
- Mixing up the symbols: Greek letters (μ, σ) for the population, Latin (x̄, s) for the sample.

> **සිංහලෙන්:** Population කියන්නේ ඔයා දැනගන්න කැමති හැමෝම. Sample කියන්නේ ඔයා ඇත්තටම මැනපු පොඩි කොටස. තේ වතුයායක වැඩකරන 2,000න් අහඹුවෙන් 40 දෙනෙක් තෝරලා දවසකට සාමාන්‍යයෙන් කිලෝ 21.5ක් කඩනවා කියලා දැනගත්තොත්, ඒකෙන් 2,000ටම අදාළ සාමාන්‍යය අනුමාන කරනවා. ඒත් sample එක හරියට නොගත්තොත්, උදාහරණයක් විදියට උදේ 10ට ගෙදර ඉන්න අයගෙන් විතරක් ඇහුවොත්, ලක්ෂ ගාණක් ඇහුවත් උත්තරය වැරදියි. ඒකට කියන්නේ sampling bias කියලා. Bias තියෙන data වලින් train කරපු model එකත් bias වෙනවා.

---

## 2. Measures of centre

**Why it exists:** a list of 10,000 numbers is unreadable. We need **one** number that says "this is typical". But there are three different meanings of "typical", and picking the wrong one gives a misleading story.

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

### Worked example: village incomes

Monthly incomes (Rs. thousands) of 5 families in a village: **[40, 45, 50, 55, 410]**. The last family owns a big shop.

- Mean = (40 + 45 + 50 + 55 + 410) / 5 = 600 / 5 = **120**
- Median: already sorted, the 3rd of 5 values = **50**
- Mode: no value repeats, so there is no useful mode

Say "the average family earns Rs. 120,000" and four of five families will look at you strangely: none of them earns anywhere near that. The median (Rs. 50,000) describes the village. The mean was dragged up by one value.

| Situation | Best "typical" value | Why |
|---|---|---|
| Incomes, house prices, delivery times | Median | a few huge values distort the mean |
| Heights, exam marks of a big class | Mean | roughly symmetric, mean and median agree |
| Favourite curry, most common error type | Mode | categories have no order, so no mean or median |

**Where you'll meet it in real work:** an online shop reports "median delivery time 2 days" because a few parcels stuck at customs for 30 days would make the mean look terrible and unrepresentative. Data scientists also use the median to fill missing values (file 08, section 16).

**Common mistakes:**
- Taking the "middle" of an **unsorted** list. Sort first.
- Averaging averages. The mean of two class means is only correct if both classes have the same size.
- Reporting a mean for skewed data without also showing the median.

> **සිංහලෙන්:** "සාමාන්‍ය" කියන්න ක්‍රම තුනක් තියෙනවා. Mean කියන්නේ ඔක්කොම එකතු කරලා ගණනින් බෙදපු එක. Median කියන්නේ පිළිවෙලට තිබ්බාම මැද තියෙන අගය. Mode කියන්නේ වැඩිම පාරක් එන අගය. ගමක පවුල් 5ක ආදායම රුපියල් දහස් වලින් 40, 45, 50, 55, 410 නම් mean එක 120යි, ඒත් ඒ ගමේ පවුල් හතරකටම ඒ ළඟකටවත් එන්නේ නෑ. Median එක 50යි, ඒක තමයි ඇත්ත තත්ත්වය. ඒ නිසා ආදායම්, ගෙවල් මිල වගේ එකක් දෙකක් ලොකුවට ගියපු data වලට median එක පාවිච්චි කරන්න.

---

## 3. Measures of spread

**Why it exists:** two groups can have the exact same average and still be completely different in practice. Spread tells you how far the typical value is from the centre, and so how much you can trust the average.

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

### Worked example: sample variance of Class A

Class A: [68, 69, 70, 71, 72], mean 70. Deviations: −2, −1, 0, 1, 2. Squared: 4, 1, 0, 1, 4. Sum = **10**.

- Population variance (÷ n): 10 / 5 = **2**, std = √2 ≈ **1.41**
- Sample variance (÷ n − 1): 10 / 4 = **2.5**, std = √2.5 ≈ **1.58**

The sample version is a little larger on purpose: a small sample rarely catches the extreme values of the population, so we nudge the estimate up.

```
Class A:        68 69 70 71 72       std ≈ 1.4  (tightly packed)
                       ▲ mean 70
Class B:  40       55       70       85       100     std ≈ 21 (spread out)
                            ▲ mean 70
```

**Where you'll meet it in real work:** a bank looks at the **std of a customer's monthly spending**. A sudden transaction 6 standard deviations above their normal is a fraud signal. In ML, a feature with std 1,000,000 (salary in rupees) drowns a feature with std 2 (number of children) unless you scale them (file 10).

**Common mistakes:**
- Forgetting the square root, so the "std" is in marks² and can't be compared with the data.
- Not noticing that NumPy divides by n while Pandas divides by n − 1. The same data gives two answers (21.21 vs 23.72 above) and both are "right" for their purpose.
- Quoting the mean without any spread. "Average 70" says nothing about whether students are all near 70 or some fail badly.

> **සිංහලෙන්:** Class දෙකක සාමාන්‍ය ලකුණු දෙකම 70 වුණත්, එකේ ඔක්කොම 68 ඉඳන් 72 අතර, අනිත් එකේ 40 ඉඳන් 100 දක්වා විසිරිලා. ඒ විසිරීමට කියන්නේ spread එකට. Variance කියන්නේ mean එකෙන් තියෙන දුරවල් වර්ග කරලා ගත්ත සාමාන්‍යය. ඒකේ square root එක තමයි standard deviation, ඒක ලකුණු වලින්ම කියවන්න පුළුවන්. Class A එකේ std 1.4යි, B එකේ 21යි. ඒ කියන්නේ B එකේ ළමයෙක් සාමාන්‍යයෙන් mean එකෙන් ලකුණු 21ක් දුරින් ඉන්නවා.

---

## 4. Percentiles, quartiles, IQR, outliers

**Why it exists:** the mean and std get fooled by outliers. Percentiles and quartiles describe the data by **position in the sorted list** instead, so one crazy value cannot hurt them.

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

### Worked example: 10 exam marks

Sorted marks: **35, 42, 48, 55, 60, 62, 67, 71, 80, 95**

- Median = (60 + 62) / 2 = **61**
- Lower half: 35, 42, 48, 55, 60 → Q1 = its middle = **48**
- Upper half: 62, 67, 71, 80, 95 → Q3 = its middle = **71**
- IQR = 71 − 48 = **23**
- Fences: 48 − 1.5 × 23 = 13.5 and 71 + 1.5 × 23 = 105.5. Every mark is inside, so **no outliers**.

Different software uses slightly different rules for quartiles. NumPy's default (linear interpolation) gives Q1 = 49.75 and Q3 = 70 for the same data. Don't panic when two tools disagree a little; the idea is the same.

**Where you'll meet it in real work:** a chatbot service reports "median response 0.8 s, p99 9 s". Most users are happy, but 1 in 100 waits 9 seconds or more. Engineers watch the **tail** (p95, p99) because those are the angry users. Averages hide this.

**Exam angle:** deployment questions use **p50 / p95 / p99 latency**. If a question says "a few requests are very slow but the average looks fine", the answer is to look at tail percentiles, not the mean.

**Common mistakes:**
- Averaging percentiles from different servers. You cannot get the overall p99 by averaging per-server p99 values.
- Reporting only mean latency for a system with a long tail.

> **සිංහලෙන්:** Percentile කියන්නේ පිළිවෙලට තියපු data වල ස්ථානයෙන් කියන දෙයක්. ඔයාගේ ලකුණු 90th percentile නම්, ඔයා පන්තියෙන් 90%කට වඩා උඩින්. Q1 කියන්නේ පහළින් 25%, Q3 කියන්නේ 75%, ඒ දෙක අතර දුර IQR. Chatbot එකක median response එක තත්පර 0.8ක් වුණාට p99 එක තත්පර 9ක් නම්, සීයෙන් එක්කෙනෙක් තත්පර 9ක් බලාගෙන ඉන්නවා. ඒ නිසා engineers බලන්නේ සාමාන්‍යයට වඩා p95, p99 වගේ අගයන්.

---

## 5. Shape: skewness

**Why it exists:** the shape of the data decides which summary and which model are safe to use. A mean means one thing for a bell-shaped pile and something else for a pile with a long tail.

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

### Worked example: skew and the log transform

Take [2, 3, 3, 5, 7, 8, 100] from section 2. Mean 18.3 is far above median 5, so the data is **right-skewed**. A quick rule: **mean > median means right skew; mean < median means left skew.**

Now a typical skewed feature, order values in rupees: [10, 100, 1,000, 10,000, 100,000]. Taking log₁₀ gives [1, 2, 3, 4, 5]: evenly spaced. The log squeezes the long tail so the numbers become well-behaved for a model. Each step on the log scale means "10 times bigger".

```
Raw values:     |•••••••••••                                         •        •
                0                                                  50k     100k
After log:      |   •    •    •    •    •
                1        2        3        4        5
```

**Where you'll meet it in real work:** house prices, salaries, number of followers and website visit durations are all right-skewed. Before modelling them, data scientists often apply `np.log1p(x)` (log of 1 + x, which is safe when x = 0).

**Common mistakes:**
- Assuming mean ≈ median without checking.
- Applying `log` to zero or negative values (it is undefined). Use `log1p` for non-negative data.

> **සිංහලෙන්:** Data වල හැඩය කියන්නේ skewness. දකුණු පැත්තට දිගු වලිගයක් තියෙනවා නම් (ආදායම්, ගෙවල් මිල) mean එක median එකට වඩා ලොකුයි. ඒකට right-skewed කියනවා. උදාහරණයක් විදියට [2, 3, 3, 5, 7, 8, 100] වල mean 18.3, median 5. ඒ වගේ data වලට log ගත්තාම 10, 100, 1,000, 10,000 කියන ඒවා 1, 2, 3, 4 බවට පත් වෙලා වලිගය හකුළනවා. එතකොට model එකට ඒක පාවිච්චි කරන්න ලේසියි.

---

# Part 2: Probability

## 6. What is probability?

**Why it exists:** we cannot predict one coin flip, one spam email or one next word, but we can say how **likely** each outcome is. Probability is the number we use for that.

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

### Worked example: two dice

Roll two fair dice. There are 6 × 6 = **36** equally likely outcomes. What is P(sum = 7)?

The ways to make 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = **6 ways**.

P(sum = 7) = 6 / 36 = **1/6 ≈ 0.167**.

| Sum | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Ways (out of 36) | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |

The ways add up to 36, so the probabilities add up to 1, as the rule says. A sum of 7 is the most likely; a sum of 2 or 12 is the rarest (1/36 ≈ 0.028).

**Where you'll meet it in real work:** a language model does not "know" the next word. It assigns a probability to **every token in its vocabulary**, and these probabilities add up to 1 (see softmax, section 13).

**Exam angle:** "The output of a classifier's final softmax layer is...?" A probability distribution: every value between 0 and 1, all values summing to 1.

**Common mistakes:**
- **The gambler's fallacy:** after five heads in a row, the next flip is still 50/50. The coin has no memory.
- Assuming all outcomes are equally likely when they are not. "I either win the lottery or I don't" does **not** mean 50%.

> **සිංහලෙන්:** Probability කියන්නේ 0 ඉඳන් 1 දක්වා අංකයක්, මොකක් හරි දෙයක් වෙන්න තියෙන ඉඩ කියන එක. දාදු කැට දෙකක් දැම්මාම ප්‍රතිඵල 36ක් එනවා, ඒවායින් එකතුව 7 එන ක්‍රම 6යි, ඒ නිසා 6/36 = 1/6. හැම ප්‍රතිඵලයකම probability එකතු කළාම හරියටම 1 එනවා. Coin එක පස් පාරක් එක දිගට head ආවා කියලා හයවෙනි පාරත් head එන්න ඉඩ වැඩි වෙන්නේ නෑ, ඒකත් තවමත් 50-50. LLM එකකුත් ඊළඟ වචනයට දෙන්නේ ඔය වගේ probability ලැයිස්තුවක්.

---

## 7. Probability rules

**Why it exists:** real questions combine events: "will it rain **and** will the bus be late?", "will **at least one** server survive?". These three rules let you build the answer from simple pieces.

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

### Worked example: the commute

Each morning the bus is late with probability **0.2** and the train is late with probability **0.1**. Assume they are independent.

- **Both late:** 0.2 × 0.1 = **0.02**
- **At least one late:** 0.2 + 0.1 − 0.02 = **0.28** (subtract the overlap)
- **Neither late:** (1 − 0.2) × (1 − 0.1) = 0.8 × 0.9 = **0.72**

Check: 0.72 = 1 − 0.28, so "neither" and "at least one" are complements, as the NOT rule says.

**Shortcut:** "at least one" is usually easiest as **1 − P(none)**. Three coin flips, at least one head: 1 − (1/2)³ = 1 − 1/8 = **7/8**.

```
 Venn picture for  P(A or B) = P(A) + P(B) − P(A and B)
      ┌─────────┐
      │ A ┌─────┼───┐
      │   │ A&B │ B │      adding A and B counts the middle twice,
      └───┼─────┘   │      so subtract it once
          └─────────┘
```

**Where you'll meet it in real work:** reliability. If one server is up 99% of the time and you run 3 independent copies, all three are down at the same time with probability 0.01³ = 0.000001, so the service is up 99.9999% of the time. (Real servers share power and networks, so the independence assumption is optimistic.)

**Common mistakes:**
- Multiplying probabilities of events that are **not** independent (rain and traffic jams, for example).
- Adding P(A) + P(B) for "or" and forgetting to subtract the overlap.

> **සිංහලෙන්:** Probability නීති තුනක් මතක තියාගන්න. "නෙවෙයි" කියන්නේ 1 අඩු කරන එක. "දෙකම" කියන්නේ (එකිනෙකට බලපාන්නේ නැත්නම්) ගුණ කරන එක. "එකක් හරි" කියන්නේ එකතු කරලා දෙකටම පොදු කොටස එක පාරක් අඩු කරන එක. බස් එක late වෙන්න 0.2යි, ට්‍රේන් එක late වෙන්න 0.1යි නම්, දෙකම late වෙන්නේ 0.2 × 0.1 = 0.02යි. අඩුම තරමින් එකක් late වෙන්නේ 0.2 + 0.1 − 0.02 = 0.28යි. "අඩුම තරමින් එකක්" ගැන ප්‍රශ්න වලදී 1 − (කිසිවක් නෑ) කියලා ගණන් කරන එක බොහෝවිට ලේසියි.

---

## 8. Conditional probability and independence

**Why it exists:** new information changes the odds. The chance of passing is different once you know the student studied. Conditional probability is the tool for updating probabilities when you learn something.

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

### Worked example: dealing two cards

Draw two cards from a pack of 52 without putting the first back. What is P(both are aces)?

- P(first is an ace) = 4/52
- P(second is an ace | first was an ace) = 3/51 (one ace and one card are gone)
- Together: 4/52 × 3/51 = 12/2,652 = 1/221 ≈ **0.0045**

This is the general rule rearranged: **P(A and B) = P(B) × P(A | B)**. For independent events P(A | B) = P(A), and it collapses to the simple product from section 7.

### Do not flip the condition

From the study table: P(passed | studied) = 45/50 = 0.90. But P(**studied** | passed) = 45/60 = **0.75**. They are different questions with different answers. Flipping a conditional without Bayes' theorem (section 9) is one of the most common reasoning errors.

**Exam angle:** an LLM is an **autoregressive** model: it computes P(next token | all previous tokens) one step at a time, and multiplies the steps to get the probability of a whole sentence. Know that this is a conditional probability chain.

**Common mistakes:**
- Treating P(A | B) and P(B | A) as the same number.
- Assuming independence because it makes the maths easy. Words in a sentence are clearly dependent.

> **සිංහලෙන්:** Conditional probability කියන්නේ "B වුණා කියලා දන්නවා නම් A වෙන්න තියෙන ඉඩ". පාඩම් කරපු අයගෙන් 50න් 45ක් pass වුණා, ඒ නිසා P(pass | පාඩම් කළා) = 0.9. ඒත් pass වුණ 60න් පාඩම් කළේ 45යි, ඒ නිසා P(පාඩම් කළා | pass) = 0.75. මේ දෙක එකම නෙවෙයි, මේක තමයි ගොඩක් අය කරන වැරැද්ද. LLM එකකුත් වැඩ කරන්නේ කලින් වචන ඔක්කොම දැනගෙන ඊළඟ වචනයේ probability එක හොයලා, ඒක පාරක් පාරක් ගාණේ ගුණ කරමින්.

---

## 9. Bayes' theorem

**Why it exists:** we often know "how likely is this evidence if the thing is true" but we need the reverse: "how likely is the thing, now that I see the evidence". Bayes' theorem converts one into the other.

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

### Worked example: a scam SMS filter

Suppose **0.5%** of SMS messages are scams. The word "winner" appears in **80%** of scams and in **2%** of genuine messages. A message contains "winner". Is it a scam?

Use 100,000 messages:

| | Count |
|---|---|
| Scams | 0.5% × 100,000 = **500** |
| Genuine | **99,500** |
| Scams containing "winner" | 80% × 500 = **400** |
| Genuine containing "winner" | 2% × 99,500 = **1,990** |
| All messages containing "winner" | 400 + 1,990 = **2,390** |

P(scam | "winner") = 400 / 2,390 ≈ **0.167 = 16.7%**.

With the formula: (0.8 × 0.005) / (0.8 × 0.005 + 0.02 × 0.995) = 0.004 / 0.0239 ≈ 0.167 ✓.

The word is a strong clue (it appears in 80% of scams but only 2% of genuine messages, so 40 times more often), yet most messages containing it are still genuine, because genuine messages outnumber scams about 200 to 1.

### Updating twice

Back to the medical test (15.4% after one positive). Use 0.154 as the **new prior** and test again, with a second independent test that is also positive:

P(disease | 2 positives) = (0.9 × 0.154) / (0.9 × 0.154 + 0.05 × 0.846) = 0.1386 / (0.1386 + 0.0423) = 0.1386 / 0.1809 ≈ **0.77**

Each new piece of evidence moves the belief. This "posterior becomes the next prior" loop is the heart of Bayesian thinking.

```
 prior ──► [ evidence ] ──► posterior ──► (becomes the next prior) ──► [ more evidence ] ──► ...
  1%         positive          15%                                        positive            77%
```

**Where you'll meet it in real work:** hospital screening programmes, fraud alerts and spam filters all fight the base rate. Naive Bayes email filters really do multiply per-word likelihoods like the "winner" above.

**Common mistakes:**
- The **prosecutor's fallacy**: mixing up P(evidence | innocent) with P(innocent | evidence).
- Ignoring the base rate and trusting the accuracy of the test alone.

> **සිංහලෙන්:** Bayes theorem එකෙන් කරන්නේ අලුත් සාක්ෂියක් ආවාම ඔයාගේ විශ්වාසය update කරන එක. SMS වලින් 0.5%ක් විතරක් scam නම්, "winner" කියන වචනය scam වලින් 80%කත්, සාමාන්‍ය ඒවායින් 2%කත් තියෙනවා නම්, SMS 100,000කින් scam 500යි, ඒවායින් 400කට "winner" තියෙනවා. සාමාන්‍ය 99,500න් 1,990කට "winner" තියෙනවා. ඒ නිසා "winner" තියෙන 2,390න් scam 400යි, ඒ කියන්නේ 16.7%යි විතරයි. Scam එක දුර්ලභ නිසා, හොඳ සාක්ෂියක් තිබුණත් සාමාන්‍ය messages ගොඩ ඊට වඩා ගොඩක් තියෙනවා.

---

## 10. Random variables and expected value

**Why it exists:** to reason about uncertain numbers we need a way to give a whole random process **one representative value** (the expected value) and **one "how wobbly" value** (the variance).

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

### Worked example: delivery days

A courier's parcels take 1 day with probability 0.2, 2 days with probability 0.5 and 3 days with probability 0.3.

- E[X] = 1 × 0.2 + 2 × 0.5 + 3 × 0.3 = 0.2 + 1.0 + 0.9 = **2.1 days**
- Deviations from 2.1: −1.1, −0.1, +0.9
- Variance = (−1.1)² × 0.2 + (−0.1)² × 0.5 + (0.9)² × 0.3 = 0.242 + 0.005 + 0.243 = **0.49**
- Std = √0.49 = **0.7 days**

So a parcel arrives in about 2.1 ± 0.7 days. Note that 2.1 is not a possible delivery time, yet it is the right long-run average.

**Rule of linearity:** E[2X + 1] = 2 × E[X] + 1. If each delivery has a fixed Rs. 100 fee plus Rs. 50 per day, the expected cost is 100 + 50 × 2.1 = **Rs. 205**.

**Where you'll meet it in real work:** a training **loss** is an expected value. Nobody can compute the loss over "all possible data", so we estimate it by averaging over a batch of examples (file 11, section 8). Insurance and loan pricing are also expected-value calculations.

**Common mistakes:**
- Expecting E[X] to be a value X can actually take.
- Writing E[X²] when you mean (E[X])². They differ by exactly the variance.

> **සිංහලෙන්:** Expected value කියන්නේ එකම දේ නැවත නැවත කළොත් දිගුකාලීනව ලැබෙන සාමාන්‍යය, හැම අගයක්ම එහි probability එකෙන් ගුණ කරලා එකතු කරන්න ඕනේ. Courier එකක parcel එකක් දවස් 1කින් එන්න 0.2, දවස් 2කින් 0.5, දවස් 3කින් 0.3 නම්, expected value එක 0.2 + 1.0 + 0.9 = දවස් 2.1යි. එහෙම දවසක් කවදාවත් එන්නේ නෑ, ඒත් දිගුකාලීන සාමාන්‍යය ඒකයි. Variance එකෙන් කියන්නේ ඒ අගය වටේ කොච්චර උඩ පහළ යනවද කියලා, මෙතන std දවස් 0.7යි. Model එකේ loss එකත් ඇත්තටම expected value එකක්.

---

## 11. Probability distributions

**Why it exists:** many different situations (coin flips, call counts, waiting times, heights) turn out to follow the same few patterns. If you recognise the pattern, you instantly know the formulas and which tools to use.

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

### Worked examples

**Binomial:** an ad is shown to 100 people and each clicks with probability 0.03. Expected clicks = n × p = 100 × 0.03 = **3**. Spread: √(n p (1 − p)) = √(100 × 0.03 × 0.97) = √2.91 ≈ **1.7**. So seeing 0 to 6 clicks is normal and not a sign that anything changed.

**Poisson:** a call centre gets on average **4 calls per minute**. P(no calls in a minute) = e⁻⁴ ≈ **0.018** (about 1.8%). Quiet minutes are rare.

**Categorical:** for the prompt "The capital of Sri Lanka is", a language model assigns a probability to every token in its vocabulary. Made-up illustrative numbers:

| Next token | Probability |
|---|---|
| Colombo | 0.55 |
| Sri | 0.30 |
| Kotte | 0.08 |
| ... 50,000 other tokens ... | 0.07 in total |
| **Sum** | **1.00** |

That list **is** a categorical distribution. "Sampling" the next word means picking from it with these probabilities.

### Which distribution?

| If you are modelling... | Think |
|---|---|
| one yes/no event | Bernoulli |
| number of yeses in n tries | Binomial |
| number of events per hour/day, no fixed upper limit | Poisson |
| time **between** events | Exponential |
| a measurement with many small causes | Normal |
| one choice among K options | Categorical |

**Exam angle:** "What distribution does an LLM's output layer produce?" A categorical distribution over the vocabulary, produced by softmax. Decoding methods such as greedy, top-k and top-p all operate on this distribution.

**Common mistakes:**
- Thinking a PDF value must be at most 1. A density can exceed 1; only the **area** is a probability.
- Using the normal distribution for counts or waiting times, which are skewed and never negative.

> **සිංහලෙන්:** Probability distribution එකක් කියන්නේ හැම අගයකටම තියෙන ඉඩ ලැයිස්තුව. Coin එක එක පාරක් Bernoulli, ඒවා n ගාණක් දැම්මාම head ගාණ Binomial. විනාඩියකට call සාමාන්‍යයෙන් 4ක් එන call centre එකක, call එකක්වත් නැති විනාඩියක ඉඩ e⁻⁴ ≈ 0.018යි. LLM එකක් "ශ්‍රී ලංකාවේ අගනුවර ... " කියන තැනට ඊළඟ token එකට දෙන ලැයිස්තුව categorical distribution එකක්, ඒ ඔක්කොම එකතු කළාම 1 එනවා. පස්සේ model එක ඒ ලැයිස්තුවෙන් එකක් තෝරනවා.

---

## 12. The normal distribution and z-scores

**Why it exists:** a huge number of real measurements (heights, errors, exam marks) pile up in the same bell shape. Once you know a data set is roughly normal, two numbers (μ and σ) tell you almost everything, including how rare any value is.

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

### Worked example: how rare is a mark of 76?

Exam marks are roughly normal with mean 60 and std 8. What fraction of students score above 76?

1. z = (76 − 60) / 8 = **2.0**
2. 95% of marks lie within ±2σ, so 5% lie outside, split equally: 2.5% above, 2.5% below.
3. So about **2.5%** score above 76 (roughly 1 student in 40).

A handy table for the standard normal:

| z | Fraction of data below this z |
|---|---|
| −2 | about 2.3% |
| −1 | about 16% |
| 0 | 50% |
| +1 | about 84% |
| +2 | about 97.7% |
| +3 | about 99.9% |

```python
from scipy import stats
stats.norm.cdf(2)           # 0.9772: fraction below z = 2 (the CDF from section 11)
1 - stats.norm.cdf(2)       # 0.0228: fraction above z = 2
stats.norm.cdf(1) - stats.norm.cdf(-1)   # 0.6827: the "68%" in the 68-95-99.7 rule
```

**Where you'll meet it in real work:** Sri Lanka's A/L university admission uses a **Z-score** for the same reason: raw marks in different subjects are not comparable, but "how many standard deviations above the subject's average" is. In ML, standardising features to z-scores is a routine preprocessing step.

**Exam angle:** neural-network weights are initialised with small random **normal** (or uniform) numbers, for example Xavier or He initialisation, which choose σ based on layer size. Diffusion models add Gaussian noise step by step. Both are "normal distribution" questions in disguise.

**Common mistakes:**
- Using the 68-95-99.7 rule on data that is clearly skewed (incomes).
- Forgetting that a z-score is only meaningful relative to **that** group's mean and std.

> **සිංහලෙන්:** Normal distribution එක කියන්නේ bell curve එක. ඒක තීරණය කරන්නේ mean (මැද) සහ standard deviation (පළල) කියන අංක දෙකෙන්. Data වලින් 68%ක් mean එකෙන් 1σ ඇතුළත, 95%ක් 2σ ඇතුළත, 99.7%ක් 3σ ඇතුළත. Mean 60, std 8 තියෙන ලකුණු වලට 76 ගත්ත කෙනාගේ z-score එක (76 − 60) / 8 = 2, ඒ කියන්නේ ඉහළින්ම ඉන්න 2.5% අතර. A/L වල Z-score එකත් මේ අදහසමයි: විෂයන් වල ලකුණු කෙලින්ම සංසන්දනය කරන්න බැරි නිසා, "සාමාන්‍යයෙන් කොච්චර σ ඉහළද" කියලා මනිනවා.

---

## 13. Softmax

**Why it exists:** a network ends with raw scores that can be negative or huge. To say "70% cat, 25% dog, 5% bird" we must turn them into proper probabilities. Softmax is the standard converter.

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

### Worked example: temperature

Same logits [2.0, 1.0, 0.1] for [cat, dog, bird]. Divide them by a temperature T first, then apply softmax.

**T = 0.5** (divide by 0.5, i.e. double): logits [4.0, 2.0, 0.2] → e^z = [54.60, 7.39, 1.22], total 63.21 → **[0.864, 0.117, 0.019]**

**T = 1** (no change): **[0.659, 0.242, 0.099]**

**T = 2** (halve): logits [1.0, 0.5, 0.05] → e^z = [2.72, 1.65, 1.05], total 5.42 → **[0.502, 0.304, 0.194]**

| Temperature | cat | dog | bird | Behaviour |
|---|---|---|---|---|
| 0.5 | 0.864 | 0.117 | 0.019 | sharp, almost always "cat" |
| 1 | 0.659 | 0.242 | 0.099 | the model's own opinion |
| 2 | 0.502 | 0.304 | 0.194 | flat, more variety |

As T → 0, the top choice approaches probability 1 (this is **greedy** decoding). As T → ∞, everything approaches equal probability.

**Shifting scores changes nothing:** softmax([102, 101, 100.1]) gives the same answer as softmax([2, 1, 0.1]), since subtracting a constant from every logit cancels out. That is why the code subtracts the max: it avoids computing e^102.

**Where you'll meet it in real work:** the last step of every classifier and of every LLM token prediction. When a chat product has a "creativity" slider, it is usually adjusting temperature.

**Exam angle:** "How does lowering the temperature change an LLM's output?" It makes the distribution sharper, so output is more deterministic and repetitive. Higher temperature makes it more random. Temperature is applied to logits **before** softmax; top-k and top-p then restrict which tokens can be sampled.

**Common mistakes:**
- Applying softmax twice (once inside the model, once in the loss). Many loss functions expect raw logits and do softmax internally.
- Reading a softmax output as a calibrated "true confidence". A model can output 0.99 and still be wrong.

> **සිංහලෙන්:** Model එකෙන් එන logits කියන්නේ සාමාන්‍ය අංක, ඒවා සෘණ වෙන්නත් පුළුවන්, 1ට වඩා වැඩි වෙන්නත් පුළුවන්. Softmax එකෙන් ඒවා e^z කරලා මුළු එකතුවෙන් බෙදලා probabilities බවට හරවනවා, ඒවායේ එකතුව හරියටම 1යි. [2.0, 1.0, 0.1] ගත්තාම cat 0.659, dog 0.242, bird 0.099 එනවා. Temperature 0.5 කළොත් cat 0.864ට වැඩි වෙලා model එක ගොඩක් විශ්වාසයෙන් වගේ උත්තර දෙනවා, temperature 2 කළොත් 0.502ට අඩු වෙලා උත්තර වැඩි විවිධත්වයකින් එනවා. ChatGPT වගේ දේවල creativity බොත්තමත් ගොඩක් වෙලාවට temperature එකමයි.

---

# Part 3: Relationships between variables

## 14. Covariance and correlation

**Why it exists:** we often ask "does one thing go with another?" (study hours and marks, rainfall and tea crop). Correlation puts that question on a single scale from −1 to +1.

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

### Worked example: computing r by hand

Hours X = [1, 2, 3, 4, 5], marks Y = [50, 55, 65, 70, 80].

1. Means: x̄ = 3, ȳ = 64
2. Deviations: dx = [−2, −1, 0, 1, 2], dy = [−14, −9, 1, 6, 16]
3. Products dx·dy = [28, 9, 0, 6, 32], sum = 75 → cov = 75 / 5 = **15**
4. σ_X = √(10/5) = √2 ≈ 1.414; σ_Y = √(570/5) = √114 ≈ 10.68
5. r = 15 / (1.414 × 10.68) = 15 / 15.10 ≈ **0.993**

So r ≈ 0.99, matching `np.corrcoef`. Each extra hour of study goes with about 7.5 more marks (the slope 15 / 2 = 7.5), which is exactly what linear regression would find (file 12).

```
 y = x² for x from −3 to 3:     r = 0  but y is perfectly predicted by x

  9 •                 •
  4   •             •
  1     •         •
  0         •
 ──┼──┼──┼──┼──┼──┼──┼──► x
  −3 −2 −1  0  1  2  3
```

**Where you'll meet it in real work:** before training, data scientists compute a correlation matrix. If two features have r > 0.95, one of them is nearly a duplicate and can be dropped. Features strongly correlated with the label are useful candidates.

**Common mistakes:**
- Reading r = 0 as "unrelated". It only means "no straight-line relationship".
- Trusting r from data with a few extreme outliers. One point can create or destroy a correlation. Plot first.

> **සිංහලෙන්:** Correlation කියන්නේ දෙයක් ඉහළ යද්දී අනිත් දෙයත් ඉහළ යනවද (හෝ පහළ යනවද) කියලා −1 ඉඳන් +1 අතර අංකයකින් කියන එක. පාඩම් කරපු පැය [1, 2, 3, 4, 5] ට ලකුණු [50, 55, 65, 70, 80] නම් r ≈ 0.99, ඒ කියන්නේ ගොඩක් හොඳ සරල රේඛීය සම්බන්ධයක්. ඒත් r = 0 කියන්නේ සම්බන්ධයක් නෑ කියන එක නෙවෙයි, y = x² වගේ වක්‍ර සම්බන්ධයක් තිබුණත් r = 0 වෙන්න පුළුවන්. ඒ නිසා කවදාවත් data එක plot කරලා බලන්නේ නැතුව r විතරක් විශ්වාස කරන්න එපා.

---

## 15. Correlation is not causation

**Why it exists:** the most expensive mistakes in data work come from acting on a pattern as if it were a cause. Knowing the common traps protects you and your users.

Just because two things move together doesn't mean one **causes** the other.

**Classic example:** ice cream sales and drowning deaths are positively correlated. Does ice cream cause drowning? No. **Hot weather** causes both. Hot weather is a **confounding variable** (or **confounder**): a hidden third factor affecting both.

**Other traps:**
- **Reverse causation:** cities with more police have more crime. But it's likely crime → more police, not the other way round.
- **Coincidence:** with enough variables, some will correlate by pure chance (search "spurious correlations": e.g. cheese consumption vs deaths by bedsheet tangling).

**How to establish causation:** a **randomised controlled experiment**: randomly assign people to treatment or control groups, so confounders are balanced on average. In tech, this is an **A/B test** (section 20). When experiments aren't possible, **causal inference** methods try to estimate causes from observational data (file 30).

**For ML:** most models learn **correlations**, not causes. A model might learn "patients who got a certain test are sicker", but the test doesn't cause sickness; doctors order it for sick patients. Be careful using model predictions to make decisions.

### Worked example: umbrellas and traffic

In Colombo, days when many umbrellas are sold also have bad traffic jams. Do umbrellas cause traffic? No. **Rain** causes both.

```
          Rain (confounder)
         /                 \
        ▼                   ▼
 Umbrella sales        Traffic jams
        ◄── strong correlation, no causation ──►
```

How do you check? Look at days with the **same** weather: among dry days, umbrella sales and traffic are no longer related. The link vanishes once the confounder is held fixed.

| Trap | Example |
|---|---|
| Confounder | Rain drives umbrellas and traffic |
| Reverse causation | Hospitals have more sick people, but hospitals don't cause illness |
| Coincidence | With 1,000 variables, some pairs correlate by luck |

**Where you'll meet it in real work:** a hospital model learns "patients who received test X have worse outcomes". But doctors order test X for patients who already look sick. If the model were used to stop ordering test X, people would get hurt.

**Exam angle (trustworthy AI):** models can latch onto **spurious correlations** (shortcuts). A well-known research example is an image classifier that learned to recognise "wolf" partly from snow in the background. Questions ask you to identify this as a data problem and suggest more diverse data or testing on out-of-distribution examples.

**Common mistakes:**
- Saying "A causes B" from a correlation in observational data.
- Believing a high-accuracy model understands why things happen. It only found a pattern.

> **සිංහලෙන්:** Correlation තියෙනවා කියලා එකක් අනිත් එකට හේතුව කියලා කියන්න බෑ. කොළඹදී කුඩ හොඳට විකිණෙන දවස්වල traffic එකත් වැඩියි, ඒත් කුඩ නිසා traffic එන්නේ නෑ, වැස්ස තමයි දෙකටම හේතුව. ඒ වැස්සට කියන්නේ confounder එකක් කියලා. ඇත්තම හේතු ඔප්පු කරන්න randomised experiment එකක් (A/B test එක වගේ) ඕනේ. Model එකකුත් ඉගෙන ගන්නේ correlations විතරයි, ඒ නිසා ඒවායින් තීරණ ගද්දි පරිස්සම් වෙන්න ඕනේ.

---

# Part 4: Inferential statistics

## 16. Sampling, LLN, CLT

**Why it exists:** your sample mean is never exactly the population mean. These two big results tell you (a) that more data brings you closer and (b) exactly how close you can expect to be.

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

### Worked example: standard error

Exam scores have σ = 15 marks. You average a random sample.

| Sample size n | SE = 15 / √n |
|---|---|
| 25 | 15 / 5 = **3.0** |
| 100 | 15 / 10 = **1.5** |
| 225 | 15 / 15 = **1.0** |
| 900 | 15 / 30 = **0.5** |

Going from n = 225 to 900 is **4 times** the data for **half** the error. Precision gets more expensive the better it gets.

### Watching the CLT happen

```python
import numpy as np
rng = np.random.default_rng(0)                       # fixed seed so results repeat
# Exponential data is very skewed (not normal at all): mean 1, std 1
means = rng.exponential(scale=1.0, size=(10_000, 50)).mean(axis=1)
                                                      # 10,000 samples of 50 values, one mean per sample
print(means.mean())   # about 1.0   (the true mean)
print(means.std())    # about 0.14  (= 1 / sqrt(50), the standard error)
# A histogram of `means` looks like a bell curve even though each raw value is skewed.
```

**Stratified sampling example:** if 30% of your customers live in Colombo, a stratified sample of 1,000 forces exactly 300 from Colombo, instead of leaving it to luck.

**Where you'll meet it in real work:** every opinion poll and every A/B test report uses the standard error. When a news report says "margin of error ±3%", that comes from this idea.

**Common mistakes:**
- Mixing up **standard deviation** (spread of individual values) with **standard error** (spread of the sample mean). SE is smaller by a factor of √n.
- Believing the CLT makes the raw data normal. It says the **averages** become normal.

> **සිංහලෙන්:** Law of Large Numbers කියන්නේ data වැඩි වෙන්න වෙන්න sample එකේ සාමාන්‍යය ඇත්ත සාමාන්‍යයට ළං වෙනවා කියන එක. CLT කියන්නේ data එක ඉතා අසමමිතික වුණත්, sample වලින් ගන්න සාමාන්‍යයන් bell curve එකක් හදනවා කියන එක. ඒ සාමාන්‍යයේ විසිරීම standard error = σ / √n. ලකුණු වල σ = 15 නම්, 225 දෙනෙක්ගෙන් ගත්තොත් SE = 1, ඒත් 900 දෙනෙක්ගෙන් ගත්තොත් 0.5. ඒ කියන්නේ error එක අඩකින් අඩු කරන්න data හතර ගුණයක් ඕනේ.

---

## 17. Confidence intervals

**Why it exists:** a single number like "average spend is Rs. 5,200" hides how sure we are. An interval says "somewhere between X and Y", which is the honest way to report an estimate from a sample.

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

### Worked example: a model's accuracy

A chatbot answers 80 of 100 test questions correctly: p̂ = 0.8. For a proportion, SE = √(p̂ (1 − p̂) / n).

- n = 100: SE = √(0.8 × 0.2 / 100) = √0.0016 = **0.04**
  95% CI = 0.8 ± 1.96 × 0.04 = 0.8 ± 0.078 → **[72.2%, 87.8%]**
- n = 1,000 (800 correct): SE = √(0.16 / 1000) ≈ 0.0126
  95% CI = 0.8 ± 1.96 × 0.0126 ≈ 0.8 ± 0.025 → **[77.5%, 82.5%]**

Ten times more questions makes the interval about 3 times narrower (√10).

```
n = 100    |-------------●-------------|      72%  ........  88%
n = 1000          |-----●-----|                  77.5% ... 82.5%
           70%       80%        90%
```

**Where you'll meet it in real work:** if model A scores 82% and model B scores 80% on 100 questions, their intervals overlap by a mile. You cannot claim A is better. Reporting results without an interval is a red flag in model evaluation.

**Exam angle (evaluation):** "A model scored 3 points higher on a small benchmark. What should you do before choosing it?" Check statistical significance or confidence intervals, and use a bigger or more varied test set.

**Common mistakes:**
- Saying "there is a 95% probability the true value is in this interval". The true value is fixed; it is the **method** that is right 95% of the time.
- Forgetting that a wider interval is not a mistake. It is honest uncertainty from too little data.

> **සිංහලෙන්:** Confidence interval එකකින් කියන්නේ ඇත්ත අගය තියෙන්න පුළුවන් පරාසයක්. Chatbot එකක් ප්‍රශ්න 100න් 80ක් හරි උත්තර දුන්නා නම්, SE = 0.04, ඒ නිසා 95% interval එක 80% ± 7.8%, ඒ කියන්නේ 72% ඉඳන් 88% දක්වා. ප්‍රශ්න 1,000න් 800ක් හරි නම් interval එක 77.5% ඉඳන් 82.5% දක්වා පොඩි වෙනවා. ඒ නිසා model දෙකක් 82% සහ 80% කියලා ප්‍රශ්න 100ක test එකකින් සසඳලා "මේක හොඳයි" කියන්න බෑ, interval දෙක එකිනෙක උඩින් යනවා.

---

## 18. Hypothesis testing and p-values

**Why it exists:** random luck can produce impressive-looking differences. Hypothesis testing is a fixed procedure that stops us from announcing "discoveries" that are just noise.

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

### Worked example: tea packs

A factory says its tea packs weigh **100 g** on average, with a known σ = 2 g. You weigh **64** packs and find a mean of **99.5 g**. Is the factory short-changing customers?

1. H₀: μ = 100 g. H₁: μ ≠ 100 g. α = 0.05.
2. SE = σ / √n = 2 / 8 = **0.25 g**
3. Test statistic z = (99.5 − 100) / 0.25 = **−2.0**
4. For z = −2, the two-sided p-value ≈ **0.0455** (the fraction of a normal curve beyond ±2σ).
5. 0.0455 < 0.05 → **reject H₀**. The packs are probably lighter than claimed.

But look at the effect size: 0.5 g out of 100 g is 0.5%. It is statistically significant, yet whether it matters is a business and legal question, not a statistics one.

| p-value | Typical reading |
|---|---|
| p > 0.10 | no evidence against H₀ |
| 0.05 < p < 0.10 | weak evidence, borderline |
| p < 0.05 | significant at the usual level |
| p < 0.01 | strong evidence |

**Where you'll meet it in real work:** before a company ships a new model or prompt, it asks "is the improvement real?". A hypothesis test is the formal answer.

**Exam angle (evaluation):** expect "what does p < 0.05 mean?" The data would be unlikely if H₀ were true. It does **not** mean a 95% chance the new model is better.

**Common mistakes:**
- **p-hacking:** trying many tests or slicing the data until something gets p < 0.05, then reporting only that one.
- Saying "we accept H₀". We only ever "fail to reject" it.

> **සිංහලෙන්:** Hypothesis test එකකදී මුලින්ම හිතන්නේ "වෙනසක් නෑ" කියලා, ඒකට null hypothesis කියනවා. පස්සේ data බලලා, වෙනසක් නැති නම් මේ වගේ ප්‍රතිඵලයක් එන්න තියෙන ඉඩ (p-value එක) හොයනවා. තේ පැකට් 64ක සාමාන්‍ය බර 99.5g, SE = 0.25 නිසා z = −2, p ≈ 0.0455, ඒක 0.05ට වඩා පොඩි නිසා "100g" කියන කතාව ප්‍රතික්ෂේප කරනවා. ඒත් p-value එක කියන්නේ H₀ ඇත්ත වෙන්න තියෙන ඉඩ නෙවෙයි. වෙනස පොඩි වුණත් significant වෙන්න පුළුවන් නිසා, එකතු කරලා effect size එකත් බලන්න ඕනේ.

---

## 19. Common tests

**Why it exists:** different kinds of data need different tests. Using the wrong one gives a p-value that means nothing, so you need a quick way to choose.

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

### Worked example: chi-square by hand

Use the study table from section 8. If studying and passing were **independent**, the expected count in each cell is (row total × column total) / grand total:

| | Passed | Failed |
|---|---|---|
| Studied: observed | 45 | 5 |
| Studied: expected | 50 × 60 / 100 = 30 | 50 × 40 / 100 = 20 |
| Didn't study: observed | 15 | 35 |
| Didn't study: expected | 30 | 20 |

χ² = Σ (observed − expected)² / expected
= 15²/30 + (−15)²/20 + (−15)²/30 + 15²/20
= 7.5 + 11.25 + 7.5 + 11.25 = **37.5**

For a 2 × 2 table (1 degree of freedom) the 5% cut-off is **3.84**. 37.5 is far above it, so studying and passing are clearly **not** independent.

### Choosing a test

```
What are you comparing?
 ├─ two group averages (numbers) ── same people measured twice? ── yes → paired t-test
 │                                                              └ no  → two-sample t-test
 ├─ three or more group averages ──────────────────────────────→ ANOVA
 ├─ two percentages / rates ───────────────────────────────────→ z-test for proportions
 ├─ two categorical variables ─────────────────────────────────→ chi-square
 └─ skewed data, no normality assumption ──────────────────────→ Mann-Whitney U
```

For the t-test code above: group a has mean 13.57 and group b has mean 17.86, a gap of about 4.3 with a standard error of about 0.93, so t ≈ −4.6. A t that far from 0 means the gap is many standard errors wide, which is why the p-value is tiny.

**Where you'll meet it in real work:** comparing two prompts on the same 50 questions is a **paired** test, since both prompts answer the same questions. Using an unpaired test wastes information.

**Common mistakes:**
- Using an unpaired test on paired data, or the reverse.
- Running a dozen different tests and reporting the one that "worked" (see multiple comparisons in section 18).

> **සිංහලෙන්:** හරි test එක තෝරගන්න එක ඔයා සසඳන්නේ මොනවද කියන එක මත රඳා පවතිනවා. කණ්ඩායම් දෙකක සාමාන්‍ය නම් t-test, එකම අය දෙපාරක් මැනලා නම් paired t-test, කණ්ඩායම් තුනක් හෝ ඊට වැඩි නම් ANOVA, පිරිසිදු categories දෙකක් අතර සම්බන්ධයක් බලන්න chi-square. පාඩම් කරපු අය pass වීම chi-square එකෙන් බැලුවාම χ² = 37.5 ආවා, ඒක 3.84 කියන සීමාවට වඩා ගොඩක් ලොකුයි, ඒ නිසා පාඩම් කිරීමයි pass වීමයි එකිනෙකින් ස්වාධීන නෑ. Prompts දෙකක් එකම ප්‍රශ්න 50ට පරීක්ෂා කළොත් ඒක paired test එකක්.

---

## 20. A/B testing

**Why it exists:** looking at last month's sales and this month's sales proves nothing, since many things changed. A randomised A/B test changes **one** thing and lets chance be the only other difference.

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

### Doing the z-test by hand

From the table: A has 500 / 10,000 = 5.0%, B has 580 / 10,000 = 5.8%.

1. Pooled rate = (500 + 580) / 20,000 = 1,080 / 20,000 = **0.054**
2. SE = √(0.054 × 0.946 × (1/10,000 + 1/10,000)) = √(0.05108 × 0.0002) ≈ **0.0032**
3. z = (0.058 − 0.050) / 0.0032 ≈ **2.5**
4. Two-sided p for z = 2.5 ≈ **0.012** ✓ (matches the code)

**95% confidence interval for the difference:** 0.8 pp ± 1.96 × 0.0032 ≈ 0.8 ± 0.63 → **[0.17, 1.43] percentage points**. The gain is probably real, but could be small. Report both.

**What it is worth (hypothetical):** if the shop gets 1,000,000 visitors a month and an average order is Rs. 3,000, a gain of 0.8 percentage points means 8,000 extra orders, or about **Rs. 24 million a month**. The lower end of the interval (0.17 pp) would still be about Rs. 5 million. That is the kind of number a manager needs.

```
 users ──random split──┬──► 50% see A ──► conversion 5.0%
                       └──► 50% see B ──► conversion 5.8%      → is 0.8 pp real? → test
```

**Where you'll meet it in real work:** Daraz-style shops test banner colours, delivery-fee messages and search ranking. Chatbot teams run A/B tests between two model versions or system prompts and measure thumbs-up rate or task completion.

**Exam angle (evaluation):** offline benchmarks do not always predict real user behaviour. Exams like the answer "run a controlled online A/B test with a pre-defined metric and sample size".

**Common mistakes:**
- Deciding the result by eye ("B looks higher today") without a test.
- Stopping the test early the first time p < 0.05 (peeking).
- Splitting users in a non-random way, such as new users to B and old users to A. That mixes the effect with the group difference.

> **සිංහලෙන්:** A/B test එකකදී users අහඹුවෙන් කණ්ඩායම් දෙකකට බෙදලා එක කණ්ඩායමකට A, අනිත් එකට B පෙන්නනවා. A වලින් 10,000න් 500ක් (5.0%), B වලින් 10,000න් 580ක් (5.8%) ගත්තා නම්, වෙනස 0.8 percentage points, z ≈ 2.5, p ≈ 0.012, ඒ නිසා සැබෑ වෙනසක් කියලා කියන්න පුළුවන්. මාසෙකට අමුත්තන් මිලියනයක් ඇවිත් ඇණවුමක් රු. 3,000ක් නම් ඒ වෙනස රුපියල් මිලියන 24ක් විතර වෙන්න පුළුවන්. ඒත් p හොඳ වෙන කළින් ටෙස්ට් එක නතර කරන එක (peeking) වැරදියි.

---

## 21. Maximum Likelihood and MAP

**Why it exists:** training a model means choosing its numbers. MLE gives a clear rule for choosing: pick the numbers that make the data we actually saw as likely as possible.

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

### Worked example: MAP with a prior

You flip a coin 3 times and see 3 heads. Let θ be P(heads).

- **MLE:** θ = 3/3 = **1.0**. The coin always lands heads? Three flips don't justify that.
- **MAP** with a prior that says "coins are usually fair", written as Beta(5, 5): θ = (heads + 5 − 1) / (n + 5 + 5 − 2) = (3 + 4) / (3 + 8) = 7/11 ≈ **0.64**

Now more data, 10 flips with 7 heads: MLE = 0.70, MAP = (7 + 4) / (10 + 8) = 11/18 ≈ **0.61**. With 1,000 flips and 700 heads: MAP = (700 + 4) / (1,000 + 8) ≈ **0.698**, almost the same as MLE. **The prior matters when data is scarce and fades as data grows.**

| | MLE | MAP |
|---|---|---|
| Uses the data | yes | yes |
| Uses prior beliefs | no | yes |
| Risk with tiny data | overconfident (θ = 1.0) | pulled to sensible values |
| ML equivalent | plain loss | loss + regularisation |

### Why logs?

The probability of 400 independent data points is a product of 400 numbers below 1, which becomes so small that a computer rounds it to 0 (underflow). Taking logs turns the product into a sum, which is stable and easy to differentiate. This is why every LLM reports **log-probabilities**.

**Where you'll meet it in real work:** every time a model is trained with cross-entropy, it is doing MLE. When you add `weight_decay` in PyTorch, you are doing MAP.

**Exam angle (training):** "What is the training objective of LLM pretraining?" Maximise the likelihood of the next token, which is the same as minimising cross-entropy loss. "What does weight decay correspond to?" L2 regularisation, a prior preferring small weights.

**Common mistakes:**
- Saying MLE gives the probability of the parameters. It gives the parameters that make the data most likely.
- Forgetting that maximising log-likelihood equals minimising negative log-likelihood. Optimisers minimise, so we flip the sign.

> **සිංහලෙන්:** MLE කියන්නේ දැකපු data එක වැඩිම ඉඩකින් එන්න parameters තෝරන එක. Coin එක 10 පාරකින් head 7ක් ආවොත් θ = 0.7 තමයි හොඳම අගය. ඒත් 3 පාරක් දැම්මාම 3ම head ආවොත් MLE එක 1.0 කියනවා, ඒක අමුතුයි. MAP එකේදී "coin වලින් බොහොමයක් සාධාරණයි" කියන කලින් විශ්වාසය (prior) යොදනවා, ඒකෙන් 7/11 ≈ 0.64 වගේ සාධාරණ අගයක් එනවා. Data ගොඩක් ආවාම prior එකේ බලපෑම අඩු වෙනවා. Model train කරද්දී weight decay දාන එකත් MAP වලට සමානයි.

---

# Part 5: Information theory

Information theory (invented by Claude Shannon in 1948) measures **information** and **surprise**. It gives us the loss functions used to train classifiers and LLMs.

## 22. Information and entropy

**Why it exists:** Shannon asked "how many yes/no questions do you need to learn what happened?". The answer, entropy, tells us how unpredictable something is, and it leads directly to the loss functions used in AI.

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

### Worked example: Colombo's weather

Suppose tomorrow's weather has three outcomes: sunny (0.5), cloudy (0.25), rainy (0.25).

| Outcome | P | Information = −log₂ P |
|---|---|---|
| Sunny | 0.5 | 1 bit |
| Cloudy | 0.25 | 2 bits |
| Rainy | 0.25 | 2 bits |

Entropy = 0.5 × 1 + 0.25 × 2 + 0.25 × 2 = **1.5 bits**. That is also the average number of yes/no questions needed: "Is it sunny?" (1 question half the time), otherwise "cloudy?" (2 questions).

### Entropy and decision trees

You have 10 loan customers: 5 repaid, 5 defaulted. Entropy of the labels = **1 bit** (maximum for two classes). A candidate question ("income > Rs. 100,000?") splits them into a group of 5 with [4 repaid, 1 defaulted] and another with [1 repaid, 4 defaulted].

- Entropy of each group = −(0.8 log₂ 0.8 + 0.2 log₂ 0.2) = 0.8 × 0.322 + 0.2 × 2.322 ≈ **0.722 bits**
- Information gain = 1 − 0.722 = **0.278 bits**

The tree picks the question with the highest information gain. Purer groups have lower entropy.

```
Entropy of a two-outcome event vs P(yes):
 1 bit  |        ▄▄▄▄▄
        |      ▄▀     ▀▄
        |    ▄▀         ▀▄
 0      └──┴────┴────┴────┴──► P(yes)
          0   0.25  0.5  0.75  1     (highest at 0.5, zero when certain)
```

**Where you'll meet it in real work:** random forests and gradient-boosted trees use entropy (or the similar Gini index) to pick splits. For LLMs, a high-entropy next-token distribution means the model is unsure, and low entropy means it is confident.

**Common mistakes:**
- Forgetting the minus sign. log P is negative for P < 1, so −Σ P log P is positive.
- Mixing bits (log₂) with nats (ln) when comparing numbers. Pick one.

> **සිංහලෙන්:** Entropy කියන්නේ දෙයක් කොච්චර අනපේක්ෂිතද කියලා මනින එක. හිරු එන්න 0.5, වලාකුළු 0.25, වැස්ස 0.25 නම්, entropy = 1.5 bits. Coin එක සාධාරණ නම් entropy 1 bit, ඒත් 90-10 coin එකකට 0.47 bits විතරයි, මොකද ප්‍රතිඵලය පුරෝකථනය කරන්න ලේසියි. Decision tree එකක් බලන්නේ ප්‍රශ්නයක් අහපු ගමන් entropy එක කොච්චර අඩු වෙනවද කියලා, ඒකට information gain කියනවා. LLM එකක ඊළඟ token එක ගැන entropy එක වැඩි නම්, model එකට විශ්වාසයක් නෑ කියන එකයි.

---

## 23. Cross-entropy

**Why it exists:** a classifier needs a number that says "how bad was that prediction?", one that punishes confident wrong answers heavily and gives a clear direction to improve. Cross-entropy is that number.

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

### Worked example: a whole sentence

A language model reads the 4-token sentence and gives the correct next token these probabilities: **0.5, 0.25, 0.8, 0.1**.

| Position | P(correct token) | Loss = −ln P |
|---|---|---|
| 1 | 0.5 | 0.693 |
| 2 | 0.25 | 1.386 |
| 3 | 0.8 | 0.223 |
| 4 | 0.1 | 2.303 |
| | | sum = 4.605 |

Average loss = 4.605 / 4 ≈ **1.151**. Perplexity = e^1.151 ≈ **3.16**: on average, the model was as unsure as if choosing between about 3 equally likely tokens.

(Check: the probability of the whole sentence is 0.5 × 0.25 × 0.8 × 0.1 = 0.01, and −ln 0.01 = 4.605 ✓. The summed loss is the negative log-probability of the sentence, which is why training minimises it.)

### The learning signal

For softmax followed by cross-entropy, the gradient with respect to the logits is simply **prediction − target**. With prediction [0.659, 0.242, 0.099] and true class cat [1, 0, 0]: gradient = [−0.341, +0.242, +0.099]. So training pushes cat's score up and the others down, in proportion to how wrong each was.

### Binary cross-entropy by hand

- Label y = 1 (fraud), model says p = 0.9 → loss = −ln 0.9 = **0.105**
- Label y = 1, model says p = 0.1 → loss = −ln 0.1 = **2.303**
- Label y = 0 (normal), model says p = 0.9 → loss = −ln(1 − 0.9) = **2.303**

Confident and wrong costs the most. Confident and right costs almost nothing.

**Where you'll meet it in real work:** a bank's fraud model, a spam filter and every LLM are trained by minimising exactly this loss. Reading loss curves (file 09, file 11) means reading cross-entropy.

**Exam angle (training, evaluation):** "Which loss function is standard for classification?" Cross-entropy. "Lower perplexity means...?" The model predicts the text better. Remember perplexity values are only comparable when the same tokenizer and data are used.

**Common mistakes:**
- Using accuracy as the training loss. It has no useful gradient.
- Taking log of 0. If a model gives the correct class probability exactly 0, the loss is infinite. Real code clips probabilities.
- Comparing perplexity across models with different tokenizers.

> **සිංහලෙන්:** Cross-entropy loss එක කියන්නේ model එක හරි උත්තරයට දුන්න probability එකේ −ln අගය. හරි උත්තරයට 0.9 දුන්නා නම් loss එක 0.105යි, ඒත් 0.1 දුන්නා නම් 2.303යි. ඒ කියන්නේ විශ්වාසයෙන් වැරදුනොත් ලොකු දඬුවමක් ලැබෙනවා. වාක්‍යයක tokens 4කට 0.5, 0.25, 0.8, 0.1 දුන්නා නම් සාමාන්‍ය loss එක 1.151යි, perplexity එක e^1.151 ≈ 3.16, ඒ කියන්නේ model එක තෝරන්නේ සමාන ඉඩ තියෙන token 3ක් අතරින් වගේ. Accuracy එක loss එකක් විදියට පාවිච්චි කරන්න බෑ, මොකද ඒකෙන් model එකට යන්න ඕනේ දිශාව (gradient) ලැබෙන්නේ නෑ.

---

## 24. KL divergence

**Why it exists:** often we need to compare two distributions: "how far has the fine-tuned model drifted from the original?" or "how closely does the student copy the teacher?". KL divergence gives that number.

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

### Worked example: the direction matters

P = [0.5, 0.5] and Q = [0.9, 0.1] (natural log):

- KL(P ‖ Q) = 0.5 ln(0.5/0.9) + 0.5 ln(0.5/0.1) = 0.5 × (−0.588) + 0.5 × 1.609 ≈ **0.511**
- KL(Q ‖ P) = 0.9 ln(0.9/0.5) + 0.1 ln(0.1/0.5) = 0.9 × 0.588 + 0.1 × (−1.609) = 0.529 − 0.161 ≈ **0.368**

The two directions give different answers, so KL is **not symmetric**.

**Check with the identity** KL = cross-entropy − entropy: H(P) = ln 2 = 0.693. H(P, Q) = −(0.5 ln 0.9 + 0.5 ln 0.1) = 0.5 × 0.105 + 0.5 × 2.303 = 1.204. KL = 1.204 − 0.693 = **0.511** ✓.

**Why training with cross-entropy is the same as minimising KL:** H(P) (the true data's entropy) is a fixed constant we cannot change, so minimising H(P, Q) is the same as minimising KL(P ‖ Q).

**Where you'll meet it in real work:** in RLHF, a KL penalty stops a chat model from changing its habits so much that it produces strange text just to please the reward model. In distillation, a small "student" copies the probabilities of a big "teacher".

**Exam angle (training / fine-tuning):** "What is the KL term in RLHF for?" To keep the tuned policy close to the reference model and prevent reward hacking or drift.

**Common mistakes:**
- Calling KL a distance. It is not symmetric and does not obey the triangle inequality.
- Forgetting that KL is infinite if Q gives probability 0 to something P thinks is possible.

> **සිංහලෙන්:** KL divergence එකෙන් කියන්නේ Q කියන distribution එක P කියන ඇත්ත distribution එකෙන් කොච්චර වෙනස්ද කියලා. P = [0.5, 0.5], Q = [0.9, 0.1] නම් KL(P‖Q) ≈ 0.511, ඒත් අනිත් පැත්තට KL(Q‖P) ≈ 0.368, ඒ නිසා ඒක සත්‍ය "දුරක්" නෙවෙයි. 0 කියන්නේ distribution දෙක සමානයි කියන එක. RLHF වලදී model එක මුල් model එකෙන් ගොඩක් ඈත් වෙන්න දෙන්නේ නෑ, ඒකට KL penalty එකක් දානවා. Distillation වලදී පොඩි student model එක ලොකු teacher model එකේ probabilities අනුකරණය කරනවා.

---

## 25. Mutual information

**Why it exists:** correlation misses curved or odd relationships. Mutual information asks the more general question: "if I know X, how much less uncertain am I about Y?"

**Idea:** **mutual information** measures how much knowing one variable tells you about another. 0 means independent. Unlike correlation, it captures **any** relationship, not just straight lines.

**Where used:** **feature selection** (file 10): keep features with high mutual information with the label.

### Worked example: correlation 0, information 1 bit

Let X take the values −2, −1, 1, 2 with equal probability, and let Y = X². Then Y is 4 or 1.

- Correlation of X and Y: the positive and negative X values cancel, so **r = 0**.
- But knowing X tells you Y **exactly**. Y is 4 half the time and 1 half the time, so H(Y) = 1 bit. Given X, there is no uncertainty left, so H(Y | X) = 0.
- **Mutual information = H(Y) − H(Y | X) = 1 − 0 = 1 bit.**

Correlation says "nothing", mutual information says "everything". Two extremes to remember: independent variables have MI = 0; a variable and a perfect copy of itself have MI = its entropy.

**Where you'll meet it in real work:** feature selection. With scikit-learn's `mutual_info_classif`, you score each feature by how much it tells you about the label, then keep the top scorers. It also works when the link is curved.

**Common mistakes:**
- Using only correlation to select features and discarding a feature that has a strong non-linear link to the label.
- Forgetting that MI is symmetric (MI(X, Y) = MI(Y, X)) but says nothing about causation.

> **සිංහලෙන්:** Mutual information කියන්නේ එක variable එකක් දැනගත්තාම අනිත් එක ගැන අවිනිශ්චිතතාවය කොච්චර අඩු වෙනවද කියන එක. X = −2, −1, 1, 2 සහ Y = X² නම් correlation එක 0 එනවා, ඒත් X දැනගත්තාම Y හරියටම දන්නවා, ඒ නිසා mutual information එක 1 bit. ඒ කියන්නේ correlation එකට නොපෙනෙන වක්‍ර සම්බන්ධ MI එකට පේනවා. Feature selection වලදී label එක ගැන වැඩියෙන්ම කියන features තෝරගන්න මේක පාවිච්චි කරනවා.

```quiz
[{"q": "Five families earn Rs. 40k, 45k, 50k, 55k and 410k per month. Which summary best describes a typical family?", "options": ["The mean, Rs. 120k", "The range, Rs. 370k", "The median, Rs. 50k", "The standard deviation"], "answer": 2, "why": "The 410k family is an outlier that drags the mean up to 120k, which no ordinary family earns. The median ignores how extreme the largest value is. The range and std describe spread, not a typical value."}, {"q": "Maths marks have mean 70 and std 5. A student scored 80. What is the z-score, and roughly what share of a normal distribution scores higher?", "options": ["z = 2, about 2.5%", "z = 2, about 5%", "z = 10, almost nobody", "z = 0.5, about 30%"], "answer": 0, "why": "z = (80 - 70) / 5 = 2. About 95% lie within 2 std, so 5% are outside, split between the two tails: 2.5% above. The 5% option forgets that the tails are split in two."}, {"q": "0.5% of SMS messages are scams. The word 'winner' is in 80% of scams and 2% of genuine messages. A message contains 'winner'. Roughly how likely is it to be a scam?", "options": ["80%", "About 40%", "About 2%", "About 17%"], "answer": 3, "why": "Per 100,000 messages: 400 scams and 1,990 genuine ones contain the word, so 400 / 2,390 is about 17%. Answering 80% confuses P(word | scam) with P(scam | word) and ignores the base rate."}, {"q": "A model's logits are [0, ln 3] (ln 3 is about 1.1). What does softmax give?", "options": ["[0.5, 0.5]", "[0.33, 0.67]", "[0.25, 0.75]", "[0, 1]"], "answer": 2, "why": "e^0 = 1 and e^(ln 3) = 3, total 4, so [1/4, 3/4]. [0, 1] would need an infinitely large gap. Softmax never gives exactly 0 or 1 for finite logits."}, {"q": "A classifier gives probability 0.25 to the correct class. What is its cross-entropy loss, using the natural log?", "options": ["About 0.25", "About 1.39", "About 0.29", "About 4.0"], "answer": 1, "why": "Loss = -ln(0.25) = ln 4, about 1.386. The loss is not the probability itself; it is the negative log of it. -ln(0.25) is the same loss a model that guesses uniformly among 4 classes gets."}, {"q": "An A/B test returns p = 0.03 with alpha = 0.05. Which statement is correct?", "options": ["There is a 3% chance the null hypothesis is true", "If there were no real difference, data this extreme would occur about 3% of the time", "The new version is 97% likely to be better", "The effect is large and important"], "answer": 1, "why": "A p-value is the probability of data at least this extreme if H0 is true. It is not the probability of H0 itself, and it says nothing about effect size; a tiny effect can be significant with a huge sample."}, {"q": "You want to cut the standard error of a sample mean from 2.0 to 1.0. How much more data do you need?", "options": ["2 times", "4 times", "8 times", "It cannot be done"], "answer": 1, "why": "SE = sigma / sqrt(n). Halving SE requires sqrt(n) to double, so n must be 4 times larger. Doubling the data only reduces SE by a factor of about 1.41."}, {"q": "You lower an LLM's temperature from 1.0 to 0.3. What happens to the next-token distribution?", "options": ["It becomes flatter and more random", "It becomes sharper, so the top token dominates", "It stays the same but sampling uses top-k", "The logits are made negative"], "answer": 1, "why": "Logits are divided by T before softmax, so T < 1 widens gaps between scores and the top token gets more probability. A flatter distribution comes from T > 1. Temperature changes the distribution itself, not only the sampling rule."}]
```

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

**Q11.** A chatbot is tested on 400 questions and gets 300 right. Give a 95% confidence interval for its accuracy.
<details><summary>Answer</summary>p̂ = 0.75. SE = √(0.75 × 0.25 / 400) = √0.00046875 ≈ 0.0217. Interval = 0.75 ± 1.96 × 0.0217 ≈ 0.75 ± 0.043 → **[70.7%, 79.3%]**.</details>

**Q12.** Tokens in a sentence were given probabilities 0.5, 0.5, 0.25 and 0.125 for the correct words. What is the average cross-entropy (in bits, log₂) and the perplexity?
<details><summary>Answer</summary>Bits: 1, 1, 2, 3 → sum 7 → average 1.75 bits. Perplexity = 2^1.75 ≈ 3.36 (the model was as unsure as choosing among about 3.4 equally likely tokens).</details>

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
| Prosecutor's fallacy | Confusing P(evidence \| innocent) with P(innocent \| evidence) |
| Linearity of expectation | E[aX + b] = a·E[X] + b |
| Underflow | A product of many small probabilities rounding to 0; logs avoid it |
| p-hacking | Trying many tests or slices until one gives p < 0.05 |

**🎉 You've finished Part A: Foundations!**

**Mini project for Part A:** download any CSV dataset (e.g. from Kaggle: "Titanic" or "Students Performance"). Using plain Python and NumPy:
1. Load it with the `csv` module or `json`
2. Compute mean, median, std, min, max for every numeric column
3. Find outliers with the IQR rule
4. Compute the correlation between two columns
5. Commit the script to a new GitHub repo with a README explaining what you found

**Next:** [08-numpy-and-pandas.md](08-numpy-and-pandas.md)
