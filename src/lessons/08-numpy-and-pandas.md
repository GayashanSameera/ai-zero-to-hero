# 08: NumPy and Pandas: Working with Data in Python

> **Before you start:** [02](02-python-programming.md) (lists, dicts, functions, lambda, pip), [03](03-developer-tools.md#7-sql-filtering-sorting-aggregating) (SQL GROUP BY and JOIN ideas), [05](05-math-linear-algebra.md) (vectors, matrices, shapes, broadcasting), [07](07-math-probability-statistics.md) (mean, median, std, percentiles, correlation).
>
> **After this file you can:** create and manipulate NumPy arrays; load, inspect, filter, sort, group, join and reshape tables with Pandas; handle missing values; and know when to use Polars.

---

## Table of contents

**NumPy**
1. [Why NumPy?](#1-why-numpy)
2. [Creating arrays](#2-creating-arrays)
3. [Array attributes: shape, dtype](#3-array-attributes)
4. [Indexing, slicing, boolean masks](#4-indexing-slicing-boolean-masks)
5. [Vectorised maths and broadcasting](#5-vectorised-maths-and-broadcasting)
6. [Aggregations and the axis argument](#6-aggregations-and-the-axis-argument)
7. [Reshaping and combining](#7-reshaping-and-combining)
8. [Random numbers](#8-random-numbers)

**Pandas**
9. [Series and DataFrame](#9-series-and-dataframe)
10. [Loading and saving data](#10-loading-and-saving-data)
11. [First look at a dataset](#11-first-look-at-a-dataset)
12. [Selecting columns and rows (loc, iloc)](#12-selecting-columns-and-rows)
13. [Filtering rows](#13-filtering-rows)
14. [Creating and changing columns](#14-creating-and-changing-columns)
15. [Sorting, counting, unique values](#15-sorting-counting-unique-values)
16. [Missing values](#16-missing-values)
17. [Grouping and aggregating (groupby)](#17-grouping-and-aggregating)
18. [Joining tables (merge, concat)](#18-joining-tables)
19. [Reshaping: pivot tables and melt](#19-reshaping-pivot-and-melt)
20. [Text and date columns](#20-text-and-date-columns)
21. [Apply, map, and performance tips](#21-apply-map-and-performance)
22. [Polars and other tools for big data](#22-polars-and-big-data)
23. [Mini project](#23-mini-project)
24. [Check yourself](#24-check-yourself)
25. [New words in this file](#25-new-words-in-this-file)

---

# NumPy

## 1. Why NumPy?

**Why it exists:** Python is easy to read but slow at repeating a tiny step millions of times. Data and AI work means doing maths on millions of numbers, so we hand the repeating to fast compiled code through NumPy.

**NumPy** (Numerical Python) gives you the **array**: a grid of numbers (a vector, matrix or tensor from [file 05](05-math-linear-algebra.md)) with very fast maths.

Python lists are flexible but slow for maths. NumPy arrays:
- store numbers in one compact block of memory, all with the same type
- run operations in optimised C code
- let you write `a * 2` instead of a loop

```python
import numpy as np
import time

nums = list(range(1_000_000))
t = time.time(); squares = [x**2 for x in nums]; print("list:", time.time() - t)

arr = np.arange(1_000_000)
t = time.time(); squares = arr ** 2; print("numpy:", time.time() - t)
# NumPy is typically 10 to 100× faster
```

**Vectorisation** = doing an operation on a whole array at once instead of looping element by element. It's the key to fast data code.

Pandas, scikit-learn, PyTorch and nearly every data/AI library are built on (or modelled after) NumPy.

### Worked example: why lists are heavier

A Python list holds 1,000,000 separate Python number objects plus a pointer to each, roughly 36 bytes per number. A NumPy `int64` array holds the raw 8 bytes per number in one block.

```
Python list:  [ptr]→[int object]   [ptr]→[int object]   [ptr]→[int object] ...   (scattered in memory)
NumPy array:  [ 8 bytes ][ 8 bytes ][ 8 bytes ][ 8 bytes ] ...                     (one tight block)
```

So 1 million numbers take about 36 MB as a list and 8 MB as an array. The tight block is also fast because the CPU can stream through memory in order and use special instructions that process several numbers at once (SIMD).

**Example:** convert 1,000,000 prices from rupees to dollars at Rs. 300 per dollar. With a loop you write `[p / 300 for p in prices]`. With NumPy you write `prices / 300`, which is shorter and far faster.

**Where you'll meet it in real work:** every tensor in PyTorch and every column in Pandas is built on the same idea of a typed block of numbers. NumPy habits transfer directly.

**Common mistakes:**
- Looping over an array with `for` when one vectorised line would do.
- Assuming NumPy is always faster. For an array of 5 numbers the set-up cost dominates; the speed-up shows with large arrays.

> **සිංහලෙන්:** Python list එකක අංක ලක්ෂයක් තිබ්බාම හැම අංකයක්ම වෙන වෙනම object එකක් විදියට මතකයේ විසිරිලා තියෙනවා. NumPy array එකේදී ඔක්කොම එකම වර්ගයේ අංක, එක තද block එකක තියෙනවා, ඒ නිසා වේගවත්. රුපියල් ලක්ෂයක මිල ඩොලර් වලට හරවන්න loop එකක් ලියනවා වෙනුවට prices / 300 කියලා එක පේළියක් ලිව්වාම ඇති. එකම වැඩේ එතකොට ගොඩක් වේගවත් වෙනවා, ඒකට vectorisation කියනවා. PyTorch, Pandas වගේ library ඔක්කොම මේ අදහස උඩම හදලා තියෙන්නේ.

---

## 2. Creating arrays

**Why it exists:** most of the time your arrays do not come from typing numbers by hand. You need quick ways to make blank starting arrays, number ranges and special matrices.

```python
import numpy as np

a = np.array([1, 2, 3])                    # from a list → 1-D array
M = np.array([[1, 2, 3], [4, 5, 6]])       # from nested lists → 2-D array

np.zeros((2, 3))          # 2×3 array of 0.0
np.ones(4)                # [1., 1., 1., 1.]
np.full((2, 2), 7)        # 2×2 array filled with 7
np.eye(3)                 # 3×3 identity matrix
np.arange(0, 10, 2)       # [0, 2, 4, 6, 8]   like range()
np.linspace(0, 1, 5)      # [0, 0.25, 0.5, 0.75, 1.0]   5 evenly spaced numbers
```

### Worked examples

**`arange` vs `linspace`:** `np.arange(0, 1, 0.25)` gives `[0, 0.25, 0.5, 0.75]`. The end value is **excluded** (like `range`). `np.linspace(0, 1, 5)` gives `[0, 0.25, 0.5, 0.75, 1.0]`. The end is **included** and you choose the *number of points*. Use `arange` when you know the step, `linspace` when you know how many points you want.

**One-hot vectors with `eye`:** `np.eye(3)` is the 3 × 3 identity matrix. Its rows are one-hot vectors, so `np.eye(3)[1]` gives `[0., 1., 0.]`: "class 1 out of 3 classes", exactly the label format used in cross-entropy ([file 07](07-math-probability-statistics.md#23-cross-entropy)).

**A weight matrix:** a layer that maps 4 inputs to 3 outputs needs a 3 × 4 matrix of weights, so `np.zeros((3, 4))` creates the blank container. In real training the weights start small and random (section 8), not zero.

**Where you'll meet it in real work:** creating placeholders to fill in later (`np.zeros`), making x-axis values for a chart (`linspace`), and building one-hot labels (`eye`).

**Common mistakes:**
- `np.zeros(2, 3)` is an error. The shape must be **one tuple**: `np.zeros((2, 3))`.
- Using `arange` with a decimal step and expecting an exact count of elements. Floating-point rounding can surprise you; `linspace` is safer.

> **සිංහලෙන්:** Array එකක් හදන්න ක්‍රම ගොඩක් තියෙනවා. np.zeros((3, 4)) කියන්නේ බිංදු වලින් පිරුණු පේළි 3ක, තීරු 4ක array එකක්, පස්සේ පුරවන්න හිස් බඳුනක් වගේ. np.arange(0, 1, 0.25) කියන්නේ පියවර 0.25 බැගින් යන, අවසාන අගය අයින් වුණු ලැයිස්තුවක්. np.linspace(0, 1, 5) කියන්නේ 0 ඉඳන් 1 දක්වා සමාන පරතරයෙන් අංක 5ක්, අවසානයත් ඇතුළුව. np.eye(3) වලින් එන පේළි තමයි one-hot vectors, classification labels හදන්න ඒවා පාවිච්චි කරනවා.

---

## 3. Array attributes

**Why it exists:** the number one bug in AI code is a **shape mismatch**. Before you do anything with an array you must be able to say "what shape is this and what type is each number?".

```python
M = np.array([[1, 2, 3], [4, 5, 6]])
M.shape     # (2, 3)   rows, columns
M.ndim      # 2        number of dimensions
M.size      # 6        total elements
M.dtype     # int64    data type of elements
```

### dtypes (data types)

| dtype | Meaning |
|---|---|
| `int64`, `int32` | integers |
| `float64`, `float32`, `float16` | decimals (64/32/16 bits, see [file 01](01-big-picture-and-data.md#11-how-computers-store-data-bits-and-bytes)) |
| `bool` | True/False |
| `object` | mixed Python objects (slow; often means messy data) |

```python
x = np.array([1, 2, 3], dtype=np.float32)
x.astype(np.int32)        # convert type
```

Deep learning usually uses `float32` (or lower). NumPy defaults to `float64`, which uses twice the memory.

### Worked example: a batch of images

A batch of 64 colour photos, each 224 × 224 pixels with 3 colour channels (red, green, blue). In PyTorch's usual layout the array has shape **(64, 3, 224, 224)**.

- `ndim` = 4
- `size` = 64 × 3 × 224 × 224 = **9,633,792** numbers
- As `float32` (4 bytes each): 9,633,792 × 4 ≈ **38.5 MB**
- As `float16` (2 bytes each): about **19.3 MB**

```
shape (64, 3, 224, 224)
        │   │   │    └─ width  in pixels
        │   │   └────── height in pixels
        │   └────────── colour channels (R, G, B)
        └────────────── number of images in the batch
```

**Exam angle (deployment / inference):** a model's memory is roughly `number of parameters × bytes per number`. A 7-billion-parameter model needs about 7 × 10⁹ × 2 bytes = **14 GB** in float16, and about **28 GB** in float32. That is why half precision and quantisation matter when you deploy large models.

**Common mistakes:**
- Putting decimals into an integer array. `a = np.array([1, 2, 3]); a[0] = 2.7` silently stores **2**, because the array's dtype is int.
- Confusing `size` (total count of elements) with `shape` (the dimensions).

> **සිංහලෙන්:** Array එකක shape එක කියන්නේ එහි පේළි, තීරු වගේ මාන. dtype එක කියන්නේ අංකය තියෙන වර්ගය. පින්තූර 64ක්, හැම එකක්ම 224 × 224 pixels සහ වර්ණ තීරු 3යි නම් shape එක (64, 3, 224, 224) වෙනවා. එහි අංක 9,633,792ක් තියෙනවා, float32 නම් එකක් බයිට් 4 නිසා මෙගාබයිට් 38.5ක් විතර මතකය යනවා. Model එකක parameters බිලියන 7ක් float16 වලින් තිබ්බොත් බයිට් 2 බැගින් ගිහින් GB 14ක් ඕනේ වෙනවා. ඒ නිසා shape සහ dtype හැමවෙලේම පරීක්ෂා කරන්න.

---

## 4. Indexing, slicing, boolean masks

**Why it exists:** you rarely want the whole array. You want the passing students, the fraud rows, the first 100 examples, or one column. Indexing and masks let you cut out exactly that.

### 1-D (like lists, [file 02](02-python-programming.md#7-lists))

```python
a = np.array([10, 20, 30, 40, 50])
a[0]        # 10
a[-1]       # 50
a[1:4]      # [20, 30, 40]
a[::2]      # [10, 30, 50]
```

### 2-D: `[row, column]`

```python
M = np.array([[1, 2, 3],
              [4, 5, 6],
              [7, 8, 9]])
M[0, 2]       # 3       row 0, column 2
M[1]          # [4, 5, 6]   row 1
M[:, 1]       # [2, 5, 8]   all rows, column 1
M[:2, 1:]     # [[2, 3], [5, 6]]   rows 0-1, columns 1-2
```

### Boolean masks (filtering): very important

A comparison on an array gives an array of True/False (a **mask**). Use the mask to select elements:

```python
a = np.array([10, 20, 30, 40, 50])
mask = a > 25          # [False, False, True, True, True]
a[mask]                # [30, 40, 50]
a[a > 25]              # same, in one line
a[(a > 15) & (a < 45)] # [20, 30, 40]   use & for AND, | for OR, ~ for NOT, with brackets
a[a > 25] = 0          # set those elements to 0
```

### Fancy indexing (a list of positions)

```python
a[[0, 2, 4]]    # [10, 30, 50]
```

⚠️ **Slices are views, not copies.** Changing a slice changes the original array. Use `.copy()` if you need independence (same idea as list copying in [file 02](02-python-programming.md#7-lists)).

### Worked example: exam marks

```python
scores = np.array([45, 82, 67, 91, 38, 74])
mask = scores >= 50              # [False, True, True, True, False, True]
scores[mask]                     # [82, 67, 91, 74]   the passes
mask.sum()                       # 4      True counts as 1, so this counts the passes
mask.mean()                      # 0.667  the pass rate (4 out of 6)
scores[~mask]                    # [45, 38]   the fails
```

Booleans behave like 1 and 0 when you add or average them. That one trick gives you counts and percentages without a loop.

### Views: the trap in numbers

```python
a = np.array([10, 20, 30, 40])
b = a[1:3]          # a slice: [20, 30], a VIEW into a
b[0] = 99
print(a)            # [10, 99, 30, 40]   a changed too!
c = a[1:3].copy()   # an independent copy
```

A boolean mask or fancy index, by contrast, always makes a **copy**.

**Where you'll meet it in real work:** choosing a training batch (`X[batch_indices]`), selecting all rows of one class (`X[y == 1]`), or zeroing out invalid values (`x[x < 0] = 0`).

**Common mistakes:**
- Writing `a[a > 15 and a < 45]`. Python's `and` fails on arrays with a "truth value is ambiguous" error. Use `&` with brackets around each condition.
- Modifying a slice and being surprised that the original changed.

> **සිංහලෙන්:** Boolean mask එකක් කියන්නේ True/False ලැයිස්තුවක්, ඒකෙන් array එකෙන් ඕන දේවල් විතරක් අරගන්න පුළුවන්. ලකුණු [45, 82, 67, 91, 38, 74] වලින් scores >= 50 කියලා mask එක හැදුවාම pass වුණ 4 දෙනා විතරක් ගන්න පුළුවන්. True කියන්නේ 1 වගේ නිසා mask.sum() ගත්තාම pass ගාණ 4 ලැබෙනවා, mask.mean() ගත්තාම pass අනුපාතය 0.667 ලැබෙනවා. ඒත් slice එකක් කියන්නේ view එකක්, ඒක වෙනස් කළොත් මුල් array එකත් වෙනස් වෙනවා, ඒ නිසා ඕන නම් .copy() පාවිච්චි කරන්න.

---

## 5. Vectorised maths and broadcasting

**Why it exists:** writing `a + b` for whole arrays is both shorter and much faster than a loop. Broadcasting extends this to arrays of different shapes, which saves you from copying data by hand.

Operations work element by element:

```python
a = np.array([1, 2, 3])
b = np.array([10, 20, 30])
a + b          # [11, 22, 33]
a * b          # [10, 40, 90]
a ** 2         # [1, 4, 9]
np.sqrt(a)     # [1., 1.414, 1.732]
np.exp(a)      # e^1, e^2, e^3
np.log(a)      # natural log
a @ b          # 140   dot product (file 05)
```

**Broadcasting** ([file 05](05-math-linear-algebra.md#14-broadcasting)) stretches smaller arrays automatically:

```python
M = np.array([[1, 2, 3],
              [4, 5, 6]])
M + 10                       # adds 10 everywhere
M - M.mean(axis=0)           # subtract each column's mean from that column
```

**Worked example: standardise columns** (z-scores, [file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)):

```python
X = np.array([[170, 65], [180, 80], [160, 55]], dtype=float)   # height, weight
X_std = (X - X.mean(axis=0)) / X.std(axis=0)
# each column now has mean 0 and std 1
```

### Worked example: broadcasting by hand

```python
M = np.array([[1, 2, 3],
              [4, 5, 6]])          # shape (2, 3)
M - M.mean(axis=0)
```

- Column means: `M.mean(axis=0)` = [2.5, 3.5, 4.5], shape (3,)
- NumPy stretches the (3,) row to (2, 3), repeating it for every row
- Result: `[[1 − 2.5, 2 − 3.5, 3 − 4.5], [4 − 2.5, 5 − 3.5, 6 − 4.5]]` = **[[−1.5, −1.5, −1.5], [1.5, 1.5, 1.5]]**

### The shape rule

Line up the shapes from the **right**. Two sizes are compatible if they are equal or one of them is 1.

| A shape | B shape | Result |
|---|---|---|
| (2, 3) | (3,) | works, B is stretched over rows |
| (2, 3) | (2, 1) | works, B is stretched over columns |
| (2, 3) | (2,) | **error**: 3 vs 2 do not match |
| (4, 1) | (1, 5) | works, gives (4, 5) |

### Standardising the example

For the height/weight example, heights [170, 180, 160] have mean 170 and std √(200/3) ≈ 8.16, so their z-scores are about [0, 1.22, −1.22]. Weights [65, 80, 55] have mean 66.7 and std ≈ 10.27, so z ≈ [−0.16, 1.30, −1.14]. Both columns are now on the same scale, ready for a model.

**Where you'll meet it in real work:** adding a bias vector to every row of a layer's output, subtracting the mean from every pixel, and dividing every row by its sum to get probabilities.

**Common mistakes:**
- Confusing `*` (element-by-element) with `@` (matrix multiplication or dot product). They give completely different results.
- Trusting broadcasting to "do something sensible" with mismatched shapes. If a result looks odd, print the shapes.

> **සිංහලෙන්:** Vectorised කියන්නේ array දෙකක් අතර a + b ලිව්වාම අදාළ ස්ථාන වල අංක එකතු වෙන එක. Broadcasting කියන්නේ පොඩි array එක ඉබේම ලොකු එකේ හැඩයට දිග ඇරලා ගන්න එක. උදාහරණයක් විදියට M - M.mean(axis=0) කියලා ලිව්වාම හැම තීරුවෙන්ම ඒ තීරුවේ සාමාන්‍යය අඩු වෙනවා, වෙනම loop එකක් ඕනේ නෑ. හැඩ දෙක දකුණු පැත්තෙන් ඇරඹී සසඳනවා, සමාන වෙන්න ඕනේ නැත්නම් එකක් 1 වෙන්න ඕනේ. * කියන්නේ element-by-element ගුණ කිරීම, @ කියන්නේ matrix ගුණ කිරීම, මේ දෙක ව්‍යාකූල කරගන්න එපා.

---

## 6. Aggregations and the axis argument

**Why it exists:** a table of numbers has two directions. You often want a total per column ("sales per week") or per row ("sales per shop"). `axis` tells NumPy which direction to collapse.

```python
M = np.array([[1, 2, 3],
              [4, 5, 6]])
M.sum()           # 21     everything
M.sum(axis=0)     # [5, 7, 9]     down the rows → one result per COLUMN
M.sum(axis=1)     # [6, 15]       across columns → one result per ROW
M.mean(), M.std(), M.min(), M.max()
M.argmax()        # 5   position of the max (in the flattened array)
M.argmax(axis=1)  # [2, 2]   column of the max in each row
np.percentile(M, 50)   # median
```

**How to remember `axis`:** the axis you name is the one that **disappears** (gets collapsed).
- (2, 3) array, `axis=0` → result shape (3,): the rows were collapsed
- `axis=1` → result shape (2,): the columns were collapsed

```
         axis=1 →
axis=0  ┌ 1  2  3 ┐ → sum = 6
  ↓     │ 4  5  6 │ → sum = 15
        └         ┘
          ↓  ↓  ↓
          5  7  9
```

The same `axis`/`dim` idea appears in Pandas and PyTorch (where it's often called `dim`).

### Worked example: three shops over four weeks

```python
sales = np.array([[10, 12,  9, 14],     # shop 1
                  [20, 18, 25, 22],     # shop 2
                  [ 5,  6,  4,  7]])    # shop 3     shape (3, 4)
sales.sum(axis=0)       # [35, 36, 38, 43]   total of all shops, per WEEK   (shape (4,))
sales.sum(axis=1)       # [45, 85, 22]       total over the weeks, per SHOP (shape (3,))
sales.mean(axis=1)      # [11.25, 21.25, 5.5]  average weekly sales per shop
sales.argmax(axis=1)    # [3, 2, 3]   best week (column index) for each shop
```

Check by hand: shop 1 total = 10 + 12 + 9 + 14 = 45 ✓. Week 1 total = 10 + 20 + 5 = 35 ✓.

### keepdims: dividing each row by its own total

```python
share = sales / sales.sum(axis=1, keepdims=True)   # keepdims gives shape (3, 1), so broadcasting works
share[0]        # [0.222, 0.267, 0.2, 0.311]   shop 1's weekly shares, adding to 1
```

**Where you'll meet it in real work:** a batch of model outputs has shape (examples, classes). Softmax and "which class won?" (`argmax`) are computed with `axis=1` (across classes), never across examples.

**Common mistakes:**
- Remembering `axis=0` as "rows" and getting the answer backwards. `axis=0` collapses the rows and leaves **one value per column**.
- Forgetting `keepdims=True` when you plan to divide by the result, and getting a shape error.

> **සිංහලෙන්:** axis කියන්නේ කුමන දිශාවෙන් එකතු කරනවද කියන එක. axis=0 කියන්නේ පේළි ඔක්කොම උඩ ඉඳන් පහළට එකතු කරනවා, ප්‍රතිඵලයේ එක් අගයක් එක් තීරුවට. කඩ 3ක සති 4ක විකුණුම් වගුවේ sum(axis=0) කළොත් සතියකට මුළු විකුණුම් (35, 36, 38, 43) එනවා. sum(axis=1) කළොත් කඩයකට මුළු විකුණුම් (45, 85, 22) එනවා. මතක තියාගන්න ක්‍රමය: නම් කරන axis එක අතුරුදහන් වෙනවා කියලා. Model එකේ output එකේ තීරු කියන්නේ classes නිසා softmax කරන්නේ axis=1 මත.

---

## 7. Reshaping and combining

**Why it exists:** the same numbers often need to be viewed in different shapes: a photo is a grid for humans but a single long list of numbers for a simple network. Reshaping changes the **view**, not the numbers.

```python
a = np.arange(12)           # [0..11], shape (12,)
a.reshape(3, 4)             # shape (3, 4)
a.reshape(2, -1)            # shape (2, 6); -1 means "figure it out"
a.reshape(3, 4).T           # transpose → (4, 3)
a.reshape(3, 4).flatten()   # back to 1-D

x = np.array([1, 2, 3])
x[np.newaxis, :].shape      # (1, 3)  add a dimension
x[:, np.newaxis].shape      # (3, 1)
np.expand_dims(x, 0)        # same as x[np.newaxis, :]
np.squeeze(np.zeros((1, 3, 1))).shape   # (3,)  remove size-1 dimensions

np.concatenate([x, x])          # [1, 2, 3, 1, 2, 3]
np.vstack([x, x])               # stack as rows → shape (2, 3)
np.hstack([x, x])               # side by side → shape (6,)
np.stack([x, x], axis=0)        # new axis → shape (2, 3)
```

### Worked example: from images to vectors

A 28 × 28 greyscale digit image has 784 pixels. A simple fully-connected network wants a flat vector of 784 numbers per image.

```python
img = np.arange(784).reshape(28, 28)     # shape (28, 28)
flat = img.reshape(-1)                   # shape (784,)
batch = np.zeros((100, 28, 28))          # 100 images
batch.reshape(100, -1).shape             # (100, 784): -1 works out 28 * 28 = 784 for us
```

NumPy fills new shapes **row by row** ("row-major"):

```
np.arange(12).reshape(3, 4)          np.arange(12).reshape(4, 3)
 [[ 0  1  2  3]                       [[ 0  1  2]
  [ 4  5  6  7]                        [ 3  4  5]
  [ 8  9 10 11]]                       [ 6  7  8]
                                       [ 9 10 11]]
```

The total count must not change: 12 elements can be (3, 4), (2, 6) or (12,), but never (5, 3) (that needs 15).

**Where you'll meet it in real work:** flattening images before a dense layer, adding a batch dimension (`x[np.newaxis, :]`) because models expect a *batch* even for one example, and stacking monthly tables with `vstack`.

**Common mistakes:**
- Using `reshape` when you wanted a transpose. `reshape(4, 3)` re-fills row by row; `.T` swaps rows and columns. They give different arrays.
- Forgetting that models want a batch dimension, so a single example with shape (3,) must become (1, 3).

> **සිංහලෙන්:** Reshape කියන්නේ අංක වෙනස් නොකර array එකේ හැඩය වෙනස් කරන එක. 28 × 28 පින්තූරයක pixels 784ක් තියෙනවා, සරල network එකකට ඒක දිග පේළියක් විදියට (784,) දෙන්න ඕනේ. np.arange(12).reshape(3, 4) කළාම අංක පේළියෙන් පේළියට පිරෙනවා. -1 දැම්මාම NumPy තනියම ඒ මානය හොයාගන්නවා. මුළු අංක ගණන වෙනස් වෙන්න බෑ, අංක 12ක් (5, 3) කරන්න බෑ. reshape සහ transpose (.T) එකම දේවල් නෙවෙයි, ඒ දෙකෙන් එන ප්‍රතිඵල වෙනස්.

---

## 8. Random numbers

**Why it exists:** machine learning needs randomness for shuffling data, starting weights and simulations, but you also need to be able to **repeat** an experiment exactly. A seed gives you both.

```python
rng = np.random.default_rng(seed=42)   # a seed makes "random" results repeatable
rng.random(3)                # 3 uniform numbers in [0, 1)
rng.integers(1, 7, size=5)   # 5 dice rolls
rng.normal(loc=170, scale=10, size=1000)   # 1000 heights from a normal distribution
rng.choice(["a", "b", "c"], size=4)
rng.permutation(10)          # shuffled 0..9
```

**Seeds and reproducibility:** computers generate "pseudo-random" numbers from a starting **seed**. The same seed gives the same sequence, so your experiment gives the same results every time. Always set seeds in ML experiments (file 11).

### Worked example: a repeatable shuffle

```python
rng = np.random.default_rng(seed=42)
idx = rng.permutation(10)           # a shuffled list of 0..9, the same every time this runs
train_idx, test_idx = idx[:8], idx[8:]    # 80% train, 20% test
```

Run it again with `seed=42` and `idx` is identical, so your train/test split is the same and your results can be compared fairly. Change the seed to 7 and you get a different split.

**Simulating coin flips:** `rng.integers(0, 2, size=1000).mean()` flips a fair coin 1,000 times and returns the fraction of heads, close to 0.5 (typically within about ±0.03). With 10 flips it would wobble much more. This is the law of large numbers from [file 07](07-math-probability-statistics.md#16-sampling-lln-clt) in one line.

**Where you'll meet it in real work:** random train/test splits, random starting weights for a neural network, and data augmentation (random crops and flips of images).

**Exam angle:** reproducibility. If a question asks how to make a training run repeatable, the answer includes fixing random seeds (and recording library versions and data versions).

**Common mistakes:**
- Shuffling features and labels **separately**. The rows no longer match their labels. Use one permutation for both: `X[idx], y[idx]`.
- Not setting any seed and then being unable to reproduce a good result.

> **සිංහලෙන්:** Computer එක හදන "අහඹු" අංක ඇත්තටම අහඹු නෙවෙයි, ඒවා seed එකකින් පටන් අරන් හැදෙන ලැයිස්තුවක්. එකම seed එක දුන්නොත් හැමවෙලේම එකම අංක ලැබෙනවා. ඒක ML වලට වටිනවා, මොකද අද කළ experiment එක හෙට නැවත කරලා එකම ප්‍රතිඵලය ගන්න පුළුවන්. Data 10ක් shuffle කරලා 8ක් train, 2ක් test විදියට බෙදද්දී seed=42 දැම්මොත් හැමවෙලේම එකම බෙදීම ලැබෙනවා. X සහ y වෙන වෙනම shuffle කරන්න එපා, නැත්නම් row එකයි label එකයි පරස්පර වෙනවා.

---

# Pandas

## 9. Series and DataFrame

**Why it exists:** real data lives in tables with column names, text and dates, not just numbers. A NumPy array has no column names and one type for everything; Pandas adds labels and a different type per column.

**Pandas** is the main library for **tabular data** (tables) in Python. Think "Excel + SQL, inside Python".

- **Series:** one column: a 1-D array with labels (an **index**).
- **DataFrame:** a table: a collection of Series sharing the same index. Rows and columns, like [file 01](01-big-picture-and-data.md#10-tables-rows-columns-features-labels).

```python
import pandas as pd

s = pd.Series([10, 20, 30], index=["a", "b", "c"])
s["b"]     # 20

df = pd.DataFrame({
    "name":  ["Amal", "Nisha", "John", "Priya"],
    "age":   [34, 28, 45, 31],
    "city":  ["Colombo", "Kandy", "Colombo", "Galle"],
    "spent": [1250.0, 430.5, 2100.0, None],
})
print(df)
```
```
    name  age     city   spent
0   Amal   34  Colombo  1250.0
1  Nisha   28    Kandy   430.5
2   John   45  Colombo  2100.0
3  Priya   31    Galle     NaN
```

- The left column (0, 1, 2, 3) is the **index**: row labels.
- `NaN` ("Not a Number") = **missing value** in Pandas (like NULL in SQL).

### Worked example: anatomy of a DataFrame

```
          columns (Series, each with its own dtype)
            name     age     city     spent
index  0    Amal      34   Colombo   1250.0      ← one row = one customer (a Series too)
       1    Nisha     28   Kandy      430.5
       2    John      45   Colombo   2100.0
       3    Priya     31   Galle        NaN
```

- `df["spent"]` is a Series of 4 numbers with index 0 to 3.
- `df["spent"].mean()` gives (1250 + 430.5 + 2100) / 3 = **1260.17**. Pandas **skips NaN** by default, so Priya is ignored. (NumPy's `np.mean` on the same numbers would return `nan`.)
- `df["age"].dtype` is `int64`; `df["city"].dtype` is `object` (text).

**Where you'll meet it in real work:** a customer table, a log of chatbot conversations, a CSV of model predictions. Almost every data job starts by loading something into a DataFrame.

**Common mistakes:**
- Thinking Pandas and NumPy handle missing values the same way. They do not (see section 16).
- Using `df.age` for a column whose name has a space or clashes with a method name. Brackets always work.

> **සිංහලෙන්:** Pandas වල DataFrame එක කියන්නේ Excel sheet එකක් වගේ වගුවක්. හැම තීරුවකටම නමක් තියෙනවා, හැම තීරුවකටම වෙනම වර්ගයක් තියෙන්නත් පුළුවන් (නම් text, වයස අංක). එක තීරුවකට Series කියනවා, පේළි වල ලේබල් වලට index කියනවා. Amal, Nisha, John, Priya ගේ වගුවේ spent තීරුවේ Priya ට NaN (අගයක් නෑ) තියෙනවා, df["spent"].mean() කළාම Pandas ඒක මඟ හරිනවා, ඒ නිසා (1250 + 430.5 + 2100) / 3 = 1260.17 ලැබෙනවා. NumPy වලදී නම් එහෙම මඟ හරින්නේ නෑ, nan ම එනවා.

---

## 10. Loading and saving data

**Why it exists:** your data starts life somewhere else: a spreadsheet, a database, a web link. These functions are the doors that bring it into Python and let you save your cleaned result.

```python
df = pd.read_csv("sales.csv")
df = pd.read_csv("sales.csv", sep=";", encoding="utf-8", parse_dates=["date"])
df = pd.read_excel("report.xlsx", sheet_name="2024")
df = pd.read_json("data.json")
df = pd.read_json("data.jsonl", lines=True)
df = pd.read_parquet("big.parquet")
df = pd.read_sql("SELECT * FROM orders", conn)      # from a database (file 03)
df = pd.read_csv("https://example.com/data.csv")   # directly from a URL

df.to_csv("clean.csv", index=False)     # index=False: don't write the index column
df.to_parquet("clean.parquet")
df.to_excel("out.xlsx", index=False)
```

### Worked example: a tiny CSV

```python
from io import StringIO                       # lets us treat a string as if it were a file
text = "name,age,city\nAmal,34,Colombo\nNisha,28,Kandy"
df = pd.read_csv(StringIO(text))              # first line becomes the column names
```
```
    name  age     city
0   Amal   34  Colombo
1  Nisha   28    Kandy
```

Save it with `df.to_csv("x.csv")` (no `index=False`) and read it back, and you get an extra column called `Unnamed: 0`. That is the old index, written as data. Always pass `index=False` unless the index means something.

| Format | Good for | Weak points |
|---|---|---|
| CSV | sharing with anyone, opening in Excel | no types stored, slow and large for big data |
| Excel | business users | slow, limited rows |
| JSON / JSONL | web APIs, chat logs (one JSON object per line) | verbose |
| Parquet | big data and ML pipelines: small, fast, keeps types | not human-readable |

**Where you'll meet it in real work:** LLM training and evaluation data are usually stored as JSONL or Parquet. A bank's overnight job might load 5 million rows from Parquet in a few seconds, where the same data as CSV takes minutes.

**Common mistakes:**
- Wrong encoding. Files containing Sinhala or Tamil text must be read and written as UTF-8 (`encoding="utf-8"`); otherwise you get garbled characters.
- Reading dates as plain text. Use `parse_dates=[...]` or convert with `pd.to_datetime`.

> **සිංහලෙන්:** Data එක බොහෝවිට CSV, Excel, JSON, Parquet වගේ file එකකින් එන්නේ. pd.read_csv("file.csv") කළාම ඒක DataFrame එකක් බවට පත් වෙනවා. සිංහල වගේ අකුරු තියෙන file වලට encoding="utf-8" දාන්න, නැත්නම් අකුරු කැඩිලා පේනවා. Save කරද්දි index=False දාන්නේ නැත්නම්, නැවත කියවද්දි "Unnamed: 0" කියන අමතර තීරුවක් එනවා. ලොකු data වලට CSV වලට වඩා Parquet හොඳයි, මොකද ඒක කුඩායි, වේගවත්, වර්ගත් මතක තියාගන්නවා.

---

## 11. First look at a dataset

**Why it exists:** you cannot clean or model data you have not looked at. This short routine finds most data problems (wrong types, missing values, duplicates, silly numbers) in under a minute.

Run these every time you open new data:

```python
df.head()          # first 5 rows
df.tail(3)         # last 3 rows
df.sample(5)       # 5 random rows (more representative than head)
df.shape           # (rows, columns)
df.columns         # column names
df.dtypes          # type of each column
df.info()          # types + non-null counts + memory: spot missing values
df.describe()      # count, mean, std, min, quartiles, max for numeric columns
df.describe(include="object")   # for text columns: count, unique, top, freq
df.isna().sum()    # missing values per column
df.duplicated().sum()   # number of duplicate rows
```

**Example `describe()` output:**
```
             age        spent
count   4.000000     3.000000
mean   34.500000  1260.166667
std     7.330303   834.786952
min    28.000000   430.500000
25%    30.250000   840.250000
50%    32.500000  1250.000000
75%    36.750000  1675.000000
max    45.000000  2100.000000
```

These are the statistics from [file 07](07-math-probability-statistics.md) in one command.

### The five-minute routine

1. `df.shape`: how big is it? Is the row count what you expected?
2. `df.info()`: are the dtypes right? Is a number stored as text (`object`)?
3. `df.isna().sum()`: which columns have gaps?
4. `df.describe()`: do the min and max make sense? An age of 250 or a negative price is a bug.
5. `df.duplicated().sum()` and `df["col"].value_counts()`: repeats? How balanced are the categories?

### Reading `info()`

```
Data columns (total 4 columns):
 #   Column  Non-Null Count  Dtype
 0   name    4 non-null      object
 1   age     4 non-null      int64
 2   city    4 non-null      object
 3   spent   3 non-null      float64    ← only 3 of 4 rows filled: one missing value
```

### Reading `describe()` for `spent`

`count = 3` (not 4, NaN is excluded). `mean = 1260.17`, and the median (`50%`) = 1250. The two are close, so no strong skew. Std of 834.8 is large compared with the mean, so spending varies a lot between customers. These are the statistics from [file 07](07-math-probability-statistics.md#3-measures-of-spread) delivered in one command.

**Where you'll meet it in real work:** before fine-tuning an LLM on a company's support tickets, someone must run exactly this routine to find empty replies, duplicated tickets and weird lengths. Bad rows in = bad model out.

**Common mistakes:**
- Looking only at `head()`. The first rows are rarely representative; use `sample()` too.
- Forgetting that `describe()` only covers numeric columns unless you pass `include="object"`.

> **සිංහලෙන්:** අලුත් data එකක් ආවාම පළවෙනියටම කරන්න ඕනේ ඒක දිහා බලන එක. df.shape වලින් පේළි, තීරු ගාණ, df.info() වලින් වර්ග සහ හිස් අගයන් ගාණ, df.describe() වලින් mean, min, max වගේ සාරාංශය, df.isna().sum() වලින් හිස් තැන් ගාණ බලනවා. වයස 250ක් හෝ ඍණ මිලක් තිබුණොත් ඒක data වැරැද්දක්. spent තීරුවේ count 3යි කියන්නේ එක අගයක් නැති නිසා. මෙහෙම බලන්නේ නැතුව model එක train කළොත් නරක data වලින් නරක model එකක් හැදෙනවා.

---

## 12. Selecting columns and rows

**Why it exists:** you constantly need "this column", "those rows" or "that one cell". `loc` and `iloc` give you two clear ways to say it: by name or by position.

### Columns

```python
df["age"]               # one column → Series
df[["name", "age"]]     # several columns → DataFrame (note the double brackets)
df.age                  # shortcut (only works for simple names)
```

### Rows: `loc` (by label) vs `iloc` (by position)

```python
df.iloc[0]              # first row (position 0)
df.iloc[0:2]            # first two rows
df.iloc[0, 1]           # row 0, column 1 → 34
df.iloc[:, 0:2]         # all rows, first two columns

df.loc[0]               # row with index LABEL 0
df.loc[0:2, "name"]     # labels 0 TO 2 (inclusive!), column "name"
df.loc[:, ["name", "city"]]
```

- **`iloc`** = **i**nteger **loc**ation: positions, like Python slicing (end excluded).
- **`loc`** = labels: the end label **is included**.

### Setting the index

```python
df = df.set_index("name")
df.loc["Nisha", "age"]   # 28
df = df.reset_index()    # back to 0, 1, 2...
```

### Worked example: labels move, positions don't

```python
s = df.sort_values("age")          # youngest first: Nisha(28), Priya(31), Amal(34), John(45)
```

The index labels travel with the rows, so after sorting the index is `[1, 3, 0, 2]`.

| Code | What it returns | Why |
|---|---|---|
| `s.iloc[0]` | Nisha | **position** 0 is the first row now |
| `s.loc[0]` | Amal | **label** 0 is still Amal's row |
| `s.iloc[0:2]` | Nisha, Priya | positions 0 and 1 (end excluded) |
| `s.loc[1:3]` | Nisha, Priya | labels from 1 **to 3 inclusive**, in the order they appear |

### Choosing rows and a column together

```python
df.loc[df["age"] > 30, "name"]     # names of everyone over 30: Amal, John, Priya
df.loc[df["city"] == "Colombo", "spent"] = 0   # set a column for the selected rows (safe way to assign)
```

**Where you'll meet it in real work:** selecting the feature columns and the label column before training (`X = df.loc[:, features]`, `y = df["label"]`).

**Common mistakes:**
- Chained assignment like `df[df.age > 30]["name"] = "X"`. It may change a temporary copy and leave `df` untouched. Use one `loc` call: `df.loc[df.age > 30, "name"] = "X"`.
- Using `loc` when you meant a position after the data has been sorted or filtered.

> **සිංහලෙන්:** loc කියන්නේ ලේබලයෙන් තෝරන එක, iloc කියන්නේ ස්ථානයෙන් (0, 1, 2...) තෝරන එක. df ඒක වයස අනුව sort කළාම පේළි වල ලේබල් ඒවා සමඟම ගමන් කරනවා. ඉතින් s.iloc[0] කියන්නේ දැන් පළමු පේළිය (Nisha), ඒත් s.loc[0] කියන්නේ තවමත් 0 ලේබලය තියෙන Amal ගේ පේළිය. iloc වලදී අවසානය ඇතුළත් වෙන්නේ නෑ, loc වලදී අවසාන ලේබලය ඇතුළත්. අගයක් වෙනස් කරන්න නම් df.loc[කොන්දේසිය, "තීරුව"] = අගය කියලා එකම loc එකකින් කරන්න.

---

## 13. Filtering rows

**Why it exists:** most questions are about a subgroup: "customers in Colombo", "orders above Rs. 5,000", "rows with a missing value". Filtering picks those rows.

Same boolean-mask idea as NumPy (section 4), and like SQL's WHERE ([file 03](03-developer-tools.md#7-sql-filtering-sorting-aggregating)):

```python
df[df["age"] > 30]
df[df["city"] == "Colombo"]
df[(df["age"] > 30) & (df["city"] == "Colombo")]      # AND (brackets required!)
df[(df["city"] == "Kandy") | (df["city"] == "Galle")] # OR
df[df["city"].isin(["Kandy", "Galle"])]               # same, cleaner
df[~df["city"].isin(["Kandy"])]                       # NOT
df[df["name"].str.startswith("A")]
df[df["spent"].isna()]                                # rows with missing spent
df[df["spent"].between(400, 1500)]

df.query("age > 30 and city == 'Colombo'")            # SQL-like string syntax
```

### Worked example: step by step

With the 4-row table from section 9:

```python
df["age"] > 30                  # [True, False, True, True]   a mask, one True/False per row
df[df["age"] > 30]              # Amal (34), John (45), Priya (31): 3 rows
(df["age"] > 30) & (df["city"] == "Colombo")      # [True, False, True, False]
df[(df["age"] > 30) & (df["city"] == "Colombo")]  # Amal and John: 2 rows
```

Reading `df[mask]`: "give me the rows of `df` where the mask is True". Count matches without printing the rows: `((df["age"] > 30) & (df["city"] == "Colombo")).sum()` gives **2**.

**Where you'll meet it in real work:** removing test/dummy accounts before analysis, picking out transactions above a limit for a fraud review, and keeping only chat logs written in a certain language.

**Common mistakes:**
- Using Python's `and` / `or` instead of `&` / `|`, or forgetting the brackets. Without them `df["age"] > 30 & df["city"] == "Colombo"` is evaluated in the wrong order and raises an error.
- Testing for missing values with `== np.nan`. NaN is never equal to anything, even itself, so it never matches. Use `.isna()`.
- Using `.str.contains` on a column with NaN. It returns NaN for those rows and breaks the filter; add `na=False`.

> **සිංහලෙන්:** Filter කරනවා කියන්නේ කොන්දේසියකට ගැළපෙන පේළි විතරක් ගන්න එක. df["age"] > 30 කියන්නේ හැම පේළියකටම True/False දෙන mask එකක්, df[mask] කියලා දැම්මාම True ඒවා විතරක් ලැබෙනවා. කොන්දේසි දෙකක් එකට දාන්න and වෙනුවට & පාවිච්චි කරලා හැම කොන්දේසියක්ම වරහන් ඇතුළේ තියන්න ඕනේ. අගයක් නැති (NaN) පේළි හොයන්න == np.nan පාවිච්චි කරන්න එපා, ඒක කවදාවත් ගැළපෙන්නේ නෑ, .isna() පාවිච්චි කරන්න.

---

## 14. Creating and changing columns

**Why it exists:** raw columns are rarely what a model wants. You convert units, make flags and group numbers into bands. Creating new columns from old ones is called **feature engineering**.

```python
df["spent_usd"] = df["spent"] / 300            # new column from maths (vectorised)
df["is_senior"] = df["age"] >= 40              # boolean column
df["age_group"] = pd.cut(df["age"], bins=[0, 30, 40, 100],
                         labels=["<30", "30-40", "40+"])   # bin numbers into groups
df["city_upper"] = df["city"].str.upper()
df["label"] = np.where(df["spent"] > 1000, "high", "low")   # if/else per row

df = df.rename(columns={"spent": "total_spent"})
df = df.drop(columns=["city_upper"])
df = df.drop(index=[3])                         # drop row with label 3
df["age"] = df["age"].astype(float)             # change type
```

**SettingWithCopyWarning:** if you filter a DataFrame and then modify the result, Pandas may warn you that you might be modifying a copy. Fix it by using `.copy()` after filtering: `sub = df[df.age > 30].copy()`.

### Worked example: new columns from the 4-row table

```python
df["spent_usd"] = df["spent"] / 300        # Amal: 1250 / 300 = 4.17 ; Nisha: 430.5 / 300 = 1.435 ; Priya stays NaN
df["age_group"] = pd.cut(df["age"], bins=[0, 30, 40, 100], labels=["<30", "30-40", "40+"])
```

`pd.cut` bins are **right-inclusive**: the bins are (0, 30], (30, 40] and (40, 100].

| Name | Age | Bin it lands in |
|---|---|---|
| Nisha | 28 | `<30` |
| Priya | 31 | `30-40` |
| Amal | 34 | `30-40` |
| John | 45 | `40+` |

A person aged exactly 30 would land in `<30`, not `30-40`. This detail matters whenever an age falls on a boundary.

`np.where(condition, value_if_true, value_if_false)` is the vectorised if/else: `np.where(df["spent"] > 1000, "high", "low")`. NaN > 1000 is False, so Priya gets "low", which may not be what you want. Handle missing values first.

**Where you'll meet it in real work:** turning a date of birth into an age, a timestamp into "hour of day", or a price into a "price band" before training a model (file 10).

**Common mistakes:**
- Forgetting that `df.drop(...)` and `df.rename(...)` **return a new DataFrame**. Without `df = ...` nothing changes.
- Making a feature from the label or from the future (data leakage, [file 10](10-data-science-workflow.md#13-data-leakage-preview)).

> **සිංහලෙන්:** පවතින තීරු වලින් අලුත් තීරු හදන එකට feature engineering කියනවා. df["spent"] / 300 කියලා රුපියල් ඩොලර් බවට හරවන්න පුළුවන්. pd.cut වලින් වයස් කාණ්ඩ වලට බෙදනවා, ඒත් bin එකේ දකුණු පැත්ත ඇතුළත් වෙනවා, ඒ නිසා හරියටම 30ක් ඉන්න කෙනා "<30" කාණ්ඩයට වැටෙනවා. np.where කියන්නේ එක පාරටම හැම පේළියකටම if/else කරන එක. df.drop() වගේ දේවල් අලුත් DataFrame එකක් දෙන නිසා ඒක df = ... කියලා ආයෙත් ගන්න අමතක කරන්න එපා.

---

## 15. Sorting, counting, unique values

**Why it exists:** sorting shows you the extremes (biggest customers, slowest orders) and counting shows you how common each category is, which is crucial before training a classifier.

```python
df.sort_values("age")                          # ascending
df.sort_values("age", ascending=False)         # descending
df.sort_values(["city", "age"])                # by city, then age
df.nlargest(2, "total_spent")                  # top 2

df["city"].value_counts()                      # count each category
# Colombo    2
# Kandy      1
# Galle      1
df["city"].value_counts(normalize=True)        # as proportions
df["city"].unique()                            # array of distinct values
df["city"].nunique()                           # how many distinct: 3
```

`value_counts()` is one of the most used commands in data science: use it to check class balance before training a classifier (file 13).

### Worked example: class balance

A bank has 1,000 past loans. `df["status"].value_counts()` shows `repaid 950`, `defaulted 50`. With `normalize=True` this is **0.95** and **0.05**.

A lazy model that always answers "repaid" is right 950 times out of 1,000, so its **accuracy is 95%**, yet it catches **zero** defaulters. This is why `value_counts()` comes before training: with 95/5 data, accuracy alone is a trap and you need precision, recall and F1 ([file 13](13-evaluation-metrics-and-tuning.md)). It is the same lesson as the base-rate fallacy in [file 07](07-math-probability-statistics.md#9-bayes-theorem).

```python
df["status"].value_counts(normalize=True)     # repaid 0.95, defaulted 0.05
df.sort_values("amount", ascending=False).head(3)    # three biggest loans
df["status"].nunique()                        # 2 distinct values
```

**Exam angle (evaluation):** class imbalance questions: "99% of transactions are normal; a model has 99% accuracy. Is it good?" Not necessarily. It may predict "normal" every time. Look at recall on the rare class.

**Common mistakes:**
- Expecting `sort_values` to sort in place. It returns a sorted copy; assign it back or use the result directly.
- Forgetting that `nunique()` ignores NaN unless you pass `dropna=False`.

> **සිංහලෙන්:** value_counts() කියන්නේ හැම අගයක්ම කී පාරක් තියෙනවද කියලා ගණන් කරන එක. බැංකුවක ණය 1,000කින් 950ක් ආපහු ගෙවලා, 50ක් ගෙවලා නැත්නම්, හැමෝම "ගෙවනවා" කියලා කියන model එකක accuracy 95%ක්, ඒත් ණය නොගෙවන කෙනෙක් එක්කෙනෙක්වත් අල්ලන්නේ නෑ. ඒ නිසා model එකක් train කරන්න කලින් value_counts(normalize=True) බලලා class balance එක දැනගන්න ඕනේ. sort_values කළාම අලුත් sorted එකක් ලැබෙනවා, මුල් එක වෙනස් වෙන්නේ නෑ.

---

## 16. Missing values

**Why it exists:** real data has holes (a customer who skipped a field, a sensor that failed). Many models crash or silently give wrong answers if they meet NaN, so you must decide what to do about each hole.

Real data always has missing values. Options:

```python
df.isna().sum()                  # count missing per column
df.dropna()                      # drop rows with ANY missing value
df.dropna(subset=["total_spent"])  # drop only if this column is missing
df["total_spent"].fillna(0)      # fill with a constant
df["total_spent"].fillna(df["total_spent"].median())   # fill with the median
df["city"].fillna("Unknown")
df["value"].ffill()              # forward fill: copy the previous value (time series)
df["value"].interpolate()        # estimate between neighbours
```

**Which to choose?** It depends on *why* data is missing. Covered properly in [file 10](10-data-science-workflow.md). Quick rules:
- Few rows missing, at random → drop them
- Numeric column → fill with the median (robust to outliers)
- Categorical → fill with the mode or "Unknown"
- Missingness itself might be informative → add a column `was_missing = df["x"].isna()`

### Worked example: fill with the median

`spent` = [1250.0, 430.5, 2100.0, NaN]. The known values are 430.5, 1250, 2100.

- Mean of known = 3,780.5 / 3 = 1,260.17
- Median of known = **1,250**
- Fill the NaN with the median: [1250.0, 430.5, 2100.0, **1250.0**]

Both choices look similar here, but with one huge spender (say Rs. 90,000) the mean would jump while the median would barely move. That is why the median is the safer default (see [file 07](07-math-probability-statistics.md#2-measures-of-centre)).

### Why is it missing?

| Type | Meaning | Example | Safe action |
|---|---|---|---|
| Missing completely at random | no pattern | a sensor glitch | drop or fill |
| Missing at random | depends on other columns | young users skip "income" | fill using related columns |
| Missing not at random | depends on the value itself | high earners hide income | missingness is informative; add a flag column |

### Fill using train data only

If you compute the median on the **whole** dataset before splitting into train and test, information from test rows leaks into training. Compute it on the training part and reuse that number for the test part ([file 10](10-data-science-workflow.md#13-data-leakage-preview)).

**Common mistakes:**
- Filling with 0 when 0 is a real value. A missing "number of loans" is not the same as "zero loans".
- Calling `dropna()` with no arguments on a wide table where every row has at least one gap. You may delete almost everything. Check `df.shape` before and after.

> **සිංහලෙන්:** හැම data set එකකම හිස් තැන් තියෙනවා. spent = [1250, 430.5, 2100, NaN] නම්, හිස් තැනට මධ්‍යස්ථය (median) 1,250 දැම්මා නම් ඒක හොඳ තෝරාගැනීමක්, මොකද එක්කෙනෙක් රුපියල් 90,000ක් වියදම් කළත් median එක ලොකුවට වෙනස් වෙන්නේ නෑ. ඇයි හිස්ද කියලත් බලන්න ඕනේ, සමහර වෙලාවට හිස් වීම ම තොරතුරක්. Fill කරන අගය train data වලින් විතරක් ගණනය කරන්න, නැත්නම් test data වල තොරතුරු කාන්දු වෙනවා. 0 කියන්නේ සැබෑ අගයක් නම් හිස් තැනට 0 දාන්න එපා.

---

## 17. Grouping and aggregating

**Why it exists:** the interesting question is rarely about one row. It is "how much per region?", "average age per city?", "which product earns most?". `groupby` answers all of those the same way.

`groupby` = SQL's GROUP BY ([file 03](03-developer-tools.md#7-sql-filtering-sorting-aggregating)). The pattern is **split → apply → combine**:

```
split by city       apply mean        combine
Colombo: 34, 45  →  39.5          ┐
Kandy:   28      →  28.0          ├→  a table of results
Galle:   31      →  31.0          ┘
```

```python
df.groupby("city")["age"].mean()
df.groupby("city")["total_spent"].sum()
df.groupby("city").size()                       # count rows per group

# several aggregations at once, with nice names
df.groupby("city").agg(
    n_customers=("name", "count"),
    avg_age=("age", "mean"),
    total=("total_spent", "sum"),
).reset_index()

# group by two columns
sales.groupby(["region", "product"])["revenue"].sum()

# transform: put the group result back on every row (like a SQL window function)
df["city_avg_age"] = df.groupby("city")["age"].transform("mean")
```

### Worked example: step by step on the 4-row table

```python
df.groupby("city").agg(n=("name", "count"), avg_age=("age", "mean"), total=("spent", "sum"))
```

1. **Split** rows by city: Colombo = {Amal, John}, Kandy = {Nisha}, Galle = {Priya}
2. **Apply** each function inside each group: Colombo avg_age = (34 + 45) / 2 = 39.5, total = 1250 + 2100 = 3350
3. **Combine** into one table:

| city | n | avg_age | total |
|---|---|---|---|
| Colombo | 2 | 39.5 | 3350.0 |
| Galle | 1 | 31.0 | 0.0 |
| Kandy | 1 | 28.0 | 430.5 |

Notice Galle's total is **0.0**, not NaN: `sum` skips missing values and the sum of nothing is 0. That can mislead you into thinking Priya spent nothing, when in fact the value is unknown.

**Where you'll meet it in real work:** a telecom computes average data usage per plan, an online shop totals revenue per category (like the Keells example: vegetables, dairy, biscuits), and an ML engineer computes "average purchase per customer" as a new feature using `transform`.

**Common mistakes:**
- Forgetting `.reset_index()` and then being surprised that the group names are in the index instead of a column.
- Averaging group averages. The mean of the city means is not the overall mean when groups have different sizes.

> **සිංහලෙන්:** groupby කියන්නේ split, apply, combine: පළමුව පේළි කාණ්ඩ වලට බෙදනවා, ඊළඟට හැම කාණ්ඩයකටම ගණනයක් කරනවා, අන්තිමට ප්‍රතිඵල එක වගුවකට එකතු කරනවා. නගරය අනුව බෙදුවොත් Colombo ට Amal (34) සහ John (45) යන දෙන්නා වැටෙනවා, සාමාන්‍ය වයස (34 + 45) / 2 = 39.5. Galle වල Priya ගේ spent හිස් නිසා sum එක 0 පෙනුනත්, ඇත්තටම ඒක නොදන්නා අගයක්, ඒ ගැන පරිස්සම් වෙන්න. SQL වල GROUP BY එකට මේක සමානයි.

---

## 18. Joining tables

**Why it exists:** related information is usually split across tables (customers in one, orders in another) to avoid repeating it. To analyse it together you join the tables on a shared key.

### merge: like SQL JOIN ([file 03](03-developer-tools.md#8-sql-joins))

```python
customers = pd.DataFrame({"customer_id": [1, 2, 3, 4],
                          "name": ["Amal", "Nisha", "John", "Priya"]})
orders = pd.DataFrame({"order_id": [101, 102, 103, 104],
                       "customer_id": [1, 1, 2, 3],
                       "amount": [50, 20, 75.5, 10]})

pd.merge(orders, customers, on="customer_id", how="inner")   # only matches
pd.merge(customers, orders, on="customer_id", how="left")    # keep all customers (Priya gets NaN)
pd.merge(a, b, left_on="cust_id", right_on="customer_id")    # different column names
```

`how` can be `"inner"`, `"left"`, `"right"`, `"outer"`.

⚠️ **Check row counts after merging.** If the key isn't unique on one side, rows get duplicated. This is a classic bug.

```python
before = len(orders)
merged = orders.merge(customers, on="customer_id", how="left")
assert len(merged) == before, "merge duplicated rows!"
```

### concat: stack tables

```python
pd.concat([df_jan, df_feb, df_mar])            # stack rows (same columns)
pd.concat([df_a, df_b], axis=1)                # side by side
```

### Worked example: counting rows

Using the `customers` (4 rows) and `orders` (4 rows) tables above:

| Join | Rows in result | Why |
|---|---|---|
| `inner` | 4 | every order has a matching customer (Amal x2, Nisha x1, John x1); Priya has no orders and is dropped |
| `left` from orders | 4 | all orders kept |
| `left` from customers | **5** | Amal appears twice (two orders), Priya appears once with NaN order data |

The last row count (5) is bigger than the number of customers (4). That is **correct** here, because one customer can have many orders (a one-to-many join). It is a **bug** only when you expected one row per customer.

```
customers            orders              left join from customers
id name              id order amt        id name   order  amt
1  Amal              1  101   50         1  Amal   101    50
2  Nisha             1  102   20         1  Amal   102    20
3  John              2  103   75.5       2  Nisha  103    75.5
4  Priya             3  104   10         3  John   104    10
                                         4  Priya  NaN    NaN
```

**Where you'll meet it in real work:** joining a transactions table to a customer table before a fraud model, and attaching metadata (author, date) to text chunks in a RAG pipeline.

**Common mistakes:**
- Not checking row counts after a merge. The `assert len(merged) == before` guard in the section catches it.
- Joining on columns with different types, such as `"1"` (text) and `1` (number). Nothing matches. Check `dtypes` first.
- Using `inner` when you wanted to keep unmatched rows, and silently losing customers.

> **සිංහලෙන්:** Merge කියන්නේ SQL වල JOIN එක වගේ, පොදු key එකක් (customer_id) අනුව වගු දෙකක් එකතු කරන එක. inner කළොත් දෙපැත්තේම ගැළපෙන පේළි විතරයි, left කළොත් වම් වගුවේ හැම පේළියක්ම තියෙනවා. customers 4යි, orders 4යි, Amal ට orders දෙකක් තියෙන නිසා customers වලින් left join කළාම පේළි 5ක් එනවා, Priya ට order නැති නිසා NaN. හැම merge එකකටම පස්සේ පේළි ගාණ බලන්න, අපේක්ෂා නොකරපු විදියට වැඩි වුණා නම් key එක duplicate වෙලා.

---

## 19. Reshaping: pivot and melt

**Why it exists:** the same table can be written "tall" (one row per fact) or "wide" (one column per category). Charts, models and spreadsheets each prefer one shape, so you need to convert between them.

### Long vs wide format

**Long** (one row per observation):

| date | product | sales |
|---|---|---|
| Mon | A | 10 |
| Mon | B | 5 |
| Tue | A | 12 |
| Tue | B | 7 |

**Wide** (one row per date, one column per product):

| date | A | B |
|---|---|---|
| Mon | 10 | 5 |
| Tue | 12 | 7 |

```python
wide = long.pivot_table(index="date", columns="product", values="sales", aggfunc="sum")
long_again = wide.reset_index().melt(id_vars="date", var_name="product", value_name="sales")

pd.crosstab(df["city"], df["age_group"])       # counts table (contingency table, file 07)
```

Plotting libraries often want long format; humans and spreadsheets prefer wide.

### Worked example: duplicates and the aggregation

If Monday product A is recorded twice in the long table (10 and 4):

| date | product | sales |
|---|---|---|
| Mon | A | 10 |
| Mon | A | 4 |
| Mon | B | 5 |

`pivot_table(..., aggfunc="sum")` makes Mon/A = **14**. With `aggfunc="mean"` it is **7**. The plain `pivot()` function would raise an error here, because it does not know what to do with two values for the same cell. That is why `pivot_table` with an `aggfunc` is the safer default.

`melt` is the reverse: it unpivots wide back to long. A column like `A`, `B` becomes values in a `product` column.

**Where you'll meet it in real work:** a recommender system stores ratings as a wide matrix (users as rows, films as columns, mostly empty), while a plotting library like Seaborn wants the long version.

**Common mistakes:**
- Using `pivot` when duplicates exist.
- Forgetting `.reset_index()` after a pivot, leaving the row labels hidden in the index.

> **සිංහලෙන්:** Long format කියන්නේ එක පේළියකට එක කරුණක්, wide format කියන්නේ කාණ්ඩයකට එක තීරුවක්. pivot_table වලින් long වගුවක් wide කරනවා, melt වලින් ආපහු long කරනවා. සඳුදා A භාණ්ඩය දෙපාරක් (10 සහ 4) සටහන් වෙලා තියෙනවා නම් aggfunc="sum" දුන්නාම 14, "mean" දුන්නාම 7 ලැබෙනවා. එකම කොටුවට අගයන් දෙකක් එන විට සාමාන්‍ය pivot() අසමත් වෙනවා, ඒ නිසා pivot_table + aggfunc සුරක්ෂිතයි. Chart හදද්දි බොහෝවිට long format එක ඕනේ.

---

## 20. Text and date columns

**Why it exists:** a lot of real data is text (names, reviews, chats) or dates (orders, logins). Text and dates need their own tools, because "March" is not a number and "10/02/2026" could be two different days.

### Text: the `.str` accessor

```python
s = df["name"]
s.str.lower()
s.str.strip()
s.str.contains("am", case=False)
s.str.replace("-", " ")
s.str.split(" ").str[0]          # first word
s.str.len()
df["email"].str.extract(r"@(.+)$")   # regular expression: get the domain
```

**Regular expressions (regex):** a mini-language for text patterns. `\d` = digit, `\w` = letter/digit, `+` = one or more, `.` = any character, `^`/`$` = start/end. Example: `r"\d{3}-\d{4}"` matches "555-1234". Useful for cleaning text (file 18).

### Dates: the `.dt` accessor

```python
df["date"] = pd.to_datetime(df["date"])          # text → datetime
df["year"] = df["date"].dt.year
df["month"] = df["date"].dt.month
df["weekday"] = df["date"].dt.day_name()         # "Monday"
df["is_weekend"] = df["date"].dt.dayofweek >= 5
df["days_since"] = (pd.Timestamp("2026-01-01") - df["date"]).dt.days

# time series: set a date index and resample
ts = df.set_index("date")["sales"]
ts.resample("W").sum()          # weekly totals
ts.resample("M").mean()         # monthly averages
ts.rolling(7).mean()            # 7-day moving average
ts.shift(1)                     # previous day's value (a "lag")
ts.pct_change()                 # % change from previous row
```

These date features are very useful for ML models (file 10).

### Worked example: dates

```python
pd.to_datetime("03/04/2026")                  # read month first by default → 4 March 2026
pd.to_datetime("03/04/2026", dayfirst=True)   # day first, as in Sri Lanka → 3 April 2026
```

Be explicit about the format. Sri Lanka writes day/month/year, and Pandas assumes month first unless you say otherwise.

More date arithmetic: `pd.Timestamp("2026-01-01") - pd.Timestamp("2025-12-25")` is **7 days**. `dt.dayofweek` counts Monday as 0, so `>= 5` means Saturday or Sunday.

**Rolling averages by hand:** daily sales [10, 12, 14, 20] with `rolling(3).mean()` gives `[NaN, NaN, 12.0, 15.33]`. The first two rows have no complete window. The value 12.0 is (10 + 12 + 14) / 3, and 15.33 is (12 + 14 + 20) / 3. A rolling mean smooths out daily noise.

`shift(1)` moves values down one row, giving "yesterday's value" on today's row. This is a **lag feature** for forecasting. Use `shift` (past values), never `shift(-1)` (future values), when building features, otherwise the model peeks at the answer.

**Where you'll meet it in real work:** cleaning customer names, extracting the domain from emails, and building "day of week" and "is_weekend" features for a demand forecast. Text cleaning is also the first step before tokenisation for language models (file 18).

**Common mistakes:**
- Sorting dates stored as text. "10/02/2026" sorts before "9/02/2026" alphabetically. Convert to datetime first.
- Leaking the future into lag features.

> **සිංහලෙන්:** Text තීරුවලට .str, දිනයන් තීරුවලට .dt පාවිච්චි කරනවා. "03/04/2026" කියන්නේ අප්‍රේල් 3ද මාර්තු 4ද? ශ්‍රී ලංකාවේ දිනය/මාසය/අවුරුද්ද නිසා pd.to_datetime(..., dayfirst=True) කියලා පැහැදිලිව කියන්න. rolling(3).mean() කියන්නේ අන්තිම දවස් 3ක සාමාන්‍යය, [10, 12, 14] වලින් (10 + 12 + 14) / 3 = 12. shift(1) කියන්නේ ඊයේ අගය අද පේළියට ගේන එක. අනාගත අගයක් (shift(-1)) feature එකක් විදියට දැම්මොත් model එක උත්තරේ බලලා වැඩ කරනවා වගේ, ඒක data leakage.

---

## 21. Apply, map, and performance

**Why it exists:** sometimes a built-in vectorised operation does not exist for what you need, so you apply your own function. But there is a speed price, and knowing it saves hours.

```python
df["age"].apply(lambda x: x + 1)                  # function on each value
df["city"].map({"Colombo": "W", "Kandy": "C", "Galle": "S"})   # replace via dict
df.apply(lambda row: row["age"] * 2, axis=1)      # function on each ROW (slow!)
```

**Performance rules:**
1. **Prefer vectorised operations** (`df["a"] * 2`) over `apply`, and `apply` over Python loops. Vectorised is often 100× faster.
2. **Never loop over rows** with `for i in range(len(df))` unless you have no choice.
3. Use the `category` dtype for repeated strings: `df["city"] = df["city"].astype("category")` (less memory).
4. Read only needed columns: `pd.read_csv("big.csv", usecols=["a", "b"])`.
5. Use Parquet instead of CSV for big data.
6. **Method chaining** keeps code readable:

```python
result = (
    df
    .dropna(subset=["total_spent"])
    .query("age > 25")
    .groupby("city", as_index=False)
    .agg(total=("total_spent", "sum"))
    .sort_values("total", ascending=False)
)
```

### Worked example: three ways to double a column

| Way | Code | Speed |
|---|---|---|
| Vectorised | `df["a"] * 2` | fastest |
| `apply` on values | `df["a"].apply(lambda x: x * 2)` | slower: a Python call per row |
| `apply` on rows | `df.apply(lambda r: r["a"] * 2, axis=1)` | slowest: builds a Series per row |

All three give the same answer. On a few thousand rows you won't notice. On millions of rows the vectorised line can be tens or hundreds of times faster, so check whether a vectorised version exists first.

**`map` with a dictionary:** `df["city"].map({"Colombo": "W", "Kandy": "C"})` turns Galle into **NaN** because "Galle" is not in the dictionary. Include every key, or add `.fillna("Other")`.

**Where you'll meet it in real work:** cleaning text with a custom function, or converting codes to labels. If a dataset has 10 million rows, a careless `apply(axis=1)` can turn a one-second job into a half-hour job.

**Common mistakes:**
- Reaching for `apply` first, out of habit from Python loops.
- Forgetting that `map` returns NaN for keys that are not in the mapping.

> **සිංහලෙන්:** Pandas වල වේගවත්ම ක්‍රමය vectorised operation: df["a"] * 2. apply කියන්නේ හැම පේළියකටම Python function එකක් අමතන එක, ඒක ගොඩක් මන්දගාමියි, විශේෂයෙන් axis=1 (පේළි වශයෙන්) දුන්නොත්. පේළි දහසක් විතර නම් වෙනසක් දැනෙන්නේ නෑ, ඒත් මිලියන ගණන් නම් තත්පර 1ක වැඩේ විනාඩි ගාණක් වෙන්න පුළුවන්. map({"Colombo": "W"}) කළාම dictionary එකේ නැති අගයන්ට (Galle) NaN එනවා, ඒ නිසා හැම key එකක්ම දාන්න.

---

## 22. Polars and big data

**Why it exists:** Pandas works great until the data no longer fits in memory or one CPU core is too slow. Other tools exist for those cases, and knowing they exist saves you from forcing Pandas to do the impossible.

Pandas loads everything into memory and mostly uses one CPU core. For bigger data:

| Tool | What it is | When |
|---|---|---|
| **Polars** | Modern DataFrame library written in Rust; multi-core; "lazy" query optimisation | Data from ~1 GB to tens of GB on one machine; when Pandas is slow |
| **DuckDB** | SQL database that runs inside Python, super fast on files | Querying big CSV/Parquet with SQL |
| **Dask** | Splits Pandas-like work across cores/machines | Bigger than memory |
| **Apache Spark (PySpark)** | Distributed processing on clusters | Terabytes; big companies |
| **cuDF (NVIDIA RAPIDS)** | Pandas-like DataFrames on the GPU | Big data with a GPU; `cudf.pandas` can speed up existing Pandas code |

```python
import polars as pl
df = pl.read_csv("sales.csv")
(df.filter(pl.col("age") > 30)
   .group_by("city")
   .agg(pl.col("spent").sum().alias("total"))
   .sort("total", descending=True))
```

Learn Pandas first (most jobs and tutorials use it), then pick up Polars.

### Which tool for how much data?

```
data size     <1 GB            1 GB - tens of GB          bigger than RAM        terabytes
              │                │                          │                      │
tool          Pandas           Polars / DuckDB            Dask                   Spark
              (learn first)    (fast on one machine)      (parallel Pandas)      (a cluster)
              ─────────── plus cuDF when you have an NVIDIA GPU ───────────
```

A rough rule of thumb: Pandas needs several times the file's size in RAM while working, so a 5 GB CSV can need 15 GB or more of memory.

**DuckDB example** (SQL straight on a file, nothing to load first):

```python
import duckdb
duckdb.sql("SELECT city, SUM(spent) AS total FROM 'sales.parquet' GROUP BY city")
```

**Exam angle (NVIDIA stack):** **RAPIDS cuDF** runs DataFrame operations on the GPU, and the `cudf.pandas` accelerator lets existing Pandas code run on the GPU with no code changes. NVIDIA's **NeMo Curator** uses GPU data processing to clean and deduplicate the huge text collections used to train LLMs. If a question asks how to speed up Pandas-style preprocessing on an NVIDIA GPU, the answer is RAPIDS cuDF.

**Common mistakes:**
- Moving to Spark for a 2 GB file. The set-up overhead is bigger than the saving.
- Skipping Pandas and starting with Polars as a beginner. Most tutorials, Stack Overflow answers and jobs still use Pandas.

> **සිංහලෙන්:** Pandas හොඳ ඒත් සියලු data මතකයට ගන්නවා, CPU core එකක් විතරක් පාවිච්චි කරනවා. Data 1GB ඉක්මවන්න ගියාම Polars හෝ DuckDB හොඳයි. RAM එකට නොපිරෙන ලොකු data වලට Dask, ටෙරාබයිට් ගාණකට Spark. NVIDIA GPU එකක් තියෙනවා නම් RAPIDS cuDF වලින් Pandas වගේ වැඩේම GPU එකේ කරන්න පුළුවන්, cudf.pandas දැම්මාම පරණ Pandas code වෙනස් නොකරත් වේගවත් වෙනවා. ඒත් 2GB file එකකට Spark පාවිච්චි කරන්න එපා, ඒක ඕනවට වඩා බරයි.

---

## 23. Mini project

**Why it exists:** reading about `groupby` and `merge` is not the same as using them. The Titanic dataset is small, well known and messy in the way real data is, so it is the standard practice ground.

Download the **Titanic** dataset (`https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv`). Answer with Pandas:

1. How many rows and columns? Which columns have missing values?
2. What % of passengers survived?
3. Survival rate by sex. By passenger class (`Pclass`).
4. Average age of survivors vs non-survivors.
5. Fill missing `Age` with the median age **of each passenger class**.
6. Create `family_size = SibSp + Parch + 1`. Survival rate by family size.

<details><summary>Hints / solution sketch</summary>

```python
import pandas as pd
df = pd.read_csv("https://raw.githubusercontent.com/datasciencedojo/datasets/master/titanic.csv")
print(df.shape); print(df.isna().sum())
print(df["Survived"].mean())                         # ≈ 0.38
print(df.groupby("Sex")["Survived"].mean())          # female ≈ 0.74, male ≈ 0.19
print(df.groupby("Pclass")["Survived"].mean())       # 1st ≈ 0.63, 3rd ≈ 0.24
print(df.groupby("Survived")["Age"].mean())
df["Age"] = df["Age"].fillna(df.groupby("Pclass")["Age"].transform("median"))
df["family_size"] = df["SibSp"] + df["Parch"] + 1
print(df.groupby("family_size")["Survived"].agg(["mean", "count"]))
```
</details>

### What to expect (so you can check yourself)

- The file has **891 rows and 12 columns**.
- Missing values: `Age` is missing in 177 rows, `Cabin` in 687 and `Embarked` in 2. Cabin is missing so often that most analysts drop the column.
- Overall survival is about 38%. Women survived far more often than men, and first class more often than third. These are patterns in the historical data, not rules of nature, and the "why" involves other factors (priority for lifeboats, location on the ship). Remember [correlation is not causation](07-math-probability-statistics.md#15-correlation-is-not-causation).

### A good working order

1. Look first (`shape`, `info`, `isna().sum()`).
2. Answer each question with **one** chained expression, and print the result.
3. Sanity-check numbers: survival rates by group must be between 0 and 1, and group sizes (`size()`) must add up to 891.
4. Only then fill missing ages, using the group median so one class's older passengers don't affect another's.

### Stretch tasks

- Compute survival rate by sex **and** class together with `groupby(["Sex", "Pclass"])`.
- Show the same table with `pivot_table(index="Sex", columns="Pclass", values="Survived", aggfunc="mean")`.
- Save the cleaned result to Parquet and compare the file size with the CSV.

**Common mistakes:**
- Filling `Age` with the overall mean before looking at class differences.
- Reporting a survival rate for a tiny group (for example family size 11) without showing the count. Always print `count` next to `mean`.

> **සිංහලෙන්:** Titanic data set එක කුඩා, ප්‍රසිද්ධ, ඒ වගේම ඇත්ත ලෝකයේ data වගේ අවුල් සහිත, ඒ නිසා Pandas පුරුදු වෙන්න ඉතා හොඳයි. එයින් පේළි 891ක්, තීරු 12ක් තියෙනවා, Age පේළි 177කට නැතුව තියෙනවා. මුලින් data එක දිහා බලලා, ප්‍රශ්නයක් එකකට එක expression එකක් ලියලා, ප්‍රතිඵලවල සාධාරණත්වය පරීක්ෂා කරන්න. අඩු සාමාන්‍යයක් පෙන්වද්දි ඒ කණ්ඩායමේ ගණනත් එක්කම පෙන්වන්න. ගැහැණු වැඩිපුර බේරුණා කියන්නේ ගැහැණු වීම ඒකට හේතුව කියන එකක් නෙවෙයි, ඒක correlation එකක් විතරයි.

```quiz
[{"q": "A sales array has shape (3, 4): 3 shops by 4 weeks. What does sales.sum(axis=1) return?", "options": ["4 numbers, one total per week", "12 numbers, unchanged", "1 number, the grand total", "3 numbers, one total per shop"], "answer": 3, "why": "axis=1 collapses the columns (weeks), leaving one value per row (shop), so the shape is (3,). Choosing 4 numbers is the axis=0 result, the most common mix-up."}, {"q": "scores = np.array([45, 82, 67, 91, 38, 74]). What does (scores >= 50).mean() return?", "options": ["4", "74", "True", "0.667"], "answer": 3, "why": "The comparison gives booleans, which count as 1 and 0. Four of six are True, so the mean is 4/6 = 0.667. The value 4 would be (scores >= 50).sum()."}, {"q": "Which pair of shapes can NumPy broadcast together?", "options": ["(2, 3) and (2,)", "(2, 3) and (4,)", "(2, 3) and (3,)", "(2, 3) and (2, 2)"], "answer": 2, "why": "Shapes are compared from the right: 3 matches 3. In (2, 3) with (2,), the last sizes are 3 and 2, which do not match and are not 1, so it fails."}, {"q": "After df = df.sort_values('age'), what is the difference between df.loc[0] and df.iloc[0]?", "options": ["There is none; both return the first row", "loc[0] is the row labelled 0 and iloc[0] is the first row by position", "iloc[0] is the row labelled 0 and loc[0] is the first row by position", "loc fails after sorting"], "answer": 1, "why": "Labels travel with the rows when you sort, so the label 0 may now be anywhere. iloc always counts positions from the top. The reversed description swaps the two."}, {"q": "A 7-billion-parameter model is stored in float16 (2 bytes per number). About how much memory do the weights need?", "options": ["7 GB", "28 GB", "14 GB", "56 GB"], "answer": 2, "why": "7 x 10^9 numbers x 2 bytes = 14 x 10^9 bytes = 14 GB. 28 GB is what float32 (4 bytes) would need. This ignores extra memory for activations and the KV cache."}, {"q": "You left-merge customers (4 rows) with orders and get 5 rows. Which explanation is most likely?", "options": ["A customer has more than one order, so the customer row repeats", "Pandas has a bug", "The merge used the wrong join type", "Missing values created new rows"], "answer": 0, "why": "A one-to-many relationship repeats the left row once per match. It is correct here, but it is a bug if you expected one row per customer. Check len() before and after merging."}, {"q": "bins=[0, 30, 40, 100] with pd.cut. Which bin does an age of exactly 30 fall into?", "options": ["The first bin (0, 30]", "The second bin (30, 40]", "Neither; it becomes NaN", "A bin of its own"], "answer": 0, "why": "pd.cut bins are right-inclusive by default, so (0, 30] contains 30. Many people assume the upper edge belongs to the next bin."}, {"q": "A fraud dataset has 99% normal and 1% fraud rows. A model that always predicts 'normal' has what accuracy, and what does value_counts(normalize=True) teach you?", "options": ["50%; classes are always balanced", "1%; fraud is rare", "100%; nothing to learn", "99%; accuracy can look excellent while catching no fraud"], "answer": 3, "why": "Always predicting the majority class is right 99% of the time yet finds zero frauds. Checking class balance first warns you to use recall, precision or F1 instead of plain accuracy."}]
```

---

## 24. Check yourself

**Q1.** Array `M` has shape (100, 5). What shape does `M.mean(axis=0)` have? `M.mean(axis=1)`?
<details><summary>Answer</summary>(5,): one mean per column. (100,): one mean per row.</details>

**Q2.** How do you select values greater than 0 from NumPy array `a`?
<details><summary>Answer</summary>`a[a > 0]`</details>

**Q3.** Difference between `df.loc[0:2]` and `df.iloc[0:2]`?
<details><summary>Answer</summary>`loc` uses labels and includes the end (rows labelled 0, 1, 2). `iloc` uses positions and excludes the end (positions 0, 1).</details>

**Q4.** Write Pandas code to get the total `amount` per `region`, sorted largest first.
<details><summary>Answer</summary>`df.groupby("region")["amount"].sum().sort_values(ascending=False)`</details>

**Q5.** Filter rows where `age > 30` AND `city == "Kandy"`. What's the common mistake?
<details><summary>Answer</summary>`df[(df["age"] > 30) & (df["city"] == "Kandy")]`. Common mistakes: using `and` instead of `&`, or forgetting the brackets around each condition.</details>

**Q6.** After a left merge, your table has more rows than the left table. Why?
<details><summary>Answer</summary>The join key is duplicated in the right table, so some left rows matched multiple right rows.</details>

**Q7.** Why set a random seed?
<details><summary>Answer</summary>So "random" operations give the same results every run, making experiments reproducible.</details>

**Q8.** You need a column with each customer's city average spend on every row. Which method?
<details><summary>Answer</summary>`df.groupby("city")["spent"].transform("mean")`</details>

**Q9.** `x` has shape (3,) and `M` has shape (2, 3). What is the shape of `M + x`, and what happens with `M + np.array([1, 2])`?
<details><summary>Answer</summary>`M + x` works and has shape (2, 3), since x is stretched over both rows. `M + np.array([1, 2])` raises an error: the last sizes, 3 and 2, do not match and neither is 1.</details>

**Q10.** The daily sales are [10, 12, 14, 20]. What does `rolling(3).mean()` return?
<details><summary>Answer</summary>`[NaN, NaN, 12.0, 15.33]`. The first two rows have no complete window of 3. Then (10 + 12 + 14) / 3 = 12 and (12 + 14 + 20) / 3 = 15.33.</details>

---

## 25. New words in this file

| Word | Meaning |
|---|---|
| NumPy, array (ndarray) | Library for fast numeric arrays / its grid-of-numbers type |
| Vectorisation | Operating on whole arrays without Python loops |
| `shape`, `ndim`, `size`, `dtype` | Array dimensions, number of axes, element count, element type |
| `float32` / `float64` / `object` dtype | 32/64-bit decimals / mixed Python objects |
| Boolean mask | True/False array used to filter |
| `&`, `\|`, `~` | Element-wise AND, OR, NOT |
| Fancy indexing | Selecting with a list of positions |
| View vs copy | Shares memory with original / independent |
| `axis` | Dimension to collapse in an aggregation |
| `reshape`, `flatten`, `newaxis`, `squeeze`, `concatenate`, `stack` | Changing/combining array shapes |
| Seed, pseudo-random | Start value making randomness repeatable |
| Pandas | Library for tables in Python |
| Series / DataFrame | One labelled column / a table |
| Index | Row labels |
| NaN | Missing value marker |
| `read_csv`, `to_csv`, `read_parquet`... | Load/save data |
| `head`, `info`, `describe`, `value_counts`, `isna` | First-look commands |
| `loc` / `iloc` | Select by label / by position |
| `query` | Filter with a SQL-like string |
| `pd.cut` | Bin numbers into ranges |
| `np.where` | Vectorised if/else |
| SettingWithCopyWarning | Warning about modifying a possible copy |
| `fillna`, `dropna`, `ffill`, `interpolate` | Handle missing values |
| `groupby`, split-apply-combine, `agg`, `transform` | Grouped calculations |
| `merge` / `concat` | Join tables on keys / stack tables |
| Long vs wide format | One row per observation / one column per category |
| `pivot_table`, `melt`, `crosstab` | Reshape wide/long, count table |
| `.str` / `.dt` accessors | Text / date methods for columns |
| Regular expression (regex) | Pattern language for text |
| `resample`, `rolling`, `shift`, `pct_change` | Time-series helpers |
| Lag | Previous time step's value |
| `apply`, `map` | Apply a function / dict mapping to values |
| `category` dtype | Memory-efficient repeated strings |
| Method chaining | Writing steps as `.a().b().c()` |
| Polars, DuckDB, Dask, Spark, cuDF | Tools for bigger or faster data processing |
| Row-major order | NumPy fills new shapes row by row |
| `keepdims` | Keep the collapsed axis with size 1 so broadcasting still works |
| One-to-many join | One row on the left matches several on the right, so left rows repeat |
| Lag feature | A column holding an earlier row's value (`shift(1)`), used in forecasting |
| Parquet | Compact column-based file format that keeps data types |

**Next:** [09-data-visualization.md](09-data-visualization.md)
