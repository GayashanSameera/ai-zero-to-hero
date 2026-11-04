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

**Why it exists:** An MLP treats a photo as one long list of numbers, so it needs a gigantic number of weights and has no idea that neighbouring pixels belong together. CNNs were invented to give the network the same "common sense" a human eye has: look at small local patches, and reuse the same pattern detector everywhere.

In [file 15](15-neural-networks.md#19-a-complete-training-loop) we flattened 28×28 MNIST images into 784 numbers and used an MLP. It worked (~98%), but it has big problems for real photos:

1. **Too many parameters.** A 224×224 colour image has 224 × 224 × 3 = 150,528 numbers. One dense layer to 1,000 neurons = **150 million weights**. Huge, slow, overfits.
2. **Ignores spatial structure.** Flattening throws away the fact that neighbouring pixels are related.
3. **No translation invariance.** A cat in the top-left corner and a cat in the bottom-right use completely different weights. The MLP must learn "cat" separately for every position.

**CNNs (Convolutional Neural Networks)** fix all three with two ideas:
- **Local connectivity:** each neuron looks only at a small patch of the image
- **Weight sharing:** the same small set of weights (a **filter**) is used at every position

### Worked example: counting the weights

A 224 x 224 colour photo has 224 x 224 x 3 = **150,528** numbers. Connect them all to just 1,000 neurons in one dense layer:

```
150,528 inputs x 1,000 neurons = 150,528,000 weights  (about 150 million, before biases)
```

A CNN filter of size 3 x 3 x 3 has only **27 weights**, and it is reused at every position of the photo. That is the whole trick: the number of weights depends on the filter size, not on the image size.

```
MLP:  every pixel --> every neuron        (huge, position-specific)
CNN:  one small filter slides everywhere  (tiny, position-free)
```

**Where you'll meet it in real work:** a Daraz-style "search by photo" feature, a hospital X-ray screening tool, or a phone app that reads vehicle number plates. All of them put a CNN (or its modern cousin) at the front.

**Common mistake:** thinking CNNs are only for photos. Any data with a grid or local neighbourhood structure works: audio spectrograms, 1-D sensor signals, even text with 1-D convolutions.

**Exam angle:** questions ask *why* CNNs suit images: fewer parameters through **weight sharing**, **local connectivity**, and **translation invariance**. Expect a "which is NOT a benefit" style option.

> **සිංහලෙන්:** ෆොටෝ එකක් සාමාන්‍ය MLP එකකට දැම්මොත් ප්‍රශ්න තුනක් එනවා. 224×224 colour ෆොටෝ එකක pixel අංක 150,528ක් තියෙනවා. ඒක neurons 1,000කට සම්බන්ධ කළොත් weights කෝටි 15ක් විතර ඕනේ වෙනවා. ඒ වගේම ෆොටෝ එකේ බළලා වම් කෙළවරේ හිටියත් දකුණු කෙළවරේ හිටියත් MLP එකට වෙන වෙනම ඉගෙන ගන්න වෙනවා. CNN එකේදී පොඩි filter එකක් (3×3 වගේ) ෆොටෝ එක පුරාම ලිස්සලා යනවා, එකම weights නැවත නැවත පාවිච්චි වෙනවා. ඒ නිසා weights ගොඩක් අඩුයි, බළලා කොහේ හිටියත් අඳුනගන්න පුළුවන්.

---

## 2. Images as tensors

**Why it exists:** A neural network can only do arithmetic on numbers, so before anything else we must agree on exactly how a picture becomes a block of numbers, and in what order the dimensions are stored. Most shape errors in vision code come from getting this wrong.

From [file 01](01-big-picture-and-data.md#how-images-are-stored) and [file 05](05-math-linear-algebra.md#13-tensors):
- Grayscale image: matrix (height × width), values 0 to 255
- Colour image: 3 **channels** (R, G, B) → (3 × H × W) in PyTorch (**channels first**)
- A batch: (batch × channels × height × width), e.g. **(32, 3, 224, 224)**

Before training, pixel values are usually scaled to [0, 1] (÷255) and then standardised per channel using the dataset's mean and std ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)).

### Worked example: from pixel to network input

One pixel in the red channel has the value 200.

```
Step 1: scale to [0, 1]            200 / 255            = 0.784
Step 2: subtract the channel mean   0.784 - 0.485        = 0.299     (ImageNet red mean = 0.485)
Step 3: divide by the channel std   0.299 / 0.229        = 1.31      (ImageNet red std  = 0.229)
```

The network sees 1.31, not 200. Values near zero with a similar spread on every channel make training faster and more stable ([file 10](10-data-science-workflow.md#10-scaling-numeric-features)).

**How big is a batch?** A batch of shape (32, 3, 224, 224) holds 32 x 3 x 224 x 224 = **4,816,896** numbers. At 4 bytes each (float32) that is about 19 MB for the input alone, which is why batch size is limited by GPU memory.

| Library | Usual order | Name |
|---|---|---|
| PyTorch | (C, H, W) | channels first |
| NumPy / PIL / OpenCV images | (H, W, C) | channels last |

**Common mistake:** feeding an (H, W, C) NumPy image straight into PyTorch. The shapes may even "work" and give nonsense. Convert with `.permute(2, 0, 1)` (this is what `transforms.ToTensor()` does for you). Another one: using the ImageNet mean/std with a model that was *not* trained with them.

**Exam angle:** know the shape of a batch of images, and that grayscale has 1 channel while RGB has 3.

> **සිංහලෙන්:** පරිගණකයට ෆොටෝ එකක් කියන්නේ අංක ගොඩක්. Colour ෆොටෝ එකක channels තුනක් තියෙනවා: Red, Green, Blue, හැම pixel එකකටම 0 ඉඳන් 255 දක්වා අගයක්. PyTorch වල (3, 224, 224) කියලා දෙන්නේ channels මුලින්, ඊට පස්සේ උස සහ පළල. Pixel අගය 200 නම් 255න් බෙදලා 0.784 කරනවා, ඊට පස්සේ mean අඩු කරලා std එකෙන් බෙදලා 1.31 වගේ පොඩි අගයක් හදනවා. එතකොට training එක ලේසියෙන් සහ ස්ථාවරව වෙනවා.

---

## 3. The convolution operation

**Why it exists:** To spot a pattern like an edge, a network needs to compare a pixel with its neighbours, and it needs to do that at every position in the picture. Convolution is a cheap, systematic way to do exactly that.

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

### The full feature map for our example

The worked example above computed three positions. Here is the complete 3 x 3 result. With this filter each output is simply (left column - right column), added over the three rows of the patch:

```
Row-wise differences (left minus right) for each 3-wide window:
 row1:  1-0=1   2-1=1   0-3=-3
 row2:  0-3=-3  1-1=0   3-0=3
 row3:  2-0=2   1-2=-1  0-1=-1
 row4:  1-2=-1  0-1=-1  2-0=2
 row5:  0-1=-1  2-0=2   1-1=0

Output = sum of 3 consecutive rows:
   0    0   -1          (1-3+2,  1+0-1,  -3+3-1)
  -2   -2    4          (-3+2-1, 0-1-1,   3-1+2)
   0    0    1          ( 2-1-1, -1-1+2, -1+2+0)
```

After ReLU (negatives become 0) the map keeps only the strong "bright-left, dark-right" responses:

```
 0  0  0
 0  0  4
 0  0  1
```

### A cleaner edge example

An image with a bright left half and a dark right half (3 rows x 5 columns), and the same vertical-edge filter:

```
 9 9 9 0 0
 9 9 9 0 0        windows:  cols 1-3 -> 3 rows x (9 - 9) = 0
 9 9 9 0 0                  cols 2-4 -> 3 rows x (9 - 0) = 27
                            cols 3-5 -> 3 rows x (9 - 0) = 27
Output (1 x 3):  [ 0  27  27 ]
```

Flat areas give 0, and the windows that straddle the edge light up. That is what "the filter detects edges" means in practice.

**Where you'll meet it in real work:** every image model you will ever fine-tune (ResNet, EfficientNet, YOLO) is built from thousands of these small sliding dot products.

**Common mistakes:**
- Thinking convolution multiplies two matrices the usual way. It is a *sliding window* of element-wise multiply-and-add.
- Forgetting that on a colour image the filter has a slice for every input channel ([section 6](#6-channels-and-parameter-counting)).

**Exam angle:** you may be given a tiny input and filter and asked for one output value, or asked what the output of a convolution is called (a **feature map**).

> **සිංහලෙන්:** Convolution කියන්නේ පොඩි filter එකක් (උදා: 3×3) ෆොටෝ එක උඩින් ලිස්සවමින්, හැම තැනකදීම filter එකේ අංක සහ යට තියෙන pixels ගුණ කරලා එකතු කරන එක. විශාල සිතියමක් උඩ magnifying glass එකක් කොටුවෙන් කොටුවට ගෙනියනවා වගේ හිතන්න, එයා හොයන්නේ එක විශේෂ දෙයක්, උදාහරණයක් විදිහට සිරස් ඉරි. අපේ උදාහරණයේ තැන් 9ටම ගණන් කළාම ලැබුණු 3×3 grid එකට feature map එකක් කියනවා. Flat තැන් වල අගය 0 වෙනවා, දාරයක් තියෙන තැන් වල අගය ලොකු වෙනවා (උදා: 27). ඒ නිසා filter එක දාර අඳුනගන්නවා කියන්නේ ඒකයි.

---

## 4. Filters learn features

**Why it exists:** Before deep learning, engineers had to guess which filters would be useful and design them by hand. A CNN removes the guessing: it starts with random filters and lets backpropagation shape them into whatever helps the task.

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

### Worked example: two hand-made filters on one patch

Take this 3 x 3 patch: the top two rows are bright (9), the bottom row is dark (0).

```
patch:  9 9 9
        9 9 9
        0 0 0
```

- **Horizontal-edge filter** [[1,1,1],[0,0,0],[-1,-1,-1]]: (9+9+9) + 0 - (0+0+0) = **27**. Strong response: there is a horizontal edge.
- **Vertical-edge filter** [[1,0,-1],[1,0,-1],[1,0,-1]]: each row gives 9 - 9 = 0, total **0**. No vertical edge here.
- **Blur filter** (all 1/9): (9 x 6 + 0 x 3) / 9 = 54 / 9 = **6**. A smoothed value.

Same patch, three filters, three different answers. In a CNN the numbers inside the filters are *not* typed in by a person. They start random and are updated by gradient descent, exactly like the weights of any neuron.

**Where you'll meet it in real work:** a CNN trained on chest X-rays discovers edge and texture detectors in its first layers *on its own*, then lung-shaped and rib-shaped detectors later. Nobody programmed a "rib detector".

**Common mistake:** believing that a human chooses the filters in a deep CNN. Humans choose the *number* and *size* of filters; the values are learned.

**Exam angle:** "what do early vs deep layers of a CNN learn?" Answer: edges and colours first, textures and parts in the middle, whole objects at the end.

> **සිංහලෙන්:** කලින් කාලේ image processing වලදී මිනිස්සු අතින් filters හදනවා, උදාහරණයට සිරස් දාර අල්ලන්න 1, 0, −1 වගේ අංක. CNN එකේදී filter එකේ අංක මුලින් random, ඊට පස්සේ backpropagation එකෙන් training එකේදීම ඉගෙන ගන්නවා. Early layers වල edges සහ colours අඳුනගන්නවා, මැද layers වල textures සහ කොටස්, ගැඹුරු layers වල ඇස්, රෝද, මුහුණු වගේ සම්පූර්ණ දේවල්. X-ray එකක් train කළොත් model එක තනියම ඉළ ඇටයේ හැඩය අඳුනගන්න filters හදාගන්නවා, කවුරුවත් ඒවා program කරන්නේ නෑ.

---

## 5. Stride, padding, and output size

**Why it exists:** Without stride and padding control, the picture would shrink at every layer and the border pixels would barely count. These two settings let you decide how fast the picture shrinks and whether the edges get fair treatment.

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

### Worked examples with the formula

`output = floor((input - kernel + 2 x padding) / stride) + 1`

| Input | Kernel | Padding | Stride | Calculation | Output |
|---|---|---|---|---|---|
| 7 | 3 | 0 | 1 | (7 - 3 + 0)/1 + 1 | **5** |
| 7 | 3 | 0 | 2 | (7 - 3 + 0)/2 + 1 = 2 + 1 | **3** |
| 10 | 3 | 1 | 2 | floor((10 - 3 + 2)/2) + 1 = floor(4.5) + 1 | **5** |
| 32 | 5 | 2 | 1 | (32 - 5 + 4)/1 + 1 | **32** |

Seeing stride 2 on a 7-wide row (the filter lands on columns 1-3, 3-5, 5-7):

```
columns:  1 2 3 4 5 6 7
step 1:   [1 2 3]
step 2:       [3 4 5]
step 3:           [5 6 7]      -> 3 positions
```

### Tracking sizes through a small network

```
Input 32 x 32
 conv 3x3, padding 1, stride 1  ->  32 x 32      (same padding keeps the size)
 max-pool 2x2, stride 2         ->  16 x 16      (pooling halves it)
 conv 3x3, padding 1, stride 1  ->  16 x 16
 max-pool 2x2, stride 2         ->   8 x 8
```

**Common mistakes:**
- Forgetting the **2 x** in front of padding (padding is added on *both* sides).
- Forgetting the `floor`. If the division is not exact, the last partial window is simply dropped.
- Mixing up "same" padding (output = input when stride is 1) with "valid" (no padding).

**Exam angle:** computing an output size from the formula is a classic calculation question. Practise it until it takes ten seconds.

> **සිංහලෙන්:** Stride කියන්නේ filter එක එක පාරකට pixels කීයක් පනිනවාද කියන එක. Stride 2 නම් output එක භාගයක් විතර පොඩි වෙනවා. Padding කියන්නේ දාර වටේට 0 දාන එක, එතකොට output එක පොඩි නොවී තියාගන්න පුළුවන්. සූත්‍රය: output = floor((input − kernel + 2×padding) / stride) + 1. උදාහරණයක්, input 7, kernel 3, padding 0, stride 2 නම් (7−3)/2 + 1 = 3. Padding දෙපැත්තටම දානවා නිසා 2× කියලා ගුණ කරන්න අමතක කරන්න එපා.

---

## 6. Channels and parameter counting

**Why it exists:** Real photos have several colour channels, and real layers have many filters. To plan memory and training time you must be able to count a layer's weights in your head.

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

### Worked example: counting a bottleneck

Suppose a layer receives 256 channels. Compare two ways of producing 256 output channels with a 3 x 3 view:

```
Direct 3x3 conv, 256 -> 256:
   (3 x 3 x 256 + 1) x 256 = 2,305 x 256 = 590,080 parameters

Bottleneck (the ResNet-style trick):
   1x1 conv, 256 -> 64 :  (1 x 1 x 256 + 1) x 64 =  257 x 64 = 16,448
   3x3 conv,  64 -> 64 :  (3 x 3 x  64 + 1) x 64 =  577 x 64 = 36,928
   1x1 conv,  64 -> 256:  (1 x 1 x  64 + 1) x 256 = 65 x 256 = 16,640
                                                      total  = 70,016 parameters
```

590,080 / 70,016 is about **8.4 times fewer** parameters for the same input and output shape. That is why 1 x 1 convolutions are everywhere in deep CNNs.

**Where you'll meet it in real work:** when you pick a model for a phone app, the parameter count decides the download size. 25 million float32 weights is about 100 MB.

**Common mistakes:**
- Forgetting that each filter has a slice for **every input channel** (the `C_in` in the formula).
- Forgetting the **+1** for the bias of each filter.
- Thinking the image size appears in the formula. It does not: a conv layer has the same number of parameters on a 32 x 32 or a 1024 x 1024 image (the *compute* grows, the parameters do not).

**Exam angle:** "How many parameters does this conv layer have?" is a favourite. Write `(k x k x C_in + 1) x C_out` and plug in.

> **සිංහලෙන්:** Colour ෆොටෝ එකක filter එකක් හැම input channel එකකම කොටසක් අල්ලනවා, ඒ නිසා "3×3" filter එකක් RGB image එකකට ඇත්තටම 3×3×3 = 27 weights, ඒකට bias එකක් එකතු කරලා 28. Layer එකක parameters = (k×k×C_in + 1) × C_out. උදාහරණයට 3 → 64 channels, 3×3 kernel නම් 28 × 64 = 1,792යි. 1×1 conv එකකින් channels 256 ඉඳන් 64 කට අඩු කරලා ඊට පස්සේ 3×3 දැම්මොත් parameters 590,080 සිට 70,016 දක්වා අඩු වෙනවා, ඒ කියන්නේ 8 ගුණයක් විතර අඩුයි. Image එකේ ප්‍රමාණය parameters ගණනට බලපාන්නේ නෑ.

---

## 7. Pooling

**Why it exists:** After convolution the feature maps are still large. Pooling shrinks them so later layers do less work, and it also makes the network forgiving when an object moves by a pixel or two.

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

### Worked examples

**Average pooling** on the first block of the max-pool example, {1, 3, 4, 2}: (1 + 3 + 4 + 2) / 4 = **2.5**, whereas max pooling gives **4**.

**Why max pooling tolerates small shifts:** if the bright pixel moves one step inside its 2 x 2 block, the maximum stays the same.

```
block A: [0 9]     block B: [9 0]      both give max = 9
         [0 0]              [0 0]
```

**Global average pooling saves a huge number of weights.** Take a final feature tensor of 512 channels at 7 x 7 and a 1,000-class output:

```
Flatten + dense:   512 x 7 x 7 = 25,088 inputs -> 25,088 x 1,000 = 25,088,000 weights
Global avg pool:   512 numbers                 ->    512 x 1,000 =    512,000 weights
```

VGG-16's first dense layer (25,088 inputs to 4,096 outputs) alone needed 25,088 x 4,096 = **102,760,448** weights. That is most of its 138 million parameters, which is why later networks switched to global average pooling.

**Common mistakes:**
- Saying pooling has weights to learn. It has none.
- Using max pooling when the exact position matters a lot (for example, segmentation needs the "where"; that is why U-Net keeps skip connections, [section 15](#15-segmentation)).

**Exam angle:** pooling = downsampling with no parameters; max pooling keeps the strongest response; global average pooling turns each channel into one number.

> **සිංහලෙන්:** Pooling කියන්නේ feature map එක පොඩි කරන එක, ඒකට learn කරන්න weights නෑ. Max pooling එකේදී 2×2 කොටුවක ලොකුම අගය විතරක් තියාගන්නවා, උදාහරණයට {1, 3, 4, 2} කොටුවෙන් 4 ගන්නවා, average ගත්තොත් 2.5. දීප්තිමත් pixel එක කොටුව ඇතුළේ එක පියවරක් එහාට මෙහාට ගියත් ලොකුම අගය වෙනස් වෙන්නේ නෑ, ඒ නිසා model එක පොඩි සෙලවීම් වලට ඔරොත්තු දෙනවා. Global average pooling එකෙන් channel එකක් සම්පූර්ණයම එක අංකයකට හකුළනවා. ඒකෙන් dense layer එකේ weights මිලියන 25ක් විතර අඩු කරගන්න පුළුවන්.

---

## 8. Receptive field and feature hierarchy

**Why it exists:** To recognise a whole bicycle, a neuron must "see" a big area of the photo, but each filter only looks at a tiny patch. Stacking layers makes the seen area grow, and that is how small local detectors turn into object detectors.

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

### Worked example: how the receptive field grows

For stride-1 3 x 3 convolutions the receptive field after n layers is `1 + n x (3 - 1)`:

| Layers | Receptive field |
|---|---|
| 1 | 3 x 3 |
| 2 | 5 x 5 |
| 3 | 7 x 7 |
| 10 | 21 x 21 |

**Stacking 3 x 3 layers is cheaper than one big filter.** Take C channels in and out, ignoring biases:

```
one 7x7 conv:        7 x 7 x C x C  = 49 C^2
three 3x3 convs:  3 x (3 x 3 x C x C) = 27 C^2        (same 7x7 view)
C = 64:  49 x 4,096 = 200,704   vs   27 x 4,096 = 110,592   (about 45% fewer)
```

The stack also has three ReLUs instead of one, so it can learn more complicated patterns.

**Where you'll meet it in real work:** in detection and segmentation, if the receptive field is smaller than the object you want to find (a large truck close to the camera), the network cannot "see" all of it and accuracy drops.

**Common mistakes:**
- Thinking a deep neuron automatically sees the whole image. It sees only what the receptive field covers.
- Forgetting that stride and pooling make the receptive field grow *faster*.

**Exam angle:** "why do deeper layers detect more complex features?" Answer: larger receptive field plus building on earlier features.

> **සිංහලෙන්:** Receptive field කියන්නේ neuron එකකට බලපාන මුල් ෆොටෝ එකේ කොටස. එක 3×3 conv එකකින් 3×3 පෙනෙනවා, දෙකකින් 5×5, තුනකින් 7×7. ඒ නිසා ගැඹුරු layers වලට ලොකු කොටස් පේනවා, සයිකලයක් වගේ සම්පූර්ණ දෙයක් අඳුනගන්න පුළුවන් වෙන්නේ ඒකෙන්. 7×7 filter එකක් වෙනුවට 3×3 තුනක් දැම්මොත් එකම 7×7 පෙනුම ලැබෙනවා, ඒත් parameters 49C² වෙනුවට 27C² යි. ඒ කියන්නේ 45%ක් විතර අඩුයි, ReLU තුනක් තියෙන නිසා වඩා සංකීර්ණ patterns ඉගෙන ගන්නත් පුළුවන්.

---

## 9. A CNN in PyTorch

**Why it exists:** Now we assemble the parts from sections 3 to 8 into one working network, so you can see how shapes shrink, channels grow, and where every parameter lives.

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

### Worked example: count the parameters of SmallCNN

```
Conv 3 -> 32    : (3 x 3 x 3  + 1) x 32  =    28 x 32  =    896
BatchNorm 32    : 2 x 32 (scale + shift)                =     64
Conv 32 -> 64   : (3 x 3 x 32 + 1) x 64  =   289 x 64  = 18,496
BatchNorm 64    : 2 x 64                                =    128
Conv 64 -> 128  : (3 x 3 x 64 + 1) x 128 =   577 x 128 = 73,856
BatchNorm 128   : 2 x 128                               =    256
Linear 128 -> 10: 128 x 10 + 10                         =  1,290
                                              total     = 94,986
```

Pooling and ReLU add zero parameters. You can check it with `sum(p.numel() for p in model.parameters())`; it should print 94,986. A tiny model like this trains in minutes on a laptop CPU for CIFAR-10.

### Following the shape of one image

```
(3, 32, 32) -> conv 32 ch   -> (32, 32, 32)   padding 1 keeps size
            -> maxpool 2    -> (32, 16, 16)
            -> conv 64 ch   -> (64, 16, 16)
            -> maxpool 2    -> (64, 8, 8)
            -> conv 128 ch  -> (128, 8, 8)
            -> global avg   -> (128)
            -> Linear       -> (10) logits
```

**Common mistakes:**
- Putting `softmax` before `nn.CrossEntropyLoss`. The loss applies it internally, so give it raw logits.
- Forgetting `model.eval()` at test time. BatchNorm and Dropout behave differently in training and evaluation mode.
- Mismatched `Linear` input size after flattening. Global average pooling avoids this by always giving a fixed-length vector.

**Exam angle:** know the standard block order (convolution, normalisation, activation, pooling) and that spatial size shrinks while the number of channels grows.

> **සිංහලෙන්:** CNN එකක් හදන්න පොදු රටාව: Conv → BatchNorm → ReLU, ඊට පස්සේ Pooling, ආයෙත් එහෙමම. ඉදිරියට යද්දී ෆොටෝ එකේ ප්‍රමාණය (උස, පළල) අඩු වෙනවා, channels ගණන වැඩි වෙනවා. අන්තිමට global average pooling කරලා Linear layer එකෙන් classes 10කට logits දෙනවා. අපේ SmallCNN එකේ මුළු parameters 94,986යි, ඒක පොඩි නිසා laptop එකකින්වත් ඉක්මනින් train කරන්න පුළුවන්. Test කරද්දී model.eval() දාන්න අමතක කරන්න එපා.

---

## 10. Famous architectures

**Why it exists:** Every famous CNN solved one concrete problem of the one before it: too shallow, too heavy, too hard to train, too slow for phones. Knowing the story makes the names easy to remember.

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

### The story in one line each

- **LeNet (1998):** proved a CNN could read digits on cheques.
- **AlexNet (2012):** proved CNNs plus GPUs plus ReLU can win on a huge dataset.
- **VGG (2014):** showed that depth with tiny 3 x 3 filters works, but it is heavy (138 million parameters).
- **Inception (2014):** used parallel filter sizes and 1 x 1 bottlenecks to be cheaper.
- **ResNet (2015):** added skip connections, so 100+ layers could be trained.
- **MobileNet (2017):** made convolutions cheap enough for phones.
- **EfficientNet (2019):** balanced depth, width and resolution together.

The ImageNet top-5 error (the correct answer is not among the model's five best guesses) fell quickly: about 26% in 2011, 15.3% in 2012 (AlexNet), around 7% in 2014 (VGG and GoogLeNet), and about 3.6% in 2015 (ResNet), which was lower than the roughly 5% usually quoted for a human on that task.

### Worked example: why depthwise separable convolution is cheap

For a 3 x 3 convolution from 128 to 128 channels, count the multiplications at one spatial position:

```
Standard:        3 x 3 x 128 x 128           = 147,456
Depthwise:       3 x 3 x 128                 =   1,152   (one 3x3 filter per channel)
Pointwise 1x1:   128 x 128                   =  16,384   (mix the channels)
Depthwise separable total                    =  17,536
147,456 / 17,536 = about 8.4 times cheaper
```

### How a Vision Transformer sees a photo

Cut a 224 x 224 image into 16 x 16 patches: (224 / 16) x (224 / 16) = 14 x 14 = **196 patches**. Each patch is flattened, turned into an embedding and treated like a word token ([file 19](19-transformers.md)).

**Where you'll meet it in real work:** a farmer's phone app, a school attendance camera or an offline kiosk should use a small model such as MobileNet or EfficientNet-B0. A server doing medical-image research can afford a ResNet-50 or a ViT. In practice you almost never train these from scratch; you download them pretrained ([section 12](#12-transfer-learning)).

**Common mistake:** picking the biggest, newest model by default. Accuracy per millisecond and per MB often matters more than the last 0.5% of accuracy.

**Exam angle:** match names to ideas. ResNet = residual / skip connections. MobileNet = depthwise separable convolutions. Inception = parallel filters and 1 x 1 bottlenecks. ViT = image patches as tokens. AlexNet = the deep learning breakthrough on ImageNet in 2012.

> **සිංහලෙන්:** ප්‍රසිද්ධ CNN හැම එකක්ම කලින් එකේ ප්‍රශ්නයක් විසඳුවා. AlexNet (2012) ImageNet තරඟය ලොකු වෙනසකින් දිනලා deep learning කාලේ පටන් ගත්තා. VGG එකේ අහේතුවෙන් 3×3 filters විතරක් ගොඩගැහුවා, ResNet එකේ skip connections දාලා layers 100කට වඩා train කරන්න පුළුවන් වුණා. Colombo සිට Kandy යන highway එකක් වගේ, පණිවිඩයට අතරමැද නගර හරහා නොගිහින් කෙළින්ම යන්න පුළුවන්. MobileNet එකේ depthwise separable conv වලින් ගණනය 8 ගුණයක් විතර අඩු කළා, ඒ නිසා ෆෝන් එකේ app එකකට ගැළපෙනවා.

---

## 11. Data augmentation

**Why it exists:** A model trained on 2,000 photos tends to memorise them. Augmentation gives it a fresh, slightly different version of every photo each epoch, so it learns what really defines the object instead of memorising one fixed picture.

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

### Worked example: Mixup on numbers

Blend a cat image and a dog image with weight 0.7 for the cat. For one pixel, the cat has value 200 and the dog has value 100:

```
mixed pixel = 0.7 x 200 + 0.3 x 100 = 140 + 30 = 170
mixed label = 0.7 cat + 0.3 dog = [cat 0.7, dog 0.3]
```

The network is trained to output 70% cat and 30% dog. This discourages over-confident predictions.

**Choosing augmentations by domain**

| Domain | Safe | Risky |
|---|---|---|
| Tomato-leaf disease photos | flips, rotations, brightness | strong colour shifts (colour is the symptom!) |
| Street scenes | horizontal flip, small crops | vertical flip (cars on the roof) |
| Handwritten digits | small rotation or shift | horizontal flip (6 and 9, and mirrored digits look wrong) |
| X-rays | small rotation, brightness | flips if left/right (heart side) matters |

**Where you'll meet it in real work:** almost every image project with less than a few tens of thousands of photos. If you photograph 100 pictures of local fruits yourself, augmentation is what makes 100 feel like many hundreds.

**Common mistakes:**
- Augmenting the validation or test set. You want to measure honest, repeatable performance.
- Applying augmentations that change the label (rotating a "6" by 180 degrees makes it a "9").
- Normalising with the wrong mean and std.

**Exam angle:** augmentation is a *regularisation* technique that reduces overfitting. It is applied to training data only.

> **සිංහලෙන්:** Data augmentation කියන්නේ training ෆොටෝ වලට random වෙනස්කම් කරලා අලුත් උදාහරණ හදන එක. Flip කරපු බළලා තාම බළලා. එතකොට model එක එකම ෆොටෝ එක කටපාඩම් කරන්නේ නැතිව, බළලෙක්ගේ සැබෑ ලක්ෂණ ඉගෙන ගන්නවා. Mixup එකේදී බළලා 70%ක් සහ බල්ලා 30%ක් මිශ්‍ර කරලා label එකත් [0.7, 0.3] කරනවා. Training data වලට විතරයි augmentation කරන්නේ, validation සහ test වලට නම් එපා. තක්කාලි කොළ ලෙඩ ෆොටෝ වලදී පාට වෙනස් කරන එක පරිස්සමෙන් කරන්න, ලෙඩේ ලක්ෂණය පාටමයි.

---

## 12. Transfer learning

**Why it exists:** Collecting millions of labelled images is impossible for most people. Transfer learning lets you borrow the general visual knowledge that someone else already paid (in data and GPU time) to learn, and spend your small dataset only on what is specific to your problem.

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

### Worked example: how little you actually train

A ResNet-50 has about 25.6 million parameters. Replacing its 1,000-class head with a 5-class one adds:

```
Linear(2048, 5):  2048 x 5 weights + 5 biases = 10,245 parameters
10,245 / 25,600,000 = about 0.04% of the model
```

In feature extraction you train only that 0.04%, which is why 300 to 2,000 photos can be enough and training takes minutes.

### Which strategy should I choose?

| Your data | Similar to ImageNet? | Strategy |
|---|---|---|
| Very small (hundreds) | yes (everyday photos) | Freeze the backbone, train the head only |
| Small | no (X-rays, satellite) | Train the head, then fine-tune deeper layers with a small LR |
| Medium or large | either | Fine-tune the whole model with a small LR |
| Huge, very different | no | Consider training from scratch, or a domain-specific pretrained model |

### Learning rates, in numbers

New head: lr = 1e-3. Backbone: lr = 1e-5, which is 100 times smaller. The head starts with random weights and needs big steps; the backbone is already good and only needs gentle nudges.

**Where you'll meet it in real work:** nearly every practical vision project. A tea-estate app that spots 4 leaf diseases, a hospital model for 3 types of skin lesion, or a factory camera checking bottle caps all begin from a pretrained backbone.

**Common mistakes:**
- Using too high a learning rate when fine-tuning, which destroys the pretrained knowledge ("catastrophic forgetting").
- Using different preprocessing from what the model was trained with.
- Freezing the weights but leaving BatchNorm layers in training mode, so their running statistics still change. Put frozen parts in `eval()` mode.
- Evaluating on images that also appear in the training set (data leakage, [file 10](10-data-science-workflow.md)).

**Exam angle:** transfer learning, feature extraction vs fine-tuning, and "replace the head, freeze the backbone" are standard exam topics. The same logic applies to fine-tuning LLMs.

> **සිංහලෙන්:** Transfer learning කියන්නේ කාර් පදවන්න දන්න කෙනෙක් lorry එකක් පදවන්න ඉගෙන ගන්නවා වගේ දෙයක්. ImageNet එකෙන් කලින් train කරපු ResNet එකක් අරගෙන, අන්තිම layer එක (head) ඔයාගේ classes ගණනට මාරු කරනවා. ෆොටෝ 300ක් 2,000ක් වගේ ස්වල්පයක් තිබුණත් ඇති, මොකද ResNet-50 එකේ parameters මිලියන 25.6න් ඔයා train කරන්නේ 10,245ක් විතරයි. පොඩි data නම් backbone එක freeze කරන්න, ටිකක් වැඩි data නම් පොඩි learning rate එකකින් fine-tune කරන්න. තේ කොළ ලෙඩ හඳුනාගන්න app එකක් හදනවා නම් මේ ක්‍රමය හොඳම ක්‍රමයයි.

---

## 13. Computer vision tasks

**Why it exists:** "Look at this photo" is not one problem but a family of problems. Choosing the right task decides what labels you must collect, which model you use and how you measure success.

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

### Choosing the task: Sri Lankan examples

| Business question | Task | Output |
|---|---|---|
| Is this a ripe or unripe mango? | Image classification | one label |
| Which tags fit this Daraz product photo (shirt, red, cotton)? | Multi-label classification | several labels |
| Where are the vehicles in this junction camera image? | Object detection | boxes + labels + scores |
| Read the number plate | Detection (find the plate), then OCR (read the text) | text |
| How many hectares of this satellite image are paddy field? | Semantic segmentation | a class per pixel |
| Count each separate person in a crowd and outline them | Instance segmentation | one mask per person |

**The cost ladder:** classification labels are cheap (one word per image). Boxes cost more (someone draws every rectangle). Pixel masks are the most expensive (someone traces every outline). Pick the *simplest task that answers your business question*.

**Common mistake:** training a detector when all you need is "is there a defect in this photo, yes or no?" Classification would be cheaper, faster and often more accurate.

**Exam angle:** distinguish classification, detection, semantic segmentation and instance segmentation by what they output.

> **සිංහලෙන්:** Computer vision වැඩ කීපයක් තියෙනවා, ඒවා වෙන් කරගන්න ඕනේ. Classification කියන්නේ ෆොටෝ එකට label එකක් විතරයි ("අඹ"). Detection කියන්නේ object හැම එකකටම box එකක් සහ label එකක්. Semantic segmentation එකේදී හැම pixel එකකටම class එකක් දෙනවා. Instance segmentation එකේදී එකම වර්ගයේ වෙනස් object (මිනිහා 1, මිනිහා 2) වෙන් කරනවා. Number plate එකක් කියවන්න නම් මුලින් detection එකෙන් plate එක හොයලා, ඊට පස්සේ OCR එකෙන් අකුරු කියවනවා. Label කරන්න ලේසිම classification, අමාරුම segmentation.

---

## 14. Object detection

**Why it exists:** Classification says "there is a dog somewhere". A self-driving car, a shop camera or a traffic system needs to know *which* objects and *where*. Detection gives each object a box, a class and a confidence score.

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

### Worked example: IoU with coordinates

True box from (0, 0) to (10, 10): area 100. Predicted box from (2, 2) to (12, 12): area 100.

```
Overlap = x from 2 to 10 (8 wide) x y from 2 to 10 (8 tall) = 64
Union   = 100 + 100 - 64 = 136
IoU     = 64 / 136 = 0.47
```

At the usual 0.5 threshold this prediction does **not** count as correct, even though it looks close. IoU is strict.

### Worked example: NMS

A detector reports three boxes for a scene. Confidence: A = 0.9, B = 0.8, C = 0.6. IoU(A, B) = 0.7, IoU(A, C) = 0.1. Threshold = 0.5.

```
1. Keep the highest-confidence box: A.
2. B overlaps A with IoU 0.7 > 0.5  -> B is a duplicate of A -> removed.
3. C overlaps A with IoU 0.1 < 0.5  -> C is a different object -> kept.
Result: A and C.
```

### Worked example: precision and recall for detection

A junction image really contains 10 vehicles. The detector outputs 8 boxes, of which 6 match a real vehicle with IoU >= 0.5.

```
Precision = correct detections / all detections made = 6 / 8  = 0.75
Recall    = correct detections / all real objects     = 6 / 10 = 0.60
```

Lower the confidence threshold and recall rises (more boxes) while precision usually falls. mAP summarises this trade-off by averaging the area under the precision-recall curve over classes.

**Where you'll meet it in real work:** vehicle counting at junctions, safety-helmet detection on construction sites, shelf-stock counting in supermarkets, and wildlife cameras in national parks.

**Common mistakes:**
- Mixing up the **confidence threshold** (how sure the model must be to output a box) and the **IoU threshold** (how much overlap counts as a correct match).
- Reporting only classification accuracy for a detector. Use mAP.

**Exam angle:** IoU calculation, what NMS does, one-stage vs two-stage (YOLO is fast, Faster R-CNN is more accurate), and what mAP measures.

> **සිංහලෙන්:** Object detection එකේදී model එක හොයාගන්න හැම object එකකටම box එකක්, class එකක් සහ confidence score එකක් දෙනවා. Box එක හරිද කියලා බලන්නේ IoU = overlap ÷ union එකෙන්. හරි box එක 100, හිතපු box එක 100, overlap 64 නම් union 136, IoU 0.47 නිසා 0.5 ට අඩුයි, වැරදියි. එකම object එකට box කීපයක් ආවොත් NMS එකෙන් confidence එක වැඩිම box එක තියාගෙන, ඊට ගොඩක් overlap වෙන අනිත් ඒවා අයින් කරනවා. Junction එකක වාහන 10න් 6ක් හරියට අල්ලලා box 8ක් දුන්නොත් precision 6/8 = 0.75, recall 6/10 = 0.6.

---

## 15. Segmentation

**Why it exists:** A box around a tumour or a flooded field is too rough: doctors need its exact outline, and planners need the exact area. Segmentation answers "which class is each pixel?" so the outline is precise.

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

### Worked example: IoU vs Dice on masks

A predicted tumour mask has 40 pixels, the true mask has 50 pixels, and 30 pixels are in both.

```
IoU  = overlap / union = 30 / (40 + 50 - 30) = 30 / 60 = 0.50
Dice = 2 x overlap / (sum of areas) = 60 / 90 = 0.67
```

Dice is always at least as large as IoU for the same masks, so never compare a Dice score with an IoU score.

### Why plain pixel accuracy is misleading

In a 100 x 100 image (10,000 pixels) a tumour covers only 100 pixels (1%). A model that predicts "background" everywhere gets **9,900 / 10,000 = 99% pixel accuracy** while finding nothing. That is why Dice, IoU and Dice loss are used: they focus on the small object, the same class-imbalance idea from [file 13](13-evaluation-metrics-and-tuning.md#14-imbalanced-data).

### Why U-Net needs skip connections

The encoder keeps shrinking the image (say 256 to 16), so it knows *what* is there but loses *where* exactly. Upsampling alone gives blurry edges. The skip connections copy the high-resolution feature maps from the encoder straight across to the decoder, which restores sharp boundaries.

**Where you'll meet it in real work:** measuring lesion size on a scan, mapping flood extent or paddy area from satellite pictures, removing the background from product photos, and the denoising network inside image generators such as Stable Diffusion.

**Common mistake:** evaluating segmentation by pixel accuracy on imbalanced images, as shown above.

**Exam angle:** know semantic vs instance segmentation, that U-Net is an encoder-decoder with skip connections, and that Dice and IoU measure mask overlap.

> **සිංහලෙන්:** Segmentation කියන්නේ ෆොටෝ එකේ හැම pixel එකකටම class එකක් දෙන එක, tumour එකක හරියටම හැඩය හොයන්න වගේ. U-Net එකේ encoder එක ෆොටෝ එක පොඩි කරනවා, ඒකෙන් "මොකක්ද" කියලා තේරෙනවා ඒත් "කොහෙද" කියන එක බොඳ වෙනවා. Decoder එක ආයෙත් ලොකු කරද්දී skip connections වලින් encoder එකේ පැහැදිලි විස්තර කෙළින්ම එනවා, ඒකෙන් දාර තියුණු වෙනවා. Pixels 10,000ක ෆොටෝ එකක tumour එක 100ක් විතරයි නම්, හැම තැනම background කියපු model එකටත් 99% pixel accuracy ලැබෙනවා. ඒ නිසා Dice සහ IoU පාවිච්චි කරනවා.

---

## 16. Other vision tasks

**Why it exists:** Beyond classify, detect and segment, a CNN can turn almost anything visual into a vector of numbers. That one idea powers face unlock, text reading and modern image-language models.

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

### Worked example: face matching with embeddings

Suppose a face network maps each photo to a 2-number embedding (real ones use 128 to 512 numbers, but the idea is identical):

```
Photo A (Nimal, morning)   = [0.9, 0.1]
Photo B (Nimal, evening)   = [0.8, 0.2]
Photo C (Kamala)           = [0.1, 0.9]

distance(A, B) = sqrt((0.9-0.8)^2 + (0.1-0.2)^2) = sqrt(0.01 + 0.01) = 0.14
distance(A, C) = sqrt((0.9-0.1)^2 + (0.1-0.9)^2) = sqrt(0.64 + 0.64) = 1.13
```

With a threshold of 0.5, A and B are "the same person" and A and C are not. Contrastive or triplet training is what pulls the Nimal photos together and pushes Kamala away.

Because matching uses distance, adding a new person needs no retraining: just store their embedding. This is why the same idea works for RAG search ([file 23](23-rag-and-vector-databases.md)).

### Zero-shot classification with CLIP

CLIP puts images and text into the same embedding space. To classify a photo you embed the text "a photo of a tuk-tuk", "a photo of a bus" and so on, and pick the text whose embedding is closest to the image. No tuk-tuk training photos needed.

**Where you'll meet it in real work:** phone face unlock, bank e-KYC checks that match a selfie to an ID photo, scanning printed bills and NIC cards with OCR (Sinhala and Tamil OCR is harder than English because of the many letter shapes), and image search.

**Common mistakes:**
- Treating face recognition as ordinary classification with one class per person. That cannot add new people without retraining; embeddings can.
- Assuming OCR output is perfect. Always validate important fields (amounts, ID numbers).
- Ignoring privacy: faces are sensitive personal data ([file 29](29-trustworthy-ai.md)).

**Exam angle:** embeddings and similarity search are central exam topics. CLIP = joint image-text embeddings and zero-shot classification. ViT = transformer on image patches.

> **සිංහලෙන්:** CNN එකකට ෆොටෝ එකක් අංක ලැයිස්තුවක් (embedding) බවට හරවන්න පුළුවන්. මුහුණු දෙකක් එකම කෙනාගේද කියලා බලන්නේ ඒ embeddings දෙක ළඟද කියලා. උදාහරණයට නිමල්ගේ ෆොටෝ දෙකේ දුර 0.14, නිමල් සහ කමලා අතර දුර 1.13, threshold එක 0.5 නම් පළවෙනි දෙක එකම කෙනා. අලුත් කෙනෙක් එකතු කරන්න model එක ආයෙත් train කරන්න ඕනේ නෑ, embedding එක save කළාම ඇති. CLIP එකෙන් පින්තූරයයි වචනයි එකම අවකාශයේ තියෙන නිසා "tuk-tuk" කියලා text එක ලියලා, training ෆොටෝ නැතුවම tuk-tuk හඳුනගන්න පුළුවන්. Face data පුද්ගලික දත්ත නිසා privacy ගැනත් හිතන්න ඕනේ.

```quiz
[
  {"q": "A 224x224 RGB image is flattened and connected to a dense layer of 1,000 neurons. About how many weights is that (ignoring biases)?", "options": ["About 150 thousand", "About 1.5 million", "About 150 million", "About 1.5 billion"], "answer": 2, "why": "224 x 224 x 3 = 150,528 inputs, and 150,528 x 1,000 = 150,528,000 weights. The wrong 'million' options come from dropping a factor of 1,000 or 100. This is the core reason MLPs do not scale to images and CNNs share a small filter instead."},
  {"q": "What is the output width for input 32, kernel 5, padding 0, stride 1?", "options": ["27", "28", "29", "32"], "answer": 1, "why": "floor((32 - 5 + 0) / 1) + 1 = 28. 27 comes from forgetting the +1; 32 would need padding 2 ('same' padding)."},
  {"q": "How many parameters does Conv2d(in_channels=16, out_channels=32, kernel_size=3) have, with bias?", "options": ["4,608", "4,672", "9,248", "4,640"], "answer": 3, "why": "(3 x 3 x 16 + 1) x 32 = 145 x 32 = 4,640. 4,608 forgets the 32 biases; 9,248 is the count for 32 to 32 channels, a different layer."},
  {"q": "Which statement about max pooling is true?", "options": ["It has no learnable parameters and keeps the strongest response in each window", "It learns one weight per window", "It increases the image size", "It is only used at the very first layer"], "answer": 0, "why": "Pooling is a fixed operation (max or average) with no weights. Learnable weights belong to convolution and dense layers. Max pooling shrinks, not enlarges, the feature map."},
  {"q": "A predicted box and the true box each have area 60, and they overlap by 30. What is the IoU?", "options": ["0.50", "0.25", "0.33", "0.67"], "answer": 2, "why": "Union = 60 + 60 - 30 = 90, so IoU = 30 / 90 = 0.33. The tempting 0.50 is overlap divided by one box area, not by the union."},
  {"q": "You have 400 labelled photos of local vegetables, similar to everyday ImageNet photos. What is the best first approach?", "options": ["Train a large CNN from random weights", "Take a pretrained CNN, replace the head, freeze the backbone and train the head", "Use an MLP on flattened pixels", "Use no augmentation so the model sees the real data"], "answer": 1, "why": "Little data plus similar images is the classic case for feature extraction with transfer learning. Training from scratch would overfit on 400 photos, and augmentation is a help, not a harm."},
  {"q": "What does Non-Maximum Suppression (NMS) do in object detection?", "options": ["Increases the resolution of boxes", "Converts boxes into segmentation masks", "Trains the detector faster", "Removes duplicate overlapping boxes, keeping the highest-confidence one"], "answer": 3, "why": "Detectors often output many boxes for one object. NMS keeps the best-scoring box and drops others that overlap it above an IoU threshold. It does not change resolution or create masks."},
  {"q": "After three stacked 3x3 convolutions (stride 1), how large a region of the input can one output neuron see?", "options": ["9 x 9", "7 x 7", "5 x 5", "3 x 3"], "answer": 1, "why": "Receptive field = 1 + 3 x (3 - 1) = 7, so 7 x 7. 9 x 9 wrongly multiplies 3 x 3; 5 x 5 is what you get after only two layers."}
]
```

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
