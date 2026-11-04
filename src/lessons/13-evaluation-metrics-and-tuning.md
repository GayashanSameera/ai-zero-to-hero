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

**Why it exists:** a single score like "99% accurate" sounds wonderful, but it can hide a model that has learned nothing. We need to see which kinds of mistakes a model makes, not just how many.

**Accuracy** = correct predictions ÷ all predictions.

**Example:** 1,000 transactions, 10 are fraud. A "model" that always says "not fraud":
- Correct on 990 → **99% accuracy**
- Catches **zero** frauds → useless

When classes are **imbalanced**, accuracy hides failure. We need metrics that look at each kind of mistake separately.

### Worked example: a parcel service

A courier delivers 10,000 parcels and 50 of them (0.5%) arrive damaged. A "model" that always predicts "not damaged" is right 9,950 times:

- Accuracy = 9,950 ÷ 10,000 = **99.5%**
- Damaged parcels found = 0 out of 50, so recall = 0 ÷ 50 = **0%**

The majority-class guess is called the **baseline**. Any real model must beat it on a metric that matters, not just on accuracy.

| Class balance | Accuracy of "always say the common class" |
|---|---|
| 50% / 50% | 50% |
| 90% / 10% | 90% |
| 99.5% / 0.5% | 99.5% |

**Where you'll meet it in real work:** fraud, disease screening, equipment failure, and churn. In all of them the interesting case is rare.

**Common mistakes:**
- **Reporting only accuracy** on imbalanced data.
- **Not knowing the baseline.** Always ask "what would a model that always guesses the common class score?"

**Exam angle:** a scenario with 1% positives and a model with 99% accuracy is almost always a trick; the correct answer is that accuracy is misleading and precision, recall or PR-AUC should be used.

> **සිංහලෙන්:** Accuracy කියන්නේ හරි උත්තර ගාන ÷ මුළු ගාන. ඒත් දුර්ලභ දෙයක් හොයන්න ගියාම ඒක රවටනවා. Parcels 10,000න් 50ක් විතරක් කැඩිලා නම්, "කිසිම parcel එකක් කැඩිලා නෑ" කියන model එකට 99.5% accuracy එකක් ලැබෙනවා. ඒත් කැඩුණු 50න් එකක්වත් අල්ලගන්නේ නෑ, ඒ කියන්නේ recall 0%. ඒ නිසා හැම වෙලේම "හැමදේම majority class එක කියන baseline එකේ ලකුණ කීයද?" කියලා මුලින් බලන්න.

---

## 2. The confusion matrix

**Why it exists:** "wrong" comes in two flavours with very different costs. Telling a healthy person they are sick is not the same as telling a sick person they are healthy. The confusion matrix separates the four outcomes so we can count each one.

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

### Worked example: a spam filter on 100 emails

The model flags 50 emails as spam. Of those, 40 really are spam (TP) and 10 are not (FP). Of the 50 it let through, 5 were actually spam (FN) and 45 were fine (TN).

| | Predicted spam | Predicted not spam |
|---|---|---|
| **Actually spam (45)** | TP = 40 | FN = 5 |
| **Actually not spam (55)** | FP = 10 | TN = 45 |

- Accuracy = (40 + 45) ÷ 100 = **0.85**
- Precision = 40 ÷ (40 + 10) = **0.80**
- Recall = 40 ÷ (40 + 5) = **0.889**
- F1 = 2 × 0.80 × 0.889 ÷ (0.80 + 0.889) = **0.842**

Every metric in this lesson is a ratio of these four cells. If you can fill in the matrix you can compute anything else.

**Where you'll meet it in real work:** every classification report in a bank, hospital or telecom starts with this table, and managers read it directly as "how many did we miss, how many false alarms".

**Common mistakes:**
- **Mixing up rows and columns.** Always check whether rows are actual or predicted.
- **Forgetting that scikit-learn puts negatives first** (`[[TN, FP], [FN, TP]]`).
- **Choosing the wrong "positive" class.** Positive means "the thing we're looking for", not "good".

**Exam angle:** you may be given TP, FP, FN, TN and asked for precision or recall. Write the formula first, then plug in. Know that FP is a Type I error and FN a Type II error.

> **සිංහලෙන්:** Confusion matrix එකේ කොටු හතරක් තියෙනවා. TP කියන්නේ spam එක spam කියලා හරියට අල්ලගත්තා. FP කියන්නේ හොඳ email එකක් වැරදියට spam කිව්වා. FN කියන්නේ spam එකක් මඟ හැරුණා. TN කියන්නේ හොඳ email එක හොඳයි කියලා හරියට කිව්වා. Emails 100කින්: TP 40, FP 10, FN 5, TN 45 නම්, accuracy = 85/100 = 0.85, precision = 40/50 = 0.80, recall = 40/45 = 0.889. අනිත් හැම metric එකක්ම ගණනය කරන්නේ මේ කොටු හතරෙන්මයි.

---

## 3. Precision and recall

**Why it exists:** one number cannot describe both "how many alarms are real" and "how many real cases did we catch". Precision answers the first, recall the second.

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

### Worked example: choosing between two models

Two fraud models are tested on 100 real frauds.

| | Model A | Model B |
|---|---|---|
| Alarms raised | 30 | 400 |
| Real frauds among alarms (TP) | 27 | 90 |
| Precision = TP ÷ alarms | 27 ÷ 30 = **0.90** | 90 ÷ 400 = **0.225** |
| Recall = TP ÷ 100 | **0.27** | **0.90** |

Model A is very trustworthy but misses 73 frauds. Model B catches 90 frauds but buries the team in 310 false alarms. Neither is "better" in general. If one missed fraud costs Rs. 100,000 and checking one alarm costs Rs. 500, then B's 310 false alarms cost Rs. 155,000, but A's 73 missed frauds cost Rs. 7,300,000, so B wins.

**Airport analogy:** a baggage scanner. Recall is the share of dangerous bags it catches (it must be close to 100%). Precision is the share of beeping bags that really hold something dangerous (low precision just means extra manual checks).

**Where you'll meet it in real work:** hospital screening wants high recall; a spam filter wants high precision; a search engine cares about precision in the top few results.

**Common mistakes:**
- **Mixing up the denominators.** Precision divides by predicted positives (TP + FP); recall divides by actual positives (TP + FN).
- **Optimising only one.** Predicting positive for everyone gives recall 1.0 and terrible precision.

**Exam angle:** map the scenario to the cost. "Missing a case is dangerous" means recall; "false alarms are expensive" means precision.

> **සිංහලෙන්:** Precision කියන්නේ "alarm ගැහුවාම කොච්චර වාරයක් හරිද" කියන එක, recall කියන්නේ "ඇත්ත positives වලින් කීයක් අල්ලගත්තද" කියන එක. Fraud 100ක් තියෙද්දී Model A alarm 30ක් ගහලා 27ක් හරි: precision 0.90, recall 0.27. Model B alarm 400ක් ගහලා 90ක් හරි: precision 0.225, recall 0.90. Fraud එකක් මඟ හැරුණාම Rs. 100,000ක් නැති වෙනවා, alarm එකක් බලන්න Rs. 500යි නම් B තමයි හොඳ. Airport scanner එකටත් වැදගත්ම recall එකයි, spam filter එකට වැදගත් precision එකයි.

---

## 4. F1 score and F-beta

**Why it exists:** comparing models by looking at two numbers at once is awkward. F1 squeezes precision and recall into one number that only rises when both are good.

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

### Worked example: F1 versus the plain average

Precision 0.9 and recall 0.3:
- Plain average = (0.9 + 0.3) ÷ 2 = 0.60 (sounds acceptable)
- F1 = 2 × 0.9 × 0.3 ÷ (0.9 + 0.3) = 0.54 ÷ 1.2 = **0.45** (honest: the weak side drags it down)

### Worked example: F2 and F0.5 on the running example (P = 0.571, R = 0.80)

- F2 = 5 × P × R ÷ (4 × P + R) = 5 × 0.571 × 0.80 ÷ (4 × 0.571 + 0.80) = 2.284 ÷ 3.084 = **0.741**
- F0.5 = 1.25 × P × R ÷ (0.25 × P + R) = 1.25 × 0.571 × 0.80 ÷ (0.143 + 0.80) = 0.571 ÷ 0.943 = **0.606**

Recall is the strong side here, so F2 (which favours recall) is higher than F1 = 0.667 would suggest from the weak side, and F0.5 is lower.

**Where you'll meet it in real work:** a scoreboard for competing models, a single column in a classification report, or a quick check that a threshold change did not wreck one side.

**Common mistakes:**
- **Using F1 when the costs are clearly unequal.** Use F2 or F0.5, or look at precision and recall separately.
- **Forgetting that F1 ignores true negatives**, so it says nothing about how well the model clears healthy cases.

**Exam angle:** F1 is the harmonic mean of precision and recall; it is low when either is low; F-beta with beta above 1 favours recall.

> **සිංහලෙන්:** F1 කියන්නේ precision සහ recall දෙකම එක අංකයකට දාන එක. සාමාන්‍ය සාමාන්‍යය (average) වෙනුවට harmonic mean එක පාවිච්චි කරන්නේ දෙකෙන් එකක් අඩු නම් ලකුණත් අඩු වෙන්න ඕනේ නිසා. උදා: precision 0.9, recall 0.3 නම් සාමාන්‍යය 0.60, ඒත් F1 = 2 × 0.9 × 0.3 ÷ 1.2 = 0.45. Recall එක වැදගත් නම් F2, precision වැදගත් නම් F0.5 පාවිච්චි කරන්න. F1 එකේ true negatives ගණන් ගන්නේ නෑ කියලාත් මතක තියාගන්න.

---

## 5. Specificity and friends

**Why it exists:** precision and recall only look at the positive class. To judge how well the model leaves innocent cases alone, and to link metrics to medical language, we need a few more rates from the same four cells.

| Metric | Formula | Running example | Meaning |
|---|---|---|---|
| **Recall / Sensitivity / TPR** | TP / (TP + FN) | 80/100 = 0.80 | Share of positives caught |
| **Specificity / TNR** | TN / (TN + FP) | 840/900 = 0.933 | Share of negatives correctly cleared |
| **False Positive Rate (FPR)** | FP / (FP + TN) = 1 − specificity | 60/900 = 0.067 | Share of negatives falsely alarmed |
| **False Negative Rate (FNR)** | FN / (FN + TP) = 1 − recall | 0.20 | Share of positives missed |
| **Precision / PPV** | TP / (TP + FP) | 0.571 | Positive predictions that are right |
| **NPV** | TN / (TN + FN) | 840/860 = 0.977 | Negative predictions that are right |

**Connection to Bayes ([file 07](07-math-probability-statistics.md#9-bayes-theorem)):** precision depends heavily on how rare positives are (the base rate). The same model (same recall and specificity) applied to a population where the disease is rarer will have much lower precision.

### Worked example: the same model, a rarer disease

The model has recall 0.80 and specificity 0.933 (FPR 0.067). Test it on 1,000 people, but now only **10** are sick.

| | Count | Working |
|---|---|---|
| Sick people caught (TP) | 8 | 0.80 × 10 |
| Sick people missed (FN) | 2 | 10 − 8 |
| Healthy people falsely flagged (FP) | 66 | 0.067 × 990 |
| Healthy people cleared (TN) | 924 | 990 − 66 |

Precision = 8 ÷ (8 + 66) = **0.108**. Same model, same recall and specificity, but only about 1 in 9 people flagged is really sick, compared with 57% in the main running example. The rarer the condition, the lower precision falls. This is Bayes' theorem (base rate) in action.

**Where you'll meet it in real work:** medical test reports quote sensitivity and specificity; fraud teams quote FPR as "how many innocent customers do we bother".

**Common mistakes:**
- **Confusing FPR with FNR** (FPR = 1 − specificity; FNR = 1 − recall).
- **Assuming a test with 95% sensitivity and specificity means 95% of positives are real.** It depends on the base rate.

**Exam angle:** recall and sensitivity and TPR are the same thing; specificity is the recall of the negative class.

> **සිංහලෙන්:** Recall (sensitivity) කියන්නේ ලෙඩ්ඩු අල්ලගත්තු ප්‍රමාණය. Specificity කියන්නේ සුවෙන් ඉන්න අයව හරියට "ඔයා හොඳයි" කියපු ප්‍රමාණය. FPR = 1 − specificity. එකම model එකේ recall 0.80, specificity 0.933 වුණත්, ලෙඩේ තියෙන්නේ 1,000න් 10කට විතරක් නම් precision එක 8 ÷ 74 = 0.108 වෙනවා. ඒ කියන්නේ flag කරපු 9කින් එක්කෙනෙක් විතරයි ඇත්තටම ලෙඩ්ඩා. ලෙඩේ දුර්ලභ වෙන තරමට precision බහිනවා.

---

## 6. Thresholds and the trade-off

**Why it exists:** a probability is not yet a decision. The threshold decides how many cases get flagged, and the right place for it depends on what each kind of mistake costs.

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

### Worked example: pick the threshold by cost

Using the same six patients. Suppose a missed sick patient (FN) costs Rs. 50,000 and a false alarm (FP) costs Rs. 500 (illustrative costs).

| Threshold | FP | FN | Total cost |
|---|---|---|---|
| 0.9 | 0 | 2 | 2 × 50,000 = Rs. 100,000 |
| 0.5 | 1 | 1 | 500 + 50,000 = Rs. 50,500 |
| 0.35 | 1 | 0 | 500 = **Rs. 500** |

The cheapest option is the threshold 0.35, not the default 0.5. With different costs the answer would change; that is the point.

```
low threshold  ◄───────────── slider ─────────────►  high threshold
flag many                                              flag few
recall UP, precision DOWN                              recall DOWN, precision UP
```

**Where you'll meet it in real work:** a bank deciding how many transactions to send to manual review, given how many analysts it has; a hospital deciding who to send for a second scan.

**Common mistakes:**
- **Choosing the threshold on the test set.** That leaks test information into your design. Use validation data.
- **Judging a model only at 0.5.** A model that looks poor at 0.5 may be excellent at 0.2.

**Exam angle:** "raise the threshold" means fewer positive predictions, higher precision and lower recall; "lower it" means the reverse.

> **සිංහලෙන්:** Model එක දෙන්නේ probability එකක්, ඒක ඔව්/නෑ තීරණයක් කරන්නේ threshold එකෙන්. Threshold එක පහළට ගත්තොත් ගොඩක් අය flag වෙනවා, recall වැඩි වෙනවා, precision අඩු වෙනවා. උඩට ගත්තොත් අනිත් පැත්ත. රෝගීන් 6කගේ උදාහරණයේ ලෙඩ්ඩෙක් මඟ හැරුණොත් Rs. 50,000ක් නැති වෙනවා, false alarm එකකට Rs. 500යි නම්, threshold 0.35දි මුළු වියදම Rs. 500යි, 0.5දි Rs. 50,500යි, 0.9දි Rs. 100,000යි. ඒ නිසා default 0.5 හැමදාම හොඳම නෑ. Threshold එක තෝරන්න validation data පාවිච්චි කරන්න, test data නෙවෙයි.

---

## 7. ROC curve and ROC-AUC

**Why it exists:** choosing one threshold hides how good the model's ranking is. The ROC curve shows performance at every threshold at once, and AUC squeezes the whole curve into a single number.

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

### Worked example: drawing the ROC curve from the 6 patients

Lower the threshold step by step and record (FPR, TPR). There are 3 sick and 3 healthy patients.

| Threshold | Flagged | TP | FP | TPR = TP ÷ 3 | FPR = FP ÷ 3 |
|---|---|---|---|---|---|
| above 0.95 | none | 0 | 0 | 0 | 0 |
| 0.95 | A | 1 | 0 | 0.333 | 0 |
| 0.80 | A, B | 2 | 0 | 0.667 | 0 |
| 0.65 | A, B, C | 2 | 1 | 0.667 | 0.333 |
| 0.40 | A, B, C, D | 3 | 1 | 1.0 | 0.333 |
| 0.30 | + E | 3 | 2 | 1.0 | 0.667 |
| 0.10 | + F | 3 | 3 | 1.0 | 1.0 |

The area under this staircase, adding up rectangles from left to right: 0.333 × 0.667 (from FPR 0 to 0.333) + 0.333 × 1.0 + 0.333 × 1.0 = 0.222 + 0.333 + 0.333 = **0.889**, which matches the 8/9 pair-counting answer.

**Where you'll meet it in real work:** credit scoring teams compare candidate models by AUC before they choose a cut-off; medical researchers report AUC for a new diagnostic test.

**Common mistakes:**
- **Passing hard 0/1 predictions to `roc_auc_score`.** It needs scores or probabilities, otherwise the curve has one corner.
- **Reading AUC as accuracy.** AUC measures ranking, not how many are right at a given threshold.
- **Trusting it on very rare positives** (see the next section).

**Exam angle:** AUC 1.0 perfect, 0.5 random, and the "probability a random positive outscores a random negative" interpretation.

> **සිංහලෙන්:** ROC curve එකෙන් threshold හැම එකකදීම model එක කොහොමද කියලා එකවර පෙන්නනවා. අක්ෂ දෙක TPR (recall) සහ FPR. AUC කියන්නේ ඒ curve එක යට ප්‍රදේශය: 1.0 කියන්නේ පරිපූර්ණ, 0.5 කියන්නේ අහඹු අනුමානය. රෝගීන් 6කගේ උදාහරණයේ ලෙඩ්ඩු 3 සහ සුවෙන් අය 3 අතර යුගල 9ක් සසඳනකොට 8කදී ලෙඩ්ඩාට වැඩි score එකක් ලැබුණා, ඒ නිසා AUC = 8/9 = 0.89. AUC එක ගණනය කරන්න probabilities දෙන්න, 0/1 predictions නෙවෙයි.

---

## 8. Precision-Recall curve and PR-AUC

**Why it exists:** when positives are rare, ROC-AUC can look wonderful while most alarms are false. The PR curve looks only at the positives and at how trustworthy the alarms are.

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

### Worked example: PR points and average precision from the 6 patients

| Threshold | Flagged | TP | FP | Precision | Recall |
|---|---|---|---|---|---|
| 0.95 | A | 1 | 0 | 1.00 | 0.333 |
| 0.80 | A, B | 2 | 0 | 1.00 | 0.667 |
| 0.65 | A, B, C | 2 | 1 | 0.667 | 0.667 |
| 0.40 | A, B, C, D | 3 | 1 | 0.75 | 1.0 |

Average precision = Σ (rise in recall × precision at that step) = 0.333 × 1.00 + 0.333 × 1.00 + 0 × 0.667 + 0.333 × 0.75 = 0.333 + 0.333 + 0 + 0.250 = **0.917**.

### Worked example: why ROC can look too good

A bank scores 1,000,000 transactions, of which 2,000 (0.2%) are fraud. The model catches 80% of fraud (TPR 0.80) with a false positive rate of only 1%.

- TP = 0.80 × 2,000 = 1,600
- FP = 0.01 × 998,000 = 9,980
- Precision = 1,600 ÷ (1,600 + 9,980) = **0.138**

On a ROC plot the point (FPR 0.01, TPR 0.80) looks fantastic, yet 86% of alarms are false. The PR view makes this visible.

**Where you'll meet it in real work:** fraud, rare-disease, defect detection and information retrieval, where one needs to find a needle in a haystack.

**Common mistakes:**
- **Comparing PR-AUC across datasets with different positive rates.** The baseline moves with the positive rate.
- **Using 0.5 as the random baseline.** It is the positive rate.

**Exam angle:** "highly imbalanced, positives matter" signals PR-AUC (average precision) over ROC-AUC.

> **සිංහලෙන්:** Positives ගොඩක් දුර්ලභ නම් ROC-AUC රවටන්න පුළුවන්, ඒ නිසා PR curve එක (precision vs recall) පාවිච්චි කරනවා. Transactions 10 ලක්ෂයකින් fraud 2,000ක් (0.2%) තියෙද්දී, model එක fraud වලින් 80%ක් අල්ලගෙන, හොඳ transactions වලින් 1%ක් වැරදියට flag කළොත්, TP = 1,600 සහ FP = 9,980. ඒ කියන්නේ precision = 1,600 ÷ 11,580 = 0.138. ROC එකේ හොඳට පේනවා, ඒත් alarms වලින් 86%ක්ම බොරු. PR-AUC වල random baseline එක 0.5 නෙවෙයි, positives වල ප්‍රතිශතයයි (මෙතන 0.002).

---

## 9. Log loss and calibration

**Why it exists:** sometimes we need to trust the probability itself, not just the ranking: "there is a 30% chance this borrower defaults" has to mean 30%. Log loss and calibration measure that.

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

### Worked example: log loss by hand

Log loss for one example = −ln(probability given to the true outcome).

| True label | Model's probability for the true label | −ln(p) |
|---|---|---|
| 1 | 0.9 (confident, right) | 0.105 |
| 1 | 0.6 | 0.511 |
| 1 | 0.1 (confident, wrong) | 2.303 |
| 1 | 0.01 (very confident, wrong) | 4.605 |

Notice how a confident wrong answer is punished far more than a hesitant one. For three predictions, (y = 1, p = 0.9), (y = 0, p = 0.2 so probability of the truth = 0.8), (y = 1, p = 0.6):

- Log loss = (0.105 + 0.223 + 0.511) ÷ 3 = **0.280**
- Brier score = (0.1² + 0.2² + 0.4²) ÷ 3 = (0.01 + 0.04 + 0.16) ÷ 3 = **0.070**

### Worked example: checking calibration

A model assigns 70% to 200 customers. If a well-calibrated model is right, about 140 of them should actually churn. If only 100 churn (50%), the model is **overconfident**.

**Where you'll meet it in real work:** insurance pricing and credit risk, where probabilities feed directly into prices and capital rules; also in LLMs, where we ask whether a model's confidence matches how often it is correct.

**Common mistakes:**
- **Assuming high AUC means well-calibrated.** A model can rank perfectly and still give silly probabilities.
- **Calibrating on the training data.** Use held-out data.

**Exam angle:** log loss punishes confident mistakes; calibration is about probabilities matching frequencies; Platt scaling, isotonic regression and temperature scaling are the standard fixes.

> **සිංහලෙන්:** Log loss කියන්නේ model එකේ probabilities කොච්චර හොඳද කියන මිනුම. හරි උත්තරයට දුන්න probability එකේ −ln අගය ගන්නවා: 0.9 නම් 0.105යි, ඒත් වැරදි උත්තරයකට 0.01ක් දුන්නොත් 4.605ක් වෙනවා. ඒ කියන්නේ විශ්වාසයෙන් වැරදුණාම ලොකු දඬුවමක්. Calibration කියන්නේ "70%" කියපු අයගෙන් ඇත්තටම 70%ක් positive වෙන්න ඕනේ කියන එක. අය 200කට 70% දුන්නා, ඒත් 100ක් විතරයි ඇත්තටම churn වුණේ නම් model එක overconfident. Ranking හොඳ වුණාට probabilities වැරදි වෙන්න පුළුවන්.

---

## 10. Multi-class metrics

**Why it exists:** precision and recall were defined for one positive class. With three or more classes you need a rule for combining the per-class scores, and the rule you choose can hide or reveal a weak class.

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

### Worked example: a 3-class confusion matrix

Rows are actual, columns are predicted (100 images per class):

| Actual \ Predicted | cat | dog | bird |
|---|---|---|---|
| cat | 90 | 5 | 5 |
| dog | 10 | 80 | 10 |
| bird | 20 | 10 | 70 |

Per class, treating that class as positive:

| Class | TP | FP (column − TP) | FN (row − TP) | Precision | Recall |
|---|---|---|---|---|---|
| cat | 90 | 10 + 20 = 30 | 10 | 90 ÷ 120 = 0.75 | 90 ÷ 100 = 0.90 |
| dog | 80 | 5 + 10 = 15 | 20 | 80 ÷ 95 = 0.842 | 0.80 |
| bird | 70 | 5 + 10 = 15 | 30 | 70 ÷ 85 = 0.824 | 0.70 |

- Macro recall = (0.90 + 0.80 + 0.70) ÷ 3 = **0.80**
- Micro: pool TP = 240, FP = 60, FN = 60 → precision = recall = 240 ÷ 300 = **0.80**, which equals accuracy (240 correct out of 300)

Here the classes have equal size, so macro and micro agree. With the unequal classes in the example above they disagreed a lot.

**Where you'll meet it in real work:** classifying support tickets into departments, news articles into topics, or product images into categories, where the rare class is often the one that matters.

**Common mistakes:**
- **Reporting weighted F1 and thinking a rare class is fine.** Check macro F1 and the per-class table too.
- **Using accuracy on imbalanced classes.**

**Exam angle:** micro pools counts (equals accuracy for single-label multi-class), macro treats classes equally, weighted weights by support.

> **සිංහලෙන්:** Classes 3ක් හෝ වැඩි නම් precision, recall, F1 හැම class එකකටම වෙන වෙනම ගණනය කරලා පස්සේ එකතු කරනවා. Macro කියන්නේ classes වල සාමාන්‍යය (හැම class එකකටම සමාන බරක්). Weighted කියන්නේ class එකේ ප්‍රමාණය අනුව බර දෙන එක, ඒකෙන් දුර්ලභ class එකේ දුර්වලකම ලේසියෙන් හැංගෙනවා. Micro කියන්නේ TP, FP, FN සියල්ල එකට එකතු කරලා ගණනය කරන එක, ඒක accuracy එකටම සමානයි. Cat, dog, bird 100 බැගින් තියෙන උදාහරණයේ macro recall සහ micro recall දෙකම 0.80යි.

---

## 11. Regression metrics

**Why it exists:** for "how much?" predictions we need to say how far off we are on average, in units a manager understands (rupees, kilos, minutes).

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

### Worked example: MAE versus RMSE

Two models, both with total absolute error 40 over four predictions:

| Model | Errors | MAE | MSE | RMSE |
|---|---|---|---|---|
| Even | 10, 10, 10, 10 | 10 | 100 | **10** |
| Spiky | 0, 0, 0, 40 | 10 | 400 | **20** |

MAE says they are equal. RMSE, which squares errors first, says the spiky model is twice as bad because of its one big miss. Pick RMSE if big misses are especially costly (a delivery that is 40 minutes late is worse than four that are 10 late).

### Worked example: adjusted R²

Adjusted R² = 1 − (1 − R²) × (n − 1) ÷ (n − p − 1), with n rows and p features.

- n = 50, p = 5, R² = 0.80 → 1 − 0.20 × 49 ÷ 44 = 1 − 0.223 = **0.777**
- Add 15 junk features, R² creeps up to 0.81 → p = 20: 1 − 0.19 × 49 ÷ 29 = 1 − 0.321 = **0.679**

Plain R² went up (0.80 to 0.81), but adjusted R² dropped from 0.777 to 0.679, correctly saying the extra features did not help.

**Where you'll meet it in real work:** forecasting electricity demand, house prices, delivery times, or sales. Teams usually report MAE for managers and RMSE for model selection.

**Common mistakes:**
- **MAPE with actuals near zero**, where it explodes or is undefined.
- **Quoting R² from the training set.** Use held-out data.
- **Comparing RMSE across targets with different units.**

**Exam angle:** know the formulas, that RMSE is in the target's units and penalises large errors, and that R² can be negative.

> **සිංහලෙන්:** Regression වලදී වැරැද්ද මනින්න MAE (වැරදි වල absolute සාමාන්‍යය), MSE (වර්ග වල සාමාන්‍යය), RMSE (MSE එකේ වර්ගමූලය) පාවිච්චි කරනවා. Models දෙකක වැරදි 10,10,10,10 සහ 0,0,0,40 නම් දෙකටම MAE = 10, ඒත් RMSE 10 සහ 20. ලොකු වැරදි වලට වැඩි බරක් දෙන්නේ RMSE. R² කියන්නේ mean එක කියන baseline එකට වඩා කොච්චර හොඳද කියන එක: 1 පරිපූර්ණයි, 0 baseline එකට සමානයි, ඍණ නම් baseline එකටත් වඩා නරකයි. Features අනවශ්‍ය ගොඩක් දැම්මාම R² වැඩි වුණාට adjusted R² අඩු වෙනවා.

---

## 12. Hyperparameter tuning

**Why it exists:** hyperparameters (tree depth, learning rate, k) are set before training, and no formula tells us the best values. Tuning is the structured way to try options and keep the one that performs best on validation data.

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

### Worked example: how many models will it train?

Three hyperparameters with 5 values each, 5-fold cross-validation:

| Method | Combinations | Models trained |
|---|---|---|
| Grid search | 5 × 5 × 5 = 125 | 125 × 5 folds = **625** |
| Random search, 30 trials | 30 | 30 × 5 = **150** |
| Optuna, 50 trials, 3-fold | 50 | 50 × 3 = **150** |

Random and Bayesian search spend a fixed budget. If only one of the three hyperparameters matters, grid search tries just 5 distinct values of it across 625 fits, while random search tries about 30 distinct values in 150 fits.

**Cooking analogy:** tuning kottu. Grid search tries every combination of chilli, salt and cooking time. Random search tries ten random combinations. Bayesian search tastes the first few, notices "less salt is better" and chooses the next trial accordingly.

**Where you'll meet it in real work:** the last stretch of nearly every tabular project, for example tuning a LightGBM fraud model overnight on a server with several CPU cores.

**Common mistakes:**
- **Tuning on the test set**, or reporting the best cross-validation score as the final performance after heavy tuning.
- **Searching learning rates on a linear scale.** Use log scale.
- **Tuning before fixing the data and features**, which usually gives bigger gains.

**Exam angle:** parameters are learned; hyperparameters are chosen. Know the three search strategies and why random beats grid on budget.

> **සිංහලෙන්:** Parameters model එක තනියම ඉගෙන ගන්නවා, Hyperparameters අපි training එකට කලින් තෝරනවා (tree depth, learning rate, k වගේ). Grid search කියන්නේ හැම එකතුවක්ම උයලා බලන එක. Settings 3ක්, එක එකකට අගයන් 5ක් නම් 125 combinations, 5-fold CV එක්ක models 625ක් train කරන්න වෙනවා. Random search වලදී අහඹු 30ක් විතරක් බලලා models 150කින් වැඩේ කරනවා. Optuna වගේ Bayesian search කලින් ප්‍රතිඵල අනුව ඊළඟ හොඳ settings තෝරනවා. Learning rate වගේ දේවල් log scale එකේ search කරන්න, test data පාවිච්චි කරන්න එපා.

---

## 13. Learning curves and validation curves

**Why it exists:** a poor score alone does not tell you what to fix. Learning and validation curves show whether the model needs more data, a bigger model, or more regularisation.

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

### Worked example: diagnosing from numbers

These accuracy figures are made-up illustrations of the three typical patterns:

| Situation | Train | Validation | Diagnosis | What to try |
|---|---|---|---|---|
| A | 0.72 | 0.70 | Both low and close: high bias (underfit) | Bigger model, better features; more data will not help |
| B | 0.99 | 0.78 | Big gap: high variance (overfit) | More data, regularisation, simpler model |
| C | 0.91 | 0.89 | Both high and close | Good fit; stop tuning |

Reading a validation curve for `max_depth` of a tree (illustrative):

| max_depth | Train | Validation |
|---|---|---|
| 2 | 0.80 | 0.79 |
| 5 | 0.90 | 0.87 |
| 10 | 0.99 | 0.84 |
| 20 | 1.00 | 0.80 |

Validation peaks at depth 5, then falls even though training keeps rising. The best depth is about 5.

**Where you'll meet it in real work:** deciding whether to spend money labelling more data (only worth it for case B) or to engineer features (for case A).

**Common mistakes:**
- **Collecting more data when the problem is underfitting.**
- **Reading one noisy curve without cross-validation spread.**

**Exam angle:** high bias = both curves low and close; high variance = large gap. Expect to match a picture to a diagnosis and a remedy.

> **සිංහලෙන්:** Learning curve එකෙන් training set size එක වැඩි කරද්දී train සහ validation ලකුණු කොහොමද වෙනස් වෙන්නේ කියලා බලනවා. දෙකම පහළයි සහ ළඟයි (0.72 සහ 0.70) නම් model එක underfit, ඒ කියන්නේ data වැඩි කරලා වැඩක් නෑ, model එක ලොකු කරන්න ඕනේ. Train 0.99, validation 0.78 වගේ ලොකු පරතරයක් තියෙනවා නම් overfit, data වැඩි කරන්න හෝ regularisation දාන්න ඕනේ. Validation curve එකේ max_depth 5දී validation ලකුණ උපරිම වෙලා පස්සේ බහිනවා නම්, හොඳම depth එක 5යි.

---

## 14. Imbalanced data

**Why it exists:** most models, left alone, learn to say "no fraud" every time because that is right 99% of the time. Imbalanced-data techniques push the model to pay attention to the rare class.

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

### Worked example: class weights

The `balanced` formula: weight = n_samples ÷ (n_classes × class_count). With 1,000 rows, 990 normal and 10 fraud:

- Normal: 1,000 ÷ (2 × 990) = **0.505**
- Fraud: 1,000 ÷ (2 × 10) = **50**

A mistake on a fraud row now costs about 100 times a mistake on a normal row, so the model can no longer ignore fraud.

### Worked example: one SMOTE point

Rare example a = (2, 4), its nearest rare neighbour b = (4, 8). Pick a random fraction λ = 0.25 between 0 and 1:

new point = a + λ × (b − a) = (2, 4) + 0.25 × (2, 4) = **(2.5, 5)**

It lies on the line between a and b, so it is a plausible new rare example rather than an exact copy.

### Resampling in numbers

| Method | Before | After |
|---|---|---|
| Random undersampling | 990 normal, 10 fraud | 10 normal, 10 fraud (throws away 980 rows) |
| Random oversampling | 990 normal, 10 fraud | 990 normal, 990 fraud (duplicates) |
| SMOTE | 990 normal, 10 fraud | 990 normal, 990 fraud (synthetic) |

**Where you'll meet it in real work:** bank fraud, loan default, machine failure prediction, and rare-disease detection. In many cases simply lowering the threshold gets most of the benefit with no resampling at all.

**Common mistakes:**
- **Resampling before splitting**, which leaks synthetic copies of test rows into training.
- **Resampling the validation or test set.** They must reflect reality.
- **Forgetting that resampling changes probabilities**, so recalibrate if you need real probabilities.

**Exam angle:** know the list (threshold tuning, class weights, over/under-sampling, SMOTE), and that resampling goes inside the training fold only.

> **සිංහලෙන්:** Imbalanced data කියන්නේ එක class එකක් අනිකට වඩා ගොඩක් දුර්ලභ වෙන එක, උදා: transactions 1,000න් fraud 10යි. විසඳුම් කිහිපයක් තියෙනවා. Class weights වලදී fraud වැරදි වලට වැඩි බරක් දෙනවා: 1,000 ÷ (2 × 10) = 50, සාමාන්‍ය ඒවාට 0.505යි. SMOTE වලදී දුර්ලභ point දෙකක් අතර රේඛාවේ අලුත් point එකක් හදනවා, උදා: (2,4) සහ (4,8) අතර 0.25ක් ගියාම (2.5, 5). ඉතාම වැදගත්: resampling කරන්න training data වලට විතරයි, test data වලට නෙවෙයි. Threshold එක පහළට ගන්නත් ලේසි, හොඳ ක්‍රමයක්.

---

## 15. Choosing the metric

**Why it exists:** the "best" model depends on what you are optimising. A model that wins on AUC may lose on the thing the business actually cares about, so the metric must be chosen before comparing models.

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

### Worked example: precision@k and lift

A telecom can phone only 100 of its 1,000 customers this week. About 10% (100 customers) will churn. The model ranks customers by churn risk. Among its top 100:

- 30 are real churners → precision@100 = 30 ÷ 100 = **0.30**
- Calling at random would give 100 × 0.10 = 10 churners, so **lift** = 30 ÷ 10 = **3×**

A metric such as accuracy would tell the manager nothing about this decision; precision@k does.

### A three-step recipe

1. Write down what a false positive costs and what a false negative costs, in rupees or harm.
2. Pick the metric that mirrors that (recall, precision, PR-AUC, RMSE, precision@k).
3. Pick the threshold or k on validation data, then confirm with an online A/B test.

**Where you'll meet it in real work:** every real project kickoff meeting, where the data scientist and the business owner agree on the metric before any modelling starts.

**Common mistakes:**
- **Optimising a convenient metric** (accuracy) rather than the real goal.
- **Reporting a single number** without a baseline or an uncertainty range.
- **Assuming the offline metric equals business value.** An A/B test is the final judge.

**Exam angle:** scenario questions: "which metric should the team prioritise?" Identify the costly error, then name the matching metric.

> **සිංහලෙන්:** Metric එක තෝරන්නේ business එකට වැරදි වල වටිනාකම අනුවයි. Telecom එකකට එක සතියක customers 1,000න් 100කට විතරයි call කරන්න පුළුවන්, ඒවායින් 100ක් churn වෙනවා කියලා හිතමු. Model එකේ ඉහළම 100න් 30ක් ඇත්තටම churn වෙනවා නම් precision@100 = 0.30, අහඹුවට call කළොත් 10ක් විතරයි, ඒ නිසා lift = 3 ගුණයක්. Cancer screening වලට recall, spam filter එකට precision, house price වලට RMSE වගේ ගැළපෙන metric එක තෝරන්න. අන්තිමට A/B test එකකින් ඇත්ත business ප්‍රතිඵලය බලන්න.

```quiz
[
  {"q": "A fraud dataset has 0.5% fraud. A model that always predicts 'not fraud' is evaluated. What is true?", "options": ["Accuracy about 50%, recall 0", "Accuracy about 99.5%, recall 0", "Accuracy about 99.5%, recall 1", "Accuracy about 0.5%, recall 0.5"], "answer": 1, "why": "It is right on every legitimate transaction (99.5%) but catches no fraud (recall 0). This is exactly why accuracy misleads on imbalanced data."},
  {"q": "TP = 40, FP = 10, FN = 5, TN = 45. What is the precision?", "options": ["0.80", "0.889", "0.85", "0.50"], "answer": 0, "why": "Precision = TP / (TP + FP) = 40 / 50 = 0.80. The tempting 0.889 is recall, TP / (TP + FN) = 40 / 45."},
  {"q": "A cancer-screening test must miss as few real cases as possible. Which metric should you prioritise?", "options": ["Precision", "Recall", "Specificity", "Accuracy"], "answer": 1, "why": "Missing a case is a false negative, which recall measures. High precision would only mean few false alarms, which is less important here."},
  {"q": "Precision is 0.9 and recall is 0.3. What is the F1 score?", "options": ["0.60", "0.45", "0.27", "0.90"], "answer": 1, "why": "F1 = 2 x 0.9 x 0.3 / 1.2 = 0.45. The plain average 0.60 is tempting but the harmonic mean is pulled toward the weaker number."},
  {"q": "You raise the classification threshold from 0.5 to 0.9. What most likely happens?", "options": ["Precision up, recall down", "Precision down, recall up", "Both go up", "Neither changes"], "answer": 0, "why": "Fewer, more confident positive predictions mean fewer false alarms (precision up) but more missed positives (recall down). The reverse happens when you lower it."},
  {"q": "Fraud is 0.2% of transactions and you must evaluate a model. Which summary is usually more informative than ROC-AUC?", "options": ["Accuracy", "PR-AUC (average precision)", "R-squared", "MAE"], "answer": 1, "why": "With very rare positives ROC-AUC can stay high even when most alarms are false, because the FPR denominator is huge. PR-AUC focuses on precision for the rare class."},
  {"q": "True values are [10, 20, 30] and predictions [12, 18, 36]. What is the MAE?", "options": ["2.00", "3.33", "3.83", "10.0"], "answer": 1, "why": "Absolute errors 2, 2, 6 sum to 10, divided by 3 is 3.33. 3.83 is the RMSE (sqrt(14.67)), which squares the errors first."},
  {"q": "You apply SMOTE to the whole dataset and then split into train and test. What is wrong?", "options": ["Nothing, SMOTE should always come first", "Synthetic points built from test rows leak into training and the test set no longer reflects reality", "SMOTE only works on text", "The test set becomes too small"], "answer": 1, "why": "Resampling must be done only on the training portion (inside each CV fold). Doing it first contaminates the test data and inflates scores."}
]
```

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

**Q11.** Out of 1,000 people, only 10 are sick. A model has recall 0.80 and false positive rate 0.067. Roughly what is its precision?
<details><summary>Answer</summary>TP = 8, FP = 0.067 × 990 ≈ 66, precision = 8 ÷ 74 ≈ 0.11. Rare conditions give low precision even for a decent model.</details>

**Q12.** Two models both have MAE = 10, but one has RMSE = 10 and the other RMSE = 20. What does it tell you?
<details><summary>Answer</summary>The second model makes a few large errors (RMSE squares them), while the first spreads its errors evenly.</details>

**Q13.** 100 customers could be called; the top 100 ranked by the model contain 30 churners and the base churn rate is 10%. What are precision@100 and lift?
<details><summary>Answer</summary>Precision@100 = 0.30; random calling gives 10, so lift = 30 ÷ 10 = 3.</details>

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
| Baseline (majority class) | What a model that always guesses the common class would score |
| Lift | How many times better than random a ranked list performs |
| Overconfident model | One whose stated probabilities exceed how often it is right |
| Adjusted R² formula | 1 − (1 − R²)(n − 1)/(n − p − 1), penalising extra features |
| Class weight formula | n_samples ÷ (n_classes × class_count) |
| SMOTE interpolation | new = a + λ(b − a) for a random λ between 0 and 1 |

**Next:** [14-unsupervised-learning-and-more.md](14-unsupervised-learning-and-more.md)
