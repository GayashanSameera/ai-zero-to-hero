export default {
  "id": "nvidia",
  "number": 9,
  "title": "NVIDIA AI Stack & LLM Serving",
  "titleSi": "NVIDIA AI platform: from GPU hardware to serving language models",
  "summary": "Learn how NVIDIA GPU hardware, CUDA libraries, model optimization and serving systems work together. This phase covers GPU architecture and precision, multi-GPU communication, TensorRT, Triton, NIM, LLM serving metrics, batching, memory planning, operations, and PyTorch tooling for NVIDIA NCA-GENL preparation.",
  "duration": "4-6 weeks",
  "topics": [
    {
      "id": "gpu-hardware-basics",
      "examRefs": [
        "DEP-001",
        "DEP-002",
        "DEP-003",
        "DEP-004"
      ],
      "title": "GPU Hardware: CUDA Cores, Tensor Cores, SMs, Warps, HBM",
      "body": [
        "A GPU is a chip designed to perform many similar operations in parallel. CPUs have fewer, more complex cores; GPUs have many simpler execution units. Matrix multiplication is common in AI, so this parallel design makes GPUs useful for AI workloads.",
        "A GPU contains Streaming Multiprocessors (SMs). Each SM has CUDA cores, Tensor Cores, registers, and shared memory, and hardware schedules thread blocks onto SMs. Threads execute in groups of 32 called warps; threads in a warp execute the same instruction together. NVIDIA warps have 32 threads; AMD wavefronts commonly have 64.",
        "CUDA cores handle general scalar and vector arithmetic. Tensor Cores are compute units, not memory: they perform matrix multiply-accumulate operations on small tiles, often using FP16, BF16, or FP8 inputs with higher-precision accumulation. They accelerate GEMM operations common in Transformers.",
        "A100 and H100 data-center GPUs use High Bandwidth Memory (HBM): stacked DRAM close to the GPU die, connected through a wide interface for very high bandwidth. Many gaming GPUs use GDDR memory instead. Shared memory is small, on-chip SRAM inside an SM; it is not HBM."
      ],
      "analogy": "Imagine a large kottu shop. Each SM is a kitchen, CUDA cores are cooks handling individual calculations, and a Tensor Core is a machine that quickly mixes a small matrix-sized batch. A warp is 32 cooks following the same instruction. HBM is the nearby warehouse connected by a wide road.",
      "example": "A thread block with 1,024 threads is scheduled as 1,024 ÷ 32 = 32 warps. A block size divisible by 32, such as 128, 256, or 512, avoids unused lanes. A block of 100 uses four warps, with 100 − 96 = 4 threads in the last warp and 28 inactive lanes.",
      "keyPoints": [
        "SMs contain compute units and on-chip resources; thread blocks are scheduled onto SMs.",
        "A warp is 32 NVIDIA threads executing together.",
        "CUDA cores handle general arithmetic; Tensor Cores accelerate matrix multiply-accumulate.",
        "HBM is stacked high-bandwidth memory; shared memory is on-chip SRAM, and GDDR is a different memory type."
      ],
      "terms": [
        {
          "en": "CUDA Core",
          "si": "A GPU execution unit for general scalar and vector arithmetic."
        },
        {
          "en": "Tensor Core",
          "si": "A specialized compute unit for matrix multiply-accumulate operations."
        },
        {
          "en": "Streaming Multiprocessor (SM)",
          "si": "A GPU hardware unit that schedules and runs thread blocks."
        },
        {
          "en": "Warp",
          "si": "A group of 32 NVIDIA threads that execute together."
        },
        {
          "en": "HBM",
          "si": "High Bandwidth Memory: stacked DRAM close to a GPU die with a wide interface."
        },
        {
          "en": "GEMM",
          "si": "General Matrix Multiply, a common operation in transformer layers."
        }
      ],
      "si": "ඔයා GPU එක Colombo කෑම කඩයක කුස්සියක් වගේ හිතන්න. SM එකක් කුස්සියක්, CUDA cores සාමාන්‍ය වැඩ කරන කෝකියෝ, Tensor Core එක නම් plate ගොඩකට එකවර කොත්තු දාන machine එකක් වගේ. Warp එකක කෝකියෝ 32 දෙනා එකම instruction එකට වැඩ කරනවා. HBM කියන්නේ කුස්සිය ළඟ තියෙන ලොකු ගබඩාව; shared memory නම් කුස්සිය ඇතුළේ පොඩි shelf එකක්."
    },
    {
      "id": "gpu-generations-precision",
      "examRefs": [
        "DEP-005",
        "DEP-006",
        "DEP-007",
        "DEP-124",
        "DEP-126"
      ],
      "title": "GPU Generations & Number Precisions (FP32, TF32, FP16, BF16, INT8, FP8)",
      "body": [
        "NVIDIA data-center GPU families indicate their architecture: V100 is Volta, A100 is Ampere, H100 is Hopper, and B200 is Blackwell. Volta introduced Tensor Cores; Ampere added TF32 and BF16 Tensor Core support; Hopper introduced FP8 Tensor Cores and Transformer Engine; Blackwell adds a second-generation Transformer Engine and FP4 support. Do not mix up A100/Ampere and H100/Hopper.",
        "Precision describes how many bits represent a value. FP32 uses 4 bytes; FP16 and BF16 use 2; INT8 and FP8 use 1; INT4 and FP4 use half a byte per value. Lower precision can reduce memory use and increase speed, but may reduce numerical accuracy.",
        "FP16 and BF16 both use 16 bits. BF16 has the same exponent range as FP32 but fewer mantissa bits (7 versus FP16’s 10), so it can represent very large and very small magnitudes and is less prone to gradient underflow. Ampere TF32 accelerates FP32 matrix multiplication on Tensor Cores while accumulating in FP32; PyTorch FP32 matmuls do not use TF32 by default, and torch.set_float32_matmul_precision(\"high\") enables it.",
        "Transformer Engine is NVIDIA hardware and software for adapting per-layer scaling so FP8 can be used in training and inference. NeMo and Megatron-LM can use it for FP8 training. A100 has no native FP8 Tensor Cores; it supports options such as INT8 or weight-only INT4 instead. FP8 is supported on Ada Lovelace (L40S), Hopper (H100), and Blackwell (B200) GPUs."
      ],
      "analogy": "Precision is like a weighing scale. FP32 is a fine jeweller’s scale, FP16/BF16 a regular shop scale, and INT8/FP8 a coarse scale. You do not need jeweller-level precision to weigh 50 kg of rice. BF16 can cover both very large sacks and tiny packets, but gives fewer decimal details.",
      "example": "For a 7-billion-parameter model, approximate weight storage is: FP32, 7B × 4 bytes = 28 GB; FP16/BF16, 7B × 2 = 14 GB; INT8/FP8, 7B × 1 = 7 GB; INT4, 7B × 0.5 = 3.5 GB. Native FP8 requires supported hardware such as H100; A100 users can consider INT8 or weight-only INT4.",
      "keyPoints": [
        "Architecture order: Volta/V100, Ampere/A100, Hopper/H100, Blackwell/B200.",
        "Ampere adds TF32 and BF16 support; Hopper adds FP8 and Transformer Engine; Blackwell adds FP4.",
        "BF16 has FP32’s exponent range; FP16 training may need gradient scaling.",
        "A100 does not have native FP8 Tensor Cores."
      ],
      "terms": [
        {
          "en": "Volta / Ampere / Hopper / Blackwell",
          "si": "NVIDIA GPU architecture generations used by V100, A100, H100, and B200, respectively."
        },
        {
          "en": "Transformer Engine",
          "si": "NVIDIA technology that uses per-layer scaling for low-precision formats such as FP8."
        },
        {
          "en": "TF32",
          "si": "An Ampere-era format for accelerating FP32 matrix multiplication on Tensor Cores."
        },
        {
          "en": "FP16 / BF16",
          "si": "16-bit floating-point formats; BF16 has a wider exponent range than FP16."
        },
        {
          "en": "INT8 / FP8",
          "si": "8-bit integer and floating-point formats, respectively."
        }
      ],
      "si": "ඔයාට 7B parameter model එකක් තියෙනවා නම් FP32 weights වලට 28 GB යනවා: 7 × 4 = 28. FP16 හෝ BF16 කළොත් 7 × 2 = 14 GB; INT8 කළොත් 7 GB; INT4 කළොත් 3.5 GB. Bits අඩු වුණාම memory අඩුවෙනවා, ඒත් නිරවද්‍යතාවට බලපෑමක් වෙන්න පුළුවන්. A100 එක Ampere, H100 එක Hopper; FP8 සඳහා H100 වගේ GPU එකක් ඕනේ."
    },
    {
      "id": "multi-gpu-networking",
      "examRefs": [
        "DEP-009",
        "DEP-028",
        "DEP-029",
        "DEP-030",
        "DEP-032",
        "DEP-066",
        "DEP-105",
        "DEP-127",
        "DEP-141",
        "DEP-142"
      ],
      "title": "Multi-GPU: NVLink, NVSwitch, InfiniBand, GPUDirect RDMA, NCCL, DGX vs HGX",
      "body": [
        "A large language model may not fit on one GPU, so multiple GPUs must exchange data efficiently. NVLink is a high-speed connection between GPUs inside a server (node), with substantially more bandwidth than PCIe.",
        "NVSwitch connects GPUs through a switch fabric, enabling an eight-GPU system to communicate all-to-all at NVLink bandwidth. Across nodes or racks, systems can use InfiniBand with RDMA. GPUDirect RDMA transfers data directly between GPU memory and a network adapter, avoiding an intermediate CPU-memory copy and reducing CPU work and latency.",
        "NCCL (NVIDIA Collective Communications Library) implements operations such as all-reduce, all-gather, reduce-scatter, and broadcast. Data-parallel training uses all-reduce to combine gradients; NCCL is PyTorch Distributed’s default GPU backend. For a collective that hangs, inspect NCCL_DEBUG=INFO logs, selected interface and topology, NCCL_SOCKET_IFNAME, firewall rules, and InfiniBand connectivity. A precision change will not fix a connectivity failure.",
        "DGX is a complete NVIDIA-built AI system with software and support. HGX is a multi-GPU baseboard platform that server partners such as Dell and Supermicro integrate into their systems. Tensor parallelism communicates within every layer, so keep it inside a fast NVLink node when possible; use pipeline or data parallelism across nodes. For example, use TP=8 on a node and PP=2 across two nodes."
      ],
      "analogy": "NVLink is like doors between rooms in one house; NVSwitch is a central hall connecting every room. InfiniBand is a highway between towns. GPUDirect RDMA is loading a delivery truck directly from a warehouse instead of carrying goods through the living room. NCCL is a class monitor collecting everyone’s marks and sharing the average.",
      "example": "A 70B model in FP16 needs about 70B × 2 = 140 GB for weights, more than one 80 GB GPU. TP=2 uses about 70 GB of weights per GPU; TP=4 or TP=8 leaves more room for KV cache. Keep an eight-way TP group on an NVSwitch node; splitting it across slower Ethernet nodes makes each layer’s all-reduce wait on the network.",
      "keyPoints": [
        "NVLink is a fast intra-node GPU link; NVSwitch provides an all-to-all fabric.",
        "InfiniBand and RDMA connect nodes; GPUDirect RDMA avoids a host-memory copy.",
        "NCCL provides collective operations; use NCCL_DEBUG=INFO when diagnosing hangs.",
        "DGX is a complete NVIDIA system; HGX is a GPU baseboard platform for server partners.",
        "Prefer TP within a node; PP or DP can span nodes."
      ],
      "terms": [
        {
          "en": "NVLink",
          "si": "A high-bandwidth, low-latency interconnect between GPUs and some CPUs."
        },
        {
          "en": "NVSwitch",
          "si": "Switch chips that connect GPUs in a node through an NVLink fabric."
        },
        {
          "en": "InfiniBand",
          "si": "A high-bandwidth, low-latency network commonly used between compute nodes."
        },
        {
          "en": "GPUDirect RDMA",
          "si": "Direct data transfer between GPU memory and a network adapter without a host-memory copy."
        },
        {
          "en": "NCCL",
          "si": "NVIDIA Collective Communications Library for GPU collectives such as all-reduce."
        },
        {
          "en": "NCCL hang",
          "si": "A collective operation that stops progressing, often due to connectivity or interface problems."
        },
        {
          "en": "DGX vs HGX",
          "si": "DGX is a complete NVIDIA system; HGX is a GPU platform integrated by server vendors."
        },
        {
          "en": "Data / Tensor / Pipeline Parallelism",
          "si": "DP splits data across model copies; TP splits layer computation; PP assigns layer stages to devices."
        }
      ],
      "si": "70B model එකක FP16 weights විතරක් 70 × 2 = 140 GB වෙනවා, ඒ නිසා 80 GB GPU එකකට තනිවම දාන්න බෑ. TP=2 කළොත් GPU එකකට weights 70 GB පමණ බෙදෙනවා. NVLink කියන්නේ එක server එකේ GPU අතර ඉක්මන් පාර; InfiniBand කියන්නේ servers අතර පාර. ඔයා NCCL hang එකක් දැක්කොත් network interface සහ connectivity logs බලන්න, precision මාරු කරලා විසඳෙන්නේ නෑ."
    },
    {
      "id": "cuda-libraries-rapids",
      "examRefs": [
        "DEP-008",
        "DEP-010",
        "DEP-019",
        "DEP-027",
        "DEP-034",
        "DEP-052",
        "DEP-097"
      ],
      "title": "CUDA, cuDNN, cuBLAS & RAPIDS (cuDF, cuML, Spark, XGBoost, cuVS)",
      "body": [
        "CUDA is NVIDIA’s parallel-computing platform and programming model, including language extensions, the nvcc compiler, runtime and driver APIs, and libraries. PyTorch is a framework that uses CUDA and its libraries underneath.",
        "cuBLAS implements dense linear algebra and GEMM; cuDNN provides deep-neural-network primitives such as convolutions, normalization, and attention. Frameworks call these libraries. Remember: cuBLAS is general linear algebra, cuDNN is neural-network operations, and NCCL communicates between GPUs.",
        "CUDA runtime libraries can be inside a container, but the kernel driver comes from the host and must be new enough for that runtime. If the driver is insufficient, upgrade the host driver or use a compatible older CUDA image. Docker sees GPUs only when the host has NVIDIA Container Toolkit and the container is run with --gpus all.",
        "RAPIDS brings data-science workloads to GPUs: cuDF offers a pandas-like dataframe API, cuML scikit-learn-like ML algorithms, and cuGraph graph analytics. RAPIDS Accelerator for Apache Spark accelerates supported SQL/DataFrame operations. XGBoost 2.0+ uses device=\"cuda\" and tree_method=\"hist\" for GPU training (older releases used gpu_hist). cuVS provides GPU vector search and clustering, including CAGRA and IVF variants, useful for building vector indexes in RAG. cuGraph supplies graph analytics. cuDF also offers cudf.pandas accelerator mode for some existing pandas code. The RAPIDS Spark plugin runs supported SQL and DataFrame operations on the GPU without requiring substantial job-code changes."
      ],
      "analogy": "CUDA is the language and road system for communicating with the GPU. cuBLAS and cuDNN are ready-made recipe books; PyTorch is a restaurant using those recipes. RAPIDS is like replacing a tuk-tuk with a train for large pandas-style data jobs.",
      "example": "If pandas preprocessing on a 50 GB log file takes hours, cuDF or cudf.pandas may run similar operations on a GPU in less time, depending on hardware and workload. You can then cluster embeddings with cuML KMeans and build a vector index with cuVS CAGRA.",
      "keyPoints": [
        "CUDA is NVIDIA’s platform; PyTorch is a framework built to use it.",
        "cuBLAS handles linear algebra; cuDNN supplies neural-network primitives.",
        "The host driver must support the container’s CUDA runtime.",
        "cuDF is pandas-like, cuML is scikit-learn-like, and cuVS supports vector search."
      ],
      "terms": [
        {
          "en": "CUDA",
          "si": "NVIDIA parallel-computing platform and programming model."
        },
        {
          "en": "cuBLAS",
          "si": "NVIDIA library for GPU dense linear algebra and GEMM."
        },
        {
          "en": "cuDNN",
          "si": "Library of deep-learning primitives such as convolution and normalization."
        },
        {
          "en": "NVIDIA Container Toolkit",
          "si": "Software that exposes NVIDIA GPUs to containers."
        },
        {
          "en": "cuDF",
          "si": "RAPIDS GPU dataframe library with a pandas-like API."
        },
        {
          "en": "cuML",
          "si": "RAPIDS GPU machine-learning library with a scikit-learn-like API."
        },
        {
          "en": "RAPIDS Accelerator for Apache Spark",
          "si": "Plugin that accelerates supported Spark SQL and DataFrame operations on GPUs."
        },
        {
          "en": "GPU-accelerated XGBoost",
          "si": "XGBoost GPU training, configured in current versions with device=\"cuda\" and tree_method=\"hist\"."
        },
        {
          "en": "cuVS",
          "si": "RAPIDS GPU library for vector search and clustering."
        }
      ],
      "si": "ඔයාගේ pandas code එක 50 GB log file එකක පැය ගණන් ගන්නවා කියලා හිතන්න. cuDF හෝ cudf.pandas දාලා GPU එකේ ඒ වැඩ ඉක්මන් කරන්න පුළුවන්, workload එකට අනුව. පස්සේ embeddings 10,000ක් cuML KMeans වලින් group කරලා, cuVS වලින් vector index එකක් හදන්න පුළුවන්. CUDA කියන්නේ GPU platform එක; PyTorch කියන්නේ ඒක භාවිතා කරන framework එක."
    },
    {
      "id": "nvidia-software-platform",
      "examRefs": [
        "DEP-011",
        "DEP-012",
        "DEP-013",
        "DEP-018",
        "DEP-100",
        "DEP-101",
        "DEP-111"
      ],
      "title": "NGC, NVIDIA AI Enterprise, NeMo & Megatron-LM",
      "body": [
        "The NGC catalog is NVIDIA’s tested software hub, with GPU-optimized containers (including PyTorch, NeMo, and Triton), pretrained models, Helm charts, and other resources. Images come from nvcr.io. NGC PyTorch images package compatible, tested CUDA, cuDNN, NCCL, and PyTorch versions, often with year-month tags. NGC is not a managed Kubernetes service: run its contents on your own infrastructure or cloud, and still provide a host driver.",
        "NVIDIA AI Enterprise is a commercially licensed, supported software suite for production, including NVIDIA AI frameworks and tools, microservices such as NIM, security updates, and enterprise support. It is software, not hardware, and is not a free fork.",
        "NeMo is NVIDIA’s framework for building, training, and customizing generative models through pretraining, fine-tuning, and alignment. It is built on Megatron-Core. Megatron-LM popularized practical intra-layer tensor parallelism and combines tensor, pipeline, and data parallelism for very large models.",
        "NeMo components serve different stages: Curator extracts, filters, and deduplicates training data, with GPU acceleration via RAPIDS; Customizer fine-tunes models such as with LoRA; NeMo-Aligner supports reward-model training, PPO-based RLHF, DPO, and SteerLM; Evaluator runs benchmarks and LLM-as-a-judge evaluations; Retriever provides embedding, reranking, and extraction models as NIM microservices for RAG; Guardrails applies programmable runtime checks to inputs and outputs and can block jailbreak attempts. Guardrails changes runtime behavior, not model weights. Curator workflows can include text extraction, language identification, quality filtering, and exact or fuzzy deduplication, with GPU acceleration through RAPIDS. Guardrails can keep the conversation on topic and check inputs and outputs, but add runtime latency."
      ],
      "analogy": "NGC is like a Keells supermarket shelf of checked and packaged ingredients. NVIDIA AI Enterprise is like buying those ingredients with a warranty and a support desk. NeMo is a kitchen: Curator prepares ingredients, Customizer and Aligner adjust the recipe, Evaluator tastes it, and Guardrails checks it before serving.",
      "example": "For a customer-support bot, Curator can remove duplicate and low-quality chat logs; Customizer can fine-tune with LoRA; Evaluator can test it; NIM can package deployment; Retriever can add RAG; and Guardrails can enforce runtime rules about allowed topics.",
      "keyPoints": [
        "NGC offers containers, models, and Helm charts through nvcr.io.",
        "NVIDIA AI Enterprise is a licensed and supported production software suite.",
        "NeMo builds and customizes generative AI models on Megatron-Core.",
        "Curator handles data; Customizer fine-tunes; Aligner aligns; Evaluator measures; Retriever supports RAG; Guardrails checks runtime interactions."
      ],
      "terms": [
        {
          "en": "NGC Catalog",
          "si": "NVIDIA hub for GPU-optimized containers, models, Helm charts, and resources."
        },
        {
          "en": "NVIDIA AI Enterprise",
          "si": "Commercially licensed NVIDIA AI software with production support."
        },
        {
          "en": "NeMo Framework",
          "si": "NVIDIA framework for building, training, and customizing generative AI models."
        },
        {
          "en": "Megatron-LM / Megatron-Core",
          "si": "Tools for large-model training using tensor, pipeline, and data parallelism."
        },
        {
          "en": "NeMo Curator",
          "si": "Tools for extracting, filtering, and deduplicating training data."
        },
        {
          "en": "NeMo Customizer",
          "si": "NeMo service for fine-tuning models."
        },
        {
          "en": "NeMo-Aligner",
          "si": "Tools for reward modeling and alignment methods including PPO RLHF and DPO."
        },
        {
          "en": "NeMo Evaluator",
          "si": "Service for benchmarks and model evaluations."
        },
        {
          "en": "NeMo Retriever",
          "si": "NIM-based embedding and reranking services for retrieval workflows."
        },
        {
          "en": "NeMo Guardrails",
          "si": "Runtime toolkit for controlling interactions around an LLM application."
        }
      ],
      "si": "ඔයාගේ customer-support bot එකට chat logs 10,000ක් තියෙනවා කියලා හිතන්න. NeMo Curator එකෙන් duplicate logs අයින් කරන්න, Customizer එකෙන් LoRA fine-tune කරන්න, Evaluator එකෙන් test කරන්න පුළුවන්. NIM එකෙන් service එක package කරලා, Retriever එකෙන් RAG දාන්නත් පුළුවන්. Guardrails නම් runtime එකේ input සහ output පරීක්ෂා කරනවා; model weights වෙනස් කරන්නේ නෑ."
    },
    {
      "id": "llm-serving-metrics",
      "examRefs": [
        "DEP-047",
        "DEP-048",
        "DEP-049",
        "DEP-050",
        "DEP-102"
      ],
      "title": "LLM Serving: Prefill vs Decode, TTFT, TPOT, Throughput, Streaming, Speculative Decoding",
      "body": [
        "LLM generation has two stages. During prefill, the model processes prompt tokens in parallel, fills the KV cache, and produces the first output token. During decode, it generates one token at a time. Prefill is often compute-bound; batch-one decode is often memory-bandwidth-bound because each step reads model weights from HBM for relatively little computation.",
        "TTFT (Time To First Token) is the time from request submission to the first token, influenced mainly by prefill and queueing. TPOT (Time Per Output Token), also called inter-token latency, is the average gap between generated tokens after the first: (total latency − TTFT) ÷ (tokens − 1).",
        "Latency is the completion time for one request; throughput is completed requests or tokens per second. Larger batches can improve throughput while increasing individual latency. TTFT and TPOT matter for interactive chat; throughput and cost matter more for offline batch jobs.",
        "Streaming sends tokens as they are generated. OpenAI-compatible APIs can use stream:true over Server-Sent Events, ending with data: [DONE]. gRPC uses HTTP/2 and Protocol Buffers and supports bidirectional streaming; browser apps commonly use REST/JSON with SSE. Streaming improves perceived waiting time, not generation speed. Speculative decoding uses a small draft model and a larger model to verify candidate tokens; accepted output retains the larger model’s distribution, but low acceptance reduces speedup."
      ],
      "analogy": "For a kottu order, prefill is preparing all ingredients after hearing the order. TTFT is the wait until the first spoonful arrives; decode is adding the next spoonful, and TPOT is the gap between spoonfuls. Throughput is how many plates the shop serves per hour.",
      "example": "An 8,000-token prompt at 10,000 prompt tokens/s takes about 8,000 ÷ 10,000 = 0.8 s for prefill. Generating 200 tokens at 50 tokens/s takes 200 ÷ 50 = 4 s; total is about 4.8 s, and TPOT is 1 ÷ 50 = 0.02 s = 20 ms. With 32 sequences and a 25 ms decode step, aggregate throughput is 32 ÷ 0.025 = 1,280 tokens/s, while each user sees about 40 tokens/s.",
      "keyPoints": [
        "Prefill processes the prompt in parallel and strongly affects TTFT.",
        "Decode emits one token per step and strongly affects TPOT.",
        "Batch size trades per-request latency against aggregate throughput.",
        "SSE or gRPC streaming lowers perceived latency, not compute time.",
        "Speculative decoding speedup depends on draft-token acceptance."
      ],
      "terms": [
        {
          "en": "Prefill",
          "si": "Stage that processes prompt tokens and fills the KV cache before generation."
        },
        {
          "en": "Decode",
          "si": "Stage that generates output one token at a time."
        },
        {
          "en": "TTFT",
          "si": "Time To First Token: time from request submission until the first generated token."
        },
        {
          "en": "TPOT / Inter-token Latency",
          "si": "Average time between generated tokens after the first."
        },
        {
          "en": "Throughput",
          "si": "Requests or tokens completed per unit of time."
        },
        {
          "en": "Server-Sent Events (SSE)",
          "si": "HTTP streaming format that sends event data in chunks."
        },
        {
          "en": "gRPC",
          "si": "RPC framework using HTTP/2 and Protocol Buffers with streaming support."
        },
        {
          "en": "Speculative Decoding",
          "si": "Draft-and-verify generation using a smaller draft model and a larger model."
        },
        {
          "en": "p50 / p99 Latency",
          "si": "Latency thresholds below which 50% or 99% of requests complete."
        }
      ],
      "si": "ඔයා Colombo වල bot එකකට prompt එකක් යැව්වම, prefill එක prompt tokens ඔක්කොම process කරන අදියරයි. පළවෙනි token එක එන්න තත්පර 0.8 ගියොත් ඒක TTFT. පස්සේ token එකකට 20 ms ගන්නවා නම් ඒක TPOT. Streaming එකෙන් token එක හදපු ගමන් පෙන්වනවා, ඒ නිසා බලන් ඉන්න හැඟීම අඩුයි; model එකේ ගණනය ඉක්මන් කරන්නේ නෑ."
    },
    {
      "id": "batching-and-memory-math",
      "examRefs": [
        "DEP-071",
        "DEP-072",
        "DEP-125",
        "DEP-145"
      ],
      "title": "Batching, KV Cache & GPU Memory Calculations",
      "body": [
        "Batching reuses each model-weight read across several sequences, improving throughput. Static batching keeps a fixed group until its longest sequence finishes, leaving unused slots when short answers end. Continuous (in-flight) batching removes finished sequences and admits new requests each decode step, keeping the GPU busier.",
        "The KV cache stores keys and values from previous tokens for every attention layer, so they need not be recomputed for each new token. Its size grows linearly with sequence length and batch size. Paged KV cache divides storage into fixed-size blocks tracked by a block table, reducing fragmentation and avoiding allocation for a sequence’s maximum length in advance.",
        "Approximate weight memory is parameter count × bytes per parameter: FP32=4, FP16/BF16=2, INT8/FP8=1, INT4=0.5. Thus 13B BF16 weights need 13 × 2 = 26 GB; 8B INT4 needs 8 × 0.5 = 4 GB. These figures exclude KV cache and activations. Inference does not need training optimizer states.",
        "KV bytes per token = 2 (key and value) × layers × KV heads × head dimension × bytes per value. Multiply by sequence length and concurrent sequences. Do not omit the factor of 2 or substitute query-head count for KV-head count in GQA (for example, 32 query heads but 8 KV heads). Weight-only INT4 such as AWQ can help batch-one, memory-bound decode; large compute-bound prefill may benefit less. Chunked prefill divides long prompts into pieces so they can be interleaved with decode steps. Prefix caching can reuse KV cache for a common prompt prefix across requests."
      ],
      "analogy": "Static batching is like a bus that waits for the longest trip before taking new passengers: seats stay empty after short-trip passengers get off. A Colombo city bus with new passengers boarding at each stop resembles continuous batching. Paged KV cache is like selling tickets by seat or block instead of reserving an entire bus for one family.",
      "example": "For 32 layers, 8 KV heads, head dimension 128, and FP16 (2 bytes), each token uses 2 × 32 × 8 × 128 × 2 = 131,072 bytes = 128 KiB. A 4,096-token sequence uses 4,096 × 128 KiB = 512 MiB ≈ 0.5 GB. If 40 GB remains after weights, 40 ÷ 0.5 ≈ 80 such sequences fit approximately. Four sequences of lengths 100, 100, 100, and 1,000 use 1,300 useful token slots but static allocation reserves 4 × 1,000 = 4,000, so utilization is 1,300 ÷ 4,000 = 32.5%.",
      "code": {
        "lang": "python",
        "src": "# Approximate KV-cache and weight memory calculations in GB\nlayers, kv_heads, head_dim = 32, 8, 128\nbytes_per_val = 2            # FP16 = 2 bytes\nseq_len = 4096\n\n# 2 counts both the key and value\nper_token = 2 * layers * kv_heads * head_dim * bytes_per_val\nper_seq_gb = per_token * seq_len / 1024**3\nprint(per_token, \"bytes/token\")          # 131072\nprint(round(per_seq_gb, 2), \"GB/seq\")     # 0.5\n\nfree_gb = 40                 # memory remaining after weights\nprint(int(free_gb / per_seq_gb), \"sequences\")  # ~80\n\nparams_b = 13                # 13 billion parameters\nprint(params_b * 2, \"GB weights in BF16\")      # 26"
      },
      "keyPoints": [
        "Continuous batching admits and removes sequences at each step; static batching waits for the longest.",
        "Approximate weight GB = parameters in billions × bytes per parameter.",
        "KV bytes/token = 2 × layers × KV heads × head dimension × bytes per value.",
        "KV cache grows linearly with sequence length and concurrent sequences.",
        "Paged KV cache allocates blocks and reduces fragmentation and unused capacity."
      ],
      "terms": [
        {
          "en": "Static Batching",
          "si": "Fixed group of sequences that waits for the longest sequence to finish."
        },
        {
          "en": "Continuous / In-flight Batching",
          "si": "Scheduling that admits and removes sequences during generation."
        },
        {
          "en": "KV Cache",
          "si": "Stored attention keys and values from prior tokens."
        },
        {
          "en": "Paged KV Cache / PagedAttention",
          "si": "KV storage organized into fixed-size blocks tracked by a block table."
        },
        {
          "en": "Grouped-Query Attention (GQA)",
          "si": "Attention design where multiple query heads share fewer key/value heads."
        },
        {
          "en": "Chunked Prefill",
          "si": "Splitting a long prompt’s prefill into chunks interleaved with decoding."
        },
        {
          "en": "Prefix Caching",
          "si": "Reusing cached prompt-prefix computation across requests."
        }
      ],
      "si": "ඔයාගේ model එකේ layers 32, KV heads 8, head dimension 128, FP16 නම් token එකකට 2 × 32 × 8 × 128 × 2 = 131,072 bytes යනවා. Tokens 4,096ක් නම් 4,096 × 128 KiB = 512 MiB පමණයි. Weights පස්සේ 40 GB ඉතුරු නම් 40 ÷ 0.5 = sequences 80ක් පමණ තියාගන්න පුළුවන්. 2 කියන K සහ V දෙක අමතක කරන්න එපා."
    },
    {
      "id": "tensorrt-onnx",
      "examRefs": [
        "DEP-016",
        "DEP-038",
        "DEP-062",
        "DEP-063",
        "DEP-084",
        "DEP-085",
        "DEP-110",
        "DEP-120",
        "DEP-121",
        "DEP-143"
      ],
      "title": "ONNX & TensorRT: Engines, Profiles, Plugins, INT8 Calibration",
      "body": [
        "ONNX (Open Neural Network Exchange) is an open, framework-neutral graph format using standard operators. Export from PyTorch with torch.onnx.export, then use ONNX Runtime or TensorRT. Without dynamic_axes, export can fix batch and sequence dimensions to the example input shape. Mark variable dimensions explicitly. Tracing may capture only the branch taken for data-dependent if/else; use tensor operations such as torch.where, scripting, or the newer Dynamo-based exporter when appropriate. Keep export_params enabled to include weights.",
        "TensorRT is an inference optimizer and runtime. It can fuse layers (for example, GEMM, bias, and activation into one kernel), select precision such as FP16/INT8/FP8, tune kernels for a target GPU, and serialize an engine (.plan). trtexec can build and benchmark an engine from ONNX. TensorRT optimizes inference; Triton is commonly used to serve requests.",
        "An engine is specialized to GPU architecture and TensorRT version; build it for the target deployment hardware. Dynamic dimensions use an optimization profile with minimum, optimum, and maximum shapes, such as sequence length 1, 256, and 2,048. The optimum shape guides tuning while the supported range remains valid.",
        "If the ONNX parser does not support an operator, provide/register a TensorRT plugin, often implemented with a CUDA kernel. Post-training INT8 calibration runs representative samples through the network to measure activation ranges and choose scales; it does not train weights. Unrepresentative calibration data can cause clipping or poor resolution."
      ],
      "analogy": "ONNX is like a standard shipping container accepted in many places. TensorRT repacks it to fit a particular GPU truck. An engine built for an A100 may need rebuilding for the target H100 architecture and TensorRT version. INT8 calibration is like measuring real customers before choosing standard clothing sizes.",
      "example": "Export BERT with dynamic_axes={\"input_ids\": {0: \"batch\", 1: \"seq\"}}, then run trtexec --onnx=model.onnx --saveEngine=model.plan --fp16. For sequence lengths 1–2,048 with most requests near 256, use min=1, opt=256, max=2,048. Build the engine for the GPU architecture and TensorRT version used in deployment.",
      "keyPoints": [
        "ONNX is framework-neutral; declare dynamic dimensions when needed.",
        "TensorRT fuses layers, selects precision, tunes kernels, and serializes an engine.",
        "Build engines for the target GPU architecture and TensorRT version.",
        "Profiles set min/opt/max shapes; plugins implement unsupported operators.",
        "INT8 calibration measures activation ranges using representative data."
      ],
      "terms": [
        {
          "en": "ONNX",
          "si": "Open, framework-neutral format for neural-network computation graphs."
        },
        {
          "en": "Dynamic Axes",
          "si": "Dimensions such as batch or sequence length that can vary in an ONNX model."
        },
        {
          "en": "TensorRT Engine (.plan)",
          "si": "Serialized inference engine optimized for a target GPU and software version."
        },
        {
          "en": "Layer Fusion",
          "si": "Combining multiple operations to reduce kernel launches and memory traffic."
        },
        {
          "en": "Optimization Profile",
          "si": "Minimum, optimum, and maximum input shapes for dynamic dimensions."
        },
        {
          "en": "TensorRT Plugin",
          "si": "Custom implementation of an operation not otherwise supported by TensorRT."
        },
        {
          "en": "INT8 Calibration",
          "si": "Choosing INT8 activation scales by measuring representative sample inputs."
        },
        {
          "en": "trtexec",
          "si": "TensorRT command-line utility to build and benchmark engines."
        }
      ],
      "si": "ඔයා BERT model එක batch size 1 හෝ 16කින් දෙන්න යනවා නම් ONNX export එකේ batch dimension එක dynamic කියලා සලකුණු කරන්න. TensorRT එක layers fuse කරලා, target GPU එකට kernels tune කරලා .plan engine එකක් හදනවා. Sequence length 1 සිට 2,048 දක්වා නම් min=1, opt=256, max=2,048 profile එකක් දාන්න පුළුවන්. INT8 calibration එකට ඇත්ත data වගේ samples යොදාගන්න."
    },
    {
      "id": "tensorrt-llm",
      "examRefs": [
        "DEP-017",
        "DEP-058",
        "DEP-064",
        "DEP-065",
        "DEP-122",
        "DEP-123",
        "DEP-139"
      ],
      "title": "TensorRT-LLM: In-flight Batching, Paged KV Cache, Memory Fraction",
      "body": [
        "General TensorRT does not provide all the features needed for autoregressive LLM generation, such as KV-cache management, token-level batching, and multi-GPU sharding. TensorRT-LLM is an inference library with optimized attention kernels, paged KV cache, in-flight batching, and tensor parallelism; it is not a training tool.",
        "A common workflow converts Hugging Face weights to a TensorRT-LLM checkpoint, optionally quantizes, builds an engine with trtllm-build, and serves it through Triton’s tensorrtllm backend. Higher-level LLM APIs can automate parts of this workflow. The backend provides in-flight batching and KV-cache management. Multi-LoRA serving can keep one base model loaded, select a LoRA adapter for each request, and mix adapters in a batch when supported.",
        "Limits such as max_batch_size, max_num_tokens, and max_seq_len are set at engine build time. If an engine supports max_seq_len=4,096, serving 8,192-token conversations requires rebuilding if the model supports that context, and enough memory must be available for the larger KV cache. Raising a client max_tokens value alone does not change the engine limit.",
        "TensorRT-LLM can reserve a large fraction of free GPU memory after loading weights for its paged KV-cache pool using kv_cache_free_gpu_mem_fraction. A second model on the same GPU may then run out of memory. Lowering the fraction frees memory but can reduce concurrent sequence capacity; MIG can isolate models."
      ],
      "analogy": "TensorRT-LLM adds LLM-specific features to an inference kitchen: new diners join as others finish (in-flight batching), and KV-cache storage is allocated in blocks. Reserving 90% of a car park for one restaurant’s guests can leave no space for a nearby shop.",
      "example": "On an 80 GB H100, an 8B FP16 model’s weights need about 8 × 2 = 16 GB. If roughly 64 GB remains and 90% is reserved, about 57.6 GB goes to KV cache, leaving little for another 4 GB embedding model. Reducing the fraction to 0.7 reserves about 44.8 GB and leaves more room, but supports fewer concurrent sequences.",
      "keyPoints": [
        "TensorRT-LLM adds LLM inference features such as paged KV cache and in-flight batching.",
        "Typical flow: Hugging Face weights → checkpoint/optional quantization → trtllm-build → Triton backend.",
        "Sequence, batch, and token limits are build-time settings; rebuild to change them.",
        "Lower KV-cache memory fraction can make room for other processes but reduce concurrency."
      ],
      "terms": [
        {
          "en": "TensorRT-LLM",
          "si": "NVIDIA library for optimizing LLM inference on NVIDIA GPUs."
        },
        {
          "en": "In-flight Batching",
          "si": "Continuous batching that admits and removes sequences between decode steps."
        },
        {
          "en": "trtllm-build",
          "si": "Command used to build a TensorRT-LLM engine."
        },
        {
          "en": "KV-cache Memory Fraction",
          "si": "Share of free GPU memory reserved for the KV-cache pool."
        },
        {
          "en": "Multi-LoRA Serving",
          "si": "Serving multiple LoRA adapters with one base model and selecting adapters per request."
        }
      ],
      "si": "ඔයා 8B FP16 model එකක් 80 GB H100 එකක දානවා නම් weights වලට 8 × 2 = 16 GB යනවා. ඉතුරු 64 GBන් 90%ක් KV cache එකට reserve කළොත් 57.6 GB පමණ ගන්න වෙන්න පුළුවන්. ඒ නිසා 4 GB embedding model එකකට ඉඩ නොලැබෙන්න පුළුවන්. Fraction එක 0.7 කළොත් KV pool එක අඩුවෙනවා, හැබැයි එකවර serve කරන sequences ගණනත් අඩු වෙයි."
    },
    {
      "id": "triton-basics",
      "examRefs": [
        "DEP-015",
        "DEP-020",
        "DEP-021",
        "DEP-022",
        "DEP-053",
        "DEP-054",
        "DEP-055",
        "DEP-060",
        "DEP-113",
        "DEP-144"
      ],
      "title": "Triton Inference Server: Model Repository, config.pbtxt, Batching, Ports",
      "body": [
        "Triton Inference Server is an open-source multi-framework server that serves TensorRT, ONNX Runtime, PyTorch, and Python backend models over HTTP or gRPC, with dynamic batching and concurrent model execution. OpenAI Triton, the GPU-kernel language, is a different project. Default ports: 8000 HTTP/REST, 8001 gRPC, and 8002 Prometheus metrics.",
        "A model repository uses <repository>/<model-name>/config.pbtxt and numeric version folders, such as models/llm_encoder/config.pbtxt and models/llm_encoder/1/model.plan. When max_batch_size > 0, Triton adds an implicit batch dimension before the configured dims; dims [-1] therefore represents [batch, seq_len]. With max_batch_size=0 there is no implicit batch dimension and Triton does not batch requests.",
        "instance_group controls how many model instances run and where. For example, count:2, kind:KIND_GPU, gpus:[0] creates two copies on GPU 0, enabling concurrent requests; it does not split model layers across GPUs. The dynamic batcher briefly queues independent requests, up to max_queue_delay_microseconds, to form batches. Longer queue delay may improve throughput but also increases latency.",
        "preferred_batch_size:[8,16] asks the batcher to try those sizes and send a batch as soon as one is formed; otherwise it can send the largest available batch when the queue delay expires. Other sizes up to max_batch_size remain allowed. This setting helps when a backend has especially efficient profiles for selected sizes; many models work well with queue delay alone."
      ],
      "analogy": "Triton is like the Pettah bus stand. The model repository is the route board, version folders are bus numbers, and config.pbtxt states the seat limit and how many buses run. The dynamic batcher is a conductor who waits briefly for more passengers; waiting can fill the bus but delays departure.",
      "example": "With max_batch_size:32 and input dims:[-1], the client supplies [batch, seq_len] where batch is 1–32. Two instance_group copies on GPU 0 can run requests concurrently. If queue time is high, compute time steady, and GPU memory is available, consider tuning instances or dynamic batching; reducing the batch may worsen queueing.",
      "code": {
        "lang": "text",
        "src": "# models/classifier/config.pbtxt\n# Folder layout: models/classifier/1/model.onnx\nname: \"classifier\"\nplatform: \"onnxruntime_onnx\"\nmax_batch_size: 32          # positive value adds an implicit batch dimension\ninput [ { name: \"input_ids\" data_type: TYPE_INT64 dims: [ -1 ] } ]\noutput [ { name: \"logits\" data_type: TYPE_FP32 dims: [ 3 ] } ]\n\ninstance_group [ { count: 2 kind: KIND_GPU gpus: [ 0 ] } ]  # two copies on GPU 0\n\ndynamic_batching {\n  preferred_batch_size: [ 8, 16 ]       # try these batch sizes\n  max_queue_delay_microseconds: 2000    # wait up to 2 ms\n}"
      },
      "keyPoints": [
        "Default ports: 8000 HTTP, 8001 gRPC, 8002 metrics.",
        "Model folders contain config.pbtxt and numeric version directories.",
        "max_batch_size > 0 adds an implicit batch dimension; 0 disables it.",
        "instance_group count creates concurrent model copies, not model parallelism.",
        "Longer queue delay may improve throughput but add latency."
      ],
      "terms": [
        {
          "en": "Triton Inference Server",
          "si": "Open-source server for deploying inference models from multiple frameworks."
        },
        {
          "en": "Model Repository",
          "si": "Directory tree containing model configuration and version folders."
        },
        {
          "en": "config.pbtxt",
          "si": "Triton model configuration file in protobuf text format."
        },
        {
          "en": "max_batch_size",
          "si": "Maximum batch size and whether Triton adds an implicit batch dimension."
        },
        {
          "en": "instance_group",
          "si": "Configuration for model instance count and placement on CPU or GPU."
        },
        {
          "en": "Dynamic Batcher",
          "si": "Scheduler that combines independent requests into batches."
        },
        {
          "en": "preferred_batch_size",
          "si": "Batch sizes that a Triton dynamic batcher preferentially forms."
        },
        {
          "en": "max_queue_delay_microseconds",
          "si": "Maximum time a request waits while Triton forms a batch."
        }
      ],
      "si": "ඔයා Triton එකේ model එකක් models/classifier/1/model.onnx folder එකේ තියාගෙන config.pbtxt දානවා. max_batch_size 32 සහ dims [-1] නම් client එක [batch, seq_len] shape එකක් යවයි; batch එක 1 සිට 32 දක්වා වෙන්න පුළුවන්. GPU 0 එකේ instance copies 2ක් නම් requests දෙකක් එකවර run වෙන්න පුළුවන්. Queue එකට 2 ms බලාගන්න කිව්වොත් batch එක ලොකු වෙයි, නමුත් latency වැඩි වෙන්නත් පුළුවන්."
    },
    {
      "id": "triton-advanced",
      "examRefs": [
        "DEP-056",
        "DEP-057",
        "DEP-059",
        "DEP-061",
        "DEP-083",
        "DEP-103",
        "DEP-114",
        "DEP-115",
        "DEP-116",
        "DEP-118",
        "DEP-119",
        "DEP-148"
      ],
      "title": "Triton Advanced: Sequence Batcher, Decoupled, Ensembles vs BLS, Ops Features",
      "body": [
        "The sequence batcher is for stateful models, such as streaming speech models that preserve hidden state across audio chunks. A correlation ID routes requests in one sequence to the same model instance, with start/end signals. The dynamic batcher treats requests as independent and may send them to different instances. By default Triton returns one response per request; model_transaction_policy { decoupled:true } permits zero or multiple responses, useful for token-by-token streaming over gRPC or a supported streaming endpoint.",
        "An ensemble links several models as a static directed acyclic graph (DAG), such as Python tokenizer → TensorRT encoder → postprocess. The client makes one call and intermediate tensors stay server-side; an ensemble cannot branch on data or loop. BLS (Business Logic Scripting) calls other Triton models from a Python backend and supports conditionals and loops. A Python backend model.py defines TritonPythonModel methods initialize, execute, and finalize.",
        "The response cache hashes request inputs and reuses a saved response for an exact repeat, useful for deterministic models with repeated inputs. It is rarely useful for sampled generation such as temperature 0.8 and is different from an LLM KV cache. model_warmup can send synthetic requests at load time to reduce first-request slowdowns.",
        "The default version policy is latest {num_versions:1}; use all {} or specific versions such as {versions:[2,3]} to serve others. Explicit model-control mode supports loading or unloading through repository API calls without restarting; none loads at startup, and poll is another mode. Readiness is /v2/health/ready on port 8000; liveness is /v2/health/live. Port 8002 exposes metrics such as queue and compute time. Triton Model Analyzer sweeps instance counts, batch sizes, and dynamic-batching settings to find configurations within latency constraints."
      ],
      "analogy": "An ensemble is a fixed factory conveyor belt: cut, paint, pack, always in order. BLS is a supervisor who sends red items to machine A and blue items to B, or retries a failed quality check. A sequence batcher sends one patient to the same doctor because that doctor holds the patient’s file.",
      "example": "A classifier routes a request to one of two LLMs and loops until a validation model accepts it. Because routing and looping are needed, use BLS rather than a static ensemble. With version folders 1, 2, and 3 and no version policy, only version 3 is served. A Kubernetes readiness probe on /v2/health/ready prevents traffic before models are ready.",
      "keyPoints": [
        "Sequence batching preserves state by correlation ID and instance.",
        "Decoupled models can return multiple responses for streaming.",
        "Ensemble is a static DAG; BLS supports Python control flow.",
        "Response cache reuses exact inputs; warmup reduces cold-start latency.",
        "Default version policy serves latest one; ready and live endpoints differ."
      ],
      "terms": [
        {
          "en": "Sequence Batcher",
          "si": "Scheduler that routes stateful sequences to a consistent model instance by correlation ID."
        },
        {
          "en": "Decoupled Model",
          "si": "Triton model mode that can return zero or multiple responses per request."
        },
        {
          "en": "Ensemble Model",
          "si": "Static server-side pipeline connecting multiple models as a DAG."
        },
        {
          "en": "BLS (Business Logic Scripting)",
          "si": "Python-based method for calling Triton models with control flow."
        },
        {
          "en": "Python Backend",
          "si": "Triton backend that runs Python model code."
        },
        {
          "en": "Response Cache",
          "si": "Triton cache that reuses outputs for identical inputs."
        },
        {
          "en": "Model Warmup",
          "si": "Synthetic requests sent during load to reduce first-request overhead."
        },
        {
          "en": "Version Policy",
          "si": "Configuration selecting which numeric model versions Triton serves."
        },
        {
          "en": "Model Control Mode",
          "si": "Triton mode controlling model loading through startup, polling, or explicit API calls."
        },
        {
          "en": "Readiness vs Liveness",
          "si": "Readiness checks whether inference can receive traffic; liveness checks process health."
        },
        {
          "en": "Triton Model Analyzer",
          "si": "Tool that searches Triton configurations under performance constraints."
        }
      ],
      "si": "ඔයා audio එක තත්පර 1 බැගින් chunks කරලා speech model එකට යවනවා නම්, එක conversation එකේ chunks ටික එකම model instance එකට යන්න ඕනේ. Sequence batcher එක correlation ID එකෙන් ඒක කරයි. Models තුනක් සරල පිළිවෙළකට යනවා නම් ensemble හොඳයි. Billing නම් LLM Aට, technical නම් LLM Bට යවලා ආයෙත් validate කරන්න ඕනේ නම් BLS වල conditionals සහ loops යොදාගන්න."
    },
    {
      "id": "nim-microservices",
      "examRefs": [
        "DEP-014",
        "DEP-067",
        "DEP-068",
        "DEP-069",
        "DEP-070",
        "DEP-149"
      ],
      "title": "NVIDIA NIM: Optimized Inference Microservices",
      "body": [
        "NVIDIA NIM (NVIDIA Inference Microservice) packages a model, optimized inference engine, and standard API in a prebuilt container. An LLM NIM exposes OpenAI-compatible routes such as /v1/chat/completions and /v1/models, so an existing OpenAI Python client can often point to the NIM base URL, such as http://localhost:8000/v1, and use the NIM model name.",
        "At startup an LLM NIM selects an optimized profile (engine and settings) suited to the detected GPU and configuration, such as tensor-parallel layout; if no matching profile exists, it may use a generic backend. You do not need to build the engine yourself. LLM NIM and TensorRT-LLM support multi-LoRA serving, selecting an adapter per request while sharing a base model.",
        "NIM images are in the NGC registry nvcr.io. Authenticate with docker login nvcr.io and provide NGC_API_KEY to download authorized model assets. The host needs a compatible driver and container toolkit, not necessarily the full CUDA toolkit. If a reverse proxy buffers a stream until completion, disable buffering (for example, proxy_buffering off in NGINX).",
        "NIM is a packaged, optimized, supported model service with a standard API for quick deployment. Triton is more flexible for custom mixed pipelines, such as an ONNX vision model, Python preprocessing, and XGBoost in one ensemble. Both are part of NVIDIA AI Enterprise."
      ],
      "analogy": "NIM is like a ready-made Pizza Hut pizza: open the box and serve it, with the package selected for your oven (GPU). Triton is your own kitchen, flexible enough to mix different dishes but requiring more setup. An NGC API key is like the authorization needed to collect the delivery.",
      "example": "If an app currently calls an OpenAI API but company data must stay local, run a Llama NIM on an H100, authenticate to nvcr.io, pass NGC_API_KEY, and start the container with GPU access. Point the client base_url to http://localhost:8000/v1 and select the NIM model name.",
      "keyPoints": [
        "NIM packages a model, optimized engine, and API in a container.",
        "Startup selects a compatible GPU profile when available.",
        "NGC authentication is required for authorized images and model assets.",
        "Use packaged LLM services for NIM; use Triton for custom mixed pipelines."
      ],
      "terms": [
        {
          "en": "NVIDIA NIM",
          "si": "Prebuilt NVIDIA inference microservice container with an optimized model and API."
        },
        {
          "en": "NIM Optimized Profile",
          "si": "Engine and settings selected for a GPU and serving configuration."
        },
        {
          "en": "NGC API Key",
          "si": "Credential used to access authorized NGC images and model assets."
        },
        {
          "en": "OpenAI-compatible Endpoint",
          "si": "API routes compatible with clients expecting OpenAI-style requests."
        }
      ],
      "si": "ඔයාගේ app එක OpenAI client එකෙන් request යවනවා කියලා හිතන්න. Company data පිටතට යවන්න බැරි නම් Llama NIM එක local H100 එකක ධාවනය කරන්න පුළුවන්. NGC එකට login වෙලා API key දීලා container එක පටන් ගන්න. පස්සේ base_url එක http://localhost:8000/v1 කරලා model name එක මාරු කළොත් client code එකේ වෙනස්කම් අඩුයි."
    },
    {
      "id": "scaling-llm-serving",
      "examRefs": [
        "DEP-051",
        "DEP-086",
        "DEP-089",
        "DEP-090",
        "DEP-091",
        "DEP-092",
        "DEP-093",
        "DEP-094",
        "DEP-095",
        "DEP-099",
        "DEP-104",
        "DEP-112",
        "DEP-117",
        "DEP-136",
        "DEP-137",
        "DEP-138",
        "DEP-147",
        "DEP-150"
      ],
      "title": "Scaling LLM Serving: Little's Law, Replicas, Load Balancing, Autoscaling",
      "body": [
        "Little’s law relates average in-flight requests to arrival rate and time in the system: L = λ × W. L is concurrency, λ is requests per second, and W is average seconds per request. Use it to estimate concurrency and plan batch size and KV-cache capacity; multiply rate by time.",
        "Estimate replicas by dividing peak traffic × (1 + headroom) by the requests per second one replica can handle within its SLO, then round up. Choose batch settings from load tests that meet latency SLOs while maximizing throughput. If concurrency rises but throughput flattens and latency doubles, the server is saturated.",
        "LLM request costs vary greatly, such as 10 versus 4,000 tokens, so round-robin can create uneven queues. Least-outstanding-request or load/KV-aware routing can help; prefix-aware routing sends a prompt to a replica with its prefix cached. Send requests concurrently with a bounded async client so the server can use continuous batching.",
        "GPU utilization alone is a weak demand signal; queue depth or per-replica KV-cache utilization is often more useful. A common Kubernetes GPU-metrics path is DCGM Exporter → Prometheus → Prometheus Adapter. Scale-to-zero saves GPU cost but causes cold starts for image pulls, weight loads, and engine warmup; keep a warm replica or cache weights on persistent storage.",
        "For slow model startup, a liveness probe can restart a pod before weights load. Use a startup probe or adequate initial delay, and cache weights on persistent storage. Keep readiness probes so unready pods do not receive traffic. Monitor errors, p95/p99 latency including TTFT, queue depth, and GPU memory/utilization. p99=4.5 s means 99% of requests finish within 4.5 s; it is not the maximum. BLEU-like reference scores are for offline evaluation, not live traffic.",
        "Canary sends a small share of production traffic to a new version and increases it after checking metrics. Blue-green switches routing between two environments and supports quick rollback. Shadowing mirrors live requests but does not show new outputs to users, at extra compute cost. Do not promote on a tiny sample: zero errors in 1% traffic for 10 minutes is weak evidence if the baseline is 0.2%. Compare adequate samples over the same time window. Approximate self-host cost per million tokens = GPU hourly cost ÷ (tokens/s × 3,600 × utilization ÷ 1,000,000); forgetting utilization understates cost. For another cost check, a $3 GPU-hour at 3,000 tokens/s and 50% utilization delivers 1,500 × 3,600 = 5.4 million tokens per hour, or about $3 ÷ 5.4 = $0.56 per million. An API priced at $0.50 per million is slightly cheaper; ignoring utilization would incorrectly estimate about $0.28."
      ],
      "analogy": "At a Cargills cashier, if 4 customers arrive each minute and each spends 10 minutes inside on average, about 4 × 10 = 40 customers are in the shop. Load balancing should send customers to the shorter, faster-moving queue, not simply alternate regardless of trolley size.",
      "example": "At 20 requests/s and 3 s average time, Little’s law gives 20 × 3 = 60 concurrent requests. If one replica handles 12 requests/s within its SLO and peak is 100 requests/s with 20% headroom, capacity needed is 100 × 1.2 = 120; 120 ÷ 12 = 10 replicas. At $4/GPU-hour and 2,000 tokens/s, full utilization yields 2,000 × 3,600 = 7.2 million tokens/hour, or about $4 ÷ 7.2 = $0.56 per million. At 50% utilization, cost doubles to about $1.11.",
      "keyPoints": [
        "Little’s law: in-flight requests = arrival rate × average time.",
        "Replicas = peak traffic × (1 + headroom) ÷ tested replica capacity, rounded up.",
        "For variable LLM workloads, consider outstanding requests, KV cache, and prefix-aware routing.",
        "Autoscale using queue depth or KV-cache utilization rather than GPU-Util alone.",
        "Use startup and readiness probes for slow model loads; monitor tail latency and errors.",
        "Canary, blue-green, and shadow rollouts differ; evaluate canaries with adequate samples."
      ],
      "terms": [
        {
          "en": "Little's Law",
          "si": "Relationship stating average in-system requests equal arrival rate multiplied by average time in the system."
        },
        {
          "en": "Replica",
          "si": "An independently running copy of a model service."
        },
        {
          "en": "Least-outstanding-requests Routing",
          "si": "Routing requests to the replica currently handling the fewest outstanding requests."
        },
        {
          "en": "Prefix-aware Routing",
          "si": "Routing a prompt to a replica that already caches its shared prefix."
        },
        {
          "en": "Cold Start",
          "si": "Startup delay while a service pulls images, loads weights, and initializes engines."
        },
        {
          "en": "Canary / Blue-green / Shadow",
          "si": "Rollout strategies using gradual traffic, environment switching, or mirrored requests."
        },
        {
          "en": "Startup Probe",
          "si": "Kubernetes probe that allows a slow-starting container time to initialize before liveness checks."
        },
        {
          "en": "p95 / p99 Latency",
          "si": "Latency limits met by 95% or 99% of requests, used to measure tail performance."
        },
        {
          "en": "Cost per Million Tokens",
          "si": "GPU hourly cost divided by the number of millions of tokens served per hour."
        }
      ],
      "si": "ඔයාගේ service එකට තත්පරයකට requests 20ක් එනවා, එකක් සාමාන්‍යයෙන් තත්පර 3ක් ඉන්නවා නම් 20 × 3 = 60 requests එකවර තියෙනවා. Replica එකක් 12 requests/s handle කරනවා නම්, 100 requests/s peak එකට 20% headroom දාද්දී 100 × 1.2 ÷ 12 = 10 replicas ඕනේ. GPU 50%ක් විතරක් busy නම් token එකකට වැය full utilization එකට වඩා දෙගුණයක් වෙනවා."
    },
    {
      "id": "gpu-operations",
      "examRefs": [
        "DEP-031",
        "DEP-033",
        "DEP-035",
        "DEP-036",
        "DEP-037",
        "DEP-046",
        "DEP-073",
        "DEP-074",
        "DEP-087",
        "DEP-088",
        "DEP-096",
        "DEP-098",
        "DEP-109",
        "DEP-128",
        "DEP-129",
        "DEP-130",
        "DEP-135",
        "DEP-140",
        "DEP-146"
      ],
      "title": "GPU Operations: MIG, GPU Operator, DCGM, nvidia-smi, Nsight, Jetson",
      "body": [
        "MIG (Multi-Instance GPU) partitions an A100 or H100 into up to seven isolated instances with dedicated SMs, L2 cache, and memory, reducing interference and preventing tenants from reading one another’s memory. An A100 80 GB supports at most seven 1g.10gb instances, not eight: it has seven compute slices. Time-slicing shares one GPU across pods without memory or fault isolation; one pod can consume memory or harm another’s latency. CUDA MPS runs kernels from several processes concurrently but provides weaker isolation than MIG.",
        "In Kubernetes, the NVIDIA device plugin advertises nvidia.com/gpu; a pod requests an integer such as 1, not 0.5. Use MIG or time-slicing for sharing. GPU Operator automates the node GPU stack: driver, container toolkit, device plugin, GPU Feature Discovery, DCGM Exporter, and MIG manager. Applications such as Triton are deployed separately.",
        "DCGM monitors, checks, and diagnoses fleet GPU health and exports utilization, memory, power, and errors to Prometheus. For uncorrectable ECC or repeated Xid errors, cordon/drain the node, run diagnostics, and investigate hardware. nvidia-smi quickly shows memory, utilization, temperature, power, and processes. GPU-Util measures the fraction of time at least one kernel ran, so even small kernels can show 100%; it does not prove full GPU capacity is used.",
        "Nsight Systems (nsys) shows an application-wide timeline of CPU threads, CUDA calls, kernels, copies, and idle gaps; start profiling there. Nsight Compute (ncu) examines one kernel’s occupancy, memory throughput, and stalls. Jetson Orin is an embedded, power-efficient edge computer. Its CPU and GPU share unified physical memory, so OS, weights, and KV cache share one budget; small or quantized models are often appropriate. Edge fits disconnected, privacy-sensitive, or tight-latency locations; cloud suits very large models and traffic spikes. nvidia-smi topo -m shows GPU interconnect topology, not utilization."
      ],
      "analogy": "MIG is like dividing a large house into seven annexes with separate doors and meters. Time-slicing is like sharing one room by the hour: the previous tenant’s belongings can still cause trouble. GPU-Util at 100% is like a shop’s “open” sign; it does not mean the shop is full. Nsight Systems is CCTV footage; Nsight Compute is slow-motion study of one cook.",
      "example": "For 20 tenants needing under 10 GB each and isolation, an A100 80 GB can provide at most seven 1g.10gb MIG instances, so multiple GPUs are required. To sample GPU memory and utilization every five seconds, use nvidia-smi --query-gpu=memory.used,utilization.gpu --format=csv -l 5. On CUDA OOM, inspect running processes before changing the model.",
      "keyPoints": [
        "MIG provides hardware isolation in up to seven instances; time-slicing does not isolate memory.",
        "GPU Operator automates the node driver and GPU components, not application deployment.",
        "DCGM supports fleet monitoring; nvidia-smi is a quick snapshot.",
        "100% GPU-Util does not mean all compute is saturated; use nsys then ncu.",
        "Jetson is an edge platform with shared unified memory."
      ],
      "terms": [
        {
          "en": "MIG (Multi-Instance GPU)",
          "si": "Hardware partitioning that creates isolated compute and memory instances on a GPU."
        },
        {
          "en": "Time-slicing",
          "si": "Sharing a GPU by scheduling workloads at different times without memory isolation."
        },
        {
          "en": "CUDA MPS",
          "si": "Service that enables concurrent CUDA work from multiple processes."
        },
        {
          "en": "NVIDIA Device Plugin",
          "si": "Kubernetes component that advertises NVIDIA GPU resources."
        },
        {
          "en": "NVIDIA GPU Operator",
          "si": "Kubernetes operator that manages GPU software components on nodes."
        },
        {
          "en": "DCGM / DCGM Exporter",
          "si": "GPU management and telemetry tools; the exporter sends metrics to Prometheus."
        },
        {
          "en": "nvidia-smi",
          "si": "Command-line tool for viewing GPU status, memory, and processes."
        },
        {
          "en": "Nsight Systems (nsys)",
          "si": "Profiler showing system-wide CPU, GPU, and transfer timelines."
        },
        {
          "en": "Nsight Compute (ncu)",
          "si": "Profiler for detailed analysis of individual GPU kernels."
        },
        {
          "en": "Jetson",
          "si": "NVIDIA embedded platform for edge computing with shared CPU/GPU memory."
        }
      ],
      "si": "A100 80 GB එක 1g.10gb MIG instances වලට බෙදුවොත් උපරිම 7යි; 80 ÷ 10 = 8 වුණත් GPU එකේ compute slices 7ක් විතරයි. Tenant 20 දෙනෙක්ට instance 20ක් ඕනේ නම් GPU එකකට 7ක් නිසා GPUs කිහිපයක් ඕනේ. Time-slicing එකෙන් share කළත් memory isolation ලැබෙන්නේ නෑ. nvidia-smi එකේ 100% GPU-Util දැක්කම GPU එක සම්පූර්ණයෙන් busy කියලා තීරණය කරන්න එපා."
    },
    {
      "id": "pytorch-inference-practicalities",
      "examRefs": [
        "DEP-023",
        "DEP-024",
        "DEP-025",
        "DEP-045",
        "DEP-075",
        "DEP-076",
        "DEP-078",
        "DEP-080",
        "DEP-131"
      ],
      "title": "PyTorch Inference: eval(), no_grad, Devices, Autocast, Timing, OOM",
      "body": [
        "model.eval() changes layer behavior for inference: dropout is disabled and batch normalization uses running statistics. It does not stop gradients. torch.no_grad() prevents autograd graph recording, saving activation memory and compute, but does not change layer behavior. Inference usually needs both. torch.inference_mode() is stricter and can be faster, but its tensors cannot later be used by autograd.",
        "Tokenizers commonly return CPU tensors. If the model is on CUDA, move inputs to the same device; PyTorch does not move them automatically. Tensor x.to(\"cuda\") returns a new tensor, so assign it back; nn.Module.to() modifies the module in place. Device-agnostic code can choose cuda when torch.cuda.is_available(), otherwise cpu.",
        "Within torch.autocast, supported operations can use FP16 or BF16 to use Tensor Cores. FP16 training often uses GradScaler to prevent small gradients underflowing to zero; BF16’s FP32-like range usually avoids the need for scaling.",
        "CUDA kernel launches are asynchronous, so a Python timer can stop before the GPU finishes. Warm up and call torch.cuda.synchronize() before reading the clock (or use CUDA events). For unexpected OOM, check for other processes in nvidia-smi, missing no_grad/inference_mode, engine-reserved KV memory, and overly large batch or sequence length."
      ],
      "analogy": "model.eval() is like a cricket player moving from practice nets to a match: dropout experiments stop and batch norm uses running statistics. no_grad is like not recording a video for later analysis, so memory is not kept for backward. Timing without synchronize is like recording when a letter enters the post box, not when it arrives.",
      "example": "A model call may appear to take 0.3 ms without synchronization even though the GPU needs 25 ms. Warm up for three iterations, synchronize, time the call, and synchronize again; the measured value is then close to actual GPU execution time.",
      "code": {
        "lang": "python",
        "src": "import time, torch\n\ndevice = torch.device(\"cuda\" if torch.cuda.is_available() else \"cpu\")\nmodel = torch.nn.Linear(512, 10).to(device)   # Module.to() in-place\nmodel.eval()                                  # dropout/batchnorm inference mode\nx = torch.randn(8, 512).to(device)            # put inputs on the same device\n\nwith torch.inference_mode(), torch.autocast(device_type=device.type, dtype=torch.bfloat16):\n    for _ in range(3):                        # warm-up\n        model(x)\n    if device.type == \"cuda\":\n        torch.cuda.synchronize()              # wait for the GPU to finish\n    start = time.time()\n    y = model(x)\n    if device.type == \"cuda\":\n        torch.cuda.synchronize()\nprint(y.shape, f\"{(time.time() - start) * 1000:.2f} ms\")  # (8, 10)"
      },
      "keyPoints": [
        "eval() changes layer behavior; no_grad/inference_mode disables autograd tracking.",
        "Tensor.to() returns a new tensor; keep model and input on the same device.",
        "FP16 training often uses GradScaler; BF16 usually does not need it.",
        "For GPU timing, warm up and synchronize.",
        "For OOM, first inspect existing processes and KV-cache reservations."
      ],
      "terms": [
        {
          "en": "model.eval()",
          "si": "Sets PyTorch modules to evaluation behavior, such as disabling dropout."
        },
        {
          "en": "torch.no_grad()",
          "si": "Disables gradient tracking within a PyTorch context."
        },
        {
          "en": "torch.inference_mode()",
          "si": "Inference context that disables autograd and additional bookkeeping."
        },
        {
          "en": "Device Mismatch Error",
          "si": "Error caused by model and input tensors being on different devices."
        },
        {
          "en": "torch.autocast",
          "si": "Context that selects lower precision for supported operations."
        },
        {
          "en": "GradScaler",
          "si": "Tool that scales FP16 training loss to reduce gradient underflow."
        },
        {
          "en": "torch.cuda.synchronize()",
          "si": "Waits until queued CUDA work on the device is complete."
        }
      ],
      "si": "ඔයා model එක GPU එකේ තියාගෙන inputs CPU එකේ තැබුවොත් device mismatch error එකක් එනවා. x.to(\"cuda\") අලුත් tensor එකක් දෙන නිසා x = x.to(\"cuda\") කියලා assign කරන්න. GPU call එකක් 0.3 ms වගේ පෙනුණත් synchronize නැත්නම් ඇත්තටම 25 ms ගන්න පුළුවන්. Iterations 3ක් warm-up කරලා, synchronize කරලා, පස්සේ time කරන්න."
    },
    {
      "id": "pytorch-training-tooling",
      "examRefs": [
        "DEP-026",
        "DEP-039",
        "DEP-040",
        "DEP-041",
        "DEP-042",
        "DEP-043",
        "DEP-044",
        "DEP-077",
        "DEP-079",
        "DEP-081",
        "DEP-082",
        "DEP-106",
        "DEP-107",
        "DEP-108",
        "DEP-132",
        "DEP-133",
        "DEP-134"
      ],
      "title": "PyTorch & Hugging Face Tooling: Autograd, DataLoader, torch.compile, Accelerate, Checkpoints",
      "body": [
        "A Dataset defines how to get a sample (__len__, __getitem__); DataLoader wraps it into batches with options such as batch_size, shuffle, collate_fn, and num_workers. If Nsight Systems shows GPU idle gaps while the CPU decodes or augments images, the GPU is starved for data. Worker processes (num_workers>0) prepare batches in parallel. pin_memory=True uses page-locked host memory; pairing it with .to(\"cuda\", non_blocking=True) can overlap copies with compute.",
        "torch.compile(model) uses TorchDynamo to capture Python operations as graphs and a backend such as TorchInductor to generate fused kernels. Initial calls are slow while compiling. New shapes can break guards and trigger costly recompilation; consider dynamic=True or padding to fixed-length buckets and warming them up. CUDA Graphs capture a decode step so many kernel launches can be replayed together, reducing CPU launch overhead.",
        "Hugging Face Accelerate lets one PyTorch loop run across CPU, one or multiple GPUs, and multiple nodes with limited code changes; Accelerator.prepare wraps models, optimizers, and dataloaders. from_pretrained(..., device_map=\"auto\") places layers across available GPUs and possibly CPU to fit the model, but layers run sequentially; this is not tensor parallelism.",
        "Pickle-based .bin/.pt checkpoints can execute code when loaded, so only load trusted files. safetensors stores tensors and metadata without executing code and supports memory mapping; it is not compression. PyTorch recommends saving model.state_dict() and loading it into the model class rather than pickling the full module, which is brittle across code refactors.",
        "Autograd example: w=3 with requires_grad=True and loss=w**2 gives w.grad=2×w=6 after loss.backward(). Gradients are None without backward or requires_grad. backward() accumulates into .grad, so call optimizer.zero_grad() each step. Calling model(x) uses __call__ and registered hooks before forward; direct model.forward(x) skips hooks. Linear(512,10) maps an (8,512) input to (8,10).",
        "Hugging Face pipeline(\"sentiment-analysis\") bundles a default model, tokenizer, and preprocessing/postprocessing for inference; it returns labels and scores but does not train. Use AutoTokenizer with AutoModelForCausalLM for generation, AutoModelForSequenceClassification for classification, or AutoModelForMaskedLM for BERT-like masked models. datasets.load_dataset(\"imdb\") downloads and caches Arrow data with map/filter support. For data too large for disk, streaming=True returns an IterableDataset that reads records during iteration."
      ],
      "analogy": "DataLoader workers are helpers chopping vegetables while the GPU is the main cook; without helpers the pan waits. torch.compile is like learning a new route on day one and taking it quickly later, unless the route changes. safetensors is a sealed rice sack; an untrusted pickle is a parcel whose contents may run code when opened.",
      "example": "If a training step takes 200 ms, with 120 ms waiting for data, num_workers=8 and pin_memory=True may reduce the wait when storage and CPU can keep up. For a third-party Hugging Face model, prefer its safetensors weights when available. For w=3, loss=w²=9 and d(loss)/dw=2w=6, so backward gives gradient 6.",
      "keyPoints": [
        "If data loading starves the GPU, try parallel workers and pinned memory.",
        "torch.compile has compile overhead and may recompile for new shapes.",
        "Accelerate supports varied hardware; device_map=\"auto\" fits layers but is not tensor parallelism.",
        "Prefer safetensors for untrusted weights and save state_dict checkpoints.",
        "Gradients accumulate; clear them each step. Call model(x) to preserve hooks.",
        "Hugging Face pipeline is inference; select the appropriate AutoModel class for the task."
      ],
      "terms": [
        {
          "en": "DataLoader",
          "si": "PyTorch iterator that batches dataset samples and can shuffle or use workers."
        },
        {
          "en": "num_workers",
          "si": "Number of worker processes used to prepare data batches."
        },
        {
          "en": "pin_memory",
          "si": "Page-locked host memory that can enable faster asynchronous GPU copies."
        },
        {
          "en": "torch.compile",
          "si": "PyTorch compiler stack using graph capture and a backend such as TorchInductor."
        },
        {
          "en": "Recompilation",
          "si": "Compilation triggered again when guards or input shapes change."
        },
        {
          "en": "CUDA Graphs",
          "si": "Captured GPU operation sequences that can be replayed with reduced launch overhead."
        },
        {
          "en": "Hugging Face Accelerate",
          "si": "Library for adapting PyTorch training loops to different hardware setups."
        },
        {
          "en": "safetensors",
          "si": "Tensor-only weight format that does not execute pickle code when loaded."
        },
        {
          "en": "state_dict",
          "si": "Dictionary of a PyTorch model’s parameters and buffers."
        },
        {
          "en": "Autograd / backward()",
          "si": "PyTorch system that computes gradients and accumulates them in .grad."
        },
        {
          "en": "optimizer.zero_grad()",
          "si": "Call that clears accumulated gradients before a training step."
        },
        {
          "en": "nn.Module __call__ vs forward",
          "si": "Calling module(x) runs hooks and forward; direct forward() skips hooks."
        },
        {
          "en": "pipeline()",
          "si": "Hugging Face inference wrapper bundling model, tokenizer, and processing steps."
        },
        {
          "en": "AutoModelForCausalLM",
          "si": "Hugging Face model class with a causal language-model head for generation."
        },
        {
          "en": "load_dataset / streaming=True",
          "si": "Dataset loading from the Hub; streaming returns an iterable without downloading all data."
        }
      ],
      "si": "ඔයාගේ training step එක 200 ms යනවා, ඒකෙන් 120 ms GPU එක data එනකම් බලාගෙන ඉන්නවා නම් DataLoader workers වැඩි කරලා බලන්න. num_workers=8 සහ pin_memory=True දාලා images කිහිපයක් parallel prepare කරන්න පුළුවන්, හැබැයි CPU සහ disk එකත් වේගවත් වෙන්න ඕනේ. w=3 සහ loss=w² නම් gradient එක 2 × 3 = 6. backward() පස්සේ optimizer.zero_grad() නොකළොත් පරණ gradient එකත් එකතු වෙනවා."
    }
  ],
  "quiz": [
    {
      "q": "Which Hopper (H100) feature uses per-layer scaling to support FP8 training and inference?",
      "options": [
        "TF32 mode",
        "Transformer Engine",
        "NVSwitch",
        "Multi-Instance GPU"
      ],
      "answer": 1,
      "why": "Transformer Engine and FP8 Tensor Cores arrived with Hopper. TF32 and BF16 came with Ampere, and A100 has no native FP8 Tensor Cores."
    },
    {
      "q": "A Triton config has max_batch_size:16 and input dims:[-1]. What input shape should the client send?",
      "options": [
        "[-1] only; there is no batch dimension",
        "[batch, seq_len], with batch 1–16 and variable sequence length",
        "[16,-1]; every batch must have exactly 16 items",
        "[seq_len,16]"
      ],
      "answer": 1,
      "why": "A positive max_batch_size adds an implicit batch dimension before the configured dimensions. The batch may be any supported size up to 16."
    },
    {
      "q": "Users say the bot is slow to start answering, but total response time is acceptable. Which metric and stage best match the complaint?",
      "options": [
        "TPOT, decode stage",
        "TTFT, prefill and queueing",
        "Cluster throughput, decode stage",
        "p50 latency, tokenization"
      ],
      "answer": 1,
      "why": "TTFT measures time until the first token and is affected by prompt prefill and queueing. TPOT measures the gap between later tokens."
    },
    {
      "q": "A model has 32 layers, 8 KV heads, head dimension 128, and FP16 KV cache. About how much cache does one 4,096-token sequence use?",
      "options": [
        "256 MiB",
        "512 MiB",
        "1 GiB",
        "2 GiB"
      ],
      "answer": 1,
      "why": "Per token: 2 (K and V) × 32 × 8 × 128 × 2 bytes = 131,072 bytes = 128 KiB. Then 4,096 × 128 KiB = 512 MiB."
    },
    {
      "q": "Why will a TensorRT engine built on A100 not necessarily load on an H100 node?",
      "options": [
        "H100 does not support TensorRT",
        "The engine is specialized for GPU architecture and TensorRT version; rebuild for the target",
        "Engine files are locked to a physical GPU serial number",
        "The ONNX file was deleted"
      ],
      "answer": 1,
      "why": "TensorRT selects and tunes kernels for the target architecture. Portability limits depend on architecture and version, not an individual card’s serial number."
    },
    {
      "q": "Many tenants need small models under 10 GB on A100 GPUs, with hardware isolation between tenants. What is the best approach?",
      "options": [
        "Time-slice four pods on one GPU",
        "Partition GPUs with MIG and assign instances",
        "Use tensor parallelism 8",
        "Set nvidia.com/gpu:0.5 in the pod"
      ],
      "answer": 1,
      "why": "MIG gives each instance dedicated compute and memory isolation. Time-slicing does not isolate memory, and Kubernetes GPU resource requests are integers."
    },
    {
      "q": "An LLM service receives 20 requests per second and each request spends 3 seconds in the system on average. By Little’s law, how many requests are in the system on average?",
      "options": [
        "6.7",
        "23",
        "60",
        "600"
      ],
      "answer": 2,
      "why": "L = λ × W = 20 × 3 = 60 concurrent requests."
    },
    {
      "q": "An inference script calls model.eval() but not torch.no_grad(). What happens?",
      "options": [
        "Dropout stays active and outputs are random",
        "Layers use evaluation behavior, but autograd records a graph and uses unnecessary memory and compute",
        "The model automatically moves to CPU",
        "Nothing changes; eval() also disables gradients"
      ],
      "answer": 1,
      "why": "eval() changes layer behavior such as dropout and batch normalization, but does not stop autograd. Use no_grad() or inference_mode() to disable gradient tracking."
    }
  ]
};
