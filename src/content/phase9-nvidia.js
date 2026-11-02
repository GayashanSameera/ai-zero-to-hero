export default {
  id: 'nvidia',
  number: 9,
  title: 'NVIDIA AI Stack & LLM Serving',
  titleSi: 'NVIDIA AI Stack: GPU එකේ ඉඳන් LLM එකක් users ලට serve කරනකම්',
  summary:
    'LLM එකක් හදන්න, train කරන්න, users ලට දෙන්න ඕනේ GPUs, libraries, servers ගොඩක්. මේ phase එකෙන් ඔයා NVIDIA GPU එකක් ඇතුළේ මොනවද තියෙන්නේ, CUDA, TensorRT, Triton, NIM, NeMo වගේ tools මොකටද, LLM serving වල TTFT, KV cache, batching වගේ දේවල් වැඩ කරන්නේ කොහොමද කියලා ඉගෙන ගන්නවා. NVIDIA NCA-GENL exam එකේ ලොකු කොටසක් එන්නේ මේ ටිකෙන්.',
  duration: 'සති 4-6',
  topics: [
    {
      id: 'gpu-hardware-basics',
      examRefs: ['DEP-001', 'DEP-002', 'DEP-003', 'DEP-004'],
      title: 'GPU Hardware: CUDA Cores, Tensor Cores, SMs, Warps, HBM',
      body: [
        'GPU එකක් කියන්නේ එකම වැඩේ දහස් ගණනක් එකවර කරන්න පුළුවන් chip එකක්. CPU එකක තියෙන්නේ ගොඩක් දක්ෂ cores ටිකයි. GPU එකක තියෙන්නේ සරල cores දහස් ගණනක්. AI වල ගොඩක් වැඩ matrix multiplication නිසා, GPU එක ඒකට හරියටම ගැළපෙනවා.',
        'GPU එක හැදිලා තියෙන්නේ Streaming Multiprocessors (SMs) කියන blocks ගොඩකින්. හැම SM එකක් ඇතුළෙම CUDA cores, Tensor Cores, registers, shared memory තියෙනවා. ඔයාගේ program එකේ thread blocks hardware එක විසින් SMs වලට බෙදලා දෙනවා. SM එක threads run කරන්නේ 32 දෙනාගේ කණ්ඩායම් වලින්. ඒ කණ්ඩායමට කියන්නේ warp කියලා. Warp එකක threads 32ම එකම instruction එක එකවර කරනවා. (AMD වල "wavefront" එක 64ක්, ඒක පටලවගන්න එපා.)',
        'CUDA cores කරන්නේ සාමාන්‍ය ගණන් (scalar/vector arithmetic), thread එකකට එක ගණනක් වගේ. Tensor Cores කියන්නේ විශේෂ units. ඒවා එක instruction එකකින් පොඩි matrix tile එකක multiply-accumulate එකක්ම කරනවා, සාමාන්‍යයෙන් FP16/BF16/FP8 වගේ අඩු precision එකකින්, accumulate කරන්නේ වැඩි precision එකකින්. Transformers වල වැඩි කාලයක් යන GEMM (matrix multiply) වැඩේට Tensor Cores තමයි වීරයා. Tensor Cores memory එකක් නෙවෙයි, compute units.',
        'HBM (High Bandwidth Memory) කියන්නේ A100, H100 වගේ data-center GPUs වල ප්‍රධාන memory එක. DRAM chips එක උඩ එක තට්ටු කරලා (stacked) GPU die එක ළඟින්ම එකම package එකේ තියලා, ගොඩක් පළල bus එකකින් connect කරනවා. ඒ නිසා තත්පරයට terabytes ගණනක් (TB/s) bandwidth ලැබෙනවා. Gaming cards වල තියෙන්නේ GDDR (පටු bus, වැඩි clock). SM එක ඇතුළේ තියෙන shared memory කියන්නේ පොඩි on-chip SRAM එකක්, ඒක HBM නෙවෙයි.',
      ],
      analogy:
        'GPU එක ලොකු කොත්තු කඩයක් කියලා හිතන්න. SM එකක් කියන්නේ එක කුස්සියක්. කුස්සියක ඉන්න සාමාන්‍ය කෝකියෝ CUDA cores. Tensor Core එක කියන්නේ එක පාරට කොත්තු plate 16ක් කොටන විශේෂ machine එකක්. Warp එක කියන්නේ එකම order එක එකවර කරන කෝකියෝ 32 දෙනාගේ කණ්ඩායමක්. HBM කියන්නේ කුස්සිය ළඟින්ම තියෙන ලොකු ගබඩාව, ඒකට තියෙන්නේ lanes සිය ගණනක් තියෙන පළල පාරක්.',
      example:
        'H100 එකක SMs සිය ගණනක් තියෙනවා. ඔයා thread 1024ක block එකක් launch කරාම, ඒක SM එකක run වෙන්නේ warps 32ක් (1024 ÷ 32) විදිහට. ඒ නිසා block size එක හැමවෙලේම 32 ගුණාකාරයක් (128, 256, 512) වෙන්න තෝරන්නේ. 100ක් දැම්මොත් අන්තිම warp එකේ threads 4ක් හිස්ව තියෙනවා.',
      keyPoints: [
        'SM = GPU එකේ මූලික block එක (CUDA cores + Tensor Cores + registers + shared memory).',
        'Warp = එකට run වෙන threads 32ක කණ්ඩායම.',
        'Tensor Cores = අඩු precision matrix multiply-accumulate කරන විශේෂ units. Transformers වේගවත් වෙන්නේ මේවා නිසා.',
        'HBM = GPU package එකේම stacked DRAM. TB/s bandwidth. GDDR සහ shared memory එක්ක පටලවගන්න එපා.',
      ],
      terms: [
        { en: 'CUDA Core', si: 'Scalar/vector ගණන් කරන සාමාන්‍ය GPU core එක.' },
        { en: 'Tensor Core', si: 'පොඩි matrix tiles වල multiply-accumulate එක instruction එකකින් කරන විශේෂ unit එක. Volta generation එකෙන් මුලින්ම ආවා.' },
        { en: 'Streaming Multiprocessor (SM)', si: 'Thread blocks schedule වෙන hardware block එක. GPU එකක SMs ගොඩක් තියෙනවා.' },
        { en: 'Warp', si: 'NVIDIA GPU එකක එකට execute වෙන threads 32ක group එක.' },
        { en: 'HBM', si: 'High Bandwidth Memory. GPU die එක ළඟ stacked DRAM, ඉතා පළල interface එකකින් TB/s ලබාදෙනවා.' },
        { en: 'GEMM', si: 'General Matrix Multiply. Transformer layers වල වැඩි කාලයක් යන්නේ මේකට.' },
      ],
    },
    {
      id: 'gpu-generations-precision',
      examRefs: ['DEP-005', 'DEP-006', 'DEP-007', 'DEP-124', 'DEP-126'],
      title: 'GPU Generations & Number Precisions (FP32, TF32, FP16, BF16, INT8, FP8)',
      body: [
        'NVIDIA data-center GPUs වල නම් වල මුල් අකුරෙන් architecture එක කියවෙනවා. V100 = Volta (Tensor Cores මුලින්ම ආවේ මෙතනින්). A100 = Ampere (TF32 සහ BF16 Tensor Core support එක ආවා). H100 = Hopper (FP8 Tensor Cores සහ Transformer Engine ආවා). B200 = Blackwell (දෙවෙනි generation Transformer Engine එක, FP4 support එකත් එක්ක). A100 ට Hopper, H100 ට Ampere කියලා මාරු කරන එක exam එකේ පොදු උගුලක්.',
        'Precision කියන්නේ එක අංකයක් ගබඩා කරන්න bits කීයක් පාවිච්චි කරනවද කියන එක. FP32 = bytes 4. FP16 සහ BF16 = bytes 2. INT8 සහ FP8 = byte 1. INT4/FP4 = byte භාගයක්. අඩු bits නම් memory අඩුයි, වේගය වැඩියි, ඒත් නිරවද්‍යතාව ටිකක් අඩු වෙන්න පුළුවන්.',
        'FP16 සහ BF16 දෙකම bits 16යි, memory එක සමානයි. වෙනස මෙහෙමයි: BF16 ට FP32 ට සමාන exponent range එකක් තියෙනවා (ලොකු පොඩි අංක දෙකම අල්ලගන්න පුළුවන්), ඒත් mantissa bits අඩුයි (7, FP16 ට 10). ඒ නිසා FP16 වල පොඩි gradients බිංදුවට වැටෙන (underflow) ප්‍රශ්නය BF16 වල වෙන්නේ නැති තරම්. TF32 කියන්නේ Ampere එකෙන් ආපු mode එකක්. FP32 matmuls Tensor Cores මත run කරන්න දෙනවා, accumulate කරන්නේ FP32 වලින්. PyTorch වල FP32 matmuls වලට TF32 default එකෙන් off. torch.set_float32_matmul_precision("high") දැම්මාම on වෙනවා.',
        'Transformer Engine කියන්නේ Hopper එකෙන් ආපු hardware + software එකක්. ඒක layer එකෙන් layer එකට scaling factors බලාගන්න නිසා FP8 training සහ inference ආරක්ෂිතව කරන්න පුළුවන්. NeMo සහ Megatron-LM FP8 training වලට ඒක පාවිච්චි කරනවා. වැදගත්: A100 (Ampere) එකේ native FP8 Tensor Cores නෑ. A100 වලට INT8 හරි weight-only INT4 හරි තමයි යොදන්නේ. FP8 තියෙන්නේ Ada Lovelace (L40S), Hopper (H100), Blackwell (B200) වල.',
      ],
      analogy:
        'Precision කියන්නේ කඩේ තරාදිය වගේ. FP32 කියන්නේ ගෑම් එකකටත් හරියට කියන රත්තරන් තරාදිය. FP16/BF16 කියන්නේ සාමාන්‍ය කඩේ තරාදිය. INT8/FP8 කියන්නේ "කිලෝ භාගයයි, කිලෝ එකයි" විතරක් කියන පරණ තරාදිය. සහල් කිලෝ 50ක් කිරන්න රත්තරන් තරාදිය ඕනේ නෑ. BF16 කියන්නේ ලොකු ගෝනිත් පොඩි පැකට්ටුත් කිරන්න පුළුවන්, ඒත් දශම ස්ථාන අඩු තරාදියක්.',
      example:
        'ඔයාට 7B parameter model එකක් තියෙනවා. FP32: 7 × 4 = 28 GB. FP16/BF16: 7 × 2 = 14 GB. INT8/FP8: 7 GB. INT4: 3.5 GB. FP8 වලින් run කරන්න ඕනේ නම් H100 එකක් ගන්න ඕනේ. A100 එකක නම් INT8 හෝ INT4 weight-only quantization එකක් තෝරන්න.',
      keyPoints: [
        'Volta (V100) → Ampere (A100) → Hopper (H100) → Blackwell (B200).',
        'Ampere: TF32 + BF16. Hopper: FP8 + Transformer Engine. Blackwell: FP4.',
        'BF16 = FP32 range එක, අඩු precision. FP16 training වල loss scaling (GradScaler) ඕනේ, BF16 වල සාමාන්‍යයෙන් ඕනේ නෑ.',
        'A100 වල native FP8 නෑ.',
      ],
      terms: [
        { en: 'Volta / Ampere / Hopper / Blackwell', si: 'V100 / A100 / H100 / B200 GPU generations, පිළිවෙළින්.' },
        { en: 'Transformer Engine', si: 'Per-layer scaling බලාගෙන FP8 (Blackwell වල FP4 ත්) ආරක්ෂිතව පාවිච්චි කරන්න දෙන NVIDIA technology එක. Hopper එකෙන් ආවා.' },
        { en: 'TF32', si: 'Ampere එකෙන් ආපු format එක. FP32 matmuls Tensor Cores මත run කරනවා.' },
        { en: 'FP16 / BF16', si: 'Bits 16 formats. BF16 ට FP32 range එක, FP16 ට වැඩි mantissa precision.' },
        { en: 'INT8 / FP8', si: 'Byte 1 formats. INT8 integer, FP8 floating point (Hopper+ වල native).' },
      ],
    },
    {
      id: 'multi-gpu-networking',
      examRefs: ['DEP-009', 'DEP-028', 'DEP-029', 'DEP-030', 'DEP-032', 'DEP-066', 'DEP-105', 'DEP-127', 'DEP-141', 'DEP-142'],
      title: 'Multi-GPU: NVLink, NVSwitch, InfiniBand, GPUDirect RDMA, NCCL, DGX vs HGX',
      body: [
        'ලොකු LLM එකක් එක GPU එකකට හරියන්නේ නෑ. ඒ නිසා GPUs ගොඩක් එකට වැඩ කරන්න ඕනේ. එතකොට ඒ GPUs අතර data යවන "පාරවල්" ගොඩක් වැදගත්. Server එක (node එක) ඇතුළේ GPUs අතර කෙලින්ම connect කරන ඉතා වේගවත් link එක NVLink. ඒක PCIe වලට වඩා ගොඩක් වේගවත්, තත්පරයට GB සිය ගණනක්.',
        'NVLink විතරක් තිබුණොත් හැම GPU යුගලයක්ම කෙලින්ම connect වෙන්නේ නෑ. NVSwitch කියන්නේ switch fabric එකක්. ඒකෙන් 8-GPU server එකක හැම GPU එකකටම අනිත් හැම GPU එකක් එක්කම එකවර full NVLink bandwidth එකෙන් කතා කරන්න පුළුවන් (all-to-all). Server (node) අතර, ඒ කියන්නේ racks අතර, data යවන්නේ InfiniBand වගේ network එකකින්, RDMA එක්ක. GPUDirect RDMA කියන්නේ GPU memory එකේ ඉඳන් network card එකට කෙලින්ම data යවන එක, CPU memory එක හරහා copy එකක් නැතුව. ඒකෙන් latency සහ CPU වැඩ අඩු වෙනවා.',
        'NCCL (NVIDIA Collective Communications Library) කියන්නේ GPUs අතර all-reduce, all-gather, reduce-scatter, broadcast වගේ "collective" operations කරන library එක. Data-parallel training වල gradients average කරන all-reduce එක කරන්නේ NCCL. PyTorch distributed වල GPU default backend එකත් NCCL. NCCL hang එකක්, ඒ කියන්නේ job එක පළවෙනි all-reduce එකේ හිරවෙලා ඉන්න එක, ගොඩක් වෙලාවට connectivity ප්‍රශ්නයක්. NCCL_DEBUG=INFO දාලා ආයෙත් run කරාම NCCL තෝරන transport, network interface, topology logs වල පේනවා. වැරදි interface එකක් තෝරලා නම් NCCL_SOCKET_IFNAME වලින් හදන්න පුළුවන්. Firewall/InfiniBand connectivity එකත් බලන්න. Precision වෙනස් කරලා hang එක හැදෙන්නේ නෑ.',
        'DGX කියන්නේ NVIDIA ම හදන සම්පූර්ණ, ready-made AI system එක (software සහ support එක්ක). HGX කියන්නේ NVLink/NVSwitch එක්ක තියෙන multi-GPU baseboard එක. Dell, Supermicro වගේ server partners ඒක තමන්ගේ servers වලට දානවා. Parallelism ගැන පොඩි rule එකක්: tensor parallelism හැම layer එකකම all-reduce කරන නිසා ඒක NVLink domain එක (එකම node එක) ඇතුළේ තියන්න. Nodes අතර pipeline parallelism හෝ data parallelism පාවිච්චි කරන්න. උදා: nodes 2ක් නම් TP=8 node එක ඇතුළේ, PP=2 nodes අතර.',
      ],
      analogy:
        'NVLink කියන්නේ එකම ගෙදර කාමර අතර තියෙන දොරවල් වගේ. NVSwitch කියන්නේ ගෙදර මැද ශාලාව, ඕනෑම කාමරයක ඉඳන් ඕනෑම කාමරයකට එකවර යන්න පුළුවන්. InfiniBand කියන්නේ ගම් දෙකක් අතර highway එක. GPUDirect RDMA කියන්නේ කඩේට භාණ්ඩ ගබඩාවෙන් කෙලින්ම lorry එකට දාන එක, මැද තියෙන ගෙදර සාලෙට ගෙනත් තියන්නේ නැතුව. NCCL කියන්නේ හැමෝගෙම ලකුණු එකතු කරලා average එක හැමෝටම කියන class monitor වගේ.',
      example:
        '70B model එකක් FP16 වලින් weights විතරක් 140 GB. එක GPU එකක 80 GB විතරයි. TP=2 දැම්මොත් GPU එකකට 70 GB යි. TP=4 හෝ TP=8 දැම්මොත් KV cache එකටත් ඉඩ ඉතුරු වෙනවා. ඒ TP=8 shards ටික NVSwitch තියෙන එකම 8-GPU node එකක තියන්න. Ethernet එකකින් connect කරපු nodes දෙකකට බෙදුවොත් හැම layer එකකම all-reduce එක හෙමින් link එකේ හිරවෙනවා.',
      keyPoints: [
        'NVLink = node එක ඇතුළේ GPU-GPU වේගවත් link. NVSwitch = all-to-all NVLink fabric.',
        'InfiniBand + RDMA = nodes අතර. GPUDirect RDMA = GPU memory ↔ NIC කෙලින්ම.',
        'NCCL = all-reduce වගේ collectives. Hang එකක් නම් NCCL_DEBUG=INFO.',
        'DGX = සම්පූර්ණ NVIDIA system. HGX = partners ලට දෙන GPU baseboard.',
        'TP node එක ඇතුළේ, PP/DP nodes අතර.',
      ],
      terms: [
        { en: 'NVLink', si: 'GPUs අතර (සමහර CPUs එක්කත්) high-bandwidth, low-latency direct interconnect. PCIe ට වඩා ගොඩක් වේගවත්.' },
        { en: 'NVSwitch', si: 'Node එකක හැම GPU එකක්ම full NVLink bandwidth එකෙන් එකවර connect කරන switch chips.' },
        { en: 'InfiniBand', si: 'Nodes අතර low-latency, high-bandwidth RDMA network එක. NCCL inter-node collectives වලට පාවිච්චි කරනවා.' },
        { en: 'GPUDirect RDMA', si: 'GPU memory සහ network adapter අතර host memory copy එකක් නැතුව කෙලින්ම data transfer.' },
        { en: 'NCCL', si: 'NVIDIA Collective Communications Library. All-reduce, all-gather, broadcast. PyTorch GPU distributed default backend.' },
        { en: 'NCCL hang', si: 'Collective එකක් (සාමාන්‍යයෙන් පළවෙනි all-reduce) නතර නොවී හිරවීම. බොහෝවිට network interface/connectivity ප්‍රශ්නයක්.' },
        { en: 'DGX vs HGX', si: 'DGX = turnkey NVIDIA system + software. HGX = OEMs තමන්ගේ servers වලට දාන GPU board platform.' },
        { en: 'Data / Tensor / Pipeline Parallelism', si: 'DP = model copy එක හැම GPU එකකම, data බෙදනවා. TP = එක layer එකේ matrices බෙදනවා. PP = layers කණ්ඩායම් වලට බෙදලා stages හදනවා.' },
      ],
    },
    {
      id: 'cuda-libraries-rapids',
      examRefs: ['DEP-008', 'DEP-010', 'DEP-019', 'DEP-027', 'DEP-034', 'DEP-052', 'DEP-097'],
      title: 'CUDA, cuDNN, cuBLAS & RAPIDS (cuDF, cuML, Spark, XGBoost, cuVS)',
      body: [
        'CUDA කියන්නේ NVIDIA ගේ parallel computing platform එක සහ programming model එක. Language extensions, nvcc compiler එක, runtime සහ driver APIs, libraries ඔක්කොම ඒකේ කොටස්. PyTorch කියන්නේ framework එකක්. ඒක යට වැඩ කරන්නේ CUDA සහ CUDA libraries.',
        'cuBLAS = BLAS API එකේ NVIDIA implementation එක. Transformers වල linear projections වල GEMM කරන්නේ මේකෙන් (පුළුවන් තැන් වල Tensor Cores එක්ක). cuDNN = deep neural networks වලට primitives: convolutions, normalization, attention වගේ. Frameworks මේවා යටින් call කරනවා. මතක තියාගන්න: cuBLAS = සාමාන්‍ය linear algebra, cuDNN = NN-specific ops, NCCL = GPUs අතර communication.',
        'Driver vs runtime: Container එකක් ඇතුළේ CUDA runtime libraries තියෙනවා. ඒත් kernel driver එක එන්නේ host එකෙන්. අලුත් CUDA runtime එකකට ප්‍රමාණවත් තරම් අලුත් host driver එකක් ඕනේ. "driver is insufficient" error එකක් ආවොත් host driver එක upgrade කරන්න, නැත්නම් පරණ CUDA image එකක් ගන්න. Docker container එකකට GPU පේන්නේ host එකේ NVIDIA Container Toolkit එක install කරලා docker run --gpus all දුන්නොත් විතරයි.',
        'RAPIDS කියන්නේ data science වැඩ GPU එකට ගෙනියන libraries එකතුවක්. cuDF = pandas වගේ API එකක් තියෙන GPU dataframes (පරණ pandas code වලට cudf.pandas accelerator mode එකත් තියෙනවා). cuML = scikit-learn වගේ API එකක් තියෙන GPU ML algorithms (k-means, random forest, UMAP). cuGraph = graph analytics. RAPIDS Accelerator for Apache Spark = Spark plugin එකක්, support කරන SQL/DataFrame operations job code එක වෙනස් නොකර GPU එකේ run කරනවා. XGBoost ට native CUDA support තියෙනවා: version 2.0 සිට device="cuda" සහ tree_method="hist" දැම්මාම GPU එකේ train වෙනවා (පරණ versions වල tree_method="gpu_hist"). cuVS = GPU vector search සහ clustering library එක (CAGRA graph index, IVF variants). RAG වල vector index ඉක්මනට build කරන්න මේක පාවිච්චි වෙනවා.',
      ],
      analogy:
        'CUDA කියන්නේ GPU එකට කතා කරන භාෂාව සහ පාරවල් පද්ධතිය. cuBLAS, cuDNN කියන්නේ ඒ භාෂාවෙන් ලියපු ready-made recipe පොත් වගේ. PyTorch කියන්නේ ඒ recipe පොත් පාවිච්චි කරලා කෑම හදන restaurant එක. RAPIDS කියන්නේ Excel/pandas වැඩ කරන කාර්යාලයකට tuk-tuk එක වෙනුවට train එකක් දුන්නා වගේ, එකම පාරේ ගොඩක් ඉක්මනට යනවා.',
      example:
        'ඔයාගේ pandas preprocessing එක 50 GB log file එකක පැය ගණන් යනවා. import cudf කරලා හෝ cudf.pandas mode එකෙන් run කරාම එකම වගේ code එකෙන් GPU එකේ විනාඩි කිහිපයකින් ඉවර වෙන්න පුළුවන්. ඊට පස්සේ embeddings cluster කරන්න cuML KMeans, ඒ embeddings වලට vector index එකක් හදන්න cuVS CAGRA.',
      keyPoints: [
        'CUDA = platform එක. PyTorch = framework එක (CUDA මත).',
        'cuBLAS = GEMM/linear algebra. cuDNN = conv, norm, attention වගේ NN primitives.',
        'Host driver එක container එකේ CUDA runtime එකට ගැළපෙන්න ඕනේ.',
        'cuDF ≈ pandas, cuML ≈ scikit-learn, cuVS = vector search, Spark plugin = RAPIDS Accelerator.',
      ],
      terms: [
        { en: 'CUDA', si: 'NVIDIA parallel computing platform + programming model (toolkit, nvcc, runtime, driver APIs).' },
        { en: 'cuBLAS', si: 'GPU dense linear algebra (GEMM) library එක.' },
        { en: 'cuDNN', si: 'Convolution, normalization, attention වගේ deep learning primitives library එක.' },
        { en: 'NVIDIA Container Toolkit', si: 'Docker containers වලට GPU devices සහ host driver libraries inject කරන tool එක. --gpus flag එකත් එක්ක.' },
        { en: 'cuDF', si: 'RAPIDS GPU dataframe library එක. Pandas-like API.' },
        { en: 'cuML', si: 'RAPIDS GPU ML algorithms. Scikit-learn-like API.' },
        { en: 'RAPIDS Accelerator for Apache Spark', si: 'Spark SQL/DataFrame operations GPU එකේ run කරන plugin එක, job code එක ගොඩක් වෙනස් නොකර.' },
        { en: 'GPU-accelerated XGBoost', si: 'XGBoost 2.x: device="cuda", tree_method="hist". පරණ: tree_method="gpu_hist".' },
        { en: 'cuVS', si: 'RAPIDS GPU vector search/clustering library එක (CAGRA, IVF-PQ).' },
      ],
    },
    {
      id: 'nvidia-software-platform',
      examRefs: ['DEP-011', 'DEP-012', 'DEP-013', 'DEP-018', 'DEP-100', 'DEP-101', 'DEP-111'],
      title: 'NGC, NVIDIA AI Enterprise, NeMo & Megatron-LM',
      body: [
        'NGC catalog කියන්නේ NVIDIA ගේ tested software hub එක. ඒකේ GPU-optimized containers (PyTorch, NeMo, Triton), pretrained models, Helm charts, resources තියෙනවා. Images pull කරන්නේ nvcr.io registry එකෙන්. NGC PyTorch container එකක් (nvcr.io/nvidia/pytorch:<yy.mm>-py3) පාවිච්චි කරාම CUDA, cuDNN, NCCL, PyTorch versions එකට ගැළපෙන විදිහට test කරලා, tune කරලා ලැබෙනවා. Tags year.month විදිහට මාසිකව එනවා. NGC එක managed Kubernetes service එකක් නෙවෙයි. ඒකේ දේවල් run කරන්නේ ඔයාගේම infrastructure එකේ හෝ cloud එකේ. Host driver එක තාමත් ඕනේ.',
        'NVIDIA AI Enterprise කියන්නේ licensed, supported software suite එකක්. Production වලට security updates දාපු NVIDIA AI frameworks, tools, NIM වගේ microservices, enterprise support සහ certification එක්ක. ඒක software, hardware නෙවෙයි. Free fork එකකුත් නෙවෙයි, commercial license එකක්.',
        'NeMo framework කියන්නේ LLMs වගේ generative AI models build කරන්න, train කරන්න, customize කරන්න (pretraining, fine-tuning, alignment) තියෙන NVIDIA framework එක. ඒක හදලා තියෙන්නේ Megatron-Core මත. Megatron-LM කියන්නේ intra-layer tensor parallelism ප්‍රායෝගිකව හඳුන්වා දුන්න project එක. ඒක tensor, pipeline, data parallelism එකතු කරලා parameters බිලියන සිය ගණනක models train කරනවා.',
        'NeMo පවුලේ කොටස් (පස්සේ phases වල මේවා ගැන තව බලනවා): NeMo Curator = training data පිරිසිදු කරනවා (text extraction, language ID, quality filtering, exact/fuzzy dedup), RAPIDS හරහා GPU එකේ. NeMo Customizer = models fine-tune කරන (උදා: LoRA) microservice එක. NeMo-Aligner = reward model training, PPO RLHF, DPO, SteerLM. NeMo Evaluator = benchmarks, custom datasets, LLM-as-a-judge evaluations run කරන microservice එක. NeMo Retriever = RAG වලට embedding, reranking, extraction models NIM microservices විදිහට. NeMo Guardrails = deploy කරපු LLM app එක වටේ programmable rails (topic එකේ තියාගන්න, input/output check කරන්න, jailbreaks block කරන්න). Guardrails weights වෙනස් කරන්නේ නෑ, runtime එකේ වැඩ කරන්නේ.',
      ],
      analogy:
        'NGC කියන්නේ Keells super එක වගේ. හැම බඩුවක්ම check කරලා, pack කරලා shelf එකේ තියෙනවා, ඔයාට ගෙදර ගෙනිහින් උයන්න විතරයි. NVIDIA AI Enterprise කියන්නේ ඒ බඩු වලට warranty සහ හැම වෙලේම call කරන්න පුළුවන් service center එකක් එක්ක ගන්න membership එක. NeMo කියන්නේ සම්පූර්ණ කුස්සිය: Curator එළවළු සෝදනවා, Customizer සහ Aligner රස හදනවා, Evaluator රස බලනවා, Guardrails කෑම මේසෙට යන්න කලින් ආරක්ෂාව බලනවා.',
      example:
        'ඔයාගේ company එකට සිංහල customer-support bot එකක් ඕනේ. NeMo Curator වලින් chat logs ටිකේ duplicates සහ කුණු අයින් කරනවා. NeMo Customizer වලින් LoRA fine-tune කරනවා. NeMo Evaluator වලින් benchmark කරනවා. NIM එකක් විදිහට deploy කරලා, NeMo Retriever එක්ක RAG එකක් හදනවා. අන්තිමට NeMo Guardrails දානවා bot එක දේශපාලනය ගැන කතා නොකර තියාගන්න.',
      keyPoints: [
        'NGC = containers, models, Helm charts (nvcr.io).',
        'NVIDIA AI Enterprise = licensed + supported production software suite.',
        'NeMo = generative AI models build/customize කරන framework, Megatron-Core මත.',
        'Curator (data), Customizer (fine-tune), Aligner (RLHF/DPO), Evaluator (eval), Retriever (RAG), Guardrails (runtime safety).',
      ],
      terms: [
        { en: 'NGC Catalog', si: 'NVIDIA GPU-optimized containers, models, Helm charts තියෙන hub එක.' },
        { en: 'NVIDIA AI Enterprise', si: 'Enterprise support සහිත, commercially licensed NVIDIA AI software suite එක.' },
        { en: 'NeMo Framework', si: 'LLMs pretrain, fine-tune, align කරන NVIDIA framework එක.' },
        { en: 'Megatron-LM / Megatron-Core', si: 'Tensor + pipeline + data parallelism එකට දාලා ඉතා ලොකු models train කරන library එක.' },
        { en: 'NeMo Curator', si: 'GPU-accelerated training data curation (filtering, dedup).' },
        { en: 'NeMo Customizer', si: 'Models fine-tune කරන්න NeMo microservice එක.' },
        { en: 'NeMo-Aligner', si: 'Reward models, RLHF (PPO), DPO, SteerLM alignment.' },
        { en: 'NeMo Evaluator', si: 'Benchmarks සහ LLM-as-a-judge evaluations run කරන microservice එක.' },
        { en: 'NeMo Retriever', si: 'Embedding සහ reranking models NIM microservices විදිහට.' },
        { en: 'NeMo Guardrails', si: 'App එක සහ LLM අතර ඉන්න runtime rails toolkit එක (Colang flows). Extra latency එකතු කරනවා.' },
      ],
    },
    {
      id: 'llm-serving-metrics',
      examRefs: ['DEP-047', 'DEP-048', 'DEP-049', 'DEP-050', 'DEP-102'],
      title: 'LLM Serving: Prefill vs Decode, TTFT, TPOT, Throughput, Streaming, Speculative Decoding',
      body: [
        'LLM එකක් answer එකක් හදන්නේ අදියර දෙකකින්. පළවෙනි එක prefill. ඒකේදී prompt එකේ tokens ඔක්කොම එක පාරට (parallel) model එක හරහා යවලා, KV cache එක පුරවලා, පළවෙනි output token එක හදනවා. දෙවෙනි එක decode. ඒකේදී එක පාරකට එක token එක බැගින් හදනවා. Prefill compute-bound (එක weight read එකකට tokens ගොඩක් ගණන් කරනවා). Batch-1 decode memory-bandwidth-bound (හැම token එකකටම weights ඔක්කොම HBM එකෙන් කියවන්න ඕනේ, ගණන් අඩුයි).',
        'TTFT (Time To First Token) = request එක යවපු වෙලාවේ ඉඳන් පළවෙනි token එක එනකම් කාලය. ඒක තීරණය වෙන්නේ ප්‍රධාන වශයෙන් prefill සහ queue එකේ ඉන්න කාලයෙන්. "Bot එක උත්තරේ පටන් ගන්න පරක්කුයි" කියන පැමිණිල්ල TTFT ගැන. TPOT (Time Per Output Token) හෝ inter-token latency = පළවෙනි token එකෙන් පස්සේ tokens දෙකක් අතර සාමාන්‍ය කාලය. ඒක decode වේගය. ගණන් කරන්නේ: (total latency − TTFT) ÷ (tokens − 1).',
        'Latency = එක request එකක් ඉවර වෙන්න යන කාලය. Throughput = තත්පරයකට system එක ඉවර කරන වැඩ ප්‍රමාණය (requests/s හෝ tokens/s). Batch එක ලොකු කරාම throughput වැඩි වෙනවා, ඒත් එක එක request එකේ latency වැඩි වෙනවා. Chat වගේ interactive වැඩ වලට TTFT සහ TPOT වැදගත්. රෑ run වෙන offline batch jobs වලට throughput (cost) වැදගත්.',
        'Streaming කියන්නේ tokens හැදෙන ගමන්ම client එකට යවන එක. OpenAI-compatible API එකක "stream": true දැම්මාම Server-Sent Events (SSE) හරහා data: chunks එනවා, අන්තිමට data: [DONE]. gRPC (HTTP/2 + binary Protocol Buffers) bidirectional streaming support කරනවා, internal service-to-service calls වලට හොඳයි. Browsers වලට REST/JSON + SSE හොඳයි. Streaming එකෙන් generation එක වේගවත් වෙන්නේ නෑ, පේන latency එක (perceived latency) අඩු වෙනවා. Speculative decoding: පොඩි draft model එකක් tokens කිහිපයක් අනුමාන කරනවා, ලොකු model එක ඒවා එකම forward pass එකකින් verify කරනවා. Accept/reject rule එක නිසා output distribution එක ලොකු model එකේම එකයි (lossless). Draft එක නිතර reject වුණොත් speedup එක නැති වෙනවා.',
      ],
      analogy:
        'කොත්තු order එකක් හිතන්න. Prefill කියන්නේ order එක අහලා, ඔක්කොම බඩු එකවර කපලා ලෑස්ති කරන එක. TTFT කියන්නේ ඔයාගේ plate එකට පළවෙනි හැන්ද වැටෙනකම් ඉන්න කාලය. Decode කියන්නේ ඊට පස්සේ හැන්දෙන් හැන්ද plate එකට දාන එක, TPOT කියන්නේ හැඳි දෙකක් අතර කාලය. Throughput කියන්නේ කඩේ පැයකට plates කීයක් දෙනවද කියන එක. Speculative decoding කියන්නේ assistant කෙනෙක් ඊළඟ හැඳි 5 ලෑස්ති කරලා තියනවා, ප්‍රධාන කෝකියා බලලා "ඔව්" කියන ඒවා එක පාරට දානවා.',
      example:
        'Prompt එකේ tokens 8,000යි. Prefill වේගය තත්පරයට tokens 10,000ක් නම් TTFT ≈ 0.8 s. ඊට පස්සේ output tokens 200ක් තත්පරයට tokens 50ක decode වේගයෙන් හදන්න 4 s යනවා. මුළු කාලය ≈ 4.8 s. TPOT = 1 ÷ 50 = 20 ms. Throughput උදාහරණයක්: batch එකේ sequences 32යි, එක decode step එකක් 25 ms නම්, system throughput = 32 ÷ 0.025 = tokens 1,280/s, ඒත් එක user කෙනෙකුට පේන්නේ tokens 40/s විතරයි.',
      keyPoints: [
        'Prefill = prompt එක parallel, compute-bound, TTFT තීරණය කරනවා.',
        'Decode = token එකෙන් එක, memory-bandwidth-bound, TPOT තීරණය කරනවා.',
        'Latency vs throughput trade-off එක batch size එකෙන් පාලනය වෙනවා.',
        'Streaming = SSE (browser/REST) හෝ gRPC streaming. Perceived latency අඩු කරනවා.',
        'Speculative decoding = draft model + verify, lossless speedup, acceptance rate එක මත රඳා පවතී.',
      ],
      terms: [
        { en: 'Prefill', si: 'Prompt tokens ඔක්කොම එකවර process කරලා KV cache එක පුරවන අදියර.' },
        { en: 'Decode', si: 'එක step එකකට එක token එක බැගින් generate කරන අදියර.' },
        { en: 'TTFT', si: 'Time To First Token. Prefill + queueing.' },
        { en: 'TPOT / Inter-token Latency', si: 'පළවෙනි token එකෙන් පස්සේ tokens අතර සාමාන්‍ය කාලය.' },
        { en: 'Throughput', si: 'ඒකක කාලයකට ඉවර කරන requests හෝ tokens ගණන.' },
        { en: 'Server-Sent Events (SSE)', si: 'HTTP response එක open තියාගෙන data: chunks push කරන streaming ක්‍රමය.' },
        { en: 'gRPC', si: 'HTTP/2 + Protocol Buffers. අඩු overhead, bidirectional streaming. Browsers වලට gRPC-Web ඕනේ.' },
        { en: 'Speculative Decoding', si: 'Draft model එකේ අනුමාන ලොකු model එක එක pass එකකින් verify කරන lossless speedup ක්‍රමය.' },
        { en: 'p50 / p99 Latency', si: 'Requests වලින් 50% / 99% ඉවර වුණ කාල සීමාව. p99 = tail latency, maximum එක නෙවෙයි.' },
      ],
    },
    {
      id: 'batching-and-memory-math',
      examRefs: ['DEP-071', 'DEP-072', 'DEP-125', 'DEP-145'],
      title: 'Batching, KV Cache & GPU Memory Calculations',
      body: [
        'Decode එකේදී weights කියවන එක තමයි වියදම. Batching කරාම එකම weight read එක sequences ගොඩකට පාවිච්චි වෙනවා. ඒ නිසා throughput ගොඩක් වැඩි වෙනවා. Static batching වල batch එක fixed. කෙටි උත්තර ඉවර වුණත් batch එකේ දිගම sequence එක ඉවර වෙනකම් ඒ slots හිස්ව බලාගෙන ඉන්නවා. Continuous batching (in-flight batching) වල හැම decode step එකකදීම ඉවර වුණ sequences batch එකෙන් අයින් වෙනවා, අලුත් requests ඇතුළු වෙනවා. ඒ නිසා GPU එක හිස් වෙන්නේ නෑ.',
        'KV cache කියන්නේ කලින් tokens වල key සහ value tensors, හැම attention layer එකකටම, save කරලා තියන තැන. ඒ නිසා අලුත් token එකක් හදද්දී පරණ ඔක්කොම ආයෙත් ගණන් කරන්න ඕනේ නෑ. KV cache එක sequence length එකත් එක්කත්, batch size එකත් එක්කත් linear විදිහට ලොකු වෙනවා. Paged KV cache (PagedAttention) වල KV cache එක fixed-size blocks වලට කඩලා, block table එකකින් map කරනවා. Blocks එකට ළඟ ළඟ තියෙන්න ඕනේ නෑ. ඒ නිසා memory fragmentation නැති තරම්, max length එකට කලින්ම allocate කරන්න ඕනේ නෑ.',
        'Weight memory ගණනය: parameters ගණන × එක parameter එකකට bytes. FP32 = 4, FP16/BF16 = 2, INT8/FP8 = 1, INT4 = 0.5. උදා: 13B × 2 = 26 GB (BF16). 8B INT4 = 8 × 0.5 = 4 GB. මේ weights විතරයි. KV cache සහ activations වලට තව memory ඕනේ. Inference වල optimizer states නෑ, ඒවා training වලට විතරයි.',
        'KV cache size එක වචන වලින්: token එකකට KV bytes = 2 (key එකයි value එකයි) × layers ගණන × KV heads ගණන × head dimension × එක අංකයකට bytes. ඊට පස්සේ ඒක tokens ගණනින් ගුණ කරනවා, ඒ ප්‍රතිඵලය එකවර ඉන්න sequences ගණනින් ගුණ කරනවා. උගුල් දෙකක්: 2 (K සහ V) අමතක කරන එක, සහ GQA model එකක query heads ගණන (උදා: 32) KV heads (උදා: 8) වෙනුවට පාවිච්චි කරන එක. Weight-only INT4 quantization (උදා: AWQ) batch-1 decode එක ගොඩක් වේගවත් කරනවා, මොකද decode memory-bandwidth-bound, weights bytes 4 ගුණයකින් අඩු වුණාම කෙලින්ම කාලය අඩු වෙනවා. ඒත් ලොකු batch prefill එක compute-bound, weights FP16/BF16 වලට dequantize කරලා ගණන් කරන නිසා එතන ලාභය පොඩියි. ලොකු prompt එකක prefill එකක් නිසා අනිත් අයගේ decode එක හිරවෙනවා නම් chunked prefill (prompt එක කෑලි වලට කඩලා decode steps අතර දාන එක) උදව් වෙනවා.',
      ],
      analogy:
        'Static batching කියන්නේ "bus එක පිරෙනකම් යන්නේ නෑ, ඔක්කොම බහිනකම් අලුත් අය ගන්නෙත් නෑ" කියන bus එකක් වගේ. Kandy යන කෙනා බහිනකම් Kadawatha බැහැපු අයගේ seats හිස්. Continuous batching කියන්නේ Colombo city bus එක වගේ, හැම halt එකකම බහින අය බහිනවා, අලුත් අය නගිනවා. Paged KV cache කියන්නේ seats ගාණට ticket දෙනවා මිසක් මුළු bus එකම එක පවුලකට book කරන්නේ නෑ.',
      example:
        'Model එකේ layers 32, KV heads 8, head dimension 128, KV cache FP16 (bytes 2). Token එකකට: 2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KiB. Tokens 4,096ක sequence එකකට: 4,096 × 128 KiB = 512 MiB (≈ 0.5 GB). Weights load කරලා ඉතුරු 40 GB නම්: 40 ÷ 0.5 ≈ sequences 80ක් එකවර. 2 අමතක කළොත් 160 කියලා වැරදි උත්තරයක් එනවා. Static batching උදාහරණය: sequences 4ක, tokens 100, 100, 100, 1,000. Useful වැඩ = 1,300, allocate කරපු slots = 4 × 1,000 = 4,000. Utilization 32.5% විතරයි.',
      code: {
        lang: 'python',
        src: `# KV cache සහ weights memory ගණනය (GB වලින්, ආසන්න වශයෙන්)
layers, kv_heads, head_dim = 32, 8, 128
bytes_per_val = 2            # FP16 = bytes 2
seq_len = 4096

# 2 = key එකයි value එකයි දෙකම
per_token = 2 * layers * kv_heads * head_dim * bytes_per_val
per_seq_gb = per_token * seq_len / 1024**3
print(per_token, "bytes/token")          # 131072
print(round(per_seq_gb, 2), "GB/seq")     # 0.5

free_gb = 40                 # weights වලට පස්සේ ඉතුරු memory
print(int(free_gb / per_seq_gb), "sequences")  # ~80

params_b = 13                # parameters බිලියන 13
print(params_b * 2, "GB weights in BF16")      # 26`,
      },
      keyPoints: [
        'Continuous/in-flight batching = හැම step එකකම join/leave. Static = දිගම එක ඉවර වෙනකම් බලාගෙන ඉන්නවා.',
        'Weights GB ≈ parameters (බිලියන) × bytes per parameter.',
        'KV per token = 2 × layers × KV heads × head dim × bytes.',
        'KV cache = sequence length × batch size අනුව linear.',
        'Paged KV cache = blocks, අඩු fragmentation, waste එක sequence එකකට block එකකට අඩුයි.',
      ],
      terms: [
        { en: 'Static Batching', si: 'Batch එක fixed, දිගම sequence එක ඉවර වෙනකම් අලුත් requests ගන්නේ නෑ.' },
        { en: 'Continuous / In-flight Batching', si: 'Iteration-level scheduling. ඉවර වුණ sequences අයින් වෙලා අලුත් ඒවා හැම step එකකම එනවා.' },
        { en: 'KV Cache', si: 'කලින් tokens වල keys සහ values, හැම layer එකකටම cache කරලා තියන එක.' },
        { en: 'Paged KV Cache / PagedAttention', si: 'KV cache එක non-contiguous fixed-size blocks වල block table එකකින් තියන ක්‍රමය.' },
        { en: 'Grouped-Query Attention (GQA)', si: 'Query heads ගොඩකට KV heads ටිකක් share කරනවා. KV cache එක ඒ අනුපාතයෙන් පොඩි වෙනවා.' },
        { en: 'Chunked Prefill', si: 'දිග prompt එකක prefill එක කෑලි වලට කඩලා decode steps එක්ක මිශ්‍ර කරන එක.' },
        { en: 'Prefix Caching', si: 'Prompts කිහිපයකට පොදු prefix එකේ KV cache එක reuse කරන එක.' },
      ],
    },
    {
      id: 'tensorrt-onnx',
      examRefs: ['DEP-016', 'DEP-038', 'DEP-062', 'DEP-063', 'DEP-084', 'DEP-085', 'DEP-110', 'DEP-120', 'DEP-121', 'DEP-143'],
      title: 'ONNX & TensorRT: Engines, Profiles, Plugins, INT8 Calibration',
      body: [
        'ONNX (Open Neural Network Exchange) කියන්නේ framework එකකට බැඳිලා නැති, standard operators graph එකක් විදිහට model එකක් ලියන open format එක. PyTorch එකෙන් torch.onnx.export කරලා ONNX Runtime හෝ TensorRT එකට දෙන්න පුළුවන්. වැදගත් දෙයක්: dynamic_axes නොදුන්නොත් export එක example input එකේ shape එක (batch size, sequence length) fix කරනවා. dynamic_axes වලින් batch සහ seq dimensions variable කියලා mark කරන්න. Tracing වලින් export කරද්දී data-dependent if/else එකේ trace කරද්දී ගිය branch එක විතරයි graph එකට එන්නේ, ඒ නිසා හැම input එකකටම ඒ branch එකම run වෙනවා. ඒක හදන්න torch.where වගේ tensor ops වලින් ලියන්න, scripting පාවිච්චි කරන්න, නැත්නම් අලුත් dynamo-based exporter එක පාවිච්චි කරන්න. export_params අක්‍රිය කරන්න එපා, එතකොට weights file එකට එන්නේ නෑ.',
        'TensorRT කියන්නේ inference optimizer සහ runtime එකක්. ඒක network එක (බොහෝවිට ONNX හරහා) අරගෙන layer fusion කරනවා (උදා: GEMM + bias + activation එක kernel එකකට), precision තෝරනවා (FP16/INT8/FP8), target GPU එකට වේගවත්ම kernels auto-tune කරලා තෝරනවා, අන්තිමට serialized engine එකක් (.plan) හදනවා. trtexec කියන command-line tool එකෙන් ONNX එකකින් engine එකක් build කරලා benchmark කරන්න පුළුවන්. TensorRT network එක හරහා requests serve කරන්නේ නෑ, ඒක Triton ගේ වැඩේ.',
        'Engine portability: TensorRT engine එක build කරපු GPU architecture එකටයි TensorRT version එකටයි specialize වෙලා. A100 එකේ build කරපු engine එක H100 එකේ load වෙන්නේ නෑ, target hardware එකේ ආයෙත් build කරන්න ඕනේ. (සීමාව architecture සහ version අනුව, එක එක physical card එක අනුව නෙවෙයි.) Optimization profiles: dynamic dimensions වලට min, opt, max shapes දෙනවා. උදා: sequence length min=1, opt=256, max=2048. වැඩිපුර එන shape එකට kernels tune වෙනවා, මුළු range එකම valid.',
        'Plugins: ONNX parser එක TensorRT support නොකරන custom operator එකක් ගැන complain කරොත්, ඒ op එකට TensorRT plugin එකක් (සාමාන්‍යයෙන් CUDA kernel එකක්) ලියලා හෝ තියෙන එකක් register කරනවා. INT8 calibration: post-training INT8 quantization වලදී representative sample inputs ටිකක් network එක හරහා යවලා activations වල value ranges මනිනවා, ඒ අනුව scale factors තෝරනවා. Weights train වෙන්නේ නෑ. Calibration data එක ඇත්ත data එකට සමාන නැත්නම් clipping හෝ නරක resolution එකක් එනවා.',
      ],
      analogy:
        'ONNX කියන්නේ ඕනෑම රටක airport එකක පිළිගන්න standard shipping container එක වගේ. TensorRT කියන්නේ ඒ container එකේ තියෙන බඩු ඔයාගේ නිශ්චිත lorry එකට (GPU එකට) හරියටම ගැළපෙන්න නැවත pack කරන කෙනා. A100 lorry එකට pack කරපු එක H100 lorry එකට දාන්න බෑ, ආයෙත් pack කරන්න ඕනේ. INT8 calibration කියන්නේ මහත්තයාගේ ඇඳුම් size එක මනින්න කලින් ඇත්ත customers ලා කිහිප දෙනෙක්ව මැනලා බලන එක.',
      example:
        'ඔයාගේ BERT classifier එක PyTorch එකෙන් export කරනවා: dynamic_axes={"input_ids": {0: "batch", 1: "seq"}}. ඊට පස්සේ trtexec --onnx=model.onnx --saveEngine=model.plan --fp16 කරනවා. Sequence length 1-2048, ගොඩක් requests 256 tokens ළඟ නම් profile එක min=1, opt=256, max=2048. ඒ engine එක H100 cluster එකේ deploy කරන්න ඕනේ නම් H100 එකකම build කරන්න.',
      keyPoints: [
        'ONNX = framework-neutral format. dynamic_axes නැත්නම් shapes fix වෙනවා.',
        'TensorRT = layer fusion + precision + kernel auto-tuning → serialized engine.',
        'Engine එක GPU architecture + TensorRT version එකට specific.',
        'Optimization profile = dynamic dims වලට min/opt/max. Plugin = unsupported ops වලට.',
        'INT8 calibration = activation ranges මනින්න representative data.',
      ],
      terms: [
        { en: 'ONNX', si: 'Open Neural Network Exchange. Standard operators graph format එක.' },
        { en: 'Dynamic Axes', si: 'ONNX export වල variable විදිහට තියන dimensions (batch, sequence).' },
        { en: 'TensorRT Engine (.plan)', si: 'Specific GPU එකට optimize කරපු serialized inference artifact එක.' },
        { en: 'Layer Fusion', si: 'Operations කිහිපයක් එක kernel එකකට එකතු කරලා memory round trips සහ launches අඩු කරන එක.' },
        { en: 'Optimization Profile', si: 'Dynamic input dimension එකකට min/opt/max shapes.' },
        { en: 'TensorRT Plugin', si: 'TensorRT වලට නැති operator එකක් එකතු කරන custom layer implementation එක.' },
        { en: 'INT8 Calibration', si: 'Sample data වලින් activation ranges මැනලා INT8 scale factors තෝරන එක.' },
        { en: 'trtexec', si: 'ONNX එකකින් engine build කරලා latency/throughput benchmark කරන TensorRT CLI tool එක.' },
      ],
    },
    {
      id: 'tensorrt-llm',
      examRefs: ['DEP-017', 'DEP-058', 'DEP-064', 'DEP-065', 'DEP-122', 'DEP-123', 'DEP-139'],
      title: 'TensorRT-LLM: In-flight Batching, Paged KV Cache, Memory Fraction',
      body: [
        'සාමාන්‍ය TensorRT එක LLMs වලට ඇති වෙන්නේ නෑ. Autoregressive generation වලට KV cache management, token-level batching, multi-GPU sharding ඕනේ. TensorRT-LLM කියන්නේ ඒවා එකතු කරපු inference library එක: optimized attention kernels, paged KV cache, in-flight batching, multi-GPU tensor parallelism. ඒක training tool එකක් නෙවෙයි, GPUs සඳහා inference library එකක්.',
        'සාමාන්‍ය workflow එක: Hugging Face weights download කරනවා → TensorRT-LLM checkpoint එකකට convert කරනවා (ඕනේ නම් මෙතනදී quantize කරනවා) → trtllm-build වලින් engine එක build කරනවා → Triton හරහා serve කරනවා. අලුත් versions වල මේ steps automatic කරන high-level LLM API එකකුත් තියෙනවා. Triton එකේ TensorRT-LLM engines serve කරන්නේ tensorrtllm backend එකෙන්. ඒකේ in-flight batching සහ KV-cache management තියෙනවා.',
        'Build-time limits: max_batch_size, max_num_tokens, max_seq_len engine එක ඇතුළටම bake වෙනවා. Engine එක max_seq_len 4,096 එක්ක build කරලා නම්, 8,192 tokens conversations වලට engine එක ආයෙත් build කරන්න ඕනේ (model එක ඒ context එක support කරනවා නම්), ලොකු KV cache එකට memory තියෙනවද කියලත් බලන්න. Client එකේ max_tokens වැඩි කරලා වැඩක් නෑ.',
        'KV-cache memory fraction: TensorRT-LLM weights load කරලා ඉතුරු free GPU memory එකෙන් ලොකු කොටසක් paged KV-cache pool එකට කලින්ම අල්ලගන්නවා (kv_cache_free_gpu_mem_fraction). ඒ නිසා එකම GPU එකේ පොඩි embedding model එකක් run කරොත් ඒකට OOM එනවා. විසඳුම: ඒ fraction එක අඩු කරන්න (concurrent sequences ටිකක් අඩු වෙනවා), නැත්නම් MIG වලින් models වෙන් කරන්න.',
      ],
      analogy:
        'TensorRT-LLM කියන්නේ සාමාන්‍ය restaurant එකක් (TensorRT) අරගෙන, buffet එකකට ඕනේ විශේෂ දේවල් එකතු කරා වගේ: plates ඉවර වෙන ගමන්ම අලුත් අයව ඇතුළට ගන්නවා (in-flight batching), මේස කෑලි වලට බෙදලා දෙනවා (paged KV cache). KV memory fraction එක කියන්නේ restaurant එක මුළු car park එකෙන් 90%ක් තමන්ගේ customers ලට reserve කරන එක. ළඟ තියෙන පොඩි කඩේට වාහනයක් නවත්තන්න ඉඩ නෑ.',
      example:
        'H100 80 GB එකක 8B model එකක් FP16 වලින් (16 GB) TensorRT-LLM එක්ක run කරනවා. ඉතුරු 64 GB න් 90%ක් (≈ 57 GB) KV pool එකට යනවා. එකම GPU එකේ 4 GB ඕනේ embedding model එකකට ඉඩ නෑ. Fraction එක 0.7 කරාම KV pool එක ≈ 45 GB, embedding model එකට ඉඩ ලැබෙනවා. ඒත් එකවර serve කරන්න පුළුවන් sequences ගණන ටිකක් අඩු වෙනවා.',
      keyPoints: [
        'TensorRT-LLM = TensorRT + LLM features (paged KV, in-flight batching, TP).',
        'HF weights → checkpoint (+quantize) → trtllm-build → Triton (tensorrtllm backend).',
        'max_seq_len, max_batch_size, max_num_tokens = build-time limits. වෙනස් කරන්න rebuild.',
        'kv_cache_free_gpu_mem_fraction අඩු කරාම අනිත් processes වලට memory ඉතුරු වෙනවා.',
      ],
      terms: [
        { en: 'TensorRT-LLM', si: 'NVIDIA GPUs මත LLM inference optimize කරන library එක.' },
        { en: 'In-flight Batching', si: 'TensorRT-LLM ගේ continuous batching එක. Sequences step එකෙන් step එකට join/leave.' },
        { en: 'trtllm-build', si: 'TensorRT-LLM checkpoint එකකින් engine එක build කරන command එක.' },
        { en: 'KV-cache Memory Fraction', si: 'Weights වලින් පස්සේ ඉතුරු free memory එකෙන් KV pool එකට ගන්න කොටස.' },
        { en: 'Multi-LoRA Serving', si: 'එක base model එකක් + LoRA adapters ගොඩක්, request එකෙන් request එකට adapter එක තෝරනවා, එකම batch එකේ mix වෙන්න පුළුවන්.' },
      ],
    },
    {
      id: 'triton-basics',
      examRefs: ['DEP-015', 'DEP-020', 'DEP-021', 'DEP-022', 'DEP-053', 'DEP-054', 'DEP-055', 'DEP-060', 'DEP-113', 'DEP-144'],
      title: 'Triton Inference Server: Model Repository, config.pbtxt, Batching, Ports',
      body: [
        'Triton Inference Server කියන්නේ open-source, multi-framework inference server එකක්. TensorRT, ONNX Runtime, PyTorch, Python වගේ backends වල models HTTP/gRPC හරහා serve කරනවා, dynamic batching සහ concurrent model execution එක්ක. (OpenAI ගේ "Triton" GPU kernel language එක වෙනම project එකක්, නම විතරයි සමාන.) Default ports: 8000 = HTTP/REST, 8001 = gRPC, 8002 = Prometheus metrics.',
        'Model repository layout: <repository>/<model-name>/config.pbtxt සහ numeric version folders. උදා: models/llm_encoder/config.pbtxt සහ models/llm_encoder/1/model.plan. Version folder එක model name folder එකට ඇතුළේ, ඒක අංකයක් වෙන්න ඕනේ. config.pbtxt එකේ max_batch_size > 0 නම් Triton dims වලට පේන්නේ නැති implicit batch dimension එකක් ඉස්සරහින් එකතු කරනවා. ඒ කියන්නේ dims: [ -1 ] ඇත්තටම [batch, seq_len]. max_batch_size: 0 නම් implicit batch dim එකක් නෑ, Triton requests එකතු කරන්නෙත් නෑ, dims කියන්නේ සම්පූර්ණ shape එක.',
        'instance_group එකෙන් model එකේ execution instances කීයක්, කොහෙද තියෙන්නේ කියලා කියනවා. count: 2, kind: KIND_GPU, gpus: [0] කියන්නේ GPU 0 එකේ copies දෙකක්, requests දෙකක් එකවර run වෙනවා. ඒක layers GPUs අතර බෙදන එකක් (model parallelism) නෙවෙයි. Dynamic batcher එක ළඟ ළඟ එන requests ටිකක් පොඩ්ඩක් තියාගෙන (max_queue_delay_microseconds වෙනකම්) එක batch එකකට එකතු කරනවා. Queue delay එක වැඩි කරාම batches ලොකුයි, throughput වැඩියි, ඒත් latency එකත් වැඩියි.',
        'preferred_batch_size: [ 8, 16 ] කියන්නේ batcher එක මේ sizes හදන්න උත්සාහ කරනවා, එකක් හැදුණු ගමන් කලින්ම යවනවා. නැත්නම් queue delay එක ඉවර වුණාම පුළුවන් ලොකුම batch එක යවනවා. අනිත් sizes තාමත් max_batch_size වෙනකම් allowed. Backend එක සමහර sizes වලට විශේෂයෙන් වේගවත් නම් (උදා: TensorRT profiles) මේක ප්‍රයෝජනවත්. ගොඩක් models වලට මේක නොදා queue delay එකට විතරක් තියන එක හොඳට වැඩ කරනවා.',
      ],
      analogy:
        'Triton කියන්නේ Pettah bus stand එක වගේ. Model repository එක කියන්නේ route board එක: route නම (model name), ඊට පහළින් bus අංක (versions). config.pbtxt කියන්නේ bus එකේ නීති පත්‍රය: seats කීයද (max_batch_size), buses කීයක් එකවර දුවනවද (instance_group). Dynamic batcher එක කියන්නේ conductor තත්පර කිහිපයක් බලාගෙන ඉඳලා තව මගීන් ටිකක් නග්ගගෙන යන එක. වැඩි වෙලා බලාගෙන හිටියොත් bus එක පිරෙනවා, ඒත් මගීන්ට පරක්කුයි.',
      example:
        'පහළ config එකේ max_batch_size: 32 සහ input dims: [ -1 ]. Client එකට පේන්නේ [batch, seq_len] shape එකක්, batch 1-32, sequence length variable. instance_group count 2 නිසා GPU 0 එකේ copies දෙකක්. Metrics වල queue time එක ඉහළ යනවා, compute time එක එකම විදිහට තියෙනවා, GPU එකේ memory ඉතුරුයි නම්, instances වැඩි කරන්න හෝ dynamic batching tune කරන්න. Batch එක අඩු කරන එක queue එක තවත් නරක් කරනවා.',
      code: {
        lang: 'text',
        src: `# models/classifier/config.pbtxt
# Folder layout: models/classifier/1/model.onnx
name: "classifier"
platform: "onnxruntime_onnx"
max_batch_size: 32          # > 0 නිසා implicit batch dim එකක් එනවා
input [ { name: "input_ids" data_type: TYPE_INT64 dims: [ -1 ] } ]
output [ { name: "logits" data_type: TYPE_FP32 dims: [ 3 ] } ]

instance_group [ { count: 2 kind: KIND_GPU gpus: [ 0 ] } ]  # GPU 0 එකේ copies 2ක්

dynamic_batching {
  preferred_batch_size: [ 8, 16 ]       # මේ sizes වලට උත්සාහ කරනවා
  max_queue_delay_microseconds: 2000    # උපරිම 2 ms බලාගෙන ඉන්නවා
}`,
      },
      keyPoints: [
        'Ports: 8000 HTTP, 8001 gRPC, 8002 metrics.',
        'Layout: models/<name>/config.pbtxt + models/<name>/<version>/model file.',
        'max_batch_size > 0 = dims වලට ඉස්සරහින් implicit batch dim. 0 = batching නෑ.',
        'instance_group count = එකම model එකේ concurrent copies.',
        'Queue delay වැඩි = throughput වැඩි, latency වැඩි.',
      ],
      terms: [
        { en: 'Triton Inference Server', si: 'Multi-framework open-source model serving runtime එක (HTTP/gRPC).' },
        { en: 'Model Repository', si: 'Model name folders, ඇතුළේ config.pbtxt සහ numeric version folders.' },
        { en: 'config.pbtxt', si: 'Triton model configuration file එක (protobuf text format).' },
        { en: 'max_batch_size', si: 'Batch size උපරිමය. > 0 නම් implicit batch dim එකක් dims වලට ඉස්සරහින්.' },
        { en: 'instance_group', si: 'Model instances ගණන සහ ඒවා තියෙන තැන (GPU/CPU).' },
        { en: 'Dynamic Batcher', si: 'Server එකේ independent requests එකතු කරලා batches හදන scheduler එක.' },
        { en: 'preferred_batch_size', si: 'Dynamic batcher එක හදන්න කැමති batch sizes.' },
        { en: 'max_queue_delay_microseconds', si: 'Batch එකක් හදන්න request එකක් උපරිම බලාගෙන ඉන්න කාලය.' },
      ],
    },
    {
      id: 'triton-advanced',
      examRefs: ['DEP-056', 'DEP-057', 'DEP-059', 'DEP-061', 'DEP-083', 'DEP-103', 'DEP-114', 'DEP-115', 'DEP-116', 'DEP-118', 'DEP-119', 'DEP-148'],
      title: 'Triton Advanced: Sequence Batcher, Decoupled, Ensembles vs BLS, Ops Features',
      body: [
        'Sequence batcher: State තියාගන්න models (උදා: audio chunks අතර hidden state තියාගන්න streaming speech model එකක්) වලට. Correlation ID එකකින් එකම sequence එකේ requests ඔක්කොම එකම model instance එකට යවනවා, start/end control signals එක්ක. Dynamic batcher එක requests independent කියලා හිතලා ඕනෑම instance එකකට යවනවා, ඒ නිසා stateful models වලට ගැළපෙන්නේ නෑ. Decoupled models: Default එකෙන් Triton එක request එකකට හරියටම response එකයි. model_transaction_policy { decoupled: true } දැම්මාම request එකකට responses 0ක් හෝ ගොඩක් යවන්න පුළුවන්. Token by token streaming වලට ඕනේ මේක (gRPC streaming හෝ generate-stream endpoint හරහා).',
        'Ensemble: Models කිහිපයක් (උදා: Python tokenizer → TensorRT encoder → postprocess) static DAG එකකට සම්බන්ධ කරනවා. Client එක call එකයි කරන්නේ, intermediate tensors network එකේ යන්නේ නෑ. ඒත් ensemble එකකට data අනුව branch වෙන්න හෝ loop කරන්න බෑ. BLS (Business Logic Scripting) කියන්නේ Python backend model එකක් ඇතුළේ ඉඳන් අනිත් Triton models call කරන එක, if/else සහ loops එක්ක. Python backend: model.py එකක TritonPythonModel class එකක් (initialize, execute, finalize) ලියලා ඕනෑම Python code එකක් (regex, tokenization) Triton ඇතුළේ run කරන්න පුළුවන්.',
        'Response cache: Request inputs hash කරලා, හරියටම එකම request එක ආයෙත් ආවොත් save කරපු response එක දෙනවා. Deterministic models වලට, එකම inputs නිතර එනවා නම් (උදා: ජනප්‍රිය queries වල embeddings) හොඳයි. Temperature 0.8 වගේ sampling කරන LLM එකකට hits නැති තරම්. ඒක LLM එකේ KV cache එකත් නෙවෙයි. Model warmup: model_warmup in config.pbtxt එකෙන් load වෙද්දීම synthetic requests යවනවා. ඒ නිසා deploy එකෙන් පස්සේ පළවෙනි requests slow වෙන්නේ නෑ.',
        'Version policy: Default එක latest { num_versions: 1 }, ඒ කියන්නේ ලොකුම අංකය තියෙන version එක විතරයි serve වෙන්නේ. Versions කිහිපයක් ඕනේ නම් all {} හෝ specific { versions: [2, 3] }, client එක /v2/models/<name>/versions/<v>/infer එකට යවනවා. Hot-loading: --model-control-mode=explicit දාලා POST /v2/repository/models/<name>/load වගේ API calls වලින් server එක restart නොකර models load/unload කරනවා. none mode එකේ startup එකේදී ඔක්කොම load කරලා පස්සේ වෙනස්කම් ignore කරනවා. poll mode එකකුත් තියෙනවා. Readiness probe එකට GET /v2/health/ready (port 8000). /v2/health/live එක liveness වලට. Metrics (port 8002) වල queue time, compute time වගේ දේවල් තියෙනවා. Triton Model Analyzer එක instance count, batch size, dynamic batching settings sweep කරලා latency limit එකක් ඇතුළේ හොඳම config එක හොයනවා.',
      ],
      analogy:
        'Ensemble එක කියන්නේ factory එකක fixed conveyor belt එකක් වගේ: කපනවා → පාට කරනවා → pack කරනවා, හැම වෙලේම එකම පිළිවෙළ. BLS කියන්නේ supervisor කෙනෙක්: "මේක රතු නම් A machine එකට, නිල් නම් B එකට, QC fail නම් ආයෙත් යවන්න." Sequence batcher එක කියන්නේ එකම patient ව හැම වෙලේම එකම doctor ට යවන එක, මොකද doctor ළඟ තියෙන්නේ ඒ patient ගේ file එක. Response cache එක කියන්නේ කඩේ මුදලාලි "කිරි පැකට් එකක් කීයද?" කියන ප්‍රශ්නයට කට පාඩමින් උත්තර දෙන එක.',
      example:
        'Pipeline එකක්: පොඩි classifier එකකින් ප්‍රශ්නය "billing" ද "technical" ද කියලා බලනවා, ඒ අනුව LLM දෙකෙන් එකකට යවනවා, validation model එක accept කරනකම් loop කරනවා. Branch සහ loop තියෙන නිසා ensemble එකක් බෑ, BLS ඕනේ. Folders 1/, 2/, 3/ තියෙනවා, version_policy නෑ නම් serve වෙන්නේ 3 විතරයි. Kubernetes readiness probe එක /v2/health/ready වලට දැම්මොත් models load වෙනකම් traffic එන්නේ නෑ.',
      keyPoints: [
        'Sequence batcher = stateful models, correlation ID, එකම instance.',
        'Decoupled = request එකකට responses ගොඩක් (token streaming).',
        'Ensemble = static DAG. BLS = Python එකෙන් conditionals/loops.',
        'Response cache = exact repeat inputs වලට විතරයි. Warmup = cold start latency අඩු කරනවා.',
        'Default version policy = latest 1. Hot-load = explicit model control mode. Ready probe = /v2/health/ready.',
      ],
      terms: [
        { en: 'Sequence Batcher', si: 'Correlation ID අනුව sequence එකක requests එකම instance එකට යවන stateful scheduler එක.' },
        { en: 'Decoupled Model', si: 'Request එකකට responses 0ක් හෝ ගොඩක් යවන්න පුළුවන් Triton model mode එක.' },
        { en: 'Ensemble Model', si: 'Models කිහිපයක outputs → inputs map කරපු server-side static pipeline (DAG) එක.' },
        { en: 'BLS (Business Logic Scripting)', si: 'Python backend එකේ ඉඳන් අනිත් models call කරන, control flow සහිත ක්‍රමය.' },
        { en: 'Python Backend', si: 'model.py එකේ TritonPythonModel (initialize/execute/finalize) ලියලා Python code serve කරන backend එක.' },
        { en: 'Response Cache', si: 'එකම inputs වලට කලින් response එක ආපහු දෙන Triton cache එක.' },
        { en: 'Model Warmup', si: 'Load වෙද්දී synthetic requests යවලා lazy initialization ඉවර කරන එක.' },
        { en: 'Version Policy', si: 'latest (default, 1), all, specific: කුමන versions serve කරනවද.' },
        { en: 'Model Control Mode', si: 'none / poll / explicit. Explicit = API එකෙන් load/unload (hot-loading).' },
        { en: 'Readiness vs Liveness', si: '/v2/health/ready = inference වලට ready ද. /v2/health/live = process එක ජීවත්ද.' },
        { en: 'Triton Model Analyzer', si: 'Triton configs sweep කරලා constraints යටතේ හොඳම ඒවා report කරන tool එක (Perf Analyzer පාවිච්චි කරනවා).' },
      ],
    },
    {
      id: 'nim-microservices',
      examRefs: ['DEP-014', 'DEP-067', 'DEP-068', 'DEP-069', 'DEP-070', 'DEP-149'],
      title: 'NVIDIA NIM: Optimized Inference Microservices',
      body: [
        'NIM (NVIDIA Inference Microservice) කියන්නේ model එකක්, optimized inference engine එකක් සහ standard API එකක් එකට pack කරපු prebuilt container එකක්. එක container එකක් run කරලා model එක deploy කරන්න පුළුවන්. LLM NIMs OpenAI-compatible routes දෙනවා, උදා: /v1/chat/completions, /v1/models. ඒ නිසා දැනට openai Python client එක පාවිච්චි කරන code එකක base_url එක NIM endpoint එකට (උදා: http://localhost:8000/v1) මාරු කරලා model name එක දැම්මාම ඇති.',
        'Optimized profiles: LLM NIM එකක් start වෙද්දී detect කරපු GPU එකට සහ configuration එකට (උදා: tensor-parallel layout) ගැළපෙන prebuilt optimized profile එකක් (engine + settings) automatically තෝරනවා. ගැළපෙන එකක් නැත්නම් generic backend එකකට fallback වෙනවා. ඔයාට engines build කරන්න ඕනේ නෑ. LLM NIM සහ TensorRT-LLM multi-LoRA serving support කරනවා: එක base model එකක් load කරලා request එකෙන් request එකට LoRA adapter එක තෝරනවා.',
        'NIM pull කිරීම: NIM images තියෙන්නේ NGC registry එකේ (nvcr.io). docker login nvcr.io කරලා, NGC_API_KEY environment variable එක container එකට දෙන්න ඕනේ, model assets download කරන්න. ඒක නැත්නම් authorization error එකක් එනවා. Host එකේ full CUDA toolkit එක ඕනේ නෑ, driver එකයි container toolkit එකයි ඇති. Reverse proxy එකක් හරහා NIM streaming කරද්දී ඔක්කොම අන්තිමට එකපාර එනවා නම්, proxy එක response buffer කරනවා. උදා: NGINX වල proxy_buffering off.',
        'NIM vs Triton: NIM = packaged, optimized, supported model එකක් standard API එකක් එක්ක, ඉක්මනින් deploy කරන්න. Triton = custom, mixed pipelines වලට. උදා: ONNX vision model + Python preprocessing + XGBoost model එක ensemble එකක. ඒ වගේ heterogeneous pipeline එකකට කෙලින්ම Triton තමයි හොඳ. (NIM සහ Triton දෙකම NVIDIA AI Enterprise එකේ කොටස්.)',
      ],
      analogy:
        'NIM කියන්නේ Pizza Hut එකෙන් ගෙන්වන ready-made pizza එක වගේ: box එක ඇරලා කන්න විතරයි, ඔයාගේ oven එකට (GPU එකට) ගැළපෙන විදිහට කලින්ම හදලා. Triton කියන්නේ ඔයාගේම කුස්සිය, ඕනෑම කෑමක් ඕනෑම විදිහකට මිශ්‍ර කරලා හදන්න පුළුවන්, ඒත් වැඩ වැඩියි. NGC API key එක කියන්නේ delivery එක ගන්න ඕනේ order number එක.',
      example:
        'ඔයාගේ app එක දැනට OpenAI API එක call කරනවා. Company data එළියට යවන්න බැරි නිසා Llama NIM එකක් local H100 එකක run කරනවා: docker login nvcr.io, NGC_API_KEY දාලා docker run --gpus all. Container එක H100 එකට ගැළපෙන profile එක තෝරනවා. Code එකේ base_url="http://localhost:8000/v1" කරලා model name එක වෙනස් කළා. වෙන කිසිම වෙනසක් ඕනේ නෑ.',
      keyPoints: [
        'NIM = model + optimized engine + OpenAI-compatible API, එක container එකක.',
        'Startup එකේදී GPU එකට ගැළපෙන optimized profile එක auto-select කරනවා.',
        'Pull කරන්න NGC API key ඕනේ (nvcr.io).',
        'Packaged LLM → NIM. Custom mixed pipeline → Triton.',
      ],
      terms: [
        { en: 'NVIDIA NIM', si: 'Prebuilt, optimized inference microservice container එක, standard APIs එක්ක.' },
        { en: 'NIM Optimized Profile', si: 'Specific GPU + TP layout එකකට prebuilt engine සහ settings.' },
        { en: 'NGC API Key', si: 'nvcr.io එකෙන් images සහ model assets ගන්න authentication key එක.' },
        { en: 'OpenAI-compatible Endpoint', si: '/v1/chat/completions වගේ routes. OpenAI client code එක base_url මාරු කරලා පාවිච්චි කරන්න පුළුවන්.' },
      ],
    },
    {
      id: 'scaling-llm-serving',
      examRefs: ['DEP-051', 'DEP-086', 'DEP-089', 'DEP-090', 'DEP-091', 'DEP-092', 'DEP-093', 'DEP-094', 'DEP-095', 'DEP-099', 'DEP-104', 'DEP-112', 'DEP-117', 'DEP-136', 'DEP-137', 'DEP-138', 'DEP-147', 'DEP-150'],
      title: 'Scaling LLM Serving: Little\'s Law, Replicas, Load Balancing, Autoscaling',
      body: [
        'Little\'s law කියන්නේ සරල සම්බන්ධයක්: system එකේ එකවර ඉන්න requests ගණන = තත්පරයට එන requests ගණන × එක request එකක් system එකේ ඉන්න සාමාන්‍ය කාලය. (L = λ × W. L = එකවර ඉන්න ගණන, λ = arrival rate, W = සාමාන්‍ය කාලය.) මේකෙන් ඔයාට concurrency එක, ඒ නිසා batch size එකයි KV cache capacity එකයි plan කරන්න පුළුවන්. බෙදන්න එපා, ගුණ කරන්න.',
        'Replicas ගණන: peak traffic එක × (1 + headroom) ÷ එක replica එකකට SLO එක ඇතුළේ handle කරන්න පුළුවන් requests/s, ඊට පස්සේ උඩට round කරන්න. Load test එකෙන් batch size තෝරද්දී latency SLO එක රකින ගමන් වැඩිම throughput එක දෙන setting එක ගන්න. Concurrency වැඩි කරද්දී throughput එක පැතලි වෙලා latency එක දෙගුණ වෙනවා නම් server එක saturate වෙලා.',
        'Load balancing: LLM requests වල වියදම ගොඩක් වෙනස් (tokens 10ක් vs 4,000ක්). ඒ නිසා round-robin වලින් සමහර replicas වල දිග queues, සමහර ඒවා නිකන්. Least-outstanding-requests හෝ load/KV-cache-aware routing හොඳයි. Prompt prefix එක cache එකේ තියෙන replica එකට යවන prefix-aware routing එකෙන් prefix-cache hits වැඩි වෙනවා. Client පැත්තෙන් prompts එකින් එක යවනවා නම් GPU එක නිකන් ඉන්නවා. Async client එකකින් concurrency limit එකක් එක්ක එකවර යවන්න, එතකොට server එකට continuous batching කරන්න පුළුවන්.',
        'Autoscaling: GPU-Util ටිකක් load එකකටත් 100% ළඟට යන නිසා demand එක track කරන්න හොඳ signal එකක් නෙවෙයි. Queued/pending requests හෝ replica එකකට KV-cache utilization හොඳයි. Kubernetes HPA එකට GPU metrics ගන්න සාමාන්‍ය පාර: DCGM Exporter → Prometheus → Prometheus Adapter (custom metrics). Scale-to-zero කරාම GPU cost අඩුයි, ඒත් පළවෙනි request එකට ලොකු cold start (images pull, weights load, engines warm). Minimum warm replica එකක් තියන්න හෝ weights persistent volume එකක cache කරන්න.',
        'Kubernetes probes: weights download/load කරන්න විනාඩි 6ක් යන LLM pod එකක liveness probe එක කලින්ම fire වුණොත් Kubernetes container එක kill කරලා restart loop එකක් හැදෙනවා. විසඳුම startup probe එකක් (හෝ දිග initial delay එකක්) දාන එක, සහ weights persistent volume එකක cache කරන එක. Readiness probe එක අයින් කරන එක වැරදියි, එතකොට ready නැති pod එකට traffic යනවා. Alerts වලට හොඳම signals: request error rate, p95/p99 latency (TTFT එකත් එක්ක), queue depth, GPU memory/utilization. p99 = 4.5 s කියන්නේ requests වලින් 99%ක් 4.5 s ඇතුළේ ඉවරයි, slowest 1% ඊට වඩා යනවා (maximum එක නෙවෙයි). BLEU වගේ reference-based scores live traffic එකට බෑ, ඒවා offline evaluation වලට.',
        'Rollouts: Canary = production traffic එකෙන් පොඩි % එකක් අලුත් version එකට යවලා metrics බලලා ටික ටික වැඩි කරන එක. Blue-green = පරිසර දෙකක් (blue පරණ, green අලුත්) පැත්තකින් පැත්තට තියලා router එක එකපාර මාරු කරන එක, rollback එකත් එකපාර ආපහු මාරු කරලා. Shadow (mirrored) = live requests වල copies අලුත් model එකට යවනවා, ඒකේ responses log කරනවා විතරයි, users ට දෙන්නේ නෑ (user impact බිංදුවයි, ඒත් extra compute). Canary උගුලක්: 1% traffic විනාඩි 10ක errors 0යි, baseline 0.2%යි කියලා promote කරන්න එපා. Requests සිය ගණනක errors 0ක් දකින එක සාමාන්‍යයි, sample එක පොඩි වැඩියි. දිගට හෝ වැඩි traffic එකකින් run කරලා, එකම කාල කවුළුවේ baseline එක්ක සසඳන්න. Self-host vs API cost: self-host cost per million = GPU පැයක මිල ÷ (tokens/s × 3,600 × utilization ÷ 1,000,000). Utilization එක අමතක කරන එක පොදු වැරැද්ද.',
      ],
      analogy:
        'Little\'s law එක Cargills cashier queue එකකින් තේරුම් ගන්න. විනාඩියකට customers 4 දෙනෙක් එනවා, එක්කෙනෙක් කඩේ ඇතුළේ සාමාන්‍යයෙන් විනාඩි 10ක් ඉන්නවා නම්, ඕනෑම වෙලාවක කඩේ ඇතුළේ 4 × 10 = 40ක් ඉන්නවා. Load balancing කියන්නේ cashier ලා අතර "එක්කෙනාට එක්කෙනා" බෙදන්නේ නැතුව, බඩු අඩුවෙන් තියෙන queue එකට යවන එක, මොකද එක trolley එකක බඩු 2ක්, තව එකක 200ක්.',
      example:
        'LLM service එකට තත්පරයට requests 20ක් එනවා, එකක් සාමාන්‍යයෙන් 3 s. Little\'s law: 20 × 3 = 60 requests එකවර. Replicas: load test එකේ replica එකක් SLO එක ඇතුළේ 12 req/s. Peak 100 req/s, headroom 20%: 100 × 1.2 = 120. 120 ÷ 12 = replicas 10. Cost: GPU එක පැයට $4, 2,000 tokens/s නම්, පැයට 2,000 × 3,600 = tokens මිලියන 7.2. Million එකකට ≈ $0.56. GPU එක 50%ක් විතරක් busy නම් ඇත්ත cost එක දෙගුණයි. තව එකක්: GPU පැය $3, peak 3,000 tokens/s, 50% busy නම් පැයට 1,500 × 3,600 = මිලියන 5.4, million එකකට ≈ $0.56. API එක million එකට $0.50 නම් API එක ටිකක් ලාබයි (100% කියලා හිතුවොත් $0.28 කියලා වැරදි උත්තරයක් එනවා).',
      keyPoints: [
        'Little\'s law: එකවර requests = arrival rate × සාමාන්‍ය කාලය.',
        'Replicas = peak × (1 + headroom) ÷ replica capacity, round up.',
        'LLM load balancing = least-outstanding / KV-aware / prefix-aware, round-robin නෙවෙයි.',
        'Autoscale on queue depth හෝ KV-cache utilization, GPU-Util මත නෙවෙයි.',
        'දිග load එකක් තියෙන pods වලට startup probe එකක්. Traffic යවන්නේ readiness probe එක pass වුණාම විතරයි.',
        'Canary = ටික ටික. Blue-green = එකපාර switch. Shadow = users ට බලපෑමක් නෑ. පොඩි canary sample එකකින් තීරණ ගන්න එපා.',
      ],
      terms: [
        { en: 'Little\'s Law', si: 'L = λ × W. එකවර ඉන්න ගණන = arrival rate × system එකේ ඉන්න කාලය.' },
        { en: 'Replica', si: 'Model server එකේ එකම copy එකක් (pod එකක්).' },
        { en: 'Least-outstanding-requests Routing', si: 'දැනට අඩුම වැඩ තියෙන replica එකට request එක යවන load balancing ක්‍රමය.' },
        { en: 'Prefix-aware Routing', si: 'එකම prompt prefix එකේ KV cache එක තියෙන replica එකට යවන එක.' },
        { en: 'Cold Start', si: 'අලුත් replica එකක් ready වෙන්න images, weights load කරන්න යන ලොකු කාලය.' },
        { en: 'Canary / Blue-green / Shadow', si: 'Canary = පොඩි % traffic. Blue-green = පරිසර දෙකක් අතර එකපාර switch. Shadow = copies යවලා output log කරනවා, users ට දෙන්නේ නෑ.' },
        { en: 'Startup Probe', si: 'Container එක start වෙලා ඉවර වෙනකම් liveness checks කල් දාන Kubernetes probe එක.' },
        { en: 'p95 / p99 Latency', si: 'Requests වලින් 95% / 99% ඉවර වුණ කාලය. Tail latency. p50 සහ p99 අතර ලොකු පරතරයක් = queuing හෝ දිග generations.' },
        { en: 'Cost per Million Tokens', si: 'GPU පැයක මිල ÷ පැයකට ඇත්තටම හදන tokens මිලියන ගණන (utilization එකත් එක්ක).' },
      ],
    },
    {
      id: 'gpu-operations',
      examRefs: ['DEP-031', 'DEP-033', 'DEP-035', 'DEP-036', 'DEP-037', 'DEP-046', 'DEP-073', 'DEP-074', 'DEP-087', 'DEP-088', 'DEP-096', 'DEP-098', 'DEP-109', 'DEP-128', 'DEP-129', 'DEP-130', 'DEP-135', 'DEP-140', 'DEP-146'],
      title: 'GPU Operations: MIG, GPU Operator, DCGM, nvidia-smi, Nsight, Jetson',
      body: [
        'MIG (Multi-Instance GPU): A100 හෝ H100 එකක් isolated instances 7ක් දක්වා කඩනවා. හැම instance එකකටම තමන්ගේම SMs, L2 cache, memory hardware එකෙන්ම වෙන් කරලා. ඒ නිසා එක tenant කෙනෙක්ගේ load එක අනිත් අයව slow කරන්නේ නෑ, memory කියවන්නත් බෑ. A100 80GB එකක 1g.10gb instances උපරිමය 7යි (80 ÷ 10 = 8 නෙවෙයි, compute slices 7යි). Time-slicing වලින් GPU එකක් pods කිහිපයකට share කරනවා, ඒත් memory හෝ fault isolation නෑ. එක pod එකකට අනිත් අයගේ memory ඉවර කරන්න, latency නරක් කරන්න පුළුවන්. CUDA MPS (Multi-Process Service) වලින් processes කිහිපයක kernels එකවර run වෙනවා, ඒත් isolation MIG ට වඩා දුර්වලයි.',
        'Kubernetes වල: NVIDIA device plugin එක nvidia.com/gpu කියන resource එක advertise කරනවා. Pod එකක් resources.limits: nvidia.com/gpu: 1 කියලා ඉල්ලනවා. මේක integer එකක්, 0.5 දාන්න බෑ, share කරන්න ඕනේ නම් MIG හෝ time-slicing. NVIDIA GPU Operator එක nodes වල GPU software stack එක automatic install කරලා manage කරනවා: driver, container toolkit, device plugin, GPU feature discovery, DCGM Exporter, MIG manager. Triton වගේ apps ඒකේ කොටසක් නෙවෙයි, ඒවා ඔයා උඩින් deploy කරනවා.',
        'DCGM (Data Center GPU Manager) = cluster එකේ GPUs monitor කරන්න, health check කරන්න, diagnose කරන්න. Utilization, memory, power, errors වගේ telemetry DCGM Exporter එකෙන් Prometheus වලට යවනවා. Uncorrectable ECC errors හෝ Xid errors වැඩි වෙනවා නම් node එක cordon/drain කරලා DCGM diagnostics run කරන්න, hardware එක repair කරන්න. nvidia-smi = shell එකෙන් GPU එකක memory, utilization, temperature, power, processes ඉක්මනට බලන්න. GPU-Util කියන්නේ "අඩුම තරමේ එක kernel එකක් හරි run වුණ කාලයේ ප්‍රතිශතය". ඒ නිසා SMs ටිකක් විතරක් පාවිච්චි කරන පොඩි kernels වලටත් 100% පෙන්නන්න පුළුවන්. 100% කියන්නේ GPU එක සම්පූර්ණයෙන් පාවිච්චි වෙනවා කියන එක නෙවෙයි.',
        'Profiling: Nsight Systems (nsys) = මුළු application එකේ timeline එක (CPU threads, CUDA API calls, kernels, memory copies, idle gaps). පටන් ගන්න තැන මේක. Nsight Compute (ncu) = එක kernel එකක් ගැඹුරින් (occupancy, memory throughput, stall reasons). Workflow: nsys වලින් hotspot එක හොයනවා → ncu වලින් ඒ kernel එක විශ්ලේෂණය කරනවා. Jetson (උදා: Jetson Orin) = robots, devices වලට power-efficient embedded computer එකක්, integrated GPU එකක් එක්ක. Network නැති තැන්, data එළියට යවන්න බැරි තැන් වලට හොඳයි. Jetson වල CPU සහ GPU එකම physical memory එක share කරනවා (unified memory), ඒ නිසා OS, weights, KV cache ඔක්කොම එකම budget එකට හරියන්න ඕනේ. පොඩි, quantize කරපු models පාවිච්චි කරන්නේ ඒ නිසා. Edge vs cloud: data device එකෙන් එළියට යවන්න බැරි, network එක නිතර නැති වෙන, local latency සීමා තද තැන් වලට edge. ලොකුම models serve කරන්නත්, හදිසි traffic spikes දරාගන්නත් cloud හොඳයි. nvidia-smi topo -m කියන්නේ GPUs අතර interconnect topology matrix එක, usage නෙවෙයි.',
      ],
      analogy:
        'MIG කියන්නේ ලොකු ගෙයක් වෙනම දොරවල්, වෙනම මීටර් එක්ක annex 7කට කඩලා කුලියට දෙනවා වගේ. Time-slicing කියන්නේ එකම කාමරය පැය ගාණට මාරුවෙන් දෙනවා වගේ, කලින් හිටපු කෙනා බඩු දාලා ගියොත් ඊළඟ කෙනාට ඉඩ නෑ. nvidia-smi GPU-Util 100% කියන්නේ "කඩේ open" කියන board එක වගේ. Open කියලා කඩේ පිරිලා කියන එක නෙවෙයි. Nsight Systems කියන්නේ CCTV footage එක, Nsight Compute කියන්නේ එක කෝකියෙක්ගේ වැඩ slow-motion එකෙන් බලන එක.',
      example:
        'Tenants 20ක, හැම model එකකටම 10 GB ට අඩුවෙන් ඕනේ. එකිනෙකාගේ load එකෙන් බලපෑම් වෙන්න බෑ. විසඳුම: A100 80GB GPUs MIG 1g.10gb instances 7 බැගින් කඩලා tenants ලට දෙන්න. තව උදාහරණයක්: nvidia-smi --query-gpu=memory.used,utilization.gpu --format=csv -l 5 වලින් තත්පර 5න් 5ට CSV log එකක්. "CUDA out of memory" ආවොත් nvidia-smi processes section එක බලන්න. පරණ notebook kernel එකක් 60 GB අල්ලගෙන ඉන්නවා නම් ඒක නවත්තන්න.',
      keyPoints: [
        'MIG = hardware isolation, instances 7ක් දක්වා. Time-slicing = isolation නෑ.',
        'GPU Operator = driver, toolkit, device plugin, DCGM exporter, MIG manager automate කරනවා.',
        'DCGM = fleet monitoring/diagnostics. nvidia-smi = ඉක්මන් snapshot.',
        'GPU-Util 100% ≠ GPU එක full. Nsight Systems → Nsight Compute.',
        'Jetson = edge, unified memory.',
      ],
      terms: [
        { en: 'MIG (Multi-Instance GPU)', si: 'එක GPU එකක් dedicated compute + memory සහිත isolated instances 7ක් දක්වා කඩන එක.' },
        { en: 'Time-slicing', si: 'GPU එක workloads අතර කාලය අනුව මාරු කරන sharing ක්‍රමය. Memory isolation නෑ.' },
        { en: 'CUDA MPS', si: 'Processes කිහිපයක kernels shared server context එකක් හරහා එකවර run කරන service එක.' },
        { en: 'NVIDIA Device Plugin', si: 'Kubernetes වලට nvidia.com/gpu resource එක advertise කරන component එක.' },
        { en: 'NVIDIA GPU Operator', si: 'Kubernetes nodes වල GPU software stack එක install/lifecycle-manage කරන operator එක.' },
        { en: 'DCGM / DCGM Exporter', si: 'Data Center GPU Manager. GPU telemetry, health, diagnostics. Exporter එක Prometheus වලට.' },
        { en: 'nvidia-smi', si: 'GPU memory, utilization, temperature, processes පෙන්වන CLI tool එක.' },
        { en: 'Nsight Systems (nsys)', si: 'System-wide timeline profiler එක.' },
        { en: 'Nsight Compute (ncu)', si: 'Kernel-level ගැඹුරු profiler එක (occupancy, stalls).' },
        { en: 'Jetson', si: 'Edge AI වලට NVIDIA embedded modules (උදා: Orin). CPU+GPU unified memory.' },
      ],
    },
    {
      id: 'pytorch-inference-practicalities',
      examRefs: ['DEP-023', 'DEP-024', 'DEP-025', 'DEP-045', 'DEP-075', 'DEP-076', 'DEP-078', 'DEP-080', 'DEP-131'],
      title: 'PyTorch Inference: eval(), no_grad, Devices, Autocast, Timing, OOM',
      body: [
        'model.eval() සහ torch.no_grad() දෙක දෙකක්. model.eval() එකෙන් dropout සහ batch normalization වගේ layers inference behaviour එකට මාරු කරනවා (dropout drop කරන්නේ නෑ, batch norm running statistics පාවිච්චි කරනවා). ඒකෙන් gradients නතර වෙන්නේ නෑ. torch.no_grad() එකෙන් autograd graph එක record කරන්නේ නෑ, ඒ නිසා backward වලට activations save වෙන්නේ නෑ, memory සහ compute අඩුයි. ඒත් layers වල behaviour එක වෙනස් කරන්නේ නෑ. Inference වලට දෙකම ඕනේ. torch.inference_mode() කියන්නේ no_grad ට වඩා තද, ටිකක් වේගවත් version එකක් (ඒකේ tensors පස්සේ autograd වලට පාවිච්චි කරන්න බෑ).',
        'Device mismatch: tokenizer එක දෙන්නේ CPU tensors. Model එක cuda එකේ නම් inputs ත් cuda වලට යවන්න ඕනේ. PyTorch තනියම data move කරන්නේ නෑ. වැදගත් උගුලක්: tensor එකක x.to("cuda") in-place නෙවෙයි, අලුත් tensor එකක් return කරනවා, x = x.to("cuda") කියලා ලියන්න ඕනේ. (nn.Module.to() නම් in-place.) Device-agnostic code: device = torch.device("cuda" if torch.cuda.is_available() else "cpu").',
        'Autocast / mixed precision: torch.autocast(device_type="cuda", dtype=torch.float16 හෝ torch.bfloat16) ඇතුළේ ops ආරක්ෂිත තැන් වලදී අඩු precision එකෙන් run වෙනවා, Tensor Cores පාවිච්චි වෙනවා. FP16 training වල GradScaler එක loss එක scale කරලා පොඩි gradients බිංදුවට වැටෙන එක (underflow) නවත්තනවා. BF16 වල FP32 range එක තියෙන නිසා සාමාන්‍යයෙන් GradScaler ඕනේ නෑ.',
        'GPU code එක time කරන හැටි: CUDA kernels asynchronous විදිහට launch වෙනවා. Python line එක return වෙන්නේ GPU එක වැඩේ ඉවර කරන්න කලින්. ඒ නිසා clock එක කියවන්න කලින් torch.cuda.synchronize() call කරන්න (හෝ CUDA events), warm-up iterations ටිකකුත් කරන්න. නැත්නම් ඔයා මනින්නේ launch time එක විතරයි. Unexpected OOM: (1) nvidia-smi එකේ වෙනත් පරණ process එකක් memory අල්ලගෙන ඉන්නවද බලන්න. (2) no_grad නැතුව inference කරනවද. (3) TensorRT-LLM වගේ engine එකක් KV pool එකට memory කලින්ම අල්ලගත්තද. (4) batch size හෝ sequence length එක KV cache එකට ලොකු වැඩිද.',
      ],
      analogy:
        'model.eval() කියන්නේ cricket player කෙනෙක් practice net එකෙන් match එකට මාරු වෙනවා වගේ, දැන් අත්හදා බැලීම් (dropout) නෑ. no_grad කියන්නේ match එකේ video record කරන්නේ නැතුව සෙල්ලම් කරනවා වගේ, පස්සේ analysis (backward) එකක් නැති නිසා memory card එක පිරෙන්නේ නෑ. synchronize නැතුව time කරන එක කියන්නේ ලියුමක් post box එකට දාපු වෙලාව "ලියුම ලැබුණු වෙලාව" කියලා ලියනවා වගේ.',
      example:
        'Synchronize නැතුව model(x) time කරාම 0.3 ms කියලා පෙන්නනවා. ඇත්තටම GPU එක 25 ms ගන්නවා. torch.cuda.synchronize() දාලා, iterations 3ක් warm-up කරලා මැන්නාම හරි අගය 25 ms එනවා. පහළ code එකේ eval, inference_mode, autocast, synchronize ඔක්කොම එකට තියෙනවා.',
      code: {
        lang: 'python',
        src: `import time, torch

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model = torch.nn.Linear(512, 10).to(device)   # Module.to() in-place
model.eval()                                  # dropout/batchnorm inference mode
x = torch.randn(8, 512).to(device)            # inputs ත් එකම device එකට

with torch.inference_mode(), torch.autocast(device_type=device.type, dtype=torch.bfloat16):
    for _ in range(3):                        # warm-up
        model(x)
    if device.type == "cuda":
        torch.cuda.synchronize()              # GPU එක ඉවර වෙනකම් ඉන්න
    start = time.time()
    y = model(x)
    if device.type == "cuda":
        torch.cuda.synchronize()
print(y.shape, f"{(time.time() - start) * 1000:.2f} ms")  # (8, 10)`,
      },
      keyPoints: [
        'eval() = layer behaviour. no_grad/inference_mode = autograd off. දෙකම ඕනේ.',
        'tensor.to() in-place නෙවෙයි. Inputs සහ model එකම device එකේ.',
        'FP16 → GradScaler. BF16 → සාමාන්‍යයෙන් ඕනේ නෑ.',
        'GPU timing = warm-up + torch.cuda.synchronize().',
        'OOM නම් මුලින්ම nvidia-smi processes බලන්න.',
      ],
      terms: [
        { en: 'model.eval()', si: 'Submodules වල training=False කරනවා. Dropout off, batch norm running stats.' },
        { en: 'torch.no_grad()', si: 'Block එක ඇතුළේ gradient tracking off.' },
        { en: 'torch.inference_mode()', si: 'no_grad ට වඩා තද, autograd bookkeeping ත් skip කරන mode එක.' },
        { en: 'Device Mismatch Error', si: 'Model එක GPU එකේ, inputs CPU එකේ (හෝ අනිත් පැත්ත) නිසා එන error එක.' },
        { en: 'torch.autocast', si: 'Ops automatic විදිහට FP16/BF16 වලින් run කරන mixed precision context එක.' },
        { en: 'GradScaler', si: 'FP16 gradient underflow නවත්තන්න loss එක scale කරන tool එක.' },
        { en: 'torch.cuda.synchronize()', si: 'GPU එකේ queue වෙලා තියෙන වැඩ ඉවර වෙනකම් CPU එක නවත්තන call එක.' },
      ],
    },
    {
      id: 'pytorch-training-tooling',
      examRefs: ['DEP-026', 'DEP-039', 'DEP-040', 'DEP-041', 'DEP-042', 'DEP-043', 'DEP-044', 'DEP-077', 'DEP-079', 'DEP-081', 'DEP-082', 'DEP-106', 'DEP-107', 'DEP-108', 'DEP-132', 'DEP-133', 'DEP-134'],
      title: 'PyTorch & Hugging Face Tooling: Autograd, DataLoader, torch.compile, Accelerate, Checkpoints',
      body: [
        'Dataset එකකින් කියන්නේ එක sample එකක් ගන්න හැටි (__len__, __getitem__). DataLoader එක ඒක wrap කරලා batches හදනවා: batch_size, shuffle, collate_fn, num_workers. Nsight Systems එකේ GPU එක නිකන් ඉන්න gaps තියෙනවා, ඒ වෙලාවේ main CPU thread එක images decode/augment කරනවා නම්, GPU එක data loading නිසා බඩගින්නේ (starved). විසඳුම: num_workers > 0 (worker processes වලින් batches parallel විදිහට හදනවා) සහ pin_memory=True (page-locked memory නිසා host-to-device copies වේගවත්). pin_memory එක්ක .to("cuda", non_blocking=True) දැම්මාම copy එක compute එකත් එක්ක overlap වෙනවා.',
        'torch.compile(model) කියන්නේ TorchDynamo වලින් Python operations graphs විදිහට අල්ලගෙන, backend එකකින් (default TorchInductor) fused kernels generate කරන එක. පළවෙනි calls slow, මොකද එතකොට compile වෙනවා. අලුත් input shape එකක් ආවාම guards කැඩිලා recompilation එකක් වෙන්න පුළුවන්, ඒකෙන් තත්පර ගණන් latency spikes එනවා. විසඳුම: dynamic=True, නැත්නම් inputs fixed lengths ටිකකට (buckets) pad කරලා ඒවා warm-up කරන්න. LLM engines decode step එක CUDA Graphs වලින් capture කරනවා, kernels සිය ගණනක් එක launch එකකින් replay කරලා CPU launch overhead එක අයින් කරන්න.',
        'Hugging Face Accelerate: එකම PyTorch training loop එක CPU, එක GPU, GPUs ගොඩක්, nodes ගොඩක් මත (mixed precision එක්ක) පොඩි code වෙනස්කම් වලින් run කරන්න. Accelerator.prepare() එක model, optimizer, dataloaders wrap කරනවා. from_pretrained(..., device_map="auto") කියන්නේ layers GPUs අතර (ඕනේ නම් CPU එකටත්) බෙදලා model එක fit කරන එක. ඒත් layers එකින් එක sequential run වෙන නිසා එක වෙලාවකට එක GPU එකයි වැඩ. ඒක tensor parallelism නෙවෙයි.',
        'Checkpoint formats: pickle-based .bin/.pt files load කරද්දී file එකේ තියෙන code run වෙන්න පුළුවන් (supply-chain risk). .safetensors වල තියෙන්නේ raw tensors සහ metadata විතරයි, code run වෙන්නේ නෑ, zero-copy memory mapping නිසා load එක වේගවත්. (Compression format එකක් නෙවෙයි.) PyTorch recommend කරන්නේ torch.save(model.state_dict(), "model.pt") කරලා, පස්සේ model class එක හදලා load_state_dict කරන එක. මුළු module එකම pickle කරාම code refactor කරාම කැඩෙනවා.',
        'PyTorch මූලික දේවල් තුනක්: (1) Autograd: w = torch.tensor(3.0, requires_grad=True), loss = w ** 2, loss.backward() කරාම w.grad = 2 × w = 6. backward call කරලා නැත්නම් හෝ requires_grad False නම් grad එක None. (2) backward() gradients .grad එකට එකතු (accumulate) කරනවා, ඒ නිසා හැම step එකකම optimizer.zero_grad() call කරන්න ඕනේ. නැත්නම් පරණ gradients අලුත් ඒවට එකතු වෙනවා. (3) nn.Module එකක් model(x) විදිහට call කරාම __call__ හරහා forward එක run වෙනවා, registered hooks එක්ක. model.forward(x) කෙලින්ම වැඩ කරනවා, ඒත් hooks skip වෙනවා. Linear(512, 10) එකකට (8, 512) input එකක් දුන්නොත් output එක (8, 10).',
        'Hugging Face මූලික දේවල්: pipeline("sentiment-analysis") කියන්නේ default model එකක්, tokenizer එක, pre/post-processing එකට bundle කරපු high-level inference wrapper එකක් (label සහ score දෙනවා, train කරන්නේ නෑ). Text generation වලට AutoTokenizer සහ AutoModelForCausalLM (generate() support කරන LM head එක). AutoModelForSequenceClassification = classification head, AutoModelForMaskedLM = BERT වගේ masked models. datasets.load_dataset("imdb") Hub එකෙන් data Apache Arrow format එකෙන් download කරලා cache කරනවා (map, filter තියෙනවා). Disk එකට ලොකු වැඩි dataset එකකට load_dataset(..., streaming=True), ඒකෙන් IterableDataset එකක් එනවා, records iterate කරද්දී කියවනවා.',
      ],
      analogy:
        'DataLoader workers කියන්නේ කොත්තු කඩේ එළවළු කපන අතුරු කෝකියෝ වගේ. ප්‍රධාන කෝකියා (GPU) තනියම එළවළු කපනවා නම් තාච්චිය නිකන් රත් වෙනවා. Helpers 4ක් දැම්මාම කොටන එක නවතින්නේ නෑ. torch.compile කියන්නේ අලුත් route එකක පළවෙනි දවසේ පාර හොයාගෙන යනවා (slow), පස්සේ දවස් වල කෙලින්ම යනවා. පාර වෙනස් වුණොත් ආයෙත් හොයන්න ඕනේ. safetensors කියන්නේ seal කරපු සහල් ගෝනියක්, pickle කියන්නේ ඇතුළේ මොනවා තියෙනවද දන්නේ නැති parcel එකක්.',
      example:
        'Training step එකක් 200 ms, ඒකෙන් 120 ms GPU එක data එනකම් බලාගෙන. num_workers=8, pin_memory=True දැම්මාම step එක 90 ms ට අඩු වෙනවා. Hugging Face එකෙන් third-party model එකක් ගන්නවා නම් model.safetensors file එක තෝරන්න, pytorch_model.bin එක නෙවෙයි.',
      keyPoints: [
        'GPU starved by data loading → num_workers > 0, pin_memory=True.',
        'torch.compile = first call slow, shapes වෙනස් වුණාම recompile.',
        'Accelerate = එකම loop එක ඕනෑම hardware setup එකක.',
        'device_map="auto" = fit කරනවා, ඒත් sequential (TP නෙවෙයි).',
        'safetensors = ආරක්ෂිත, ඉක්මන්. state_dict save කරන්න.',
      ],
      terms: [
        { en: 'DataLoader', si: 'Dataset එකක් batches වලට හරවන, shuffle සහ parallel workers සහිත iterator එක.' },
        { en: 'num_workers', si: 'Batches parallel විදිහට හදන worker processes ගණන.' },
        { en: 'pin_memory', si: 'Page-locked host memory. Async, වේගවත් GPU copies.' },
        { en: 'torch.compile', si: 'TorchDynamo + TorchInductor වලින් fused kernels හදන PyTorch compiler එක.' },
        { en: 'Recompilation', si: 'අලුත් shapes නිසා guards කැඩිලා ආයෙත් compile වීම.' },
        { en: 'CUDA Graphs', si: 'Kernels sequence එකක් එක launch එකකින් replay කරන ක්‍රමය. Static shapes ඕනේ.' },
        { en: 'Hugging Face Accelerate', si: 'Distributed/mixed precision training පොඩි code වෙනස්කම් වලින් කරන්න library එක.' },
        { en: 'safetensors', si: 'Raw tensors විතරක් තියෙන, code execute නොවෙන, memory-mappable weights format එක.' },
        { en: 'state_dict', si: 'Model එකේ parameters සහ buffers dictionary එක. Save කරන්න recommend කරන ක්‍රමය.' },
        { en: 'Autograd / backward()', si: 'Gradients automatic ගණනය කරලා .grad එකට එකතු කරන PyTorch system එක.' },
        { en: 'optimizer.zero_grad()', si: 'Gradients accumulate වෙන නිසා හැම step එකකම .grad clear කරන call එක.' },
        { en: 'nn.Module __call__ vs forward', si: 'module(x) = forward + hooks. module.forward(x) = hooks skip.' },
        { en: 'pipeline()', si: 'Model + tokenizer + pre/post-processing bundle කරපු Hugging Face inference wrapper එක.' },
        { en: 'AutoModelForCausalLM', si: 'Next-token prediction head එක තියෙන, generate() කරන්න පුළුවන් decoder-only model class එක.' },
        { en: 'load_dataset / streaming=True', si: 'Hub එකෙන් Arrow-backed Dataset එකක් load කරනවා. streaming=True = download නොකර IterableDataset එකක්.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Hopper (H100) architecture එකෙන් මුලින්ම ආපු, layer එකෙන් layer එකට scaling බලාගෙන FP8 training/inference කරන්න දෙන feature එක මොකක්ද?',
      options: ['TF32 mode', 'Transformer Engine', 'NVSwitch', 'Multi-Instance GPU'],
      answer: 1,
      why: 'Transformer Engine සහ FP8 Tensor Cores ආවේ Hopper එකෙන්. TF32 සහ BF16 ආවේ Ampere (A100) එකෙන්. A100 වල native FP8 නෑ.',
    },
    {
      q: 'Triton config.pbtxt එකක max_batch_size: 16 සහ input dims: [ -1 ] තියෙනවා. Client එක යවන්න ඕනේ input tensor එකේ shape එක මොකක්ද?',
      options: [
        '[-1] විතරයි, batch dimension එකක් නෑ',
        '[batch, seq_len], batch 1-16, sequence length variable',
        '[16, -1], batch එක හැම වෙලේම 16ම වෙන්න ඕනේ',
        '[seq_len, 16]',
      ],
      answer: 1,
      why: 'max_batch_size > 0 නම් Triton dims වලට ඉස්සරහින් පේන්නේ නැති implicit batch dimension එකක් එකතු කරනවා. Batch එක 16 වෙනකම් ඕනෑම size එකක් වෙන්න පුළුවන්.',
    },
    {
      q: 'Chat app එකේ users ලා "bot එක උත්තරේ පටන් ගන්න පරක්කුයි" කියනවා, ඒත් මුළු response time එක හොඳයි. ඒ පැමිණිල්ල හොඳටම පෙන්නන metric එක සහ ඒක තීරණය කරන අදියර මොකක්ද?',
      options: [
        'TPOT, decode අදියර',
        'TTFT, prefill අදියර (සහ queueing)',
        'Cluster throughput, decode අදියර',
        'p50 latency, tokenization',
      ],
      answer: 1,
      why: 'TTFT = පළවෙනි token එක එනකම් කාලය. ඒක තීරණය වෙන්නේ prompt එක process කරන prefill එකෙන් සහ queue එකේ ඉන්න කාලයෙන්. TPOT කියන්නේ ඊට පස්සේ tokens අතර කාලය.',
    },
    {
      q: 'Model එකේ layers 32, KV heads 8, head dimension 128, KV cache FP16. Tokens 4,096ක එක sequence එකකට ආසන්න KV cache එක කීයද?',
      options: ['256 MiB', '512 MiB', '1 GiB', '2 GiB'],
      answer: 1,
      why: 'Token එකකට 2 (K,V) × 32 × 8 × 128 × 2 bytes = 131,072 bytes = 128 KiB. 4,096 × 128 KiB = 512 MiB. 2 අමතක කරොත් 256 MiB කියලා වැරදි උත්තරයක් එනවා.',
    },
    {
      q: 'A100 එකක build කරපු TensorRT engine එකක් එකම container එකේ H100 node එකක load වෙන්නේ නෑ. හේතුව මොකක්ද?',
      options: [
        'H100 වල TensorRT support නෑ',
        'Engine එක build කරපු GPU architecture එකටයි TensorRT version එකටයි specialize වෙලා, target GPU එකේ rebuild කරන්න ඕනේ',
        'Engine files physical GPU serial number එකට lock වෙලා',
        'ONNX file එක delete වෙලා',
      ],
      answer: 1,
      why: 'TensorRT build එකේදී target GPU එකට kernels තෝරලා tune කරනවා. ඒ නිසා engines architecture සහ version අතර portable නෑ. සීමාව architecture අනුව, එක එක card එක අනුව නෙවෙයි.',
    },
    {
      q: 'Tenants ගොඩකගේ පොඩි models (10 GB ට අඩු) A100 GPUs මත run කරන්න ඕනේ. එක tenant කෙනෙක්ගේ load එක අනිත් අයට බලපාන්න හෝ memory කියවන්න බෑ. හොඳම විසඳුම?',
      options: [
        'Time-slicing වලින් pods 4ක් එක GPU එකක',
        'MIG වලින් GPU එක isolated instances වලට කඩලා tenants ලට දෙන එක',
        'Tensor parallelism 8',
        'nvidia.com/gpu: 0.5 කියලා pod spec එකේ දාන එක',
      ],
      answer: 1,
      why: 'MIG හැම instance එකකටම dedicated SMs, cache, memory දෙනවා, isolation එක hardware එකෙන්. Time-slicing වල memory/fault isolation නෑ. nvidia.com/gpu integer එකක් නිසා 0.5 reject වෙනවා.',
    },
    {
      q: 'LLM service එකකට තත්පරයට requests 20ක් එනවා, එක request එකක් සාමාන්‍යයෙන් තත්පර 3ක් system එකේ ඉන්නවා. Little\'s law අනුව ඕනෑම වෙලාවක එකවර ඉන්න requests ආසන්න ගණන?',
      options: ['6.7', '23', '60', '600'],
      answer: 2,
      why: 'L = λ × W = 20 × 3 = 60. 6.7 එන්නේ ගුණ කරනවා වෙනුවට බෙදුවොත්.',
    },
    {
      q: 'Inference script එකක model.eval() call කරලා තියෙනවා, ඒත් torch.no_grad() නෑ. මොකද වෙන්නේ?',
      options: [
        'Dropout තාමත් active, outputs random',
        'Layers inference mode එකේ, ඒත් autograd graph එක record වෙන නිසා අනවශ්‍ය memory සහ compute යනවා',
        'Model එක automatic CPU එකට යනවා',
        'කිසිම වෙනසක් නෑ, eval() එකෙන් gradients ත් නතර වෙනවා',
      ],
      answer: 1,
      why: 'eval() dropout/batch norm behaviour එක වෙනස් කරනවා, autograd නතර කරන්නේ නෑ. Gradient tracking නවත්තන්න no_grad() හෝ inference_mode() ඕනේ.',
    },
  ],
}
