export default {
  id: 'inference',
  number: 14,
  title: 'Tokenization, Decoding & Inference: Deep Dive',
  titleSi: 'Tokenization, Decoding සහ Inference: LLM එකක් උත්තරයක් හදන හැටි ඇතුළටම බහිමු',
  summary: 'Phase 5 සහ Phase 9 වලදී ඔයා tokens, sampling, KV cache, batching ගැන මූලික අදහස ඉගෙන ගත්තා. මේ phase එකේදී ඒ හැම එකක්ම ඇතුළටම බහිනවා: tokenizer එකේ පුංචි උගුල්, temperature / top-p / min-p / penalties ගණනය කරන හැටි, generation එක වැරදෙන හැටි සහ හදන හැටි, JSON guarantee කරන හැටි, prefill/decode, KV cache memory ගණන්, speculative decoding, quantization, long context. NCA-GENL exam එකේ Tokenization & Inference ප්‍රශ්න ඔක්කොටම කට පාඩම් කරන්නේ නැතුව, තේරුම් අරන් උත්තර දෙන්න පුළුවන් වෙන එක තමයි ඉලක්කය.',
  duration: 'සති 3-4',
  topics: [
    // 1
    {
      id: 'tokenizer-foundations',
      title: 'Tokenizer to Model: Token IDs, Subwords & Vocabulary Size',
      examRefs: ['TOK-001', 'TOK-002', 'TOK-003', 'TOK-009', 'TOK-010', 'TOK-087'],
      body: [
        'LLM එකකට text එක කෙලින්ම කියවන්න බෑ. Model එකට තේරෙන්නේ අංක විතරයි. Tokenizer එක කරන්නේ text එක කෑලි (tokens) වලට කඩලා, හැම කෑල්ලකටම vocabulary එකේ තියෙන integer ID එකක් දෙන එක. ඉතින් model එකට ඇත්තටම යන input එක [15496, 995] වගේ integer token IDs ලැයිස්තුවක්. ඊට පස්සේ model එක ඇතුළේ තියෙන embedding layer එක හැම ID එකක්ම vector එකක් බවට හරවනවා. Sentence embedding එකක් කියන්නේ model එකක් හදන output එකක්. ඒක tokenizer එක දෙන input එක නෙවෙයි.',
        'Text කඩන්න ප්‍රධාන ක්‍රම තුනක් තියෙනවා. Word-level: හැම වචනයක්ම එක token එකක්. Training එකෙන් පස්සේ vocabulary එක fixed. ඒ නිසා අලුත් වචනයක් (උදා: අලුත් product නමක්) ආවොත් ඒක <unk> කියන එකම unknown token එකට වැටෙනවා. වචනයේ තේරුම නැති වෙනවා, unknown වචන දෙකක් අතර වෙනසත් model එකට පේන්නේ නෑ. Vocabulary එකට වචනය "on the fly" එකතු වෙන්නෙත් නෑ, error එකකුත් එන්නේ නෑ.',
        'Character-level: හැම අකුරක්ම token එකක්. Unknown token එකක් කවදාවත් එන්නේ නෑ, vocabulary එකත් පොඩියි. ඒත් ලොකු අවුලක් තියෙනවා: හැම වචනයක්ම tokens ගොඩකට කැඩෙන නිසා sequence එක ගොඩක් දිග වෙනවා. ඒ කියන්නේ compute වැඩියි (attention එක දිග එක්ක වේගයෙන් වැඩි වෙනවා), context window එකත් ඉක්මනට පිරෙනවා. Vocabulary එක "මිලියන ගණනක්" වෙන්නේ නෑ, ඒක ඇත්තටම අනිත් පැත්ත.',
        'Subword tokenization (BPE, WordPiece, Unigram) මැද පාර. නිතර එන වචන මුළුමනින්ම එක token එකක්. දුර්ලභ වචන නිතර එන කෑලි වලින් හදනවා. ඒ නිසා manageable vocabulary එකකින් out-of-vocabulary ප්‍රශ්නය නැති තරම්. Exam උගුලක්: subword එකෙන් word-level එකට වඩා හැම වෙලේම tokens අඩුයි කියන එක වැරදියි. සාමාන්‍යයෙන් ටිකක් වැඩියි.',
        'Vocabulary size trade-off එක: vocabulary එක ලොකු කළාම එක token එකකට text වැඩි ප්‍රමාණයක් ඇසුරෙනවා. Sequences කෙටි වෙනවා, context සහ compute ඉතුරු වෙනවා. ඒත් embedding matrix එක (vocabulary × hidden size) සහ output projection එක ලොකු වෙනවා. ඉතා ලොකු vocabulary එකක දුර්ලභ tokens හොඳට train වෙන්නෙත් නැති වෙන්න පුළුවන්.',
      ],
      analogy: 'කඩේකට සල්ලි ගෙවනවා හිතන්න. ඔයා ගාව Rs. 5000 notes විතරක් තියෙනවා නම් (word-level), Rs. 120ක බනිස් එකකට හරියට ගෙවන්න බෑ. "නොදන්න ගාණක්" (<unk>). Rs. 1 කාසි විතරක් තියෙනවා නම් (character-level), ඕනෑම ගාණක් ගෙවන්න පුළුවන්. ඒත් Rs. 2,500ක බිලකට කාසි 2,500ක් ගණන් කරන්න වෙනවා, පෝලිමම හිරවෙනවා. Notes සහ කාසි මිශ්‍රව තියෙනවා නම් (subword), ඕනෑම ගාණක් ගෙවන්නත් පුළුවන්, ඉක්මනුත් වෙනවා.',
      example: '"unbelievable" කියන වචනය ගමු. Word-level tokenizer එකේ vocabulary එකේ මේක නැත්නම් = <unk> (තේරුම නැති වෙනවා). Character-level = අකුරු 12ක් නිසා tokens 12ක්. Subword = "un" + "believ" + "able" වගේ tokens 3ක්. දැන් embedding ගණනය: vocabulary 128,000ක්, hidden size 4,096ක් නම් input embedding matrix එකේ parameters = 128,000 × 4,096 = 524,288,000, ඒ කියන්නේ මිලියන 524ක් පමණ. Output projection එක tied නැත්නම් (වෙනම matrix එකක් නම්) තව මිලියන 524ක් එකතු වෙනවා.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("gpt2")
ids = tok("Hello world")["input_ids"]
print(ids)                        # [15496, 995] -> model එකට යන්නේ මේ අංක
print(tok.convert_ids_to_tokens(ids))  # ['Hello', 'Ġworld']
print(len(tok))                   # vocabulary size එක

# Embedding parameters = vocab x hidden
print(128_000 * 4_096)            # 524288000 (~524M)`,
      },
      keyPoints: [
        'Tokenizer එක model එකට දෙන්නේ integer token IDs sequence එකක්.',
        'Word-level = අලුත් වචනය <unk>. Character-level = unknown නෑ, ඒත් sequences ගොඩක් දිගයි.',
        'Subword = නිතර එන වචන මුළුමනින්, දුර්ලභ ඒවා කෑලි වලින්. OOV නැති තරම්.',
        'Vocabulary ලොකු = sequences කෙටි, ඒත් embedding සහ output layers ලොකුයි.',
        'Embedding parameters = vocabulary size × hidden size.',
      ],
      terms: [
        { en: 'Token ID', si: 'Vocabulary එකේ token එකකට දීලා තියෙන integer අංකය.' },
        { en: 'Embedding Layer', si: 'Token ID එකක් vector එකක් බවට හරවන lookup table එක (vocab × hidden matrix එකක්).' },
        { en: 'Out-of-Vocabulary (OOV)', si: 'Vocabulary එකේ නැති වචනයක්. Word-level වල ඒක <unk> වෙනවා.' },
        { en: '<unk> Token', si: 'නොදන්න ඕනෑම දෙයකට පාවිච්චි වෙන එකම token එක. තොරතුරු නැති වෙනවා.' },
        { en: 'Tied Embeddings', si: 'Input embedding matrix එකම output projection එකටත් පාවිච්චි කරන එක. Parameters ඉතුරු වෙනවා.' },
      ],
    },

    // 2
    {
      id: 'tokenizer-algorithms',
      title: 'Tokenizer Algorithms: BPE, WordPiece, Unigram, SentencePiece & Byte-level',
      examRefs: ['TOK-004', 'TOK-005', 'TOK-006', 'TOK-007', 'TOK-008', 'TOK-088', 'TOK-089', 'TOK-143', 'TOK-144'],
      body: [
        'BPE (Byte Pair Encoding) කියන්නේ "පහළ ඉඳන් උඩට" (bottom-up) හදන ක්‍රමයක්. Training එක පටන් ගන්නේ characters (හෝ bytes) වලින්. ඊට පස්සේ corpus එකේ එකට ළඟින්ම නිතරම එන pair එක හොයලා, ඒ දෙක එක token එකකට merge කරනවා. ඒ merge එක vocabulary එකට අලුත් entry එකක්. Target vocabulary size එකට එනකම් මේක නැවත නැවත කරනවා. Inference එකේදී ඉගෙන ගත්ත merges, ඉගෙන ගත්ත පිළිවෙළට (rank order) apply කරනවා.',
        'WordPiece (BERT එකේ) "playing" එක "play" + "##ing" ලෙස කඩනවා. ## කියන්නේ "මේ කෑල්ල අලුත් වචනයක් නෙවෙයි, කලින් token එකේම දිගුව" කියන ලකුණ. ඒ නිසා decode කරද්දී වචන සීමා ආපහු හදන්න පුළුවන්. Inference එකේදී WordPiece greedy longest-match-first: vocabulary එකේ තියෙන දිගම prefix එක ගන්නවා, ඉතුරු කොටසට ආයෙත් ඒකම ## pieces වලින් කරනවා. කිසිම කෑල්ලක් ගැළපෙන්නේ නැත්නම් මුළු වචනයම [UNK] වෙනවා.',
        'Unigram කියන්නේ "උඩ ඉඳන් පහළට" (top-down). ලොකු candidate vocabulary එකකින් පටන් අරන්, unigram language model එකකින් segmentations වලට score දාලා, අයින් කළාම corpus likelihood එක අඩුවෙන්ම අඩු වෙන tokens ටික ටික prune කරනවා. Unigram segmentations වලට probability දෙන නිසා subword regularization කරන්න පුළුවන්: training එකේදී එකම text එකට වෙනස් segmentations sample කරලා, model එක tokenization වෙනස් වීම් වලට ශක්තිමත් කරනවා. BPE වලට ඒ වගේම දේ BPE-dropout. Inference එකේදී සාමාන්‍යයෙන් වැඩිම probability තියෙන segmentation එක ගන්නවා.',
        'SentencePiece කියන්නේ algorithm එකක් නෙවෙයි, framework එකක් (ඇතුළේ BPE හෝ Unigram run කරන්න පුළුවන්). විශේෂත්වය: input එක raw character stream එකක් ලෙස ගන්නවා, space එක ▁ කියන symbol එකක් ලෙස encode කරනවා. "වචන space වලින් වෙන් වෙලා" කියලා හිතන්නේ නැති නිසා Japanese, Chinese වගේ භාෂා වලටත් වැඩ, detokenization එක lossless.',
        'Byte-level BPE (GPT-2) වල base vocabulary එකේ byte values 256ම තියෙනවා. ඕනෑම UTF-8 string එකක් bytes sequence එකක් නිසා, නරකම අවස්ථාවේ bytes වලට වැටිලා හරි encode කරන්න පුළුවන්. ඒ නිසා <unk> ඕනේ නෑ. (හැම Unicode character එකක්ම base vocabulary එකට දැම්මා නම් base symbols 100,000කට වඩා ඕනේ.) SentencePiece වල byte fallback (Llama 2 වගේ) කියන්නෙත් ඒ අදහසමයි: vocabulary එකේ නැති emoji එකක් ආවොත් <0xF0> වගේ UTF-8 byte tokens වලට කඩනවා. Byte fallback නැත්නම් ඒක <unk>. Hugging Face tokenizers library එකේ pipeline එක: normalization (Unicode clean, lowercase) → pre-tokenization (වචන වලට කඩනවා) → model (BPE වගේ) → post-processing ([CLS], [SEP] වගේ special tokens එකතු කරනවා). Special tokens අන්තිමට එකතු කරන්නේ ඒවා කැඩෙන්නේ නැති වෙන්න.',
      ],
      analogy: 'BPE හරියට කොත්තු කඩේ waiter කෙනෙක් order ලියන කෙටි ක්‍රම හදාගන්නවා වගේ. මුලින් හැම අකුරක්ම ලියනවා. "chicken" සහ "kottu" නිතරම එකට එන නිසා "CK" කියලා කෙටි ලකුණක් හදාගන්නවා. ඊට පස්සේ "CK" සහ "cheese" නිතර එකට එනවා නම් "CKC" හදනවා. Unigram අනිත් පැත්තට: මුලින් කෙටි ලකුණු දහස් ගණනක් ලිස්ට් එකක ලියාගෙන, අඩුවෙන්ම ප්‍රයෝජනවත් ඒවා කපලා දානවා.',
      example: 'BPE training: corpus එකේ "low", "lower", "lowest" තියෙනවා. මුලින් l, o, w, e, r, s, t අකුරු. "l"+"o" pair එක 3 පාරක් එනවා, ඒක නිතරම නිසා "lo" merge කරනවා. ඊළඟට "lo"+"w" 3 පාරක්, "low" හැදෙනවා. දැන් "lower" = "low" + "e" + "r". Byte fallback: 😀 emoji එක UTF-8 වල bytes 4ක් (F0 9F 98 80). Vocabulary එකේ නැත්නම් <0xF0> <0x9F> <0x98> <0x80> කියන tokens 4කට කැඩෙනවා. WordPiece: "unhappiness" → vocabulary එකේ දිගම prefix "un", ඊට පස්සේ "##happi", "##ness".',
      keyPoints: [
        'BPE = bottom-up, නිතරම එන adjacent pair එක merge කරනවා.',
        'WordPiece = ## = කලින් token එකේ දිගුව. Inference = greedy longest-match-first.',
        'Unigram = top-down pruning. Subword regularization = training එකේ segmentations sample කරනවා.',
        'SentencePiece = raw stream, space = ▁, language-independent, BPE හෝ Unigram run කරනවා.',
        'Byte-level BPE / byte fallback = bytes 256 නිසා <unk> නෑ. Pipeline: normalize → pre-tokenize → model → post-process.',
      ],
      terms: [
        { en: 'Merge Rules', si: 'BPE training එකේ ඉගෙන ගත්ත "මේ pair එක එකතු කරන්න" කියන නීති, rank පිළිවෙළට.' },
        { en: 'Greedy Longest-Match-First', si: 'WordPiece inference ක්‍රමය. දිගම ගැළපෙන prefix එක මුලින් ගන්නවා.' },
        { en: 'Subword Regularization / BPE-dropout', si: 'Training එකේදී එකම text එකට වෙනස් tokenizations දීලා robustness වැඩි කරන එක.' },
        { en: 'Byte Fallback', si: 'Vocabulary එකේ නැති character එකක් UTF-8 byte tokens වලට කඩන එක. <unk> නැති වෙනවා.' },
        { en: 'Normalization / Pre-tokenization / Post-processing', si: 'HF tokenizers pipeline එකේ අදියර. Special tokens එකතු වෙන්නේ අන්තිම post-processing එකේ.' },
      ],
    },

    // 3
    {
      id: 'tokenizer-quirks',
      title: 'Tokenizer Quirks: Spaces, Numbers, Glitch Tokens, Broken Bytes & Offsets',
      examRefs: ['TOK-046', 'TOK-047', 'TOK-090', 'TOK-091', 'TOK-141', 'TOK-142', 'TOK-145'],
      body: [
        'Leading spaces: GPT-style byte-level BPE එකේ වචනයකට කලින් තියෙන space එක ඒ වචනයේ token එකටම ඇතුළත් වෙනවා (GPT-2 වල ඒක Ġ ලෙස පේනවා). ඒ නිසා "Hello" (text එකේ මුලම) සහ " Hello" (වාක්‍යය මැද) vocabulary එකේ වෙනස් entries දෙකක්, ID දෙකක්. Space අයින් කරන්නේ නෑ, ආරක්ෂා කරනවා.',
        'Trailing space උගුල: completion prompt එකක් "The capital of France is " කියලා space එකකින් ඉවර වුණොත් quality එක අඩු වෙනවා. ඇයි? ස්වාභාවික ඊළඟ token එක " Paris" (space එකත් එක්ක). Prompt එක bare space එකකින් ඉවර කළාම model එකට තනි space token එකකට පස්සේ "Paris" දාන්න වෙනවා. ඒ වගේ boundary එකක් training data වල දුර්ලභයි. විසඳුම: trailing space එක අයින් කරන්න, හෝ "token healing" (අන්තිම token එක ආපස්සට ගිහින් ඒකෙන් පටන් ගන්න tokens වලට සීමා කරලා generate කරන එක).',
        'Numbers: BPE merges ad-hoc නිසා "12345" එක "123" + "45" වෙලා, "12346" වෙනස් විදිහකට කැඩෙන්න පුළුවන්. එතකොට place value (ඒකක, දහය, සියය) tokens එක්ක align වෙන්නේ නෑ. Arithmetic අමාරු වෙනවා. ඒ නිසා සමහර tokenizers ඉලක්කම් තනි තනිව (digit splitting) හෝ fixed කෙටි chunks වලට කඩනවා. ප්‍රතිඵලය: numbers වලට consistent representation එකක්, arithmetic patterns ඉගෙන ගන්න ලේසියි. Numbers වල sequence length එක ඇත්තටම වැඩි වෙනවා, අඩු වෙන්නේ නෑ.',
        'Glitch tokens: tokenizer එක train කරපු data එකේ තිබ්බ, ඒත් model එක train කරපු data එකේ නැති තරම් අමුතු tokens (උදා: Reddit username වගේ). ඒ tokens වල embeddings කවදාවත් හොඳට update වෙලා නෑ, ඒවා random වගේ. Prompt එකට ආවොත් model එක අමුතු දේවල් කියනවා. Byte tokens නම් නිතර පාවිච්චි වෙන නිසා හොඳට train වෙලා.',
        'Streaming වලදී "�" පේනවා නම්: byte-level BPE වල multi-byte character එකක් (emoji, Chinese, සිංහල අකුරක් UTF-8 වල bytes 3ක්) tokens දෙකකට කැඩෙන්න පුළුවන්. Token එකින් එක වෙන වෙනම decode කළොත් අඩක් තියෙන invalid byte sequence එකක් එනවා. විසඳුම: bytes buffer කරලා, සම්පූර්ණ UTF-8 character එකක් හැදුනාම විතරක් text emit කරන්න (incremental detokenizer). Offset mapping: NER display එකක original text එකේ කුමන characters ද එක් එක් token එකට අදාළ කියලා highlight කරන්න return_offsets_mapping=True (fast, Rust-backed tokenizers) දාන්න. එතකොට හැම token එකකටම (start, end) character span එකක් ලැබෙනවා. token_type_ids වලින් කියන්නේ sentence A ද B ද කියලා විතරයි.',
      ],
      analogy: 'Leading space එක හරියට bus ticket එකක halt නම වගේ. "Kandy" සහ " Kandy" (කලින් halt එකකින් පස්සේ) machine එකට වෙනස් tickets දෙකක්. Trailing space එක කියන්නේ conductor ට "ඊළඟ halt එක..." කියලා වාක්‍යය අඩක නවත්තලා, ටිකට් එකේ නම භාගයක් විතරක් ගහනවා වගේ. Glitch token එකක් හරියට ලිස්ට් එකේ නම තියෙන, ඒත් කවදාවත් පන්තියට ආපු නැති ළමයෙක් වගේ. ගුරුවරයා ඒ ළමයා ගැන කිසිම දෙයක් දන්නේ නෑ.',
      example: 'Digit splitting උදාහරණය: "2468 + 1357" එක ad-hoc BPE එකකින් "246" "8" " +" " 13" "57" වගේ කැඩෙන්න පුළුවන්. ඒකක ඉලක්කම් දෙක (8 සහ 7) වෙනස් තැන් වල, වෙනස් tokens වල. Digit splitting එකකින් "2" "4" "6" "8" ... ලෙස හැම ඉලක්කමක්ම එකම විදිහට. Offset mapping උදාහරණය: "Kamal lives in Kandy" → "Kandy" token එකට (15, 20). ඉතින් original string එකේ 15 සිට 20 දක්වා characters highlight කරන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("gpt2")

print(tok("Hello")["input_ids"], tok(" Hello")["input_ids"])  # ID දෙකක්

enc = tok("Kamal lives in Kandy", return_offsets_mapping=True)
for t, (s, e) in zip(enc.tokens(), enc["offset_mapping"]):
    print(t, s, e)   # හැම token එකකටම original text එකේ span එක

# Prompt එක trailing space එකකින් ඉවර කරන්න එපා
prompt = "The capital of France is".rstrip()`,
      },
      keyPoints: [
        'Leading space එක token එකේ කොටසක්. "Hello" ≠ " Hello".',
        'Prompt එක trailing space එකකින් ඉවර කරන්න එපා. Token healing කියන්නේ මේකට විසඳුමක්.',
        'Digit splitting = numbers වලට consistent, place-value aligned representation. Tokens වැඩි වෙනවා.',
        'Glitch tokens = tokenizer data එකේ තිබ්බ, model training එකේ නැති, under-trained embeddings.',
        'Streaming "�" = බාගයක් තියෙන UTF-8 character. Buffer කරන්න. Offsets = return_offsets_mapping=True.',
      ],
      terms: [
        { en: 'Ġ (GPT-2 space marker)', si: 'Byte-level BPE එකේ "මේ token එකට කලින් space එකක් තියෙනවා" කියන ලකුණ.' },
        { en: 'Token Healing', si: 'Prompt එකේ අන්තිම token boundary එක හදලා, ස්වාභාවික token එකකින් generation පටන් ගන්න එක.' },
        { en: 'Digit Splitting', si: 'Numbers ඉලක්කම් එකින් එක (හෝ fixed chunks) ලෙස tokenize කරන එක.' },
        { en: 'Glitch Token', si: 'Vocabulary එකේ තියෙන, ඒත් model training එකේ නොදැක්ක නිසා අමුතු හැසිරීමක් ඇති කරන token එකක්.' },
        { en: 'Incremental Detokenizer', si: 'සම්පූර්ණ characters හැදෙනකම් bytes රඳවලා text stream කරන decoder එක.' },
        { en: 'Offset Mapping', si: 'හැම token එකකටම original text එකේ (start, end) character positions.' },
      ],
    },

    // 4
    {
      id: 'context-languages-billing',
      title: 'Context Window, Token Budgets, Languages (incl. Sinhala) & Billing',
      examRefs: ['TOK-011', 'TOK-014', 'TOK-025', 'TOK-045', 'TOK-049', 'TOK-084', 'TOK-085', 'TOK-086', 'TOK-102', 'TOK-106'],
      body: [
        'Context window එක කියන්නේ model එකට එකවර බලන්න පුළුවන් මුළු tokens ගණන. වැදගත්ම දේ: input (prompt) tokens සහ generate කරන output tokens දෙකම එකම window එක share කරනවා. Prompt එක දිග නම් output එකට ඉතුරු ඉඩ අඩුයි. Concurrency (එකවර users කී දෙනෙක්) කියන්නේ serving limit එකක්, model property එකක් නෙවෙයි.',
        'Token ගණන අනුමාන කරන rule of thumb එක (English, GPT-style tokenizers): token 1ක් ≈ characters 4ක් ≈ English වචන 0.75ක්. ඉතින් වචන 750ක document එකක් ≈ tokens 1,000ක්. ඒත් මේක estimate එකක් විතරයි. Prompt එක window එකට ගැළපෙනවද කියලා නිවැරදිවම බලන්න ඕනේ නම් target model එකේම tokenizer එකෙන් ගණන් කරන්න, chat template එකේ tokens ත් එක්ක. වෙන model එකක tokenizer එකකින් ගණන් කළොත් ලොකු වෙනසක් එන්න පුළුවන්.',
        'භාෂා වෙනස: tokenizer එකේ merges හැදෙන්නේ ඒක train කරපු corpus එකෙන්. ඒ corpus එකේ වැඩිපුර English නම්, Thai, Hindi, සිංහල වගේ භාෂා වලට merges ටිකයි. ඒ භාෂා කෙටි කෑලි වලට, සමහර විට bytes වලටම කැඩෙනවා. ප්‍රතිඵලය: එකම අදහසට tokens කිහිප ගුණයක්. ඒ කියන්නේ වැඩි cost, වැඩි latency, context එකට අඩු content. Translation එකක් automatic වෙන්නේ නෑ, window එක භාෂාව අනුව ලොකු වෙන්නෙත් නෑ.',
        'Hosted LLM APIs ගාස්තු අය කරන්නේ input tokens සහ output tokens ගණන අනුව, සාමාන්‍යයෙන් දෙකට වෙනස් rates (output එක ගොඩක් වෙලාවට වඩා මිල අධිකයි). දිග prompts වලටත් compute යන නිසා input එකත් ගණන් වෙනවා.',
        'Window එක hard limit එකක්. Chat history එක window එකට වඩා දිග වුණොත් app එක මුකුත් නොකළොත්, server එක request එක reject කරනවා, නැත්නම් පරණ tokens truncate කරනවා. මුල් content එක නැති වෙනවා. Summarize කරන එක app එකෙන් කරන්න ඕනේ, automatic නෑ. හොඳම strategy එක: system prompt එක (ස්ථිර උපදෙස්) සහ අලුත්ම turns තියාගන්න, පරණම turns අයින් කරන්න හෝ summary එකක් කරන්න. System prompt එක අයින් කළොත් assistant ගේ හැසිරීම නිහඬවම වෙනස් වෙනවා. තව දෙයක්: context length එක දෙගුණ කළොත් KV cache memory දෙගුණයි (linear), ඒත් full self-attention compute එක ආසන්න වශයෙන් හතර ගුණයි (n² quadratic).',
      ],
      analogy: 'Context window එක හරියට A/L exam එකේ answer sheet එකක් වගේ. පිටු ගණන fixed. ප්‍රශ්නය (prompt) ලොකු කොටසක් අල්ලගත්තොත් උත්තරේට (output) ඉතුරු ඉඩ අඩුයි. සිංහලෙන් ලියද්දී tokens වැඩි වෙනවා කියන්නේ, එකම අදහසට ලොකු අකුරින් ලියන්න වෙනවා වගේ. පිටුව ඉක්මනට පිරෙනවා.',
      example: 'Output budget: context window 8,192, chat template එකත් එක්ක prompt එක 7,000. උපරිම max_new_tokens = 8,192 − 7,000 = 1,192. 2,048 ඉල්ලුවොත් overflow, error එකක් හෝ truncation. භාෂා ගණනය: Hindi වලට English වලට වඩා වචනයකට tokens 3 ගුණයක් ඕනේ කියමු. Budget එකට English වචන 3,000ක් යනවා නම්, budget එක fixed නිසා Hindi වචන 3,000 ÷ 3 = 1,000යි (9,000 නෙවෙයි). සිංහලත් එහෙමයි: උදාහරණයක් විදිහට සිංහලට English වලට වඩා 4 ගුණයක් tokens යනවා නම් (නිවැරදි අගය tokenizer එකෙන් මනින්න), English වචන 3,000ක ඉඩට සිංහල වචන 750ක් පමණයි. Bill එකත් 4 ගුණයක් වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

msgs = [{"role": "user", "content": "ශ්‍රී ලංකාවේ අගනුවර කුමක්ද?"}]
ids = tok.apply_chat_template(msgs, add_generation_prompt=True)
n_prompt = len(ids)          # template එකත් එක්කම නිවැරදි ගණන

window = 8192
max_new = window - n_prompt  # output එකට ඉතුරු ඉඩ
print(n_prompt, max_new)`,
      },
      keyPoints: [
        'Context window = input + output tokens දෙකටම එකම limit එක.',
        'Rule of thumb: token 1 ≈ chars 4 ≈ වචන 0.75. වචන 750 ≈ tokens 1,000. නිවැරදි ගණනට model එකේම tokenizer එක.',
        'English-heavy tokenizer = සිංහල/Thai/Hindi වලට tokens වැඩි, cost වැඩි, ඉඩ අඩු.',
        'Billing = input + output tokens. History overflow = reject හෝ truncate. System prompt + අලුත් turns තියාගන්න.',
        'Context දෙගුණයි = KV memory 2×, attention compute ≈ 4×.',
      ],
      terms: [
        { en: 'Context Window', si: 'Model එකට එකවර attend කරන්න පුළුවන් මුළු tokens ගණන (prompt + output).' },
        { en: 'max_new_tokens', si: 'Generate කරන්න දෙන උපරිම output tokens ගණන.' },
        { en: 'Token Inflation', si: 'Tokenizer එකට අඩුවෙන් පුරුදු භාෂා වලට එකම අදහසට tokens ගොඩක් යන එක.' },
        { en: 'Truncation', si: 'Window එකට වඩා දිග input එකේ කොටසක් කපලා දාන එක. Content නැති වෙනවා.' },
        { en: 'History Summarization', si: 'පරණ chat turns කෙටි summary එකකට හරවලා ඉඩ ඉතුරු කරන app-level ක්‍රමය.' },
      ],
    },

    // 5
    {
      id: 'special-tokens-chat-templates',
      title: 'Special Tokens, Attention Mask, Chat Templates & Tokenizer Mismatch',
      examRefs: ['TOK-012', 'TOK-013', 'TOK-041', 'TOK-042', 'TOK-043', 'TOK-044', 'TOK-082', 'TOK-083', 'TOK-150'],
      body: [
        'Special tokens කියන්නේ text නෙවෙයි, control signals. BOS (sequence එකේ ආරම්භය), EOS (end-of-sequence), PAD (padding). Generation එකේදී model එක EOS token එක sample කළාම decoder එක "ඉවරයි" කියලා loop එක නවත්වනවා. PAD එක වෙනම token එකක් (සමහර විට පහසුවට EOS ම PAD ලෙස set කරනවා, ඒත් අරමුණ වෙනස්).',
        'Batch එකක sequences වල දිග වෙනස් නම් කෙටි ඒවාට padding දාලා එකම දිගට ගේනවා. ඒ වෙලාවට attention_mask එකේ real tokens වලට 1, padding වලට 0. 0 කියන්නේ "මේ position එක padding, ගණන් ගන්න එපා". මේක BERT එකේ MLM [MASK] එකට කිසිම සම්බන්ධයක් නෑ. tokenizer("Hello world", return_tensors="pt") call එකෙන් එන්නේ BatchEncoding කියන dict-like object එකක්, ඇතුළේ input_ids සහ attention_mask PyTorch tensors. ඒක කෙලින්ම model(**enc) ට දෙන්න පුළුවන්. Embeddings සහ logits එන්නේ model එකෙන්, tokenizer එකෙන් නෙවෙයි. tokenizer.decode(ids, skip_special_tokens=True) කියන්නේ IDs ආපහු text කරලා <s>, </s>, <pad> වගේ markers හංගන එක.',
        'Tokenizer mismatch: Model X එකට Model Y ගේ tokenizer එකෙන් encode කළොත් output එක gibberish. හේතුව: model එකේ embedding table එක index වෙලා තියෙන්නේ තමන්ගේම tokenizer එකේ IDs වලින්. අනිත් vocabulary එකේ ID 1234 කියන්නේ සම්පූර්ණයෙන්ම වෙනස් text කෑල්ලක්. නීතිය: tokenizer එක හැම වෙලේම model එකේම checkpoint එකෙන් load කරන්න.',
        'Chat templates: instruction-tuned chat models fine-tune කරලා තියෙන්නේ නිශ්චිත role markers සහ special tokens වලින් format කරපු conversations වලින් (උදා: <|im_start|>user ... <|im_end|>). Inference එකේදීත් ඒ layout එකම දුන්නොත් තමයි හොඳට හැසිරෙන්නේ. tokenizer.apply_chat_template(messages, add_generation_prompt=True) එකෙන් messages template එකට format කරනවා, add_generation_prompt=True එකෙන් අන්තිමට assistant turn එක පටන් ගන්න header එක (උදා: <|im_start|>assistant) එකතු කරනවා. ඒක text format කරනවා විතරයි, model එක call කරන්නේ නෑ. වැරදි template එකේ ලක්ෂණය: plain text එකක් දුන්නාම model එක උත්තරේ දීලා නවතින්නේ නැතුව "User:" කියලා අලුත් ප්‍රශ්න ලියන්න පටන් ගන්නවා. තමන්ගේ turn එක ඉවර වෙන තැන නොදන්න නිසා end-of-turn token එක emit කරන්නේ නෑ.',
        'Tokens එකතු කිරීම: tokenizer.add_special_tokens({"additional_special_tokens": ["<tool>"]}) කළාට පස්සේ <tool> තියෙන input එකකින් index error එකක් එනවා නම්, අමතක වෙලා තියෙන්නේ model.resize_token_embeddings(len(tokenizer)). අලුත් token එකට embedding table එකේ size එකට වඩා ලොකු ID එකක් ලැබිලා. Resize කළාට පස්සේ අලුත් rows untrained, ඒ නිසා ප්‍රයෝජනවත් වෙන්න fine-tuning ඕනේ.',
      ],
      analogy: 'Chat template එක හරියට රජයේ කාර්යාලයක form එකක් වගේ. Officer පුරුදු වෙලා තියෙන්නේ "නම: ... ලිපිනය: ... ඉල්ලීම: ..." කියන format එකට. සාමාන්‍ය කඩදාසියක ලියලා දුන්නොත් එයා අවුල් වෙනවා. Tokenizer mismatch කියන්නේ Cargills shelf numbers වලින් Keells එකේ බඩු හොයනවා වගේ. Shelf 12 එකේ එක තැනක බිස්කට්, අනිත් තැන සබන්.',
      example: 'Batch එකක sequences දෙකක්: "Hi" (tokens 2) සහ "How are you" (tokens 4). Padding දැම්මාම දෙකම 4යි. attention_mask = [[0,0,1,1],[1,1,1,1]] (left padding නම්). Wrong template example: prompt "What is 2+2?" plain text විදිහට. Model output: "4.\nUser: What is 3+3?\nAssistant: 6.\nUser: ..." max_new_tokens එකට එනකම්. apply_chat_template දැම්මාම "4." න් පස්සේ end-of-turn token එක එනවා, නවතිනවා.',
      code: {
        lang: 'python',
        src: `msgs = [
    {"role": "system", "content": "ඔයා උදව්කාර assistant කෙනෙක්."},
    {"role": "user", "content": "Kandy ඉඳන් Colombo කොච්චර දුරද?"},
]
# Text එක format කරනවා විතරයි, model එක call වෙන්නේ නෑ
text = tok.apply_chat_template(msgs, tokenize=False,
                               add_generation_prompt=True)

# අලුත් special token එකක් එකතු කළාම embeddings resize කරන්න
tok.add_special_tokens({"additional_special_tokens": ["<tool>"]})
model.resize_token_embeddings(len(tok))`,
      },
      keyPoints: [
        'EOS = generation loop එක නවත්වන signal එක. PAD = padding (EOS ට සමාන කළත් අරමුණ වෙනස්).',
        'attention_mask: 1 = real token, 0 = padding (ignore). MLM masking එකට සම්බන්ධ නෑ.',
        'Tokenizer එක හැම වෙලේම model එකේම checkpoint එකෙන්. නැත්නම් IDs වැරදි embeddings වලට.',
        'Chat template වැරදි = model එක "User:" turns හදාගෙන යනවා. apply_chat_template + add_generation_prompt=True.',
        'Tokens එකතු කළාම model.resize_token_embeddings(len(tokenizer)) + fine-tune.',
      ],
      terms: [
        { en: 'BOS / EOS / PAD', si: 'ආරම්භය, අවසානය, padding පෙන්නන special tokens.' },
        { en: 'attention_mask', si: 'Real tokens 1, padding 0 ලෙස පෙන්නන tensor එක.' },
        { en: 'BatchEncoding', si: 'HF tokenizer call එකෙන් එන input_ids, attention_mask තියෙන dict-like object එක.' },
        { en: 'skip_special_tokens', si: 'decode කරද්දී BOS/EOS/PAD වගේ markers හංගන flag එක.' },
        { en: 'Chat Template', si: 'Model එක fine-tune කරපු role markers සහ special tokens layout එක.' },
        { en: 'add_generation_prompt', si: 'Assistant turn header එක අන්තිමට එකතු කරන flag එක.' },
        { en: 'resize_token_embeddings', si: 'Tokenizer එකට අලුත් tokens දැම්මාම embedding (සහ output) matrices ලොකු කරන method එක.' },
      ],
    },

    // 6
    {
      id: 'logits-softmax-temperature-logprobs',
      title: 'Logits, Softmax, Temperature, Logprobs & Why Temperature 0 Can Still Vary',
      examRefs: ['TOK-015', 'TOK-016', 'TOK-019', 'TOK-020', 'TOK-026', 'TOK-039', 'TOK-074', 'TOK-075', 'TOK-094', 'TOK-146'],
      body: [
        'Decoder-only LLM එකක් generate කරන්නේ loop එකකින් (autoregressive): දැනට තියෙන ඔක්කොම tokens බලලා ඊළඟ token එක predict කරනවා, ඒක අගට එකතු කරනවා, ආයෙත් predict කරනවා. EOS එනකම් හෝ limit එකට එනකම්. හැම step එකකම අන්තිම linear layer එකෙන් vocabulary එකේ හැම token එකකටම raw score එකක් එනවා. ඒවට කියන්නේ logits. Logits probabilities නෙවෙයි: negative වෙන්න පුළුවන්, එකතුව 1 නෑ.',
        'Softmax එකෙන් logits probability distribution එකක් කරනවා. පියවර දෙකයි: (1) හැම logit එකකටම e^logit ගන්නවා (exponentiate, ඒ නිසා ඔක්කොම positive). (2) ඒ ඔක්කොගේ එකතුවෙන් බෙදනවා (normalize, එකතුව 1). Token එකක් තෝරන එක (argmax හෝ sampling) සහ tokens filter කරන එක (top-k/top-p) වෙනම පියවර, softmax එකෙන් පස්සේ.',
        'Temperature apply වෙන්නේ හරියටම මෙතන: softmax එකට කලින් logits temperature (T) එකෙන් බෙදනවා. T < 1 නම් logits අතර වෙනස ලොකු වෙනවා, distribution එක තියුණු (sharp) වෙනවා, ඉහළම tokens ආධිපත්‍යය ගන්නවා, output එක focused, deterministic වගේ. T > 1 නම් distribution එක පැතලි වෙනවා, දුර්ලභ tokens වලට chance වැඩියි. Temperature එක model එක ඇතුළේ attention එකට බලපාන්නේ නෑ, token IDs වලටත් නෑ, length එක කෙලින්ම පාලනය කරන්නෙත් නෑ.',
        'Logprobs කියන්නේ generate කරපු හැම token එකකටම model එක දුන්න probability එකේ log අගය. Probability ≤ 1 නිසා logprob ≤ 0. 0 ට ළඟ = ගොඩක් confident. API එකෙන් top alternatives ත් දෙන්න පුළුවන්. මුළු sequence එකේ probability එක ගන්න: logprobs එකතු කරලා e^(එකතුව) ගන්න (log වල ගුණ කිරීම එකතු කිරීමක් වෙනවා). Average එකෙන් ලැබෙන්නේ per-token figure එකක්, sequence probability එක නෙවෙයි.',
        'Temperature 0 (greedy) වුණත් busy server එකක outputs පොඩ්ඩක් වෙනස් වෙන්න පුළුවන්. හේතුව: batch එකේ ඉන්න අනිත් requests අනුව kernels සහ floating-point reduction order එක වෙනස් වෙනවා. Floating-point එකතු කිරීම associative නෑ ((a+b)+c ≠ a+(b+c) පොඩි වශයෙන්). Logits දෙකක් ගොඩක් ළඟ (near-tie) නම් ඒ පුංචි වෙනසෙන් argmax එක මාරු වෙලා, ඉතුරු output එකම වෙනස් පාරක යනවා. Tokenization එක නම් deterministic.',
      ],
      analogy: 'Temperature එක හරියට cricket selectors ලාගේ "ප්‍රසිද්ධියට කොච්චර බර දෙනවද" කියන knob එක. අඩු temperature = හැමදාම star players ම තෝරනවා. වැඩි temperature = අලුත් අයටත් chance දෙනවා. Logprobs කියන්නේ selectors ලාගේ විශ්වාස ලකුණු. Temperature 0 වෙනස් වීම කියන්නේ ලකුණු 84.99 සහ 85.00 තියෙන players දෙන්නෙක්. Calculator එක වෙනස් කළොත් round කරන විදිහ නිසා වෙනස් කෙනෙක් තේරෙනවා.',
      example: 'Softmax: logits [3, 1, 0]. e³ ≈ 20.09, e¹ ≈ 2.72, e⁰ = 1. එකතුව ≈ 23.81. පළවෙනි token එක = 20.09 ÷ 23.81 ≈ 0.84. (3 ÷ 4 = 0.75 කියන එක වැරදියි, exponential එක අමතක කරලා.) Temperature: logits [2, 0], T = 1 දී පළවෙනි එක ≈ 0.88. T = 2 දී logits ÷ 2 = [1, 0]. Softmax = e ÷ (e + 1) = 2.72 ÷ 3.72 ≈ 0.73. T වැඩි කළාම පැතලි වුණ නිසා 0.88 ට වඩා අඩුයි. Logprobs: tokens 3ක logprobs −0.1, −0.2, −0.7. එකතුව = −1.0. e^−1 ≈ 0.37. ඉතින් මුළු උත්තරයට model එක දුන්න probability එක ≈ 0.37.',
      code: {
        lang: 'python',
        src: `import numpy as np

def softmax(logits, T=1.0):
    z = np.array(logits) / T      # temperature: softmax එකට කලින් බෙදනවා
    e = np.exp(z - z.max())       # stable වෙන්න max එක අඩු කරනවා
    return e / e.sum()

print(softmax([3, 1, 0]).round(2))       # [0.84 0.11 0.04]
print(softmax([2, 0], T=2).round(2))     # [0.73 0.27]

logprobs = [-0.1, -0.2, -0.7]
print(np.exp(sum(logprobs)).round(2))    # 0.37 = sequence probability`,
      },
      keyPoints: [
        'Logits = vocabulary එකේ හැම token එකකටම raw score. Softmax = exp + normalize = probabilities.',
        'Temperature = softmax එකට කලින් logits ÷ T. T < 1 sharp, T > 1 flat.',
        'Logprob ≤ 0. Sequence probability = e^(logprobs එකතුව).',
        'T = 0 වුණත් batch-dependent floating-point order + near-tie නිසා output වෙනස් වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Autoregressive Loop', si: 'Predict → append → repeat. EOS හෝ limit එකට එනකම්.' },
        { en: 'Logits', si: 'Softmax එකට කලින් තියෙන unnormalized scores.' },
        { en: 'Softmax', si: 'Logits exponentiate කරලා එකතුවෙන් බෙදලා probabilities කරන function එක.' },
        { en: 'Temperature', si: 'Softmax එකට කලින් logits බෙදන අංකය.' },
        { en: 'Logprobs', si: 'තෝරපු token එකේ probability එකේ log අගය. Confidence මනින්න පුළුවන්.' },
        { en: 'Floating-point Non-associativity', si: 'එකතු කරන පිළිවෙළ අනුව floating-point ප්‍රතිඵලය පොඩ්ඩක් වෙනස් වීම.' },
      ],
    },

    // 7
    {
      id: 'greedy-and-beam-search',
      title: 'Greedy & Beam Search in Depth: generate() Arguments, Length Penalty, Memory',
      examRefs: ['TOK-017', 'TOK-018', 'TOK-048', 'TOK-070', 'TOK-109', 'TOK-110', 'TOK-133'],
      body: [
        'Greedy decoding හැම step එකකම argmax (වැඩිම probability token එක) ගන්නවා. Deterministic, වේගවත්. ඒත් දැන් හොඳ වගේ පේන තේරීමක් නිසා මුළු sequence එකම අඩු හොඳ වෙන්න පුළුවන්. Hugging Face වල model.generate(**inputs, do_sample=False, num_beams=1) කියන්නේ greedy. Beam search ඕනේ නම් num_beams > 1, sampling ඕනේ නම් do_sample=True.',
        'Beam search හැම step එකකම cumulative log-probability එක අනුව හොඳම N partial sequences (beams) තියාගන්නවා. හැම beam එකක්ම expand කරලා, ඔක්කොම අතරින් හොඳම N ආයෙත් තියාගන්නවා. ඒ නිසා greedy එකට වඩා වැඩි likelihood sequences හොයන්න පුළුවන්. තවමත් deterministic. num_beams=4, num_return_sequences=2, do_sample=False දැම්මාම අන්තිම beams 4න් score එක වැඩිම 2 return කරනවා (num_return_sequences ≤ num_beams වෙන්න ඕනේ).',
        'Length penalty: log-probs negative නිසා දිග sequence එකක එකතුව හැම වෙලේම වඩා negative. ඒ නිසා normalize නොකළොත් beam search කෙටි උත්තර වලට කැමතියි. HF වල beam score = log-probs එකතුව ÷ (length ^ length_penalty). length_penalty > 1.0 = දිග sequences වලට වාසි. < 1.0 = කෙටි ඒවාට වාසි.',
        'Chat bots වල beam search අඩුවෙන් පාවිච්චි වෙන්නේ ඇයි? Likelihood maximize කරද්දී bland, generic, ආරක්ෂිත වාක්‍ය එනවා, loops වෙන්නත් පුළුවන්. Request එකකට beams ගොඩක් run කරන නිසා compute ගුණ වෙනවා. KV cache එකත්: prefix sharing නැත්නම් width 4 beam search එකක් greedy එකට වඩා ≈ 4 ගුණයක් KV memory ගන්නවා (හැම beam එකක්ම තමන්ගේම sequence එකක්). Translation වගේ "හරි උත්තරය පටු" වැඩ වලට beam search තවමත් හොඳයි.',
      ],
      analogy: 'Greedy කියන්නේ Colombo සිට Galle යද්දී හැම හන්දියකදීම "දැන් පේන හොඳම පාර" ගන්නවා වගේ. Beam search කියන්නේ යාළුවෝ 4 දෙනෙක් වෙන වෙනම පාරවල් 4ක යවලා, හැම හන්දියකදීම හොඳම 4 දෙනාගේ ගමන් දිගටම යවනවා වගේ. හොඳ පාර හොයාගන්න පුළුවන්, ඒත් වාහන 4ක petrol වියදම.',
      example: 'Length penalty ගණනය: Beam A tokens 5, log-probs එකතුව −5. Beam B tokens 10, එකතුව −8. Penalty නැත්නම් (length_penalty = 0): A = −5, B = −8 → A (කෙටි එක) දිනනවා. length_penalty = 1: A = −5 ÷ 5 = −1.0, B = −8 ÷ 10 = −0.8 → B (දිග එක) දිනනවා. ඉතින් exponent එක වැඩි වෙද්දී දිග sequences වලට penalty එක අඩු වෙනවා.',
      keyPoints: [
        'do_sample=False + num_beams=1 = greedy. num_beams > 1 = beam search. do_sample=True = sampling.',
        'Beam search = cumulative log-prob අනුව top-N partial sequences. Deterministic.',
        'length_penalty > 1 = දිග උත්තර වලට වාසි, < 1 = කෙටි ඒවාට.',
        'Chat වලට beam search = generic, repetitive, compute සහ KV memory × beams.',
      ],
      terms: [
        { en: 'Argmax', si: 'වැඩිම අගය තියෙන token එක තෝරන එක.' },
        { en: 'Beam Width (num_beams)', si: 'එකවර තියාගන්න candidate sequences ගණන.' },
        { en: 'num_return_sequences', si: 'Return කරන sequences ගණන. Beam search වලදී num_beams ට වඩා වැඩි වෙන්න බෑ.' },
        { en: 'length_penalty', si: 'Beam score එක length^lp වලින් බෙදන exponent එක.' },
      ],
    },

    // 8
    {
      id: 'sampling-topk-topp-minp',
      title: 'Sampling Controls: Top-k, Top-p, Min-p and How They Combine with Temperature',
      examRefs: ['TOK-021', 'TOK-022', 'TOK-071', 'TOK-072', 'TOK-076', 'TOK-077', 'TOK-108', 'TOK-135', 'TOK-136'],
      body: [
        'Top-k (උදා: k = 40): probability අනුව ඉහළම tokens 40 විතරක් තියාගෙන, ඒවගේ probabilities ආයෙත් එකතුව 1 වෙන්න normalize කරලා, ඒ අතරින් sample කරනවා. දුර්ලභ tokens වල දිග "tail" එක කපලා දානවා. Output length එක 40ට සීමා වෙන්නේ නෑ, responses 40ක් හැදෙන්නෙත් නෑ.',
        'Top-p / nucleus (උදා: p = 0.9): tokens ලොකු probability එකේ ඉඳන් පිළිවෙළට එකතු කරගෙන යනවා. Cumulative එකතුව 0.9 ට සමාන හෝ වැඩි වෙන අඩුම tokens කට්ටලය තමයි nucleus එක. ඒ අතරින් sample කරනවා. Top-p වල වාසිය: candidates ගණන step එකෙන් step එකට වෙනස් වෙනවා. Model එක confident නම් tokens ටිකයි. අවිනිශ්චිත නම් ගොඩයි. Fixed k එකකට confident step එකකදී junk tokens ඇතුළත් වෙන්න පුළුවන්, අවිනිශ්චිත step එකකදී හොඳ options කැපෙන්න පුළුවන්.',
        'Min-p (උදා: min_p = 0.25): threshold එක relative. ඉහළම token එකේ probability එක × min_p ට වඩා අඩු tokens අයින් කරනවා. Model එක confident නම් (ඉහළම token 0.9) threshold එක ලොකුයි, aggressive pruning. පැතලි distribution එකකදී (ඉහළම 0.2) threshold එක පොඩියි, options ගොඩක් තියෙනවා. Exam උගුල: min_p 0.25 absolute cutoff එකක් ලෙස ගන්න එපා.',
        'Temperature එක්ක එකතු වෙන හැටි: බොහෝ pipelines වල temperature මුලින්, ඊට පස්සේ top-p. Temperature 0.7 සිට 1.3 ට වැඩි කළොත් (top_p = 0.9 fixed) distribution එක පැතලි නිසා 0.9 ට එන්න වැඩි tokens ඕනේ. Nucleus එක ලොකු වෙනවා. ඉහළ temperature + ලිහිල් top-p එකට එකතු වෙලා ඉක්මනට incoherent text එනවා. do_sample=True එක්ක greedy වගේ හැසිරෙන්න ඕනේ නම් top_k = 1 (එක token එකයි ඉතුරු). top_p = 1.0, temperature = 1.0 කියන්නේ distribution එක වෙනස් නොකර තියන එක, greedy එකේ අනිත් පැත්ත. Creative variety එකට (slogans) හොඳ settings: temperature 0.9 + top_p 0.9. Diversity එකක් තියෙනවා, junk tail එක කැපෙනවා. Temperature 2.0 truncation නැතුව = junk. Greedy/beam = හැම පාරම එකම output එක.',
      ],
      analogy: 'Keells එකේ birthday cake එකක් තෝරනවා හිතන්න. Top-k = "හොඳම cakes 5 අතරින් විතරක් තෝරන්න", cakes කොච්චර හොඳ වුණත් නරක වුණත් හැම වෙලේම 5යි. Top-p = "ජනප්‍රියතාවයෙන් 90%ක් cover වෙනකම් cakes තියාගන්න", එක cake එකක් හැමෝම කැමති නම් ඒක විතරයි. Min-p = "ජනප්‍රියම cake එකට ලැබෙන votes වලින් හතරෙන් එකක්වත් නැති cakes අයින් කරන්න".',
      example: 'Nucleus size: sorted probabilities [0.50, 0.20, 0.15, 0.10, 0.05], top_p = 0.8. Cumulative: 0.50, 0.70, 0.85. 0.70 < 0.8 නිසා දෙකෙන් නවතින්න බෑ. 0.85 ≥ 0.8. ඉතින් tokens 3ක් ඉතුරුයි. Min-p: probabilities [0.60, 0.20, 0.10, 0.05, 0.05], min_p = 0.25. Threshold = 0.25 × 0.60 = 0.15. 0.60 සහ 0.20 විතරක් ≥ 0.15. ඉතින් tokens 2යි. (0.25 absolute ලෙස ගත්තොත් 1යි කියන වැරදි උත්තරය එනවා.) Top-k renormalize: k = 2 නම් 0.60 ÷ 0.80 = 0.75, 0.20 ÷ 0.80 = 0.25.',
      code: {
        lang: 'python',
        src: `import numpy as np
p = np.array([0.50, 0.20, 0.15, 0.10, 0.05])   # sorted probabilities

# Top-p: cumulative >= 0.8 වෙන අඩුම ගණන
cum = np.cumsum(p)
print(int(np.searchsorted(cum, 0.8) + 1))       # 3

# Min-p: ඉහළම එක x min_p ට වඩා අඩු ඒවා අයින්
q = np.array([0.60, 0.20, 0.10, 0.05, 0.05])
print(int((q >= 0.25 * q.max()).sum()))         # 2`,
      },
      keyPoints: [
        'Top-k = ඉහළම k tokens, renormalize කරලා sample.',
        'Top-p = cumulative ≥ p වෙන අඩුම set එක. ප්‍රමාණය confidence අනුව වෙනස් වෙනවා.',
        'Min-p = threshold = min_p × ඉහළම probability. Relative, absolute නෙවෙයි.',
        'Temperature වැඩි = nucleus ලොකු. do_sample=True + top_k=1 = greedy.',
        'Creative + coherent = temperature 0.9 + top_p 0.9 වගේ.',
      ],
      terms: [
        { en: 'Top-k Sampling', si: 'ඉහළම k tokens අතරින් sample කරන එක.' },
        { en: 'Nucleus (Top-p) Sampling', si: 'Cumulative probability p ට එන අඩුම tokens set එකෙන් sample කරන එක.' },
        { en: 'Min-p Sampling', si: 'ඉහළම token එකේ probability එකට සාපේක්ෂ threshold එකකින් filter කරන එක.' },
        { en: 'Renormalization', si: 'අයින් කළාට පස්සේ ඉතුරු probabilities ආයෙත් එකතුව 1 වෙන්න බෙදන එක.' },
        { en: 'Long Tail', si: 'පොඩි probabilities තියෙන ගොඩක් tokens. එකතුව ලොකු වෙන්න පුළුවන්, junk ගේනවා.' },
      ],
    },

    // 9
    {
      id: 'penalties-and-logit-bias',
      title: 'Repetition, Frequency & Presence Penalties, no_repeat_ngram, Logit Bias & Logits Processors',
      examRefs: ['TOK-038', 'TOK-064', 'TOK-073', 'TOK-096', 'TOK-134', 'TOK-137', 'TOK-138'],
      body: [
        'Repetition penalty එක context එකේ දැනටමත් ආපු tokens වල scores අඩු කරනවා. "the the the" වගේ loops සහ එකම වාක්‍ය නැවත නැවත එන එක අඩු වෙනවා. ඒක scores adjust කරනවා විතරයි, stop sequence එකක් වගේ generation එක නවත්වන්නේ නෑ.',
        'CTRL-style repetition penalty (HF repetition_penalty) එකේ sign handling එක: penalty > 1. Logit එක positive නම් penalty එකෙන් බෙදනවා. Negative නම් penalty එකෙන් ගුණ කරනවා. ඇයි? Negative logit එකක් 1 ට වඩා ලොකු අංකයකින් බෙදුවොත් ඒක 0 ට ළං වෙනවා, ඒ කියන්නේ වැඩි වෙනවා. Token එක අඩු වෙනුවට වැඩි likely වෙනවා. ගුණ කළාම තවත් negative වෙනවා, හරියටම අඩු වෙනවා.',
        'OpenAI-style frequency සහ presence penalties: frequency penalty එක token එක කී පාරක් ආවද කියන ගණන (count) එක්ක වැඩි වෙනවා. Verbatim repetition එකට ගැලපෙනවා. Presence penalty එක flat: එක පාරක් හරි ආවොත් එකම අගය. Model එක අලුත් topics වලට තල්ලු කරනවා. Formula එක වචන වලින්: අලුත් logit = පරණ logit − (count × frequency_penalty) − (count > 0 නම් presence_penalty). දෙකම temperature වෙනස් කරන්නේ නෑ.',
        'no_repeat_ngram_size=3 (HF generate): දැනටමත් output එකේ තියෙන 3-token sequence එකක් (trigram) සම්පූර්ණ වෙන token එකක් hard-block කරනවා. ඒ කියන්නේ කිසිම trigram එකක් දෙපාරක් එන්නේ නෑ. Loops නැති වෙනවා, ඒත් නම් වගේ legitimate repeats ත් block වෙන්න පුළුවන්. Soft score අඩු කිරීම repetition penalty.',
        'Logit bias (OpenAI-compatible API): logit_bias එකෙන් තෝරපු token IDs වල logits වලට fixed offset එකක් sampling එකට කලින් එකතු කරනවා. −100 වගේ අගයක් = ඒ token එක ban. Presence penalty එකකින් බෑ, මොකද ඒක වැඩ කරන්නේ token එක දැනටමත් ආවට පස්සේ, පළමු වතාව block කරන්නේ නෑ. HF වල custom LogitsProcessor එකකින් scores[:, ids] = −inf කළොත් softmax probability හරියටම 0. Greedy වුණත් sampling වුණත් ඒ tokens කවදාවත් එන්නේ නෑ. bad_words_ids සහ constrained decoding පාවිච්චි කරන්නෙත් මේ masking primitive එකමයි.',
      ],
      analogy: 'Frequency penalty කියන්නේ කතාවක් කියන යාළුවෙක්ට "machan" කියන වචනය කියන හැම පාරකටම Rs. 10 දඩයක්. 5 පාරක් කිව්වොත් Rs. 50යි. Presence penalty කියන්නේ "machan" එක පාරක් හරි කිව්වොත් එක පාරක් Rs. 30යි, කී පාරක් කිව්වත් එච්චරයි. Logit bias −100 කියන්නේ ඒ වචනය කියන එක සම්පූර්ණයෙන්ම තහනම්. Repetition penalty sign එක: ණය (negative) තියෙන කෙනෙක්ට "ණය දෙකෙන් බෙදනවා" කිව්වොත් එයාට ලාභයි. දඩුවමක් වෙන්න නම් ණය ගුණ කරන්න ඕනේ.',
      example: 'Frequency + presence: token එක 3 පාරක් ආවා, frequency_penalty 0.5, presence_penalty 0.6. Frequency කොටස = 3 × 0.5 = 1.5. Presence කොටස = flat 0.6. මුළු අඩු කිරීම = 2.1. (Presence එකත් count එකෙන් ගුණ කළොත් 3.3 කියන වැරදි උත්තරය.) CTRL penalty 1.2: positive logit 3 → 3 ÷ 1.2 = 2.5 (අඩු වුණා, හරි). Negative logit −2 → ÷ 1.2 කළොත් −1.67 (වැඩි වුණා, වැරදියි). × 1.2 කළොත් −2.4 (අඩු වුණා, හරි).',
      code: {
        lang: 'python',
        src: `from transformers import LogitsProcessor

class Ban(LogitsProcessor):
    def __init__(self, ids):
        self.ids = ids
    def __call__(self, input_ids, scores):
        scores[:, self.ids] = -float("inf")   # probability = 0
        return scores

def ctrl_penalty(logit, p=1.2):
    return logit / p if logit > 0 else logit * p   # දෙපැත්තටම අඩු වෙනවා

print(ctrl_penalty(3), ctrl_penalty(-2))   # 2.5 -2.4`,
      },
      keyPoints: [
        'Repetition penalty = දැනටමත් ආපු tokens වල scores අඩු කරනවා. Stop කරන්නේ නෑ.',
        'CTRL penalty: positive ÷ p, negative × p. නැත්නම් negative logits වැඩි වෙනවා.',
        'Frequency = count × penalty. Presence = flat, count එකෙන් ගුණ නෑ.',
        'no_repeat_ngram_size = trigram වගේ n-grams hard-block.',
        'logit_bias −100 = ban (පළමු වතාවත්). Logits = −inf = probability 0.',
      ],
      terms: [
        { en: 'Repetition Penalty', si: 'කලින් ආපු tokens වල logits අඩු කරන soft penalty එක.' },
        { en: 'Frequency Penalty', si: 'Token එක ආපු වාර ගණනට අනුපාතිකව logit එක අඩු කරන එක.' },
        { en: 'Presence Penalty', si: 'Token එක එක පාරක් හරි ආවොත් fixed අගයකින් logit එක අඩු කරන එක.' },
        { en: 'no_repeat_ngram_size', si: 'දැනටමත් තියෙන n-gram එකක් ආයෙත් හැදෙන එක hard-block කරන HF option එක.' },
        { en: 'logit_bias', si: 'තෝරපු token IDs වල logits වලට fixed offset එකක් දාන API parameter එක.' },
        { en: 'LogitsProcessor', si: 'හැම step එකකම scores වෙනස් කරන HF hook එක.' },
      ],
    },

    // 10
    {
      id: 'generation-troubleshooting',
      title: 'Generation Troubleshooting: Truncation, Never Stopping, Empty Output, Echoed Prompts, Padding',
      examRefs: ['TOK-023', 'TOK-024', 'TOK-078', 'TOK-079', 'TOK-080', 'TOK-081', 'TOK-095', 'TOK-111', 'TOK-112'],
      body: [
        'Answers වාක්‍යය මැද නවතිනවා, API එකේ finish_reason = "length" නම්: generation එක EOS එකෙන් නෙවෙයි, output-token cap එකෙන් (max_new_tokens / max tokens) නැවතිලා. Limit එක වැඩි කරන්න. Stop sequence එකකින් නැවතුනා නම් finish_reason = "stop", සාමාන්‍යයෙන් පිරිසිදු boundary එකක.',
        'Stop sequence එකක් කියන්නේ generate වුණ ගමන් generation එක නවත්වන string එකක් (උදා: "\\nUser:"). Matched text එක සාමාන්‍යයෙන් response එකට ඇතුළත් වෙන්නේ නෑ. Completion endpoint එකක් හරි උත්තරේ දීලා "\\nUser: ..." කියලා ඊළඟ turn එක හදනවා නම් සරලම fix එක "\\nUser:" stop sequence එකක් ලෙස දාන එක. Greedy කළත් ඒ invented turn එක most likely continuation එක නම් ආයෙත් එනවා.',
        'Generation කවදාවත් නවතින්නේ නැත්නම් (SFT එකෙන් පස්සේ හැම request එකක්ම max_new_tokens එකට යනවා): ගොඩක් වෙලාවට training targets EOS token එකකින් ඉවර වෙලා නෑ, හෝ EOS එක loss එකෙන් mask වෙලා. Model එක නවතින්න ඉගෙන ගන්නේ targets අගට EOS predict කරලා. Temperature අඩු කළාට model එක predict නොකරන EOS එකක් එන්නේ නෑ. අනිත් පැත්ත: model එක ඉක්මනටම EOS emit කරලා හිස් උත්තර දෙනවා නම් min_new_tokens. ඒකෙන් අවම tokens ගණනක් එනකම් EOS suppress කරනවා. max_new_tokens එක උපරිම සීමාව විතරයි.',
        'Prompt එක output එකේ echo වෙනවා නම්: decoder-only models වල generate() return කරන්නේ prompt tokens + අලුත් tokens. ඉතින් out[0][inputs["input_ids"].shape[1]:] කියලා prompt length එක slice කරලා decode කරන්න. skip_special_tokens එකෙන් EOS වගේ markers අයින් වෙනවා, prompt text එක අයින් වෙන්නේ නෑ.',
        'Batched generation එකේ padding: decoder-only model එකක් අලුත් tokens එකතු කරන්නේ හැම row එකකම අගට. ඒ නිසා padding_side="left" ඕනේ. Right padding නම් කෙටි prompts වලට pad tokens වලට පස්සේ generate කරන්න වෙනවා, completions නරකයි. (Encoder models සහ training වලට right padding කමක් නෑ.) Llama-family tokenizer එකක padding=True දැම්මාම "no padding token" error එකක් එනවා නම් tokenizer.pad_token = tokenizer.eos_token. Attention mask එක pad positions හංගන නිසා මේක ආරක්ෂිතයි. ඒත් attention_mask එක model එකට නොදී input_ids විතරක් දුන්නොත් pad tokens real tokens ලෙස attention එකට ඇතුළත් වෙලා padded sequences වල outputs නරක් වෙනවා (HF ගොඩක් වෙලාවට warning එකක් දෙනවා). Memory එකට හෝ determinism එකට ඒකෙන් බලපෑමක් නෑ.',
      ],
      analogy: 'finish_reason "length" කියන්නේ bus එකේ ටිකට් එක Kadawatha දක්වා විතරක් ගත්ත නිසා Kandy යන්න කලින් බස්සනවා වගේ. EOS කියන්නේ "මම ගමනාන්තයට ආවා" කියලා බහින එක. EOS ඉගෙන නොගත්ත model එක, නවතින්න නොදන්න තුන් රෝද රථයක් වගේ, petrol ඉවර වෙනකම් (max tokens) යනවා. Left padding කියන්නේ queue එකේ හිස් තැන් මුලට දාන එක. එතකොට හැමෝගේම අග එකම තැනක, ඊළඟ කෙනා එන තැන.',
      example: 'Batch එක: ["Hi", "Tell me about Kandy"]. Right padding: ["Hi <pad> <pad> <pad>", "Tell me about Kandy"]. Model එක "Hi" row එකේ අගට, <pad> වලට පස්සේ ලියනවා, අවුල්. Left padding: ["<pad> <pad> <pad> Hi", "Tell me about Kandy"], attention_mask = [[0,0,0,1],[1,1,1,1]]. දැන් rows දෙකේම අග real token එකක්. Echo fix: prompt එක tokens 12ක් නම් out[0][12:] විතරක් decode කරන්න.',
      code: {
        lang: 'python',
        src: `tok.padding_side = "left"                 # decoder-only batched generation
if tok.pad_token is None:
    tok.pad_token = tok.eos_token           # Llama වගේ pad නැති tokenizers

inputs = tok(["Hi", "Tell me about Kandy"], return_tensors="pt", padding=True)
out = model.generate(**inputs,              # attention_mask එකත් යනවා
                     max_new_tokens=200, min_new_tokens=5)

n = inputs["input_ids"].shape[1]
print(tok.decode(out[0][n:], skip_special_tokens=True))  # prompt එක නැතුව`,
      },
      keyPoints: [
        'finish_reason "length" = max tokens cap එකට ආවා. "stop" = EOS හෝ stop sequence.',
        'Invented "User:" turns = "\\nUser:" stop sequence එකක් දාන්න.',
        'කවදාවත් නවතින්නේ නෑ = SFT targets වල EOS නෑ. හිස් උත්තර = min_new_tokens.',
        'Prompt echo = out[0][prompt_len:] slice කරන්න.',
        'Decoder-only batch generation = padding_side="left", pad_token = eos_token, attention_mask දෙන්න.',
      ],
      terms: [
        { en: 'finish_reason', si: 'Generation එක නැවතුනේ ඇයි කියන API field එක ("stop", "length" වගේ).' },
        { en: 'Stop Sequence', si: 'Generate වුණ ගමන් generation එක නවත්වන string එක.' },
        { en: 'min_new_tokens', si: 'අවම tokens ගණනක් එනකම් EOS block කරන parameter එක.' },
        { en: 'padding_side', si: 'Padding දාන පැත්ත. Decoder-only generation වලට "left".' },
        { en: 'pad_token', si: 'Padding වලට පාවිච්චි වෙන token එක. නැත්නම් EOS එක ලෙස set කරනවා.' },
      ],
    },

    // 11
    {
      id: 'constrained-decoding-json',
      title: 'Constrained Decoding & Guaranteed JSON: Grammars, Token Boundaries, Side Effects',
      examRefs: ['TOK-092', 'TOK-093', 'TOK-139', 'TOK-140'],
      body: [
        'Prompting හොඳට කළත් extraction service එකක responses වලින් 3%ක malformed JSON එනවා කියමු. Examples වැඩි කරන එක, beams වැඩි කරන එක, retry/repair කරන එක chance එක වැඩි කරනවා, ඒත් guarantee එකක් නෑ. Temperature වැඩි කළොත් වැරදි තවත් වැඩියි. Syntax එක guarantee කරන එකම ක්‍රමය: JSON-schema-constrained decoding (structured output).',
        'ඒක වැඩ කරන්නේ මෙහෙමයි: grammar එකක් (JSON schema එක, regex එකක්, context-free grammar එකක්) state machine (automaton) එකක් බවට හරවනවා. Generation එකේ හැම step එකකම, output එක grammar එකේ කොහෙද ඉන්නේ කියලා state එක track කරනවා. ඊළඟට grammar එක කඩන tokens වල logits −∞ කරනවා (mask). ඉතින් sample කරන්න පුළුවන් valid continuations විතරයි. Invalid syntax එක හදන්න බැරි තරමටම.',
        'Characters එකින් එක check කරන්න බැරි ඇයි? Tokens කියන්නේ characters කිහිපයක්. එක token එකක් grammar boundaries හරහා යන්න පුළුවන්. උදා: "}, කියන token එක string එක close කරලා, object එක close කරලා, comma එකක් දානවා, grammar එකේ steps කිහිපයක් එකපාර. ඒ නිසා libraries grammar state එක vocabulary එකට map කරලා, හැම state එකකටම allowed tokens කලින්ම precompute කරනවා. JSON grammars automata ලෙස ලේසියෙන් ලියන්න පුළුවන්.',
        'Side effect එක: syntax එක හැම වෙලේම valid, ඒත් content quality එක අඩු වෙන්න පුළුවන්. Schema එක model එක ස්වාභාවිකව ලියන විදිහට පටහැනි නම් (field order එක, reasoning කරන්න ඉඩ නැති එක), model එකට අඩු probability tokens බලෙන් තෝරන්න වෙනවා. Distribution එක distort වෙනවා. ප්‍රායෝගික උපදෙස: schema එකේ reasoning field එකක් answer එකට කලින් තියන්න, fields ස්වාභාවික පිළිවෙළට තියන්න.',
      ],
      analogy: 'Constrained decoding කියන්නේ bank එකේ online form එකක් වගේ. NIC field එකට අකුරු type කරන්න බෑ, date field එකේ calendar එකෙන් විතරයි තෝරන්නේ. වැරදි format එකක් ඇතුළත් කරන්නම බෑ. ඒත් form එකේ "හේතුව" box එක අකුරු 10කට සීමා කළොත් ඔයාට ඇත්ත හේතුව හරියට ලියන්න බැරි වෙනවා. ඒක තමයි quality side effect එක.',
      example: 'Schema එක: {"name": string, "city": string}. Model එක දැන් {"name": "Kamal" දක්වා ලියලා. Grammar state එක = "string value එකකට පස්සේ". Allowed: "," හෝ "}" වගේ tokens. "Kandy" වගේ token එකකට −∞. ඉතින් ඊළඟ token එක අනිවාර්යයෙන්ම valid. "}, වගේ multi-step token එකක් allowed ද කියලා precompute කරපු table එකෙන් බලනවා.',
      keyPoints: [
        'Prompting/retries/beams = chance වැඩි කරනවා, guarantee නෑ. Constrained decoding = guarantee.',
        'Mechanism: grammar state machine + හැම step එකකම invalid tokens logits −∞.',
        'Tokens grammar boundaries හරහා යනවා, ඒ නිසා state → allowed vocabulary tokens precompute කරනවා.',
        'Risk: syntax valid, ඒත් content quality distort වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Constrained / Structured Decoding', si: 'Grammar හෝ schema එකකට ගැළපෙන tokens විතරක් sample වෙන්න logits mask කරන ක්‍රමය.' },
        { en: 'JSON Schema', si: 'JSON object එකක fields, types, අවශ්‍ය දේ විස්තර කරන spec එක.' },
        { en: 'Finite-State Machine / Automaton', si: 'Grammar එකේ දැනට ඉන්න තැන (state) සහ ඊළඟට යන්න පුළුවන් තැන් track කරන model එක.' },
        { en: 'Logit Masking', si: 'Invalid tokens වල logits −∞ කරලා probability 0 කරන එක.' },
      ],
    },

    // 12
    {
      id: 'prefill-decode-bottlenecks',
      title: 'Prefill vs Decode: Compute-bound vs Memory-bound, Arithmetic Intensity & FLOPs',
      examRefs: ['TOK-027', 'TOK-028', 'TOK-036', 'TOK-050', 'TOK-058', 'TOK-097', 'TOK-098', 'TOK-120'],
      body: [
        'Prefill: prompt එකේ tokens ඔක්කොම එක forward pass එකකින් parallel විදිහට model එක හරහා යවලා, KV cache එක පුරවලා, පළවෙනි output token එකේ logits හදනවා. Decode: ඊට පස්සේ token එකින් එක generate කරනවා. පළවෙනි token එක එන්න කලින් මුළු prompt එකම process වෙන්න ඕනේ නිසා දිග prompt එකක TTFT (time to first token) එක තීරණය කරන්නේ ප්‍රධාන වශයෙන් prefill (+ queueing). ඊට පස්සේ tokens අතර කාලය decode speed එකෙන්.',
        'Arithmetic intensity කියන්නේ memory එකෙන් කියවන එක byte එකකට කරන FLOPs ගණන. GPU එකක compute එක ගොඩක් ලොකුයි, memory bandwidth එක ඊට සාපේක්ෂව පොඩියි. ඒ නිසා compute-bound වෙන්න නම් byte එකකට FLOPs සිය ගණනක් වගේ ඕනේ. Batch-1 decode එකේ හැම FP16 weight එකක්ම (bytes 2) එක multiply-add එකකට (FLOPs 2) විතරයි පාවිච්චි වෙන්නේ. Intensity ≈ 1 FLOP/byte. ඒ නිසා Tensor Cores ගොඩක් වෙලාවට නිකන් ඉන්නවා. Decode = memory-bandwidth bound: හැම step එකකම weights සහ KV cache කියවන්න ඕනේ, ගණිතය ටිකයි.',
        'Prefill compute-bound ඇයි? Prompt tokens සිය ගණනක් හෝ දහස් ගණනක් එකවර එකම weight matrix එකෙන් ගුණ වෙනවා (matrix-matrix). එක weight read එකකට FLOPs ගොඩක්. ඒ නිසා peak FLOPs වැදගත්. Decode එකේදී sequence එකකට එක token එකයි, weights load කරන එක ප්‍රධාන වියදම.',
        'ඒ නිසාම තමයි servers requests batch කරන්නේ: decode එකේදී එක weight read එකකින් sequences ගොඩකට වැඩ කරන්න පුළුවන්. Throughput ගොඩක් වැඩි වෙනවා, GPU utilization වැඩි වෙනවා. Batching එකෙන් outputs deterministic වෙන්නේ නෑ, KV cache එක ඕනේ නැති වෙන්නෙත් නෑ.',
        'Batch-1 decode speed එකේ උපරිම සීමාව ඇස්තමේන්තු කරන්න: tokens per second ≤ memory bandwidth ÷ weight bytes. Prefill FLOPs ඇස්තමේන්තුව: forward pass එකකට token එකකට ≈ 2 × parameters FLOPs (multiply සහ add නිසා 2). Attention එක මෙතන ignore කරනවා.',
      ],
      analogy: 'Kottu කඩේ හිතන්න. Prefill කියන්නේ order 50ක් එකපාර ලොකු තාච්චියක ගහනවා වගේ. බඩු (weights) එක පාරක් ගෙනාවාම ගොඩක් කොත්තු හැදෙනවා. කෝකියාගේ වේගය (compute) තමයි සීමාව. Decode කියන්නේ එක කොත්තු එකක් හදන්න හැම පාරම stores එකට ගිහින් බඩු ඔක්කොම ගෙනෙනවා වගේ. කෝකියා වැඩිපුර වෙලාව යන්නේ ඇවිදින්න (memory bandwidth). Batching කියන්නේ එක ගමනකින් orders 32කට බඩු ගෙනෙන එක.',
      example: 'Bandwidth estimate: 7B model, FP16 = 14 GB weights, GPU bandwidth 2 TB/s. එක token එකකට 14 GB කියවන්න 14 ÷ 2,000 = 0.007 s = 7 ms. ඉතින් උපරිම ≈ 1 ÷ 0.007 ≈ 140 tokens/s (ඇත්තටම ටිකක් අඩුයි). Prefill FLOPs: 1,000-token prompt, 7B model. 2 × 7×10⁹ × 1,000 = 1.4×10¹³ = 14 TFLOPs. (14 GFLOPs = එක token එකකට විතරයි. 7 TFLOPs = 2 අමතක කරලා.) Arithmetic intensity: FLOPs 2 ÷ bytes 2 = 1 FLOP/byte.',
      code: {
        lang: 'python',
        src: `params = 7e9
weight_bytes = params * 2          # FP16 = bytes 2
bandwidth = 2e12                   # 2 TB/s

print(bandwidth / weight_bytes)    # ~143 tokens/s උපරිමය (batch 1)

prompt = 1000
print(2 * params * prompt / 1e12, "TFLOPs")   # 14.0 prefill

print(2 / 2, "FLOP/byte")          # batch-1 decode arithmetic intensity`,
      },
      keyPoints: [
        'Prefill = prompt එක parallel, KV cache පුරවනවා, TTFT තීරණය කරනවා. Compute-bound.',
        'Decode = token එකින් එක, memory-bandwidth bound (weights + KV කියවීම).',
        'Batch-1 decode arithmetic intensity ≈ 1 FLOP/byte. GPU එකට සිය ගණනක් ඕනේ.',
        'Batching = එක weight read එකක් sequences ගොඩකට. Throughput වැඩියි.',
        'Batch-1 tokens/s ≤ bandwidth ÷ weight bytes. Prefill FLOPs ≈ 2 × params × tokens.',
      ],
      terms: [
        { en: 'Prefill', si: 'Prompt එක එක pass එකකින් process කරලා KV cache හදන අදියර.' },
        { en: 'Decode', si: 'Token එකින් එක generate කරන අදියර.' },
        { en: 'Arithmetic Intensity', si: 'කියවන byte එකකට කරන FLOPs ගණන.' },
        { en: 'Memory-bound / Compute-bound', si: 'Bottleneck එක data ගෙනෙන වේගයද (memory) ගණනය කරන වේගයද (compute) කියන එක.' },
        { en: 'GEMV vs GEMM', si: 'Matrix × vector (decode, batch 1) සහ matrix × matrix (prefill, ලොකු batches).' },
        { en: 'Roofline', si: 'Arithmetic intensity එක අනුව compute හෝ bandwidth සීමාව පෙන්නන සරල model එක.' },
      ],
    },

    // 13
    {
      id: 'latency-throughput-math',
      title: 'TTFT, TPOT, Throughput & End-to-End Latency: Worked Calculations',
      examRefs: ['TOK-029', 'TOK-030', 'TOK-040', 'TOK-056', 'TOK-057', 'TOK-100', 'TOK-107', 'TOK-148'],
      body: [
        'TPOT (time per output token, inter-token latency) කියන්නේ පළවෙනි token එකෙන් පස්සේ, අනුයාත tokens දෙකක් අතර සාමාන්‍ය කාලය. එක user කෙනෙක් streaming කරද්දී දැනෙන decode speed එක. සියලුම users ලාගේ එකතු tokens per second එක system throughput, ඒක වෙනම metric එකක්.',
        'කුමන metric එකද? Interactive chat වලට TTFT සහ TPOT. Offline batch job එකකට (රෑ summarize කරන එක) කවුරුත් එක response එකක් බලාගෙන නෑ, ඒ නිසා throughput (total tokens/s) maximize කරන්න, ගොඩක් වෙලාවට ලොකු batches එක්ක. ඒකෙන් cost එක අඩු වෙනවා.',
        'Streaming එකෙන් generation එක වේගවත් වෙන්නේ නෑ. Text හැදෙන ගමන් පෙන්නන නිසා user බලාගෙන ඉන්නේ TTFT එක විතරයි. Perceived latency එක අඩු වෙනවා. Accuracy, memory වලට බලපෑමක් නෑ.',
        'Batch size වැඩි කළාම: weight reads amortize වෙන නිසා throughput වැඩි වෙනවා. ඒත් හැම step එකක්ම දිග වෙනවා, requests ගොඩක් GPU එක share කරනවා, ඒ නිසා හැම user කෙනෙක්ටම tokens හෙමින්. Per-request latency වැඩියි. GPU එක compute-bound වුණාම හෝ KV memory ඉවර වුණාම gains flatten වෙනවා.',
        'ගණනය කරන නීති වචන වලින්: (1) Decode throughput = batch එකේ sequences ගණන ÷ step time (හැම step එකකම sequence එකකට එක token එක). (2) TPOT = (මුළු latency − TTFT) ÷ (tokens − 1). පළවෙනි token එක TTFT එකට අයිතියි, ඒ නිසා −1. (3) End-to-end ≈ prompt tokens ÷ prefill speed + output tokens ÷ decode speed. (4) Batch job කාලය = මුළු output tokens ÷ aggregate throughput.',
      ],
      analogy: 'TTFT කියන්නේ kottu කඩේට order එක දීලා පළවෙනි කොත්තු පිඟාන එන්න යන කාලය. TPOT කියන්නේ ඊට පස්සේ එක එක පිඟාන අතර කාලය. Throughput කියන්නේ කඩේ පැයකට මුළු පිඟාන ගණන. කඩේට ගොඩක් orders එකවර ගත්තොත් (ලොකු batch) පැයට පිඟාන වැඩියි, ඒත් ඔයාගේ පිඟාන එන්න පරක්කුයි.',
      example: 'Throughput: batch 32, decode step එකක් 25 ms. 32 ÷ 0.025 = 1,280 tokens/s (40 tokens/s කියන්නේ එක user කෙනෙක්ගේ rate එක). TPOT: tokens 500, මුළු latency 10.5 s, TTFT 0.5 s. (10.5 − 0.5) ÷ 499 = 10.0 ÷ 499 ≈ 0.020 s = 20 ms (10.5 ÷ 500 = 21 ms කියන එක prefill එකත් ඇතුළත් කරලා වැරදියි). Batch job: requests 100 × tokens 200 = 20,000. 20,000 ÷ 2,000 tokens/s = 10 s. End-to-end: prefill 10,000 tokens/s, decode 50 tokens/s, prompt 8,000, output 200. Prefill = 0.8 s (TTFT), decode = 200 ÷ 50 = 4 s. මුළු ≈ 4.8 s.',
      code: {
        lang: 'python',
        src: `print(32 / 0.025)                 # 1280 tokens/s (system throughput)
print((10.5 - 0.5) / (500 - 1))   # 0.02 s = TPOT 20 ms
print(100 * 200 / 2000)           # 10 s batch job

ttft = 8000 / 10_000              # 0.8 s prefill
print(ttft + 200 / 50)            # 4.8 s end-to-end`,
      },
      keyPoints: [
        'TPOT = (total − TTFT) ÷ (tokens − 1). Throughput = සියලු users ගේ tokens/s.',
        'Interactive = TTFT + TPOT. Offline batch = throughput.',
        'Streaming = perceived latency විතරයි අඩු වෙන්නේ.',
        'Batch size වැඩි = throughput වැඩි, per-request latency වැඩි.',
        'End-to-end ≈ prompt ÷ prefill speed + output ÷ decode speed.',
      ],
      terms: [
        { en: 'TTFT', si: 'Request එක යවලා පළවෙනි token එක එනකම් කාලය.' },
        { en: 'TPOT / ITL', si: 'පළවෙනි token එකෙන් පස්සේ tokens අතර සාමාන්‍ය කාලය.' },
        { en: 'Throughput', si: 'System එකේ මුළු tokens per second.' },
        { en: 'End-to-end Latency', si: 'Request එකේ ආරම්භයේ සිට අන්තිම token එක දක්වා කාලය.' },
        { en: 'Perceived Latency', si: 'User ට දැනෙන බලාගෙන ඉන්න කාලය. Streaming එකෙන් අඩු වෙනවා.' },
      ],
    },

    // 14
    {
      id: 'kv-cache-memory-math',
      title: 'GPU Memory Math: Weights, KV Cache, GQA, Max Concurrency, MoE',
      examRefs: ['TOK-031', 'TOK-032', 'TOK-034', 'TOK-035', 'TOK-051', 'TOK-053', 'TOK-054', 'TOK-055', 'TOK-101', 'TOK-103', 'TOK-113', 'TOK-147', 'TOK-149'],
      body: [
        'Inference වලදී GPU memory කන ප්‍රධාන දේවල් දෙකයි: weights සහ KV cache. Activation buffers පොඩියි. Optimizer states (Adam moments වගේ) training වලට විතරයි, inference වල නෑ. Weights = parameters × bytes per parameter. FP32 = 4, FP16/BF16 = 2, INT8/FP8 = 1, INT4 = 0.5.',
        'KV cache එකේ තියෙන්නේ කලින් tokens වල key සහ value tensors, හැම attention layer එකකටම. ඒ නිසා decode step එකකදී අලුත්ම token එකට විතරක් projections ගණනය කළාම ඇති. Gradients නෑ. KV cache එක sequence length එකත් එක්කත් batch size (එකවර sequences) එකත් එක්කත් linear විදිහට වැඩි වෙනවා. Vocabulary size එක KV cache එකට බලපාන්නේ නෑ.',
        'Token එකකට KV bytes = 2 (K සහ V) × layers × KV heads × head dimension × bytes per value. Standard MHA එකේ KV heads × head dim = hidden size. GQA (grouped-query attention) එකේ query heads ගොඩකට KV heads ටිකයි. KV cache එක හැදෙන්නේ KV heads වලට විතරයි. ඒ නිසා query heads 32, KV heads 8 නම් KV cache එක හතරෙන් එකයි (8 න් එකක් නෙවෙයි). KV cache එක FP8 කළොත් (FP16 වෙනුවට) KV memory භාගයයි. දිග contexts හෝ වැඩි concurrent requests. Weight quantization එකෙන් ස්වාධීනයි, සාමාන්‍යයෙන් පොඩි accuracy අඩුවක්.',
        'Mixture-of-Experts (MoE): උදා: මුළු parameters ≈ 47B, token එකකට active ≈ 13B. ඕනෑම expert එකකට route වෙන්න පුළුවන් නිසා 47B ඔක්කොම memory එකේ තියෙන්න ඕනේ. ඒත් token එකකට compute එක ≈ 13B dense model එකක් වගේ. ලොකු batches වලදී tokens වෙනස් experts වලට යන නිසා memory traffic එක මුළු model එකට ළං වෙන්න පුළුවන්.',
      ],
      analogy: 'GPU memory එක හරියට Colombo ගෙයක ඉඩම් කොටසක් වගේ. Weights කියන්නේ ගෙදර ස්ථිර ගොඩනැගිල්ල. KV cache කියන්නේ අමුත්තන්ට දාන තාවකාලික මඩුව. අමුත්තන් (requests) වැඩි වෙද්දී, එයාලා වැඩි වෙලා ඉන්න ගමන් (tokens) මඩුව ලොකු වෙනවා. GQA කියන්නේ අමුත්තන් හතර දෙනෙක්ට එක පුටුවක් share කරනවා වගේ. MoE කියන්නේ විශේෂඥ කෝකියන් 8 දෙනෙක් ගෙදර ඉන්න ඕනේ, ඒත් එක කෑමකට වැඩ කරන්නේ දෙන්නයි.',
      example: 'KV (MHA): layers 32, hidden 4,096, FP16. Token එකකට = 2 × 32 × 4,096 × 2 = 524,288 bytes = 0.5 MiB. Tokens 4,096 = 2 GiB (2 අමතක කළොත් 1 GiB වැරදි උත්තරය). KV (GQA 70B): layers 80, KV heads 8, head dim 128, FP16. 2 × 80 × 8 × 128 × 2 = 327,680 bytes = 320 KiB. Tokens 8,192 = 2.5 GiB (full MHA KV heads 64 නම් 8 ගුණයක් = 20 GiB). 13B: layers 40, hidden 5,120. 2 × 40 × 5,120 × 2 = 800 KiB. Batch 16 × 4,096 = 65,536 tokens × 800 KiB = 50 GiB. Weights 26 GB එක්ක 80 GB GPU එකකට හිරයි. Concurrency: 80 GB GPU, weights 14 GB, token එකකට 0.5 MiB, request එකකට tokens 2,048 = 1 GiB. ඉතුරු 66 GB ÷ 1 = requests ≈ 66 (overhead නිසා ඇත්තටම අඩුයි). 70B එක 80 GB එකකට, KV වලට 30 GB ඉතුරු කරන්න: FP16 = 140 GB (බෑ), INT8/FP8 = 70 GB (ඉතුරු 10 GB විතරයි, බෑ), INT4 = 35 GB (ඉතුරු 45 GB, හරි). ඉතින් INT4.',
      code: {
        lang: 'python',
        src: `def kv_per_token(layers, kv_heads, head_dim, bytes_=2):
    return 2 * layers * kv_heads * head_dim * bytes_   # 2 = K සහ V

GiB = 1024**3
print(kv_per_token(32, 32, 128) * 4096 / GiB)       # 2.0  (hidden 4096 MHA)
print(kv_per_token(80, 8, 128) * 8192 / GiB)        # 2.5  (70B GQA)
print(kv_per_token(40, 40, 128) * 16 * 4096 / GiB)  # 50.0 (13B, batch 16)

for name, b in [("FP16", 2), ("INT8", 1), ("INT4", 0.5)]:
    print(name, 70 * b, "GB weights, free:", 80 - 70 * b)`,
      },
      keyPoints: [
        'Inference memory = weights + KV cache (+ පොඩි activations). Optimizer states නෑ.',
        'Weights GB ≈ params (බිලියන) × bytes. 7B FP16 = 14 GB. 70B INT4 = 35 GB.',
        'KV per token = 2 × layers × KV heads × head dim × bytes. Length × batch අනුව linear.',
        'GQA: KV heads 8 / query heads 32 = KV cache ¼. FP8 KV cache = ½.',
        'MoE = memory එකට total params, compute එකට active params.',
      ],
      terms: [
        { en: 'KV Cache', si: 'කලින් tokens වල keys/values, හැම layer එකකටම. Decode වලදී නැවත ගණනය වළක්වනවා.' },
        { en: 'Grouped-Query Attention (GQA)', si: 'Query heads කණ්ඩායමකට එක KV head එකක් share කරන ක්‍රමය.' },
        { en: 'KV Cache Quantization', si: 'KV cache එක FP8/INT8 වගේ අඩු precision එකක තියන එක.' },
        { en: 'Max Concurrency', si: 'Weights වලට පස්සේ ඉතුරු memory ÷ request එකක KV memory.' },
        { en: 'MoE Total vs Active Parameters', si: 'Memory එකේ තියෙන්න ඕනේ මුළු params. Token එකකට වැඩ කරන්නේ active ඒවා විතරයි.' },
        { en: 'GiB vs GB', si: 'GiB = 1024³ bytes, GB = 10⁹ bytes. Exam ගණන් වලදී ආසන්න අගය හොඳටම ඇති.' },
      ],
    },

    // 15
    {
      id: 'batching-paged-kv-scheduling',
      title: 'Serving Systems: Continuous Batching, PagedAttention, Prefix Caching, Preemption, Chunked Prefill, Disaggregation',
      examRefs: ['TOK-037', 'TOK-065', 'TOK-066', 'TOK-067', 'TOK-099', 'TOK-118', 'TOK-119', 'TOK-121', 'TOK-130', 'TOK-131', 'TOK-132'],
      body: [
        'Static batching එකේ batch එක fixed, දිගම sequence එක ඉවර වෙනකම් කෙටි ඒවා ඉවර වුණත් ඒ slots හිස්ව තියෙනවා. Continuous (in-flight) batching = iteration-level scheduling: හැම decode iteration එකකදීම ඉවර වුණ sequence එකේ slot එක නිදහස් වෙනවා, බලාගෙන ඉන්න request එකක් ඒක ගන්නවා. කෙටි requests දිග ඒවා නිසා හිර වෙන්නේ නෑ.',
        'PagedAttention (vLLM): ඊට කලින් systems හැම request එකකටම උපරිම length එකට contiguous memory කලින්ම reserve කළා, මොකද output length එක කලින් දන්නේ නෑ. ඒකේ ගොඩක් හිස්ව තිබ්බා (internal සහ external fragmentation). PagedAttention, OS virtual memory paging වගේ, KV cache එක fixed-size blocks වල තියනවා. Blocks contiguous වෙන්න ඕනේ නෑ. Block table එකකින් map කරනවා, ඕනේ වෙද්දී allocate කරනවා. Waste එක sequence එකකට උපරිම block එකක්. වැඩි requests එකවර ගැළපෙනවා. Compression එක වෙනම දෙයක් (KV quantization).',
        'Copy-on-write සහ prefix sharing: එකම prompt එකෙන් parallel samples 4ක් ඉල්ලුවොත්, sequences 4ගේම block tables prompt එකේ එකම physical blocks වලට point කරනවා (reference counts). Sample එකක් block එකකට ලියන්න යද්දී විතරක් copy කරනවා, සාමාන්‍යයෙන් වෙනස් වෙන්න පටන් ගන්න partially-filled block එක. Beam search එකටත් මේකම උදව්. Prefix (prompt) caching: හැම request එකක්ම එකම 2,000-token system prompt එකකින් පටන් ගන්නවා නම් ඒ prefix එකේ KV entries තියාගෙන reuse කරනවා. Prefill එකට අලුත් user tokens විතරයි. TTFT කෙලින්ම අඩු වෙනවා.',
        'Blocks ඉවර වුණාම (sequences ලොකු වෙද්දී): vLLM වගේ schedulers sequences කිහිපයක් preempt කරනවා. ඒවගේ blocks CPU memory එකට swap කරනවා, නැත්නම් discard කරලා පස්සේ recompute කරනවා (prompt + generate වුණ tokens වලට ආයෙත් prefill). පස්සේ resume කරනවා. Truncate කරන්නේ නෑ, ඒකෙන් outputs නරක් වෙනවා. Chunked prefill: එක user කෙනෙක් 30,000-token prompt එකක් දැම්මාම, ඒක එක step එකකින් process කළොත් අනිත් හැමෝගේම decode iterations හිරවෙනවා. Prompt එක කෑලි වලට කඩලා decode steps අතරට දැම්මාම හැම step එකකම වැඩ සීමිතයි, අනිත් streams දිගටම tokens ලබනවා.',
        'Attention batch වෙන්නේ නැත්තේ ඇයි? Weights හැම sequence එකකටම පොදුයි, batch කළාම එක read එකක් share වෙනවා. ඒත් හැම sequence එකකටම තමන්ගේම KV cache එක. ඉතින් KV reads share වෙන්නේ නෑ. Memory traffic = batch × context. ලොකු batch, දිග context decode = KV-bandwidth bound. Disaggregated serving: prefill සහ decode වෙනම GPU pools වල. හේතුව: bottlenecks වෙනස් (prefill compute, decode memory). එකට තිබ්බාම prefill bursts decode latency එක වැඩි කරනවා. වෙන් කළාම TTFT සහ TPOT targets වලට pool එකින් එක වෙනම parallelism, batch sizes tune කරන්න පුළුවන්. වියදම: KV cache එක pools අතර transfer කරන්න ඕනේ. Pools දෙකටම full weights ඕනේ.',
      ],
      analogy: 'Paged KV cache කියන්නේ library එකක පොත් තියන්න මුළු රාක්කයක්ම කලින් වෙන් කරන්නේ නැතුව, ඕනේ වෙද්දී පුංචි පෙට්ටි එකින් එක දෙනවා වගේ. පෙට්ටි කොහේ තිබුණත් index card එකෙන් (block table) හොයාගන්නවා. Prefix caching කියන්නේ හැම customer කෙනෙක්ටම එකම menu එක කියවලා දෙනවා වෙනුවට, laminated copy එකක් තියාගෙන reuse කරනවා වගේ. Chunked prefill කියන්නේ bank queue එකේ එක කෙනෙක්ගේ cheques 300 එකපාර කරන්නේ නැතුව, 20 බැගින් කරලා අතරට අනිත් අයටත් සේවය දෙනවා වගේ. Disaggregated serving කියන්නේ hotel එකක ලොකු පිසීම (prefill) සහ serving (decode) වෙනම කණ්ඩායම් දෙකකට දෙනවා වගේ.',
      example: 'Static batching utilization: outputs 100, 100, 100, 1,000. Useful = 1,300 token-steps. Slot-steps = 4 × 1,000 = 4,000. 1,300 ÷ 4,000 = 32.5%. Paged waste: block size 16, sequence 1,000 tokens. 1,000 ÷ 16 = 62.5, ඉතින් blocks 63ක් = slots 1,008. Waste = 1,008 − 1,000 = 8 slots. Max-length pre-allocation එකකින් (උදා: 4,096 reserve කරලා 1,000ක් පාවිච්චි කළොත්) waste 3,096යි.',
      keyPoints: [
        'Continuous batching = iteration එකකට join/leave. Static utilization = useful ÷ (batch × longest).',
        'PagedAttention = non-contiguous fixed blocks + block table. Waste ≤ block එකක් per sequence.',
        'Copy-on-write = parallel samples/beams prompt blocks share කරනවා. Prefix caching = shared prefix KV reuse, TTFT අඩු.',
        'Blocks ඉවර = preempt (CPU swap හෝ recompute). Chunked prefill = දිග prompt කෑලි වලට.',
        'Attention batch වෙන්නේ නෑ (private KV). Disaggregated = prefill/decode pools වෙනම, KV transfer වියදම.',
      ],
      terms: [
        { en: 'Iteration-level Scheduling', si: 'හැම decode step එකකම batch එක යාවත්කාලීන කරන scheduling එක.' },
        { en: 'Block Table', si: 'Sequence එකේ logical KV blocks physical blocks වලට map කරන table එක.' },
        { en: 'Internal / External Fragmentation', si: 'Allocate කරපු ඉඩ ඇතුළේ හිස් (internal) සහ කැබලි වලට කැඩුණු නිදහස් ඉඩ (external).' },
        { en: 'Copy-on-Write', si: 'Share කරන block එකකට ලියනකොට විතරක් copy එකක් හදන එක.' },
        { en: 'Preemption (Swap / Recompute)', si: 'Memory ඉවර වුණාම requests තාවකාලිකව නවත්වලා පස්සේ resume කරන එක.' },
        { en: 'Disaggregated Serving', si: 'Prefill සහ decode වෙනම GPU pools වල run කරලා KV cache එක transfer කරන එක.' },
      ],
    },

    // 16
    {
      id: 'speculative-decoding-deep',
      title: 'Speculative Decoding: Acceptance Rule, Expected Speedup, Medusa & Prompt Lookup',
      examRefs: ['TOK-052', 'TOK-068', 'TOK-069', 'TOK-114', 'TOK-115', 'TOK-116', 'TOK-117'],
      body: [
        'අදහස: පොඩි, ඉක්මන් draft model එකක් tokens කිහිපයක් (γ) යෝජනා කරනවා. ලොකු target model එක ඒ ඔක්කොම එකම forward pass එකකින් verify කරනවා. Decode memory-bound නිසා tokens k ගණනක් verify කරන එක එක token එකක් generate කරනවා වගේම වියදම්. ඉතින් accept වුණ tokens ගොඩක් වෙලාවට නොමිලේ වගේ. (Answers කිහිපයකින් වැඩිපුර එකක් තෝරන එක self-consistency, ඒක prompting technique එකක්.)',
        'Acceptance rule (speculative sampling): draft distribution q, target distribution p. Draft කරපු token x එක accept කරන්නේ min(1, p(x)/q(x)) probability එකෙන්. Reject වුණොත් normalized max(0, p − q) distribution එකෙන් අලුත් token එකක් sample කරනවා. මේ modified rejection sampling එක නිසා අන්තිම token distribution එක හරියටම p. ඒ කියන්නේ output distribution එක target model එක තනියම sample කරනවා හා සමානයි. Lossless. Draft model එක බලපාන්නේ speed එකට විතරයි (acceptance rate එකෙන්), quality එකට නෑ. Argmax එකඟ වෙනවද කියලා බලන එක greedy-only variant එකක්, sampling behaviour එක ආරක්ෂා කරන්නේ නෑ.',
        'Expected tokens per verification: හැම draft token එකක්ම α probability එකකින් ස්වාධීනව accept වෙනවා නම්, verification pass එකකට සාමාන්‍ය tokens = (1 − α^(γ+1)) ÷ (1 − α). මේකෙන් accepted draft tokens සහ target model එක හැම වෙලේම දෙන එක token එක (correction හෝ bonus) ගණන් වෙනවා. Speedup නැත්නම් ප්‍රධාන හේතුව: draft proposals reject වෙන එක (acceptance rate අඩු). එතකොට verification එකකට ≈ token 1යි, draft cost එකත් ගෙවනවා. ලොකු batch sizes වලදීත් speedup අඩු වෙනවා, මොකද decode දැනටමත් compute-bound.',
        'Draft model නැති variants: Medusa = base model එකටම lightweight decoding heads කිහිපයක් එකතු කරනවා. ඒවා last hidden state එකෙන් t+2, t+3... positions වල tokens අනුමාන කරනවා. Candidates tree attention එකෙන් එක forward pass එකකින් verify කරනවා. (Layer skipping / early exit වෙනම ක්‍රමයක්.) Prompt lookup decoding = n-gram matching: අන්තිම n-gram එක prompt එකේ හොයලා, ඒකට පස්සේ තිබ්බ tokens draft ලෙස යෝජනා කරනවා. Output එක input එකෙන් දිග කොටස් copy කරන වැඩ වලට (code editing, document summarization, RAG answers) ගොඩක් හොඳයි. Creative writing වලට matches අඩුයි, acceptance අඩුයි.',
      ],
      analogy: 'Speculative decoding කියන්නේ junior lawyer කෙනෙක් ලියුමක ඊළඟ වාක්‍ය 4ක් draft කරනවා, senior lawyer එක පාරක් කියවලා "පළවෙනි 3 හරි, 4වෙනි එක මම වෙනස් කරනවා" කියනවා වගේ. Senior ට මුල ඉඳන් ලියනවට වඩා කියවන එක ඉක්මනයි. Senior ගේ අනුමැතිය නැතුව කිසිම වාක්‍යයක් යන්නේ නෑ, ඒ නිසා අන්තිම ලියුම senior ලිව්වා වගේමයි. Junior නිතරම වැරදි නම් (acceptance අඩු) කාලය ඉතුරු වෙන්නේ නෑ.',
      example: 'Expected tokens: γ = 4, α = 0.8. 0.8⁵ = 0.328. (1 − 0.328) ÷ (1 − 0.8) = 0.672 ÷ 0.2 ≈ 3.36 tokens per pass. (α × γ = 3.2 කියන එක bonus token එකත්, පළවෙනි reject එකෙන් නවතින එකත් අමතක කරලා.) α = 0.3 නම්: (1 − 0.3⁵) ÷ 0.7 ≈ 0.998 ÷ 0.7 ≈ 1.43 විතරයි, draft cost එකත් එක්ක ලාභයක් නැති තරම්. Acceptance: p(x) = 0.2, q(x) = 0.5 නම් accept probability = 0.2 ÷ 0.5 = 0.4. p(x) = 0.6, q(x) = 0.3 නම් min(1, 2) = 1, හැම වෙලේම accept.',
      code: {
        lang: 'python',
        src: `def expected_tokens(alpha, gamma):
    # accepted draft tokens + target එකේ bonus/correction token එක
    return (1 - alpha ** (gamma + 1)) / (1 - alpha)

print(round(expected_tokens(0.8, 4), 2))   # 3.36
print(round(expected_tokens(0.3, 4), 2))   # 1.43 -> speedup අඩුයි

def accept_prob(p_x, q_x):
    return min(1.0, p_x / q_x)
print(accept_prob(0.2, 0.5))               # 0.4`,
      },
      keyPoints: [
        'Draft proposes γ tokens, target verifies in one pass. Decode memory-bound නිසා verify ලාභයි.',
        'Accept = min(1, p/q). Reject = max(0, p − q) normalize කරලා resample. Output = හරියටම target distribution.',
        'E[tokens/pass] = (1 − α^(γ+1)) ÷ (1 − α). α = 0.8, γ = 4 → 3.36.',
        'Speedup නැත්නම් = acceptance අඩු, හෝ ලොකු batch (compute-bound).',
        'Medusa = extra heads + tree attention. Prompt lookup = n-gram copy, summarization/code edit වලට.',
      ],
      terms: [
        { en: 'Draft / Target Model', si: 'Tokens යෝජනා කරන පොඩි model එක සහ verify කරන ලොකු model එක.' },
        { en: 'Acceptance Rate (α)', si: 'Draft token එකක් accept වෙන probability එක.' },
        { en: 'Modified Rejection Sampling', si: 'min(1, p/q) accept rule + residual resampling. Lossless.' },
        { en: 'Medusa Heads', si: 'Base model එකේ future positions අනුමාන කරන අමතර decoding heads.' },
        { en: 'Tree Attention', si: 'Candidate branches ගොඩක් එක forward pass එකකින් verify කරන attention mask එක.' },
        { en: 'Prompt Lookup Decoding', si: 'Prompt එකේ n-gram matches වලින් draft tokens ගන්න draft-model-free ක්‍රමය.' },
      ],
    },

    // 17
    {
      id: 'quantization-deep',
      title: 'Quantization Deep Dive: Weight-only vs W8A8, AWQ, GPTQ, SmoothQuant, FP8, Calibration',
      examRefs: ['TOK-033', 'TOK-059', 'TOK-060', 'TOK-061', 'TOK-062', 'TOK-063', 'TOK-122', 'TOK-123', 'TOK-124', 'TOK-125', 'TOK-126'],
      body: [
        'Quantization කියන්නේ weights (සමහර විට activations ත්) අඩු precision අංක වලින් තියන එක. FP16 සිට INT8 = weight memory භාගයයි, INT4 = හතරෙන් එකයි, සාමාන්‍යයෙන් පොඩි accuracy අඩුවක් එක්ක. Layers අයින් කරන එක pruning/distillation, GPUs කිහිපයකට බෙදන එක model parallelism, ඒවා quantization නෙවෙයි.',
        'Weight-only INT4 (උදා: AWQ, GPTQ) model එකක matrix math එක තවමත් FP16. Weights dequantize කරනවා. එහෙනම් batch-1 decode වේගවත් ඇයි? Batch-1 decode memory-bandwidth bound. Token එකකට memory එකෙන් කියවන weight bytes 4 ගුණයකින් අඩුයි. Registers ඇතුළේ dequantize කරන එක memory traffic එකට සාපේක්ෂව ලාභයි. ඒත් ලොකු batch එකක (උදා: 256) workload එක compute-bound. එතකොට INT4 → FP16 dequantize overhead එකක්, ගණිතය වේගවත් නෑ. Native FP8 (W8A8) Tensor Core GEMMs ඊට වඩා ඉක්මනයි. W8A8 (weights සහ activations දෙකම 8-bit) වල ලොකු වාසිය compute-bound workloads වල: ලොකු batches සහ prefill, මොකද matrix multiplications INT8/FP8 Tensor Cores වලින් කරන්න පුළුවන්. Memory-bound batch-1 decode වලට weight-only එකෙන්ම වාසියෙන් වැඩි කොටස ලැබෙනවා.',
        'Activations quantize කරන එක අමාරු ඇයි? ලොකු transformers වල channels කිහිපයක systematic outlier values (ගොඩක් ලොකු අගයන්) තියෙනවා. Per-tensor INT8 එකක එක scale එකයි. ඒ scale එක outliers වලට ගැළපුණාම සාමාන්‍ය අගයන්ට quantization levels කිහිපයක් විතරයි. Accuracy වැටෙනවා. විසඳුම්: SmoothQuant, mixed-precision decomposition (LLM.int8()), finer-grained scales. SmoothQuant: activations per-channel factors වලින් බෙදලා, අනුරූප weights ඒ factors වලින් ගුණ කරනවා. ගණිතමය වශයෙන් සමාන transformation එකක් (output එක වෙනස් නෑ), ඒත් quantization අමාරුකම activations වලින් weights වලට migrate වෙනවා. දෙකම INT8 කරන්න ලේසියි. W8A8 enable වෙනවා. Pruning ක්‍රමයක් නෙවෙයි.',
        'AWQ (Activation-aware Weight Quantization): activations ලොකු channels වල weights වැදගත්ම (salient) ඒවා. ඒ පොඩි කොටස quantize කරන්න කලින් scale කරලා error එක අඩු කරනවා. Weight-only, සාමාන්‍යයෙන් INT4. GPTQ: post-training, layer by layer, පොඩි calibration set එකක් සහ approximate second-order (Hessian) තොරතුරු පාවිච්චි කරලා එක weight එකක් quantize කළාම ඒ error එක තවම quantize නොකරපු weights වල compensate කරනවා. Full retraining (QAT) ඕනේ නෑ. Group-wise scales: weights 128ක group එකකට FP16 scale එකක් (bits 16). Effective bits = 4 + 16/128 = 4.125. Groups 32 නම් accuracy හොඳයි, ඒත් 4 + 16/32 = 4.5 bits.',
        'FP8 formats දෙකක්: E4M3 (exponent bits 4, mantissa bits 3) = precision වැඩියි, range අඩුයි. Inference වල weights/activations (forward pass) වලට. E5M2 (exponent 5, mantissa 2) = range වැඩියි. Training වල gradients වලට. දෙකම floating-point. Static activation scales (INT8/FP8): scales කලින්ම fix කරනවා. ඒකට representative calibration dataset එකක් ඕනේ activation ranges මනින්න. Calibration data නියෝජනය නොකරන එකක් නම් clipping හෝ poor resolution. Dynamic quantization = runtime එකේ scales ගණනය කරනවා, පොඩි overhead එකක්.',
      ],
      analogy: 'Quantization කියන්නේ ඡායාරූපයක් JPEG එකක් කරනවා වගේ. File එක පොඩියි, පේන වෙනස පොඩියි. Outliers කියන්නේ Rs. සියයේ notes ගොඩක් එක්ක Rs. 5,000ක් එකක් තියෙන පසුම්බියක්. ඔක්කොම එකම "පෙට්ටියට" (scale) දාන්න ගියොත් Rs. 5,000 ට ගැළපෙන්න ලොකු පෙට්ටි ඕනේ, සියයේ notes වෙන් කරලා අඳුනගන්න අමාරුයි. SmoothQuant කියන්නේ ඒ බර කොටසක් අනිත් පසුම්බියට (weights) මාරු කරලා දෙකම සමතුලිත කරන එක. Calibration කියන්නේ ඇඳුම් මහන්න කලින් ඇත්ත මිනුම් ගන්න එක. වැරදි කෙනෙක්ගේ මිනුම් ගත්තොත් ඇඳුම ගැළපෙන්නේ නෑ.',
      example: 'Group-wise: INT4, group 128, FP16 scale (zero-point නෑ). 4 + 16 ÷ 128 = 4.125 bits per weight. 70B model = 70 × 10⁹ × 4.125 ÷ 8 ≈ 36 GB (plain 4-bit 35 GB ට වඩා ටිකක් වැඩියි). Outlier example: activations [0.5, −0.3, 0.8, 60]. Per-tensor INT8 scale = 60 ÷ 127 ≈ 0.47. ඉතින් 0.5 → 1, −0.3 → −1, 0.8 → 2. සාමාන්‍ය අගයන් සියල්ලම levels 2-3කට හිරවෙනවා. SmoothQuant: outlier channel එක 8න් බෙදලා (60 → 7.5), ඒ channel එකේ weights 8න් ගුණ කරනවා. දැන් scale ≈ 7.5 ÷ 127 ≈ 0.06. 0.5 → 8 levels, හොඳ resolution.',
      keyPoints: [
        'Weight-only INT4 = bandwidth ඉතුරු. Batch-1 decode වේගවත්. ලොකු batch එකේ dequant overhead.',
        'W8A8 / FP8 = compute-bound (ලොකු batch, prefill) වලට INT8/FP8 Tensor Core GEMMs.',
        'Activation outliers = per-tensor scale නරකයි. SmoothQuant = difficulty එක weights වලට migrate.',
        'AWQ = salient weights (activation magnitude) scale කරනවා. GPTQ = Hessian-based error compensation.',
        'Group scales: 4 + 16/group. E4M3 = inference, E5M2 = gradients. Static scales = calibration data.',
      ],
      terms: [
        { en: 'Weight-only Quantization', si: 'Weights විතරක් අඩු precision. Math එක FP16 වලින්, dequantize කරලා.' },
        { en: 'W8A8', si: 'Weights සහ activations දෙකම 8-bit. Matmul එකම INT8/FP8 වලින්.' },
        { en: 'SmoothQuant', si: 'Per-channel scaling එකකින් activation outlier අමාරුකම weights වලට මාරු කරන ක්‍රමය.' },
        { en: 'AWQ', si: 'Activation-aware weight quantization. වැදගත් channels ආරක්ෂා කරන weight-only INT4 ක්‍රමය.' },
        { en: 'GPTQ', si: 'Second-order තොරතුරු වලින් error compensate කරන layer-wise post-training quantization.' },
        { en: 'Group-wise Scales', si: 'Weights group එකකට (උදා: 128) වෙනම scale එකක්.' },
        { en: 'E4M3 / E5M2', si: 'FP8 formats දෙක. E4M3 precision, E5M2 range.' },
        { en: 'Calibration Dataset', si: 'Static scales හදන්න activation ranges මනින sample inputs.' },
      ],
    },

    // 18
    {
      id: 'long-context-rope-scaling',
      title: 'Long Context: RoPE Position Interpolation, NTK-aware Scaling, YaRN & Attention Sinks',
      examRefs: ['TOK-104', 'TOK-105', 'TOK-127', 'TOK-128', 'TOK-129'],
      body: [
        'RoPE (Rotary Position Embedding) එකේ position එක කියන්නේ query/key vectors කැරකෙන කෝණයක් (rotation angle). Dimensions වලට වෙනස් frequencies: සමහර ඒවා ඉක්මනට කැරකෙනවා (high-frequency, ළඟ tokens අතර වෙනස අල්ලගන්නවා), සමහර ඒවා හෙමින් (low-frequency, දුර සම්බන්ධතා). 4K contexts වලින් train කරපු RoPE model එකකට scaling නැතුව 8K prompt එකක් දුන්නොත්, trained range එකෙන් එහා positions වලට model එක කවදාවත් නොදැක්ක rotation angles එනවා. Attention out of distribution යනවා. Quality එක තියුණු ලෙස වැටෙනවා: incoherent text, perplexity blow-up.',
        'Linear position interpolation: 4K trained model එකට 16K ඕනේ නම් position indices 4 න් බෙදනවා. Positions 16K ඔක්කොම trained 0-4K range එකට map වෙනවා. කෝණ පුරුදු range එකේ තියෙනවා, සාමාන්‍යයෙන් කෙටි fine-tune එකක් කරනවා. Truncation නෙවෙයි (ඒකෙන් content නැති වෙනවා). අවුල: හැම frequency එකක්ම එක විදිහට compress වෙන නිසා ළඟ tokens අතර වෙනස blur වෙනවා.',
        'NTK-aware RoPE scaling: positions බෙදන්නේ නැතුව RoPE base frequency එක වැඩි කරනවා. Low-frequency dimensions stretch වෙනවා, high-frequency dimensions ගොඩක් දුරට එහෙමම. Local resolution ආරක්ෂා වෙනවා. Fine-tuning නැතුවත් සාධාරණ විදිහට වැඩ කරන්න පුළුවන්. YaRN: per-dimension ("by parts") interpolation (low-frequency dimensions interpolate, high-frequency ඒවා එහෙමම) + attention temperature adjustment (දිග range එකේදී entropy වෙනස් වීම compensate කරන්න attention logits rescale). පොඩි fine-tuning එකකින් extend කරන්න පුළුවන්. තවමත් RoPE ක්‍රමයක්, learned absolute embeddings වලට මාරු වෙන්නේ නෑ.',
        'Attention sinks (StreamingLLM): bounded KV cache එකකින් ඉතා දිග streams generate කරන්න. Models attention mass එකෙන් ලොකු කොටසක් මුල් tokens කිහිපයට "දානවා" (ඒවා වැදගත් නිසා නෙවෙයි, softmax එකට කොහේ හරි දාන්න ඕනේ නිසා). Pure sliding window එකකින් ඒ මුල් tokens evict කළොත් generation එක අස්ථාවර වෙනවා. ඉතින් පළවෙනි tokens කිහිපයේ KV (sinks) + අලුත්ම tokens වල sliding window එක තියාගන්නවා. Output එක fluent. මතක තියාගන්න: මේකෙන් model එකට මැද තිබ්බ පරණ තොරතුරු "මතක" වෙන්නේ නෑ, ඒවා cache එකෙන් අයින්.',
      ],
      analogy: 'RoPE කියන්නේ ඔරලෝසුවක කටු වගේ. තත්පර කටුව (high-frequency) ඉක්මනට කැරකෙනවා, පැය කටුව (low-frequency) හෙමින්. Model එක පැය 4ක් දක්වා ඔරලෝසුව කියවන්න ඉගෙන ගත්තා කියමු. පැය 16ක් පෙන්නන්න linear interpolation එකෙන් හැම කටුවක්ම 4 ගුණයක් හෙමින් කරනවා. තත්පර කියවන්න අමාරු වෙනවා. NTK/YaRN කියන්නේ පැය කටුව විතරක් හෙමින් කරලා තත්පර කටුව එහෙමම තියන එක. Attention sinks කියන්නේ දිග රැස්වීමක chairperson සහ අලුත්ම කතා කරපු අය විතරක් කාමරේ තියාගන්න එක. Chairperson එළියට දැම්මොත් රැස්වීම අවුල්.',
      example: 'Linear interpolation: trained 4,096, ඕනේ 16,384. Scale factor = 16,384 ÷ 4,096 = 4. Position 12,000 → 12,000 ÷ 4 = 3,000. ඒ trained range එක ඇතුළේ. Attention sinks: cache එකේ මුල් tokens 4 + අලුත්ම tokens 1,020 = slots 1,024 fixed. Tokens 100,000ක් generate කළත් KV memory එක වැඩි වෙන්නේ නෑ.',
      keyPoints: [
        'Trained range එකෙන් එහා RoPE positions = unseen angles = quality collapse.',
        'Linear PI = positions ÷ scale factor. හැම frequency එකම compress, local detail blur.',
        'NTK-aware = base frequency වැඩි කරනවා. High-frequency ආරක්ෂා වෙනවා.',
        'YaRN = by-parts interpolation + attention temperature. Little fine-tuning.',
        'StreamingLLM = sink tokens + recent window. Pure sliding window = කැඩෙනවා.',
      ],
      terms: [
        { en: 'RoPE', si: 'Position එක query/key rotation angles ලෙස encode කරන ක්‍රමය.' },
        { en: 'Position Interpolation', si: 'Position indices scale down කරලා trained range එකට ගේන context extension ක්‍රමය.' },
        { en: 'NTK-aware Scaling', si: 'RoPE base එක වැඩි කරලා low-frequency dimensions stretch කරන ක්‍රමය.' },
        { en: 'YaRN', si: 'By-parts interpolation + attention temperature එකක් එක්ක RoPE extension.' },
        { en: 'Attention Sink', si: 'Attention mass ගොඩක් එකතු වෙන මුල් tokens. Cache එකේ තියාගන්න ඕනේ.' },
        { en: 'Sliding Window KV', si: 'අලුත්ම tokens N ගණනක KV විතරක් තියාගන්න bounded cache එක.' },
      ],
    },

    // 19
    {
      id: 'run-llm-locally',
      title: 'Beyond the Exam: Running an LLM on Your Own Machine (Ollama, llama.cpp, GGUF)',
      examRefs: [],
      body: [
        'මේ phase එකේ ඉගෙන ගත්ත දේවල් ඔයාගේම laptop එකේ බලන්න පුළුවන්. llama.cpp කියන්නේ C/C++ වලින් ලියපු inference engine එකක්. CPU එකේත්, GPU (CUDA, Apple Metal වගේ) එකේත් run වෙනවා. ඒක පාවිච්චි කරන model file format එක GGUF. ඒ file එක ඇතුළේ quantized weights, tokenizer එක සහ chat template එක වගේ metadata තියෙනවා. Ollama කියන්නේ llama.cpp උඩ හදපු, model download කරන, run කරන, local API එකක් දෙන පහසු tool එකක්.',
        'Quantization එක තෝරන හැටි: GGUF files වල නම් Q8_0, Q6_K, Q5_K_M, Q4_K_M, Q3_K_M වගේ. අංකය = ආසන්න bits per weight. Q8_0 = original එකට ගොඩක් ළඟයි, file එක ලොකුයි. Q4_K_M = ගොඩක් දෙනෙක් default එක ලෙස ගන්න size/quality balance එක. Q3, Q2 = පොඩියි, ඒත් quality අඩුවීම පේන්න පුළුවන්. Group scales නිසා effective bits nominal අගයට වඩා ටිකක් වැඩියි (topic 17 මතක් කරන්න). නීතිය: ඔයාගේ memory එකට ගැළපෙන ලොකුම quantization එක, context එකට (KV cache) ඉඩකුත් ඉතුරු කරලා.',
        'Speed එක ඇස්තමේන්තු කරන්න topic 12 එකේ නීතියම: batch-1 decode tokens/s ≤ memory bandwidth ÷ model bytes. Laptop RAM එකේ bandwidth GPU HBM එකට වඩා ගොඩක් අඩු නිසා CPU එකේ decode හෙමින්. Prompt එක දිග නම් prefill (compute) එකත් CPU එකේ කාලයක් යනවා. GPU එකක් තියෙනවා නම් layers කිහිපයක් හෝ ඔක්කොම GPU එකට offload කරන්න පුළුවන් (llama.cpp වල -ngl). Context size (-c) එක වැඩි කළොත් KV cache memory එකත් වැඩි වෙනවා.',
      ],
      analogy: 'Cloud API එකක් කියන්නේ hotel එකකින් කෑම order කරනවා වගේ. ලේසියි, ඒත් හැම පිඟානකටම (token) ගෙවන්න ඕනේ, ඔයාගේ data එළියට යනවා. Local LLM එකක් කියන්නේ ගෙදර බත් උයනවා වගේ. මුලින් බඩු (GPU/RAM) ගන්න ඕනේ, ඊට පස්සේ නොමිලේ, ඔයාගේ data ගෙදරින් එළියට යන්නේ නෑ. Quantization තෝරන එක කියන්නේ ගෙදර බත් වට්ටියේ ප්‍රමාණය හාල් තියෙන ප්‍රමාණයට ගලපනවා වගේ.',
      example: '8B model එකක් 16 GB RAM laptop එකක. FP16 = 8 × 2 = 16 GB, OS එකටත් ඉඩ නැති නිසා බෑ. Q8_0 ≈ 8 × 1.06 ≈ 8.5 GB, හරි, ඒත් ටිකක් හිරයි. Q4_K_M ≈ bits 4.5-5ක් පමණ නිසා ≈ 5 GB පමණ, ආරක්ෂිතයි, context එකටත් ඉඩ තියෙනවා. Speed estimate: RAM bandwidth 50 GB/s කියමු. 50 ÷ 5 = උපරිම tokens 10ක් පමණ per second. Q8_0 (8.5 GB) නම් 50 ÷ 8.5 ≈ 6. ඉතින් quantization එකෙන් memory විතරක් නෙවෙයි, speed එකත් වෙනස් වෙනවා.',
      code: {
        lang: 'bash',
        src: `# Ollama: model එක download කරලා chat කරන්න
ollama pull llama3.1:8b
ollama run llama3.1:8b "කොත්තු හදන හැටි කෙටියෙන් කියන්න"

# Local API එක (OpenAI-style chat)
curl http://localhost:11434/api/chat -d '{"model":"llama3.1:8b",
  "messages":[{"role":"user","content":"Hello"}],"stream":false}'

# llama.cpp: GGUF file එක, context 4096, layers 99ක් GPU එකට
llama-cli -m model-Q4_K_M.gguf -c 4096 -ngl 99 -p "Hello"`,
      },
      keyPoints: [
        'llama.cpp = CPU/GPU inference engine. GGUF = quantized weights + tokenizer + template metadata.',
        'Ollama = llama.cpp උඩ ලේසි download/run/API tool එකක් (localhost:11434).',
        'Q8_0 ≈ ළඟම quality, Q4_K_M = හොඳ balance, Q3/Q2 = quality අඩුවීම.',
        'Local decode speed ≈ RAM/VRAM bandwidth ÷ model file size.',
        'Context size වැඩි = KV cache memory වැඩි. Memory එකට ඉඩ තියන්න.',
      ],
      terms: [
        { en: 'llama.cpp', si: 'Laptops/servers වල LLMs run කරන open-source C/C++ inference engine එක.' },
        { en: 'GGUF', si: 'llama.cpp model file format එක. Quantized weights සහ metadata එකම file එකක.' },
        { en: 'Ollama', si: 'Local models download කරලා run කරන්න සහ API එකක් දෙන්න පුළුවන් tool එක.' },
        { en: 'Q4_K_M / Q8_0', si: 'GGUF quantization types. අංකය ආසන්න bits per weight.' },
        { en: 'GPU Offload (-ngl)', si: 'Model layers කීයක් GPU එකට දානවද කියන llama.cpp setting එක.' },
      ],
    },

    // 20
    {
      id: 'reading-inference-benchmarks',
      title: 'Beyond the Exam: Reading (and Running) an Inference Benchmark Honestly',
      examRefs: ['DEP-074', 'DEP-106', 'DEP-147'],
      body: [
        '"අපේ server එක tokens/s 10,000යි!" කියන claim එකක් දැක්කාම මුලින්ම අහන්න ඕනේ ප්‍රශ්න: input length සහ output length කීයද? Concurrency (එකවර requests) කීයද? Precision එක මොකක්ද (FP16, FP8, INT4)? GPU එක මොකක්ද, කීයක්ද? Throughput එක ඉහළ concurrency එකකදී මැන්නොත් ලොකුයි, ඒත් එතකොට TTFT සහ TPOT නරකයි (topic 13). Prefill-heavy (දිග prompt, කෙටි output) සහ decode-heavy (කෙටි prompt, දිග output) workloads වල ප්‍රතිඵල ගොඩක් වෙනස්.',
        'හොඳ benchmark report එකක තියෙන්න ඕනේ: concurrency කිහිපයකදී TTFT සහ TPOT වල p50 සහ p99, ඒ එක්කම throughput. Latency vs throughput curve එකක් ලෙස පෙන්නුවොත් හොඳම. "Goodput" කියන්නේ SLO එක (උදා: TTFT < 1 s, TPOT < 50 ms) පනින්නේ නැතුව ලබාගන්න පුළුවන් throughput එක. Warm-up runs අයින් කරන්න (පළවෙනි requests වල compile/load කාලය). Apples-to-apples: එකම hardware, එකම precision, එකම prompts. NVIDIA GenAI-Perf, vLLM benchmark scripts වගේ tools මේකට තියෙනවා. nvidia-smi එකේ GPU-Util 100% කියන එකෙන් GPU එක සම්පූර්ණයෙන් පාවිච්චි වෙනවා කියලා හිතන්න එපා: ඒක කියන්නේ "කාලයෙන් කීයකදී අඩුම තරමේ එක kernel එකක් හරි run වුණාද" කියන එක. SM activity එක බලන්න Nsight හෝ DCGM.',
        'Realistic prompts set එකක් හදන්න Hugging Face Hub එකේ ලොකු dataset එකක් (උදා: 2 TB) පාවිච්චි කරනවා නම්, disk එක 500 GB නම් load_dataset(..., streaming=True) දාන්න. ඒකෙන් IterableDataset එකක් එනවා, records iterate කරද්දී on the fly කියවනවා, මුළු dataset එකම download කරන්නේ නෑ. keep_in_memory=True එකෙන් වෙන්නේ අනිත් පැත්ත.',
        'Sample size උගුල (canary): අලුත් model/server version එකක් traffic 1%කට විනාඩි 10ක් දීලා errors 0යි, baseline එකේ 0.2%යි, "ඉතින් promote කරමු" කියනවා. Requests සිය ගණනක් විතරක් නම්, ඇත්ත error rate එක baseline එකට සමාන වුණත් errors 0ක් දකින එක ගොඩක් සාමාන්‍යයි. ඉතින් canary එක දිගට හෝ වැඩි traffic එකකින් run කරලා, එකම කාල කවුළුවේ baseline එකත් එක්ක සංසන්දනය කරන්න (time-of-day effects cancel වෙන්න). Benchmarks වලටත් ඒකමයි: run එකක් දෙකක් නෙවෙයි, repeat කරලා variance එක බලන්න.',
      ],
      analogy: 'Benchmark claim එකක් කියන්නේ තුන් රෝද රථයක "km 40ක් ලීටරයට" කියන advertisement එක වගේ. පාර හිස්ව, එක්කෙනෙක් විතරක් ඉඳගෙන, බෑවුමේ මැන්නද? Colombo traffic එකේ මගීන් තුන් දෙනෙක් එක්ක ඇත්ත අගය වෙනස්. Canary එකේ errors 0 කියන එක, ක්‍රිකට් තරග දෙකක duck එකක් නැති කෙනා "හැමදාම runs ගහනවා" කියනවා වගේ. Sample එක ගොඩක් පොඩියි.',
      example: 'Canary ගණනය: 1% traffic, විනාඩි 10, requests 300ක් කියමු. Baseline error rate 0.2% නම් බලාපොරොත්තු වෙන errors = 300 × 0.002 = 0.6. ඉතින් errors 0ක් දකින එක ගොඩක් සාමාන්‍යයි (probability එක ආසන්න වශයෙන් e^−0.6 ≈ 0.55). "0 errors" එකෙන් අලුත් version එක හොඳයි කියලා ඔප්පු වෙන්නේ නෑ. Benchmark: System A = 5,000 tokens/s at concurrency 256, TTFT p99 8 s. System B = 3,500 tokens/s at concurrency 64, TTFT p99 0.6 s. Chat app එකකට (SLO TTFT < 1 s) B හොඳයි. රෑ batch job එකකට A හොඳයි.',
      code: {
        lang: 'python',
        src: `from datasets import load_dataset

# 2 TB dataset එක download නොකර stream කරනවා
ds = load_dataset("some-org/huge-corpus", split="train", streaming=True)
prompts = [ex["text"][:2000] for ex, _ in zip(ds, range(500))]

import math
expected = 300 * 0.002          # baseline එකට බලාපොරොත්තු errors
print(round(math.exp(-expected), 2))   # 0.55 = errors 0ක් දකින chance එක`,
      },
      keyPoints: [
        'Tokens/s claim එකක් = input/output lengths, concurrency, precision, hardware නැතුව තේරුමක් නෑ.',
        'TTFT/TPOT p50 සහ p99 + throughput, concurrency කිහිපයකදී. Goodput = SLO ඇතුළේ throughput.',
        'GPU-Util 100% ≠ GPU එක full. SM activity බලන්න.',
        'ලොකු HF dataset = load_dataset(..., streaming=True).',
        'පොඩි sample එකක errors 0 = ඔප්පුවක් නෙවෙයි. දිගට run කරලා එකම window එකේ baseline එක්ක සසඳන්න.',
      ],
      terms: [
        { en: 'Goodput', si: 'Latency SLOs පනින්නේ නැතුව ලබාගන්න පුළුවන් throughput එක.' },
        { en: 'p50 / p99', si: 'Requests වලින් 50% / 99% ට වඩා අඩු latency අගය.' },
        { en: 'GenAI-Perf', si: 'NVIDIA එකේ LLM serving benchmark tool එක (TTFT, ITL, throughput මනිනවා).' },
        { en: 'Streaming Dataset', si: 'Disk එකට download නොකර records iterate කරද්දී කියවන HF dataset mode එක.' },
        { en: 'Canary Analysis', si: 'අලුත් version එකට පොඩි traffic කොටසක් දීලා baseline එකත් එක්ක සංඛ්‍යානමය ලෙස සසඳන එක.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Logits [3, 1, 0] වලට softmax දැම්මාම පළවෙනි token එකේ probability එක ආසන්න වශයෙන් කීයද?',
      options: ['0.75', '0.84', '0.95', '0.60'],
      answer: 1,
      why: 'e³ ≈ 20.09, e¹ ≈ 2.72, e⁰ = 1. 20.09 ÷ 23.81 ≈ 0.84. 0.75 එන්නේ exponential එක අමතක කරලා 3 ÷ 4 කළොත්.',
    },
    {
      q: 'Sorted probabilities [0.60, 0.20, 0.10, 0.05, 0.05] සහ min_p = 0.25. Tokens කීයක් ඉතුරුද?',
      options: ['1', '2', '3', '5'],
      answer: 1,
      why: 'Min-p threshold එක relative: 0.25 × 0.60 = 0.15. 0.60 සහ 0.20 විතරක් ≥ 0.15.',
    },
    {
      q: 'Token එකක් 3 පාරක් ආවා. frequency_penalty 0.5, presence_penalty 0.6. Logit එක කොච්චර අඩු වෙනවද?',
      options: ['1.1', '1.5', '2.1', '3.3'],
      answer: 2,
      why: 'Frequency = 3 × 0.5 = 1.5. Presence = flat 0.6 (count එකෙන් ගුණ කරන්නේ නෑ). එකතුව 2.1.',
    },
    {
      q: 'Batch කරපු prompts එක්ක decoder-only model එකක කෙටි prompts වලට නරක completions එනවා. මොකක්ද ගොඩක් දුරට ඕනේ setting එක?',
      options: ['padding_side="left"', 'padding_side="right"', 'num_beams=4', 'skip_special_tokens=True'],
      answer: 0,
      why: 'Decoder-only models අලුත් tokens row එකේ අගට එකතු කරන නිසා padding වම් පැත්තට යන්න ඕනේ. Right padding නම් pad tokens වලට පස්සේ generate කරන්න වෙනවා.',
    },
    {
      q: 'Extraction service එකක 3%ක malformed JSON එනවා. Valid JSON guarantee කරන්නේ මොකෙන්ද?',
      options: ['Few-shot examples වැඩි කරන එක', 'Temperature වැඩි කරන එක', 'JSON-schema-constrained decoding', 'Beam search'],
      answer: 2,
      why: 'Constrained decoding එක හැම step එකකම grammar එක කඩන tokens mask කරන නිසා invalid syntax එක හදන්නම බෑ. අනිත් ඒවා chance එක විතරයි වෙනස් කරන්නේ.',
    },
    {
      q: 'Layers 32, hidden size 4,096, standard MHA, FP16 KV cache. Tokens 4,096ක sequence එකකට KV cache එක ආසන්න වශයෙන් කීයද?',
      options: ['1 GiB', '512 MiB', '4 GiB', '2 GiB'],
      answer: 3,
      why: 'Token එකකට 2 × 32 × 4,096 × 2 bytes = 0.5 MiB. × 4,096 = 2 GiB. K සහ V නිසා එන 2 අමතක කළොත් 1 GiB.',
    },
    {
      q: 'Weight-only INT4 model එකක් batch 1 එකේ FP16 ට වඩා ඉක්මන්, ඒත් batch 256 එකේ FP8 model එකට වඩා හෙමින්. හේතුව?',
      options: [
        'INT4 accuracy අඩු නිසා tokens වැඩිපුර generate වෙනවා',
        'ලොකු batch එක compute-bound. INT4 dequantize overhead එකක්, FP8 native Tensor Core math වේගවත්',
        'ලොකු batch එක memory-bound නිසා INT4 හෙමින්',
        'FP8 KV cache එකක් පාවිච්චි කරන්නේ නෑ',
      ],
      answer: 1,
      why: 'Weight-only quantization bandwidth ඉතුරු කරනවා, memory-bound batch-1 decode එකට හොඳයි. Compute-bound ලොකු batches වලදී native FP8 GEMMs දිනනවා.',
    },
    {
      q: 'Speculative decoding (standard rejection sampling) එකේ output distribution එක target model එක තනියම sample කරනවා එක්ක සසඳද්දී?',
      options: ['හරියටම සමානයි', 'Draft model එකේ distribution එකට ළං වෙනවා', 'Greedy වෙනවා', 'Temperature එක අඩු වෙනවා'],
      answer: 0,
      why: 'min(1, p/q) accept rule එක සහ max(0, p − q) resampling නිසා අන්තිම distribution එක හරියටම p. Draft model එක බලපාන්නේ speed එකට විතරයි.',
    },
    {
      q: 'Request එකකට output tokens 500, මුළු latency 10.5 s, TTFT 0.5 s. TPOT ආසන්න වශයෙන් කීයද?',
      options: ['21 ms', '20 ms', '10 ms', '40 ms'],
      answer: 1,
      why: 'TPOT = (10.5 − 0.5) ÷ (500 − 1) ≈ 20 ms. 10.5 ÷ 500 = 21 ms එකේ prefill කාලයත් ඇතුළත්.',
    },
    {
      q: '4K contexts වලින් train කරපු RoPE model එකකට 16K ඕනේ. Linear position interpolation කරන්නේ මොකක්ද?',
      options: [
        'Prompt එක 4K ට truncate කරනවා',
        'Learned absolute embeddings වලට මාරු කරනවා',
        'Attention sinks එකතු කරනවා',
        'Position indices 4 න් බෙදලා 16K positions trained 0-4K range එකට map කරනවා',
      ],
      answer: 3,
      why: 'Positions compress කරලා rotation angles පුරුදු range එකේ තියනවා, සාමාන්‍යයෙන් කෙටි fine-tune එකක් එක්ක. Truncation එකෙන් content නැති වෙනවා.',
    },
  ],
}
