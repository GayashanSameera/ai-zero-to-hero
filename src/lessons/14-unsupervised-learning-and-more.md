# 14: Unsupervised Learning, Recommenders, Forecasting, and Explainability

> **Before you start:** [05](05-math-linear-algebra.md) (distance, cosine similarity, eigenvectors, SVD, projection), [07](07-math-probability-statistics.md) (normal distribution, z-scores, conditional probability), [10](10-data-science-workflow.md) (scaling, time series basics, segmentation), [11](11-ml-fundamentals.md) (unsupervised learning, cross-validation), [12](12-supervised-learning-algorithms.md) (trees, random forests, feature importance), [13](13-evaluation-metrics-and-tuning.md) (metrics, MAE, MAPE).
>
> **After this file you can:** cluster data (k-means, hierarchical, DBSCAN, GMM), reduce dimensions (PCA, t-SNE, UMAP), detect anomalies, mine association rules, build recommender systems, forecast time series, and explain any model's predictions with SHAP and LIME.

This file finishes **Part C: Machine Learning**.

---

## Table of contents

**Clustering**
1. [What is clustering?](#1-what-is-clustering)
2. [k-Means](#2-k-means)
3. [Choosing k: elbow method and silhouette score](#3-choosing-k)
4. [Hierarchical clustering](#4-hierarchical-clustering)
5. [DBSCAN](#5-dbscan)
6. [Gaussian Mixture Models (GMM)](#6-gaussian-mixture-models)

**Dimensionality reduction**
7. [Why reduce dimensions?](#7-why-reduce-dimensions)
8. [PCA (Principal Component Analysis)](#8-pca)
9. [t-SNE and UMAP (for visualisation)](#9-t-sne-and-umap)

**Other unsupervised tasks**
10. [Anomaly detection](#10-anomaly-detection)
11. [Association rules (market basket analysis)](#11-association-rules)

**Applied ML**
12. [Recommender systems](#12-recommender-systems)
13. [Time series forecasting](#13-time-series-forecasting)
14. [Explainability: feature importance, SHAP, LIME](#14-explainability)

15. [Check yourself](#15-check-yourself)
16. [New words in this file](#16-new-words-in-this-file)

---

# Clustering

## 1. What is clustering?

**Idea:** group similar data points together **without labels** ([unsupervised learning, file 11](11-ml-fundamentals.md#2-types-of-machine-learning)). Points in the same **cluster** are similar; points in different clusters are different.

**Analogy:** at a party with no name tags, people naturally form groups: the cricket fans, the coworkers, the family. Clustering finds such groups in data.

**Uses:**
- **Customer segmentation:** "budget shoppers", "premium loyalists", "occasional big spenders"
- Grouping similar documents or news articles
- Image compression (group similar colours)
- Finding patterns in genes
- Pre-labelling: cluster first, then have humans name the clusters

**Similarity** is usually measured by **distance** ([file 05](05-math-linear-algebra.md#5-distance-between-vectors)), so **scale your features first** ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)).

---

## 2. k-Means

**Idea:** split data into **k** clusters, each represented by its **centre (centroid)**, the mean of its points. Every point belongs to the nearest centroid.

### The algorithm

1. Choose k. Place k centroids randomly.
2. **Assign:** each point joins its nearest centroid.
3. **Update:** move each centroid to the mean of its assigned points.
4. Repeat 2 and 3 until nothing changes.

```
Start (random centres ✚)      After assign + update        Converged
  • •   ✚                       • •                          (• •)
 • •         ∘ ∘               •✚•         ∘ ∘              (•✚•)      (∘ ∘)
          ✚ ∘ ∘                           ∘✚∘ ∘                       (∘✚∘ ∘)
```

### Worked example (1-D)

Points: [1, 2, 3, 10, 11, 12], k = 2, start centroids at 1 and 2.
- Assign: 1 → c₁; 2, 3, 10, 11, 12 → c₂ (closer to 2). Update: c₁ = 1, c₂ = (2+3+10+11+12)/5 = 7.6
- Assign: 1, 2, 3 → c₁ (closer to 1 than 7.6); 10, 11, 12 → c₂. Update: c₁ = 2, c₂ = 11
- Assign: no change → **converged**: clusters {1, 2, 3} and {10, 11, 12}.

**Objective:** k-means minimises **inertia** (also called **WCSS**, within-cluster sum of squares): the total squared distance from each point to its centroid.

```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
X_scaled = StandardScaler().fit_transform(X)
km = KMeans(n_clusters=4, n_init=10, random_state=0).fit(X_scaled)
labels = km.labels_            # cluster of each point
km.cluster_centers_
km.inertia_
```

**Watch out:**
- Results depend on the random start. `n_init=10` runs 10 times and keeps the best. **k-means++** (sklearn's default) chooses smart starting centres.
- k-means assumes clusters are **round blobs of similar size**. It fails on long, curved, or very unequal clusters.
- Sensitive to outliers (they pull the mean).
- You must choose k.

**After clustering, profile the clusters:** `df.groupby(labels).mean()` → "cluster 2 = young, high-frequency, low-spend customers". Clustering is only useful when humans can interpret and act on the groups.

---

## 3. Choosing k

### Elbow method

Run k-means for k = 1, 2, ..., 10 and plot inertia. Inertia always drops as k grows (with k = n, it's 0). Look for the **elbow**, where adding clusters stops helping much.

```
inertia
 │●
 │ ╲
 │  ●
 │   ╲
 │    ●___  ← elbow at k = 3
 │        ●───●───●───●
 └──────────────────────► k
   1  2  3  4  5  6  7
```

### Silhouette score

For each point: how close is it to its own cluster vs the nearest other cluster?

```
s = (b − a) / max(a, b)
a = average distance to points in its own cluster
b = average distance to points in the nearest other cluster
```

- s ≈ 1: well clustered
- s ≈ 0: on the border between clusters
- s < 0: probably in the wrong cluster

Pick the k with the highest average silhouette.

```python
from sklearn.metrics import silhouette_score
for k in range(2, 9):
    labels = KMeans(k, n_init=10, random_state=0).fit_predict(X_scaled)
    print(k, silhouette_score(X_scaled, labels))
```

**In practice:** also ask "how many segments can the marketing team actually use?" Business sense matters as much as the numbers.

---

## 4. Hierarchical clustering

**Idea (agglomerative, bottom-up):** start with every point as its own cluster; repeatedly **merge the two closest clusters** until one remains. The history of merges forms a tree called a **dendrogram**.

```
height
(distance)
  │        ┌──────┴──────┐
  │     ┌──┴──┐          │
  │   ┌─┴─┐   │       ┌──┴──┐
  │   │   │   │       │     │
      A   B   C       D     E
          ── cut here → 2 clusters: {A,B,C}, {D,E}
```

Cut the dendrogram at a chosen height to get any number of clusters, without rerunning.

**Linkage** (how to measure distance between clusters):
- **Single:** closest pair of points (makes long chains)
- **Complete:** farthest pair (compact clusters)
- **Average:** average of all pairs
- **Ward:** merge the pair that increases total within-cluster variance least (most common; similar to k-means)

**Pros:** no need to pick k upfront; the dendrogram is informative.
**Cons:** slow for large data (O(n²) memory and worse time, [Big-O, file 02](02-python-programming.md#23-algorithm-speed-big-o-notation)).

```python
from sklearn.cluster import AgglomerativeClustering
from scipy.cluster.hierarchy import linkage, dendrogram
dendrogram(linkage(X_scaled[:200], method="ward"))
AgglomerativeClustering(n_clusters=3, linkage="ward").fit_predict(X_scaled)
```

---

## 5. DBSCAN

**DBSCAN** (Density-Based Spatial Clustering of Applications with Noise): clusters are **dense regions** separated by sparse regions.

Two hyperparameters:
- **eps (ε):** neighbourhood radius
- **min_samples:** how many neighbours within ε make a point a **core point**

Rules:
- **Core point:** has ≥ min_samples neighbours within ε
- **Border point:** within ε of a core point, but not a core itself
- **Noise point (outlier):** neither, so it's labelled **−1**

Clusters grow by connecting core points that are within ε of each other.

```
   k-means fails here          DBSCAN succeeds
    ╭───────╮                    ╭───────╮
   ╱  ○○○○○  ╲                  ╱  ○○○○○  ╲      two moon shapes,
  ○○       ●●●●●               ○○       ●●●●●    DBSCAN follows the
           ╲  ●●●●●  ╱                  ╲  ●●●●●  ╱  density
            ╰───────╯                    ╰───────╯
```

**Pros:** finds clusters of **any shape**, automatically finds the number of clusters, flags **outliers**.
**Cons:** struggles when clusters have very different densities; sensitive to eps (use a "k-distance plot" to choose it); needs scaling. **HDBSCAN** is an improved version that handles varying densities.

```python
from sklearn.cluster import DBSCAN
labels = DBSCAN(eps=0.5, min_samples=5).fit_predict(X_scaled)   # -1 = noise
```

---

## 6. Gaussian Mixture Models

**Idea:** assume the data comes from a mix of several **normal (Gaussian) distributions** ([file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)), each one being a cluster. Fit them using the **EM algorithm** (Expectation-Maximisation: alternately guess which cluster each point belongs to, then update each Gaussian's mean and shape).

**Difference from k-means:**
- **Soft clustering:** each point gets a **probability** of belonging to each cluster ("70% cluster A, 30% cluster B") instead of a hard assignment.
- Clusters can be **elliptical** and of different sizes, not just round.

Choose the number of components with **BIC** or **AIC** (scores that balance fit against complexity; lower is better).

```python
from sklearn.mixture import GaussianMixture
gmm = GaussianMixture(n_components=3, random_state=0).fit(X_scaled)
gmm.predict_proba(X_scaled)   # soft memberships
gmm.bic(X_scaled)
```

GMMs are also **generative models** ([file 11](11-ml-fundamentals.md#2-types-of-machine-learning)): you can sample new points from them, and they give a probability density useful for anomaly detection.

### Clustering summary

| Method | Cluster shape | Need k? | Handles noise? | Scale |
|---|---|---|---|---|
| k-means | round, similar size | yes | no | large data ✓ |
| Hierarchical | depends on linkage | no (cut later) | no | small/medium |
| DBSCAN / HDBSCAN | any shape | no | yes | medium/large |
| GMM | elliptical, soft | yes | partially | medium |

---

# Dimensionality reduction

## 7. Why reduce dimensions?

Data often has many features (dimensions): hundreds of survey answers, thousands of word counts, 768-number embeddings ([file 05](05-math-linear-algebra.md#2-vectors)).

**Reasons to reduce:**
1. **Visualisation:** we can only see 2-D or 3-D
2. **Fight the curse of dimensionality** ([file 10](10-data-science-workflow.md#12-feature-selection)): in high dimensions, everything is far from everything and distances lose meaning
3. **Speed and memory**
4. **Remove noise and redundancy** (correlated features)

**Feature selection** ([file 10](10-data-science-workflow.md#12-feature-selection)) keeps some original features. **Dimensionality reduction** (also called **feature extraction**) creates **new** features that combine the originals.

---

## 8. PCA

**PCA (Principal Component Analysis)** finds new axes, called **principal components**, that capture the **most variance** (spread) in the data, ordered from most to least important. Then you keep only the top few.

**Analogy: photographing a teapot.** A 3-D teapot must be shown in a 2-D photo. Some angles show its shape clearly (spout, handle, lid all visible), while looking straight down from the top loses a lot. PCA finds the "best angle" that keeps the most information.

### Intuition in 2-D

```
 height
   │          • •           PC1: the direction of greatest spread
   │       • • •  ╱           (here: "overall size": tall & heavy together)
   │     • • •  ╱
   │   • • •  ╱              PC2: perpendicular, less spread
   │  • •   ╱    ╲             (here: "build": thin vs stocky)
   │      ╱        ╲
   └─────────────────── weight
```

Height and weight are correlated, so most information lies along one diagonal direction (PC1). Projecting ([file 05](05-math-linear-algebra.md#15-advanced-ideas-intuition-only)) each point onto PC1 alone keeps most of the information in **1 number instead of 2**.

### How (you don't do this by hand)

1. **Standardise** the features (PCA is very sensitive to scale)
2. Compute the **covariance matrix** ([file 07](07-math-probability-statistics.md#14-covariance-and-correlation))
3. Find its **eigenvectors** (the principal component directions) and **eigenvalues** (how much variance each captures) ([file 05](05-math-linear-algebra.md#15-advanced-ideas-intuition-only)), in practice via SVD
4. Keep the top k components; project the data onto them

**Explained variance ratio:** the share of total variance captured by each component.

```python
from sklearn.decomposition import PCA
pca = PCA(n_components=0.95)          # keep enough components for 95% of variance
X_pca = pca.fit_transform(X_scaled)
print(pca.n_components_)              # e.g. 12 out of 50 original features
print(pca.explained_variance_ratio_)  # e.g. [0.41, 0.18, 0.09, ...]
```

**Scree plot:** bar chart of explained variance per component (look for an elbow).

**Pros:** fast, deterministic, reversible (approximately), removes correlation.
**Cons:** only finds **linear** structure; new components are hard to interpret ("PC1 = 0.4·age + 0.3·income − 0.2·...").

---

## 9. t-SNE and UMAP

Non-linear methods mainly for **visualising** high-dimensional data in 2-D.

### t-SNE (t-distributed Stochastic Neighbour Embedding)

Keeps **nearby points nearby**: it tries to make the 2-D neighbourhoods match the high-dimensional neighbourhoods.

- Hyperparameter **perplexity** (≈ how many neighbours to consider; typically 5 to 50).
- Great at revealing clusters (e.g. handwritten digits form 10 clear islands).

### UMAP (Uniform Manifold Approximation and Projection)

Similar goal; usually **faster**, scales to millions of points, preserves more **global** structure. Hyperparameters: `n_neighbors`, `min_dist`.

### ⚠️ How to read t-SNE / UMAP plots

- ✅ Points close together are similar.
- ❌ **Cluster sizes mean nothing.**
- ❌ **Distances between clusters mean little** (especially for t-SNE).
- ❌ Different runs/hyperparameters give different pictures.
- ❌ Don't use t-SNE output as features for a model (it can't transform new points consistently).

```python
from sklearn.manifold import TSNE
X_2d = TSNE(n_components=2, perplexity=30, random_state=0).fit_transform(X_scaled)
import umap                                  # pip install umap-learn
X_2d = umap.UMAP(n_neighbors=15, min_dist=0.1).fit_transform(X_scaled)
```

**Common AI use:** plot text embeddings (file 18) or image embeddings in 2-D to see whether similar items group together.

### LDA (Linear Discriminant Analysis)

A **supervised** dimensionality reduction: finds directions that best **separate the known classes** (unlike PCA, which ignores labels). (Don't confuse it with **Latent Dirichlet Allocation**, also called LDA, a topic-modelling method for text, [file 18](18-nlp-fundamentals.md).)

---

# Other unsupervised tasks

## 10. Anomaly detection

**Idea:** find data points that are **unusual**: very different from the majority. Also called **outlier detection** or **novelty detection**.

**Uses:** credit card fraud, network intrusion, manufacturing defects, sensor failures, unusual server behaviour.

**Why unsupervised?** Anomalies are rare and varied, and often unlabelled. New fraud tricks don't look like old ones.

| Method | Idea |
|---|---|
| **Statistical: z-score / IQR** ([file 07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers)) | Flag values far from the mean/median. Simple; one feature at a time. |
| **Isolation Forest** | Anomalies are **easy to isolate**. Build random trees that split randomly; anomalies end up alone after only a few splits (short paths). |
| **Local Outlier Factor (LOF)** | Compares each point's local density with its neighbours'; much sparser than neighbours = anomaly. |
| **One-Class SVM** | Learns a boundary around "normal" data. |
| **DBSCAN** | Noise points (label −1) are anomalies. |
| **GMM** | Points with very low probability density are anomalies. |
| **Autoencoders** (file 25) | A neural net learns to compress and rebuild normal data; anomalies rebuild badly (high **reconstruction error**). |

**Isolation Forest intuition:**
```
Normal point (in a dense crowd): needs many random cuts to isolate → long path
Anomaly (alone far away): isolated in 1-2 random cuts → short path → anomaly score high
```

```python
from sklearn.ensemble import IsolationForest
iso = IsolationForest(contamination=0.01, random_state=0)   # expect ~1% anomalies
pred = iso.fit_predict(X)          # -1 = anomaly, 1 = normal
scores = iso.decision_function(X)  # lower = more anomalous
```

**Evaluation:** if you have even a few labelled anomalies, use precision/recall/PR-AUC ([file 13](13-evaluation-metrics-and-tuning.md#8-precision-recall-curve-and-pr-auc)). Otherwise, have experts review the top-scored cases.

---

## 11. Association rules

**Idea:** find items that **often occur together** in transactions. Known as **market basket analysis**.

Rule: **{bread, butter} → {jam}**: "people who buy bread and butter often also buy jam".

### Three measures

Suppose 1,000 shopping baskets:
- 100 contain bread AND butter
- 40 contain bread, butter, AND jam
- 80 contain jam (in total)

| Measure | Formula | Example | Meaning |
|---|---|---|---|
| **Support** | P(A and B) | 40/1000 = **0.04** | How common the whole itemset is |
| **Confidence** | P(B \| A) = support(A∪B)/support(A) | 40/100 = **0.40** | Given A, how often B also appears ([conditional probability](07-math-probability-statistics.md#8-conditional-probability-and-independence)) |
| **Lift** | confidence / P(B) | 0.40 / 0.08 = **5.0** | How much more likely B is with A than in general |

- Lift > 1: positive association (buying A makes B more likely), here 5× more likely
- Lift = 1: independent
- Lift < 1: negative association

**Algorithms:** **Apriori** (if an itemset is rare, every bigger itemset containing it is also rare, so prune them) and **FP-Growth** (faster).

**Uses:** product placement, "frequently bought together", promotions, cross-selling.

```python
from mlxtend.frequent_patterns import apriori, association_rules
frequent = apriori(basket_onehot_df, min_support=0.01, use_colnames=True)
rules = association_rules(frequent, metric="lift", min_threshold=1.5)
```

---

# Applied ML

## 12. Recommender systems

**Goal:** predict what a user will like: products, movies, songs, posts. Netflix, YouTube, Amazon, Spotify and TikTok are built on these.

### Data

A **user-item interaction matrix**: rows = users, columns = items, values = ratings or interactions. It's mostly **empty (sparse)**: each user has interacted with a tiny fraction of items.

|  | Movie A | Movie B | Movie C | Movie D |
|---|---|---|---|---|
| Amal | 5 | ? | 4 | ? |
| Nisha | 4 | 2 | ? | 5 |
| John | ? | 1 | 5 | 4 |

- **Explicit feedback:** ratings, likes (clear but rare)
- **Implicit feedback:** clicks, watch time, purchases (plentiful but noisy: a click doesn't mean you liked it)

### Approach 1: Content-based filtering

Recommend items **similar to what the user liked**, based on item features (genre, actors, description, embeddings).

"You liked *Inception* (sci-fi, Nolan) → here's *Interstellar* (sci-fi, Nolan)."

Compare item feature vectors with **cosine similarity** ([file 05](05-math-linear-algebra.md#7-cosine-similarity)).

✅ Works for new items (we know their features). ❌ Creates a "filter bubble" (only more of the same); needs good item features.

### Approach 2: Collaborative filtering

Use **other users' behaviour**. "Users who liked what you liked also liked X."

- **User-based:** find users similar to you (by rating patterns); recommend what they liked.
- **Item-based:** find items that tend to be liked by the same people (Amazon's classic "customers who bought this also bought").

✅ No item features needed; finds surprising recommendations. ❌ **Cold start problem:** new users or new items have no interactions yet.

### Approach 3: Matrix factorisation

Fill in the missing ratings by learning a short vector (**latent factors**) for each user and each item, so that **rating ≈ user_vector · item_vector** (a dot product, [file 05](05-math-linear-algebra.md#6-the-dot-product)).

```
Ratings (users × items)  ≈  User factors (users × k)  ×  Item factors (k × items)
     sparse, huge                 small                       small
```

The k latent factors are learned automatically (e.g. factor 1 might end up meaning "action vs romance", factor 2 "mainstream vs indie"). This is the low-rank idea from SVD ([file 05](05-math-linear-algebra.md#15-advanced-ideas-intuition-only)). It was famously key to winning the **Netflix Prize**. Methods: SVD-style factorisation, **ALS** (Alternating Least Squares), implemented in libraries like `surprise` and `implicit`.

**Worked example:** user vector [0.9, 0.1] (loves action, not romance), movie vector [1.0, 0.2] (action-heavy):
predicted score = 0.9 × 1.0 + 0.1 × 0.2 = **0.92** → recommend.

### Approach 4: Hybrid and deep learning

Real systems combine methods. Modern ones use neural networks:
- **Two-tower models:** one network embeds users, another embeds items; recommend items whose embeddings are closest to the user's (same "nearest vector" idea as RAG search, file 23).
- **Two-stage pipeline:** **candidate generation** (quickly fetch ~1,000 plausible items from millions) → **ranking** (a heavier model, often gradient boosting or a neural net, scores those 1,000 precisely).

### Evaluation

- **Offline:** **Precision@k**, **Recall@k** (of the top k recommended, how many were relevant?), **MAP**, **NDCG** (rewards putting relevant items near the top; also used for search, file 23), RMSE for rating prediction.
- **Beyond accuracy:** coverage, diversity, novelty, serendipity.
- **Online:** A/B tests on click-through rate, watch time, revenue ([file 07](07-math-probability-statistics.md#20-ab-testing)).

**Cold start fixes:** ask new users for preferences; recommend popular items; use content-based features for new items.

---

## 13. Time series forecasting

Building on [file 10's time series basics](10-data-science-workflow.md#14-time-series-basics) (trend, seasonality, stationarity, lags).

### Baselines first

- **Naive:** tomorrow = today
- **Seasonal naive:** next Monday = last Monday
- **Moving average:** average of the last n values

Any fancy model must beat these.

### Exponential smoothing

A weighted average where **recent values count more**, with weights shrinking exponentially into the past. **Holt-Winters** extends it to handle trend and seasonality. Simple, fast, often strong.

### ARIMA

**ARIMA(p, d, q)** = **A**uto**R**egressive **I**ntegrated **M**oving **A**verage:
- **AR(p):** predict from the last p values ("today depends on the last few days")
- **I(d):** difference the series d times to make it stationary ([file 10](10-data-science-workflow.md#14-time-series-basics))
- **MA(q):** use the last q forecast errors

**SARIMA** adds **seasonal** terms (e.g. weekly or yearly patterns). **SARIMAX** also uses external variables (e.g. holidays, promotions, temperature).

```python
from statsmodels.tsa.statespace.sarimax import SARIMAX
model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 7)).fit()
forecast = model.forecast(steps=14)
```

### Prophet

Facebook/Meta's library: models trend + seasonality + holidays as separate additive parts. Easy to use, handles missing data, good for business series with strong seasonality.

```python
from prophet import Prophet
m = Prophet(yearly_seasonality=True, weekly_seasonality=True)
m.fit(df.rename(columns={"date": "ds", "sales": "y"}))
future = m.make_future_dataframe(periods=30)
forecast = m.predict(future)
```

### ML approach: forecasting as regression

Create **lag** and **rolling** features plus calendar features ([file 10](10-data-science-workflow.md#14-time-series-basics)), then train gradient-boosted trees ([file 12](12-supervised-learning-algorithms.md#13-xgboost-lightgbm-catboost)). Very strong in practice, especially with many related series (e.g. sales for 10,000 products) and external features. Deep learning models (LSTMs, file 17; transformer-based forecasters and pretrained "foundation" forecasting models) are also used for large-scale forecasting.

### Evaluating forecasts: backtesting

Never use random splits. Use **walk-forward validation** (time-series cross-validation, [file 11](11-ml-fundamentals.md#14-cross-validation)):

```
Fold 1: train [Jan──────Jun] → test [Jul]
Fold 2: train [Jan───────────Jul] → test [Aug]
Fold 3: train [Jan────────────────Aug] → test [Sep]
```

Metrics: MAE, RMSE, MAPE ([file 13](13-evaluation-metrics-and-tuning.md#11-regression-metrics)), or **MASE** (error relative to the naive forecast; < 1 means you beat naive).

Report **prediction intervals** ("we expect 1,200 ± 150 units"), not just a single number.

---

## 14. Explainability

**Why explain models?**
- **Trust:** doctors, managers and customers won't act on a black box
- **Debugging:** find leakage ([file 10](10-data-science-workflow.md#13-data-leakage-preview)) or spurious patterns (e.g. a model that detects "hospital" from a watermark rather than the disease)
- **Fairness:** check the model isn't relying on protected attributes (file 29)
- **Regulation:** laws may require explanations for decisions like loans

**Two levels:**
- **Global:** how does the model behave overall? Which features matter most?
- **Local:** why did the model make *this particular* prediction?

**Interpretable by design:** linear/logistic regression (coefficients), small decision trees (rules). **Black-box models** (random forests, boosting, neural nets) need **post-hoc** explanation methods.

### Built-in feature importance (trees)

`model.feature_importances_` ([file 12](12-supervised-learning-algorithms.md#8-decision-trees)): how much each feature reduced impurity. Quick, but **biased toward features with many unique values** and computed on training data.

### Permutation importance

**Idea:** shuffle one feature's values (breaking its link with the target) and measure how much the model's validation score drops. A big drop means an important feature. Works for **any** model.

```python
from sklearn.inspection import permutation_importance
r = permutation_importance(model, X_val, y_val, n_repeats=10, random_state=0)
```

⚠️ Correlated features share importance: shuffling one may barely hurt if its twin still carries the information.

### Partial Dependence Plots (PDP)

Show how the prediction changes, on average, as **one feature** changes (holding others as they are). E.g. "predicted churn falls steeply as tenure goes from 0 to 12 months, then flattens."

```python
from sklearn.inspection import PartialDependenceDisplay
PartialDependenceDisplay.from_estimator(model, X_val, ["tenure", "monthly_charges"])
```

**ICE plots** (Individual Conditional Expectation) show one line per individual instead of the average.

### SHAP (SHapley Additive exPlanations)

**The most popular explanation method.** Based on **Shapley values** from game theory: how to fairly split a team's winnings among players according to each player's contribution.

Here, the "players" are features and the "winnings" are the prediction. SHAP says how much each feature **pushed this prediction up or down** from the average prediction.

**Worked example:** average predicted churn = 0.20. For one customer, the prediction = 0.65.

| Feature | Value | SHAP value |
|---|---|---|
| contract | month-to-month | +0.25 |
| tenure | 2 months | +0.18 |
| monthly charges | $95 | +0.07 |
| has tech support | yes | −0.05 |
| **Total** | | 0.20 + 0.25 + 0.18 + 0.07 − 0.05 = **0.65** ✓ |

The SHAP values always **add up** exactly from the average to the prediction (the "additive" in the name).

**Plots:**
- **Waterfall / force plot:** one prediction (local)
- **Summary (beeswarm) plot:** every feature's SHAP values for all rows (global): which features matter and in which direction
- **Dependence plot:** SHAP value vs a feature's value

```python
import shap
explainer = shap.TreeExplainer(model)          # fast exact version for tree models
shap_values = explainer(X_val)
shap.plots.waterfall(shap_values[0])           # explain one prediction
shap.plots.beeswarm(shap_values)               # global summary
```

### LIME (Local Interpretable Model-agnostic Explanations)

**Idea:** to explain one prediction, create many slightly changed versions of that example, see how the black-box model's predictions change, and fit a **simple linear model** to those results. The simple model's weights are the explanation, valid only **locally** (near that one example).

✅ Works on any model, including text and images (which words/pixel regions mattered).
❌ Explanations can be unstable between runs.

### SHAP vs LIME

| | SHAP | LIME |
|---|---|---|
| Theory | Strong (Shapley values, consistent, additive) | Heuristic |
| Stability | Stable | Can vary between runs |
| Speed | Fast for trees; slow for others | Moderate |
| Scope | Local + global | Local |

⚠️ **Explanations describe the model, not reality.** SHAP says what the model relies on; it doesn't prove causation ([file 07](07-math-probability-statistics.md#15-correlation-is-not-causation)).

---

## 15. Check yourself

**Q1.** Run k-means (k = 2) on [2, 4, 10, 12] starting with centroids 2 and 4. What are the final clusters?
<details><summary>Answer</summary>Assign: 2→c₁; 4,10,12→c₂ (4 is closer to 4). Update: c₁=2, c₂=8.67. Assign: 2,4→c₁ (4 is 2 from c₁ vs 4.67 from c₂); 10,12→c₂. Update: c₁=3, c₂=11. Stable. Clusters {2,4} and {10,12}.</details>

**Q2.** Your clusters are crescent-shaped and there's noise. k-means or DBSCAN?
<details><summary>Answer</summary>DBSCAN (or HDBSCAN): it handles arbitrary shapes and labels noise.</details>

**Q3.** PCA on 100 features: the first 10 components explain 92% of the variance. What does that mean?
<details><summary>Answer</summary>You can represent the data with 10 new features instead of 100 while keeping 92% of its variation (spread).</details>

**Q4.** On a t-SNE plot, cluster A looks twice as big as cluster B. Does that mean A has more spread in the original data?
<details><summary>Answer</summary>No. t-SNE cluster sizes and between-cluster distances aren't meaningful.</details>

**Q5.** 2,000 baskets. 200 contain diapers; 120 contain diapers and beer; 400 contain beer. Compute support, confidence and lift for {diapers} → {beer}.
<details><summary>Answer</summary>Support = 120/2000 = 0.06. Confidence = 120/200 = 0.60. P(beer) = 0.20. Lift = 0.60/0.20 = **3.0**.</details>

**Q6.** What's the cold start problem, and which approach handles new items better?
<details><summary>Answer</summary>New users/items have no interaction history, so collaborative filtering can't recommend them. Content-based filtering handles new items (it uses item features).</details>

**Q7.** Why not randomly shuffle data to evaluate a forecasting model?
<details><summary>Answer</summary>It leaks future information into training. Use walk-forward (time-ordered) validation.</details>

**Q8.** Average prediction is 100. A house's SHAP values: size +40, location +25, age −15. What's its prediction?
<details><summary>Answer</summary>100 + 40 + 25 − 15 = **150**.</details>

**Q9.** A model's top feature (by permutation importance) is `customer_id`. What do you suspect?
<details><summary>Answer</summary>Leakage or memorisation (IDs might correlate with signup time or be duplicated across train/test). Investigate; IDs normally shouldn't be features.</details>

---

## 16. New words in this file

| Word | Meaning |
|---|---|
| Clustering, cluster | Grouping similar unlabelled points / one group |
| Customer segmentation | Splitting customers into groups |
| k-means, centroid, k-means++ | Cluster by nearest mean / cluster centre / smart initialisation |
| Inertia (WCSS) | Total squared distance to centroids |
| Elbow method, silhouette score | Ways to choose the number of clusters |
| Hierarchical (agglomerative) clustering, dendrogram | Merge closest clusters repeatedly / the merge tree |
| Linkage (single, complete, average, Ward) | How cluster distance is measured |
| DBSCAN, eps, min_samples, core/border/noise point, HDBSCAN | Density-based clustering and its parts |
| GMM, EM algorithm, soft clustering | Mixture of Gaussians / fitting method / probabilistic membership |
| BIC / AIC | Model scores balancing fit and complexity |
| Dimensionality reduction / feature extraction | Creating fewer new features |
| PCA, principal component, explained variance ratio, scree plot | Variance-maximising directions and their measures |
| t-SNE, perplexity, UMAP | Non-linear 2-D visualisation methods |
| LDA (Linear Discriminant Analysis) | Supervised dimension reduction |
| Anomaly / outlier / novelty detection | Finding unusual points |
| Isolation Forest, LOF, One-Class SVM | Anomaly detection algorithms |
| Reconstruction error | How badly an autoencoder rebuilds an input |
| Contamination | Expected share of anomalies |
| Association rules, market basket analysis | Items bought together |
| Support, confidence, lift | Frequency / conditional probability / strength vs chance |
| Apriori, FP-Growth | Rule-mining algorithms |
| Recommender system | Predicts what users will like |
| User-item matrix, sparse | Interaction table / mostly empty |
| Explicit / implicit feedback | Ratings / clicks, watch time |
| Content-based / collaborative filtering | Similar items / similar users' behaviour |
| Filter bubble | Only recommending more of the same |
| Cold start | No history for new users/items |
| Matrix factorisation, latent factors, ALS | Low-rank user/item vectors / hidden traits / training method |
| Two-tower model, candidate generation, ranking | Modern recommender architecture and stages |
| Precision@k, Recall@k, NDCG, MAP | Ranking metrics |
| Coverage, diversity, novelty, serendipity | Beyond-accuracy recommender qualities |
| Naive / seasonal naive / moving average forecast | Forecasting baselines |
| Exponential smoothing, Holt-Winters | Weighted-recent forecasting with trend/seasonality |
| ARIMA (AR, I, MA), SARIMA, SARIMAX | Classic statistical forecasting models |
| Prophet | Meta's additive forecasting library |
| Walk-forward validation / backtesting | Time-ordered evaluation |
| MASE, prediction interval | Error vs naive / range forecast |
| Explainability, global vs local explanation | Understanding models overall / for one prediction |
| Interpretable vs black-box model, post-hoc | Understandable by design / not / explained afterwards |
| Permutation importance | Score drop when a feature is shuffled |
| PDP, ICE | Average / individual effect of one feature |
| SHAP, Shapley values | Fair additive feature contributions from game theory |
| Waterfall, beeswarm, dependence plot | SHAP charts |
| LIME | Local linear approximation of a black box |

**🎉 You've finished Part C: Machine Learning!**

**Mini project for Part C:** use the **Telco Customer Churn** dataset (Kaggle). Build: a baseline → logistic regression pipeline → random forest → LightGBM/XGBoost with early stopping. Tune with Optuna, choose a threshold using business costs, report PR-AUC and recall/precision on the test set, and explain the model with SHAP. Bonus: cluster customers with k-means and profile the segments. Write it up as a README for a manager.

**Next:** [15-neural-networks.md](15-neural-networks.md)
