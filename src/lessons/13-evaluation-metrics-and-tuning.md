# 13: Evaluation Metrics, Hyperparameter Tuning, and Imbalanced Data

> **Before you start:** [07](07-math-probability-statistics.md) (Bayes, base rate fallacy, confidence intervals, A/B tests, cross-entropy), [09](09-data-visualization.md) (heatmaps, line charts), [11](11-ml-fundamentals.md) (train/val/test, cross-validation, baselines, hyperparameters, overfitting), [12](12-supervised-learning-algorithms.md) (classifiers, thresholds, predict_proba).
>
> **After this file you can:** choose and compute the right metric for any classification or regression problem (confusion matrix, precision, recall, F1, ROC-AUC, PR-AUC, MAE, RMSE, R²), pick decision thresholds, tune hyperparameters properly, and handle imbalanced datasets.

---

## Table of contents

**Classification metrics**
1. [Why accuracy isn't enough](#1-why-accuracy-isnt-enough)
2. [The confusion matrix](#2-the-confusion-matrix)
3. [Precision and recall](#3-precision-and-recall)
4. [F1 score and F-beta](#4-f1-score-and-f-beta)
5. [Specificity, false positive rate, and friends](#5-specificity-and-friends)
6. [Thresholds and the precision-recall trade-off](#6-thresholds-and-the-trade-off)
7. [ROC curve and ROC-AUC](#7-roc-curve-and-roc-auc)
8. [Precision-Recall curve and PR-AUC](#8-precision-recall-curve-and-pr-auc)
9. [Log loss and calibration](#9-log-loss-and-calibration)
10. [Multi-class metrics: macro, micro, weighted](#10-multi-class-metrics)

**Regression metrics**
11. [MAE, MSE, RMSE, MAPE, R²](#11-regression-metrics)

**Tuning and diagnosis**
12. [Hyperparameter tuning: grid, random, Bayesian](#12-hyperparameter-tuning)
13. [Learning curves and validation curves](#13-learning-curves-and-validation-curves)
14. [Imbalanced data](#14-imbalanced-data)
15. [Choosing the metric from the business problem](#15-choosing-the-metric)
16. [Check yourself](#16-check-yourself)
17. [New words in this file](#17-new-words-in-this-file)

---

## 1. Why accuracy isn't enough

**Accuracy** = correct predictions ÷ all predictions.

**Example:** 1,000 transactions, 10 are fraud. A "model" that always says "not fraud":
- Correct on 990 → **99% accuracy**
- Catches **zero** frauds → useless

When classes are **imbalanced**, accuracy hides failure. We need metrics that look at each kind of mistake separately.

---

## 2. The confusion matrix

A table of **actual** vs **predicted** classes. For binary problems, the "positive" class is the thing you're looking for (fraud, disease, spam, churn), even if it's "bad".

```
                     PREDICTED
                 Positive    Negative
           ┌────────────┬────────────┐
ACTUAL Pos │    TP      │    FN      │
           │ true pos.  │ false neg. │ ← missed!
           ├────────────┼────────────┤
       Neg │    FP      │    TN      │
           │ false pos. │ true neg.  │
           │ false alarm│            │
           └────────────┴────────────┘
```

- **TP (True Positive):** predicted positive, actually positive ✅ (caught the fraud)
- **TN (True Negative):** predicted negative, actually negative ✅
- **FP (False Positive):** predicted positive, actually negative ❌ (false alarm, **Type I error**, [file 07](07-math-probability-statistics.md#18-hypothesis-testing-and-p-values))
- **FN (False Negative):** predicted negative, actually positive ❌ (missed it, **Type II error**)

**Memory trick:** the second word is what the model **predicted**; the first word says whether that was **right** (True) or **wrong** (False).

### Running example (used throughout this file)

A disease-screening model tested on 1,000 people; 100 actually have the disease.

| | Predicted sick | Predicted healthy |
|---|---|---|
| **Actually sick (100)** | TP = **80** | FN = **20** |
| **Actually healthy (900)** | FP = **60** | TN = **840** |

Accuracy = (80 + 840) / 1000 = **92%**

```python
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
cm = confusion_matrix(y_true, y_pred)        # rows = actual, columns = predicted
ConfusionMatrixDisplay(cm).plot()            # heatmap (file 09)
```

⚠️ scikit-learn orders classes as [0, 1], so its matrix is `[[TN, FP], [FN, TP]]`, the opposite corner from the textbook picture above. Always check the labels.

---

## 3. Precision and recall

### Precision: "when the model says positive, how often is it right?"

```
Precision = TP / (TP + FP)
```

Running example: 80 / (80 + 60) = **0.571** → only 57% of people flagged as sick actually are.

**Care about precision when false positives are costly:**
- Spam filter: a real email hidden in spam is bad
- Recommending a product: irrelevant recommendations annoy users
- Expensive follow-up action (sending a technician, freezing an account)

### Recall (sensitivity, true positive rate): "of all actual positives, how many did we catch?"

```
Recall = TP / (TP + FN)
```

Running example: 80 / (80 + 20) = **0.80** → caught 80% of sick people.

**Care about recall when false negatives are costly:**
- Cancer screening: missing a cancer is terrible
- Fraud detection: missed fraud costs money
- Safety systems (detecting harmful content)

**Analogy: fishing with a net.**
- **Recall** = what fraction of all the fish in the lake did you catch?
- **Precision** = what fraction of what's in your net is actually fish (vs boots and rubbish)?

A huge net catches all fish (high recall) but lots of rubbish (low precision). A tiny careful net catches only fish (high precision) but misses most (low recall).

---

## 4. F1 score and F-beta

### F1: one number that balances precision and recall

```
F1 = 2 × (Precision × Recall) / (Precision + Recall)
```

This is the **harmonic mean**: it's high only if **both** are high. If either is low, F1 is low.

Running example: 2 × (0.571 × 0.80) / (0.571 + 0.80) = 2 × 0.457 / 1.371 = **0.667**

**Why not the normal average?** A model with precision 1.0 and recall 0.01 has average 0.505, which looks OK, but F1 = 0.0198, which correctly says it's terrible.

### F-beta: weight one more than the other

```
Fβ = (1 + β²) × P × R / (β² × P + R)
```

- **F2** (β = 2): recall counts more (medical screening)
- **F0.5** (β = 0.5): precision counts more (spam filtering)

```python
from sklearn.metrics import precision_score, recall_score, f1_score, fbeta_score, classification_report
print(classification_report(y_true, y_pred))   # precision, recall, F1 per class in one table
```

---

## 5. Specificity and friends

| Metric | Formula | Running example | Meaning |
|---|---|---|---|
| **Recall / Sensitivity / TPR** | TP / (TP + FN) | 80/100 = 0.80 | Share of positives caught |
| **Specificity / TNR** | TN / (TN + FP) | 840/900 = 0.933 | Share of negatives correctly cleared |
| **False Positive Rate (FPR)** | FP / (FP + TN) = 1 − specificity | 60/900 = 0.067 | Share of negatives falsely alarmed |
| **False Negative Rate (FNR)** | FN / (FN + TP) = 1 − recall | 0.20 | Share of positives missed |
| **Precision / PPV** | TP / (TP + FP) | 0.571 | Positive predictions that are right |
| **NPV** | TN / (TN + FN) | 840/860 = 0.977 | Negative predictions that are right |

**Connection to Bayes ([file 07](07-math-probability-statistics.md#9-bayes-theorem)):** precision depends heavily on how rare positives are (the base rate). The same model (same recall and specificity) applied to a population where the disease is rarer will have much lower precision.

---

## 6. Thresholds and the trade-off

Classifiers output probabilities; the **threshold** ([file 12](12-supervised-learning-algorithms.md#4-decision-boundaries-and-thresholds)) turns them into decisions. Changing it trades precision against recall:

| Threshold | Effect | Precision | Recall |
|---|---|---|---|
| Low (0.2) | Flag almost anything suspicious | ↓ lower | ↑ higher |
| Default (0.5) | | | |
| High (0.9) | Flag only very confident cases | ↑ higher | ↓ lower |

**Worked example:** 6 patients, model probabilities and truth:

| Patient | P(sick) | Actually sick? |
|---|---|---|
| A | 0.95 | yes |
| B | 0.80 | yes |
| C | 0.65 | no |
| D | 0.40 | yes |
| E | 0.30 | no |
| F | 0.10 | no |

- **Threshold 0.5:** flag A, B, C → TP=2, FP=1, FN=1 → precision 2/3 = 0.67, recall 2/3 = 0.67
- **Threshold 0.35:** flag A, B, C, D → TP=3, FP=1, FN=0 → precision 0.75, recall **1.0**
- **Threshold 0.9:** flag A only → TP=1, FP=0, FN=2 → precision **1.0**, recall 0.33

**How to choose:** use the **validation set** (never the test set) to pick the threshold that best fits the business cost of FP vs FN. For example: "a missed fraud costs $500, a false alarm costs $5 of review time" → choose the threshold that minimises total cost.

```python
probs = model.predict_proba(X_val)[:, 1]
y_pred = (probs >= 0.35).astype(int)       # custom threshold
```

---

## 7. ROC curve and ROC-AUC

The **ROC curve** (Receiver Operating Characteristic) plots **TPR (recall)** against **FPR** for **every possible threshold**.

```
TPR (recall)
1.0 ┤      ____────────●   ← threshold 0 (flag everyone)
    │   ╱‾‾
    │  ╱    good model (bows to top-left)
0.5 ┤ ╱        ╱
    │╱      ╱    ← random guessing (diagonal)
    │    ╱
0.0 ●──────────────────── FPR
   0.0  ↑   0.5         1.0
   threshold 1 (flag no one)
```

- Perfect model: straight up to (0, 1) then across: TPR = 1 with FPR = 0
- Random guessing: the diagonal line

**ROC-AUC** = the **area under the ROC curve** (an integral, [file 06](06-math-calculus.md#15-integrals-just-the-idea)):
- 1.0 = perfect
- 0.5 = random guessing
- < 0.5 = worse than random (your labels are probably flipped)

**Intuitive meaning:** AUC = the probability that the model gives a **randomly chosen positive** a **higher score** than a **randomly chosen negative**. AUC = 0.85 means: pick one sick and one healthy person at random; 85% of the time the model rates the sick person as more likely sick.

**Worked check with the 6 patients above:** positives scored {0.95, 0.80, 0.40}, negatives {0.65, 0.30, 0.10}. Compare all 3 × 3 = 9 pairs: the positive wins in 8 (only 0.40 < 0.65 loses). AUC = 8/9 ≈ **0.89**.

**Pros:** threshold-independent; measures how well the model *ranks* cases.
**Cons:** can look too optimistic on **highly imbalanced** data, because FPR's denominator (all negatives) is huge, so many false positives still give a small FPR.

```python
from sklearn.metrics import roc_auc_score, RocCurveDisplay
roc_auc_score(y_true, probs)               # use probabilities, not 0/1 predictions!
RocCurveDisplay.from_predictions(y_true, probs)
```

---

## 8. Precision-Recall curve and PR-AUC

The **PR curve** plots **precision** vs **recall** for every threshold.

```
Precision
1.0 ┤●──‾‾‾╲
    │       ╲___
    │           ╲___     good model: stays high
0.5 ┤               ╲
    │- - - - - - - - -╲- - ← baseline = positive rate (e.g. 0.01 for 1% fraud)
0.0 └──────────────────── Recall
   0.0                1.0
```

**PR-AUC** (also called **average precision, AP**) = area under it. The baseline for a random model equals the **fraction of positives** (e.g. 0.01 if 1% are fraud), not 0.5.

**Use PR-AUC instead of ROC-AUC when positives are rare and you care about them** (fraud, rare disease, defect detection, search results). It focuses only on how well you find and trust positives.

```python
from sklearn.metrics import average_precision_score, PrecisionRecallDisplay
average_precision_score(y_true, probs)
```

---

## 9. Log loss and calibration

### Log loss

**Log loss** = cross-entropy ([file 07](07-math-probability-statistics.md#23-cross-entropy)) as an evaluation metric. It rewards **confident correct** probabilities and heavily punishes **confident wrong** ones. Lower is better. Use when the **probability values themselves** matter (e.g. pricing insurance from risk probabilities).

```python
from sklearn.metrics import log_loss
log_loss(y_true, probs)
```

### Calibration

A model is **well-calibrated** if its probabilities match reality: among all cases it gives 70%, about 70% should actually be positive.

**Reliability diagram (calibration curve):** bin predictions by probability and plot predicted vs actual frequency. A perfectly calibrated model lies on the diagonal.

Some models are badly calibrated: Naive Bayes (overconfident), SVMs and boosted trees (often distorted). Logistic regression is usually well calibrated.

**Fixes:** **Platt scaling** (fit a small logistic regression on the scores) or **isotonic regression**, applied using validation data. In deep learning, **temperature scaling** (dividing logits by a learned T, [file 07](07-math-probability-statistics.md#13-softmax)) is common.

**Brier score:** mean squared error between probabilities and 0/1 outcomes. Lower is better; it measures calibration and accuracy together.

**ECE (Expected Calibration Error):** the average gap between confidence and accuracy across bins. Used for neural networks and LLMs (file 26).

```python
from sklearn.calibration import CalibratedClassifierCV, CalibrationDisplay
calibrated = CalibratedClassifierCV(model, method="isotonic", cv=5).fit(X_train, y_train)
```

---

## 10. Multi-class metrics

With K classes, the confusion matrix is K × K (rows = actual, columns = predicted; the diagonal = correct). Precision/recall/F1 are computed **per class** (treating that class as "positive" and all others as "negative"), then combined:

| Averaging | How | When |
|---|---|---|
| **Macro** | Simple average over classes (each class counts equally) | Care about rare classes as much as common ones |
| **Weighted** | Average weighted by each class's number of examples | Reflect overall performance with imbalance |
| **Micro** | Pool all TP, FP, FN across classes, then compute | Equals accuracy for single-label multi-class |

**Worked example:** 3 classes with per-class F1 and counts:

| Class | F1 | Count |
|---|---|---|
| cat | 0.90 | 800 |
| dog | 0.80 | 150 |
| bird | 0.30 | 50 |

- Macro F1 = (0.90 + 0.80 + 0.30)/3 = **0.667** (exposes the bad bird performance)
- Weighted F1 = (0.90×800 + 0.80×150 + 0.30×50)/1000 = (720 + 120 + 15)/1000 = **0.855** (looks good)

**Top-k accuracy:** correct if the true class is among the model's top k guesses. Common for image classification with many classes (top-5 accuracy).

---

## 11. Regression metrics

Running example: true y = [100, 150, 200, 250], predicted ŷ = [110, 140, 210, 300]
Errors (ŷ − y): +10, −10, +10, +50

| Metric | Formula | Example | Notes |
|---|---|---|---|
| **MAE** (Mean Absolute Error) | mean of \|y − ŷ\| | (10+10+10+50)/4 = **20** | Same units as y; robust; "average miss" |
| **MSE** (Mean Squared Error) | mean of (y − ŷ)² | (100+100+100+2500)/4 = **700** | Units squared; punishes big errors |
| **RMSE** (Root MSE) | √MSE | √700 ≈ **26.5** | Same units as y; punishes big errors more than MAE |
| **MAPE** (Mean Absolute % Error) | mean of \|y − ŷ\|/\|y\| × 100 | (10% + 6.7% + 5% + 20%)/4 ≈ **10.4%** | Easy to explain; breaks when y is near 0 |
| **R²** (coefficient of determination) | 1 − SS_res/SS_tot | see below | Share of variance explained |

**RMSE vs MAE:** RMSE ≥ MAE always. A big gap (26.5 vs 20 here) means a few large errors (the +50). Use MAE when all errors matter equally; RMSE when big errors are especially bad.

### R² explained

```
R² = 1 − (sum of squared errors of the model) / (sum of squared errors of predicting the mean)
```

- Mean of y = 175. SS_tot = (75² + 25² + 25² + 75²) = 5625 + 625 + 625 + 5625 = 12,500
- SS_res = 2,800 (sum of squared errors from the table)
- R² = 1 − 2800/12500 = **0.776**: the model explains ~78% of the variation in y.

- R² = 1: perfect
- R² = 0: no better than always predicting the mean (the baseline)
- R² < 0: worse than the mean!

**Adjusted R²** penalises adding useless features (normal R² never decreases when you add features).

```python
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
mae = mean_absolute_error(y, y_hat)
rmse = mean_squared_error(y, y_hat) ** 0.5
r2 = r2_score(y, y_hat)
```

**Always look at a residual plot too** ([file 12](12-supervised-learning-algorithms.md#1-linear-regression)): patterns in errors reveal problems the numbers hide.

---

## 12. Hyperparameter tuning

**Goal:** find the hyperparameters ([file 11](11-ml-fundamentals.md#5-parameters-vs-hyperparameters)) that give the best **validation** performance.

### Grid search

Try **every combination** of listed values.

```python
from sklearn.model_selection import GridSearchCV
param_grid = {
    "n_estimators": [100, 300],
    "max_depth": [5, 10, None],
    "min_samples_leaf": [1, 5],
}   # 2 × 3 × 2 = 12 combinations × 5 folds = 60 fits
search = GridSearchCV(RandomForestClassifier(random_state=0), param_grid,
                      cv=5, scoring="f1", n_jobs=-1)
search.fit(X_train, y_train)
print(search.best_params_, search.best_score_)
best_model = search.best_estimator_
```

✅ Thorough. ❌ Explodes with many hyperparameters (5 params × 5 values = 3,125 combinations).

### Random search

Try **random combinations** from ranges/distributions for a fixed budget.

```python
from sklearn.model_selection import RandomizedSearchCV
from scipy.stats import randint, uniform
dist = {"n_estimators": randint(100, 1000),
        "max_depth": randint(3, 20),
        "max_features": uniform(0.1, 0.9)}
search = RandomizedSearchCV(RandomForestClassifier(), dist, n_iter=40, cv=5, scoring="f1")
```

✅ Usually finds good settings **faster** than grid search, because typically only a few hyperparameters really matter, and random search tries more distinct values of each.

### Bayesian optimisation

Use results so far to **guess where good settings are**, and try those next. Smarter than random. Libraries: **Optuna** (very popular), Hyperopt, scikit-optimize. Optuna uses a method called **TPE (Tree-structured Parzen Estimator)** by default.

```python
import optuna
from sklearn.model_selection import cross_val_score

def objective(trial):
    params = {
        "n_estimators": trial.suggest_int("n_estimators", 100, 1000),
        "max_depth": trial.suggest_int("max_depth", 3, 12),
        "learning_rate": trial.suggest_float("learning_rate", 1e-3, 0.3, log=True),
    }
    model = xgb.XGBClassifier(**params)
    return cross_val_score(model, X_train, y_train, cv=3, scoring="roc_auc").mean()

study = optuna.create_study(direction="maximize")
study.optimize(objective, n_trials=50)
print(study.best_params)
```

**Note `log=True`** for the learning rate: values like 0.001, 0.01, 0.1 differ by factors of 10, so search on a **log scale**.

### Other methods (for deep learning)

- **Successive halving / Hyperband / ASHA:** start many configurations with a small budget (few epochs), keep only the best half, give them more budget, repeat. Kills bad runs early.
- **Population-Based Training (PBT):** evolve hyperparameters during training.

### Tuning rules

1. Tune on **validation/CV**, never the test set.
2. Tune the **most important** hyperparameters first (learning rate, model size/depth, regularisation).
3. Use **log scales** for learning rates and regularisation strengths.
4. **Don't over-tune:** gains from tuning are often smaller than gains from better data/features.
5. For unbiased final numbers with heavy tuning, use **nested CV** ([file 11](11-ml-fundamentals.md#14-cross-validation)) or a fresh test set.

---

## 13. Learning curves and validation curves

### Learning curve: performance vs training set size

```
score
 │       ___________ training
 │  ____/
 │ /       _________ validation
 │/   ____/
 │___/
 └──────────────────► training set size
```

- Both curves converge at a **low** score → **high bias** (underfitting). More data won't help; use a more complex model / better features.
- Big gap between them that **narrows** as data grows → **high variance** (overfitting). **More data will help.**

### Validation curve: performance vs one hyperparameter

Plot train and validation scores against, e.g., `max_depth`. Training score keeps rising; validation score rises then falls. The peak is the best value. This is the bias-variance picture ([file 11](11-ml-fundamentals.md#12-bias-variance-trade-off)) drawn from real data.

```python
from sklearn.model_selection import learning_curve, validation_curve
sizes, train_scores, val_scores = learning_curve(model, X, y, cv=5,
                                                 train_sizes=[0.1, 0.3, 0.5, 0.7, 1.0])
```

---

## 14. Imbalanced data

**Imbalanced data:** one class is much rarer (fraud 0.1%, disease 2%, churn 10%).

**Problems:** models learn to predict the majority class; accuracy is misleading; few positive examples to learn from.

### Step 1: Use the right metrics

Precision, recall, F1, **PR-AUC**, confusion matrix. Not accuracy.

### Step 2: Stratified splits

`stratify=y` and `StratifiedKFold` ([file 11](11-ml-fundamentals.md#10-train-validation-test-splits)) so every split has some positives.

### Step 3: Choose techniques

| Technique | How | Notes |
|---|---|---|
| **Threshold tuning** | Lower the threshold (section 6) | Simple and often the most effective. Try first. |
| **Class weights** | Make mistakes on the rare class cost more in the loss | `class_weight="balanced"` in sklearn; `scale_pos_weight` in XGBoost |
| **Random oversampling** | Duplicate rare-class examples | Risk of overfitting to duplicates |
| **Random undersampling** | Drop majority examples | Loses information; fast |
| **SMOTE** | Create **synthetic** rare examples by interpolating between neighbours | Popular; works for numeric features |
| **Collect more rare examples** | | Best if possible |
| **Anomaly detection** | Treat the rare class as anomalies (file 14) | When positives are extremely rare |

**SMOTE** (Synthetic Minority Over-sampling Technique): pick a rare example, pick one of its k nearest rare neighbours, create a new point somewhere on the line between them.

```python
from sklearn.linear_model import LogisticRegression
LogisticRegression(class_weight="balanced")   # weight ∝ 1 / class frequency

from imblearn.over_sampling import SMOTE
from imblearn.pipeline import Pipeline as ImbPipeline   # resampling-aware pipeline
pipe = ImbPipeline([("scale", StandardScaler()),
                    ("smote", SMOTE(random_state=0)),
                    ("model", LogisticRegression(max_iter=1000))])
```

⚠️ **Only resample the training data**, never the validation/test data, which must reflect reality. Using a resampling-aware pipeline inside cross-validation does this correctly.

⚠️ Resampling and class weights distort predicted probabilities. Recalibrate (section 9) if you need true probabilities.

---

## 15. Choosing the metric

Start from **what a mistake costs the business**:

| Problem | Costly mistake | Primary metric |
|---|---|---|
| Cancer screening | Missing cancer (FN) | Recall / F2 (at acceptable precision) |
| Spam filter | Hiding real email (FP) | Precision / F0.5 |
| Fraud detection (rare) | Both, but rare positives | PR-AUC, recall at fixed precision, $ saved |
| Credit scoring | Ranking risk well | ROC-AUC, plus calibration (log loss/Brier) |
| Churn campaign with limited budget | Calling non-churners wastes budget | Precision@k (precision among top k scored customers) |
| House price prediction | Big misses | RMSE |
| Demand forecasting reported to managers | Interpretability | MAE or MAPE |
| Balanced multi-class | | Accuracy, macro F1 |

**Always report:** the metric, a baseline for comparison ([file 11](11-ml-fundamentals.md#15-baselines)), and the uncertainty (CV std or confidence interval, [file 07](07-math-probability-statistics.md#17-confidence-intervals)).

**Offline vs online metrics:** offline metrics (computed on test data) are proxies. The real test is the **online** business metric (e.g. revenue, retention), measured with an **A/B test** after deployment ([file 07](07-math-probability-statistics.md#20-ab-testing), file 28).

---

## 16. Check yourself

**Q1.** Confusion matrix: TP = 30, FN = 10, FP = 20, TN = 940. Compute accuracy, precision, recall, F1, specificity.
<details><summary>Answer</summary>
Accuracy = 970/1000 = 0.97. Precision = 30/50 = 0.60. Recall = 30/40 = 0.75. F1 = 2×0.6×0.75/1.35 ≈ 0.667. Specificity = 940/960 ≈ 0.979.
</details>

**Q2.** For a cancer screening test, which matters more: precision or recall? Why?
<details><summary>Answer</summary>Recall: missing a cancer (false negative) is far worse than a false alarm that leads to more tests.</details>

**Q3.** What happens to precision and recall if you raise the threshold from 0.5 to 0.8?
<details><summary>Answer</summary>Usually precision goes up and recall goes down (fewer, more confident positive predictions).</details>

**Q4.** A model has ROC-AUC = 0.5. What does that mean?
<details><summary>Answer</summary>It ranks positives and negatives no better than random guessing.</details>

**Q5.** Fraud is 0.2% of transactions. Should you report ROC-AUC or PR-AUC? Why?
<details><summary>Answer</summary>PR-AUC (with ROC-AUC as secondary). With very rare positives, ROC-AUC can look great even when most flagged cases are false alarms; PR-AUC directly reflects precision on the rare class.</details>

**Q6.** True values [10, 20, 30], predictions [12, 18, 36]. Compute MAE and RMSE.
<details><summary>Answer</summary>Errors 2, −2, 6. MAE = 10/3 ≈ 3.33. MSE = (4+4+36)/3 = 14.67 → RMSE ≈ 3.83.</details>

**Q7.** R² = −0.2 on the test set. What does it mean?
<details><summary>Answer</summary>The model is worse than simply predicting the mean of the target.</details>

**Q8.** Per-class F1 scores: 0.95 (9,000 examples), 0.40 (1,000 examples). Macro vs weighted F1?
<details><summary>Answer</summary>Macro = (0.95+0.40)/2 = 0.675. Weighted = (0.95×9000 + 0.40×1000)/10000 = 0.895.</details>

**Q9.** Why is random search often better than grid search?
<details><summary>Answer</summary>Usually only a few hyperparameters matter; random search tries many more distinct values of each for the same budget, instead of wasting trials on repeated values of unimportant ones.</details>

**Q10.** You applied SMOTE before splitting into train/test. What's wrong?
<details><summary>Answer</summary>Synthetic points made from test examples leak into training, and the test set no longer reflects real data. Resample only the training data (inside CV folds).</details>

---

## 17. New words in this file

| Word | Meaning |
|---|---|
| Accuracy | Correct ÷ total |
| Positive class | The class you're trying to detect |
| Confusion matrix, TP, TN, FP, FN | Table of actual vs predicted; its four cells |
| Precision (PPV) | TP / (TP + FP): trustworthiness of positive predictions |
| Recall (sensitivity, TPR) | TP / (TP + FN): share of positives caught |
| F1, harmonic mean, F-beta (F2, F0.5) | Balance of precision and recall / weighted versions |
| Specificity (TNR), FPR, FNR, NPV | Other confusion-matrix rates |
| Threshold tuning, cost-based threshold | Choosing the probability cut-off |
| ROC curve, ROC-AUC | TPR vs FPR across thresholds / area under it (ranking quality) |
| PR curve, PR-AUC, average precision | Precision vs recall curve / area under it |
| Log loss | Cross-entropy as a metric |
| Calibration, reliability diagram | Probabilities matching reality / chart to check it |
| Platt scaling, isotonic regression, temperature scaling | Calibration fixes |
| Brier score, ECE | Calibration-related metrics |
| Macro / micro / weighted averaging | Ways to combine per-class metrics |
| Top-k accuracy | True class among top k guesses |
| MAE, MSE, RMSE, MAPE | Regression error metrics |
| R², adjusted R², SS_res, SS_tot | Variance explained / penalised version / sums of squares |
| Grid search, random search | Try all combinations / random combinations |
| Bayesian optimisation, Optuna, TPE | Smart guided search |
| Log scale (search) | Searching values like 0.001, 0.01, 0.1 |
| Successive halving, Hyperband, ASHA, PBT | Budget-efficient tuning methods |
| Learning curve, validation curve | Score vs data size / vs a hyperparameter |
| Imbalanced data | One class much rarer |
| Class weights, `class_weight="balanced"`, `scale_pos_weight` | Higher loss for rare-class mistakes |
| Oversampling, undersampling, SMOTE | Resampling methods / synthetic rare examples |
| imbalanced-learn (`imblearn`) | Library for resampling |
| Precision@k | Precision among the top k scored items |
| Offline vs online metrics | Test-set metrics vs real business results |

**Next:** [14-unsupervised-learning-and-more.md](14-unsupervised-learning-and-more.md)
