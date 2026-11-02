// Phase 16: Neural Networks & Transformer Internals (deep dive)
// Every topic lists examRefs = NCA-GENL question bank ids (02-neural-networks-and-transformers.md) it teaches.
export default {
  id: 'architecture',
  number: 16,
  title: 'Neural Networks & Transformer Internals: Deep Dive',
  titleSi: 'Neural Networks සහ Transformer ඇතුළත: neuron එකේ ඉඳන් MoE, Mamba, Diffusion දක්වා ගැඹුරින්',
  summary: 'Phase 3 සහ 5 වලදී ඔයා neural networks සහ Transformers වල මූලික අදහස් ඉගෙන ගත්තා. මේ phase එකේදී අපි ඒ engine එකේ bonnet එක ඇරලා හැම කොටසක්ම ගලවලා බලනවා: parameters ගණන් කරන හැටි, attention tensors වල shapes, RMSNorm, SwiGLU, RoPE, GQA, FlashAttention, scaling laws, MoE, Mamba, ViT සහ diffusion. ගණන් හැම එකක්ම වචන වලින් පියවරෙන් පියවර කරනවා. අරමුණ: NCA-GENL exam එකේ architecture ප්‍රශ්න කටපාඩම් නැතුව, තේරුම් අරන් උත්තර දෙන්න පුළුවන් වෙන එක.',
  duration: 'සති 4-6',
  topics: [
    // 1
    {
      id: 'neuron-and-nonlinearity',
      title: 'Artificial Neuron, Activations සහ Nonlinearity අවශ්‍ය ඇයි',
      examRefs: ['NN-001', 'NN-002', 'NN-003', 'NN-004', 'NN-005', 'NN-006', 'NN-014', 'NN-139'],
      body: [
        'Fully connected layer එකක එක artificial neuron එකක් කරන්නේ දේවල් දෙකයි. පළමුව, inputs හැම එකක්ම තමන්ගේ weight එකෙන් ගුණ කරලා එකතු කරනවා, ඊට bias එකක් එකතු කරනවා. ඒකට කියන්නේ z = w·x + b කියලා. w කියන්නේ weights, x කියන්නේ inputs, b කියන්නේ bias. දෙවනුව, ඒ z එක activation function එකක් හරහා යවනවා (උදා: ReLU). ඔච්චරයි. Max එක ගන්න එක (max-pooling), softmax, table එකකින් row එකක් ගන්න එක (embedding lookup) කියන්නේ neuron එක නෙවෙයි, වෙනම operations.',
        'Activation එක නැත්නම් මොකද වෙන්නේ? Linear layer එකක් කියන්නේ "ගුණ කරලා එකතු කරන" වැඩක්. Linear වැඩ දෙකක් එක පිට එක කළාමත් ලැබෙන්නේ තවත් එකම linear වැඩක්. ඉතින් layers 10ක් activations නැතුව stack කළොත් ඒ ඔක්කොම එකම එක linear layer එකකට සමානයි. Depth එකෙන් කිසිම අමතර බලයක් නෑ. Output එක 0-1 අතරට සීමා වෙන්නේත් නෑ, gradients පුපුරන්නෙත් නෑ: ප්‍රශ්නය "වක්‍ර (curves) ඉගෙන ගන්න බෑ" කියන එකයි.',
        'ප්‍රධාන activations: ReLU = max(0, x), ඒ කියන්නේ positive නම් එහෙම්මම, negative නම් 0. ලාභයි, positive පැත්තේ saturate වෙන්නේ නෑ. Sigmoid = 1/(1+e^(−x)), output එක හැමවිටම 0ත් 1ත් අතර, ඒ නිසා binary probability එකකට සහ LSTM gates වලට ගැළපෙනවා. tanh = output එක −1ත් 1ත් අතර, zero-centered (මැද 0). ඒ නිසා sigmoid ට වඩා hidden layers වල updates සමබරයි, ඒත් ලොකු |x| වලදී tanh ත් saturate වෙනවා, ReLU ට වඩා මිලත් වැඩියි. GELU = x · Φ(x), Φ කියන්නේ Gaussian CDF එක (සාමාන්‍ය bell curve එකේ "මෙතෙක් එකතුව"). GELU කියන්නේ smooth ReLU එකක් වගේ, BERT සහ GPT-2 FFN වල තියෙන්නේ මේක.',
        'Dying ReLU: ReLU neuron එකක pre-activation (z) එක හැම training example එකකටම negative වුණොත්, output එකත් 0, gradient එකත් 0. එතකොට ඒ neuron එක ආයේ කවදාවත් ඉගෙන ගන්නේ නෑ, "මැරිලා". ලොකු learning rate එකක් හෝ නරක bias එකක් නිසා මේක වෙන්න පුළුවන්. Leaky ReLU (negative පැත්තට පොඩි slope එකක්) මේකට එක විසඳුමක්. Mode collapse කියන්නේ GAN ප්‍රශ්නයක්, neuron ප්‍රශ්නයක් නෙවෙයි.',
        'Superposition (interpretability අදහසක්): LLM එකක එක neuron එකක් බොහෝ විට එකිනෙකට සම්බන්ධ නැති concepts කිහිපයකට react කරනවා (polysemantic). හේතුව: model එකට ඉගෙන ගන්න ඕනේ features ගණන, dimensions ගණනට වඩා ගොඩක් වැඩියි. Features ගොඩක් sparse (කලාතුරකින් active) නිසා, ඒවා එකිනෙක මත වැටෙන directions වල "හිර කරලා" ගබඩා කරනවා. ඒ නිසා concept එකක් = neuron එකක් නෙවෙයි. Sparse autoencoders පාවිච්චි කරලා මේ activations ආයේ තේරුම් ගන්න පුළුවන් (monosemantic) features වලට කඩනවා.',
      ],
      analogy: 'Neuron එකක් හරියට A/L results වලින් university entrance එකට Z-score එකක් හදනවා වගේ: විෂය හැම එකකටම බරක් (weight) දීලා එකතු කරනවා, cut-off එකකට (bias) සසඳනවා, අන්තිමට "ඇතුළට / නෑ" කියලා තීරණයක් (activation) ගන්නවා. Activation නැති layers ගොඩක් කියන්නේ කැල්කියුලේටරයේ "× 2" බොත්තම 10 පාරක් එබුවා වගේ: ඒක එක පාරක් "× 1024" එබුවාට සමානයි. අලුත් හැඩයක් එන්නේ නෑ.',
      example: 'Inputs දෙකක්: x = (2, −1), weights w = (0.5, 1.5), bias b = 0.2. z = 2×0.5 + (−1)×1.5 + 0.2 = 1.0 − 1.5 + 0.2 = −0.3. ReLU(−0.3) = 0. Sigmoid(−0.3) ≈ 0.43. tanh(−0.3) ≈ −0.29. දැන් activations නැති layers දෙකක්: පළමු layer එක "× 3", දෙවෙනි එක "× 2 + 1" නම්, එකට ගත්තාම y = 2(3x) + 1 = 6x + 1. තවමත් කෙළින් ඉරක්. Layer දෙකක් දැම්මට ලැබුණේ එක layer එකකින් ලැබෙන දේම යි.',
      keyPoints: [
        'Neuron = weighted sum + bias, ඊට පස්සේ activation (z = w·x + b → f(z)).',
        'Nonlinearity නැත්නම් layers කීයක් තිබ්බත් එකම linear layer එකකට සමානයි.',
        'ReLU = max(0,x); Sigmoid = (0,1); tanh = (−1,1) zero-centered; GELU = x·Φ(x) (BERT, GPT-2).',
        'Dying ReLU = z හැමවිටම negative නිසා output සහ gradient 0 වෙලා neuron එක ඉගෙන ගන්න එක නවතිනවා.',
        'Superposition = dimensions වලට වඩා features ගොඩක් ගබඩා කරන නිසා neurons polysemantic වෙනවා.',
      ],
      terms: [
        { en: 'Artificial Neuron', si: 'Inputs වල weighted sum එකට bias එකතු කරලා activation එකක් දාන පොඩි ගණන් ඒකකය.' },
        { en: 'Affine / Linear Map', si: 'ගුණ කරලා එකතු කරන වැඩක් (Wx + b). දෙකක් එකට කළාමත් තවත් affine එකක්.' },
        { en: 'GELU', si: 'x × Gaussian CDF. Smooth ReLU එකක් වගේ. BERT, GPT-2 FFN වල.' },
        { en: 'Saturation', si: 'Input එක ලොකු වුණාම activation එක පැතලි වෙලා gradient එක 0 ට කිට්ටු වෙන එක (sigmoid, tanh).' },
        { en: 'Polysemantic Neuron', si: 'එකිනෙකට සම්බන්ධ නැති concepts කිහිපයකට react කරන neuron එකක්.' },
        { en: 'Sparse Autoencoder (SAE)', si: 'Activations තේරුම් ගන්න පුළුවන් features ගොඩකට කඩන්න පාවිච්චි කරන network එකක්.' },
      ],
    },

    // 2
    {
      id: 'gradient-flow-and-init',
      title: 'Vanishing Gradients, Weight Initialization සහ Residual Scaling',
      examRefs: ['NN-008', 'NN-050', 'NN-067', 'NN-068', 'NN-109'],
      body: [
        'Backpropagation වලදී output එකේ ඉඳන් පළමු layer එකට එන gradient එක, layers හැම එකකම derivatives එකට ගුණ කරලා හැදෙන එකක් (chain rule). එක් එක් derivative එක 1 ට වඩා පොඩි නම්, ගුණ කරන තරමට අංකය හැකිලෙනවා. මේකට කියන්නේ vanishing gradients. ප්‍රතිඵලය: මුල් layers වල weights කිසිම වෙනසක් නැතුව "කැටි වෙලා" තියෙනවා. Exploding gradients කියන්නේ විරුද්ධ දේ: derivatives 1 ට වඩා ලොකු නම් අංකය පුපුරලා, updates අවුල් වෙනවා.',
        'Sigmoid එකේ derivative එක = σ(x)(1 − σ(x)). σ(x) කියන්නේ sigmoid output එක. මේක උපරිම වෙන්නේ x = 0 දී, එතකොට σ = 0.5, ඉතින් derivative = 0.5 × 0.5 = 0.25. ඒ කියන්නේ හොඳම අවස්ථාවේදීත් sigmoid layer එකක් gradient එක හතරෙන් එකකට අඩු කරනවා. ReLU එකේ derivative එක positive inputs වලට හරියටම 1. ඒ නිසා ReLU deep networks වලට ගොඩක් හොඳයි.',
        'Weight initialization: හැම weight එකක්ම 0 හෝ 1 වගේ එකම අංකයක් දැම්මොත් neurons ඔක්කොම එකම දේ ගණනය කරනවා, එකම gradient ලබනවා, කවදාවත් වෙනස් වෙන්නේ නෑ (symmetry breaking වෙන්නේ නෑ). ඒ නිසා random init ඕනේ, ඒත් හරි ප්‍රමාණයට. He (Kaiming) init: variance = 2 / fan_in (fan_in = neuron එකකට එන inputs ගණන). "2" එක එන්නේ ReLU එක inputs වලින් බාගයක් 0 කරන නිසා ඒක වන්දි ගෙවන්න. Xavier/Glorot init: tanh වගේ සමමිතික (symmetric) activations වලට.',
        'Residual-scaled init (GPT-2): Transformer එකක හැම block එකක්ම තමන්ගේ output එක residual stream එකට එකතු කරනවා. Random අංක N ගණනක් එකතු කළාම variance එක N ගුණයක් වැඩි වෙනවා. ඉතින් depth එක වැඩි වෙද්දී stream එකේ scale එක ලොකු වෙනවා. GPT-2 මේකට residual branch එකේ output projections වල init එක 1/√N වලින් පොඩි කරනවා (N = residual layers ගණන). එතකොට init වෙලාවේ stream එකේ scale එක ස්ථාවරයි.',
      ],
      analogy: 'Chinese whispers (කනින් කනට කතාව) game එක හිතන්න. හැම කෙනෙක්ම අහපු දෙයින් හතරෙන් එකක් විතරක් ඊළඟ කෙනාට කියනවා නම් (sigmoid 0.25), දහ දෙනෙක් ගියාම මුල් පණිවිඩයෙන් ඉතුරු වෙන්නේ මිලියනයෙන් පංගුවක් විතරයි. ReLU කියන්නේ positive පණිවිඩය සම්පූර්ණයෙන්ම (× 1) ඉස්සරහට දෙන කෙනෙක්.',
      example: 'Sigmoid layers 10ක්, හැම එකකම derivative එක උපරිම 0.25, weights ≈ 1 කියලා හිතමු. පළමු layer එකට එන gradient factor = 0.25 දස වතාවක් ගුණ කිරීම. 0.25² = 0.0625, 0.25⁴ ≈ 0.0039, 0.25⁸ ≈ 0.0000153, 0.25¹⁰ ≈ 0.00000095 ≈ 9.5 × 10⁻⁷. ඒ කියන්නේ ආසන්න වශයෙන් මිලියනයකින් එකක් (10⁻⁶). වැරදි උත්තරයක් වෙන 0.025 එන්නේ 0.25 × 0.1 කියලා වැරදියට ගුණ කළොත්. He init උදාහරණය: fan_in = 512 නම් variance = 2/512 ≈ 0.0039, standard deviation = √0.0039 ≈ 0.0625.',
      keyPoints: [
        'Vanishing gradients = පොඩි derivatives ගොඩක් ගුණ වෙලා මුල් layers වලට gradient එකක් එන්නේ නැති එක.',
        'Sigmoid derivative උපරිමය 0.25. Layers 10 → 0.25¹⁰ ≈ 10⁻⁶.',
        'He init = variance 2/fan_in, ReLU වලට. Xavier = tanh වගේ symmetric activations වලට.',
        'සියල්ල 0 / එකම අගයට init කළොත් symmetry කැඩෙන්නේ නෑ.',
        'GPT-2: residual output projections 1/√N වලින් scale කරලා stream variance වර්ධනය පාලනය කරනවා.',
      ],
      terms: [
        { en: 'Chain Rule', si: 'Layers හරහා derivatives එකට ගුණ කරලා gradient එක හදන නීතිය.' },
        { en: 'Exploding Gradients', si: 'Gradients ගුණ වෙලා ඉතා ලොකු වෙලා training අස්ථාවර වෙන එක.' },
        { en: 'He (Kaiming) Initialization', si: 'Variance 2/fan_in. ReLU networks වල activation variance ස්ථාවරව තියනවා.' },
        { en: 'Xavier / Glorot Initialization', si: 'tanh වගේ symmetric activations වලට හදපු init ක්‍රමය.' },
        { en: 'Fan-in', si: 'එක neuron එකකට එන inputs ගණන.' },
        { en: 'Symmetry Breaking', si: 'Neurons වෙන වෙනම දේවල් ඉගෙන ගන්න random init එකකින් වෙනස් කරන එක.' },
      ],
    },

    // 3
    {
      id: 'cnn-weight-sharing',
      title: 'CNNs: Output Size, Weight Sharing සහ Receptive Field',
      examRefs: ['NN-009', 'NN-019', 'NN-043', 'NN-112'],
      body: [
        'Convolution layer එකක පොඩි kernel එකක් (උදා: 3×3 හෝ 5×5) image එක උඩින් ලිස්සලා යනවා. ඒ kernel එකේ weights ම image එකේ හැම තැනකටම පාවිච්චි කරනවා. මේකට weight sharing කියනවා. Dense (fully connected) layer එකක හැම output pixel එකක්ම හැම input pixel එකකටම වෙනම weight එකකින් සම්බන්ධයි. ඒ නිසා CNN එකකට parameters ගොඩක් අඩුයි. Pooling layers වලට learned weights නෑ, ඒවා weights "තියාගන්නේ" නෑ.',
        'Weight sharing නිසා ලැබෙන තව වාසියක්: translation equivariance. බළලා image එකේ වම් පැත්තේ හිටියත් දකුණු පැත්තේ හිටියත් එකම kernel එක එකම විදිහට react කරනවා, response එක පමණක් ඒ තැනට මාරු වෙනවා. Local receptive field එකයි, weight sharing එකයි කියන්නේ CNN එකේ "inductive biases" (කලින්ම දාපු උපකල්පන). ViT ට මේවා නැති හැටි පස්සේ topic එකක බලමු.',
        'Output size formula: Output = (N − K + 2P) / S + 1. N = input size, K = kernel size, P = padding (එක පැත්තකට), S = stride. "+1" අමතක කළොත් එක අඩුවෙන් වැරදි උත්තරයක් එනවා. Input size එකම තියාගන්න ඕනේ නම් ("same" padding), stride 1 වලදී P = (K − 1)/2.',
        'Receptive field සහ long-range: 3-wide convolution layer එකක් එක පාරකට බලන්නේ අසල්වැසි tokens 3ක් විතරයි. Layers stack කරද්දී receptive field එක layer එකකට ටිකෙන් ටික වැඩි වෙනවා. Tokens 1,000ක් දුර සම්බන්ධයක් අල්ලන්න layers සිය ගණනක් (හෝ dilation) ඕනේ. Self-attention එකේ ඕනෑම tokens දෙකක් අතර path length එක 1යි: එක layer එකකින්ම කෙළින්ම සම්බන්ධ වෙනවා. CNNs වලට text process කරන්න බැරි නෑ (TextCNN, ByteNet), ප්‍රශ්නය දුර විතරයි.',
      ],
      analogy: 'Keells එකේ security officer කෙනෙක් torch එකක් (kernel) අරන් car park එක පුරා එකම විදිහට check කරනවා. හැම slot එකකටම වෙනම officer කෙනෙක් (dense layer) දාන්නේ නෑ. එක officer, එක check-list, ඕනෑම තැනක. ඒක weight sharing. ඒත් officer ට එක පාරකට පේන්නේ ළඟ slots 3ක් විතරයි. Car park එකේ අනිත් කෙළවර බලන්න ගොඩක් ඇවිදින්න ඕනේ (layers ගොඩක්). Attention කියන්නේ CCTV control room එක: ඕනෑම slot එකක් එකපාරටම පේනවා.',
      example: 'Output size: 32×32 single-channel image එකක්, 5×5 kernel, stride 1, padding 0. (32 − 5 + 0)/1 + 1 = 27 + 1 = 28. ඉතින් output 28×28. 32×32 තියාගන්න නම් padding = (5−1)/2 = 2 ඕනේ: (32 − 5 + 4)/1 + 1 = 32. Parameter වෙනස: RGB 224×224 image එකකට 3×3 conv, output channels 64: weights = 3×3×3×64 = 1,728, bias 64, එකතුව 1,792. ඒ input එකම (224×224×3 = 150,528 අගයන්) neurons 64ක dense layer එකකට දැම්මොත් weights = 150,528 × 64 ≈ 9.6 මිලියනයක්.',
      keyPoints: [
        'Weight sharing = එකම පොඩි kernel එක හැම තැනකටම. Parameters ගොඩක් අඩුයි.',
        'Weight sharing → translation equivariance. Locality + sharing = CNN inductive bias.',
        'Output = (N − K + 2P)/S + 1. "+1" අමතක කරන්න එපා.',
        'CNN receptive field එක layer එකකට ටිකක් වැඩි වෙනවා. Attention = ඕනෑම දුරකට path length 1.',
      ],
      terms: [
        { en: 'Kernel / Filter', si: 'Image එක උඩින් ලිස්සන පොඩි weights matrix එක.' },
        { en: 'Stride', si: 'Kernel එක එක පාරකට පනින pixels ගණන.' },
        { en: 'Padding', si: 'Image එකේ දාරවලට 0 pixels එකතු කරන එක, size එක පාලනය කරන්න.' },
        { en: 'Translation Equivariance', si: 'Input එකේ දෙයක් මාරු කළාම output එකත් ඒ විදිහටම මාරු වෙන ගුණය.' },
        { en: 'Receptive Field', si: 'Output අගයක් "දකින" input කොටසේ ප්‍රමාණය.' },
        { en: 'Inductive Bias', si: 'Architecture එකට කලින්ම දාලා තියෙන උපකල්පන (locality වගේ).' },
      ],
    },

    // 4
    {
      id: 'rnn-to-transformer',
      title: 'RNN, LSTM, GRU, Seq2seq සහ Transformers ඒවා අයින් කළේ ඇයි',
      examRefs: ['NN-015', 'NN-016', 'NN-017', 'NN-018', 'NN-020', 'NN-034', 'NN-095', 'NN-096', 'NN-097'],
      body: [
        'RNN එකක විශේෂත්වය: hidden state එකක් තියෙනවා. Sequence එකේ හැම step එකකදීම එකම weights පාවිච්චි කරලා, අලුත් input එකයි පරණ hidden state එකයි එකතු කරලා අලුත් hidden state එකක් හදනවා. ඒක තමයි RNN එකේ "මතකය". LSTM එකට gates තුනක් තියෙනවා: forget (පරණ දේ කොච්චර අමතක කරන්නද), input (අලුත් දේ කොච්චර ලියන්නද), output (මොනවද පිටට පෙන්නන්නේ). Update සහ reset gates කියන්නේ GRU එකේ. GRU එක cell state එකයි hidden state එකයි එකක් කරලා gates දෙකක් විතරක් පාවිච්චි කරන නිසා LSTM ට වඩා parameters අඩුයි, ඒත් long-range dependencies තවමත් හොඳට අල්ලනවා.',
        'LSTM එක vanishing gradients වලට ඔරොත්තු දෙන්නේ ඇයි? Cell state එක update වෙන්නේ එකතු කිරීමෙන් (additive): c_t = f_t ⊙ c_(t−1) + i_t ⊙ c̃_t. මෙතන f_t = forget gate, i_t = input gate, c̃_t = අලුත් candidate අගය, ⊙ = element-wise ගුණ කිරීම. Forget gate එක 1 ට කිට්ටුව තිබ්බොත්, gradient එක squashing නැතුව කාලය හරහා පස්සට ගලනවා. LSTM gates වල තියෙන්නේ sigmoid, ReLU නෙවෙයි.',
        'Seq2seq bottleneck: මුල් RNN encoder–decoder translation models වල මුළු source වාක්‍යයම එක fixed-length vector එකකට හිර කළා. Decoder එකට පෙනුණේ encoder එකේ අන්තිම hidden state එක විතරයි. දිග වාක්‍ය වලදී තොරතුරු නැති වුණා. Bahdanau attention මේක විසඳුවා: decoder එක හැම output step එකකදීම encoder hidden states ඔක්කොම score කරලා, softmax කරලා, weighted context vector එකක් හදනවා. Teacher forcing: training වලදී decoder එකට input විදිහට දෙන්නේ model එකේම prediction එක නෙවෙයි, ඇත්ත (ground-truth) කලින් token එක. වේගවත්, ස්ථාවරයි. අවාසිය exposure bias: inference වලදී model එකට තමන්ගේම (සමහර විට වැරදි) outputs කන්න වෙනවා.',
        'Transformers RNNs අයින් කළේ ඇයි: RNN එකක step t ගණනය කරන්න step t−1 ඉවර වෙන්න ඕනේ. ඒ නිසා GPU එකේ parallel බලය නාස්ති වෙනවා. Self-attention training වලදී හැම position එකක්ම එකවර ගණනය කරනවා, දුර tokens එක step එකකින් සම්බන්ධ කරනවා. Teacher forcing + causal mask එක්ක transformer එකක හැම position එකක්ම එක forward pass එකකින් train වෙනවා. මේ අදහස ආවේ 2017 Vaswani et al. ගේ "Attention Is All You Need" paper එකෙන් (BERT 2018, seq2seq paper එක LSTM පාවිච්චි කළා). සැලකිය යුතුයි: transformers වලට positional information අනිවාර්යයෙන් ඕනේ, attention එක order දන්නේ නැති නිසා.',
      ],
      analogy: 'RNN එක හරියට කොළඹ ඉඳන් මහනුවරට bus එකක් එක halt එකක් ගානේ නවත්තලා යනවා වගේ: ඊළඟ halt එකට යන්න කලින් එක ඉවර වෙන්න ඕනේ. Transformer එක හරියට එකම වෙලාවේ තැන් ගොඩකට tuk-tuks ගොඩක් යවනවා වගේ. Teacher forcing කියන්නේ driving lesson එකක instructor වැරදි turn එකක් ගත්ත ගමන් steering එක හරි පැත්තට හරවලා දෙනවා වගේ. Test එකේදී (inference) instructor නෑ, ඔයාගේ වැරදි ඔයාටම බාර ගන්න වෙනවා (exposure bias).',
      example: 'වචන 50ක වාක්‍යයක් translate කරනවා. RNN encoder එකට steps 50ක් එකින් එක යන්න ඕනේ. Transformer encoder එක 50 × 50 = 2,500 attention scores එක matrix multiplication එකකින් එකවර ගණනය කරනවා. Teacher forcing උදාහරණය: target එක "මම ගෙදර යනවා". Step 2 දී model එක "මම පාසල්" කියලා වැරදියට predict කළත්, step 3 එකට input විදිහට දෙන්නේ ඇත්ත token එක "ගෙදර". LSTM forget gate උදාහරණය: f = 0.99 නම් steps 100කට පස්සේ පරණ cell අගයෙන් 0.99¹⁰⁰ ≈ 0.37ක් ඉතුරුයි. Sigmoid chain එකක 0.25¹⁰⁰ කියන්නේ ප්‍රායෝගිකව බිංදුවයි.',
      keyPoints: [
        'RNN = step-by-step update වෙන hidden state එකක්, හැම step එකකටම එකම weights.',
        'LSTM gates: forget, input, output. GRU gates: update, reset (gates 2, parameters අඩුයි).',
        'LSTM cell state එක additive update වෙන නිසා gradients දිගු කාලයක් ජීවත් වෙනවා.',
        'Seq2seq bottleneck = මුළු වාක්‍යයම එක vector එකක. Bahdanau attention = හැම step එකකම encoder states වල weighted mix එකක්.',
        'Transformers ජයගත්තේ training වලදී හැම position එකක්ම parallel ගණනය කරන නිසා. Teacher forcing → exposure bias.',
      ],
      terms: [
        { en: 'Hidden State', si: 'RNN එක step එකෙන් step එකට ඉස්සරහට ගෙනියන මතක vector එක.' },
        { en: 'Cell State', si: 'LSTM එකේ දිගුකාලීන මතකය ගෙනියන වෙනම "conveyor belt" එක.' },
        { en: 'GRU', si: 'Update සහ reset gates දෙකක් පමණක් ඇති සරල LSTM වර්ගය.' },
        { en: 'Bahdanau Attention', si: 'Decoder එක හැම step එකකදීම encoder states ඔක්කොම weighted විදිහට බලන මුල් attention ක්‍රමය.' },
        { en: 'Teacher Forcing', si: 'Training වලදී decoder එකට ඇත්ත කලින් token එක input එක විදිහට දෙන එක.' },
        { en: 'Exposure Bias', si: 'Training වලදී ඇත්ත tokens දැකලා, inference වලදී තමන්ගේ වැරදි outputs දකින විට එන ගැටලුව.' },
      ],
    },

    // 5
    {
      id: 'attention-mechanics',
      title: 'Scaled Dot-Product Attention, Multi-Head, Cross-Attention සහ Induction Heads',
      examRefs: ['NN-021', 'NN-022', 'NN-023', 'NN-025', 'NN-026', 'NN-027', 'NN-038', 'NN-085', 'NN-086', 'NN-138'],
      body: [
        'Formula එක: Attention = softmax(QKᵀ / √d_k) V. වචන වලින්: (1) හැම Query එකක්ම හැම Key එකක් එක්කම dot product කරලා score එකක් ගන්නවා. (2) Scores √d_k වලින් බෙදනවා (d_k = head එකක key vector එකේ දිග). (3) Key dimension එක දිගේ softmax දානවා, එතකොට එක query එකක scores row එක probability distribution එකක් වෙනවා: හැම row එකකම එකතුව 1යි. Weights soft (0 සහ 1 විතරක් නෙවෙයි). Q සහ K වෙනම projections නිසා matrix එක සමමිතික (symmetric) නෑ. (4) ඒ weights වලින් Values වල weighted sum එක ගන්නවා. Query = "මම හොයන දේ", Key = "මගේ label එක", Value = "ඇත්තටම mix වෙන content එක". Content එක එන්නේ Value වලින්, Query වලින් නෙවෙයි.',
        '√d_k වලින් බෙදන්නේ ඇයි? Q සහ K components variance 1 නම්, d_k-dimensional vectors දෙකක dot product එකේ variance එක d_k. ඒ කියන්නේ d_k ලොකු වෙද්දී scores ලොකු වෙනවා, softmax එක එක්කෙනෙක්ට 1 දීලා අනිත් අයට 0 දෙන (one-hot වගේ) saturated තත්ත්වයකට යනවා, gradients ඉතා පොඩි වෙනවා. √d_k වලින් බෙදුවාම variance එක ආයේ 1 ට එනවා. Probabilities බවට හරවන්නේ softmax, scaling එක නෙවෙයි.',
        'Self vs Cross attention: Self-attention වලදී Q, K, V තුනම එකම input sequence එකේ learned projections තුනකින් (W_Q, W_K, W_V) හදනවා. Cross-attention වලදී (encoder–decoder model එකක decoder එකේ) Queries එන්නේ decoder එකෙන්, Keys සහ Values එන්නේ encoder output එකෙන්. Decoder එක source වාක්‍යය ගැන "ප්‍රශ්න අහනවා". Original encoder–decoder transformer එකේ decoder block එකක attention sublayers දෙකක් තියෙනවා: masked self-attention සහ cross-attention, ඊට පස්සේ FFN. GPT වගේ decoder-only block එකක තියෙන්නේ masked self-attention එක විතරයි.',
        'Multi-head attention: d_model එක heads h ගණනකට සමානව බෙදනවා. හැම head එකකටම තමන්ගේම projections, ඒ නිසා එක head එකක් syntax, තව එකක් coreference ("එයා" = කවුද) වගේ වෙනස් සම්බන්ධතා වෙනම subspaces වල බලනවා. Outputs concatenate කරලා W_O හරහා project කරනවා. Heads වලට බෙදුවට n² cost එක වෙනස් වෙන්නේ නෑ, attention linear වෙන්නෙත් නෑ.',
        'Induction heads (interpretability): train කරපු models වල heads සමහරක් ඉගෙන ගන්නවා "[A][B] ... [A] → [B]" කියන pattern එක: current token එක කලින් ආපු තැනක් හොයලා, ඊට පස්සේ ආපු token එක predict කරනවා. මේක layers දෙකක circuit එකක් (previous-token head එකක් + matching head එකක්). Training වලදී මේවා හදිසියේම මතු වෙනවා, in-context learning හැකියාවේ jump එකක් එක්කම. Causal mask එක fixed operation එකක්, learned head behaviour එකක් නෙවෙයි.',
      ],
      analogy: 'Cargills එකේ customer service desk එකක් හිතන්න. ඔයාගේ ප්‍රශ්නය (Query) "මට lactose-free කිරි ඕනේ". Shelf labels (Keys) එක්ක ගළපලා, ගැළපෙන shelves වලින් බඩු (Values) අරන් දෙනවා. Multi-head කියන්නේ staff 12 දෙනෙක් එකම ප්‍රශ්නය මිල, brand, expiry date කියන කෝණ වලින් බලලා results එකට දාන එක. Cross-attention කියන්නේ translator කෙනෙක් ඉංග්‍රීසි වාක්‍යය ලියද්දී (decoder) සිංහල original එක (encoder) දිහා ආයේ ආයේ බලනවා වගේ.',
      example: 'Head dimension: d_model = 768, heads 12 → 768/12 = 64. (768 කියන්නේ මුළු පළල, 768 × 12 = 9,216 කියන්නේ බෙදනවා වෙනුවට ගුණ කරපු වැරැද්ද.) √d_k = √64 = 8. Scores: query එකක් keys තුනක් එක්ක raw dot products 16, 8, 0 නම්, 8 න් බෙදුවාම 2, 1, 0. Softmax: e² ≈ 7.39, e¹ ≈ 2.72, e⁰ = 1, එකතුව ≈ 11.11. Weights ≈ 0.67, 0.24, 0.09 (එකතුව 1). Scale නොකළා නම් softmax(16, 8, 0) ≈ 0.9997, 0.0003, 0.0000 වගේ one-hot එකක්. Induction head උදාහරණය: "Harry Potter ... Harry" දැක්කාම ඊළඟට "Potter" ට ඉහළ probability.',
      keyPoints: [
        'Attention = softmax(QKᵀ/√d_k)V. Softmax එකෙන් පස්සේ හැම row එකක්ම එකතුව 1.',
        '√d_k scaling = dot product variance d_k → 1. Softmax saturation වළක්වනවා.',
        'Self-attention: Q,K,V එකම sequence එකෙන්. Cross-attention: Q decoder එකෙන්, K,V encoder එකෙන්.',
        'Head dim = d_model / heads (768/12 = 64). Heads = වෙනස් සම්බන්ධතා වෙනම subspaces වල.',
        'Encoder–decoder decoder block = masked self-attn + cross-attn + FFN. Induction heads = [A][B]…[A]→[B].',
      ],
      terms: [
        { en: 'Query / Key / Value', si: 'හොයන දේ / label එක / mix වෙන content එක. එකම input එකේ learned projections තුනක්.' },
        { en: 'Cross-Attention', si: 'Decoder queries වලින් encoder keys/values බලන attention.' },
        { en: 'W_O (Output Projection)', si: 'Heads concatenate කළාට පස්සේ d_model එකට ආයේ mix කරන matrix එක.' },
        { en: 'Permutation', si: 'පිළිවෙළ මාරු කිරීම. Attention එකට පිළිවෙළ තනියම තේරෙන්නේ නෑ.' },
        { en: 'Induction Head', si: 'කලින් pattern එකක් හොයලා ඊළඟ token එක copy කරන attention head circuit එකක්.' },
        { en: 'In-Context Learning', si: 'Weights වෙනස් නොකර prompt එකේ උදාහරණ වලින් ඉගෙන ගන්න හැකියාව.' },
      ],
    },

    // 6
    {
      id: 'attention-shapes-pytorch',
      title: 'Attention Tensor Shapes, Masks, Memory සහ PyTorch Gotchas',
      examRefs: ['NN-024', 'NN-037', 'NN-054', 'NN-055', 'NN-060', 'NN-061', 'NN-091', 'NN-092', 'NN-106', 'NN-107', 'NN-108', 'NN-111'],
      body: [
        'Shapes පියවරෙන් පියවර (B = batch, H = heads, T = sequence length, d = head_dim): q, k, v හැම එකක්ම (B, H, T, d). Scores = q @ k.transpose(−2, −1). (…, T, d) × (…, d, T) = (…, T, T). ඉතින් scores (B, H, T, T): හැම head එකකටම query–key යුගල හැම එකකටම score එකක්. Softmax එකෙන් පස්සේ weights @ v = (B, H, T, T) × (B, H, T, d) = (B, H, T, d). ඊට පස්සේ transpose කරලා (B, T, H, d), flatten කරලා (B, T, H·d) = (B, T, d_model), අන්තිමට W_O. Heads concatenate කරනවා, average කරන්නේ නෑ.',
        'Complexity සහ memory: හැම query එකක්ම හැම key එකක් එක්ක සසඳන නිසා score matrix එක n × n, ඒ කියන්නේ O(n²). FFN එක token එකකට වෙනම නිසා O(n). Context එක දෙගුණ කළොත් (4K → 8K) score matrix එක 2² = 4 ගුණයක් වෙනවා, FFN cost එක 2 ගුණයක් විතරයි. Heads 8 සිට 16 කළත් (d_model එකම), projections තවමත් d_model × d_model, parameters වෙනස් නෑ, head_dim බාගයක් වෙනවා. ඒත් score matrices ගණන දෙගුණයි, ඒ නිසා score memory වැඩි වෙනවා.',
        'Masks දෙකක් තියෙනවා. Causal mask: decoder-only model එකක position එකකට පස්සෙන් එන tokens බලන්න නොදී answer leak එක නවත්වනවා. Code එකේ torch.triu(ones, diagonal=1) කියන්නේ diagonal එකට උඩින් (key index > query index) True. ඒ තැන් −inf කළාම softmax එකෙන් 0 weight. Diagonal එක තියෙන නිසා token එක තමන්ටම attend කරනවා. Padding mask: batch එකේ වාක්‍ය 128 ට pad කළාම, mask නැත්නම් ඇත්ත tokens pad tokens වලට attend කරනවා, padding කොච්චර දැම්මද අනුව representation වෙනස් වෙනවා. Causal mask එක pad tokens හංගන්නේ නෑ (left padding හෝ bidirectional encoder එකක).',
        'PyTorch gotchas: (1) nn.MultiheadAttention වල batch_first default එක False. ඉතින් ඒක බලාපොරොත්තු වෙන්නේ (seq, batch, embed). (32, 100, 512) එකක් (batch, seq, embed) කියලා දුන්නොත් 32 sequence length එක විදිහටත් 100 batch එක විදිහටත් ගන්නවා, error එකක් නැතුවම examples අතර තොරතුරු මිශ්‍ර වෙනවා. (2) embed_dim එක num_heads වලින් බෙදෙන්න ඕනේ: 1000/16 = 62.5 නිසා error. Power of 2 අවශ්‍ය නෑ (768/12 = 64 හරි). (3) F.scaled_dot_product_attention(q, k, v, is_causal=True) කියන්නේ lower-triangular causal mask එක ඇතුළෙම හදලා, FlashAttention වගේ fused kernel එකක් තෝරගන්න PyTorch ට ඉඩ දෙනවා. Padding වලට වෙනම attn_mask, dropout වලට dropout_p.',
      ],
      analogy: 'Score matrix එක හරියට school එකක ළමයි හැමෝම අනිත් හැමෝටම Avurudu card එකක් යවන table එක වගේ. ළමයි 40 නම් cards 1,600යි. ළමයි 80 කළොත් (දෙගුණයි) cards 6,400යි (හතර ගුණයි). Causal mask = "ඔයාට වඩා බාල අයට විතරක් card යවන්න පුළුවන්" කියන නීතියක්. Padding mask = පන්තියේ හිස් පුටු වලට cards යවන්න එපා කියන එක.',
      example: 'Shape ගණනය: q, k (2, 8, 512, 64). q @ kᵀ = (2, 8, 512, 512). (2, 8, 512, 64) එන්නේ weights @ v කළාට පස්සේ. Memory ගණනය: layer එකක් එකයි, heads 32, batch 1, T = 4,096, FP16 (අංකයකට bytes 2). 4,096 × 4,096 = 16,777,216 scores per head. × 32 heads = 536,870,912 scores. × 2 bytes = 1,073,741,824 bytes = හරියටම 1 GiB. ඒ එක layer එකකට විතරයි. Layers 32ක් නම් 32 GiB. FlashAttention මේ matrix එක ගබඩා කරන්නේ නැත්තේ ඒ නිසා.',
      code: {
        lang: 'python',
        src: `import torch, torch.nn.functional as F
B, H, T, d = 2, 8, 6, 64
q = k = v = torch.randn(B, H, T, d)
scores = q @ k.transpose(-2, -1) / d**0.5      # (2, 8, 6, 6)
mask = torch.triu(torch.ones(T, T, dtype=torch.bool), diagonal=1)
w = scores.masked_fill(mask, float('-inf')).softmax(-1)
out = (w @ v).transpose(1, 2).reshape(B, T, H * d)  # (2, 6, 512) heads concat
# එකම දේ fused kernel එකකින්:
out2 = F.scaled_dot_product_attention(q, k, v, is_causal=True)
print(scores.shape, out.shape, w[0, 0].sum(-1))  # හැම row එකම 1
mha = torch.nn.MultiheadAttention(512, 8, batch_first=True)  # batch_first අමතක කරන්න එපා`,
      },
      keyPoints: [
        'q@kᵀ: (B,H,T,d) × (B,H,d,T) = (B,H,T,T). weights@v = (B,H,T,d) → concat → (B,T,d_model).',
        'Attention = O(n²). Context 2× → score matrix 4×. FFN 2× විතරයි.',
        '32 heads × 4096² × 2 bytes = 1 GiB per layer (FP16).',
        'triu(diagonal=1) + −inf = future keys 0 weight. Padding mask වෙනම ඕනේ.',
        'nn.MultiheadAttention: batch_first=False default. embed_dim % num_heads == 0 ඕනේ. SDPA is_causal=True = built-in causal mask.',
      ],
      terms: [
        { en: 'Causal Mask', si: 'Query එකකට පස්සේ තියෙන keys −inf කරලා අනාගතය හංගන mask එක.' },
        { en: 'Padding Mask', si: 'Pad tokens වලට attention 0 කරන mask එක.' },
        { en: 'batch_first', si: 'nn.MultiheadAttention වල (batch, seq, embed) order එක පාවිච්චි කරන්න දාන flag එක. Default False.' },
        { en: 'SDPA', si: 'torch.nn.functional.scaled_dot_product_attention. Fused, වේගවත් attention function එක.' },
        { en: 'GiB', si: '2³⁰ bytes = 1,073,741,824 bytes.' },
      ],
    },

    // 7
    {
      id: 'normalization-and-residuals',
      title: 'LayerNorm, BatchNorm, RMSNorm, Pre-norm vs Post-norm සහ Stability Tricks',
      examRefs: ['NN-010', 'NN-011', 'NN-012', 'NN-013', 'NN-051', 'NN-052', 'NN-069', 'NN-070', 'NN-071', 'NN-093', 'NN-094', 'NN-110', 'NN-128', 'NN-129'],
      body: [
        'Residual connection: y = x + F(x). Block එකේ input එක output එකට එකතු කරනවා (ගුණ කරන්නේ නෑ, concatenate කරන්නෙත් නෑ, concatenate කරන්නේ DenseNet). Inference වලදීත් block එක run වෙනවා. වාසිය: gradients වලට කෙළින්ම යන "identity path" එකක් ලැබෙනවා, ඒ නිසා ගොඩක් deep stacks train කරන්න පුළුවන්.',
        'LayerNorm vs BatchNorm: LayerNorm එක token එකක vector එක තනියම ගන්නවා, ඒ token එකේ features (hidden dimension) හරහා mean සහ variance ගණනය කරනවා. ඒ නිසා batch size එකට හෝ sequence length එකට ඒක රඳා පවතින්නේ නෑ. BatchNorm එක feature එකක් ගානේ batch එක හරහා statistics ගන්නවා. ප්‍රශ්න: පොඩි batches වල statistics ඝෝෂාකාරී (noisy), padding තියෙන variable-length sequences වලදී අමුතුයි, training සහ inference වෙනස් විදිහට හැසිරෙනවා. Batch size 1 එකේ autoregressive inference වලදී batch statistics තේරුමක් නෑ, running averages පාවිච්චි කරන්න වෙනවා, ඒවා ඇත්ත data එකට නොගැළපෙන්න පුළුවන්. BatchNorm එකටත් learnable scale සහ shift parameters තියෙනවා.',
        'RMSNorm: x / √(mean(x²) + ε) · g. වචන වලින්: features වල වර්ග වල සාමාන්‍යයේ වර්ගමූලයෙන් (root mean square) බෙදලා learned gain g එකකින් ගුණ කරනවා. ε කියන්නේ 0 න් බෙදීම වළක්වන පොඩි අංකයක්. LayerNorm එකට වඩා වෙනස: mean එක අඩු කරන්නේ නෑ (re-centering නෑ), bias එකක් නෑ. ටිකක් ලාභයි, quality එක සමානයි. තවමත් per-token, features හරහා. LayerNorm formula එක (x − mean)/std · g + b.',
        'Pre-norm vs Post-norm: Original 2017 transformer එක post-norm: Norm(x + F(x)). GPT-2 සහ LLaMA ඇතුළු අද models pre-norm: x + F(Norm(x)). Pre-norm වලදී residual stream එක කවදාවත් normalize වෙන්නේ නෑ, ඒ නිසා input එකේ ඉඳන් output එකට පිරිසිදු identity path එකක් තියෙනවා, deep models ස්ථාවරයි. Layers 48ක post-norm model එකක් diverge වුණොත් හොඳම විසඳුම pre-norm එකට මාරු වෙන එක. Pre-norm decoder block එකක පිළිවෙළ: Norm → masked self-attention → residual add → Norm → FFN → residual add. Pre-norm models වල අන්තිම block එකට පස්සේ තවත් final norm එකක් LM head එකට කලින් දානවා: stream එක block ඇතුළේ normalize නොවෙන නිසා depth එකත් එක්ක scale එක වැඩි වෙනවා. Vocabulary softmax එක model එකේ උඩම එක පාරක් විතරයි.',
        'Stability tricks: Xiong et al. (2020) පෙන්නුවා post-LN වලදී init වෙලාවේ output එකට ළඟ layers වල gradients ලොකුයි, ඒ නිසා මුලින්ම full learning rate එකක් දුන්නොත් training අවුල් වෙනවා: ඒ නිසා warmup ඕනේ. Pre-LN gradients bounded, warmup ටිකක් හෝ නැතුව train කරන්න පුළුවන්. QK-norm: ලොකු models වල attention logits ඉතා ලොකු වෙලා softmax one-hot වෙලා diverge වෙනවා (attention entropy collapse). Q සහ K dot product එකට කලින් LayerNorm/RMSNorm කළාම magnitude එක සීමා වෙනවා (ViT-22B සහ පසු LLMs). √d_k අයින් කරන එක logits තවත් ලොකු කරනවා, ඒක විසඳුමක් නෙවෙයි. Dropout: original transformer එකේ sublayer outputs වලට residual add එකට කලින් සහ embeddings + positional encodings එකතුවට dropout (base model 0.1). අද ලොකු pretraining runs ගොඩක dropout 0, මොකද huge data එක එක පාරක් යන නිසා overfit වෙන්නේ අඩුවෙන්.',
      ],
      analogy: 'BatchNorm කියන්නේ පන්තියේ ළමයි ඔක්කොගේම ලකුණු වල සාමාන්‍යයට සාපේක්ෂව එක ළමයෙක්ව grade කරනවා වගේ. පන්තියේ ඉන්නේ එක ළමයයි නම් (batch size 1) ඒක තේරුමක් නෑ. LayerNorm කියන්නේ එක ළමයාගේම විෂය 9 ලකුණු වල සාමාන්‍යයට සාපේක්ෂව බලනවා වගේ: පන්තියේ කීදෙනා හිටියත් වැඩ. Pre-norm කියන්නේ main road එක (residual stream) කිසිම tollgate එකක් නැතුව කෙළින්ම යන එක, side roads වලට විතරක් checkpoints.',
      example: 'Token vector එකක් x = (1, 2, 3, 6). LayerNorm: mean = 3, deviations = (−2, −1, 0, 3), variance = (4+1+0+9)/4 = 3.5, std ≈ 1.87. Output ≈ (−1.07, −0.53, 0, 1.60). RMSNorm: x² = (1, 4, 9, 36), mean = 12.5, RMS = √12.5 ≈ 3.54. Output ≈ (0.28, 0.57, 0.85, 1.70). Mean එක අඩු නොකරපු නිසා අගයන් ඔක්කොම positive තියෙනවා. Code reading: x = x + self.attn(self.ln1(x)) කියන්නේ pre-norm. Post-norm නම් x = self.ln1(x + self.attn(x)).',
      code: {
        lang: 'python',
        src: `import torch
x = torch.tensor([1., 2., 3., 6.])
ln = (x - x.mean()) / x.var(unbiased=False).add(1e-5).sqrt()   # LayerNorm (g=1, b=0)
rms = x / x.pow(2).mean().add(1e-5).sqrt()                      # RMSNorm (g=1)
print(ln, rms)
# Pre-norm block (GPT-2, LLaMA):
#   x = x + attn(norm1(x)); x = x + mlp(norm2(x))
# Post-norm block (2017 original):
#   x = norm1(x + attn(x)); x = norm2(x + mlp(x))`,
      },
      keyPoints: [
        'Residual = y = x + F(x), එකතු කිරීම. Gradients වලට කෙළින් path එකක්.',
        'LayerNorm = එක token එකේ features හරහා. BatchNorm = batch එක හරහා, batch 1 / padding වලදී අවුල්.',
        'RMSNorm = x/√(mean(x²)+ε)·g. Mean subtraction නෑ, bias නෑ.',
        'Pre-norm x + F(Norm(x)) (GPT-2, LLaMA) deep models වලට ස්ථාවරයි; අන්තිමට final norm එකක් ඕනේ.',
        'Post-LN → warmup අවශ්‍යයි (Xiong 2020). QK-norm → attention logit explosion නවත්වනවා.',
      ],
      terms: [
        { en: 'Residual Stream', si: 'Blocks හැම එකක්ම තමන්ගේ output එක එකතු කරන ප්‍රධාන vector "මාර්ගය".' },
        { en: 'Running Averages (BatchNorm)', si: 'Inference වලට training වලදී එකතු කරපු mean/variance සාමාන්‍යයන්.' },
        { en: 'Learning Rate Warmup', si: 'Training මුලදී learning rate එක 0 ඉඳන් ටිකෙන් ටික වැඩි කරන එක.' },
        { en: 'QK-Norm', si: 'Dot product එකට කලින් queries සහ keys normalize කරන stability trick එක.' },
        { en: 'Attention Entropy Collapse', si: 'Attention weights එක token එකකට විතරක් එකතු වෙලා softmax one-hot වෙන තත්ත්වය.' },
        { en: 'Residual Dropout', si: 'Residual add එකට කලින් sublayer output එකට දාන dropout.' },
      ],
    },

    // 8
    {
      id: 'ffn-swiglu',
      title: 'Feed-Forward Network, SwiGLU සහ Parallel Blocks',
      examRefs: ['NN-007', 'NN-033', 'NN-072', 'NN-073', 'NN-141'],
      body: [
        'Standard FFN: linear layers දෙකක්, මැද nonlinearity එකක්. d_model එකේ ඉඳන් hidden size එකකට (සාමාන්‍යයෙන් 4 × d_model) පුළුල් කරලා, activation දාලා, ආයේ d_model එකට project කරනවා. හැම token එකකටම එකම weights, වෙනම (position-wise). Tokens අතර තොරතුරු මිශ්‍ර කරන්නේ නෑ, ඒක attention එකේ වැඩේ. Parameters: d × 4d + 4d × d = 8d².',
        'SwiGLU (PaLM, LLaMA): gated linear unit එකක්. Formula: (SiLU(xW₁) ⊙ xW₃) W₂. වචන වලින්: x එක matrices දෙකකින් වෙන වෙනම project කරනවා. එකක් (gate, W₁) SiLU/Swish activation එක හරහා යනවා (SiLU(z) = z × sigmoid(z)). අනිත් එක (up, W₃) එහෙම්මම. ඒ දෙක element-wise ගුණ කරනවා (⊙), gate එක "කොච්චර ඉඩ දෙනවද" කියලා තීරණය කරනවා. අන්තිමට down projection W₂ එකෙන් d_model එකට එනවා. Leaky ReLU, ELU වගේ activations වලට මේ අමතර gating projection එක නෑ.',
        'Hidden size එක 8d/3 ඇයි? SwiGLU එකට matrices තුනක් (gate, up, down), හැම එකක්ම d × h. ඉතින් parameters = 3dh. Standard 4d FFN එකේ 8d² එකට සමාන කරන්න 3dh = 8d², ඒ කියන්නේ h = 8d/3. Down projection එක තවමත් අවශ්‍යයි. LLaMA-7B: d = 4,096 → 8 × 4,096 / 3 ≈ 10,923, hardware එකට ගැළපෙන්න 256 ගුණාකාරයකට වට කරලා 11,008.',
        'Parallel blocks (GPT-J, PaLM): y = x + Attn(Norm(x)) + MLP(Norm(x)). සාමාන්‍ය block එකේ attention ඉවර වෙලා ඊට පස්සේ MLP. Parallel block එකේ දෙකම එකම normalized input එක කියවන නිසා ඒවායේ input matmuls එකට fuse කරන්න පුළුවන්. PaLM ලොකු scale එකේ ආසන්න වශයෙන් 15% වේගවත් training එකක් වාර්තා කළා, quality අඩුවීම ටිකයි. Parameter ගණන වෙනස් නෑ, residuals තවමත් තියෙනවා, attention bidirectional වෙන්නෙත් නෑ.',
      ],
      analogy: 'SwiGLU එක හරියට ගෙදර water tank එකක tap දෙකක් වගේ. එක pipe එකකින් වතුර (up projection) එනවා. අනිත් එක valve එකක් (gate): ඒක කොච්චර ඇරෙනවද කියන එක SiLU එකෙන් තීරණය වෙනවා. වතුර × valve = ඇත්තටම එන ප්‍රමාණය. ඊට පස්සේ down pipe එකෙන් ටැංකියට. Parallel block කියන්නේ කොත්තු කඩේ එක්කෙනෙක් රොටී කපද්දී අනිත් කෙනා එකම වෙලාවේ curry එක හදනවා වගේ: එකින් එක කරනවා වෙනුවට එකවර.',
      example: 'SwiGLU parameter ගණනය: d_model = 4,096, hidden = 11,008, bias නෑ. එක matrix එකක් = 4,096 × 11,008. 4,096 × 11,000 = 45,056,000, 4,096 × 8 = 32,768, එකතුව 45,088,768 ≈ 45.1M. Matrices තුනක් → 3 × 45.1M ≈ 135.3M. (90M එන්නේ matrices දෙකක් විතරක් ගණන් කළොත්.) සසඳන්න: standard FFN 4d = 16,384 hidden: 2 × 4,096 × 16,384 ≈ 134.2M. ආසන්න වශයෙන් සමානයි, ඒක තමයි 8d/3 rule එකේ අරමුණ.',
      code: {
        lang: 'python',
        src: `import torch.nn as nn, torch.nn.functional as F
class SwiGLU(nn.Module):
    def __init__(self, d=4096, h=11008):
        super().__init__()
        self.w1 = nn.Linear(d, h, bias=False)  # gate
        self.w3 = nn.Linear(d, h, bias=False)  # up
        self.w2 = nn.Linear(h, d, bias=False)  # down
    def forward(self, x):
        return self.w2(F.silu(self.w1(x)) * self.w3(x))
print(sum(p.numel() for p in SwiGLU().parameters()))  # 135,266,304`,
      },
      keyPoints: [
        'FFN = expand (4d) → activation → project back. Token එකකට වෙනම, tokens මිශ්‍ර කරන්නේ නෑ.',
        'SwiGLU = (SiLU(xW₁) ⊙ xW₃)W₂. Matrices 3: gate, up, down.',
        'h = 8d/3 කරන්නේ 3dh = 8d² වෙලා standard FFN එකේ parameters ම තියාගන්න.',
        'd=4096, h=11008 SwiGLU ≈ 135M parameters.',
        'Parallel block: attention සහ MLP එකම Norm(x) කියවනවා → matmuls fuse → ~15% වේගවත් (PaLM).',
      ],
      terms: [
        { en: 'Position-wise FFN', si: 'හැම token එකකටම වෙන වෙනම එකම weights වලින් apply කරන feed-forward network එක.' },
        { en: 'SiLU / Swish', si: 'z × sigmoid(z). Smooth activation එකක්.' },
        { en: 'GLU (Gated Linear Unit)', si: 'Projection එකක් තවත් gate projection එකකින් element-wise ගුණ කරන structure එක.' },
        { en: 'Gate / Up / Down Projection', si: 'SwiGLU එකේ matrices තුන. HF configs වල gate_proj, up_proj, down_proj.' },
        { en: 'Parallel Block', si: 'Attention සහ MLP එකවර එකම input එකෙන් ගණනය කරලා residual එකට එකතු කරන block layout එක.' },
      ],
    },

    // 9
    {
      id: 'parameter-counting',
      title: 'Parameters ගණන් කිරීම: Linear, Attention, 12d², Embeddings සහ Weight Tying',
      examRefs: ['NN-035', 'NN-036', 'NN-048', 'NN-053', 'NN-056', 'NN-057', 'NN-058', 'NN-059', 'NN-098'],
      body: [
        'Linear layer එකක parameters = (inputs × outputs) + outputs. Bias එක output feature එකකට එකක්. Exam එකේ සුලභ උගුල්: bias අමතක කරන එක, නැත්නම් bias එක input size එකට ගණන් කරන එක. Attention layer එකක projections හතරක් (Q, K, V, O), හැම එකක්ම d × d (+ bias d). Heads ගණන මේ එකතුව වෙනස් කරන්නේ නෑ, heads කරන්නේ එකම d_model එක බෙදන එක විතරයි.',
        '12d² rule එක: biases සහ norms අමතක කළාම, standard block එකක attention = 4d² (Q, K, V, O), FFN = d × 4d + 4d × d = 8d². එකතුව 12d². Layers L ගණනක් නම් non-embedding parameters ≈ 12 · L · d². 4d² කියන්නේ attention විතරයි, 8d² කියන්නේ FFN විතරයි.',
        'Embedding layer එක: implementation එකේදී (vocab_size, d_model) shape එකේ learned matrix එකක්, token ID එකෙන් row එකක් lookup කරනවා (nn.Embedding). One-hot vector එකක් මේ matrix එකෙන් ගුණ කළාට සමානයි, ඒත් one-hot එක sparse, learn වෙන්නෙත් නෑ. Output layer (LM head): අන්තිම hidden state එක vocab_size logits වලට project කරනවා, softmax එකෙන් next-token distribution එක. Scalar එකක් output කරන්නේ reward model එකක්.',
        'Weight tying: input embedding matrix එකම (transpose කරලා) LM head එක විදිහට පාවිච්චි කරනවා. Parameters ඉතුරුයි, බොහෝ විට quality එකත් හොඳයි (GPT-2). Untied නම් වෙනම copies දෙකක්. ALBERT කරන "හැම layer එකකටම එකම weights" කියන්නේ වෙනම technique එකක් (cross-layer sharing).',
      ],
      analogy: 'Parameter ගණන් කිරීම හරියට ගෙයක tiles ගණන් කරනවා වගේ: කාමරේ දිග × පළල (weights) + skirting tiles පේළිය (bias). Weight tying කියන්නේ school එකේ එකම ශාලාව උදේට assembly hall එක විදිහටත් හවසට exam hall එක විදිහටත් පාවිච්චි කරනවා වගේ: ගොඩනැගිලි දෙකක් හදන්න ඕනේ නෑ.',
      example: '(1) nn.Linear(768, 3072): 768 × 3,072 = 2,359,296, + bias 3,072 = 2,362,368. (2) MHA d=512, biases සහිතව: එක projection = 512 × 512 + 512 = 262,144 + 512 = 262,656. × 4 = 1,050,624. (1,048,576 = biases නැතුව.) (3) Layers 24, d = 1,024: 1,024² = 1,048,576, × 12 = 12,582,912, × 24 ≈ 302M (BERT-large ~340M, embeddings එකතු කළාම). (4) GPT-2 small embedding: 50,257 × 768 ≈ 38.6M, මුළු 124M න් තුනෙන් එකක් වගේ. Tied නිසා LM head එකට අමතර parameters නෑ. (5) Vocab 32,000, d = 4,096: 32,000 × 4,096 = 131,072,000 ≈ 131M. Untied → දෙකක් → ≈ 262M.',
      code: {
        lang: 'python',
        src: `import torch.nn as nn
print(sum(p.numel() for p in nn.Linear(768, 3072).parameters()))       # 2,362,368
mha = nn.MultiheadAttention(512, 8)                                      # bias=True
print(sum(p.numel() for p in mha.parameters()))                          # 1,050,624
L, d = 24, 1024
print(12 * L * d * d)                                                    # ~302M
emb = nn.Embedding(32000, 4096); head = nn.Linear(4096, 32000, bias=False)
head.weight = emb.weight     # weight tying: දැන් matrix එක එකයි`,
      },
      keyPoints: [
        'Linear = in × out + out (bias = output size).',
        'Attention = 4d² (+4d bias). Heads ගණන parameters වෙනස් කරන්නේ නෑ.',
        'Block ≈ 12d² (attention 4d² + FFN 8d²). Model ≈ 12·L·d² + embeddings.',
        'Embedding = (vocab, d_model) lookup table. LM head = hidden → vocab logits.',
        'Weight tying = embedding matrix එක LM head එකට reuse. Untied = 2 × vocab × d.',
      ],
      terms: [
        { en: 'nn.Embedding', si: 'Token ID එකෙන් learned vector row එකක් ගන්න PyTorch layer එක.' },
        { en: 'LM Head', si: 'අන්තිම hidden state එක vocabulary logits වලට හරවන linear layer එක.' },
        { en: 'Logits', si: 'Softmax එකට කලින් තියෙන raw scores.' },
        { en: 'Weight Tying', si: 'Input embedding සහ output projection එකම matrix එක share කරන එක.' },
        { en: 'Non-embedding Parameters', si: 'Embeddings හැර blocks වල තියෙන parameters (≈ 12·L·d²).' },
      ],
    },

    // 10
    {
      id: 'positional-schemes',
      title: 'Positional Schemes ගැඹුරින්: Sinusoidal, Learned, RoPE, ALiBi සහ Context Extension',
      examRefs: ['NN-028', 'NN-029', 'NN-064', 'NN-065', 'NN-066', 'NN-116', 'NN-117', 'NN-118', 'NN-119'],
      body: [
        'Position ඕනේ ඇයි: self-attention තනියම permutation-equivariant. ඒ කියන්නේ input tokens shuffle කළොත් outputs ත් ඒ විදිහටම shuffle වෙනවා විතරයි. "dog bites man" සහ "man bites dog" එකම වගේ පේනවා. Causal mask එක position encoding එකෙන් ස්වාධීනයි. Original 2017 paper එක: විවිධ frequencies (geometric විදිහට පරතරය වැඩිවෙන wavelengths) වල fixed sine/cosine අගයන් token embeddings වලට add කළා. Learned position embeddings ත් try කළා, results සමානයි, ඒත් report කළ design එක sinusoids.',
        'Learned absolute (BERT): positions 512ට table එකක rows 512යි. Tokens 1,024ක් දුන්නොත් position 513+ වලට train කරපු embedding එකක් නෑ. Truncate කරන්න ඕනේ, නැත්නම් table එක දිගු කරලා ආයේ train කරන්න ඕනේ. මේ hard limit එක RoPE, ALiBi වගේ relative ක්‍රම ජනප්‍රිය වෙන්න එක හේතුවක්.',
        'RoPE: input embeddings වලට කිසිම දෙයක් add කරන්නේ නෑ. හැම attention layer එකකම Q සහ K vectors වල dimension යුගල, position එකට සමානුපාතික කෝණයකින් rotate කරනවා. Values rotate කරන්නේ නෑ. Relative ගුණය: query එක position m න් ද key එක position n න් ද rotate කළාම, ඒ දෙකේ dot product එක රඳා පවතින්නේ m − n මත විතරයි. Rotations එකට එකතු වෙනවා: (R_m q)·(R_n k) = q·(R_(n−m) k). ඉතින් හැම vector එකක්ම absolute position එකෙන් rotate කළත් attention score එකට පේන්නේ offset එක විතරයි. (Distance එකකට learned bias එකක් දාන එක T5 relative bias, වෙනම ක්‍රමයක්.)',
        'RoPE frequencies = θ^(−2i/d). θ = base (සාමාන්‍යයෙන් 10,000), i = dimension pair අංකය. Base එක 500,000 වගේ වැඩි කළොත් frequencies අඩු වෙනවා, wavelengths දිගු වෙනවා, ඉතින් දුර positions තවමත් "wrap" නොවුණු, model එක දැකපු වගේ කෝණ වලට map වෙනවා. Heads ගණන හෝ masking වෙනස් වෙන්නේ නෑ. Position Interpolation (Chen et al., 2023): 2K train කරපු RoPE model එකක් 8K ට දිගු කරන්න position indices 4 න් බෙදනවා, එතකොට 8K positions ඔක්කොම train කරපු 0–2K පරාසය ඇතුළට වැටෙනවා, ඊට පස්සේ කෙටි fine-tuning එකක්. නොදැකපු කෝණ වලට extrapolate කරනවාට වඩා interpolate කරන එක ගොඩක් ස්ථාවරයි.',
        'ALiBi: position embeddings නෑ. Attention score එකෙන් head-specific slope × (query–key දුර) අඩු කරනවා. ළඟ tokens වලට වාසියි, train කළ දිගට වඩා දිග sequences වලට extrapolate කරන්න උදව් වෙනවා. Slopes learned නෙවෙයි, fixed geometric sequence එකක්: heads 8ක් නම් 1/2, 1/4, 1/8, ..., 1/256. Steep slope (1/2) තියෙන heads local, shallow slope (1/256) තියෙන heads long-range.',
      ],
      analogy: 'RoPE එක හරියට ඔරලෝසු කටු දෙකක් වගේ. එක කටුවක් position 10 ට, අනිත් එක position 13 ට කරකැවුවාම ඒ දෙක අතර කෝණය 3 ගානට. Position 110 සහ 113 ට කැරකුවත් ඒ අතර කෝණය එකමයි. Model එක බලන්නේ කටු දෙක අතර කෝණය විතරයි. ALiBi කියන්නේ Colombo bus fare එක වගේ: දුර වැඩි වෙන තරමට "ගාස්තුව" (penalty) වැඩියි, ඒත් සමහර bus routes (heads) km එකකට අය කරන්නේ ගොඩක් අඩුවෙන්, ඒවායේ දුර යන්න ලේසියි.',
      example: 'ALiBi: query position 10, keys 9, 7, 2 (දුර 1, 3, 8). Slope 1/2 head එකේ penalties: −0.5, −1.5, −4.0. Slope 1/256 head එකේ: −0.004, −0.012, −0.031, ප්‍රායෝගිකව දුර ගැටලුවක් නෑ. RoPE base: d = 128, base 10,000 නම් වේගවත්ම pair එක token එකකට radian 1ක් කැරකෙනවා (tokens ~6 කින් වටයක්), මන්දගාමීම pair එකේ wavelength එක tokens 54,000ක් පමණ. Base 500,000 කළාම මන්දගාමීම wavelength එක මිලියන 2.5කට වඩා. Position Interpolation: 8K context එකේ position 6,000 → 6,000 / 4 = 1,500, ඒක model එක දැකපු පරාසයේ.',
      keyPoints: [
        'Attention permutation-equivariant. Position නැත්නම් වචන බෑගයක්.',
        '2017 original = fixed sinusoids embeddings වලට add. BERT = learned 512, ඊට වඩා බෑ.',
        'RoPE = Q, K rotate (V නෑ, embeddings වලට add නෑ). Dot product එක m − n මත විතරයි.',
        'RoPE base 10K → 500K = frequencies අඩු, දිගු context. Position Interpolation = indices scale down (2K→8K: ÷4) + fine-tune.',
        'ALiBi = score එකෙන් slope × distance අඩු කරනවා. Slopes fixed geometric (8 heads: 1/2 ... 1/256).',
      ],
      terms: [
        { en: 'Permutation-Equivariant', si: 'Input පිළිවෙළ මාරු කළාම output එකත් ඒ විදිහටම මාරු වෙනවා විතරයි, පිළිවෙළේ තේරුමක් අල්ලන්නේ නෑ.' },
        { en: 'RoPE Base (θ)', si: 'Rotation frequencies තීරණය කරන අංකය. වැඩි කළොත් wavelengths දිගුයි.' },
        { en: 'Position Interpolation', si: 'Position indices පොඩි කරලා train කරපු පරාසය ඇතුළට ගන්න context extension ක්‍රමය.' },
        { en: 'ALiBi', si: 'Attention with Linear Biases. දුර අනුව score එකට penalty එකක් දෙන ක්‍රමය.' },
        { en: 'Extrapolation', si: 'Train කරපු දිගට වඩා දිග inputs වලට වැඩ කරන්න උත්සාහ කරන එක.' },
        { en: 'T5 Relative Bias', si: 'Distance bucket එකකට learned bias එකක් attention score එකට එකතු කරන ක්‍රමය.' },
      ],
    },

    // 11
    {
      id: 'architecture-families',
      title: 'Encoder-only, Decoder-only, Encoder–Decoder, Prefix LM සහ [CLS] Token',
      examRefs: ['NN-030', 'NN-031', 'NN-032', 'NN-039', 'NN-087', 'NN-088', 'NN-089', 'NN-090', 'NN-140'],
      body: [
        'පවුල් තුනයි. BERT = encoder-only, masked language modeling (MLM): අහඹු tokens mask කරලා දෙපැත්තේම context එකෙන් ඒවා අනුමාන කරනවා. GPT = decoder-only, causal (next-token) language modeling. T5 = encoder–decoder, හැම task එකක්ම "text-to-text": translation, classification, summarization ඔක්කොම "input text → output text", task prefix එකක් එක්ක. T5 pretraining objective එක span corruption.',
        'Causal LM labels: input [t₀, t₁, t₂, t₃] නම් targets තියෙන්නේ එක position එකකින් වමට shift කරලා: position i predict කරන්නේ t(i+1). ඒ නිසා එක forward pass එකකින් හැම position එකක්ම training signal එකක් දෙනවා. එකම position එකේ token එක predict කරන එක copy කරනවා විතරයි, random masked positions කියන්නේ BERT.',
        '[CLS] token: BERT sequence එකේ මුලට [CLS] කියන විශේෂ token එකක් දානවා. Attention bidirectional නිසා අන්තිම layer එකේ [CLS] hidden state එක මුළු sequence එකේම තොරතුරු එකතු කරගන්නවා, ඒක sentence classification head එකට දෙනවා. Decoder-only models වලදී convention එක අන්තිම token එකේ state එක, මොකද causal mask එක නිසා හැමදේම දැකපු එකම position එක ඒක.',
        'කුමක් කවදාද: Support tickets classify කරන්න සහ entity names extract කරන්න (NER) encoder-only (BERT) හොඳම: දෙපැත්තම බලනවා, පොඩියි, ලාභයි. Semantic search වලට ලේටන්සි අඩු sentence embeddings මිලියන ගණනකට: compact encoder-only model එකක් pooled outputs එක්ක (sentence-transformers). Vanilla BERT open-ended generation වලට නරකයි: ඒක train වුණේ දෙපැත්තේ context එකෙන් masked tokens පුරවන්න, වමේ ඉඳන් දකුණට next token එක predict කරන්න නෙවෙයි. (BERT සීමාව positions 512, vocabulary ~30K WordPiece.)',
        'Prefix LM (සමහර T5/UL2 configs): structure එක decoder-only වගේ, ඒත් mask එක විශේෂයි: prefix (input) කොටස ඇතුළේ bidirectional attention, generate වෙන කොටසට causal attention. Conditioning text එකට encoder එකක් වගේ තමන්ව සම්පූර්ණයෙන් බලන්න පුළුවන්, generation තවමත් autoregressive.',
      ],
      analogy: 'BERT කියන්නේ "හිස්තැන් පුරවන්න" O/L ප්‍රශ්න පත්‍රයක් කරන ළමයෙක්: වාක්‍යයේ දෙපැත්තම කියවලා හිස්තැන අනුමාන කරනවා. GPT කියන්නේ කතාවක් ලියන කෙනෙක්: කලින් ලියපු දේ විතරක් බලලා ඊළඟ වචනය. T5 කියන්නේ translator කෙනෙක්: එක text එකක් කියවලා (encoder) අලුත් text එකක් ලියනවා (decoder). [CLS] කියන්නේ පන්තියේ monitor: හැමෝගෙම අදහස් අහලා principal ට (classifier) එක summary එකක් දෙනවා.',
      example: 'Causal LM: "මම කඩේ ගියා" → tokens [මම, කඩේ, ගියා, <eos>]. Position 0 (මම) target = කඩේ, position 1 (කඩේ) target = ගියා, position 2 target = <eos>. ඉතින් tokens 4ක sequence එකකින් predictions 3ක් එක පාරටම. Prefix LM mask එක: prefix tokens 3ක් + generated 2ක්. Prefix tokens 3ම එකිනෙකා බලනවා (3 × 3 = 9 කොටු ඔක්කොම open). Generated token 1 → prefix 3 + තමන්. Generated token 2 → prefix 3 + generated 1 + තමන්.',
      keyPoints: [
        'BERT = encoder-only + MLM. GPT = decoder-only + next token. T5 = encoder–decoder text-to-text, span corruption.',
        'Causal LM targets = input එක 1කින් shift කරපු එක (position i → t(i+1)).',
        'BERT classification = [CLS] final hidden state. Decoder-only = අන්තිම token state.',
        'Classification/NER/embeddings → encoder-only. Generation → decoder-only (BERT generate කරන්න නරකයි).',
        'Prefix LM = prefix ඇතුළේ bidirectional + generated කොටසට causal.',
      ],
      terms: [
        { en: 'MLM (Masked Language Modeling)', si: 'අහඹු tokens වහලා දෙපැත්තේ context එකෙන් ඒවා අනුමාන කරන training objective එක.' },
        { en: 'Span Corruption', si: 'Text කොටස් (spans) වහලා decoder එකට ඒවා ලියන්න කියන T5 objective එක.' },
        { en: '[CLS] Token', si: 'BERT sequence එකේ මුලට දාන, මුළු sequence summary එක ගෙනියන විශේෂ token එක.' },
        { en: 'Pooling', si: 'Token vectors ගොඩක් එක sentence vector එකකට එකතු කරන එක (mean pooling වගේ).' },
        { en: 'Prefix LM', si: 'Prefix එකට bidirectional, output එකට causal attention දෙන decoder model.' },
        { en: 'NER', si: 'Named Entity Recognition. Text එකේ නම්, ස්ථාන වගේ entities හොයන task එක.' },
      ],
    },

    // 12
    {
      id: 'mqa-gqa-mla',
      title: 'MHA, MQA, GQA, MLA සහ KV Cache ඉතිරි කිරීම',
      examRefs: ['NN-062', 'NN-063', 'NN-099', 'NN-137', 'NN-149'],
      body: [
        'Generate කරද්දී (inference) model එක කලින් tokens වල Keys සහ Values ආයේ ගණනය නොකර KV cache එකක තියාගන්නවා. Context එක දිගු වෙද්දී මේ cache එක ලොකු වෙනවා, ඒ වගේම හැම token එකකදීම ඒක GPU memory එකෙන් කියවන්න ඕනේ. Decoding එක memory-bandwidth-bound නිසා cache එක පොඩි කරන එක ලොකු වේගයක් දෙනවා.',
        'MHA (Multi-Head Attention): query heads 32 නම් K heads 32, V heads 32. MQA (Multi-Query Attention): query heads ගොඩක් තියාගෙන, ඔක්කොම share කරන්නේ එක K head එකක් සහ එක V head එකක්. Cache එක ගොඩක් පොඩියි, ඒත් quality ටිකක් අඩු වෙන්න පුළුවන්. GQA (Grouped-Query Attention): මැද මාර්ගය. Query heads groups වලට බෙදලා, group එකකට එක KV head එකක්. KV heads 1 = MQA, KV heads = query heads = MHA.',
        'Projection shapes: d_model = 4,096, query heads 32 × 128. W_Q = 4,096 × 4,096. GQA KV heads 8 නම් W_K = 4,096 × (8 × 128) = 4,096 × 1,024, W_V එකත් එහෙමයි. MHA නම් 4,096 × 4,096, MQA නම් 4,096 × 128.',
        'MHA → GQA convert කිරීම (Ainslie et al.): මුල ඉඳන් retrain කරන්නේ නෑ. Group එකක් ඇතුළේ තියෙන K සහ V projection heads mean-pool කරනවා (සාමාන්‍යය ගන්නවා), ඊට පස්සේ මුල් pretraining compute එකෙන් ~5% වගේ පොඩි ප්‍රමාණයකින් uptrain කරනවා. Group එකක පළමු head එක විතරක් තියාගන්නවාට වඩා mean-pooling තොරතුරු වැඩිපුර ආරක්ෂා කළා.',
        'MLA (Multi-head Latent Attention, DeepSeek-V2): K සහ V එකට low-rank latent vector පොඩි එකකට compress කරලා ඒක cache කරනවා. ඕනේ වෙලාවට up-projections වලින් head එකකට වෙනම K, V ආයේ හදනවා (ඒ up-projections අනිත් matrices එක්ක absorb කරන්නත් පුළුවන්). MQA වගේ heads ඔක්කොම එකම KV එක share කරන්නේ නෑ, per-head විවිධත්වය තියෙනවා. RoPE rotation එක compression එක්ක commute නොවෙන නිසා RoPE වෙනම "decoupled" key කොටසකින් handle කරනවා.',
      ],
      analogy: 'Office එකක staff 32 දෙනෙක් (query heads) ඉන්නවා. MHA = හැමෝටම වෙනම filing cabinet එකක් (cabinets 32). MQA = හැමෝම එකම cabinet එකක් share කරනවා (ඉඩ ගොඩක් ඉතුරුයි, ඒත් පෝලිම් සහ අවුල්). GQA = කණ්ඩායම් 8ක්, කණ්ඩායමකට cabinet එකක් (4 දෙනෙක්ට එකක්). MHA→GQA = cabinets 4ක ඇති files එකම cabinet එකකට සාරාංශ කරලා දාලා, සතියක් පුරුදු වෙන්න දෙනවා. MLA = files zip කරලා තියාගෙන ඕනේ වෙලාවට unzip කරනවා.',
      example: 'KV cache ගණනය (LLaMA-2-7B වගේ: layers 32, heads 32, head_dim 128, FP16 = bytes 2). Token එකකට = 2 (K සහ V) × 32 layers × 32 heads × 128 × 2 bytes = 524,288 bytes = 512 KiB. Tokens 4,096ක් → 2 GiB (එක sequence එකකට!). GQA KV heads 8 → 4 ගුණයක් අඩුයි → 128 KiB/token → 512 MiB. MQA (KV head 1) → 32 ගුණයක් අඩුයි → 16 KiB/token → 64 MiB. Group size: query heads 32 ÷ KV heads 8 = KV head එකක් query heads 4ක් share කරනවා.',
      keyPoints: [
        'MQA = query heads ගොඩක්, K/V head එකයි. GQA = groups, group එකකට K/V head එකක්.',
        'Group size = query heads ÷ KV heads (32/8 = 4). KV=1 → MQA, KV=Q → MHA.',
        'W_K shape = d_model × (KV heads × head_dim) → 4096 × 1024 (8 × 128).',
        'KV cache per token = 2 × layers × KV heads × head_dim × bytes. GQA 32→8 = 4× ඉතුරුයි.',
        'MHA→GQA = mean-pool KV heads per group + ~5% compute uptraining. MLA = low-rank latent cache + decoupled RoPE.',
      ],
      terms: [
        { en: 'KV Cache', si: 'Generation වලදී කලින් tokens වල keys සහ values ආයේ ගණනය නොකර තියාගන්න memory එක.' },
        { en: 'Multi-Query Attention (MQA)', si: 'Query heads ඔක්කොම එකම K සහ V head එකක් share කරන ක්‍රමය.' },
        { en: 'Grouped-Query Attention (GQA)', si: 'Query heads groups වලට, group එකකට එක K/V head එකක්.' },
        { en: 'Uptraining', si: 'Convert කරපු checkpoint එකක් මුල් compute එකෙන් පොඩි කොටසකින් ආයේ train කරන එක.' },
        { en: 'Multi-head Latent Attention (MLA)', si: 'K, V low-rank latent එකකට compress කරලා cache කරන DeepSeek ක්‍රමය.' },
        { en: 'Memory-Bandwidth-Bound', si: 'Compute වලට වඩා memory එකෙන් data කියවන වේගය නිසා සීමා වෙන තත්ත්වය.' },
      ],
    },

    // 13
    {
      id: 'flashattention-deep-dive',
      title: 'FlashAttention: Tiling, Online Softmax, Memory, Backward සහ FlashAttention-2',
      examRefs: ['NN-074', 'NN-075', 'NN-113', 'NN-114', 'NN-115', 'NN-148'],
      body: [
        'GPU එකක memory වර්ග දෙකක්: HBM (ලොකුයි, ගිගාබයිට් ගණන්, ඒත් සාපේක්ෂව හෙමින්) සහ on-chip SRAM (ඉතා පොඩියි, ඒත් ඉතා වේගවත්). සාමාන්‍ය attention එක n × n score matrix එක HBM එකට ලියනවා, softmax කරන්න ආයේ කියවනවා, ආයේ ලියනවා, V එක්ක ගුණ කරන්න ආයේ කියවනවා. Attention එක compute-bound නෙවෙයි, memory-traffic-bound. FlashAttention එකේ ප්‍රධාන අදහස: IO-aware වෙන එක. Q, K, V blocks (tiles) වලට කඩලා SRAM එකට ගෙනල්ලා, matmul + softmax + matmul එක kernel එකක fuse කරනවා. සම්පූර්ණ n × n matrix එක කවදාවත් HBM එකට ලියන්නේ නෑ.',
        'වැදගත්ම කාරණය: FlashAttention exact. Floating-point rounding හැර outputs සාමාන්‍ය attention එකටම සමානයි. Linformer වගේ low-rank approximation එකක් නෙවෙයි, heads drop කරන්නේ නෑ, INT4 quantize කරන්නේ නෑ. FLOPs තවමත් O(n²). වාසි එන්නේ HBM reads/writes අඩු කිරීමෙන් සහ දිගු sequences වල activation memory අඩු කිරීමෙන්.',
        'Online softmax: Softmax වලට row එකේ max එකයි, exp එකතුවයි (normalizer) ඕනේ. ඒත් FlashAttention row එක එකපාර memory එකේ තියාගන්නේ නෑ. ඉතින් row එකකට running max (m) සහ running normalizer (l) තියාගන්නවා. අලුත් key block එකක් ආවාම max එක වැඩි වුණොත්, කලින් partial sums සහ outputs exp(m_old − m_new) වලින් ගුණ කරලා rescale කරනවා. අන්තිම ප්‍රතිඵලය exact softmax එකමයි.',
        'Memory සහ backward: Forward pass එකේ අමතර memory එක O(n): query row එකකට max එක සහ log-sum-exp එක විතරක් save කරනවා, n × n probability matrix එක නෙවෙයි. සාමාන්‍ය attention backward pass එකට n × n matrix එක save කරනවා. FlashAttention ඒ වෙනුවට backward එකේදී Q, K, V සහ save කරපු softmax statistics වලින් attention blocks ආයේ ගණනය කරනවා (recomputation). FLOPs වැඩියි, ඒත් attention memory-bound නිසා huge matrix එකක් HBM එකෙන් කියවනවාට වඩා වේගවත්. CPU එකට offload කරන එක ගොඩක් හෙමින්.',
        'FlashAttention-2: (1) Tensor Core matmuls නොවන (rescaling වගේ) FLOPs අඩු කළා. (2) Batch සහ heads විතරක් නෙවෙයි sequence-length dimension එක දිගේත් thread blocks වලට වැඩ බෙදුවා, ඒ නිසා GPU occupancy වැඩියි (විශේෂයෙන් batch පොඩි, sequence දිගු විට). (3) Warps අතර වැඩ බෙදීම හොඳ කළා. තවමත් exact, තවමත් score matrix එක materialize කරන්නේ නෑ.',
      ],
      analogy: 'ඔයා Pettah wholesale කඩේකින් (HBM) බඩු ගෙනල්ලා ගෙදර කුස්සියේ (SRAM) උයනවා කියලා හිතන්න. සාමාන්‍ය attention = හැම පියවරකටම Pettah ගිහින් එනවා: එළවළු කපලා ආපහු ගබඩාවට, ආයේ ගෙනල්ලා තම්බලා ආපහු ගබඩාවට. FlashAttention = එක පාරක් ගෙනාපු බඩු ටිකෙන් කුස්සිය ඇතුළේම කපලා, තම්බලා, curry එක ඉවර කරලා අන්තිම plate එක විතරක් එළියට. කෑම එකම (exact), ගමන් අඩුයි. Recomputation = රසය බලන්න recipe card එක (statistics) තියාගෙන කෑම ආයේ පොඩ්ඩක් හදනවා, මුළු pot එකම fridge එකේ තියනවා වෙනුවට.',
      example: 'Online softmax පොඩි උදාහරණයක්: row එකේ scores [2, 1 | 3], blocks දෙකක්. Block 1: m = 2, l = e⁰ + e⁻¹ = 1 + 0.368 = 1.368. Block 2 ආවා: අලුත් max 3. පරණ l rescale: 1.368 × e^(2−3) = 1.368 × 0.368 = 0.503. අලුත් එකතු කිරීම e^(3−3) = 1. l = 1.503. Check කරමු: සම්පූර්ණ row එක එකපාර: e^(2−3) + e^(1−3) + e^(3−3) = 0.368 + 0.135 + 1 = 1.503. හරියටම සමානයි. Memory: n = 4,096, heads 32 → standard probabilities 1 GiB (FP16). FlashAttention statistics: 4,096 × 32 × 2 අගයන් × bytes 4 ≈ 1 MiB විතරයි.',
      keyPoints: [
        'FlashAttention = IO-aware tiling. Blocks SRAM එකේ, n×n matrix එක HBM එකට ලියන්නේ නෑ.',
        'Exact attention. FLOPs තවමත් O(n²). වාසිය memory traffic සහ activation memory.',
        'Online softmax = running max + running normalizer, exp(m_old − m_new) rescale.',
        'Extra memory O(n) (row stats). Backward = stats වලින් recompute.',
        'FlashAttention-2 = non-matmul FLOPs අඩු, sequence දිගේ parallelize, හොඳ warp partitioning.',
      ],
      terms: [
        { en: 'HBM', si: 'High Bandwidth Memory. GPU එකේ ලොකු ප්‍රධාන memory එක.' },
        { en: 'SRAM (on-chip)', si: 'GPU chip එක ඇතුළේ ඇති ඉතා වේගවත්, පොඩි memory එක.' },
        { en: 'Kernel Fusion', si: 'Operations කිහිපයක් එකම GPU kernel එකක කරලා memory ගමන් අඩු කරන එක.' },
        { en: 'Online Softmax', si: 'Row එක කොටස් වලින් එද්දී running max/sum පාවිච්චි කරලා exact softmax ගණනය කරන ක්‍රමය.' },
        { en: 'Log-Sum-Exp', si: 'Softmax normalizer එකේ log අගය. Backward එකට save කරන statistic එක.' },
        { en: 'Recomputation', si: 'Memory ඉතිරි කරන්න අතරමැද අගයන් save නොකර backward එකේදී ආයේ ගණනය කරන එක.' },
      ],
    },

    // 14
    {
      id: 'long-context-attention-tricks',
      title: 'Sliding-Window, Sparse, Linear Attention, Attention Sinks සහ Logit Soft-Capping',
      examRefs: ['NN-076', 'NN-077', 'NN-120', 'NN-130', 'NN-136', 'NN-150'],
      body: [
        'Sliding-window attention (Mistral 7B): හැම token එකක්ම බලන්නේ කලින් w tokens ගණනට විතරයි. Cost එක O(n · w), w fixed නිසා n ට රේඛීයයි. ඒත් තොරතුරු w ට වඩා දුර යන්න පුළුවන්: layer එකක window එක කලින් layer එකේ windows උඩ stack වෙනවා. Layer එකකට තව window එකක් පස්සට. ඉතින් theoretical receptive field ≈ layers × w (stacked convolutions වගේ). ප්‍රායෝගිකව hops ගොඩක් යද්දී තොරතුරු දුර්වල වෙන නිසා effective recall එක මේ සීමාවට වඩා අඩුයි.',
        'Sparse patterns (Longformer): බොහෝ tokens local sliding window එකක් ඇතුළේ attend කරනවා. [CLS] වගේ තෝරාගත් global tokens කිහිපයක් හැම තැනටම attend කරනවා, හැම තැනින්ම ඒවාට attend කරනවා. Linear scaling සහ task එකට අදාළ long-range links දෙකම. Chunks අතර recurrence කියන්නේ Transformer-XL ක්‍රමය.',
        'Linear attention: softmax(QKᵀ)V වෙනුවට φ(Q)(φ(K)ᵀV). φ = kernel feature map එකක්. Matrix multiplication associative නිසා φ(K)ᵀV (d × d matrix එකක්) මුලින්ම ගණනය කරන්න පුළුවන්, n × n matrix එක කවදාවත් හැදෙන්නේ නෑ. Cost O(n·d²), O(n²·d) වෙනුවට. Softmax එකේ row-wise normalization එක නැති නිසා තමයි මේ reorder එක කරන්න පුළුවන්. φ එක softmax එක approximate කරනවා විතරයි, ඒ නිසා quality බොහෝ විට full attention එකට පස්සෙන්.',
        'Attention sinks (StreamingLLM): LLMs semantic වැදගත්කමක් නැතත් මුල් tokens කිහිපයට අසාමාන්‍ය ලෙස attention දෙනවා. හේතුව: softmax එකට කොහේ හරි attention mass එක දාන්න ඕනේ, model එක අතිරික්තය මුල් tokens වලට "dump" කරන්න ඉගෙන ගන්නවා. සරල sliding window එකකින් ඒ tokens ඉවත් කළොත් perplexity පුපුරනවා. StreamingLLM මුල් "sink" tokens කිහිපයක (උදා: 4ක්) KV states අලුත්ම window එක එක්ක තියාගන්නවා. Retraining නැතුවම ස්ථාවර streaming generation.',
        'Logit soft-capping (Gemma 2): cap · tanh(logits / cap). tanh එක −1 සහ 1 අතර, ඉතින් output එක (−cap, cap) අතර smooth විදිහට සීමා වෙනවා. පොඩි logits ප්‍රායෝගිකව වෙනස් නෑ, extreme ඒවා විතරක් තද කරනවා. Hard clip එකක් (max value එකකින් කපන එක) capped අගයන් වලට gradient 0 කරනවා, soft-cap එකේ gradient තවමත් ගලනවා. Gemma 2 attention logits සහ final logits දෙකටම මේක පාවිච්චි කරනවා.',
      ],
      analogy: 'Sliding window = cricket field එකේ fielder කෙනෙක්ට ළඟ ඉන්න කෙනාට විතරක් ball එක දෙන්න පුළුවන්. ඒත් relay කරලා boundary එකේ ඉඳන් wicket keeper ට ball එක එනවා (layers හරහා). Attention sink = Galle Face එකේ හැමෝම දන්න meeting point එක: කාටවත් විශේෂ දෙයක් නැති වෙලාවට ඇස් යන්නේ එතනට. ඒක අයින් කළොත් හැමෝම අවුල් වෙනවා. Soft-cap = tuk-tuk meter එකක "maximum fare" එක hard limit එකක් නෙවෙයි, දුර වැඩි වෙද්දී ගාස්තුව වැඩි වීම ටිකෙන් ටික හෙමින් වෙනවා.',
      example: 'Receptive field: layers 32, window 4,096 → 32 × 4,096 = 131,072 ≈ 131K tokens (Mistral 7B කියන අගය). Sliding cost: n = 32,000, w = 4,096 → 32,000 × 4,096 ≈ 131M scores, full attention 32,000² = 1,024M. Linear attention: n = 100,000, d = 128 → n²d = 1.28 × 10¹², nd² = 1.6 × 10⁹, 800 ගුණයක් අඩුයි. Soft-cap, cap = 30: logit 1 → 30·tanh(0.033) ≈ 1.0; logit 10 → 30·tanh(0.33) ≈ 9.6; logit 100 → 30·tanh(3.33) ≈ 29.9. Hard clip 30 නම් 100 → 30, gradient 0.',
      keyPoints: [
        'Sliding window cost O(n·w). Receptive field ≈ layers × w (32 × 4096 ≈ 131K), effective එක අඩුයි.',
        'Longformer = local window + global tokens.',
        'Linear attention = φ(K)ᵀV මුලින් (associativity) → O(n·d²), softmax approximate.',
        'Attention sinks = මුල් tokens attention dump එක. StreamingLLM = sinks + recent window, retrain නැතුව.',
        'Soft-cap = cap·tanh(x/cap): smooth bound, gradient නැති වෙන්නේ නෑ (Gemma 2).',
      ],
      terms: [
        { en: 'Sliding-Window Attention', si: 'හැම token එකක්ම කලින් w tokens වලට විතරක් attend කරන ක්‍රමය.' },
        { en: 'Global Tokens', si: 'Sparse attention එකේ හැම තැනටම attend කරන, හැම තැනින්ම attend කරන විශේෂ tokens.' },
        { en: 'Linear Attention', si: 'Kernel feature map එකක් පාවිච්චි කරලා attention O(n) කරන approximate ක්‍රමය.' },
        { en: 'Attention Sink', si: 'Model එක අතිරික්ත attention mass එක දාන මුල් tokens.' },
        { en: 'StreamingLLM', si: 'Sink tokens + rolling window KV cache එකෙන් අසීමිත streaming කරන ක්‍රමය.' },
        { en: 'Logit Soft-Capping', si: 'cap·tanh(x/cap) වලින් logits smooth විදිහට සීමා කරන එක.' },
      ],
    },

    // 15
    {
      id: 'scaling-laws',
      title: 'Scaling Laws: Kaplan, Chinchilla, 6ND, 2N සහ Chinchilla වලින් එහාට',
      examRefs: ['NN-041', 'NN-042', 'NN-081', 'NN-082', 'NN-083', 'NN-084', 'NN-131', 'NN-132', 'NN-133', 'NN-134', 'NN-135'],
      body: [
        'Scaling laws (Kaplan et al., 2020): test loss එක model size (N), data (D) සහ compute (C) එක්ක power law එකක් විදිහට අඩු වෙනවා, අනිත් ඒවා bottleneck නොවෙන තාක් කල්. Power law කියන්නේ "දෙගුණ කරන හැම පාරකම loss එක එකම ප්‍රතිශතයකින් අඩු වෙනවා" වගේ smooth curve එකක්. Heads ගණන වගේ එක hyperparameter එකකට linear නෙවෙයි. Kaplan ගේ fits නිසා compute වැඩි වෙද්දී parameters data වලට වඩා ගොඩක් වේගයෙන් වැඩි කරන්න කිව්වා: GPT-3 (175B, tokens ~300B, parameter එකකට tokens ~1.7) වගේ ලොකු, අඩුවෙන් train කරපු models.',
        'Chinchilla (Hoffmann et al., 2022): run එකකට හරි learning-rate schedule එකක් දාලා බැලුවාම, parameters සහ tokens ආසන්න වශයෙන් සමාන අනුපාතයෙන් වැඩි වෙන්න ඕනේ. Rule of thumb: parameter එකකට tokens ~20. සමාන compute එකකදී, වැඩි data එකක් එක්ක පොඩි model එකක්, ලොකු undertrained model එකක් පරදවනවා. Loss form: L(N, D) = E + A/N^α + B/D^β. E = irreducible loss (natural text එකේ entropy, කිසිම model size එකකින් හෝ data එකකින් අයින් කරන්න බෑ). A/N^α = model size සීමාව, B/D^β = data සීමාව. N, D අනන්තයට යද්දී ඒ terms 0 ට, loss එක E ට ළං වෙනවා.',
        'Compute formula: C ≈ 6·N·D. Token එකකට parameter එකකට forward pass එකේ FLOPs ~2ක් (ගුණ කිරීමක් + එකතු කිරීමක්), backward එකේ ~4ක්. Inference: forward pass එක විතරයි, ඉතින් generate කරන token එකකට ≈ 2N FLOPs (context attention අමතක කළාම). 6N කියන්නේ training cost එක. Compute 10× වුණාම Chinchilla-optimal: N සහ D දෙකම ∝ C^0.5, ඉතින් දෙකම √10 ≈ 3.16 ගුණයක්. දෙකම 10× කරන්න compute 100× ඕනේ.',
        'Context-dependent compute: Kaplan forward cost ≈ 2N + 2·n_layer·n_ctx·d_model per token. දෙවෙනි term එක attention (context එක දිහා බලන එක). N ≈ 12·n_layer·d_model² නිසා අනුපාතය = n_ctx / (12·d_model). n_ctx එක 12·d_model ට කිට්ටු හෝ වැඩි වුණාම attention term එක වැදගත්. d_model = 4,096 → threshold ≈ 49K tokens. දිගු context training cost balance එක attention පැත්තට ගෙනියන්නේ ඒ නිසා.',
        'Chinchilla වලින් එහාට: Chinchilla optimize කරන්නේ training compute විතරයි. LLaMA 7B model එකක් 1T tokens වලින් train කළා (parameter එකකට ~143). හේතුව: model එක requests ගොඩකට serve කරනවා නම්, training වලට අමතර compute දාලා එකම quality එකක් තියෙන පොඩි model එකක් හදන එක inference වලදී ලාභයි. වැඩි tokens training compute අඩු කරන්නේ නෑ, වැඩි කරනවා. μP (Maximal Update Parametrization): init සහ per-layer learning rates parametrize කරන්නේ පටු (narrow) model එකක tune කරපු hyperparameters ගොඩක් පළල model එකකට transfer වෙන විදිහට (μTransfer). Standard parametrization එකේ optimal learning rate එක width එකත් එක්ක වෙනස් වෙනවා.',
      ],
      analogy: 'Model එක ශිෂ්‍යයෙක්, data එක past papers. Kaplan කිව්වේ "ලොකු මොළයක් ගන්න, papers ටිකක් කළාම ඇති". Chinchilla කිව්වේ "මොළය දෙගුණ කරනවා නම් papers ත් දෙගුණ කරන්න". LLaMA කිව්වේ "මේ ළමයාට අවුරුදු ගානක් පුරා tuition (inference) දෙන්න තියෙන නිසා, දැන් papers තව ගොඩක් කරවලා පොඩි, වේගවත් ළමයෙක් හදමු". E කියන්නේ විභාගයේ කවුරුත් කරන්න බැරි අහඹු ප්‍රශ්න ටික: ඒවායින් ලකුණු ගන්න බෑ.',
      example: 'Chinchilla tokens: 70B × 20 = 1.4T tokens (Chinchilla 70B train කළේ හරියටම මේ ප්‍රමාණයෙන්). 7B → 140B tokens. Training compute: 1B params, 20B tokens → 6 × 10⁹ × 2 × 10¹⁰ = 12 × 10¹⁹ = 1.2 × 10²⁰ FLOPs. Chinchilla 70B: 6 × 7 × 10¹⁰ × 1.4 × 10¹² ≈ 5.9 × 10²³ FLOPs. Inference: 7B model → 2 × 7 × 10⁹ = 14 GFLOPs per token. Tokens 1,000ක answer එකකට ≈ 1.4 × 10¹³ FLOPs. Context term: d_model 4,096 → 12 × 4,096 = 49,152 tokens වලදී attention term එක 2N එකට සමාන වෙනවා.',
      keyPoints: [
        'Loss = model size, data, compute එක්ක power law එකකින් අඩු වෙනවා.',
        'Chinchilla: N සහ D සමානව වැඩි කරන්න, parameter එකකට tokens ~20 (70B → 1.4T).',
        'L = E + A/N^α + B/D^β. E = irreducible loss.',
        'Training C ≈ 6ND. Inference ≈ 2N per token. Compute 10× → N, D දෙකම ~3.16×.',
        'Attention term වැදගත් වෙන්නේ n_ctx ≳ 12·d_model. Inference ලාභ කරන්න Chinchilla ට වඩා වැඩි tokens (LLaMA). μP = hyperparameter transfer.',
      ],
      terms: [
        { en: 'Power Law', si: 'එක අගයක් තව අගයක බලයකට (exponent) සමානුපාතික වෙන සම්බන්ධතාවය.' },
        { en: 'Compute-Optimal', si: 'දීපු compute budget එකට අඩුම loss එක දෙන N සහ D සංයෝගය.' },
        { en: 'Irreducible Loss (E)', si: 'Text එකේ ස්වභාවික අවිනිශ්චිතතාවය. කිසිම scale එකකින් අයින් කරන්න බෑ.' },
        { en: 'FLOPs', si: 'Floating-point operations. Compute මනින ඒකකය.' },
        { en: 'Undertrained', si: 'Model size එකට සාපේක්ෂව tokens අඩුවෙන් train කරපු model එකක් (GPT-3).' },
        { en: 'μP / μTransfer', si: 'පොඩි model එකක tune කරපු hyperparameters ලොකු model එකට transfer කරන parametrization එක.' },
      ],
    },

    // 16
    {
      id: 'mixture-of-experts',
      title: 'Mixture of Experts: Routing, Load Balancing, Expert Capacity, Switch සහ DeepSeekMoE',
      examRefs: ['NN-040', 'NN-078', 'NN-079', 'NN-080', 'NN-125', 'NN-126', 'NN-127'],
      body: [
        'MoE layer එකක block එකේ එක FFN එකක් වෙනුවට expert FFNs ගොඩක් තියෙනවා. Router (gating network) එක හැම token එකකටම experts score කරලා top-k විතරක් active කරනවා. Total parameters ගොඩක් වැඩි වෙනවා, ඒත් token එකකට compute එක සාධාරණයි. Experts ඔක්කොගේම සාමාන්‍යය හැම token එකකටම ගත්තොත් ඒක dense model එකක්, compute ඉතිරියක් නෑ. Router එක GPU තෝරන්නේ නෑ, layers පිළිවෙළ තීරණය කරන්නෙත් නෑ.',
        'Mixtral 8x7B: layer එකකට experts 8, token එකකට top-2. Replicate වෙන්නේ FFN experts විතරයි, attention සහ embeddings share. ඒ නිසා total ≈ 46.7B (8 × 7 = 56B නෙවෙයි), active per token ≈ 12.9B. ප්‍රධාන අවාසිය: ඕනෑම token එකක් ඕනෑම expert කෙනෙක්ට යන්න පුළුවන් නිසා experts ඔක්කොගේම weights memory එකේ තියෙන්න ඕනේ. Memory අවශ්‍යතාවය ගොඩක් ලොකු dense model එකක් වගේ. Routers train වෙන්නේ සාමාන්‍ය backprop එකෙන්, gate weights හරහා.',
        'Load balancing: routers ටික දෙනෙක් වෙත collapse වෙන්න කැමතියි: experts කිහිප දෙනෙක්ට tokens ගොඩක්, අනිත් අය නිකන්. Capacity නාස්ති වෙනවා, සමහර devices overload. Auxiliary load-balancing loss එකක් tokens සමානව බෙදෙන්න දිරි දෙනවා. ඒක main LM loss එකට එකතු කරනවා, ඒක වෙනුවට නෙවෙයි. Experts සමාන functions ඉගෙන ගන්න බල කරන්නේ නෑ.',
        'Expert capacity: expert එකකට capacity = (batch එකේ tokens / experts) × capacity factor. Fixed capacity නිසා static tensor shapes ලැබෙනවා, parallel execution efficient. Expert එක පිරිලා නම් overflow tokens ඒ layer එකේ expert computation එකෙන් drop වෙලා residual connection එක හරහා පාස් වෙනවා. Capacity factor වැඩි කළොත් drops අඩුයි, ඒත් padding වලට compute සහ memory නාස්තියි.',
        'Switch Transformer: top-1 routing, token එකකට එක expert විතරයි. Top-2 ට වඩා expert compute සහ communication බාගයයි, implementation සරලයි, load-balancing loss එක්ක හොඳට වැඩ. Mixtral සහ පසු models ගොඩක් ආයේ top-2 ට ගියා. DeepSeekMoE: experts ගොඩක් පොඩි experts වලට කඩනවා (fine-grained segmentation), specialists ගේ නම්‍යශීලී combinations. ඒ වගේම හැමවිටම active shared experts කිහිපයක්: හැම token එකකටම ඕනේ පොදු දැනුම ඒවා අරගන්නවා, routed experts වලට specialize වෙන්න ඉඩ. Routing තවමත් per-token learned gate එකකින්.',
      ],
      analogy: 'MoE එක හරියට ලොකු hospital එකක OPD එක. Triage nurse (router) හැම patient (token) කෙනෙක්වම specialists 8 දෙනාගෙන් ගැළපෙනම 2 දෙනෙක් ළඟට යවනවා. හැම specialist ම salary ගන්නවා (memory), ඒත් patient කෙනෙක්ට වියදම් වෙන්නේ 2 දෙනෙක්ගේ කාලය (compute). Nurse හැමෝම එකම heart doctor ළඟට යැව්වොත් පෝලිම (load balancing ප්‍රශ්නය). Expert capacity = doctor කෙනෙක්ට දවසකට tokens 20යි: 21 වැන්නා අද specialist නැතුව general ward එකෙන් (residual) යනවා. Shared expert = හැමෝම ඉස්සෙල්ලා බලන GP කෙනෙක්.',
      example: 'Capacity ගණනය: batch එකේ tokens 4,096, experts 8, capacity factor 1.25. 4,096 / 8 = 512, × 1.25 = 640 slots per expert. Expert එකකට tokens 700ක් route වුණොත් 60ක් drop වෙලා residual එකෙන් යනවා. Router collapse: experts 2 දෙනෙක්ට tokens 90% ගියොත් අනිත් 6 දෙනා ප්‍රායෝගිකව train වෙන්නේ නෑ. Mixtral active: 46.7B total, top-2 නිසා ≈ 12.9B active, ඒ නිසා speed එක 13B-class, memory එක 47B-class (FP16 → ~93 GB weights).',
      keyPoints: [
        'Router = token එකකට top-k experts. Total params ලොකුයි, active params පොඩියි.',
        'Mixtral 8x7B ≈ 46.7B total, ≈ 12.9B active (attention share නිසා 56B නෙවෙයි).',
        'Downside = experts ඔක්කොම memory එකේ තියෙන්න ඕනේ.',
        'Aux load-balancing loss = router collapse වළක්වනවා (main loss එකට එකතු කරලා).',
        'Capacity = tokens/experts × factor. Overflow → drop → residual. Switch = top-1. DeepSeekMoE = fine-grained + shared experts.',
      ],
      terms: [
        { en: 'Router / Gate', si: 'Token එකකට experts score කරලා top-k තෝරන පොඩි learned layer එක.' },
        { en: 'Top-k Routing', si: 'Score වැඩිම experts k දෙනාට විතරක් token එක යවන එක.' },
        { en: 'Auxiliary Load-Balancing Loss', si: 'Experts අතර tokens සමානව බෙදෙන්න main loss එකට එකතු කරන අමතර loss එක.' },
        { en: 'Capacity Factor', si: 'Expert එකකට ලැබෙන slots සාමාන්‍ය ප්‍රමාණයට වඩා කොච්චර වැඩියෙන්ද කියන ගුණකය.' },
        { en: 'Token Dropping', si: 'පිරුණු expert එකකට ආපු token එක expert compute එක මගහැරලා residual එකෙන් යන එක.' },
        { en: 'Shared Expert', si: 'හැම token එකකටම හැමවිටම active වෙන expert එක (DeepSeekMoE).' },
      ],
    },

    // 17
    {
      id: 'state-space-models',
      title: 'State-Space Models: Mamba, Selective SSM, Parallel Scan සහ Hybrids',
      examRefs: ['NN-121', 'NN-122', 'NN-123', 'NN-124'],
      body: [
        'State-space model (SSM) එකක් RNN එකක් වගේ: මුළු ඉතිහාසයම constant-size state එකකට compress කරනවා. සරලව: h_t = A·h_(t−1) + B·x_t, y_t = C·h_t. h_t = state එක (මතකය), x_t = අලුත් input එක, A = පරණ මතකය කොච්චර තියාගන්නද, B = අලුත් input එක කොච්චර ලියනවද, C = state එකෙන් output එක කියවන විදිහ. ප්‍රධාන වාසිය: training cost එක sequence length එකට රේඛීයයි, generation වලදී වැඩෙන KV cache එකක් වෙනුවට fixed-size recurrent state එකක්. ඉතින් token එකකට generation cost සහ memory context එකත් එක්ක වැඩි වෙන්නේ නෑ. අවාසිය: කලින් ඕනෑම token එකක් හරියටම මතක් කරන (exact recall) හැකියාව full attention එකට වඩා දුර්වල වෙන්න පුළුවන්.',
        'Selective (Mamba): S4 වගේ කලින් SSMs වල parameters fixed, time-invariant: හැම token එකකටම එකම A, B, C. Mamba Δ (step size), B සහ C current input එකේ functions කරනවා. ඉතින් model එකට content එක අනුව "මේක තියාගන්න, මේක අමතක කරන්න" කියලා තෝරන්න පුළුවන්, RNN gate එකක් වගේ. "Selective" කියන්නේ layers තෝරන එක, experts තෝරන එක (MoE), top-k attention නෙවෙයි.',
        'Efficient training: Time-invariant SSMs (S4) මුළු sequence එකටම එක global convolution එකක් විදිහට ගණනය කරන්න පුළුවන්. Selectivity නිසා parameters token එකෙන් token එකට වෙනස් වෙන හින්දා ඒක කරන්න බෑ. ඒත් recurrence එක linear සහ associative, ඉතින් parallel (prefix) scan එකකින් ගණනය කරන්න පුළුවන්. Mamba මේ scan එක hardware-aware විදිහට SRAM ඇතුළේ fuse කරනවා, expanded state එක HBM එකේ materialize කරන්නේ නෑ (FlashAttention වගේම අදහසක්). Classic RNN එකක් වගේ token එකින් එක train කරන්නේ නෑ, attention වලට fall back වෙන්නෙත් නෑ.',
        'Hybrids (Jamba): attention layers කිහිපයක් Mamba layers ගොඩක් අතරට interleave කරලා, MoE FFN layers එකතු කරනවා. SSMs වල memory efficiency එකෙන් වැඩි කොටසක් ලැබෙනවා, attention එකේ නිවැරදි recall එක තියාගන්නවා, MoE වලින් capacity. SSMs වල දුර්වල in-context retrieval එකට hybrids කියන්නේ සුලභ උත්තරයක්.',
      ],
      analogy: 'Transformer එක හරියට lecture එකේ හැම වචනයක්ම record කරන voice recorder එකක්: ඕනෑම තැනක් හරියටම ආයේ අහන්න පුළුවන්, ඒත් පැය ගානක් ගියාම storage පිරෙනවා (KV cache). SSM එක හරියට එක පිටුවක notes ලියන ශිෂ්‍යයෙක්: පිටුව හැමවිටම එකම size, අලුත් දේ ලියද්දී පරණ දේ සාරාංශ කරනවා. Selective = "මේක විභාගෙට එනවා, ලියාගන්නවා; මේ joke එක අමතක කරනවා" කියලා තෝරන හොඳ ශිෂ්‍යයෙක්. Jamba = notes ලියන ගමන් වැදගත් තැන් කිහිපයක් විතරක් record කරනවා.',
      example: 'Memory සසඳමු: 7B transformer (KV cache 512 KiB per token, MHA) tokens 100,000ක් → ≈ 49 GiB cache. SSM එකක state එක context 1,000 වුණත් 100,000 වුණත් එකම size (layer එකකට MB කිහිපයක් වගේ). Parallel scan: tokens 1,048,576 (2²⁰) ක recurrence එකක් පිළිවෙළට කළොත් steps මිලියනයක්. Associative scan එකකින් parallel depth එක log₂(2²⁰) = 20 ක් පමණ (up-sweep/down-sweep වලින් ඒකේ දෙගුණයක් වගේ). එකතු කිරීම associative නිසා (1+2)+3 = 1+(2+3): කොටස් වෙන වෙනම ගණනය කරලා පස්සේ එකතු කරන්න පුළුවන්.',
      keyPoints: [
        'SSM = constant-size state. Training O(n), generation memory fixed (KV cache නෑ).',
        'Trade-off = arbitrary earlier tokens exact recall attention වලට වඩා දුර්වලයි.',
        'Selective (Mamba) = Δ, B, C input-dependent. S4 = time-invariant.',
        'Selectivity නිසා convolution බෑ → hardware-aware parallel scan SRAM එකේ.',
        'Jamba = attention + Mamba + MoE hybrid.',
      ],
      terms: [
        { en: 'State-Space Model (SSM)', si: 'Fixed-size state එකක් linear recurrence එකකින් update කරන sequence model එකක්.' },
        { en: 'S4', si: 'Time-invariant parameters තියෙන, convolution එකක් විදිහට train කරන්න පුළුවන් මුල් SSM එකක්.' },
        { en: 'Mamba', si: 'Input-dependent (selective) parameters තියෙන SSM architecture එක.' },
        { en: 'Parallel (Prefix) Scan', si: 'Associative operation එකක cumulative ප්‍රතිඵල parallel විදිහට ගණනය කරන algorithm එක.' },
        { en: 'Jamba', si: 'Attention, Mamba සහ MoE layers එකට ගත්ත hybrid model එක.' },
      ],
    },

    // 18
    {
      id: 'vision-and-multimodal',
      title: 'Vision Transformer, CLIP, LLaVA සහ ViT ට Data ගොඩක් ඕනේ ඇයි',
      examRefs: ['NN-046', 'NN-047', 'NN-100', 'NN-101', 'NN-145', 'NN-146', 'NN-147'],
      body: [
        'ViT image එක transformer input එකක් කරන්නේ මෙහෙමයි: image එක fixed-size patches වලට (උදා: 16×16) කපනවා, හැම patch එකක්ම flatten කරලා linear projection එකකින් token එකක් කරනවා, position embeddings එකතු කරනවා, මුලට class token එකක් ([CLS]) දානවා. හැම pixel එකක්ම token එකක් කළොත් sequence එක අතිවිශාලයි, attention O(n²) නිසා ගණනය කරන්න බෑ.',
        'ViT ට data ගොඩක් ඕනේ ඇයි: CNN එකකට locality සහ translation equivariance කියන inductive biases architecture එකෙන්ම ලැබෙනවා. ViT ට ඒවා නෑ: patch එකකට ඕනෑම patch එකකට කෙළින්ම attend කරන්න පුළුවන්, "ළඟ pixels වැදගත්" කියන එක data එකෙන් ඉගෙන ගන්න ඕනේ. ImageNet-1k (images මිලියනයක් පමණ) විතරක් දීපුවාම මුල් ViT එක CNNs වලට පස්සෙන් හිටියා. ගොඩක් ලොකු datasets වල pretrain කළාම ඒ biases නැතිකම ප්‍රශ්නයක් නෙවෙයි, වාසියක් පවා වෙනවා. DeiT strong augmentation සහ distillation වලින් ImageNet විතරක් පාවිච්චි කරලා ViT හොඳට train කළා.',
        'CLIP: image encoder එකක් සහ text encoder එකක් එකට train කරනවා, matching pairs වල cosine similarity වැඩි, mismatched ඒවායේ අඩු වෙන්න (contrastive learning). Loss එක: batch එකේ pairs N නම් N × N similarity matrix එකක්, diagonal එකේ matching pairs targets. Symmetric cross-entropy: හැම image එකක්ම N texts අතරින් තමන්ගේ caption එක තෝරන්න ඕනේ, හැම text එකක්ම N images අතරින් තමන්ගේ image එක. Learned temperature එකකුත් තියෙනවා. අනිත් N − 1 negatives, ඒ නිසා ලොකු batches උදව්. MSE විතරක් දැම්මොත් embeddings එකට ඇදෙනවා, mismatched pairs ඈත් කරන්නේ නෑ, collapse වෙන්න පුළුවන්.',
        'CLIP zero-shot: labels "a photo of a {label}" වගේ prompts කරලා embed කරනවා, image embedding එකට වැඩියෙන්ම similar text embedding එකේ label එක තෝරනවා. කිසිම training එකක් නෑ. Head එකක් fine-tune කරන එක linear probing, zero-shot නෙවෙයි. CLIP-style text encoder එකක් text-to-image diffusion models ඇතුළේ පාවිච්චි වුණත් CLIP එක diffusion model එකක් නෙවෙයි. LLaVA-style multimodal LLMs: pretrained vision encoder එකක් (CLIP ViT) patch features දෙනවා, projector එකක් ඒවා LLM එකේ token embedding space එකට map කරනවා. ඒ visual tokens text tokens එක්ක sequence එකට දානවා, වෙනස් නොකළ LLM එක ඒවාට attend කරනවා. මුලින් caption එකක් කරලා දුන්නොත් visual detail ගොඩක් නැති වෙනවා.',
      ],
      analogy: 'ViT = Lunu Dehi puzzle එකක් වගේ photo එකක් කෑලි 196කට කපලා, හැම කෑල්ලක්ම "වචනයක්" විදිහට transformer එකට කියවන්න දෙනවා. CNN = "ළඟ කෑලි එකට ගැළපෙනවා" කියලා කලින්ම දන්න පරණ puzzle expert කෙනෙක්. ViT = ඒ නීතිය නොදන්න අලුත් කෙනෙක්: puzzles දහස් ගණනක් කළාම ඒ expert ට වඩා දක්ෂ වෙනවා, ඒත් puzzles ටිකකින් බෑ. CLIP = wedding photographer කෙනෙක්ට photos 32යි නම් 32යි දීලා "හැම photo එකටම හරි caption එක ගළපන්න" කියන game එක.',
      example: 'ViT sequence length: 224 × 224 image, 16 × 16 patches. 224 / 16 = 14 patches per side. 14 × 14 = 196 patch tokens. [CLS] එකත් එක්ක 197. (14 කියන්නේ එක පැත්තක් විතරයි. 3,136 = 56 × 56, ඒ කියන්නේ 4 × 4 patches.) එක patch එකක අගයන් = 16 × 16 × 3 (RGB) = 768, ViT-Base d_model එකත් 768. Per-pixel tokens: 224 × 224 = 50,176 tokens → attention scores 2.5 බිලියනයක් per head. CLIP batch 32,768 නම් එක image එකකට negatives 32,767ක්.',
      keyPoints: [
        'ViT = patches → flatten → linear embed → + positions + [CLS].',
        '224/16 = 14 → 196 patches (+1 CLS = 197).',
        'ViT ට CNN inductive biases නෑ → data ගොඩක් ඕනේ. DeiT = augmentation + distillation.',
        'CLIP = contrastive, N×N symmetric cross-entropy, learned temperature. Zero-shot = text prompts සමඟ similarity.',
        'LLaVA = CLIP ViT features → projector → LLM token space.',
      ],
      terms: [
        { en: 'Patch Embedding', si: 'Image patch එකක් flatten කරලා d_model vector එකකට project කරන එක.' },
        { en: 'Contrastive Learning', si: 'Matching pairs ළං කරලා mismatched pairs ඈත් කරන training ක්‍රමය.' },
        { en: 'Temperature (CLIP)', si: 'Similarity scores softmax එකට කලින් scale කරන learned අංකය.' },
        { en: 'Zero-shot Classification', si: 'අලුත් labels වලට කිසිම training එකක් නැතුව classify කරන එක.' },
        { en: 'Linear Probing', si: 'Frozen features උඩ පොඩි linear head එකක් විතරක් train කරන එක.' },
        { en: 'Projector (VLM)', si: 'Vision features LLM embedding space එකට map කරන පොඩි network එක.' },
      ],
    },

    // 19
    {
      id: 'generative-architectures',
      title: 'Autoencoders, VAE Reparameterization, Diffusion (DDPM, DDIM, CFG, Latent, DiT) සහ FID',
      examRefs: ['NN-044', 'NN-045', 'NN-049', 'NN-102', 'NN-103', 'NN-104', 'NN-105', 'NN-142', 'NN-143', 'NN-144'],
      body: [
        'Autoencoder: encoder එක input එක පොඩි latent code එකකට (bottleneck) compress කරනවා, decoder එක ආයේ input එක reconstruct කරනවා, reconstruction loss එකකින් train වෙනවා. GAN එකක් කවදාවත් දීපු input එකක් reconstruct කරන්නේ නෑ. VAE (Variational Autoencoder): reconstruction loss එකට අමතරව KL divergence term එකක්, encoder එකේ latent distribution එක standard normal prior එකට ඇදලා තියනවා. ඒ නිසා latent space එක smooth, sample කරන්න පුළුවන්. මුළු objective එක ELBO. Adversarial loss GAN වල.',
        'Reparameterization trick: N(μ, σ²) එකකින් කෙළින්ම sample කරන එක μ, σ ට differentiable නෑ (random dice roll එකක් හරහා gradient යවන්න බෑ). ඒ වෙනුවට z = μ + σ ⊙ ε, ε ~ N(0, I). Randomness එක fixed ε එකට ගෙනියනවා, z දැන් μ සහ σ වල සාමාන්‍ය differentiable function එකක්. Latent discrete වෙන්නේ නෑ, KL term එක තවමත් loss එකේ.',
        'Diffusion (DDPM): training වලදී network එකක් ටිකෙන් ටික noise එකතු කරන process එකක් reverse කරන්න ඉගෙන ගන්නවා (සාමාන්‍යයෙන් එකතු කරපු noise ε predict කරනවා). Sampling = pure noise එකෙන් පටන් අරන් steps ගොඩක් iterative denoise. Single pass + discriminator = GAN, pixel එකින් එක = autoregressive. Forward process closed form: x_t = √ᾱ_t · x₀ + √(1 − ᾱ_t) · ε. ᾱ_t = (1 − β_s) වල cumulative product එක (β = step එකකට noise ප්‍රමාණය). Gaussian steps compose වෙන නිසා ඕනෑම timestep එකකට එක පියවරකින් යන්න පුළුවන්, training වලදී chain එක simulate නොකර random t sample කරනවා. DDIM: එකම DDPM objective එකට ගැළපෙන non-Markovian reverse process එකක්. එකම trained network එකෙන් retrain නැතුව steps 1,000 වෙනුවට ~50කින් sample කරන්න පුළුවන්. Stochasticity 0 නම් deterministic: එකම starting noise → එකම image.',
        'Classifier-free guidance (CFG): එකම model එක prompt එක්කත් (conditional) prompt නැතුවත් (unconditional) noise predict කරනවා (training වලදී prompt එක අහඹු ලෙස drop කරලා). Output = ε_uncond + w · (ε_cond − ε_uncond). w > 1 නම් unconditional එකෙන් conditional එක දිශාවට extrapolate කරනවා, prompt එකට වැඩිපුර කීකරු වෙනවා. External classifier එකක gradients පාවිච්චි කරපු පරණ ක්‍රමය classifier guidance. Latent diffusion (Stable Diffusion): VAE encoder එක image එක compressed latent එකකට හරවනවා, denoising ඒ latent space එකේ, අන්තිමට VAE decoder එක pixels වලට. Steps තවමත් ගොඩක් (distilled sampler නැත්නම්). DiT (Diffusion Transformer): U-Net denoiser එක වෙනුවට latent patches මත transformer එකක් (ViT වගේ patchify), timestep සහ class conditioning adaptive layer norm (adaLN) එකෙන්. Transformer compute එක්ක quality predictable විදිහට වැඩි වෙනවා. තවමත් VAE latent සහ iterative denoising.',
        'FID (Fréchet Inception Distance): real සහ generated images Inception network එකකින් embed කරලා, set එකකට Gaussian එකක් fit කරලා, ඒ Gaussians දෙක අතර Fréchet distance එක. අඩු = හොඳයි. Quality සහ diversity දෙකම පිළිබිඹු කරනවා. BLEU (text), perplexity (tractable likelihood ඕනේ), top-1 accuracy image generators සසඳන්න standard නෙවෙයි.',
      ],
      analogy: 'Diffusion = පරණ, දූවිලි වැදුණු පින්තූරයක් restore කරන artist කෙනෙක්. Training: හොඳ පින්තූර වලට දූවිලි ටිකෙන් ටික දාලා "දූවිලි මොනවද" කියලා හොයාගන්න පුරුදු වෙනවා. Generation: සම්පූර්ණ දූවිලි canvas එකකින් පටන් අරන් දූවිලි ටිකෙන් ටික අයින් කරනවා. DDIM = එකම artist ට steps 1,000 වෙනුවට 50කින් කරන්න කෙටි ක්‍රමයක්. CFG = customer "තව ටිකක් මගේ description එකට ගැළපෙන්න" කියලා තල්ලු කරනවා. Reparameterization = lottery එකේ අහඹු අංකය (ε) වෙනම පෙට්ටියකින් ගන්නවා, ඔයාගේ choices (μ, σ) පිරිසිදුවම පේනවා.',
      example: 'DDPM closed form: β හැම step එකකටම 0.01 නම් t = 100 දී ᾱ = 0.99¹⁰⁰ ≈ 0.366. √ᾱ ≈ 0.605, √(1 − ᾱ) ≈ 0.796. ඉතින් x₁₀₀ ≈ 0.605 × image + 0.796 × noise, steps 100ක් simulate නොකරම. CFG: ε_uncond = 0.20, ε_cond = 0.50, w = 7.5 → 0.20 + 7.5 × 0.30 = 2.45. Reparameterization: μ = 1.0, σ = 0.5, ε = −0.4 → z = 1.0 + 0.5 × (−0.4) = 0.8. Latent diffusion: 512 × 512 × 3 = 786,432 අගයන් → 64 × 64 × 4 = 16,384, 48 ගුණයක් අඩුයි, හැම denoising step එකක්ම ඒ තරමට ලාභයි.',
      keyPoints: [
        'Autoencoder = bottleneck + reconstruction. VAE = + KL to N(0, I) prior (ELBO).',
        'Reparameterization: z = μ + σ⊙ε → μ, σ හරහා gradients.',
        'DDPM: x_t = √ᾱ_t·x₀ + √(1−ᾱ_t)·ε (closed form). DDIM = deterministic, ~50 steps, retrain නෑ.',
        'CFG = ε_uncond + w(ε_cond − ε_uncond). Latent diffusion = VAE latent එකේ denoise. DiT = U-Net → transformer.',
        'FID = Inception features වල Gaussians දෙකක දුර. අඩු = හොඳ.',
      ],
      terms: [
        { en: 'KL Divergence', si: 'Probability distributions දෙකක් කොච්චර වෙනස්ද කියන මිනුම.' },
        { en: 'ELBO', si: 'Evidence Lower Bound. VAE maximize කරන objective එක (reconstruction − KL).' },
        { en: 'Noise Schedule (β)', si: 'Step එකකට එකතු කරන noise ප්‍රමාණය තීරණය කරන අංක පෙළ.' },
        { en: 'DDIM', si: 'DDPM-trained model එකෙන් deterministic, steps අඩු sampling.' },
        { en: 'Classifier-Free Guidance', si: 'Conditional සහ unconditional predictions අතර extrapolate කරලා prompt adherence වැඩි කරන එක.' },
        { en: 'adaLN', si: 'Timestep/class conditioning එකෙන් LayerNorm scale සහ shift තීරණය කරන ක්‍රමය (DiT).' },
        { en: 'FID', si: 'Real සහ generated image distributions අතර දුර. අඩු වුණාම හොඳයි.' },
      ],
    },

    // 20 (beyond exam)
    {
      id: 'tiny-gpt-forward-pass-and-config',
      title: 'Beyond the Exam: Tiny GPT එකක Forward Pass එක Shapes එක්ක සහ config.json කියවීම',
      examRefs: ['NN-035', 'NN-048', 'NN-052', 'NN-061', 'NN-090', 'NN-094'],
      body: [
        'දැන් අපි ඉගෙන ගත්ත කෑලි ඔක්කොම එකට තියලා tiny GPT එකක් හරහා එක forward pass එකක් යමු. Settings: vocab 1,000, d_model 64, heads 4 (head_dim 16), layers 2, FFN hidden 256, batch 1, input tokens 5. (1) Token IDs: (1, 5). (2) nn.Embedding lookup: (1, 5, 64). Learned positions නම් position vectors (5, 64) එකතු කරනවා (RoPE නම් මෙතන නෙවෙයි, attention ඇතුළේ). (3) Block එක ඇතුළේ: Norm → (1, 5, 64). Q, K, V projections: (1, 5, 64) බැගින්. Heads වලට reshape + transpose: (1, 4, 5, 16). Scores q@kᵀ: (1, 4, 5, 5). Causal mask, softmax. weights@v: (1, 4, 5, 16). Transpose + reshape: (1, 5, 64). W_O: (1, 5, 64). Residual add.',
        '(4) දෙවෙනි sublayer: Norm → FFN up: (1, 5, 256) → GELU → down: (1, 5, 64) → residual add. (5) Block 2 එකේත් එකම දේ; shapes වෙනස් වෙන්නේ නෑ: residual stream එක හැමවිටම (1, 5, 64). (6) Final norm (pre-norm නිසා). (7) LM head: (1, 5, 64) → (1, 5, 1,000) logits. Training වලදී positions 5ම targets (1කින් shift කරපු tokens) එක්ක cross-entropy. Generation වලදී අන්තිම position එකේ logits (1,000) විතරක් ගන්නවා, softmax/sampling කරලා ඊළඟ token එක, ඒක sequence එකට එකතු කරලා ආයේ (KV cache එක්ක අලුත් token එක විතරක් process කරනවා).',
        'config.json කියවීම: Hugging Face model එකක config.json එක architecture එකේ blueprint එක. ප්‍රධාන fields: hidden_size (d_model), num_hidden_layers (L), num_attention_heads (query heads), num_key_value_heads (GQA KV heads; query heads ට සමාන නම් MHA, 1 නම් MQA), intermediate_size (FFN hidden size), hidden_act (silu නම් SwiGLU-style gated MLP), vocab_size, max_position_embeddings (train කරපු context), rope_theta (RoPE base), rms_norm_eps (RMSNorm ε), tie_word_embeddings (weight tying). මේ ටිකෙන් ඔයාට parameters, KV cache size, head_dim (hidden_size / num_attention_heads) ඔක්කොම ගණනය කරන්න පුළුවන්.',
      ],
      analogy: 'Forward pass එක හරියට tea factory එකක production line එක: දළු (token IDs) ඇතුළට, withering (embedding), rolling සහ fermenting stations (blocks) කිහිපයක්, හැම station එකකම "පරණ තේ + අලුත් වෙනස" (residual), අන්තිමට grading (LM head) එකෙන් "BOPF ද, Dust ද" කියලා probabilities. config.json කියන්නේ factory එකේ machine spec sheet එක: ඒක කියෙව්වම factory එක කොච්චර ලොකුද, මොන machines ද කියලා ගණනය කරන්න පුළුවන්.',
      example: 'Llama-3-8B config එක: hidden_size 4,096, layers 32, heads 32, num_key_value_heads 8, intermediate_size 14,336, vocab 128,256, tie_word_embeddings false. head_dim = 4,096/32 = 128. Layer එකක attention: W_Q 4,096² = 16.78M, W_K සහ W_V 4,096 × 1,024 = 4.19M බැගින්, W_O 16.78M → 41.9M. SwiGLU: 3 × 4,096 × 14,336 = 176.2M. Norms 8,192. Layer එකට ≈ 218.1M, × 32 = 6.98B. Embeddings: 128,256 × 4,096 = 525.3M, untied → × 2 = 1.05B. එකතුව ≈ 8.03B. KV cache: 2 × 32 × 8 × 128 × 2 bytes = 128 KiB per token, 8,192 tokens → 1 GiB.',
      code: {
        lang: 'python',
        src: `cfg = dict(hidden_size=4096, num_hidden_layers=32, num_attention_heads=32,
           num_key_value_heads=8, intermediate_size=14336, vocab_size=128256,
           tie_word_embeddings=False)
d, L, h, kv = cfg['hidden_size'], cfg['num_hidden_layers'], cfg['num_attention_heads'], cfg['num_key_value_heads']
hd = d // h                                          # head_dim = 128
attn = 2 * d * d + 2 * d * (kv * hd)                 # Q, O + K, V (GQA)
mlp = 3 * d * cfg['intermediate_size']               # gate, up, down
emb = cfg['vocab_size'] * d * (1 if cfg['tie_word_embeddings'] else 2)
total = L * (attn + mlp + 2 * d) + emb + d           # + norms
print(round(total / 1e9, 2), 'B params')             # ~8.03
print(2 * L * kv * hd * 2 / 1024, 'KiB KV cache per token (FP16)')  # 128`,
      },
      keyPoints: [
        'Residual stream shape එක මුළු model එක පුරාම (B, T, d_model).',
        'Attention ඇතුළේ විතරක් (B, H, T, head_dim) සහ (B, H, T, T).',
        'LM head = (B, T, vocab). Generation වලදී අන්තිම position එකේ logits විතරයි.',
        'config.json → head_dim, GQA ratio, parameters, KV cache ඔක්කොම ගණනය කරන්න පුළුවන්.',
      ],
      terms: [
        { en: 'config.json', si: 'Hugging Face model එකක architecture hyperparameters තියෙන file එක.' },
        { en: 'num_key_value_heads', si: 'GQA KV heads ගණන. Query heads ට සමාන නම් MHA.' },
        { en: 'intermediate_size', si: 'FFN/MLP hidden size එක.' },
        { en: 'tie_word_embeddings', si: 'Input embedding සහ LM head share කරනවද කියන flag එක.' },
        { en: 'rope_theta', si: 'RoPE base frequency එක (10,000, 500,000 වගේ).' },
      ],
    },
  ],

  quiz: [
    {
      q: 'Sigmoid layers 10ක් හරහා (හැම එකකම derivative එක උපරිම 0.25, weights ≈ 1) පළමු layer එකට එන gradient factor එක ආසන්න වශයෙන් කීයද?',
      options: ['0.025', '2.5', 'ආසන්න වශයෙන් 10⁻⁶', 'ආසන්න වශයෙන් 10⁻²⁰'],
      answer: 2,
      why: '0.25¹⁰ ≈ 9.5 × 10⁻⁷ ≈ 10⁻⁶. 0.025 එන්නේ 0.25 × 0.1 කියලා වැරදියට ගුණ කළොත්. බලය (power) දාන්න ඕනේ.',
    },
    {
      q: 'SwiGLU FFN එකක d_model = 4,096, hidden = 11,008, biases නෑ. Parameters කීයද?',
      options: ['≈ 45M', '≈ 90M', '≈ 135M', '≈ 180M'],
      answer: 2,
      why: 'Gate, up, down matrices තුනයි, හැම එකක්ම 4,096 × 11,008 ≈ 45.1M. 3 × 45.1M ≈ 135M. 90M = matrices දෙකක් විතරක් ගණන් කරපු වැරැද්ද.',
    },
    {
      q: 'd_model = 4,096, query heads 32 (head_dim 128), KV heads 8 තියෙන GQA model එකක W_K matrix එකේ shape එක මොකක්ද?',
      options: ['4,096 × 4,096', '4,096 × 1,024', '4,096 × 128', '1,024 × 1,024'],
      answer: 1,
      why: 'W_K = d_model × (KV heads × head_dim) = 4,096 × (8 × 128) = 4,096 × 1,024. 4,096 × 4,096 = MHA, 4,096 × 128 = MQA.',
    },
    {
      q: 'Layer එකක්, heads 32, batch 1, sequence 4,096, FP16 නම් full attention score matrix එකට memory කීයද?',
      options: ['32 MiB', '128 MiB', '512 MiB', '1 GiB'],
      answer: 3,
      why: '4,096² = 16.8M scores × 32 heads = 536.9M scores × 2 bytes = 1,073,741,824 bytes = 1 GiB. FlashAttention මේක materialize කරන්නේ නැත්තේ ඒ නිසා.',
    },
    {
      q: 'FlashAttention ගැන වැරදි ප්‍රකාශය කුමක්ද?',
      options: [
        'ඒක HBM reads/writes අඩු කරනවා',
        'ඒක standard attention එකට වඩා වෙනස් approximate outputs දෙනවා',
        'Forward pass එකේ අමතර memory O(n) (row statistics)',
        'FLOPs තවමත් O(n²)',
      ],
      answer: 1,
      why: 'FlashAttention exact (rounding හැර). වාසිය memory traffic වලින්. Backward එකේදී save කරපු statistics වලින් recompute කරනවා.',
    },
    {
      q: 'RoPE relative position encode කරනවා කියන්නේ ඇයි, vectors absolute position එකෙන් rotate කළත්?',
      options: [
        'Distance එකකට learned bias එකක් එකතු කරන නිසා',
        'Position m න් rotate කරපු query එකයි n න් rotate කරපු key එකයි අතර dot product එක m − n මත විතරක් රඳා පවතින නිසා',
        'Positions sequence length එකෙන් බෙදන නිසා',
        'Adjacent tokens වලට විතරක් apply වෙන නිසා',
      ],
      answer: 1,
      why: 'Rotations compose වෙනවා: (R_m q)·(R_n k) = q·(R_(n−m) k). Learned bias per distance කියන්නේ T5 relative bias.',
    },
    {
      q: 'Chinchilla rule of thumb එකට අනුව 70B model එකකට compute-optimal training tokens කීයද?',
      options: ['140B', '300B', '1.4T', '14T'],
      answer: 2,
      why: '70B × parameter එකකට tokens 20 = 1.4T. 300B කියන්නේ 175B GPT-3 පාවිච්චි කරපු ප්‍රමාණය, ඒක undertrained.',
    },
    {
      q: 'Sliding-window attention, window 4,096, layers 32. Input එකේ ඉඳන් top layer එකට තොරතුරු යන්න පුළුවන් theoretical උපරිම දුර කීයද?',
      options: ['4,096', '8,192', '32', '≈ 131K (32 × 4,096)'],
      answer: 3,
      why: 'හැම layer එකක්ම තව window එකක් පස්සට තොරතුරු ගෙනියනවා, ඉතින් receptive field ≈ layers × w = 131,072. ප්‍රායෝගික recall එක මීට අඩුයි.',
    },
    {
      q: 'MoE training වලදී දැනටමත් පිරුණු expert කෙනෙක්ට route වෙන tokens වලට සාමාන්‍යයෙන් මොකද වෙන්නේ?',
      options: [
        'Experts ඔක්කොටම යවනවා',
        'මුළු batch එකම discard කරනවා',
        'ඒ layer එකේ expert computation එකෙන් drop වෙලා residual connection එක හරහා යනවා',
        'Expert capacity එක automatic වැඩි වෙනවා',
      ],
      answer: 2,
      why: 'Fixed capacity = (tokens/experts) × capacity factor නිසා static shapes ලැබෙනවා. Overflow tokens expert එක මගහැරලා residual එකෙන් ඉස්සරහට යනවා.',
    },
    {
      q: 'Text-to-image diffusion වල classifier-free guidance කරන්නේ මොකක්ද?',
      options: [
        'වෙනම image classifier එකක් train කරලා sampling steer කරනවා',
        'Unconditional noise prediction එකේ ඉඳන් text-conditional prediction එක දිශාවට extrapolate කරනවා',
        'Sampling වලදී text encoder එක අයින් කරනවා',
        'Denoising steps එකකට අඩු කරනවා',
      ],
      answer: 1,
      why: 'ε = ε_uncond + w·(ε_cond − ε_uncond). එකම model එක prompt එක්කත් නැතුවත් predict කරනවා. External classifier gradients කියන්නේ පරණ classifier guidance.',
    },
  ],
}
