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

---

## 2. Polynomial regression

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

---

## 3. Logistic regression

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

---

## 4. Decision boundaries and thresholds

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

---

## 5. Multi-class

How do binary classifiers handle 3+ classes?

- **One-vs-Rest (OvR):** train one binary classifier per class ("cat vs not-cat", "dog vs not-dog", ...). Pick the class with the highest score.
- **One-vs-One (OvO):** a classifier for every pair of classes; majority vote.
- **Softmax regression (multinomial logistic regression):** one score per class, then **softmax** ([file 07](07-math-probability-statistics.md#13-softmax)) turns scores into probabilities that sum to 1. Loss: cross-entropy. This is exactly the final layer of most neural network classifiers and of LLMs (which "classify" the next token among ~100,000 options).

---

## 6. k-Nearest Neighbours

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

---

## 7. Naive Bayes

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

---

## 8. Decision trees

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

---

## 9. Support Vector Machines

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

---

## 10. Ensemble learning

**Idea:** combine many models to get a better one than any single model.

**Wisdom of crowds:** at a fair, 800 people guessed the weight of an ox. Individual guesses were way off, but their **average** was within 1% of the truth. Errors cancel out when they're **independent**.

Ensembles are among the most powerful techniques for tabular data. Three main families:

| Method | How | Fixes |
|---|---|---|
| **Bagging** | Train many models **in parallel** on random samples of data; average them | **Variance** (overfitting) |
| **Boosting** | Train models **one after another**, each fixing the previous ones' mistakes | **Bias** (underfitting), and variance too |
| **Stacking** | Train a "meta-model" to combine different models' predictions | Both |

---

## 11. Bagging and Random Forests

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

---

## 12. Boosting

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

---

## 13. XGBoost, LightGBM, CatBoost

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

---

## 14. Stacking and voting

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

---

## 15. Which algorithm when?

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

---

## 16. Hands-on

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

**Next:** [13-evaluation-metrics-and-tuning.md](13-evaluation-metrics-and-tuning.md)
