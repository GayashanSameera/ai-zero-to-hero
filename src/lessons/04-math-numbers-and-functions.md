# 04: Maths 1: Numbers, Algebra, and Functions

> **Before you start:** [02](02-python-programming.md) (you should be able to run small Python snippets). That's all; we start from primary-school level.
>
> **After this file you can:** read the formulas used in AI papers and tutorials. You'll understand variables, functions, graphs, slopes, exponents, logarithms, the Σ (sum) sign, and the Greek letters people use.

**Don't panic.** This file is written for people who say "I'm bad at maths". We go slowly, every symbol is explained in words, and Python checks every calculation for us. In AI you rarely compute by hand. You need to **read** formulas and **understand what they mean**.

---

## Table of contents

1. [Kinds of numbers](#1-kinds-of-numbers)
2. [Fractions, decimals, percentages](#2-fractions-decimals-percentages)
3. [Order of operations](#3-order-of-operations)
4. [Variables and algebra](#4-variables-and-algebra)
5. [Solving simple equations](#5-solving-simple-equations)
6. [Functions: input → output machines](#6-functions)
7. [Graphs and the coordinate plane](#7-graphs-and-the-coordinate-plane)
8. [Straight lines: slope and intercept](#8-straight-lines-slope-and-intercept)
9. [Exponents (powers)](#9-exponents-powers)
10. [Square roots](#10-square-roots)
11. [Scientific notation](#11-scientific-notation)
12. [Exponential growth and the number e](#12-exponential-growth-and-the-number-e)
13. [Logarithms](#13-logarithms)
14. [Summation (Σ) and product (Π) notation](#14-summation-σ-and-product-π-notation)
15. [Absolute value, min, max, argmax](#15-absolute-value-min-max-argmax)
16. [Common function shapes you'll meet in AI](#16-common-function-shapes-youll-meet-in-ai)
17. [Inequalities, intervals and set notation](#17-inequalities-intervals-and-set-notation)
18. [Greek letters cheat sheet](#18-greek-letters-cheat-sheet)
19. [Check yourself](#19-check-yourself)
20. [New words in this file](#20-new-words-in-this-file)

---

## 1. Kinds of numbers

| Kind | Examples | Notes |
|---|---|---|
| **Natural numbers** | 1, 2, 3, ... | counting numbers |
| **Integers** | ..., −2, −1, 0, 1, 2, ... | whole numbers, including negatives and zero |
| **Rational numbers** | ½, 0.75, −3/4 | can be written as a fraction |
| **Irrational numbers** | π ≈ 3.14159..., √2 ≈ 1.41421... | decimals go on forever with no pattern |
| **Real numbers** | all of the above | any point on the number line |

**Number line:**
```
 ◄──┼────┼────┼────┼────┼────┼────┼──►
   −3   −2   −1    0    1    2    3
```

**Negative numbers:** less than zero. Think temperature below freezing, or a bank balance that's overdrawn.

Rules for negatives:
- negative × negative = positive: (−2) × (−3) = 6
- negative × positive = negative: (−2) × 3 = −6
- subtracting a negative = adding: 5 − (−2) = 7

In AI, numbers inside models (weights, file 11) are usually real numbers, positive or negative, like 0.034 or −1.27.

---

## 2. Fractions, decimals, percentages

These are three ways to write the same thing:

| Fraction | Decimal | Percentage |
|---|---|---|
| 1/2 | 0.5 | 50% |
| 1/4 | 0.25 | 25% |
| 3/4 | 0.75 | 75% |
| 1/10 | 0.1 | 10% |
| 1/3 | 0.333... | 33.3% |

- **Fraction → decimal:** divide top by bottom. 3/4 = 3 ÷ 4 = 0.75
- **Decimal → percentage:** multiply by 100. 0.75 → 75%
- **Percentage → decimal:** divide by 100. 8% → 0.08

**Percentage of a number:** 20% of 150 = 0.20 × 150 = 30

**Percentage change:**
```
change % = (new − old) / old × 100
```
Sales went from 200 to 250: (250 − 200) / 200 × 100 = 50 / 200 × 100 = **25% increase**.

**Why this matters:** model accuracy (file 13) is a percentage; probabilities (file 07) are numbers between 0 and 1 (= 0% to 100%).

**Ratio:** 3 cats for every 1 dog is a 3:1 ratio. If a dataset has 990 normal and 10 fraud transactions, the ratio is 99:1, which is a "highly imbalanced" dataset (file 13).

---

## 3. Order of operations

When a calculation has several steps, do them in this order (often remembered as **BODMAS** or **PEMDAS**):

1. **B**rackets ( )
2. **O**rders / exponents (powers, roots)
3. **D**ivision and **M**ultiplication (left to right)
4. **A**ddition and **S**ubtraction (left to right)

**Example:** 2 + 3 × 4² = ?
1. Power: 4² = 16 → 2 + 3 × 16
2. Multiply: 3 × 16 = 48 → 2 + 48
3. Add: **50**

Python follows the same rules: `2 + 3 * 4**2` → `50`.

---

## 4. Variables and algebra

**Idea:** In maths, a **variable** is a letter that stands for a number we don't know yet, or a number that can change. Same idea as a variable in Python ([file 02](02-python-programming.md#3-variables)).

**Writing conventions in maths:**
- `3x` means 3 × x (the multiplication sign is hidden)
- `xy` means x × y
- `x²` means x × x
- `a/b` or a fraction bar means a ÷ b

**Example:** If x = 4, what is 3x + 2?
3 × 4 + 2 = 12 + 2 = **14**

**Formula:** a rule written with variables. For example, the area of a rectangle:
```
A = w × h
```
where A = area, w = width, h = height.

**Subscripts:** small numbers or letters written below, used to label related variables:
- x₁, x₂, x₃ = "x one, x two, x three": three different features (e.g. size, bedrooms, age of a house)
- xᵢ = "x sub i": the i-th item in a list (i is a counter, like a loop variable)

In code: `x[0]`, `x[1]`, `x[i]`. Remember Python counts from 0, while maths usually counts from 1.

---

## 5. Solving simple equations

**Equation:** a statement that two things are equal: `2x + 3 = 11`. "Solving" means finding the x that makes it true.

**Rule:** whatever you do to one side, do to the other (like keeping a balance scale level).

```
2x + 3 = 11
2x     = 11 − 3     (subtract 3 from both sides)
2x     = 8
x      = 8 / 2      (divide both sides by 2)
x      = 4
```

Check: 2 × 4 + 3 = 11 ✓

**Why this matters:** in ML we often "solve for" the best values of something. Simple models like linear regression (file 12) can even be solved directly with algebra. Most models can't be, so we use step-by-step searching instead (gradient descent, file 06 and 11).

---

## 6. Functions

**Idea:** A **function** is a rule that takes an **input** and gives exactly one **output**. Written as f(x), said "f of x".

**Analogy:** a vending machine. Press button B3 (input) → get a specific snack (output). Same button always gives the same snack.

```
         ┌──────────────┐
x = 3 ──►│ f(x) = 2x + 1 │──► 7
         └──────────────┘
```

**Example:** f(x) = 2x + 1
- f(0) = 2(0) + 1 = 1
- f(3) = 2(3) + 1 = 7
- f(−1) = 2(−1) + 1 = −1

Same thing in Python:

```python
def f(x):
    return 2 * x + 1

f(3)   # 7
```

**Functions with several inputs:** f(x, y) = x + 2y. f(1, 3) = 1 + 6 = 7.

**Terms:**
- **Input** = argument = independent variable (often x)
- **Output** = dependent variable (often y, written y = f(x))
- **Domain** = all the allowed inputs
- **Range** = all the possible outputs

### THE big idea: an ML model is a function

```
price = f(size, bedrooms, location)
```

Training an ML model means **finding a good function f** from examples. Every model in this course, from a simple line (file 12) to a giant LLM (file 20), is "just" a function with adjustable knobs, turned until it fits the data.

**Composition (functions inside functions):** f(g(x)) means "apply g first, then f to the result". A neural network (file 15) is many simple functions composed: layer3(layer2(layer1(x))).

---

## 7. Graphs and the coordinate plane

**Idea:** A graph is a picture of a function. We use two perpendicular number lines:
- **x-axis**: horizontal (input)
- **y-axis**: vertical (output)
- They cross at the **origin** (0, 0)

A **point** is written (x, y): first go x steps right (or left if negative), then y steps up (or down).

```
        y
        ▲
      4 ┤           • (3, 4)
      3 ┤
      2 ┤   • (1, 2)
      1 ┤
 ───────┼───┬───┬───┬───► x
     −1 ┤   1   2   3
        │
```

To graph y = f(x): calculate y for several x values, plot the points, and connect them.

| x | y = 2x + 1 |
|---|---|
| 0 | 1 |
| 1 | 3 |
| 2 | 5 |
| 3 | 7 |

These points all lie on a straight line.

```python
import matplotlib.pyplot as plt   # charts library (file 09)
xs = [0, 1, 2, 3]
ys = [2*x + 1 for x in xs]
plt.plot(xs, ys, marker="o")
plt.xlabel("x"); plt.ylabel("y")
plt.show()
```

---

## 8. Straight lines: slope and intercept

This is the foundation of **linear regression** (file 12) and of every neuron in a neural network (file 15). Take your time here.

Every straight line can be written as:

```
y = m·x + b
```

- **m = slope**: how steep the line is. "For every 1 step right in x, how much does y go up?"
- **b = intercept**: where the line crosses the y-axis (the value of y when x = 0).

(In ML you'll see the same thing written as **y = w·x + b**, where **w = weight** and **b = bias**. Same idea, different letters.)

### Slope explained

```
slope = rise / run = (change in y) / (change in x) = (y₂ − y₁) / (x₂ − x₁)
```

**Example:** a line passes through (1, 3) and (4, 9).
slope = (9 − 3) / (4 − 1) = 6 / 3 = **2**. Each step right, the line goes up 2.

| Slope | Meaning | Picture |
|---|---|---|
| positive (m > 0) | goes up to the right | ／ |
| negative (m < 0) | goes down to the right | ＼ |
| zero (m = 0) | flat | ── |
| bigger number | steeper | |

### Real-world example

Taxi fare: $3 to get in, plus $2 per km.
```
fare = 2 × km + 3
```
- slope m = 2 (each extra km costs $2)
- intercept b = 3 (cost at 0 km)
- A 10 km trip: 2 × 10 + 3 = **$23**

### Preview: linear regression

If you have data points of (house size, price), linear regression finds the m and b that make the line pass as close as possible to all the points. Then you can predict: "a 150 m² house costs about m × 150 + b".

With several inputs, it's the same idea:
```
y = w₁x₁ + w₂x₂ + w₃x₃ + b
```
Each feature gets its own weight (how much it matters), plus one bias.

---

## 9. Exponents (powers)

**Idea:** An exponent says how many times to multiply a number by itself.

```
2³ = 2 × 2 × 2 = 8         (2 to the power 3, "2 cubed")
5² = 5 × 5 = 25            (5 squared)
10⁴ = 10,000
```

In Python: `2 ** 3` → 8.

### Exponent rules

| Rule | Example |
|---|---|
| a⁰ = 1 | 5⁰ = 1 |
| a¹ = a | 7¹ = 7 |
| aᵐ × aⁿ = aᵐ⁺ⁿ | 2² × 2³ = 2⁵ = 32 |
| aᵐ / aⁿ = aᵐ⁻ⁿ | 2⁵ / 2² = 2³ = 8 |
| (aᵐ)ⁿ = aᵐˣⁿ | (2²)³ = 2⁶ = 64 |
| a⁻ⁿ = 1 / aⁿ | 2⁻³ = 1/8 = 0.125 |
| a^(1/2) = √a | 9^(1/2) = 3 |

**Negative exponents** make small numbers: 10⁻³ = 0.001. You'll see learning rates (file 11) like 10⁻³ = 0.001 and 10⁻⁴ = 0.0001.

**Why squares appear everywhere in ML:** to measure error, we often square the difference between prediction and truth: (prediction − truth)². Squaring makes every error positive and punishes big errors much more: an error of 2 → 4, an error of 10 → 100. This is the **Mean Squared Error** (file 11).

---

## 10. Square roots

**Idea:** the **square root** of x (√x) is the number that, multiplied by itself, gives x.

√9 = 3 (because 3 × 3 = 9), √16 = 4, √2 ≈ 1.414

```python
import math
math.sqrt(16)   # 4.0
16 ** 0.5       # 4.0 (same thing)
```

Square roots undo squaring. They appear in:
- **standard deviation** (file 07): the square root of variance
- **distance** between points (file 05): √((x₂−x₁)² + (y₂−y₁)²)
- **RMSE** (file 13): root mean squared error
- **attention** in transformers (file 19): dividing by √d

---

## 11. Scientific notation

A way to write very big or very small numbers:

```
7,000,000,000     = 7 × 10⁹       (7 billion)
0.00012           = 1.2 × 10⁻⁴
```

In code and papers you'll often see **e-notation**: `7e9` = 7 × 10⁹, `1.2e-4` = 0.00012, `3e-4` = 0.0003 (a very common learning rate).

Here `e` just means "× 10 to the power". It's NOT the special number e from the next section. Confusing, but you'll get used to it.

**Big number words:** thousand (10³, K), million (10⁶, M), billion (10⁹, B), trillion (10¹², T). "Llama 3 8B" = 8 billion parameters. "Trained on 15T tokens" = 15 trillion tokens.

---

## 12. Exponential growth and the number e

### Exponential growth

When something **multiplies** by the same factor each step, it grows exponentially.

**Example:** bacteria double every hour. Start with 1:
| Hour | 0 | 1 | 2 | 3 | 4 | 10 | 20 |
|---|---|---|---|---|---|---|---|
| Count | 1 | 2 | 4 | 8 | 16 | 1,024 | 1,048,576 |

Formula: count = 2ᵗ (t = hours). Starts slow, then explodes.

**Compound interest:** $1000 at 10% per year: after t years = 1000 × 1.1ᵗ. After 7 years ≈ $1,949.

**Exponential decay:** multiplying by a number less than 1 each step: 1000 × 0.5ᵗ halves each step. Learning rate schedules (file 15) sometimes decay exponentially.

### The number e

**e ≈ 2.71828** is a special constant (like π). It shows up naturally whenever something grows continuously.

Where you'll meet it in AI:
- The function **eˣ** (also written **exp(x)**) is used in **softmax** (file 12/15/20), which turns scores into probabilities, and in the **sigmoid** function (section 16).
- Key property: eˣ is always positive, no matter what x is. e⁰ = 1, e¹ ≈ 2.718, e² ≈ 7.389, e⁻¹ ≈ 0.368, e⁻¹⁰ ≈ 0.0000454.

```python
import math
math.exp(1)    # 2.718281828...
math.exp(-2)   # 0.1353...
```

---

## 13. Logarithms

Logarithms scare people, but the idea is simple:

> **A logarithm answers: "what power do I need?"**

```
log₂(8) = 3     because 2³ = 8       "2 to what power gives 8?" → 3
log₁₀(1000) = 3 because 10³ = 1000
log₁₀(100) = 2  because 10² = 100
log₂(1) = 0     because 2⁰ = 1
```

**Log undoes exponent**, just as subtraction undoes addition and square root undoes squaring.

### Three common bases

| Written | Base | Name | Used in |
|---|---|---|---|
| log₂(x) | 2 | binary log | information/bits (file 07), Big-O (file 02) |
| log₁₀(x) | 10 | common log | counting digits, "orders of magnitude" |
| ln(x) or log(x) | e | natural log | almost everything in ML: loss functions, likelihood |

⚠️ In ML papers and in Python's `math.log` and `numpy.log`, plain **log means natural log (base e)**.

```python
import math
math.log(math.e)    # 1.0   (natural log)
math.log2(8)        # 3.0
math.log10(1000)    # 3.0
```

### Log rules (the ones you'll actually use)

| Rule | Meaning |
|---|---|
| log(a × b) = log(a) + log(b) | **multiplying becomes adding** ← the most important one |
| log(a / b) = log(a) − log(b) | dividing becomes subtracting |
| log(aⁿ) = n × log(a) | powers become multiplication |
| log(1) = 0 | |
| log of a number between 0 and 1 is **negative** | ln(0.5) ≈ −0.693, ln(0.01) ≈ −4.6 |
| log(0) is undefined (goes to −∞) | why code adds a tiny number to avoid log(0) |

### Why AI uses logs so much

**1. Turning multiplication into addition (avoids tiny numbers).**
The probability of a sentence is the product of many word probabilities, e.g. 0.1 × 0.05 × 0.2 × ... for 1,000 words. That becomes so tiny the computer rounds it to 0 (this is called **underflow**). Taking logs turns it into a sum: ln(0.1) + ln(0.05) + ... which is a manageable number. This is why you'll see "**log-probabilities**" or "**logprobs**" everywhere (files 07, 20).

**2. Loss functions.** The most common loss for classification, **cross-entropy** (file 07, 11), is basically −ln(probability the model gave to the correct answer):
- Model is confident and right: p = 0.9 → −ln(0.9) = **0.105** (small loss, good)
- Model is unsure: p = 0.5 → −ln(0.5) = **0.693**
- Model is confident and wrong: p = 0.01 → −ln(0.01) = **4.6** (big loss, bad)

So −ln punishes confident mistakes heavily. That's exactly what we want.

**3. Squashing huge ranges.** Incomes from $1,000 to $10,000,000 are hard to plot or model. log₁₀ turns them into 3 to 7. This is called a **log transform** (file 10) and it's used on skewed data.

### Log curve shape

```
y
 ▲
2┤                       ___________ ln(x)
1┤           ______------
0┼─────/─────────────────────► x
 │    / 1
-2┤  /
  │ |   (goes down to −∞ as x → 0)
```

- grows fast at first, then very slowly
- crosses 0 at x = 1
- only defined for x > 0

---

## 14. Summation (Σ) and product (Π) notation

### Σ (capital Greek "sigma") = "add them all up"

```
  n
  Σ  xᵢ   =  x₁ + x₂ + x₃ + ... + xₙ
 i=1
```

Read it as: "for i going from 1 to n, add up xᵢ".

It's exactly a for-loop with an accumulator ([file 02](02-python-programming.md#12-loops)):

```python
total = 0
for i in range(n):
    total += x[i]
# or simply: sum(x)
```

**Example:** x = [3, 5, 2, 6]
Σxᵢ = 3 + 5 + 2 + 6 = **16**

**More examples:**
- Σ xᵢ² = 9 + 25 + 4 + 36 = 74 (square each, then add)
- Σ (xᵢ − 4) = (−1) + 1 + (−2) + 2 = 0

### The mean (average), written with Σ

```
        1    n
  x̄  = ───   Σ  xᵢ
        n   i=1
```

x̄ is said "x-bar" and means the mean. In words: **add everything up, divide by how many there are**.

For [3, 5, 2, 6]: x̄ = 16 / 4 = **4**.

### Mean Squared Error, written with Σ (you'll see this in file 11)

```
         1    n
  MSE = ───   Σ  (yᵢ − ŷᵢ)²
         n   i=1
```

- yᵢ = true value for example i
- ŷᵢ = **"y-hat"**, the model's prediction for example i (a hat ^ usually means "estimated / predicted")
- In words: for each example, take the error, square it, add them all, divide by n.

**Example:** true y = [3, 5, 7], predicted ŷ = [2, 5, 9]
errors: 1, 0, −2 → squared: 1, 0, 4 → sum 5 → MSE = 5/3 ≈ **1.67**

```python
y = [3, 5, 7]; y_hat = [2, 5, 9]
mse = sum((a - b)**2 for a, b in zip(y, y_hat)) / len(y)   # 1.666...
```

### Π (capital Greek "pi") = "multiply them all"

```
  n
  Π  xᵢ   =  x₁ × x₂ × ... × xₙ
 i=1
```

Π(2, 3, 4) = 24. Used for multiplying probabilities (file 07). Remember: log turns Π into Σ.

---

## 15. Absolute value, min, max, argmax

### Absolute value |x|

The distance from zero, ignoring the sign: |−5| = 5, |3| = 3.

Used in **Mean Absolute Error** (MAE, file 13): average of |true − predicted|, and in **L1 regularisation** (file 11).

### min and max

- max(3, 7, 2) = 7 (the biggest value)
- min(3, 7, 2) = 2

### argmax and argmin

**argmax** gives **which input (position)** has the biggest value, not the value itself.

```
scores for [cat, dog, bird] = [0.1, 0.7, 0.2]
max    = 0.7          (the highest score)
argmax = dog (index 1) (which one has the highest score)
```

This is how a classifier picks its answer: argmax over the class probabilities. In Python: `numpy.argmax([0.1, 0.7, 0.2])` → `1`.

**argmin** is the opposite. Training a model is often written as:

```
best parameters = argmin  Loss(parameters)
```
"find the parameters that give the smallest loss". This one line summarises all of machine learning!

---

## 16. Common function shapes you'll meet in AI

| Function | Formula | Shape | Where used |
|---|---|---|---|
| Linear | y = mx + b | straight line | linear regression, neurons |
| Quadratic | y = x² | U-shape (parabola) | squared error loss |
| Exponential | y = eˣ | flat, then shoots up | softmax |
| Logarithm | y = ln(x) | shoots up, then flattens | loss functions, log transform |
| Sigmoid | y = 1 / (1 + e⁻ˣ) | S-shape, from 0 to 1 | probabilities, logistic regression (file 12) |
| ReLU | y = max(0, x) | flat at 0, then a straight line up | most popular neural network activation (file 15) |
| Tanh | y = tanh(x) | S-shape, from −1 to 1 | older neural networks, LSTMs |

### Sigmoid: the "squash to a probability" function

```
y
1 ┤                 ___________
  │              ／
0.5┤ ··········●···············
  │          ／
0 ┤_________／
  └──────────┼──────────► x
             0
```

Sigmoid takes **any** number (from −∞ to +∞) and squeezes it into the range 0 to 1, which is perfect for turning a score into a probability.

| x | −5 | −2 | 0 | 2 | 5 |
|---|---|---|---|---|---|
| sigmoid(x) | 0.007 | 0.12 | 0.5 | 0.88 | 0.993 |

```python
import math
def sigmoid(x):
    return 1 / (1 + math.exp(-x))
sigmoid(0)   # 0.5
sigmoid(2)   # 0.8808
```

### ReLU: "keep positives, zero out negatives"

```
y
  │        ／
  │      ／
  │    ／
──┼──／─────────► x
  0  (flat at zero for x < 0)
```

ReLU(−3) = 0, ReLU(0) = 0, ReLU(2.5) = 2.5. Simple, fast, and the workhorse of deep learning (file 15).

---

## 17. Inequalities, intervals and set notation

| Symbol | Meaning |
|---|---|
| < , > | less than, greater than |
| ≤ , ≥ | less than or equal, greater than or equal |
| ≠ | not equal |
| ≈ | approximately equal |
| ∈ | "is an element of / belongs to": x ∈ {1, 2, 3} |
| ∉ | not an element of |
| ℝ | the set of all real numbers |
| ℝⁿ | lists of n real numbers (vectors, file 05) |
| [a, b] | all numbers from a to b, **including** a and b |
| (a, b) | from a to b, **excluding** a and b |
| ∞ | infinity |
| → | "tends to / approaches", or "maps to" |
| ∀ | "for all" |
| ∃ | "there exists" |
| ⇒ | "implies" |
| := | "is defined as" |

**Example:** "p ∈ [0, 1]" means p is a number between 0 and 1 inclusive. That's every probability. "x ∈ ℝ⁷⁶⁸" means x is a list of 768 real numbers (a typical embedding size, file 18).

---

## 18. Greek letters cheat sheet

AI papers love Greek letters. Here are the common ones and what they usually mean:

| Letter | Name | Usual meaning in AI |
|---|---|---|
| α | alpha | learning rate; a weighting factor; significance level (file 07) |
| β | beta | momentum factors in Adam (file 15); a weighting factor (DPO, file 21) |
| γ (Γ) | gamma | discount factor in reinforcement learning (file 30); a scale parameter |
| δ (Δ) | delta | a small change; Δx = "change in x" |
| ε | epsilon | a tiny number (e.g. 1e-8) to avoid dividing by zero; privacy budget (file 29) |
| η | eta | learning rate |
| θ | theta | **all the model's parameters**, e.g. "f(x; θ)" = model f with parameters θ |
| λ | lambda | regularisation strength (file 11) |
| μ | mu | mean (average) |
| σ | sigma (lowercase) | standard deviation (file 07); also the sigmoid function |
| Σ | Sigma (capital) | summation; also a covariance matrix |
| π (Π) | pi | 3.14159...; a policy in reinforcement learning; product (capital) |
| ρ | rho | correlation |
| τ | tau | temperature (file 20) |
| φ, ψ | phi, psi | feature maps; network parameters |
| ∇ | nabla | **gradient** (file 06) |
| ∂ | partial | partial derivative (file 06) |

---

## 19. Check yourself

**Q1.** Compute 3 + 2 × (4 − 1)².
<details><summary>Answer</summary>Brackets: 4−1 = 3. Power: 3² = 9. Multiply: 2 × 9 = 18. Add: 3 + 18 = **21**.</details>

**Q2.** A line passes through (2, 5) and (6, 13). What's its slope and intercept?
<details><summary>Answer</summary>Slope = (13 − 5)/(6 − 2) = 8/4 = **2**. Using y = 2x + b at (2, 5): 5 = 4 + b → **b = 1**. Line: y = 2x + 1.</details>

**Q3.** What is log₂(32)? What is log₁₀(0.01)?
<details><summary>Answer</summary>log₂(32) = 5 (since 2⁵ = 32). log₁₀(0.01) = −2 (since 10⁻² = 0.01).</details>

**Q4.** Write 0.0003 in e-notation.
<details><summary>Answer</summary>`3e-4`</details>

**Q5.** For x = [2, 4, 6, 8], compute Σxᵢ and the mean x̄.
<details><summary>Answer</summary>Σ = 20, x̄ = 20 / 4 = 5.</details>

**Q6.** True values y = [10, 20], predictions ŷ = [12, 17]. Compute the MSE.
<details><summary>Answer</summary>Errors: −2, 3. Squared: 4, 9. Sum: 13. MSE = 13/2 = **6.5**.</details>

**Q7.** Which gives a bigger loss: −ln(0.8) or −ln(0.1)? Why does that make sense?
<details><summary>Answer</summary>−ln(0.8) ≈ 0.22, −ln(0.1) ≈ 2.30. The second is bigger: giving only 10% probability to the correct answer is a bad prediction and deserves a bigger penalty.</details>

**Q8.** A classifier outputs probabilities [0.2, 0.05, 0.75] for [cat, dog, rabbit]. What are the max and the argmax?
<details><summary>Answer</summary>max = 0.75; argmax = index 2 = rabbit.</details>

**Q9.** What is sigmoid(0)? ReLU(−4)? ReLU(4)?
<details><summary>Answer</summary>0.5, 0, 4.</details>

**Q10.** Why do ML systems add log-probabilities instead of multiplying probabilities?
<details><summary>Answer</summary>Multiplying many small probabilities gives a number so tiny the computer rounds it to zero (underflow). Logs turn the product into a sum of manageable numbers (log(a×b) = log a + log b).</details>

---

## 20. New words in this file

| Word | Meaning |
|---|---|
| Integer / real number | Whole number / any number on the number line |
| Number line | Line showing numbers in order |
| Fraction, decimal, percentage | Three ways to write parts of a whole |
| Percentage change | (new − old)/old × 100 |
| Ratio | Comparison of two amounts (e.g. 99:1) |
| BODMAS / PEMDAS | Order of operations |
| Variable (maths) | Letter standing for a number |
| Formula | Rule written with variables |
| Subscript (xᵢ) | Label for the i-th item |
| Equation / solving | Statement of equality / finding the unknown |
| Function f(x) | Rule mapping each input to one output |
| Domain / range | Allowed inputs / possible outputs |
| Composition f(g(x)) | Apply g, then f |
| x-axis, y-axis, origin, coordinates (x, y) | Parts of a graph |
| Slope (m) | Rise over run: steepness |
| Intercept (b) | y-value where the line crosses the y-axis |
| Weight (w) and bias (b) | ML names for slope and intercept |
| y = mx + b | Equation of a straight line |
| Exponent / power | Repeated multiplication |
| Square / square root | x × x / the number that squared gives x |
| Scientific / e-notation | 7 × 10⁹ / `7e9` |
| K, M, B, T | Thousand, million, billion, trillion |
| Exponential growth / decay | Repeatedly multiplying by more / less than 1 |
| e ≈ 2.718, exp(x) | Special constant / e to the power x |
| Logarithm (log₂, log₁₀, ln) | "What power do I need?" |
| Underflow | Numbers too tiny for the computer, rounded to 0 |
| Log-probability (logprob) | ln of a probability |
| Log transform | Applying log to squash a wide range |
| Σ (summation) / Π (product) | Add up / multiply a sequence |
| Mean (x̄, μ) | Average: sum ÷ count |
| ŷ ("y-hat") | Predicted value |
| MSE | Mean Squared Error: average of squared errors |
| Absolute value \|x\| | Distance from zero |
| argmax / argmin | Position of the biggest / smallest value |
| Quadratic / parabola | x² / U-shaped curve |
| Sigmoid | S-curve squashing any number into 0 to 1 |
| ReLU | max(0, x) |
| Tanh | S-curve from −1 to 1 |
| ∈, ℝ, ℝⁿ, [a, b], ≈, ∞, ∀, ∃ | Set and logic symbols |
| θ (theta) | All of a model's parameters |
| Greek letters (α, β, λ, μ, σ, η, ε, τ, ∇, ∂) | Common symbols, see the table |

**Next:** [05-math-linear-algebra.md](05-math-linear-algebra.md)
