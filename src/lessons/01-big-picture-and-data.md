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

**Why it exists:** a computer is extremely fast but has no common sense. It cannot work out what you "meant". A program is how we turn a goal ("tell me if this number is even") into steps so exact that a machine with zero common sense can carry them out.

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

**Worked example (trace the even/odd program by hand):**

| Step | N = 7 | N = 10 |
|---|---|---|
| 1. Take a number N | N = 7 | N = 10 |
| 2. Divide N by 2 | 7 ÷ 2 = 3 remainder **1** | 10 ÷ 2 = 5 remainder **0** |
| 3. Is the remainder 0? | No, 1 is not 0 | Yes |
| 4. Say | "odd" | "even" |

Tracing a program by hand like this (writing the values at every step) is the best way to find mistakes. Programmers do it all the time.

**A text picture of every program:**

```
 Input  ───►  [ Steps the programmer wrote ]  ───►  Output
 (7)                                                ("odd")
```

**Where you'll meet it in real work:** the "Pay Bill" button in your bank app is a program. It reads the amount you typed (input), checks your balance, subtracts the money (steps), and shows "Payment successful" (output).

**Common mistakes:**
- Thinking the computer "understands" what you want. It only follows the steps you wrote, even wrong ones.
- Skipping a step that feels obvious to a human (like "what if N is not a whole number?"). The computer will not skip it for you.

> **සිංහලෙන්:** Program එකක් කියන්නේ computer එකට දෙන හරියටම ලියපු උපදෙස් ලැයිස්තුවක්. අම්මා රෙසිපියක් බලලා බත් උයනවා වගේ, computer එක ඒ steps එකින් එක, පිළිවෙළට කරනවා. හැබැයි මිනිහෙක් වගේ "ලුණු ටිකක්" කියලා අනුමාන කරන්න computer එකට බෑ, හැම දෙයක්ම හරියටම කියන්න ඕනේ. උදාහරණයක් විදිහට, අංක 7ක් දුන්නොත් 2න් බෙදද්දී ඉතිරිය 1 නිසා "odd" කියලා program එක උත්තර දෙනවා. Bank app එකේ "Pay Bill" button එකත් ඔය වගේ program එකක්.

---

## 2. What is an algorithm?

**Why it exists:** before you write any code you need a clear plan for solving the problem. An algorithm is that plan. The same problem can have a slow plan and a fast plan, and picking the fast one is what makes software usable.

**Idea:** An **algorithm** is a step-by-step method for solving a problem. A program is an algorithm written in a programming language.

**Analogy:** "How to find a word in a dictionary" is an algorithm: open the book near the middle; if your word comes earlier alphabetically, look in the left half, otherwise the right half; repeat. That's a clever method (it's called *binary search*) that finds any word among 100,000 in about 17 steps.

You'll hear "algorithm" everywhere in AI: "the Random Forest algorithm", "the gradient descent algorithm". It always just means *a well-defined recipe for doing something*.

**Worked example (guess the number, the smart way):** I think of a number from 1 to 100. You can guess 1, then 2, then 3... that could take 100 guesses. Or you can always guess the middle and ask "higher or lower?":

| Guess | Range left | I say |
|---|---|---|
| 50 | 1 to 100 | higher |
| 75 | 51 to 100 | lower |
| 62 | 51 to 74 | higher |
| 68 | 63 to 74 | lower |
| 65 | 63 to 67 | ... |

Each guess throws away half of the possibilities, so even 100 numbers need at most 7 guesses (because 2⁷ = 128 is more than 100). This halving idea is called binary search, and the same idea shows up again in [file 02, section 23](02-python-programming.md#23-algorithm-speed-big-o-notation).

**Algorithm vs program vs model:**

| Word | What it is | Example |
|---|---|---|
| Algorithm | the idea / recipe | "halve the range each time" |
| Program | the recipe written in a programming language | the Python file that does it |
| Model | (ML only) the rules the computer found by itself | covered in section 6 |

**Where you'll meet it in real work:** when a bank app finds your name among millions of customers in a fraction of a second, an efficient search algorithm is doing it. A slow algorithm would make the app freeze.

**Common mistake:** thinking "algorithm" means something mysterious that only AI uses. A recipe for making tea is an algorithm too.

> **සිංහලෙන්:** Algorithm එකක් කියන්නේ ප්‍රශ්නයක් විසඳන්න තියෙන පියවරෙන් පියවර ක්‍රමයක්, අපේ කෑම රෙසිපියක් වගේ. Program එක කියන්නේ ඒ ක්‍රමයම Python වගේ භාෂාවකින් ලියපු එක. 1ත් 100ත් අතර අංකයක් අනුමාන කරන්න 1, 2, 3 කියලා යනවා වෙනුවට හැමවිටම මැද අංකය අහනවා නම්, හැම පාරකම හැකියාවන් භාගයක් අයින් වෙනවා. ඒ නිසා උපරිම පාර 7ක් ඇති. හොඳ algorithm එකක් කියන්නේ වේගවත් ක්‍රමයක්.

---

## 3. Traditional programming vs Machine Learning

**Why it exists:** some problems are impossible to solve by writing rules. Nobody can write down, rule by rule, how to recognise a face or tell if a voice message sounds angry. Machine Learning (ML) exists for exactly these problems: instead of describing the answer, we show the computer examples of it.

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

**Worked example (loan approval, both ways):**

*Traditional programming:* the bank writes "if salary is over Rs. 100,000 and no unpaid loans, approve". This is easy to write and explain. But what about a customer with Rs. 90,000 salary who has never missed a payment in 10 years? The rule rejects them. You would need hundreds of extra rules, and they would still be wrong for some people.

*Machine Learning:* give the computer 50,000 past loans. For each one we know the salary, age, existing debts (the inputs) and whether the person repaid (the answer). The computer finds the pattern, for example "people with steady jobs for 5+ years and low debts almost always repay, even with a lower salary". No human wrote that rule.

```
Traditional:   Rules (human)   + Data     ──►  Answers
Machine Learning: Data         + Answers  ──►  Rules (the model)
```

**Where you'll meet it in real work:** Daraz and Uber-style recommendation lists, bank fraud alerts, and every spam filter all use the ML way.

**Common mistakes:**
- Using ML when a simple rule is enough. To calculate VAT at 18%, just multiply. ML would be slower, less exact and pointless.
- Thinking ML works without data. No examples means no learning.
- Thinking an ML answer is always right. It is a good guess based on patterns, not a guarantee.

**Exam angle:** NCA-GENL-style questions often ask you to pick the situation where ML is appropriate (many examples, patterns too complex for rules, patterns that change) versus where plain rules are better (exact, fixed, explainable logic).

> **සිංහලෙන්:** සාමාන්‍ය programming වලදී අපි rules ලියනවා. Machine Learning වලදී අපි examples සහ හරි උත්තර දෙනවා, computer එක තනියම rules හොයාගන්නවා. බැංකුවක loan approve කරන්න "පඩිය රු. 100,000ට වැඩි නම්" කියලා rule ලිව්වොත්, අවුරුදු 10ක් එක දිගටම ගෙවපු රු. 90,000 පඩියක් තියෙන කෙනාව reject වෙනවා. පරණ loan 50,000ක් දුන්නොත් model එක තනියම "ස්ථිර රස්සාවක් තියෙන, ණය අඩු අයට ගෙවන ගාණ වැඩියි" වගේ pattern හොයාගන්නවා. හැබැයි VAT 18% ගණනය කරන්න වගේ පැහැදිලි දේකට ML ඕනේ නෑ, සරල rule එක ඇති.

---

## 4. The family tree: AI, ML, DL, GenAI, LLMs

**Why it exists:** news and ads throw "AI", "ML", "Deep Learning" and "GenAI" around as if they mean the same thing. They don't. Knowing which circle is inside which lets you read job ads, papers and exam questions without getting confused.

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

**A simple way to remember it (a set of Russian dolls, or a Sri Lankan nesting set of rice pots):**

| Layer | One-line meaning | Everyday example |
|---|---|---|
| AI | any machine doing "smart" things | a hand-written chess program |
| ML | AI that learns from examples | spam filter trained on 100,000 emails |
| Deep Learning | ML using many-layered neural networks | face unlock on your phone |
| Generative AI | deep learning that creates content | an image generator |
| LLM | generative AI for text | ChatGPT, Claude |

**Worked example (sorting real products into circles):**
1. A calculator app: not AI. It follows fixed arithmetic.
2. A 1997 chess program with hand-written rules: AI, but not ML (nothing is learned).
3. A bank's fraud model learned from past transactions: ML, but not deep learning if it is a simple model.
4. Google Translate using a big neural network: deep learning.
5. A chatbot that writes a new email for you: generative AI, and since it works with text, an LLM.

Every LLM is generative AI, every generative AI is deep learning, and so on up the chain. The reverse is false: not every AI is ML.

**Where you'll meet it in real work:** job ads say "ML Engineer" or "AI Engineer", and managers often say "AI" when they really mean "an ML model". Clarify early what is being built.

**Common mistakes:**
- Saying "AI and ML are the same". ML is one part of AI.
- Thinking all deep learning is generative. A neural network that only says "cat or dog" is deep learning but not generative.
- Thinking an LLM understands like a human. It predicts likely next words from patterns in text.

**Exam angle:** expect "which is a subset of which" questions and "which of these is generative vs discriminative". Discriminative decides (spam or not), generative creates (writes a new email).

> **සිංහලෙන්:** AI, ML, Deep Learning, GenAI, LLM කියන්නේ එකක් නෙවෙයි, එකක් ඇතුළේ එකක් දාන බඳුන් සෙට් එකක් වගේ. AI කියන්නේ "ස්මාර්ට්" වැඩ කරන ඕනෑම පද්ධතියක්, ML කියන්නේ ඒකෙන් example වලින් ඉගෙන ගන්න කොටස. Deep Learning කියන්නේ ඒකෙන් neural networks පාවිච්චි කරන කොටස, GenAI කියන්නේ අලුත් දේවල් හදන කොටස, LLM කියන්නේ ඒකෙන් අකුරු සහ වචන හදන එක. Calculator එක AI නෙවෙයි, 1997 chess program එක AI ඒත් ML නෙවෙයි, ChatGPT වගේ එකක් LLM එකක්. ඒ නිසා හැම LLM එකක්ම AI, ඒත් හැම AI එකක්ම LLM නෙවෙයි.

---

## 5. What is Data Science?

**Why it exists:** businesses collect huge amounts of data but data on its own helps nobody. Data Science is the craft of turning that raw data into answers and decisions.

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

**Worked example (a Keells-style supermarket question):** the manager asks "Why did ice cream sales drop last month?"
1. **Collect:** get daily sales for the last 12 months (365 rows).
2. **Clean:** remove 3 days with a broken till that recorded Rs. 0.
3. **Explore:** the average daily sale was Rs. 80,000, but last month it was Rs. 56,000. That is a drop of (80,000 − 56,000) ÷ 80,000 = 24,000 ÷ 80,000 = **30%**.
4. **Look for a reason:** the drop lines up with 12 days of heavy rain.
5. **Communicate:** show a simple chart and say "sales fall about 30% in rainy periods, so order less stock then".

No ML model was needed at all. That is still data science.

**Data scientist vs ML engineer:**

| Data Scientist | ML Engineer |
|---|---|
| asks questions, analyses, explains | builds and runs models in real systems |
| charts, statistics, reports | code, servers, monitoring |

**Where you'll meet it in real work:** telecom companies analyse call data to see which customers might leave, hospitals look at appointment data to cut waiting times.

**Common mistake:** jumping straight to a fancy model before even looking at the data. A simple chart often answers the question.

> **සිංහලෙන්:** Data Science කියන්නේ data වලින් ප්‍රශ්න වලට උත්තර හොයලා හොඳ තීරණ ගන්න එක. Statistics, programming සහ ඒ ක්ෂේත්‍රය ගැන දැනුම එකට එකතු වෙනවා. උදාහරණයක් විදිහට සුපිරි වෙළඳසැලක ice cream විකිණීම රු. 80,000 ඉඳන් රු. 56,000ට අඩු වුණා කියමු, ඒක 30% පහළ යාමක්. දවස් 12ක් වැස්ස තිබුණා කියලා හොයාගත්තාම "වැස්සට ice cream විකිණීම අඩුයි, ඒ නිසා stock අඩුවෙන් ගන්න" කියලා manager ට කියන්න පුළුවන්. මේකට ML model එකක්වත් ඕනේ වුණේ නෑ.

---

## 6. What is a model?

**Why it exists:** the real world is too messy to copy exactly. A model keeps only the parts that matter for the question and throws the rest away, so we can make quick, useful predictions.

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

**Worked example (the simplest model of all, one straight line):** suppose a three-wheeler fare in your town is Rs. 100 to start plus Rs. 80 per km. The model is:

```
price = 100 + 80 × km
```

| km | Calculation | Predicted price |
|---|---|---|
| 2 | 100 + 80 × 2 = 100 + 160 | Rs. 260 |
| 5 | 100 + 80 × 5 = 100 + 400 | Rs. 500 |
| 10 | 100 + 80 × 10 = 100 + 800 | Rs. 900 |

It ignores traffic, waiting time and the driver's mood. So it is wrong a little, but useful. In ML, the numbers 100 and 80 (called **parameters**) are not typed by a person. The computer finds them from many past trips.

**Training vs inference, with numbers:** training = looking at 10,000 past trips to find "100" and "80" (slow, done once). Inference = a new customer asks about 7 km and the model answers 100 + 80 × 7 = Rs. 660 (instant, done again and again).

**Where you'll meet it in real work:** the "estimated fare" in a ride app, the credit score in a bank, the next word in a chatbot are all outputs of models.

**Common mistakes:**
- Thinking a model is a database of stored answers. It stores learned numbers (parameters), not the original examples.
- Training on data and then testing on the same data. Of course it looks good; it has seen the answers (see [file 11](11-ml-fundamentals.md#10-train-validation-test-splits)).

**Exam angle:** know the difference between **training** (learn parameters from labelled data) and **inference** (use the trained model on new input). Exams like to ask which phase costs more compute or which one runs in production.

> **සිංහලෙන්:** Model එකක් කියන්නේ ලෝකයේ තත්ත්වයක් සරල කරලා පෙන්වන, අනාවැකි කියන්න පුළුවන් දෙයක්. උදාහරණයක් විදිහට tuk-tuk එකක ගාස්තුව "රු. 100 + කිලෝමීටරයකට රු. 80" කියමු. 7 km යන්න ඕනේ නම් 100 + 80×7 = රු. 660 කියලා model එක කියනවා. ඇත්තටම ගාස්තුවට traffic වගේ දේවලුත් බලපානවා, ඒ නිසා model එක ටිකක් වැරදෙනවා, ඒත් ප්‍රයෝජනවත්. ML එකේදී 100 සහ 80 කියන අංක (parameters) අපි ලියන්නේ නෑ, පරණ trips 10,000ක් බලලා computer එක හොයාගන්නවා. ඒකට training කියනවා, අලුත් trip එකකට උත්තර දෙන එකට inference කියනවා.

---

## 7. What is data?

**Why it exists:** a model can only learn what its data shows it. So before anything else, we need to be clear about what counts as data and what makes it good or bad.

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

**Worked example (one customer, many pieces of data):** think of one Daraz order. It produces:
- numbers: price Rs. 2,500, quantity 2
- text: the buyer's review "Good quality, fast delivery"
- a date and time: 2026-11-03, 14:35
- a category: delivery city = Kandy
- an image: the photo of the item

One order, five kinds of data. Together, many such orders make a dataset.

**"Garbage in, garbage out" with numbers:** you want to predict house prices. Suppose 1 in 10 rows has the price typed in thousands instead of lakhs (a data entry mistake), so a Rs. 30 lakh house shows as Rs. 3,000. The model will learn from those wrong rows and its predictions will be off, no matter how clever the algorithm.

**Good data is:**

| Property | Meaning | Example of breaking it |
|---|---|---|
| Correct | the values are true | a salary typed with an extra zero |
| Complete | not many gaps | 40% of ages are missing |
| Representative | looks like the real situation | training only on Colombo customers but using the model in Jaffna |
| Enough | sufficient examples | learning "fraud" from 3 fraud cases |

**Where you'll meet it in real work:** data scientists commonly spend a large share of their time finding, cleaning and checking data rather than building models.

**Common mistake:** assuming more data is always better. 1 million wrong rows are worse than 10,000 correct ones.

> **සිංහලෙන්:** Data කියන්නේ සටහන් කරලා තියෙන තොරතුරු: අංක, වචන, දින, පින්තූර, හඬ ඕනෑම දෙයක්. Daraz order එකක් ගත්තොත් මිල, ගණන, review එක, දිනය, නගරය, අයිතමයේ ෆොටෝව කියන data වර්ග ගොඩක් එකට තියෙනවා. Model එක ඉගෙන ගන්නේ data වලින් විතරයි, ඒ නිසා data වැරදි නම් model එකත් වැරදියි. ඒකට තමයි "Garbage in, garbage out" කියන්නේ. උදාහරණයක් විදිහට ගෙවල් මිලක් ලක්ෂ 30 වෙනුවට 3,000 කියලා වැරදියට ගහලා තිබුණොත්, හොඳම algorithm එකක් පාවිච්චි කළත් අනාවැකි වැරදි වෙනවා.

---

## 8. Kinds of data

**Why it exists:** the way data is organised decides what tools can handle it and how easy the job is. A tidy table works with a spreadsheet; a pile of voice recordings needs very different tools.

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

**A side-by-side look at one customer in all three forms:**

| Form | What it looks like | Example |
|---|---|---|
| Structured | a row in a table | `3, John, 45, Galle, 2100.00` |
| Semi-structured | tagged, flexible fields | `{"name": "John", "age": 45, "hobbies": ["cricket"]}` |
| Unstructured | free-form | the voicemail John left the helpline |

**Worked example (a bank's data):**
- Account balances and transactions: **structured** (rows and columns in a database).
- The JSON returned when the mobile app asks for your recent payments: **semi-structured**.
- Scanned loan forms (photos), emails to customer service, call recordings: **unstructured**.

If the bank wants to count how many Rs. 5,000+ transactions happened yesterday, a simple table query does it in a second. If it wants to know "what are customers complaining about?", it must read thousands of emails, which needs NLP or an LLM ([file 18](18-nlp-fundamentals.md)).

**Where you'll meet it in real work:** LLM and RAG projects are mostly about turning **unstructured** documents (PDFs, manuals, emails) into something a model can search and use.

**Common mistake:** assuming JSON is unstructured. It has labels and nesting, so it is semi-structured.

> **සිංහලෙන්:** Data ආකාර තුනක් තියෙනවා. Structured කියන්නේ Excel වගේ පේළි සහ තීරු තියෙන වගුව, ඒ නිසා හොයන්න ලේසියි. Unstructured කියන්නේ email, ෆොටෝ, voice recordings වගේ කිසි ආකෘතියක් නැති data, ලෝකයේ data වලින් ගොඩක් මේ වර්ගයේ. Semi-structured කියන්නේ JSON වගේ, tags තියෙනවා ඒත් හැම කෙනාටම එකම තීරු ගාණක් නැති ඒවා. බැංකුවක ගිණුම් ශේෂ structured, app එකෙන් එන payments JSON semi-structured, ඒත් customer ලා දාන email සහ call recordings unstructured.

---

## 9. Data types

**Why it exists:** you can't average a city name or add two colours together. The type of a column tells you which maths and which tools make sense, and which encoding the model will need.

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

**A decision guide:**

```
Is it a number you can do maths on?
 ├─ Yes → Does it have decimals / any value in a range?  → Continuous (height, price)
 │        Or is it a whole-number count?                  → Discrete (children, items)
 └─ No  → Is it a label?
          ├─ Two values only?                → Binary (yes/no)
          ├─ Natural order (S < M < L)?      → Ordinal
          └─ No order (Colombo, Kandy)?      → Nominal
```

**Worked example (classify a real survey row):**

| Column | Value | Type | Why |
|---|---|---|---|
| age | 29 | discrete numerical | whole count of years |
| monthly_income | Rs. 85,500.50 | continuous numerical | can have decimals |
| district | Matara | nominal | no order among districts |
| education | A/L | ordinal | O/L < A/L < Degree has an order |
| owns_vehicle | yes | binary | two values |
| phone_number | 0771234567 | nominal (not numerical!) | digits, but averaging phone numbers is meaningless |

**Why encoding matters (a tiny preview):** if you turn the districts Colombo=1, Kandy=2, Galle=3 and give these numbers to a model, it may think Galle (3) is "three times" Colombo (1) or that Kandy is "between" them. For nominal data we use other tricks such as one-hot encoding ([file 10](10-data-science-workflow.md)).

**Where you'll meet it in real work:** the first thing a data scientist does with a new CSV file is check each column's type, because pandas often reads numbers as text.

**Common mistakes:**
- Treating ID numbers, postcodes and phone numbers as numbers.
- Treating ordinal data as if the gaps are equal. The gap between "bad" and "okay" may not equal the gap between "good" and "excellent".

> **සිංහලෙන්:** Data වර්ග දැනගන්න ඕනේ, මොකද ඒකෙන් තමයි ඒ data වලින් මොනවා කරන්න පුළුවන්ද කියලා තීරණය වෙන්නේ. උස, මිල වගේ දශම තියෙන ඒවා continuous, දරුවන් ගණන වගේ පූර්ණ සංඛ්‍යා discrete. දිස්ත්‍රික්කය (Matara, Galle) වගේ පිළිවෙළක් නැති ඒවා nominal, O/L < A/L < Degree වගේ පිළිවෙළක් තියෙන ඒවා ordinal, ඔව්/නැහැ වගේ දෙකක් විතරක් binary. Phone number එක ඉලක්කම් වුණාට ඒවායේ සාමාන්‍යය ගන්න බෑ, ඒ නිසා ඒක අංකයක් නෙවෙයි, category එකක්.

---

## 10. Tables: rows, columns, features, labels

**Why it exists:** every ML file uses the same few words (row, column, feature, label). If you mix them up, everything after this is confusing. Two minutes spent here saves hours later.

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

**Same ideas, many names (a cheat sheet):**

| Our word | Other names you will meet |
|---|---|
| Row | sample, record, observation, instance, example |
| Column | variable, attribute, field |
| Feature (X) | input, predictor, independent variable |
| Label (y) | target, output, dependent variable, ground truth |

**Worked example (predict a phone's resale price):**

| brand | age_years | battery_health_% | resale_price_Rs. |
|---|---|---|---|
| A | 1 | 95 | 90,000 |
| B | 2 | 85 | 60,000 |
| A | 3 | 70 | 45,000 |

- Features X: `brand`, `age_years`, `battery_health_%` (3 columns).
- Label y: `resale_price_Rs.` (1 column).
- Shape of the whole table: (3, 4). Shape of X: (3, 3). Shape of y: (3,).
- The model learns "given X, predict y". If you add a new phone (brand A, 2 years, 90%), the model predicts a price. That row has no label yet.

**Sort out the roles in one more example:** a hospital wants to predict whether a patient will miss an appointment. Features: age, distance from the clinic, whether a reminder SMS was sent. Label: `missed` (yes/no). A column such as `patient_id` is just an identifier; it is usually dropped because it does not describe anything about the patient.

**Where you'll meet it in real work:** in scikit-learn, you write `model.fit(X, y)` ([file 11](11-ml-fundamentals.md#16-scikit-learn)). Knowing which column is X and which is y is the first line of every ML program.

**Common mistakes:**
- Including the label (or something that reveals it, like "refund_issued" when predicting "returned_item") as a feature. This is called **leakage**, and it makes the model look great in tests but fail in real life.
- Mixing up the shape: `(rows, columns)`, not `(columns, rows)`.

**Exam angle:** exams commonly give a small table and ask "which is the feature and which is the label?", or ask the difference between labelled and unlabelled data (which decides supervised vs unsupervised learning).

> **සිංහලෙන්:** වගුවක පේළියක් කියන්නේ එක් උදාහරණයක් (එක් ෆෝන් එකක්), තීරුවක් කියන්නේ ඒ සැමටම මැනපු එක් ගුණාංගයක්. Model එකට දෙන input තීරු වලට features (X) කියනවා, අපි අනාවැකි කියන්න ඕනේ තීරුවට label (y) කියනවා. ෆෝන් එකක resale මිල හොයනවා නම්, brand, අවුරුදු ගණන, battery health කියන ඒවා features, මිල label එක. වගුවේ පේළි 3ක් සහ තීරු 4ක් තියෙනවා නම් shape එක (3, 4), X එකේ shape එක (3, 3). Label එකම feature එකක් විදිහට දැම්මොත් ඒක leakage, test වලදී අමුතු විදිහට හොඳට පෙනුනට ඇත්ත ලෝකයේදී වැඩ කරන්නේ නෑ.

---

## 11. How computers store data: bits and bytes

**Why it exists:** a computer chip is built from billions of tiny switches that are either off or on. Bits and bytes are how everything (text, photos, songs, even a 7-billion-number AI model) is squeezed into those switches. They also explain why AI models need so much memory.

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

**Worked example (how many values can n bits hold?):**

| Bits | Calculation | Values |
|---|---|---|
| 1 | 2 | 2 |
| 2 | 2 × 2 | 4 |
| 3 | 2 × 2 × 2 | 8 |
| 4 | 2 × 2 × 2 × 2 | 16 |
| 8 | 2⁸ | 256 |

That is why INT4 (4 bits) can only represent 16 different values, while FP16 (16 bits) can represent 65,536 patterns. Fewer bits means smaller but rougher numbers.

**Worked example (model memory, step by step):** a model has 7 billion parameters.
- FP32: 7,000,000,000 × 4 bytes = 28,000,000,000 bytes = **28 GB**
- FP16: 7,000,000,000 × 2 bytes = 14,000,000,000 bytes = **14 GB**
- INT8: 7,000,000,000 × 1 byte = **7 GB**
- INT4: 7,000,000,000 × 0.5 byte = **3.5 GB**

A 70-billion-parameter model in FP16 would need 70,000,000,000 × 2 = 140 GB just for the weights, which is why big models need several GPUs. (These figures count only the weights. Running the model needs extra memory too.)

**Worked example (a photo's size):** a 1920 × 1080 photo has 1920 × 1080 = 2,073,600 pixels. Each pixel has 3 numbers (R, G, B), so 2,073,600 × 3 = 6,220,800 numbers. With one byte per number, that is about 6.2 MB uncompressed. JPEG makes it much smaller, which is why your phone photos are 2 to 5 MB.

**Worked example (text in different languages):** the English word "cat" is 3 characters = 3 bytes in UTF-8. A 3-letter Sinhala word takes about 3 × 3 = 9 bytes. This is one reason models can be slower or costlier on Sinhala text than on English text (it also affects tokenization, see [file 18](18-nlp-fundamentals.md)).

**Where you'll meet it in real work:** before you download a model to run on your laptop, you check its size: "7B model, 4-bit, about 4 GB, will it fit in my 16 GB RAM?" That is exactly this calculation.

**Common mistakes:**
- Mixing up bits and bytes: 1 byte = 8 bits. Internet speed is quoted in bits per second, file sizes in bytes. 100 Mbps is about 12.5 MB per second.
- Forgetting that 4-bit means half a byte, not 4 bytes.

**Exam angle:** quantization questions are common in the deployment domain: "What happens when you go from FP16 to INT8?" Answer: memory halves, speed often improves, with a small possible drop in accuracy.

> **සිංහලෙන්:** Computer එක ඇතුළේ හැමදෙයක්ම bits වලින් තියෙන්නේ, bit එකක් කියන්නේ 0 හෝ 1. Bits 8ක් එකතු වුණාම byte එකක්, ඒකෙන් අගයන් 256ක් තියාගන්න පුළුවන්. Model එකක parameters බිලියන 7ක් තියෙනවා නම්, එකක් FP16 (බයිට් 2) වලින් තිබුණොත් 7 බිලියන × 2 = 14 GB, INT4 (බයිට් 0.5) වලින් තිබුණොත් 3.5 GB. ඒ නිසා quantization කරන්නේ model එක පොඩි කරලා laptop එකේ දුවවන්න. Photo එකක් pixels ගොඩක්, හැම pixel එකකම අගයන් 3ක් (R, G, B) තියෙනවා, ඒ නිසා ලොකු photo එකක් අංක මිලියන ගණනක්.

---

## 12. Common file formats

**Why it exists:** data has to be saved somewhere and shared between programs and people. Each file format is a different trade-off between simplicity, size, speed and flexibility.

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

**Which format when? (a quick chooser):**

| Situation | Good choice | Why |
|---|---|---|
| Small table to share with a friend | CSV or Excel | opens anywhere |
| Data from a web API | JSON | tags + nesting |
| Training data for an LLM (one example per line) | JSONL | easy to stream line by line |
| 50 GB table for analysis | Parquet | small and fast |
| Customer records for an app | Database (SQL) | many users, searching, updating |
| Saved PyTorch weights | `.pt` / `.safetensors` | made for model weights |

**Worked example (why Parquet is faster):** a table has 10 columns and 1,000,000 rows, but you only need the `price` column. In CSV (row by row), the computer must read every row completely, all 10 columns, to pick out one. In Parquet (column by column), it reads only the `price` block, so it touches roughly one tenth of the data. The file is also compressed, so it is smaller on disk.

**Worked example (reading a JSON file):** in the `order` JSON above, `items` is an array of 2 objects. The total price is 3 × 0.5 + 1 × 2.0 = 1.5 + 2.0 = 3.5. The same idea works for any order, however many items it has. A flat CSV row could not hold a variable number of items so neatly.

**Where you'll meet it in real work:** almost every LLM API (OpenAI, Anthropic, and others) sends and receives JSON. Fine-tuning datasets are very often JSONL files. Safetensors is the common safe format for model weights shared on Hugging Face.

**Common mistakes:**
- Opening a big CSV in Excel and silently losing rows (Excel has a row limit of about 1 million) or having Excel change the format of columns such as dates or long IDs.
- Forgetting that CSV has no types: `00123` may be read as the number 123 and lose its leading zeros.
- Loading a `.pkl` (pickle) file from someone you don't trust. It can run harmful code when loaded; safetensors was created partly to avoid this.

> **සිංහලෙන්:** File format එකක් කියන්නේ data එක ගබඩා කරන ක්‍රමයක්. CSV කියන්නේ කොමා වලින් වෙන් කරපු සරල වගුවක්, ඕනෑම තැනක open කරන්න පුළුවන්. JSON කියන්නේ web API වලින් එන, නම් සහ අගයන් තියෙන, ඇතුළේ තවත් ඇතුළු කරන්න පුළුවන් format එක, LLM API වලත් පාවිච්චි වෙන්නේ ඒක. Parquet කියන්නේ තීරුවෙන් තීරුව ගබඩා කරන නිසා ලොකු වගු වලට වේගවත්. උදාහරණයක් විදිහට පේළි මිලියනයක තීරු 10ක වගුවකින් මිල විතරක් ඕනේ නම්, Parquet එකෙන් දහයෙන් එකක data විතරක් කියවනවා. CSV එකේ 00123 වගේ අංකයක මුල බිංදු නැති වෙන්න පුළුවන් බවත් මතක තියාගන්න.

---

## 13. Where AI is used today

**Why it exists:** seeing real uses helps you decide what you want to build. It also shows that most AI is quiet, behind-the-scenes prediction, not robots.

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

**Worked example (what does "predict" mean in each row?)**

| Field | The prediction being made | Data it learns from |
|---|---|---|
| Banking | "Is this card payment fraud?" | millions of past payments, labelled fraud/not fraud |
| Telecom | "Will this SIM stop being used next month?" | call minutes, top-ups, complaints |
| Healthcare | "Does this X-ray show pneumonia?" | thousands of X-rays labelled by doctors |
| Agriculture | "Is this tea leaf diseased?" | labelled leaf photos |
| Shopping | "What will this customer probably buy next?" | past purchases, clicks |

Notice that all five have the same shape: past examples with known answers go in, a model comes out, and the model answers for new cases.

**Sri Lankan examples to think about:** tea and rice yield forecasting, spotting dengue hot spots from hospital reports, translating Sinhala and Tamil, reading handwritten forms, and chatbots that answer questions about a telecom bill.

**What AI is not good at (be honest with yourself):** tasks with no data, tasks where a small mistake is dangerous and nobody checks (e.g. medicine decided by AI alone), and tasks that need exact guaranteed answers like payroll maths.

**Common mistake:** thinking every "smart" feature is deep learning or an LLM. A lot of it is a plain, simple model, and often that is the right choice.

> **සිංහලෙන්:** AI අද ගොඩක් තැන්වල පාවිච්චි වෙනවා, ඒවා ගොඩක් වෙලාවට පිටිපස්සේ නිහඬව කරන අනාවැකි කීම්. බැංකුවේ card payment එක fraud ද කියලා බලන්නේ පරණ payments මිලියන ගණනක් දැකපු model එකක්. Telecom එකක SIM එක ඊළඟ මාසේ පාවිච්චි නොකරයිද කියලා හොයන්නත්, වතුවල තේ කොළ රෝගී ද කියලා ෆොටෝවකින් අඳුරගන්නත්, ඩෙංගු හොට්ස්පොට් හොයන්නත් පාවිච්චි කරන්න පුළුවන්. හැබැයි data නැති තැන්වල, හෝ පොඩි වැරැද්දක් පවා භයානක තැන්වල (ඖෂධ තීරණය වගේ), මිනිස් පරීක්ෂාවක් නැතුව AI පාවිච්චි කරන්න එපා.

---

## 14. Jobs in this field

**Why it exists:** a field is easier to enter when you know which jobs exist and which skills each one needs. This table is a map, not a promise: roles overlap, and titles differ between companies.

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

**Worked example (picking a path):** suppose you enjoy charts and talking to business people and don't enjoy heavy maths: **Data Analyst** is a good first target (files 01 to 10). If you enjoy building apps and want to use LLMs: **AI Engineer** (files 18 to 29). If you enjoy servers and keeping things running: **MLOps / Data Engineer**.

**A typical learning path:**

```
Analyst → Data Scientist → ML Engineer → (specialise: LLMs, vision, MLOps, research)
```

You don't have to pick now. Everything in this course builds on the same base: Python, data, a bit of maths, and ML basics.

**Where you'll meet it in real work:** in Sri Lanka, entry roles are often "Data Analyst", "Junior Data Scientist" or "Software Engineer (AI)". Many people reach ML Engineer by first working as a software engineer or analyst.

**Common mistake:** thinking you need a PhD to start. Many roles need strong basics, a few real projects, and the ability to explain results clearly.

> **සිංහලෙන්:** මේ ක්ෂේත්‍රයේ රස්සා ගොඩක් තියෙනවා: Data Analyst ට reports සහ dashboards හදන්න ඕනේ, Data Scientist ට analysis සහ ML models, ML Engineer ට models ඇත්ත systems වල දුවවන්න ඕනේ. AI Engineer කෙනෙක් LLMs වලින් apps හදනවා, MLOps Engineer servers සහ monitoring බලාගන්නවා. ඔයාට charts සහ business ගැන කතා කරන එක ප්‍රිය නම් Data Analyst එකකින් පටන් ගන්න පුළුවන්. පටන් ගන්න PhD එකක් ඕනේ නෑ, හොඳ මූලික දැනුමක්, පොඩි real projects ටිකක් සහ ප්‍රතිඵල පැහැදිලි කරන්න පුළුවන් කම තියෙන්න ඕනේ.

```quiz
[
  {"q": "A bank wants to approve loans using 50,000 past loans whose repayment results are known. Which approach fits best?", "options": ["Write thousands of if-else rules by hand", "Machine Learning: learn the rules from the examples", "Use a calculator", "Sort the loans alphabetically"], "answer": 1, "why": "With many examples and answers, ML can find the patterns. Hand-written rules would be endless and would still miss cases. A calculator or sorting does not predict anything."},
  {"q": "Which list goes from the biggest circle to the smallest?", "options": ["LLM, GenAI, Deep Learning, ML, AI", "AI, ML, Deep Learning, GenAI, LLM", "ML, AI, Deep Learning, LLM, GenAI", "AI, Deep Learning, ML, LLM, GenAI"], "answer": 1, "why": "AI contains ML, ML contains Deep Learning, Deep Learning contains GenAI, and GenAI for text is an LLM. The first option is the same list in reverse (smallest to biggest)."},
  {"q": "In a table with columns brand, age_years, battery_health and resale_price (used to predict resale_price), which are the features?", "options": ["resale_price only", "brand, age_years and battery_health", "All four columns", "None, features are only in images"], "answer": 1, "why": "Features are the input columns; resale_price is the label (y). Calling all four columns features would include the answer itself, which is leakage."},
  {"q": "Which of these is nominal categorical data?", "options": ["Height in cm", "Number of siblings", "T-shirt size S, M, L", "Home district such as Galle or Kandy"], "answer": 3, "why": "District names are categories with no natural order. T-shirt size is ordinal because S < M < L, height is continuous, and siblings is discrete."},
  {"q": "A model has 7 billion parameters stored in FP16 (2 bytes each). About how much memory do the weights take?", "options": ["3.5 GB", "7 GB", "14 GB", "28 GB"], "answer": 2, "why": "7 billion × 2 bytes = 14 billion bytes = 14 GB. 28 GB would be FP32 (4 bytes), and 3.5 GB would be INT4 (0.5 byte)."},
  {"q": "Which statement about training and inference is correct?", "options": ["Inference is when the model learns from labelled data", "Training uses a trained model to answer new questions", "Training learns the parameters from examples; inference uses the trained model on new input", "They mean the same thing"], "answer": 2, "why": "Training = learning from examples. Inference = using what was learned. The first two options swap the meanings."},
  {"q": "Which is generative AI rather than discriminative AI?", "options": ["A spam filter that outputs spam / not spam", "A model that says whether a photo contains a cat", "A model that writes a new email draft", "A model that labels a song's genre"], "answer": 2, "why": "Generative AI creates new content. The other three each choose from fixed categories for existing content, which is discriminative."},
  {"q": "A 4-bit number can hold how many different values?", "options": ["4", "8", "16", "256"], "answer": 2, "why": "With n bits there are 2ⁿ values, and 2⁴ = 2 × 2 × 2 × 2 = 16. 256 is for 8 bits (one byte)."}
]
```

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

**Q8.** A table has columns `age`, `district`, `monthly_income` and `loan_repaid` (yes/no). You want to predict `loan_repaid`. Name the features, the label, and the type of each column.

<details><summary>Answer</summary>

Features (X): `age` (discrete numerical), `district` (nominal), `monthly_income` (continuous numerical). Label (y): `loan_repaid` (binary).
</details>

**Q9.** A 13-billion-parameter model is stored in INT8. How much memory do the weights need?

<details><summary>Answer</summary>

INT8 = 1 byte per number, so 13 billion × 1 byte = 13 billion bytes ≈ **13 GB** (just for the weights).
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
| Parameter | A number inside a model that is learned from data (e.g. 100 and 80 in a fare formula) |
| Leakage | When the label (or a clue to it) sneaks into the features, making tests look unrealistically good |
| Binary search | Finding something by repeatedly halving the range |
| Quantization | Storing a model's numbers with fewer bits (e.g. FP16 → INT4) to save memory |

**Next:** [02-python-programming.md](02-python-programming.md)
