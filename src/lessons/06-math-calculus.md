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

**Why it exists:** a model can have millions of parameters, and you cannot try every combination. If each of 10 parameters could take 100 values, that is 100¹⁰ = 10²⁰ combinations. Calculus gives a direction to move in, so we never have to search blindly.

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

### A text picture

```
loss
 │\
 │ \          you are here (feel the slope: going down to the right)
 │  \   ●──►
 │   \_____
 │        \__/   ← lowest point (the valley)
 └──────────────────► parameter value
```

### Where you'll meet it in real work

Every training run you ever start (a bank's fraud model, a Daraz recommender, an LLM fine-tune) is this walk downhill, repeated thousands of times.

### Common mistakes

- Thinking the model "sees" the whole landscape. It only knows the slope at its current spot.
- Thinking training means the model memorises answers. It adjusts parameters to lower the loss.

**Exam angle:** training = minimising a loss function with gradient descent. Be able to name the loss, the parameters and the learning rate in a description of training.

> **සිංහලෙන්:** Gradient descent කියන්නේ මීදුම පිරුණු කඳු පෙදෙසක පල්ලම් බලාගෙන ගිහින් පහළම තැනට යන එක වගේ දෙයක්. ඔයාට පේන්නේ පයට දැනෙන බෑවුම විතරයි, ඒ නිසා බෑවුම පල්ලම් පැත්තට පොඩි පියවරක් තියලා ආයෙත් බලනවා. Model එකේ parameters ඔයා ඉන්න තැන, loss එක උස, පියවරේ ප්‍රමාණය learning rate එක. Parameters 10ක් ඇති model එකක හැම එකකටම අගයන් 100 බැගින් බැලුවොත් සංයෝජන 10^20ක් වෙනවා, ඒක කරන්න බෑ. ඒකයි පල්ලම පෙන්නන calculus ඕනේ.

---

## 2. Rate of change

**Why it exists:** to know how a model's error reacts when we change a parameter, we first need a clean way to say "how fast does this change when that changes?"

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

### Worked example

Your phone's data counter reads 2 GB at 9 am and 5 GB at 1 pm. Rate = (5 − 2) ÷ 4 = **0.75 GB per hour**.

**On a curve (y = x²) the rate depends on where you look:**

```
between x=1 and x=3: (9 − 1) / (3 − 1) = 8/2 = 4
between x=2 and x=3: (9 − 4) / (3 − 2) = 5/1 = 5
```

Two intervals, two different slopes. So we want the slope at *one exact point*.

### Common mistakes

- Mixing up the value of a function with its rate of change. A tall point on a curve can be flat, and a low point can be steep.
- Swapping the order in Δy / Δx (change in output over change in input).

> **සිංහලෙන්:** Rate of change කියන්නේ එකක් වෙනස් වෙද්දී අනිත් එක කොච්චර වෙනස් වෙනවද කියන එක. කාරයක් පැය 2කින් km 120ක් ගියොත් වේගය 120 ÷ 2 = පැයට km 60ක්. හැබැයි y = x² වගේ වක්‍ර රේඛාවක slope එක හැම තැනම එකම නෑ. x = 1 ඉඳන් 3 දක්වා සාමාන්‍ය slope එක (9 − 1) ÷ 2 = 4, ඒත් 2 ඉඳන් 3 දක්වා (9 − 4) ÷ 1 = 5. ඒ නිසා එක නිශ්චිත තැනක slope එක දැනගන්න derivative එක ඕනේ.

---

## 3. The derivative

**Why it exists:** the derivative is one number that tells you, at your current spot, which way is uphill and how steep it is. That is exactly what you need to decide your next step.

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

### Worked example: x² at x = 2

Use a tiny step h = 0.001:

```
(f(2.001) − f(2)) / 0.001 = (4.004001 − 4) / 0.001 = 0.004001 / 0.001 = 4.001  ≈ 4
```

The formula f'(x) = 2x gives 2 × 2 = 4. ✓ (2.001² = 4.004001.)

### Where you'll meet it in real work

The derivative of the loss with respect to a weight says "if I nudge this weight up a little, does the loss go up or down, and by how much?" Every optimiser uses that answer.

### Common mistakes

- Thinking the derivative is the height of the curve. It is the slope.
- Using h = 0 exactly in the code. That divides by zero; use a tiny non-zero number.

> **සිංහලෙන්:** Derivative එක කියන්නේ එක තැනක slope එක, ඒ කියන්නේ input එක ඉතා පොඩ්ඩක් වෙනස් කළාම output එක කොච්චර වෙනස් වෙනවද කියන එක. f(x) = x² සඳහා x = 3 දී: x එක 3.01 කළාම f = 9.0601, වෙනස 0.0601ක්, ඒක 0.01න් බෙදුවම 6.01. පොඩි වෙනස තව පොඩි කරන්න කරන්න අගය 6ට ළං වෙනවා. ඒ නිසා x = 3 දී derivative එක 6, f'(x) = 2x කියන සූත්‍රයෙනුත් 2 × 3 = 6 ලැබෙනවා. Derivative එකේ ලකුණෙන් function එක උඩට යනවද පහළට යනවද කියලත් දැනගන්න පුළුවන්.

---

## 4. Derivative rules

**Why it exists:** working out a limit every time would be painfully slow. These rules are shortcuts that cover almost every function you will meet.

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

### Worked example 1: find the flat spots of a cubic

f(x) = x³ − 6x² + 5

```
f'(x) = 3x² − 12x
at x = 2: 3×4 − 12×2 = 12 − 24 = −12   (going downhill)
at x = 4: 3×16 − 12×4 = 48 − 48 = 0    (flat spot)
f'(x) = 3x(x − 4) = 0  →  x = 0 or x = 4
```

### Worked example 2: mixing rules

f(x) = eˣ + ln(x) at x = 1: f'(x) = eˣ + 1/x, so f'(1) = e + 1 ≈ 2.718 + 1 = **3.718**.

### Common mistakes

- Forgetting to lower the power: the derivative of x³ is 3x², not 3x³.
- Saying the derivative of a constant is the constant. It is **0**.
- Applying the power rule to eˣ. The derivative of eˣ is eˣ, not x·eˣ⁻¹.
- ReLU's derivative at exactly 0 is undefined; libraries simply pick 0 (or 1) there. It rarely matters.

**Exam angle:** know why ReLU replaced sigmoid in deep networks: sigmoid's derivative is at most 0.25, which causes vanishing gradients, while ReLU's derivative is 1 for positive inputs.

> **සිංහලෙන්:** හැම වතාවෙම limit ගණන් කරන්න ඕනේ නෑ, කෙටි නීති තියෙනවා. xⁿ ගත්තොත් derivative එක n × xⁿ⁻¹, ඒ නිසා x² ට 2x, x³ ට 3x². නියත අංකයක derivative එක 0. f(x) = 3x² + 2x + 7 නම් f'(x) = 6x + 2. Loss එක (p − 5)² නම් derivative එක 2(p − 5); p = 8 දී +6, ඒ කියන්නේ p එක අඩු කරන්න ඕනේ. Sigmoid එකේ derivative එක උපරිම 0.25යි, ඒ නිසා layers ගොඩක් ගුණ වෙද්දී ඉතා පොඩි වෙනවා. ඒකයි ReLU එක (positive වලට derivative 1) ජනප්‍රිය වුණේ.

---

## 5. Reading a derivative

**Why it exists:** this turns the sign of a derivative into an action: go up, go down, or stop.

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

### Worked example

f(x) = x² − 4x + 5, so f'(x) = 2x − 4.

```
x = 0: f' = −4 (negative)  → function going down, so move x UP.   f(0) = 5
x = 1: f' = −2             →                                       f(1) = 2
x = 2: f' = 0  (flat)      → the bottom of the bowl.               f(2) = 1  ← minimum
x = 3: f' = +2 (positive)  → going up, so move x DOWN.            f(3) = 2
```

### Where you'll meet it in real work

A shop owner modelling profit as a function of price (toy numbers): P(p) = −2p² + 400p − 8000. P'(p) = −4p + 400 = 0 gives p = 100 and P(100) = −20000 + 40000 − 8000 = Rs. 12,000. Setting the derivative to zero finds the best price.

### Common mistakes

- Moving *with* the derivative when you want to minimise. To go down, move **against** it.
- Believing a zero derivative always means a minimum. For f(x) = x³ at x = 0 the slope is 0, but it is neither a minimum nor a maximum (see saddle points, section 14).

> **සිංහලෙන්:** Derivative එකේ ලකුණ බලලා ඉක්මනින් තීරණය කරන්න පුළුවන්. Positive නම් function එක උඩට යනවා, negative නම් පහළට, 0 නම් flat තැනක් (minimum, maximum හෝ වෙන flat තැනක්). Loss එක අඩු කරන්න නම් derivative එකේ විරුද්ධ පැත්තට යන්න ඕනේ. f(x) = x² − 4x + 5 ගත්තොත් f'(x) = 2x − 4, x = 0 දී −4 (negative) නිසා x එක වැඩි කරන්න ඕනේ. x = 2 දී derivative 0 සහ f = 1, ඒක minimum එක.

---

## 6. Gradient descent in one dimension

**Why it exists:** instead of guessing parameter values, gradient descent makes many tiny corrections, each one guided by the slope.

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

### Worked example 2: starting at w = 4, learning rate 0.25

Minimise L(w) = (w − 10)², so L'(w) = 2(w − 10).

```
step 0: w = 4     L' = 2(4−10)  = −12   w_new = 4 − 0.25×(−12)  = 4 + 3     = 7
step 1: w = 7     L' = 2(7−10)  = −6    w_new = 7 + 1.5                      = 8.5
step 2: w = 8.5   L' = 2(8.5−10)= −3    w_new = 8.5 + 0.75                   = 9.25
```

The remaining distance to 10 goes 6 → 3 → 1.5 → 0.75: it **halves** every step.

### Why the steps shrink: a pattern

For L(w) = (w − a)², each step multiplies the distance to the minimum by **(1 − 2·lr)**. With lr = 0.1, the factor is 0.8, so after 20 steps the distance is 3 × 0.8²⁰ ≈ 3 × 0.0115 = 0.035, which matches the table above (w ≈ 2.965).

### Where you'll meet it in real work

In PyTorch the loop is: compute the loss, call `loss.backward()` to get the gradients, then `optimizer.step()` applies `w = w − lr × grad` to every parameter.

### Common mistakes

- Adding the gradient instead of subtracting it (the loss then climbs, which is called gradient *ascent*).
- Stopping too early or too late. Watch the loss curve; stop when it flattens out.

**Exam angle:** be able to apply w_new = w_old − lr × gradient by hand, and to say that a gradient that is positive means the weight should decrease.

> **සිංහලෙන්:** Gradient descent එකේ rule එක සරලයි: w_new = w_old − lr × slope. L(w) = (w − 10)² වල w = 4 දී පටන් ගෙන lr = 0.25 ගත්තොත්: slope = −12, ඒ නිසා w = 4 + 3 = 7. ඊළඟට slope = −6, w = 8.5. ඊළඟට w = 9.25. හැම පියවරෙන්ම ඉතිරි දුර අඩකින් අඩු වෙනවා. Minimum එකට ළං වෙද්දී slope එක පොඩි වෙන නිසා පියවරත් ඉබේම පොඩි වෙනවා. Model එකක් train කරන loop එක මේකම, parameters ගොඩක් එක්ක.

---

## 7. The learning rate

**Why it exists:** the gradient tells you the *direction* to move, but not *how far*. The learning rate is how we choose the distance. **Try it yourself:** the interactive learning-rate lab below lets you change the learning rate and watch the steps.

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

### Worked example: the shrink factor for each learning rate

For L(w) = (w − 3)², each step multiplies the distance from 3 by (1 − 2·lr):

| lr | factor | what happens |
|---|---|---|
| 0.001 | 0.998 | tiny steps; after 25 steps the distance is 3 × 0.998²⁵ ≈ 2.85, so w ≈ 0.15 |
| 0.01 | 0.98 | slow; after 25 steps 3 × 0.98²⁵ ≈ 1.81, so w ≈ 1.19 |
| 0.1 | 0.8 | smooth and steady |
| 0.5 | 0 | lands exactly on 3 in one step (special to this simple bowl) |
| 1.0 | −1 | jumps 0 → 6 → 0 → 6 forever, never settles |
| 1.1 | −1.2 | the distance grows by 20% each step: it **diverges** |

**Check lr = 1.0 by hand:** w = 0, slope = 2(0 − 3) = −6, w_new = 0 − 1×(−6) = 6. Then slope = 2(6 − 3) = 6, w_new = 6 − 6 = 0. Back at the start.

### Where you'll meet it in real work

When fine-tuning an LLM with LoRA, a learning rate around 2e-4 is common; full fine-tuning of a large model usually needs a much smaller one, around 1e-5. Many training runs also use a **warm-up** (start small) and then a **decay** schedule.

### Common mistakes

- Copying a learning rate from another model without trying it. The best value depends on the model, data and optimiser.
- Not telling apart the symptoms: a loss that falls very slowly means lr is probably too small; a loss that jumps around or becomes NaN means it is too big.

**Exam angle:** know that too high a learning rate gives unstable training or divergence, too low gives slow training, and that the learning rate is a hyperparameter, not something learned from data.

> **සිංහලෙන්:** Learning rate එක කියන්නේ පියවරේ ප්‍රමාණය. ඒක ඔයා තෝරන setting එකක් (hyperparameter), model එක ඉගෙන ගන්නේ නෑ. L(w) = (w − 3)² වල lr = 0.001 දුන්නොත් පියවර 25කින් w = 0.15 විතරයි, හරිම හෙමින්. lr = 0.1 දුන්නොත් w ≈ 2.99, හරි. lr = 1.1 දුන්නොත් w එක 0 → 6.6 → −1.32 → 8.18 විදිහට වැඩි වෙලා පිපිරෙනවා (diverge). Training වලදී loss එක NaN වුණොත් මුලින්ම බලන්න learning rate එක වැඩියි ද කියලා. LLM fine-tune කරද්දී lr එක සාමාන්‍යයෙන් 1e-5 ඉඳන් 2e-4 දක්වා.

---

## 8. Partial derivatives

**Why it exists:** a real model has many parameters, and the loss depends on all of them. To know what each one does, we study them one at a time, freezing the others.

Real models have **many** parameters. For example, a line has two: y = w·x + b. The loss depends on both w and b.

**Idea:** a **partial derivative** is the slope with respect to **one** variable while keeping **all the others frozen**.

Notation: **∂** (a curly d, "partial"): ∂L/∂w = "partial derivative of L with respect to w".

**Analogy:** you're on a hill. The slope going **east** (holding north-south fixed) is one partial derivative; the slope going **north** (holding east-west fixed) is another.

**Example:** f(w, b) = w² + 3wb + b²
- ∂f/∂w: treat b as a constant number → 2w + 3b
- ∂f/∂b: treat w as a constant number → 3w + 2b

At (w=1, b=2): ∂f/∂w = 2 + 6 = 8; ∂f/∂b = 3 + 4 = 7.

### Worked example

f(w, b) = w²b

```
∂f/∂w = 2wb      (b is treated as a constant)
∂f/∂b = w²       (w is treated as a constant)
at (w=3, b=2):  ∂f/∂w = 2×3×2 = 12,   ∂f/∂b = 3² = 9
```

**Check ∂f/∂w numerically:** f(3, 2) = 18 and f(3.01, 2) = 9.0601 × 2 = 18.1202. The change is 0.1202, and 0.1202 ÷ 0.01 = 12.02 ≈ 12 ✓.

**Analogy:** a cook at a kottu stall adds a spoon more salt while keeping chilli and oil the same. How much the taste changes is the partial derivative for salt. Do the same for chilli and oil.

### Where you'll meet it in real work

A layer with 100,000 weights has 100,000 partial derivatives of the loss, one per weight. Backpropagation (section 12) computes all of them.

### Common mistakes

- Differentiating *every* letter when you should freeze the others.
- Using d instead of ∂ for several-variable functions (it is mostly a notation point, but it signals "there are other variables").

> **සිංහලෙන්:** Partial derivative එක කියන්නේ අනිත් variables ඔක්කොම නොවෙනස්ව තියලා එක variable එකක් වෙනස් කළාම කොහොමද වෙන්නේ කියන slope එක. කොත්තු කඩේ අයියා මිරිස්, තෙල් නොවෙනස්ව තියලා ලුණු හැන්දක් වැඩියෙන් දැම්මාම රසය කොච්චර වෙනස් වෙනවද කියන එක ලුණු වලට partial derivative එක. f(w, b) = w²b ගත්තොත් ∂f/∂w = 2wb සහ ∂f/∂b = w². (w = 3, b = 2) දී ඒවා 12 සහ 9. Model එකක parameters 100,000ක් තිබුණොත් partial derivatives 100,000ක් ලැබෙනවා.

---

## 9. The gradient

**Why it exists:** one slope per parameter is too many numbers to track separately. Bundling them into one vector gives a single "which way is uphill?" arrow.

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

### Worked example: one step with a gradient

L(w₁, w₂) = w₁² + w₂², so ∇L = [2w₁, 2w₂]. At (3, 1) the gradient is [6, 2].

```
loss before = 3² + 1² = 10
step (lr = 0.1):  [3, 1] − 0.1 × [6, 2] = [3 − 0.6, 1 − 0.2] = [2.4, 0.8]
loss after  = 2.4² + 0.8² = 5.76 + 0.64 = 6.4   ← lower ✓
```

w₁ moved more than w₂ because its slope (6) is steeper than w₂'s (2).

### Where you'll meet it in real work

**Gradient clipping** limits the length (norm, [file 05](05-math-linear-algebra.md#4-length-of-a-vector-norm)) of the gradient vector so that one huge gradient does not wreck training.

### Common mistakes

- Stepping *along* the gradient. It points uphill, so subtract it.
- Treating the gradient as a single number. It is a vector with one entry per parameter.

**Exam angle:** "the gradient points in the direction of steepest increase of the loss; gradient descent moves in the opposite direction."

> **සිංහලෙන්:** Gradient එක කියන්නේ හැම partial derivative එකම එකතු කරපු vector එක. ∇f = [∂f/∂w, ∂f/∂b]. ඒක වැඩියෙන්ම උඩට නගින දිශාව පෙන්වනවා, ඒ නිසා පල්ලම් යන්න ඕනේ නම් gradient එකේ විරුද්ධ පැත්තට යන්න ඕනේ. L = w1² + w2² වල (3, 1) දී gradient එක [6, 2], lr = 0.1 නම් [3, 1] − 0.1 × [6, 2] = [2.4, 0.8], loss එක 10 ඉඳන් 6.4 වෙනවා. Parameters හැමෙකක්ම එකම වෙලාවේ තමන්ගේ partial derivative එකෙන් update වෙනවා.

---

## 10. Gradient descent with two parameters

**Why it exists:** this shows real training in miniature: several parameters, all updated together from one gradient.

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

### Steps 3 and 4 of the same example

Continuing from w = 2.1, b = 1.05 (x = 2, y = 7, lr = 0.05):

```
step 3: pred = 2.1×2 + 1.05 = 5.25    err = −1.75    loss = 3.0625
        dw = 2×(−1.75)×2 = −7         db = 2×(−1.75) = −3.5
        w = 2.1 + 0.35 = 2.45         b = 1.05 + 0.175 = 1.225
step 4: pred = 2.45×2 + 1.225 = 6.125 err = −0.875   loss = 0.766
```

| Step | prediction | error | loss |
|---|---|---|---|
| 1 | 0 | −7 | 49 |
| 2 | 3.5 | −3.5 | 12.25 |
| 3 | 5.25 | −1.75 | 3.06 |
| 4 | 6.125 | −0.875 | 0.77 |

**Why the error halves each step:** the prediction changes by −lr × 2 × err × (x² + 1) = −0.05 × 2 × err × 5 = −0.5 × err. So half the error disappears every step.

A limit of this toy: with one data point, many (w, b) pairs fit perfectly (for example w = 3.5, b = 0). Real data has many points and pins the line down.

### Where you'll meet it in real work

This is how linear regression is trained when you choose gradient descent instead of the normal equation (file 12): a house-price model learns its weights from thousands of sales.

### Common mistakes

- Updating w first and then using the *new* w to compute b's gradient. Compute all gradients from the *old* values, then update together.
- Forgetting that features with big values (large x) make big gradients, so they need scaling (file 10).

> **සිංහලෙන්:** Parameters දෙකක් (w සහ b) එක්ක line එකක් ගැළපෙන්න ගමු: x = 2, y = 7. w = 0, b = 0, lr = 0.05 දී පළමු පියවරේ prediction 0, error −7, gradient [−28, −14], ඒ නිසා w = 1.4 සහ b = 0.7. ඊළඟ පියවරේ prediction 3.5, error −3.5. Error එක හැම පියවරකම අඩකින් අඩු වෙනවා: −7, −3.5, −1.75, −0.875. w, b දෙකම එකම වෙලාවේ update වෙනවා. x ලොකු නම් w එකේ gradient ලොකුයි, ඒකයි features scale කරන්න ඕනේ.

---

## 11. The chain rule

**Why it exists:** a network is a long chain of functions, one layer feeding the next. To know how a weight in the first layer affects the final loss, we have to follow the effect along the whole chain. The chain rule does that.

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

### Worked example 3: a longer chain

y = (x² + 1)³

```
u = x² + 1        du/dx = 2x
y = u³            dy/du = 3u²
dy/dx = 3u² × 2x = 6x(x² + 1)²
at x = 1: 6 × 1 × (1+1)² = 6 × 4 = 24
```

**Check numerically:** f(1) = 8; f(1.01) = (2.0201)³ ≈ 8.2436. The change 0.2436 ÷ 0.01 ≈ 24.4 ≈ 24 ✓.

**Money analogy:** one US dollar is Rs. 300, and a 10% tax is added to the rupee price. Each extra dollar of the item's price raises your final rupee bill by 300 × 1.1 = **Rs. 330**. Rates multiply along the chain.

### Vanishing and exploding, in numbers

```
0.25 multiplied 20 times: 0.25²⁰ ≈ 9 × 10⁻¹³    (practically 0 → vanishing)
1.5 multiplied 20 times:  1.5²⁰  ≈ 3,325         (huge → exploding)
```

### Where you'll meet it in real work

Deep network design tricks exist because of this: ReLU activations, careful weight initialisation and **residual connections** (used in transformers) all help gradients survive a long chain.

### Common mistakes

- Adding the rates instead of multiplying them.
- Forgetting the **inner** derivative. d/dx of (3x + 1)² is 2(3x + 1) × **3**, not just 2(3x + 1).

**Exam angle:** vanishing/exploding gradients come from multiplying many small/large numbers through many layers. Know the causes and the fixes (ReLU, residual connections, normalisation, gradient clipping).

> **සිංහලෙන්:** Chain rule එක කියන්නේ දාමයක හැම පියවරකම වෙනස් වීමේ වේගය ගුණ කරන එක. ඩොලරයක් Rs. 300යි, ඒකට tax 10%ක් එකතු වෙනවා නම් ඩොලර් 1ක් වැඩි වුණාම bill එක 300 × 1.1 = Rs. 330කින් වැඩි වෙනවා. y = (3x + 1)² වල ඇතුළත 3x + 1 ට derivative 3, පිටත u² ට 2u, ඒ නිසා 2u × 3 = 6(3x + 1). Neural network එකත් දිග දාමයක්, ඒ නිසා chain rule එකෙන් හැම layer එකකම weight එකකට loss එක බලපාන ආකාරය හොයනවා. 0.25 ගුණ 20ක් ගුණ කළොත් ඉතා පොඩි වෙනවා (vanishing gradients), 1.5 ගුණ 20ක් ගුණ කළොත් 3,300ක් විතර (exploding).

---

## 12. Computational graphs and backpropagation

**Why it exists:** a network has billions of weights. Working out each one's derivative from scratch would take forever. Backpropagation reuses the work done for later nodes, so one backward sweep covers them all.

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

### Another worked example: a tiny two-weight chain

Network: h = w₁·x, out = w₂·h, loss L = (out − y)². Take x = 1, y = 5, w₁ = 2, w₂ = 3.

```
Forward:   h = 2×1 = 2     out = 3×2 = 6     L = (6−5)² = 1
Backward:  dL/dout = 2(out − y) = 2
           dL/dw₂  = dL/dout × h  = 2 × 2 = 4
           dL/dh   = dL/dout × w₂ = 2 × 3 = 6
           dL/dw₁  = dL/dh × x    = 6 × 1 = 6
Update (lr = 0.05):  w₂ = 3 − 0.05×4 = 2.8,   w₁ = 2 − 0.05×6 = 1.7
New forward: h = 1.7, out = 2.8×1.7 = 4.76, L = (4.76−5)² = 0.0576  ← from 1 down to 0.06
```

Notice that dL/dh (6) was computed once and reused for w₁.

### Where you'll meet it in real work

The forward pass has to store its intermediate values, because the backward pass needs them. That is a main reason **training uses much more GPU memory than inference**.

### Common mistakes

- Thinking backpropagation is "the learning". It only *computes the gradients*. The **optimiser** (SGD, Adam) then uses them to update the weights.
- In PyTorch, forgetting `optimizer.zero_grad()`: gradients are *accumulated* by default, so old ones pollute the new step.

**Exam angle:** forward pass computes predictions and loss; backward pass computes gradients with the chain rule; the optimiser updates the weights. Expect to be asked which step does what.

> **සිංහලෙන්:** Backpropagation කියන්නේ forward pass එකේ අගයන් ගන්න පස්සේ chain rule එක පස්සට යවලා හැම parameter එකකම gradient එක හොයන එක. Forward pass එකේදී L = (w·x + b − y)² සඳහා w = 1, b = 1, x = 2, y = 7 නම් p = 3, e = −4, L = 16. Backward එකේදී dL/de = 2e = −8, ඒ නිසා dL/db = −8 සහ dL/dw = −8 × 2 = −16. හැම node එකක්ම ඊළඟ node එකේ ලැබුණු gradient එක නැවත පාවිච්චි කරන නිසා එක backward pass එකෙන් හැම parameter එකකම gradient එක ලැබෙනවා. Backprop එකෙන් gradient එක හොයනවා විතරයි, weights update කරන්නේ optimiser එක.

---

## 13. Automatic differentiation in code

**Why it exists:** nobody differentiates a 70-billion-parameter model by hand. Autodiff lets you write only the forward calculation and get every gradient for free.

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

### Worked example: a whole training loop in PyTorch

```python
import torch                              # PyTorch library

w = torch.tensor(0.0, requires_grad=True) # start at w = 0, and track its gradient
lr = 0.1                                  # learning rate

for step in range(25):                    # repeat 25 times
    L = (w - 3) ** 2                      # forward pass: the loss (w - 3)^2
    L.backward()                          # backward pass: fills w.grad with dL/dw
    with torch.no_grad():                 # do not track the update itself
        w -= lr * w.grad                  # gradient descent update
    w.grad.zero_()                        # clear the gradient, or it would pile up

print(w.item())                           # about 2.99, the same as our hand calculation
```

### Where you'll meet it in real work

Every PyTorch training script contains the same four ideas: forward pass, `loss.backward()`, `optimizer.step()`, `optimizer.zero_grad()`. When you only want predictions (inference), wrapping the code in `torch.no_grad()` skips the graph building and saves memory.

### Common mistakes

- Forgetting to zero the gradients between steps.
- Calling `.backward()` twice on the same graph without need (it errors, or accumulates).
- Trying to call `.backward()` on something that has no `requires_grad`.

**Exam angle:** know the names: *autograd* is PyTorch's automatic differentiation; `requires_grad=True` marks a tensor to track; `.backward()` computes gradients; `.grad` stores them.

> **සිංහලෙන්:** PyTorch වගේ libraries වලට ඔයා forward ගණන ලියුවම ඒවා තනියම backward එකත් කරනවා, ඒකට කියන්නේ autodiff. w = 1, b = 1, x = 2, y = 7 දී L = 16 ලැබෙනවා, L.backward() කළාම w.grad = −16 සහ b.grad = −8, අපි අතින් හොයපු අගයන්ම. Training loop එකේදී හැම පියවරකටම කලින් optimizer.zero_grad() කරන්න ඕනේ, නැත්නම් gradients එකතු වෙමින් යනවා. Prediction කරද්දී (inference) torch.no_grad() දැම්මොත් memory ඉතුරු වෙනවා.

---

## 14. Loss landscapes

**Why it exists:** it explains why training sometimes stalls or ends up in different places. Knowing the shapes of the landscape tells you what the optimiser tricks are for.

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

### Worked example 1: two valleys

f(w) = w⁴ − 2w²

```
f'(w) = 4w³ − 4w = 4w(w² − 1) = 0   →  w = 0, w = 1, w = −1
f(1) = 1 − 2 = −1   f(−1) = −1   (two equal valleys)
f(0) = 0                         (a hilltop between them)
```

Start gradient descent at w = 2 and you slide to w = 1; start at w = −2 and you slide to w = −1. The starting point decides which valley you reach.

### Worked example 2: a saddle point

f(x, y) = x² − y², gradient ∇f = [2x, −2y]. At (0, 0) the gradient is [0, 0], yet it is **not** a minimum: moving along x goes up (x² grows), moving along y goes down (−y² falls).

### Where you'll meet it in real work

When a training loss sits almost still for hours, it may be on a plateau or near a saddle point. Changing the learning rate, adding momentum or switching to Adam often gets it moving.

### Common mistakes

- Believing local minima are the biggest enemy of neural networks. In very high dimensions saddle points and plateaus matter more.
- Expecting the loss to reach exactly 0. It usually will not (and if the *training* loss reaches 0 while the validation loss rises, that is overfitting).

**Exam angle:** know SGD (random mini-batches), momentum (keeps previous direction), Adam (per-parameter adaptive step sizes), and that convex losses (linear/logistic regression) have a single global minimum.

> **සිංහලෙන්:** Loss landscape එක කියන්නේ parameters වෙනස් වෙද්දී loss එක කඳු සහ පල්ලම් වගේ හැදෙන විදිහ. Global minimum එක කියන්නේ ඇත්තටම පහළම තැන, local minimum එක කියන්නේ අවට වලට වඩා පහළ ඒත් ඇත්තටම පහළම නෙවෙයි. Saddle point එකේ gradient එක 0 වුණාට ඒක minimum එකක් නෙවෙයි, f(x, y) = x² − y² වල (0, 0) වගේ, x පැත්තට පල්ලම්, y පැත්තට කන්ද. Linear regression වල loss එක convex (බඩියක් වගේ එකක්), ඒ නිසා gradient descent හැමවිටම හොඳම එක සොයාගන්නවා. Neural networks non-convex වුණාට SGD, momentum සහ Adam පාවිච්චි කරලා හොඳ ප්‍රතිඵල ගන්න පුළුවන්.

---

## 15. Integrals (just the idea)

**Why it exists:** sometimes you need a total built up from many tiny pieces: total distance from changing speed, or total probability over a range.

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

### Worked example 1: changing speed

A bus travels at 40 km/h for 1 hour, then 60 km/h for 2 hours. The area under the speed graph is the distance:

```
40 × 1 + 60 × 2 = 40 + 120 = 160 km
```

### Worked example 2: probability as area

A value is equally likely anywhere between 0 and 10 (a *uniform* distribution), so its curve is a flat line of height 1/10 = 0.1 (total area 10 × 0.1 = 1). The probability of landing between 2 and 5 is the area of that slice: 0.1 × (5 − 2) = **0.3**.

**Derivative and integral are opposites:** the derivative of distance is speed; the integral of speed is distance.

### Common mistakes

- Mixing up the two: derivative = slope (rate), integral = area (total).
- Thinking you must integrate by hand. Libraries and formulas do it for you.

**Exam angle:** **AUC** (area under the ROC curve): 0.5 means a model no better than random guessing, 1.0 means a perfect ranking.

> **සිංහලෙන්:** Integral එකක් කියන්නේ curve එකක් යට වපසරිය, එකතු කරපු මුළු ප්‍රමාණය. බස් එකක් පැයට km 40න් පැයක් සහ km 60න් පැය 2ක් ගියොත් මුළු දුර 40 + 120 = km 160, ඒක speed graph එක යට වපසරියයි. Probability වලදී 0 ඉඳන් 10 දක්වා ඒකාකාරව ඇති අගයකට 2 සහ 5 අතර වීමේ probability එක 0.1 × 3 = 0.3. AUC එකේ 0.5 කියන්නේ අහඹු අනුමානයක්, 1.0 කියන්නේ සම්පූර්ණයෙන් හරි. මේවා අතින් ගණන් කරන්න ඕනේ නෑ, 'integral = වපසරිය' කියලා මතක තියාගන්න.

---

## 16. Optional extras

**Why it exists:** these names appear in papers and documentation. This section gives you just enough to read them without panic.

You'll see these names. Here is the gist so they don't scare you.

- **Taylor series:** approximating a complicated function near a point using simple polynomial terms: f(x+h) ≈ f(x) + f'(x)·h + ½f''(x)·h² + ... The first two terms say "near a point, every smooth curve looks like a straight line". That's *why* gradient descent with small steps works.
- **Second derivative (f''):** the slope of the slope; how fast the slope changes (curvature). Positive means curving up (a bowl).
- **Jacobian:** a matrix of all partial derivatives when a function has many inputs **and** many outputs.
- **Hessian:** a matrix of all second derivatives; describes the curvature of the loss landscape. Too expensive to compute for big networks, which is why we use first-order methods like SGD and Adam.
- **Lagrange multipliers:** a technique for minimising something **subject to a constraint** (e.g. "maximise profit, but spending ≤ $100"). Used in deriving SVMs (file 12).

### Worked example: a Taylor approximation

f(x) = x² near x = 3, with a step h = 0.1:

```
exact:           f(3.1) = 9.61
first-order:     f(3) + f'(3)·h               = 9 + 6×0.1       = 9.6
second-order:    ... + ½·f''(3)·h²   (f'' = 2)  = 9.6 + 0.5×2×0.01 = 9.61   ✓ exact here
```

Close to a point, the straight-line (first-order) guess is already good. That is why small gradient descent steps work.

### How big are these objects?

- A function with 3 inputs and 2 outputs has a **Jacobian** of shape 2 × 3.
- A model with n parameters has a **Hessian** of shape n × n. For n = 1 billion that is 10⁹ × 10⁹ = **10¹⁸** numbers, far too many to store. This is why practical training uses first-order methods (SGD, Adam).

### Common mistakes

- Thinking you need to master these before moving on. You do not; the previous sections are what the exam and daily work use.

**Exam angle:** Adam and SGD are *first-order* optimisers (they use the gradient only). Second-order methods use curvature (the Hessian) but are too expensive for large networks.

> **සිංහලෙන්:** මේ නම් ටික ඔයාට පොත්වල හමුවෙනවා, බය වෙන්න එපා. Taylor series එකෙන් කියන්නේ එක තැනක් අවට ඕනෑම සුමට වක්‍රයක් ඍජු රේඛාවක් වගේ කියලා, ඒ නිසා පොඩි පියවරවලින් gradient descent වැඩ කරනවා. x² වල x = 3 දී h = 0.1 නම්, 9 + 6 × 0.1 = 9.6, දෙවෙනි derivative එකත් එකතු කළාම 9.61, හරියටම f(3.1). Jacobian සහ Hessian කියන්නේ derivatives වල matrices. Parameters බිලියන 1ක් තිබුණොත් Hessian එකේ අගයන් 10^18ක් වෙන නිසා ලොකු networks වලට Adam, SGD වගේ first-order methods පාවිච්චි කරනවා.

```quiz
[{"q": "What is the derivative of f(x) = 5x² − 3x at x = 2?", "options": ["17", "20", "7", "10"], "answer": 0, "why": "f'(x) = 10x − 3, so f'(2) = 20 − 3 = 17. 20 forgets the −3 term."}, {"q": "The gradient of the loss with respect to a weight is −4. What should gradient descent do to that weight?", "options": ["Decrease it", "Leave it alone", "Increase it", "Set it to zero"], "answer": 2, "why": "w_new = w − lr × (−4) = w + 4·lr, so the weight goes up. A negative slope means the loss falls as w rises. Decreasing it would be moving uphill."}, {"q": "One gradient descent step on L(w) = (w − 1)² from w = 5 with lr = 0.1. What is the new w?", "options": ["5.8", "4.8", "3.0", "4.2"], "answer": 3, "why": "L'(5) = 2(5 − 1) = 8. w_new = 5 − 0.1 × 8 = 4.2. 5.8 comes from adding the gradient instead of subtracting it."}, {"q": "Training with lr = 1.1 on L(w) = (w − 3)² makes the loss explode. Why?", "options": ["The loss function is not differentiable", "Each step overshoots and lands farther from the minimum than it started", "The gradient is zero", "The model has too few parameters"], "answer": 1, "why": "Each step multiplies the distance by (1 − 2×1.1) = −1.2. Its size grows by 20% every step, so it diverges. The gradient is not zero here; it grows."}, {"q": "Use the chain rule: what is dy/dx for y = (2x + 1)³ at x = 0?", "options": ["3", "2", "1", "6"], "answer": 3, "why": "u = 2x + 1, dy/du = 3u², du/dx = 2. At x = 0, u = 1, so dy/dx = 3 × 1 × 2 = 6. Forgetting the inner derivative gives 3."}, {"q": "What is the gradient of f(w₁, w₂) = w₁² + w₂² at (3, 1)?", "options": ["[6, 2]", "[3, 1]", "[9, 1]", "[2, 2]"], "answer": 0, "why": "∇f = [2w₁, 2w₂] = [6, 2]. [9, 1] is just f's squared terms, not the derivatives."}, {"q": "What does backpropagation do, and what does the optimiser do?", "options": ["Backprop updates the weights; the optimiser computes the gradients", "Backprop computes the gradients; the optimiser uses them to update the weights", "Both compute the forward pass", "Backprop picks the learning rate; the optimiser picks the loss"], "answer": 1, "why": "Backprop applies the chain rule backwards to get gradients for every weight. The optimiser (SGD, Adam) then updates the weights. The first option reverses the roles."}, {"q": "Why did ReLU replace sigmoid in most deep networks?", "options": ["ReLU outputs are always between 0 and 1", "Sigmoid cannot be differentiated", "ReLU has a derivative of 1 for positive inputs, so gradients do not shrink through many layers", "ReLU makes the loss convex"], "answer": 2, "why": "Sigmoid's derivative is at most 0.25, so multiplying many of them gives vanishing gradients. Sigmoid can be differentiated; that is not the problem. ReLU does not make the loss convex."}]
```

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

**Q10.** For L(w) = (w − 3)², what happens with learning rate 0.5 starting at w = 0?
<details><summary>Answer</summary>L'(0) = −6, so w_new = 0 − 0.5 × (−6) = **3**. It lands exactly on the minimum in one step (a special case of this simple bowl shape).</details>

**Q11.** For f(w, b) = w²b, take one gradient descent step from (w, b) = (3, 2) with learning rate 0.1.
<details><summary>Answer</summary>∇f = [2wb, w²] = [12, 9]. New w = 3 − 0.1×12 = **1.8**; new b = 2 − 0.1×9 = **1.1**.</details>

**Q12.** In a PyTorch training loop, what goes wrong if you never zero the gradients?
<details><summary>Answer</summary>PyTorch accumulates gradients across `.backward()` calls, so each step would use the sum of all past gradients, giving wrong, ever-growing updates.</details>

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
| Finite difference | Estimating a derivative with a tiny step: (f(x+h) − f(x)) / h |
| Convergence | The loss stops improving; training has settled |
| Shrink factor | How much a step multiplies the distance to the minimum, 1 − 2·lr in the (w − a)² example |
| `zero_grad()` / `torch.no_grad()` | PyTorch: clear stored gradients / stop tracking gradients (saves memory) |
| Warm-up and decay | Learning rate schedule: start small, then reduce over time |
| First-order method | Optimiser that uses only the gradient (SGD, Adam) |

**Next:** [07-math-probability-statistics.md](07-math-probability-statistics.md)
