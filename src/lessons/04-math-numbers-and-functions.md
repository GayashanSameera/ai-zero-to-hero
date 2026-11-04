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

**Why it exists:** a computer must know what kind of number it is storing, and a model must know what kind of values it can use. Counting students needs whole numbers. Measuring a weight like 0.034 needs real numbers.

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

### Worked example: which kind is it?

| Value | Natural | Integer | Rational | Real |
|---|---|---|---|---|
| 7 | yes | yes | yes (7/1) | yes |
| −4 | no | yes | yes | yes |
| 0.75 | no | no | yes (3/4) | yes |
| √2 | no | no | no | yes |

Every row ticks "real". Each kind sits inside the next: natural ⊂ integers ⊂ rational ⊂ real.

**Negative numbers in Rs.:** if your account has Rs. 1,000 and you pay Rs. 3,500 on a card, your balance is 1,000 − 3,500 = **−2,500** (overdrawn). Paying off Rs. 2,500 is "subtracting a negative": −2,500 − (−2,500) = 0.

**Where you'll meet it in real work:** in a model, counts (number of words) are integers, but weights and probabilities are real numbers that can be negative. A weight of −1.27 means "this feature pushes the answer **down**".

**Common mistakes:**
- Thinking −3 is "bigger" than 2 because 3 is bigger than 2. On the number line, −3 is to the left of 2, so it is smaller.
- Forgetting that two negatives multiplied give a positive: (−4) × (−5) = 20.
- Treating 0.1 + 0.2 as exactly 0.3 in code. Computers store real numbers approximately (Python prints `0.30000000000000004`).

> **සිංහලෙන්:** Numbers වර්ග කිහිපයක් තියෙනවා: 1, 2, 3 වගේ ගණන් කරන ඒවා, −2, 0 වගේ ඍණ සහිත පූර්ණ සංඛ්‍යා, 0.75 වගේ භාග, සහ √2 වගේ අවසානයක් නැති දශම. AI model එකක ඇතුළේ weights වැඩිපුරම තියෙන්නේ 0.034 හෝ −1.27 වගේ real numbers. ඍණ අගයක් කියන්නේ බැංකුවේ overdraft එකක් වගේ, ඔයාගේ ගිණුමේ රු. 1,000ක් තියෙද්දී රු. 3,500ක් ගෙව්වොත් ශේෂය −2,500යි. ඍණ දෙකක් ගුණ කළාම ධන වෙනවා, (−4) × (−5) = 20.

---

## 2. Fractions, decimals, percentages

**Why it exists:** a model's accuracy, a probability and a discount are all "a part of a whole". Fractions, decimals and percentages are three spellings of that one idea, and you must switch between them quickly.

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

### Worked example: a discount

A phone costs Rs. 2,400 and the shop gives 15% off.
- 15% = 0.15
- Discount = 0.15 × 2,400 = Rs. 360
- You pay 2,400 − 360 = **Rs. 2,040**

### Worked example: percentage change goes up and down differently

Sales rise from 200 to 250: (250 − 200) / 200 × 100 = **+25%**.
Sales fall back from 250 to 200: (200 − 250) / 250 × 100 = −50/250 × 100 = **−20%**.
Going up 25% and coming down 20% are the same change, because the "old" value in the bottom of the fraction is different each time.

### Worked example: why accuracy can lie

A dataset has 990 normal and 10 fraud transactions (ratio 99:1). A lazy model that says "normal" for everything is right on 990 of 1,000: 990/1,000 = 0.99 = **99% accuracy**, yet it catches **0%** of the fraud. Accuracy alone is a poor guide on imbalanced data.

**Where you'll meet it in real work:** a bank reports "fraud is 1% of transactions", a telecom reports "churn went from 4% to 5%" (that is +1 **percentage point**, but a 25% **relative** increase: (5 − 4)/4 × 100).

**Common mistakes:**
- Mixing percentage points and percent. 4% to 5% is +1 point, not +1%.
- Dividing by the **new** value instead of the old one in percentage change.
- Writing 8% as 8 in a formula. Convert first: 8% = 0.08.

**Exam angle:** evaluation questions use the imbalanced-data trap above. When classes are 99:1, high accuracy does not mean a useful model; precision, recall and F1 matter (file 13).

> **සිංහලෙන්:** භාගයක්, දශමයක් සහ ප්‍රතිශතයක් කියන්නේ එකම දේ ලියන ක්‍රම තුනක්. 3/4 = 0.75 = 75%. ප්‍රතිශතයක් දශමයකට හරවන්න 100න් බෙදන්න, 8% = 0.08. රු. 2,400ක phone එකකට 15% වට්ටමක් නම් 0.15 × 2,400 = රු. 360, ඒ නිසා ගෙවන්නේ රු. 2,040යි. Transactions 1,000කින් 990ක් සාමාන්‍ය, 10ක් fraud නම් "හැමදේම සාමාන්‍යයි" කියන model එකට accuracy 99% ලැබෙනවා, ඒත් fraud එකක්වත් අල්ලන්නේ නෑ. ඒ නිසා ප්‍රතිශතයක් බලද්දී ඒක මොකක් ගැනද කියලා හොඳට බලන්න.

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

### Worked example: a trickier one

Calculate 8 − 2 × 3 + 4 ÷ 2.
1. Multiply and divide first, left to right: 2 × 3 = 6 and 4 ÷ 2 = 2, giving 8 − 6 + 2.
2. Add and subtract left to right: 8 − 6 = 2, then 2 + 2 = **4**.

With brackets the answer changes: (8 − 2) × 3 + 4 ÷ 2 = 6 × 3 + 2 = 18 + 2 = **20**.

**Common mistakes:**
- Doing everything strictly left to right. 2 + 3 × 4 is 14 (not 20), because multiplication goes first.
- Multiplication does **not** beat division. They are equal rank, so go left to right: 12 ÷ 3 × 2 = 4 × 2 = **8**, not 12 ÷ 6 = 2.
- Negative squares: in Python and in maths, −3² means −(3²) = **−9**, but (−3)² = **9**.

**Where you'll meet it in real work:** every formula in a paper, such as `(prediction − truth)²`, depends on order. A wrong bracket in your code gives a model that runs but learns the wrong thing, with no error message.

> **සිංහලෙන්:** Calculation එකක පියවර කිහිපයක් තියෙනවා නම් අනුපිළිවෙල තියෙනවා: මුලින්ම වරහන්, ඊට පස්සේ බලය (powers), ඊළඟට ගුණ කිරීම සහ බෙදීම වමේ ඉඳන් දකුණට, අන්තිමට එකතු කිරීම සහ අඩු කිරීම. 8 − 2 × 3 + 4 ÷ 2 ඇත්තටම 8 − 6 + 2 = 4, ඒත් වරහන් දාලා (8 − 2) × 3 + 4 ÷ 2 කළොත් 20 වෙනවා. Python වලත් නීතිය එකම නිසා code එකේ වරහන් වැරදුණොත් error එකක් එන්නේ නෑ, ඒත් model එක වැරදියට ඉගෙන ගන්නවා.

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

**Why it exists:** a formula has to work for every house, every student and every day, not just one. Letters let us write the rule once and plug in different numbers.

### Worked example: a house-price formula

Suppose a simple model says: **price (in lakhs of rupees) = 0.2 × size + 20**, where size is in square feet.

| size (sq ft) | calculation | price (lakhs) |
|---|---|---|
| 1,000 | 0.2 × 1,000 + 20 = 200 + 20 | 220 |
| 1,500 | 0.2 × 1,500 + 20 = 300 + 20 | 320 |
| 2,000 | 0.2 × 2,000 + 20 = 400 + 20 | 420 |

Rs. 320 lakhs is Rs. 32 million. The numbers 0.2 and 20 are the model's **parameters**; `size` is its input. These are illustrative numbers, not real market prices.

**Reading subscripts:** for a house described by features x₁ = size = 1,500, x₂ = bedrooms = 3, x₃ = age = 10, the list is `x = [1500, 3, 10]`. Then x₂ = 3 in maths, and `x[1]` in Python (Python starts counting at 0).

**Where you'll meet it in real work:** every ML paper writes a model as a formula with such letters. Being able to read `ŷ = w₁x₁ + w₂x₂ + b` as "predicted price = weight × size + weight × bedrooms + bias" is half the battle.

**Common mistakes:**
- Confusing x₂ (the second item) with x² (x squared). The position of the little number tells you which.
- Reading `3x` as "3 and x" instead of 3 × x.
- Forgetting that maths counts from 1 and Python from 0.

> **සිංහලෙන්:** Variable එකක් කියන්නේ තවම දන්නේ නැති හෝ වෙනස් වෙන අගයක් වෙනුවට දාන අකුරක්. Formula එකක් එක පාරක් ලියලා ඕනෑම අගයක් දාන්න පුළුවන්. උදාහරණයක් විදිහට ගෙයක මිල (ලක්ෂ වලින්) = 0.2 × size + 20 කියමු. size එක 1,500 නම් 0.2 × 1,500 + 20 = 320, ඒ කියන්නේ ලක්ෂ 320යි. x₁, x₂ වගේ පහළින් ලියන පොඩි අංක වලින් කියන්නේ ඒක කීවෙනි එකද කියලා, ඒත් Python වල ගණන් කරන්නේ 0න්, ඒක අමතක කරන්න එපා.

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

### Worked example: unknowns on both sides

Solve 3x + 4 = x + 10.
1. Subtract x from both sides: 2x + 4 = 10.
2. Subtract 4 from both sides: 2x = 6.
3. Divide both sides by 2: x = **3**.
4. Check: left 3(3) + 4 = 13, right 3 + 10 = 13 ✓

### Worked example: a word problem

A tuk-tuk charges Rs. 100 to start plus Rs. 80 per km (illustrative numbers). You paid Rs. 900. How far did you go?
- Equation: 80 × km + 100 = 900
- 80 × km = 800 (subtract 100 from both sides)
- km = 800 / 80 = **10**
- Check: 80 × 10 + 100 = 900 ✓

**Where you'll meet it in real work:** "what learning rate would make this step exactly 0.5?" or "how many epochs until loss reaches 0.1?" are equations. Checking your answer by plugging it back in is a habit that saves hours of debugging.

**Common mistakes:**
- Doing something to one side only. Whatever you do to the left, do to the right.
- Sign slips when moving a term across the `=`. Moving +4 means subtracting 4 from both sides, so it appears as −4.
- Skipping the check. It takes ten seconds.

> **සිංහලෙන්:** Equation එකක් කියන්නේ දෙපැත්ත සමාන බව කියන වාක්‍යයක්. විසඳන්න තියෙන්නේ තරාදියක් හරියට තියාගන්න වගේ, එක පැත්තකට යමක් කළොත් අනිත් පැත්තටත් ඒක කරන්න ඕනේ. 2x + 3 = 11 නම් දෙපැත්තෙන්ම 3ක් අඩු කළාම 2x = 8, දෙකෙන් බෙදුවාම x = 4. ඇත්ත වෙලාවෙම පරීක්ෂා කරන්න අමතක කරන්න එපා: 2 × 4 + 3 = 11 හරි. Tuk-tuk එකක් රු. 100ට පටන් අරන් කිලෝමීටරයකට රු. 80ක් අය කරනවා නම්, රු. 900ක් ගෙව්වා කියන්නේ කිලෝමීටර් 10ක් ගිහින් කියලා මේ ක්‍රමයෙන් හොයාගන්න පුළුවන්.

---

## 6. Functions

**Why it exists:** the world is full of rules that turn something into something else: kilometres into fare, house details into price, a sentence into a sentiment. A function is the clean way to write any such rule, and AI is about *finding* those rules from data.

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

### Worked example: a function as a table

f(x) = x² − 1

| x | calculation | f(x) |
|---|---|---|
| −2 | (−2)² − 1 = 4 − 1 | 3 |
| 0 | 0 − 1 | −1 |
| 3 | 9 − 1 | 8 |

One input gives exactly one output. Different inputs may give the same output (−2 and 2 both give 3). That is allowed, but one input giving two outputs is not.

**Domain example:** f(x) = 1/x cannot take x = 0 (division by zero), so its domain is "every number except 0".

### Worked example: order matters in composition

Let g(x) = x + 1 and f(x) = 2x. Then
- f(g(3)): g(3) = 4, then f(4) = **8**
- g(f(3)): f(3) = 6, then g(6) = **7**

Same functions, different order, different answers. A neural network is a long chain of such steps, so the order of layers matters.

**Where you'll meet it in real work:** a spam filter is a function from an email to a number between 0 and 1. A translation model is a function from English text to Sinhala text. In both cases "training" means finding the function.

**Common mistakes:**
- Reading f(x) as "f times x". It means "f applied to x".
- Thinking a function must be a formula. A trained model is a function even if nobody can write it on paper.

**Exam angle:** NCA-GENL questions describe a network as layers of functions, with the output of one layer being the input of the next. That is composition.

> **සිංහලෙන්:** Function එකක් කියන්නේ input එකක් දුන්නාම හරියටම එක output එකක් දෙන නීතියක්, vending machine එකක B3 එබුවාම හැමවිටම එකම බිස්කට් එක වැටෙනවා වගේ. f(x) = 2x + 1 නම් f(3) = 7. ML model එකක් කියන්නේ මේ වගේ function එකක්, ගෙයක size, කාමර ගණන දුන්නාම මිල දෙනවා, අපි training කරන්නේ හොඳම function එක හොයන්න. Neural network එකක් කියන්නේ පොඩි function ගොඩක් එකින් එක ඇදලා දාපු දාමයක්, ඒ නිසා පිළිවෙළ වැදගත්. g(x) = x + 1, f(x) = 2x නම් f(g(3)) = 8 ඒත් g(f(3)) = 7.

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

### Worked example: plotting by hand

Graph y = x − 1. Pick x values and compute y:

| x | y = x − 1 | point |
|---|---|---|
| −1 | −2 | (−1, −2) |
| 0 | −1 | (0, −1) |
| 1 | 0 | (1, 0) |
| 2 | 1 | (2, 1) |

Plot the four points and they line up on a straight line that crosses the x-axis at x = 1 (where y = 0) and the y-axis at y = −1.

### Worked example: a loss curve

During training you record the loss after each epoch: epoch 1 gives 2.0, epoch 2 gives 1.2, epoch 3 gives 0.8. As points they are (1, 2.0), (2, 1.2), (3, 0.8). Joined up, the curve slopes **downwards**, which is what you want to see.

```
loss
2.0 ┤•
1.2 ┤    •
0.8 ┤        •
    └──┬────┬────┬──► epoch
       1    2    3
```

**Where you'll meet it in real work:** the training loss curve, the accuracy-versus-epoch plot and the learning-rate schedule are all graphs of a function. Reading them quickly is a core skill.

**Common mistakes:**
- Swapping the two numbers in (x, y). The first is always horizontal.
- Joining points with a straight line when the real function curves. Use more points.
- Forgetting axis labels, so nobody knows what the graph shows.

> **සිංහලෙන්:** Graph එකක් කියන්නේ function එකක පින්තූරයක්. තිරස් අක්ෂය (x) input එක, සිරස් අක්ෂය (y) output එක, ඒ දෙක හමුවෙන තැන (0, 0). (3, 4) කියන point එකට යන්න මුලින් දකුණට 3යි, ඊට පස්සේ උඩට 4යි. y = x − 1 ඇඳිය හැක්කේ x = −1, 0, 1, 2 වලට y = −2, −1, 0, 1 හොයලා ඒ point ටික යා කිරීමෙන්. Training එක කරද්දී epoch එකෙන් epoch එකට loss එක 2.0, 1.2, 0.8 කියලා අඩු වෙනවා නම් graph එක පහළට බෑවුම් වෙලා තියෙනවා, ඒක තමයි අපිට ඕනේ.

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

### Worked example: a fare line

Suppose a tuk-tuk charges Rs. 100 to start and Rs. 80 per km (illustrative numbers), so **fare = 80 × km + 100**.
- slope m = 80: each extra km adds Rs. 80
- intercept b = 100: the fare at 0 km
- 7 km: 80 × 7 + 100 = 560 + 100 = **Rs. 660**

Going the other way, a Rs. 900 fare means 80 × km + 100 = 900, so km = 800 / 80 = 10.

### Worked example: finding the line through two points

The line passes through (2, 5) and (6, 13).
1. Slope: m = (13 − 5) / (6 − 2) = 8 / 4 = **2**.
2. Plug one point into y = 2x + b: 5 = 2 × 2 + b, so b = 5 − 4 = **1**.
3. The line is y = 2x + 1. Check with the other point: 2 × 6 + 1 = 13 ✓

### Worked example: one neuron

A neuron with two inputs computes y = w₁x₁ + w₂x₂ + b. Take w₁ = 0.5, w₂ = 2, b = 1 and inputs x₁ = 4, x₂ = 3:
y = 0.5 × 4 + 2 × 3 + 1 = 2 + 6 + 1 = **9**.
If w₂ were −2 instead, y = 2 − 6 + 1 = −3, so the sign of a weight decides whether a feature raises or lowers the answer.

**Where you'll meet it in real work:** linear regression predicts house prices, delivery times or electricity bills with exactly this formula. Every layer of a neural network, and every layer inside a transformer, starts with a "weights times inputs plus bias" step.

**Common mistakes:**
- Mixing the order in the slope formula: use (y₂ − y₁) / (x₂ − x₁), with the same point first on top and bottom. Swapping only one of them flips the sign.
- Reading the intercept off the wrong place. It is y when **x = 0**.
- Thinking a big weight is always important. If the feature is measured in huge units, its weight will be small. This is one reason we scale features (file 10).

**Exam angle:** the linear layer y = Wx + b is the basic building block of neural networks and transformers. Know what weights and bias are.

> **සිංහලෙන්:** සරල රේඛාවක සමීකරණය y = m·x + b. m කියන්නේ slope එක, ඒ කියන්නේ x එක 1කින් වැඩි වෙනකොට y කොච්චර වැඩි වෙනවද කියන එක. b කියන්නේ x = 0 වෙද්දී y අගය. Tuk-tuk එක රු. 100ට පටන් අරන් කිලෝමීටරයට රු. 80ක් නම් fare = 80 × km + 100, ඒ නිසා කිලෝමීටර් 7ට රු. 660යි. ML වලදී මේ m සහ b වලට කියන්නේ weight සහ bias කියලා. Neuron එකක w₁ = 0.5, w₂ = 2, b = 1, inputs 4 සහ 3 නම් output එක 0.5×4 + 2×3 + 1 = 9. Weight එක ඍණ නම් ඒ feature එක answer එක අඩු කරනවා.

---

## 9. Exponents (powers)

**Why it exists:** repeated multiplication gets long to write (2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2). Exponents compress it into 2¹⁰ and let us talk about huge and tiny numbers in a few characters.

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

### Worked example: powers of 2 you will see everywhere

| Power | Value | Where it appears |
|---|---|---|
| 2⁸ | 256 | pixel values 0 to 255, batch sizes |
| 2¹⁰ | 1,024 | "1 K" in computers |
| 2²⁰ | 1,048,576 | about a million |
| 2³⁰ | 1,073,741,824 | about a billion (1 GB of memory) |

Rule check: 2⁵ × 2³ = 2⁵⁺³ = 2⁸ = 256, and 32 × 8 = 256 ✓.

### Worked example: why squaring punishes big errors

| Error | Squared |
|---|---|
| 1 | 1 |
| 2 | 4 |
| 10 | 100 |

The error became 5 times larger (2 → 10) but the squared error became **25** times larger (4 → 100). A single large mistake dominates the total, so a model trained with squared error works hard to fix its worst mistakes.

**Where you'll meet it in real work:** learning rates like 10⁻³, parameter counts like 7 × 10⁹, and memory sizes in powers of 2.

**Common mistakes:**
- Reading 2³ as 2 × 3 = 6. It is 2 × 2 × 2 = 8.
- (a + b)² is **not** a² + b². For a = 3, b = 4: (3 + 4)² = 49, but 9 + 16 = 25.
- Forgetting that a negative exponent makes a number *small*, not negative: 2⁻³ = 0.125.
- Adding powers wrongly: 2² + 2³ = 4 + 8 = 12, not 2⁵.

> **සිංහලෙන්:** Exponent එකක් කියන්නේ කී පාරක් ගුණ කරනවද කියන එක. 2³ = 2 × 2 × 2 = 8, ඒ 2 × 3 = 6 නෙවෙයි. 2¹⁰ = 1,024, ඒකයි "1 K" කියලා computer එකේ කියන්නේ. ඍණ බලයක් අංකය පොඩි කරනවා, 2⁻³ = 1/8 = 0.125. Squared error එකේදී error එක 2ක් නම් 4යි, 10ක් නම් 100යි, ඒ කියන්නේ error එක 5 ගුණයක් වැඩි වුණාම squared error එක 25 ගුණයක් වැඩි වෙනවා. ඒ නිසා ලොකු වැරදි වලට model එක වැඩියෙන් බය වෙනවා. (3 + 4)² = 49, ඒත් 3² + 4² = 25, ඒක වැරදීමක් නිතර වෙනවා.

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

### Worked example: root and distance

√49 = 7 because 7 × 7 = 49. For √2 ≈ 1.414, check: 1.414 × 1.414 ≈ 1.999 ✓.

**Distance** from (1, 2) to (4, 6): the horizontal gap is 4 − 1 = 3 and the vertical gap is 6 − 2 = 4, so distance = √(3² + 4²) = √(9 + 16) = √25 = **5**. This is the same as the 3-4-5 right triangle.

### Worked example: RMSE

If the MSE of a model is 6.5, then RMSE = √6.5 ≈ **2.55**. RMSE is back in the same units as the target (rupees, minutes, kg), so it is easier to explain: "on average we are off by roughly 2.55".

### Worked example: attention scaling

In a transformer, attention scores are divided by √d, where d is the size of the key vectors. With d = 64, √64 = 8, so every score is divided by 8. Without this, large d makes scores very large and the softmax (section 12) becomes extremely sharp.

**Where you'll meet it in real work:** finding the most similar items by distance (a "nearest neighbour" search for similar products or documents), and reporting errors in RMSE.

**Common mistakes:**
- √(a + b) is not √a + √b. √(9 + 16) = 5, but 3 + 4 = 7.
- Taking the square root of a negative number. √(−4) is not a real number, so code returns `nan` or an error.
- Forgetting that every positive number has two roots: 3 × 3 = 9 and (−3) × (−3) = 9. The √ symbol means the positive one.

**Exam angle:** the √d scaling in "scaled dot-product attention" is a standard transformer question.

> **සිංහලෙන්:** Square root එකක් කියන්නේ තමන්ගෙන්ම ගුණ කළාම ලැබෙන අංකය හොයන එක. √49 = 7 මොකද 7 × 7 = 49. (1, 2) සහ (4, 6) කියන ලක්ෂ දෙක අතර දුර √(3² + 4²) = √25 = 5. MSE එක 6.5 නම් RMSE එක √6.5 ≈ 2.55, ඒක මුල් units වලම තියෙන නිසා "සාමාන්‍යයෙන් වැරදෙන්නේ 2.55ක්" කියලා කියන්න ලේසියි. Transformers වලදී attention scores √d න් බෙදනවා, d = 64 නම් 8න් බෙදනවා. √(9 + 16) = 5, ඒත් √9 + √16 = 7, ඒ නිසා root එක එකතුවට බෙදන්න බෑ.

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

### Worked example: converting both ways

- 3.2e6 = 3.2 × 10⁶ = 3,200,000 (move the decimal point **6 places right**)
- 4.5e-3 = 4.5 × 10⁻³ = 0.0045 (move **3 places left**)
- 0.00025 = 2.5 × 10⁻⁴ = `2.5e-4`
- 15T tokens = 15 × 10¹² = 1.5 × 10¹³ tokens

### Worked example: how much memory does a model need?

A "7B" model has 7 × 10⁹ parameters. In 16-bit format each parameter takes 2 bytes, so the weights alone need 7 × 10⁹ × 2 = 14 × 10⁹ bytes = **about 14 GB**. At 4 bytes per parameter (32-bit) it would be about 28 GB. This is why a 7B model needs a good GPU and why quantisation (storing numbers with fewer bits) is popular.

| Notation | Meaning | Typical use |
|---|---|---|
| 1e-3 | 0.001 | learning rate |
| 3e-4 | 0.0003 | common learning rate |
| 1e-8 | 0.00000001 | epsilon for stability |
| 7e9 | 7,000,000,000 | parameter count |

**Where you'll meet it in real work:** model cards list parameters as "8B", GPUs are described by memory in GB, and training configs have `learning_rate: 3e-4`.

**Common mistakes:**
- Moving the decimal the wrong way for negative exponents: 1e-3 is small (0.001), 1e3 is big (1,000).
- Confusing e-notation (`1e-4` = 10⁻⁴) with Euler's number e ≈ 2.718.
- Forgetting bytes versus bits: 1 byte = 8 bits.

**Exam angle:** NCA-GENL deployment questions estimate GPU memory from parameter count and precision (bytes per parameter). The 7B × 2 bytes ≈ 14 GB calculation is the standard rule of thumb for weights only (activations and the KV cache need extra).

> **සිංහලෙන්:** ගොඩක් ලොකු හෝ පොඩි අංක ලියන්න scientific notation පාවිච්චි කරනවා. 7e9 කියන්නේ 7 × 10⁹, ඒ කියන්නේ බිලියන 7. 3e-4 කියන්නේ 0.0003, ඒක learning rate එකක් විදිහට නිතර දකින්න ලැබෙනවා. මේ e කියන්නේ "× 10 බලය" කියන එක විතරයි, ඒක ඊළඟ කොටසේ e = 2.718 නෙවෙයි. "7B model" එකක parameters බිලියන 7ක් තියෙනවා, 16-bit වලින් එකකට bytes 2ක් ගත්තොත් 7 × 10⁹ × 2 = ගිගාබයිට් 14ක් විතර memory ඕනේ. ඒ නිසා ලොකු model එකකට හොඳ GPU එකක් ඕනේ.

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

### Worked example: compound growth with rupees

Rs. 100,000 grows at 10% per year, so multiply by 1.1 each year:

| Year | Calculation | Value (Rs.) |
|---|---|---|
| 0 | start | 100,000 |
| 1 | × 1.1 | 110,000 |
| 2 | × 1.1 | 121,000 |
| 3 | × 1.1 | 133,100 |
| 7 | 100,000 × 1.1⁷ | about 194,872 |

(1.1⁷ ≈ 1.9487, so the money almost doubles in 7 years.) Exponential decay is the same idea with a factor below 1: a learning rate of 0.1 halved each step is 0.1, 0.05, 0.025, 0.0125.

### Worked example: softmax with real numbers

A model gives scores (called **logits**) 2, 1 and 0 for the classes cat, dog and bird. Softmax turns scores into probabilities:
1. Take eˣ of each score: e² ≈ 7.389, e¹ ≈ 2.718, e⁰ = 1.
2. Add them: 7.389 + 2.718 + 1 = 11.107.
3. Divide each by the total: 7.389 / 11.107 ≈ **0.665**, 2.718 / 11.107 ≈ **0.245**, 1 / 11.107 ≈ **0.090**.

The three probabilities add up to 1 (0.665 + 0.245 + 0.090 = 1.000), and the highest score gets the biggest share.

### Worked example: temperature

LLMs divide the scores by a **temperature** τ before softmax. With τ = 0.5 the scores 2, 1, 0 become 4, 2, 0:
e⁴ ≈ 54.598, e² ≈ 7.389, e⁰ = 1, total ≈ 62.987, giving probabilities about **0.867, 0.117, 0.016**.
So a lower temperature makes the top choice more dominant (more predictable text), while a higher temperature flattens the probabilities (more varied text).

**Where you'll meet it in real work:** every classifier and every LLM ends in softmax. The chatbot choosing its next word is sampling from probabilities like the ones above.

**Common mistakes:**
- Thinking exponential growth is "fast steady growth". It starts slow and then explodes.
- Confusing e-notation with the number e (section 11).
- Believing eˣ can be negative or zero. It is always positive.

**Exam angle:** softmax and temperature are standard in inference-parameter questions: low temperature gives focused, repeatable output, high temperature gives creative, varied output.

> **සිංහලෙන්:** Exponential growth කියන්නේ හැම පියවරකදීම එකම අගයකින් ගුණ වීම. රු. 100,000ක් අවුරුද්දකට 10%කින් වැඩි වෙනවා නම් අවුරුදු 7කින් 100,000 × 1.1⁷ ≈ රු. 194,872ක් වෙනවා, ඒ කියන්නේ පාහේ දෙගුණයක්. e ≈ 2.718 කියන්නේ π වගේ විශේෂ අංකයක්, eˣ හැමවිටම ධනයි. Softmax එකේදී scores 2, 1, 0 ක් තියෙනවා නම් e² = 7.389, e¹ = 2.718, e⁰ = 1, එකතුව 11.107, ඒ නිසා probabilities 0.665, 0.245, 0.090 වෙනවා. LLM එකක temperature අඩු කළොත් උසම score එකේ probability එක තවත් වැඩි වෙනවා, ඒ නිසා උත්තරේ වැඩි ස්ථාවර වෙනවා.

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

### Worked example: product becomes sum

Probabilities of three words: 0.1, 0.05, 0.2.
- Product: 0.1 × 0.05 × 0.2 = 0.001, and ln(0.001) ≈ −6.908.
- Sum of logs: ln(0.1) + ln(0.05) + ln(0.2) ≈ −2.303 + (−2.996) + (−1.609) = **−6.908** ✓

Both routes agree. Now imagine 1,000 words each with probability 0.1. The product is 10⁻¹⁰⁰⁰, which is smaller than the smallest number a standard 64-bit float can hold (about 10⁻³⁰⁸), so the computer stores **0** (underflow). The sum of logs is simply 1,000 × (−2.303) = **−2,303**, which is perfectly safe.

### Worked example: cross-entropy and perplexity

If a model gives the correct next word probability 0.25, the loss is −ln(0.25) = ln(4) ≈ **1.386**. If the average loss over a text is 2.0, then **perplexity** = e² ≈ 7.39, roughly "the model is as unsure as if it were choosing among about 7 equally likely words". Lower is better.

### Worked example: bits

log₂(8) = 3: you need 3 yes/no questions (3 bits) to pick one of 8 equally likely options. Picking one of 1,024 needs log₂(1,024) = 10 bits.

**Where you'll meet it in real work:** loss values printed during training, "logprobs" returned by LLM APIs, and perplexity when comparing language models.

**Common mistakes:**
- Taking log of 0 or of a negative number. It is undefined, so code adds a tiny ε (like 1e-8) first.
- Assuming `log` means base 10. In Python and ML, `log` is the natural log ln.
- log(a + b) is **not** log(a) + log(b). The rule is for products: log(a × b).
- Forgetting that logs of numbers between 0 and 1 are negative, which is why the loss has a minus sign: −ln(p).

**Exam angle:** cross-entropy loss, log-probabilities and perplexity are all in the evaluation and training domains. Know that lower loss and lower perplexity are better, and that −ln(p) grows sharply as p shrinks.

> **සිංහලෙන්:** Logarithm එකක් අහන්නේ "මොන බලයද ඕනේ?" කියලා. log₂(8) = 3, මොකද 2³ = 8. ML වල plain log කියන්නේ ln (base e). ලොකුම වැදගත්කම තමයි ගුණ කිරීම එකතු කිරීමක් කරන එක: ln(0.1) + ln(0.05) + ln(0.2) = −6.908, ඒක ln(0.001)ටම සමානයි. වචන 1,000ක වාක්‍යයක probabilities ගුණ කළොත් අංකය computer එකට තබාගන්න බැරි තරම් පොඩි වෙලා 0 වෙනවා (underflow), ඒත් logs එකතු කළොත් −2,303 වගේ ආරක්ෂිත අංකයක් ලැබෙනවා. Model එක හරි උත්තරයට 0.25ක් දුන්නොත් loss එක −ln(0.25) ≈ 1.386, 0.01ක් දුන්නොත් 4.6ක් වෙනවා, ඒ කියන්නේ විශ්වාසයෙන් වැරදුණොත් දඬුවම ලොකුයි.

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

### Worked example: variance step by step (a preview)

Exam marks: [60, 75, 90].
1. Mean x̄ = (60 + 75 + 90) / 3 = 225 / 3 = **75**.
2. Differences from the mean: −15, 0, 15. These add up to 0, which is why we square them.
3. Squares: 225, 0, 225. Sum Σ(xᵢ − x̄)² = **450**.
4. Divide by n = 3: variance = 450 / 3 = **150**, and the standard deviation is √150 ≈ **12.25** (file 07).

### Worked example: Σ as a weighted sum

With weights w = [2, 1, 3] and inputs x = [4, 5, 1]:
Σ wᵢxᵢ = 2×4 + 1×5 + 3×1 = 8 + 5 + 3 = **16**.
This "multiply pairwise, then add" is called the **dot product** (file 05), and it is exactly what a neuron does.

### Worked example: Π and logs together

Π (0.5, 0.5, 0.5) = 0.125. Taking logs: ln(0.5) × 3 = −0.693 × 3 = −2.079, and ln(0.125) = −2.079 ✓. This is the log trick of section 13.

**Where you'll meet it in real work:** every loss function and every metric is a Σ over your dataset: "add the error of all 10,000 test examples and divide by 10,000".

**Common mistakes:**
- Σxᵢ² (square each, then add) is not (Σxᵢ)² (add, then square). For [3, 5]: 9 + 25 = 34, but (3 + 5)² = 64.
- Using the wrong limits: Σ from i = 1 to n has n terms. In code that is `range(n)` starting at 0.
- Forgetting to divide by n when asked for a mean.

> **සිංහලෙන්:** Σ කියන්නේ "ඔක්කොම එකතු කරන්න" කියන සංකේතය, ඒක for-loop එකක් වගේ. ළමයි තුන් දෙනෙකුගේ ලකුණු 60, 75, 90 නම් මධ්‍යන්‍යය (60 + 75 + 90) ÷ 3 = 75. ඒ අගයෙන් වෙනස්කම් −15, 0, 15, ඒවා වර්ග කරලා එකතු කළාම 450, 3න් බෙදුවාම 150. මේ ක්‍රමයෙන් තමයි MSE වගේ දේවල් හැදෙන්නේ. Π කියන්නේ ගුණ කරන්න, ඒක log එකෙන් Σ බවට හැරවෙනවා. Σxᵢ² සහ (Σxᵢ)² වෙනස්: [3, 5] වලට 9 + 25 = 34, ඒත් (3 + 5)² = 64.

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

### Worked example: MAE versus MSE

Same data as the MSE example: true y = [10, 20], predicted ŷ = [12, 17]. Errors are −2 and 3.
- **MAE** = (|−2| + |3|) / 2 = (2 + 3) / 2 = **2.5**
- **MSE** = (4 + 9) / 2 = **6.5**

If one error becomes 30 instead of 3, MAE becomes (2 + 30)/2 = 16, while MSE becomes (4 + 900)/2 = 452. MSE reacts much more strongly to a single big miss.

### Worked example: max versus argmax

Scores for four classes [positive, negative, neutral, mixed] = [2.1, 0.3, 4.5, 1.0].
- max = **4.5** (the value)
- argmax = **index 2** (the position, counting from 0), which is "neutral"

When an LLM always picks the single most likely next token, it is doing argmax. This is called **greedy decoding**. Sampling methods (with temperature) instead pick randomly according to the probabilities.

**argmin in training:** if the loss for three candidate learning rates 0.1, 0.01, 0.001 comes out as 1.4, 0.6 and 0.9, then min = 0.6 (the loss), while argmin = learning rate 0.01 (the setting that produced it).

**Where you'll meet it in real work:** a classifier's final answer is argmax over its probabilities, and the best hyperparameter setting is an argmin of the validation loss.

**Common mistakes:**
- Reporting the max value when the question asks which class (argmax), or the reverse.
- Off-by-one: argmax returns an index starting at 0, so index 2 is the **third** item.
- |a − b| is not |a| − |b|. For a = 2, b = 5: |2 − 5| = 3, but |2| − |5| = −3.

**Exam angle:** greedy decoding equals argmax over the next-token probabilities. Know the difference between this and sampling.

> **සිංහලෙන්:** Absolute value |x| කියන්නේ සලකුණ නොසලකා ශූන්‍යයේ ඉඳන් ඇති දුර, |−5| = 5. Errors −2 සහ 3 නම් MAE = (2 + 3) ÷ 2 = 2.5, ඒත් MSE = (4 + 9) ÷ 2 = 6.5. max කියන්නේ උපරිම අගය, argmax කියන්නේ ඒ අගය තියෙන තැන (index එක). Scores [2.1, 0.3, 4.5, 1.0] නම් max = 4.5, argmax = 2 (0න් ගණන් කරද්දී). Model එකක් ඊළඟ වචනය විදිහට වැඩිම probability එක තියෙන එක තෝරනවා නම් ඒක argmax. Training වලදී "loss එක අඩුම වෙන parameters මොනවාද" කියන එක argmin.

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

### Worked example: values of each shape

| x | −2 | 0 | 3 |
|---|---|---|---|
| ReLU(x) = max(0, x) | 0 | 0 | 3 |
| sigmoid(x) = 1 / (1 + e⁻ˣ) | 0.12 | 0.50 | 0.95 |
| tanh(x) | −0.96 | 0 | 0.995 |

Check sigmoid(3) by hand: e⁻³ ≈ 0.0498, so 1 / (1 + 0.0498) = 1 / 1.0498 ≈ **0.953**.

### Worked example: a spam score

A logistic regression model produces a raw score of 2 for an email. sigmoid(2) ≈ 0.88, so the model says "88% likely spam". A score of −2 gives 0.12 ("12% likely spam"), and a score of 0 gives exactly 0.5, the model is undecided. Sigmoid never reaches exactly 0 or 1.

**Which shape for which job?**

```
Hidden layers of a network     -> ReLU (or smooth variants such as GELU in transformers)
Yes/no probability (one output) -> sigmoid
One of many classes             -> softmax (section 12)
Output between -1 and 1         -> tanh
```

**Where you'll meet it in real work:** a fraud model's last step is a sigmoid that gives "probability this transaction is fraud"; a language model's last step is a softmax over its vocabulary.

**Common mistakes:**
- Using sigmoid for a many-class problem. The outputs would not add to 1; use softmax.
- Thinking ReLU squashes values. It leaves positives unchanged and only zeroes negatives.
- Forgetting that sigmoid is nearly flat at both ends, which slows learning (the "vanishing gradient" problem, file 15).

**Exam angle:** exams ask which activation suits which job: ReLU for hidden layers, sigmoid for binary output, softmax for multi-class output.

> **සිංහලෙන්:** AI වල function හැඩතල කිහිපයක් නිතර එනවා. Sigmoid එකෙන් ඕනෑම අංකයක් 0 සහ 1 අතරට හරවනවා, ඒක probability එකක් විදිහට පාවිච්චි කරන්න පුළුවන්. Email එකකට score එක 2 නම් sigmoid(2) ≈ 0.88, ඒ කියන්නේ "88%ක් spam". Score එක 0 නම් 0.5, model එකට තීරණයක් නෑ. ReLU කියන්නේ ඍණ ඔක්කොම 0 කරලා ධන ඒවා එහෙමම තියන function එක, ReLU(−3) = 0, ReLU(2.5) = 2.5. Classes ගොඩක් තියෙනවා නම් sigmoid නෙවෙයි softmax පාවිච්චි කරන්න, මොකද ඒකේ probabilities එකතුව හැමවිටම 1යි.

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

### Worked example: reading interval notation

| Written | In words | Does it contain 0? | Does it contain 1? |
|---|---|---|---|
| [0, 1] | 0 to 1, both ends included | yes | yes |
| (0, 1) | strictly between 0 and 1 | no | no |
| [0, 1) | from 0 up to but not including 1 | yes | no |
| (0, ∞) | every positive number (∞ itself never included) | no | yes |

A probability p lies in [0, 1]. A learning rate η is usually in (0, 1), because 0 would mean "never learn". The temperature τ must be greater than 0.

**Worked example:** "x ∈ ℝ⁷⁶⁸" says x is a list of 768 real numbers, which is the typical size of one sentence embedding in smaller models. "∀ i, pᵢ ≥ 0 and Σ pᵢ = 1" says "for every i, each probability is non-negative, and they add to 1", exactly what softmax guarantees.

**Where you'll meet it in real work:** documentation and configuration limits, such as "temperature must be in [0, 2]" or "top_p in (0, 1]", are interval notation.

**Common mistakes:**
- Mixing up square [ ] (included) and round ( ) (excluded) brackets.
- Reading ∈ as "equals". It means "is a member of".
- Treating ∞ as a number you can reach. It always gets a round bracket.

> **සිංහලෙන්:** මේ කොටස අවශ්‍ය වෙන්නේ papers වල සංකේත කියවන්න. < සහ > කියන්නේ කුඩා සහ විශාල, ≤ කියන්නේ සමාන වෙන්නත් පුළුවන් කියන එක. [0, 1] කියන්නේ 0ත් 1ත් ඇතුළුව ඒ අතර හැම අංකයක්ම, ඒ නිසා probability එකක් p ∈ [0, 1]. (0, 1) කියන්නේ 0ත් 1ත් නැතුව ඒ අතර අංක. ∈ කියන්නේ "එකක්" කියන තේරුම, ℝ කියන්නේ හැම real number එකක්ම. x ∈ ℝ⁷⁶⁸ කිව්වොත් x කියන්නේ real numbers 768ක ලිස්ට් එකක්, ඒක embedding එකක තරම.

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

### Worked example: reading a gradient-descent update

A paper writes:  **θ ← θ − η ∇L(θ)**

In words: "new parameters = old parameters minus (learning rate × gradient of the loss)".

With numbers: θ = 5, learning rate η = 0.1, gradient ∇L = 4.
New θ = 5 − 0.1 × 4 = 5 − 0.4 = **4.6**. One small step downhill.

Another line: **loss = MSE + λ Σ wᵢ²** reads "the error, plus a penalty of strength λ on big weights" (regularisation, file 11). If MSE = 6.5, Σ wᵢ² = 4 and λ = 0.01, the total is 6.5 + 0.01 × 4 = **6.54**.

**Where you'll meet it in real work:** every paper, every model card and every library's documentation (for example `lr`, `eps`, `betas` in an optimiser, which are η, ε and β).

**Common mistakes:**
- Assuming one letter has one meaning. σ is standard deviation in statistics and the sigmoid in neural networks. π is 3.14159, a policy in reinforcement learning, or a product sign. Look at the paper's notation section first.
- Mixing up the capital and small forms: Σ is a sum, σ is a standard deviation.
- Reading ε as "large". It is nearly always a tiny number.

**Exam angle:** know the standard ones: θ parameters, η or α learning rate, λ regularisation strength, τ temperature, ∇ gradient, μ mean, σ standard deviation, ε a tiny constant.

> **සිංහලෙන්:** AI papers වල Greek අකුරු ගොඩක් තියෙනවා, ඒත් හැමෝම පාවිච්චි කරන්නේ එක වගේ අර්ථ වලින්. θ කියන්නේ model එකේ parameters ඔක්කොම, η (හෝ α) learning rate එක, λ regularisation strength එක, μ සාමාන්‍යය, σ standard deviation, τ temperature, ∇ gradient එක. θ ← θ − η∇L කියන්නේ "පරණ parameters වලින් learning rate × gradient එක අඩු කරනවා" කියන එක. θ = 5, η = 0.1, gradient = 4 නම් 5 − 0.4 = 4.6. එකම අකුරට paper එකෙන් paper එකට අර්ථ වෙනස් වෙන්න පුළුවන්, ඒ නිසා notation කොටස හැමවිටම මුලින් කියවන්න.

```quiz
[{"q": "Calculate 8 − 2 × 3 + 4 ÷ 2.", "options": ["2", "4", "20", "10"], "answer": 1, "why": "Multiply and divide first: 2 × 3 = 6 and 4 ÷ 2 = 2, so 8 − 6 + 2 = 4. The answer 20 comes from adding brackets (8 − 2) that are not there."}, {"q": "A line passes through (2, 5) and (6, 13). What is its equation?", "options": ["y = 4x − 3", "y = 2x + 1", "y = 2x + 5", "y = x + 3"], "answer": 1, "why": "Slope = (13 − 5)/(6 − 2) = 2. Then 5 = 2×2 + b gives b = 1. The option y = 2x + 5 copies the y-value 5 as the intercept by mistake."}, {"q": "A 7B-parameter model stores each weight in 16 bits (2 bytes). About how much memory do the weights alone need?", "options": ["7 GB", "14 GB", "28 GB", "56 GB"], "answer": 1, "why": "7 × 10⁹ parameters × 2 bytes = 14 × 10⁹ bytes = about 14 GB. 28 GB would be 4 bytes per parameter (32-bit)."}, {"q": "What is log₂(32) and what is ln(1)?", "options": ["5 and 1", "16 and 0", "5 and 0", "32 and e"], "answer": 2, "why": "2⁵ = 32 so log₂(32) = 5. Any log of 1 is 0 because b⁰ = 1. ln(1) is not 1; ln(e) is 1."}, {"q": "A model gives the correct class probability 0.1. What is the cross-entropy loss, approximately?", "options": ["0.1", "0.9", "2.30", "−2.30"], "answer": 2, "why": "Loss = −ln(0.1) = 2.30. The minus sign cancels the negative log, so the loss is positive. A confident right answer such as p = 0.9 gives only 0.105."}, {"q": "Scores for [cat, dog, bird] are [0.1, 0.7, 0.2]. What are max and argmax (counting from 0)?", "options": ["max = 1, argmax = 0.7", "max = 0.7, argmax = 1", "max = 0.7, argmax = 2", "max = 0.2, argmax = 2"], "answer": 1, "why": "The biggest value is 0.7 (max). It sits at index 1 (dog), which is the argmax. Mixing up the value and its position is the common error."}, {"q": "For x = [3, 5, 2, 6], what are Σxᵢ and Σxᵢ²?", "options": ["16 and 256", "16 and 74", "74 and 16", "4 and 74"], "answer": 1, "why": "Σxᵢ = 3 + 5 + 2 + 6 = 16. Σxᵢ² = 9 + 25 + 4 + 36 = 74. The value 256 is (Σxᵢ)², the square of the sum, which is a different quantity."}, {"q": "For a many-class classifier, which function turns raw scores into probabilities that add up to 1?", "options": ["ReLU", "sigmoid applied to each score", "softmax", "tanh"], "answer": 2, "why": "Softmax divides each eˣ by the total of all of them, so the outputs add to 1. Sigmoid on each score gives independent values between 0 and 1 that need not add to 1."}]
```

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

**Q11.** A shop raises a price from Rs. 800 to Rs. 1,000. What is the percentage increase? If it then falls back to Rs. 800, what is the percentage decrease?
<details><summary>Answer</summary>Increase: (1,000 − 800)/800 × 100 = 25%. Decrease: (800 − 1,000)/1,000 × 100 = −20%. The base is different each time, so the percentages differ.</details>

**Q12.** Scores 2, 1, 0 go through softmax. Approximately what is the probability of the first class?
<details><summary>Answer</summary>e² ≈ 7.389, e¹ ≈ 2.718, e⁰ = 1, total ≈ 11.107, so the first is 7.389 / 11.107 ≈ 0.665.</details>

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
| Percentage points | Difference between two percentages (4% to 5% is +1 point) |
| Underflow (in logs) | Products of many small probabilities rounding to 0, avoided by adding logs |
| Dot product | Multiply pairwise, then add: Σ wᵢxᵢ |
| Logits | Raw scores before softmax |
| Softmax | Turns scores into probabilities that add to 1, using eˣ |
| Temperature (τ) | Divides scores before softmax: low is focused, high is varied |
| Perplexity | e to the average cross-entropy loss; lower is better |
| Greedy decoding | Always choose the argmax token |
| Interval [a, b] / (a, b) | Ends included / ends excluded |

**Next:** [05-math-linear-algebra.md](05-math-linear-algebra.md)
