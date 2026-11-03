# 17: Sequence Models: RNNs, LSTMs, Seq2Seq, and the Birth of Attention

> **Before you start:** [05](05-math-linear-algebra.md) (dot product, matrix multiplication, cosine similarity), [06](06-math-calculus.md) (chain rule, vanishing/exploding gradients), [07](07-math-probability-statistics.md) (softmax), [15](15-neural-networks.md) (neurons, tanh/sigmoid, embedding layers, gradient clipping, PyTorch).
>
> **After this file you can:** explain why sequences need special models; how RNNs, LSTMs and GRUs work; what encoder-decoder (seq2seq) models are; why they struggled; and how **attention** was invented to fix them. This is the direct bridge to Transformers and LLMs.

---

## Table of contents

1. [What is sequential data?](#1-what-is-sequential-data)
2. [Why MLPs and CNNs aren't enough](#2-why-mlps-and-cnns-arent-enough)
3. [Recurrent Neural Networks (RNNs)](#3-recurrent-neural-networks)
4. [Sequence task shapes](#4-sequence-task-shapes)
5. [Training RNNs: backpropagation through time](#5-backpropagation-through-time)
6. [The long-term memory problem](#6-the-long-term-memory-problem)
7. [LSTM: Long Short-Term Memory](#7-lstm)
8. [GRU: Gated Recurrent Unit](#8-gru)
9. [Bidirectional and stacked RNNs](#9-bidirectional-and-stacked-rnns)
10. [Sequence-to-sequence (encoder-decoder) models](#10-sequence-to-sequence)
11. [Teacher forcing and decoding](#11-teacher-forcing-and-decoding)
12. [The bottleneck problem](#12-the-bottleneck-problem)
13. [Attention: the big idea](#13-attention-the-big-idea)
14. [Attention step by step (worked example)](#14-attention-worked-example)
15. [Why RNNs were replaced: on to Transformers](#15-why-rnns-were-replaced)
16. [Check yourself](#16-check-yourself)
17. [New words in this file](#17-new-words-in-this-file)

---

## 1. What is sequential data?

**Sequential data** = data where **order matters**.

| Data | Sequence of |
|---|---|
| Text | words / characters / tokens |
| Speech | audio samples over time |
| Stock prices, sensor readings | values over time ([time series, file 10](10-data-science-workflow.md#14-time-series-basics)) |
| Video | frames |
| DNA | bases (A, C, G, T) |
| User activity | clicks, purchases |

"Dog bites man" and "man bites dog" have the same words but very different meanings. A model must understand **order** and **context**.

---

## 2. Why MLPs and CNNs aren't enough

- **Variable length:** sentences can be 3 words or 300. An MLP needs a fixed input size.
- **Order:** a "bag of words" (just counting words, file 18) loses order.
- **Long-range dependencies:** in "The **keys** that I left on the kitchen table yesterday **are** missing", the verb "are" must agree with "keys", many words earlier.
- **Parameter sharing across positions:** the meaning of a word shouldn't need separate weights for position 1 vs position 50.

---

## 3. Recurrent Neural Networks

**Idea:** process the sequence **one step at a time**, keeping a **hidden state** (a memory vector) that is updated at each step and carries information forward.

**Analogy:** reading a book one word at a time. You keep a running "summary in your head". Each new word updates that summary.

```
         h₀ → [RNN cell] → h₁ → [RNN cell] → h₂ → [RNN cell] → h₃
                 ↑               ↑               ↑
                 x₁              x₂              x₃
               "The"           "cat"           "sat"

  "Unrolled" view: it's the SAME cell (same weights) applied at every step.
```

### The RNN equation

At each time step t:

```
hₜ = tanh( W_x · xₜ  +  W_h · hₜ₋₁  +  b )
```

- **xₜ** = input at step t (e.g. the embedding of word t, [file 15](15-neural-networks.md#16-embedding-layers))
- **hₜ₋₁** = previous hidden state (the memory so far)
- **W_x, W_h, b** = weights, **shared across all time steps**
- **tanh** keeps values between −1 and 1 ([file 04](04-math-numbers-and-functions.md#16-common-function-shapes-youll-meet-in-ai))
- Optional output at each step: yₜ = W_y · hₜ

### Tiny worked example (1-number hidden state)

W_x = 0.5, W_h = 0.8, b = 0, h₀ = 0. Inputs x = [1, 0, 0, 0].

| t | xₜ | calculation | hₜ |
|---|---|---|---|
| 1 | 1 | tanh(0.5×1 + 0.8×0) = tanh(0.5) | **0.462** |
| 2 | 0 | tanh(0 + 0.8×0.462) = tanh(0.370) | **0.354** |
| 3 | 0 | tanh(0.8×0.354) = tanh(0.283) | **0.276** |
| 4 | 0 | tanh(0.8×0.276) | **0.218** |

The "memory" of the first input fades a little each step. Over 50 steps it would be nearly gone. Keep this in mind for section 6.

```python
import torch, torch.nn as nn
rnn = nn.RNN(input_size=50, hidden_size=128, batch_first=True)
x = torch.randn(4, 10, 50)          # batch of 4 sequences, length 10, 50 features per step
outputs, h_last = rnn(x)
outputs.shape   # (4, 10, 128)  hidden state at every step
h_last.shape    # (1, 4, 128)   final hidden state
```

---

## 4. Sequence task shapes

```
one-to-one      one-to-many       many-to-one        many-to-many         many-to-many
(normal net)    (captioning)      (sentiment)        (translation)        (tagging)
   y              y y y              y                     y y y         y y y
   ↑              ↑ ↑ ↑              ↑                     ↑ ↑ ↑         ↑ ↑ ↑
   □              □→□→□           □→□→□           □→□→□ → □→□→□         □→□→□
   ↑              ↑               ↑ ↑ ↑           ↑ ↑ ↑                  ↑ ↑ ↑
   x              x               x x x           x x x                  x x x
```

| Shape | Example |
|---|---|
| **Many-to-one** | Sentiment of a review (positive/negative); classify a sensor sequence |
| **One-to-many** | Image captioning (one image → many words); music generation |
| **Many-to-many (aligned)** | Tag each word with its part of speech; named entity recognition (file 18) |
| **Many-to-many (seq2seq)** | Translation; summarisation; speech-to-text (input and output lengths differ) |

---

## 5. Backpropagation through time

To train an RNN, unroll it over the sequence (it's then just a deep network with shared weights) and apply backpropagation ([file 15](15-neural-networks.md#8-backpropagation-worked-example)). This is called **Backpropagation Through Time (BPTT)**.

The gradient for the shared weights sums contributions from every time step.

**Truncated BPTT:** for very long sequences, only backpropagate through the last k steps (e.g. 100) to save memory and time.

---

## 6. The long-term memory problem

To learn that "are" depends on "keys" 10 words earlier, the gradient must flow back through 10 steps. At each step it's multiplied by (roughly) W_h and tanh's derivative ([file 06](06-math-calculus.md#11-the-chain-rule)).

- If those factors are < 1 → gradient shrinks exponentially → **vanishing gradient** → the RNN can't learn long-range dependencies. In practice, plain RNNs struggle beyond ~10 to 20 steps.
- If > 1 → **exploding gradient** → unstable training → fixed with **gradient clipping** ([file 15](15-neural-networks.md#12-vanishing-and-exploding-gradients)).

Exploding is easy to fix. Vanishing needs a new design: the **LSTM**.

---

## 7. LSTM

**LSTM (Long Short-Term Memory)**, 1997, adds a separate **cell state** cₜ: a "conveyor belt" of memory running along the sequence, plus **gates** that control what to forget, what to add, and what to output.

**Analogy:** a notebook (cell state) plus three decisions at each step:
1. **Forget gate:** "Which old notes should I erase?"
2. **Input gate:** "Which new information should I write down?"
3. **Output gate:** "What part of my notes should I share right now?"

A **gate** is a sigmoid layer: outputs between 0 (block everything) and 1 (let everything through), multiplied element-wise ([file 05](05-math-linear-algebra.md#3-vector-operations)) with what it controls.

```
            cₜ₋₁ ──(×fₜ)──────(+)──────────────► cₜ   (cell state: the conveyor belt)
                               ↑                  │
                         (iₜ × c̃ₜ)                tanh
                                                  │
                                                 (×oₜ) ──► hₜ
   inputs at each step: xₜ and hₜ₋₁ → compute fₜ, iₜ, c̃ₜ, oₜ
```

**Equations** (σ = sigmoid, ⊙ = element-wise multiply, [hₜ₋₁, xₜ] = the two vectors joined together):

```
fₜ = σ(W_f·[hₜ₋₁, xₜ] + b_f)       forget gate
iₜ = σ(W_i·[hₜ₋₁, xₜ] + b_i)       input gate
c̃ₜ = tanh(W_c·[hₜ₋₁, xₜ] + b_c)    candidate new memory
cₜ = fₜ ⊙ cₜ₋₁ + iₜ ⊙ c̃ₜ           update cell state
oₜ = σ(W_o·[hₜ₋₁, xₜ] + b_o)       output gate
hₜ = oₜ ⊙ tanh(cₜ)                  new hidden state
```

**Why it solves vanishing gradients:** the cell state is updated by **addition** (cₜ = f·cₜ₋₁ + ...). If the forget gate stays near 1, information and gradients flow back almost unchanged for long distances, the same "gradient highway" idea as residual connections ([file 15](15-neural-networks.md#15-residual-connections)).

**Tiny example (1-number cell):** cₜ₋₁ = 2.0, forget gate f = 0.9, input gate i = 0.3, candidate c̃ = 1.0
cₜ = 0.9 × 2.0 + 0.3 × 1.0 = 1.8 + 0.3 = **2.1**: mostly kept the old memory, added a little new.

**Parameters:** 4 sets of weights (f, i, c̃, o), so ~4× a plain RNN of the same size.

LSTMs powered Google Translate, Siri and speech recognition around 2014 to 2017.

---

## 8. GRU

**GRU (Gated Recurrent Unit)**, 2014: a simplified LSTM with **two gates** and **no separate cell state**:
- **Update gate (zₜ):** how much of the old state to keep vs replace (combines forget + input)
- **Reset gate (rₜ):** how much of the past to use when computing the new candidate

```
hₜ = (1 − zₜ) ⊙ hₜ₋₁ + zₜ ⊙ h̃ₜ
```

Fewer parameters (3 weight sets), often trains faster, and performs similarly to LSTM on many tasks.

```python
lstm = nn.LSTM(input_size=50, hidden_size=128, num_layers=2, batch_first=True, dropout=0.2)
out, (h_n, c_n) = lstm(x)      # LSTM returns hidden AND cell states
gru = nn.GRU(input_size=50, hidden_size=128, batch_first=True)
out, h_n = gru(x)
```

---

## 9. Bidirectional and stacked RNNs

### Bidirectional RNN

Run one RNN left-to-right and another right-to-left, then join (concatenate) their hidden states at each position. Each position then knows about **both past and future** context.

"He said **Teddy** bears are cute" vs "He said **Teddy** Roosevelt was president": you need the words *after* "Teddy" to know if it's a toy or a person.

✅ Great for **understanding** tasks where the whole input is available (tagging, classification).
❌ Can't be used for **generation**, where you don't know the future yet.

(The same split, seeing both sides vs only the past, separates BERT from GPT in [file 19](19-transformers.md).)

### Stacked (deep) RNNs

Feed the hidden states of one RNN layer into another as inputs: `num_layers=2` or more. Each layer learns more abstract patterns.

### A complete sentiment classifier

```python
class SentimentLSTM(nn.Module):
    def __init__(self, vocab_size, emb_dim=100, hidden=128, n_classes=2):
        super().__init__()
        self.emb = nn.Embedding(vocab_size, emb_dim, padding_idx=0)
        self.lstm = nn.LSTM(emb_dim, hidden, batch_first=True, bidirectional=True)
        self.fc = nn.Linear(2 * hidden, n_classes)     # ×2 for both directions

    def forward(self, token_ids):                       # (batch, seq_len)
        x = self.emb(token_ids)                         # (batch, seq_len, emb_dim)
        _, (h_n, _) = self.lstm(x)                      # h_n: (2, batch, hidden)
        h = torch.cat([h_n[0], h_n[1]], dim=1)          # (batch, 2*hidden)
        return self.fc(h)                               # logits
```

**Padding:** sequences in a batch have different lengths, so shorter ones are padded with a special ID (0 here) to make a rectangular tensor. `padding_idx=0` keeps the padding embedding at zero.

---

## 10. Sequence-to-sequence

**Seq2seq** (2014) handles tasks where input and output are sequences of **different lengths**, like translation:

"I love cats" (3 words) → "J'adore les chats" (3 words, but different alignment)
"How are you?" → "Kohomada?" (Sinhala: 1 word)

### Encoder-decoder architecture

```
            ENCODER                                   DECODER
  "I"  →[LSTM]→ "love" →[LSTM]→ "cats" →[LSTM]→ c ──► [LSTM]→ "J'adore"
                                            │          ↓
                                  context vector      [LSTM]→ "les"
                                  (the whole meaning    ↓
                                   squeezed into one   [LSTM]→ "chats"
                                   vector)              ↓
                                                       [LSTM]→ <END>
```

1. **Encoder:** reads the whole input and compresses it into a **context vector** (its final hidden state).
2. **Decoder:** starts from the context vector and generates the output **one token at a time**, each step taking the previously generated word as input, until it produces a special **<END>** (end-of-sequence) token.

This **encoder-decoder** pattern is fundamental. It reappears in the original Transformer, T5 (file 19), and speech models like Whisper (file 25).

---

## 11. Teacher forcing and decoding

### Teacher forcing (training)

During training, at each decoder step, feed the **correct** previous word (from the target), not the model's own (possibly wrong) prediction.

✅ Faster, more stable training.
❌ **Exposure bias:** at inference time the model must use its own predictions, which it never practised with during training, so early errors can snowball.

**This is exactly how LLMs are trained** (file 20): at every position, the model sees the true previous tokens and predicts the next one.

### Decoding (inference)

How to choose each output word from the predicted probabilities (softmax over the vocabulary, [file 07](07-math-probability-statistics.md#13-softmax)):
- **Greedy decoding:** pick the most probable word each step (argmax). Fast, but can miss better overall sentences.
- **Beam search:** keep the top k partial sentences ("beams") at each step and expand each one; pick the best complete sentence at the end. Better for translation.
- **Sampling** (temperature, top-k, top-p): randomly pick according to the probabilities. Used for creative text.

All of these are covered in depth in [file 20](20-how-llms-work.md).

---

## 12. The bottleneck problem

The encoder must squeeze **the entire input sentence into one fixed-size vector**. For long sentences, that's impossible without losing information. Translation quality dropped sharply for sentences longer than ~20 words.

**Analogy:** someone reads you a 50-word sentence once. You must remember it as a single thought, then translate it from memory. Hard! A human translator instead **looks back at the source sentence** as they write each word.

That's exactly what **attention** does.

---

## 13. Attention: the big idea

**Attention** (Bahdanau et al., 2014): at **each** decoder step, look back at **all** encoder hidden states (one per input word) and build a **custom context vector** that focuses on the most relevant input words for the word being generated right now.

```
Generating "chats" (cats):

Encoder states:   h("I")   h("love")   h("cats")
Attention weights:  0.05     0.10        0.85     ← mostly focuses on "cats"
                     ↓        ↓           ↓
Context = 0.05·h("I") + 0.10·h("love") + 0.85·h("cats")
                     ↓
              decoder uses it → "chats"
```

**Analogy:** a highlighter. For each word you write, you highlight the parts of the source that matter most right now.

### Three steps

1. **Score:** how relevant is each encoder state hᵢ to the current decoder state s? Often a **dot product** s · hᵢ ([file 05](05-math-linear-algebra.md#6-the-dot-product)): similar vectors → high score.
2. **Normalise:** apply **softmax** to the scores to get **attention weights** that are positive and sum to 1.
3. **Combine:** context = weighted sum Σ (weightᵢ × hᵢ).

**Benefits:**
- No more bottleneck: the decoder can access every input position directly
- Much better for long sentences
- **Interpretable:** attention weights show which words the model looked at (an **attention map**, a heatmap, [file 09](09-data-visualization.md#9-heatmaps)), often showing word alignments between languages
- Shorter gradient paths to every input word

---

## 14. Attention worked example

Encoder hidden states (2-dimensional for simplicity):
- h₁ ("I") = [1, 0]
- h₂ ("love") = [0, 1]
- h₃ ("cats") = [1, 1]

Current decoder state: s = [2, 1]

**Step 1: scores (dot products)**
- s·h₁ = 2×1 + 1×0 = **2**
- s·h₂ = 2×0 + 1×1 = **1**
- s·h₃ = 2×1 + 1×1 = **3**

**Step 2: softmax**
- e² = 7.389, e¹ = 2.718, e³ = 20.086; sum = 30.193
- weights = [0.245, 0.090, **0.665**]

**Step 3: weighted sum**
- context = 0.245×[1, 0] + 0.090×[0, 1] + 0.665×[1, 1]
- = [0.245 + 0 + 0.665, 0 + 0.090 + 0.665] = **[0.910, 0.755]**

The context vector is dominated by "cats" (weight 0.665), the most relevant word.

```python
import torch
H = torch.tensor([[1., 0.], [0., 1.], [1., 1.]])   # encoder states (3 words × 2 dims)
s = torch.tensor([2., 1.])                          # decoder state
scores = H @ s                                      # [2, 1, 3]
weights = torch.softmax(scores, dim=0)              # [0.245, 0.090, 0.665]
context = weights @ H                               # [0.910, 0.755]
```

**Keep this in mind:** in [file 19](19-transformers.md), we generalise this to **Query, Key, Value** attention: the decoder state becomes the **query** ("what am I looking for?"), the encoder states act as **keys** ("what do I contain?") and **values** ("what information do I give?"). Then **self-attention** lets every word attend to every other word in the **same** sentence.

---

## 15. Why RNNs were replaced

Even with LSTMs and attention, RNNs have a fundamental problem:

**They're sequential.** To compute step 100, you need step 99, which needs step 98... You **can't parallelise across time steps**, so you can't make full use of GPUs ([file 05](05-math-linear-algebra.md#16-why-gpus)), which want to do thousands of things at once. Training on huge datasets was slow.

**Paths are still long:** information from word 1 must pass through 99 steps to reach word 100.

In 2017, the paper **"Attention Is All You Need"** asked: what if we **drop recurrence completely** and use **only attention**?
- Every word attends to every other word **directly** (path length 1)
- All positions are computed **in parallel**, so training is fast on GPUs
- Scales to enormous datasets and models

That architecture is the **Transformer**, the foundation of BERT, GPT, Claude, Llama, and almost all modern AI. Next up!

**RNNs aren't dead:** they're still used for small/streaming/on-device tasks and time series, and modern "**state-space models**" like **Mamba** (file 30) revive the recurrent idea with tricks that allow parallel training.

| | RNN / LSTM | Transformer |
|---|---|---|
| Processes tokens | one at a time | all at once (parallel) |
| Long-range path | O(n) steps | 1 step |
| Training speed on GPUs | slow | fast |
| Memory per step at inference | constant (just the hidden state) | grows with context (KV cache, file 20) |
| Cost vs sequence length n | O(n) | O(n²) attention |

---

## 16. Check yourself

**Q1.** What is the hidden state in an RNN, and why are the weights shared across time steps?
<details><summary>Answer</summary>A vector summarising everything seen so far. Sharing weights means the same rules apply at every position and the model handles any sequence length with a fixed number of parameters.</details>

**Q2.** RNN with W_x = 1, W_h = 0.5, b = 0, h₀ = 0, inputs [1, 1]. Compute h₁ and h₂ (use tanh).
<details><summary>Answer</summary>h₁ = tanh(1) ≈ 0.762. h₂ = tanh(1 + 0.5×0.762) = tanh(1.381) ≈ 0.881.</details>

**Q3.** Why do plain RNNs struggle with long-range dependencies?
<details><summary>Answer</summary>Vanishing gradients: backprop through many time steps multiplies many factors < 1, so the signal from early words fades.</details>

**Q4.** What do the LSTM's forget, input and output gates do?
<details><summary>Answer</summary>Forget: what to erase from the cell state. Input: what new info to write. Output: what part of the memory to expose as the hidden state.</details>

**Q5.** When can't you use a bidirectional RNN?
<details><summary>Answer</summary>For generation (e.g. predicting the next word), because the future isn't known yet.</details>

**Q6.** What is the "bottleneck" in basic seq2seq, and how does attention fix it?
<details><summary>Answer</summary>The whole input is compressed into one fixed-size context vector. Attention lets the decoder look at all encoder states at every step, with learned weights.</details>

**Q7.** Encoder states h₁ = [1, 0], h₂ = [0, 2]; decoder state s = [1, 1]. Compute the attention weights.
<details><summary>Answer</summary>Scores: 1 and 2. Softmax: e¹ = 2.718, e² = 7.389 → weights ≈ [0.269, 0.731].</details>

**Q8.** What is teacher forcing, and what problem can it cause?
<details><summary>Answer</summary>Feeding the true previous token during training. It can cause exposure bias: at inference the model must consume its own (possibly wrong) outputs.</details>

**Q9.** What's the main reason Transformers replaced RNNs?
<details><summary>Answer</summary>RNNs process tokens sequentially and can't parallelise across time; Transformers process all positions in parallel (fast on GPUs) and connect any two positions directly.</details>

---

## 17. New words in this file

| Word | Meaning |
|---|---|
| Sequential data | Data where order matters |
| Long-range dependency | Relationship between far-apart elements |
| RNN (Recurrent Neural Network) | Network processing a sequence step by step with a hidden state |
| Hidden state (hₜ) | Memory vector carried between steps |
| Unrolling | Viewing an RNN as one layer per time step |
| Many-to-one, one-to-many, many-to-many | Sequence task shapes |
| BPTT, truncated BPTT | Backprop through the unrolled sequence / limited to the last k steps |
| LSTM, cell state, gates (forget, input, output), candidate | Gated RNN with a memory conveyor belt |
| Gate | Sigmoid layer controlling information flow |
| GRU, update gate, reset gate | Simpler gated RNN |
| Bidirectional RNN | Reads forwards and backwards |
| Stacked RNN | Several RNN layers |
| Padding, `padding_idx` | Filler tokens to make equal lengths |
| Seq2seq, encoder-decoder | Input sequence → output sequence of a different length |
| Context vector | Encoder's summary of the input |
| `<END>` / end-of-sequence token | Special token marking the end of output |
| Teacher forcing, exposure bias | Training with true previous tokens / mismatch at inference |
| Greedy decoding, beam search, sampling | Ways to choose output tokens |
| Bottleneck problem | Squeezing a whole input into one vector |
| Attention, attention weights, attention map | Weighted focus on relevant inputs / the weights / heatmap of them |
| Score (dot-product attention) | Relevance between query and each input |
| Query, Key, Value (preview) | Attention's generalised roles (file 19) |
| Self-attention (preview) | Tokens attending to the same sequence |
| "Attention Is All You Need" | 2017 paper introducing the Transformer |
| State-space models, Mamba | Modern recurrent-style alternatives (file 30) |

**🎉 You've finished Part D: Deep Learning!**

**Mini project for Part D:** (1) Fine-tune a pretrained ResNet or EfficientNet on a small image dataset of your choice (e.g. 3 to 5 classes of local fruits, ~100 photos each that you take yourself); report accuracy, a confusion matrix, and examples of mistakes. (2) Train an LSTM sentiment classifier on the IMDb reviews dataset and compare it with a logistic regression on TF-IDF features (file 18).

**Next:** [18-nlp-fundamentals.md](18-nlp-fundamentals.md)
