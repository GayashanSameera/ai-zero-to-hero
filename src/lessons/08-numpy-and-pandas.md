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

---

## 2. Creating arrays

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

---

## 3. Array attributes

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

---

## 4. Indexing, slicing, boolean masks

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

---

## 5. Vectorised maths and broadcasting

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

---

## 6. Aggregations and the axis argument

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

---

## 7. Reshaping and combining

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

---

## 8. Random numbers

```python
rng = np.random.default_rng(seed=42)   # a seed makes "random" results repeatable
rng.random(3)                # 3 uniform numbers in [0, 1)
rng.integers(1, 7, size=5)   # 5 dice rolls
rng.normal(loc=170, scale=10, size=1000)   # 1000 heights from a normal distribution
rng.choice(["a", "b", "c"], size=4)
rng.permutation(10)          # shuffled 0..9
```

**Seeds and reproducibility:** computers generate "pseudo-random" numbers from a starting **seed**. The same seed gives the same sequence, so your experiment gives the same results every time. Always set seeds in ML experiments (file 11).

---

# Pandas

## 9. Series and DataFrame

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

---

## 10. Loading and saving data

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

---

## 11. First look at a dataset

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

---

## 12. Selecting columns and rows

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

---

## 13. Filtering rows

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

---

## 14. Creating and changing columns

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

---

## 15. Sorting, counting, unique values

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

---

## 16. Missing values

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

---

## 17. Grouping and aggregating

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

---

## 18. Joining tables

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

---

## 19. Reshaping: pivot and melt

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

---

## 20. Text and date columns

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

---

## 21. Apply, map, and performance

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

---

## 22. Polars and big data

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

---

## 23. Mini project

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

**Next:** [09-data-visualization.md](09-data-visualization.md)
