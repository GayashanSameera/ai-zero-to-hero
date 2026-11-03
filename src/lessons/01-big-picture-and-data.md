# 01: The Big Picture and What Data Is

> **Before you start:** Nothing. This is the very first file.
>
> **After this file you can:** explain what AI, Machine Learning, Deep Learning, LLMs, Generative AI and Data Science are, how they fit together, what "data" is, and the common shapes and file formats data comes in.

---

## Table of contents

1. [What is a computer program?](#1-what-is-a-computer-program)
2. [What is an algorithm?](#2-what-is-an-algorithm)
3. [Traditional programming vs Machine Learning](#3-traditional-programming-vs-machine-learning)
4. [The family tree: AI, ML, DL, GenAI, LLMs](#4-the-family-tree-ai-ml-dl-genai-llms)
5. [What is Data Science?](#5-what-is-data-science)
6. [What is a model?](#6-what-is-a-model)
7. [What is data?](#7-what-is-data)
8. [Kinds of data: structured, unstructured, semi-structured](#8-kinds-of-data)
9. [Data types: numbers, categories, text, dates](#9-data-types)
10. [Tables: rows, columns, features, labels](#10-tables-rows-columns-features-labels)
11. [How computers store data: bits and bytes](#11-how-computers-store-data-bits-and-bytes)
12. [Common file formats: CSV, JSON, Excel, Parquet, images, audio](#12-common-file-formats)
13. [Where AI is used today](#13-where-ai-is-used-today)
14. [Jobs in this field](#14-jobs-in-this-field)
15. [Check yourself](#15-check-yourself)
16. [New words in this file](#16-new-words-in-this-file)

---

## 1. What is a computer program?

**Idea:** A **program** is a list of exact instructions that a computer follows, step by step.

**Analogy:** A recipe. "Boil 2 cups of water. Add 1 cup of rice. Cook for 15 minutes." The cook (computer) follows each step exactly, in order. If the recipe says "add salt" but never says how much, a human cook guesses. A computer can't guess. It needs every detail spelled out.

**Example:** A program that decides if a number is even:

```
1. Take a number, call it N.
2. Divide N by 2.
3. If the remainder is 0, say "even".
4. Otherwise, say "odd".
```

The language we write programs in is called a **programming language**. In this course we use **Python** (taught in [file 02](02-python-programming.md)), because it is the most popular language for data and AI.

---

## 2. What is an algorithm?

**Idea:** An **algorithm** is a step-by-step method for solving a problem. A program is an algorithm written in a programming language.

**Analogy:** "How to find a word in a dictionary" is an algorithm: open the book near the middle; if your word comes earlier alphabetically, look in the left half, otherwise the right half; repeat. That's a clever method (it's called *binary search*) that finds any word among 100,000 in about 17 steps.

You'll hear "algorithm" everywhere in AI: "the Random Forest algorithm", "the gradient descent algorithm". It always just means *a well-defined recipe for doing something*.

---

## 3. Traditional programming vs Machine Learning

This is **the most important idea in this file.**

### Traditional programming

A human writes the rules. The computer applies them.

```
   Rules (written by human) ─┐
                             ├──► Computer ──► Answers
   Data ─────────────────────┘
```

**Example: spam filter, the old way.** A programmer writes rules:
- If the email contains "FREE MONEY" → spam
- If the email contains "click here to win" → spam
- If the sender is in your contacts → not spam

Problem: spammers change their wording ("FR33 M0NEY"), and you'd need thousands of rules. Humans can't keep up.

### Machine Learning

A human gives **examples with answers**. The computer **figures out the rules itself**.

```
   Data ─────────────────────┐
                             ├──► Computer (learning) ──► Rules (a "model")
   Answers (examples) ───────┘
```

**Example: spam filter, the ML way.** You show the computer 100,000 emails, each labeled "spam" or "not spam". The computer finds patterns on its own: certain words, sender patterns, link counts, time of day. Then, when a new email arrives, it uses those learned patterns to decide.

**Analogy:** Teaching a child what a "dog" is. You don't give the child a rulebook ("four legs, fur, tail, barks..."). A cat also has four legs, fur and a tail! Instead, you point at many dogs and say "dog", and at cats and say "not a dog". The child's brain works out the pattern. Machine Learning works the same way.

**When should you use ML instead of normal programming?**

| Use normal programming when... | Use ML when... |
|---|---|
| The rules are clear and few (e.g. calculate tax) | The rules are too complex to write down (e.g. recognise a face) |
| You need 100% exact, explainable answers | Approximately right is good enough and you have lots of examples |
| You have no data | You have lots of data with answers |
| The rules never change | Patterns change over time (spam, fraud) |

---

## 4. The family tree: AI, ML, DL, GenAI, LLMs

These words are often mixed up. Here's how they relate. Each circle sits inside the bigger one:

```
┌───────────────────────────────────────────────────────────────┐
│ ARTIFICIAL INTELLIGENCE (AI)                                    │
│ Any technique that makes computers do "smart" things           │
│   ┌──────────────────────────────────────────────────────┐     │
│   │ MACHINE LEARNING (ML)                                 │     │
│   │ Computers learn patterns from data                    │     │
│   │   ┌─────────────────────────────────────────────┐     │     │
│   │   │ DEEP LEARNING (DL)                           │     │     │
│   │   │ ML using big "neural networks"               │     │     │
│   │   │   ┌────────────────────────────────────┐     │     │     │
│   │   │   │ GENERATIVE AI (GenAI)               │     │     │     │
│   │   │   │ DL models that CREATE new content   │     │     │     │
│   │   │   │   ┌─────────────────────────┐       │     │     │     │
│   │   │   │   │ LLMs                    │       │     │     │     │
│   │   │   │   │ GenAI for TEXT          │       │     │     │     │
│   │   │   │   └─────────────────────────┘       │     │     │     │
│   │   │   └────────────────────────────────────┘     │     │     │
│   │   └─────────────────────────────────────────────┘     │     │
│   └──────────────────────────────────────────────────────┘     │
└───────────────────────────────────────────────────────────────┘
```

### Artificial Intelligence (AI)

**Idea:** The broad goal of making machines do tasks that normally need human intelligence: understanding language, recognising images, making decisions, playing games.

AI includes things that *don't* learn at all. A chess program from 1997 that searches through millions of moves using hand-written rules is AI, but not ML.

### Machine Learning (ML)

**Idea:** A part of AI where the computer **learns from examples** instead of being given rules (section 3).

**Examples:** predicting house prices from size and location; deciding whether a bank transaction is fraud; recommending movies on Netflix.

Taught in **Part C** (files 11 to 14).

### Deep Learning (DL)

**Idea:** A part of ML that uses **neural networks**: programs loosely inspired by how brain cells (neurons) connect. "Deep" means the network has many layers stacked on top of each other.

Quick preview: a neural network is like a huge team of tiny calculators arranged in layers. Each calculator takes some numbers in, does a simple calculation, and passes a number on. With millions of these, the network can learn very complicated patterns, such as recognising faces in photos. (Full explanation in [file 15](15-neural-networks.md).)

**Why it matters:** Deep learning is what made modern AI possible: image recognition, speech recognition, translation, self-driving perception, and LLMs.

Taught in **Part D** (files 15 to 17).

### Generative AI (GenAI)

**Idea:** AI that **creates new content** (text, images, music, video, code) instead of just making a decision about existing content.

| "Traditional" AI (discriminative) | Generative AI |
|---|---|
| "Is this email spam?" → yes/no | "Write an email to my boss" → a new email |
| "Is there a cat in this photo?" → yes/no | "Draw a cat wearing a hat" → a new image |
| "What's this song's genre?" → jazz | "Compose a jazz song" → a new song |

**Examples:** ChatGPT, Claude, Gemini (text); Midjourney, DALL·E, Stable Diffusion (images); Suno (music); Sora, Veo (video); GitHub Copilot (code).

Taught in **Part F** (files 22 to 25).

### Large Language Models (LLMs)

**Idea:** A type of generative AI trained on huge amounts of text, so it can read and write language. "Large" means it has billions of internal numbers (called *parameters*, explained in [file 11](11-ml-fundamentals.md)) and was trained on trillions of words.

**How it works, in one sentence:** an LLM is a super-powerful "predict the next word" machine. Given "The capital of France is", it predicts "Paris". By predicting one word after another, it writes whole essays. (Full explanation in [file 20](20-how-llms-work.md).)

**Examples:** GPT (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta), Mistral, Qwen, DeepSeek.

Taught in **Part E** (files 18 to 21).

### Where does "NLP" fit?

**Natural Language Processing (NLP)** = the part of AI that deals with human language (text and speech). Old NLP used rules and simple statistics; modern NLP uses deep learning and LLMs. Taught in [file 18](18-nlp-fundamentals.md).

### Where does "Computer Vision" fit?

**Computer Vision (CV)** = the part of AI that deals with images and video (recognising objects, faces, reading text from photos). Taught in [file 16](16-cnns-and-computer-vision.md).

---

## 5. What is Data Science?

**Idea:** **Data Science** is using data to answer questions and make better decisions. It combines:

```
       Statistics & Maths
              ▲
              │
   Data  ◄────┼────►  Programming
  Science     │
              ▼
     Domain knowledge (the business/field)
```

Data Science overlaps with ML but is not the same:

- A **data scientist** might never train an ML model. They might just analyse sales data and find that "customers who buy on weekends spend 30% more", then make a chart for the manager.
- They also often **do** use ML, for example to predict which customers will leave.

**Typical data science questions:**
- "Why did sales drop last month?" (analysis)
- "Which products are often bought together?" (pattern finding)
- "How many customers will we have next year?" (prediction)
- "Did the new website design increase sign-ups?" (experiment / A/B test, explained in [file 07](07-math-probability-statistics.md))

**The data science workflow** (taught in detail in [file 10](10-data-science-workflow.md)):

```
1. Ask a question  →  2. Collect data  →  3. Clean data  →  4. Explore (EDA)
        →  5. Model / analyse  →  6. Communicate results  →  7. Act / deploy
```

---

## 6. What is a model?

You'll see the word **model** in every file of this course.

**Idea:** A **model** is a simplified representation of reality that lets you make predictions.

**Analogy:** A weather rule of thumb: "dark clouds + falling air pressure → rain is likely". That's a model of the weather. It's not perfect, but it's useful.

In ML, a model is a **mathematical function learned from data**: you put inputs in, it gives an output.

```
Input: house size = 120 m², bedrooms = 3, location = city
        │
        ▼
   ┌─────────┐
   │  MODEL  │   (learned from 10,000 past house sales)
   └─────────┘
        │
        ▼
Output: predicted price = $250,000
```

Two key steps:
- **Training**: the model learns from examples (data with known answers).
- **Inference** (or **prediction**): we use the trained model on new data to get answers.

**Analogy:** Training = a student studying past exam papers. Inference = the student sitting the real exam with new questions.

> "All models are wrong, but some are useful." (George Box, statistician)

---

## 7. What is data?

**Idea:** **Data** is recorded information: facts, measurements, observations. Anything that can be written down or stored.

**Examples of data:**
- Your age: `25`
- The temperature right now: `31.5 °C`
- A product review: `"Great phone, battery lasts all day!"`
- A photo from your phone (millions of colour values)
- A voice message (sound wave measurements)
- The list of every purchase at a supermarket today

One piece of data is called a **data point** or **observation** or **record** or **sample** (all mean roughly the same). A collection of data points is a **dataset**.

**Why data matters for AI:** ML models learn *only* from data. The quality of your model can never be better than the quality of your data.

> **"Garbage in, garbage out."** If you train a model on wrong or biased data, it will give wrong or biased answers.

---

## 8. Kinds of data

### Structured data

**Idea:** Data neatly organised into a **table** with rows and columns, like a spreadsheet. Every row has the same columns.

| customer_id | name | age | city | total_spent |
|---|---|---|---|---|
| 1 | Amal | 34 | Colombo | 1250.00 |
| 2 | Nisha | 28 | Kandy | 430.50 |
| 3 | John | 45 | Galle | 2100.00 |

Stored in: spreadsheets, CSV files, databases. Easy to search and analyse.

### Unstructured data

**Idea:** Data with no fixed table format.

**Examples:** emails, books, social media posts, photos, videos, audio recordings, PDFs.

About 80% of the world's data is unstructured. Deep learning (Part D) and LLMs (Part E) are especially good at handling it.

### Semi-structured data

**Idea:** In between: has *some* organisation (labels/tags), but not a strict table.

**Example:** JSON (explained in section 12):
```json
{
  "name": "Amal",
  "age": 34,
  "hobbies": ["cricket", "reading"],
  "address": {"city": "Colombo", "zip": "00100"}
}
```
Each person might have a different number of hobbies, or extra fields. That flexibility is why it's "semi" structured.

---

## 9. Data types

Each column (or value) has a **type**. Knowing the type tells you what you can do with it.

### Numerical (quantitative) data: numbers you can do maths on

- **Continuous:** can take any value in a range, including decimals.
  Examples: height `172.4 cm`, temperature `31.5 °C`, price `$19.99`.
- **Discrete:** countable whole numbers.
  Examples: number of children `2`, number of items in a cart `5`.

Test: does "average" make sense? Average height = 168.2 cm ✅. So it's numerical.

### Categorical (qualitative) data: labels or groups

- **Nominal:** categories with **no order**.
  Examples: colour (red, blue, green), city (Colombo, Kandy, Galle), blood type (A, B, AB, O).
- **Ordinal:** categories **with a natural order**, but the gaps between them aren't measurable.
  Examples: T-shirt size (S < M < L < XL), rating (bad < okay < good < excellent), education level.

Trap: zip codes and phone numbers are *digits* but they are **categorical**. The "average zip code" is meaningless.

- **Binary:** a special categorical type with exactly two values: yes/no, true/false, spam/not spam, 1/0.

### Text data

Free-form words: reviews, tweets, documents. Needs special processing (file 18).

### Date and time data

Examples: `2026-11-03`, `14:35:00`. Useful for finding patterns over time (e.g. sales are higher on Fridays). Data recorded over time in order is called **time series** data (file 10).

### Why types matter: a preview

ML models only understand **numbers**. So we must convert:
- categories → numbers (called *encoding*, [file 10](10-data-science-workflow.md))
- text → numbers (called *embeddings*, [file 18](18-nlp-fundamentals.md))
- images → numbers (pixels, [file 16](16-cnns-and-computer-vision.md))

**Everything in AI eventually becomes numbers.** Remember this.

---

## 10. Tables: rows, columns, features, labels

This vocabulary is used in every ML file, so let's lock it in now.

Imagine a dataset to predict whether a student passes an exam:

| hours_studied | hours_slept | attended_classes | passed |
|---|---|---|---|
| 10 | 7 | 90% | yes |
| 2 | 5 | 40% | no |
| 6 | 8 | 75% | yes |
| 1 | 9 | 30% | no |

- **Row** = one example (one student). Also called a *sample*, *observation*, *record*, *instance*, or *data point*.
- **Column** = one property measured for every example. Also called a *variable* or *attribute*.
- **Features** = the input columns the model uses to make predictions: `hours_studied`, `hours_slept`, `attended_classes`. Also called *inputs*, *predictors*, *independent variables*, and often written as **X**.
- **Label** = the answer column we want to predict: `passed`. Also called *target*, *output*, *dependent variable*, *ground truth*, and often written as **y**.
- **Labeled data** = data that includes the answer column. **Unlabeled data** = no answer column.

```
              Features (X)                  Label (y)
   ┌──────────────────────────────────┐   ┌────────┐
   │ hours_studied  hours_slept  ...   │   │ passed │
   └──────────────────────────────────┘   └────────┘
```

The model learns: "given X, predict y".

**Shape of a dataset:** we describe a table by `(rows, columns)`. The table above has shape `(4, 4)`: 4 rows, 4 columns. With 3 features and 1 label, X has shape `(4, 3)` and y has shape `(4,)`.

---

## 11. How computers store data: bits and bytes

You don't need deep details, but these terms come up a lot, especially when we talk about model sizes and memory (files 21, 27).

### Bits

**Idea:** A **bit** is the smallest piece of data: a single 0 or 1 (off/on, like a light switch).

With more bits, you can represent more values:
- 1 bit → 2 values (0, 1)
- 2 bits → 4 values (00, 01, 10, 11)
- 3 bits → 8 values
- 8 bits → 256 values
- *n* bits → 2 × 2 × ... × 2 (*n* times) = 2ⁿ values

### Bytes

**Idea:** A **byte** = 8 bits. It can store 256 different values, enough for one English letter.

| Unit | Size | Rough example |
|---|---|---|
| Byte (B) | 8 bits | one letter |
| Kilobyte (KB) | ~1,000 bytes | a short text message |
| Megabyte (MB) | ~1,000 KB | a photo (2 to 5 MB) |
| Gigabyte (GB) | ~1,000 MB | a movie; a small LLM |
| Terabyte (TB) | ~1,000 GB | a big hard disk |
| Petabyte (PB) | ~1,000 TB | the text used to train big LLMs is in this range |

(Technically 1 KB = 1,024 bytes in some contexts, but ~1,000 is fine for intuition.)

### How numbers are stored (preview for later)

Computers store decimal numbers (like 3.14159) in formats called **floating point**. The common ones in AI:

| Format | Bits | Bytes | Used for |
|---|---|---|---|
| FP32 ("float32", "single precision") | 32 | 4 | classic default |
| FP16 / BF16 ("half precision") | 16 | 2 | modern training & inference |
| INT8 | 8 | 1 | compressed models |
| INT4 | 4 | 0.5 | heavily compressed models |

**Why you care:** a model with 7 billion numbers stored in FP16 takes 7 billion × 2 bytes = 14 GB of memory. Stored in INT4, it's 7 billion × 0.5 bytes = 3.5 GB, small enough for a laptop. This idea (called *quantization*) is covered in [file 21](21-training-finetuning-alignment.md) and [file 27](27-inference-and-serving.md).

### How text is stored

Each character is given a number. The standard is **Unicode** (with the common encoding **UTF-8**). For example, `A` = 65, `a` = 97. Unicode covers every language, including Sinhala, Tamil, Chinese and emoji. English letters take 1 byte in UTF-8; many other scripts (such as Sinhala) take 3 bytes per character.

### How images are stored

An image is a grid of tiny dots called **pixels**. Each pixel's colour is stored as three numbers: **Red, Green, Blue (RGB)**, each from 0 to 255.

```
A 3×3 pixel image (each cell = one pixel's [R, G, B]):
[255,0,0]   [255,0,0]   [0,0,255]
[255,0,0]   [255,255,255] [0,0,255]
[0,255,0]   [0,255,0]   [0,0,255]
  red=left, white=center, green=bottom, blue=right
```

A 1920×1080 photo has 1920 × 1080 × 3 ≈ 6.2 million numbers. That's why images need lots of computing power.

### How sound is stored

Sound is a wave. The computer measures the wave's height thousands of times per second (the **sample rate**, e.g. 16,000 or 44,100 times per second). So 1 second of audio = 16,000 to 44,100 numbers.

---

## 12. Common file formats

### CSV (Comma-Separated Values)

The most common format for tables. A plain text file where each line is a row and commas separate the columns.

```csv
customer_id,name,age,city
1,Amal,34,Colombo
2,Nisha,28,Kandy
3,John,45,Galle
```

✅ Simple, opens in Excel or any text editor, works everywhere.
❌ No data types stored (is "34" text or a number?), slow and large for huge data.

### TSV

Same as CSV but separated by tabs instead of commas.

### Excel (.xlsx)

Spreadsheets with multiple sheets, formatting, formulas. Common in business. Python can read them (file 08).

### JSON (JavaScript Object Notation)

A text format for semi-structured data. Built from two things:
- **Objects**: `{ "key": value, ... }`, a set of named fields (like a labeled box)
- **Arrays**: `[value1, value2, ...]`, an ordered list

```json
{
  "order_id": 1001,
  "customer": "Amal",
  "paid": true,
  "items": [
    {"product": "pen", "qty": 3, "price": 0.5},
    {"product": "notebook", "qty": 1, "price": 2.0}
  ]
}
```

Values can be: strings in double quotes (`"Amal"`), numbers (`1001`, `0.5`), `true`/`false`, `null` (nothing), objects, or arrays.

✅ Used by almost every web API (file 03) and by LLMs for structured output (file 22).

**JSONL / JSON Lines:** one JSON object per line. Very common for ML training datasets:
```
{"prompt": "What is 2+2?", "answer": "4"}
{"prompt": "Capital of Japan?", "answer": "Tokyo"}
```

### Parquet

A **columnar** binary format for big tables. Instead of storing row by row, it stores column by column, which compresses well and is fast to read when you only need some columns.

✅ Much smaller and faster than CSV for big data. Standard in data engineering.
❌ Not human-readable in a text editor.

### Databases

Data stored in a database system (like PostgreSQL, MySQL, SQLite) and accessed using **SQL** (taught in [file 03](03-developer-tools.md)).

### Images, audio, video

- Images: `.jpg`/`.jpeg` (compressed, small, slight quality loss), `.png` (lossless, supports transparency)
- Audio: `.wav` (raw, big), `.mp3` (compressed)
- Video: `.mp4`

### Model files (preview)

Trained models are also saved as files: `.pkl`/`.joblib` (scikit-learn), `.pt`/`.pth` (PyTorch), `.safetensors` (safe format for neural network weights), `.onnx` (portable), `.gguf` (for running LLMs locally). Covered in files 27 and 28.

---

## 13. Where AI is used today

| Field | Examples |
|---|---|
| Everyday apps | Face unlock, voice assistants, photo search ("show me beach photos"), autocomplete, translation |
| Shopping | Product recommendations, dynamic pricing, demand forecasting |
| Banking | Fraud detection, credit scoring, chatbots |
| Healthcare | Reading X-rays and scans, drug discovery, predicting patient risk |
| Transport | Route planning, ride-hailing pricing, self-driving perception |
| Agriculture | Detecting crop disease from leaf photos, yield prediction |
| Telecom | Predicting which customers will leave ("churn"), network fault detection |
| Software | Code assistants, automated testing, AI agents |
| Media | Content recommendation, image/video generation, dubbing |

---

## 14. Jobs in this field

| Role | What they do day to day | Key files |
|---|---|---|
| **Data Analyst** | SQL queries, dashboards, reports, answering business questions | 01 to 10 |
| **Data Scientist** | Analysis + statistics + ML models + experiments | 01 to 14 |
| **Data Engineer** | Builds pipelines that move and clean data at scale | 02, 03, 08, 10, 28 |
| **ML Engineer** | Trains, deploys, and maintains ML models in production | 01 to 17, 27, 28 |
| **AI Engineer / LLM Engineer** | Builds apps on top of LLMs: RAG, agents, prompts, evaluation | 01 to 05, 11, 15, 18 to 29 |
| **MLOps Engineer** | Infrastructure for training, deployment, monitoring | 03, 27, 28 |
| **Research Scientist** | Invents new models and methods, writes papers | everything, especially 15 to 21, 30 |
| **AI Product Manager** | Decides what AI features to build and measures their success | 01, 11, 13, 22, 26, 29 |

---

## 15. Check yourself

Try each one before revealing the answer.

**Q1.** What is the main difference between traditional programming and machine learning?

<details><summary>Answer</summary>

In traditional programming, a human writes the rules and the computer applies them to data. In machine learning, the human provides data **with answers** (examples), and the computer **learns the rules** (a model) by itself.
</details>

**Q2.** Put these in order from biggest to smallest: Deep Learning, AI, LLMs, Machine Learning, Generative AI.

<details><summary>Answer</summary>

AI ⊃ Machine Learning ⊃ Deep Learning ⊃ Generative AI ⊃ LLMs.
</details>

**Q3.** Classify each as numerical-continuous, numerical-discrete, nominal, ordinal, or binary: (a) weight in kg, (b) eye colour, (c) number of siblings, (d) movie rating "1 star to 5 stars", (e) "is_smoker", (f) postcode.

<details><summary>Answer</summary>

(a) continuous, (b) nominal, (c) discrete, (d) ordinal, (e) binary, (f) nominal (digits, but categorical: averaging postcodes is meaningless).
</details>

**Q4.** In a dataset to predict house prices with columns `size_m2`, `bedrooms`, `city`, `price`, which are the features and which is the label?

<details><summary>Answer</summary>

Features (X): `size_m2`, `bedrooms`, `city`. Label (y): `price`.
</details>

**Q5.** A model has 8 billion numbers. How much memory does it need in FP16? In INT4?

<details><summary>Answer</summary>

FP16 = 2 bytes per number → 8 billion × 2 = 16 billion bytes ≈ **16 GB**.
INT4 = 0.5 bytes per number → 8 billion × 0.5 = **4 GB**.
</details>

**Q6.** Is ChatGPT "discriminative" or "generative" AI? Is a spam filter?

<details><summary>Answer</summary>

ChatGPT is generative (creates new text). A spam filter is discriminative (decides between categories for existing content).
</details>

**Q7.** What's the difference between "training" and "inference"?

<details><summary>Answer</summary>

Training = the model learns patterns from example data. Inference = using the already-trained model to make predictions on new data.
</details>

---

## 16. New words in this file

| Word | Meaning |
|---|---|
| Program | Exact step-by-step instructions for a computer |
| Programming language | A language for writing programs (we use Python) |
| Algorithm | A well-defined step-by-step method to solve a problem |
| Artificial Intelligence (AI) | Making computers do tasks that need human-like intelligence |
| Machine Learning (ML) | Computers learning patterns (rules) from example data |
| Deep Learning (DL) | ML using many-layered neural networks |
| Neural network | A model made of many simple connected calculators in layers (details in file 15) |
| Generative AI | AI that creates new content |
| Discriminative model | A model that decides between categories/values for given input |
| Large Language Model (LLM) | Huge generative model trained on text; predicts the next word |
| NLP | Natural Language Processing: AI for human language |
| Computer Vision | AI for images and video |
| Data Science | Using data, stats, and programming to answer questions and make decisions |
| Model | A learned function that maps inputs to outputs |
| Training | The learning phase of a model |
| Inference / prediction | Using a trained model on new data |
| Data / dataset / data point | Recorded information / a collection of it / one record |
| Structured / unstructured / semi-structured data | Table data / free-form data (text, images) / tagged but flexible data (JSON) |
| Numerical (continuous, discrete) | Numbers you can do maths on (any value / whole counts) |
| Categorical (nominal, ordinal, binary) | Labels (no order / with order / two values) |
| Time series | Data recorded in time order |
| Row / sample / observation | One example in a table |
| Column / variable / attribute | One measured property |
| Feature (X) | An input column used to predict |
| Label / target (y) | The answer column to predict |
| Labeled / unlabeled data | Data with / without the answer column |
| Shape | (rows, columns) size of a table |
| Bit / byte | One 0-or-1 / 8 bits |
| Floating point (FP32, FP16, BF16) | Ways to store decimal numbers using 32 or 16 bits |
| INT8 / INT4 | Storing numbers as 8-bit / 4-bit integers (smaller, less precise) |
| Unicode / UTF-8 | Standard numbering of every character in every language |
| Pixel / RGB | One dot in an image / its Red, Green, Blue values (0 to 255) |
| Sample rate | How many times per second sound is measured |
| CSV, TSV, Excel, JSON, JSONL, Parquet | Common data file formats |
| "Garbage in, garbage out" | Bad data → bad model |

**Next:** [02-python-programming.md](02-python-programming.md)
