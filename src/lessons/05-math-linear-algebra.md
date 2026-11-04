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

**Why it exists:** every bigger container in this file (vectors, matrices, tensors) is built out of single numbers, so we need a name for the smallest building block. Knowing what counts as "one number" also stops a lot of shape mistakes later.

**Idea:** A **scalar** is just a single number: 5, −2.3, 0.001.

Examples: a temperature, a price, a learning rate. Written in normal lowercase italics: *x*, *a*, *λ*.

### Worked example

12 egg rotis at Rs. 40 each: 12 × 40 = **Rs. 480**. The count (12), the price (40) and the total (480) are all scalars. One number each, no list.

### Where you'll meet it in real work

- The **loss** of a model is a single scalar: "how wrong am I overall?" (for example 0.43). Training tries to push this one number down ([file 06](06-math-calculus.md#1-the-big-picture-walking-downhill-in-fog)).
- Settings such as the **learning rate** (0.001) and the LLM **temperature** (0.7) are scalars too.

### Common mistakes

- Treating `5` and `[5]` as the same. In NumPy, `np.array(5).shape` is `()` (a scalar) but `np.array([5]).shape` is `(1,)` (a vector with one element). Many shape errors start here.

> **සිංහලෙන්:** Scalar කියන්නේ තනි අංකයක් විතරයි. කඩේකින් රොටී එකක් Rs. 40ට ගත්තොත්, රොටී 12ක මිල 12 × 40 = Rs. 480 කියලා scalar දෙකක් ගුණ කරලා හොයනවා. AI වලදී model එකේ loss එක, learning rate එක වගේ දේවල් scalar වෙනවා. ඊළඟට එන vectors, matrices වල හැම අංකයක්ම මේ වගේ පොඩි scalar එකකින් හැදුණු එකක් කියලා මතක තියාගන්න.

---

## 2. Vectors

**Why it exists:** a computer cannot work with "a house" or "a customer". A vector turns each thing into a fixed-length list of numbers, so every item can be compared and calculated on in the same way.

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

### Worked example

Describe a cricket player as `[batting average, strike rate, matches]`:

```
player A = [45.2, 88, 120]
player B = [30.0, 95,  60]
```

Each is a 3-dimensional vector. Put 11 players in one table and you get 11 rows × 3 columns (a matrix, section 8).

**Order is fixed.** Position 1 always means the average, position 2 always the strike rate. `[120, 3, 15]` and `[3, 120, 15]` are different vectors, even though they hold the same numbers.

**Analogy:** one line of a Keells bill is a vector: `[price, quantity, discount]`. The whole bill is a matrix; a month of bills is a tensor (section 13).

### Where you'll meet it in real work

On Daraz, each product and each shopper can be turned into a vector. "Show products whose vectors are close to this shopper's vector" is the basic idea of a recommendation system.

### Common mistakes

- Putting features in a different order for different rows. The model reads by position, so mixing the order silently ruins the data.
- Comparing vectors of different lengths (a 3-number vector with a 4-number vector). Operations need the same length.
- Thinking "dimension 768" is impossible because you cannot draw it. You cannot draw it, but all the rules (add, length, distance) work exactly the same as for 2 numbers.

**Exam angle:** an **embedding** is a vector. Texts or images with similar meaning get vectors that are close together, and that is what vector search relies on.

> **සිංහලෙන්:** Vector එකක් කියන්නේ අංක ටිකක් පිළිවෙලට ලියපු list එකක්. ගෙයක් [බිම් ප්‍රමාණය 120, කාමර 3, අවුරුදු 15] කියලා ලිව්වම ඒක 3-dimension vector එකක්. Cricket player කෙනෙක්ව [average 45.2, strike rate 88, matches 120] කියලා ලිව්වත් ඒක vector එකක්. පිළිවෙල වෙනස් කරන්න බෑ, මොකද පළවෙනි තැන හැමවිටම එකම දේ කියන්න ඕනේ. AI එක ගෙවල්, customers, වචන, හැමදේම මෙහෙම vectors බවට හරවලා, ළඟ තියෙන vectors සමාන දේවල් කියලා සලකනවා.

---

## 3. Vector operations

**Why it exists:** to move, mix and scale data points. You will use these operations constantly. Even the gradient descent update in [file 06](06-math-calculus.md#6-gradient-descent-in-one-dimension) is just a vector subtraction plus a scalar multiplication.

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

### Worked example 1: the average of two customers

Two customers described by `[age, monthly visits]`: `[30, 40]` and `[50, 60]`.

```
sum     = [30+50, 40+60] = [80, 100]
average = 0.5 × [80, 100] = [40, 50]
```

Many systems build a sentence's vector by averaging the vectors of its words in exactly this way.

### Worked example 2: a gradient descent step

Weights `w = [2, 5]`, gradient `[1, −3]`, learning rate 0.1:

```
w_new = w − 0.1 × [1, −3]
      = [2, 5] − [0.1, −0.3]
      = [1.9, 5.3]      (5 − (−0.3) = 5.3)
```

### Common mistakes

- Adding vectors of different lengths. `[1, 2] + [3, 4, 5]` is an error.
- Thinking `a * b` in NumPy is a dot product. It is the element-wise product; the dot product comes in section 6.

> **සිංහලෙන්:** Vectors එකතු කරනවා කියන්නේ එකම තැන් වල අංක එකතු කරන එක. [1, 2] + [3, 4] = [4, 6]. Vector එකක් 3න් ගුණ කරනවා කියන්නේ හැම අංකයක්ම 3න් ගුණ කරන එක. Customers දෙන්නෙක්ගේ [30, 40] සහ [50, 60] එකතු කරලා (80, 100) දෙකෙන් බෙදුවම සාමාන්‍යය [40, 50] ලැබෙනවා. Gradient descent එකේ w − 0.1 × grad කියන්නෙත් මේ අඩු කිරීමයි ගුණ කිරීමයි විතරයි. දිග වෙනස් vectors දෙකක් එකතු කරන්න බෑ කියන එක විතරක් මතක තියාගන්න.

---

## 4. Length of a vector (norm)

**Why it exists:** we often need one number that says "how big is this vector?" (or, with a difference, "how far apart are these two?"). The norm gives that number.

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

### Worked example

v = [1, 2, 2]

```
L2: √(1² + 2² + 2²) = √(1 + 4 + 4) = √9 = 3
L1: |1| + |2| + |2| = 5
unit vector: [1, 2, 2] ÷ 3 = [1/3, 2/3, 2/3]
check its length: 1/9 + 4/9 + 4/9 = 9/9 = 1  ✓
```

**Picture (city blocks):** walking 3 blocks east and 4 blocks north is a Manhattan (L1) distance of 3 + 4 = 7 blocks. A bird flying straight covers the L2 distance √(9 + 16) = 5 blocks.

### Where you'll meet it in real work

**Weight decay (L2 regularisation)** adds a penalty to the loss. With weights w = [3, 4] and a penalty strength λ = 0.01, the penalty is λ × ‖w‖² = 0.01 × 25 = **0.25**. Bigger weights, bigger penalty, so the model is nudged to keep weights small.

### Common mistakes

- Forgetting the square root in L2. ‖[3, 4]‖ is 5, not 25.
- Forgetting absolute values in L1. The L1 norm of [3, −4] is 7, not −1.
- Mixing up ‖v‖ and ‖v‖². The squared version is just the sum of squares, with no square root.

**Exam angle:** L1 regularisation tends to push some weights to exactly 0 (sparse model); L2 regularisation shrinks all weights smoothly but rarely to exactly 0.

> **සිංහලෙන්:** Norm එක කියන්නේ vector එකක දිග. [3, 4] ගත්තොත් 3 දකුණට, 4 උඩට ගියාම කෙලින්ම ගිහින් ලැබෙන දුර √(9 + 16) = 5. ඒක L2 norm එක. L1 norm එක කියන්නේ පාරේ කොටු ගණන් කරලා ඇවිදගෙන යන විදිහ: 3 + 4 = 7. Model එකේ weights ලොකු වෙන්න නොදී තියාගන්න regularisation වලදී මේ norms පාවිච්චි කරනවා. Vector එක ඒකේ දිගෙන් බෙදුවම දිග 1ක් තියෙන unit vector එකක් ලැබෙනවා, [3, 4] ÷ 5 = [0.6, 0.8].

---

## 5. Distance between vectors

**Why it exists:** "these two customers are similar" is just a feeling until you have a number for it. Distance turns "similar" into "close".

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

### Worked example: the scale problem, with numbers

Two customers `[age, monthly income in Rs.]`: A = [34, 50000], B = [60, 50500].

**Raw distance:**

```
difference = [34−60, 50000−50500] = [−26, −500]
distance   = √(26² + 500²) = √(676 + 250000) = √250676 ≈ 500.7
```

The 26-year age gap hardly counts, because income is measured in big numbers.

**After scaling** (age ÷ 100, income ÷ 100000): A = [0.34, 0.5], B = [0.60, 0.505]

```
difference = [−0.26, −0.005]
distance   = √(0.0676 + 0.000025) = √0.067625 ≈ 0.26
```

Now age matters a lot, which is much fairer.

### Where you'll meet it in real work

A telecom could group customers into segments with k-Means. Every step of k-Means is "which centre is this customer closest to?", a distance calculation. Without scaling, the biggest-number column would decide everything.

### Common mistakes

- Using distances on unscaled features (the example above).
- Forgetting that a smaller distance means *more* similar, while a bigger cosine similarity means *more* similar. They run in opposite directions.

> **සිංහලෙන්:** Distance කියන්නේ points දෙකක් කොච්චර ඈතද කියන එක. [1, 2] සහ [4, 6] අතර වෙනස [−3, −4], ඒ නිසා දුර √(9 + 16) = 5. හැබැයි features වල ප්‍රමාණ වෙනස් නම් පරිස්සම් වෙන්න ඕනේ. වයස 34 සහ 60 අතර අවුරුදු 26ක වෙනසක් තිබුණත්, වැටුප Rs. 50,000 සහ Rs. 50,500 වගේ රුපියල් 500ක වෙනසක් ආවොත් දුර ගණනය කරද්දී වැටුපම ජයගන්නවා, වයස ගණන් ගන්නේ නෑ. ඒ නිසා distance පාවිච්චි කරන්න කලින් features ඔක්කොම එකම පරිමාණයකට (scale) ගේනවා.

---

## 6. The dot product

**Why it exists:** a model has to combine many inputs, each with its own importance, into one answer. The dot product does exactly that, and it also tells us how much two vectors "agree".

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

### Worked example 1: a Cargills bill

Quantities `[2 loaves, 3 milk packets]`, prices `[Rs. 150, Rs. 120]`:

```
[2, 3] · [150, 120] = 2×150 + 3×120 = 300 + 360 = Rs. 660
```

### Worked example 2: a weighted exam mark

Weights `[0.3, 0.2, 0.5]` for assignments, quizzes and the final exam. Your marks are `[80, 60, 70]`:

```
0.3×80 + 0.2×60 + 0.5×70 = 24 + 12 + 35 = 71
```

A neuron in a neural network does exactly this, plus a bias.

### Where you'll meet it in real work

In a transformer's **attention**, every word's *query* vector takes a dot product with every other word's *key* vector. A big dot product means "pay a lot of attention to that word".

### Common mistakes

- Expecting a vector back. The dot product of two vectors is **one number**.
- Mixing it up with the element-wise product `*`. `[1,2,3] * [4,5,6]` gives `[4,10,18]`; the dot product gives `32`.
- Dot-product inputs must have the same length.
- Reading a big dot product as "very similar" without checking the lengths. Long vectors give big values (that is why section 7 exists).

**Exam angle:** attention in transformers is **softmax(QKᵀ / √d_k) V**. The QKᵀ part is a grid of dot products between queries and keys, and the √d_k scales them down so they do not get too large.

> **සිංහලෙන්:** Dot product එක කියන්නේ ගැළපෙන අංක ගුණ කරලා ඔක්කොම එකතු කරන එක. Cargills එකේදී පාන් 2ක් (එකක් Rs. 150) සහ කිරි පැකට් 3ක් (එකක් Rs. 120) ගත්තොත් bill එක [2, 3] · [150, 120] = 300 + 360 = Rs. 660. විභාගයේ ලකුණු වලට 30%, 20%, 50% බර දීලා අන්තිම ලකුණ හොයන්නෙත් dot product එකක්. එකම දිශාවට ඇති vectors වලට ලොකු ධන අගයක්, 90° කෝණයකින් ඇති ඒවාට 0ක්, විරුද්ධ දිශාවට ඇති ඒවාට සෘණ අගයක් ලැබෙනවා. Neural network එකේ neuron එකකුත්, transformer එකේ attention එකත් වැඩ කරන්නේ මේකෙන්.

---

## 7. Cosine similarity

**Why it exists:** a short note and a long article about the same topic should count as "similar". The raw dot product would favour the longer one, so we divide the length away and compare only the direction.

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

### Worked example: which document matches the query?

Count two words, `[cricket, rice]`, in each text:

```
query     Q = [2, 0]   (the user typed "cricket cricket")
document  A = [4, 1]   (mostly about cricket)
document  B = [1, 5]   (mostly about rice)

cos(Q, A) = (2×4 + 0×1) / (‖Q‖ × ‖A‖) = 8 / (2 × √17) = 8 / (2 × 4.123) = 8 / 8.246 ≈ 0.970
cos(Q, B) = (2×1 + 0×5) / (‖Q‖ × ‖B‖) = 2 / (2 × √26) = 2 / (2 × 5.099) = 2 / 10.198 ≈ 0.196
```

Document A wins by a mile. Also check the "same direction, different length" case: `[3, 4]` and `[6, 8]` give dot = 18 + 32 = 50, and cos = 50 / (5 × 10) = **1**.

### Where you'll meet it in real work

A company help chatbot (RAG, file 23) turns the customer's question and every help article into embeddings. It then returns the articles with the highest cosine similarity to the question.

### Common mistakes

- Dividing by zero when a vector is all zeros (its length is 0).
- Forgetting that cosine ignores length. `[1, 2]` and `[100, 200]` score exactly 1, which is sometimes not what you want.
- Mixing up **cosine similarity** (bigger = closer) with **cosine distance** = 1 − cosine similarity (smaller = closer).

**Exam angle:** vector databases and RAG retrieval rank documents by cosine similarity (or dot product). If the vectors are normalised to length 1, cosine similarity and dot product give the same ranking.

> **සිංහලෙන්:** Dot product එක vectors වල දිග වැඩි වෙද්දී ලොකු වෙනවා, ඒ නිසා දිගත් එක්ක ඇහිලා වැරදි වෙන්න පුළුවන්. Cosine similarity එකෙන් දෙකේ දිගෙන්ම බෙදන නිසා දිශාව විතරක් ගණන් ගන්නවා. [3, 4] සහ [6, 8] දෙකේ දිශාව එකමයි, ඒ නිසා cosine = 50 ÷ (5 × 10) = 1. 1 කියන්නේ හරියටම සමානයි, 0 කියන්නේ සම්බන්ධයක් නෑ, −1 කියන්නේ විරුද්ධයි. පොඩි note එකකුයි දිග ලිපියකුයි දෙකම cricket ගැන නම් cosine similarity එක ඉහළයි. RAG එකේ ප්‍රශ්නයට ළඟම document එක හොයන්නේ මේකෙන්.

---

## 8. Matrices

**Why it exists:** a dataset has thousands of vectors. A matrix packs them into one object, so one operation can work on all of them at once.

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

### Worked example: a marks table

```
              Maths  Science  English
Nimal    ┌     72      65       80  ┐
Kamala   │     90      88       76  │     ← a 3 × 3 matrix
Sunil    └     55      60       70  ┘
```

- Shape: **3 × 3** (3 students, 3 subjects).
- A row is one student's vector: `[90, 88, 76]` is Kamala.
- A column is one subject for everyone: `[72, 90, 55]` is Maths.
- Element A₂₃ (row 2, column 3) = 76, Kamala's English mark.
- A 28 × 28 grayscale image has 28 × 28 = **784** numbers.

### Where you'll meet it in real work

In scikit-learn, the training data `X` is always a matrix with shape `(number of examples, number of features)`. If a bank has 20,000 loan applications with 12 features each, `X.shape` is `(20000, 12)`.

### Common mistakes

- Writing the shape as (columns × rows). It is always **rows first**.
- Mixing up Python's counting from 0 with the maths convention of counting from 1: `A[0, 1]` is the first row, second column.
- A plain NumPy vector of shape `(3,)` is neither a row vector `(1, 3)` nor a column vector `(3, 1)`. This causes surprises in matrix multiplication and broadcasting.

> **සිංහලෙන්:** Matrix එකක් කියන්නේ rows සහ columns තියෙන අංක table එකක්, Excel sheet එකක් වගේ. ළමයි 3දෙනෙක්ගේ විෂය 3ක ලකුණු තිබුණොත් ඒක 3 × 3 matrix එකක්: පේළියක් එක ළමයෙක්, තීරුවක් එක විෂයක්. Shape එක ලියද්දී හැමවිටම rows මුලින්: 2 × 3 කියන්නේ rows 2යි, columns 3යි. Dataset එකක් එක matrix එකක්, 28 × 28 පින්තූරයක් matrix එකක් (අංක 784ක්). Python වල ගණන් කරන්නේ 0න් පටන් අරන් නිසා A[0, 1] කියන්නේ පළවෙනි පේළියේ දෙවෙනි අංකය.

---

## 9. Matrix operations

**Why it exists:** often you want to change a whole table in one go, for example converting every mark from "out of 50" to "out of 100", or adding a bonus to every mark.

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

### Worked example

Marks out of 50 for two students in two subjects, then a bonus matrix:

```
┌ 30 40 ┐       ┌  60  80 ┐              ┌  60  80 ┐   ┌ 5 0 ┐   ┌ 65  80 ┐
└ 45 25 ┘ × 2 = └  90  50 ┘   and then   └  90  50 ┘ + └ 0 5 ┘ = └ 90  55 ┘
```

**Same pair, two different answers.** Take A = [[1,2],[3,4]] and B = [[5,6],[7,8]]:

```
A ⊙ B (element-wise)    = [[5, 12], [21, 32]]
A @ B (matrix multiply) = [[19, 22], [43, 50]]
```

### Where you'll meet it in real work

An activation function such as ReLU is applied to every element of a layer's output matrix. During training, **dropout** switches off random neurons by multiplying the layer's output element by element with a random 0/1 mask.

### Common mistakes

- Using `*` when you meant `@`. Both run without error when the shapes match, so the bug can stay hidden.
- Adding matrices of different shapes (apart from the broadcasting cases in section 14).

> **සිංහලෙන්:** Matrix දෙකක් එකතු කරනවා කියන්නේ එකම තැන් වල අංක එකතු කරන එක, ඒ නිසා shape දෙකම සමාන වෙන්න ඕනේ. ලකුණු 50න් තියෙන matrix එකක් 2න් ගුණ කළොත් ඔක්කොම 100න් වෙනවා: [[30, 40], [45, 25]] × 2 = [[60, 80], [90, 50]]. Element-wise ගුණ කිරීම (⊙) සහ matrix multiplication දෙක වෙනස්. [[1,2],[3,4]] ⊙ [[5,6],[7,8]] = [[5,12],[21,32]], ඒත් matrix multiplication එකෙන් [[19,22],[43,50]] ලැබෙනවා. Activation functions සහ dropout වලදී පාවිච්චි වෙන්නේ element-wise වැඩ.

---

## 10. Matrix multiplication

**Why it exists:** a neural network needs to compute thousands of weighted sums (dot products) at the same time. Matrix multiplication is the compact way to say "do all of these dot products at once".

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

### Worked example 1: two families, one price list

Quantities of `[bread, milk]` bought by two families, and the prices `[Rs. 150, Rs. 120]`:

```
┌ 2 3 ┐   ┌ 150 ┐   ┌ 2×150 + 3×120 ┐   ┌ 660 ┐
└ 1 4 ┘ × └ 120 ┘ = └ 1×150 + 4×120 ┘ = └ 630 ┘
```

Family 1 pays Rs. 660 and family 2 pays Rs. 630, from a single multiplication.

### Worked example 2: a (2×3) times (3×2)

```
A = ┌ 1 2 3 ┐    B = ┌ 1 0 ┐
    └ 4 5 6 ┘        │ 0 1 │
                     └ 1 1 ┘

C₁₁ = [1,2,3]·[1,0,1] = 1 + 0 + 3 = 4
C₁₂ = [1,2,3]·[0,1,1] = 0 + 2 + 3 = 5
C₂₁ = [4,5,6]·[1,0,1] = 4 + 0 + 6 = 10
C₂₂ = [4,5,6]·[0,1,1] = 0 + 5 + 6 = 11

C = ┌  4  5 ┐   (shape 2×2: outer numbers of 2×3 and 3×2)
    └ 10 11 ┘
```

### Order matters

Using A = [[1,2],[3,4]] and B = [[5,6],[7,8]] from above: A × B = [[19, 22], [43, 50]], but B × A = [[5×1+6×3, 5×2+6×4], [7×1+8×3, 7×2+8×4]] = **[[23, 34], [31, 46]]**. Different!

### Where you'll meet it in real work

In a transformer, the attention scores for a sentence of n tokens are Q × Kᵀ. With Q of shape (n × d) and Kᵀ of shape (d × n), the result is an (n × n) grid with one score for every pair of tokens.

### Common mistakes

- Using `*` (element-wise) instead of `@` (matrix multiplication).
- Only checking the outer dimensions. The **inner** ones must match; (32×100) @ (100×10) is fine and gives (32×10), costing about 32 × 100 × 10 = 32,000 multiplications.
- Assuming A × B = B × A.

**Exam angle:** exams like to ask "what is the output shape of (m×n) times (n×p)?". Answer (m×p). Remember that the linear layers and the attention in a transformer are matrix multiplications.

> **සිංහලෙන්:** Matrix multiplication එකේදී පළවෙනි matrix එකේ row එකක් දෙවෙනි matrix එකේ column එකක් එක්ක dot product කරනවා. පවුල් දෙකක් පාන් සහ කිරි ගත්තා නම්, quantities [[2,3],[1,4]] ට prices [150,120] ගුණ කළාම bills දෙකම එකවර [660, 630] ලැබෙනවා. නීතිය: (m × n) × (n × p) = (m × p), මැද අංක දෙක සමාන වෙන්නම ඕනේ. (32 × 100) × (50 × 10) වගේ එකක් ගැහුවොත් 100 ≠ 50 නිසා error එකක් එනවා, deep learning code වල වැඩිපුරම එන bug එක මේකයි. අනික A × B සහ B × A සාමාන්‍යයෙන් එකම නෑ.

---

## 11. Transpose, identity, inverse

**Why it exists:** the transpose fixes shapes that do not line up for multiplication. The identity and the inverse give matrices their versions of "1" and "undo".

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

### Worked example 1: a transpose

```
A (3×2) = ┌ 1 2 ┐          Aᵀ (2×3) = ┌ 1 3 5 ┐
          │ 3 4 │                      └ 2 4 6 ┘
          └ 5 6 ┘
```

Useful rule: (A × B)ᵀ = Bᵀ × Aᵀ (the order flips).

### Worked example 2: inverting a 2×2 matrix

For a 2×2 matrix `[[a, b], [c, d]]`, the inverse is `1/(ad − bc) × [[d, −b], [−c, a]]`.

```
M = ┌ 4 7 ┐     determinant = 4×6 − 7×2 = 24 − 14 = 10
    └ 2 6 ┘

M⁻¹ = 1/10 × ┌  6 −7 ┐ = ┌  0.6 −0.7 ┐
             └ −2  4 ┘   └ −0.2  0.4 ┘

Check row 1 · column 1 of M × M⁻¹: 4×0.6 + 7×(−0.2) = 2.4 − 1.4 = 1 ✓
Check row 1 · column 2:            4×(−0.7) + 7×0.4 = −2.8 + 2.8 = 0 ✓
```

If the determinant is 0 you would be dividing by zero. That matrix has no inverse.

### Where you'll meet it in real work

In attention, Q has shape (4 × 64) for a 4-token sentence. K also has shape (4 × 64), so Kᵀ is (64 × 4) and Q × Kᵀ is (4 × 4).

### Common mistakes

- Assuming every matrix has an inverse (only square matrices with a non-zero determinant do).
- Thinking a transpose is the same as a reshape. A transpose swaps rows and columns; a reshape keeps the reading order and only changes the grid.

> **සිංහලෙන්:** Transpose කියන්නේ rows සහ columns මාරු කරන එක: 2 × 3 matrix එකක් 3 × 2 වෙනවා. Matrix multiplication වලට shape ගැලපෙන්නේ නැති වෙලාවට Aᵀ පාවිච්චි කරනවා. Identity matrix එක (I) කියන්නේ matrices වල '1' එක, A × I = A. Inverse එක කියන්නේ 'undo' කරන matrix එක, 5න් ගුණ කරපු දෙයක් 1/5න් ආපහු හදනවා වගේ. හැබැයි හැම matrix එකකටම inverse එකක් නෑ, determinant එක 0 නම් inverse නෑ. [[4,7],[2,6]] ට determinant = 24 − 14 = 10 නිසා inverse එකක් තියෙනවා.

---

## 12. A neural network layer is a matrix multiplication

**Why it exists:** this section answers the question "what actually happens inside a neural network layer?" The answer is surprisingly small: one matrix multiplication, one addition and one simple function.

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

### Another worked example: the activation clips a negative

```
x = [2, 1]
W = ┌ 1  −1 ┐       b = [−3, 0]
    └ 0.5  2 ┘

1. W · x:  neuron 1: 1×2 + (−1)×1 = 1
           neuron 2: 0.5×2 + 2×1  = 3          → [1, 3]
2. + b:    [1−3, 3+0]                          → [−2, 3]
3. ReLU:   max(0, −2) = 0, max(0, 3) = 3       → [0, 3]
```

### Counting parameters

A layer with 784 inputs (a 28×28 image, flattened) and 128 neurons has:

```
weights: 128 × 784 = 100,352
biases:  128
total:   100,352 + 128 = 100,480 parameters
```

For the batch version, X (32 × 784) times Wᵀ (784 × 128) gives (32 × 128): 32 images, 128 outputs each.

### Where you'll meet it in real work

In PyTorch this layer is `nn.Linear(784, 128)`, and its weight matrix is stored with shape (128, 784), that is (out_features, in_features). When people say "a 7B-parameter model", they mean mostly the numbers inside many such matrices.

### Common mistakes

- Forgetting the bias vector.
- Mixing up the layout of W: some books write (inputs × neurons) and others (neurons × inputs). Always check the shape.
- Skipping the activation. Without it, two layers collapse into one: W₂(W₁x) = (W₂W₁)x. The stacked network could learn no more than a single layer.

**Exam angle:** know that a layer computes activation(Wx + b), be able to count its parameters (weights + biases), and know why non-linear activations are needed.

> **සිංහලෙන්:** Neural network එකේ layer එකක් කරන්නේ output = activation(W · x + b) කියන එක විතරයි. x කියන්නේ input අංක, W කියන්නේ weights වල matrix එක, b කියන්නේ bias. 784 inputs ඇති පින්තූරයකට neurons 128ක layer එකක් දුන්නොත් weights 128 × 784 = 100,352යි, biases 128යි, ඔක්කොම parameters 100,480යි. Activation (ReLU වගේ) නැත්නම් layers කීයක් තිබුණත් ඒක එක matrix එකක් වගේම තමයි. ChatGPT වගේ LLMs වල වැඩි කොටස මේකම මිලියන ගණන් වතාවක් කරන එකයි.

---

## 13. Tensors

**Why it exists:** real data often has more than two axes. A colour photo has height, width and colour channels; a batch of photos adds one more axis. Tensors give one name and one set of rules for all of them.

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

### Worked example: how many numbers?

```
one colour image  (224, 224, 3):   224 × 224 × 3        = 150,528 numbers
a batch of 32     (32, 3, 224, 224): 150,528 × 32       = 4,816,896 numbers
as 32-bit floats (4 bytes each):   4,816,896 × 4        = 19,267,584 bytes ≈ 19.3 MB
```

**Cricket example:** 11 players × 3 stats × 5 seasons is a tensor of shape (5, 11, 3) holding 165 numbers.

### Where you'll meet it in real work

A hospital might feed a batch of chest X-rays to a model as a 4-D tensor `(batch, channels, height, width)`. A language model reads a 3-D tensor `(batch, tokens, hidden size)`. When something crashes, the error is almost always a shape mismatch, so printing `.shape` is the first debugging step.

### Common mistakes

- Mixing up channel order. PyTorch normally expects **channels first** (N, C, H, W), while TensorFlow/Keras images are normally **channels last** (N, H, W, C).
- Confusing a tensor's "rank" (its number of axes) with a matrix's "rank" (number of independent rows, section 15). Same word, different meaning.

**Exam angle:** transformer tensors are usually described as (batch size, sequence length, hidden/embedding size). Be ready to say what each axis means.

> **සිංහලෙන්:** Tensor එකක් කියන්නේ axes ඕනෑම ගණනක් තියෙන අංක grid එකක්. Scalar එක 0-D, vector එක 1-D, matrix එක 2-D. Colour පින්තූරයක් 224 × 224 × 3, ඒ කියන්නේ අංක 150,528ක්. පින්තූර 32ක batch එකක් (32, 3, 224, 224) කියන 4-D tensor එකක්. Code එකේ අවුලක් ආවොත් හැම තැනම .shape print කරලා බලන්න, ඒක ලොකු උදව්වක්. PyTorch එකේ channels මුලින් (N, C, H, W) එන්නේ, TensorFlow එකේ සාමාන්‍යයෙන් channels අන්තිමට (N, H, W, C).

---

## 14. Broadcasting

**Why it exists:** you often want to combine a big array with a small one (add one bias to every row). Writing a loop is slow, and making copies wastes memory. Broadcasting does it automatically.

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

### Worked example: subtract each column's mean

```
X = ┌  60  70 ┐        column means = [(60+80+100)/3, (70+90+50)/3] = [80, 70]
    │  80  90 │
    └ 100  50 ┘        shapes: X is (3, 2), means is (2,)  → compatible ✓

X − means = ┌ 60−80   70−70 ┐   ┌ −20   0 ┐
            │ 80−80   90−70 │ = │   0  20 │
            └ 100−80  50−70 ┘   └  20 −20 ┘
```

**Shape comparison from the right:**

```
(3, 2)  vs  (2,)  →  2 = 2 ✓ ,  3 vs (nothing) ✓   → OK
(2, 3)  vs  (2,)  →  3 vs 2 ✗                      → error
```

### Common mistakes

- A silent wrong answer: `(3,1) + (3,)` does not fail. It broadcasts into a **(3, 3)** grid. If you expected 3 numbers, this bug is easy to miss.
- Assuming it only works with a vector. Any shapes that satisfy the rule are fine.

> **සිංහලෙන්:** Broadcasting කියන්නේ පොඩි array එකක් ලොකු එකකට ගැළපෙන්න NumPy තනියම දිග හරින එක. ළමයි 3දෙනෙක්ගේ ලකුණු matrix එකෙන් හැම තීරුවකම average [80, 70] අඩු කරද්දී, (3, 2) − (2,) නිසා මේ average එක පේළි 3ටම පාවිච්චි වෙනවා: [[−20,0],[0,20],[20,−20]]. නීතිය: shapes දකුණෙන් පටන් අරන් බලන්න, සමානයි නැත්නම් එකක් 1 වෙන්න ඕනේ. (2, 3) + (2,) වැඩ නෑ මොකද 3 සහ 2 නොගැළපෙන නිසා. Layer එකක bias එක batch එකටම එකතු කරන්නේ මේ විදිහටයි.

---

## 15. Advanced ideas (intuition only)

**Why it exists:** these ideas explain how AI compresses and simplifies big matrices (PCA, recommender systems, LoRA). You only need the intuition.

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

### Worked example: rank and determinant together

```
M = ┌ 1 2 ┐
    └ 2 4 ┘

row 2 = 2 × row 1   → only one independent row → rank 1
determinant = 1×4 − 2×2 = 0 → no inverse
```

**Eigen example:** the matrix `[[2, 0], [0, 3]]` stretches the x direction by 2 and the y direction by 3. Its determinant is 2 × 3 = 6 (areas grow 6 times). The direction [1, 0] only gets stretched (to [2, 0]), so it is an eigenvector with eigenvalue 2.

**LoRA saving in numbers:** a 4096 × 4096 weight matrix has 16,777,216 numbers. A rank-8 update uses (4096 × 8) + (8 × 4096) = **65,536** numbers, about 0.39% of the full matrix.

### Common mistakes

- Thinking you must compute eigenvectors or SVD by hand. Libraries do it; you just need to know what each name means.
- Thinking rank means "number of columns". It is the number of *independent* ones.

**Exam angle:** **LoRA** (Low-Rank Adaptation) freezes the original model weights and trains small low-rank matrices instead, which cuts the memory and the number of trainable parameters hugely. PCA is the classic example of dimensionality reduction.

> **සිංහලෙන්:** මේවා ගණන් කරන්න ඔයාට අතින් ඕනේ නෑ, නම් විතරක් අඳුරගන්න. Rank කියන්නේ matrix එකක ඇත්තටම ස්වාධීන rows කීයද කියන එක. [[1,2],[2,4]] එකේ දෙවෙනි row එක පළවෙනි එකේ දෙගුණයි, ඒ නිසා rank 1යි, determinant 1×4 − 2×2 = 0, inverse නෑ. LoRA කියන්නේ මේ low-rank අදහසයි: 4096 × 4096 matrix එකක අංක මිලියන 16.7ක් තිබුණාට rank 8 නම් අංක 65,536ක් විතරක් train කරලා memory ගොඩක් ඉතුරු කරනවා. Eigenvectors සහ SVD වලින් PCA වගේ compression වැඩ කරනවා.

---

## 16. Why GPUs?

**Why it exists:** training a modern model needs billions of multiplications, again and again. On an ordinary CPU that takes far too long, so we use hardware that does many of them at the same time.

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

### Worked example: how much work is one multiplication?

Multiplying two 2000 × 2000 matrices needs about 2000 × 2000 × 2000 = **8 × 10⁹** multiplications and about as many additions, roughly 1.6 × 10¹⁰ operations. If a GPU could sustain 10 trillion (10¹³) operations per second (an illustrative round number; real chips differ), that takes about 1.6 × 10¹⁰ ÷ 10¹³ = **0.0016 s**, under two milliseconds.

**Memory example:** a model with 7 billion parameters stored as 16-bit numbers (2 bytes each) needs 7 × 10⁹ × 2 = **14 GB** just for its weights, before any data or training state.

### Where you'll meet it in real work

The most common GPU error you will see is **"CUDA out of memory"**. It means the model, the batch and the intermediate results do not fit in VRAM. The usual fixes are a smaller batch size, a lower precision (FP16/BF16), or a smaller model.

### Common mistakes

- Thinking a GPU is faster for everything. It wins on big parallel maths. Small jobs, or work where each step depends on the previous one, may run just as well (or better) on a CPU.
- Forgetting that data has to be copied between CPU memory and GPU memory, which also costs time.

**Exam angle:** know that GPUs suit deep learning because it is dominated by parallel matrix operations, that CUDA is NVIDIA's platform for programming GPUs, that Tensor Cores speed up low-precision matrix multiplication, and that VRAM limits how large a model you can run.

> **සිංහලෙන්:** GPU එකක් කියන්නේ සරල වැඩ එකපාර ගොඩක් කරන්න පුළුවන් cores ගොඩක් තියෙන processor එකක්. CPU එක මහාචාර්යවරු 8දෙනෙක් වගේ, GPU එක ළමයි 10,000ක් වගේ; බහුවරණ ප්‍රශ්න පත්තර 10,000ක් පරීක්ෂා කරන්න ළමයින්ට ඉක්මනින් පුළුවන්. Matrix multiplication කියන්නේ එකිනෙකට ස්වාධීන ගුණ කිරීම් මිලියන ගණනක් නිසා GPU වලට ඒක හරියටම ගැළපෙනවා. Parameters බිලියන 7ක model එකක් 16-bit වලින් තිබ්බොත් weights වලටම GB 14ක් VRAM ඕනේ. 'CUDA out of memory' error එක එන්නේ model එක GPU memory එකට ඇතුල් නොවෙන විටයි.

```quiz
[{"q": "What is [4, 3] · [2, 5]?", "options": ["[8, 15]", "7", "23", "14"], "answer": 2, "why": "Multiply matching elements and add: 4×2 + 3×5 = 8 + 15 = 23. [8, 15] is the element-wise product; the dot product adds those up into one number."}, {"q": "What is the L2 norm of [5, 12]?", "options": ["17", "7", "169", "13"], "answer": 3, "why": "√(25 + 144) = √169 = 13. 17 is the L1 norm (5 + 12), and 169 forgets the square root."}, {"q": "Two vectors have cosine similarity 0. What does that mean?", "options": ["They are perpendicular (unrelated)", "They are identical", "They point in opposite directions", "They have the same length"], "answer": 0, "why": "Cosine 1 means the same direction, 0 means perpendicular (dot product 0), −1 means opposite. Cosine says nothing about length, so 'same length' is wrong."}, {"q": "You multiply a (16 × 784) matrix by a (784 × 10) matrix. What is the result's shape?", "options": ["(784, 784)", "Error, the shapes do not match", "(10, 16)", "(16, 10)"], "answer": 3, "why": "The inner numbers (784 and 784) match, and the result takes the outer numbers: (16 × 10). (10, 16) swaps the order; the result keeps the first matrix's rows first."}, {"q": "Why is cosine similarity preferred over the raw dot product when comparing a short note with a long article on the same topic?", "options": ["Cosine ignores vector length, so only direction (topic) counts", "Cosine is always much faster", "The dot product cannot be calculated for long vectors", "Cosine measures distance in kilometres"], "answer": 0, "why": "The dot product grows with length, so a long vector looks 'more similar' just for being long. Dividing by both lengths leaves only the angle. The dot product can be computed for any equal-length vectors, so option 3 is wrong."}, {"q": "A layer maps 100 inputs to 20 neurons, with a bias for each neuron. How many parameters does it have?", "options": ["2,000", "2,020", "120", "2,120"], "answer": 1, "why": "Weights: 20 × 100 = 2,000, plus 20 biases = 2,020. 2,000 forgets the biases."}, {"q": "Which addition fails because of incompatible shapes?", "options": ["(4, 3) + (3,)", "(4, 3) + (4, 1)", "(4, 3) + (1, 3)", "(4, 3) + (4,)"], "answer": 3, "why": "Compare shapes from the right: 3 vs 4 are neither equal nor 1, so (4,3) + (4,) fails. (4,3) + (3,) works because the trailing 3 matches."}, {"q": "Why do GPUs speed up deep learning so much?", "options": ["One GPU core is much faster than a CPU core", "They store the dataset on a faster disk", "They remove the need for matrix multiplication", "They run thousands of simple multiply-add operations in parallel"], "answer": 3, "why": "Deep learning is mostly huge matrix multiplications made of independent multiply-adds, which suit thousands of GPU cores working at once. A single GPU core is actually slower than a CPU core, so the first option is the tempting wrong one."}]
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

**Q10.** Compute [[1, 2], [0, 1]] × [3, 1].
<details><summary>Answer</summary>Row 1: 1×3 + 2×1 = 5. Row 2: 0×3 + 1×1 = 1. Result: **[5, 1]**.</details>

**Q11.** Why can't you build a "deeper" network just by stacking linear layers (W₂(W₁x)) with no activation function?
<details><summary>Answer</summary>W₂(W₁x) = (W₂W₁)x, and W₂W₁ is just another single matrix. So without a non-linear activation, any number of stacked layers is no more powerful than one layer.</details>

**Q12.** A bank has 20,000 loan applications, each with 12 features. What is the shape of the data matrix X, and what shape would X @ w need w to have to give one prediction per application?
<details><summary>Answer</summary>X is **(20000, 12)** (examples first, then features). w must have 12 weights, shape **(12,)**, and then X @ w has shape (20000,): one prediction for each application.</details>

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
| Weight decay | Penalty on the size (norm) of the weights, added to the loss |
| Parameter | One learned number (a weight or a bias) |
| Cosine distance | 1 − cosine similarity; smaller means more similar |
| Channels | The colour layers of an image (red, green, blue) |
| Low-rank update (LoRA) | Training small low-rank matrices instead of the full weight matrix |
| CUDA out of memory | Error when the model and data do not fit in GPU memory (VRAM) |

**Next:** [06-math-calculus.md](06-math-calculus.md)
