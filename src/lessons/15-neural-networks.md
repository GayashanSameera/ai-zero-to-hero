# 15: Neural Networks and Deep Learning Basics

> **Before you start:** [04](04-math-numbers-and-functions.md) (sigmoid, ReLU, tanh, exp, log), [05](05-math-linear-algebra.md) (matrix multiplication, a layer = W·x + b, tensors, GPUs), [06](06-math-calculus.md) (gradient descent, chain rule, backpropagation, vanishing gradients, autograd), [07](07-math-probability-statistics.md) (softmax, cross-entropy, normal distribution), [11](11-ml-fundamentals.md) (loss, mini-batches, epochs, overfitting, regularisation, early stopping), [12](12-supervised-learning-algorithms.md) (logistic regression).
>
> **After this file you can:** explain how a neural network works from a single neuron to a deep network; compute a forward and backward pass by hand; choose activations, losses, optimisers, learning-rate schedules, initialisation, dropout and normalisation; and write a complete training loop in PyTorch, on a GPU, with mixed precision.

This file starts **Part D: Deep Learning**. Everything about LLMs builds on it.

---

## Table of contents

1. [From brain cells to artificial neurons](#1-from-brain-cells-to-artificial-neurons)
2. [The perceptron and its limits](#2-the-perceptron-and-its-limits)
3. [Multi-layer perceptrons (MLPs)](#3-multi-layer-perceptrons)
4. [Why we need non-linear activations](#4-why-we-need-non-linear-activations)
5. [Activation functions](#5-activation-functions)
6. [Output layers and loss functions](#6-output-layers-and-loss-functions)
7. [Forward pass: a full worked example](#7-forward-pass-worked-example)
8. [Backpropagation: a full worked example](#8-backpropagation-worked-example)
9. [Optimisers: SGD, Momentum, RMSProp, Adam, AdamW](#9-optimisers)
10. [Learning rate schedules and warmup](#10-learning-rate-schedules)
11. [Weight initialisation](#11-weight-initialisation)
12. [Vanishing and exploding gradients; gradient clipping](#12-vanishing-and-exploding-gradients)
13. [Regularisation in deep learning: dropout, weight decay, early stopping](#13-regularisation-in-deep-learning)
14. [Normalisation layers: BatchNorm, LayerNorm, RMSNorm](#14-normalisation-layers)
15. [Residual (skip) connections](#15-residual-connections)
16. [Embedding layers](#16-embedding-layers)
17. [Deep learning frameworks](#17-deep-learning-frameworks)
18. [PyTorch essentials](#18-pytorch-essentials)
19. [A complete training loop (MNIST)](#19-a-complete-training-loop)
20. [GPUs, memory and mixed precision](#20-gpus-memory-and-mixed-precision)
21. [Debugging neural networks](#21-debugging-neural-networks)
22. [Check yourself](#22-check-yourself)
23. [New words in this file](#23-new-words-in-this-file)

---

## 1. From brain cells to artificial neurons

**Why it exists:** computers are good at exact rules but poor at fuzzy judgements such as "is this email spam?" or "will this customer leave?". The brain solves fuzzy problems by combining many weak signals. The artificial neuron copies that one idea in the simplest possible form: weigh the evidence, add it up, decide.

A **biological neuron** receives signals from other neurons through **dendrites**, adds them up in the cell body, and if the total is strong enough, **fires** a signal down its **axon** to other neurons. Your brain has ~86 billion of them.

An **artificial neuron** is a very simplified maths version:

```
 inputs     weights
  x₁ ──── w₁ ──┐
  x₂ ──── w₂ ──┤
  x₃ ──── w₃ ──┼──► Σ (weighted sum + bias) ──► activation f ──► output a
               │         z = w·x + b               a = f(z)
         b ────┘
```

1. Multiply each input by its **weight** (how important it is)
2. Add them up and add a **bias** → **z = w·x + b** (a dot product, [file 05](05-math-linear-algebra.md#6-the-dot-product))
3. Pass z through an **activation function** f → output **a = f(z)**

**You already know one neuron!** With a sigmoid activation, a single neuron is exactly **logistic regression** ([file 12](12-supervised-learning-algorithms.md#3-logistic-regression)).

**Worked example:** inputs x = [2, 3], weights w = [0.5, −1], bias b = 1, activation ReLU
- z = 0.5×2 + (−1)×3 + 1 = 1 − 3 + 1 = −1
- a = ReLU(−1) = **0** (the neuron stays "off")

### Worked example: a neuron that decides whether to buy lunch

You are deciding whether to buy a rice packet. Inputs (each from 0 to 10): hunger x₁ = 8, price-is-cheap x₂ = 3, shop-is-close x₃ = 6. Weights (importance): w₁ = 0.6, w₂ = 0.3, w₃ = 0.1. Bias b = −4 (you need strong reasons before you spend).

1. z = 0.6 × 8 + 0.3 × 3 + 0.1 × 6 + (−4) = 4.8 + 0.9 + 0.6 − 4 = **2.3**
2. With sigmoid: a = 1 ÷ (1 + e⁻²·³) = 1 ÷ (1 + 0.100) = **0.91** → "91% yes, buy it".
3. Change hunger to 2: z = 1.2 + 0.9 + 0.6 − 4 = −1.3 → a = 1 ÷ (1 + e¹·³) = 1 ÷ (1 + 3.67) = **0.21**. You skip lunch.

Training a neuron means finding the weights and bias that make such decisions match real examples.

### The same worked example, with different activations

Back to the first example (z = −1). The activation changes only the last step:

| Activation | Calculation | Output |
|---|---|---|
| ReLU | max(0, −1) | **0** |
| Sigmoid | 1 ÷ (1 + e¹) = 1 ÷ 3.718 | **0.27** |
| Tanh | (e⁻¹ − e¹) ÷ (e⁻¹ + e¹) | **−0.76** |

**Where you'll meet it in real work:** every neural network, from a bank's fraud scorer to ChatGPT, is built from billions of these tiny weighted sums. Understanding one neuron is understanding the Lego brick.

**Common mistakes:**
- **Thinking a neuron "thinks" like a brain cell.** It is only a weighted sum plus a squashing function.
- **Forgetting the bias.** Without b, the decision line must pass through the origin, which limits what the neuron can learn.
- **Mixing up weights and inputs.** Inputs come from the data and are fixed; weights are the parameters that training changes.

**Exam angle:** be ready to compute z = w·x + b and the activation output for small numbers, and to say that a single sigmoid neuron equals logistic regression.

> **සිංහලෙන්:** Artificial neuron එකක් කියන්නේ සාක්ෂි කිහිපයක් බර දීලා එකතු කරලා තීරණයක් ගන්න පොඩි ගණිත කොටසක්. බත් පැකට් එකක් ගන්නද කියලා හිතන්න: බඩගින්න 8, මිල අඩුයි 3, කඩේ ළඟයි 6. බඩගින්නට බර 0.6, මිලට 0.3, ළඟට 0.1, bias එක −4. එකතුව z = 4.8 + 0.9 + 0.6 − 4 = 2.3, sigmoid දැම්මාම 0.91, ඒ කියන්නේ 91%ක් "ගන්නවා". බඩගින්න 2ට අඩු වුණොත් z = −1.3 වෙලා 0.21යි, එතකොට ගන්නේ නෑ. Training කියන්නේ ඇත්ත උදාහරණ වලට ගැළපෙන විදිහට මේ weights සහ bias හොයන එක.

---

## 2. The perceptron and its limits

**Why it exists:** before neural networks, researchers asked a simple question: can a machine learn a rule from examples instead of being programmed? The perceptron was the first yes. Its famous failure on XOR then showed why we need more than one layer.

The **perceptron** (Rosenblatt, 1958) was the first neuron model: a weighted sum followed by a **step function** (output 1 if z > 0, else 0). It can learn any **linearly separable** problem (one where a straight line can separate the classes).

**AND gate:** output 1 only if both inputs are 1. Weights w = [1, 1], b = −1.5:
- (0,0): z = −1.5 → 0 ✓; (1,0): −0.5 → 0 ✓; (0,1): −0.5 → 0 ✓; (1,1): 0.5 → 1 ✓

**The XOR problem:** XOR outputs 1 when exactly one input is 1.

```
x₂
1 │ ●(1)     ○(0)
  │
0 │ ○(0)     ●(1)
  └──────────────── x₁
    0        1
```

No single straight line separates the ● from the ○. A single perceptron **cannot** learn XOR. This finding (1969) contributed to the first "AI winter", a period when funding and interest in AI collapsed.

**The fix:** stack neurons into **layers**. Two layers can solve XOR.

### Worked example: the perceptron learning rule

The rule: for each example, compute ŷ = step(w·x + b). Then update **w ← w + η(y − ŷ)x** and **b ← b + η(y − ŷ)**. Learn the AND gate with η = 1, starting at w = [0, 0], b = 0.

1. Example (1,1), y = 1: z = 0 → ŷ = 0 (step needs z > 0). Error = 1 − 0 = +1. w = [0,0] + 1×[1,1] = **[1,1]**, b = **1**.
2. Example (0,0), y = 0: z = 0 + 1 = 1 → ŷ = 1. Error = 0 − 1 = −1. w = [1,1] + (−1)×[0,0] = [1,1], b = 1 − 1 = **0**.
3. Example (1,0), y = 0: z = 1 + 0 = 1 → ŷ = 1. Error = −1. w = [1,1] − [1,0] = **[0,1]**, b = **−1**.
4. Keep cycling through the four examples. For AND (which is linearly separable) the weights eventually stop changing, with a result like w = [1,1], b = −1.5 that reproduces the table above.

The key point: the weights move **only when the answer is wrong**.

### Worked example: solving XOR with two layers

XOR cannot be made by one line, but it equals **(x₁ OR x₂) AND NOT (x₁ AND x₂)**. Build it with 2 hidden neurons: h₁ = OR (w = [1,1], b = −0.5), h₂ = NAND (w = [−1,−1], b = 1.5), output = AND of h₁ and h₂ (w = [1,1], b = −1.5), all with a step function.

Row by row:
- (0,0): h₁: −0.5 → 0; h₂: 1.5 → 1; out: 0 + 1 − 1.5 = −0.5 → **0** ✓
- (1,0): h₁: 0.5 → 1; h₂: −1 + 1.5 = 0.5 → 1; out: 1 + 1 − 1.5 = 0.5 → **1** ✓
- (0,1): same as (1,0) → **1** ✓
- (1,1): h₁: 1.5 → 1; h₂: −2 + 1.5 = −0.5 → 0; out: 1 + 0 − 1.5 = −0.5 → **0** ✓

The hidden layer re-draws the problem so that a single line can finish the job. That is the whole idea of deep learning in miniature.

**Where you'll meet it in real work:** the perceptron is rarely used directly, but its update idea (change weights in proportion to the error) lives on in every training algorithm. XOR-style problems appear whenever two features matter only in combination (for example, a loan being risky only when income is low **and** debt is high).

**Common mistakes:**
- **Saying "neural networks can't learn XOR".** Only a **single-layer** perceptron cannot.
- **Believing the AI winter was caused by one theorem.** It was one factor among funding, hardware and over-promising.

**Exam angle:** "why can't a single perceptron learn XOR?" Answer: XOR is not linearly separable. Adding a hidden layer with a non-linear activation fixes it.

> **සිංහලෙන්:** Perceptron එක කියන්නේ පළවෙනි neuron model එක. ඒකට කරන්න පුළුවන් රේඛාවකින් වෙන් කරන්න පුළුවන් (linearly separable) ප්‍රශ්න විතරයි, AND gate එක වගේ. හැබැයි XOR කියන්නේ කෙළින් රේඛාවකින් වෙන් කරන්න බැරි ප්‍රශ්නයක්, ඒ නිසා එක neuron එකකට ඒක බෑ. විසඳුම layers දෙකක් දාන එක: hidden layer එකේ OR සහ NAND neurons දෙකක්, output එකේ AND එකක්. එතකොට (1,0) සහ (0,1) වලට 1, (0,0) සහ (1,1) වලට 0 ලැබෙනවා. Perceptron එක වැරදුණාම විතරයි weights වෙනස් කරන්නේ.

---

## 3. Multi-layer perceptrons

**Why it exists:** one neuron draws one straight line. Real problems (recognising a face, reading a sentence) need many layers of neurons, each building on the last. An MLP is the basic way of stacking neurons into such a team.

A **Multi-Layer Perceptron (MLP)**, also called a **feed-forward neural network** or **fully connected network**, has layers of neurons:

```
 Input layer      Hidden layer 1     Hidden layer 2     Output layer
  (features)        (4 neurons)        (3 neurons)       (2 classes)

    x₁ ─────┬──────► ○ ─────┬──────► ○ ─────┬──────► ○  P(cat)
            ├──────► ○ ─────┼──────► ○ ─────┤
    x₂ ─────┼──────► ○ ─────┼──────► ○ ─────┴──────► ○  P(dog)
            └──────► ○ ─────┘
    x₃ ─────┘
   (every neuron connects to every neuron in the next layer)
```

- **Input layer:** just the input features (no calculation)
- **Hidden layers:** in between; they learn intermediate representations
- **Output layer:** the final prediction
- **Dense / fully connected / linear layer:** every input connects to every neuron
- **Deep** network: many hidden layers. That's the "deep" in deep learning.

### Each layer is a matrix multiplication

From [file 05](05-math-linear-algebra.md#12-a-neural-network-layer-is-a-matrix-multiplication): a layer with n_in inputs and n_out neurons has a weight matrix **W** of shape (n_out × n_in) and a bias vector **b** of length n_out:

```
h = f(W·x + b)
```

The whole network is a **composition** of functions ([file 04](04-math-numbers-and-functions.md#6-functions)):

```
ŷ = f₃(W₃ · f₂(W₂ · f₁(W₁·x + b₁) + b₂) + b₃)
```

### Counting parameters

A layer with n_in inputs and n_out outputs has **n_in × n_out weights + n_out biases**.

**Example:** 784 inputs (a 28×28 image) → 128 hidden → 64 hidden → 10 outputs:
- Layer 1: 784 × 128 + 128 = 100,480
- Layer 2: 128 × 64 + 64 = 8,256
- Layer 3: 64 × 10 + 10 = 650
- **Total: 109,386 parameters**

(For comparison, a small LLM has ~1 billion parameters; big ones have hundreds of billions.)

### Representation learning

Each hidden layer **transforms** the data into a new representation that makes the task easier. In image networks, early layers learn edges, middle layers learn shapes (eyes, wheels), and later layers learn whole objects (faces, cars). Nobody programs these features; the network **learns** them from data. This is the key advantage of deep learning over the hand-made feature engineering of [file 10](10-data-science-workflow.md#11-creating-new-features).

### Universal approximation theorem

An MLP with **one** hidden layer and enough neurons can approximate **any** continuous function as closely as you like. In practice, **deeper** networks learn far more efficiently than very wide shallow ones.

### Worked example: counting parameters and memory

A small network: 3 inputs → 4 hidden → 3 hidden → 2 outputs.
- Layer 1: 3 × 4 + 4 = 16
- Layer 2: 4 × 3 + 3 = 15
- Layer 3: 3 × 2 + 2 = 8
- **Total: 39 parameters**

Memory for the earlier 109,386-parameter network: each parameter is a 32-bit float (4 bytes), so 109,386 × 4 = 437,544 bytes ≈ **0.44 MB**. Now a 7-billion-parameter LLM stored as 16-bit numbers (2 bytes each): 7,000,000,000 × 2 = 14,000,000,000 bytes = **14 GB**. That is why big models need big GPUs.

### Worked example: following the shapes

A batch of 32 MNIST images, each flattened to 784 numbers, goes through 784 → 128 → 10:

```
input        (32, 784)
× W₁ᵀ        (784, 128)  →  (32, 128)    + b₁ (128)    ReLU
× W₂ᵀ        (128, 10)   →  (32, 10)     + b₂ (10)     = 10 scores per image
```

Each of the 32 rows is processed independently, but as one big matrix multiplication, which is exactly what GPUs are fast at.

**Where you'll meet it in real work:** the "head" of almost every model (the last few dense layers that turn features into a prediction) is an MLP. Inside every transformer block there is also an MLP, and it holds about two thirds of the block's parameters.

**Common mistakes:**
- **Counting only weights and forgetting biases.**
- **Believing "deeper is always better".** More layers also mean more data, more compute and harder training.
- **Mixing up input size and batch size.** Batch size is how many examples at once; input size is features per example.

**Exam angle:** typical questions ask you to count parameters from layer sizes, and to state what hidden layers do (learn intermediate representations).

> **සිංහලෙන්:** MLP එකක් කියන්නේ neurons layers කිහිපයකට තියලා හදපු network එකක්. හැම layer එකක්ම කරන්නේ matrix එකක් එක්ක ගුණ කරලා bias එකතු කරලා activation එකක් දාන එක. Parameters ගණන් කරන්න: inputs 3 → 4 → 3 → 2 නම් 3×4+4 = 16, 4×3+3 = 15, 3×2+2 = 8, මුළු parameters 39යි. හැම parameter එකක්ම 4 bytes නිසා පොඩි network එකකට MB භාගයක් විතරයි. ඒත් බිලියන 7ක් parameters තියෙන LLM එකක් 16-bit වලින් තිබ්බත් 14 GBක් ඕනේ, ඒකයි GPU එකක memory එක ලොකු වැදගත්කමක් තියෙන්නේ.

---

## 4. Why we need non-linear activations

**Why it exists:** layers alone are not enough. Without something that bends the signal between layers, a hundred-layer network is no more powerful than a single layer. The activation function is the ingredient that makes depth worth having.

What if we skipped the activation function (used f(z) = z)?

Two layers: h = W₁x, then y = W₂h = W₂W₁x = **W'x**, where W' = W₂W₁ is just another matrix.

**Stacking linear layers gives you... one linear layer.** No matter how deep, it could only learn straight-line relationships (like linear regression).

**Non-linear** activation functions (ReLU, sigmoid, ...) between layers let the network bend and fold space, building up complex curved decision boundaries.

**Analogy:** with only straight sticks, you can only make straight lines. Add hinges (non-linearities) between the sticks, and you can build any shape.

### Worked example: layers that collapse

Let W₁ = [[1, 2], [3, 4]] and W₂ = [[0, 1], [1, 0]]. Take x = [1, 1].
- Layer by layer: W₁x = [1+2, 3+4] = [3, 7]; then W₂ × [3, 7] = [7, 3].
- One combined matrix: W₂W₁ = [[0·1+1·3, 0·2+1·4], [1·1+0·3, 1·2+0·4]] = [[3, 4], [1, 2]]. Then (W₂W₁)x = [3+4, 1+2] = **[7, 3]**. Identical, so the two layers were secretly one.

Now put a ReLU between the layers, with W₁ = [[1, −1], [1, 1]], W₂ = [1, 1] and x = [1, 2]:
- Without ReLU: W₁x = [−1, 3]; W₂ × [−1, 3] = **2**.
- With ReLU: [−1, 3] → [0, 3]; W₂ × [0, 3] = **3**.

The negative number was cut off, so the network is no longer a plain matrix multiplication. That "cut" is the bend that lets stacked layers learn curves.

**Where you'll meet it in real work:** if a colleague's 20-layer model performs exactly like linear regression, check whether the activations were accidentally left out.

**Common mistakes:**
- **Putting an activation on the output of a regression model by habit.** A regression output usually needs none.
- **Assuming any non-linear function works equally well.** Some (sigmoid in deep stacks) train badly; see the next section.

**Exam angle:** "what happens if all activations are linear?" The whole network is equivalent to a single linear layer.

> **සිංහලෙන්:** Activation function නැතිව layers ගොඩක් තිබ්බත් වැඩක් නෑ. මොකද layer දෙකක් එකතු කළාම ඒක තව එක matrix එකක් විතරයි (W₂W₁). අපේ උදාහරණයේ [[1,2],[3,4]] සහ [[0,1],[1,0]] එකතු කළාම [[3,4],[1,2]] කියන එක matrix එකක් ලැබුණා, x = [1,1] දාලා දෙපැත්තෙන්ම [7,3] ආවා. ReLU එකක් මැද දැම්මාම negative අගය 0 වෙනවා, ඉතින් ප්‍රතිඵලය වෙනස් වෙනවා (2 වෙනුවට 3). ඒ "නැමීම" නිසා තමයි network එකට වක්‍ර හැඩ ඉගෙන ගන්න පුළුවන් වෙන්නේ.

---

## 5. Activation functions

**Why it exists:** different jobs need different "squashing" rules. A probability must sit between 0 and 1; a hidden layer needs something fast that does not kill gradients. Choosing the right activation is a basic design decision.

| Function | Formula | Output range | Notes |
|---|---|---|---|
| **Sigmoid** | 1/(1+e⁻ᶻ) | (0, 1) | Output layer for binary/multi-label. In hidden layers: vanishing gradients (max derivative 0.25), not zero-centred. |
| **Tanh** | (eᶻ−e⁻ᶻ)/(eᶻ+e⁻ᶻ) | (−1, 1) | Zero-centred sigmoid; still saturates. Used in LSTMs (file 17). |
| **ReLU** | max(0, z) | [0, ∞) | **Default for hidden layers.** Fast; gradient 1 for z>0 → no vanishing. Problem: "dying ReLU" (neuron stuck at 0 forever if z is always negative). |
| **Leaky ReLU** | z if z>0 else 0.01z | (−∞, ∞) | Small slope for negatives fixes dying ReLU. |
| **GELU** | z·Φ(z) (smooth ReLU) | ≈(−0.17, ∞) | Used in **BERT, GPT** and most transformers. |
| **SiLU / Swish** | z·sigmoid(z) | ≈(−0.28, ∞) | Smooth; used in many modern models. **SwiGLU** (a gated variant) is used in Llama-style LLMs (file 19). |
| **Softmax** | eᶻⁱ/Σeᶻʲ | (0,1), sums to 1 | **Output layer** for multi-class ([file 07](07-math-probability-statistics.md#13-softmax)). |

```
 Sigmoid           Tanh              ReLU              GELU
1 ┤   ___         1┤   ___            │    ╱            │    ╱
  │  ╱             │  ╱               │   ╱             │   ╱
.5┤ ╱             0┤─╱──             │  ╱              │  ╱
  │╱              -1┤╱               ─┼─╱──             ─┼─╯── (dips slightly
0 ┤──                                 0                  0     below 0)
```

**Rules of thumb:** ReLU (or GELU/SiLU) for hidden layers; sigmoid or softmax only at the output depending on the task.

### Worked example: the same inputs through each activation

| z | Sigmoid | Tanh | ReLU | Leaky ReLU (0.01) | GELU | SiLU |
|---|---|---|---|---|---|---|
| −2 | 0.119 | −0.964 | 0 | −0.02 | −0.045 | −0.238 |
| 0 | 0.5 | 0 | 0 | 0 | 0 | 0 |
| 2 | 0.881 | 0.964 | 2 | 2 | 1.954 | 1.762 |

Some of the arithmetic: sigmoid(2) = 1 ÷ (1 + e⁻²) = 1 ÷ 1.135 = 0.881. GELU(2) = 2 × Φ(2) = 2 × 0.977 = 1.954. SiLU(2) = 2 × sigmoid(2) = 2 × 0.881 = 1.762. SiLU(−2) = −2 × 0.119 = −0.238.

### Worked example: softmax with Sri Lankan cricket

A model outputs logits (raw scores) for [Sri Lanka wins, India wins, Draw] = [2, 1, 0].
1. Exponentiate: e² = 7.389, e¹ = 2.718, e⁰ = 1.
2. Sum = 7.389 + 2.718 + 1 = 11.107.
3. Divide: 7.389 ÷ 11.107 = **0.665**, 2.718 ÷ 11.107 = **0.245**, 1 ÷ 11.107 = **0.090**.
They add up to 1.000: 66.5% / 24.5% / 9.0%.

### Worked example: why sigmoid hurts deep stacks

The slope of sigmoid is at most 0.25 (at z = 0), and at z = 5 it is only 0.993 × 0.007 = **0.0067**. Chain 10 sigmoid layers and the gradient is multiplied by at most 0.25¹⁰ = 1 ÷ 1,048,576 ≈ **0.000001**. ReLU's slope is exactly 1 for positive z, so multiplying by 1 ten times still gives 1.

**Where you'll meet it in real work:** the last line of a classifier (softmax gives the probabilities shown to users) and the GELU/SiLU hidden activations inside every GPT and Llama-style model.

**Common mistakes:**
- **Using sigmoid in hidden layers of a deep network.**
- **Using softmax when several labels can be true together.** Softmax forces probabilities to share one budget of 1; use a sigmoid per label.
- **Ignoring dying ReLU** when a large learning rate pushes a neuron permanently negative.

**Exam angle:** know which activation goes where (ReLU/GELU hidden, sigmoid binary, softmax multi-class), and the fact that GELU is used in BERT/GPT and SwiGLU in Llama.

> **සිංහලෙන්:** Activation function එක තෝරන්නේ වැඩේ අනුව. Hidden layers වලට ReLU හෝ GELU, මොකද ඒවා වේගවත් සහ gradient එක නැති කරන්නේ නෑ. Binary ප්‍රශ්නයකට output එකේ sigmoid, classes ගොඩක් නම් softmax. ක්‍රිකට් උදාහරණය: scores [2, 1, 0] ලංකාව දිනුම, ඉන්දියාව දිනුම, draw. e² = 7.39, e¹ = 2.72, e⁰ = 1, එකතුව 11.11. බෙදුවාම 66.5%, 24.5%, 9%, එකතුව 100%. Sigmoid වල ආනතිය උපරිම 0.25 නිසා layers 10ක් ගියාම gradient එක 0.25¹⁰ ≈ 0.000001 වෙලා නැති වෙනවා.

---

## 6. Output layers and loss functions

**Why it exists:** a network's last layer and its loss must speak the same language as the task. A price is a free number, "spam or not" is a probability, a topic label is a choice among many. Matching them keeps the maths correct and training stable.

Match the output layer to the task ([file 11](11-ml-fundamentals.md#6-loss-functions)):

| Task | Output layer | Loss | PyTorch |
|---|---|---|---|
| Regression | 1 neuron, no activation | MSE (or MAE/Huber) | `nn.MSELoss()` |
| Binary classification | 1 neuron + sigmoid | Binary cross-entropy | `nn.BCEWithLogitsLoss()` (takes raw logits) |
| Multi-class (one correct) | K neurons + softmax | Cross-entropy | `nn.CrossEntropyLoss()` (takes raw logits) |
| Multi-label (several correct) | K neurons + sigmoid each | BCE per label | `nn.BCEWithLogitsLoss()` |

⚠️ **PyTorch gotcha:** `nn.CrossEntropyLoss` and `nn.BCEWithLogitsLoss` apply softmax/sigmoid **internally** for numerical stability. Feed them **raw logits** (no softmax/sigmoid in your model's last layer). Adding softmax yourself is a common bug that silently hurts training.

### Worked example: computing each loss

**Binary cross-entropy (y = 1):**
- Prediction 0.9 → L = −ln(0.9) = **0.105** (small, good)
- Prediction 0.1 → L = −ln(0.1) = **2.303** (large, the model is confidently wrong)

**Multi-class cross-entropy:** logits [2, 1, 0] from the cricket example give probabilities [0.665, 0.245, 0.090]. If the true class is "Sri Lanka wins" (index 0), L = −ln(0.665) = **0.408**. If the true class were "Draw", L = −ln(0.090) = **2.41**, a much bigger punishment.

**Mean squared error (regression):** predicted prices [3, 5], real prices [2, 8] (Rs. lakhs). Errors: +1 and −3. MSE = (1² + 3²) ÷ 2 = (1 + 9) ÷ 2 = **5**. The bigger miss counts nine times more than the smaller one because of the square.

**Logit to probability:** a logit of 0 gives sigmoid(0) = 0.5 (undecided); a logit of +2 gives 0.88; a logit of −2 gives 0.12.

```
Task                      Output layer             Loss
Predict house price       1 neuron, no activation  MSE
Spam or not               1 neuron (logit)         BCEWithLogitsLoss
Which of 5 topics         5 logits                 CrossEntropyLoss
Tag photo with 20 objects 20 logits                BCEWithLogitsLoss
```

**Where you'll meet it in real work:** every LLM is trained with cross-entropy over its vocabulary at each position, as the next-token loss ([file 07](07-math-probability-statistics.md#23-cross-entropy)).

**Common mistakes:**
- **Applying softmax and then `CrossEntropyLoss`** (double softmax).
- **Using MSE for classification,** which gives weak gradients when the model is confidently wrong.
- **Using softmax for a multi-label task.**

**Exam angle:** pick the right loss for a task, and know that "logits" are raw scores before softmax or sigmoid.

> **සිංහලෙන්:** Output layer එකයි loss එකයි වැඩේට ගැළපෙන්න ඕනේ. ගෙයක මිල වගේ අංකයක් අනුමාන කරනවා නම් neuron එකක් activation නැතුව, loss එක MSE. ඔව්/නෑ නම් sigmoid සහ binary cross-entropy. Classes ගොඩක් නම් softmax සහ cross-entropy. උදාහරණයක්: model එක ලංකාවේ දිනුමට 0.665ක් දුන්නා, ඇත්තටම ලංකාව දිනුවා නම් loss එක −ln(0.665) = 0.41, පොඩියි. ඒත් draw එකක් වුණා නම් −ln(0.09) = 2.41, ලොකුයි. PyTorch වල loss functions වලට දෙන්නේ raw logits, ඒවායේ ඇතුළෙම softmax කරනවා, ඒ නිසා ඔයා ආයෙත් softmax දාන්න එපා.

---

## 7. Forward pass worked example

**Why it exists:** training only makes sense if you first know how a network turns an input into a prediction and a loss. The forward pass is that journey, and it is the part you run again at inference time.

A tiny network: 2 inputs → 2 hidden neurons (ReLU) → 1 output (sigmoid). Binary classification.

**Parameters:**
```
W₁ = [[ 0.5, -0.4],     b₁ = [0.1, 0.2]
      [ 0.3,  0.8]]
W₂ = [[ 1.0, -1.5]]     b₂ = [0.2]
```

**Input:** x = [1.0, 2.0], true label y = 1

**Hidden layer:**
- z₁ = 0.5×1.0 + (−0.4)×2.0 + 0.1 = 0.5 − 0.8 + 0.1 = **−0.2** → h₁ = ReLU(−0.2) = **0**
- z₂ = 0.3×1.0 + 0.8×2.0 + 0.2 = 0.3 + 1.6 + 0.2 = **2.1** → h₂ = ReLU(2.1) = **2.1**

**Output layer:**
- z₃ = 1.0×0 + (−1.5)×2.1 + 0.2 = −3.15 + 0.2 = **−2.95**
- ŷ = sigmoid(−2.95) ≈ **0.050**

**Loss** (binary cross-entropy, y = 1): L = −ln(0.050) ≈ **3.00**. Big loss: the model said 5% but the answer is "yes".

### Worked example: a second input through the same network

Same parameters as above. Now x = [2.0, 0.0] with true label y = 0.

- z₁ = 0.5×2 + (−0.4)×0 + 0.1 = 1.0 + 0 + 0.1 = **1.1** → h₁ = ReLU(1.1) = **1.1**
- z₂ = 0.3×2 + 0.8×0 + 0.2 = 0.6 + 0 + 0.2 = **0.8** → h₂ = **0.8**
- z₃ = 1.0×1.1 + (−1.5)×0.8 + 0.2 = 1.1 − 1.2 + 0.2 = **0.1**
- ŷ = sigmoid(0.1) = 1 ÷ (1 + e⁻⁰·¹) = 1 ÷ 1.905 = **0.525**
- Loss with y = 0 is −ln(1 − 0.525) = −ln(0.475) = **0.744**

The network is barely better than a coin flip on this example, as you would expect from random starting weights.

### What must be remembered for the backward pass

```
x → [z₁, z₂] → [h₁, h₂] → z₃ → ŷ → L
     saved       saved      saved
```

Backpropagation needs these intermediate values (z and h), so frameworks keep them in memory during the forward pass. That is why training uses much more memory than inference, and why big batches or deep models can run out of GPU memory.

**Where you'll meet it in real work:** when you call `model(x)` in PyTorch, or when a chatbot reads your prompt, a forward pass is what runs. Inference is "just the forward pass".

**Common mistakes:**
- **Mixing up the matrix order** (W·x versus x·W). Check shapes first.
- **Applying ReLU to the output logit,** which would cut off negative scores the loss needs.

**Exam angle:** be able to carry a tiny input through a 2-layer network, and to say that the loss is computed after the forward pass.

> **සිංහලෙන්:** Forward pass එක කියන්නේ input එක layer එකින් layer එකට ගිහින් prediction එකක් සහ loss එකක් එන තෙක් ගණන් කරන එක. අපේ network එකට x = [2, 0] දුන්නාම hidden neurons දෙකේ z අගයන් 1.1 සහ 0.8, ReLU වලින් පස්සේත් එහෙමම. Output z = 1.1 − 1.2 + 0.2 = 0.1, sigmoid(0.1) = 0.525. ඇත්ත උත්තරය 0 නම් loss එක −ln(0.475) = 0.74. Random weights නිසා model එක තවම coin එකක් උඩ දානවා වගේ. පස්සේ backward pass එකට මේ අතරමැදි අගයන් ඕනේ නිසා ඒවා memory එකේ තියාගන්නවා, ඒකයි training වලට inference වලට වඩා memory වැඩියෙන් ඕනේ.

---

## 8. Backpropagation worked example

**Why it exists:** a network may have billions of weights, and each must be nudged in the direction that lowers the loss. Backpropagation uses the chain rule to compute all those directions in one backward sweep instead of one slow experiment per weight.

Now we compute how to change each weight, using the chain rule ([file 06](06-math-calculus.md#11-the-chain-rule)), going backwards.

**A beautiful shortcut:** for sigmoid + binary cross-entropy (and softmax + cross-entropy), the gradient of the loss with respect to the logit simplifies to:

```
∂L/∂z₃ = ŷ − y = 0.050 − 1 = −0.950
```

**Output layer gradients:**
- ∂L/∂W₂ = (∂L/∂z₃) × h = −0.950 × [0, 2.1] = **[0, −1.995]**
- ∂L/∂b₂ = **−0.950**

**Back into the hidden layer:**
- ∂L/∂h = (∂L/∂z₃) × W₂ = −0.950 × [1.0, −1.5] = [−0.950, 1.425]
- Through ReLU: derivative is 1 if z > 0, else 0. z₁ = −0.2 → 0; z₂ = 2.1 → 1
- ∂L/∂z_hidden = [−0.950 × 0, 1.425 × 1] = **[0, 1.425]**

**Hidden layer gradients:**
- ∂L/∂W₁ = ∂L/∂z_hidden (as a column) × xᵀ = [[0×1, 0×2], [1.425×1, 1.425×2]] = **[[0, 0], [1.425, 2.85]]**
- ∂L/∂b₁ = **[0, 1.425]**

**Update** with learning rate 0.1 (θ = θ − 0.1 × gradient):
- W₂ = [1.0 − 0, −1.5 − 0.1×(−1.995)] = [1.0, **−1.30**]
- b₂ = 0.2 + 0.095 = **0.295**
- W₁ row 2 = [0.3 − 0.1425, 0.8 − 0.285] = [**0.158**, **0.515**]
- b₁ = [0.1, 0.2 − 0.1425] = [0.1, **0.058**]

**Check:** new forward pass: z₂ = 0.158 + 1.03 + 0.058 = 1.246 → h₂ = 1.246; z₃ = −1.30×1.246 + 0.295 = −1.325 → ŷ = sigmoid(−1.325) ≈ **0.21**. Up from 0.05: the network moved toward the right answer. ✓

**Notice:**
- Neuron 1 (ReLU output 0) got **zero gradient**: it didn't participate, so it doesn't change. If that happens for every input, it's a "dead" neuron.
- The weight W₂ became less negative, because h₂ was hurting the prediction.

```python
import torch
x = torch.tensor([1.0, 2.0]); y = torch.tensor([1.0])
W1 = torch.tensor([[0.5, -0.4], [0.3, 0.8]], requires_grad=True)
b1 = torch.tensor([0.1, 0.2], requires_grad=True)
W2 = torch.tensor([[1.0, -1.5]], requires_grad=True)
b2 = torch.tensor([0.2], requires_grad=True)
h = torch.relu(W1 @ x + b1)
logit = W2 @ h + b2
loss = torch.nn.functional.binary_cross_entropy_with_logits(logit, y)
loss.backward()
print(W2.grad, W1.grad)   # matches the hand calculation
```

### Worked example: checking a gradient by nudging

You can verify a hand-calculated gradient with a tiny experiment. We claim ∂L/∂W₂[1] = −1.995. Nudge that weight up by 0.001 (from −1.5 to −1.499) and recompute:
- z₃ = −1.499 × 2.1 + 0.2 = −2.9479 (before: −2.95)
- ŷ goes from 0.04974 to 0.04983
- L goes from about 3.0008 to about 2.9988, a change of **−0.0020**
- Slope ≈ −0.0020 ÷ 0.001 ≈ **−2**, matching the −1.995 we computed.

This "numerical gradient check" is the classic way to test a backprop implementation. Autograd does the same job exactly and instantly.

### The backward pass as a recipe

1. Start at the loss: ∂L/∂z_out = ŷ − y (for sigmoid + BCE).
2. For each layer going backwards: **weight gradient = (error at its output) × (its input)**, bias gradient = the error, and error passed back = (error) × (weights), multiplied by the activation's slope.
3. Update every parameter: new = old − learning rate × gradient.

**Where you'll meet it in real work:** you will almost never write backprop by hand. `loss.backward()` does it for a 70-billion-parameter model. But knowing the recipe helps you understand why a dead ReLU or a vanishing gradient stops learning.

**Common mistakes:**
- **Forgetting that ReLU blocks the gradient** for neurons with z ≤ 0.
- **Updating with the wrong sign.** Gradient descent subtracts the gradient.
- **Thinking backprop is the learning.** Backprop only computes gradients; the optimiser uses them to learn.

**Exam angle:** "what does backpropagation compute?" Gradients of the loss with respect to every parameter, via the chain rule. Expect a small numeric calculation like the ones above.

> **සිංහලෙන්:** Backpropagation කියන්නේ loss එක අඩු කරන්න හැම weight එකක්ම වෙනස් කරන්න ඕනේ දිශාව පස්සට ගමන් කරලා හොයන එක. කොත්තු කඩේ උදාහරණය වගේ: පාරිභෝගිකයා පැමිණිලි කළාම අයිතිකාරයා වැරැද්දෙන් කොටසක් කොත්තු ගහපු කෙනාට, එළවළු කපපු කෙනාට බෙදනවා. Gradient එක හරිද කියලා බලන්න පුළුවන්: weight එක 0.001කින් වැඩි කරලා loss එක බලනවා, අපේ උදාහරණයේ loss එක 3.0008 ඉඳන් 2.9988 වුණා, ආනතිය ආසන්න වශයෙන් −2. `loss.backward()` කරන්නේ මේක තමයි. ඒත් backprop එක gradients ගණන් කරනවා විතරයි, ඉගෙන ගන්නේ optimiser එකෙන්.

---

## 9. Optimisers

**Why it exists:** the gradient tells you which way is downhill, but not how big a step to take or how to handle bumpy terrain. Optimisers are different driving styles for the same hill.

The **optimiser** decides how to update parameters from gradients ([file 06](06-math-calculus.md#14-loss-landscapes) previewed these).

### SGD (Stochastic Gradient Descent)

```
θ = θ − η · g          (g = gradient on a mini-batch)
```
Simple. Can be slow in narrow valleys (zig-zags) and sensitive to the learning rate.

### SGD with Momentum

Keep a running "velocity" that accumulates past gradients:

```
v = β·v + g            (β ≈ 0.9: keep 90% of previous velocity)
θ = θ − η·v
```

**Analogy:** a heavy ball rolling downhill. It builds speed in consistent directions and smooths out zig-zags. It can roll over small bumps (local minima).

### RMSProp

Gives each parameter its **own** learning rate: divide by a running average of that parameter's recent squared gradients. Parameters with big, noisy gradients take smaller steps; parameters with tiny gradients take bigger steps.

### Adam (Adaptive Moment Estimation): the default

Combines momentum (1st moment: running average of gradients, **m**) and RMSProp (2nd moment: running average of squared gradients, **v**):

```
m = β₁·m + (1−β₁)·g            (β₁ = 0.9)
v = β₂·v + (1−β₂)·g²           (β₂ = 0.999)
m̂ = m/(1−β₁ᵗ),  v̂ = v/(1−β₂ᵗ)   (bias correction: m, v start at 0 and need a boost early on)
θ = θ − η · m̂ / (√v̂ + ε)       (ε ≈ 1e-8 avoids dividing by zero)
```

Works well with little tuning. Typical learning rate: **1e-3** (or 1e-4 to 3e-4 for transformers).

**Bias correction example:** at step 1 with g = 2: m = 0.1×2 = 0.2, but m̂ = 0.2/(1−0.9) = 2.0, the true gradient size. Without correction, early steps would be 10× too small.

### AdamW: the standard for transformers and LLMs

Adam with **decoupled weight decay**: instead of adding L2 regularisation to the loss (which interacts badly with Adam's per-parameter scaling), it shrinks weights directly: θ = θ − η·weight_decay·θ. Typical weight_decay: 0.01 to 0.1.

```python
import torch.optim as optim
optim.SGD(model.parameters(), lr=0.1, momentum=0.9)
optim.Adam(model.parameters(), lr=1e-3)
optim.AdamW(model.parameters(), lr=3e-4, weight_decay=0.01)
```

**Memory note:** Adam stores two extra numbers (m, v) per parameter, so optimiser state uses **2× the model's size** in memory. Important for training big models (file 21).

### Worked example: SGD versus momentum versus Adam on the same gradient

Suppose the gradient for one weight is **2** at every step, with learning rate η = 0.1.

| Step | SGD step size | Momentum (β = 0.9) v → step |
|---|---|---|
| 1 | 0.1 × 2 = 0.2 | v = 2 → 0.1 × 2 = 0.2 |
| 2 | 0.2 | v = 0.9 × 2 + 2 = 3.8 → 0.38 |
| 3 | 0.2 | v = 0.9 × 3.8 + 2 = 5.42 → 0.542 |

Momentum speeds up when the gradient keeps pointing the same way, like a ball rolling downhill. (It also dampens the zig-zag when gradients keep flipping sign.)

**Adam's first step** with g = 2, β₁ = 0.9, β₂ = 0.999:
- m = 0.1 × 2 = 0.2 and v = 0.001 × 2² = 0.004
- Bias-corrected: m̂ = 0.2 ÷ 0.1 = 2 and v̂ = 0.004 ÷ 0.001 = 4
- Step = η × m̂ ÷ (√v̂ + ε) = η × 2 ÷ 2 = **η**

So Adam takes steps of about η whatever the gradient's size (try g = 200: you still get about η). That scale-free behaviour is why one learning rate often works across very different parameters.

### Worked example: memory to train a 7B model

Training in plain 32-bit with Adam: weights 7 × 10⁹ × 4 bytes = 28 GB; gradients 28 GB; Adam's m and v 2 × 28 = 56 GB. Total = 28 + 28 + 56 = **112 GB**, before counting activations. No single consumer GPU holds that, which is why large-model training is spread over many GPUs ([file 21](21-training-finetuning-alignment.md)).

**Where you'll meet it in real work:** `AdamW` with a learning rate near 1e-4 to 3e-4 is the default recipe for fine-tuning transformers.

**Common mistakes:**
- **Using Adam's learning rate for SGD (or vice versa).** SGD often needs 0.01 to 0.1, Adam 0.001 or smaller.
- **Using L2 regularisation inside Adam instead of AdamW** and wondering why the regularisation is weak.
- **Forgetting the memory cost of Adam's state.**

**Exam angle:** know that Adam = momentum + RMSProp + bias correction, that AdamW decouples weight decay and is the transformer standard, and the usual learning-rate ranges.

> **සිංහලෙන්:** Optimiser එක කියන්නේ gradient එක පාවිච්චි කරලා weights update කරන ක්‍රමය. Tuk-tuk එකක් කන්දකින් පහළට පදවනවා හිතන්න. SGD කියන්නේ හැම මීටරයකම නවත්තලා බෑවුම බලන කෙනා. Momentum කියන්නේ වේගය අරගෙන යන කෙනා: gradient එක හැම පාරම 2 නම් පියවර 0.2, 0.38, 0.54 විදිහට වැඩි වෙනවා. Adam කියන්නේ හැම parameter එකකටම ගැළපෙන විදිහට පියවරේ ප්‍රමාණය හදාගන්න දක්ෂ driver. Adam එකට m සහ v කියන අමතර අගයන් දෙකක් හැම parameter එකකටම තියෙන නිසා memory එක වැඩියෙන් යනවා. Transformers වලට AdamW පාවිච්චි කරනවා.

---

## 10. Learning rate schedules

**Why it exists:** the ideal step size changes during training. Early on you want big strides to make progress; near the end you want tiny steps to settle into the best spot. A schedule changes the learning rate automatically.

The best learning rate changes during training: large steps early to make progress, small steps later to settle into a good minimum.

| Schedule | Shape | Use |
|---|---|---|
| **Constant** | ─────── | Simple experiments |
| **Step decay** | ‾‾‾╲___╲___ | Drop by 10× at set epochs (classic CNNs) |
| **Exponential decay** | ╲‾‾‾‾‾‾ curve | Multiply by γ each epoch |
| **Cosine annealing** | ‾‾╲___ smooth curve to ~0 | Very common |
| **Reduce on plateau** | drops when validation stalls | Practical default for small projects |
| **Linear warmup + decay** | ╱‾‾‾╲___ | **Standard for transformers/LLMs** |
| **One-cycle** | ╱╲ up then down | Fast training of CNNs |

### Warmup

Start with a **tiny** learning rate and increase it linearly over the first few hundred or thousand steps. **Why?** At the start, weights are random and Adam's statistics (m, v) are unreliable; big steps can blow up training. Warmup lets things stabilise first. It's essential for transformers.

```
lr
 │      ╱‾‾‾‾‾‾╲
 │    ╱          ╲___
 │  ╱                ‾‾‾╲____
 │╱                          ‾‾‾──
 └───┬────────────────────────────► step
   warmup        cosine decay
```

```python
from transformers import get_cosine_schedule_with_warmup
sched = get_cosine_schedule_with_warmup(optimizer, num_warmup_steps=500, num_training_steps=10000)
# call sched.step() after each optimizer.step()
```

**Learning rate finder:** train for a few hundred steps while increasing the LR exponentially; plot loss vs LR; pick a value a bit below where loss is falling fastest.

### Worked example: a warmup plus cosine schedule

Peak learning rate 1e-3, 500 warmup steps, 10,000 total steps.

- Warmup (linear): lr = peak × step ÷ 500. At step 100: 0.001 × 100 ÷ 500 = **0.0002**. At step 250: **0.0005**. At step 500: **0.001**.
- Cosine decay after warmup: lr = 0.5 × peak × (1 + cos(π × progress)), where progress runs from 0 to 1 over the remaining steps. At progress 0 → 0.5 × 0.001 × 2 = **0.001**. At progress 0.5 → 0.5 × 0.001 × (1 + 0) = **0.0005**. At progress 1 → 0.5 × 0.001 × 0 = **0**.

Other schedules in numbers:
- **Step decay:** start at 0.1, divide by 10 every 30 epochs → 0.1, then 0.01 at epoch 30, then 0.001 at epoch 60.
- **Exponential decay:** γ = 0.9, start 0.1 → after 10 epochs 0.1 × 0.9¹⁰ = 0.1 × 0.349 = **0.0349**.

**Where you'll meet it in real work:** every LLM pre-training or fine-tuning config contains `warmup_steps` and a `cosine` or `linear` scheduler. If your fine-tuning loss spikes in the first few steps, warmup is the first thing to check.

**Common mistakes:**
- **Calling `scheduler.step()` at the wrong time** (it should follow `optimizer.step()`).
- **Setting warmup longer than the whole training run.**
- **Using a high constant learning rate late in training,** which keeps the loss noisy.

**Exam angle:** know why warmup is used (unreliable Adam statistics and random weights at the start) and name the transformer standard (linear warmup then cosine or linear decay).

> **සිංහලෙන්:** Learning rate schedule කියන්නේ training අතරතුර learning rate එක වෙනස් කරන ක්‍රමයක්. මුලදී ලොකු පියවර, අන්තිමට පොඩි පියවර. Warmup කියන්නේ මුලින්ම ඉතා පොඩි rate එකකින් පටන් අරන් හෙමින් වැඩි කරන එක, උදා: උපරිම 0.001, පියවර 500ක්. පියවර 100දී 0.0002, 250දී 0.0005, 500දී 0.001. ඊට පස්සේ cosine එකෙන් 0 දක්වා සුමටව අඩු කරනවා. අලුතින් බිහි කරපු weights random නිසා මුල් කාලයේ ලොකු පියවරවලින් training එක කඩාවැටෙන්න පුළුවන්, ඒකයි warmup එක transformers වලට අත්‍යවශ්‍ය වෙන්නේ.

---

## 11. Weight initialisation

**Why it exists:** gradient descent needs a starting point. A careless start (all zeros, or numbers that are too big or too small) can make training fail before it begins.

**Why it matters:** if all weights start at 0, every neuron in a layer computes the same thing and gets the same gradient. They stay identical forever (**symmetry problem**). So we start with **small random** numbers.

But how small? If too big, activations explode layer after layer; if too small, they shrink to zero. Good initialisation keeps the **variance** of activations roughly constant across layers ([file 07](07-math-probability-statistics.md#3-measures-of-spread)).

| Method | Weight std | Use with |
|---|---|---|
| **Xavier / Glorot** | √(2 / (n_in + n_out)) | sigmoid, tanh |
| **He / Kaiming** | √(2 / n_in) | **ReLU** family |

(n_in = number of inputs to the layer.) Weights are drawn from a normal or uniform distribution with that spread.

Modern frameworks pick sensible defaults. In LLMs, special tricks (like scaling down the weights of residual layers) keep very deep networks stable.

### Worked example: why all-zero weights fail

Two hidden neurons, both with weights [0.5, 0.5] and bias 0, input x = [1, 2]. Both compute z = 0.5 + 1.0 = 1.5 and output 1.5. Both receive the same gradient, so after the update they are **still identical**. They will stay twins forever, so two neurons do the work of one. Random starts break the tie.

### Worked example: why the scale of the starting weights matters

A layer takes 100 inputs, each with variance 1. The output variance is about n_in × (weight variance) × (input variance) = 100 × σ² × 1.
- σ = 0.1 → 100 × 0.01 = **1** (stable)
- σ = 0.5 → 100 × 0.25 = **25** per layer, so after 5 layers 25⁵ = **9,765,625** (exploding)
- σ = 0.01 → 100 × 0.0001 = **0.01** per layer, so after 5 layers 0.01⁵ = **0.0000000001** (vanishing)

**He initialisation** picks σ = √(2 / n_in) so the variance stays near 1 with ReLU. For n_in = 784: √(2 ÷ 784) = √0.00255 = **0.0505**. For n_in = 256: √(2 ÷ 256) = √0.0078 = **0.088**. **Xavier** for 784 inputs and 128 outputs: √(2 ÷ (784 + 128)) = √0.00219 = **0.0468**.

**Where you'll meet it in real work:** when you design a custom layer in PyTorch, or when loading a pretrained model the weights are already well initialised and you should not reset them.

**Common mistakes:**
- **Initialising everything to zero** (except often the biases, which is fine).
- **Using Xavier with ReLU,** which slightly under-scales; use He.
- **Re-initialising pretrained layers,** which throws away what was learned.

**Exam angle:** the symmetry problem is the reason weights start random; Xavier goes with sigmoid/tanh, He with ReLU.

> **සිංහලෙන්:** Training පටන් ගන්න කලින් weights වලට අගයන් දෙන්න ඕනේ. හැම එකක්ම 0 කළොත් neurons දෙකක් එකම දේ ගණන් කරලා එකම gradient ලබාගන්නවා, ඒ නිසා ඒවා හැමදාම එකම වගේ. ඒකට symmetry problem කියනවා. ඒක නිසා පොඩි random අංක දෙනවා. ඒත් ඒවා ලොකු වැඩියි නම් layers 5කදී variance එක 25⁵ ≈ මිලියන 10ක් වෙනවා, ඉතා පොඩි නම් 10⁻¹⁰ වගේ බින්දුවට යනවා. ReLU වලට He initialisation (σ = √(2 ÷ n_in)) පාවිච්චි කරනවා, උදා: inputs 784 නම් σ ≈ 0.05.

---

## 12. Vanishing and exploding gradients

**Why it exists:** in a deep network the error signal has to travel back through every layer. If each layer shrinks it a little, the early layers hear nothing; if each layer grows it, the updates explode. Knowing both failure modes helps you diagnose broken training.

From [file 06](06-math-calculus.md#11-the-chain-rule): backprop multiplies many local derivatives together.

- **Vanishing gradients:** many factors < 1 → the product shrinks toward 0 → early layers barely learn. Classic cause: sigmoid/tanh (max derivatives 0.25 and 1, usually much less), very deep networks, RNNs over long sequences (file 17).
- **Exploding gradients:** many factors > 1 → the product blows up → huge updates, loss becomes NaN.

**Fixes:**
| Problem | Fix |
|---|---|
| Vanishing | ReLU/GELU activations; He init; **residual connections** (section 15); normalisation layers (section 14); LSTMs instead of plain RNNs |
| Exploding | **Gradient clipping**; lower learning rate; normalisation; good init; warmup |

### Gradient clipping

If the gradient vector's total length (its L2 norm, [file 05](05-math-linear-algebra.md#4-length-of-a-vector-norm)) exceeds a maximum, scale it down to that maximum, keeping its direction.

**Example:** gradient = [3, 4] (norm 5), max_norm = 1 → clipped gradient = [0.6, 0.8] (norm 1).

```python
torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)   # standard in LLM training
```

### Worked example: the arithmetic of vanishing and exploding

Backprop multiplies one factor per layer. With 20 layers:
- Every factor 0.5 → 0.5²⁰ = 1 ÷ 1,048,576 ≈ **0.000001** (vanished: the first layers learn nothing)
- Every factor 2 → 2²⁰ = **1,048,576** (exploded: huge updates, loss may become NaN)
- Every factor 1 → stays **1** (the ideal, which ReLU and residual connections aim for)

### Worked example: when clipping does and doesn't act

max_norm = 1.
- Gradient [0.3, 0.4]: norm = √(0.09 + 0.16) = 0.5, below 1, so it is **unchanged**.
- Gradient [3, 4]: norm = 5, so scale by 1 ÷ 5 → **[0.6, 0.8]**.
- Gradient [300, 400]: norm = 500, scale by 1 ÷ 500 → also **[0.6, 0.8]**. A freak batch can no longer wreck the model; only the direction survives.

Clipping changes the **length**, never the **direction**, of the gradient.

**Where you'll meet it in real work:** nearly every LLM training recipe contains `max_grad_norm=1.0`. If a loss curve suddenly spikes to NaN, check clipping and the learning rate first.

**Common mistakes:**
- **Using clipping to hide a learning rate that is far too high.**
- **Clipping each gradient value separately** when you meant the overall norm.
- **Blaming vanishing gradients for everything.** Check data and loss first.

**Exam angle:** list the fixes for each problem (vanishing: ReLU, residuals, normalisation, He init; exploding: clipping, lower LR, warmup).

> **සිංහලෙන්:** Backprop එකේදී gradient එක layer එකින් layer එක ගුණ වෙනවා. හැම layer එකකම ගුණකය 0.5 නම් layers 20කට පස්සේ 0.5²⁰ ≈ 0.000001, ඒ කියන්නේ මුල් layers වලට ඉගෙනීමක් නෑ (vanishing). ගුණකය 2 නම් 2²⁰ ≈ මිලියනයක්, update ඉතා විශාලයි, loss එක NaN වෙන්න පුළුවන් (exploding). Gradient clipping එකේදී gradient එකේ දිග max_norm එකට වඩා වැඩි නම් දිශාව වෙනස් නොකර දිග අඩු කරනවා, උදා: [300, 400] ඉඳන් [0.6, 0.8] වෙනවා. ReLU, residual connections, normalisation වලින් vanishing එකට උදව් වෙනවා.

---

## 13. Regularisation in deep learning

**Why it exists:** a network with millions of weights can simply memorise the training set, scoring brilliantly there and badly on new data. Regularisation techniques make memorising harder so the network learns patterns that generalise.

Neural networks have many parameters and can easily **overfit** ([file 11](11-ml-fundamentals.md#11-underfitting-and-overfitting)).

### Dropout

During training, **randomly set a fraction p of neurons' outputs to zero** at each step (e.g. p = 0.1 to 0.5).

```
Training step 1:   ○  ✗  ○  ○  ✗  ○      (✗ = dropped this step)
Training step 2:   ✗  ○  ○  ✗  ○  ○
At inference:      ○  ○  ○  ○  ○  ○      (all neurons active, no dropping)
```

**Why it works:** neurons can't rely on specific other neurons always being there, so they learn more robust, redundant features. It's like training many slightly different networks and averaging them (an ensemble, [file 12](12-supervised-learning-algorithms.md#10-ensemble-learning)).

**Inverted dropout:** during training, surviving activations are scaled up by 1/(1−p) so the expected total stays the same; at inference, nothing changes. Example: p = 0.5, a surviving activation of 2.0 becomes 4.0.

⚠️ Dropout must be **off at inference**. In PyTorch that's what `model.eval()` does (section 18).

### Weight decay

L2-style shrinking of weights ([file 11](11-ml-fundamentals.md#13-regularisation)); built into AdamW.

### Early stopping

Track validation loss; stop (and keep the best checkpoint) when it stops improving for some number of epochs (**patience**).

### Data augmentation

Create varied copies of training data (flip/rotate/crop images; file 16). Often the most effective regulariser for images.

### Label smoothing

Instead of a target of 100% on the correct class, use e.g. 90% correct + 10% spread over the others. Discourages overconfidence and improves calibration.

### Worked example: dropout with numbers

A hidden layer outputs [1.0, 2.0, 3.0, 4.0] and p = 0.5. During one training step a random mask keeps neurons 1 and 3: mask = [1, 0, 1, 0]. Surviving values are scaled by 1 ÷ (1 − 0.5) = 2:
- Output = [1.0×2, 0, 3.0×2, 0] = **[2, 0, 6, 0]**.
At inference (`model.eval()`), no mask and no scaling: [1, 2, 3, 4]. Because of the 1 ÷ (1 − p) scaling, the average signal size is the same in both modes.

### Worked example: early stopping with patience 3

Validation loss by epoch: 0.50, 0.42, 0.40, 0.41, 0.43, 0.44.
- Epoch 3 (0.40) is the best so far, so save a checkpoint there.
- Epochs 4, 5, 6 all fail to beat 0.40: that is 3 bad epochs in a row = patience used up, so **stop**. Restore the epoch-3 checkpoint.

### Worked example: weight decay and label smoothing

- **Weight decay:** weight θ = 1.0, η = 0.1, decay = 0.01. The extra shrink step is θ − η × decay × θ = 1.0 − 0.1 × 0.01 × 1.0 = **0.999**. Tiny each step, but over thousands of steps it keeps weights from growing without need.
- **Label smoothing** (ε = 0.1, 5 classes): the usual one-hot target [1, 0, 0, 0, 0] becomes (1 − 0.1) × one-hot + 0.1 ÷ 5 = [**0.92**, 0.02, 0.02, 0.02, 0.02], which still sums to 1. The model is no longer pushed to be 100% sure.

**Where you'll meet it in real work:** a model that scores 99% on training data and 82% on validation data is a textbook case: add dropout, weight decay and augmentation, or stop earlier.

**Common mistakes:**
- **Leaving dropout on during evaluation** (forgetting `model.eval()`).
- **Using dropout on tiny data and expecting miracles.** More data usually beats any trick.
- **Early-stopping on the test set.** Use the validation set.

**Exam angle:** know the purpose of each technique and that dropout acts only during training.

> **සිංහලෙන්:** Neural network එකක parameters ගොඩක් නිසා training data කටපාඩම් කරන්න (overfit) පුළුවන්. Dropout එකේදී training වලදී neurons අහඹු ලෙස ටිකක් නිවා දානවා, ඒ නිසා network එකට එක neuron එකක් ගැන විතරක් රඳා පවතින්න බෑ. උදා: [1,2,3,4] වලින් p = 0.5 නම් [2,0,6,0] වගේ ප්‍රතිඵලයක් ලැබෙනවා. Early stopping එකේදී validation loss එක හොඳම අගයට ගිහින් නැවත අඩු නොවී patience 3ක් යනකම් බලලා නතර කරනවා. Evaluate කරද්දී model.eval() දාන්න අමතක කරන්න එපා, නැත්නම් dropout තවමත් ක්‍රියාත්මකයි.

---

## 14. Normalisation layers

**Why it exists:** as earlier layers change, the numbers feeding the next layer keep shifting, so each layer is chasing a moving target. Normalising the numbers inside the network keeps them in a predictable range and lets you train faster with bigger learning rates.

**Problem:** as weights change during training, the distribution of each layer's inputs keeps shifting, making training slow and unstable.

**Idea:** normalise activations inside the network: subtract the mean and divide by the standard deviation (like z-scores, [file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)), then apply a learnable scale (γ) and shift (β), so the network can undo the normalisation if useful.

### Batch Normalisation (BatchNorm)

Normalise each feature **across the examples in the mini-batch**.

```
Batch of 4 examples, 3 features:
        f1   f2   f3
ex1  [  .    .    . ]
ex2  [  .    .    . ]     BatchNorm: compute mean/std DOWN each column (↓)
ex3  [  .    .    . ]
ex4  [  .    .    . ]
```

- Very effective for **CNNs** (file 16).
- Behaves differently in training (uses batch statistics) vs inference (uses running averages saved during training): another reason `model.eval()` matters.
- Works poorly with very small batches and with variable-length sequences.

### Layer Normalisation (LayerNorm)

Normalise **across the features of each single example**.

```
        f1   f2   f3
ex1  [  .    .    . ]  → LayerNorm: compute mean/std ACROSS each row (→)
```

- Doesn't depend on batch size; same behaviour in training and inference.
- **The standard in transformers and LLMs** (file 19).

### RMSNorm

A simpler LayerNorm that only divides by the root-mean-square (no mean subtraction). Slightly faster; used in **Llama** and most modern LLMs.

```python
import torch.nn as nn
nn.BatchNorm1d(128)   # for (batch, 128) features; BatchNorm2d for images
nn.LayerNorm(768)     # normalise over the last dimension of size 768
nn.RMSNorm(768)       # recent PyTorch versions
```

### Worked example: three kinds of normalisation on the same numbers

**LayerNorm** on one example with features [2, 4, 6] (ignoring the tiny ε):
1. Mean = (2 + 4 + 6) ÷ 3 = 4
2. Variance = ((−2)² + 0² + 2²) ÷ 3 = 8 ÷ 3 = 2.667, so std = 1.633
3. Normalised = [(2−4) ÷ 1.633, 0, (6−4) ÷ 1.633] = **[−1.224, 0, 1.224]**

**BatchNorm** on one feature across a batch of 4 examples: values [1, 3, 5, 7].
1. Mean = 4; variance = (9 + 1 + 1 + 9) ÷ 4 = 5, so std = 2.236
2. Normalised = **[−1.342, −0.447, 0.447, 1.342]**

**RMSNorm** on [2, 4, 6]: root-mean-square = √((4 + 16 + 36) ÷ 3) = √18.67 = 4.32. Divide: **[0.463, 0.926, 1.389]** (no mean subtraction).

After normalising, the learnable γ and β rescale and shift the result, so the network keeps full flexibility.

**Where you'll meet it in real work:** every LLM layer has LayerNorm or RMSNorm; image models like ResNet use BatchNorm. If a model works in training and gives odd results at inference, BatchNorm statistics are a prime suspect.

**Common mistakes:**
- **Using BatchNorm with a batch of 1 or 2,** where batch statistics are meaningless.
- **Forgetting `model.eval()`,** so BatchNorm keeps using batch statistics.
- **Mixing up the axes:** BatchNorm goes down a column (across examples), LayerNorm across a row (across features).

**Exam angle:** transformers use LayerNorm or RMSNorm because they do not depend on batch size; CNNs commonly use BatchNorm.

> **සිංහලෙන්:** Normalisation layers වලින් network එක ඇතුළේ අංකවල පරාසය ස්ථාවරව තියාගන්නවා. BatchNorm එකේදී එක feature එකක් mini-batch එකේ උදාහරණ ඔක්කොම හරහා normalise කරනවා (column එකක් දිගේ). LayerNorm එකේදී එක උදාහරණයක features ඔක්කොම හරහා (row එකක් දිගේ). උදා: [2, 4, 6] වලට mean 4, std 1.63 නිසා ප්‍රතිඵලය [−1.22, 0, 1.22]. Transformers සහ LLMs වලට LayerNorm හෝ RMSNorm පාවිච්චි කරන්නේ ඒවා batch size එක මත රඳා පවතින්නේ නැති නිසා.

---

## 15. Residual connections

**Why it exists:** after about 20 layers, plain networks got worse, not better, because gradients died on the long trip back. A skip connection gives gradients a short cut home and makes very deep networks trainable.

**Problem:** very deep networks (50+ layers) were *harder* to train than shallower ones, even on training data, because gradients vanished.

**Solution (ResNet, 2015):** add a **shortcut** that skips a block and adds the input back:

```
        x ─────────────────────┐ (identity shortcut / skip connection)
        │                      │
        ▼                      │
   ┌──────────┐                │
   │  layers   │ F(x)          │
   └──────────┘                │
        │                      │
        ▼                      ▼
        └─────────► (+) ◄──────┘
                     │
               output = x + F(x)
```

The block only needs to learn the **residual** F(x) (the *change* to make), not the whole transformation. If a block isn't useful, it can just learn F(x) ≈ 0 and pass x through.

**Why it fixes vanishing gradients:** the derivative of x + F(x) with respect to x is 1 + F'(x). The "1" gives gradients a direct highway back through the network, so they don't shrink to zero.

Residual connections made 100+ layer networks possible, and **every transformer layer uses them** (file 19).

### Worked example: output = x + F(x)

x = [1.0, 2.0] enters a block whose layers produce F(x) = [0.1, −0.2]. The block's output is x + F(x) = **[1.1, 1.8]**. The block only had to learn a small correction. If the block has nothing useful to add, F(x) = [0, 0] and the input just passes through unchanged.

### Worked example: gradients through 10 layers

Suppose each block's own derivative F′ is small, 0.01.
- **Plain network:** the gradient is multiplied by 0.01 at each layer: 0.01¹⁰ = **1 × 10⁻²⁰** (dead).
- **Residual network:** each layer multiplies by (1 + 0.01) = 1.01: 1.01¹⁰ = **1.105** (healthy).

The "+1" from the skip path is the highway that keeps gradients alive.

**Where you'll meet it in real work:** ResNet-50 for images, and every transformer block (attention + residual, then MLP + residual). A pretrained LLM with 80 layers is only trainable because of this idea.

**Common mistakes:**
- **Adding tensors of different shapes.** x and F(x) must have the same shape (or x needs a projection).
- **Thinking skip connections add parameters.** The plain "+ x" is free.

**Exam angle:** state the formula x + F(x), the problem it solves (vanishing gradients in deep nets), and that all transformer layers use it.

> **සිංහලෙන්:** Residual connection එකක් කියන්නේ layers ටිකක් මග හැරලා input එක ආයෙත් output එකට එකතු කරන කෙටි පාරක්. Output = x + F(x). උදා: x = [1.0, 2.0], F(x) = [0.1, −0.2] නම් output [1.1, 1.8]. Block එකට ඉගෙන ගන්න තියෙන්නේ පොඩි වෙනස්කම විතරයි. Gradient එක layers 10කින් පස්සට එද්දී සාමාන්‍ය network එකේ 0.01¹⁰ = 10⁻²⁰ වගේ නැති වෙනවා, residual එකේ 1.01¹⁰ ≈ 1.1 වෙලා ජීවතුන් අතර තියෙනවා. ඒ නිසා තමයි layers සීයක් විතර තියෙන network train කරන්න පුළුවන් වුණේ, හැම transformer layer එකකම මේක තියෙනවා.

---

## 16. Embedding layers

**Why it exists:** networks work with numbers, but words, products and user IDs are categories. One-hot vectors are huge and treat every pair as equally different. Embeddings give each category a short vector where similar things sit close together.

How do we feed **categories** (like words or product IDs) into a neural network? One-hot vectors ([file 10](10-data-science-workflow.md#9-encoding-categorical-features)) would be enormous (50,000 words → 50,000-long vectors).

An **embedding layer** is a **lookup table**: a matrix with one learnable row (a dense vector) per category.

```
Vocabulary of 5 words, embedding size 3:
            dim1   dim2   dim3
"cat"  0  [ 0.21, -0.40,  0.88]
"dog"  1  [ 0.19, -0.35,  0.91]    ← similar to cat after training
"car"  2  [-0.70,  0.66,  0.05]
...
input word ID 1 → returns row 1 → [0.19, -0.35, 0.91]
```

These vectors start random and are **learned by backpropagation** like any weights. After training, similar categories end up with similar vectors (close in cosine similarity, [file 05](05-math-linear-algebra.md#7-cosine-similarity)).

```python
emb = nn.Embedding(num_embeddings=50000, embedding_dim=768)
ids = torch.tensor([[12, 403, 7]])    # a batch of 1 sequence of 3 token IDs
vectors = emb(ids)                    # shape (1, 3, 768)
```

**This is the very first layer of every LLM** (file 20).

### Worked example: a lookup is a matrix multiplication

Vocabulary of 5 words, embedding size 3. The embedding matrix E has 5 rows (one per word). The word "dog" is ID 1, which as a one-hot vector is [0, 1, 0, 0, 0]. Multiplying that one-hot by E picks out **row 1** exactly, which is why frameworks skip the multiplication and simply do a lookup.

### Worked example: closeness of vectors

Using the table above: cat = [0.21, −0.40, 0.88], dog = [0.19, −0.35, 0.91], car = [−0.70, 0.66, 0.05].
- cat · dog = 0.0399 + 0.1400 + 0.8008 = 0.9807. Lengths: |cat| = 0.989, |dog| = 0.993. Cosine = 0.9807 ÷ (0.989 × 0.993) = **0.998** (nearly the same direction).
- cat · car = −0.147 − 0.264 + 0.044 = −0.367. |car| = 0.963. Cosine = −0.367 ÷ (0.989 × 0.963) = **−0.385** (different directions).
After training, cat and dog are close and car is far, which is meaning captured as geometry.

### Worked example: how big is an embedding table?

`nn.Embedding(50000, 768)` has 50,000 × 768 = **38,400,000 parameters**. A one-hot input would need 50,000 numbers per token; an embedding needs only 768, and these 768 numbers carry learned meaning.

**Where you'll meet it in real work:** the first layer of every LLM; recommender systems that embed users and products; and the text embeddings used for search and RAG ([file 18](18-nlp-fundamentals.md)).

**Common mistakes:**
- **Feeding raw IDs as numbers** into a Linear layer (ID 7 is not "more" than ID 3).
- **Forgetting that an out-of-range ID** (≥ num_embeddings) causes an index error.
- **Assuming embeddings are fixed.** They are learned, and they are updated by backprop like any weights.

**Exam angle:** embeddings are the bridge from discrete tokens to vectors, and similarity is measured by cosine similarity or dot product.

> **සිංහලෙන්:** Embedding layer එක කියන්නේ වචන හෝ items වලට අංක ලැයිස්තුවක් (vector) දෙන lookup table එකක්. වචන 50,000ක් තියෙනවා නම් one-hot වලදී හැම වචනයකටම අංක 50,000ක් ඕනේ. Embedding එකකදී 768ක් විතරයි. ඒ අංක 768 training වලදී ඉගෙන ගන්නවා, ඒ නිසා "cat" සහ "dog" ළඟ ළඟ vectors වෙනවා (cosine 0.998), "car" ඈතට (−0.385). Embedding table එකේ parameters 50,000 × 768 = මිලියන 38.4ක්. හැම LLM එකකම පළවෙනි layer එක මේකයි.

---

## 17. Deep learning frameworks

**Why it exists:** writing backpropagation, GPU code and data pipelines yourself would take months. A framework gives you all of that in a few lines, so you can focus on the model.

| Framework | By | Notes |
|---|---|---|
| **PyTorch** | Meta | **Most popular** in research and industry; Pythonic; used by Hugging Face and most LLM code |
| **TensorFlow / Keras** | Google | Production-proven; Keras is a very easy high-level API (now multi-backend) |
| **JAX** | Google | Fast, functional style; used for large-scale research (e.g. on TPUs) |

We use **PyTorch** in this course.

Higher-level helpers on top of PyTorch: **PyTorch Lightning** (removes training-loop boilerplate), **Hugging Face Transformers + Accelerate** (pretrained models, multi-GPU), **fastai**.

### The same tiny model in two frameworks

```python
# PyTorch: you write the training loop yourself, full control
import torch.nn as nn
model = nn.Sequential(nn.Linear(784, 128), nn.ReLU(), nn.Linear(128, 10))  # 2 dense layers

# Keras: compile and fit hide the loop, very short
from tensorflow import keras
model = keras.Sequential([
    keras.layers.Dense(128, activation="relu"),   # hidden layer with ReLU
    keras.layers.Dense(10),                       # 10 output scores
])
```

| Question | Likely answer |
|---|---|
| Reading research papers and Hugging Face code? | PyTorch |
| Quick prototype with minimal code? | Keras |
| Huge-scale research on TPUs? | JAX |
| Want less boilerplate on top of PyTorch? | PyTorch Lightning |

**Where you'll meet it in real work:** almost every open-source LLM and every NVIDIA toolkit you will meet later (NeMo, TensorRT-LLM) is built around PyTorch models, so PyTorch is the safest framework to learn first.

**Common mistakes:**
- **Learning three frameworks at once.** Pick one and go deep.
- **Mixing code styles** from tutorials of different frameworks.

**Exam angle:** know the framework names and that PyTorch is the dominant choice for LLM work.

> **සිංහලෙන්:** Framework එකක් කියන්නේ backpropagation, GPU පාවිච්චිය, data loading වගේ දේවල් ඔයා වෙනුවෙන් කරලා දෙන library එකක්. ඒ නැතුව ඒවා අතින් ලියන්න මාස ගාණක් යනවා. PyTorch (Meta) තමයි වැඩිපුරම පාවිච්චි වෙන්නේ, විශේෂයෙන් LLM වැඩ වලට. Keras (Google) ඉතා සරලයි, කෝඩ් ටිකක් විතරයි ඕනේ. JAX පර්යේෂණ සහ TPU වලට. මේ course එකේ PyTorch පාවිච්චි කරනවා, ඒ නිසා මුලින් ඒක හොඳට ඉගෙන ගන්න.

---

## 18. PyTorch essentials

**Why it exists:** PyTorch has a small set of building blocks (tensors, modules, loaders, an optimiser loop). Once you recognise them, every PyTorch script you read becomes familiar.

### Tensors

```python
import torch
t = torch.tensor([[1., 2.], [3., 4.]])
t.shape, t.dtype, t.device          # torch.Size([2, 2]) torch.float32 cpu
torch.zeros(3, 4); torch.randn(2, 3)   # randn = random normal numbers
t @ t; t.T; t.sum(dim=0); t.mean()     # dim = axis (file 08)
t.view(4); t.reshape(1, 4); t.unsqueeze(0); t.squeeze()
t.numpy(); torch.from_numpy(np_array)  # convert to/from NumPy
```

### Devices (CPU/GPU)

```python
device = "cuda" if torch.cuda.is_available() else "cpu"   # "mps" on Apple Silicon
t = t.to(device)
```

⚠️ The model and data **must be on the same device**, or you get an error.

### Autograd

From [file 06](06-math-calculus.md#13-automatic-differentiation-in-code): tensors with `requires_grad=True` record operations; `loss.backward()` fills `.grad`.

### Defining a model with nn.Module

```python
import torch.nn as nn

class MLP(nn.Module):
    def __init__(self, n_in, n_hidden, n_out, p_drop=0.2):
        super().__init__()
        self.net = nn.Sequential(
            nn.Linear(n_in, n_hidden),      # W·x + b
            nn.ReLU(),
            nn.Dropout(p_drop),
            nn.Linear(n_hidden, n_hidden),
            nn.ReLU(),
            nn.Dropout(p_drop),
            nn.Linear(n_hidden, n_out),     # raw logits (no softmax!)
        )

    def forward(self, x):                   # defines the forward pass
        return self.net(x)

model = MLP(784, 256, 10)
print(sum(p.numel() for p in model.parameters()))   # parameter count
```

### Datasets and DataLoaders

- **Dataset:** knows how to get item i (an (x, y) pair).
- **DataLoader:** batches, shuffles, and loads data in parallel.

```python
from torch.utils.data import Dataset, DataLoader, TensorDataset
ds = TensorDataset(X_tensor, y_tensor)
loader = DataLoader(ds, batch_size=64, shuffle=True, num_workers=2)
for xb, yb in loader:
    ...   # xb shape (64, n_features)
```

### The five-line heart of training

```python
optimizer.zero_grad()          # 1. clear old gradients (they ACCUMULATE otherwise!)
logits = model(xb)             # 2. forward pass
loss = loss_fn(logits, yb)     # 3. compute loss
loss.backward()                # 4. backward pass: compute gradients
optimizer.step()               # 5. update parameters
```

### Train mode vs eval mode

```python
model.train()                  # dropout ON, BatchNorm uses batch stats
model.eval()                   # dropout OFF, BatchNorm uses running stats
with torch.no_grad():          # don't track gradients: saves memory and time at inference
    preds = model(x)
```

**Three classic PyTorch bugs:**
1. Forgetting `optimizer.zero_grad()` → gradients from previous batches add up.
2. Forgetting `model.eval()` before validation → dropout still active, noisy and worse results.
3. Forgetting `torch.no_grad()` at inference → memory grows, slower.

### Worked example: parameters and shapes of the MLP class above

`MLP(784, 256, 10)` has three Linear layers:
- 784 × 256 + 256 = 200,704 + 256 = 200,960
- 256 × 256 + 256 = 65,536 + 256 = 65,792
- 256 × 10 + 10 = 2,560 + 10 = 2,570
- **Total = 269,322 parameters** (that is the number `print` shows).

Shapes for a batch of 64 images: `(64, 784)` → `(64, 256)` → `(64, 256)` → `(64, 10)`. Dropout and ReLU never change a shape.

### Worked example: why `zero_grad()` matters

Gradients are **added** into `.grad` each time you call `backward()`. Say batch 1 gives a gradient of 0.5 for a weight and batch 2 gives 0.3.
- With `zero_grad()` each step: step 1 uses 0.5, step 2 uses 0.3. ✓
- Without it: step 2 would use 0.5 + 0.3 = **0.8**, which belongs to neither batch. Training quietly goes wrong. (Gradient accumulation in section 20 uses this behaviour **on purpose**.)

**Where you'll meet it in real work:** Hugging Face models are `nn.Module` subclasses; fine-tuning one means writing exactly the five-line loop above (or letting a `Trainer` do it).

**Common mistakes:** see the three classic bugs above. Also: **putting the model on the GPU but leaving a batch on the CPU**, and **calling `.item()` on a tensor you still need gradients from**.

**Exam angle:** know the roles of `nn.Module`, `Dataset`/`DataLoader`, `zero_grad`, `backward`, `step`, and `model.eval()`/`torch.no_grad()`.

> **සිංහලෙන්:** PyTorch වල කොටස් ටිකයි: tensor (අංක වගු), nn.Module (model එක), DataLoader (batches දෙන එක), සහ training එකේ හරය පේළි පහයි: zero_grad, forward, loss, backward, step. `zero_grad()` අමතක කළොත් පරණ batch එකේ gradient එකත් එකතු වෙනවා, උදා: 0.5 + 0.3 = 0.8, ඒක කිසිම batch එකකට අයිති නෑ. Evaluate කරද්දී model.eval() සහ torch.no_grad() දාන්න, නැත්නම් dropout තවමත් ක්‍රියාත්මකයි සහ memory වැඩියෙන් යනවා. MLP(784, 256, 10) එකේ parameters 269,322යි.

---

## 19. A complete training loop

**Why it exists:** all the earlier pieces (data, model, loss, optimiser, backward pass) only become useful when assembled into a loop. MNIST is the classic "hello world" because it is small, quick to train on a laptop and easy to understand.

Classify handwritten digits (**MNIST**: 70,000 grayscale 28×28 images of digits 0 to 9).

```python
import torch, torch.nn as nn
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, transforms

device = "cuda" if torch.cuda.is_available() else "cpu"
torch.manual_seed(42)

# 1. Data
tfm = transforms.Compose([transforms.ToTensor(),                     # pixels → [0,1] tensor
                          transforms.Normalize((0.1307,), (0.3081,))])  # standardise
full_train = datasets.MNIST("data", train=True, download=True, transform=tfm)
test_ds = datasets.MNIST("data", train=False, download=True, transform=tfm)
train_ds, val_ds = random_split(full_train, [55000, 5000])
train_dl = DataLoader(train_ds, batch_size=128, shuffle=True)
val_dl = DataLoader(val_ds, batch_size=512)
test_dl = DataLoader(test_ds, batch_size=512)

# 2. Model, loss, optimiser
model = nn.Sequential(nn.Flatten(),                     # (B,1,28,28) → (B,784)
                      nn.Linear(784, 256), nn.ReLU(), nn.Dropout(0.2),
                      nn.Linear(256, 128), nn.ReLU(), nn.Dropout(0.2),
                      nn.Linear(128, 10)).to(device)
loss_fn = nn.CrossEntropyLoss()
opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=0.01)

def evaluate(dl):
    model.eval()
    correct, total, loss_sum = 0, 0, 0.0
    with torch.no_grad():
        for xb, yb in dl:
            xb, yb = xb.to(device), yb.to(device)
            logits = model(xb)
            loss_sum += loss_fn(logits, yb).item() * len(yb)
            correct += (logits.argmax(1) == yb).sum().item()   # argmax = predicted class (file 04)
            total += len(yb)
    return loss_sum / total, correct / total

# 3. Training loop with early stopping
best_val, patience, bad = float("inf"), 3, 0
for epoch in range(20):
    model.train()
    for xb, yb in train_dl:
        xb, yb = xb.to(device), yb.to(device)
        opt.zero_grad()
        loss = loss_fn(model(xb), yb)
        loss.backward()
        opt.step()
    val_loss, val_acc = evaluate(val_dl)
    print(f"epoch {epoch}: val_loss={val_loss:.4f} val_acc={val_acc:.4f}")
    if val_loss < best_val:
        best_val, bad = val_loss, 0
        torch.save(model.state_dict(), "best.pt")       # save a checkpoint
    else:
        bad += 1
        if bad >= patience:
            print("early stopping"); break

# 4. Final test (once!)
model.load_state_dict(torch.load("best.pt"))
print("test:", evaluate(test_dl))     # ≈ 98% accuracy
```

**Checkpoint:** a saved copy of the model's parameters (`state_dict`) so you can resume or deploy later.

### Worked example: numbers behind the script

- **Parameters:** 784 × 256 + 256 = 200,960; 256 × 128 + 128 = 32,896; 128 × 10 + 10 = 1,290. Total = **235,146**, about 0.94 MB (×4 bytes).
- **Steps per epoch:** 55,000 training images ÷ batch 128 = 429.7, so **430 steps** (429 full batches of 128 and a last one of 88). Up to 20 epochs → at most 8,600 steps.
- **Normalise:** a pixel value is turned into (x − 0.1307) ÷ 0.3081. A black pixel (0) → **−0.424**; a white pixel (1) → (1 − 0.1307) ÷ 0.3081 = **2.82**. The values 0.1307 and 0.3081 are MNIST's own average and spread.
- **Initial loss check:** with 10 classes the first printed loss should be near ln(10) = 2.30. In the first epochs the loss might fall like 2.30 → 0.35 → 0.15 → 0.10 on its way to roughly 98% accuracy.

### How to read the output

```
epoch 0: val_loss=0.1521 val_acc=0.9548
epoch 1: val_loss=0.1105 val_acc=0.9672
epoch 2: val_loss=0.0987 val_acc=0.9712
epoch 3: val_loss=0.0994 val_acc=0.9709   ← no improvement (bad = 1)
```
(Illustrative values; yours will differ slightly.) Validation loss stopped improving at epoch 2, so the checkpoint saved then is the one to keep. Early stopping ends the run after `patience` bad epochs.

**Where you'll meet it in real work:** the very same skeleton (data → model → loss → optimiser → loop → checkpoint → evaluate once on test) trains an LLM fine-tune; only the model and the data change.

**Common mistakes:**
- **Evaluating on the test set during training** and picking the best epoch by it. Use validation, test once.
- **Forgetting `.to(device)` for the data.**
- **Saving only the final model** instead of the best one.

**Exam angle:** know the order of the steps and that the test set is used once at the end.

> **සිංහලෙන්:** MNIST කියන්නේ අත් අකුරින් ලියපු ඉලක්කම් පින්තූර 70,000ක data set එකක්, neural networks වල "Hello World" එක. Training loop එකේ පියවර: data සූදානම් කරනවා, model/loss/optimiser හදනවා, epochs ගාණක් ගිහින් හැම epoch එකකම validation බලනවා, හොඳම checkpoint එක save කරනවා, අන්තිමට test set එක එක පාරක් විතරක් පාවිච්චි කරනවා. අපේ model එකේ parameters 235,146යි. Train images 55,000ක් batch 128කින් ගියාම epoch එකකට පියවර 430යි. Test එක පාවිච්චි කරලා හොඳම epoch එක තෝරන්න එපා, ඒක validation එකට.

---

## 20. GPUs, memory and mixed precision

**Why it exists:** large models run out of GPU memory long before they run out of ideas. Knowing where the memory goes, and the tricks that shrink it, is what lets you train or fine-tune a decent model on the hardware you actually have.

### What uses GPU memory during training

1. **Model parameters** (weights)
2. **Gradients** (same size as parameters)
3. **Optimiser state** (Adam: 2× parameters)
4. **Activations** saved for backprop (grow with batch size and model depth)

**Out of memory ("CUDA out of memory")?** Reduce batch size; use mixed precision; use gradient accumulation (below); use a smaller model.

### Mixed precision training

Use **16-bit** numbers (FP16 or BF16, [file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes)) for most calculations and keep 32-bit where precision matters.

✅ About **2× less memory** for activations, and much faster on GPUs with **Tensor Cores** ([file 05](05-math-linear-algebra.md#16-why-gpus)).

- **FP16:** small range: tiny gradients can **underflow** to 0. Needs **loss scaling** (multiply the loss by a big number before backward, divide gradients afterwards), handled by `GradScaler`.
- **BF16 (bfloat16):** same range as FP32 but less precision. No loss scaling needed. **Preferred on modern GPUs** (A100, H100) and for LLMs.

```python
scaler = torch.amp.GradScaler()            # only needed for fp16
for xb, yb in train_dl:
    opt.zero_grad()
    with torch.autocast(device_type="cuda", dtype=torch.bfloat16):   # or torch.float16
        loss = loss_fn(model(xb), yb)
    loss.backward()                        # for fp16: scaler.scale(loss).backward(); scaler.step(opt); scaler.update()
    opt.step()
```

### Gradient accumulation

Want an effective batch of 256 but only 64 fit in memory? Run 4 mini-batches, add up their gradients (don't zero them in between), then step once.

```python
accum = 4
for i, (xb, yb) in enumerate(train_dl):
    loss = loss_fn(model(xb), yb) / accum      # divide so the total is an average
    loss.backward()
    if (i + 1) % accum == 0:
        opt.step(); opt.zero_grad()
```

**Effective batch size** = per-device batch × accumulation steps × number of GPUs.

### Other tricks

- **Activation (gradient) checkpointing:** don't store all activations; recompute them during backward. Saves memory at the cost of ~30% more compute.
- **`torch.compile(model)`:** compiles the model for faster execution.
- **Multi-GPU training** (data parallel, model parallel): [file 21](21-training-finetuning-alignment.md).

### Worked example: memory for a 1-billion-parameter model

Plain 32-bit training with Adam:
- Weights: 1 × 10⁹ × 4 bytes = **4 GB**
- Gradients: **4 GB**
- Adam's two states: 2 × 4 = **8 GB**
- Total ≈ **16 GB**, and activations come on top. So a 16 GB GPU cannot train it in plain FP32. Mixed precision keeps working copies in 16 bits (2 GB for the weights) and cuts activation memory roughly in half.

### Worked example: FP16 underflow and loss scaling

The smallest positive FP16 number is about 6 × 10⁻⁸. A true gradient of 1 × 10⁻⁸ becomes **0** in FP16, and learning silently stops for that weight. Loss scaling multiplies the loss (and therefore all gradients) by 65,536 (2¹⁶, the usual starting value for `GradScaler`): 1 × 10⁻⁸ × 65,536 = 6.6 × 10⁻⁴, easily representable. Before the optimiser step the gradients are divided by the same factor. BF16 has the same range as FP32, so it needs no scaling.

### Worked example: effective batch size

Per-GPU batch 16, gradient accumulation of 8 steps, 4 GPUs: 16 × 8 × 4 = **512** examples per optimiser update. The learning rate usually needs to be re-tuned when the effective batch size changes.

**Where you'll meet it in real work:** choosing a GPU for fine-tuning (a 24 GB card vs an 80 GB A100/H100), and reading NVIDIA's training guides, which are full of BF16, Tensor Cores and gradient checkpointing.

**Common mistakes:**
- **Using FP16 without a GradScaler.**
- **Forgetting to divide the loss by the accumulation steps,** which makes gradients too large.
- **Estimating memory from parameters only** and ignoring optimiser state and activations.

**Exam angle:** NVIDIA-flavoured exams like questions on mixed precision (FP16 vs BF16), Tensor Cores, and memory-saving techniques (gradient accumulation, activation checkpointing).

> **සිංහලෙන්:** Training වලදී GPU memory එක යන්නේ ක්‍රම හතරකට: weights, gradients, Adam states (weights මෙන් දෙගුණයක්), සහ backprop එකට save කරන activations. පරාමිති බිලියනයක model එකක් 32-bit වලින් train කළොත් 4 + 4 + 8 = 16 GB ඕනේ, activations ඊට අමතරව. Mixed precision එකේදී 16-bit පාවිච්චි කරනවා, මතකය අඩු වෙනවා, Tensor Cores නිසා වේගයත් වැඩියි. FP16 වලදී පොඩි gradients බින්දුව වෙන්න පුළුවන් නිසා loss scaling කරනවා, BF16 වලට ඒක ඕනේ නෑ. Memory මදි නම් gradient accumulation කරන්න, උදා: 16 × 8 = 128 effective batch.

---

## 21. Debugging neural networks

**Why it exists:** neural networks rarely fail with an error message. They fail by quietly learning nothing. A short list of systematic checks saves days of guessing.

**Sanity checks (do these first):**
1. **Check the initial loss.** For K classes it should be about ln(K) ([file 07](07-math-probability-statistics.md#23-cross-entropy)). 10 classes → ~2.30.
2. **Overfit a tiny batch.** Train on 10 examples. The loss should go to ~0. If not, there's a bug (wrong labels, wrong loss, broken model).
3. **Check shapes** everywhere ([file 05](05-math-linear-algebra.md#13-tensors)).
4. **Look at your data** after preprocessing (plot some images with labels).

**Common symptoms:**

| Symptom | Likely causes |
|---|---|
| Loss is NaN / inf | LR too high; exploding gradients; log(0); bad data (NaN in inputs) |
| Loss doesn't decrease at all | LR too low or too high; bug (forgot `zero_grad`/`step`); labels shuffled separately from inputs; softmax applied twice |
| Training loss falls, validation rises | Overfitting → regularise, augment, more data, early stopping |
| Both losses high and flat | Underfitting → bigger model, train longer, higher LR, check features |
| Validation much worse than expected | Forgot `model.eval()`; train/val preprocessing mismatch |
| Loss very noisy | LR too high; batch too small |

**Tools:** TensorBoard or **Weights & Biases** (file 28) to plot losses, learning rates and gradient norms over time.

### Worked example: the initial loss test

If the network starts with random weights and all classes are equally likely, the cross-entropy should be about ln(K):
- 2 classes: ln 2 = **0.693**
- 10 classes: ln 10 = **2.303**
- 1,000 classes: ln 1000 = **6.908**

A first loss of 23.5 on a 10-class problem is ten times too high: the output layer is badly scaled or the labels are wrong. A first loss of exactly 0.693 that never moves on a binary problem means the model always says "50%", so gradients are not reaching the weights.

### Worked example: reading three loss curves

| What you see | Meaning | What to try |
|---|---|---|
| Train 0.02, validation 0.90 | Memorising | More data, dropout, weight decay, early stopping |
| Train 0.85, validation 0.87, both flat | Underfitting | Bigger model, higher LR, train longer |
| Train 0.40 then NaN | Exploding | Lower LR, clip gradients, check for bad data |

### The overfit-one-batch drill

Take 10 examples and train for 200 steps. A healthy pipeline drives the loss near 0 and reaches 100% accuracy on them. If not, the bug is in the code (labels, loss, shapes), not in the data size.

**Where you'll meet it in real work:** every time you fine-tune a model. Before spending hours of GPU time, run the drill and print a few decoded samples.

**Common mistakes:**
- **Tuning hyperparameters when the real bug is in the data pipeline.**
- **Changing five things at once,** so you cannot tell which fixed it.
- **Not setting a random seed,** which makes bugs impossible to reproduce.

**Exam angle:** know the symptom-to-cause table (NaN loss, flat loss, overfitting) and the ln(K) trick.

> **සිංහලෙන්:** Neural network එකක් වැරදුණාම error එකක් එන්නේ නෑ, ඒක නිකම්ම ඉගෙන ගන්නේ නෑ. ඒ නිසා පියවරෙන් පියවර පරීක්ෂා කරන්න. පළවෙනි එක initial loss: classes 10ක් නම් ln(10) ≈ 2.3 වගේ අගයකින් පටන් ගන්න ඕනේ, 23.5 නම් යම් වැරැද්දක් තියෙනවා. දෙවැන්න, උදාහරණ 10ක් විතරක් අරන් train කරලා loss එක 0ට ගේන්න බලන්න, බැරි නම් code එකේ bug එකක්. Train loss එක අඩු වෙලා validation එක වැඩි වෙනවා නම් overfitting, දෙකම ඉහළ නම් underfitting. Loss එක NaN වෙනවා නම් learning rate එක අඩු කරන්න.


```quiz
[
  {"q": "A neuron has inputs [2, 3], weights [0.5, -1] and bias 1, with ReLU activation. What is its output?", "options": ["-1", "0", "1", "0.27"], "answer": 1, "why": "z = 0.5 x 2 + (-1) x 3 + 1 = -1, and ReLU(-1) = 0. The value -1 is the pre-activation z, not the output. 0.27 would be the output if the activation were sigmoid."},
  {"q": "How many parameters does an MLP with layers 3 -> 4 -> 3 -> 2 have?", "options": ["24", "39", "30", "9"], "answer": 1, "why": "3x4+4 = 16, 4x3+3 = 15, 3x2+2 = 8, total 39. Forgetting the biases gives 12+12+6 = 30; counting only layer sizes gives 9."},
  {"q": "Why can a stack of many layers without activation functions not learn XOR?", "options": ["It has too few parameters", "Stacked linear layers collapse into one linear layer, and XOR is not linearly separable", "XOR needs a recurrent network", "Gradient descent cannot be used without activations"], "answer": 1, "why": "W2 x (W1 x) = (W2 W1) x, so any depth is still one matrix. The parameter count is not the issue, and gradient descent still works; the model class is simply too weak."},
  {"q": "A 10-class classifier is initialised randomly and its first training loss is about 2.3. What does that tell you?", "options": ["Something is wrong; it should be 0", "It is normal, since ln(10) is about 2.3 for a model that guesses uniformly", "The learning rate is too high", "The model is overfitting"], "answer": 1, "why": "A model guessing uniformly over 10 classes gives -ln(1/10) = ln(10) = 2.30. Zero loss at the start would be suspicious, and overfitting only shows up later on validation data."},
  {"q": "You use nn.CrossEntropyLoss in PyTorch. What should the final layer of your model output?", "options": ["Softmax probabilities", "Raw logits", "Sigmoid probabilities", "One-hot vectors"], "answer": 1, "why": "CrossEntropyLoss applies log-softmax internally. Adding your own softmax means it is applied twice, which weakens the gradients and quietly hurts training."},
  {"q": "The gradient is [6, 8] and max_norm is 5. What is the gradient after clipping?", "options": ["[5, 5]", "[3, 4]", "[0.6, 0.8]", "[6, 8] (no change)"], "answer": 1, "why": "The norm is sqrt(36 + 64) = 10, so scale by 5 / 10 = 0.5, giving [3, 4] with norm 5. [0.6, 0.8] would be the result for max_norm 1."},
  {"q": "Which statement about dropout is correct?", "options": ["It is applied only at inference to save memory", "It randomly zeros activations during training and is turned off by model.eval()", "It permanently deletes neurons from the network", "It increases the number of parameters"], "answer": 1, "why": "Dropout is a training-time regulariser. At inference all neurons are used, which is why forgetting model.eval() gives noisy, worse results. It never changes the number of parameters."},
  {"q": "Why do transformers use LayerNorm rather than BatchNorm?", "options": ["LayerNorm is newer", "LayerNorm normalises each example on its own, so it does not depend on batch size and behaves the same in training and inference", "BatchNorm cannot normalise numbers", "LayerNorm has more parameters"], "answer": 1, "why": "BatchNorm uses batch statistics, which are unreliable for small batches and variable-length sequences and differ between training and inference. Being newer is not a reason."}
]
```

---

## 22. Check yourself

**Q1.** A neuron has inputs [1, −2, 3], weights [0.2, 0.5, −0.1], bias 0.4, activation ReLU. Output?
<details><summary>Answer</summary>z = 0.2 − 1.0 − 0.3 + 0.4 = −0.7 → ReLU → **0**.</details>

**Q2.** Why can't a network without activation functions learn XOR, no matter how many layers?
<details><summary>Answer</summary>Stacked linear layers collapse into one linear transformation; XOR isn't linearly separable.</details>

**Q3.** Count the parameters of an MLP: 20 inputs → 64 → 32 → 1.
<details><summary>Answer</summary>20×64+64 = 1,344; 64×32+32 = 2,080; 32×1+1 = 33. Total **3,457**.</details>

**Q4.** Which output layer and loss for: (a) predicting age, (b) 5-class sentiment, (c) tagging a photo with any of 20 objects?
<details><summary>Answer</summary>(a) 1 linear output + MSE; (b) 5 logits + CrossEntropyLoss; (c) 20 logits + BCEWithLogitsLoss (sigmoid per label).</details>

**Q5.** Your model ends with `nn.Softmax()` and you use `nn.CrossEntropyLoss`. Problem?
<details><summary>Answer</summary>CrossEntropyLoss already applies (log-)softmax. Applying softmax twice hurts training. Output raw logits.</details>

**Q6.** What does Adam combine, and why is AdamW preferred for transformers?
<details><summary>Answer</summary>Momentum (running mean of gradients) + RMSProp-style per-parameter scaling (running mean of squared gradients), with bias correction. AdamW decouples weight decay from the adaptive update, which regularises correctly.</details>

**Q7.** Why use learning rate warmup?
<details><summary>Answer</summary>Early on, weights are random and Adam's statistics are unreliable; large steps can destabilise training. Warmup ramps the LR up gradually.</details>

**Q8.** Gradient [6, 8] with max_norm 5. What's the clipped gradient?
<details><summary>Answer</summary>Norm = 10 → scale by 5/10 → **[3, 4]**.</details>

**Q9.** BatchNorm vs LayerNorm: which do transformers use and why?
<details><summary>Answer</summary>LayerNorm (or RMSNorm). It normalises each example independently, so it doesn't depend on batch size or sequence padding and behaves the same in training and inference.</details>

**Q10.** How do residual connections help deep networks?
<details><summary>Answer</summary>output = x + F(x) gives gradients a direct path (derivative includes +1), preventing vanishing gradients; blocks only learn changes.</details>

**Q11.** Your 10-class classifier starts with loss 23.5. What's suspicious?
<details><summary>Answer</summary>Expected ≈ ln(10) ≈ 2.3. A much higher loss suggests bad initialisation, wrongly scaled inputs, or a bug.</details>

**Q12.** You can fit batch size 16 but want 128. How?
<details><summary>Answer</summary>Gradient accumulation over 8 steps (16 × 8 = 128), and/or mixed precision / activation checkpointing to fit more.</details>

**Q13.** Softmax is applied to logits [2, 1, 0]. What is the probability of the first class, and what loss do you get if it is the right answer?
<details><summary>Answer</summary>e² ÷ (e² + e¹ + e⁰) = 7.389 ÷ 11.107 = **0.665**. Loss = −ln(0.665) = **0.41**.</details>

**Q14.** A layer's output is [1, 2, 3, 4]. Dropout with p = 0.5 keeps neurons 2 and 4. What is the training-time output?
<details><summary>Answer</summary>Survivors are scaled by 1 ÷ (1 − 0.5) = 2, so the output is **[0, 4, 0, 8]**.</details>

**Q15.** A residual block has input x = [3, 5] and F(x) = [−1, 2]. What is its output?
<details><summary>Answer</summary>x + F(x) = [3 − 1, 5 + 2] = **[2, 7]**.</details>

---

## 23. New words in this file

| Word | Meaning |
|---|---|
| Biological neuron, dendrite, axon | Brain cell and its parts |
| Artificial neuron | Weighted sum + bias + activation |
| Perceptron, step function | Early neuron model / output 1 if z > 0 |
| Linearly separable, XOR problem | Separable by a straight line / classic non-separable case |
| AI winter | Period of collapsed AI interest/funding |
| MLP / feed-forward / fully connected network | Layers of dense neurons |
| Input, hidden, output layer | Network parts |
| Dense / linear layer | Every input connected to every neuron |
| Deep network | Many hidden layers |
| Representation learning | Network learns its own features |
| Universal approximation theorem | One wide hidden layer can approximate any function |
| Non-linearity | Activation that lets networks learn curves |
| Sigmoid, tanh, ReLU, Leaky ReLU, GELU, SiLU/Swish, SwiGLU, softmax | Activation functions |
| Dying ReLU | Neuron stuck outputting 0 |
| Logits | Raw scores before softmax/sigmoid |
| `BCEWithLogitsLoss`, `CrossEntropyLoss` | PyTorch losses taking raw logits |
| Forward pass / backpropagation | Compute output / compute gradients backwards |
| Optimiser: SGD, momentum, RMSProp, Adam, AdamW | Update rules |
| First/second moment, bias correction, ε | Adam's running averages and fixes |
| Decoupled weight decay | Shrink weights directly (AdamW) |
| LR schedule: step, exponential, cosine, plateau, one-cycle | Changing LR over training |
| Warmup | Gradually increase LR at the start |
| LR finder | Test LRs to pick a good one |
| Weight initialisation, symmetry problem | Starting weights / identical neurons if all equal |
| Xavier/Glorot, He/Kaiming init | Init scaled for tanh/sigmoid / ReLU |
| Gradient clipping, max_norm | Cap gradient length |
| Dropout, inverted dropout | Randomly zero neurons in training / rescale survivors |
| Patience | Epochs to wait before early stopping |
| Label smoothing | Soften one-hot targets |
| BatchNorm, LayerNorm, RMSNorm, γ/β | Normalisation layers and their learnable scale/shift |
| Residual / skip connection, ResNet | output = x + F(x) |
| Embedding layer | Learnable lookup table of vectors per category/token |
| PyTorch, TensorFlow, Keras, JAX, Lightning | Deep learning frameworks |
| Tensor, device, CUDA, MPS | PyTorch array / CPU or GPU / NVIDIA / Apple GPU |
| `nn.Module`, `forward`, `nn.Sequential` | Model class / forward computation / layer stack |
| Dataset, DataLoader | Item access / batching and shuffling |
| `zero_grad`, `backward`, `step` | Clear, compute, apply gradients |
| `model.train()` / `model.eval()` / `torch.no_grad()` | Training mode / inference mode / disable gradient tracking |
| MNIST | Handwritten digit dataset |
| Checkpoint, `state_dict` | Saved parameters |
| CUDA out of memory | GPU memory exhausted |
| Mixed precision, FP16, BF16, autocast | 16-bit training |
| Loss scaling, GradScaler | Prevent FP16 gradient underflow |
| Gradient accumulation, effective batch size | Sum gradients over steps / total examples per update |
| Activation checkpointing | Recompute activations to save memory |
| `torch.compile` | Compile model for speed |
| TensorBoard, Weights & Biases | Training visualisation tools |
| Numerical gradient check | Nudging a weight slightly to verify a hand-computed gradient |
| Pre-activation (z) vs activation (a) | Weighted sum before / output after the activation function |
| Vanishing / exploding gradient factor | Per-layer multiplier whose product shrinks or blows up the gradient |
| Overfit-one-batch test | Debug drill: a tiny batch should reach near-zero loss |
| Effective batch size | Per-GPU batch × accumulation steps × number of GPUs |

**Next:** [16-cnns-and-computer-vision.md](16-cnns-and-computer-vision.md)
