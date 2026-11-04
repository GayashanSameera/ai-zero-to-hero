# 25: Generative Models and Multimodal AI: Images, Audio, Video

> **Before you start:** [07](07-math-probability-statistics.md) (normal distribution, KL divergence, MLE, softmax, cross-entropy), [11](11-ml-fundamentals.md#2-types-of-machine-learning) (generative vs discriminative), [15](15-neural-networks.md) (neural networks, losses, embeddings), [16](16-cnns-and-computer-vision.md) (CNNs, U-Net, contrastive/Siamese learning, transfer learning), [19](19-transformers.md) (Transformers, cross-attention, ViT), [20](20-how-llms-work.md) (autoregressive generation, tokens), [21](21-training-finetuning-alignment.md#9-lora) (LoRA), [23](23-embeddings-vector-databases-rag.md) (contrastive training, InfoNCE, embeddings).
>
> **After this file you can:** explain how the main generative model families work (autoregressive models, autoencoders, VAEs, GANs, diffusion), how text-to-image systems like Stable Diffusion work end to end, how CLIP connects images and text, how vision-language models "see", and how speech recognition, text-to-speech and video generation work.

---

## Table of contents

1. [Generative vs discriminative models (recap)](#1-generative-vs-discriminative)
2. [Families of generative models](#2-families-of-generative-models)
3. [Autoencoders](#3-autoencoders)
4. [Variational Autoencoders (VAEs)](#4-vaes)
5. [GANs: Generative Adversarial Networks](#5-gans)
6. [Diffusion models: the core idea](#6-diffusion-the-core-idea)
7. [Training and sampling a diffusion model](#7-training-and-sampling-diffusion)
8. [The denoiser network: U-Net and Diffusion Transformers](#8-the-denoiser-network)
9. [Latent diffusion (Stable Diffusion)](#9-latent-diffusion)
10. [Text conditioning and classifier-free guidance](#10-text-conditioning-and-cfg)
11. [Image editing: img2img, inpainting, ControlNet, LoRA](#11-image-editing)
12. [Evaluating image generation](#12-evaluating-image-generation)
13. [CLIP: connecting images and text](#13-clip)
14. [Vision-language models (VLMs)](#14-vision-language-models)
15. [Speech and audio: ASR, TTS, music](#15-speech-and-audio)
16. [Video generation](#16-video-generation)
17. [Multimodal applications and the risks](#17-applications-and-risks)
18. [Check yourself](#18-check-yourself)
19. [New words in this file](#19-new-words-in-this-file)

---

## 1. Generative vs discriminative

**Why it exists:** most ML you met so far *judges* things (spam or not, cat or dog). Generative AI *makes* things: a poster, a voice, a paragraph. Knowing the difference tells you why a classifier cannot paint, and why a painter model needs a different recipe.

From [file 01](01-big-picture-and-data.md#generative-ai-genai) and [file 11](11-ml-fundamentals.md#2-types-of-machine-learning):

| | **Discriminative** | **Generative** |
|---|---|---|
| Learns | P(y \| x): the boundary between classes | P(x) (or P(x \| condition)): what the data itself looks like |
| Can | Classify, predict | **Create new samples** that look like the training data |
| Examples | Logistic regression, classifiers, BERT classifiers | Naive Bayes, GMMs, LLMs, VAEs, GANs, diffusion models |

**Analogy:** a discriminative art critic can tell a Van Gogh from a Monet. A generative artist can **paint** a new picture in Van Gogh's style.

**Conditional generation:** generate x given some condition, e.g. an image **given a text prompt**, or speech **given text**.

**Worked example (same photo, two jobs):** you have 10,000 photos of Sri Lankan street scenes.

| Job | Model type | Input | Output |
|---|---|---|---|
| "Is there a tuk-tuk in this photo?" | Discriminative | a photo | yes or no (a probability like 0.97) |
| "Draw me a new street scene with a tuk-tuk." | Generative | a text prompt (optional) | a brand-new image that did not exist before |

The first model learns a *boundary* between "tuk-tuk" and "no tuk-tuk". The second learns what street scenes *look like* well enough to produce new ones.

**Where you'll meet it in real work:** your phone keyboard's next-word suggestion and ChatGPT are generative; a bank's fraud score is discriminative. Many products combine both: a generative model writes the reply, a discriminative classifier checks it is safe.

**Common mistakes:**
- Thinking "generative" means "creative" in a human sense. The model reproduces patterns from its training data.
- Assuming a generative model always gives the same output. Sampling randomness (and the seed) lets it give a different valid result each time.

**Exam angle:** a definition question, "which model learns P(x) and can create new samples?" Answer: generative. Discriminative models learn P(y | x).

> **සිංහලෙන්:** Discriminative model එකක් කරන්නේ "මේ පින්තූරේ tuk-tuk එකක් තියෙනවද?" වගේ ඔව්/නැහැ තීරණයක් දෙන එක. Generative model එකක් අලුත්ම පින්තූරයක්, කටහඬක් හෝ ඡේදයක් හදනවා. චිත්‍ර විචාරකයෙක් Van Gogh සහ Monet හඳුනාගන්නවා වගේ තමයි discriminative එක, චිත්‍ර ශිල්පියා අලුත් පින්තූරයක් අඳිනවා වගේ තමයි generative එක. ඔයාගේ phone එකේ ඊළඟ වචනේ යෝජනා කරන keyboard එක generative, bank එකේ fraud score එක discriminative.

---

## 2. Families of generative models

**Why it exists:** nobody found one perfect way to generate data. Each family trades off quality, variety and speed, and knowing the trade-offs explains why diffusion took over images while autoregressive models rule text.

| Family | Idea | Strengths | Weaknesses | Examples |
|---|---|---|---|---|
| **Autoregressive** | Generate one piece at a time, each conditioned on previous pieces ([file 20](20-how-llms-work.md#8-the-generation-loop)) | Exact likelihood; excellent for text | Slow sequential generation | GPT, Claude, Llama; also some image/audio models |
| **VAE** | Encode into a probabilistic latent space, decode samples | Smooth latent space; fast | Blurry samples | Used as the compressor inside Stable Diffusion |
| **GAN** | Generator vs discriminator game | Sharp images; fast sampling | Unstable training; mode collapse | StyleGAN |
| **Normalizing flows** | Invertible transformations from simple noise to data | Exact likelihood | Architecture constraints | Glow |
| **Diffusion / flow matching** | Learn to gradually remove noise | **Best quality and diversity** for images/video/audio | Many sampling steps (slower) | Stable Diffusion, DALL·E 3, Imagen, Midjourney, Flux, Sora, Veo |

**The three-way tension:** researchers sometimes describe a "generative trilemma": it is hard to be good at all three of **quality** (sharp, realistic samples), **diversity** (covering all the variety in the data) and **speed** (fast sampling) at once.

| Family | Quality | Diversity | Speed |
|---|---|---|---|
| GAN | high | can be low (mode collapse) | very fast (one pass) |
| VAE | medium (blurry) | high | fast |
| Diffusion | very high | high | slow (many steps), improving with distillation |
| Autoregressive | very high for text | high | slow (one token at a time) |

**Worked example (speed):** a GAN produces an image in 1 network pass. A diffusion model with 30 steps needs 30 passes. If each pass takes 0.05 seconds (an assumed number), GAN = 0.05 s and diffusion = 30 x 0.05 = **1.5 s**. A distilled 4-step diffusion model takes 4 x 0.05 = 0.2 s. That is why distillation is such a hot topic.

**Where you'll meet it in real work:** a design tool that makes images in 1 to 2 seconds probably uses a distilled model; a studio-quality poster generator can afford more steps.

**Common mistake:** believing GANs are "dead". They are used less for open-ended image generation but remain useful where one-pass speed matters.

**Exam angle:** match the family to its signature weakness: GAN to mode collapse and unstable training, VAE to blurry images, diffusion to slow sampling, autoregressive to sequential generation.

> **සිංහලෙන්:** Generative models වර්ග කිහිපයක් තියෙනවා, ඒ හැම එකකටම ගුණයි අඩුපාඩුයි තියෙනවා. GAN එකක් එක පාරින් පින්තූරේ හදන නිසා ඉතාම වේගවත්, ඒත් training අස්ථායී වෙන්න පුළුවන්. VAE පින්තූර බොඳ වෙනවා. Diffusion ගුණාත්මකභාවයෙන් හොඳම, ඒත් පියවර ගොඩක් යන නිසා ටිකක් ඉක්මනින් නෑ. පියවරක් තත්පර 0.05ක් නම්, පියවර 30ක diffusion එකට තත්පර 1.5ක් යනවා, distill කරපු පියවර 4ක model එකට තත්පර 0.2යි.

---

## 3. Autoencoders

**Why it exists:** raw data (a 784-pixel image) is mostly redundant. An autoencoder learns to squeeze data into a tiny code and rebuild it, which teaches the network which features really matter.

An **autoencoder** is a neural network trained to **reproduce its input** through a narrow **bottleneck**.

```
Input x ──► [Encoder] ──► z (small "code") ──► [Decoder] ──► x̂ (reconstruction)
 (784)                       (e.g. 32)                          (784)

Loss = reconstruction error, e.g. MSE(x, x̂)
```

- **Encoder:** compresses the input into a small **latent vector** z (the **latent space** = the space of these codes)
- **Decoder:** reconstructs the input from z

Because z is small, the network must learn the **most important features** (like PCA, [file 14](14-unsupervised-learning-and-more.md#8-pca), but non-linear).

**Uses:**
- Compression and dimensionality reduction
- **Denoising autoencoders:** input = noisy image, target = clean image → learns to remove noise
- **Anomaly detection** ([file 14](14-unsupervised-learning-and-more.md#10-anomaly-detection)): trained on normal data; anomalies reconstruct badly (high reconstruction error)
- Pretraining features

**Why a plain autoencoder can't generate well:** its latent space has gaps. If you pick a random z, the decoder often produces garbage, because nothing forced the codes to be organised. The VAE fixes this.

**Worked example (compression ratio):** a 28 x 28 grey image has 28 x 28 = 784 numbers. A bottleneck of 32 means the code is 32 numbers. Compression = 784 / 32 = **24.5 times** smaller.

**Worked example (reconstruction loss with three pixels):** the input is x = [0.2, 0.8, 0.5] and the decoder returns x̂ = [0.3, 0.6, 0.5].

| Pixel | x | x̂ | error | squared error |
|---|---|---|---|---|
| 1 | 0.2 | 0.3 | -0.1 | 0.01 |
| 2 | 0.8 | 0.6 | 0.2 | 0.04 |
| 3 | 0.5 | 0.5 | 0 | 0 |

MSE = (0.01 + 0.04 + 0)/3 = 0.05/3 = **0.0167**. Training pushes this number down.

**Where you'll meet it in real work:** a bank trains an autoencoder on normal card transactions. A strange transaction reconstructs badly (high error), which raises a fraud alert. A factory can do the same with photos of good products.

**Common mistakes:**
- Making the bottleneck so large that the network just copies the input and learns nothing useful.
- Using a plain autoencoder to *generate* images. Random codes land in the gaps; use a VAE for that.

**Exam angle:** autoencoder = encoder + bottleneck + decoder, trained with reconstruction loss; uses are compression, denoising and anomaly detection.

> **සිංහලෙන්:** Autoencoder එකක් කරන්නේ පින්තූරයක් පොඩි "කේතයකට" හකුළලා ආපහු හදන එක. පික්සල් 784ක පින්තූරයක් අංක 32කට හකුළුවනවා නම් 784 ÷ 32 = 24.5 ගුණයක් පොඩි වෙනවා. Loss එක කියන්නේ මුල් එකයි හදපු එකයි අතර වෙනස. Bank එකක සාමාන්‍ය transactions වලින් train කළොත් අමුතු transaction එකක් හොඳට ආපහු හදන්න බැරි වෙනවා, ඒ නිසා ඒක fraud alert එකක් විදිහට පාවිච්චි කරන්න පුළුවන්. හැබැයි සාමාන්‍ය autoencoder එකෙන් අලුත් පින්තූර හදන්න බෑ.

---

## 4. VAEs

**Why it exists:** a plain autoencoder's latent space has holes, so random codes decode to garbage. The VAE forces the codes to sit in one smooth, tidy region, so any random point in that region decodes to something sensible.

A **Variational Autoencoder (VAE)** makes the latent space **smooth and organised** so you can sample from it.

**Key change:** the encoder outputs a **distribution** (a mean μ and standard deviation σ for each latent dimension, [normal distribution, file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)) instead of a single point. We **sample** z from that distribution, then decode.

```
x ──► Encoder ──► μ, σ ──► sample z = μ + σ·ε  (ε ~ N(0, 1)) ──► Decoder ──► x̂
```

### The loss: two parts

```
VAE loss = Reconstruction loss  +  KL( q(z|x) ‖ N(0, I) )
           (make x̂ look like x)    (keep each code distribution close to a standard normal)
```

- **Reconstruction loss:** decoded output should match the input
- **KL divergence term** ([file 07](07-math-probability-statistics.md#24-kl-divergence)): pushes every encoded distribution towards a standard normal N(0, 1). This packs codes together smoothly with no gaps.

(Mathematically, this loss is the negative of the **ELBO**, the Evidence Lower BOund on the data's log-likelihood.)

**Result:** sample z from N(0, 1) → decode → a new, plausible image. Moving smoothly through latent space gives smooth changes in the output (e.g. a face gradually smiling).

### The reparameterisation trick

We can't backpropagate through random sampling directly. So write z = μ + σ·ε, where ε is random noise drawn separately. Now randomness is an input, and gradients flow through μ and σ normally ([backprop, file 15](15-neural-networks.md#8-backpropagation-worked-example)).

**Weakness:** VAE images tend to be **blurry** (the reconstruction loss averages over possibilities).

**Big role today:** the VAE is used in **latent diffusion** (section 9) to compress images into a small latent space where diffusion runs efficiently.

**Worked example (the reparameterisation trick):** the encoder outputs μ = 2 and σ = 0.5 for one latent number. We draw random noise ε = -1.2. Then z = μ + σ·ε = 2 + 0.5 × (-1.2) = 2 - 0.6 = **1.4**. The randomness (ε) is an input; μ and σ are ordinary numbers that gradients can flow through.

**Worked example (the KL penalty for one dimension):** for a Gaussian N(μ, σ²) compared with the standard normal N(0, 1), the penalty is KL = ½ (μ² + σ² - 1 - ln σ²).

- Encoder A: μ = 0, σ = 1. KL = ½ (0 + 1 - 1 - 0) = **0**. It already matches N(0, 1).
- Encoder B: μ = 2, σ = 0.5. KL = ½ (4 + 0.25 - 1 - ln 0.25) = ½ (3.25 + 1.386) = **2.32**. The code is off-centre and narrow, so it pays a penalty and training pulls it closer.

The total loss balances the two parts: reconstruction wants sharp, individual codes; KL wants everything squeezed towards N(0, 1).

**Where you'll meet it in real work:** the VAE inside Stable Diffusion; also molecule and drug design, where smooth latent spaces let researchers move gradually from one molecule to another.

**Common mistakes:**
- Thinking the "variational" part is mysterious. It just means the encoder predicts a distribution instead of a point.
- Forgetting the KL term; without it you have a plain autoencoder with gaps.

**Exam angle:** know the two loss terms, why the reparameterisation trick exists (to allow backpropagation through sampling), and that VAE outputs are blurrier than GAN or diffusion outputs.

> **සිංහලෙන්:** VAE එකේ encoder එක එක ලකුණක් නෙවෙයි, සාමාන්‍යයක් (μ) සහ පැතිරීමක් (σ) දෙනවා, ඊට පස්සේ අපි ඒකෙන් random අගයක් අරගෙන decode කරනවා. μ = 2, σ = 0.5, ε = −1.2 නම් z = 2 + 0.5 × (−1.2) = 1.4. Loss එකේ කොටස් දෙකක් තියෙනවා: මුල් පින්තූරයට සමාන කරන reconstruction එකයි, codes ඔක්කොම N(0,1) ළඟට තල්ලු කරන KL එකයි. ඒ නිසා latent space එකේ හිස්තැන් නැති වෙලා ඕනෑම random අගයකින් හරි පින්තූරයක් හදන්න පුළුවන්. දුර්වලකම නම් පින්තූර ටිකක් බොඳ වීමයි.

---

## 5. GANs

**Why it exists:** how do you teach a network to make "realistic" images when you cannot write a formula for realistic? The GAN idea: let a second network judge realism, and let the two improve each other by competing.

**GAN (Generative Adversarial Network, 2014):** two networks compete in a game:

- **Generator (G):** takes random noise z and produces a fake image G(z). Goal: **fool** the discriminator.
- **Discriminator (D):** looks at an image and outputs the probability it's **real** (from the dataset) rather than fake. Goal: **catch** fakes.

```
Random noise z ──► [Generator] ──► fake image ──┐
                                                 ├──► [Discriminator] ──► "real or fake?"
Real images from dataset ───────────────────────┘
```

**Analogy:** a counterfeiter (generator) and a police detective (discriminator). The counterfeiter makes fake money; the detective learns to spot it; the counterfeiter improves; the detective improves... Eventually the fakes are indistinguishable from real money.

**Training:** alternate:
1. Train D to classify real vs fake correctly (binary cross-entropy, [file 07](07-math-probability-statistics.md#23-cross-entropy))
2. Train G to make D classify its fakes as real

This is a **minimax game**: G minimises what D maximises.

### Problems

- **Unstable training:** the two networks can oscillate instead of improving; careful tuning needed
- **Mode collapse:** the generator finds a few outputs that fool D and keeps producing only those (e.g. only one kind of face), losing **diversity**
- No direct likelihood to measure progress

**Successes:** **StyleGAN** produced photorealistic faces (thispersondoesnotexist.com); image-to-image translation (Pix2Pix, CycleGAN: horses → zebras, sketches → photos); super-resolution. GANs are still used where fast single-step generation matters, and adversarial losses help train other models (e.g. VAE decoders, fast diffusion distillation). But **diffusion models overtook GANs** for most image generation from about 2021 onward.

**Worked example (one discriminator step):** the discriminator sees one real image and one fake. It says P(real) = 0.9 for the real one and P(real) = 0.2 for the fake. Using binary cross-entropy:

- Loss on the real image: -ln(0.9) = **0.105** (good, small)
- Loss on the fake: -ln(1 - 0.2) = -ln(0.8) = **0.223**
- Discriminator loss = 0.105 + 0.223 = **0.328**

Now the generator's turn. It wants the discriminator to say "real" for its fake. At P(real) = 0.2 the generator is doing badly, so it updates its weights to push that number up. Next round the discriminator gets better at catching the improved fakes. Round and round they go.

**Analogy in rupees:** a counterfeiter prints fake Rs. 1,000 notes; the bank teller learns to spot them; the counterfeiter fixes the flaws; and so on, until the fakes are hard to tell from real notes.

**Where you'll meet it in real work:** face generators, photo super-resolution, turning sketches into photos, and generating synthetic training data. Deepfake videos in the past also relied on GAN techniques.

**Common mistakes:**
- Believing a lower generator loss always means better images. The two losses depend on each other; they do not fall steadily like a normal training loss.
- Confusing mode collapse (few kinds of outputs) with overfitting.

**Exam angle:** describe the generator and discriminator roles, name mode collapse as the typical failure, and know that diffusion models mostly replaced GANs for image quality.

> **සිංහලෙන්:** GAN එකක networks දෙකක් තරග කරනවා. Generator එක බොරු පින්තූර හදනවා, discriminator එක ඒක ඇත්තද බොරුද කියලා අල්ලනවා. බොරු රු. 1,000 නෝට්ටු අච්චු ගහන කෙනෙක්යි, ඒවා අඳුරගන්න ඉගෙන ගන්න බැංකුවේ teller කෙනෙක්යි වගේ. Discriminator එක ඇත්ත පින්තූරයට 0.9ත්, බොරුවට 0.2ත් දුන්නොත් එහි loss එක 0.105 + 0.223 = 0.328යි. මේකේ ප්‍රධාන ප්‍රශ්නය mode collapse, ඒ කියන්නේ generator එක එකම වර්ගයේ පින්තූර ටිකක් විතරක් හදන්න පටන් ගන්න එක.

---

## 6. Diffusion: the core idea

**Why it exists:** making a perfect image in one shot is very hard (that is the GAN problem). Removing a tiny bit of noise is easy. Diffusion turns the hard job into hundreds of easy jobs.

**Diffusion models** learn to **reverse a gradual noising process**.

### Forward process (fixed, no learning)

Take a real image and add a little **Gaussian noise** ([file 07](07-math-probability-statistics.md#12-the-normal-distribution-and-z-scores)), step by step, over T steps (e.g. T = 1,000). Eventually the image is **pure random noise**.

```
x₀ (photo of a cat) → x₁ (slightly noisy) → ... → x₅₀₀ (very noisy) → ... → x₁₀₀₀ (pure static)
```

### Reverse process (learned)

Train a neural network to **remove noise** a little at a time. To generate a new image: start from **pure random noise** and denoise it step by step until a clean image appears.

```
pure noise x_T → denoise → ... → denoise → x₀ (a brand-new image)
```

**Analogy:** a sculptor who starts with a rough block and removes a little material at each step until a statue emerges. Or: a photo slowly dissolving into TV static. The model learns to play that video **backwards**.

**Why this works so well:** each denoising step is an **easy** task (remove a little noise), unlike a GAN generator that must produce a perfect image in one shot. Training is a simple, stable regression problem.

**Text picture (one pixel's journey):** imagine a single brightness number, 0.8 (a bright pixel).

```
Forward  (add noise):   0.80 ─► 0.72 ─► 0.55 ─► 0.20 ─► -0.10 ─► (random)
                       t=0     t=100   t=400   t=700   t=1000
Reverse  (denoise):    (random) ─► ... ─► 0.60 ─► 0.75 ─► 0.80      (learned by the network)
```

The numbers are illustrative; the point is that forward is a fixed recipe with nothing to learn, while reverse is what the network learns.

**Analogy (from the Sinhala course):** a sand sculpture slowly blowing away in the wind is the forward process. A skilled artist who starts from a pile of sand and removes the right grains, step by step, to reveal a new elephant is the reverse process. The text prompt is the instruction "make me an elephant".

**Where you'll meet it in real work:** Stable Diffusion, DALL-E 3, Midjourney, Imagen and video models such as Sora and Veo are all built on this idea.

**Common mistakes:**
- Thinking the model "draws" the image directly. It repeatedly removes noise from a noisy canvas.
- Thinking the forward process is learned. It is a fixed noise schedule; only the reverse is learned.

**Exam angle:** forward = fixed, adds Gaussian noise; reverse = learned, removes noise step by step; generation starts from pure random noise.

> **සිංහලෙන්:** Diffusion කියන්නේ පින්තූරයකට ටික ටික noise එකතු කරලා අන්තිමට TV static එකක් කරනවා (forward), ඊට පස්සේ model එක ඒක ආපහු ටික ටික පිරිසිදු කරන්න ඉගෙන ගන්නවා (reverse). වැලි පිළිමයක් සුළඟට විසිරෙනවා වගේ forward එක, දක්ෂ කලාකරුවෙක් වැලි ගොඩකින් අලියෙක් හදනවා වගේ reverse එක. ඒක එක පාරකට හරියට පින්තූරේ අඳිනවට වඩා ලේසියි, මොකද හැම පියවරකදීම කරන්නේ පොඩි noise ටිකක් අයින් කරන එක විතරයි. අලුත් පින්තූරයක් හදද්දී පටන් ගන්නේ සම්පූර්ණ random noise එකකින්.

---

## 7. Training and sampling diffusion

**Why it exists:** to train the network you need a clean image and its noisy version at some noise level. The shortcut formula lets you create any noisy version in one step instead of running through all 1,000 steps, which makes training fast and simple.

### A handy shortcut

Because added Gaussian noise accumulates in a predictable way, you can jump **directly** to any noise level t:

```
x_t = √(ᾱ_t) · x₀  +  √(1 − ᾱ_t) · ε          ε ~ N(0, I)  (random noise)
```

ᾱ_t ("alpha-bar") goes from ≈1 (t = 0, almost no noise) to ≈0 (t = T, almost all noise), following a **noise schedule**.

**Example:** at a step where ᾱ_t = 0.25: x_t = 0.5·x₀ + 0.866·ε, i.e. half image, mostly noise.

### Training (DDPM, 2020)

Repeat:
1. Pick a real image x₀
2. Pick a random timestep t
3. Sample noise ε
4. Make the noisy image x_t using the formula above
5. The network **predicts the noise**: ε̂ = model(x_t, t)
6. **Loss = MSE(ε, ε̂)**: how well did it guess the noise that was added? ([MSE, file 11](11-ml-fundamentals.md#6-loss-functions))

That's it: the network learns "given a noisy image and how noisy it is, what noise is in it?" Once you know the noise, you can subtract it.

### Sampling

Start with x_T = pure noise. For t = T down to 1: predict the noise, remove a bit of it (plus a little fresh noise in DDPM), get x_{t−1}. Output x₀.

**Speed problem:** 1,000 steps = 1,000 network evaluations per image. Solutions:
- **DDIM** and modern **samplers/solvers** (DPM-Solver, Euler...): 20 to 50 steps with similar quality
- **Distillation** (consistency models, adversarial distillation, e.g. "Turbo"/"Lightning" models): 1 to 4 steps
- **Flow matching / rectified flow:** a related formulation learning straighter paths from noise to data, which need fewer steps; used in Stable Diffusion 3 and Flux

**Worked example (the shortcut formula):** take a single pixel x₀ = 0.8 and a noise draw ε = -0.5.

- At ᾱ_t = 0.25: x_t = √0.25 · 0.8 + √0.75 · (-0.5) = 0.5 × 0.8 + 0.866 × (-0.5) = 0.4 - 0.433 = **-0.033**. Mostly noise; the pixel has almost lost its brightness.
- At ᾱ_t = 0.81: x_t = √0.81 · 0.8 + √0.19 · (-0.5) = 0.9 × 0.8 + 0.436 × (-0.5) = 0.72 - 0.218 = **0.502**. A lightly noisy version.

**Worked example (one training loss):** the true noise was ε = -0.5 and the network predicted ε̂ = -0.3. Squared error = (-0.5 - (-0.3))² = (-0.2)² = **0.04**. Training nudges the weights so that this number falls over millions of examples.

**Noise schedule (from the Sinhala course):** a *linear* schedule adds noise at a steady rate; a *cosine* schedule adds it more gently at the start so fine details are not destroyed too quickly.

**Sampling cost:** assume 0.05 s per network pass.

| Method | Steps | Time per image |
|---|---|---|
| Original DDPM | 1,000 | 50 s |
| DDIM or DPM-Solver | 30 | 1.5 s |
| Distilled (Turbo / Lightning) | 4 | 0.2 s |

**Where you'll meet it in real work:** the "steps" slider in image apps: more steps usually means a bit more detail and a longer wait.

**Common mistakes:**
- Thinking the network predicts the clean image directly. In classic DDPM it predicts the *noise*.
- Using many sampling steps for a distilled model that was trained for 4; more steps can even hurt.

**Exam angle:** training target = the added noise; loss = MSE between true and predicted noise; speed-ups = better samplers, distillation, flow matching.

> **සිංහලෙන්:** Diffusion train කරද්දී model එකට "මේ noisy පින්තූරේට එකතු කරපු noise එක මොකක්ද?" කියලා අනුමාන කරන්න දෙනවා. Noise එක එකතු කරන්න පියවර 1,000ම යන්න ඕනේ නෑ, shortcut formula එකෙන් කෙලින්ම ඕනෑම noise level එකකට පැනලා යන්න පුළුවන්. උදාහරණයක් විදිහට pixel එක 0.8, ᾱ = 0.25, ε = −0.5 නම් x_t = 0.5 × 0.8 + 0.866 × (−0.5) = −0.033. True noise −0.5 සහ අනුමාන −0.3 නම් loss එක (−0.2)² = 0.04. අලුත් පින්තූරයක් හදද්දී පියවර 1,000 වෙනුවට 30ක් හෝ distill කරපු model එකකින් 4ක් විතරක් පාවිච්චි කරනවා.

---

## 8. The denoiser network

**Why it exists:** something has to look at the noisy image and say what noise is in it. That "something" must keep the image's shape (same size in, same size out) and know the noise level. Two architectures dominate.

The noise-prediction network takes a noisy image + the timestep (+ text condition, section 10) and outputs a noise estimate of the **same size** as the image.

### U-Net

The classic choice: the encoder-decoder with skip connections from [file 16](16-cnns-and-computer-vision.md#15-segmentation), with added:
- **Timestep embedding:** tells the network how noisy the input is
- **Self-attention layers** at lower resolutions
- **Cross-attention layers** ([file 19](19-transformers.md#9-multi-head-attention)) for the text prompt

Used in Stable Diffusion 1.x/2.x/SDXL.

### Diffusion Transformer (DiT)

Replace the U-Net with a **Transformer** operating on image **patches** (like ViT, [file 19](19-transformers.md#20-vision-transformer)). Scales better with more compute. Used in Stable Diffusion 3, Flux, Sora and most new image/video models.

**Shapes (worked example):** in Stable Diffusion the denoiser works on a latent such as 128 x 128 x 4. Input shape (128, 128, 4) in, predicted-noise shape (128, 128, 4) out: always the same size as the input.

**Token count for a Diffusion Transformer:** cut that 128 x 128 latent into patches of 2 x 2. Patches = (128 / 2) × (128 / 2) = 64 × 64 = **4,096 tokens**. The Transformer treats each patch like a word. Larger images or video mean more tokens and more compute.

| | U-Net | Diffusion Transformer (DiT) |
|---|---|---|
| Building blocks | convolutions + skip connections + attention | Transformer blocks over patches |
| Handles text through | cross-attention layers | cross-attention or joint attention |
| Scales with compute | OK | better |
| Used in | Stable Diffusion 1.x, 2.x, SDXL | Stable Diffusion 3, Flux, Sora and most new models |

**Where you'll meet it in real work:** when someone says "this model is a DiT", they mean the denoiser is a Transformer, which usually makes it easier to scale on big GPU clusters.

**Common mistakes:**
- Forgetting the timestep. Without knowing how noisy the input is, the network cannot decide how much to remove.
- Assuming the denoiser is a text model. It is an image (or latent) model that takes text as extra guidance.

**Exam angle:** know the two denoiser families and that the Transformer-based one operates on patches (like ViT, file 19).

> **සිංහලෙන්:** Denoiser එක කියන්නේ noisy පින්තූරේ බලලා "මොන noise එකද තියෙන්නේ?" කියලා කියන network එක. ඒක ආපහු දෙන්නේ input එකේ ප්‍රමාණයම වගේ output එකක්. U-Net එකේ convolutions සහ skip connections තියෙනවා, Diffusion Transformer (DiT) එකේ පින්තූරේ පොඩි patches වලට කඩලා හැම patch එකම වචනයක් වගේ Transformer එකට දෙනවා. 128 × 128 latent එකක් 2 × 2 patches වලට කැපුවොත් 64 × 64 = 4,096 tokens හැදෙනවා. Noise එක කොච්චරද කියන timestep එකත් network එකට දෙන්න ඕනේ.

---

## 9. Latent diffusion

**Why it exists:** running diffusion on every pixel of a big image is slow and needs a huge GPU. Latent diffusion first squeezes the image with a VAE, does all the denoising in the small space, and only expands to full size at the very end.

**Problem:** running diffusion directly on a 1024×1024×3 image (3 million numbers) for 50 steps is very expensive.

**Latent diffusion** (Stable Diffusion, 2022): run diffusion in the **compressed latent space** of a VAE (section 4).

```
TRAINING:   image (1024×1024×3) ──VAE encoder──► latent (128×128×4) ──► diffusion training happens here

GENERATION:
 text prompt ──► text encoder (CLIP / T5) ──► text embeddings ─────────┐
                                                                        │ cross-attention
 random noise latent (128×128×4) ──► [U-Net/DiT denoiser × ~30 steps] ◄─┘
                                          │
                                          ▼
                                   clean latent ──VAE decoder──► final image (1024×1024×3)
```

The latent is **48× smaller** (128 × 128 × 4 = 65,536 vs 3,145,728 numbers), so generation is far cheaper, and it can run on consumer GPUs.

### Full text-to-image pipeline

1. **Tokenise and encode the prompt** with a text encoder (CLIP's text encoder, section 13, and/or a T5 language model) → a sequence of text embeddings
2. **Start with random noise** in latent space (the random **seed** determines it, so the same seed + prompt + settings gives the same image)
3. **Denoise** for N steps, with the text guiding each step through cross-attention, and **classifier-free guidance** (section 10)
4. **Decode** the final latent with the VAE decoder into pixels
5. (Optional) **safety checker** filters unsafe outputs; upscaler for higher resolution

```python
# pip install diffusers transformers accelerate
import torch
from diffusers import AutoPipelineForText2Image

pipe = AutoPipelineForText2Image.from_pretrained(
    "stabilityai/sdxl-turbo", torch_dtype=torch.float16).to("cuda")
image = pipe(prompt="a watercolor painting of a tuk-tuk on a rainy Colombo street",
             num_inference_steps=4, guidance_scale=0.0,     # turbo models: few steps, no CFG
             generator=torch.Generator("cuda").manual_seed(42)).images[0]
image.save("tuktuk.png")
```

**Worked example (from the Sinhala course, 512 x 512):** a 512 x 512 RGB image has 512 × 512 × 3 = 786,432 numbers. The VAE compresses it to a 64 x 64 x 4 latent = 16,384 numbers. 786,432 / 16,384 = **48 times** fewer. Each side is 8 times smaller (512 / 64 = 8), so there are 8 × 8 = 64 times fewer *positions*, which is where the "64 times" idea comes from. Denoising 30 steps in this small space is far cheaper than 30 steps on the full image.

**Analogy:** sketch on a small notepad first (cheap and fast), then enlarge it into a finished poster at the end.

**Who does what:**

| Piece | Job |
|---|---|
| VAE encoder | image to latent (used in training and img2img) |
| Text encoder (CLIP / T5) | prompt to text embeddings |
| Denoiser (U-Net / DiT) | the repeated noise removal, guided by text |
| VAE decoder | final latent to pixels |

**Reading the code:** in the diffusers example, `num_inference_steps=4` is the number of denoising steps, `guidance_scale=0.0` turns off classifier-free guidance because a Turbo model was trained without it, and the manual seed makes the starting noise repeatable.

**Where you'll meet it in real work:** running Stable Diffusion on a consumer GPU or a small cloud instance; product photo tools; poster makers for shops.

**Common mistakes:**
- Thinking the VAE is the image generator. It is only the compressor and decompressor; the denoiser generates in latent space.
- Forgetting that fine detail (small text, faces) can suffer from heavy compression in the VAE.

**Exam angle:** "Why is Stable Diffusion efficient?" Because diffusion runs in a compressed latent space, not pixel space.

> **සිංහලෙන්:** Latent diffusion වලදී පින්තූරේ ලොකු pixel ප්‍රමාණය එක්ක කෙලින්ම වැඩ කරන්නේ නැතුව මුලින් VAE එකකින් පොඩි latent එකකට හකුළනවා. 512 × 512 × 3 = 786,432 අංක තියෙන පින්තූරයක් 64 × 64 × 4 = 16,384 latent එකක් වෙනවා, ඒ කියන්නේ 48 ගුණයක් පොඩියි. Denoising පියවර 30 ඒ පොඩි space එකේ කරලා, අන්තිමට VAE decoder එකෙන් ආපහු ලොකු පින්තූරේ හදනවා. ඒ නිසා Stable Diffusion සාමාන්‍ය GPU එකකින්වත් දුවන්න පුළුවන්. Prompt එක CLIP වගේ text encoder එකකින් embedding එකක් වෙලා denoising එක මෙහෙයවනවා.

---

## 10. Text conditioning and CFG

**Why it exists:** a diffusion model on its own often produces pretty images that only vaguely match the prompt. Classifier-free guidance (CFG) is a cheap trick that pushes each step more firmly towards what the text says.

### Cross-attention conditioning

In the denoiser, image features act as **queries**; the text embeddings act as **keys and values** ([file 19](19-transformers.md#5-query-key-value)). Each image region "looks up" relevant words. The region where a cat is forming attends strongly to the token "cat". (Visualising these cross-attention maps shows which words influence which parts of the image.)

### Classifier-Free Guidance (CFG)

Plain conditioning often produces images that only loosely follow the prompt. **CFG** strengthens prompt adherence:

1. During training, randomly **drop the text** (replace with empty) ~10% of the time, so one model learns both **conditional** and **unconditional** noise prediction
2. At generation, compute **both** predictions at each step and **extrapolate** towards the conditional one:

```
ε_guided = ε_uncond + w × (ε_cond − ε_uncond)
```

- w = **guidance scale** (often 5 to 9 for classic Stable Diffusion)
- w = 1: normal conditional prediction; w = 0: ignores the prompt; larger w: follows the prompt more strongly

**Worked example (one number):** ε_uncond = 0.2, ε_cond = 0.5, w = 7
ε_guided = 0.2 + 7 × (0.5 − 0.2) = 0.2 + 2.1 = **2.3**: it pushes hard in the "prompt direction".

**Trade-off:** high guidance → closer prompt match but less diversity, oversaturated colours, artifacts. Low guidance → more diverse/creative but may ignore parts of the prompt.

**Negative prompts:** replace the "unconditional" prediction with a prediction for unwanted concepts ("blurry, extra fingers, watermark"), so guidance pushes **away** from them.

**Cost:** CFG needs two predictions per step (2× compute), which is one reason distilled models skip it.

### Prompting image models

- Describe the **subject, setting, style, lighting, composition, camera/lens, colour**: "a portrait of an elderly tea plucker in Nuwara Eliya, morning mist, soft golden light, 85mm photo, shallow depth of field"
- Newer models with T5/LLM text encoders understand full sentences and can render text in images better than older CLIP-only models

**Worked example (varying the guidance scale w):** with ε_uncond = 0.2 and ε_cond = 0.5, the difference is 0.3. Using ε_guided = ε_uncond + w × 0.3:

| w | Calculation | ε_guided | Meaning |
|---|---|---|---|
| 0 | 0.2 + 0 × 0.3 | 0.2 | ignores the prompt |
| 1 | 0.2 + 1 × 0.3 | 0.5 | plain conditional prediction |
| 3 | 0.2 + 3 × 0.3 | 1.1 | prompt followed firmly |
| 7 | 0.2 + 7 × 0.3 | 2.3 | very strong; risk of oversaturation |

**Text picture of the trade-off:**

```
low w  ◄────────────────────────────────────► high w
creative, varied, may ignore    follows the prompt closely,
parts of the prompt             less varied, harsh colours, artifacts
```

**Prompt example (Sri Lankan):** a weak prompt is "a woman". A stronger one is "an elderly tea plucker in Nuwara Eliya, morning mist, soft golden light, 85mm photo". The extra detail gives the text encoder more to condition on.

**Where you'll meet it in real work:** every image app with a "creativity versus prompt adherence" slider is a guidance scale in disguise.

**Common mistakes:**
- Cranking guidance to the maximum, which gives burnt, oversaturated images.
- Using a high guidance value with a distilled Turbo model that was trained to run without CFG.
- Expecting negative prompts to work like commands; they just steer the guidance away.

**Exam angle:** the CFG formula, what w = 0, 1 and large w mean, and the cost (two predictions per step).

> **සිංහලෙන්:** CFG කියන්නේ model එක prompt එකට වඩා පිළිපදින්න තල්ලු කරන උපක්‍රමයක්. Model එක prompt එකත් එක්ක අනුමානයකුත්, prompt එක නැතුව අනුමානයකුත් කරලා, ඒ දෙක අතර වෙනස w වතාවක් ලොකු කරලා එකතු කරනවා. ε_uncond = 0.2, ε_cond = 0.5, w = 7 නම් 0.2 + 7 × 0.3 = 2.3. w = 0 නම් prompt එක නොසලකා හරිනවා, w = 1 නම් සාමාන්‍ය පිළිතුර. w ගොඩක් වැඩි කළොත් පින්තූර වර්ණ අධික වෙනවා, විවිධත්වය අඩු වෙනවා. CFG එකට අනුමාන දෙකක් ඕනේ නිසා වියදම දෙගුණයි.

---

## 11. Image editing

**Why it exists:** most real work starts from something you already have: a photo to restyle, a product to place in a new scene, an old image to fix. Editing techniques reuse the same denoiser with extra controls so you keep what you like and change what you do not.

| Technique | How | Use |
|---|---|---|
| **Image-to-image (img2img)** | Start from a real image with partial noise added (controlled by a **strength** setting), then denoise with a new prompt | Restyle a photo ("make it a watercolour"); keep composition |
| **Inpainting** | Noise and regenerate only a **masked** region | Remove objects, replace a sky, fix hands |
| **Outpainting** | Extend the canvas beyond the original edges | Widen a photo |
| **ControlNet** | An extra network adds **spatial control** from an input map: edges (Canny), human pose skeleton, depth map, segmentation, scribbles | "Generate a person in exactly this pose"; architecture from a sketch |
| **IP-Adapter / reference images** | Condition on an image's style or subject | Consistent characters or styles |
| **LoRA for diffusion** ([file 21](21-training-finetuning-alignment.md#9-lora)) | Small adapters fine-tuned on a few images | Teach a style, a product, a character |
| **DreamBooth / textual inversion** | Fine-tune the model (or a new token embedding) on 3 to 20 images of a subject | "Put *my dog* on the moon" |
| **Instruction editing** | Models that follow edit instructions ("add sunglasses") | Conversational editing; many multimodal LLMs can now edit images directly |
| **Super-resolution / upscaling** | Increase resolution with a diffusion or GAN upscaler | Print-quality images |

**Worked example (img2img strength):** you start a 30-step run from a real photo with strength 0.6. The pipeline adds noise worth 60% of the schedule and then runs about 30 × 0.6 = **18 denoising steps**. Strength 0.2 changes the photo only a little (about 6 steps); strength 1.0 ignores the photo and starts from pure noise.

**Picking the right tool:**

| Job | Technique |
|---|---|
| Turn a daytime photo into a watercolour, keep the layout | img2img, strength about 0.5 to 0.7 |
| Remove a stranger from a wedding photo | inpainting with a mask |
| Widen a portrait photo into a landscape | outpainting |
| Generate a person in exactly this pose | ControlNet (pose map) |
| Make a shop's mascot appear in many scenes | DreamBooth, textual inversion, or a LoRA |
| Print a small photo at poster size | super-resolution |

**Worked example (why LoRA is cheap):** instead of retraining billions of weights, a LoRA trains small adapter matrices, perhaps only a fraction of a percent of the model's size. Fine-tuning a style on 20 images then fits on a single consumer GPU (file 21).

**Where you'll meet it in real work:** wedding and product photo studios, real-estate listings (virtual staging), and social media content tools.

**Common mistakes:**
- Using strength too high and wondering why the original composition vanished.
- Training DreamBooth on too few or inconsistent images.
- Editing someone's photo or voice without consent; see section 17.

**Exam angle:** match the technique to the need (mask for local edits, ControlNet for structure, LoRA or DreamBooth for custom subjects).

> **සිංහලෙන්:** අලුත් පින්තූරයක් මුල ඉඳන් හදනවට වඩා තියෙන පින්තූරයක් වෙනස් කරන එක තමයි ගොඩක් වැඩවලදී ඕනේ වෙන්නේ. img2img වලදී ඇත්ත photo එකට noise ටිකක් දාලා අලුත් prompt එකකින් denoise කරනවා, strength 0.6ක් සහ පියවර 30ක් නම් පියවර 18ක් විතර දුවනවා. Inpainting වලදී mask කරපු කොටස විතරක් නැවත හදනවා, ඒ නිසා විවාහ photo එකකින් අනවශ්‍ය කෙනෙක් අයින් කරන්න පුළුවන්. ControlNet එකෙන් pose එකක් හෝ දළ සටහනක් දීලා ඒ විදිහටම පින්තූරයක් හදන්න පුළුවන්. LoRA එකෙන් model එක සම්පූර්ණයෙන් නැවත train නොකර style එකක් ඉගැන්නුවාම ඒක ලාභයි.

---

## 12. Evaluating image generation

**Why it exists:** there is no single "correct" image to compare against, so ordinary accuracy does not work. We need ways to ask: does it look real, is it varied, does it match the prompt, and do people like it?

| Metric | What it measures | Notes |
|---|---|---|
| **FID** (Fréchet Inception Distance) | How close the **distribution** of generated images is to real images, using features from a pretrained image network (Inception). Lower = better | Measures realism + diversity together; needs thousands of images; doesn't check prompt match |
| **IS** (Inception Score) | Are images confidently classifiable and diverse? | Older; less used |
| **CLIP score** | Cosine similarity between the image's and the prompt's CLIP embeddings (section 13). Higher = better prompt alignment | Measures text-image match |
| **Human evaluation / preference** | People compare images (side-by-side, Elo-style arenas) | The gold standard; also learned preference models (e.g. ImageReward, PickScore) |
| **Prompt-following benchmarks** | Check counts, colours, positions, text rendering (e.g. GenEval) | Specific skills |

For a given application, also check **safety, bias** (who is shown for "a doctor"?), and **copyright** concerns (file 29).

**Worked example (CLIP score by hand):** imagine tiny 2-number embeddings. Image embedding a = (1, 2), prompt embedding b = (2, 1).

- Dot product: 1 × 2 + 2 × 1 = 4.
- Length of a: √(1² + 2²) = √5. Length of b: √(2² + 1²) = √5. Product of lengths = 5.
- Cosine similarity = 4 / 5 = **0.8**.

A different image whose embedding points away from the prompt would score closer to 0. Higher means a better text-image match. (Real embeddings have hundreds of numbers, but the calculation is identical.)

**Which metric answers which question:**

| Question | Metric |
|---|---|
| Do generated images look like real ones, with variety? | FID (lower is better) |
| Does this image match this prompt? | CLIP score (higher is better) |
| Which of two models do people prefer? | Human preference or an Elo-style arena |
| Does it get counts and positions right? | A prompt-following benchmark such as GenEval |

**Where you'll meet it in real work:** a team choosing between two image models for a marketing tool runs both on 500 prompts, computes CLIP scores, and then lets staff vote side-by-side.

**Common mistakes:**
- Treating a good FID as proof that the images match the prompt; FID does not look at the prompt.
- Trusting automatic scores alone. Human judgement is still the gold standard.

**Exam angle:** FID for realism and diversity (lower better), CLIP score for prompt alignment (higher better).

> **සිංහලෙන්:** පින්තූරයක් "හරිද?" කියලා බලන්න එකම නිවැරදි පිළිතුරක් නෑ, ඒ නිසා metrics කීපයක් පාවිච්චි කරනවා. FID එකෙන් හදපු පින්තූර ඇත්ත ඒවාට කොච්චර සමානද කියලා බලනවා, අඩු අගය හොඳයි. CLIP score එකෙන් පින්තූරයයි prompt එකයි කොච්චර ගැළපෙනවාද කියලා බලනවා: දෙකේ embeddings (1,2) සහ (2,1) නම් cosine = 4 ÷ 5 = 0.8. හැබැයි අවසානයේ මිනිස්සු බලලා කැමති එක තෝරන එක තමයි හොඳම ක්‍රමය, ඒ නිසා side-by-side vote එකකුත් පාවිච්චි කරනවා.

---

## 13. CLIP

**Why it exists:** text models and image models used to live in separate worlds. CLIP puts pictures and words into the *same* vector space, so "a photo of a tuk-tuk" and an actual tuk-tuk photo end up near each other. That one trick unlocks image search, zero-shot classification and text-guided image generation.

**CLIP (Contrastive Language-Image Pretraining, OpenAI 2021):** learns a **shared embedding space** for images and text.

### Training

- 400 million (image, caption) pairs from the internet
- An **image encoder** (ViT or ResNet) and a **text encoder** (Transformer)
- **Contrastive loss** (InfoNCE, [file 23](23-embeddings-vector-databases-rag.md#5-how-embedding-models-are-trained)): in a batch of N pairs, make each image's embedding most similar to **its own** caption and dissimilar to the other N − 1 captions (and vice versa)

```
              text₁   text₂   text₃   ...
image₁      [ high    low     low   ]
image₂      [ low     high    low   ]      maximise the diagonal,
image₃      [ low     low     high  ]      minimise the rest
```

### Zero-shot image classification

No training on your classes needed:
1. Write a text prompt per class: "a photo of a cat", "a photo of a dog", "a photo of a tuk-tuk"
2. Embed the image and each prompt
3. Pick the class whose text embedding is most similar (cosine similarity → softmax)

```python
from transformers import CLIPModel, CLIPProcessor
from PIL import Image
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
proc = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
labels = ["a photo of a cat", "a photo of a dog", "a photo of a tuk-tuk"]
inputs = proc(text=labels, images=Image.open("street.jpg"), return_tensors="pt", padding=True)
probs = model(**inputs).logits_per_image.softmax(dim=1)
print(dict(zip(labels, probs[0].tolist())))
```

### Why CLIP matters

- **Text encoder** for text-to-image models (section 9)
- **Image search by text** and **multimodal RAG** ([file 23](23-embeddings-vector-databases-rag.md#17-advanced-rag)): embed images and queries in the same space
- **CLIP score** for evaluation (section 12)
- **Vision encoder** for vision-language models (section 14)
- Content moderation, deduplication, data filtering

Successors: **SigLIP** (sigmoid loss instead of softmax, scales better), OpenCLIP, multilingual CLIP variants.

**Analogy (from the Sinhala course):** a child shown a picture book. The mother points at a picture and says "elephant". After thousands of picture-and-word pairs, the child can name an elephant they have never seen before. CLIP learns the same way, from millions of image-caption pairs.

**Worked example (a contrastive batch):** take a mini-batch of N = 4 image-caption pairs. For image 1 there is 1 right caption and N - 1 = 3 wrong ones. The loss pushes the similarity of the matching pair (the diagonal of the table) up and the 3 wrong pairings down. That is 4 × 4 = 16 similarity scores, 4 of which should be high. Real CLIP batches are much larger, which gives many more wrong captions to learn from.

**Worked example (zero-shot classification):** classify a street photo with the prompts "a photo of a cat", "a photo of a dog", "a photo of a tuk-tuk". Suppose the scaled similarity scores (logits) are 2, 1, 4.

- e² = 7.39, e¹ = 2.72, e⁴ = 54.60. Sum = 64.71.
- Probabilities: cat 7.39 / 64.71 = **0.114**, dog 2.72 / 64.71 = **0.042**, tuk-tuk 54.60 / 64.71 = **0.844**.

The photo is classified as "tuk-tuk" without ever training on a tuk-tuk label. Softmax is from [file 07](07-math-probability-statistics.md).

**Where you'll meet it in real work:** searching a shop's catalogue by typing "red cotton saree"; sorting thousands of photos without labels; checking that an AI-generated image matches its prompt.

**Common mistakes:**
- Using bare class names like "cat" instead of "a photo of a cat". The wording of the prompt changes the accuracy.
- Expecting CLIP to count objects or read small text well.
- Assuming CLIP is a generator. It only scores and embeds; it does not create images.

**Exam angle:** CLIP = contrastive image-text pretraining with two encoders; zero-shot classification = pick the prompt with highest similarity.

> **සිංහලෙන්:** CLIP එක පින්තූර සහ වචන එකම vector space එකකට දානවා. අම්මා ළමයාට picture book එකක පින්තූරයක් පෙන්නලා "අලියා" කියනවා වගේ, CLIP එක පින්තූර-caption යුගල මිලියන ගණනකින් ඉගෙන ගන්නවා. Zero-shot classification වලදී "a photo of a cat/dog/tuk-tuk" කියන prompts එක්ක පින්තූරේ සසඳනවා. Scores 2, 1, 4 නම් softmax එකෙන් tuk-tuk එකට 54.60 ÷ 64.71 = 0.844ක් ලැබෙනවා, ඒ කියන්නේ tuk-tuk label එකකින් train නොකරත් හරියටම අඳුරගත්තා. Shop එකක catalogue එකේ "රතු සාරි" කියලා search කරන්නත් මේක පාවිච්චි කරනවා.

---

## 14. Vision-language models

**Why it exists:** a text-only LLM cannot read a screenshot, a receipt or a chart. A vision-language model gives an LLM "eyes" by turning an image into tokens the LLM can read, without rebuilding the LLM from scratch.

**VLMs** (also called **multimodal LLMs** or **LMMs**) accept images (and text) as input and generate text: describe photos, read documents and charts, answer questions about images, analyse screenshots. Examples: GPT-4o and later, Claude, Gemini, LLaVA, Qwen-VL, Llama vision models.

### The common architecture (e.g. LLaVA)

```
Image ──► Vision encoder (e.g. CLIP/SigLIP ViT) ──► patch features ──► Projector (small MLP)
                                                                           │
                                                                     "visual tokens"
                                                                           ▼
          Text prompt tokens ─────────────────────────────────────► [ LLM (decoder) ] ──► answer text
```

1. A **vision encoder** turns the image into a grid of patch embeddings ([ViT, file 19](19-transformers.md#20-vision-transformer))
2. A **projector** maps them into the LLM's embedding space, so they look like word tokens to the LLM
3. The LLM processes **visual tokens + text tokens** together and generates the answer

**Training (typical):** (1) train only the projector on image-caption pairs, aligning the spaces (encoder and LLM frozen, [transfer learning, file 16](16-cnns-and-computer-vision.md#12-transfer-learning)); (2) **visual instruction tuning** on image-question-answer examples (SFT, [file 21](21-training-finetuning-alignment.md#6-supervised-fine-tuning)), often unfreezing the LLM.

**Alternatives:** cross-attention-based fusion (Flamingo-style) where the LLM attends to image features; **natively multimodal** models trained on mixed image/text (and audio) tokens from the start.

**Image tokens cost money:** an image may become hundreds to thousands of tokens depending on resolution, which affects context use and API cost ([file 20](20-how-llms-work.md#6-context-window-limits-and-cost)).

**Uses:** document understanding (invoices, forms, handwritten notes), chart/table reading, accessibility (describing images for blind users), visual QA, UI understanding for computer-use agents ([file 24](24-ai-agents.md#12-special-kinds-of-agents)), retail (product recognition), agriculture (crop disease from photos).

**Limitations:** counting objects, fine spatial reasoning, small text in low-resolution images, and **visual hallucination** (describing things that aren't there).

**Worked example (how many visual tokens?):** a 224 x 224 image split into 16 x 16 patches gives (224 / 16) × (224 / 16) = 14 × 14 = **196 patches**, so about 196 visual tokens. A short question like "What is the total on this bill?" might be 10 text tokens. The image costs about 20 times more context than the question. Higher-resolution images are split further and cost far more.

**Text picture of the three steps:**

```
photo of a bill ─► ViT encoder ─► 196 patch vectors ─► projector ─► 196 "visual tokens"
                                                                          │
"What is the total?" ─► 10 text tokens ───────────────────────────────────┤
                                                                          ▼
                                                              LLM reads all 206 tokens
                                                                          ▼
                                                              "The total is Rs. 4,350"
```

**Where you'll meet it in real work:** reading receipts and invoices for accounting, understanding charts in reports, describing images for blind users, checking crop photos for disease signs, and letting a computer-use agent read the screen (file 24). From the Sinhala course: reading receipts, understanding charts and finding bugs from screenshots.

**Common mistakes:**
- Trusting a number read from a blurry image without checking it; VLMs can misread digits.
- Ignoring the token cost of images when estimating API bills.
- Assuming the model "sees" the way humans do. It sees patch embeddings, which is why counting and exact positions are weak spots.

**Exam angle:** know the three parts (vision encoder, projector, LLM), the two training stages (align the projector, then visual instruction tuning), and the term visual hallucination.

> **සිංහලෙන්:** Vision-Language Model (VLM) එකක් කියන්නේ පින්තූර බලලා ඒ ගැන text වලින් උත්තර දෙන LLM එකක්. Vision encoder එකෙන් පින්තූරේ patches වලට කඩලා embeddings කරනවා, projector එකෙන් ඒවා LLM එකට තේරෙන "visual tokens" බවට හරවනවා, LLM එක ඒවයි අපේ ප්‍රශ්නයයි එකට කියවනවා. 224 × 224 පින්තූරයක් 16 × 16 කොටස් වලට කැපුවොත් 14 × 14 = 196 tokens හැදෙනවා. Bill එකක මුළු මුදල කියවන්න, chart එකක් තේරුම් ගන්න පුළුවන්. හැබැයි අංක වැරදියට කියවන්නත් පුළුවන්, ඒ නිසා වැදගත් අංක තහවුරු කරගන්න.

---

## 15. Speech and audio

**Why it exists:** voice is the easiest way for many people to use technology, especially where typing in Sinhala or Tamil is awkward. Speech models turn voice into text, text into voice, and even create music.

Audio is stored as a waveform of samples ([file 01](01-big-picture-and-data.md#how-sound-is-stored)), e.g. 16,000 numbers per second. Models usually convert it to a **spectrogram**: a 2-D picture of which frequencies are present over time (often a **mel spectrogram**, using a frequency scale matching human hearing), which can be processed like an image or a sequence.

### ASR (Automatic Speech Recognition): speech → text

**Whisper** (OpenAI, 2022): an **encoder-decoder Transformer** ([file 19](19-transformers.md#14-three-families)): the encoder reads 30-second log-mel spectrogram windows; the decoder generates text tokens autoregressively. Trained on 680,000 hours of multilingual audio, it supports ~100 languages (including Sinhala and Tamil, with varying accuracy), translation to English, and timestamps.

```python
from transformers import pipeline
asr = pipeline("automatic-speech-recognition", model="openai/whisper-small")
print(asr("meeting.wav", return_timestamps=True)["text"])
```

**Metric:** **WER (Word Error Rate)** = (substitutions + deletions + insertions) / number of words in the reference. Lower is better.
**Example:** reference "the cat sat on the mat" (6 words); output "the cat sit on mat" → 1 substitution (sit) + 1 deletion (the) = 2 errors → WER = 2/6 = **33%**.

Related tasks: **speaker diarisation** ("who spoke when"), voice activity detection, keyword spotting.

### TTS (Text-to-Speech): text → speech

Modern pipeline: text → (phonemes) → acoustic model predicts a spectrogram or **audio tokens** → **vocoder** converts to a waveform. Newer models are end-to-end (Transformer or diffusion/flow-based) and can **clone a voice** from a few seconds of audio, control emotion, and speak many languages.

**Audio tokenisers / neural codecs** (e.g. EnCodec, SoundStream): compress audio into discrete tokens, so LLM-style autoregressive models can generate speech and music token by token.

### Speech-to-speech and voice agents

Classic: ASR → LLM → TTS (a cascade; latency adds up). Newer **native speech models** process audio tokens directly for natural, low-latency, interruptible conversation (and preserve tone/emotion).

### Music and sound generation

Text-to-music (e.g. Suno, Udio, MusicGen, Stable Audio) using audio tokens with autoregressive Transformers or latent diffusion.

**Worked example (how much raw audio?):** 16,000 samples per second × 30 seconds = **480,000 numbers** for one Whisper window. A mel spectrogram compresses that into a much smaller 2-D picture (frequency by time) that the encoder can handle like an image.

**Worked example (a second WER):** reference: "I want two kottu" (4 words). Output: "I want too many kottu" (5 words). Alignment: "I" ok, "want" ok, "two" becomes "too" (1 substitution), "many" is extra (1 insertion), "kottu" ok. Errors = 2, WER = 2 / 4 = **50%**. Note WER can go above 100% if the output has many insertions.

**A voice ordering pipeline (from the Sinhala course):** a restaurant customer says "chicken kottu two, plain tea one".

```
voice ─► Whisper (speech to text) ─► LLM (makes JSON order) ─► kitchen display
                                          │
                                          └─► TTS: "Two chicken kottu and one plain tea. Correct?"
```

The LLM could return `{"items": [{"name": "chicken kottu", "qty": 2}, {"name": "plain tea", "qty": 1}]}`. Each stage adds delay, which is why newer native speech models skip the text step.

**Where you'll meet it in real work:** call-centre transcription, meeting minutes, subtitles for videos, voice assistants, audiobooks, accessible reading tools for the visually impaired, and AI music tools.

**Common mistakes:**
- Assuming ASR is equally good in all languages and accents; accuracy for Sinhala and Tamil varies, so always test on your own recordings.
- Cloning a person's voice without their permission.
- Judging ASR only on clean studio audio when real calls are noisy.

**Exam angle:** Whisper = encoder-decoder Transformer for ASR; WER formula; the TTS chain text, acoustic model, vocoder; cascade versus native speech models.

> **සිංහලෙන්:** Speech-to-text (ASR) එකෙන් කතාව text බවට හරවනවා, Whisper කියන්නේ ඒකට හොඳම උදාහරණයක්. Text-to-speech (TTS) එකෙන් text එක කටහඬක් බවට හරවනවා. WER එකෙන් ASR එකේ වැරදි මනිනවා: "I want two kottu" වචන 4ක්, output එකේ "two" → "too" (1) සහ "many" වැඩිපුර (1) නම් වැරදි 2ක්, ඒ නිසා WER = 2 ÷ 4 = 50%. Restaurant voice order එකකදී Whisper → LLM (JSON order) → TTS කියන පියවර එකතු වෙනවා. Sinhala සහ Tamil වලට accuracy වෙනස් නිසා ඔයාගේම recordings වලින් test කරන්න.

---

## 16. Video generation

**Why it exists:** a video is hundreds of images that must agree with each other. If a tuk-tuk's colour or shape flickers from frame to frame, it looks fake. Video models solve this by denoising the whole clip together instead of frame by frame.

Video = a sequence of frames: a 3-D (time × height × width) signal. Generating it requires **temporal consistency** (objects shouldn't flicker or morph between frames) and lots of compute.

**How modern models work (high level):**
- Compress video into a **spatio-temporal latent** with a video VAE
- Split it into **spacetime patches** (tokens covering a small region across several frames)
- A **Diffusion Transformer** (section 8) denoises all patches jointly, conditioned on text (and optionally an image)
- Decode back to frames

Examples: OpenAI Sora, Google Veo, Runway, Kling, open models like Wan and HunyuanVideo.

**Capabilities:** text-to-video, image-to-video (animate a still image), video editing, extending clips.
**Limitations:** physics errors (objects passing through each other), inconsistent details over long clips, high cost, limited length.

**Worked example (why video is so heavy):** a 5-second clip at 24 frames per second has 5 × 24 = 120 frames. If each frame is 1024 x 1024 x 3 = 3,145,728 numbers, the raw clip is 120 × 3,145,728 = **377,487,360** numbers, about 377 million, which is 120 times a single image. That is why models compress video into a spacetime latent first.

**Text picture of spacetime patches:**

```
frame 1  frame 2  frame 3  frame 4          one "spacetime patch" = a small square
┌──┬──┐  ┌──┬──┐  ┌──┬──┐  ┌──┬──┐          region taken across several frames,
│▓▓│  │  │▓▓│  │  │  │▓▓│  │  │  │▓▓│        so the Transformer sees motion as well
└──┴──┘  └──┴──┘  └──┴──┘  └──┴──┘          as appearance
```

**Where you'll meet it in real work:** short adverts, storyboards, animating a product photo (image-to-video), and extending or editing clips. Quality is improving quickly, so read recent model descriptions rather than trusting old limits.

**Common mistakes:**
- Assuming a convincing clip obeys physics. Objects can pass through each other or change details.
- Believing a realistic video proves an event happened (see section 17).

**Exam angle:** know that modern video models use diffusion transformers on spacetime patches in a compressed latent space, and that temporal consistency is the main challenge.

> **සිංහලෙන්:** Video එකක් කියන්නේ frames ගොඩක් එකට තියෙනවා. තත්පර 5ක clip එකක් තත්පරයට frames 24 බැගින් නම් frames 120යි, සෑම frame එකකම 1024 × 1024 × 3 = 3,145,728 අංක තියෙනවා, ඒ නිසා මුළු අංක මිලියන 377ක් විතර, එක පින්තූරයකට වඩා 120 ගුණයක්. ඒ නිසා video model එකක් මුලින් video එක latent space එකකට හකුළනවා, ඊට පස්සේ spacetime patches වලට කඩලා Diffusion Transformer එකකින් frames ඔක්කොම එකවර denoise කරනවා. ඒකෙන් frames අතර flicker නොවී තියෙනවා. තවමත් physics වැරදි සහ දිගු clip වල විස්තර වෙනස් වීම් තියෙනවා.

---

## 17. Applications and risks

**Why it exists:** the same tools that let a small shop make a poster in minutes also let a scammer clone a voice in minutes. A responsible practitioner knows both sides and the defences.

### Applications

- Marketing and design: product images, ads, mock-ups
- Entertainment: concept art, storyboards, music, dubbing and localisation
- Education and accessibility: image descriptions, text-to-speech in local languages, captioning
- Medicine: synthetic training data (with care), report generation from scans (with strict validation)
- E-commerce: virtual try-on, product photo cleanup
- Data augmentation for training other models ([file 16](16-cnns-and-computer-vision.md#11-data-augmentation))

### Risks (covered in depth in [file 29](29-responsible-ai.md))

- **Deepfakes:** fake videos/voices of real people for fraud, scams ("your boss calling to authorise a transfer"), defamation, political misinformation, non-consensual imagery
- **Copyright and consent:** training on artists' work without permission; outputs resembling copyrighted characters or styles
- **Bias:** e.g. "CEO" generating mostly men; under-representation of certain skin tones
- **Misinformation:** realistic fake news photos
- **Defences:** **watermarking** (invisible marks in generated content, e.g. SynthID), **content provenance** standards (**C2PA** content credentials attaching origin metadata), detection classifiers (imperfect), usage policies and safety filters, verifying through trusted channels

**Worked example (a voice-clone scam):** someone receives a call that sounds exactly like their manager, saying "please send Rs. 150,000 to this account now, I'm in a meeting". Checklist:

```
1. Pause. Urgency + money + secrecy is the classic scam pattern.
2. Hang up and call back on the number you already know.
3. Ask something only the real person would know, or use a company-agreed code word.
4. Follow the approval process: no payment on a phone call alone.
5. Report it internally.
```

**How the defences fit together:**

| Defence | Protects against | Limit |
|---|---|---|
| Watermarking (SynthID) | passing off AI media as real | can be removed or may not exist for all tools |
| C2PA content credentials | unknown origin | only works if tools and platforms keep the metadata |
| Detection classifiers | fake media in the wild | imperfect, an arms race |
| Policies and safety filters | misuse of the tool | can be bypassed |
| Human verification through trusted channels | scams and misinformation | needs awareness and habit |

**Where you'll meet it in real work:** banks teaching staff to verify voice instructions, newsrooms checking photos, schools discussing AI images, and companies setting rules for using generated images (copyright, consent, labelling).

**Common mistakes:**
- Assuming a detector's "real" verdict is proof. Detectors make errors both ways.
- Using someone's face or voice, or an artist's style, without permission.
- Believing a single safeguard is enough; use layers.

**Exam angle:** trustworthy-AI questions pair a harm (deepfake, bias, copyright) with a mitigation (watermarking, provenance, filtering, human review, consent).

> **සිංහලෙන්:** Generative AI වලින් පොඩි කඩේකටත් විනාඩි කීපයකින් poster එකක් හදාගන්න පුළුවන්, ඒත් වංචාකාරයෙකුට විනාඩි කීපයකින් කෙනෙකුගේ කටහඬත් copy කරන්න පුළුවන්. "මම meeting එකක, දැන්ම රු. 150,000ක් මේ account එකට දාන්න" කියලා ඔයාගේ manager ගේ කටහඬින් call එකක් ආවොත්, මුලින් call එක කපලා ඔයා දන්න අංකයට ආපහු call කරන්න. ආරක්ෂාවට watermarking (SynthID), C2PA වගේ provenance, detection classifiers භාවිතා කරනවා, ඒත් ඒ එකක්වත් පරිපූර්ණ නෑ. ඒ නිසා ස්ථර කිහිපයක් එකට පාවිච්චි කරන්න, අනුමැතිය නැතුව මුදල් යවන්න එපා.

```quiz
[
  {"q": "What does a generative model learn that a discriminative model does not?", "options": ["The boundary between classes, P(y | x)", "The distribution of the data itself, so it can create new samples", "Only the labels", "How to compress files"], "answer": 1, "why": "Generative models learn P(x) (or P(x | condition)) and can produce new samples. Discriminative models learn P(y | x), which is the tempting answer but only classifies."},
  {"q": "A VAE loss has two parts. What are they?", "options": ["Accuracy and recall", "Reconstruction loss and a KL divergence term to N(0, 1)", "Generator loss and discriminator loss", "Perplexity and BLEU"], "answer": 1, "why": "Reconstruction makes the output match the input; KL keeps the latent codes close to a standard normal so the space is smooth. Generator/discriminator loss belongs to GANs."},
  {"q": "A GAN generator keeps producing only one or two kinds of faces. What is this failure called?", "options": ["Overfitting", "Vanishing gradient", "Mode collapse", "Underfitting"], "answer": 2, "why": "Mode collapse means the generator found a few outputs that fool the discriminator and loses diversity. Overfitting is about memorising training data, a different problem."},
  {"q": "In DDPM training, what does the network predict and how is the loss computed?", "options": ["The final clean image, using accuracy", "The noise added to the image, using MSE between true and predicted noise", "The next word, using cross-entropy", "The text prompt, using F1"], "answer": 1, "why": "The network predicts the noise epsilon; the loss is MSE(epsilon, predicted epsilon). Predicting the next word is how LLMs are trained, not diffusion models."},
  {"q": "With ᾱ_t = 0.64, what is x_t in terms of x0 and noise ε?", "options": ["0.64·x0 + 0.36·ε", "0.8·x0 + 0.6·ε", "0.36·x0 + 0.64·ε", "0.6·x0 + 0.8·ε"], "answer": 1, "why": "x_t = √0.64 · x0 + √(1 − 0.64) · ε = 0.8·x0 + 0.6·ε. Option 0 forgets the square roots, a common slip."},
  {"q": "Why does Stable Diffusion run diffusion in latent space?", "options": ["To make images blurrier on purpose", "A 512x512x3 image becomes a 64x64x4 latent, 48 times fewer numbers, so it is far cheaper", "Because text cannot be used in pixel space", "To avoid using a text encoder"], "answer": 1, "why": "786,432 / 16,384 = 48, so denoising is much cheaper with little quality loss. Text conditioning works in pixel space too; cost is the reason."},
  {"q": "With ε_uncond = 0.4, ε_cond = 0.9 and guidance scale w = 4, what is ε_guided?", "options": ["1.3", "2.4", "3.6", "0.9"], "answer": 1, "why": "0.4 + 4 × (0.9 − 0.4) = 0.4 + 2.0 = 2.4. Choosing 0.9 would be w = 1 (plain conditional)."},
  {"q": "Reference: 'please call me back today' (5 words). ASR output: 'please call back to day'. What is the WER?", "options": ["20%", "40%", "60%", "100%"], "answer": 2, "why": "Errors: 'me' deleted (1), 'today' becomes 'to' (substitution, 1) plus 'day' (insertion, 1) = 3. WER = 3 / 5 = 60%."}
]
```

---

## 18. Check yourself

**Q1.** What's the difference between a discriminative and a generative model?
<details><summary>Answer</summary>Discriminative learns P(y|x) to classify/predict; generative learns the data distribution P(x) (or P(x|condition)) and can create new samples.</details>

**Q2.** Why can't you generate good images by sampling random codes for a plain autoencoder's decoder?
<details><summary>Answer</summary>Its latent space is unorganised with gaps; random codes often fall where the decoder never learned to produce realistic outputs.</details>

**Q3.** What are the two terms in the VAE loss and what does each do?
<details><summary>Answer</summary>Reconstruction loss (output should match input) and KL divergence to N(0, 1) (keeps the latent space smooth and gap-free for sampling).</details>

**Q4.** Describe the GAN game and one failure mode.
<details><summary>Answer</summary>The generator creates fakes to fool the discriminator; the discriminator tries to tell real from fake. Failure: mode collapse (low diversity) or unstable training.</details>

**Q5.** What does a DDPM diffusion model learn to predict during training, and what's the loss?
<details><summary>Answer</summary>The noise ε that was added to a clean image at a random timestep; loss = MSE between true and predicted noise.</details>

**Q6.** With ᾱ_t = 0.64, write x_t in terms of x₀ and ε.
<details><summary>Answer</summary>x_t = √0.64·x₀ + √0.36·ε = **0.8·x₀ + 0.6·ε**.</details>

**Q7.** Why does Stable Diffusion run diffusion in latent space?
<details><summary>Answer</summary>The VAE latent is much smaller than the pixel image (e.g. 48×), making training and generation far cheaper with little quality loss.</details>

**Q8.** CFG: ε_uncond = 1.0, ε_cond = 1.4, w = 5. Compute ε_guided. What happens with very high w?
<details><summary>Answer</summary>1.0 + 5 × 0.4 = **3.0**. Very high w: closer prompt adherence but oversaturated, less diverse, artifact-prone images.</details>

**Q9.** How does CLIP do zero-shot classification?
<details><summary>Answer</summary>Embed the image and a text prompt per class ("a photo of a ...") in the shared space; pick the class with the highest cosine similarity.</details>

**Q10.** What are the three main parts of a LLaVA-style VLM?
<details><summary>Answer</summary>Vision encoder (e.g. CLIP ViT), projector (maps image features to the LLM's embedding space), and the LLM decoder.</details>

**Q11.** Reference "please call me back today" (5 words); ASR output "please call back to day". Compute WER.
<details><summary>Answer</summary>Alignment: please=please, call=call, "me" deleted (1), back=back, "today" → "to" (substitution, 1) + "day" (insertion, 1). Errors = 3 → WER = 3/5 = **60%**.</details>

**Q12.** Name two technical defences against deepfake misuse.
<details><summary>Answer</summary>Watermarking generated content (e.g. SynthID); content provenance metadata (C2PA); detection classifiers (imperfect).</details>

**Q13.** A 512 x 512 RGB image becomes a 64 x 64 x 4 latent. How many times fewer numbers is that?
<details><summary>Answer</summary>786,432 / 16,384 = **48** times fewer.</details>

**Q14.** Using the shortcut formula with x₀ = 1.0, ε = 0.5 and ᾱ_t = 0.36, what is x_t?
<details><summary>Answer</summary>√0.36 × 1.0 + √0.64 × 0.5 = 0.6 + 0.8 × 0.5 = 0.6 + 0.4 = **1.0**.</details>

**Q15.** A friend says "my phone call shows my boss's face and voice asking for a transfer, so it must be real". What is wrong with that reasoning and what should they do?
<details><summary>Answer</summary>Voices and faces can be cloned or faked (deepfakes). They should end the call, verify by calling back on a known number or through an approved process, and not pay on a call alone.</details>

---

## 19. New words in this file

| Word | Meaning |
|---|---|
| Generative / discriminative model | Learns data distribution / learns decision boundary |
| Conditional generation | Generating given a condition (e.g. text prompt) |
| Autoregressive model | Generates piece by piece |
| Autoencoder, encoder, decoder, bottleneck | Network reproducing its input through a narrow code |
| Latent vector / latent space | Compressed code / space of codes |
| Reconstruction error | Difference between input and output |
| Denoising autoencoder | Learns to remove noise |
| VAE | Autoencoder with probabilistic, smooth latent space |
| μ, σ (encoder outputs) | Mean and std of the latent distribution |
| ELBO | Evidence lower bound (VAE objective) |
| Reparameterisation trick | z = μ + σ·ε to allow backprop |
| GAN, generator, discriminator | Adversarial generative model and its two networks |
| Minimax game | One minimises what the other maximises |
| Mode collapse | Generator produces little variety |
| StyleGAN, Pix2Pix, CycleGAN | Famous GANs |
| Normalizing flows | Invertible generative models |
| Diffusion model | Learns to reverse gradual noising |
| Forward / reverse process | Adding noise / removing noise |
| Noise schedule, ᾱ_t, timestep | How much noise at each step |
| DDPM, DDIM, samplers/solvers | Diffusion training/sampling methods |
| Consistency models, distillation (Turbo/Lightning) | Few-step generation |
| Flow matching / rectified flow | Straighter-path alternative to diffusion |
| Denoiser, timestep embedding | Noise-predicting network / encoding of noise level |
| Diffusion Transformer (DiT) | Transformer-based denoiser on patches |
| Latent diffusion, Stable Diffusion | Diffusion in VAE latent space |
| Text encoder (CLIP text, T5) | Converts prompts to embeddings |
| Seed | Starting noise, determines the image |
| Cross-attention conditioning | Image features attending to text |
| Classifier-free guidance (CFG), guidance scale w | Steering toward the prompt |
| Negative prompt | Concepts to steer away from |
| img2img, strength, inpainting, outpainting | Image editing techniques |
| ControlNet | Spatial control (pose, edges, depth) |
| IP-Adapter, DreamBooth, textual inversion | Subject/style customisation |
| Super-resolution / upscaling | Increasing resolution |
| FID, IS, CLIP score | Image generation metrics |
| Preference models (ImageReward, PickScore), GenEval | Learned/benchmark evaluation |
| CLIP, shared embedding space, SigLIP | Image-text contrastive model / successor |
| Zero-shot classification | Classifying without task-specific training |
| VLM / multimodal LLM / LMM | Model taking images + text |
| Vision encoder, projector, visual tokens | VLM components |
| Visual instruction tuning | SFT on image Q&A |
| Natively multimodal | Trained on mixed modalities from the start |
| Visual hallucination | Describing things not in the image |
| Spectrogram, mel spectrogram | Frequency-over-time picture of audio |
| ASR, Whisper, WER | Speech-to-text / model / error metric |
| Speaker diarisation | Who spoke when |
| TTS, phonemes, vocoder, voice cloning | Text-to-speech and its parts |
| Neural audio codec / audio tokens (EnCodec) | Discrete audio representation |
| Speech-to-speech / native speech models | Direct audio conversation models |
| Video VAE, spacetime patches, temporal consistency | Video generation concepts |
| Deepfake | Realistic fake media of real people |
| Watermarking (SynthID), C2PA, content provenance | Marking and tracing AI content |
| Generative trilemma | Hard to get quality, diversity and speed all at once |
| Contrastive batch | A set of pairs where each item must match only its own partner |
| Visual tokens (count) | Number of patches an image becomes (e.g. 14 x 14 = 196) |
| Strength (img2img) | How much noise is added to the start image, so how much it changes |
| Deepfake verification | Confirming a request through a trusted channel before acting |

**🎉 You've finished Part F: Generative AI Applications!**

**Mini project for Part F:** build a **bilingual document assistant**: upload PDFs (some scanned) → parse + OCR → chunk with contextual headers → hybrid retrieval + reranking → an LLM answers with citations, saying "I don't know" when unsupported → add one tool (e.g. a calculator or a SQL lookup) using tool calling → evaluate with 50 questions (Recall@5, faithfulness, abstention). Bonus: accept a voice question via Whisper and image questions via a VLM.

**Next:** [26-evaluating-llms.md](26-evaluating-llms.md)
