export default {
  id: 'evaluation',
  number: 11,
  title: 'LLM Evaluation & Experimentation',
  titleSi: 'Proving Whether a Model Is Good',
  summary: 'Learn to measure whether a model works, whether a new version is better, and whether an observed improvement is more than random variation. This phase explains perplexity, BLEU, ROUGE, pass@k, benchmarks such as MMLU, LLM judges, human evaluation, contamination, calibration, A/B testing, reproducibility, and experiment design with worked calculations. It covers the evaluation topics needed for the NCA-GENL exam.',
  duration: '4-6 weeks',
  topics: [
    // 1
    {
      id: 'perplexity',
      title: 'Perplexity: How Surprised Is the Model?',
      si: 'ඔයා Colombo යන බස් එකක ඊළඟ නැවතුම අනුමාන කරනවා කියලා හිතන්න. Model එක ඊළඟ token එකට වැඩි probability දුන්නොත් ඒක අඩුවෙන් පුදුම වෙනවා. Perplexity කියන්නේ ඒ පුදුම වීමේ සාමාන්‍ය මට්ටම අංකයකින් පෙන්වන එකයි. එකම text සහ tokenizer එකේදී අඩු perplexity එකක් හොඳ fit එකක් පෙන්වනවා, ඒත් උත්තරය ප්‍රයෝජනවත්ද කියලා ඒකෙන්ම කියන්න බෑ.',
      examRefs: ['EVAL-001', 'EVAL-002', 'EVAL-003', 'EVAL-004', 'EVAL-005', 'EVAL-109'],
      body: [
        'Language model එකක් කරන්නේ ඊළඟ token එකට probability එකක් දෙන එක. Test text එකේ ඇත්තටම ආපු token එකට model එක දුන්න probability එක ලොකු නම් model එක හොඳයි. Perplexity කියන්නේ මේ "model එක කොච්චර පුදුම වුණාද (surprised)" කියන එක එක අංකයකින් කියන ක්‍රමය.',
        'ගණනය කරන හැටි වචන වලින්: (1) හැම token එකකටම model එක දුන්න probability එක ගන්නවා. (2) ඒකේ natural log එක අරන් minus ලකුණ දානවා. මේකට කියන්නේ negative log-likelihood (NLL) කියලා. Probability එක 1ට ළං නම් NLL එක 0ට ළං. Probability එක පොඩි නම් NLL එක ලොකුයි. (3) හැම token එකකම NLL එකේ සාමාන්‍යය ගන්නවා. මේක තමයි cross-entropy loss එක. (4) ඒ සාමාන්‍යය e^ (exp) කරනවා. Perplexity = exp(සාමාන්‍ය NLL). Perplexity කියන්නේ top-1 accuracy එක නෙවෙයි. Model එක හරි token එකට ලොකු probability එකක් දුන්නත් ඒක හැම වෙලේම argmax (පළමු තැන) වෙන්න ඕනේ නෑ.',
        'Perplexity එක තේරුම් ගන්න ලේසිම විදිහ: "model එක හැම පියවරකදීම සමාන ඉඩක් තියෙන options කීයක් අතරේ පැටලිලා ඉන්නවද" කියන එක (effective number of choices). Vocabulary එකේ tokens 50,000ක් තියෙනවා, model එක හැම එකටම 1/50,000 සමාන probability දෙනවා නම්, NLL = ln(50,000) ≈ 10.8, perplexity = exp(10.8) = 50,000. ඒ කියන්නේ model එක කිසිම දෙයක් දන්නේ නෑ. 10.8 කියන්නේ loss එක, perplexity එක නෙවෙයි. Perplexity අඩු වෙන තරමට හොඳයි. X = 12, Y = 18 නම්, එකම data එකේ එකම tokenizer එකෙන්, X validation text එකට සාමාන්‍යයෙන් වැඩි probability දෙනවා. වැඩි perplexity එකක් "diversity" එකක් නෙවෙයි.',
        'වැදගත් අනතුරු දෙකක්. පළමුව, tokenizers දෙකක් තියෙන models දෙකක perplexity කෙලින්ම සසඳන්න බෑ. Perplexity එක token එකකට normalize කරලා තියෙන්නේ. එක tokenizer එකක් එකම වාක්‍යය පොඩි tokens ගොඩකට කඩනවා නම්, එකම මුළු loss එක වැඩි units ගණනකට බෙදෙනවා. එතකොට bits per byte වගේ tokenizer-independent මිනුමක් පාවිච්චි කරන්න ඕනේ. Temperature එක perplexity එකට බලපාන්නේ නෑ, මොකද perplexity ගණනය කරන්නේ model එකේ raw probabilities වලින්. දෙවනුව, perplexity කියන්නේ text distribution එකකට model එක කොච්චර fit වෙනවද කියන එක විතරයි. Instruction tuning / RLHF කරපු chat model එකක web-text perplexity එක base model එකට වඩා ටිකක් වැඩි වෙන්න පුළුවන්, ඒත් instructions follow කරන එකේ ගොඩක් හොඳ වෙන්න පුළුවන්. Alignment එකෙන් distribution එක raw web text එකෙන් helpful උත්තර පැත්තට තල්ලු වෙන නිසා ඒක පරස්පර විරෝධයක් නෙවෙයි.',
      ],
      analogy: 'Kottu කඩේක අලුත් වැඩකාරයෙක් ඉන්නවා කියලා හිතන්න. Regular customer කෙනෙක් ආවම "චීස් kottu එකක්" කියයි කියලා එයා හරියටම අනුමාන කරනවා නම් එයා පුදුම වෙන්නේ නෑ (අඩු perplexity). Menu එකේ items 50ම සමාන ඉඩකින් එයි කියලා හිතන අලුත්ම කෙනා හැම order එකකටම පුදුම වෙනවා. එයාගේ perplexity එක 50යි: හැම පාරම options 50ක් අතරේ පැටලිලා.',
      example: 'Test set එකේ සාමාන්‍ය NLL එක token එකකට 2.0 nats. Perplexity = e^2. e කියන්නේ ආසන්න වශයෙන් 2.718. 2.718 × 2.718 ≈ 7.39. ඉතින් perplexity ≈ 7.4. ඒ කියන්නේ model එක හැම token එකකදීම සමාන options 7ක් විතර අතරේ පැටලිලා වගේ. Loss එක bits වලින් (log base 2) තිබුණා නම් විතරයි 2^2 = 4 හරි වෙන්නේ. ප්‍රශ්නයේ "nats" කියලා තිබුණොත් e^ පාවිච්චි කරන්න.',
      keyPoints: [
        'Perplexity = exp(token එකකට සාමාන්‍ය negative log-likelihood). අඩු වෙන තරමට හොඳයි.',
        'Uniform model එකක perplexity එක = vocabulary size (V). ln(V) කියන්නේ loss එක.',
        'Nats නම් e^loss, bits නම් 2^loss.',
        'Tokenizers වෙනස් නම් perplexity සසඳන්න බෑ. Bits per byte පාවිච්චි කරන්න.',
        'Perplexity = text fit එක. Usefulness / instruction following නෙවෙයි.',
      ],
      terms: [
        { en: 'Negative Log-Likelihood (NLL)', si: '−log(හරි token එකට දුන්න probability). Model එක හරි දේට අඩු probability දුන්නොත් ලොකු penalty එකක්.' },
        { en: 'Cross-Entropy Loss', si: 'Tokens ගොඩක NLL එකේ සාමාන්‍යය. Perplexity = exp(cross-entropy).' },
        { en: 'Nats vs Bits', si: 'Natural log (ln) පාවිච්චි කළොත් nats, log base 2 නම් bits. 1 nat = 1/ln2 ≈ 1.44 bits.' },
        { en: 'Effective Number of Choices', si: 'Perplexity එකේ අර්ථය: model එක සමාන options කීයක් අතරේ පැටලිලාද කියන එක.' },
      ],
    },
    // 2
    {
      id: 'perplexity-in-practice',
      title: 'Computing Perplexity Correctly: Bits per Byte, Sliding Windows, Padding, Aggregation',
      si: 'වෙනස් tokenizers තියෙන models සසඳද්දී byte එකකට loss ගණන් කළොත් සාධාරණයි. Colombo ඉඳන් Kandy යන ගමනේ හැම කොටසටම පසුපස context එක මතක තියාගන්න sliding window එකක් වගේ. Padding token-ийг loss එකෙන් ඉවත් කරන්න labels дээр -100 දා, attention mask එකෙන් විතරක් ඒක болохේ නෑ. Batch бүрийн perplexity එක සාමාන්‍ය කරනවා වෙනුවට මුළු NLL එක මුළු tokens ගණනින් බෙදලා අන්තිමට exp කරන්න.',
      examRefs: ['EVAL-115', 'EVAL-116', 'EVAL-117', 'EVAL-118'],
      body: [
        'Bits per byte (BPB) කියන්නේ tokenizer එක මඟ හැරලා models සසඳන ක්‍රමය. පියවර: (1) මුළු loss එක ගන්නවා (tokens ගණන × token එකකට සාමාන්‍ය loss). (2) Loss එක nats වලින් නම් ln 2 (≈ 0.693) න් බෙදලා bits වලට හරවනවා. (3) Text එකේ bytes ගණනින් බෙදනවා. Bytes ගණන tokenizer එක මොකක් වුණත් වෙනස් වෙන්නේ නෑ, ඒ නිසා vocabularies වෙනස් models සාධාරණව සසඳන්න පුළුවන්.',
        'Model එකේ context window එකට වඩා දිග document එකක perplexity එක ගණනය කරනකොට, document එක එකිනෙකට සම්බන්ධ නැති (disjoint) කෑලි වලට කැපුවොත්, හැම කෑල්ලකම මුල tokens predict කරන්න වෙන්නේ context එකක් නැතුව. ඒ නිසා perplexity එක ඕනෑවට වඩා වැඩි වෙනවා. Sliding window එකක් (stride එක window එකට වඩා පොඩි) පාවිච්චි කළාම හැම scored token එකකටම ආසන්න වශයෙන් full context එකක් ලැබෙනවා. Overlap වෙන කොටස් ආයෙත් process කරන නිසා compute වැඩියි. Double-count නොවෙන්න අලුත් (overlap නොවෙන) target tokens විතරයි score කරන්නේ.',
        'Hugging Face code වල නිතර වෙන වැරදි දෙකක් තියෙනවා. (1) Padding: batch එකක sequences එකම දිගට ගේන්න pad tokens දානවා. attention_mask එකෙන් real tokens pad tokens වලට attend කරන එක නවත්තනවා. ඒත් pad tokens loss එකෙන් අයින් කරන්නේ නෑ. Loss එකෙන් අයින් කරන්න labels වල ඒ තැන් -100 කරන්න ඕනේ. Causal LM heads labels ඇතුළෙන්ම shift කරන නිසා ඔයා අතින් shift කරන්න ඕනේ නෑ. කළොත් වැරදියට align වෙනවා. (2) Aggregation: batch එකකින් batch එකට exp(loss) අරන් ඒවායේ සාමාන්‍යය ගන්න එක වැරදියි. හරි ක්‍රමය: corpus perplexity = exp(හැම token එකකම මුළු NLL ÷ මුළු tokens ගණන). exp කියන්නේ convex function එකක් නිසා exp වල සාමාන්‍යය හැම වෙලේම සාමාන්‍යයේ exp එකට වඩා වැඩියි හෝ සමානයි. ඒ වගේම tokens ටිකක් තියෙන පොඩි batch එකකටත් ලොකු batch එකකට සමාන බරක් ලැබෙනවා.',
      ],
      analogy: 'පන්තියේ ළමයි දෙදෙනෙක්ගේ English අකුරු වැරදි සසඳනවා කියලා හිතන්න. එක්කෙනෙක් "වචන" ගණන් කරනවා, අනිකා "අක්ෂර" ගණන් කරනවා. "වචනයකට වැරදි" සසඳන එක සාධාරණ නෑ. "පිටුවකට වැරදි" (bytes) කියලා එකම මිනුමකින් ගණන් කළාම සාධාරණයි. Bits per byte කරන්නේ ඒකයි.',
      example: 'Bytes 4,000ක document එකක් tokens 1,000කට කැඩෙනවා. Token එකකට සාමාන්‍ය loss 0.9 nats. මුළු loss = 1,000 × 0.9 = 900 nats. Bits වලට: 900 ÷ 0.693 ≈ 1,298 bits. Byte එකකට: 1,298 ÷ 4,000 ≈ 0.32 BPB. ln 2 න් බෙදන්න අමතක කළොත් 900 ÷ 4,000 = 0.225 (වැරදි). Aggregation උදාහරණය: batch දෙකක loss 1 සහ 3. වැරදි ක්‍රමය: (e^1 + e^3) ÷ 2 = (2.72 + 20.09) ÷ 2 ≈ 11.4. හරි ක්‍රමය (tokens ගණන සමාන නම්): e^((1+3)÷2) = e^2 ≈ 7.39. වැරදි ක්‍රමය perplexity එක වැඩියෙන් පෙන්නනවා.',
      code: {
        lang: 'python',
        src: `import math
# හරි ක්‍රමය: token-weighted NLL එකතු කරලා අන්තිමට exp කරන්න
total_nll, total_tokens = 0.0, 0
for mean_loss, n_tokens in [(1.0, 500), (3.0, 500)]:
    total_nll += mean_loss * n_tokens
    total_tokens += n_tokens
print(math.exp(total_nll / total_tokens))   # ~7.39

# Bits per byte
nats = 1000 * 0.9
print(nats / math.log(2) / 4000)          # ~0.32`,
      },
      keyPoints: [
        'BPB = (මුළු nats ÷ ln2) ÷ bytes. Tokenizer-independent.',
        'දිග documents වලට sliding window: perplexity එක සැබෑ අගයට ළං, ඒත් compute වැඩියි.',
        'Pad tokens loss එකෙන් අයින් කරන්නේ labels = -100 කරලා. attention_mask එකෙන් නෙවෙයි.',
        'Corpus perplexity = exp(Σ NLL ÷ Σ tokens). Batch perplexities සාමාන්‍ය කරන්න එපා.',
      ],
      terms: [
        { en: 'Bits per Byte (BPB)', si: 'Byte එකකට model එකට ඕනේ වෙන bits ගණන. Tokenizers වෙනස් models සසඳන්න පාවිච්චි කරනවා.' },
        { en: 'Sliding-Window Perplexity', si: 'Overlap වෙන windows පාවිච්චි කරලා හැම token එකකටම ලොකු context එකක් දෙන ක්‍රමය.' },
        { en: 'Label -100', si: 'PyTorch / Hugging Face loss එකේ "මේ තැන ignore කරන්න" කියන ලකුණ.' },
        { en: 'Convex Function', si: 'Exp වගේ උඩට නැවෙන function එකක්. ඒ නිසා සාමාන්‍යයේ exp ≤ exp වල සාමාන්‍යය (Jensen).' },
      ],
    },
    // 3
    {
      id: 'bleu-and-translation-metrics',
      title: 'BLEU, Brevity Penalty, SacreBLEU, METEOR, chrF and BERTScore',
      si: 'Colombo ඉඳන් Galle යන එකම අදහස වචන වෙනස් කරලා කියන්න පුළුවන්. BLEU එක reference එකේ වචන කොටස් එක්ක කොච්චර ගැළපෙනවද බලන නිසා හොඳ වෙනත් පරිවර්තනයක් අඩු ලකුණු ගන්න පුළුවන්. හරිම කෙටි උත්තරයකට වැඩි ලකුණු නොඑන්න brevity penalty එක දානවා. SacreBLEU, METEOR, chrF සහ BERTScore වෙන වෙනම ආකාරයෙන් ගැළපීම මනිනවා.',
      examRefs: ['EVAL-006', 'EVAL-047', 'EVAL-048', 'EVAL-049', 'EVAL-055', 'EVAL-056', 'EVAL-057'],
      body: [
        'BLEU කියන්නේ machine translation වලට හදපු metric එකක්. ඒක precision-oriented: "model එක ලියපු n-grams (වචන 1, 2, 3, 4 කෑලි) වලින් කීයක් reference එකේ තියෙනවද" කියලා බලනවා. "Modified" හෝ "clipped" precision කියන්නේ, reference එකේ "the" දෙපාරක් විතරක් තියෙනවා නම්, candidate එකේ "the" හත් පාරක් ලිව්වත් match දෙකක් විතරයි ගණන් කරන්නේ. ඊට පස්සේ 1-gram සිට 4-gram දක්වා precisions හතරේ geometric mean එක (ගුණ කරලා හතරවෙනි මූලය) ගන්නවා. ඒක brevity penalty (BP) එකෙන් ගුණ කරනවා.',
        'Brevity penalty එක ඕනේ ඇයි? BLEU precision විතරයි බලන්නේ. ඉතින් model එකක් තමන්ට විශ්වාස වචන 3ක් විතරක් ලිව්වොත් precision එක 100%ට ළං වෙනවා. ඒක වළක්වන්න, candidate length (c) reference length (r) එකට වඩා අඩු නම් BP = exp(1 − r/c). c ≥ r නම් BP = 1. BLEU කවදාවත් recall එකට මාරු වෙන්නේ නෑ. Brevity penalty එක තමයි recall එක වෙනුවට තියෙන දේ. BP එක අඩු කරන factor එකක් විතරයි, කවදාවත් හරියටම 0 වෙන්නේ නෑ. ඒත් sentence එකක් විතරක් තියෙනකොට 4-gram match එකක්වත් නැත්නම් එක precision එකක් 0 වෙනවා. ගුණ කරන නිසා මුළු BLEU එකම 0 වෙනවා. Smoothing හෝ corpus-level BLEU එකෙන් මේක මඟහරිනවා.',
        'BLEU එක tokenization, lowercase කරන එක වගේ preprocessing එක අනුව ගොඩක් වෙනස් වෙනවා. Papers දෙකක BLEU සසඳන්න බැරි වුණේ ඒ නිසා. SacreBLEU හැදුවේ tokenization එක fix කරලා, settings ඔක්කොම කියන "signature string" එකක් එක්ක BLEU report කරන්න. COMET කියන්නේ වෙනම learned translation metric එකක්, BLEU standardize කරන tool එකක් නෙවෙයි.',
        'BLEU වල දුර්වලකම් හදන්න ආපු metrics: METEOR, exact වචන වලට අමතරව stems ("run" / "running") සහ synonyms (WordNet) match කරනවා. Precision වලට වඩා recall වලට බර දෙනවා. වචන පිළිවෙළ කැඩුණොත් fragmentation penalty එකක් දෙනවා. chrF, වචන වෙනුවට character n-grams වල F-score එක ගන්නවා. Finnish, සිංහල වගේ එකම මූලයට විවිධ අගු (inflections) එකතු වෙන භාෂා වලට ඒක හොඳයි, මොකද "ගෙදර" සහ "ගෙදරට" අර්ධ වශයෙන් match වෙනවා. Word-level BLEU ඒ දෙක සම්පූර්ණ mismatch එකක් විදිහට ගන්නවා. BERTScore, BERT වගේ model එකක contextual embeddings අරන් tokens cosine similarity එකෙන් match කරනවා. ඉතින් "car" සහ "automobile" වගේ paraphrases වලට credit ලැබෙනවා. BLEU, ROUGE-1, exact match තුනටම surface-form (අකුරු එකම වෙන්න) overlap ඕනේ.',
      ],
      analogy: 'A/L English paper එකක translation ප්‍රශ්නයක් බලන teacher කෙනෙක් හිතන්න. BLEU teacher කරන්නේ ඔයාගේ වචන model answer එකේ තියෙනවද කියලා tick දාන එක. ඔයා වචන 3ක් විතරක් ලිව්වොත් ඔක්කොම tick, ඒත් teacher "මේක ගොඩක් කොටයි" කියලා ලකුණු කපනවා (brevity penalty). METEOR teacher synonyms වලටත් ලකුණු දෙනවා. BERTScore teacher අදහස එකම නම් වචන වෙනස් වුණත් ලකුණු දෙනවා.',
      example: 'Brevity penalty උදාහරණය: Reference එකේ tokens 20යි (r = 20). Candidate එකේ 16යි (c = 16). r/c = 20/16 = 1.25. 1 − 1.25 = −0.25. BP = e^(−0.25) ≈ 0.78. ඉතින් n-gram precisions කොච්චර හොඳ වුණත් BLEU එක 22%කින් අඩු වෙනවා. Clipping උදාහරණය: Reference "the cat is on the mat". Candidate "the the the the the the the". "the" reference එකේ උපරිම 2 පාරයි. Clipped unigram precision = 2/7 ≈ 0.29, 7/7 නෙවෙයි.',
      keyPoints: [
        'BLEU = clipped 1-4 gram precisions වල geometric mean × brevity penalty.',
        'BP = exp(1 − r/c), c < r නම් විතරයි. Recall term එකක් නෑ.',
        'Sentence-level BLEU = 0 වෙන්නේ 4-gram match නැති නිසා. Smoothing ඕනේ.',
        'SacreBLEU = reproducible BLEU + signature. METEOR = stems + synonyms + recall. chrF = character n-gram F-score. BERTScore = embeddings.',
      ],
      terms: [
        { en: 'Clipped (Modified) Precision', si: 'Candidate n-gram එකක් reference එකේ තියෙන වාර ගණනට වඩා ගණන් කරන්නේ නෑ.' },
        { en: 'Brevity Penalty', si: 'කොට outputs වලට BLEU අඩු කරන factor එක.' },
        { en: 'SacreBLEU', si: 'Fixed tokenization සහ signature string එකක් එක්ක BLEU ගණනය කරන standard tool එක.' },
        { en: 'METEOR', si: 'Exact, stem, synonym matches එක්ක recall-weighted metric එක, word order penalty එකත් එක්ක.' },
        { en: 'chrF', si: 'Character n-gram F-score. Morphology පොහොසත් භාෂා වලට robust.' },
        { en: 'BERTScore', si: 'Contextual embeddings වල cosine similarity එකෙන් tokens match කරන metric එක.' },
        { en: 'COMET', si: 'Human ratings වලින් train කරපු learned translation metric එකක්.' },
      ],
    },
    // 4
    {
      id: 'qa-rouge-diversity',
      title: 'Exact Match, Token F1, ROUGE, Diversity and Reference-Free Metrics',
      si: 'ඔයාගේ උත්තරය gold answer එකට සමාන වචන කොච්චර තියෙනවද කියලා Token F1 අර්ධ ලකුණු දෙනවා. ROUGE එක සාරාංශයේ තිබුණු වැදගත් වචන කොටස් candidate එකේ තියෙනවද බලනවා. එකම වචන නැවත නැවත කියන chatbot එකකට Distinct-n අඩු වෙනවා, Self-BLEU ද ඉහළ යනවා. විවෘත ප්‍රශ්නවලට overlap එක පමණක් නොව human හෝ LLM judge ඇගයීමත් ඕනේ.',
      examRefs: ['EVAL-007', 'EVAL-008', 'EVAL-009', 'EVAL-010', 'EVAL-011', 'EVAL-101', 'EVAL-110', 'EVAL-111'],
      body: [
        'Extractive QA (SQuAD වගේ) වල metrics දෙකක් තියෙනවා. Exact Match (EM): normalize කරපු prediction එක normalize කරපු gold answer එකට හරියටම සමාන නම් 1, නැත්නම් 0. SQuAD normalization එකෙන් අයින් කරන්නේ capital/simple අකුරු වෙනස, punctuation, සහ articles (a, an, the) විතරයි. වෙනත් අමතර වචනයක් තිබුණොත් EM = 0. Token F1 කියන්නේ අර්ධ ලකුණු දෙන ක්‍රමය: precision = පොදු tokens ÷ prediction tokens, recall = පොදු tokens ÷ gold tokens, F1 = 2PR ÷ (P + R).',
        'ROUGE (Recall-Oriented Understudy for Gisting Evaluation) හැදුවේ summarization වලට. ඒක recall-oriented: "reference summary එකේ content එකෙන් කීයක් candidate එකේ තියෙනවද" කියලා බලනවා. ROUGE-1 = unigram (තනි වචන) overlap. ROUGE-2 = bigram (වචන දෙක එකට) overlap. ROUGE-L = longest common subsequence (LCS), ඒ කියන්නේ පිළිවෙළ හරි වුණාම එකිනෙකට යාබද නොවුණත් match වෙන දිගම වචන පේළිය. ROUGE-1 recall = overlap ÷ reference length. Precision = overlap ÷ candidate length.',
        'Chatbot එකක open-ended උත්තර වලට BLEU / ROUGE හොඳ නෑ. ඇයි? එකම ප්‍රශ්නයට ගොඩක් වෙනස්, ඒත් එකසේ හොඳ උත්තර තියෙන්න පුළුවන්. එක reference එකක් එක්ක overlap එක quality එකට දුර්වල proxy එකක්. වෙනස් විදිහට ලියපු හොඳ උත්තරයකට අඩු ලකුණු. ඒ නිසා open-ended assistants evaluate කරන්නේ human හෝ LLM-judge ratings වලින්. Reference-free metric එකක් කියන්නේ gold output එකක් ඕනේ නැති එකක්. උදා: rubric එකකට අනුව helpfulness score කරන LLM judge කෙනෙක්. BLEU, ROUGE, EM ඔක්කොම reference-based.',
        'Creative writing model එකක් fluent ඒත් එකම දේ කියනවා නම් diversity මනින්න ඕනේ. Distinct-n = unique n-grams ගණන ÷ මුළු n-grams ගණන. Distinct-1 (unigrams), distinct-2 (bigrams). එකම දේ ආයෙ ආයෙ කියන outputs වලට අඩු අගයක්. Self-BLEU තව ක්‍රමයක්: model එකේ samples එකිනෙකට එරෙහිව BLEU ගණනය කරනවා. Self-BLEU අඩු නම් samples එකිනෙකට වෙනස්, ඒ කියන්නේ diversity වැඩියි.',
      ],
      analogy: 'Exact match කියන්නේ bank teller කෙනෙක් cheque එකේ නම බලනවා වගේ. "Abraham Lincoln" ඕනේ තැන "President Abraham Lincoln" කිව්වත් reject. Token F1 කියන්නේ ඉඩම් office එකේ නිලධාරියෙක් "නමේ කොටස් ගොඩක් ගැළපෙනවා" කියලා අර්ධ ලකුණු දෙනවා වගේ. ROUGE කියන්නේ teacher කෙනෙක් model answer එකේ point ටික ඔයාගේ summary එකේ කීයක් තියෙනවද කියලා tick කරනවා වගේ.',
      example: 'ROUGE-1: Reference එකේ unigrams 12යි. Candidate එකේ 10යි. ඒවායින් 9ක් reference එකේ තියෙනවා. Recall = 9 ÷ 12 = 0.75. Precision = 9 ÷ 10 = 0.90. F1 = 2 × 0.75 × 0.90 ÷ (0.75 + 0.90) = 1.35 ÷ 1.65 ≈ 0.82. Token F1: Gold "the eiffel tower in paris", prediction "eiffel tower". "the" අයින් කළාම gold = {eiffel, tower, in, paris} (4). Prediction = {eiffel, tower} (2). පොදු = 2. P = 2/2 = 1.0. R = 2/4 = 0.5. F1 = 2 × 1 × 0.5 ÷ 1.5 ≈ 0.67. Distinct-1: "good food good food good food" කියන output එකේ වචන 6යි, unique 2යි. Distinct-1 = 2/6 ≈ 0.33.',
      keyPoints: [
        'EM = normalize කළාට පස්සේ හරියටම සමාන නම් විතරයි 1. Normalization = case, punctuation, articles.',
        'Token F1 = අර්ධ ලකුණු. Precision ÷ prediction, recall ÷ gold.',
        'ROUGE = recall-oriented, summarization. ROUGE-2 = bigrams. ROUGE-L = longest common subsequence.',
        'Open-ended dialogue වලට overlap metrics දුර්වලයි. Human / LLM judge පාවිච්චි කරන්න.',
        'Distinct-n වැඩි = diversity වැඩි. Self-BLEU අඩු = diversity වැඩි.',
      ],
      terms: [
        { en: 'Exact Match (EM)', si: 'Normalized prediction එක gold එකට හරියටම සමානද කියන 0/1 score එක.' },
        { en: 'Token-level F1', si: 'Prediction සහ gold අතර පොදු tokens වලින් precision/recall ගණනය කරලා ගන්න F1.' },
        { en: 'ROUGE-1 / ROUGE-2 / ROUGE-L', si: 'Unigram / bigram / longest common subsequence overlap.' },
        { en: 'Longest Common Subsequence', si: 'පිළිවෙළ රැකෙන, ඒත් යාබද වෙන්න ඕනේ නැති, පොදු දිගම වචන පේළිය.' },
        { en: 'Distinct-n', si: 'Unique n-grams ÷ මුළු n-grams. Lexical diversity මිනුම.' },
        { en: 'Self-BLEU', si: 'Model එකේම samples අතර BLEU. අඩු නම් diversity වැඩියි.' },
        { en: 'Reference-free Metric', si: 'Gold answer එකක් නැතුව output එක තනියම (input එකත් එක්ක) evaluate කරන metric එක.' },
      ],
    },
    // 5
    {
      id: 'pass-at-k',
      title: 'Code Evaluation: HumanEval, pass@k and the Unbiased Estimator',
      si: 'Cricket practice එකේ balls 10කින් 2ක් හොඳට bat කළා නම්, ඒවායින් balls 5ක් තෝරද්දී එකක්වත් හරි යන ඉඩ pass@5 වගේ. Code එකකටත් hidden unit tests ඔක්කොම pass වුණොත් විතරයි ඒ sample එක සාර්ථක වෙන්නේ. pass@k සඳහා unbiased formula එක 1 − C(n−c,k)/C(n,k) යි. එකම greedy output එක නැවත නැවත ගන්නවාට වඩා විවිධ samples ගත්තොත් ලොකු k එකකට හොඳ chance එකක් ලැබෙනවා.',
      examRefs: ['EVAL-012', 'EVAL-013', 'EVAL-017', 'EVAL-053', 'EVAL-054', 'EVAL-096', 'EVAL-113', 'EVAL-114'],
      body: [
        'Code එකක් හොඳද කියලා බලන්න හොඳම ක්‍රමය ඒක run කරලා බලන එක. HumanEval (OpenAI Codex paper එකෙන්) කියන්නේ අතින් ලියපු Python problems 164ක්. හැම එකකටම function signature එකක්, docstring එකක්, hidden unit tests තියෙනවා. මේකට කියන්නේ functional correctness evaluation කියලා. BLEU code tokens වලට ගණනය කරන්න පුළුවන්, ඒත් correctness එකත් එක්ක දුර්වලව correlate වෙනවා. වෙනස් විදිහට ලියපු programs දෙකක් එකම දේ කරන්න පුළුවන්. එකම වගේ පේන code එකක් වැරදි වෙන්නත් පුළුවන්. pass@k BLEU වලට වඩා ලාභ නෑ. ඇත්තටම වැඩි වියදම්, මොකද sandbox එකක code run කරන්න ඕනේ.',
        'pass@k කියන්නේ: "එක problem එකකට programs k ක් generate කළොත්, අඩුම තරමින් එකක්වත් හැම unit test එකක්ම pass වෙන probability එක." Tests වලින් කොටසක් pass වුණාට අර්ධ ලකුණු නෑ. pass@1 = එක attempt එකකින් හරි යන ඉඩ. Benchmark pass@k එක කියන්නේ හැම problem එකකම pass@k වල සාමාන්‍යය.',
        'Unbiased estimator එක: n samples generate කරලා ඒවායින් c ක් හරි නම්, pass@k = 1 − C(n−c, k) ÷ C(n, k). C(a, b) කියන්නේ "a දේවල් වලින් b ක් තෝරන ක්‍රම ගණන". වචන වලින්: n samples වලින් random k ක් තෝරනකොට, ඒ k ම වැරදි ඒවා වෙන ඉඩ (C(n−c,k) ÷ C(n,k)) හොයලා, 1 න් අඩු කරනවා. k = 1 නම් මේක සරලව c ÷ n වෙනවා. n − c < k නම් (වැරදි samples k ටත් වඩා අඩු නම්) හැම k-subset එකකම අඩුම තරමින් එක හරි එකක් තියෙනවා, pass@k = 1. Code එකේදී මේ case එක වෙනම 1.0 return කරනවා, මොකද C(3,5) වගේ එකක් අර්ථ නැති නිසා (0).',
        'Naive estimator එක 1 − (1 − c/n)^k ඇයි වැරදි? 1 − (1 − p)^k කියන්නේ p වල concave function එකක් (පහළට නැවෙන). Jensen inequality එක අනුව, noisy estimate එකක් (c/n) concave function එකකට දැම්මාම, සාමාන්‍යයෙන් ඇත්ත අගයට වඩා අඩු අගයක් එනවා. ඉතින් naive එක pass@k එක systematically underestimate කරනවා. Temperature: pass@1 වලට greedy (temperature 0) හොඳයි, මොකද එක attempt එකකට වඩාත්ම ඉඩ තියෙන completion එක තමයි හොඳම. pass@100 වලට temperature 0.8 වගේ වැඩි අගයක් ගන්නවා. Greedy නම් attempts 100ම එකම output එක, budget එක නාස්තියි. Diverse samples නිසා එකක්වත් හරි වෙන්න ඉඩ වැඩියි.',
      ],
      analogy: 'Cricket batsman කෙනෙක්ට bowl කරන balls 10කින් 2ක් six යනවා කියලා හිතන්න. ඔයාට balls 5ක් random විදිහට දුන්නොත් අඩුම තරමින් එක six එකක්වත් එන්න ඉඩ කොච්චරද? ඒක තමයි pass@5. Six නැති balls 5ම වැටෙන ඉඩ හොයලා 1 න් අඩු කළාම උත්තරය.',
      example: 'n = 10, c = 2, k = 5. වැරදි samples = 8. "වැරදි 8 න් 5ක් තෝරන ක්‍රම" C(8,5) = 56. "ඔක්කොම 10 න් 5ක් තෝරන ක්‍රම" C(10,5) = 252. ඔක්කොම 5 වැරදි වෙන ඉඩ = 56 ÷ 252 ≈ 0.222. pass@5 = 1 − 0.222 ≈ 0.78. pass@1 = 2 ÷ 10 = 0.20. Naive එක: 1 − (0.8)^5 = 1 − 0.328 = 0.67, ඇත්ත 0.78 ට වඩා අඩුයි. තව උදාහරණයක්: n = 20, c = 5, pass@1 = 5/20 = 0.25. Edge case: n = 10, c = 7, k = 5. වැරදි 3යි. 5ක් තෝරනකොට අඩුම තරමින් 2ක් හරි ඒවා. pass@5 = 1.00.',
      code: {
        lang: 'python',
        src: `from math import comb

def pass_at_k(n, c, k):
    # වැරදි samples k ටත් අඩු නම් හැම විටම හරි එකක් ලැබෙනවා
    if n - c < k:
        return 1.0
    return 1 - comb(n - c, k) / comb(n, k)

print(pass_at_k(10, 2, 5))   # ~0.778
print(pass_at_k(20, 5, 1))   # 0.25
print(pass_at_k(10, 7, 5))   # 1.0`,
      },
      keyPoints: [
        'pass@k = k samples වලින් එකක්වත් ඔක්කොම tests pass වෙන probability එක.',
        'Unbiased: 1 − C(n−c,k)/C(n,k). k = 1 නම් c/n. n − c < k නම් 1.',
        'Naive 1 − (1 − c/n)^k concave නිසා underestimate කරනවා (Jensen).',
        'pass@1 → greedy. pass@100 → temperature ~0.8 diversity එකට.',
        'Code වලට BLEU නෙවෙයි, functional correctness (unit tests) තමයි හරි මිනුම.',
      ],
      terms: [
        { en: 'HumanEval', si: 'Unit tests එක්ක Python problems 164ක්. pass@k එකෙන් score කරනවා.' },
        { en: 'Functional Correctness', si: 'Code එක run කරලා ඇත්තටම හරි වැඩේ කරනවද කියලා tests වලින් බලන එක.' },
        { en: 'Unbiased Estimator', si: 'සාමාන්‍යයෙන් ඇත්ත අගයම දෙන estimator එකක්. Systematic over/under නෑ.' },
        { en: 'Jensen’s Inequality', si: 'Concave function එකකට noisy අගයක් දැම්මාම සාමාන්‍යය අඩු වෙනවා (convex නම් වැඩි වෙනවා).' },
        { en: 'Sandboxed Execution', si: 'Model එක ලියපු code එක ආරක්ෂිත, හුදෙකලා පරිසරයක run කරන එක.' },
      ],
    },
    // 6
    {
      id: 'standard-benchmarks',
      title: 'Standard Benchmarks: MMLU, HellaSwag, ARC, GSM8K, TruthfulQA, IFEval, BIG-bench, Long Context',
      si: 'A/L විෂයයන් වගේ benchmarks එකිනෙකට වෙනස් හැකියාවන් පරීක්ෂා කරනවා. MMLU විෂය 57ක ප්‍රශ්න අහන අතර options 4ක් නිසා අහඹු අනුමානය 25%යි. GSM8K එකේ ගණිත ප්‍රශ්නයකට answers 16ක් අරගෙන majority vote කළොත් compute එකත් 16 ගුණ වෙනවා. දිග document එකක එක වචනයක් හොයාගැනීමෙන් model එකට දිග context එක හොඳට reason කරන්න පුළුවන් කියලා තහවුරු වෙන්නේ නෑ.',
      examRefs: ['EVAL-014', 'EVAL-015', 'EVAL-016', 'EVAL-018', 'EVAL-023', 'EVAL-066', 'EVAL-067', 'EVAL-068', 'EVAL-095', 'EVAL-148'],
      body: [
        'Benchmark එකක් කියන්නේ හැමෝම එකම විදිහට පාවිච්චි කරන public exam paper එකක් වගේ. Exam එකට වැදගත් ඒවා: MMLU (Massive Multitask Language Understanding) = විෂයයන් 57ක (STEM, law, humanities…) options 4ක multiple-choice ප්‍රශ්න. පුළුල් දැනුම සහ reasoning මනිනවා. HellaSwag = scenario එකකට වඩාත්ම ගැළපෙන අවසානය (continuation) තෝරන commonsense benchmark එක. වැරදි endings machine එකෙන් හදලා adversarial filtering කරලා තියෙනවා, ඒ නිසා models රැවටෙනවා, ඒත් මිනිස්සුන්ට ලේසියි. ARC (AI2 Reasoning Challenge) = grade-school science multiple-choice ප්‍රශ්න. Easy සහ Challenge කියලා කොටස් දෙකයි. Challenge set එකේ තියෙන්නේ සරල retrieval සහ word co-occurrence baselines වැරදියට උත්තර දුන්න ප්‍රශ්න.',
        'GSM8K = grade-school ගණිත word problems 8.5K විතර. පියවර කිහිපයක arithmetic ඕනේ. අවසාන numeric උත්තරය check කරනවා. TruthfulQA = ජනප්‍රිය වැරදි විශ්වාස (misconceptions) නිසා වැරදි උත්තරයක් ආකර්ෂණීය වෙන ප්‍රශ්න ("imitative falsehoods"). Web text අනුකරණය කරන්න train කරපු ලොකු models සමහර වෙලාවට මේකේ වඩා නරක ලකුණු ගන්නවා. ඒ නිසා මේක දැනුමේ පළල නෙවෙයි, truthfulness මනින්නයි. IFEval = "හරියටම bullet points 3කින් උත්තර දෙන්න", "commas පාවිච්චි කරන්න එපා" වගේ instructions follow කරනවද කියලා program එකකින් check කරන්න පුළුවන් benchmark එක. Judge කෙනෙක් ඕනේ නෑ. BIG-bench (Beyond the Imitation Game) = පර්යේෂකයන් සිය ගණනක් දායක වුණ tasks 200+ක ලොකු එකතුවක්. BIG-Bench Hard (BBH) = models මුලින් මිනිස්සුන්ට වඩා පස්සෙන් හිටපු tasks 23ක subset එකක්.',
        'ලකුණක් තේරුම් ගන්න කලින් random baseline එක බලන්න. MMLU වල options 4ක් නිසා අහඹු ලෙස අනුමාන කළත් 25%ක් ලැබෙනවා. Model එකක් 26% ගත්තොත් ඒක ඇත්තටම "කිසිම හැකියාවක් නෑ" කියන එක. GSM8K වල self-consistency (majority voting): එක ප්‍රශ්නයකට chain-of-thought විසඳුම් 16ක් sample කරලා වැඩියෙන්ම ආපු අවසාන උත්තරය ගන්නවා. Accuracy 58% සිට 69% ට යන්න පුළුවන්, ඒත් inference compute 16 ගුණයක්. ඒ නිසා ඒක "maj@16" කියලා report කරන්න ඕනේ, single-sample accuracy කියලා නෙවෙයි. pass@16 නම් එකක්වත් හරි නම් ගණන් ගන්නවා, ඒක majority vote එකට වඩා ලිහිල් නිර්ණායකයක්.',
        'Long context: "Needle in a haystack" test එකේදී දිග text එකක් ඇතුළේ එක fact එකක් හංගලා ඒක හොයන්න කියනවා. 128K tokens දක්වා 100%ක් වගේ ගත්තත් ඒක ප්‍රමාණවත් සාක්ෂියක් නෙවෙයි. එක fact එකක් retrieve කරන එක multi-hop reasoning, aggregation, එක වෙලාවේ facts ගොඩක් track කරන එකට වඩා ගොඩක් ලේසියි. RULER වගේ suites multi-needle, variable tracking, aggregation tasks test කරනවා. ඒවායේ performance එක advertised context length එකට කලින්ම අඩු වෙනවා. ඉතින් "effective context length" එක මනින්නේ අමාරු tasks වලින්.',
      ],
      analogy: 'O/L, A/L, scholarship exam එක වගේ විවිධ exams තියෙනවා. MMLU කියන්නේ විෂයයන් 57ක general knowledge MCQ paper එක. GSM8K කියන්නේ Grade 5 ගණිත ගැටලු. TruthfulQA කියන්නේ "කණ්ණාඩි කැඩුණොත් අවුරුදු 7ක් අවාසනාවයි ද?" වගේ ගමේ විශ්වාස වලට රැවටෙනවද කියලා බලන paper එක. IFEval කියන්නේ "පිටු 2කට වඩා ලියන්න එපා, නිල් පෑනෙන් විතරක් ලියන්න" වගේ උපදෙස් පිළිපදිනවද කියලා බලන invigilator.',
      example: 'Model එකක් MMLU වල 26% ගත්තා. Options 4ක් නිසා random guess = 1/4 = 25%. 26% − 25% = 1% විතරයි. ඉතින් මේ model එකට MMLU හැකියාවක් නෑ වගේ. තව model එකක් GSM8K වල එක sample එකකින් 58%, samples 16ක majority vote එකෙන් 69%. Report කරන්න ඕනේ "58% (greedy), 69% (maj@16)" කියලා, compute එක 16 ගුණයක් බව පැහැදිලි කරලා.',
      keyPoints: [
        'MMLU = විෂයයන් 57, MCQ (options 4). HellaSwag = commonsense continuation, adversarial filtering.',
        'ARC-Challenge = retrieval baselines වැරදුණ science MCQ. GSM8K = math word problems ~8.5K.',
        'TruthfulQA = misconceptions. IFEval = programmatically check කරන්න පුළුවන් instructions.',
        'BIG-bench = tasks 200+. BBH = අමාරු tasks 23.',
        'හැම විටම chance baseline එක බලන්න. maj@k compute එක හෙළි කරලා report කරන්න. Needle test ≠ long-context reasoning.',
      ],
      terms: [
        { en: 'Adversarial Filtering', si: 'Models රවටන, ඒත් මිනිස්සුන්ට පැහැදිලි වැරදි options තෝරලා තියාගන්න ක්‍රමය.' },
        { en: 'Random (Chance) Baseline', si: 'අහඹු ලෙස අනුමාන කළොත් ලැබෙන ලකුණ. Options 4 නම් 25%.' },
        { en: 'Self-Consistency / maj@k', si: 'Samples k ක් අරන් majority vote. Report කරන්නේ maj@k කියලා.' },
        { en: 'Needle in a Haystack', si: 'දිග context එකක හංගපු එක fact එකක් හොයන සරල long-context test එක.' },
        { en: 'RULER', si: 'Multi-needle, variable tracking, aggregation වගේ අමාරු long-context tasks තියෙන suite එක.' },
        { en: 'BIG-Bench Hard (BBH)', si: 'BIG-bench එකෙන් තෝරපු අමාරු tasks 23ක subset එක.' },
      ],
    },
    // 7
    {
      id: 'harness-scoring',
      title: 'How Harnesses Score: lm-evaluation-harness, Log-Likelihood, acc_norm, Prompt Sensitivity, NeMo Evaluator',
      si: 'එකම ප්‍රශ්නයට ලකුණු දෙන ක්‍රමය වෙනස් නම් model එකේ score එකත් වෙනස් වෙන්න පුළුවන්. Multiple-choice එකකදී harness එක හැම option එකේම log-likelihood එක සසඳනවා. දිග උත්තරවලට අසාධාරණයක් නොවෙන්න acc_norm දිගෙන් normalize කරනවා. Colombo පාසල් දෙකක් සසඳනවා වගේ models හැම එකටම එකම prompt template සහ shots ගණන පාවිච්චි කරන්න.',
      examRefs: ['EVAL-052', 'EVAL-092', 'EVAL-093', 'EVAL-094', 'EVAL-097', 'EVAL-141', 'EVAL-142', 'EVAL-143'],
      body: [
        'EleutherAI lm-evaluation-harness කියන්නේ MMLU, HellaSwag, ARC වගේ benchmarks සිය ගණනක් එකම prompts සහ scoring එකෙන් Hugging Face models මත run කරන open-source tool එක. ගොඩක් public leaderboards පිටිපස්සේ තියෙන්නේ මේකයි. NVIDIA ලෝකයේදී, NeMo Evaluator කියන්නේ NIM endpoints විදිහට serve කරන models සහ pipelines මත academic benchmarks, custom datasets, LLM-as-a-judge evaluations run කරන managed microservice එක. NeMo Curator කියන්නේ training data සකස් කරන tool එක, evaluation කරන්නේ නෑ. TensorRT-LLM inference වේගවත් කරනවා. NeMo Guardrails safety rails දානවා.',
        'Base model එකක් (instruction tune කරලා නැති) HellaSwag වගේ MCQ එකක score කරන්නේ කොහොමද? ඒකට free text එකක් ලියන්න කියලා parse කරන්න අමාරුයි. ඉතින් harness එක හැම candidate answer එකකටම model එක දෙන log-likelihood එක ගණනය කරලා, වැඩිම එක තෝරනවා. ඒ නිසා instruction tuning නැති models වුණත් evaluate කරන්න පුළුවන්. GSM8K වගේ tasks වලට generation + answer extraction පාවිච්චි කරනවා. ප්‍රශ්නය: tokens වල log-probabilities එකතු කළාම, දිග answer එකකට tokens වැඩි නිසා ස්වභාවිකවම මුළු log-likelihood එක අඩුයි (හැම token එකකම log-prob එක negative නිසා). ඉතින් කෙටි answers වලට අසාධාරණ වාසියක්. "acc" කියන්නේ normalize නොකරපු එක. "acc_norm" කියන්නේ continuation එකේ දිගින් (bytes වලින්) බෙදලා normalize කරපු එක. ඒක answer-letter imbalance හෝ vocabulary size එකට අදාළ නෑ.',
        'එකම MMLU ප්‍රශ්න වලින් frameworks දෙකකින් වෙනස් ලකුණු එන්නේ ඇයි? Scoring ක්‍රමය වෙනස් නිසා: එකක් answer letter එකේ (A/B/C/D) probability එක විතරක් බලනවා, අනික full answer text එකේ log-likelihood එක බලනවා, තව එකක් free generation කරලා උත්තරය extract කරනවා. මේවා ටිකක් වෙනස් දේවල් මනිනවා, rankings පවා වෙනස් කරනවා. GPU vs CPU වෙනස නිසා එන්නේ ඉතා පොඩි numerical වෙනස්කම් විතරයි. Prompt format එකත් බලපානවා: answer delimiter එක හෝ options format කරන විදිහ විතරක් වෙනස් කළාම points 5ක් වෙනස් වෙන්න පුළුවන්. Robust practice: prompt templates කිහිපයක් පාවිච්චි කරලා mean සහ spread එක report කරන්න. සසඳන models හැමෝටම එකම templates. හැම model එකකටම එයාගේ හොඳම template එක තෝරලා report කරන එක පක්ෂග්‍රාහීයි. ඒ වගේම shots ගණනත් එකම වෙන්න ඕනේ: A 5-shot වල 70%, B zero-shot වල 66% නම් ඒවා කෙලින්ම සසඳන්න බෑ.',
        'Metric choice සහ "emergence": Model sizes දෙකක් අතර exact-match accuracy එක 0% සිට 60% ට හදිසියේ පනිනවා වගේ පේන්න පුළුවන්, ඒත් per-token log-likelihood එක සුමටව වැඩි වෙනවා. Exact match කියන්නේ "ඔක්කොම හරි නම් විතරයි ලකුණු" කියන discontinuous metric එකක්. ඉතින් ටිකෙන් ටික වෙන දියුණුව හදිසි පැනීමක් වගේ පේනවා. මේ "emergence" එකෙන් කොටසක් metric එකේ artifact එකක් වෙන්න පුළුවන්. Continuous metrics වලින් smoother scaling පේනවා, පොඩි models වලින් forecast කරන්න ඒක වැදගත්.',
      ],
      analogy: 'Exam paper එකක MCQ ලකුණු දානකොට, teacher කෙනෙක් "ළමයා රවුම් කරපු අකුර" විතරක් බලනවා. තව teacher කෙනෙක් "ළමයා ලියපු සම්පූර්ණ පිළිතුර" බලනවා. තුන්වෙනි කෙනා essay එකක් ලියවලා උත්තරය හොයනවා. එකම ළමයා, එකම ප්‍රශ්න, ඒත් ලකුණු තුනක්. ඒ වගේම paper එකේ font එක, options ලියපු විදිහ වෙනස් කළාමත් සමහර ළමයින්ගේ ලකුණු වෙනස් වෙනවා.',
      example: 'Emergence උදාහරණය: Answer එකට tokens 5ක් ඕනේ, හැම token එකක්ම හරි වෙන්න ඕනේ (exact match). Token එකක් හරි වෙන ඉඩ p නම් exact match ≈ p^5. පොඩි model එක: p = 0.5 → 0.5^5 ≈ 0.03 (3%). ලොකු model එක: p = 0.9 → 0.9^5 ≈ 0.59 (59%). Per-token ඉඩ 0.5 සිට 0.9 ට සුමටව ගියාට exact match එක 3% සිට 59% ට "පනිනවා" වගේ පේනවා. acc_norm උදාහරණය: Answer A tokens 2යි, log-likelihood −4 (token එකකට −2). Answer B tokens 10යි, log-likelihood −10 (token එකකට −1). acc (sum) A තෝරනවා (−4 > −10). Length එකෙන් normalize කළාම B ට හොඳ අගයක්, acc_norm B තෝරනවා.',
      keyPoints: [
        'lm-evaluation-harness = standard benchmarks + standard prompts/scoring. NeMo Evaluator = NVIDIA managed evaluation microservice.',
        'MCQ scoring = හැම option එකකම log-likelihood, වැඩිම එක. Base models වලට වැඩ කරනවා.',
        'acc_norm = දිගින් (bytes) normalize කරලා කෙටි answers වල වාසිය නැති කරනවා.',
        'Letter-prob vs full-text vs generation scoring නිසා MMLU ලකුණු වෙනස් වෙනවා. Shots, templates එකම වෙන්න ඕනේ.',
        'Templates කිහිපයකින් mean ± spread report කරන්න. All-or-nothing metrics "emergence" මායාවක් හදන්න පුළුවන්.',
      ],
      terms: [
        { en: 'lm-evaluation-harness', si: 'EleutherAI හදපු, benchmarks සිය ගණනක් standard විදිහට run කරන open-source tool එක.' },
        { en: 'NeMo Evaluator', si: 'NIM endpoints මත benchmarks, custom data, LLM-judge evaluations run කරන NVIDIA microservice එක.' },
        { en: 'Log-likelihood Scoring', si: 'හැම candidate answer එකකටම model එක දෙන log probability එක සසඳලා තෝරන ක්‍රමය.' },
        { en: 'acc_norm', si: 'Continuation length (bytes) එකෙන් normalize කරපු accuracy එක.' },
        { en: 'Prompt-format Sensitivity', si: 'Format එකේ පොඩි වෙනස්කම් නිසා benchmark ලකුණු ලොකුවට වෙනස් වෙන එක.' },
        { en: 'Emergent Abilities', si: 'Model size එක වැඩි වෙද්දී හදිසියේ පේන හැකියාවන්. සමහර විට metric එකේ artifact එකක්.' },
      ],
    },
    // 8
    {
      id: 'arena-elo-pairwise',
      title: 'Pairwise Evaluation: Chatbot Arena, MT-Bench, Win Rate, Elo and Bradley–Terry',
      si: 'පාසල් cricket තරගයක teams දෙකෙන් හොඳ එක තෝරන එක, එක එක team එකට ලකුණු 1-10 දෙනවට වඩා ලේසි වෙන්න පුළුවන්. Chatbot Arena එකේ users anonymous models දෙකක උත්තර සසඳලා vote කරනවා. Elo එකේ ලකුණු තරගයෙන් තරගයට update වෙන අතර Bradley–Terry එක සියලු තරග එකට බලනවා. A, B ට වඩා Elo points 400ක් ඉහළ නම් A දිනන බලාපොරොත්තු ඉඩ ආසන්නයෙන් 0.91යි.',
      examRefs: ['EVAL-019', 'EVAL-020', 'EVAL-040', 'EVAL-061', 'EVAL-069', 'EVAL-121'],
      body: [
        'Chatbot Arena (LMSYS / LMArena) එකේදී users ලා නම් නොපෙන්නන (anonymous) models දෙකක් එක්ක එකට chat කරලා හොඳ උත්තරයට vote කරනවා. මේ crowdsourced pairwise human votes, Elo / Bradley–Terry ratings වලට එකතු කරලා leaderboard එක හදනවා. MT-Bench වෙනස්: ඒකේ categories (writing, reasoning, math, coding…) වල two-turn ප්‍රශ්න 80ක් තියෙනවා. Multi-turn conversations, strong LLM judge කෙනෙක් (මුලින් GPT-4) score කරනවා. GPT-4 එක answer එකකට 1-10 ලකුණු දෙන එක MT-Bench එකේ "single-answer grading" mode එක. MT-Bench හිතාමතාම පොඩියි. ලොකු crowdsourced dataset එක Arena vote log එක.',
        'Pairwise vs pointwise: "මේ දෙකෙන් මොකද හොඳ?" කියන එක (pairwise) මිනිස්සුන්ට සහ LLM judges ලාට "මේකට 1-10 කීයද?" (pointwise) කියන එකට වඩා ලේසි සහ ස්ථාවරයි. Absolute scores 7, 8 වගේ අගයන් වටේ එකතු වෙනවා (cluster). ඉතින් ළඟින් තියෙන prompt variants දෙකක් අතර පොඩි වෙනස අල්ලන්න pairwise හොඳයි. ඒත් pairwise එකටත් position සහ verbosity bias තියෙනවා. Versions ගොඩක් absolute විදිහට track කරන්න ඕනේ නම් pairwise එක හොඳට scale වෙන්නේ නෑ.',
        'Elo system එක chess වලින් ආපු එකක්. Model A ගේ rating R_A, B ගේ R_B නම්, A දිනන්න බලාපොරොත්තු වෙන ඉඩ E_A = 1 ÷ (1 + 10^((R_B − R_A) ÷ 400)). වචන වලින්: rating වෙනස 400න් බෙදලා, 10 ඒ බලයට නංවලා, 1 එකතු කරලා, 1 ඒකෙන් බෙදනවා. Points 400ක වෙනසක් කියන්නේ ආසන්න වශයෙන් 10:1 odds. Online Elo එකේ හැම තරගයකටම පස්සේ ratings update කරනවා. ප්‍රශ්නය: ප්‍රතිඵලය තරග process කරපු පිළිවෙළ මත රඳා පවතිනවා. Elo හැදුවේ කාලයත් එක්ක හැකියාව වෙනස් වෙන ක්‍රීඩකයන්ට. Model checkpoints නම් වෙනස් වෙන්නේ නෑ. ඒ නිසා Chatbot Arena, හැම තරගයක්ම එකට ගෙන maximum-likelihood Bradley–Terry model එකක් fit කරන්න මාරු වුණා. ඒක order-independent, වඩා ස්ථාවරයි, bootstrap එකෙන් confidence intervals දෙනවා. Ratings තාමත් Elo වගේ scale එකක. Elo වලටත් ties අර්ධ ජයග්‍රහණ විදිහට handle කරන්න පුළුවන්.',
      ],
      analogy: 'පාසල් cricket tournament එකක teams ranking කරනවා කියලා හිතන්න. Online Elo කියන්නේ හැම match එකකටම පස්සේ ලකුණු table එක update කරන එක. Matches දාපු පිළිවෙළ වෙනස් කළොත් අන්තිම table එකත් ටිකක් වෙනස්. Bradley–Terry කියන්නේ season එක ඉවර වුණාම ඔක්කොම results එකට අරන් "හැම match එකක්ම හොඳින්ම පැහැදිලි කරන ranking එක" එක පාරක් ගණනය කරන එක. පිළිවෙළ වැදගත් නෑ.',
      example: 'Win rate: Baseline එකට එරෙහිව comparisons 100කින් A දිනුවා 55, පැරදුණා 25, ties 20. Tie එකක් අර්ධ ජයක් නම්: (55 + 0.5 × 20) ÷ 100 = 65 ÷ 100 = 0.65. Ties අමතක කළොත් 0.55. Ties denominator එකෙන් අයින් කළොත් 55 ÷ 80 = 0.69 (වෙනස් convention එකක්). Elo: A, B ට වඩා points 400ක් ඉහළයි. (R_B − R_A) ÷ 400 = −400 ÷ 400 = −1. 10^(−1) = 0.1. E_A = 1 ÷ (1 + 0.1) = 1 ÷ 1.1 ≈ 0.91. Points 200ක වෙනසක් නම්: 10^(−0.5) ≈ 0.316, E_A = 1 ÷ 1.316 ≈ 0.76.',
      keyPoints: [
        'Chatbot Arena = anonymous models දෙකක් අතර crowdsourced human votes → Elo / Bradley–Terry.',
        'MT-Bench = two-turn ප්‍රශ්න 80, LLM judge. Single-answer 1-10 grading mode එකක් තියෙනවා.',
        'Pairwise පොඩි වෙනස්කම් අල්ලන්න pointwise වලට වඩා ස්ථාවරයි, ඒත් biases තියෙනවා.',
        'E_A = 1/(1 + 10^((R_B − R_A)/400)). 400 → 0.91, 200 → 0.76.',
        'Bradley–Terry = සියලු තරග වලට joint MLE fit, order-independent, CIs එක්ක.',
      ],
      terms: [
        { en: 'Chatbot Arena', si: 'Anonymous models දෙකක් side-by-side, users vote කරන crowdsourced leaderboard එක.' },
        { en: 'MT-Bench', si: 'Two-turn ප්‍රශ්න 80ක්, LLM judge කෙනෙක් score කරන multi-turn benchmark එක.' },
        { en: 'Win Rate', si: 'Baseline එකට එරෙහිව දිනපු ප්‍රමාණය. Ties අර්ධ ජය විදිහට ගණන් කරන්න පුළුවන්.' },
        { en: 'Elo Rating', si: 'Chess වලින් ආපු, තරගයෙන් තරගයට update වෙන rating system එක.' },
        { en: 'Bradley–Terry Model', si: 'හැම pairwise ප්‍රතිඵලයක්ම එකට අරන් හැම model එකකටම strength එකක් fit කරන statistical model එක.' },
        { en: 'Pointwise vs Pairwise', si: 'එක output එකකට absolute ලකුණක් vs outputs දෙකක් සසඳලා හොඳ එක තෝරන එක.' },
      ],
    },
    // 9
    {
      id: 'llm-as-a-judge',
      title: 'LLM-as-a-Judge: Biases, Rubrics, G-Eval, Reference Guidance, Panels and Validation',
      si: 'පාසල් නාට්‍ය තරගයක විනිසුරුවෙක් වගේ LLM judge එකත් output එකකට ලකුණු දෙනවා. ඒත් පළමුවෙන් පෙන්වූ එකට, දිග උත්තරයට, තමන්ගේම model family එකට කැමති වෙන්න පුළුවන්. උත්තර දෙකේ පිළිවෙළ මාරු කරලා දෙවරක් බලන්න, පැහැදිලි rubric එකක් දෙන්න, අවශ්‍ය නම් judges තුන්දෙනෙක්ගෙන් panel එකක් ගන්න. Release කරන්න කලින් judge එක human labels එක්ක කොච්චර එකඟද කියලා පරීක්ෂා කරන්න.',
      examRefs: ['EVAL-022', 'EVAL-024', 'EVAL-025', 'EVAL-060', 'EVAL-062', 'EVAL-063', 'EVAL-122', 'EVAL-123', 'EVAL-124', 'EVAL-126', 'EVAL-150'],
      body: [
        'LLM-as-a-judge කියන්නේ strong LLM එකකට prompt එකක් හෝ rubric එකක් දීලා, වෙනත් model එකක outputs score කරන්න (pointwise) හෝ සසඳන්න (pairwise) කියන එක. N-gram metrics අසාර්ථක වෙන open-ended outputs ලාභෙට, ලොකු ප්‍රමාණයකට evaluate කරන්න පුළුවන්. ඒත් judges ලට biases තියෙනවා. ඒ නිසා human judgments එක්ක validate කරන්නම ඕනේ. Release තීරණ ගන්න කලින් පළමු පියවර: representative sample එකක human labels එක්ක judge ගේ agreement එක (agreement rate හෝ kappa) මනින්න. Judge model එක ලොකු වුණා කියලා ඔයාගේ criteria එකට ගැළපෙනවා කියලා සහතිකයක් නෑ.',
        'ප්‍රධාන biases තුනයි. (1) Position bias: pairwise එකේ පළමු (හෝ දෙවෙනි) තැනේ තියෙන උත්තරයට කැමැත්තක්. Mitigation: හැම pair එකක්ම orders දෙකෙන්ම (A-B, B-A) evaluate කරලා, ප්‍රතිඵල දෙකම එකඟ නම් විතරක් ගණන් කරන්න, නැත්නම් tie එකක් විදිහට ගන්න. Baseline එක හැම වෙලේම පළමුවෙනි තැනට දාන එකෙන් bias එක නැති වෙන්නේ නෑ, හැම comparison එකම එකම පැත්තට ඇදෙනවා. (2) Verbosity (length) bias: අමතර නිවැරදි තොරතුරක් නැතුවත් දිග උත්තර වලට වැඩි ලකුණු. Mitigation: padding වලට penalty දෙන rubrics, reference answers, length-controlled win rate. AlpacaEval 2.0 ගේ length-controlled win rate එක, judge preference එකට length වෙනසේ බලපෑම regression එකකින් අයින් කරලා report කරනවා. Responses දෙකම tokens 50 කට කපන එක (truncate) හොඳ නෑ, සම්පූර්ණ උත්තර කැපෙනවා. (3) Self-preference bias: judge තමන්ගේම හෝ තමන්ගේ family එකේ outputs වලට කැමතියි. Mitigation: වෙනත් judge model එකක්, judges panel එකක්, human labels එක්ක validate කිරීම.',
        'Rubric design: Judge එක reruns වලදී 1-5 ලකුණු අස්ථාවර නම්, හැම score level එකක්ම පැහැදිලි, නිරීක්ෂණය කරන්න පුළුවන් criteria සහ උදාහරණ එක්ක define කරන්න (anchored rubric). 1-100 scale එකක් වැඩි resolution එකක් දෙනවා වගේ පේනවා, ඒත් බොරු precision එකක් එක්ක variance වැඩි කරනවා. G-Eval: judge chain-of-thought evaluation steps වලින් හිතලා, අන්තිම score එක "possible score tokens වල probability-weighted sum" එක විදිහට ගණනය කරනවා. Judges සාමාන්‍යයෙන් integers කිහිපයක් විතරයි දෙන්නේ, ties ගොඩක්. Probabilities වලින් weight කළාම continuous expected score එකක්, humans එක්ක වඩා හොඳ correlation එකක්. Position bias එකට ඒකෙන් කිසිම උදව්වක් නෑ.',
        'Reference-guided judging: Judge ට තනියම විසඳන්න බැරි math ප්‍රශ්න වලදී, විශ්වාසයෙන් ලියපු වැරදි උත්තරයක් ඒක approve කරන්න පුළුවන්. MT-Bench authors ලා යෝජනා කළේ judge ට නිවැරදි reference solution එකක් දීලා ඒකත් එක්ක සසඳන්න කියන එක. ඒකෙන් math grading errors ගොඩක් අඩු වුණා. Panel of judges: එක ලොකු proprietary judge කෙනෙක් වෙනුවට, වෙනස් model families වල පොඩි judges තුන්දෙනෙක් පාවිච්චි කරලා votes එකතු කරන එක. Self-preference වගේ intra-model bias එකයි variance එකයි අඩු කරනවා, බොහෝ විට ලාභෙට. ඒත් panel එකත් humans එක්ක check කරන්න ඕනේ. Judge-human agreement ceiling: MT-Bench study එකේ strong judge කෙනෙක් pairwise preferences වල human experts ලා එක්ක එකඟ වුණේ ආසන්න වශයෙන් 80%, human experts ලා එකිනෙකා එක්ක එකඟ වුණෙත් ඒ තරමයි. Human labels ත් noisy නිසා, human-human agreement එක ප්‍රායෝගික ceiling එකක්. ඒක ළඟට එනවා කියන්නේ ඒ task setting එකට judge සාධාරණ proxy එකක් කියන එක, හැම task එකකටම humans ව සම්පූර්ණයෙන් replace කරන්න පුළුවන් කියන එක නෙවෙයි.',
      ],
      analogy: 'පාසල් නාට්‍ය තරගයක විනිසුරුවෙක් හිතන්න. පළමුවෙනියට රඟපාපු කණ්ඩායමට කැමැත්තක් තියෙනවා (position bias). දිග නාට්‍ය "ලොකු වැඩක්" කියලා හිතනවා (verbosity bias). තමන්ගේම පාසලේ කණ්ඩායමට කැමතියි (self-preference). ඒ නිසා අපි විනිසුරුවන් තුන්දෙනෙක් (panel) ගන්නවා, පිළිවෙළ මාරු කරනවා, ලකුණු දෙන නීති (rubric) ලියලා දෙනවා, කලින් තරගයක ප්‍රවීණයන් එක්ක එයාගේ ලකුණු ගැළපෙනවද කියලා බලනවා.',
      example: 'G-Eval: Judge 1-5 scale එකේ score tokens වලට දෙන probabilities: 3 → 0.2, 4 → 0.5, 5 → 0.3. Integer එක විතරක් ගත්තොත් 4. Weighted sum = 3 × 0.2 + 4 × 0.5 + 5 × 0.3 = 0.6 + 2.0 + 1.5 = 4.1. තව උත්තරයකට 3.7 ලැබුණොත් දෙකම "4" වුණත් අපිට වෙනස පේනවා. Position swap: Pair එක A-B order එකෙන් judge "A" කියනවා. B-A order එකෙන් (දැන් A දෙවෙනියට) judge "පළමු එක", ඒ කියන්නේ "B" කියනවා. ප්‍රතිඵල දෙක එකඟ නෑ → tie එකක් විදිහට ගන්නවා.',
      keyPoints: [
        'LLM judge = ලාභ, scalable. ඒත් release තීරණ වලට කලින් human labels එක්ක validate කරන්නම ඕනේ.',
        'Position bias → orders දෙකම, consistent verdicts විතරයි. Verbosity → rubric, reference, length-controlled win rate. Self-preference → වෙනස් judge / panel.',
        'Anchored rubrics consistency වැඩි කරනවා. 1-100 scale එක variance වැඩි කරනවා.',
        'G-Eval = CoT + probability-weighted score → ties අඩුයි. Math වලට reference-guided judging.',
        'Judge-human ≈ human-human (~80%) = ඒ setting එකට හොඳ proxy, blanket replacement නෙවෙයි.',
      ],
      terms: [
        { en: 'Position Bias', si: 'Pairwise එකේ order එක අනුව එක තැනකට කැමති වෙන bias එක.' },
        { en: 'Verbosity (Length) Bias', si: 'වැඩි තොරතුරක් නැතුවත් දිග උත්තර වලට කැමති වෙන bias එක.' },
        { en: 'Self-Preference Bias', si: 'Judge තමන්ගේම / family එකේ style එකට කැමති වෙන bias එක.' },
        { en: 'Length-Controlled Win Rate', si: 'Length වෙනසේ බලපෑම regression එකකින් අයින් කරපු win rate (AlpacaEval 2.0).' },
        { en: 'G-Eval', si: 'CoT evaluation steps + score tokens වල probability-weighted sum.' },
        { en: 'Reference-Guided Judging', si: 'Judge ට නිවැරදි reference answer එකක් දීලා සසඳන්න කියන ක්‍රමය.' },
        { en: 'Panel of Judges (PoLL)', si: 'වෙනස් model families වල judges කිහිපදෙනෙක්ගේ votes එකතු කිරීම.' },
      ],
    },
    // 10
    {
      id: 'hallucination-faithfulness',
      title: 'Faithfulness and Hallucination Evaluation: NLI, SelfCheckGPT, FActScore',
      si: 'ඔයාට බැංකුවේ FAQ document එකකින් උත්තර දෙන bot එකක් තියෙනවා කියලා හිතන්න. උත්තරය ඇත්ත වුණත් ඒ document එකෙන් සහාය නොලැබේ නම් faithfulness අඩුයි. NLI, SelfCheckGPT, FActScore වගේ ක්‍රම claims සහ evidence අතර සම්බන්ධය පරීක්ෂා කරනවා. නිවැරදි බව, source එකට faithful වීම, සහ ප්‍රශ්නයට පිළිතුරු දීම වෙන වෙනම මනින්න.',
      examRefs: ['EVAL-046', 'EVAL-091', 'EVAL-098', 'EVAL-099', 'EVAL-100'],
      body: [
        'Summary එකක source document එකේ නැති facts එකතු වෙනවා නම් ඒක hallucination එකක්. ඒක කෙලින්ම මනින dimension එක faithfulness (factual consistency with the source): output එකේ හැම claim එකක්ම input එකෙන් support වෙනවද කියන එක. Fluency කියන්නේ කියවන්න ලස්සනද කියන එක විතරයි. ROUGE-2 recall කියන්නේ reference content එක කොච්චර cover වුණාද කියන එක. බොරු facts එකතු කළත් ROUGE ඉහළින් තියෙන්න පුළුවන්. Source එකේ perplexity එකත් fluency විතරයි පෙන්නන්නේ.',
        'NLI (Natural Language Inference) model එකකින් faithfulness මනින හැටි: source document එක premise එක, summary එකේ හැම වාක්‍යයක්ම hypothesis එක. NLI model එක "entailment" (support වෙනවා), "neutral" (support නෑ), "contradiction" (විරුද්ධයි) කියලා කියනවා. Neutral හෝ contradiction ආවොත් hallucination එකක් කියලා flag කරනවා.',
        'Reference එකක්වත් retrieval source එකක්වත් නැත්නම්? SelfCheckGPT idea එක: එකම ප්‍රශ්නයට responses කිහිපයක් sample කරලා ඒවායේ facts එකඟද කියලා බලනවා. Model එක fact එක ඇත්තටම දන්නවා නම් samples එකඟයි. Hallucinate කරන details sample එකෙන් sample එකට වෙනස් වෙනවා. BERTScore වලට reference එකක් ඕනේ, ඒ නිසා මෙතනට ගැළපෙන්නේ නෑ. FActScore: දිග biography එකක් වගේ output එකක් කෙටි "atomic facts" වලට කඩලා, knowledge source එකකින් (Wikipedia වගේ) support වෙන ප්‍රතිශතය report කරනවා. එක true/false තීරණයකින් අර්ධ වශයෙන් හරි outputs හැංගෙනවා. Atomic facts වලින් fine-grained factual precision එකක් ලැබෙනවා.',
        'Metrics එකිනෙකට පටහැනි වුණාම use case එකේ අවදානම අනුව තීරණය කරන්න. Medical records summarization එකකදී ROUGE-L ටිකක් වැඩි, ඒත් faithfulness අඩු model එකකට වඩා, faithfulness ගොඩක් වැඩි model එක තමයි හරි. ROUGE wording overlap එකට ලකුණු දෙනවා, බොරු content වලට penalty නෑ.',
      ],
      analogy: 'පත්තර වාර්තාකරුවෙක් පොලිස් ප්‍රකාශයක් summarize කරනවා. ප්‍රකාශයේ නැති "සැකකරු කළු shirt එකක් ඇඳන් හිටියා" කියලා එකතු කළොත්, ලස්සනට ලිව්වත් (fluency) ඒක බොරුවක්. Editor කරන්නේ වාර්තාවේ හැම වාක්‍යයක්ම මුල් ප්‍රකාශයෙන් ඔප්පු වෙනවද කියලා එකින් එක check කරන එක (NLI / FActScore). Source එක නැත්නම්, එකම කතාව සාක්ෂිකරුවන් පස්දෙනෙක්ගෙන් අහලා කතා ගැළපෙනවද බලනවා (SelfCheckGPT).',
      example: 'Summarizer S1: ROUGE-L 0.42, faithfulness 0.71. S2: ROUGE-L 0.38, faithfulness 0.93. Medical use case එකට S2 තෝරනවා. ඇයි? S1 ගේ claims වලින් 29%ක් support නෑ, S2 ගේ 7%ක් විතරයි. ROUGE-L එකේ 0.04 වාසිය රෝගියෙකුට වැරදි බෙහෙතක් කියන එකේ අවදානමට වටින්නේ නෑ. FActScore: Biography එකක atomic facts 20ක් තියෙනවා, Wikipedia එකෙන් 15ක් support වෙනවා. FActScore = 15 ÷ 20 = 0.75.',
      keyPoints: [
        'Faithfulness = output එකේ claims source එකෙන් support වෙනවද. ROUGE / fluency / perplexity hallucination අල්ලන්නේ නෑ.',
        'NLI: source = premise, summary sentence = hypothesis. Neutral / contradiction = flag.',
        'SelfCheckGPT: samples අතර inconsistency = hallucination සලකුණක්. Reference ඕනේ නෑ.',
        'FActScore = atomic facts වලින් support වෙන ප්‍රතිශතය.',
        'High-stakes domain එකේ overlap වලට වඩා faithfulness වැදගත්.',
      ],
      terms: [
        { en: 'Faithfulness / Factual Consistency', si: 'Output එකේ හැම claim එකක්ම source එකෙන් support වෙන තරම.' },
        { en: 'Hallucination', si: 'Source එකේ හෝ ඇත්ත ලෝකයේ නැති, model එක හදාගත්ත තොරතුරු.' },
        { en: 'Natural Language Inference (NLI)', si: 'Premise එකෙන් hypothesis එක entail / neutral / contradict වෙනවද කියලා classify කරන task එක.' },
        { en: 'SelfCheckGPT', si: 'Samples කිහිපයක් අතර එකඟතාවෙන් hallucination හඳුනාගන්න sampling-based ක්‍රමය.' },
        { en: 'FActScore', si: 'Long-form text atomic facts වලට කඩලා support වෙන ප්‍රතිශතය ගණනය කරන metric එක.' },
      ],
    },
    // 11
    {
      id: 'human-eval-agreement',
      title: 'Human Evaluation and Agreement: Cohen’s Kappa, Krippendorff’s Alpha, Kappa Paradox, Metric Validation',
      si: 'දෙන්නෙක් උත්තර 10කින් 8කට එකඟ නම් raw agreement 80%යි. ඒත් අහම්බෙන්ම එකඟ වෙන ප්‍රමාණයත් ඉවත් කරලා Cohen’s kappa ගණන් කරනවා. pₒ = 0.80 සහ pₑ = 0.50 නම් κ = (0.80−0.50)/(1−0.50) = 0.60. Labels බොහොමයක් “safe” වගේ එක පැත්තකට නම් 95% agreement තිබුණත් kappa අඩු වෙන්න පුළුවන්.',
      examRefs: ['EVAL-026', 'EVAL-027', 'EVAL-028', 'EVAL-038', 'EVAL-058', 'EVAL-059', 'EVAL-125'],
      body: [
        'Human evaluation වඩාත්ම වටින්නේ outputs open-ended වුණාම, helpfulness, tone, factual nuance වගේ subtle ගුණාංග වැදගත් වුණාම. Overlap metrics ඒවා අල්ලන්නේ නෑ. ඒ නිසා open-ended generation වලට human evaluation තාමත් reference standard එක. හැබැයි exact උත්තරයක් තියෙන task එකකට, හෝ CI එකේ පැයකට evaluations දහස් ගණනක් ඕනේ නම්, automatic metrics ලාභයි, ප්‍රමාණවත්.',
        'Inter-annotator agreement report කරන්නේ ඇයි? Rating task එක හොඳින් define කරලාද, raters ලා අතර labels ස්ථාවරද කියලා බලන්න. Agreement අඩු නම් guidelines අපැහැදිලියි හෝ task එක subjective. එතකොට ඒ labels උඩ හදන ඕනෑම model score එකක් විශ්වාස කරන්න අමාරුයි. ඒ වගේම ඒක ceiling එකක්: මිනිස්සු එකිනෙකා එක්ක එකඟ වෙනවාට වඩා model එකකට "මිනිස්සු එක්ක එකඟ වෙන්න" බෑ.',
        'Raw percent agreement එකේ ප්‍රශ්නය: අහම්බෙන් වුණත් raters එකඟ වෙනවා. Cohen’s kappa ඒක correct කරනවා: κ = (p_o − p_e) ÷ (1 − p_e). p_o = ඇත්තටම එකඟ වුණ ප්‍රමාණය. p_e = එක එක rater ගේ label frequencies අනුව අහම්බෙන් එකඟ වෙන්න බලාපොරොත්තු වෙන ප්‍රමාණය. වචන වලින්: "chance එකට වඩා කොච්චර වැඩිපුර එකඟ වුණාද" ÷ "chance එකට වඩා උපරිම වශයෙන් එකඟ වෙන්න තිබුණු ප්‍රමාණය". Cohen’s kappa raters දෙදෙනෙකුට, එකම items, nominal labels වලට. Raters ගොඩක් නම් Fleiss’ kappa. Raters ගොඩක්, හැමෝම හැම item එකම rate කරලා නැති (missing ratings), 1-5 වගේ ordinal scale එකක් නම් Krippendorff’s alpha තමයි හරි.',
        'Kappa paradox: Labels වලින් 94%ක් "safe" නම්, raters දෙන්නාම හැමදේටම "safe" කිව්වත් ගොඩක් වෙලාවට එකඟ වෙනවා. ඉතින් p_e ගොඩක් ඉහළයි (0.9 ට ළං). 95%ක් එකඟ වුණත් kappa එක පොඩියි. ඒක ගණනය කිරීමේ වැරැද්දක් නෙවෙයි. Kappa එක prevalence එක සහ rare class එකේ agreement එකත් එක්ක report කරන්න. අලුත් automatic metric එකක් (උදා: summary quality metric එකක්) humans ලා වගේම outputs order කරනවද කියලා බලන්න Spearman rank correlation (හෝ Kendall’s tau) පාවිච්චි කරනවා. Scales දෙකක් වෙනස් වුණත් rank order එක සසඳන්න පුළුවන්. Kappa එක categorical labels වලට, scales වෙනස් continuous scores වලට නෙවෙයි.',
      ],
      analogy: 'Cricket match එකක umpires දෙන්නෙක් හිතන්න. Bowler හැම වෙලේම leg side එකෙන් පිට යන balls දානවා නම්, umpires දෙන්නාම "not out" කියලා 95%ක් එකඟ වෙනවා. ඒත් ඒක ඔවුන්ගේ හැකියාව නිසා නෙවෙයි, ගොඩක් balls පැහැදිලිවම not out නිසා. ඇත්ත පරීක්ෂණය අමාරු LBW decisions වලදී එකඟ වෙනවද කියන එක. Kappa කරන්නේ ඒ "ලේසි එකඟතාව" අයින් කරලා බලන එක.',
      example: 'Raters දෙන්නා items වලින් 80%ක එකඟයි (p_o = 0.80). ඔවුන්ගේ label frequencies අනුව chance agreement 50%යි (p_e = 0.50). κ = (0.80 − 0.50) ÷ (1 − 0.50) = 0.30 ÷ 0.50 = 0.60. මේක moderate-to-substantial agreement. 0.30 කියලා කිව්වොත් (1 − p_e) න් බෙදන්න අමතක වෙලා. Paradox එක: p_o = 0.95, p_e = 0.93 නම් κ = (0.95 − 0.93) ÷ (1 − 0.93) = 0.02 ÷ 0.07 ≈ 0.29. Percent agreement 95%, kappa 0.3 විතරයි. p_e කොහෙන්ද? Rater 1 "Yes" 60%, rater 2 "Yes" 70% නම්, දෙන්නාම අහම්බෙන් "Yes" = 0.6 × 0.7 = 0.42, දෙන්නාම "No" = 0.4 × 0.3 = 0.12. p_e = 0.42 + 0.12 = 0.54.',
      keyPoints: [
        'Human eval = open-ended, nuanced ගුණාංග වලට gold standard. Exact-answer / high-volume CI වලට automatic metrics.',
        'Agreement අඩු = task එක අපැහැදිලියි. Human-human agreement = model-human agreement එකේ ceiling එක.',
        'κ = (p_o − p_e)/(1 − p_e). Chance agreement correct කරනවා. Raters 2යි.',
        'Raters ගොඩක් + missing + ordinal → Krippendorff’s alpha. Raters ගොඩක් nominal → Fleiss’ kappa.',
        'Skewed labels → kappa paradox. Metric vs humans validate කරන්න Spearman / Kendall.',
      ],
      terms: [
        { en: 'Inter-Annotator Agreement', si: 'Annotators ලා එකම items වලට කොච්චර එකම labels දෙනවද කියන මිනුම.' },
        { en: 'Cohen’s Kappa', si: 'Raters දෙදෙනෙක් අතර chance-corrected agreement එක.' },
        { en: 'Fleiss’ Kappa', si: 'Raters දෙදෙනෙකුට වඩා nominal labels වලට kappa එක.' },
        { en: 'Krippendorff’s Alpha', si: 'ඕනෑම raters ගණනක්, missing ratings, nominal/ordinal/interval data handle කරන agreement මිනුම.' },
        { en: 'Kappa Paradox', si: 'Labels ගොඩක් skewed නම් percent agreement ඉහළ වුණත් kappa අඩු වෙන එක.' },
        { en: 'Spearman Rank Correlation', si: 'අගයන් දෙකක ranks එකම පිළිවෙළටද යන්නේ කියලා මනින correlation එක.' },
      ],
    },
    // 12
    {
      id: 'contamination-goodhart',
      title: 'Benchmark Contamination, Canary Strings, Saturation and Goodhart’s Law',
      si: 'පන්තියේ විභාග ප්‍රශ්න කලින්ම දැකලා පිළිතුරු මතක තියාගත්ත ළමයෙක්ගේ ලකුණ සැබෑ දැනුම පෙන්වන්නේ නෑ. Benchmark ප්‍රශ්න training data එකේ තිබුණොත් model එකටත් ඒ වගේ contamination එකක් වෙන්න පුළුවන්. Canary string එක unique GUID එකක් දාලා data leak එක හඳුනාගන්න උදව් කරනවා, encryption එකක් නෙවෙයි. හැමෝම එකම ලකුණට optimize කළාම measure එකේ වටිනාකම අඩුවෙන එක Goodhart’s Law එකයි.',
      examRefs: ['EVAL-021', 'EVAL-064', 'EVAL-065', 'EVAL-081', 'EVAL-108', 'EVAL-119', 'EVAL-120', 'EVAL-149'],
      body: [
        'Benchmark (data) contamination කියන්නේ test ප්‍රශ්න pretraining crawl එකට (training data එකට) ගිහින් තියෙන එක. එතකොට ලකුණ පෙන්නන්නේ generalization නෙවෙයි, memorization. Distribution shift කියන්නේ විරුද්ධ තත්ත්වය: test data, model එක දැකපු දේට වඩා වෙනස්. Contamination හොයන පොදු ක්‍රමය: benchmark items සහ training documents අතර දිග n-gram overlaps හොයන එක. GPT-3 paper එකේ 13-gram check එක උදාහරණයක්. Few-shot examples ගණන වෙනස් කරන එකෙන් leak වුණාද කියලා කිසිම දෙයක් කියන්නේ නෑ.',
        'Canary string: BIG-bench වගේ benchmarks වල files වල unique GUID string එකක් දාලා තියෙනවා. Crawlers ට ඒ string එක තියෙන ඕනෑම document එකක් training data එකෙන් අයින් කරන්න පුළුවන්. Model එකකට ඒ canary string එක ලියන්න පුළුවන් නම්, benchmark එක training data එකට leak වුණා කියන එකට සාක්ෂියක්. ඒකෙන් කිසිවක් encrypt කරන්නේ නෑ, data තාමත් plain text.',
        'Training data එක බලන්න බැරි නම්? Min-k% probability: Text එකේ අඩුම probability තියෙන k% tokens වල log-probabilities වල සාමාන්‍යය ගන්නවා. කවදාවත් දැකලා නැති text එකක සාමාන්‍යයෙන් පුදුම සහගත, අඩු probability tokens ටිකක් තියෙනවා. Memorize කරපු text එකේ එහෙම outliers අඩුයි, ඉතින් අගය අසාමාන්‍ය ලෙස ඉහළයි. මේක membership-inference heuristic එකක්, නොදැකපු text එකක් එක්ක calibrate කරන්න ඕනේ. Perturbation check: Model එකක් public math benchmark එකේ 92%, එකම ප්‍රශ්න අලුත් අංක සහ නම් එක්ක නැවත ලිව්වාම 71%. අමාරුකම සමාන නම්, ලොකු පහත වැටීම original items memorize කරලා කියන එකට සලකුණක් (GSM1K-style studies). Contamination-resistant design: LiveCodeBench වගේ "live" benchmarks, හැම model එකකම training cutoff එකට පස්සේ release වුණ අලුත් problems විතරක් එකතු කරලා ඒවායින් විතරක් evaluate කරනවා. Function names මාරු කරන එක වගේ නොගැඹුරු වෙනස්කම් මදි.',
        'Saturation: Frontier models ඔක්කොම benchmark එකක 90%ට වඩා ගන්නවා, ඔවුන් අතර වෙනස run-to-run noise එක ඇතුළේ නම්, ඒ benchmark එක saturated. Ceiling එක ළඟ label noise එකත් තියෙනවා. තවත් seeds run කළාට headroom එකක් හැදෙන්නේ නෑ. අමාරු successors හෝ ඔයාගේම task-specific evals පාවිච්චි කරන්න. Goodhart’s law: "When a measure becomes a target, it ceases to be a good measure." එක public leaderboard එකකට prompts ගොඩක් tune කළාම ලකුණු වැඩි වෙනවා, ඒත් users ලාට කිසිම දියුණුවක් දැනෙන්නේ නෑ. Benchmark එකේ quirks exploit කරලා ඒකට overfit වෙනවා. Held-out evals rotate කරන එකෙන්, users ලා එක්ක check කරන එකෙන් මේක වළක්වන්න පුළුවන්.',
      ],
      analogy: 'A/L exam එකට කලින් paper එක leak වුණා කියලා හිතන්න. ළමයෙක් 100 ගත්තත් ඒක දැනුම නිසාද, උත්තර කටපාඩම් කරපු නිසාද කියලා කියන්න බෑ (contamination). පරීක්ෂා කරන්න එකම ගණන් අලුත් අංක එක්ක දෙනවා (perturbation). ලකුණු ගොඩක් වැටුණොත් කටපාඩම්. Tuition class එකක් past papers වලට විතරක් උගන්නනවා නම් ළමයින්ට ලකුණු ලැබෙනවා, ඒත් විෂය තේරෙන්නේ නෑ (Goodhart).',
      example: 'Perturbation check: Original GSM-style benchmark එකේ 92%. "කමල් ට අඹ 5ක්" වෙනුවට "නිමල් ට අඹ 8ක්" වගේ අලුත් නම් සහ අංක දාලා ලියපු version එකේ 71%. 92 − 71 = points 21ක වැටීමක්. අමාරුකම එකම නිසා, model එක surface forms මතක තියාගෙන කියන එකට ශක්තිමත් සාක්ෂියක්. Saturation: Models තුනක් 91.2%, 91.5%, 91.0%. Run-to-run noise ±0.5. වෙනස් කිසිවක් අර්ථවත් නෑ. ඔයාගේ customer-support evals එකේ එවැනි models තුන test කරන්න.',
      keyPoints: [
        'Contamination = test data training එකට leak වීම → inflated scores. Long n-gram overlap (13-gram) එකෙන් හොයනවා.',
        'Canary GUID = filter කරන්න + memorization detect කරන්න. Encryption නෙවෙයි.',
        'Min-k% prob = data නැතුව membership inference. Perturbed variants වල ලොකු drop = memorization.',
        'Live benchmarks (LiveCodeBench) = training cutoff එකට පස්සේ problems විතරයි.',
        'Saturated benchmark → අමාරු / task-specific evals. Goodhart: target එකක් වුණ measure එක නරක් වෙනවා.',
      ],
      terms: [
        { en: 'Benchmark Contamination', si: 'Benchmark test items training data එකට ඇතුළු වී තිබීම.' },
        { en: 'Canary String', si: 'Benchmark files වල දාන unique GUID එක. Training filter සහ leak detect කරන්න.' },
        { en: 'Min-k% Probability', si: 'අඩුම probability tokens k% වල සාමාන්‍ය log-prob. ඉහළ නම් memorization සැකයක්.' },
        { en: 'Membership Inference', si: 'Text එකක් training data එකේ තිබුණාද කියලා model එකේ behavior එකෙන් අනුමාන කිරීම.' },
        { en: 'Benchmark Saturation', si: 'Top models ඔක්කොම ceiling එක ළඟ, benchmark එකට ඔවුන්ව වෙන් කරන්න බැරි තත්ත්වය.' },
        { en: 'Goodhart’s Law', si: 'Measure එකක් target එකක් වුණාම ඒක හොඳ measure එකක් නොවී යනවා.' },
      ],
    },
    // 13
    {
      id: 'calibration',
      title: 'Calibration: ECE, Temperature Scaling and the Effect of Alignment',
      si: 'කාලගුණ වාර්තාව 80% වැස්ස කියන දවස් 10කින් 8ක වැස්සොත් ඒක calibrated. Bin එකක confidence 0.9 සහ accuracy 0.7 නම් gap එක 0.2යි. ECE එකේ gaps samples ගණනෙන් weight කරනවා. Temperature T=2 දාලා logits [4,2,1] → [2,1,0.5] වුණත් ලොකුම logit එක පළවෙනි එකම නිසා prediction එක වෙනස් වෙන්නේ නෑ.',
      examRefs: ['EVAL-043', 'EVAL-044', 'EVAL-132', 'EVAL-133', 'EVAL-134'],
      body: [
        'Model එකක් well calibrated කියන්නේ, ඒක කියන confidence එක ඇත්ත accuracy එකට ගැළපෙනවා කියන එක. 80% confidence එකෙන් කියන predictions වලින් ආසන්න වශයෙන් 80%ක් හරි නම් ඒක calibrated. Calibration කියන්නේ probabilities වල විශ්වසනීයත්වය, accuracy එක නෙවෙයි. Model එකක් accurate වුණත් overconfident වෙන්න පුළුවන්. ඇත්තටම විශ්වාස නැති වෙලාවල probabilities 0 හෝ 1 ට තල්ලු කරන එක calibration එක නරක් කරනවා.',
        'Expected Calibration Error (ECE) ගණනය කරන හැටි: (1) Predictions confidence අනුව bins වලට බෙදනවා (උදා: 0.5-0.6, 0.6-0.7…). (2) හැම bin එකකම සාමාන්‍ය confidence එකයි ඇත්ත accuracy එකයි අතර වෙනස (absolute gap) ගන්නවා. (3) ඒ gaps, හැම bin එකකම samples ප්‍රමාණය අනුව weight කරලා සාමාන්‍යය ගන්නවා. Samples ගොඩක් තියෙන bin එකකට වැඩි බරක්. Bins අතර උපරිම gap එක ECE නෙවෙයි, ඒක Maximum Calibration Error (MCE).',
        'Temperature scaling: Overconfident model එකක logits ඔක්කොම validation set එකකින් fit කරපු එක scalar එකකින් (T > 1) බෙදනවා. Probabilities මෘදු වෙනවා. Positive constant එකකින් බෙදුවාට logits වල පිළිවෙළ වෙනස් වෙන්නේ නෑ, ඉතින් argmax (predicted label) එකම, accuracy එක වෙනස් වෙන්නේ නෑ. ECE සහ NLL වගේ calibration metrics විතරයි හොඳ වෙන්නේ. Accuracy trade-off එකක් නැති නිසා post-hoc fix එකක් විදිහට ජනප්‍රියයි.',
        'Alignment වලින් calibration: GPT-4 technical report එකේ පෙන්නුවා pretrained model එකේ multiple-choice confidence එක හොඳට calibrated කියලා. RLHF වගේ post-training වලට පස්සේ helpfulness වැඩි වුණත් calibration එක පැහැදිලිවම නරක් වුණා. Preference optimization එක model එක data distribution එකට ගැළපෙන එකෙන් ඈත් කරලා, විශ්වාසයෙන් කියන විශේෂ උත්තර වලට තල්ලු කරනවා. ඉතින් token probabilities confidence එකක් විදිහට පාවිච්චි කරනවා නම් alignment එකට පස්සේ calibration ආයෙත් මනින්න.',
      ],
      analogy: 'කාලගුණ වාර්තාකරුවෙක් "අද වැස්ස 80%" කියලා දවස් 10ක කිව්වා. ඒ දවස් 10න් 8ක වැස්සා නම් එයා calibrated. දවස් 10ම "100% sure" කියලා 6 දවසක් විතරක් වැස්සා නම් එයා overconfident. Temperature scaling කියන්නේ එයාට "ඔයාගේ % ටිකක් අඩු කරලා කියන්න" කියන එක. වැස්ස එන දවස් ගැන එයාගේ "ඔව්/නෑ" අනුමානය වෙනස් වෙන්නේ නෑ, % විතරයි.',
      example: 'Bins දෙකක්: Bin 1 → samples 60, සාමාන්‍ය confidence 0.9, accuracy 0.7. Gap = |0.9 − 0.7| = 0.2. Bin 2 → samples 40, confidence 0.6, accuracy 0.6. Gap = 0. මුළු samples 100. ECE = (60/100) × 0.2 + (40/100) × 0 = 0.12 + 0 = 0.12. Weight නොකර සාමාන්‍යය ගත්තොත් (0.2 + 0) ÷ 2 = 0.10, ඒක වැරදියි. Temperature scaling: logits [4, 2, 1], T = 2 → [2, 1, 0.5]. පළමු එක තාමත් ලොකුම නිසා prediction එකම.',
      code: {
        lang: 'python',
        src: `# ECE: bins වල gap, sample ගණනින් weight කරලා
bins = [  # (samples, avg_confidence, accuracy)
    (60, 0.9, 0.7),
    (40, 0.6, 0.6),
]
total = sum(n for n, _, _ in bins)
ece = sum(n / total * abs(conf - acc) for n, conf, acc in bins)
print(round(ece, 3))   # 0.12`,
      },
      keyPoints: [
        'Calibrated = confidence ≈ accuracy. Accuracy එකට වෙනම ගුණාංගයක්.',
        'ECE = bins වල |accuracy − confidence|, sample ප්‍රමාණයෙන් weighted average. Max gap = MCE.',
        'Temperature scaling (T > 1) argmax වෙනස් කරන්නේ නෑ → accuracy එකම, ECE/NLL හොඳ වෙනවා.',
        'RLHF / alignment එකට පස්සේ calibration නරක් වෙන්න පුළුවන් (GPT-4 report). ආයෙත් මනින්න.',
      ],
      terms: [
        { en: 'Calibration', si: 'Model එක කියන probability එක ඇත්ත සිදුවීම් වාර ගණනට ගැළපෙන තරම.' },
        { en: 'Expected Calibration Error (ECE)', si: 'Confidence bins වල accuracy-confidence gap එකේ weighted average එක.' },
        { en: 'Maximum Calibration Error (MCE)', si: 'Bins අතර ලොකුම gap එක.' },
        { en: 'Temperature Scaling', si: 'Logits එක scalar T එකකින් බෙදලා probabilities මෘදු/තියුණු කරන post-hoc calibration ක්‍රමය.' },
        { en: 'Overconfidence', si: 'ඇත්ත accuracy එකට වඩා ඉහළ confidence කියන එක.' },
        { en: 'Reliability Diagram', si: 'Confidence (x) vs accuracy (y) chart එක. Diagonal එකේ නම් perfect calibration.' },
      ],
    },
    // 14
    {
      id: 'test-data-design',
      title: 'Test Data Design: Splits, Leakage, Golden Sets, Regression Suites and Slice-Based Evaluation',
      si: 'විභාගයකදී පාඩම් කරපු ප්‍රශ්න train set එක, පුහුණුවට පාවිච්චි කරන ප්‍රශ්න validation set එක, අන්තිමට පමණක් බලන paper එක test set එක වගේ. එක customer කෙනෙකුගේ tickets train සහ test දෙකටම ගියොත් model එකට පිළිතුර මතක තියාගන්න පුළුවන්. Colombo සහ Kandy customers වෙන වෙනම slices කරලා බලද්දී overall score එක සඟවන දුර්වලතාවක් පේන්න පුළුවන්. Golden set එක version කරලා production failures වලින් අලුත් cases එකතු කරන්න.',
      examRefs: ['EVAL-029', 'EVAL-030', 'EVAL-041', 'EVAL-042', 'EVAL-045', 'EVAL-050', 'EVAL-051', 'EVAL-102', 'EVAL-103', 'EVAL-104', 'EVAL-112', 'EVAL-146', 'EVAL-147'],
      body: [
        'Splits වල roles: Training set = ඉගෙන ගන්න. Validation set = hyperparameters tune කරන්න, හොඳම checkpoint එක තෝරන්න. Test set = ඔක්කොම තීරණ ගත්තට පස්සේ අන්තිමට එක පාරක්, unbiased performance estimate එකක් ගන්න. Test set එකෙන් තීරණ ගත්තොත් තොරතුරු leak වෙලා අන්තිම අංකය optimistic වෙනවා. Leakage: Customer-support tickets random split කළාම near-duplicate tickets train සහ test දෙකේම තිබුණොත්, model එක දැකපු දේ මතක් කරලා සාර්ථක වෙනවා. Test scores inflate වෙනවා. Split කරන්න කලින් deduplicate කරන්න, නැත්නම් customer, කාලය, template අනුව split කරන්න. Group-based split: එක customer කෙනෙක්ගේ conversations ගොඩක් තියෙනවා නම්, එක customer කෙනෙක් එක split එකක විතරක් ඉන්න විදිහට group කරන්න. Temporal split: අලුත් products ආවම future tickets වෙනස් වෙනවා නම්, පරණ tickets වලින් train කරලා අලුත්ම කාල පරිච්ඡේදයෙන් test කරන්න. Deployment එකේදී model එක හැම වෙලේම අතීතයෙන් අනාගතය predict කරනවා, drift එකට මුහුණ දෙනවා.',
        'Golden dataset කියන්නේ තෝරා බේරා ගත්ත, version කරපු, විශ්වාසදායක expected outputs හෝ criteria තියෙන inputs set එකක්. Model, prompt, pipeline versions අතර ප්‍රතිඵල සසඳන්න පුළුවන් වෙන්නේ ඒක ස්ථාවර නිසා. හැම run එකකම prompts අලුතෙන් generate කළොත් ඒ comparability එක නැති වෙනවා. Launch එකට පස්සේ golden set එක අල්ලපු නැති failures users ලා report කළොත්: triage කරපු production failures අලුත් labeled cases විදිහට එකතු කරන්න, set එක version කරන්න, පරණ results සසඳන්න පුළුවන් විදිහට තියාගන්න. සදහටම freeze කළොත් real traffic එකෙන් ඈත් වෙනවා. සතියෙන් සතියට සම්පූර්ණයෙන් replace කළොත් comparability නැති වෙනවා. අමාරු cases අයින් කරන එක වංචාවක්.',
        'Regression testing on an evaluation suite: හැම prompt / model වෙනසකටම පස්සේ fixed evaluation cases set එකක් automatically run කරලා, key scores වැටුණොත් release එක block කරනවා. Software regression tests වල LLM version එක. ඒක pre-release gate එකක්. A/B test එක deploy කරාට පස්සේ live users එක්ක. Offline vs online: Offline = deploy කරන්න කලින් fixed datasets (benchmarks, golden sets) controlled setting එකක. Online = deploy කරාට පස්සේ real traffic එකේ behavior එක (A/B tests, user feedback, monitoring). Offline gains හැම වෙලේම user-facing improvements වලට පරිවර්තනය වෙන්නේ නැති නිසා දෙකම ඕනේ.',
        'Aggregate metrics වලින් failures හැංගෙනවා. (1) Imbalanced data: messages වලින් 2%ක් විතරයි fraud. හැමදේටම "not fraud" කියන model එකකට 98% accuracy. Fraud class එකේ recall හෝ confusion matrix එක බලන්න. (2) Confusion matrix: Billing / Technical / Account routing එකේ, Account requests Billing විදිහට වැරදියට යනවද කියලා බලන්න "true Account" row එකේ "predicted Billing" column cell එක බලන්න. (3) Slice-based evaluation: overall 92% වුණත් Spanish customers ලාට වැරදි උත්තර. භාෂාව, customer segment වගේ slice එකෙන් slice එකට metrics report කරන්න. එකම mix එකේ ලොකු test set එකකින් majority slice එක තමයි headline එක තීරණය කරන්නේ. (4) Segment regression: overall එක දියුණු වුණත් එක segment එකක ලොකු වැටීමක් blocking regression එකක් විදිහට investigate කරන්න. Regression suite එකේ per-segment thresholds දාන්න. Segment එක අයින් කරන එක ප්‍රශ්නය හංගනවා. සම්පූර්ණයෙන් reject කරන එක targeted fix එකක් ගැන නොසලකනවා. (5) Simpson’s paradox: B, short සහ long queries දෙකේම A ට වඩා හොඳයි, ඒත් overall A ඉහළයි. Models දෙක evaluate කළේ short/long වෙනස් mix වලින් නම්, aggregate එක ලේසි segment එකෙන් පාලනය වෙනවා. Models දෙකම එකම item set එකේ evaluate කරන්න, නැත්නම් reweight කරන්න.',
      ],
      analogy: 'පාසලක average O/L results 85% වුණාට, ගණිතයේ විතරක් pass rate 40% නම් ඒක principal ට පේන්නේ විෂයෙන් විෂයට (slice) බැලුවොත් විතරයි. Golden set එක කියන්නේ teacher ගේ "අවුරුදු ගාණක් පාවිච්චි කරන standard model paper" එක. අලුත් වැරදි වර්ගයක් ළමයි කරනවා දැක්කම teacher ඒකට ප්‍රශ්නයක් paper එකට එකතු කරනවා (version 2), ඒත් මුළු paper එකම විසි කරන්නේ නෑ.',
      example: 'Segment regression: General FAQ (85%) 88 → 92. Refund policy (10%) 90 → 70. Legal (5%) 95 → 96. Overall old = 0.85×88 + 0.10×90 + 0.05×95 = 74.8 + 9.0 + 4.75 ≈ 88.6%. Overall new = 0.85×92 + 0.10×70 + 0.05×96 = 78.2 + 7.0 + 4.8 = 90.0%. Overall දියුණු වුණා, ඒත් refund ප්‍රශ්න වල points 20ක වැටීමක්, ඒක blocking regression එකක්. Simpson: A short 800 items 90% (720 හරි) + long 200 items 40% (80) = 800/1000 = 80%. B short 200 items 95% (190) + long 800 items 50% (400) = 590/1000 = 59%. Segment දෙකේම B හොඳයි (95 > 90, 50 > 40), ඒත් overall A ඉහළයි, මොකද A ට ලැබුණේ ලේසි short ප්‍රශ්න වැඩිපුර.',
      keyPoints: [
        'Validation = tuning/checkpoints. Test = අන්තිම, unbiased, එක පාරක්.',
        'Dedupe කරලා split කරන්න. Group (customer) සහ temporal splits leakage නවත්තනවා.',
        'Golden set = curated + versioned. Production failures එකතු කරන්න, version කරන්න.',
        'Regression suite = CI gate. Offline (pre-deploy) + online (real traffic) දෙකම ඕනේ.',
        'Imbalance, confusion matrix, slices, per-segment thresholds, Simpson’s paradox: aggregate එක විතරක් විශ්වාස කරන්න එපා.',
      ],
      terms: [
        { en: 'Data Leakage', si: 'Test එකේ තොරතුරු (duplicates, future data) training එකට රිංගීම නිසා ලකුණු inflate වීම.' },
        { en: 'Temporal Split', si: 'පරණ data වලින් train කරලා අලුත්ම කාලයෙන් test කරන split එක.' },
        { en: 'Group-based Split', si: 'එකම customer / group එක splits දෙකකට නොයන විදිහට කරන split එක.' },
        { en: 'Golden Dataset', si: 'Curated, versioned, විශ්වාසදායක expected outputs තියෙන reference eval set එක.' },
        { en: 'Regression Test Suite', si: 'හැම වෙනසකටම පස්සේ run කරලා quality වැටුණොත් release block කරන eval set එක.' },
        { en: 'Slice-based Evaluation', si: 'භාෂාව, segment වගේ subgroups වලට වෙන වෙනම metrics report කිරීම.' },
        { en: 'Simpson’s Paradox', si: 'Subgroups වල trend එක aggregate එකේදී ආපස්සට හැරෙන සංසිද්ධිය.' },
        { en: 'Offline vs Online Evaluation', si: 'Deploy කරන්න කලින් fixed data එකෙන් vs deploy කළාට පස්සේ real traffic එකෙන්.' },
      ],
    },
    // 15
    {
      id: 'statistics-for-evals',
      title: 'Statistics for Evals: p-values, Confidence Intervals, Paired Tests, Bootstrap, Multiple Comparisons, Sample Size',
      si: 'Model දෙකක score වෙනසක් දුටු පමණින් එකක් හොඳයි කියලා තීරණය කරන්න බෑ; ඒ වෙනස random noise එකක්ද බලන්න ඕනේ. Confidence interval එක 100 වතාවක් වගේ නැවත sample කළාම ඇත්ත අගය කොහේ තියෙන්න පුළුවන්ද කියලා uncertainty පෙන්වනවා. එකම questions දෙකම models දෙකට දීලා paired test එකක් කළොත් ප්‍රශ්නවල අමාරුකම පාලනය වෙනවා. Comparisons ගොඩක් කරනවා නම් false positive අවදානමත් පාලනය කරන්න.',
      examRefs: ['EVAL-032', 'EVAL-070', 'EVAL-071', 'EVAL-073', 'EVAL-105', 'EVAL-106', 'EVAL-107', 'EVAL-129', 'EVAL-131'],
      body: [
        'p-value එක: "ඇත්තටම කිසිම වෙනසක් නැත්නම් (null hypothesis), අපි දැක්ක තරම් හෝ ඊට වඩා extreme data ලැබෙන්න ඉඩ කොච්චරද?" p = 0.03 කියන්නේ, වෙනසක් නැත්නම් මෙහෙම data 3%ක වාර ගණනක් එනවා කියන එක. ඒක "අලුත් variant එක හොඳ වෙන්න 3% ඉඩ" නෙවෙයි. Effect එක කොච්චර ලොකුද කියලත් ඒකෙන් කියන්නේ නෑ.',
        'Accuracy එකක confidence interval එක (normal approximation): Standard error SE = √(p(1−p)/n). වචන වලින්: accuracy එක (p) ගුණ කරන්න (1 − p), items ගණනින් (n) බෙදන්න, වර්ගමූලය ගන්න. 95% CI = p ± 1.96 × SE. ±1 SE විතරක් ගත්තොත් ඒක 68% interval එකක් විතරයි. පොඩි test sets වල noise ගොඩක්: ප්‍රශ්න 100ක benchmark එකක 72% vs 70% කියන්නේ SE ≈ 4.5 points නිසා වෙනසක් නෑ වගේ. BLEU වගේ corpus-level metric එකකට සරල formula එකක් නෑ. Bootstrap: test items with replacement (එකම item එක දෙපාරක් ගන්න පුළුවන් විදිහට) නැවත නැවත resample කරලා, metric එක හැම පාරම ගණනය කරලා, 2.5th සහ 97.5th percentiles ගන්නවා. Paired bootstrap (systems දෙකටම එකම resampled items) එකකින් එක system එකක් අනික්කට වඩා හොඳද කියලා test කරනවා.',
        'Paired comparison: Models දෙකම එකම ප්‍රශ්න 1,000 ට උත්තර දුන්නා නම් results paired. McNemar’s test එක බලන්නේ discordant pairs විතරයි: A හරි B වැරදි (b), A වැරදි B හරි (c). χ² = (b − c)² ÷ (b + c). 3.84 ට වඩා වැඩි නම් α = 0.05 දී significant. Unpaired t-test එකක් pairing එක නොසලකන නිසා power අඩුයි. Multiple comparisons: Metrics 20ක් α = 0.05 දී test කළොත්, ඇත්තටම වෙනසක් නැති වුණත් false positive එකක් බලාපොරොත්තු වෙනවා (20 × 0.05 = 1). අඩුම තරමින් එකක් වැරදියට significant වෙන ඉඩ 1 − 0.95^20 ≈ 64%. Bonferroni: α ÷ tests ගණන (0.05 ÷ 20 = 0.0025). එක false positive එකක්වත් එන ඉඩ (FWER) පාලනය කරනවා, ඒත් ගොඩක් conservative. Benjamini–Hochberg: false discovery rate (FDR), ඒ කියන්නේ significant කියපු ඒවායින් වැරදි ඒවායේ බලාපොරොත්තු අනුපාතය පාලනය කරනවා, වැඩි power. ක්‍රමය: p-values කුඩාම සිට පිළිවෙළට දාලා, i වෙනි එක (i ÷ m) × q ට අඩුද කියලා බලනවා; එහෙම අඩු වෙන ලොකුම i එක දක්වා ඔක්කොම reject කරනවා. Pre-registered primary metric එකක් හෝ confirmation test එකක් තව විකල්ප.',
        'Sample size: ඕනේ users ගණන 1/δ² ට (δ = අල්ලන්න ඕනේ අවම effect එක) සමානුපාතික. Effect එක අඩකින් අඩු කළොත් sample එක 4 ගුණයක්, 2 ගුණයක් නෙවෙයි. Rule of thumb (α = 0.05, power 80%): arm එකකට n ≈ 16 × p(1 − p) ÷ δ². Power කියන්නේ ඇත්තටම effect එකක් තියෙනවා නම් ඒක අල්ලගන්න ඉඩ.',
      ],
      analogy: 'කාසියක් 10 පාරක් උඩ දාලා 6 පාරක් head ආවට කාසිය වංචාවක් කියලා කියන්න බෑ. 1,000 පාරක් දාලා 600ක් head ආවොත් කියන්න පුළුවන්. Sample size එක තමයි noise එකෙන් signal එක වෙන් කරන්නේ. Lottery tickets 20ක් ගත්තාම එකක් දිනුවට ඔයා "lucky number" එකක් හොයාගත්තා නෙවෙයි (multiple comparisons).',
      example: 'CI: Items 400, accuracy 80%. SE = √(0.8 × 0.2 ÷ 400) = √(0.16 ÷ 400) = √0.0004 = 0.02. 1.96 × 0.02 ≈ 0.039. CI ≈ 76.1% සිට 83.9% (≈ 76-84%). Small test set: ප්‍රශ්න 100, සාමාන්‍යය 71%. SE = √(0.71 × 0.29 ÷ 100) = √0.00206 ≈ 0.045 → points 4.5ක්. 2 points වෙනස noise එක ඇතුළේ. Sample size: 50% → 55%, p = 0.5, δ = 0.05. n ≈ 16 × 0.25 ÷ 0.0025 = 4 ÷ 0.0025 = 1,600 per arm. δ square කරන්න අමතක කළොත් 80. 2-point effect එකකට 4,000 ඕනේ නම්, 1-point එකකට (2 ÷ 1)² × 4,000 = 16,000. McNemar: b = 60, c = 35. (60 − 35)² ÷ 95 = 625 ÷ 95 ≈ 6.6 > 3.84 → significant.',
      keyPoints: [
        'p-value = null සත්‍ය නම් මෙහෙම data එන ඉඩ. Hypothesis එකේ probability එක හෝ effect size එක නෙවෙයි.',
        '95% CI = p ± 1.96 √(p(1−p)/n). Items 100 නම් SE ≈ 4-5 points.',
        'Paired data → McNemar / paired bootstrap. Corpus metrics → bootstrap CI.',
        'Tests 20 @ 0.05 → false positive 1ක් බලාපොරොත්තු. Bonferroni (FWER) vs Benjamini–Hochberg (FDR).',
        'n ∝ 1/δ². n ≈ 16 p(1−p)/δ² per arm.',
      ],
      terms: [
        { en: 'p-value', si: 'Null hypothesis සත්‍ය නම් දැක්ක තරම් extreme data ලැබෙන probability එක.' },
        { en: 'Standard Error', si: 'Estimate එකක (accuracy වගේ) sampling noise එකේ ප්‍රමාණය.' },
        { en: 'Confidence Interval', si: 'ඇත්ත අගය තියෙන්න ඉඩ ඇති පරාසය. 95% = ±1.96 SE.' },
        { en: 'McNemar’s Test', si: 'Paired correct/incorrect results වල discordant pairs සසඳන test එක.' },
        { en: 'Bootstrap', si: 'Items with replacement resample කරලා metric එකේ variability empirically හොයන ක්‍රමය.' },
        { en: 'Bonferroni Correction', si: 'α එක tests ගණනින් බෙදලා family-wise error rate පාලනය කිරීම.' },
        { en: 'Benjamini–Hochberg (FDR)', si: 'Discoveries වලින් වැරදි ඒවායේ බලාපොරොත්තු අනුපාතය පාලනය කරන procedure එක.' },
        { en: 'Statistical Power', si: 'ඇත්ත effect එකක් තියෙනකොට ඒක අල්ලගන්න ඉඩ. සාමාන්‍යයෙන් 80%.' },
      ],
    },
    // 16
    {
      id: 'ab-testing',
      title: 'A/B Testing LLM Features: Peeking, Sequential Tests, SRM, Novelty, Randomization Unit, CUPED, Guardrails',
      si: 'කඩේ අලුත් kottu recipe එකක් control recipe එකත් එක්ක random ලෙස බෙදා බලන එක A/B test එකක් වගේ. හැමදාම p-value බලලා 0.05ට අඩු වුණ ගමන් නතර කළොත් false positive වැඩි වෙනවා. 50/50 test එකක users 52,000 සහ 48,000 වුණොත් SRM එකක් සැක කරලා logging එක හොයන්න. Primary metric එක හොඳ වුණත් latency, cost, safety guardrails නරක වෙන්න ඉඩ දෙන්න එපා.',
      examRefs: ['EVAL-031', 'EVAL-072', 'EVAL-074', 'EVAL-075', 'EVAL-076', 'EVAL-077', 'EVAL-127', 'EVAL-128', 'EVAL-130'],
      body: [
        'A/B test එකක් කියන්නේ live traffic එක පරණ (control) සහ අලුත් (treatment) variants අතර random විදිහට බෙදලා outcome metrics (resolution rate, thumbs-up rate…) සසඳන එක. Randomization නිසා groups දෙක සමානයි, ඉතින් outcome වෙනස variant එකට ආරෝපණය කරන්න පුළුවන්. Primary metric එක (උදා: helpfulness) optimize කරනකොට guardrail metrics (p95 latency, request එකකට cost, safety-violation rate) පිරිහෙන්න බෑ. Training loss, gradient norm වගේ ඒවා development diagnostics, live outcomes නෙවෙයි.',
        'Peeking: PM කෙනෙක් හැමදාම p-value එක බලලා 0.05 ට අඩු වුණ ගමන් test එක නවත්තනවා. හැම බැලීමක්ම random fluctuation එකකට threshold එක පනින්න තවත් අවස්ථාවක්. ඉතින් මුළු false-positive rate එක 5% ට වඩා ගොඩක් වැඩි වෙනවා. විසඳුම: කලින්ම ගණනය කරපු fixed sample size එකක්, නැත්නම් continuous monitoring වලට හදපු sequential design එකක්: alpha-spending boundaries, හෝ always-valid p-values (mSPRT). "දෙපාරක් පිට පිට 0.05 ට අඩු වුණොත් නවත්තනවා" වගේ ad-hoc නීති තාමත් error rate එක පාලනය නොකර වැඩි කරනවා.',
        'Sample ratio mismatch (SRM): 50/50 split එකකට configure කළාට logs වල control 52,000, treatment 48,000. Users 100,000ක true 50/50 randomization එකකදී මෙහෙම වෙන එක ඉතාම අසාමාන්‍යයි. ඒ කියන්නේ assignment හෝ logging bug එකක් (උදා: treatment එක crash වෙලා users logs වලින් අතුරුදහන් වෙනවා). Results විශ්වාස කරන්න කලින් pipeline එක investigate කරන්න. Random users 4,000ක් අයින් කළාට bias එක නැති වෙන්නේ නෑ. Novelty effect: අලුත් UI එකක පළමු දවස් 3 ලොකු lift එකක්, සති 2කින් මැකිලා යනවා. Users අලුත් දේකට මුලදී වැඩිපුර engage වෙනවා. සම්පූර්ණ සතිපතා cycles කිහිපයක් test එක run කරලා, කාලයත් එක්ක effect එක බලන්න.',
        'Randomization unit: Requests random විදිහට A/B ට යවලා හැම request එකක්ම independent observation එකක් විදිහට analyze කළොත්, heavy users ලාගේ requests සිය ගණන එකිනෙකට correlated. Variance එක අඩුවෙන් ගණන් වෙලා p-values overconfident වෙනවා. Effective sample size එක requests ගණනට වඩා users ගණනට ළංයි. ඒ වගේම එක user කෙනෙක්ට variants දෙකම පේනවා. User level එකෙන් randomize කරලා analyze කරන්න (නැත්නම් clustered standard errors). Practical vs statistical significance: Arm එකකට users මිලියන 2ක් එක්ක thumbs-up rate එකේ 0.05% ක significant වැඩිවීමක්, ඒත් serving cost එක දෙගුණයක්. ලොකු samples වලදී පොඩිම effects පවා significant වෙනවා. Significant කියන්නේ "වෙනස zero නෙවෙයි" කියන එක විතරයි, "ship කරන්න වටිනවා" නෙවෙයි. CUPED: Messages per user වගේ high-variance metric එකකට, හැම user කෙනෙක්ගේම experiment එකට කලින් behavior එක (pre-period covariate) පාවිච්චි කරලා outcome එකෙන් ඒකෙන් predict වෙන කොටස අඩු කරනවා. Covariate එක treatment assignment එකට independent නිසා estimate එක unbiased, variance අඩුයි, ඕනේ sample size අඩුයි. Bonferroni variance එකට කිසිවක් කරන්නේ නෑ.',
      ],
      analogy: 'කඩේක අලුත් kottu recipe එකක් test කරනවා. දවස් මාරුවෙන් recipes දෙක දෙනවා නම් (randomization), නිවාඩු දවසේ සෙනඟ නිසා එකකට අසාධාරණ වාසියක් නෑ. හැම පැයකම විකුණුම් බලලා හොඳ පැයක් ආපු ගමන් "අලුත් එක දිනුවා" කියන්න එපා (peeking). පළමු සතියේ අලුත් නිසා හැමෝම try කරනවා (novelty). එකම customer කෙනෙක් දවසට 10 පාරක් ආවොත් එයා 10 දෙනෙක් නෙවෙයි (randomization unit). Rs. 2ක වැඩි ලාභයකට gas බිල දෙගුණ වෙනවා නම් ඒක වටින්නේ නෑ (practical significance).',
      example: 'SRM: Expected = 50,000 / 50,000. Chi-square = (52,000 − 50,000)² ÷ 50,000 + (48,000 − 50,000)² ÷ 50,000 = 4,000,000 ÷ 50,000 × 2 = 80 + 80 = 160. 1 degree of freedom එකට 0.05 limit එක 3.84. 160 කියන්නේ p-value එක ප්‍රායෝගිකව 0. Bug එකක්. CUPED: pre-period messages සහ experiment messages අතර correlation ρ = 0.7 නම් variance එක (1 − ρ²) = 1 − 0.49 = 0.51 ගුණයකින් අඩු වෙනවා. ඒ කියන්නේ එකම power එකට users අඩක් විතර ඇති.',
      keyPoints: [
        'A/B = live traffic random split. Primary metric + guardrails (latency, cost, safety).',
        'Peeking false positives වැඩි කරනවා → fixed n හෝ sequential tests (alpha-spending, mSPRT).',
        'SRM = bug සලකුණක්. Analyze කරන්න කලින් investigate කරන්න.',
        'Novelty effect → සතිපතා cycles කිහිපයක් run කරන්න. Randomize + analyze user level එකේ.',
        'Statistical significance ≠ practical significance. CUPED = pre-period covariate එකෙන් variance අඩු කිරීම.',
      ],
      terms: [
        { en: 'Guardrail Metrics', si: 'Primary metric එක optimize කරද්දී පිරිහෙන්න බැරි metrics (latency, cost, safety).' },
        { en: 'Peeking', si: 'Test එක අතරතුර නැවත නැවත p-value බලලා early stop කරන එක.' },
        { en: 'Sequential Testing (mSPRT, Alpha-Spending)', si: 'නිතර බැලුවත් Type I error එක පාලනය වෙන test designs.' },
        { en: 'Sample Ratio Mismatch (SRM)', si: 'බලාපොරොත්තු split ratio එකෙන් සැලකිය යුතු ලෙස වෙනස් වීම. Pipeline bug සලකුණක්.' },
        { en: 'Novelty Effect', si: 'අලුත් දේකට මුලදී පේන තාවකාලික engagement lift එක.' },
        { en: 'Randomization Unit', si: 'Variants assign කරන ඒකකය (user, session, request). Analysis එකත් ඒ level එකේම.' },
        { en: 'CUPED', si: 'Pre-experiment covariate එකක් එක්ක regression adjustment කරලා variance අඩු කරන ක්‍රමය.' },
        { en: 'Practical Significance', si: 'Effect එක ව්‍යාපාරිකව වටින තරම් ලොකුද කියන එක.' },
      ],
    },
    // 17
    {
      id: 'reproducibility',
      title: 'Reproducibility: Seeds, GPU Nondeterminism, Temperature-0 Drift, Versioning and Tracking',
      si: 'එකම recipe එකට බත් උයද්දීත් වතුර, ගින්දර, වෙලාව වෙනස් වුණොත් ප්‍රතිඵලය ටිකක් වෙනස්. ML experiment එකේ seed, data version, prompt, model checkpoint, library සහ hardware සටහන් කරන්න. Seed එකක් දාපු පමණින් GPU nondeterminism හෝ remote model update නවතින්නේ නෑ. Temperature 0 වුණත් backend වෙනස් වීමෙන් output වෙනස් වෙන්න පුළුවන්.',
      examRefs: ['EVAL-033', 'EVAL-034', 'EVAL-083', 'EVAL-084', 'EVAL-085', 'EVAL-086', 'EVAL-087', 'EVAL-144', 'EVAL-145'],
      body: [
        'Reproducibility කියන්නේ වෙන කෙනෙකුට experiment එක ආයෙත් run කරලා එකම (හෝ statistically ගැළපෙන) ප්‍රතිඵල ගන්න පුළුවන් වීම. ඒකට random seeds fix කරන්න, code, data, config, model versions record කරන්න ඕනේ. LLM apps වලදී prompt එකත් weights තරමටම behavior වෙනස් කරන first-class artifact එකක්. ඉතින් prompts code එකත් එක්ක version control එකේ තියලා, හැම eval run එකකටම prompt version එක log කරන්න. Data versioning: file path එක එකම වුණත් content වෙනස් වෙන්න පුළුවන්. Content-addressed versioning (dataset එකේ hash එක, DVC හෝ W&B / MLflow artifacts) පාවිච්චි කරලා hash එක හැම run එකකටම log කරන්න. Content එක වෙනස් වුණොත් hash එකත් වෙනස් වෙනවා. Path සහ modification date ප්‍රමාණවත් නෑ.',
        'Experiment tracking tools: MLflow සහ Weights & Biases, hyperparameters, metrics, artifacts, model versions log කරලා UI එකක runs සසඳන්න දෙනවා. MLflow Tracking runs වල parameters / metrics log කරනවා. MLflow Model Registry, model versions, lineage (කොයි run එකෙන්ද ආවේ), stage transitions (staging, production) සහ aliases manage කරනවා. TensorRT-LLM / Triton inference tools. NeMo Guardrails / Presidio safety සහ PII tools. cuDF / cuML GPU data science libraries.',
        'Seeds එකක් fix කළත් GPU runs දෙකක් අතර පොඩි වෙනස්කම්: Floating-point addition associative නෑ ((a + b) + c ≠ a + (b + c) හරියටම). GPU එකේ parallel reductions (atomic adds) හැම පාරම වෙනස් order එකකින් එකතු වෙනවා. torch.use_deterministic_algorithms(True) වගේ deterministic modes තියෙනවා, ඒත් වේගය අඩුයි. Seed variance: Single-seed runs දෙකක් අතර 500-item test set එකක 0.6 points වෙනසක් seed noise එකට වඩා පොඩි වෙන්න පුළුවන්. Seeds කිහිපයකින් run කරලා mean ± standard deviation සසඳන්න.',
        'Decoding settings: Benchmark scores repeatable කරන්න greedy decoding (temperature 0), fixed max tokens, stop sequences. High-temperature sampling variance එකක් එකතු කරනවා. ඒත් temperature 0 වුණත් served model එකකින් සමහර outputs runs අතර වෙනස් වෙන්න පුළුවන්. හේතුව: dynamic / continuous batching. එකම request එක වෙනස් neighbors එක්ක batch වෙනකොට kernel choices සහ floating-point reduction order වෙනස් වෙලා logits ටිකක් වෙනස් වෙනවා. Tokens දෙකක් ආසන්න වශයෙන් tie නම් greedy argmax එක මාරු වෙලා, ඊට පස්සේ මුළු output එකම වෙනස් පාරක යනවා. Eval reports වල මේ residual variance එක පිළිගන්න, නැත්නම් batch-invariant kernels පාවිච්චි කරන්න. Temperature 0 random sampling enable කරන්නේ නෑ. Tokenizer stochastic නෑ.',
      ],
      analogy: 'අම්මාගේ කිරිබත් recipe එක. "සහල් කෝප්ප 2යි, පොල් කිරි ටිකක්" කියලා ලිව්වොත් අක්කා හදන එක වෙනස්. Exact measurements, කොයි සහල් වර්ගයද (data version), කොයි ලිපද (hardware), කොච්චර වෙලාවද (config) ලිව්වොත් විතරයි එකම රසය එන්නේ. ඒත් එකම recipe එකෙන් හැදුවත් ගෑස් ලිපේ ගින්න ටිකක් වෙනස් නිසා පොඩි වෙනසක් එනවා (GPU nondeterminism).',
      example: 'Floating-point: 1e16 + 1 − 1e16. වමේ සිට: (1e16 + 1) float එකක 1e16 ම වෙනවා (1 නැති වෙනවා), ඉතින් උත්තරය 0. වෙනස් order එකකින්: (1e16 − 1e16) + 1 = 1. එකම numbers, order එක වෙනස් නිසා උත්තර දෙකක්. Seeds: Run A 82.4, 81.6, 82.9 (mean 82.3). Run B 81.9, 82.6, 81.4 (mean 82.0). වෙනස 0.3, seeds අතර විචලනය ±0.6 විතර. "A හොඳයි" කියන්න සාක්ෂි මදි.',
      keyPoints: [
        'Reproducibility = seeds + code + data + config + model + prompt versions record කිරීම.',
        'Data වලට content hash (DVC, artifacts). Prompt versions හැම run එකකටම log කරන්න.',
        'MLflow Tracking = runs log. Model Registry = versions, lineage, stages, aliases. W&B සමානයි.',
        'GPU nondeterminism = FP addition non-associative + atomic ops. Deterministic mode = වේගය අඩුයි.',
        'Seeds කිහිපයක් → mean ± std. Temperature 0 වුණත් batching නිසා drift වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Random Seed', si: 'Random number generator එක එකම තැනකින් පටන් ගන්න දෙන අංකය.' },
        { en: 'Nondeterministic Kernels', si: 'Parallel operations order එක වෙනස් වෙන නිසා run එකෙන් run එකට පොඩි වෙනස් ප්‍රතිඵල දෙන GPU kernels.' },
        { en: 'Content-Addressed Versioning', si: 'File එකේ content එකේ hash එකෙන් version එක හඳුනාගැනීම.' },
        { en: 'Experiment Tracking', si: 'Runs වල params, metrics, artifacts log කරලා සසඳන එක (MLflow, W&B).' },
        { en: 'MLflow Model Registry', si: 'Model versions, lineage, staging/production stages manage කරන MLflow component එක.' },
        { en: 'Batch Invariance', si: 'Batch එකේ අනිත් requests මොනවා වුණත් එකම output එක දෙන ගුණය.' },
      ],
    },
    // 18
    {
      id: 'experiments-and-tuning',
      title: 'Experiments: Ablations, Hyperparameter Search (Grid, Random, Bayesian/TPE, ASHA, PBT, μP) and Training Curves',
      si: 'කෑමක ලුණු අඩු කළාම රස වෙනස්ද බලන්න එක වරකට එක ingredient එකක් වෙනස් කරනවා වගේ ablation එකක්. Grid search එක හැම combination එකම බලනවා, random search එක අහඹු සැකසුම් බලනවා, Bayesian/TPE කලින් ලැබුණු ප්‍රතිඵල වලින් ඊළඟ අත්හදාබැලීම තෝරනවා. ASHA දුර්වල runs ඉක්මනින් නවත්වනවා, PBT හොඳ runs අතරින් settings හුවමාරු කරනවා. Training curves වලට loss සහ validation performance කාලයත් එක්ක බලන්න.',
      examRefs: ['EVAL-035', 'EVAL-036', 'EVAL-037', 'EVAL-039', 'EVAL-082', 'EVAL-088', 'EVAL-089', 'EVAL-090', 'EVAL-137', 'EVAL-138', 'EVAL-139', 'EVAL-140'],
      body: [
        'Ablation study: අනිත් හැමදේම එකම විදිහට තියලා, එක component එකක් අයින් කරලා / disable කරලා, ඒ නිසා metric එක කොච්චර වැටෙනවද කියලා මනින එක. වැටීම ලොකු වෙන තරමට ඒ component එකේ දායකත්වය වැඩියි. Component එක සංකීර්ණද කියන එක වැදගත් නෑ. Hyperparameter sweep එකක් නම් එකම design එකේ settings වෙනස් කරනවා, කොටස් අයින් කරන්නේ නෑ.',
        'Hyperparameter search ක්‍රම: Grid search = හැම combination එකක්ම. Grid එක වැදගත් parameters වල එකම අගයන් නැවත නැවත try කරමින් වැදගත් නැති ඒවා වෙනස් කරලා trials නාස්ති කරනවා. Parameters වැඩි වෙද්දී scale වෙන්නේ නෑ. Random search = distributions වලින් configurations sample කරනවා. හැම dimension එකකම වෙනස් අගයන් වැඩියෙන් බලන නිසා, වැදගත් parameters ටිකක් විතරක් තියෙනකොට අඩු trials වලින් හොඳ settings හොයනවා. Global optimum එක සහතික නෑ. Learning rate වගේ multiplicative parameters log-uniform sample කරන්න: 1e-6 සිට 1e-3 දක්වා linear-uniform නම් samples 90%ක් විතර 1e-4 සහ 1e-3 අතර වැටෙනවා. Log-uniform නම් හැම decade එකකටම (1e-6, 1e-5, 1e-4…) සමාන අවස්ථාවක්. Bayesian optimization = පරණ trials වලින් objective එකේ surrogate model එකක් (Gaussian process, TPE) හදලා, expected improvement වගේ acquisition function එකකින් exploration සහ exploitation balance කරලා ඊළඟ trial එක තෝරනවා. Gradients ඕනේ නෑ. TPE (Optuna default): completed trials හොඳම quantile එකයි ඉතිරියයි කියලා බෙදලා, densities දෙකක් l(x) (හොඳ) සහ g(x) (නරක) fit කරලා, l(x)/g(x) වැඩිම candidates තෝරනවා.',
        'Budget ඉතිරි කරන ක්‍රම: Successive halving (Hyperband, ASHA) = trials ගොඩකට පොඩි budget එකක් දීලා, intermediate validation scores අනුව හොඳම කොටස විතරක් ලොකු budget වලට promote කරනවා. නරක ඒවා early stop. Population-based training (PBT) = models population එකක් parallel train කරලා, කලින් කලට දුර්වල ඒවා හොඳ ඒවායේ copies (weights) වලින් replace කරලා (exploit), ඒවායේ hyperparameters perturb කරනවා (explore). ප්‍රතිඵලය fixed setting එකක් නෙවෙයි, hyperparameter schedule එකක්. Hyperband trials වලට fixed hyperparameters, දුර්වල ඒවා නවත්තනවා විතරයි. μP (Maximal Update Parametrization): width වැඩි වෙද්දී optimal learning rate සහ initialization scale ස්ථාවරව තියෙන parametrization එක. පොඩි proxy models වල tune කරලා 70B එකට transfer කරන්න පුළුවන් (μTransfer). Standard parametrization එකේදී optimal learning rate එක size එකත් එක්ක වෙනස් වෙනවා.',
        'Training curves කියවීම: Training loss සහ validation loss දෙකම ඉක්මනින් ඉහළ අගයක plateau වෙලා එකට ළඟින් තියෙනවා නම් underfitting (capacity මදි, steps මදි, learning rate ගොඩක් අඩුයි). Overfitting නම් training loss එක validation loss එකට වඩා පැහැදිලිවම අඩුයි. Validation loss එක training loss එකට වඩා ටිකක් අඩු නම්: dropout වගේ regularization training වලදී active, evaluation වලදී off. ඒ වගේම training loss එක epoch එකක් පුරා සාමාන්‍ය කරන්නේ model එක තාම දියුණු වෙද්දී. Gap එක අසාමාන්‍ය ලෙස ලොකු නම් leakage හෝ ලේසි validation set එකක්ද බලන්න. Loss spikes: Pretraining වලදී loss එක හදිසියේ ඉහළ ගිහින් හෙමින් recover වෙනවා, එකම data region එකේ නැවත වෙනවා නම්: spike එකට කලින් checkpoint එකකින් restart කරලා, ප්‍රශ්නකාරී batches skip කරලා, learning rate අඩු කරන්න / gradient clipping තද කරන්න (PaLM, OPT reports). Learning rate වැඩි කිරීම අස්ථාවරත්වය නරක් කරනවා.',
      ],
      analogy: 'Rice and curry එකකින් එක curry එකක් අයින් කරලා "රසය කොච්චර අඩු වුණාද" කියලා බලන එක ablation එකක්. පරිප්පු අයින් කළාම රසය ගොඩක් වැටෙනවා නම් පරිප්පු තමයි වැදගත්ම. Hyperband කියන්නේ ගායන තරගයක් වගේ: පළමු වටයේ 100 දෙනෙකුට විනාඩියක් දීලා, හොඳම 1/3 ට ඊළඟ වටය, අන්තිමට finalists ලාට විතරක් සම්පූර්ණ ගීතයක්.',
      example: 'RAG ablation: Full pipeline 78%. Re-ranker නැතුව 76% (වැටීම 2). Query rewriting නැතුව 65% (වැටීම 13). Citation formatting නැතුව 78% (වැටීම 0). වැඩිම දායකත්වය query rewriting. Log-uniform: Linear-uniform 1e-6 සිට 1e-3 (0.000001 – 0.001) නම්, 0.0001 – 0.001 කොටසේ දිග 0.0009, මුළු දිග 0.000999. 0.0009 ÷ 0.000999 ≈ 90%. ඉතින් 1e-6 සිට 1e-4 දක්වා කොටස (decades දෙකක්) 10%ක් විතරයි ලැබෙන්නේ.',
      keyPoints: [
        'Ablation = එක component එකක් අයින් කරලා drop එක මනිනවා. ලොකුම drop = වැදගත්ම.',
        'Random > Grid (වැදගත් params ටිකක් තියෙනකොට). Learning rate → log-uniform.',
        'Bayesian = surrogate + acquisition. TPE = l(x)/g(x). Hyperband/ASHA = successive halving. PBT = exploit + explore → schedule.',
        'μP = small proxy එකේ tune කරලා ලොකු model එකට transfer.',
        'Train ≈ val, දෙකම ඉහළ = underfitting. Val < train = dropout. Loss spike → rollback + skip batches + LR අඩු කරන්න.',
      ],
      terms: [
        { en: 'Ablation Study', si: 'එක component එකක් අයින් කරලා එහි දායකත්වය මනින experiment එක.' },
        { en: 'Random Search', si: 'Distributions වලින් hyperparameter configurations sample කරන search එක.' },
        { en: 'Bayesian Optimization', si: 'Surrogate model + acquisition function එකකින් ඊළඟ trial එක තෝරන search එක.' },
        { en: 'TPE (Tree-structured Parzen Estimator)', si: 'හොඳ/නරක trials වල densities l(x), g(x) fit කරලා අනුපාතය වැඩි candidates තෝරන Optuna sampler එක.' },
        { en: 'Hyperband / ASHA', si: 'Successive halving මත පදනම් වූ, දුර්වල trials early stop කරන schedulers.' },
        { en: 'Population-Based Training (PBT)', si: 'Population එකක හොඳ models copy කරලා hyperparameters perturb කරන ක්‍රමය.' },
        { en: 'μP (Maximal Update Parametrization)', si: 'Width එක වැඩි වුණත් optimal hyperparameters ස්ථාවර කරන parametrization එක.' },
        { en: 'Underfitting', si: 'Model එක training data එකටවත් හොඳට fit නොවීම. Train සහ val loss දෙකම ඉහළ.' },
      ],
    },
    // 19
    {
      id: 'serving-performance-eval',
      title: 'Evaluating Serving Performance: Latency, Throughput, Tail Percentiles, Little’s Law, Cost per Token',
      si: 'බස් එකක් පැයකට මගීන් 100ක් ගෙනියන එක throughput වගේ, එක මගියෙක්ට බස් එක එනකම් විනාඩි 20ක් ඉන්න එක latency වගේ. සාමාන්‍ය latency එක හොඳ වුණත් p95 හෝ p99 දිගු ප්‍රමාදය පෙන්වන්න පුළුවන්. Little’s Law අනුව concurrency = throughput × latency. Request එකකට හෝ token එකකට වැය වන Rs. ගණනත් quality එකත් එක්ක මනින්න.',
      examRefs: ['EVAL-078', 'EVAL-079', 'EVAL-080', 'EVAL-135', 'EVAL-136'],
      body: [
        'Quality එක විතරක් නෙවෙයි, වේගය සහ වියදමත් evaluate කරන්න ඕනේ. Throughput = තත්පරයකට මුළු tokens (හෝ requests) ගණන. Latency = එක request එකකට ගතවන කාලය. Triton එකේ batch size එක වැඩි කළාම GPU utilization සහ throughput එක වැඩි වෙනවා, මොකද weights load කරන වියදම requests ගොඩකට බෙදෙනවා. ඒත් හැම request එකක්ම queue එකේ බලාගෙන ඉන්න හෝ step එකක් හෙමින් decode වෙන්න පුළුවන්, ඉතින් per-request latency එක වැඩි වෙනවා. දෙකම report කරන්න, හොඳම විදිහ throughput-versus-latency curve එකක්.',
        'Streaming latency කොටස් දෙකයි: TTFT (time to first token) = prompt එක process කරලා (prefill) පළමු token එක එනකම්. ITL (inter-token latency) = ඊට පස්සේ token එකකට ගතවන කාලය (decode). මුළු කාලය ≈ TTFT + (N − 1) × ITL. දිග prompts නම් TTFT බර වැඩියි, දිග outputs නම් decode කොටස බර වැඩියි. SLOs වල mean වෙනුවට p95 / p99 පාවිච්චි කරන්නේ ඇයි? LLM latency distributions දිග prompts සහ outputs නිසා skewed. හොඳ mean එකක් එක්කම ගොඩක් හෙමින් යන requests තියෙන්න පුළුවන්. Tail percentiles අර්ථවත් users ප්‍රමාණයක් ඇත්තටම අත්විඳින හෙමින් අත්දැකීම් අල්ලනවා.',
        'Little’s law: steady state එකේ concurrency L = arrival rate λ × system එකේ ගතවන කාලය W. Load tests realistic concurrency එකකින් configure කරන්න, මොකද concurrency 1 දී මනින latency/throughput 60 දී behavior ගැන කියන්නේ ටිකයි. Self-hosted cost: GPU instance එකේ පැයක මිල ÷ පැයකට generate කරන tokens. Full utilization එක assume කරනවා. GPU එක idle නම් ඇත්ත cost එක වැඩියි.',
      ],
      analogy: 'Pettah bus stand එකක් හිතන්න. Bus එකක් පිරෙනකම් බලාගෙන ඉඳලා යනවා නම් (ලොකු batch), පැයකට ගෙනියන මගීන් ගණන (throughput) වැඩියි. ඒත් එක මගියෙක් බලාගෙන ඉන්න කාලය (latency) වැඩියි. Bus stand එකට විනාඩියකට මගීන් 20ක් එනවා, එක්කෙනෙක් විනාඩි 3ක් stand එකේ ඉන්නවා නම්, ඕනෑම වෙලාවක stand එකේ 60 දෙනෙක් ඉන්නවා (Little’s law).',
      example: 'Little’s law: λ = requests 20/s, W = 3 s. L = 20 × 3 = 60 concurrent requests. Latency: TTFT 0.5 s, ITL 20 ms = 0.02 s, tokens 200. 0.5 + 199 × 0.02 = 0.5 + 3.98 = 4.48 ≈ 4.5 s. TTFT අමතක කළොත් 4.0 s. Cost: GPU $4.00/h, tokens 2,000/s. පැයකට 2,000 × 3,600 = 7,200,000 = 7.2M tokens. මිලියනයකට $4.00 ÷ 7.2 ≈ $0.56. (Rs. 300 = $1 නම් මිලියනයකට රුපියල් 167ක් විතර.)',
      keyPoints: [
        'ලොකු batch → throughput වැඩි, per-request latency වැඩි. Curve එකක් report කරන්න.',
        'Total ≈ TTFT + (N − 1) × ITL.',
        'SLOs = p95/p99, mean නෙවෙයි. Distributions skewed.',
        'Little’s law: L = λ × W. Load tests realistic concurrency එකකින්.',
        'Cost/M tokens = පැයක මිල ÷ (tokens/s × 3,600 ÷ 1M). Full utilization assume කරලා.',
      ],
      terms: [
        { en: 'Throughput', si: 'තත්පරයකට system එක process කරන මුළු tokens / requests.' },
        { en: 'Latency', si: 'එක request එකකට ගතවන කාලය.' },
        { en: 'TTFT (Time to First Token)', si: 'Request එක යවලා පළමු token එක එනකම් කාලය (prefill).' },
        { en: 'ITL (Inter-Token Latency)', si: 'Streaming වලදී tokens දෙකක් අතර කාලය (decode).' },
        { en: 'p95 / p99 Latency', si: 'Requests වලින් 95% / 99% ට වඩා අඩු latency අගය. Tail එක පෙන්නනවා.' },
        { en: 'Little’s Law', si: 'Concurrency = arrival rate × time in system.' },
      ],
    },
    // 20
    {
      id: 'build-rag-eval-pipeline',
      title: 'Beyond the Exam: Building an Eval Pipeline for Your Own RAG Chatbot',
      si: 'Colombo බැංකුවක FAQ bot එකක් හදනවා කියලා හිතන්න. ප්‍රශ්න 150ක version කරපු golden set එකක් හදලා Sinhala, English, Singlish ප්‍රශ්න සහ document එකේ උත්තර නැති ප්‍රශ්නත් දාන්න. Retrieval එකේ හරි document එක top 5 ඇතුළේද, generation එකේ උත්තරය source එකට faithful ද කියලා වෙන වෙනම මනින්න. Production එකේ වැරදි හමු වුණාම ඒවා triage කරලා ඊළඟ golden set version එකට එකතු කරන්න.',
      examRefs: [],
      body: [
        'Exam එකෙන් එහාට ගිහින්, ඔයාගේම RAG chatbot එකකට (උදා: ලංකාවේ bank එකක FAQ bot එකක්) eval pipeline එකක් හදන හැටි පියවරෙන් පියවර. පියවර 1: "හොඳ" කියන්නේ මොකක්ද කියලා ලියන්න. උදා: (a) හරි documents retrieve වෙනවා, (b) උත්තරය documents වලින් support වෙනවා (faithfulness), (c) ප්‍රශ්නයට ඇත්තටම උත්තර දෙනවා, (d) නොදන්න දේට "මම දන්නේ නෑ" කියනවා, (e) p95 latency තත්පර 3ට අඩුයි. පියවර 2: Real users ලාගේ ප්‍රශ්න 100-200ක golden set එකක් හදන්න. සිංහල, English, Singlish mix එක, ලේසි සහ අමාරු ඒවා, docs වල උත්තර නැති ප්‍රශ්නත් එකතු කරන්න. හැම එකකටම expected answer එක සහ උත්තරය තියෙන document ID එක label කරන්න. Hash එකකින් version කරන්න.',
        'පියවර 3: Retrieval සහ generation වෙන වෙනම මනින්න. Retrieval: hit rate@k (හරි document එක top-k ඇතුළේද) සහ MRR (හරි document එක කොච්චර උඩින්ද). Generation: faithfulness සහ answer correctness, rubric එකක් එක්ක LLM judge කෙනෙක්ගෙන්. Retrieval නරක නම් prompt එක හදලා වැඩක් නෑ. මේ වෙන් කිරීම නිසා වැරැද්ද කොතනද කියලා ඉක්මනින් හොයාගන්න පුළුවන්. පියවර 4: Judge validate කරන්න. Items 50කට ඔයාම (හෝ colleague කෙනෙක්) labels දාලා judge එක්ක agreement / kappa බලන්න. Position swap, reference answer, වෙනස් model family එකේ judge කෙනෙක් පාවිච්චි කරන්න.',
        'පියවර 5: Slices වලට report කරන්න (භාෂාව, ප්‍රශ්න වර්ගය, "උත්තරය නැති" ප්‍රශ්න) සහ bootstrap CI එකක් එක්ක. Items 150ක් නම් SE එක points 3-4ක් විතර, ඉතින් points 2ක වෙනසක් ගැන උද්දාම වෙන්න එපා. පියවර 6: CI එකට regression gate එකක් දාන්න: prompt, model, chunking වෙනසක් කළාම eval එක auto run වෙලා, key metric එකක් හෝ slice එකක් threshold එකට වඩා වැටුණොත් merge block. පියවර 7: Production: thumbs up/down, "මිනිසෙක් එක්ක කතා කරන්න" clicks, sampled conversations judge කරන එක monitor කරන්න. Failures triage කරලා golden set එකේ ඊළඟ version එකට එකතු කරන්න. ලොකු වෙනස්කම් A/B test එකකින් user level එකේ check කරන්න. මේ loop එක කැරකෙන තරමට bot එක හොඳ වෙනවා.',
      ],
      analogy: 'Tuk-tuk එකක් service කරනවා වගේ. Mechanic කෙනෙක් "හොඳයි වගේ" කියලා නෙවෙයි, checklist එකක් එක්ක brakes, lights, engine වෙන වෙනම check කරනවා (retrieval vs generation). පාරේ ගිහින් අලුත් ශබ්දයක් ආවොත් ඊළඟ service checklist එකට ඒක එකතු කරනවා (production failures → golden set).',
      example: 'Golden set v1: ප්‍රශ්න 150. Retrieval hit rate@5 = 0.82 (ප්‍රශ්න 123ක හරි doc එක top 5 ඇතුළේ). Faithfulness (judge) = 0.88. Judge validation: items 50න් judge සහ ඔයා 44ක එකඟයි (88%). Chunk size එක 512 සිට 256 ට අඩු කළාම hit rate@5 = 0.90, faithfulness 0.89. ඒත් "Singlish" slice එකේ hit rate 0.80 සිට 0.70 ට වැටුණා. CI gate එක fail. ඔයා hybrid search (BM25 + embeddings) එකතු කරලා Singlish slice එක 0.84 ට ගෙනාවට පස්සේ merge කරනවා.',
      code: {
        lang: 'python',
        src: `# සරල RAG eval loop එකක හැඩය
def evaluate(golden, retrieve, answer, judge, k=5):
    hits, faithful = 0, 0
    for item in golden:
        docs = retrieve(item["question"], k=k)
        hits += item["doc_id"] in [d.id for d in docs]
        reply = answer(item["question"], docs)
        faithful += judge(reply, docs) == "SUPPORTED"
    n = len(golden)
    return {"hit_rate@k": hits / n, "faithfulness": faithful / n}

# CI gate: threshold එකට අඩු නම් fail
# assert scores["faithfulness"] >= 0.85`,
      },
      keyPoints: [
        '"හොඳ" කියන එක measurable criteria වලට කඩන්න.',
        'Real-user ප්‍රශ්න වලින් versioned golden set එකක්, "උත්තරය නැති" cases එක්ක.',
        'Retrieval (hit rate, MRR) සහ generation (faithfulness, correctness) වෙන වෙනම.',
        'Judge එක human labels එක්ක validate කරන්න. Slices + CIs report කරන්න.',
        'CI regression gate + production monitoring + failures → golden set loop එක.',
      ],
      terms: [
        { en: 'Hit Rate@k', si: 'හරි document එක top-k retrieved results ඇතුළේ තියෙන ප්‍රශ්න ප්‍රතිශතය.' },
        { en: 'MRR (Mean Reciprocal Rank)', si: 'හරි document එකේ rank එකේ 1/rank වල සාමාන්‍යය. උඩින් තියෙන තරමට ඉහළයි.' },
        { en: 'Answer Correctness', si: 'Expected answer එකට සාපේක්ෂව උත්තරය හරිද කියන එක.' },
        { en: 'Eval-Driven Development', si: 'හැම වෙනසක්ම eval suite එකෙන් මැනලා තීරණ ගන්න development ක්‍රමය.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'A model has an average NLL of 2.0 nats per token. What is its approximate perplexity?',
      options: ['4.0', '7.4', '2.0', '100'],
      answer: 1,
      why: 'Perplexity = e^(NLL) = e^2 ≈ 7.39. The answer would be 4.0 only if the loss were in bits (2^2).',
    },
    {
      q: 'The reference summary has 12 unigrams. The candidate has 10, of which 9 appear in the reference. What is ROUGE-1 recall?',
      options: ['0.90', '0.82', '0.75', '0.83'],
      answer: 2,
      why: 'Recall = overlap ÷ reference length = 9 ÷ 12 = 0.75. 0.90 is precision (9 ÷ 10), and 0.82 is F1.',
    },
    {
      q: 'There are n = 10 samples and c = 2 correct samples. What is unbiased pass@5?',
      options: ['0.20', '0.50', 'Approximately 0.78', '1.00'],
      answer: 2,
      why: '1 − C(8,5)/C(10,5) = 1 − 56/252 ≈ 0.78. 0.20 is pass@1 (c/n).',
    },
    {
      q: 'Two annotators agree on 80% of items, and chance agreement is 50%. What is Cohen’s kappa?',
      options: ['0.30', '0.60', '0.80', '0.40'],
      answer: 1,
      why: 'κ = (0.80 − 0.50) ÷ (1 − 0.50) = 0.30 ÷ 0.50 = 0.60. The value 0.30 results if you forget to divide by (1 − p_e).',
    },
    {
      q: 'What is a standard way to reduce position bias in an LLM judge?',
      options: [
        'Always put the baseline first',
        'Evaluate every pair in both orders and count only consistent verdicts',
        'Increase the judge’s temperature',
        'Make the judge prompt longer',
      ],
      answer: 1,
      why: 'Counting a result only when the judge agrees after swapping the order helps cancel slot preference. Always fixing the baseline in one position only pushes the bias in one direction.',
    },
    {
      q: 'There are two bins: 60 samples (confidence 0.9, accuracy 0.7) and 40 samples (confidence 0.6, accuracy 0.6). What is ECE?',
      options: ['0.20', '0.12', '0.10', '0.08'],
      answer: 1,
      why: 'ECE = 0.6 × |0.9 − 0.7| + 0.4 × 0 = 0.12. The unweighted result, 0.10, is incorrect.',
    },
    {
      q: 'A 400-item golden set has 80% accuracy. What is the approximate 95% confidence interval?',
      options: ['79.8% – 80.2%', '78% – 82%', '76% – 84%', '70% – 90%'],
      answer: 2,
      why: 'SE = √(0.8 × 0.2 ÷ 400) = 0.02. Then 1.96 × 0.02 ≈ 0.039, giving 76%–84%. 78%–82% is only ±1 SE (about 68%).',
    },
    {
      q: 'A PM checks an A/B test p-value every day and stops as soon as it falls below 0.05. What is the problem?',
      options: [
        'P-values can only be calculated once per week',
        'Statistical power becomes zero',
        'Repeated peeking and early stopping make the false-positive rate much higher than 5%',
        'The confidence interval becomes too wide',
      ],
      answer: 2,
      why: 'Every look creates another chance for noise to cross the threshold. Use a fixed sample size or a sequential test.',
    },
    {
      q: 'A model scores 92% on a public math benchmark but 71% when the same questions are rewritten with new numbers and names. What does this most strongly suggest?',
      options: [
        'The new questions are naturally harder',
        'The model is underfit',
        'The original answer key contains errors',
        'Contamination or memorization, rather than robust reasoning',
      ],
      answer: 3,
      why: 'If difficulty is comparable, a large drop on equivalent variants is evidence that the model memorized the original items.',
    },
    {
      q: 'A service receives 20 requests per second, and each request takes 3 seconds. How many requests are concurrent at steady state?',
      options: ['7', '23', '60', '120'],
      answer: 2,
      why: 'Little’s law: L = λ × W = 20 × 3 = 60.',
    },
  ],
}
