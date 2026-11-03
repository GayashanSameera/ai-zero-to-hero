# 18: Natural Language Processing (NLP) Fundamentals

> **Before you start:** [05](05-math-linear-algebra.md) (vectors, cosine similarity, sparse/dense, matrices), [07](07-math-probability-statistics.md) (probability, conditional probability, log), [08](08-numpy-and-pandas.md#20-text-and-date-columns) (regex, `.str`), [11](11-ml-fundamentals.md) (classification, self-supervised learning), [12](12-supervised-learning-algorithms.md) (logistic regression, Naive Bayes), [15](15-neural-networks.md#16-embedding-layers) (embedding layers), [17](17-sequence-models-and-attention.md) (RNNs, seq2seq, attention).
>
> **After this file you can:** clean and tokenise text; represent text as numbers with Bag-of-Words, n-grams, TF-IDF and word embeddings (Word2Vec, GloVe, FastText); explain the core NLP tasks (classification, NER, POS tagging, summarisation, translation, QA); and use NLTK, spaCy and Hugging Face.

This file starts **Part E: NLP and LLMs**.

---

## Table of contents

1. [What is NLP and why is it hard?](#1-what-is-nlp)
2. [The classic NLP pipeline](#2-the-classic-nlp-pipeline)
3. [Text cleaning and normalisation](#3-text-cleaning-and-normalisation)
4. [Tokenisation](#4-tokenisation)
5. [Stopwords, stemming, lemmatisation](#5-stopwords-stemming-lemmatisation)
6. [Bag of Words](#6-bag-of-words)
7. [N-grams](#7-n-grams)
8. [TF-IDF](#8-tf-idf)
9. [A classic text classifier](#9-a-classic-text-classifier)
10. [Sparse vs dense representations](#10-sparse-vs-dense-representations)
11. [Word embeddings: meaning as vectors](#11-word-embeddings)
12. [Word2Vec, GloVe, FastText](#12-word2vec-glove-fasttext)
13. [Limits of static embeddings → contextual embeddings](#13-contextual-embeddings)
14. [Core NLP tasks](#14-core-nlp-tasks)
15. [Language models (the classic idea)](#15-language-models)
16. [NLP libraries: NLTK, spaCy, Hugging Face](#16-nlp-libraries)
17. [NLP for low-resource languages (e.g. Sinhala)](#17-low-resource-languages)
18. [Check yourself](#18-check-yourself)
19. [New words in this file](#19-new-words-in-this-file)

---

## 1. What is NLP?

**Natural Language Processing (NLP)** = making computers understand, process and generate human language ([file 01](01-big-picture-and-data.md#where-does-nlp-fit)).

**Everyday examples:** spam filters, autocomplete, Google Translate, voice assistants, chatbots, search engines, grammar checkers, sentiment analysis of reviews.

### Why language is hard for computers

| Challenge | Example |
|---|---|
| **Ambiguity (word sense)** | "bank" = river bank or money bank? |
| **Structural ambiguity** | "I saw the man with the telescope." Who has the telescope? |
| **Context** | "It's cold" might be a request to close the window |
| **Coreference** | "Nisha told Priya **she** won." Who won? |
| **Sarcasm/irony** | "Oh great, another Monday." |
| **Variation** | slang, typos, emoji, code-mixing ("mama office ekata yanawa" = Sinhala + English) |
| **Morphology** | One root can have many forms (run, runs, ran, running); some languages have hundreds of forms per word |
| **World knowledge** | "The trophy didn't fit in the suitcase because **it** was too big." (it = trophy) |

---

## 2. The classic NLP pipeline

```
Raw text → Clean/normalise → Tokenise → (remove stopwords, lemmatise) → Represent as numbers → Model → Output
"Loved it!!"  "loved it"     ["loved","it"]   ["love"]                  [0, 1, 0, ...]   classifier  positive
```

The modern LLM pipeline is simpler: raw text → **subword tokeniser** → transformer (files 19, 20). But the classic ideas are still used everywhere (search, quick baselines, data cleaning) and appear in interviews.

---

## 3. Text cleaning and normalisation

```python
import re

def clean(text):
    text = text.lower()                                  # lowercase
    text = re.sub(r"https?://\S+", " ", text)            # remove URLs
    text = re.sub(r"<.*?>", " ", text)                   # remove HTML tags
    text = re.sub(r"[^a-z0-9\s']", " ", text)            # keep letters, digits, spaces, apostrophes
    text = re.sub(r"\s+", " ", text).strip()             # collapse extra spaces
    return text

clean("LOVED it!!! See https://x.com <b>5/5</b>")   # "loved it see 5 5"
```

(Regular expressions were introduced in [file 08](08-numpy-and-pandas.md#20-text-and-date-columns).)

**Common steps:**
- Lowercasing (but "US" vs "us" can matter)
- Removing URLs, HTML, emails, extra whitespace
- Handling punctuation and numbers
- Expanding contractions ("don't" → "do not")
- Fixing Unicode issues; **Unicode normalisation** (making visually identical characters use the same code, important for Sinhala/Tamil, [file 01](01-big-picture-and-data.md#how-text-is-stored))
- Handling emoji (remove, or convert to words: 😀 → "happy")

⚠️ **Don't over-clean.** For sentiment, "!!!" and emoji carry meaning. For modern transformer models, do **minimal** cleaning; they handle raw text well.

---

## 4. Tokenisation

**Tokenisation** = splitting text into units called **tokens**.

| Level | "Unbelievable stories!" → | Pros | Cons |
|---|---|---|---|
| **Word** | ["Unbelievable", "stories", "!"] | Intuitive | Huge vocabulary; **out-of-vocabulary (OOV)** words like new slang can't be handled |
| **Character** | ["U","n","b","e",...] | Tiny vocabulary; no OOV | Very long sequences; each unit carries little meaning |
| **Subword** | ["Un", "believ", "able", " stories", "!"] | Best of both: common words whole, rare words in pieces | Needs a learned tokeniser |

**Subword tokenisation** (BPE, WordPiece, SentencePiece) is what all modern LLMs use. It's covered in detail in [file 20](20-how-llms-work.md). The key idea: frequent words become single tokens; rare words are built from common pieces, so the model can handle *any* word.

**Vocabulary:** the set of all tokens a model knows. Each token gets an integer **token ID**, which is then looked up in an embedding layer ([file 15](15-neural-networks.md#16-embedding-layers)).

**Sentence segmentation:** splitting text into sentences (harder than splitting on "." because of "Dr.", "3.14", "U.S.A.").

```python
import nltk
nltk.download("punkt")
from nltk.tokenize import word_tokenize, sent_tokenize
word_tokenize("Don't stop believing!")   # ['Do', "n't", 'stop', 'believing', '!']
```

---

## 5. Stopwords, stemming, lemmatisation

### Stopwords

Very common words with little meaning on their own: "the", "a", "is", "and", "of". Removing them shrinks data for classic methods like BoW/TF-IDF.

⚠️ Be careful: "not" is often a stopword, but "**not** good" vs "good" is crucial for sentiment! Never remove stopwords for transformer models.

### Stemming

Chop words down to a crude root using rules: "running" → "run", "studies" → "studi", "happiness" → "happi". Fast but often produces non-words. Algorithms: **Porter**, **Snowball**.

### Lemmatisation

Reduce words to their **dictionary form** (**lemma**) using vocabulary and grammar: "running" → "run", "better" → "good", "studies" → "study", "was" → "be". Slower but more accurate. Usually needs the **part of speech** (is "meeting" a noun or a verb?).

```python
from nltk.stem import PorterStemmer, WordNetLemmatizer
PorterStemmer().stem("studies")                 # 'studi'
WordNetLemmatizer().lemmatize("studies")        # 'study'
WordNetLemmatizer().lemmatize("better", pos="a")  # 'good'
```

**Why bother?** For classic models, "run", "runs" and "running" become one feature, which reduces vocabulary size and data sparsity. Modern subword tokenisers + transformers learn these relationships themselves.

---

## 6. Bag of Words

**Idea:** represent a document by **counting** how often each vocabulary word appears, **ignoring order**. Like dumping the words into a bag and counting them.

**Example:**
- Doc 1: "I love cats"
- Doc 2: "I love dogs and cats"
- Doc 3: "dogs hate cats"

Vocabulary (sorted): [and, cats, dogs, hate, i, love]

| | and | cats | dogs | hate | i | love |
|---|---|---|---|---|---|---|
| Doc 1 | 0 | 1 | 0 | 0 | 1 | 1 |
| Doc 2 | 1 | 1 | 1 | 0 | 1 | 1 |
| Doc 3 | 0 | 1 | 1 | 1 | 0 | 0 |

Each document becomes a **vector** ([file 05](05-math-linear-algebra.md#2-vectors)) of length = vocabulary size. The collection is a **document-term matrix**.

```python
from sklearn.feature_extraction.text import CountVectorizer
docs = ["I love cats", "I love dogs and cats", "dogs hate cats"]
cv = CountVectorizer()
X = cv.fit_transform(docs)        # sparse matrix
cv.get_feature_names_out()        # ['and', 'cats', 'dogs', 'hate', 'love']  (default drops 1-letter "i")
X.toarray()
```

**Problems:**
- Loses order: "dog bites man" = "man bites dog"
- Huge, **sparse** vectors (mostly zeros) with big vocabularies
- Common words dominate counts
- No notion of meaning: "good" and "great" are as different as "good" and "banana"

---

## 7. N-grams

**Idea:** count sequences of **n consecutive tokens** to keep some local order.

"I do not like it":
- **Unigrams** (n=1): I, do, not, like, it
- **Bigrams** (n=2): "I do", "do not", "not like", "like it"
- **Trigrams** (n=3): "I do not", "do not like", "not like it"

Bigrams capture "**not like**", which unigrams miss, so they're much better for negation in sentiment.

**Trade-off:** vocabulary explodes as n grows (more sparsity). Typically use (1, 2) or (1, 3).

```python
CountVectorizer(ngram_range=(1, 2))
```

**Character n-grams** ("lov", "ove", "ved"): robust to typos and useful for languages with rich word forms.

---

## 8. TF-IDF

**Problem with raw counts:** "the" appears everywhere and gets high counts, but tells us nothing about a document. Rare words that appear often in one document (like "mitochondria") are much more informative.

**TF-IDF = Term Frequency × Inverse Document Frequency**

```
TF(t, d)  = how often term t appears in document d   (often divided by doc length)
IDF(t)    = log( N / df(t) )
            N = total number of documents
            df(t) = number of documents containing t
TF-IDF(t, d) = TF(t, d) × IDF(t)
```

- A word in **every** document: IDF = log(N/N) = log(1) = **0** → ignored
- A word in **few** documents: high IDF → important

(Logs from [file 04](04-math-numbers-and-functions.md#13-logarithms).)

### Worked example

3 documents (N = 3), using the same docs as section 6:

| Word | df (docs containing it) | IDF = ln(3/df) |
|---|---|---|
| cats | 3 | ln(1) = **0** |
| love | 2 | ln(1.5) ≈ **0.405** |
| dogs | 2 | ≈ **0.405** |
| hate | 1 | ln(3) ≈ **1.099** |
| and | 1 | ≈ **1.099** |

For Doc 3 ("dogs hate cats"), TF = 1/3 each:
- cats: 1/3 × 0 = **0** (appears everywhere, so useless)
- dogs: 1/3 × 0.405 = **0.135**
- hate: 1/3 × 1.099 = **0.366** ← most distinctive word of Doc 3 ✓

(scikit-learn uses a slightly smoothed IDF formula, ln((1+N)/(1+df)) + 1, and normalises each document vector to length 1, so its exact numbers differ, but the idea is the same.)

```python
from sklearn.feature_extraction.text import TfidfVectorizer
tfidf = TfidfVectorizer(ngram_range=(1, 2), min_df=2, max_df=0.9, sublinear_tf=True)
X = tfidf.fit_transform(train_texts)
```

- `min_df=2`: ignore words in fewer than 2 documents (typos, noise)
- `max_df=0.9`: ignore words in more than 90% of documents (acts like stopword removal)
- `sublinear_tf=True`: use 1 + log(count) so a word appearing 100 times isn't 100× as important

**Uses:** document classification, **keyword search** (the **BM25** ranking function used by search engines is an improved TF-IDF, and it's still vital in RAG "hybrid search", [file 23](23-embeddings-vector-databases-rag.md)), finding similar documents (cosine similarity of TF-IDF vectors), keyword extraction.

---

## 9. A classic text classifier

**TF-IDF + logistic regression** is a famously strong, fast baseline for text classification. Always try it before reaching for a transformer.

```python
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report
from datasets import load_dataset          # Hugging Face datasets (section 16)

ds = load_dataset("imdb")                   # 50,000 movie reviews: positive / negative
X_train, y_train = ds["train"]["text"], ds["train"]["label"]
X_test, y_test = ds["test"]["text"], ds["test"]["label"]

clf = make_pipeline(TfidfVectorizer(ngram_range=(1, 2), min_df=3, sublinear_tf=True),
                    LogisticRegression(C=4, max_iter=1000))
clf.fit(X_train, y_train)
print(classification_report(y_test, clf.predict(X_test)))   # ≈ 0.90 accuracy

# Which words push toward positive/negative?
vocab = clf[0].get_feature_names_out()
coefs = clf[1].coef_[0]
print("negative:", vocab[coefs.argsort()[:10]])
print("positive:", vocab[coefs.argsort()[-10:]])
```

Naive Bayes ([file 12](12-supervised-learning-algorithms.md#7-naive-bayes)) on counts and linear SVMs are other strong classic text classifiers.

---

## 10. Sparse vs dense representations

| | Sparse (BoW, TF-IDF, one-hot) | Dense (embeddings) |
|---|---|---|
| Length | vocabulary size (10k to 1M) | small (50 to 4,096) |
| Values | mostly zeros | all real numbers |
| Meaning | each dimension = one word | dimensions are learned features |
| Similar words | unrelated (orthogonal, [file 05](05-math-linear-algebra.md#6-the-dot-product)) | close together |
| "good" vs "great" | cosine similarity 0 | cosine similarity high (e.g. 0.8) |

Dense embeddings capture **meaning**, which lets models generalise: if a model learns "great movie" is positive, it can transfer that to "excellent film".

---

## 11. Word embeddings

**Distributional hypothesis** (linguist J.R. Firth, 1957):

> **"You shall know a word by the company it keeps."**

Words that appear in similar contexts have similar meanings.
- "I drank a cup of ___" → coffee, tea, water
- "The ___ barked loudly" → dog, puppy

So if we train a model to **predict a word's neighbours**, the vectors it learns will place similar words close together. This is **self-supervised learning** ([file 11](11-ml-fundamentals.md#2-types-of-machine-learning)): the labels (neighbouring words) come free from raw text.

**A word embedding** = a dense vector (e.g. 300 numbers) representing a word, where geometry reflects meaning:
- Similar words → close vectors (high cosine similarity, [file 05](05-math-linear-algebra.md#7-cosine-similarity))
- Relationships → consistent directions

**The famous analogy:**

```
vector("king") − vector("man") + vector("woman") ≈ vector("queen")
```

The direction "man → woman" is roughly the same as "king → queen", and also "uncle → aunt". Similarly "Paris − France + Italy ≈ Rome".

```
        queen ●
             ↑  (male→female direction)
       king ●            ● woman
                         ↑
                  man ●
```

---

## 12. Word2Vec, GloVe, FastText

### Word2Vec (Google, 2013)

A shallow neural network trained on huge text. Two variants:

- **CBOW (Continuous Bag of Words):** predict the **centre word** from its surrounding words.
  "The cat ___ on the mat" → "sat"
- **Skip-gram:** predict the **surrounding words** from the centre word.
  "sat" → "The", "cat", "on", "the"
  Better for rare words.

The **context window** (e.g. 5 words on each side) defines "neighbours".

**Negative sampling:** computing a softmax over the whole vocabulary (100k+ words) for every training example is slow. Instead, train a simple yes/no task: "Is (sat, cat) a real neighbour pair?" → yes; "Is (sat, banana) a real pair?" (a randomly sampled "negative") → no. Much faster.

After training, we **throw away the prediction task** and keep the learned embedding matrix.

### GloVe (Stanford, 2014)

**Glo**bal **Ve**ctors: builds a big table of how often each word appears near each other word across the whole corpus (a **co-occurrence matrix**), then factorises it into word vectors (similar to matrix factorisation in recommenders, [file 14](14-unsupervised-learning-and-more.md#12-recommender-systems)).

### FastText (Facebook, 2016)

Represents each word as a **bag of character n-grams** ("where" → "<wh", "whe", "her", "ere", "re>"). A word's vector = the sum of its n-gram vectors.

✅ Can build vectors for **unseen words** and typos ("whereee") from their pieces. Great for languages with rich word forms (Turkish, Finnish, Sinhala). Pretrained FastText vectors exist for 157 languages.

```python
import gensim.downloader as api
wv = api.load("glove-wiki-gigaword-100")         # pretrained 100-dim GloVe vectors
wv.most_similar("coffee", topn=3)                # [('tea', ...), ('drinks', ...), ...]
wv.most_similar(positive=["king", "woman"], negative=["man"], topn=1)   # [('queen', ...)]
wv.similarity("good", "great")                   # ≈ 0.78

from gensim.models import Word2Vec
model = Word2Vec(sentences=tokenised_corpus, vector_size=100, window=5, min_count=2, sg=1)  # sg=1: skip-gram
```

### Using word embeddings for documents

- **Average** the word vectors in a document → one document vector (simple, surprisingly OK)
- Use them as the input embedding layer of an RNN/CNN ([file 17](17-sequence-models-and-attention.md#9-bidirectional-and-stacked-rnns)), either frozen or fine-tuned

### Bias in embeddings ⚠️

Embeddings learn the biases in their training text. Early Word2Vec gave "man : computer programmer :: woman : homemaker". Biased embeddings lead to biased systems (file 29).

---

## 13. Contextual embeddings

**The big limitation:** Word2Vec/GloVe give each word **one fixed vector**, regardless of context. These are **static embeddings**.

- "I deposited money at the **bank**."
- "We had a picnic on the river **bank**."

Same vector for both "bank"s. That's wrong. (A word with several meanings is called **polysemous**.)

**Contextual embeddings:** the vector for a word **depends on the whole sentence around it**.

| Year | Model | How |
|---|---|---|
| 2018 | **ELMo** | Bidirectional LSTMs ([file 17](17-sequence-models-and-attention.md#9-bidirectional-and-stacked-rnns)); word vector = combination of LSTM states |
| 2018 | **BERT** | Transformer encoder; every token attends to every other ([file 19](19-transformers.md)) |
| 2018+ | **GPT** family | Transformer decoder ([file 19](19-transformers.md), [file 20](20-how-llms-work.md)) |

With BERT, "bank" in the money sentence gets a vector close to "finance", and in the river sentence a vector close to "shore".

### Sentence embeddings

One vector for a **whole sentence or paragraph**, so that sentences with similar **meaning** are close, even with no words in common:
- "How do I reset my password?" ≈ "I forgot my login credentials" (cosine ≈ 0.8)

Models: **Sentence-BERT (SBERT)**, and modern **embedding models** (e.g. `all-MiniLM-L6-v2`, BGE, E5, OpenAI/Cohere/Voyage embedding APIs). These power **semantic search** and **RAG**, covered in depth in [file 23](23-embeddings-vector-databases-rag.md).

```python
from sentence_transformers import SentenceTransformer, util
model = SentenceTransformer("all-MiniLM-L6-v2")
emb = model.encode(["How do I reset my password?",
                    "I forgot my login credentials",
                    "What's the weather today?"])
util.cos_sim(emb[0], emb[1])   # high (~0.6-0.8)
util.cos_sim(emb[0], emb[2])   # low  (~0.0-0.1)
```

---

## 14. Core NLP tasks

### Understanding tasks

| Task | Input → Output | Example |
|---|---|---|
| **Text classification** | text → label | spam/not spam; topic (sports/politics) |
| **Sentiment analysis** | text → positive/negative/neutral (or a score) | product reviews; social media monitoring |
| **Named Entity Recognition (NER)** | text → labelled spans | "**Nisha** [PERSON] joined **Dialog** [ORG] in **Colombo** [LOCATION] on **May 5** [DATE]" |
| **Part-of-Speech (POS) tagging** | each word → grammatical role | "The/DET cat/NOUN sat/VERB" |
| **Dependency parsing** | sentence → grammar tree | who did what to whom |
| **Coreference resolution** | link mentions of the same entity | "Nisha... **she**..." |
| **Natural Language Inference (NLI)** | (premise, hypothesis) → entails / contradicts / neutral | "A man is sleeping" vs "A person is awake" → contradiction |
| **Semantic similarity** | two texts → similarity score | duplicate question detection |
| **Topic modelling** | documents → topics (unsupervised) | **LDA (Latent Dirichlet Allocation)**: each document is a mix of topics, each topic a mix of words; or **BERTopic** (embeddings + clustering) |
| **Intent detection + slot filling** | user utterance → intent + parameters | "Book a flight to Jaffna tomorrow" → intent=book_flight, destination=Jaffna, date=tomorrow |

**NER as token classification with BIO tags:** each token gets a tag:
- **B-** = Beginning of an entity, **I-** = Inside an entity, **O** = Outside

```
New     York    is   in   the   USA
B-LOC   I-LOC   O    O    O     B-LOC
```

### Generation tasks

| Task | Example |
|---|---|
| **Machine translation** | English → Sinhala |
| **Summarisation:** *extractive* (copy the most important sentences) vs *abstractive* (write a new summary in new words) | Summarise a news article |
| **Question answering:** *extractive* (find the answer span in a given passage) vs *generative/open-domain* (write an answer, possibly from retrieved documents, i.e. RAG) | "When was the company founded?" |
| **Text generation** | stories, emails, code |
| **Dialogue / chatbots** | customer support |
| **Paraphrasing, grammar correction, style transfer** | |

Today, **one LLM** can do almost all of these tasks with the right prompt (file 22), which is a huge change from the era of one specialised model per task.

### Evaluation (preview)

- Classification/NER: precision, recall, F1 ([file 13](13-evaluation-metrics-and-tuning.md)); entity-level F1 for NER
- Translation: **BLEU** (n-gram overlap with reference translations)
- Summarisation: **ROUGE** (n-gram overlap, recall-oriented)
- Details and modern LLM evaluation: [file 26](26-evaluating-llms.md)

---

## 15. Language models

**A language model (LM)** assigns probabilities to sequences of words, or equivalently predicts the **next word** given previous words:

```
P("mat" | "the cat sat on the")
```

Using the chain rule of probability, the probability of a whole sentence = the product of each word's probability given the words before it ([file 07](07-math-probability-statistics.md#8-conditional-probability-and-independence)):

```
P(w₁, w₂, ..., wₙ) = P(w₁) × P(w₂ | w₁) × P(w₃ | w₁, w₂) × ...
```

### N-gram language models (the classic approach)

Assume each word depends only on the previous n−1 words, and estimate probabilities by counting:

```
Bigram: P("sat" | "cat") = count("cat sat") / count("cat")
```

If "cat" appears 100 times and "cat sat" 20 times: P(sat | cat) = **0.2**.

**Problems:** they can't see beyond n−1 words; unseen n-grams get probability 0 (needs **smoothing**); tables grow huge.

### Neural language models

RNN LMs (2010s), then **Transformer LMs** (GPT, 2018+). Same goal (predict the next token) but with long context and learned meaning. Scale them up to billions of parameters and trillions of words, and you get **Large Language Models** ([file 20](20-how-llms-work.md)).

**Perplexity:** the standard LM metric, e^(average cross-entropy) ([file 07](07-math-probability-statistics.md#23-cross-entropy)). Lower is better. Intuitively, it's "how many words is the model choosing between, on average". Details in [file 26](26-evaluating-llms.md).

**Why next-word prediction is so powerful:** to predict the next word well in "The capital of Japan is ___" or "2 + 3 × 4 = ___" or "She was furious because ___", a model must learn facts, arithmetic, grammar, reasoning and emotion. Prediction forces understanding.

---

## 16. NLP libraries

| Library | Best for |
|---|---|
| **NLTK** | Learning and teaching; classic algorithms (tokenisers, stemmers, WordNet) |
| **spaCy** | Fast, production-ready pipelines: tokenisation, POS, NER, dependency parsing, lemmatisation |
| **Gensim** | Word2Vec, FastText, topic models (LDA) |
| **scikit-learn** | TF-IDF, classic classifiers |
| **Hugging Face Transformers** | Thousands of pretrained transformer models (BERT, GPT-style, T5, Llama...) |
| **Hugging Face Datasets / Tokenizers / Hub** | Datasets, fast tokenisers, the central model/dataset repository |
| **sentence-transformers** | Sentence embeddings |

### spaCy

```python
import spacy                                      # python -m spacy download en_core_web_sm
nlp = spacy.load("en_core_web_sm")
doc = nlp("Nisha joined Dialog in Colombo on 5 May 2024 for $2,000.")
for ent in doc.ents:
    print(ent.text, ent.label_)       # Nisha PERSON, Dialog ORG, Colombo GPE, 5 May 2024 DATE, $2,000 MONEY
for tok in doc[:4]:
    print(tok.text, tok.pos_, tok.lemma_)   # Nisha PROPN Nisha / joined VERB join ...
```

### Hugging Face pipelines: pretrained models in one line

```python
from transformers import pipeline

sentiment = pipeline("sentiment-analysis")
sentiment("This phone's battery life is incredible!")
# [{'label': 'POSITIVE', 'score': 0.9998}]

ner = pipeline("ner", aggregation_strategy="simple")
ner("Elon Musk founded SpaceX in California.")

summarizer = pipeline("summarization", model="facebook/bart-large-cnn")
translator = pipeline("translation_en_to_fr")
qa = pipeline("question-answering")
qa(question="Where do I live?", context="My name is Amal and I live in Kandy.")
# {'answer': 'Kandy', ...}   ← extractive QA

zero_shot = pipeline("zero-shot-classification")
zero_shot("The new GPU doubles training speed",
          candidate_labels=["technology", "sports", "politics"])
```

**Hugging Face Hub** (huggingface.co) hosts hundreds of thousands of models and datasets. Each model page has a **model card** describing its training data, intended use, and limitations (file 29). This is where you'll find open LLMs like Llama, Mistral and Qwen (file 22).

**Fine-tuning a pretrained transformer** for classification (e.g. BERT on your support tickets) usually beats TF-IDF when you have a few thousand labelled examples. The workflow (tokeniser → model → `Trainer`) is shown in [file 21](21-training-finetuning-alignment.md).

---

## 17. Low-resource languages

Most NLP research and data is in English. **Low-resource languages** (like Sinhala, Tamil, Nepali, Swahili) have far less digital text and fewer labelled datasets and tools.

**Specific challenges (using Sinhala as an example):**
- Less training data → weaker models
- **Tokenisation inefficiency:** tokenisers trained mostly on English split Sinhala text into many more tokens per word (each Sinhala character is 3 bytes in UTF-8, [file 01](01-big-picture-and-data.md#how-text-is-stored)), so it costs more and fits less in the context window ([file 20](20-how-llms-work.md))
- **Unicode complexities:** combining characters and zero-width joiners (ZWJ) in conjuncts; text that looks identical may be encoded differently → normalise it
- **Code-mixing and transliteration:** "Singlish" (Sinhala written in Latin letters: "kohomada", "mama yanawa") alongside Sinhala script and English
- Rich morphology (many word forms)

**Approaches:**
- **Multilingual pretrained models** (mBERT, XLM-RoBERTa, multilingual LLMs) transfer knowledge from high-resource languages (**cross-lingual transfer**)
- FastText-style subword embeddings for word variants
- Collecting and cleaning local data; community datasets
- Translating English datasets (**machine-translated** training data), carefully checked
- Fine-tuning a multilingual model on a small amount of local data (file 21)

---

## 18. Check yourself

**Q1.** Why can removing stopwords hurt a sentiment classifier?
<details><summary>Answer</summary>Stopword lists often include negations like "not" and "no", which flip sentiment ("not good").</details>

**Q2.** Stemming vs lemmatisation: what does each give for "studies" and "better"?
<details><summary>Answer</summary>Stemming (Porter): "studi", "better". Lemmatisation: "study", "good" (with the adjective POS tag).</details>

**Q3.** Write the bigrams of "the movie was not good".
<details><summary>Answer</summary>"the movie", "movie was", "was not", "not good".</details>

**Q4.** 100 documents. The word "goal" appears in 5 of them; in one doc it appears 3 times out of 60 words. Compute TF × IDF (natural log).
<details><summary>Answer</summary>TF = 3/60 = 0.05. IDF = ln(100/5) = ln 20 ≈ 3.0. TF-IDF ≈ **0.15**.</details>

**Q5.** Why does a word that appears in every document get TF-IDF 0?
<details><summary>Answer</summary>IDF = log(N/N) = log(1) = 0: it doesn't help distinguish documents.</details>

**Q6.** What is the distributional hypothesis, and how does Word2Vec use it?
<details><summary>Answer</summary>Words in similar contexts have similar meanings. Word2Vec learns vectors by predicting a word from its neighbours (CBOW) or neighbours from a word (skip-gram), so words sharing contexts get similar vectors.</details>

**Q7.** What can FastText do that Word2Vec can't?
<details><summary>Answer</summary>Build vectors for unseen/misspelled words from their character n-grams.</details>

**Q8.** Why are static embeddings a problem for "bank"? What fixes it?
<details><summary>Answer</summary>One vector for all meanings. Contextual embeddings (ELMo, BERT, GPT) compute a vector based on the surrounding sentence.</details>

**Q9.** Tag "Amal visited New Delhi" with BIO NER tags.
<details><summary>Answer</summary>Amal/B-PER visited/O New/B-LOC Delhi/I-LOC.</details>

**Q10.** Extractive vs abstractive summarisation?
<details><summary>Answer</summary>Extractive copies important sentences from the source; abstractive generates new sentences in its own words.</details>

**Q11.** In a bigram model, "good" appears 200 times and "good morning" 50 times. P(morning | good)?
<details><summary>Answer</summary>50/200 = **0.25**.</details>

---

## 19. New words in this file

| Word | Meaning |
|---|---|
| NLP | Computers processing human language |
| Ambiguity, coreference, code-mixing, morphology | Language challenges |
| Text normalisation, Unicode normalisation | Cleaning text / unifying character encodings |
| Tokenisation, token, token ID | Splitting text / a unit / its integer index |
| Word / character / subword tokenisation | Splitting levels |
| Out-of-vocabulary (OOV) | Word not in the vocabulary |
| Vocabulary | All tokens a model knows |
| Sentence segmentation | Splitting into sentences |
| Stopwords | Very common low-information words |
| Stemming (Porter, Snowball) | Rule-based chopping to a root |
| Lemmatisation, lemma | Reducing to dictionary form |
| Bag of Words (BoW), document-term matrix | Word counts ignoring order / documents × words table |
| N-grams (unigram, bigram, trigram), character n-grams | Sequences of n tokens / characters |
| TF, IDF, TF-IDF, df | Term frequency, inverse document frequency, their product, document frequency |
| `min_df`, `max_df`, `sublinear_tf` | TF-IDF settings |
| BM25 | Improved TF-IDF ranking for search |
| Sparse vs dense representation | Mostly-zero long vectors vs short learned vectors |
| Distributional hypothesis | Meaning from context |
| Word embedding | Dense vector representing a word |
| Word analogy (king − man + woman ≈ queen) | Vector arithmetic capturing relations |
| Word2Vec, CBOW, skip-gram, context window | Embedding training methods |
| Negative sampling | Faster training with fake pairs |
| GloVe, co-occurrence matrix | Embeddings from global co-occurrence counts |
| FastText | Embeddings from character n-grams |
| Static vs contextual embeddings, polysemy | One vector per word vs context-dependent / multiple meanings |
| ELMo, BERT, GPT | Contextual models |
| Sentence embedding, SBERT, embedding model | One vector per sentence |
| Semantic search | Search by meaning |
| Text classification, sentiment analysis | Labelling texts / positive vs negative |
| NER, BIO tags | Finding named entities / tagging scheme |
| POS tagging, dependency parsing | Grammatical roles / grammar tree |
| NLI (entailment, contradiction, neutral) | Does one sentence follow from another? |
| Topic modelling, LDA (Latent Dirichlet Allocation), BERTopic | Unsupervised topic discovery |
| Intent detection, slot filling | Chatbot understanding |
| Machine translation | Translating between languages |
| Extractive vs abstractive summarisation | Copy vs rewrite |
| Extractive vs generative QA | Find span vs write answer |
| BLEU, ROUGE (preview) | Translation / summarisation overlap metrics |
| Language model, n-gram LM, smoothing | Predicts next word / count-based version / handling unseen n-grams |
| Perplexity | e^(cross-entropy): LM quality |
| NLTK, spaCy, Gensim | NLP libraries |
| Hugging Face Transformers / Datasets / Hub / pipeline | Pretrained model ecosystem |
| Model card | Documentation for a model |
| Zero-shot classification | Classifying into labels with no training examples |
| Low-resource language, cross-lingual transfer | Language with little data / learning from other languages |
| Multilingual models (mBERT, XLM-R) | Models trained on many languages |
| Transliteration ("Singlish") | Writing a language in another script |

**Next:** [19-transformers.md](19-transformers.md)
