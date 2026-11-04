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

### Why it exists

Early data projects often failed because teams jumped straight to building a model without agreeing what problem they were solving. CRISP-DM is a checklist of stages that stops that.

### Worked example: a churn project through the six phases

| Phase | What happens in a mobile-operator churn project |
|---|---|
| 1. Business understanding | Goal: cut monthly churn from 5% to 4% |
| 2. Data understanding | Pull 12 months of usage and billing; plot it; find blanks |
| 3. Data preparation | Remove duplicates, fill gaps, build features such as "calls last 30 days" |
| 4. Modelling | Train a few models that predict churn |
| 5. Evaluation | Does it find churners better than the current guesswork? Is the business goal met? If not, go back to phase 1 or 3 |
| 6. Deployment | Score every customer weekly; send the list to the retention team |

### Where you'll meet it in real work

Project plans and interview questions in data teams. When someone says "we keep going back to fix the data", that is the loop in the diagram.

### Common mistakes
- Treating the diagram as a one-way road. Expect to loop.
- Spending 90% of the time on modelling and 10% on understanding the business problem. It is usually the opposite in successful projects.

> **සිංහලෙන්:** CRISP-DM කියන්නේ data project එකක් කරන පියවර 6ක් තියෙන ක්‍රමයක්. ගෙයක් හදනවා වගේ, මුලින් ඕනේ මොන වගේ ගෙයක්ද කියලා තීරණය කරනවා (business understanding), ඊට පස්සේ බඩු එකතු කරනවා, ඒවා සකස් කරනවා, හදනවා, පරීක්ෂා කරනවා, අන්තිමට භාවිතයට දෙනවා. මේක සරල රේඛාවක් නෙවෙයි, loop එකක්. Model එක හදනකොට data වල ප්‍රශ්නයක් හම්බවුණොත් ආපහු ගිහින් හදනවා. උදාහරණයක් විදිහට mobile සමාගමක මාසික churn 5%ක් 4% දක්වා අඩු කරන එක තමයි මුල්ම පියවරේ ඉලක්කය.

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

### Why it exists

A vague question gives a vague (useless) answer. A sharp question tells you which data to collect and when you are done.

### Worked example: from wish to measurable goal

Wish: "reduce churn".
1. A mobile operator has 100,000 customers and 5% churn per month, so it loses 100,000 × 0.05 = **5,000** customers a month.
2. Target: 4% churn → loses 4,000. Saving = **1,000 customers per month**.
3. If a customer pays about Rs.1,500 a month, that is 1,000 × 1,500 = **Rs.1.5 million per month** (illustrative numbers).
4. Now the question is specific, actionable and measurable: "Predict which customers will leave in 30 days so the retention team can call the top 2,000."

### Where you'll meet it in real work

Every kick-off meeting. A good analyst asks "what decision will this change?" before touching data.

### Common mistakes
- Starting with the data instead of the decision.
- A goal that cannot be measured ("make customers happier").

> **සිංහලෙන්:** "Customer data analyse කරන්න" කියන්නේ අපැහැදිලි ඉල්ලීමක්. හොඳ ප්‍රශ්නයක් නිශ්චිතයි, ඒකෙන් තීරණයක් වෙනස් වෙනවා, ඒක මැනලා බලන්නත් පුළුවන්. Customers 100,000ක් ඉන්න සමාගමක මාසෙකට 5%ක් යනවා නම් 5,000ක් නැති වෙනවා. 4% වුණොත් 4,000යි, ඒ කියන්නේ 1,000දෙනෙක් ඉතුරු වෙනවා. එක්කෙනෙක් මාසෙට රුපියල් 1,500ක් ගෙවනවා නම් මාසෙකට රුපියල් ලක්ෂ 15ක ලාභයක්. එතකොට ප්‍රශ්නය "ඊළඟ දවස් 30ට යන්න ඉඩ තියෙන අයව හොයාගන්න" කියලා පැහැදිලි වෙනවා.

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

### Why it exists

A model is only as good as its data, and data lives in many different places. Knowing the source decides which tool you reach for.

### A text picture: which door to use

```
CSV / Excel file   -> pd.read_csv()          (groceries already in your cupboard)
Database (SQL)     -> pd.read_sql(query, conn)  (a big warehouse; you need permission)
API (JSON)         -> requests.get(url).json()  (phone the shop; they send a neat parcel)
Web page (HTML)    -> BeautifulSoup / Scrapy    (go to the market and pick yourself)
```

JSON is the key-value text format most APIs reply with, for example `{"city": "Colombo", "temp": 31}`.

### Worked example: how big is a scraping job?

You want 2,000 vehicle ads from a classifieds site such as ikman.lk. If one page shows 25 ads, you need 2,000 ÷ 25 = **80 pages**. At one request per second that is under 2 minutes, but you must still check the site's terms and `robots.txt` first, and add a delay between requests.

### Where you'll meet it in real work

A bank pulls transactions with SQL, a weather startup pulls rainfall by API, and a price-comparison project scrapes shop websites.

### Common mistakes
- Scraping without reading the terms of service.
- Collecting only convenient data (for example only online customers) and getting a biased sample.
- Forgetting to save the raw download untouched.

> **සිංහලෙන්:** Data එන්න පුළුවන් තැන් ගොඩක් තියෙනවා. CSV file එක කියන්නේ ගෙදර අල්මාරියේ තියෙන බඩු වගේ, `pd.read_csv()` වලින් කියවනවා. API එක කියන්නේ කඩේට phone කරලා order කරනවා වගේ, එයාලා JSON format එකෙන් අහම්බෙන් නැතුව හරියට එවනවා. Web scraping කියන්නේ පොළට ගිහින් ඔයාම තෝරගන්නවා වගේ, ඒත් කලින් site එකේ නීති (robots.txt) බලන්න ඕනේ. ads 2,000ක් එකතු කරන්න, page එකක ads 25ක් නම්, pages 80ක් කියවන්න ඕනේ.

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

### Why it exists

Real data is messy: people mistype, systems glitch, forms stay blank. Naming the common problems lets you check for them one by one instead of being surprised later.

### Worked example: a quick quality audit

A table of 1,000 customer rows:

| Check | Result | Share |
|---|---|---|
| Blank age | 80 rows | 80 ÷ 1,000 = 8% |
| Duplicate rows | 15 rows | 15 ÷ 1,000 = 1.5% |
| City typed as "colombo", "CMB", "Colombo " | 3 spellings of one city | needs standardising |
| Age below 0 or above 110 | 4 rows | invalid, set to missing |

Writing this table before any fixing tells you how big the clean-up is and gives you a record of what you changed.

### Where you'll meet it in real work

A data engineer at a bank runs automatic quality checks every night, such as "no negative balances" and "no duplicate account numbers".

### Common mistakes
- Fixing problems without first counting them.
- Assuming that a column of numbers is clean because it loaded without an error.

> **සිංහලෙන්:** ඇත්ත ලෝකයේ data කවදාවත් පිරිසිදු නෑ. සමහර cells හිස්, සමහර rows දෙපාරක් තියෙනවා, "Colombo", "colombo", "CMB" කියලා එකම නගරය විවිධ විදිහට ලියලා තියෙනවා. Customers 1,000ක වගුවක වයස හිස් 80ක් තියෙනවා නම් ඒක 8%ක්, duplicates 15ක් තියෙනවා නම් 1.5%ක්. මේවා හදන්න කලින් ගණන් කරලා ලියාගන්න, එතකොට වැඩේ කොච්චරද කියලා තේරෙනවා.

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

### Why it exists

"Garbage in, garbage out": a perfect algorithm trained on messy data still gives messy answers. It is like picking stones and husks out of rice before cooking; skip it and the whole meal is spoiled.

### Worked example: 1,000 rows to 985

1. Start: 1,000 customers; 80 ages are blank.
2. The remaining 920 ages have median 34, so fill the 80 blanks with **34**.
3. Find 15 duplicate rows and drop them: 1,000 − 15 = **985 rows** left.
4. Check: no blank ages remain; every `customer_id` is unique (the `assert` lines verify this).

```
raw file (never edited)  -->  cleaning script  -->  clean file
 customers.csv                 clean.py              customers_clean.csv
```

(When you later build a model, learn the median from the training rows only, not the whole table. See section 13.)

### Where you'll meet it in real work

At a hospital, "Male", "M", "male " and "1" for the same field must be mapped to one code before anything is analysed.

### Common mistakes
- Overwriting the raw file, so you can never re-run your steps.
- Silent changes: always note how many rows each step touched.
- Using `errors="coerce"` and not checking how many values became missing.

> **සිංහලෙන්:** Data cleaning කියන්නේ හාල් උයන්න කලින් ගල් අහුලනවා වගේ වැඩක්. ගල් අයින් කළේ නැත්නම් බත් එක කොච්චර හොඳට උයපු වුණත් කන්න බෑ. Customers 1,000ක වයස හිස් 80ක් තියෙනවා, ඉතිරි 920දෙනාගේ median එක 34යි, ඒ නිසා හිස් 80ට 34 දානවා. Duplicate rows 15ක් අයින් කළාම 1,000 − 15 = 985ක් ඉතුරු වෙනවා. මුල් file එක කවදාවත් edit කරන්න එපා, cleaning code එක වෙනම ලියලා අලුත් file එකක් හදන්න.

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

### Why it exists

Most models cannot handle blanks, but simply deleting rows can throw away information or bias your data. The right fix depends on why the value is missing.

### Worked example: mean vs median fill

Ages recorded for 6 people: 22, 25, blank, 31, 90, blank.
1. Known values: 22, 25, 31, 90 (four values).
2. Mean = (22 + 25 + 31 + 90) ÷ 4 = 168 ÷ 4 = **42**.
3. Median = middle two (25 and 31) → (25 + 31) ÷ 2 = **28**.
4. One extreme value (90) pulled the mean to 42, which is older than three of the four known people. The median 28 is a more typical fill.

### Where you'll meet it in real work

A survey asks for income. Higher earners skip it more often (MNAR). Adding a `income_missing` flag lets the model learn from the fact that it was skipped.

### Common mistakes
- Filling with 0. Age 0 or income 0 are fake real values.
- Computing the fill value (mean/median) on the full dataset before splitting, which is leakage (section 13).
- Dropping all rows with any blank, which can delete most of a wide table.

> **සිංහලෙන්:** හිස් අගයන් ගැන කල්පනා කරන්න කලින් ඇයි හිස් වුණේ කියලා අහන්න. Sensor එකක් අහඹුවෙන් අවුල් වුණා නම් (MCAR) අයින් කරන්න පුළුවන්. වැඩියෙන් උපයන අය ආදායම කියන්න අකමැති නම් (MNAR) ඒවා අයින් කළොත් data එක පක්ෂග්‍රාහී වෙනවා. වයස් 22, 25, හිස්, 31, 90, හිස් කියමු, mean එක 168 ÷ 4 = 42යි, ඒත් median එක (25 + 31) ÷ 2 = 28යි. 90 නිසා mean එක උඩට ඇදිලා, ඒ නිසා outliers තියෙනකොට median එකෙන් පුරවන්න.

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

### Why it exists

A few extreme values can drag averages, stretch charts and confuse models. But some extremes are real, and deleting them throws away the very customers you care about.

### Worked example: the IQR rule on salaries

Salaries (Rs. thousand), 9 people: 40, 45, 48, 50, 52, 55, 58, 60, 400.
1. Median = the 5th value = **52**.
2. Q1 = median of 40, 45, 48, 50 = (45 + 48) ÷ 2 = **46.5**; Q3 = median of 55, 58, 60, 400 = (58 + 60) ÷ 2 = **59**.
3. IQR = 59 − 46.5 = **12.5**; 1.5 × IQR = 18.75.
4. Fences: lower = 46.5 − 18.75 = **27.75**, upper = 59 + 18.75 = **77.75**.
5. 400 is above 77.75 → outlier. 

Now try the z-score rule. Mean = 808 ÷ 9 ≈ 89.8 and population std ≈ 109.8, so z for 400 = (400 − 89.8) ÷ 109.8 ≈ **2.8**, which is **below 3**, so the z-score rule misses it! The outlier itself inflated the mean and the std. This is why the IQR rule is more robust for small, skewed data.

### Where you'll meet it in real work

Fraud detection teams deliberately study outliers: a single card spending 100 times its usual amount is exactly what they look for.

### Common mistakes
- Deleting every outlier automatically; first ask whether it is an error or a real extreme.
- Using the z-score rule on very small or very skewed samples.

> **සිංහලෙන්:** Outlier කියන්නේ අනිත් අගයන්ට වඩා ගොඩක් දුරින් තියෙන අගයක්. මුලින්ම අහන්න ඕනේ ඒක වැරැද්දක්ද (වයස 250) නැත්නම් ඇත්ත අගයක්ද (ලොකු ව්‍යාපාරිකයෙක්ගේ වියදම) කියලා. පඩි රුපියල් දහස් වලින් 40, 45, 48, 50, 52, 55, 58, 60, 400 කියමු. Q1 = 46.5, Q3 = 59, ඒ නිසා IQR = 12.5, උඩ සීමාව 59 + 18.75 = 77.75යි, ඒ නිසා 400 outlier එකක්. z-score එක ගත්තොත් 2.8ක් විතරයි (3ට අඩුයි), මොකද 400 නිසාම mean සහ std ලොකු වෙනවා. ඒ නිසා පොඩි skewed data වලට IQR ක්‍රමය හොඳයි.

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

### Why it exists

Before modelling you must know what is in your data. A teacher in a new class learns each child's marks first (one column), then marks vs study hours (two columns), then many factors together. EDA is that same getting-to-know-you step.

### Worked example: a segment comparison

Telecom customers: 1,000 on month-to-month contracts, 500 on yearly contracts.
- Month-to-month: 300 churned → 300 ÷ 1,000 = **30%**.
- Yearly: 50 churned → 50 ÷ 500 = **10%**.
- Ratio = 30% ÷ 10% = **3 times**.
- Overall churn = (300 + 50) ÷ 1,500 = **23.3%**. The overall rate hides the big difference between groups, which is why you always split by segments.

Correlation in housing data: if `size_sqft` and `price` have correlation +0.82, large houses are strongly linked to high prices; if `distance_to_city` and `price` are −0.45, prices tend to fall as you move away from the city.

### Where you'll meet it in real work

On day one of a project you spend hours in a notebook with `describe()`, histograms and group-by tables before anybody speaks about models.

### Exam angle
Exams ask about class imbalance found in EDA (for example 95% non-fraud) and why plain accuracy is then misleading; see file 13.

### Common mistakes
- Treating correlation as causation.
- Skipping the target column check.
- Not writing down findings, then forgetting them.

> **සිංහලෙන්:** EDA කියන්නේ model එකක් හදන්න කලින් data එක එක්ක අඳුනගන්න කරන වැඩේ. අලුත් පන්තියක ගුරුවරයෙක් මුලින් එක එක ළමයාගේ ලකුණු බලනවා, ඊට පස්සේ පාඩම් කරන පැය සහ ලකුණු අතර සම්බන්ධය බලනවා වගේ. Month-to-month customers 1,000න් 300ක් ගියා නම් 30%, yearly 500න් 50ක් ගියා නම් 10%, ඒ කියන්නේ 3 ගුණයක් වෙනසක්. එකතුව ගත්තාම 23.3%ක් විතරයි, ඒ නිසා කණ්ඩායම් වලට බෙදලා බලන්න. Correlation +0.82ක් කියන්නේ ලොකු ගෙවල් වල මිල වැඩි වෙන ප්‍රවණතාවක් තියෙනවා කියන එක, හේතුව නෙවෙයි.

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

### Why it exists

Models do maths, and maths needs numbers. "Colombo" has no value in a formula, so we must translate categories to numbers without accidentally telling the model something false.

### Worked example: counting columns

- A `city` column with 3 values → one-hot creates **3** columns (or 2 with `drop_first=True`).
- A `product_id` column with 5,000 values → **5,000** columns, mostly zeros. This is the high-cardinality problem, so use frequency encoding, grouping rare values, hashing or embeddings instead.
- A `size` column S, M, L with a real order → ordinal 0, 1, 2 is fine.

Why fake order hurts: with Colombo = 0, Kandy = 1, Galle = 2, a linear model computes that Galle is "twice" Kandy and the average of Colombo and Galle is Kandy, which is nonsense.

### Where you'll meet it in real work

Every project with columns like city, plan, device type or product category. Embeddings for categories lead directly into how language models represent words.

### Exam angle
Typical question: "Which encoding for a nominal feature with few values?" Answer: one-hot. "For ordered sizes?" Ordinal. "Which encoding leaks the target if done carelessly?" Target encoding.

### Common mistakes
- Label-encoding nominal data for a linear model.
- Fitting the encoder on all data; unseen categories at prediction time crash it unless `handle_unknown="ignore"`.
- Computing target encoding on the full dataset (leaks the answer).

> **සිංහලෙන්:** Models වලට අංක විතරයි තේරෙන්නේ, ඒ නිසා "Colombo", "Kandy", "Galle" වගේ text අංක වලට හරවන්න ඕනේ. පිළිවෙළක් තියෙන size (S, M, L) වලට 0, 1, 2 දෙන්න පුළුවන් (ordinal). නගර වලට 0, 1, 2 දුන්නොත් Galle කියන්නේ Kandy වගේ දෙගුණයක් කියලා model එක වැරදියට තේරුම් ගන්නවා. ඒ නිසා ඒවාට one-hot පාවිච්චි කරන්න: නගර 3ක් නම් column 3ක් හැදෙනවා. Product id 5,000ක් තියෙනවා නම් one-hot වලින් column 5,000ක් හැදෙනවා, ඒ වෙනුවට frequency encoding හෝ embeddings පාවිච්චි කරන්න.

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

### Why it exists

If one feature is measured in tens (age) and another in hundreds of thousands (income), distance-based and gradient-based models are dominated by the large one. Scaling puts features on equal footing.

### Worked example: scale effect on distance

Three people (age, income in Rs.): A (25, 50,000), B (55, 51,000), C (26, 80,000).
- Raw distance A to B = √(30² + 1,000²) = √(900 + 1,000,000) ≈ **1,000.4**.
- Raw distance A to C = √(1² + 30,000²) ≈ **30,000.0**.
The 30-year age gap barely registers; income decides everything.

Now min-max scale income using min 50,000 and max 80,000: A = 0, B = (51,000 − 50,000) ÷ 30,000 = 0.033, C = 1. Scale age with min 25 and max 55: A = 0, B = 1, C = (26 − 25) ÷ 30 = 0.033. Now A to B ≈ √(1² + 0.033²) ≈ 1.0 and A to C ≈ √(0.033² + 1²) ≈ 1.0: both differences count.

Min-max for incomes [30,000, 50,000, 90,000]: range 60,000 → [0, 0.333, 1].

### Where you'll meet it in real work

Before k-means clustering of customers or training a neural network, scaling is a standard first step. Image pixels (0 to 255) are divided by 255 to get 0 to 1.

### Exam angle
Questions: "Which models need scaling?" (distance and gradient based) and "Where do you fit the scaler?" (training data only, then `transform` the test data). BatchNorm and LayerNorm are related but different ideas from preprocessing.

### Common mistakes
- Fitting the scaler on all data before splitting.
- Min-max scaling data full of outliers: one huge value squashes everyone else near 0.
- Scaling the target accidentally, or forgetting to reverse it for predictions.

> **සිංහලෙන්:** Features වල පරිමාණ ගොඩක් වෙනස් නම් (වයස 25 vs ආදායම රුපියල් 50,000) distance වලින් වැඩ කරන models (kNN, k-means) ලොකු අගය පිට ගිහින් බලනවා. A (25, 50,000) සහ B (55, 51,000) අතර දුර 1,000ක් විතර, එතකොට වයස අවුරුදු 30ක පරතරය කිසිම දෙයක් නෑ. Min-max scale කළාම දෙකම 0 සහ 1 අතර එනවා, දෙකටම සමාන බරක් ලැබෙනවා. Scaler එක fit කරන්නේ training data වලින් විතරයි, ඒ අගයන්ම test data එකටත් යොදනවා.

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

### Why it exists

A raw column like `date` or `debt` means little to a model, but a ratio or a "days since" feature carries the pattern directly. Good features often help more than a fancier algorithm.

### Worked example 1: a ratio feature

Customer A: debt Rs.600,000, income Rs.1,200,000 a year. `debt_to_income` = 600,000 ÷ 1,200,000 = **0.5**.
Customer B: debt Rs.600,000, income Rs.300,000. Ratio = **2.0**. Same debt, very different risk; the ratio shows it, the raw columns do not.

### Worked example 2: cyclical hours

With raw hours, 23 and 1 look 22 apart, though they are 2 hours apart on the clock. Encode with sin and cos of 2π·hour/24:

| Hour | sin | cos |
|---|---|---|
| 23 | −0.259 | 0.966 |
| 0 | 0.000 | 1.000 |
| 1 | 0.259 | 0.966 |

Distance between hour 23 and hour 1 = √((0.259 − (−0.259))² + 0²) ≈ **0.52**, small, as it should be. (You need both sin and cos, otherwise two different hours could share a value.)

### Where you'll meet it in real work

A bank's credit model uses ratios like debt-to-income; a delivery app uses hour-of-day and is_weekend; a telecom uses recency, frequency and monetary (RFM).

### Common mistakes
- Building a feature from information not known at prediction time (leakage).
- Dividing by zero in a ratio (use `replace(0, np.nan)`).
- Adding hundreds of features without checking they help.

> **සිංහලෙන්:** Feature engineering කියන්නේ raw columns වලින් model එකට පහසුවෙන් තේරෙන අලුත් columns හදන එක. ණය රුපියල් 600,000ක් තියෙන දෙන්නෙක්ගෙන් එක්කෙනෙක්ගේ ආදායම වසරකට රුපියල් 1,200,000ක්, අනිත් කෙනාගේ 300,000ක්. debt_to_income අනුපාතය 0.5 සහ 2.0 වෙනවා, ඒකෙන් අවදානම පේනවා. පැය 23 සහ පැය 1 ඇත්තටම පැය 2ක් විතරයි ලඟ, ඒත් අංක විදිහට 22ක් දුර. ඒ නිසා sin සහ cos පාවිච්චි කරලා encode කරනවා. හොඳ feature එකක් ගොඩක් වෙලාවට අලුත් algorithm එකකටත් වඩා වැඩියි.

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

### Why it exists

More columns are not always better. Useless or duplicate features add noise, slow training, make results hard to explain and invite overfitting.

### Worked example: spotting a redundant pair

A housing table has `area_sqft` and `area_sqm`. One is simply the other multiplied by 0.0929, so their correlation is 1.00. Keep one, drop one: you lose no information and have one fewer column.

Variance threshold: if 999 of 1,000 customers have `country = "LK"`, the column almost never changes and cannot help separate customers, so drop it.

L1 (Lasso) regularisation: it pushes the weights of useless features to exactly 0, so the model selects features while it trains.

### A text picture: three families

```
Filter   : score each feature by statistics, before any model   (fast)
Wrapper  : train a model on subsets, keep the best subset       (slow, accurate)
Embedded : the training itself drops features (Lasso, trees)    (middle)
```

### Where you'll meet it in real work

Genomics or text data with thousands of columns and only hundreds of rows: without selection, models overfit badly.

### Exam angle
Frequent question: "Which method drives weights to exactly zero?" L1 / Lasso (L2 shrinks but rarely zeroes). And "which family trains many models on subsets?" Wrapper (for example RFE).

### Common mistakes
- Selecting features using the whole dataset, including the test set (leakage).
- Dropping a weak-looking feature that is strong only in combination with another.

> **සිංහලෙන්:** Features වැඩි වෙන එක හැමවිටම හොඳ නෑ. අනවශ්‍ය හෝ එකම දේ දෙපාරක් කියන columns නිසා model එක ලේසියෙන් overfit වෙනවා. `area_sqft` සහ `area_sqm` දෙකේ correlation එක 1.00යි, ඒ නිසා එකක් අයින් කළාට තොරතුරු නැති වෙන්නේ නෑ. Customers 1,000න් 999දෙනාටම එකම රට නම් ඒ column එකෙන් වැඩක් නෑ. L1 (Lasso) regularisation වලින් අනවශ්‍ය features වල weights හරියටම 0 වෙනවා. Features තෝරන්න test data පාවිච්චි කරන්න එපා.

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

### Why it exists

A model that cheats during testing looks brilliant and then fails in production. Naming the leaks helps you stop them before they ruin a project.

### Worked example: scaling before the split

Data: train rows [10, 20, 30] and test row [100].
- Correct: fit the mean on training only = (10 + 20 + 30) ÷ 3 = **20**. The test value 100 is judged against 20: it looks far away.
- Wrong: compute the mean on all four values = (10 + 20 + 30 + 100) ÷ 4 = **40**. The test row has pulled the mean towards itself. The model has "seen" a hint about the test set.

With one number the damage is small, but with many features and target encoding it can inflate accuracy a lot.

### A text picture: the right order

```
all data --> SPLIT --> train | test
                       |        |
          fit scaler, imputer, encoder ON TRAIN ONLY
                       |        |
               transform train  transform test (same numbers)
```

### Where you'll meet it in real work

A hospital model that predicts readmission using a field filled in at discharge is target leakage: the field is not known when the prediction is needed.

### Exam angle
Very common: "Accuracy is 99.5% on a hard problem; what is the most likely cause?" Data leakage. Also "random split on time-ordered data": time leakage.

### Common mistakes
- Preprocessing the whole dataset, then splitting.
- Forgetting that the same patient or customer can appear in both train and test.
- Using future rows when building lag features.

> **සිංහලෙන්:** Data leakage කියන්නේ prediction කරන වෙලාවේ නැති තොරතුරක් training එකට රිංගන එක. එවිට විභාගයට පෙර ප්‍රශ්න පත්‍රය දැකලා පාඩම් කරපු ළමයෙක් වගේ model එක test එකේ හොඳට පෙනෙනවා, ඒත් ඇත්ත ලෝකයේ අසාර්ථකයි. Train [10, 20, 30] සහ test [100] කියමු. Training වලින් විතරක් mean ගත්තොත් 20යි, හැම එකම එකතු කරලා ගත්තොත් 40යි, ඒ කියන්නේ test අගය mean එකට බලපෑවා. නීතිය: මුලින් split කරන්න, ඊට පස්සේ scaler, imputer හැම එකම training එකෙන් විතරක් fit කරන්න. Accuracy 99%ක් වගේ හොඳ වැඩියි නම් සැක කරන්න.

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

### Why it exists

Time-ordered data breaks the usual rule that rows are independent: today depends on yesterday. Special tools let you see trend and repeating patterns and build features that respect the order of time.

### Worked example: rolling mean and differencing

Daily sales over 7 days: 10, 12, 14, 13, 15, 17, 16.

3-day rolling mean:
- Days 1 to 3: (10 + 12 + 14) ÷ 3 = **12**
- Days 2 to 4: (12 + 14 + 13) ÷ 3 = **13**
- Days 3 to 5: (14 + 13 + 15) ÷ 3 = **14**
- Days 4 to 6: (13 + 15 + 17) ÷ 3 = **15**
- Days 5 to 7: (15 + 17 + 16) ÷ 3 = **16**

The smooth line 12, 13, 14, 15, 16 reveals the upward trend that the jagged raw numbers hide.

First differences (today − yesterday): 2, 2, −1, 2, 2, −1. They hover around a stable level, which is the idea behind making a series stationary.

Lag features: for day 5, `lag_1` = 13 (yesterday) and `lag_3` = 12 (three days ago).

### Where you'll meet it in real work

A supermarket forecasts rice demand per week, with a bump before Sinhala and Tamil New Year; an electricity board forecasts evening demand using hour, weekday and lags.

### Common mistakes
- Randomly shuffling the rows before train/test (the model sees the future).
- Building a rolling mean that includes today's own value; shift first.
- Assuming a pattern repeats without checking it (seasonality) across at least a couple of cycles.

> **සිංහලෙන්:** Time series කියන්නේ කාලය අනුව පෙළගැහුණු data, උදා: දවසින් දවස විකුණුම්. එයින් trend (දිගුකාලීනව ඉහළට යාම), seasonality (අවුරුද්දට කලින් විකුණුම් වැඩි වීම වගේ නැවත නැවත එන රටා) සහ noise වෙන් කරලා බලනවා. විකුණුම් 10, 12, 14, 13, 15, 17, 16 කියමු. දවස් 3ක rolling mean එක 12, 13, 14, 15, 16 වෙනවා, ඒකෙන් ඉහළ යන trend එක පැහැදිලිව පේනවා. Time series train/test වලට කවදාවත් random shuffle කරන්න එපා: අතීතයෙන් train කරලා අනාගතයෙන් test කරන්න.

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

### Why it exists

A great model that does not move a business number is a hobby. These metrics are the language managers use, so you must speak it to show your work matters.

### Worked example 1: profit margin, NPS, stickiness

- **Margin:** revenue Rs.2,000,000, costs Rs.1,500,000 → profit 500,000 → margin = 500,000 ÷ 2,000,000 = **25%**.
- **NPS:** 100 people answer; 50 score 9 to 10 (promoters), 30 score 7 to 8, 20 score 0 to 6 (detractors) → NPS = 50% − 20% = **30**.
- **Stickiness:** 2,000 daily active users, 8,000 monthly → DAU ÷ MAU = **25%**.
- **ARPU:** revenue Rs.4,000,000 from 8,000 users → **Rs.500** per user.

### Worked example 2: retention and the funnel

Funnel: 10,000 visit → 1,500 add to cart (15%) → 600 checkout (40%) → 450 pay (75%). The weakest step by rate is visit → cart (15%), so start there; the checkout step (40%) is the next place to look.

### Where you'll meet it in real work

A churn model's report always ends with money: "calling the 2,000 riskiest customers should save about X customers, worth Rs.Y, for a call-centre cost of Rs.Z".

### Common mistakes
- Quoting accuracy to a manager instead of rupees saved.
- Mixing up churn rate (lost ÷ start) with retention (1 − churn).
- Using the LTV formula with churn of 0 (infinite lifetime).

> **සිංහලෙන්:** හොඳ model එකක් business අංකයක් වෙනස් කරන්නේ නැත්නම් වැඩක් නෑ, ඒ නිසා manager ලා කතා කරන භාෂාව දැනගන්න ඕනේ. ආදායම රුපියල් 2,000,000ක්, වියදම 1,500,000ක් නම් ලාභය 500,000යි, margin එක 25%ක්. NPS සඳහා 100දෙනාගෙන් 50දෙනෙක් promoters, 20දෙනෙක් detractors නම් 50 − 20 = 30යි. Funnel එකක 10,000න් 1,500ක් cart එකට එනවා, ඒ 15%ක්, එතනයි වැඩියෙන්ම අහිමි වෙන්නේ. ඔයාගේ model එකෙන් රුපියල් කීයක් ඉතිරි වෙයිද කියලා හැම වෙලාවකම ගණන් බලන්න.

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

### Why it exists

Seeing the whole pipeline in one place shows how the earlier sections connect: load, clean, explore, engineer, encode, then hand over to modelling.

### A text picture: the flow of that code

```
telco_churn.csv
   |  load
   v
clean names, fix types, drop duplicates, label 'Yes' -> 1
   |  EDA: 27% churn, month-to-month churns most
   v
new features: avg_monthly_spend, is_new, n_services
   |  one-hot encode
   v
X (features) , y (churn)  -->  split, scale in a pipeline, train (files 11-13)
```

### Worked example: one feature by hand

A customer with `totalcharges` = 600 and `tenure` = 12 months: `avg_monthly_spend` = 600 ÷ 12 = **50**. A brand-new customer has `tenure` = 0, so dividing would fail; the code replaces 0 by NaN and then fills in `monthlycharges` instead.

### Where you'll meet it in real work

This is the shape of a real first-week task: your notebook has these sections, and a teammate can re-run it from top to bottom.

### Exam angle
Know the order: split before fitting scalers, imputers and target encoders. In this end-to-end sketch, `get_dummies` is applied before the split for brevity; in a production pipeline wrap encoding in a scikit-learn Pipeline so all learned steps fit on training data only.

### Common mistakes
- Skipping the write-up of EDA findings that justify each feature.
- Doing the final modelling step on data that was cleaned using the test rows.

> **සිංහලෙන්:** මේ උදාහරණයෙන් data science වැඩේ මුල ඉඳන් අග දක්වා පේනවා: file එක load කරනවා, clean කරනවා, EDA කරනවා, අලුත් features හදනවා, categories encode කරනවා, ඊට පස්සේ modelling වලට දෙනවා. උදාහරණයක් විදිහට totalcharges 600යි, tenure මාස 12යි නම් avg_monthly_spend = 600 ÷ 12 = 50යි. අලුත් customer කෙනෙක්ගේ tenure 0 නම් බෙදන්න බෑ, ඒ නිසා ඒ අයගේ monthlycharges දානවා. ඇත්ත project එකකදී encoding සහ scaling හැමදේම split කරපු පස්සේ training එකෙන් විතරක් fit කරන්න Pipeline එකක් පාවිච්චි කරන්න.

```quiz
[
{"q": "Which statement about CRISP-DM is correct?", "options": ["It is a loop; evaluation often sends you back to earlier phases", "It is a strict one-way sequence of 6 steps", "It only covers modelling", "Deployment comes before data preparation"], "answer": 0, "why": "CRISP-DM has six phases (business understanding, data understanding, data preparation, modelling, evaluation, deployment) and you often loop back, for example when evaluation shows the data needs more work. The 'one-way' answer is the tempting wrong one."},
{"q": "Ages are 22, 25, blank, 31, 90, blank. Which value is a more typical fill for the blanks, and what is it?", "options": ["Mean = 42", "Zero", "Median = 28", "The maximum, 90"], "answer": 2, "why": "Known values 22, 25, 31, 90: median = (25 + 31) / 2 = 28, while the mean is 168 / 4 = 42, dragged up by 90. With an extreme value the median is more typical. Filling with 0 invents a fake age."},
{"q": "Salaries (Rs. thousand) 40, 45, 48, 50, 52, 55, 58, 60, 400 have Q1 = 46.5 and Q3 = 59. What is the upper IQR fence?", "options": ["59 + 12.5 = 71.5", "59 x 1.5 = 88.5", "400", "59 + 1.5 x 12.5 = 77.75"], "answer": 3, "why": "IQR = 59 - 46.5 = 12.5, and the fence is Q3 + 1.5 x IQR = 59 + 18.75 = 77.75. Using 1 x IQR or multiplying Q3 are common slips."},
{"q": "A city column has Colombo, Kandy, Galle and the model is linear. Which encoding is best?", "options": ["Label encoding 0, 1, 2", "One-hot encoding", "Leave it as text", "Replace by the longest name"], "answer": 1, "why": "Cities have no order, so one-hot avoids a fake ranking. Label encoding would tell a linear model that Galle is twice Kandy."},
{"q": "Ages [20, 30, 40, 50, 60] are min-max scaled. What is 50 after scaling?", "options": ["0.75", "0.5", "1.0", "0.25"], "answer": 0, "why": "(50 - 20) / (60 - 20) = 30 / 40 = 0.75. 0.5 is the value for age 40, the middle."},
{"q": "You compute the mean and std on the whole dataset, scale, and only then split into train and test. What is the problem?", "options": ["Nothing, it is standard practice", "The scaler will crash", "Preprocessing leakage: test information influenced the training", "Accuracy will drop"], "answer": 2, "why": "The test rows helped define the mean and std, so the test set is no longer unseen. Split first, fit on training only, then transform the test set with the same numbers."},
{"q": "Average customer pays Rs.2,000 a month and monthly churn is 4%. Estimate CLV.", "options": ["Rs.8,000", "Rs.50,000", "Rs.80,000", "Rs.500"], "answer": 1, "why": "Lifetime = 1 / 0.04 = 25 months, so CLV = 25 x 2,000 = Rs.50,000. Rs.80,000 would come from multiplying by churn the wrong way (2,000 x 40)."},
{"q": "Daily sales are 10, 12, 14, 13, 15. What is the 3-day rolling mean for days 3 to 5?", "options": ["13", "15", "12", "14"], "answer": 3, "why": "(14 + 13 + 15) / 3 = 42 / 3 = 14. The value 13 is the mean of days 2 to 4."}
]
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

**Q10.** Sales are 8, 10, 12, 11. Compute the first differences and the 2-day rolling mean for days 2 to 4.
<details><summary>Answer</summary>Differences: 10−8 = 2, 12−10 = 2, 11−12 = −1. Rolling mean (2-day): (8+10)/2 = 9, (10+12)/2 = 11, (12+11)/2 = 11.5.</details>

**Q11.** Revenue is Rs.800,000 and costs Rs.600,000. What is the profit margin?
<details><summary>Answer</summary>Profit = 200,000; margin = 200,000 ÷ 800,000 = 25%.</details>

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
| JSON | Key-value text format most APIs reply with |
| IQR fence | The Q1 − 1.5×IQR and Q3 + 1.5×IQR limits outside which a point is an outlier |
| Rolling mean | Average of the last k values, used to smooth noise |

**🎉 You've finished Part B: Data Science!**

**Mini project for Part B:** pick a Kaggle dataset you find interesting. Produce a Jupyter notebook that: states a business question → cleans the data (documenting each decision) → does EDA with at least 6 meaningful charts → engineers 5+ new features → ends with 3 insights and 1 recommendation written for a manager. Push it to GitHub.

**Next:** [11-ml-fundamentals.md](11-ml-fundamentals.md)
