# 05: Maths 2: Linear Algebra (Vectors, Matrices, Tensors)

> **Before you start:** [04](04-math-numbers-and-functions.md) (functions, Σ notation, square roots, y = wx + b) and [02](02-python-programming.md) (lists).
>
> **After this file you can:** understand vectors, matrices and tensors, the "data containers" of AI. You'll be able to compute dot products, matrix multiplications and distances, and explain why AI runs on GPUs.

**Why linear algebra?** In AI, *everything* is turned into lists of numbers ([file 01](01-big-picture-and-data.md#9-data-types)): a customer, a word, an image, a sentence. Linear algebra is the maths of working with lists and grids of numbers. Neural networks are, at their core, lots of matrix multiplications.

---

## Table of contents

1. [Scalars](#1-scalars)
2. [Vectors](#2-vectors)
3. [Vector operations](#3-vector-operations)
4. [Length of a vector (norm)](#4-length-of-a-vector-norm)
5. [Distance between vectors](#5-distance-between-vectors)
6. [The dot product](#6-the-dot-product)
7. [Cosine similarity](#7-cosine-similarity)
8. [Matrices](#8-matrices)
9. [Matrix operations](#9-matrix-operations)
10. [Matrix multiplication](#10-matrix-multiplication)
11. [Transpose, identity, inverse](#11-transpose-identity-inverse)
12. [A neural network layer is a matrix multiplication](#12-a-neural-network-layer-is-a-matrix-multiplication)
13. [Tensors](#13-tensors)
14. [Broadcasting](#14-broadcasting)
15. [Advanced ideas (intuition only): rank, determinant, eigenvectors, SVD](#15-advanced-ideas-intuition-only)
16. [Why GPUs?](#16-why-gpus)
17. [Check yourself](#17-check-yourself)
18. [New words in this file](#18-new-words-in-this-file)

---

## 1. Scalars

**Idea:** A **scalar** is just a single number: 5, −2.3, 0.001.

Examples: a temperature, a price, a learning rate. Written in normal lowercase italics: *x*, *a*, *λ*.

---

## 2. Vectors

**Idea:** A **vector** is an ordered list of numbers.

```
v = [3, 4]
house = [120, 3, 15]      ← size m², bedrooms, age in years
```

The **dimension** (or length) of a vector is how many numbers it holds. `[3, 4]` is 2-dimensional; `house` is 3-dimensional. "v ∈ ℝ³" means v is a list of 3 real numbers ([file 04](04-math-numbers-and-functions.md#17-inequalities-intervals-and-set-notation)).

Written in **bold** (**v**) or with an arrow (v⃗). Each number is an **element** or **component**: v₁ = 3, v₂ = 4.

### Two ways to picture a vector

**1. As an arrow** from the origin to a point. `[3, 4]` is an arrow pointing 3 right and 4 up.

```
  y
  4 ┤      ↗ (3, 4)
  3 ┤    ╱
  2 ┤  ╱
  1 ┤╱
  ──┼──┬──┬──┬──► x
       1  2  3
```

**2. As a point in "feature space"**: a description of something by its measurements.

A customer `[age=34, income=50, visits=12]` is a point in 3-D space. Two similar customers are two points close together. This "similar things = nearby points" idea is **the foundation of embeddings, recommendation, and search** (files 14, 18, 23).

### Rows of a table are vectors

| size | bedrooms | age |
|---|---|---|
| 120 | 3 | 15 |
| 80 | 2 | 5 |

Each row is a vector: `[120, 3, 15]` and `[80, 2, 5]`. The **feature vector** of a data point is its list of feature values ([file 01](01-big-picture-and-data.md#10-tables-rows-columns-features-labels)).

### Word embeddings preview

In LLMs, each word (actually each *token*, file 20) is represented by a vector of hundreds or thousands of numbers, e.g. "king" → [0.21, −0.45, 0.88, ..., 0.03] (768 numbers). Words with similar meanings get similar vectors. Covered in [file 18](18-nlp-fundamentals.md).

---

## 3. Vector operations

### Adding vectors: add element by element

```
[1, 2] + [3, 4] = [1+3, 2+4] = [4, 6]
```

Both vectors must be the same length.

**Picture:** put the arrows tip to tail.

**Famous example (word embeddings):** king − man + woman ≈ queen. Vector arithmetic captures meaning! (file 18)

### Subtracting: element by element

```
[5, 7] − [2, 3] = [3, 4]
```

### Multiplying by a scalar: multiply every element

```
3 × [1, 2] = [3, 6]
0.5 × [4, 8] = [2, 4]
```

This stretches or shrinks the arrow. A negative scalar flips its direction.

### Element-wise multiplication (Hadamard product)

```
[1, 2, 3] ⊙ [4, 5, 6] = [4, 10, 18]
```

Written ⊙ or ∘. In NumPy (file 08), plain `*` on arrays does this.

```python
import numpy as np        # NumPy: fast arrays (file 08)
a = np.array([1, 2, 3])
b = np.array([4, 5, 6])
a + b      # [5, 7, 9]
a - b      # [-3, -3, -3]
3 * a      # [3, 6, 9]
a * b      # [4, 10, 18]  (element-wise)
```

---

## 4. Length of a vector (norm)

**Idea:** the **norm** measures how "big" a vector is, like the length of the arrow.

### L2 norm (Euclidean length): the usual "straight-line" length

From Pythagoras' theorem (a² + b² = c² for a right-angled triangle):

```
‖v‖₂ = √(v₁² + v₂² + ... + vₙ²)
```

**Example:** v = [3, 4]
‖v‖ = √(3² + 4²) = √(9 + 16) = √25 = **5**

### L1 norm (Manhattan length): sum of absolute values

```
‖v‖₁ = |v₁| + |v₂| + ... + |vₙ|
```

v = [3, −4] → ‖v‖₁ = 3 + 4 = **7**

Called "Manhattan" because it's like walking city blocks in a grid: you can't cut diagonally.

### Where norms show up

- **Regularisation** (file 11): L1 and L2 norms of the model's weights are added to the loss to keep weights small.
- **Gradient clipping** (file 15): if the gradient's norm is too big, shrink it.
- **Normalising** a vector: divide it by its length to get a **unit vector** (length 1). [3, 4] / 5 = [0.6, 0.8]. Used before cosine similarity.

```python
v = np.array([3, 4])
np.linalg.norm(v)          # 5.0  (L2)
np.linalg.norm(v, ord=1)   # 7.0  (L1)
v / np.linalg.norm(v)      # [0.6, 0.8]  unit vector
```

---

## 5. Distance between vectors

**Idea:** how far apart two points are = the norm of their difference.

### Euclidean distance (L2)

```
d(a, b) = √((a₁−b₁)² + (a₂−b₂)² + ... )
```

**Example:** a = [1, 2], b = [4, 6]
difference = [−3, −4] → √(9 + 16) = **5**

### Manhattan distance (L1)

|1−4| + |2−6| = 3 + 4 = **7**

**Where used:** k-Nearest Neighbours (file 12) and k-Means clustering (file 14) find nearby points by distance.

⚠️ **Scale matters!** If one feature is income (in thousands, e.g. 50,000) and another is age (e.g. 34), income completely dominates the distance. That's why we **scale** features (file 10) before using distances.

---

## 6. The dot product

**This is the single most important operation in AI.** Neural networks, attention in transformers and similarity search all use it.

**Idea:** multiply matching elements, then add them all up. The result is a **single number** (a scalar).

```
a · b = a₁b₁ + a₂b₂ + ... + aₙbₙ = Σ aᵢbᵢ
```

**Example:** a = [1, 2, 3], b = [4, 5, 6]
a · b = 1×4 + 2×5 + 3×6 = 4 + 10 + 18 = **32**

```python
np.dot(a, b)    # 32
a @ b           # 32  (@ is the matrix multiplication operator)
```

### Why it matters, meaning #1: weighted sum

A linear model ([file 04](04-math-numbers-and-functions.md#8-straight-lines-slope-and-intercept)) is a dot product plus a bias:

```
price = w₁·size + w₂·bedrooms + w₃·age + b  =  w · x + b
```

**Example:** weights w = [2, 10, −1] (thousands of $ per unit), house x = [120, 3, 15], b = 50
w · x = 2×120 + 10×3 + (−1)×15 = 240 + 30 − 15 = 255 → price = 255 + 50 = **$305k**

Each weight says how much a feature matters, and in which direction (age has a negative weight: older is cheaper).

**Analogy:** your final exam grade = 0.3 × assignments + 0.2 × quizzes + 0.5 × final exam. That's a dot product of [0.3, 0.2, 0.5] with your scores.

### Why it matters, meaning #2: similarity

The dot product is **large and positive** when vectors point in the **same direction**, **zero** when they're **perpendicular** (unrelated), and **negative** when they point in **opposite** directions.

```
same direction       perpendicular        opposite
  →  →                 →  ↑                 →  ←
  dot > 0              dot = 0              dot < 0
```

**Examples:**
- [1, 0] · [1, 0] = 1 (same)
- [1, 0] · [0, 1] = 0 (perpendicular, also called **orthogonal**)
- [1, 0] · [−1, 0] = −1 (opposite)

This is how search engines and LLM attention measure "how related are these two things?"

---

## 7. Cosine similarity

**Problem:** the dot product also grows with vector length. A long vector gives a big dot product even if it's not very similar.

**Fix:** divide by both lengths. Now only the **direction** (angle) matters:

```
                   a · b
cos_sim(a, b) = ─────────────
                 ‖a‖ × ‖b‖
```

The result is always between **−1 and 1**:
- **1** = same direction (very similar)
- **0** = unrelated
- **−1** = opposite

**Example:** a = [1, 2], b = [2, 4] (b is just a doubled)
a · b = 2 + 8 = 10; ‖a‖ = √5 ≈ 2.236; ‖b‖ = √20 ≈ 4.472
cos = 10 / (2.236 × 4.472) = 10 / 10 = **1.0**: same direction, perfectly similar.

**Example:** a = [1, 0], b = [1, 1]
a · b = 1; ‖a‖ = 1; ‖b‖ = √2 ≈ 1.414 → cos = 1/1.414 ≈ **0.707** (45° apart)

```python
def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))
```

**Where used:** comparing text **embeddings** in semantic search and RAG (file 23): "find documents whose meaning is closest to the question". If vectors are already normalised to length 1, cosine similarity = dot product, which is faster.

---

## 8. Matrices

**Idea:** A **matrix** is a rectangular grid of numbers: rows and columns. Like a table or spreadsheet with only numbers.

```
      ┌         ┐
A  =  │ 1  2  3 │     ← row 1
      │ 4  5  6 │     ← row 2
      └         ┘
        ↑  ↑  ↑
       col col col
        1   2   3
```

**Shape:** (rows × columns). A is **2 × 3** (2 rows, 3 columns). Always rows first.

**Element:** Aᵢⱼ = row i, column j. A₁₂ = 2, A₂₃ = 6.

Matrices are written in **bold capitals**: **A**, **W**, **X**.

### Where matrices appear

- **A dataset** is a matrix: each row is an example, each column a feature. 1,000 houses × 3 features = a 1000 × 3 matrix **X**.
- **A grayscale image** is a matrix of pixel brightness values (e.g. 28 × 28).
- **A neural network layer's weights** are a matrix **W** (section 12).
- **Word embeddings** for a vocabulary of 50,000 words, 768 numbers each = a 50,000 × 768 matrix.

A vector can be seen as a matrix with one column (a **column vector**, n × 1) or one row (a **row vector**, 1 × n).

```python
A = np.array([[1, 2, 3],
              [4, 5, 6]])
A.shape     # (2, 3)
A[0, 1]     # 2   (row 0, column 1; Python counts from 0)
A[1]        # [4, 5, 6]  (second row)
A[:, 0]     # [1, 4]     (first column)
```

---

## 9. Matrix operations

### Addition and scalar multiplication: element by element (same shape needed)

```
┌ 1 2 ┐   ┌ 5 6 ┐   ┌  6  8 ┐          ┌ 1 2 ┐   ┌ 2 4 ┐
│ 3 4 │ + │ 7 8 │ = │ 10 12 │      2 × │ 3 4 │ = │ 6 8 │
└     ┘   └     ┘   └       ┘          └     ┘   └     ┘
```

### Element-wise multiplication (⊙): multiply matching positions

```
┌ 1 2 ┐   ┌ 5 6 ┐   ┌  5 12 ┐
│ 3 4 │ ⊙ │ 7 8 │ = │ 21 32 │
└     ┘   └     ┘   └       ┘
```

This is NOT the same as matrix multiplication (next section).

---

## 10. Matrix multiplication

**Idea:** to multiply matrix **A** by matrix **B**, each element of the result is the **dot product** of a **row of A** with a **column of B**.

### The shape rule (memorise this!)

```
   A       ×      B       =      C
(m × n)       (n × p)        (m × p)
     └── must match ──┘
```

The **inner** numbers must be equal. The result takes the **outer** numbers.

- (2 × 3) × (3 × 4) → (2 × 4) ✅
- (2 × 3) × (2 × 4) → ❌ error (3 ≠ 2)

**Shape errors are the #1 bug in deep learning code.** You'll see messages like `mat1 and mat2 shapes cannot be multiplied (32x100 and 50x10)`. Now you know what that means: the inner numbers (100 and 50) don't match.

### Worked example

```
      A (2×2)        B (2×2)
   ┌ 1  2 ┐     ┌ 5  6 ┐
   │ 3  4 │  ×  │ 7  8 │
   └      ┘     └      ┘
```

- C₁₁ = row 1 of A · column 1 of B = [1, 2]·[5, 7] = 1×5 + 2×7 = 5 + 14 = **19**
- C₁₂ = row 1 of A · column 2 of B = [1, 2]·[6, 8] = 6 + 16 = **22**
- C₂₁ = row 2 of A · column 1 of B = [3, 4]·[5, 7] = 15 + 28 = **43**
- C₂₂ = row 2 of A · column 2 of B = [3, 4]·[6, 8] = 18 + 32 = **50**

```
   C = ┌ 19  22 ┐
       │ 43  50 ┘
```

```python
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
A @ B          # [[19, 22], [43, 50]]
np.matmul(A, B)   # same
```

### Important properties

- **Order matters:** A × B is usually **not** equal to B × A (unlike normal numbers, where 2×3 = 3×2).
- It is **associative**: (A × B) × C = A × (B × C).

### Matrix × vector

A matrix times a vector = a dot product of each row with the vector → a new vector.

```
┌ 1  2 ┐   ┌ 5 ┐   ┌ 1×5 + 2×6 ┐   ┌ 17 ┐
│ 3  4 │ × │ 6 │ = │ 3×5 + 4×6 │ = │ 39 │
└      ┘   └   ┘   └           ┘   └    ┘
```

**Why this is powerful:** predict prices for ALL houses at once. If **X** is a 1000 × 3 data matrix and **w** is 3 weights, then **X @ w** gives 1000 predictions in one operation. No loop needed.

**Counting the work:** multiplying (m × n) by (n × p) takes about m × n × p multiplications. For big neural networks, that's trillions, which is why we need GPUs (section 16).

---

## 11. Transpose, identity, inverse

### Transpose (Aᵀ): flip rows and columns

```
     ┌ 1  2  3 ┐            ┌ 1  4 ┐
A =  │ 4  5  6 │     Aᵀ =   │ 2  5 │
     └         ┘            │ 3  6 │
       (2×3)                └      ┘
                             (3×2)
```

Row 1 becomes column 1, etc. Shape (m × n) becomes (n × m).

```python
A.T     # transpose in NumPy
```

**Where used:** fixing shapes so multiplication works; the attention formula in transformers uses Q·Kᵀ (file 19).

### Identity matrix (I): the "1" of matrices

1s on the diagonal, 0s everywhere else:

```
I = ┌ 1  0  0 ┐
    │ 0  1  0 │
    │ 0  0  1 ┘
```

A × I = A (just like 5 × 1 = 5).

### Inverse (A⁻¹): the "undo" of a matrix

A × A⁻¹ = I (like 5 × 1/5 = 1). Only some square matrices have an inverse.

**Where used:** linear regression can be solved directly with the **normal equation** w = (XᵀX)⁻¹Xᵀy (file 12). In practice, libraries use more stable methods, but you'll see this formula.

```python
np.linalg.inv(A)
```

### Diagonal and symmetric matrices

- **Diagonal matrix:** non-zero values only on the diagonal.
- **Symmetric matrix:** equal to its own transpose (Aᵢⱼ = Aⱼᵢ). Example: a correlation matrix (file 07) or a distance matrix.

---

## 12. A neural network layer is a matrix multiplication

Let's connect everything. A layer in a neural network (file 15) does:

```
output = activation( W · x + b )
```

- **x** = input vector (say 3 features)
- **W** = weight matrix (say 4 × 3: 4 neurons, each with 3 weights)
- **b** = bias vector (4 numbers, one per neuron)
- **activation** = a simple function like ReLU ([file 04](04-math-numbers-and-functions.md#16-common-function-shapes-youll-meet-in-ai)) applied to each element

**Worked example:**

```
x = [1, 2]          (2 inputs)

W = ┌  1  0 ┐        (3 neurons × 2 inputs)
    │ −1  1 │
    │  2 −1 ┘

b = [0, 0, 1]
```

1. W · x:
   - neuron 1: 1×1 + 0×2 = 1
   - neuron 2: −1×1 + 1×2 = 1
   - neuron 3: 2×1 + (−1)×2 = 0
   → [1, 1, 0]
2. + b → [1, 1, 1]
3. ReLU → [1, 1, 1] (all positive, so unchanged)

**Batches:** in practice we feed many examples at once. If **X** is (batch_size × inputs), we compute **X · Wᵀ + b**, giving (batch_size × neurons). A whole batch is processed in one big matrix multiplication.

**The mind-blowing fact:** GPT-style LLMs (files 19 and 20) are mostly enormous stacks of exactly this operation: matrix multiplications plus simple functions, repeated billions of times.

---

## 13. Tensors

**Idea:** A **tensor** is the general name for a grid of numbers with **any number of dimensions** (also called **axes**).

| Name | Dimensions (rank) | Shape example | Example |
|---|---|---|---|
| Scalar | 0-D | `()` | a temperature: 31.5 |
| Vector | 1-D | `(3,)` | one house: [120, 3, 15] |
| Matrix | 2-D | `(28, 28)` | a grayscale image |
| 3-D tensor | 3-D | `(224, 224, 3)` | a colour image (height, width, RGB) |
| 4-D tensor | 4-D | `(32, 3, 224, 224)` | a **batch** of 32 colour images |
| 3-D tensor | 3-D | `(8, 512, 768)` | a batch of 8 sentences, 512 tokens each, 768 numbers per token (LLMs) |

```
scalar    vector      matrix         3-D tensor
  5      [1 2 3]    ┌1 2 3┐        ┌───────┐┐┐
                    │4 5 6│        │ stack ││││
                    └     ┘        │ of    ││┘
                                   │matrices│┘
                                   └───────┘
```

**Analogy:** a scalar is a single number; a vector is a row of numbers; a matrix is a page of numbers in a table; a 3-D tensor is a book of pages; a 4-D tensor is a shelf of books.

The word "tensor" is why Google named its library **TensorFlow**, and PyTorch's main data type is `torch.Tensor`.

```python
import numpy as np
batch = np.zeros((32, 3, 224, 224))
batch.shape     # (32, 3, 224, 224)
batch.ndim      # 4
batch.size      # 4,816,896 numbers in total
```

**Reshaping:** you can rearrange a tensor's shape without changing its numbers, as long as the total count stays the same. A 28 × 28 image (784 numbers) can be **flattened** to a vector of 784.

```python
img = np.arange(784).reshape(28, 28)
flat = img.reshape(-1)       # shape (784,)   (-1 = "work it out")
```

**Reading shapes is a superpower.** When debugging AI code, print `.shape` everywhere.

---

## 14. Broadcasting

**Idea:** **Broadcasting** is NumPy/PyTorch automatically "stretching" a smaller array to match a bigger one for element-wise operations, without copying data.

```python
X = np.array([[1, 2, 3],
              [4, 5, 6]])     # shape (2, 3)
b = np.array([10, 20, 30])    # shape (3,)

X + b
# [[11, 22, 33],
#  [14, 25, 36]]   ← b was added to each row
```

**Rule (simplified):** compare shapes from the right. Two dimensions are compatible if they're equal or one of them is 1.

- (2, 3) + (3,) ✅ → b is treated as (1, 3) and repeated for each row
- (2, 3) + (2, 1) ✅ → repeated across columns
- (2, 3) + (2,) ❌ → 3 vs 2, not compatible

**Where used:** adding the bias **b** to a whole batch (section 12); subtracting the mean of each column when scaling data (file 10).

---

## 15. Advanced ideas (intuition only)

You don't need to compute these by hand, but you'll meet the names. Here is what each one *means*.

### Linear independence and rank

Vectors are **linearly independent** if none of them can be made by combining the others. [1, 0] and [0, 1] are independent; [1, 2] and [2, 4] are not (the second is 2 × the first, so it adds no new information).

The **rank** of a matrix = how many truly independent rows (or columns) it has: the amount of "real information" in it.

**Where used:** **LoRA** (file 21) fine-tunes LLMs by learning "**low-rank**" updates, i.e. small matrices that hold limited but important information, which saves huge amounts of memory.

**Low-rank trick:** a 1000 × 1000 matrix has 1,000,000 numbers. If its rank is only 8, you can write it as (1000 × 8) × (8 × 1000) = only 16,000 numbers. That's the idea behind LoRA.

### Determinant

A single number computed from a square matrix that says how much the matrix stretches or squashes space. If it's **0**, the matrix squashes space flat and has **no inverse**.

### Eigenvectors and eigenvalues

When a matrix transforms space, most vectors get rotated and stretched. **Eigenvectors** are special directions that only get **stretched** (not rotated). The **eigenvalue** is how much they're stretched.

```
A · v = λ · v        ← v is an eigenvector, λ (lambda) is its eigenvalue
```

**Analogy:** spin a globe. Every point moves, except the points on the axis (north and south poles). The axis is the "eigenvector" of the rotation.

**Where used:** **PCA** (file 14) finds the eigenvectors of the data's covariance matrix. These are the directions in which the data varies the most, and PCA uses them to compress data.

### SVD (Singular Value Decomposition)

Any matrix can be broken into three simpler matrices: **A = U Σ Vᵀ**. Think of it as splitting a transformation into rotate → stretch → rotate. The values in Σ (**singular values**) say how important each direction is. Keeping only the biggest ones gives a compressed, low-rank approximation.

**Where used:** PCA, recommender systems (file 14), data compression, LoRA intuition.

### Projection

**Projecting** vector **a** onto **b** = the "shadow" of a on b's direction. Length of the shadow = (a · b)/‖b‖. Used in PCA (projecting data onto the main directions).

### Jacobian and Hessian (names only)

Matrices of derivatives (file 06). You'll meet the names in optimisation, but you don't need them as an intern.

---

## 16. Why GPUs?

- A **CPU** (Central Processing Unit) has a few (8 to 64) very powerful cores. Great at complicated tasks done one after another.
- A **GPU** (Graphics Processing Unit) has **thousands** of simpler cores. Great at doing the **same simple operation on many numbers at once** (in **parallel**).

**Analogy:** a CPU is 8 professors; a GPU is 10,000 school students. To mark 10,000 simple multiple-choice tests, the students finish far faster.

Matrix multiplication is exactly this kind of work: millions of independent multiply-and-add operations. GPUs were invented for video game graphics (which is also matrix maths), and it turned out they're perfect for deep learning.

- **NVIDIA** makes most AI GPUs (e.g. A100, H100, B200), and its software platform **CUDA** lets programs use them.
- GPUs have their own memory, called **VRAM** (e.g. 24 GB, 80 GB). Your model and data must fit in it (files 15, 27).
- Google makes **TPUs** (Tensor Processing Units), chips designed specifically for tensor maths.
- Special parts of modern NVIDIA GPUs called **Tensor Cores** do matrix multiplication extra fast in low precision (FP16/BF16/FP8, [file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes)).

```python
import numpy as np, time
A = np.random.rand(2000, 2000)
B = np.random.rand(2000, 2000)
t = time.time(); C = A @ B; print(time.time() - t, "seconds on CPU")
# On a GPU with PyTorch (file 15), this is typically 10 to 100× faster.
```

---

## 17. Check yourself

**Q1.** What is [2, 3] + 2 × [1, −1]?
<details><summary>Answer</summary>2 × [1, −1] = [2, −2]. [2, 3] + [2, −2] = **[4, 1]**.</details>

**Q2.** Compute the L2 norm of [6, 8], and the L1 norm of [6, −8].
<details><summary>Answer</summary>L2: √(36 + 64) = √100 = **10**. L1: 6 + 8 = **14**.</details>

**Q3.** Compute [2, 0, 1] · [3, 5, 4].
<details><summary>Answer</summary>6 + 0 + 4 = **10**.</details>

**Q4.** The cosine similarity of two embeddings is 0.95. Another pair has −0.1. What does that tell you?
<details><summary>Answer</summary>The first pair point in almost the same direction (very similar meaning); the second pair are basically unrelated (slightly opposite).</details>

**Q5.** Can you multiply a (4 × 5) matrix by a (5 × 2) matrix? What's the result's shape? What about (4 × 5) × (4 × 5)?
<details><summary>Answer</summary>Yes → (4 × 2). The second fails: inner dimensions 5 and 4 don't match. (You could do (4×5) × (4×5)ᵀ = (4×5) × (5×4) → (4×4).)</details>

**Q6.** Compute:
```
┌ 2 0 ┐   ┌ 1 ┐
│ 1 3 │ × │ 2 │
└     ┘   └   ┘
```
<details><summary>Answer</summary>[2×1 + 0×2, 1×1 + 3×2] = **[2, 7]**.</details>

**Q7.** A batch of 16 RGB images of size 64 × 64, in PyTorch's (batch, channels, height, width) order. What's the tensor shape and how many numbers does it hold?
<details><summary>Answer</summary>(16, 3, 64, 64) → 16 × 3 × 64 × 64 = **196,608** numbers.</details>

**Q8.** Why are GPUs faster than CPUs for deep learning?
<details><summary>Answer</summary>Deep learning is mostly matrix multiplication: huge numbers of independent, simple multiply-add operations. GPUs have thousands of cores that do these in parallel.</details>

**Q9.** A 4096 × 4096 matrix is approximated with rank 16. How many numbers does the low-rank form need vs the full matrix?
<details><summary>Answer</summary>Full: 4096 × 4096 = 16,777,216. Low-rank: (4096 × 16) + (16 × 4096) = 131,072. About **128× smaller**. This is the LoRA idea.</details>

---

## 18. New words in this file

| Word | Meaning |
|---|---|
| Linear algebra | Maths of vectors and matrices |
| Scalar | Single number |
| Vector | Ordered list of numbers |
| Dimension (of a vector) | How many numbers it has |
| Element / component | One number inside a vector/matrix |
| Feature space | Space where each data point is a point given by its features |
| Feature vector | A data point's list of feature values |
| Element-wise / Hadamard product (⊙) | Multiply matching positions |
| Norm (L1, L2) | Size/length of a vector (sum of absolutes / straight-line) |
| Unit vector / normalising | Vector of length 1 / dividing by its length |
| Euclidean / Manhattan distance | Straight-line / grid-walking distance |
| Dot product | Multiply matching elements and add: one number |
| Weighted sum | Dot product of weights and inputs |
| Orthogonal | Perpendicular; dot product = 0 |
| Cosine similarity | Dot product ÷ lengths: direction similarity from −1 to 1 |
| Matrix, shape (m × n) | Grid of numbers, rows × columns |
| Row vector / column vector | 1 × n / n × 1 matrix |
| Matrix multiplication (@) | Row-by-column dot products; inner dims must match |
| Transpose (Aᵀ) | Swap rows and columns |
| Identity matrix (I) | 1s on diagonal; A × I = A |
| Inverse (A⁻¹) | Matrix that undoes A |
| Normal equation | Direct formula for linear regression weights |
| Diagonal / symmetric matrix | Non-zeros only on diagonal / equals its transpose |
| Weight matrix (W), bias vector (b) | A layer's learned numbers |
| Activation | Simple function applied after W·x + b |
| Batch | Group of examples processed together |
| Tensor, rank/ndim, axis | N-dimensional grid of numbers / number of dimensions / one dimension |
| Reshape / flatten | Change shape / turn into 1-D |
| Broadcasting | Auto-stretching smaller arrays to match shapes |
| Linear independence | No vector is a combination of the others |
| Rank (of a matrix), low-rank | Number of independent rows/columns / small rank, compressible |
| Determinant | Number saying how a matrix scales space; 0 → no inverse |
| Eigenvector / eigenvalue | Direction only stretched by a matrix / the stretch amount |
| SVD, singular values | A = UΣVᵀ decomposition / importance of each direction |
| Projection | "Shadow" of one vector on another |
| Jacobian / Hessian | Matrices of derivatives (names only) |
| CPU / GPU / TPU | General processor / massively parallel processor / Google's tensor chip |
| CUDA | NVIDIA's platform for GPU programming |
| VRAM | GPU memory |
| Tensor Cores | GPU units specialised for fast matrix multiplication |
| Parallel | Many operations at the same time |

**Next:** [06-math-calculus.md](06-math-calculus.md)
