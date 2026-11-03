# 11: Machine Learning Fundamentals

> **Before you start:** [01](01-big-picture-and-data.md) (traditional programming vs ML, model, features, labels), [04](04-math-numbers-and-functions.md) (functions, y = wx + b, MSE, argmin), [06](06-math-calculus.md) (gradient descent, learning rate), [07](07-math-probability-statistics.md) (cross-entropy, MLE/MAP), [10](10-data-science-workflow.md) (features, encoding, scaling, leakage).
>
> **After this file you can:** explain the types of ML, the parts of every ML system (model, parameters, loss, optimiser), how to split data honestly, how to diagnose overfitting and underfitting, regularisation, cross-validation, and how to build a clean scikit-learn pipeline.

This file is the foundation for everything after it, including deep learning and LLMs. Read it slowly.

---

## Table of contents

1. [What is machine learning? (precise version)](#1-what-is-machine-learning)
2. [Types of machine learning](#2-types-of-machine-learning)
3. [Supervised learning: regression vs classification](#3-regression-vs-classification)
4. [The five ingredients of every ML model](#4-the-five-ingredients)
5. [Parameters vs hyperparameters](#5-parameters-vs-hyperparameters)
6. [Loss functions](#6-loss-functions)
7. [Training = optimisation: gradient descent for ML](#7-training-is-optimisation)
8. [Batch, mini-batch, stochastic gradient descent; epochs](#8-batch-mini-batch-stochastic-epochs)
9. [Generalisation: the real goal](#9-generalisation)
10. [Train / validation / test splits](#10-train-validation-test-splits)
11. [Underfitting and overfitting](#11-underfitting-and-overfitting)
12. [Bias-variance trade-off](#12-bias-variance-trade-off)
13. [Regularisation (L1, L2, early stopping)](#13-regularisation)
14. [Cross-validation](#14-cross-validation)
15. [Baselines: always start simple](#15-baselines)
16. [scikit-learn: the standard ML library](#16-scikit-learn)
17. [Pipelines: preprocessing without leakage](#17-pipelines)
18. [The full ML project recipe](#18-the-full-ml-project-recipe)
19. [No free lunch, and choosing a model](#19-no-free-lunch)
20. [Check yourself](#20-check-yourself)
21. [New words in this file](#21-new-words-in-this-file)

---

## 1. What is machine learning?

From [file 01](01-big-picture-and-data.md#3-traditional-programming-vs-machine-learning): instead of writing rules, we give examples and the computer learns the rules.

A classic precise definition (Tom Mitchell, 1997):

> A program **learns** from **experience E** with respect to a **task T** and a **performance measure P**, if its performance at T, as measured by P, improves with E.

**Example:** spam filter
- **T** (task): classify emails as spam / not spam
- **E** (experience): 100,000 labelled emails
- **P** (performance): % of emails classified correctly

**In maths terms:** we want a function f (the model, [file 04](04-math-numbers-and-functions.md#6-functions)) so that **ŷ = f(x)** is close to the true **y**, for inputs **x** we have **never seen before**.

---

## 2. Types of machine learning

### Supervised learning

**Data has labels** (the right answers). The model learns the mapping X → y.

**Analogy:** a student learning with an answer key.

Examples: house price prediction, spam detection, medical diagnosis, image classification.

### Unsupervised learning

**No labels.** The model finds structure or patterns on its own.

**Analogy:** sorting a pile of mixed LEGO pieces into groups without being told the categories.

Examples: **clustering** customers into segments, **dimensionality reduction** (compressing many features into a few), **anomaly detection** (finding unusual transactions). Covered in [file 14](14-unsupervised-learning-and-more.md).

### Semi-supervised learning

A few labelled examples + lots of unlabelled ones. Useful because labelling is expensive.

### Self-supervised learning

The labels are **created automatically from the data itself**. For example, hide a word in a sentence and ask the model to predict it, or predict the next word. No humans needed, so you can train on enormous amounts of data.

**This is how LLMs are pretrained** (file 20): "predict the next word" on trillions of words of internet text. It's technically supervised (there's a target) but the targets come free from the data.

### Reinforcement learning (RL)

An **agent** takes **actions** in an **environment** and gets **rewards** or penalties. It learns a strategy (**policy**) to maximise total reward through trial and error.

**Analogy:** training a dog with treats.

Examples: game-playing AIs (AlphaGo), robotics, and **RLHF**, which is used to make LLMs helpful (file 21). Basics in [file 30](30-advanced-topics-and-career.md).

```
                    Machine Learning
       ┌──────────────┬──────┴───────┬─────────────────┐
  Supervised     Unsupervised   Self-supervised    Reinforcement
  (labels)       (no labels)    (labels from data) (rewards)
  ├ Regression   ├ Clustering   └ LLM pretraining   └ Games, robots,
  └ Classification├ Dim. reduction                     RLHF
                  └ Anomaly detection
```

### Other distinctions you'll hear

- **Batch (offline) learning:** train once on a fixed dataset. vs **Online learning:** update continuously as new data arrives.
- **Instance-based learning:** remember the examples and compare new ones to them (k-nearest neighbours). vs **Model-based learning:** learn parameters, then discard the data (linear regression, neural networks).
- **Discriminative vs generative models** ([file 01](01-big-picture-and-data.md#generative-ai-genai)): discriminative models learn P(y | x), the boundary between classes; generative models learn how the data itself is distributed and can create new samples (file 25).

---

## 3. Regression vs classification

The two main kinds of supervised learning:

| | **Regression** | **Classification** |
|---|---|---|
| Predicts | a **number** (continuous) | a **category** (class) |
| Examples | house price, temperature tomorrow, sales next month | spam/not spam, disease type, which digit (0 to 9) |
| Output | e.g. $305,000 | e.g. "spam" (often with a probability: 0.93) |
| Typical loss | MSE | cross-entropy |
| Typical metrics | MAE, RMSE, R² | accuracy, precision, recall, F1, ROC-AUC |

**Types of classification:**
- **Binary:** 2 classes (yes/no, churn/stay)
- **Multi-class:** 3+ classes, exactly one correct (cat/dog/bird)
- **Multi-label:** several labels can be true at once (a movie can be "comedy" AND "romance")

**Trap:** predicting a number doesn't always mean regression. Predicting a star rating (1 to 5) could be either, depending on whether you treat it as ordered numbers or categories.

---

## 4. The five ingredients

Every ML model, from a straight line to GPT, has these five parts:

| Ingredient | What it is | Linear regression example |
|---|---|---|
| **1. Data** | Examples (X, y) | 1,000 houses with size and price |
| **2. Model (hypothesis)** | A function family with adjustable parameters | ŷ = w·x + b |
| **3. Loss function** | Measures how wrong predictions are | MSE |
| **4. Optimiser** | Method to adjust parameters to reduce loss | gradient descent |
| **5. Evaluation** | How we check it works on new data | RMSE on a test set |

Training means: **find the parameters θ that minimise the loss on the training data**:

```
θ* = argmin  Loss(θ)        (argmin from file 04)
       θ
```

…while making sure it also works on new data (that's section 9 onwards).

---

## 5. Parameters vs hyperparameters

| | **Parameters** | **Hyperparameters** |
|---|---|---|
| What | Numbers the model **learns** from data | Settings **you choose** before training |
| Examples | weights w and bias b; the numbers in a neural network | learning rate, number of trees, tree depth, regularisation strength λ, number of layers |
| Set by | the optimiser (training) | you (or a tuning search, file 13) |
| Analogy | what a student learns from studying | how many hours/day they study, which textbook |

"A 7-billion-parameter LLM" = 7 billion learned numbers.

---

## 6. Loss functions

**Loss function** (also called **cost function** or **objective**): a number that measures how bad the predictions are. Lower = better. The optimiser's job is to make it small.

(Technically, "loss" is for one example and "cost" is the average over the dataset, but people use them interchangeably.)

### Regression losses

**Mean Squared Error (MSE)** ([file 04](04-math-numbers-and-functions.md#14-summation-σ-and-product-π-notation)):
```
MSE = (1/n) Σ (yᵢ − ŷᵢ)²
```
Squares the errors, so big errors are punished heavily. Sensitive to outliers.

**Mean Absolute Error (MAE):**
```
MAE = (1/n) Σ |yᵢ − ŷᵢ|
```
More robust to outliers.

**Huber loss:** MSE for small errors, MAE for large ones. The best of both.

**Worked example:** true y = [100, 200, 300], predictions ŷ = [110, 190, 400]
- errors: −10, 10, −100
- MSE = (100 + 100 + 10,000) / 3 = **3,400**
- MAE = (10 + 10 + 100) / 3 = **40**

The one big miss (100) dominates MSE.

### Classification losses

**Cross-entropy / log loss** ([file 07](07-math-probability-statistics.md#23-cross-entropy)): −log(probability given to the correct class). Punishes confident wrong answers severely.

**Binary cross-entropy** for two classes: −[y·log(p) + (1−y)·log(1−p)].

**Hinge loss:** used by Support Vector Machines (file 12).

### Why not use accuracy as the loss?

Accuracy is a step function: it only changes when a prediction flips class, so its gradient ([file 06](06-math-calculus.md#9-the-gradient)) is zero almost everywhere and gradient descent can't use it. Cross-entropy changes smoothly as probabilities improve. So we **train** with a smooth loss and **report** human-friendly metrics like accuracy.

---

## 7. Training is optimisation

We use **gradient descent** from [file 06](06-math-calculus.md#6-gradient-descent-in-one-dimension) to find the best parameters:

```
repeat:
    1. predictions = model(X)                    (forward pass)
    2. loss = Loss(predictions, y)
    3. gradients = ∂loss/∂θ for every parameter  (backward pass)
    4. θ = θ − learning_rate × gradients          (update)
```

### Worked example: linear regression from scratch

```python
import numpy as np

# data: y ≈ 3x + 2 plus noise
rng = np.random.default_rng(0)
X = rng.uniform(0, 10, 100)
y = 3 * X + 2 + rng.normal(0, 1, 100)

w, b = 0.0, 0.0
lr = 0.01
for epoch in range(1000):
    y_hat = w * X + b                       # 1. predict
    error = y_hat - y
    loss = np.mean(error ** 2)              # 2. MSE
    dw = 2 * np.mean(error * X)             # 3. gradients (chain rule, file 06)
    db = 2 * np.mean(error)
    w -= lr * dw                            # 4. update
    b -= lr * db
    if epoch % 200 == 0:
        print(f"epoch {epoch}: loss={loss:.3f}, w={w:.3f}, b={b:.3f}")
# ends near w ≈ 3, b ≈ 2: the model discovered the hidden rule!
```

Every ML library does this (with smarter optimisers) under the hood.

---

## 8. Batch, mini-batch, stochastic; epochs

How much data do we use to compute each gradient?

| Variant | Gradient computed on | Pros | Cons |
|---|---|---|---|
| **Batch gradient descent** | the whole dataset | stable, exact gradient | very slow per step for big data; must fit in memory |
| **Stochastic gradient descent (SGD)** | 1 random example | fast steps, noise helps escape bad spots | very noisy |
| **Mini-batch gradient descent** | a small random group (e.g. 32, 64, 256) | best of both; fits GPUs well | one more hyperparameter |

In practice, **mini-batch** is used almost always, and people (confusingly) still call it "SGD".

**Vocabulary:**
- **Batch size:** examples per mini-batch (e.g. 32)
- **Iteration / step:** one parameter update (one mini-batch)
- **Epoch:** one full pass through the entire training set

**Example:** 10,000 training examples, batch size 100 → **100 steps per epoch**. Training for 20 epochs = 2,000 steps.

**Shuffle** the data each epoch so mini-batches differ.

---

## 9. Generalisation

> **The goal of ML is not to do well on the training data. It's to do well on NEW data.**

**Generalisation** = performing well on unseen data.

**Analogy:** a student who memorises the answers to last year's exam papers word for word gets 100% on those papers but fails the real exam with new questions. A student who understands the concepts does well on both. We want the second student.

So we always keep some data **hidden from training** to measure real performance.

---

## 10. Train, validation, test splits

```
┌──────────────────────────────────────────────────────────┐
│                     All labelled data                    │
├────────────────────────────────┬────────────┬───────────┤
│        Training set (70%)       │ Validation │   Test    │
│   model learns parameters here  │   (15%)    │  (15%)    │
│                                 │ tune hyper-│ final,    │
│                                 │ parameters,│ touch ONCE│
│                                 │ pick model │           │
└────────────────────────────────┴────────────┴───────────┘
```

- **Training set:** the model learns its parameters from this.
- **Validation set** (or **dev set**): used to compare models and tune hyperparameters. "Is depth 5 or depth 10 better?"
- **Test set:** used **once, at the very end**, to estimate real-world performance. If you keep checking the test set and tweaking, you indirectly fit to it, and the number becomes optimistic.

**Analogy:** training set = textbook exercises; validation set = practice exams (you can take several and adjust how you study); test set = the real final exam (taken once).

Common ratios: 70/15/15, 80/10/10; with huge data (millions), 98/1/1 is fine.

```python
from sklearn.model_selection import train_test_split

X_train, X_temp, y_train, y_temp = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y)
X_val, X_test, y_val, y_test = train_test_split(
    X_temp, y_temp, test_size=0.5, random_state=42, stratify=y_temp)
```

### Splitting correctly (avoid leakage, [file 10](10-data-science-workflow.md#13-data-leakage-preview))

| Situation | How to split |
|---|---|
| Normal data | Random split |
| Imbalanced classes | **Stratified** split (`stratify=y`): keeps the same class ratio in each part ([file 07](07-math-probability-statistics.md#16-sampling-lln-clt)) |
| Several rows per customer/patient | **Group** split: all rows of one customer go to the same side (`GroupShuffleSplit`) |
| Time series | **Time-based** split: train on the past, validate/test on the future |
| Duplicates | Remove before splitting |

The test set should look like the **real data the model will face** after deployment.

---

## 11. Underfitting and overfitting

Imagine fitting curves to noisy points:

```
UNDERFITTING            GOOD FIT               OVERFITTING
(too simple)            (just right)           (too complex)

  •    •                  •    •                 •    •
 ───────────  •         ╭──────╮  •            ╭╮•  ╭╮•╭╮
•    •   •            •╯  •    ╰─╮•          •╯ ╰╮╭╯╰╯ ╰╮
         •                       ╰•                ╰╯     ╰•
straight line misses   smooth curve follows     wiggly curve hits every
the curve              the trend                point, including noise
```

| | Underfitting | Good fit | Overfitting |
|---|---|---|---|
| Training error | **high** | low | **very low** |
| Validation error | **high** | low | **high** |
| Problem | model too simple | | model memorised noise |
| Analogy | student didn't study | understood | memorised answers |

### Reading loss curves ([file 09](09-data-visualization.md#13-charts-youll-see-in-ml))

```
loss                                    loss
 │╲                                      │╲
 │ ╲___ validation                       │ ╲         ___/ validation (rising!)
 │ ╲   ‾‾‾‾‾‾‾‾‾‾‾                      │  ╲___ __/
 │  ╲___                                 │   ╲  ‾‾
 │      ‾‾‾‾‾‾‾‾ training                │    ╲_____ training (still falling)
 └────────────────► epochs               └──────┬────────► epochs
   healthy: both fall, small gap                 └ overfitting starts here
```

**The gap** between validation and training error is the sign of overfitting.

### Fixes

| Underfitting | Overfitting |
|---|---|
| Use a more complex model | Get **more training data** (most reliable fix) |
| Add better features | Use a simpler model / fewer features |
| Train longer | **Regularisation** (section 13) |
| Reduce regularisation | **Early stopping** |
| | Data augmentation (file 16) |
| | Dropout (neural networks, file 15) |
| | Ensembles (file 12) |

---

## 12. Bias-variance trade-off

A model's error on new data comes from three sources:

```
Total error = Bias² + Variance + Irreducible noise
```

- **Bias:** error from **wrong assumptions**; the model is too simple to capture the pattern. High bias → underfitting. (This "bias" is different from the bias term b and from social bias in file 29.)
- **Variance:** error from **being too sensitive** to the particular training data; train it on a slightly different sample and you get a very different model. High variance → overfitting.
- **Irreducible noise:** randomness in the data itself; nothing can fix it.

**Darts analogy:**
```
Low bias, low variance   High bias, low variance   Low bias, high variance   High bias, high variance
     ┌───────┐                ┌───────┐                ┌───────┐               ┌───────┐
     │  ◎    │                │ ◎     │                │•  ◎  •│               │• ◎    │
     │  ••   │                │    •• │                │  •   •│               │     • │
     │  ••   │                │    •• │                │•    • │               │  •   •│
     └───────┘                └───────┘                └───────┘               └───────┘
   tight & on target         tight but off target    centred but scattered      scattered & off
```

**The trade-off:** making a model more complex lowers bias but raises variance. The sweet spot is in between.

```
error
 │╲                            ╱  total error
 │ ╲  bias²                  ╱
 │  ╲                     ╱
 │   ╲___       ___----‾‾ variance
 │       ‾‾‾╳‾‾
 │    ___--‾ ‾‾‾───___
 └─────────┬──────────────► model complexity
        sweet spot
```

**Modern twist (double descent):** very large neural networks can go past the "overfitting" zone and generalise well again. That's part of why giant LLMs work. For classic ML, the trade-off picture holds.

---

## 13. Regularisation

**Idea:** add a **penalty** to the loss that discourages overly complex models (usually: large weights). The model must balance fitting the data with staying simple.

```
total loss = data loss (e.g. MSE) + λ × penalty
```

**λ** (lambda) = **regularisation strength**, a hyperparameter. λ = 0 means no regularisation; huge λ means weights are squashed toward zero (underfitting).

### L2 regularisation (Ridge, weight decay)

```
penalty = Σ wᵢ²        (sum of squared weights, the squared L2 norm, file 05)
```
- Shrinks all weights toward zero smoothly; rarely makes them exactly zero.
- Spreads importance across correlated features.
- In neural networks it's called **weight decay**.
- Linear regression + L2 = **Ridge regression**.

### L1 regularisation (Lasso)

```
penalty = Σ |wᵢ|       (L1 norm)
```
- Pushes many weights to **exactly zero**, so it performs automatic **feature selection** ([file 10](10-data-science-workflow.md#12-feature-selection)).
- Produces **sparse** models (most weights zero).
- Linear regression + L1 = **Lasso regression**.

### Elastic Net

A mix of L1 and L2.

**Why does L1 produce zeros and L2 doesn't?** L2's push on a weight gets weaker as the weight gets small (the slope of w² near 0 is ~0), so weights get small but stop short of zero. L1's push is constant (slope of |w| is always ±1), so it keeps pushing until the weight hits exactly zero.

**Statistical view:** L2 = MAP with a Gaussian prior; L1 = MAP with a Laplace prior ([file 07](07-math-probability-statistics.md#21-maximum-likelihood-and-map)). Regularisation means "I believe, before seeing data, that weights should be small."

**Worked example:** weights w = [3, −1, 0.5], data loss = 10, λ = 0.1
- L2: penalty = 9 + 1 + 0.25 = 10.25 → total = 10 + 1.025 = **11.025**
- L1: penalty = 3 + 1 + 0.5 = 4.5 → total = 10 + 0.45 = **10.45**

```python
from sklearn.linear_model import Ridge, Lasso, ElasticNet
Ridge(alpha=1.0)        # sklearn calls λ "alpha" here
Lasso(alpha=0.1)
ElasticNet(alpha=0.1, l1_ratio=0.5)
```

⚠️ **Scale features first** (file 10): the penalty treats all weights equally, so features must be on comparable scales.

### Other regularisation techniques

- **Early stopping:** stop training when validation loss stops improving (before overfitting starts). Simple and very effective.
- **Dropout** (neural networks, file 15): randomly switch off neurons during training.
- **Data augmentation** (file 16): create modified copies of training examples.
- **Simpler model / fewer features / pruning trees** (file 12).

---

## 14. Cross-validation

**Problem:** with one validation split, your score depends on which examples happened to land in it (luck). With small data, you also "waste" data on validation.

**K-fold cross-validation:** split the training data into K equal parts ("folds"). Train K times, each time holding out a different fold for validation. Average the K scores.

```
5-fold CV:
Round 1: [VAL ][train][train][train][train]  → score 0.82
Round 2: [train][VAL ][train][train][train]  → score 0.85
Round 3: [train][train][VAL ][train][train]  → score 0.80
Round 4: [train][train][train][VAL ][train]  → score 0.84
Round 5: [train][train][train][train][VAL ]  → score 0.83
                                    mean = 0.828, std = 0.018
```

✅ Every example is used for validation exactly once; more reliable estimate; the std tells you how stable the model is.
❌ K times slower.

```python
from sklearn.model_selection import cross_val_score
from sklearn.linear_model import LogisticRegression
scores = cross_val_score(LogisticRegression(max_iter=1000), X_train, y_train, cv=5, scoring="accuracy")
print(scores.mean(), scores.std())
```

**Variants:**
- **Stratified K-fold:** keeps class proportions in each fold (default for classifiers in sklearn).
- **Group K-fold:** keeps each group (customer) in one fold.
- **Time series split:** folds move forward in time; always train on the past.
- **Leave-one-out (LOOCV):** K = n; for tiny datasets.
- **Nested CV:** an outer loop to estimate performance, an inner loop to tune hyperparameters, for an unbiased estimate when tuning.

You still keep a separate **test set** for the final check.

---

## 15. Baselines

**Before building a fancy model, build a dumb one.** A **baseline** tells you what "good" means.

| Task | Simple baseline |
|---|---|
| Classification | Always predict the most common class |
| Regression | Always predict the mean (or median) |
| Time series | Predict yesterday's value ("naive forecast"), or the same day last week |
| Any | A simple model: logistic/linear regression, a small decision tree |

**Example:** 95% of transactions are legit. A "model" that always says "legit" gets **95% accuracy**. If your fancy model gets 94%, it's worse than doing nothing! (This is why accuracy is misleading for imbalanced data; see file 13.)

```python
from sklearn.dummy import DummyClassifier, DummyRegressor
DummyClassifier(strategy="most_frequent").fit(X_train, y_train).score(X_test, y_test)
```

---

## 16. scikit-learn

**scikit-learn** (`sklearn`) is the standard Python library for classic ML. Every model has the same simple interface:

```python
from sklearn.linear_model import LogisticRegression

model = LogisticRegression()          # 1. create (choose hyperparameters here)
model.fit(X_train, y_train)           # 2. train (learn parameters)
y_pred = model.predict(X_test)        # 3. predict classes
y_prob = model.predict_proba(X_test)  # 3b. predict probabilities (classifiers)
model.score(X_test, y_test)           # 4. quick evaluation (accuracy or R²)
```

Preprocessing tools have `fit` / `transform` ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)). Learned parameters end with an underscore: `model.coef_`, `model.intercept_`, `scaler.mean_`.

### Complete example

```python
from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

X, y = load_breast_cancer(return_X_y=True)    # 569 tumours, 30 features, benign/malignant
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2,
                                                    random_state=42, stratify=y)
scaler = StandardScaler().fit(X_train)        # fit on train only!
model = LogisticRegression(max_iter=1000)
model.fit(scaler.transform(X_train), y_train)
pred = model.predict(scaler.transform(X_test))
print(accuracy_score(y_test, pred))           # ≈ 0.98
```

---

## 17. Pipelines

Manually remembering to fit preprocessing on train only is error-prone. A **Pipeline** chains preprocessing and model into one object, so that `fit` fits everything on training data and `predict` applies the same steps to new data. This prevents leakage automatically, even inside cross-validation.

```python
import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.impute import SimpleImputer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score

numeric = ["age", "income", "tenure"]
categorical = ["city", "plan"]

preprocess = ColumnTransformer([
    ("num", Pipeline([
        ("impute", SimpleImputer(strategy="median")),
        ("scale", StandardScaler()),
    ]), numeric),
    ("cat", Pipeline([
        ("impute", SimpleImputer(strategy="most_frequent")),
        ("onehot", OneHotEncoder(handle_unknown="ignore")),
    ]), categorical),
])

clf = Pipeline([
    ("prep", preprocess),
    ("model", LogisticRegression(max_iter=1000)),
])

scores = cross_val_score(clf, X_train, y_train, cv=5)   # no leakage, even in CV
clf.fit(X_train, y_train)
clf.predict(X_test)
```

- **ColumnTransformer:** applies different preprocessing to different columns.
- The whole pipeline can be saved as one file and deployed (file 28).

---

## 18. The full ML project recipe

1. **Frame the problem:** what to predict, how it'll be used, which metric matters ([file 10](10-data-science-workflow.md#2-ask-a-good-question)).
2. **Get and clean data**, then do EDA (file 10).
3. **Split** into train / validation / test (or train + CV + test). Correct split type!
4. **Baseline:** dummy model + simple model.
5. **Build a pipeline:** preprocessing + model.
6. **Try a few model families** (file 12) with cross-validation.
7. **Tune hyperparameters** of the best ones (file 13).
8. **Error analysis:** look at the examples it gets wrong. Patterns? Missing features? Label errors?
9. **Final evaluation** on the test set, once (file 13).
10. **Explain** the model (feature importance, SHAP; file 14) and communicate results.
11. **Deploy and monitor** (file 28).

---

## 19. No free lunch

**No Free Lunch theorem:** no single algorithm is best for every problem. You must try options and compare on validation data.

**Practical rules of thumb:**

| Data type | Usually strong |
|---|---|
| Tabular (spreadsheet) data | **Gradient-boosted trees** (XGBoost, LightGBM, CatBoost), random forests (file 12) |
| Images | Convolutional neural networks, vision transformers (file 16) |
| Text | Transformers / LLMs (files 18 to 20) |
| Audio, video | Deep learning |
| Small data, need explainability | Linear/logistic regression, small trees |

**Occam's razor:** if two models perform similarly, prefer the simpler one (easier to explain, faster, less likely to break).

---

## 20. Check yourself

**Q1.** Classify each as regression, binary, multi-class, or multi-label classification: (a) predict tomorrow's rainfall in mm, (b) is a tumour malignant? (c) which of 10 digits is in an image? (d) tag a news article with all relevant topics.
<details><summary>Answer</summary>(a) regression, (b) binary, (c) multi-class, (d) multi-label.</details>

**Q2.** How is an LLM's pretraining "self-supervised"?
<details><summary>Answer</summary>The labels (the next word) come from the text itself, so no human labelling is needed.</details>

**Q3.** Name two parameters and two hyperparameters of a neural network.
<details><summary>Answer</summary>Parameters: weights, biases. Hyperparameters: learning rate, batch size, number of layers, number of epochs, dropout rate.</details>

**Q4.** 50,000 training examples, batch size 250. How many steps per epoch? In 10 epochs?
<details><summary>Answer</summary>200 steps/epoch; 2,000 steps.</details>

**Q5.** Training accuracy 99%, validation accuracy 70%. Problem and two fixes?
<details><summary>Answer</summary>Overfitting (high variance). Fixes: more data, regularisation, simpler model, early stopping, dropout, augmentation.</details>

**Q6.** Training accuracy 60%, validation accuracy 59% on a task where humans get 95%. Problem?
<details><summary>Answer</summary>Underfitting (high bias). Use a more complex model, better features, train longer, less regularisation.</details>

**Q7.** Which regularisation can set weights exactly to zero and why is that useful?
<details><summary>Answer</summary>L1 (Lasso). It performs automatic feature selection, giving simpler, more interpretable models.</details>

**Q8.** Why should you only use the test set once?
<details><summary>Answer</summary>Repeatedly tuning based on test results makes you indirectly fit the test set, so its score no longer reflects truly unseen data.</details>

**Q9.** You're predicting next week's sales. Is a random 80/20 split OK?
<details><summary>Answer</summary>No. Use a time-based split (train on earlier dates, test on later dates); random splits leak future information.</details>

**Q10.** 98% of emails are not spam. Your model has 97% accuracy. Good?
<details><summary>Answer</summary>No: always predicting "not spam" gives 98%. Compare to a baseline and use precision/recall (file 13).</details>

---

## 21. New words in this file

| Word | Meaning |
|---|---|
| Task, experience, performance (T, E, P) | Mitchell's definition of learning |
| Supervised / unsupervised / semi-supervised / self-supervised learning | Labels / no labels / few labels / labels from the data itself |
| Reinforcement learning, agent, environment, action, reward, policy | Learning by trial and error with rewards |
| Online vs batch learning | Continuous updates vs one-time training |
| Instance-based vs model-based | Compare to stored examples vs learn parameters |
| Regression / classification | Predict a number / a category |
| Binary, multi-class, multi-label | 2 classes / one of many / several at once |
| Hypothesis (model family) | The type of function being fitted |
| Parameters vs hyperparameters | Learned numbers vs chosen settings |
| Loss / cost / objective function | Number measuring how wrong the model is |
| MSE, MAE, Huber loss | Regression losses |
| Cross-entropy / log loss, hinge loss | Classification losses |
| Optimiser | Algorithm that updates parameters (e.g. gradient descent) |
| Batch / stochastic / mini-batch gradient descent | Gradient from all / one / a few examples |
| Batch size, step/iteration, epoch | Examples per update / one update / one pass through data |
| Shuffle | Randomise order each epoch |
| Generalisation | Doing well on unseen data |
| Training / validation (dev) / test set | Learn / tune / final check |
| Stratified, group, time-based split | Splits that keep class ratio / groups together / time order |
| Underfitting / overfitting | Too simple / memorised noise |
| Loss curve, generalisation gap | Loss over epochs / validation minus training error |
| Bias / variance / irreducible noise | Error from wrong assumptions / sensitivity to data / randomness |
| Bias-variance trade-off | More complexity: less bias, more variance |
| Double descent | Very large models generalising well again |
| Regularisation, λ (strength) | Penalty against complexity |
| L2 / Ridge / weight decay | Penalty on squared weights |
| L1 / Lasso, sparse model | Penalty on absolute weights; many exact zeros |
| Elastic Net | L1 + L2 |
| Early stopping | Stop when validation stops improving |
| Cross-validation, K-fold, fold | Rotate the validation part K times |
| Stratified / group / time-series K-fold, LOOCV, nested CV | CV variants |
| Baseline, DummyClassifier | Simple reference model |
| scikit-learn, `fit`, `predict`, `predict_proba`, `score`, `coef_` | Standard ML library and its API |
| Pipeline, ColumnTransformer | Chained preprocessing+model / per-column preprocessing |
| Error analysis | Studying the model's mistakes |
| No Free Lunch theorem | No algorithm is best for all problems |
| Occam's razor | Prefer the simpler of equally good models |

**Next:** [12-supervised-learning-algorithms.md](12-supervised-learning-algorithms.md)
