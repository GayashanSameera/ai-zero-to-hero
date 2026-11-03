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

**Why it exists:** some problems have rules nobody can write down. Try writing an `if` statement that recognises a cat, or one that decides whether an email "sounds like" spam. You'd need thousands of rules and they'd still break. Machine learning flips the job around: we show the computer lots of examples with the right answers, and it works out the rules itself.

From [file 01](01-big-picture-and-data.md#3-traditional-programming-vs-machine-learning): instead of writing rules, we give examples and the computer learns the rules.

```
Traditional programming:   Rules + Data      ──►  Answers
Machine learning:          Data  + Answers   ──►  Rules (the model)
```

A classic precise definition (Tom Mitchell, 1997):

> A program **learns** from **experience E** with respect to a **task T** and a **performance measure P**, if its performance at T, as measured by P, improves with E.

**Example:** spam filter
- **T** (task): classify emails as spam / not spam
- **E** (experience): 100,000 labelled emails
- **P** (performance): % of emails classified correctly

**In maths terms:** we want a function f (the model, [file 04](04-math-numbers-and-functions.md#6-functions)) so that **ŷ = f(x)** is close to the true **y**, for inputs **x** we have **never seen before**.

**Analogy:** we don't teach a small child what a cat is with rules ("two ears, a tail, whiskers..."). We point at many cats and say "cat". After a while the child recognises a cat they have never seen before. In ML words: the ears, eyes and fur are the **features**, "cat" is the **label**, the pointing period is **training**, and naming a new animal is **prediction** (also called **inference**).

**Worked example (house prices):** we have 1,000 sold houses. For each one we know the size (sq ft), the number of rooms and the distance from Colombo in km (the **features**), plus the price it sold for (the **label**). After training, we give the model a house it has never seen: 1,500 sq ft, 3 rooms, 12 km from Colombo. It answers "about Rs. 320 lakhs". Nobody wrote a price formula; the model found the pattern in the 1,000 examples.

**Where you'll meet it:** bank loan approval, fraud alerts on your card, product recommendations on Daraz, the "you may know" list on Facebook, email spam filters, and every LLM.

> **සිංහලෙන්:** සාමාන්‍ය programming වලදී අපි rules ලියනවා, computer එක ඒ rules පාවිච්චි කරලා උත්තර දෙනවා. Machine Learning වලදී අපි rules ලියන්නේ නෑ. අපි examples ගොඩක් සහ ඒවට හරි උත්තර දෙනවා, computer එක තනියම rules හොයාගන්නවා. පොඩි ළමයෙක්ට බළලා කවුද කියලා rules වලින් කියලා දෙන්නේ නෑනේ. බළල්ලු ගොඩක් පෙන්නලා "මේ බළලා" කියනවා, ටික දවසකින් ළමයා අලුත් බළලෙක්වත් අඳුනගන්නවා. ගෙවල් 1,000ක size, කාමර ගණන, Colombo ඉඳන් දුර (features) සහ විකුණපු මිල (label) දුන්නාම, model එක කවදාවත් දැකලා නැති ගෙයකටත් "ලක්ෂ 320ක් විතර" කියලා අනුමාන කරනවා.

---

## 2. Types of machine learning

**Why there are several types:** what kind of learning you can do depends on what your data gives you. Do you have the right answers (labels)? None at all? Only a few? Or can you only tell the model "good" or "bad" after it acts? Each situation has its own family of methods.

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

**Example:** a hospital has 100,000 X-ray images but a radiologist has only had time to label 2,000 of them. Semi-supervised methods learn from the 2,000 labelled images and use the other 98,000 to understand what X-rays generally look like.

### Self-supervised learning

The labels are **created automatically from the data itself**. For example, hide a word in a sentence and ask the model to predict it, or predict the next word. No humans needed, so you can train on enormous amounts of data.

**This is how LLMs are pretrained** (file 20): "predict the next word" on trillions of words of internet text. It's technically supervised (there's a target) but the targets come free from the data.

**Worked example:** from the sentence "I ate kottu for dinner", self-supervised training creates several training examples for free:

| Input (what the model sees) | Target (what it must predict) |
|---|---|
| I | ate |
| I ate | kottu |
| I ate kottu | for |
| I ate kottu for | dinner |

One sentence gives four labelled examples, and nobody had to label anything.

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

**One bank, four types of ML:**

| Problem at the bank | Type |
|---|---|
| Will this customer repay the loan? (50,000 past loans with known outcomes) | Supervised classification |
| Split customers into 4 groups for marketing (no group labels exist) | Unsupervised clustering |
| Flag strange card transactions | Anomaly detection (usually unsupervised) |
| A chatbot that learns which replies customers rate as helpful | Reinforcement learning (from feedback) |

### Other distinctions you'll hear

- **Batch (offline) learning:** train once on a fixed dataset. vs **Online learning:** update continuously as new data arrives.
- **Instance-based learning:** remember the examples and compare new ones to them (k-nearest neighbours). vs **Model-based learning:** learn parameters, then discard the data (linear regression, neural networks).
- **Discriminative vs generative models** ([file 01](01-big-picture-and-data.md#generative-ai-genai)): discriminative models learn P(y | x), the boundary between classes; generative models learn how the data itself is distributed and can create new samples (file 25).

**Common mistake:** calling LLM pretraining "unsupervised". There are targets (the next token), so it is **self-supervised**. Exams like this distinction.

**Exam angle:** expect a scenario ("2 million customers, no labels, find segments") and a question asking which paradigm fits. Look for the clue: labels → supervised; no labels → unsupervised; labels made from the data → self-supervised; rewards → RL.

> **සිංහලෙන්:** Learning වර්ගය තීරණය වෙන්නේ ඔයා ළඟ තියෙන data වර්ගය අනුවයි. Supervised කියන්නේ ගුරුවරයා උත්තර එක්කම past papers දෙනවා වගේ. Unsupervised කියන්නේ උත්තර නැති ප්‍රශ්න ගොඩක් දීලා "සමාන ඒවා එකට දාන්න" කියනවා වගේ. Semi-supervised කියන්නේ ප්‍රශ්න 1,000න් 50කට විතරක් උත්තර තියෙන එක. Self-supervised කියන්නේ පොතක වචනයක් වහලා ඒ වචනය අනුමාන කරන එක, LLMs pretrain කරන්නේ මේ විදිහට. Reinforcement learning කියන්නේ බල්ලෙක් හික්මවනවා වගේ, හොඳ දෙයක් කළාම biscuit එකක් ලැබෙනවා. Bank එකක් ගත්තොත්, ණය ගෙවයිද කියලා අනුමාන කරන එක supervised, customers ලා කණ්ඩායම් 4කට බෙදන එක unsupervised.

---

## 3. Regression vs classification

**Why it matters:** the very first question in any supervised problem is "am I predicting a number or a category?" The answer decides the loss function, the metrics, and often the model.

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

**Quick test:** ask "does 'halfway between two answers' make sense?" A price halfway between Rs. 100 lakhs and Rs. 200 lakhs (Rs. 150 lakhs) makes sense, so price is regression. Halfway between "cat" and "dog" means nothing, so that's classification.

**Sri Lankan examples:**

| Question | Type |
|---|---|
| How many kg of rice will this Keells branch sell tomorrow? | Regression |
| Will this student pass the A/L maths paper? | Binary classification |
| Which of 9 provinces is this vehicle number plate from? | Multi-class classification |
| Which tags fit this news article: politics, economy, cricket? | Multi-label classification |

> **සිංහලෙන්:** Supervised problem එකක් ආවාම මුලින්ම අහන්න ඕනේ "මම අනුමාන කරන්නේ අංකයක්ද, නැත්නම් category එකක්ද?" කියලා. හෙට Keells branch එකක් rice කිලෝ කීයක් විකුණයිද කියන එක අංකයක්, ඒ නිසා regression. A/L maths පාස් වෙයිද නැද්ද කියන එක category දෙකක්, ඒ නිසා binary classification. පොඩි test එකක් තියෙනවා: උත්තර දෙකක් අතර "මැද" තේරුමක් තියෙනවද? ලක්ෂ 100යි 200යි අතර ලක්ෂ 150 කියන්නේ තේරුමක් තියෙන මිලක්. ඒත් "බළලා" සහ "බල්ලා" අතර මැද කියලා දෙයක් නෑ.

---

## 4. The five ingredients

**Why learn this list:** once you see these five parts, every model you meet later (decision trees, neural networks, GPT) is just a different choice for each slot. It turns a zoo of algorithms into one pattern.

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

**The same five slots for an LLM:**

| Ingredient | GPT-style LLM |
|---|---|
| Data | Trillions of tokens of text |
| Model | A Transformer with billions of weights (file 19) |
| Loss | Cross-entropy on the next token |
| Optimiser | AdamW (a smarter gradient descent, file 15) |
| Evaluation | Perplexity and benchmarks (file 26) |

> **සිංහලෙන්:** හැම ML model එකකම කෑලි පහක් තියෙනවා: data, model එක (knobs තියෙන function එක), loss function එක (කොච්චර වැරදිද කියන අංකය), optimiser එක (knobs හරවන ක්‍රමය), සහ evaluation (අලුත් data වලට හරියට වැඩ කරනවද කියලා බලන එක). කොත්තු කඩයක් ගත්තොත්: data = කලින් හදපු කොත්තු සහ customers ලාගේ කමෙන්ට්, model = recipe එක, loss = "ලුණු වැඩියි" වගේ complaints ගණන, optimiser = ඊළඟ පාර ලුණු ටිකක් අඩු කරන එක, evaluation = අලුත් customer කෙනෙක් කාලා බලන එක. ChatGPT එකත් මේ කෑලි පහෙන්මයි හැදිලා තියෙන්නේ, ලොකු වෙනස data සහ knobs ගණන විතරයි.

---

## 5. Parameters vs hyperparameters

**Why the distinction matters:** you never set parameters by hand (there are millions or billions of them), but you *do* choose hyperparameters, and choosing them badly is the most common reason a model trains poorly.

| | **Parameters** | **Hyperparameters** |
|---|---|---|
| What | Numbers the model **learns** from data | Settings **you choose** before training |
| Examples | weights w and bias b; the numbers in a neural network | learning rate, number of trees, tree depth, regularisation strength λ, number of layers |
| Set by | the optimiser (training) | you (or a tuning search, file 13) |
| Analogy | what a student learns from studying | how many hours/day they study, which textbook |

"A 7-billion-parameter LLM" = 7 billion learned numbers.

**Worked example:** in ŷ = w·x + b for house prices, after training we might get w = 0.2 (lakhs per sq ft) and b = 20 (lakhs). Those two numbers are the **parameters**. The learning rate 0.01 and the 1,000 training epochs we chose are **hyperparameters**. Prediction for a 1,500 sq ft house: 0.2 × 1,500 + 20 = 300 + 20 = **Rs. 320 lakhs**.

**Rough size check:** each parameter is usually stored in 2 bytes (16-bit) for an LLM. 7 billion × 2 bytes = 14 billion bytes ≈ **14 GB** of GPU memory just to hold the weights. That's why model size matters so much in deployment (file 27).

**Exam angle:** "Which of these is learned during training?" Weights and biases. Learning rate, batch size, number of layers and epochs are always hyperparameters.

> **සිංහලෙන්:** Parameters කියන්නේ model එක training වලදී තනියම ඉගෙන ගන්න අංක, weights සහ bias වගේ. Hyperparameters කියන්නේ training පටන් ගන්න කලින් ඔයා තීරණය කරන settings, learning rate, epochs ගණන, layers ගණන වගේ. A/L ශිෂ්‍යයෙක්ට සමාන කළොත්, පාඩම් කරලා ඔළුවට ගිය දැනුම parameters, දවසට පැය කීයක් පාඩම් කරනවද, මොන පොතද කියන එක hyperparameters. ගෙවල් model එකේ w = 0.2 සහ b = 20 නම්, sqft 1,500 ගෙයකට 0.2 × 1,500 + 20 = ලක්ෂ 320ක් කියලා අනුමාන කරනවා. "7B model එකක්" කිව්වාම ඒ කියන්නේ ඉගෙන ගත්තු අංක බිලියන 7ක් තියෙනවා කියන එක.

---

## 6. Loss functions

**Why it exists:** a computer can't improve at something it can't measure. The loss function turns "how wrong is the model?" into a single number, so the optimiser has something to push down.

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

**Step by step for the MSE above:**
1. Error for each example (true − predicted): 100 − 110 = −10, 200 − 190 = 10, 300 − 400 = −100.
2. Square each one: (−10)² = 100, 10² = 100, (−100)² = 10,000.
3. Add them: 100 + 100 + 10,000 = 10,200.
4. Divide by n = 3: 10,200 / 3 = **3,400**.

The big miss contributes 10,000 of the 10,200 total, which is 98% of the loss. **Which to choose:** if a few huge mistakes are very costly (e.g. under-predicting hospital bed demand), use MSE. If your data has odd outliers you don't want to chase (e.g. a mansion in a dataset of normal houses), MAE or Huber is safer.

### Classification losses

**Cross-entropy / log loss** ([file 07](07-math-probability-statistics.md#23-cross-entropy)): −log(probability given to the correct class). Punishes confident wrong answers severely.

**Binary cross-entropy** for two classes: −[y·log(p) + (1−y)·log(1−p)].

**Worked example (natural log):** the true answer is "spam" (y = 1).

| Model's probability for "spam" | Loss = −log(p) | Meaning |
|---|---|---|
| 0.9 | −log(0.9) ≈ **0.11** | confident and right: tiny loss |
| 0.5 | −log(0.5) ≈ **0.69** | unsure: medium loss |
| 0.1 | −log(0.1) ≈ **2.30** | confident and wrong: big loss |
| 0.01 | −log(0.01) ≈ **4.61** | very confident and wrong: huge loss |

**Hinge loss:** used by Support Vector Machines (file 12).

### Why not use accuracy as the loss?

Accuracy is a step function: it only changes when a prediction flips class, so its gradient ([file 06](06-math-calculus.md#9-the-gradient)) is zero almost everywhere and gradient descent can't use it. Cross-entropy changes smoothly as probabilities improve. So we **train** with a smooth loss and **report** human-friendly metrics like accuracy.

**Exam angle:** "Why is cross-entropy preferred over accuracy for training a classifier?" Because it is differentiable and gives useful gradients; accuracy is not. Also know that LLMs are trained with cross-entropy on the next token.

> **සිංහලෙන්:** Loss function එක කියන්නේ model එක කොච්චර වැරදිද කියලා එක අංකයකින් කියන එක. අංකය අඩු වෙන්න වෙන්න model එක හොඳයි. MSE එකේදී වැරැද්ද square කරන නිසා ලොකු වැරදි වලට ලොකු දඬුවමක් ලැබෙනවා. උදාහරණයක් විදිහට වැරදි −10, 10, −100 නම්, squares 100, 100, 10,000 වෙනවා, MSE = 3,400යි, ඒකෙන් 98%ක්ම එන්නේ එක ලොකු වැරැද්දෙන්. Classification වලදී cross-entropy පාවිච්චි කරනවා. Model එක "spam වෙන්න 90%ක් ඉඩ තියෙනවා" කියලා හරියට කිව්වොත් loss එක 0.11යි, ඒත් "10%යි" කියලා වැරදියට කිව්වොත් loss එක 2.30ක් වෙනවා. Accuracy එක loss එකක් විදිහට පාවිච්චි කරන්නේ නෑ, මොකද ඒක පියවරෙන් පියවර පනින නිසා gradient එකක් ගන්න බෑ.

---

## 7. Training is optimisation

**Why it exists:** we now have a model with knobs (parameters) and a number that says how wrong it is (loss). Training is simply the search for the knob settings that make the loss smallest. Gradient descent is the search method.

We use **gradient descent** from [file 06](06-math-calculus.md#6-gradient-descent-in-one-dimension) to find the best parameters:

```
repeat:
    1. predictions = model(X)                    (forward pass)
    2. loss = Loss(predictions, y)
    3. gradients = ∂loss/∂θ for every parameter  (backward pass)
    4. θ = θ − learning_rate × gradients          (update)
```

**Analogy:** you are blindfolded on a foggy hill and want to reach the bottom of the valley. You can't see the path, but your feet can feel which way the ground slopes. You take a small step downhill, feel again, take another step. The **slope** is the gradient, the **size of each step** is the learning rate, and the **valley floor** is the lowest loss. Steps too big and you jump over the valley; too small and it takes all day.

**One update by hand:** one house, x = 2 (thousand sq ft), true price y = 10 (crore). Start with w = 1, b = 0, learning rate 0.1.

1. Predict: ŷ = 1 × 2 + 0 = **2**.
2. Error: ŷ − y = 2 − 10 = **−8**. Loss (squared error) = (−8)² = **64**.
3. Gradients: dw = 2 × error × x = 2 × (−8) × 2 = **−32**; db = 2 × error = **−16**.
4. Update: w = 1 − 0.1 × (−32) = 1 + 3.2 = **4.2**; b = 0 − 0.1 × (−16) = **1.6**.
5. Check: new prediction = 4.2 × 2 + 1.6 = **10.0**. New loss = 0.

(One perfect step is a lucky coincidence of these numbers; normally the loss drops a little each step over hundreds of steps.)

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

**Common mistakes:**
- **Learning rate too big:** the loss jumps around or grows to `nan`. Try 10× smaller.
- **Learning rate too small:** the loss falls painfully slowly. Try 10× bigger.
- **Unscaled features:** if one feature is in the millions and another is 0 to 1, the gradients are badly unbalanced. Scale features first (file 10).

Try the lab below: drag the line yourself, then let gradient descent do it.

> **සිංහලෙන්:** Training කියන්නේ loss එක අඩුම වෙන විදිහට knobs (parameters) හොයන එක, ඒකට පාවිච්චි කරන ක්‍රමය gradient descent. ඝන මීදුමක් තියෙන කන්දක ඇස් බැඳගෙන ඉන්නවා කියලා හිතන්න. පාර පේන්නේ නෑ, ඒත් කකුල් වලට දැනෙනවා බිම බෑවුම් කොයි පැත්තටද කියලා. ඒ පැත්තට පොඩි පියවරක් තියනවා, ආයෙත් බලනවා, ආයෙත් පියවරක්. Learning rate ලොකු වැඩි නම් නිම්නය පැනලා අනිත් පැත්තට යනවා, පොඩි වැඩි නම් පැය ගණන් යනවා. උදාහරණයක්: model එක ගෙයක මිල ලක්ෂ 200ක් කියනවා, ඇත්ත මිල ලක්ෂ 150යි, squared error එක 2,500යි. Knob එක ටිකක් හැරුවාම අනුමානය ලක්ෂ 185 වෙනවා, error එක 1,225ට අඩු වෙනවා. සිය පාරක් මෙහෙම කළාම වැරැද්ද ගොඩක් අඩු වෙනවා.

---

## 8. Batch, mini-batch, stochastic; epochs

How much data do we use to compute each gradient?

**Why it matters:** with millions of examples, computing the exact gradient over all of them for every single step is far too slow. Using a small random sample per step gives a "good enough" direction many times faster.

| Variant | Gradient computed on | Pros | Cons |
|---|---|---|---|
| **Batch gradient descent** | the whole dataset | stable, exact gradient | very slow per step for big data; must fit in memory |
| **Stochastic gradient descent (SGD)** | 1 random example | fast steps, noise helps escape bad spots | very noisy |
| **Mini-batch gradient descent** | a small random group (e.g. 32, 64, 256) | best of both; fits GPUs well | one more hyperparameter |

In practice, **mini-batch** is used almost always, and people (confusingly) still call it "SGD".

**Analogy:** you want to know whether Colombo likes your new kottu recipe. Asking all 750,000 people (batch) is exact but takes forever. Asking one random person (stochastic) is quick but one opinion is unreliable. Asking 50 random people at a time (mini-batch) gives a good idea quickly, and you can adjust the recipe after each group.

**Vocabulary:**
- **Batch size:** examples per mini-batch (e.g. 32)
- **Iteration / step:** one parameter update (one mini-batch)
- **Epoch:** one full pass through the entire training set

**Example:** 10,000 training examples, batch size 100 → **100 steps per epoch**. Training for 20 epochs = 2,000 steps.

**The formula:** steps per epoch = number of examples ÷ batch size (round up if it doesn't divide exactly). Total steps = steps per epoch × epochs. **Another one:** 1,050 examples, batch size 100 → 1,050 / 100 = 10.5, so **11 steps** (the last batch has only 50 examples).

**Shuffle** the data each epoch so mini-batches differ.

**Exam angle:** "steps per epoch" and "total steps" calculations are common, and so is "what does increasing batch size do?" Answer: smoother gradients and better GPU use, but more memory per step; very large batches often need a larger learning rate.

> **සිංහලෙන්:** Data ලක්ෂ ගණනක් තියෙද්දී හැම පියවරකටම මුළු data එකම බලලා gradient එක හදන එක ගොඩක් හෙමින්. ඒ නිසා අපි පොඩි කණ්ඩායමක් (mini-batch) අරන් ඉක්මනට දිශාව හොයනවා. Colombo මිනිස්සු අලුත් කොත්තු recipe එකට කැමතිද කියලා දැනගන්න හැමෝගෙන්ම අහන්න බෑනේ, ඒ නිසා random 50 දෙනෙක්ගෙන් අහලා recipe එක හදනවා, ආයෙත් තව 50ක්. Epoch එකක් කියන්නේ මුළු training data එකම එක පාරක් බලලා ඉවර වෙන එක. Examples 10,000ක් සහ batch size එක 100 නම්, epoch එකකට steps 100යි, epochs 20කට steps 2,000යි.

---

## 9. Generalisation

> **The goal of ML is not to do well on the training data. It's to do well on NEW data.**

**Generalisation** = performing well on unseen data.

**Analogy:** a student who memorises the answers to last year's exam papers word for word gets 100% on those papers but fails the real exam with new questions. A student who understands the concepts does well on both. We want the second student.

So we always keep some data **hidden from training** to measure real performance.

**Why this is harder than it sounds:** a big enough model can simply memorise its training data. A lookup table that stores every training house and its price gets 0 training error, and it is useless for a house it hasn't seen. Low training error proves nothing on its own.

**Where it bites in real work:** a fraud model trained on last year's transactions meets this year's new fraud tricks. A model trained on Colombo houses is asked about houses in Jaffna. The test of a model is always "how does it do on the data it will face after deployment?"

> **සිංහලෙන්:** ML වල ඇත්ත ඉලක්කය training data වලට හොඳට කරන එක නෙවෙයි, කවදාවත් දැකලා නැති අලුත් data වලට හොඳට කරන එක. ඒකට කියන්නේ generalisation කියලා. කලින් අවුරුද්දේ A/L past papers වල උත්තර වචනයෙන් වචනය කටපාඩම් කරපු ශිෂ්‍යයාට ඒ papers වලට 100% ගන්න පුළුවන්, ඒත් අලුත් ප්‍රශ්න තියෙන ඇත්ත exam එකේදී fail වෙනවා. Concept එක තේරුම් ගත්තු ශිෂ්‍යයා දෙකටම හොඳට කරනවා, අපිට ඕනේ ඒ වගේ model එකක්. ඒ නිසා අපි හැම වෙලාවෙම data කොටසක් training එකෙන් හංගලා තියාගෙන, ඇත්ත හැකියාව මනිනවා.

---

## 10. Train, validation, test splits

**Why three parts and not two:** if you use one held-out set both to *choose* your model and to *report* its score, you've quietly fitted to it, and the score flatters you. So one part is for choosing (validation) and a separate, untouched part is for the final honest score (test).

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

**Worked example:** 20,000 labelled loan applications, split 70/15/15:
- training: 20,000 × 0.70 = **14,000**
- validation: 20,000 × 0.15 = **3,000**
- test: 20,000 × 0.15 = **3,000**

With 10 million rows, even 1% is 100,000 test rows, which is plenty for a reliable score; that's why 98/1/1 is fine for huge data.

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

**Worked example (why stratify):** 1,000 transactions, 50 of them fraud (5%). A random 200-row test set could by bad luck contain only 4 fraud cases, or 16. A **stratified** split guarantees about 200 × 5% = **10** fraud cases in the test set, the same 5% as the whole data.

**Worked example (why group split):** one customer has 12 rows. If 8 land in training and 4 in test, the model can recognise that particular customer's habits, so the test score looks great but won't hold for new customers. A group split by customer ID keeps all 12 rows on one side.

**Data leakage** is when information from the test set (or from the future) sneaks into training. It's like the exam paper leaking before the A/L exam: marks look excellent, but nobody actually learned anything.

> **සිංහලෙන්:** අපි data තුනට කඩනවා: training set එකෙන් model එක ඉගෙන ගන්නවා, validation set එකෙන් models සසඳලා hyperparameters තෝරනවා, test set එක අන්තිමට එක පාරක් විතරක් පාවිච්චි කරනවා. A/L ශිෂ්‍යයෙක් ගත්තොත්, textbook එක training set, model papers validation set, ඇත්ත A/L exam එක test set. Exam එකට කලින් ප්‍රශ්න පත්‍රය leak වුණොත් ලකුණු හොඳයි, ඒත් ඇත්ත දැනුමක් නෑ, ඒකට තමයි data leakage කියන්නේ. Fraud 5%ක් විතරක් තියෙන data වලදී stratified split එකක් කළොත් test rows 200කට fraud 10ක් වගේ හරියටම ලැබෙනවා. එක customer කෙනෙක්ට rows ගොඩක් තියෙනවා නම් ඒ ඔක්කොම එක පැත්තකට දාන්න (group split), අනාගතය අනුමාන කරනවා නම් දිනය අනුව කඩන්න.

---

## 11. Underfitting and overfitting

**Why this is the central problem of ML:** almost every practical question ("should I add features?", "is my model too big?", "do I need more data?") is really a question about where you sit between these two failure modes.

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

**Analogy (three students):** the first didn't study at all and fails everything (underfitting). The second memorised past-paper answers word for word and fails as soon as a question is reworded (overfitting). The third understood the ideas and handles new questions (good fit).

**Worked example:** three models on 20 houses (errors in lakhs):

| Model | Training error | Test error | Diagnosis |
|---|---|---|---|
| Straight line | 40 | 42 | Underfitting: both high |
| Degree-2 curve | 15 | 18 | Good fit: both low, small gap |
| Degree-15 wiggly curve | 0.5 | 95 | Overfitting: tiny training, huge test |
| Degree-15 + Ridge (L2) | 12 | 25 | Regularisation pulled it back |

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

**Exam angle:** you'll get two numbers (training vs validation accuracy) and must name the problem and a fix. High training + low validation = overfitting. Both low (compared with what humans achieve) = underfitting.

Try the lab below: switch between the straight line and the wiggly curve, then reveal the test points.

> **සිංහලෙන්:** Exam එකකට පාඩම් කරන ශිෂ්‍යයෝ තුන් දෙනෙක් ගැන හිතන්න. පළවෙනියා කිසිම දෙයක් පාඩම් කළේ නෑ, ඒ underfitting, training ලකුණුත් test ලකුණුත් දෙකම අඩුයි. දෙවෙනියා past paper උත්තර කටපාඩම් කළා, ප්‍රශ්නය පොඩ්ඩක් වෙනස් කළාම බෑ, ඒ overfitting, training error එක 0.5යි, test error එක 95යි. තුන්වෙනියා concept එක තේරුම් ගත්තා, ඒ තමයි හොඳ fit එක. Overfitting වලට හොඳම බෙහෙත වැඩිපුර data, ඊට අමතරව regularisation, early stopping, සරල model එකක් වගේ දේවල් පාවිච්චි කරන්න පුළුවන්.

---

## 12. Bias-variance trade-off

**Why it exists:** sections 11's two failure modes have a precise explanation. Error on new data can be split into parts, and the knobs that shrink one part tend to grow the other.

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

**Worked example (made-up numbers to show the shape):**

| Model complexity | Bias² | Variance | Noise | Total |
|---|---|---|---|---|
| Very simple | 30 | 2 | 5 | **37** |
| Medium | 8 | 6 | 5 | **19** ← sweet spot |
| Very complex | 1 | 40 | 5 | **46** |

The noise (5) never goes away, whatever model you pick.

**Modern twist (double descent):** very large neural networks can go past the "overfitting" zone and generalise well again. That's part of why giant LLMs work. For classic ML, the trade-off picture holds.

**Exam angle:** "Adding more training data mainly reduces...?" Variance (bias stays about the same). "A bigger, more flexible model mainly reduces...?" Bias.

> **සිංහලෙන්:** අලුත් data වල error එක කෑලි තුනකින් හැදෙනවා: bias, variance, සහ කවදාවත් අඩු කරන්න බැරි noise. Bias කියන්නේ model එක සරල වැඩි නිසා ඇත්ත රටාව අල්ලගන්න බැරි වෙන එක, ඒක underfitting. Variance කියන්නේ training data එකේ පොඩි වෙනසකටත් model එක ගොඩක් වෙනස් වෙන එක, ඒක overfitting. Darts ගහනවා හිතන්න, bias වැඩි නම් හැම ඊතලයක්ම එකට වැදිලා ඒත් ඉලක්කයෙන් ඈත, variance වැඩි නම් ඉලක්කය වටේ ඒ මේ අතට විසිරිලා. Model එක සංකීර්ණ කරන්න කරන්න bias අඩු වෙනවා, variance වැඩි වෙනවා, ඒ නිසා අපි හොයන්නේ මැද තියෙන sweet spot එක.

---

## 13. Regularisation

**Idea:** add a **penalty** to the loss that discourages overly complex models (usually: large weights). The model must balance fitting the data with staying simple.

**Why large weights are suspicious:** a model that relies on huge weights reacts violently to tiny changes in the input, which is exactly the "memorised noise" behaviour of overfitting. Keeping weights small keeps the model smooth.

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

**Step by step for L2:** square each weight (3² = 9, (−1)² = 1, 0.5² = 0.25), add them (10.25), multiply by λ (0.1 × 10.25 = 1.025), add to the data loss (10 + 1.025 = 11.025). For L1, use absolute values instead of squares (3 + 1 + 0.5 = 4.5; 0.1 × 4.5 = 0.45; 10 + 0.45 = 10.45).

**Choosing between them:**

| You want... | Use |
|---|---|
| Keep all features but tame them | L2 / Ridge |
| A short list of features that matter (e.g. which 10 of 500 survey questions predict churn) | L1 / Lasso |
| Many correlated features and some selection | Elastic Net |

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

**Common mistake:** confusing sklearn's `C` (used in `LogisticRegression` and SVMs) with `alpha`. `C` is the **inverse** of regularisation strength: **smaller C = stronger regularisation**. Bigger `alpha` = stronger regularisation.

**Exam angle:** "Which regularisation produces sparse weights?" L1. "What is weight decay?" L2 regularisation in neural networks (AdamW applies it in a decoupled way, file 15).

> **සිංහලෙන්:** Regularisation කියන්නේ model එක කටපාඩම් කරන්න පටන් ගන්න එක නවත්තන්න loss එකට දාන දඬුවමක්. ගුරුවරයා "කටපාඩම් කරන්න එපා, සරලව තේරුම් ගන්න" කියලා දාන නීතියක් වගේ. L2 (Ridge) හැම weight එකක්ම ටික ටික පොඩි කරනවා, ඒත් හරියටම 0 කරන්නේ නෑ. L1 (Lasso) සමහර weights හරියටම 0 කරනවා, ඒ නිසා වැදගත් නැති features අයින් වෙනවා, ඒක automatic feature selection එකක්. Weights [3, −1, 0.5], λ = 0.1 නම්, L2 penalty එක 0.1 × (9 + 1 + 0.25) = 1.025යි, L1 penalty එක 0.1 × (3 + 1 + 0.5) = 0.45යි. Regularisation කරන්න කලින් features scale කරන්න අමතක කරන්න එපා.

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

**Step by step for the mean:** 0.82 + 0.85 + 0.80 + 0.84 + 0.83 = 4.14; 4.14 / 5 = **0.828**. A small std (0.018) means the model's score barely changes with the data it sees, so you can trust it. If the five scores were 0.60, 0.95, 0.70, 0.90, 0.99, the mean is similar but the model is unstable.

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

**Cost check:** 5-fold CV on a model that takes 10 minutes to train = 5 × 10 = **50 minutes**. Trying 20 hyperparameter settings with 5-fold CV = 20 × 5 = **100 training runs**. That's why CV is standard for classic ML but rarely used for large neural networks, which use one validation set instead.

> **සිංහලෙන්:** එක validation set එකක් විතරක් පාවිච්චි කළොත්, score එක වාසනාව මත රඳා පවතිනවා, මොන examples ඒකට වැටුණද කියන එක අනුව. Cross-validation වලදී training data කොටස් 5කට (folds) කඩලා, 5 පාරක් train කරනවා, හැම පාරකම වෙනස් කොටසක් validation එකට තියනවා. ඊට පස්සේ scores 5ේ සාමාන්‍යය ගන්නවා, උදාහරණයක් විදිහට 0.82, 0.85, 0.80, 0.84, 0.83 නම් සාමාන්‍යය 0.828යි. Scores එකිනෙකට ළඟ නම් model එක ස්ථාවරයි. අවාසිය තමයි 5 ගුණයක් වෙලාව යන එක, ඒ නිසා ලොකු neural networks වලට මේක එච්චර පාවිච්චි කරන්නේ නෑ.

---

## 15. Baselines

**Before building a fancy model, build a dumb one.** A **baseline** tells you what "good" means.

**Why:** a number like "94% accuracy" means nothing on its own. It's only good or bad compared with something. The baseline is that something, and it takes five minutes to build.

| Task | Simple baseline |
|---|---|
| Classification | Always predict the most common class |
| Regression | Always predict the mean (or median) |
| Time series | Predict yesterday's value ("naive forecast"), or the same day last week |
| Any | A simple model: logistic/linear regression, a small decision tree |

**Example:** 95% of transactions are legit. A "model" that always says "legit" gets **95% accuracy**. If your fancy model gets 94%, it's worse than doing nothing! (This is why accuracy is misleading for imbalanced data; see file 13.)

**Regression example:** house prices in your data have mean Rs. 250 lakhs. The baseline "always predict 250" has an MAE of, say, 80 lakhs. Your model's MAE of 30 lakhs now means something: it cuts the typical error by (80 − 30) / 80 = **62.5%**.

```python
from sklearn.dummy import DummyClassifier, DummyRegressor
DummyClassifier(strategy="most_frequent").fit(X_train, y_train).score(X_test, y_test)
```

> **සිංහලෙන්:** ලොකු model එකක් හදන්න කලින් ගොඩක් සරල, "මෝඩ" model එකක් හදන්න, ඒකට කියන්නේ baseline කියලා. Transactions 95%ක්ම හරි නම්, හැම එකටම "හරි" කියන model එකටත් 95% accuracy එකක් ලැබෙනවා. ඔයාගේ ලොකු model එකට 94% නම්, ඒක කිසිම දෙයක් නොකරනවාටත් වඩා නරකයි. ගෙවල් මිල වගේ regression එකකදී, හැම ගෙදරටම සාමාන්‍ය මිල කියන baseline එකේ error එක ලක්ෂ 80ක් නම්, ඔයාගේ model එකේ error එක ලක්ෂ 30යි කියන්නේ ඇත්තටම හොඳ දියුණුවක් කියලා එතකොට තේරෙනවා.

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

**Why the same interface matters:** to try a random forest instead, you change one line (`RandomForestClassifier()` instead of `LogisticRegression()`) and everything else stays the same. That makes "try a few model families" (section 18) cheap.

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

**Common mistake:** `StandardScaler().fit(X)` on the *whole* dataset before splitting. The scaler then learns the mean and spread of the test rows too, which is leakage. Always fit preprocessing on the training data only, or use a pipeline (next section).

> **සිංහලෙන්:** scikit-learn කියන්නේ classic ML වලට Python වල තියෙන ප්‍රධාන library එක. හැම model එකකටම එකම විදිහේ commands තියෙනවා: `fit` එකෙන් train කරනවා, `predict` එකෙන් අනුමාන කරනවා, `score` එකෙන් ඉක්මනට ලකුණු බලනවා. ඒ නිසා LogisticRegression වෙනුවට RandomForest එකක් try කරන්න ඕනේ නම් එක line එකක් විතරයි වෙනස් කරන්න තියෙන්නේ. Scaler එක fit කරන්න ඕනේ training data වලට විතරයි, මුළු data එකටම fit කළොත් test data වල තොරතුරු training එකට leak වෙනවා.

---

## 17. Pipelines

Manually remembering to fit preprocessing on train only is error-prone. A **Pipeline** chains preprocessing and model into one object, so that `fit` fits everything on training data and `predict` applies the same steps to new data. This prevents leakage automatically, even inside cross-validation.

**Analogy:** a kottu shop's recipe card. Chop the roti, add the vegetables, add the egg, mix on the hot plate, in that order, every time. Whoever cooks, the steps are identical. A pipeline is the recipe card for your data: the same steps, in the same order, for training data and for every new customer later.

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

**What the pipeline does with each column:**

```
age, income, tenure ──► fill missing with median ──► scale ──┐
                                                              ├──► LogisticRegression
city, plan ──────────► fill missing with most common ──► one-hot ──┘
```

**Why "even inside CV" matters:** in 5-fold CV, each round has a different training part. The pipeline re-fits the imputer and scaler on *that round's* training folds only, so the validation fold never leaks into preprocessing. Doing this by hand is easy to get wrong.

> **සිංහලෙන්:** Pipeline එකක් කියන්නේ preprocessing පියවර සහ model එක එකම object එකකට එකතු කරන එක. කොත්තු කඩේ recipe card එකක් වගේ, කවුරු උයනවා වුණත් පියවර එකම පිළිවෙළට එකම විදිහට. Missing values පුරවන එක, scale කරන එක, city වගේ text columns one-hot කරන එක, ඔක්කොම pipeline එක ඇතුළේ. `fit` කරද්දී ඒ හැම පියවරක්ම training data වලට විතරක් fit වෙනවා, ඒ නිසා cross-validation ඇතුළෙත් data leakage වෙන්නේ නෑ. Deploy කරද්දීත් මුළු pipeline එකම එක file එකක් විදිහට save කරන්න පුළුවන්.

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

**The recipe on a real problem (a telecom predicting which customers will leave):**

| Step | What it looks like |
|---|---|
| 1. Frame | "Predict who will cancel in the next 30 days so the retention team can call them." Metric: recall at a fixed number of calls per day. |
| 2. Data | 12 months of usage, billing, complaints; EDA shows 6% churn. |
| 3. Split | Time-based: train on Jan–Sep, validate on Oct–Nov, test on Dec. |
| 4. Baseline | "Nobody churns" = 94% accuracy, 0% recall. Logistic regression: 45% recall. |
| 5–7. Model | Pipeline + gradient-boosted trees, tuned with CV: 68% recall. |
| 8. Errors | Misses are mostly prepaid users with no complaints. Add a "days since last top-up" feature. |
| 9. Test | 66% recall on December, close to validation, so it generalises. |
| 10–11. Ship | Explain the top features to the business; monitor weekly for drift. |

> **සිංහලෙන්:** ML project එකක් කරන්නේ මේ පියවර වලින්: ප්‍රශ්නය පැහැදිලි කරගන්න, data එකතු කරලා clean කරන්න, train / validation / test වලට හරියට කඩන්න, මුලින්ම සරල baseline එකක් හදන්න, pipeline එකක් හදන්න, models කිහිපයක් try කරන්න, hyperparameters tune කරන්න, model එක වරද්දන තැන් බලන්න, අන්තිමට test set එකෙන් එක පාරක් බලන්න, ඊට පස්සේ deploy කරලා monitor කරන්න. Telecom company එකක customers ලා අයින් වෙයිද කියලා අනුමාන කරනවා නම්, "කවුරුත් අයින් වෙන්නේ නෑ" කියන baseline එකට 94% accuracy තිබුණත් එක customer කෙනෙක්වත් අල්ලගන්නේ නෑ. ඒ නිසා metric එක තෝරන එකත් පළවෙනි පියවරේම කොටසක්.

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

**Example:** a logistic regression gets 0.86 AUC and a 500-tree boosted model gets 0.87 on a loan-approval problem. The bank must explain every rejection to customers and regulators. The simpler logistic regression is usually the right choice: the 0.01 gain doesn't pay for the lost explainability.

> **සිංහලෙන්:** හැම ප්‍රශ්නයකටම හොඳම algorithm එකක් කියලා එකක් නෑ, ඒකට කියන්නේ No Free Lunch කියලා. Excel වගේ table data වලට සාමාන්‍යයෙන් XGBoost, LightGBM වගේ gradient-boosted trees හොඳට වැඩ කරනවා, images වලට CNNs, text වලට transformers. Models දෙකක් එක වගේම හොඳ නම්, සරල එක තෝරන්න, ඒක Occam's razor. Bank එකක ණය model එකක සරල logistic regression එකට 0.86යි, සංකීර්ණ model එකට 0.87යි නම්, හැම ණය ප්‍රතික්ෂේප කිරීමක්ම පැහැදිලි කරන්න ඕනේ නිසා සරල එක තමයි හොඳ.

```quiz
[
  {"q": "What is the main difference between traditional programming and machine learning?", "options": ["In ML, a programmer writes the rules by hand", "In ML, we give data and answers, and the computer finds the rules", "ML does not need any data", "ML only works with images"], "answer": 1, "why": "Traditional programming: rules + data → answers. ML: data + answers → rules (the model)."},
  {"q": "A bank has 2 million customer records with no labels and wants to find natural customer groups. Which type of learning fits?", "options": ["Supervised classification", "Reinforcement learning", "Unsupervised clustering", "Supervised regression"], "answer": 2, "why": "No labels and the goal is to discover structure, which is clustering. Supervised methods would need predefined group labels."},
  {"q": "Training accuracy is 99% but test accuracy is 65%. What is happening?", "options": ["Underfitting", "Overfitting", "A good fit", "The learning rate is too small"], "answer": 1, "why": "The model memorised the training data and doesn't generalise. That is overfitting (high variance)."},
  {"q": "Which regularisation can set some weights to exactly zero, doing feature selection?", "options": ["L1 (Lasso)", "L2 (Ridge)", "Dropout", "Early stopping"], "answer": 0, "why": "L1's push on a weight is constant, so it drives small weights all the way to zero. L2 shrinks weights but rarely makes them exactly zero."},
  {"q": "What happens if the learning rate in gradient descent is much too large?", "options": ["Training becomes very slow", "The steps jump over the minimum and the loss bounces around or grows", "Nothing changes", "The model always underfits"], "answer": 1, "why": "Steps that are too big overshoot the valley floor; the loss oscillates or diverges (sometimes to nan)."},
  {"q": "You have 50,000 training examples and a batch size of 250. How many steps are in one epoch?", "options": ["250", "200", "2,000", "50"], "answer": 1, "why": "Steps per epoch = examples ÷ batch size = 50,000 ÷ 250 = 200."},
  {"q": "Why do we train a classifier with cross-entropy instead of accuracy?", "options": ["Accuracy is always lower", "Cross-entropy is smooth and gives useful gradients; accuracy is a step function with zero gradient almost everywhere", "Accuracy cannot be computed on a GPU", "Cross-entropy needs no labels"], "answer": 1, "why": "Gradient descent needs a loss that changes smoothly as the model improves. Accuracy only changes when a prediction flips, so its gradient is useless."},
  {"q": "You are predicting next month's sales. How should you split the data?", "options": ["A random 80/20 split", "A stratified split by sales level", "A time-based split: train on earlier months, test on later months", "Use the same data for training and testing"], "answer": 2, "why": "A random split lets the model see the future during training (leakage). Time series must be split by time."}
]
```

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

**Q11.** Weights are [2, −2] and λ = 0.5. What are the L1 and L2 penalties (λ × penalty)?
<details><summary>Answer</summary>L1: 0.5 × (2 + 2) = 2. L2: 0.5 × (4 + 4) = 4.</details>

**Q12.** 5-fold CV scores are 0.70, 0.72, 0.71, 0.69, 0.73. What is the mean, and is the model stable?
<details><summary>Answer</summary>Mean = 3.55 / 5 = 0.71. The scores are very close together (small std), so yes, it is stable.</details>

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
| Data leakage | Test or future information sneaking into training |
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
