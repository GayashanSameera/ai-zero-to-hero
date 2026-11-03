# 09: Data Visualization: Seeing Your Data

> **Before you start:** [07](07-math-probability-statistics.md) (distributions, skewness, quartiles, box plots, correlation), [08](08-numpy-and-pandas.md) (Pandas DataFrames, groupby).
>
> **After this file you can:** pick the right chart for any question, draw it with Matplotlib, Seaborn or Plotly, avoid misleading charts, and use visuals to tell a clear story to non-technical people.

---

## Table of contents

1. [Why visualise?](#1-why-visualise)
2. [Choosing the right chart](#2-choosing-the-right-chart)
3. [Matplotlib basics](#3-matplotlib-basics)
4. [Line charts](#4-line-charts)
5. [Bar charts](#5-bar-charts)
6. [Histograms](#6-histograms)
7. [Box plots and violin plots](#7-box-plots-and-violin-plots)
8. [Scatter plots](#8-scatter-plots)
9. [Heatmaps and correlation matrices](#9-heatmaps)
10. [Seaborn: statistical charts made easy](#10-seaborn)
11. [Subplots: several charts together](#11-subplots)
12. [Plotly: interactive charts](#12-plotly-interactive-charts)
13. [Charts you'll see in ML](#13-charts-youll-see-in-ml)
14. [Design rules and misleading charts](#14-design-rules-and-misleading-charts)
15. [Storytelling with data and dashboards](#15-storytelling-and-dashboards)
16. [Check yourself](#16-check-yourself)
17. [New words in this file](#17-new-words-in-this-file)

---

## 1. Why visualise?

**Anscombe's quartet** is a famous example: four small datasets with **the same** mean, variance and correlation (r = 0.82), but completely different shapes when plotted: one is a nice line, one is a curve, one has a single outlier, and one is a vertical stack with one far point.

> **Summary statistics can lie. Always plot your data.**

Visualisation helps you:
1. **Explore:** find patterns, outliers, mistakes (during EDA, [file 10](10-data-science-workflow.md))
2. **Check models:** see whether training is working (loss curves, section 13)
3. **Communicate:** convince managers and clients

---

## 2. Choosing the right chart

| Your question | Chart |
|---|---|
| How does something change over **time**? | **Line chart** |
| How do **categories compare**? | **Bar chart** (horizontal if names are long) |
| What's the **distribution** of one numeric variable? | **Histogram**, density plot (KDE) |
| Compare **distributions across groups**? | **Box plot**, violin plot |
| **Relationship** between two numeric variables? | **Scatter plot** |
| Relationships among **many** variables? | **Correlation heatmap**, pair plot |
| **Parts of a whole**? | Stacked bar (or a pie chart if ≤ 4 slices) |
| Data on a **map**? | Choropleth map |
| A single key number? | Big number "KPI card" |

**Pie charts:** humans are bad at comparing angles. Use a bar chart unless there are just 2 to 4 parts and the message is "one part dominates".

---

## 3. Matplotlib basics

**Matplotlib** is the foundational Python plotting library. Seaborn and Pandas plotting are built on top of it.

```python
import matplotlib.pyplot as plt

x = [1, 2, 3, 4, 5]
y = [2, 4, 5, 4, 6]

fig, ax = plt.subplots(figsize=(8, 4))   # fig = whole picture, ax = one chart area
ax.plot(x, y)
ax.set_title("My first chart")
ax.set_xlabel("Day")
ax.set_ylabel("Sales")
plt.show()
fig.savefig("chart.png", dpi=150, bbox_inches="tight")   # save to a file
```

**Anatomy:**
```
┌──────────── Figure (fig) ───────────────┐
│  Title                                   │
│  ┌──────── Axes (ax) ─────────────┐     │
│ y│                    ╱╲   ── legend    │
│ l│          ╱╲      ╱  ╲               │
│ a│    ╱╲  ╱   ╲  ╱                     │
│ b│  ╱   ╲╱      ╲╱                      │
│ e└────────────────────────────────┘     │
│ l          x label (ticks below)         │
└──────────────────────────────────────────┘
```

- **Figure:** the whole image.
- **Axes:** one plot inside it (a figure can hold several).
- **Axis:** the x or y number line, with **ticks** and **labels**.
- **Legend:** explains colours/lines.

Pandas can plot directly: `df["sales"].plot()`, `df.plot(kind="bar", x="city", y="total")`.

---

## 4. Line charts

**For:** trends over time (sales per month, training loss per epoch).

```python
import pandas as pd
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
shop_a = [120, 135, 150, 145, 170, 190]
shop_b = [100, 110, 105, 130, 125, 140]

fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(months, shop_a, marker="o", label="Shop A")
ax.plot(months, shop_b, marker="s", linestyle="--", label="Shop B")
ax.set_title("Monthly sales")
ax.set_ylabel("Units sold")
ax.legend()
ax.grid(alpha=0.3)
plt.show()
```

Tip: a line implies continuity. Don't use lines to connect unrelated categories (use bars).

---

## 5. Bar charts

**For:** comparing amounts across categories.

```python
cities = ["Colombo", "Kandy", "Galle", "Jaffna"]
revenue = [520, 310, 180, 150]

fig, ax = plt.subplots()
ax.bar(cities, revenue, color="steelblue")
ax.set_ylabel("Revenue ($k)")
ax.set_title("Revenue by city")
for i, v in enumerate(revenue):               # write values on top of bars
    ax.text(i, v + 5, str(v), ha="center")
plt.show()

ax.barh(cities, revenue)                       # horizontal version
```

**Rules:**
- **Bar charts must start at zero** on the value axis. Otherwise small differences look huge (section 14).
- **Sort bars** by value (unless the categories have a natural order, like months).
- **Grouped bars:** compare subgroups side by side. **Stacked bars:** show composition.

---

## 6. Histograms

**For:** the **distribution** of one numeric variable: where values cluster, the spread, skewness, outliers ([file 07](07-math-probability-statistics.md#5-shape-skewness)).

A histogram splits the range into **bins** (intervals) and counts how many values fall in each.

```python
import numpy as np
rng = np.random.default_rng(0)
heights = rng.normal(170, 10, 1000)          # normal distribution
incomes = rng.lognormal(10, 0.8, 1000)       # right-skewed

fig, axes = plt.subplots(1, 2, figsize=(10, 4))
axes[0].hist(heights, bins=30, edgecolor="white")
axes[0].set_title("Heights (symmetric)")
axes[1].hist(incomes, bins=30, edgecolor="white")
axes[1].set_title("Incomes (right-skewed)")
plt.show()
```

**Bin count matters:** too few bins hide detail; too many make noise. Try 20 to 50 and adjust.

**KDE (Kernel Density Estimate):** a smooth curve version of a histogram (`sns.kdeplot`, section 10).

**Histogram vs bar chart:** histograms are for continuous numbers (bars touch); bar charts are for categories (bars separated).

---

## 7. Box plots and violin plots

**Box plot** ([file 07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers)): shows median, quartiles (the box), whiskers (up to 1.5×IQR), and outliers (dots). Great for **comparing distributions across groups**.

```python
import seaborn as sns
tips = sns.load_dataset("tips")              # built-in sample dataset
sns.boxplot(data=tips, x="day", y="total_bill")
plt.show()
```

**Violin plot:** a box plot plus a mirrored density curve, so it shows the full distribution shape (e.g. two peaks).

```python
sns.violinplot(data=tips, x="day", y="total_bill")
```

---

## 8. Scatter plots

**For:** the relationship between two numeric variables. Each point is one row.

```python
fig, ax = plt.subplots()
ax.scatter(tips["total_bill"], tips["tip"], alpha=0.6)   # alpha = transparency (helps with overlap)
ax.set_xlabel("Total bill ($)")
ax.set_ylabel("Tip ($)")
plt.show()

# colour by a category, add a regression line (Seaborn)
sns.scatterplot(data=tips, x="total_bill", y="tip", hue="time")
sns.regplot(data=tips, x="total_bill", y="tip", scatter=False)
```

What to look for:
- **Direction:** up = positive correlation, down = negative ([file 07](07-math-probability-statistics.md#14-covariance-and-correlation))
- **Shape:** straight line or curve?
- **Strength:** tight cloud = strong; fuzzy = weak
- **Outliers** and **clusters** (separate groups of points)

With huge data (millions of points), use transparency, sampling, or a **hexbin** / 2-D density plot.

---

## 9. Heatmaps

A **heatmap** shows a grid of numbers as colours. Most common use: the **correlation matrix**.

```python
num = tips.select_dtypes("number")
corr = num.corr()
sns.heatmap(corr, annot=True, fmt=".2f", cmap="coolwarm", vmin=-1, vmax=1)
plt.title("Correlation matrix")
plt.show()
```

- `annot=True` writes the numbers in the cells
- `cmap="coolwarm"`: blue for negative, red for positive, white near 0. Use a **diverging** colour map for data with a meaningful middle (like correlation's 0).

Heatmaps are also used for **confusion matrices** (file 13) and **attention maps** in transformers (file 19).

---

## 10. Seaborn

**Seaborn** is built on Matplotlib, works directly with Pandas DataFrames, and makes statistical charts in one line, with nicer default styles.

```python
import seaborn as sns
sns.set_theme(style="whitegrid")

sns.histplot(data=tips, x="total_bill", kde=True)              # histogram + KDE
sns.histplot(data=tips, x="total_bill", hue="sex", kde=True)   # split by group
sns.countplot(data=tips, x="day")                              # bar of counts
sns.barplot(data=tips, x="day", y="total_bill")                # mean with error bars (confidence interval)
sns.lineplot(data=df, x="date", y="sales", hue="store")
sns.pairplot(tips, hue="sex")                 # scatter of every pair of numeric columns + histograms
sns.lmplot(data=tips, x="total_bill", y="tip", hue="smoker")   # scatter + regression lines
```

**The `hue` argument** colours by a category: the easiest way to compare groups.

**Error bars** in `barplot` show a 95% confidence interval ([file 07](07-math-probability-statistics.md#17-confidence-intervals)) by default: if two groups' error bars overlap a lot, the difference may not be real.

---

## 11. Subplots

```python
fig, axes = plt.subplots(2, 2, figsize=(10, 8))   # 2×2 grid
axes[0, 0].hist(tips["total_bill"]); axes[0, 0].set_title("Bill")
axes[0, 1].hist(tips["tip"]);        axes[0, 1].set_title("Tip")
sns.boxplot(data=tips, x="day", y="tip", ax=axes[1, 0])     # Seaborn: pass ax=
sns.scatterplot(data=tips, x="total_bill", y="tip", ax=axes[1, 1])
plt.tight_layout()       # prevent overlapping labels
plt.show()
```

---

## 12. Plotly: interactive charts

**Plotly** makes interactive charts (hover for values, zoom, pan) that work in notebooks and web apps.

```python
import plotly.express as px
fig = px.scatter(tips, x="total_bill", y="tip", color="day",
                 size="size", hover_data=["time"])
fig.show()

fig = px.line(df, x="date", y="sales", color="store")
fig.write_html("chart.html")    # share as a web page
```

| Library | Best for |
|---|---|
| Matplotlib | Full control; publication figures; foundation of everything |
| Seaborn | Fast statistical exploration with Pandas |
| Plotly | Interactive charts, dashboards, web |

---

## 13. Charts you'll see in ML

You'll draw these again and again in later files:

| Chart | Shows | File |
|---|---|---|
| **Loss curves** (training & validation loss vs epoch) | Is the model learning? Overfitting? | 11, 15 |
| **Confusion matrix** heatmap | Which classes get confused | 13 |
| **ROC curve** and **Precision-Recall curve** | Classifier quality across thresholds | 13 |
| **Feature importance** bar chart | Which features matter most | 12, 14 |
| **Residual plot** (errors vs predictions) | Problems in regression models | 13 |
| **Learning curve** (score vs training-set size) | Would more data help? | 13 |
| **Elbow plot** | Choosing the number of clusters | 14 |
| **t-SNE / UMAP scatter** | High-dimensional data squashed to 2-D | 14, 18 |
| **Attention heatmap** | What tokens a transformer focuses on | 19 |

**Preview: a loss curve**
```python
epochs = range(1, 21)
train_loss = [1/e + 0.05 for e in epochs]
val_loss = [1/e + 0.05 + max(0, (e - 10) * 0.02) for e in epochs]
plt.plot(epochs, train_loss, label="train")
plt.plot(epochs, val_loss, label="validation")
plt.xlabel("epoch"); plt.ylabel("loss"); plt.legend(); plt.show()
# validation loss rising after epoch 10 = overfitting (file 11)
```

---

## 14. Design rules and misleading charts

### Good design rules

1. **Every chart needs a title, axis labels and units.** ("Revenue ($k)", not "rev")
2. **One message per chart.** Put the message in the title: "Colombo brings in half our revenue" beats "Revenue by city".
3. **Remove clutter** (heavy gridlines, 3-D effects, shadows). Maximise "ink" that shows data.
4. **Use colour purposefully:** grey for everything, one bright colour for the thing you want people to notice.
5. **Colour-blind-friendly palettes** (about 8% of men are colour-blind): avoid red vs green as the only difference. Seaborn's `"colorblind"` palette helps.
6. **Sort categories** meaningfully.
7. **Label directly** on the chart instead of forcing people to look at a legend, when possible.

### How charts mislead (spot these, never do them)

| Trick | Effect |
|---|---|
| **Truncated y-axis on bar charts** | A 2% difference looks like 200% |
| **Dual y-axes** with different scales | You can make any two lines look related |
| **Cherry-picked time range** | Show only the period that supports your story |
| **3-D pie charts** | Distort slice sizes |
| **Area/size scaled by both width and height** | Doubling looks like quadrupling |
| **Not adjusting for population** | "Most accidents happen in Colombo" (it also has the most people). Use rates per person. |

```
Truncated axis (misleading)       Honest axis
 52 ┤      ██                     60 ┤
 51 ┤      ██                        │  ██  ██
 50 ┤ ██   ██                     30 ┤  ██  ██
    └─────────                     0 ┼──██──██──
      A    B                           A    B
 "B is way bigger!"               "about the same"
```

---

## 15. Storytelling and dashboards

### Storytelling with data

Managers don't want charts; they want **answers and decisions**. Structure:

1. **Context:** what question are we answering, and why does it matter?
2. **Insight:** the one key finding, with the chart that proves it.
3. **Recommendation:** what should we do?

**Example:**
> "Customer churn rose from 3% to 5% this quarter (context). Almost all of the increase comes from customers on the old pricing plan, who churn at 3× the rate of others (insight + chart). We recommend migrating them to the new plan with a one-month discount, which we estimate retains about 400 customers ($80k/year) (recommendation)."

**Know your audience:** executives want the bottom line; engineers want methods; everyone wants it short.

### Dashboards

A **dashboard** is a page of charts and key numbers that updates automatically, so people can monitor things themselves.

- **KPIs (Key Performance Indicators):** the few numbers that matter most (revenue, active users, churn rate). Covered in [file 10](10-data-science-workflow.md).
- **BI (Business Intelligence) tools:** Tableau, Power BI, Looker, Metabase: drag-and-drop dashboards, common for analysts.
- **Python dashboards:** Streamlit, Dash, Gradio (file 28).

**Good dashboard rules:** the most important numbers at the top-left; consistent colours; show comparisons (vs last month, vs target); don't cram more than ~6 to 8 charts.

---

## 16. Check yourself

**Q1.** Which chart for: (a) monthly users over 2 years, (b) revenue by product category, (c) distribution of customer ages, (d) relationship between ad spend and sales, (e) comparing salary distributions across 5 departments?
<details><summary>Answer</summary>(a) line, (b) bar (sorted), (c) histogram, (d) scatter, (e) box or violin plot.</details>

**Q2.** Why must bar charts start at zero?
<details><summary>Answer</summary>Bar length represents the value. Cutting the axis exaggerates differences and misleads.</details>

**Q3.** Two datasets have the same mean, std and correlation. Are they the same?
<details><summary>Answer</summary>Not necessarily (Anscombe's quartet). Plot them.</details>

**Q4.** What does the `hue` argument in Seaborn do?
<details><summary>Answer</summary>Colours points/bars/lines by a categorical column, so you can compare groups.</details>

**Q5.** Which colour map type for a correlation heatmap and why?
<details><summary>Answer</summary>A diverging map (e.g. coolwarm), because correlation has a meaningful centre (0) with negative and positive sides.</details>

**Q6.** Rewrite the title "Sales by Region" as a message title, given the West region doubled its sales.
<details><summary>Answer</summary>e.g. "West region sales doubled this year, while others stayed flat".</details>

---

## 17. New words in this file

| Word | Meaning |
|---|---|
| Anscombe's quartet | Same statistics, very different plots |
| Matplotlib / Seaborn / Plotly | Base plotting / statistical plotting / interactive plotting libraries |
| Figure, Axes, axis, ticks, legend | Parts of a chart |
| Line, bar, histogram, box, violin, scatter chart | Common chart types |
| Grouped / stacked bars | Side-by-side / piled subgroups |
| Bin | Interval used in a histogram |
| KDE | Smooth density curve |
| Hexbin | Density plot for many points |
| Heatmap | Grid of numbers shown as colours |
| Diverging / sequential colour map | Two-sided colours around a centre / light-to-dark |
| Pair plot | Scatter of every pair of variables |
| Error bars | Show uncertainty (e.g. 95% CI) |
| `hue` | Colour-by-category argument |
| Subplots, `tight_layout` | Several charts in one figure / fix spacing |
| Loss curve, confusion matrix, ROC curve, residual plot, learning curve, elbow plot | ML diagnostic charts (later files) |
| Truncated axis, dual axis, cherry-picking | Misleading chart tricks |
| Data storytelling | Context → insight → recommendation |
| Dashboard, KPI | Auto-updating page of charts / key metric |
| BI tools (Tableau, Power BI, Looker) | Business dashboard software |

**Next:** [10-data-science-workflow.md](10-data-science-workflow.md)
