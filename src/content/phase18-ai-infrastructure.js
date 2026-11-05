export default {
  id: 'ai-infrastructure',
  number: 18,
  title: 'AI Infrastructure & Operations (NCA-AIIO)',
  titleSi: 'AI infrastructure, from GPUs to data centers and cloud',
  summary:
    'AI models need more than software: they also need GPUs, networks, storage, power, cooling, scheduling, and monitoring. In this phase, you will learn how to design, operate, and monitor accelerated data centers; choose between on-premises and cloud deployments; and select AWS GPU instances. These skills support preparation for the NVIDIA NCA-AIIO exam and help you reason about sizing GPU infrastructure. The phase builds on the GPU fundamentals from Phase 9.',
  duration: '3-5 weeks',
  topics: [
    {
      id: 'ai-adoption-drivers',
      plain: "Start with the nesting: deep learning is one kind of machine learning, and machine learning is one part of AI. AI also includes hand-written rule systems.",
      internGuide: ["Start with the nesting: deep learning is one kind of machine learning, and machine learning is one part of AI. AI also includes hand-written rule systems.","Connect adoption to four enablers: large datasets, parallel GPU compute, effective architectures such as Transformers, and accessible frameworks/cloud services.","Infrastructure matters because larger models turn a software idea into a capacity problem involving GPU memory, networking, storage, power, and cooling.","Exam check: if a question asks why modern AI scaled, choose the combination of data, accelerated compute, algorithms, and usable software—not one factor alone."],
      title: 'AI vs ML vs Deep Learning, and What Drove Recent AI Adoption',
      si: 'ඔයාට AI කියන්නේ බුද්ධිමත් වැඩ කරන පුළුල් අදහසක්, ML කියන්නේ data වලින් රටා ඉගෙන ගන්න ක්‍රමයක් කියලා හිතන්න. DL කියන්නේ ඒ ML වැඩේට neural network layers ගොඩක් යොදාගන්න එකයි. 2012දී AlexNet GPU භාවිතා කරලා image හඳුනාගැනීමේ වැඩේ හොඳට කළා. Data, GPU, Transformer සහ හොඳ software එක එකට ආ නිසා AI භාවිතය වැඩි වුණා. Colombo බැංකුවක ගනුදෙනු දහස් ගණනක් බලලා වංචා රටා හඳුනාගැනීමත් උදාහරණයක්.',
      body: [
        'Artificial intelligence (AI) is the broad field of making machines perform tasks that usually require human intelligence. Machine learning (ML) is one part of AI: instead of writing every rule by hand, we train a system to learn patterns from data. Deep learning (DL) is a type of ML that uses neural networks with many layers. ChatGPT, image-generation systems, and speech recognition use deep learning.',
        'Neural networks are not new, so why did AI adoption accelerate recently? Four factors came together: (1) the internet, smartphones, and sensors made much more data available; (2) GPUs made large-scale computation practical—AlexNet, trained on GPUs, won the 2012 ImageNet competition by a substantial margin; (3) the 2017 Transformer architecture made parallel training more effective for language models; and (4) software and cloud services, including CUDA, PyTorch, open-source models, and cloud GPUs, made the tools more accessible.',
        'For infrastructure design, the key point is that larger models require more compute. AI is therefore not only a software problem: GPUs, networks, power, and cooling are all part of the architecture an infrastructure architect must plan.',
      ],
      analogy:
        'Think of AI as cooking. With ML, the cook learns from examples of how dishes taste instead of following a complete recipe book. DL is like a large hotel kitchen where many teams work in layers. Data supplies the ingredients, GPUs provide the kitchen capacity, and algorithms such as Transformers provide an effective method.',
      example:
        'Consider fraud detection at a bank. A manually written rule might alert when a transaction exceeds Rs. 500,000 at 2 a.m.; that is a rule-based system, not ML. An ML model can learn fraud patterns from hundreds of thousands of past transactions. A DL model can learn less obvious patterns from transaction sequences. GPU compute can help train and run larger neural networks.',
      keyPoints: [
        'AI is the broad field; ML is part of AI; DL is a type of ML based on multilayer neural networks.',
        'Recent adoption drivers include more data, GPU compute, algorithms such as Transformers, and accessible software and cloud services.',
        'AlexNet’s 2012 ImageNet result demonstrated the potential of GPU-trained deep learning.',
        'Larger models make compute, networks, power, and cooling key architecture concerns.',
      ],
      terms: [
        { en: 'Artificial Intelligence (AI)', si: 'Methods that enable machines to perform tasks associated with human intelligence, including rule-based systems.' },
        { en: 'Machine Learning (ML)', si: 'A field of AI in which systems learn patterns from data instead of relying only on hand-written rules.' },
        { en: 'Deep Learning (DL)', si: 'A type of machine learning that uses neural networks with many layers; training can require substantial compute.' },
        { en: 'Generative AI', si: 'AI systems that generate new content such as text, images, code, or audio; large language models are an example.' },
        { en: 'AlexNet', si: 'An image-recognition model trained on GPUs that achieved a major result in the 2012 ImageNet competition.' },
      ],
    },
    {
      id: 'ai-use-cases-industry',
      plain: "Classify the workload first: prediction, anomaly detection, perception of images/audio/documents, or content generation.",
      internGuide: ["Classify the workload first: prediction, anomaly detection, perception of images/audio/documents, or content generation.","Translate the use case into requirements. Fraud detection needs low latency; imaging needs memory for large inputs; a chatbot needs model and KV-cache memory; factory inspection may need edge inference.","Keep the human and risk context visible: a clinical or credit model often supports a professional decision and needs stronger validation than a product recommender.","Exam check: select infrastructure from latency, data location, model size, concurrency, and regulation—not merely from the industry name."],
      title: 'Main AI Use Cases by Industry (with Sri Lankan Examples)',
      si: 'ඔයාට industry එකක් අනුව AI කරන වැඩ හතරක් මතක තියාගන්න පුළුවන්: ඉදිරිය අනුමාන කිරීම, අමුතු දේ හඳුනාගැනීම, රූප හෝ ලේඛන තේරුම්ගැනීම, සහ අලුත් පිළිතුරු හදන එක. බැංකුවක AI එක කාඩ් ගනුදෙනුවක් වංචාවක්ද බලන්න පුළුවන්. Telco එකක Colombo පාරක traffic වගේ network භාවිතය කලින් අනුමාන කරන්න පුළුවන්. රෝහලක X-ray රූප පරීක්ෂා කිරීමටත් AI භාවිතා කළ හැකියි. AI එක උදව් කරන මෙවලමක් මිස වෘත්තිකයා වෙනුවට තීරණ ගන්නා දෙයක් නොවන බවත් ඔයා මතක තියාගන්න.',
      body: [
        'The NCA-AIIO exam may ask how AI is used in different industries. A useful way to organize examples is by four tasks: predict an outcome, detect something unusual, interpret images/audio/documents, or generate content and responses.',
        'In financial services, examples include fraud detection, credit scoring, anti-money-laundering analysis, chatbots, and reading KYC forms. Telecommunications teams can forecast network traffic and capacity, predict customer churn, and build Sinhala- or Tamil-speaking call-center assistants. Retailers can forecast demand, recommend products, and identify empty shelves from images. Manufacturers can inspect apparel for defects and predict equipment maintenance needs.',
        'Healthcare uses include medical-image analysis of X-rays and CT scans, drug discovery, and summarizing clinical notes. Agriculture can use drone or satellite imagery to find crop disease and estimate yields. Tourism can use dynamic pricing, review analysis, and multilingual assistants. Transport can use route optimization; public services can digitize documents or analyze smart-city camera feeds.',
        'The use case affects the infrastructure choice. Fraud detection often needs low-latency, real-time inference on tabular data. Medical imaging uses large images and may need substantial GPU memory. A chatbot needs memory for an LLM and its concurrent requests. Factory-floor inspection may run on an edge device such as NVIDIA Jetson near the machine.',
      ],
      analogy:
        'AI is like a multi-tool: the same tool can serve different purposes, but you choose the right blade for each task. Industries also choose different models and hardware for their needs, while relying on shared foundations such as data and compute.',
      example:
        'Examples in Sri Lanka include a bank checking card transactions for fraud in real time; a telecom provider offering a plan to customers likely to cancel next month; a clothing factory finding sewing defects with a camera; a tea estate identifying diseased bushes in drone images; a hotel adjusting room prices by season; and a hospital screening X-rays for possible signs of TB.',
      keyPoints: [
        'Four broad AI task groups: prediction, anomaly detection, perception, and generation.',
        'Banking uses include fraud, credit, AML, and chatbots; telecom uses include churn prediction and network planning.',
        'Healthcare uses include medical imaging; retail uses include demand forecasts and recommendations.',
        'The use case determines latency, memory, and whether edge or data-center compute is appropriate.',
      ],
      terms: [
        { en: 'Predictive Maintenance', si: 'Using sensor data to estimate when a machine may need maintenance before it fails.' },
        { en: 'Visual Inspection', si: 'Using a camera and model to automatically identify defects in products.' },
        { en: 'Churn Prediction', si: 'Estimating which customers may stop using a service.' },
        { en: 'Recommender System', si: 'A system that suggests products or content a customer may be interested in.' },
        { en: 'Edge AI', si: 'Running a model where data is produced, such as on a camera, machine, or vehicle, rather than in a data center.' },
      ],
    },
    {
      id: 'gpu-vs-cpu-architecture',
      plain: "A CPU has fewer sophisticated cores and is good at serial, branch-heavy control work. A GPU has many execution units and is built for throughput on parallel work.",
      internGuide: ["A CPU has fewer sophisticated cores and is good at serial, branch-heavy control work. A GPU has many execution units and is built for throughput on parallel work.","Neural networks rely heavily on matrix operations whose many cells can be calculated together, so GPUs can keep many threads busy.","The CPU still runs the operating system, prepares data, and launches GPU work. Accelerated computing uses both processors for the work each handles well.","Exam check: GPU does not mean faster for every program. Small, serial, transfer-heavy, or branch-divergent work may remain better on a CPU."],
      title: 'GPU vs CPU Architecture: Why Parallelism Matters',
      si: 'ඔයා CPU එක හිතන්න වැඩ කිහිපයක් ඉක්මනින් කරන කෙනෙක් වගේ, GPU එක හිතන්න සරල ගණන් ගොඩක් එකවර කරන කණ්ඩායමක් වගේ. එකවර පින්තූර 1,000ක එකම ගණනය කරන්න GPU එක හොඳයි. වැඩේ එකම පියවරෙන් පියවර යන එකක් නම් CPU එක ප්‍රයෝජනවත් වෙන්න පුළුවන්. ක්‍රිකට් ලකුණු පුවරුවේ ක්‍රීඩකයන් දස දෙනාගේ සංඛ්‍යා එකවර එකතු කිරීම GPU වගේ වැඩක්. ඔයාගේ වැඩේට ගැළපෙන processor එක තෝරන්න ඕනේ.',
      body: [
        'A CPU is designed for low latency: finishing an individual task quickly. Its cores are sophisticated and use techniques such as large caches, branch prediction, and out-of-order execution. A server CPU usually has tens of cores, making it well suited to operating systems, databases, web servers, and branch-heavy logic.',
        'A GPU is designed for throughput: completing many operations at once. More of its chip area is devoted to compute units than to large caches and control logic. It has many simpler cores and high-bandwidth memory such as HBM. One GPU core may be less capable than one CPU core, but thousands of GPU cores can work in parallel.',
        'Neural networks spend much of their compute on matrix multiplication. Each result cell can often be calculated independently, so millions of small operations can run in parallel. Work that can be split into many independent tasks is often called embarrassingly parallel, and GPUs are well suited to it.',
        'A GPU does not replace the CPU. In a GPU server, the CPU loads and preprocesses data and coordinates work for the GPU. Accelerated computing combines the CPU for serial and control tasks with the GPU for parallel computation.',
      ],
      analogy:
        'A CPU is like a Formula 1 car that carries one passenger very quickly. A GPU is like a fleet of buses on the Colombo–Kandy route: each bus is slower, but the fleet can carry thousands of people in an hour. For a million independent matrix cells, the fleet can be the better fit.',
      example:
        'Suppose a matrix result has 1,000,000 cells. With 32 CPU cores, an even division gives 1,000,000 ÷ 32 = 31,250 cells per core. A GPU can calculate many cells in parallel, and Tensor Cores can process small matrix tiles. This can make a GPU a better fit for this workload, but not for a small serial task such as checking one user login.',
      keyPoints: [
        'CPUs optimize for low latency with a smaller number of sophisticated cores and large caches.',
        'GPUs optimize throughput with many simpler compute units and high-bandwidth memory.',
        'Neural-network matrix operations are highly parallel, which makes GPUs useful for many AI workloads.',
        'Accelerated computing combines CPU control and serial work with GPU parallel computation.',
      ],
      terms: [
        { en: 'Latency-optimized', si: 'A design focused on completing an individual task quickly, as CPUs often do.' },
        { en: 'Throughput-optimized', si: 'A design focused on completing many operations per unit of time, as GPUs often do.' },
        { en: 'Embarrassingly Parallel', si: 'A workload that can be divided into many independent tasks and run concurrently.' },
        { en: 'Accelerated Computing', si: 'Using an accelerator such as a GPU alongside a CPU to speed up parallel parts of a workload.' },
        { en: 'SIMT', si: 'Single Instruction, Multiple Threads: a GPU execution model in which many threads apply the same instruction to different data.' },
      ],
    },
    {
      id: 'cuda-programming-model',
      plain: "Name the locations: host means CPU and system RAM; device means GPU and GPU memory. Moving data between them has a cost.",
      internGuide: ["Name the locations: host means CPU and system RAM; device means GPU and GPU memory. Moving data between them has a cost.","A kernel is a GPU function. One launch creates a grid of blocks; each block contains threads, and hardware schedules threads in warps.","Threads in one block can cooperate through shared memory. Blocks are independently scheduled on streaming multiprocessors, so the grid exposes parallel work.","Performance check: avoid repeatedly copying small results across PCIe. Move useful batches to the GPU, perform several operations, then copy back only what is needed."],
      title: 'CUDA Programming Model: Kernels, Threads, Blocks, Grids, Host vs Device Memory',
      si: 'ඔයා CUDA කියන්නේ NVIDIA GPU එකට වැඩ බෙදාදෙන programming ක්‍රමයක් කියලා තේරුම්ගන්න. CPU එක host එක, GPU එක device එක, GPU එකේ එකම උපදෙස් කරන කුඩා thread ගොඩක් එකතු වෙලා blocks හදනවා. Colombo ගෙවල් 1,000කට ලිපි බෙදනවා වගේ, එක් එක් block එකට ලිපි කණ්ඩායමක් බෙදන්න පුළුවන්. CPU memory සහ GPU memory වෙන වෙනම නිසා data එහා මෙහා කිරීමත් කාලයක් ගන්නවා. බොහෝවිට PyTorch වගේ library එකක් මේ CUDA වැඩේ ඔයා වෙනුවෙන් කරනවා.',
      body: [
        'CUDA is NVIDIA’s platform and programming model for running work on NVIDIA GPUs. You may not write CUDA code every day because libraries such as PyTorch and TensorRT often do that for you. Understanding its basic terms helps infrastructure engineers reason about performance bottlenecks.',
        'The host is the CPU and its RAM; the device is the GPU and its memory, such as HBM or GDDR. A kernel is a function that runs on the GPU. When the host launches a kernel, many threads run the same function concurrently. Each thread uses its ID to work on its part of the data.',
        'CUDA organizes work as threads, blocks, and grids. A block is a group of threads, for example 256, that can share data in shared memory and runs on one streaming multiprocessor (SM). A grid contains all blocks in one kernel launch. Hardware schedules threads in groups of 32 called warps. See Phase 9, “GPU Hardware,” for more on warps and SMs.',
        'Host memory and device memory are separate. Data usually travels from CPU RAM to GPU memory across PCIe, which can be much slower than GPU HBM. Repeated copies can leave a GPU waiting. A common design is to copy data to the GPU once, perform several operations there, and copy back only the result. Technologies such as NVLink and GPUDirect can reduce some data-transfer costs.',
      ],
      analogy:
        'Imagine an A/L exam: the kernel is the same exam paper, each thread is a student answering their own paper, and a block is an exam hall supervised by one SM. Copying data from host to device is like transporting papers from Colombo to halls around the country; doing the work in the hall is fast, while transport takes time.',
      example:
        'The code below has an array of 1,000,000 values. With 256 threads per block, it needs ceil(1,000,000 ÷ 256) = 3,907 blocks. The final block has 192 extra threads that do no work because of the `i < size` check. Adding one to every value is quick on the GPU, but transferring the array to and from the GPU over PCIe may take longer. This is one reason a GPU may not help with small workloads.',
      code: {
        lang: 'python',
        src: `from numba import cuda
import numpy as np

@cuda.jit                          # kernel: a function that runs on the GPU
def add_one(arr):
    i = cuda.grid(1)               # this thread's index (block id * block size + thread id)
    if i < arr.size:               # extra threads do no work
        arr[i] += 1

host = np.zeros(1_000_000, dtype=np.float32)   # data in host (CPU) memory
dev = cuda.to_device(host)                     # copy over PCIe to device (GPU) memory
threads = 256                                  # threads per block (a multiple of 32)
blocks = (host.size + threads - 1) // threads  # number of blocks in the grid = 3907
add_one[blocks, threads](dev)                  # launch the kernel
result = dev.copy_to_host()                    # copy the result back to the CPU`,
      },
      keyPoints: [
        'Host = CPU + RAM. Device = GPU + GPU memory.',
        'A kernel is a GPU function; work is organized as threads, blocks, and grids, with 32-thread warps.',
        'A block runs on one SM, and its threads can share shared memory.',
        'PCIe transfers have a cost; keep data on the GPU while performing multiple operations when practical.',
      ],
      terms: [
        { en: 'CUDA', si: 'NVIDIA’s GPU programming platform and programming model, with libraries such as cuDNN and cuBLAS.' },
        { en: 'Kernel', si: 'A function launched by the host that runs concurrently across many GPU threads.' },
        { en: 'Thread / Block / Grid', si: 'A thread is one unit of work; a block groups threads on one SM; a grid contains all blocks in a kernel launch.' },
        { en: 'Host vs Device Memory', si: 'CPU RAM and GPU memory are separate address spaces, so data may need to be copied between them.' },
        { en: 'PCIe', si: 'A bus connecting the CPU with devices such as GPUs, network cards, and NVMe drives; it can be slower than GPU memory.' },
        { en: 'Unified Memory', si: 'A CUDA feature that lets CPU and GPU code use a shared pointer; the driver manages transfers, but transfer costs still exist.' },
      ],
    },
    {
      id: 'gpu-bottlenecks',
      plain: "Capacity asks whether the model and runtime state fit. Bandwidth asks how fast memory supplies data. Compute asks whether arithmetic units are the limiting resource.",
      internGuide: ["Capacity asks whether the model and runtime state fit. Bandwidth asks how fast memory supplies data. Compute asks whether arithmetic units are the limiting resource.","Also inspect outside the GPU: slow preprocessing, storage, PCIe copies, or multi-node communication can leave an expensive GPU waiting.","GPU-Util only reports activity during a sample; it does not prove all SMs or Tensor Cores are efficiently used. Correlate DCGM metrics, an Nsight timeline, and application throughput.","Fix the measured limit: reduce memory use, improve batching/precision, prefetch data, speed up storage/networking, or optimize kernels. Do not tune from one utilization number."],
      title: 'GPU Bottlenecks: Memory, Compute, Utilization',
      si: 'ඔයාගේ GPU එක වේගවත් වුණත් data ගෙනෙන මාර්ගය හෙමින් නම් මුළු වැඩේම හෙමින් යනවා. කඩේ කොත්තු හදන කෙනාට එළවළු නොලැබුණොත් එයා බලාගෙන ඉන්නවා වගේ. Memory-bound වැඩක data ගෙනෙන වේගය සීමාවක්, compute-bound වැඩක ගණනය කරන වේගය සීමාවක් වෙනවා. nvidia-smi එකේ 100% utilization කියන එක GPU එකේ හැම කොටසක්ම උපරිම වැඩ කළා කියන අර්ථය නෙවෙයි. ඔයා timeline එකත් memory සහ activity metrics එක්ක බලලා bottleneck එක හොයන්න.',
      body: [
        'GPU time is expensive, so investigate when a GPU spends too much time waiting. Four common limits are: (1) memory capacity—if the model, KV cache, and activations do not fit, the job may run out of memory or need a smaller batch; (2) memory bandwidth—data may arrive too slowly, making a workload memory-bound, as LLM decoding often is; (3) compute—there may be more arithmetic than the GPU can process quickly, as in large-batch training or prefill; and (4) external bottlenecks such as data loading, network communication, or PCIe transfers.',
        'A slow data loader can leave the GPU without input. In multi-GPU jobs, a slow network can make GPUs wait while exchanging gradients. Many PCIe copies can also limit performance.',
        'Interpret utilization metrics carefully. A 100% GPU-Util reading in nvidia-smi indicates that a kernel was active for most of the sampled time; it does not prove that all SMs were fully busy. For more detail, inspect DCGM SM and Tensor Core activity and an Nsight Systems timeline. GPU idle gaps often point to CPU-side preprocessing or data loading.',
        'Common remedies include increasing batch size when appropriate, using mixed precision such as FP16/BF16/FP8, adding data-loader workers and prefetching, using faster storage, reducing memory use with quantization, or using an optimized engine such as TensorRT.',
      ],
      analogy:
        'Think of a very fast kottu cook. Memory capacity is the size of the griddle, bandwidth is how quickly ingredients arrive, and compute is how quickly the cook chops. If the person preparing vegetables is slow, the cook waits. A “shop open” sign (100% GPU-Util) does not necessarily mean every part of the kitchen is busy.',
      example:
        'A training job shows GPU-Util fluctuating between 35% and 100%. The Nsight Systems timeline shows idle gaps between steps while the CPU decodes images. Increasing DataLoader `num_workers` from 2 to 8 and enabling `pin_memory` reduces the gaps and step time without changing the GPU. The bottleneck was on the CPU side.',
      keyPoints: [
        'Common limits include memory capacity, memory bandwidth, compute, data loading, networking, and PCIe transfers.',
        'LLM decoding is often memory-bound; large-batch training and prefill are often compute-bound.',
        '100% GPU-Util does not prove that the GPU is fully utilized; check SM/Tensor activity and timelines.',
        'Idle gaps often indicate a data-pipeline bottleneck.',
      ],
      terms: [
        { en: 'Memory-bound', si: 'A workload limited by the rate at which data can be read from or written to memory.' },
        { en: 'Compute-bound', si: 'A workload limited by the rate at which arithmetic operations can be completed.' },
        { en: 'Out of Memory (OOM)', si: 'An error that occurs when the model and data do not fit in available GPU memory.' },
        { en: 'Communication Overhead', si: 'Extra time spent exchanging data among GPUs in a multi-GPU job.' },
        { en: 'Data Loader Bottleneck', si: 'GPU idle time caused by the CPU or storage delivering data too slowly.' },
      ],
    },
    {
      id: 'training-vs-inference-hardware',
      plain: "Training updates weights and retains weights, gradients, optimizer state, and activations. Inference normally retains weights plus runtime state such as an LLM KV cache.",
      internGuide: ["Training updates weights and retains weights, gradients, optimizer state, and activations. Inference normally retains weights plus runtime state such as an LLM KV cache.","Training emphasizes aggregate throughput and time-to-train, so fast GPU-to-GPU links and shared storage matter. Serving emphasizes latency, throughput, availability, and cost per request.","Estimate memory before naming a GPU: parameter count times bytes per stored value is only the starting point; add training state or inference cache and runtime headroom.","Exam check: tightly coupled multi-GPU communication usually points to training; independent replicas behind a load balancer usually point to serving."],
      title: 'Hardware Needs: Training vs Inference, and Training Use Cases',
      si: 'ඔයා training කියන්නේ model එකට උදාහරණ පෙන්වා ඉගැන්වීම, inference කියන්නේ ඒ ඉගෙනගත් model එකෙන් අලුත් ප්‍රශ්නවලට පිළිතුරු ගැනීම කියලා වෙන්කරගන්න. Training වෙලාවේ weights පමණක් නොව gradients සහ optimizer data ද තබන නිසා වැඩි memory ඕනේ. Inference එකේදී ඉක්මන් පිළිතුරු සහ එක් ඉල්ලීමකට වැය වන මුදල වැදගත්. 8B model එකක් පූර්ණයෙන් train කිරීමත් එය chatbot එකකින් භාවිතා කිරීමත් එකම hardware ඉල්ලීමක් නොවේ. ඔයා තෝරාගන්නා hardware එක model ප්‍රමාණය, දත්ත සහ වේග අවශ්‍යතාව අනුව වෙනස් වෙනවා.',
      body: [
        'Training updates a model’s parameters; inference uses a trained model to produce results. Both can use GPUs, but their hardware needs differ.',
        'Training stores weights, gradients, optimizer states (Adam keeps two additional values per parameter), and activations, so it needs much more memory than inference. Training can run for days or weeks. Large models may use hundreds of GPUs, making fast interconnects such as NVLink and InfiniBand and shared storage important. Training targets include throughput and total time-to-train.',
        'Inference typically stores weights and, for an LLM, a KV cache. Its priorities are latency and cost per request. Traffic varies, so autoscaling may help. Smaller models may run on lower-power GPUs such as L4 or L40S; larger models may need GPUs with more memory, such as H100, and tensor parallelism. Quantization formats such as FP8, INT8, or INT4 and engines such as TensorRT can help optimize inference.',
        'Hardware varies by training task: tabular XGBoost may use a CPU or one GPU with RAPIDS; computer-vision fine-tuning may use one to four GPUs; LoRA/QLoRA fine-tuning of a 7B–8B model may fit on one 24–80 GB GPU, depending on settings; full fine-tuning may use an eight-GPU NVLink node with FSDP or ZeRO; foundation-model pretraining may require many nodes, a fast fabric, parallel storage, and weeks of runtime. Larger models, datasets, or tighter schedules generally increase compute, network, and storage requirements.',
        'As a simple design heuristic, training often uses a tightly coupled cluster for long jobs, while inference often uses independent replicas behind a load balancer. GPUs in a training cluster communicate frequently; inference replicas usually do not communicate with one another.',
      ],
      analogy:
        'Training is like a multi-year medical degree: it needs a campus (cluster), many books (storage), communication among lecturers (network), and time. Inference is like seeing patients at a clinic after graduation. Each visit is shorter, and more doctors (replicas) can be added when more patients arrive.',
      example:
        'For a 7B-parameter model in BF16, weights alone take about 7 billion × 2 bytes = 14 GB; inference also needs KV-cache memory. An L4 with 24 GB may fit at low concurrency, subject to runtime needs. Full fine-tuning with Adam can use roughly 16 bytes per parameter for weights, gradients, master weights, and optimizer states: 7 billion × 16 bytes = 112 GB, before activations. This may require sharding across several GPUs. LoRA freezes base weights and trains smaller adapters, reducing memory needs. Pretraining a large foundation model from scratch can require many nodes and substantial time, which is why many organizations fine-tune an existing open model.',
      keyPoints: [
        'Training memory = weights + gradients + optimizer states + activations. Inference = weights + KV cache.',
        'Training emphasizes throughput, fast interconnects, shared storage, and long-running jobs.',
        'Inference emphasizes latency, cost per request, autoscaling, and quantization.',
        'Training = tightly coupled cluster. Inference = independent replicas behind a load balancer.',
        'Use case ladder: classic ML → CPU/1 GPU, LoRA → 1 GPU, full fine-tune → 8-GPU node, pretraining → SuperPOD class.',
      ],
      terms: [
        { en: 'Optimizer States', si: 'Additional values, such as momentum and variance, that an optimizer like Adam stores for each parameter.' },
        { en: 'Activations', si: 'Intermediate outputs produced in the forward pass and retained for the backward pass.' },
        { en: 'Time-to-Train', si: 'The total time needed to finish training a model.' },
        { en: 'Cost per Inference', si: 'The average cost of serving one inference request.' },
        { en: 'ZeRO / FSDP', si: 'Methods that shard optimizer states, gradients, or weights across GPUs to reduce per-GPU training memory.' },
        { en: 'LoRA / QLoRA', si: 'Fine-tuning methods that train small adapter matrices rather than all model weights; QLoRA also quantizes the base model to 4-bit.' },
        { en: 'Full Fine-tuning vs Pretraining', si: 'Full fine-tuning updates all weights of an existing model; pretraining builds a foundation model from large datasets.' },
      ],
    },
    {
      id: 'accelerated-cluster-anatomy',
      plain: "Draw five boxes: GPU compute nodes, management/head nodes, high-speed network, shared storage, and the software/scheduler layer. Power and cooling support all five.",
      internGuide: ["Draw five boxes: GPU compute nodes, management/head nodes, high-speed network, shared storage, and the software/scheduler layer. Power and cooling support all five.","Separate traffic by purpose: compute collectives, storage I/O, normal in-band administration, and out-of-band BMC access for recovery.","DGX is a complete NVIDIA system; HGX is a GPU platform used inside partner servers. Scaling up adds capability within a node, while scaling out connects nodes.","Exam check: a SuperPOD is a validated cluster design combining systems, fabric, storage, and management—not a single large GPU server."],
      title: 'Parts of an Accelerated Cluster and Scaling (DGX, HGX, SuperPOD)',
      si: 'ඔයා AI cluster එකක් GPU servers පමණක් එකතු කළ දෙයක් කියලා නොසිතන්න. Compute nodes, management nodes, network, storage සහ විදුලිය හා සිසිලනය ඒකේ කොටස්. DGX එකක් GPU server එකක්; HGX කියන්නේ GPU platform එකක්; SuperPOD කියන්නේ විශාල පද්ධතියක් ලෙස සම්බන්ධ කළ rack සහ පද්ධති සමූහයක්. ක්‍රිකට් කණ්ඩායමකට පිතිකරුවන් විතරක් නොව පුහුණුකරු සහ පිටියත් ඕනේ වගේ මෙතනත් සියලු කොටස් එකට වැඩ කරන්න ඕනේ. GPU ගණන වැඩි කරන විට network එකද හොඳින් සැලසුම් කළ යුතුයි.',
      body: [
        'An AI cluster is more than GPU servers in racks. It includes compute nodes, such as a DGX H100 with eight H100 GPUs connected by NVLink/NVSwitch and 640 GB of total GPU memory; management or head nodes that run the scheduler and provide user access; and shared high-performance storage for datasets and checkpoints.',
        'Clusters use distinct networks: a high-speed compute fabric, such as InfiniBand or RoCE Ethernet, for training traffic between nodes; a storage network; an in-band management network for operating-system updates, SSH, and monitoring; and an out-of-band network to reach server BMCs even when the operating system is unavailable. The software stack includes the OS, drivers, CUDA, containers, a scheduler, monitoring, and cluster management.',
        'DGX is a complete NVIDIA-built system with software and support. HGX is an NVIDIA GPU baseboard used by server partners such as Dell, HPE, and Supermicro. Scaling up adds GPUs within a node and its NVLink domain; scaling out connects more nodes through a network.',
        'DGX SuperPOD is an NVIDIA reference architecture that combines DGX nodes, a high-speed fabric, storage, and management software as a validated AI infrastructure design. It is built from Scalable Units (SUs), which can be added as capacity grows. Remember the combination of nodes, network, storage, and software. BasePOD is a smaller enterprise reference architecture.',
      ],
      analogy:
        'A cluster is like a large garment factory: compute nodes are production lines, a head node is the manager’s office, storage is the fabric warehouse, and the compute fabric moves materials between lines. In-band management is the factory intercom; out-of-band management is a guard’s radio that still works if the main system is down. A SuperPOD is a group of factories built to a validated design, with more capacity added in SUs.',
      example:
        'A telecom team starts an LLM fine-tuning cluster with four DGX/HGX nodes, or 32 GPUs. The nodes connect to an InfiniBand compute fabric, shared NFS or parallel storage, and a separate 1-GbE management switch for BMC access. Two head nodes provide high availability for the Slurm controller and cluster manager. Before adding four more nodes the following year, the team checks fabric ports, storage throughput, and rack power and cooling.',
      keyPoints: [
        'Cluster = compute nodes + head/management nodes + storage + networks + software.',
        'Networks include compute (east-west), storage, in-band management, and out-of-band BMC access.',
        'DGX is a complete system; HGX is a baseboard used in partner-built servers.',
        'Scale up within a node; scale out across nodes.',
        'SuperPOD = Scalable Units වලින් හදන validated reference architecture.',
      ],
      terms: [
        { en: 'Compute Node', si: 'A server containing GPUs on which cluster jobs run.' },
        { en: 'Head / Management Node', si: 'A server that runs scheduler, cluster-management, and user-login services.' },
        { en: 'BMC', si: 'Baseboard Management Controller: a component that manages server power, console, and sensors independently of the server OS.' },
        { en: 'Out-of-band Management', si: 'A separate management network used to reach BMCs, independent of production traffic.' },
        { en: 'East-West vs North-South Traffic', si: 'East-west traffic moves between servers inside a data center; north-south traffic enters or leaves it, such as user or internet traffic.' },
        { en: 'DGX SuperPOD / Scalable Unit', si: 'An NVIDIA validated large-scale AI cluster design; an SU is a building block used to expand it.' },
        { en: 'DGX BasePOD', si: 'A smaller NVIDIA DGX reference architecture for enterprise deployments.' },
      ],
    },
    {
      id: 'datacenter-power-cooling',
      plain: "Start with IT load in kilowatts per server and rack. Almost all consumed electrical energy becomes heat that the facility must remove.",
      internGuide: ["Start with IT load in kilowatts per server and rack. Almost all consumed electrical energy becomes heat that the facility must remove.","Check power delivery end to end: utility capacity, redundant feeds, UPS/generator, rack PDU, connectors, and per-circuit limits. A nameplate maximum is not an average-use estimate.","Air cooling can serve lower densities; high-density systems may require rear-door or direct-to-chip liquid cooling plus CDUs, plumbing, water-quality control, and leak detection.","Use PUE to include facility overhead: total facility power divided by IT power. Also validate rack weight, floor loading, space, humidity, and maintainability."],
      title: 'Data Center Power, Cooling and Facility Requirements',
      si: 'ඔයා GPU rack එකක් දාන්න කලින් ගොඩනැගිල්ලට අවශ්‍ය විදුලිය සහ සිසිලනය සැපයිය හැකිද බලන්න. GPUs වැඩ කරන විට විදුලිය භාවිතා කර තාපය නිපදවන නිසා cooling ඕනේ. උදාහරණයක් ලෙස rack එකක් 30 kW භාවිතා කරනවා නම්, ඒ තරම් තාපය ඉවත් කිරීමටත් facility එක සැලසුම් කළ යුතුයි. Air cooling හෝ liquid cooling තෝරන්නේ උපකරණ සහ පහසුකම් අනුවයි. ඔයාගේ මුළු පිරිවැයට power, cooling, rack ඉඩ සහ backup පද්ධතිත් ඇතුළත් කරන්න.',
      body: [
        'GPU servers use substantial power. A typical enterprise rack may use only several kilowatts, while one eight-GPU AI server can use around 10 kW; a DGX H100 is slightly above that at maximum power. Several such servers can exceed the power density of older data-center designs. Rack-scale systems such as the Blackwell GB200 NVL72 exceed 100 kW per rack and use liquid cooling.',
        'Facility planning must check whether each rack has sufficient power feeds, redundancy such as A/B feeds, UPS and generators, and compatible PDUs. Nearly all electrical power used by IT equipment becomes heat, so higher power requires correspondingly greater cooling capacity.',
        'Air cooling uses fans and CRAC/CRAH units, often with hot-aisle and cold-aisle containment. It is straightforward, but becomes harder at high rack density. Liquid cooling moves heat with water or another coolant: direct-to-chip cold plates, rear-door heat exchangers, or immersion cooling. High-density AI racks increasingly use liquid cooling, which requires facility provisions such as pipes, coolant distribution units (CDUs), and leak detection.',
        'Power Usage Effectiveness (PUE) is total data-center power divided by IT equipment power. A PUE of 1.0 means all power goes to IT; at 1.5, each 1 kW for IT is accompanied by 0.5 kW for cooling, lighting, and other facility needs. Also check floor loading, extensive fiber cabling, available space, and the cooling costs of a hot, humid climate such as Sri Lanka’s.',
      ],
      analogy:
        'An older data center is like a home kitchen wired for a rice cooker and kettle. AI racks are like adding ten industrial hotel ovens: the wiring may be inadequate and the room overheats. A fan alone may not be enough; the facility may need upgraded power and liquid cooling.',
      example:
        'Suppose a Sri Lankan bank’s data center limits each rack to 8 kW and needs four eight-GPU servers using about 10 kW each, or about 40 kW total. Options include splitting the servers across four racks, upgrading a high-density rack’s power and cooling, or using a GPU-ready colocation site or cloud. At a PUE of 1.6, 40 kW of IT load requires about 40 × 1.6 = 64 kW for the whole facility.',
      keyPoints: [
        'AI racks have much higher power density than older racks; electrical power becomes heat.',
        'Air cooling is simple but has density limits; liquid options include direct-to-chip, rear-door, and immersion cooling.',
        'PUE = total facility power ÷ IT power; values closer to 1.0 indicate less overhead.',
        'Check power feeds and redundancy, cooling, floor loading, cabling, and space.',
      ],
      terms: [
        { en: 'Power Density', si: 'The amount of electrical power, measured in kW, used by a rack; AI racks often have high power density.' },
        { en: 'PUE', si: 'Power Usage Effectiveness: total facility power divided by IT power; lower values indicate less facility overhead.' },
        { en: 'Hot / Cold Aisle Containment', si: 'Separating cold-air intake aisles from hot-air exhaust aisles to improve air-cooling efficiency.' },
        { en: 'Direct-to-Chip Liquid Cooling', si: 'Removing heat by circulating coolant through cold plates attached to GPUs or CPUs.' },
        { en: 'Rear-Door Heat Exchanger', si: 'A water-coil heat exchanger in a rack’s rear door that captures hot exhaust air.' },
        { en: 'Immersion Cooling', si: 'Cooling servers by submerging them in a non-conductive coolant.' },
        { en: 'UPS / PDU', si: 'A UPS supplies temporary backup power; a PDU distributes power to servers in a rack.' },
      ],
    },
    {
      id: 'onprem-cloud-hybrid',
      plain: "Compare on-premises and cloud using the same workload assumptions: hours used, GPU count, storage, data transfer, staffing, facilities, and required availability.",
      internGuide: ["Compare on-premises and cloud using the same workload assumptions: hours used, GPU count, storage, data transfer, staffing, facilities, and required availability.","On-premises offers control and can be economical at steady high use, but needs capital, procurement time, operations staff, and spare capacity. Cloud starts quickly and scales, but idle endpoints and data movement can be expensive.","Hybrid places regulated or steady workloads on-premises and uses cloud for bursts, experiments, or disaster recovery. Portability still requires compatible drivers, containers, data access, and identity controls.","Decision check: use total cost of ownership and constraints over the planned lifetime; do not compare a cloud hourly rate only with the purchase price of a server."],
      title: 'On-Premises vs Cloud vs Hybrid: Advantages, Challenges, Cost',
      si: 'ඔයා on-premises කියන්නේ තමන්ගේම ස්ථානයේ servers තබා පාලනය කිරීම, cloud කියන්නේ cloud provider ගෙන් පරිගණක සම්පත් කුලියට ගැනීම කියලා හිතන්න. On-premises එකේ මුලින් විශාල ආයෝජනයක් සහ මෙහෙයුම් කණ්ඩායමක් ඕනේ, නමුත් දත්ත හා පරිසරය පිළිබඳ පාලනය වැඩියි. Cloud එකෙන් ඉක්මනින් ආරම්භ කර අවශ්‍ය විට GPU වැඩි කරන්න පුළුවන්, නමුත් දිගටම භාවිතා කරන වියදම ගණනය කරන්න ඕනේ. Hybrid ක්‍රමයක දෙකම යොදාගන්න පුළුවන්. Colombo බැංකුවක් රහස් දත්ත on-prem තබා පරීක්ෂණ වැඩ cloud එකේ කරන්න තීරණය කළ හැකියි.',
      body: [
        'On-premises means buying GPUs for your own data center or a colocation facility. Benefits include control over data residency and hardware, and potentially lower long-term cost when GPUs run continuously. Challenges include high upfront capital expenditure (CapEx), procurement lead times, power and cooling, skilled staff, hardware aging, and paying for capacity even when it is idle.',
        'Cloud means renting GPU instances from providers such as AWS, Azure, or Google Cloud. Benefits include no large upfront purchase, rapid startup, access to newer GPUs, flexible scaling, and managed services such as SageMaker AI and EKS. Challenges include higher cost for continuous use, quotas and availability for large GPUs, data-egress charges, regulatory concerns about data location, and vendor lock-in.',
        'A hybrid design uses both. Sensitive data and steady inference might remain on-premises, while experiments or temporary training bursts run in the cloud. Another option is cloud development and testing with on-premises production. Shared container images, Kubernetes, or a software stack such as NVIDIA AI Enterprise can help keep environments consistent.',
        'Utilization is a key cost factor. On-premises total cost of ownership (TCO) over three to five years includes hardware, facility, power, staff, and support. Cloud cost is the hourly price multiplied by the hours used. High, steady use may favor on-premises; small, spiky, or experimental use may favor cloud. Reserved or savings plans and spot instances may reduce cloud costs.',
      ],
      analogy:
        'On-premises is like buying a car: it costs a lot up front and you are responsible for insurance, servicing, and parking, but it may pay off if you travel every day. Cloud is like using PickMe or Uber: there is little upfront cost and it is available when needed, but repeated long trips can add up. Hybrid is like owning a car and renting a van for a large trip.',
      example:
        'Illustrative assumptions: on-premises GPU-server TCO is Rs. 300 million over three years, while an equivalent on-demand cloud instance costs Rs. 20 million per month. At 24/7 use, the costs are equal after Rs. 300m ÷ Rs. 20m = 15 months; after that, on-premises costs less under these assumptions. At six hours of daily use, cloud costs about Rs. 5 million per month, or Rs. 180 million over three years, so cloud costs less. Use actual quotes, discounts, and staffing costs for a real decision.',
      keyPoints: [
        'On-premises offers control and data residency and may cost less at high utilization; challenges include CapEx, lead time, facilities, and staffing.',
        'Cloud offers speed, elasticity, newer GPUs, and managed services; consider continuous-use cost, capacity, egress, and lock-in.',
        'Hybrid keeps sensitive or steady workloads on-premises and can use cloud for bursts; a consistent software stack helps.',
        'A key decision variable is utilization: the number of hours GPUs are busy.',
      ],
      terms: [
        { en: 'CapEx vs OpEx', si: 'CapEx is a large upfront purchase of assets; OpEx is an ongoing cost based on usage.' },
        { en: 'TCO', si: 'Total Cost of Ownership: the full cost, including hardware, power, cooling, staff, and support.' },
        { en: 'Data Residency', si: 'A legal or organizational requirement governing the country or location where data is stored.' },
        { en: 'Cloud Bursting', si: 'Temporarily moving extra workloads to the cloud when on-premises capacity is insufficient.' },
        { en: 'Egress Cost', si: 'A charge for transferring data out of a cloud provider.' },
        { en: 'Spot / Reserved Instances', si: 'Spot capacity is discounted and can be reclaimed; reserved instances or savings plans offer discounts for a longer commitment.' },
      ],
    },
    {
      id: 'ai-networking',
      plain: "NVLink/NVSwitch connect GPUs at very high speed inside a server or NVLink domain. InfiniBand or Ethernet/RoCE connects different nodes.",
      internGuide: ["NVLink/NVSwitch connect GPUs at very high speed inside a server or NVLink domain. InfiniBand or Ethernet/RoCE connects different nodes.","RDMA lets one machine access another machine’s memory with less CPU/kernel involvement. GPUDirect RDMA extends the fast path to GPU memory.","Distributed training uses collectives such as all-reduce, so bandwidth, latency, topology, congestion control, and NCCL configuration can determine scaling efficiency.","Exam check: Spectrum-X is an NVIDIA Ethernet platform; it is not another name for InfiniBand. Select and tune a fabric as an end-to-end system."],
      title: 'Networking for AI: InfiniBand, Ethernet/RoCE, NVLink, RDMA, GPUDirect, Spectrum-X',
      si: 'ඔයා එකම server එකේ GPU දෙකක් සම්බන්ධ කරන NVLink සහ servers අතර සම්බන්ධ කරන network එක වෙන්කර හඳුනාගන්න. RDMA මඟින් server දෙකක memory අතර CPU වැඩ අඩුවෙන් data ගෙනියන්න පුළුවන්. InfiniBand AI සහ HPC වැඩවලට සැලසුම් කළ network එකක්; RoCE කියන්නේ Ethernet මත RDMA යැවීමයි. RoCE එකේ traffic තදබදය හොඳින් පාලනය කළ යුතුයි. Colombo සිට Kandy දක්වා බඩු ගෙනයන මාර්ගය තෝරනවා වගේ, ඔයා cluster එකේ data මාර්ගයත් workload එකට ගැළපෙන්න සැලසුම් කරන්න.',
      body: [
        'Phase 9 introduced NVLink, NVSwitch, InfiniBand, GPUDirect RDMA, and NCCL. At data-center scale, distinguish three network layers: GPU-to-GPU within a node via NVLink/NVSwitch; the compute fabric between nodes, using InfiniBand or Ethernet; and separate networks for users, storage, and management.',
        'Remote Direct Memory Access (RDMA) transfers data directly between the memory of two servers without routing it through the OS kernel, reducing CPU work and latency. GPUDirect RDMA provides a direct path from GPU memory to a network interface card (NIC). Distributed-training traffic such as NCCL all-reduce can use this path.',
        'InfiniBand was designed for HPC and AI, with low latency, native RDMA, and lossless credit-based flow control. NVIDIA Quantum InfiniBand switches support SHARP, which can perform parts of collective reductions such as all-reduce in the network and reduce data movement. RoCE v2 carries RDMA over Ethernet using UDP/IP. It can reuse Ethernet skills and tools, but RDMA is sensitive to packet loss, so congestion controls such as ECN and PFC must be configured carefully.',
        'NVIDIA Spectrum-X is an Ethernet platform for AI that combines Spectrum-4 switches and BlueField-3 SuperNICs with adaptive routing and congestion control. AI fabrics are commonly designed as non-blocking leaf-spine or fat-tree networks. In a rail-optimized design, the same GPU position in each node connects to the same leaf switch. A GPU may have a dedicated high-speed NIC, for example 400 Gb/s, depending on the design.',
      ],
      analogy:
        'NVLink is like doors between rooms in one house; the compute fabric is like an expressway between towns. InfiniBand is a purpose-built expressway with flow control, while RoCE uses an Ethernet highway and needs careful traffic management. RDMA is like a courier delivering a parcel directly rather than routing it through a post office.',
      example:
        'Consider a 16-node cluster with 128 GPUs. One option is InfiniBand, which the team knows less well but may require less performance tuning. Another is a 400-GbE RoCE fabric with Spectrum-X, which may fit a bank team already experienced with Ethernet and its monitoring tools. Both can work; RoCE requires careful lossless and congestion-control settings. Keep the compute fabric separate from the office network, and use NCCL all-reduce bandwidth tests to investigate slow jobs.',
      keyPoints: [
        'Network layers: NVLink/NVSwitch within a node, compute fabric between nodes, and separate storage/management networks.',
        'RDMA bypasses much of the CPU/OS path; GPUDirect RDMA connects GPU memory to a NIC.',
        'InfiniBand provides native RDMA and supports SHARP in-network reductions.',
        'RoCE v2 carries RDMA over Ethernet and requires careful congestion control; Spectrum-X is NVIDIA’s AI Ethernet platform.',
        'AI fabrics often use non-blocking leaf-spine/fat-tree and rail-optimized designs.',
      ],
      terms: [
        { en: 'RDMA', si: 'Remote Direct Memory Access: memory-to-memory transfer between servers that avoids much of the OS-kernel and CPU path.' },
        { en: 'RoCE v2', si: 'RDMA over Converged Ethernet; it uses UDP/IP and can be routed.' },
        { en: 'InfiniBand', si: 'A lossless, low-latency, RDMA-native network designed for HPC and AI, including NVIDIA Quantum switches.' },
        { en: 'SHARP', si: 'NVIDIA in-network computing technology that performs parts of collective reductions such as all-reduce in InfiniBand switches.' },
        { en: 'Spectrum-X', si: 'NVIDIA’s AI Ethernet platform combining Spectrum-4 Ethernet switches and BlueField-3 SuperNICs.' },
        { en: 'ECN / PFC', si: 'Ethernet congestion notification (ECN) and queue pausing (PFC), used to manage congestion for RoCE.' },
        { en: 'Leaf-Spine / Fat-Tree', si: 'Switch topologies designed to provide consistent high bandwidth between nodes.' },
        { en: 'Rail-Optimized Topology', si: 'A design connecting the same GPU/NIC position in each node to the same leaf switch.' },
        { en: 'GPUDirect', si: 'A family of technologies enabling direct access paths between GPU memory and NICs, storage, or other GPUs.' },
      ],
    },
    {
      id: 'ai-storage',
      plain: "Separate the I/O patterns: many workers reading training samples, every rank writing checkpoints, and serving nodes loading model weights. Each stresses storage differently.",
      internGuide: ["Separate the I/O patterns: many workers reading training samples, every rank writing checkpoints, and serving nodes loading model weights. Each stresses storage differently.","Capacity alone is insufficient. Measure aggregate throughput, IOPS for small files, metadata performance, latency, network bandwidth, durability, and recovery time.","Parallel file systems spread work across storage servers. Local NVMe is fast scratch/cache; object storage is durable and scalable but is not automatically a POSIX file system.","GPUDirect Storage can reduce CPU bounce-buffer work on supported paths, but it cannot repair slow disks, poor sharding, or a saturated storage network."],
      title: 'Storage for AI: Parallel File Systems, GPUDirect Storage, Checkpoint I/O',
      si: 'ඔයාගේ GPU එකට training data ඉක්මනින් නොලැබුණොත් මිල අධික GPU එකත් නිකම් බලාගෙන ඉන්නවා. Parallel file system එකක servers කිහිපයක් එකට දත්ත කියවීම සහ ලිවීම නිසා බොහෝ compute nodes එකවර භාවිතා කළ හැකියි. Training අතර checkpoint එකක් ලියන්නේ වැඩේ තත්ත්වය සුරැකීමටයි, එවිට බිඳවැටීමකින් පසු නැවත ආරම්භ කළ හැකියි. GPUDirect Storage මඟින් storage සහ GPU memory අතර data ගමනේ CPU පිටපත් අඩු කළ හැකියි. ඔයා dataset, checkpoint සහ model archive සඳහා ධාරිතාවත් වේගයත් වෙන වෙනම සලකා බලන්න.',
      body: [
        'GPUs need data to stay busy; slow storage can leave expensive accelerators waiting. AI storage serves three purposes: reading training data such as large image collections or terabytes of text, writing and reading checkpoints, and retaining models and datasets for the long term.',
        'A parallel file system stripes data across multiple storage servers so many compute nodes can read and write through one file system at high throughput. Examples include Lustre, IBM Storage Scale (GPFS), WEKA, and DDN. A single NFS server may become a bottleneck under heavy concurrent access. Clusters often use tiers: local NVMe for cache or scratch, a fast parallel file system for hot data, and lower-cost object storage such as S3 for cold data and archives.',
        'GPUDirect Storage (GDS) can create a direct DMA path from NVMe, NVMe-oF, or a parallel file system to GPU memory, avoiding the usual CPU-memory bounce buffer. This can reduce CPU work and latency and increase bandwidth. Applications use the cuFile API directly or through libraries.',
        'Large training jobs periodically write checkpoints—snapshots of model and optimizer state—so they can resume after a node failure. Optimizer state can make a checkpoint several times larger than the weights. When many GPUs write at once, they create a burst that may leave them waiting. Remedies include faster write bandwidth, asynchronous checkpointing through local NVMe or CPU memory to shared storage, and a suitable checkpoint frequency.',
      ],
      analogy:
        'Storage is like a shop warehouse. A single-server NFS system is one door where 100 cooks may queue; a parallel file system is a warehouse with many doors and stock distributed across racks. GPUDirect Storage is a conveyor from the warehouse to the griddle that skips the CPU-memory table. A checkpoint is like photocopying an exam paper periodically so completed work is not lost after a power failure.',
      example:
        'An 8B-parameter full-fine-tuning checkpoint at about 16 bytes per parameter is roughly 8 × 16 = 128 GB. At 2 GB/s, writing it takes 128 ÷ 2 = 64 seconds, during which GPUs may wait. Saving every 30 minutes would spend about a minute in each interval writing. A 20-GB/s parallel file system reduces the write time to 128 ÷ 20 = 6.4 seconds. Asynchronous checkpointing can further reduce GPU idle time.',
      keyPoints: [
        'AI storage supports training-data reads, checkpoint writes/reads, and long-term retention.',
        'Parallel file systems stripe data to serve many nodes at high throughput.',
        'Common storage tiers are local NVMe, a parallel file system, and object storage.',
        'GDS provides a direct DMA path from storage to GPU memory using cuFile.',
        'Checkpoint I/O creates write bursts; consider bandwidth, asynchronous writes, and frequency.',
      ],
      terms: [
        { en: 'Parallel File System', si: 'A file system that stripes data across storage servers to provide high throughput to many clients, such as Lustre or IBM Storage Scale.' },
        { en: 'GPUDirect Storage (GDS)', si: 'A direct data path between storage and GPU memory that avoids a CPU-memory bounce buffer.' },
        { en: 'cuFile', si: 'A CUDA API used by applications to access GPUDirect Storage.' },
        { en: 'Checkpoint', si: 'A saved snapshot of a model and its optimizer state during training.' },
        { en: 'NVMe / NVMe-oF', si: 'NVMe is a fast SSD protocol; NVMe-oF carries NVMe commands over a network fabric.' },
        { en: 'Object Storage', si: 'Large, often lower-cost storage accessed through an HTTP API, commonly used for archives and data lakes.' },
      ],
    },
    {
      id: 'bluefield-dpu',
      plain: "A DPU is a programmable infrastructure processor with networking, CPU cores, accelerators, and isolation features. It sits on the data path rather than replacing the host CPU or GPU.",
      internGuide: ["A DPU is a programmable infrastructure processor with networking, CPU cores, accelerators, and isolation features. It sits on the data path rather than replacing the host CPU or GPU.","BlueField can offload networking, storage, security, telemetry, and virtualization tasks, leaving host CPU cycles for the application.","Its separate control domain can help isolate infrastructure services from tenants, which is useful in multi-tenant or zero-trust designs.","Exam check: use a DPU when infrastructure offload or isolation solves a measured need; it does not make model computation itself run like a GPU."],
      title: 'BlueField DPUs: What They Offload and Why',
      si: 'ඔයා DPU එකක් කියන්නේ network සහ infrastructure වැඩ කිහිපයක් CPU එකෙන් ඉවත් කර කරන processor එකක් ලෙස හිතන්න. BlueField DPU එකට networking, security සහ storage වැනි දත්ත මධ්‍යස්ථාන වැඩ පැවරිය හැකියි. එවිට CPU එකට application වැඩ සඳහා වැඩි ඉඩක් ලැබෙනවා. හෝටලයක ආරක්ෂක සහ බෙදාහැරීම් කණ්ඩායම කුස්සියේ වැඩෙන් වෙනම කටයුතු කරනවා වගේ මෙය තේරුම්ගන්න. DPU එක GPU එක වෙනුවට model එක train කරන දෙයක් නොවෙයි.',
      body: [
        'A server CPU can spend substantial time on infrastructure work rather than applications: virtual networking, overlay networks, virtual switches, storage protocols, encryption, firewalls, and telemetry. This uses cores that could otherwise support the AI pipeline, such as data loading.',
        'A Data Processing Unit (DPU) is a PCIe device with its own Arm CPU cores, a high-speed network interface such as ConnectX, and networking, storage, and security accelerators. NVIDIA’s DPU family is BlueField, including BlueField-3. It acts like a small computer inside the server and can be programmed with the NVIDIA DOCA SDK.',
        'BlueField can offload networking tasks such as virtual switching with OVS, overlay networks, RoCE/RDMA, and congestion control; storage tasks such as NVMe-oF, virtualization, compression, and encryption; and security tasks such as firewalls, IPsec/TLS encryption, micro-segmentation, and isolation.',
        'DPUs can free CPU cores for applications, isolate infrastructure control from the host OS, and use hardware accelerators for high-rate processing. This isolation is useful in multi-tenant and zero-trust environments. Systems such as DGX H100 use BlueField-3 DPUs. The BlueField-3 SuperNIC in Spectrum-X belongs to the same family and is optimized for AI network traffic.',
      ],
      analogy:
        'A server CPU is like a bank manager who should decide large loans but is instead busy stamping cheques, checking security, and sorting mail. A DPU is like a separate back-office team handling those tasks. Its security rules are also separated from the manager’s office.',
      example:
        'A telecom provider shares GPU servers among business units in a private cloud. Each tenant needs its own overlay network, encryption, and firewall rules. Running all of this on the host CPU consumes cores and can expose policies if the host is compromised. With BlueField, OVS, encryption, and firewall tasks run on the DPU, freeing host cores for data preprocessing and isolating network policy from the host.',
      keyPoints: [
        'A DPU is a programmable chip with Arm cores, a ConnectX NIC, and accelerators. NVIDIA’s DPU family is BlueField, and its SDK is DOCA.',
        'Offload: networking (OVS, overlays, RDMA), storage (NVMe-oF, encryption), security (firewall, IPsec/TLS).',
        'Benefits include freed CPU cores, infrastructure and tenant isolation, and high-rate processing.',
        'CPU = applications, GPU = accelerated compute, DPU = data center infrastructure.',
      ],
      terms: [
        { en: 'DPU', si: 'A programmable processor that offloads networking, storage, and security infrastructure tasks from the host CPU.' },
        { en: 'BlueField', si: 'NVIDIA’s family of DPUs and SuperNICs, including BlueField-3.' },
        { en: 'DOCA', si: 'NVIDIA’s SDK for developing applications and services for BlueField.' },
        { en: 'Offload', si: 'Moving a task from the host CPU to another processor or hardware component.' },
        { en: 'OVS (Open vSwitch)', si: 'A software virtual switch that forwards traffic among virtual machines or containers.' },
        { en: 'Zero Trust', si: 'A security model that does not automatically trust network participants and verifies each access request.' },
      ],
    },
    {
      id: 'ai-software-lifecycle',
      plain: "Map software to stages: data preparation, model development/training, optimization, serving, orchestration, and monitoring.",
      internGuide: ["Map software to stages: data preparation, model development/training, optimization, serving, orchestration, and monitoring.","CUDA and accelerated libraries provide GPU foundations; frameworks build and train models; TensorRT optimizes inference; Triton serves models; NIM packages supported inference runtimes and APIs.","NGC distributes containers, models, and charts. GPU Operator manages Kubernetes GPU components, while DCGM exposes health and telemetry.","Exam check: products overlap but are not interchangeable. Ask what layer and responsibility the question describes before selecting a tool."],
      title: 'NVIDIA Software at Each Stage of the AI Lifecycle',
      si: 'ඔයා AI model එකක් හදන මුල සිට සේවයට දාන තෙක් software පියවර ගණනාවක් හමුවෙනවා. CUDA සහ libraries ගණනයට උදව් කරනවා, frameworks වලින් model එක train කරනවා, Triton වැනි server එකකින් inference ලබාදිය හැකියි. NIM වැනි NVIDIA software packaged inference deployment එකකට භාවිතා කළ හැකියි. Monitoring මෙවලම් මඟින් GPU සහ සේවාවේ තත්ත්වය නිරීක්ෂණය කරනවා. Colombo බැංකුවේ chatbot එකක් හදනවා නම් data සකස් කිරීමෙන් monitoring දක්වා මේ පියවර සැලසුම් කරන්න.',
      body: [
        'Phase 9 introduced CUDA, NGC, NVIDIA AI Enterprise, TensorRT, Triton, and NIM. Here, place each tool within the AI lifecycle; the NCA-AIIO exam may ask which tool fits a given stage.',
        'The foundation for many stages includes the GPU driver, CUDA, and CUDA-X libraries: cuDNN provides deep-learning primitives, cuBLAS supports matrix math, and NCCL supports multi-GPU communication. NGC, the NVIDIA GPU Cloud catalog, provides optimized containers for tools such as PyTorch, TensorFlow, and Triton, as well as pretrained models and Helm charts. NVIDIA AI Enterprise is a licensed software suite with production support, security updates, and stable versions; NIM and NeMo can be used as part of production workflows.',
        'Lifecycle stages include: (1) data preparation with RAPIDS (cuDF, cuML), the Spark RAPIDS Accelerator, DALI for data loading and augmentation, and NeMo Curator for LLM data; (2) training and fine-tuning with PyTorch or TensorFlow containers, NeMo, Megatron-LM, and TAO Toolkit; (3) optimization with TensorRT, TensorRT-LLM, and quantization; (4) deployment with Triton Inference Server or NIM, a container that packages an optimized model, engine, and API; and (5) operations with GPU Operator, DCGM, Base Command Manager, and Run:ai.',
        'For a custom model requiring detailed control, an architect might choose TensorRT and Triton. For a faster deployment of a standard LLM through an OpenAI-compatible API, NIM may fit. NVIDIA AI Enterprise is relevant when supported enterprise production software is required. These tools can be layered rather than treated as alternatives: NIM can use optimized engines such as TensorRT-LLM.',
      ],
      analogy:
        'The AI lifecycle is like tea production: data preparation picks and sorts leaves (RAPIDS, DALI), training processes them in a factory (NeMo, PyTorch), optimization grades and packages the tea (TensorRT), and deployment sends it to auction and shops (Triton, NIM). NGC is a catalog of ingredients and tools; NVIDIA AI Enterprise is like certification and warranty; CUDA is the factory’s electricity.',
      example:
        'A bank builds a cheque-fraud detection project. It cleans hundreds of thousands of transaction rows with cuDF, trains a GPU-accelerated XGBoost model with RAPIDS and a CNN for cheque images in a PyTorch NGC container, then converts the CNN to an FP16 TensorRT engine. Triton serves both the XGBoost model through its FIL backend and the TensorRT model. The bank later deploys a Llama NIM for a customer chatbot, runs the services on Kubernetes with GPU Operator, and monitors GPUs with DCGM.',
      keyPoints: [
        'Foundation: driver, CUDA, and CUDA-X libraries; NGC provides containers and models; NVIDIA AI Enterprise offers enterprise support.',
        'Prepare data with RAPIDS, DALI, or NeMo Curator; train with PyTorch, NeMo, Megatron-LM, or TAO.',
        'Optimize with TensorRT or TensorRT-LLM; serve with Triton or NIM.',
        'Operate with GPU Operator, DCGM, Base Command Manager, and Run:ai.',
      ],
      terms: [
        { en: 'NGC', si: 'NVIDIA’s catalog of GPU-optimized containers, pretrained models, and Helm charts.' },
        { en: 'NVIDIA AI Enterprise', si: 'A licensed software suite that provides support, security updates, and certified versions for production AI.' },
        { en: 'TensorRT', si: 'An SDK that optimizes trained models for inference, including techniques such as layer fusion and precision selection.' },
        { en: 'Triton Inference Server', si: 'An open-source server that serves models through backends such as ONNX, TensorRT, PyTorch, and Python.' },
        { en: 'NIM', si: 'A prebuilt inference microservice container packaging a model, optimized engine, and standard API.' },
        { en: 'DALI', si: 'NVIDIA Data Loading Library for image/video decoding and augmentation, including GPU-accelerated operations.' },
        { en: 'TAO Toolkit', si: 'An NVIDIA tool for customizing vision models through transfer learning with less code.' },
        { en: 'Base Command Manager', si: 'NVIDIA cluster-management software for provisioning and managing GPU clusters, formerly Bright Cluster Manager.' },
      ],
    },
    {
      id: 'datacenter-management-monitoring',
      plain: "Use nvidia-smi for a quick host-level view and operational commands. Use DCGM for fleet health, diagnostics, and structured telemetry.",
      internGuide: ["Use nvidia-smi for a quick host-level view and operational commands. Use DCGM for fleet health, diagnostics, and structured telemetry.","Monitor temperature, power, clocks, memory use, ECC/Xid errors, PCIe/NVLink health, engine activity, and job-level throughput or latency.","DCGM Exporter exposes metrics to Prometheus; dashboards visualize them and alert rules notify operators. Labels must connect a GPU metric to its node, pod, job, and tenant.","Troubleshooting order: confirm user impact, correlate application and GPU metrics, inspect recent changes/logs, isolate hardware versus workload, then record the resolution."],
      title: 'Managing and Monitoring an AI Data Center (nvidia-smi, DCGM Metrics)',
      si: 'ඔයා GPU එකක් පරීක්ෂා කිරීමට nvidia-smi භාවිතා කරලා memory, temperature සහ utilization බලන්න පුළුවන්. DCGM මඟින් GPU fleet එකක තත්ත්වය නිරීක්ෂණය කිරීමට සහ diagnostics කිරීමට උදව් වෙනවා. එක GPU එකක් දෝෂ සහිත නම් multi-GPU වැඩේම මන්දගාමී විය හැකියි. ඒ නිසා metrics, logs සහ alarms එකට බලන්න. දෝෂයක් සැක නම් node එකෙන් අලුත් වැඩ නවතා පරීක්ෂා කරලා පසුව නැවත සේවයට එක් කරන්න.',
      body: [
        'AI data-center management has three parts: (1) provisioning each node with an OS, GPU driver, CUDA, container runtime, NVIDIA Container Toolkit, and scheduler agent; (2) monitoring GPUs, networks, storage, power, and temperature; and (3) maintenance, including firmware/driver updates, draining unhealthy nodes, and hardware replacement. For hundreds of nodes, use automation such as Base Command Manager, Ansible, or Kubernetes GPU Operator rather than manual setup. Keep driver and firmware versions consistent.',
        'nvidia-smi provides a quick view of one node’s GPU utilization, memory, temperature, power, ECC errors, and processes. DCGM (Data Center GPU Manager) monitors, checks, and diagnoses GPUs across a cluster. DCGM Exporter sends metrics to Prometheus for Grafana dashboards and Alertmanager alerts.',
        'Useful DCGM metrics include GPU utilization (DCGM_FI_DEV_GPU_UTIL), framebuffer memory (DCGM_FI_DEV_FB_USED), power, temperature, SM activity, Tensor Core activity, XID and ECC errors, NVLink/PCIe throughput, and clock-throttle reasons. SM and Tensor activity can give more detail about actual GPU work than GPU_UTIL alone.',
        'Use dcgmi diag for diagnostic tests ranging from quick checks to longer stress tests. XID errors are GPU error codes logged by the driver. If uncorrectable ECC errors, XID errors, or thermal throttling occur, drain the node from the scheduler, diagnose it, and repair or replace it if needed. Also monitor network-port errors, storage latency, rack power, inlet temperature, and job-level metrics such as GPU-hours.',
      ],
      analogy:
        'nvidia-smi is like a doctor quickly checking one patient with a stethoscope. DCGM is like connecting monitors from every ICU bed to a central nursing station and sounding an alarm when a reading is unusual. dcgmi diag is a fuller medical examination.',
      example:
        'A Grafana dashboard shows one of 64 GPUs in a training job with a much higher GPU_TEMP and thermal-throttling reason than the others. Because synchronized training waits for its slowest GPU, the other 63 may wait too. Drain that node, restart the job from a checkpoint elsewhere, inspect the fans and cooling, and run dcgmi diag.',
      code: {
        lang: 'bash',
        src: `# Quick GPU view: memory, utilization, temperature, power, and processes
nvidia-smi
# Query key metrics as CSV every five seconds
nvidia-smi --query-gpu=index,utilization.gpu,memory.used,temperature.gpu,power.draw --format=csv -l 5
# List GPUs discovered by DCGM
dcgmi discovery -l
# Diagnostic tests (1 = short, 3 = longer)
dcgmi diag -r 1`,
      },
      keyPoints: [
        'Management includes provisioning, monitoring, and maintenance; keep versions consistent across nodes.',
        'nvidia-smi is a quick single-node snapshot; DCGM supports fleet monitoring, health checks, and diagnostics.',
        'Track utilization, framebuffer use, power, temperature, SM/Tensor activity, XID/ECC errors, and NVLink.',
        'For a fault, drain the node, run dcgmi diag, and repair it; one slow GPU can slow the entire job.',
      ],
      terms: [
        { en: 'DCGM Exporter', si: 'A component that exposes DCGM metrics in Prometheus format.' },
        { en: 'XID Error', si: 'A GPU error code logged by the NVIDIA driver that can indicate a hardware, driver, or application issue.' },
        { en: 'ECC Error', si: 'A memory bit error; hardware can correct some errors, while uncorrectable errors are more serious.' },
        { en: 'Thermal Throttling', si: 'A GPU automatically lowering its clock speed when it becomes too hot.' },
        { en: 'dcgmi diag', si: 'A command for running DCGM diagnostic tests at several levels.' },
        { en: 'Drain / Cordon', si: 'Preventing new jobs from going to a node and allowing current jobs to finish or be removed.' },
      ],
    },
    {
      id: 'kubernetes-vs-slurm',
      plain: "Slurm schedules batch jobs and tightly coupled HPC/AI training well. Kubernetes manages long-running services, APIs, rolling updates, and container-native applications well.",
      internGuide: ["Slurm schedules batch jobs and tightly coupled HPC/AI training well. Kubernetes manages long-running services, APIs, rolling updates, and container-native applications well.","Both allocate scarce GPUs, but their objects differ: Slurm uses jobs, partitions, and reservations; Kubernetes uses pods, nodes, requests/limits, and controllers.","A site can use both when responsibilities and GPU pools are clear—for example Slurm for training and Kubernetes for inference.","Exam check: choose from workload lifecycle and operating model, not from popularity. Avoid double-scheduling the same GPU unless an integration explicitly supports it."],
      title: 'Cluster Orchestration and Job Scheduling: Kubernetes vs Slurm',
      si: 'ඔයා GPUs බොහෝ දෙනෙක් බෙදාගන්න cluster එකක jobs කාට කවදා ලැබෙනවාද කියලා scheduler එක තීරණය කරනවා. Slurm දිගු batch training jobs queue කරලා nodes සහ GPUs බෙදාදීමට ප්‍රචලිතයි. Kubernetes දිගටම සේවය කරන inference API සහ containers කළමනාකරණයට ප්‍රයෝජනවත්. රෝහලක theatre එක කලින් වෙන්කරන ක්‍රමය Slurm වගේ, දවස පුරා රෝගීන්ට සේවය සපයන OPD එක Kubernetes වගේ. බොහෝ ආයතන training සඳහා Slurm සහ serving සඳහා Kubernetes දෙකම යොදාගන්නවා.',
      body: [
        'Many users share clusters with hundreds of GPUs. A scheduler or orchestrator decides who receives which GPUs and when. Two common AI cluster tools are Slurm and Kubernetes.',
        'Slurm is a batch-job scheduler from the HPC world. A user submits a script with sbatch—for example, requesting four nodes, 32 GPUs, and 48 hours. The job waits in a queue until resources are available, runs, and then ends. Slurm supports partitions, priorities, fair-share, backfill, and gang scheduling, which starts a job only when all required nodes are available. GPUs can be requested through GRES, such as `--gres=gpu:8`. NVIDIA Pyxis/Enroot can run containers. Slurm is widely used for large multi-node training.',
        'Kubernetes orchestrates containers and microservices. It is well suited to continuously running inference APIs, autoscaling, rolling updates, self-healing, and load balancing. GPUs are exposed through the NVIDIA device plugin or GPU Operator. The default scheduler is less suited to batch and gang scheduling, so multi-node training may add tools such as Kubeflow Training Operator, Volcano, Kueue, or NVIDIA Run:ai.',
        'Choose Slurm for long, large, multi-node training or HPC batch jobs, especially when researchers work from the shell. Choose Kubernetes for inference services, MLOps pipelines, microservices, and cloud-native teams such as those using EKS. Many organizations use Slurm for training and Kubernetes for serving; hybrid approaches such as Slurm on Kubernetes also exist.',
      ],
      analogy:
        'Slurm is like booking a hospital operating theatre: a surgeon requests one theatre, four nurses, and six hours, then starts only when all are available and releases them afterward. Kubernetes is like an outpatient department that stays open, adds doctors (pods) when patients increase, and replaces one when it becomes unavailable.',
      example:
        'A bank’s data scientists fine-tune an 8B model weekly on two nodes for ten hours, submitted as a Slurm job with `--nodes=2 --gres=gpu:8`. An EKS/Kubernetes Deployment serves the tuned model to a chatbot with two replicas; an HPA scales to four when requests rise. Both environments access the same storage.',
      code: {
        lang: 'bash',
        src: `#!/bin/bash
# Slurm job: two nodes, eight GPUs per node, maximum runtime of ten hours
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
        'Kubernetes GPUs use the NVIDIA device plugin or GPU Operator; batch scheduling can add Kueue, Volcano, Kubeflow, or Run:ai.',
        'Many organizations use both: Slurm for training and Kubernetes for serving.',
      ],
      terms: [
        { en: 'Slurm', si: 'An open-source workload manager that queues batch jobs and allocates resources in HPC and AI clusters.' },
        { en: 'sbatch / srun / squeue', si: 'sbatch submits a job script; srun runs tasks within a job; squeue displays the queue.' },
        { en: 'GRES', si: 'Generic RESources: Slurm’s mechanism for requesting resources such as GPUs.' },
        { en: 'Fair-share', si: 'A scheduling policy that adjusts priority based on past usage to distribute resources fairly.' },
        { en: 'Gang Scheduling', si: 'A scheduling method that starts a job only when all of its required resources are available together.' },
        { en: 'Pyxis / Enroot', si: 'NVIDIA tools for running containers in Slurm jobs.' },
        { en: 'Run:ai', si: 'An NVIDIA platform for GPU scheduling, quotas, and sharing on Kubernetes.' },
      ],
    },
    {
      id: 'gpu-virtualization',
      plain: "Passthrough gives one VM direct use of a physical GPU. vGPU presents mediated virtual GPUs to VMs and typically requires supported software and licensing.",
      internGuide: ["Passthrough gives one VM direct use of a physical GPU. vGPU presents mediated virtual GPUs to VMs and typically requires supported software and licensing.","MIG divides supported GPUs into hardware-isolated instances with defined compute and memory resources. Time-slicing alternates whole-GPU access and provides weaker performance isolation.","Choose sharing from isolation, predictability, memory guarantees, utilization, licensing, and whether the application supports the partition mode.","Exam check: MIG is spatial hardware partitioning; time-slicing is temporal sharing. Neither combines the memory of separate partitions into one larger GPU."],
      title: 'GPU Virtualization and Sharing: vGPU vs MIG vs Time-Slicing',
      si: 'ඔයාට හැම workload එකකටම මුළු GPU එකම අවශ්‍ය නැහැ. Time-slicing එකේ වැඩ කිහිපයක් GPU කාලය බෙදාගන්නවා, ඒ නිසා එකිනෙකාට බලපෑම් ඇති විය හැකියි. MIG සහාය ඇති GPU එකක් hardware මට්ටමේ වෙන් කළ කොටස්වලට බෙදන්න පුළුවන්. vGPU මඟින් virtual machine එකකට GPU හැකියාව ලබාදෙන්න පුළුවන්. Rs. 1,000ක පන්තියක් දරුවන්ට බෙදාදෙනවා වගේ, ඔයා performance isolation සහ workload අවශ්‍යතාව බලලා ක්‍රමය තෝරන්න.',
      body: [
        'Many workloads, such as a small inference model or a data scientist’s notebook, need only part of a GPU. Three common sharing approaches are time-slicing, MIG, and vGPU; Phase 9 introduced MIG and time-slicing for Kubernetes.',
        'Time-slicing switches GPU time among workloads. It is simple and works with many GPUs, but it does not provide memory or fault isolation or a performance guarantee. One workload can consume memory and cause OOM errors for others. It may suit small, trusted development and test workloads.',
        'Multi-Instance GPU (MIG) partitions supported data-center GPUs such as A100 and H100 into up to seven instances. Each instance has its own SMs, memory, and cache, providing isolation and more predictable performance. Profiles are fixed, such as 1g.10gb or 3g.40gb, and MIG is not available on every GPU. It can suit multi-tenant inference.',
        'NVIDIA vGPU software shares a GPU among virtual machines managed by a hypervisor such as VMware vSphere or KVM. Each VM sees a virtual GPU and uses an NVIDIA driver. A vGPU can be time-sliced or MIG-backed. It is commonly used for VDI and enterprise VM environments, requires NVIDIA licensing, and may support VM features such as live migration in some configurations. As a rule of thumb: MIG for isolated container workloads, vGPU for VMs, and time-slicing for simple sharing without strict isolation.',
      ],
      analogy:
        'Imagine the GPU as a large house. Time-slicing rents the same room to different people at different times, so one tenant may leave belongings that affect the next. MIG builds up to seven separate annexes with their own doors and meters. vGPU turns the house into apartments rented through a management company (the hypervisor); those apartments may be hardware-partitioned with MIG or time-shared.',
      example:
        'A hospital group has 20 radiologists using imaging software on VMware virtual desktops, so it considers vGPU. It also runs seven small Kubernetes inference models, each under 10 GB, that must not affect one another; an 80-GB A100 can be partitioned into seven 1g.10gb MIG instances. Interns’ Jupyter notebooks may use time-slicing if strict isolation is unnecessary.',
      keyPoints: [
        'Time-slicing works on many GPUs and is simple, but provides no strong isolation.',
        'MIG provides up to seven hardware partitions on supported GPUs such as A100/H100, with memory and compute isolation.',
        'vGPU shares GPUs among hypervisor-managed VMs; it can be time-sliced or MIG-backed and requires licensing.',
        'Use MIG for isolated containers, vGPU for VMs, and time-slicing for less isolated development/test use.',
      ],
      terms: [
        { en: 'vGPU', si: 'NVIDIA virtual GPU software for sharing a physical GPU among virtual machines on a hypervisor.' },
        { en: 'MIG-backed vGPU', si: 'A VM assigned a MIG instance as its vGPU, combining VM-level isolation with a hardware partition.' },
        { en: 'Hypervisor', si: 'Software that runs multiple virtual machines on one physical server, such as vSphere or KVM.' },
        { en: 'GPU Passthrough', si: 'Assigning an entire physical GPU directly to one VM without sharing it.' },
        { en: 'VDI', si: 'Virtual Desktop Infrastructure: running users’ desktop environments as VMs in a data center.' },
        { en: 'QoS', si: 'Quality of Service: a guarantee or policy for a workload’s minimum performance.' },
      ],
    },
    {
      id: 'ai-infra-security',
      plain: "Identify the assets: datasets, model weights, credentials, endpoints, scheduler/control plane, BMCs, and costly GPU capacity.",
      internGuide: ["Identify the assets: datasets, model weights, credentials, endpoints, scheduler/control plane, BMCs, and costly GPU capacity.","Separate compute, storage, management, and out-of-band networks. Keep BMCs private and expose inference through controlled gateways or load balancers.","Store credentials in a secrets system, use workload identities and least-privilege RBAC/IAM, run non-root containers, and scan/sign images.","Protect data at rest and in transit, patch drivers and firmware, retain audit logs, and test incident response. Confidential computing addresses data in use only on supported stacks."],
      title: 'Security for AI Workloads: Segmentation, Secrets, Least Privilege',
      si: 'ඔයා AI cluster එකේ හැම user කෙනෙකුටම හැම server එකටම ප්‍රවේශය දෙන්න එපා. Network segmentation මඟින් වෙනස් workloads සහ management traffic වෙන් කරන්න පුළුවන්. API keys වගේ secrets code එකට ලියන්නේ නැතුව ආරක්ෂිත secret store එකක තබන්න. Least privilege කියන්නේ කෙනෙකුට තමන්ගේ කාර්යයට අවශ්‍ය අවම බලතල පමණක් දීමයි. බැංකුවක සේවකයෙකුට සියලු ගිණුම් බලන්න නොදෙනවා වගේ ඔයාත් ප්‍රවේශය සීමා කරන්න.',
      body: [
        'AI clusters hold valuable assets: sensitive training data such as customer records, model weights representing months of training, API keys and tokens, and costly GPUs that attackers may misuse for activities such as cryptocurrency mining. Build security into the design from the start.',
        'Segment networks: separate the compute fabric, storage, management, and out-of-band BMC networks from one another and from office or internet traffic. Never expose the BMC network to the internet. Expose inference endpoints to users only through an API gateway or load balancer. Use Kubernetes NetworkPolicies or cloud security groups and private subnets. BlueField DPUs can help isolate tenants in multi-tenant clusters.',
        'Manage secrets: do not hardcode API keys, NGC keys, Hugging Face tokens, or database passwords in source code, container images, or Git. Use services such as AWS Secrets Manager, HashiCorp Vault, or Kubernetes Secrets with encryption at rest, and rotate keys regularly.',
        'Apply least privilege: give each user and service only the access it needs. Use Kubernetes RBAC, Slurm accounts and partitions, and cloud IAM roles such as IRSA or EKS Pod Identity. Avoid running containers as root or in privileged mode. Encrypt data and model weights at rest and in transit, use signed and scanned images, retain audit logs, and patch drivers and firmware. Some GPUs, including H100, support confidential-computing capabilities that protect data in use.',
      ],
      analogy:
        'An AI cluster is like a bank vault. Network segmentation separates the public counter, back office, and vault behind different doors. Secrets management keeps keys in a secure key safe and rotates them. Least privilege means a cashier gets the cash-drawer key, not the vault key.',
      example:
        'A bank chatbot keeps inference pods in a private subnet and exposes them only to the intranet through an internal load balancer. Model weights are in an encrypted S3 bucket readable only by the inference service account’s IAM role. A Hugging Face token is stored in Secrets Manager. Data scientists have RBAC access only to the development namespace; only the CI/CD pipeline can deploy to production. An unusual DCGM alert, such as 100% GPU use at 2 a.m. without a job, notifies security staff.',
      keyPoints: [
        'Protect data, model weights, credentials, and GPUs.',
        'Separate compute, storage, management, and BMC networks; never expose BMC to the internet.',
        'Store secrets in a vault or secrets manager, never hardcode them, and rotate them.',
        'Use RBAC, IAM roles, non-root containers, and audit logs to enforce least privilege.',
      ],
      terms: [
        { en: 'Network Segmentation', si: 'Dividing a network into separate zones and allowing only required traffic between them.' },
        { en: 'Least Privilege', si: 'The principle of granting only the minimum permissions required for a task.' },
        { en: 'RBAC', si: 'Role-Based Access Control: assigning permissions to roles and assigning roles to users.' },
        { en: 'Secrets Manager / Vault', si: 'Services that securely store passwords and API keys and provide access control and rotation.' },
        { en: 'Encryption at Rest / in Transit', si: 'Encrypting data while stored on disk and while moving over a network.' },
        { en: 'Confidential Computing', si: 'Technology that protects data in a hardware-protected environment while it is being processed.' },
      ],
    },
    {
      id: 'aws-gpu-instances-efa',
      plain: "First calculate required GPU memory, precision, concurrency, and network scale. Then compare current AWS instance specifications and regional availability; family names change over time.",
      internGuide: ["First calculate required GPU memory, precision, concurrency, and network scale. Then compare current AWS instance specifications and regional availability; family names change over time.","G families generally target graphics and cost-efficient inference/smaller training. P families target high-end, tightly coupled training and large-model serving. Confirm the exact GPU and count for the selected size.","EFA provides low-latency, OS-bypass networking for supported HPC/ML instances. NCCL commonly reaches it through aws-ofi-nccl; a cluster placement group helps keep nodes close.","Exam check: never infer capabilities from G or P alone. Validate GPU architecture, memory, local interconnect, EFA bandwidth, software compatibility, quota, and price."],
      title: 'AWS Mapping: GPU Instance Families (G and P Families) and EFA',
      si: 'ඔයා AWS GPU instance එකක් තෝරද්දී GPU වර්ගය, GPU ගණන, memory, network සහ මිල එකට බලන්න. G5 සහ G6 inference සහ graphics වැඩ සඳහා GPU instances වන අතර P4d සහ P5 විශාල GPU workloads සඳහා යොදාගත හැකියි. EFA මඟින් වේගවත් node-to-node සම්බන්ධතාවක් ලබාදී distributed training සඳහා උදව් විය හැකියි. Rs. 100ක දෙයක් ගන්නවා වගේ මිල පමණක් නොබලා අවශ්‍ය හැකියාවත් සසඳන්න. ඔයා workload එක benchmark කරලා instance family එක තහවුරු කරන්න.',
      body: [
        'Choose an AWS GPU instance by considering GPU architecture, GPU count and memory, local GPU interconnect, network bandwidth, whether the workload is training or inference, availability in the target Region, and budget. G families are generally used for inference, graphics, and smaller training jobs; P families target larger training jobs and larger-model inference. AWS adds instance families over time, so treat the examples below as a comparison method—not a complete current catalog—and confirm the selected size in the official EC2 instance table.',
        'G5 instances use NVIDIA A10G GPUs with 24 GB each and offer one to eight GPUs per instance. They are a common option for small-to-medium inference, fine-tuning, and graphics, but Ampere does not support FP8. G6 uses NVIDIA L4 (Ada Lovelace) GPUs with 24 GB each and is power-efficient for inference and video workloads, with FP8 support. G6e uses L40S GPUs with 48 GB each for workloads needing more memory.',
        'P4d instances (p4d.24xlarge) provide eight NVIDIA A100 40-GB GPUs, NVSwitch, and EFA networking; P4de uses A100 80-GB GPUs. The original p5.48xlarge provides eight NVIDIA H100 80-GB GPUs for large training and LLM serving. The P5 family now has additional variants, and AWS also lists newer P6 offerings based on NVIDIA Blackwell GPUs. Exact accelerators, memory, network limits, capacity options, and Region availability differ by size and can change, so verify them before designing or purchasing capacity.',
        'Elastic Fabric Adapter (EFA) is AWS’s network interface for HPC and ML. It supports OS-bypass so applications using libfabric can communicate with network hardware without the usual kernel network stack. It uses AWS Scalable Reliable Datagram (SRD); NCCL uses EFA through the aws-ofi-nccl plugin. P4d and P5 also support GPUDirect RDMA. For multi-node training, EFA can improve collective communication such as all-reduce. Place instances in a cluster placement group and configure an EFA-enabled security group.',
      ],
      analogy:
        'AWS GPU instances are like vehicle rentals: G6 is a fuel-efficient tuk-tuk for small inference; G5 is a car; G6e is a van for larger models; P4d is a lorry fleet; and P5 is a convoy of container trucks for the largest loads. EFA is the radio system that helps the convoy coordinate.',
      example:
        'Selection examples: an INT4/FP8 8B LLM at low concurrency may fit on g6.xlarge with an L4 24 GB GPU; an 8B BF16 model needing more KV-cache space may use G6e with L40S 48 GB. Serving a 70B BF16 model (about 140 GB of weights) may require tensor parallelism across an eight-GPU P4de/P5 instance. Full fine-tuning a 13B model across four nodes may use P4d/P5 with EFA and FSDP. For low-cost image-classifier inference, compare G6 and G5. AWS also offers Inferentia and Trainium, but NVIDIA CUDA, TensorRT, or NIM workloads use G/P families.',
      keyPoints: [
        'G5 = A10G 24 GB (Ampere). G6 = L4 24 GB (Ada, FP8). G6e = L40S 48 GB.',
        'P4d = 8× A100 40 GB, 400 Gbps EFA. P5 = 8× H100 80 GB, 3200 Gbps EFA.',
        'G families generally target graphics, inference, and smaller training; P families generally target large training and larger LLMs, but verify the exact instance size.',
        'The AWS catalog evolves (including newer G7 and P6 options), so use official specifications instead of memorizing an old family list.',
        'EFA supports OS-bypass and SRD; NCCL uses it through aws-ofi-nccl for multi-node training.',
      ],
      terms: [
        { en: 'G5 / G6 / G6e', si: 'AWS GPU instance families using A10G, L4, and L40S GPUs, respectively.' },
        { en: 'P4d / P4de / P5', si: 'AWS eight-GPU instance families using A100 40-GB, A100 80-GB, and H100 80-GB GPUs, respectively.' },
        { en: 'EFA', si: 'Elastic Fabric Adapter: AWS low-latency, OS-bypass networking for multi-node HPC and ML.' },
        { en: 'SRD', si: 'Scalable Reliable Datagram, an AWS transport protocol used by EFA.' },
        { en: 'aws-ofi-nccl', si: 'A plugin that enables NCCL to communicate over libfabric and EFA.' },
        { en: 'Cluster Placement Group', si: 'An AWS placement strategy that locates instances close together for low-latency networking.' },
      ],
    },
    {
      id: 'aws-nim-triton-deploy',
      plain: "Choose the operating model: SageMaker AI manages endpoints and much of scaling/health, while EKS provides Kubernetes control and more operational responsibility.",
      internGuide: ["Choose the operating model: SageMaker AI manages endpoints and much of scaling/health, while EKS provides Kubernetes control and more operational responsibility.","For EKS, GPU nodes need a compatible driver, container toolkit, and device plugin or GPU Operator. Avoid installing a second driver over one already supplied by the node image.","Deploy NIM or Triton with secrets outside images, persistent model caching, health probes, resource limits, private networking, and metrics tied to user latency and queues.","Production check: benchmark the actual model and prompts, test cold starts and failure recovery, verify licenses/registry access, and scale on service demand rather than GPU utilization alone."],
      title: 'Running NIM and Triton on AWS: SageMaker AI and EKS GPU Nodes',
      si: 'ඔයා AWS එකේ NVIDIA inference යෙදවීමට managed SageMaker AI endpoint එකක් හෝ වැඩි පාලනයක් ඇති EKS cluster එකක් තෝරන්න පුළුවන්. SageMaker එකේ servers සහ scaling කළමනාකරණය provider එකට පැවරෙනවා. EKS එකේ GPU nodes, device plugin හෝ GPU Operator සහ Kubernetes deployment ඔයා කළමනාකරණය කරනවා. NGC key එක secret එකක තබා, model weights නැවත බාගත නොවීමට persistent storage එකක් යොදාගන්න. මුලින් POC එකක් දවස් 2කින් කළත් production යෙදවීමේදී monitoring සහ securityත් සැලසුම් කරන්න.',
      body: [
        'There are two main ways to run NVIDIA inference on AWS. (1) Amazon SageMaker AI managed endpoints: provide a Triton or NIM container and model, choose an instance type such as ml.g5, ml.g6, or ml.p5, and SageMaker manages servers, scaling, health checks, and logging. AWS provides Triton Inference Server containers, and NVIDIA NIM can be deployed to SageMaker through AWS Marketplace. This can suit teams that need a fast production path without building much infrastructure.',
        '(2) Amazon EKS (Kubernetes) provides more control. Create GPU node groups using G/P instances and use an EKS-optimized accelerated AMI with NVIDIA drivers and the container toolkit, or a Bottlerocket NVIDIA variant. Install the NVIDIA device plugin so pods can request `nvidia.com/gpu`, or use NVIDIA GPU Operator to manage drivers, toolkit, device plugin, DCGM Exporter, and MIG Manager. If the AMI already includes the driver, disable driver installation in the operator. Scale GPU nodes with Karpenter or Cluster Autoscaler.',
        'On EKS, deploy NIM with its Helm chart and store the NGC API key in a Kubernetes Secret. A persistent EFS/FSx volume can cache model weights across pod restarts. Triton can use a model repository in S3. For LLM serving, autoscaling based on queue time or requests in flight may be more useful than GPU utilization alone; see Phase 9, “Scaling LLM Serving.”',
        'SageMaker requires less operations work, is managed, starts quickly, and bills per endpoint. EKS offers more control and can host many services, but requires Kubernetes expertise. It can also support portability across cloud and on-premises environments using the same Helm charts. EKS with NIM can support a hybrid strategy because the same NIM container can run on an on-premises DGX/Kubernetes cluster.',
      ],
      analogy:
        'SageMaker is like a hotel room: the hotel handles the bed, cleaning, and security while you bring your model. EKS is like renting an apartment: you can arrange it as you like, but you maintain it. You can also use the same furniture (containers) in your own on-premises home.',
      example:
        'For a bank chatbot proof of concept, an Amazon SageMaker AI endpoint using an ml.g6e instance and Llama 8B NIM could be ready in two days. A production design could use an EKS cluster with a g6e node group (minimum two, maximum six), GPU Operator, NIM Helm chart, NGC key in a Secret, model cache on FSx, and an internal ALB for intranet access. An HPA scales two to six replicas based on requests in flight; Prometheus and DCGM Exporter monitor GPUs.',
      code: {
        lang: 'text',
        src: `# Request one GPU in an EKS pod (part of a Deployment spec)
containers:
  - name: llm-nim
    image: nvcr.io/nim/meta/llama-3.1-8b-instruct:latest
    resources:
      limits:
        nvidia.com/gpu: 1          # resource exposed by the device plugin / GPU Operator
    env:
      - name: NGC_API_KEY
        valueFrom:
          secretKeyRef: { name: ngc-api, key: NGC_API_KEY }   # do not hardcode the key`,
      },
      keyPoints: [
        'SageMaker AI provides managed endpoints and Triton containers; NIM is available through Marketplace with less operations work.',
        'EKS uses an accelerated AMI and the device plugin or GPU Operator; Helm charts support portability and greater control.',
        'Store the NGC key in a Secret, cache models on persistent storage, and autoscale on queue or in-flight request metrics.',
        'The same NIM/Triton containers can run on EKS and on-premises Kubernetes for hybrid deployments.',
      ],
      terms: [
        { en: 'Amazon SageMaker AI', si: 'An AWS service for training models and deploying them through managed endpoints.' },
        { en: 'Amazon EKS', si: 'AWS’s managed Kubernetes service.' },
        { en: 'EKS-optimized Accelerated AMI', si: 'An EKS node image with NVIDIA drivers and the container toolkit preinstalled.' },
        { en: 'NVIDIA Device Plugin', si: 'A DaemonSet that advertises the nvidia.com/gpu resource to Kubernetes.' },
        { en: 'Karpenter', si: 'An AWS Kubernetes node autoscaler that launches instance types needed by pending pods.' },
        { en: 'Helm Chart', si: 'A package of YAML templates for deploying a Kubernetes application.' },
      ],
    },
    {
      id: 'sizing-gpu-deployment',
      plain: "Write measurable requirements first: model quality, concurrent requests, prompt/output lengths, time to first token, tokens per second, uptime, privacy, and growth.",
      internGuide: ["Write measurable requirements first: model quality, concurrent requests, prompt/output lengths, time to first token, tokens per second, uptime, privacy, and growth.","Estimate memory: weights equal parameters times bytes per parameter; then add KV cache, temporary workspace, framework overhead, and safety headroom. Quantization changes both memory and accuracy risk.","Benchmark representative prompts on candidate hardware. Measure latency distributions and throughput under concurrency, then calculate replicas for peak load plus failure/maintenance capacity.","Finish the architecture with network, storage, security, monitoring, power/cooling, staffing, and full cost. Revisit the estimate when traffic or context length changes."],
      title: 'And More: Sizing a GPU Deployment Step by Step (Sri Lankan Bank Chatbot)',
      si: 'ඔයා Colombo බැංකුවකට chatbot එකක් සැලසුම් කරනවා නම් මුලින් එකවර භාවිතා කරන අය, ප්‍රතිචාර වේගය සහ දත්ත පිටතට යැවිය හැකිද කියලා අහන්න. 8B parameters සහ BF16හි parameter එකකට bytes 2ක් නම් weights සඳහා 8,000,000,000 × 2 = 16,000,000,000 bytes, ඒ කියන්නේ දළ වශයෙන් 16 GB. ඒකට KV cache සහ runtime memoryත් එකතු වෙනවා. ඊළඟට සැබෑ prompt වලින් benchmark කර latency සහ throughput මනින්න. ඔයාගේ තෝරාගැනීම cloud වියදම, on-prem පාලනය සහ මෙහෙයුම් හැකියාව සමඟ සසඳන්න.',
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
