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

**Why it exists:** Plenty of real data is a story, not a snapshot: a sentence, a phone call, a week of electricity readings. The meaning is in the order, so we need to be clear about what "sequential" means before we build models for it.

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

### Worked example: same words, different order

```
"Dog bites man"   -> words: Dog, bites, man
"Man bites dog"   -> words: man, bites, Dog
Bag of words (counts only): dog 1, bites 1, man 1   <- IDENTICAL for both
Sequence (ordered):  [Dog, bites, man] vs [man, bites, Dog]   <- DIFFERENT
```

A model that only sees counts cannot tell a normal news story from a headline-worthy one.

**Sri Lankan sequences:** the words of a Sinhala sentence ("mama bath kanawa", "I eat rice", only makes sense in the right order), daily mobile-data usage of a customer over 30 days, hourly electricity demand of the national grid, the clicks of a shopper on Daraz before buying, the sequence of transactions on a bank card.

**Where you'll meet it in real work:** a bank watching a card's last 20 transactions to spot fraud, a telecom predicting churn from 6 months of usage, a keyboard suggesting the next word.

**Common mistake:** shuffling time-series rows randomly before splitting into train and test. Future data leaks into training. Split by time instead ([file 10](10-data-science-workflow.md#14-time-series-basics)).

**Exam angle:** recognise which data is sequential, and why order and context matter. This leads straight to the question "why do we need attention and Transformers?".

> **සිංහලෙන්:** Sequential data කියන්නේ අනුපිළිවෙළ වැදගත් data. "Dog bites man" සහ "Man bites dog" වල වචන එකම ඒත් තේරුම සම්පූර්ණයෙන්ම වෙනස්. වචන ගණන් කරන bag of words එකකට මේ දෙක වෙන් කරන්න බෑ. ඔයාගේ phone එකේ දවස් 30ක data පාවිච්චිය, ජාතික විදුලි ඉල්ලුම පැයෙන් පැයට, bank card එකේ අන්තිම transactions 20 මේ හැමදේම sequences. Time series data train/test බෙදද්දී random shuffle කරන්න එපා, අනාගත data training එකට කාන්දු වෙනවා, ඒ නිසා කාලය අනුව බෙදන්න.

---

## 2. Why MLPs and CNNs aren't enough

**Why it exists:** Before inventing RNNs it helps to see exactly where the tools we already know break on text and speech. Each failure points to one requirement the new model must meet.

- **Variable length:** sentences can be 3 words or 300. An MLP needs a fixed input size.
- **Order:** a "bag of words" (just counting words, file 18) loses order.
- **Long-range dependencies:** in "The **keys** that I left on the kitchen table yesterday **are** missing", the verb "are" must agree with "keys", many words earlier.
- **Parameter sharing across positions:** the meaning of a word shouldn't need separate weights for position 1 vs position 50.

### Worked example: why a fixed input size hurts

Embed each word as 50 numbers and feed an MLP with 128 hidden units:

```
10-word sentence : 10 x 50  =    500 inputs -> 500 x 128    =    64,000 weights
300-word text    : 300 x 50 = 15,000 inputs -> 15,000 x 128 = 1,920,000 weights
11-word sentence : 550 inputs -> the first layer expects exactly 500. Error!
```

Padding everything to 300 words wastes computation, and an MLP would still learn separate weights for "keys" at position 3 and "keys" at position 30.

An RNN uses the same weights at every position, so one small model handles 3 words or 3,000.

| Requirement | MLP | CNN (1-D) | RNN |
|---|---|---|---|
| Any input length | no | partly (pooling) | yes |
| Order matters | no | local order only | yes |
| Long-range links | no | limited by filter size | yes (in theory) |
| Shared weights across positions | no | yes | yes |

**Common mistake:** thinking "just make the input bigger". A fixed-size input cannot handle the longest sentence you have not seen yet.

**Exam angle:** know the four reasons plain feed-forward networks are poor for sequences: variable length, order, long-range dependencies, and no parameter sharing across positions.

> **සිංහලෙන්:** MLP එකකට input එකේ ප්‍රමාණය හැමදාම එකම වෙන්න ඕනේ. වචන 10ක වාක්‍යයක් (වචනයකට අංක 50 බැගින්) නම් inputs 500යි. වචන 300ක් නම් inputs 15,000ක් වෙනවා, weights ගණන 64,000 සිට මිලියන 1.9 දක්වා වැඩි වෙනවා. වචන 11ක වාක්‍යයක් ආවොත් model එක error එකක් දෙනවා. ඒ වගේම "keys" කියන වචනය 3වෙනි තැනේ තිබුණත් 30වෙනි තැනේ තිබුණත් MLP එක වෙන වෙනම ඉගෙන ගන්නවා. RNN එක හැම තැනම එකම weights පාවිච්චි කරන නිසා වචන 3ක් වුණත් 3,000ක් වුණත් හසුරුවනවා.

---

## 3. Recurrent Neural Networks

**Why it exists:** An RNN gives a network a memory. Instead of looking at the whole sentence at once, it reads one word at a time and keeps a running summary, the way you do when you read a story.

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

### Worked example: order changes the answer

Same weights as above (W_x = 0.5, W_h = 0.8, b = 0, h0 = 0). Compare inputs [1, 0] and [0, 1]:

```
Input [1, 0]:  h1 = tanh(0.5x1 + 0.8x0)      = tanh(0.5)    = 0.462
               h2 = tanh(0.5x0 + 0.8x0.462)  = tanh(0.370)  = 0.354

Input [0, 1]:  h1 = tanh(0.5x0 + 0.8x0)      = tanh(0)      = 0.000
               h2 = tanh(0.5x1 + 0.8x0)      = tanh(0.5)    = 0.462
```

The same two numbers in a different order give different final states (0.354 vs 0.462). The hidden state remembers *what* came *when*.

### How many parameters?

`nn.RNN(input_size=50, hidden_size=128)` has:

```
W_x : 128 x 50  =  6,400
W_h : 128 x 128 = 16,384
biases (PyTorch keeps two): 128 + 128 = 256
total = 23,040 parameters
```

This number is the same whether the sequence has 5 or 5,000 steps, because the same cell is reused. Only the *compute* grows with length.

### The shapes in the code

For a batch of 4 sequences with 10 steps and 128 hidden units, `outputs` is (4, 10, 128): the hidden state at every step. `h_last` is (1, 4, 128): only the final one. Use `h_last` when you need one answer for the whole sequence (sentiment); use `outputs` when you need one per step (tagging).

**Where you'll meet it in real work:** next-word suggestion on a phone keyboard, predicting tomorrow's electricity demand from the last 48 hours, and (in older systems) speech recognition.

**Common mistakes:**
- Thinking the unrolled copies have different weights. It is **one** cell with one set of weights, drawn many times.
- Confusing the hidden state (the memory) with the output (what you read from it). They can be the same, but need not be.

**Exam angle:** state the RNN equation in words (new state = tanh of input part plus previous-state part), and say that weights are shared across time steps.

> **සිංහලෙන්:** RNN එකක් වචනයෙන් වචනයට කියවනවා, හැම පියවරකදීම hidden state එකක් (මතකයක්) update කරනවා. Cricket commentary එකක් අහන කෙනෙක් හැම බෝලයකටම පස්සේ score එක ඔළුවේ තියාගෙන ඊළඟ බෝලයට යනවා වගේ. උදාහරණයක් විදිහට inputs [1, 0] දුන්නාම අන්තිම state එක 0.354, [0, 1] දුන්නාම 0.462 වෙනවා. එතකොට එකම අංක දෙකේ අනුපිළිවෙළ වෙනස් වුණාම උත්තරය වෙනස් වෙනවා. Parameters 23,040යි, ඒක වාක්‍යය දිග වුණත් වෙනස් වෙන්නේ නෑ, මොකද එකම cell එක නැවත නැවත පාවිච්චි කරන නිසා.

---

## 4. Sequence task shapes

**Why it exists:** Different problems have different shapes: one answer for the whole sequence, an answer per word, or a whole new sequence. Naming the shape tells you how to wire the RNN's inputs and outputs.

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

### Worked example: how the shape changes the code

Batch of 4 reviews, each padded to 10 tokens, hidden size 128:

| Task | Take from the RNN | Then | Final shape |
|---|---|---|---|
| Sentiment (many-to-one) | last hidden state (4, 128) | Linear(128, 2) | (4, 2) |
| Part-of-speech tagging (many-to-many, aligned) | all hidden states (4, 10, 128) | Linear(128, 17) on every step | (4, 10, 17) |
| Image captioning (one-to-many) | image vector as the first input | generate words one after another | (4, n_words, vocab) |
| Translation (seq2seq) | encoder summary, then a separate decoder | generate the target sentence | length can differ |

**Sri Lankan examples:**
- Many-to-one: is this Daraz review positive or negative?
- Aligned many-to-many: mark each word in a Sinhala sentence as a name, place or other (NER).
- One-to-many: describe a photo of a beach.
- Seq2seq: translate an English notice into Sinhala (a different number of words).

**Common mistake:** using seq2seq machinery when the output has exactly one label per input word. Aligned tagging does not need a decoder.

**Exam angle:** given a task, name its shape. Sentiment = many-to-one; translation = seq2seq; NER = aligned many-to-many.

> **සිංහලෙන්:** Sequence task එකක හැඩය (shape) හඳුනගන්න එක වැදගත්. Review එකක් positive ද negative ද කියන එකට සම්පූර්ණ වාක්‍යයට උත්තරයක් එකයි, ඒක many-to-one. වාක්‍යයේ හැම වචනයක්ම නමක්ද, තැනක්ද කියලා ලකුණු කරන්නේ වචනයකට එක උත්තරය බැගින්, ඒක aligned many-to-many. ෆොටෝ එකකින් වාක්‍යයක් හදන එක one-to-many. ඉංග්‍රීසි සිට සිංහලට පරිවර්තනය කරද්දී දිග වෙනස් වෙන නිසා seq2seq ඕනේ. Sentiment වලට අන්තිම hidden state එක ගන්නවා, tagging වලට හැම පියවරේම state එකක් ගන්නවා.

---

## 5. Backpropagation through time

**Why it exists:** An RNN is trained with the same backpropagation as any network. The only new thing is that one set of weights is used many times, so gradients from all those uses must be added together.

To train an RNN, unroll it over the sequence (it's then just a deep network with shared weights) and apply backpropagation ([file 15](15-neural-networks.md#8-backpropagation-worked-example)). This is called **Backpropagation Through Time (BPTT)**.

The gradient for the shared weights sums contributions from every time step.

**Truncated BPTT:** for very long sequences, only backpropagate through the last k steps (e.g. 100) to save memory and time.

### Worked example: why the gradients add up

To keep the arithmetic easy, drop tanh and use h1 = w x x1 and h2 = w x h1, with w = 0.8 and x1 = 1. Then h2 = w^2 x x1 = 0.64 and we want how h2 changes when w changes (dh2/dw).

```
Weight w is used twice (step 1 and step 2), so two paths carry gradient:
 path via step 2 (direct use of w):   h1            = 0.8 x 1 = 0.8
 path via step 1 (w inside h1):       w x (dh1/dw)  = 0.8 x x1 = 0.8
 total dh2/dw = 0.8 + 0.8 = 1.6       check: d(w^2)/dw = 2w = 1.6  OK
```

That is "the gradient sums contributions from every time step". With 1,000 steps there would be 1,000 terms.

### Why truncation is needed

BPTT must store the hidden states of every step to run backwards. For a 10,000-step sequence, that is 10,000 stored states. With truncated BPTT, k = 100, you cut it into 100 chunks. The forward pass still carries the hidden state from one chunk to the next, but the gradient only flows back inside a chunk.

**Common mistake:** thinking truncated BPTT also resets the hidden state. It does not; it only stops the gradient.

**Exam angle:** BPTT = backpropagation on the unrolled network; weights are shared, so their gradients are summed over steps.

> **සිංහලෙන්:** RNN එක train කරන්නෙත් backpropagation එකෙන්මයි. වෙනස මෙච්චරයි: එකම weight එක පියවර ගොඩක් පාවිච්චි කරන නිසා ඒ හැම පාවිච්චියකින්ම එන gradient එකතු කරන්න වෙනවා. පොඩි උදාහරණයක්, w = 0.8 දෙපාරක් පාවිච්චි වුණාම gradient එක 0.8 + 0.8 = 1.6 වෙනවා. පියවර 10,000ක sequence එකක සියලු states memory එකේ තියාගන්න බැරි නිසා truncated BPTT පාවිච්චි කරනවා, පියවර 100ක කොටස් වලට කඩලා gradient එක ඒ කොටස ඇතුළේ විතරක් යවනවා.

---

## 6. The long-term memory problem

**Why it exists:** A memory that fades is no memory. Plain RNNs lose track of things said a few words ago, and seeing exactly why leads straight to the LSTM design.

To learn that "are" depends on "keys" 10 words earlier, the gradient must flow back through 10 steps. At each step it's multiplied by (roughly) W_h and tanh's derivative ([file 06](06-math-calculus.md#11-the-chain-rule)).

- If those factors are < 1 → gradient shrinks exponentially → **vanishing gradient** → the RNN can't learn long-range dependencies. In practice, plain RNNs struggle beyond ~10 to 20 steps.
- If > 1 → **exploding gradient** → unstable training → fixed with **gradient clipping** ([file 15](15-neural-networks.md#12-vanishing-and-exploding-gradients)).

Exploding is easy to fix. Vanishing needs a new design: the **LSTM**.

### Worked example: how fast a signal fades

Suppose at every step the gradient is multiplied by 0.8:

```
after 10 steps:  0.8^10 = 0.107     (about 11% left)
after 20 steps:  0.8^20 = 0.0115    (about 1% left)
after 50 steps:  0.8^50 = 0.000014  (practically zero)
```

If the factor is above 1, say 1.2, the opposite happens:

```
1.2^10 = 6.2      1.2^20 = 38      1.2^50 = about 9,100   <- exploding
```

**Gradient clipping in numbers:** if the gradient's norm is 50 and the clip limit is 5, every gradient is multiplied by 5/50 = 0.1, so the direction is kept but the size is capped. In PyTorch: `torch.nn.utils.clip_grad_norm_(model.parameters(), 5.0)`.

**Why "keys ... are" is hard:** for the model to link "are" back to "keys" 10 words earlier, the learning signal must travel back 10 steps. With a factor like 0.8 only 11% of the signal arrives, and in practice it is mixed with noise from all the other words.

**Where you'll meet it in real work:** any long text, long audio or long sensor series. If your plain RNN does fine on short sentences but fails on long ones, this is the reason.

**Common mistake:** trying to cure vanishing gradients with clipping. Clipping only helps with *exploding* gradients.

**Exam angle:** vanishing vs exploding gradients, which is fixed by clipping (exploding) and which needs a new architecture such as an LSTM or residual connections (vanishing).

> **සිංහලෙන්:** RNN එකකට ඈත තියෙන දේවල් මතක තියාගන්න අමාරුයි. හේතුව vanishing gradient. පියවරක් පාසා gradient එක 0.8න් ගුණ වෙනවා කියලා හිතන්න. පියවර 10කට පස්සේ 0.8^10 = 0.107, ඒ කියන්නේ 11% විතරයි ඉතුරු වෙන්නේ. පියවර 50කට පස්සේ ඒක බොහොමත් කුඩායි. Factor එක 1.2 නම් අනිත් පැත්තට ගිහින් 1.2^50 ≈ 9,100 වෙලා exploding වෙනවා. Exploding නම් gradient clipping එකෙන් විසඳනවා. Vanishing විසඳන්න LSTM වගේ අලුත් design එකක් ඕනේ.

---

## 7. LSTM

**Why it exists:** Plain RNNs rewrite their whole memory at every step, so old information gets overwritten and gradients fade. The LSTM adds a protected memory lane and gates that decide, step by step, what to keep, add and show.

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

### Worked example: a full LSTM step with numbers

Take the tiny example from above: previous cell c = 2.0, forget gate f = 0.9, input gate i = 0.3, candidate c~ = 1.0, and say the output gate o = 0.5.

```
New cell state:   c = f x c_prev + i x c~ = 0.9 x 2.0 + 0.3 x 1.0 = 2.1
New hidden state: h = o x tanh(c)         = 0.5 x tanh(2.1)
                                          = 0.5 x 0.970 = 0.485
```

The cell state (2.1) is the private notebook. The hidden state (0.485) is what the cell chooses to share.

### Why the forget gate fixes vanishing memory

Suppose nothing new is written (i = 0) and we start with c = 2.0. After 10 steps with a constant forget gate:

| Forget gate f | Memory left after 10 steps (2.0 x f^10) |
|---|---|
| 0.5 | 0.002 (forgotten) |
| 0.9 | 0.70 |
| 0.99 | 1.81 (almost fully kept) |

The network learns to set f close to 1 for things worth remembering (the subject "keys") and close to 0 when a sentence ends and the old context is no longer needed.

### Parameter count

`nn.LSTM(50, 128)` has four sets of weights (forget, input, candidate, output):

```
4 x (128x50 + 128x128 + 128 + 128) = 4 x 23,040 = 92,160 parameters
```

Exactly four times the plain RNN with the same sizes.

**Where you'll meet it in real work:** older but still-running systems for speech recognition, sensor anomaly detection on machines, and short-term demand forecasting, plus lots of tutorials and exam questions.

**Common mistakes:**
- Mixing up the **cell state** (long-term memory) and the **hidden state** (the output at this step).
- Believing LSTMs never forget. They can still struggle on very long sequences (thousands of steps), which is one reason attention took over.
- Forgetting that gates are sigmoids (0 to 1) while the candidate memory uses tanh (-1 to 1).

**Exam angle:** name the three gates and their jobs; explain that the additive cell-state update creates a path for gradients to flow.

> **සිංහලෙන්:** LSTM එක කියන්නේ notebook එකක් තියාගත්ත RNN එකක්. Notebook එක cell state, ඒකට gates තුනක්: forget gate පරණ දේවල් මකනවා, input gate අලුත් දේවල් ලියනවා, output gate දැන් පෙන්නන්න ඕන දේ තෝරනවා. උදාහරණයක්: පරණ memory 2.0, forget 0.9, input 0.3, candidate 1.0 නම් අලුත් memory = 0.9×2.0 + 0.3×1.0 = 2.1. Forget gate එක 0.99 ළඟ තිබ්බොත් පියවර 10කට පස්සෙත් memory එකෙන් බොහොමයක් ඉතුරු වෙනවා (2.0 න් 1.81), 0.5 නම් ඔක්කොම අමතක වෙනවා. Parameters සරල RNN එකට වඩා හතර ගුණයක් වැඩියි (92,160).

---

## 8. GRU

**Why it exists:** LSTMs work well but are fairly heavy. The GRU asks: can we keep most of the benefit with fewer gates, fewer parameters and faster training?

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

### Worked example: one GRU update

Previous hidden state h_prev = 2.0, candidate state = 1.0, update gate z = 0.25:

```
h = (1 - z) x h_prev + z x candidate
  = 0.75 x 2.0 + 0.25 x 1.0
  = 1.50 + 0.25 = 1.75
```

With z = 0.25 the cell keeps 75% of the old state and takes 25% of the new one. When z is close to 0 it "copies" the old state, which is the same gradient-highway idea as the LSTM's forget gate.

### Parameter count

`nn.GRU(50, 128)` has three sets of weights:

```
3 x 23,040 = 69,120 parameters      (LSTM: 92,160;  plain RNN: 23,040)
```

| | RNN | GRU | LSTM |
|---|---|---|---|
| Gates | 0 | 2 (update, reset) | 3 (forget, input, output) |
| Separate cell state | no | no | yes |
| Weight sets | 1 | 3 | 4 |
| Remembers long-range info | poorly | well | well |

**Rule of thumb:** try the GRU first for a small dataset or a quick baseline; try the LSTM if you have lots of data and need the extra capacity. In practice, the difference is often small.

**Common mistake:** assuming the more complex model is always better. On small datasets, a GRU often matches or beats an LSTM.

**Exam angle:** LSTM = 3 gates + cell state; GRU = 2 gates, no separate cell state, fewer parameters.

> **සිංහලෙන්:** GRU එක LSTM එකේ සරල කළ version එක. Gates දෙකයි (update සහ reset), වෙනම cell state එකක් නෑ, ඒ නිසා parameters අඩුයි. Update gate z = 0.25 නම්, පරණ state එකෙන් 75%ක් තියාගෙන අලුත් එකෙන් 25%ක් ගන්නවා: 0.75×2.0 + 0.25×1.0 = 1.75. Parameters: සරල RNN එක 23,040, GRU එක 69,120, LSTM එක 92,160. පොඩි data set එකක් නම් මුලින් GRU එක try කරන්න, ඉක්මනින් train වෙනවා, ගොඩක් වෙලාවට LSTM එක තරම්ම හොඳයි.

---

## 9. Bidirectional and stacked RNNs

**Why it exists:** A word's meaning often depends on words that come *after* it, and a single layer is often too shallow to learn rich patterns. Bidirectional and stacked RNNs fix these two limits.

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

### Worked example: shapes in a bidirectional LSTM

`hidden = 128`, one layer, bidirectional:

```
forward LSTM  : 128 numbers per position  (reads left to right)
backward LSTM : 128 numbers per position  (reads right to left)
concatenate   : 128 + 128 = 256 numbers per position
```

That is why the classifier's final layer is `Linear(2 * hidden, n_classes)`. A bidirectional LSTM also has **twice** the parameters: 2 x 92,160 = 184,320 for the sizes above (50 inputs, 128 hidden).

**Stacked:** `num_layers=2` means the 128-number outputs of layer 1 become the inputs of layer 2. Each extra layer adds parameters and training time, and usually gives diminishing returns after 2 to 3 layers.

### Padding in practice

Two reviews in one batch, with word IDs (0 = padding):

```
"hari hondai"            -> [33, 91,  0,  0]
"kema godak rasai"       -> [12, 45, 78,  0]
```

The LSTM must not treat the 0s as real words. Use `padding_idx=0` in the embedding, and for exact final states use `pack_padded_sequence` (or a mask), otherwise the "last" hidden state may come from a padding position.

**Where you'll meet it in real work:** tagging names and places in news articles (BERT is the modern, bidirectional descendant), and classifying support messages where the whole text is available.

**Common mistakes:**
- Using a bidirectional RNN for next-word generation. The future words do not exist yet when generating.
- Forgetting the `2 *` in the classifier input size.

**Exam angle:** bidirectional = sees past and future context (BERT-like); unidirectional = only the past (GPT-like). Linking this to the BERT vs GPT split is a favourite question.

> **සිංහලෙන්:** Bidirectional RNN එකේ RNN දෙකක් තියෙනවා, එකක් වමේ ඉඳන් දකුණට කියවනවා, අනිත් එක දකුණේ ඉඳන් වමට. ඒ නිසා හැම වචනයකටම කලින් සහ පස්සේ context දෙකම ලැබෙනවා. Hidden size 128 නම් එකතු කළාම හැම තැනකම 256ක් ලැබෙනවා, ඒකයි classifier එකේ Linear(2×hidden) කියන්නේ. ඒත් ඊළඟ වචනය අනුමාන කරන වැඩ වලට මේක බෑ, මොකද අනාගත වචන තාම නැති නිසා. Batch එකක වාක්‍ය වල දිග වෙනස් නිසා කෙටි ඒවාට 0 පුරවනවා (padding), ඒවා සැබෑ වචන කියලා model එක හිතන්න දෙන්න එපා.

---

## 10. Sequence-to-sequence

**Why it exists:** Translation, summarising and speech-to-text turn one sequence into a *different* sequence whose length is not known in advance. A single RNN cannot do that cleanly, so the job is split between a reader (encoder) and a writer (decoder).

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

### Worked example: following one translation

English "I love cats" to French, step by step:

```
ENCODER (reads):   "I" -> h1,  "love" -> h2,  "cats" -> h3
                   context vector c = h3  (say 256 numbers)

DECODER (writes):  input <START> + c        -> predicts "J'adore"
                   input "J'adore" + state  -> predicts "les"
                   input "les" + state      -> predicts "chats"
                   input "chats" + state    -> predicts <END>   (stop)
```

The decoder keeps going until it chooses the special `<END>` token, which is how the output length is decided. Each generated word becomes the next input.

### How much is squeezed?

For a 50-word sentence with 256-number states, the encoder saw 50 x 256 = 12,800 numbers but the decoder receives only **256**. A 5-word sentence is squeezed into the same 256. This sets up the bottleneck problem in section 12.

**Where you'll meet it in real work:** machine translation (older Google Translate used this design), text summarisation, chatbots, and speech-to-text such as Whisper (an encoder-decoder Transformer).

**Common mistakes:**
- Forgetting the `<START>` and `<END>` tokens. Without `<END>` the decoder never knows when to stop.
- Thinking the encoder and decoder must have the same length. They do not.

**Exam angle:** describe the roles. Encoder = understand the input; decoder = generate the output one token at a time. T5 and the original Transformer both use this pattern; GPT uses only a decoder; BERT uses only an encoder.

> **සිංහලෙන්:** Seq2seq කියන්නේ දිග වෙනස් වෙන sequence එකක් තවත් sequence එකකට හරවන model එක. කොටස් දෙකයි. Encoder එක මුළු input වාක්‍යයම කියවලා context vector එකකට හකුළනවා. Decoder එක ඒකෙන් පටන් අරන් output වාක්‍යය වචනයෙන් වචනය හදනවා, <END> token එක ආවම නවතිනවා. වචන 50ක වාක්‍යයක් වුණත් වචන 5ක වාක්‍යයක් වුණත් context vector එක එකම ප්‍රමාණයේ (උදා: අංක 256ක්). පරිවර්තකයෙක් ඉංග්‍රීසි වාක්‍යය මුළුමනින්ම අහලා පස්සේ සිංහලෙන් කියනවා වගේ.

---

## 11. Teacher forcing and decoding

**Why it exists:** Training and generating are different situations: while training we know the right answer, but while generating we do not. This section explains how each step is handled and how the next word is picked from a list of probabilities.

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

### Worked example: teacher forcing for "I love cats"

```
Step | Decoder input (true previous word) | Target (what it must predict)
 1   | <START>                            | J'adore
 2   | J'adore                            | les
 3   | les                                | chats
 4   | chats                              | <END>
```

Even if at step 1 the model wrongly predicted "Je", step 2's input is still the true "J'adore". At test time, there is no teacher: if step 1 goes wrong, step 2 builds on the mistake (exposure bias).

### Worked example: greedy vs beam search (illustrative numbers)

```
Step 1: "the" 0.5, "a" 0.4
 after "the": best next word has probability 0.4   -> path probability 0.5 x 0.4 = 0.20
 after "a"  : best next word has probability 0.9   -> path probability 0.4 x 0.9 = 0.36
```

Greedy takes "the" (0.5 > 0.4) and ends with 0.20. Beam search with k = 2 keeps both starts, and finds the better full sentence at 0.36. Greedy is fast; beam search is more thorough.

### Worked example: temperature

Logits for three candidate words are [2, 1, 0].

```
Temperature 1  : softmax([2, 1, 0])       = [0.665, 0.245, 0.090]
Temperature 0.5: softmax([4, 2, 0])       = [0.867, 0.117, 0.016]   <- sharper, safer
Temperature 2  : softmax([1, 0.5, 0])     = [0.506, 0.307, 0.186]   <- flatter, more random
```

Low temperature makes the favourite even more likely (predictable text); high temperature gives rarer words a real chance (creative or chaotic text).

**Where you'll meet it in real work:** every chatbot has a temperature setting; translation tools use beam search; code assistants often use low temperature to reduce random mistakes.

**Common mistakes:**
- Using teacher forcing at inference time. At inference there is no true answer to feed.
- Thinking beam search always gives the best sentence. It is a better search, not a guarantee.
- Confusing temperature 0 with "no randomness at all"; it just means always picking the top token.

**Exam angle:** teacher forcing, exposure bias, greedy vs beam vs sampling, and what temperature, top-k and top-p do are all fair game for inference questions.

> **සිංහලෙන්:** Training කරද්දී decoder එකට හරි කලින් වචනය දෙනවා (teacher forcing), ගුරුවරයා උත්තර දෙනවා වගේ. ඒත් test කරද්දී model එකට තමන්ගේම අනුමානයෙන් යන්න වෙනවා, එතකොට මුල් වැරද්ද වැඩි වෙනවා (exposure bias). වචනය තෝරන ක්‍රම: greedy කියන්නේ හැම පියවරේම වැඩිම සම්භාවිතාව තියෙන එක. Beam search එකේදී හොඳම මාර්ග කීපයක් තියාගන්නවා, ඒකෙන් 0.20 ට වඩා 0.36 වගේ හොඳ වාක්‍යයක් හොයාගන්න පුළුවන්. Temperature එක අඩු කළොත් (0.5) model එක ආරක්ෂිත වචන තෝරනවා, වැඩි කළොත් (2) වඩා random වෙනවා.

---

## 12. The bottleneck problem

**Why it exists:** The basic encoder-decoder forces everything the decoder needs to know through one small vector. That works for short sentences but breaks down on long ones, and finding this limit is what led to attention.

The encoder must squeeze **the entire input sentence into one fixed-size vector**. For long sentences, that's impossible without losing information. Translation quality dropped sharply for sentences longer than ~20 words.

**Analogy:** someone reads you a 50-word sentence once. You must remember it as a single thought, then translate it from memory. Hard! A human translator instead **looks back at the source sentence** as they write each word.

That's exactly what **attention** does.

### Worked example: the squeeze

```
Short sentence: 5 words  x 256 numbers = 1,280 numbers -> squeezed into 256  (5 to 1)
Long sentence : 50 words x 256 numbers = 12,800 numbers -> squeezed into 256 (50 to 1)
```

The vector is the same size in both cases, so the long sentence loses far more detail. The first words are the most likely to be overwritten by the time the encoder reaches the end.

```
Translation quality (BLEU) vs sentence length:

quality
  |  ***
  |      ***
  |          ***            <- basic seq2seq falls off for sentences
  |              ***           longer than about 20 words
  +------------------------ sentence length
```

**Where you'll meet it in real work:** translating a long legal paragraph, summarising a long document, or answering a question about a long story. Any task where details from far back must survive.

**Common mistakes:**
- Thinking a bigger hidden size fully solves it. It helps a little, but costs more and still compresses.
- Blaming the decoder. The information was already lost at the encoder's end.

**Exam angle:** "what is the bottleneck problem and how does attention fix it?" is one of the most common questions linking RNNs to Transformers.

> **සිංහලෙන්:** Basic seq2seq එකේ මුළු input වාක්‍යයම එක vector එකකට හකුළනවා. වචන 5ක වාක්‍යයක් නම් අංක 1,280ක් 256ට හකුළනවා (5:1), වචන 50ක නම් 12,800ක් 256ට (50:1), ඒ නිසා දිග වාක්‍ය වලදී ගොඩක් තොරතුරු නැති වෙනවා. වාක්‍ය 50ක් එක පාරක් කියවලා කිව්වාම මුළුම එකම එක සිතුවිල්ලක් විදිහට මතක තියාගෙන පරිවර්තනය කරන්න වගේ අමාරුයි. මිනිස් පරිවර්තකයෙක් නම් මුල් වාක්‍යය ආයෙත් බලනවා. ඒ අදහසම තමයි attention එක.

---

## 13. Attention: the big idea

**Why it exists:** Instead of making the decoder rely on one summary, attention lets it re-read the whole input at every step and choose where to look. That removes the bottleneck.

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

### An attention table (illustrative numbers)

Translating "The cat sat on the mat" into Sinhala. When the decoder writes "poosa" (cat) the weights over the input words might look like this:

| Input word | The | cat | sat | on | the | mat |
|---|---|---|---|---|---|---|
| Weight when writing "poosa" | 0.08 | 0.85 | 0.03 | 0.01 | 0.01 | 0.02 |

Check: 0.08 + 0.85 + 0.03 + 0.01 + 0.01 + 0.02 = 1.00. Each row of weights sums to 1 because it comes out of a softmax. The attention weights for the next output word, "paduru" (mat), would put most weight on "mat" instead.

### Different ways to compute the score

| Name | Score between decoder state s and encoder state h |
|---|---|
| Dot product (Luong style) | s . h |
| Additive (Bahdanau style) | a small network applied to s and h together |
| Scaled dot-product (Transformer) | (s . h) / sqrt(d), see [file 19](19-transformers.md) |

**Where you'll meet it in real work:** neural machine translation, text summarisation, speech recognition, and every Transformer-based LLM. Attention maps are also used to debug what a model looked at.

**Common mistakes:**
- Thinking attention weights sum to 1 across the vector's dimensions. They sum to 1 across the **input positions**.
- Treating attention maps as a perfect explanation of the model's reasoning. They are helpful hints, not proofs.

**Exam angle:** state the three steps (score, softmax, weighted sum) and the benefit (no bottleneck, better on long sentences, interpretable).

> **සිංහලෙන්:** Attention කියන්නේ decoder එක හැම output වචනයක් හදද්දීම input එකේ හැම වචනයක්ම ආයෙත් බලලා, ඒ මොහොතට වැදගත්ම වචන වලට වැඩි බරක් දෙන එක. "The cat sat on the mat" පරිවර්තනය කරද්දී "පූසා" ලියන වෙලාවේ cat වචනයට 0.85ක් විතර බර දෙනවා, අනිත් වචන වලට ටිකයි. බර ඔක්කොම එකතු වුණාම 1 වෙනවා, softmax එකෙන් එන නිසා. පරිවර්තකයා සිංහල වචනයක් ලියද්දී මුල් කඩදාසිය බලලා අදාළ වචනය මත ඇඟිල්ල තියාගන්නවා වගේ.

---

## 14. Attention worked example

**Why it exists:** Attention sounds abstract until you push real numbers through it. These three steps (score, softmax, weighted sum) are exactly what Transformers do, only at a larger scale.

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

### A second run: change the question, change the focus

Same encoder states, but now the decoder state is s = [0, 3] (it is "asking" about the second dimension):

```
Step 1 scores:  s.h1 = 0x1 + 3x0 = 0
                s.h2 = 0x0 + 3x1 = 3
                s.h3 = 0x1 + 3x1 = 3
Step 2 softmax: e^0 = 1,  e^3 = 20.086,  e^3 = 20.086;  sum = 41.172
                weights = [0.024, 0.488, 0.488]
Step 3 context: 0.024x[1,0] + 0.488x[0,1] + 0.488x[1,1]
              = [0.024 + 0.488,  0.488 + 0.488] = [0.512, 0.976]
```

Compare with the first run (s = [2, 1], weights [0.245, 0.090, 0.665]). A different decoder state gives a different weighting, hence a different context vector. This is why attention is called *dynamic*: the focus changes at every step.

### What each step does

- **Dot product:** large when two vectors point the same way (similar). Like checking how well a question matches each possible answer.
- **Softmax:** turns any scores (even negative ones) into positive weights adding to 1. Big scores dominate: a score of 3 vs 2 gives 0.665 vs 0.245 here, not just a 3:2 ratio.
- **Weighted sum:** blends the encoder states by those weights. If one weight is near 1, the context is almost a copy of that state.

**Where you'll meet it in real work:** the code above, scaled up, is the core of every LLM. In PyTorch one line does it: `torch.softmax(H @ s, dim=0) @ H`.

**Common mistakes:**
- Forgetting the softmax and using the raw dot products as weights.
- Mixing up the order of the weighted sum. The weights multiply the encoder states, not the other way round.
- Making arithmetic slips with `e^x`. Keep four digits and check the weights sum to 1.

**Exam angle:** you may be asked to compute attention weights for small vectors, so practise the three-step recipe. In file 19 this becomes Query, Key, Value.

> **සිංහලෙන්:** Attention ගණන් කරන්නේ පියවර තුනකින්: මුලින් score එක (decoder state එකයි හැම encoder state එකකයි dot product), ඊට පස්සේ softmax එකෙන් බර 1ට එකතු වෙන විදිහට හදනවා, අන්තිමට බර අනුව encoder states මිශ්‍ර කරලා context vector එක හදනවා. උදාහරණයක්: scores [0, 3, 3] නම් weights [0.024, 0.488, 0.488] වෙනවා. Decoder state එක වෙනස් වුණාම weights වෙනස් වෙනවා, ඒකයි attention dynamic කියන්නේ. Softmax එක ගොඩක් වැදගත්, මොකද score 3ට 2ට වඩා ගොඩක් වැඩි බරක් ලැබෙනවා. මේකම තමයි Transformer එකේත් තියෙන්නේ.

---

## 15. Why RNNs were replaced

**Why it exists:** RNNs and LSTMs with attention worked well, but they were slow to train and still struggled with the longest sequences. Seeing exactly why they were replaced makes Transformers feel like a natural next step instead of a surprise.

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

### Worked example: sequential steps vs parallel work

For a 100-token sentence:

```
RNN / LSTM : 100 steps that must run one after another (step 100 waits for step 99)
             information from token 1 reaches token 100 through 99 hops
Transformer: 1 layer processes all 100 tokens at once on the GPU
             token 1 and token 100 are connected directly (1 hop)
```

### The price: attention cost grows with the square of the length

Every token attends to every other token, so there are n x n pairs:

| Sequence length n | Pairs (n x n) |
|---|---|
| 100 | 10,000 |
| 1,000 | 1,000,000 |
| 10,000 | 100,000,000 |

Ten times longer means a hundred times more attention work. That is why long-context LLMs need special tricks (efficient attention, KV caching, [file 20](20-how-llms-work.md)). An RNN's cost only grows linearly, and its memory per step stays fixed. That trade-off is why researchers are reviving recurrent-style ideas such as Mamba.

**Where you'll meet it in real work:** choosing models. A tiny sensor on a device with little memory might still run a small GRU; a customer-support assistant will use a Transformer-based LLM.

**Common mistakes:**
- Saying "RNNs are obsolete". They are less common for language, but still used for streaming and tiny on-device tasks.
- Saying attention is O(n) in the sequence length. Self-attention is O(n^2).

**Exam angle:** "Why did Transformers replace RNNs?" Answer with: parallel training on GPUs, direct paths between any two tokens, scalability. A table comparing RNN and Transformer on speed, path length and memory is a common exam format.

> **සිංහලෙන්:** RNN එකකින් token 100ක් process කරන්න නම් පියවර 100ක් එකින් එකට කරන්න ඕනේ, GPU එකට එකවර වැඩ ගොඩක් කරන්න බෑ. Transformer එකේදී token 100ම එකවර process වෙනවා, ඒ නිසා ලොකු data වලට train කරන එක වේගවත්. ඒ වගේම token 1ට token 100ට කෙළින්ම සම්බන්ධ වෙන්න පුළුවන්. වියදම නම් attention pairs ගණන n×n: token 1,000ක් නම් 1,000,000ක්, 10,000ක් නම් කෝටි 10ක්. ඒ නිසා දිග context එකකට විශේෂ උපක්‍රම ඕනේ. RNN සම්පූර්ණයෙන්ම මැරිලා නෑ, පොඩි ෆෝන් app වලට තාම පාවිච්චි වෙනවා.

```quiz
[
  {"q": "An RNN has W_x = 1, W_h = 0.5, b = 0, h0 = 0 and inputs [1, 0]. What is h2 (use tanh)?", "options": ["0.364", "0.762", "0.500", "0.881"], "answer": 0, "why": "h1 = tanh(1) = 0.762, then h2 = tanh(0 + 0.5 x 0.762) = tanh(0.381) = 0.364. 0.762 is h1, not h2, and 0.881 is the answer to the different input [1, 1]."},
  {"q": "Why do plain RNNs struggle to learn dependencies between words 20 steps apart?", "options": ["They have too few parameters", "They cannot read variable-length input", "The gradient is multiplied by factors below 1 at every step, so it vanishes", "Tanh cannot output negative numbers"], "answer": 2, "why": "Backpropagation through time multiplies many small factors, so the signal from early words fades (0.8^20 is about 0.01). RNNs handle variable length fine, and tanh outputs -1 to 1, so the other options are wrong."},
  {"q": "What makes the LSTM better at long-range memory than a plain RNN?", "options": ["It reads the sequence twice", "It has an additive cell-state update controlled by gates, giving gradients a clear path", "It uses ReLU instead of tanh", "It removes the hidden state"], "answer": 1, "why": "The cell state is updated as c = f x c_prev + i x candidate. With f near 1, information and gradients pass through almost unchanged. It still uses a hidden state and gates; ReLU is not the reason."},
  {"q": "nn.LSTM(50, 128) has 92,160 parameters. How many does nn.GRU(50, 128) have?", "options": ["23,040", "46,080", "92,160", "69,120"], "answer": 3, "why": "LSTM has 4 weight sets and GRU has 3, each of 23,040 (the plain RNN size). 3 x 23,040 = 69,120. 92,160 is the LSTM figure; 23,040 would be a plain RNN."},
  {"q": "For which task can you NOT use a bidirectional RNN?", "options": ["Tagging names in a finished sentence", "Classifying the sentiment of a complete review", "Generating the next word of a sentence", "Classifying a complete sensor recording"], "answer": 2, "why": "Generation needs a model that sees only the past, because the future words do not exist yet. The other three tasks have the full input available, so both directions can be used."},
  {"q": "In the seq2seq model, a decoder state s = [3, 0] attends over h1 = [1, 0] and h2 = [0, 1]. What are the approximate attention weights?", "options": ["[0.50, 0.50]", "[0.95, 0.05]", "[0.75, 0.25]", "[0.05, 0.95]"], "answer": 1, "why": "Scores are 3 and 0, so softmax gives e^3 / (e^3 + e^0) = 20.086 / 21.086 = 0.953 and 0.047. Equal weights would need equal scores; the weights cannot favour h2 when its score is lower."},
  {"q": "What is exposure bias in sequence models trained with teacher forcing?", "options": ["Training data is exposed to the test set", "At inference the model must use its own predictions, which it never practised with, so early errors can snowball", "The model memorises the vocabulary", "The gradient explodes during training"], "answer": 1, "why": "Teacher forcing feeds the true previous token during training, but at inference the model's own (possibly wrong) tokens are fed back. It is not data leakage and not an exploding gradient."},
  {"q": "Which is the main reason Transformers replaced RNNs for most language tasks?", "options": ["Transformers use fewer parameters", "Attention costs less than recurrence for long inputs", "Transformers process all positions in parallel and connect any two tokens directly", "RNNs cannot produce probabilities"], "answer": 2, "why": "Parallel computation (fast on GPUs) and path length 1 between any two tokens enable huge-scale training. Self-attention actually costs O(n^2), more than an RNN's O(n), so the cost option is wrong."}
]
```

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
