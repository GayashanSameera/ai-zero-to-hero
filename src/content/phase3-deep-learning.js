export default {
  id: 'deep-learning',
  number: 3,
  title: 'Neural Networks & Deep Learning',
  titleSi: 'Neural Networks & Deep Learning: මොළය අනුකරණය කරන layers ගොඩක්',
  summary: 'Deep Learning කියන්නේ neurons layers ගොඩක් එක උඩ එක තියලා, data වලින්ම patterns ඉගෙන ගන්න ක්‍රමය. පින්තූර හඳුනගන්න, කතාව තේරුම් ගන්න, ChatGPT වගේ models හදන්න පදනම මේකයි. මේ phase එකෙන් ඔයාට neuron එකේ ඉඳන් CNN, RNN, GAN දක්වා මුළු පින්තූරයම තේරෙයි.',
  duration: 'සති 8-10',
  topics: [
    {
      id: 'neurons-perceptron',
      title: 'Neurons, Perceptron & MLP',
      lab: 'neuron',
      body: [
        'Neural network එකක පොඩිම කොටස neuron එකයි. Neuron එකකට inputs කීපයක් එනවා. හැම input එකක්ම weight එකකින් ගුණ කරනවා. ඊට පස්සේ ඒ ඔක්කොම එකතු කරලා bias කියන අංකයක් එකතු කරනවා. අන්තිමට ඒ එකතුව activation function එකක් හරහා යවලා output එක දෙනවා.',
        'Weight එකෙන් කියන්නේ ඒ input එක කොච්චර වැදගත්ද කියලා. ලොකු weight එකක් නම් ඒ input එකට ලොකු බලයක් තියෙනවා. Negative weight එකක් නම් ඒ input එක output එක අඩු කරනවා. Bias එක කියන්නේ inputs ඔක්කොම 0 වුණත් neuron එකට තියෙන පටන් ගැනීමේ තල්ලුව.',
        'Perceptron කියන්නේ 1958 දී Frank Rosenblatt හදපු පළමු neuron model එක. ඒකෙන් පුළුවන් සරල ඔව් / නෑ තීරණ ගන්න විතරයි. ඒකට XOR වගේ ටිකක් සංකීර්ණ pattern එකක් ඉගෙන ගන්න බෑ, මොකද ඒකට ඇඳිය හැක්කේ කෙළින් ඉරක් විතරයි.',
        'ඒ ප්‍රශ්නය විසඳන්න neurons ගොඩක් layers වලට දානවා. මේකට කියන්නේ MLP (Multi-Layer Perceptron) කියලා. Input layer එක data ගන්නවා, hidden layers මැද වැඩ කරනවා, output layer එක උත්තරය දෙනවා. Hidden layers ගොඩක් තියෙනකොට ඒකට "deep" කියනවා. Deep Learning කියන නම ආවේ එතනින්.',
      ],
      analogy: 'කඩේකින් බත් පැකට් එකක් ගන්නද නැද්ද කියලා ඔයා තීරණය කරනවා කියලා හිතන්න. Inputs: බඩගිනිද, මිල කීයද, කඩේ කොච්චර දුරද. බඩගින්නට ලොකු weight එකක්. මිලට negative weight එකක්. ඔයාට බත් වලට තියෙන සාමාන්‍ය ආසාව තමයි bias එක. ඔක්කොම එකතු කරලා ඒක සීමාවකට වඩා වැඩි නම් "ගන්නවා" කියලා තීරණය කරනවා. ඒ තීරණය කරන කොටස activation function එක.',
      example: 'Inputs දෙකක් තියෙනවා: x1 = 2, x2 = 3. Weights: w1 = 0.5, w2 = -1. Bias = 1. එකතුව = (2 × 0.5) + (3 × -1) + 1 = 1 - 3 + 1 = -1. ReLU activation එක දැම්මොත් negative අගයක් 0 වෙනවා, ඉතින් output එක 0. Sigmoid දැම්මොත් output එක 0.27 විතර, ඒ කියන්නේ "ඔව්" වෙන්න 27% විතර ඉඩක්.',
      keyPoints: [
        'Neuron = (inputs × weights) එකතුව + bias, ඊට පස්සේ activation function එක.',
        'Weights සහ biases තමයි training වලදී model එක ඉගෙන ගන්නා knobs.',
        'Perceptron එකට කෙළින් ඉරකින් බෙදන්න පුළුවන් දේවල් විතරයි ඉගෙන ගන්න පුළුවන්.',
        'MLP = neurons layers ගොඩක්. Hidden layers වැඩි වෙනකොට network එක "deep" වෙනවා.',
      ],
      terms: [
        { en: 'Neuron', si: 'Inputs අරගෙන, weights වලින් ගුණ කරලා, එකතු කරලා, activation එකක් හරහා output එකක් දෙන පොඩි ගණන් කොටස.' },
        { en: 'Weight', si: 'එක input එකක් කොච්චර වැදගත්ද කියන අංකය. Training වලදී මේක වෙනස් වෙනවා.' },
        { en: 'Bias', si: 'Inputs වලට සම්බන්ධ නැති, neuron එකට එකතු කරන අමතර අංකය. Output එක උඩට පහළට තල්ලු කරනවා.' },
        { en: 'Perceptron', si: '1958 දී හදපු පළමු සරල neuron model එක. ඔව් / නෑ විතරක් දෙනවා.' },
        { en: 'MLP (Multi-Layer Perceptron)', si: 'Input, hidden, output layers තියෙන, හැම neuron එකක්ම ඊළඟ layer එකේ හැම neuron එකකටම සම්බන්ධ network එක.' },
        { en: 'Layer (Input / Hidden / Output)', si: 'එකම මට්ටමේ තියෙන neurons ගොඩක්. Input layer එක data ගන්නවා, hidden layers ඇතුළේ වැඩ කරනවා, output layer එක උත්තරය දෙනවා.' },
      ],
    },
    {
      id: 'activation-functions',
      title: 'Activation Functions',
      body: [
        'Activation function එක neuron එකේ එකතුව අරගෙන ඒක වෙනත් හැඩයකට හරවනවා. මේක නැත්නම් layers කීයක් තිබ්බත් මුළු network එකම එක කෙළින් ඉරක් (linear function එකක්) වගේ වැඩ කරනවා. Activation functions නිසා තමයි network එකට වංගු සහිත, සංකීර්ණ patterns ඉගෙන ගන්න පුළුවන් වෙන්නේ. මේකට කියන්නේ non-linearity කියලා.',
        'Sigmoid එක ඕනෑම අංකයක් 0 සහ 1 අතරට හකුළනවා. Probability එකක් වගේ. Tanh එක -1 සහ 1 අතරට හකුළනවා, මැද 0 නිසා sigmoid එකට වඩා train කරන්න ටිකක් ලේසියි. ඒත් මේ දෙකේම ප්‍රශ්නයක් තියෙනවා: ගොඩක් ලොකු හෝ ගොඩක් පොඩි inputs වලදී curve එක පැතලි වෙනවා. එතකොට gradient එක 0ට ළඟ වෙනවා, ඉගෙනීම හෙමින් වෙනවා.',
        'ReLU (Rectified Linear Unit) ගොඩක් සරලයි: negative නම් 0, positive නම් ඒ අගයම. වේගවත් නිසා අද ගොඩක් networks වල default එක මේකයි. ඒත් සමහර neurons හැමවෙලේම 0 දිදී "මැරෙන්න" පුළුවන් (dying ReLU). Leaky ReLU එක ඒක විසඳනවා: negative අගයන්ට 0 වෙනුවට පොඩි slope එකක් (උදා: 0.01 × x) දෙනවා.',
        'GELU සහ Swish කියන්නේ ReLU එකේ සුමට (smooth) versions. GELU, BERT සහ GPT වගේ Transformer models වල ගොඩක් පාවිච්චි වෙනවා. Swish = x × sigmoid(x), ඒකට SiLU කියලත් කියනවා. Softmax වෙනස්: ඒක එක අංකයක් නෙවෙයි, අංක ලැයිස්තුවක්ම probabilities බවට හරවනවා. ඒ probabilities ඔක්කොම එකතු කළාම 1යි. Classes කීපයකින් එකක් තෝරන output layer එකේ softmax දානවා.',
      ],
      analogy: 'නාන කාමරේ වතුර tap එක හිතන්න. Sigmoid කියන්නේ වතුර කොච්චර ඇරියත් උපරිම ප්‍රමාණයකට වඩා එන්නේ නැති tap එකක්. ReLU කියන්නේ tap එක වහලා තියෙනකොට එක බින්දුවක්වත් එන්නේ නැති, ඇරපු ගාණට වතුර එන tap එකක්. Leaky ReLU කියන්නේ වහලා තිබ්බත් පොඩ්ඩක් බේරෙන tap එකක්.',
      example: 'Cricket match එකක ප්‍රතිඵලය අනුමාන කරන model එකක output layer එක scores 3ක් දෙනවා: Sri Lanka දිනුම = 2, India දිනුම = 1, Draw = 0. Softmax දැම්මාම මේවා වෙනවා: Sri Lanka 66.5%, India 24.5%, Draw 9%. එකතුව 100%යි. ඒ කියන්නේ model එක හිතන්නේ Sri Lanka දිනන්න වැඩිම ඉඩ තියෙනවා කියලා.',
      keyPoints: [
        'Activation functions නැත්නම් deep network එකත් සරල linear model එකක් වගේ.',
        'Hidden layers වලට ReLU (හෝ Leaky ReLU, GELU) සාමාන්‍යයෙන් හොඳයි.',
        'Sigmoid = 0-1, ඔව් / නෑ output එකකට. Softmax = classes කීපයකට probabilities.',
        'Sigmoid සහ Tanh අන්ත වලදී පැතලි වෙන නිසා deep networks වල gradients නැති වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Sigmoid', si: 'ඕනෑම අංකයක් 0 සහ 1 අතරට හකුළන S හැඩැති curve එක.' },
        { en: 'Tanh', si: 'අංක -1 සහ 1 අතරට හකුළන S curve එක. මැද 0යි.' },
        { en: 'ReLU', si: 'Negative නම් 0, positive නම් ඒ අගයම. සරල සහ වේගවත්.' },
        { en: 'Leaky ReLU', si: 'Negative අගයන්ට 0 වෙනුවට පොඩි slope එකක් දෙන ReLU එක. Neurons මැරෙන එක අඩු කරනවා.' },
        { en: 'GELU', si: 'ReLU වගේම, ඒත් සුමට curve එකක්. BERT, GPT වගේ Transformers වල ජනප්‍රියයි.' },
        { en: 'Swish (SiLU)', si: 'x × sigmoid(x). Google researchers හොයාගත්ත සුමට activation එකක්.' },
        { en: 'Softmax', si: 'Scores ලැයිස්තුවක් එකතුව 1 වෙන probabilities බවට හරවන function එක.' },
        { en: 'Non-linearity', si: 'කෙළින් ඉරක් නොවන හැඩය. Network එකට සංකීර්ණ දේ ඉගෙන ගන්න මේක ඕනේ.' },
      ],
    },
    {
      id: 'forward-backprop',
      title: 'Forward Propagation & Backpropagation',
      body: [
        'Forward propagation කියන්නේ data එක input layer එකේ ඉඳන් output layer එකට layer එකෙන් layer එකට යවලා අනුමානයක් (prediction) ගන්න එක. ඊට පස්සේ ඒ අනුමානය ඇත්ත උත්තරයට සසඳලා loss එක (වැරැද්ද) ගණන් කරනවා.',
        'Backpropagation කියන්නේ ඒ වැරැද්ද ආපස්සට, output එකේ ඉඳන් input එක පැත්තට යවන එක. ඒ ගමනේදී හැම weight එකක්ම loss එකට කොච්චර වගකියනවාද කියලා ගණන් කරනවා. ඒ අංකයට කියන්නේ gradient කියලා. ඊට පස්සේ gradient descent පාවිච්චි කරලා හැම weight එකක්ම ටිකක් හදනවා. ගණිතයේ chain rule කියන නීතිය තමයි මේකට පදනම.',
        'Computational graph එක කියන්නේ ගණන් කිරීම් හැම එකක්ම node එකක් විදිහට ඇඳපු සිතියමක්. "w ගුණ කරන්න x", "b එකතු කරන්න", "ReLU දාන්න" වගේ. Forward pass එකේදී මේ graph එක දිගේ ඉස්සරහට යනවා. Backward pass එකේදී ඒ graph එක දිගේම ආපස්සට ඇවිත් gradients ගණන් කරනවා.',
        'Autograd (automatic differentiation) කියන්නේ මේ gradients ගණන් කිරීම framework එකම ස්වයංක්‍රීයව කරන එක. PyTorch එකේ loss.backward() කියලා එක පේළියක් ලිව්වාම, බිලියන ගණන් weights වලටම gradients හැදෙනවා. ඔයාට අතින් ගණිතය කරන්න ඕනේ නෑ.',
      ],
      analogy: 'කොත්තු කඩේක කොත්තු එකක් රසම නෑ කියලා customer කෙනෙක් පැමිණිලි කරනවා (loss එක). අයිතිකාරයා ආපස්සට හොයනවා: කොත්තු ගහපු කෙනාද, එළවළු කපපු කෙනාද, රොටී හදපු කෙනාද වැරදි කළේ. හැම කෙනාටම වැරැද්දෙන් කොටසක් බෙදනවා, එයාලා ඊළඟ පාර ඒ අනුව පොඩ්ඩක් හදාගන්නවා. ඒක තමයි backpropagation.',
      example: 'Loss = (2 × w - 4)² කියලා හිතමු, w = 3. Forward pass: 2 × 3 = 6, 6 - 4 = 2, 2² = 4. ඉතින් loss = 4. Backward pass එකේදී autograd හොයනවා gradient = 8 කියලා. ඒ කියන්නේ w වැඩි කළොත් loss එක වැඩි වෙනවා. Learning rate 0.1 නම් අලුත් w = 3 - (0.1 × 8) = 2.2. දැන් loss = (4.4 - 4)² = 0.16. Loss එක 4 සිට 0.16 දක්වා අඩු වුණා.',
      code: {
        lang: 'python',
        src: `import torch
w = torch.tensor(3.0, requires_grad=True)  # w ට gradient ඕනේ කියලා කියනවා
loss = (2 * w - 4) ** 2                    # forward pass: loss = 4
loss.backward()                            # backward pass: autograd වැඩේ කරනවා
print(w.grad)                              # tensor(8.) -> gradient එක
with torch.no_grad():
    w -= 0.1 * w.grad                      # gradient descent පියවරක්
print(w)                                   # 2.2 ට ආසන්නයි`,
      },
      keyPoints: [
        'Forward pass = input සිට output දක්වා ගිහින් prediction එකක් සහ loss එකක් ගන්නවා.',
        'Backward pass = loss එකේ සිට ආපස්සට ගිහින් හැම weight එකකටම gradient එකක් හොයනවා.',
        'Computational graph එක තමයි ගණන් කිරීම් වල සිතියම.',
        'Autograd නිසා gradients අතින් ගණන් කරන්න ඕනේ නෑ.',
      ],
      terms: [
        { en: 'Forward Propagation', si: 'Data එක network එක හරහා ඉස්සරහට යවලා output එකක් ගන්න එක.' },
        { en: 'Backpropagation', si: 'Loss එක ආපස්සට යවලා හැම weight එකකම gradient එක chain rule එකෙන් ගණන් කරන ක්‍රමය.' },
        { en: 'Chain Rule', si: 'එකකට පස්සේ එකක් එන ගණන් කිරීම් වල වෙනස්වීම්, කොටස් වල වෙනස්වීම් ගුණ කරලා හොයන ගණිත නීතිය.' },
        { en: 'Computational Graph', si: 'හැම ගණන් කිරීමක්ම node එකක් විදිහට, ඒවා අතර සම්බන්ධතා ඉරි විදිහට ඇඳපු සිතියම.' },
        { en: 'Autograd', si: 'Framework එක gradients ස්වයංක්‍රීයව ගණන් කරන පහසුකම (automatic differentiation).' },
      ],
    },
    {
      id: 'optimizers',
      title: 'Optimizers & Learning Rate Schedules',
      body: [
        'Gradient එකෙන් කියන්නේ කොයි පැත්තට යන්නද කියලා. Optimizer එකෙන් තීරණය කරන්නේ කොහොමද ඒ පැත්තට පියවර තියන්නේ කියලා. සරලම එක SGD (Stochastic Gradient Descent). ඒක data වලින් පොඩි කොටසක් (mini-batch එකක්) අරගෙන gradient එක ගණන් කරලා, learning rate එකෙන් ගුණ කරලා, weights හදනවා.',
        'Momentum එක SGD එකට වේගයක් එකතු කරනවා. කලින් පියවර වල දිශාව මතක තියාගෙන, ඒ දිශාවටම තවත් තල්ලු කරනවා. ඒ නිසා කුඩා ගල් මුල් වලට හිර නොවී, ඉක්මනින් පහළට යනවා. RMSprop එක හැම weight එකකටම වෙනම learning rate එකක් දෙනවා: ගොඩක් වෙනස් වෙන weights වලට පොඩි පියවර, අඩුවෙන් වෙනස් වෙන ඒවට ලොකු පියවර.',
        'Adam එක Momentum සහ RMSprop දෙකේම හොඳ දේවල් එකතු කරනවා. ඒ නිසා අද ගොඩක් අය මුලින්ම පාවිච්චි කරන්නේ Adam. AdamW කියන්නේ Adam එකේම පොඩි නිවැරදි කිරීමක්: weight decay (weights ලොකු වෙන එක පාලනය කරන එක) gradient update එකෙන් වෙන් කරලා කරනවා. ලොකු Transformer models සහ LLMs train කරන්නේ ගොඩක් වෙලාවට AdamW එකෙන්.',
        'Learning rate scheduler එකක් training එක අතරතුර learning rate එක වෙනස් කරනවා. මුලදී ලොකු පියවර තියලා ඉක්මනින් හොඳ ප්‍රදේශයකට යනවා, අන්තිමට පොඩි පියවර තියලා හරියටම පහළම තැනට එනවා. Step decay, cosine annealing වගේ ක්‍රම තියෙනවා. Warmup කියන්නේ මුල් පියවර කීපයේදී learning rate එක 0 ට ළඟ ඉඳන් හෙමින් වැඩි කරන එක. Weights තාම random නිසා මුලදීම ලොකු පියවර තිබ්බොත් training එක අවුල් වෙන්න පුළුවන්.',
      ],
      analogy: 'Optimizers හිතන්න tuk-tuk එකක් කන්දකින් පහළට පදවනවා වගේ. SGD කියන්නේ හැම මීටරයකම නවත්තලා බෑවුම බලලා යන driver කෙනෙක්. Momentum කියන්නේ වේගය අරගෙන යන driver කෙනෙක්, පොඩි කඩිති වලට නවතින්නේ නෑ. Adam කියන්නේ වේගයත් බලලා, පාරේ හැම කොටසටම ගැළපෙන විදිහට වේගය වෙනස් කරන දක්ෂ driver කෙනෙක්. Warmup කියන්නේ උදේ engine එක රත් වෙනකම් හෙමින් පදවන එක.',
      example: 'Epochs 100ක training එකක්. Learning rate එක 0.001යි. Warmup එකට පළමු පියවර 500 ඇතුළත learning rate එක 0 සිට 0.001 දක්වා හෙමින් වැඩි කරනවා. ඊට පස්සේ cosine scheduler එක training එක අවසානය වෙනකොට learning rate එක 0.001 සිට 0ට ළඟ අගයක් දක්වා සුමටව අඩු කරනවා. මේ හැඩය GPT වගේ models train කරනකොට ගොඩක් පාවිච්චි වෙනවා.',
      keyPoints: [
        'SGD = සරලම optimizer එක. Momentum = කලින් දිශාව මතක තියාගන්නවා.',
        'RMSprop සහ Adam = හැම weight එකකටම ගැළපෙන පියවර ප්‍රමාණයක්.',
        'AdamW = weight decay නිවැරදිව කරන Adam. LLMs වලට ගොඩක් පාවිච්චි වෙනවා.',
        'Scheduler එක learning rate එක කාලයත් එක්ක වෙනස් කරනවා. Warmup මුලදී ස්ථාවරත්වය දෙනවා.',
      ],
      terms: [
        { en: 'SGD (Stochastic Gradient Descent)', si: 'Data වලින් පොඩි කොටසකින් gradient එක ගණන් කරලා weights හදන සරල ක්‍රමය.' },
        { en: 'Momentum', si: 'කලින් පියවර වල දිශාව මතක තියාගෙන, ඒ දිශාවට වේගය එකතු කරන ක්‍රමය.' },
        { en: 'RMSprop', si: 'මෑත gradients වල ප්‍රමාණය අනුව හැම weight එකකටම වෙනම learning rate එකක් දෙන optimizer එක.' },
        { en: 'Adam', si: 'Momentum + RMSprop අදහස් එකතු කරපු, ගොඩක් ජනප්‍රිය optimizer එක.' },
        { en: 'AdamW', si: 'Weight decay එක gradient update එකෙන් වෙන් කරලා කරන Adam version එක.' },
        { en: 'Weight Decay', si: 'Weights ගොඩක් ලොකු වෙන එක වළක්වන්න හැම පියවරකදීම ඒවා පොඩ්ඩක් අඩු කරන එක.' },
        { en: 'Learning Rate Scheduler', si: 'Training එක අතරතුර learning rate එක ක්‍රමයෙන් වෙනස් කරන නීතිය.' },
        { en: 'Warmup', si: 'Training එකේ මුලදී learning rate එක පොඩි අගයක ඉඳන් හෙමින් වැඩි කරන එක.' },
      ],
    },
    {
      id: 'training-loop',
      title: 'Batch Size, Epochs, Iterations & Training Loop',
      body: [
        'Data ලක්ෂ ගණනක් එක පාරට GPU එකට දාන්න බෑ. ඒ නිසා data එක පොඩි කොටස් වලට කඩනවා. එක කොටසකට කියන්නේ batch (mini-batch) කියලා. එක batch එකක තියෙන samples ගාණ තමයි batch size එක.',
        'එක batch එකක් network එක හරහා යවලා, loss එක ගණන් කරලා, weights එක පාරක් update කරන එකට කියන්නේ iteration (step) එකක් කියලා. මුළු dataset එකම එක පාරක් network එක දැකලා ඉවර වුණාම ඒකට කියන්නේ epoch එකක් කියලා. සාමාන්‍යයෙන් epochs ගොඩක් train කරනවා.',
        'Batch size එක ලොකු නම් training එක ස්ථාවරයි, GPU එක හොඳට පාවිච්චි වෙනවා, ඒත් memory ගොඩක් ඕනේ. පොඩි batch size එකක gradients වල "ඝෝෂාව" (noise) වැඩියි, ඒත් සමහර වෙලාවට ඒ ඝෝෂාව model එකට හොඳට generalize වෙන්න උදව් වෙනවා. 32, 64, 128 වගේ අගයන් ගොඩක් පාවිච්චි වෙනවා.',
        'PyTorch training loop එකක පියවර 5යි: (1) forward pass එකෙන් prediction ගන්නවා, (2) loss එක ගණන් කරනවා, (3) පරණ gradients මකනවා, (4) backward pass එකෙන් අලුත් gradients ගණන් කරනවා, (5) optimizer එකෙන් weights update කරනවා. මේ loop එක ඔයා තේරුම් ගත්තොත්, ලොකු models train කරන එකේ හරය ඔයාට තේරෙනවා.',
      ],
      analogy: 'A/L exam එකට past papers 1000ක් කරනවා කියලා හිතන්න. දවසකට papers 50ක් කරලා, ඒවයේ වැරදි බලලා ඉගෙන ගන්නවා. Papers 50 = batch size එක. එක දවසක් = iteration එකක්. Papers 1000ම කරලා ඉවර වෙන්න දවස් 20ක් යනවා = එක epoch එකක්. ආයෙත් මුල ඉඳන් ඔක්කොම කරනවා නම් ඒ දෙවෙනි epoch එක.',
      example: 'Dataset එකේ පින්තූර 10,000ක් තියෙනවා. Batch size = 100. එතකොට එක epoch එකකට iterations = 10,000 ÷ 100 = 100යි. Epochs 10ක් train කළොත් මුළු iterations = 100 × 10 = 1,000යි. ඒ කියන්නේ weights 1,000 පාරක් update වෙනවා.',
      code: {
        lang: 'python',
        src: `import torch, torch.nn as nn
X = torch.randn(100, 2)                            # samples 100ක්, features 2යි
y = (X[:, 0] + X[:, 1] > 0).float().unsqueeze(1)   # label: එකතුව 0ට වැඩි නම් 1
model = nn.Sequential(nn.Linear(2, 8), nn.ReLU(), nn.Linear(8, 1))  # පොඩි MLP එකක්
loss_fn = nn.BCEWithLogitsLoss()                   # ඔව් / නෑ ප්‍රශ්නයකට loss එක
opt = torch.optim.Adam(model.parameters(), lr=0.01)
for epoch in range(100):
    pred = model(X)                                # 1. forward pass
    loss = loss_fn(pred, y)                        # 2. වැරැද්ද මනිනවා
    opt.zero_grad()                                # 3. පරණ gradients මකනවා
    loss.backward()                                # 4. backprop: gradients හොයනවා
    opt.step()                                     # 5. weights ටිකක් හදනවා
print('අවසාන loss:', loss.item())`,
      },
      keyPoints: [
        'Batch = එක පාරට network එකට දෙන samples ගොඩ.',
        'Iteration = එක batch එකකින් එක weight update එකක්.',
        'Epoch = මුළු dataset එකම එක පාරක් බලලා ඉවර වීම.',
        'Iterations per epoch = dataset size ÷ batch size.',
      ],
      terms: [
        { en: 'Batch Size', si: 'එක iteration එකකදී network එකට දෙන samples ගාණ.' },
        { en: 'Mini-batch', si: 'මුළු dataset එකෙන් කපාගත්ත පොඩි කොටසක්.' },
        { en: 'Epoch', si: 'මුළු training dataset එකම එක පාරක් network එක හරහා යවලා ඉවර වීම.' },
        { en: 'Iteration (Step)', si: 'එක batch එකක් අරගෙන weights එක පාරක් update කරන එක.' },
        { en: 'Training Loop', si: 'Forward, loss, zero_grad, backward, step කියන පියවර නැවත නැවත කරන code කොටස.' },
      ],
    },
    {
      id: 'init-gradients',
      title: 'Weight Initialization & Gradient Problems',
      body: [
        'Training පටන් ගන්න කලින් weights වලට මුල් අගයන් දෙන්න ඕනේ. ඔක්කොම 0 දැම්මොත් හැම neuron එකක්ම එකම දේ ඉගෙන ගන්නවා, ඒක වැඩක් නෑ. ගොඩක් ලොකු random අගයන් දැම්මොත් signals layer එකෙන් layer එකට පුපුරලා යනවා. ගොඩක් පොඩි අගයන් දැම්මොත් signals නැති වෙලා යනවා.',
        'Xavier (Glorot) initialization එක, එක layer එකක inputs ගාණ සහ outputs ගාණ අනුව random අගයන්ගේ ප්‍රමාණය තෝරනවා, signal එකේ ශක්තිය layers හරහා එක වගේ තියාගන්න. මේක Sigmoid සහ Tanh වලට හොඳයි. He (Kaiming) initialization එක ReLU වලට හදපු එකක්. ReLU එක negative අගයන් භාගයක් විතර 0 කරන නිසා, He එක ඊට වන්දියක් විදිහට ටිකක් ලොකු අගයන් දෙනවා.',
        'Vanishing gradients කියන්නේ backprop එකේදී gradient එක layers හරහා ආපස්සට යනකොට පොඩි වෙලා පොඩි වෙලා 0ට ළඟ වෙන එක. එතකොට මුල් layers ඉගෙන ගන්නේම නෑ. Sigmoid වගේ functions සහ deep networks වල මේක ගොඩක් වෙනවා. Exploding gradients කියන්නේ ඊට විරුද්ධ දේ: gradients ලොකු වෙලා ලොකු වෙලා weights පිස්සු අගයන් වලට පනිනවා, loss එක NaN වෙනවා.',
        'විසඳුම් කීපයක් තියෙනවා: ReLU වගේ activations, හරි initialization, batch norm, ResNet වගේ skip connections. Exploding gradients වලට gradient clipping කියන ක්‍රමය පාවිච්චි කරනවා: gradient එක සීමාවකට (උදා: 1.0) වඩා ලොකු නම් ඒක ඒ සීමාවට කපනවා. RNNs සහ LLMs train කරනකොට මේක ගොඩක් පාවිච්චි වෙනවා.',
      ],
      analogy: 'පංතියක ළමයි 30ක් පේළියට ඉඳන් "කටින් කට" game එක සෙල්ලම් කරනවා. පණිවිඩය හැම කෙනාම පොඩ්ඩක් හෙමින් කිව්වොත් අන්තිම ළමයාට කිසිම දෙයක් ඇහෙන්නේ නෑ: vanishing. හැම කෙනාම පොඩ්ඩක් සද්දෙන් කිව්වොත් අන්තිමට කෑ ගහනවා: exploding. Gradient clipping කියන්නේ "කිසිම කෙනෙක් මේ සද්දෙට වඩා කතා කරන්න එපා" කියලා ගුරුවරයා දාන නීතිය.',
      example: 'Layers 50ක network එකක හැම layer එකකදීම gradient එක 0.5න් ගුණ වෙනවා කියලා හිතන්න. 0.5 පනස් පාරක් ගුණ කළාම 0.000000000000001ට වඩා පොඩියි. මුල් layer එකට එන්නේ ඒ තරම් පොඩි gradient එකක්: vanishing. හැම layer එකකදීම 1.5න් ගුණ වුණොත්, 1.5 පනස් පාරක් ගුණ කළාම 600,000කට වඩා වැඩියි: exploding.',
      keyPoints: [
        'Weights ඔක්කොම 0න් පටන් ගන්න එපා. හරි ප්‍රමාණයේ random අගයන් ඕනේ.',
        'Xavier = Sigmoid / Tanh වලට. He = ReLU වලට.',
        'Vanishing = gradients 0ට ළඟ වෙනවා. Exploding = gradients පුපුරනවා.',
        'Gradient clipping = gradient එකේ ප්‍රමාණයට උපරිම සීමාවක් දානවා.',
      ],
      terms: [
        { en: 'Weight Initialization', si: 'Training පටන් ගන්න කලින් weights වලට මුල් අගයන් දෙන ක්‍රමය.' },
        { en: 'Xavier (Glorot) Initialization', si: 'Layer එකේ inputs සහ outputs ගාණ අනුව random weights වල ප්‍රමාණය තෝරන ක්‍රමය. Sigmoid / Tanh වලට.' },
        { en: 'He (Kaiming) Initialization', si: 'ReLU networks වලට හදපු, inputs ගාණ අනුව ටිකක් ලොකු random weights දෙන ක්‍රමය.' },
        { en: 'Vanishing Gradients', si: 'Gradients ආපස්සට යනකොට ගොඩක් පොඩි වෙලා මුල් layers ඉගෙන නොගන්නා ප්‍රශ්නය.' },
        { en: 'Exploding Gradients', si: 'Gradients ගොඩක් ලොකු වෙලා training එක අස්ථාවර වෙන ප්‍රශ්නය.' },
        { en: 'Gradient Clipping', si: 'Gradient එක නියමිත සීමාවකට වඩා ලොකු නම් ඒක ඒ සීමාවට කපන ක්‍රමය.' },
      ],
    },
    {
      id: 'regularization',
      title: 'Dropout, Normalization & Regularization',
      body: [
        'Deep networks වල parameters ගොඩක් නිසා ඒවාට training data කටපාඩම් කරන්න (overfit වෙන්න) පුළුවන්. Regularization කියන්නේ model එක කටපාඩම් නොකර ඇත්තටම තේරුම් ගන්න උදව් කරන ක්‍රම වලට.',
        'Dropout එකේදී training අතරතුර හැම පියවරකදීම neurons වලින් කොටසක් (උදා: 50%) අහඹු ලෙස තාවකාලිකව නිවා දානවා. එතකොට network එකට එක neuron එකක් මත විතරක් රඳා පවතින්න බෑ. Test කරනකොට dropout එක නවත්තලා ඔක්කොම neurons පාවිච්චි කරනවා. Early stopping කියන්නේ validation loss එක වැඩි වෙන්න පටන් ගත්තම training එක නවත්තන එක.',
        'Batch Normalization (Batch Norm) එක, එක layer එකක outputs, batch එක ඇතුළේ mean 0 සහ variance 1 වෙන්න සකස් කරනවා. එතකොට training එක වේගවත් සහ ස්ථාවර වෙනවා. CNNs වල ගොඩක් පාවිච්චි වෙනවා. Layer Normalization (Layer Norm) එකත් ඒ වගේමයි, ඒත් batch එක හරහා නෙවෙයි, එක sample එකක් ඇතුළේ features හරහා normalize කරනවා. Batch size එක මත රඳා නොපවතින නිසා Transformers සහ LLMs වල පාවිච්චි කරන්නේ Layer Norm.',
        'Data augmentation කියන්නේ තියෙන data වලින්ම අලුත් training samples හදන එක. පින්තූරයක් කරකවලා, පෙරළලා, crop කරලා, දීප්තිය වෙනස් කරලා. පූසෙක්ගේ පින්තූරයක් පෙරළුවත් ඒ තාමත් පූසෙක්. ඉතින් model එක එකම පින්තූරය කටපාඩම් කරන්නේ නැතුව "පූසා" කියන අදහස ඉගෙන ගන්නවා.',
      ],
      analogy: 'Cricket team එකක coach කෙනෙක් practice වලදී හැම දවසෙම අහඹු ලෙස players කීපදෙනෙක්ට විවේක දෙනවා. එතකොට team එක එක star player කෙනෙක් මත රඳා පවතින්නේ නෑ, හැම කෙනාම වගකීම ගන්න පුරුදු වෙනවා. ඒක තමයි dropout. Match දවසේ (test) ඔක්කොම players සෙල්ලම් කරනවා.',
      example: 'Model එකක් epochs 30ක් train කරනවා. Epoch 12 වෙනකම් training loss සහ validation loss දෙකම අඩු වෙනවා. Epoch 12 න් පස්සේ training loss තවත් අඩු වෙනවා, ඒත් validation loss එක 0.35 සිට 0.42, 0.50 දක්වා වැඩි වෙනවා. ඒ කියන්නේ model එක overfit වෙන්න පටන් අරන්. Early stopping (patience = 3) එක epoch 15දී training එක නවත්තලා, epoch 12 එකේ හොඳම weights ටික තියාගන්නවා.',
      keyPoints: [
        'Dropout = training වලදී අහඹු neurons නිවා දානවා. Test වලදී නෑ.',
        'Batch Norm = batch එක හරහා normalize කරනවා. CNNs වල ජනප්‍රියයි.',
        'Layer Norm = එක sample එකක් ඇතුළේ normalize කරනවා. Transformers වල පාවිච්චි වෙනවා.',
        'Early stopping සහ data augmentation overfitting අඩු කරන සරල, බලවත් ක්‍රම.',
      ],
      terms: [
        { en: 'Dropout', si: 'Training අතරතුර neurons කොටසක් අහඹු ලෙස තාවකාලිකව 0 කරන regularization ක්‍රමය.' },
        { en: 'Batch Normalization', si: 'එක layer එකක outputs batch එක හරහා mean 0, variance 1 වෙන්න සකස් කරන layer එක.' },
        { en: 'Layer Normalization', si: 'එක sample එකක features හරහා normalize කරන layer එක. Transformers වල සම්මතයි.' },
        { en: 'Early Stopping', si: 'Validation loss එක තවදුරටත් හොඳ නොවෙන කොට training එක නවත්තන එක.' },
        { en: 'Data Augmentation', si: 'කරකවීම, පෙරළීම, crop කිරීම වගේ වෙනස්කම් වලින් තියෙන data වලින්ම අලුත් samples හදන එක.' },
        { en: 'Regularization', si: 'Model එක overfit වෙන එක අඩු කරන ඕනෑම ක්‍රමයක්.' },
      ],
    },
    {
      id: 'frameworks-hardware',
      title: 'Frameworks, GPUs & Mixed Precision',
      body: [
        'Neural networks හදන්න අපි මුල ඉඳන් ගණිතය ලියන්නේ නෑ. Frameworks පාවිච්චි කරනවා. PyTorch (Meta එකෙන් පටන් ගත්ත) අද research සහ ගොඩක් companies වල ජනප්‍රියම එකයි. Python වගේම ස්වභාවිකව ලියන්න පුළුවන්, debug කරන්න ලේසියි. TensorFlow (Google) production deployment වලට ප්‍රසිද්ධයි, Keras කියන්නේ ඒකට උඩින් තියෙන සරල, පහසු API එක. JAX (Google) කියන්නේ NumPy වගේ code එකක් ලියලා, ඒක GPU / TPU වල ගොඩක් වේගයෙන් run කරන්න පුළුවන් research framework එකක්.',
        'Neural network එකක වැඩ වලින් වැඩි කොටස matrix ගුණ කිරීම්. CPU එකක cores ටිකයි, ඒත් ඒවා හරිම දක්ෂයි. GPU එකක පොඩි cores දහස් ගණනක් තියෙනවා, ඒ හැම එකකටම එකම වෙලාවේ පොඩි ගණන් කිරීම් කරන්න පුළුවන්. Matrix ගුණ කිරීමට ඒක හරියටම ගැළපෙනවා. CUDA කියන්නේ NVIDIA GPUs වලට general-purpose code ලියන්න NVIDIA හදපු platform එක. PyTorch යට CUDA තියෙනවා, ඒ නිසා model.to("cuda") කියලා ලිව්වාම model එක GPU එකට යනවා.',
        'Computer එකේ අංකයක් ගබඩා කරන්න bits පාවිච්චි කරනවා. FP32 කියන්නේ bits 32ක අංකයක්. FP16 සහ BF16 කියන්නේ bits 16ක අංක. ඒ නිසා memory භාගයයි, සහ නවීන GPUs වල ගොඩක් වේගවත්. FP16 එකේ නිරවද්‍යතාව හොඳයි, ඒත් තියාගන්න පුළුවන් අංක පරාසය පොඩියි, ඒ නිසා ගොඩක් පොඩි gradients 0 වෙන්න පුළුවන්. BF16 එකට FP32 එකට සමාන පරාසයක් තියෙනවා, ඒත් නිරවද්‍යතාව අඩුයි. Deep learning වලට BF16 ගොඩක් හොඳට ගැළපෙනවා.',
        'Mixed precision training එකේදී ගොඩක් ගණන් කිරීම් 16-bit වලින් කරනවා, ඒත් master weights සහ සමහර සංවේදී ගණන් කිරීම් FP32 වලින් තියාගන්නවා. FP16 පාවිච්චි කරනවා නම් loss scaling කියන ක්‍රමයෙන් පොඩි gradients නැති වෙන එක වළක්වනවා. ප්‍රතිඵලය: training එක වේගවත්, memory අඩුයි, නිරවද්‍යතාව එච්චරම වෙනස් වෙන්නේ නෑ.',
      ],
      analogy: 'CPU එක කියන්නේ ගණිතය දන්න මහාචාර්යවරු 8 දෙනෙක්. GPU එක කියන්නේ එකතු කිරීම් සහ ගුණ කිරීම් විතරක් දන්න පාසල් ළමයි 10,000ක්. A/L ගණන් ප්‍රශ්නයකට මහාචාර්යවරු හොඳයි. ඒත් ලක්ෂ ගණනක සරල ගුණ කිරීම් ඉක්මනින් කරන්න ළමයි 10,000 දෙනා එකවර වැඩ කරන එක ගොඩක් වේගවත්. Neural networks වලට ඕනේ ඒ දෙවෙනි වර්ගයේ වැඩේ.',
      example: 'Parameters බිලියන 7ක model එකක් හිතන්න. FP32 වලින් හැම parameter එකකටම bytes 4ක් ඕනේ: 7 × 4 = GB 28යි. BF16 වලින් bytes 2යි: 7 × 2 = GB 14යි. ඒ කියන්නේ weights තියාගන්න විතරක් memory භාගයක් ඉතුරු වෙනවා. (Training වලදී gradients සහ optimizer states නිසා මීට වඩා ගොඩක් memory ඕනේ.)',
      keyPoints: [
        'PyTorch = research වල ජනප්‍රියම. TensorFlow / Keras = production සහ පහසු API. JAX = වේගවත් research.',
        'GPU එකේ cores දහස් ගණනක් එකවර matrix ගණන් කරනවා.',
        'CUDA = NVIDIA GPUs වලට code ලියන platform එක.',
        'FP16 / BF16 = memory භාගයයි, වේගවත්. BF16 එකේ පරාසය FP32 වගේමයි.',
      ],
      terms: [
        { en: 'PyTorch', si: 'Meta එකෙන් පටන් ගත්ත, දැන් Linux Foundation යටතේ තියෙන, ජනප්‍රියම deep learning framework එක.' },
        { en: 'TensorFlow / Keras', si: 'Google හදපු framework එක සහ ඒ උඩ තියෙන සරල high-level API එක.' },
        { en: 'JAX', si: 'NumPy වගේ code ලියලා automatic differentiation සහ GPU / TPU වේගය ගන්න පුළුවන් Google framework එක.' },
        { en: 'GPU', si: 'පොඩි cores දහස් ගණනක් තියෙන, එකවර ගණන් කිරීම් ගොඩක් කරන processor එක.' },
        { en: 'CUDA', si: 'NVIDIA GPUs වල general-purpose ගණන් කිරීම් run කරන්න NVIDIA හදපු platform එක.' },
        { en: 'Mixed Precision', si: 'ගණන් කිරීම් වලින් වැඩි කොටස 16-bit වලින්, සංවේදී දේවල් 32-bit වලින් කරන training ක්‍රමය.' },
        { en: 'FP16', si: '16-bit floating point. හොඳ නිරවද්‍යතාව, ඒත් පොඩි පරාසයක්.' },
        { en: 'BF16 (bfloat16)', si: '16-bit floating point. FP32 එකට සමාන පරාසයක්, අඩු නිරවද්‍යතාවක්.' },
      ],
    },
    {
      id: 'cnn-basics',
      title: 'CNN: Convolution, Filters, Stride, Padding & Pooling',
      body: [
        'පින්තූරයක් කියන්නේ අංක grid එකක්. 100 × 100 පින්තූරයක pixels 10,000ක් තියෙනවා. ඒක සාමාන්‍ය MLP එකකට දැම්මොත් weights ගොඩක් ඕනේ, සහ pixels අතර තියෙන අවකාශීය සම්බන්ධය (ළඟ pixels එකට අයිති කියන එක) නැති වෙනවා. CNN (Convolutional Neural Network) එක මේක විසඳනවා.',
        'Convolution එකේදී filter (kernel) කියන පොඩි අංක grid එකක් (උදා: 3 × 3) පින්තූරය උඩින් ලිස්සලා යනවා. හැම තැනකදීම filter එකේ අංක සහ යට තියෙන pixels ගුණ කරලා එකතු කරලා එක අංකයක් හදනවා. එක filter එකක් ඉගෙන ගන්නවා සිරස් ඉරි හොයන්න, තව එකක් වංගු හොයන්න. ගැඹුරු layers වල filters ඇස්, රෝද, මුහුණු වගේ සංකීර්ණ දේ හොයනවා. මේ filter අංක training එකෙන්ම ඉගෙන ගන්නවා.',
        'Stride කියන්නේ filter එක එක පාරකට කොච්චර pixels පනිනවාද කියන එක. Stride 1 නම් pixel එකෙන් pixel එකට. Stride 2 නම් pixel දෙකක් පනිනවා, output එක පොඩි වෙනවා. Padding කියන්නේ පින්තූරයේ දාර වටේට 0 pixels එකතු කරන එක, එතකොට output එකේ ප්‍රමාණය අඩු නොවී තියාගන්න පුළුවන් සහ දාර වල තොරතුරු නැති වෙන්නේ නෑ.',
        'Pooling එක feature map එකක ප්‍රමාණය අඩු කරනවා. Max pooling (2 × 2) එකේදී හැම 2 × 2 කොටුවකින්ම ලොකුම අගය විතරක් තියාගන්නවා. ඒ නිසා දිග පළල දෙකම භාගයක් වෙනවා. ගණන් කිරීම් අඩු වෙනවා, සහ object එක පොඩ්ඩක් එහාට මෙහාට වුණත් model එක ඒක හඳුනගන්නවා. සාමාන්‍ය CNN එකක් conv, ReLU, pool කියන රටාව කීප පාරක් කරලා, අන්තිමට fully connected layers වලින් class එක තීරණය කරනවා.',
      ],
      analogy: 'Detective කෙනෙක් ලොකු සිතියමක් උඩ magnifying glass එකක් තියාගෙන කොටුවෙන් කොටුවට ගෙනියනවා කියලා හිතන්න. එයා හොයන්නේ එක විශේෂ දෙයක්, උදාහරණයකට රතු පාට tuk-tuk. Magnifying glass එක = filter එක. එක පාරකට ගෙනියන දුර = stride එක. සිතියමේ දාර වටේට හිස් කඩදාසි ඇලෙව්වාම = padding. අන්තිමට "මේ ප්‍රදේශයේ tuk-tuk එකක් තියෙනවා" කියලා සාරාංශයක් ලියනවා = pooling.',
      example: 'Grayscale පින්තූරය 32 × 32යි. Filter 5 × 5, stride 1, padding 0. Output එක = (32 - 5) ÷ 1 + 1 = 28, ඉතින් 28 × 28. Padding 2ක් දැම්මොත් (32 - 5 + 4) ÷ 1 + 1 = 32, ප්‍රමාණය වෙනස් වෙන්නේ නෑ. ඊට පස්සේ 2 × 2 max pooling දැම්මොත් 28 × 28 එක 14 × 14 වෙනවා. Filters 6ක් පාවිච්චි කළොත් 14 × 14 feature maps 6ක් ලැබෙනවා.',
      keyPoints: [
        'CNN එක පින්තූරයේ ළඟ pixels අතර සම්බන්ධය පාවිච්චි කරනවා.',
        'Filter / kernel = පින්තූරය උඩින් ලිස්සන, patterns හොයන පොඩි weights grid එකක්.',
        'Stride = filter එකේ පියවරේ දුර. Padding = දාර වටේට 0 එකතු කිරීම.',
        'Pooling = feature map එක පොඩි කරලා වැදගත් තොරතුරු තියාගැනීම.',
      ],
      terms: [
        { en: 'CNN (Convolutional Neural Network)', si: 'Convolution layers පාවිච්චි කරන, පින්තූර වලට විශේෂයෙන් හදපු network වර්ගය.' },
        { en: 'Convolution', si: 'Filter එකක් පින්තූරය උඩින් ලිස්සවමින් හැම තැනකම ගුණ කරලා එකතු කරන ක්‍රියාව.' },
        { en: 'Filter / Kernel', si: 'Edges, textures වගේ patterns හොයන්න ඉගෙන ගන්නා පොඩි weights grid එක (උදා: 3 × 3).' },
        { en: 'Feature Map', si: 'එක filter එකක් පින්තූරය උඩින් ගියාම ලැබෙන output grid එක.' },
        { en: 'Stride', si: 'Filter එක එක පාරකට පනින pixels ගාණ.' },
        { en: 'Padding', si: 'Output ප්‍රමාණය තියාගන්න පින්තූරයේ දාර වටේට 0 pixels එකතු කිරීම.' },
        { en: 'Pooling (Max / Average)', si: 'කොටුවක ලොකුම හෝ සාමාන්‍ය අගය විතරක් අරගෙන feature map එක පොඩි කිරීම.' },
      ],
    },
    {
      id: 'cnn-architectures',
      title: 'Famous CNN Architectures',
      body: [
        'LeNet-5 (1998, Yann LeCun) කියන්නේ මුල්ම සාර්ථක CNN එකක්. බැංකු චෙක්පත් වල අතින් ලියපු ඉලක්කම් කියවන්න පාවිච්චි වුණා. AlexNet (2012) ImageNet තරඟය ලොකු වෙනසකින් දිනුවා. ReLU, dropout සහ GPUs පාවිච්චි කරපු ඒ ජයග්‍රහණය තමයි අද deep learning විප්ලවය පටන් ගත්තේ කියලා ගොඩක් අය කියන්නේ.',
        'VGG (2014) අදහස සරලයි: 3 × 3 පොඩි filters විතරක් පාවිච්චි කරලා layers 16 හෝ 19ක් ගැඹුරට යනවා. Inception (GoogLeNet, 2014) එකේදී එකම layer එකේ 1 × 1, 3 × 3, 5 × 5 filters සමාන්තරව run කරලා ප්‍රතිඵල එකතු කරනවා. එතකොට network එකටම තීරණය කරන්න පුළුවන් කොයි ප්‍රමාණයේ patterns වැදගත්ද කියලා.',
        'Layers ගොඩක් එකතු කරනකොට training අමාරු වුණා, vanishing gradients නිසා. ResNet (2015) මේක skip connections (residual connections) වලින් විසඳුවා. Layer කීපයක output එකට ඒවගේ input එකම කෙළින්ම එකතු කරනවා: output = F(x) + x. එතකොට gradients වලට කෙටි පාරකින් ආපස්සට යන්න පුළුවන්. ඒ නිසා layers 152ක networks පවා train කරන්න පුළුවන් වුණා. අද Transformers වලත් මේ skip connection අදහසම තියෙනවා.',
        'MobileNet ජංගම දුරකථන වගේ දුර්වල devices වලට හදපු එකක්. Depthwise separable convolutions කියන ක්‍රමයෙන් ගණන් කිරීම් ගොඩක් අඩු කරනවා. EfficientNet (2019) එක network එකේ ගැඹුර (depth), පළල (width) සහ input පින්තූරයේ resolution එක, තුනම සමබරව එකට වැඩි කරන compound scaling ක්‍රමයක් පාවිච්චි කරනවා. ඒ නිසා අඩු parameters වලින් ඉහළ accuracy ගන්නවා.',
      ],
      analogy: 'ResNet එකේ skip connection එක හිතන්න Colombo සිට Kandy යන්න highway එකක් වගේ. පරණ පාරේ නගර 30ක් හරහා යනකොට (layers 30) පණිවිඩයක් පරක්කු වෙනවා, අවුල් වෙනවා. Highway එක තියෙනකොට පණිවිඩයට කෙළින්ම යන්න පුළුවන්, ඕනේ නම් අතරමැද නගර වලටත් බහින්න පුළුවන්.',
      example: 'ImageNet තරඟයේ top-5 error එක (නිවැරදි උත්තරය model එකේ හොඳම අනුමාන 5 ඇතුළේ නැති වාර ගණන): 2011 දී CNN නොවන ක්‍රම වලින් 25% විතර. 2012 AlexNet 15.3%. 2014 VGG 7.3% විතර, GoogLeNet 6.7%. 2015 ResNet 3.6%. අවුරුදු හතරකින් වැරදි 25% සිට 3.6% දක්වා අඩු වුණා.',
      keyPoints: [
        'LeNet = පළමු සාර්ථක CNN. AlexNet = deep learning විප්ලවයේ ආරම්භය.',
        'VGG = පොඩි 3 × 3 filters, ගැඹුරු network. Inception = filter ප්‍රමාණ කීපයක් සමාන්තරව.',
        'ResNet skip connections = output = F(x) + x. ගොඩක් ගැඹුරු networks train කරන්න පුළුවන්.',
        'MobileNet = phones වලට. EfficientNet = depth, width, resolution සමබරව scale කිරීම.',
      ],
      terms: [
        { en: 'LeNet', si: '1998 දී Yann LeCun හදපු, අතින් ලියපු ඉලක්කම් හඳුනගත්ත මුල් CNN එක.' },
        { en: 'AlexNet', si: '2012 ImageNet තරඟය දිනපු, ReLU සහ GPUs පාවිච්චි කරපු CNN එක.' },
        { en: 'VGG', si: '3 × 3 filters විතරක් පාවිච්චි කරන, layers 16 / 19ක සරල ගැඹුරු CNN එක.' },
        { en: 'ResNet', si: 'Skip connections පාවිච්චි කරලා layers සිය ගණනක් දක්වා ගැඹුරට යන්න පුළුවන් කරපු CNN එක.' },
        { en: 'Skip (Residual) Connection', si: 'Layers කීපයක input එක ඒවගේ output එකට කෙළින්ම එකතු කරන කෙටි පාර.' },
        { en: 'Inception (GoogLeNet)', si: 'එකම block එකක විවිධ ප්‍රමාණයේ filters සමාන්තරව පාවිච්චි කරන CNN එක.' },
        { en: 'EfficientNet', si: 'Depth, width, resolution තුනම compound scaling වලින් සමබරව වැඩි කරන CNN පවුල.' },
        { en: 'MobileNet', si: 'Depthwise separable convolutions වලින් phones වලට ගැළපෙන්න සැහැල්ලු කරපු CNN එක.' },
      ],
    },
    {
      id: 'vision-tasks',
      title: 'Computer Vision Tasks & Transfer Learning',
      body: [
        'Image classification කියන්නේ මුළු පින්තූරයටම එක label එකක් දෙන එක: "මේක බල්ලෙක්". Object detection කියන්නේ පින්තූරයේ objects කොහෙද තියෙන්නේ කියලා box (bounding box) ඇඳලා, ඒ හැම එකටම label එකක් දෙන එක: "මෙතන tuk-tuk එකක්, අතන බස් එකක්". Segmentation කියන්නේ pixel එකෙන් pixel එකට label දෙන එක.',
        'Detection වලට ජනප්‍රිය ක්‍රම දෙකක්: Faster R-CNN එක two-stage. මුලින්ම Region Proposal Network එකකින් objects තියෙන්න පුළුවන් ප්‍රදේශ යෝජනා කරලා, ඊට පස්සේ ඒ එක එකක් classify කරනවා. නිරවද්‍යයි, ඒත් හෙමින්. YOLO (You Only Look Once) එක single-stage. මුළු පින්තූරයම එක පාරක් බලලා boxes සහ classes එකවරම අනුමාන කරනවා. ගොඩක් වේගවත් නිසා CCTV, self-driving cars වගේ real-time වැඩ වලට ගැළපෙනවා.',
        'Segmentation වලදී U-Net එක encoder-decoder හැඩයක් තියෙන network එකක්. Encoder එක පින්තූරය පොඩි කරලා අදහස ගන්නවා, decoder එක ආයෙත් ලොකු කරලා pixel mask එක හදනවා, skip connections වලින් සියුම් විස්තර ගෙනෙනවා. Medical scans වල ගොඩක් පාවිච්චි වෙනවා. Mask R-CNN එක Faster R-CNN එකට mask branch එකක් එකතු කරලා instance segmentation කරනවා: "මේ pixels පළමු පුද්ගලයාගේ, මේ pixels දෙවෙනි පුද්ගලයාගේ".',
        'Transfer learning කියන්නේ කෙනෙක් ලොකු dataset එකක (උදා: ImageNet එකේ පින්තූර මිලියනයකට වැඩි) train කරපු model එකක් අරගෙන ඔයාගේ වැඩේට පාවිච්චි කරන එක. මුල් layers දැනටමත් edges, shapes හඳුනගන්න දන්නවා. ඔයා අන්තිම layer එක විතරක් වෙනස් කරනවා. Fine-tuning කියන්නේ ඔයාගේ data වලින් model එකේ කොටසක් හෝ ඔක්කොම පොඩි learning rate එකකින් තව ටිකක් train කරන එක. OpenCV කියන්නේ පින්තූර කියවන්න, resize කරන්න, camera එකෙන් video ගන්න, boxes අඳින්න වගේ වැඩ වලට පාවිච්චි කරන ජනප්‍රිය computer vision library එක.',
      ],
      analogy: 'Transfer learning හිතන්න හොඳට කාර් පදවන්න දන්න කෙනෙක් lorry එකක් පදවන්න ඉගෙන ගන්නවා වගේ. පාරේ නීති, steering, brakes ගැන එයා දැනටමත් දන්නවා. එයාට අලුතින් ඉගෙන ගන්න තියෙන්නේ lorry එකට විශේෂ දේවල් ටික විතරයි. මුල ඉඳන් ඉගෙන ගන්න කෙනෙක්ට වඩා ගොඩක් ඉක්මනින් ඉගෙන ගන්නවා.',
      example: 'ඔයාට කොළ පින්තූර වලින් තේ කොළ ලෙඩ වර්ග 4ක් හඳුනගන්න model එකක් ඕනේ. තියෙන්නේ පින්තූර 800යි. මුල ඉඳන් CNN එකක් train කළොත් accuracy 60% විතර එන්න පුළුවන්. ImageNet එකේ train කරපු ResNet එකක් අරගෙන, අන්තිම layer එක classes 4කට වෙනස් කරලා fine-tune කළොත්, එකම data ගාණෙන් 90%කට වඩා ගන්න පුළුවන්කම තියෙනවා.',
      code: {
        lang: 'python',
        src: `import torch.nn as nn
from torchvision import models
model = models.resnet18(weights='IMAGENET1K_V1')  # ImageNet එකේ train කරපු model එක
for p in model.parameters():
    p.requires_grad = False                         # පරණ දැනුම freeze කරනවා
model.fc = nn.Linear(model.fc.in_features, 4)       # අලුත් layer එක: classes 4යි
# දැන් model.fc එක විතරක් ඔයාගේ data වලින් train කරන්න`,
      },
      keyPoints: [
        'Classification = මුළු පින්තූරයටම label එකක්. Detection = boxes + labels. Segmentation = pixel labels.',
        'YOLO = single-stage, වේගවත්. Faster R-CNN = two-stage, නිරවද්‍යයි.',
        'U-Net = semantic segmentation (medical). Mask R-CNN = instance segmentation.',
        'Transfer learning සහ fine-tuning නිසා පොඩි data ගාණකින් වුණත් හොඳ models හදන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Image Classification', si: 'මුළු පින්තූරයටම එක category එකක් දෙන වැඩේ.' },
        { en: 'Object Detection', si: 'පින්තූරයේ objects වටේට bounding boxes ඇඳලා labels දෙන වැඩේ.' },
        { en: 'YOLO', si: 'මුළු පින්තූරයම එක පාරක් බලලා boxes අනුමාන කරන වේගවත් single-stage detector එක.' },
        { en: 'Faster R-CNN', si: 'Region proposals හදලා ඊට පස්සේ classify කරන two-stage detector එක.' },
        { en: 'Image Segmentation', si: 'පින්තූරයේ හැම pixel එකකටම label එකක් දෙන වැඩේ.' },
        { en: 'U-Net', si: 'Skip connections සහිත encoder-decoder segmentation network එක. Medical images වල ජනප්‍රියයි.' },
        { en: 'Mask R-CNN', si: 'Faster R-CNN එකට mask branch එකක් එකතු කරලා instance segmentation කරන model එක.' },
        { en: 'Transfer Learning', si: 'එක වැඩකට train කරපු model එකක දැනුම වෙනත් වැඩකට පාවිච්චි කිරීම.' },
        { en: 'Fine-tuning', si: 'Pretrained model එකක් ඔයාගේ data වලින් පොඩි learning rate එකකින් තව train කිරීම.' },
        { en: 'OpenCV', si: 'පින්තූර සහ video සැකසීමට පාවිච්චි කරන open-source computer vision library එක.' },
      ],
    },
    {
      id: 'rnn-lstm',
      title: 'RNN, LSTM, GRU & Bidirectional',
      body: [
        'වාක්‍ය, කටහඬ, කොටස් වෙළඳපොළ මිල වගේ දේවල් අනුපිළිවෙළක් (sequence) විදිහට එනවා. "මම බත් ..." කියලා ඇහුණාම ඊළඟ වචනය "කනවා" වෙන්න ඉඩ වැඩියි කියලා අපිට තේරෙන්නේ කලින් වචන මතක නිසා. RNN (Recurrent Neural Network) එකක් එක වෙලාවකට එක element එක බැගින් කියවනවා, සහ hidden state කියන "මතකයක්" ඊළඟ පියවරට යවනවා.',
        'සරල RNN එකේ ප්‍රශ්නය දිගු sequences වලදී මතකය නැති වෙන එක. Backprop එක ගොඩක් පියවර හරහා ආපස්සට යනකොට vanishing gradients ඇති වෙනවා. ඉතින් වාක්‍යයක මුල තිබ්බ වචනයක් අගට එනකොට අමතක වෙනවා.',
        'LSTM (Long Short-Term Memory) එකට cell state කියන දිගු කාලීන මතක පටියක් සහ gates තුනක් තියෙනවා. Forget gate එක පරණ මතකයෙන් මොනවා අමතක කරන්නද කියලා තීරණය කරනවා. Input gate එක අලුතින් මොනවා මතක තියාගන්නද කියලා තීරණය කරනවා. Output gate එක මේ මොහොතේ මොනවා පිටට දෙන්නද කියලා තීරණය කරනවා. GRU (Gated Recurrent Unit) එක LSTM එකේ සරල කළ version එකක්: gates දෙකයි (update සහ reset), parameters අඩුයි, ගොඩක් වැඩ වලට LSTM තරම්ම හොඳයි.',
        'Bidirectional RNN එකක RNNs දෙකක් තියෙනවා. එකක් වාක්‍යය මුල සිට අගට කියවනවා, අනිත් එක අග සිට මුලට. ඒ නිසා හැම වචනයකටම කලින් සහ පස්සේ එන context දෙකම ලැබෙනවා. "Bank" කියන වචනය ගඟේ ඉවුරද මුදල් බැංකුවද කියලා තේරුම් ගන්න පස්සේ එන වචනත් ඕනේ වෙන නිසා මේක ප්‍රයෝජනවත්. 2017 න් පස්සේ ගොඩක් NLP වැඩ වලට Transformers ආවත්, RNN අදහස් තේරුම් ගැනීම වැදගත්.',
      ],
      analogy: 'RNN එක හිතන්න cricket commentary එකක් අහන කෙනෙක් වගේ. හැම බෝලයකම විස්තරය අහලා, score එක ඔළුවේ තියාගෙන (hidden state), ඊළඟ බෝලයට යනවා. සරල RNN එක පැය 3ක match එකේ මුල් ඕවර් අමතක කරන කෙනෙක්. LSTM එක notebook එකක වැදගත් දේවල් විතරක් ලියාගන්න, අනවශ්‍ය දේ කපා හරින කෙනෙක්.',
      example: 'Sentiment model එකකට review එකක් එනවා: "Hotel එකේ කාමර පොඩියි, Wi-Fi හෙමින්, ඒත් කෑම නම් නියමයි, ආයෙත් එනවා." වචන 15ක් විතර. සරල RNN එකකට අගට එනකොට මුල් negative කොටස සහ අග positive කොටස අතර සමබරතාවය අල්ලගන්න අමාරු වෙන්න පුළුවන්. LSTM එකේ forget gate එක "ඒත්" කියන වචනයෙන් පස්සේ පරණ negative හැඟීම අඩු කරලා, "ආයෙත් එනවා" කියන එකට බර දීලා, positive කියලා නිවැරදිව තීරණය කරන්න පුළුවන්.',
      keyPoints: [
        'RNN = sequence එක පියවරෙන් පියවර කියවමින් hidden state එකක් මතකයක් විදිහට ගෙනියනවා.',
        'සරල RNN = දිගු sequences වලදී vanishing gradients නිසා මතකය නැති වෙනවා.',
        'LSTM = cell state + forget, input, output gates. GRU = gates දෙකක් තියෙන සරල version එක.',
        'Bidirectional = ඉස්සරහට සහ ආපස්සට දෙපැත්තටම කියවනවා.',
      ],
      terms: [
        { en: 'RNN (Recurrent Neural Network)', si: 'Sequence එකේ හැම පියවරකදීම hidden state එක ඊළඟ පියවරට යවන network එක.' },
        { en: 'Hidden State', si: 'RNN එක මෙතෙක් දැකපු දේවල් වල සාරාංශය තියාගන්නා අංක ලැයිස්තුව.' },
        { en: 'LSTM', si: 'Cell state සහ gates තුනක් පාවිච්චි කරලා දිගු කාලීන මතකය තියාගන්නා RNN වර්ගය.' },
        { en: 'GRU', si: 'Update සහ reset gates දෙකක් තියෙන, LSTM එකට වඩා සරල RNN වර්ගය.' },
        { en: 'Bidirectional RNN', si: 'Sequence එක දෙපැත්තටම කියවලා හැම තැනකටම දෙපැත්තේ context එක දෙන RNN එක.' },
        { en: 'Sequence Data', si: 'වාක්‍ය, කටහඬ, time series වගේ අනුපිළිවෙළ වැදගත් වෙන data.' },
      ],
    },
    {
      id: 'seq2seq-attention',
      title: 'Seq2Seq, Encoder-Decoder & Attention',
      body: [
        'Translation වගේ වැඩ වලදී input එකත් sequence එකක්, output එකත් sequence එකක්. ඒ දෙකේ දිග වෙනස් වෙන්නත් පුළුවන්. "I am going home" (වචන 4) → "මම ගෙදර යනවා" (වචන 3). මේකට Seq2Seq (sequence-to-sequence) models පාවිච්චි කරනවා.',
        'Seq2Seq model එකක කොටස් දෙකක් තියෙනවා. Encoder එක input වාක්‍යය මුළුමනින්ම කියවලා ඒකේ තේරුම context vector කියන අංක ලැයිස්තුවකට හකුළනවා. Decoder එක ඒ context vector එක අරගෙන output වාක්‍යය වචනයෙන් වචනය හදනවා. මුලදී මේ දෙකම LSTMs වලින් හැදුවා.',
        'ප්‍රශ්නය: දිගු වාක්‍යයක මුළු තේරුමම එක පොඩි vector එකකට හකුළන්න අමාරුයි. මේකට bottleneck කියනවා. 2014 දී Bahdanau ඇතුළු researchers attention mechanism එක හඳුන්වා දුන්නා. Decoder එක හැම output වචනයක්ම හදනකොට, encoder එකේ හැම input වචනයක්ම ආයෙත් බලනවා, සහ ඒ මොහොතට වැදගත්ම වචන වලට වැඩි බරක් (attention weight) දෙනවා.',
        '"ගෙදර" කියන වචනය හදනකොට model එක "home" කියන වචනයට වැඩිම attention එකක් දෙනවා. මේ attention weights ඔක්කොම එකතු කළාම 1යි, softmax එකෙන් හදන නිසා. 2017 දී "Attention Is All You Need" කියන paper එකෙන් RNNs සම්පූර්ණයෙන්ම අයින් කරලා attention විතරක් පාවිච්චි කරන Transformer architecture එක ආවා. GPT, BERT, Claude වගේ හැම නවීන LLM එකකම පදනම ඒකයි. ඉතින් attention කියන්නේ RNNs සහ Transformers අතර පාලම.',
      ],
      analogy: 'Encoder-decoder හිතන්න භාෂා දෙකක් දන්න පරිවර්තකයෙක් වගේ. Attention නැති පරිවර්තකයා ඉංග්‍රීසි කතාව මුළුමනින්ම අහලා, ඔළුවේ මතක තියාගෙන, ඊට පස්සේ කඩදාසිය බලන්නේ නැතුව සිංහලෙන් කියනවා. Attention තියෙන පරිවර්තකයා සිංහල වචනයක් කියන හැම වෙලාවෙම මුල් ඉංග්‍රීසි කඩදාසිය බලලා, ඒ වෙලාවට අදාළ වචනය මත ඇඟිල්ල තියාගන්නවා.',
      example: '"The cat sat on the mat" → "පූසා පැදුර උඩ වාඩි වුණා" translation එකේදී "පූසා" හදනකොට attention weights මෙහෙම වෙන්න පුළුවන්: cat 0.85, The 0.08, sat 0.03, අනිත් වචන 0.04. "පැදුර" හදනකොට: mat 0.80, on 0.10, the 0.05, අනිත් ඒවා 0.05. හැම පේළියකම එකතුව 1.0යි.',
      keyPoints: [
        'Seq2Seq = sequence එකක් වෙනත් sequence එකකට හරවන model එක.',
        'Encoder = input එක තේරුම් ගන්නවා. Decoder = output එක හදනවා.',
        'තනි context vector එකක් = bottleneck. දිගු වාක්‍ය වලදී තොරතුරු නැති වෙනවා.',
        'Attention = හැම output පියවරකදීම input එකේ අදාළ කොටස් වලට බර දෙනවා. Transformers වල හදවත මේකයි.',
      ],
      terms: [
        { en: 'Seq2Seq', si: 'Input sequence එකක් output sequence එකකට හරවන model වර්ගය. Translation, summarization වලට.' },
        { en: 'Encoder', si: 'Input එක කියවලා ඒකේ තේරුම අංක (vectors) බවට හරවන කොටස.' },
        { en: 'Decoder', si: 'Encoder එකේ තොරතුරු පාවිච්චි කරලා output එක පියවරෙන් පියවර හදන කොටස.' },
        { en: 'Context Vector', si: 'Encoder එක මුළු input එකේම තේරුම හකුළපු අංක ලැයිස්තුව.' },
        { en: 'Attention Mechanism', si: 'Output එකේ හැම පියවරකටම input එකේ කොයි කොටස් කොච්චර වැදගත්ද කියලා බර දෙන ක්‍රමය.' },
        { en: 'Transformer', si: 'RNNs නැතුව attention විතරක් පාවිච්චි කරන, 2017 දී ආපු, නවීන LLMs වල පදනම වන architecture එක.' },
      ],
    },
    {
      id: 'autoencoders',
      title: 'Autoencoders & VAE',
      body: [
        'Autoencoder එකක් කියන්නේ තමන්ගේ input එකම output එක විදිහට ආයෙත් හදන්න ඉගෙන ගන්න network එකක්. ඒක අහවල් වැඩක්ද කියලා හිතෙන්න පුළුවන්. රහස තියෙන්නේ මැද: encoder එක input එක ගොඩක් පොඩි latent vector එකකට (bottleneck) හකුළනවා, decoder එක ඒ පොඩි vector එකෙන් ආයෙත් මුල් එක හදනවා.',
        'ඒ පොඩි ඉඩට ඔක්කොම දේවල් දාන්න බැරි නිසා, network එකට වැදගත්ම features විතරක් තෝරගන්න සිද්ධ වෙනවා. ඒ නිසා autoencoders පාවිච්චි කරනවා data compress කරන්න, පින්තූර වල noise අයින් කරන්න (denoising autoencoder), සහ අසාමාන්‍ය දේවල් හොයන්න (anomaly detection). සාමාන්‍ය data හොඳට ආයෙත් හදනවා, අසාමාන්‍ය data හදනකොට ලොකු වැරැද්දක් එනවා.',
        'VAE (Variational Autoencoder) එක අලුත් දේවල් generate කරන්න පුළුවන් version එකක්. සාමාන්‍ය autoencoder එකේ encoder එක එක නිශ්චිත point එකක් දෙනවා. VAE එකේ encoder එක mean එකක් සහ variance එකක් දෙනවා, ඒ කියන්නේ latent space එකේ කලාපයක්. Training එකේදී KL divergence කියන අමතර loss එකකින් මේ කලාප සුමට, සම්මත normal distribution එකක් වගේ හැඩයකට තියාගන්නවා.',
        'ඒ නිසා latent space එකෙන් අහඹු point එකක් අරගෙන decoder එකට දුන්නොත් ඇත්ත වගේ අලුත් පින්තූරයක් එනවා. Point දෙකක් අතර හෙමින් ගමන් කළොත්, උදාහරණයකට හිනාවෙන මුහුණක සිට නොහිනාවෙන මුහුණක් දක්වා සුමට වෙනසක් බලන්න පුළුවන්. Stable Diffusion වගේ models වලත් පින්තූර compress කරන්න VAE එකක් පාවිච්චි වෙනවා.',
      ],
      analogy: 'Autoencoder හිතන්න කෙනෙක්ට විනාඩි 3ක film trailer එකක් පෙන්නලා, ඒක වචන 10කින් යාළුවෙක්ට කියන්න කියනවා වගේ. යාළුවා ඒ වචන 10න් trailer එක ගැන හිතාගන්නවා. වචන 10ට ඔක්කොම දාන්න බැරි නිසා වැදගත්ම දේවල් විතරක් තෝරගන්න වෙනවා. VAE එකේදී යාළුවාට ඒ වගේ වචන අලුතින් හදලා, කවදාවත් නැති අලුත් film එකක් හිතාගන්නත් පුළුවන්.',
      example: 'Handwritten ඉලක්කම් පින්තූරයක pixels 28 × 28 = 784යි. Autoencoder එකේ encoder එක මේක අංක 32කට හකුළනවා, ඒ කියන්නේ 24 ගුණයක compression එකක්. Decoder එක ඒ අංක 32න් pixels 784ම ආයෙත් හදනවා. Bank එකක සාමාන්‍ය ගනුදෙනු වලින් train කරපු autoencoder එකකට වංචනික ගනුදෙනුවක් ආවොත්, reconstruction error එක සාමාන්‍ය 0.02 වෙනුවට 0.30 වගේ ලොකු අගයක් වෙනවා, ඒ නිසා ඒක සැක සහිත කියලා flag කරනවා.',
      keyPoints: [
        'Autoencoder = encoder (හකුළනවා) + bottleneck + decoder (ආයෙත් හදනවා).',
        'Compression, denoising, anomaly detection වලට පාවිච්චි වෙනවා.',
        'VAE = latent space එක සුමට කරලා අලුත් samples generate කරන්න පුළුවන් කරනවා.',
        'VAE loss = reconstruction loss + KL divergence.',
      ],
      terms: [
        { en: 'Autoencoder', si: 'Input එක පොඩි representation එකකට හකුළලා ආයෙත් මුල් එක හදන්න ඉගෙන ගන්න network එක.' },
        { en: 'Latent Space', si: 'Encoder එක data හකුළන, අඩු dimensions තියෙන සැඟවුණු අවකාශය.' },
        { en: 'Bottleneck', si: 'Network එකේ පටුම කොටස. වැදගත් තොරතුරු විතරක් ඒ හරහා යනවා.' },
        { en: 'VAE (Variational Autoencoder)', si: 'Latent space එකේ distributions ඉගෙන ගෙන අලුත් data generate කරන්න පුළුවන් autoencoder එක.' },
        { en: 'KL Divergence', si: 'Distributions දෙකක් කොච්චර වෙනස්ද කියලා මනින මිනුම. VAE එකේ latent space එක සුමට කරන්න පාවිච්චි වෙනවා.' },
        { en: 'Reconstruction Error', si: 'මුල් input එක සහ ආයෙත් හදපු output එක අතර වෙනස.' },
      ],
    },
    {
      id: 'gans',
      title: 'GANs: Generator vs Discriminator',
      body: [
        'GAN (Generative Adversarial Network) එක 2014 දී Ian Goodfellow ඇතුළු කණ්ඩායමක් හඳුන්වා දුන්නා. ඒකේ networks දෙකක් එකිනෙකාට විරුද්ධව තරඟ කරනවා. Generator එක අහඹු noise එකක් අරගෙන ඇත්ත වගේ පෙනෙන ව්‍යාජ පින්තූර හදනවා. Discriminator එක පින්තූරයක් දැක්කාම ඒක ඇත්තද ව්‍යාජද කියලා තීරණය කරනවා.',
        'Discriminator එක ව්‍යාජ පින්තූර අල්ලන්න හොඳ වෙනකොට, generator එකට ඊට වඩා හොඳ ව්‍යාජ හදන්න සිද්ධ වෙනවා. Generator එක හොඳ වෙනකොට discriminator එකටත් තවත් සියුම් වෙන්න වෙනවා. මේ තරඟය දිගටම යනකොට generator එක ඇත්තටම වගේ පින්තූර හදන්න ඉගෙන ගන්නවා.',
        'GAN train කරන එක අමාරුයි. එකක් අනිත් එකට වඩා ගොඩක් ඉස්සරහට ගියොත් training එක කඩා වැටෙනවා. Mode collapse කියන ප්‍රශ්නයත් තියෙනවා: generator එක discriminator එක රවට්ටන්න පුළුවන් පින්තූර වර්ග කීපයක් විතරක් ආයෙ ආයෙ හදනවා, විවිධත්වයක් නැතුව.',
        'DCGAN (Deep Convolutional GAN, 2015) එක generator සහ discriminator දෙකටම CNN layers පාවිච්චි කරලා training ස්ථාවර කරන මාර්ගෝපදේශ දුන්නා. StyleGAN (NVIDIA, 2018 සිට) ඉතා යථාර්ථවාදී මිනිස් මුහුණු හදන්න පුළුවන්. ඇත්තටම නැති මිනිස්සුන්ගේ මුහුණු. Style එක (කොණ්ඩය, වයස, ආලෝකය) විවිධ මට්ටම් වලදී පාලනය කරන්න පුළුවන්. අද පින්තූර generate කරන්න diffusion models වැඩියෙන් පාවිච්චි වුණත්, GANs තාමත් වේගවත් generation වලට වැදගත්.',
      ],
      analogy: 'ව්‍යාජ Rs. 5000 නෝට්ටු හදන කෙනෙක් (generator) සහ බැංකුවේ නෝට්ටු පරීක්ෂකයෙක් (discriminator) හිතන්න. මුලදී ව්‍යාජ නෝට්ටු ගොඩක් නරකයි, පරීක්ෂකයා ලේසියෙන් අල්ලනවා. ව්‍යාජකරු වැරදි වලින් ඉගෙන ගෙන හොඳ කරනවා. පරීක්ෂකයාත් අලුත් ලක්ෂණ බලන්න ඉගෙන ගන්නවා. අන්තිමට ව්‍යාජ නෝට්ටුව ඇත්ත එකෙන් වෙන් කරගන්න බැරි තරම් හොඳ වෙනවා. (මේක AI තේරුම් ගන්න උදාහරණයක් විතරයි.)',
      example: 'Training මුලදී discriminator එක ව්‍යාජ පින්තූර 95%ක්ම නිවැරදිව අල්ලනවා. Epochs දහස් ගණනක් ගියාම, generator එක හොඳ වෙනකොට discriminator එකේ accuracy එක 50%ට ළඟ වෙනවා. 50% කියන්නේ කාසියක් උඩ දාලා අනුමාන කරනවා වගේ. ඒ කියන්නේ discriminator එකට ඇත්ත සහ ව්‍යාජ වෙන් කරගන්න බෑ. න්‍යායාත්මකව generator එකේ ඉලක්කය ඒකයි.',
      keyPoints: [
        'GAN = generator (ව්‍යාජ හදනවා) vs discriminator (ව්‍යාජ අල්ලනවා).',
        'තරඟය නිසා දෙකම හොඳ වෙනවා. අන්තිමට generator එක යථාර්ථවාදී data හදනවා.',
        'ප්‍රශ්න: අස්ථාවර training සහ mode collapse.',
        'DCGAN = CNN-based GAN. StyleGAN = ඉතා යථාර්ථවාදී මුහුණු, style පාලනය.',
      ],
      terms: [
        { en: 'GAN', si: 'Generator සහ discriminator කියන networks දෙක තරඟ කරමින් ඉගෙන ගන්න generative model එක.' },
        { en: 'Generator', si: 'අහඹු noise එකකින් ව්‍යාජ data හදන network එක.' },
        { en: 'Discriminator', si: 'Data එකක් ඇත්තද generator එක හදපු ව්‍යාජද කියලා තීරණය කරන network එක.' },
        { en: 'DCGAN', si: 'Generator සහ discriminator දෙකටම convolutional layers පාවිච්චි කරන GAN එක.' },
        { en: 'StyleGAN', si: 'NVIDIA හදපු, style එක මට්ටම් කීපයකින් පාලනය කරලා යථාර්ථවාදී පින්තූර හදන GAN එක.' },
        { en: 'Mode Collapse', si: 'Generator එක විවිධත්වයක් නැතුව එකම වර්ගයේ outputs කීපයක් විතරක් හදන ප්‍රශ්නය.' },
      ],
    },
    {
      id: 'gnn-siamese',
      title: 'GNNs, Siamese Networks & Contrastive Learning',
      body: [
        'සමහර data grid එකක හෝ පේළියක නෑ, network එකක් (graph එකක්) විදිහට තියෙනවා. Facebook එකේ යාළුවෝ, අණුවක (molecule) atoms, බස් පාරවල් සහ නැවතුම්. Graph එකක nodes (අයිතම) සහ edges (ඒවා අතර සම්බන්ධතා) තියෙනවා. GNN (Graph Neural Network) එක මේ වගේ data වලට හදපු network එකක්.',
        'GNN එකේ ප්‍රධාන අදහස message passing. හැම node එකක්ම තමන්ගේ අසල්වැසි nodes වලින් තොරතුරු (messages) එකතු කරලා තමන්ගේ representation එක update කරනවා. Layers කීපයක් ගියාම node එකකට දුර තියෙන nodes වල තොරතුරුත් ලැබෙනවා. අලුත් බෙහෙත් හොයන්න, fraud networks හොයන්න, recommendation systems වලට, Google Maps වල ගමන් කාලය අනුමාන කරන්න පවා GNNs පාවිච්චි වෙලා තියෙනවා.',
        'Siamese network එකක එකම weights බෙදාගන්න, හරියටම සමාන networks දෙකක් තියෙනවා. Inputs දෙකක් ඒ දෙකට දීලා, ලැබෙන embeddings (අංක ලැයිස්තු) දෙක කොච්චර ළඟද කියලා බලනවා. ළඟ නම් "එකම දේ", දුර නම් "වෙනස් දේ". Phone එකේ face unlock, අත්සන් සත්‍යාපනය වගේ දේවල් වලට මේක ගැළපෙනවා. හැම පුද්ගලයෙක්ටම අලුතින් model එක train කරන්න ඕනේ නෑ, සංසන්දනය කරන්න පුළුවන් නම් ඇති.',
        'Contrastive learning කියන්නේ embeddings ඉගෙන ගන්න ක්‍රමයක්: සමාන දේවල් (positive pairs) embedding space එකේ ළඟට ඇදලා, අසමාන දේවල් (negative pairs) ඈතට තල්ලු කරනවා. එකම පින්තූරයේ වෙනස් augmentations දෙකක් positive pair එකක් විදිහට ගන්න පුළුවන් නිසා labels නැතුවම ඉගෙන ගන්න පුළුවන් (SimCLR). OpenAI එකේ CLIP එක පින්තූර සහ ඒවට ගැළපෙන text captions contrastive learning වලින් එකම space එකකට ගෙනාවා.',
      ],
      analogy: 'Siamese network එක හිතන්න passport counter එකේ නිලධාරියා වගේ. එයා ලෝකේ හැම කෙනාවම හඳුනන්නේ නෑ. එයා කරන්නේ passport එකේ පින්තූරය සහ ඉස්සරහ ඉන්න කෙනාගේ මුහුණ සසඳලා "එකම කෙනාද?" කියලා බලන එක විතරයි. GNN එක හිතන්න ගමක ආරංචි පැතිරෙනවා වගේ: හැම ගෙදරක්ම අල්ලපු ගෙවල් වලින් ආරංචි අහගෙන තමන්ගේ දැනුම update කරනවා.',
      example: 'Face unlock එකක Siamese network එක මුහුණක් අංක 128ක embedding එකකට හරවනවා. ඔයාගේ register කරපු මුහුණ සහ දැන් camera එකේ මුහුණ අතර දුර 0.3යි. සීමාව 0.6 නම්, 0.3 < 0.6 නිසා phone එක unlock වෙනවා. වෙන කෙනෙක්ගේ මුහුණක් එක්ක දුර 1.1ක් ආවොත්, 1.1 > 0.6 නිසා unlock වෙන්නේ නෑ.',
      keyPoints: [
        'GNN = graph data (nodes + edges) වලට. Message passing වලින් අසල්වැසියන්ගෙන් ඉගෙන ගන්නවා.',
        'Siamese network = weights බෙදාගන්න networks දෙකක්, inputs දෙකක් සසඳනවා.',
        'Contrastive learning = සමාන දේ ළඟට, අසමාන දේ ඈතට.',
        'Labels නැතුව වුණත් contrastive learning වලින් හොඳ embeddings ඉගෙන ගන්න පුළුවන්.',
      ],
      terms: [
        { en: 'GNN (Graph Neural Network)', si: 'Nodes සහ edges තියෙන graph data මත වැඩ කරන network එක.' },
        { en: 'Message Passing', si: 'හැම node එකක්ම අසල්වැසි nodes වලින් තොරතුරු එකතු කරලා තමන්ව update කරන ක්‍රමය.' },
        { en: 'Siamese Network', si: 'එකම weights බෙදාගන්න networks දෙකකින් inputs දෙකක embeddings සසඳන architecture එක.' },
        { en: 'Contrastive Learning', si: 'සමාන pairs ළඟට සහ අසමාන pairs ඈතට තල්ලු කරමින් embeddings ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'Embedding', si: 'දෙයක තේරුම නිරූපණය කරන අංක ලැයිස්තුව (vector එක).' },
        { en: 'Self-supervised Learning', si: 'Labels නැතුව data වලින්ම ඉගෙනීමේ කාර්යයක් හදාගෙන ඉගෙන ගන්න ක්‍රමය.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Neuron එකකට inputs 2 සහ 4 එනවා, weights 0.5 සහ 0.25, bias එක -1. ReLU activation එකෙන් පස්සේ output එක මොකක්ද?',
      options: ['0', '1', '3'],
      answer: 1,
      why: '(2 × 0.5) + (4 × 0.25) + (-1) = 1 + 1 - 1 = 1. 1 positive නිසා ReLU එක ඒකම දෙනවා.',
    },
    {
      q: 'Classes කීපයකින් එකක් තෝරන output layer එකට ගැළපෙන්නේ කොයි activation function එකද?',
      options: ['ReLU', 'Softmax', 'Leaky ReLU'],
      answer: 1,
      why: 'Softmax එක scores ලැයිස්තුවක් එකතුව 1 වෙන probabilities බවට හරවනවා. ඒ නිසා multi-class output එකකට ගැළපෙනවා.',
    },
    {
      q: 'Dataset එකේ samples 6,000ක් තියෙනවා, batch size එක 200යි. එක epoch එකකට iterations කීයද?',
      options: ['30', '200', '1,200,000'],
      answer: 0,
      why: 'Iterations per epoch = 6,000 ÷ 200 = 30.',
    },
    {
      q: 'ResNet එකේ skip connections වලින් ප්‍රධාන වශයෙන් විසඳුවේ මොන ප්‍රශ්නයද?',
      options: [
        'GPU memory මදි වීම',
        'ගොඩක් ගැඹුරු networks වල vanishing gradients නිසා training අමාරු වීම',
        'පින්තූර වල පාට නැති වීම',
      ],
      answer: 1,
      why: 'Skip connections (output = F(x) + x) නිසා gradients වලට කෙටි පාරකින් ආපස්සට යන්න පුළුවන්. ඒ නිසා layers සිය ගණනක networks train කරන්න පුළුවන් වුණා.',
    },
    {
      q: 'Transformers සහ LLMs වල වැඩියෙන්ම පාවිච්චි වෙන normalization එක මොකක්ද?',
      options: ['Batch Normalization', 'Layer Normalization', 'Normalization කිසිවක් නෑ'],
      answer: 1,
      why: 'Layer Norm එක එක sample එකක් ඇතුළේ normalize කරන නිසා batch size එක මත රඳා පවතින්නේ නෑ. Transformers වල සම්මතය ඒකයි.',
    },
    {
      q: '32 × 32 පින්තූරයකට 3 × 3 filter එකක් stride 1, padding 0 සමඟ දැම්මොත් output ප්‍රමාණය කීයද?',
      options: ['32 × 32', '30 × 30', '16 × 16'],
      answer: 1,
      why: '(32 - 3) ÷ 1 + 1 = 30. Padding නැති නිසා දාර වලින් pixel එක බැගින් අඩු වෙනවා.',
    },
    {
      q: 'LSTM එකේ forget gate එකේ වැඩේ මොකක්ද?',
      options: [
        'පරණ මතකයෙන් මොනවා අමතක කරන්නද කියලා තීරණය කිරීම',
        'Learning rate එක අඩු කිරීම',
        'පින්තූරයක ප්‍රමාණය අඩු කිරීම',
      ],
      answer: 0,
      why: 'Forget gate එක cell state එකේ තියෙන පරණ තොරතුරු වලින් කොච්චර තියාගන්නද, කොච්චර අයින් කරන්නද කියලා තීරණය කරනවා.',
    },
    {
      q: 'GAN එකක discriminator එකේ වැඩේ මොකක්ද?',
      options: [
        'අහඹු noise වලින් පින්තූර හදන එක',
        'පින්තූරයක් ඇත්තද ව්‍යාජද කියලා තීරණය කරන එක',
        'පින්තූර compress කරන එක',
      ],
      answer: 1,
      why: 'Generator එක ව්‍යාජ data හදනවා, discriminator එක ඇත්ත සහ ව්‍යාජ වෙන් කරන්න උත්සාහ කරනවා. මේ තරඟයෙන් දෙකම හොඳ වෙනවා.',
    },
  ],
}
