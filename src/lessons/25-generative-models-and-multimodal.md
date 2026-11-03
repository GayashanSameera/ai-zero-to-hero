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

From [file 01](01-big-picture-and-data.md#generative-ai-genai) and [file 11](11-ml-fundamentals.md#2-types-of-machine-learning):

| | **Discriminative** | **Generative** |
|---|---|---|
| Learns | P(y \| x): the boundary between classes | P(x) (or P(x \| condition)): what the data itself looks like |
| Can | Classify, predict | **Create new samples** that look like the training data |
| Examples | Logistic regression, classifiers, BERT classifiers | Naive Bayes, GMMs, LLMs, VAEs, GANs, diffusion models |

**Analogy:** a discriminative art critic can tell a Van Gogh from a Monet. A generative artist can **paint** a new picture in Van Gogh's style.

**Conditional generation:** generate x given some condition, e.g. an image **given a text prompt**, or speech **given text**.

---

## 2. Families of generative models

| Family | Idea | Strengths | Weaknesses | Examples |
|---|---|---|---|---|
| **Autoregressive** | Generate one piece at a time, each conditioned on previous pieces ([file 20](20-how-llms-work.md#8-the-generation-loop)) | Exact likelihood; excellent for text | Slow sequential generation | GPT, Claude, Llama; also some image/audio models |
| **VAE** | Encode into a probabilistic latent space, decode samples | Smooth latent space; fast | Blurry samples | Used as the compressor inside Stable Diffusion |
| **GAN** | Generator vs discriminator game | Sharp images; fast sampling | Unstable training; mode collapse | StyleGAN |
| **Normalizing flows** | Invertible transformations from simple noise to data | Exact likelihood | Architecture constraints | Glow |
| **Diffusion / flow matching** | Learn to gradually remove noise | **Best quality and diversity** for images/video/audio | Many sampling steps (slower) | Stable Diffusion, DALL·E 3, Imagen, Midjourney, Flux, Sora, Veo |

---

## 3. Autoencoders

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

---

## 4. VAEs

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

---

## 5. GANs

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

---

## 6. Diffusion: the core idea

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

---

## 7. Training and sampling diffusion

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

---

## 8. The denoiser network

The noise-prediction network takes a noisy image + the timestep (+ text condition, section 10) and outputs a noise estimate of the **same size** as the image.

### U-Net

The classic choice: the encoder-decoder with skip connections from [file 16](16-cnns-and-computer-vision.md#15-segmentation), with added:
- **Timestep embedding:** tells the network how noisy the input is
- **Self-attention layers** at lower resolutions
- **Cross-attention layers** ([file 19](19-transformers.md#9-multi-head-attention)) for the text prompt

Used in Stable Diffusion 1.x/2.x/SDXL.

### Diffusion Transformer (DiT)

Replace the U-Net with a **Transformer** operating on image **patches** (like ViT, [file 19](19-transformers.md#20-vision-transformer)). Scales better with more compute. Used in Stable Diffusion 3, Flux, Sora and most new image/video models.

---

## 9. Latent diffusion

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

---

## 10. Text conditioning and CFG

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

---

## 11. Image editing

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

---

## 12. Evaluating image generation

| Metric | What it measures | Notes |
|---|---|---|
| **FID** (Fréchet Inception Distance) | How close the **distribution** of generated images is to real images, using features from a pretrained image network (Inception). Lower = better | Measures realism + diversity together; needs thousands of images; doesn't check prompt match |
| **IS** (Inception Score) | Are images confidently classifiable and diverse? | Older; less used |
| **CLIP score** | Cosine similarity between the image's and the prompt's CLIP embeddings (section 13). Higher = better prompt alignment | Measures text-image match |
| **Human evaluation / preference** | People compare images (side-by-side, Elo-style arenas) | The gold standard; also learned preference models (e.g. ImageReward, PickScore) |
| **Prompt-following benchmarks** | Check counts, colours, positions, text rendering (e.g. GenEval) | Specific skills |

For a given application, also check **safety, bias** (who is shown for "a doctor"?), and **copyright** concerns (file 29).

---

## 13. CLIP

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

---

## 14. Vision-language models

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

---

## 15. Speech and audio

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

---

## 16. Video generation

Video = a sequence of frames: a 3-D (time × height × width) signal. Generating it requires **temporal consistency** (objects shouldn't flicker or morph between frames) and lots of compute.

**How modern models work (high level):**
- Compress video into a **spatio-temporal latent** with a video VAE
- Split it into **spacetime patches** (tokens covering a small region across several frames)
- A **Diffusion Transformer** (section 8) denoises all patches jointly, conditioned on text (and optionally an image)
- Decode back to frames

Examples: OpenAI Sora, Google Veo, Runway, Kling, open models like Wan and HunyuanVideo.

**Capabilities:** text-to-video, image-to-video (animate a still image), video editing, extending clips.
**Limitations:** physics errors (objects passing through each other), inconsistent details over long clips, high cost, limited length.

---

## 17. Applications and risks

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

**🎉 You've finished Part F: Generative AI Applications!**

**Mini project for Part F:** build a **bilingual document assistant**: upload PDFs (some scanned) → parse + OCR → chunk with contextual headers → hybrid retrieval + reranking → an LLM answers with citations, saying "I don't know" when unsupported → add one tool (e.g. a calculator or a SQL lookup) using tool calling → evaluate with 50 questions (Recall@5, faithfulness, abstention). Bonus: accept a voice question via Whisper and image questions via a VLM.

**Next:** [26-evaluating-llms.md](26-evaluating-llms.md)
