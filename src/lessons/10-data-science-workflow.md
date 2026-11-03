# 10: The Data Science Workflow: Collect, Clean, Explore, Engineer

> **Before you start:** [01](01-big-picture-and-data.md) (data types, features, labels), [03](03-developer-tools.md) (SQL, APIs), [07](07-math-probability-statistics.md) (statistics, z-scores, skewness, correlation, mutual information), [08](08-numpy-and-pandas.md) (Pandas), [09](09-data-visualization.md) (charts).
>
> **After this file you can:** run a real data science project from question to insight: collect data, clean it, explore it (EDA), turn raw columns into good **features** for ML, analyse time series basics, and connect your work to business metrics.

> **Data scientists spend 60 to 80% of their time on the steps in this file.** Models are the easy part. Good data is the hard part.

---

## Table of contents

1. [The workflow (CRISP-DM)](#1-the-workflow-crisp-dm)
2. [Step 1: Ask a good question](#2-ask-a-good-question)
3. [Step 2: Collect data](#3-collect-data)
4. [Data quality problems](#4-data-quality-problems)
5. [Step 3: Clean data](#5-clean-data)
6. [Handling missing values properly](#6-handling-missing-values)
7. [Handling outliers](#7-handling-outliers)
8. [Step 4: Exploratory Data Analysis (EDA)](#8-exploratory-data-analysis-eda)
9. [Step 5: Feature engineering, encoding categories](#9-encoding-categorical-features)
10. [Feature engineering, scaling numbers](#10-scaling-numeric-features)
11. [Feature engineering, creating new features](#11-creating-new-features)
12. [Feature selection](#12-feature-selection)
13. [A warning: data leakage (preview)](#13-data-leakage-preview)
14. [Time series basics](#14-time-series-basics)
15. [Business metrics and KPIs](#15-business-metrics-and-kpis)
16. [End-to-end example](#16-end-to-end-example)
17. [Check yourself](#17-check-yourself)
18. [New words in this file](#18-new-words-in-this-file)

---

## 1. The workflow (CRISP-DM)

**CRISP-DM** (Cross-Industry Standard Process for Data Mining) is the classic project framework:

```
   ┌─────────────────────┐
   │ 1. Business          │◄────────────────┐
   │    understanding     │                 │
   └─────────┬───────────┘                 │
             ▼                              │
   ┌─────────────────────┐                 │
   │ 2. Data understanding│ (collect + EDA) │
   └─────────┬───────────┘                 │
             ▼                              │
   ┌─────────────────────┐                 │
   │ 3. Data preparation  │ (clean + features)
   └─────────┬───────────┘                 │
             ▼                              │
   ┌─────────────────────┐                 │
   │ 4. Modelling         │ (files 11-14)   │
   └─────────┬───────────┘                 │
             ▼                              │
   ┌─────────────────────┐                 │
   │ 5. Evaluation        │ (file 13) ──────┘ (often loop back)
   └─────────┬───────────┘
             ▼
   ┌─────────────────────┐
   │ 6. Deployment        │ (file 28)
   └─────────────────────┘
```

It's a **loop**, not a straight line. You'll often discover data problems while modelling and go back.

---

## 2. Ask a good question

Bad: "Analyse our customer data."
Good: "Which customers are likely to cancel their subscription in the next 30 days, so the retention team can call them?"

A good question is:
- **Specific:** what exactly are we predicting or measuring?
- **Actionable:** what decision will change based on the answer?
- **Measurable:** how will we know if we succeeded?

**Translate business questions into data tasks:**

| Business question | Data task | Type |
|---|---|---|
| Why did sales drop? | Analysis, breakdowns by segment | Descriptive / diagnostic |
| Which customers will churn? | Predict yes/no | Classification (file 12) |
| How much will we sell next month? | Predict a number | Regression / forecasting (files 12, 14) |
| What groups of customers do we have? | Find natural groups | Clustering (file 14) |
| Did the new feature help? | Compare A vs B | A/B test ([file 07](07-math-probability-statistics.md#20-ab-testing)) |

The four levels of analytics: **Descriptive** (what happened?) → **Diagnostic** (why?) → **Predictive** (what will happen?) → **Prescriptive** (what should we do?).

---

## 3. Collect data

### Sources

| Source | Examples | How |
|---|---|---|
| **Internal databases** | sales, users, transactions | SQL ([file 03](03-developer-tools.md#6-databases-and-sql-basics)) |
| **Files** | Excel reports, CSV exports, logs | Pandas ([file 08](08-numpy-and-pandas.md#10-loading-and-saving-data)) |
| **APIs** | weather, social media, payment systems | `requests` ([file 03](03-developer-tools.md#13-calling-an-api-from-python)) |
| **Web scraping** | prices from websites | `BeautifulSoup`, `Scrapy`, `Playwright` |
| **Public datasets** | Kaggle, UCI ML Repository, Hugging Face Datasets, government open data | download |
| **Surveys / forms** | customer feedback | Google Forms, Typeform |
| **Sensors / IoT** | temperature, GPS | streaming pipelines |
| **Manual labelling** | humans tag images or texts | Label Studio, Amazon Mechanical Turk |
| **Synthetic data** | generated by programs or LLMs | file 21 |

### Web scraping example

```python
import requests
from bs4 import BeautifulSoup

html = requests.get("https://example.com", timeout=10).text
soup = BeautifulSoup(html, "html.parser")
titles = [h.text.strip() for h in soup.find_all("h2")]
```

⚠️ **Scraping ethics/legality:** check the website's **terms of service** and `robots.txt`; don't overload servers; respect copyright and personal data laws.

### Labelling

For supervised ML (file 11) you need **labels**. Often humans must create them. Labelling is slow, expensive, and error-prone, so:
- Write **clear labelling guidelines** with examples
- Have several people label the same items and measure **inter-annotator agreement** (if humans disagree, your model can't do better than them)
- Check label quality: **label noise** (wrong labels) hurts models

---

## 4. Data quality problems

| Problem | Example |
|---|---|
| **Missing values** | age is blank for 15% of customers |
| **Duplicates** | the same order recorded twice |
| **Inconsistent formats** | "Colombo", "colombo", "CMB", "Colombo " |
| **Wrong types** | prices stored as text "$1,200" |
| **Invalid values** | age = −5 or 250; a date in the future |
| **Outliers** | one salary of $10,000,000 among $50k ones |
| **Inconsistent units** | some weights in kg, others in pounds |
| **Out-of-date data** | addresses from 5 years ago |
| **Biased sampling** | only online customers in the data ([file 07](07-math-probability-statistics.md#1-population-vs-sample)) |

---

## 5. Clean data

```python
import pandas as pd
import numpy as np

df = pd.read_csv("customers.csv")

# 1. Standardise column names
df.columns = df.columns.str.strip().str.lower().str.replace(" ", "_")

# 2. Remove exact duplicates
print("duplicates:", df.duplicated().sum())
df = df.drop_duplicates()
# or duplicates by a key:
df = df.drop_duplicates(subset=["customer_id"], keep="last")

# 3. Fix text inconsistencies
df["city"] = df["city"].str.strip().str.title()
df["city"] = df["city"].replace({"Cmb": "Colombo", "Kandy City": "Kandy"})

# 4. Fix types
df["price"] = (df["price"].astype(str)
               .str.replace("$", "", regex=False)
               .str.replace(",", "", regex=False)
               .astype(float))
df["signup_date"] = pd.to_datetime(df["signup_date"], errors="coerce")  # bad dates → NaT (missing)

# 5. Invalid values → missing
df.loc[(df["age"] < 0) | (df["age"] > 110), "age"] = np.nan

# 6. Validate assumptions with assert
assert df["customer_id"].is_unique
assert df["price"].min() >= 0
```

**Golden rules:**
- **Never edit raw data files.** Keep the original; write cleaning code that produces a new clean file. Then anyone can re-run it.
- **Document every decision** ("dropped 120 rows with no customer_id").
- **Look at the data after each step.**

---

## 6. Handling missing values

### Why is it missing? (the three types)

| Type | Meaning | Example | Safe to drop? |
|---|---|---|---|
| **MCAR** (Missing Completely At Random) | Missingness has nothing to do with any data | a sensor randomly glitched | Yes, mostly |
| **MAR** (Missing At Random) | Missingness depends on *other observed* columns | older people skip the "social media" question | Careful; impute using other columns |
| **MNAR** (Missing Not At Random) | Missingness depends on the *missing value itself* | high earners refuse to report income | No; dropping biases the data |

### Strategies

| Strategy | When |
|---|---|
| **Drop rows** | Few missing (<5%), MCAR |
| **Drop column** | Mostly missing (>60%) and not crucial |
| **Fill with mean** | Numeric, symmetric, few outliers |
| **Fill with median** | Numeric, skewed or outliers (most common choice) |
| **Fill with mode / "Unknown"** | Categorical |
| **Group-wise fill** | e.g. median age per passenger class ([file 08 mini project](08-numpy-and-pandas.md#23-mini-project)) |
| **Forward fill / interpolate** | Time series |
| **Model-based imputation** (KNN imputer, iterative imputer) | Many correlated features |
| **Add a "was_missing" flag** | Missingness may carry information (MNAR) |

```python
from sklearn.impute import SimpleImputer   # scikit-learn: the main ML library (file 11)

df["income_missing"] = df["income"].isna().astype(int)   # flag
imputer = SimpleImputer(strategy="median")
df[["age", "income"]] = imputer.fit_transform(df[["age", "income"]])
```

**Imputation** = filling in missing values with estimates.

---

## 7. Handling outliers

First ask: **is it an error or a real extreme value?**
- Age 250 → error → fix or set to missing
- A customer spending $50,000 when most spend $500 → maybe a real business customer → keep, but handle carefully

**Detection** ([file 07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers)):
- **IQR rule:** outside Q1 − 1.5×IQR or Q3 + 1.5×IQR
- **z-score:** |z| > 3
- **Visual:** box plots, scatter plots
- **ML methods:** Isolation Forest (file 14)

**Treatment:**
- **Remove** (if errors)
- **Cap / clip / winsorise:** replace values above the 99th percentile with the 99th percentile value
- **Log transform** to shrink the long tail ([file 04](04-math-numbers-and-functions.md#13-logarithms))
- **Use robust methods** (median, tree-based models, which barely care about outliers)

```python
low, high = df["spend"].quantile([0.01, 0.99])
df["spend_capped"] = df["spend"].clip(low, high)
df["spend_log"] = np.log1p(df["spend"])     # log(1 + x), safe when x = 0
```

---

## 8. Exploratory Data Analysis (EDA)

**EDA** = getting to know your data with statistics and charts before modelling. Goals: understand it, find problems, form hypotheses, get feature ideas.

### A checklist

**1. Overview**
```python
df.shape; df.info(); df.head(); df.describe(include="all")
df.isna().mean().sort_values(ascending=False)    # % missing per column
```

**2. The target (label)**
```python
df["churned"].value_counts(normalize=True)      # class balance: e.g. 90% no / 10% yes
```
An imbalanced target changes how you evaluate models (file 13).

**3. Univariate analysis (one variable at a time)**
- Numeric: histogram, box plot. Look for skew, outliers, impossible values.
- Categorical: `value_counts()`, bar chart. Look for rare categories, typos.

**4. Bivariate analysis (two variables)**
- Numeric vs target: box plot of each feature split by target; or mean of target per bin
- Categorical vs target: target rate per category (`df.groupby("plan")["churned"].mean()`)
- Numeric vs numeric: scatter plot, correlation

**5. Multivariate**
- Correlation heatmap; pair plots; `hue` by target

**6. Write down findings:**
> - 10% churn rate → imbalanced
> - Monthly-contract customers churn at 3× the rate of yearly ones
> - `tenure` strongly negatively related to churn
> - `total_charges` ≈ `monthly_charges × tenure` → redundant
> - 11 rows with tenure 0 have blank total_charges → new customers → fill 0

```python
import seaborn as sns, matplotlib.pyplot as plt
fig, axes = plt.subplots(1, 3, figsize=(15, 4))
sns.histplot(df, x="tenure", hue="churned", ax=axes[0])
sns.boxplot(df, x="churned", y="monthly_charges", ax=axes[1])
df.groupby("contract")["churned"].mean().plot(kind="bar", ax=axes[2])
plt.tight_layout()
```

**Automated EDA tools:** `ydata-profiling` (formerly pandas-profiling), `sweetviz`: generate a full HTML report in one line. Good for a first look; don't skip thinking.

---

## 9. Encoding categorical features

ML models need numbers ([file 01](01-big-picture-and-data.md#9-data-types)). **Encoding** turns categories into numbers. A **feature** is an input column (file 01); **feature engineering** = creating and transforming features to help models learn.

### Label encoding / ordinal encoding

Replace each category with an integer.

| size | size_encoded |
|---|---|
| S | 0 |
| M | 1 |
| L | 2 |

✅ Good for **ordinal** data (has a real order).
❌ Bad for **nominal** data: encoding Colombo=0, Kandy=1, Galle=2 tells the model "Galle > Kandy > Colombo", which is nonsense for linear models. (Tree models, file 12, can cope with it.)

```python
size_order = {"S": 0, "M": 1, "L": 2, "XL": 3}
df["size_enc"] = df["size"].map(size_order)
```

### One-hot encoding

Create one **0/1 column per category**.

| city | city_Colombo | city_Galle | city_Kandy |
|---|---|---|---|
| Colombo | 1 | 0 | 0 |
| Kandy | 0 | 0 | 1 |
| Galle | 0 | 1 | 0 |

✅ No fake order. The standard for nominal categories with few values.
❌ With many categories (e.g. 5,000 product IDs) → 5,000 columns (**high cardinality** problem).

```python
pd.get_dummies(df, columns=["city"], drop_first=True)   # drop_first avoids redundant column
from sklearn.preprocessing import OneHotEncoder
enc = OneHotEncoder(handle_unknown="ignore")   # unseen categories later → all zeros instead of crash
```

**Dummy variable trap:** for linear models, one column is redundant (if not Colombo and not Galle → Kandy). `drop_first=True` removes one.

### For high-cardinality categories

| Method | Idea | Caution |
|---|---|---|
| **Frequency / count encoding** | Replace category with how often it appears | Different categories may get the same number |
| **Target encoding** (mean encoding) | Replace category with the average target for that category (e.g. churn rate per city) | **Leaks** the answer unless computed only on training data with smoothing/cross-validation (section 13) |
| **Grouping rare categories** | Merge categories with <1% frequency into "Other" | |
| **Hashing** | Hash function maps categories into a fixed number of columns | Collisions |
| **Embeddings** | Learn a vector per category with a neural network | Needs DL (files 15, 18) |

---

## 10. Scaling numeric features

**Problem:** features on very different scales (age 18 to 90; income 10,000 to 1,000,000). Models that use **distances** (kNN, k-means, SVM) or **gradient descent** (linear models, neural networks) work badly or slowly: big-scale features dominate ([file 05](05-math-linear-algebra.md#5-distance-between-vectors)) and gradients become unbalanced ([file 06](06-math-calculus.md#10-gradient-descent-with-two-parameters)).

**Tree-based models** (decision trees, random forests, XGBoost; file 12) **don't need scaling**.

### Standardisation (z-score scaling): most common

```
x_scaled = (x − mean) / std
```
Result: mean 0, std 1 ([z-scores, file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)).

Ages [20, 30, 40, 50, 60]: mean 40, std ≈ 14.14 → [−1.41, −0.71, 0, 0.71, 1.41]

### Min-max normalisation

```
x_scaled = (x − min) / (max − min)
```
Result: range [0, 1]. Ages above → [0, 0.25, 0.5, 0.75, 1.0]. Used for pixel values (divide by 255) and when you need a bounded range. Sensitive to outliers.

### Robust scaling

```
x_scaled = (x − median) / IQR
```
Not thrown off by outliers.

### Log transform

For right-skewed data (income, counts, prices): `np.log1p(x)`. Makes distributions more symmetric; often helps linear models.

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler, RobustScaler
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)   # learn mean/std from TRAINING data only
X_test_scaled = scaler.transform(X_test)         # apply the SAME mean/std to test data
```

**`fit` vs `transform`:** `fit` learns the numbers (mean, std); `transform` applies them. Fit on training data only (section 13).

**Terminology warning:** "normalisation" is used loosely for any scaling. In deep learning, "normalisation layers" (BatchNorm, LayerNorm, file 15) are a different but related idea.

---

## 11. Creating new features

Often the best way to improve a model is a smarter feature, not a fancier algorithm. **Domain knowledge** is the key.

| Technique | Example |
|---|---|
| **Ratios** | `debt_to_income = debt / income`; `price_per_m2 = price / size` |
| **Differences** | `days_since_last_purchase = today − last_purchase_date` |
| **Date parts** | year, month, day of week, is_weekend, is_holiday, hour |
| **Cyclical encoding** | hour → sin(2π·hour/24), cos(2π·hour/24), so 23:00 and 00:00 are close |
| **Aggregations** | per customer: number of orders, average order value, total spent in last 30 days |
| **Binning** | age → age groups (`pd.cut`, [file 08](08-numpy-and-pandas.md#14-creating-and-changing-columns)) |
| **Interactions** | `area = length × width`; `is_young_and_new = (age<25) & (tenure<3)` |
| **Polynomial features** | x² , x³ (let linear models fit curves, file 12) |
| **Flags** | `has_complained`, `income_missing` |
| **Text features** | word count, contains "refund", sentiment score; TF-IDF and embeddings (file 18) |
| **Geographic** | distance to nearest store from latitude/longitude |
| **Lag features** (time series) | sales yesterday, sales same day last week (section 14) |

**Example: RFM features** (classic for customer analytics):
- **R**ecency: days since last purchase
- **F**requency: number of purchases
- **M**onetary: total spent

```python
snapshot = orders["date"].max() + pd.Timedelta(days=1)
rfm = orders.groupby("customer_id").agg(
    recency=("date", lambda d: (snapshot - d.max()).days),
    frequency=("order_id", "count"),
    monetary=("amount", "sum"),
)
```

---

## 12. Feature selection

**Why remove features?** Fewer features → simpler, faster models, less **overfitting** (file 11), easier to explain. Irrelevant or duplicate features add noise.

**Curse of dimensionality:** as the number of features grows, data becomes very sparse in that huge space; distances become less meaningful and you need far more data. (More in file 14.)

### Methods

| Family | Method | Idea |
|---|---|---|
| **Filter** (statistics, before modelling) | Variance threshold | Drop columns that barely change (e.g. 99.9% the same value) |
| | Correlation with target | Keep features most related to the label |
| | Remove highly correlated pairs | If two features have r > 0.95, keep one |
| | Chi-square, mutual information ([file 07](07-math-probability-statistics.md#25-mutual-information)) | Statistical dependence with the target |
| **Wrapper** (try subsets with a model) | Recursive Feature Elimination (RFE) | Repeatedly train and drop the weakest feature |
| | Forward / backward selection | Add / remove features one at a time |
| **Embedded** (built into training) | L1 regularisation (Lasso) | Pushes useless features' weights to exactly 0 (file 11) |
| | Tree feature importance | Trees report which features they used most (file 12) |

```python
from sklearn.feature_selection import VarianceThreshold, SelectKBest, mutual_info_classif
X_sel = SelectKBest(mutual_info_classif, k=10).fit_transform(X_train, y_train)
```

---

## 13. Data leakage (preview)

> **Data leakage** = information that wouldn't be available at prediction time sneaks into training, making the model look amazing in testing but fail in the real world.

To understand this, you need one idea from [file 11](11-ml-fundamentals.md): we split data into a **training set** (the model learns from it) and a **test set** (held back to check the model honestly, like a final exam the student hasn't seen).

**Common leaks:**
- **Target leakage:** a feature that is a consequence of the label. Predicting "will this customer churn?" using a column `cancellation_reason`, which is only filled in *after* they churn.
- **Preprocessing leakage:** computing the scaler's mean/std, imputation medians, or target encodings on **all** data before splitting. The test set's information leaks into training.
- **Time leakage:** using future data to predict the past (e.g. random splits on time series).
- **Duplicate leakage:** the same customer/patient appears in both train and test.

**Rule:** split first, then fit every preprocessing step **only on the training set**. Scikit-learn **Pipelines** (file 11) make this automatic.

**Warning sign:** accuracy that seems too good to be true (99% on a hard problem) usually is.

---

## 14. Time series basics

**Time series** = data points ordered in time ([file 01](01-big-picture-and-data.md#9-data-types)): daily sales, hourly temperature, stock prices.

### Components

```
Sales
  │        /\      /\      /\
  │      /\  \  /\/  \  /\/  \      ← seasonality (repeating pattern)
  │    /\/    \/      \/              + trend (overall rise)
  │  /                                + noise (random wiggles)
  └──────────────────────────► time
```

- **Trend:** long-term up or down movement
- **Seasonality:** regular repeating patterns (weekly, yearly; e.g. more sales in December)
- **Cycles:** longer irregular ups and downs (economic cycles)
- **Noise / residual:** random leftover variation

```python
from statsmodels.tsa.seasonal import seasonal_decompose
result = seasonal_decompose(ts, model="additive", period=7)   # weekly seasonality
result.plot()
```

### Key concepts

- **Stationarity:** a series is stationary if its statistical properties (mean, variance) don't change over time. Many classic forecasting models (ARIMA, file 14) assume it. Make a series stationary by **differencing** (y_t − y_{t−1}).
- **Lag:** the value k steps ago. `ts.shift(1)` = yesterday's value.
- **Autocorrelation:** correlation of a series with its own lagged values. "Is today similar to yesterday? To the same day last week?"
- **Rolling (moving) statistics:** `ts.rolling(7).mean()` smooths noise.

### Time series features for ML

```python
df = df.sort_values("date")
df["lag_1"] = df["sales"].shift(1)
df["lag_7"] = df["sales"].shift(7)
df["rolling_mean_7"] = df["sales"].shift(1).rolling(7).mean()   # shift first to avoid leaking today!
df["dayofweek"] = df["date"].dt.dayofweek
df["month"] = df["date"].dt.month
```

⚠️ **Never shuffle time series randomly for train/test.** Train on the past and test on the future (file 11).

Forecasting models (ARIMA, Prophet, ML/DL approaches) are covered in [file 14](14-unsupervised-learning-and-more.md).

---

## 15. Business metrics and KPIs

Data science only matters if it moves a **business metric**. Know these:

| Metric | Formula / meaning |
|---|---|
| **Revenue** | Total money earned |
| **Profit / margin** | Revenue − costs; margin = profit ÷ revenue |
| **Conversion rate** | Users who took the desired action ÷ total users |
| **Churn rate** | Customers lost in a period ÷ customers at the start |
| **Retention rate** | 1 − churn rate |
| **CLV / LTV** (Customer Lifetime Value) | Expected total revenue from a customer over their lifetime ≈ avg monthly revenue × avg lifetime (months) |
| **CAC** (Customer Acquisition Cost) | Marketing + sales spend ÷ new customers |
| **LTV : CAC ratio** | Healthy businesses often aim for ~3:1 |
| **ARPU** (Average Revenue Per User) | Revenue ÷ users |
| **DAU / MAU** | Daily / monthly active users; DAU÷MAU = "stickiness" |
| **AOV** (Average Order Value) | Revenue ÷ number of orders |
| **NPS** (Net Promoter Score) | % promoters (score 9 to 10) − % detractors (0 to 6) on "would you recommend us?" |

### Analysis techniques

- **Funnel analysis:** track how many users survive each step. Example: visit (10,000) → add to cart (1,500) → checkout (600) → pay (450). Biggest drop is visit → cart: focus there.
- **Cohort analysis:** group users by when they joined (January cohort, February cohort...) and track their behaviour over time. Reveals whether retention is improving.
- **Segmentation:** split customers into groups (by region, plan, behaviour) and compare. Clustering (file 14) can find segments automatically.

**Worked example: CLV.** Average customer pays $20/month, monthly churn is 5%. Average lifetime ≈ 1 / churn = 1 / 0.05 = 20 months. CLV ≈ $20 × 20 = **$400**. If acquiring a customer costs $100, the LTV:CAC ratio is 4:1, which is healthy.

**Connecting ML to money:** a churn model is only valuable if acting on it (e.g. offering discounts to high-risk customers) saves more than it costs. Always estimate the business impact.

---

## 16. End-to-end example

**Question:** "Which telecom customers will churn next month?"

```python
import pandas as pd, numpy as np

# 1. Load
df = pd.read_csv("telco_churn.csv")

# 2. Clean
df.columns = df.columns.str.lower()
df["totalcharges"] = pd.to_numeric(df["totalcharges"], errors="coerce")  # blanks → NaN
df.loc[df["tenure"] == 0, "totalcharges"] = 0      # new customers: no charges yet
df = df.drop_duplicates(subset="customerid")
df["churn"] = (df["churn"] == "Yes").astype(int)

# 3. EDA findings (from charts)
print(df["churn"].mean())                                   # ~0.27
print(df.groupby("contract")["churn"].mean())                # month-to-month churns most

# 4. Feature engineering
df["avg_monthly_spend"] = df["totalcharges"] / df["tenure"].replace(0, np.nan)
df["avg_monthly_spend"] = df["avg_monthly_spend"].fillna(df["monthlycharges"])
df["is_new"] = (df["tenure"] < 6).astype(int)
df["n_services"] = (df[["phoneservice", "internetservice", "streamingtv"]] != "No").sum(axis=1)

# 5. Encode
X = pd.get_dummies(df.drop(columns=["customerid", "churn"]), drop_first=True)
y = df["churn"]
# 6. → Modelling in files 11-13 (split, scale inside a pipeline, train, evaluate)
```

---

## 17. Check yourself

**Q1.** What are the six phases of CRISP-DM?
<details><summary>Answer</summary>Business understanding, data understanding, data preparation, modelling, evaluation, deployment.</details>

**Q2.** High earners often skip the income question. Which missingness type is this, and is dropping those rows safe?
<details><summary>Answer</summary>MNAR (missing not at random). Dropping them biases the data toward lower incomes. Add a "missing" flag and impute carefully.</details>

**Q3.** You have a `colour` column with values red/green/blue. Label encoding or one-hot encoding for a linear model? Why?
<details><summary>Answer</summary>One-hot. Colours have no order; label encoding would invent a fake ranking.</details>

**Q4.** Standardise the ages [10, 20, 30] (use population std).
<details><summary>Answer</summary>Mean 20, std = √((100+0+100)/3) ≈ 8.165 → [−1.22, 0, 1.22].</details>

**Q5.** Which models don't need feature scaling?
<details><summary>Answer</summary>Tree-based models (decision trees, random forests, gradient boosting).</details>

**Q6.** You compute the mean and std on the whole dataset, scale it, then split train/test. What's wrong?
<details><summary>Answer</summary>Preprocessing leakage: test-set information influenced the scaling. Split first, fit the scaler on training data only.</details>

**Q7.** Create a feature that tells a model that 23:00 and 01:00 are close in time.
<details><summary>Answer</summary>Cyclical encoding: hour_sin = sin(2π·hour/24), hour_cos = cos(2π·hour/24).</details>

**Q8.** Monthly churn is 4%, average revenue $25/month. Estimate CLV.
<details><summary>Answer</summary>Lifetime ≈ 1/0.04 = 25 months → CLV ≈ 25 × $25 = **$625**.</details>

**Q9.** A funnel: 20,000 visits → 2,000 sign-ups → 1,600 activations → 200 paid. Where's the biggest problem?
<details><summary>Answer</summary>Rates: 10% → 80% → 12.5%. Visit→sign-up (10%) and activation→paid (12.5%) are weakest; activation→paid is a big drop after users were already engaged, which is often the most actionable.</details>

---

## 18. New words in this file

| Word | Meaning |
|---|---|
| CRISP-DM | Standard 6-phase data project process |
| Descriptive / diagnostic / predictive / prescriptive analytics | What happened / why / what will / what to do |
| Web scraping, robots.txt | Extracting data from websites / site's crawling rules |
| Labelling, guidelines, inter-annotator agreement, label noise | Creating labels / instructions / how much labellers agree / wrong labels |
| Synthetic data | Artificially generated data |
| Data cleaning | Fixing errors, duplicates, formats, types |
| MCAR / MAR / MNAR | Types of missingness |
| Imputation, SimpleImputer, KNN/iterative imputer | Filling missing values |
| Missing-value flag | 0/1 column marking missingness |
| Capping / clipping / winsorising | Limiting extreme values |
| `log1p` | log(1 + x), safe for zeros |
| EDA | Exploratory Data Analysis |
| Univariate / bivariate / multivariate analysis | One / two / many variables |
| Class balance / imbalanced | Proportion of each label / one class much rarer |
| Feature engineering | Creating and transforming input features |
| Encoding: label, ordinal, one-hot, frequency, target, hashing | Turning categories into numbers |
| High cardinality | Many distinct categories |
| Dummy variable trap, `drop_first` | Redundant one-hot column / remove one |
| Scaling: standardisation, min-max normalisation, robust scaling | Putting features on comparable scales |
| `fit` / `transform` / `fit_transform` | Learn parameters / apply them / both |
| Domain knowledge | Understanding of the business/field |
| Ratio, interaction, polynomial, cyclical features | Types of engineered features |
| RFM | Recency, Frequency, Monetary customer features |
| Feature selection: filter, wrapper, embedded | Choosing useful features |
| Variance threshold, RFE | Drop near-constant features / recursive elimination |
| Curse of dimensionality | Too many features make data sparse |
| Data leakage (target, preprocessing, time, duplicate) | Future/test info leaking into training |
| Training set / test set (preview) | Data to learn from / data to check honestly |
| Trend, seasonality, cycle, noise | Time series components |
| Stationarity, differencing | Stable statistics over time / subtracting the previous value |
| Lag, autocorrelation, rolling statistics | Past value / correlation with own past / moving averages |
| Revenue, margin, conversion, churn, retention, CLV/LTV, CAC, ARPU, DAU/MAU, AOV, NPS | Business metrics |
| Funnel, cohort analysis, segmentation | Step-by-step drop-off / tracking groups by join date / splitting customers into groups |

**🎉 You've finished Part B: Data Science!**

**Mini project for Part B:** pick a Kaggle dataset you find interesting. Produce a Jupyter notebook that: states a business question → cleans the data (documenting each decision) → does EDA with at least 6 meaningful charts → engineers 5+ new features → ends with 3 insights and 1 recommendation written for a manager. Push it to GitHub.

**Next:** [11-ml-fundamentals.md](11-ml-fundamentals.md)
