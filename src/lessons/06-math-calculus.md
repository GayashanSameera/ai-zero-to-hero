# 06: Maths 3: Calculus (How Models Learn)

> **Before you start:** [04](04-math-numbers-and-functions.md) (functions, slope, exponents, logs, e, sigmoid, MSE, argmin) and [05](05-math-linear-algebra.md) (vectors).
>
> **After this file you can:** explain derivatives, gradients and the chain rule in plain English, do **gradient descent** by hand, and understand how backpropagation trains neural networks.

**Why calculus?** Training a model means **finding the parameter values with the smallest error** (the *argmin* from [file 04](04-math-numbers-and-functions.md#15-absolute-value-min-max-argmax)). Calculus tells us **which direction to adjust each parameter** to reduce the error. Without it, modern AI wouldn't exist.

**Good news:** computers calculate all derivatives for you automatically. You need the **intuition**, not hand calculation skills.

---

## Table of contents

1. [The big picture: walking downhill in fog](#1-the-big-picture-walking-downhill-in-fog)
2. [Rate of change](#2-rate-of-change)
3. [The derivative: slope at a single point](#3-the-derivative)
4. [Derivative rules (the shortcuts)](#4-derivative-rules)
5. [Reading a derivative: minimum, maximum, flat](#5-reading-a-derivative)
6. [Gradient descent in one dimension (worked by hand)](#6-gradient-descent-in-one-dimension)
7. [The learning rate](#7-the-learning-rate)
8. [Partial derivatives: many inputs](#8-partial-derivatives)
9. [The gradient: a vector of slopes](#9-the-gradient)
10. [Gradient descent with two parameters (worked example)](#10-gradient-descent-with-two-parameters)
11. [The chain rule](#11-the-chain-rule)
12. [Computational graphs and backpropagation (preview)](#12-computational-graphs-and-backpropagation)
13. [Automatic differentiation in code](#13-automatic-differentiation-in-code)
14. [Loss landscapes: local minima, saddle points, convexity](#14-loss-landscapes)
15. [Integrals (just the idea)](#15-integrals-just-the-idea)
16. [Optional extras: Taylor series, Jacobian, Hessian, Lagrange](#16-optional-extras)
17. [Check yourself](#17-check-yourself)
18. [New words in this file](#18-new-words-in-this-file)

---

## 1. The big picture: walking downhill in fog

Imagine you're on a hilly field in thick fog. You want to reach the **lowest point** (a valley). You can't see far, but you **can feel the slope under your feet**.

Strategy:
1. Feel which way the ground slopes down.
2. Take a small step that way.
3. Repeat until the ground is flat.

That's **gradient descent**, the algorithm that trains almost every ML model.

- The **field** = the **loss function**: how wrong the model is for each possible setting of its parameters.
- Your **position** = the current **parameter values** (weights).
- **Height** = the **loss** (error). Lower is better.
- **Feeling the slope** = computing the **derivative / gradient**.
- **Step size** = the **learning rate**.

The rest of this file explains each piece.

---

## 2. Rate of change

**Idea:** how fast does one thing change when another thing changes?

**Example:** a car drives 120 km in 2 hours. Average speed = 120 / 2 = **60 km/h**: distance changes by 60 for each hour.

That's the **slope** from [file 04](04-math-numbers-and-functions.md#8-straight-lines-slope-and-intercept): rise over run = Δy / Δx (Δ = "change in").

For a **straight line**, the slope is the same everywhere. But most functions **curve**: the slope differs at each point.

```
y = x²
   y
 9 ┤              •      ← steep here
   │            ╱
 4 ┤        •╱
   │      ╱
 1 ┤   •╱                ← gentler here
 0 ┼•─┬───┬───┬──► x
   0  1   2   3          ← flat at x = 0
```

So how do we get the slope **at one exact point** of a curve?

---

## 3. The derivative

**Idea:** the **derivative** of a function at a point is its **slope right at that point**: how much the output changes for a **tiny** change in the input.

**How to picture it:** take two points on the curve, very close together, and compute rise over run. Then move them closer and closer together. The slope settles on one number, which is the derivative.

**Example:** f(x) = x² at x = 3

| Second point | Rise / run |
|---|---|
| x = 4 | (16 − 9)/(4 − 3) = 7 |
| x = 3.1 | (9.61 − 9)/0.1 = 6.1 |
| x = 3.01 | (9.0601 − 9)/0.01 = 6.01 |
| x = 3.001 | 6.001 |

It approaches **6**. So the derivative of x² at x = 3 is 6.

```python
def f(x): return x**2
h = 0.00001
(f(3 + h) - f(3)) / h    # ≈ 6.00001
```

### Notation

All of these mean "the derivative of f":

```
f'(x)        "f prime of x"
df/dx        "d f by d x": tiny change in f ÷ tiny change in x
dy/dx
```

### The derivative is itself a function

For f(x) = x², the derivative is **f'(x) = 2x**. It gives the slope at *any* point:
- at x = 3: 2 × 3 = 6 ✓ (matches above)
- at x = 1: slope 2
- at x = 0: slope 0 (flat, the bottom of the U)
- at x = −2: slope −4 (going downhill to the right)

---

## 4. Derivative rules

You don't need to compute limits every time. Use these shortcuts (c is a constant number, n is a power):

| Function f(x) | Derivative f'(x) | Example |
|---|---|---|
| c (constant) | 0 | f(x) = 5 → 0 (flat line) |
| x | 1 | |
| c·x | c | 3x → 3 |
| xⁿ (**power rule**) | n·xⁿ⁻¹ | x² → 2x; x³ → 3x² |
| eˣ | eˣ | (its own derivative!) |
| ln(x) | 1/x | |
| f(x) + g(x) (**sum rule**) | f'(x) + g'(x) | x² + 3x → 2x + 3 |
| c·f(x) | c·f'(x) | 5x² → 10x |
| sigmoid σ(x) | σ(x)·(1 − σ(x)) | at x=0: 0.5 × 0.5 = 0.25 |
| ReLU max(0, x) | 0 if x < 0, 1 if x > 0 | |

**Worked example:** f(x) = 3x² + 2x + 7
- 3x² → 3 × 2x = 6x
- 2x → 2
- 7 → 0
- **f'(x) = 6x + 2**

**Worked example:** the squared error for one prediction, as a function of the prediction p, with true value 5: L(p) = (p − 5)²
- Derivative: **L'(p) = 2(p − 5)**
- If p = 8: slope = 6 (positive → decrease p to reduce error)
- If p = 2: slope = −6 (negative → increase p)
- If p = 5: slope = 0 (perfect)

Notice how the derivative **tells you which way to move** and **how far off you are**.

**Fun fact:** the sigmoid's derivative is at most 0.25 (at x = 0) and nearly 0 for big |x|. This causes the **vanishing gradient problem** in deep networks (file 15), and it's why ReLU became popular: its derivative is a nice clean 1 for positive inputs.

---

## 5. Reading a derivative

| Derivative | Meaning | Picture |
|---|---|---|
| positive | function going **up** as x increases | ／ |
| negative | function going **down** as x increases | ＼ |
| zero | **flat**: could be a minimum, maximum, or flat spot | ── |
| large magnitude | steep | |
| small magnitude | gentle | |

**Key insight for ML:** to make a function **smaller**, move x in the **opposite direction** of the derivative.
- Derivative positive → decrease x
- Derivative negative → increase x

At a **minimum** (bottom of a valley), the derivative is **0**.

---

## 6. Gradient descent in one dimension

Let's minimise **L(w) = (w − 3)²**. (We know the answer is w = 3, but let's pretend we don't.)

- Derivative: L'(w) = 2(w − 3)
- **Update rule:**

```
w_new = w_old − learning_rate × L'(w_old)
```

"Step **against** the slope, scaled by the learning rate."

Start at w = 0, learning rate = 0.1:

| Step | w | L'(w) = 2(w−3) | update = 0.1 × L'(w) | new w | loss (w−3)² |
|---|---|---|---|---|---|
| 0 | 0.000 | −6.000 | −0.600 | 0.600 | 9.000 |
| 1 | 0.600 | −4.800 | −0.480 | 1.080 | 5.760 |
| 2 | 1.080 | −3.840 | −0.384 | 1.464 | 3.686 |
| 3 | 1.464 | −3.072 | −0.307 | 1.771 | 2.359 |
| ... | | | | | |
| 20 | ≈ 2.965 | ≈ −0.07 | | | ≈ 0.001 |

w walks toward 3 and the loss shrinks toward 0. Notice the steps get smaller automatically, because the slope gets gentler near the bottom.

```python
w = 0.0
lr = 0.1
for step in range(25):
    grad = 2 * (w - 3)       # derivative
    w = w - lr * grad        # gradient descent update
print(w)   # ≈ 2.99
```

**This loop is the heart of all machine learning training.** Real models just have millions or billions of w's instead of one.

---

## 7. The learning rate

The **learning rate** (written η "eta" or α "alpha", often `lr` in code) controls the step size. It is a **hyperparameter**, a setting *you* choose rather than something the model learns (file 11).

```
Too small (0.001)      Just right (0.1)       Too big (1.1)
  •                      •                     •           •
   •                       •                     ╲       ╱
    •                        •                    ╲  •  ╱
     •                         •                   ╲╱ ╲╱
      • (very slow)              • (reaches min)    (bounces out, diverges)
```

Try it on our example L(w) = (w−3)²:
- lr = 0.001: after 25 steps w ≈ 0.15. Barely moved. **Too slow.**
- lr = 0.1: w ≈ 2.99. **Good.**
- lr = 1.1: w jumps 0 → 6.6 → −1.32 → 8.18 → ... Loss explodes. **Diverges.**

Typical learning rates in deep learning: 0.1 to 0.00001 (`1e-1` to `1e-5`). For fine-tuning LLMs, often around `1e-5` to `2e-4` (file 21).

**If your training loss suddenly becomes `NaN` (Not a Number) or shoots to infinity, the learning rate is often too high.**

---

## 8. Partial derivatives

Real models have **many** parameters. For example, a line has two: y = w·x + b. The loss depends on both w and b.

**Idea:** a **partial derivative** is the slope with respect to **one** variable while keeping **all the others frozen**.

Notation: **∂** (a curly d, "partial"): ∂L/∂w = "partial derivative of L with respect to w".

**Analogy:** you're on a hill. The slope going **east** (holding north-south fixed) is one partial derivative; the slope going **north** (holding east-west fixed) is another.

**Example:** f(w, b) = w² + 3wb + b²
- ∂f/∂w: treat b as a constant number → 2w + 3b
- ∂f/∂b: treat w as a constant number → 3w + 2b

At (w=1, b=2): ∂f/∂w = 2 + 6 = 8; ∂f/∂b = 3 + 4 = 7.

---

## 9. The gradient

**Idea:** the **gradient** is the **vector** ([file 05](05-math-linear-algebra.md#2-vectors)) of all partial derivatives. It's written ∇f ("nabla f" or "grad f").

```
∇f = [ ∂f/∂w,  ∂f/∂b ]
```

For the example above at (1, 2): ∇f = [8, 7].

**What the gradient means:**
- It points in the direction of **steepest uphill**.
- Its length says how steep that is.
- So **−∇f** (minus the gradient) points **steepest downhill**. That's the direction we step in.

### Gradient descent (general form)

```
θ_new = θ_old − η · ∇L(θ_old)
```

- θ (theta) = vector of **all** parameters ([Greek table](04-math-numbers-and-functions.md#18-greek-letters-cheat-sheet))
- η = learning rate
- ∇L = gradient of the loss

Each parameter gets updated by its own partial derivative, all at the same time.

---

## 10. Gradient descent with two parameters

Let's fit a line y = w·x + b to **one** data point: x = 2, y = 7. (Real training uses many points; the idea is the same.)

**Loss:** squared error L = (prediction − y)² = (w·x + b − 7)²

**Partial derivatives** (using the chain rule from section 11; trust these for now):
- ∂L/∂w = 2(w·x + b − 7) · x
- ∂L/∂b = 2(w·x + b − 7)

Start: w = 0, b = 0, learning rate η = 0.05.

**Step 1:**
- prediction = 0×2 + 0 = 0; error = 0 − 7 = −7
- ∂L/∂w = 2 × (−7) × 2 = −28; ∂L/∂b = 2 × (−7) = −14
- w = 0 − 0.05 × (−28) = **1.4**; b = 0 − 0.05 × (−14) = **0.7**
- loss before: 49

**Step 2:**
- prediction = 1.4×2 + 0.7 = 3.5; error = −3.5
- ∂L/∂w = 2 × (−3.5) × 2 = −14; ∂L/∂b = −7
- w = 1.4 + 0.7 = **2.1**; b = 0.7 + 0.35 = **1.05**
- loss before: 12.25

**Step 3:** prediction = 2.1×2 + 1.05 = 5.25 → error −1.75 → loss 3.06 ... and so on toward 0.

```python
x, y = 2, 7
w, b, lr = 0.0, 0.0, 0.05
for step in range(30):
    pred = w * x + b
    err = pred - y
    dw = 2 * err * x
    db = 2 * err
    w -= lr * dw
    b -= lr * db
print(w, b, w * x + b)   # prediction ≈ 7
```

**Notice:** w got bigger updates than b because x = 2 multiplies its gradient. Features with large values cause large gradients, which is one reason we scale features (file 10).

---

## 11. The chain rule

**Idea:** if one thing depends on a second, and the second depends on a third, the rates of change **multiply**.

```
If  y = f(u)  and  u = g(x),   then   dy/dx = dy/du × du/dx
```

**Analogy (gears):** gear A turns gear B 3 times per turn; gear B turns gear C 2 times per turn. So A turns C 3 × 2 = **6** times per turn.

**Analogy (money):** you earn $20 per hour. You save 10% of what you earn. How much do your savings grow per hour? $20 × 0.10 = **$2/hour**. Rates multiply along the chain.

**Worked example:** y = (3x + 1)²
- Inner: u = 3x + 1 → du/dx = 3
- Outer: y = u² → dy/du = 2u
- Chain: dy/dx = 2u × 3 = 6u = **6(3x + 1)**
- At x = 1: 6 × 4 = 24

**Worked example (the one we used in section 10):** L = (w·x + b − y)²
- Inner: u = w·x + b − y → ∂u/∂w = x, ∂u/∂b = 1
- Outer: L = u² → dL/du = 2u
- Chain: ∂L/∂w = 2u · x ✓ and ∂L/∂b = 2u · 1 ✓

### Long chains

For a chain of many functions: x → a → b → c → L,

```
dL/dx = dL/dc × dc/db × db/da × da/dx
```

A neural network is exactly a long chain of functions (layer after layer, [file 04](04-math-numbers-and-functions.md#6-functions) "composition"). The chain rule lets us find how the final loss depends on **every** weight in **every** layer.

**Why vanishing gradients happen:** if every link in a long chain is a small number like 0.25 (the sigmoid's max derivative), then multiplying 20 of them gives 0.25²⁰ ≈ 0.0000000000009. The early layers get almost no learning signal. That's the **vanishing gradient problem** (file 15). If links are bigger than 1, the product can blow up instead: **exploding gradients**.

---

## 12. Computational graphs and backpropagation

**Idea:** any calculation can be drawn as a **graph** of simple operations. **Backpropagation** applies the chain rule **backwards** through this graph to get the gradient of the loss with respect to every parameter, efficiently.

**Example:** L = (w·x + b − y)² with x = 2, y = 7, w = 1, b = 1

**Forward pass** (compute the value, left to right):

```
w=1 ─┐
     ×──► m = w·x = 2 ─┐
x=2 ─┘                  +──► p = m + b = 3 ──► e = p − y = −4 ──► L = e² = 16
                  b=1 ──┘                       (y = 7)
```

**Backward pass** (compute gradients, right to left, multiplying local slopes):

| Node | Local derivative | Gradient of L w.r.t. this node |
|---|---|---|
| L = e² | dL/de = 2e = −8 | dL/de = **−8** |
| e = p − 7 | de/dp = 1 | dL/dp = −8 × 1 = **−8** |
| p = m + b | dp/db = 1, dp/dm = 1 | dL/db = **−8**, dL/dm = **−8** |
| m = w·x | dm/dw = x = 2 | dL/dw = −8 × 2 = **−16** |

So ∇L = [∂L/∂w, ∂L/∂b] = [−16, −8]. Both negative → increase w and b. ✓

**Why "backward"?** Going backwards, each node reuses the gradient already computed for the node after it. One backward pass gives gradients for **all** parameters for roughly the cost of one forward pass. That's what makes training networks with billions of parameters possible.

Full neural network backprop is covered in [file 15](15-neural-networks.md).

---

## 13. Automatic differentiation in code

Deep learning libraries (PyTorch, TensorFlow, JAX) build the computational graph automatically and run backprop for you. This is called **automatic differentiation** (**autodiff** or **autograd**).

```python
import torch   # PyTorch (file 15)

w = torch.tensor(1.0, requires_grad=True)   # "track gradients for w"
b = torch.tensor(1.0, requires_grad=True)
x, y = 2.0, 7.0

L = (w * x + b - y) ** 2     # forward pass
L.backward()                 # backward pass: computes all gradients

print(L.item())      # 16.0
print(w.grad)        # tensor(-16.)   ← matches our hand calculation
print(b.grad)        # tensor(-8.)
```

You write the forward calculation. The library handles the calculus.

---

## 14. Loss landscapes

The **loss landscape** is the shape of the loss as a function of all the parameters. With two parameters you can imagine it as a 3-D terrain map; with millions, you can't picture it, but the ideas carry over.

```
Loss
 │  ╲                           ╱
 │   ╲         ╱╲              ╱
 │    ╲       ╱  ╲            ╱
 │     ╲_____╱    ╲          ╱
 │    local min    ╲________╱
 │                 global min
 └──────────────────────────────► parameter
```

- **Global minimum:** the lowest point overall (the best possible parameters).
- **Local minimum:** a valley that's lower than its neighbours, but not the lowest overall. Gradient descent can get stuck here.
- **Saddle point:** flat point that goes up in one direction and down in another (like a horse saddle, or a mountain pass). The gradient is zero but it's not a minimum. In high dimensions, saddle points are far more common than bad local minima.
- **Plateau:** a large flat area where gradients are tiny and training crawls.

### Convex vs non-convex

- **Convex** function: shaped like a single bowl. Only one minimum, so gradient descent always finds the global minimum. Linear regression and logistic regression losses are convex (file 12). 😊
- **Non-convex**: many hills and valleys. Neural network losses are non-convex. 😬 Surprisingly, in practice, for huge networks most local minima turn out to be about as good as each other.

### Tricks that help (covered in file 15)

- **Stochastic gradient descent (SGD):** compute the gradient on a small random **mini-batch** of data instead of all data. Faster, and the noise helps escape saddle points.
- **Momentum:** keep some of the previous step's direction, like a ball rolling downhill that builds up speed and rolls through small bumps.
- **Adam:** adapts the step size for each parameter automatically. The default optimiser for most deep learning.
- **Learning rate schedules:** start with bigger steps, take smaller steps later.

---

## 15. Integrals (just the idea)

**Idea:** an **integral** is the **area under a curve**: the "total accumulated amount". It's the opposite of a derivative.

**Analogy:** if a graph shows your speed over time, the area under it is the total distance travelled.

```
speed
 │    ┌────────┐
 │    │████████│        area = 60 km/h × 2 h = 120 km
 │    │████████│
 └────┴────────┴──► time
      0        2h
```

Written: ∫ f(x) dx

**Where you'll meet it in AI:**
- **Probability:** for continuous variables (like height), the probability of falling in a range = area under the probability curve over that range (file 07). The total area is always 1.
- **AUC** = "Area Under the Curve" of the ROC curve, a key metric for classifiers (file 13).
- **Diffusion models** and expected values in maths papers (files 07, 25).

You'll almost never compute one by hand. Just know: **integral = area / total**.

---

## 16. Optional extras

You'll see these names. Here is the gist so they don't scare you.

- **Taylor series:** approximating a complicated function near a point using simple polynomial terms: f(x+h) ≈ f(x) + f'(x)·h + ½f''(x)·h² + ... The first two terms say "near a point, every smooth curve looks like a straight line". That's *why* gradient descent with small steps works.
- **Second derivative (f''):** the slope of the slope; how fast the slope changes (curvature). Positive means curving up (a bowl).
- **Jacobian:** a matrix of all partial derivatives when a function has many inputs **and** many outputs.
- **Hessian:** a matrix of all second derivatives; describes the curvature of the loss landscape. Too expensive to compute for big networks, which is why we use first-order methods like SGD and Adam.
- **Lagrange multipliers:** a technique for minimising something **subject to a constraint** (e.g. "maximise profit, but spending ≤ $100"). Used in deriving SVMs (file 12).

---

## 17. Check yourself

**Q1.** In plain English, what does a derivative tell you?
<details><summary>Answer</summary>How fast the output changes when you change the input a tiny bit: the slope at that point. Its sign tells you the direction (up/down).</details>

**Q2.** Find the derivative of f(x) = 4x³ − 2x + 9.
<details><summary>Answer</summary>12x² − 2.</details>

**Q3.** The derivative of the loss with respect to a weight is +5. Should you increase or decrease the weight to reduce loss?
<details><summary>Answer</summary>Decrease it. Move opposite to the derivative (w_new = w − lr × 5).</details>

**Q4.** Do one gradient descent step on L(w) = (w − 10)² starting at w = 4 with learning rate 0.25.
<details><summary>Answer</summary>L'(w) = 2(w − 10) = 2(−6) = −12. w_new = 4 − 0.25 × (−12) = 4 + 3 = **7**.</details>

**Q5.** Your training loss becomes NaN after a few steps. What's the most likely cause?
<details><summary>Answer</summary>Learning rate too high, so the updates overshoot and diverge (also possible: exploding gradients, log(0), divide by zero).</details>

**Q6.** Compute ∂f/∂x and ∂f/∂y for f(x, y) = x²y + 5y.
<details><summary>Answer</summary>∂f/∂x = 2xy (treat y as a constant). ∂f/∂y = x² + 5 (treat x as a constant).</details>

**Q7.** Use the chain rule: y = (2x − 1)³. Find dy/dx.
<details><summary>Answer</summary>u = 2x − 1, du/dx = 2; y = u³, dy/du = 3u². dy/dx = 3u² × 2 = **6(2x − 1)²**.</details>

**Q8.** Why does stacking many sigmoid layers cause vanishing gradients?
<details><summary>Answer</summary>By the chain rule, gradients multiply through layers. Sigmoid's derivative is at most 0.25, so multiplying many such small numbers gives a gradient near zero for early layers, and they barely learn.</details>

**Q9.** What's the difference between a local and a global minimum? Why is a convex loss nice?
<details><summary>Answer</summary>Global = lowest point overall; local = lowest only in its neighbourhood. A convex loss has only one minimum, so gradient descent always finds the best solution.</details>

---

## 18. New words in this file

| Word | Meaning |
|---|---|
| Calculus | Maths of change (derivatives) and accumulation (integrals) |
| Loss function / loss landscape | How wrong a model is / its shape over all parameter values |
| Rate of change, Δ | How fast one thing changes vs another; Δ = "change in" |
| Derivative (f'(x), df/dx) | Slope of a function at a point |
| Power rule, sum rule | xⁿ → nxⁿ⁻¹; derivative of a sum = sum of derivatives |
| Gradient descent | Repeatedly step against the gradient to minimise loss |
| Update rule | θ_new = θ − η·∇L |
| Learning rate (η, α, lr) | Step size in gradient descent |
| Hyperparameter | A setting chosen by you, not learned |
| Diverge / NaN | Training blows up / "Not a Number" (broken calculation) |
| Partial derivative (∂) | Slope with respect to one variable, others frozen |
| Gradient (∇) | Vector of all partial derivatives; points steepest uphill |
| Chain rule | Rates multiply through a chain of functions |
| Vanishing / exploding gradients | Gradients shrinking to ~0 / blowing up through many layers |
| Computational graph | A calculation drawn as connected simple operations |
| Forward pass / backward pass | Compute the output / compute gradients backwards |
| Backpropagation | Chain rule applied backwards to get all gradients efficiently |
| Automatic differentiation (autodiff/autograd) | Library computes gradients for you |
| `requires_grad`, `.backward()`, `.grad` | PyTorch: track, compute, read gradients |
| Global / local minimum | Lowest point overall / lowest nearby |
| Saddle point, plateau | Flat point that's not a minimum / large flat region |
| Convex / non-convex | Single bowl / many hills and valleys |
| SGD, mini-batch | Gradient descent on small random subsets of data |
| Momentum, Adam | Optimiser tricks (details in file 15) |
| Learning rate schedule | Changing the learning rate during training |
| Integral (∫) | Area under a curve; total accumulation |
| AUC | Area Under the Curve (metric, file 13) |
| Taylor series | Approximating a function with polynomial terms near a point |
| Second derivative, curvature | Slope of the slope |
| Jacobian, Hessian | Matrices of first / second derivatives |
| Lagrange multipliers | Optimisation with constraints |

**Next:** [07-math-probability-statistics.md](07-math-probability-statistics.md)
