export default {
  id: 'cert-practical',
  number: 22,
  title: 'Certification Guide & Hands-On Practitioner Skills',
  titleSi: 'A practical guide to NVIDIA certifications and hands-on skills',
  summary:
    'Use this phase as both an exam roadmap and a practical workbook. It explains NVIDIA certification options, a suggested NCA-GENL → NCP-AAI route, the NCA-GENL domains, and study-guide topics not covered in depth earlier, including Python tools, data analysis, RLHF feedback, security, and the model lifecycle. The final topics walk through fine-tuning, deployment, RAG evaluation, GPU profiling, and troubleshooting.',
  duration: '2-3 weeks, including revision before the exam',
  topics: [
    // 1
    {
      id: 'nvidia-cert-map',
      plain: "NCA means Associate and tests foundations; NCP means Professional and expects deeper role experience. The letters after the prefix identify the subject, not a difficulty score.",
      internGuide: ["NCA means Associate and tests foundations; NCP means Professional and expects deeper role experience. The letters after the prefix identify the subject, not a difficulty score.","Choose from the official role and blueprint, then verify the individual exam page. Prices, question counts, delivery platforms, and available certifications can change.","As of this review, NCA-GENL is listed as 60 minutes and USD 125; NCP-AAI is 120 minutes and USD 200. NVIDIA states certifications are valid for two years.","Booking check: confirm identity/account requirements, current price plus tax, language, system/proctor rules, rescheduling policy, and the exact exam code before paying."],
      si: 'ඔයාට AI certification එකක් තෝරද්දී job එකට ගැළපෙන path එක බලන්න. උදාහරණයක්ට, Associate exam එක පැයක් සහ USD 125ක් වෙද්දී Professional එක පැය 2ක් සහ USD 200–500ක් වෙන්න පුළුවන්. Rs. 300කට USD 1ක් කියලා හිතුවොත් USD 325 කියන්නේ Rs. 97,500ක් වගේ. Book කරන්න කලින් NVIDIA site එකේ අද මිල, විස්තර බලන්න.',
      title: 'NVIDIA Certification Map: Codes, Levels, Time, Prices, Certiverse & 2-Year Validity',
      body: [
        'NVIDIA offers multiple AI certifications rather than one general certificate. Exams differ by role (developer, infrastructure, or data science) and level. The prefix identifies the level: NCA means NVIDIA-Certified Associate, an entry-level certification; NCP means NVIDIA-Certified Professional, intended for people with deeper experience.',
        'There are five Associate exams. Each lasts 1 hour and costs USD 125: NCA-GENL (Generative AI LLMs), NCA-GENM (Generative AI Multimodal), NCA-AIIO (AI Infrastructure and Operations), NCA-ADS (Accelerated Data Science), and NCA-AMAD (AI Models and Application Development). Our study documents list only NCA-AMAD’s name, code, level, duration, and price; consult NVIDIA’s page for its exam domains.',
        'There are eight Professional exams, each lasting 2 hours. NCP-GENL (Generative AI LLMs), NCP-AAI (Agentic AI), NCP-ADS (Accelerated Data Science), and NCP-OUSD (OpenUSD Development) cost USD 200 each. NCP-AII (AI Infrastructure), NCP-AIN (AI Networking), and NCP-ARI (AI Rack and Interconnect) cost USD 400 each. NCP-AIO (AI Operations) costs USD 500.',
        'NVIDIA may change prices, question counts, and domains. Verify the details at nvidia.com/en-us/learn/certification before booking. Exams are in English and are taken online through Certiverse with a remote proctor monitoring you by webcam. A certificate is valid for 2 years; recertification requires taking the exam again.',
      ],
      analogy:
        'Think of a driving licence with motorcycle, light-vehicle, and heavy-vehicle categories. The Associate level is an entry point, while Professional exams expect deeper experience. Like a licence, a NVIDIA certificate has an expiry period and is valid for 2 years.',
      example:
        'Plan the fees: NCA-GENL USD 125 + NCP-AAI USD 200 = USD 325. Adding optional NCA-AIIO at USD 125 brings the total to USD 450. At an illustrative rate of USD 1 ≈ Rs. 300, USD 325 ≈ Rs. 97,500 (325 × 300). After 2 years, recertification requires another exam fee. Verify both prices and the exchange rate when booking.',
      keyPoints: [
        'NCA = Associate (1 hour, USD 125). NCP = Professional (2 hours, USD 200-500).',
        'Exams are online in English through Certiverse with remote proctoring.',
        'Certificates are valid for 2 years. Recertification means taking the exam again.',
        'Prices and details can change; verify them on NVIDIA’s certification page before booking.',
      ],
      terms: [
        { en: 'Associate (NCA)', si: 'An entry-level certification that checks understanding of foundational concepts.' },
        { en: 'Professional (NCP)', si: 'An advanced level that expects deeper knowledge and production experience.' },
        { en: 'Certiverse', si: 'The platform used to deliver NVIDIA exams online with remote proctoring.' },
        { en: 'Remote Proctoring', si: 'A proctor monitors the exam-taker remotely through a webcam.' },
        { en: 'Recertification', si: 'Taking the exam again to renew a certificate after its 2-year validity period.' },
        { en: 'NCA-AMAD', si: 'AI Models and Application Development Associate; 1 hour, USD 125. See NVIDIA’s page for exam domains.' },
      ],
    },
    // 2
    {
      id: 'cert-path-choice',
      plain: "Choose a certification for the work you want to demonstrate: application/LLM development, agentic systems, data science, or infrastructure operations.",
      internGuide: ["Choose a certification for the work you want to demonstrate: application/LLM development, agentic systems, data science, or infrastructure operations.","NCA-GENL is a useful foundation for LLM applications; NCP-AAI targets production agent architecture and governance; NCP-GENL goes deeper into training, optimization, and distributed techniques.","An exam sequence is a suggestion, not a prerequisite chain unless NVIDIA explicitly says so. Hands-on experience should drive the professional exam choice.","Create a gap table from the current blueprint: domain weight, current skill, evidence/lab, and study hours. Re-evaluate the route when roles or blueprints change."],
      si: 'ඔයාගේ job එක developer නම් NCA-GENL එකෙන් පටන් ගන්න පුළුවන්; infrastructure නම් NCA-AIIO ගැළපෙනවා. ඔයාගේ architecture ඉලක්කයට NCA-GENL පස්සේ NCP-AAI යන පාර හොඳයි. උදාහරණයක්ට, EKS එකේ agent එකක් scale කරන තීරණ NCP-AAI එක්ක සම්බන්ධයි. GPU එකට G6 ද P5 ද කියන infrastructure තීරණයට NCA-AIIO දැනුමත් උදව් වෙනවා.',
      title: 'Which Path? Developer, Infrastructure, Data Science, and Your NCA-GENL → NCP-AAI Route',
      body: [
        'Choose an exam path based on your role. For AI, LLM, or developer work, start with NCA-GENL and then consider NCP-GENL or NCP-AAI. For infrastructure, data-center, or DevOps work, start with NCA-AIIO and then consider NCP-AII or NCP-AIO. For data science, start with NCA-ADS and then consider NCP-ADS.',
        'For an AWS-focused full-stack tech lead moving toward architecture, a suggested route is: (1) NCA-GENL (USD 125, 1 hour) for LLM, RAG, and prompting foundations that support either Professional exam. (2) NCP-AAI (USD 200, 2 hours) as the main target; it is the more architecture-focused NVIDIA exam for application builders, with roughly half its coverage on agent architecture and design, deployment and scaling, and evaluation. Production experience with agentic systems is expected. (3) Optional NCA-AIIO (USD 125) if GPU infrastructure sizing—such as GPU instances, EKS GPU clusters, and on-premises versus cloud—is part of your architect role.',
        'Why place NCP-GENL second? It focuses more on model optimization, fine-tuning, and multi-GPU parallelism, which are closer to an ML engineer’s daily work. Its domains and related material here are: Model optimization 17% (Phases 9, 14), GPU acceleration and optimization 14% (Phases 9, 15, 8), prompt engineering 13% (Phases 6, 12), fine-tuning 13% (Phases 5, 15), data preparation 9% (Phases 15, 14), model deployment 9% (Phases 7, 9), evaluation 7% (Phase 11), production monitoring and reliability 7% (Phase 7), LLM architecture 6% (Phases 5, 16), and safety, ethics, and compliance 5% (Phase 10). The study document notes that the fine-tuning domain description on NVIDIA’s page appears to refer to OpenUSD; it therefore used the listed topics and prerequisites.',
        'NCP-AAI: 60–70 questions and 120 minutes. NVIDIA recommends 1–2 years in AI/ML roles and experience with agentic projects in production. Its domains are Agent architecture and design 15%, Agent development 15%, Evaluation and tuning 13%, Deployment and scaling 13%, Cognition, planning, and memory 10%, Knowledge integration and data handling 10%, NVIDIA platform implementation 7%, Run, monitor, and maintain 5%, Safety, ethics, and compliance 5%, and Human-AI interaction and oversight 5% (98% total, as listed by NVIDIA). See Phase 12 for agents and Phase 13 for RAG. Optional DLI courses include Building RAG Agents With LLMs, Evaluating RAG and Semantic Search Systems, Building Agentic AI Applications With LLMs, and Introduction to Deploying RAG Pipelines for Production at Scale.',
      ],
      analogy:
        'It is like choosing an A/L stream: a Maths stream may lead toward engineering, while a Biology stream may lead toward medicine. You can begin with the LLM foundation (NCA-GENL) and then pursue the architecture-focused NCP-AAI. NCP-GENL is another useful route, but its optimization emphasis may fit an ML engineering role more directly.',
      example:
        'A client asks whether to run a support agent on Bedrock or with NIM on EKS. NCP-AAI topics help frame questions about agent design, tool calling, evaluation, and scaling. NCA-AIIO knowledge helps with choices such as G6 versus P5 instances or an on-premises DGX system. LoRA rank and tensor-parallelism choices are closer to NCP-GENL topics.',
      keyPoints: [
        'Developer → NCA-GENL; infrastructure → NCA-AIIO; data science → NCA-ADS.',
        'Suggested route: NCA-GENL → NCP-AAI → optional NCA-AIIO.',
        'NCP-GENL emphasizes optimization, fine-tuning, and multi-GPU work, so it may fit an ML engineer role more closely.',
        'NCP-AAI has 60–70 questions in 120 minutes and emphasizes agent architecture, deployment, and evaluation.',
      ],
      terms: [
        { en: 'NCP-AAI', si: 'NVIDIA Certified Professional: Agentic AI; focuses on designing and operating agents in production.' },
        { en: 'NCP-GENL', si: 'NVIDIA Certified Professional: Generative AI LLMs; 60–70 questions, 120 minutes, and 2–3 years of LLM experience recommended.' },
        { en: 'NCA-AIIO', si: 'AI Infrastructure and Operations Associate; 50 questions, 60 minutes, and topics such as GPU hardware, networking, Kubernetes/Slurm, nvidia-smi/DCGM, and MIG/vGPU.' },
        { en: 'DLI (Deep Learning Institute)', si: 'NVIDIA’s learning organization, which offers courses recommended for exam preparation.' },
      ],
    },
    // 3
    {
      id: 'nca-genl-exam-guide',
      plain: "Use the official five-domain blueprint: Core ML/AI 30%, Software Development 24%, Experimentation 22%, Data Analysis/Visualization 14%, and Trustworthy AI 10%.",
      internGuide: ["Use the official five-domain blueprint: Core ML/AI 30%, Software Development 24%, Experimentation 22%, Data Analysis/Visualization 14%, and Trustworthy AI 10%.","Weights guide study time but do not guarantee an exact number of questions. NVIDIA currently describes 50 questions in one place and 50–60 multiple-choice in its details, so verify at booking.","Translate each objective into an action: explain a concept, choose an appropriate tool, interpret a metric/chart, diagnose an experiment, or identify a trustworthy-AI control.","Do not memorize product names alone. Practise explaining why NIM, Triton, TensorRT, NeMo, RAPIDS, a vector database, or a Python library fits a scenario."],
      si: 'NCA-GENL එක පැයක් තියෙන English exam එකක්, මිල USD 125. NVIDIA page එකේ question count එක විස්තර අනුව 50–60 අතර වෙන්න පුළුවන්, ඒ නිසා booking එකේදී confirm කරන්න. Domains වලින් Core ML 30%, Software Development 24%, Experimentation 22%, Data Analysis 14%, Trustworthy AI 10% බරයි. ඔයාට කාලය සීමිත නම් ලොකු percentage තියෙන domains වලට වැඩිපුර practice කරන්න.',
      title: 'NCA-GENL Exam Guide: Format, Five Domains, Weights & What Each Really Tests',
      body: [
        'NCA-GENL lasts 60 minutes. The exam-details section on NVIDIA’s page says 50–60 multiple-choice questions, while its overview says 50; confirm the exact count when booking. It costs USD 125, is online through Certiverse, and is in English. The prerequisite is a basic understanding of generative AI and LLMs. No passing score is published. Verify these details on NVIDIA’s certification page before booking, since they may change.',
        'The five domains are Core Machine Learning and AI Knowledge 30% (about 15–18 questions), Software Development 24% (12–14), Experimentation 22% (11–13), Data Analysis 14% (7–8), and Trustworthy AI 10% (5–6). NVIDIA does not publish question counts per domain; these are estimates based on a 50–60-question exam.',
        'What does each domain cover? Core ML (30%) includes supervised and unsupervised learning, overfitting, activations, optimizers, Transformers, attention, tokenization, embeddings, prompting, RAG, vector databases, and Python NLP tools (Phases 2, 3, 4, 5, 6, 13, 14, 16, 17). Software Development (24%) includes NeMo, NIM, Triton, TensorRT-LLM, ONNX, NGC, quantization, batching, KV cache, LoRA, and RLHF/DPO (Phases 9, 14, 15, 7). Experimentation (22%) includes data preparation, training settings, mixed precision, experiment tracking, perplexity/BLEU/ROUGE, benchmarks, and LLM-as-a-judge (Phases 15 and 11).',
        'Data Analysis (14%) includes classification and regression metrics (including R²), loss curves, EDA, correlation versus causation, charts, and RAPIDS (Phases 1, 2, 17, 0, and this phase’s data-analysis topic). Trustworthy AI (10%) covers ethical principles, privacy and consent, tools and techniques that improve trustworthiness, and bias reduction (Phase 10). NVIDIA’s detailed blueprint does not specify that questions are scenario-based or define a precise question format. Scenario questions here are practice for applying concepts, not a promise about the exam format.',
        'NVIDIA’s companion overview mentions “alignment,” but its detailed weighted-domain list does not name alignment as a separate objective or weighted domain. Review alignment concepts such as RLHF/DPO with experimentation and model-customization material; do not treat alignment as a separate exam domain.',
      ],
      analogy:
        'Think of an A/L marking scheme: if Part A is worth 30%, you might spend roughly 30% of revision time on it. Do not ignore Trustworthy AI just because it is worth 10%; those estimated 5–6 questions still matter.',
      example:
        'Suppose you have 40 study hours. Allocating them by domain weight gives Core ML: 40 × 0.30 = 12 hours; Software Development: 40 × 0.24 = 9.6 hours; Experimentation: 40 × 0.22 = 8.8 hours; Data Analysis: 40 × 0.14 = 5.6 hours; Trustworthy AI: 40 × 0.10 = 4 hours. If math is difficult for you, add 2–3 extra hours to Core ML and Data Analysis.',
      keyPoints: [
        'NVIDIA’s exam details say 50–60 multiple-choice questions while its overview says 50; verify the count at booking. The exam is 60 minutes, and no passing score is published.',
        'Core ML 30% > Software dev 24% > Experimentation 22% > Data analysis 14% > Trustworthy AI 10%.',
        'Question-count ranges (15–18, 12–14, 11–13, 7–8, and 5–6) are estimates only.',
        'Scenario-style questions here let you practise applying concepts; they do not guarantee the NVIDIA exam’s question format.',
        'Alignment appears in the companion overview but is not a separately weighted domain in the detailed blueprint.',
      ],
      terms: [
        { en: 'Exam Domain', si: 'A section of an exam. Its weight is the estimated share of questions assigned to that section.' },
        { en: 'Weight', si: 'The percentage of an exam assigned to a domain.' },
        { en: 'Scenario Question', si: 'A practice question that gives a situation and asks you to choose a suitable tool or approach. NVIDIA does not officially specify a percentage or format for these questions.' },
      ],
      resources: [
        { title: 'NVIDIA NCA-GENL official exam page', url: 'https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/', description: 'Official exam domains, weights, and current exam information.' },
      ],
      domainChecklist: [
        {
          name: 'Core Machine Learning and AI Knowledge',
          weight: '30%',
          objectives: [
            { text: 'Support deployment and evaluation of model scalability, performance, and reliability.', lessons: [{ phase: 'nvidia', topic: 'llm-serving-metrics', label: 'LLM serving metrics' }, { phase: 'mlops', topic: 'monitoring-drift', label: 'Production monitoring' }] },
            { text: 'Understand how data mining and visualization help extract insights from large datasets.', lessons: [{ phase: 'ml', topic: 'anomaly-association', label: 'Data mining' }, { phase: 'data-science', topic: 'storytelling-dashboards', label: 'Visualization' }] },
            { text: 'Build LLM use cases such as RAG, chatbots, and summarizers.', lessons: [{ phase: 'genai', topic: 'rag', label: 'RAG' }, { phase: 'nlp', topic: 'nlp-generation-tasks', label: 'Summarization and QA' }] },
            { text: 'Curate and embed content datasets for RAG.', lessons: [{ phase: 'training', topic: 'data-curation', label: 'Data curation' }, { phase: 'genai', topic: 'embeddings-vectordb', label: 'Embeddings and vector databases' }] },
            { text: 'Know ML fundamentals such as feature engineering, model comparison, and cross-validation.', lessons: [{ phase: 'ml', topic: 'data-splits', label: 'Splits and cross-validation' }, { phase: 'data-science', topic: 'encoding', label: 'Feature engineering' }, { phase: 'ml', topic: 'metrics', label: 'Model metrics' }] },
            { text: 'Recognize Python NLP package capabilities, including spaCy, NumPy, and vector databases.', lessons: [{ phase: 'nlp', topic: 'nlp-libraries', label: 'NLP libraries' }, { phase: 'data-science', topic: 'numpy-pandas-polars', label: 'NumPy and data tools' }, { phase: 'genai', topic: 'embeddings-vectordb', label: 'Vector databases' }] },
            { text: 'Read research papers to identify emerging LLM trends and technologies.', lessons: [{ phase: 'cert-practical', topic: 'following-llm-research', label: 'Research reading' }] },
            { text: 'Select and use models to create text embeddings.', lessons: [{ phase: 'genai', topic: 'embeddings-vectordb', label: 'Text embeddings' }] },
            { text: 'Apply prompt engineering to achieve desired model outputs.', lessons: [{ phase: 'genai', topic: 'prompt-basics', label: 'Prompt engineering' }] },
            { text: 'Use Python packages such as spaCy, NumPy, and Keras for traditional ML analyses.', lessons: [{ phase: 'cert-practical', topic: 'python-tools-to-recognize', label: 'Python tool selection' }, { phase: 'ml', topic: 'metrics', label: 'Traditional ML evaluation' }] },
          ],
        },
        {
          name: 'Data Analysis',
          weight: '14%',
          objectives: [
            { text: 'Understand data mining and visualization for extracting insights from large datasets.', lessons: [{ phase: 'ml', topic: 'anomaly-association', label: 'Data mining' }, { phase: 'data-science', topic: 'storytelling-dashboards', label: 'Charts and dashboards' }] },
            { text: 'Compare models using statistical metrics such as loss functions and explained variance.', lessons: [{ phase: 'ml', topic: 'metrics', label: 'Evaluation metrics' }, { phase: 'cert-practical', topic: 'data-analysis-r2-trends', label: 'R² and trends' }] },
            { text: 'Conduct data analysis with appropriate supervision and review.', lessons: [{ phase: 'cert-practical', topic: 'data-analysis-r2-trends', label: 'Analysis workflow' }] },
            { text: 'Create graphs, charts, and visualizations to communicate analysis results.', lessons: [{ phase: 'data-science', topic: 'storytelling-dashboards', label: 'Data visualization' }] },
            { text: 'Identify relationships, trends, and factors that could affect research results.', lessons: [{ phase: 'data-science', topic: 'time-series-basics', label: 'Trends' }, { phase: 'math', topic: 'hypothesis-testing', label: 'Confounding and causation' }] },
          ],
        },
        {
          name: 'Experimentation',
          weight: '22%',
          objectives: [
            { text: 'Support model training and training optimization.', lessons: [{ phase: 'training', topic: 'lr-schedules-stability', label: 'Training optimization' }] },
            { text: 'Prepare datasets for pretraining, fine-tuning, and RLHF, including scraping and tokenization.', lessons: [{ phase: 'cert-practical', topic: 'dataset-preparation', label: 'Dataset preparation' }, { phase: 'training', topic: 'data-curation', label: 'Curation and quality' }] },
            { text: 'Help design and conduct hardware or software tests for LLM applications.', lessons: [{ phase: 'cert-practical', topic: 'hands-on-rag-eval', label: 'LLM application tests' }, { phase: 'cert-practical', topic: 'gpu-bottlenecks-tradeoffs', label: 'Hardware profiling' }] },
            { text: 'Evaluate technologies for cost, portability, compatibility, and usability.', lessons: [{ phase: 'cert-practical', topic: 'choosing-comparing-stack', label: 'Technology trade-offs' }] },
            { text: 'Understand human-subject data collection, including feedback used for RLHF.', lessons: [{ phase: 'cert-practical', topic: 'human-feedback-collection', label: 'Human feedback' }] },
            { text: 'Evaluate and refine existing models and benchmarks.', lessons: [{ phase: 'evaluation', topic: 'standard-benchmarks', label: 'Benchmarks' }, { phase: 'evaluation', topic: 'experiments-and-tuning', label: 'Model refinement' }] },
            { text: 'Run experiments to evaluate models and pipelines.', lessons: [{ phase: 'evaluation', topic: 'experiments-and-tuning', label: 'Experiment design' }, { phase: 'evaluation', topic: 'perplexity', label: 'Evaluation metrics' }] },
          ],
        },
        {
          name: 'Software Development',
          weight: '24%',
          objectives: [
            { text: 'Support deployment and evaluation of model scalability, performance, and reliability.', lessons: [{ phase: 'nvidia', topic: 'llm-serving-metrics', label: 'Serving performance' }, { phase: 'mlops', topic: 'monitoring-drift', label: 'Reliability monitoring' }] },
            { text: 'Build LLM use cases such as RAG, chatbots, and summarizers.', lessons: [{ phase: 'genai', topic: 'rag', label: 'RAG applications' }, { phase: 'nlp', topic: 'nlp-generation-tasks', label: 'Summarization' }] },
            { text: 'Recognize Python NLP package capabilities, including spaCy, NumPy, and vector databases.', lessons: [{ phase: 'cert-practical', topic: 'python-tools-to-recognize', label: 'Python tools' }] },
            { text: 'Identify data, hardware, and software components required by user needs.', lessons: [{ phase: 'cert-practical', topic: 'choosing-comparing-stack', label: 'Component selection' }] },
            { text: 'Monitor data collection, experiments, and software processes.', lessons: [{ phase: 'cert-practical', topic: 'monitoring-processes', label: 'Process monitoring' }] },
            { text: 'Use Python packages such as spaCy, NumPy, and Keras for traditional ML analyses.', lessons: [{ phase: 'cert-practical', topic: 'python-tools-to-recognize', label: 'Python tool selection' }, { phase: 'ml', topic: 'metrics', label: 'ML analyses' }] },
            { text: 'Write software components or scripts under senior-team supervision.', lessons: [{ phase: 'cert-practical', topic: 'llm-app-components', label: 'LLM software components' }] },
          ],
        },
        {
          name: 'Trustworthy AI',
          weight: '10%',
          objectives: [
            { text: 'Describe ethical principles of trustworthy AI.', lessons: [{ phase: 'trustworthy', topic: 'tai-principles', label: 'Trustworthy AI principles' }] },
            { text: 'Explain the balance between data privacy and data consent.', lessons: [{ phase: 'cert-practical', topic: 'security-privacy-consent', label: 'Privacy and consent' }] },
            { text: 'Describe how NVIDIA and other technologies can improve AI trustworthiness.', lessons: [{ phase: 'trustworthy', topic: 'nemo-guardrails-safety-models', label: 'Guardrails and safety tools' }] },
            { text: 'Describe approaches to minimizing bias in AI systems.', lessons: [{ phase: 'trustworthy', topic: 'bias-sources', label: 'Bias and mitigation' }] },
          ],
        },
      ],
    },
    // 4
    {
      id: 'nca-genl-study-plan',
      plain: "Plan from a diagnostic quiz, not the calendar alone. Allocate more time to high-weight weak domains and schedule retrieval practice plus hands-on work.",
      internGuide: ["Plan from a diagnostic quiz, not the calendar alone. Allocate more time to high-weight weak domains and schedule retrieval practice plus hands-on work.","Week 1 can cover ML/Transformers; week 2 prompting/RAG; week 3 customization, inference, and evaluation; week 4 analysis, trust, and mixed revision. Extend when needed.","For every study block, produce evidence: a short explanation, solved calculation, code/lab result, error diagnosis, or corrected quiz answer. Passive reading is insufficient.","Before exam day, recheck official rules, identity, time zone, webcam/microphone, network, room, and power. Do not assume an old course list or proctor rule remains current."],
      si: 'ඔයාට සතියකට පැය 10ක් දාන්න පුළුවන් නම් සති 4කින් පැය 40ක් පාඩම් කරගන්න පුළුවන්. පළමු සතියේ fundamentals, දෙවැනියේ prompting සහ RAG, තුන්වැනියේ fine-tuning සහ inference, හතරවැනියේ analysis සහ revision කරන්න. Maths අමාරු නම් Colombo බස් එකේ ගමන වගේ buffer දවස් 2–3ක් තියාගෙන සති 6කට දිගු කරන්න. Exam දවසට කලින් webcam, internet සහ ID එක test කරලා තියාගන්න.',
      title: 'Your 4-Week NCA-GENL Plan, Official DLI Courses, Reading List & Exam-Day Tips',
      body: [
        'The study guide proposes a 4-week plan for an experienced full-stack developer. Leave 2–3 buffer days each week, especially if maths is difficult, and extend the plan to 6 weeks if needed. Week 1: ML/DL foundations, Transformers, tokenization, and embeddings (Phases 17, 3, 5, 16, 14). Work through Fundamentals of Deep Learning notebooks and read the Attention and BERT papers. Week 2: prompt engineering, RAG, vector databases, and spaCy (Phases 6, 12, 13, 4). Take Rapid Application Development with LLMs and build a RAG chatbot using a build.nvidia.com NIM endpoint and Milvus or pgvector.',
        'Week 3: customization (LoRA, PEFT, RLHF), inference optimization, NVIDIA tools, experimentation, and metrics (Phases 15, 9, 14, 11). Fine-tune a small model with LoRA, serve it with Triton or NIM, and run lm-evaluation-harness. Week 4: data analysis, Trustworthy AI, NeMo Guardrails, and revision (Phases 1, 17, 10, and this phase). Add NeMo Guardrails to the RAG bot, take practice tests, and revisit weak domains.',
        'NVIDIA recommends several courses for this certification. These are learning resources, not additional exam requirements; choose courses for the topics you need and pair them with the relevant lessons and hands-on practice in this app. Course availability, format, and price may change; check the official links for current details. Further reading includes Attention Is All You Need, the LoRA and BERT papers, Prompt Engineering Guide (promptingguide.ai), NVIDIA’s Prompt Engineering and P-Tuning blog, Mastering LLM Techniques: Inference Optimization and Customization, What Is RAG?, Hugging Face Illustrating RLHF, relevant chapters of the Hugging Face LLM Course, Triton Quick Start, TensorRT Get Started, NeMo Best Practices, the NVIDIA GenerativeAIExamples repository, What Is Trustworthy AI?, and the NIST AI RMF.',
        'Exam-day tips: you have about one minute per question. Flag difficult questions and return to them later. Know what NeMo, NIM, Triton, TensorRT-LLM, NeMo Guardrails, and RAPIDS are used for. You do not need to write code, but should recognize what spaCy, NumPy, scikit-learn, and Hugging Face are for. Since the exam is remotely proctored, test your webcam, internet, and microphone the day before. Clear your desk, leave your phone outside the room, and prepare a UPS or fully charged laptop in case of a power cut.',
      ],
      analogy:
        'It is like preparing for O/L or A/L exams: cover the syllabus, practise model papers, and revisit weak chapters in the final week. Just as you prepare your admission card, pen, and ID, prepare your webcam, internet connection, and ID for this exam.',
      example:
        'A sample week: on weekdays, read two topics from a phase on the site from 8–9 p.m., then take a quiz from 9–9:30 p.m. Spend 3 hours on Saturday on a hands-on lab, such as the Week 2 RAG chatbot. On Sunday, spend 1 hour writing down and reviewing missed quiz questions. That is about 10 hours per week, or 4 × 10 = 40 hours over 4 weeks.',
      keyPoints: [
        'Week 1 fundamentals → Week 2 prompting/RAG → Week 3 customization/inference/eval → Week 4 analysis/trust/revision.',
        'If maths is difficult, leave buffer days and extend the plan to 6 weeks if needed.',
        'Rapid Application Development With LLMs is the main DLI course in this study plan.',
        'On exam day, flag difficult questions and check the webcam, internet, and desk setup in advance.',
      ],
      terms: [
        { en: 'Rapid Application Development With LLMs', si: 'The main DLI course recommended here for NCA-GENL preparation.' },
        { en: 'Fundamentals of Deep Learning', si: 'An NVIDIA DLI course with learning materials available on GitHub.' },
        { en: 'build.nvidia.com', si: 'An NVIDIA site where you can try models through NIM APIs.' },
        { en: 'Flag for Review', si: 'Marking a difficult exam question so you can return to it later.' },
      ],
      resources: [
        { title: 'Getting Started With Deep Learning', url: 'https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-01+V1', description: 'Self-paced; deep learning fundamentals, architectures, augmentation, and transfer learning.' },
        { title: 'Accelerating End-to-End Data Science Workflows', url: 'https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-DS-01+V2', description: 'Self-paced; RAPIDS and GPU-accelerated data science.' },
        { title: 'Introduction to Transformer-Based NLP', url: 'https://courses.nvidia.com/courses/course-v1:DLI+S-FX-08+V1/', description: 'Self-paced; Transformers and NLP applications.' },
        { title: 'Building LLM Applications with Prompt Engineering', url: 'https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-12+V2', description: 'Self-paced; prompt engineering and application workflows.' },
        { title: 'Rapid Application Development With LLMs', url: 'https://learn.nvidia.com/courses/course-detail?course_id=course-v1:DLI+S-FX-26+V1', description: 'Self-paced; embeddings, LLM application development, and agents.' },
        { title: 'NVIDIA NCA-GENL recommended courses and exam topics', url: 'https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate.md', description: 'Official certification blueprint and learning-path overview.' },
      ],
    },
    // 5
    {
      id: 'python-tools-to-recognize',
      plain: "Recognize the job of each tool: NumPy arrays/numerics, pandas or cuDF tables, scikit-learn classical ML, Keras neural-network APIs, spaCy production NLP pipelines, and Hugging Face model/dataset tooling.",
      internGuide: ["Recognize the job of each tool: NumPy arrays/numerics, pandas or cuDF tables, scikit-learn classical ML, Keras neural-network APIs, spaCy production NLP pipelines, and Hugging Face model/dataset tooling.","A vector database/client stores and searches embeddings plus metadata; it does not create trustworthy embeddings or guarantee relevant retrieval by itself.","Choose by data type and task. Tokenization, named entities, training a classifier, matrix operations, and vector search require different libraries.","Exam check: distinguish a framework from a model hub, an inference server, and a database. Validate current APIs in documentation rather than memorizing import syntax."],
      si: 'ඔයාට bank complaints 10,000කින් branch නාම සහ දිනයන් ගන්න ඕනේ නම් spaCy NER ගැළපෙනවා. Complaints positive ද negative ද කියලා වෙන් කරලා 5-fold cross-validation කරන්න scikit-learn යොදාගන්න. ඒවායේ embeddings දාලා සමාන complaints හොයන්න Milvus හෝ pgvector වගේ vector database එකක් භාවිතා කරන්න. NumPy ගණිතයට, Keras neural networks හදන්න, Hugging Face pretrained models ගන්න උපකාරී.',
      title: 'Python Tools to Recognize: spaCy, NumPy, Keras, scikit-learn, Hugging Face & Vector DB Clients',
      body: [
        'The exam does not ask you to write code, but may ask which library fits a task. Learn a one-sentence job description for each tool. See Phase 1 for NumPy and pandas and Phase 4 for spaCy and Hugging Face.',
        'spaCy is a production-ready NLP pipeline for tokenization, named-entity recognition (NER), part-of-speech (POS) tagging, lemmatization, and dependency parsing. It can extract names, places, and dates from documents before RAG. NumPy provides fast numeric arrays for vectors, matrices, embeddings, cosine similarity, and matrix multiplication. Keras is a high-level API for building neural networks with layers and model.fit(). scikit-learn provides classic ML algorithms (logistic regression, random forest, k-means), train/test splitting, cross-validation, and metrics such as accuracy, F1, and R².',
        'Hugging Face includes transformers (load pretrained models and tokenizers), datasets (load, map, and filter datasets), peft (LoRA), trl (SFT and DPO training), and the Hub (share models and datasets). Vector database clients include pymilvus (Milvus), faiss (the FAISS library), pgvector (a PostgreSQL extension used through clients such as psycopg or SQLAlchemy), chromadb, and qdrant-client. They store embeddings and search for nearby vectors (Phase 13).',
        'For GPU work, RAPIDS cuDF is similar to pandas and cuML offers GPU-accelerated ML tools (Phases 9, 17). NeMo is NVIDIA’s framework for building and customizing LLMs. One exam distinction: both spaCy and NLTK support NLP, but spaCy is commonly used for production pipelines while NLTK is often used for learning and research.',
      ],
      analogy:
        'Think of a hardware shop’s tools: NumPy is like a screwdriver used in many jobs; Keras is like a drill for assembling neural networks; and scikit-learn is a toolbox for common ML tasks. The Hugging Face Hub is like a shop of ready-made parts, while spaCy is a specialist tool for inspecting what is inside text. An exam question might ask which tool you would use to inspect a light’s wiring.',
      example:
        'For 10,000 bank complaints, use spaCy NER to extract branch names and dates. To classify complaints as positive or negative with logistic regression and 5-fold cross-validation, use scikit-learn. To store 10,000 complaint embeddings and search for similar complaints, use Milvus, FAISS, or pgvector.',
      code: {
        lang: 'python',
        src: `# pip install spacy numpy && python -m spacy download en_core_web_sm
import spacy, numpy as np

nlp = spacy.load("en_core_web_sm")          # Load a small English pipeline
doc = nlp("Keells opened a new store in Kandy on 5 May 2025.")
for ent in doc.ents:                          # NER: names, places, dates
    print(ent.text, ent.label_)               # Keells ORG, Kandy GPE, ...
print([(t.text, t.pos_) for t in doc][:4])    # POS tagging

a, b = np.array([1.0, 2.0, 3.0]), np.array([2.0, 4.0, 6.5])
cos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b))   # cosine similarity
print(round(cos, 3))                          # Near 1 means similar directions`,
      },
      keyPoints: [
        'spaCy = NER, POS, and tokenization pipeline. NumPy = arrays and numerical computing.',
        'Keras = an easy-to-use neural-network API. scikit-learn = classic ML, cross-validation, and metrics.',
        'Hugging Face = transformers, datasets, peft, trl, Hub.',
        'pymilvus, faiss, pgvector, and chromadb = store embeddings and search by similarity.',
      ],
      terms: [
        { en: 'spaCy', si: 'An industrial NLP library for NER, POS tagging, lemmatization, and dependency parsing.' },
        { en: 'NumPy', si: 'A Python library for fast numeric arrays.' },
        { en: 'Keras', si: 'A high-level API for building neural networks.' },
        { en: 'scikit-learn', si: 'A library for classic ML algorithms, preprocessing, cross-validation, and metrics.' },
        { en: 'Hugging Face transformers / datasets', si: 'Tools for loading pretrained models and tokenizers and for loading and processing datasets.' },
        { en: 'Vector DB Client', si: 'A Python library, such as pymilvus, faiss, or pgvector, for interacting with a vector database.' },
      ],
    },
    // 6
    {
      id: 'numbers-to-know',
      plain: "Treat formulas as estimates with stated assumptions. A dense Transformer layer is often approximated near 12·d² parameters, but embeddings, biases, gated MLPs, and architecture variants change the total.",
      internGuide: ["Treat formulas as estimates with stated assumptions. A dense Transformer layer is often approximated near 12·d² parameters, but embeddings, biases, gated MLPs, and architecture variants change the total.","Weight memory is parameters times bytes per stored weight. Training adds gradients, optimizer states, activations, temporary buffers, and sometimes master weights.","KV-cache size depends on layers, retained key/value heads, head dimension, tokens, batch/concurrency, and bytes. Grouped-query attention changes the calculation.","Attention score work grows quadratically with sequence length for standard full attention, but total runtime/memory also includes projections, MLPs, kernels, and optimized attention implementations."],
      si: 'ඔයාට 7B parameter model එක FP16-කින් තියාගන්න නම් 7B × 2 bytes = 14 GB weights ඕනේ. Adam mixed-precision training-ට parameter එකකට දළ වශයෙන් 16 bytes, ඒ නිසා 7B × 16 ≈ 112 GB, activations තවමත් ඇතුළත් නෑ. Sequence length එක 2 ගුණ කළොත් attention වැඩේ n² නිසා දළ වශයෙන් 4 ගුණ වෙනවා. Colombo දවස් ගණනාවක් chat history තියාගන්න KV cache එකත් GPU memory කනවා.',
      title: 'Numbers to Know: 12·d² per Layer, Weight Memory, 16 Bytes per Parameter, KV Cache, n²',
      body: [
        'The study guide highlights five useful estimates. Understanding why they work is more useful on an exam than memorizing them. See Phase 16 for parameter counting and Phase 14 for GPU-memory calculations.',
        '(1) Parameters per layer ≈ 12·d², where d is the model width, or the length of each token vector. Attention has four d × d matrices (Q, K, V, and output), giving 4·d². The feed-forward network expands d to 4d and projects it back, using matrices d × 4d and 4d × d for 8·d². Together these give 12·d². (2) Attention cost is O(n²·d): each token is compared with the others, so doubling sequence length n makes this work about four times larger.',
        '(3) Weight memory = parameter count × bytes per parameter. FP16 uses 2 bytes, INT8 uses 1, and INT4 uses 0.5. A 7B model therefore needs about 14 GB at FP16, 7 GB at INT8, or 3.5 GB at INT4 for weights. (4) Adam mixed-precision training uses roughly 16 bytes per parameter before activations: weights, gradients, an FP32 master copy, and two Adam states. For 7B parameters, 7B × 16 ≈ 112 GB; this is one reason LoRA/PEFT is useful. (5) KV cache = 2 × layers × KV heads × head dimension × sequence length × batch size × bytes. The factor 2 accounts for K and V. For Llama 2 7B in FP16, the estimate is about 0.5 MB per token, or about 2 GB for 4,096 tokens.',
      ],
      analogy:
        'Model weights are like the luggage you carry to a house. The KV cache is like notes you keep during a conversation. During training, you also need notebooks for gradients and Adam states, not just the weights, so the GPU-memory “lorry” needs much more capacity.',
      example:
        'For Llama 2 7B, take d = 4,096 and 32 layers. Per layer, 12 × 4,096² ≈ 201 million parameters; across 32 layers that is about 6.4 billion. Adding embedding and output layers (32,000 × 4,096 × 2 ≈ 0.26B) gives about 6.7B, hence the “7B” label. KV cache per token: 2 × 32 × 32 × 128 × 2 bytes = 524,288 bytes ≈ 0.5 MB. With 8 users and 4,096 tokens each, 0.5 MB × 4,096 × 8 ≈ 16 GB. Weights (14 GB) plus KV cache (16 GB) total about 30 GB, so this estimate does not fit on a 24 GB GPU.',
      code: {
        lang: 'python',
        src: `# Quickly estimate memory and parameters for a model such as Llama 2 7B
params = 7e9
for name, bytes_per in [("FP16", 2), ("INT8", 1), ("INT4", 0.5)]:
    print(name, params * bytes_per / 1e9, "GB weights")   # 14, 7, 3.5
print("Adam training ~", params * 16 / 1e9, "GB")          # ~112 GB

d, layers = 4096, 32
print("per layer ~", 12 * d * d / 1e6, "M params")          # ~201M
kv_per_token = 2 * layers * 32 * 128 * 2                   # K+V, heads 32, dim 128, FP16
print("KV/token ~", kv_per_token / 2**20, "MB")             # ~0.5 MB
print("KV 4096 tokens ~", kv_per_token * 4096 / 2**30, "GB") # ~2 GB`,
      },
      keyPoints: [
        '12·d² = 4·d² for attention + 8·d² for the FFN. The FFN contains more of these parameters.',
        'Weights memory = params × bytes. 7B → 14 / 7 / 3.5 GB (FP16 / INT8 / INT4).',
        'Adam training ≈ 16 bytes/param → 7B ≈ 112 GB.',
        'KV cache grows linearly with sequence length and batch size. Attention work grows with n².',
      ],
      terms: [
        { en: 'd_model (d)', si: 'The model width: the number of values in each token vector.' },
        { en: 'O(n²)', si: 'A growth pattern where doubling the input length makes the work about four times larger.' },
        { en: 'Bytes per Parameter', si: 'The memory needed to store one weight: FP32 4, FP16 2, INT8 1, and INT4 0.5 bytes.' },
        { en: 'KV Cache', si: 'Memory that stores keys and values from earlier tokens during generation.' },
      ],
    },
    // 7
    {
      id: 'following-llm-research',
      plain: "Start with a concrete question and prefer the paper, official code/model card, and versioned documentation over social summaries.",
      internGuide: ["Start with a concrete question and prefer the paper, official code/model card, and versioned documentation over social summaries.","Read title/abstract, problem, method, experimental setup, baselines, ablations, limitations, and conclusion. Check whether the evaluation supports the headline claim.","Record model/data scale, compute, contamination controls, metrics, confidence/variance, licenses, and reproducibility artifacts. A benchmark gain may not transfer to your task.","Track a small set of trusted venues, arXiv alerts, lab blogs, and release notes; periodically synthesize what changed instead of collecting unread links."],
      si: 'ඔයා අලුත් LLM paper එකක් බලද්දී abstract එකෙන් ප්‍රශ්නය සහ ප්‍රධාන අදහස හඳුනාගන්න. ඊට පස්සේ baseline එක, dataset එක, evaluation metric එක සහ ablation results බලන්න. arXiv එකේ paper එකක් තියෙනවා කියලා ඒක peer review වෙලා හෝ claim එක සත්‍යයි කියලා අදහස් වෙන්නේ නෑ. ක්‍රිකට් scorecard එකක් බලනවා වගේ, headline එකට වඩා actual results සහ සසඳපු baseline එක බලන්න.',
      title: 'Keeping Up with LLM Research Papers & Trends: Where and How',
      body: [
        'The Core ML domain includes following new LLM research and trends. The exam is not about reading every paper; it expects you to recognize important ideas such as RoPE, GQA, FlashAttention, MoE, LoRA, DPO, speculative decoding, and reasoning models. See Phase 8, “Reading Research Papers,” for a method to read papers.',
        'Where to look: arXiv (cs.CL for language, cs.LG for machine learning, and cs.AI) is an early source for papers. The community upvotes popular daily papers on Hugging Face Papers. NVIDIA Technical Blog and NVIDIA Research explain features in NVIDIA tools such as TensorRT-LLM, NeMo, and NIM. GTC conference talks are available on demand. NeurIPS, ICML, ICLR, ACL, and EMNLP are major research conferences. When a model is released, read its model card and technical report as well.',
        'How to read: use three passes. Pass 1: read the title, abstract, figures, and conclusion (about 10 minutes) to decide whether it matters to you. Pass 2: read the method and results tables; note the baseline, size of the improvement, and benchmark. Pass 3: read the mathematics and code only if needed. Choose just 1–2 papers per week and write a one-sentence summary of each in a notebook. Do not be swayed by hype: a 1% improvement on a small benchmark may not be significant.',
      ],
      analogy:
        'A cricket fan does not watch every match for eight hours. They watch highlights (the abstract), check the scorecard (results table), and watch a full replay (the paper) only for an important match. Follow research in the same selective way.',
      example:
        'A weekly routine: spend 15 minutes on Monday morning reviewing the top 10 Hugging Face daily papers. Choose one and read its abstract and figures. In your notebook write, “GQA: several query heads share one K/V head → smaller KV cache → faster inference.” After a month, you may be able to explain 4–8 useful ideas clearly.',
      keyPoints: [
        'Main sources include arXiv, Hugging Face Papers, NVIDIA Technical Blog, GTC, and conferences.',
        'Use three passes: abstract/figures → method/results → mathematics/code if needed.',
        'Recognize concepts such as RoPE, GQA, FlashAttention, MoE, LoRA, DPO, and speculative decoding.',
        'Assess claims by checking the baseline, benchmark, and size of the improvement.',
      ],
      terms: [
        { en: 'arXiv', si: 'A site where research papers are made freely available before peer review.' },
        { en: 'Hugging Face Papers', si: 'A page where the community upvotes popular AI papers each day.' },
        { en: 'Technical Report', si: 'A document accompanying a model release that describes training, data, and results.' },
        { en: 'Baseline', si: 'An existing or simpler method used to compare with a new method.' },
      ],
    },
    // 8
    {
      id: 'llm-app-components',
      plain: "Separate an LLM application into input validation, prompt/context construction, retrieval, model gateway, tools, output validation, persistence, and observability.",
      internGuide: ["Separate an LLM application into input validation, prompt/context construction, retrieval, model gateway, tools, output validation, persistence, and observability.","Use typed schemas and narrow interfaces. Keep secrets and authorization in application/tool code, not prompt text, and treat model output as untrusted.","Add timeouts, retry classification, rate limits, idempotency for side effects, citations, error messages, and fallbacks. Log versions without leaking sensitive content.","Test each component with fixtures, then end-to-end scenarios including malformed input, missing evidence, provider failure, injection, duplicated requests, and unsafe actions."],
      si: 'LLM app එක model call එක විතරක් නෙවෙයි; loader, retriever, prompt, client, validator සහ logging එකට වැඩ කරනවා. උදාහරණයක්ට FAQ bot එකක් chunks 4ක් ගෙන model එකට යවලා JSON answer එක validate කරනවා. API එක 429 error දුන්නොත් retries සහ timeout නිසා service එක වහාම අසාර්ථක නොවෙයි. කඩේ kitchen එකක එක් එක් කෙනාට වෙනම වැඩක් තියෙනවා වගේ components වෙන් කරලා හදන්න.',
      title: 'Writing Scripts & Software Components for LLM Applications',
      body: [
        'The Software Development domain includes writing scripts and components for LLM applications. An LLM app is more than a model call; it is a pipeline of components such as a document loader, chunker, embedding client, vector store, retriever, prompt template, LLM client, output parser/validator, guardrails, and logging. This is similar to microservice design.',
        'A good LLM client component should: (1) read configuration (model name, base URL, temperature) from environment variables or a config file instead of hard-coding it; (2) use timeouts and retries with exponential backoff because APIs can return 429 rate-limit or 5xx errors; (3) request structured output such as JSON and parse and validate it (Phases 6, 14); (4) log prompt version, model, tokens, and latency for each call; and (5) keep API keys out of code (see this phase’s security topic).',
        'NVIDIA NIM endpoints provide an OpenAI-compatible API, so you can use the OpenAI Python SDK and change its base_url. This can make it possible to switch between hosted NIM on build.nvidia.com and NIM or vLLM running on your own GPU by changing the URL. This can improve portability.',
      ],
      analogy:
        'Think of a kottu shop kitchen: one person chops vegetables (chunker), another prepares the roti (embedder), the chef (LLM) makes the final dish, and the cashier (output validator) checks the bill. Each has a separate job, so if one part is temporarily unavailable because of an API error, retries can help the workflow recover.',
      example:
        'Customer FAQ bot: when a request arrives, the retriever fetches 4 chunks (about 40 ms), which are added to the prompt template. The LLM client call has a 30-second timeout and 3 retries. A JSON parser validates {"answer": ..., "sources": [...]}. Log model=llama-3.1-8b, 1,200 input tokens, 150 output tokens, and 1.8 s latency. If parsing fails, retry once; if it fails again, return an “I cannot answer confidently” fallback.',
      code: {
        lang: 'python',
        src: `import os
from openai import OpenAI   # NIM provides an OpenAI-compatible API

client = OpenAI(base_url=os.environ.get("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
                api_key=os.environ["NVIDIA_API_KEY"],   # Read the key from the environment, not code
                timeout=30, max_retries=3)              # Set timeout and retries

def ask(question: str, context: str) -> str:
    resp = client.chat.completions.create(
        model=os.environ.get("LLM_MODEL", "meta/llama-3.1-8b-instruct"),
        messages=[        {"role": "system", "content": "Answer using only the context."},
                  {"role": "user", "content": f"Context:\\n{context}\\n\\nQ: {question}"}],
        temperature=0.2, max_tokens=300)
    print("tokens:", resp.usage.total_tokens)              # Log for cost and monitoring
    return resp.choices[0].message.content`,
      },
      keyPoints: [
        'LLM app = loader, chunker, embedder, retriever, prompt, LLM client, validator, logging.',
        'Read configuration from environment variables, use timeouts and retries, and validate structured output.',
        'NIM and vLLM offer OpenAI-compatible APIs, so switching the base_url may be enough.',
        'Log the model, prompt version, token counts, and latency for every call.',
      ],
      terms: [
        { en: 'OpenAI-compatible API', si: 'An endpoint that uses the OpenAI API format; NIM and vLLM provide compatible APIs.' },
        { en: 'Exponential Backoff', si: 'Increasing the wait between retries, for example 1, 2, then 4 seconds.' },
        { en: 'Prompt Template', si: 'A versioned prompt with placeholders for variables.' },
        { en: 'Output Validator', si: 'A component that checks whether model output matches a required schema.' },
      ],
    },
    // 9
    {
      id: 'choosing-comparing-stack',
      plain: "Write requirements first: task quality, latency, throughput, data residency, model size, team skills, availability, integrations, and budget.",
      internGuide: ["Write requirements first: task quality, latency, throughput, data residency, model size, team skills, availability, integrations, and budget.","Compare candidates on total cost, portability, compatibility, usability/operations, security, support, and measured performance—not marketing throughput alone.","Use a weighted decision table only after defining non-negotiable constraints. A high score cannot compensate for a failed license, privacy, or memory requirement.","Prototype with representative data and load, document assumptions and exit criteria, and retain a rollback or migration path for changing vendors and versions."],
      si: 'ඔයා private documents නිතර update කරන support bot එකක් හදනවා නම් RAG එක fine-tuning වලට වඩා ගැළපෙන්න පුළුවන්. 8B model එකක් FP16 weights සඳහා 16 GB පමණ ගන්නවා, ඒකට KV cache එකත් එකතු කරන්න ඕනේ. Hosted API එක ලේසියි, self-hosted NIM හෝ vLLM එකට GPU සහ නඩත්තුව ඕනේ. Cost, portability, compatibility, usability වලට ලකුණු දීලා weighted score එක ගණනය කරන්න.',
      title: 'Choosing Data, Hardware & Software for a Use Case; Comparing on Cost, Portability, Compatibility, Usability',
      body: [
        'When choosing a stack for a use case, ask about three areas. Data: what types (text, PDFs, tables), how much, whether it is private, and how often it changes. RAG can suit private, frequently changing knowledge; fine-tuning can teach style or format (Phases 13, 15). Hardware: will the model fit in memory? An 8B FP16 model needs about 16 GB for weights plus KV cache, so a 24 GB GPU (L4, A10G) may be enough for some workloads. A 70B FP16 model needs about 140 GB for weights, requiring several 80 GB GPUs or quantization. Training needs much more memory and GPU-to-GPU bandwidth than inference.',
        'Software: choose a hosted API (build.nvidia.com, Bedrock) or self-hosting. For self-hosting, NIM is an optimized container, vLLM is flexible open source, and Triton with TensorRT-LLM can target high performance but requires more setup. Use NeMo or Hugging Face (transformers, peft, trl) for training/customization and RAPIDS or NeMo Curator for data processing.',
        'Compare technologies on four factors from the Experimentation domain: Cost (GPU-hour, per million tokens, engineering time, and maintenance); Portability (ease of moving across clouds or on premises—containers, ONNX, and OpenAI-compatible APIs can help reduce vendor lock-in); Compatibility (fit with GPU architecture, CUDA/driver versions, PyTorch, and formats such as safetensors, GGUF, or ONNX); and Usability (documentation, learning curve, team skills, and community support).',
        'A practical method is a weighted decision matrix. Assign weights to the four criteria that sum to 1, score each option from 1 to 5, then add weight × score. Record the matrix and reasoning in an Architecture Decision Record (ADR).',
      ],
      analogy:
        'Choosing a stack is like choosing transport from Colombo to Kandy. A train may cost less, a taxi may be easier but more expensive, and your own car may go anywhere but needs maintenance. Check whether your luggage fits on the bus (compatibility), then give more weight to the factors that matter most.',
      example:
        'Option A, a hosted API, scores Cost 3, Portability 2, Compatibility 5, Usability 5. Option B, self-hosted NIM on EKS, scores 4, 4, 4, 3. Use weights 0.4, 0.2, 0.2, 0.2. A = 0.4×3 + 0.2×2 + 0.2×5 + 0.2×5 = 1.2 + 0.4 + 1.0 + 1.0 = 3.6. B = 0.4×4 + 0.2×4 + 0.2×4 + 0.2×3 = 1.6 + 0.8 + 0.8 + 0.6 = 3.8. B scores slightly higher, but with low traffic a changed cost score could make A the better choice.',
      code: {
        lang: 'python',
        src: `# Compare technologies with a weighted decision matrix
weights = {"cost": 0.4, "portability": 0.2, "compatibility": 0.2, "usability": 0.2}
options = {
    "Hosted API":      {"cost": 3, "portability": 2, "compatibility": 5, "usability": 5},
    "NIM on EKS":      {"cost": 4, "portability": 4, "compatibility": 4, "usability": 3},
    "Triton+TRT-LLM":  {"cost": 5, "portability": 3, "compatibility": 3, "usability": 2},
}
for name, s in options.items():
    total = sum(weights[k] * s[k] for k in weights)   # Sum of weight times score
    print(f"{name:16} {total:.2f}")                   # Highest score = best fit`,
      },
      keyPoints: [
        'Data: choose RAG or fine-tuning. Hardware: check memory fit and whether the task is training or inference. Software: choose hosted or self-hosted.',
        'NIM = optimized serving in a container. vLLM = flexible open source. Triton + TRT-LLM = a high-performance serving stack.',
        'Compare cost, portability, compatibility, and usability.',
        'A weighted decision matrix and ADR are useful architecture practices.',
      ],
      terms: [
        { en: 'Portability', si: 'How easily a stack can be moved to another environment.' },
        { en: 'Compatibility', si: 'Whether the stack works with a GPU, CUDA, framework, and model format.' },
        { en: 'Vendor Lock-in', si: 'A situation where it is difficult to move away from one provider.' },
        { en: 'Architecture Decision Record (ADR)', si: 'A short document recording a decision, alternatives, and reasons.' },
      ],
    },
    // 10
    {
      id: 'monitoring-processes',
      plain: "Monitor the process as well as the final model: collection volume/consent, schema and label quality, experiment status, software builds, deployment, and production outcomes.",
      internGuide: ["Monitor the process as well as the final model: collection volume/consent, schema and label quality, experiment status, software builds, deployment, and production outcomes.","Define metrics, owner, expected range, alert threshold, and response playbook. An unowned dashboard does not control risk.","Track lineage from raw data through dataset, code/config, model, evaluation, and deployment. Use run IDs and versioned artifacts so a result can be reproduced.","Review failures and drift by segment, distinguish data/infra/model causes, and record corrective action. Redact secrets and personal data from telemetry."],
      si: 'ඔයාගේ scraping job එක සාමාන්‍යයෙන් දවසකට documents 5,000ක් ගෙනාවත් අද 300ක් විතරක් ලැබුණොත් ඒක බලන්න ඕනේ. Null text 2% ඉඳන් 40%ට ගියොත් website එකේ වෙනසක් හෝ pipeline දෝෂයක් වෙන්න පුළුවන්. Training run එකේ config, data version, git commit සහ validation loss සටහන් කළාම හොඳම run එක හොයාගන්න ලේසියි. Production bot එකේ p95 latency තත්පර 3 ඉක්මවූ විට alert එකක් දාන්න.',
      title: 'Monitoring Data Collection, Experiments & Software Processes',
      body: [
        'The Software Development domain includes monitoring data collection, experiments, and software processes. Consider each separately. See Phase 7 for MLOps monitoring and drift, and Phase 11 for experiment tracking and reproducibility.',
        'For data-collection monitoring, check whether the pipeline is collecting data correctly: row counts (did they suddenly fall to zero?), schema (did columns change?), null/empty-value percentage, duplicates, freshness (when did data last arrive?), and label distribution (did the positive/negative ratio change?). For scraping, also track failed URLs and the language mix.',
        'For experiment monitoring, log each run’s configuration (learning rate, batch size, LoRA rank), data version, Git commit, training and validation loss curves, evaluation metrics, and GPU utilization in Weights & Biases or MLflow. Alert if loss becomes NaN or validation loss starts increasing. This helps answer which run worked best and why.',
        'For software-process monitoring, collect production logs, metrics, and traces. Metrics include requests per second, error rate, p50/p95 latency, TTFT, tokens per second, GPU utilization and memory (DCGM exporter → Prometheus/CloudWatch), and queue length. LLM-specific metrics include token use and cost, guardrail block rate, user feedback, and hallucination complaints. Set alerts against an SLO, for example p95 latency above 3 seconds for 5 minutes.',
      ],
      analogy:
        'Think of a Ceylon tea factory. At collection, workers check the weight and moisture of leaves (data collection). Inside, they record the temperature and time for each batch (experiments) to learn which settings made the best tea. On the packing line (software process), they count packages and check for damage. If one stage is not monitored, problems may only become visible at the end.',
      example:
        'A daily scraping job normally collects 5,000 documents, but today it collected only 300 and null text rose from 2% to 40%. An alert reveals that the website’s HTML structure changed. Without that alert, the next fine-tuning run could train on 40% empty text and harm the model.',
      code: {
        lang: 'python',
        src: `import pandas as pd

df = pd.read_json("todays_batch.jsonl", lines=True)   # Load today's collected data
checks = {
    "rows": len(df),                                     # Row count
    "null_text_pct": df["text"].isna().mean() * 100,     # Percentage of empty text
    "dup_pct": df.duplicated("text").mean() * 100,       # Percentage of duplicates
    "missing_cols": {"text", "source", "date"} - set(df.columns),  # Missing schema columns
}
print(checks)
if checks["rows"] < 1000 or checks["null_text_pct"] > 5:
    print("ALERT: data collection problem!")             # Stop the pipeline`,
      },
      keyPoints: [
        'Data: rows, schema, nulls, duplicates, freshness, label distribution.',
        'Experiments: config, data version, git commit, loss curves, metrics → W&B / MLflow.',
        'Software: latency p95, TTFT, error rate, GPU util, tokens, cost, guardrail blocks.',
        'Set alerts against SLOs to catch data problems early.',
      ],
      terms: [
        { en: 'Data Freshness', si: 'How recently new data was received.' },
        { en: 'Experiment Tracking', si: 'Saving and comparing settings and results for each training run.' },
        { en: 'SLO (Service Level Objective)', si: 'A target for a service, such as 95% of requests completing in under 3 seconds.' },
        { en: 'DCGM Exporter', si: 'An NVIDIA tool that sends GPU metrics to a monitoring system such as Prometheus.' },
      ],
    },
    // 11
    {
      id: 'dataset-preparation',
      plain: "Define permitted sources, purpose, licenses/consent, languages/domains, target quality, and split strategy before scraping or labeling.",
      internGuide: ["Define permitted sources, purpose, licenses/consent, languages/domains, target quality, and split strategy before scraping or labeling.","Normalize formats, remove corruption and unwanted PII, deduplicate documents and near-duplicates, filter quality/safety, and preserve provenance.","Tokenization converts curated text to model IDs; sequence packing and sampling affect training efficiency and distribution. Fit or choose the tokenizer deliberately.","Prevent train/evaluation contamination, version every transformation, inspect samples and statistics, and document known gaps rather than assuming a large dataset is good."],
      si: 'ඔයා සිංහල FAQ documents 1,000ක් RAG සඳහා සකස් කරනවා නම් මුලින්ම duplicate, හිස් text සහ වැරදි encoding ඉවත් කරන්න. පසුව sentence boundary සහ අර්ථය සලකා chunks හදා metadata එක් කරන්න. Tokenizer එකෙන් token ගණන බලන්න; characters 500ක් හැම model එකකටම සමාන tokens නෙවෙයි. Fine-tuning හෝ RLHF සඳහා නම් private data, license සහ labels ගැනත් පරීක්ෂා කරන්න.',
      title: 'Preparing Datasets for Pretraining, Fine-Tuning & RLHF: Scraping, Cleaning, Tokenization',
      body: [
        'Dataset preparation is covered in the Experimentation domain. See Phase 15 for deeper treatment of curation, quality filtering, MinHash deduplication, decontamination, and NeMo Curator. Here we review the shape of datasets and the steps for three training stages.',
        'Pretraining data is a large collection of unlabeled raw text. Steps: (1) scrape or collect data while respecting robots.txt, website terms, and licenses; (2) extract text from HTML and remove menus and ads; (3) identify language; (4) filter low-quality items such as very short text, unusual characters, and spam; (5) remove exact and near duplicates; (6) remove PII such as phone numbers, emails, and NIC numbers; (7) decontaminate by excluding benchmark test data; (8) tokenize and pack into fixed-length sequences.',
        'Fine-tuning (SFT) data consists of instruction → response pairs, usually in JSONL chat “messages” format. Quality matters more than quantity. Format data with the model’s chat template and calculate loss only on assistant tokens (loss masking). RLHF/DPO data pairs a prompt with two responses and a preference: {"prompt", "chosen", "rejected"}. The next topic explains how to collect it.',
        'For tokenization, use the model’s own tokenizer. Inspect token lengths and check whether examples longer than the maximum are truncated. For pretraining, pack sequences by joining short documents to reduce padding; for fine-tuning, use padding or packing as appropriate. See Phase 14 for more on tokenization.',
      ],
      analogy:
        'It is like preparing rice and curry: collect the rice (scraping), remove stones (cleaning), avoid adding the same rice twice (deduplication), discard spoiled grains (quality filtering), and measure portions to fit the pot (tokenizing and packing). Poor preparation limits even the best chef (model).',
      example:
        'Sri Lankan news sites වලින් articles 100,000ක් scrape කළා. HTML extract කළාම හිස් / ගොඩක් කෙටි ඒවා 8,000ක්. Near-duplicates (එකම news එක sites කිහිපයක) 22,000ක්. ඉතුරු 70,000. Tokenize කළාම සාමාන්‍යයෙන් article එකකට tokens 900 → ≈ tokens 63 million. Tokens 2,048 sequences වලට pack කළාම ≈ sequences 30,800ක්.',
      code: {
        lang: 'python',
        src: `from datasets import load_dataset
from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("Qwen/Qwen2.5-0.5B")       # model එකේම tokenizer එක
ds = load_dataset("json", data_files="clean_articles.jsonl")["train"]
ds = ds.filter(lambda x: len(x["text"]) > 200)                 # ගොඩක් කෙටි ඒවා අයින්

def tokenize(batch):
    return tok(batch["text"], truncation=True, max_length=2048)  # token IDs

ds = ds.map(tokenize, batched=True, remove_columns=["text"])
lengths = [len(ids) for ids in ds["input_ids"]]
print("total tokens:", sum(lengths))                           # data ප්‍රමාණය tokens වලින්
print("truncated:", sum(l == 2048 for l in lengths))           # කැපුණු examples ගණන`,
      },
      keyPoints: [
        'Pretraining: scrape → extract → language ID → filter → dedup → PII → decontaminate → tokenize + pack.',
        'SFT: instruction/response JSONL, chat template, assistant tokens විතරක් loss.',
        'RLHF/DPO: prompt + chosen + rejected.',
        'Use the model’s own tokenizer and check for truncation.',
      ],
      terms: [
        { en: 'Web Scraping', si: 'Automatically collecting content from websites while respecting robots.txt and site terms.' },
        { en: 'robots.txt', si: 'A file that tells bots which pages on a website they may access.' },
        { en: 'Sequence Packing', si: 'Combining short examples into one sequence to reduce padding waste.' },
        { en: 'Preference Pair', si: 'Two responses to one prompt: the preferred (chosen) response and the other (rejected) response.' },
      ],
    },
    // 12
    {
      id: 'human-feedback-collection',
      plain: "Define the decision the feedback should teach and a clear rubric. Pairwise preference asks which output is better; ratings and critiques supply different signals.",
      internGuide: ["Define the decision the feedback should teach and a clear rubric. Pairwise preference asks which output is better; ratings and critiques supply different signals.","Build an interface that randomizes order, hides irrelevant model identity, captures ties/invalid cases and rationale, and protects raters from sensitive material.","Train raters with examples, measure agreement, adjudicate disagreements, audit speed/quality, and sample across languages, groups, tasks, and difficult cases.","Obtain consent and fair conditions, minimize personal data, version prompts/responses/rubrics, and keep a held-out evaluation set separate from preference training."],
      si: 'ඔයා annotator කෙනෙකුට එකම ප්‍රශ්නයට model එකේ answers දෙකක් පෙන්වා වඩා හොඳ එක තෝරන්න කියන්න. ඔවුන්ගේ කැමැත්ත, භාෂාව සහ rating guideline එක සටහන් කළොත් feedback එක තේරුම් ගන්න පුළුවන්. Answer දෙකම නරක නම් ඒකත් සටහන් කරන්න, අනිවාර්යයෙන් winner එකක් තෝරන්න එපා. Annotators 3 දෙනෙක් දාලා disagreement වැඩි උදාහරණ review කිරීමෙන් quality පාලනය කරන්න.',
      title: 'Collecting Human Feedback for RLHF: Preference UI, Pairwise Comparisons, Guidelines, Quality Control',
      body: [
        'RLHF එකේ දෙවැනි පියවර reward model එක train කරන එක. ඒකට human preference data ඕනේ (RLHF සහ DPO maths Phase 15 එකේ). ප්‍රශ්නය: ඒ data එක හොඳට එකතු කරන්නේ කොහොමද? Exam එකේ "Collecting human feedback for RLHF" කියලා කෙළින්ම තියෙනවා.',
        'Pairwise comparisons: Annotator කෙනෙකුට "මේ උත්තරයට 1-10 ලකුණු දෙන්න" කිව්වම හැමෝගෙම scale එක වෙනස් (එක්කෙනෙක් 7 දෙන එකට අනිකා 5 දෙනවා). ඒත් "A ද B ද හොඳ?" කියලා ඇහුවම එකඟතාවය වැඩියි. ඒ නිසා RLHF වලට පොදු ක්‍රමය pairwise. Preference UI එකේ: prompt එක උඩින්, උත්තර දෙක පැත්තට පැත්ත, buttons: A හොඳයි / B හොඳයි / Tie / දෙකම නරකයි. Optional: "කොච්චර හොඳද" (slightly / much better) සහ හේතුව ලියන්න පොඩි box එකක්. Tools: Label Studio, Argilla වගේ.',
        'Annotator guidelines: "හොඳ උත්තරයක්" කියන්නේ මොකක්ද කියලා ලිඛිතව නිර්වචනය කරන්න: helpful (ප්‍රශ්නයට උත්තර දෙනවද), honest (බොරු නැද්ද, දන්නේ නැති දේ පිළිගන්නවද), harmless (අනතුරුදායක නැද්ද). ගැටුම් වෙද්දී priority එක (උදා: safety > accuracy > style). හොඳ / නරක examples සහ අමාරු edge cases දෙන්න. Annotators ලාව training round එකකින් පස්සේ විතරක් ඇත්ත වැඩට දාන්න.',
        'Quality control: (1) Gold questions: උත්තරය දන්නා items අතරට මිශ්‍ර කරලා annotator accuracy බලන්න. (2) එකම item එක annotators 2-3කට දීලා inter-annotator agreement (Cohen kappa, Phase 11) මනින්න. (3) A / B පිළිවෙල random කරන්න (position bias), කොයි model එකෙන්ද කියලා හංගන්න (blind). (4) ගොඩක් ඉක්මනට click කරන අය හොයන්න. (5) Harmful content බලන annotators ලාගේ wellbeing සහ සාධාරණ ගෙවීම. අන්තිම output එක {"prompt", "chosen", "rejected"} JSONL.',
      ],
      analogy:
        'Rice and curry competition එකක විනිසුරුවන් වගේ. "මේ කෑමට 1-10 ලකුණු" කිව්වම එක විනිසුරුවෙක් ලෝභයි, අනිකා දානපතියි. ඒත් "මේ පිඟාන දෙකෙන් කොයි එකද රස?" කියලා ඇහුවම ගොඩක් වෙලාවට එකඟයි. පිඟාන දෙක හදපු ආච්චිලාගේ නම් හංගනවා (blind). විනිසුරුවන්ට කලින්ම "රසය, ලුණු, පෙනුම" කියන නීති දෙනවා (guidelines).',
      example:
        'Prompts 2,000ක්, හැම එකටම annotators 3 දෙනෙක් → judgments 6,000ක්. Gold questions 100ක් මිශ්‍ර කළා. Annotator X gold accuracy 58% විතරයි (අනිත් අය 85%+) → X ගේ labels අයින් කළා. Annotators දෙදෙනා එකඟ වුණේ 74% → majority vote එකෙන් chosen / rejected තීරණය කළා. Tie සහ "දෙකම නරකයි" items 300ක් reward model training එකෙන් අයින් කළා.',
      code: {
        lang: 'python',
        src: `import json, random

def show_pair(prompt, ans_a, ans_b):
    pair = [("model_1", ans_a), ("model_2", ans_b)]
    random.shuffle(pair)                       # position bias අඩු කරන්න random පිළිවෙල
    return pair                                # UI එකට model නම් පෙන්නන්නේ නෑ (blind)

def save_preference(prompt, pair, picked_index, f):
    chosen, rejected = pair[picked_index][1], pair[1 - picked_index][1]
    f.write(json.dumps({"prompt": prompt, "chosen": chosen, "rejected": rejected}) + "\\n")

# annotators දෙදෙනෙක්ගේ එකඟතාවය (සරල % එක)
a = ["A", "B", "A", "A", "B"]; b = ["A", "B", "B", "A", "B"]
print(sum(x == y for x, y in zip(a, b)) / len(a))   # 0.8 = 80% එකඟයි`,
      },
      keyPoints: [
        'Pairwise (A vs B) ලකුණු scale එකකට වඩා විශ්වාසදායකයි.',
        'Guidelines: helpful / honest / harmless, priority order, examples, edge cases.',
        'QC: gold questions, annotators කිහිපයක්, agreement, random order, blind.',
        'Output = prompt + chosen + rejected → reward model හෝ DPO.',
      ],
      terms: [
        { en: 'Pairwise Comparison', si: 'උත්තර දෙකක් එකට පෙන්නලා හොඳ එක තෝරන්න කියන එක.' },
        { en: 'Annotator Guidelines', si: 'Labelers ලා තීරණ ගන්න ඕනේ නීති සහ examples ලියපු document එක.' },
        { en: 'Gold Questions', si: 'උත්තරය කලින්ම දන්නා items. Annotator quality මනින්න.' },
        { en: 'Inter-Annotator Agreement', si: 'Annotators කොච්චර එකඟද කියන මිනුම (උදා: Cohen kappa).' },
        { en: 'Position Bias', si: 'මුලින්ම / වම් පැත්තේ පෙන්නන උත්තරය තෝරන්න තියෙන නැඹුරුව.' },
      ],
    },
    // 13
    {
      id: 'data-analysis-r2-trends',
      plain: "Use loss for the optimization objective and task metrics for usefulness. R² compares squared error with a mean-target baseline; 1 is perfect, 0 matches that baseline, and it can be negative.",
      internGuide: ["Use loss for the optimization objective and task metrics for usefulness. R² compares squared error with a mean-target baseline; 1 is perfect, 0 matches that baseline, and it can be negative.","A trend or correlation does not establish causation. Look for confounders, selection effects, leakage, seasonality, aggregation artifacts, and changes in measurement.","Choose charts that preserve the data structure, show uncertainty and sample size, and avoid truncated/misleading axes. Slice results before accepting an average.","Compare models on the same untouched test protocol and include practical effect, variability, latency, cost, and failure categories—not one favorable number."],
      si: 'ඔයා Colombo සහ Kandy branches වල sales model දෙකක් සසඳනවා නම් එකම test data සහ metric භාවිතා කරන්න. R² 1ට ආසන්න නම් model එක target එකේ වෙනස්වීම් හොඳින් පැහැදිලි කරනවා; 0ට අඩු අගයක් average prediction එකටත් වඩා නරක විය හැකියි. සති 4ක trend එක line chart එකකින්, branches සසඳන්න bar chart එකකින් පෙන්වන්න. වැසි දවස් sales සහ traffic දෙකටම බලපාන confounder එකක් විය හැකියි.',
      title: 'Data Analysis Domain: Comparing Models (Loss, R²), Data Mining, Charts, Trends & Confounding Factors',
      body: [
        'Data analysis domain එක 14%යි. ප්‍රධාන කොටස් තුනක්: statistical metrics වලින් models සසඳන එක, data mining සහ visualization, සහ trends සහ results වලට බලපාන factors හොයන එක. Classification metrics Phase 2 සහ 17, EDA සහ charts Phase 1, correlation vs causation Phase 0 එකේ තියෙනවා.',
        'Loss එකෙන් සසඳද්දී: models දෙක එකම dataset එකේ, එකම loss function එකෙන්, validation / test data එකේ සසඳන්න ඕනේ. Training loss අඩු වුණාට validation loss වැඩි නම් overfitting. R² (proportion of explained variance) සරලව: "සාමාන්‍ය අගය (average) හැම වෙලේම කියනවාට වඩා මගේ model එක කොච්චර හොඳද?" R² = 1 - (model එකේ වැරදි වල square එකතුව ÷ average එක කියපු වැරදි වල square එකතුව). R² = 1 → පරිපූර්ණයි. R² = 0 → average එක කියනවා වගේමයි. R² 0ට අඩු නම් → average එකටත් වඩා නරකයි. R² = 0.8 කියන්නේ target එකේ වෙනස්වීම් (variance) වලින් 80%ක් model එකෙන් පැහැදිලි වෙනවා කියන එක.',
        'Data mining සහ charts: data ගොඩක් ඇතුළේ patterns හොයන එක (groups, associations, outliers). Chart එක තෝරන්නේ ප්‍රශ්නය අනුව: කාලයත් එක්ක වෙනස (trend) → line chart. Categories සසඳන්න → bar chart. එක variable එකක distribution එක → histogram. Variables දෙකක සම්බන්ධය → scatter plot. Spread සහ outliers → box plot. Correlation matrix / confusion matrix → heatmap. Python එකේ Matplotlib (seaborn, plotly ත්).',
        'Confounding factor: A සහ B දෙකටම බලපාන තුන්වැනි දෙයක්. ඒ නිසා A සහ B අතර සම්බන්ධයක් පේනවා, ඇත්තටම A එක B එක ඇති කරන්නේ නැතත්. AI උදාහරණය: Model 2 ගේ accuracy වැඩියි, ඒත් ඒක test කළේ ලේසි ප්‍රශ්න set එකක. Difficulty එක confounder. විසඳුම: එකම test set, slices වලට කඩලා බලන්න (දිග / භාෂාව / difficulty අනුව), random A/B tests. Simpson paradox: groups වෙන වෙනම බැලුවම trend එක එකක්, ඔක්කොම එකතු කළාම විරුද්ධ trend එකක් පේන්න පුළුවන්.',
      ],
      analogy:
        'R²: Colombo ගෙවල් මිල අනුමාන කරන්න ඔයාගේ යාළුවා හැම ගෙදරකටම "ලක්ෂ 300යි" (average) කියනවා. ඔයාගේ model එක ගෙදරක ප්‍රමාණය, ප්‍රදේශය බලලා කියනවා. ඔයාගේ වැරදි යාළුවාගේ වැරදි වලින් 20%ක් විතරයි නම්, R² = 0.8. Confounder: වැස්ස කාලෙට කුඩ විකුණුම් සහ dengue cases දෙකම වැඩි වෙනවා. කුඩ නිසා dengue එන්නේ නෑ. වැස්ස තමයි දෙකටම හේතුව.',
      example:
        'ගෙවල් 3ක ඇත්ත මිල (ලක්ෂ): 200, 300, 400. Average = 300. Average එකේ වැරදි: -100, 0, +100 → squares 10,000 + 0 + 10,000 = 20,000. Model එක කිව්වේ 220, 290, 380 → වැරදි: -20, +10, +20 → squares 400 + 100 + 400 = 900. R² = 1 - 900 ÷ 20,000 = 1 - 0.045 = 0.955. Model එක variance එකෙන් 95.5%ක් පැහැදිලි කරනවා.',
      code: {
        lang: 'python',
        src: `from sklearn.metrics import r2_score, mean_squared_error
import matplotlib.pyplot as plt

actual = [200, 300, 400]            # ඇත්ත මිල (ලක්ෂ)
pred   = [220, 290, 380]            # model එකේ අනුමාන
print("R2 :", r2_score(actual, pred))             # 0.955
print("MSE:", mean_squared_error(actual, pred))   # 300.0

epochs = [1, 2, 3, 4, 5]
train  = [2.1, 1.6, 1.3, 1.1, 0.9]
val    = [2.2, 1.8, 1.6, 1.7, 1.9]  # 3න් පස්සේ වැඩි වෙනවා = overfitting
plt.plot(epochs, train, label="train loss"); plt.plot(epochs, val, label="val loss")
plt.xlabel("epoch"); plt.ylabel("loss"); plt.legend(); plt.show()   # trend = line chart`,
      },
      keyPoints: [
        'Loss සසඳන්නේ එකම data, එකම loss function, validation/test මත.',
        'R² = average එක කියනවාට වඩා model එක කොච්චර හොඳද. 1 හොඳම, 0 average එක වගේ, 0ට අඩු නරකයි.',
        'Trend → line, categories → bar, distribution → histogram, relationship → scatter, outliers → box, matrix → heatmap.',
        'Confounder = දෙකටම බලපාන තුන්වැනි දෙය. Slices, same test set, A/B tests වලින් අල්ලන්න.',
      ],
      terms: [
        { en: 'R² (Coefficient of Determination)', si: 'Target එකේ variance එකෙන් කොච්චර ප්‍රමාණයක් model එක පැහැදිලි කරනවද.' },
        { en: 'Variance', si: 'Values average එකෙන් කොච්චර විසිරිලාද කියන මිනුම.' },
        { en: 'Data Mining', si: 'ලොකු data වලින් patterns, groups, associations, outliers හොයන එක.' },
        { en: 'Confounding Factor', si: 'Variables දෙකටම බලපාන, බොරු සම්බන්ධයක් පෙන්නන තුන්වැනි variable එක.' },
        { en: 'Simpson Paradox', si: 'Groups වෙන වෙනම සහ එකට බැලුවම trend එක විරුද්ධ වෙන අවස්ථාව.' },
      ],
    },
    // 14
    {
      id: 'security-privacy-consent',
      plain: "Security protects confidentiality, integrity, and availability; privacy governs appropriate personal-data use; consent is one possible lawful/ethical basis and is not identical to privacy.",
      internGuide: ["Security protects confidentiality, integrity, and availability; privacy governs appropriate personal-data use; consent is one possible lawful/ethical basis and is not identical to privacy.","Inventory datasets, weights, prompts, logs, credentials, and dependencies. Classify sensitivity, minimize collection, define retention/deletion, and restrict access by least privilege.","Keep secrets in managed stores, encrypt data, isolate environments, scan/sign dependencies and images, log access, and test backup and incident response.","For every dataset or feedback program, record provenance, purpose, permission/license, user notice/choices, cross-border handling, and whether withdrawal/deletion can be honored."],
      si: 'ඔයාගේ API key එක public GitHub එකට ගියොත් මුලින්ම key එක revoke කරලා අලුත් එකක් හදන්න; commit එක මකා දැමීම විතරක් ප්‍රමාණවත් නෑ. Training service එකට අවශ්‍ය bucket එකට විතරක් access දෙන්න, production database එකට අනවශ්‍ය permission දෙන්න එපා. Customer data encrypt කරලා policy එක අනුව, උදාහරණයට දවස් 30කට පස්සේ මකන්න. Privacy කියන්නේ data ආරක්ෂා කිරීමයි; consent කියන්නේ ඒ අරමුණට භාවිතා කරන්න අවසර තිබීමයි.',
      title: 'Protecting Datasets, Weights, Prompts & Credentials; Least Privilege, Retention, Supply Chain, Privacy vs Consent',
      body: [
        'AI system එකක ආරක්ෂා කරන්න ඕනේ වත්කම් හතරක් තියෙනවා. Datasets (customer data, training data), model weights (මිලියන ගණන් වියදම් කරලා හදපු IP එක), prompts (system prompt එකේ business logic, සමහර වෙලාවට leak වෙන්න පුළුවන්), credentials (API keys, DB passwords). Credentials කවදාවත් code එකේ හෝ Git එකේ තියන්න එපා. AWS Secrets Manager / SSM Parameter Store, HashiCorp Vault වගේ secrets manager එකකින් runtime එකේදී ගන්න. Local එකේ .env file එක .gitignore එකට දාන්න. gitleaks / git-secrets වගේ tools commit එකට කලින් scan කරන්න. Key එකක් leak වුණොත් commit එක මකනවා විතරක් නෙවෙයි, key එක වහාම rotate (revoke) කරන්න.',
        'Access control සහ least privilege: හැම user / service එකකටම වැඩේට අවශ්‍ය අවම permissions විතරයි. Inference service එකට weights bucket එක read-only. Training job එකට production DB එකට access නෑ. Long-lived access keys වෙනුවට IAM roles. Data encrypt කරන්න (at rest KMS, in transit TLS). Agents වලට tools දෙද්දීත් least privilege (Phase 12). Data retention: prompts සහ logs වල PII තියෙන්න පුළුවන්. කොච්චර කාලයක් තියාගන්නවද කියලා policy එකක් (උදා: දවස් 30), ඊට පස්සේ automatic delete (S3 lifecycle rules). Logs වල PII mask කරන්න (Phase 10).',
        'Supply chain: ඔයා download කරන models, datasets, containers, pip packages ඔක්කොම අවදානම්. Pickle (.bin / .pt) files load කරද්දී code execute වෙන්න පුළුවන්. Safetensors format එක ආරක්ෂිතයි. Trusted sources (NGC signed containers, verified Hub orgs), checksums, dependency versions pin කිරීම, container image scanning. Human review / escalation: ණය අනුමත කිරීම, වෛද්‍ය, නීති වගේ high-impact decisions වලට model එක තනියම තීරණය කරන්නේ නෑ. Confidence අඩු නම් හෝ risk වැඩි නම් මිනිසෙකුට escalate කරන්න.',
        'Data privacy vs data consent (Trustworthy AI domain එක): Privacy = data ආරක්ෂා කරලා, අවශ්‍ය අයට විතරක් පෙන්නන එක. Consent = data එක කොයි අරමුණකට පාවිච්චි කරන්නද කියලා ඒ කෙනා අවසර දීලා තියෙනවද කියන එක. Data එක ආරක්ෂිතව තිබුණත් (privacy ok), customer support වලට දුන්න chats එකතු කරලා model training වලට පාවිච්චි කරන්න consent නැත්නම් ඒක ප්‍රශ්නයක්. සමබර කරන ක්‍රම: purpose limitation, data minimization, opt-in / opt-out, anonymization (Phase 10), Sri Lanka PDPA (Phase 10).',
      ],
      analogy:
        'Bank එකක් හිතන්න. සල්ලි (datasets, weights) vault එකේ. Vault key එක (credentials) cashier ගේ මේසේ උඩ (Git repo) තියන්නේ නෑ, safe එකේ (secrets manager). Cashier ට vault එකට යන්න බෑ, manager ට විතරයි (least privilege). පරණ documents අවුරුදු 7කින් විනාශ කරනවා (retention). ලොකු ණයක් නම් manager අත්සන ඕනේ (human escalation). Customer ගේ account එක රහසිගතව තියාගන්නවා (privacy), ඒත් customer ගේ අවසරය නැතුව ඒ විස්තර marketing වලට දෙන්නේ නෑ (consent).',
      example:
        'Developer කෙනෙක් NVIDIA_API_KEY එක public GitHub repo එකකට commit කළා. මිනිත්තු කිහිපයකින් bots ඒක හොයාගෙන ඔයාගේ quota එක පාවිච්චි කරන්න පටන් ගන්නවා. නිවැරදි ප්‍රතිචාරය: (1) key එක වහාම revoke / rotate. (2) usage logs බලන්න. (3) Git history එකෙන් අයින් කරන්න (ඒත් rotate කිරීම තමයි වැදගත්ම). (4) Secrets manager + pre-commit secret scanning දාන්න.',
      code: {
        lang: 'python',
        src: `import os, json, boto3

# නරකයි: api_key = "nvapi-abc123..."  (Git එකට යනවා!)

def get_api_key() -> str:
    if "NVIDIA_API_KEY" in os.environ:                    # local dev: .env (gitignored)
        return os.environ["NVIDIA_API_KEY"]
    sm = boto3.client("secretsmanager")                   # prod: AWS Secrets Manager
    secret = sm.get_secret_value(SecretId="prod/llm/nvidia")  # IAM role එකෙන් access
    return json.loads(secret["SecretString"])["api_key"]

key = get_api_key()
print("key loaded:", key[:4] + "****")                    # logs වල key එක සම්පූර්ණයෙන් print කරන්න එපා`,
      },
      keyPoints: [
        'Datasets, weights, prompts, credentials = ආරක්ෂා කරන්න ඕනේ වත්කම් 4.',
        'Secrets manager, .gitignore, secret scanning. Leak වුණොත් rotate කරන්න.',
        'Least privilege + IAM roles + encryption + retention policy.',
        'Supply chain: safetensors, trusted sources, pinned versions, image scanning.',
        'Privacy = ආරක්ෂාව. Consent = අරමුණට අවසරය. දෙකම ඕනේ.',
      ],
      terms: [
        { en: 'Secrets Manager', si: 'Passwords / API keys ආරක්ෂිතව save කරලා runtime එකේ දෙන service එක.' },
        { en: 'Least Privilege', si: 'වැඩේට අවශ්‍ය අවම permissions විතරක් දෙන නීතිය.' },
        { en: 'Data Retention', si: 'Data කොච්චර කාලයක් තියාගෙන, කවදා මකනවද කියන policy එක.' },
        { en: 'Supply Chain Security', si: 'පිටින් ගේන models, packages, containers විශ්වාසදායකද කියලා තහවුරු කිරීම.' },
        { en: 'Safetensors', si: 'Load කරද්දී code execute නොවෙන, ආරක්ෂිත model weights format එක.' },
        { en: 'Data Consent', si: 'Data එක නිශ්චිත අරමුණකට පාවිච්චි කරන්න අයිතිකරු දෙන අවසරය.' },
      ],
    },
    // 15
    {
      id: 'model-lifecycle-deployment',
      plain: "Version code, data, configuration, tokenizer, weights/adapters, runtime, evaluation, and model card as one releasable system.",
      internGuide: ["Version code, data, configuration, tokenizer, weights/adapters, runtime, evaluation, and model card as one releasable system.","Promote through development, validation, staging/canary, and production with objective gates. Keep previous compatible artifacts and a tested rollback procedure.","Local, cloud, and data-center deployments trade control, elasticity, cost, connectivity, and operations. Offline batch favors throughput; online serving emphasizes latency and availability.","Monitor quality, drift, latency, errors, utilization, cost, and safety after release. Define triggers for rollback, recalibration, retraining, or retirement."],
      si: 'ඔයා model එක v1 සිට v2ට update කරනකොට model file, config, dataset සහ code version එක සටහන් කරන්න. New version එකේ error rate වැඩි වුණොත් කලින් stable version එකට rollback කරන්න පුළුවන්. Offline inference එකෙන් සකස් කළ batch එකක් පසුව process කරනවා; online inference එක request ආපු වෙලාවේ answer දෙයි. Cloud, data center හෝ local deployment තෝරද්දී network, privacy, latency සහ GPU resource සලකා බලන්න.',
      title: 'Model Lifecycle: Versioning, Updates, Rollback; Local vs Cloud vs Data Center; Offline vs Online Inference',
      body: [
        'Model එකක් deploy කරලා ඉවර නෑ. ඒකට ජීවිත චක්‍රයක් (lifecycle) තියෙනවා: develop → evaluate → register → deploy → monitor → update / retire. Model registry එකක (MLflow, SageMaker Model Registry) හැම version එකක්ම, ඒකේ training data version එක, eval results, approve කරපු කෙනා save කරන්න (Phase 7). LLM app එකක version කරන්න ඕනේ model එක විතරක් නෙවෙයි: prompt template, retrieval index, embedding model, guardrail config එකත්.',
        'Updates සහ rollback: අලුත් version එක ඔක්කොටම එකපාරටම දාන්න එපා. Regression eval suite එකක් (golden questions) pass වුණොත් විතරක් promote කරන්න. ඊට පස්සේ canary (traffic 5%), shadow (අලුත් model එකට copy traffic, users ට පේන්නේ නෑ), blue/green (පරණ සහ අලුත් environments දෙකක්, switch එකකින් මාරු). Metrics නරක් වුණොත් පරණ version එකට ඉක්මනට rollback. ඒකට පරණ version එක තවම deploy කරලා තියෙන්න ඕනේ. Hosted APIs පාවිච්චි කරද්දී "latest" alias එක නෙවෙයි, නිශ්චිත model version එක pin කරන්න. Provider පරණ model එක deprecate කරන දින බලාගෙන ඉන්න.',
        'Deployment patterns: Local (laptop / workstation GPU, Ollama, llama.cpp): privacy උපරිම, cost අඩු, ඒත් scale නෑ. Cloud (AWS SageMaker, EKS, Bedrock): ඉක්මනට පටන් ගන්න, autoscaling, pay-as-you-go. ඒත් GPU පැය ගණන් ලොකු වෙන්න පුළුවන්. Data center / on-prem (DGX, HGX): data sovereignty, දිගුකාලීනව ලොකු, නිතර usage එකකට ලාභ වෙන්න පුළුවන්. ඒත් මුලින් ලොකු ආයෝජනයක්, power, cooling, staff ඕනේ.',
        'Offline (batch) inference: data ගොඩක් එකපාර process කරනවා, user කෙනෙක් බලාගෙන නෑ. උදා: රෑට documents 1 million summarize කිරීම, embeddings නැවත හැදීම. Throughput සහ cost වැදගත්, latency නෙවෙයි. ලොකු batches, spot instances, SageMaker Batch Transform. Online (real-time) inference: user එක request එකකට උත්තරය බලාගෙන. Latency (TTFT, p95) වැදගත්. Always-on endpoint, autoscaling, streaming.',
      ],
      analogy:
        'Bus timetable එක මාරු කරනවා වගේ. අලුත් route එක එකපාරටම බස් ඔක්කොටම දාන්නේ නෑ, එක bus එකකින් try කරනවා (canary). අවුල් නම් පරණ route එකට ආපහු (rollback). Offline vs online: බේකරියේ පාන් රෑට ලොකු ප්‍රමාණයක් පුච්චලා තියනවා (batch). Kottu එක customer ඉස්සරහදීම හදනවා (online).',
      example:
        'අලුත් fine-tuned model v2: golden set එකේ accuracy 82% → 86%. Canary 5% traffic දවස් 2ක්. Thumbs-down rate 4% සිට 9% දක්වා ගියා (Sinhala ප්‍රශ්න වලට නරකයි). මිනිත්තු 5න් router එකේ weight එක v1 ට 100% කළා (rollback). පස්සේ Sinhala slice එක eval suite එකට එකතු කළා, ඒ නිසා ඊළඟ පාර මේ ප්‍රශ්නය deploy වෙන්න කලින්ම අල්ලනවා.',
      keyPoints: [
        'Version කරන්න: model, prompt, index, embedding model, guardrail config.',
        'Eval gate → canary / shadow / blue-green → monitor → rollback.',
        'Local = privacy, Cloud = speed + elasticity, Data center = control + දිගුකාලීන cost.',
        'Offline = throughput / cost. Online = latency.',
      ],
      terms: [
        { en: 'Model Registry', si: 'Model versions, metadata, approval status save කරන තැන.' },
        { en: 'Canary Deployment', si: 'අලුත් version එකට traffic පොඩි ප්‍රතිශතයක් විතරක් යවලා පරීක්ෂා කිරීම.' },
        { en: 'Shadow Deployment', si: 'අලුත් model එකට traffic copy කරලා results සසඳන එක, users ට පේන්නේ නෑ.' },
        { en: 'Blue/Green Deployment', si: 'පරණ (blue) සහ අලුත් (green) environments දෙකක් තියාගෙන switch කිරීම.' },
        { en: 'Rollback', si: 'ප්‍රශ්නයක් ආවොත් ඉක්මනටම පරණ හොඳ version එකට ආපහු යාම.' },
        { en: 'Batch (Offline) Inference', si: 'Data ගොඩක් එකපාර process කරන, latency වැදගත් නැති inference.' },
      ],
    },
    // 16
    {
      id: 'hands-on-finetune-deploy',
      plain: "Select a small permitted model and task, create clean train/validation/test splits, establish a prompt-only baseline, then choose LoRA/QLoRA or full tuning from resources and need.",
      internGuide: ["Select a small permitted model and task, create clean train/validation/test splits, establish a prompt-only baseline, then choose LoRA/QLoRA or full tuning from resources and need.","Record versions and settings; monitor loss and held-out task quality; save adapters/checkpoints and test that reloading reproduces inference.","Package preprocessing, tokenizer, model, and generation settings behind a typed API with health checks, limits, authentication, and structured errors.","Test with curl and Python on normal, edge, unsafe, and concurrent requests; measure latency/memory and compare to the baseline before calling the fine-tune useful."],
      si: 'ඔයා පුංචි dataset එකක LoRA adapter එකක් train කරලා base model එක වෙනස් නොකර task එකකට tune කරන්න පුළුවන්. Training ඉවර වුණාම model/API එක serve කරලා curl හෝ Python request එකකින් test කරන්න. GPU memory අඩු නම් batch size 8 වෙනුවට 2 කරලා gradient accumulation steps 4ක් දාන්න; effective batch එක 8ම වෙනවා. Output, latency සහ errors සටහන් කරලා deployment එක සාර්ථකද බලන්න.',
      title: 'Hands-On: Fine-Tune on an NVIDIA GPU, Then Deploy a Model and Test Its API (curl & Python)',
      body: [
        'පියවර 1: NVIDIA GPU environment එකක් ගන්න. විකල්ප: Google Colab (T4), AWS EC2 G5 / G6 instance එකක් (Deep Learning AMI), හෝ ඔයාගේ GPU එක. Terminal එකේ nvidia-smi දුවලා GPU එක, driver version එක, memory එක පේනවද බලන්න. Dependency අවුල් නැතුව පටන් ගන්න හොඳම ක්‍රමය NGC PyTorch container එක: docker run --gpus all -it --rm nvcr.io/nvidia/pytorch:<YY.MM>-py3 (tag එක NGC catalog එකෙන් තෝරන්න). Container එක ඇතුළේ python -c "import torch; print(torch.cuda.is_available())" → True ද බලන්න.',
        'පියවර 2: පොඩි fine-tune එකක්. Phase 15 එකේ අන්තිම hands-on topic එකේ QLoRA code එක (Qwen2.5-0.5B, LoRA r=16, SFTTrainer) කෙළින්ම මෙතන දුවන්න. Training අතරතුර වෙන terminal එකක watch -n 1 nvidia-smi දාලා GPU memory සහ utilization බලන්න. Validation loss එක log කරන්න. ඉවර වුණාම adapter එක merge කරලා (merge_and_unload) folder එකකට save කරන්න.',
        'පියවර 3: Inference සඳහා deploy කරන්න. විකල්ප A (vLLM): pip install vllm, ඊට පස්සේ vllm serve ./my-merged-model --port 8000 → OpenAI-compatible server එකක්. විකල්ප B (NIM): NGC API key එකක් අරන්, docker run --gpus all -e NGC_API_KEY -p 8000:8000 nvcr.io/nim/meta/llama-3.1-8b-instruct:latest වගේ NIM container එකක් (නිශ්චිත image නම සහ fine-tuned weights / LoRA load කරන හැටි NIM docs වල verify කරන්න). විකල්ප C: Triton + TensorRT-LLM (Phase 9).',
        'පියවර 4: API එක test කරන්න. curl එකෙන්: curl http://localhost:8000/v1/models (models list). ඊට පස්සේ curl http://localhost:8000/v1/chat/completions -H "Content-Type: application/json" -d \'{"model": "<model-name>", "messages": [{"role": "user", "content": "Hello"}], "max_tokens": 50}\'. Python එකෙන් පහළ code එක. Test කරන්න: (1) status 200 ද, (2) උත්තරය අර්ථවත්ද, (3) latency කොච්චරද, (4) එකපාර requests 10ක් යැව්වම මොකද වෙන්නේ.',
      ],
      analogy:
        'Kottu recipe එකක් ඔයාගේ ගෙදර kitchen එකේ practice කරනවා (fine-tune), ඊට පස්සේ කඩයක් open කරනවා (deploy), අන්තිමට යාළුවෝ 10 දෙනෙක්ට එකපාර order කරන්න කියලා kitchen එකට පුළුවන්ද බලනවා (API test + load test).',
      example:
        'G6 instance එකක් (L4 24 GB): QLoRA training 0.5B model, examples 500, epochs 2 → මිනිත්තු 5-10ක් විතර. Merge කරලා vLLM එකෙන් serve කළා. Python test: latency 0.6 s, output tokens 80. Concurrent requests 10 එකපාර: හැම එකකම latency 0.9 s විතර වුණා, ඒත් මුළු throughput එක 8 ගුණයක් වගේ වැඩි වුණා (continuous batching). Instance එක වැඩේ ඉවර වුණාම stop කරන්න අමතක කරන්න එපා.',
      code: {
        lang: 'python',
        src: `import time, requests

URL = "http://localhost:8000/v1/chat/completions"   # vLLM / NIM endpoint එක
body = {"model": "my-merged-model",                  # /v1/models එකේ පෙන්නන නම
        "messages": [{"role": "user", "content": "කොළඹ ගැන වාක්‍ය 2ක් ලියන්න."}],
        "max_tokens": 80, "temperature": 0.3}

t0 = time.time()
r = requests.post(URL, json=body, timeout=60)
print("status:", r.status_code)                      # 200 ද?
data = r.json()
print(data["choices"][0]["message"]["content"])     # උත්තරය
print("latency s:", round(time.time() - t0, 2),
      "| out tokens:", data["usage"]["completion_tokens"])`,
      },
      keyPoints: [
        'nvidia-smi + torch.cuda.is_available() = environment check එක.',
        'NGC PyTorch container = CUDA / driver / PyTorch ගැළපීම් අවුල් අඩුයි.',
        'vLLM / NIM = OpenAI-compatible /v1/chat/completions endpoint එකක්.',
        'Test: status, quality, latency, concurrency. වැඩේ ඉවර වුණාම GPU instance stop කරන්න.',
      ],
      terms: [
        { en: 'NGC Container', si: 'NVIDIA test කරපු CUDA, cuDNN, PyTorch එකට තියෙන Docker image එකක්.' },
        { en: '--gpus all', si: 'Docker container එකට host එකේ GPUs දෙන flag එක (NVIDIA Container Toolkit ඕනේ).' },
        { en: 'vllm serve', si: 'Model එකක් OpenAI-compatible API එකක් විදිහට serve කරන vLLM command එක.' },
        { en: '/v1/chat/completions', si: 'Chat messages යවලා උත්තරය ගන්න standard endpoint එක.' },
      ],
    },
    // 17
    {
      id: 'hands-on-rag-eval',
      plain: "Build a small authoritative corpus with document IDs and page/section metadata. Parse, chunk, embed, and index it while retaining links to original evidence.",
      internGuide: ["Build a small authoritative corpus with document IDs and page/section metadata. Parse, chunk, embed, and index it while retaining links to original evidence.","Create questions with expected evidence and include answerable, unanswerable, ambiguous, and adversarial cases. Keep this set outside prompt tuning.","Measure retrieval first (for example recall@k), then answer correctness, groundedness/citation accuracy, abstention, latency, and cost. Diagnose retrieval versus generation failures separately.","Inspect citations manually, prevent unauthorized documents from retrieval, version corpus/index/prompt/model, and rerun the suite after every component change."],
      si: 'ඔයා Colombo bus routes ගැන documents 20ක් එකතු කරලා text chunks සහ embeddings හදන්න. User question එකක් ආවම අදාළ chunks 3ක් retrieve කරලා ඒ context එකෙන් answer කරන්න කියලා model එකට දෙන්න. Answer එක source document එකේ තියෙන දේට ගැළපෙනවද, citation එක හරිද කියලා ප්‍රශ්න 10ක test set එකකින් බලන්න. Answer එක ලස්සන වුණත් source එකේ සාක්ෂි නැත්නම් ඒක හොඳ RAG answer එකක් නෙවෙයි.',
      title: 'Hands-On: Build a Small RAG Prototype and Evaluate Answers Against Source Documents',
      body: [
        'පියවර 1: Documents 10-20ක් තෝරන්න (උදා: ඔයාගේ company HR policies හෝ Sri Lanka tourism PDFs). Load කරලා chunks වලට කඩන්න (tokens 300-500, overlap 50). හැම chunk එකකටම source file එක සහ page number එක metadata විදිහට තියාගන්න. පියවර 2: Embedding model එකකින් (NVIDIA NeMo Retriever embedding NIM හෝ sentence-transformers) embed කරලා FAISS, Milvus හෝ pgvector එකක save කරන්න. පියවර 3: Question එකට top-k (k = 4) chunks ගෙනල්ලා, "මේ context එකෙන් විතරක් උත්තර දෙන්න, source එක cite කරන්න, නැත්නම් දන්නේ නෑ කියන්න" කියලා prompt එකකට දාලා LLM එකට යවන්න. Chunking, indexing ගැඹුරින් Phase 13.',
        'පියවර 4: Evaluation set එකක් හදන්න. ප්‍රශ්න 20-30ක්, හැම එකටම නිවැරදි උත්තරය සහ ඒක තියෙන source document එක / chunk එක. Documents වල නැති ප්‍රශ්න 3-5කුත් දාන්න ("දන්නේ නෑ" කියනවද බලන්න). පියවර 5: කොටස් දෙකම වෙන වෙනම මනින්න. Retrieval: නිවැරදි chunk එක top-k එකේ තියෙනවද (recall@k / hit rate). Generation: උත්තරය context එකෙන් support වෙනවද (faithfulness), ප්‍රශ්නයට ගැළපෙනවද (answer relevance), නිවැරදි උත්තරයට ගැළපෙනවද (correctness). Metrics විස්තර Phase 13 සහ 11.',
        'පියවර 6: අසාර්ථක වෙච්ච ප්‍රශ්න එකින් එක බලලා හේතුව හොයන්න. Retrieval fail නම් (නිවැරදි chunk එක ආවේ නෑ) → chunk size, embedding model, hybrid search, reranker. Retrieval හරි, උත්තරය වැරදි නම් → prompt එක, model එක, context order. මේ "diagnose → fix → re-run eval" loop එක තමයි ඇත්ත RAG engineering. LLM-as-a-judge පාවිච්චි කරනවා නම් ප්‍රශ්න 20ක් මිනිස්සු විදිහටත් check කරලා judge එක විශ්වාස කරන්න පුළුවන්ද බලන්න.',
      ],
      analogy:
        'Open-book exam එකක් වගේ. Retriever එක පොතේ හරි පිටුව පෙරළන ශිෂ්‍යයා. Generator එක ඒ පිටුව බලලා උත්තරය ලියන ශිෂ්‍යයා. Marks දෙන්න කලින් බලන්න ඕනේ: හරි පිටුව පෙරළුවද (retrieval)? ලියපු දේ ඒ පිටුවේ තියෙනවද, නැත්නම් ඔළුවෙන් හැදුවද (faithfulness)?',
      example:
        'ප්‍රශ්න 25: retrieval hit@4 = 21/25 = 84%. Hit වුණු 21න් faithful උත්තර 18යි (86%). නැති ප්‍රශ්න 4න් "දන්නේ නෑ" කිව්වේ 2යි. Miss වුණු 4 බැලුවම, ඒවා ඔක්කොම tables ඇතුළේ තිබුණ දේවල් → PDF parser එක tables කඩලා. Parser එක හදලා re-run කළාම hit@4 = 24/25 (96%).',
      code: {
        lang: 'python',
        src: `# retrieve(q, k) සහ answer(q, chunks) ඔයාගේ RAG functions කියලා හිතමු
eval_set = [
    {"q": "Annual leave දවස් කීයද?", "source": "hr_policy.pdf#p3", "must_have": "14"},
    {"q": "CEO ගේ උපන්දිනය?", "source": None, "must_have": "දන්නේ නෑ"},   # නැති ප්‍රශ්නය
]
hits, correct = 0, 0
for item in eval_set:
    chunks = retrieve(item["q"], k=4)
    ids = [c["source"] for c in chunks]
    hits += item["source"] is None or item["source"] in ids   # retrieval හරිද
    reply = answer(item["q"], chunks)
    correct += item["must_have"] in reply                      # සරල correctness check එක
print("hit@4:", hits / len(eval_set), "correct:", correct / len(eval_set))`,
      },
      keyPoints: [
        'Chunk + metadata (source, page) → embed → vector store → top-k → grounded prompt.',
        'Eval set: ප්‍රශ්නය + නිවැරදි උත්තරය + source, සහ නැති ප්‍රශ්න කිහිපයක්.',
        'Retrieval (hit@k) සහ generation (faithfulness, relevance, correctness) වෙන වෙනම මනින්න.',
        'Fail වුණු ප්‍රශ්න එකින් එක diagnose කරලා fix → re-run.',
      ],
      terms: [
        { en: 'Hit Rate / Recall@k', si: 'නිවැරදි chunk එක top-k results ඇතුළේ තිබුණු ප්‍රශ්න ප්‍රතිශතය.' },
        { en: 'Faithfulness', si: 'උත්තරයේ කියන දේවල් retrieved context එකෙන් support වෙනවද.' },
        { en: 'Golden Set', si: 'නිවැරදි උත්තර සහ sources සමඟ හදපු ස්ථිර eval ප්‍රශ්න ලැයිස්තුව.' },
      ],
    },
    // 18
    {
      id: 'gpu-bottlenecks-tradeoffs',
      plain: "Define the serving/training objective and capture an end-to-end trace. GPU activity alone cannot distinguish compute, memory, CPU input, transfers, network, or storage limits.",
      internGuide: ["Define the serving/training objective and capture an end-to-end trace. GPU activity alone cannot distinguish compute, memory, CPU input, transfers, network, or storage limits.","Use application latency/throughput with nvidia-smi for a quick view, DCGM for fleet metrics, and a profiler/timeline for kernels, gaps, and transfers.","Change the measured constraint: batch/precision/model for compute or memory, data workers/storage for starvation, and topology/collectives for communication.","Report quality, p50/p95 latency, throughput at concurrency, peak memory, power/cost, and failure rate. An optimization is a trade-off, not a free speedup."],
      si: 'ඔයා training අතරතුර GPU utilization 30%යි CPU utilization 95%යි දැක්කොත් data loading bottleneck එකක් ඇතිද බලන්න. GPU memory හිස්ව තියෙනවා නම් batch size වැඩි කිරීමෙන් throughput වැඩි වෙන්න පුළුවන්. Batch size වැඩි කළාම එක request එකට latency වැඩි වෙන්නත් පුළුවන්, ඒ නිසා p95 SLO එකත් මැනගන්න. Accuracy, latency, throughput, memory සහ cost අතර trade-off එක test කරලා තෝරන්න.',
      title: 'Finding GPU Bottlenecks with Monitoring & Profiling; Accuracy, Latency, Throughput, Memory & Cost Trade-offs',
      body: [
        'Tools: nvidia-smi (GPU-Util %, memory used, power, temperature, processes). nvidia-smi dmon හෝ watch -n 1 nvidia-smi දිගටම බලන්න. nvtop (terminal UI). DCGM (data center / cluster එකේ metrics, Prometheus exporter). PyTorch Profiler (code එකේ කොයි operation එකද කාලය කන්නේ). Nsight Systems (nsys profile python train.py): CPU, GPU, data loading, kernels timeline එකක. Nsight Compute (ncu): එක CUDA kernel එකක් ගැඹුරින්. GPU ops tools ගැන Phase 9.',
        'Bottleneck හොයන ක්‍රමය: (1) GPU-Util අඩුයි (උදා: 30%), CPU 100% → data loading / preprocessing bottleneck. DataLoader num_workers වැඩි කරන්න, pin_memory=True, data pre-tokenize කරන්න. (2) GPU memory ගොඩක් හිස්, util අඩුයි → batch size එක පොඩියි. Batch එක වැඩි කරන්න. (3) Util 100%, ඒත් slow → compute-bound. Mixed precision (BF16), FlashAttention, quantization, TensorRT-LLM. (4) Multi-GPU එකේ GPUs වාරෙන් වාරෙට idle → communication (NCCL) bottleneck. NVLink / EFA, gradient accumulation. (5) Inference එකේ decode phase එක memory-bandwidth-bound (Phase 14). Nsight Systems timeline එකේ GPU row එකේ හිස් තැන් = GPU බලාගෙන ඉන්න කාලය.',
        'Trade-offs පහ: Accuracy (quality), latency (එක request එකකට කාලය), throughput (තත්පරයකට tokens / requests), memory (GPU GB), cost (Rs. / USD). මේවා එකිනෙකට බැඳිලා. ලොකු model → accuracy ↑, latency ↑, memory ↑, cost ↑. Quantization (FP16 → INT4) → memory ↓ 4x, cost ↓, throughput ↑, accuracy ටිකක් ↓. Batch size වැඩි → throughput ↑, cost per token ↓, ඒත් එක user කෙනෙක්ගේ latency ↑. Long context → accuracy සමහර වෙලාවට ↑, ඒත් memory (KV cache) සහ latency ↑. Architect කෙනෙක්ගේ වැඩේ SLO එක (උදා: p95 < 2 s) තියාගෙන අඩුම cost එක හොයන එක.',
      ],
      analogy:
        'Kottu කඩේ chef (GPU) හැමදාම වැඩ කරන්නේ නෑ, බලාගෙන ඉන්නවා නම් එළවළු කපන කෙනා (CPU / data loader) හෙමින්. එක ලොකු තැටියකට orders 10ක් එකට දැම්මොත් (batch) කඩේට පැයකට වැඩි kottu, ඒත් පළවෙනි customer ටිකක් වැඩිපුර බලාගෙන ඉන්න වෙනවා (latency). Cheese kottu (ලොකු model) රසයි, ඒත් ගණන්.',
      example:
        'Fine-tune එකක් step එකකට 1.2 s. nvidia-smi: GPU-Util 35%, CPU core එකක් 100%. DataLoader num_workers = 0 (main thread එකේ tokenize). num_workers = 8 කරලා data කලින් tokenize කළා → GPU-Util 92%, step එකකට 0.45 s. Training කාලය පැය 6 සිට පැය 2.25 දක්වා අඩු වුණා. GPU පැයකට USD 1ක් නම් USD 3.75ක් ඉතුරුයි.',
      code: {
        lang: 'bash',
        src: `# 1. GPU එක බලන්න: util, memory, processes
nvidia-smi
# 2. තත්පරෙන් තත්පරේ util/memory බලන්න (Ctrl+C නවත්වන්න)
nvidia-smi dmon -s um
# 3. Timeline profile එකක් (CPU, GPU kernels, data loading)
nsys profile -o train_report --trace=cuda,nvtx,osrt python train.py
# 4. Report එක summary එකක් විදිහට බලන්න (Nsight Systems GUI එකෙනුත් open කරන්න පුළුවන්)
nsys stats train_report.nsys-rep`,
      },
      keyPoints: [
        'nvidia-smi / nvtop / DCGM = monitoring. PyTorch Profiler / Nsight Systems / Nsight Compute = profiling.',
        'GPU util අඩු + CPU ඉහළ = data bottleneck. Memory හිස් = batch පොඩියි.',
        'Quantization: memory ↓ cost ↓ throughput ↑, accuracy ටිකක් ↓.',
        'Batch ↑ = throughput ↑ ඒත් per-request latency ↑. SLO එක තියාගෙන cost අඩු කරන්න.',
      ],
      terms: [
        { en: 'GPU Utilization', si: 'කාලයෙන් කොච්චර ප්‍රතිශතයක් GPU එක kernels දුවනවද.' },
        { en: 'Nsight Systems', si: 'මුළු application එකේ CPU/GPU timeline එක පෙන්නන NVIDIA profiler එක.' },
        { en: 'Nsight Compute', si: 'තනි CUDA kernels ගැඹුරින් analyze කරන NVIDIA profiler එක.' },
        { en: 'Data Loading Bottleneck', si: 'GPU එකට data දෙන වේගය මදි නිසා GPU එක බලාගෙන ඉන්න තත්වය.' },
        { en: 'Throughput vs Latency', si: 'මුළු වැඩ ප්‍රමාණය vs එක request එකකට ගතවන කාලය.' },
      ],
    },
    // 19
    {
      id: 'troubleshooting-oom-slow-deps',
      plain: "For OOM, reproduce the peak and inspect weights, batch/sequence, activations or KV cache, fragmentation, and other processes. Reduce the right component or shard/offload deliberately.",
      internGuide: ["For OOM, reproduce the peak and inspect weights, batch/sequence, activations or KV cache, fragmentation, and other processes. Reduce the right component or shard/offload deliberately.","For slow inference, separate queue time, preprocessing, prefill, token decoding, transfers, and postprocessing; warm up and benchmark fixed prompts/concurrency.","For dependency errors, record driver, runtime, framework, GPU architecture, Python, and package versions. Check the official compatibility matrix instead of random reinstalling.","Make one change at a time, retain logs and a minimal reproduction, validate correctness after the fix, and pin the working environment."],
      si: 'ඔයාට 24 GB GPU එකක 7B model එක train කරද්දී OOM ආවොත් batch size 8 සිට 2ට අඩු කරලා accumulation steps 4 කරන්න. FP16/ BF16, gradient checkpointing හෝ 4-bit QLoRA මඟින් memory අඩු කරන්න පුළුවන්. Slow inference නම් model එක CUDA device එකේද, batching තියෙනවද, prompt එක දිග වැඩිද බලන්න. PyTorch, CUDA driver සහ wheel version එකත් ගැළපෙනවාද පරීක්ෂා කරන්න.',
      title: 'Troubleshooting: CUDA Out-of-Memory, Slow Inference & Incompatible Dependencies',
      body: [
        'CUDA out of memory (OOM) හේතු: batch size ලොකුයි, sequence length දිගයි (activations සහ KV cache), model එක precision එකට ලොකුයි (7B FP32 = 28 GB), inference කරද්දී torch.no_grad() නැති නිසා gradients graph එක save වෙනවා, loss එක .item() නැතුව list එකක එකතු කරන නිසා graph එක memory එකේ ඉතුරු වෙනවා, වෙන process එකක් (පරණ notebook kernel එකක්) GPU memory අල්ලගෙන. Fixes: batch size අඩු කරලා gradient accumulation (effective batch එක එහෙමමයි), gradient checkpointing, BF16 / FP16 mixed precision, QLoRA / quantization, max length අඩු කිරීම, nvidia-smi එකෙන් පරණ process kill කිරීම, fragmentation නම් PYTORCH_CUDA_ALLOC_CONF=expandable_segments:True. vLLM වගේ servers වල gpu_memory_utilization සහ max_model_len අඩු කරන්න. PyTorch OOM ගැන Phase 9 එකේ PyTorch Inference topic එකත් බලන්න.',
        'Slow inference හේතු: model එක ඇත්තටම CPU එකේ දුවනවා (model.to("cuda") අමතක වෙලා, device_map නැතුව), FP32 දුවනවා, requests එකින් එක (batching නෑ), Hugging Face generate() raw loop එකක් production වලට පාවිච්චි කරනවා, prompts ගොඩක් දිගයි (prefill), max_tokens ගොඩක් ලොකුයි, cold start (පළවෙනි request එකේ model load / compile). Fixes: GPU එකේද බලන්න, BF16 / FP8 / INT4, vLLM / TensorRT-LLM / NIM (continuous batching, paged KV cache), prompt caching, streaming, warm-up requests, speculative decoding (Phase 14).',
        'Incompatible dependencies: NVIDIA driver එක, CUDA toolkit එක, PyTorch build එක ගැළපෙන්න ඕනේ. nvidia-smi එකේ උඩ පෙන්නන "CUDA Version" කියන්නේ driver එකට support කරන්න පුළුවන් උපරිම CUDA version එක. pip එකෙන් ගන්න PyTorch wheels (cu121, cu124 වගේ) තමන්ගේම CUDA runtime එක එක්ක එනවා. ඒ නිසා driver එක ඒ CUDA version එකට support කරන තරම් අලුත් වෙන්න ඕනේ. torch.version.cuda සහ torch.cuda.is_available() check කරන්න. "False" නම් ගොඩක් වෙලාවට CPU-only wheel එකක් install වෙලා හෝ driver එක පරණයි.',
        'pip conflicts: Project එකකට එක virtual environment එකක් (venv / conda / uv, Phase 0 programming බලන්න). Versions pin කරන්න (requirements.txt / lock file). pip check එකෙන් conflicts හොයන්න. transformers, peft, trl, bitsandbytes, flash-attn එකිනෙකට version-sensitive. Release notes බලලා ගැළපෙන set එකක් තෝරන්න. හොඳම විසඳුම බොහෝ වෙලාවට NGC container එකක්: CUDA, cuDNN, PyTorch NVIDIA test කරලා එකට දාලා තියෙන්නේ.',
      ],
      analogy:
        'OOM = tuk-tuk එකකට 8 දෙනෙක් දාන්න හදනවා වගේ. විසඳුම: වාර දෙකකට යන්න (gradient accumulation), නැත්නම් පොඩි bags (quantization). Dependencies අවුල = Japan car එකකට Indian spare part එකක් දාන්න හදනවා වගේ. Model number එක ගැළපෙන්නම ඕනේ. NGC container එක = agent ගෙන් ගන්න genuine parts kit එක.',
      example:
        'Error: "CUDA out of memory. Tried to allocate 2.00 GiB". Setup: 7B model, LoRA, batch 8, max length 4096, 24 GB GPU. Fix 1: batch 8 → 2 + gradient_accumulation_steps 4 (effective batch 8 එහෙමමයි). Fix 2: gradient_checkpointing=True. Fix 3: 4-bit QLoRA (weights 14 GB → ≈ 3.5-4 GB). දැන් memory 15 GB විතරයි, training යනවා. Dependency උදාහරණය: torch.cuda.is_available() False, nvidia-smi පෙන්නනවා CUDA 11.8. Install කළේ cu124 wheel එක → driver එක update කරන්න හෝ ගැළපෙන wheel එකක් install කරන්න.',
      code: {
        lang: 'python',
        src: `import torch, sys

print("python:", sys.version.split()[0])
print("torch:", torch.__version__, "| built for CUDA:", torch.version.cuda)  # None = CPU-only wheel
print("cuda available:", torch.cuda.is_available())     # False නම් driver / wheel අවුලක්
if torch.cuda.is_available():
    print("gpu:", torch.cuda.get_device_name(0))
    free, total = torch.cuda.mem_get_info()              # GPU memory (bytes)
    print(f"free {free/2**30:.1f} GB / total {total/2**30:.1f} GB")
    print("bf16 ok:", torch.cuda.is_bf16_supported())    # T4 නම් False → FP16

# OOM අඩු කරන inference පුරුද්ද:
# with torch.no_grad(): out = model(**inputs)      # gradients save නොකරන්න`,
      },
      keyPoints: [
        'OOM: batch ↓ + grad accumulation, checkpointing, BF16, QLoRA, max length ↓, පරණ processes kill.',
        'Slow inference: ඇත්තටම GPU එකේද? Precision, batching, serving engine, prompt length, cold start.',
        'nvidia-smi "CUDA Version" = driver එකට support උපරිමය. PyTorch wheel එකේ CUDA එක ඊට අඩු හෝ සමාන වෙන්න ඕනේ.',
        'Project එකකට venv එකක්, versions pin, pip check, නැත්නම් NGC container.',
      ],
      terms: [
        { en: 'CUDA Out of Memory (OOM)', si: 'GPU memory එකට ගැළපෙන්නේ නැති තරම් memory ඉල්ලුවම එන error එක.' },
        { en: 'Gradient Checkpointing', si: 'Activations save නොකර backward එකේදී ආයෙත් ගණනය කරලා memory ඉතුරු කිරීම.' },
        { en: 'CUDA Toolkit vs Driver', si: 'Driver = GPU එකට කතා කරන system software එක. Toolkit = CUDA code build / run කරන libraries.' },
        { en: 'pip check', si: 'Install කරපු packages අතර version conflicts තියෙනවද පෙන්නන command එක.' },
        { en: 'Cold Start', si: 'Server එක පටන් ගත්තම පළවෙනි requests slow වෙන්නේ model load / compile නිසා.' },
      ],
    },
    // 20
    {
      id: 'aws-practice-checklist',
      plain: "Choose a small AWS lab tied to a learning objective: a managed SageMaker endpoint or an EKS GPU service, not an unnecessarily large always-on cluster.",
      internGuide: ["Choose a small AWS lab tied to a learning objective: a managed SageMaker endpoint or an EKS GPU service, not an unnecessarily large always-on cluster.","Verify Region availability, quota, GPU/instance specification, AMI/driver/runtime compatibility, storage, networking, registry/license access, and estimated hourly plus data cost.","Deploy NIM/Triton or another supported server with private access, workload identity, secrets, health checks, logs/metrics, and a representative benchmark. Add EFA only for supported multi-node needs.","Set budgets and tags, capture infrastructure/configuration, test shutdown and recovery, and delete endpoints, nodes, volumes, load balancers, and unused IPs when the lab ends."],
      si: 'ඔයා AWS lab එකක NIM හෝ Triton deploy කරනකොට මුලින් GPU instance එක, IAM permissions සහ network access පරීක්ෂා කරන්න. EKS GPU node එකකට model එක දාලා health endpoint එකෙන් service එක ready ද බලන්න. RAG agent එකට tool permission අවශ්‍ය තරමට සීමා කරලා guardrail සහ logs ප 테스트 කරන්න. Lab-යේ AWS resource usage-යත් cost එකත් дуусгත් පසු ресурස් cleanup කරන්න.',
      title: 'Practising NVIDIA Topics on AWS: NIM / Triton on SageMaker or EKS, GPU Instances, EFA, Guardrails, RAG Agent',
      body: [
        'ඔයා AWS-focused නිසා NVIDIA topics AWS එකේම practice කරන්න පුළුවන්. මේ services ගැඹුරින් Phase 18 සහ Phase 19 වල උගන්වනවා. මෙතන තියෙන්නේ කෙටි hands-on checklist එකක් විතරයි. වැඩේ ඉවර වුණාම GPU instances / endpoints delete කරන්න, නැත්නම් bill එක ලොකු වෙනවා. AWS Budgets alert එකක් කලින්ම දාන්න.',
        '(1) NVIDIA NIM microservice එකක් හෝ Triton Inference Server එකක් SageMaker AI endpoint එකක හෝ EKS cluster එකක deploy කරන්න. curl / Python එකෙන් test කරන්න. (2) GPU instance families තෝරන්න පුරුදු වෙන්න: G5 (NVIDIA A10G, 24 GB), G6 (NVIDIA L4, 24 GB) → පොඩි / මධ්‍යම inference සහ පොඩි fine-tunes. P4d (A100 40 GB × 8) සහ P5 (H100 80 GB × 8) → ලොකු training සහ ලොකු models. Memory, cost, inference ද training ද කියන එක අනුව තෝරන්න. (Instance specs සහ මිල ගණන් region එක අනුව වෙනස්, AWS page එකේ verify කරන්න.)',
        '(3) Elastic Fabric Adapter (EFA): EC2 instances අතර ඉතා අඩු latency, ඉහළ bandwidth network interface එකක්. OS එක මඟහැරලා (OS bypass) කෙළින්ම communicate කරනවා. Multi-node training වලදී NCCL all-reduce එක (GPUs අතර gradients එකතු කිරීම) වේගවත් කරනවා. P4d / P5 වල තියෙනවා. (4) NeMo Guardrails vs Amazon Bedrock Guardrails සසඳන්න: NeMo Guardrails open-source, self-host, Colang එකෙන් programmable dialog / topical / retrieval / execution rails (Phase 10). Bedrock Guardrails managed service එකක්: content filters, denied topics, word filters, sensitive information (PII) filters, contextual grounding checks. (5) Tools එක්ක RAG agent එකක් හදන්න: NVIDIA NIM endpoints හෝ Bedrock models පාවිච්චි කරලා, retrieval tool එකක් සහ API tool එකක් එක්ක (Phase 12, 13).',
      ],
      analogy:
        'Driving school එකේ ඉගෙනගත්ත දේ ඔයාගේම පාරේ, ඔයාගේම වාහනයෙන් practice කරනවා වගේ. AWS කියන්නේ ඔයා දැනටමත් හොඳට දන්න පාර. NVIDIA tools කියන්නේ අලුත් වාහනය. අලුත් වාහනය හුරු පාරේ පදවනකොට ඉක්මනට ඉගෙන ගන්නවා.',
      example:
        'සති අන්ත lab එකක්: සෙනසුරාදා උදේ g6.xlarge (L4 24 GB) instance එකක EKS node group එකක් හදලා Llama 3.1 8B NIM එක deploy කරනවා. Python script එකෙන් requests 50ක් යවලා p50 / p95 latency ලියනවා. හවස NeMo Guardrails topical rail එකක් දාලා, Bedrock Guardrails denied topic එකක් එක්ක හැසිරීම සසඳනවා. රෑ ඔක්කොම delete කරනවා. ප්‍රතිඵල ADR එකක ලියනවා.',
      keyPoints: [
        'NIM / Triton → SageMaker AI endpoint හෝ EKS. curl / Python test.',
        'G5 (A10G) / G6 (L4) = inference + පොඩි fine-tune. P4d (A100) / P5 (H100) = ලොකු training.',
        'EFA = multi-node NCCL communication වේගවත් කරන low-latency network එක.',
        'NeMo Guardrails (open-source, programmable) vs Bedrock Guardrails (managed). වැඩේ ඉවර වුණාම resources delete!',
      ],
      terms: [
        { en: 'SageMaker AI Endpoint', si: 'AWS එකේ managed model serving endpoint එක.' },
        { en: 'EKS GPU Node Group', si: 'Kubernetes cluster එකේ GPU instances තියෙන nodes කණ්ඩායම.' },
        { en: 'Elastic Fabric Adapter (EFA)', si: 'Multi-node training වලට OS-bypass, low-latency AWS network interface එක.' },
        { en: 'Amazon Bedrock Guardrails', si: 'Content filters, denied topics, PII filters, grounding checks දෙන managed AWS safety service එක.' },
      ],
    },
  ],
  englishQuizTitle: 'Original English Practice Questions Mapped to the Five Domains',
  englishQuizNote: 'These questions are original study exercises, not official NVIDIA exam questions. They are mapped to the published domains and do not claim to reproduce the exam format or weighting.',
  englishQuiz: [
    {
      q: 'A team is building a chatbot over frequently updated internal policy documents. Which approach best provides current document context without retraining the language model after every update?',
      options: [
        'Fine-tune the language model on every user question',
        'Index document chunks with embeddings and retrieve relevant chunks at query time',
        'Increase the model temperature',
        'Store the documents only in the system prompt permanently',
      ],
      answer: 1,
      why: 'RAG retrieves current indexed content at query time. Update the index when documents change; retrieval and citations still need evaluation.',
    },
    {
      q: 'A regression model scores R² = -0.2 on a held-out test set. What is the correct interpretation?',
      options: [
        'The model is 20% accurate',
        'The model has zero prediction error',
        'On this test set, its squared error is worse than predicting the test-set mean for every row',
        'The training and test sets must have identical means',
      ],
      answer: 2,
      why: 'R² compares the model with the mean-prediction baseline on the evaluated set. A negative score means the model is worse than that baseline.',
    },
    {
      q: 'You want to compare two LLM application versions. Which experiment design gives the fairest comparison?',
      options: [
        'Evaluate each version on different questions selected after seeing its answers',
        'Use the same representative test cases, rubric, settings, and evaluation procedure for both versions',
        'Compare only the most impressive answer from each version',
        'Change the prompt and model at the same time, then attribute any change to the model',
      ],
      answer: 1,
      why: 'Keep evaluation conditions consistent and choose the test set and rubric before reviewing results. This reduces confounding and selection bias.',
    },
    {
      q: 'An LLM service has rising p95 latency and a growing request queue, while average latency looks stable. What should the team do first?',
      options: [
        'Ignore p95 because the average is stable',
        'Inspect tail latency, queueing, throughput, and resource metrics to locate the bottleneck',
        'Increase temperature to make responses faster',
        'Delete the latency measurements and restart monitoring',
      ],
      answer: 1,
      why: 'Tail latency and queue growth can reveal reliability and capacity problems hidden by averages. Correlate service, model, and hardware metrics.',
    },
    {
      q: 'A dataset was collected from customers for support. The team wants to use the conversations for model training. What is the best first step?',
      options: [
        'Use the data because it is already stored securely',
        'Check the permitted purpose and consent, then minimize and protect data according to policy',
        'Remove names and assume all privacy obligations are satisfied',
        'Publish the raw data so reviewers can check it',
      ],
      answer: 1,
      why: 'Security/privacy controls do not by themselves establish consent or permitted purpose. Check those requirements before reuse and minimize sensitive data.',
    },
    {
      q: 'A text dataset contains company names, locations, and dates that must be extracted before analysis. Which Python tool is the most suitable starting point?',
      options: [
        'spaCy named-entity recognition',
        'NumPy matrix multiplication',
        'Keras model.fit without labels or a task definition',
        'A vector database used as a text parser',
      ],
      answer: 0,
      why: 'spaCy provides NLP pipelines including named-entity recognition. NumPy handles numerical arrays; vector databases store and retrieve vectors.',
    },
  ],
  quiz: [
    {
      q: 'Which certification order best fits an AWS tech lead moving toward an architect role?',
      options: [
        'NCA-GENL → NCP-AAI → (optional) NCA-AIIO',
        'NCP-GENL → NCA-GENL → NCP-AII',
        'NCA-ADS → NCP-ADS',
        'Start directly with NCP-AIO',
      ],
      answer: 0,
      why: 'NCA-GENL provides the foundation, and NCP-AAI is the more architecture-focused exam for application builders. NCA-AIIO is optional if GPU infrastructure sizing is part of the role. NCP-GENL may fit an ML engineering role more closely.',
    },
    {
      q: 'Which domain has the highest weight on the NCA-GENL exam?',
      options: ['Software development (24%)', 'Experimentation (22%)', 'Core machine learning and AI knowledge (30%)', 'Trustworthy AI (10%)'],
      answer: 2,
      why: 'Core ML and AI Knowledge is 30% (about 15–18 questions). It is followed by Software Development at 24%, Experimentation at 22%, Data Analysis at 14%, and Trustworthy AI at 10%.',
    },
    {
      q: 'What does R² = 0 mean for a model?',
      options: [
        'The model is perfect',
        'The model is no better than always predicting the mean',
        'The model has zero loss',
        'The model is a classification model',
      ],
      answer: 1,
      why: 'R² compares the model with the mean-prediction baseline. A score of 0 matches that baseline, 1 is perfect, and a negative score is worse than the baseline.',
    },
    {
      q: 'Why are pairwise comparisons (A vs B) often used instead of 1–10 ratings when collecting human feedback for RLHF?',
      options: [
        'Only because pairwise comparisons are easier to code',
        'Annotators may use rating scales differently but can agree more consistently on which answer is better',
        'Because pairwise comparisons do not require annotators',
        'Because a reward model cannot use ratings',
      ],
      answer: 1,
      why: 'Absolute scores can vary between people (one annotator may give 7, another 5), while relative comparisons can be more consistent. A reward model such as Bradley–Terry can also be trained from chosen/rejected pairs.',
    },
    {
      q: 'A developer committed an API key to a public GitHub repository. What is the most important first step?',
      options: [
        'Only delete the commit and make the repository private',
        'Add a warning to the README',
        'Do nothing; nobody will see it',
        'Revoke or rotate the key immediately',
      ],
      answer: 3,
      why: 'Bots scan public repositories within minutes. Even if the key is removed from history, it may already have been copied. Rotation is the effective fix; then use a secrets manager and secret scanning.',
    },
    {
      q: 'During training, nvidia-smi shows GPU utilization at 30% and one CPU core at 100%. What is the most likely bottleneck?',
      options: [
        'The GPU is very slow',
        'A CPU data-loading or preprocessing bottleneck',
        'The model has too few parameters',
        'The learning rate is too high',
      ],
      answer: 1,
      why: 'The GPU may be waiting for input data. Check DataLoader workers, pinned memory, and whether data can be tokenized in advance. Nsight Systems can reveal gaps in the GPU timeline.',
    },
    {
      q: 'torch.cuda.is_available() returns False, but nvidia-smi lists a GPU. What is the most likely cause?',
      options: [
        'A CPU-only PyTorch wheel is installed, or the driver is too old for the CUDA version used to build PyTorch',
        'The GPU is broken',
        'The Python version is too new',
        'The model has not been downloaded',
      ],
      answer: 0,
      why: 'If nvidia-smi works, the GPU and driver are present. torch.version.cuda being None indicates a CPU-only wheel; otherwise, the driver may not support the wheel’s CUDA version. Use a compatible wheel or an NGC container.',
    },
    {
      q: 'You need to summarize 1 million documents overnight, and no user is waiting. What is the best inference pattern?',
      options: [
        'Online real-time endpoint, batch size 1',
        'Wait for a user to request each document',
        'Offline or batch inference with larger batches, optimized for throughput and cost',
        'Process them one at a time on a laptop CPU',
      ],
      answer: 2,
      why: 'Batch inference suits large jobs where latency is not critical; use larger batches and consider options such as spot instances or SageMaker Batch Transform. Online inference is for user requests with a latency SLO.',
    },
    {
      q: 'You have 10,000 documents and need to extract company names, places, and dates. Which Python tool from the NCA-GENL study guide is the best choice?',
      options: ['NumPy', 'Keras', 'spaCy (NER)', 'Matplotlib'],
      answer: 2,
      why: 'spaCy includes named-entity recognition (NER) for entities such as organizations, places, and dates. NumPy is for numerical work, Keras for neural networks, and Matplotlib for charts.',
    },
    {
      q: 'What is the best way to release a new fine-tuned model version to production?',
      options: [
        'Delete the old version and immediately send 100% of traffic to the new one',
        'Pass a regression evaluation suite, release to a small canary share of traffic, monitor metrics, and roll back if needed',
        'Ask users to test it themselves',
        'Use the hosted API’s "latest" alias',
      ],
      answer: 1,
      why: 'Use an evaluation gate, a canary/shadow/blue-green release, monitoring, and a quick rollback path. Keep the prior version ready for rollback. A "latest" alias is risky because it does not pin a version.',
    },
  ],
}
