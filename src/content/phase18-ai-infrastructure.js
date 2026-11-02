export default {
  id: 'ai-infrastructure',
  number: 18,
  title: 'AI Infrastructure & Operations (NCA-AIIO)',
  titleSi: 'AI Infrastructure: GPU එකේ ඉඳන් data center එකටම, cloud එකටම',
  summary:
    'AI model එකක් run වෙන්නේ හිස් අහසේ නෙවෙයි. ඒකට GPUs, networks, storage, විදුලිය, සිසිලනය, schedulers, monitoring ඔක්කොම ඕනේ. මේ phase එකෙන් ඔයා accelerated data center එකක් හදන්නේ, run කරන්නේ, monitor කරන්නේ කොහොමද, on-prem ද cloud ද කියලා තීරණය කරන්නේ කොහොමද, AWS එකේ GPU instances තෝරන්නේ කොහොමද කියලා ඉගෙන ගන්නවා. NVIDIA NCA-AIIO exam එකටත්, GPU infrastructure size කරන architect කෙනෙක් වෙන්නත් මේක තමයි පදනම. Phase 9 එකේ GPU ඇතුළත ගැන ඉගෙන ගත්ත දේවල් උඩ තමයි මේක හදන්නේ.',
  duration: 'සති 3-5',
  topics: [
    {
      id: 'ai-adoption-drivers',
      title: 'AI vs ML vs Deep Learning, and What Drove Recent AI Adoption',
      body: [
        'AI (Artificial Intelligence) කියන්නේ ලොකුම කුඩේ. මිනිස් බුද්ධිය ඕනේ වෙන වැඩ machine එකකට කරවන ඕනෑම ක්‍රමයක් AI. ඒ කුඩේ ඇතුළේ තියෙන්නේ Machine Learning (ML). ML වලදී අපි rules අතින් ලියන්නේ නෑ. Machine එක data වලින් patterns ඉගෙන ගන්නවා. ML ඇතුළේ තියෙන්නේ Deep Learning (DL). DL කියන්නේ layers ගොඩක් තියෙන neural networks පාවිච්චි කරන ML. ChatGPT, image generators, speech recognition ඔක්කොම DL.',
        'Neural networks අදහස අවුරුදු 50කට වඩා පරණයි. එහෙනම් ඇයි දැන් විතරක් AI පිපිරුණේ? හේතු හතරක් එකට ආවා. (1) Data: internet, smartphones, sensors නිසා data ගොඩක් ලැබුණා. (2) Compute: GPUs. 2012 දී AlexNet කියන image model එක GPUs වලින් train කරලා ImageNet තරගය ලොකු පරතරයකින් දිනුවා. එදා ඉඳන් DL = GPU. (3) Algorithms: 2017 Transformer architecture එක ආවා. ඒක GPU එකේ parallel විදිහට train කරන්න පහසුයි. LLMs ඔක්කොම මේකෙන්. (4) Software සහ cloud: CUDA, PyTorch වගේ frameworks, open-source models, cloud GPUs නිසා ඕනෑම කෙනෙකුට පටන් ගන්න පුළුවන් වුණා.',
        'Infrastructure පැත්තෙන් බලද්දී වැදගත්ම දේ මේකයි: models ලොකු වෙද්දී ඒවාට ඕනේ compute එක ඉක්මනින් වැඩි වෙනවා. ඒ නිසා AI කියන්නේ software ප්‍රශ්නයක් විතරක් නෙවෙයි. GPUs, networks, විදුලිය, සිසිලනය කියන ඔක්කොම architecture ප්‍රශ්න. ඔයා architect කෙනෙක් විදිහට ඉගෙන ගන්න ඕනේ ඒ පැත්ත.',
      ],
      analogy:
        'AI කියන්නේ "කෑම හදන එක" වගේ. ML කියන්නේ recipe පොතක් නැතුව, කෑම රස බලලා බලලා හදන්න ඉගෙන ගන්න එක. DL කියන්නේ ඒ වැඩේට කෝකියෝ සිය ගණනක් layers විදිහට වැඩ කරන ලොකු hotel කුස්සියක්. පරණ කාලේ recipe එක දැනගෙන හිටියා, ඒත් අමුද්‍රව්‍ය (data), ලොකු කුස්සිය (GPU), හොඳ ක්‍රමය (Transformer) තිබුණේ නෑ. ඔක්කොම එකට ලැබුණාම තමයි hotel එක පටන් ගත්තේ.',
      example:
        'Bank එකක fraud detection එක හිතන්න. පරණ ක්‍රමය: "Rs. 500,000 ට වැඩි ගනුදෙනුවක් රෑ 2ට වුණොත් alert" වගේ rule එකක් අතින් ලියනවා (AI, ML නෙවෙයි). ML ක්‍රමය: පරණ ගනුදෙනු ලක්ෂ ගණනකින් model එකක් fraud patterns ඉගෙන ගන්නවා. DL ක්‍රමය: ගනුදෙනු sequences ගොඩක් neural network එකකට දීලා, මිනිහෙක්ට පේන්නේ නැති patterns අල්ලනවා. අන්තිම එකට තමයි GPU ඕනේ වෙන්නේ.',
      keyPoints: [
        'AI ⊃ ML ⊃ DL. DL = layers ගොඩක් තියෙන neural networks.',
        'Adoption drivers: data, GPU compute, Transformer වගේ algorithms, software/cloud/open source.',
        'AlexNet (2012) = GPU මත DL සාර්ථක වුණ හැරවුම් ලක්ෂ්‍යය.',
        'Models ලොකු වෙද්දී infrastructure එකම architecture ප්‍රශ්නයක් වෙනවා.',
      ],
      terms: [
        { en: 'Artificial Intelligence (AI)', si: 'බුද්ධිය ඕනේ වෙන වැඩ machine එකකට කරවන ඕනෑම ක්‍රමයක්. Rules-based systems ත් ඇතුළත්.' },
        { en: 'Machine Learning (ML)', si: 'Rules අතින් ලියන්නේ නැතුව data වලින් patterns ඉගෙන ගන්න AI කොටස.' },
        { en: 'Deep Learning (DL)', si: 'Layers ගොඩක් තියෙන neural networks පාවිච්චි කරන ML. GPU ගොඩක් ඕනේ.' },
        { en: 'Generative AI', si: 'අලුත් text, images, code, audio හදන DL models. LLMs මෙතනට අයිතියි.' },
        { en: 'AlexNet', si: '2012 GPUs දෙකක් පාවිච්චි කරලා train කරපු image model එක. DL යුගය පටන් ගත්තේ මෙතනින්.' },
      ],
    },
    {
      id: 'ai-use-cases-industry',
      title: 'Main AI Use Cases by Industry (with Sri Lankan Examples)',
      body: [
        'NCA-AIIO exam එක අහනවා "මේ industry එකේ AI පාවිච්චි වෙන්නේ කොහොමද" කියලා. මතක තියාගන්න පහසුම ක්‍රමය: හැම industry එකකම AI කරන්නේ වැඩ හතරෙන් එකක්. (1) Predict: ඉදිරියේ වෙන දේ අනුමාන කරනවා. (2) Detect: අසාමාන්‍ය දේ හොයනවා. (3) See/Hear/Read: images, voice, documents තේරුම් ගන්නවා. (4) Generate/Converse: text, code, answers හදනවා.',
        'Financial services (banking): fraud detection, credit scoring, AML (money laundering) හොයන එක, customer chatbots, documents (KYC forms) කියවන එක. Telco: network traffic predict කරලා capacity plan කරන එක, churn prediction (කවුද network එක මාරු කරන්න යන්නේ), Sinhala/Tamil voice call-center bots. Retail: demand forecasting, recommendations, shelf images බලලා stock නැති බඩු හොයන එක. Manufacturing (apparel වගේ): camera එකෙන් රෙදි වල දෝෂ හොයන visual inspection, machines කැඩෙන්න කලින් predict කරන predictive maintenance.',
        'Healthcare: X-ray, CT scans වල ලෙඩ හොයන medical imaging, drug discovery, doctors ලගේ notes summarize කරන එක. Agriculture: drone/satellite images වලින් වගාවේ ලෙඩ හොයන එක, අස්වැන්න predict කරන එක. Tourism/hospitality: dynamic pricing, reviews analyze කරන එක, multilingual travel assistants. Automotive/transport: self-driving, route optimization. Public sector: smart city cameras, documents digitize කරන එක.',
        'Infrastructure පැත්තෙන් මේක වැදගත් ඇයි? Use case එක අනුව hardware එක වෙනස් වෙනවා. Fraud detection = real-time, අඩු latency inference, ගොඩක් tabular data. Medical imaging = ලොකු images, GPU memory ගොඩක්. Chatbot = LLM inference, GPU memory සහ concurrency. Factory floor inspection = edge device එකක් (Jetson වගේ) machine එක ළඟම.',
      ],
      analogy:
        'AI කියන්නේ multi-tool පිහියක් වගේ. එකම පිහිය මාළු කපන්නත්, බෝතල් අරින්නත්, ඉස්කුරුප්පු තද කරන්නත් පාවිච්චි කරනවා. Industry එක අනුව පාවිච්චි කරන blade එක වෙනස්. ඒත් පිහියේ handle එක (GPU, data, models) එකයි.',
      example:
        'ලංකාවේ උදාහරණ: Bank එකක් card ගනුදෙනු real time බලලා fraud අල්ලනවා. Telco එකක් ඊළඟ මාසේ data plan එක cancel කරන්න ඉඩ තියෙන customers ලට කලින්ම offer එකක් දෙනවා. Apparel factory එකක camera එකක් sewing line එකේ මැහුම් වැරදි අල්ලනවා. තේ වතුවල drone images වලින් ලෙඩ වැළඳුණු පඳුරු හොයනවා, තේ කොළ grade කරනවා. Hotel එකක් season එක අනුව කාමර මිල වෙනස් කරනවා. ආරෝග්‍යශාලාවක X-ray images වල TB ලකුණු මුලින්ම screen කරනවා.',
      keyPoints: [
        'AI වැඩ හතර: predict, detect, see/hear/read, generate.',
        'Banking: fraud, credit, AML, chatbots. Telco: churn, network planning. Manufacturing: visual inspection, predictive maintenance.',
        'Healthcare: medical imaging. Retail: forecasting, recommendations.',
        'Use case එක අනුව latency, memory, edge vs data center තීරණ වෙනස් වෙනවා.',
      ],
      terms: [
        { en: 'Predictive Maintenance', si: 'Sensor data වලින් machine එකක් කැඩෙන්න කලින් ඒක predict කරන එක.' },
        { en: 'Visual Inspection', si: 'Camera + model එකකින් නිෂ්පාදන වල දෝෂ ස්වයංක්‍රීයව හොයන එක.' },
        { en: 'Churn Prediction', si: 'කවුද service එක නවත්තලා යන්න ඉඩ තියෙන්නේ කියලා අනුමාන කරන එක.' },
        { en: 'Recommender System', si: 'Customer කෙනෙක්ට කැමති වෙන්න ඉඩ තියෙන products/content යෝජනා කරන system එක.' },
        { en: 'Edge AI', si: 'Data center එකේ නෙවෙයි, data හැදෙන තැනම (camera, machine, vehicle) model එක run කරන එක.' },
      ],
    },
    {
      id: 'gpu-vs-cpu-architecture',
      title: 'GPU vs CPU Architecture: Why Parallelism Matters',
      body: [
        'CPU එක හදලා තියෙන්නේ latency එකට, ඒ කියන්නේ එක වැඩක් හැකි ඉක්මනින් ඉවර කරන්න. CPU core එකක් ගොඩක් දක්ෂයි. ලොකු cache එකක්, branch prediction, out-of-order execution වගේ දේවල් තියෙනවා. ඒත් server CPU එකක cores තියෙන්නේ දුසිම් ගණනක් විතරයි. OS එක, database එක, web server එක, if-else ගොඩක් තියෙන logic වලට CPU හොඳම.',
        'GPU එක හදලා තියෙන්නේ throughput එකට, ඒ කියන්නේ එක පාරට වැඩ ගොඩක් ඉවර කරන්න. Chip එකේ වැඩි ඉඩක් යන්නේ cache සහ control logic වලට නෙවෙයි, ගණන් කරන units වලට. ඒ නිසා සරල cores දහස් ගණනක් තියෙනවා. එක core එකක් CPU core එකකට වඩා හෙමින්, දක්ෂකම අඩුයි. ඒත් දහස් ගණනක් එකවර වැඩ කරනවා. GPU එකට HBM වගේ ඉතා වේගවත් memory එකකුත් තියෙනවා (Phase 9 බලන්න).',
        'AI වලට parallelism වැදගත් ඇයි? Neural network එකක වැඩි කාලයක් යන්නේ matrix multiplication වලට. Matrix එකක එක පිළිතුරු cell එකක් ගණනය කරන්න අනිත් cells බලන්න ඕනේ නෑ. ඒ කියන්නේ cells මිලියන ගණනක් එකවර ගණනය කරන්න පුළුවන්. මේ වගේ, එකිනෙකට බැඳීමක් නැති කුඩා වැඩ ගොඩකට කඩන්න පුළුවන් වැඩ වලට කියන්නේ "embarrassingly parallel" කියලා. GPU එක හරියටම ගැළපෙන්නේ ඒවාට.',
        'ඒත් GPU එක CPU එක replace කරන්නේ නෑ. GPU server එකකත් CPU එකක් තියෙනවා. CPU එක data load කරනවා, preprocessing කරනවා, GPU එකට වැඩ දෙනවා (orchestrate කරනවා). ඒ නිසා "accelerated computing" කියන්නේ CPU + GPU එකට වැඩ කරන එක: serial කොටස CPU එකේ, parallel කොටස GPU එකේ.',
      ],
      analogy:
        'CPU එක කියන්නේ Formula 1 car එකක් වගේ. එක්කෙනෙක්ව ඉතා ඉක්මනින් ගෙනියනවා. GPU එක කියන්නේ Colombo-Kandy route එකේ බස් සිය ගණනක fleet එකක් වගේ. එක බස් එකක් F1 car එකට වඩා හෙමින්. ඒත් පැයකට මිනිස්සු දහස් ගණනක් ගෙනියනවා. මිනිස්සු ලක්ෂයක් (matrix cells) ගෙනියන්න ඕනේ නම් ඔයා තෝරන්නේ බස් fleet එක.',
      example:
        'Matrix දෙකක් ගුණ කරනවා කියලා හිතන්න. පිළිතුරු matrix එකේ cells 1,000,000ක් තියෙනවා. CPU එකේ cores 32ක් තියෙනවා නම් එක core එකකට cells 31,250ක් වගේ පිළිවෙළට කරන්න වෙනවා. GPU එකක ගණන් units දහස් ගණනක් තියෙන නිසා එක පාරට cells දහස් ගණනක් ගණනය කරනවා, Tensor Cores නම් පොඩි matrix tiles එකපාරටම. ඒ නිසා මේ වගේ වැඩවල GPU එක CPU එකට වඩා ගොඩක් වේගවත් වෙනවා. ඒත් "user login එක check කරන්න" වගේ එක පොඩි වැඩකට GPU එකෙන් වාසියක් නෑ.',
      keyPoints: [
        'CPU = latency-optimized, දක්ෂ cores ටිකයි, ලොකු cache.',
        'GPU = throughput-optimized, සරල cores දහස් ගණනක්, high-bandwidth memory.',
        'AI = matrix math = ගොඩක් parallel. ඒකයි GPU.',
        'Accelerated computing = CPU (serial, control) + GPU (parallel math) එකට.',
      ],
      terms: [
        { en: 'Latency-optimized', si: 'එක වැඩක් හැකි ඉක්මනින් ඉවර කරන්න හදපු design එක (CPU).' },
        { en: 'Throughput-optimized', si: 'කාල ඒකකයකට වැඩ ගොඩක් ඉවර කරන්න හදපු design එක (GPU).' },
        { en: 'Embarrassingly Parallel', si: 'එකිනෙකට බැඳීමක් නැති කොටස් වලට කඩලා එකවර කරන්න පුළුවන් වැඩ.' },
        { en: 'Accelerated Computing', si: 'CPU එකට අමතරව GPU වගේ accelerator එකකින් parallel කොටස් වේගවත් කරන ක්‍රමය.' },
        { en: 'SIMT', si: 'Single Instruction, Multiple Threads. එකම instruction එක threads ගොඩක් එකවර වෙනස් data මත කරන GPU ක්‍රමය.' },
      ],
    },
    {
      id: 'cuda-programming-model',
      title: 'CUDA Programming Model: Kernels, Threads, Blocks, Grids, Host vs Device Memory',
      body: [
        'CUDA කියන්නේ NVIDIA GPU එකට වැඩ දෙන්න හදපු platform එක සහ programming model එක. ඔයා දවසින් දවස CUDA code ලියන්නේ නැති වෙයි, මොකද PyTorch, TensorRT වගේ libraries ඒක ඔයා වෙනුවෙන් කරනවා. ඒත් infrastructure කෙනෙක් විදිහට මේ වචන තේරුම් ගන්න ඕනේ, මොකද bottlenecks තේරෙන්නේ ඒවායින්.',
        'Host = CPU එක සහ ඒකේ RAM එක. Device = GPU එක සහ ඒකේ memory එක (HBM/GDDR). Kernel = GPU එකේ run වෙන function එක. Host එක kernel එක launch කරාම, ඒ function එකම threads දහස් ගණනක් එකවර run කරනවා. හැම thread එකක්ම තමන්ගේ ID එක බලලා data වල තමන්ට අදාළ කොටස විතරක් කරනවා.',
        'Threads සංවිධානය වෙන්නේ තට්ටු තුනකට. Thread = කුඩාම වැඩකරුවා. Block = threads කණ්ඩායමක් (උදා: 256). එක block එකක් එකම SM එකක run වෙනවා, ඒ නිසා block එකේ threads ලට shared memory එකෙන් data share කරන්න පුළුවන්. Grid = එක kernel launch එකේ blocks ඔක්කොම. Hardware එක ඇතුළේ threads run වෙන්නේ 32 දෙනාගේ warps විදිහට. Warps, SMs ගැන Phase 9 එකේ "GPU Hardware" topic එකේ විස්තරයක් තියෙනවා.',
        'වැදගත්ම infrastructure පාඩම: host memory සහ device memory වෙනම. Data එක CPU RAM එකේ ඉඳන් GPU memory එකට යන්නේ PCIe bus එක හරහා. PCIe එක GPU එකේ HBM bandwidth එකට වඩා දස ගුණ ගණනකින් හෙමින්. ඒ නිසා data නිතර නිතර CPU ↔ GPU අතර copy කරනවා නම්, GPU එක data එනකම් බලාගෙන ඉන්නවා. හොඳ design එක: data එක පාරක් GPU එකට යවලා, එතනම වැඩ ගොඩක් කරලා, අන්තිමට ප්‍රතිඵලය විතරක් ආපහු ගන්න එක. NVLink සහ GPUDirect වගේ technologies හැදුවෙත් මේ copy වියදම අඩු කරන්න.',
      ],
      analogy:
        'Grid එක කියන්නේ A/L exam එකක් වගේ. Kernel එක කියන්නේ exam paper එක, හැමෝටම එකම paper එක. Block එක කියන්නේ එක exam hall එකක්, ඒ hall එකේ ළමයි ටිකට එකම supervisor (SM) කෙනෙක්. Thread එක කියන්නේ එක ළමයෙක්, තමන්ගේ index number එකට අදාළ answer sheet එක විතරක් ලියනවා. Host to device copy එක කියන්නේ papers ටික Colombo department එකේ ඉඳන් ගම්වල halls වලට lorry වලින් ගෙනියන එක. Hall එක ඇතුළේ ලියන එක ඉක්මනයි. ගෙනියන එක තමයි හෙමින්.',
      example:
        'පහළ code එකේ array එකක අංක 1,000,000ක් තියෙනවා. Block එකකට threads 256ක් දැම්මාම blocks 3907ක් ඕනේ (1,000,000 ÷ 256 = 3906.25, ඉහළට වට කළාම 3907). අන්තිම block එකේ අමතර threads 192ක් "if i < size" check එකෙන් කිසිම දෙයක් කරන්නේ නෑ. මේ "+1" වැඩේ GPU එකේ ඉතා ඉක්මනින් ඉවර වෙනවා. ඒත් array එක PCIe හරහා යවන එකටයි ආපහු ගන්න එකටයි ඊට වඩා වැඩි කාලයක් යන්න පුළුවන්. ඒකයි පොඩි වැඩ වලට GPU එක සමහර වෙලාවට වාසි නැත්තේ.',
      code: {
        lang: 'python',
        src: `from numba import cuda
import numpy as np

@cuda.jit                          # kernel එක: GPU එකේ run වෙන function එක
def add_one(arr):
    i = cuda.grid(1)               # මගේ thread number එක (block id x block size + thread id)
    if i < arr.size:               # අමතර threads කිසි දෙයක් කරන්නේ නෑ
        arr[i] += 1

host = np.zeros(1_000_000, dtype=np.float32)   # host (CPU RAM) එකේ data
dev = cuda.to_device(host)                     # PCIe හරහා device (GPU) memory එකට copy
threads = 256                                  # block එකක threads (32 ගුණාකාරයක්)
blocks = (host.size + threads - 1) // threads  # grid එකේ blocks ගණන = 3907
add_one[blocks, threads](dev)                  # kernel launch
result = dev.copy_to_host()                    # ප්‍රතිඵලය ආපහු CPU එකට`,
      },
      keyPoints: [
        'Host = CPU + RAM. Device = GPU + GPU memory.',
        'Kernel = GPU function. Thread → Block → Grid. Hardware එකේ warps 32 බැගින්.',
        'Block එකක් එක SM එකක run වෙනවා, shared memory share කරනවා.',
        'PCIe copy = වියදම් වැඩක්. Data GPU එකේම තියාගෙන වැඩ ගොඩක් කරන්න.',
      ],
      terms: [
        { en: 'CUDA', si: 'NVIDIA GPUs program කරන්න platform එක සහ programming model එක. ඒ උඩ cuDNN, cuBLAS වගේ libraries.' },
        { en: 'Kernel', si: 'Host එකෙන් launch කරන, GPU threads ගොඩක් එකවර run කරන function එක.' },
        { en: 'Thread / Block / Grid', si: 'Thread = එක වැඩකරුවා. Block = එකම SM එකේ run වෙන threads කණ්ඩායම. Grid = launch එකක blocks ඔක්කොම.' },
        { en: 'Host vs Device Memory', si: 'CPU RAM සහ GPU memory වෙනම address spaces. Data copy කරන්න ඕනේ.' },
        { en: 'PCIe', si: 'CPU සහ GPU (සහ NICs, NVMe) connect කරන bus එක. GPU memory එකට වඩා ගොඩක් හෙමින්.' },
        { en: 'Unified Memory', si: 'CPU සහ GPU දෙකටම එකම pointer එකකින් memory බලන්න දෙන CUDA feature එක. Copy එක driver එක automatic කරනවා, ඒත් වියදම නැති වෙන්නේ නෑ.' },
      ],
    },
    {
      id: 'gpu-bottlenecks',
      title: 'GPU Bottlenecks: Memory, Compute, Utilization',
      body: [
        'GPU එකක් ගන්න ගොඩක් සල්ලි යනවා. ඒ නිසා ඒක පිස්සු වගේ වැඩ නොකර බලාගෙන ඉන්නවා නම් ඒක සල්ලි නාස්තියක්. GPU එක slow වෙන්න ප්‍රධාන හේතු හතරක් තියෙනවා. (1) Memory capacity: model එක, KV cache එක, activations GPU memory එකට හරියන්නේ නැත්නම් "CUDA out of memory" එනවා, නැත්නම් batch size එක අඩු කරන්න වෙනවා. (2) Memory bandwidth: ගණන් ඉක්මනින් කරන්න පුළුවන් වුණත් data memory එකෙන් ගෙනෙන එක හෙමින් නම් GPU එක බලාගෙන ඉන්නවා. මේකට කියන්නේ memory-bound කියලා. LLM decode එක සාමාන්‍යයෙන් memory-bound. (3) Compute: data ඉක්මනින් එනවා, ඒත් ගණන් කරන්න බැහැ තරම් ගණන් තියෙනවා. මේක compute-bound. ලොකු batch එකක් එක්ක training සහ prefill බොහෝවිට compute-bound.',
        '(4) GPU එකෙන් පිටත bottlenecks: data loader එක (CPU preprocessing, disk/storage කියවන එක) හෙමින් නම් GPU එකට කන්න දෙයක් නෑ. Multi-GPU වලදී network එක හෙමින් නම් GPUs gradients exchange කරනකම් බලාගෙන ඉන්නවා (communication overhead). PCIe copies ගොඩක් නම් ඒකත් බාධාවක්.',
        'Utilization එක කියවන්න පරිස්සමෙන්. nvidia-smi එකේ GPU-Util 100% කියන්නේ "කාලයෙන් වැඩි කොටසක kernel එකක් හරි run වුණා" කියන එක විතරයි. SMs ඔක්කොම වැඩ කළා කියන එක නෙවෙයි (Phase 9 "GPU Operations" බලන්න). ඇත්ත තත්ත්වය බලන්න DCGM එකේ SM activity, Tensor Core activity වගේ profiling metrics, සහ Nsight Systems timeline එක පාවිච්චි කරන්න. Timeline එකේ GPU idle gaps තියෙනවා නම් ප්‍රශ්නය ගොඩක් වෙලාවට CPU/data loading පැත්තේ.',
        'පොදු විසඳුම්: batch size වැඩි කරන එක (ගණන් වැඩි කරලා memory traffic එකට සාපේක්ෂව), mixed precision (FP16/BF16/FP8) එක පාවිච්චි කරන එක, data loader workers වැඩි කරලා data prefetch කරන එක, ඉක්මන් storage, quantization වලින් memory අඩු කරන එක, TensorRT වගේ optimized engines පාවිච්චි කරන එක.',
      ],
      analogy:
        'GPU එක කියන්නේ කොත්තු කඩයක ඉතා වේගවත් කොත්තු කොටන කෙනෙක් වගේ. Memory capacity = තාච්චියේ ප්‍රමාණය, පොඩි නම් එක පාරට plate ගොඩක් කොටන්න බෑ. Memory bandwidth = අමුද්‍රව්‍ය ගබඩාවේ ඉඳන් තාච්චියට ගේන වේගය. Compute = කොටන වේගය. Data loader = එළවළු කපන අයියා, එයා හෙමින් නම් කොටන කෙනා අත් බැඳගෙන ඉන්නවා. "කඩේ open" (GPU-Util 100%) කියලා board එක තිබුණාට ඇතුළේ එක්කෙනෙක් විතරක් වැඩ කරනවා වෙන්න පුළුවන්.',
      example:
        'Training job එකක nvidia-smi එකෙන් GPU-Util 35% ත් 100% ත් අතර උඩ පහළ යනවා. Nsight Systems timeline එකේ හැම step එකක් අතරම idle gap එකක් පේනවා, CPU එක images decode කරනවා. DataLoader num_workers 2 ඉඳන් 8ට වැඩි කරලා, pin_memory දැම්මාම gaps අඩු වෙනවා, step time එක පැහැදිලිවම අඩු වෙනවා. GPU එක වෙනස් කළේ නෑ. Bottleneck එක තිබුණේ CPU පැත්තේ.',
      keyPoints: [
        'Bottlenecks: memory capacity, memory bandwidth (memory-bound), compute (compute-bound), data/network/PCIe.',
        'LLM decode ≈ memory-bound. ලොකු batch training/prefill ≈ compute-bound.',
        'GPU-Util 100% ≠ GPU එක full. SM activity, Tensor activity, timeline බලන්න.',
        'Idle gaps = බොහෝවිට data pipeline ප්‍රශ්නයක්.',
      ],
      terms: [
        { en: 'Memory-bound', si: 'Data memory එකෙන් ගේන වේගය නිසා සීමා වෙලා තියෙන වැඩ. ගණන් units බලාගෙන ඉන්නවා.' },
        { en: 'Compute-bound', si: 'ගණන් කරන වේගය නිසා සීමා වෙලා තියෙන වැඩ.' },
        { en: 'Out of Memory (OOM)', si: 'GPU memory එකට model + data හරියන්නේ නැති වුණාම එන error එක.' },
        { en: 'Communication Overhead', si: 'Multi-GPU වලදී GPUs අතර data exchange කරන්න යන අමතර කාලය.' },
        { en: 'Data Loader Bottleneck', si: 'CPU/storage පැත්තෙන් data ඉක්මනින් නොඑන නිසා GPU idle වීම.' },
      ],
    },
    {
      id: 'training-vs-inference-hardware',
      title: 'Hardware Needs: Training vs Inference, and Training Use Cases',
      body: [
        'Training කියන්නේ model එක ඉගැන්නන එක. Inference කියන්නේ ඉගෙන ගත්ත model එකෙන් උත්තර ගන්න එක. දෙකටම GPU ඕනේ, ඒත් අවශ්‍යතා ගොඩක් වෙනස්.',
        'Training: weights විතරක් නෙවෙයි, gradients, optimizer states (Adam නම් එක parameter එකකට අගයන් දෙකක්), activations ඔක්කොම memory එකේ තියාගන්න ඕනේ. ඒ නිසා inference එකට වඩා memory කිහිප ගුණයක් ඕනේ. Training දවස්, සති ගණන් දිගටම run වෙනවා. ලොකු models වලට GPUs සිය ගණනක් එකට වැඩ කරන්න ඕනේ, ඒ නිසා NVLink, InfiniBand වගේ වේගවත් interconnects ඉතා වැදගත්. ලොකු datasets කියවන්නත්, checkpoints ලියන්නත් වේගවත් shared storage ඕනේ. ඉලක්කය: throughput (තත්පරයට samples/tokens කීයක් ඉගෙන ගන්නවද) සහ total time-to-train.',
        'Inference: weights + KV cache (LLM නම්) විතරයි. Memory අඩුයි. ඉලක්කය: latency (user ට උත්තරය කොච්චර ඉක්මනින්ද) සහ cost per request. Traffic එක දවස පුරා වෙනස් වෙනවා, ඒ නිසා autoscaling වැදගත්. පොඩි models නම් L4, L40S වගේ අඩු power, අඩු මිල GPUs ඇති. ලොකු LLMs නම් H100 වගේ ලොකු memory GPUs සහ tensor parallelism ඕනේ. Inference වලට FP8, INT8, INT4 වගේ quantization ගොඩක් පාවිච්චි කරනවා, TensorRT/TensorRT-LLM වලින් optimize කරනවා.',
        'Training use cases අනුව hardware: Classic ML (XGBoost) tabular data = CPU හෝ RAPIDS එක්ක එක GPU එකක්. Computer vision fine-tuning (defect detection වගේ) = GPUs 1-4, data loading/storage වැදගත්. LLM LoRA/QLoRA fine-tuning (7B-8B) = එක 24-80 GB GPU එකක්. LLM full fine-tuning = 8-GPU NVLink node එකක් (HGX/DGX class) + FSDP/ZeRO. Foundation model pretraining = nodes සිය ගණනක්, InfiniBand/Spectrum-X fabric, parallel file system, සති ගණන් (SuperPOD class). සරලව: model ලොකු + data ලොකු + ඉක්මනින් ඕනේ = GPUs වැඩි + network වේගවත් + storage වේගවත්.',
        'Architect කෙනෙක්ගේ සරල rule එක: Training = "ලොකු, එකට බැඳුණු, දිගු කාලීන cluster එකක්". Inference = "පොඩි, ස්වාධීන, scale out වෙන replicas ගොඩක්". Training cluster එකක GPUs එකිනෙකා අතර network එක ඉතා වැදගත්. Inference replicas සාමාන්‍යයෙන් එකිනෙකා එක්ක කතා කරන්නේ නෑ, load balancer එකක් පිටිපස්සේ ඉන්නවා.',
      ],
      analogy:
        'Training කියන්නේ වෛද්‍යවරයෙක් හදන්න අවුරුදු 5ක medical faculty එකක් වගේ. ලොකු campus එකක් (cluster), පොත් ගොඩක් (storage), lecturers ලා අතර කතාබහ (network), ගොඩක් කාලයක් ඕනේ. Inference කියන්නේ ඉගෙන ගත්ත doctor channel center එකක patients බලන එක වගේ. එක patient කෙනෙක්ට විනාඩි කිහිපයයි. ලොකු campus එකක් ඕනේ නෑ. Patients වැඩි නම් doctors ලා (replicas) වැඩි කරනවා.',
      example:
        '7B model එකක් BF16 වලින්: Inference වලට weights 14 GB + KV cache. 24 GB L4 එකක හරියනවා (concurrency අඩු නම්). ඒ model එකම full fine-tune (Adam එක්ක mixed precision) කරනවා නම් එක parameter එකකට bytes 16ක් පමණ යනවා (weights, gradients, FP32 master weights, Adam states දෙක). 7B × 16 = 112 GB, activations නැතුවමත්. ඒ කියන්නේ 80 GB GPUs කිහිපයක් සහ ZeRO/FSDP වගේ sharding ඕනේ. එකම model එකට training වලට inference වලට වඩා හත් අට ගුණයක memory එකක් යනවා. ඒත් LoRA වලින් fine-tune කරනවා නම් base weights freeze නිසා එක 48-80 GB GPU එකක් ඇති. බිංදුවේ ඉඳන් ලොකු Sinhala foundation model එකක් pretrain කරනවා නම් nodes ගොඩක් මාස ගණනකට ඕනේ, ඒකයි ගොඩක් ආයතන open model එකක් fine-tune කරන්නේ.',
      keyPoints: [
        'Training memory = weights + gradients + optimizer states + activations. Inference = weights + KV cache.',
        'Training: throughput, interconnect, shared storage, දිගු jobs.',
        'Inference: latency, cost per request, autoscaling, quantization.',
        'Training = tightly coupled cluster. Inference = independent replicas behind a load balancer.',
        'Use case ladder: classic ML → CPU/1 GPU, LoRA → 1 GPU, full fine-tune → 8-GPU node, pretraining → SuperPOD class.',
      ],
      terms: [
        { en: 'Optimizer States', si: 'Adam වගේ optimizers හැම parameter එකකටම තියාගන්න අමතර අගයන් (momentum, variance). Training memory වැඩි වෙන්නේ මේ නිසා.' },
        { en: 'Activations', si: 'Forward pass එකේදී හැදෙන අතරමැද outputs. Backward pass එකට තියාගන්න ඕනේ.' },
        { en: 'Time-to-Train', si: 'Model එකක් train කරලා ඉවර කරන්න යන මුළු කාලය.' },
        { en: 'Cost per Inference', si: 'එක request එකක් serve කරන්න යන සාමාන්‍ය වියදම.' },
        { en: 'ZeRO / FSDP', si: 'Optimizer states, gradients, weights GPUs අතර බෙදලා training memory අඩු කරන ක්‍රම.' },
        { en: 'LoRA / QLoRA', si: 'Model එකේ weights ඔක්කොම වෙනස් නොකර පොඩි adapter matrices විතරක් train කරන ක්‍රමය. QLoRA = base model එක 4-bit කරලා.' },
        { en: 'Full Fine-tuning vs Pretraining', si: 'Full fine-tune = තියෙන model එකේ හැම weight එකක්ම update කරනවා. Pretraining = ලොකු data වලින් බිංදුවේ ඉඳන් foundation model එකක් හදනවා.' },
      ],
    },
    {
      id: 'accelerated-cluster-anatomy',
      title: 'Parts of an Accelerated Cluster and Scaling (DGX, HGX, SuperPOD)',
      body: [
        'AI cluster එකක් කියන්නේ GPU servers ටිකක් rack එකකට දාන එක විතරක් නෙවෙයි. කොටස් කිහිපයක් තියෙනවා. (1) Compute nodes: GPU servers. උදා: DGX H100 එකක H100 GPUs 8ක්, ඒවා NVLink/NVSwitch වලින් connect වෙලා, මුළු GPU memory 640 GB. (2) Management/head nodes: cluster එක පාලනය කරන, scheduler (Slurm/Kubernetes control plane) run කරන, users login වෙන servers. (3) Storage: datasets සහ checkpoints තියාගන්න shared, high-performance storage.',
        '(4) Networks කිහිපයක්, එකිනෙකට වෙනම: Compute fabric (east-west) = GPUs nodes අතර training traffic, InfiniBand හෝ RoCE Ethernet, ඉතා වේගවත්. Storage network = nodes සහ storage අතර. In-band management network = OS updates, SSH, monitoring traffic. Out-of-band (OOB) management network = servers වල BMC (baseboard management controller) එකට, server එක off වුණත් power on/off කරන්න, console බලන්න. (5) Software: OS, drivers, CUDA, containers, scheduler, monitoring, cluster manager.',
        'DGX vs HGX (Phase 9 එකේ කෙටියෙන් බැලුවා): DGX = NVIDIA ම හදන සම්පූර්ණ system එක, software සහ support එක්ක. HGX = NVIDIA GPU baseboard එක, Dell, HPE, Supermicro වගේ partners තමන්ගේ servers වලට දානවා. Scale කරන හැටි: Scale up = එක node එක ඇතුළේ GPUs වැඩි කරන එක (NVLink domain එක ලොකු කරන එක). Scale out = nodes වැඩි කරලා network එකකින් එකට බඳින එක.',
        'DGX SuperPOD කියන්නේ NVIDIA ගේ reference architecture එක, DGX nodes ගොඩක්, InfiniBand/Ethernet fabric, storage, management software එකට test කරලා, design කරලා දෙන "AI factory" එක. ඒක හදන්නේ Scalable Units (SU) කියන building blocks වලින්. ඕනේ තරමට SUs එකතු කරලා cluster එක ලොකු කරනවා. Exam එකට මතක තියාගන්න: SuperPOD = DGX nodes + network + storage + software, validated, block විදිහට scale වෙන design එක. BasePOD කියන්නේ ඊට වඩා පොඩි enterprise reference architecture එක.',
      ],
      analogy:
        'Cluster එක කියන්නේ ලොකු ගාමන්ට් factory එකක් වගේ. Compute nodes = මහන machines තියෙන production lines. Head node = factory manager ගේ office එක. Storage = රෙදි ගබඩාව. Compute fabric = lines අතර බඩු යවන conveyor belt එක. In-band management = factory එකේ intercom එක. Out-of-band management = විදුලිය ගියත් වැඩ කරන security guard ගේ walkie-talkie එක. SuperPOD = BOI zone එකේ එකම design එකට හදපු factory buildings ගොඩක්, ඕනේ නම් තව building එකක් (SU) එකතු කරනවා.',
      example:
        'Telco එකකට LLM fine-tuning cluster එකක් ඕනේ. පටන් ගන්නේ DGX/HGX nodes 4කින් (GPUs 32ක්). ඒ nodes 4 InfiniBand switch එකකින් compute fabric එකට, වෙනම storage network එකකින් NFS/parallel storage එකට, 1GbE management switch එකකින් BMC ටිකට. Head nodes දෙකක් (HA) Slurm controller සහ cluster manager run කරනවා. අවුරුද්දකට පස්සේ තව nodes 4ක් ඕනේ වුණාම, compute fabric එකේ ports තියෙනවද, storage throughput එක ඇතිද, rack එකේ power/cooling ඇතිද කියලා බලලා එකතු කරනවා.',
      keyPoints: [
        'Cluster = compute nodes + head/management nodes + storage + networks + software.',
        'Networks: compute (east-west), storage, in-band management, out-of-band (BMC).',
        'DGX = turnkey system. HGX = partner servers වලට baseboard.',
        'Scale up = node එක ඇතුළේ. Scale out = nodes අතර.',
        'SuperPOD = Scalable Units වලින් හදන validated reference architecture.',
      ],
      terms: [
        { en: 'Compute Node', si: 'GPUs තියෙන, jobs run වෙන server එක.' },
        { en: 'Head / Management Node', si: 'Scheduler, cluster manager, login services run වෙන server එක.' },
        { en: 'BMC', si: 'Baseboard Management Controller. Server එකේ OS එකෙන් ස්වාධීනව power, console, sensors පාලනය කරන chip එක.' },
        { en: 'Out-of-band Management', si: 'BMCs ලට යන, production traffic එකෙන් වෙනම management network එක.' },
        { en: 'East-West vs North-South Traffic', si: 'East-west = data center එක ඇතුළේ servers අතර. North-south = data center එකට ඇතුළට/එළියට (users, internet).' },
        { en: 'DGX SuperPOD / Scalable Unit', si: 'NVIDIA ගේ validated large-scale AI cluster design එක. SU = ඒක ලොකු කරන්න එකතු කරන block එක.' },
        { en: 'DGX BasePOD', si: 'Enterprise වලට පොඩි පරිමාණයේ DGX reference architecture එක.' },
      ],
    },
    {
      id: 'datacenter-power-cooling',
      title: 'Data Center Power, Cooling and Facility Requirements',
      body: [
        'GPU servers ගොඩක් විදුලිය කනවා. සාමාන්‍ය enterprise server rack එකක් kilowatts කිහිපයක් ගන්නවා. ඒත් එක 8-GPU AI server එකක්ම kilowatts 10ක් පමණ ගන්න පුළුවන් (උදා: DGX H100 එකක උපරිම power එක 10 kW ට ටිකක් වැඩියි). ඒ වගේ servers කිහිපයක් එක rack එකකට දැම්මාම rack එකේ power density එක පරණ data center එකක design කරපු ප්‍රමාණයට වඩා ගොඩක් වැඩි වෙනවා. Blackwell generation එකේ GB200 NVL72 වගේ rack-scale systems එක rack එකකට kilowatts 100 ඉක්මවනවා, ඒවා liquid cooled.',
        'විදුලියට අදාළ facility ප්‍රශ්න: rack එකකට power feed එක ඇතිද, redundancy (A/B feeds, UPS, generator) තියෙනවද, PDUs ගැළපෙනවද. ගන්න විදුලිය ඔක්කොම අන්තිමට තාපය බවට පත් වෙනවා. ඒ නිසා power එක වැඩි නම් cooling එකත් ඒ තරමටම වැඩි වෙන්න ඕනේ.',
        'Cooling ක්‍රම: Air cooling = fans සහ CRAC/CRAH units, hot aisle / cold aisle containment. සරලයි, ඒත් rack density වැඩි වෙද්දී හුළඟෙන් තාපය ඉවත් කරන එක අමාරු වෙනවා. Liquid cooling = වතුර/coolant එකකින් තාපය ඉවත් කරනවා. Direct-to-chip (cold plates GPU/CPU උඩම), rear-door heat exchangers (rack එකේ පිටිපස්ස දොරේ), immersion cooling (server එකම coolant එකක ගිල්වනවා). වතුරට හුළඟට වඩා ගොඩක් හොඳට තාපය ගෙනියන්න පුළුවන්. ඒ නිසා high-density AI racks liquid cooling පැත්තට යනවා. ඒත් pipes, CDUs (coolant distribution units), leak detection වගේ facility වෙනස්කම් ඕනේ.',
        'Efficiency මනින්නේ PUE (Power Usage Effectiveness) වලින්. PUE = data center එකට එන මුළු විදුලිය ÷ IT equipment වලට යන විදුලිය. PUE 1.0 කියන්නේ පරිපූර්ණයි (ඔක්කොම විදුලිය IT වලට). 1.5 කියන්නේ IT වලට 1 kW යද්දී cooling, lights වගේ දේවලට තව 0.5 kW යනවා. අනිත් facility ප්‍රශ්න: floor එකට rack බර දරාගන්න පුළුවන්ද (GPU racks බරයි), cabling (fiber ගොඩක්), ඉඩ, ලංකාව වගේ උණුසුම් තෙතමනය වැඩි රටක cooling වියදම.',
      ],
      analogy:
        'පරණ data center එකක් කියන්නේ ගෙදර සාමාන්‍ය kitchen එකක් වගේ. Rice cooker එකයි, kettle එකයි දාන්න ඇති wiring තියෙනවා. AI racks කියන්නේ ඒ kitchen එකට hotel එකක industrial ovens 10ක් ගෙනාවා වගේ. Wiring එක පිච්චෙනවා, kitchen එක රත් වෙලා ඉන්න බැරි වෙනවා. Fan එකක් (air cooling) දැම්මාට මදි. ඒකට වතුර pipes තියෙන විශේෂ cooling (liquid) සහ අලුත් wiring ඕනේ.',
      example:
        'ලංකාවේ bank එකක data center එකේ racks හැම එකකටම 8 kW සීමාවක් තියෙනවා. ඔවුන්ට kW 10ක් පමණ ගන්න 8-GPU servers 4ක් දාන්න ඕනේ (මුළු kW 40ක් පමණ). විකල්ප: (1) එක rack එකකට server එකක් බැගින් racks 4කට බෙදන එක (ඉඩ ගොඩක් යනවා, ඒත් facility වෙනස් කරන්න ඕනේ නෑ). (2) High-density rack එකක් සඳහා power සහ rear-door/direct liquid cooling upgrade කරන එක. (3) GPU-ready colocation data center එකකට හරි cloud එකට හරි යන එක. PUE 1.6 නම් IT kW 40 සඳහා facility එකට kW 64ක් පමණ ඕනේ.',
      keyPoints: [
        'AI racks = පරණ racks වලට වඩා ගොඩක් වැඩි power density. විදුලිය = තාපය.',
        'Air cooling සරලයි, ඒත් density සීමාවක් තියෙනවා. Liquid (direct-to-chip, rear-door, immersion) high density වලට.',
        'PUE = මුළු facility power ÷ IT power. 1.0 ට කිට්ටු වෙන තරමට හොඳයි.',
        'Facility checklist: power feeds + redundancy, cooling, floor load, cabling, ඉඩ.',
      ],
      terms: [
        { en: 'Power Density', si: 'Rack එකකට යන kW ප්‍රමාණය. AI racks වල ගොඩක් වැඩියි.' },
        { en: 'PUE', si: 'Power Usage Effectiveness = මුළු facility power ÷ IT power. අඩු වෙන තරමට efficient.' },
        { en: 'Hot / Cold Aisle Containment', si: 'Racks වල සීතල හුළං ඇතුළු වෙන පැත්ත සහ රස්නය එළියට යන පැත්ත වෙන් කරලා air cooling efficient කරන ක්‍රමය.' },
        { en: 'Direct-to-Chip Liquid Cooling', si: 'GPU/CPU උඩ cold plates තියලා coolant යවලා තාපය ඉවත් කරන එක.' },
        { en: 'Rear-Door Heat Exchanger', si: 'Rack එකේ පිටිපස්ස දොරේ වතුර coil එකක් තියලා එළියට එන රස්නය අල්ලන එක.' },
        { en: 'Immersion Cooling', si: 'Servers විදුලිය නොගෙනියන coolant එකක ගිල්වලා සිසිල් කරන එක.' },
        { en: 'UPS / PDU', si: 'UPS = විදුලිය ගියාම තාවකාලිකව power දෙන එක. PDU = rack එක ඇතුළේ servers වලට power බෙදන unit එක.' },
      ],
    },
    {
      id: 'onprem-cloud-hybrid',
      title: 'On-Premises vs Cloud vs Hybrid: Advantages, Challenges, Cost',
      body: [
        'On-premises (on-prem) = ඔයාගේම data center එකේ (හෝ colocation එකක) GPUs මිලට අරන් තියාගන්න එක. වාසි: data ඔයාගේ පාලනය යටතේ (data residency, regulators), GPUs දිගටම 24/7 පාවිච්චි කරනවා නම් දිගු කාලීනව ලාභයි, hardware සහ network එක ඔයාට ඕනේ විදිහට tune කරන්න පුළුවන්. අභියෝග: ලොකු මුල් වියදම (CapEx), GPUs ලැබෙන්න සති මාස ගණන් යන්න පුළුවන්, power/cooling/facility (කලින් topic එක), skilled staff, hardware අවුරුදු කිහිපයකින් පරණ වෙනවා, පාවිච්චි නොකරන වෙලාවට ත් සල්ලි ගිහින් ඉවරයි.',
        'Cloud = AWS, Azure, GCP වගේ තැනකින් GPU instances කුලියට ගන්න එක. වාසි: මුල් වියදමක් නෑ (OpEx), විනාඩි කිහිපයකින් පටන් ගන්න පුළුවන්, අලුත්ම GPUs ලැබෙනවා, ඕනේ වෙලාවට scale up/down, managed services (SageMaker AI, EKS). අභියෝග: GPUs දිගටම run කරනවා නම් වියදම ගොඩක් වැඩි වෙනවා, ලොකු GPUs වලට capacity (quota, availability) ප්‍රශ්න, data egress ගාස්තු, data රටෙන් එළියට යන එක ගැන regulator ප්‍රශ්න, vendor lock-in.',
        'Hybrid = දෙකම. උදා: sensitive data සහ steady inference on-prem, හදිසි training bursts හෝ experiments cloud එකේ ("cloud bursting"). තව එකක්: dev/test cloud එකේ, production on-prem. Hybrid වලට එකම container images, Kubernetes, NVIDIA AI Enterprise වගේ software stack එකක් දෙපැත්තේම තියෙන එක ගොඩක් උදව් වෙනවා.',
        'Cost තීරණය කරන ප්‍රධානම දේ utilization. On-prem මුළු වියදම (TCO) = hardware + facility + power + staff + support, අවුරුදු 3-5කට. Cloud වියදම = පැයකට ගාස්තුව × පාවිච්චි කරන පැය. GPUs දවසේ ගොඩක් වෙලාවක්, අවුරුදු ගණනක් busy නම් on-prem ලාභ වෙන්න පුළුවන්. පාවිච්චිය spiky නම්, පොඩි නම්, නැත්නම් තාම experiment කරනවා නම් cloud හොඳයි. Cloud එකේ reserved/savings plans, spot instances වලින් ගාස්තුව අඩු කරන්නත් පුළුවන්.',
      ],
      analogy:
        'On-prem කියන්නේ car එකක් ගන්න එක වගේ. මුලින් ලොකු සල්ලියක් යනවා, insurance, service, garage එක ඔයාගේ වගකීම. ඒත් දවස ගාණේ දුර ගමන් යනවා නම් අන්තිමට ලාභයි. Cloud කියන්නේ PickMe/Uber වගේ. මුල් වියදමක් නෑ, ඕනේ වෙලාවට එනවා. ඒත් දවස ගාණේ උදේ හවස Kandy ගියොත් මාසෙන් car එකක වාරිකයකට වඩා යනවා. Hybrid කියන්නේ ගෙදර car එකක් තියාගෙන, ලොකු trip එකකට van එකක් කුලියට ගන්න එක.',
      example:
        'කල්පිත ගණන් (උදාහරණයක් විතරයි): GPU server එකක on-prem TCO අවුරුදු 3කට Rs. 300 million කියමු. ඒ හා සමාන cloud instance එක on-demand විදිහට මාසයකට Rs. 20 million කියමු. 24/7 run කරනවා නම් මාස 15න් on-prem වියදම cloud වියදමට සමාන වෙනවා, ඊට පස්සේ on-prem ලාභයි. ඒත් GPU එක දවසට පැය 6ක් විතරක් ඕනේ නම් cloud වියදම මාසයකට Rs. 5 million පමණයි, අවුරුදු 3ට Rs. 180 million. එතකොට cloud ලාභයි. ඇත්ත තීරණයේදී ඔයාගේ ඇත්ත quotes, discounts, staff වියදම දාලා මේ ගණනම කරන්න.',
      keyPoints: [
        'On-prem: control, data residency, ඉහළ utilization වලදී ලාභයි. CapEx, lead time, facility, staff අභියෝග.',
        'Cloud: වේගය, elasticity, අලුත්ම GPUs, managed services. දිගු කාලීන 24/7 වියදම, capacity, egress, lock-in.',
        'Hybrid: sensitive/steady on-prem, bursts cloud. එකම software stack එක වැදගත්.',
        'තීරණය කරන ප්‍රධාන variable එක = utilization (GPU busy වෙන පැය).',
      ],
      terms: [
        { en: 'CapEx vs OpEx', si: 'CapEx = මුලින්ම asset එකක් මිලට ගන්න ලොකු වියදම. OpEx = පාවිච්චිය අනුව මාසිකව යන වියදම.' },
        { en: 'TCO', si: 'Total Cost of Ownership. Hardware, power, cooling, staff, support ඇතුළු මුළු වියදම.' },
        { en: 'Data Residency', si: 'Data එක කුමන රටේ/තැනේ තියෙන්න ඕනේද කියන නීතිමය හෝ ආයතනික අවශ්‍යතාව.' },
        { en: 'Cloud Bursting', si: 'On-prem capacity එක මදි වුණාම අමතර වැඩ තාවකාලිකව cloud එකට යවන එක.' },
        { en: 'Egress Cost', si: 'Cloud එකෙන් data එළියට ගන්න අය කරන ගාස්තුව.' },
        { en: 'Spot / Reserved Instances', si: 'Spot = ඕනෑම වෙලාවක ආපහු ගන්න පුළුවන් ලාභ capacity. Reserved/Savings Plans = දිගු කාලීන commitment එකකට discount.' },
      ],
    },
    {
      id: 'ai-networking',
      title: 'Networking for AI: InfiniBand, Ethernet/RoCE, NVLink, RDMA, GPUDirect, Spectrum-X',
      body: [
        'Phase 9 එකේ NVLink, NVSwitch, InfiniBand, GPUDirect RDMA, NCCL මූලිකව බැලුවා. මෙතන අපි ඒවා data center architect කෙනෙක්ගේ ඇහින් බලනවා. මතක තියාගන්න layers තුනක් තියෙනවා: (1) GPU ↔ GPU එකම node එක ඇතුළේ: NVLink/NVSwitch (scale up, ඉතාම වේගවත්). (2) Node ↔ node: compute fabric එක, InfiniBand හෝ Ethernet (scale out). (3) Users/storage/management වලට වෙනම networks.',
        'RDMA (Remote Direct Memory Access) කියන්නේ එක server එකක memory එකේ ඉඳන් තව server එකක memory එකට කෙලින්ම data ලියන එක, OS kernel එක හරහා නොගිහින්, CPU එකට වැඩ නොදී. ඒකෙන් latency අඩුයි, CPU නිදහස්. GPUDirect RDMA = ඒ වැඩේම GPU memory එකේ ඉඳන් NIC එකට කෙලින්ම. Distributed training වල NCCL all-reduce traffic එක යන්නේ මේ පාරෙන්.',
        'InfiniBand: මුල ඉඳන්ම HPC/AI වලට හදපු network එක. Lossless, credit-based flow control, ඉතා අඩු latency, RDMA native. NVIDIA Quantum InfiniBand switches වල SHARP කියන in-network computing feature එකක් තියෙනවා: all-reduce වගේ reductions වල කොටසක් switch එකේම කරනවා, ඒ නිසා network එකේ යන data අඩු වෙනවා. Ethernet + RoCE: RoCE (RDMA over Converged Ethernet) v2 කියන්නේ RDMA, UDP/IP උඩින් Ethernet එකේ යවන එක. Data centers වල දැනටමත් Ethernet skills සහ tools තියෙන නිසා ජනප්‍රියයි. ඒත් RDMA packet drops වලට සංවේදී නිසා congestion control (ECN, PFC වගේ) හරියට configure කරන්න ඕනේ.',
        'Spectrum-X කියන්නේ NVIDIA ගේ AI වලට හදපු Ethernet platform එක: Spectrum-4 switches + BlueField-3 SuperNICs, adaptive routing සහ congestion control එක්ක. සාමාන්‍ය Ethernet AI traffic (ලොකු, එකවර එන flows) වලදී congestion වලින් හෙමින් වෙන එක අඩු කරන්න හදපු එකක්. Design tips: AI compute fabric එක සාමාන්‍යයෙන් non-blocking (full bisection bandwidth) fat-tree/leaf-spine විදිහට හදනවා. "Rail-optimized" design එකේ හැම node එකකම GPU 1 එකම leaf switch එකට, GPU 2 තව leaf එකකට වගේ connect කරනවා. සාමාන්‍යයෙන් එක GPU එකකට එක high-speed NIC එකක් (උදා: 400 Gb/s).',
      ],
      analogy:
        'NVLink කියන්නේ එකම ගෙදර කාමර අතර දොරවල්. Compute fabric එක කියන්නේ ගම් අතර expressway එක. InfiniBand කියන්නේ toll එකක්වත් traffic light එකක්වත් නැති, lorry එකක් එන්න කලින් ඉඩ තියෙනවද කියලා කලින්ම confirm කරන (credit-based) විශේෂ expressway එකක්. RoCE කියන්නේ සාමාන්‍ය highway එකම, ඒත් traffic police (congestion control) හොඳට හිටියොත් expressway වගේම වැඩ කරනවා. RDMA කියන්නේ post office එක (OS/CPU) හරහා නොගිහින් ගෙදර ඉඳන් ගෙදරට කෙලින්ම parcel දෙන courier කෙනෙක්.',
      example:
        'Nodes 16ක (GPUs 128) training cluster එකක්. Option A: InfiniBand fabric. Team එකට InfiniBand අත්දැකීම් අඩුයි, ඒත් performance tune කරන්න අඩු වැඩයි. Option B: 400GbE RoCE fabric එකක් Spectrum-X එක්ක. Bank එකේ network team එකට Ethernet හොඳට පුළුවන්, monitoring tools දැනටමත් තියෙනවා. දෙකම හරි, ඒත් RoCE තෝරනවා නම් lossless/congestion settings හරියට කරන්නම ඕනේ. කොහොම තෝරත් compute fabric එක users ලගේ office network එකෙන් වෙන් කරනවා. Job එක slow නම් NCCL tests (all-reduce bandwidth) run කරලා fabric එක check කරනවා.',
      keyPoints: [
        'Layers: NVLink/NVSwitch (node ඇතුළේ) → compute fabric (nodes අතර) → storage/management networks.',
        'RDMA = CPU/OS bypass memory-to-memory. GPUDirect RDMA = GPU memory ↔ NIC කෙලින්ම.',
        'InfiniBand = lossless, native RDMA, SHARP in-network reductions.',
        'RoCE v2 = RDMA over Ethernet. Congestion control හරියට ඕනේ. Spectrum-X = NVIDIA AI Ethernet.',
        'AI fabric = non-blocking leaf-spine/fat-tree, rail-optimized, GPU එකකට NIC එකක්.',
      ],
      terms: [
        { en: 'RDMA', si: 'Remote Direct Memory Access. OS kernel/CPU නොමැතිව servers අතර memory-to-memory transfer.' },
        { en: 'RoCE v2', si: 'RDMA over Converged Ethernet. UDP/IP උඩින් යන නිසා routable.' },
        { en: 'InfiniBand', si: 'HPC/AI වලට හදපු lossless, low-latency, RDMA-native network එක. NVIDIA Quantum switches.' },
        { en: 'SHARP', si: 'InfiniBand switches ඇතුළේම all-reduce වගේ collective reductions කරන NVIDIA in-network computing තාක්ෂණය.' },
        { en: 'Spectrum-X', si: 'Spectrum-4 Ethernet switches + BlueField-3 SuperNICs එකට හදපු NVIDIA AI Ethernet platform එක.' },
        { en: 'ECN / PFC', si: 'Ethernet congestion signal කරන (ECN) සහ queue පිරෙද්දී pause කරන (PFC) ක්‍රම. RoCE lossless කරන්න පාවිච්චි කරනවා.' },
        { en: 'Leaf-Spine / Fat-Tree', si: 'ඕනෑම nodes දෙකක් අතර සමාන, ලොකු bandwidth එකක් දෙන switch topology.' },
        { en: 'Rail-Optimized Topology', si: 'හැම node එකකම එකම අංකයේ GPU/NIC එක එකම leaf switch එකට connect කරන design එක.' },
        { en: 'GPUDirect', si: 'GPU memory එකට NICs, storage, අනිත් GPUs කෙලින්ම access කරන්න දෙන technologies පවුල (RDMA, Storage, P2P).' },
      ],
    },
    {
      id: 'ai-storage',
      title: 'Storage for AI: Parallel File Systems, GPUDirect Storage, Checkpoint I/O',
      body: [
        'GPUs වලට කන්න data ඕනේ. Storage එක හෙමින් නම් ලක්ෂ ගණනක් වටින GPUs බලාගෙන ඉන්නවා. AI storage එකේ වැඩ තුනක් තියෙනවා: (1) Training data කියවන එක (images ලක්ෂ ගණනක්, text terabytes). (2) Checkpoints ලියන එක සහ කියවන එක. (3) Models, datasets දිගු කාලීනව තියාගන්න එක.',
        'Parallel file system: data එක storage servers ගොඩකට කෑලි වලට බෙදලා (striping) තියනවා. ඒ නිසා compute nodes සිය ගණනකට එකවර, එකම file system එකෙන් ඉහළ throughput එකකින් කියවන්න ලියන්න පුළුවන්. උදා: Lustre, IBM Storage Scale (GPFS), WEKA, DDN වගේ solutions. සාමාන්‍ය NFS server එකක් එක server එකකින් serve කරන නිසා nodes ගොඩක් එකවර ආවාම bottleneck එකක් වෙනවා. ගොඩක් clusters වල storage tiers තියෙනවා: compute node එකේම local NVMe (cache/scratch), ඉක්මන් parallel file system (hot data), ලාභ object storage (S3 වගේ, cold data/archive).',
        'GPUDirect Storage (GDS): සාමාන්‍යයෙන් storage එකෙන් data එන්නේ CPU memory එකට (bounce buffer), ඊට පස්සේ GPU එකට copy වෙනවා. GDS වලින් NVMe හෝ NVMe-oF/parallel file system එකේ ඉඳන් GPU memory එකට කෙලින්ම DMA path එකක් හදනවා. CPU එකට වැඩ අඩුයි, bandwidth වැඩියි, latency අඩුයි. Applications පාවිච්චි කරන්නේ cuFile API එක (කෙලින්ම හෝ libraries හරහා).',
        'Checkpoint I/O: ලොකු training jobs නිතරම checkpoint (model + optimizer state එකේ snapshot එකක්) ලියනවා, node එකක් කැඩුණොත් මුල ඉඳන් නොවී එතන ඉඳන් පටන් ගන්න. ලොකු model එකක checkpoint එක ලොකුයි (optimizer states නිසා weights වලට වඩා කිහිප ගුණයක්). GPUs ඔක්කොම එකවර ලියන නිසා storage එකට හදිසි write burst එකක් එනවා, ඒ වෙලාවේ GPUs බලාගෙන ඉන්නවා. විසඳුම්: write bandwidth වැඩි storage, asynchronous checkpointing (මුලින් local NVMe/CPU memory එකට, ඊට පස්සේ background එකේ shared storage එකට), checkpoint frequency එක හරියට තෝරන එක.',
      ],
      analogy:
        'Storage එක කියන්නේ කඩේ ගබඩාව. සාමාන්‍ය NFS කියන්නේ එක දොරක් තියෙන ගබඩාවක්, කෝකියෝ 100ක් එකවර ආවොත් දොර ළඟ පෝලිමක්. Parallel file system කියන්නේ දොරවල් 50ක් තියෙන ගබඩාවක්, බඩු racks ගොඩකට බෙදලා. GPUDirect Storage කියන්නේ ගබඩාවේ ඉඳන් තාච්චියටම conveyor එකක්, මැද තියෙන මේසෙ (CPU memory) උඩ තියන්නේ නෑ. Checkpoint කියන්නේ දිගු exam paper එකක් ලියද්දී පැයෙන් පැයට photocopy එකක් ගන්න එක, විදුලිය ගියත් ඉවර කරපු කොටස නැති වෙන්නේ නෑ.',
      example:
        '8B model එකක full fine-tune checkpoint එකක් (bytes 16ක් පමණ per parameter): 8 × 16 = 128 GB පමණ. Storage එකට ලියන්න පුළුවන් 2 GB/s විතරක් නම් checkpoint එකට විනාඩි 1කට වඩා (128 ÷ 2 = තත්පර 64) GPUs ඔක්කොම නවතිනවා. පැය භාගෙන් පැය භාගෙට checkpoint කරනවා නම් හැම පැය භාගයකම විනාඩියක් නාස්තියි. 20 GB/s parallel file system එකකට නම් තත්පර 6.4යි. Async checkpointing එකෙන් GPUs නවතින කාලය තවත් අඩු කරන්න පුළුවන්.',
      keyPoints: [
        'AI storage වැඩ: training data read, checkpoint write/read, දිගු කාලීන storage.',
        'Parallel file system = data striping, nodes ගොඩකට එකවර ඉහළ throughput.',
        'Tiers: local NVMe → parallel FS → object storage.',
        'GDS = storage ↔ GPU memory direct DMA, CPU bounce buffer නැතුව (cuFile).',
        'Checkpoint = write burst. Bandwidth, async checkpointing, frequency.',
      ],
      terms: [
        { en: 'Parallel File System', si: 'Data storage servers ගොඩකට stripe කරලා clients ගොඩකට එකවර ඉහළ throughput දෙන file system එක (Lustre, GPFS).' },
        { en: 'GPUDirect Storage (GDS)', si: 'Storage සහ GPU memory අතර CPU bounce buffer නැතුව direct data path එක.' },
        { en: 'cuFile', si: 'GDS පාවිච්චි කරන්න තියෙන CUDA API එක.' },
        { en: 'Checkpoint', si: 'Training එක අතරමැද model සහ optimizer state එකේ saved snapshot එක.' },
        { en: 'NVMe / NVMe-oF', si: 'NVMe = ඉක්මන් SSD protocol එක. NVMe-oF = ඒ NVMe network එක හරහා.' },
        { en: 'Object Storage', si: 'S3 වගේ, ලාභ, ඉතා ලොකු, HTTP API එකකින් access කරන storage එක. Archive/data lake වලට.' },
      ],
    },
    {
      id: 'bluefield-dpu',
      title: 'BlueField DPUs: What They Offload and Why',
      body: [
        'Data center එකක server CPU එකේ වැඩ වලින් හොඳ කොටසක් යන්නේ application එකට නෙවෙයි, infrastructure වැඩ වලට: virtual networking (overlay networks, virtual switches), storage protocols, encryption, firewalls, telemetry. මේ වැඩ CPU cores ගොඩක් කනවා. ඒ cores AI pipeline එකට (data loading වගේ) පාවිච්චි කරන්න තිබුණා.',
        'DPU (Data Processing Unit) කියන්නේ network card එකක් වගේ PCIe slot එකකට දාන, ඒත් ඇතුළේම තමන්ගේ Arm CPU cores, high-speed network interface (ConnectX), සහ networking, storage, security accelerators තියෙන chip එකක්. NVIDIA ගේ DPU පවුල BlueField (උදා: BlueField-3). ඒක කුඩා computer එකක් වගේ server එක ඇතුළේ තියෙනවා. ඒ මත software ලියන්නේ NVIDIA DOCA SDK එකෙන්.',
        'BlueField එක offload කරන දේවල්: Networking = virtual switching (OVS), overlay networks, RoCE/RDMA, congestion control. Storage = NVMe-oF, storage virtualization (remote storage එක local disk එකක් වගේ පෙන්වන එක), compression/encryption. Security = firewall, encryption (IPsec/TLS), micro-segmentation, isolation.',
        'Data centers DPU පාවිච්චි කරන්නේ ඇයි? (1) CPU cores නිදහස් වෙනවා applications වලට. (2) Security isolation: infrastructure control එක host OS එකෙන් වෙනම DPU එකේ run වෙන නිසා, host එකේ tenant කෙනෙක් hack වුණත් network policies වෙනස් කරන්න බෑ. Zero-trust, multi-tenant cloud වලට ගොඩක් වැදගත්. (3) Performance: hardware accelerators නිසා line rate එකේ වැඩ කරනවා. DGX H100 වගේ systems වල BlueField-3 DPUs තියෙනවා. Spectrum-X එකේ BlueField-3 SuperNIC එකත් මේ පවුලේම, ඒත් ඒක ප්‍රධාන වශයෙන් GPU-to-GPU AI network traffic එකට optimize කරලා.',
      ],
      analogy:
        'Server CPU එක කියන්නේ bank manager කෙනෙක් වගේ. Manager ලොකු loans ගැන තීරණ ගන්න ඕනේ (application). ඒත් එයා දවස පුරා cheque stamp කරනවා, security check කරනවා, mail බෙදනවා නම් වැඩේ නරකයි. DPU කියන්නේ manager ට වෙනම back office team එකක් දුන්නා වගේ. ඒ team එක mail, stamps, security ඔක්කොම බලාගන්නවා. තවත් වාසියක්: back office එකේ security rules manager ගේ කාමරෙන් වෙනස් කරන්න බෑ.',
      example:
        'Telco එකක් තමන්ගේ private cloud එකේ GPU servers business units කිහිපයකට share කරනවා. හැම tenant කෙනෙක්ටම වෙනම virtual network (overlay), encryption, firewall rules ඕනේ. මේක host CPU එකේ software වලින් කළාම cores ගොඩක් යනවා, tenant කෙනෙක්ට host එක root කරන්න පුළුවන් වුණොත් rules වෙනස් කරන්නත් පුළුවන්. BlueField DPUs දැම්මාම OVS, encryption, firewall DPU එකේ run වෙනවා. Host CPU cores data preprocessing වලට නිදහස්. Network policy එක host එකෙන් isolated.',
      keyPoints: [
        'DPU = Arm cores + ConnectX NIC + accelerators තියෙන programmable chip එකක්. NVIDIA = BlueField, SDK = DOCA.',
        'Offload: networking (OVS, overlays, RDMA), storage (NVMe-oF, encryption), security (firewall, IPsec/TLS).',
        'වාසි: CPU cores නිදහස්, infrastructure/tenant isolation (zero trust), line-rate performance.',
        'CPU = applications, GPU = accelerated compute, DPU = data center infrastructure.',
      ],
      terms: [
        { en: 'DPU', si: 'Data Processing Unit. Networking, storage, security infrastructure වැඩ host CPU එකෙන් offload කරන programmable processor එක.' },
        { en: 'BlueField', si: 'NVIDIA ගේ DPU / SuperNIC product පවුල (උදා: BlueField-3).' },
        { en: 'DOCA', si: 'BlueField මත applications සහ services හදන්න NVIDIA SDK එක.' },
        { en: 'Offload', si: 'වැඩක් host CPU එකෙන් ඉවත් කරලා වෙනත් hardware එකකට දෙන එක.' },
        { en: 'OVS (Open vSwitch)', si: 'Virtual machines/containers අතර traffic switch කරන software virtual switch එක.' },
        { en: 'Zero Trust', si: 'Network එක ඇතුළේ කවුරුවත් ස්වයංක්‍රීයව විශ්වාස නොකර, හැම access එකක්ම verify කරන security model එක.' },
      ],
    },
    {
      id: 'ai-software-lifecycle',
      title: 'NVIDIA Software at Each Stage of the AI Lifecycle',
      body: [
        'Phase 9 එකේ CUDA, NGC, NVIDIA AI Enterprise, TensorRT, Triton, NIM එකින් එක ගැඹුරින් බැලුවා. මෙතන අපි ඒවා AI lifecycle එකේ කොතනද වැටෙන්නේ කියලා map එකක් හදනවා. NCA-AIIO exam එකේ ප්‍රශ්න ගොඩක් එන්නේ "මේ stage එකට ගැළපෙන tool එක මොකක්ද" කියලා.',
        'පදනම (හැම stage එකකටම): GPU driver සහ CUDA (programming platform), CUDA-X libraries (cuDNN = deep learning primitives, cuBLAS = matrix math, NCCL = multi-GPU communication). Containers ලබාගන්න තැන NGC (NVIDIA GPU Cloud catalog): optimized containers (PyTorch, TensorFlow, Triton), pretrained models, Helm charts. NVIDIA AI Enterprise = production වලට support, security patches, stable versions එක්ක දෙන enterprise software suite එක (licensed). NIM සහ NeMo වගේ දේවල් production වලට ගන්නේ මේක හරහා.',
        'Stages: (1) Data preparation: RAPIDS (cuDF, cuML), Spark RAPIDS accelerator, DALI (data loading/augmentation GPU එකේ). LLM data වලට NeMo Curator. (2) Training/fine-tuning: PyTorch/TensorFlow NGC containers, NeMo framework (LLMs, speech), Megatron-LM (ලොකු models), TAO Toolkit (vision transfer learning). (3) Optimization: TensorRT (models optimized inference engines බවට), TensorRT-LLM (LLMs), quantization. (4) Deployment/serving: Triton Inference Server (ඕනෑම framework එකක models serve කරන server එක), NIM (pre-optimized model + engine + API එක්ක ready container එක). (5) Operations: GPU Operator, DCGM, Base Command Manager (cluster management), Run:ai (GPU scheduling/orchestration).',
        'Architect කෙනෙක්ගේ තේරීම: "ලොකුම control එක ඕනේ, custom models" = TensorRT + Triton. "ඉක්මනින්, standard LLM එකක් OpenAI-compatible API එකකින්" = NIM. "Supported, enterprise production" = NVIDIA AI Enterprise හරහා. NIM ඇතුළේත් TensorRT-LLM වගේ optimized engines තියෙනවා, ඒ නිසා මේවා තරග කරන tools නෙවෙයි, එකිනෙක උඩ තට්ටු.',
      ],
      analogy:
        'AI lifecycle එක කියන්නේ තේ කර්මාන්තය වගේ. Data prep = දළු නෙළන එක සහ තෝරන එක (RAPIDS, DALI). Training = factory එකේ වියළලා, රෝල් කරලා, fermentation (NeMo, PyTorch). Optimization = grading සහ packaging (TensorRT). Deployment = තේ auction එකට සහ කඩවලට යවන එක (Triton, NIM). NGC කියන්නේ ලොකු ගබඩාව, NVIDIA AI Enterprise කියන්නේ Tea Board certification එක සහ warranty එක වගේ. CUDA කියන්නේ factory එකේ විදුලිය.',
      example:
        'Bank එකක cheque fraud detection project එකක්: Data prep = ගනුදෙනු CSV ලක්ෂ ගණන් cuDF වලින් clean කරනවා. Training = XGBoost GPU (RAPIDS) + cheque images වලට PyTorch NGC container එකේ CNN එකක්. Optimization = CNN එක TensorRT engine එකකට (FP16). Deployment = Triton එකක XGBoost (FIL backend) සහ TensorRT models දෙකම serve කරනවා. පස්සේ customer chatbot එකට Llama NIM එකක්. ඔක්කොම Kubernetes එකේ GPU Operator එක්ක, DCGM වලින් monitor කරනවා.',
      keyPoints: [
        'පදනම: driver + CUDA + CUDA-X (cuDNN, cuBLAS, NCCL). Containers/models: NGC. Enterprise support: NVIDIA AI Enterprise.',
        'Data: RAPIDS, DALI, NeMo Curator. Train: PyTorch, NeMo, Megatron-LM, TAO.',
        'Optimize: TensorRT, TensorRT-LLM. Serve: Triton, NIM.',
        'Operate: GPU Operator, DCGM, Base Command Manager, Run:ai.',
      ],
      terms: [
        { en: 'NGC', si: 'NVIDIA ගේ GPU-optimized containers, pretrained models, Helm charts තියෙන catalog එක.' },
        { en: 'NVIDIA AI Enterprise', si: 'Production AI වලට support, security updates, certified versions එක්ක දෙන licensed software suite එක.' },
        { en: 'TensorRT', si: 'Trained model එකක් optimized inference engine එකක් කරන SDK එක (layer fusion, precision).' },
        { en: 'Triton Inference Server', si: 'ONNX, TensorRT, PyTorch, Python වගේ backends ගොඩක models එකම server එකකින් serve කරන open-source server එක.' },
        { en: 'NIM', si: 'Model + optimized engine + standard API එක්ක pre-built inference microservice container එක.' },
        { en: 'DALI', si: 'Data Loading Library. Image/video decoding සහ augmentation GPU එකේ කරනවා.' },
        { en: 'TAO Toolkit', si: 'Vision models transfer learning වලින් අඩු code එකකින් customize කරන NVIDIA tool එක.' },
        { en: 'Base Command Manager', si: 'GPU clusters provision කරන්න, manage කරන්න NVIDIA cluster management software එක (කලින් Bright Cluster Manager).' },
      ],
    },
    {
      id: 'datacenter-management-monitoring',
      title: 'Managing and Monitoring an AI Data Center (nvidia-smi, DCGM Metrics)',
      body: [
        'AI data center එකක් manage කරන එකේ කොටස් තුනක් තියෙනවා. (1) Provisioning: අලුත් node එකකට OS, GPU driver, CUDA, container runtime, NVIDIA Container Toolkit, scheduler agent install කරන එක. Nodes සිය ගණනක් නම් මේක අතින් කරන්න බෑ, Base Command Manager, Ansible, හෝ Kubernetes වල GPU Operator වගේ tools පාවිච්චි කරනවා. හැම node එකකම එකම driver/firmware versions තියාගන්න එක වැදගත්. (2) Monitoring: GPUs, network, storage, power, temperature. (3) Maintenance: firmware/driver updates, නරක nodes අයින් කරන එක (drain), hardware RMA.',
        'nvidia-smi = node එකක් ඇතුළේ ඉක්මන් බැල්මක්: GPU utilization, memory used, temperature, power draw, ECC errors, ඒ GPU එක පාවිච්චි කරන processes. Phase 9 එකේ ඒකේ උගුල් බැලුවා. DCGM (Data Center GPU Manager) = cluster පුරා GPUs monitor, health check, diagnose කරන්න. DCGM Exporter එක metrics Prometheus වලට යවනවා, Grafana dashboards වල බලනවා, Alertmanager වලින් alerts.',
        'වැදගත් DCGM metrics: GPU utilization (DCGM_FI_DEV_GPU_UTIL), framebuffer memory used (DCGM_FI_DEV_FB_USED), power usage (DCGM_FI_DEV_POWER_USAGE), GPU temperature (DCGM_FI_DEV_GPU_TEMP), SM activity (DCGM_FI_PROF_SM_ACTIVE), Tensor Core activity (DCGM_FI_PROF_PIPE_TENSOR_ACTIVE), XID errors (DCGM_FI_DEV_XID_ERRORS), ECC errors, NVLink/PCIe throughput, clock throttle reasons. SM activity සහ Tensor activity තමයි GPU එක ඇත්තටම කොච්චර වැඩ කරනවද කියලා GPU_UTIL එකට වඩා හොඳට පෙන්නන්නේ.',
        'Health සහ diagnostics: dcgmi diag වලින් levels කිහිපයක diagnostic tests (ඉක්මන් check එකේ ඉඳන් දිගු stress test එකක් දක්වා). XID errors කියන්නේ driver එක log කරන GPU error codes. Uncorrectable ECC errors, XID errors, thermal throttling වගේ දේවල් ආවොත් node එක scheduler එකෙන් drain කරලා, diagnose කරලා, අවශ්‍ය නම් repair/replace. Monitoring එකට GPU metrics විතරක් නෙවෙයි, InfiniBand/Ethernet port errors, storage latency, rack power, inlet temperature, job-level metrics (job එකට GPU-hours කීයක් ගියාද) ත් එකතු කරන්න.',
      ],
      analogy:
        'nvidia-smi කියන්නේ doctor කෙනෙක් stethoscope එකෙන් එක patient කෙනෙක්ව ඉක්මනින් check කරන එක. DCGM කියන්නේ ICU එකේ හැම ඇඳකම monitors ටික central nursing station එකට connect කරලා, heart rate අසාමාන්‍ය වුණාම alarm එකක් ගහන system එක. dcgmi diag කියන්නේ full medical checkup එක.',
      example:
        'Grafana dashboard එකේ training job එකක GPUs 64න් එකක GPU_TEMP එක අනිත් ඒවාට වඩා ගොඩක් වැඩියි, clock throttle reasons එකේ thermal throttling පේනවා. ඒ එක GPU එක slow නිසා synchronized training එකේ අනිත් 63ත් ඒක එනකම් බලාගෙන ඉන්නවා. විසඳුම: node එක drain කරනවා, job එක checkpoint එකෙන් වෙනත් node එකක restart කරනවා, ඒ node එකේ fans/cooling check කරලා dcgmi diag run කරනවා.',
      code: {
        lang: 'bash',
        src: `# GPU එක ඉක්මනින් බලන්න (memory, util, temp, power, processes)
nvidia-smi
# තත්පර 5න් 5ට CSV එකක් විදිහට ප්‍රධාන metrics
nvidia-smi --query-gpu=index,utilization.gpu,memory.used,temperature.gpu,power.draw --format=csv -l 5
# DCGM එකට පේන GPUs list එක
dcgmi discovery -l
# Diagnostic tests (1 = ඉක්මන්, 3 = දිගු)
dcgmi diag -r 1`,
      },
      keyPoints: [
        'Management = provisioning + monitoring + maintenance. හැම node එකකම එකම versions.',
        'nvidia-smi = එක node එකක ඉක්මන් snapshot. DCGM = fleet monitoring, health, diagnostics.',
        'වැදගත් metrics: util, FB used, power, temp, SM active, Tensor active, XID, ECC, NVLink.',
        'දෝෂ ආවොත්: drain → dcgmi diag → repair. එක slow GPU එකක් මුළු job එකම slow කරනවා.',
      ],
      terms: [
        { en: 'DCGM Exporter', si: 'DCGM metrics Prometheus format එකෙන් expose කරන component එක.' },
        { en: 'XID Error', si: 'NVIDIA driver එක log කරන GPU error code එක. Hardware/driver/application ප්‍රශ්න පෙන්නනවා.' },
        { en: 'ECC Error', si: 'Memory bit errors. Correctable ඒවා hardware එකම හදනවා. Uncorrectable ඒවා බරපතලයි.' },
        { en: 'Thermal Throttling', si: 'GPU එක රත් වැඩි වුණාම තමන්ම clock speed එක අඩු කරන එක.' },
        { en: 'dcgmi diag', si: 'DCGM diagnostic tests run කරන command එක, levels කිහිපයක්.' },
        { en: 'Drain / Cordon', si: 'Node එකකට අලුත් jobs යවන එක නවත්තලා, තියෙන ඒවා ඉවර වෙන්න හෝ ඉවත් කරන්න දෙන එක.' },
      ],
    },
    {
      id: 'kubernetes-vs-slurm',
      title: 'Cluster Orchestration and Job Scheduling: Kubernetes vs Slurm',
      body: [
        'GPUs සිය ගණනක් තියෙන cluster එකක් users ගොඩක් share කරනවා. කවුද මොන GPUs, කොච්චර වෙලාවට ගන්නේ කියලා තීරණය කරන්නේ scheduler/orchestrator එක. AI ලෝකයේ ප්‍රධාන දෙක Slurm සහ Kubernetes.',
        'Slurm: HPC ලෝකයෙන් ආපු batch job scheduler එක. User කෙනෙක් script එකක් sbatch වලින් submit කරනවා: "මට nodes 4ක්, GPUs 32ක්, පැය 48ක්". Job එක queue එකේ ඉඳලා resources ලැබුණාම run වෙනවා, ඉවර වුණාම නවතිනවා. Partitions (queues), priorities, fair-share (එක team එකක් ඔක්කොම නොගන්න), backfill, gang scheduling (nodes ඔක්කොම එකවර ලැබුණොත් විතරක් පටන් ගන්න) හොඳට තියෙනවා. GPUs ඉල්ලන්නේ GRES (--gres=gpu:8 වගේ) වලින්. Containers run කරන්න NVIDIA Pyxis/Enroot plugin පාවිච්චි කරනවා. ලොකු multi-node training වලට ගොඩක් ජනප්‍රියයි.',
        'Kubernetes: Containers සහ microservices run කරන්න හදපු orchestrator එක. දිගටම run වෙන services (inference APIs), autoscaling, rolling updates, self-healing, load balancing වලට හොඳම. GPUs ලැබෙන්නේ NVIDIA device plugin/GPU Operator හරහා (Phase 9). Default Kubernetes scheduler එක batch/gang scheduling වලට දුර්වලයි, ඒ නිසා multi-node training වලට Kubeflow Training Operator, Volcano, Kueue, හෝ NVIDIA Run:ai වගේ දේවල් එකතු කරනවා.',
        'තේරීම: Slurm = ලොකු, දිගු, multi-node training/HPC batch jobs, researchers ලා shell එකෙන් වැඩ කරන තැන. Kubernetes = inference services, MLOps pipelines, microservices, cloud-native teams (EKS වගේ). ගොඩක් ආයතන දෙකම පාවිච්චි කරනවා: training cluster එක Slurm, inference/serving Kubernetes. Slurm-on-Kubernetes වගේ hybrid විසඳුම් ත් තියෙනවා.',
      ],
      analogy:
        'Slurm කියන්නේ hospital එකක operation theatre booking system එක වගේ. Surgeon කෙනෙක් "මට theatre 1ක්, nurses 4ක්, පැය 6ක්" කියලා book කරනවා. ඔක්කොම ලැබුණාම operation එක පටන් ගන්නවා, ඉවර වුණාම නිදහස් කරනවා. Kubernetes කියන්නේ OPD එක වගේ. දවස පුරා open, patients වැඩි වුණාම doctors (pods) වැඩි කරනවා, doctor කෙනෙක් ලෙඩ වුණොත් වෙන කෙනෙක් ඒ ඉඩට එනවා.',
      example:
        'Bank එකේ AI team එක: Data scientists ලා 8B model එකක් සතියකට සැරයක් fine-tune කරනවා, nodes 2ක් පැය 10ක්. ඒකට Slurm job එකක් (sbatch, --nodes=2 --gres=gpu:8). Fine-tune කරපු model එක chatbot එකට serve කරන්නේ EKS/Kubernetes එකේ Deployment එකක් විදිහට, replicas 2ක්, HPA එකෙන් requests වැඩි වුණාම replicas 4ට. Slurm ත් Kubernetes ත් දෙකම එකම storage එකට access තියෙනවා.',
      code: {
        lang: 'bash',
        src: `#!/bin/bash
# Slurm job එකක්: nodes 2ක්, හැම node එකකම GPUs 8 බැගින්, උපරිම පැය 10
#SBATCH --job-name=bank-llm-finetune
#SBATCH --nodes=2
#SBATCH --gres=gpu:8
#SBATCH --time=10:00:00
#SBATCH --partition=training
srun python train.py --config finetune.yaml`,
      },
      keyPoints: [
        'Slurm = batch jobs, queues, fair-share, gang scheduling. Multi-node training/HPC.',
        'Kubernetes = containers, services, autoscaling, self-healing. Inference/MLOps.',
        'K8s GPU = device plugin/GPU Operator. Batch වලට Kueue/Volcano/Kubeflow/Run:ai.',
        'ගොඩක් තැන් දෙකම: training Slurm, serving Kubernetes.',
      ],
      terms: [
        { en: 'Slurm', si: 'HPC/AI clusters වල batch jobs queue කරලා resources බෙදන open-source workload manager එක.' },
        { en: 'sbatch / srun / squeue', si: 'sbatch = job script submit කරන්න. srun = job එක ඇතුළේ tasks run කරන්න. squeue = queue එක බලන්න.' },
        { en: 'GRES', si: 'Generic RESources. Slurm වල GPUs වගේ විශේෂ resources ඉල්ලන ක්‍රමය.' },
        { en: 'Fair-share', si: 'Users/teams අතීතයේ පාවිච්චි කරපු ප්‍රමාණය අනුව priority වෙනස් කරලා සාධාරණව බෙදන ක්‍රමය.' },
        { en: 'Gang Scheduling', si: 'Job එකකට ඕනේ resources ඔක්කොම එකවර ලැබුණොත් විතරක් පටන් ගන්න scheduling ක්‍රමය.' },
        { en: 'Pyxis / Enroot', si: 'Slurm jobs වලට containers run කරන්න NVIDIA tools.' },
        { en: 'Run:ai', si: 'Kubernetes මත GPU scheduling, quotas, sharing කරන NVIDIA platform එක.' },
      ],
    },
    {
      id: 'gpu-virtualization',
      title: 'GPU Virtualization and Sharing: vGPU vs MIG vs Time-Slicing',
      body: [
        'ගොඩක් workloads වලට සම්පූර්ණ GPU එකක් ඕනේ නෑ. පොඩි inference model එකක්, data scientist කෙනෙක්ගේ notebook එකක් GPU එකෙන් පොඩි කොටසක් විතරක් පාවිච්චි කරනවා. GPU එක share කරන්න ක්‍රම තුනක් තියෙනවා. Phase 9 එකේ MIG සහ time-slicing Kubernetes පැත්තෙන් බැලුවා. මෙතන තුනම සසඳනවා.',
        'Time-slicing: GPU එක workloads අතර කාලය අනුව මාරු කරනවා. ඕනෑම GPU එකක පුළුවන්, සරලයි. ඒත් memory isolation නෑ, fault isolation නෑ, performance guarantee නෑ. එක workload එකක් memory ඔක්කොම ගත්තොත් අනිත් අයට OOM. Dev/test, පොඩි, විශ්වාසවන්ත workloads වලට හොඳයි.',
        'MIG (Multi-Instance GPU): A100, H100 වගේ data-center GPUs hardware මට්ටමින් instances 7ක් දක්වා කඩනවා. හැම instance එකකටම තමන්ගේම SMs, memory, cache. Isolation සහ guaranteed performance තියෙනවා. ඒත් profiles fixed (1g.10gb, 3g.40gb වගේ), හැම GPU එකකම නෑ. Multi-tenant inference වලට හොඳම.',
        'vGPU (NVIDIA virtual GPU software): Hypervisor (VMware vSphere, KVM වගේ) එකක virtual machines අතර GPU එක share කරන්න. VM එකට "virtual GPU" එකක් පේනවා, ඇතුළේ සාමාන්‍ය NVIDIA driver එක. vGPU එක time-sliced විදිහට හරි MIG-backed විදිහට හරි වැඩ කරන්න පුළුවන්. VDI (virtual desktops), VMs පාවිච්චි කරන enterprise data centers වලට. NVIDIA license එකක් ඕනේ. Live migration වගේ VM features ත් සමහර තත්ත්ව වලදී support කරනවා. සාරාංශය: Containers + isolation = MIG. VMs = vGPU. සරල sharing, isolation ඕනේ නැත්නම් = time-slicing.',
      ],
      analogy:
        'GPU එක ලොකු ගෙයක් කියලා හිතන්න. Time-slicing = එකම කාමරය පැය ගාණට මාරුවෙන් කුලියට දෙනවා, කලින් කෙනා බඩු දාලා ගියොත් ඊළඟ කෙනාට ඉඩ නෑ. MIG = ගෙදර ඇතුළේ තාප්ප බැඳලා, වෙනම දොරවල්, මීටර් එක්ක annex 7කට කඩනවා. vGPU = ගෙදර apartment building එකක් කරලා management company එකක් (hypervisor) හරහා apartments කුලියට දෙනවා. ඇතුළේ තාප්ප (MIG-backed) තියෙන්නත් පුළුවන්, නැතුව කාලය අනුව (time-sliced) බෙදන්නත් පුළුවන්.',
      example:
        'Hospital group එකක: (1) Radiologists 20 දෙනෙක් VMware virtual desktops වල imaging software පාවිච්චි කරනවා → vGPU. (2) Kubernetes එකේ පොඩි inference models 7ක්, එකකට 10 GB ට අඩුවෙන්, එකිනෙකාගේ load එකෙන් බලපෑමක් වෙන්න බෑ → A100 80GB එකක් MIG 1g.10gb instances 7කට. (3) Data science interns ලගේ Jupyter notebooks, isolation අඩුවෙන් ප්‍රශ්නයක් නෑ → time-slicing.',
      keyPoints: [
        'Time-slicing: ඕනෑම GPU, සරලයි, isolation නෑ.',
        'MIG: hardware partitions 7ක් දක්වා (A100/H100 වගේ), memory + compute isolation, guaranteed QoS.',
        'vGPU: hypervisor එකේ VMs අතර share, time-sliced හෝ MIG-backed, license ඕනේ.',
        'Containers + isolation = MIG. VMs = vGPU. Dev/test = time-slicing.',
      ],
      terms: [
        { en: 'vGPU', si: 'NVIDIA virtual GPU software. Hypervisor එකක VMs කිහිපයකට එක physical GPU එකක් share කරන්න.' },
        { en: 'MIG-backed vGPU', si: 'VM එකකට MIG instance එකක් vGPU විදිහට දෙන එක. VM level isolation + hardware partition.' },
        { en: 'Hypervisor', si: 'එක physical server එකක virtual machines ගොඩක් run කරන software එක (vSphere, KVM).' },
        { en: 'GPU Passthrough', si: 'මුළු physical GPU එකම එක VM එකකට කෙලින්ම දෙන එක. Sharing නෑ.' },
        { en: 'VDI', si: 'Virtual Desktop Infrastructure. Users ලගේ desktops data center එකේ VMs විදිහට run කරන එක.' },
        { en: 'QoS', si: 'Quality of Service. Workload එකකට අවම performance එකක් සහතික කරන එක.' },
      ],
    },
    {
      id: 'ai-infra-security',
      title: 'Security for AI Workloads: Segmentation, Secrets, Least Privilege',
      body: [
        'AI cluster එකක තියෙන්නේ ගොඩක් වටිනා දේවල්: sensitive training data (customer records), model weights (මාස ගණනක training එකක ප්‍රතිඵලය), API keys/tokens, සහ ලක්ෂ ගණනක් වටින GPUs (crypto mining වලට hackers ලා ආස). ඒ නිසා security එක design එකේ මුල ඉඳන්ම තියෙන්න ඕනේ.',
        'Network segmentation: Networks වෙන් කරන්න. Compute fabric, storage network, management network, out-of-band BMC network එකිනෙකින් සහ office/internet එකෙන් වෙන් කරනවා. BMC network එක කවදාවත් internet එකට expose කරන්න එපා. Inference endpoints users ලට expose කරන්නේ API gateway/load balancer එකක් හරහා විතරයි. Kubernetes වල NetworkPolicies, cloud එකේ security groups/private subnets. Multi-tenant clusters වල BlueField DPUs වලින් tenant isolation.',
        'Secrets management: API keys, NGC keys, Hugging Face tokens, database passwords code එකේ, container image එකේ, Git එකේ hardcode කරන්න එපා. AWS Secrets Manager, HashiCorp Vault, Kubernetes Secrets (encryption at rest එක්ක) පාවිච්චි කරන්න. Keys නිතර rotate කරන්න.',
        'Least privilege: හැම user කෙනෙක්ටම, service එකකටම ඕනේ අවම access එක විතරයි. Kubernetes RBAC (namespace එකක් team එකකට), Slurm accounts/partitions, cloud IAM roles (EKS pods වලට IRSA/Pod Identity). Containers root විදිහට, privileged mode එකේ run කරන්න එපා. අනිත් දේවල්: data සහ model weights encryption (at rest සහ in transit), signed/scanned container images (NGC/NVIDIA AI Enterprise containers security scan කරලා එනවා), audit logs, driver/firmware patches. H100 වගේ GPUs confidential computing (GPU memory එකේ data use කරද්දීත් protect කරන එක) support කරනවා.',
      ],
      analogy:
        'AI cluster එක bank vault එකක් වගේ. Network segmentation = bank එකේ public counter එක, back office එක, vault එක වෙනම දොරවල් එක්ක වෙන් කරන එක. Secrets management = යතුරු ලාච්චුවක දාලා තියන්නේ නැතුව key safe එකක තියාගන්න එක, නිතර මාරු කරන එක. Least privilege = cashier ට vault යතුර දෙන්නේ නෑ, එයාට ඕනේ cash drawer යතුර විතරයි.',
      example:
        'Bank chatbot cluster එකක design එක: Inference pods private subnet එකේ, internal load balancer එකක් හරහා bank intranet එකට විතරක් expose. Model weights encrypted S3 bucket එකක, ඒක කියවන්න පුළුවන් inference service account එකට විතරයි (IAM role). Hugging Face token එක Secrets Manager එකේ. Data scientists ලට dev namespace එකට විතරක් RBAC access, production namespace එකට deploy කරන්නේ CI/CD pipeline එකට විතරයි. DCGM alerts වල අමුතු GPU usage එකක් (රෑ 2ට 100% වගේ, job එකක් නැතුව) ආවොත් security team එකට alert.',
      keyPoints: [
        'Protect කරන්න: data, model weights, credentials, GPUs.',
        'Segmentation: compute/storage/management/BMC networks වෙන්. BMC internet එකට කවදාවත් නෑ.',
        'Secrets = vault/secrets manager එකේ, hardcode නෑ, rotate කරන්න.',
        'Least privilege: RBAC, IAM roles, non-root containers, audit logs.',
      ],
      terms: [
        { en: 'Network Segmentation', si: 'Network එක වෙනම කොටස් වලට කඩලා අවශ්‍ය traffic විතරක් අතර යන්න දෙන එක.' },
        { en: 'Least Privilege', si: 'වැඩේට ඕනේ අවම permissions විතරක් දෙන මූලධර්මය.' },
        { en: 'RBAC', si: 'Role-Based Access Control. Roles වලට permissions දීලා users ලට roles දෙන එක.' },
        { en: 'Secrets Manager / Vault', si: 'Passwords, API keys ආරක්ෂිතව store කරලා, access control සහ rotation කරන services.' },
        { en: 'Encryption at Rest / in Transit', si: 'Disk එකේ තියෙද්දී සහ network එකේ යද්දී data encrypt කරන එක.' },
        { en: 'Confidential Computing', si: 'Processing කරද්දීත් (in use) data hardware-protected environment එකක ආරක්ෂා කරන තාක්ෂණය.' },
      ],
    },
    {
      id: 'aws-gpu-instances-efa',
      title: 'AWS Mapping: GPU Instance Families (G5, G6, P4d, P5) and EFA',
      body: [
        'AWS එකේ GPU instances තෝරන්න ප්‍රශ්න තුනක්: (1) GPU memory එක කීයක් ඕනේද? (2) Training ද inference ද? (3) Budget එක කීයද? G families සාමාන්‍යයෙන් inference, graphics, පොඩි training වලට. P families ලොකු training සහ ලොකු model inference වලට.',
        'G5: NVIDIA A10G GPUs (Ampere), GPU එකකට 24 GB. Instance එකකට GPU 1 ඉඳන් 8 දක්වා. පොඩි-මධ්‍යම models inference, fine-tuning, graphics වලට ලාභ, ජනප්‍රිය තේරීමක්. FP8 නෑ (Ampere). G6: NVIDIA L4 GPUs (Ada Lovelace), GPU එකකට 24 GB. Power efficient, ලාභ inference, video වලට හොඳයි. FP8 support කරනවා. G6e: L40S GPUs, 48 GB. G family එකේ ලොකු memory එකක් ඕනේ නම්.',
        'P4d: NVIDIA A100 40 GB GPUs 8ක් එක instance එකක (p4d.24xlarge), NVSwitch එක්ක, 400 Gbps EFA networking. Multi-node training සහ ලොකු inference වලට. (P4de = A100 80 GB.) P5: NVIDIA H100 80 GB GPUs 8ක් (p5.48xlarge), 3200 Gbps EFA networking. ලොකුම training, FP8, ලොකු LLM serving. මිල වැඩිම, capacity ගන්නත් අමාරු වෙන්න පුළුවන් (Capacity Blocks/reservations ගැන හිතන්න).',
        'Elastic Fabric Adapter (EFA): AWS ගේ HPC/ML network interface එක. ඒක OS-bypass ලබා දෙනවා: application එක (libfabric හරහා) kernel network stack එක නොගිහින් කෙලින්ම network hardware එකට කතා කරනවා. AWS ගේ SRD (Scalable Reliable Datagram) protocol එක පාවිච්චි කරනවා. NCCL එක EFA පාවිච්චි කරන්නේ aws-ofi-nccl plugin එක හරහා. P4d/P5 වල GPUDirect RDMA support එකත් තියෙනවා. සරලව: EFA = AWS cloud එකේ InfiniBand/RoCE වගේ role එක. Multi-node training වලට EFA නැත්නම් all-reduce එක හෙමින්. Instances එකම placement group (cluster placement) එකක, EFA-enabled security group එකක දාන්න.',
      ],
      analogy:
        'AWS GPU instances කියන්නේ vehicle rental එකක් වගේ. G6 = tuk-tuk: ලාභයි, ඉන්ධන අඩුයි, නගරය ඇතුළේ කෙටි ගමන් (පොඩි inference). G5 = car: බහුලයි, හොඳ තේරීමක්. G6e = van: ලොකු බඩු (ලොකු models) දාන්න ඉඩ. P4d = lorry fleet එකක්. P5 = container trucks convoy එකක්, ලොකුම බර, මිලත් වැඩිම. EFA කියන්නේ convoy එකේ trucks අතර radio system එක, නැත්නම් trucks එකිනෙකා බලාගෙන නතර වෙනවා.',
      example:
        'තේරීම් කිහිපයක්: (1) 8B LLM එකක් INT4/FP8 quantized, අඩු concurrency → g6.xlarge (L4 24 GB) එකක්. (2) 8B LLM එක BF16, KV cache එකට ඉඩ ඕනේ → g6e (L40S 48 GB). (3) 70B LLM එකක් BF16 serve කරන්න (weights 140 GB) → p4de/p5 වගේ 8-GPU instance එකක tensor parallel. (4) 13B model එකක් full fine-tune, nodes 4ක → p4d/p5 + EFA + FSDP. (5) Image classifier inference, ලාභම විදිහට → g6 හෝ g5. AWS Inferentia/Trainium වගේ AWS chips ත් තියෙනවා, ඒත් NVIDIA stack (CUDA, TensorRT, NIM) පාවිච්චි කරන්න නම් G/P families.',
      keyPoints: [
        'G5 = A10G 24 GB (Ampere). G6 = L4 24 GB (Ada, FP8). G6e = L40S 48 GB.',
        'P4d = 8× A100 40 GB, 400 Gbps EFA. P5 = 8× H100 80 GB, 3200 Gbps EFA.',
        'G = inference/පොඩි training, ලාභයි. P = ලොකු training/ලොකු LLMs.',
        'EFA = OS-bypass, SRD, libfabric, NCCL via aws-ofi-nccl. Multi-node training වලට අත්‍යවශ්‍යයි.',
      ],
      terms: [
        { en: 'G5 / G6 / G6e', si: 'AWS inference-oriented GPU instances: A10G / L4 / L40S.' },
        { en: 'P4d / P4de / P5', si: 'AWS training-class 8-GPU instances: A100 40GB / A100 80GB / H100 80GB.' },
        { en: 'EFA', si: 'Elastic Fabric Adapter. OS-bypass, low-latency networking for multi-node HPC/ML on AWS.' },
        { en: 'SRD', si: 'Scalable Reliable Datagram. EFA පාවිච්චි කරන AWS transport protocol එක.' },
        { en: 'aws-ofi-nccl', si: 'NCCL එකට libfabric/EFA හරහා communicate කරන්න දෙන plugin එක.' },
        { en: 'Cluster Placement Group', si: 'Instances එකම low-latency network segment එකක කිට්ටුවෙන් තියන AWS placement strategy එක.' },
      ],
    },
    {
      id: 'aws-nim-triton-deploy',
      title: 'Running NIM and Triton on AWS: SageMaker AI and EKS GPU Nodes',
      body: [
        'AWS එකේ NVIDIA inference stack එක run කරන්න ප්‍රධාන මාර්ග දෙකක්. (1) Amazon SageMaker AI: managed endpoints. ඔයා container එක (Triton හෝ NIM) සහ model එක දෙනවා, instance type එක (උදා: ml.g5, ml.g6, ml.p5) තෝරනවා, SageMaker එක servers, scaling, health checks, logging බලාගන්නවා. AWS විසින් Triton Inference Server containers දෙනවා. NVIDIA NIM ත් AWS Marketplace හරහා SageMaker එකට deploy කරන්න පුළුවන්. Infrastructure team එකක් නැති, ඉක්මනින් production යන්න ඕනේ තැන් වලට හොඳයි.',
        '(2) Amazon EKS (Kubernetes): වැඩි control එකක්. GPU node groups හදනවා (G/P instances), EKS-optimized accelerated AMI එක (NVIDIA drivers සහ container toolkit දැනටමත් ඇතුළේ) හෝ Bottlerocket NVIDIA variant එකක්. ඊට පස්සේ NVIDIA device plugin එක install කරනවා, එතකොට pods වලට nvidia.com/gpu ඉල්ලන්න පුළුවන්. නැත්නම් NVIDIA GPU Operator එක install කරනවා: driver, toolkit, device plugin, DCGM exporter, MIG manager ඔක්කොම manage කරන්න. (AMI එකේ driver දැනටමත් තියෙනවා නම් Operator එකේ driver install එක disable කරන්න.) Karpenter හෝ Cluster Autoscaler වලින් GPU nodes scale කරනවා.',
        'EKS එකේ NIM: NVIDIA NIM Helm chart එකෙන් deploy කරනවා, NGC API key එක Kubernetes Secret එකක. Model weights cache කරන්න persistent volume (EFS/FSx) එකක් දානවා නම් pod restart වෙද්දී ආයෙත් download වෙන්නේ නෑ. Triton නම් model repository එක S3 එකේ තියන්න පුළුවන්. Autoscaling: HPA එක GPU utilization එකට වඩා, queue time හෝ requests in flight වගේ metrics මත කරන එක LLM serving වලට හොඳයි (Phase 9 "Scaling LLM Serving").',
        'SageMaker vs EKS: SageMaker = අඩු ops වැඩ, managed, ඉක්මනින් පටන් ගන්න, per-endpoint billing. EKS = ඔයාගේ platform team එකට Kubernetes පුළුවන් නම්, services ගොඩක් එකම cluster එකේ, multi-cloud/on-prem එක්ක portable (එකම Helm charts on-prem Kubernetes එකකත්). Hybrid strategy එකකට EKS + NIM ගොඩක් ගැළපෙනවා, මොකද on-prem DGX/Kubernetes cluster එකකත් එකම NIM container එක run වෙනවා.',
      ],
      analogy:
        'SageMaker කියන්නේ hotel එකක කාමරයක් ගන්නවා වගේ. ඇඳ, clean කරන එක, security ඔක්කොම hotel එක බලාගන්නවා. ඔයා ගෙනියන්නේ ඔයාගේ බඩු (model) විතරයි. EKS කියන්නේ apartment එකක් කුලියට ගන්නවා වගේ. Furniture දාන්න, ඔයාට ඕනේ විදිහට සකස් කරන්න පුළුවන්, ඒත් maintain කරන්න ඕනේ ඔයාමයි. ඔයාගේම ගෙදර (on-prem) ත් ඒ furniture (containers) ම දාන්න පුළුවන්.',
      example:
        'Bank chatbot POC එක: SageMaker AI endpoint එකක් ml.g6e instance එකක Llama 8B NIM එක්ක, දවස් 2කින් ready. Production එක: EKS cluster එකේ g6e GPU node group එකක් (min 2, max 6), GPU Operator, NIM Helm chart, NGC key එක Secret එකක, model cache එක FSx එකක, internal ALB එකක් හරහා intranet එකට. HPA එක requests-in-flight metric එකෙන් replicas 2-6 අතර. Prometheus + DCGM exporter වලින් GPU monitoring.',
      code: {
        lang: 'text',
        src: `# EKS pod එකක GPU එකක් ඉල්ලන හැටි (Deployment spec එකේ කොටසක්)
containers:
  - name: llm-nim
    image: nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
    resources:
      limits:
        nvidia.com/gpu: 1          # device plugin / GPU Operator එකෙන් ලැබෙන resource එක
    env:
      - name: NGC_API_KEY
        valueFrom:
          secretKeyRef: { name: ngc-api, key: NGC_API_KEY }   # key එක hardcode නෑ`,
      },
      keyPoints: [
        'SageMaker AI = managed endpoints, Triton containers, NIM via Marketplace, අඩු ops.',
        'EKS = accelerated AMI + device plugin හෝ GPU Operator, Helm charts, portable, වැඩි control.',
        'NGC key = Secret. Model cache = persistent volume. Autoscale = queue/in-flight metrics.',
        'Hybrid: එකම NIM/Triton containers EKS සහ on-prem Kubernetes දෙකේම.',
      ],
      terms: [
        { en: 'Amazon SageMaker AI', si: 'Models train කරන්න සහ managed endpoints වලින් deploy කරන්න AWS service එක.' },
        { en: 'Amazon EKS', si: 'AWS managed Kubernetes service එක.' },
        { en: 'EKS-optimized Accelerated AMI', si: 'NVIDIA drivers සහ container toolkit pre-installed තියෙන EKS node image එක.' },
        { en: 'NVIDIA Device Plugin', si: 'Kubernetes එකට nvidia.com/gpu resource එක advertise කරන DaemonSet එක.' },
        { en: 'Karpenter', si: 'Pods වලට ඕනේ instance types automatic launch කරන AWS Kubernetes node autoscaler එක.' },
        { en: 'Helm Chart', si: 'Kubernetes application එකක් deploy කරන්න ඕනේ YAML templates පැකේජය.' },
      ],
    },
    {
      id: 'sizing-gpu-deployment',
      title: 'And More: Sizing a GPU Deployment Step by Step (Sri Lankan Bank Chatbot)',
      body: [
        'Architect කෙනෙක්ගෙන් අහන ප්‍රශ්නය: "අපිට internal chatbot එකක් ඕනේ. GPUs කීයක් ඕනේද? On-prem ද cloud ද?" මේ phase එකේ ඉගෙන ගත්ත ඔක්කොම එකට දාලා පියවරෙන් පියවර උත්තර දෙමු. Step 1, requirements: Users කීයද? එකවර (concurrent) requests කීයද? Context length එක කීයද (RAG documents එක්ක)? Latency target එක (පළවෙනි token එක තත්පර 1-2ක් ඇතුළත වගේ)? Data එළියට යවන්න පුළුවන්ද? Uptime එක?',
        'Step 2, model තේරීම: හැමවෙලේම ලොකුම model එක ඕනේ නෑ. Bank policy documents වලින් උත්තර දෙන RAG chatbot එකකට 8B වගේ instruct model එකක් ගොඩක් වෙලාවට ඇති. Step 3, memory: Weights = parameters × bytes. 8B × 2 bytes (BF16) = 16 GB. KV cache = (per token KV size) × context length × concurrent requests (Phase 9 "Batching, KV Cache & GPU Memory Calculations" එකේ ගණනය). Runtime overhead සඳහා ටිකක් අමතරව තියන්න. Step 4, GPU type/count: ඒ memory එක හරියන GPU එකක් තෝරලා, replicas ගණන throughput එකට, +1 high availability එකට.',
        'Step 5, benchmark: කඩදාසි ගණන ආසන්න එකක් විතරයි. ඇත්ත prompts එක්ක load test එකක් (NVIDIA GenAI-Perf වගේ tool එකකින්) කරලා TTFT, throughput බලන්න. Step 6, on-prem vs cloud: utilization, data residency, budget, skills, timeline. Step 7, operations: monitoring (DCGM), autoscaling, security (segmentation, secrets, least privilege), model updates.',
        'මේ ක්‍රමයම ඕනෑම use case එකකට පාවිච්චි කරන්න පුළුවන්: telco call-center voice bot එකක්, hospital එකක imaging service එකක්. Model → memory → GPU → replicas → benchmark → deployment location → operations.',
      ],
      analogy:
        'මේක ගෙදර wedding එකකට catering size කරනවා වගේ. අමුත්තෝ කීයද (users), එකවර කන්නේ කීයද (concurrency), මොන කෑමද (model), එක්කෙනෙක් කන ප්‍රමාණය (memory per request), බත් හැලි කීයක් ඕනේද (GPUs), එක හැල්ලක් පිච්චුණොත් backup එකක් (HA), කලින් රස බලන එක (benchmark), ගෙදර උයනවද hall එකේ catering ද (on-prem vs cloud).',
      example:
        'ලංකාවේ bank එකක්: staff 3,000ක්, peak එකේ එකවර requests 50ක්, RAG context එක්ක tokens 4,000 ක් පමණ per request, data bank එකෙන් එළියට යවන්න කැමති නෑ. Model: Llama 3.1 8B (layers 32, KV heads 8, head dim 128). Weights BF16 = 16 GB. KV per token = 2 (K සහ V) × 32 × 8 × 128 × 2 bytes = 131,072 bytes ≈ 128 KB. Request එකකට 4,000 × 128 KB ≈ 0.5 GB. Requests 50ට ≈ 26 GB. මුළුව ≈ 16 + 26 + overhead (~10%) ≈ 46 GB පමණ. තේරීම්: 24 GB GPU එකක (L4/A10G) BF16 වලින් හරියන්නේ නෑ (weights quantize කරලා concurrency අඩු කරන්න වෙනවා). 48 GB L40S එකක් කිට්ටුයි, ඒත් හරියනවා; 80 GB H100 එකක ගොඩක් ඉඩ. HA සඳහා replicas 2ක් = 48 GB+ GPUs 2ක්. Decision: data residency නිසා සහ chatbot එක දවස පුරා (වැඩ කරන වෙලාවේ) පාවිච්චි වෙන නිසා, දිගු කාලීනව on-prem L40S servers 2ක් (හෝ H100 class server එකක MIG/2 GPUs) හොඳයි. POC එක මාස 2කට cloud එකේ (g6e) කරලා load test ප්‍රතිඵල වලින් size එක confirm කරනවා. Rack power, cooling, security segmentation, DCGM monitoring ත් plan එකට දානවා.',
      code: {
        lang: 'python',
        src: `# Bank chatbot GPU memory sizing (ආසන්න ගණනක්, GB)
params_b = 8                     # model එකේ parameters (බිලියන)
weight_gb = params_b * 2         # BF16 = bytes 2 → 16 GB
layers, kv_heads, head_dim = 32, 8, 128
kv_per_token = 2 * layers * kv_heads * head_dim * 2   # K+V, bytes 2 → bytes
ctx, concurrent = 4000, 50
kv_gb = kv_per_token * ctx * concurrent / 1e9         # ≈ 26 GB
overhead_gb = 0.1 * (weight_gb + kv_gb)               # runtime/activations වලට ~10%
total = weight_gb + kv_gb + overhead_gb
print(f"weights {weight_gb} GB, KV {kv_gb:.0f} GB, total ≈ {total:.0f} GB")
for gpu, mem in [("L4", 24), ("L40S", 48), ("H100", 80)]:
    print(gpu, "fits" if total <= mem else "does NOT fit")`,
      },
      keyPoints: [
        'Requirements → model → memory (weights + KV + overhead) → GPU type → replicas + HA → benchmark → location → operations.',
        'Weights = params × bytes. KV = per-token size × context × concurrency.',
        'කඩදාසි ගණන ආරම්භයක් විතරයි. ඇත්ත load test එකෙන් confirm කරන්න.',
        'Steady usage + data residency → on-prem. POC/spiky → cloud. Hybrid ගොඩක් වෙලාවට හොඳම පටන් ගැනීම.',
      ],
      terms: [
        { en: 'Capacity Planning', si: 'Workload එකට ඕනේ compute, memory, network, storage කලින්ම ගණනය කරන එක.' },
        { en: 'Concurrency', si: 'එකම වෙලාවේ process වෙන requests ගණන.' },
        { en: 'High Availability (N+1)', si: 'එක component එකක් fail වුණත් service එක දිගටම යන්න අමතර replica එකක් තියාගන්න එක.' },
        { en: 'GenAI-Perf', si: 'LLM endpoints වල TTFT, throughput වගේ metrics load test කරලා මනින NVIDIA tool එක.' },
        { en: 'Proof of Concept (POC)', si: 'ලොකු investment එකකට කලින් පොඩි පරිමාණයෙන් idea එක වැඩ කරනවද බලන test එක.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'GPU එකක් AI training වලට CPU එකකට වඩා හොඳ වෙන ප්‍රධානම හේතුව මොකක්ද?',
      options: [
        'GPU core එකක් CPU core එකකට වඩා දක්ෂයි, ලොකු cache තියෙනවා',
        'Matrix math වගේ parallel වැඩ සරල cores දහස් ගණනකින් එකවර කරන throughput-optimized design එක',
        'GPU එකට operating system එකක් run කරන්න පුළුවන්',
        'GPU එකට PCIe අවශ්‍ය නැහැ',
      ],
      answer: 1,
      why: 'CPU = latency-optimized, දක්ෂ cores ටිකයි. GPU = throughput-optimized, සරල cores දහස් ගණනක්. Neural networks වල matrix multiplication ගොඩක් parallel නිසා GPU එක ගැළපෙනවා.',
    },
    {
      q: 'CUDA program එකක් CPU RAM එකේ ඉඳන් GPU memory එකට නිතර නිතර පොඩි data කෑලි copy කරනවා. GPU utilization අඩුයි. වැඩිම ඉඩ තියෙන හේතුව මොකක්ද?',
      options: [
        'Warp size එක 64 නිසා',
        'PCIe host-to-device transfers HBM එකට වඩා ගොඩක් හෙමින්, GPU එක data එනකම් බලාගෙන ඉන්නවා',
        'Kernels CPU එකේ run වෙන නිසා',
        'Block එකක threads 32ට වඩා තියෙන්න බැරි නිසා',
      ],
      answer: 1,
      why: 'Host memory සහ device memory වෙනම. PCIe copy එක GPU memory bandwidth එකට වඩා ගොඩක් හෙමින්. Data එක පාරක් GPU එකට යවලා එතනම වැඩ ගොඩක් කරන්න.',
    },
    {
      q: 'Training cluster එකකට inference deployment එකකට වඩා සාමාන්‍යයෙන් වැඩිපුර ඕනේ වෙන්නේ මොනවද?',
      options: [
        'අඩු GPU memory සහ autoscaling',
        'Gradients/optimizer states සඳහා වැඩි memory, nodes අතර ඉතා වේගවත් interconnect, checkpoints සඳහා high-throughput shared storage',
        'INT4 quantization සහ load balancer එකක්',
        'Edge devices',
      ],
      answer: 1,
      why: 'Training memory = weights + gradients + optimizer states + activations. GPUs ගොඩක් gradients exchange කරන නිසා InfiniBand/RoCE වගේ fabric එකක් සහ checkpoint I/O වලට වේගවත් storage ඕනේ.',
    },
    {
      q: 'Data center එකක PUE 1.5 නම් ඒකේ තේරුම මොකක්ද?',
      options: [
        'IT equipment වලට 1 kW යද්දී මුළු facility එකට 1.5 kW ගන්නවා (cooling වගේ දේවලට අමතර 0.5 kW)',
        'GPUs 50% ක් idle',
        'Rack එකකට kW 1.5 යි',
        'Cooling එක 1.5 ගුණයක් efficient',
      ],
      answer: 0,
      why: 'PUE = මුළු facility power ÷ IT equipment power. 1.0 ට කිට්ටු වෙන තරමට efficient.',
    },
    {
      q: 'RoCE v2 ගැන නිවැරදිම ප්‍රකාශය මොකක්ද?',
      options: [
        'ඒක InfiniBand switches මත විතරක් වැඩ කරනවා',
        'ඒක RDMA, UDP/IP උඩින් Ethernet එකේ යවනවා. හොඳ performance එකකට congestion control (ECN/PFC වගේ) හරියට configure කරන්න ඕනේ',
        'ඒක GPU එක ඇතුළේ SMs connect කරන bus එක',
        'ඒක storage file system එකක්',
      ],
      answer: 1,
      why: 'RoCE v2 = RDMA over Converged Ethernet, UDP/IP උඩින් යන නිසා routable. RDMA packet loss වලට සංවේදී නිසා lossless/congestion settings වැදගත්. Spectrum-X මේකට optimize කරපු NVIDIA AI Ethernet platform එක.',
    },
    {
      q: 'GPUDirect Storage (GDS) කරන්නේ මොකක්ද?',
      options: [
        'GPU එකේ model weights encrypt කරනවා',
        'Storage (NVMe/NVMe-oF/parallel FS) සහ GPU memory අතර CPU memory bounce buffer එක නැතුව direct DMA path එකක් හදනවා',
        'GPU එක VMs අතර share කරනවා',
        'Checkpoints automatic delete කරනවා',
      ],
      answer: 1,
      why: 'GDS (cuFile API) වලින් data CPU memory එක හරහා යන්නේ නැතුව storage එකේ ඉඳන් GPU memory එකට කෙලින්ම එනවා. CPU load අඩුයි, bandwidth වැඩියි.',
    },
    {
      q: 'Multi-tenant private cloud එකක host CPU cores වලින් virtual switching, encryption, firewall වැඩ ඉවත් කරලා, tenants ලගෙන් infrastructure control එක isolate කරන්න හොඳම තේරීම මොකක්ද?',
      options: ['MIG', 'BlueField DPU', 'NVLink', 'Slurm fair-share'],
      answer: 1,
      why: 'BlueField DPU එකේ Arm cores, ConnectX NIC, accelerators තියෙනවා. Networking, storage, security offload කරලා, host OS එකෙන් වෙනම infrastructure control එක run කරනවා (zero trust).',
    },
    {
      q: 'Researchers ලා nodes 16ක් පැය 72ක් ඉල්ලන multi-node training batch jobs submit කරනවා, fair-share සහ gang scheduling ඕනේ. වෙනම team එකකට autoscaling inference APIs ඕනේ. වඩාත් සුදුසු තේරීම මොකක්ද?',
      options: [
        'දෙකටම time-slicing',
        'Training වලට Slurm, inference services වලට Kubernetes',
        'Training වලට Kubernetes HPA, inference වලට sbatch',
        'දෙකටම nvidia-smi',
      ],
      answer: 1,
      why: 'Slurm = batch jobs, queues, fair-share, gang scheduling. Kubernetes = දිගටම run වෙන services, autoscaling, rolling updates. ගොඩක් ආයතන දෙකම පාවිච්චි කරනවා.',
    },
    {
      q: 'VMware virtual desktops වල radiologists ලට GPU acceleration දෙන්න ඕනේ. වඩාත් ගැළපෙන තාක්ෂණය මොකක්ද?',
      options: ['NVIDIA vGPU', 'Kubernetes time-slicing', 'GPUDirect Storage', 'SHARP'],
      answer: 0,
      why: 'vGPU = hypervisor එකක VMs අතර GPU share කරන NVIDIA software එක (time-sliced හෝ MIG-backed). VDI වලට තමයි ප්‍රධාන use case එක. MIG/time-slicing container sharing වලට Kubernetes එකේ පාවිච්චි වෙනවා.',
    },
    {
      q: 'AWS එකේ H100 GPUs 8ක් තියෙන nodes ගොඩකින් multi-node LLM training කරනවා. Instance family එක සහ nodes අතර network එක මොකක්ද?',
      options: [
        'G6 + සාමාන්‍ය ENA networking',
        'P5 + Elastic Fabric Adapter (EFA), NCCL aws-ofi-nccl plugin එක හරහා',
        'G5 + NVLink between instances',
        'P4d + Wi-Fi',
      ],
      answer: 1,
      why: 'P5 = 8× H100 80 GB, 3200 Gbps EFA. EFA OS-bypass සහ SRD එක්ක low-latency networking දෙනවා. NCCL ඒක පාවිච්චි කරන්නේ aws-ofi-nccl plugin එකෙන්. G6 = L4 (inference), G5 = A10G.',
    },
  ],
}
