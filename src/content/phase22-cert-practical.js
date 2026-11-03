export default {
  id: 'cert-practical',
  number: 22,
  title: 'Certification Guide & Hands-On Practitioner Skills',
  titleSi: 'NVIDIA Certification මඟපෙන්වීම සහ ඇත්ත වැඩ කරන්න ඕනේ Practical Skills',
  summary:
    'මේ phase එක ඔයාගේ exam සිතියම සහ "අත් දෙකෙන් කරන" වැඩ ටිකයි. NVIDIA certifications මොනවද, ඔයා යන්න ඕනේ පාර (NCA-GENL → NCP-AAI), NCA-GENL exam එකේ domains, study plan එක, සහ කලින් phases වල ගැඹුරින් නොකියපු study-guide කොටස් (Python tools, data analysis, RLHF feedback, security, lifecycle) මෙතන තියෙනවා. අන්තිමට fine-tune, deploy, RAG eval, GPU profiling සහ troubleshooting පියවරෙන් පියවර කරලා බලනවා.',
  duration: 'සති 2-3 (exam එකට කලින් revision එකත් එක්ක)',
  topics: [
    // 1
    {
      id: 'nvidia-cert-map',
      title: 'NVIDIA Certification Map: Codes, Levels, Time, Prices, Certiverse & 2-Year Validity',
      body: [
        'NVIDIA එකේ එකම එක "AI certification" එකක් නෑ. Role එකට (developer, infrastructure, data science) සහ level එකට අනුව වෙන වෙනම exams තියෙනවා. Code එකේ මුල බලලා level එක අඳුනගන්න පුළුවන්. NCA කියන්නේ NVIDIA-Certified Associate (entry level). NCP කියන්නේ NVIDIA-Certified Professional (අත්දැකීම් තියෙන අයට).',
        'Associate exams පහක් තියෙනවා. හැම එකම පැය 1යි, USD 125යි. NCA-GENL (Generative AI LLMs), NCA-GENM (Generative AI Multimodal), NCA-AIIO (AI Infrastructure and Operations), NCA-ADS (Accelerated Data Science), NCA-AMAD (AI Models and Application Development). NCA-AMAD ගැන අපේ study docs වල තියෙන්නේ නම, code එක, level එක, කාලය සහ මිල විතරයි. ඒකේ domains දැනගන්න ඕනේ නම් NVIDIA page එකම බලන්න.',
        'Professional exams අටක් තියෙනවා. හැම එකම පැය 2යි. NCP-GENL (Generative AI LLMs), NCP-AAI (Agentic AI), NCP-ADS (Accelerated Data Science), NCP-OUSD (OpenUSD Development) කියන ඒවා USD 200 බැගින්. NCP-AII (AI Infrastructure), NCP-AIN (AI Networking), NCP-ARI (AI Rack and Interconnect) USD 400 බැගින්. NCP-AIO (AI Operations) USD 500යි.',
        'NVIDIA වෙලාවෙන් වෙලාවට මිල, ප්‍රශ්න ගණන සහ domains වෙනස් කරනවා. ඒ නිසා book කරන්න කලින් nvidia.com/en-us/learn/certification එකේ verify කරන්න. Exams ඔක්කොම English වලින්. ගෙදර ඉඳන් online කරන්නේ Certiverse platform එක හරහා. Remote proctor කෙනෙක් webcam එකෙන් ඔයාව බලාගෙන ඉන්නවා. Certificate එක අවුරුදු 2ක් valid. Recertify කරන්න ආයෙත් exam එක ලියන්න ඕනේ.',
      ],
      analogy:
        'Driving license එක හිතන්න. Motorcycle, light vehicle, heavy vehicle කියලා categories තියෙනවා. Light vehicle එක (Associate) ගන්න ලේසියි. Heavy vehicle එකට (Professional) අත්දැකීම් ඕනේ. License එකට expiry date එකක් තියෙනවා වගේම NVIDIA certificate එකත් අවුරුදු 2කින් renew කරන්න ඕනේ.',
      example:
        'ඔයාගේ සැලැස්මේ වියදම: NCA-GENL USD 125 + NCP-AAI USD 200 = USD 325. Optional NCA-AIIO USD 125 එකතු කළොත් USD 450. උදාහරණයක් විදිහට USD 1 ≈ Rs. 300 කියලා ගත්තොත් USD 325 ≈ Rs. 97,500යි. අවුරුදු 2කට පස්සේ recertify කරද්දී ආයෙත් exam fee එක ගෙවන්න වෙනවා. (මිල සහ exchange rate දෙකම book කරන දවසේ verify කරන්න.)',
      keyPoints: [
        'NCA = Associate (පැය 1, USD 125). NCP = Professional (පැය 2, USD 200-500).',
        'Exams online, English, Certiverse හරහා remote proctoring.',
        'Validity අවුරුදු 2යි. Recertify = exam එක ආයෙත් ලියන එක.',
        'මිල සහ විස්තර වෙනස් විය හැකියි. Book කරන්න කලින් NVIDIA certification පිටුවෙන් verify කරන්න.',
      ],
      terms: [
        { en: 'Associate (NCA)', si: 'Entry level certification. මූලික සංකල්ප තේරුම් ගැනීම පරීක්ෂා කරනවා.' },
        { en: 'Professional (NCP)', si: 'ඉහළ level එක. Production අත්දැකීම් සහ ගැඹුරු දැනුම බලාපොරොත්තු වෙනවා.' },
        { en: 'Certiverse', si: 'NVIDIA exams online විකුණලා, remote proctoring එක්ක පවත්වන platform එක.' },
        { en: 'Remote Proctoring', si: 'Exam එක කරද්දී webcam එකෙන් කෙනෙක් ඔයාව නිරීක්ෂණය කරන එක.' },
        { en: 'Recertification', si: 'අවුරුදු 2න් certificate එක අලුත් කරගන්න exam එක ආයෙත් ලියන එක.' },
        { en: 'NCA-AMAD', si: 'AI Models and Application Development Associate. පැය 1, USD 125. Domains සඳහා NVIDIA page එක බලන්න.' },
      ],
    },
    // 2
    {
      id: 'cert-path-choice',
      title: 'Which Path? Developer, Infrastructure, Data Science, and Your NCA-GENL → NCP-AAI Route',
      body: [
        'පටන් ගන්න exam එක role එක අනුව තෝරන්න. AI / LLM / developer පාර: NCA-GENL එකෙන් පටන් අරන්, පස්සේ NCP-GENL හෝ NCP-AAI. Infrastructure / data center / DevOps පාර: NCA-AIIO එකෙන් පටන් අරන්, පස්සේ NCP-AII හෝ NCP-AIO. Data science පාර: NCA-ADS එකෙන් පටන් අරන්, පස්සේ NCP-ADS.',
        'ඔයා AWS-focused full-stack tech lead කෙනෙක්, architecture පැත්තට යනවා. ඒ නිසා ඔයාගේ පාර: (1) NCA-GENL (USD 125, පැය 1): LLM, RAG, prompting මූලික දේවල්. Professional exams දෙකටම අඩිතාලම. (2) NCP-AAI (USD 200, පැය 2): ප්‍රධාන ඉලක්කය. Application builders ලාට තියෙන වැඩියෙන්ම architecture-focused NVIDIA exam එක. ඒකෙන් භාගයක් විතර agent architecture & design, deployment & scaling, evaluation ගැන. Production වල දුවන agentic systems එක්ක hands-on අත්දැකීම් බලාපොරොත්තු වෙනවා. (3) Optional NCA-AIIO (USD 125): GPU instances, EKS GPU clusters, on-prem vs cloud වගේ GPU infrastructure sizing තීරණ ඔයාගේ architect role එකට එනවා නම්.',
        'NCP-GENL ඇයි ඔයාට දෙවෙනි තැනට? ඒක model optimization, fine-tuning, multi-GPU parallelism වලට බර වැඩියි. ඒක ML engineer කෙනෙක්ගේ දවසේ වැඩට කිට්ටුයි. NCP-GENL domains සහ මේ site එකේ ඒවා උගන්වන තැන්: Model optimization 17% (Phase 9, 14), GPU acceleration & optimization 14% (Phase 9, 15, 8), Prompt engineering 13% (Phase 6, 12), Fine-tuning 13% (Phase 5, 15), Data preparation 9% (Phase 15, 14), Model deployment 9% (Phase 7, 9), Evaluation 7% (Phase 11), Production monitoring & reliability 7% (Phase 7), LLM architecture 6% (Phase 5, 16), Safety, ethics & compliance 5% (Phase 10). අපේ doc එකට අනුව NVIDIA page එකේ Fine-tuning domain description එක වැරදියට OpenUSD ගැන කියනවා. ඒ නිසා ඒ topics prerequisites වලින් ගත්තේ.',
        'NCP-AAI: ප්‍රශ්න 60-70, මිනිත්තු 120. NVIDIA recommend කරන්නේ AI/ML roles වල අවුරුදු 1-2ක් සහ production ගිය agentic projects. Domains: Agent architecture & design 15%, Agent development 15%, Evaluation & tuning 13%, Deployment & scaling 13%, Cognition, planning & memory 10%, Knowledge integration & data handling 10%, NVIDIA platform implementation 7%, Run, monitor & maintain 5%, Safety, ethics & compliance 5%, Human-AI interaction & oversight 5% (එකතුව 98%යි, NVIDIA දීලා තියෙන විදිහටම). Agents ගැන Phase 12 බලන්න, RAG ගැන Phase 13. Optional DLI courses: Building RAG Agents With LLMs, Evaluating RAG and Semantic Search Systems, Building Agentic AI Applications With LLMs, Introduction to Deploying RAG Pipelines for Production at Scale.',
      ],
      analogy:
        'A/L වලදී stream එක තෝරනවා වගේ. Maths stream එකෙන් engineering යනවා, Bio stream එකෙන් medicine යනවා. ඔයා මුලින්ම "LLM stream" එක (NCA-GENL) තෝරලා, පස්සේ "architect degree" එක (NCP-AAI) කරනවා. NCP-GENL කියන්නේ ඒ stream එකේම "research engineer" degree එක වගේ. හොඳයි, ඒත් ඔයාගේ job එකට කෙළින්ම ගැළපෙන්නේ නෑ.',
      example:
        'Client කෙනෙක් අහනවා: "අපේ support agent එක Bedrock එකේද, EKS එකේ NIM එක්කද දුවන්න ඕනේ?" Agent design, tool calling, evaluation, scaling ගැන උත්තරය NCP-AAI එකෙන් එනවා. "EKS cluster එකට G6 ද P5 ද? On-prem DGX එකක් ගන්නද?" කියන කොටසට NCA-AIIO දැනුම උදව් වෙනවා. "LoRA rank එක 16ද 64ද, tensor parallelism 2ද 4ද?" කියන ප්‍රශ්න NCP-GENL එකේ ලෝකය.',
      keyPoints: [
        'Developer → NCA-GENL. Infrastructure → NCA-AIIO. Data science → NCA-ADS.',
        'ඔයාගේ පාර: NCA-GENL → NCP-AAI → (optional) NCA-AIIO.',
        'NCP-GENL = optimization, fine-tuning, multi-GPU. ML engineer role එකට වඩා ගැළපෙනවා.',
        'NCP-AAI = ප්‍රශ්න 60-70, මිනිත්තු 120, agent architecture / deployment / evaluation බර වැඩියි.',
      ],
      terms: [
        { en: 'NCP-AAI', si: 'Agentic AI Professional. Agents design කරලා production එකේ දුවන එක ගැන.' },
        { en: 'NCP-GENL', si: 'Generative AI LLMs Professional. ප්‍රශ්න 60-70, මිනිත්තු 120, LLM අත්දැකීම් අවුරුදු 2-3ක් recommend කරනවා.' },
        { en: 'NCA-AIIO', si: 'AI Infrastructure and Operations Associate. ප්‍රශ්න 50, මිනිත්තු 60. GPU hardware, networking, Kubernetes/Slurm, nvidia-smi/DCGM, MIG/vGPU.' },
        { en: 'DLI (Deep Learning Institute)', si: 'NVIDIA එකේ courses දෙන අංශය. Exams වලට recommend කරන courses මෙතනින්.' },
      ],
    },
    // 3
    {
      id: 'nca-genl-exam-guide',
      title: 'NCA-GENL Exam Guide: Format, Five Domains, Weights & What Each Really Tests',
      body: [
        'NCA-GENL format එක: මිනිත්තු 60යි. NVIDIA page එකේ exam details කොටස multiple-choice ප්‍රශ්න 50-60ක් කියනවා, නමුත් එහි overview එක 50 ප්‍රශ්න කියලා දක්වනවා; ඒ නිසා නිශ්චිත ගණන booking වෙලාවේ confirm කරන්න. මිල USD 125, online, Certiverse හරහා, English. Prerequisite එක generative AI සහ LLMs ගැන මූලික අවබෝධයක් විතරයි. Passing score එක publish කරලා නෑ. මේ විස්තර වෙනස් විය හැකි නිසා exam එක book කරන්න කලින් NVIDIA certification පිටුවෙන් verify කරන්න.',
        'Domains පහ: Core machine learning & AI knowledge 30% (ප්‍රශ්න 15-18 විතර), Software development 24% (12-14), Experimentation 22% (11-13), Data analysis 14% (7-8), Trustworthy AI 10% (5-6). ප්‍රශ්න ගණන් NVIDIA publish කරලා නෑ. ඒවා ප්‍රශ්න 50-60 මත හදපු ඇස්තමේන්තු විතරයි.',
        'Domain එකෙන් ඇත්තටම බලන්නේ මොනවද? Core ML (30%): supervised / unsupervised, overfitting, activations, optimizers, Transformer, attention, tokenization, embeddings, prompting, RAG, vector DBs, Python NLP tools. මේවා Phase 2, 3, 4, 5, 6, 13, 14, 16, 17 වල තියෙනවා. Software development (24%): NeMo, NIM, Triton, TensorRT-LLM, ONNX, NGC, quantization, batching, KV cache, LoRA, RLHF/DPO. Phase 9, 14, 15, 7 බලන්න. Experimentation (22%): data preparation, training settings, mixed precision, experiment tracking, perplexity / BLEU / ROUGE, benchmarks, LLM-as-a-judge. Phase 15 සහ 11.',
        'Data analysis (14%): classification metrics, regression metrics (R² ඇතුළුව), loss curves, EDA, correlation vs causation, charts, RAPIDS. Phase 1, 2, 17, 0 සහ මේ phase එකේ data analysis topic එක. Trustworthy AI (10%): ethical principles, privacy සහ consent, trustworthiness වැඩි කරන tools/techniques, bias අඩු කිරීම. Phase 10 බලන්න. NVIDIA detailed blueprint එක ප්‍රශ්න scenario-based කියලා හෝ ඒවායේ format එක නිශ්චිතව කියන්නේ නෑ. මේ site එකේ scenario questions යොදාගන්නේ concepts apply කරන්න practice එකක් විදිහට මිස exam format එක ගැන guarantee එකක් විදිහට නෙවෙයි.',
        'NVIDIA companion overview එකේ "alignment" කියන මාතෘකාව සඳහන් වෙනවා. නමුත් detailed weighted domain list එකේ ඒක වෙනම objective එකක් හෝ වෙනම weight එකක් ලෙස නම් කරලා නැහැ. RLHF/DPO වගේ alignment concepts Experimentation සහ model customization පාඩම් එක්ක revision කරන්න; වෙනම exam domain එකක් කියලා හිතන්න එපා.',
      ],
      analogy:
        'A/L paper එකක marking scheme එක වගේ. Part A එකට ලකුණු 30%ක් නම්, ඔයා revision කාලයෙනුත් 30%ක් විතර ඒකට දෙනවා. Trustworthy AI 10% විතරයි කියලා අතඅරින්නත් එපා. ඒ ප්‍රශ්න 5-6 ලේසියෙන්ම ගන්න පුළුවන් ලකුණු.',
      example:
        'ඔයාට study පැය 40ක් තියෙනවා කියමු. Weight එකට අනුව බෙදුවොත්: Core ML 40 × 0.30 = පැය 12. Software development 40 × 0.24 ≈ පැය 9.6. Experimentation 40 × 0.22 ≈ පැය 8.8. Data analysis 40 × 0.14 ≈ පැය 5.6. Trustworthy AI 40 × 0.10 = පැය 4. Maths වලට බය නම් Core ML සහ Data analysis වලට පැය 2-3ක් extra දාන්න.',
      keyPoints: [
        'NVIDIA exam details 50-60 multiple-choice ප්‍රශ්න කියනවා; page overview එක 50 කියන නිසා නිශ්චිත ගණන booking වෙලාවේ verify කරන්න. කාලය මිනිත්තු 60යි; passing score publish කරලා නෑ.',
        'Core ML 30% > Software dev 24% > Experimentation 22% > Data analysis 14% > Trustworthy AI 10%.',
        'ප්‍රශ්න ගණන් (15-18, 12-14, 11-13, 7-8, 5-6) ඇස්තමේන්තු විතරයි.',
        'Scenario-style questions වලින් මෙතන concepts apply කරලා practice කරනවා; NVIDIA exam එකේ ප්‍රශ්න format එක ගැන guarantee එකක් නෑ.',
        'Alignment companion overview එකේ සඳහන් වුණත් detailed blueprint එකේ වෙනම weight කළ domain එකක් නෙවෙයි.',
      ],
      terms: [
        { en: 'Exam Domain', si: 'Exam එකේ කොටසක්. Weight එකෙන් කියන්නේ ප්‍රශ්න වලින් කොච්චර ප්‍රතිශතයක් ඒකෙන්ද කියලා.' },
        { en: 'Weight', si: 'Domain එකකට exam එකේ තියෙන කොටස (%).' },
        { en: 'Scenario Question', si: 'කතාවක් / තත්වයක් දීලා හොඳම tool එක හෝ ක්‍රමය තෝරන්න කියන පුහුණු ප්‍රශ්න ආකාරයක්. NVIDIA exam එකේ මේවායේ ප්‍රතිශතයක් හෝ format එකක් නිලව සඳහන් කරලා නෑ.' },
      ],
      resources: [
        { title: 'NVIDIA NCA-GENL official exam page', url: 'https://www.nvidia.com/en-us/learn/certification/generative-ai-llm-associate/', description: 'විභාග domains, weight සහ යාවත්කාලීන exam තොරතුරු.' },
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
      title: 'Your 4-Week NCA-GENL Plan, Official DLI Courses, Reading List & Exam-Day Tips',
      body: [
        'Study guide එකේ සැලැස්ම experienced full-stack developer කෙනෙකුට සති 4යි. ඔයාට maths අමාරු නිසා, හැම සතියකටම "buffer" දවස් 2-3ක් තියාගන්න. අවශ්‍ය නම් සති 6කට දික් කරන්න. Week 1: ML / DL fundamentals, Transformers, tokenization, embeddings (Phase 17, 3, 5, 16, 14). Hands-on: Fundamentals of Deep Learning notebooks, Attention සහ BERT papers කියවන්න. Week 2: prompt engineering, RAG, vector DBs, spaCy (Phase 6, 12, 13, 4). Hands-on: Rapid Application Development with LLMs course එක, build.nvidia.com NIM endpoint එකක් සහ Milvus හෝ pgvector එක්ක RAG chatbot එකක්.',
        'Week 3: customization (LoRA, PEFT, RLHF), inference optimization, NVIDIA tools, experimentation, metrics (Phase 15, 9, 14, 11). Hands-on: පොඩි model එකක් LoRA වලින් fine-tune කරන්න, Triton හෝ NIM වලින් serve කරන්න, lm-evaluation-harness run කරන්න. Week 4: data analysis, trustworthy AI, NeMo Guardrails, revision (Phase 1, 17, 10, මේ phase එක). Hands-on: RAG bot එකට NeMo Guardrails දාන්න, practice tests කරලා දුර්වල domains ආයෙත් බලන්න.',
        'NVIDIA මේ certification එකට courses කිහිපයක් recommend කරනවා. ඒවා exam requirements වලට අමතර ඉගෙනුම් සම්පත්: topic එකකට අනුව එකක් තෝරාගෙන, app එකේ අදාළ lessons සහ hands-on practice එක්ක යන්න. Course availability, format සහ price වෙනස් වෙන්න පුළුවන්; latest විස්තර official link එකෙන් බලන්න. තව කියවීම්: Attention Is All You Need, LoRA paper, BERT paper, Prompt Engineering Guide (promptingguide.ai), NVIDIA blog: Prompt Engineering and P-Tuning, Mastering LLM Techniques: Inference Optimization සහ Customization, What Is RAG?, Hugging Face Illustrating RLHF, Hugging Face LLM Course (tokenizers, datasets, fine-tuning chapters), Triton Quick Start, TensorRT Get Started, NeMo Best Practices, NVIDIA GenerativeAIExamples repo, What Is Trustworthy AI?, NIST AI RMF.',
        'Exam-day tips: ප්‍රශ්නයකට මිනිත්තුවක් විතරයි. අමාරු ප්‍රශ්න flag කරලා අන්තිමට එන්න. NeMo, NIM, Triton, TensorRT-LLM, NeMo Guardrails, RAPIDS එකිනෙක මොකටද කියලා පැහැදිලිව දැනගන්න. Code ලියන්න නෑ, ඒත් spaCy, NumPy, scikit-learn, Hugging Face මොකටද කියලා අඳුනගන්න ඕනේ. Remote proctored නිසා කලින් දවසේ webcam, internet, mic test කරන්න. මේසය හිස් කරන්න. Phone එක කාමරෙන් එළියට. Power cut එකකට UPS එකක් හෝ fully charged laptop එකක් තියාගන්න.',
      ],
      analogy:
        'O/L / A/L වලට කලින් tuition class එකක syllabus එක cover කරලා, model papers කරලා, අන්තිම සතියේ දුර්වල chapters විතරක් ආයෙත් බලනවා වගේ. Exam දවසට කලින් admission card, පෑන, ID හදලා තියනවා වගේම, මෙතන webcam, internet, ID card ලෑස්ති කරනවා.',
      example:
        'සතියක දවසක ක්‍රමයක්: රෑ 8-9 site එකේ phase එකක topics 2ක් කියවන්න. 9-9.30 quiz එක කරන්න. සෙනසුරාදා පැය 3ක් hands-on lab එක (උදා: Week 2 RAG chatbot). ඉරිදා පැය 1ක් ඒ සතියේ වැරදුණු quiz ප්‍රශ්න notebook එකක ලියලා ආයෙත් බලන්න. සතියට පැය 10ක් විතර. සති 4 → පැය 40යි.',
      keyPoints: [
        'Week 1 fundamentals → Week 2 prompting/RAG → Week 3 customization/inference/eval → Week 4 analysis/trust/revision.',
        'Maths අමාරු නම් buffer දවස් තියාගන්න, සති 6ක් වුණත් කමක් නෑ.',
        'Rapid Application Development With LLMs = ප්‍රධාන DLI course එක.',
        'Exam දවසේ: flag කරලා ඉස්සරහට යන්න, webcam / internet / මේසය කලින් check කරන්න.',
      ],
      terms: [
        { en: 'Rapid Application Development With LLMs', si: 'NCA-GENL එකට NVIDIA recommend කරන ප්‍රධාන DLI course එක.' },
        { en: 'Fundamentals of Deep Learning', si: 'NVIDIA DLI course එකක්. Materials GitHub එකේ නොමිලේ තියෙනවා.' },
        { en: 'build.nvidia.com', si: 'NIM models API එකෙන් try කරන්න පුළුවන් NVIDIA site එක.' },
        { en: 'Flag for Review', si: 'අමාරු ප්‍රශ්නයක් සලකුණු කරලා පස්සේ ආයෙත් එන්න තියන එක.' },
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
      title: 'Python Tools to Recognize: spaCy, NumPy, Keras, scikit-learn, Hugging Face & Vector DB Clients',
      body: [
        'Exam එකේ ඔයාට code ලියන්න වෙන්නේ නෑ. ඒත් "මේ වැඩේට කොයි library එකද?" කියලා අහනවා. ඒ නිසා හැම tool එකකම "එක වාක්‍ය job description එක" මතක තියාගන්න. වැඩි විස්තර Phase 1 (NumPy, pandas) සහ Phase 4 (spaCy, Hugging Face) වල තියෙනවා.',
        'spaCy: production-ready NLP pipeline එකක්. Tokenization, named-entity recognition (NER), part-of-speech (POS) tagging, lemmatization, dependency parsing එකම pipeline එකකින් කරනවා. RAG එකකට කලින් documents වලින් නම්, ස්ථාන, දින අරගන්න හොඳයි. NumPy: numbers arrays (vectors, matrices) වේගයෙන් ගණනය කරන්න. Embeddings, cosine similarity, matrix multiply වගේ දේවල් යටින් NumPy. Keras: neural networks ලේසියෙන් හදන්න high-level API එක (layers එකින් එක ගහලා model.fit()). scikit-learn: classic ML (logistic regression, random forest, k-means), train/test split, cross-validation, metrics (accuracy, F1, R²).',
        'Hugging Face: transformers (pretrained models සහ tokenizers load කරන්න), datasets (ලොකු datasets load කරලා map / filter කරන්න), peft (LoRA), trl (SFT, DPO training), Hub (models / datasets share කරන තැන). Vector DB clients: pymilvus (Milvus), faiss (FAISS library, Meta එකේ), pgvector (PostgreSQL extension, Python එකෙන් psycopg / SQLAlchemy හරහා), chromadb, qdrant-client. මේවා embeddings save කරලා "මේකට ළඟම vectors මොනවද?" කියලා හොයනවා (Phase 13).',
        'GPU පැත්තෙන්: RAPIDS cuDF = GPU pandas, cuML = GPU scikit-learn (Phase 9, 17). NeMo = LLM build / customize කරන NVIDIA framework එක. Exam එකේ trap එකක්: spaCy සහ NLTK දෙකම NLP. ඒත් spaCy production pipelines වලට, NLTK වැඩිපුර ඉගෙනීමට / research වලට.',
      ],
      analogy:
        'Hardware shop එකක tools වගේ. Screwdriver (NumPy) හැම තැනම පාවිච්චි වෙනවා. Drill machine (Keras) එකෙන් ඉක්මනට සිදුරු. Toolbox set එක (scikit-learn) හැම මූලික වැඩේටම. ලොකු ready-made parts කඩේ (Hugging Face Hub). Electrician ගේ special tester එක (spaCy) text ඇතුළේ මොකද තියෙන්නේ කියලා හොයනවා. Exam එකේ අහන්නේ "ලයිට් එකේ වයර් check කරන්න මොකක්ද?" වගේ ප්‍රශ්න.',
      example:
        'Scenario: "Bank complaints 10,000ක් තියෙනවා. ඒවයේ තියෙන branch නම් සහ දින ඉක්මනට extract කරන්න ඕනේ." → spaCy NER. "Complaints positive / negative කියලා classify කරන්න logistic regression එකක් train කරලා 5-fold cross-validation කරන්න." → scikit-learn. "Complaint embeddings 10,000 save කරලා similar complaints හොයන්න." → Milvus / FAISS / pgvector.',
      code: {
        lang: 'python',
        src: `# pip install spacy numpy && python -m spacy download en_core_web_sm
import spacy, numpy as np

nlp = spacy.load("en_core_web_sm")          # පොඩි English pipeline එක
doc = nlp("Keells opened a new store in Kandy on 5 May 2025.")
for ent in doc.ents:                          # NER: නම්, ස්ථාන, දින
    print(ent.text, ent.label_)               # Keells ORG, Kandy GPE, ...
print([(t.text, t.pos_) for t in doc][:4])    # POS tagging

a, b = np.array([1.0, 2.0, 3.0]), np.array([2.0, 4.0, 6.5])
cos = a @ b / (np.linalg.norm(a) * np.linalg.norm(b))   # cosine similarity
print(round(cos, 3))                          # 1ට ළඟයි = දිශාව සමානයි`,
      },
      keyPoints: [
        'spaCy = NER, POS, tokenization pipeline. NumPy = arrays සහ ගණිතය.',
        'Keras = neural nets ලේසියෙන්. scikit-learn = classic ML, CV, metrics.',
        'Hugging Face = transformers, datasets, peft, trl, Hub.',
        'pymilvus, faiss, pgvector, chromadb = embeddings save කරලා similarity search.',
      ],
      terms: [
        { en: 'spaCy', si: 'Industrial NLP library එක. NER, POS tagging, lemmatization, dependency parsing.' },
        { en: 'NumPy', si: 'Python එකේ fast numeric arrays library එක.' },
        { en: 'Keras', si: 'Neural networks ලේසියෙන් හදන high-level API එක.' },
        { en: 'scikit-learn', si: 'Classic ML algorithms, preprocessing, cross-validation, metrics.' },
        { en: 'Hugging Face transformers / datasets', si: 'Pretrained models + tokenizers load කරන්න / datasets load කරලා process කරන්න.' },
        { en: 'Vector DB Client', si: 'pymilvus, faiss, pgvector වගේ vector database එකට කතා කරන Python library එක.' },
      ],
    },
    // 6
    {
      id: 'numbers-to-know',
      title: 'Numbers to Know: 12·d² per Layer, Weight Memory, 16 Bytes per Parameter, KV Cache, n²',
      body: [
        'Study guide එකේ "Numbers to know" table එකේ ගණන් පහක් තියෙනවා. මේවා කට පාඩම් කරනවාට වඩා "ඇයි" කියලා තේරුම් ගත්තම exam එකේ ලේසියි. ගැඹුරු ගණනය Phase 16 (parameter counting) සහ Phase 14 (GPU memory math) වල තියෙනවා.',
        '(1) Parameters per layer ≈ 12·d². d කියන්නේ model width එක (හැම token එකක්ම නිරූපණය කරන vector එකේ දිග). Attention කොටසේ d × d ප්‍රමාණයේ matrices 4ක් තියෙනවා (Q, K, V, output). ඒ 4·d². Feed-forward කොටසේ d එක 4d දක්වා පුළුල් කරලා ආයෙත් d එකට අඩු කරන matrices 2ක් තියෙනවා. එකක් d × 4d, අනික 4d × d. ඒ 8·d². එකතුව 12·d². (2) Attention cost O(n²·d): හැම token එකක්ම අනිත් හැම token එකක් එක්කම සසඳන නිසා, sequence length n දෙගුණ කළොත් වැඩේ හතර ගුණයක් වෙනවා.',
        '(3) Weights memory = parameters ගණන × එක parameter එකකට bytes. FP16 = bytes 2, INT8 = 1, INT4 = 0.5. 7B model: FP16 14 GB, INT8 7 GB, INT4 3.5 GB. (4) Adam + mixed precision training ≈ parameter එකකට bytes 16 (activations නැතුව): weights, gradients, FP32 master copy, Adam states දෙක. 7B × 16 ≈ 112 GB. LoRA / PEFT උදව් වෙන්නේ ඒ නිසා. (5) KV cache = 2 × layers × KV heads × head dimension × sequence length × batch size × bytes. 2 එක K සහ V දෙකට. Llama 2 7B FP16: token එකකට ≈ 0.5 MB, tokens 4,096ට ≈ 2 GB.',
      ],
      analogy:
        'Model weights කියන්නේ ගෙදර ගෙනියන බඩු. KV cache කියන්නේ කතාව අතරතුර ලියන notes. Training කරද්දී ඔයාට බඩු විතරක් නෙවෙයි, "ඊයේ මොකද වුණේ" (gradients) සහ "සාමාන්‍යයෙන් කොහාටද යන්නේ" (Adam states) කියන notebooks තුන හතරකුත් ගෙනියන්න වෙනවා. ඒ නිසා lorry එක (GPU memory) 8 ගුණයක් ලොකු වෙන්න ඕනේ.',
      example:
        'Llama 2 7B: d = 4096, layers 32. 12 × 4096² ≈ 201 million per layer. × 32 ≈ 6.4 billion. Embedding + output layers (32,000 × 4096 × 2 ≈ 0.26B) එකතු කළාම ≈ 6.7B. ඒ "7B" කියන නම. KV cache: 2 × 32 × 32 × 128 × 2 bytes = 524,288 bytes ≈ 0.5 MB per token. Users 8 දෙනෙක්, හැම කෙනාම tokens 4,096 → 0.5 MB × 4,096 × 8 ≈ 16 GB. Weights 14 GB + KV 16 GB = 30 GB. 24 GB GPU එකකට ඒක ගැළපෙන්නේ නෑ.',
      code: {
        lang: 'python',
        src: `# Llama 2 7B වගේ model එකක ගණන් ඉක්මනට බලමු
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
        '12·d² = attention 4·d² + FFN 8·d². Parameters වැඩි කොටස FFN එකේ.',
        'Weights memory = params × bytes. 7B → 14 / 7 / 3.5 GB (FP16 / INT8 / INT4).',
        'Adam training ≈ 16 bytes/param → 7B ≈ 112 GB.',
        'KV cache sequence length සහ batch size එක්ක linear විදිහට වැඩි වෙනවා. Attention n² විදිහට.',
      ],
      terms: [
        { en: 'd_model (d)', si: 'Model width එක. හැම token vector එකකම numbers ගණන.' },
        { en: 'O(n²)', si: 'Input එක දෙගුණ වුණාම වැඩේ හතර ගුණයක් වෙන ජාතියේ වර්ධනය.' },
        { en: 'Bytes per Parameter', si: 'එක weight එකක් save කරන්න ඕනේ memory. FP32 4, FP16 2, INT8 1, INT4 0.5.' },
        { en: 'KV Cache', si: 'Generation අතරතුර කලින් tokens වල K සහ V save කරන memory එක.' },
      ],
    },
    // 7
    {
      id: 'following-llm-research',
      title: 'Keeping Up with LLM Research Papers & Trends: Where and How',
      body: [
        'Core ML domain එකේ "new LLM research papers සහ trends follow කරන එක" ලැයිස්තුගත කරලා තියෙනවා. Exam එක අහන්නේ ඔයා හැම paper එකම කියෙව්වද කියලා නෙවෙයි. අහන්නේ මෑත කාලයේ වැදගත් අදහස් (RoPE, GQA, FlashAttention, MoE, LoRA, DPO, speculative decoding, reasoning models) අඳුනගන්න පුළුවන්ද කියලා. Paper කියවන ක්‍රමය ගැන Phase 8 එකේ "Reading Research Papers" topic එක බලන්න.',
        'කොහෙන්ද? arXiv (cs.CL = language, cs.LG = machine learning, cs.AI) අලුත් papers මුලින්ම එන තැන. Hugging Face Papers (daily papers) එකේ community එක ජනප්‍රිය papers upvote කරනවා. NVIDIA Technical Blog සහ NVIDIA Research site එක NVIDIA tools (TensorRT-LLM, NeMo, NIM) වල අලුත් features පැහැදිලි කරනවා. GTC talks (NVIDIA conference) on-demand බලන්න පුළුවන්. NeurIPS, ICML, ICLR, ACL, EMNLP කියන්නේ ප්‍රධාන research conferences. Model release වෙද්දී model card සහ technical report එකත් කියවන්න.',
        'කොහොමද? Paper එකක් පාස් 3කින් කියවන්න. පාස් 1: title, abstract, figures, conclusion (මිනිත්තු 10). "මේක මට වැදගත්ද?" කියලා තීරණය කරන්න. පාස් 2: method කොටස සහ results tables. Baseline එක මොකක්ද, improvement එක කොච්චරද, මොන benchmark එකේද. පාස් 3 (ඇත්තටම ඕනේ නම් විතරයි): ගණිතය සහ code. සතියකට papers 1-2ක් විතරක් තෝරලා, එක paper එකකට "එක වාක්‍ය සාරාංශයක්" notebook එකක ලියන්න. Hype එකට රැවටෙන්න එපා: පොඩි benchmark එකක 1% improvement එකක් ලොකු දෙයක් නෙවෙයි.',
      ],
      analogy:
        'Cricket fan කෙනෙක් හැම match එකම පැය 8ක් බලන්නේ නෑ. Highlights (abstract) බලනවා, scorecard (results table) බලනවා, ලොකු match එකක් නම් විතරක් full replay (full paper) බලනවා. Research follow කරන එකත් එහෙමයි.',
      example:
        'සතියේ routine එකක්: සඳුදා උදේ මිනිත්තු 15ක් Hugging Face daily papers top 10 බලන්න. එකක් තෝරලා abstract + figures කියවන්න. Notebook එකේ: "GQA: query heads කිහිපයක් එකම K/V head එකක් share කරනවා → KV cache එක කුඩා වෙනවා → inference වේගවත්." මාසෙකට පස්සේ ඔයාට වැදගත් ideas 4-8ක් ලේසියෙන් පැහැදිලි කරන්න පුළුවන්.',
      keyPoints: [
        'arXiv, Hugging Face Papers, NVIDIA Technical Blog, GTC, conferences = ප්‍රධාන sources.',
        'පාස් 3: abstract/figures → method/results → maths/code (අවශ්‍ය නම්).',
        'Exam එකට ඕනේ ideas අඳුනගන්න එක: RoPE, GQA, FlashAttention, MoE, LoRA, DPO, speculative decoding.',
        'Baseline, benchmark, improvement size බලලා hype එක වෙන් කරන්න.',
      ],
      terms: [
        { en: 'arXiv', si: 'Research papers peer review එකට කලින්ම නොමිලේ publish කරන site එක.' },
        { en: 'Hugging Face Papers', si: 'දවසේ ජනප්‍රිය AI papers community එක upvote කරන page එක.' },
        { en: 'Technical Report', si: 'අලුත් model එකක් release කරද්දී එයාලා training, data, results ගැන ලියන document එක.' },
        { en: 'Baseline', si: 'අලුත් ක්‍රමය සසඳන පරණ / සරල ක්‍රමය.' },
      ],
    },
    // 8
    {
      id: 'llm-app-components',
      title: 'Writing Scripts & Software Components for LLM Applications',
      body: [
        'Software development domain එකේ "LLM applications වලට scripts සහ software components ලියන එක" තියෙනවා. LLM app එකක් කියන්නේ model call එකක් විතරක් නෙවෙයි. ඒක කොටස් ගොඩක් එකතු කරපු pipeline එකක්: document loader, chunker, embedding client, vector store, retriever, prompt template, LLM client, output parser / validator, guardrails, logging. ඔයා full-stack tech lead කෙනෙක් නිසා මේක ඔයාට හුරු "microservice design" එකමයි.',
        'හොඳ LLM client component එකක ගුණ: (1) Config එක code එකේ hard-code නොකර environment variables / config file එකෙන් (model name, base URL, temperature). (2) Timeout සහ retries (exponential backoff), මොකද APIs වෙලාවකට 429 (rate limit) හෝ 5xx දෙනවා. (3) Structured output: JSON schema එකක් ඉල්ලලා, parse කරලා validate කරන්න (Phase 6, 14). (4) Logging: prompt version, model, tokens, latency හැම call එකකටම. (5) API keys code එකේ නෙවෙයි (මේ phase එකේ security topic එක බලන්න).',
        'NVIDIA NIM endpoints OpenAI-compatible API එකක් දෙන නිසා, openai Python SDK එකම base_url එක මාරු කරලා පාවිච්චි කරන්න පුළුවන්. ඒ කියන්නේ build.nvidia.com එකේ hosted NIM එකයි, ඔයාගේම GPU එකේ දුවන NIM / vLLM එකයි අතර මාරු වෙන්න code එකේ URL එක විතරයි වෙනස් කරන්න ඕනේ. මේක portability එකට ලොකු වාසියක්.',
      ],
      analogy:
        'Kottu කඩේක kitchen එක හිතන්න. එක්කෙනෙක් එළවළු කපනවා (chunker), එක්කෙනෙක් රොටී තලනවා (embedder), chef (LLM) අන්තිම පිඟාන හදනවා, cashier (output validator) bill එක හරිද බලනවා. හැම කෙනාටම වෙනම වැඩක් තියෙන නිසා එක්කෙනෙක් අසනීප වුණත් (API error) අනිත් අය වැඩ නවත්වන්නේ නෑ, retry කරනවා.',
      example:
        'Customer FAQ bot: request එකක් ආවම → retriever chunks 4ක් ගේනවා (≈ ms 40) → prompt template එකට දානවා → LLM client call (timeout තත්පර 30, retries 3) → JSON parser එක {"answer": ..., "sources": [...]} validate කරනවා → log: model=llama-3.1-8b, input 1,200 tokens, output 150 tokens, latency 1.8 s. Parse එක fail වුණොත් එක පාරක් retry කරලා, ආයෙත් fail නම් "මට විශ්වාසයෙන් කියන්න බෑ" fallback එක.',
      code: {
        lang: 'python',
        src: `import os
from openai import OpenAI   # NIM = OpenAI-compatible API

client = OpenAI(base_url=os.environ.get("LLM_BASE_URL", "https://integrate.api.nvidia.com/v1"),
                api_key=os.environ["NVIDIA_API_KEY"],   # key එක env එකෙන්, code එකේ නෙවෙයි
                timeout=30, max_retries=3)              # timeout + retries

def ask(question: str, context: str) -> str:
    resp = client.chat.completions.create(
        model=os.environ.get("LLM_MODEL", "meta/llama-3.1-8b-instruct"),
        messages=[{"role": "system", "content": "Context එකෙන් විතරක් උත්තර දෙන්න."},
                  {"role": "user", "content": f"Context:\\n{context}\\n\\nQ: {question}"}],
        temperature=0.2, max_tokens=300)
    print("tokens:", resp.usage.total_tokens)              # cost / monitoring සඳහා log කරන්න
    return resp.choices[0].message.content`,
      },
      keyPoints: [
        'LLM app = loader, chunker, embedder, retriever, prompt, LLM client, validator, logging.',
        'Config env vars වලින්, timeouts + retries, structured output validate කරන්න.',
        'NIM / vLLM OpenAI-compatible නිසා base_url එක මාරු කළාම ඇති.',
        'හැම call එකකම model, prompt version, tokens, latency log කරන්න.',
      ],
      terms: [
        { en: 'OpenAI-compatible API', si: 'OpenAI API එකේ format එකම පාවිච්චි කරන endpoint එකක්. NIM, vLLM එහෙමයි.' },
        { en: 'Exponential Backoff', si: 'Retry එකක් අතරේ බලාගෙන ඉන්න කාලය 1s, 2s, 4s වගේ දෙගුණ කරන එක.' },
        { en: 'Prompt Template', si: 'Variables දාන්න තැන් තියෙන, version කරපු prompt එක.' },
        { en: 'Output Validator', si: 'Model output එක schema එකට ගැළපෙනවද කියලා check කරන component එක.' },
      ],
    },
    // 9
    {
      id: 'choosing-comparing-stack',
      title: 'Choosing Data, Hardware & Software for a Use Case; Comparing on Cost, Portability, Compatibility, Usability',
      body: [
        'Use case එකකට stack එක තෝරද්දී ප්‍රශ්න තුනක් අහන්න. Data: මොන data ද (text, PDF, tables), කොච්චරද, private ද, කොච්චර නිතර update වෙනවද? Private සහ නිතර වෙනස් වෙන දැනුම නම් RAG. Style / format උගන්වන්න නම් fine-tuning (Phase 13, 15). Hardware: model එක memory එකට ගැළපෙනවද? 8B model එකක් FP16 නම් ≈ 16 GB weights + KV cache. 24 GB GPU (L4, A10G) එකක් ඇති වෙන්න පුළුවන්. 70B FP16 ≈ 140 GB, 80 GB GPUs කිහිපයක් හෝ quantization ඕනේ. Training ද inference ද? Training වලට memory සහ GPU-to-GPU bandwidth ගොඩක් ඕනේ.',
        'Software: hosted API (build.nvidia.com, Bedrock) ද self-hosted ද? Self-hosted නම් NIM (ලේසිම, optimized container), vLLM (open-source, flexible), Triton + TensorRT-LLM (උපරිම performance, ඒත් setup එක අමාරුයි). Training / customization වලට NeMo හෝ Hugging Face (transformers + peft + trl). Data processing වලට RAPIDS හෝ NeMo Curator.',
        'Technologies සසඳන්න දෙයාකාර හතරක් (Experimentation domain එකේ තියෙනවා): Cost: GPU පැයකට, token 1M කට, engineering time සහ maintenance. Portability: වෙන cloud එකකට / on-prem වලට ගෙනියන්න ලේසිද? Containers, ONNX, OpenAI-compatible APIs portability වැඩි කරනවා. Vendor lock-in අඩු කරනවා. Compatibility: ඔයාගේ GPU architecture, CUDA / driver versions, framework (PyTorch), model format (safetensors, GGUF, ONNX) එක්ක වැඩ කරනවද? Usability: docs, learning curve, team එකේ skills, community support.',
        'ප්‍රායෝගික ක්‍රමය: weighted decision matrix එකක්. Criteria හතරට weights දීලා (එකතුව 1), හැම option එකකටම 1-5 score දීලා, weight × score එකතු කරන්න. Architect කෙනෙක් විදිහට මේ matrix එක Architecture Decision Record (ADR) එකක ලියලා තියාගන්න.',
      ],
      analogy:
        'Colombo ඉඳන් Kandy යන්න transport තෝරනවා වගේ. Train එක ලාභයි (cost) ඒත් වෙලාවට යන්නේ නෑ. Taxi එක ලේසියි (usability) ඒත් ගණන්. ඔයාගේම car එක ඕනෙම තැනකට යන්න පුළුවන් (portability) ඒත් maintenance ඕනේ. Bus එකට ඔයාගේ luggage එක ගැළපෙනවද (compatibility)? වැදගත්ම දේට වැඩි weight එකක් දීලා තෝරනවා.',
      example:
        'Option A: Hosted API. Cost 3, Portability 2, Compatibility 5, Usability 5. Option B: Self-hosted NIM on EKS. Cost 4, Portability 4, Compatibility 4, Usability 3. Weights: cost 0.4, portability 0.2, compatibility 0.2, usability 0.2. A = 0.4×3 + 0.2×2 + 0.2×5 + 0.2×5 = 1.2 + 0.4 + 1.0 + 1.0 = 3.6. B = 0.4×4 + 0.2×4 + 0.2×4 + 0.2×3 = 1.6 + 0.8 + 0.8 + 0.6 = 3.8. B ටිකක් ඉස්සරහින්. ඒත් traffic අඩු නම් cost score එක වෙනස් වෙලා A දිනන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `# Weighted decision matrix: technologies සසඳන්න
weights = {"cost": 0.4, "portability": 0.2, "compatibility": 0.2, "usability": 0.2}
options = {
    "Hosted API":      {"cost": 3, "portability": 2, "compatibility": 5, "usability": 5},
    "NIM on EKS":      {"cost": 4, "portability": 4, "compatibility": 4, "usability": 3},
    "Triton+TRT-LLM":  {"cost": 5, "portability": 3, "compatibility": 3, "usability": 2},
}
for name, s in options.items():
    total = sum(weights[k] * s[k] for k in weights)   # weight × score එකතුව
    print(f"{name:16} {total:.2f}")                   # ලොකුම අගය = හොඳම තේරීම`,
      },
      keyPoints: [
        'Data → RAG ද fine-tune ද. Hardware → memory ගැළපෙනවද, training ද inference ද. Software → hosted ද self-hosted ද.',
        'NIM = ලේසිම optimized serving. vLLM = flexible open-source. Triton + TRT-LLM = උපරිම performance.',
        'Cost, portability, compatibility, usability හතරෙන්ම සසඳන්න.',
        'Weighted decision matrix + ADR = architect කෙනෙක්ගේ හොඳ පුරුද්ද.',
      ],
      terms: [
        { en: 'Portability', si: 'Stack එක වෙන environment එකකට ලේසියෙන් ගෙනියන්න පුළුවන්කම.' },
        { en: 'Compatibility', si: 'GPU, CUDA, framework, model format එක්ක ගැළපීම.' },
        { en: 'Vendor Lock-in', si: 'එක provider කෙනෙක්ගෙන් අයින් වෙන්න අමාරු වෙන තත්වය.' },
        { en: 'Architecture Decision Record (ADR)', si: 'තීරණයක්, විකල්ප සහ හේතු ලියලා තියන කෙටි document එක.' },
      ],
    },
    // 10
    {
      id: 'monitoring-processes',
      title: 'Monitoring Data Collection, Experiments & Software Processes',
      body: [
        'Software development domain එකේ "data collection, experiments, software processes monitor කරන එක" කියලා තියෙනවා. මේ තුන වෙන වෙනම බලමු. MLOps monitoring සහ drift ගැන Phase 7, experiment tracking සහ reproducibility ගැන Phase 11 බලන්න.',
        'Data collection monitoring: data pipeline එක හරියට data එකතු කරනවද? බලන්න ඕනේ: rows ගණන (හදිසියේ 0 වුණාද?), schema එක (columns වෙනස් වුණාද?), null / empty values ප්‍රතිශතය, duplicates, freshness (අන්තිම data එක ආවේ කවදද?), label distribution (positive / negative අනුපාතය හදිසියේ වෙනස් වුණාද?). Scraping කරනවා නම් fail වෙච්ච URLs ගණන සහ language mix එකත් බලන්න.',
        'Experiment monitoring: Weights & Biases හෝ MLflow එකට හැම run එකකම config එක (learning rate, batch size, LoRA rank), data version එක, code git commit එක, training / validation loss curves, eval metrics, GPU utilization log කරන්න. Loss එක NaN වුණොත් හෝ validation loss එක වැඩි වෙන්න පටන් ගත්තොත් alert එකක්. මේකෙන් "කොයි run එකද හොඳම, ඇයි?" කියලා පස්සේ හොයාගන්න පුළුවන්.',
        'Software process monitoring: production service එකේ logs, metrics, traces. Metrics: requests per second, error rate, p50 / p95 latency, TTFT, tokens per second, GPU utilization සහ memory (DCGM exporter → Prometheus / CloudWatch), queue length. LLM-specific: token usage සහ cost, guardrail block rate, user thumbs up / down, hallucination complaints. Alerts SLO එකට අනුව (උදා: p95 latency > 3 s මිනිත්තු 5ක්).',
      ],
      analogy:
        'Ceylon tea factory එකක් හිතන්න. දළු එකතු කරන තැන (data collection) බර කිලෝ කීයද, තෙත අධිකද බලනවා. Factory එක ඇතුළේ (experiments) හැම batch එකකම උෂ්ණත්වය, කාලය ලියනවා, හොඳම තේ එක හැදුණේ මොන settings වලින්ද දැනගන්න. Packing line එකේ (software process) පැකට් කීයක් එනවද, කැඩිලාද බලනවා. එක තැනක් නිරීක්ෂණය නොකළොත් අවුල වෙන්නේ අන්තිමට.',
      example:
        'Daily scraping job එක සාමාන්‍යයෙන් documents 5,000ක් ගේනවා. අද 300යි. Null text 2% ඉඳන් 40% දක්වා ගියා. Alert එක ගිහින් බැලුවම website එකේ HTML structure එක වෙනස් වෙලා. මේක නොදැක්කා නම් ඊළඟ fine-tune එක හිස් text 40%ක් එක්ක train වෙලා model එක නරක් වෙනවා.',
      code: {
        lang: 'python',
        src: `import pandas as pd

df = pd.read_json("todays_batch.jsonl", lines=True)   # අද එකතු කරපු data
checks = {
    "rows": len(df),                                     # rows ගණන
    "null_text_pct": df["text"].isna().mean() * 100,     # හිස් text %
    "dup_pct": df.duplicated("text").mean() * 100,       # duplicates %
    "missing_cols": {"text", "source", "date"} - set(df.columns),  # schema
}
print(checks)
if checks["rows"] < 1000 or checks["null_text_pct"] > 5:
    print("ALERT: data collection එකේ ප්‍රශ්නයක්!")     # pipeline එක නවත්වන්න`,
      },
      keyPoints: [
        'Data: rows, schema, nulls, duplicates, freshness, label distribution.',
        'Experiments: config, data version, git commit, loss curves, metrics → W&B / MLflow.',
        'Software: latency p95, TTFT, error rate, GPU util, tokens, cost, guardrail blocks.',
        'Alerts SLO එකට අනුව. Data ප්‍රශ්න ඉක්මනට අල්ලන්න.',
      ],
      terms: [
        { en: 'Data Freshness', si: 'අන්තිම data එක ආවේ කොච්චර කාලෙකට කලින්ද කියන එක.' },
        { en: 'Experiment Tracking', si: 'හැම training run එකකම settings සහ results save කරලා සසඳන එක.' },
        { en: 'SLO (Service Level Objective)', si: 'Service එක තියාගන්න ඕනේ ඉලක්කය. උදා: requests 95%ක් තත්පර 3ට අඩුවෙන්.' },
        { en: 'DCGM Exporter', si: 'GPU metrics Prometheus වගේ monitoring system එකකට යවන NVIDIA tool එක.' },
      ],
    },
    // 11
    {
      id: 'dataset-preparation',
      title: 'Preparing Datasets for Pretraining, Fine-Tuning & RLHF: Scraping, Cleaning, Tokenization',
      body: [
        'Experimentation domain එකේ dataset preparation ප්‍රශ්න එනවා. Data curation (quality filtering, MinHash dedup, decontamination, NeMo Curator) ගැඹුරින් Phase 15 එකේ තියෙනවා. මෙතන අපි අදියර තුනටම dataset එකක හැඩය සහ පියවර එකට බලමු.',
        'Pretraining data: labels නැති raw text ගොඩක්. පියවර: (1) Scraping / collection: robots.txt සහ website terms ගරු කරන්න, licenses බලන්න (copyright තියෙන content). (2) HTML එකෙන් text extract කරන්න (menus, ads අයින් කරන්න). (3) Language identification. (4) Quality filtering (ගොඩක් කෙටි, අමුතු characters, spam). (5) Deduplication (exact සහ near-duplicate). (6) PII අයින් කිරීම (phone numbers, emails, NIC numbers). (7) Benchmark test data අයින් කිරීම (decontamination). (8) Tokenize කරලා fixed-length sequences වලට pack කිරීම.',
        'Fine-tuning (SFT) data: instruction → response pairs, සාමාන්‍යයෙන් JSONL එකක chat "messages" format එකෙන්. ප්‍රමාණයට වඩා quality වැදගත්. Model එකේ chat template එකෙන්ම format කරන්න. Loss එක ගණන් කරන්නේ assistant tokens වලට විතරයි (loss masking). RLHF / DPO data: prompt එකක් + උත්තර දෙකක් + කොයි එකද හොඳ කියලා: {"prompt", "chosen", "rejected"}. මේවා එකතු කරන හැටි ඊළඟ topic එකේ.',
        'Tokenization පියවරේදී: model එකේම tokenizer එක පාවිච්චි කරන්න (වෙන tokenizer එකක් නෙවෙයි). Token lengths බලලා max length එකට වඩා දිග examples truncate වෙනවද බලන්න. Pretraining වලට sequences pack කරනවා (පොඩි documents එකට අලවලා padding නැති කරනවා). Fine-tuning වලට padding හෝ packing. Tokenization ගැඹුරින් Phase 14.',
      ],
      analogy:
        'Rice and curry එකක් උයන්න කලින් කරන preparation එක වගේ. සහල් ගේනවා (scraping), ගල් අහුලනවා (cleaning), එකම සහල් දෙපාරක් දාන්නේ නෑ (dedup), නරක් වෙච්ච ඒවා අයින් කරනවා (quality filter), හට්ටියට ගැළපෙන ප්‍රමාණයට මනිනවා (tokenize + pack). Preparation එක නරක නම් හොඳම chef ට (model) වත් හොඳ කෑමක් හදන්න බෑ.',
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
        'Model එකේම tokenizer එක, truncation check කරන්න.',
      ],
      terms: [
        { en: 'Web Scraping', si: 'Websites වලින් automatic විදිහට content එකතු කිරීම. robots.txt සහ terms ගරු කරන්න ඕනේ.' },
        { en: 'robots.txt', si: 'Website එක bots වලට කොයි pages බලන්න පුළුවන්ද කියලා කියන file එක.' },
        { en: 'Sequence Packing', si: 'පොඩි examples කිහිපයක් එක sequence එකකට අලවලා padding නාස්තිය අඩු කිරීම.' },
        { en: 'Preference Pair', si: 'එකම prompt එකට හොඳ (chosen) සහ නරක (rejected) උත්තර දෙකක්.' },
      ],
    },
    // 12
    {
      id: 'human-feedback-collection',
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
      q: 'ඔයාගේ (AWS tech lead → architect) certification පාරට වඩාත්ම ගැළපෙන පිළිවෙල මොකක්ද?',
      options: [
        'NCA-GENL → NCP-AAI → (optional) NCA-AIIO',
        'NCP-GENL → NCA-GENL → NCP-AII',
        'NCA-ADS → NCP-ADS',
        'NCP-AIO එකෙන් කෙළින්ම පටන් ගන්න',
      ],
      answer: 0,
      why: 'NCA-GENL අඩිතාලම, NCP-AAI තමයි application builders ලාට වැඩියෙන්ම architecture-focused exam එක. GPU infra sizing වැඩ තියෙනවා නම් NCA-AIIO optional. NCP-GENL ML engineer role එකට වඩා ගැළපෙනවා.',
    },
    {
      q: 'NCA-GENL exam එකේ වැඩිම weight එක තියෙන domain එක මොකක්ද?',
      options: ['Software development (24%)', 'Experimentation (22%)', 'Core machine learning and AI knowledge (30%)', 'Trustworthy AI (10%)'],
      answer: 2,
      why: 'Core ML & AI knowledge 30% (ප්‍රශ්න 15-18 විතර). ඊළඟට Software development 24%, Experimentation 22%, Data analysis 14%, Trustworthy AI 10%.',
    },
    {
      q: 'Model එකක R² = 0 නම් ඒකේ තේරුම මොකක්ද?',
      options: [
        'Model එක පරිපූර්ණයි',
        'Model එක හැම වෙලේම average අගය කියනවා තරම්ම හොඳයි, ඊට වඩා හොඳ නෑ',
        'Model එකේ loss එක 0යි',
        'Model එක classification model එකක්',
      ],
      answer: 1,
      why: 'R² මනින්නේ average එක කියන baseline එකට වඩා model එක variance එක කොච්චර පැහැදිලි කරනවද කියලා. 0 = baseline එක වගේමයි, 1 = පරිපූර්ණයි, 0ට අඩු = baseline එකටත් වඩා නරකයි.',
    },
    {
      q: 'RLHF සඳහා human feedback එකතු කරද්දී "1-10 ලකුණු" වෙනුවට pairwise comparison (A vs B) බොහෝ විට පාවිච්චි කරන්නේ ඇයි?',
      options: [
        'Pairwise ලේසියෙන් code කරන්න පුළුවන් නිසා විතරයි',
        'Annotators අතර ලකුණු scale එක වෙනස් වුණත් "කොයි එකද හොඳ" කියන එකට එකඟතාවය වැඩි නිසා',
        'Pairwise වලට annotators ඕනේ නැති නිසා',
        'Reward model එකට ලකුණු තේරෙන්නේ නැති නිසා',
      ],
      answer: 1,
      why: 'Absolute scores මිනිසුන්ගෙන් මිනිසුන්ට වෙනස් (එක්කෙනෙක් 7, අනිකා 5). Relative comparison එක වඩා consistent. Reward model එක (Bradley-Terry) train වෙන්නෙත් chosen/rejected pairs වලින්.',
    },
    {
      q: 'Developer කෙනෙක් API key එකක් public GitHub repo එකකට commit කළා. වැදගත්ම පළමු පියවර මොකක්ද?',
      options: [
        'Commit එක delete කරලා repo එක private කරන එක විතරක්',
        'README එකේ warning එකක් දාන එක',
        'කිසිම දෙයක් කරන්න ඕනේ නෑ, කවුරුත් දකින්නේ නෑ',
        'Key එක වහාම revoke / rotate කරන එක',
      ],
      answer: 3,
      why: 'Public repos bots මිනිත්තු කිහිපයකින් scan කරනවා. History එකෙන් අයින් කළත් key එක දැනටමත් copy වෙලා තියෙන්න පුළුවන්. Rotate කිරීම තමයි ඇත්ත fix එක. ඊට පස්සේ secrets manager සහ secret scanning.',
    },
    {
      q: 'Training කරද්දී nvidia-smi එකේ GPU-Util 30%යි, CPU core එකක් 100%යි. වැඩියෙන්ම ඉඩ තියෙන bottleneck එක මොකක්ද?',
      options: [
        'GPU එක ගොඩක් slow',
        'Data loading / preprocessing (CPU) bottleneck',
        'Model එකේ parameters මදි',
        'Learning rate එක ගොඩක් ලොකුයි',
      ],
      answer: 1,
      why: 'GPU එක data එනකම් බලාගෙන ඉන්නවා. DataLoader num_workers වැඩි කරන්න, pin_memory, data කලින් tokenize කරන්න. Nsight Systems timeline එකේ GPU row එකේ හිස් තැන් වලින් මේක පේනවා.',
    },
    {
      q: 'torch.cuda.is_available() False දෙනවා, ඒත් nvidia-smi GPU එක පෙන්නනවා. වැඩියෙන්ම ඉඩ තියෙන හේතුව?',
      options: [
        'CPU-only PyTorch wheel එකක් install වෙලා, හෝ driver එක PyTorch build කරපු CUDA version එකට පරණයි',
        'GPU එක කැඩිලා',
        'Python version එක ගොඩක් අලුත් නිසා',
        'Model එක download කරලා නැති නිසා',
      ],
      answer: 0,
      why: 'nvidia-smi වැඩ නම් GPU සහ driver ඉන්නවා. torch.version.cuda None නම් CPU-only wheel. නැත්නම් wheel එකේ CUDA version එකට driver එක support නෑ. ගැළපෙන wheel එකක් හෝ NGC container එකක් පාවිච්චි කරන්න.',
    },
    {
      q: 'රෑට documents 1 million summarize කරන්න ඕනේ, user කෙනෙක් බලාගෙන නෑ. හොඳම inference pattern එක?',
      options: [
        'Online real-time endpoint, batch size 1',
        'හැම document එකක්ම user කෙනෙක් request කරනකම් බලාගෙන ඉන්න',
        'Offline / batch inference, ලොකු batches, throughput සහ cost මත optimize කරලා',
        'Laptop CPU එකේ එකින් එක',
      ],
      answer: 2,
      why: 'Latency වැදගත් නැති ලොකු jobs වලට batch inference: ලොකු batches, spot instances, SageMaker Batch Transform වගේ. Online inference latency SLO එකක් තියෙන user requests වලට.',
    },
    {
      q: 'Docs 10,000ක් තියෙනවා. ඒවා වලින් company නම්, ස්ථාන, දින extract කරන්න ඕනේ. NCA-GENL study guide එකේ Python tools අතරින් හොඳම තේරීම?',
      options: ['NumPy', 'Keras', 'spaCy (NER)', 'Matplotlib'],
      answer: 2,
      why: 'spaCy pipeline එකේ named-entity recognition (NER) එක ORG, GPE, DATE වගේ entities අඳුනගන්නවා. NumPy ගණිතයට, Keras neural nets හදන්න, Matplotlib charts වලට.',
    },
    {
      q: 'අලුත් fine-tuned model version එකක් production එකට දාන්න හොඳම ක්‍රමය මොකක්ද?',
      options: [
        'පරණ version එක delete කරලා අලුත් එක 100% traffic එකට එකපාරටම දාන එක',
        'Regression eval suite එක pass වුණාට පස්සේ canary (traffic පොඩි %) එකකින් දාලා, metrics බලලා, අවශ්‍ය නම් rollback කරන එක',
        'Users ලාට කියලා ඔවුන්ටම test කරන්න දෙන එක',
        'Hosted API එකේ "latest" alias එක පාවිච්චි කරන එක',
      ],
      answer: 1,
      why: 'Eval gate + canary / shadow / blue-green + monitoring + ඉක්මන් rollback. Rollback කරන්න පරණ version එක ලෑස්තියෙන් තියෙන්න ඕනේ. "latest" alias එක version pinning නැති නිසා අනතුරුදායකයි.',
    },
  ],
}
