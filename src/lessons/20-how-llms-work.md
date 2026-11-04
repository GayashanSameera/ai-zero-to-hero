# 20: How Large Language Models Work

> **Before you start:** [04](04-math-numbers-and-functions.md) (logs, exp, argmax), [07](07-math-probability-statistics.md) (softmax, temperature preview, cross-entropy, perplexity, MLE), [11](11-ml-fundamentals.md) (self-supervised learning, generalisation), [17](17-sequence-models-and-attention.md#11-teacher-forcing-and-decoding) (teacher forcing, greedy/beam/sampling), [18](18-nlp-fundamentals.md) (tokenisation, language models), [19](19-transformers.md) (decoder-only Transformers, causal mask, LM head, RoPE, GQA, parameter counting).
>
> **After this file you can:** explain exactly what happens from typing a prompt to receiving an answer: tokenisation (BPE), context windows and token costs, next-token prediction, decoding settings (temperature, top-k, top-p), the KV cache, pretraining and scaling laws, why LLMs hallucinate, base vs instruct models, reasoning models, and open vs closed models.

---

## Table of contents

1. [An LLM in one paragraph](#1-an-llm-in-one-paragraph)
2. [Tokens and tokenisers](#2-tokens-and-tokenisers)
3. [BPE step by step](#3-bpe-step-by-step)
4. [Tokeniser families and quirks](#4-tokeniser-families-and-quirks)
5. [Special tokens and chat templates](#5-special-tokens-and-chat-templates)
6. [Context window, token limits and cost](#6-context-window-limits-and-cost)
7. [Next-token prediction: from logits to probabilities](#7-next-token-prediction)
8. [The generation loop (autoregressive decoding)](#8-the-generation-loop)
9. [Decoding strategies: greedy and beam search](#9-greedy-and-beam-search)
10. [Sampling: temperature, top-k, top-p, min-p](#10-sampling)
11. [Other generation controls](#11-other-generation-controls)
12. [The KV cache](#12-the-kv-cache)
13. [Pretraining: how LLMs learn](#13-pretraining)
14. [Scaling laws](#14-scaling-laws)
15. [Emergent abilities and in-context learning](#15-emergent-abilities-and-in-context-learning)
16. [Base models vs instruction-tuned (chat) models](#16-base-vs-instruct-models)
17. [Hallucinations: why LLMs make things up](#17-hallucinations)
18. [Other limitations](#18-other-limitations)
19. [Reasoning models and test-time compute](#19-reasoning-models)
20. [Open vs closed models](#20-open-vs-closed-models)
21. [The life of a prompt (putting it all together)](#21-the-life-of-a-prompt)
22. [Check yourself](#22-check-yourself)
23. [New words in this file](#23-new-words-in-this-file)

---

## 1. An LLM in one paragraph

**Why it exists:** before LLMs, every language task (translate, summarise, answer questions) needed its own specially built model. One model trained only to predict the next token turned out to be a general-purpose text engine that can do all of them just by being asked in plain language.

A **Large Language Model** is a decoder-only Transformer ([file 19](19-transformers.md#16-gpt)) with billions of parameters, **pretrained** on trillions of tokens of text to predict the **next token** ([file 18](18-nlp-fundamentals.md#15-language-models)). Given a sequence of tokens, it outputs a probability for every possible next token. To write text, it **samples** one token, appends it, and repeats. After pretraining, it's **fine-tuned and aligned** (file 21) to follow instructions and be helpful and safe. Everything it "knows" is stored in its parameters, learned from patterns in its training data.

**Text picture:**

```
 your prompt  ->  [tokeniser]  ->  token IDs  ->  [Transformer, billions of weights]
                                                          |
   text you read  <-  [detokenise]  <-  chosen token  <-  probabilities for every possible next token
                                         (repeat until the model emits "stop")
```

**Worked example:** type "I ate kottu for" and the model might assign: " dinner" 0.55, " lunch" 0.25, " breakfast" 0.12, everything else 0.08 (total 1.00). It picks one (say " dinner"), appends it, and asks the same question again for "I ate kottu for dinner". An answer of 50 words is simply this question asked about 65 times.

**Where you'll meet it in real work:** ChatGPT, Claude, Gemini, Copilot in your editor, the support chatbot of a bank or telco, and the "summarise this" button in your email app are all this same loop.

**Common mistake:** thinking the model "looks up" answers in a database. It does not. Everything it knows is squeezed into its weights, so it can be fluent and still wrong (section 17).

**Exam angle:** NCA-GENL-style questions describe an LLM as an autoregressive, decoder-only Transformer trained on next-token prediction. Any option saying it "retrieves stored documents" is a distractor.

> **සිංහලෙන්:** LLM එකක් කියන්නේ දැවැන්ත autocomplete එකක්. ඔයාගේ phone එකේ keyboard එක "Good" කිව්වම "morning" යෝජනා කරනවා වගේ තමයි, ඒත් මේක ඒකට වඩා ගොඩක් දක්ෂයි. "I ate kottu for" කියලා දුන්නම ඊළඟට එන්න පුළුවන් token එකකට probability එකක් දෙනවා, උදාහරණයක් විදිහට " dinner" 0.55. ඊට පස්සේ එක token එකක් තෝරලා ඒක අගට එකතු කරලා ආයෙත් ඒ වැඩේම කරනවා. Model එක ඇතුළේ database එකක් නෑ, හැමදේම weights වල තියෙන්නේ, ඒ නිසා ලස්සනට වැරදි දේත් කියන්න පුළුවන්.

---

## 2. Tokens and tokenisers

**Why it exists:** a neural network can only do maths on numbers, and the number of possible words (and spelling mistakes, names, emoji) is endless. Tokens give the model a fixed, finite menu of text pieces that can still be combined to write anything.

LLMs don't see letters or words. They see **tokens**: chunks of text from a fixed **vocabulary** (typically 32,000 to 256,000 entries), each with an integer ID ([file 18](18-nlp-fundamentals.md#4-tokenisation)).

**Example** (GPT-4-style tokeniser; exact splits vary between models):

```
"Tokenization is unbelievably useful!"
→ ["Token", "ization", " is", " unbel", "ievably", " useful", "!"]
→ [3404, 2065, 374, 41380, 89234, 5505, 0]   (illustrative IDs)
```

Notice:
- Common words are one token (" is", " useful")
- Rare words are split into pieces
- **Spaces are usually attached to the following word** (" is", not "is")

**Rules of thumb for English:**
- 1 token ≈ 4 characters ≈ ¾ of a word
- 100 tokens ≈ 75 words
- 1,000 words ≈ 1,300 to 1,400 tokens

**Why subwords?** ([file 18](18-nlp-fundamentals.md#4-tokenisation)) Word-level vocabularies can't handle new words; character-level sequences are too long. Subwords balance both, so **any** text can be encoded.

```python
import tiktoken                             # OpenAI's tokeniser library
enc = tiktoken.get_encoding("cl100k_base")
ids = enc.encode("Tokenization is unbelievably useful!")
print(len(ids), [enc.decode([i]) for i in ids])

from transformers import AutoTokenizer      # any Hugging Face model's tokeniser
tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B-Instruct")
tok.tokenize("Hello world")
```

### Three ways to cut text, compared

Take about 100 English words (roughly 570 characters):

| Method | Pieces for 100 words | Vocabulary size | Problem |
|---|---|---|---|
| Whole words | ~100 | Millions (every word form) | New or misspelt words are unknown |
| Single characters | ~570 | Under 200 | Sequences are very long, so attention is costly (O(n²)) |
| **Subword tokens** | **~130** | 32k to 256k | Balanced: common words are 1 token, rare words are split |

**Analogy (kottu):** a kottu cook chops the roti into bite-sized pieces. Whole rotis are too big to eat, and roti powder is not kottu. Subword tokens are the "just right" chop.

### Worked example: token counting

Rule of thumb: 1 token is about 0.75 words. A 3,000-word report is 3,000 ÷ 0.75 = **4,000 tokens**. A 128k-token window therefore holds about 128,000 × 0.75 = **96,000 words**.

### Why Sinhala and Tamil cost more

UTF-8 stores each English letter in 1 byte but each Sinhala letter in **3 bytes**. A byte-level tokeniser that has seen little Sinhala has few merged Sinhala pieces, so it falls back to many small byte-sized pieces. The same sentence can need several times more tokens, which means a higher bill and less room in the context window (section 6).

**Where you'll meet it in real work:** every API invoice is in tokens, and every "message too long" error is a token limit.

**Common mistakes:**
- Assuming 1 token = 1 word. For English it is closer to 3/4 of a word, and for Sinhala it can be much less.
- Using one model's tokeniser to count tokens for another model. Each model has its own.

**Exam angle:** know why subword tokenisation beats word-level (no unknown words, manageable vocabulary) and beats character-level (shorter sequences).

> **සිංහලෙන්:** LLM එකට අකුරු හෝ වචන කෙළින්ම තේරෙන්නේ නෑ, ඒකට තේරෙන්නේ අංක විතරයි. ඒ නිසා text එක පොඩි කෑලි (tokens) වලට කඩලා හැම එකකටම ID අංකයක් දෙනවා. වචන වශයෙන් කැපුවොත් vocabulary එක අති විශාලයි, අකුරු වශයෙන් කැපුවොත් sequence එක ගොඩක් දිගයි, ඒ නිසා මැද ප්‍රමාණයේ subword tokens පාවිච්චි කරනවා. ඉංග්‍රීසි වචන 3,000ක report එකක් tokens 4,000ක් විතර වෙනවා. සිංහල අකුරක් UTF-8 වලදී bytes 3ක් නිසා සිංහල text වලට tokens ගොඩක් යනවා, ඒ කියන්නේ බිල වැඩියි.

---

## 3. BPE step by step

**Why it exists:** someone has to decide which pieces go on the token menu. BPE lets the data decide: whatever chunks appear together most often get merged into one token, so common text is short and rare text is still possible.

**Byte Pair Encoding (BPE)** is the most common tokeniser algorithm. It learns a vocabulary from a training corpus by **repeatedly merging the most frequent adjacent pair** of symbols.

**Training corpus** (word: count): `low` ×5, `lower` ×2, `newest` ×6, `widest` ×3

**Start:** split every word into characters (with an end-of-word marker `_`):
```
l o w _ (5)    l o w e r _ (2)    n e w e s t _ (6)    w i d e s t _ (3)
```

**Count adjacent pairs** (weighted by word count):
- "e s": newest (6) + widest (3) = **9**
- "s t": 6 + 3 = **9**
- "t _": 9
- "l o": 5 + 2 = 7
- "o w": 7
- "w e": lower (2) + newest (6) = 8
- ...

**Merge 1:** most frequent is "e s" (tie broken by order) → new symbol "es":
```
n e w es t _ (6)    w i d es t _ (3)
```
**Merge 2:** "es t" (9) → "est":
```
n e w est _ (6)    w i d est _ (3)
```
**Merge 3:** "est _" (9) → "est_"
**Merge 4:** "l o" (7) → "lo"
**Merge 5:** "lo w" (7) → "low"
... continue until the vocabulary reaches the target size.

**Result:** frequent chunks like "est_" (as in newest, widest, biggest) and "low" become single tokens. A new word like "lowest" can be built as "low" + "est_", even though it never appeared in training.

**Encoding new text** applies the learned merges in the same order.

**Byte-level BPE** (GPT-2 onward): starts from the 256 possible **bytes** instead of characters, so **any** text (any language, emoji, code) can be encoded without "unknown" tokens.

### Second worked example (small numbers)

Training text: `hug` ×10, `pug` ×5, `hugs` ×5. Start from characters:

```
h u g (10)    p u g (5)    h u g s (5)
```

Count adjacent pairs, weighted by word count:
- "u g": 10 + 5 + 5 = **20**
- "h u": 10 + 5 = 15
- "p u": 5
- "g s": 5

**Merge 1:** "u g" is the most frequent, so it becomes the new token `ug`:

```
h ug (10)    p ug (5)    h ug s (5)
```

Count again: "h ug" = 15, "p ug" = 5, "ug s" = 5. **Merge 2:** `hug`.

Now "hugs" is two tokens (`hug` + `s`), and a word never seen in training, such as "bugs", can still be written as `b` + `ug` + `s`. The vocabulary started with 5 characters (h, u, g, p, s) and has grown to 7 after two merges. Real tokenisers do this tens of thousands of times.

**Where you'll meet it in real work:** training a tokeniser for your own domain (for example Sinhala legal text) so that common words become single tokens and your costs fall.

**Common mistakes:**
- Thinking BPE understands meaning. It only counts frequency, so splits like "un" + "believ" + "able" happen by statistics, not by grammar.
- Forgetting that merges are applied in the same **order** they were learned when encoding new text.

**Exam angle:** "Which step does BPE repeat?" Answer: merge the most frequent adjacent pair. WordPiece instead merges the pair that most increases the likelihood of the training data.

> **සිංහලෙන්:** BPE කියන්නේ කඩේක නිතර එකට විකිණෙන බඩු combo එකක් විදිහට pack කරනවා වගේ වැඩක්. මුලින් හැමදේම අකුරු වලට කඩනවා. ඊට පස්සේ training text එකේ වැඩිපුරම එකට එන යුගලය හොයලා ඒක අලුත් token එකක් කරනවා. "hug" 10 පාරක්, "pug" 5 පාරක්, "hugs" 5 පාරක් තියෙන තැනක "u g" යුගලය 10+5+5 = 20 පාරක් එන නිසා මුලින්ම merge වෙන්නේ ඒක. ඒක ආයෙත් ආයෙත් කරද්දී vocabulary එක හැදෙනවා. "bugs" වගේ අලුත් වචනයක් ආවත් "b"+"ug"+"s" කියලා ලියන්න පුළුවන්.

---

## 4. Tokeniser families and quirks

**Why it matters:** most surprising LLM mistakes (miscounting letters, shaky arithmetic, odd behaviour with spaces) come from the tokeniser, not from "stupidity". Knowing the quirks tells you when not to trust the model.

| Algorithm | Used by | Idea |
|---|---|---|
| **BPE** (byte-level) | GPT family, Llama 3, Qwen, Mistral | Merge frequent pairs |
| **WordPiece** | BERT | Like BPE but merges pairs that most increase the training data's likelihood; continuation pieces marked with ## ("play", "##ing") |
| **Unigram** | T5, many multilingual models | Start with a big vocabulary and prune the least useful tokens |
| **SentencePiece** | Llama 1/2, T5, many others | A library/framework that treats raw text (including spaces, shown as ▁) as input, running BPE or Unigram; language-independent |
| **tiktoken** | OpenAI models | A fast BPE implementation |

### Tokenisation quirks that explain LLM mistakes

1. **Counting letters is hard.** "How many r's in strawberry?" The model sees tokens like ["str", "aw", "berry"], not individual letters, so it has to "remember" each token's spelling.
2. **Arithmetic is awkward.** Numbers split inconsistently: "1234567" might be ["123", "456", "7"]. Digit-by-digit maths is harder. (Some newer tokenisers split numbers into single digits.)
3. **Spaces matter.** "Hello" and " Hello" are different tokens. Trailing spaces in prompts can change outputs.
4. **Non-English costs more.** Tokenisers are mostly trained on English, so other languages split into more tokens. A Sinhala or Tamil sentence can need **3 to 10×** more tokens than its English translation ([file 18](18-nlp-fundamentals.md#17-low-resource-languages)): higher cost, slower, less fits in the context window.
5. **Glitch tokens:** rare tokens that were in the vocabulary but barely in training data can cause weird behaviour.
6. **Each model has its own tokeniser.** Token counts and IDs differ between models; never mix tokenisers and models.

### Worked example: why counting r's is hard

"strawberry" may reach the model as 3 tokens, say `str` + `aw` + `berry`. The model never sees the 10 letters s-t-r-a-w-b-e-r-r-y. To count the r's it must recall the spelling of each token from memory: `str` has 1 r, `aw` has 0, `berry` has 2, total **3**. That recall can fail, so a model may answer 2.

### Worked example: what the Sinhala multiplier costs

Suppose an English support message is 500 tokens and the Sinhala version is 3× longer, 1,500 tokens (illustrative). At $3 per 1M input tokens:
- English: 500 ÷ 1,000,000 × $3 = **$0.0015**
- Sinhala: 1,500 ÷ 1,000,000 × $3 = **$0.0045**

For 1 million messages a month that is $1,500 against $4,500, a difference of $3,000 for the same content.

**Where you'll meet it in real work:** a Colombo start-up building a Sinhala chatbot must budget for the extra tokens, or choose a model whose tokeniser handles Sinhala better.

**Common mistakes:**
- Assuming the model "can't read" because it miscounted letters. It is a tokeniser effect; give it a code tool for exact counting.
- Adding a stray trailing space to a prompt. " Hello" and "Hello" are different tokens and can shift the output.

**Exam angle:** typical question: "Why is a multilingual model more expensive for low-resource languages?" Answer: more tokens per sentence, because the tokeniser has fewer merges for that language.

> **සිංහලෙන්:** හැම tokenizer එකකම ඒකටම ආවේණික හැසිරීම් තියෙනවා. "strawberry" කියන වචනය model එකට පේන්නේ "str"+"aw"+"berry" කියලා කෑලි තුනක් විදිහට, අකුරු 10ක් විදිහට නෙවෙයි. ඒ නිසා ඒකේ r කීයද කියලා ගණන් කරන්න එයාට අමාරුයි. ඒ වගේම සිංහල text එකකට ඉංග්‍රීසියට වඩා tokens 3 ගුණයක් ගියොත් 500 token message එක 1,500 වෙනවා, බිල්පතත් 3 ගුණයක් වෙනවා. ඒ නිසා model එක තෝරද්දී ඒකේ tokenizer එක සිංහලට කොහොමද කියලා බලන්න.

---

## 5. Special tokens and chat templates

**Why it exists:** a chat has speakers, but the model only reads one long stream of tokens. Special tokens and a template are the stage directions that tell the model who is speaking and when it is its turn.

**Special tokens** have reserved meanings:
- **BOS** (beginning of sequence), e.g. `<s>` or `<|begin_of_text|>`
- **EOS** (end of sequence), e.g. `</s>` or `<|eot_id|>`. When the model generates it, generation stops
- **PAD** (padding, [file 19](19-transformers.md#8-masking))
- Role markers for chat

### Chat templates

A chat is a list of messages with **roles**:
- **system:** overall instructions and persona ("You are a helpful assistant for a bank...")
- **user:** the human's messages
- **assistant:** the model's replies
- (sometimes **tool**: results from tools the model called, file 24)

The model actually sees one long string, formatted with special tokens by a **chat template**. Example (Llama-3 style):

```
<|begin_of_text|><|start_header_id|>system<|end_header_id|>
You are a helpful assistant.<|eot_id|><|start_header_id|>user<|end_header_id|>
What is the capital of Sri Lanka?<|eot_id|><|start_header_id|>assistant<|end_header_id|>
```

The model continues from there: "Sri Jayawardenepura Kotte is the official capital; Colombo is the commercial capital.<|eot_id|>"

```python
messages = [{"role": "system", "content": "You are helpful."},
            {"role": "user", "content": "Hi!"}]
prompt = tok.apply_chat_template(messages, tokenize=False, add_generation_prompt=True)
```

⚠️ Using the **wrong template** for a model (or none) makes an instruct model behave badly. Libraries and APIs handle this for you.

### Worked example: the same chat, three views

What the app stores:

```
system:    "You answer in one short sentence."
user:      "Capital of Sri Lanka?"
```

What the model really receives (simplified, not any one model's exact format):

```
<BOS> [SYSTEM] You answer in one short sentence. [END]
      [USER]   Capital of Sri Lanka? [END]
      [ASSISTANT]                                    <- the model continues from here
```

What the model writes back: `Sri Jayawardenepura Kotte is the official capital. [END]`. The `[END]` token is the cue to stop generating.

| Token | Job |
|---|---|
| BOS | "A new sequence starts here" |
| EOS / end-of-turn | "The reply is finished, stop" |
| PAD | Filler so short sequences in a batch match the longest one (ignored by attention) |
| Role markers | Tell the model whose words follow |

**Where you'll meet it in real work:** when you fine-tune a model (file 21) your training data must use the **same** chat template as the model, or quality drops. Prompt-injection attacks (file 29) also exploit the fact that everything becomes one token stream.

**Common mistakes:**
- Calling `apply_chat_template` without `add_generation_prompt=True`, so the model is not told to start the assistant turn.
- Putting a base model's plain text prompt into an instruct model, or the reverse.

**Exam angle:** know the roles (system, user, assistant, tool) and that EOS ends generation.

> **සිංහලෙන්:** Chat එකක කතා කරන අය කීප දෙනෙක් ඉන්නවා (system, user, assistant), ඒත් model එකට පේන්නේ දිග token පේළියක් විතරයි. ඒ නිසා "දැන් කතා කරන්නේ කවුද" කියලා කියන්න විශේෂ tokens සහ chat template එකක් පාවිච්චි කරනවා. BOS කියන්නේ පටන් ගැනීම, EOS කියන්නේ "මගේ පිළිතුර ඉවරයි, නවතින්න" කියන සලකුණ, PAD කියන්නේ batch එකක කෙටි sequences දිගු ඒවට සමාන කරන්න දාන හිස් ඉඩ. වැරදි template එකක් දැම්මොත් instruct model එකත් අවුල් විදිහට හැසිරෙනවා.

---

## 6. Context window, limits and cost

**Why it exists:** the model can only look at a limited amount of text at once, and every token costs real compute. The context window and per-token pricing are how that limit and that cost show up in your daily work.

### Context window

The **context window** (or **context length**) = the maximum number of tokens the model can process at once: **input + output combined**.

| Era | Typical context |
|---|---|
| GPT-2 (2019) | 1,024 tokens |
| GPT-3 (2020) | 2,048 |
| 2023 | 8k to 32k; some 100k+ |
| 2024 to 2026 | 128k to 1M+ tokens for leading models |

128k tokens ≈ 96,000 words ≈ a 300-page book.

**If your input + requested output exceeds the window**, you'll get an error, or the start of the conversation gets cut off (**truncation**).

**LLMs are stateless.** The model has **no memory between API calls**. A chat app "remembers" the conversation only by **sending the whole history again** with every message. Long chats therefore get slower and more expensive, and eventually the oldest messages must be dropped or summarised (agent memory, file 24).

### Longer isn't automatically better

- **Cost and latency** grow with input length (attention is O(n²), [file 19](19-transformers.md#19-the-cost-of-attention))
- **"Lost in the middle":** models use information at the **start and end** of long contexts better than information buried in the middle
- **Effective context** may be shorter than the advertised maximum

This is one reason RAG (file 23) is still useful even with huge context windows: retrieve only the relevant pieces.

### Token-based pricing

APIs charge per token, usually quoted **per million tokens**, with **output tokens costing more** than input tokens (often 3 to 5×), because generating is slower (section 12).

**Worked example** (illustrative prices: $3 per 1M input tokens, $15 per 1M output tokens):
A support bot handles 10,000 conversations/day, each with 2,000 input tokens (system prompt + history + question) and 300 output tokens.
- Input: 10,000 × 2,000 = 20M tokens × $3/1M = **$60/day**
- Output: 10,000 × 300 = 3M tokens × $15/1M = **$45/day**
- **Total ≈ $105/day ≈ $3,150/month**

Ways to reduce cost: shorter prompts, **prompt caching** (reuse a long fixed prefix at a discount, file 22), cheaper/smaller models for easy requests (routing), limiting output length.

### Worked example: a chat gets more expensive every turn

Because the model is stateless, the app resends the whole history. Assume a 100-token system prompt, 50 tokens per user message, 250 tokens per reply:

| Turn | Input tokens sent | Output tokens |
|---|---|---|
| 1 | 100 + 50 = 150 | 250 |
| 2 | 150 + 250 + 50 = 450 | 250 |
| 3 | 450 + 250 + 50 = 750 | 250 |
| 4 | 750 + 250 + 50 = 1,050 | 250 |
| 5 | 1,050 + 250 + 50 = 1,350 | 250 |

Input billed over 5 turns: 150 + 450 + 750 + 1,050 + 1,350 = **3,750 tokens**, not 5 × 150 = 750. Long chats grow roughly with the square of the number of turns.

### Worked example: does my document fit?

A 40-page PDF with 500 words per page is 20,000 words ≈ 20,000 ÷ 0.75 ≈ **26,700 tokens**. In a 32k window that leaves about 5,300 tokens for the system prompt, your question and the answer. Tight but possible. In a 128k window it is easy.

### Analogy

The context window is an A/L exam answer booklet with a fixed number of pages: the question paper (input) and your answer (output) must both fit. The token meter is a tuk-tuk meter: the longer the trip, the more you pay.

**Where you'll meet it in real work:** budgeting a customer-support bot, and deciding when to summarise old messages instead of resending them.

**Common mistakes:**
- Forgetting that the output also uses the window. If the window is 8k and you send 8k tokens, there is no room to answer.
- Thinking "a bigger window means I can skip RAG". Cost, speed and lost-in-the-middle still apply.

**Exam angle:** expect a token-cost calculation (input tokens × input price + output tokens × output price) and the fact that output tokens cost more.

> **සිංහලෙන්:** Context window එක කියන්නේ model එකට එක පාරකට බලාගෙන ඉන්න පුළුවන් උපරිම tokens ගණන, input සහ output දෙකම එකතු කරලා. A/L විභාගෙක answer book එකේ පිටු ගණන සීමිත වගේ. Model එකට මතකයක් නෑ, ඒ නිසා chat app එක හැම පාරම මුළු ඉතිහාසයම ආයෙත් යවනවා. Turn 5 වෙද්දී input tokens 150 ඉඳන් 1,350 දක්වා වැඩි වෙලා, මුළු input එක 3,750ක් වෙනවා. Tuk-tuk meter එක වගේ tokens අනුව ගෙවන්න වෙන නිසා output tokens වලට input වලට වඩා වැඩි මිලක් අය කරනවා.

---

## 7. Next-token prediction

**Why it exists:** a language model has to turn "some text so far" into "what comes next". Logits and softmax are the standard recipe for turning a network's raw output numbers into a proper set of probabilities.

Given tokens [t₁, ..., tₙ], the model outputs, for the last position, a **logit** (raw score, [file 07](07-math-probability-statistics.md#13-softmax)) for **every** token in the vocabulary. Softmax turns them into probabilities.

**Example:** prompt "The cat sat on the"

| Next token | Logit | Probability |
|---|---|---|
| " mat" | 5.1 | 0.42 |
| " floor" | 4.6 | 0.25 |
| " sofa" | 4.2 | 0.17 |
| " roof" | 3.5 | 0.08 |
| " table" | 3.2 | 0.06 |
| ... 100,000 others | lower | 0.02 total |

The model outputs a **distribution**, not one answer. How we pick from it is the **decoding strategy** (sections 9 to 10).

**Log-probabilities ("logprobs"):** many APIs can return ln(probability) for each generated token. Useful for measuring the model's confidence, building classifiers, and detecting uncertain (possibly hallucinated) answers.

### Training objective

At every position in the training text, the loss is the cross-entropy: **−log P(actual next token)** ([file 07](07-math-probability-statistics.md#23-cross-entropy)). Thanks to the causal mask ([file 19](19-transformers.md#8-masking)), one forward pass over a 4,096-token document gives 4,095 predictions and training signals at once. This is **Maximum Likelihood Estimation** of the text ([file 07](07-math-probability-statistics.md#21-maximum-likelihood-and-map)).

### Worked example: from logits to probabilities

Prompt: "Amma kussiye ___" (Amma in the kitchen ___). Suppose the model gives raw scores for three candidate words: cooks = 4.0, sits = 3.0, dances = 0.5.

1. Exponentiate each: e^4.0 = 54.6, e^3.0 = 20.1, e^0.5 = 1.65
2. Add them up: 54.6 + 20.1 + 1.65 = 76.35
3. Divide each by the total:
   - cooks: 54.6 ÷ 76.35 = **0.715**
   - sits: 20.1 ÷ 76.35 = **0.263**
   - dances: 1.65 ÷ 76.35 = **0.022**
4. Check: 0.715 + 0.263 + 0.022 = 1.000

### Worked example: the training loss for one position

The loss is −ln P(actual next token). If the real next word was "cooks" (P = 0.715): loss = −ln 0.715 = **0.34** (low, good). If the real word was "dances" (P = 0.022): loss = −ln 0.022 = **3.82** (high, the model was surprised). Training nudges the weights to turn the high-loss cases into low-loss ones, across trillions of positions.

**Analogy:** the model is a cricket commentator guessing the next ball: "70% a dot ball, 26% a single, 2% a six". It does not know, it just ranks the possibilities.

**Where you'll meet it in real work:** classification with an LLM (read the logprob of " Yes" against " No"), and confidence checks (a top probability of 0.95 is very different from 0.30).

**Common mistakes:**
- Thinking the model outputs a word. It outputs a **distribution** over the whole vocabulary; a separate decoding step picks the token.
- Reading logits as probabilities. Logits can be negative or above 1 and do not sum to 1.

**Exam angle:** softmax turns logits into probabilities that sum to 1; the pretraining loss is cross-entropy on the next token; perplexity is the exponential of the average loss.

> **සිංහලෙන්:** Model එක අන්තිමට දෙන්නේ vocabulary එකේ හැම token එකකටම logit කියන raw score එකක්. "අම්මා කුස්සියේ ___" කියන තැනට උයනවා = 4.0, ඉන්නවා = 3.0, නටනවා = 0.5 කියලා හිතන්න. Softmax එකෙන් හැම එකම exponent කරලා (54.6, 20.1, 1.65) එකතුවෙන් (76.35) බෙදද්දී probabilities 0.72, 0.26, 0.02 ලැබෙනවා, එකතුව 1යි. Training එකේදී ඇත්ත වචනයට දුන්න probability එක අඩු නම් loss එක වැඩියි, ඒ නිසා model එක ඒක නිවැරදි කරගන්නවා.

---

## 8. The generation loop

**Why it exists:** a network produces only one probability table per forward pass. To write a whole paragraph it must run again and again, each time reading what it has written so far.

LLMs generate **autoregressively**: one token at a time, each new token fed back as input.

```
Step 1: "The capital of France is"            → predict " Paris"
Step 2: "The capital of France is Paris"      → predict "."
Step 3: "The capital of France is Paris."     → predict <EOS>  → stop
```

```python
# Simplified generation loop
ids = tokenizer.encode(prompt)
for _ in range(max_new_tokens):
    logits = model(ids)[-1]                 # logits for the next token
    next_id = choose(logits)                # greedy / sampling (below)
    if next_id == eos_id:
        break
    ids.append(next_id)
print(tokenizer.decode(ids))
```

**Consequences:**
- Output comes out **word by word**, which is why chat apps **stream** text ([generators, file 02](02-python-programming.md#21-generators-decorators-type-hints))
- **Each output token needs a full forward pass**, so long answers take longer
- **Early tokens commit the model.** Once it writes "The answer is 42", later tokens tend to justify that, even if wrong. That's partly why "think step by step before answering" helps (file 22).

### Worked example: how long does an answer take?

A 300-token answer needs about **300 forward passes** (one per token). If the server generates 30 tokens per second, that is 300 ÷ 30 = **10 seconds**. This is why short answers feel instant and long essays take a while, and why chat apps stream text as it appears.

A text picture of the loop, with the input growing each step:

```
pass 1:  [prompt]                   -> "The"
pass 2:  [prompt] The               -> " cat"
pass 3:  [prompt] The cat           -> " sat"
pass 4:  [prompt] The cat sat       -> <EOS>   (stop)
```

**Analogy:** writing a sentence by tapping the keyboard's suggestion bar, one word at a time, with each word chosen after you have seen everything before it.

**Where you'll meet it in real work:** latency planning. If your app promises a reply within 3 seconds at 30 tokens per second, the answer can be at most about 90 tokens long.

**Common mistakes:**
- Thinking the model plans the whole answer first. It commits token by token, and early wrong words are hard to undo.
- Assuming a longer prompt makes the output slower per token in the same way as a longer answer. Long prompts mostly add time before the first token (prefill, section 12).

**Exam angle:** "autoregressive" means each token is generated conditioned on all previous tokens, one at a time.

> **සිංහලෙන්:** LLM එකක් උත්තරය ලියන්නේ token එකින් එක, ලියපු token එක ආපහු input එකට දාලා. Tokens 300ක උත්තරයකට forward pass 300ක් යනවා. තත්පරයට tokens 30ක් generate කරනවා නම් ඒකට තත්පර 10ක් යනවා. ඒ නිසා තමයි ChatGPT වගේ app වල අකුරු ටික ටික එන්නේ (streaming). මුලින්ම වැරදි දෙයක් ලිව්වොත් ඊළඟ tokens ඒක අනුගමනය කරන නිසා ඒක නිවැරදි කරගන්න අමාරුයි.

---

## 9. Greedy and beam search

**Why it exists:** when the model hands you a probability table, you still have to pick one token at each step. Greedy and beam search are the "always take the best" strategies, ideal when there is one right answer.

### Greedy decoding

Always pick the **highest-probability** token (argmax, [file 04](04-math-numbers-and-functions.md#15-absolute-value-min-max-argmax)).
- ✅ Deterministic (mostly, see section 11), fast
- ❌ Can be repetitive and dull; can miss better overall continuations

### Beam search

Keep the **top B partial sequences** (beams) at every step, expand each, keep the best B by total log-probability.

**Example, B = 2:**
- Step 1: " Paris" (0.6), " the" (0.3) → keep both
- Step 2: expand each: "Paris." (0.6×0.7 = 0.42), "Paris," (0.6×0.2 = 0.12), "the city" (0.3×0.8 = 0.24), ... → keep the best 2: "Paris." (0.42), "the city" (0.24)

- ✅ Good for tasks with a "correct" output: translation, summarisation, speech recognition
- ❌ For open-ended chat/creative text, produces bland, repetitive output. Rarely used for chat LLMs.

**Length penalty:** beam search favours short outputs (multiplying probabilities < 1 makes longer sequences score lower), so a length normalisation is applied.

### Worked example: why greedy can miss the best sentence

Two possible paths, with probabilities for each step:

| Path | Step 1 | Step 2 | Whole sentence |
|---|---|---|---|
| A | 0.50 | 0.40 | 0.50 × 0.40 = **0.20** |
| B | 0.40 | 0.90 | 0.40 × 0.90 = **0.36** |

Greedy sees only step 1 and takes the 0.50 branch (path A), finishing with 0.20. Beam search with B = 2 keeps both branches alive, compares whole-sentence scores at the end, and finds path B (0.36). Path B really is the more probable sentence, yet greedy never visits it.

**Analogy (route planning):** greedy is turning onto whichever road looks widest at each junction. Beam search is checking the whole route on a map before leaving Colombo for Kandy.

**Where you'll meet it in real work:** machine translation and speech-to-text use beam search (one correct output); a chat model for creative help almost never does.

**Common mistakes:**
- Using beam search for chat or story writing, which gives bland, repetitive text.
- Assuming greedy output is always the same. GPU effects can still cause tiny differences (section 11).

**Exam angle:** greedy = argmax each step; beam search = keep top-B sequences by total log-probability; beam search is for tasks with a "correct" output.

> **සිංහලෙන්:** Greedy කියන්නේ හැම පියවරකම වැඩිම probability එක තියෙන token එක තෝරන එක. ඒක අන්තිමට හොඳම වාක්‍යය දෙන්නේ නෑ. Path A එකේ 0.50 × 0.40 = 0.20, path B එකේ 0.40 × 0.90 = 0.36. Greedy පළමු පියවරේ 0.50 දැකලා A තෝරනවා, ඒත් B තමයි ඇත්තටම හොඳ වාක්‍යය. Beam search එකෙන් මාර්ග කිහිපයක්ම එකවර තියාගෙන අන්තිමට හොඳම එක තෝරනවා, කොළඹ ඉඳන් මහනුවරට යන්න map එකේ මුළු ගමනම බලලා තෝරනවා වගේ. Translation වලට හොඳයි, chat වලට නෙවෙයි.

---

## 10. Sampling

**Why it exists:** always picking the top token makes text dull and repetitive. Sampling adds controlled randomness, and temperature, top-k, top-p and min-p are the dials that decide how much.

**Sampling** = randomly choosing the next token according to its probability. This gives varied, more natural text.

### Temperature (T)

Divide the logits by T before softmax ([file 07](07-math-probability-statistics.md#13-softmax)):

```
P(token i) = softmax(logits / T)
```

**Worked example:** logits [2.0, 1.0, 0.0] for tokens [A, B, C]

| Temperature | Logits ÷ T | Probabilities | Effect |
|---|---|---|---|
| T → 0 | [→ ∞ gaps] | [1.00, 0.00, 0.00] | = greedy |
| **T = 0.5** | [4, 2, 0] | e⁴=54.6, e²=7.39, 1 → **[0.867, 0.117, 0.016]** | sharper, more focused |
| **T = 1.0** | [2, 1, 0] | **[0.665, 0.245, 0.090]** | the model's natural distribution |
| **T = 2.0** | [1, 0.5, 0] | e¹=2.72, e^0.5=1.65, 1 → **[0.506, 0.307, 0.186]** | flatter, more random |

- **Low T (0 to 0.3):** factual Q&A, extraction, code, classification, anything where you want consistency
- **Medium T (0.5 to 0.8):** general chat
- **High T (0.9 to 1.2+):** brainstorming, creative writing (too high → nonsense)

### Top-k sampling

Only consider the **k most likely** tokens, renormalise, then sample.
With k = 2 on [0.665, 0.245, 0.090] → keep A, B → renormalised [0.731, 0.269].
❌ A fixed k is awkward: sometimes only 1 token is sensible, sometimes 50 are.

### Top-p (nucleus) sampling

Keep the **smallest set of tokens whose probabilities add up to at least p**, renormalise, sample.

Probabilities sorted: [0.42, 0.25, 0.17, 0.08, 0.06, ...] with **p = 0.9**:
cumulative 0.42 → 0.67 → 0.84 → **0.92** ≥ 0.9 → keep the top 4 tokens.

✅ Adapts automatically: when the model is confident, the nucleus is small; when uncertain, it's larger. Typical p = 0.9 to 0.95.

### Min-p sampling

Keep tokens whose probability is at least **min_p × (probability of the top token)**. With top = 0.42 and min_p = 0.1, keep tokens with P ≥ 0.042. Also adapts to confidence; popular in open-model tools.

**Order in practice:** logits → (penalties) → temperature → top-k / top-p / min-p filtering → softmax → sample.

**Tip:** usually change **either** temperature **or** top-p, not both aggressively.

### One example, every dial

"I am hungry, I will eat ___". The model's probabilities:

| Token | rice | kottu | string hoppers | cake |
|---|---|---|---|---|
| P | 0.50 | 0.30 | 0.15 | 0.05 |

- **Greedy:** always "rice".
- **Top-k, k = 2:** keep rice and kottu, total 0.80. Renormalise: 0.50 ÷ 0.80 = **0.625**, 0.30 ÷ 0.80 = **0.375**.
- **Top-p, p = 0.9:** cumulative 0.50, 0.80, **0.95** (≥ 0.9). Keep rice, kottu, string hoppers; drop cake. Renormalise by 0.95: 0.526, 0.316, 0.158.
- **Min-p, min_p = 0.2:** threshold = 0.2 × 0.50 = 0.10. Keep rice, kottu, string hoppers (0.15 ≥ 0.10); cake (0.05) goes.

### Temperature on the same table

Dividing logits by T is the same as raising each probability to the power 1/T and renormalising:

| T | Calculation | rice | kottu | hoppers | cake |
|---|---|---|---|---|---|
| 0.5 | p² = 0.25, 0.09, 0.0225, 0.0025 (sum 0.365) | **0.685** | 0.247 | 0.062 | 0.007 |
| 1.0 | unchanged | 0.50 | 0.30 | 0.15 | 0.05 |
| 2.0 | √p = 0.707, 0.548, 0.387, 0.224 (sum 1.866) | **0.379** | 0.294 | 0.208 | 0.120 |

Low T makes rice dominate; high T gives even cake a 12% chance.

**Analogy (lunch in Colombo):** greedy is eating at your favourite rice-and-curry shop every day. High temperature is picking a random shop on the map. Top-k is "only my top 3 shops", and top-p is "only the shops that cover 90% of my usual choices".

**Where you'll meet it in real work:** a bank's invoice-to-JSON extractor runs at T near 0; a marketing-slogan brainstorm at T around 1.0.

**Common mistakes:**
- Setting temperature to 0 and expecting a creative answer.
- Turning both temperature and top-p up high at once, which gives nonsense.
- Thinking temperature changes what the model knows. It only reshapes the choice among tokens it already considers.

**Exam angle:** low temperature gives more deterministic output, high gives more diverse output; top-p adapts to the model's confidence while a fixed top-k does not.

> **සිංහලෙන්:** Sampling කියන්නේ probability අනුව ලොතරැයියක් වගේ token එකක් තෝරන එක. Temperature කියන්නේ ඒ ලොතරැයියේ knob එක. බත් 0.50, කොත්තු 0.30, ඉඳිආප්ප 0.15, කේක් 0.05 කියන table එකේ temperature 0.5 දැම්මම බත් 0.685 වෙනවා, 2.0 දැම්මම කේක් පවා 0.12ක් වෙනවා. Top-k (k=2) කිව්වම බත් සහ කොත්තු විතරක් ඉතුරු කරලා 0.625 සහ 0.375 විදිහට නැවත බෙදනවා. Top-p (p=0.9) කිව්වම බත්, කොත්තු, ඉඳිආප්ප තියාගන්නවා, කේක් අයින් වෙනවා. Invoice එකකින් data ගන්නකොට temperature අඩුවෙන්, කවි ලියද්දී වැඩියෙන් දාන්න.

---

## 11. Other generation controls

**Why it exists:** the model alone only gives probabilities. These extra settings let you control length, stop points, repetition and format, which is what makes an LLM safe to plug into a real product.

| Setting | What it does |
|---|---|
| **max_tokens / max_new_tokens** | Cap on output length (cost and latency control). If hit, the answer is cut off mid-sentence; APIs report a finish reason like "length". |
| **stop sequences** | Strings that end generation when produced (e.g. "\n\nUser:") |
| **Repetition penalty** | Lower the logits of tokens already used, to reduce loops |
| **Frequency penalty** | Penalty grows with how many times a token appeared |
| **Presence penalty** | Fixed penalty if the token appeared at all (encourages new topics) |
| **no_repeat_ngram_size** | Forbid repeating any n-gram |
| **logit bias** | Manually raise/lower specific tokens (e.g. ban a word) |
| **seed** | Makes sampling repeatable (where supported) |
| **Structured output / constrained decoding** | Only allow tokens that keep the output valid JSON or matching a schema/grammar (file 22) |

### Why "temperature 0" can still vary

Even with greedy decoding, outputs can differ between runs because of:
- GPU floating-point arithmetic isn't perfectly deterministic (the order of additions in parallel can change tiny rounding errors, which can flip a close tie)
- **Batching** with other users' requests on the server changes computation order
- Model updates behind the API

So never assume perfect reproducibility from hosted APIs (file 26).

### Worked example: a repetition penalty

The model keeps writing "very very very". The logit for " very" is 3.0 and it has already appeared 3 times. With a frequency penalty of 0.5 per appearance (the logit is reduced by count × penalty):

3.0 − (3 × 0.5) = **1.5**

Its chance of being picked again drops sharply. A **presence penalty** of 0.5 would subtract just 0.5 once, no matter how many times the word appeared, which nudges the model toward new topics.

### Worked example: choosing settings for three products

| Product | max_tokens | temperature | Extra |
|---|---|---|---|
| Invoice to JSON | 300 | 0 | Structured output / schema |
| Customer chat reply | 400 | 0.5 | Stop sequence so it cannot write the customer's next line |
| Poem generator | 200 | 1.0 | Presence penalty 0.3 |

**Where you'll meet it in real work:** finish reason `length` in your logs means answers are being cut off; raise `max_tokens` or ask for shorter answers.

**Common mistakes:**
- Setting `max_tokens` too low and shipping half-finished answers to users.
- Assuming a seed guarantees identical output across hosted API versions.

**Exam angle:** know that `max_tokens` limits **output** only, that stop sequences end generation, and that "temperature 0" is not a guarantee of exact reproducibility.

> **සිංහලෙන්:** Temperature වලට අමතරව තව පාලන තියෙනවා. max_tokens කියන්නේ උත්තරයේ උපරිම දිග, ඒක පැනලා ගියොත් වාක්‍යය මැදින් කැපෙනවා. Stop sequence එකකින් ඒ string එක ආවම generation එක නවත්වනවා. "very" කියන වචනය 3 පාරක් ඇවිත් logit එක 3.0 නම්, frequency penalty 0.5 දැම්මම 3.0 − (3 × 0.5) = 1.5 වෙලා ආයෙත් ඒක තෝරන්න තියෙන ඉඩ අඩු වෙනවා. Temperature 0 දැම්මත් GPU වල පොඩි වෙනස්කම් නිසා හැම පාරම හරියටම එකම උත්තරේ එනවා කියලා සහතිකයක් නෑ.

---

## 12. The KV cache

**Why it exists:** generating token 501 needs the keys and values of the 500 earlier tokens. Without a cache the model would redo all that work again for every new token, which would be hopelessly slow.

**Problem:** to generate token 501, attention needs the keys and values ([file 19](19-transformers.md#5-query-key-value)) of all 500 previous tokens. Recomputing them for every new token would waste enormous effort.

**Solution:** the **KV cache** stores each layer's K and V vectors for all previous tokens. Each new step only computes Q, K, V for the **one new token** and reuses the cache.

```
Step 501: new token's q attends to [cached k₁..k₅₀₀ + new k₅₀₁], uses [cached v₁..v₅₀₀ + new v₅₀₁]
```

### Two phases of inference

| Phase | What happens | Speed limit |
|---|---|---|
| **Prefill** | Process the whole prompt at once (in parallel), filling the KV cache, and produce the first token | **Compute-bound** (lots of matrix maths); determines **time to first token (TTFT)** |
| **Decode** | Generate one token at a time using the cache | **Memory-bandwidth-bound** (loading all weights + cache for every token); determines **time per output token** |

This is why output tokens are slower and pricier than input tokens (section 6).

### KV cache memory

```
KV cache size = 2 (K and V) × layers × KV_heads × head_dim × sequence_length × bytes_per_number
```
(per sequence; multiply by the number of simultaneous requests)

**Worked example:** a Llama-3-8B-like model: 32 layers, 8 KV heads (GQA), head_dim 128, BF16 (2 bytes), 8,192 tokens:
2 × 32 × 8 × 128 × 8,192 × 2 bytes = **1,073,741,824 bytes ≈ 1 GB** per sequence.

Without GQA (32 KV heads), it would be 4 GB. This is why GQA/MQA matter ([file 19](19-transformers.md#9-multi-head-attention)). Serving systems like **vLLM** manage this memory cleverly (**PagedAttention**, file 27).

### Worked example: how much work does the cache save?

Generating a 500-token answer **without** a cache means recomputing every earlier token at each step: 1 + 2 + 3 + ... + 500 = 500 × 501 ÷ 2 = **125,250** token computations. **With** a cache each step computes only the one new token: **500** computations. That is about 250 times less work.

### Worked example: cache memory at scale

From the formula, a Llama-3-8B-like model needs about 1 GB at 8,192 tokens. Memory grows linearly with length:

| Situation | KV cache |
|---|---|
| 1 user, 8,192 tokens | ~1 GB |
| 1 user, 32,768 tokens (4×) | ~4 GB |
| 20 users at once, 8,192 tokens each | ~20 GB |

The 8B model's weights in BF16 are 16 GB, so on a 40 GB GPU the cache of 20 users nearly fills what is left. That is why serving engines work hard to save cache memory.

**Analogy:** doing a long sum on paper. The cache is the working you have already written down, so you never redo it.

**Where you'll meet it in real work:** the prefill/decode split explains why a huge pasted document delays the *first* word of the reply, while the words afterwards flow steadily.

**Common mistakes:**
- Thinking the KV cache stores the *answers* of earlier requests. It stores intermediate keys and values for the *current* sequence.
- Forgetting that more concurrent users means more cache memory, not just more compute.

**Exam angle:** KV cache trades memory for speed; prefill is compute-bound (affects time to first token), decode is memory-bandwidth-bound; GQA shrinks the cache.

> **සිංහලෙන්:** KV cache කියන්නේ ගණිත ප්‍රශ්නයක් කොළේ ලියලා කරද්දී කලින් පියවර ලියලා තියාගන්න එක වගේ දෙයක්. ඒක නැත්නම් token එකක් generate කරන හැම පාරම කලින් tokens ඔක්කොම ආයෙත් ගණන් කරන්න වෙනවා. Tokens 500ක උත්තරයකට cache නැතුව 125,250ක් ගණන් කරන්න වෙනවා, cache එක්ක 500යි. ඒ වෙනුවට memory වැඩියෙන් යනවා: tokens 8,192ක් සහ users 20දෙනෙක් නම් GB 20ක් විතර. ඒ නිසා GQA වගේ ක්‍රමවලින් cache එක පොඩි කරනවා.

---

## 13. Pretraining

**Why it exists:** nobody can hand-write the rules of language, facts and reasoning. Pretraining lets the model discover them itself by predicting hidden next tokens across a huge text collection, with no human labelling.

**Pretraining** = the first and most expensive training phase: self-supervised next-token prediction ([file 11](11-ml-fundamentals.md#2-types-of-machine-learning)) on a massive text corpus.

### The data

Trillions of tokens from:
- Web pages (filtered versions of **Common Crawl**, a huge public web scrape)
- Books, encyclopaedias (Wikipedia)
- Code (GitHub)
- Scientific papers, maths
- Multilingual text
- Increasingly, carefully generated **synthetic data**

**Data quality matters enormously.** Pipelines filter spam, low-quality pages, toxic content and personal information; **deduplicate** (repeated text gets memorised and wastes compute); and balance the **data mixture** (how much code vs web vs books). Covered more in [file 21](21-training-finetuning-alignment.md).

### The compute

Thousands of GPUs running for weeks or months. Frontier training runs cost tens to hundreds of millions of dollars.

**Training compute rule of thumb:**
```
FLOPs ≈ 6 × N × D
```
- N = number of parameters, D = number of training tokens
- (≈ 2ND for the forward pass + 4ND for the backward pass; a FLOP is one floating-point operation)

**Example:** 8B parameters × 15T tokens: 6 × 8×10⁹ × 15×10¹² = **7.2 × 10²³ FLOPs**. An H100 GPU delivers roughly 10¹⁵ useful FLOP/s in BF16 at good efficiency, so ≈ 7.2 × 10⁸ GPU-seconds ≈ **200,000 GPU-hours**.

### What the model learns

To predict the next token well across all that text, the model must implicitly learn grammar, facts, reasoning patterns, coding, styles, multiple languages, and how people think and argue. But it also absorbs the data's errors, biases and toxicity, which is why alignment and safety work (files 21, 29) are needed.

**Knowledge cutoff:** the model knows nothing about events after its training data was collected, unless you give it information in the prompt or via tools/RAG (files 23, 24).

### Worked example: how long would a person need to read the data?

15 trillion tokens ≈ 15 × 10¹² × 0.75 = 11.25 × 10¹² words. At 250 words per minute, a person reading non-stop needs 11.25 × 10¹² ÷ 250 = 4.5 × 10¹⁰ minutes, which is 4.5 × 10¹⁰ ÷ 525,600 ≈ **85,000 years**. The model reads it in weeks because thousands of GPUs work in parallel.

### Worked example: compute for a small model

Use FLOPs ≈ 6 × N × D with N = 1 billion parameters and D = 20 billion tokens:
6 × 10⁹ × 2 × 10¹⁰ = **1.2 × 10²⁰ FLOPs**.

Assume one GPU sustains 3 × 10¹⁴ FLOP/s in practice (an assumption, real values vary):
1.2 × 10²⁰ ÷ 3 × 10¹⁴ = 4 × 10⁵ seconds ≈ **111 hours** on one GPU, or about 14 hours on 8 GPUs, if the work is spread perfectly.

### The data mixture, as a picture

```
 Web (filtered) ############################ ~60%
 Code           ########                      ~15%
 Books          #####                         ~10%
 Papers / maths #####                         ~10%
 Other          ##                            ~5%      (illustrative proportions)
```

**Where you'll meet it in real work:** nearly every company uses someone else's pretrained model (a "foundation model") rather than paying for this step.

**Common mistakes:**
- Calling pretraining "unsupervised". The target (next token) comes from the data, so it is **self-supervised**.
- Assuming more data is always better. Duplicated or low-quality data wastes compute and can hurt.

**Exam angle:** pretraining = self-supervised next-token prediction on a very large corpus; data quality (filtering, deduplication) matters; the result is a base model.

> **සිංහලෙන්:** Pretraining කියන්නේ LLM එකක පළමු සහ වියදම්ම training අදියර. ඊළඟ token එක අනුමාන කරන එකම label එක නිසා මිනිස්සු කිසිම දෙයක් label කරන්න ඕනේ නෑ (self-supervised). Tokens ට්‍රිලියන 15ක් කියවන්න මනුස්සයෙක්ට අවුරුදු 85,000ක් විතර යනවා, ඒත් දහස් ගණනක් GPUs එකටම වැඩ කරන නිසා model එකට සති කිහිපයයි. FLOPs ≈ 6ND සූත්‍රයෙන් parameters බිලියන 1ක් සහ tokens බිලියන 20ක් නම් 1.2 × 10²⁰ FLOPs. Data වල quality එක ගොඩක් වැදගත්, ඒ නිසා spam සහ duplicates අයින් කරනවා.

---

## 14. Scaling laws

**Why it exists:** training runs cost millions, so labs wanted a way to predict how good a bigger model will be before paying for it. Scaling laws gave them that forecast.

**Scaling laws** are empirical findings that LLM loss improves **smoothly and predictably** as you increase:
- **N:** model size (parameters)
- **D:** data (training tokens)
- **C:** compute

The loss falls as a **power law**: each 10× increase gives a consistent improvement (a straight line on a log-log plot). This predictability let labs plan billion-dollar training runs.

### Chinchilla (DeepMind, 2022)

For a **fixed compute budget**, what's the best split between model size and data? Chinchilla found earlier models (like GPT-3: 175B parameters on only 300B tokens) were **undertrained**. The **compute-optimal** ratio is roughly:

```
≈ 20 training tokens per parameter
```

**Example:** a 70B model should see ~1.4T tokens. Chinchilla (70B, 1.4T tokens) beat the much larger Gopher (280B, 300B tokens) using the same compute.

### Beyond Chinchilla: "over-training" for inference

Chinchilla optimises **training** cost. But a deployed model is used billions of times, so a **smaller model trained on far more data** is cheaper to run. Modern models are often trained way past 20 tokens/parameter (e.g. Llama-3-8B on ~15T tokens ≈ 1,875 tokens per parameter).

### Worked example: Chinchilla's rule

At about 20 tokens per parameter:
- 7B model: 20 × 7B = **140B tokens**
- 70B model: 20 × 70B = **1.4T tokens**
- Compute for the 7B case: 6 × 7 × 10⁹ × 1.4 × 10¹¹ = **5.9 × 10²¹ FLOPs**

GPT-3 had 175B parameters but saw only 300B tokens, about 1.7 tokens per parameter (300 ÷ 175), far below 20, so it was undertrained by this rule.

### Worked example: over-training on purpose

Llama-3-8B saw about 15T tokens: 15,000B ÷ 8B = **1,875 tokens per parameter**, about 94 times the Chinchilla ratio (1,875 ÷ 20). It costs more to train, but a small model is cheap to serve billions of times, so the extra training pays for itself.

### Text picture

```
loss
 |\
 | \
 |  \__
 |     \___
 |         \_____          straight line on a log-log plot:
 |               \________  bigger N, D, C -> steadily lower loss
 +---------------------------> compute (log scale)
```

**Where you'll meet it in real work:** choosing between a 7B and a 70B model: bigger usually helps, but a well-trained 7B can beat a poorly trained 13B.

**Common mistakes:**
- Treating scaling laws as guarantees. They are empirical trends and say little about specific skills.
- Memorising "20 tokens per parameter" as a law for all deployments. It optimises *training* cost only.

**Exam angle:** know the Chinchilla result (data and parameters should grow together, ~20 tokens/parameter) and why modern models over-train.

> **සිංහලෙන්:** Scaling laws කියන්නේ model එක ලොකු කරද්දී, data වැඩි කරද්දී, compute වැඩි කරද්දී loss එක සුමටව අඩු වෙනවා කියන රටාව. Chinchilla කිව්වේ compute ප්‍රශස්ත විදිහට parameter එකකට tokens 20ක් විතර දෙන්න ඕනේ කියලා. 7B model එකකට tokens 140B. GPT-3 එකේ parameters 175B ට tokens 300B විතරයි, ඒ නිසා ඒක undertrained. දැන් Llama-3-8B වගේ models tokens 15T ට train කරනවා, ඒ කියන්නේ parameter එකකට 1,875ක්. ඒක train කරන්න වියදම් වැඩි වුණාට පොඩි model එක run කරන එක ලාභයි.

---

## 15. Emergent abilities and in-context learning

**Why it matters:** if a model can be taught a new task by showing it a few examples in the prompt, you can build many products with no training at all. That is the whole basis of prompt engineering.

### Emergent abilities

Some capabilities seemed to **appear suddenly** once models got big enough: multi-step arithmetic, following complex instructions, chain-of-thought reasoning. Later research suggested much of this "suddenness" depends on how you measure (e.g. all-or-nothing exact-match metrics hide gradual progress), but it's clear that **scale unlocks qualitatively new behaviours**.

### In-context learning (ICL)

Large models can learn a new task **from examples given in the prompt**, with **no weight updates**:

```
Translate to French:
sea otter → loutre de mer
cheese → fromage
peppermint → menthe poivrée
plush giraffe →
```
→ "girafe en peluche"

- **Zero-shot:** just the instruction, no examples
- **One-shot:** one example
- **Few-shot:** a few examples

This was GPT-3's big discovery and is the basis of **prompt engineering** ([file 22](22-prompt-engineering.md)). Mechanistically, attention heads such as **induction heads** ([file 19](19-transformers.md#9-multi-head-attention)) help models copy and apply patterns from earlier in the context.

### Worked example: few-shot sentiment labelling

```
Label each Daraz review as POSITIVE or NEGATIVE.

"Fast delivery, packing was neat"        -> POSITIVE
"Phone arrived scratched, no reply"      -> NEGATIVE
"Good price but the charger is faulty"   -> ?
```

No weights change. The model reads the pattern in the prompt and continues it. Cost: if each example is about 15 tokens, the two examples add roughly 30 tokens to every request. At 1M requests a month that is 30M extra input tokens, which at $3 per 1M is **$90** extra per month.

| Style | Examples in prompt | When to use |
|---|---|---|
| Zero-shot | 0 | Simple, well-known tasks |
| One-shot | 1 | Show the output format |
| Few-shot | 2 to ~8 | Unusual labels, tone or format |

**Where you'll meet it in real work:** classifying support tickets, extracting fields from emails, and matching a house writing style, all without training.

**Common mistakes:**
- Using examples that all share the same label, which biases the model to repeat it.
- Believing the model has "learned" the task permanently. When the prompt ends, so does the learning.

**Exam angle:** in-context learning = learning from prompt examples with **no gradient updates**. Do not confuse it with fine-tuning.

> **සිංහලෙන්:** In-context learning කියන්නේ prompt එකේම උදාහරණ කිහිපයක් දීලා model එකට අලුත් වැඩක් උගන්නන එක, weights කිසිවක් වෙනස් නොකර. උදාහරණයක් විදිහට Daraz reviews දෙකක් POSITIVE/NEGATIVE කියලා පෙන්නලා තුන්වෙනි එක අහන්න පුළුවන්. උදාහරණ එකක් නැත්නම් zero-shot, එකක් one-shot, කිහිපයක් few-shot. උදාහරණ වලට tokens යන නිසා හැම request එකකම ගාස්තුව ටිකක් වැඩි වෙනවා. Prompt එක ඉවර වුණාම model එක ඒ ඉගෙන ගත්තු දේ තියාගන්නේ නෑ, ඒක fine-tuning වලට වඩා වෙනස්.

---

## 16. Base vs instruct models

**Why it exists:** a pretrained model only continues text, which is not what most people want. The instruct version is the same model taught to behave like an assistant.

| | **Base model** (pretrained) | **Instruct / chat model** (aligned) |
|---|---|---|
| Training | Next-token prediction on raw text | Base + **supervised fine-tuning (SFT)** on instruction-response examples + **preference tuning** (RLHF/DPO) (file 21) |
| Behaviour | **Continues** text; doesn't "answer" | Follows instructions, answers questions, refuses harmful requests |
| Prompt "What is the capital of France?" | Might continue: "What is the capital of Germany? What is the capital of Italy?..." (like a quiz list) | "The capital of France is Paris." |
| Use | Research, further fine-tuning, completion tasks | Chatbots, assistants, most applications |

On Hugging Face, look for names like `-Instruct`, `-Chat`, `-it`.

### Worked example: the same prompt, two models

Prompt: `Write a polite email asking my manager for leave on Friday.`

- **Base model:** may continue with more instructions in the same style: "Write a polite email asking for a salary raise. Write a polite email to a client..." because that is what such lists look like on the web.
- **Instruct model:** writes "Dear Mr. Perera, I would like to request leave this Friday, 14 March..."

Training pipeline in one picture:

```
raw text --pretrain--> BASE model --SFT--> follows instructions --preference tuning--> INSTRUCT / chat model
```

**Where you'll meet it in real work:** downloading a model from Hugging Face. Names ending `-Instruct`, `-Chat` or `-it` are ready to chat; plain names are base models, best used as the starting point for your own fine-tuning.

**Common mistakes:**
- Picking a base model for a chatbot and wondering why it rambles.
- Using the chat template on a base model, or no template on an instruct model.

**Exam angle:** base = next-token prediction only; instruct = base + SFT + preference tuning (RLHF/DPO). File 21 covers how.

> **සිංහලෙන්:** Base model එක කියන්නේ pretraining විතරක් කරපු model එක. ඒක ප්‍රශ්නයකට උත්තර දෙන්නේ නෑ, text එක දිගටම ලියනවා විතරයි. "Write a polite email" කිව්වම ඒ වගේම තවත් instructions ලියන්න පුළුවන්. Instruct model එක කියන්නේ ඒකටම SFT සහ RLHF/DPO කරලා උපදෙස් අනුගමනය කරන්න පුරුදු කරපු එක. Hugging Face එකේ "-Instruct" හෝ "-Chat" කියලා නමේ තියෙන ඒවා chatbot වලට, base ඒවා තවදුරටත් fine-tune කරන්න.

---

## 17. Hallucinations

**Why it matters:** hallucination is the biggest trust problem with LLMs. If you understand why it happens, you can design products that catch it instead of being surprised by it.

A **hallucination** is when an LLM generates content that is **fluent and confident but false or unsupported**: invented facts, fake citations, wrong numbers, non-existent APIs, made-up quotes.

**Example:** "Give me 3 research papers on X with DOIs" → realistic-looking titles, authors and DOIs that don't exist.

### Why it happens

1. **The objective rewards plausibility, not truth.** The model learned to produce text that **looks like** training text. A plausible-sounding citation has the right *form* even if it's not real.
2. **Knowledge is compressed and lossy.** Trillions of tokens squeezed into billions of parameters. Rare facts (a small company's founding date) are stored weakly or not at all.
3. **No built-in "I don't know".** Generation always produces *some* next token. Training and evaluation have often rewarded guessing over abstaining (a confident guess sometimes scores, "I don't know" never does).
4. **Autoregressive commitment** (section 8): once a wrong claim starts, the model tends to continue consistently with it.
5. **Knowledge cutoff:** questions about recent events.
6. **Ambiguous or false-premise prompts:** "Why did Einstein win the Nobel Prize in 1950?" (He won in 1921.) The model may go along with the premise.
7. **Sycophancy:** alignment training can make models agree with the user too readily (file 22).

### Types

- **Factual (extrinsic):** contradicts the world ("The Eiffel Tower is in Berlin")
- **Faithfulness (intrinsic):** contradicts the **provided source** (a summary adding things not in the document; a RAG answer not supported by the retrieved text)

### Reducing hallucinations

| Method | File |
|---|---|
| **Grounding with RAG:** give the model relevant documents and ask it to answer only from them | 23 |
| **Tools:** calculators, search, code execution, databases instead of memory | 24 |
| **Prompting:** allow "I don't know"; ask for quotes from the source first; ask for citations | 22 |
| **Lower temperature** for factual tasks | this file |
| **Verification:** a second pass checking claims (self-verification, Chain-of-Verification), or checking consistency across samples (SelfCheckGPT) | 22, 26 |
| **Better training:** reward calibrated uncertainty; fine-tune on domain data | 21 |
| **Evaluation:** measure faithfulness/factuality | 26 |
| **Human review** for high-stakes uses | 29 |

You **cannot eliminate** hallucinations completely today. Design systems assuming they will happen.

### Worked example: a plausible but fake answer

Question (in English): "Who wrote the 2015 Kandy novel *The Song of the Hills*?" If no such book exists, a model may still answer "Dr. Prasanna Bandara", because after "The novel was written by" a Sri Lankan name has high probability. The sentence has the right *shape* but no truth behind it.

A real-world warning: in a 2023 US court case, lawyers submitted a legal brief containing court cases that an AI chatbot had invented. The court sanctioned them. Always verify.

### Using logprobs to flag shaky answers

| Token generated | Probability | Reading |
|---|---|---|
| "Paris" (capital of France) | 0.98 | Confident |
| "Bandara" (invented author) | 0.18 | Uncertain: worth a check |

A low probability is a hint, not proof, because models can also be confidently wrong.

### Worked example: choosing the fix

| Situation | Best fix |
|---|---|
| Bot must answer from the company HR policy | RAG, answer only from retrieved text |
| Bot does arithmetic on invoices | Calculator / code tool |
| Medical or legal advice | Human review plus citations |
| Model invents facts when it does not know | Prompt: "say I don't know if the context does not contain the answer" |

**Analogy:** a student in a viva who does not know the answer but fears losing marks, so they say something confident and wrong. Training that rewards guessing creates the same habit.

**Common mistakes:**
- Believing a confident, well-formatted answer is correct.
- Thinking a bigger model never hallucinates. It does so less often but never zero.

**Exam angle:** distinguish factual hallucination from faithfulness hallucination, and know the standard mitigations (RAG, tools, prompting, verification, human review).

> **සිංහලෙන්:** Hallucination කියන්නේ model එක ඇත්ත වගේ ඇහෙන ඒත් බොරු දෙයක් විශ්වාසයෙන් කියන එක. Viva එකක උත්තරේ නොදන්න ළමයා "දන්නේ නෑ" කිව්වොත් ලකුණු නෑ කියලා හිතලා ඇත්ත වගේ උත්තරයක් කියනවා වගේ තමයි. නැති පොතක කතුවරයා ගැන ඇහුවොත් "ආචාර්ය ප්‍රසන්න බණ්ඩාර" වගේ ඇත්ත වගේ නමක් හදලා දෙන්න පුළුවන්, මොකද "කතුවරයා" කියන තැනට සිංහල නමක් එන්න තියෙන probability එක ඉහළයි. ඒක අඩු කරන්න RAG, tools, "දන්නේ නැත්නම් දන්නේ නෑ කියන්න" කියන prompt එක, සහ මිනිස් පරීක්ෂාව පාවිච්චි කරන්න.

---

## 18. Other limitations

**Why it matters:** an LLM is a tool with known weak spots. Listing them lets you pick the right guardrail for each, instead of trusting the model blindly.

| Limitation | Notes |
|---|---|
| **Statelessness** | No memory between calls (section 6) |
| **Knowledge cutoff** | Stale knowledge without tools/RAG |
| **Arithmetic and counting** | Tokenisation and next-token generation make exact maths unreliable → use a code/calculator tool |
| **Lost in the middle** | Weaker use of information buried in long contexts |
| **Sensitivity to wording** | Small prompt changes can change answers (file 22) |
| **Sycophancy** | Agreeing with the user's wrong claims |
| **Bias** | Learned from training data (file 29) |
| **Prompt injection** | Instructions hidden in input can hijack the model (files 22, 29) |
| **Non-determinism** | Different runs, different answers |
| **Cost and latency** | Large models are expensive and slow (file 27) |

### Worked example: matching problem to fix

| Symptom you see | Likely limitation | Practical fix |
|---|---|---|
| Bot cannot recall what the user said 10 messages ago | Statelessness / truncated history | Resend or summarise history |
| Answer about last month's policy is wrong | Knowledge cutoff | RAG or a search tool |
| 17 × 389 is wrong | Weak arithmetic | Calculator or code tool |
| Answer changes after reordering the prompt | Sensitivity to wording | Test several phrasings; fix a template |
| Customer pastes "ignore your rules" | Prompt injection | Input checks, least-privilege tools (file 29) |

**Where you'll meet it in real work:** in the design review of any LLM feature: for each row above, ask "what happens if this limitation hits us?"

**Common mistake:** fixing a limitation with a bigger model alone. A bigger model reduces some of them, but statelessness, cutoff and injection need system-level answers.

**Exam angle:** trustworthy-AI questions often list limitations and ask which mitigation fits.

> **සිංහලෙන්:** LLM එකකට දුර්වලකම් කීපයක් තියෙනවා. ඒකට මතකයක් නෑ (stateless), training data එක ඉවර වුණ දවසින් පස්සේ දේවල් දන්නේ නෑ (knowledge cutoff), ගණිතය සහ අකුරු ගණන් කිරීම දුර්වලයි, prompt එකේ වචන පොඩ්ඩක් වෙනස් කළාම උත්තරේ වෙනස් වෙන්න පුළුවන්. ඒ හැම එකටම ඇතුළත් විසඳුමක් තියෙනවා: history ආයෙත් යවන්න, RAG පාවිච්චි කරන්න, calculator tool දෙන්න. ලොකු model එකක් විතරක් ගත්තාට මේ හැම ගැටළුවක්ම විසඳෙන්නේ නෑ, system එක හරියට design කරන්න ඕනේ.

---

## 19. Reasoning models

**Why it exists:** some problems (maths, code, planning) need many careful steps. Instead of only making the model bigger, reasoning models give it "thinking time" to work the steps out before answering.

**Test-time compute** (or inference-time compute): letting the model **spend more computation while answering** to get better results, instead of only making the model bigger.

**Chain-of-thought (CoT):** writing intermediate reasoning steps before the final answer improves accuracy on maths, logic and multi-step problems ([file 22](22-prompt-engineering.md)). Each written step is extra computation the model can build on (since it reads its own previous tokens).

**Reasoning models** (e.g. OpenAI o-series, DeepSeek-R1, Claude with extended thinking, Gemini thinking models) are trained, largely with **reinforcement learning** on problems with checkable answers (maths, code, file 21), to produce long internal reasoning ("thinking tokens") before answering: exploring approaches, checking work, backtracking.

- ✅ Much better at maths, coding, science, planning
- ❌ Slower and more expensive (many thinking tokens); can **overthink** simple questions; reasoning text isn't always a faithful picture of what actually drove the answer

Other test-time compute methods: **self-consistency** (sample several answers, take a majority vote), **best-of-N with a verifier** (generate N answers, pick the one a checker rates best), search over reasoning paths (file 22).

### Worked example: chain-of-thought on a Keells bill

Question: 1 mango costs Rs. 120. Buying 5 gets a 10% discount. You pay with Rs. 1,000. What is your change?

- Direct answer: a model might blurt "Rs. 400" (wrong).
- With step-by-step thinking:
  1. 5 × 120 = 600
  2. 10% of 600 = 60
  3. Pay 600 − 60 = 540
  4. Change = 1,000 − 540 = **Rs. 460**

### Worked example: self-consistency

Ask the same question 5 times at temperature 0.8: answers 460, 460, 400, 460, 450. Majority vote: **460** (3 of 5). If each sample is independently right 60% of the time, the chance that a majority of 5 is right is
P(≥3 of 5) = 10 × 0.6³ × 0.4² + 5 × 0.6⁴ × 0.4 + 0.6⁵ = 0.3456 + 0.2592 + 0.0778 ≈ **0.68** (68% instead of 60%). The catch: 5× the cost, and it only works if errors are not all the same.

### Worked example: what thinking costs

A reasoning model writes 3,000 thinking tokens plus a 200-token answer. You pay for 3,200 output tokens, which is **16 times** the 200 you actually read. At $15 per 1M output tokens that is $0.048 per question instead of $0.003.

**Analogy:** in the O/L maths paper, "show your working" helps you catch your own mistakes. Test-time compute is giving yourself 10 minutes for a question instead of 1.

**Where you'll meet it in real work:** hard coding tasks, financial analysis and planning agents use reasoning models; simple FAQ replies do not need them.

**Common mistakes:**
- Using a slow reasoning model for easy lookups, which wastes money.
- Treating the displayed reasoning as a perfect record of why the model answered.

**Exam angle:** know chain-of-thought, self-consistency, best-of-N with a verifier, and that these trade cost and latency for accuracy.

> **සිංහලෙන්:** Reasoning model එකක් උත්තරේ දෙන්න කලින් හිතනවා, O/L ගණිතයේ "වැඩ පෙන්වන්න" කියනවා වගේ. අඹ 5ක් රු. 120 බැගින්, 10% discount, රු. 1,000 දුන්නොත්: 600 − 60 = 540, ඉතුරු 1,000 − 540 = රු. 460. පියවර ලිව්වාම වැරදි අඩුයි. Self-consistency කියන්නේ එකම ප්‍රශ්නේ 5 පාරක් ඇහුවම 460, 460, 400, 460, 450 ආවොත් බහුතරය (460) ගන්න එක. හිතන tokens 3,000ක් + උත්තරය 200ක් නම් ගෙවන්නේ 3,200කට, ඒ කියන්නේ සාමාන්‍ය උත්තරයට වඩා 16 ගුණයක්.

---

## 20. Open vs closed models

**Why it matters:** the choice between an API model and a model you host yourself decides your costs, your privacy position and how much engineering you must do.

| | **Closed (proprietary)** | **Open-weight** |
|---|---|---|
| Examples | GPT (OpenAI), Claude (Anthropic), Gemini (Google) | Llama (Meta), Mistral, Qwen (Alibaba), DeepSeek, Gemma (Google), Phi (Microsoft) |
| Access | API only | Download weights, run anywhere |
| Strengths | Typically the most capable; no infrastructure to manage; regularly updated | Full control; data stays on your servers (privacy); can fine-tune freely; predictable cost at scale; offline use |
| Weaknesses | Data leaves your environment; vendor dependence; less control; per-token costs | You manage GPUs/serving; usually somewhat behind the frontier; responsibility for safety |

**"Open-weight" vs "open-source":** most "open" LLMs release the **weights** but not the full training data or code. Also check the **licence**: some allow any commercial use (Apache 2.0, MIT), others have restrictions (e.g. user-count limits or acceptable-use policies) (file 29).

**Model sizes and where they run** (rough, with 4-bit quantisation, file 27):

| Size | Runs on | Typical use |
|---|---|---|
| 1 to 4B | Phone, laptop CPU | Simple tasks, on-device |
| 7 to 14B | Laptop/desktop GPU (8 to 16 GB) | Good general assistant, RAG, classification |
| 30 to 70B | One or two large GPUs | Strong general use |
| 100B to 1T+ (often MoE) | Multi-GPU servers | Frontier-level open models |

**Choosing a model:** start with the best affordable model to prove the task works; then try smaller/cheaper models and measure whether quality holds (file 26). Consider privacy, latency, cost, language support (e.g. Sinhala quality) and licence.

### Worked example: memory to host a model yourself

Weights only, ignoring the KV cache:
- 7B at 16-bit: 7B × 2 bytes = **14 GB**
- 7B at 4-bit: 7B × 0.5 bytes = **3.5 GB** (fits a laptop GPU)
- 70B at 4-bit: 70B × 0.5 bytes = **35 GB** (one big GPU)

### Worked example: API or self-host?

Illustrative numbers only. The bot from section 6 costs about $105/day on an API ($3,150/month). Suppose renting a GPU server that can run an open 8B model costs $2 per hour:
2 × 24 × 30 = **$1,440/month**, plus engineering time for monitoring and updates. At low volume the API is cheaper (no idle GPU); at high, steady volume self-hosting can win, and the data never leaves your server.

| Question | Leans to closed API | Leans to open-weight |
|---|---|---|
| Need the strongest quality quickly? | Yes | |
| Customer data must stay in Sri Lanka? | | Yes |
| Small team, no GPU skills? | Yes | |
| Heavy steady traffic, tight budget? | | Yes |

**Analogy:** a closed model is a PickMe ride (they own the car and driver; you pay per trip). An open-weight model is your own tuk-tuk (you control it, but fuel and repairs are yours).

**Common mistakes:**
- Calling an open-weight model "open source" without checking whether data and code are released.
- Ignoring the licence when using a model commercially.

**Exam angle:** know the trade-offs and that "open-weight" means downloadable weights, not necessarily open training data.

> **සිංහලෙන්:** Closed model එකක් කියන්නේ PickMe ride එකක් වගේ, ඔයා ගමනකට ගෙවනවා, වාහනය ඔවුන්ගේ. Open-weight model එකක් කියන්නේ ඔයාගේම tuk-tuk එක, ඕනේ විදිහට වෙනස් කරන්න පුළුවන්, ඒත් fuel සහ repairs ඔයාගේ වගකීම. Parameters බිලියන 7ක් 4-bit වලදී GB 3.5යි, 16-bit වලදී GB 14යි. Users ගොඩක් නැති අතරේ API එක ලාභයි, traffic ගොඩක් සහ customer data රටෙන් පිට යන්න බැරි නම් open-weight model එකක් ඔයාගේම server එකේ දුවන්න හොඳයි. Licence එකත් බලන්න.

---

## 21. The life of a prompt

**Why it exists:** the earlier sections described each part on its own. Following one prompt from end to end shows how they fit into a single machine.

You send: *"Explain photosynthesis in one sentence."* to a chat API.

1. **Chat template:** the API wraps your message with the system prompt and role tokens (section 5).
2. **Tokenisation:** text → ~30 token IDs (section 2).
3. **Embedding:** each ID → a d_model vector ([file 19](19-transformers.md#2-token-embeddings)).
4. **Prefill:** all tokens flow through every Transformer block in parallel: attention (with RoPE positions, causal mask) and FFN, filling the **KV cache** (section 12).
5. **LM head + softmax:** the last position's vector → probabilities over the ~100k-token vocabulary (section 7).
6. **Decoding:** apply temperature/top-p, sample the first token, e.g. "Photos" (section 10).
7. **Decode loop:** feed the new token in (reusing the KV cache), get the next distribution, sample, repeat; **stream** each token back to you (section 8).
8. **Stop:** the model emits an end-of-turn token, or max_tokens is reached (section 11).
9. **Detokenise:** IDs → text: "Photosynthesis is the process by which plants use sunlight, water and carbon dioxide to make glucose and release oxygen."
10. **Billing:** you're charged for input + output tokens (section 6).

Next time, the API won't remember this exchange unless you send it again.

### Worked example: counting the work and the bill

Say the prompt becomes 30 tokens (with the system prompt and template), and the answer is 26 tokens.

- **Forward passes:** 1 prefill pass (which also produces the first answer token) + 25 decode passes ≈ **26 passes**.
- **Cost** at $3 per 1M input and $15 per 1M output (illustrative):
  - Input: 30 ÷ 1,000,000 × $3 = $0.00009
  - Output: 26 ÷ 1,000,000 × $15 = $0.00039
  - Total ≈ **$0.0005**, about two hundredths of a US cent per question
- At 10,000 such questions a day: about $5 per day.

### The whole journey, one picture

```
text -> template -> tokens -> embeddings -> [Transformer blocks + KV cache]
     -> logits -> softmax -> sample (T, top-p) -> token -> loop until EOS -> text
```

**Where you'll meet it in real work:** debugging. When an answer is slow, check prefill (long prompt). When it is wrong, check the prompt, the retrieved context and the sampling settings. When the bill is high, count tokens.

**Common mistake:** assuming the model "remembers" this exchange next time. It does not; you must resend it.

**Exam angle:** be able to order the steps: template, tokenise, embed, prefill, logits, decode with sampling, stop, detokenise.

> **සිංහලෙන්:** Prompt එකක් යවපු ගමන අතරමඟ වෙන දේවල් පිළිවෙළට මෙහෙමයි: chat template එක දානවා, text එක tokens වලට කඩනවා, embeddings වලට හරවනවා, prefill එකේදී prompt එක සම්පූර්ණයෙන් Transformer හරහා යවලා KV cache එක පුරවනවා. ඊට පස්සේ logits වලින් probabilities හදලා temperature/top-p යොදලා token එකක් තෝරනවා, ඒක ආපහු දාලා EOS එක එනකන් ආයෙත් කරනවා. Tokens 30ක් input සහ 26ක් output නම් ගාස්තුව ඩොලර් 0.0005ක් විතරයි. ඊළඟ පාරට model එක මේක මතක තියාගන්නේ නෑ, ඔයා ආයෙත් යවන්න ඕනේ.

```quiz
[{"q": "A 3,000-word English document is roughly how many tokens?", "options": ["About 750", "About 2,250", "About 4,000", "About 12,000"], "answer": 2, "why": "1 token is about 0.75 words, so 3,000 ÷ 0.75 = 4,000. 2,250 comes from multiplying by 0.75 instead of dividing, the tempting mistake."}, {"q": "In BPE, what does each training step do?", "options": ["Splits the rarest word into letters", "Merges the most frequent adjacent pair of symbols into a new token", "Deletes tokens that never appear", "Replaces each word with its dictionary meaning"], "answer": 1, "why": "BPE repeatedly merges the most frequent adjacent pair. It uses frequency only; it does not look up meanings."}, {"q": "Logits are [2.0, 1.0, 0.0]. At temperature 0.5, which description of the output distribution is correct?", "options": ["Flatter than at T = 1, with probabilities near 1/3 each", "Identical to T = 1", "Sharper than at T = 1: [0.867, 0.117, 0.016]", "All probability on the last token"], "answer": 2, "why": "Dividing by 0.5 gives [4, 2, 0], so the top token gets 54.6 / 62.99 = 0.867. Low T sharpens; high T flattens, which is the tempting reverse."}, {"q": "Probabilities sorted: [0.50, 0.30, 0.15, 0.05]. With top-p = 0.9 which tokens stay?", "options": ["Only the first", "The first two", "The first three", "All four"], "answer": 2, "why": "Cumulative sums are 0.50, 0.80, 0.95. We need to reach at least 0.9, which happens at the third token. Stopping at two (0.80) falls short of 0.9."}, {"q": "An API charges $2 per 1M input tokens and $8 per 1M output tokens. One request has 1,500 input and 500 output tokens. What does it cost?", "options": ["$0.004", "$0.007", "$0.010", "$0.0035"], "answer": 1, "why": "Input: 1,500/1,000,000 × 2 = $0.003. Output: 500/1,000,000 × 8 = $0.004. Total $0.007. $0.004 forgets the input cost."}, {"q": "Why does the KV cache make generation faster?", "options": ["It stores final answers to reuse in later chats", "It stores the keys and values of earlier tokens so each new token computes only its own", "It shrinks the vocabulary", "It removes the need for softmax"], "answer": 1, "why": "The cache avoids recomputing K and V for all previous tokens at every step. It does not store answers across conversations, the tempting first option."}, {"q": "A base model is asked \"What is 2+2?\" and replies \"What is 3+3? What is 4+4?\". The best explanation is:", "options": ["It is broken", "It only continues text and has not been instruction-tuned", "Its temperature is too low", "Its context window is full"], "answer": 1, "why": "Base models are trained to continue text, and a quiz list is a plausible continuation. Temperature or context size would not produce this particular behaviour."}, {"q": "Which is the strongest mitigation for a bot that must answer from the company's current HR policy?", "options": ["Raise the temperature", "Use a bigger base model", "Ground it with RAG over the policy documents", "Increase max_tokens"], "answer": 2, "why": "RAG supplies the real, current text. A bigger model still has a knowledge cutoff and can hallucinate. Higher temperature makes hallucination more likely."}]
```

---

## 22. Check yourself

**Q1.** Roughly how many tokens is a 3,000-word English document? Why would the same content in Sinhala use more?
<details><summary>Answer</summary>≈ 4,000 tokens (3,000 ÷ 0.75). Tokenisers are trained mostly on English, so Sinhala is split into many more, smaller pieces (and each character is 3 bytes in UTF-8).</details>

**Q2.** In BPE, what's merged at each step?
<details><summary>Answer</summary>The most frequent adjacent pair of symbols in the training corpus, which becomes a new vocabulary symbol.</details>

**Q3.** Why do LLMs struggle to count the letters in a word?
<details><summary>Answer</summary>They see subword tokens, not individual characters.</details>

**Q4.** Logits [1, 0] for tokens [A, B]. Compute P(A) at T = 1 and T = 0.5.
<details><summary>Answer</summary>T=1: e¹/(e¹+e⁰) = 2.718/3.718 ≈ **0.731**. T=0.5: logits [2, 0] → 7.389/8.389 ≈ **0.881**.</details>

**Q5.** Probabilities [0.5, 0.3, 0.1, 0.05, 0.05]. With top-p = 0.85, which tokens remain?
<details><summary>Answer</summary>Cumulative: 0.5, 0.8, 0.9 ≥ 0.85 → the first **three** tokens.</details>

**Q6.** Which settings for (a) extracting fields from invoices into JSON, (b) writing poems?
<details><summary>Answer</summary>(a) temperature 0 to 0.2 (plus structured output). (b) temperature ~0.8 to 1.0 with top-p ~0.95.</details>

**Q7.** Your chatbot forgot what the user said 3 messages ago. Why might that happen?
<details><summary>Answer</summary>LLMs are stateless; the app must resend history. It may have truncated history to fit the context window or budget, or failed to include it.</details>

**Q8.** What is the KV cache and why does it make generation faster?
<details><summary>Answer</summary>Stored keys and values of all previous tokens for each layer; each new token only computes its own K/V/Q instead of recomputing the whole sequence.</details>

**Q9.** Using FLOPs ≈ 6ND, how much compute to train a 1B-parameter model on 20B tokens?
<details><summary>Answer</summary>6 × 10⁹ × 2×10¹⁰ = **1.2 × 10²⁰ FLOPs**.</details>

**Q10.** By the Chinchilla rule, how many tokens for a compute-optimal 13B model?
<details><summary>Answer</summary>≈ 20 × 13B = **260B tokens**.</details>

**Q11.** You ask a base model "What is 2+2?" and it replies "What is 3+3? What is 4+4?". Why?
<details><summary>Answer</summary>A base model only continues text; it hasn't been instruction-tuned, so it continued the pattern of a quiz list.</details>

**Q12.** Give three causes of hallucination and three mitigations.
<details><summary>Answer</summary>Causes: training rewards plausible text; lossy knowledge of rare facts; no default abstention; knowledge cutoff; false premises. Mitigations: RAG grounding, tools, allowing "I don't know", low temperature, verification, citations.</details>

**Q13.** API price: $1/M input, $4/M output. 1M requests/month, 800 input + 200 output tokens each. Monthly cost?
<details><summary>Answer</summary>Input 800M tokens → $800. Output 200M → $800. Total **$1,600**.</details>

**Q14.** A chat has a 100-token system prompt, and each turn adds a 50-token user message and a 250-token reply. How many input tokens are sent on turn 4?
<details><summary>Answer</summary>100 + 3 × (50 + 250) + 50 = **1,050** tokens (the whole history plus the new message).</details>

**Q15.** Two paths: A has step probabilities 0.6 and 0.3; B has 0.5 and 0.7. Which would greedy pick, and which has the higher total probability?
<details><summary>Answer</summary>Greedy takes A at step 1 (0.6 > 0.5), giving 0.6 × 0.3 = 0.18. B gives 0.5 × 0.7 = **0.35**, which is higher, so beam search would find it.</details>

**Q16.** Why does a 500-token answer without a KV cache need about 125,250 token computations?
<details><summary>Answer</summary>Each step recomputes all previous tokens: 1 + 2 + ... + 500 = 500 × 501 ÷ 2 = 125,250. With a cache each step computes only the new token: 500 in total.</details>

---

## 23. New words in this file

| Word | Meaning |
|---|---|
| LLM | Large decoder-only Transformer trained on next-token prediction, then aligned |
| Token, vocabulary, token ID | Text chunk / set of chunks / its integer |
| Tokeniser | Program converting text ↔ tokens |
| BPE, byte-level BPE | Merge-most-frequent-pair algorithm / starting from bytes |
| WordPiece, Unigram, SentencePiece, tiktoken | Other tokeniser algorithms/libraries |
| Glitch token | Rare token causing odd behaviour |
| Special tokens: BOS, EOS, PAD | Start, end, padding markers |
| Roles: system, user, assistant, tool | Chat message types |
| Chat template | Format turning messages into one token sequence |
| Context window / length, truncation | Max tokens in+out / cutting text to fit |
| Stateless | No memory between calls |
| Lost in the middle, effective context | Weaker use of mid-context info / usable context length |
| Per-token pricing, input vs output tokens | API billing model |
| Prompt caching (preview) | Discounted reuse of a repeated prompt prefix |
| Next-token prediction, logits, logprobs | Core task / raw scores / log-probabilities |
| Autoregressive generation, streaming | One token at a time fed back / sending tokens as produced |
| Decoding strategy | How the next token is chosen |
| Greedy decoding, beam search, length penalty | Argmax / keep top-B sequences / favour longer outputs |
| Sampling, temperature | Random choice by probability / sharpness control |
| Top-k, top-p (nucleus), min-p | Filtering candidate tokens before sampling |
| max_tokens, stop sequence, finish reason | Output length cap / ending strings / why generation stopped |
| Repetition / frequency / presence penalty, logit bias | Controls on token choice |
| Seed, non-determinism | Repeatability / run-to-run variation |
| Constrained decoding / structured output (preview) | Forcing valid formats (file 22) |
| KV cache | Stored keys/values for fast generation |
| Prefill vs decode | Process prompt in parallel vs generate token by token |
| TTFT, time per output token | Latency measures (file 27) |
| Compute-bound vs memory-bandwidth-bound | Limited by maths vs data movement |
| PagedAttention, vLLM (preview) | Efficient KV memory management / serving engine |
| Pretraining, corpus, Common Crawl | First training phase / text collection / web scrape |
| Deduplication, data mixture | Removing repeats / balance of data sources |
| FLOP, 6ND rule | Floating-point operation / training compute estimate |
| Knowledge cutoff | Date after which the model has no training data |
| Scaling laws, power law | Predictable improvement with scale |
| Chinchilla, compute-optimal, ~20 tokens/parameter | Optimal data/size balance |
| Over-training for inference | Smaller model, more data, cheaper to run |
| Emergent abilities | Capabilities appearing with scale |
| In-context learning, zero/one/few-shot | Learning from prompt examples |
| Base model vs instruct/chat model | Raw continuation vs aligned assistant |
| SFT, RLHF, DPO (preview) | Alignment methods (file 21) |
| Hallucination: factual vs faithfulness | Made-up content: contradicts world vs contradicts source |
| Grounding | Basing answers on provided sources |
| Sycophancy | Agreeing too readily with the user |
| Test-time compute | Spending more computation while answering |
| Chain-of-thought (CoT) | Writing reasoning steps before answering |
| Reasoning model, thinking tokens | Model trained to reason at length before answering |
| Self-consistency, best-of-N, verifier | Sample many, vote / pick best by checker |
| Overthinking | Excessive reasoning on easy problems |
| Closed vs open-weight models | API-only vs downloadable weights |
| Licence (Apache 2.0, MIT, custom) | Terms of use |
| Few-shot cost, presence vs frequency penalty | Examples add input tokens / flat vs count-based repeat penalty |
| Self-supervised (pretraining) | Labels (next tokens) come from the data itself |
| Over-training ratio (tokens per parameter) | Chinchilla ~20; Llama-3-8B ~1,875 |
| Faithfulness hallucination | Answer contradicts the supplied source |
| Open-weight vs open-source | Downloadable weights vs fully open code and data |

**Next:** [21-training-finetuning-alignment.md](21-training-finetuning-alignment.md)
