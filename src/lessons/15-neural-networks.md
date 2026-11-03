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

---

## 2. The perceptron and its limits

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

---

## 3. Multi-layer perceptrons

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

---

## 4. Why we need non-linear activations

What if we skipped the activation function (used f(z) = z)?

Two layers: h = W₁x, then y = W₂h = W₂W₁x = **W'x**, where W' = W₂W₁ is just another matrix.

**Stacking linear layers gives you... one linear layer.** No matter how deep, it could only learn straight-line relationships (like linear regression).

**Non-linear** activation functions (ReLU, sigmoid, ...) between layers let the network bend and fold space, building up complex curved decision boundaries.

**Analogy:** with only straight sticks, you can only make straight lines. Add hinges (non-linearities) between the sticks, and you can build any shape.

---

## 5. Activation functions

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

---

## 6. Output layers and loss functions

Match the output layer to the task ([file 11](11-ml-fundamentals.md#6-loss-functions)):

| Task | Output layer | Loss | PyTorch |
|---|---|---|---|
| Regression | 1 neuron, no activation | MSE (or MAE/Huber) | `nn.MSELoss()` |
| Binary classification | 1 neuron + sigmoid | Binary cross-entropy | `nn.BCEWithLogitsLoss()` (takes raw logits) |
| Multi-class (one correct) | K neurons + softmax | Cross-entropy | `nn.CrossEntropyLoss()` (takes raw logits) |
| Multi-label (several correct) | K neurons + sigmoid each | BCE per label | `nn.BCEWithLogitsLoss()` |

⚠️ **PyTorch gotcha:** `nn.CrossEntropyLoss` and `nn.BCEWithLogitsLoss` apply softmax/sigmoid **internally** for numerical stability. Feed them **raw logits** (no softmax/sigmoid in your model's last layer). Adding softmax yourself is a common bug that silently hurts training.

---

## 7. Forward pass worked example

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

---

## 8. Backpropagation worked example

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

---

## 9. Optimisers

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

---

## 10. Learning rate schedules

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

---

## 11. Weight initialisation

**Why it matters:** if all weights start at 0, every neuron in a layer computes the same thing and gets the same gradient. They stay identical forever (**symmetry problem**). So we start with **small random** numbers.

But how small? If too big, activations explode layer after layer; if too small, they shrink to zero. Good initialisation keeps the **variance** of activations roughly constant across layers ([file 07](07-math-probability-statistics.md#3-measures-of-spread)).

| Method | Weight std | Use with |
|---|---|---|
| **Xavier / Glorot** | √(2 / (n_in + n_out)) | sigmoid, tanh |
| **He / Kaiming** | √(2 / n_in) | **ReLU** family |

(n_in = number of inputs to the layer.) Weights are drawn from a normal or uniform distribution with that spread.

Modern frameworks pick sensible defaults. In LLMs, special tricks (like scaling down the weights of residual layers) keep very deep networks stable.

---

## 12. Vanishing and exploding gradients

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

---

## 13. Regularisation in deep learning

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

---

## 14. Normalisation layers

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

---

## 15. Residual connections

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

---

## 16. Embedding layers

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

---

## 17. Deep learning frameworks

| Framework | By | Notes |
|---|---|---|
| **PyTorch** | Meta | **Most popular** in research and industry; Pythonic; used by Hugging Face and most LLM code |
| **TensorFlow / Keras** | Google | Production-proven; Keras is a very easy high-level API (now multi-backend) |
| **JAX** | Google | Fast, functional style; used for large-scale research (e.g. on TPUs) |

We use **PyTorch** in this course.

Higher-level helpers on top of PyTorch: **PyTorch Lightning** (removes training-loop boilerplate), **Hugging Face Transformers + Accelerate** (pretrained models, multi-GPU), **fastai**.

---

## 18. PyTorch essentials

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

---

## 19. A complete training loop

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

---

## 20. GPUs, memory and mixed precision

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

---

## 21. Debugging neural networks

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

**Next:** [16-cnns-and-computer-vision.md](16-cnns-and-computer-vision.md)
