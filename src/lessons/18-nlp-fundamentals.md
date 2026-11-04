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

**Why it exists:** almost everything people know is written down as text: emails, news, reviews, contracts, chat messages. Computers can only calculate with numbers. NLP is the set of tricks that turns text into numbers (and numbers back into text), so software can sort, search, summarise and answer in human language.

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

**Analogy:** think of a foreigner who has just arrived in Sri Lanka and is learning Sinhala. Knowing every word in the dictionary is not enough. When a neighbour asks "Have you eaten?", it is usually a greeting, not a question about food. You need the context, the culture and the tone. A computer has exactly the same problem, only worse.

### A worked example: one short sentence, many problems

> "Nimal told Kamal that he failed the exam."

| Question | Possible answers | What a word-counting program sees |
|---|---|---|
| Who failed? (coreference) | Nimal **or** Kamal (2 readings) | the word "he", nothing more |
| What does "failed" mean to the speaker? | a fact, or a complaint, or sympathy | nothing about tone |
| Is "exam" a noun here? | yes, but "exam" could also be shortened to "examine" in other text | one more token |

One sentence, at least 2 valid readings. A human picks one from context in a split second; a program needs a method for it.

And a second example, ambiguity of word sense: "I went to the **bank** to deposit Rs. 5,000" and "We had a picnic on the river **bank**". The same 4 letters, two meanings. A system that only counts letters cannot tell them apart.

### A short history in one picture

```
Hand-written rules      Counting words         Word vectors          Context-aware models      LLMs
(1950s-80s)       →     BoW, TF-IDF, n-grams → Word2Vec, GloVe  →    ELMo, BERT (2018)    →    GPT-style (2020s)
"if the text has        (1990s-2000s)          (2013-2014)           the vector depends        predict the next token
 'free money' → spam"                                                on the sentence           at huge scale
```

This file walks along that line in order. Each step fixes a weakness of the one before it.

**Where you'll meet it in real work:** the spam filter in Gmail, the next-word suggestion on your phone keyboard, a bank chatbot that answers "what is my balance?", and a hotel that sorts 5,000 guest reviews into happy and unhappy in minutes instead of weeks.

**Common mistakes:**
- Believing the computer "reads" words. It only ever sees numbers. All the cleverness in NLP is in choosing which numbers to give it.
- Assuming a tool that works well for English will work equally well for Sinhala or Tamil (see section 17).

**Exam angle:** NCA-GENL-style questions ask you to name why language is hard (ambiguity, context, coreference, sarcasm) and to put techniques in historical order: counting methods (BoW, TF-IDF) came first, then static embeddings, then contextual embeddings and Transformers.

> **සිංහලෙන්:** NLP කියන්නේ computer එකට මිනිස්සු කතා කරන, ලියන භාෂාව තේරුම් ගන්න උගන්වන එක. ඒත් computer එකට තේරෙන්නේ අංක විතරයි, ඒ නිසා මුලින්ම text එක අංක බවට හරවන්න ඕනේ. භාෂාව අමාරුයි, මොකද එකම වචනයට තේරුම් කීපයක් තියෙනවා. "bank" කියන්නේ මුදල් බැංකුවත් වෙන්න පුළුවන්, ගඟේ ඉවුරත් වෙන්න පුළුවන්. "කෑවද?" කියලා අහද්දි ඒක සාමාන්‍යයෙන් කෑම ගැන ප්‍රශ්නයක් නෙවෙයි, ආචාරයක් නේ, ඒක තේරුම් ගන්නත් context එක ඕනේ. ඉතින් NLP ඉතිහාසය කියන්නේ වචන ගණන් කරන එකේ ඉඳන් Transformers සහ LLMs වලට ආපු ගමන.

---

## 2. The classic NLP pipeline

**Why it exists:** raw text is messy (capital letters, links, typos, punctuation). A model needs the same idea to always look the same way. The pipeline is an assembly line that turns messy text into tidy numbers, one small step at a time.

```
Raw text → Clean/normalise → Tokenise → (remove stopwords, lemmatise) → Represent as numbers → Model → Output
"Loved it!!"  "loved it"     ["loved","it"]   ["love"]                  [0, 1, 0, ...]   classifier  positive
```

The modern LLM pipeline is simpler: raw text → **subword tokeniser** → transformer (files 19, 20). But the classic ideas are still used everywhere (search, quick baselines, data cleaning) and appear in interviews.

**Analogy:** before you cook kottu you wash, peel and chop the vegetables. You never throw a whole unwashed carrot onto the pan. Preprocessing is the washing and chopping for text: cleaning = washing, tokenising = chopping, removing stopwords = throwing away peel, lemmatising = recognising that carrot slices of all shapes are still "carrot".

### Worked example: follow one review through the pipeline

Review: **"LOVED it!! Great food, great price."**

| Step | Result |
|---|---|
| 1. Clean / normalise (lowercase, remove punctuation) | `loved it great food great price` |
| 2. Tokenise (split on spaces) | `["loved", "it", "great", "food", "great", "price"]` (6 tokens) |
| 3. Remove stopwords ("it") | `["loved", "great", "food", "great", "price"]` (5 tokens) |
| 4. Lemmatise ("loved" → "love") | `["love", "great", "food", "great", "price"]` |
| 5. Represent as numbers (word counts, vocabulary = food, great, love, price) | `[1, 2, 1, 1]` |
| 6. Model (e.g. logistic regression) | positive, probability 0.93 (illustrative) |

**Where you'll meet it in real work:** a Daraz-style shop sorting thousands of product reviews into positive and negative, or a telecom routing customer complaints to the right team.

**Common mistakes:**
- Cleaning the training text one way and the live text another way. The exact same steps must run at training time and prediction time, otherwise the model sees numbers it was never trained on.
- Copying this whole pipeline onto a Transformer model. Transformers want mostly raw text (see section 3).

**Exam angle:** know the order of the classic pipeline, and know that modern LLMs replace most of it with a **subword tokeniser** plus a Transformer.

> **සිංහලෙන්:** Text එකක් model එකකට දෙන්න කලින් පියවර ගාණක් හරහා යවනවා: පිරිසිදු කරනවා, tokens වලට කඩනවා, අනවශ්‍ය වචන අයින් කරනවා, අන්තිමට අංක බවට හරවනවා. කොත්තු හදන්න කලින් එළවළු සෝදලා කපනවා වගේ වැඩක් මේක. "LOVED it!! Great food, great price." කියන review එක lowercase කරලා, tokens 6කට කඩලා, "it" අයින් කරලා, "loved" එක "love" කරලා, අන්තිමට [1, 2, 1, 1] වගේ අංක පේළියක් හදනවා. Training වලදී කරපු පියවරම prediction වලදීත් කරන්න ඕනේ, නැත්නම් model එකට පුරුදු නැති අංක එනවා.

---

## 3. Text cleaning and normalisation

**Why it exists:** to a computer, "Great", "great" and "GREAT!!!" are three different strings. Cleaning makes things that mean the same look the same, so the model does not waste its learning on spelling noise.

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

### Worked example: tracing `clean()` on one line

Input: `"LOVED it!!! See https://x.com <b>5/5</b>"`

| After this line of `clean()` | Text |
|---|---|
| `text.lower()` | `loved it!!! see https://x.com <b>5/5</b>` |
| remove URLs | `loved it!!! see   <b>5/5</b>` |
| remove HTML tags | `loved it!!! see    5/5 ` |
| keep only letters, digits, spaces, apostrophes | `loved it    see    5 5 ` |
| collapse spaces and strip | `loved it see 5 5` |

Notice that "!!!" was thrown away. For a sentiment task that may be a loss (see the warning below).

**Before / after table**

| Raw | Cleaned | Good or risky? |
|---|---|---|
| `Don't STOP!` | `don't stop` | fine |
| `US vs us` | `us vs us` | risky: the country and the pronoun merge |
| `😀😀 loved it` | `loved it` | risky for sentiment: the emoji carried the feeling |
| `Visit http://abc.lk now` | `visit now` | fine: a URL is noise for most tasks |

**Sinhala note (English only here):** the same Sinhala letter can sometimes be stored in two different ways (with or without an invisible zero-width joiner), and old Sinhala websites often used non-Unicode fonts. Unicode normalisation turns these into one standard form before any counting.

**Where you'll meet it in real work:** cleaning scraped news articles or customer emails before feeding them to a search index or a classifier.

**Common mistakes:**
- Over-cleaning: stripping "!", "?" and emoji from text where they carry the sentiment.
- Lowercasing everything when case matters (names, "US").
- Forgetting that a regular expression like `[^a-z0-9\s']` silently deletes every non-English letter, including all Sinhala and Tamil text.

**Exam angle:** "How much cleaning do Transformer models need?" Answer: minimal. Heavy cleaning and stopword removal are for classic bag-of-words models.

> **සිංහලෙන්:** Text cleaning කියන්නේ එකම තේරුම තියෙන දේවල් එකම විදිහට පේන්න සකස් කරන එක. Computer එකට "Great", "great", "GREAT!!!" කියන්නේ වෙනස් strings තුනක්, ඒ නිසා lowercase කරනවා, URLs සහ HTML අයින් කරනවා, extra spaces අයින් කරනවා. ඒත් ලොකුවට clean කරන්න එපා. Sentiment එකකදී "!!!" සහ emoji වලත් හැඟීම තියෙනවා. සිංහල වලදී එකම අකුර Unicode වලින් විදි දෙකකට store වෙන්න පුළුවන්, ඒක normalise කරන්න ඕනේ. Transformer models වලට සාමාන්‍යයෙන් තියෙන්නේ අඩුවෙන් clean කරන එක.

---

## 4. Tokenisation

**Why it exists:** a model cannot swallow a whole paragraph as one blob. It needs small, repeatable pieces it can give a number to. Tokenisation chooses the pieces.

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

### Worked example: the same text at three levels

Text: **"I love kottu!"**

| Level | Tokens | How many |
|---|---|---|
| Word | `I`, `love`, `kottu`, `!` | 4 |
| Character (including the 2 spaces) | `I`, ` `, `l`, `o`, `v`, `e`, ` `, `k`, `o`, `t`, `t`, `u`, `!` | 13 |
| Subword (illustrative; real tokenisers differ) | `I`, ` love`, ` kott`, `u`, `!` | 5 |

Now an unseen word, "unhappiness". A word-level vocabulary that never saw it has no entry: **OOV**. A subword tokeniser splits it as `un` + `happi` + `ness` and every piece is already known. That is why subword tokenisation is the standard for LLMs.

**The trade-off in one picture**

```
Characters          Subwords             Words
tiny vocabulary     medium vocabulary    huge vocabulary
very long input     medium input         short input
(26 + symbols)      (30k-100k tokens)    (hundreds of thousands)
```

**Rule of thumb (approximate):** in English, 1 token is about 3/4 of a word, so 100 words is roughly 130 tokens. This matters later because LLM cost and context length are counted in tokens, not words.

**Where you'll meet it in real work:** every time you call an LLM API you pay per token, and every model has a token limit, so counting tokens is a daily task.

**Common mistakes:**
- Using "token" and "word" as if they were the same thing.
- Splitting sentences on "." and breaking "Dr. Silva" or "3.14".
- Using a different tokeniser at prediction time than the one the model was trained with. The token IDs would be meaningless.

**Exam angle:** know the three levels, what OOV means, why subwords solve it, and that BPE / WordPiece / SentencePiece are subword methods.

> **සිංහලෙන්:** Tokenisation කියන්නේ text එක model එකට දෙන්න පුළුවන් පොඩි කෑලි වලට කඩන එක. කෑලි වර්ග තුනක් තියෙනවා: වචන, අකුරු, සහ subwords. "I love kottu!" කියන එක වචන වලට කැඩුවොත් tokens 4යි, අකුරු වලට කැඩුවොත් 13යි. වචන විදිහට කඩනකොට කලින් නොදැක්ක වචනයක් (OOV) ආවොත් අවුල්, ඒ නිසා LLMs පාවිච්චි කරන්නේ subwords. "unhappiness" එක "un", "happi", "ness" විදිහට කැඩෙනවා, ඒ හැම කෑල්ලක්ම model එක දන්නවා. ඉංග්‍රීසි වලදී token එකක් වචනයෙන් 3/4ක් විතර, ඒ නිසා API bill එක tokens ගණනින් තමයි එන්නේ.

---

## 5. Stopwords, stemming, lemmatisation

**Why it exists:** "run", "runs" and "running" mean nearly the same thing but look like three different words. Reducing them to one form shrinks the vocabulary and gives the model more examples of each idea.

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

### Worked example: shrinking a hotel review

Review: **"The rooms were amazing and the staff were helping us!"**

| Step | Result | Tokens left |
|---|---|---|
| Lowercase + tokenise | `the`, `rooms`, `were`, `amazing`, `and`, `the`, `staff`, `were`, `helping`, `us` | 10 |
| Remove stopwords (`the`, `were`, `and`, `us`) | `rooms`, `amazing`, `staff`, `helping` | 4 |
| Lemmatise | `room`, `amazing`, `staff`, `help` | 4 |

Ten tokens became four, and the main message (rooms good, staff helpful) survived.

**Stemming vs lemmatisation side by side**

| Word | Porter stemmer | Lemmatiser |
|---|---|---|
| running | run | run |
| studies | studi | study |
| happiness | happi | happiness |
| better | better | good (needs the adjective tag) |
| was | wa | be |

Stemming is a fast axe, lemmatisation is a careful dictionary lookup.

**Where you'll meet it in real work:** search engines. If you search for "running shoes", the engine also wants to match pages that say "run" or "shoe".

**Common mistakes:**
- Removing "not", "no" and "never" as stopwords before a sentiment task.
- Expecting a stemmer to give real words ("studi" is fine for matching, not for showing to users).
- Lemmatising without part-of-speech: "meeting" can be a noun (keep) or a verb (meet).

**Exam angle:** "Which technique reduces 'studies' to 'study' using a dictionary?" Lemmatisation. "Which is faster but cruder?" Stemming.

> **සිංහලෙන්:** Stopwords කියන්නේ "the", "is", "and" වගේ නිතර එන, තනියම වැඩි තේරුමක් නැති වචන. Stemming කියන්නේ නීති වලින් වචනයේ අග කපන එක, "studies" → "studi" වගේ ඇත්ත වචනයක් නොවන දෙයකුත් එන්න පුළුවන්. Lemmatization එක dictionary එකක් බලලා නිවැරදි මූල වචනය දෙනවා, "studies" → "study", "better" → "good". Review එකක "the rooms were amazing and the staff were helping us" tokens 10ක් තිබුණා නම්, stopwords අයින් කරලා lemmatize කළාම "room, amazing, staff, help" කියලා 4යි. ඒත් sentiment වලදී "not" අයින් කරන්න එපා, "not good" එක "good" වුණොත් තේරුම පෙරළෙනවා.

---

## 6. Bag of Words

**Why it exists:** a model needs a table of numbers, but text is words. The simplest bridge is to count: which words appear, and how many times. It throws away order, but it is quick and surprisingly useful.

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

### Worked example: comparing documents with cosine similarity

Using the table above (vocabulary order: and, cats, dogs, hate, i, love):

- Doc 1 = [0, 1, 0, 0, 1, 1]
- Doc 2 = [1, 1, 1, 0, 1, 1]
- Doc 3 = [0, 1, 1, 1, 0, 0]

**Doc 1 vs Doc 2** ([cosine similarity, file 05](05-math-linear-algebra.md#7-cosine-similarity)):
- dot product = 0×1 + 1×1 + 0×1 + 0×0 + 1×1 + 1×1 = **3**
- length of Doc 1 = √(1+1+1) = √3 ≈ 1.732
- length of Doc 2 = √(1+1+1+1+1) = √5 ≈ 2.236
- cosine = 3 / (1.732 × 2.236) = 3 / 3.873 ≈ **0.775**

**Doc 1 vs Doc 3:**
- dot product = only "cats" is shared, so **1**
- lengths: √3 and √3, so 1 / (1.732 × 1.732) = 1/3 ≈ **0.333**

Doc 1 ("I love cats") is much closer to Doc 2 ("I love dogs and cats") than to Doc 3 ("dogs hate cats"), which matches common sense.

**The order problem in one line:** "dog bites man" and "man bites dog" give exactly the same vector, yet the news is very different.

**Where you'll meet it in real work:** classic spam filters (Naive Bayes on word counts) and quick "find similar documents" tools.

**Common mistakes:**
- Building the vocabulary from all the data, including the test set. Build it from training data only, like any other fitted step (leakage, [file 10](10-data-science-workflow.md)).
- Forgetting that the vectors are huge. With a 50,000-word vocabulary every document is 50,000 numbers, almost all zero.

**Exam angle:** "What does Bag of Words ignore?" Word order (and meaning). "What is a document-term matrix?" Rows = documents, columns = vocabulary words, values = counts.

> **සිංහලෙන්:** Bag of Words කියන්නේ text එක අංක කරන සරලම ක්‍රමය. වචන බෑගයකට දාලා සොලවලා, හැම වචනයක්ම කී පාරක් ආවද කියලා ගණන් කරනවා, අනුපිළිවෙළ ගැන හිතන්නේ නෑ. "I love cats" කියන එකට [0, 1, 0, 0, 1, 1] වගේ අංක පේළියක් හැදෙනවා. ඒ අංක පේළි දෙකක් cosine similarity වලින් සසඳලා documents කොච්චර සමානද බලන්න පුළුවන්, උදාහරණයක් විදිහට 0.775ක් කියන්නේ ගොඩක් සමානයි. අඩුපාඩුව තමයි "dog bites man" සහ "man bites dog" එකම වගේ පේන එක, සහ "good" සහ "great" වෙන වෙනම columns දෙකක් වෙන එක.

---

## 7. N-grams

**Why it exists:** Bag of Words cannot tell "good" from "not good". N-grams bring back a little bit of word order by counting short phrases instead of single words.

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

### Worked example: how many n-grams?

A sentence with **t** tokens has t − n + 1 n-grams of size n. For "I do not like it" (t = 5):

| n | Name | Count | Items |
|---|---|---|---|
| 1 | unigram | 5 | I, do, not, like, it |
| 2 | bigram | 4 | I do, do not, not like, like it |
| 3 | trigram | 3 | I do not, do not like, not like it |

**Why the vocabulary explodes:** if your vocabulary has 10,000 words, there are up to 10,000 × 10,000 = **100 million** possible bigrams. Most never occur in real text, but the ones that do make the table far wider and sparser. That is why people stop at (1, 2) or (1, 3).

**Character n-grams** work the same way on letters: "love" with n = 3 gives `lov`, `ove`. A typo such as "lovve" still shares `lov` and `ove` with the real word, so the damage is small.

**Where you'll meet it in real work:** sentiment models on product reviews. Adding bigrams lets the model learn that "not good" is negative even though "good" is positive. Place names such as "New York City" or "Nuwara Eliya" are also easier to spot as phrases.

**Common mistakes:**
- Setting n too high. A 5-gram appears so rarely that the model cannot learn from it.
- Forgetting to use `min_df` to throw away rare n-grams.

**Exam angle:** "Which feature lets a bag-of-words model capture negation such as 'not good'?" Bigrams.

> **සිංහලෙන්:** N-grams කියන්නේ එක දිගට එන වචන n ගාණක් එකට ගණන් කරන එක. Unigram කියන්නේ තනි වචනයක්, bigram වචන දෙකක්, trigram වචන තුනක්. "I do not like it" කියන වචන 5ක වාක්‍යයෙන් bigrams 4ක් හැදෙනවා: "I do", "do not", "not like", "like it". මේකෙන් "not good" කියන එක "good" වලින් වෙන් කරලා අඳුනගන්න පුළුවන්. ඒත් n වැඩි කරන්න කරන්න vocabulary එක ගොඩක් ලොකු වෙනවා, වචන 10,000ක් තියෙනවා නම් bigrams කෝටි 10ක් විතර හැදෙන්න පුළුවන්, ඒ නිසා සාමාන්‍යයෙන් (1, 2) විතර තමයි පාවිච්චි කරන්නේ.

---

## 8. TF-IDF

**Why it exists:** raw counts reward boring words. TF-IDF fixes this by asking two questions: how often does the word appear *here*, and how rare is it *everywhere else*? A word that is frequent here but rare elsewhere is what makes this document special.

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

### A second worked example (log base 10, to make the arithmetic easy)

There are N = 1,000 food reviews. One review has 100 words, and "kottu" appears 5 times in it. "kottu" appears in 10 of the 1,000 reviews. The word "the" appears in all 1,000.

| Word | TF = count / length | df | IDF = log₁₀(N/df) | TF-IDF |
|---|---|---|---|---|
| kottu | 5/100 = 0.05 | 10 | log₁₀(1000/10) = log₁₀(100) = **2** | 0.05 × 2 = **0.10** |
| the (say 6 times) | 6/100 = 0.06 | 1000 | log₁₀(1000/1000) = log₁₀(1) = **0** | 0.06 × 0 = **0** |

"the" appears more often than "kottu" but scores 0. (Using ln instead of log₁₀ only rescales every score by the same factor, so the ranking does not change.)

**Analogy:** a supermarket bill. Every bill has a carrier bag, so it tells you nothing about the customer (IDF near 0). A bill with five packs of baby diapers tells you a lot: there is a baby at home. That item is common on this bill (high TF) but rare on other bills (high IDF).

**Why a logarithm?** Without it, a word in 1 document out of 1,000 would count 1,000 times more than a word in every document. The log squeezes that range into a sensible one.

**Where you'll meet it in real work:** a news website's search box, a "similar articles" panel, and the keyword half of **hybrid search** in a RAG system (BM25 + embeddings, [file 23](23-embeddings-vector-databases-rag.md)).

**Common mistakes:**
- Fitting the TF-IDF vectoriser on test data. Fit it on the training data only.
- Assuming a very high IDF always means "important". A typo that appears once also has a huge IDF; `min_df` filters those out.

**Exam angle:** "What is the TF-IDF score of a word that appears in every document?" Zero. "What is BM25?" An improved TF-IDF-style ranking function used in keyword search.

> **සිංහලෙන්:** TF-IDF කියන්නේ document එකකට විශේෂ වචන හොයන ක්‍රමයක්. TF කියන්නේ ඒ document එකේ වචනය කොච්චර නිතර එනවාද කියන එක, IDF කියන්නේ documents ඔක්කොම අතරේ ඒ වචනය කොච්චර දුර්ලභද කියන එක. Cargills bill එකක "carrier bag" හැම bill එකකම තියෙනවා, ඒ නිසා ඒකෙන් මුකුත් කියවෙන්නේ නෑ. ඒත් "baby diapers" 5ක් තියෙනවා නම් ගෙදර බබෙක් ඉන්නවා කියලා තේරෙනවා. උදාහරණයක් විදිහට reviews 1,000කින් "kottu" තියෙන්නේ 10කයි, ඒ නිසා IDF = log₁₀(1000/10) = 2, TF = 5/100 = 0.05, TF-IDF = 0.1. "the" හැම review එකකම තියෙන නිසා IDF = 0, ලකුණු 0යි.

---

## 9. A classic text classifier

**Why it exists:** before you spend GPU money on a giant model, you want to know how far a cheap, fast method gets you. TF-IDF + logistic regression is that cheap method, and it is often hard to beat.

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

### Worked example: how the classifier scores one review

Logistic regression ([file 12](12-supervised-learning-algorithms.md)) learns one weight per word or bigram. Here are **made-up** weights, just to show the arithmetic:

| Feature | Weight |
|---|---|
| great | +2.1 |
| not good | −1.8 |
| boring | −2.4 |
| intercept | +0.1 |

Review: "great but boring" (the features present are *great* and *boring*, each with TF-IDF value taken as 1 to keep it simple).

- score = 0.1 + 2.1 − 2.4 = **−0.2**
- probability of positive = 1 / (1 + e^0.2) = 1 / (1 + 1.2214) ≈ **0.45**
- 0.45 is below 0.5, so the prediction is **negative**.

Because the model is linear, you can print the biggest positive and negative weights (the last lines of the code above) and see exactly *why* it decides what it decides. A deep model cannot do that so easily.

**Where you'll meet it in real work:** routing customer emails at a telecom (billing / network / SIM), flagging abusive comments, or tagging support tickets, all with a small model that trains in seconds on a laptop.

**Common mistakes:**
- Fitting the vectoriser on all data before the split. Use a pipeline so it is fitted only on training data ([file 11](11-ml-fundamentals.md#17-pipelines)).
- Judging only by accuracy when one class is rare. Use precision, recall and F1.

**Exam angle:** "What is a good first baseline for text classification?" TF-IDF with logistic regression (or Naive Bayes / linear SVM). A Transformer is justified only if the baseline is not good enough.

> **සිංහලෙන්:** TF-IDF එකයි logistic regression එකයි එකතු කරලා හදන text classifier එක ගොඩක් වේගවත් සහ හොඳ baseline එකක්. ලොකු Transformer model එකකට යන්න කලින් මේක try කරලා බලන්න ඕනේ. Logistic regression එක හැම වචනයකටම බරක් (weight) ඉගෙන ගන්නවා. උදාහරණයක් විදිහට "great" = +2.1, "boring" = −2.4, intercept = +0.1 නම්, "great but boring" එකේ score එක 0.1 + 2.1 − 2.4 = −0.2, probability එක 0.45ක් නිසා negative. මොන වචන නිසාද තීරණය වුණේ කියලා weights බලලා කෙළින්ම කියන්න පුළුවන් එක මේකේ ලොකු වාසියක්.

---

## 10. Sparse vs dense representations

**Why it exists:** sparse vectors treat every word as a stranger. "good" and "great" get no similarity at all. Dense vectors were invented so that words with similar meaning can sit close together, and a model can reuse what it learned.

| | Sparse (BoW, TF-IDF, one-hot) | Dense (embeddings) |
|---|---|---|
| Length | vocabulary size (10k to 1M) | small (50 to 4,096) |
| Values | mostly zeros | all real numbers |
| Meaning | each dimension = one word | dimensions are learned features |
| Similar words | unrelated (orthogonal, [file 05](05-math-linear-algebra.md#6-the-dot-product)) | close together |
| "good" vs "great" | cosine similarity 0 | cosine similarity high (e.g. 0.8) |

Dense embeddings capture **meaning**, which lets models generalise: if a model learns "great movie" is positive, it can transfer that to "excellent film".

### Worked example: memory and similarity

**Size.** With a 50,000-word vocabulary, a one-hot vector is 50,000 numbers (a single 1, the rest 0). A 300-number dense embedding is 50,000 / 300 ≈ **167 times shorter**.

**Similarity (toy numbers; real embeddings have hundreds of dimensions).**

One-hot vectors: good = [1, 0, 0], great = [0, 1, 0]. Dot product = 0, so cosine = **0**. They look completely unrelated.

Dense 2-D toy vectors: good = [0.8, 0.6], great = [0.7, 0.7], banana = [−0.5, 0.9].
- good · great = 0.8×0.7 + 0.6×0.7 = 0.56 + 0.42 = 0.98
- |good| = √(0.64 + 0.36) = 1.0, |great| = √(0.49 + 0.49) = 0.990
- cosine(good, great) = 0.98 / (1.0 × 0.990) ≈ **0.99**
- good · banana = −0.40 + 0.54 = 0.14, |banana| = √(0.25 + 0.81) = 1.030, so cosine(good, banana) ≈ **0.14**

Now "good" is close to "great" and far from "banana", the way human intuition says it should be.

**Where you'll meet it in real work:** every semantic search and RAG system compares dense vectors, never sparse ones, to find "the same meaning in different words".

**Common mistakes:**
- Thinking "dense" means "more accurate". Dense vectors capture meaning but they are also harder to inspect than TF-IDF.
- Mixing vectors from two different embedding models. Their dimensions mean different things.

**Exam angle:** know the contrast table: sparse = long, mostly zero, one dimension per word, no similarity between words; dense = short, learned, similar words close together.

> **සිංහලෙන්:** Sparse representation කියන්නේ BoW, TF-IDF, one-hot වගේ දිග, බොහෝ දුරට බිංදු වලින් පිරුණු vectors. ඒවායේ "good" සහ "great" කියන්නේ සම්පූර්ණයෙන්ම වෙනස් වචන දෙකක්, cosine similarity එක 0යි. Dense embedding එකක් කියන්නේ අංක 300ක් වගේ කෙටි vector එකක්, ඒකේ තේරුම සමාන වචන එකිනෙකාට ළඟින් තියෙනවා. වචන 50,000ක vocabulary එකක් තියෙනවා නම් one-hot vector එක අංක 50,000යි, dense එක 300යි, ඒ කියන්නේ ආසන්න වශයෙන් 167 ගුණයක් කෙටියි. ඒ නිසා model එකට "great movie" positive කියලා ඉගෙන ගත්තාම "excellent film" එකත් positive කියලා අනුමාන කරන්න පුළුවන්.

---

## 11. Word embeddings

**Why it exists:** if a machine is going to understand meaning, it needs a way to measure how close two meanings are. Placing every word at a point in space (a vector) gives us that ruler. And nobody has to label anything by hand, because the text itself teaches the machine.

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

### Worked example: the king - man + woman arithmetic

Real embeddings have 100 to 300 dimensions. Here is a **2-D toy** that makes the arithmetic visible (dimension 1 = "royalty", dimension 2 = "female-ness"; real dimensions are not this neat):

| Word | Vector |
|---|---|
| king | [0.9, 0.8] |
| man | [0.5, 0.1] |
| woman | [0.5, 0.9] |
| queen | [0.9, 1.6] |

- king − man = [0.9 − 0.5, 0.8 − 0.1] = [0.4, 0.7]
- (king − man) + woman = [0.4 + 0.5, 0.7 + 0.9] = [0.9, 1.6]
- That is exactly **queen**.

In real models the answer is only *close* to queen, not identical. People take the nearest word after removing the input words from the candidates.

**Analogy:** imagine a map of Colombo where every shop is a dot. Rice shops are bunched in one area, kottu shops next to them, phone shops somewhere else. A direction such as "from Pettah to Bambalapitiya" has a meaning of its own. A word embedding is a map like that for words, only with 300 directions instead of 2.

**Where you'll meet it in real work:** autocomplete and "similar word" suggestions, recommending related products, and as the first layer of almost every neural NLP model.

**Common mistakes:**
- Believing each dimension has a human meaning ("dimension 7 = royalty"). In real embeddings the dimensions are mixed and not individually interpretable.
- Expecting the analogy trick to work perfectly every time. It is a neat demonstration, not a guarantee.

**Exam angle:** know the distributional hypothesis ("you shall know a word by the company it keeps"), that embeddings are learned self-supervised from raw text, and that similarity is measured with cosine similarity.

> **සිංහලෙන්:** Word embedding කියන්නේ වචනයක් අංක ලැයිස්තුවකින් (vector එකකින්) නිරූපණය කරන එක. අදහස සරලයි: "වචනයක් අඳුනගන්න, ඒක එක්ක එන යාළුවෝ බලන්න." "මම උදේට ___ බිව්වා" කියන තැනට තේ, කෝපි, කිරි එන නිසා ඒ වචන තුන තේරුමෙන් ළඟයි. කොළඹ සිතියමක කඩ වල් තිතකින් ලකුණු කළොත් බත් කඩ එක පැත්තක, phone කඩ තව පැත්තක ඉන්නවා වගේ, embeddings වලත් සමාන වචන ළඟින් ඉන්නවා. king − man + woman ≈ queen කියන්නේ "පිරිමි → ගැහැණු" කියන දිශාව vectors වල තියෙන නිසා. ඒත් dimension එකක් එකක් වෙන වෙනම අපිට තේරුම් ගන්න බෑ.

---

## 12. Word2Vec, GloVe, FastText

**Why it exists:** you cannot sit and write 300 numbers for every word by hand. Word2Vec, GloVe and FastText are three recipes that let the computer *learn* the numbers from a big pile of text.

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

### Worked example: training pairs from one sentence

Sentence: **"the cat sat on the mat"**, context window = 2, centre word = **sat**. The neighbours within 2 words are: the, cat, on, the.

| Method | Input | What it must predict |
|---|---|---|
| **CBOW** | the, cat, on, the (the neighbours) | sat (the centre) |
| **Skip-gram** | sat (the centre) | the, cat, on, the, one pair at a time: (sat, the), (sat, cat), (sat, on), (sat, the) |

So this one centre word gives 1 CBOW example or 4 skip-gram pairs. Skip-gram makes more training pairs, which is one reason it does better on rare words.

**Negative sampling.** Instead of a softmax over 100,000+ words, the model sees yes/no questions: (sat, cat) → real pair, 1; (sat, banana) → random fake pair, 0. Each update touches only a handful of words, so training is much faster.

**FastText n-grams.** "where" with boundary markers `<where>` has the 3-grams `<wh`, `whe`, `her`, `ere`, `re>`, that is **5** pieces. The word vector is their sum, so an unseen typo like "whereee" still gets a vector.

**Size check.** A vocabulary of 100,000 words × 300 dimensions = 30 million numbers. At 4 bytes each that is about **120 MB**: the whole embedding table.

**Where you'll meet it in real work:** pretrained GloVe or FastText vectors as a quick, cheap feature extractor, and FastText for languages with many word forms, such as Sinhala, where each noun can take many endings.

**Common mistakes:**
- Expecting Word2Vec or GloVe to give a vector for a word they never saw. Only FastText can build one from pieces.
- Confusing CBOW and skip-gram. Memory trick: CBOW = **C**ontext → centre; **S**kip-gram = centre → **s**urroundings.

**Exam angle:** "Which model predicts the centre word from its context?" CBOW. "Which handles out-of-vocabulary words?" FastText. "Which uses a global co-occurrence matrix?" GloVe.

> **සිංහලෙන්:** Word2Vec, GloVe, FastText කියන්නේ වචන වල vectors text එකෙන්ම ඉගෙන ගන්න ක්‍රම තුනක්. Word2Vec වල CBOW කියන්නේ වටේ වචන වලින් මැද වචනය අනුමාන කරන එක, Skip-gram කියන්නේ මැද වචනයෙන් වටේ වචන අනුමාන කරන එක. "the cat sat on the mat" එකේ "sat" මැද වචනය නම්, skip-gram වලට training pairs 4ක් හැදෙනවා. GloVe කරන්නේ මුළු corpus එකේම වචන එකට එන වාර ගණන් table එකකට දාලා ඉඳන් vectors හදන එක. FastText වචන character n-grams වලට කඩන නිසා කවදාවත් දැකලා නැති වචනයකටත් vector එකක් හදන්න පුළුවන්, ඒක සිංහල වගේ වචන ස්වරූප ගොඩක් තියෙන භාෂා වලට ගොඩක් හොඳයි.

---

## 13. Contextual embeddings

**Why it exists:** a static embedding gives "bank" one vector, whether the sentence is about money or about a river. That is like using one photo for two different people. Contextual embeddings fix this by building the vector from the whole sentence.

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

### Worked example: one word, two meanings (toy numbers)

| Model | "bank" in the money sentence | "bank" in the river sentence |
|---|---|---|
| Static (Word2Vec / GloVe) | [0.5, 0.5] | [0.5, 0.5] (identical) |
| Contextual (BERT-style) | [0.9, 0.1] (near "finance" [0.95, 0.05]) | [0.1, 0.9] (near "shore" [0.05, 0.95]) |

The contextual model produces a different vector each time because each vector is computed from the surrounding words.

**Analogy:** a neighbour who says "you know how it is" means very different things at a funeral and at a wedding. A static embedding is a dictionary entry; a contextual embedding is the person who understands the room.

**Sentence embeddings in action.** "How do I reset my password?" and "I forgot my login credentials" share almost no words, yet their cosine similarity is high (about 0.6 to 0.8 with a model like all-MiniLM-L6-v2). "What's the weather today?" scores near 0 against both. That is what lets a help-desk chatbot find the right FAQ even when the customer words it differently.

**Where you'll meet it in real work:** semantic search on an online shop (searching "cheap phone for a student" finds a listing titled "budget smartphone"), and the retrieval step of RAG.

**Common mistakes:**
- Using static embeddings for tasks full of ambiguous words.
- Comparing vectors made by two different models, or by one model on word level and another on sentence level.

**Exam angle:** static vs contextual is a favourite. ELMo (bi-LSTM), BERT (Transformer encoder) and GPT (Transformer decoder) are contextual. Sentence embeddings (SBERT and similar) power semantic search and RAG.

> **සිංහලෙන්:** Word2Vec, GloVe වගේ static embeddings වල හැම වචනයකටම තියෙන්නේ එකම vector එකයි. ඒ නිසා "මම bank එකට ගියා" සහ "ගඟේ bank එක ළඟ වාඩි වුණා" කියන දෙකේම "bank" එකට එකම vector එක ලැබෙනවා, ඒක වැරදියි. Contextual embeddings වල (ELMo, BERT, GPT) වචනයේ vector එක හැදෙන්නේ වටේ තියෙන මුළු වාක්‍යය බලලා, ඒ නිසා මුදල් bank එක "finance" ළඟටත්, ගං ඉවුර "shore" ළඟටත් යනවා. Sentence embeddings වලින් වාක්‍ය මුළුමනින්ම එක vector එකකට හරවනවා, "මගේ password එක අමතක වුණා" සහ "login එකට ඇතුල් වෙන්න බෑ" වගේ වචන වෙනස් වාක්‍ය දෙකක් ළඟින් තියෙනවා. Semantic search සහ RAG වැඩ කරන්නේ මේකෙන්.

---

## 14. Core NLP tasks

**Why it exists:** "do NLP" is too vague to build anything. Real products are made from a small menu of well-defined tasks (classify, tag, translate, summarise, answer). Knowing the menu tells you which tool and which metric to pick.

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

### Worked examples

**Sentiment on a mixed review.** "The service was slow but the food was excellent." A good model returns something close to mixed or mildly positive, not a firm negative. Sarcasm ("Great, the bus is two hours late") is still hard: the words look positive and the meaning is negative.

**Extractive QA.** Passage: "Sri Lanka won the Cricket World Cup in 1996, beating Australia in the final in Lahore." Question: "Where was the final played?" An extractive model points at the exact span: **Lahore**. A generative model could write a full sentence instead.

**NER scored with precision, recall and F1.** A text contains 10 real entities. The model marks 8 entities, and 6 of them are correct.
- precision = 6 / 8 = **0.75**
- recall = 6 / 10 = **0.60**
- F1 = 2 × 0.75 × 0.60 / (0.75 + 0.60) = 0.90 / 1.35 ≈ **0.667**

**ROUGE-1 on a tiny summary.** Reference: "the cat sat on the mat" (6 words). Model summary: "the cat on the mat" (5 words). Matching words (counting "the" twice): the, the, cat, on, mat = 5.
- ROUGE-1 recall = 5 / 6 ≈ **0.83**
- ROUGE-1 precision = 5 / 5 = **1.0**

**Analogy for summaries:** extractive summarisation is highlighting the key sentences in your A/L textbook. Abstractive summarisation is closing the book and writing your own short notes. Extractive QA is an open-book test where you point to the line with the answer.

**Matching task to metric**

| Task | Typical metric |
|---|---|
| Classification, NER | precision, recall, F1 (accuracy if classes are balanced) |
| Machine translation | BLEU |
| Summarisation | ROUGE |
| Language modelling | perplexity |

**Where you'll meet it in real work:** a hospital pulling drug names and doses out of doctors' notes (NER); a bank chatbot detecting the intent "block my card" and the slot "card ending 4321"; a newsroom generating short summaries of long stories.

**Common mistakes:**
- Using accuracy for NER (most tokens are "O", so a model that tags everything "O" scores high).
- Treating BLEU or ROUGE as the whole truth. They measure overlap, not whether the text is correct or good.

**Exam angle:** pair each task with its input/output shape and its metric: NER → BIO tags and entity-level F1; translation → BLEU; summarisation → ROUGE; extractive vs abstractive.

> **සිංහලෙන්:** NLP වැඩ ගොඩක් තියෙන්නේ නැහැ, පොඩි ලැයිස්තුවක් විතරයි: classification, sentiment, NER, POS tagging, translation, summarization, question answering. NER කියන්නේ පත්තරයක නම්, ස්ථාන, ආයතන highlighter වලින් වෙන වෙනම පාටවලින් ලකුණු කරනවා වගේ වැඩක්. Extractive summary එක කියන්නේ A/L පොතේ වැදගත් වාක්‍ය highlight කරන එක, abstractive එක කියන්නේ පොත වහලා ඔයාගේම වචන වලින් සටහනක් ලියන එක. Model එක NER entities 8ක් හොයලා ඒකෙන් 6ක් හරි, සැබෑ entities 10ක් තිබුණා නම් precision = 6/8 = 0.75, recall = 6/10 = 0.6. Translation මනින්නේ BLEU වලින්, summarization මනින්නේ ROUGE වලින්.

---

## 15. Language models

**Why it exists:** if a machine can say which word is likely to come next, it can finish your sentence, spot typing mistakes, rank translations and, scaled up, write whole essays. A language model is the engine behind all of this.

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

### Worked example 1: the chain rule with numbers

Suppose a model gives: P(I) = 0.05, P(love | I) = 0.20, P(tea | I love) = 0.10 (made-up numbers).

P("I love tea") = 0.05 × 0.20 × 0.10 = **0.001**

Each extra word multiplies by a number below 1, so long sentences get tiny probabilities. That is why real systems add up **logs** instead of multiplying ([file 07](07-math-probability-statistics.md)).

### Worked example 2: smoothing

Training text has 100 occurrences of "cat" and the vocabulary has 1,000 words. "cat sat" appeared 20 times and "cat flew" **never**.
- Plain counting: P(flew | cat) = 0/100 = **0**. A single zero makes the whole sentence probability 0.
- Add-one (Laplace) smoothing: P(flew | cat) = (0 + 1) / (100 + 1,000) ≈ **0.0009**. Small, but not impossible.
- P(sat | cat) = (20 + 1) / (100 + 1,000) ≈ 0.019 (the smoothed value moves down a bit from 0.2 to make room for unseen pairs).

### Worked example 3: perplexity

If a model gives the correct next word a probability of 1/4 at every one of 4 positions, its average cross-entropy is ln 4 ≈ 1.386, so perplexity = e^1.386 = **4**. In words: the model is as unsure as if it were choosing among 4 equally likely words each time. A perfect model has perplexity 1.

**Where you'll meet it in real work:** phone keyboard suggestions, speech recognition choosing between "recognise speech" and "wreck a nice beach", and every LLM, which is a neural language model trained at huge scale.

**Common mistakes:**
- Thinking a lower perplexity always means a better chat assistant. It measures prediction of text, not helpfulness or truthfulness.
- Forgetting smoothing in n-gram models, so one unseen pair zeroes out a whole sentence.

**Exam angle:** an LLM is pretrained with the **next-token prediction** objective (self-supervised); lower perplexity is better; perplexity = e^(cross-entropy).

> **සිංහලෙන්:** Language model එකක් කරන්නේ ඊළඟට එන වචනය මොකක්ද කියලා probabilities වලින් අනුමාන කරන එක. "the cat sat on the" ට පස්සේ "mat" එන්න ඉඩ කොච්චරද කියලා ඒක ගණන් කරනවා. පරණ ක්‍රමයේදී ගණන් කරලා තමයි කළේ: "cat" 100 පාරක් ඇවිත්, "cat sat" 20 පාරක් ඇවිත් නම් P(sat | cat) = 20/100 = 0.2. කවදාවත් නොදැක්ක pair එකකට 0 ලැබෙන නිසා smoothing කරන්න ඕනේ. Perplexity එක කියන්නේ model එක වචන කීයක් අතරින්ද අනුමාන කරන්නේ කියන ගාණ වගේ දෙයක්, අඩු නම් හොඳයි. අද LLMs ඔක්කොම පුහුණු කරන්නේ මේ next-word prediction වැඩේ ලොකු scale එකකින්.

---

## 16. NLP libraries

**Why it exists:** you almost never write NLP from zero. Libraries give you tested tokenisers, taggers and pretrained models, so a task that once took a research team months can be a five-line script.

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

### Which library for what?

| Situation | Reach for |
|---|---|
| Learning the basic ideas, classic algorithms | NLTK (the school science lab: every instrument is there) |
| Fast, tidy pipeline: tokens, POS, NER, lemmas | spaCy (a factory assembly line) |
| Word2Vec, FastText, topic models | Gensim |
| TF-IDF and classic classifiers | scikit-learn |
| Pretrained Transformers, datasets, fine-tuning | Hugging Face (a huge library of other chefs' recipes) |
| Sentence embeddings for search / RAG | sentence-transformers |

### Worked example: a hotel with 5,000 reviews

Imagine a hotel has 5,000 reviews. A Hugging Face sentiment pipeline sorts them in a few minutes. Suppose the result is 3,600 positive and 1,400 negative.
- positive share = 3,600 / 5,000 = **72%**
- negative share = 1,400 / 5,000 = **28%**

Then spaCy pulls out the nouns from only the negative reviews and counts them. Imagine "Wi-Fi" appears 410 times and "parking" 260 times. The manager now knows what to fix first. (These counts are invented for illustration.)

**Where you'll meet it in real work:** almost any text project starts by `pip install`-ing one of these libraries and trying a pretrained pipeline as a first baseline.

**Common mistakes:**
- Calling `pipeline("sentiment-analysis")` without a model name in real work. The default can change between versions; name the model you want.
- Forgetting that the first call downloads the model (hundreds of MB) and needs internet.
- Trusting a pipeline score like 0.9998 as the "truth". It is the model's confidence, not proof.
- Skipping the model card, which tells you the training data and limits.

**Exam angle:** know what each library is for, that Hugging Face hosts models and datasets (the Hub), and that a `pipeline` wraps tokeniser + model + post-processing.

> **සිංහලෙන්:** NLP වැඩ ගොඩක් අපි මුල ඉඳන්ම ලියන්නේ නෑ, libraries පාවිච්චි කරනවා. NLTK කියන්නේ ඉගෙන ගන්න හොඳ පාසලේ විද්‍යාගාරය වගේ එකක්. spaCy කියන්නේ වේගවත්, production වලට හොඳ කර්මාන්තශාලාවක assembly line එකක් වගේ. Hugging Face කියන්නේ pretrained models සහ datasets ලක්ෂ ගණනක් තියෙන ලොකු library එකක්, pipeline() එකෙන් පේළි කීපයකින් sentiment, translation, NER කරන්න පුළුවන්. හිතන්න හෝටලයකට reviews 5,000ක් තියෙනවා, pipeline එකෙන් positive 3,600ක් (72%) සහ negative 1,400ක් (28%) හොයාගත්තා. ඊට පස්සේ spaCy වලින් negative reviews වල නිතර එන වචන බලලා මොනවා හදන්නද කියලා තීරණය කරන්න පුළුවන්.

---

## 17. Low-resource languages

**Why it matters:** the AI tools you use were built mostly from English text. If you are learning AI in Sri Lanka, you will meet this problem directly: the same tool can be excellent in English and clumsy in Sinhala. Knowing the reasons helps you pick fixes.

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

### Worked example: the token tax

An English-focused tokeniser might turn "I am going home" into about 4 tokens, while the Sinhala sentence with the same meaning could become 10 or more tokens (the exact numbers depend on the tokeniser; this is illustrative). Each Sinhala character takes 3 bytes in UTF-8, and tokenisers that have not seen much Sinhala fall back to byte-sized pieces.

Say the English sentence costs 4 tokens and the Sinhala one 12:
- cost ratio = 12 / 4 = **3×** the price on an API that charges per token
- a context window of 8,000 tokens holds 8,000 / 4 = **2,000** such English sentences but only 8,000 / 12 ≈ **667** Sinhala ones

**More challenges, in plain English**

| Challenge | What it means |
|---|---|
| Morphology | One root creates many forms, like "gedara, gedarata, gedarin, gedaraadi" for "house", "to the house", "from the house". English uses separate words; Sinhala glues the meaning onto the word. The vocabulary grows and stemming gets hard. |
| Diglossia | Written Sinhala and spoken Sinhala differ a lot, so a model trained on formal text may struggle with chat messages. |
| Code-mixing / Singlish | "mama heta office yanawa", or a Sinhala sentence with English words inside. One sentence, three styles. |
| Old fonts | Many older websites used non-Unicode fonts (such as FM Abhaya), so the text on screen looks fine but the computer stores meaningless codes. |
| Missing labels | Few labelled datasets for NER, sentiment or QA. |

**Analogy:** English NLP is like shopping at a supermarket with labelled shelves. Sinhala NLP is like shopping at the village fair: the goods are all there, but nothing is labelled, each seller uses different names, and some switch languages in the middle of a sentence. It simply needs more effort.

**Where you'll meet it in real work:** a Sri Lankan bank or telecom adding a Sinhala chatbot, a news site building Sinhala search, or a government service summarising citizen complaints in Sinhala and Tamil.

**Common mistakes:**
- Assuming an English benchmark score predicts Sinhala quality. Test on real Sinhala data.
- Throwing away non-English letters during cleaning (see section 3).
- Ignoring the token-cost difference when estimating the budget of an LLM project.

**Exam angle:** know why non-English text costs more tokens, and that **cross-lingual transfer** with **multilingual models** (mBERT, XLM-RoBERTa) is the standard answer for languages with little data.

> **සිංහලෙන්:** ඉංග්‍රීසි වලට internet එකේ text බිලියන ගණනක් තියෙනවා, සිංහලට ඒක ගොඩක් අඩුයි, ඒ නිසා සිංහල කියන්නේ low-resource භාෂාවක්. ප්‍රශ්න ගොඩක් තියෙනවා: එක මූල වචනයකින් වචන ස්වරූප ගොඩක් හැදෙනවා, ලියන සිංහල සහ කතා කරන සිංහල වෙනස්, "mama heta office yanawa" වගේ Singlish සහ code-mixing තියෙනවා, සමහර පරණ website වල Unicode නොවන fonts තියෙනවා. තව දෙයක් තමයි tokens. ඉංග්‍රීසි වාක්‍යයක් tokens 4ක් නම් එකම තේරුමේ සිංහල වාක්‍යය tokens 12ක් වෙන්න පුළුවන්, ඒ කියන්නේ API bill එක 3 ගුණයක්, context window එකේ ඉඩත් 3න් එකයි. විසඳුම් විදිහට multilingual models (XLM-R වගේ), FastText වගේ subword ක්‍රම, සහ ඇත්ත සිංහල data වලින් fine-tune කිරීම පාවිච්චි කරනවා.

```quiz
[{"q": "A document-term matrix built with Bag of Words ignores which property of the text?", "options": ["The words that appear", "How many times each word appears", "The order of the words", "The size of the vocabulary"], "answer": 2, "why": "BoW only counts words, so \"dog bites man\" and \"man bites dog\" give the same vector. It still keeps the counts (that is the whole point), which is the tempting wrong answer."}, {"q": "There are N = 1,000 documents. A word appears in 10 of them and 5 times in a 100-word document. Using log base 10, what is its TF-IDF in that document?", "options": ["0.05", "0.10", "2.0", "0.5"], "answer": 1, "why": "TF = 5/100 = 0.05. IDF = log10(1000/10) = log10(100) = 2. TF-IDF = 0.05 x 2 = 0.10. 0.05 is only the TF, and 2.0 is only the IDF."}, {"q": "Which pair gives the lemma of \"studies\" and the stem produced by the Porter stemmer?", "options": ["study and studi", "studi and study", "study and study", "studie and studi"], "answer": 0, "why": "Lemmatisation uses a dictionary and returns the real word \"study\". The Porter stemmer chops the ending by rules and gives the non-word \"studi\". The second option swaps the two methods."}, {"q": "Which word-embedding method can build a vector for a word it never saw during training, such as a typo?", "options": ["Word2Vec (skip-gram)", "GloVe", "FastText", "One-hot encoding"], "answer": 2, "why": "FastText represents a word as a bag of character n-grams, so an unseen word still shares pieces with known words. Word2Vec and GloVe have one fixed vector per known word only."}, {"q": "In Word2Vec, what does the skip-gram variant do?", "options": ["Predicts the centre word from its surrounding words", "Predicts the surrounding words from the centre word", "Counts how often words co-occur across the whole corpus", "Predicts the next sentence"], "answer": 1, "why": "Skip-gram goes centre word -> neighbours. CBOW is the reverse (neighbours -> centre), which is the tempting wrong answer. Counting global co-occurrences is GloVe."}, {"q": "\"I deposited money at the bank\" and \"We sat on the river bank\" must give different vectors for \"bank\". Which kind of embedding does this?", "options": ["Static embeddings such as GloVe", "One-hot vectors", "TF-IDF vectors", "Contextual embeddings such as BERT"], "answer": 3, "why": "Contextual embeddings compute a word's vector from the whole sentence. Static embeddings give \"bank\" one fixed vector in every sentence."}, {"q": "A model finds 8 entities in a text that really contains 10 entities. 6 of the 8 are correct. What are precision and recall?", "options": ["Precision 0.75, recall 0.60", "Precision 0.60, recall 0.75", "Precision 0.75, recall 0.75", "Precision 0.80, recall 0.60"], "answer": 0, "why": "Precision = correct / predicted = 6/8 = 0.75. Recall = correct / real = 6/10 = 0.60. The second option swaps the two."}, {"q": "Your sentiment model must separate \"good\" from \"not good\". Which of these is the BEST classic choice?", "options": ["Remove all stopwords first", "Use unigram counts only", "Add bigrams to the features", "Lemmatise every word"], "answer": 2, "why": "Bigrams contain the phrase \"not good\". Removing stopwords would usually delete \"not\", and unigrams cannot see word order."}]
```

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

**Q12.** A sentence has 7 tokens. How many bigrams and trigrams does it contain?
<details><summary>Answer</summary>t − n + 1: bigrams = 7 − 2 + 1 = **6**; trigrams = 7 − 3 + 1 = **5**.</details>

**Q13.** Why do English-focused tokenisers make Sinhala text more expensive to process with an LLM API?
<details><summary>Answer</summary>They have seen little Sinhala, so each sentence is split into many more small (even byte-level) tokens. The API charges per token and the context window holds fewer sentences.</details>

**Q14.** Docs 1 and 2 in a Bag of Words table have a dot product of 3, and vector lengths √3 and √5. What is their cosine similarity?
<details><summary>Answer</summary>3 / (√3 × √5) = 3 / 3.873 ≈ **0.775**.</details>

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
| Token tax | Extra tokens (and cost) a language needs because the tokeniser saw little of it |
| Add-one (Laplace) smoothing | Adding 1 to every count so unseen n-grams get a small non-zero probability |
| Entity-level F1 | F1 computed on whole entities rather than single tokens |
| Corpus | The large body of text used to train or study a model |

**Next:** [19-transformers.md](19-transformers.md)
