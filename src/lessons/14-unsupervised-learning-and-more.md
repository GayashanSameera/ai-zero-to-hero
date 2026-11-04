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

**Why it exists:** a company often has thousands of customers or documents and no labels telling it which belong together. Nobody can read them all, yet marketing still needs "groups" to act on. Clustering lets the data suggest the groups by itself.

**Idea:** group similar data points together **without labels** ([unsupervised learning, file 11](11-ml-fundamentals.md#2-types-of-machine-learning)). Points in the same **cluster** are similar; points in different clusters are different.

**Analogy:** at a party with no name tags, people naturally form groups: the cricket fans, the coworkers, the family. Clustering finds such groups in data.

**Uses:**
- **Customer segmentation:** "budget shoppers", "premium loyalists", "occasional big spenders"
- Grouping similar documents or news articles
- Image compression (group similar colours)
- Finding patterns in genes
- Pre-labelling: cluster first, then have humans name the clusters

**Similarity** is usually measured by **distance** ([file 05](05-math-linear-algebra.md#5-distance-between-vectors)), so **scale your features first** ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)).

### Worked example: how "similar" becomes a number

Three customers, described by (visits per month, spend per month in Rs. thousands): A = (4, 10), B = (5, 12), C = (20, 60). Distance is the straight-line (Euclidean) distance from [file 05](05-math-linear-algebra.md#5-distance-between-vectors).

1. d(A, B) = √[(5 − 4)² + (12 − 10)²] = √(1 + 4) = √5 = **2.24**
2. d(A, C) = √[(20 − 4)² + (60 − 10)²] = √(256 + 2500) = √2756 = **52.5**
3. A and B are close, so they land in one cluster; C is far, so it starts a different one.

Now see why scaling matters. Suppose spend were stored in rupees (10,000 and 12,000 instead of 10 and 12). Then d(A, B) = √[(5 − 4)² + (12,000 − 10,000)²] = √(1 + 4,000,000) ≈ 2,000. The "visits" column (difference 1) would be invisible next to the "spend" column (difference 2,000). The unit you happened to choose would decide the clusters. After scaling, both columns count fairly.

```
Before clustering             After clustering (k = 3)
  spend                         spend
   │      ·  ·                   │      ◆  ◆       ◆ = big spenders
   │   ·   ·                     │   ●   ●         ● = regulars
   │ ·  ·    ·                   │ ▲  ▲    ▲       ▲ = occasional
   └──────────── visits          └──────────── visits
 (no labels, just dots)        (the algorithm drew the groups)
```

**Where you'll meet it in real work:** a supermarket chain (for example Cargills or Keells) grouping loyalty-card customers by visits and spend, then sending each group a different offer. A telecom grouping subscribers by data, voice and SMS usage to design packages.

**Common mistakes:**
- **Clustering unscaled features.** The biggest-number column wins (see the example above).
- **Expecting "the right answer".** There are no labels, so there is no single correct set of clusters. A good clustering is one that people can name and act on.
- **Using the clusters without profiling them.** The algorithm gives you "cluster 0, 1, 2". Turning that into "weekend families" and "daily single shoppers" is your job.

**Exam angle:** know that clustering is **unsupervised** (no labels, no target), that it relies on a distance or similarity measure, and that features must be scaled first.

> **සිංහලෙන්:** Clustering කියන්නේ labels නැතුව, එකිනෙකට සමාන දේවල් එකට ගොඩ ගහන එක. Cargills එකේ customers 2,000ක් ඉන්නවා කියලා හිතන්න. මාසෙකට කී පාරක් එනවද, කොච්චර වියදම් කරනවද කියන දෙක බලලා model එක තනියම කණ්ඩායම් 3ක් හදනවා, උදා: සතියකට පාරක් ඇවිත් Rs. 25,000 වියදම් කරන පවුල්, දවසට පාරක් ඇවිත් Rs. 6,000 වියදම් කරන තනි අය. Similarity මනින්නේ distance එකෙන් නිසා features scale කරන්න අමතක කරන්න එපා, නැත්නම් rupees වලින් තියෙන column එක විතරක් ඉස්සරහට එනවා. ඒ groups වලට නම දාන්නේ ඔයා, model එකට ඒක බෑ.

---

## 2. k-Means

**Why it exists:** finding the best split of thousands of points into groups exactly would take far too long. k-means is a quick, simple recipe that gets a good split by repeating two easy steps.

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

### Worked example (2-D, every step)

Six customers described by two scaled features: P1 = (1, 1), P2 = (2, 1), P3 = (1, 2), P4 = (8, 8), P5 = (9, 8), P6 = (8, 9). Choose k = 2 and start the centroids at c₁ = (1, 1) and c₂ = (2, 1), a deliberately poor start.

**Round 1, assign** (distance = √(Δx² + Δy²)):

| Point | to c₁ = (1,1) | to c₂ = (2,1) | joins |
|---|---|---|---|
| P1 (1,1) | 0 | 1 | c₁ |
| P2 (2,1) | 1 | 0 | c₂ |
| P3 (1,2) | 1 | √2 = 1.41 | c₁ |
| P4 (8,8) | √98 = 9.90 | √85 = 9.22 | c₂ |
| P5 (9,8) | √113 = 10.63 | √98 = 9.90 | c₂ |
| P6 (8,9) | √113 = 10.63 | √100 = 10.00 | c₂ |

**Round 1, update:** c₁ = mean of P1, P3 = ((1 + 1) ÷ 2, (1 + 2) ÷ 2) = **(1, 1.5)**. c₂ = mean of P2, P4, P5, P6 = ((2 + 8 + 9 + 8) ÷ 4, (1 + 8 + 8 + 9) ÷ 4) = **(6.75, 6.5)**.

**Round 2, assign:** P1, P2, P3 are now closer to c₁ (for P2: 1.12 versus 7.27). P4, P5, P6 are closer to c₂ (for P4: 1.95 versus 9.55). **Update:** c₁ = (4 ÷ 3, 4 ÷ 3) = **(1.33, 1.33)**; c₂ = (25 ÷ 3, 25 ÷ 3) = **(8.33, 8.33)**.

**Round 3, assign:** nobody changes group, so the algorithm **stops**. Final clusters: {P1, P2, P3} and {P4, P5, P6}, even though the start was bad.

**Inertia** = sum of squared distances to the own centroid. For cluster 1: 0.222 + 0.556 + 0.556 = 1.333. For cluster 2 the same: 1.333. Total inertia = **2.67**.

**Where you'll meet it in real work:** grouping millions of customers or app users quickly (it scales well), and **vector quantisation**: shrinking an image to 16 colours by clustering its pixels' colours.

**Common mistakes:**
- **Running it once with one random start.** Use `n_init=10` or higher, or the default k-means++.
- **Using it on categorical data** such as "district = Galle". A mean of categories means nothing. Use k-modes or encode carefully.
- **Forgetting that it always returns k clusters,** even when the data has no real groups.

**Exam angle:** k-means is the standard example of unsupervised learning. Know the assign/update loop, that it minimises inertia, that k must be chosen by you, and that it prefers round, equal-sized clusters.

> **සිංහලෙන්:** k-means වැඩ කරන්නේ ලේසි විදිහකට. කොළඹ පිටකොටුවේ බස් නැවතුම් 3ක් දාන්න ඕනේ කියලා හිතන්න. මුලින් නැවතුම් 3 ඕනෑම තැනක දානවා, හැම මගියාම ළඟම නැවතුමට යවනවා, ඊට පස්සේ නැවතුම ඒ මගීන්ගේ මැදට ගෙනියනවා. මේක කිසි වෙනසක් නැති වෙනකම් නැවත නැවත කරනවා. අපේ උදාහරණයේ points 6ක් තිබුණා, මුල් centroids දෙක වැරදි තැන්වල තිබුණත් round 3කින් නිවැරදි groups දෙකට ආවා. k කියන්නේ ඔයා තීරණය කරන අගයක්, දත්ත වල groups නැති වුණත් model එක කොහොමත් k ගණනක් දෙනවා.

---

## 3. Choosing k

**Why it exists:** k-means will not tell you how many groups there really are; you must supply k. These two tools turn "pick k" from a guess into an evidence-based choice.

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

### Worked example: reading an elbow table

Illustrative inertia values from running k-means for k = 1 to 6 on the same data:

| k | 1 | 2 | 3 | 4 | 5 | 6 |
|---|---|---|---|---|---|---|
| Inertia | 500 | 210 | 90 | 80 | 72 | 66 |
| Drop from the previous k | n/a | 290 | 120 | 10 | 8 | 6 |

The drops are big until k = 3, then collapse to single digits. Adding a 4th cluster buys almost nothing, so the elbow is at **k = 3**.

### Worked example: the silhouette of single points

Remember s = (b − a) ÷ max(a, b), where a = average distance to its own cluster and b = average distance to the nearest other cluster.

| Point | a | b | Calculation | s | Meaning |
|---|---|---|---|---|---|
| X | 2 | 8 | (8 − 2) ÷ 8 | **0.75** | clearly in the right cluster |
| Y | 5 | 5 | (5 − 5) ÷ 5 | **0** | right on the border |
| Z | 6 | 3 | (3 − 6) ÷ 6 | **−0.5** | closer to the other cluster; probably misplaced |

Average s over all points, for each k, and prefer the k with the highest value. When the elbow is unclear, the silhouette is a good tie-breaker.

**Where you'll meet it in real work:** a bank deciding how many customer segments to design products for. The analyst shows the elbow and silhouette plots, then asks the business: "can we run three campaigns, or only two?"

**Common mistakes:**
- **Picking the k with the lowest inertia.** Inertia always falls as k grows, so that rule always picks the largest k.
- **Trusting the elbow blindly.** Sometimes there is no clear bend. Combine it with the silhouette score and business sense.
- **Computing silhouette with unscaled data.** It uses distances too.

**Exam angle:** expect "which method helps choose the number of clusters?" The answer is the elbow method (inertia) or the silhouette score.

> **සිංහලෙන්:** k කීයක් ගන්නද කියලා තීරණය කරන්න ක්‍රම දෙකක් තියෙනවා. Elbow method එකේදී k = 1 ඉඳන් 6 දක්වා inertia බලනවා, උදා: 500, 210, 90, 80, 72, 66. k = 3 වෙනකම් ලොකුවට අඩු වෙනවා, ඊට පස්සේ අඩු වෙන්නේ 10, 8, 6 වගේ පොඩියට, ඒ නිසා වංගුව (elbow) k = 3යි. Silhouette score එක 1ට ළං නම් point එක හරි cluster එකේ, 0 නම් දෙකේ මායිමේ, සෘණ නම් වැරදි cluster එකේ. Inertia අඩුම k එක ගන්න එපා, ඒක හැමතිස්සෙම ලොකුම k එකම වෙනවා.

---

## 4. Hierarchical clustering

**Why it exists:** sometimes you do not know k, and you want to see how groups nest inside bigger groups (cats and dogs are both animals). Hierarchical clustering draws that whole family tree and lets you choose the level afterwards.

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

### Worked example: building a dendrogram by hand (single linkage)

Five points on a number line: A = 1, B = 2, C = 6, D = 9, E = 10. Single linkage means the distance between two clusters is the gap between their **closest** members.

1. Start with 5 clusters. Closest pairs: A–B (gap 1) and D–E (gap 1). Merge both at **height 1** → {A,B}, {D,E}, {C}.
2. Distances now: {A,B} to C = 6 − 2 = 4; C to {D,E} = 9 − 6 = 3; {A,B} to {D,E} = 9 − 2 = 7. The smallest is 3, so merge C with {D,E} at **height 3** → {A,B}, {C,D,E}.
3. Last merge: {A,B} to {C,D,E} = 6 − 2 = 4, at **height 4**.

```
height
  4 │      ┌────────┴────────┐
  3 │      │            ┌────┴────┐
  1 │   ┌──┴──┐         │      ┌──┴──┐
    │   A     B         C      D     E
    cut at 3.5 → 2 clusters {A,B} and {C,D,E}
```

A cut at height 2 gives 3 clusters ({A,B}, {C}, {D,E}). Long vertical lines in the tree mean "these two groups were far apart when they merged", which is a natural place to cut.

**Where you'll meet it in real work:** biology (family trees of species or genes), grouping similar support tickets or product categories when the dataset is small enough to inspect.

**Common mistakes:**
- **Using it on very large data.** It needs the full distance table, which grows with n².
- **Using single linkage and getting "chains"** where far-apart points are linked through a trail of in-between points.
- **Reading the horizontal order of leaves as meaningful.** Only the heights matter.

**Exam angle:** remember "agglomerative = bottom-up merging", that the dendrogram lets you choose the number of clusters afterwards, and that Ward linkage is the usual default.

> **සිංහලෙන්:** Hierarchical clustering කියන්නේ පවුල් ගහක් හදනවා වගේ වැඩක්. මුලින් හැම point එකක්ම තනි කණ්ඩායමක්. ඊට පස්සේ ළඟම කණ්ඩායම් දෙක නැවත නැවත එකතු කරනවා. අපේ උදාහරණයේ 1, 2, 6, 9, 10 කියන අංක ගත්තාම 1 සහ 2 එකතු වෙනවා, 9 සහ 10 එකතු වෙනවා, ඊට පස්සේ 6 ඒ 9-10 එක්ක එකතු වෙනවා. අන්තිමට ඔක්කොම එක ගහක් වෙනවා, dendrogram කියන්නේ ඒ ගහට. ඔයා කැමති උසකින් කැපුවාම කණ්ඩායම් කීයක් ඕනේ කියලා තෝරාගන්න පුළුවන්, k ඉස්සරවෙලා දෙන්න ඕනේ නෑ.

---

## 5. DBSCAN

**Why it exists:** k-means only draws round blobs and forces every point, even a stray one, into a group. DBSCAN solves both problems by looking at how crowded each area is.

**Analogy (Sri Lankan):** think of a satellite photo of Sri Lanka at night. Colombo, Kandy and Galle glow as dense clusters of lights, while a single lamp in a paddy field is just a lone dot. DBSCAN finds the glowing crowded areas of any shape and calls the lone lamps "noise".

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

### Worked example: core, border and noise

Seven points on a number line: 1, 2, 3, 10, 11, 12, 30. Choose **eps = 1.5** and **min_samples = 3** (scikit-learn counts the point itself).

| Point | Neighbours within 1.5 (including itself) | Count | Type |
|---|---|---|---|
| 1 | 1, 2 | 2 | not core, but within 1.5 of core point 2, so **border** |
| 2 | 1, 2, 3 | 3 | **core** |
| 3 | 2, 3 | 2 | **border** |
| 10 | 10, 11 | 2 | **border** |
| 11 | 10, 11, 12 | 3 | **core** |
| 12 | 11, 12 | 2 | **border** |
| 30 | 30 | 1 | **noise** (label −1) |

Result: cluster 0 = {1, 2, 3}, cluster 1 = {10, 11, 12}, and 30 is noise. Nobody told the algorithm there would be two clusters.

**Where you'll meet it in real work:** grouping GPS points of three-wheeler pickups into hot-spots (any shape, with stray points ignored), and spotting suspicious transactions that belong to no dense group.

**Common mistakes:**
- **Leaving eps at the default.** The right eps depends on the scale of your data. Scale features and look at a k-distance plot.
- **Expecting it to work when clusters have very different densities.** One eps cannot fit both. Try HDBSCAN.
- **Forgetting that −1 is not a cluster,** it is the noise label.

**Exam angle:** know that DBSCAN needs no k, handles arbitrary shapes, and labels outliers as noise, while k-means does none of those three.

> **සිංහලෙන්:** DBSCAN කියන්නේ ඝනත්වය (density) බලලා cluster හොයන ක්‍රමයක්. රෑට අහසින් ශ්‍රී ලංකාවේ පින්තූරයක් ගත්තා කියලා හිතන්න. කොළඹ, මහනුවර, ගාල්ල වගේ තැන්වල විදුලි බුබුළු ගොඩක් එකට තියෙනවා, ඒවා cluster. වී කුඹුරක් මැද තියෙන තනි පහන noise. eps කියන්නේ "ළඟින්" කියන දුර, min_samples කියන්නේ ඒ දුර ඇතුළේ අඩුම තරමින් කී දෙනෙක් ඉන්න ඕනද කියන එක. මේකට k කියන්න ඕනේ නෑ, ඕනෑම හැඩයක් හොයනවා, noise points වලට label එක −1.

---

## 6. Gaussian Mixture Models

**Why it exists:** real groups overlap. A customer can be partly a "budget shopper" and partly a "family shopper". A hard label throws that information away; GMM keeps it as probabilities.

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

### Worked example: a soft membership

Two clusters, A and B, each a bell curve, and each owns 50% of the data (weights 0.5 and 0.5). For a new point x = 5, suppose the curves give these densities (illustrative numbers): A's curve has height 0.06 at x, B's curve has height 0.02.

1. Weighted density for A: 0.5 × 0.06 = 0.030
2. Weighted density for B: 0.5 × 0.02 = 0.010
3. Total = 0.030 + 0.010 = 0.040
4. P(A | x) = 0.030 ÷ 0.040 = **0.75**, and P(B | x) = 0.010 ÷ 0.040 = **0.25**

This is Bayes' rule ([file 07](07-math-probability-statistics.md)) in action: weight each cluster's density, then divide by the total. k-means would only say "A".

### Worked example: choosing components with BIC

Fit GMMs with 2, 3, 4 and 5 components and compute BIC (illustrative values): 1250, 1100, 1130, 1180. **Lower is better**, so choose **3 components**. More components fit slightly better, but the BIC penalty for extra parameters outweighs the gain.

**Where you'll meet it in real work:** speaker identification in speech systems, and anomaly scoring in finance, where a transaction with a very low probability under the "normal" mixture is flagged.

**Common mistakes:**
- **Choosing the number of components by eye** instead of BIC/AIC.
- **Ignoring that EM can land in a poor local solution.** Use several starts (`n_init`).
- **Treating probabilities as certainties.** "0.75" means the point is mostly, not surely, in A.

**Exam angle:** GMM = soft (probabilistic) clustering fitted with EM; k-means = hard clustering. Questions may also contrast the two.

> **සිංහලෙන්:** GMM කියන්නේ k-means වගේම, ඒත් "මේ point එක cluster A" කියලා කෙළින්ම කියන්නේ නෑ. ඒ වෙනුවට "A එකට 75%, B එකට 25%" කියලා probabilities දෙනවා. Point එකක් cluster දෙකක මායිමේ තියෙනවා නම් ඒක ඇත්තටම හරි පැහැදිලි විදිහට කියන්න පුළුවන්. Clusters ellipse හැඩත් වෙන්න පුළුවන්. කීයක් ගන්නද කියලා තීරණය කරන්නේ BIC එකෙන්, ඒක අඩුම වෙන components ගණන තෝරනවා. උදා: BIC අගයන් 1250, 1100, 1130, 1180 නම් components 3ක් හොඳම එක.

---

# Dimensionality reduction

## 7. Why reduce dimensions?

**Why it exists:** real data often has hundreds or thousands of columns, but people can only see 2-D and models slow down and get confused in very high dimensions. Reducing dimensions keeps the useful signal in fewer numbers.

Data often has many features (dimensions): hundreds of survey answers, thousands of word counts, 768-number embeddings ([file 05](05-math-linear-algebra.md#2-vectors)).

**Reasons to reduce:**
1. **Visualisation:** we can only see 2-D or 3-D
2. **Fight the curse of dimensionality** ([file 10](10-data-science-workflow.md#12-feature-selection)): in high dimensions, everything is far from everything and distances lose meaning
3. **Speed and memory**
4. **Remove noise and redundancy** (correlated features)

**Feature selection** ([file 10](10-data-science-workflow.md#12-feature-selection)) keeps some original features. **Dimensionality reduction** (also called **feature extraction**) creates **new** features that combine the originals.

### Worked example: how much memory does it save?

You have 1,000,000 text embeddings of 768 numbers each, stored as 4-byte floats.

1. Full size: 1,000,000 × 768 × 4 bytes = 3,072,000,000 bytes ≈ **3.07 GB**
2. Reduce to 50 dimensions: 1,000,000 × 50 × 4 = 200,000,000 bytes = **200 MB**
3. Saving: 3.07 GB ÷ 0.2 GB ≈ **15 times smaller**, and every distance calculation is about 15 times cheaper too.

```
Feature selection:    [a b c d e f]  → keep [a c f]       (original columns)
Feature extraction:   [a b c d e f]  → [PC1 PC2 PC3]      (new blended columns)
```

**Where you'll meet it in real work:** vector databases for RAG store embeddings of 384 to 1536 numbers; reducing or compressing them cuts storage cost. Data scientists also squeeze survey data to 2-D to look for patterns.

**Common mistakes:**
- **Reducing before splitting the data.** Fit the reducer on the training set only, otherwise you leak information.
- **Assuming fewer dimensions is always better.** Reduction throws information away; check the model score afterwards.

**Exam angle:** know the three reasons (visualise, speed, fight the curse of dimensionality) and the difference between feature selection and feature extraction.

> **සිංහලෙන්:** Dimensionality reduction කියන්නේ columns ගොඩක් තියෙන data, columns අඩුවෙන් ඒත් වැදගත් දේ නැති නොවෙන්න කුඩා කරන එක. Embeddings මිලියනයක්, හැම එකක්ම අංක 768යි කියමු. float එකකට bytes 4ක් නිසා මුළු size එක 1,000,000 × 768 × 4 ≈ 3.07 GB. අංක 50කට අඩු කළොත් 200 MB, ඒ කියන්නේ වාගේ 15 ගුණයක් පොඩියි. Feature selection එකේදී පරණ columns ටිකක් තියාගන්නවා, feature extraction එකේදී පරණ ඒවා මිශ්‍ර කරලා අලුත් columns හදනවා.

---

## 8. PCA

**Why it exists:** many columns say almost the same thing (height and weight, area in m² and in ft²). PCA finds a smaller set of fresh columns that carry most of the information, ordered from most to least useful.

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

### Worked example: PCA on two correlated features

After standardising height and weight, suppose their covariance matrix is

```
C = [ 1.0  0.8 ]
    [ 0.8  1.0 ]
```

(each feature has variance 1, and they move together with correlation 0.8).

1. Eigenvalues of C: for this symmetric 2 × 2 matrix they are 1 + 0.8 = **1.8** and 1 − 0.8 = **0.2**.
2. Their eigenvectors: PC1 = (1, 1) ÷ √2 = (0.707, 0.707) ("both grow together", overall size), PC2 = (1, −1) ÷ √2 = (0.707, −0.707) ("one up, one down", build).
3. Total variance = 1.8 + 0.2 = 2.0. Explained variance ratio: PC1 = 1.8 ÷ 2.0 = **90%**, PC2 = 0.2 ÷ 2.0 = **10%**.
4. Take one person with standardised values (height, weight) = (1.0, 0.8). Their PC1 score = 0.707 × 1.0 + 0.707 × 0.8 = 0.707 + 0.566 = **1.27**.
5. So one number (1.27) replaces two numbers, and we keep 90% of the variation.

**Where you'll meet it in real work:** compressing 64-pixel digit images to about 10 components before a classifier, removing correlated sensor readings in a factory, and speeding up models on survey data.

**Common mistakes:**
- **Not standardising first.** A feature measured in big units (rupees) will dominate the first component.
- **Fitting PCA on all the data before the train/test split** (leakage). Fit on train, then transform test.
- **Trying to read each component as a business feature.** Components are blends; interpret them cautiously.

**Exam angle:** PCA is linear, unsupervised, maximises variance, and uses eigenvectors of the covariance matrix (or SVD). A common question: "the first two components explain 85%; what does that mean?"

> **සිංහලෙන්:** PCA කියන්නේ data වල වැඩිම විසිරීම (variance) පේන අලුත් අක්ෂ හොයන එක. උස සහ බර දෙක එකට වැඩි වෙනවා නම් ඒ දෙකම කියන්නේ ආසන්න වශයෙන් එකම දේ, "ශරීරයේ ප්‍රමාණය". PCA ඒ දෙක එක අංකයකට හරවනවා. අපේ උදාහරණයේ PC1 එකෙන් variance එකෙන් 90%ක් තියාගත්තා, ඒ කියන්නේ column දෙකක් වෙනුවට එකක් ගත්තාට විශේෂ දෙයක් නැති වෙන්නේ නෑ. PCA කරන්න කලින් features scale කරන්න අමතක කරන්න එපා.

---

## 9. t-SNE and UMAP

**Why it exists:** PCA only finds straight-line structure. Real data (images, embeddings) often forms curved shapes, and t-SNE and UMAP can show those groups in a 2-D picture you can look at.

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

### Which tool for which job?

| | PCA | t-SNE | UMAP |
|---|---|---|---|
| Linear or non-linear | linear | non-linear | non-linear |
| Speed | very fast | slow on big data | fast |
| Keeps | global variance | local neighbourhoods | local + more global shape |
| Good for model features | yes | **no** | sometimes |
| Good for pictures | okay | excellent | excellent |

A common recipe for embeddings: run PCA first to reduce 768 dimensions to about 50, then run t-SNE or UMAP on those 50 to get 2-D. It is faster and a little less noisy.

### Worked example: reading a plot

You run t-SNE on 1,797 handwritten-digit images (64 pixels each, a standard scikit-learn practice dataset) and see ten islands, one per digit 0 to 9. Two islands (the 3s and the 8s) touch each other. What can you conclude?
- ✅ Many digit images of the same class look alike, so the data has learnable structure.
- ✅ 3s and 8s are easily confused (a classifier will probably find them harder).
- ❌ You cannot say the 3-island is "twice as big" or "three units away" from the 5-island; sizes and gaps are not reliable in t-SNE.

**Where you'll meet it in real work:** plotting embeddings of customer reviews to see whether complaints about delivery and about product quality fall in separate regions, a standard sanity check for RAG and search systems.

**Common mistakes:**
- **Over-reading sizes and gaps** (see the warning list above).
- **Running it once and trusting the picture.** Try a few perplexity or n_neighbours settings.
- **Using t-SNE coordinates as input features.**

**Exam angle:** t-SNE and UMAP are for **visualisation**; PCA is the one used for preprocessing. Questions often ask which method preserves local neighbourhoods (t-SNE/UMAP) and which is linear (PCA).

> **සිංහලෙන්:** t-SNE සහ UMAP වලින් ඔයාට අංක 768ක් තියෙන embeddings පින්තූරයක් විදිහට 2D එකට ගේන්න පුළුවන්. ළඟ ළඟ තියෙන points ඇත්තටම සමානයි. ඒත් cluster එකක ප්‍රමාණය හරි cluster දෙකක් අතර දුර හරි කිසිම අදහසක් දෙන්නේ නෑ, ඒක ලොකුම වැරැද්ද. ඒ වගේම මේ coordinates model එකකට features විදිහට දෙන්න එපා. PCA වලට model වලට features දෙන්න පුළුවන්, ඒත් t-SNE එක පින්තූරයක් බලන්න විතරයි. අත් අකුරු ඉලක්කම් 1,797ක් t-SNE කළාම 0 ඉඳන් 9 දක්වා දූපත් 10ක් පේනවා.

---

# Other unsupervised tasks

## 10. Anomaly detection

**Why it exists:** the cases you care about most (a fraud, a failing machine, a hacked account) are rare and look different each time, so you cannot collect enough labelled examples. Anomaly detection learns what "normal" looks like and flags whatever does not fit.

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

### Worked example: z-score and IQR rules

Daily mobile-wallet transfers for one customer average **Rs. 4,000** with a standard deviation of **Rs. 500**. Today there is a transfer of Rs. 6,000.

1. z = (6,000 − 4,000) ÷ 500 = **4.0**
2. A common rule flags |z| > 3, which here means anything above 4,000 + 3 × 500 = Rs. 5,500. So Rs. 6,000 is flagged.

The IQR version ([file 07](07-math-probability-statistics.md#4-percentiles-quartiles-iqr-outliers)): say Q1 = 3,000 and Q3 = 5,000.
1. IQR = 5,000 − 3,000 = 2,000
2. Upper fence = Q3 + 1.5 × IQR = 5,000 + 3,000 = **8,000**
3. Rs. 6,000 is **below** the fence, so the IQR rule does **not** flag it. The two rules disagree because the z-score assumed a bell-shaped spread; the IQR rule makes no such assumption.

### Worked example: Isolation Forest scores

Take the numbers 10, 11, 12, 13, 14, 95. A random tree picks a split point between the minimum and maximum, say 60. That one cut already isolates 95 on its own: path length 1. To isolate 12 you need several cuts (cut between 10 and 11, then 11 and 12, then 12 and 13...), so the path is long. Averaged over many random trees, 95 gets a short average path and so a high anomaly score.

**Where you'll meet it in real work:** a bank's card-fraud team scoring each transaction in real time, a factory watching vibration sensors on a machine, and a telecom spotting SIM-box fraud (unusual call patterns).

**Common mistakes:**
- **Judging by accuracy.** If 99.9% of cases are normal, a model that never flags anything is "99.9% accurate" and useless. Use precision, recall and PR-AUC.
- **Computing mean and standard deviation including the outliers,** which stretches the scale and hides them. Use median and IQR (robust statistics).
- **Setting `contamination` without evidence.** It controls how many points get flagged; match it to a believable rate.
- **Treating every flag as fraud.** Anomaly means unusual, not necessarily bad. A person buying a laptop is an outlier, and perfectly legitimate.

**Exam angle:** know that anomaly detection is usually unsupervised or semi-supervised, that Isolation Forest isolates anomalies in few splits, and that accuracy is a poor metric for rare events.

> **සිංහලෙන්:** Anomaly detection කියන්නේ සාමාන්‍යයට වඩා වෙනස් දේවල් හොයන එක. Fraud, machine එකක් නරක් වීම වගේ දේවල් ඉතා කලාතුරකින් වෙන නිසා ඒවාට labels ගොඩක් නෑ. උදා: කෙනෙක් සාමාන්‍යයෙන් දවසකට Rs. 4,000ක් මාරු කරනවා, සම්මත අපගමනය (standard deviation) Rs. 500යි. එයා එක පාරටම Rs. 6,000 යැව්වොත් z = (6,000 − 4,000) ÷ 500 = 4, ඒක 3ට වැඩි නිසා flag කරනවා. Isolation Forest එකේදී අහඹු කැපීම් කිහිපයකින්ම තනි කරගන්න පුළුවන් point එක anomaly. Accuracy වලින් මනින්න එපා, precision සහ recall බලන්න.

---

## 11. Association rules

**Why it exists:** a shop owner who knows which items sell together can place them side by side, bundle them or discount one to sell the other. Association rules find those pairs from thousands of receipts automatically.

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

### Worked example: a Sri Lankan grocery basket

500 bills at a corner shop. 100 contain **milk powder**. 150 contain **tea**. 60 contain **both**. Rule: {milk powder} → {tea}.

1. Support = 60 ÷ 500 = **0.12** (12% of all bills contain both)
2. Confidence = 60 ÷ 100 = **0.60** (60% of milk-powder bills also have tea)
3. P(tea) = 150 ÷ 500 = 0.30
4. Lift = 0.60 ÷ 0.30 = **2.0** (milk-powder buyers are twice as likely to buy tea as a random customer)

Why lift matters: if 90% of all bills contained rice, then {anything} → {rice} would show 90% confidence for every rule, but a lift near 1. Confidence alone is fooled by popular items; lift corrects for that.

### Worked example: Apriori pruning

With 1,000 baskets and min_support = 0.01 (10 baskets), suppose {saffron} appears in only 5 baskets. Then {saffron, rice}, {saffron, ghee} and every other set containing saffron can appear in at most 5 baskets, so they all fail the threshold. Apriori skips them without counting, saving a huge amount of work.

**Where you'll meet it in real work:** "Frequently bought together" boxes on Daraz or Amazon, and supermarket shelf layouts.

**Common mistakes:**
- **Reading high confidence as a strong rule** without checking lift.
- **Reading a rule as cause.** Customers do not buy tea because they bought milk powder; both belong to the same shopping trip.
- **Setting min_support too low** and drowning in thousands of useless rules.

**Exam angle:** be able to compute support, confidence and lift from counts, and to state that lift > 1 means a positive association.

> **සිංහලෙන්:** Association rules කියන්නේ "මේ දෙක එකට ගන්න එක" හොයන එක. කඩේක බිල්පත් 500ක් තියෙනවා. කිරි පිටි තියෙන බිල් 100යි, තේ කොළ තියෙන බිල් 150යි, දෙකම තියෙන බිල් 60යි. Support = 60 ÷ 500 = 0.12. Confidence = 60 ÷ 100 = 0.6. Lift = 0.6 ÷ (150 ÷ 500) = 0.6 ÷ 0.3 = 2. ඒ කියන්නේ කිරි පිටි ගන්න කෙනෙක් තේ ගන්න ඉඩ සාමාන්‍ය කෙනෙක්ට වඩා දෙගුණයක් වැඩියි. Lift එක 1ට වඩා වැඩි නම් විතරයි සම්බන්ධයක් තියෙන්නේ.

---

# Applied ML

## 12. Recommender systems

**Why it exists:** a shop can show only a few items, yet a catalogue has millions. Recommenders pick the few that this particular person is most likely to want, which raises sales and keeps users happy.

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

### Worked example: collaborative filtering with numbers

Ratings out of 5. We want to guess Kasun's rating for film D.

| | A | B | C | D |
|---|---|---|---|---|
| Kasun | 5 | 4 | 1 | **?** |
| Nimali | 5 | 5 | 1 | 4 |
| Ruwan | 1 | not seen | 5 | 2 |

**Step 1: similarity** by cosine ([file 05](05-math-linear-algebra.md#7-cosine-similarity)) on the films both have rated.
- Kasun vs Nimali (A, B, C): Kasun = (5, 4, 1), Nimali = (5, 5, 1). Dot = 25 + 20 + 1 = 46. Lengths: √42 = 6.48 and √51 = 7.14. Cosine = 46 ÷ (6.48 × 7.14) = 46 ÷ 46.3 = **0.99**.
- Kasun vs Ruwan (A, C): Kasun = (5, 1), Ruwan = (1, 5). Dot = 5 + 5 = 10. Lengths: √26 = 5.10 each. Cosine = 10 ÷ 26 = **0.38**.

**Step 2: weighted average of the neighbours' ratings for D.**
Prediction = (0.99 × 4 + 0.38 × 2) ÷ (0.99 + 0.38) = (3.96 + 0.76) ÷ 1.37 = 4.72 ÷ 1.37 ≈ **3.4**.

Nimali is nearly identical to Kasun, so her 4 pulls the answer up; Ruwan's different taste (and his low 2) pulls it down. A system would then compare 3.4 with Kasun's other candidates and recommend the highest.

### Worked example: Precision@k and Recall@k

A shop shows 5 recommended items. Positions 1, 3 and 4 were items the user actually wanted; positions 2 and 5 were not. The user wanted 6 items in total.
- Precision@5 = relevant shown ÷ shown = 3 ÷ 5 = **0.60**
- Recall@5 = relevant shown ÷ all relevant = 3 ÷ 6 = **0.50**
NDCG would score this list even higher if the three hits were at positions 1, 2, 3 instead, because it rewards putting good items near the top.

**Where you'll meet it in real work:** Daraz "recommended for you", YouTube's next video, Spotify playlists, and a bank suggesting the next product (savings plan, card) to a customer.

**Common mistakes:**
- **Evaluating with a random split.** Recommendations are about the future, so split by time: train on past clicks, test on later ones.
- **Optimising only for clicks,** which can reward clickbait or create a filter bubble.
- **Ignoring cold start** for new users and new items.
- **Using accuracy-style metrics.** With millions of items, most are irrelevant; use ranking metrics.

**Exam angle:** know the three families (content-based, collaborative, hybrid), the cold-start problem, and that two-tower models use embeddings plus nearest-neighbour search, which is the same idea as RAG retrieval.

> **සිංහලෙන්:** Recommender system එකකට කරන්න තියෙන්නේ "මේ කෙනාට මොකක්ද ඕනේ වෙන්නේ" කියලා අනුමාන කරන එක. Content-based කියන්නේ ඔයා කැමති දේ වගේ දේවල් පෙන්වන එක. Collaborative කියන්නේ ඔයාට සමාන රුචි අය කැමති වුණ දේ පෙන්වන එක. උදා: Kasun සහ Nimali films තුනකට සමාන ratings දුන්නා, ඒ නිසා Nimali D film එකට 4ක් දුන්නා නම් Kasun ටත් ආසන්න වශයෙන් ඒ වගේ අගයක් දෙයි කියලා හිතනවා. අලුත් user කෙනෙක්ට හෝ අලුත් item එකකට history නැති එකට cold start කියනවා. Evaluate කරද්දී random split නෙවෙයි, කාලය අනුව split කරන්න.

---

## 13. Time series forecasting

**Why it exists:** businesses must plan ahead: how much rice to stock, how many agents to roster, how much power the grid will need. A forecast turns the history of a series into a number for tomorrow, with a range around it.

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

### Worked example: baselines and exponential smoothing

Weekly sales of a kottu stall: 10, 12, 14 (hundreds of Rs.).
- **Naive** forecast for next week = last value = **14**.
- **Moving average of the last 2** = (12 + 14) ÷ 2 = **13**.
- **Simple exponential smoothing** with α = 0.5: the smoothed level starts at the first value, then each step is α × (new value) + (1 − α) × (previous level).
  - level₁ = 10
  - level₂ = 0.5 × 12 + 0.5 × 10 = 6 + 5 = 11
  - level₃ = 0.5 × 14 + 0.5 × 11 = 7 + 5.5 = **12.5** → the forecast for next week
  With a higher α (say 0.9) the forecast hugs the latest values; with a lower α it is smoother. The weights on older values shrink like 0.5, 0.25, 0.125 and so on, which is the "exponential" in the name.

### Worked example: seasonal naive and MASE

A restaurant sells 4,000 kottu on the Sunday of week 1 and 4,400 on the Sunday of week 2. The seasonal-naive forecast for the Sunday of week 3 is simply **4,400** ("same day last week"). Suppose the actual is 4,600: error = 200.

**MASE** compares your model's average error with the naive method's average error on the same data. If your model's MAE is 80 and the naive MAE is 100, MASE = 80 ÷ 100 = **0.8**. Below 1 means you beat the baseline. Above 1 means a one-line baseline is better than your fancy model.

MAPE example: actual 100, forecast 90 → |100 − 90| ÷ 100 = **10%**. But if the actual is 2 and the forecast is 4, MAPE = 100%, which is why MAPE misbehaves near zero.

**Where you'll meet it in real work:** a telecom forecasting daily data traffic per tower, an electricity board forecasting demand (festival evenings spike), a retailer forecasting stock for Avurudu.

**Common mistakes:**
- **Using random train/test splits.** The model sees the future. Always split by time.
- **Skipping the baseline.** If naive wins, you have wasted effort.
- **Forgetting known events** (holidays, promotions, price changes). Add them as features.
- **Giving one number with no range.** Planning needs a prediction interval.

**Exam angle:** know the order "baseline → classical (ARIMA/Prophet) → ML on lag features", why walk-forward validation is required, and the AR/I/MA letters in ARIMA.

> **සිංහලෙන්:** Forecasting කියන්නේ අතීත data බලලා අනාගතය අනුමාන කරන එක. මුලින්ම සරල baseline එකක් හදන්න: "හෙට = අද" (naive), නැත්නම් "ලබන සඳුදා = ගිය සඳුදා" (seasonal naive). ඔයාගේ fancy model එක ඒවාට වඩා හොඳ නැත්නම් ඒක වැඩක් නෑ. Exponential smoothing එකේදී අලුත්ම අගයන්ට වැඩි බරක් දෙනවා, α = 0.5 නම් ඒ බර 0.5, 0.25, 0.125 විදිහට අඩු වෙනවා. Train/test බෙදද්දී අනිවාර්යයෙන්ම කාලය අනුව බෙදන්න, random shuffle කළොත් අනාගතය train එකට කාන්දු වෙනවා.

---

## 14. Explainability

**Why it exists:** a model that says "reject this loan" with no reason is hard to trust, debug or defend to a customer or a regulator. Explainability tools show which inputs pushed a prediction up or down.

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

### Worked example: permutation importance

A churn model scores **0.90** accuracy on the validation set. Now shuffle one column at a time and re-score:

| Shuffled column | New accuracy | Drop |
|---|---|---|
| tenure | 0.72 | 0.90 − 0.72 = **0.18** (very important) |
| monthly_charges | 0.84 | 0.06 (somewhat important) |
| customer_id | 0.899 | 0.001 (useless, good) |

If customer_id had mattered, that would be a red flag for leakage.

### Worked example: Shapley values by hand (two features)

A house-price model has an average prediction of 100 (Rs. lakhs). Its predictions with different features "known":
- no features: 100
- only size: 140
- only location: 120
- both: 150

Shapley value of **size** = average of its marginal contribution in both orders:
- size first: 140 − 100 = 40
- size after location: 150 − 120 = 30
- average = (40 + 30) ÷ 2 = **35**

Shapley value of **location**:
- location first: 120 − 100 = 20
- location after size: 150 − 140 = 10
- average = (20 + 10) ÷ 2 = **15**

Check: 100 + 35 + 15 = **150**, the full prediction. That "adds up" property is the A in SHAP. Real SHAP libraries do the same averaging over many feature orders, with clever shortcuts for trees.

### Worked example: a loan decision

A bank model has a base approval probability of 0.60. For Nimal: three late repayments = −0.30, income of Rs. 45,000 = −0.10, 8 years in his job = +0.08, age 35 = +0.02. Total = 0.60 − 0.30 − 0.10 + 0.08 + 0.02 = **0.30**, below the 0.5 cut-off, so the loan is declined. The main reason is the late repayments, and that is a reason you can tell the customer.

**Where you'll meet it in real work:** credit decisions, hospital risk scores (a doctor will not act on a black box) and debugging models that learned a shortcut.

**Common mistakes:**
- **Treating an explanation as a cause in the real world.** SHAP explains the model, not reality.
- **Trusting built-in tree importance** on high-cardinality features such as IDs.
- **Explaining a model that is wrong.** First check accuracy and data leakage, then explain.
- **Showing raw SHAP charts to customers.** Translate into plain reasons.

**Exam angle:** this sits under trustworthy AI. Know global vs local explanations, that SHAP values add up to prediction minus average, and that LIME fits a local simple model.

> **සිංහලෙන්:** Explainability කියන්නේ model එක මේ තීරණය ගත්තේ ඇයි කියලා පෙන්වන එක. SHAP එකේ අදහස ක්‍රිකට් එකකින් තේරුම් ගන්න පුළුවන්: ජයග්‍රහණයේ ලකුණු ක්‍රීඩකයන් අතර සාධාරණව බෙදනවා වගේ, prediction එකේ බර features අතර බෙදනවා. උදා: Nimal ගේ ණය approve වෙන probability සාමාන්‍යයෙන් 0.60. පරක්කු ගෙවීම් තුන −0.30, ආදායම −0.10, රැකියා කාලය +0.08, වයස +0.02, එකතුව 0.30. 0.5ට අඩු නිසා ප්‍රතික්ෂේප වෙනවා, ප්‍රධාන හේතුව පරක්කු ගෙවීම්. මේ explanation එකෙන් කියන්නේ model එක මොකක් ගැනද රඳා පවතින්නේ කියලා, ලෝකයේ ඇත්ත හේතුව නෙවෙයි.


```quiz
[
  {"q": "k-means with k = 2 is run on the 1-D points [1, 2, 3, 10, 11, 12]. What are the final centroids?", "options": ["1 and 12", "2 and 11", "3 and 10", "6.5 and 6.5"], "answer": 1, "why": "The groups are {1, 2, 3} and {10, 11, 12}; their means are (1 + 2 + 3) / 3 = 2 and (10 + 11 + 12) / 3 = 11. Option 4 is the mean of everything, which is what you would get with k = 1."},
  {"q": "A friend picks the number of clusters by choosing the k with the lowest inertia. What is wrong?", "options": ["Nothing, lowest inertia is always best", "Inertia always falls as k grows, so it would pick the largest k", "Inertia cannot be computed for k-means", "Inertia is only for DBSCAN"], "answer": 1, "why": "With k equal to the number of points, every point is its own centroid and inertia is 0. The useful signal is the elbow, where adding clusters stops helping much, or the best silhouette."},
  {"q": "A point has a = 4 (average distance to its own cluster) and b = 12 (to the nearest other cluster). What is its silhouette score?", "options": ["0.33", "0.67", "-0.67", "3"], "answer": 1, "why": "s = (b - a) / max(a, b) = (12 - 4) / 12 = 0.67, so it is well placed. 0.33 is a / b, a tempting mix-up; a negative value would need a > b."},
  {"q": "You have crescent-shaped groups plus a few stray points. Which method fits best?", "options": ["k-means", "DBSCAN", "PCA", "Linear regression"], "answer": 1, "why": "DBSCAN follows dense regions of any shape and labels strays as noise (-1). k-means assumes round blobs and forces every point into a cluster. PCA is not a clustering method."},
  {"q": "In a correlated 2-feature dataset PCA gives eigenvalues 1.8 and 0.2. How much variance does the first component explain?", "options": ["18%", "50%", "90%", "180%"], "answer": 2, "why": "Total variance = 1.8 + 0.2 = 2.0, and 1.8 / 2.0 = 0.90. 180% is impossible for a share; 50% would mean the two components are equally useful."},
  {"q": "Out of 500 bills, 100 contain milk powder, 150 contain tea and 60 contain both. What is the lift of {milk powder} -> {tea}?", "options": ["0.60", "0.12", "2.0", "0.30"], "answer": 2, "why": "Confidence = 60 / 100 = 0.60, P(tea) = 150 / 500 = 0.30, lift = 0.60 / 0.30 = 2.0. 0.60 is only the confidence, which is inflated by how common tea is."},
  {"q": "Why must a forecasting model be validated with a time-ordered split instead of a random split?", "options": ["Random splits are slower", "A random split lets the model train on the future and then 'predict' the past", "Time-ordered splits use more data", "Random splits cannot be used with trees"], "answer": 1, "why": "Random shuffling puts later observations in training, leaking future information and giving unrealistically good scores. Walk-forward validation always trains on the past and tests on the later period."},
  {"q": "The average predicted churn is 0.20 and a customer's SHAP values are +0.25, +0.18, +0.07 and -0.05. What is this customer's prediction?", "options": ["0.45", "0.65", "0.25", "1.05"], "answer": 1, "why": "SHAP values add up from the average: 0.20 + 0.25 + 0.18 + 0.07 - 0.05 = 0.65. Forgetting the base value gives 0.45, which is a common slip."}
]
```

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

**Q10.** A point has a = 3 and b = 9. What is its silhouette score and what does it say?
<details><summary>Answer</summary>s = (9 − 3) ÷ 9 = **0.67**. It is much closer to its own cluster than to the next one, so it is well clustered.</details>

**Q11.** Weekly sales are 20 then 30. Using simple exponential smoothing with α = 0.5 and starting level 20, what is the forecast?
<details><summary>Answer</summary>level = 0.5 × 30 + 0.5 × 20 = 15 + 10 = **25**.</details>

**Q12.** In a loan model the base approval probability is 0.60 and the SHAP values for one applicant are −0.30, −0.10, +0.08, +0.02. Is the loan approved at a 0.5 cut-off?
<details><summary>Answer</summary>0.60 − 0.30 − 0.10 + 0.08 + 0.02 = 0.30, which is below 0.5, so it is declined.</details>

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
| Distance, Euclidean distance | Straight-line gap between two points, used to judge similarity |
| Dendrogram height | Distance at which two clusters were merged |
| Core / border / noise (worked) | DBSCAN roles: dense centre, edge of a cluster, stray point |
| Marginal contribution | How much a feature adds when it joins a set; averaged to get a Shapley value |
| Vector quantisation | Replacing many values with a few cluster centres (e.g. image colours) |

**🎉 You've finished Part C: Machine Learning!**

**Mini project for Part C:** use the **Telco Customer Churn** dataset (Kaggle). Build: a baseline → logistic regression pipeline → random forest → LightGBM/XGBoost with early stopping. Tune with Optuna, choose a threshold using business costs, report PR-AUC and recall/precision on the test set, and explain the model with SHAP. Bonus: cluster customers with k-means and profile the segments. Write it up as a README for a manager.

**Next:** [15-neural-networks.md](15-neural-networks.md)
