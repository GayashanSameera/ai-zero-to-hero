# 12: Supervised Learning Algorithms

> **Before you start:** [05](05-math-linear-algebra.md) (dot product, distance, normal equation), [06](06-math-calculus.md) (gradient descent, convex), [07](07-math-probability-statistics.md) (Bayes, entropy, information gain, softmax, bootstrap), [10](10-data-science-workflow.md) (scaling, encoding), [11](11-ml-fundamentals.md) (loss, regularisation, overfitting, bias-variance, pipelines, cross-validation).
>
> **After this file you can:** explain how the main supervised algorithms work (linear and logistic regression, k-nearest neighbours, Naive Bayes, decision trees, support vector machines, random forests and gradient boosting), when to use each, and how to train them with scikit-learn.

---

## Table of contents

1. [Linear regression](#1-linear-regression)
2. [Polynomial regression](#2-polynomial-regression)
3. [Logistic regression](#3-logistic-regression)
4. [Decision boundaries and thresholds](#4-decision-boundaries-and-thresholds)
5. [Multi-class: one-vs-rest and softmax regression](#5-multi-class)
6. [k-Nearest Neighbours (kNN)](#6-k-nearest-neighbours)
7. [Naive Bayes](#7-naive-bayes)
8. [Decision trees](#8-decision-trees)
9. [Support Vector Machines (SVM)](#9-support-vector-machines)
10. [Ensemble learning: the wisdom of crowds](#10-ensemble-learning)
11. [Bagging and Random Forests](#11-bagging-and-random-forests)
12. [Boosting: AdaBoost and Gradient Boosting](#12-boosting)
13. [XGBoost, LightGBM, CatBoost](#13-xgboost-lightgbm-catboost)
14. [Stacking and voting](#14-stacking-and-voting)
15. [Comparison: which algorithm when?](#15-which-algorithm-when)
16. [Hands-on: compare models on one dataset](#16-hands-on)
17. [Check yourself](#17-check-yourself)
18. [New words in this file](#18-new-words-in-this-file)

---

## 1. Linear regression

**Why it exists:** many everyday questions are "how much?" questions: how much will this house sell for, how many units will we sell next week? If the answer grows steadily as the inputs grow, a straight-line formula is the simplest honest model. Linear regression learns that formula from past examples.

**Idea:** predict a number as a **weighted sum** of features plus a bias: a straight line (or flat plane) through the data.

```
ŷ = w₁x₁ + w₂x₂ + ... + wₙxₙ + b  =  w · x + b       (dot product, file 05)
```

**Loss:** MSE ([file 11](11-ml-fundamentals.md#6-loss-functions)). The loss is **convex** ([file 06](06-math-calculus.md#14-loss-landscapes)), so there's one best solution.

**How to find w and b:**
1. **Closed form (normal equation)** ([file 05](05-math-linear-algebra.md#11-transpose-identity-inverse)): w = (XᵀX)⁻¹Xᵀy. Exact answer in one step. Called **Ordinary Least Squares (OLS)**. Slow when there are very many features.
2. **Gradient descent** ([file 11](11-ml-fundamentals.md#7-training-is-optimisation)): iterative; scales to huge data.

### Worked example

House prices (in $1000s) vs size (m²):

| size x | price y |
|---|---|
| 50 | 150 |
| 100 | 250 |
| 150 | 350 |

These lie exactly on y = 2x + 50. Linear regression finds **w = 2, b = 50**.
Interpretation: each extra m² adds $2,000; the "base" is $50,000. Prediction for 120 m²: 2 × 120 + 50 = **$290k**.

```python
from sklearn.linear_model import LinearRegression
import numpy as np
X = np.array([[50], [100], [150]])    # 2-D: (n_samples, n_features)
y = np.array([150, 250, 350])
model = LinearRegression().fit(X, y)
print(model.coef_, model.intercept_)  # [2.] 50.0
model.predict([[120]])                # [290.]
```

### Interpreting coefficients

With several features, each weight means: **"the change in y for a 1-unit increase in this feature, holding all other features constant."**

Example: price = 1.8·size + 12·bedrooms − 0.9·age + 40
- +1 m² → +$1,800 (holding bedrooms and age fixed)
- each year older → −$900

⚠️ Coefficients are only comparable across features if the features are **scaled** ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)). And with **multicollinearity** (features highly correlated with each other, e.g. size in m² and size in ft²), coefficients become unstable and hard to interpret. Use Ridge (L2) to stabilise.

### Assumptions (for trustworthy statistics)

1. **Linearity:** the relationship really is roughly linear
2. **Independence** of errors
3. **Homoscedasticity:** errors have similar spread across all predictions
4. **Normality** of errors (for confidence intervals/p-values)
5. **No strong multicollinearity**

Check with a **residual plot** (residual = y − ŷ, plotted against ŷ). It should look like random noise around 0 with no pattern.

**Regularised versions:** Ridge (L2), Lasso (L1), Elastic Net ([file 11](11-ml-fundamentals.md#13-regularisation)).

**Pros:** fast, interpretable, works with little data, a great baseline.
**Cons:** only captures linear relationships (unless you engineer features), sensitive to outliers.

### Worked example: a three-wheeler fare

A three-wheeler charges a base fare of Rs. 100 and then Rs. 80 for every km, so fare = 80 × km + 100. Linear regression's job is to discover the 80 (the weight w) and the 100 (the bias b) from past trips.

| Trip | km | Fare paid (Rs.) | Formula 80 × km + 100 |
|---|---|---|---|
| 1 | 2 | 260 | 80 × 2 + 100 = 260 |
| 2 | 5 | 500 | 80 × 5 + 100 = 500 |
| 3 | 10 | 900 | 80 × 10 + 100 = 900 |

A 7 km trip: 80 × 7 + 100 = **Rs. 660**.

### Worked example: when the points are not perfectly on a line

Real data is noisy. Take three points: (x = 1, y = 2), (2, 3), (3, 5). Least squares has a closed form for one feature: w = Σ(x − x̄)(y − ȳ) ÷ Σ(x − x̄)², and b = ȳ − w·x̄.

1. Means: x̄ = (1 + 2 + 3) ÷ 3 = 2 and ȳ = (2 + 3 + 5) ÷ 3 = 3.333
2. Top: (1 − 2)(2 − 3.333) + (2 − 2)(3 − 3.333) + (3 − 2)(5 − 3.333) = 1.333 + 0 + 1.667 = 3
3. Bottom: (−1)² + 0² + 1² = 2
4. w = 3 ÷ 2 = **1.5**, then b = 3.333 − 1.5 × 2 = **0.333**
5. Predictions: 1.833, 3.333, 4.833. Residuals (y − ŷ): +0.167, −0.333, +0.167
6. Sum of squared residuals = 0.028 + 0.111 + 0.028 = **0.167**. No other straight line gives a smaller total.

```
y
5 │            ●(3,5)      The line passes between the points.
4 │         ╱              Each vertical gap is a residual;
3 │      ●╱ (2,3)          least squares makes the sum of the
2 │   ●╱ (1,2)             SQUARED gaps as small as possible.
  └──────────── x
```

**Where you'll meet it in real work:** a property firm estimating a flat's value from floor area, a supermarket forecasting rice sales from the day of the week and weather, and a telecom estimating data usage next month.

**Common mistakes:**
- **Extrapolating.** A line fitted on trips of 1 to 15 km says nothing reliable about a 500 km trip. Predict only inside the range of the training data.
- **Reading a coefficient as "cause".** A positive weight on "number of fans in the shop" does not mean buying fans raises sales. It only describes the pattern in the data.
- **Comparing raw weights of unscaled features.** A weight of 0.0001 on "price in rupees" and 5 on "bedrooms" cannot be compared until both features are on the same scale.

**Exam angle:** know that linear regression minimises MSE, has a closed-form solution (the normal equation) and a gradient-descent alternative, and that Ridge and Lasso add L2 or L1 penalties to fight overfitting and multicollinearity.

> **සිංහලෙන්:** Linear regression කියන්නේ data වලට හොඳටම ගැළපෙන සරල රේඛාවක් අඳින එක. Three-wheeler එකක ගාස්තුව හිතන්න: පළවෙනි km එකට Rs. 100ක් (මේක b), ඊට පස්සේ හැම km එකකටම Rs. 80ක් (මේක w). එතකොට 7 km ගියොත් ගාස්තුව 80 × 7 + 100 = Rs. 660යි. Linear regression කරන්නේ පරණ trips ගොඩක් බලලා මේ w සහ b තනියම හොයාගන්න එක. Residual කියන්නේ ඇත්ත අගය සහ line එකේ අගය අතර වෙනස, ඒවායේ වර්ගවල එකතුව අඩුම වෙන line එකයි "හොඳම" line එක. Training data වල නැති තරම් දුරකට (උදා: km 500ක්) prediction කරන්න එපා, ඒක විශ්වාස කරන්න බෑ.

---

## 2. Polynomial regression

**Why it exists:** many real relationships bend. A car's fuel use per km is high at very low and very high speeds and lowest in the middle, and no straight line can follow a bend like that. Polynomial regression lets the same simple linear machinery draw curves.

**Idea:** to fit a curve with a linear model, add **powers of the features** as new features: x, x², x³...

```
ŷ = w₁x + w₂x² + w₃x³ + b
```

It's still "linear regression": linear in the *weights*. We just changed the features ([file 10](10-data-science-workflow.md#11-creating-new-features)).

```python
from sklearn.preprocessing import PolynomialFeatures
from sklearn.pipeline import make_pipeline
model = make_pipeline(PolynomialFeatures(degree=3), LinearRegression())
```

**Degree** controls complexity: degree 1 = line (may underfit); degree 15 = wild wiggles (overfits). A textbook illustration of the bias-variance trade-off ([file 11](11-ml-fundamentals.md#12-bias-variance-trade-off)).

**Other regression variants:** **Support Vector Regression (SVR)** (section 9 idea applied to numbers), **Quantile regression** (predict the median or 90th percentile instead of the mean, useful for "worst case" delivery time).

### Worked example: building the extra columns

The trick is to create new columns and then run ordinary linear regression on them. With degree 2, each row `x` becomes `[x, x²]`:

| Original x | New features [x, x²] |
|---|---|
| 1 | [1, 1] |
| 2 | [2, 4] |
| 3 | [3, 9] |
| 5 | [5, 25] |

Suppose training learned ŷ = 40x − 2x² + 10 (an illustrative formula, say price in lakhs against size in units of 100 sq ft):

| x | 40x | −2x² | + 10 | ŷ |
|---|---|---|---|---|
| 2 | 80 | −8 | 10 | **82** |
| 5 | 200 | −50 | 10 | **160** |
| 10 | 400 | −200 | 10 | **210** |
| 20 | 800 | −800 | 10 | **10** |

The curve rises, flattens, then crashes. Inside the data range (x up to 10) it looks sensible: bigger houses cost more, with diminishing returns. At x = 20 it predicts a huge house is nearly free, which is nonsense. High-degree polynomials explode outside the training range.

```
degree 1 (line)      degree 3 (gentle curve)     degree 15 (wiggles)
  ● ╱  ●               ●  ╭──╮ ●                   ●╭╮ ╭╮●
 ●╱ ●                  ●╭╯   ╰╮                   ●╯╰╮╯ ╰╮
 underfits             about right                  overfits
```

**Where you'll meet it in real work:** modelling how crop yield depends on fertiliser (more helps, then too much hurts), or how demand responds to price. In practice most people use degree 2 or 3, or switch to tree models that capture curves without choosing a degree.

**Common mistakes:**
- **Choosing a huge degree** because it gives a perfect fit on training data. That is memorising, not learning.
- **Forgetting to scale.** x¹⁰ of a value like 50 is astronomically large; use `StandardScaler` after `PolynomialFeatures`.
- **Believing it is a different algorithm.** It is linear regression on engineered features.

**Exam angle:** polynomial degree is the textbook example of the bias-variance trade-off: low degree means high bias (underfit), high degree means high variance (overfit). Remember it is "linear in the weights".

> **සිංහලෙන්:** සමහර සම්බන්ධතා කෙළින් රේඛාවක් නෙවෙයි, වංගු වෙනවා. උදාහරණයක් විදිහට වාහනයක ඉන්ධන පාවිච්චිය, හරිම අඩු වේගෙදී සහ හරිම වැඩි වේගෙදී වැඩියි, මැද වේගෙදී අඩුයි. Polynomial regression වලදී අපි x වලට අමතරව x², x³ වගේ අලුත් columns හදලා, ඒ උඩ සාමාන්‍ය linear regression එකම කරනවා. උදා: x = 5 නම් row එක [5, 25] වෙනවා. Weights අනුව තවමත් linear, ඒත් x අනුව curve එකක් ලැබෙනවා. Degree එක ගොඩක් ලොකු කළොත් training data එක කටපාඩම් කරලා overfit වෙනවා, ඒ නිසා පොඩි degree එකක් (2 හෝ 3) වලින් පටන් ගන්න.

---

## 3. Logistic regression

**Why it exists:** a plain linear score can come out as −3 or 250, which is useless when the question is "will this customer repay, yes or no?". We need an answer between 0 and 1 that we can read as a probability. The sigmoid squashes any score into that range.

**Despite the name, logistic regression is a classification algorithm.**

**Idea:** compute a linear score like linear regression, then squash it into a **probability between 0 and 1** using the **sigmoid** function ([file 04](04-math-numbers-and-functions.md#16-common-function-shapes-youll-meet-in-ai)):

```
z = w · x + b                 (the score, also called the logit)
p = sigmoid(z) = 1 / (1 + e⁻ᶻ)   (probability of class 1)
```

**Loss:** binary cross-entropy ([file 07](07-math-probability-statistics.md#23-cross-entropy)). Convex, so training is reliable.

### Worked example: pass/fail from hours studied

Suppose training learned w = 1.5, b = −6.

| Hours x | z = 1.5x − 6 | p = sigmoid(z) | Prediction (threshold 0.5) |
|---|---|---|---|
| 1 | −4.5 | 0.011 | fail |
| 3 | −1.5 | 0.18 | fail |
| 4 | 0 | 0.50 | borderline |
| 5 | 1.5 | 0.82 | pass |
| 7 | 4.5 | 0.989 | pass |

The model says: "4 hours is the tipping point."

### Interpreting weights: odds

**Odds** = p / (1 − p). If p = 0.8, odds = 4 ("4 to 1").
In logistic regression, each 1-unit increase in a feature **multiplies the odds by e^w**. Here e^1.5 ≈ 4.5: each extra hour of study multiplies the odds of passing by about 4.5.

```python
from sklearn.linear_model import LogisticRegression
clf = LogisticRegression(C=1.0, max_iter=1000)   # C = 1/λ: SMALLER C = STRONGER regularisation
clf.fit(X_train, y_train)
clf.predict_proba(X_test)[:, 1]    # probability of class 1
```

**Pros:** fast, interpretable, outputs well-behaved probabilities, strong baseline for classification and text.
**Cons:** linear decision boundary (needs feature engineering for complex patterns).

### Worked example: from score to probability, step by step

Using the same model (w = 1.5, b = −6), a student who studies 4.5 hours:

1. Score: z = 1.5 × 4.5 − 6 = 6.75 − 6 = **0.75**
2. e⁻ᶻ = e⁻⁰·⁷⁵ ≈ 0.472
3. p = 1 ÷ (1 + 0.472) = 1 ÷ 1.472 ≈ **0.68**
4. 0.68 is above the 0.5 threshold, so predict **pass**.
5. Odds = p ÷ (1 − p) = 0.68 ÷ 0.32 ≈ 2.1, which equals e^z = e⁰·⁷⁵ ≈ 2.12. (The score z is the log of the odds, which is why it is called the logit.)
6. One more hour: z = 2.25, odds ≈ e²·²⁵ ≈ 9.5. That is 2.12 × 4.48, the "× e^1.5" rule from above.

```
p
1.0 │                 ╭──────────  sigmoid squashes
    │              ╭─╯             any z into 0 to 1
0.5 │ - - - - - - ●                p = 0.5 exactly when z = 0
    │         ╭──╯
0.0 │─────────╯
    └───────────────────── z
      -6   -3    0    3    6
```

**Where you'll meet it in real work:** a bank estimating the chance a borrower defaults, a telecom estimating the chance a customer churns this month, a hospital estimating the risk of readmission. Anywhere the business needs a probability it can explain, logistic regression is the first thing to try.

**Common mistakes:**
- **Calling it a regression algorithm in an answer.** It predicts a class (or a class probability).
- **Reversing C.** In scikit-learn, **smaller C means stronger regularisation**, because C = 1/λ.
- **Trusting 0.5 blindly.** The threshold is a business decision (section 4).

**Exam angle:** know the sigmoid formula and its 0 to 1 range, that the loss is binary cross-entropy, that weights are interpreted through odds, and that for many classes you switch to softmax.

> **සිංහලෙන්:** Logistic regression නමේ "regression" තිබුණට ඇත්තටම classification model එකක්. මුලින් linear regression වගේම score එකක් (z) හදනවා, ඊට පස්සේ sigmoid එකෙන් ඒක 0 සහ 1 අතරට හකුළලා probability එකක් කරනවා. උදා: පැය 4.5ක් ඉගෙන ගත්තු ළමයෙක්ට z = 1.5 × 4.5 − 6 = 0.75, ඒකෙන් probability එක 0.68 ක් එනවා. 0.5ට වඩා වැඩි නිසා "pass" කියලා කියනවා. Bank එකක් ණයක් ගෙවයිද කියලා probability එකක් විදිහට දැනගන්න ඕනේ වෙලාවට මේක හොඳම පළවෙනි තේරීමයි.

---

## 4. Decision boundaries and thresholds

**Why it exists:** a model's job ends with a probability, but a business needs an action: approve or reject, call or don't call. The boundary and the threshold are the two dials that turn a probability into an action.

### Decision boundary

The **decision boundary** is where the model switches its prediction from one class to another. For logistic regression, it's where p = 0.5, i.e. where w·x + b = 0: a straight line (in 2-D) or flat plane (in more dimensions).

```
x₂
 │  ○ ○      ╱  ● ●
 │ ○  ○    ╱  ●  ●
 │  ○    ╱  ●  ●
 │ ○   ╱   ●
 │   ╱  ●
 └─╱──────────────► x₁
   decision boundary (linear)
```

Other algorithms make curved or boxy boundaries (trees make axis-aligned boxes; kNN and SVM with kernels make curves).

### Threshold

The model outputs a probability; we choose a **threshold** to turn it into a yes/no. 0.5 is the default, but **not always the best**:
- Cancer screening: missing a case is terrible → lower threshold (e.g. 0.2) → catch more cases, accept more false alarms.
- Spam filter: wrongly hiding an important email is bad → higher threshold (e.g. 0.9).

Choosing thresholds using precision/recall is covered in [file 13](13-evaluation-metrics-and-tuning.md).

### Worked example: which side of the line?

Suppose a logistic model has score z = 2x₁ + x₂ − 6. The boundary is where z = 0, i.e. the line 2x₁ + x₂ = 6.

| Point (x₁, x₂) | z = 2x₁ + x₂ − 6 | Side | p = sigmoid(z) |
|---|---|---|---|
| (1, 1) | 2 + 1 − 6 = −3 | class 0 | 0.047 |
| (2, 2) | 4 + 2 − 6 = 0 | on the boundary | 0.50 |
| (3, 2) | 6 + 2 − 6 = +2 | class 1 | 0.88 |

### A threshold is a different line

A threshold of 0.5 means "predict 1 when z > 0". Other thresholds just shift where on the z axis you cut. Using z = ln(p ÷ (1 − p)):

| Threshold on p | Cut-off on z | Meaning |
|---|---|---|
| 0.2 | ln(0.2 ÷ 0.8) = ln(0.25) = −1.39 | flag more cases (high recall) |
| 0.5 | ln(1) = 0 | the default boundary |
| 0.9 | ln(0.9 ÷ 0.1) = ln(9) = +2.20 | flag only very sure cases (high precision) |

So moving the threshold slides the boundary parallel to itself: same direction, shifted position.

**A cost view.** If a missed fraud costs Rs. 50,000 and a false alarm costs Rs. 500 of staff time, a missed case is 100 times worse. That justifies a low threshold, even though most flagged transactions turn out fine.

**Where you'll meet it in real work:** a bank tuning how many card transactions to block, a hospital deciding when to send a patient for a scan, a content-moderation tool choosing how aggressive to be.

**Common mistakes:**
- **Using 0.5 because it is the default.** It is only optimal when both mistakes cost the same and classes are balanced.
- **Picking the threshold on the test set.** Do it on validation data.
- **Thinking every model has a straight boundary.** Trees draw boxes; kNN and kernel SVMs draw curves.

**Exam angle:** "Which change increases recall at the cost of precision?" Answer: lowering the threshold. See [file 13](13-evaluation-metrics-and-tuning.md#6-thresholds-and-the-trade-off) for the full trade-off.

> **සිංහලෙන්:** Model එක දෙන්නේ probability එකක්, ඒත් business එකට ඕනේ "approve කරනවාද නැද්ද" වගේ තීරණයක්. Decision boundary කියන්නේ model එක එක class එකක ඉඳන් අනිත් class එකට මාරු වෙන තැන, logistic regression වලදී z = 0 වෙන තැන. Threshold එක 0.5 විදිහට තියාගන්න ඕනේ නෑ. Fraud එකක් මඟ හැරුණොත් Rs. 50,000ක් නැති වෙනවා, false alarm එකක් Rs. 500යි නම්, threshold එක 0.2 වගේ පහළට ගන්නවා. එතකොට fraud ගොඩක් අල්ලගන්න පුළුවන්, ඒත් false alarms ටිකක් වැඩි වෙනවා.

---

## 5. Multi-class

**Why it exists:** logistic regression answers yes or no, but many problems have three or more answers: Billing, Network or Other for a telecom complaint. We need ways to build many-class answers out of two-class tools.

How do binary classifiers handle 3+ classes?

- **One-vs-Rest (OvR):** train one binary classifier per class ("cat vs not-cat", "dog vs not-dog", ...). Pick the class with the highest score.
- **One-vs-One (OvO):** a classifier for every pair of classes; majority vote.
- **Softmax regression (multinomial logistic regression):** one score per class, then **softmax** ([file 07](07-math-probability-statistics.md#13-softmax)) turns scores into probabilities that sum to 1. Loss: cross-entropy. This is exactly the final layer of most neural network classifiers and of LLMs (which "classify" the next token among ~100,000 options).

### Worked example: softmax by hand

A support-ticket model gives these raw scores for a message: Billing 2.0, Network 1.0, Other 0.1.

| Class | Score | e^score | Probability = e^score ÷ 11.21 |
|---|---|---|---|
| Billing | 2.0 | 7.39 | **0.66** |
| Network | 1.0 | 2.72 | **0.24** |
| Other | 0.1 | 1.11 | **0.10** |
| Sum | | 11.21 | 1.00 |

The probabilities add up to exactly 1, and the biggest score gets the biggest share. Predict "Billing".

### How many classifiers do you need?

For K classes, OvR trains **K** classifiers and OvO trains **K × (K − 1) ÷ 2**:

| K classes | One-vs-Rest | One-vs-One |
|---|---|---|
| 3 | 3 | 3 |
| 4 | 4 | 6 |
| 10 (digits 0 to 9) | 10 | 45 |

OvO trains more models but each one sees less data. Softmax regression trains one model for all classes together.

**Where you'll meet it in real work:** routing customer tickets to a department, classifying a news article into sports/politics/business, reading a handwritten digit. The last layer of an image classifier or of an LLM is a softmax, and the "classes" for an LLM are its vocabulary of tokens.

**Common mistakes:**
- **Confusing multi-class with multi-label.** Multi-class: exactly one label is true, so use softmax. Multi-label: several can be true, so use an independent sigmoid per label.
- **Expecting probabilities from sigmoids to sum to 1.** Separate OvR scores usually do not.

**Exam angle:** softmax turns scores (logits) into a probability distribution that sums to 1, and is trained with cross-entropy. Expect a question that links it to the output layer of a transformer.

> **සිංහලෙන්:** Binary classifier එකකින් පන්ති 3ක් 4ක් වෙන් කරන්න ක්‍රම තියෙනවා. One-vs-Rest කියන්නේ හැම class එකකටම "මේකද, නෙවෙයිද" කියලා වෙන වෙනම model එකක් හදන එක. Softmax වලදී හැම class එකකටම score එකක් දීලා, ඒ ඔක්කොම එකතුව 1 වෙන probabilities බවට හරවනවා. උදා: telecom complaint එකකට Billing 2.0, Network 1.0, Other 0.1 නම්, softmax එකෙන් 0.66, 0.24, 0.10 එනවා. ඒකෙන් Billing එක තෝරනවා. LLM එකක් ඊළඟ වචනය තෝරන්නෙත් මේ විදිහටමයි.

---

## 6. k-Nearest Neighbours

**Why it exists:** sometimes you cannot write any formula, but you do have plenty of past examples and a good sense of what "similar" means. kNN skips the formula and answers by looking at the most similar past cases.

**Idea:** to classify a new point, look at the **k closest** training points and take a **majority vote** (for regression: their average).

**Analogy:** "Tell me who your friends are and I'll tell you who you are." To guess whether a new restaurant is expensive, look at the 5 nearest restaurants.

```
       ○   ○
    ○     ?  ●        k = 3: nearest are ●, ●, ○ → predict ●
       ●   ●
          ●
```

**Steps:**
1. Compute the distance ([file 05](05-math-linear-algebra.md#5-distance-between-vectors)) from the new point to every training point
2. Pick the k nearest
3. Vote (or average)

**Worked example:** predict if a fruit is an apple (A) or orange (O) from [weight g, sweetness 1-10]. New fruit: [150, 6].

| Fruit | weight | sweetness | label | distance to [150, 6] |
|---|---|---|---|---|
| 1 | 140 | 7 | A | √(100 + 1) ≈ 10.0 |
| 2 | 155 | 5 | O | √(25 + 1) ≈ 5.1 |
| 3 | 170 | 4 | O | √(400 + 4) ≈ 20.1 |
| 4 | 145 | 6 | A | √(25 + 0) = 5.0 |
| 5 | 160 | 6 | O | √(100 + 0) = 10.0 |

k = 3: nearest are #4 (A, 5.0), #2 (O, 5.1), then a tie at 10.0 between #1 (A) and #5 (O). Ties like this are why odd k and careful tie-breaking matter. Notice also that weight dominates the distance because its numbers are bigger, which shows why **scaling is essential** for kNN.

**Choosing k:**
- Small k (1): very wiggly boundary, sensitive to noise → overfitting
- Large k: smooth boundary → may underfit
- Pick k with cross-validation; odd k avoids ties in binary problems

**Pros:** simple, no training time ("lazy learner", it just stores data), naturally multi-class.
**Cons:** slow predictions on big data (must compare to every point), needs scaling, suffers from the curse of dimensionality ([file 10](10-data-science-workflow.md#12-feature-selection)).

**Big idea that comes back later:** "find the nearest vectors" is exactly how **vector search** in RAG works (file 23), using clever indexes to make it fast.

```python
from sklearn.neighbors import KNeighborsClassifier
from sklearn.preprocessing import StandardScaler
from sklearn.pipeline import make_pipeline
knn = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))
```

### Worked example: why scaling changes the answer

In the fruit table above, weight is measured in hundreds of grams and sweetness in single digits, so weight swamps the distance. Min-max scale both features to the range 0 to 1 (weight: min 140, range 30; sweetness: min 4, range 3):

| Fruit | Scaled (weight, sweetness) | Label | Distance to the new fruit (0.333, 0.667) |
|---|---|---|---|
| 4 | (0.167, 0.667) | A | 0.167 |
| 5 | (0.667, 0.667) | O | 0.333 |
| 2 | (0.500, 0.333) | O | 0.373 |
| 1 | (0.000, 1.000) | A | 0.471 |
| 3 | (1.000, 0.000) | O | 0.943 |

Now k = 3 gives A, O, O, so the vote is **orange**, and there is no tie. Before scaling the third neighbour was a coin-toss. Scaling did not just tidy the numbers; it changed the prediction.

```
Effect of k on a noisy point
k = 1: copies its single nearest neighbour, even if that neighbour is a mislabelled outlier
k = 5: five neighbours vote, so one odd point is outvoted
k = n: always predicts the overall majority class (a useless model)
```

**Where you'll meet it in real work:** "customers like you also bought" on a shopping site, finding similar properties to price a new listing, and recommending similar songs. The vector search behind RAG (file 23) is the same idea at a much larger scale.

**Common mistakes:**
- **Forgetting to scale** (shown above).
- **Even k in a two-class problem**, which allows ties.
- **Using kNN on huge data.** Every prediction compares against every stored row, so it gets slow.
- **Too many features.** In very high dimensions, "nearest" stops meaning much (the curse of dimensionality).

**Exam angle:** kNN is a lazy, instance-based, non-parametric method; small k overfits and large k underfits; scaling is required. Link it to nearest-neighbour search over embeddings.

> **සිංහලෙන්:** kNN එකේ අදහස හරිම සරලයි: අලුත් එකක් ආවාම ඒකට ළඟම තියෙන පරණ k දෙනා බලලා, බහුතරය කියන දේම කියනවා. ගමට අලුතෙන් ආපු කෙනෙක් cricket ද football ද කැමති කියලා දැනගන්න එයාගේ ළඟම යාළුවෝ 5 දෙනාගෙන් අහනවා වගේ. මෙතන distance එක ගණනය කරන නිසා features scale කරන්න අත්‍යවශ්‍යයි. උදා: ඉහත පලතුරු උදාහරණයේ scale කරනකොට prediction එකම වෙනස් වුණා, tie එකක් නැතුව orange කියලා ආවා. k = 1 නම් එක outlier එකකටත් රැවටෙනවා, ඒ නිසා k = 5 වගේ අගයක් cross-validation වලින් තෝරන්න.

---

## 7. Naive Bayes

**Why it exists:** to decide if an email is spam we need P(spam | the words in it), but that is hard to measure directly. Bayes' theorem lets us flip the question and use things we can count easily: how often each word shows up in spam and in normal mail.

**Idea:** use **Bayes' theorem** ([file 07](07-math-probability-statistics.md#9-bayes-theorem)) to compute P(class | features), with a "naive" simplifying assumption: **all features are independent given the class**.

```
P(spam | words) ∝ P(spam) × P(word₁ | spam) × P(word₂ | spam) × ...
```
(∝ means "proportional to": we can skip the denominator because it's the same for every class.)

### Worked example: spam filter

From training emails:
- P(spam) = 0.4, P(ham) = 0.6 ("ham" = not spam)
- P("free" | spam) = 0.3, P("free" | ham) = 0.02
- P("meeting" | spam) = 0.01, P("meeting" | ham) = 0.1

New email contains "free" and "meeting":
- spam score: 0.4 × 0.3 × 0.01 = 0.0012
- ham score: 0.6 × 0.02 × 0.1 = 0.0012

A tie! Now an email with just "free":
- spam: 0.4 × 0.3 = 0.12; ham: 0.6 × 0.02 = 0.012 → normalise: P(spam) = 0.12 / 0.132 ≈ **0.91** → spam.

**Laplace smoothing:** if a word never appeared in spam during training, P(word | spam) = 0 and the whole product becomes 0. Fix: add 1 to every count.

**Variants:** **Multinomial NB** (word counts, text), **Bernoulli NB** (word present/absent), **Gaussian NB** (continuous features, assumes normal distributions).

**Pros:** extremely fast, works with little data, surprisingly good for text classification.
**Cons:** the independence assumption is usually false, so probabilities are poorly calibrated (overconfident).

### Worked example: Laplace smoothing with real counts

You have 10 spam emails. The word "lottery" never appears in any of them. Without smoothing, P("lottery" | spam) = 0 ÷ 10 = 0, and the whole spam score becomes 0 whenever "lottery" shows up, which is absurd for the one word that screams spam. With Laplace smoothing (add 1 to the count, and 2 to the total because the word is either present or absent):

P("lottery" present | spam) = (0 + 1) ÷ (10 + 2) = **0.083**

A small but non-zero number, so one unseen word can no longer wipe out all the other evidence.

### Why practitioners add logarithms

Multiplying 200 word-probabilities, each around 0.01, gives 10⁻⁴⁰⁰, which is smaller than a computer's smallest number and underflows to exactly 0. The fix is to add logs instead of multiplying:

log P = log P(spam) + log P(w₁ | spam) + log P(w₂ | spam) + ...

Adding 200 numbers around −4.6 (that is ln 0.01) gives about −920, which a computer handles easily. The class with the larger log score wins. Libraries like scikit-learn do this automatically.

**Where you'll meet it in real work:** SMS and email spam filters, tagging support tickets by topic, and a quick first baseline for any text classification task before trying something heavier.

**Common mistakes:**
- **Treating the raw scores as probabilities.** 0.0012 is not "0.12%"; you must normalise across classes first (as in the "free" example).
- **No smoothing**, so one unseen word zeroes the product.
- **Trusting the probabilities.** The independence assumption is wrong for real text (the words "New" and "York" travel together), so the outputs are overconfident. The ranking is usually fine; the numbers are not.

**Exam angle:** state Bayes' theorem, name the "naive" assumption (features are independent given the class), and know that it is fast, works with little data and suits text.

> **සිංහලෙන්:** Naive Bayes වලදී email එකක ඇති වචන බලලා "මේක spam වෙන්න කොච්චර ඉඩ තියෙනවද" කියලා Bayes theorem එකෙන් ගණනය කරනවා. "Naive" කියන්නේ හැම වචනයක්ම අනිත් වචන වලින් ස්වාධීනයි කියලා සරල උපකල්පනයක් කරන නිසා. ඇත්තටම එහෙම නෑ, ඒත් text වලට පුදුම විදිහට හොඳට වැඩ කරනවා. Spam emails 10ක "lottery" වචනය එකම එක පාරක්වත් නැත්නම් probability එක 0 වෙනවා, ඒකෙන් ඔක්කොම බිංදුව වෙන නිසා Laplace smoothing වලින් (0 + 1) ÷ (10 + 2) = 0.083 කියලා පොඩි අගයක් දෙනවා. Probability අගයන් ඒ තරම් විශ්වාස කරන්න එපා, ඒවා වැඩියෙන් confident.

---

## 8. Decision trees

**Why it exists:** many decisions in banks and hospitals have to be explained to a person: "your loan was declined because...". A decision tree gives a human-readable chain of yes/no questions, which no neural network can match for plain explanation.

**Idea:** a flowchart of yes/no questions about features, learned from data.

```
                    [Contract = month-to-month?]
                     /yes                   \no
          [Tenure < 12 months?]          [Monthly charges > $90?]
           /yes        \no                  /yes          \no
       CHURN (75%)   STAY (60%)         CHURN (40%)    STAY (95%)
```

- **Root node:** the first question
- **Internal nodes:** further questions
- **Leaves:** final predictions (majority class, or the average for regression)
- **Depth:** number of questions from root to the deepest leaf

### How does a tree choose questions?

At each node, it tries every feature and every possible threshold, and picks the split that makes the resulting groups **purest** (most uniform labels).

**Impurity measures:**
- **Gini impurity:** 1 − Σ pᵢ². A pure node (all one class) has Gini 0; a 50/50 node has 0.5.
- **Entropy** ([file 07](07-math-probability-statistics.md#22-information-and-entropy)): −Σ pᵢ log₂ pᵢ. Pure = 0; 50/50 = 1 bit.
- **Information gain** = impurity before the split − weighted impurity after.
- For regression trees: reduce **variance** (MSE) within groups.

### Worked example: computing a split

10 customers: 5 churn, 5 stay. Gini = 1 − (0.5² + 0.5²) = **0.5**

Split on "month-to-month contract?":
- Yes: 6 customers (5 churn, 1 stay): Gini = 1 − ((5/6)² + (1/6)²) = 1 − (0.694 + 0.028) = **0.278**
- No: 4 customers (0 churn, 4 stay): Gini = **0** (pure!)
- Weighted: (6/10) × 0.278 + (4/10) × 0 = **0.167**
- Gain = 0.5 − 0.167 = **0.333** ← a good split

The tree compares this gain with every other possible split and picks the best. Then it repeats on each child. This is a **greedy** algorithm: it picks the best split now, without planning ahead.

### Overfitting and pruning

An unrestricted tree keeps splitting until every leaf is pure, essentially memorising the training data. It **overfits** badly.

Control it with hyperparameters (**pre-pruning**):
- `max_depth`: maximum depth (e.g. 3 to 10)
- `min_samples_split`: a node needs at least this many examples to split
- `min_samples_leaf`: each leaf must have at least this many examples
- `max_features`: consider only some features at each split

Or grow fully then cut back weak branches (**post-pruning**, e.g. `ccp_alpha` in sklearn).

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
tree = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20, random_state=42)
tree.fit(X_train, y_train)
plot_tree(tree, feature_names=feature_names, filled=True)
tree.feature_importances_   # how much each feature reduced impurity overall
```

**Pros:** easy to explain (it's a flowchart), handles numeric and categorical data, **no scaling needed**, captures non-linear patterns and interactions, ignores irrelevant features.
**Cons:** a single tree overfits easily and is **unstable** (small data changes → a very different tree, i.e. high variance). Ensembles fix this (sections 10 to 13).

### Worked example: the same split measured with entropy

Use the same 10 customers (5 churn, 5 stay) and the same split. Entropy = −Σ pᵢ log₂ pᵢ.

1. Before the split: 5/5 → entropy = **1.0** bit (maximum confusion for two classes)
2. "Yes" group (5 churn, 1 stay): −(5/6)·log₂(5/6) − (1/6)·log₂(1/6) = 0.833 × 0.263 + 0.167 × 2.585 = 0.219 + 0.431 = **0.650**
3. "No" group (0 churn, 4 stay): entropy = **0** (pure)
4. Weighted after = (6/10) × 0.650 + (4/10) × 0 = **0.390**
5. Information gain = 1.0 − 0.390 = **0.610**

Gini gave a gain of 0.333 and entropy gives 0.610; the numbers differ in size, but both rank this split as very good. In practice the two measures almost always pick the same questions.

### Reading a prediction path

Using the churn tree above: a customer has a month-to-month contract, 8 months tenure. Path: contract month-to-month? yes → tenure < 12? yes → predict **CHURN** (75% of similar training customers churned). A different customer on a yearly contract paying $70/month: month-to-month? no → monthly charges > $90? no → **STAY** (95%). The path *is* the explanation.

**Where you'll meet it in real work:** loan approval rules, medical triage flowcharts, customer-support routing, and as the building block inside random forests and XGBoost.

**Common mistakes:**
- **Growing the tree until every leaf is pure.** That memorises noise; set `max_depth` or `min_samples_leaf`.
- **Over-reading `feature_importances_`.** They show how useful a feature was to this tree, not whether it causes the outcome, and they favour features with many distinct values.
- **Expecting a tree to extrapolate.** It predicts the average of the training rows in a leaf, so it can never go beyond values seen in training.

**Exam angle:** know Gini and entropy by formula, that trees need no scaling, that a single tree has high variance, and why that motivates random forests.

> **සිංහලෙන්:** Decision tree එකක් කියන්නේ ඔව් / නැහැ ප්‍රශ්න ගොඩක් අහලා තීරණයකට එන flowchart එකක්. බැංකුවක ණය ඉල්ලුම්කරුට "ඇයි reject කළේ" කියලා පෙන්නන්න මේක හරිම ලේසියි, මොකද path එකම පැහැදිලි කිරීමක්. Tree එක ප්‍රශ්නය තෝරන්නේ Gini හෝ entropy වලින් වඩාත්ම "පිරිසිදු" කණ්ඩායම් දෙනවා නම් පමණයි. අපේ උදාහරණයේ customers 10ක් (5ක් ගියා, 5ක් නැවතුනා) දෙකට බෙදද්දී gain එක 0.333 (Gini) හෝ 0.610 (entropy) ආවා, දෙකෙන්ම හොඳ split එකක්. Tree එක ගැඹුරට වැඩෙන්න දුන්නොත් noise එකත් කටපාඩම් කරන නිසා max_depth සීමා කරන්න.

---

## 9. Support Vector Machines

**Why it exists:** many lines can separate two groups in the training data, but they are not equally safe for new points. SVM picks the line with the most breathing room on both sides, on the idea that a boundary far from both groups is least likely to misclassify a newcomer.

**Idea:** find the boundary that separates the classes with the **widest possible margin** (the biggest "street" between them).

```
x₂
 │ ○  ○    ┆   ╱   ┆    ●
 │   ○     ┆  ╱    ┆  ●   ●
 │ ○    ○  ┆ ╱     ┆ ●
 │    ○   ⊙┆╱      ┆●  ●        ⊙ / ⊛ = support vectors
 │  ○      ╱┆     ⊛┆   ●        (the points touching the margin)
 │        ╱ ┆      ┆
 └───────────────────────► x₁
        ←── margin ──→
```

- **Support vectors:** the training points closest to the boundary. Only they determine where the boundary goes; you could delete all other points and get the same model.
- **Why a wide margin?** A boundary with more breathing room is more likely to classify new points correctly (better generalisation).

### Soft margin and C

Real data overlaps, so perfect separation is impossible. The **soft margin** allows some points inside the margin or on the wrong side, with a penalty (**hinge loss**).

- **C** (hyperparameter): how much to punish violations.
  - **Large C:** few violations allowed → narrow margin → may overfit
  - **Small C:** more violations allowed → wide margin → more regularisation

### The kernel trick

What if the classes can't be separated by a straight line?

```
   ● ● ●
 ●  ○ ○  ●        A circle of ○ inside a ring of ●.
 ●  ○ ○  ●        No straight line separates them.
   ● ● ●
```

**Idea:** map the data into a higher-dimensional space where a straight boundary works. For example, add a feature z = x₁² + x₂² (distance from the centre). Now the inner ○ points have small z and the outer ● have large z, so a flat plane separates them.

The **kernel trick** lets SVMs work *as if* they were in that higher-dimensional space, without actually computing the new features, using a **kernel function** that measures similarity between points.

| Kernel | Boundary shape |
|---|---|
| `linear` | straight |
| `poly` | polynomial curves |
| `rbf` (Radial Basis Function, Gaussian) | flexible blobs; the most common default |

RBF has a hyperparameter **gamma (γ)**: large γ → very wiggly boundary (overfit); small γ → smooth.

```python
from sklearn.svm import SVC
svm = make_pipeline(StandardScaler(), SVC(kernel="rbf", C=1.0, gamma="scale", probability=True))
```

**Pros:** effective in high dimensions (text), good with small/medium data, strong theory.
**Cons:** slow for big datasets (>100k rows), needs scaling, sensitive to C and γ, not naturally probabilistic.

### Worked example: the maths of the street

A linear SVM's decision function is f(x) = w·x + b. Points with f > 0 are predicted class +, points with f < 0 class −. The edges of the street are f = +1 and f = −1.

Take w = (1, 1) and b = −5:

| Point | f = x₁ + x₂ − 5 | Prediction |
|---|---|---|
| (4, 3) | 2 | class + |
| (1, 2) | −2 | class − |
| (3, 2) | 0 | exactly on the boundary |

The length of w is ‖w‖ = √(1² + 1²) = 1.414. The street's total width is 2 ÷ ‖w‖ = 2 ÷ 1.414 = **1.41**. Training an SVM means finding the w that keeps every point on the correct side while making ‖w‖ as **small** as possible, which makes the street as **wide** as possible. A smaller ‖w‖ means a wider margin: for w = (3, 4), ‖w‖ = 5 and the width is only 0.4.

### Worked example: the kernel trick with one extra feature

Inner points ○ at (1, 0) and (0, 1); outer points ● at (3, 0) and (0, 3). No line separates them. Add z = x₁² + x₂²:

| Point | z = x₁² + x₂² | Class |
|---|---|---|
| (1, 0) | 1 | ○ |
| (0, 1) | 1 | ○ |
| (3, 0) | 9 | ● |
| (0, 3) | 9 | ● |

A single threshold, z = 5, now separates the classes perfectly. A real kernel does this kind of lift automatically without ever building the new columns.

**Where you'll meet it in real work:** classifying text where there are many more word features than documents, handwriting recognition on small datasets, and some bioinformatics problems. For very large tables, boosted trees usually win.

**Common mistakes:**
- **Skipping scaling.** SVM uses distances, so unscaled features distort the margin.
- **Using it on a million rows.** Training time grows quickly with the number of rows.
- **Leaving C and gamma at defaults** on a hard problem. Tune both together with cross-validation.

**Exam angle:** know the words margin, support vectors, soft margin (C), kernel trick and RBF gamma, and what a large C or large gamma does (more overfitting).

> **සිංහලෙන්:** SVM කියන්නේ class දෙක අතර පුළුල්ම "පාර" තියෙන විදිහට boundary එක අඳින algorithm එක. පාරේ දෙපැත්තට හරියටම ඇහෙන points වලට support vectors කියනවා, boundary එක තීරණය කරන්නේ ඒවා විතරයි. පාර පළල 2 ÷ ‖w‖ නිසා ‖w‖ පොඩි වෙද්දී පාර පළල් වෙනවා. Data කෙළින් රේඛාවකින් බෙදන්න බැරි නම් kernel trick එකෙන් z = x₁² + x₂² වගේ අලුත් feature එකක් එකතු කළා වගේ ගණනය කරලා බෙදනවා. C වැඩි කරොත් වැරදි වලට වැඩි දඬුවමක් දීලා overfit වෙන්න පුළුවන්.

---

## 10. Ensemble learning

**Why it exists:** every single model makes mistakes of its own. If different models make different mistakes, combining them lets the errors cancel out, the same way a group's average guess is usually better than one person's guess.

**Idea:** combine many models to get a better one than any single model.

**Wisdom of crowds:** at a fair, 800 people guessed the weight of an ox. Individual guesses were way off, but their **average** was within 1% of the truth. Errors cancel out when they're **independent**.

Ensembles are among the most powerful techniques for tabular data. Three main families:

| Method | How | Fixes |
|---|---|---|
| **Bagging** | Train many models **in parallel** on random samples of data; average them | **Variance** (overfitting) |
| **Boosting** | Train models **one after another**, each fixing the previous ones' mistakes | **Bias** (underfitting), and variance too |
| **Stacking** | Train a "meta-model" to combine different models' predictions | Both |

### Worked example: why a crowd of 70%-accurate models beats one

Suppose each classifier is right 70% of the time and they make **independent** mistakes. Take a majority vote.

**Three models** (the vote is right if at least 2 are right):
- Exactly 2 right: 3 × 0.7² × 0.3 = 3 × 0.49 × 0.3 = 0.441
- All 3 right: 0.7³ = 0.343
- Total = **0.784** (78.4%)

**Five models** (right if at least 3 are right):
- Exactly 3: 10 × 0.7³ × 0.3² = 10 × 0.343 × 0.09 = 0.309
- Exactly 4: 5 × 0.7⁴ × 0.3 = 5 × 0.2401 × 0.3 = 0.360
- All 5: 0.7⁵ = 0.168
- Total = **0.837** (83.7%)

Accuracy climbs from 70% to 78% to 84% just by voting. The catch is the word *independent*. If all the models are copies of each other and make the same mistakes, voting gains nothing. This is why ensembles want **diverse** members: different algorithms, different data samples, different features.

```
Bagging:    ┌→ model 1 ┐
data ──────►├→ model 2 ├──► average / vote        (parallel, cuts variance)
 (resampled)└→ model 3 ┘

Boosting:   data → model 1 → fix mistakes → model 2 → fix mistakes → model 3
                                                    (sequential, cuts bias)
```

**Where you'll meet it in real work:** bank credit scoring, fraud detection, and almost every winning entry in tabular data competitions. Production systems often run a random forest or a boosted model rather than a single tree.

**Common mistakes:**
- **Averaging near-identical models.** No diversity means no gain.
- **Mixing up the two main families.** Bagging reduces variance by averaging independent models; boosting reduces bias by fixing errors one step at a time.
- **Forgetting the cost.** Ensembles are slower to train and larger to store.

**Exam angle:** a favourite question is "which technique reduces variance / which reduces bias?" Bagging and random forests reduce variance; boosting mainly reduces bias.

> **සිංහලෙන්:** Ensemble කියන්නේ models ගොඩක් එකතු කරලා එක තීරණයක් ගන්න එක. එක model එක 70% හරි නම්, එහෙම models තුනක් ඡන්දය දුන්නාම 78%, පහක් දුන්නාම 84% දක්වා වැඩි වෙන්න පුළුවන්. ඒත් මේකට models වල වැරදි එකිනෙකට වෙනස් වෙන්න ඕනේ. එකම වැරදි කරන models 5ක් තිබුණාට වැඩක් නෑ. Bagging කියන්නේ ගමේ අය 100 දෙනෙක්ගෙන් වෙන වෙනම අහලා බහුතරය ගන්න එක (variance අඩු කරනවා). Boosting කියන්නේ coach කෙනෙක් කලින් දවසේ වැරදුණු shots වලට විතරක් අවධානය දෙනවා වගේ (bias අඩු කරනවා).

---

## 11. Bagging and Random Forests

**Why it exists:** a single deep tree memorises its training data and swings wildly if the data changes a little. Bagging tames that by training many trees on slightly different data and averaging, so the swings cancel.

### Bagging (Bootstrap AGGregatING)

1. Create many **bootstrap samples** ([file 07](07-math-probability-statistics.md#16-sampling-lln-clt)): random samples of the training data **with replacement**, each the same size as the original.
2. Train one model (usually a deep decision tree) on each sample.
3. **Average** their predictions (regression) or **vote** (classification).

Each tree overfits in its own way, but their errors partly cancel out → **lower variance**.

**Out-of-bag (OOB) data:** sampling with replacement means each bootstrap sample leaves out about **36.8%** of the original rows. (The probability a given row is never picked in n draws is (1 − 1/n)ⁿ ≈ e⁻¹ ≈ 0.368.) Each tree can be evaluated on its unused rows: a free validation score called the **OOB score**.

### Random Forest

**Random forest** = bagging of decision trees + **one more source of randomness**: at each split, each tree may only consider a **random subset of features** (`max_features`, e.g. √(number of features)).

**Why?** If one feature is very strong, every bagged tree would split on it first, so the trees would be similar (correlated), and averaging similar trees doesn't help much. Feature randomness makes the trees **more different (decorrelated)**, so averaging reduces variance more.

```python
from sklearn.ensemble import RandomForestClassifier
rf = RandomForestClassifier(
    n_estimators=300,      # number of trees (more = better but slower; rarely overfits)
    max_depth=None,        # trees grow deep
    max_features="sqrt",   # random feature subset per split
    min_samples_leaf=2,
    oob_score=True,
    n_jobs=-1,             # use all CPU cores
    random_state=42,
)
rf.fit(X_train, y_train)
print(rf.oob_score_)
rf.feature_importances_
```

**Pros:** strong out of the box with little tuning, hard to overfit by adding trees, no scaling needed, handles mixed data, gives feature importance, parallelisable.
**Cons:** less interpretable than a single tree, large models, slower predictions than linear models, can't extrapolate beyond the training range (true of all tree models).

### Worked example: one bootstrap sample

Training rows: A, B, C, D, E. Draw 5 rows **with replacement**: B, D, B, E, A.

- In-bag rows for this tree: A, B, D, E (B appears twice)
- **Out-of-bag (OOB)** row: C, so this tree is tested on C, which it never saw
- Each of the 5 rows had a 0.8⁵ ≈ 0.33 chance of being left out. For large n this approaches 0.368, the figure quoted above.

Across 300 trees, every row is out-of-bag for roughly a third of them. Predict each row using only the trees that did not train on it, compare to the truth, and you get the OOB score without needing a separate validation set.

### Worked example: averaging cancels noise

Five trees predict a flat's price (lakhs): 310, 290, 305, 295, 300. Each is off by up to 10, but the average is (310 + 290 + 305 + 295 + 300) ÷ 5 = **300**. The individual swings of +10 and −10 cancelled. For classification the trees vote instead.

### How many features per split?

With 16 features, `max_features="sqrt"` means each split looks at only √16 = **4** random features. That is what makes trees different from each other, even if one feature is dominant.

**Where you'll meet it in real work:** a safe first model for any tabular problem: churn, credit risk, predicting delivery delays. It needs little tuning, ignores scaling, and gives a feature-importance ranking you can show a manager.

**Common mistakes:**
- **Worrying that more trees overfit.** Adding trees does not cause overfitting in a random forest; it just stops helping after a point and costs time.
- **Setting `max_features` to all features.** That removes the decorrelation and turns it into plain bagging.
- **Expecting extrapolation.** A forest cannot predict a price higher than any it has seen.

**Exam angle:** random forest = bagging + random feature subsets; it lowers variance; OOB samples give a free validation estimate; feature importance comes for free.

> **සිංහලෙන්:** Bagging කියන්නේ training data එකෙන් replacement සහිතව අහඹු samples ගොඩක් අරන්, හැම sample එකටම වෙනම tree එකක් හදන එක. උදා: rows A, B, C, D, E වලින් B, D, B, E, A තෝරාගත්තා නම්, C එක ඒ tree එකට පෙනුනේම නෑ, ඒක OOB data. ඒකෙන් නොමිලේ validation score එකක් ගන්න පුළුවන්. Random Forest වලදී හැම split එකකදීම features වලින් අහඹු කොටසක් විතරක් බලන නිසා trees එකිනෙකට වෙනස් වෙනවා. Trees 5ක් ගෙවල් මිල ලක්ෂ 310, 290, 305, 295, 300 කිව්වොත් සාමාන්‍යය 300යි, තනි tree එකක වැරදි එකිනෙක කැපිලා යනවා.

---

## 12. Boosting

**Why it exists:** a shallow tree is too simple to capture a pattern, but we can stack many simple trees, each one patching the mistakes left by the ones before. This builds a very accurate model out of very weak parts.

**Idea:** train models **sequentially**. Each new model focuses on what the previous ones got **wrong**. Combine them all with weights.

**Analogy:** a student reviews a practice test, then studies especially the questions they got wrong, takes another test, studies the new mistakes, and so on.

The base models are **weak learners**: simple models just a bit better than guessing, usually **shallow trees** (depth 1 to 8; a depth-1 tree is called a **stump**).

### AdaBoost (Adaptive Boosting)

1. Give all training examples equal weight.
2. Train a weak learner.
3. **Increase the weights** of misclassified examples, so the next learner pays more attention to them.
4. Repeat. The final prediction is a weighted vote (more accurate learners get bigger votes).

### Gradient Boosting

The modern, more general version. Each new tree is trained to predict the **residual errors** (more precisely, the negative gradient of the loss, hence "gradient") of the current ensemble.

**Worked example (regression):** predict house prices.

| House | True price | Step 0: predict mean (300) | Residual | Tree 1 predicts residual | New prediction (lr = 0.5) |
|---|---|---|---|---|---|
| A | 200 | 300 | −100 | −90 | 300 + 0.5×(−90) = 255 |
| B | 300 | 300 | 0 | 5 | 302.5 |
| C | 400 | 300 | +100 | 85 | 342.5 |

Then tree 2 fits the new residuals (−55, −2.5, +57.5), and so on. Predictions creep toward the truth.

```
prediction = base + lr·tree₁(x) + lr·tree₂(x) + lr·tree₃(x) + ...
```

**Learning rate (shrinkage):** each tree's contribution is scaled down (e.g. 0.05 to 0.3). Smaller learning rate + more trees usually generalises better, like taking small careful steps in gradient descent ([file 06](06-math-calculus.md#7-the-learning-rate)).

**Key hyperparameters:** `n_estimators` (number of trees), `learning_rate`, `max_depth` (3 to 8), `subsample` (fraction of rows per tree, adds randomness), `colsample_bytree` (fraction of features).

⚠️ Unlike random forests, **boosting CAN overfit** with too many trees. Use **early stopping** on a validation set ([file 11](11-ml-fundamentals.md#13-regularisation)).

### Worked example: round 2 of gradient boosting

Continue the house-price table. After tree 1 the predictions were A = 255, B = 302.5, C = 342.5, so the residuals (true − predicted) are:

| House | True | Pred after tree 1 | Residual | Tree 2 predicts | Pred after tree 2 (lr = 0.5) |
|---|---|---|---|---|---|
| A | 200 | 255 | −55 | −50 | 255 + 0.5 × (−50) = **230** |
| B | 300 | 302.5 | −2.5 | −2 | 302.5 + 0.5 × (−2) = **301.5** |
| C | 400 | 342.5 | +57.5 | +50 | 342.5 + 0.5 × 50 = **367.5** |

Errors shrink: A from 55 to 30, B from 2.5 to 1.5, C from 57.5 to 32.5. Mean squared error falls from (55² + 2.5² + 57.5²) ÷ 3 = 2,112.5 to (30² + 1.5² + 32.5²) ÷ 3 = 652.8. Every round chops off a slice of what is left.

### Worked example: AdaBoost re-weighting

Ten examples start with weight 0.1 each. Learner 1 gets 2 of them wrong, so its weighted error is ε = 0.2.

1. Learner's say (alpha) = ½ × ln((1 − ε) ÷ ε) = ½ × ln(4) = **0.693**
2. Multiply the weight of each wrong example by e^α = 2 (0.1 → 0.2). Multiply each right one by e^−α = 0.5 (0.1 → 0.05).
3. Total = 2 × 0.2 + 8 × 0.05 = 0.8, so divide every weight by 0.8: wrong examples now weigh **0.25** each, right ones **0.0625** each.

The two hard examples now hold half of all the weight (2 × 0.25 = 0.5), so learner 2 is forced to pay attention to them.

### Learning rate against number of trees

| Setting | Behaviour |
|---|---|
| lr = 1.0, few trees | Big steps, fast, risk of overshooting and overfitting |
| lr = 0.05, many trees | Small careful steps, usually generalises best, needs more trees |

**Where you'll meet it in real work:** credit scoring, insurance pricing, search-result ranking and fraud models, where small accuracy gains are worth money.

**Common mistakes:**
- **Skipping early stopping** and training far too many trees.
- **Making the trees deep.** Boosting wants weak, shallow trees; deep ones overfit quickly.
- **Using the test set as the early-stopping set.** Use a separate validation set.

**Exam angle:** "boosting trains sequentially, each model corrects the previous, mainly reducing bias" and "gradient boosting fits the residuals / negative gradient of the loss".

> **සිංහලෙන්:** Boosting කියන්නේ සරල tree පොඩ්ඩ පොඩ්ඩ එකින් එක හදලා, හැම අලුත් tree එකක්ම කලින් ඒවා කරපු වැරදි නිවැරදි කරන්න උත්සාහ කරන එක. Gradient boosting වලදී අලුත් tree එක residual (ඇත්ත අගය − අනුමානය) වලට fit කරනවා. උදා: ගෙයක ඇත්ත මිල 200, අනුමානය 255 නම් residual එක −55. Tree 2 −50 කියලා learning rate 0.5න් ගුණ කරලා එකතු කරනකොට අනුමානය 230ට අඩු වෙනවා, වැරැද්ද 55 ඉඳන් 30ට බහිනවා. AdaBoost වලදී වැරදුණු examples වල weight වැඩි කරනවා. Trees ගොඩක් දැම්මොත් boosting overfit වෙන්න පුළුවන් නිසා early stopping පාවිච්චි කරන්න.

---

## 13. XGBoost, LightGBM, CatBoost

**Why it exists:** plain gradient boosting is slow and fiddly on big tables. These three libraries add engineering (speed, regularisation, missing-value handling, GPU support) so that boosted trees can be trained on millions of rows in minutes.

Highly optimised gradient boosting libraries. They **win most competitions on tabular data** and are workhorses in industry (fraud, credit scoring, churn, pricing, ranking).

| Library | Strengths |
|---|---|
| **XGBoost** | The classic; regularised; robust; GPU support |
| **LightGBM** (Microsoft) | Very fast on big data; grows trees "leaf-wise"; native categorical support |
| **CatBoost** (Yandex) | Best native handling of **categorical features** (no one-hot needed); good defaults |

All three handle missing values natively and support GPUs.

```python
import xgboost as xgb
model = xgb.XGBClassifier(
    n_estimators=2000,
    learning_rate=0.05,
    max_depth=6,
    subsample=0.8,
    colsample_bytree=0.8,
    early_stopping_rounds=50,     # stop when validation doesn't improve for 50 rounds
    eval_metric="logloss",
)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)], verbose=False)
print(model.best_iteration)
```

```python
import lightgbm as lgb
model = lgb.LGBMClassifier(n_estimators=2000, learning_rate=0.05, num_leaves=31)
model.fit(X_train, y_train, eval_set=[(X_val, y_val)],
          callbacks=[lgb.early_stopping(50)])
```

**Rule of thumb for tabular data:** start with a logistic/linear baseline, then try LightGBM/XGBoost/CatBoost. Deep learning rarely beats well-tuned boosted trees on typical tables.

### Which one to pick?

| Your situation | Good first choice |
|---|---|
| General tabular data, want the well-known default | XGBoost |
| Millions of rows, training speed matters | LightGBM |
| Many text-like category columns (city, product type, district) | CatBoost |

### Worked example: what early stopping saves

You set `n_estimators=2000`, `learning_rate=0.05`, `early_stopping_rounds=50`. The validation log-loss (an illustration) falls round after round, reaches its lowest value at round 640, then creeps up. Training waits 50 more rounds without improvement and stops at round 690. You saved training 1,310 unnecessary trees, and `model.best_iteration` tells you to use the first 640. Without early stopping you would have fitted all 2,000 and ended with a model that overfits.

**GPUs:** XGBoost, LightGBM and CatBoost can all train on NVIDIA GPUs, and the RAPIDS cuML library from NVIDIA provides scikit-learn style models that run on the GPU. This is useful when a table is too large for a CPU to handle comfortably.

**Where you'll meet it in real work:** card-fraud scoring, loan default prediction, e-commerce ranking, and ad click prediction. Most of the "AI" in a bank's risk department is a boosted-tree model.

**Common mistakes:**
- **Using the test set for early stopping.** The test score then becomes optimistic.
- **One-hot encoding for CatBoost.** It is built to take raw category columns directly.
- **Tuning many parameters at once.** Start with learning rate, number of trees (with early stopping) and tree depth.

**Exam angle:** know that gradient-boosted trees remain the strongest default for tabular data, that deep learning is not automatically better on tables, and that these libraries support GPU acceleration.

> **සිංහලෙන්:** XGBoost, LightGBM සහ CatBoost කියන්නේ gradient boosting වේගවත් කරලා හදපු libraries තුනක්. Bank එකක fraud සහ ණය අවදානම අනුමාන කරන්න බොහෝ විට පාවිච්චි කරන්නේ මේවායි. Rows මිලියන ගණනක් තියෙනවා නම් LightGBM වේගවත්, දිස්ත්‍රික්කය, නගරය වගේ category columns ගොඩක් තියෙනවා නම් CatBoost හොඳයි. Early stopping කියන්නේ validation score එක තව වැඩිදියුණු වෙන්නේ නැති වුණාම training නවත්වන එක. Trees 2000ක් දාලා 640දි හොඳම ලකුණ ආවොත්, 690දි නවත්වලා වෙලාව ඉතිරි කරගන්න පුළුවන්. මේවා NVIDIA GPU එකකත් train කරන්න පුළුවන්.

---

## 14. Stacking and voting

**Why it exists:** after you have a few decent but different models, you can often squeeze out extra accuracy by letting them work together instead of picking just one.

### Voting

Combine different model types:
- **Hard voting:** majority of predicted classes
- **Soft voting:** average the predicted probabilities (usually better)

```python
from sklearn.ensemble import VotingClassifier
vote = VotingClassifier([("lr", LogisticRegression(max_iter=1000)),
                         ("rf", RandomForestClassifier()),
                         ("svm", SVC(probability=True))], voting="soft")
```

### Stacking

Train several **base models**, then train a **meta-model** (often logistic regression) that learns how best to combine their predictions. The base models' predictions for training the meta-model must come from cross-validation (**out-of-fold predictions**), or it will leak.

```python
from sklearn.ensemble import StackingClassifier
stack = StackingClassifier(
    estimators=[("rf", RandomForestClassifier()), ("xgb", xgb.XGBClassifier())],
    final_estimator=LogisticRegression(), cv=5)
```

Ensembles work best when the models are **diverse** (make different kinds of mistakes).

### Worked example: hard voting vs soft voting

Three models give the probability that an email is spam: logistic regression 0.90, random forest 0.40, SVM 0.45.

| Method | Calculation | Result |
|---|---|---|
| Hard voting | predictions are spam, not spam, not spam → 1 vs 2 | **not spam** |
| Soft voting | (0.90 + 0.40 + 0.45) ÷ 3 = 0.583 | **spam** |

Soft voting kept the information that the first model was very sure (0.90), while the other two were only mildly leaning the other way (0.40, 0.45). That is why it is usually better, provided the models give reasonable probabilities.

### Why out-of-fold predictions matter in stacking

With 5-fold cross-validation, each training row is predicted by a model that **did not see that row**:

```
Fold 1 held out → base models trained on folds 2-5 predict fold 1
Fold 2 held out → base models trained on folds 1,3,4,5 predict fold 2
...
All the held-out predictions together → training data for the meta-model
```

If instead you predicted on the same rows the base models were trained on, those predictions would be unrealistically perfect, and the meta-model would learn to trust the base models too much (data leakage).

**Where you'll meet it in real work:** the final hours of a competition, when teams stack their best models for a small boost. In production, teams often avoid stacking because of the added complexity; a single well-tuned boosted model is easier to maintain.

**Common mistakes:**
- **Stacking with in-sample predictions** (leakage).
- **Stacking models that are almost identical**, which adds complexity but no new information.
- **Ignoring maintenance cost.** A 2% gain that needs five models to deploy may not be worth it.

**Exam angle:** hard voting = majority class; soft voting = average of probabilities; stacking = a meta-model learns how to combine base models, trained on out-of-fold predictions.

> **සිංහලෙන්:** Voting වලදී models කිහිපයක අදහස් එකතු කරනවා. Hard voting කියන්නේ බහුතර ඡන්දය. Soft voting කියන්නේ probabilities වල සාමාන්‍යය ගන්න එක. උදා: spam probability එක 0.90, 0.40, 0.45 නම් hard voting එකෙන් "spam නෙවෙයි" (2ට 1), soft voting එකෙන් (0.90 + 0.40 + 0.45) ÷ 3 = 0.583 නිසා "spam". Stacking වලදී base models වල predictions බලලා, ඒවා කොහොමද එකතු කරන්නේ කියලා meta-model එකක් ඉගෙන ගන්නවා. ඒ predictions cross-validation වලින් (out-of-fold) ගන්න ඕනේ, නැත්නම් leak වෙනවා.

---

## 15. Which algorithm when?

**Why it exists:** with so many algorithms, beginners freeze. A simple decision guide gets you to a reasonable first model in minutes, and your own cross-validated results then settle the question.

| Algorithm | Type | Needs scaling? | Interpretable? | Speed (train) | Best for |
|---|---|---|---|---|---|
| Linear / Ridge / Lasso | Regression | Yes | ⭐⭐⭐ | ⚡⚡⚡ | Baseline; linear relationships |
| Logistic regression | Classification | Yes | ⭐⭐⭐ | ⚡⚡⚡ | Baseline; text with TF-IDF; when probabilities matter |
| kNN | Both | Yes | ⭐⭐ | ⚡⚡⚡ (predict slow) | Small data, few features |
| Naive Bayes | Classification | No | ⭐⭐ | ⚡⚡⚡ | Text; tiny data; very fast baselines |
| Decision tree | Both | No | ⭐⭐⭐ | ⚡⚡⚡ | Explainable rules |
| SVM | Both | Yes | ⭐ | ⚡ | Small/medium high-dimensional data |
| Random forest | Both | No | ⭐⭐ | ⚡⚡ | Strong default with little tuning |
| Gradient boosting (XGBoost/LightGBM/CatBoost) | Both | No | ⭐⭐ | ⚡⚡ | **Best accuracy on tabular data** |
| Neural networks | Both | Yes | ⭐ | ⚡ (GPU) | Images, text, audio, huge data (file 15) |

### A quick decision path

```
Is your data a table of rows and columns?
 ├─ yes ─► Try a simple baseline first (logistic / linear regression)
 │         then LightGBM / XGBoost / CatBoost, and a random forest
 │         Need to explain each decision to a customer?  ─► tree or logistic regression
 │         Tiny data, high-dimensional text?             ─► Naive Bayes / SVM / logistic
 └─ no  ─► Images, audio or text → neural networks (files 15 onwards)
```

### Worked example: choosing for three Sri Lankan problems

| Problem | Data | Sensible first choice | Reason |
|---|---|---|---|
| Predict next month's electricity bill of a household | 5,000 rows, 12 numeric columns | Linear / Ridge regression, then gradient boosting | Mostly smooth numeric relationships; explainable |
| Decide if a loan is approved, and explain refusals to the customer | 200,000 rows, mixed columns | Logistic regression baseline, then LightGBM | Regulators want reasons; boosted trees add accuracy |
| Tag 20,000 short Sinhala/English messages as complaint or enquiry | Text turned into word counts | Naive Bayes or logistic regression | Fast, strong on sparse text |

**Common mistakes:**
- **Choosing by fashion.** A complicated model is not better until it beats the baseline in cross-validation.
- **Ignoring the cost of mistakes and the need to explain.** The "best" model on accuracy may be unusable if it cannot be explained.
- **Comparing models on one lucky split.** Use cross-validation and look at the spread.

**Exam angle:** typical wording is "a company has a large tabular dataset and needs the best accuracy" (gradient boosting) or "needs an interpretable model for regulators" (logistic regression or a small tree).

> **සිංහලෙන්:** Algorithms ගොඩක් තියෙනකොට මොකක්ද තෝරන්නේ කියලා ප්‍රශ්නයක් එනවා. පහසු නීතියක් තියෙනවා: මුලින් logistic හෝ linear regression වගේ සරල baseline එකක් හදන්න. Table එකක් නම් ඊට පස්සේ LightGBM, XGBoost හෝ random forest උත්සාහ කරන්න. ණයක් reject කළාම හේතුව customer ට කියන්න ඕනේ නම් logistic regression හෝ පොඩි tree එකක් හොඳයි. Text data ටිකක් නම් Naive Bayes හෝ logistic regression වේගවත්. Image, audio වලට neural networks. අන්තිමට cross-validation ලකුණු බලලා තීරණය කරන්න.

---

## 16. Hands-on

**Why it exists:** reading about algorithms is not the same as seeing them compete. Running every model on the same data with the same folds is the fairest way to learn which one suits a problem.

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.tree import DecisionTreeClassifier
from sklearn.svm import SVC
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.dummy import DummyClassifier

X, y = load_breast_cancer(return_X_y=True)
models = {
    "Baseline": DummyClassifier(strategy="most_frequent"),
    "LogReg": make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000)),
    "kNN": make_pipeline(StandardScaler(), KNeighborsClassifier(5)),
    "NaiveBayes": GaussianNB(),
    "Tree": DecisionTreeClassifier(max_depth=4, random_state=0),
    "SVM": make_pipeline(StandardScaler(), SVC()),
    "RandomForest": RandomForestClassifier(300, random_state=0),
    "GradBoost": GradientBoostingClassifier(random_state=0),
}
cv = StratifiedKFold(5, shuffle=True, random_state=0)
for name, m in models.items():
    s = cross_val_score(m, X, y, cv=cv, scoring="accuracy")
    print(f"{name:12s} {s.mean():.3f} ± {s.std():.3f}")
```

Typical output: baseline ≈ 0.63; most models 0.93 to 0.98. On this small, clean dataset even logistic regression is excellent, a reminder to always try simple models.

### How to read the output

Each line prints a mean accuracy and a "±" standard deviation over the 5 folds. A line such as `RandomForest 0.96 ± 0.02` means: on average 96% right, and individual folds ranged roughly between 94% and 98%.

- If two models differ by less than the ± spread (for example 0.96 ± 0.02 against 0.95 ± 0.02), you **cannot** claim one is better. The gap may be luck of the split.
- The **Baseline** line (always predict the most common class) is your reference. Any model that is not clearly above it has learned nothing useful.
- On this clean, small dataset, logistic regression typically sits near the top. That is not a flaw in the fancy models; it is a lesson that simple models often win on easy data.

### Things to try next

1. Add `scoring="f1"` or `"recall"` in `cross_val_score` and see whether the ranking changes (this ties to [file 13](13-evaluation-metrics-and-tuning.md)).
2. Remove `StandardScaler` from the kNN and SVM pipelines and watch their scores drop.
3. Raise the tree's `max_depth` from 4 to 20 and watch it overfit.

**Common mistakes:**
- **Scaling before the cross-validation loop** instead of inside a pipeline, which leaks information from the validation folds.
- **Picking the winner by the last digit.** Look at the spread.
- **Comparing models with different splits.** Use the same `cv` object for all of them.

**Exam angle:** the safe workflow is baseline, several candidate models with the same cross-validation, then tune the best one and test once at the end.

> **සිංහලෙන්:** මේ කොටසේදී එකම data එකේ, එකම cross-validation folds වලින් algorithms 8ක් එකිනෙකා එක්ක සසඳනවා. Output එකේ "0.96 ± 0.02" කියන්නේ සාමාන්‍යයෙන් 96% හරි, folds අතර 94% ඉඳන් 98% දක්වා වෙනස් වුණා කියන එක. ලකුණු දෙකක වෙනස ± එකට වඩා පොඩි නම් එකක් අනිකට වඩා හොඳයි කියලා කියන්න බෑ, ඒක split එකේ වාසනාව වෙන්න පුළුවන්. Baseline (හැමදාම වැඩිම class එක කියන එක) තමයි ඔයාගේ මිනුම. Data පිරිසිදු නම් logistic regression වගේ සරල model එකත් ඉහළින්ම ඉන්නවා, ඒ නිසා හැමදාම සරල එකෙන් පටන් ගන්න.

```quiz
[
  {"q": "A linear regression model gives price = 3 × size + 20 (price in Rs. lakhs, size in hundreds of sq ft). What is the prediction for size = 10?", "options": ["30", "50", "60", "320"], "answer": 1, "why": "3 × 10 + 20 = 50. 30 forgets the intercept b = 20; 60 would be 3 × 10 + 30 and is not from the formula."},
  {"q": "Logistic regression gives z = 0 for a customer. What probability does the sigmoid output?", "options": ["0", "0.5", "1", "It cannot be known without the data"], "answer": 1, "why": "sigmoid(0) = 1 / (1 + e^0) = 1 / 2 = 0.5, the point where the model is exactly undecided. Probability 0 would need a very negative z."},
  {"q": "In scikit-learn's LogisticRegression, what happens when you make C smaller?", "options": ["Regularisation gets weaker", "Regularisation gets stronger", "The model becomes a decision tree", "Nothing, C only affects speed"], "answer": 1, "why": "C is the inverse of the regularisation strength (C = 1/lambda), so a smaller C means a stronger penalty. People often assume the opposite because 'C' feels like 'complexity'."},
  {"q": "A node contains 8 'yes' and 2 'no' examples. What is its Gini impurity?", "options": ["0.20", "0.32", "0.50", "0.68"], "answer": 1, "why": "Gini = 1 - (0.8^2 + 0.2^2) = 1 - (0.64 + 0.04) = 0.32. 0.50 would be a 50/50 node, which is maximum impurity for two classes."},
  {"q": "Why does a random forest choose a random subset of features at each split?", "options": ["To make training faster than a single tree", "To decorrelate the trees so their errors cancel when averaged", "To remove the need for training data", "To make the forest easier to interpret"], "answer": 1, "why": "If one feature is very strong every tree would split on it first and the trees would look alike, so averaging gains little. Speed is a side effect, not the reason."},
  {"q": "Which statement about bagging and boosting is correct?", "options": ["Bagging trains models one after another; boosting trains them in parallel", "Both mainly reduce variance", "Bagging mainly reduces variance; boosting mainly reduces bias and trains sequentially", "Boosting cannot overfit"], "answer": 2, "why": "Bagging averages independent models (variance down); boosting fixes errors step by step (bias down). The first option swaps the two, and boosting can overfit with too many trees."},
  {"q": "Three models predict spam probabilities 0.90, 0.40 and 0.45. A soft-voting ensemble predicts spam if the average is above 0.5. What happens?", "options": ["Not spam, because two models are below 0.5", "Spam, because the average is about 0.58", "Spam, because the first model is above 0.5", "It is a tie"], "answer": 1, "why": "(0.90 + 0.40 + 0.45) / 3 = 0.583 > 0.5. Hard voting would say 'not spam' (2 against 1), which is the tempting wrong answer; soft voting uses the confidence."},
  {"q": "You compare kNN on a dataset where one feature is salary in rupees (tens of thousands) and another is age (20 to 60). What should you do first?", "options": ["Nothing, kNN handles any scale", "Scale the features, since salary would dominate the distances", "Remove the age column", "Increase k to 100"], "answer": 1, "why": "kNN uses distances, and a difference of Rs. 20,000 in salary dwarfs a difference of 10 years in age. Scaling puts them on equal footing; tree models would not need it."}
]
```

---

## 17. Check yourself

**Q1.** A linear regression gives price = 3·size + 20 (in $1000s, size in m²). Predict the price of an 80 m² flat and interpret the 3.
<details><summary>Answer</summary>3 × 80 + 20 = $260k. Each extra m² adds $3,000, holding other things constant.</details>

**Q2.** Logistic regression: z = 2x − 4. What's the probability at x = 2? At x = 3?
<details><summary>Answer</summary>x=2: z=0 → 0.5. x=3: z=2 → sigmoid(2) ≈ 0.88.</details>

**Q3.** Why must you scale features for kNN but not for random forests?
<details><summary>Answer</summary>kNN uses distances, which large-scale features dominate. Trees split on one feature at a time using thresholds, so scale doesn't matter.</details>

**Q4.** A node has 8 "yes" and 2 "no". Compute its Gini impurity.
<details><summary>Answer</summary>1 − (0.8² + 0.2²) = 1 − (0.64 + 0.04) = **0.32**.</details>

**Q5.** What's the difference between bagging and boosting?
<details><summary>Answer</summary>Bagging trains models independently in parallel on bootstrap samples and averages them (reduces variance). Boosting trains models sequentially, each correcting the previous errors (reduces bias).</details>

**Q6.** Why does a random forest pick random feature subsets at each split?
<details><summary>Answer</summary>To decorrelate the trees. Diverse trees' errors cancel better when averaged.</details>

**Q7.** In an SVM, what happens when you increase C?
<details><summary>Answer</summary>Violations are punished more → narrower margin → fits training data more tightly → risk of overfitting.</details>

**Q8.** About what fraction of rows is left out of each bootstrap sample, and what's it used for?
<details><summary>Answer</summary>≈ 36.8%. Used as "out-of-bag" data for a free validation estimate.</details>

**Q9.** You have a 200,000-row customer table with mixed numeric and categorical columns. Which model family would you try first for best accuracy?
<details><summary>Answer</summary>Gradient-boosted trees (LightGBM / XGBoost / CatBoost), after a logistic regression baseline.</details>

**Q10.** A three-wheeler's fare model is fare = 80 × km + 100. What does 80 mean and what does 100 mean?
<details><summary>Answer</summary>80 is the weight: each extra km adds Rs. 80. 100 is the bias (intercept): the fare when km = 0, i.e. the base fare.</details>

**Q11.** Three independent classifiers are each 70% accurate. Roughly how accurate is a majority vote of the three?
<details><summary>Answer</summary>3 × 0.7² × 0.3 + 0.7³ = 0.441 + 0.343 = 0.784, about 78%. It only works if their mistakes are independent.</details>

**Q12.** Why do we add logarithms of probabilities in Naive Bayes instead of multiplying them?
<details><summary>Answer</summary>Multiplying hundreds of small probabilities underflows to 0 on a computer. Adding their logs keeps the numbers in a safe range and gives the same winner.</details>

---

## 18. New words in this file

| Word | Meaning |
|---|---|
| Linear regression, OLS | Fit a weighted sum; least-squares solution |
| Coefficient / intercept | Learned weight / bias |
| Multicollinearity | Features highly correlated with each other |
| Residual, residual plot | y − ŷ / plot to check model assumptions |
| Homoscedasticity | Constant error spread |
| Polynomial regression, degree | Linear model on powers of features / highest power |
| SVR, quantile regression | Regression variants |
| Logistic regression, logit | Linear score + sigmoid for classification / the raw score |
| Odds | p / (1 − p) |
| `C` (sklearn) | Inverse regularisation strength |
| Decision boundary | Where predictions switch class |
| Threshold | Probability cut-off for yes/no |
| One-vs-Rest, One-vs-One | Ways to extend binary classifiers to many classes |
| Softmax / multinomial regression | Multi-class logistic regression |
| kNN, k, lazy learner | Classify by nearest neighbours' vote / how many / no training phase |
| Naive Bayes (multinomial, Bernoulli, Gaussian) | Bayes' theorem with independence assumption |
| Laplace smoothing | Add 1 to counts to avoid zero probabilities |
| Decision tree, root, node, leaf, depth | Flowchart model and its parts |
| Gini impurity, entropy, information gain | Measures used to choose splits |
| Greedy algorithm | Best choice now, no planning ahead |
| Pruning (pre/post), `max_depth`, `min_samples_leaf`, `ccp_alpha` | Limiting tree growth |
| Feature importance | How much each feature helped the model |
| SVM, margin, support vectors | Widest-street classifier / street width / points defining it |
| Soft margin, hinge loss, C | Allowing violations / their penalty / penalty strength |
| Kernel trick, linear/poly/RBF kernel, gamma | Implicit high-dimensional mapping / kernel types / RBF width |
| Ensemble learning, wisdom of crowds | Combining models |
| Bagging, bootstrap sample | Parallel models on resampled data |
| Out-of-bag (OOB) score | Validation on rows not in a tree's sample |
| Random forest, `max_features`, decorrelation | Bagged trees with random feature subsets |
| Boosting, weak learner, stump | Sequential error-correcting models / simple model / depth-1 tree |
| AdaBoost | Boosting by re-weighting misclassified examples |
| Gradient boosting, shrinkage | Each tree fits the residuals / scaled-down contributions |
| XGBoost, LightGBM, CatBoost | Optimised gradient boosting libraries |
| Early stopping rounds | Stop boosting when validation stops improving |
| Voting (hard/soft), stacking, meta-model, out-of-fold predictions | Ways to combine different models |
| Residual (least squares) | The vertical gap between a point and the fitted line |
| Softmax scores, logits | Raw class scores before softmax makes them probabilities |
| Margin width (2 / ‖w‖) | How wide the SVM street is; smaller w means a wider street |
| AdaBoost alpha | The say a weak learner gets in the final vote |
| Learning rate vs number of trees | Smaller steps need more trees |
| Log-probabilities (Naive Bayes) | Adding logs instead of multiplying tiny probabilities |
| Decorrelated trees | Trees that make different mistakes, so averaging helps |

**Next:** [13-evaluation-metrics-and-tuning.md](13-evaluation-metrics-and-tuning.md)
