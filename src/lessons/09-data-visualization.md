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

### Why it exists

A table of 1,000 numbers is almost impossible for a human to read, but the eye spots a pattern in a picture in under a second. Charts exist to move the work from your slow reading to your fast seeing.

### Worked example: same numbers, different story

Two shops each sold the following units over 5 days:

| | Mon | Tue | Wed | Thu | Fri | Total | Mean |
|---|---|---|---|---|---|---|---|
| Shop X | 100 | 100 | 100 | 100 | 100 | 500 | 500 ÷ 5 = **100** |
| Shop Y | 0 | 0 | 0 | 0 | 500 | 500 | 500 ÷ 5 = **100** |

Both have a mean of 100. But Shop X sells steadily, while Shop Y was closed four days and had one huge Friday. A one-line `describe()` would not show this; a bar chart shows it instantly. That is Anscombe's quartet in miniature.

### Where you'll meet it in real work

A bank analyst plots daily card transactions before building a fraud model. A sudden spike at 3 a.m. that the average hid is the first clue.

### Common mistakes
- Trusting `df.describe()` alone and never plotting.
- Plotting only after the model is built. Plot first (EDA), and again after (loss curves).

> **සිංහලෙන්:** අංක ටිකක සාරාංශයක් (mean වගේ) බලලා data එක තේරුණා කියලා හිතන්න එපා. කඩේ දෙකක් දවස් 5ක් ඇතුළත භාණ්ඩ 500 බැගින් විකුණුවා කියමු. එක කඩේක හැම දවසකම 100යි, අනික් කඩේ දවස් හතරක් වහලා, සිකුරාදා දවසේ විතරක් 500ක් විකුණලා. දෙකේම mean එක 100යි, ඒත් කතාව සම්පූර්ණයෙන්ම වෙනස්. Chart එකක් අඳිනකොට ඒ වෙනස තත්පරයෙන් පේනවා, ඒ නිසා model එකක් හදන්න කලින් හැම වෙලාවෙම data එක plot කරන්න.

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

### Why it exists

Picking the wrong chart hides the answer or, worse, gives a wrong one. The table above turns "what do I draw?" into "what question am I asking?".

### Worked example: matching question to chart

A Daraz-style seller has this data. Which chart for each question?

| Question | Chart | Why |
|---|---|---|
| Daily orders over 30 days | Line | Time on the x-axis, a trend to see |
| Orders by 6 product categories | Sorted horizontal bar | Names are long, comparison by length |
| Spread of delivery times in days | Histogram | One numeric variable, want its shape |
| Delivery time for 4 courier companies | Box plot | Compare distributions across groups |
| Price (Rs.) vs number of sales | Scatter | Two numbers, look for a relationship |

### Where you'll meet it in real work

In an interview or at work, a manager asks one question ("is Kandy slower than Galle?"). Your first job is to decide the chart type before writing any code.

### Common mistakes
- Using a line chart for unrelated categories (the line implies a link between "Colombo" and "Kandy").
- Using a pie chart with 8 slices that all look the same size.

> **සිංහලෙන්:** Chart එකක් තෝරන්න කලින් ඔයාගෙන්ම අහගන්න ඕනේ "මම දැනගන්න හදන්නේ මොකක්ද?" කියලා. කාලයත් එක්ක වෙනස් වෙන දෙයක් (දවස් 30ක orders) නම් line chart එකක්. Category කිහිපයක් සසඳන්න (product වර්ග 6ක orders) නම් bar chart එකක්. Courier සමාගම් 4ක් අතර delivery වෙලාවල් සසඳන්න නම් box plot එකක්. අංක දෙකක් අතර සම්බන්ධය (මිල සහ විකුණුම්) බලන්න නම් scatter plot එකක්. හරි chart එක තෝරාගත්තාම අඩක් වැඩේ ඉවරයි.

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

### Why it exists

Every plotting library in Python (Seaborn, Pandas plots, even Plotly's older helpers) sits on Matplotlib. If you understand figure and axes once, all the others make sense.

### A text picture: the two ways to write Matplotlib

```
Quick way (pyplot style)          Clear way (object style, used in this file)
plt.plot(x, y)                    fig, ax = plt.subplots()
plt.title("Sales")                ax.plot(x, y)
plt.show()                        ax.set_title("Sales")
                                  plt.show()
Fine for one chart.               Needed when you have several charts.
```

Note the small naming difference: on `plt` you write `plt.title(...)`, but on an axes object you write `ax.set_title(...)`.

### Where you'll meet it in real work

Every data scientist's notebook starts with `import matplotlib.pyplot as plt`. Saving a figure to a PNG for a report or slide is a daily job.

### Common mistakes
- Calling `plt.show()` before `savefig`. In many setups `show()` closes the figure, so the saved file is blank. Safer: call `fig.savefig(...)` first, then `plt.show()`.
- Forgetting axis labels and units.
- Mixing the two styles in one script and getting charts drawn in the wrong place.

> **සිංහලෙන්:** Matplotlib කියන්නේ Python වල chart අඳින මුල්ම library එක, Seaborn වගේ අනිත් ඒවා හදලා තියෙන්නේ ඒක උඩ. Figure එක කියන්නේ මුළු පින්තූරය, Axes එක කියන්නේ ඒක ඇතුළේ තනි chart එක. පැන්සලකුයි කොළයකුයි වගේ, ඕනෙම දෙයක් අඳින්න පුළුවන් ඒත් හැම ඉරක්ම ඔයාම අඳින්න ඕනේ. Chart එක file එකකට save කරන්නේ නම් `plt.show()` කරන්න කලින් `fig.savefig("chart.png")` කරන්න, නැත්නම් හිස් පින්තූරයක් ලැබෙන්න පුළුවන්.

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

### Why it exists

Many questions are "is it going up or down?". A line joins consecutive points, so the eye follows the direction and sees the trend without reading each number.

### Worked example: reading Shop A

Shop A sold 120 units in January and 190 in June.
1. Total change = 190 − 120 = **70 units**.
2. Percentage change = 70 ÷ 120 = 0.583 → **about 58%** growth.
3. Average gain per month = 70 ÷ 5 gaps between 6 months = **14 units per month**.
4. April dipped (150 → 145), so growth was not perfectly smooth. The line shows that dip; the 58% number hides it.

### Where you'll meet it in real work

A shop in Sri Lanka plots monthly sales and sees a jump every April (Sinhala and Tamil New Year shopping) and December. That seasonal pattern guides how much stock to order.

### Common mistakes
- Putting dates out of order, so the line zig-zags backwards.
- Drawing 10 lines at once ("spaghetti chart"). Highlight one line in colour and grey the others.

### Exam angle
Training and validation loss curves (section 13) are line charts. Exams ask you to read them: both falling together is healthy; validation rising while training falls is overfitting.

> **සිංහලෙන්:** Line chart එක පාවිච්චි කරන්නේ කාලයත් එක්ක දෙයක් වෙනස් වෙන හැටි බලන්න. Shop A එක ජනවාරි වල 120ක් විකුණලා, ජූනි වල 190ක් විකුණනවා කියමු. වැඩි වීම 190 − 120 = 70යි, ඒක 70 ÷ 120 ඒ කියන්නේ 58% ක් විතර. අප්‍රේල් වල පොඩි අඩු වීමක් (150 ඉඳන් 145) තියෙනවා, ඒක සංඛ්‍යාවෙන් නොපෙනුණාට line එකේ පේනවා. අවුරුද්ද කාලේ සහ දෙසැම්බර් වල විකුණුම් උඩ යන එක මේ වගේ chart එකකින් ලේසියෙන් අල්ලගන්න පුළුවන්.

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

### Why it exists

To compare amounts across separate categories, the eye compares bar lengths very accurately. That is why bars beat pies and bubbles.

### Worked example: share of revenue

Revenue ($k): Colombo 520, Kandy 310, Galle 180, Jaffna 150.
1. Total = 520 + 310 + 180 + 150 = **1,160**.
2. Colombo's share = 520 ÷ 1,160 = 0.448 → **about 45%**.
3. Colombo vs Jaffna = 520 ÷ 150 = **3.5 times** bigger.
4. Message title: "Colombo brings in almost half of our revenue".

If the axis started at 100 instead of 0, Jaffna's bar would look nearly empty (50 vs 420 tall), an 8.4× difference instead of the true 3.5×. That is why bars start at zero.

```
Revenue ($k)
Colombo ████████████████████████████ 520
Kandy   ████████████████ 310
Galle   █████████ 180
Jaffna  ████████ 150
```

### Where you'll meet it in real work

Sales teams, hospitals (patients per ward) and telecoms (complaints per region) all use sorted bar charts in weekly reports.

### Common mistakes
- Starting the value axis above zero.
- Leaving categories in random order, so the reader must hunt for the biggest.
- Using bars for a histogram or a histogram for categories (bars touch only in a histogram).

> **සිංහලෙන්:** Bar chart එකේදී අපි බලන්නේ bar එකේ දිග, ඒ නිසා ඒක සෑමවිටම බිංදුවෙන් පටන් ගන්න ඕනේ. නගර හතරේ ආදායම කොළඹ 520, මහනුවර 310, ගාල්ල 180, යාපනය 150 (ඩොලර් දහස් වලින්) කියමු. මුළු එකතුව 1,160යි, කොළඹ කොටස 520 ÷ 1,160 ඒ කියන්නේ 45% ක් විතර. Axis එක 100න් පටන් ගත්තොත් යාපනයේ bar එක පොඩි ඉරක් වගේ පේනවා, ඇත්තටම වෙනස 3.5 ගුණයක් විතරයි. Bars අගය අනුව sort කරන්නත් අමතක කරන්න එපා.

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

### Why it exists

A single average hides the shape of the data. A histogram shows where most values sit, how far they spread and whether a long tail exists.

### Worked example: building a histogram by hand

Ten students' marks: 35, 42, 48, 51, 55, 58, 62, 67, 71, 88. Use bins of width 20.

| Bin | Marks that fall in it | Count |
|---|---|---|
| 30 to 49 | 35, 42, 48 | 3 |
| 50 to 69 | 51, 55, 58, 62, 67 | 5 |
| 70 to 89 | 71, 88 | 2 |
| | **Total** | **10** |

```
30-49 | ███
50-69 | █████
70-89 | ██
```

Most students are in the middle bin. With width 5 instead of 20 you would see more detail; with width 60 you would see one single bar and learn nothing.

### Where you'll meet it in real work

An insurer plots claim amounts. The right-skewed histogram (many small claims, a few huge ones) tells them to use the median, not the mean, and to consider a log transform ([file 10](10-data-science-workflow.md#7-handling-outliers)).

### Common mistakes
- One bad bin count that hides a second peak (two groups mixed together).
- Reading a histogram like a bar chart of categories.

> **සිංහලෙන්:** Histogram එක හදන්නේ අගයන් පරාස (bins) වලට බෙදලා එක එක පරාසයේ කීයක් තියෙනවද කියලා ගණන් කරලා. ළමයි 10දෙනෙක්ගේ ලකුණු 35, 42, 48, 51, 55, 58, 62, 67, 71, 88 කියමු. 30 ඉඳන් 49 දක්වා 3දෙනෙක්, 50 ඉඳන් 69 දක්වා 5දෙනෙක්, 70 ඉඳන් 89 දක්වා 2දෙනෙක් තියෙනවා. Bin ගණන වැඩියි නම් ලොකු noise එකක්, අඩුයි නම් විස්තර නැතිවෙනවා, ඒ නිසා 20 ඉඳන් 50 අතර උත්සාහ කරලා බලන්න.

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

### Why it exists

To compare distributions across several groups, 5 overlapping histograms are unreadable. A box plot squeezes each group into one small, comparable shape.

### Worked example: finding the outlier fence

Monthly salaries in Rs. thousands for 8 staff: 40, 45, 50, 55, 60, 65, 70, 300.
1. Median = average of the middle two = (55 + 60) ÷ 2 = **57.5**.
2. Q1 = median of the lower half (40, 45, 50, 55) = (45 + 50) ÷ 2 = **47.5**.
3. Q3 = median of the upper half (60, 65, 70, 300) = (65 + 70) ÷ 2 = **67.5**.
4. IQR = 67.5 − 47.5 = **20**.
5. Upper whisker limit = Q3 + 1.5 × IQR = 67.5 + 30 = **97.5**. Lower limit = 47.5 − 30 = 17.5.
6. 300 is above 97.5, so it is drawn as a **dot (outlier)**.

(NumPy and Pandas interpolate quartiles slightly differently, so their Q1 and Q3 can differ a little from this hand method. The idea is the same.)

```
        ├──┤███│███├──────┤              ●
      whisker  Q1 med Q3  whisker       outlier
```

### Where you'll meet it in real work

A hospital compares waiting times across 5 clinics: the box plot shows which clinic has the highest median and which has a few extremely long waits.

### Common mistakes
- Thinking the whiskers are min and max. They stop at the last point within 1.5 × IQR.
- Using a box plot with too few points (under ~10 per group); show the points instead.

> **සිංහලෙන්:** Box plot එකෙන් කණ්ඩායම් කිහිපයක data එකවර සසඳන්න පුළුවන්. කාර්ය මණ්ඩලයේ 8දෙනෙකුගේ පඩි (රුපියල් දහස් වලින්) 40, 45, 50, 55, 60, 65, 70, 300 කියමු. Median එක 57.5යි, Q1 එක 47.5යි, Q3 එක 67.5යි, ඒ නිසා IQR එක 20යි. 67.5 + 1.5 × 20 = 97.5, ඒ ඉක්මවන 300 තිතක් විදිහට outlier එකක් ලෙස පේනවා. Violin plot එකෙන් box එකට අමතරව හැඩයත් (උදා: මුදුන් දෙකක්) පේනවා.

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

### Why it exists

Before fitting any model, you want to know: do these two numbers move together? A scatter plot answers that by putting every row on a map.

### Worked example: reading the slope

Ad spend (Rs. thousand) vs units sold: (10, 100), (20, 140), (30, 180).
1. Every extra Rs.10k adds 40 units.
2. Slope = (180 − 100) ÷ (30 − 10) = 80 ÷ 20 = **4 units per Rs.1k**.
3. The points sit exactly on a line, so the correlation is +1 (a perfect, if unrealistic, positive relationship).

```
units
180 |            ●
140 |      ●
100 | ●
    +---------------- ad spend
      10    20    30
```

### Where you'll meet it in real work

A real-estate analyst plots house size against price. A tight upward cloud supports a regression model ([file 12](12-supervised-learning-algorithms.md)); a few points far above the cloud are luxury houses worth checking.

### Common mistakes
- Believing correlation means causation. Umbrella sales and dengue cases both rise in the rainy season, but umbrellas do not cause dengue; the rain does (a hidden cause, called a confounder).
- Plotting millions of points with no transparency, producing one solid blob.

> **සිංහලෙන්:** Scatter plot එකේ හැම තිතක්ම data row එකක්. Ad එකට රුපියල් දහස් 10යි 20යි 30යි වියදම් කරද්දී ඒකක 100යි 140යි 180යි විකුණනවා කියමු. වියදම රුපියල් දහසකින් වැඩි වෙද්දී ඒකක 4ක් වැඩි වෙනවා, ඒ කියන්නේ තිත් සරල රේඛාවක් දිගේ ඉහළට යනවා (positive correlation). හැබැයි correlation එක තිබුණා කියලා එකක් අනිකට හේතුව කියලා හිතන්න එපා. වැසි කාලේ කුඩ විකිණීමත් ඩෙංගු රෝගීන් වැඩි වීමත් එකට වැඩි වෙනවා, ඒත් කුඩ නිසා ඩෙංගු හැදෙන්නේ නෑ.

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

### Why it exists

With 10 numeric columns there are 45 pairs of correlations. A heatmap turns that grid of numbers into colours so the strong relationships jump out.

### Worked example: reading a small matrix

Illustrative correlation matrix (numbers made up to show how to read it):

| | bill | tip | size |
|---|---|---|---|
| **bill** | 1.00 | 0.68 | 0.60 |
| **tip** | 0.68 | 1.00 | 0.49 |
| **size** | 0.60 | 0.49 | 1.00 |

- The diagonal is always 1.00: a column correlates perfectly with itself.
- The matrix is symmetric: bill-tip equals tip-bill, so you only need half of it.
- Bill and tip (0.68) is the strongest pair: bigger bills tend to have bigger tips.

The same heatmap idea shows a **confusion matrix**. Suppose a model checked 100 loan applications: [[50, 10], [5, 35]] means 50 correct "approve", 35 correct "reject", and 15 mistakes. Accuracy = (50 + 35) ÷ 100 = **85%**.

### Where you'll meet it in real work

Before training a model, data scientists look at the correlation heatmap to find two features that say nearly the same thing (r above 0.95) and drop one.

### Exam angle
Exams show a confusion matrix or an attention heatmap and ask what it means. Remember: confusion-matrix rows/columns are classes; attention heatmaps show which tokens attend to which.

### Common mistakes
- Using a one-sided colour map (light to dark) for correlation, hiding the sign.
- Forgetting `vmin=-1, vmax=1`, so the colours exaggerate weak values.

> **සිංහලෙන්:** Heatmap එක කියන්නේ අංක වගුවක් පාට වලින් පෙන්නන එක. Columns 10ක් තියෙනවා නම් correlation යුගල 45ක් තියෙනවා, ඒවා පාටින් බැලුවාම ශක්තිමත් ඒවා එකපාරටම පේනවා. Diagonal එක හැමවිටම 1.00යි, මොකද column එකක් තමන් එක්කම පරිපූර්ණව සම්බන්ධයි. Loan applications 100ක් සඳහා confusion matrix එකක් 50, 10, 5, 35 කියමු, නිවැරදි උත්තර 50 + 35 = 85ක්, ඒ නිසා accuracy එක 85%යි. Correlation වලට පාට දෙපැත්තකට යන coolwarm වගේ diverging map එකක් පාවිච්චි කරන්න.

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

### Why it exists

In plain Matplotlib, a grouped histogram or a confidence interval needs 10 to 20 lines. Seaborn does it in one, because it already understands DataFrames and groups.

### A text picture: the same chart, two ways

```
Matplotlib: loop over groups, set colours, add legend by hand   (10+ lines)
Seaborn:    sns.histplot(data=tips, x="total_bill", hue="sex")  (1 line)
```

### Worked example: which Seaborn function?

| You want | Use |
|---|---|
| Count of rows per day | `countplot` |
| Mean bill per day with uncertainty | `barplot` (mean, not count!) |
| Bill distribution split by sex | `histplot(..., hue="sex")` |
| Every pair of numeric columns | `pairplot` |

### Where you'll meet it in real work

During EDA, `pairplot` on a new customer dataset gives a one-minute overview of which columns relate to each other.

### Common mistakes
- Confusing `countplot` (counts rows) with `barplot` (average of a number).
- Reading overlapping error bars as "a real difference". If they overlap a lot, the difference may be noise.

> **සිංහලෙන්:** Seaborn කියන්නේ Matplotlib උඩ හදපු, Pandas DataFrame එක කෙලින්ම ගන්න library එකක්. Matplotlib වලින් පේළි 10ක් විතර ලියන්න වෙන chart එකක් Seaborn වලින් එක පේළියකින් අඳින්න පුළුවන්. `countplot` එක row ගණන පෙන්නනවා, `barplot` එක අගයක සාමාන්‍යය පෙන්නනවා, ඒ දෙක පටලවගන්න එපා. `hue` කියන්නේ සමූහයක් අනුව පාට කරන්න, උදා: ගෑනු සහ පිරිමි වෙන වෙනම. Error bars දෙකක් ගොඩක් overlap වෙනවා නම් ඇත්තටම වෙනසක් නැති වෙන්නත් පුළුවන්.

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

### Why it exists

One chart rarely tells the whole story. Putting four related charts side by side lets the reader compare them without flipping pages.

### A text picture: the axes grid

```
plt.subplots(2, 2)         axes[row, column]
 ┌────────────┬────────────┐
 │ axes[0, 0] │ axes[0, 1] │   row 0
 ├────────────┼────────────┤
 │ axes[1, 0] │ axes[1, 1] │   row 1
 └────────────┴────────────┘
```

Counting starts at 0, like Python lists. With 1 row (`plt.subplots(1, 3)`) the result is a flat list, so you write `axes[0]`, not `axes[0, 0]`.

### Where you'll meet it in real work

A model report page shows a loss curve, a confusion matrix and a feature-importance chart in one figure so the team can judge the model at a glance.

### Common mistakes
- Using `axes[0, 1]` on a one-row grid (IndexError).
- Skipping `plt.tight_layout()`, so titles overlap the next chart.
- Calling `sns.boxplot(...)` without `ax=`, so it draws on the wrong chart.

> **සිංහලෙන්:** Subplots කියන්නේ එක පින්තූරයක chart කිහිපයක් පෙළට දාන එක. `plt.subplots(2, 2)` කියන්නේ පේළි 2ක් සහ තීරු 2ක්, ඒ නිසා chart 4ක් හැදෙනවා. එක chart එකක් තෝරන්නේ `axes[පේළිය, තීරුව]` විදිහට, ගණන් කරන්නේ 0 ඉඳන්. පේළියක් විතරක් තියෙනවා නම් `axes[0]` කියලා ලියන්න ඕනේ, නැත්නම් error එකක් එනවා. Seaborn chart එකක් නිවැරදි තැනට දාන්න `ax=axes[1, 0]` වගේ දෙන්න, අන්තිමට `plt.tight_layout()` දාන්න.

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

### Why it exists

A static picture can hide detail: you cannot read the exact value of one point among 500. Interactive charts let the reader hover, zoom and filter to ask their own follow-up questions.

### A text picture: which library when

```
Printed report / paper figure  ->  Matplotlib (full control, PNG/PDF)
Quick exploration in a notebook ->  Seaborn   (one-liners)
Web page, dashboard, demo       ->  Plotly    (hover, zoom, share as HTML)
```

### Where you'll meet it in real work

An analyst at a telecom shares `chart.html` with a manager, who hovers over a spike to see which district and date it was, without needing Python.

### Common mistakes
- Putting an interactive chart in a printed PDF (hover does nothing on paper).
- Making a Plotly chart with thousands of points on a slow machine; sample the data first.

> **සිංහලෙන්:** Plotly වලින් හදන්නේ interactive charts. Mouse එක chart එක උඩට ගියාම අගය පේනවා, zoom කරන්නත් පුළුවන්, phone එකේ Google Maps වගේ. `fig.write_html("chart.html")` කියලා save කරලා ඒ file එක manager කෙනෙකුට යැව්වොත්, එයාට Python නැතුවත් browser එකෙන් බලන්න පුළුවන්. හැබැයි print කරන report එකකට interactive chart එකක් වැඩක් නෑ, ඒකට Matplotlib හොඳයි. Seaborn කියන්නේ ඉක්මන් exploration එකට.

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

### Why it exists

Machine learning gives you no direct view inside a model. These charts are your window: they tell you whether training works, where the model errs and whether more data would help.

### Worked example: reading the loss curve above

Using the preview code (`train = 1/e + 0.05`; `val = 1/e + 0.05 + 0.02 × (e − 10)` after epoch 10):

| Epoch | Train loss | Validation loss | Gap |
|---|---|---|---|
| 5 | 1/5 + 0.05 = **0.25** | **0.25** | 0 |
| 10 | 0.10 + 0.05 = **0.15** | **0.15** | 0 |
| 15 | 0.0667 + 0.05 = **0.117** | 0.117 + 0.10 = **0.217** | 0.10 |
| 20 | 0.05 + 0.05 = **0.10** | 0.10 + 0.20 = **0.30** | 0.20 |

Training loss keeps falling, but from epoch 10 validation loss climbs. The growing gap is the signature of **overfitting**: the model is memorising the training set. The fix is to stop early (around epoch 10), add regularisation, or get more data.

```
loss
 |\
 | \_____ train (still falling)
 |  \         _____ validation (rises after epoch 10)
 |   \___ ___/
 +--------------- epoch
        ^ stop here (early stopping)
```

### Where you'll meet it in real work

When fine-tuning a language model, the team watches training vs validation loss every few hundred steps and keeps the checkpoint with the lowest validation loss.

### Exam angle
NCA-GENL-style questions show a pair of loss curves and ask "what is happening?" (overfitting: validation up, training down; underfitting: both high), or which chart helps choose a classification threshold (ROC / precision-recall).

### Common mistakes
- Judging a model only on training loss.
- Reading a ROC curve on a heavily imbalanced dataset without checking a precision-recall curve too.

> **සිංහලෙන්:** ML වලදී model එක ඇතුළේ මොකද වෙන්නේ කියලා කෙලින්ම බලන්න බෑ, ඒකට අපිට තියෙන්නේ මේ charts. Loss curve එකක training loss එක epoch 20 වෙද්දී 0.10 වෙනකම් අඩු වෙනවා, ඒත් validation loss එක epoch 10න් පස්සේ 0.15 ඉඳන් 0.30 දක්වා වැඩි වෙනවා. මේ පරතරය වැඩි වීම තමයි overfitting, ඒ කියන්නේ model එක training data පාඩම් කරනවා. ඒ නිසා epoch 10 ගාවදී නවත්තන්න (early stopping) හෝ data වැඩි කරන්න. විභාගයකදීත් මේ වගේ curves දෙකක් පෙන්නලා "මොකද වෙන්නේ?" කියලා අහන්න පුළුවන්.

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

### Why it exists

A chart can be technically correct and still lead the reader to the wrong decision. Design rules exist so your picture tells the truth quickly.

### Worked example 1: how a truncated axis lies

Product A scores 50 and product B scores 52. The true difference is (52 − 50) ÷ 50 = **4%**.
Now cut the axis to start at 49:
- A's bar height = 50 − 49 = 1
- B's bar height = 52 − 49 = 3
- B looks **3 times** taller, although it is only 4% higher.

### Worked example 2: adjust for population

Imagine two towns (made-up numbers):

| Town | Accidents | People | Per 100,000 people |
|---|---|---|---|
| X | 900 | 3,000,000 | 900 ÷ 3,000,000 × 100,000 = **30** |
| Y | 150 | 250,000 | 150 ÷ 250,000 × 100,000 = **60** |

A chart of raw counts says X is far worse. The rate says Y is twice as dangerous per person.

### Where you'll meet it in real work

News graphics, election results and company reports. Spotting a dual axis or a cut axis in a chart sent to you is a useful professional skill.

### Common mistakes
- Using red and green as the only difference between two lines.
- Using area or bubble size so that "twice as much" is drawn four times bigger.
- Putting a clever title that does not state the message.

> **සිංහලෙන්:** හොඳ chart එකකින් ඇත්ත ඉක්මනින් පෙන්නන්න ඕනේ. නිෂ්පාදන දෙකක ලකුණු 50යි 52යි කියමු, ඇත්ත වෙනස 4%ක් විතරයි. ඒත් axis එක 49න් පටන් ගත්තොත් bar දෙක 1ක් සහ 3ක් විදිහට පේනවා, ඒ කියන්නේ 3 ගුණයක් වෙනසක් වගේ. නගර දෙකක අනතුරු 900ක් සහ 150ක් කියලා බැලුවාම පළවෙනි එක නරකයි කියලා හිතෙනවා, ඒත් ජනගහනය අනුව ගත්තොත් ලක්ෂයකට 30යි 60යි, ඒ නිසා ජනගහනයෙන් බෙදලා rates පෙන්නන්න. පාට අන්ධ අයටත් පේන palette එකක් පාවිච්චි කරන්න.

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

### Why it exists

Decision makers rarely have time for 20 charts. They need one answer, one proof and one next step. Storytelling is the skill that turns your analysis into action.

### Worked example: from boring to useful

Restaurant chain with 10 branches. Instead of "Sales by branch and weekday" you show:

> **"Kandy kottu sales drop about 30% on Mondays."** (chart: Kandy Monday vs other days)
> Context: kottu is the top seller. Insight: only Kandy, only Monday. Recommendation: run a Monday offer for a month and measure again.

If Kandy sold Rs.100,000 on a normal day and the Monday figure is 30% lower, Monday sales are 100,000 × 0.70 = **Rs.70,000**, a loss of Rs.30,000 per Monday, or about Rs.120,000 in a 4-Monday month. That money figure is what moves a manager.

### A text picture: the dashboard layout

```
┌───────────────────────────────────────────────┐
│ KPI: Revenue │ KPI: Orders │ KPI: Churn %      │  <- most important, top-left
├───────────────────────────────────────────────┤
│ Line: revenue over time │ Bar: top 5 products │
└───────────────────────────────────────────────┘
Think of a car dashboard: speed, fuel, temperature. Not every engine detail.
```

A tiny Streamlit dashboard (Streamlit turns a Python script into a web app):

```python
# app.py  (run with: streamlit run app.py)
import pandas as pd                              # table handling
import streamlit as st                           # the dashboard library

df = pd.read_csv("sales.csv", parse_dates=["date"])      # load sales data
st.title("Branch sales")                                  # page heading
branch = st.selectbox("Branch", df["branch"].unique())    # dropdown to pick a branch
data = df[df["branch"] == branch]                         # keep only that branch
st.metric("Total revenue (Rs.)", f"{data['amount'].sum():,.0f}")  # KPI card
st.line_chart(data.groupby("date")["amount"].sum())       # daily revenue line
```

### Where you'll meet it in real work

Power BI and Tableau are the drag-and-drop tools most companies use; Streamlit is common for quick internal tools and ML demos.

### Common mistakes
- Showing every chart you made. Keep only the ones that support the message.
- A dashboard with 20 charts and no comparison to target or last month.

> **සිංහලෙන්:** Analysis එකක් හොඳ වුණාට අනිත් අයට තේරෙන්නේ නැත්නම් වැඩක් නෑ. කතාව හදන්නේ context, insight, recommendation කියලා පියවර තුනකින්. උදාහරණයක් විදිහට "Kandy ශාඛාවේ kottu විකුණුම් සඳුදා දවස් වල 30% අඩුයි" කියන්නේ "විකුණුම් වගුව" කියලා title එකක් දානවාට වඩා ගොඩක් හොඳයි. සාමාන්‍ය දවසක රුපියල් 100,000ක් විකුණනවා නම් සඳුදා රුපියල් 70,000යි, සඳුදා 4කට රුපියල් 120,000ක් නැති වෙනවා. Dashboard එක කාර් එකක dashboard එක වගේ, speed, fuel වගේ වැදගත්ම ටික විතරයි පෙන්නන්න ඕනේ. Power BI සහ Tableau කියන්නේ code නැතුව dashboards හදන tools, Streamlit වලින් Python වලින්ම හදනවා.

```quiz
[
{"q": "Two datasets have identical mean, standard deviation and correlation. What does Anscombe's quartet teach?", "options": ["They must look the same when plotted", "They can look completely different, so always plot the data", "Correlation is always 0.82", "Histograms are better than scatter plots"], "answer": 1, "why": "Anscombe's quartet has four datasets with the same summary statistics but very different shapes (line, curve, outlier, vertical stack). 'They must look the same' is the tempting wrong answer; it is exactly the trap the example exposes."},
{"q": "Which chart best compares the distribution of delivery times across 4 courier companies?", "options": ["Pie chart", "Line chart", "Box plot", "Single big-number KPI card"], "answer": 2, "why": "A box plot per group shows median, spread and outliers side by side. A line chart implies a time order that does not exist between couriers."},
{"q": "Product A scores 50 and product B scores 52. A bar chart axis starts at 49. About how many times taller does B look than A, compared with the true 4% difference?", "options": ["1.04 times", "2 times", "3 times", "52 times"], "answer": 2, "why": "Visible heights are 50 - 49 = 1 and 52 - 49 = 3, so B looks 3 times taller. The true gap is only 2/50 = 4%. Bar charts must start at zero for this reason."},
{"q": "Marks 35, 42, 48, 51, 55, 58, 62, 67, 71, 88 are put into bins 30-49, 50-69, 70-89. What are the counts?", "options": ["3, 5, 2", "4, 4, 2", "2, 5, 3", "5, 3, 2"], "answer": 0, "why": "30-49 holds 35, 42, 48 (3); 50-69 holds 51, 55, 58, 62, 67 (5); 70-89 holds 71 and 88 (2). The counts must add up to the 10 marks."},
{"q": "Salaries (Rs. thousand) 40, 45, 50, 55, 60, 65, 70, 300 have Q1 = 47.5, Q3 = 67.5. Is 300 a box-plot outlier?", "options": ["No, it is below Q3 + 1.5 x IQR", "Yes, because it is above 67.5 + 1.5 x 20 = 97.5", "No, outliers are only below Q1", "Yes, because it is the maximum"], "answer": 1, "why": "IQR = 20, so the upper limit is 67.5 + 30 = 97.5 and 300 is far above it. Being the maximum is not enough on its own: a max inside the fence is not an outlier."},
{"q": "On a loss-curve chart, training loss keeps falling while validation loss rises after epoch 10. What is happening?", "options": ["Underfitting", "The learning rate is zero", "Overfitting", "The validation set has no labels"], "answer": 2, "why": "A growing gap, with training better than validation, means the model memorises the training data. Underfitting would show both losses staying high."},
{"q": "Which colour map suits a correlation heatmap and why?", "options": ["A light-to-dark sequential map, because bigger is darker", "A diverging map such as coolwarm, because 0 is a meaningful centre", "A random rainbow, because it is more colourful", "Grey only, because colour is distracting"], "answer": 1, "why": "Correlation runs from -1 to +1 with 0 in the middle, so two-sided colours show sign and strength. A sequential map hides whether a value is negative or positive."},
{"q": "Town X has 900 accidents and 3,000,000 people; Town Y has 150 accidents and 250,000 people. Which statement is correct per person?", "options": ["X is worse: 900 > 150", "Y is worse: 60 per 100,000 vs 30 per 100,000", "They are equal", "It cannot be compared"], "answer": 1, "why": "900/3,000,000 x 100,000 = 30 and 150/250,000 x 100,000 = 60. Comparing raw counts ignores population, which is the mistake the rate fixes."}
]
```

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

**Q7.** Town A has 40 accidents and 20,000 people; Town B has 300 accidents and 300,000 people. Which town is more dangerous per 100,000 people?
<details><summary>Answer</summary>A: 40 ÷ 20,000 × 100,000 = 200. B: 300 ÷ 300,000 × 100,000 = 100. Town A is twice as dangerous even though B has more accidents in total.</details>

**Q8.** On a quartile box plot Q1 = 20 and Q3 = 40. Which values are drawn as outlier dots?
<details><summary>Answer</summary>IQR = 20; limits are 20 − 30 = −10 and 40 + 30 = 70. Values above 70 (or below −10) are dots.</details>

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
| Streamlit | Python library that turns a script into a web dashboard or ML demo |
| Confounder | A hidden third factor that causes both of two correlated things |
| Seasonality (in a line chart) | A pattern that repeats each week, month or year |

**Next:** [10-data-science-workflow.md](10-data-science-workflow.md)
