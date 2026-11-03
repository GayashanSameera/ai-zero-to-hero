# 16: Convolutional Neural Networks and Computer Vision

> **Before you start:** [01](01-big-picture-and-data.md#how-images-are-stored) (pixels, RGB), [05](05-math-linear-algebra.md) (dot product, tensors, shapes), [13](13-evaluation-metrics-and-tuning.md) (precision, recall), [15](15-neural-networks.md) (layers, ReLU, BatchNorm, residual connections, dropout, PyTorch training loop, parameter counting).
>
> **After this file you can:** explain convolution, filters, stride, padding and pooling; compute output shapes and parameter counts; describe the famous CNN architectures; use **transfer learning** to build an image classifier with little data; and understand object detection and segmentation.

---

## Table of contents

1. [Why not use an MLP for images?](#1-why-not-an-mlp-for-images)
2. [Images as tensors](#2-images-as-tensors)
3. [The convolution operation](#3-the-convolution-operation)
4. [Filters learn features](#4-filters-learn-features)
5. [Stride, padding, and output size](#5-stride-padding-and-output-size)
6. [Channels and parameter counting](#6-channels-and-parameter-counting)
7. [Pooling](#7-pooling)
8. [Receptive field and the feature hierarchy](#8-receptive-field-and-feature-hierarchy)
9. [Putting it together: a CNN in PyTorch](#9-a-cnn-in-pytorch)
10. [Famous architectures](#10-famous-architectures)
11. [Data augmentation](#11-data-augmentation)
12. [Transfer learning](#12-transfer-learning)
13. [Computer vision tasks](#13-computer-vision-tasks)
14. [Object detection](#14-object-detection)
15. [Segmentation](#15-segmentation)
16. [Other vision tasks and where vision is heading](#16-other-vision-tasks)
17. [Check yourself](#17-check-yourself)
18. [New words in this file](#18-new-words-in-this-file)

---

## 1. Why not an MLP for images?

In [file 15](15-neural-networks.md#19-a-complete-training-loop) we flattened 28×28 MNIST images into 784 numbers and used an MLP. It worked (~98%), but it has big problems for real photos:

1. **Too many parameters.** A 224×224 colour image has 224 × 224 × 3 = 150,528 numbers. One dense layer to 1,000 neurons = **150 million weights**. Huge, slow, overfits.
2. **Ignores spatial structure.** Flattening throws away the fact that neighbouring pixels are related.
3. **No translation invariance.** A cat in the top-left corner and a cat in the bottom-right use completely different weights. The MLP must learn "cat" separately for every position.

**CNNs (Convolutional Neural Networks)** fix all three with two ideas:
- **Local connectivity:** each neuron looks only at a small patch of the image
- **Weight sharing:** the same small set of weights (a **filter**) is used at every position

---

## 2. Images as tensors

From [file 01](01-big-picture-and-data.md#how-images-are-stored) and [file 05](05-math-linear-algebra.md#13-tensors):
- Grayscale image: matrix (height × width), values 0 to 255
- Colour image: 3 **channels** (R, G, B) → (3 × H × W) in PyTorch (**channels first**)
- A batch: (batch × channels × height × width), e.g. **(32, 3, 224, 224)**

Before training, pixel values are usually scaled to [0, 1] (÷255) and then standardised per channel using the dataset's mean and std ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)).

---

## 3. The convolution operation

**Idea:** slide a small grid of weights (a **filter** or **kernel**, e.g. 3×3) across the image. At each position, multiply the filter by the patch underneath **element by element** and add everything up (a dot product, [file 05](05-math-linear-algebra.md#6-the-dot-product)). The results form a new grid called a **feature map** (or activation map).

**Analogy:** reading a page with a small magnifying glass that only highlights one thing (say, vertical lines). You slide it over every part of the page and write down how strongly each spot matched.

### Worked example

Input (5×5):
```
 1  2  0  1  3
 0  1  3  1  0
 2  1  0  2  1
 1  0  2  1  0
 0  2  1  0  1
```

Filter (3×3):
```
 1  0 -1
 1  0 -1
 1  0 -1
```
(This filter detects **vertical edges**: bright on the left, dark on the right.)

**Top-left position** (rows 1-3, columns 1-3):
```
patch:          × filter:        products:
 1  2  0        1  0 -1          1  0  0
 0  1  3        1  0 -1          0  0 -3
 2  1  0        1  0 -1          2  0  0
```
Sum = 1 + 0 + 0 + 0 + 0 − 3 + 2 + 0 + 0 = **0**

**Slide one step right** (columns 2-4):
```
patch:  2 0 1 / 1 3 1 / 1 0 2
products: 2·1 + 0 + 1·(−1) + 1·1 + 0 + 1·(−1) + 1·1 + 0 + 2·(−1) = 2 − 1 + 1 − 1 + 1 − 2 = 0
```

**Next position** (columns 3-5):
```
patch: 0 1 3 / 3 1 0 / 0 2 1
products: 0 − 3 + 3 − 0 + 0 − 1 = −1
```

Continue for all 3 × 3 = 9 positions → a **3×3 output feature map**. A 5×5 input with a 3×3 filter (no padding, stride 1) gives a 3×3 output.

Each output value is followed by a bias and an activation (ReLU), just like a neuron ([file 15](15-neural-networks.md#1-from-brain-cells-to-artificial-neurons)).

(Technically this operation is called **cross-correlation**; true mathematical convolution flips the filter first. Deep learning libraries use cross-correlation but still call it convolution.)

---

## 4. Filters learn features

Classic image processing used **hand-designed** filters:

| Filter | Detects |
|---|---|
| [[1,0,−1],[1,0,−1],[1,0,−1]] | vertical edges |
| [[1,1,1],[0,0,0],[−1,−1,−1]] | horizontal edges |
| all 1/9 | blur (average) |

**In a CNN, the filter values are weights learned by backpropagation.** The network discovers which patterns are useful. Visualising trained networks shows:
- **Early layers:** edges, colours, simple textures
- **Middle layers:** corners, circles, stripes, textures like fur
- **Deep layers:** object parts (eyes, wheels, petals) and whole objects

A conv layer has **many filters** (e.g. 64), each producing its own feature map. So 64 filters → 64 output channels.

---

## 5. Stride, padding, and output size

### Stride

How many pixels the filter moves each step. Stride 1 = every position; **stride 2** = skip every other position → output roughly **half** the size. Used to downsample.

### Padding

Without padding, the output shrinks (5×5 → 3×3) and border pixels are used less. **Padding** adds a border of zeros around the input.

- **"Valid"** padding = no padding (output shrinks)
- **"Same"** padding = enough padding to keep the output the same size (for stride 1, a 3×3 filter needs padding 1; a 5×5 needs padding 2)

```
Padding = 1 (zeros around the edge):
 0 0 0 0 0 0 0
 0 1 2 0 1 3 0
 0 0 1 3 1 0 0
 ...
```

### The output size formula (memorise this)

```
output = floor( (input − kernel + 2 × padding) / stride ) + 1
```

**Examples:**
- input 5, kernel 3, padding 0, stride 1: (5 − 3 + 0)/1 + 1 = **3** ✓ (our example)
- input 32, kernel 3, padding 1, stride 1: (32 − 3 + 2)/1 + 1 = **32** ("same")
- input 224, kernel 7, padding 3, stride 2: floor((224 − 7 + 6)/2) + 1 = floor(111.5) + 1 = **112**
- input 28, kernel 5, padding 0, stride 1: **24**

---

## 6. Channels and parameter counting

For colour input, a filter covers **all input channels**: a "3×3" filter on an RGB image is really **3×3×3**. Its dot product sums over all three colours.

```
Input: (C_in = 3) × H × W
One filter: C_in × k × k = 3 × 3 × 3 = 27 weights + 1 bias
C_out filters → output: C_out × H' × W'
```

**Parameters of a conv layer:**
```
(k × k × C_in + 1) × C_out
```

**Example:** first layer, 3×3 kernels, RGB input, 64 filters:
(3 × 3 × 3 + 1) × 64 = 28 × 64 = **1,792 parameters**

Compare to a dense layer from a 224×224×3 image to 64 neurons: 150,528 × 64 ≈ **9.6 million**. Weight sharing makes CNNs ~5,000× more efficient here.

**Example:** 3×3 conv from 64 channels to 128 channels: (3×3×64 + 1) × 128 = 577 × 128 = **73,856**.

```python
import torch.nn as nn
conv = nn.Conv2d(in_channels=3, out_channels=64, kernel_size=3, stride=1, padding=1)
sum(p.numel() for p in conv.parameters())    # 1792
```

### 1×1 convolutions

A 1×1 filter looks at one pixel position but across **all channels**: it mixes channels without looking at neighbours. Used to cheaply **change the number of channels** (e.g. 256 → 64) before an expensive 3×3 conv (a "bottleneck"). Used heavily in Inception and ResNet.

---

## 7. Pooling

**Pooling** shrinks feature maps, reducing computation and making the network more tolerant of small shifts. It has **no learnable parameters**.

**Max pooling (2×2, stride 2):** take the **maximum** of each 2×2 block.

```
Input (4×4):            Max pool 2×2 →    Output (2×2):
 1  3 | 2  1
 4  2 | 0  1                               4  2
 ─────┼─────                               6  8
 5  6 | 1  8
 2  1 | 7  3
```

- top-left block {1,3,4,2} → 4; top-right {2,1,0,1} → 2; bottom-left {5,6,2,1} → 6; bottom-right {1,8,7,3} → 8

**Average pooling:** take the mean instead.

**Global average pooling (GAP):** average each entire feature map down to **one number**. A (512 × 7 × 7) tensor becomes a 512-long vector. Used at the end of modern CNNs instead of big dense layers, which saves a huge number of parameters.

Modern networks often use **stride-2 convolutions** instead of pooling to downsample.

---

## 8. Receptive field and feature hierarchy

The **receptive field** of a neuron = the region of the original image that can affect it.

- After one 3×3 conv: each output sees a 3×3 patch
- After two 3×3 convs: 5×5
- After three: 7×7
- Pooling/stride multiplies the growth

So deeper neurons "see" larger regions, which is why they can recognise bigger structures. **Two stacked 3×3 convs see the same 5×5 region as one 5×5 conv but with fewer parameters** (2 × 9 = 18 vs 25 per channel pair) and an extra non-linearity. This insight shaped VGG.

```
Layer 1: edges ──► Layer 2: textures/corners ──► Layer 3: parts ──► Layer 4+: objects
 (small receptive field)                                     (large receptive field)
```

---

## 9. A CNN in PyTorch

**The classic pattern:** [Conv → BatchNorm → ReLU] × N → Pool → repeat (more channels, smaller size) → global pool → dense classifier.

```
Input (3×32×32)
 → Conv 3→32, BN, ReLU  → (32×32×32)
 → MaxPool              → (32×16×16)
 → Conv 32→64, BN, ReLU → (64×16×16)
 → MaxPool              → (64×8×8)
 → Conv 64→128, BN, ReLU→ (128×8×8)
 → Global avg pool      → (128)
 → Linear 128→10        → (10 logits)
```

Spatial size shrinks; channels grow: "fewer, richer features".

```python
import torch, torch.nn as nn

def block(c_in, c_out):
    return nn.Sequential(nn.Conv2d(c_in, c_out, 3, padding=1),
                         nn.BatchNorm2d(c_out), nn.ReLU())

class SmallCNN(nn.Module):
    def __init__(self, n_classes=10):
        super().__init__()
        self.features = nn.Sequential(
            block(3, 32), nn.MaxPool2d(2),
            block(32, 64), nn.MaxPool2d(2),
            block(64, 128),
            nn.AdaptiveAvgPool2d(1),           # global average pooling → (B,128,1,1)
        )
        self.classifier = nn.Sequential(nn.Flatten(), nn.Dropout(0.3), nn.Linear(128, n_classes))

    def forward(self, x):
        return self.classifier(self.features(x))

model = SmallCNN()
x = torch.randn(8, 3, 32, 32)          # batch of 8 CIFAR-size images
print(model(x).shape)                  # torch.Size([8, 10])
```

Train it exactly like the MNIST loop in [file 15](15-neural-networks.md#19-a-complete-training-loop), e.g. on **CIFAR-10** (60,000 32×32 colour images in 10 classes: plane, car, bird, cat...).

---

## 10. Famous architectures

| Year | Network | Key idea | Notes |
|---|---|---|---|
| 1998 | **LeNet-5** | First practical CNN | Read handwritten cheque digits |
| 2012 | **AlexNet** | Deep CNN + **ReLU** + **dropout** + **GPUs** | Won ImageNet by a huge margin; started the deep learning boom |
| 2014 | **VGG** | Only stacked **3×3 convs**, very uniform | Simple, deep (16 to 19 layers), 138M params |
| 2014 | **GoogLeNet / Inception** | **Inception module**: parallel 1×1, 3×3, 5×5 convs + **1×1 bottlenecks** | Efficient |
| 2015 | **ResNet** | **Residual connections** ([file 15](15-neural-networks.md#15-residual-connections)) | Trained 152 layers; ResNet-50 still a standard baseline |
| 2017 | **MobileNet** | **Depthwise separable convolutions** | Fast and small: phones, edge devices |
| 2019 | **EfficientNet** | Scale depth, width and resolution together (**compound scaling**) | Great accuracy per compute |
| 2020 | **Vision Transformer (ViT)** | Treat image **patches** as tokens; use a transformer | Covered in [file 19](19-transformers.md) |
| 2022 | **ConvNeXt** | Modernised CNN with transformer-era tricks | Matches ViTs |

**ImageNet:** a dataset of ~1.2 million training images across **1,000 classes**. The annual ImageNet competition (ILSVRC) drove progress from 2010 to 2017. Models **pretrained** on ImageNet are the starting point for transfer learning (section 12).

**Depthwise separable convolution** (MobileNet): split a normal conv into (1) a 3×3 filter **per channel** separately (depthwise) and (2) a 1×1 conv to mix channels (pointwise). It needs ~8 to 9× fewer computations.

---

## 11. Data augmentation

**Idea:** create new training examples by applying random, label-preserving changes to images. A flipped cat is still a cat. It's a powerful regulariser ([file 15](15-neural-networks.md#13-regularisation-in-deep-learning)) that teaches the model **invariances**.

| Augmentation | Example |
|---|---|
| Horizontal flip | mirror image (not for text or digits like 6/9!) |
| Random crop + resize | zoom into parts |
| Rotation | ±15° |
| Colour jitter | brightness, contrast, saturation |
| Random erasing / Cutout | blank out a random rectangle |
| **Mixup** | blend two images and their labels (e.g. 70% cat + 30% dog) |
| **CutMix** | paste a patch of one image onto another, labels mixed by area |
| RandAugment / AutoAugment | automatically chosen combinations |

```python
from torchvision import transforms
train_tfm = transforms.Compose([
    transforms.RandomResizedCrop(224, scale=(0.7, 1.0)),
    transforms.RandomHorizontalFlip(),
    transforms.ColorJitter(0.2, 0.2, 0.2),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),   # ImageNet mean/std
])
val_tfm = transforms.Compose([      # NO random augmentation for validation/test
    transforms.Resize(256), transforms.CenterCrop(224),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])
```

⚠️ Augment **training data only**. Make sure the augmentation makes sense for your domain (e.g. no vertical flips for street scenes; careful with colour changes for medical images).

**Test-time augmentation (TTA):** predict on several augmented versions of a test image and average the predictions. A small accuracy boost.

---

## 12. Transfer learning

**Idea:** start from a model **already trained** on a big dataset (like ImageNet) and adapt it to **your** task. Its early layers already know generic features (edges, textures, shapes) that are useful everywhere.

**Analogy:** someone who already plays guitar learns the ukulele far faster than a total beginner. They transfer their skills.

**Why it's huge:** you can get excellent results with **hundreds** of images instead of millions, in minutes instead of days. **This is the same idea behind fine-tuning LLMs** (file 21): pretrain once on huge data, adapt cheaply.

### Two strategies

**1. Feature extraction (freeze the backbone)**
- Keep the pretrained layers **frozen** (no weight updates)
- Replace the final classification layer (the **head**) with a new one for your classes
- Train only the new head
- Best when: very little data; your images are similar to ImageNet

**2. Fine-tuning**
- Start as above, then **unfreeze** some or all layers and train them too, with a **small learning rate** (e.g. 10× smaller) so you don't destroy the pretrained knowledge
- Best when: more data, or your images differ from ImageNet (X-rays, satellite images)
- Often: train the head first for a few epochs, then unfreeze and fine-tune everything (**gradual unfreezing**)

```
Pretrained ResNet-50
┌────────────────────────────────┬──────────────┐
│ Backbone (conv layers)          │ Head          │
│ generic features: edges→objects │ 1000 ImageNet │
│ ❄ frozen (feature extraction)   │ classes       │
│ 🔥 or fine-tuned with small LR   │ → REPLACE     │
└────────────────────────────────┴──────────────┘
                                   with: Linear(2048, your_classes)
```

### Code

```python
import torch, torch.nn as nn
from torchvision import models

weights = models.ResNet50_Weights.DEFAULT
model = models.resnet50(weights=weights)           # download pretrained weights

for p in model.parameters():                        # 1. freeze everything
    p.requires_grad = False

model.fc = nn.Linear(model.fc.in_features, 5)       # 2. new head for 5 classes (trainable)

opt = torch.optim.AdamW(model.fc.parameters(), lr=1e-3)   # train only the head first

# Later, to fine-tune everything with a smaller LR:
for p in model.parameters():
    p.requires_grad = True
opt = torch.optim.AdamW([
    {"params": model.fc.parameters(), "lr": 1e-3},
    {"params": [p for n, p in model.named_parameters() if not n.startswith("fc")], "lr": 1e-5},
])
```

**Use the same preprocessing** (resize, normalisation with ImageNet mean/std) the pretrained model was trained with. `weights.transforms()` gives it to you.

**Model hubs:** `torchvision.models`, **timm** (PyTorch Image Models: hundreds of pretrained vision models), **Hugging Face Hub**.

```python
import timm
model = timm.create_model("efficientnet_b0", pretrained=True, num_classes=5)
```

**Real-world example:** a farmer's app that detects 5 tomato-leaf diseases from phone photos, trained on 2,000 images by fine-tuning EfficientNet, can reach ~95% accuracy in under an hour on a free Colab GPU.

---

## 13. Computer vision tasks

```
┌──────────────┬────────────────┬──────────────────┬───────────────────┐
│Classification│ Detection       │ Semantic seg.     │ Instance seg.      │
│              │                 │                   │                    │
│  "cat"       │ ┌───┐  ┌──┐    │ every pixel:       │ every pixel +      │
│              │ │cat│  │dog│   │ cat / dog / bg     │ which individual   │
│              │ └───┘  └──┘    │ (both dogs same    │ (dog #1 vs dog #2) │
│              │ boxes + labels  │  colour)           │                    │
└──────────────┴────────────────┴──────────────────┴───────────────────┘
```

| Task | Output |
|---|---|
| **Image classification** | one label per image ("cat") |
| **Multi-label classification** | several labels ("beach", "people", "sunset") |
| **Object localisation** | one label + one bounding box |
| **Object detection** | many boxes, each with a label and confidence |
| **Semantic segmentation** | a class for every pixel |
| **Instance segmentation** | every pixel + which object instance |
| **Panoptic segmentation** | semantic + instance combined |
| **Keypoint / pose estimation** | locations of body joints |
| **OCR** | text read from images |
| **Image generation** | new images (file 25) |

---

## 14. Object detection

**Goal:** find **all** objects, each with a **bounding box** (x, y, width, height), a **class**, and a **confidence score**.

### IoU (Intersection over Union)

How well does a predicted box match the true box?

```
IoU = area of overlap / area of union
```

```
┌──────────┐
│ true  ┌──┼──────┐
│       │██│      │     ██ = overlap (intersection)
└───────┼──┘      │     union = total area covered by either box
        │predicted│
        └─────────┘
```

**Worked example:** true box area = 100, predicted box area = 100, overlap = 50.
Union = 100 + 100 − 50 = 150 → IoU = 50/150 = **0.33**.

A detection usually counts as correct if IoU ≥ **0.5**.

### Non-Maximum Suppression (NMS)

Detectors often predict many overlapping boxes for the same object. **NMS** keeps the box with the highest confidence and removes other boxes that overlap it with IoU above a threshold (e.g. 0.5). Repeat for the remaining boxes.

### Families of detectors

| Type | Examples | Idea | Trade-off |
|---|---|---|---|
| **Two-stage** | R-CNN → Fast R-CNN → **Faster R-CNN** | 1) propose candidate regions, 2) classify and refine each | Accurate, slower |
| **One-stage** | **YOLO** (You Only Look Once), SSD, RetinaNet | Predict boxes and classes in a single pass over a grid | **Fast, real-time** |
| **Transformer-based** | **DETR**, RT-DETR | Transformer predicts a set of boxes directly; no NMS needed | Elegant; modern |

**Anchor boxes:** many detectors start from predefined box shapes at each location and predict adjustments to them. Newer models are often **anchor-free**.

**RetinaNet's focal loss:** down-weights the many easy background examples so the model focuses on hard ones (a fix for extreme class imbalance, [file 13](13-evaluation-metrics-and-tuning.md#14-imbalanced-data)).

### Metric: mAP (mean Average Precision)

For each class, compute **average precision** (area under the precision-recall curve, [file 13](13-evaluation-metrics-and-tuning.md#8-precision-recall-curve-and-pr-auc)) at a given IoU threshold, then average over classes.
- **mAP@0.5:** IoU threshold 0.5
- **mAP@0.5:0.95** (COCO standard): average over IoU thresholds 0.5, 0.55, ..., 0.95 (stricter)

**COCO:** the standard detection/segmentation dataset (80 object classes, ~330k images).

```python
from ultralytics import YOLO          # pip install ultralytics
model = YOLO("yolov8n.pt")            # small pretrained detector
results = model("street.jpg")         # detect objects
results[0].show()
# fine-tune on your own labelled data:
# model.train(data="my_dataset.yaml", epochs=50, imgsz=640)
```

**Labelling for detection:** you draw boxes on images with tools like **Label Studio**, **CVAT** or **Roboflow**. It's much more expensive than classification labels.

---

## 15. Segmentation

**Semantic segmentation** classifies **every pixel**. Output: a mask with the same height and width as the image.

### U-Net (encoder-decoder with skip connections)

```
Input image                                              Output mask
  │                                                          ▲
  ▼ Encoder (downsample: conv + pool)      Decoder (upsample) │
 [64]──────────────── skip ───────────────────►[64]
   ▼                                              ▲
  [128]────────────── skip ──────────────►[128]
     ▼                                        ▲
    [256]─────────── skip ──────────►[256]
        ▼                               ▲
         └────────► [512] bottleneck ───┘
```

- **Encoder:** shrinks the image, capturing **what** is in it (context)
- **Decoder:** grows it back to full size (**upsampling**, using **transposed convolutions** or interpolation), recovering **where**
- **Skip connections:** pass fine details from the encoder directly to the decoder at the same resolution, so edges stay sharp

Originally designed for medical images (2015). The same U-Net shape is the core of **diffusion image generators** like Stable Diffusion ([file 25](25-generative-models-and-multimodal.md)).

**Instance segmentation:** **Mask R-CNN** (Faster R-CNN + a mask for each detected box).

**Segment Anything Model (SAM)** (Meta): a **foundation model** that segments any object from a click, box or text prompt, with no training on your specific classes.

**Metrics:** **IoU per class** and **mean IoU (mIoU)**; **Dice coefficient** (2 × overlap / (sum of both areas), common in medical imaging).

**Losses:** per-pixel cross-entropy; **Dice loss** (handles small objects/imbalance).

---

## 16. Other vision tasks

- **Face recognition:** a CNN maps each face to an embedding vector ([file 15](15-neural-networks.md#16-embedding-layers)); two photos are the same person if their embeddings are close. Trained with **contrastive / triplet loss**: pull same-person embeddings together, push different people apart. This "learn embeddings by comparing pairs" idea (**Siamese networks**) returns in CLIP (file 25) and embedding models for RAG (file 23).
- **OCR (Optical Character Recognition):** detect text regions, then recognise characters (e.g. Tesseract, PaddleOCR, TrOCR). Crucial for processing PDFs/scans in RAG systems (file 23).
- **Pose estimation:** find body keypoints (OpenPose, MediaPipe).
- **Image captioning / visual question answering:** combine vision and language (file 25).
- **Video understanding:** action recognition, tracking objects across frames.
- **3-D vision:** depth estimation, point clouds (self-driving cars use LiDAR), NeRF / Gaussian splatting for 3-D scene reconstruction.

### Where vision is heading

- **Vision Transformers (ViT)** and hybrids now rival or beat CNNs at large scale (file 19).
- **Self-supervised pretraining** (learning from unlabelled images, e.g. DINO, MAE).
- **Vision-language models** (CLIP, GPT-4o, Gemini, Claude) understand images through language and can classify with **zero examples** ("zero-shot") from a text description (file 25).
- CNNs remain excellent for efficient, real-time and edge applications.

---

## 17. Check yourself

**Q1.** Compute the output size: input 64×64, kernel 5, padding 2, stride 1. And with stride 2?
<details><summary>Answer</summary>Stride 1: (64 − 5 + 4)/1 + 1 = **64**. Stride 2: floor((64 − 5 + 4)/2) + 1 = floor(31.5) + 1 = **32**.</details>

**Q2.** How many parameters in a Conv2d with 32 input channels, 64 output channels, 3×3 kernels (with bias)?
<details><summary>Answer</summary>(3×3×32 + 1) × 64 = 289 × 64 = **18,496**.</details>

**Q3.** Max-pool (2×2, stride 2) this 4×4 input: [[1,5,2,0],[3,2,1,4],[0,1,7,2],[6,2,3,1]].
<details><summary>Answer</summary>[[5, 4], [6, 7]].</details>

**Q4.** Name two reasons CNNs beat MLPs on images.
<details><summary>Answer</summary>Far fewer parameters (local connectivity + weight sharing), preserve spatial structure, translation invariance (same filter everywhere).</details>

**Q5.** You have 300 labelled X-ray images. How would you build a classifier?
<details><summary>Answer</summary>Transfer learning: start from a pretrained CNN/ViT, replace the head, train the head (frozen backbone), then fine-tune with a small LR, using augmentation suitable for X-rays and cross-validation given the small data.</details>

**Q6.** A predicted box and the true box each have area 80, and overlap by 40. IoU?
<details><summary>Answer</summary>Union = 80 + 80 − 40 = 120 → IoU = 40/120 ≈ **0.33**.</details>

**Q7.** What does NMS do?
<details><summary>Answer</summary>Removes duplicate overlapping detections, keeping only the highest-confidence box for each object.</details>

**Q8.** What are U-Net's skip connections for?
<details><summary>Answer</summary>They carry fine spatial details from the encoder to the decoder so the output mask has sharp, accurate boundaries.</details>

**Q9.** Why shouldn't you augment the validation set randomly?
<details><summary>Answer</summary>The validation set should reflect real data and be consistent across epochs, so scores are comparable and honest.</details>

---

## 18. New words in this file

| Word | Meaning |
|---|---|
| CNN | Convolutional Neural Network |
| Local connectivity, weight sharing | Look at small patches / reuse the same filter everywhere |
| Translation invariance | Recognising things regardless of position |
| Channel, channels-first | Colour or feature layer / (C, H, W) order |
| Convolution (cross-correlation), filter/kernel | Sliding dot product / small learnable weight grid |
| Feature map / activation map | Output of a filter |
| Edge detector | Filter responding to brightness changes |
| Stride, padding (valid/same) | Step size / zero border |
| Output size formula | floor((n − k + 2p)/s) + 1 |
| 1×1 convolution, bottleneck | Channel mixing / reducing channels cheaply |
| Pooling (max, average, global average) | Downsampling without parameters |
| Receptive field | Image region affecting a neuron |
| Feature hierarchy | Edges → textures → parts → objects |
| CIFAR-10, ImageNet, COCO | Standard vision datasets |
| LeNet, AlexNet, VGG, Inception, ResNet, MobileNet, EfficientNet, ConvNeXt | Famous CNN architectures |
| Depthwise separable convolution | Per-channel conv + 1×1 mixing |
| Compound scaling | Scaling depth, width, resolution together |
| Data augmentation, invariance | Random label-preserving changes / insensitivity to changes |
| Mixup, CutMix, Cutout, RandAugment | Augmentation techniques |
| Test-time augmentation (TTA) | Averaging predictions over augmented test copies |
| Transfer learning, pretrained model | Reusing a model trained on big data |
| Backbone, head | Feature-extracting body / task-specific final layer |
| Freeze / unfreeze, feature extraction, fine-tuning, gradual unfreezing | Ways to adapt pretrained models |
| timm, torchvision.models | Pretrained vision model libraries |
| Image classification, localisation, detection, segmentation (semantic/instance/panoptic) | Vision tasks |
| Bounding box, confidence score | Rectangle around an object / model's certainty |
| IoU | Overlap ÷ union of two boxes/masks |
| NMS | Remove duplicate detections |
| Two-stage (Faster R-CNN) vs one-stage (YOLO, SSD) detectors | Accurate vs fast detection families |
| DETR | Transformer-based detector |
| Anchor boxes, anchor-free | Predefined box shapes / no predefined shapes |
| Focal loss | Loss down-weighting easy examples |
| mAP, mAP@0.5, mAP@0.5:0.95 | Detection metric |
| Label Studio, CVAT, Roboflow | Labelling tools |
| U-Net, encoder, decoder, upsampling, transposed convolution | Segmentation architecture and parts |
| Mask R-CNN, SAM | Instance segmentation / promptable segmentation foundation model |
| Foundation model | Large pretrained model adaptable to many tasks |
| mIoU, Dice coefficient, Dice loss | Segmentation metrics/loss |
| Face recognition, Siamese network, contrastive/triplet loss | Matching via learned embeddings |
| OCR, pose estimation, keypoints | Reading text / finding body joints |
| ViT, self-supervised pretraining (DINO, MAE) | Transformers for images / learning without labels |
| Zero-shot | Doing a task with no task-specific training examples |

**Next:** [17-sequence-models-and-attention.md](17-sequence-models-and-attention.md)
