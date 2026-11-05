export default {
  id: 'inference',
  number: 14,
  title: 'Tokenization, Decoding & Inference: Deep Dive',
  titleSi: 'How language models turn text into tokens and generate answers',
  summary: 'In Phases 5 and 9, you learned the basics of tokens, sampling, the KV cache, and batching. Here you will examine tokenizer edge cases; calculate temperature, top-p, min-p, and penalties; troubleshoot generation; enforce JSON structure; compare prefill with decode; estimate KV-cache memory; and explore speculative decoding, quantization, and long context. The goal is to reason through NCA-GENL tokenization and inference questions rather than memorize answers.',
  duration: '3-4 weeks',
  topics: [
    // 1
    {
      id: 'tokenizer-foundations',
      title: 'Tokenizer to Model: Token IDs, Subwords & Vocabulary Size',
      plain: 'A language model does not receive words directly. A tokenizer converts text into token IDs, and the model converts those IDs into vectors before processing them.',
      internGuide: ['Text is split into tokens, each token is looked up in a fixed vocabulary, and the vocabulary entry supplies an integer token ID.', 'The embedding table maps each token ID to a learned vector. The model processes vectors, not the original characters.', 'Subword tokens let a finite vocabulary represent common words efficiently while still spelling rare words from smaller pieces.', 'Exam focus: vocabulary size affects the embedding and output layers; token count is not the same as character count or word count.'],
      examRefs: ['TOK-001', 'TOK-002', 'TOK-003', 'TOK-009', 'TOK-010', 'TOK-087'],
      body: [
        'An LLM does not read raw text directly. A tokenizer splits text into tokens and assigns each token an integer ID from a fixed vocabulary, so the model receives a sequence such as [15496, 995]. The model then looks up a vector for each ID in its embedding layer. A sentence embedding is a model-produced representation, not the tokenized input.',
        'Word-level tokenization assigns one token to each word, but its vocabulary is fixed after training. A new product name may map to the same <unk> token as every other unknown word, so the model loses the word identity; the vocabulary does not grow on the fly, and this is not an error.',
        'Character-level tokenization uses one token per character. It avoids unknown characters with a small vocabulary, but makes sequences much longer, increasing compute (attention cost grows rapidly with sequence length) and filling the context window sooner. Its vocabulary is small, not millions of entries.',
        'Subword tokenization (BPE, WordPiece, or Unigram) is a middle ground: common words may be single tokens, while rare words are assembled from familiar pieces. It makes out-of-vocabulary problems uncommon with a manageable vocabulary. Do not assume it always uses fewer tokens than word-level tokenization; it can use more.',
        'Vocabulary size is a trade-off. A larger vocabulary can represent more text per token, shortening sequences and saving context and compute. However, the embedding matrix (vocabulary size × hidden size) and output projection grow, and rare tokens in an extremely large vocabulary may receive too little training.',
      ],
      analogy: 'Imagine paying at a shop. If you have only Rs. 5,000 notes (word-level), you cannot pay exactly Rs. 120 for a bun; an unfamiliar amount becomes <unk>. With only Rs. 1 coins (character-level), you can pay any amount, but counting 2,500 coins for a Rs. 2,500 bill slows the queue. A mix of notes and coins (subwords) can cover amounts flexibly and efficiently.',
      example: 'Consider "unbelievable". A word-level vocabulary without that word maps it to <unk>; character-level uses 12 character tokens; a subword tokenizer might use "un" + "believ" + "able" (3 tokens). For a vocabulary of 128,000 and hidden size 4,096, embedding parameters = 128,000 × 4,096 = 524,288,000 (about 524 million). If the output projection is not tied to the input embeddings, it adds another 524 million parameters.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer

tok = AutoTokenizer.from_pretrained("gpt2")
ids = tok("Hello world")["input_ids"]
print(ids)                        # [15496, 995] -> these IDs are the model input
print(tok.convert_ids_to_tokens(ids))  # ['Hello', 'Ġworld']
print(len(tok))                   # vocabulary size

# Embedding parameters = vocab x hidden
print(128_000 * 4_096)            # 524288000 (~524M)`,
      },
      keyPoints: [
        'A tokenizer gives the model a sequence of integer token IDs.',
        'Word-level maps unseen words to <unk>; character-level avoids unknowns but creates long sequences.',
        'Subwords keep common words whole and build rare ones from pieces, making OOV uncommon.',
        'A larger vocabulary shortens sequences but enlarges embedding and output layers.',
        'Embedding parameters = vocabulary size × hidden size.',
      ],
      terms: [
        { en: 'Token ID', si: 'The integer assigned to a token in the vocabulary.' },
        { en: 'Embedding Layer', si: 'A lookup table that maps each token ID to a vector (a vocabulary × hidden-size matrix).' },
        { en: 'Out-of-Vocabulary (OOV)', si: 'A word that is absent from the vocabulary; word-level tokenizers may map it to <unk>.' },
        { en: '<unk> Token', si: 'A shared token used for unknown items, which loses distinctions between them.' },
        { en: 'Tied Embeddings', si: 'Reusing the input embedding matrix for the output projection to save parameters.' },
      ],
      si: 'ඔයා token එකක් කියන්නේ text එකෙන් model එකට යන අංක ලේබලයක් කියලා හිතන්න. Colombo කඩේ Rs. 120 බනිස් එකකට Rs. 5,000 නෝට්ටුවක් විතරක් තිබ්බොත් හරියට ගෙවන්න අමාරුයි. Rs. 1 කාසි 120ක් ගණන් කරන්න පුළුවන්, ඒත් වෙලාව යනවා; නෝට්ටුයි කාසියි මිශ්‍ර කළාම ලේසියි. ඒ වගේ subword tokenizer එක පොදු වචන එකටත් දුර්ලභ වචන කෑලිවලටත් හසුරුවනවා.',
    },

    // 2
    {
      id: 'tokenizer-algorithms',
      title: 'Tokenizer Algorithms: BPE, WordPiece, Unigram, SentencePiece & Byte-level',
      plain: 'Tokenizer algorithms choose reusable pieces from training text. They differ in how the vocabulary is learned and how a new string is divided into tokens.',
      internGuide: ['BPE repeatedly merges frequent neighboring pieces. WordPiece chooses pieces using a likelihood-based objective and is associated with BERT-style tokenizers.', 'Unigram begins with many candidate pieces and removes pieces while preserving a useful probabilistic vocabulary.', 'SentencePiece learns directly from raw text and treats spaces explicitly; byte-level tokenization can represent any input without an unknown character.', 'Exam focus: the algorithm and the model vocabulary must match. A tokenizer cannot be swapped merely because both use the same vocabulary size.'],
      examRefs: ['TOK-004', 'TOK-005', 'TOK-006', 'TOK-007', 'TOK-008', 'TOK-088', 'TOK-089', 'TOK-143', 'TOK-144'],
      body: [
        'Byte Pair Encoding (BPE) is bottom-up: training starts with characters or bytes, repeatedly merges the most frequent adjacent pair in the corpus, and adds each merge to the vocabulary until reaching the target size. At inference, the learned merges are applied in their learned rank order.',
        'WordPiece (used by BERT) can split "playing" into "play" + "##ing"; ## marks a continuation of the same word and helps reconstruct word boundaries when decoding. Its inference algorithm greedily selects the longest vocabulary prefix, then repeats on the remainder using continuation pieces. If no piece matches, the whole word becomes [UNK].',
        'Unigram is top-down: it begins with a large candidate vocabulary, scores segmentations with a unigram language model, and prunes tokens whose removal least reduces corpus likelihood. Because it assigns probabilities to segmentations, training can sample different segmentations of the same text (subword regularization) to improve robustness. BPE has a related technique called BPE-dropout. Inference usually selects the most probable segmentation.',
        'SentencePiece is a framework, not one algorithm; it can run BPE or Unigram. It accepts a raw character stream and represents spaces with the ▁ symbol. It does not depend on whitespace-delimited words, so it also works for languages such as Japanese and Chinese, and detokenization can be lossless.',
        'Byte-level BPE (GPT-2) includes all 256 byte values as base symbols. Any UTF-8 string can therefore be encoded as bytes, avoiding the need for <unk> (including when a character is outside a Unicode-character vocabulary that could otherwise exceed 100,000 symbols). SentencePiece byte fallback, as used in some tokenizers, similarly splits an unseen emoji into UTF-8 byte tokens such as <0xF0>; without fallback it may become <unk>. A Hugging Face tokenizer pipeline can normalize text, pre-tokenize it, apply its model (such as BPE), and post-process it with special tokens such as [CLS] and [SEP].',
      ],
      analogy: 'BPE is like a kottu-shop waiter creating shorthand for frequent orders. They first write every letter, then combine letter pairs that appear together often into shorter symbols. Unigram works in the opposite direction: it starts with many candidate pieces and removes the least useful ones.',
      example: 'Suppose a corpus contains "low", "lower", and "lowest". Start with letters l, o, w, e, r, s, t. The pair l+o appears 3 times, so merge it as "lo"; then lo+w appears 3 times, producing "low". Thus "lower" can become "low" + "e" + "r". The 😀 emoji is four UTF-8 bytes (F0 9F 98 80), so byte fallback can represent it as <0xF0> <0x9F> <0x98> <0x80>. WordPiece might split "unhappiness" into "un", "##happi", and "##ness".',
      keyPoints: [
        'BPE is bottom-up: merge frequent adjacent pairs.',
        'In WordPiece, ## marks a continuation; inference uses greedy longest-match-first.',
        'Unigram prunes a large vocabulary top-down; subword regularization samples segmentations during training.',
        'SentencePiece handles raw streams, marks spaces as ▁, and can run BPE or Unigram.',
        'Byte-level BPE and byte fallback use 256 byte values to avoid <unk>; pipelines normalize, pre-tokenize, tokenize, then post-process.',
      ],
      terms: [
        { en: 'Merge Rules', si: 'BPE training rules that combine adjacent pairs, applied in learned rank order.' },
        { en: 'Greedy Longest-Match-First', si: 'WordPiece inference that chooses the longest matching vocabulary prefix first.' },
        { en: 'Subword Regularization / BPE-dropout', si: 'Training techniques that vary tokenization to improve robustness.' },
        { en: 'Byte Fallback', si: 'Representing an unseen character with UTF-8 byte tokens instead of <unk>.' },
        { en: 'Normalization / Pre-tokenization / Post-processing', si: 'Tokenizer pipeline stages; special tokens are added during final post-processing.' },
      ],
      si: 'ඔයාට BPE එක කොත්තු කඩේ නිතර එන order වලට කෙටි ලකුණු හදනවා වගේ හිතන්න පුළුවන්. "low", "lower", "lowest" තුනේම "lo" නැවත එන නිසා ඒ අකුරු දෙක එක token එකක් වෙන්න පුළුවන්. Unigram නම් ලකුණු ගොඩකින් පටන් අරන් වැඩක් අඩු ඒවා ඉවත් කරනවා. Sinhala emoji එකක් වුණත් bytes වලට කඩා නිරූපණය කරන්න byte fallback උදව් වෙනවා.',
    },

    // 3
    {
      id: 'tokenizer-quirks',
      title: 'Tokenizer Quirks: Spaces, Numbers, Glitch Tokens, Broken Bytes & Offsets',
      plain: 'Tokenization depends on exact text, including spaces and byte sequences. Small-looking text changes can therefore produce different tokens and model behavior.',
      internGuide: ['Many vocabularies encode a leading space as part of a token, so “word” and “ word” may use different IDs.', 'Numbers may split digit by digit or in variable groups. Never assume one number equals one token.', 'Byte fallback can preserve arbitrary input, but individual decoded token fragments may not be valid standalone Unicode text.', 'Exam focus: use offset mappings when aligning tokens to source text, and decode the whole sequence rather than treating every token fragment as a complete character string.'],
      examRefs: ['TOK-046', 'TOK-047', 'TOK-090', 'TOK-091', 'TOK-141', 'TOK-142', 'TOK-145'],
      body: [
        'Leading spaces: in GPT-style byte-level BPE, a space before a word is part of that word’s token (shown as Ġ in GPT-2). Therefore "Hello" at the start and " Hello" after another word can have different vocabulary entries and IDs. The tokenizer preserves the space rather than discarding it.',
        'Trailing-space pitfall: a completion prompt ending in "The capital of France is " may perform worse because the natural next token is " Paris", including its leading space. A bare space at the end creates a rare boundary where the model must emit a separate space token before "Paris". Remove the trailing space or use token healing, which revisits the final prompt token and constrains generation to continuations from that boundary.',
        'Numbers: ad-hoc BPE merges may split "12345" into "123" + "45" and "12346" differently, so token boundaries do not align with place value (ones, tens, hundreds), making arithmetic harder. Some tokenizers split digits individually or into fixed short chunks, giving numbers a more consistent representation that can help learn arithmetic patterns. This increases, rather than decreases, the number of tokens used for numbers.',
        'Glitch tokens are unusual tokens present in tokenizer training data but barely represented in the model’s training data (for example, a rare Reddit username). Their embeddings may be poorly trained and behave unpredictably when prompted. Common byte tokens are generally better represented in training.',
        'If "�" appears during streaming, a multi-byte UTF-8 character (such as an emoji, Chinese character, or Sinhala character) may have been split across tokens. Decoding each token separately can expose an incomplete invalid byte sequence. Buffer bytes and emit text only when a complete UTF-8 character is available (incremental detokenization). For NER displays, fast Rust-backed tokenizers can return (start, end) character spans via return_offsets_mapping=True; token_type_ids instead indicate sentence A or B.',
      ],
      analogy: 'A leading space is like the bus stop printed on a ticket: "Kandy" and " Kandy" can be distinct entries to the machine. A trailing space is like asking a conductor to write only half of the next stop name. A glitch token resembles a student listed in the class register who never attended, so the teacher has learned little about them.',
      example: 'An ad-hoc BPE tokenizer might split "2468 + 1357" as "246", "8", " +", " 13", "57", placing the ones digits 8 and 7 in different token positions. Digit splitting represents each digit consistently as "2", "4", "6", "8", and so on. With offsets, "Kamal lives in Kandy" can map the "Kandy" token to (15, 20), allowing those characters to be highlighted in the original string.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("gpt2")

print(tok("Hello")["input_ids"], tok(" Hello")["input_ids"])  # two distinct IDs

enc = tok("Kamal lives in Kandy", return_offsets_mapping=True)
for t, (s, e) in zip(enc.tokens(), enc["offset_mapping"]):
    print(t, s, e)   # original-text span for each token

# Do not end the prompt with a trailing space
prompt = "The capital of France is".rstrip()`,
      },
      keyPoints: [
        'A leading space can be part of a token: "Hello" and " Hello" may differ.',
        'Avoid trailing prompt spaces; token healing can repair the final token boundary.',
        'Digit splitting gives numbers consistent place-value-aligned pieces but uses more tokens.',
        'Glitch tokens are in the tokenizer vocabulary but have under-trained model embeddings.',
        'A streaming "�" can indicate an incomplete UTF-8 character; buffer bytes. Use return_offsets_mapping=True for spans.',
      ],
      terms: [
        { en: 'Ġ (GPT-2 space marker)', si: 'A marker showing that a byte-level BPE token begins with a space.' },
        { en: 'Token Healing', si: 'Revising the prompt’s final token boundary so generation can continue from a natural token.' },
        { en: 'Digit Splitting', si: 'Tokenizing numbers digit by digit or into fixed-size chunks.' },
        { en: 'Glitch Token', si: 'A vocabulary token with little model training data and potentially unpredictable behavior.' },
        { en: 'Incremental Detokenizer', si: 'A decoder that buffers bytes and streams text only after complete characters form.' },
        { en: 'Offset Mapping', si: 'The original-text (start, end) character positions associated with each token.' },
      ],
      si: 'ඔයා bus ticket එකක් හිතන්න: "Kandy" සහ " Kandy" අතර මුල තියෙන හිස්තැනත් වැදගත් වෙන්න පුළුවන්. Number එකක් "2468" කියලා එක කෑල්ලකට වඩා ඉලක්කම් වෙන් කරලා දැක්වුවොත් 8 සහ 7 වගේ ඒකක තැන්වල අගයන් සසඳන්න ලේසියි. Sinhala අකුරක් UTF-8 bytes කිහිපයකින් හැදෙන නිසා stream එකේ එක byte එකක් විතරක් ලැබුණොත් ඒක පෙන්වන්න කලින් ඉතිරි bytes එනකම් ඉන්න ඕනේ. ඔයාට text එකේ වචනයක් highlight කරන්න offsets පාවිච්චි කරන්නත් පුළුවන්.',
    },

    // 4
    {
      id: 'context-languages-billing',
      title: 'Context Window, Token Budgets, Languages (incl. Sinhala) & Billing',
      plain: 'The context window is the total token space available for instructions, conversation, retrieved text, tool results, and generated output. Every part competes for the same budget.',
      internGuide: ['A request must fit input tokens plus the maximum output allowance within the model or serving limit.', 'Token efficiency varies by language and tokenizer. Sinhala or code-mixed text may require more tokens than equivalent English text.', 'API billing commonly separates input, cached input, and output tokens, but the exact pricing rules belong to the provider and model.', 'Exam focus: a larger advertised context does not guarantee equal accuracy across the entire window. Count with the actual tokenizer and reserve output space.'],
      examRefs: ['TOK-011', 'TOK-014', 'TOK-025', 'TOK-045', 'TOK-049', 'TOK-084', 'TOK-085', 'TOK-086', 'TOK-102', 'TOK-106'],
      body: [
        'The context window is the total number of tokens the model can consider at once. Input (prompt) tokens and generated output tokens share this limit, so a longer prompt leaves less room for the answer. Concurrency (how many users are served at once) is a serving limit, not a model property.',
        'A rough rule for English with GPT-style tokenizers is 1 token ≈ 4 characters ≈ 0.75 English words; a 750-word document is about 1,000 tokens. This is only an estimate. For an exact fit, count with the target model’s tokenizer, including chat-template tokens; another tokenizer can give a substantially different count.',
        'Tokenizers learn merges from their training corpus. If it contains mostly English, languages such as Thai, Hindi, and Sinhala may be split into shorter pieces or bytes. The same meaning can then take several times as many tokens, increasing cost and latency while leaving room for less content. Translation does not happen automatically, and the window does not grow for different languages.',
        'Hosted LLM APIs charge by input and output token counts, usually at different rates; output often costs more. Input tokens also cost compute, so long prompts are billed too.',
        'The context window is a hard limit. If chat history exceeds it, an application or server may reject the request or truncate older tokens, losing content. Summarization is an application-level choice, not automatic. A useful strategy is to retain the system instructions and recent turns, then remove or summarize older turns; dropping the system prompt can silently change behavior. Doubling context length doubles KV-cache memory (linear growth) but makes full self-attention compute roughly four times as large (quadratic n² growth).',
      ],
      analogy: 'A context window is like a fixed number of pages in an A/L exam answer booklet. If the question (prompt) uses many pages, fewer remain for the answer (output). If Sinhala uses more tokens for the same meaning, it is like writing the same answer in larger letters: the pages fill sooner.',
      example: 'Output budget: with a context window of 8,192 and a 7,000-token prompt including the chat template, max_new_tokens can be at most 8,192 − 7,000 = 1,192. Requesting 2,048 risks overflow, an error, or truncation. Suppose Hindi uses 3 times as many tokens per word as English: a fixed budget that fits 3,000 English words fits about 3,000 ÷ 3 = 1,000 Hindi words, not 9,000. If Sinhala takes 4 times as many tokens in a particular tokenizer, the same space for 3,000 English words fits about 3,000 ÷ 4 = 750 Sinhala words; measure the actual ratio with that tokenizer. Billing can also be about 4 times higher for the same content.',
      code: {
        lang: 'python',
        src: `from transformers import AutoTokenizer
tok = AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")

msgs = [{"role": "user", "content": "What is the capital of Sri Lanka?"}]
ids = tok.apply_chat_template(msgs, add_generation_prompt=True)
n_prompt = len(ids)          # exact count including the template

window = 8192
max_new = window - n_prompt  # remaining space for the output
print(n_prompt, max_new)`,
      },
      keyPoints: [
        'The context window is a shared limit for input and output tokens.',
        'Rough English estimate: 1 token ≈ 4 characters ≈ 0.75 words; 750 words ≈ 1,000 tokens. Use the model tokenizer for an exact count.',
        'An English-heavy tokenizer may use more tokens for Sinhala, Thai, or Hindi, increasing cost and reducing available content.',
        'Billing includes input and output tokens. Overflow may be rejected or truncated; retain system instructions and recent turns.',
        'Doubling context doubles KV-cache memory and roughly quadruples full-attention compute.',
      ],
      terms: [
        { en: 'Context Window', si: 'The total number of input and output tokens the model can handle at once.' },
        { en: 'max_new_tokens', si: 'The maximum number of output tokens the model may generate.' },
        { en: 'Token Inflation', si: 'Using more tokens for the same meaning in a language less represented in tokenizer training.' },
        { en: 'Truncation', si: 'Removing part of an input that exceeds the window, which loses content.' },
        { en: 'History Summarization', si: 'An application-level method that replaces older chat turns with a shorter summary.' },
      ],
      si: 'ඔයා A/L answer book එකක පිටු ගණන සීමිතයි කියලා හිතන්න. ප්‍රශ්නයට පිටු 7,000ක් වගේ tokens වැය වුණොත්, 8,192 window එකක උත්තරයට ඉතුරු වෙන්නේ 8,192 − 7,000 = 1,192 tokens විතරයි. Sinhala tokenizer එකකින් එකම අදහසට tokens වැඩි වෙන්න පුළුවන් නිසා ඔයාගේ ඉඩ ඉක්මනින් ඉවර වෙයි. Colombo ඉඳන් Kandy යන ගමන වගේ, ඉතුරු ඉඩ හරියට මනින්න ඕනේ නම් model එකේම tokenizer එක පාවිච්චි කරන්න.',
    },

    // 5
    {
      id: 'special-tokens-chat-templates',
      title: 'Special Tokens, Attention Mask, Chat Templates & Tokenizer Mismatch',
      plain: 'Special tokens tell a model where sequences, roles, padding, or control regions begin and end. Chat templates place those tokens in the exact structure used during model training.',
      internGuide: ['BOS, EOS, PAD, and role markers have model-specific IDs and meanings. They are not universal across tokenizers.', 'An attention mask marks which positions contain usable input rather than padding; it is different from the causal mask that blocks future positions.', 'A chat template converts role/content messages into the serialized text and control tokens expected by the model.', 'Exam focus: using the wrong tokenizer or template can produce poor output even when tensor shapes are valid. Resize and train embeddings when genuinely adding new tokens.'],
      examRefs: ['TOK-012', 'TOK-013', 'TOK-041', 'TOK-042', 'TOK-043', 'TOK-044', 'TOK-082', 'TOK-083', 'TOK-150'],
      body: [
        'Special tokens are control signals rather than ordinary text: BOS marks a sequence start, EOS marks its end, and PAD fills unused positions. During generation, sampling EOS stops the decoder loop. PAD remains a distinct purpose even when a tokenizer reuses EOS as its padding token.',
        'When sequences in a batch have different lengths, padding makes them equal length. An attention_mask marks real tokens with 1 and padding with 0; this is unrelated to BERT’s masked-language-model [MASK]. tokenizer("Hello world", return_tensors="pt") returns a dict-like BatchEncoding containing input_ids and attention_mask PyTorch tensors, which can be passed to model(**enc). The model—not the tokenizer—produces embeddings and logits. tokenizer.decode(ids, skip_special_tokens=True) converts IDs back to text and hides markers such as <s>, </s>, and <pad>.',
        'Tokenizer mismatch: encoding text for Model X with Model Y’s tokenizer can produce gibberish because the model embedding table is indexed by its own tokenizer IDs. ID 1234 can represent a completely different text piece in another vocabulary. Always load the tokenizer from the model’s own checkpoint.',
        'Chat templates format conversations with the role markers and special tokens used to fine-tune an instruction model (for example, <|im_start|>user ... <|im_end|>). The model behaves best when inference uses the same layout. tokenizer.apply_chat_template(messages, add_generation_prompt=True) formats messages and adds the assistant-turn header; it formats text but does not call the model. A wrong template may make the model continue by inventing "User:" turns because it does not recognize where its turn ends.',
        'After tokenizer.add_special_tokens({"additional_special_tokens": ["<tool>"]}), an index error on input containing <tool> usually means model.resize_token_embeddings(len(tokenizer)) was missed. The new ID exceeds the old embedding table. Resizing adds untrained rows, so fine-tuning is needed to make the new token useful.',
      ],
      analogy: 'A chat template is like a government-office form: an officer trained to read "Name: ... Address: ... Request: ..." may be confused by an unstructured page. A tokenizer mismatch is like using Cargills shelf numbers to find products at Keells; shelf 12 may hold biscuits in one shop and soap in the other.',
      example: 'A batch contains "Hi" (2 tokens) and "How are you" (4 tokens). Padding makes both length 4; with left padding, attention_mask = [[0,0,1,1],[1,1,1,1]]. With a plain-text prompt "What is 2+2?", a wrong template might yield "4.\\nUser: What is 3+3?\\nAssistant: 6.\\nUser: ..." until max_new_tokens. With apply_chat_template, an end-of-turn token follows "4." and generation stops.',
      code: {
        lang: 'python',
        src: `msgs = [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "How far is Colombo from Kandy?"},
]
# This formats the text; it does not call the model.
text = tok.apply_chat_template(msgs, tokenize=False,
                               add_generation_prompt=True)

# Resize embeddings after adding a new special token.
tok.add_special_tokens({"additional_special_tokens": ["<tool>"]})
model.resize_token_embeddings(len(tok))`,
      },
      keyPoints: [
        'EOS stops generation; PAD marks padding, even if a tokenizer reuses EOS for that purpose.',
        'attention_mask: 1 means a real token, 0 means padding; it is not MLM masking.',
        'Load the tokenizer from the model checkpoint or token IDs may select the wrong embeddings.',
        'A mismatched chat template can cause invented "User:" turns; use apply_chat_template with add_generation_prompt=True.',
        'After adding tokens, resize with model.resize_token_embeddings(len(tokenizer)) and fine-tune.',
      ],
      terms: [
        { en: 'BOS / EOS / PAD', si: 'Special tokens marking sequence start, sequence end, and padding.' },
        { en: 'attention_mask', si: 'A tensor marking real tokens as 1 and padding positions as 0.' },
        { en: 'BatchEncoding', si: 'A dict-like Hugging Face tokenizer result containing fields such as input_ids and attention_mask.' },
        { en: 'skip_special_tokens', si: 'A decode option that hides markers such as BOS, EOS, and PAD.' },
        { en: 'Chat Template', si: 'The role-marker and special-token layout used to fine-tune a chat model.' },
        { en: 'add_generation_prompt', si: 'An option that appends the assistant-turn header to a chat template.' },
        { en: 'resize_token_embeddings', si: 'A method that expands embedding (and sometimes output) matrices after adding tokens.' },
      ],
      si: 'ඔයා bus එකකට නැග්ගාම නවත්තන signal එකක් වගේ EOS එක generation එක අවසන් කරනවා; PAD නම් batch එකේ හිස් තැන් පුරවන token එක. "Hi" දෙකයි "How are you" හතරයි කියලා හිතුවොත්, පළවෙනි එකට padding දාලා mask එකෙන් ඒ හිස් තැන් නොසලකා හරිනවා. Colombo කඩේ shelf අංක Keells එකේ හොයන්න බැරි වගේ, එක model එකේ tokenizer IDs තව model එකට ගැළපෙන්නේ නෑ. ඒ නිසා chat template එකත් හරියට භාවිතා කරන්න.',
    },

    // 6
    {
      id: 'logits-softmax-temperature-logprobs',
      title: 'Logits, Softmax, Temperature, Logprobs & Why Temperature 0 Can Still Vary',
      plain: 'At each generation step the model outputs one score, called a logit, for every vocabulary token. Decoding converts those scores into the next token.',
      internGuide: ['Softmax turns logits into probabilities by exponentiating and normalizing them. Adding the same constant to every logit does not change the probabilities.', 'Temperature divides logits before softmax: values below one sharpen the distribution and values above one flatten it.', 'A log probability is the natural log of a probability; sequence log probability is usually the sum of token log probabilities.', 'Exam focus: temperature zero normally requests greedy selection, but hardware kernels, ties, batching, or provider implementation can still prevent strict end-to-end reproducibility.'],
      examRefs: ['TOK-015', 'TOK-016', 'TOK-019', 'TOK-020', 'TOK-026', 'TOK-039', 'TOK-074', 'TOK-075', 'TOK-094', 'TOK-146'],
      body: [
        'A decoder-only LLM generates autoregressively: it examines the current tokens, predicts the next token, appends it, and repeats until EOS or a limit. At each step, the final linear layer gives every vocabulary token a raw score called a logit. Logits are not probabilities: they can be negative and do not sum to 1.',
        'Softmax turns logits into a probability distribution in two steps: exponentiate each logit (making values positive), then divide by their sum (so probabilities sum to 1). Choosing a token (argmax or sampling) and filtering candidates (top-k/top-p) are separate steps after softmax.',
        'Temperature is applied before softmax by dividing logits by T. T < 1 increases score differences and sharpens the distribution, favoring top tokens; T > 1 flattens it and gives lower-ranked tokens more chance. Temperature does not change attention, token IDs, or directly set output length.',
        'A logprob is the log of the probability assigned to a generated token. Since probability ≤ 1, logprob ≤ 0; values nearer 0 indicate greater confidence. An API may also return top alternatives. To recover the sequence probability, sum token logprobs and exponentiate; averaging gives a per-token measure, not the sequence probability.',
        'Even greedy decoding (temperature 0) can vary slightly on a busy server. Different batches can change kernels and floating-point reduction order, and floating-point addition is not perfectly associative ((a+b)+c may differ slightly from a+(b+c)). If two logits are nearly tied, that small difference can change argmax and send the rest of generation down another path. Tokenization itself remains deterministic.',
      ],
      analogy: 'Temperature is like a cricket selector’s knob for how much to favor star players. A low setting keeps choosing the favorites; a higher one gives newer players a chance. Logprobs are confidence scores. Near-tied scores such as 84.99 and 85.00 may swap after tiny rounding differences, changing who is selected.',
      example: 'Softmax for logits [3, 1, 0]: e³ ≈ 20.09, e¹ ≈ 2.72, e⁰ = 1; total ≈ 23.81, so the first probability is 20.09 ÷ 23.81 ≈ 0.84 (not 3 ÷ 4 = 0.75, which skips exponentiation). For logits [2, 0], T=1 gives about 0.88 for the first token. At T=2, logits become [1, 0] and the probability is e ÷ (e+1) = 2.72 ÷ 3.72 ≈ 0.73. For token logprobs −0.1, −0.2, −0.7: sum = −1.0 and e⁻¹ ≈ 0.37, the sequence probability.',
      code: {
        lang: 'python',
        src: `import numpy as np

def softmax(logits, T=1.0):
    z = np.array(logits) / T      # divide by temperature before softmax
    e = np.exp(z - z.max())       # subtract the maximum for numerical stability
    return e / e.sum()

print(softmax([3, 1, 0]).round(2))       # [0.84 0.11 0.04]
print(softmax([2, 0], T=2).round(2))     # [0.73 0.27]

logprobs = [-0.1, -0.2, -0.7]
print(np.exp(sum(logprobs)).round(2))    # 0.37 = sequence probability`,
      },
      keyPoints: [
        'Logits are raw vocabulary scores; softmax exponentiates and normalizes them into probabilities.',
        'Temperature divides logits before softmax: T < 1 sharpens; T > 1 flattens.',
        'Logprob ≤ 0; sequence probability = exp(sum of token logprobs).',
        'Temperature 0 can still vary with batch-dependent floating-point order and near-tied logits.',
      ],
      terms: [
        { en: 'Autoregressive Loop', si: 'Predict, append, and repeat until EOS or a generation limit.' },
        { en: 'Logits', si: 'Unnormalized raw scores produced before softmax.' },
        { en: 'Softmax', si: 'A function that exponentiates logits and divides by their sum to get probabilities.' },
        { en: 'Temperature', si: 'A value that divides logits before softmax.' },
        { en: 'Logprobs', si: 'Logarithms of token probabilities, useful as a confidence measure.' },
        { en: 'Floating-point Non-associativity', si: 'Small numerical differences caused by changing the order of floating-point additions.' },
      ],
      si: 'ඔයා cricket තේරීම් කමිටුවක් හිතන්න: අඩු temperature එකෙන් වැඩිම ලකුණු ගත්ත ක්‍රීඩකයාට වැඩි අවස්ථාවක් දෙනවා. Logits කියන්නේ ක්‍රීඩකයන්ගේ raw ලකුණු; softmax ඒවා probability බවට පත් කරනවා. [3, 1, 0] සඳහා e³ ≈ 20.09, e¹ ≈ 2.72, e⁰ = 1; එකතුව 23.81 නිසා පළවෙනි probability එක 20.09 ÷ 23.81 ≈ 0.84. ලකුණු 84.99 සහ 85.00 වගේ ළඟ වුණොත් rounding වෙනස්කම් නිසා තේරීමත් වෙනස් වෙන්න පුළුවන්.',
    },

    // 7
    {
      id: 'greedy-and-beam-search',
      title: 'Greedy & Beam Search in Depth: generate() Arguments, Length Penalty, Memory',
      plain: 'Greedy search keeps only the highest-scoring next token. Beam search keeps several partial sequences so an early locally best token does not decide the entire answer.',
      internGuide: ['Greedy decoding is fast and deterministic for fixed computations, but it can miss a better sequence whose first token was slightly less likely.', 'Beam search expands several candidates, adds their log probabilities, and keeps the best beam-width candidates after each step.', 'Length penalties adjust the preference for short sequences because raw summed log probabilities normally become more negative as sequences grow.', 'Exam focus: beam search increases compute and KV-cache memory and is most useful for constrained tasks such as translation, not usually open-ended chat.'],
      examRefs: ['TOK-017', 'TOK-018', 'TOK-048', 'TOK-070', 'TOK-109', 'TOK-110', 'TOK-133'],
      body: [
        'Greedy decoding takes the argmax (highest-probability token) at each step. It is fast and deterministic, but a locally good choice can lead to a weaker overall sequence. In Hugging Face, model.generate(**inputs, do_sample=False, num_beams=1) is greedy; use num_beams > 1 for beam search and do_sample=True for sampling.',
        'Beam search keeps the N best partial sequences (beams) by cumulative log-probability at each step. It expands each beam and keeps the best N again, so it can find higher-likelihood sequences than greedy decoding while remaining deterministic. With num_beams=4, num_return_sequences=2, do_sample=False, it returns the top 2 of the final 4 beams; num_return_sequences must not exceed num_beams.',
        'Because log-probabilities are negative, a longer sequence usually has a more negative sum. Without normalization, beam search therefore favors short answers. Hugging Face scores beams as the sum of log-probabilities divided by length raised to length_penalty. A value > 1.0 favors longer sequences; a value < 1.0 favors shorter ones.',
        'Beam search is less common for chatbots because likelihood maximization can produce bland, generic, or repetitive text. Running several beams multiplies compute. Without prefix sharing, beam width 4 can use about four times the KV memory of greedy decoding because each beam has its own sequence. Beam search remains useful for tasks with a narrow set of correct answers, such as translation.',
      ],
      analogy: 'Greedy decoding is like driving from Colombo to Galle by taking the best-looking road at every junction. Beam search sends four friends along four routes and keeps the four most promising journeys at each junction. It may find a better route, but costs roughly the fuel for four vehicles.',
      example: 'Length penalty: Beam A has 5 tokens and log-probability sum −5; Beam B has 10 tokens and sum −8. With no penalty (length_penalty=0), A wins because −5 > −8. With length_penalty=1, A = −5 ÷ 5 = −1.0 and B = −8 ÷ 10 = −0.8, so B wins. Increasing the exponent makes longer sequences less penalized.',
      keyPoints: [
        'do_sample=False with num_beams=1 is greedy; num_beams > 1 is beam search; do_sample=True samples.',
        'Beam search keeps the top N partial sequences by cumulative log-probability and is deterministic.',
        'length_penalty > 1 favors longer answers; < 1 favors shorter answers.',
        'Beam search can be generic and repetitive in chat, and compute/KV memory grow with beam count.',
      ],
      terms: [
        { en: 'Argmax', si: 'Choosing the token with the highest score.' },
        { en: 'Beam Width (num_beams)', si: 'The number of candidate sequences retained at each step.' },
        { en: 'num_return_sequences', si: 'The number of sequences returned; in beam search it cannot exceed num_beams.' },
        { en: 'length_penalty', si: 'The exponent used to divide a beam score by sequence length raised to that power.' },
      ],
      si: 'ඔයා Colombo සිට Galle යනකොට හැම හන්දියකම දැන් පේන හොඳම පාර තෝරන එක greedy වගේ. Beam search නම් යාළුවෝ 4 දෙනෙක් වෙනස් පාරවල්වල යවලා හොඳම ගමන් 4 දිගටම තියාගන්නවා. ඒක හොඳ උත්තරයක් හොයන්න පුළුවන්, නමුත් වාහන හතරක වියදමත් තියෙනවා. Length penalty එකෙන් කෙටි උත්තරවලටද දිග උත්තරවලටද වාසි දෙන්නේ කියලා වෙනස් කරන්න පුළුවන්.',
    },

    // 8
    {
      id: 'sampling-topk-topp-minp',
      title: 'Sampling Controls: Top-k, Top-p, Min-p and How They Combine with Temperature',
      plain: 'Sampling introduces controlled randomness. Temperature reshapes the distribution, while top-k, top-p, and min-p remove unlikely candidates before sampling.',
      internGuide: ['Top-k retains a fixed number of highest-probability tokens. Top-p retains the smallest sorted set whose cumulative probability reaches p.', 'Min-p keeps tokens whose probability is large enough relative to the most likely token, so the number retained adapts to confidence.', 'When controls are combined, temperature first changes probabilities and filtering then restricts the candidate set before random selection.', 'Exam focus: top-k controls count, top-p controls cumulative mass, and temperature controls sharpness. They solve related but different problems.'],
      examRefs: ['TOK-021', 'TOK-022', 'TOK-071', 'TOK-072', 'TOK-076', 'TOK-077', 'TOK-108', 'TOK-135', 'TOK-136'],
      body: [
        'Top-k (for example, k=40) keeps only the 40 highest-probability tokens, renormalizes their probabilities to sum to 1, and samples among them. It cuts the low-probability tail; it does not limit output length to 40 or create 40 responses.',
        'Top-p (nucleus), for example p=0.9, sorts tokens by probability and keeps the smallest set whose cumulative probability reaches or exceeds 0.9. Candidate count adapts at each step: a confident model needs few tokens, while an uncertain one needs more. A fixed k may retain junk in a confident step or remove useful choices in an uncertain step.',
        'Min-p (for example min_p=0.25) uses a relative threshold: remove tokens below the highest token probability multiplied by min_p. A confident distribution with a top probability of 0.9 has a higher cutoff than a flat distribution whose top probability is 0.2. Do not mistake 0.25 for an absolute probability cutoff.',
        'Many pipelines apply temperature before top-p. Raising temperature from 0.7 to 1.3 with top_p=0.9 fixed flattens the distribution, so more tokens are needed to reach 0.9 and the nucleus grows. High temperature combined with loose top-p can quickly produce incoherent text. With do_sample=True, top_k=1 leaves one token and behaves greedily. top_p=1.0 and temperature=1.0 leave the distribution unchanged, the opposite of greedy selection. For varied but coherent slogans, temperature=0.9 with top_p=0.9 is one possible setting; temperature=2 without truncation can be noisy. Greedy and beam decoding return the same output each time when inputs and execution are fixed.',
      ],
      analogy: 'Imagine choosing a birthday cake at Keells. Top-k says "choose only among the five highest-rated cakes", always five. Top-p keeps cakes until they account for 90% of popularity, so only one may remain if it dominates. Min-p removes cakes with fewer than one quarter of the votes of the most popular cake.',
      example: 'For sorted probabilities [0.50, 0.20, 0.15, 0.10, 0.05] and top_p=0.8, cumulative sums are 0.50, 0.70, 0.85; 0.70 is too small, so 3 tokens remain. For [0.60, 0.20, 0.10, 0.05, 0.05] with min_p=0.25, threshold = 0.25 × 0.60 = 0.15, leaving 0.60 and 0.20 (2 tokens), not 1 as an absolute cutoff would suggest. For top-k with k=2, renormalized probabilities are 0.60 ÷ 0.80 = 0.75 and 0.20 ÷ 0.80 = 0.25.',
      code: {
        lang: 'python',
        src: `import numpy as np
p = np.array([0.50, 0.20, 0.15, 0.10, 0.05])   # sorted probabilities

# Top-p: the smallest set with cumulative probability >= 0.8
cum = np.cumsum(p)
print(int(np.searchsorted(cum, 0.8) + 1))       # 3

# Min-p: remove values below the maximum probability times min_p
q = np.array([0.60, 0.20, 0.10, 0.05, 0.05])
print(int((q >= 0.25 * q.max()).sum()))         # 2`,
      },
      keyPoints: [
        'Top-k samples from the top k tokens after renormalizing their probabilities.',
        'Top-p keeps the smallest set reaching cumulative probability p; its size adapts to confidence.',
        'Min-p uses a relative threshold: min_p × highest probability, not an absolute cutoff.',
        'Higher temperature can enlarge the nucleus; do_sample=True with top_k=1 is greedy-like.',
        'Temperature 0.9 with top_p 0.9 is one possible creative-but-coherent setting.',
      ],
      terms: [
        { en: 'Top-k Sampling', si: 'Sampling among the k highest-probability tokens.' },
        { en: 'Nucleus (Top-p) Sampling', si: 'Sampling from the smallest set whose cumulative probability reaches p.' },
        { en: 'Min-p Sampling', si: 'Filtering with a threshold relative to the highest token probability.' },
        { en: 'Renormalization', si: 'Rescaling remaining probabilities after filtering so they sum to 1.' },
        { en: 'Long Tail', si: 'Many low-probability tokens whose combined mass can still be substantial.' },
      ],
      si: 'ඔයා Keells එකේ cake තෝරනවා කියලා හිතන්න. Top-k නම් ඉහළම 5 cakes අතරින් විතරයි; top-p නම් ජනප්‍රියත්වයේ 80% එකතු වෙනකම් cakes තියාගන්නවා. [0.50, 0.20, 0.15, 0.10, 0.05] වල 0.50 + 0.20 = 0.70, තව 0.15 එකතු කළාම 0.85; ඒ නිසා top-p 0.8 ට cakes 3ක් ඕනේ. Min-p 0.25 නම් වැඩිම probability 0.60 එකෙන් 0.15 threshold එක ලැබෙනවා.',
    },

    // 9
    {
      id: 'penalties-and-logit-bias',
      title: 'Repetition, Frequency & Presence Penalties, no_repeat_ngram, Logit Bias & Logits Processors',
      plain: 'Generation controls can change token scores before decoding to discourage repetition, encourage novelty, or require and ban particular token sequences.',
      internGuide: ['A presence penalty reacts to whether a token has appeared; a frequency penalty grows with how often it appeared.', 'A repetition penalty rescales scores for seen tokens, while no-repeat n-gram blocks any candidate that would recreate an existing n-gram.', 'Logit bias changes selected token scores directly. Because words may contain several tokens, banning one visible word can require handling multiple tokenizations.', 'Exam focus: these controls modify decoding, not model weights. Strong penalties can damage grammar or block legitimate repeated terms.'],
      examRefs: ['TOK-038', 'TOK-064', 'TOK-073', 'TOK-096', 'TOK-134', 'TOK-137', 'TOK-138'],
      body: [
        'A repetition penalty lowers scores for tokens already in the context, reducing loops such as "the the the" and repeated sentences. It adjusts scores; unlike a stop sequence, it does not end generation.',
        'For the CTRL-style Hugging Face repetition_penalty (>1), divide positive logits by the penalty and multiply negative logits by it. Dividing a negative value by a number above 1 moves it closer to zero, increasing it and making the token more likely; multiplying makes it more negative and correctly lowers it.',
        'OpenAI-style frequency and presence penalties work differently: frequency penalty grows with the token count and discourages verbatim repetition, while presence penalty is a flat amount if a token appeared at least once and encourages new topics. New logit = old logit − (count × frequency_penalty) − (presence_penalty if count > 0). Neither changes temperature.',
        'With no_repeat_ngram_size=3 in Hugging Face generate, a token that would complete a trigram already present in the output is hard-blocked, so no trigram repeats. This can prevent loops but can also block legitimate repeats such as names. Repetition penalty instead softly lowers scores.',
        'With an OpenAI-compatible API, logit_bias adds a fixed offset to selected token IDs before sampling; an offset such as −100 effectively bans a token, including its first occurrence. A presence penalty cannot do that because it only applies after a token has appeared. In Hugging Face, a custom LogitsProcessor can set scores[:, ids] = −inf, giving those tokens probability zero for greedy decoding or sampling. bad_words_ids and constrained decoding use the same kind of masking primitive.',
      ],
      analogy: 'A frequency penalty is like charging a friend Rs. 10 every time they say "machan": five uses cost Rs. 50. A presence penalty is like a one-time Rs. 30 charge if they say it at least once, no matter how often they repeat it. A −100 logit bias is a complete ban. For a negative logit, dividing by a value above 1 moves it closer to zero; multiplying makes it more negative and lowers its score.',
      example: 'A token appeared 3 times, frequency_penalty=0.5, presence_penalty=0.6: frequency part = 3 × 0.5 = 1.5; presence part = flat 0.6; total reduction = 2.1 (not 3.3, which incorrectly multiplies presence by count). With CTRL penalty 1.2, positive logit 3 becomes 3 ÷ 1.2 = 2.5. Negative logit −2 becomes −2 × 1.2 = −2.4; dividing it to −1.67 would increase it.',
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
    return logit / p if logit > 0 else logit * p   # lower the score on either side of zero

print(ctrl_penalty(3), ctrl_penalty(-2))   # 2.5 -2.4`,
      },
      keyPoints: [
        'Repetition penalty lowers scores of seen tokens; it does not stop generation.',
        'CTRL penalty: divide positive logits by p and multiply negative logits by p.',
        'Frequency penalty scales by count; presence penalty is flat after the first occurrence.',
        'no_repeat_ngram_size hard-blocks repeated n-grams such as trigrams.',
        'logit_bias −100 effectively bans a token; a logit of −inf gives probability 0.',
      ],
      terms: [
        { en: 'Repetition Penalty', si: 'A soft penalty that lowers logits for tokens already seen in the context.' },
        { en: 'Frequency Penalty', si: 'A logit reduction proportional to how many times a token appeared.' },
        { en: 'Presence Penalty', si: 'A fixed logit reduction when a token has appeared at least once.' },
        { en: 'no_repeat_ngram_size', si: 'A Hugging Face option that hard-blocks completion of an already seen n-gram.' },
        { en: 'logit_bias', si: 'An API parameter that adds a fixed offset to selected token logits.' },
        { en: 'LogitsProcessor', si: 'A Hugging Face hook that modifies scores at each generation step.' },
      ],
      si: 'ඔයා යාළුවෙක්ට "machan" කියන හැම වතාවකම Rs. 10 දඩයක් දෙනවා කියලා හිතන්න; 3 වතාවක් කිව්වොත් Rs. 30. Presence penalty එක නම් පළවෙනි වතාවට විතරක් Rs. 30ක්, ඊට පස්සේ තවත් වැඩි වෙන්නේ නෑ. Frequency penalty එක token එක නැවත නැවත එන එක අඩු කරනවා, stop කරන්නේ නෑ. Negative logit එකක් penalty එකෙන් බෙදුවොත් අඩුවෙනවා වෙනුවට වැඩි වෙන නිසා ඒක ගුණ කළ යුතුයි.',
    },

    // 10
    {
      id: 'generation-troubleshooting',
      title: 'Generation Troubleshooting: Truncation, Never Stopping, Empty Output, Echoed Prompts, Padding',
      plain: 'Bad generation is often caused by decoding configuration or input formatting rather than model quality. Diagnose the finish reason and tokens before changing the model.',
      internGuide: ['Output cut off with a length finish reason means the new-token limit was reached; input truncation means some prompt tokens were removed before generation.', 'Failure to stop often comes from a missing or incorrect EOS ID or chat template. Immediate EOS can produce an empty visible answer.', 'Decoder-only generation returns prompt plus continuation, so slice away the input token length when only the new answer is wanted.', 'Exam focus: left versus right padding and pad/eos IDs affect batched decoder-only models. Inspect tokenized inputs and finish reasons systematically.'],
      examRefs: ['TOK-023', 'TOK-024', 'TOK-078', 'TOK-079', 'TOK-080', 'TOK-081', 'TOK-095', 'TOK-111', 'TOK-112'],
      body: [
        'If an answer stops mid-sentence with API finish_reason="length", generation hit the output-token cap (max_new_tokens / max tokens), not EOS; raise the limit. A stop sequence usually ends at a clean boundary and reports finish_reason="stop".',
        'A stop sequence is a string that ends generation when encountered (for example, "\\nUser:"); the matched text is usually excluded from the response. If a completion endpoint gives the correct answer and then invents "\\nUser: ...", use "\\nUser:" as a stop sequence. Greedy decoding can still produce that invented turn if it is the most likely continuation.',
        'If generation never stops after supervised fine-tuning and requests always hit max_new_tokens, training targets may not end with EOS or EOS may have been masked from loss. The model learns to stop by predicting EOS at target endings; lowering temperature cannot create an EOS prediction it never learned. Conversely, if it emits EOS too early and returns an empty answer, min_new_tokens suppresses EOS until a minimum length. max_new_tokens is only an upper bound.',
        'If output echoes the prompt, decoder-only generate() returns prompt tokens plus new tokens. Slice out[0][inputs["input_ids"].shape[1]:] before decoding. skip_special_tokens removes markers such as EOS, not the prompt text.',
        'For batched decoder-only generation, use padding_side="left" because new tokens are appended at the end of each row. With right padding, a short prompt is followed by pad tokens and generation continues from them, harming completions; right padding is fine for encoder models and training. If a Llama-family tokenizer reports no padding token, set tokenizer.pad_token = tokenizer.eos_token. Pass the attention mask so pad positions are ignored; passing only input_ids can make pads attend as real tokens and harm padded outputs. This does not affect memory or determinism.',
      ],
      analogy: 'finish_reason="length" is like buying a bus ticket only to Kadawatha and being dropped before Kandy. EOS is reaching the destination and getting off. A model that never learned EOS is like a tuk-tuk that keeps driving until it runs out of fuel (the token cap). Left padding places empty queue spaces at the front so every row ends at the same position.',
      example: 'Batch ["Hi", "Tell me about Kandy"] with right padding becomes ["Hi <pad> <pad> <pad>", "Tell me about Kandy"], so the model continues after pads for the short row. Left padding gives ["<pad> <pad> <pad> Hi", "Tell me about Kandy"] and attention_mask [[0,0,0,1],[1,1,1,1]], leaving a real token at the end of each row. To remove an echoed prompt of 12 tokens, decode only out[0][12:].',
      code: {
        lang: 'python',
        src: `tok.padding_side = "left"                 # decoder-only batched generation
if tok.pad_token is None:
    tok.pad_token = tok.eos_token           # tokenizers without a separate pad token

inputs = tok(["Hi", "Tell me about Kandy"], return_tensors="pt", padding=True)
out = model.generate(**inputs,              # pass the attention mask too
                     max_new_tokens=200, min_new_tokens=5)

n = inputs["input_ids"].shape[1]
print(tok.decode(out[0][n:], skip_special_tokens=True))  # without the prompt`,
      },
      keyPoints: [
        'finish_reason="length" means the token cap was reached; "stop" means EOS or a stop sequence.',
        'For invented "User:" turns, set "\\nUser:" as a stop sequence.',
        'Never stops: check for EOS in fine-tuning targets. Empty answer: consider min_new_tokens.',
        'For prompt echo, decode out[0][prompt_len:] only.',
        'For decoder-only batches, use left padding, set a pad token if needed, and pass attention_mask.',
      ],
      terms: [
        { en: 'finish_reason', si: 'An API field explaining why generation ended, such as "stop" or "length".' },
        { en: 'Stop Sequence', si: 'A string that ends generation when the model emits it.' },
        { en: 'min_new_tokens', si: 'A parameter that suppresses EOS until a minimum number of tokens is generated.' },
        { en: 'padding_side', si: 'The side where padding is added; decoder-only generation typically uses "left".' },
        { en: 'pad_token', si: 'The token used for padding; some tokenizers use EOS when no separate pad token exists.' },
      ],
      si: 'ඔයා Kadawatha දක්වා විතරක් bus ticket ගත්තොත් Kandy යන්න කලින් බහින්න වෙනවා; finish_reason="length" කියන්නේ ඒ වගේ token limit එකට ළඟා වුණා කියන එක. EOS නම් ගමනාන්තයට ආවා කියලා model එක ඉගෙනගෙන නවතින signal එක. Batch එකේ "Hi" සහ "Tell me about Kandy" තියෙනකොට left padding කළාම දෙකේම අගට real token එක එනවා. Prompt එක output එකේ ආවොත් tokens 12ක prompt එකකට out[0][12:] විතරක් decode කරන්න.',
    },

    // 11
    {
      id: 'constrained-decoding-json',
      title: 'Constrained Decoding & Guaranteed JSON: Grammars, Token Boundaries, Side Effects',
      plain: 'Constrained decoding masks tokens that would violate a schema or grammar. It can guarantee valid structure, but it cannot guarantee that the values are true or sensible.',
      internGuide: ['At every step the decoder tracks the grammar state and permits only tokens that can still lead to a valid output.', 'Because tokens may contain several characters, the constraint engine must work with token boundaries rather than simply checking the final string.', 'JSON schema can enforce required fields, types, and allowed values; application validation must still check business rules and semantics.', 'Exam focus: constrained decoding improves syntactic reliability but can add latency, change probability choices, and still produce hallucinated content inside valid JSON.'],
      examRefs: ['TOK-092', 'TOK-093', 'TOK-139', 'TOK-140'],
      body: [
        'Suppose an extraction service returns malformed JSON in 3% of responses despite careful prompting. More examples, wider beams, or retries and repair may improve the odds but cannot guarantee valid syntax; higher temperature may make errors more likely. JSON-schema-constrained decoding (structured output) can enforce the syntax.',
        'A grammar (such as JSON Schema, a regular expression, or a context-free grammar) is represented as a state machine. At each generation step, the decoder tracks the current grammar state and masks logits for tokens that would violate the grammar by setting them to −∞. Only valid continuations can then be sampled.',
        'Why not check characters one by one? Tokens can contain several characters and cross grammar boundaries. For example, a token containing "}," may close a string or object and add a comma across multiple grammar steps. Libraries map grammar states to the vocabulary and precompute allowed tokens for each state. JSON grammars can be represented as automata.',
        'A side effect is that syntax can always be valid while content quality falls. If a schema conflicts with the model’s natural writing order or leaves no room for reasoning, it may force low-probability token choices and distort the distribution. A practical design is to include a reasoning field before the answer where appropriate and arrange fields naturally.',
      ],
      analogy: 'Constrained decoding is like a bank’s online form: you cannot type letters in an NIC field, and a date field lets you choose only from a calendar, so invalid formats cannot be submitted. But if the reason box allows only 10 characters, you cannot explain the real reason fully; that is the quality trade-off.',
      example: 'Schema: {"name": string, "city": string}. After the model has emitted {"name": "Kamal", the grammar state expects the end of the string/object or a comma. A token such as "Kandy" is not valid there and gets logit −∞. The next token must follow the schema; a precomputed table determines whether a multi-step token such as "}," is allowed.',
      keyPoints: [
        'Prompting, retries, and beams may help but do not guarantee syntax; constrained decoding can enforce it.',
        'Mechanism: track a grammar state and set invalid-token logits to −∞ at each step.',
        'Tokens can cross grammar boundaries, so allowed vocabulary tokens are precomputed per state.',
        'Risk: syntax is valid but content quality may be distorted.',
      ],
      terms: [
        { en: 'Constrained / Structured Decoding', si: 'Masking logits so only tokens allowed by a grammar or schema can be sampled.' },
        { en: 'JSON Schema', si: 'A specification of JSON object fields, types, and requirements.' },
        { en: 'Finite-State Machine / Automaton', si: 'A model that tracks the current grammar state and possible next states.' },
        { en: 'Logit Masking', si: 'Setting invalid-token logits to −∞ so their probability becomes zero.' },
      ],
      si: 'ඔයා බැංකුවේ online form එක පුරවනවා කියලා හිතන්න: NIC කොටුවට අකුරු නොව අංක විතරක් දාන්න පුළුවන්. JSON schema එකත් model එකට වලංගු හැඩතල විතරක් ලියන්න ඉඩ දෙනවා. Name එක ලියා ඉවර වුණාම ඊළඟට comma එකක් හෝ closing brace එකක් පමණක් එන්න පුළුවන්. හැබැයි reason කොටුව අකුරු 10කට සීමා කළොත් උත්තරේ හොඳට පැහැදිලි කරන්න අමාරුයි.',
    },

    // 12
    {
      id: 'prefill-decode-bottlenecks',
      title: 'Prefill vs Decode: Compute-bound vs Memory-bound, Arithmetic Intensity & FLOPs',
      plain: 'LLM inference has a prompt-processing stage called prefill and a token-by-token generation stage called decode. They stress hardware differently.',
      internGuide: ['Prefill processes many prompt positions in parallel and performs large matrix operations, so it is commonly compute-bound.', 'Decode handles one new position per active sequence and repeatedly reads large model weights and KV cache, so small-batch decode is commonly memory-bandwidth-bound.', 'Arithmetic intensity compares useful operations with bytes moved; batching can raise decode intensity by reusing one weight read across sequences.', 'Exam focus: optimize TTFT by examining queueing and prefill; optimize token cadence by examining decode, memory bandwidth, batching, and KV-cache behavior.'],
      examRefs: ['TOK-027', 'TOK-028', 'TOK-036', 'TOK-050', 'TOK-058', 'TOK-097', 'TOK-098', 'TOK-120'],
      body: [
        'Prefill sends all prompt tokens through the model in parallel in one forward pass, fills the KV cache, and produces logits for the first output token. Decode then generates tokens one at a time. A long prompt must be processed before the first token, so prefill (and queueing) mainly determines TTFT; decode speed determines the time between later tokens.',
        'Arithmetic intensity is the number of FLOPs performed per byte read from memory. GPUs have high compute capacity but comparatively limited memory bandwidth, so compute-bound work needs many FLOPs per byte. In batch-1 decode, each FP16 weight (2 bytes) is used for about one multiply-add (2 FLOPs): roughly 1 FLOP/byte. Tensor Cores are therefore often underused. Decode is memory-bandwidth-bound because each step reads weights and KV cache for relatively little arithmetic.',
        'Prefill can be compute-bound because hundreds or thousands of prompt tokens multiply by the same weight matrix together (matrix-matrix operations), doing many FLOPs for each weight read. Peak FLOPs matter. Decode handles one token per sequence at a time, so loading weights is a major cost.',
        'Servers batch requests so each weight read can serve many sequences during decode, increasing throughput and GPU utilization. Batching does not guarantee deterministic outputs or remove the need for a KV cache.',
        'Estimate the upper bound for batch-1 decode speed as tokens per second ≤ memory bandwidth ÷ weight bytes. Estimate prefill work as about 2 × parameters FLOPs per token per forward pass (the factor 2 counts multiply and add); this simplified estimate ignores attention.',
      ],
      analogy: 'Imagine a kottu shop. Prefill is preparing 50 orders at once on a large griddle: bring the ingredients (weights) once and cook many portions, so the cook’s speed (compute) is the limit. Decode is like fetching ingredients from the store for each single order; walking (memory bandwidth) takes more time. Batching brings ingredients for 32 orders in one trip.',
      example: 'Bandwidth estimate: a 7B FP16 model has 14 GB of weights; with 2 TB/s bandwidth, reading them for one token takes 14 ÷ 2,000 = 0.007 s = 7 ms, giving an upper bound near 1 ÷ 0.007 ≈ 140 tokens/s (real speed is lower). For a 1,000-token prompt, prefill FLOPs ≈ 2 × 7×10⁹ × 1,000 = 1.4×10¹³ = 14 TFLOPs (14 GFLOPs per token; omitting the factor 2 gives the wrong total). Arithmetic intensity is 2 FLOPs ÷ 2 bytes = 1 FLOP/byte.',
      code: {
        lang: 'python',
        src: `params = 7e9
weight_bytes = params * 2          # FP16 = bytes 2
bandwidth = 2e12                   # 2 TB/s

print(bandwidth / weight_bytes)    # ~143 tokens/s upper bound (batch 1)

prompt = 1000
print(2 * params * prompt / 1e12, "TFLOPs")   # 14.0 prefill

print(2 / 2, "FLOP/byte")          # batch-1 decode arithmetic intensity`,
      },
      keyPoints: [
        'Prefill processes prompt tokens in parallel, fills the KV cache, and largely determines TTFT; it can be compute-bound.',
        'Decode generates one token at a time and is often memory-bandwidth-bound by weight and KV reads.',
        'Batch-1 decode arithmetic intensity is about 1 FLOP/byte, far below the hundreds often needed to use GPU compute fully.',
        'Batching lets one weight read serve several sequences and improves throughput.',
        'Batch-1 tokens/s ≤ bandwidth ÷ weight bytes; prefill FLOPs ≈ 2 × parameters × tokens.',
      ],
      terms: [
        { en: 'Prefill', si: 'The stage that processes the prompt in a forward pass and builds the KV cache.' },
        { en: 'Decode', si: 'The stage that generates output one token at a time.' },
        { en: 'Arithmetic Intensity', si: 'The number of FLOPs performed for each byte read.' },
        { en: 'Memory-bound / Compute-bound', si: 'Whether the bottleneck is data-transfer speed or calculation speed.' },
        { en: 'GEMV vs GEMM', si: 'Matrix-vector work (often batch-1 decode) versus matrix-matrix work (often prefill or large batches).' },
        { en: 'Roofline', si: 'A simple model that compares arithmetic intensity with compute and bandwidth limits.' },
      ],
      si: 'ඔයා කොත්තු කඩේක orders 50ක් එකවර හදනවා කියලා හිතන්න; ඒක prefill වගේ, බඩු එක පාරක් ගෙනල්ලා ගොඩක් වැඩ කරනවා. Decode එකේදී token එකින් එක හදන නිසා හැම වතාවකම weights සහ KV cache මතකයෙන් කියවන්න වෙනවා. 7B FP16 model එකේ weights 14 GB නම් 2 TB/s bandwidth එකෙන් කියවන්න 14 ÷ 2,000 = 0.007 තත්පරයක්, ඒ නිසා සරල උපරිමය 1 ÷ 0.007 ≈ තත්පරයට tokens 140. Batching එකෙන් එකම බඩු ගෙන ඒමෙන් requests ගොඩකට වැඩ කරන්න පුළුවන්.',
    },

    // 13
    {
      id: 'latency-throughput-math',
      title: 'TTFT, TPOT, Throughput & End-to-End Latency: Worked Calculations',
      plain: 'Serving metrics describe different parts of the user experience. Never use one latency number when the first-token wait and later token speed matter separately.',
      internGuide: ['TTFT runs from request arrival to the first output token and includes queue time plus prompt processing.', 'TPOT is the average gap between output tokens after the first. Inter-token latency can also be reported token by token.', 'End-to-end latency is approximately TTFT plus the remaining output-token intervals; throughput counts total requests or tokens completed per second.', 'Exam focus: batching can improve aggregate throughput while worsening TTFT. Always check whether a benchmark reports per-user speed or total server throughput.'],
      examRefs: ['TOK-029', 'TOK-030', 'TOK-040', 'TOK-056', 'TOK-057', 'TOK-100', 'TOK-107', 'TOK-148'],
      body: [
        'TPOT (time per output token, or inter-token latency) is the average time between successive tokens after the first. It describes the decode pace a streaming user experiences. System throughput, the total tokens per second across all users, is a different metric.',
        'For interactive chat, watch TTFT and TPOT. For an offline batch job (such as overnight summarization), no one waits for one response, so maximize total throughput, often with larger batches, to reduce cost.',
        'Streaming does not make generation faster. Showing text as it is produced means the user waits mainly for TTFT, reducing perceived latency. It does not change accuracy or memory use.',
        'Increasing batch size can raise throughput because weight reads are shared across requests. But each step takes longer and users share GPU time, so per-request latency rises. Gains flatten when the GPU becomes compute-bound or KV memory is exhausted.',
        'Calculation rules: (1) Decode throughput = number of batch sequences ÷ step time (one token per sequence per step). (2) TPOT = (total latency − TTFT) ÷ (tokens − 1), because the first token is included in TTFT. (3) End-to-end ≈ prompt tokens ÷ prefill speed + output tokens ÷ decode speed. (4) Batch-job time = total output tokens ÷ aggregate throughput.',
      ],
      analogy: 'TTFT is the time from ordering kottu until the first plate arrives. TPOT is the time between later plates. Throughput is the total plates the shop serves per hour. Taking many orders at once (a large batch) raises plates per hour, but your own plate may take longer.',
      example: 'Throughput: batch 32 and a 25 ms decode step gives 32 ÷ 0.025 = 1,280 tokens/s (40 tokens/s is one user’s rate). TPOT: 500 tokens, total latency 10.5 s, TTFT 0.5 s; (10.5 − 0.5) ÷ 499 = 10.0 ÷ 499 ≈ 0.020 s = 20 ms. Dividing 10.5 by 500 gives a wrong 21 ms because it includes prefill. Batch job: 100 requests × 200 tokens = 20,000; 20,000 ÷ 2,000 tokens/s = 10 s. End-to-end: prefill 8,000 ÷ 10,000 = 0.8 s; decode 200 ÷ 50 = 4 s; total ≈ 4.8 s.',
      code: {
        lang: 'python',
        src: `print(32 / 0.025)                 # 1280 tokens/s (system throughput)
print((10.5 - 0.5) / (500 - 1))   # 0.02 s = TPOT 20 ms
print(100 * 200 / 2000)           # 10 s batch job

ttft = 8000 / 10_000              # 0.8 s prefill
print(ttft + 200 / 50)            # 4.8 s end-to-end`,
      },
      keyPoints: [
        'TPOT = (total latency − TTFT) ÷ (tokens − 1); throughput is aggregate tokens/s across users.',
        'Interactive chat emphasizes TTFT and TPOT; offline batches emphasize throughput.',
        'Streaming lowers perceived latency, not generation time.',
        'A larger batch can improve throughput while increasing per-request latency.',
        'End-to-end ≈ prompt ÷ prefill speed + output ÷ decode speed.',
      ],
      terms: [
        { en: 'TTFT', si: 'The time from sending a request until its first token arrives.' },
        { en: 'TPOT / ITL', si: 'The average time between tokens after the first token.' },
        { en: 'Throughput', si: 'The system’s aggregate tokens generated per second.' },
        { en: 'End-to-end Latency', si: 'The time from request start until its final token arrives.' },
        { en: 'Perceived Latency', si: 'The wait time a user experiences; streaming can reduce it.' },
      ],
      si: 'ඔයා කොත්තු කඩේක order කළාම පළවෙනි පිඟාන එනකම් ඉන්න කාලය TTFT වගේ. ඊළඟ පිඟන් අතර කාලය TPOT; පැයකට මුළු පිඟන් ගණන throughput. Batch එකට orders 32ක් තිබිලා එක decode step එක 25 ms නම් 32 ÷ 0.025 = තත්පරයට tokens 1,280ක්. Streaming එකෙන් පිඟාන කලින් හදන්නේ නෑ, ඒත් එන ගමන් පෙන්වන නිසා බලාගෙන ඉන්න හැඟීම අඩු වෙනවා.',
    },

    // 14
    {
      id: 'kv-cache-memory-math',
      title: 'GPU Memory Math: Weights, KV Cache, GQA, Max Concurrency, MoE',
      plain: 'Inference memory includes more than model weights. Accurate capacity planning also accounts for KV cache, activations, runtime workspaces, fragmentation, and safety margin.',
      internGuide: ['Raw weight bytes are approximately parameter count multiplied by bytes per stored weight, plus quantization scales and metadata.', 'KV-cache bytes per token are approximately two times layers times KV heads times head dimension times bytes per cache value.', 'GQA reduces KV heads while preserving more query heads, so it reduces cache size. Longer contexts and more concurrent sequences grow cache demand linearly.', 'Exam focus: MoE models may activate only some experts per token but usually must store all deployed expert weights. Do not use active-parameter count as total weight memory.'],
      examRefs: ['TOK-031', 'TOK-032', 'TOK-034', 'TOK-035', 'TOK-051', 'TOK-053', 'TOK-054', 'TOK-055', 'TOK-101', 'TOK-103', 'TOK-113', 'TOK-147', 'TOK-149'],
      body: [
        'The main inference GPU-memory consumers are weights and the KV cache; activation buffers are smaller. Optimizer states such as Adam moments are used for training, not inference. Weight memory = parameter count × bytes per parameter: FP32=4, FP16/BF16=2, INT8/FP8=1, and INT4=0.5.',
        'The KV cache stores prior tokens’ key and value tensors for every attention layer, so decode only needs to compute projections for the newest token. Inference has no gradients. KV-cache size grows linearly with sequence length and batch size; vocabulary size does not affect it.',
        'KV bytes per token = 2 (K and V) × layers × KV heads × head dimension × bytes per value. In standard MHA, KV heads × head dimension = hidden size. GQA uses fewer KV heads than query heads, and the cache is sized by KV heads: 32 query heads and 8 KV heads means one quarter of the cache, not one eighth. FP8 KV values use about half the memory of FP16 and are independent of weight quantization, usually with a small accuracy trade-off. This can support longer contexts or more concurrent requests.',
        'Mixture-of-Experts (MoE): for example, a model may have about 47B total parameters but activate about 13B per token. All 47B parameters must fit in memory because any expert may be routed to, while per-token compute is roughly like a dense 13B model. Large batches can send tokens to different experts, so memory traffic may approach that of the full model.',
      ],
      analogy: 'GPU memory is like a Colombo house plot. Weights are the permanent house; the KV cache is a temporary shelter for visitors. More requests and longer stays (tokens) require a larger shelter. GQA is like four visitors sharing one chair. MoE is like keeping eight specialist cooks at home even though only two cook each dish.',
      example: 'MHA KV: 32 layers, hidden size 4,096, FP16. Per token = 2 × 32 × 4,096 × 2 = 524,288 bytes = 0.5 MiB; 4,096 tokens need 2 GiB (omitting the K/V factor of 2 gives the wrong 1 GiB). GQA 70B: 80 layers, 8 KV heads, head dim 128, FP16. 2 × 80 × 8 × 128 × 2 = 327,680 bytes = 320 KiB/token; 8,192 tokens need 2.5 GiB. Full MHA with 64 KV heads needs 8× = 20 GiB. For 13B (40 layers, hidden 5,120), per token is 2 × 40 × 5,120 × 2 = 800 KiB; batch 16 × 4,096 = 65,536 tokens needs 50 GiB. With 26 GB weights, that exceeds an 80 GB GPU once overhead is included. Concurrency estimate: 80 GB GPU − 14 GB weights = 66 GB; at 0.5 MiB/token and 2,048 tokens/request, each request needs 1 GiB, so the ideal maximum is about 66 requests (fewer in practice due to overhead). A 70B model needs 140 GB in FP16, 70 GB in INT8/FP8, or 35 GB in INT4. On an 80 GB GPU with 30 GB reserved for KV, only INT4 leaves enough room.',
      code: {
        lang: 'python',
        src: `def kv_per_token(layers, kv_heads, head_dim, bytes_=2):
    return 2 * layers * kv_heads * head_dim * bytes_   # 2 = keys and values

GiB = 1024**3
print(kv_per_token(32, 32, 128) * 4096 / GiB)       # 2.0  (hidden 4096 MHA)
print(kv_per_token(80, 8, 128) * 8192 / GiB)        # 2.5  (70B GQA)
print(kv_per_token(40, 40, 128) * 16 * 4096 / GiB)  # 50.0 (13B, batch 16)

for name, b in [("FP16", 2), ("INT8", 1), ("INT4", 0.5)]:
    print(name, 70 * b, "GB weights, free:", 80 - 70 * b)`,
      },
      keyPoints: [
        'Inference memory is mainly weights plus KV cache (and smaller activations); optimizer states are absent.',
        'Approximate weight GB = parameters in billions × bytes: 7B FP16 ≈ 14 GB; 70B INT4 ≈ 35 GB.',
        'KV bytes/token = 2 × layers × KV heads × head dimension × bytes; it scales linearly with length and batch.',
        'GQA with 8 KV heads and 32 query heads uses one quarter of the comparable full KV cache; FP8 uses about half the FP16 cache.',
        'MoE stores total parameters but computes with active parameters per token.',
      ],
      terms: [
        { en: 'KV Cache', si: 'Keys and values from earlier tokens, stored per layer to avoid recomputing them during decode.' },
        { en: 'Grouped-Query Attention (GQA)', si: 'An attention design where groups of query heads share fewer KV heads.' },
        { en: 'KV Cache Quantization', si: 'Storing KV-cache values at lower precision, such as FP8 or INT8.' },
        { en: 'Max Concurrency', si: 'Memory remaining after weights divided by KV memory required per request.' },
        { en: 'MoE Total vs Active Parameters', si: 'All parameters must fit in memory, but only active parameters are used per token.' },
        { en: 'GiB vs GB', si: 'GiB = 1024³ bytes; GB = 10⁹ bytes. Keep units consistent in estimates.' },
      ],
      si: 'ඔයා Colombo ගෙයක ඉඩමක් හිතන්න: weights කියන්නේ ස්ථිර ගෙය, KV cache එක අමුත්තන්ට හදන තාවකාලික මඩුව. Requests 16ක් එක්ක tokens 4,096 බැගින් තියෙනවා නම් 13B උදාහරණයේ KV cache එක 50 GiB පමණ වෙනවා. GQA වල query heads 32ට KV heads 8 නම් cache එක සම්පූර්ණ MHA එකේ හතරෙන් එකක්. MoE model එකේ හැම expert කෙනෙක්ම memory එකේ තිබිය යුතුයි, ඒත් එක් token එකකට වැඩ කරන්නේ experts කිහිපයක් විතරයි.',
    },

    // 15
    {
      id: 'batching-paged-kv-scheduling',
      title: 'Serving Systems: Continuous Batching, PagedAttention, Prefix Caching, Preemption, Chunked Prefill, Disaggregation',
      plain: 'A serving scheduler tries to keep GPUs busy while protecting interactive requests from long prompts and memory pressure. Each mechanism addresses a different source of waste.',
      internGuide: ['Continuous batching removes finished sequences and admits new ones between decode steps instead of waiting for a fixed batch.', 'Paged KV management allocates cache blocks on demand, reducing fragmentation; prefix caching reuses cache blocks for an identical shared prefix.', 'Chunked prefill breaks long prompts into smaller pieces so decode work can be interleaved. Preemption pauses or recomputes work when resources are exhausted.', 'Exam focus: prefill/decode disaggregation uses different worker pools for their different hardware behavior, but adds transfer and scheduling complexity.'],
      examRefs: ['TOK-037', 'TOK-065', 'TOK-066', 'TOK-067', 'TOK-099', 'TOK-118', 'TOK-119', 'TOK-121', 'TOK-130', 'TOK-131', 'TOK-132'],
      body: [
        'In static batching, the batch stays fixed, and slots remain idle after short sequences finish while the longest sequence continues. Continuous (in-flight) batching schedules at each iteration: a finished sequence frees its slot for a waiting request, so short requests need not wait for long ones to finish.',
        'Before PagedAttention (vLLM), systems often reserved contiguous memory up to each request’s maximum length because output length was unknown, wasting space through internal and external fragmentation. PagedAttention stores the KV cache in fixed-size blocks, like operating-system virtual-memory pages. Blocks need not be contiguous; a block table maps them and allocates them as needed. Waste is at most one block per sequence, fitting more requests. This is separate from compression such as KV quantization.',
        'Copy-on-write and prefix sharing: if four parallel samples use the same prompt, their block tables can point to the same physical prompt blocks with reference counts. A block is copied only when a sample writes to it, usually at the partially filled block where paths diverge. Beam search can benefit too. Prefix caching keeps and reuses KV entries for a repeated 2,000-token system prompt, so prefill handles only new user tokens and TTFT can fall.',
        'When blocks run out as sequences grow, schedulers such as vLLM can preempt sequences, swap blocks to CPU memory, or discard them and recompute later by prefilling the prompt and generated tokens. They resume rather than truncate output. Chunked prefill breaks a 30,000-token prompt into pieces; processing it in one step would block other users’ decode iterations, while chunks between decode steps bound each step’s work and let other streams continue.',
        'Why is attention not fully batch-shared? Weights are common across sequences, so batching shares each weight read, but each sequence has its own KV cache. KV reads are therefore not shared, and memory traffic grows with batch × context. Large-batch, long-context decode can become KV-bandwidth-bound. Disaggregated serving uses separate GPU pools for prefill (compute bottleneck) and decode (memory bottleneck). This prevents prefill bursts from increasing decode latency and lets each pool tune parallelism and batch sizes for TTFT and TPOT targets. The cost is transferring the KV cache between pools and keeping full weights in both.',
      ],
      analogy: 'Paged KV is like a library that gives you small boxes as needed instead of reserving a whole shelf for every book; an index card (block table) finds each box. Prefix caching is like reusing a laminated menu instead of reading the same menu to every customer. Chunked prefill serves a bank customer’s 300 cheques in groups of 20, serving others between groups. Disaggregated serving gives large-scale cooking (prefill) and serving (decode) to separate hotel teams.',
      example: 'Static batching with output lengths 100, 100, 100, 1,000 has 1,300 useful token-steps out of 4 × 1,000 = 4,000 slot-steps: 1,300 ÷ 4,000 = 32.5% utilization. With block size 16 and a 1,000-token sequence, 1,000 ÷ 16 = 62.5, so 63 blocks = 1,008 slots; waste = 1,008 − 1,000 = 8 slots. Reserving 4,096 slots in advance and using 1,000 wastes 3,096.',
      keyPoints: [
        'Continuous batching lets requests join or leave at each iteration; static utilization = useful work ÷ (batch × longest sequence).',
        'PagedAttention uses non-contiguous fixed blocks and a block table; waste is at most one block per sequence.',
        'Copy-on-write shares prompt blocks across samples/beams; prefix caching reuses prefix KV and lowers TTFT.',
        'When blocks run out, preempt by swapping or recomputing; chunked prefill divides long prompts.',
        'KV is private per sequence. Disaggregated serving separates prefill/decode pools but must transfer KV.',
      ],
      terms: [
        { en: 'Iteration-level Scheduling', si: 'Scheduling that updates the batch at each decode step.' },
        { en: 'Block Table', si: 'A table mapping a sequence’s logical KV blocks to physical memory blocks.' },
        { en: 'Internal / External Fragmentation', si: 'Unused space inside an allocation (internal) or fragmented free space between allocations (external).' },
        { en: 'Copy-on-Write', si: 'Creating a copy only when writing to a block that was being shared.' },
        { en: 'Preemption (Swap / Recompute)', si: 'Temporarily pausing requests when memory is exhausted so they can later resume.' },
        { en: 'Disaggregated Serving', si: 'Running prefill and decode in separate GPU pools and transferring KV cache between them.' },
      ],
      si: 'ඔයා library එකක පොත් තියාගන්නවා කියලා හිතන්න: හැම පොතකටම ලොකු රාක්කයක් කලින් වෙන් කරනවා වෙනුවට, අවශ්‍ය වෙද්දී කුඩා පෙට්ටි දෙන එක PagedAttention වගේ. Block table එකෙන් පෙට්ටි හොයාගන්න පුළුවන්. එකම 2,000-token system prompt එක නැවත එන requests වල KV cache reuse කළොත් prefill වැඩ අඩු වෙනවා. දිග 30,000-token prompt එක කෑලිවලට දාද්දී අනෙක් users ලාගේ decode එකත් අතරමැද කරගෙන යන්න පුළුවන්.',
    },

    // 16
    {
      id: 'speculative-decoding-deep',
      title: 'Speculative Decoding: Acceptance Rule, Expected Speedup, Medusa & Prompt Lookup',
      plain: 'Speculative decoding asks a cheaper method to propose several tokens and lets the target model verify them together. Correct algorithms preserve the target model distribution.',
      internGuide: ['A small draft model proposes tokens; the target model scores the proposed positions in parallel and accepts a prefix according to the verification rule.', 'Speedup depends on high acceptance, cheap drafting, and reduced target-model steps. A weak draft can cost more than ordinary decoding.', 'Medusa-style methods add proposal heads, while prompt lookup proposes repeated n-grams from the existing prompt without a separate draft model.', 'Exam focus: speculative decoding reduces latency, not target-model quality. It differs from simply returning unverified small-model output.'],
      examRefs: ['TOK-052', 'TOK-068', 'TOK-069', 'TOK-114', 'TOK-115', 'TOK-116', 'TOK-117'],
      body: [
        'A small, fast draft model proposes several tokens (γ); the larger target model verifies them in one forward pass. Because decode is memory-bound, verifying k tokens can cost about as much as generating one token, so accepted tokens can be nearly free. Choosing the most common answer among several generations is self-consistency, a separate prompting technique.',
        'In speculative sampling, let q be the draft distribution and p the target distribution. Accept a proposed token x with probability min(1, p(x)/q(x)). If rejected, sample a replacement from the normalized max(0, p − q) distribution. This modified rejection-sampling rule preserves the exact target distribution p, so output quality is lossless; the draft affects speed through acceptance rate only. Checking only whether argmax choices agree is a greedy-only variant and does not preserve sampling behavior.',
        'If each draft token is independently accepted with probability α, expected tokens per verification pass = (1 − α^(γ+1)) ÷ (1 − α). This counts accepted draft tokens plus the one target token always produced (correction or bonus). Low acceptance means few tokens per verification and draft overhead can erase speed gains. Large batches can also reduce the benefit because decode may already be compute-bound.',
        'Draft-free variants include Medusa, which adds lightweight decoding heads to the base model to predict positions t+2, t+3, and so on from the last hidden state, then verifies a candidate tree in one forward pass. (Layer skipping/early exit is different.) Prompt lookup decoding uses n-gram matching: find the last n-gram in the prompt and propose the tokens that followed it. It suits tasks that copy long spans from input, such as code editing, document summarization, and RAG answers; creative writing has fewer matches and lower acceptance.',
      ],
      analogy: 'Speculative decoding is like a junior lawyer drafting the next four sentences of a letter; a senior lawyer reviews them once and says, "The first three are right; I will change the fourth." Reviewing is faster than writing every sentence from scratch. Nothing is sent without the senior’s approval, so the final letter keeps the senior’s distribution; if the junior is often wrong, little time is saved.',
      example: 'Expected tokens: γ=4, α=0.8. 0.8⁵=0.328; (1−0.328) ÷ (1−0.8)=0.672 ÷ 0.2≈3.36 tokens per pass. The shortcut α×γ=3.2 misses the bonus token and early rejection behavior. If α=0.3, (1−0.3⁵) ÷ 0.7≈0.998 ÷ 0.7≈1.43, barely enough to offset draft cost. For p(x)=0.2 and q(x)=0.5, acceptance probability is 0.2 ÷ 0.5=0.4. If p(x)=0.6 and q(x)=0.3, min(1,2)=1, so it is always accepted.',
      code: {
        lang: 'python',
        src: `def expected_tokens(alpha, gamma):
    # accepted draft tokens plus the target model's bonus/correction token
    return (1 - alpha ** (gamma + 1)) / (1 - alpha)

print(round(expected_tokens(0.8, 4), 2))   # 3.36
print(round(expected_tokens(0.3, 4), 2))   # 1.43 -> little speedup

def accept_prob(p_x, q_x):
    return min(1.0, p_x / q_x)
print(accept_prob(0.2, 0.5))               # 0.4`,
      },
      keyPoints: [
        'The draft proposes γ tokens and the target verifies them in one pass; this can help when decode is memory-bound.',
        'Accept with min(1, p/q); on rejection, resample from normalized max(0, p−q). This preserves the target distribution.',
        'E[tokens/pass] = (1 − α^(γ+1)) ÷ (1 − α); α=0.8, γ=4 gives 3.36.',
        'Speedup may disappear when acceptance is low or large batches make decode compute-bound.',
        'Medusa adds heads and tree attention; prompt lookup copies n-gram continuations for tasks such as summarization or code edits.',
      ],
      terms: [
        { en: 'Draft / Target Model', si: 'The smaller model that proposes tokens and the larger model that verifies them.' },
        { en: 'Acceptance Rate (α)', si: 'The probability that a proposed draft token is accepted.' },
        { en: 'Modified Rejection Sampling', si: 'The min(1, p/q) acceptance rule plus residual resampling that preserves the target distribution.' },
        { en: 'Medusa Heads', si: 'Additional decoding heads that predict future positions from the base model.' },
        { en: 'Tree Attention', si: 'An attention mask that verifies multiple candidate branches in one forward pass.' },
        { en: 'Prompt Lookup Decoding', si: 'A draft-model-free method that proposes tokens from n-gram matches in the prompt.' },
      ],
      si: 'ඔයා junior lawyer කෙනෙක් ලියුමක ඊළඟ වාක්‍ය 4ක් ලියනවා කියලා හිතන්න; senior lawyer එකවර කියවලා 3ක් පිළිගෙන 4වැනි එක හදනවා. Model එකත් draft tokens කිහිපයක් යෝජනා කරලා target model එකෙන් එක pass එකකදී verify කරනවා. γ=4, α=0.8 නම් (1−0.8⁵) ÷ (1−0.8) = (1−0.328) ÷ 0.2 = 3.36 tokens පමණ pass එකකට ලැබෙනවා. Draft එක නිතර වැරදුණොත් කාලය ඉතුරු වෙන්නේ අඩුයි, නමුත් අවසාන output distribution එක target model එකේමයි.',
    },

    // 17
    {
      id: 'quantization-deep',
      title: 'Quantization Deep Dive: Weight-only vs W8A8, AWQ, GPTQ, SmoothQuant, FP8, Calibration',
      plain: 'Quantization stores or computes model values with fewer bits. The best method depends on whether the workload is limited by weight bandwidth, activation compute, memory capacity, or accuracy requirements.',
      internGuide: ['Weight-only quantization compresses weights while activations use a wider format; it is often useful for memory-bound, small-batch decode.', 'W8A8 quantizes both weights and activations and can accelerate suitable matrix kernels, but activation outliers make calibration harder.', 'GPTQ is a post-training weight method, AWQ protects important weight channels using activation information, and SmoothQuant shifts activation difficulty into weights.', 'Exam focus: lower bit width does not guarantee faster execution. Hardware kernels, calibration data, group size, scales, and workload shape determine the result.'],
      examRefs: ['TOK-033', 'TOK-059', 'TOK-060', 'TOK-061', 'TOK-062', 'TOK-063', 'TOK-122', 'TOK-123', 'TOK-124', 'TOK-125', 'TOK-126'],
      body: [
        'Quantization stores weights (and sometimes activations) at lower precision. Moving from FP16 to INT8 halves weight memory; INT4 uses one quarter, usually with some accuracy trade-off. Removing layers is pruning/distillation and splitting a model across GPUs is model parallelism; neither is quantization.',
        'With weight-only INT4 (such as AWQ or GPTQ), matrix math may still use FP16 after dequantizing weights. Why can batch-1 decode speed up? It is memory-bandwidth-bound, and reads four times fewer weight bytes per token; dequantizing in registers can cost less than the saved memory traffic. A large batch (for example 256) may be compute-bound, where INT4-to-FP16 dequantization adds overhead without speeding up math. Native FP8 W8A8 Tensor Core GEMMs can be faster. W8A8 quantizes both weights and activations to 8 bits and helps compute-bound large batches and prefill; weight-only quantization already captures much of the benefit in memory-bound batch-1 decode.',
        'Activation quantization is difficult because some channels in large transformers have systematic outliers. A single per-tensor INT8 scale that covers outliers leaves ordinary values only a few quantization levels, hurting accuracy. Options include SmoothQuant, mixed-precision decomposition (LLM.int8()), and finer-grained scales. SmoothQuant divides activations by per-channel factors and multiplies corresponding weights by those factors. This mathematically equivalent transformation keeps the output unchanged while moving quantization difficulty from activations to weights, making W8A8 easier; it is not pruning.',
        'AWQ (Activation-aware Weight Quantization) scales a small set of salient weights in channels with large activations before quantization to reduce error; it is usually weight-only INT4. GPTQ is post-training, layer-by-layer quantization that uses a small calibration set and approximate second-order (Hessian) information to compensate for a quantized weight’s error in weights not yet quantized; full retraining (QAT) is not required. Group-wise scales add overhead: one FP16 scale (16 bits) for every group of 128 weights gives 4 + 16/128 = 4.125 effective bits per weight; groups of 32 give 4 + 16/32 = 4.5 bits and can improve accuracy.',
        'Two FP8 formats are E4M3 (4 exponent bits, 3 mantissa bits), which has more precision but less range and is used for inference weights/activations, and E5M2 (5 exponent bits, 2 mantissa bits), which has more range and is used for training gradients. Both are floating point. Static INT8/FP8 activation scales are fixed in advance using a representative calibration dataset to measure ranges; unrepresentative data can cause clipping or poor resolution. Dynamic quantization calculates scales at runtime with some overhead.',
      ],
      analogy: 'Quantization is like saving a photo as JPEG: the file shrinks while visible differences may stay small. Outliers are like a wallet with many Rs. 100 notes and one Rs. 5,000 note. One scale that fits the Rs. 5,000 value uses large steps and makes the Rs. 100 notes hard to distinguish. SmoothQuant moves some of the difficulty to weights so both are easier to represent. Calibration is like taking accurate measurements before tailoring; wrong measurements make clothes fit badly.',
      example: 'Group-wise INT4 with a group of 128 and one FP16 scale (no zero-point): 4 + 16 ÷ 128 = 4.125 bits/weight. For 70B parameters, 70 × 10⁹ × 4.125 ÷ 8 ≈ 36 GB, slightly above plain 4-bit 35 GB. Outlier example: activations [0.5, −0.3, 0.8, 60]. Per-tensor INT8 scale = 60 ÷ 127 ≈ 0.47, so 0.5→1, −0.3→−1, 0.8→2; ordinary values occupy only 2–3 levels. SmoothQuant divides the outlier channel by 8 (60→7.5) and multiplies its weights by 8. The new scale is about 7.5 ÷ 127 ≈ 0.06, and 0.5 occupies about 8 levels for better resolution.',
      keyPoints: [
        'Weight-only INT4 saves bandwidth and can speed batch-1 decode; large batches may pay dequantization overhead.',
        'W8A8/FP8 can benefit compute-bound large batches and prefill with INT8/FP8 Tensor Core GEMMs.',
        'Activation outliers make one per-tensor scale ineffective; SmoothQuant moves some difficulty to weights.',
        'AWQ protects salient weights using activation magnitudes; GPTQ uses Hessian-informed error compensation.',
        'Group scales add 16/group bits; E4M3 suits inference, E5M2 gradients, and static scales need calibration data.',
      ],
      terms: [
        { en: 'Weight-only Quantization', si: 'Only weights are stored at lower precision; calculations may use FP16 after dequantization.' },
        { en: 'W8A8', si: 'Both weights and activations use 8-bit values for INT8/FP8 matrix multiplication.' },
        { en: 'SmoothQuant', si: 'A per-channel scaling method that moves activation-outlier difficulty to weights.' },
        { en: 'AWQ', si: 'Activation-aware weight-only quantization that protects salient channels, often at INT4.' },
        { en: 'GPTQ', si: 'Layer-wise post-training quantization that compensates errors using second-order information.' },
        { en: 'Group-wise Scales', si: 'A separate scale for each group of weights, such as a group of 128.' },
        { en: 'E4M3 / E5M2', si: 'FP8 formats: E4M3 offers more precision; E5M2 offers more range.' },
        { en: 'Calibration Dataset', si: 'Sample inputs used to measure activation ranges for static scales.' },
      ],
      si: 'ඔයා JPEG photo එකක් හිතන්න: file එක පොඩි වෙනවා, පේන වෙනස සමහරවිට ටිකයි. Quantization එකත් weights අඩු bits වලින් තියා memory ඉතුරු කරනවා; FP16 වලින් INT8 කළොත් weight memory භාගයක්. Rs. 100 නෝට්ටු ගොඩක් අතර Rs. 5,000 නෝට්ටුවක් තිබුණොත් එකම scale එකෙන් මනිද්දී පොඩි අගයන් හරියට වෙන් කරන්න අමාරුයි. SmoothQuant ඒ අපහසුවෙන් කොටසක් weights පැත්තට මාරු කරනවා. Calibration data හරියට තෝරන්න, නැත්නම් මිනුම වැරදෙන්න පුළුවන්.',
    },

    // 18
    {
      id: 'long-context-rope-scaling',
      title: 'Long Context: RoPE Position Interpolation, NTK-aware Scaling, YaRN & Attention Sinks',
      plain: 'A model trained for one context length does not automatically use a much longer window well. RoPE extension methods change position frequencies and normally require evaluation or fine-tuning.',
      internGuide: ['RoPE represents relative position by rotating query and key dimensions with different frequencies.', 'Position interpolation compresses longer position indices into the range seen during training; extrapolation methods modify frequency scaling to support longer distances.', 'YaRN combines frequency-dependent scaling with attention adjustments. Attention sinks preserve early tokens that stabilize attention in streaming-style use.', 'Exam focus: extending the technical limit does not prove useful recall or reasoning at that length. Test the actual long-context task and short-context regressions.'],
      examRefs: ['TOK-104', 'TOK-105', 'TOK-127', 'TOK-128', 'TOK-129'],
      body: [
        'In RoPE (Rotary Position Embedding), a position is encoded as a rotation angle for query/key vectors. Dimensions use different frequencies: high frequencies capture nearby-token differences, while low frequencies represent longer-range relations. A RoPE model trained on 4K context that receives an unscaled 8K prompt sees unseen rotation angles beyond its training range, pushing attention out of distribution and potentially harming quality with incoherent text or sharply higher perplexity.',
        'With linear position interpolation, a model trained at 4K and extended to 16K divides position indices by 4, mapping the 16K positions into the trained 0–4K range. This is not truncation, which loses content, and may use a short fine-tune. The drawback is that every frequency is compressed equally, blurring distinctions between nearby tokens.',
        'NTK-aware RoPE scaling increases the RoPE base frequency rather than dividing positions. It stretches low-frequency dimensions while largely preserving high frequencies and local resolution; it may work reasonably without fine-tuning. YaRN combines per-dimension ("by parts") interpolation (interpolating low-frequency dimensions while leaving high-frequency ones largely unchanged) with an attention-temperature adjustment that rescales attention logits to compensate for entropy changes at longer ranges. It can extend context with a small fine-tune and remains a RoPE method, not a switch to learned absolute embeddings.',
        'Attention sinks (StreamingLLM) support very long generation with a bounded KV cache. Models often assign substantial attention mass to the first few tokens—not necessarily because they are meaningful, but because softmax needs somewhere to place it. Evicting those tokens with a pure sliding window can destabilize generation. Keep the first few tokens’ KV (the sinks) plus a sliding window of recent tokens. Output can remain fluent, but information evicted from the middle is not remembered.',
      ],
      analogy: 'RoPE is like clock hands: the second hand (high frequency) moves quickly while the hour hand (low frequency) moves slowly. If a model learned a 4-hour clock and must read 16 hours, linear interpolation slows all hands fourfold, making seconds harder to read. NTK/YaRN slow the hour hand more while preserving the second hand. Attention sinks are like keeping a meeting chairperson and recent speakers in the room; removing the chairperson can destabilize the meeting.',
      example: 'Linear interpolation: trained length 4,096, target 16,384; scale factor = 16,384 ÷ 4,096 = 4. Position 12,000 maps to 12,000 ÷ 4 = 3,000, inside the trained range. For attention sinks, keep the first 4 tokens plus the most recent 1,020 = 1,024 cache slots. KV memory stays bounded even after generating 100,000 tokens.',
      keyPoints: [
        'RoPE positions beyond training may use unseen angles and sharply reduce quality.',
        'Linear PI divides positions by a scale factor but compresses all frequencies and blurs local detail.',
        'NTK-aware scaling raises the base frequency and largely preserves high-frequency detail.',
        'YaRN combines by-parts interpolation with attention-temperature adjustment and can use a small fine-tune.',
        'StreamingLLM keeps sink tokens plus a recent window; a pure sliding window can destabilize generation.',
      ],
      terms: [
        { en: 'RoPE', si: 'A method that encodes position as rotation angles in query and key vectors.' },
        { en: 'Position Interpolation', si: 'A context-extension method that scales position indices into the trained range.' },
        { en: 'NTK-aware Scaling', si: 'A method that increases the RoPE base and stretches low-frequency dimensions.' },
        { en: 'YaRN', si: 'A RoPE extension combining by-parts interpolation with attention-temperature adjustment.' },
        { en: 'Attention Sink', si: 'An early token that receives substantial attention mass and is retained in the cache.' },
        { en: 'Sliding Window KV', si: 'A bounded cache that keeps KV values for only the most recent N tokens.' },
      ],
      si: 'ඔයා තත්පර කටුවයි පැය කටුවයි තියෙන ඔරලෝසුවක් හිතන්න. Model එක 4,096 positions දක්වා ඉගෙනගෙන 16,384ක් ඕනේ නම් factor එක 16,384 ÷ 4,096 = 4; position 12,000 එක 12,000 ÷ 4 = 3,000ට map වෙනවා. Attention sink කියන්නේ cache එකේ මුල් tokens කිහිපය තියාගන්න එක; උදාහරණයට මුල් 4යි අලුත්ම 1,020යි එකතුව 1,024 slots. ඒකෙන් දිගට generate කළත් KV cache එක bounded, නමුත් අයින් කළ මැද තොරතුරු ආපහු මතක වෙන්නේ නෑ.',
    },

    // 19
    {
      id: 'run-llm-locally',
      title: 'Beyond the Exam: Running an LLM on Your Own Machine (Ollama, llama.cpp, GGUF)',
      plain: 'Local inference trades convenience and privacy against hardware limits. Model size, quantization, context length, and runtime support determine whether a model fits and performs acceptably.',
      internGuide: ['llama.cpp is a local inference runtime optimized for supported model architectures and CPUs/GPUs. GGUF is a file format containing tensors and model metadata used by that ecosystem.', 'Ollama provides model packaging and a local service interface, commonly using llama.cpp-related runtime components underneath for supported models.', 'Estimate weight memory from quantized size, then leave room for KV cache and runtime buffers. Larger context settings can consume substantial additional memory.', 'Exam focus: quantization labels are not exact quality guarantees across methods. Check architecture support, prompt template, license, and measured speed on the target machine.'],
      examRefs: [],
      body: [
        'Try what you learned in this phase on your own laptop. llama.cpp is a C/C++ inference engine that runs on CPUs and GPUs such as CUDA or Apple Metal. It uses the GGUF model-file format, which can include quantized weights, tokenizer, chat template, and metadata. Ollama is a convenient tool built on llama.cpp for downloading and running models and providing a local API.',
        'GGUF quantizations include Q8_0, Q6_K, Q5_K_M, Q4_K_M, and Q3_K_M; the number roughly indicates bits per weight. Q8_0 is closer to the original but larger. Q4_K_M is a common size/quality balance, while Q3 and Q2 are smaller but may show quality loss. Group scales make effective bits slightly higher than the nominal value (see the quantization topic). Choose the largest quantization that fits memory while leaving room for context KV cache.',
        'Estimate speed with the earlier rule: batch-1 decode tokens/s ≤ memory bandwidth ÷ model bytes. Laptop RAM has much less bandwidth than GPU HBM, so CPU decoding is slower; long prompts also make CPU prefill take time. If you have a GPU, offload some or all layers with llama.cpp’s -ngl. Increasing context size with -c also increases KV-cache memory.',
      ],
      analogy: 'A cloud API is like ordering food from a hotel: convenient, but you pay for each plate (token) and send your data outside. A local LLM is like cooking rice at home: you first need equipment (GPU/RAM), but your data can stay local and per-token API charges do not apply. Choosing quantization is like matching the rice pot size to how much rice you have.',
      example: 'An 8B model on a 16 GB RAM laptop: FP16 needs 8 × 2 = 16 GB, leaving no room for the OS, so it will not fit. Q8_0 ≈ 8 × 1.06 ≈ 8.5 GB, which fits but is tight. Q4_K_M at about 4.5–5 bits/weight needs around 5 GB, leaving room for context. If RAM bandwidth is 50 GB/s, the ideal upper bound is 50 ÷ 5 ≈ 10 tokens/s; Q8_0 gives 50 ÷ 8.5 ≈ 6. Quantization affects speed as well as memory.',
      code: {
        lang: 'bash',
        src: `# Download and chat with a model using Ollama
ollama pull llama3.1:8b
ollama run llama3.1:8b "Explain briefly how to make kottu"

# Local API (OpenAI-style chat)
curl http://localhost:11434/api/chat -d '{"model":"llama3.1:8b",
  "messages":[{"role":"user","content":"Hello"}],"stream":false}'

# llama.cpp: GGUF file, context 4096, offload 99 layers to GPU
llama-cli -m model-Q4_K_M.gguf -c 4096 -ngl 99 -p "Hello"`,
      },
      keyPoints: [
        'llama.cpp = CPU/GPU inference engine. GGUF = quantized weights + tokenizer + template metadata.',
        'Ollama is a convenient download/run/API tool built on llama.cpp (localhost:11434).',
        'Q8_0 stays closer to original quality; Q4_K_M balances size and quality; Q3/Q2 may reduce quality.',
        'Local decode speed is roughly RAM/VRAM bandwidth ÷ model file size.',
        'Larger context needs more KV-cache memory; leave enough room.',
      ],
      terms: [
        { en: 'llama.cpp', si: 'An open-source C/C++ inference engine for running LLMs on laptops and servers.' },
        { en: 'GGUF', si: 'A llama.cpp model-file format that can store quantized weights and metadata together.' },
        { en: 'Ollama', si: 'A tool for downloading and running local models and exposing an API.' },
        { en: 'Q4_K_M / Q8_0', si: 'GGUF quantization types whose numbers roughly indicate bits per weight.' },
        { en: 'GPU Offload (-ngl)', si: 'A llama.cpp setting for how many model layers to place on the GPU.' },
      ],
      si: 'ඔයාගේ laptop එකේ model එකක් ධාවනය කරන්න llama.cpp භාවිතා කළ හැකියි; Ollama model එක ගන්නත් local API දෙන්නත් පහසු කරනවා. 8B model එක FP16 නම් 8 × 2 = 16 GB ඕනේ, 16 GB laptop එකක OS එකට ඉඩ ඉතුරු වෙන්නේ නෑ. Q4_K_M එක 5 GB පමණ නම් context එකේ KV cache එකටත් ඉඩ තියෙනවා. RAM bandwidth 50 GB/s නම් 50 ÷ 5 = තත්පරයට tokens 10ක් පමණ කියන්නේ සරල උපරිම ඇස්තමේන්තුවක්.',
    },

    // 20
    {
      id: 'reading-inference-benchmarks',
      title: 'Beyond the Exam: Reading (and Running) an Inference Benchmark Honestly',
      plain: 'An inference benchmark is meaningful only when hardware, model, precision, input/output lengths, concurrency, and latency targets match the intended workload.',
      internGuide: ['Record exact GPU type and count, software versions, model and quantization, tensor parallelism, prompt length, generated length, and request distribution.', 'Run warmup before measurement and separate TTFT, TPOT, end-to-end latency, per-user token rate, and aggregate throughput.', 'Increase offered load until latency or errors violate the service objective; peak throughput without a latency limit can hide unusable queues.', 'Exam focus: compare like with like. A benchmark with shorter prompts, larger batches, or different precision cannot prove one server is universally faster.'],
      examRefs: ['DEP-074', 'DEP-106', 'DEP-147'],
      body: [
        'When you see a claim such as "our server gets 10,000 tokens/s", ask about input and output lengths, concurrency, precision (FP16, FP8, INT4), and GPU type/count. Throughput can look high at high concurrency while TTFT and TPOT worsen (see the latency topic). Prefill-heavy (long prompt, short output) and decode-heavy (short prompt, long output) workloads can behave very differently.',
        'A good benchmark report gives TTFT and TPOT p50 and p99 plus throughput at several concurrency levels, ideally as a latency-versus-throughput curve. Goodput is throughput achieved without violating an SLO such as TTFT < 1 s and TPOT < 50 ms. Exclude warm-up runs that include compile/load time, and compare the same hardware, precision, and prompts. NVIDIA GenAI-Perf and vLLM benchmark scripts are examples of tools. GPU-Util 100% in nvidia-smi does not mean the GPU is fully utilized; it indicates whether some kernel ran during a time interval. Inspect SM activity with Nsight or DCGM.',
        'To build realistic prompts from a large Hugging Face Hub dataset (for example 2 TB) when disk space is only 500 GB, use load_dataset(..., streaming=True). It returns an IterableDataset and reads records as you iterate rather than downloading the whole dataset. keep_in_memory=True does the opposite.',
        'Canary sample-size pitfall: a new model/server version gets 1% of traffic for 10 minutes, shows 0 errors, while baseline error rate is 0.2%, and someone wants to promote it. With only a few hundred requests, seeing zero errors is common even if the true rate matches baseline. Run the canary longer or with more traffic and compare with baseline over the same time window to control time-of-day effects. Likewise, repeat benchmarks and measure variance rather than relying on one or two runs.',
      ],
      analogy: 'A benchmark claim is like a tuk-tuk ad saying "40 km per litre": was it measured on an empty road, with one passenger, downhill? The real result differs in Colombo traffic with three passengers. Zero canary errors are like a cricketer with no ducks in two matches claiming they always score; the sample is too small.',
      example: 'Canary estimate: 1% traffic for 10 minutes gives 300 requests. At a baseline 0.2% error rate, expected errors = 300 × 0.002 = 0.6. Seeing zero is common (probability about e⁻⁰·⁶ ≈ 0.55), so it does not prove the new version is better. Benchmark: System A gets 5,000 tokens/s at concurrency 256 but TTFT p99 is 8 s; System B gets 3,500 tokens/s at concurrency 64 and TTFT p99 0.6 s. B is better for chat with SLO TTFT < 1 s; A may be better for overnight batch jobs.',
      code: {
        lang: 'python',
        src: `from datasets import load_dataset

# Stream a 2 TB dataset without downloading it all
ds = load_dataset("some-org/huge-corpus", split="train", streaming=True)
prompts = [ex["text"][:2000] for ex, _ in zip(ds, range(500))]

import math
expected = 300 * 0.002          # expected errors at the baseline rate
print(round(math.exp(-expected), 2))   # 0.55 = chance of seeing zero errors`,
      },
      keyPoints: [
        'A tokens/s claim is incomplete without input/output lengths, concurrency, precision, and hardware.',
        'Report TTFT/TPOT p50 and p99 plus throughput at several concurrency levels; goodput respects the SLO.',
        'GPU-Util 100% does not mean the GPU is fully used; inspect SM activity.',
        'Use load_dataset(..., streaming=True) for large Hugging Face datasets.',
        'Zero errors in a small sample is not proof; run longer and compare with a same-window baseline.',
      ],
      terms: [
        { en: 'Goodput', si: 'Throughput achieved without violating latency service-level objectives.' },
        { en: 'p50 / p99', si: 'The latency below which 50% / 99% of requests fall.' },
        { en: 'GenAI-Perf', si: 'NVIDIA’s LLM-serving benchmark tool for measuring TTFT, ITL, and throughput.' },
        { en: 'Streaming Dataset', si: 'A Hugging Face dataset mode that reads records during iteration instead of downloading all data.' },
        { en: 'Canary Analysis', si: 'Giving a small traffic share to a new version and comparing it statistically with a baseline.' },
      ],
      si: 'ඔයා තුන් රෝද රථයක "ලීටරයට කි.මී. 40යි" කියන දැන්වීමක් දැක්කා කියලා හිතන්න; Colombo traffic එකේ මගීන් තුන්දෙනෙක් එක්ක ඒ අගය වෙනස් වෙයි. ඒ වගේ tokens/s කියද්දී prompt දිග, output දිග, concurrency, GPU එක කියන්න ඕනේ. Canary එකේ requests 300ක් සහ baseline errors 0.2% නම් බලාපොරොත්තු errors 300 × 0.002 = 0.6යි; 0 error එකක් දැකීමේ chance එක e⁻⁰·⁶ ≈ 0.55. ඒ නිසා පොඩි sample එකක 0 errors කියන්නේ හොඳයි කියලා ඔප්පු කිරීමක් නෙවෙයි.',
    },
  ],
  quiz: [
    {
      q: 'After applying softmax to logits [3, 1, 0], what is the approximate probability of the first token?',
      options: ['0.75', '0.84', '0.95', '0.60'],
      answer: 1,
      why: 'e³ ≈ 20.09, e¹ ≈ 2.72, and e⁰ = 1. The sum is 23.81, so 20.09 ÷ 23.81 ≈ 0.84. The incorrect 0.75 comes from dividing 3 by 4 without exponentiating.',
    },
    {
      q: 'With sorted probabilities [0.60, 0.20, 0.10, 0.05, 0.05] and min_p = 0.25, how many tokens remain?',
      options: ['1', '2', '3', '5'],
      answer: 1,
      why: 'The min-p threshold is relative: 0.25 × 0.60 = 0.15. Only 0.60 and 0.20 are at least 0.15.',
    },
    {
      q: 'A token appeared 3 times. With frequency_penalty 0.5 and presence_penalty 0.6, how much is its logit reduced?',
      options: ['1.1', '1.5', '2.1', '3.3'],
      answer: 2,
      why: 'Frequency reduction = 3 × 0.5 = 1.5. Presence reduction is a flat 0.6, not multiplied by count. Total = 2.1.',
    },
    {
      q: 'A decoder-only model gives poor completions for short prompts in a batch. Which setting is most likely needed?',
      options: ['padding_side="left"', 'padding_side="right"', 'num_beams=4', 'skip_special_tokens=True'],
      answer: 0,
      why: 'Decoder-only models append new tokens at the end of each row, so padding should be on the left. With right padding, generation continues after pad tokens.',
    },
    {
      q: 'An extraction service returns malformed JSON in 3% of responses. What can guarantee valid JSON syntax?',
      options: ['Adding more few-shot examples', 'Increasing temperature', 'JSON-schema-constrained decoding', 'Beam search'],
      answer: 2,
      why: 'Constrained decoding masks tokens that violate the grammar at each step, making invalid syntax impossible. The other options only change the odds.',
    },
    {
      q: 'With 32 layers, hidden size 4,096, standard MHA, and an FP16 KV cache, how large is the cache for 4,096 tokens?',
      options: ['1 GiB', '512 MiB', '4 GiB', '2 GiB'],
      answer: 3,
      why: 'Per token: 2 × 32 × 4,096 × 2 bytes = 0.5 MiB. Multiply by 4,096 tokens to get 2 GiB. Omitting the factor 2 for K and V gives the incorrect 1 GiB.',
    },
    {
      q: 'A weight-only INT4 model is faster than FP16 at batch 1 but slower than FP8 at batch 256. Why?',
      options: [
        'INT4 has lower accuracy and therefore generates more tokens',
        'The large batch is compute-bound; INT4 dequantization adds overhead while native FP8 Tensor Core math is faster',
        'The large batch is memory-bound, which makes INT4 slower',
        'FP8 does not use a KV cache',
      ],
      answer: 1,
      why: 'Weight-only quantization saves bandwidth, which helps memory-bound batch-1 decode. Native FP8 GEMMs can win on compute-bound large batches.',
    },
    {
      q: 'With standard rejection sampling in speculative decoding, how does the output distribution compare with sampling from the target model alone?',
      options: ['It is exactly the same', 'It approaches the draft model distribution', 'It becomes greedy', 'Its temperature decreases'],
      answer: 0,
      why: 'The min(1, p/q) acceptance rule and max(0, p − q) resampling preserve the exact target distribution p. The draft model affects speed only.',
    },
    {
      q: 'A request outputs 500 tokens, has total latency 10.5 s, and TTFT 0.5 s. What is the approximate TPOT?',
      options: ['21 ms', '20 ms', '10 ms', '40 ms'],
      answer: 1,
      why: 'TPOT = (10.5 − 0.5) ÷ (500 − 1) ≈ 20 ms. Dividing 10.5 by 500 gives 21 ms because it incorrectly includes prefill time.',
    },
    {
      q: 'A RoPE model trained for 4K context must support 16K. What does linear position interpolation do?',
      options: [
        'It truncates the prompt to 4K',
        'It switches to learned absolute embeddings',
        'It adds attention sinks',
        'It divides position indices by 4, mapping 16K positions into the trained 0–4K range',
      ],
      answer: 3,
      why: 'It compresses positions to keep rotation angles within the familiar range, often with a short fine-tune. Truncation would lose content.',
    },
  ],
}
