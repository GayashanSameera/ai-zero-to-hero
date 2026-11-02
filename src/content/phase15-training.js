export default {
  id: 'training',
  number: 15,
  title: 'LLM Training, Fine-Tuning & Scaling: Deep Dive',
  titleSi: 'LLM Training ගැඹුරින්: Data, Fine-Tuning, Alignment, GPU Scaling',
  summary:
    'මේ phase එකේදී අපි LLM එකක් හදන මුළු ගමනම ගැඹුරින් බලනවා: data පිරිසිදු කරන හැටි, pretraining objectives, SFT, LoRA / QLoRA වගේ PEFT ක්‍රම, RLHF / DPO alignment, mixed precision, memory ගණනය, සහ GPU සිය ගණනක් අතර training බෙදන හැටි. හැම ගණනයක්ම වචන වලින් පියවරෙන් පියවර කරලා පෙන්නනවා. NCA-GENL exam එකේ training ප්‍රශ්න ඔක්කොටම කට පාඩම් නැතුව තේරුම් අරන් උත්තර දෙන්න පුළුවන් වෙන එක තමයි ඉලක්කය.',
  duration: 'සති 4-6',
  topics: [
    // 1
    {
      id: 'pretraining-objectives',
      title: 'Pretraining Objectives: Causal LM, Masked LM, Span Corruption',
      examRefs: ['TRN-001', 'TRN-002', 'TRN-003', 'TRN-004'],
      body: [
        'Pretraining කියන්නේ model එකට trillion ගණනක tokens තියෙන, labels නැති text ප්‍රමාණයක් පෙන්නලා භාෂාව සහ ලෝකය ගැන සාමාන්‍ය දැනුම උගන්වන පළමු අදියර. Labels නැති නිසා text එකෙන්ම "ප්‍රශ්න" හදාගන්නවා. මේකට self-supervised learning කියනවා. මේ අදියර ඉවර වුණාම ලැබෙන්නේ base model (foundation model) එකක්. ඒක හොඳට භාෂාව දන්නවා, ඒත් උපදෙස් පිළිපදින්නේ නෑ, ආරක්ෂිත නැති ඉල්ලීම් ප්‍රතික්ෂේප කරන්නෙත් නෑ. Base model එකක් සාමාන්‍යයෙන් කරන්නේ ඔයා දුන්න text එක දිගටම ලියන එක විතරයි. Instruction following සහ refusals එන්නේ පස්සේ කරන SFT සහ alignment අදියර වලින්.',
        'Causal Language Modeling (CLM): GPT, Llama වගේ decoder-only models වල objective එක. හැම තැනකදීම "මෙතෙක් ආපු tokens බලලා ඊළඟ token එක මොකක්ද?" කියලා අනුමාන කරනවා. Model එකට පේන්නේ වම් පැත්ත (කලින් tokens) විතරයි. Causal mask එකෙන් අනාගත tokens හංගනවා. මේ නිසා model එක text වමේ ඉඳන් දකුණට generate කරන්න කෙළින්ම පුහුණු වෙනවා.',
        'Masked Language Modeling (MLM): BERT වගේ encoder-only models වල objective එක. Input tokens වලින් 15%ක් විතර random විදිහට හංගනවා ([MASK]), model එක දෙපැත්තේම (වම සහ දකුණ) context බලලා හැංගුණු token එක අනුමාන කරනවා. Classification, retrieval වගේ "තේරුම් ගන්න" වැඩ වලට මේක හොඳයි. ඒත් text generate කරන්න කෙළින්ම පුහුණු වෙන්නේ නෑ.',
        'Span Corruption: T5 (encoder-decoder) model එක ජනප්‍රිය කරපු objective එක. තනි tokens වෙනුවට අඛණ්ඩ කොටස් (spans) හංගලා, හැම span එකක්ම <extra_id_0>, <extra_id_1> වගේ sentinel token එකකින් replace කරනවා. Encoder එකට කැඩුණු text එක යනවා. Decoder එක හැංගුණු spans ටික sentinel එකත් එක්කම output කරනවා. BERT වගේම "හිස් තැන් පුරවන" අදහසක්, ඒත් වෙනම generative decoder එකක් තියෙන නිසා වෙනස්.',
      ],
      analogy:
        'O/L සිංහල පේපර් එකක ප්‍රශ්න තුනක් හිතන්න. CLM = "මේ කතාවේ ඊළඟ වචනය ලියන්න" (කලින් කොටස විතරයි පේන්නේ). MLM = "මේ වාක්‍යයේ හිස් තැන පුරවන්න" (හිස් තැනට ඉස්සරහත් පස්සෙත් වචන පේනවා). Span corruption = "ඡේදයේ අකුරු මැකිලා ගිය කොටස් තුන (A), (B), (C) කියලා ලේබල් කරලා තියෙනවා. ඒ කොටස් තුන වෙනම කොළයක ලියන්න."',
      example:
        'වාක්‍යය: "මම අද උදේ කොළඹ bus එකේ office ගියා". CLM: input "මම අද උදේ" → target "කොළඹ". MLM: "මම අද [MASK] කොළඹ bus එකේ office ගියා" → "[MASK] = උදේ". Span corruption: encoder input "මම අද <X> bus එකේ <Y> ගියා" → decoder output "<X> උදේ කොළඹ <Y> office". එක span එකක tokens කිහිපයක් තියෙන්න පුළුවන් බව බලන්න.',
      keyPoints: [
        'Pretraining = labels නැති විශාල corpus එකකින් base model එකක් හදන එක.',
        'Base model එක text continue කරනවා, instructions පිළිපදින්නේ SFT/alignment වලින් පස්සේ.',
        'Decoder-only (GPT, Llama) = causal LM, ඊළඟ token එක.',
        'Encoder-only (BERT) = masked LM, ~15% tokens, දෙපැත්තේ context.',
        'Encoder-decoder (T5) = span corruption, sentinel tokens.',
      ],
      terms: [
        { en: 'Self-Supervised Learning', si: 'Labels මිනිස්සු දෙන්නේ නැතුව data එකෙන්ම ප්‍රශ්න සහ උත්තර හදාගෙන ඉගෙන ගන්න එක.' },
        { en: 'Base / Foundation Model', si: 'Pretraining විතරක් කරපු, පුළුල් දැනුම තියෙන ඒත් assistant කෙනෙක් නොවන model එක.' },
        { en: 'Causal Mask', si: 'Token එකකට අනාගත tokens බලන්න නොදෙන attention mask එක.' },
        { en: 'Sentinel Token', si: 'T5 වල හැංගුණු span එකක් වෙනුවට දාන විශේෂ token එක (උදා: <extra_id_0>).' },
        { en: 'Next Sentence Prediction', si: 'වාක්‍ය දෙකක් අනුපිළිවෙලට එනවද කියලා classify කරන පැරණි BERT objective එකක්. LLM pretraining objective එක නෙවෙයි.' },
      ],
    },

    // 2
    {
      id: 'data-curation',
      title: 'Data Curation: Quality Filtering, Dedup (MinHash), Decontamination, Mixture Weights, NeMo Curator',
      examRefs: ['TRN-005', 'TRN-006', 'TRN-007', 'TRN-098', 'TRN-099', 'TRN-100'],
      body: [
        'Model එක හොඳ වෙන්නේ data එක හොඳ නම් විතරයි. Web crawl data වල menus, cookie notices, spam, එකම දේ දහස් වතාවක් copy කරපු pages වගේ කුණු ගොඩක් තියෙනවා. ඒ නිසා pretraining එකට කලින් curation pipeline එකක් දුවනවා: text extraction → language identification → quality filtering → deduplication → decontamination → mixture weighting.',
        'Heuristic quality filtering: ලාභ, නීති පදනම් කරගත්ත පෙරහන්. උදා: document එක ගොඩක් කෙටි නම් අයින් කරනවා, symbol-to-word ratio එක (#, {, | වගේ symbols වචන වලට සාපේක්ෂව) ගොඩක් වැඩි නම් අයින් කරනවා, එකම line එක ආයේ ආයේ repeat වෙනවා නම් අයින් කරනවා, සාමාන්‍ය stop-words (the, and, is) නැත්නම් ඒක ස්වභාවික භාෂාවක් නෙවෙයි කියලා අයින් කරනවා. මීට අමතරව classifier-based filtering (පොඩි model එකකින් "මේක quality text ද?" කියලා score කිරීම) කරනවා. Quality filtering එක document එකේ ගුණාත්මක භාවය බලනවා. Deduplication එක documents එකිනෙකට සසඳනවා. ඒ දෙක වෙනස් පියවර.',
        'Deduplication ඇයි? Duplicate text නිසා data distribution එක ඇද වෙනවා, training tokens (compute) නාස්ති වෙනවා, model එක text එක වචනයෙන් වචනය කට පාඩම් කරලා (memorization) ආයේ පිට කරනවා (regurgitation). Dedup කළාට copyright ප්‍රශ්නය විසඳෙන්නේ නෑ. ඒකට source filtering / licensing පරීක්ෂාව වෙනම ඕනේ. Exact dedup = SHA-256 / MD5 වගේ hash එකක් හැම document එකකටම හදලා එකම hash තියෙන ඒවා අයින් කරනවා. ඒත් timestamp එකක් හෝ වචන කිහිපයක් වෙනස් වුණොත් cryptographic hash එක සම්පූර්ණයෙන්ම වෙනස් වෙනවා. ඒ නිසා near-duplicates අල්ලන්න fuzzy dedup ඕනේ.',
        'Fuzzy dedup (MinHash + LSH): හැම document එකක්ම word n-grams (උදා: වචන 5 බැගින් කොටස්) set එකක් කරනවා. Documents දෙකක් කොච්චර සමානද කියන එක Jaccard similarity එකෙන් මනිනවා: පොදු n-grams ගණන ÷ මුළු වෙනස් n-grams ගණන. බිලියන ගණනක documents යුගල සෘජුව සසඳන්න බෑ. MinHash එකෙන් හැම document එකකටම පොඩි "signature" එකක් හදනවා. Signatures දෙකක ගැළපෙන කොටස් ප්‍රතිශතය Jaccard similarity එකට ආසන්න වෙනවා. LSH (Locality-Sensitive Hashing) එකෙන් සමාන signatures එකම bucket එකට දානවා, ඒ නිසා සසඳන්න ඕනේ එකම bucket එකේ ඒවා විතරයි. NVIDIA NeMo Curator මේක RAPIDS හරහා GPUs මත කරනවා.',
        'Decontamination: MMLU, GSM8K වගේ benchmark ප්‍රශ්න training data එකට කාන්දු වුණොත් model එක උත්තර කට පාඩම් කරනවා, score එක බොරුවට වැඩි වෙනවා. ඒ නිසා benchmark text එකත් එක්ක n-gram overlap (උදා: 13-gram) තියෙන training text අයින් කරනවා. අයින් වෙන ප්‍රමාණය ඉතාම පොඩියි. අරමුණ compute ඉතුරු කිරීම නෙවෙයි, evaluation එකේ අවංකභාවය. Mixture weighting: corpus එකේ 85% web, 15% books/code/papers වගේ නම්, quality වැඩි sources (code, books) ඒවායේ raw ප්‍රතිශතයට වඩා වැඩියෙන් sample කරනවා (upsampling). ඒවා epochs කිහිපයක් පෙනෙනවා, web text එක සාමාන්‍යයෙන් එක පාරක් විතරයි. Upsampling එක filtering එකට ආදේශකයක් නෙවෙයි, අතිරේකයක්.',
      ],
      analogy:
        'Pettah market එකෙන් සහල් ගෝනියක් ගත්තා කියලා හිතන්න. මුලින්ම ගල් කැට, කසළ අයින් කරනවා (quality filtering). ඊට පස්සේ එකම ගෝනියේ දෙපාරක් ඇහිරුණු පැකට් අයින් කරනවා (exact dedup). එකම සහල්, ඒත් label එක පොඩ්ඩක් වෙනස් පැකට් හොයන්න නම් ඇස් දෙකෙන් ළඟින් බලන්න ඕනේ (fuzzy dedup). Exam එකට එන ප්‍රශ්න පත්‍රයම ළමයාට කලින් පෙන්නන්නේ නෑ (decontamination). අන්තිමට බත් පිඟානට බත් වැඩියෙන් දැම්මත්, පෝෂ්‍යදායී පරිප්පු සහ එළවළු වලට ඒවායේ ප්‍රමාණයට වඩා වැදගත්කමක් දෙනවා (mixture weighting).',
      example:
        'Document A: "Colombo weather today is sunny and warm" (වචන 7යි). Document B: එකම text එක, අගට "Updated 10:05" එකතු කරලා (වචන 9යි). SHA-256 hash දෙක සම්පූර්ණයෙන්ම වෙනස්, ඒ නිසා exact dedup එක මේක අල්ලන්නේ නෑ. Word 3-grams ගත්තොත් A ට 5ක් තියෙනවා, B ට 7ක්. පොදු 5යි, මුළු වෙනස් 7යි. Jaccard = 5 ÷ 7 ≈ 0.71. Threshold එක 0.6 නම් fuzzy dedup එක මේ දෙක near-duplicates කියලා එකක් අයින් කරනවා. Mixture උදාහරණය: code raw share 5% වුණත් sampling weight 10% දුන්නොත් code tokens දෙපාරක් (epochs 2) විතර පෙනෙනවා.',
      keyPoints: [
        'Heuristic filters = length, symbol ratio, repeated lines, stop-words වගේ නීති.',
        'Dedup = memorization සහ compute නාස්තිය අඩු කරනවා. Copyright විසඳන්නේ නෑ.',
        'Exact hash (SHA-256) = exact copies විතරයි. Near-duplicates = MinHash + LSH (Jaccard).',
        'Decontamination = benchmark leakage නවත්වලා evaluation අවංක කරනවා.',
        'NeMo Curator = GPU-accelerated curation (filtering, dedup, language ID). Guardrails නෙවෙයි.',
      ],
      terms: [
        { en: 'NeMo Curator', si: 'Pretraining/fine-tuning data පිරිසිදු කරන NVIDIA tool එක. RAPIDS හරහා GPU මත exact/fuzzy dedup, filters දුවනවා.' },
        { en: 'Jaccard Similarity', si: 'Sets දෙකක පොදු අයිතම ගණන ÷ මුළු වෙනස් අයිතම ගණන. 1 = සම්පූර්ණයෙන් සමානයි.' },
        { en: 'MinHash', si: 'Document එකකට Jaccard similarity එක ඇස්තමේන්තු කරන්න පුළුවන් කෙටි signature එකක් හදන ක්‍රමය.' },
        { en: 'LSH (Locality-Sensitive Hashing)', si: 'සමාන signatures එකම bucket එකට දාලා, හැම යුගලයක්ම සසඳන්න ඕනේ නැති කරන ක්‍රමය.' },
        { en: 'Benchmark Contamination', si: 'Test ප්‍රශ්න training data එකට කාන්දු වීම. Scores බොරුවට වැඩි වෙනවා.' },
        { en: 'Upsampling', si: 'වටිනා data source එකක් එහි ස්වභාවික ප්‍රමාණයට වඩා වැඩි වාර ගණනක් sample කිරීම.' },
      ],
    },

    // 3
    {
      id: 'synthetic-data-distillation',
      title: 'Synthetic Data, Self-Instruct, Knowledge Distillation & Model Collapse',
      examRefs: ['TRN-030', 'TRN-031', 'TRN-094', 'TRN-095', 'TRN-096', 'TRN-097', 'TRN-141', 'TRN-142', 'TRN-150'],
      body: [
        'Labeled data ටිකයි (උදා: examples 200යි), ඒත් fine-tune කරන්න දහස් ගණනක් ඕනේ. ඒ 200 විසි පාරක් copy කළාට අලුත් තොරතුරක් එකතු වෙන්නේ නෑ, overfitting විතරයි වැඩි වෙන්නේ. ලෝකයේ සම්මත විසඳුම synthetic data generation: ශක්තිමත් "teacher" LLM එකකින් අලුත් examples generate කරලා, ඊට පස්සේ quality filter කරන එක. NVIDIA Nemotron-4 340B එකේ Instruct model එකයි Reward model එකයි මේකට නිකුත් කළා. Instruct model එක prompts සහ responses generate කරනවා. Reward model එක ඒ responses helpfulness, correctness වගේ attributes අනුව score කරලා, දුර්වල ඒවා අයින් කරනවා. Reward model එක prompts generate කරන්නේ නෑ, score කරනවා විතරයි.',
        'Self-Instruct: මිනිස්සු ලියපු seed tasks 175ක් විතර පටන් අරන්, LLM එකට ඒ වගේ අලුත් instructions සහ උත්තර generate කරන්න කියනවා, quality සහ diversity අනුව filter කරනවා, ආයේ ඒවාම seed කරගෙන දිගටම කරනවා. මෙහෙම හැදෙන්නේ SFT (instruction tuning) data. Stanford Alpaca මේකේ variant එකක් පාවිච්චි කළා. Reward model labels නෙවෙයි හැදෙන්නේ.',
        'Knowledge distillation: ලොකු teacher model එකක හැසිරීම පොඩි student model එකකට උගන්වන එක. Logit-based distillation එකේ student ඉගෙන ගන්නේ teacher ගේ සම්පූර්ණ probability distribution එකෙන් (soft targets). "බල්ලා 0.7, නරියා 0.2, බළලා 0.1" වගේ distribution එකක "නරියා බල්ලාට ටිකක් සමානයි" කියන hidden තොරතුර (dark knowledge) තියෙනවා. One-hot label එකේ ඒක නෑ. Temperature T > 1 එකකින් logits බෙදුවාම distribution එක පැතලි වෙනවා, ඒ hidden තොරතුර පැහැදිලි වෙනවා. T වැඩි වුණාම predictions අඩු confident වෙනවා. Soft-target term එකේ gradients 1/T² ප්‍රමාණයෙන් පොඩි වෙන නිසා Hinton ක්‍රමයේ ඒ loss එක T² න් ගුණ කරනවා. එතකොට T වෙනස් කළත් hard-label loss එකට සාපේක්ෂව ඒ term එකේ බර එකම විදිහට තියෙනවා. (Pruning කියන්නේ model එකෙන් කොටස් අයින් කරන වෙනම compression ක්‍රමයක්, බොහෝ විට distillation එක්ක එකට පාවිච්චි කරනවා.)',
        'Teacher එකට API access විතරක් තියෙනවා නම් (logits නෑ), logit matching හෝ hidden-state matching කරන්න බෑ. ඒ වෙලාවට කරන්නේ sequence-level distillation: teacher generate කරපු responses උඩ student එක සාමාන්‍ය SFT එකකින් train කරනවා. (Teacher ගේ terms of use බලන්නත් ඕනේ.) Generative LLMs වල MiniLLM වගේ ක්‍රම reverse KL, KL(student ‖ teacher), student-sampled outputs උඩ minimize කරනවා. Forward KL "mass-covering": teacher probability දෙන හැම තැනකටම student ත් probability දෙන්න බල කරනවා, පොඩි student එකක් ඒක හරියට කරන්න බැරුව අඩු quality text ලියනවා. Reverse KL "mode-seeking": student teacher ගේ ප්‍රධාන, high-probability modes වලට අවධානය යොමු කරනවා. ඒකට student ගෙන් samples ඕනේ (on-policy sampling).',
        'Model collapse: හැම model generation එකක්ම කලින් generation එකේ synthetic text උඩම train කළොත් (fresh human data අඩුවෙන්), හැම පාරකම අඩු probability "tail" content ටිකක් අඩුවෙන් sample වෙනවා. ඒ දෝෂ එකතු වෙලා distribution එක හැකිලෙනවා, outputs එකම විදිහේ සහ විකෘති වෙනවා (Shumailov et al.). විසඳුම: සැබෑ data කොටසක් හැමවිටම තියාගන්න, synthetic data හොඳට filter කරන්න. Synthetic data අතිරේකයක් ලෙස හොඳයි, සම්පූර්ණ ආදේශකයක් ලෙස නෙවෙයි.',
      ],
      analogy:
        'Teacher = A/L Physics වල ප්‍රසිද්ධ tuition sir කෙනෙක්. Hard label = "උත්තරය (3)" කියලා විතරක් කියන එක. Soft targets = "(3) හරි, ඒත් (4) ටිකක් ළඟයි, (1) සම්පූර්ණයෙන් වැරදියි" කියලා හේතුව එක්ක කියන එක. ශිෂ්‍යයාට දෙවැනි එකෙන් වැඩිපුර ඉගෙන ගන්න පුළුවන්. Model collapse = photocopy එකක photocopy එකක photocopy එකක් ගන්නවා වගේ. හැම පාරම පොඩි විස්තර ටිකක් නැති වෙනවා, අන්තිමට කියවන්න බැරි වෙනවා.',
      example:
        'Synthetic pipeline: seed examples 200 → Instruct model එකෙන් candidates 10,000ක් → reward model එකෙන් score කරලා ඉහළම 30% තියාගන්නවා → examples 3,000ක්. Distillation temperature: teacher logits [4, 2, 0]. T = 1 දී softmax ≈ [0.87, 0.12, 0.02]. T = 2 දී logits [2, 1, 0] වෙනවා, softmax ≈ [0.67, 0.24, 0.09]. දෙවැනි සහ තෙවැනි classes වල තොරතුර දැන් පැහැදිලියි. T = 2 නම් soft loss එක T² = 4 න් ගුණ කරනවා.',
      keyPoints: [
        'Small dataset → teacher LLM එකෙන් generate කරලා filter කරන්න. Duplicate කරන්න එපා.',
        'Nemotron-4 340B Reward model = synthetic responses score කරලා filter කරන එක.',
        'Self-Instruct = seed tasks ~175 → LLM generate → filter → SFT data.',
        'Distillation: soft targets, T > 1 පැතලි කරනවා, loss × T². API-only නම් sequence-level.',
        'Reverse KL = mode-seeking (MiniLLM). Synthetic-only loops = model collapse.',
      ],
      terms: [
        { en: 'Synthetic Data', si: 'මිනිස්සු නෙවෙයි, model එකක් generate කරපු training data.' },
        { en: 'Self-Instruct', si: 'පොඩි seed set එකකින් LLM එකටම instructions සහ උත්තර generate කරවලා dataset එකක් හදන ක්‍රමය.' },
        { en: 'Soft Targets / Dark Knowledge', si: 'Teacher ගේ සම්පූර්ණ probability distribution එක, සහ එහි සැඟවුණු "වැරදි උත්තර අතර සමානකම්" තොරතුර.' },
        { en: 'Sequence-Level Distillation', si: 'Teacher ලියපු text උඩ student එක SFT කරන එක. Logits ඕනේ නෑ.' },
        { en: 'Forward vs Reverse KL', si: 'Forward = mass-covering (හැම තැනම ආවරණය), Reverse = mode-seeking (ප්‍රධාන මුදුන් වලට අවධානය).' },
        { en: 'Model Collapse', si: 'Synthetic data උඩම නැවත නැවත train කිරීමෙන් rare content නැති වී outputs හැකිලීම.' },
      ],
    },

    // 4
    {
      id: 'continued-pretraining-forgetting',
      title: 'Continued Pretraining, Re-warming, Catastrophic Forgetting, Replay & EWC',
      examRefs: ['TRN-008', 'TRN-022', 'TRN-071', 'TRN-109', 'TRN-143', 'TRN-144'],
      body: [
        'Continued (domain-adaptive) pretraining: ඔයාට labels නැති domain text ගොඩක් තියෙනවා නම් (උදා: company engineering docs 50 GB, medical papers), base model එක ඒ text උඩ එකම next-token objective එකෙන් තවදුරටත් train කරනවා. එතකොට model එක domain එකේ වචන, කෙටි යෙදුම්, facts උරාගන්නවා. Instruction tuning, DPO වගේ ක්‍රම වලට prompt-response pairs හෝ preference pairs ඕනේ, ඒවා උගන්වන්නේ හැසිරීම (behavior), bulk දැනුම නෙවෙයි. Prompt tuning (virtual tokens 20ක් වගේ) ට domain දැනුම GB 50ක් උරාගන්න ධාරිතාවක් නෑ.',
        'නිවැරදි පිළිවෙල: labels නැති විශාල medical corpus එකකුයි Q&A pairs 5,000කුයි තියෙනවා නම්, (1) corpus එක උඩ continued pretraining, (2) ඊට පස්සේ Q&A pairs උඩ SFT, (3) අවශ්‍ය නම් preference alignment (DPO). දැනුම මුලින් දාලා, ඊට පස්සේ conversation format එක උගන්වනවා. SFT කරලා පස්සේ continued pretraining කළොත්, SFT උගන්වපු instruction following හැසිරීම මැකිලා යනවා.',
        'Re-warming: Pretraining එක සාමාන්‍යයෙන් ඉවර වෙන්නේ learning rate එක ඉතා පොඩි අගයකට decay කරලා. ඒ checkpoint එකෙන් continued pretraining පටන් ගනිද්දී LR එක ආයේ warmup කරලා (re-warm) ඉහළ අගයකට අරන්, ආයේ decay (re-decay) කරනවා. පරණ කුඩා LR එකේම හිටියොත් forgetting අඩුයි, ඒත් අලුත් domain එක හරියට ඉගෙන ගන්නේ නෑ. Re-warm කළාම අලුත් domain එක හොඳට ඉගෙන ගන්නවා, ඒත් මුල් pretraining distribution එකේ loss එක මුලදී වැඩි වෙනවා (forgetting). Ibrahim et al. (2024) නිර්දේශය: re-warm + re-decay කරන්න, සහ මුල් pretraining data වලින් පොඩි ප්‍රතිශතයක් (සියයට කිහිපයක් වුණත්) replay කරන්න.',
        'Catastrophic forgetting: පටු dataset එකක් (උදා: legal contracts) උඩ fine-tune කළාම model එක කලින් දැනගෙන හිටපු general reasoning, coding වගේ හැකියාවන් නැති වෙනවා. Weights අලුත් පටු distribution එකට ඇදිලා පරණ හැකියාවන් overwrite වෙනවා. මේක reward hacking (RL වලදී flawed reward එකක් exploit කරන එක) හෝ mode collapse නෙවෙයි. Mitigation: (a) Replay: domain data එකට general instruction data කොටසක් මිශ්‍ර කරන්න. (b) LR අඩු කරන්න, epochs අඩු කරන්න. (c) PEFT (LoRA) පාවිච්චි කරන්න, base weights වෙනස් වෙන්නේ නෑ. (d) EWC (Elastic Weight Consolidation): පරණ tasks වලට වැදගත් parameters මොනවද කියලා diagonal Fisher information එකෙන් ඇස්තමේන්තු කරලා, ඒවා වෙනස් කරනවා නම් quadratic penalty එකක් දානවා. වැදගත් weights පරණ අගයට "elastic band" එකකින් බැඳලා වගේ. EWC ට පරණ data ඕනේ නෑ, ඒක regularization ක්‍රමයක්. Replay ට පරණ data ඕනේ. වැඩි epochs හෝ වැඩි LR forgetting වැඩි කරනවා.',
      ],
      analogy:
        'Colombo hospital එකේ වැඩ කරපු general doctor කෙනෙක් අවුරුද්දක් cardiology විතරක් කරනවා. ආපහු OPD එකට ආවාම සාමාන්‍ය ලෙඩ ටික අමතක වෙලා (catastrophic forgetting). විසඳුම: cardiology කරද්දීත් සතියකට දවසක් OPD යන්න (replay). EWC = "ඔයාගේ මූලික වෛද්‍ය දැනුම වෙනස් කරනවා නම් ලොකු දඬුවමක්, පොඩි විස්තර නම් කමක් නෑ" කියන නීතියක්. Re-warming = නිවාඩුවකින් පස්සේ ආයේ cricket practice පටන් ගනිද්දී වේගයෙන් පන්දු යවන්න කලින් ටික ටික උණුසුම් වෙන එක.',
      example:
        'Domain adaptation plan: medical corpus tokens බිලියන 10ක්. Continued pretraining mix = medical 95% + මුල් general pretraining data 5% (replay). LR: 0 ඉඳන් peak 1e-4 දක්වා steps 1,000ක් re-warm කරලා, cosine එකෙන් 1e-5 දක්වා re-decay. ඊට පස්සේ Q&A pairs 5,000 + general instruction data 1,000ක් (replay) එක්ක SFT. මෙහෙම කළාම medical වැඩ හොඳ වෙනවා, general instruction following නැති වෙන්නේත් නෑ.',
      keyPoints: [
        'Unlabeled domain text → continued pretraining (next-token objective).',
        'පිළිවෙල: continued pretraining → SFT → (DPO). අනිත් පැත්තට නෙවෙයි.',
        'Re-warm + re-decay + පරණ data සියයට කිහිපයක් replay.',
        'Catastrophic forgetting = පටු fine-tune එකකින් general skills නැති වීම.',
        'Mitigation: replay, අඩු LR/epochs, PEFT, EWC (Fisher-weighted quadratic penalty, පරණ data ඕනේ නෑ).',
      ],
      terms: [
        { en: 'Domain-Adaptive Pretraining', si: 'Domain එකේ labels නැති text උඩ next-token objective එකෙන්ම තවදුරටත් train කිරීම.' },
        { en: 'Re-warming', si: 'Decay වෙලා ඉවර වුණු LR එක continued pretraining එකේදී ආයේ warmup කරලා ඉහළ අගයකට ගැනීම.' },
        { en: 'Catastrophic Forgetting', si: 'අලුත් data උඩ train කිරීමෙන් කලින් ඉගෙන ගත් හැකියාවන් නැති වීම.' },
        { en: 'Replay', si: 'පරණ / general data කොටසක් අලුත් training data එකට මිශ්‍ර කිරීම.' },
        { en: 'EWC (Elastic Weight Consolidation)', si: 'වැදගත් weights (high Fisher information) වෙනස් කිරීමට quadratic penalty දෙන regularization ක්‍රමය.' },
        { en: 'Fisher Information', si: 'Parameter එකක් පොඩ්ඩක් වෙනස් කළොත් පරණ task එකේ output එකට කොච්චර බලපානවද කියන වැදගත්කම් මිනුම.' },
      ],
    },

    // 5
    {
      id: 'sft-deep-dive',
      title: 'SFT Deep Dive: Instruction Tuning, Loss Masking (-100), Packing, Chat Templates, LIMA, NEFTune',
      examRefs: ['TRN-009', 'TRN-010', 'TRN-049', 'TRN-079', 'TRN-080', 'TRN-081', 'TRN-082', 'TRN-110', 'TRN-140'],
      body: [
        'SFT dataset එකක් කියන්නේ prompt + target response යුගල. මිනිස්සු ලියපු හෝ තෝරපු "හොඳ උත්තර" demonstrations. Model එක සාමාන්‍ය cross-entropy loss එකෙන් ඒ උත්තර අනුකරණය කරන්න ඉගෙන ගන්නවා. Chosen/rejected pairs කියන්නේ preference data, ඒවා reward modeling හෝ DPO වලට (පස්සේ අදියරක). Instruction tuning (FLAN style): tasks සිය ගණනක් natural-language instructions විදිහට ලියලා train කරනවා. අරමුණ: කලින් කවදාවත් දැකලා නැති අලුත් instructions වලටත් zero-shot විදිහට හොඳට වැඩ කරන එක. Context length, model size, tokenizer වගේ දේවල් instruction tuning වෙනස් කරන්නේ නෑ.',
        'Loss masking: Chat model එකක් SFT කරද්දී loss එක ගණනය කරන්නේ assistant response tokens වලට විතරයි. අපිට ඕනේ හොඳ උත්තර ලියන්න උගන්වන්න, user prompts ලියන්න නෙවෙයි. Prompt එක forward pass එකේ context එක විදිහට තියෙනවා, attention එකට පේනවා, loss එකට විතරක් දායක වෙන්නේ නෑ. Code එකේ මේක කරන්නේ labels වල prompt positions -100 කරලා. -100 කියන්නේ PyTorch CrossEntropyLoss එකේ default ignore_index එක. Hugging Face models ඒක පාවිච්චි කරනවා. Input tokens වෙනස් වෙන්නේ නෑ, attention mask එකත් වෙනස් වෙන්නේ නෑ. Labels සහ attention mask එකිනෙකින් ස්වාධීනයි.',
        'Sequence packing: Examples ගොඩක් කෙටි නම් (tokens 200ක් වගේ) සහ sequence length 4,096 නම්, batch එකේ වැඩි කොටස padding. GPU එක padding උඩ නිකං compute කරනවා. Packing කියන්නේ examples කිහිපයක් එක sequence එකකට එකට අලවලා padding අඩු කරන එක. ඒත් හරියට කළොත්, එක example එකක tokens අනිත් example එකට attend නොකරන්න attention masking (document boundaries) හෝ position IDs reset කරන්න ඕනේ. ඒ නිසා packing එක mask එකේ අවශ්‍යතාවය නැති කරන්නේ නෑ.',
        'Chat template mismatch: Fine-tune කරද්දී පාවිච්චි කරපු role tokens (උදා: <|user|>, <|assistant|>, end-of-turn token) production එකේ inference වලදී වෙනස් නම්, model එකට ලැබෙන්නේ නොදන්න (out-of-distribution) format එකක්. ප්‍රතිඵලය: නතර නොවී rambling, turns පටලවා ගැනීම. Production එකේ අමුතු උත්තර එනවා නම් මුලින්ම බලන්න ඕනේ training සහ inference දෙකේම chat template එක සහ special tokens හරියටම සමානද කියලා (tokenizer.apply_chat_template එකම පාවිච්චි කරන්න). Training loss 0 වුණා කියන්නේ memorization, format හරි කියන එක නෙවෙයි.',
        'Overfitting: SFT epochs 5ක් දුවද්දී training loss දිගටම අඩු වෙනවා, ඒත් validation loss epoch 2 දී අඩුම වෙලා ඊට පස්සේ වැඩි වෙනවා නම් ඒක overfitting. Epoch 2 checkpoint එක ගන්න, නැත්නම් early stopping. (Underfitting නම් losses දෙකම ඉහළින් තියෙනවා.) LIMA: 65B model එකක් හොඳට තෝරපු examples 1,000ක් විතරක් උඩ SFT කරලා හොඳ ප්‍රතිඵල ගත්තා, RLHF නැතුව. "Superficial alignment hypothesis": දැනුම එන්නේ pretraining වලින්, SFT උගන්වන්නේ style සහ format. ඒ නිසා ප්‍රමාණයට වඩා quality සහ diversity වැදගත්. (1,000 නීතියක් නෙවෙයි.) NEFTune: SFT training එකේදී විතරක් input embedding vectors වලට scaled uniform noise එකතු කරන එක-line වෙනසක්. ඒක regularizer එකක් වගේ වැඩ කරලා instruction set එකේ විස්තර වලට overfit වීම අඩු කරනවා, chat quality වැඩි කරනවා. Inference වලදී noise නෑ.',
      ],
      analogy:
        'SFT = අලුත් call centre agent කෙනෙක්ට "customer මෙහෙම ඇහුවොත් මෙහෙම උත්තර දෙන්න" කියලා හොඳ උදාහරණ පෙන්නන එක. Loss masking = agent ට customer ගේ කතාව අහන්න දෙනවා, ඒත් ලකුණු දෙන්නේ agent ගේ උත්තරයට විතරයි. Packing = tuk-tuk එකක එක්කෙනා යවනවා වෙනුවට, එකම පැත්තට යන තුන්දෙනෙක් එකට යවන එක, ඒත් එක්කෙනාගේ බඩු අනිත් කෙනාට පටලවා නොගන්න. Chat template mismatch = training එකේදී "හලෝ, customer care" කියලා පටන් ගන්න පුරුදු කරලා, production එකේ call එක වෙනම beep එකකින් පටන් ගන්න එක. Agent පටලැවෙනවා.',
      example:
        'Prompt tokens 30ක්, response tokens 70ක්, එකතුව 100යි. labels[:30] = -100 දැම්මාම loss එක ගණනය වෙන්නේ tokens 70ක් උඩ විතරයි. Packing: examples 20ක්, හැම එකකම tokens ~200යි, seq length 4,096. Packing නැතුව sequences 20ක්, හැම එකකම 3,896ක් padding (95% නාස්තියි). Packing එක්ක 200 × 20 = 4,000 tokens එකම sequence එකකට යනවා. GPU work එක 20 ගුණයක් විතර අඩුයි.',
      code: {
        lang: 'python',
        src: `import torch

input_ids = torch.tensor([[11, 12, 13, 21, 22, 23, 24]])  # prompt 3 + response 4
prompt_len = 3

labels = input_ids.clone()
labels[:, :prompt_len] = -100   # prompt tokens loss එකට ගන්නේ නෑ
print(labels)  # tensor([[-100, -100, -100, 21, 22, 23, 24]])

# loss = model(input_ids=input_ids, labels=labels).loss
# input_ids වෙනස් වුණේ නෑ: model එකට prompt එක තාමත් context එක විදිහට පේනවා`,
      },
      keyPoints: [
        'SFT data = prompt + response demonstrations. Preference pairs වෙනම (DPO/RM).',
        'Instruction tuning = නොදුටු instructions වලට zero-shot generalization.',
        'labels = -100 → cross-entropy එක ඒ positions ignore කරනවා. Attention වෙනස් නෑ.',
        'Packing = padding නාස්තිය අඩු කරනවා, ඒත් boundaries mask කරන්නම ඕනේ.',
        'Production rambling → chat template / special tokens මුලින්ම බලන්න. LIMA = quality > quantity. NEFTune = embedding noise.',
      ],
      terms: [
        { en: 'ignore_index (-100)', si: 'CrossEntropyLoss එක loss ගණනයෙන් අත්හරින label අගය.' },
        { en: 'Loss Masking', si: 'Prompt tokens loss එකට දායක නොකර response tokens විතරක් train කිරීම.' },
        { en: 'Sequence Packing', si: 'කෙටි examples කිහිපයක් එක sequence එකකට එකතු කරලා padding අඩු කිරීම.' },
        { en: 'Chat Template', si: 'System/user/assistant turns special tokens එක්ක එක text එකක් කරන නිශ්චිත format එක.' },
        { en: 'Superficial Alignment Hypothesis', si: 'SFT මූලිකව උගන්වන්නේ style/format, දැනුම නෙවෙයි කියන LIMA අදහස.' },
        { en: 'NEFTune', si: 'SFT එකේදී input embeddings වලට noise එකතු කරන regularization ක්‍රමය.' },
      ],
    },

    // 6
    {
      id: 'prompt-rag-finetune',
      title: 'Prompting vs RAG vs Fine-Tuning: කවදා මොකක්ද?',
      examRefs: ['TRN-050', 'TRN-073', 'TRN-074'],
      body: [
        'Exam එකේ ගොඩක් ප්‍රශ්න scenario විදිහට එනවා: "මේ තත්ත්වයට හොඳම ක්‍රමය මොකක්ද?" මතක තියාගන්න සරල නීතිය: ලාභම දෙයින් පටන් ගන්න. Prompting → RAG → Fine-tuning → (continued) pretraining. ඊළඟ පියවරට යන්නේ කලින් එක මදි නම් විතරයි.',
        'Prompting (few-shot) මුලින්: Labels ටිකයි (උදා: 30), deadline එක මේ සතියමයි, task එක සරලයි (support tickets categories 5කට classify කිරීම). හොඳ instruction-tuned model එකකට prompt එකේ examples කිහිපයක් දීලා බලන්න. බොහෝ විට ඒ ඇති. RLHF, pretraining from scratch වගේ දේවල් මේකට අධික වැඩියි.',
        'RAG: දැනුම නිතර වෙනස් වෙනවා නම් (product docs හැම සතියෙම update වෙනවා) සහ උත්තර වලට sources cite කරන්න ඕනේ නම්. RAG එකේ දැනුම තියෙන්නේ update කරන්න පුළුවන් index එකක. Docs වෙනස් වුණාම re-index කළා ඇති, retrain ඕනේ නෑ. Retrieved passages පෙන්නලා cite කරන්න පුළුවන්. සතිපතා fine-tuning මිලයි, forgetting අවදානම තියෙනවා, උත්තරය ආවේ කොහෙන්ද කියලා trace කරන්න විශ්වාසදායක ක්‍රමයක් නෑ.',
        'Fine-tuning (SFT / LoRA): ප්‍රශ්නය දැනුම නෙවෙයි, හැසිරීම නම්: හැම වෙලාවෙම නිශ්චිත JSON schema එක, brand tone එක, output format එක. දිග system prompt එකකින් ඒක 80%ක් විතරක් හරි යනවා, දිග prompt එක latency වැඩි කරනවා නම්, fine-tuning එකෙන් ඒ style එක weights වලට "පුච්චලා" prompt එක කෙටි කරන්න පුළුවන්. Few-shot examples වැඩි කළොත් prompt එක තවත් දිග වෙලා latency ප්‍රශ්නය නරක් වෙනවා. RAG එකෙන් format consistency එක ලැබෙන්නේ නෑ. Temperature වැඩි කළොත් consistency තවත් අඩු වෙනවා.',
      ],
      analogy:
        'අලුත් සේවකයෙක් ඉන්නවා. Prompting = වැඩේ කරන්න කලින් කෙටි උපදෙස් ටිකක් සහ උදාහරණ දෙකක් කියන එක. RAG = "මේ file එක ළඟ තියාගෙන, ඕනේ වෙලාවට බලලා, කොහෙන්ද ගත්තේ කියලා කියන්න" කියන එක. File එක update වුණාම අලුත් file එක දෙනවා ඇති. Fine-tuning = මාසයක් training course එකකට යවලා company style එක ඇඟට කාවද්දන එක. ඊට පස්සේ හැම පාරම උපදෙස් කියන්න ඕනේ නෑ.',
      example:
        'Scenario 1: Bank එකේ interest rates හැම සතියෙම වෙනස් වෙනවා, customer ට source link එක ඕනේ → RAG. Scenario 2: Tickets 30ක්, categories 5ක්, prototype එක සිකුරාදා → few-shot prompting. Scenario 3: හැම උත්තරයක්ම {"category": ..., "priority": ..., "reply": ...} JSON එකේ, company එකේ brand tone එකේ ඕනේ, system prompt tokens 2,000ක් නිසා latency වැඩියි → LoRA SFT එකක්, ඊට පස්සේ prompt එක tokens 100කට කෙටි කරනවා.',
      keyPoints: [
        'Cheap → expensive: prompting → RAG → fine-tuning → pretraining.',
        'නිතර වෙනස් වන දැනුම + citations = RAG.',
        'Consistent format / tone / schema + කෙටි prompt = fine-tuning (LoRA SFT).',
        'Few labels + ඉක්මන් prototype = few-shot prompting.',
      ],
      terms: [
        { en: 'Few-Shot Prompting', si: 'Prompt එක ඇතුළේම examples කිහිපයක් දීලා task එක පෙන්නන එක. Weights වෙනස් වෙන්නේ නෑ.' },
        { en: 'RAG', si: 'Retrieval-Augmented Generation: index එකකින් අදාළ කොටස් හොයලා prompt එකට දාලා උත්තර දෙන එක.' },
        { en: 'Baking Behavior into Weights', si: 'Style/format එක fine-tuning එකෙන් model එකේම කොටසක් කරන එක, prompt එකෙන් නොකියා.' },
      ],
    },

    // 7
    {
      id: 'lora-deep-dive',
      title: 'LoRA Deep Dive: B·A, Rank, Alpha, Init, LoraConfig, Parameter Counts, Learning Rates',
      examRefs: ['TRN-011', 'TRN-012', 'TRN-013', 'TRN-014', 'TRN-053', 'TRN-054', 'TRN-055', 'TRN-056', 'TRN-057', 'TRN-070', 'TRN-101', 'TRN-135', 'TRN-138'],
      body: [
        'PEFT (Parameter-Efficient Fine-Tuning) එකේ හරය: pretrained weights වලින් බහුතරය freeze කරලා, අලුතෙන් එකතු කරපු හෝ තෝරපු පොඩි parameters ප්‍රමාණයක් (සාමාන්‍යයෙන් 1-2%ට වඩා ගොඩක් අඩු) විතරක් train කරනවා. එතකොට gradients සහ optimizer states වලට යන memory එක ගොඩක් අඩු වෙනවා. PEFT කියන්නේ "කුමන parameters train කරනවද" කියන එක ගැන. Dataset size එක ගැන නෙවෙයි. Full fine-tuning තරම්ම data PEFT එකටත් පාවිච්චි කරන්න පුළුවන්. RL ඕනේ නෑ, layers අයින් කරන්නේත් නෑ.',
        'LoRA යාන්ත්‍රණය: d × k ප්‍රමාණයේ frozen weight matrix එකක් W කියමු. LoRA, W වෙනස් කරන්නේ නෑ. ඒ වෙනුවට update එක ΔW = B·A විදිහට ඉගෙන ගන්නවා. A ගේ shape එක r × k, B ගේ shape එක d × r. r (rank) කියන්නේ ඒ matrices දෙකේ "ඇතුළත ප්‍රමාණය". Forward pass එකේ output = W·x + (α/r)·B·A·x. Train වෙන parameters ගණන = r × (d + k). r වැඩි කළාම adapter එකේ ධාරිතාව (capacity) සහ size එක වැඩි වෙනවා. සාමාන්‍ය r අගයන් 4-64. Adapt කරන්නේ කුමන layers වලටද කියන එක r නෙවෙයි, target_modules තීරණය කරන්නේ. (Input එකට trainable vectors එකතු කරන එක prompt tuning, LoRA නෙවෙයි.)',
        'Initialization: A random විදිහට, B zeros විදිහට init කරනවා. B = 0 නිසා B·A = 0, ඒ කියන්නේ training පටන් ගන්න මොහොතේ adapted model එක හරියටම base model එක වගේ හැසිරෙනවා. ඊට පස්සේ සුමටව ඈත් වෙනවා. A ගේ gradient එක B මත රඳා පවතින නිසා පළමු step එකේ විතරක් A ට gradient 0යි. B update වුණාට පස්සේ A ටත් gradients එනවා. Scaling: update එක α/r න් ගුණ කරනවා. r = 16, lora_alpha = 32 නම් α/r = 32 ÷ 16 = 2. (0.5 කියන්නේ r/α, පොදු වැරැද්දක්.) ජනප්‍රිය heuristic එකක්: α = 2r, එතකොට r වෙනස් කළත් scale එක 2 ම යි.',
        'LoraConfig කියවන හැටි: LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules=["q_proj","v_proj"], task_type="CAUSAL_LM") සහ get_peft_model(base_model, config). මෙතන වෙන්නේ base model එක සම්පූර්ණයෙන් freeze කරලා, නම "q_proj" සහ "v_proj" වලට ගැළපෙන modules වලට අලුත් A/B matrices inject කරන එක. මුල් q/v weights freeze වෙලා. Gradients ලැබෙන්නේ අලුත් low-rank matrices වලට විතරයි. lora_dropout = adapter path එකේ input එකට dropout 5%. model.print_trainable_parameters() "trainable params: 4,194,304 || all params: 6,742,609,920 || trainable%: 0.0622" කියලා print කළොත් තේරුම: gradients සහ Adam states ඕනේ ~4.2M parameters වලට විතරයි (PEFT memory ඉතිරිය එන්නේ මෙතනින්). Adapter checkpoint එක ~4.2M params විතරයි (BF16 නම් ~8 MB, FP32 නම් ~17 MB). Base model එකේ 6.7B ම forward pass එකට memory එකේ තියෙනවා. කිසිම compress කිරීමක් වුණේ නෑ, inference 0.06% කින් මන්දගාමී වෙනවා කියන එකත් නෙවෙයි.',
        'LoRA steps ඇයි එච්චර වේගවත් නැත්තේ? Parameters 1%ට අඩුවෙන් train කළත්, forward pass එක මුළු frozen model එක හරහාම යනවා. මුල් layers වල adapters වලට gradients යවන්න backprop එක හැම layer එකක් හරහාම යන්න ඕනේ (activation gradients). ඉතුරු වෙන්නේ frozen weights වල weight-gradient ගණනය, optimizer updates, සහ memory විතරයි. LoRA paper එකේ GPT-3 වලට throughput වැඩිවීම ~25%යි. LoRA ගේ ප්‍රධාන ජයග්‍රහණය memory සහ storage. Learning rates: full fine-tuning ~1e-5 (pretrained දැනුම විනාශ නොකරන්න පොඩියි), LoRA ~1e-4 සිට 2e-4 (අලුතෙන් init කරපු low-rank adapters වලට ~10× වැඩි LR ඕනේ). 1e-2 වගේ LR එකකින් LLM full fine-tuning ඉක්මනින් අස්ථාවර වෙනවා. Capacity මදි නම්: r = 4 attention-only LoRA එකක් complex code task එකක ඉහළ validation loss එකක plateau වෙනවා නම්, r වැඩි කරන්න සහ/හෝ MLP projections (gate/up/down_proj) ත් target කරන්න. QLoRA paper එකේ සොයාගැනීම: full fine-tuning quality එකට එන්න LoRA හැම linear layer එකකටම (q, k, v, o + MLP) දාන්න ඕනේ. Rank එක ඊට වඩා අඩුවෙන් සංවේදීයි.',
      ],
      analogy:
        'මහා ලොකු Excel sheet එකක (rows 4,096 × columns 4,096) හැම cell එකක්ම වෙනස් කරනවා වෙනුවට, "row එකකට එක අංකයක්" column එකක් සහ "column එකකට එක අංකයක්" row එකක් විතරක් ලියනවා (r = 1). ඒ දෙක ගුණ කළාම මුළු sheet එකටම ගැළපෙන "වෙනස" හැදෙනවා. r = 8 නම් එහෙම යුගල 8ක්. B = 0 init කිරීම = notebook එකේ පිටු හිස්ව පටන් ගන්න එක. මුලදී පොතේ දැනුම විතරයි, notes ටික ටික එකතු වෙනවා.',
      example:
        'එක matrix එකක්: d = k = 4,096, r = 8. A = 8 × 4,096 = 32,768, B = 4,096 × 8 = 32,768. එකතුව r(d + k) = 8 × 8,192 = 65,536. (32,768 කියන්නේ matrix එකක් විතරයි. 16,777,216 කියන්නේ frozen W එකේ size එක.) මුළු model එක: layers 32, q_proj සහ v_proj දෙකට විතරයි. 65,536 × 2 × 32 = 4,194,304. 7B model එකකින් 0.06%යි. r = 16 කළොත් 8,388,608. Target module එකක් අමතක කළොත් 2,097,152. Scaling: r = 16, α = 32 → 2.',
      code: {
        lang: 'python',
        src: `from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,                 # A, B matrices වල ඇතුළත ප්‍රමාණය (capacity)
    lora_alpha=32,        # scale = alpha / r = 2
    lora_dropout=0.05,    # adapter input එකට dropout
    target_modules=["q_proj", "v_proj"],  # මේ නම් තියෙන layers වලට විතරයි
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, config)  # base weights freeze වෙනවා
model.print_trainable_parameters()          # train වෙන්නේ A, B විතරයි`,
      },
      keyPoints: [
        'ΔW = B·A, A: r×k, B: d×r, params = r(d + k). Scale = α/r.',
        'B = 0 init → පටන් ගද්දී model එක base model එකමයි.',
        'r = capacity. target_modules = කුමන layers. Underfit නම් r වැඩි කරන්න / MLP ත් target කරන්න.',
        'Trainable params = gradients + optimizer states ඕනේ ඒවා. Base model එක compress වෙන්නේ නෑ.',
        'LR: full FT ~1e-5, LoRA ~1e-4-2e-4. LoRA steps ටිකක් විතරයි වේගවත්, ප්‍රධාන ලාභය memory.',
      ],
      terms: [
        { en: 'Rank (r)', si: 'LoRA matrices දෙකේ පොදු ඇතුළත dimension එක. Adapter capacity සහ size තීරණය කරනවා.' },
        { en: 'lora_alpha', si: 'LoRA update එකේ scale එක α/r ලෙස තීරණය කරන hyperparameter එක.' },
        { en: 'target_modules', si: 'LoRA inject කරන layers වල නම් (q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj).' },
        { en: 'get_peft_model', si: 'Base model එක freeze කරලා config එක අනුව adapters එකතු කරන HF PEFT function එක.' },
        { en: 'print_trainable_parameters', si: 'Train වෙන params ගණන, මුළු params ගණන, ප්‍රතිශතය පෙන්නන method එක.' },
      ],
    },

    // 8
    {
      id: 'lora-merging-variants',
      title: 'Merging LoRA (merge_and_unload), DoRA, rsLoRA, New Tokens & TIES-Merging',
      examRefs: ['TRN-015', 'TRN-102', 'TRN-136', 'TRN-137', 'TRN-139', 'TRN-145'],
      body: [
        'Merging: Training ඉවර වුණාම adapter එක base weights වලට එකතු කරන්න පුළුවන්: W\' = W + (α/r)·B·A. ඊට පස්සේ model එකේ architecture එක සහ size එක මුල් base model එකම යි. Inference වලදී adapter overhead එකක් නෑ, අමතර latency නෑ, සාමාන්‍ය dense matmuls විතරයි. Trade-off එක: merge කළාට පස්සේ adapter එක request එකෙන් request එකට swap කරන්න බෑ. Adapters වෙනම තියාගත්තොත් තමයි එක base model එකක් උඩ customers ලාට වෙනස් adapters (multi-LoRA serving) දෙන්න පුළුවන් වෙන්නේ. Merge කළා කියලා model එක පොඩි වෙන්නෙත් නෑ, context window එක දිග වෙන්නෙත් නෑ.',
        'Code එකෙන්: PeftModel.from_pretrained(base_model, "./lora-adapter") → .merge_and_unload() → .save_pretrained("./merged"). merge_and_unload() හැම adapted layer එකකටම W + (α/r)·B·A ගණනය කරලා PEFT wrappers අයින් කරනවා. ඉතුරු වෙන්නේ සාමාන්‍ය transformers model එකක්. ./merged එකේ save වෙන්නේ LoRA updates ඇතුළත් සම්පූර්ණ model එක (4-bit quantized model එකක් නෙවෙයි). Merge නොකර PeftModel එක save කළොත් save වෙන්නේ පොඩි adapter files විතරයි.',
        'DoRA (Weight-Decomposed LoRA): හැම weight එකක්ම magnitude (දිග) සහ direction (දිශාව) කියලා කොටස් දෙකකට වෙන් කරනවා. Magnitude vector එක කෙළින්ම train කරනවා, direction එකට LoRA update එකක් දානවා. මේ නිසා learning dynamics full fine-tuning එකට සමීප වෙනවා, එකම rank එකේදී accuracy බොහෝ විට වැඩියි. LoRA වගේම train කළාට පස්සේ weights වලට merge කරන්න පුළුවන්. rsLoRA (rank-stabilized LoRA): සම්මත α/r scaling එකේ r ලොකු වෙද්දී update එක පොඩි වෙනවා, ඒ නිසා high rank වලින් ලාභයක් නෑ. rsLoRA α/√r පාවිච්චි කරනවා. එතකොට ඉහළ ranks වලින් ඇත්ත ප්‍රතිඵල වැඩිවීමක් ලැබෙනවා. HF PEFT වල use_rslora=True.',
        'අලුත් tokens එකතු කිරීම: tokenizer එකට අලුත් special tokens 500ක් එකතු කරලා model.resize_token_embeddings(len(tokenizer)) කළාම අලුත් embedding rows init වෙනවා. ඒත් LoRA attention projections වලට විතරක් නම්, ඒ අලුත් rows සහ LM head එක freeze වෙලා. Model එකට අලුත් tokens තේරුම් ගන්නවත්, output කරන්නවත් ඉගෙන ගන්න බෑ. විසඳුම: modules_to_save=["embed_tokens", "lm_head"] දාලා ඒවා trainable කරන්න. Tokenizer එක මුල ඉඳන් retrain කරන්න ඕනේ නෑ.',
        'Model merging (TIES): එකම base එකෙන් fine-tune කරපු models කිහිපයක් (උදා: code model, math model) එකක් කරන්න පුළුවන්. "Task vector" = fine-tuned weights − base weights. සරල averaging එකේ ප්‍රශ්නය: පොඩි redundant changes සහ විරුද්ධ ලකුණු (sign) තියෙන changes එකිනෙක cancel වෙලා ප්‍රයෝජනවත් වෙනස්කම් නැති වෙනවා. TIES = Trim (පොඩි වෙනස්කම් අයින් කරනවා, ලොකුම ඒවා විතරක් තියාගන්නවා), Elect Sign (හැම parameter එකකටම බහුතර ලකුණ තෝරනවා), Merge (ඒ ලකුණට එකඟ අගයන් විතරක් average කරනවා). අමතර training එකක් ඕනේ නෑ. MoE එකක් හදන්නේවත්, හොඳම එක විතරක් තෝරන්නේවත් නෑ.',
      ],
      analogy:
        'LoRA adapter = බස් එකේ ගලවලා දාන්න පුළුවන් route board එකක් ("138 Maharagama"). Merge කිරීම = route board එක body එකේම paint කරනවා. දැන් ඉක්මනින් route මාරු කරන්න බෑ, ඒත් board එකක් එල්ලන්න ඕනේ නෑ. TIES = පවුලේ තුන්දෙනෙක් ගෙදර paint කරන පාට ගැන යෝජනා කරනවා. පොඩි යෝජනා අතහරිනවා (trim), "කොළ පාටද නිල් පාටද" කියලා ඡන්දයෙන් තීරණය කරනවා (elect sign), ජයගත්ත පැත්තේ අයගේ යෝජනා විතරක් මිශ්‍ර කරනවා (merge).',
      example:
        'rsLoRA vs LoRA: α = 16. r = 16 දී LoRA scale = 16/16 = 1, rsLoRA scale = 16/4 = 4. r = 64 දී LoRA scale = 16/64 = 0.25 (update එක හැකිලෙනවා), rsLoRA scale = 16/8 = 2. ඒ නිසා rsLoRA එකේ r වැඩි කළාම ඉගෙනීම මැලි වෙන්නේ නෑ. TIES උදාහරණය: එක parameter එකකට model 3ක task vectors +0.30, +0.20, −0.05. Trim එකෙන් −0.05 (පොඩියි) අයින් වෙනවා. Elect sign = +. Merge = (0.30 + 0.20) ÷ 2 = 0.25. සරල average එක (0.30 + 0.20 − 0.05) ÷ 3 = 0.15, ප්‍රයෝජනවත් වෙනස අඩු වෙලා.',
      code: {
        lang: 'python',
        src: `from peft import PeftModel

# base model එක + train කරපු adapter එක load කරනවා
model = PeftModel.from_pretrained(base_model, "./lora-adapter")

# W + (alpha/r) * B @ A ගණනය කරලා PEFT wrappers අයින් කරනවා
model = model.merge_and_unload()

# දැන් save වෙන්නේ සාමාන්‍ය full model එකක් (adapter files නෙවෙයි)
model.save_pretrained("./merged")`,
      },
      keyPoints: [
        'Merge = W + (α/r)BA. Latency overhead නෑ, ඒත් per-request swap කරන්න බෑ.',
        'merge_and_unload() → plain transformers model. Merge නොකර save කළොත් adapter විතරයි.',
        'DoRA = magnitude + direction. rsLoRA = α/√r (use_rslora=True).',
        'අලුත් tokens නම් modules_to_save=["embed_tokens","lm_head"].',
        'TIES = Trim, Elect Sign, Merge. Training ඕනේ නෑ.',
      ],
      terms: [
        { en: 'merge_and_unload()', si: 'LoRA updates base weights වලට fold කරලා PEFT wrappers අයින් කරන PEFT method එක.' },
        { en: 'Multi-LoRA Serving', si: 'එක base model එකක් උඩ request අනුව වෙනස් adapters මාරු කරලා serve කිරීම.' },
        { en: 'DoRA', si: 'Weight එක magnitude සහ direction ලෙස වෙන් කරලා direction එකට LoRA දාන ක්‍රමය.' },
        { en: 'rsLoRA', si: 'Scaling එක α/√r කරලා high ranks ස්ථාවරව ඉගෙන ගන්න දෙන LoRA variant එක.' },
        { en: 'modules_to_save', si: 'LoRA නැතුව සම්පූර්ණයෙන් trainable කරලා save කරන modules ලැයිස්තුව.' },
        { en: 'Task Vector', si: 'Fine-tuned weights සහ base weights අතර වෙනස.' },
      ],
    },

    // 9
    {
      id: 'qlora-nf4',
      title: 'QLoRA: NF4, Double Quantization, Paged Optimizers, Compute Dtype',
      examRefs: ['TRN-016', 'TRN-017', 'TRN-061', 'TRN-072', 'TRN-103', 'TRN-104', 'TRN-105'],
      body: [
        'QLoRA = frozen base model එක 4-bit වලට quantize කරලා, ඒ උඩ higher-precision (BF16) LoRA adapters train කරන එක. Base weights 4-bit NF4 විදිහට ගබඩා කරලා, ගණනය කරන්න ඕනේ මොහොතේ BF16 වලට dequantize කරනවා. Gradients backprop වෙලා යන්නේ LoRA adapters වලට. මේකෙන් 65B model එකක් එක 48 GB GPU එකක fine-tune කරන්න පුළුවන් වුණා. QLoRA කියන්නේ fine-tuning memory technique එකක්. මුල ඉඳන් 4-bit pretraining නෙවෙයි, serving වලට adapter quantize කිරීමත් නෙවෙයි, FP8 activations ත් නෙවෙයි.',
        'NF4 (4-bit NormalFloat) ඇයි? Pretrained weights බොහෝ දුරට 0 වටා normal distribution (bell curve) එකක් විදිහට පිහිටලා තියෙනවා. සාමාන්‍ය INT4 එකේ levels 16 සමාන පරතරයෙන් තියෙනවා. NF4 එකේ levels 16 normal distribution එකේ quantiles වල තියෙනවා: weights ගොඩක් තියෙන 0 ළඟ levels ළඟින්, අගිස්සේ ඈතින්. ඒ නිසා quantization error එක අඩුයි. NF4 storage format එකක් විතරයි: tensor cores කෙළින්ම NF4 matmul කරන්නේ නෑ, ගණනයට කලින් BF16 වලට dequantize කරනවා.',
        'BitsAndBytesConfig settings: load_in_4bit=True (4-bit load කරන්න), bnb_4bit_quant_type="nf4" (storage format එක), bnb_4bit_use_double_quant=True, bnb_4bit_compute_dtype=torch.bfloat16 (matmul එකට dequantize කරන dtype එක). Storage format එකයි compute dtype එකයි වෙනම settings දෙකක්. Adapter checkpoint dtype එක හෝ tokenizer එක මේකෙන් තීරණය වෙන්නේ නෑ.',
        'Double quantization: weights 64 බැගින් blocks වලට බෙදලා, හැම block එකකටම FP32 scale constant එකක් තියෙනවා. ඒක parameter එකකට ~0.5 bits overhead (32 bits ÷ 64). Double quantization එකේදී ඒ constants ම 8-bit වලට quantize කරනවා, parameter එකකට ~0.37 bits ඉතුරු වෙනවා. (Weights දෙපාරක් quantize කරනවා කියන එක නෙවෙයි. LoRA adapters BF16 වලම තියෙනවා, ඒවා train වෙන නිසා.) Paged optimizers: දිග sequences + gradient checkpointing නිසා හදිසි memory spikes එනවා. NVIDIA unified memory පාවිච්චි කරලා optimizer states CPU RAM එකට page out කරලා ඕනේ වෙලාවට ආපහු GPU එකට ගේනවා, OOM crash වළක්වනවා. ඒක single-GPU memory feature එකක්, multi-node communication එකට කිසි සම්බන්ධයක් නෑ.',
      ],
      analogy:
        'NF4 = ඔයාගේ class එකේ ළමයින්ගේ උස මනින්න පොල්ලක ලකුණු 16ක් විතරක් දාන්න පුළුවන්. ගොඩක් ළමයි 150-165 cm අතර නිසා ඒ කලාපයේ ලකුණු ළඟින් දානවා, 120 හෝ 190 වගේ දුර්ලභ උස් වලට ලකුණු එකක් දෙකක් ඇති. Paged optimizer = මේසය උඩ ඉඩ නැති වුණාම පොත් ටිකක් අල්මාරියට (CPU RAM) දාලා, ඕනේ වෙලාවට ආපහු ගන්න එක.',
      example:
        'Memory: 7B × 0.5 bytes (4 bits) ≈ 3.5 GB (8-bit නම් 7 GB, BF16 නම් 14 GB). 13B × 0.5 ≈ 6.5 GB, ඒ නිසා 24 GB GPU එකක LoRA adapters, ඒවායේ optimizer states, activations වලට ඉඩ ඉතුරුයි. 13B full fine-tuning: 13B × 16 bytes ≈ 208 GB (~200 GB), single 24 GB GPU එකකට කොහෙත්ම බෑ. Gradient accumulation activation memory අඩු කරනවා, ඒත් weights, gradients, optimizer memory අඩු කරන්නේ නෑ. ඒ නිසා 13B + 24 GB = QLoRA. Double quant: 7B × 0.37 bits ≈ 2.6 billion bits ≈ 0.32 GB ඉතුරුයි.',
      code: {
        lang: 'python',
        src: `import torch
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,                      # base model එක 4-bit වලින් load කරන්න
    bnb_4bit_quant_type="nf4",              # ගබඩා කරන format එක: NF4
    bnb_4bit_use_double_quant=True,         # scale constants ත් 8-bit කරනවා
    bnb_4bit_compute_dtype=torch.bfloat16,  # matmul එකට BF16 වලට dequantize
)`,
      },
      keyPoints: [
        'QLoRA = 4-bit NF4 frozen base + BF16 LoRA adapters. 65B on one 48 GB GPU.',
        'NF4 levels = normal distribution quantiles → uniform INT4 ට වඩා අඩු error. Storage-only.',
        'compute_dtype = matmul dtype. quant_type = storage format.',
        'Double quant = block constants quantize කිරීම (~0.37 bits/param ඉතුරුයි).',
        'Paged optimizers = unified memory හරහා spikes වලදී CPU RAM එකට page කිරීම.',
      ],
      terms: [
        { en: 'NF4 (4-bit NormalFloat)', si: 'Normal distribution එකට ගැළපෙන විදිහට levels 16ක් තියෙන 4-bit storage format එක.' },
        { en: 'Double Quantization', si: 'Per-block quantization constants නැවත 8-bit වලට quantize කිරීම.' },
        { en: 'Paged Optimizer', si: 'Optimizer states GPU සහ CPU memory අතර page කරලා OOM spikes වළක්වන ක්‍රමය.' },
        { en: 'Compute Dtype', si: 'Quantized weights ගණනය කිරීමට dequantize කරන dtype එක (උදා: BF16).' },
        { en: 'bitsandbytes', si: 'QLoRA වල 4-bit/8-bit quantization සපයන Python library එක.' },
      ],
    },

    // 10
    {
      id: 'other-peft',
      title: 'Other PEFT: Adapters, Prompt Tuning, Prefix Tuning, P-Tuning, IA3, BitFit',
      examRefs: ['TRN-018', 'TRN-019', 'TRN-020', 'TRN-021', 'TRN-106', 'TRN-107', 'TRN-108'],
      body: [
        'Adapter tuning (Houlsby et al.): හැම transformer block එකක් ඇතුළටම පොඩි bottleneck feed-forward module එකක් ඇතුළු කරනවා: down-projection (උදා: 4,096 → 64) → nonlinearity → up-projection (64 → 4,096), residual connection එකක් එක්ක. මුල් weights freeze. LoRA වගේ නෙවෙයි, adapters තියෙන weights වලට merge කරන්න බෑ, ඒ නිසා inference එකට පොඩි latency එකක් එකතු වෙනවා.',
        'Prompt tuning (soft prompting): Input sequence එකට ඉස්සරහින් continuous "virtual token" embeddings කිහිපයක් එකතු කරලා ඒවා විතරක් train කරනවා. ඒවා ඇත්ත වචන වලට අදාළ වෙන්න ඕනේ නෑ. මුළු model එකම freeze. (Natural-language wording එක අතින් වෙනස් කරලා හොඳ prompt එකක් හොයන එක prompt engineering, ඒකේ gradient training නෑ.) Parameters ගණන = virtual tokens × hidden size. Lester et al.: පොඩි models වල prompt tuning full fine-tuning එකට වඩා දුර්වලයි, ඒත් model එක ලොකු වෙද්දී ඒ පරතරය හැකිලිලා ~10B+ parameters වලදී ගොඩක් පොඩි වෙනවා. ඒ නිසා prompt tuning වඩාත්ම ආකර්ෂණීය ඉතා ලොකු frozen models වලට.',
        'Prefix tuning: Input එකට විතරක් නෙවෙයි, හැම transformer layer එකකම attention එකට trainable key/value prefix vectors එකතු කරනවා. ඒ නිසා prompt tuning එකට වඩා capacity වැඩියි. දෙකම continuous vectors, දෙකේම base weights freeze. P-tuning (NVIDIA NeMo support කරනවා): virtual-token embeddings කෙළින්ම ඉගෙන ගන්නේ නැතුව, පොඩි trainable prompt encoder එකකින් (LSTM හෝ MLP) generate කරනවා. මේ reparameterization එක optimization ස්ථාවර කරනවා. Training ඉවර වුණාම encoder outputs fixed virtual tokens විදිහට cache කරන්න පුළුවන්. Base model එක හැමවිටම freeze.',
        'IA3 (Infused Adapter by Inhibiting and Amplifying Inner Activations): Keys, values, සහ feed-forward activations element-wise rescale කරන පොඩි learned vectors ඉගෙන ගන්නවා (ගුණ කරනවා). Layer එකකට parameters ඉතා ටිකයි, LoRA ට වඩාත් අඩුයි. BitFit ත් ඉතා සැහැල්ලුයි, ඒත් ඒක අලුත් vectors එකතු කරන්නේ නෑ, තියෙන bias terms විතරක් train කරනවා.',
      ],
      analogy:
        'Model එක = Colombo-Kandy express train එකක්. Adapters = හැම මැදිරියකටම පොඩි අමතර කාමරයක් සවි කරනවා (ගමන ටිකක් මන්දගාමී වෙනවා). Prompt tuning = train එකේ ඉස්සරහට විතරක් ලේබල් තහඩු ටිකක් අලවනවා. Prefix tuning = හැම මැදිරියකම දොර ළඟ ලේබල් අලවනවා. P-tuning = ඒ ලේබල් අතින් අඳිනවා වෙනුවට පොඩි printer එකකින් (prompt encoder) print කරනවා. IA3 = හැම මැදිරියකම fan speed knob එක විතරක් වැඩි අඩු කරනවා.',
      example:
        'Prompt tuning: virtual tokens 20, hidden size 4,096 → 20 × 4,096 = 81,920 parameters. (80 tokens නම් 327,680.) LoRA r = 8 q/v 32 layers = 4,194,304 එක්ක සසඳන්න: prompt tuning ~50 ගුණයක් අඩුයි. Adapter එකක්: 4,096 → 64 → 4,096 = 4,096×64 + 64×4,096 = 524,288 weights (biases නැතුව) block එකකට.',
      keyPoints: [
        'Adapters = bottleneck FFN + residual. Merge කරන්න බෑ → latency.',
        'Prompt tuning = input එකේ soft virtual tokens. Params = tokens × hidden size.',
        'Prompt tuning gap එක ~10B+ models වලදී පොඩියි (Lester et al.).',
        'Prefix tuning = හැම layer එකකම K/V prefixes. P-tuning = prompt encoder (LSTM/MLP).',
        'IA3 = activations rescale කරන vectors. BitFit = biases විතරයි.',
      ],
      terms: [
        { en: 'Adapter (Houlsby)', si: 'Block එකක් ඇතුළේ down-project → nonlinearity → up-project කරන පොඩි trainable module එක.' },
        { en: 'Soft Prompt / Virtual Tokens', si: 'Train කරන continuous embedding vectors. ඇත්ත වචන නෙවෙයි.' },
        { en: 'Prefix Tuning', si: 'හැම layer එකකම attention keys/values වලට trainable prefixes එකතු කිරීම.' },
        { en: 'P-Tuning', si: 'Prompt encoder එකකින් virtual tokens generate කරන NeMo support කරන ක්‍රමය.' },
        { en: 'IA3', si: 'K, V, FFN activations element-wise scale කරන learned vectors පමණක් train කිරීම.' },
        { en: 'BitFit', si: 'Model එකේ bias terms විතරක් train කරන PEFT ක්‍රමය.' },
      ],
    },

    // 11
    {
      id: 'rlhf-ppo',
      title: 'RLHF Deep Dive: Reward Model (Bradley-Terry), PPO Clipping, KL, Reward Hacking, RLAIF, Rejection Sampling',
      examRefs: ['TRN-023', 'TRN-024', 'TRN-025', 'TRN-027', 'TRN-028', 'TRN-029', 'TRN-077', 'TRN-078', 'TRN-111', 'TRN-113', 'TRN-115', 'TRN-117', 'TRN-148', 'TRN-149'],
      body: [
        'Classic RLHF පිළිවෙල (InstructGPT): pretrained model → (1) SFT → (2) මිනිස්සු SFT model එකේ outputs rank කරලා, ඒ preferences වලින් reward model එකක් train කරනවා → (3) PPO එකෙන් policy (LLM) එක reward එකට optimize කරනවා. Reward model එක නැතුව PPO දුවන්න බෑ, මොකද PPO ට training signal එක දෙන්නේ ඒකයි. Reward model එක: pretrained හෝ SFT transformer එකක LM head එක අයින් කරලා, එක scalar එකක් output කරන linear head එකක් දානවා. Prompt + response එකේ අන්තිම token එකේ hidden state එක scalar reward එකකට map කරනවා. ඒක judge කෙනෙක් විතරයි, responses generate කරන්නේ policy එක.',
        'Reward model loss (Bradley-Terry): y_w (preferred) සහ y_l (rejected) යුගලයකට, P(y_w ≻ y_l) = σ(r_w − r_l). Loss = −log σ(r(x, y_w) − r(x, y_l)). σ = sigmoid, 0-1 අතරට හකුළන function එක. වැදගත් වෙන්නේ rewards දෙක අතර වෙනස (margin) විතරයි. ඒ නිසා දෙකටම එකම අංකයක් එකතු කළත් loss එක වෙනස් වෙන්නේ නෑ (shift-invariant). ±1 වගේ absolute targets වලට regression කරන්නේ නෑ.',
        'PPO: Reward model එකෙන් ලැබෙන rewards වලින් policy update කරනවා, ඒත් එක update එකකදී ඕනෑවට වඩා දුර නොයන්න. ρ = π_θ / π_old (අලුත් policy එක පරණ එකට වඩා action එකකට දෙන probability අනුපාතය). Objective = min(ρ·A, clip(ρ, 1−ε, 1+ε)·A), A = advantage (සාමාන්‍යයට වඩා කොච්චර හොඳද), ε ≈ 0.2. ρ එක 0.8-1.2 පරාසයෙන් එළියට ගියාම තවදුරටත් ලාභයක් නෑ, ඒ නිසා updates conservative, reuse කරන rollouts උඩත් ස්ථාවරයි. මේක reward clipping, gradient-norm clipping, හෝ response length truncation නෙවෙයි. PPO-based RLHF එකේ memory එකේ networks 4ක්: policy (actor), value model (critic, advantage ගණනයට), frozen reference model (KL එකට), reward model. ඒ නිසා memory බරයි. DPO (policy + reference විතරයි) සහ critic-free ක්‍රම ආවේ මේ නිසා. (Tokenizer එක network එකක් නෙවෙයි.)',
        'KL penalty: Reward එකෙන් β × KL(policy ‖ reference) අඩු කරනවා. Policy එක fluent SFT distribution එකෙන් ඕනෑවට වඩා ඈත් වෙලා reward model එකේ දුර්වලකම් exploit කරන එක නවත්වනවා. Reward model එක වෙනස් කරන්නේ නෑ, GPUs අඩු කරන්නෙත් නෑ. β = 0.5 එක්ක policy එක SFT එකට හරියටම සමානව තියෙනවා, reward වැඩි වෙන්නේ නෑ නම් → β අඩු කරන්න. ඒත් ඕනෑවට වඩා අඩු කළොත් reward hacking. Reward hacking ලක්ෂණය: reward model score එක දිගටම වැඩි වෙනවා, ඒත් මිනිස්සු බලද්දී උත්තර දිග, repetitive, sycophantic (මුඛස්තුති) වෙනවා. Policy එක reward model එකේ bias (උදා: දිග උත්තර වලට කැමැත්ත) exploit කරනවා. මේ වෙලාවට KL coefficient එක ඕනෑවට වඩා අඩු වෙන්න ඉඩ වැඩියි, වැඩි නෙවෙයි.',
        'Gao et al. (reward over-optimization): proxy reward model එකකට optimize කරද්දී "gold" reward model එකකින් මැනලා බැලුවා. KL දුර වැඩි වෙද්දී gold score එක මුලින් වැඩි වෙනවා, ඊට පස්සේ උපරිමයකට ඇවිත් අඩු වෙනවා, proxy score එක දිගටම වැඩි වෙද්දීත්. මේක RLHF වල Goodhart\'s law: "මිනුම ඉලක්කය වුණාම, ඒක හොඳ මිනුමක් නොවෙයි." ඒ නිසා early stopping සහ monitoring ඕනේ. Rejection sampling fine-tuning (Llama 2-Chat): prompt එකකට responses K ගණනක් sample කරලා, reward model එකෙන් ඉහළම score එක තියෙන එක තෝරලා, ඒ best samples උඩ fine-tune කරනවා (best-of-K + SFT, expert iteration වගේ). RLAIF: මිනිස් annotators වෙනුවට AI model එකක් (ලියපු principles අනුව) preference labels දෙනවා. Constitutional AI: model එක ලියපු principles ලැයිස්තුවක් ("constitution") අනුව තමන්ගේ outputs critique කරලා revise කරනවා (SFT data), ඊට පස්සේ AI judge එකක් ඒ principles අනුව preference labels දෙනවා (RLAIF). Perplexity එකකින් preference label කරන්න බෑ, ඒක උත්තරයක් ප්‍රයෝජනවත්ද කියලා මනින්නේ නෑ.',
      ],
      analogy:
        'Reward model = cricket selector කෙනෙක්. Policy = පිතිකරුවා. Selector ලකුණු දෙන්නේ "හය පහර" වලට විතරක් කැමති නම්, පිතිකරුවා හැම බෝලෙටම ගහන්න පටන් ගන්නවා (reward hacking), ඇත්තටම team එක දිනන්නේ නෑ. KL penalty = coach කියනවා "ඔයාගේ මුල් technique එකෙන් ඕනෑවට වඩා ඈත් වෙන්න එපා". PPO clipping = එක practice session එකකදී technique එක 20%කට වඩා වෙනස් කරන්න එපා කියන නීතිය.',
      example:
        'Bradley-Terry: r_w = 2.0, r_l = 0.5. Margin = 1.5. σ(1.5) ≈ 0.82. Loss = −ln(0.82) ≈ 0.20. දෙකටම 10 එකතු කළොත් (12.0, 10.5) margin එක තාමත් 1.5, loss එක එකමයි. PPO clip: ε = 0.2, A = +2 (හොඳ action එකක්). ρ = 1.5 නම් unclipped = 3.0, clipped = 1.2 × 2 = 2.4, min = 2.4. ρ එක 1.2 ට වඩා වැඩි කළාට ලාභයක් නෑ, ඒ නිසා policy එක එක පාරට ඕනෑවට වඩා පනින්නේ නෑ. Rejection sampling: prompt එකකට K = 8 responses, rewards [0.2, 0.9, 0.4, ...] → 0.9 එක SFT data එකට.',
      keyPoints: [
        'RLHF = SFT → reward model (preferences) → PPO.',
        'Reward model = LM + scalar head, loss = −log σ(r_w − r_l), shift-invariant.',
        'PPO clip(ρ, 1−ε, 1+ε), ε ≈ 0.2 → conservative updates. Networks 4ක්: actor, critic, reference, reward.',
        'KL වැඩි නම් policy හිරවෙනවා (β අඩු කරන්න). KL අඩු නම් reward hacking (දිග, sycophantic).',
        'Gold score එක peak වෙලා අඩු වෙනවා (Goodhart). Rejection sampling = best-of-K + SFT. RLAIF/CAI = AI feedback.',
      ],
      terms: [
        { en: 'Bradley-Terry Model', si: 'යුගලයකින් එකක් තෝරන සම්භාවිතාව σ(r_w − r_l) ලෙස ලියන preference model එක.' },
        { en: 'Policy / Actor', si: 'Train වෙන LLM එක. Responses generate කරන්නේ මේකයි.' },
        { en: 'Value Model / Critic', si: 'Advantage ගණනය කරන්න state එකක අපේක්ෂිත reward එක අනුමාන කරන PPO network එක.' },
        { en: 'Reference Model', si: 'KL penalty එකට anchor එක විදිහට තියාගන්න frozen SFT model එක.' },
        { en: 'Reward Hacking', si: 'Reward model එකේ quirks exploit කරලා ලකුණු ගන්න එක, ඇත්ත quality නැතුව.' },
        { en: 'Goodhart\'s Law', si: 'මිනුමක් ඉලක්කයක් වුණාම ඒක හොඳ මිනුමක් නොවී යන සංසිද්ධිය.' },
        { en: 'Rejection Sampling Fine-Tuning', si: 'Responses K ගණනකින් reward එක ඉහළම එක තෝරලා ඒ උඩ SFT කිරීම.' },
      ],
    },

    // 12
    {
      id: 'dpo-family',
      title: 'DPO, β, Implicit Reward, KTO, GRPO & NeMo-Aligner',
      examRefs: ['TRN-026', 'TRN-048', 'TRN-075', 'TRN-076', 'TRN-112', 'TRN-114', 'TRN-116'],
      body: [
        'DPO (Direct Preference Optimization) ප්‍රධාන අදහස: RLHF objective එක (reward එක maximize කරන්න, reference එකෙන් KL දුර සීමා කරන්න) chosen/rejected pairs උඩ සරල classification-style loss එකක් විදිහට නැවත ලියන්න පුළුවන්. ඒ නිසා වෙනම reward model training එකක්වත්, online PPO rollouts (RL sampling loop) එකක්වත් ඕනේ නෑ. Frozen reference model එකක් anchor එක විදිහට තියෙනවා. ඒත් preference data අනිවාර්යයෙන්ම ඕනේ.',
        'Data format: TRL DPOTrainer වගේ tools වලට record එකක් = {"prompt": ..., "chosen": ..., "rejected": ...}. එකම prompt එකට හොඳ එකක් සහ නරක එකක්. {"prompt", "completion", "reward": 0.82} වගේ single completion + scalar reward records ගැළපෙන්නේ reward-weighted හෝ RL ක්‍රම වලට, standard DPO එකට නෙවෙයි.',
        'Implicit reward: DPO එකේ trained policy එක reward එකක් රහසින් නිර්වචනය කරනවා: r(x, y) = β · log(π_θ(y|x) / π_ref(y|x)) (prompt එකට අදාළ constant එකක් හැර). ඒ කියන්නේ "reference model එකට වඩා policy එක මේ උත්තරයට කොච්චර වැඩියෙන් probability දෙනවද". DPO loss = −log σ(β·[chosen log-ratio − rejected log-ratio]). log π_θ විතරක් ගත්තොත් reference anchor එක නැති වෙලා responses දෙක සසඳන්නේ නෑ. β (සාමාන්‍යයෙන් ~0.1) කියන්නේ implicit KL strength එක: β වැඩි නම් policy එක reference එකට ළඟින් තියෙනවා, β අඩු නම් preferences වලට ගැළපෙන්න වැඩිපුර ඈත් වෙන්න පුළුවන්. Learning rate, LoRA rank, chosen/rejected ratio වගේ දේවල් β නෙවෙයි.',
        'KTO (Kahneman-Tversky Optimization): ඔයාට තියෙන්නේ thumbs-up / thumbs-down labels විතරක් නම්, එකම prompt එකට pairs නැත්නම්, KTO එක ඒ unpaired binary labels වලින් prospect theory එකෙන් ආභාසය ගත්ත loss එකකින් ඉගෙන ගන්නවා. Standard DPO සහ Bradley-Terry reward modeling දෙකටම pairs ඕනේ. GRPO (Group Relative Policy Optimization, DeepSeek reasoning models): learned value model (critic) එක අයින් කරනවා. එකම prompt එකට outputs group එකක් sample කරලා, හැම output එකකම reward එක group mean එකෙන් අඩු කරලා std එකෙන් බෙදලා advantage එක ගණනය කරනවා. Critic එකේ memory ඉතුරුයි. තාමත් rewards පාවිච්චි කරනවා, බොහෝ විට math/code වල answer correctness වගේ verifiable rule-based rewards. NeMo-Aligner: reward model training, PPO-based RLHF, DPO, SteerLM වගේ alignment ක්‍රම NeMo/Megatron උඩ distributed විදිහට දුවන්න හදපු NVIDIA toolkit එක. NeMo Guardrails runtime rules විතරයි, weights වෙනස් කරන්නේ නෑ.',
      ],
      analogy:
        'RLHF = කෑම රස බලන machine එකක් (reward model) හදලා, chef ඒ machine එකට කෑම හදනවා. DPO = machine එක නැතුව, "මේ කොත්තු එක අර කොත්තු එකට වඩා හොඳයි" කියන යුගල වලින් chef කෙළින්ම ඉගෙන ගන්නවා, ඒත් අම්මාගේ මුල් recipe එකෙන් (reference) ඕනෑවට වඩා ඈත් නොවී. β = අම්මාගේ recipe එකට කොච්චර තදින් බැඳිලාද කියන එක. KTO = යුගල නෑ, customer comment card එකේ thumbs-up/down විතරයි. GRPO = class එකේ ළමයි 4 දෙනාගේ ලකුණු වල සාමාන්‍යයට වඩා ඉහළද පහළද කියලා බලන එක, වෙනම teacher කෙනෙක් (critic) නැතුව.',
      example:
        'DPO: β = 0.1. Chosen log-ratio (log π_θ − log π_ref) = +2, rejected = −1. Implicit rewards: 0.1 × 2 = 0.2 සහ 0.1 × (−1) = −0.1. Margin = 0.3. σ(0.3) ≈ 0.574. Loss = −ln(0.574) ≈ 0.56. Training එකෙන් margin වැඩි කරලා loss අඩු කරනවා. GRPO: math ප්‍රශ්නයකට outputs 4ක්, rewards [1, 0, 1, 0] (හරි = 1). Mean = 0.5, std = 0.5. Advantages = (1 − 0.5)/0.5 = +1 හරි ඒවට, (0 − 0.5)/0.5 = −1 වැරදි ඒවට.',
      keyPoints: [
        'DPO = reward model සහ RL loop නැතුව preference pairs උඩ කෙළින්ම optimize කිරීම.',
        'DPO record = prompt / chosen / rejected.',
        'Implicit reward = β · log(π_θ / π_ref). β ≈ 0.1 = KL strength.',
        'KTO = unpaired thumbs-up/down. GRPO = critic නෑ, group-normalized rewards.',
        'NeMo-Aligner = RLHF (PPO), DPO, SteerLM, reward models at scale.',
      ],
      terms: [
        { en: 'DPO', si: 'Direct Preference Optimization: preference pairs උඩ policy එක කෙළින්ම train කරන ක්‍රමය.' },
        { en: 'Implicit Reward', si: 'DPO policy එකෙන් ව්‍යංගයෙන් නිර්වචනය වෙන reward එක: β log(π_θ/π_ref).' },
        { en: 'β (DPO)', si: 'Policy එක reference එකට කොච්චර තදින් බැඳෙනවද කියන implicit KL coefficient එක.' },
        { en: 'KTO', si: 'Unpaired desirable/undesirable labels වලින් align කරන prospect-theory ක්‍රමය.' },
        { en: 'GRPO', si: 'Value model නැතුව group එකක rewards normalize කරලා advantage හදන RL ක්‍රමය.' },
        { en: 'NeMo-Aligner', si: 'PPO RLHF, DPO, SteerLM වගේ alignment ක්‍රම scale එකේ දුවන NVIDIA toolkit එක.' },
        { en: 'SteerLM', si: 'Attributes (helpfulness වගේ) අනුව outputs පාලනය කරන්න පුළුවන් NVIDIA alignment ක්‍රමය.' },
      ],
    },

    // 13
    {
      id: 'lr-schedules-stability',
      title: 'LR Warmup, Cosine & WSD Schedules, Gradient Clipping, Loss Spikes, Z-Loss, Checkpoints',
      examRefs: ['TRN-038', 'TRN-039', 'TRN-040', 'TRN-051', 'TRN-068', 'TRN-069', 'TRN-093', 'TRN-130', 'TRN-131'],
      body: [
        'Warmup: Training මුලදී Adam optimizer එකේ moment estimates (m, v) noisy, gradients ලොකුයි. ඒ වෙලාවේ peak LR එකෙන්ම (උදා: 3e-4) පටන් ගත්තොත් පළමු steps සිය ගණනේදීම divergence වෙන්න පුළුවන්. Warmup = LR එක 0 ළඟ ඉඳන් peak දක්වා පළමු steps ~1-2k තුළ linear විදිහට වැඩි කරන එක. Warmup_ratio = මුළු steps වලින් warmup එකට යන ප්‍රතිශතය. Training අගට LR අඩු කරන්නේ decay schedule එක, warmup නෙවෙයි. Weight decay වැඩි කිරීම හෝ end decay අයින් කිරීම early divergence එකට විසඳුම නෙවෙයි.',
        'Cosine decay: scheduler: CosineAnnealing, min_lr: 1e-5 නම් warmup එකෙන් පස්සේ LR එක peak ඉඳන් 1e-5 දක්වා අඩ cosine wave එකක හැඩයට අඩු වෙනවා: මුලදී හෙමින්, මැද වේගයෙන්, අගට ආයේ හෙමින්, අන්තිමට minimum එකේ නවතිනවා. එක පාරක් විතරයි අඩු වෙන්නේ. (Restarts එක්ක cycle කරන එක SGDR, වෙනම variant එකක්.) WSD (Warmup-Stable-Decay): cosine එක fixed total step count එකකට බැඳිලා නිසා පස්සේ tokens එකතු කරලා run එක දිගු කරන්න අමාරුයි. WSD එකේ warmup එකෙන් පස්සේ LR එක දිගටම constant (stable) තියාගන්නවා. Final model එකක් ඕනේ වුණාම විතරක් කෙටි decay (cooldown) phase එකක් දුවනවා. Stable-phase checkpoint ඕනෑම එකකින් run එක දිගටම කරගෙන යන්න පුළුවන්. Decay නැතුව constant LR විතරක් නම් loss එක ඉහළින් නවතිනවා.',
        'Gradient clipping: torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0). සියලු gradients එකට ගත්තම total norm (දිග) එක 1.0 ට වඩා වැඩි නම්, හැම gradient එකක්ම එකම අනුපාතයෙන් පොඩි කරලා norm එක 1.0 කරනවා. Exploding gradients නිසා එන ලොකු updates සහ loss spikes වළක්වනවා. Clipping එක gradients පොඩි කරනවා විතරයි, ඒ නිසා vanishing gradients (දැනටමත් පොඩි) වලට උදව්වක් නෑ. Overfitting හෝ memory එකට ත් සම්බන්ධ නෑ.',
        'Loss spike: Pretraining මැද loss එක 2.1 ඉඳන් 7.5 ට හදිසියේ පැනලා ආපහු එන්නේ නැත්නම් ඒක divergence. බලාගෙන හිටියොත් compute නාස්තියි. PaLM, OPT reports වල සම්මත ක්‍රමය: spike එකට කලින් checkpoint එකකට rollback කරලා, spike එක වටේ data batches skip කරලා, අවශ්‍ය නම් LR එක අඩු කරලා ආයේ දුවන එක. Z-loss (PaLM): auxiliary loss ≈ 1e-4 · log²Z, Z = vocabulary එක පුරා softmax normalizer එක. log Z එක 0 ළඟට තල්ලු කරලා output logits ලොකු magnitudes වලට ඇදිලා යන එක නවත්වනවා, විශේෂයෙන් low precision වල numerical stability වැඩි කරනවා. MoE load balancing loss එක වෙනස්, ඒක router probabilities උඩ වැඩ කරන්නේ.',
        'Training checkpoints: දිගු jobs වල checkpoints නිතර save කරන්නේ node failure එකකින් පස්සේ resume කරන්නත්, intermediate models evaluate කරන්න හෝ rollback කරන්නත්. Checkpoint එකක weights විතරක් නෙවෙයි, optimizer state (Adam m, v), LR scheduler state, step count, data loader position (සහ RNG state) save කරනවා. එහෙම නැත්නම් resume කළාම Adam statistics නැති වෙලා, LR schedule එක මුල ඉඳන් පටන් ගන්නවා. මේක gradient (activation) checkpointing එකට කිසිම සම්බන්ධයක් නෑ: ඒක memory technique එකක්, නම විතරයි සමාන.',
      ],
      analogy:
        'Warmup = උදේ පාන්දර car එක start කරලා engine එක රත් වෙනකම් හෙමින් යන එක, Galle Road එකේ කෙළින්ම 100 km/h යන්නේ නෑ. Cosine decay = ගමනාන්තයට ළං වෙද්දී ටික ටික brake කරන එක. WSD = expressway එකේ එකම වේගයෙන් යනවා, exit එකක් ගන්න ඕනේ වුණාම විතරක් slow කරනවා. ඕනේ නම් exit නොගෙන දිගටම යන්න පුළුවන්. Gradient clipping = speed governor එකක්. Checkpoint = video game එකක save point එක: මැරුණොත් මුල ඉඳන් නෙවෙයි, අන්තිම save එකෙන් පටන් ගන්නවා.',
      example:
        'Warmup: මුළු steps 50,000, warmup_ratio = 0.02 → 0.02 × 50,000 = 1,000 warmup steps (0.2 ලෙස වැරදියට කියවුවොත් 10,000). Peak LR 3e-4 නම් step 500 දී LR ≈ 1.5e-4. Clipping: total grad norm = 5.0, max_norm = 1.0 → හැම gradient එකක්ම 1.0 ÷ 5.0 = 0.2 න් ගුණ කරනවා. Norm 0.6 නම් කිසි වෙනසක් නෑ. Loss spike: step 120,000 දී spike එකක්. Step 118,000 checkpoint එකට ගිහින්, batches 118,000-120,500 skip කරලා, LR 10%කින් අඩු කරලා ආයේ දුවනවා.',
      keyPoints: [
        'Warmup = මුල් steps වල අස්ථාවර updates වළක්වනවා. Warmup steps = ratio × total steps.',
        'Cosine = peak → min_lr එක පාරක්. WSD = stable phase + ඕනේ වෙලාවට කෙටි decay.',
        'clip_grad_norm_ = exploding gradients වලට. Vanishing වලට උදව් නෑ.',
        'Non-recovering spike → checkpoint rollback + bad batches skip + LR අඩු කිරීම.',
        'Z-loss = logits magnitudes පාලනය. Training checkpoint = weights + optimizer + scheduler state.',
      ],
      terms: [
        { en: 'Warmup', si: 'Training මුලදී LR එක ටික ටික peak එකට වැඩි කිරීම.' },
        { en: 'Cosine Annealing', si: 'LR එක අඩ cosine wave එකක හැඩයට min_lr දක්වා අඩු කිරීම.' },
        { en: 'WSD Schedule', si: 'Warmup → Stable (constant) → Decay (කෙටි cooldown) කියන LR schedule එක.' },
        { en: 'Gradient Clipping', si: 'Total gradient norm එක threshold එකකට වඩා වැඩි නම් gradients scale down කිරීම.' },
        { en: 'Z-Loss', si: 'Softmax normalizer එකේ log එක 0 ළඟ තියාගන්න එකතු කරන පොඩි auxiliary loss එක.' },
        { en: 'Training Checkpoint', si: 'Resume කරන්න ඕනේ weights, optimizer state, scheduler state, step එක එකට save කිරීම.' },
      ],
    },

    // 14
    {
      id: 'mixed-precision-fp8',
      title: 'Mixed Precision: FP16 Loss Scaling, GradScaler, BF16 Autocast, FP8 & Transformer Engine',
      examRefs: ['TRN-032', 'TRN-033', 'TRN-034', 'TRN-035', 'TRN-067', 'TRN-090', 'TRN-091', 'TRN-092', 'TRN-118', 'TRN-119'],
      body: [
        'Mixed precision training: matmuls සහ activations වගේ ගොඩක් ගණනය FP16 හෝ BF16 (16-bit) වලින් කරනවා, Tensor Cores පාවිච්චි කරන්නත් memory ඉතුරු කරන්නත්. ඒත් numerically සංවේදී කොටස් (FP32 master weights, සමහර reductions) FP32 වල තියාගන්නවා. Layer එකෙන් layer එකට LR වෙනස් කරන එක හෝ INT8 weights මේකට සම්බන්ධ නෑ.',
        'FP16 = 1 sign bit, 5 exponent bits, 10 mantissa bits. උපරිම අගය ~65,504. Exponent range එක පටු නිසා ගොඩක් පොඩි gradient අගයන් underflow වෙලා 0 වෙනවා. Loss scaling: backprop එකට කලින් loss එක ලොකු අංකයකින් (scale factor) ගුණ කරනවා, එතකොට gradients FP16 range එක ඇතුළට එනවා. Optimizer step එකට කලින් ආයේ unscale කරනවා. ප්‍රශ්නය පොඩි අගයන් (underflow). 1.0 ට වැඩි loss එකක් FP16 වලට ප්‍රශ්නයක් නෙවෙයි. BF16 = 1 sign, 8 exponent bits (FP32 එකේ range එකමයි), 7 mantissa bits (FP16 ට වඩා අඩු precision). Memory එකම (දෙකම 16-bit). BF16 එකට loss scaling සාමාන්‍යයෙන් ඕනේ නෑ. A100/H100 වල BF16 native support තියෙනවා. ඒ නිසා FP16 run එකක loss = nan සහ overflow warnings එනවා නම් හොඳම විසඳුම BF16 එකට මාරු වෙන එක. LR වැඩි කිරීම හෝ clipping අයින් කිරීම තවත් නරක් කරනවා.',
        'GradScaler (FP16 AMP): scaler.scale(loss).backward() → scaler.unscale_(optimizer) → clip_grad_norm_ → scaler.step(optimizer) → scaler.update(). Backward එකෙන් පස්සේ gradients තාම scale factor එකෙන් ගුණ වෙලා. Unscale නොකර clip කළොත් threshold එක apply වෙන්නේ "පිම්බුණු" අගයන් වලට. ඒ නිසා clip කරන්න කලින් unscale_ අනිවාර්යයි. Dynamic loss scaling: scaler.step() gradients වල inf/NaN දැක්කොත් ඒ optimizer step එක skip කරනවා, scaler.update() scale එක අඩු කරනවා (සාමාන්‍යයෙන් අඩකින්). Clean steps දිගු පෙළක් (default 2,000) ගියාම scale එක ආයේ වැඩි කරනවා. Exception එකක් දාන්නේ නෑ, checkpoint reload කරන්නේ නෑ. කලාතුරකින් skip වෙන එක සාමාන්‍යයි, නිතරම skip වෙනවා නම් ගැඹුරු ප්‍රශ්නයක්. BF16 autocast (torch.autocast("cuda", dtype=torch.bfloat16)) එකට GradScaler සාමාන්‍යයෙන් ඕනේ නෑ, මොකද BF16 range එක FP32 වගේ නිසා underflow කලාතුරකින්.',
        'FP8 training: NVIDIA Transformer Engine (TE) library එක Hopper (H100) FP8 Tensor Cores පාවිච්චි කරලා transformer layers FP8 වලින් train කරනවා, NeMo සහ Megatron-LM මේක පාවිච්චි කරනවා. (TensorRT inference optimizer එකක්, training loops දුවන්නේ නෑ.) FP8 formats දෙකක්: E4M3 (exponent 4, mantissa 3, max ~448, precision වැඩියි) සහ E5M2 (exponent 5, mantissa 2, max ~57,344, range වැඩියි). TE "hybrid" recipe: forward pass එකේ activations සහ weights = E4M3, backward gradients = E5M2. (මේ දෙක මාරු කරන එක පොදු වැරැද්ද.) Delayed scaling: FP8 range එක ගොඩක් පටු නිසා හැම tensor එකකටම scale factor එකක් ඕනේ. TE එක කලින් iterations වල absolute-maximum (amax) අගයන් history window එකක් තියාගෙන, ඒකෙන් ඊළඟ scale එක ගණනය කරනවා. Cast කරන්න කලින් tensor එක ආයේ scan කරන්න ඕනේ නෑ. Current tensor එකේ exact max එකෙන්ම ගණනය කරන "current scaling" වඩා නිවැරදියි, ඒත් tensor එකකට අමතර reduction එකක් වැය වෙනවා.',
      ],
      analogy:
        'FP16 = පොඩි මිනුම් පොල්ලක්, ගොඩක් සියුම් ලකුණු තියෙනවා, ඒත් දිග කෙටියි. ඉතා පොඩි දේවල් (gradients) පොල්ලේ පළමු ලකුණටත් වඩා පොඩි නිසා "0" කියලා කියවෙනවා. Loss scaling = ඒ පොඩි දේ microscope එකකින් 1,000 ගුණයක් ලොකු කරලා මනිනවා, පස්සේ ආයේ 1,000 න් බෙදනවා. BF16 = ලකුණු ටිකක් දළයි, ඒත් පොල්ල ගොඩක් දිගයි, ඒ නිසා microscope එකක් ඕනේ නෑ. FP8 E4M3 vs E5M2 = ඉදිරි ගමනට (forward) සියුම් පොල්ල, ආපසු ගමනට (gradients, අගයන් ගොඩක් විසිරිලා) දිග පොල්ල.',
      example:
        'Gradient අගයක් 1e-8 කියමු. FP16 එකේ පොඩිම subnormal අගය ~6e-8, ඒ නිසා 1e-8 → 0 (underflow). Loss scale 1,024 න් ගුණ කළාම gradient ≈ 1e-5, FP16 වල හොඳට පේනවා. Optimizer step එකට කලින් 1,024 න් බෙදලා ආපහු 1e-8 (FP32 master weights වල). Dynamic scaling: scale 65,536 → inf දැක්කා → step skip, scale 32,768. Clean steps 2,000කට පස්සේ → 65,536 ආයේ. FP8: activation එකක amax history එකේ උපරිමය 10 නම්, E4M3 max 448 නිසා scale ≈ 448 ÷ 10 ≈ 45 (ප්‍රායෝගිකව margin එකකුත් එක්ක).',
      code: {
        lang: 'python',
        src: `scaler = torch.cuda.amp.GradScaler()       # FP16 සඳහා විතරයි
for batch in loader:
    with torch.autocast("cuda", dtype=torch.float16):
        loss = model(**batch).loss
    scaler.scale(loss).backward()            # loss එක ලොකු කරලා backward
    scaler.unscale_(optimizer)               # clip කරන්න කලින් ඇත්ත අගයට
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer)                   # inf/NaN නම් මේ step එක skip
    scaler.update()                          # scale එක අඩු/වැඩි කරනවා
    optimizer.zero_grad()
# BF16 නම්: dtype=torch.bfloat16, GradScaler සාමාන්‍යයෙන් ඕනේ නෑ`,
      },
      keyPoints: [
        'Mixed precision = 16-bit math + FP32 master weights.',
        'FP16: 5 exp / 10 mantissa, max ~65,504 → underflow → loss scaling. BF16: 8 exp / 7 mantissa → scaling ඕනේ නෑ.',
        'FP16 NaN/overflow on A100 → BF16 එකට මාරු වෙන්න.',
        'GradScaler: clip කරන්න කලින් unscale_. inf/NaN → step skip + scale අඩු.',
        'FP8 (Transformer Engine): forward E4M3, gradients E5M2. Delayed scaling = amax history.',
      ],
      terms: [
        { en: 'Loss Scaling', si: 'FP16 underflow වළක්වන්න backprop එකට කලින් loss එක ලොකු අංකයකින් ගුණ කිරීම.' },
        { en: 'GradScaler', si: 'PyTorch AMP වල dynamic loss scaling කරන class එක.' },
        { en: 'Master Weights', si: 'Optimizer update කරන FP32 weights copy එක.' },
        { en: 'BF16 (bfloat16)', si: 'FP32 range එක (8 exponent bits) තියෙන, precision අඩු 16-bit format එක.' },
        { en: 'E4M3 / E5M2', si: 'FP8 formats දෙක: E4M3 = precision (max 448), E5M2 = range (max 57,344).' },
        { en: 'Transformer Engine', si: 'Hopper GPUs මත FP8 training කරන NVIDIA library එක, automatic scaling එක්ක.' },
        { en: 'amax', si: 'Tensor එකක absolute maximum අගය. FP8 scale factor ගණනය කරන්න පාවිච්චි කරනවා.' },
      ],
    },

    // 15
    {
      id: 'batch-accumulation-recompute',
      title: 'Effective Batch Size, Gradient Accumulation, Loss Normalization & Activation Checkpointing',
      examRefs: ['TRN-036', 'TRN-037', 'TRN-058', 'TRN-059', 'TRN-066', 'TRN-089', 'TRN-129', 'TRN-146'],
      body: [
        'Gradient accumulation: GPU එකට ගැලපෙන්නේ micro-batch 2ක් විතරයි, ඒත් recipe එක ලොකු batch එකක් ඉල්ලනවා. විසඳුම: forward/backward passes කිහිපයක් දුවලා, gradients .grad එකේ එකතු කරගෙන (sum), අන්තිමට එක optimizer step එකක් ගන්නවා. Memory වැඩි නොකර ලොකු batch එකක් simulate කරනවා. Effective (global) batch = micro-batch × accumulation steps × data-parallel GPUs. LLM batch sizes බොහෝ විට tokens වලින් කියනවා: tokens per step = global batch × sequence length.',
        'Accumulation එකේදී loss එක accum_steps න් බෙදන්නේ ඇයි? loss.backward() gradients .grad එකට එකතු (add) කරනවා. බෙදුවේ නැත්නම් accumulated gradient එක average එකක් නෙවෙයි, accum_steps එක්ක වැඩි වෙන sum එකක්. එතකොට effective LR එකත් ඒ ගුණයෙන් වැඩි වෙනවා. බෙදුවාම summed gradients = ලොකු batch එකේ average gradient එක. මේකෙන් memory අඩු වෙන්නේ නෑ, warmup එකක් වෙන්නෙත් නෑ, FP16 underflow එකට උදව් වෙන්නෙත් නෑ (අගයන් පොඩි කරන නිසා underflow ටිකක් නරක් වෙන්නත් පුළුවන්). Token-level normalization bug: SFT trainer එකක් හැම micro-batch එකක් ඇතුළේම per-token loss එක average කරලා, ඊට පස්සේ accumulation steps හරහා ආයේ average කරනවා නම්, micro-batches වල non-padded response tokens ගණන වෙනස් වෙද්දී "mean of means" එක global token mean එකට සමාන නෑ. කෙටි micro-batches වල tokens වලට අසාධාරණ බරක්. නිවැරදි ක්‍රමය: accumulate කරපු සියලු micro-batches වල token losses එකතු කරලා, මුළු token ගණනින් බෙදන එක. 2024 දී ජනප්‍රිය trainers වල මේ bug එක හොයාගෙන fix කළා.',
        'Gradient (activation) checkpointing: Backward pass එකට forward pass එකේ activations ඕනේ. සාමාන්‍යයෙන් ඒ හැම එකක්ම memory එකේ තියාගන්නවා. Checkpointing එකේදී සමහර activations විතරක් (උදා: layer boundaries) save කරලා, අනිත් ඒවා backward එකේදී ඕනේ වුණාම ආයේ ගණනය (recompute) කරනවා. Activation memory අඩුයි, ඒත් compute වැඩියි. ප්‍රතිඵල ගණිතමය වශයෙන් එකමයි, accuracy එකට බලපෑමක් නෑ. Batch size එක වෙනස් කරන්නෙත් නෑ (ඒක accumulation). model.gradient_checkpointing_enable() කළාම steps 20-35%ක් විතර මන්දගාමී වෙනවා. ඒක memory-for-compute trade එකක්, කවදාවත් වේගවත් කරන්නේ නෑ.',
        'Selective activation recomputation (Megatron-LM): Full checkpointing මුළු layers recompute කරනවා. Selective එකේ recompute කරන්නේ memory ගොඩක් ගන්න ඒත් ගණනය කරන්න ලාභ attention කොටස් විතරයි (softmax outputs, attention dropout masks, attention scores). Attention score tensors sequence length එකේ වර්ගයට (seq²) වැඩි වෙනවා, ඒත් ඒවා ආයේ හදන්න FLOPs ටිකයි. ඒ නිසා memory ගොඩක් ඉතුරු වෙනවා, compute overhead එක පොඩියි. NVMe offload හෝ FP8 storage නෙවෙයි.',
      ],
      analogy:
        'Gradient accumulation = Keells එකේ trolley එක පොඩි නිසා බඩු 4 පාරකට ගෙනියනවා, ඒත් bill එක ගහන්නේ අන්තිමට එක පාරයි. Loss එක accum_steps න් බෙදීම = පංතියේ කණ්ඩායම් 4ක ලකුණු එකතු කරලා සාමාන්‍යය ගන්න 4 න් බෙදීම, නැත්නම් "සාමාන්‍යය" 4 ගුණයක් ලොකු වෙනවා. Activation checkpointing = විභාගයට notes ඔක්කොම ලියාගන්නේ නැතුව, පරිච්ඡේද ශීර්ෂ විතරක් ලියාගෙන, ඕනේ වුණාම පොතෙන් ආයේ ගණනය කරන එක. බෑග් එක සැහැල්ලුයි, ඒත් වෙලාව ටිකක් යනවා.',
      example:
        'Effective batch: GPUs 8, micro-batch 4, gradient_accumulation_steps 8 → 4 × 8 × 8 = 256 sequences per optimizer step. (32 = factors දෙකක් විතරයි.) Tokens: 256 × 4,096 = 1,048,576 ≈ 1.05M tokens per step. (4.2M වෙන්න seq 16K හෝ batch 1,024 ඕනේ.) Checkpointing cost: forward = 1 unit, backward ≈ 2 units → step = 3. Recompute = තව forward 1 → 4. 4 ÷ 3 ≈ 1.33, ඒ කියන්නේ ~33% මන්දගාමී. Normalization bug: micro-batch A response tokens 10, avg loss 2.0. B tokens 100, avg loss 1.0. Mean of means = (2.0 + 1.0) ÷ 2 = 1.5. නිවැරදි token mean = (10×2.0 + 100×1.0) ÷ 110 = 120 ÷ 110 ≈ 1.09. A ගේ tokens 10ට B ගේ tokens 100ට සමාන බරක් ලැබිලා.',
      code: {
        lang: 'python',
        src: `accum_steps = 8
for i, batch in enumerate(loader):
    loss = model(**batch).loss / accum_steps  # sum එක average එකක් කරන්න
    loss.backward()                           # gradients .grad එකට එකතු වෙනවා
    if (i + 1) % accum_steps == 0:
        optimizer.step()                      # micro-batches 8කට එක update එකයි
        optimizer.zero_grad()                 # ඊළඟ round එකට .grad හිස් කරනවා`,
      },
      keyPoints: [
        'Global batch = micro-batch × accumulation steps × DP GPUs. Tokens/step = batch × seq len.',
        'Accumulation = memory නැතුව ලොකු batch. Loss ÷ accum_steps = average gradient.',
        'Variable token counts → token losses sum ÷ total tokens (mean of means වැරදියි).',
        'Activation checkpointing = activation memory ↓, compute ↑ (~33%, 20-35% slower). Accuracy එකමයි.',
        'Selective recompute = attention softmax/dropout විතරක් recompute → memory ගොඩක් ඉතුරු, overhead පොඩියි.',
      ],
      terms: [
        { en: 'Micro-Batch', si: 'එක forward/backward pass එකකට එක GPU එකකට යන examples ගණන.' },
        { en: 'Gradient Accumulation', si: 'Micro-batches කිහිපයක gradients එකතු කරලා එක optimizer step එකක් ගැනීම.' },
        { en: 'Global / Effective Batch Size', si: 'එක optimizer step එකකට දායක වෙන මුළු examples ගණන.' },
        { en: 'Activation (Gradient) Checkpointing', si: 'Activations සමහරක් විතරක් save කරලා අනිත් ඒවා backward එකේදී recompute කිරීම.' },
        { en: 'Selective Activation Recomputation', si: 'Memory ගොඩක් ගන්න, ලාභෙට ගණනය කරන්න පුළුවන් attention activations විතරක් recompute කිරීම.' },
      ],
    },

    // 16
    {
      id: 'memory-zero-data-parallel',
      title: 'Training Memory (16 Bytes/Param), Data Parallelism, All-Reduce, NCCL, ZeRO Stages & FSDP',
      examRefs: ['TRN-041', 'TRN-044', 'TRN-045', 'TRN-060', 'TRN-062', 'TRN-063', 'TRN-064', 'TRN-065', 'TRN-087', 'TRN-120', 'TRN-121', 'TRN-122', 'TRN-128'],
      body: [
        '16 bytes per parameter rule (mixed precision + Adam, activations නැතුව): BF16/FP16 weights 2 + 16-bit gradients 2 + FP32 master weights 4 + Adam first moment m 4 + second moment v 4 = 16 bytes. ඒකෙන් 12 bytes (master + m + v) FP32 optimizer කොටස. ZeRO stage 1 shard කරන්නේ මේ 12 bytes. Adam states (m, v) විතරක් parameter එකකට 8 bytes, බොහෝ විට weights වලට වඩා වැඩියි. Activations මේ rule එකට ඇතුළත් නෑ, KV cache කියන්නේ inference structure එකක් (training memory නෙවෙයි).',
        'Data parallelism (DDP): හැම GPU එකකම model එකේ සම්පූර්ණ replica එකක්, batch එකේ වෙනම slice එකක්. හැම GPU එකක්ම තමන්ගේ data වලින් gradients ගණනය කරලා, all-reduce එකකින් gradients average කරනවා, ඒ නිසා හැම copy එකක්ම එකම update එක කරලා identical වෙලා තියෙනවා. PyTorch DDP මේ all-reduce එක buckets වලින් backward එකත් එක්ක overlap කරනවා. Loss broadcast කිරීම, activations all-to-all (ඒක MoE routing), optimizer states rank 0 ට gather කිරීම මේකට අදාළ නෑ. NCCL (NVIDIA Collective Communications Library): NVLink, PCIe, InfiniBand හරහා topology-aware all-reduce, all-gather, reduce-scatter, broadcast වගේ collectives සපයන library එක. PyTorch distributed වල default GPU backend එක. (Inference engines compile කරන්නේ TensorRT, jobs schedule කරන්නේ Kubernetes/Slurm.)',
        'Ring all-reduce: GPUs N ගණනක් වළල්ලක් (ring) විදිහට. Reduce-scatter එකක් (හැම GPU එකක්ම buffer එකේ 1/N කොටසක් sum කරගන්නවා) + all-gather එකක් (ඒ කොටස් හැමෝටම බෙදනවා). හැම phase එකකම GPU එකක් (N−1)/N × S data යවනවා. ඒ නිසා මුළු = 2 × (N−1)/N × S. N වැඩි වුණත් GPU එකකට යවන data ප්‍රමාණය ~2S ළඟ ස්ථාවරයි. (S × log₂N කියන්නේ tree algorithms වල step count අදහසක්.)',
        'ZeRO / FSDP: Plain DP එකේ හැම GPU එකකම weights, gradients, Adam states සම්පූර්ණ copy එකක් (redundancy). ZeRO ඒවා DP ranks අතර shard කරලා, ඕනේ මොහොතේ කොටස් gather කරනවා. Stage 1 = optimizer states shard. Stage 2 = + gradients shard (all-reduce වෙනුවට reduce-scatter, communication volume සාමාන්‍ය DP වගේමයි). Stage 3 = + parameters shard. ZeRO-Offload = states CPU memory එකට යවන එක (stage එකක් නෙවෙයි). PyTorch FSDP: FULL_SHARD ≈ ZeRO-3 (params, grads, optimizer states shard කරලා, හැම unit එකකම params forward/backward වලට just-in-time gather කරනවා), SHARD_GRAD_OP ≈ ZeRO-2, NO_SHARD ≈ DDP. Activation recomputation වෙනම technique එකක්, ZeRO එකට අමතරව පාවිච්චි කරන්න පුළුවන්. ZeRO-3 communication: DP all-reduce ≈ 2Ψ (Ψ = model size) per GPU. ZeRO-3 = forward all-gather Ψ + backward all-gather Ψ + gradients reduce-scatter Ψ = 3Ψ, ඒ කියන්නේ ~1.5×. GPU ගණනත් එක්ක linear විදිහට වැඩි වෙන්නේ නෑ.',
      ],
      analogy:
        'Data parallelism = විභාග පත්‍ර 8,000ක් ලකුණු දාන්න teachers 8 දෙනෙක්, හැමෝටම එකම marking scheme එක (model replica), පත්‍ර 1,000 බැගින්. දවස අගට හැමෝම "marking scheme එකේ මේ තැන වෙනස් කරමු" කියන යෝජනා සාමාන්‍ය කරලා (all-reduce) එකම විදිහට update කරනවා. ZeRO = marking scheme එකේ පිටු 8 හැමෝටම බෙදලා, එක්කෙනෙක් ළඟ පිටුවක් විතරයි. ඕනේ වුණාම අනිත් අයගෙන් ඉල්ලලා බලලා ආපහු දෙනවා. Ring all-reduce = වට මේසයක වාඩි වෙලා හැමෝම තමන්ගේ කොටස දකුණු පැත්තේ කෙනාට දෙන එක.',
      example:
        '7B full fine-tuning: 7B × 16 = 112 GB (14 GB කියන්නේ BF16 weights විතරයි, inference වලට ඇති). Adam states: 7B × 8 = 56 GB (28 GB = එක moment එකයි). 7B, GPUs 8: Stage 1 = weights 14 + grads 14 + (84 ÷ 8 = 10.5) = 38.5 GB/GPU. Stage 2 = 14 + (14 ÷ 8 = 1.75) + 10.5 = 26.25 GB. Stage 3 = 112 ÷ 8 = 14 GB. 70B ZeRO-3 on 64 GPUs: 70B × 16 = 1,120 GB ÷ 64 = 17.5 GB/GPU (140 GB කියන්නේ unsharded BF16 weights). Ring all-reduce: S = 1 GB, N = 8 → 2 × 7/8 × 1 = 1.75 GB යවනවා. N = 64 → 2 × 63/64 ≈ 1.97 GB.',
      keyPoints: [
        '16 B/param = 2 (weights) + 2 (grads) + 4 (master) + 4 (m) + 4 (v). Adam states = 8 B.',
        'DP = full replica + batch slice + gradients all-reduce (DDP).',
        'NCCL = GPU collectives (all-reduce, all-gather) over NVLink/IB.',
        'ZeRO-1 optimizer, ZeRO-2 + grads, ZeRO-3 + params. FSDP FULL_SHARD ≈ ZeRO-3, SHARD_GRAD_OP ≈ ZeRO-2.',
        'Ring all-reduce = 2(N−1)/N × S. ZeRO-3 comm ≈ 1.5× DP.',
      ],
      terms: [
        { en: 'All-Reduce', si: 'හැම GPU එකකම tensors එකතු/average කරලා ප්‍රතිඵලය හැමෝටම දෙන collective එක.' },
        { en: 'Reduce-Scatter', si: 'Tensors එකතු කරලා ප්‍රතිඵලයේ වෙනම කොටසක් හැම GPU එකකටම දෙන collective එක.' },
        { en: 'All-Gather', si: 'හැම GPU එකකම කොටස් එකතු කරලා සම්පූර්ණ tensor එක හැමෝටම දෙන collective එක.' },
        { en: 'NCCL', si: 'NVIDIA Collective Communications Library. Multi-GPU communication එකේ හදවත.' },
        { en: 'ZeRO Stages 1/2/3', si: 'Optimizer states / + gradients / + parameters shard කරන DeepSpeed මට්ටම්.' },
        { en: 'FSDP ShardingStrategy', si: 'FULL_SHARD (≈ZeRO-3), SHARD_GRAD_OP (≈ZeRO-2), NO_SHARD (≈DDP).' },
      ],
    },

    // 17
    {
      id: 'model-parallelism',
      title: 'Tensor, Pipeline, Sequence, Context & Expert Parallelism: Megatron, Bubbles, 3D Arithmetic',
      examRefs: ['TRN-042', 'TRN-043', 'TRN-083', 'TRN-084', 'TRN-085', 'TRN-086', 'TRN-088', 'TRN-123', 'TRN-124', 'TRN-125', 'TRN-126', 'TRN-127', 'TRN-132'],
      body: [
        'Tensor parallelism (TP, intra-layer): එක weight matrix එකක්ම (උදා: MLP projection එකක columns) GPUs අතර කපලා, හැම GPU එකක්ම එකම layer එකේ කොටසක් ගණනය කරනවා, partial results collectives වලින් හුවමාරු කරනවා. Megatron-LM මේක ප්‍රායෝගික කළා. Megatron MLP: Y = GeLU(X·A)·B. A columns වලින් කපනවා: හැම GPU එකකටම hidden units වල සම්පූර්ණ slice එකක් ලැබෙනවා, ඒ නිසා GeLU එක local විදිහට apply කරන්න පුළුවන් (sync ඕනේ නෑ). B rows වලින් කපනවා: හැම GPU එකක්ම partial sum එකක් හදනවා, MLP එක අගට එක all-reduce එකකින් ඒවා එකතු කරනවා. Backward pass එකේ input gradients වලටත් ගැළපෙන all-reduce එකක් ඕනේ. TP layer එකකට කිහිප වතාවක් (forward සහ backward දෙකේම) latency-sensitive collectives කරන නිසා, ඉතා වේගවත් NVLink/NVSwitch තියෙන එක node එකක් ඇතුළේ (උදා: DGX එකේ GPUs 8) තියාගන්නවා. Pipeline සහ data parallelism අඩුවෙන් communicate කරන නිසා node අතර InfiniBand උඩ හොඳයි (IB එක NCCL collectives සම්පූර්ණයෙන්ම support කරනවා).',
        'Pipeline parallelism (PP, inter-layer): Layers 80ක් GPU 0 = 1-20, GPU 1 = 21-40 වගේ stages වලට බෙදලා micro-batches ගලාගෙන යනවා. Batch එකක මුලදී (fill) සහ අගදී (drain) GPUs idle: මේක bubble. Bubble fraction ≈ (p − 1) / (m + p − 1), p = stages, m = micro-batches. m වැඩි කළාම bubble එක හැකිලෙනවා. p වැඩි කළාම bubble එක ලොකු වෙනවා. (p − 1)/m කියන්නේ bubble time එක ideal compute time එකට අනුපාතය, මුළු කාලයේ fraction එක නෙවෙයි. Interleaved 1F1B (Megatron): හැම GPU එකකටම non-contiguous layer chunks v ගණනක් (virtual stages). Bubble එක ~v ගුණයකින් අඩු වෙනවා, ඒත් activations device boundaries v ගුණයක් වැඩියෙන් පනින නිසා point-to-point communication වැඩියි. Scheduling වෙනසක් විතරයි, accuracy එකට බලපෑමක් නෑ.',
        'Sequence & context parallelism: Megatron "sequence parallelism" (TP එක්ක): TP split කරපු attention/MLP blocks වලින් එළියේ LayerNorm, dropout activations හැම TP rank එකකම duplicate වෙනවා. Sequence parallelism ඒවා sequence (token) dimension එකෙන් shard කරනවා, all-reduce එක reduce-scatter + all-gather වලින් replace කරනවා, communication volume එකමයි. Attention එක exact, approximation නෑ. Context parallelism: 128K-token sequences, checkpointing එක්කත් එක sequence එකක activations එක GPU එකකට ගැලපෙන්නේ නෑ නම්, sequence dimension එකම GPUs අතර බෙදනවා. Data parallelism batch එක බෙදන නිසා, හැම GPU එකකටම තාම එක දිග sequence එකක් සම්පූර්ණයෙන් තියාගන්න වෙනවා. Ring attention: key/value blocks GPUs ring එකක් වටේ යවනවා, හැම GPU එකක්ම තමන්ගේ queries වලට online softmax එකෙන් attention accumulate කරනවා, communication එක compute එකත් එක්ක overlap කරනවා. N − 1 exchanges වලින් පස්සේ හැම query block එකක්ම හැම K/V block එකක්ම දැකලා, ඒ නිසා exact. කිසිම GPU එකක සම්පූර්ණ sequence එකේ K/V එකවර නෑ.',
        'Expert parallelism (MoE): වෙනස් experts වෙනස් GPUs වල. Tokens router එක තෝරපු expert එක තියෙන GPU එකට all-to-all collective එකකින් යවලා, ප්‍රතිඵල ආපහු ගේනවා. තනි expert එකක matrices කපන එක TP, දෙකම එකට පාවිච්චි කරන්න පුළුවන්. MoE load-balancing loss: router එක experts කිහිපයකටම tokens ගොඩක් යැව්වොත් (routing collapse) අනිත් experts undertrained, capacity overflow. Auxiliary loss එක tokens experts අතර සමව බෙදෙන්න දිරිගන්වනවා, ඒත් experts සමාන කරන්නේ නෑ (specialization තමයි MoE එකේ අරමුණ). 3D parallelism: මුළු GPUs = TP × PP × DP.',
      ],
      analogy:
        'Rice and curry 1,000 packets හදන කඩයක්. Tensor parallelism = එකම packet එකේ බත් එක්කෙනෙක්, curry තව කෙනෙක්, එකම මේසයේ ළඟින් (NVLink) ඉඳන් නිතර කතා කරනවා. Pipeline = එක්කෙනෙක් බත් බෙදනවා, ඊළඟා curry දානවා, ඊළඟා pack කරනවා. උදේට පළමු packet එක ඉවර වෙනකම් pack කරන කෙනා නිකං ඉන්නවා (bubble). Packets ගොඩක් පෙළට ආවාම ඒ නිකං කාලය සාපේක්ෂව පොඩියි. Expert parallelism = විශේෂ orders: කොත්තු order එක කොත්තු බාස් ළඟට, හොප්පර් order එක හොප්පර් අක්කා ළඟට (all-to-all). Load balancing = කොත්තු බාස්ට විතරක් orders ගොඩ ගැහෙන එක නවත්වන එක.',
      example:
        '3D: GPUs 64, TP = 8, PP = 2 → DP = 64 ÷ (8 × 2) = 4 replicas. (8 කියන්නේ TP විතරක් බෙදුවොත් ලැබෙන වැරදි උත්තරය.) Bubble: p = 4, m = 12 → (4 − 1) ÷ (12 + 4 − 1) = 3 ÷ 15 = 20%. (3 ÷ 12 = 25% වැරදි formula එක.) m = 48 කළොත් 3 ÷ 51 ≈ 6%. Interleaved v = 2: bubble-to-compute ratio (p − 1)/m = 25% ඉඳන් ආසන්න වශයෙන් (p − 1)/(v·m) = 12.5% දක්වා. Megatron MLP on TP = 4: A (4,096 × 16,384) columns 4,096 බැගින් GPU 4කට, B (16,384 × 4,096) rows 4,096 බැගින්. Forward: GPU එක එකක් X·A_i → GeLU → ·B_i, අන්තිමට එක all-reduce.',
      keyPoints: [
        'TP = matrices කපනවා, layer එකකට නිතර collectives → NVLink ඇති node එක ඇතුළේ.',
        'Megatron MLP: A column-split (GeLU local), B row-split → forward එකේ එක all-reduce.',
        'Bubble = (p−1)/(m+p−1). m ↑ = bubble ↓. Interleaved = bubble ↓, P2P comm ↑.',
        'Sequence parallelism = LayerNorm/dropout activations token dim එකෙන් shard. Context parallelism / ring attention = දිග sequences, exact.',
        'EP = experts GPUs අතර, all-to-all. Load-balancing loss = routing collapse වළක්වනවා. GPUs = TP × PP × DP.',
      ],
      terms: [
        { en: 'Tensor Parallelism', si: 'එක layer එකක weight matrices GPUs අතර කපලා ගණනය කිරීම.' },
        { en: 'Pipeline Bubble', si: 'Pipeline fill/drain වෙලාවේ stages idle වෙලා නාස්ති වෙන කාලය.' },
        { en: '1F1B / Interleaved Schedule', si: 'එක forward, එක backward මාරුවෙන් කරන pipeline schedule එක. Interleaved එකේ GPU එකකට chunks කිහිපයක්.' },
        { en: 'Sequence Parallelism (Megatron)', si: 'TP නැති regions වල activations sequence dimension එකෙන් shard කිරීම.' },
        { en: 'Context Parallelism / Ring Attention', si: 'දිග sequence එකක tokens GPUs අතර බෙදලා K/V ring එකක් වටේ යවලා exact attention ගණනය කිරීම.' },
        { en: 'Expert Parallelism', si: 'MoE experts වෙනස් GPUs වල තියලා all-to-all එකෙන් tokens route කිරීම.' },
        { en: 'Load-Balancing Loss', si: 'Router එක tokens experts අතර සමව බෙදන්න දිරිගන්වන auxiliary loss එක.' },
      ],
    },

    // 18
    {
      id: 'scaling-compute-mfu',
      title: 'Scaling Laws & Compute Math: Chinchilla, 6ND, MFU, Critical Batch Size',
      examRefs: ['TRN-052', 'TRN-133', 'TRN-134', 'TRN-147'],
      body: [
        'Chinchilla (Hoffmann et al.): Fixed compute budget එකකට හොඳම ප්‍රතිඵලය ගන්න model size (parameters) සහ training tokens එකට scale කරන්න ඕනේ. Compute-optimal rule of thumb: parameter එකකට tokens ~20ක්. උදා: 70B params → 1.4T tokens. Llama වගේ ගොඩක් නවීන models මීට වඩා ගොඩක් වැඩි tokens වලින් train කරනවා, මොකද පොඩි model එකක් දිගු කාලයක් train කළාම inference ලාභයි. ඒත් "compute-optimal" උත්තරය 20 යි.',
        'Training compute: C ≈ 6 · N · D FLOPs. N = parameters, D = training tokens. ඇයි 6? Forward pass එකට token එකකට parameter එකකට FLOPs ~2ක් (ගුණ කිරීමක් + එකතු කිරීමක්), backward pass එක forward එක වගේ දෙගුණයක් (~4). 2 + 4 = 6. 2ND විතරක් ගත්තොත් forward pass එක විතරයි.',
        'MFU (Model FLOPs Utilization): GPU එකේ peak FLOPS වලින් ඔයාගේ training එක ඇත්තටම "ප්‍රයෝජනවත්" model FLOPs කීයක් කරනවද කියන ප්‍රතිශතය. Achieved FLOPS = 6 × N × tokens per second. MFU = achieved ÷ peak. හොඳට tune කරපු ලොකු runs වල MFU 35-55% සාමාන්‍යයි. (Recompute වගේ අමතර වැඩ MFU එකට ගණන් ගන්නේ නෑ.)',
        'Critical batch size: Global batch එක 4 ගුණයක් කරලා (LR එකත් ගැළපෙන්න scale කරලා) බැලුවාම target loss එකට යන්න ඕනේ optimizer steps ගණන අඩු වුණේ නැත්නම්, batch එක critical batch size එකට වඩා ලොකුයි. ඒ තැනට පස්සේ batch එකකට samples වැඩි කිරීමෙන් වෙන්නේ gradient noise එක අඩු කිරීම විතරයි, ඒත් noise එක තවදුරටත් bottleneck එක නෙවෙයි. Critical size එකට පහළදී batch එක දෙගුණ කළාම steps බාගයකට විතර අඩු වෙනවා. ඉහළදී returns අඩුයි, extra compute නාස්තියි. Gradient accumulation ගණිතමය වශයෙන් සමාන ලොකු batch එකක් හදන නිසා ඒක හේතුව නෙවෙයි.',
      ],
      analogy:
        'Chinchilla = A/L එකට සූදානම් වෙන ළමයෙක්ට ලොකු මොළයක් (parameters) තිබුණත් පොත් කියවලා නැත්නම් (tokens) වැඩක් නෑ. පොත් ගොඩක් කියෙව්වත් මොළය පොඩි නම් ඔක්කොම මතක තියාගන්න බෑ. දෙකම සමබර විය යුතුයි. Critical batch size = කුස්සියේ කෝප්ප 10ක් හෝදන්න 2 දෙනෙක් ගත්තාම වේගවත්. 20 දෙනෙක් ගත්තත් වැඩිය වේගවත් නෑ, බේසම ළඟ තදබදයක් විතරයි.',
      example:
        'Compute: 7B model, 2T tokens → 6 × 7×10⁹ × 2×10¹² = 84 × 10²¹ = 8.4 × 10²² FLOPs. (2ND = 2.8 × 10²².) MFU: 7B, H100 එකක් tokens 10,000/s. Achieved = 6 × 7×10⁹ × 10⁴ = 4.2 × 10¹⁴ = 420 TFLOPS. Peak BF16 dense ≈ 989 TFLOPS. MFU = 420 ÷ 989 ≈ 42%. (3N ගත්තොත් 21% වැරදියට.) කාලය: H100 1,000ක් 420 TFLOPS බැගින් → 4.2 × 10¹⁷ FLOP/s. 8.4 × 10²² ÷ 4.2 × 10¹⁷ = 2 × 10⁵ s ≈ දවස් 2.3යි. Chinchilla: 7B × 20 = 140B tokens compute-optimal. 2T කියන්නේ parameter එකකට ~286, inference ලාභ කරගන්න "over-train" කරලා.',
      keyPoints: [
        'Chinchilla compute-optimal ≈ 20 tokens/param (70B ↔ 1.4T).',
        'C ≈ 6ND (forward 2ND + backward 4ND).',
        'MFU = 6 × N × tokens/s ÷ peak FLOPS. 35-55% හොඳයි.',
        'Critical batch size ඉක්මවූ පසු batch වැඩි කිරීමෙන් steps අඩු වෙන්නේ නෑ.',
      ],
      terms: [
        { en: 'Chinchilla Scaling', si: 'Compute fixed නම් params සහ tokens එකට scale කරන්න ඕනේ කියන (≈20 tokens/param) සොයාගැනීම.' },
        { en: 'FLOPs', si: 'Floating-point operations. Training compute මනින ඒකකය.' },
        { en: 'MFU', si: 'Model FLOPs Utilization: peak hardware FLOPS වලින් ඇත්තටම model එකට වැය වෙන ප්‍රතිශතය.' },
        { en: 'Critical Batch Size', si: 'මීට වඩා batch එක වැඩි කළාට training steps සැලකිය යුතු ලෙස අඩු නොවෙන සීමාව.' },
        { en: 'Gradient Noise', si: 'පොඩි batch එකකින් ගණනය කරන gradient එක සැබෑ gradient එකෙන් වෙනස් වෙන ප්‍රමාණය.' },
      ],
    },

    // 19
    {
      id: 'nvidia-training-stack',
      title: 'NVIDIA Training Stack: NeMo, Megatron-LM/Core, Curator, Aligner, Transformer Engine, NCCL',
      examRefs: ['TRN-046', 'TRN-047', 'TRN-006', 'TRN-035', 'TRN-045', 'TRN-048'],
      body: [
        'Exam එකේ "මේ වැඩේට කුමන NVIDIA tool එකද?" වගේ ප්‍රශ්න ගොඩක් එනවා. හැම tool එකක්ම LLM ජීවන චක්‍රයේ කුමන අදියරටද අයිති කියලා මතක තියාගත්තාම ලේසියි: data → train → align → serve → guard.',
        'Data අදියර: NeMo Curator (dedup, filtering, language ID, PII redaction වගේ data curation, GPU මත). Train අදියර: NeMo framework = pretraining, SFT, PEFT (LoRA, p-tuning), alignment ආවරණය කරන end-to-end generative AI framework එක, Megatron-based distributed training එක්ක. Megatron-LM / Megatron-Core = tensor, pipeline, sequence parallelism එකට ප්‍රසිද්ධ, බිලියන සිය ගණනක params train කරන්න පුළුවන් library එක. NeMo ගොඩනැගිලා තියෙන්නේ Megatron-Core උඩ. Transformer Engine = Hopper/Blackwell GPUs මත FP8 training. NCCL = GPUs අතර collectives.',
        'Align අදියර: NeMo-Aligner = reward model training, PPO RLHF, DPO, SteerLM. Serve අදියර: TensorRT-LLM (inference optimize කිරීම), Triton Inference Server, NIM. Guard අදියර: NeMo Guardrails = deployed model එකක conversations වලට runtime rules. Training data හෝ weights වෙනස් කරන්නේ නෑ. RAPIDS cuDF = GPU data frames (ETL), Megatron නෙවෙයි. DALI = data loading/augmentation (බොහෝ විට images).',
      ],
      analogy:
        'Hotel kitchen එකක් වගේ: NeMo Curator = එළවළු සෝදලා කපන කෙනා. NeMo + Megatron = ප්‍රධාන chef ලා සහ ලොකු stoves (GPU cluster). NeMo-Aligner = රස බලලා recipe එක හදන කෙනා. TensorRT-LLM / Triton = කෑම ඉක්මනට මේසෙට ගෙනියන waiters. NeMo Guardrails = door එකේ ඉන්න security, ඇතුළට එන දේ සහ එළියට යන දේ පරීක්ෂා කරනවා, ඒත් උයන්නේ නෑ.',
      example:
        'Scenario: "Multi-terabyte web corpus එකක් GPU මත dedup කරන්න" → NeMo Curator. "Pretrain + LoRA + DPO එකම framework එකකින්" → NeMo framework. "Tensor/pipeline parallelism library එක" → Megatron-LM. "PPO RLHF සහ SteerLM scale එකේ" → NeMo-Aligner. "H100 FP8 training" → Transformer Engine. "All-reduce over InfiniBand" → NCCL. "Production chatbot එකට topic restrictions" → NeMo Guardrails. "Training ඉවර model එකේ inference latency අඩු කරන්න" → TensorRT-LLM.',
      keyPoints: [
        'NeMo Curator = data. NeMo framework = train/customize. Megatron-Core = parallelism engine.',
        'NeMo-Aligner = RLHF/DPO/SteerLM. Transformer Engine = FP8.',
        'NCCL = collectives. TensorRT-LLM / Triton / NIM = inference.',
        'NeMo Guardrails = runtime, weights වෙනස් කරන්නේ නෑ.',
      ],
      terms: [
        { en: 'NeMo Framework', si: 'Generative AI models pretrain, fine-tune, align කරන NVIDIA end-to-end framework එක.' },
        { en: 'Megatron-Core', si: 'Megatron-LM එකේ parallelism techniques reusable library එකක් විදිහට. NeMo මේක පාවිච්චි කරනවා.' },
        { en: 'NeMo Guardrails', si: 'Deploy කරපු LLM එකක conversations වලට runtime safety/topic rules දාන toolkit එක.' },
        { en: 'TensorRT-LLM', si: 'Train කරපු LLMs NVIDIA GPUs මත වේගයෙන් run කරන්න optimize කරන inference library එක.' },
      ],
    },

    // 20
    {
      id: 'colab-lora-handson',
      title: 'Hands-On (Beyond Exam): Google Colab එකේ පොඩි Open Model එකක් QLoRA වලින් Fine-Tune කරමු',
      examRefs: ['TRN-056', 'TRN-058', 'TRN-102', 'TRN-105'],
      body: [
        'දැන් ඔයා theory හොඳට දන්නවා. ඇත්තටම කරලා බැලුවාම තේරුම තවත් ගැඹුරු වෙනවා. Google Colab එකේ නොමිලේ ලැබෙන T4 GPU (16 GB) එකකින් පොඩි open model එකක් (උදා: Qwen2.5-0.5B-Instruct වගේ 0.5B-1.5B model එකක්) QLoRA එකෙන් fine-tune කරන්න පුළුවන්. පියවර: (1) Runtime → Change runtime type → T4 GPU. (2) transformers, peft, trl, datasets, bitsandbytes, accelerate install කරන්න. (3) ඔයාගේ data JSONL file එකක් විදිහට හදන්න: හැම line එකකම {"messages": [{"role": "user", ...}, {"role": "assistant", ...}]}. Examples 200-1,000ක් වුණත් format/style උගන්වන්න ඇති (LIMA මතකද?).',
        '(4) Model එක 4-bit NF4 වලින් load කරන්න. T4 (Turing) GPU එකේ BF16 native support නැති නිසා compute dtype එක FP16 දාන්න. A100/H100/L4 නම් BF16. (5) LoraConfig: r = 16, alpha = 32, target_modules = "all-linear" (QLoRA paper එකේ සොයාගැනීම). (6) SFTTrainer එකෙන් train කරන්න: micro-batch 2 × accumulation 8 = effective batch 16. LoRA LR 2e-4. TRL එක model එකේ chat template එක පාවිච්චි කරනවා, inference වලදීත් එකම template එක පාවිච්චි කරන්න. (7) Adapter එක save කරලා, test කරලා, ඕනේ නම් full-precision base එකක් එක්ක merge_and_unload() කරන්න.',
        'සැලකිලිමත් වෙන්න: transformers / trl / peft APIs versions අතර ටිකක් වෙනස් වෙනවා (උදා: tokenizer එක දෙන argument එකේ නම). Error එකක් ආවොත් library එකේ version එකට අදාළ docs බලන්න. Validation set එකක් තියාගෙන validation loss එක බලන්න: ඒක වැඩි වෙන්න පටන් ගත්තොත් overfitting. Training ඉවර වුණාම model එකට "අලුත්" ප්‍රශ්න කිහිපයක් අහලා forgetting වෙලාද කියලත් බලන්න.',
      ],
      analogy:
        'Driving license එකට theory exam එක pass වුණාට, පාරේ වාහනය පදවලා බලනකම් ඇත්තටම driving තේරෙන්නේ නෑ. Colab = නොමිලේ practice කරන්න දෙන පිට්ටනියක්. පොඩි model එක = practice කරන්න පොඩි car එකක්, lorry එකක් නෙවෙයි.',
      example:
        'Sinhala customer support bot එකක්: examples 500ක් (user ප්‍රශ්නය + හොඳ Sinhala උත්තරය). 0.5B model එක 4-bit ≈ 0.25 GB විතරයි, T4 එකේ ඉඩ ගොඩයි. Effective batch 16 → epoch එකකට steps 500 ÷ 16 ≈ 32. Epochs 2 → steps ~64. LoRA params (all-linear, r = 16) මුළු model එකෙන් 2%ක් විතර. T4 එකේ මිනිත්තු කිහිපයකින් ඉවරයි. Adapter folder එක MB සිය ගණනක් නෙවෙයි, MB දස ගණනක් විතරයි.',
      code: {
        lang: 'python',
        src: `# !pip install -q transformers peft trl datasets bitsandbytes accelerate
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

name = "Qwen/Qwen2.5-0.5B-Instruct"   # පොඩි open model එකක්
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.float16)  # T4 නිසා FP16
model = AutoModelForCausalLM.from_pretrained(name, quantization_config=bnb, device_map="auto")
tok = AutoTokenizer.from_pretrained(name)
data = load_dataset("json", data_files="my_data.jsonl")["train"]  # "messages" field එක
lora = LoraConfig(r=16, lora_alpha=32, target_modules="all-linear", task_type="CAUSAL_LM")
args = SFTConfig(output_dir="out", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                 learning_rate=2e-4, num_train_epochs=2, fp16=True, logging_steps=10)
trainer = SFTTrainer(model=model, args=args, train_dataset=data, peft_config=lora, processing_class=tok)
trainer.train()
trainer.save_model("my-lora")   # save වෙන්නේ adapter එක විතරයි`,
      },
      keyPoints: [
        'Colab T4 + 4-bit NF4 + LoRA = පොඩි models නොමිලේ fine-tune කරන්න පුළුවන්.',
        'T4 එකේ BF16 නෑ → FP16 compute dtype. A100/H100/L4 නම් BF16.',
        'Data = chat "messages" JSONL. Training සහ inference එකම chat template එක.',
        'Validation loss බලන්න (overfitting), general ප්‍රශ්න අහන්න (forgetting).',
      ],
      terms: [
        { en: 'Google Colab', si: 'Browser එකෙන් Python notebooks නොමිලේ GPU එක්ක දුවන්න පුළුවන් Google සේවාව.' },
        { en: 'TRL SFTTrainer', si: 'Hugging Face TRL library එකේ SFT (සහ PEFT) training ලේසි කරන class එක.' },
        { en: 'JSONL', si: 'හැම line එකකම වෙනම JSON object එකක් තියෙන file format එක.' },
        { en: 'all-linear', si: 'Transformer blocks වල හැම linear layer එකකටම LoRA දාන්න කියන PEFT shortcut එක.' },
      ],
    },
  ],

  quiz: [
    {
      q: 'Data-parallel GPUs 8ක්, per-GPU micro-batch 4, gradient_accumulation_steps 8. Effective global batch size එක කීයද?',
      options: ['32', '64', '128', '256'],
      answer: 3,
      why: 'Global batch = micro-batch × accumulation steps × DP GPUs = 4 × 8 × 8 = 256. 32 කියන්නේ factors දෙකක් විතරක් ගුණ කරලා.',
    },
    {
      q: 'LoRA r = 8, එක 4,096 × 4,096 matrix එකකට. Train වෙන parameters ගණන?',
      options: ['32,768', '65,536', '131,072', '16,777,216'],
      answer: 1,
      why: 'r × (d + k) = 8 × (4,096 + 4,096) = 65,536. 32,768 කියන්නේ A හෝ B එකක් විතරයි. 16,777,216 කියන්නේ frozen W එක.',
    },
    {
      q: 'Pipeline stages 4ක් සහ micro-batches 12ක්. (p − 1)/(m + p − 1) අනුව bubble fraction එක?',
      options: ['8%', '20%', '25%', '33%'],
      answer: 1,
      why: '(4 − 1) ÷ (12 + 4 − 1) = 3 ÷ 15 = 20%. 25% එන්නේ (p − 1)/m වැරදි formula එකෙන්.',
    },
    {
      q: 'A100 එකක FP16 fine-tuning run එකක නිතර loss = nan සහ overflow warnings එනවා. හොඳම විසඳුම?',
      options: ['Learning rate වැඩි කරන්න', 'BF16 mixed precision එකට මාරු වෙන්න', 'Gradient clipping අයින් කරන්න', 'LoRA rank වැඩි කරන්න'],
      answer: 1,
      why: 'BF16 එකට FP32 වගේ 8-bit exponent range එකක් තියෙන නිසා FP16 ~65,504 සීමාව ඉක්මවන අගයන් නිරූපණය කරන්න පුළුවන්. A100 BF16 native support කරනවා.',
    },
    {
      q: 'PPO training එකේ reward model score එක දිගටම වැඩි වෙනවා, ඒත් උත්තර දිග, repetitive, මුඛස්තුති කරන ඒවා වෙනවා. මොකද වෙන්නේ?',
      options: ['SFT model එක undertrained', 'KL coefficient එක ඕනෑවට වඩා වැඩියි', 'Policy එක reward model එකේ bias exploit කරනවා (reward hacking)', 'Tokenizer එක outputs truncate කරනවා'],
      answer: 2,
      why: 'Reward model එක imperfect proxy එකක්. Over-optimize කළාම දිග වගේ quirks exploit කරනවා. KL වැඩි නම් policy එක SFT එකට ළඟින් තියෙන නිසා මේ drift එක අඩුයි.',
    },
    {
      q: 'GPUs 64ක job එකක TP = 8, PP = 2. Data-parallel size එක?',
      options: ['2', '4', '8', '16'],
      answer: 1,
      why: 'GPUs = TP × PP × DP, ඒ නිසා DP = 64 ÷ (8 × 2) = 4.',
    },
    {
      q: 'Exact SHA-256 hashing එක timestamp එකක් විතරක් වෙනස් documents අල්ලන්නේ නෑ. Near-duplicates scale එකේ හොයන්න සාමාන්‍යයෙන් පාවිච්චි කරන්නේ?',
      options: ['MinHash + LSH', 'Byte-pair encoding', 'TF-IDF keyword extraction', 'Document එකේ SHA-256 දෙපාරක්'],
      answer: 0,
      why: 'MinHash එක n-gram sets වල Jaccard similarity එක ඇස්තමේන්තු කරනවා, LSH සමාන signatures එකම bucket එකට දානවා. NeMo Curator මේක GPU මත කරනවා.',
    },
    {
      q: 'Continued pretraining එකේදී loss එක මුල් distribution එකේ වැඩි වෙනවා (forgetting). අධ්‍යයන නිර්දේශ කරන්නේ?',
      options: ['පරණ minimum LR එකේම නව data විතරක්', 'Optimizer reset කරලා 10× peak LR', 'Re-warm + re-decay, සහ මුල් pretraining data පොඩි ප්‍රතිශතයක් replay කිරීම', 'Attention layers ඔක්කොම freeze කිරීම'],
      answer: 2,
      why: 'Re-warming අලුත් domain එක ඉගෙන ගන්න ඕනේ, ඒත් forgetting ඇති කරනවා. පරණ data සියයට කිහිපයක් replay කිරීමෙන් ඒක අඩු වෙනවා (Ibrahim et al., 2024).',
    },
    {
      q: 'FP16 GradScaler එක්ක clip_grad_norm_ call කරන්න කලින් අනිවාර්යයෙන් කරන්න ඕනේ මොකක්ද?',
      options: ['scaler.update()', 'optimizer.zero_grad()', 'scaler.unscale_(optimizer)', 'Model එක FP32 කරන්න'],
      answer: 2,
      why: 'Backward එකෙන් පස්සේ gradients තාම loss scale එකෙන් ගුණ වෙලා. Unscale නොකර clip කළොත් threshold එක පිම්බුණු අගයන් වලට apply වෙනවා. zero_grad() gradients මකනවා.',
    },
    {
      q: '7B model එකක් H100 එකක tokens 10,000/s process කරනවා. 6N FLOPs/token සහ peak ~989 TFLOPS නම් MFU එක ආසන්න වශයෙන්?',
      options: ['7%', '21%', '42%', '85%'],
      answer: 2,
      why: '6 × 7×10⁹ × 10⁴ = 4.2 × 10¹⁴ FLOP/s = 420 TFLOPS. 420 ÷ 989 ≈ 42%. 21% එන්නේ 3N පාවිච්චි කළොත්.',
    },
  ],
}
