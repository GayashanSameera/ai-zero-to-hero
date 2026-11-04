export default {
  id: 'training',
  number: 15,
  title: 'LLM Training, Fine-Tuning & Scaling: Deep Dive',
  titleSi: 'A practical guide to LLM training, fine-tuning, alignment, and GPU scaling',
  summary:
    'Explore the full LLM training workflow: data curation, pretraining objectives, supervised fine-tuning (SFT), parameter-efficient methods such as LoRA and QLoRA, RLHF and DPO alignment, mixed precision, memory estimation, and distributing training across GPUs. Work through calculations step by step so you can reason about NCA-GENL training questions rather than memorize answers.',
  duration: '4-6 weeks',
  topics: [
    // 1
    {
      id: 'pretraining-objectives',
      si: 'ඔයා Colombo බස් එකක ගමන් විස්තරයෙන් ඊළඟ වචනය අනුමාන කරන්න කියලා Model එකට දෙන්න පුළුවන්. CLM එක කලින් වචන විතරක් බලනවා, MLM එක වාක්‍යයේ හිස් තැනට දෙපැත්තේ වචනත් බලනවා. T5 වගේ Span Corruption ක්‍රමයක වාක්‍යයේ කොටස් කිහිපයක් වහලා ඒවා ආපහු පුරවනවා. මේ විදිහට ලේබල් අතින් නොදා විශාල text එකකින් ඉගෙන ගන්න පුළුවන්.',
      title: 'Pretraining Objectives: Causal LM, Masked LM, Span Corruption',
      examRefs: ['TRN-001', 'TRN-002', 'TRN-003', 'TRN-004'],
      body: [
        'Pretraining is the first stage of teaching the general knowledge about the language and the world by showing the model an amount of text with trillions of tokens and no labels. Since there are no labels, "questions" are made from the text itself. This is called self-supervised learning. After this stage, a base model (foundation model) is obtained. It knows the language well, but does not follow instructions, and does not refuse unsafe requests. A base model usually just keeps writing the text you gave. Instruction following and refusals come from the later SFT and alignment stages.',
        'Causal Language Modeling (CLM): The objective of decoder-only models such as GPT and Llama. Everywhere, "What is the next token after looking at the tokens that have come so far?" Guessing that. Only the left side (formerly tokens) is visible to the model. Causal mask hides future tokens. Because of this, the model is directly trained to generate text from left to right.',
        'Masked Language Modeling (MLM): The objective of encoder-only models like BERT. About 15% of the input tokens are hidden randomly ([MASK]), the model guesses the hidden token by looking at the context on both sides (left and right). This is good for "understanding" tasks like classification and retrieval. But it is not directly trained to generate text.',
        'Span Corruption: The objective that popularized the T5 (encoder-decoder) model. Instead of individual tokens, continuous parts (spans) are hidden, and every span is replaced with a sentinel token like <extra_id_0>, <extra_id_1>. The broken text goes to the Encoder. The decoder outputs the hidden spans along with the sentinel. Like BERT, it\'s a "fill in the blanks" idea, but different because it has a separate generative decoder.',
      ],
      analogy:
        'Think three questions in an O/L Sinhala paper. CLM = "Write the next word in this story" (only the previous part is visible). MLM = "Fill in the blank in this sentence" (words appear before and after the blank). Span corruption = "The three parts of the passage where the letters have been erased are labeled (A), (B), (C). Write the three parts on a separate sheet of paper."',
      example:
        'Sentence: "I went to office in Colombo bus this morning". CLM: input "I am this morning" → target "Colombo". MLM: "I went to the office today [MASK] on the Colombo bus" → "[MASK] = morning". Span corruption: encoder input "I went to <Y> on <X> bus today" → decoder output "<X> morning in Colombo <Y> office". Note that one span can have several tokens.',
      keyPoints: [
        'Pretraining = building a base model from a large corpus without labels.',
        'Base model continues text, instructions are followed after SFT/alignment.',
        'Decoder-only (GPT, Llama) = causal LM, the next token.',
        'Encoder-only (BERT) = masked LM, ~15% tokens, context on both sides.',
        'Encoder-decoder (T5) = span corruption, sentinel tokens.',
      ],
      terms: [
        { en: 'Self-Supervised Learning', si: 'To learn by creating questions and answers from the data itself without giving labels.' },
        { en: 'Base / Foundation Model', si: 'The model who only did pretraining, has extensive knowledge but is not an assistant.' },
        { en: 'Causal Mask', si: 'The attention mask that does not allow a token to see future tokens.' },
        { en: 'Sentinel Token', si: 'The special token that replaces a hidden span in T5 (eg <extra_id_0>).' },
        { en: 'Next Sentence Prediction', si: 'An old BERT objective that classifies whether two sentences come in sequence. LLM is not the pretraining objective.' },
      ],
    },

    // 2
    {
      id: 'data-curation',
      si: 'ඔයාට Colombo පාරවල් ගැන පිටු 1,000ක් ලැබුණා කියලා හිතන්න; ඒ අතර දැන්වීම්, එකම පිටු සහ වැරදි භාෂාවෙන් ලියූ දේවල් තියෙන්න පුළුවන්. Training ට කලින් ඒවා පිරිසිදු කර duplicate ඉවත් කළාම model එකට වඩා හොඳ උදාහරණ ලැබෙනවා. MinHash සමාන පිටු හඳුනාගන්න උදව් කරනවා, decontamination මගින් විභාග ප්‍රශ්න training තුළ තිබුණාද කියලා බලනවා. ඔයාට විවිධ data වර්ග එක්ක මිශ්‍රණයත් පාලනය කරන්න පුළුවන්.',
      title: 'Data Curation: Quality Filtering, Dedup (MinHash), Decontamination, Mixture Weights, NeMo Curator',
      examRefs: ['TRN-005', 'TRN-006', 'TRN-007', 'TRN-098', 'TRN-099', 'TRN-100'],
      body: [
        'The model is good only if the data is good. Web crawl data contains a lot of junk like menus, cookie notices, spam, and pages that have copied the same thing thousands of times. Therefore, a curation pipeline runs before the pretraining: text extraction → language identification → quality filtering → deduplication → decontamination → mixture weighting.',
        'Heuristic quality filtering: cheap, rule-based filters. For example: If the document is too short, it is removed, if the symbol-to-word ratio (#, {, | compared to symbols) is too high, if the same line is repeated again and again, it is removed, if there are normal stop-words (the, and, is) or it is not a natural language, it is removed. In addition, classifier-based filtering (scoring "is this quality text?" with a small model) is done. Quality filtering looks at the quality of the document. Deduplication compares documents to each other. Those are two different steps.',
        'Why Deduplication? Due to duplicate text, the data distribution is drawn, training tokens (compute) are wasted, the model learns the text word by word (memorization) and regurgitates it. Dedup does not solve the copyright problem. It requires separate source filtering / licensing check. Exact dedup = A hash like SHA-256 / MD5 is created for each document and those with the same hash are removed. But if a timestamp or a few words change, the cryptographic hash changes completely. So fuzzy dedup is needed to catch near-duplicates.',
        'Fuzzy dedup (MinHash + LSH): Each document is made into a set of word n-grams (e.g. parts of 5 words each). How similar two documents are is measured by Jaccard similarity: number of common n-grams ÷ total number of different n-grams. Billions of pairs of documents cannot be directly compared. MinHash creates a small "signature" for each document. The percentage of matching parts of two signatures is close to Jaccard similarity. LSH (Locality-Sensitive Hashing) puts similar signatures in the same bucket, so only those in the same bucket need to be compared. NVIDIA NeMo Curator does this on GPUs via RAPIDS.',
        'Decontamination: If benchmark questions like MMLU, GSM8K are leaked into the training data, the model will learn the answers by heart, and the score will falsely increase. Therefore, the training text with n-gram overlap (e.g. 13-gram) with the benchmark text is removed. The amount removed is very small. The aim is not to save compute, but to be honest in the evaluation. Mixture weighting: If the corpus is 85% web, 15% books/code/papers, higher quality sources (code, books) are sampled more than their raw percentage (upsampling). They appear in several epochs, the web text usually only once. Upsampling is not a substitute for filtering, but a supplement.',
      ],
      analogy:
        'Imagine you bought a sack of rice from Pettah market. First, stones and garbage are removed (quality filtering). After that, packets stuck twice in the same sack are removed (exact dedup). If you want to find the same rice, but the label is slightly different packets, you have to look closely with both eyes (fuzzy dedup). The question paper that comes in the exam is not shown to the child beforehand (decontamination). At the end, even if more rice is added to the rice plate, nutritious lentils and vegetables are given more importance than their quantity (mixture weighting).',
      example:
        'Document A: "Colombo weather today is sunny and warm" (7 words). Document B: The same text, adding "Updated 10:05" at the end (9 words). The two SHA-256 hashes are completely different, so exact dedup won\'t catch this. If we take Word 3-grams, A has 5, B has 7. 5 common, 7 different in total. Jaccard = 5 ÷ 7 ≈ 0.71. If the threshold is 0.6, the fuzzy dedup removes the two as near-duplicates. Mixture example: Even if the code raw share is 5%, if the sampling weight is 10%, the code tokens will appear twice (2 epochs).',
      keyPoints: [
        'Heuristic filters = rules like length, symbol ratio, repeated lines, stop-words.',
        'Dedup = reduces memorization and compute waste. Copyright will not be resolved.',
        'Exact hash (SHA-256) = exact copies only. Near-duplicates = MinHash + LSH (Jaccard).',
        'Decontamination = stop benchmark leakage and make evaluation honest.',
        'NeMo Curator = GPU-accelerated curation (filtering, dedup, language ID). Not guardrails.',
      ],
      terms: [
        { en: 'NeMo Curator', si: 'NVIDIA tool that cleans pretraining/fine-tuning data. Running exact/fuzzy dedup, filters on GPU via RAPIDS.' },
        { en: 'Jaccard Similarity', si: 'Number of common items in two sets ÷ total number of different items. 1 = exactly the same.' },
        { en: 'MinHash', si: 'The method of creating a short signature can estimate the Jaccard similarity of a document.' },
        { en: 'LSH (Locality-Sensitive Hashing)', si: 'A method that puts similar signatures in the same bucket and eliminates the need to compare every pair.' },
        { en: 'Benchmark Contamination', si: 'Leaking test questions into training data. Scores are falsely increased.' },
        { en: 'Upsampling', si: 'Sampling a valuable data source more often than its natural size.' },
      ],
    },

    // 3
    {
      id: 'synthetic-data-distillation',
      si: 'ඔයා cricket coach කෙනෙක්ගෙන් හොඳ පිළිතුරු උදාහරණ අරගෙන ඒවායෙන් පුහුණු වෙනවා වගේ, ලොකු teacher Model එකක් synthetic examples හදා දෙන්න පුළුවන්. Student Model එක ඒ පිළිතුරු ඉගෙන ගන්නවා; logits තිබුණොත් එහි probability විස්තරත් ඉගෙන ගන්න පුළුවන්. උදාහරණ හොඳද සහ එකිනෙකට වෙනස්ද කියලා පරීක්ෂා කිරීම වැදගත්. නැත්නම් වැරදි උත්තරත් නැවත නැවත ඉගෙන ගන්න ඉඩ තියෙනවා.',
      title: 'Synthetic Data, Self-Instruct, Knowledge Distillation & Model Collapse',
      examRefs: ['TRN-030', 'TRN-031', 'TRN-094', 'TRN-095', 'TRN-096', 'TRN-097', 'TRN-141', 'TRN-142', 'TRN-150'],
      body: [
        'Labeled data is small (e.g. 200 examples), but thousands are needed to fine-tune. Even if you copy that 200 times, no new information will be added, only overfitting will increase. The standard solution in the world is synthetic data generation: generating new examples with a strong "teacher" LLM, and then quality filtering. The Instruct model and the Reward model of NVIDIA Nemotoron-4 340B were released for this. The instruct model generates prompts and responses. The reward model scores the responses according to attributes such as helpfulness and correctness, and removes weak ones. The reward model does not generate prompts, it only scores.',
        'Self-Instruct: Start with about 175 seed tasks written by people, ask the LLM to generate new instructions and answers, filter according to quality and diversity, and continue to seed them again. This is how SFT (instruction tuning) data is formed. Stanford Alpaca used a variant of this. Reward models are not created by labels.',
        'Knowledge distillation: teaching the behavior of a large teacher model to a small student model. In logit-based distillation, the student learns from the teacher\'s complete probability distribution (soft targets). A distribution like "dog 0.7, fox 0.2, cat 0.1" has hidden information (dark knowledge) that "the fox is a bit similar to the dog". One-hot label doesn\'t have that. When the logits are divided by Temperature T > 1, the distribution becomes flat, and the hidden information becomes clear. As T increases, predictions become less confident. In the soft-target term, the gradients are reduced by 1/T², so in the Hinton method, that loss is multiplied by T². Then, even if T is changed, the weight of that term remains the same compared to the hard-label loss. (Pruning is a separate compression method that removes parts from the model, often used together with distillation.)',
        'If the teacher only has API access (no logits), logit matching or hidden-state matching cannot be done. At that time, sequence-level distillation is done: the student is trained with a normal SFT on the responses generated by the teacher. (Teacher\'s terms of use should also be checked.) Methods like MiniLLM in generative LLMs minimize on reverse KL, KL(student ‖ teacher), student-sampled outputs. Forward KL "mass-covering": wherever the teacher gives probability, students are forced to give probability, a small student cannot do it properly and writes low quality text. Reverse KL "mode-seeking": focuses on the student teacher\'s main, high-probability modes. It requires samples from students (on-policy sampling).',
        'Model collapse: If each model generation is trained on the synthetic text of the previous generation (minus fresh human data), the low probability "tail" content will be sampled a little less each time. The errors accumulate and the distribution shrinks, the outputs become uniform and distorted (Shumailov et al.). Solution: Always keep a portion of real data, filter synthetic data well. Synthetic data is good as a supplement, not a complete replacement.',
      ],
      analogy:
        'Teacher = A famous tuition sir of A/L Physics. Hard label = just saying "Answer (3)". Soft targets = "(3) is right, but (4) is a bit close, and (1) is completely wrong". The student can learn more from the second. Model collapse = like taking a photocopy of a photocopy of a photocopy. Little details are lost every time, and eventually it becomes unreadable.',
      example:
        'Synthetic pipeline: 200 seed examples → 10,000 candidates from the instruct model → score from the reward model and keep the top 30% → 3,000 examples. Distillation temperature: teacher logits [4, 2, 0]. At T = 1 softmax ≈ [0.87, 0.12, 0.02]. At T = 2 logits becomes [2, 1, 0], softmax ≈ [0.67, 0.24, 0.09]. The information of the second and third classes is now clear. If T = 2, the soft loss is multiplied by T² = 4.',
      keyPoints: [
        'Small dataset → Generate and filter from teacher LLM. Do not duplicate.',
        'Nemotoron-4 340B Reward model = scoring and filtering synthetic responses.',
        'Self-Instruct = seed tasks ~175 → LLM generate → filter → SFT data.',
        'Distillation: soft targets, flattening T > 1, loss × T². sequence-level if API-only.',
        'Reverse KL = mode-seeking (MiniLLM). Synthetic-only loops = model collapse.',
      ],
      terms: [
        { en: 'Synthetic Data', si: 'Not people, but training data generated by a model.' },
        { en: 'Self-Instruct', si: 'The method of creating a dataset by generating instructions and answers for LLM from a small seed set.' },
        { en: 'Soft Targets / Dark Knowledge', si: 'Teacher\'s full probability distribution, and its hidden "similarity between wrong answers" information.' },
        { en: 'Sequence-Level Distillation', si: 'The student doing SFT on the text written by the teacher. Logits are not needed.' },
        { en: 'Forward vs Reverse KL', si: 'Forward = mass-covering, Reverse = mode-seeking.' },
        { en: 'Model Collapse', si: 'By repeatedly training on synthetic data, rare content is lost and outputs shrink.' },
      ],
    },

    // 4
    {
      id: 'continued-pretraining-forgetting',
      si: 'ඔයා වෛද්‍ය පොත් 50 GBක් තියෙනවා කියලා හිතන්න; ඒවායෙන් domain දැනුම ඉගෙන ගන්න labels නැතුව continued pretraining කරන්න පුළුවන්. ඊට පස්සේ Q&A 5,000කින් පිළිතුරු දෙන ආකාරය SFT වලින් පුහුණු කරන්න. අලුත් වෛද්‍ය දේවල් ඉගෙන ගනිද්දී පරණ සාමාන්‍ය දැනුම අමතක වීම catastrophic forgetting. පරණ data වලින් 5%ක් replay කිරීම සහ learning rate එක නැවත warm up කර පසුව අඩු කිරීම ඒ අවදානම අඩු කරයි.',
      title: 'Continued Pretraining, Re-warming, Catastrophic Forgetting, Replay & EWC',
      examRefs: ['TRN-008', 'TRN-022', 'TRN-071', 'TRN-109', 'TRN-143', 'TRN-144'],
      body: [
        'Continued (domain-adaptive) pretraining: If you have a lot of domain text without labels (eg company engineering docs 50 GB, medical papers), the base model is further trained on that text with the same next-token objective. Then the model absorbs the words, abbreviations and facts of the domain. Methods like instruction tuning and DPO need prompt-response pairs or preference pairs, they teach behavior, not bulk knowledge. Prompt tuning (like 20 virtual tokens) does not have the capacity to absorb 50 GB of domain knowledge.',
        'Correct order: If there is a large medical corpus without labels and 5,000 Q&A pairs, (1) continued pretraining on the corpus, (2) then SFT on the Q&A pairs, (3) preference alignment (DPO) if necessary. The knowledge is given first, then the conversation format is taught. If continued pretraining is done after SFT, the instruction following behavior taught by SFT will disappear.',
        'Re-warming: Pretraining usually ends with the learning rate decaying to a very small value. When starting the continued pretraining from that checkpoint, the LR is warmed up again (re-warmed) to a higher value and decayed again (re-decayed). If you stay in the old small LR, forgetting is less, but the new domain is not learned properly. After re-warming, the new domain is learned well, but the loss of the initial pretraining distribution increases at first (forgetting). Ibrahim et al. (2024) recommendation: re-warm + re-decay, and replay a small percentage (even a few percent) of the original pretraining data.',
        'Catastrophic forgetting: When fine-tuning a narrow dataset (e.g. legal contracts), the model loses its previously known abilities like general reasoning and coding. Weights are drawn to the new narrow distribution and the old abilities are overwritten. This is not reward hacking (exploiting a flawed reward in RL) or mode collapse. Mitigation: (a) Replay: Mix part of general instruction data with domain data. (b) Reduce LR, reduce epochs. (c) Use PEFT (LoRA), base weights do not change. (d) EWC (Elastic Weight Consolidation): The important parameters for old tasks are estimated from diagonal Fisher information, and if they are changed, a quadratic penalty is applied. Important weights are tied to the old value with an "elastic band". EWC does not need old data, it is a regularization method. Replay needs old data. More epochs or more LR increases forgetting.',
      ],
      analogy:
        'A general doctor who worked in Colombo hospital did only cardiology for a year. When I came back to the OPD, I forgot about the normal illnesses (catastrophic forgetting). Solution: Go to OPD once a week even while doing cardiology (replay). EWC = A law that says "If you change your basic medical knowledge, it\'s a big penalty, if it\'s a small detail, it doesn\'t matter." Re-warming = Warming up a little before bowling fast when starting cricket practice again after a holiday.',
      example:
        'Domain adaptation plan: 10 billion medical corpus tokens. Continued pretraining mix = medical 95% + original general pretraining data 5% (replay). LR: Re-warm 1,000 steps from 0 to peak 1e-4, re-decay from cosine to 1e-5. After that SFT with 5,000 Q&A pairs + 1,000 general instruction data (replay). By doing this, the medical work will be improved and general instruction following will not be lost.',
      keyPoints: [
        'Unlabeled domain text → continued pretraining (next-token objective).',
        'Order: continued pretraining → SFT → (DPO). Not the other way around.',
        'Re-warm + re-decay + replay a few percent of old data.',
        'Catastrophic forgetting = loss of general skills with narrow fine-tune.',
        'Mitigation: replay, less LR/epochs, PEFT, EWC (Fisher-weighted quadratic penalty, old data not needed).',
      ],
      terms: [
        { en: 'Domain-Adaptive Pretraining', si: 'Further training with the next-token objective on text without labels in the domain.' },
        { en: 'Re-warming', si: 'The LR that has finished decaying is warmed up again during the continued pretraining and taken to a higher value.' },
        { en: 'Catastrophic Forgetting', si: 'Loss of previously learned abilities by training on new data.' },
        { en: 'Replay', si: 'Mixing part of old / general data with new training data.' },
        { en: 'EWC (Elastic Weight Consolidation)', si: 'A regularization method that gives a quadratic penalty to change significant weights (high Fisher information).' },
        { en: 'Fisher Information', si: 'The measure of importance is how much the output of the old task is affected if a parameter is changed a little.' },
      ],
    },

    // 5
    {
      id: 'sft-deep-dive',
      si: 'ඔයා call centre එකක අලුත් සේවකයෙකුට customer ප්‍රශ්න සහ හොඳ පිළිතුරු පෙන්වනවා වගේ SFT උදාහරණවලින් Model එකට පිළිතුරු දෙන රටාව උගන්වනවා. Loss masking දාද්දී prompt එක context එකට තියෙනවා, නමුත් ලකුණු දෙන්නේ assistant පිළිතුරට විතරයි. කෙටි උදාහරණ එක sequence එකකට pack කළොත් padding අඩු වෙනවා; ඒත් එක උදාහරණයක token අනෙකට leak නොවෙන්න mask ඕනේ. Training සහ production chat template එක සමානද කියලා බලන්න.',
      title: 'SFT Deep Dive: Instruction Tuning, Loss Masking (-100), Packing, Chat Templates, LIMA, NEFTune',
      examRefs: ['TRN-009', 'TRN-010', 'TRN-049', 'TRN-079', 'TRN-080', 'TRN-081', 'TRN-082', 'TRN-110', 'TRN-140'],
      body: [
        'An SFT dataset is prompt + target response pairs. Demonstrations of "good answers" that people wrote or chose. The model learns to simulate those answers with normal cross-entropy loss. Chosen/rejected pairs are preference data, which are used for reward modeling or DPO (at a later stage). Instruction tuning (FLAN style): Hundreds of tasks are written as natural-language instructions and trained. Purpose: To work well as a zero-shot for new instructions that have never been seen before. Things like context length, model size, tokenizer do not change instruction tuning.',
        'Loss masking: When a chat model is SFT, the loss is calculated only for assistant response tokens. We want to teach how to write good answers, not write user prompts. The prompt is the context of the forward pass, it is visible to the attention, it does not only contribute to the loss. This is done in the code by making the prompt positions of the labels -100. -100 is the default ignore_index of PyTorch CrossEntropyLoss. Hugging Face models use it. Input tokens don\'t change, attention mask doesn\'t change either. Labels and attention mask are independent of each other.',
        'Sequence packing: If the examples are very short (like 200 tokens) and the sequence length is 4,096, most of the batch is padding. The GPU only computes on the padding. Packing means pasting several examples into one sequence and reducing padding. But if done correctly, the tokens of one example should not attend to the other example, attention masking (document boundaries) or position IDs should be reset. Therefore, the packing does not eliminate the need for the mask.',
        'Chat template mismatch: If the role tokens used during fine-tuning (e.g. <|user|>, <|assistant|>, end-of-turn token) are different in production inference, the model will get an unknown (out-of-distribution) format. The result: non-stop rambling, confusing turns. If you get strange answers in production, you should first check if the chat template and special tokens are exactly the same in both training and inference (use the same tokenizer.apply_chat_template). The fact that the training loss was 0 does not mean that the memorization and format are correct.',
        'Overfitting: Training loss continues to decrease while running 5 SFT epochs, but if the validation loss is lowest in epoch 2 and then increases, it is overfitting. Take the Epoch 2 checkpoint, or early stopping. (Underfitting means both losses are at the top.) LIMA: A 65B model performed SFT on only 1,000 well-chosen examples and got good results, without RLHF. "Superficial alignment hypothesis": knowledge comes from pretraining, SFT teaches style and format. Therefore, quality and diversity are more important than quantity. (Not a rule of 1,000.) NEFTune: A one-line variation that adds scaled uniform noise to the input embedding vectors only during SFT training. It works like a regularizer and reduces overfitting to the details of the instruction set and increases chat quality. There is no noise in Inference.',
      ],
      analogy:
        'SFT = Showing good examples to a new call center agent that "if the customer asks this, answer this". Loss masking = the agent is allowed to listen to the customer\'s story, but points are given only to the agent\'s answer. Packing = Instead of sending one person in a tuk-tuk, send three people going in the same direction together, but do not confuse one\'s belongings with the other\'s. Chat template mismatch = practicing starting with "Hello, customer care" during training, and starting the call with a separate beep in production. Agent gets confused.',
      example:
        '30 prompt tokens, 70 response tokens, total 100. When labels[:30] = -100, the loss is calculated only on 70 tokens. Packing: 20 examples, each with ~200 tokens, seq length 4,096. 20 sequences without packing, 3,896 padding in each (95% wasted). With packing, 200 × 20 = 4,000 tokens go to one sequence. GPU work is about 20 times less.',
      code: {
        lang: 'python',
        src: `import torch

input_ids = torch.tensor([[11, 12, 13, 21, 22, 23, 24]])  # prompt 3 + response 4
prompt_len = 3

labels = input_ids.clone()
labels[:, :prompt_len] = -100   #Prompt tokens are not taken for loss
print(labels)  # tensor([[-100, -100, -100, 21, 22, 23, 24]])

# loss = model(input_ids=input_ids, labels=labels).loss
# input_ids is unchanged: the model still sees the prompt as context`,
      },
      keyPoints: [
        'SFT data = prompt + response demonstrations. Preference pairs separately (DPO/RM).',
        'Instruction tuning = zero-shot generalization to unseen instructions.',
        'labels = -100 → cross-entropy ignores those positions. Attention is not different.',
        'Packing = padding reduces wastage, but boundaries must be masked.',
        'Production rambling → see chat template / special tokens first. LIMA = quality > quantity. NEFTune = embedding noise.',
      ],
      terms: [
        { en: 'ignore_index (-100)', si: 'CrossEntropyLoss The label value to omit from the loss calculation.' },
        { en: 'Loss Masking', si: 'Training only response tokens without contributing to the loss of prompt tokens.' },
        { en: 'Sequence Packing', si: 'Add several short examples to one sequence and reduce padding.' },
        { en: 'Chat Template', si: 'System/user/assistant turns the specific format of one text with special tokens.' },
        { en: 'Superficial Alignment Hypothesis', si: 'The LIMA idea that SFT primarily teaches style/format, not knowledge.' },
        { en: 'NEFTune', si: 'A regularization method that adds noise to input embeddings in SFT.' },
      ],
    },

    // 6
    {
      id: 'prompt-rag-finetune',
      si: 'ඔයාට Keells මිල ලැයිස්තුව නිතර වෙනස් වෙනවා නම් ඒක Model එකට fine-tune කරනවාට වඩා RAG මගින් අලුත් පිටු හොයා දීම හොඳයි. පිළිතුරු හැමවිටම එකම ආකෘතියෙන් ඕනේ නම් fine-tuning උදව් වෙනවා. Prompting ඉක්මන් සහ අඩු වියදම්, RAG දැනුම යාවත්කාලීන කිරීමට සුදුසුයි, fine-tuning හැසිරීම හෝ ආකෘතිය පුරුදු කරයි. ලොකු data සහ compute අවශ්‍ය වන pretraining එක සාමාන්‍යයෙන් මිල අධිකම තේරීමයි.',
      title: 'Prompting vs RAG vs Fine-Tuning: When Which?',
      examRefs: ['TRN-050', 'TRN-073', 'TRN-074'],
      body: [
        'Many questions on the exam come in the form of scenarios: "What is the best approach to this situation?" Remember the simple rule: start with the cheapest. Prompting → RAG → Fine-tuning → (continued) pretraining. Go to the next step only if the previous one is not enough.',
        'Prompting (few-shot) Initially: Labels are few (eg 30), the deadline is this week, the task is simple (classifying support tickets into 5 categories). Give some examples of a good instruction-tuned model in the prompt. That\'s probably enough. Things like RLHF, pretraining from scratch are too much for this.',
        'RAG: If the knowledge changes frequently (product docs are updated every week) and you need to cite sources for the answers. The knowledge of RAG is in an updateable index. When docs change, re-index is done, no need to retrain. Retrieved passages can be shown and cited. Weekly fine-tuning is expensive, there is the risk of forgetting, and there is no reliable way to trace where the answer came from.',
        'Fine-tuning (SFT / LoRA): The problem is not knowledge, but behavior: always the exact JSON schema, the brand tone, the output format. With a long system prompt, it is only 80% correct, if the long prompt increases latency, fine-tuning can "burn" that style to weights and shorten the prompt. If you increase few-shot examples, the prompt becomes longer and the latency problem worsens. RAG does not provide format consistency. If the temperature is increased, the consistency will decrease further.',
      ],
      analogy:
        'There is a new employee. Prompting = Giving some brief instructions and two examples before doing the work. RAG = "Keep this file with you, look at it whenever you want, and tell me where you got it from." When the file is updated, the new file will be given. Fine-tuning = sending to a training course for a month and inculcating the company style. After that, you don\'t need to give instructions every time.',
      example:
        'Scenario 1: Bank\'s interest rates change every week, customer needs the source link → RAG. Scenario 2: 30 tickets, 5 categories, prototype on Friday → few-shot prompting. Scenario 3: All answers {"category": ..., "priority": ..., "reply": ...} in JSON, in the brand tone of the company, latency is high due to 2,000 system prompt tokens → a LoRA SFT, then the prompt is shortened to 100 tokens.',
      keyPoints: [
        'Cheap → expensive: prompting → RAG → fine-tuning → pretraining.',
        'Frequently changing knowledge + citations = RAG.',
        'Consistent format / tone / schema + short prompt = fine-tuning (LoRA SFT).',
        'Few labels + quick prototype = few-shot prompting.',
      ],
      terms: [
        { en: 'Few-Shot Prompting', si: 'Showing the task by giving some examples within the prompt itself. Weights will not change.' },
        { en: 'RAG', si: 'Retrieval-Augmented Generation: Searching for relevant parts from an index and answering the prompt.' },
        { en: 'Baking Behavior into Weights', si: 'Making the style/format a part of the model itself by fine-tuning, without telling the prompt.' },
      ],
    },

    // 7
    {
      id: 'lora-deep-dive',
      si: 'ඔයාට 4,096 × 4,096 Excel වගුවක් වෙනස් කරන්න ඕනේ කියලා හිතන්න; හැම කොටුවක්ම වෙනස් කරනවා වෙනුවට LoRA කුඩා A සහ B වගු දෙකකින් update එකක් හදනවා. Rank r = 8 නම් එක matrix එකකට trainable parameters 8 × (4,096 + 4,096) = 65,536යි. B මුලදී zero නිසා ආරම්භයේ Model එක base එකට සමානයි. Rank එක capacity තීරණය කරනවා, target_modules තීරණය කරන්නේ කුමන layers වෙනස් වෙනවද කියලා.',
      title: 'LoRA Deep Dive: B·A, Rank, Alpha, Init, LoraConfig, Parameter Counts, Learning Rates',
      examRefs: ['TRN-011', 'TRN-012', 'TRN-013', 'TRN-014', 'TRN-053', 'TRN-054', 'TRN-055', 'TRN-056', 'TRN-057', 'TRN-070', 'TRN-101', 'TRN-135', 'TRN-138'],
      body: [
        'The essence of PEFT (Parameter-Efficient Fine-Tuning): freeze the majority of pretrained weights and train only a small number of newly added or selected parameters (usually much less than 1-2%). Then the memory going to gradients and optimizer states will be reduced a lot. PEFT is about "which parameters to train". Not about the dataset size. Data can be used for PEFT as well as full fine-tuning. RL is not needed, layers are not removed.',
        'LoRA Mechanism: Let W be a frozen weight matrix of size d × k. LoRA does not change W. Instead, the update is learned as ΔW = B·A. The shape of A is r × k, the shape of B is d × r. r (rank) is the "inner size" of those two matrices. Output of forward pass = W·x + (α/r)·B·A·x. Number of parameters to be trained = r × (d + k). Increasing r increases the capacity and size of the adapter. Average r values ​​4-64. It is not r that decides which layers to adapt to, but target_modules. (Adding trainable vectors to the input is prompt tuning, not LoRA.)',
        'Initialization: A is initialized as random, B as zeros. Since B = 0, B·A = 0, which means that the adapted model behaves exactly like the base model at the moment of training. And then smoothly moves away. Since the gradient of A depends on B, the gradient of A is 0 only in the first step. After B is updated, A will also get gradients. Scaling: The update is multiplied by α/r. If r = 16, lora_alpha = 32, then α/r = 32 ÷ 16 = 2. (0.5 is r/α, a common mistake.) A popular heuristic is: α = 2r, then the scale is 2 even if r is changed.',
        'How to read LoraConfig: LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05, target_modules=["q_proj","v_proj"], task_type="CAUSAL_LM") and get_peft_model(base_model, config). What happens here is that the base model is completely frozen, and new A/B matrices are injected into the modules whose names match "q_proj" and "v_proj". The original q/v weights are frozen. Gradients are only available for new low-rank matrices. lora_dropout = 5% dropout to input in adapter path. If model.print_trainable_parameters() prints "trainable params: 4,194,304 || all params: 6,742,609,920 || trainable%: 0.0622" meaning: gradients and Adam states are needed only for ~4.2M parameters (rest of PEFT memory comes from here). The adapter checkpoint is only ~4.2M params (~8 MB if BF16, ~17 MB if FP32). The base model has 6.7B in memory for forward pass. There was no compression, not that the inference was slowed down by 0.06%.',
        'Why are LoRA steps not so fast? Even if the parameters are trained less than 1%, the forward pass goes through the entire frozen model. To send gradients to the adapters of the first layers, the backprop must pass through each layer (activation gradients). Only weight-gradient calculation, optimizer updates, and memory of frozen weights remain. The increase in throughput to GPT-3 in the LoRA paper is ~25%. LoRA\'s main achievement is memory and storage. Learning rates: full fine-tuning ~1e-5 (don\'t destroy pretrained knowledge is small), LoRA ~1e-4 to 2e-4 (newly init low-rank adapters need ~10× more LR). LLM full fine-tuning with an LR like 1e-2 will quickly become unstable. If capacity is insufficient: r = 4 If an attention-only LoRA plateaus at a high validation loss in a complex code task, increase r and/or target MLP projections (gate/up/down_proj). The finding of the QLoRA paper: To reach full fine-tuning quality, LoRA should be applied to each linear layer (q, k, v, o + MLP). Rank is less sensitive than that.',
      ],
      analogy:
        'Instead of changing every cell in a big Excel sheet (4,096 rows × 4,096 columns), write only one "one number per row" column and "one number per column" row (r = 1). When the two are multiplied, the "difference" that fits the entire sheet is formed. If r = 8 then 8 such pairs. B = 0 init = starting the notebook with blank pages. In the beginning, only the knowledge of the book, the notes are added little by little.',
      example:
        'One matrix: d = k = 4,096, r = 8. A = 8 × 4,096 = 32,768, B = 4,096 × 8 = 32,768. Sum r(d + k) = 8 × 8,192 = 65,536. (32,768 is just a matrix. 16,777,216 is the size of the frozen W.) The whole model: 32 layers, q_proj and v_proj only. 65,536 × 2 × 32 = 4,194,304. 0.06% from a 7B model. If r = 16 then 8,388,608. 2,097,152 if you forget a target module. Scaling: r = 16, α = 32 → 2.',
      code: {
        lang: 'python',
        src: `from peft import LoraConfig, get_peft_model

config = LoraConfig(
    r=16,                 #Capacity inside A, B matrices
    lora_alpha=32,        # scale = alpha / r = 2
    lora_dropout=0.05,    #Dropout to adapter input
    target_modules=["q_proj", "v_proj"],  #Only for layers with these names
    task_type="CAUSAL_LM",
)
model = get_peft_model(base_model, config)  #base weights freeze
model.print_trainable_parameters()          #Only A and B are trained.`,
      },
      keyPoints: [
        'ΔW = B·A, A: r×k, B: d×r, params = r(d + k). Scale = α/r.',
        'B = 0 init → When starting, the model is the same as the base model.',
        'r = capacity. target_modules = which layers. If underfit, increase r / target MLP too.',
        'Trainable params = gradients + optimizer states. The base model does not compress.',
        'LR: full FT ~1e-5, LoRA ~1e-4-2e-4. LoRA is only a few steps faster, the main gain is memory.',
      ],
      terms: [
        { en: 'Rank (r)', si: 'The common inner dimension of the two LoRA matrices. Adapter capacity and size are determined.' },
        { en: 'lora_alpha', si: 'The hyperparameter that determines the scale of the LoRA update is α/r.' },
        { en: 'target_modules', si: 'The names of the layers that inject LoRA (q_proj, k_proj, v_proj, o_proj, gate_proj, up_proj, down_proj).' },
        { en: 'get_peft_model', si: 'The HF PEFT function that freezes the base model and adds adapters according to the config.' },
        { en: 'print_trainable_parameters', si: 'The method that shows the number of params being trained, the total number of params, and the percentage.' },
      ],
    },

    // 8
    {
      id: 'lora-merging-variants',
      si: 'ඔයාට adapter එකක් තියෙනවා නම් merge කිරීමෙන් එහි update එක base weights වලට එකතු කරලා inference වෙලාවේ වෙන්ව adapter එකක් ධාවනය කිරීම මඟහරින්න පුළුවන්. Merge කරන්නේ කුමන adapter ද සහ කුමන precision එකෙන්ද කියලා හොඳින් තීරණය කරන්න. LoRA variants වෙනස් factorization හෝ parameterization භාවිතා කළත්, ඔවුන්ගේ අරමුණ full fine-tuning ට වඩා අඩු trainable parameters සමඟ adaptation කිරීමයි. Adapter එක merge කළාට base model එකේ අවශ්‍යතාව අහෝසි වෙන්නේ නැහැ.',
      title: 'Merging LoRA (merge_and_unload), DoRA, rsLoRA, New Tokens & TIES-Merging',
      examRefs: ['TRN-015', 'TRN-102', 'TRN-136', 'TRN-137', 'TRN-139', 'TRN-145'],
      body: [
        'Merging: When the training is over, the adapter can be added to the base weights: W\' = W + (α/r)·B·A. After that, the architecture and size of the model are the same as the original base model. In Inference, there is no adapter overhead, no extra latency, just normal dense matmuls. The trade-off: after merging, the adapter cannot be swapped from request to request. If the adapters are kept separately, it will be possible to give customers different adapters (multi-LoRA serving) on ​​one base model. The model won\'t be shrunk and the context window won\'t get longer due to merging.',
        'From the code: PeftModel.from_pretrained(base_model, "./lora-adapter") → .merge_and_unload() → .save_pretrained("./merged"). merge_and_unload() calculates W + (α/r)·B·A for each adapted layer and removes PEFT wrappers. What remains is a normal transformers model. ./merged saves the complete model including LoRA updates (not a 4-bit quantized model). If you save the PeftModel without merging, only small adapter files will be saved.',
        'DoRA (Weight-Decomposed LoRA): Each weight is divided into two parts called magnitude (length) and direction (direction). The magnitude vector is trained directly, and a LoRA update is applied to the direction. Because of this, the learning dynamics is closer to full fine-tuning, and the accuracy is often higher at the same rank. Like LoRA, weights can be merged after training. rsLoRA (rank-stabilized LoRA): In standard α/r scaling, when r gets bigger, the update gets smaller, so there is no profit from high rank. rsLoRA uses α/√r. Then higher ranks will increase the actual results. use_rslora=True in HF PEFTs.',
        'Adding new tokens: After adding 500 new special tokens to the tokenizer and doing model.resize_token_embeddings(len(tokenizer)), new embedding rows will be initialized. But if only for LoRA attention projections, those new rows and LM head are frozen. The model cannot learn to understand or output new tokens. Solution: Make them trainable by adding modules_to_save=["embed_tokens", "lm_head"]. The Tokenizer does not need to be retrained from scratch.',
        'Model merging (TIES): Several fine-tuned models (e.g. code model, math model) can be made from the same base. "Task vector" = fine-tuned weights − base weights. The problem of simple averaging: small redundant changes and changes with opposite signs cancel each other out and useful changes are lost. TIES = Trim (remove small differences, keep only the biggest ones), Elect Sign (selects the majority sign for each parameter), Merge (averages only the values ​​that agree with that sign). No additional training is required. Neither making a MoE nor choosing only the best.',
      ],
      analogy:
        'LoRA adapter = a removable route board on the bus ("138 Maharagama"). Merge = paint the route board in the same body. Now you can\'t change the route quickly, but you don\'t need to hang a board. TIES = Three members of the family suggest the color to paint the house. Small proposals are discarded (trim), "green or blue" is decided by vote (elect sign), only the proposals of the winning side are mixed (merge).',
      example:
        'rsLoRA vs LoRA: α = 16. At r = 16, LoRA scale = 16/16 = 1, rsLoRA scale = 16/4 = 4. At r = 64, LoRA scale = 16/64 = 0.25 (the update shrinks), rsLoRA scale = 16/8 = 2. Therefore, increasing r in rsLoRA does not slow learning. TIES example: 3 model task vectors for one parameter +0.30, +0.20, −0.05. Trim leaves −0.05 (small). Elect sign = +. Merge = (0.30 + 0.20) ÷ 2 = 0.25. The simple average is (0.30 + 0.20 − 0.05) ÷ 3 = 0.15, minus the useful difference.',
      code: {
        lang: 'python',
        src: `from peft import PeftModel

#The base model + trained adapter is loaded
model = PeftModel.from_pretrained(base_model, "./lora-adapter")

#PEFT wrappers are removed by calculating W + (alpha/r) * B @ A
model = model.merge_and_unload()

#Now a normal full model is saved (not adapter files).
model.save_pretrained("./merged")`,
      },
      keyPoints: [
        'Merge = W + (α/r)BA. No latency overhead, but per-request swap is not possible.',
        'merge_and_unload() → plain transformers model. If you save without merging, only adapter.',
        'DoRA = magnitude + direction. rsLoRA = α/√r (use_rslora=True).',
        'If new tokens are modules_to_save=["embed_tokens","lm_head"].',
        'TIES = Trim, Elect Sign, Merge. No training required.',
      ],
      terms: [
        { en: 'merge_and_unload()', si: 'The PEFT method that folds LoRA updates base weights and removes PEFT wrappers.' },
        { en: 'Multi-LoRA Serving', si: 'Serving different adapters according to request on one base model.' },
        { en: 'DoRA', si: 'The method of separating the weight into magnitude and direction and adding LoRA to the direction.' },
        { en: 'rsLoRA', si: 'The LoRA variant allows you to learn high ranks consistently by doing α/√r scaling.' },
        { en: 'modules_to_save', si: 'The list of modules that are completely trainable and saved without LoRA.' },
        { en: 'Task Vector', si: 'Difference between fine-tuned weights and base weights.' },
      ],
    },

    // 9
    {
      id: 'qlora-nf4',
      si: 'ඔයාගේ 24 GB GPU එකට ලොකු model එක නොගැලපුණොත් QLoRA base weights 4-bit NF4 ලෙස ගබඩා කරලා, BF16 adapter එක train කරයි. 7B weights සඳහා සරල ගණනය 7 billion × 0.5 byte ≈ 3.5 GBයි; activations සහ optimizer memory සඳහාත් ඉඩ ඕනේ. Double quantization block scale අගයන් තවත් කුඩා කරනවා. Paged optimizer memory spike එකකදී CPU RAM භාවිතා කරන්න පුළුවන්, නමුත් compute dtype සහ storage dtype එකම දෙයක් නොවේ.',
      title: 'QLoRA: NF4, Double Quantization, Paged Optimizers, Compute Dtype',
      examRefs: ['TRN-016', 'TRN-017', 'TRN-061', 'TRN-072', 'TRN-103', 'TRN-104', 'TRN-105'],
      body: [
        'QLoRA = quantizing the frozen base model to 4-bit and training higher-precision (BF16) LoRA adapters on top of it. Base weights are stored as 4-bit NF4 and dequantized to BF16 at the time of calculation. Gradients backprop to LoRA adapters. This made it possible to fine-tune a 65B model with a 48 GB GPU. QLoRA is a fine-tuning memory technique. Not 4-bit pretraining from scratch, not adapter quantization for serving, not FP8 activations.',
        'Why NF4 (4-bit NormalFloat)? Pretrained weights are mostly located around 0 as a normal distribution (bell curve). Normal INT4 has 16 equally spaced levels. There are 16 levels of NF4 in the quantiles of the normal distribution: levels near 0, which have a lot of weights, and away from the fire. Therefore, the quantization error is less. NF4 is only a storage format: tensor cores do not directly matmul NF4, dequantize to BF16 before calculation.',
        'BitsAndBytesConfig settings: load_in_4bit=True (load 4-bit), bnb_4bit_quant_type="nf4" (storage format), bnb_4bit_use_double_quant=True, bnb_4bit_compute_dtype=torch.bfloat16 (dtype to dequantize to matmul). Storage format and compute dtype are two separate settings. Adapter checkpoint dtype or tokenizer is not determined by this.',
        'Double quantization: 64 weights are divided into blocks, each block has an FP32 scale constant. That\'s ~0.5 bits overhead per parameter (32 bits ÷ 64). In double quantization, those same constants are quantized to 8-bits, leaving ~0.37 bits per parameter. (Weights are not quantized twice. LoRA adapters are in BF16, because they are trained.) Paged optimizers: sudden memory spikes occur due to long sequences + gradient checkpointing. Using NVIDIA unified memory, the optimizer states are paged out to the CPU RAM and brought back to the GPU when needed, preventing OOM crashes. It is a single-GPU memory feature, it has nothing to do with multi-node communication.',
      ],
      analogy:
        'NF4 = You can put only 16 points on a stick to measure the height of the children in your class. Most children are between 150-165 cm and score close to that range, rare heights like 120 or 190 have one or two points. Paged optimizer = putting some books in the cupboard (CPU RAM) when there is no space on the table, and taking them back when needed.',
      example:
        'Memory: 7B × 0.5 bytes (4 bits) ≈ 3.5 GB (7 GB if 8-bit, 14 GB if BF16). 13B × 0.5 ≈ 6.5 GB, so a 24 GB GPU leaves room for LoRA adapters, their optimizer states, and activations. 13B full fine-tuning: 13B × 16 bytes ≈ 208 GB (~200 GB), not possible for a single 24 GB GPU. Gradient accumulation activation memory is reduced, but weights, gradients, optimizer memory is not reduced. So 13B + 24 GB = QLoRA. Double quant: 7B × 0.37 bits ≈ 2.6 billion bits ≈ 0.32 GB left.',
      code: {
        lang: 'python',
        src: `import torch
from transformers import BitsAndBytesConfig

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,                      #Load the base model in 4-bit
    bnb_4bit_quant_type="nf4",              #Storage format: NF4
    bnb_4bit_use_double_quant=True,         #Scale constants are also 8-bit
    bnb_4bit_compute_dtype=torch.bfloat16,  #Dequantize to BF16 for matmul
)`,
      },
      keyPoints: [
        'QLoRA = 4-bit NF4 frozen base + BF16 LoRA adapters. 65B on one 48 GB GPU.',
        'NF4 levels = normal distribution quantiles → error less than uniform INT4. Storage-only.',
        'compute_dtype = matmul dtype. quant_type = storage format.',
        'Double quant = quantize block constants (~0.37 bits/param left).',
        'Paged optimizers = paging into CPU RAM during spikes via unified memory.',
      ],
      terms: [
        { en: 'NF4 (4-bit NormalFloat)', si: 'A 4-bit storage format with 16 levels to match the normal distribution.' },
        { en: 'Double Quantization', si: 'Per-block quantization constants to quantize back to 8-bit.' },
        { en: 'Paged Optimizer', si: 'The way to avoid OOM spikes by paging the optimizer states between GPU and CPU memory.' },
        { en: 'Compute Dtype', si: 'The dtype that dequantizes to calculate quantized weights (eg BF16).' },
        { en: 'bitsandbytes', si: 'A Python library that provides 4-bit/8-bit quantization in QLoRA.' },
      ],
    },

    // 10
    {
      id: 'other-peft',
      si: 'ඔයා පොතක අගට කෙටි සටහන් එකතු කරනවා වගේ adapters සහ LoRA මගින් base weights නොවෙනස්ව තබා කුඩා කොටස් train කරනවා. Prompt tuning input එකට virtual token embeddings එකතු කර ඒවා train කරනවා. Prefix tuning transformer layers වල prefix representations එක් කරනවා. IA3 activations scale කරනවා, BitFit bias parameters වෙනස් කරනවා. මේ ක්‍රමවල memory සහ inference වියදම වෙනස්.',
      title: 'Other PEFT: Adapters, Prompt Tuning, Prefix Tuning, P-Tuning, IA3, BitFit',
      examRefs: ['TRN-018', 'TRN-019', 'TRN-020', 'TRN-021', 'TRN-106', 'TRN-107', 'TRN-108'],
      body: [
        'Adapter tuning (Houlsby et al.): A small bottleneck feed-forward module is inserted inside each transformer block: down-projection (eg 4,096 → 64) → nonlinearity → up-projection (64 → 4,096), with a residual connection. Freeze the original weights. Unlike LoRA, weights with adapters cannot be merged, so a little latency is added to the inference.',
        'Prompt tuning (soft prompting): Several continuous "virtual token" embeddings are added before the input sequence and only those are trained. They don\'t have to refer to actual words. The whole model freezes. (Finding a good prompt by manually changing the natural-language wording is prompt engineering, there is no gradient training.) Number of parameters = virtual tokens × hidden size. Lester et al.: Prompt tuning in small models is weaker than full fine-tuning, but as the model gets larger, the gap shrinks and becomes very small at ~10B+ parameters. Therefore, prompt tuning is most attractive for very large frozen models.',
        'Prefix tuning: trainable key/value prefix vectors are added not only to the input, but also to the attention of each transformer layer. Therefore, capacity is more than prompt tuning. Both are continuous vectors, both base weights freeze. P-tuning (NVIDIA NeMo supported): Virtual-token embeddings are generated with a small trainable prompt encoder (LSTM or MLP) instead of being learned directly. This reparameterization stabilizes the optimization. After training, encoder outputs can be cached as fixed virtual tokens. The base model always freezes.',
        'IA3 (Infused Adapter by Inhibiting and Amplifying Inner Activations): Learns (multiplies) small learned vectors that rescale keys, values, and feed-forward activations element-wise. There are very few parameters per layer, even less for LoRA. BitFit is also very lightweight, but it does not add new vectors, it only trains existing bias terms.',
      ],
      analogy:
        'The model is a Colombo-Kandy express train. Adapters = A small extra room is installed in each compartment (slows down the journey a bit). Prompt tuning = some labels are pasted only on the front of the train. Prefix tuning = Labels are pasted at the door of each compartment. P-tuning = Instead of drawing the labels by hand, they print them with a small printer (prompt encoder). IA3 = Only the fan speed knob is increased or decreased in each compartment.',
      example:
        'Prompt tuning: virtual tokens 20, hidden size 4,096 → 20 × 4,096 = 81,920 parameters. (327,680 if 80 tokens.) Compare with LoRA r = 8 q/v 32 layers = 4,194,304: prompt tuning ~50 times less. An adapter: 4,096 → 64 → 4,096 = 4,096×64 + 64×4,096 = 524,288 weights (without biases) per block.',
      keyPoints: [
        'Adapters = bottleneck FFN + residual. Unable to merge → latency.',
        'Prompt tuning = soft virtual tokens in the input. Params = tokens × hidden size.',
        'The prompt tuning gap is smaller in ~10B+ models (Lester et al.).',
        'Prefix tuning = K/V prefixes in every layer. P-tuning = prompt encoder (LSTM/MLP).',
        'IA3 = vectors that rescale activations. BitFit = biases only.',
      ],
      terms: [
        { en: 'Adapter (Houlsby)', si: 'A small trainable module that does down-project → nonlinearity → up-project inside a block.' },
        { en: 'Soft Prompt / Virtual Tokens', si: 'Train continuous embedding vectors. Not true words.' },
        { en: 'Prefix Tuning', si: 'Adding trainable prefixes to attention keys/values ​​in every layer.' },
        { en: 'P-Tuning', si: 'NeMo supports the method of generating virtual tokens with a prompt encoder.' },
        { en: 'IA3', si: 'Training only learned vectors that scale K, V, FFN activations element-wise.' },
        { en: 'BitFit', si: 'The PEFT method trains only the bias terms of the model.' },
      ],
    },

    // 11
    {
      id: 'rlhf-ppo',
      si: 'ඔයාගේ cricket පිළිතුරු දෙකෙන් වඩා හොඳ එක coach තෝරනවා කියලා සිතන්න; preference data-යෙන් reward model එක පුහුණු කර policy එක වැඩි reward ගන්න optimize කරනවා. PPO training එකේ reference model එකෙන් KL දුර සීමා කරන නිසා policy එක මුල් SFT හැසිරීමෙන් අතිශය ඈත් නොවේ. Reward එක වැඩි වුණාට පිළිතුරු ඇත්තටම හොඳ වෙනවා කියලා සහතික නැහැ. Reward model එකේ අඩුපාඩුව exploit කිරීම reward hacking ලෙස හඳුන්වනවා.',
      title: 'RLHF Deep Dive: Reward Model (Bradley-Terry), PPO Clipping, KL, Reward Hacking, RLAIF, Rejection Sampling',
      examRefs: ['TRN-023', 'TRN-024', 'TRN-025', 'TRN-027', 'TRN-028', 'TRN-029', 'TRN-077', 'TRN-078', 'TRN-111', 'TRN-113', 'TRN-115', 'TRN-117', 'TRN-148', 'TRN-149'],
      body: [
        'Classic RLHF order (InstructGPT): pretrained model → (1) SFT → (2) People rank the outputs of the SFT model and train a reward model from those preferences → (3) PPO optimizes the policy (LLM) for the reward. PPO cannot run without the reward model, because that is what gives the training signal to PPO. The reward model: the LM head of a pretrained or SFT transformer is removed and a linear head is placed that outputs one scalar. The hidden state of the last token of the prompt + response is mapped to a scalar reward. It is only a judge, it is the policy that generates the responses.',
        'Reward model loss (Bradley-Terry): For a pair of y_w (preferred) and y_l (rejected), P(y_w ≻ y_l) = σ(r_w − r_l). Loss = −log σ(r(x, y_w) − r(x, y_l)). σ = sigmoid, the function that shrinks between 0-1. What is important is the difference (margin) between the two rewards. Therefore, even if the same number is added to both, the loss will not change (shift-invariant). Does not do regression to absolute targets like ±1.',
        'PPO: The policy is updated from the rewards received from the reward model, but do not go too far in one update. ρ = π_θ / π_old (probability ratio of the new policy giving an action over the old one). Objective = min(ρ·A, clip(ρ, 1−ε, 1+ε)·A), A = advantage (how much better than average), ε ≈ 0.2. When ρ goes out of the range of 0.8-1.2, there is no more profit, so updates are conservative and stable on reuse rollouts. This is not reward clipping, gradient-norm clipping, or response length truncation. PPO-based RLHF has 4 networks in memory: policy (actor), value model (for critical, advantage calculation), frozen reference model (for KL), reward model. ඒ නිසා memory බරයි. DPO (policy + reference only) and critic-free methods came because of this. (Tokenizer is not a network.)',
        'KL penalty: β × KL(policy ‖ reference) is reduced from the reward. The policy is too far away from the fluent SFT distribution and stops exploiting the weaknesses of the reward model. The reward model will not be changed, nor will GPUs be reduced. With β = 0.5, the policy is exactly the same as SFT, if the reward does not increase → reduce β. But if you reduce too much, reward hacking. Reward hacking characteristic: the reward model score keeps increasing, but when people watch, the answers become long, repetitive, sycophantic. The policy exploits the bias in the reward model (eg preference for long answers). At this time, the KL coefficient is likely to be too low, not too much.',
        'Gao et al. (reward over-optimization): When optimized to a proxy reward model, measured with a "gold" reward model. As the KL distance increases, the gold score initially increases, then reaches a maximum and decreases, even as the proxy score continues to increase. This is Goodhart\'s law of RLHF: "When measurement is the goal, it is not a good measurement." Therefore, early stopping and monitoring are needed. Rejection sampling fine-tuning (Llama 2-Chat): K responses to a prompt are sampled, the one with the highest score is selected from the reward model, and fine-tuned is performed on those best samples (like best-of-K + SFT, expert iteration). RLAIF: Instead of human annotators, an AI model (according to written principles) gives preference labels. Constitutional AI: The model critiques and revises its outputs according to a list of principles ("constitution") (SFT data), then an AI judge gives preference labels according to those principles (RLAIF). Perplexity can\'t label preference, it doesn\'t measure whether an answer is useful.',
      ],
      analogy:
        'Reward model = a cricket selector. Policy = Batsman. If the selector only likes "sixes", the batsman starts hitting every ball (reward hacking), and the team doesn\'t really win. KL penalty = coach says "Don\'t stray too far from your original technique". PPO clipping = the rule of not changing the technique by more than 20% in one practice session.',
      example:
        'Bradley-Terry: r_w = 2.0, r_l = 0.5. Margin = 1.5. σ(1.5) ≈ 0.82. Loss = −ln(0.82) ≈ 0.20. If you add 10 to both (12.0, 10.5) the margin is still 1.5 and the loss is the same. PPO clip: ε = 0.2, A = +2 (good action). If ρ = 1.5 then unclipped = 3.0, clipped = 1.2 × 2 = 2.4, min = 2.4. Increasing ρ above 1.2 is not profitable, so the policy does not jump too much at once. Rejection sampling: K = 8 responses per prompt, rewards [0.2, 0.9, 0.4, ...] → 0.9 per SFT data.',
      keyPoints: [
        'RLHF = SFT → reward model (preferences) → PPO.',
        'Reward model = LM + scalar head, loss = −log σ(r_w − r_l), shift-invariant.',
        'PPO clip(ρ, 1−ε, 1+ε), ε ≈ 0.2 → conservative updates. 4 networks: actor, critic, reference, reward.',
        'If KL is high, the policy is stuck (decrease β). If KL is low, reward hacking (long, sycophantic).',
        'Gold score peaks and decreases (Goodhart). Rejection sampling = best-of-K + SFT. RLAIF/CAI = AI feedback.',
      ],
      terms: [
        { en: 'Bradley-Terry Model', si: 'The preference model where the probability of choosing one of a pair is written as σ(r_w − r_l).' },
        { en: 'Policy / Actor', si: 'Trained LLM. This is what generates responses.' },
        { en: 'Value Model / Critic', si: 'Calculate Advantage The PPO network that predicts the expected reward of a state.' },
        { en: 'Reference Model', si: 'Keep the frozen SFT model as the anchor for the KL penalty.' },
        { en: 'Reward Hacking', si: 'Exploiting the quirks of the reward model and getting points, without real quality.' },
        { en: 'Goodhart\'s Law', si: 'When a measure becomes a goal, it is no longer a good measure.' },
        { en: 'Rejection Sampling Fine-Tuning', si: 'Selecting the highest reward out of K number of responses and doing SFT on it.' },
      ],
    },

    // 12
    {
      id: 'dpo-family',
      si: 'ඔයාට එකම ප්‍රශ්නයට හොඳ පිළිතුරක් සහ නරක පිළිතුරක් තියෙනවා නම් DPO ඒවායෙන් policy එක කෙළින්ම පුහුණු කරයි. β වැඩි කළාම policy එක reference model එකට තදින් බැඳෙනවා. Pair නැති thumbs-up සහ thumbs-down ලේබල් සඳහා KTO ප්‍රයෝජනවත් විය හැකියි. GRPO එක output කණ්ඩායමක reward සාපේක්ෂව සසඳා value model එකක් නැතුව advantage හදනවා.',
      title: 'DPO, β, Implicit Reward, KTO, GRPO & NeMo-Aligner',
      examRefs: ['TRN-026', 'TRN-048', 'TRN-075', 'TRN-076', 'TRN-112', 'TRN-114', 'TRN-116'],
      body: [
        'DPO (Direct Preference Optimization) main idea: The RLHF objective (maximize reward, limit KL distance from reference) can be rewritten as a simple classification-style loss on chosen/rejected pairs. Therefore, there is no need for separate reward model training or online PPO rollouts (RL sampling loop). There is a frozen reference model as an anchor. But preference data is definitely needed.',
        'Data format: A record for tools like TRL DPOTrainer = {"prompt": ..., "chosen": ..., "rejected": ...}. A good one and a bad one at the same prompt. Single completion + scalar reward records like {"prompt", "completion", "reward": 0.82} fit reward-weighted or RL methods, not standard DPO.',
        'Implicit reward: The trained policy of the DPO implicitly defines a reward: r(x, y) = β · log(π_θ(y|x) / π_ref(y|x)) (except for a constant related to the prompt). That means "How much more probability does the policy give to this answer than the reference model". DPO loss = −log σ(β·[chosen log-ratio − rejected log-ratio]). If only log π_θ is taken, the reference anchor is lost and the two responses are not compared. β (usually ~0.1) is the implicit KL strength: if β is high, the policy is close to the reference, if β is low, it can be further away to match the preferences. Things like learning rate, LoRA rank, chosen/rejected ratio are not β.',
        'KTO (Kahneman-Tversky Optimization): If you only have thumbs-up / thumbs-down labels, if there are no pairs for the same prompt, KTO learns from those unpaired binary labels with a loss inspired by prospect theory. Standard DPO and Bradley-Terry reward modeling both require pairs. GRPO (Group Relative Policy Optimization, DeepSeek reasoning models): Removes the learned value model (critic). A group of outputs is sampled for the same prompt, the reward of each output is subtracted from the group mean and divided by the std to calculate the advantage. Critic has memory left. Rewards are still used, often verifiable rule-based rewards like answer correctness in math/code. NeMo-Aligner: NVIDIA toolkit designed to run reward model training, PPO-based RLHF, DPO, and SteerLM alignment methods in a distributed manner on NeMo/Megatron. NeMo Guardrails runtime rules only, weights are not changed.',
      ],
      analogy:
        'RLHF = Make a food tasting machine (reward model) and the chef prepares food for that machine. DPO = Without the machine, the chef learns directly from the pairs that say, "This kottu is better than that kottu", but without straying too far from the mother\'s original recipe (reference). β = how strongly attached to mother\'s recipe. KTO = No pair, just thumbs-up/down on customer comment card. GRPO = Checking whether the marks of the 4 children in the class are above or below the average, without a separate teacher (critic).',
      example:
        'DPO: β = 0.1. Chosen log-ratio (log π_θ − log π_ref) = +2, rejected = −1. Implicit rewards: 0.1 × 2 = 0.2 and 0.1 × (−1) = −0.1. Margin = 0.3. σ(0.3) ≈ 0.574. Loss = −ln(0.574) ≈ 0.56. Training increases margin and reduces loss. GRPO: 4 outputs per math question, rewards [1, 0, 1, 0] (correct = 1). Mean = 0.5, std = 0.5. Advantages = (1 − 0.5)/0.5 = +1 for right ones, (0 − 0.5)/0.5 = −1 for wrong ones.',
      keyPoints: [
        'DPO = direct optimization on preference pairs without reward model and RL loop.',
        'DPO record = prompt / chosen / rejected.',
        'Implicit reward = β · log(π_θ / π_ref). β ≈ 0.1 = KL strength.',
        'KTO = unpaired thumbs-up/down. GRPO = no critic, group-normalized rewards.',
        'NeMo-Aligner = RLHF (PPO), DPO, SteerLM, reward models at scale.',
      ],
      terms: [
        { en: 'DPO', si: 'Direct Preference Optimization: The method of directly training the policy on preference pairs.' },
        { en: 'Implicit Reward', si: 'The reward implicitly defined by the DPO policy is: β log(π_θ/π_ref).' },
        { en: 'β (DPO)', si: 'The implicit KL coefficient is how tightly the policy is bound to the reference.' },
        { en: 'KTO', si: 'A prospect-theory method that aligns unpaired desirable/undesirable labels.' },
        { en: 'GRPO', si: 'The RL method of normalizing the rewards of a group without a value model and making an advantage.' },
        { en: 'NeMo-Aligner', si: 'NVIDIA toolkit that runs alignment methods like PPO RLHF, DPO, SteerLM at scale.' },
        { en: 'SteerLM', si: 'NVIDIA alignment method that can control outputs according to attributes (like helpfulness).' },
      ],
    },

    // 13
    {
      id: 'lr-schedules-stability',
      si: 'ඔයා බස් එකක් හෙමින් වේගවත් කරලා ගමන අවසානයේ වේගය අඩු කරනවා වගේ learning rate එක warmup කරලා පසුව decay කළ හැකියි. Learning rate වැඩි නම් training අස්ථාවර වෙන්න පුළුවන්; ඉතා අඩු නම් ඉගෙනීම මන්දගාමී වෙනවා. Gradient clipping ලොකු gradients සීමා කරයි. Loss සහ validation metrics නිරීක්ෂණය කර schedule එක task එකට ගැළපෙනවාද බලන්න.',
      title: 'LR Warmup, Cosine & WSD Schedules, Gradient Clipping, Loss Spikes, Z-Loss, Checkpoints',
      examRefs: ['TRN-038', 'TRN-039', 'TRN-040', 'TRN-051', 'TRN-068', 'TRN-069', 'TRN-093', 'TRN-130', 'TRN-131'],
      body: [
        'Warmup: At the beginning of training, Adam optimizer\'s moment estimates (m, v) are noisy, gradients are large. At that time, if you start from the peak LR itself (eg 3e-4), divergence may occur in the first few hundred steps. Warmup = Increasing LR linearly from near 0 to peak in the first ~1-2k steps. Warmup_ratio = percentage of total steps to warmup. Decay schedule reduces LR at the end of training, not warmup. Increasing weight decay or eliminating end decay is not the solution to early divergence.',
        'Cosine decay: scheduler: CosineAnnealing, min_lr: 1e-5 After the warmup, the LR decreases from peak to 1e-5 in the shape of a half cosine wave: slow at first, fast in the middle, slow again at the end, and finally stops at the minimum. It only decreases once. (Cycling with restarts is SGDR, a separate variant.) WSD (Warmup-Stable-Decay): Since the cosine is tied to a fixed total step count, it is difficult to extend the run by adding tokens later. After the warmup of the WSD, the LR is kept constant (stable). A short decay (cooldown) phase runs only when a final model is needed. The run can be continued from any stable-phase checkpoint. If there is only constant LR without decay, the loss will stop at the top.',
        'Gradient clipping: torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0). If the total norm (length) of all gradients is greater than 1.0, then all gradients are crushed by the same ratio and the norm is 1.0. Big updates and loss spikes caused by exploding gradients are prevented. Clipping only crushes gradients, so vanishing gradients (already small) won\'t help. Not related to overfitting or memory.',
        'Loss spike: If the loss suddenly jumps from 2.1 to 7.5 in the middle of pretraining and does not come back, it is divergence. If you wait, the compute will be wasted. The standard method of PaLM and OPT reports: rollback to a checkpoint before the spike, skip data batches around the spike, reduce the LR if necessary and run again. Z-loss (PaLM): auxiliary loss ≈ 1e-4 · log²Z, Z = vocabulary-wide softmax normalizer. Pushing log Z closer to 0 stops the output logits from being drawn to large magnitudes, and increases numerical stability, especially in low precision. MoE load balancing loss is different, it works on router probabilities.',
        'Training checkpoints: Checkpoints are often saved in long jobs to resume after a node failure, evaluate intermediate models or rollback. Not only the weights of a checkpoint, optimizer state (Adam m, v), LR scheduler state, step count, data loader position (and RNG state) are saved. Otherwise, when you resume, Adam statistics will be lost, and the LR schedule will start from the beginning. This has nothing to do with gradient (activation) checkpointing: it is a memory technique, only the name is the same.',
      ],
      analogy:
        'Warmup = starting the car early in the morning and going slowly until the engine warms up, it does not go 100 km/h straight on Galle Road. Cosine decay = braking slowly while approaching the destination. WSD = Go at the same speed on the expressway, slow down only when you need to take an exit. If you want, you can continue without exiting. Gradient clipping = a speed governor. Checkpoint = the save point of a video game: if you die, you start from the last save, not from the beginning.',
      example:
        'Warmup: 50,000 total steps, warmup_ratio = 0.02 → 0.02 × 50,000 = 1,000 warmup steps (10,000 if misread as 0.2). If Peak LR is 3e-4 then LR ≈ 1.5e-4 at step 500. Clipping: total grad norm = 5.0, max_norm = 1.0 → Every gradient is multiplied by 1.0 ÷ 5.0 = 0.2. If Norm is 0.6, there is no difference. Loss spike: A spike at 120,000 steps. Go to Step 118,000 checkpoint, skip batches 118,000-120,500, reduce LR by 10% and run again.',
      keyPoints: [
        'Warmup = prevents unstable updates in the first steps. Warmup steps = ratio × total steps.',
        'Cosine = peak → min_lr once. WSD = stable phase + short decay when needed.',
        'clip_grad_norm_ = to exploding gradients. Vanishing does not help.',
        'Non-recovering spike → checkpoint rollback + bad batches skip + LR reduction.',
        'Z-loss = control of logits magnitudes. Training checkpoint = weights + optimizer + scheduler state.',
      ],
      terms: [
        { en: 'Warmup', si: 'At the beginning of training, increase the LR gradually to the peak.' },
        { en: 'Cosine Annealing', si: 'Reducing the LR to the shape of a half cosine wave to min_lr.' },
        { en: 'WSD Schedule', si: 'The LR schedule is Warmup → Stable (constant) → Decay (short cooldown).' },
        { en: 'Gradient Clipping', si: 'If the total gradient norm is greater than a threshold, the gradients scale down.' },
        { en: 'Z-Loss', si: 'The small auxiliary loss that is added to keep the log of the Softmax normalizer close to 0.' },
        { en: 'Training Checkpoint', si: 'Resume should save weights, optimizer state, scheduler state, step together.' },
      ],
    },

    // 14
    {
      id: 'mixed-precision-fp8',
      si: 'ඔයාට විශාල ගණන් ඉක්මනින් කරන්න ඕනේ නම් mixed precision අඩු bit ගණිතය භාවිතා කර memory සහ compute ඉතිරි කරයි. FP16 හි උපරිම අගය සීමා නිසා overflow හෝ underflow විය හැකි අතර loss scaling උදව් වේ. BF16 හි FP32 වැනි exponent range එකක් නිසා සාමාන්‍යයෙන් loss scaling අවශ්‍ය නැහැ. FP8 සඳහා format සහ scaling ක්‍රමය නිවැරදි hardware සහ software සමඟ තෝරන්න.',
      title: 'Mixed Precision: FP16 Loss Scaling, GradScaler, BF16 Autocast, FP8 & Transformer Engine',
      examRefs: ['TRN-032', 'TRN-033', 'TRN-034', 'TRN-035', 'TRN-067', 'TRN-090', 'TRN-091', 'TRN-092', 'TRN-118', 'TRN-119'],
      body: [
        'Mixed precision training: Many calculations like maths and activations are done in FP16 or BF16 (16-bit), to use Tensor Cores and save memory. But numerically sensitive parts (FP32 master weights, some reductions) are kept in FP32. Changing LR from layer to layer or INT8 weights is not related to this.',
        'FP16 = 1 sign bit, 5 exponent bits, 10 mantissa bits. Max value ~65,504. Because the exponent range is narrow, very small gradient values ​​become 0 underflow. Loss scaling: Before the backprop, the loss is multiplied by a large number (scale factor), then the gradients come into the FP16 range. Unscale again before the optimizer step. The problem is small values ​​(underflow). A loss of more than 1.0 is not a problem for FP16. BF16 = 1 sign, 8 exponent bits (same range as FP32), 7 mantissa bits (less precision than FP16). Memory is the same (both 16-bit). BF16 usually does not need loss scaling. A100/H100 has BF16 native support. Therefore, if loss = nan and overflow warnings appear in an FP16 run, the best solution is to switch to BF16. Increasing LR or removing clipping makes it worse.',
        'GradScaler (FP16 AMP): scaler.scale(loss).backward() → scaler.unscale_(optimizer) → clip_grad_norm_ → scaler.step(optimizer) → scaler.update(). After backward, the gradients are still multiplied by the scale factor. If you clip without unscale, the threshold will be applied to "inflated" values. Therefore unscale_ is mandatory before clipping. Dynamic loss scaling: If scaler.step() sees inf/NaN in the gradients, the optimizer step is skipped, and scaler.update() reduces the scale (usually by half). Clean steps will increase the scale again after a long text (default 2,000). An exception is not thrown, the checkpoint is not reloaded. Skipping rarely is normal, if it skips often it is a deep problem. GradScaler is usually not needed for BF16 autocast (torch.autocast("cuda", dtype=torch.bfloat16)), because BF16 range is similar to FP32, so underflow is rare.',
        'FP8 training: NVIDIA Transformer Engine (TE) library trains transformer layers in FP8 using Hopper (H100) FP8 Tensor Cores, NeMo and Megatron-LM use this. (A TensorRT inference optimizer, training loops do not run.) Two FP8 formats: E4M3 (exponent 4, mantissa 3, max ~448, high precision) and E5M2 (exponent 5, mantissa 2, max ~57,344, high range). TE "hybrid" recipe: forward pass activations and weights = E4M3, backward gradients = E5M2. (It is a common mistake to switch these two.) Delayed scaling: Because the FP8 range is very narrow, each tensor needs a scale factor. The TE keeps a history window of the absolute-maximum (amax) values ​​of the previous iterations, and calculates the next scale from it. No need to scan the tensor again before casting. "Current scaling" which is calculated from the exact max of the current tensor is more accurate, but an additional reduction is spent per tensor.',
      ],
      analogy:
        'FP16 = Small measuring stick, very fine marks, but short in length. Very small things (gradients) are smaller than the first mark on the stick, so they are read as "0". Loss scaling = that small thing is measured by magnifying 1,000 times with a microscope, and then dividing by 1,000 again. BF16 = The marks are a bit rough, but the rod is very long, so no microscope is needed. FP8 E4M3 vs E5M2 = Fine stick for forward, long stick for reverse (gradients, values ​​scattered).',
      example:
        'Let\'s say a gradient value of 1e-8. The smallest subnormal value of FP16 is ~6e-8, so 1e-8 → 0 (underflow). When the loss scale is multiplied by 1,024, gradient ≈ 1e-5 can be seen well in FP16. Divide by 1,024 before the optimizer step and return to 1e-8 (in FP32 master weights). Dynamic scaling: scale 65,536 → inf saw → step skip, scale 32,768. After 2,000 clean steps → 65,536 again. FP8: If the maximum of amax history of an activation is 10, E4M3 max 448 so scale ≈ 448 ÷ 10 ≈ 45 (practically with a margin).',
      code: {
        lang: 'python',
        src: `scaler = torch.cuda.amp.GradScaler()       #Only for FP16
for batch in loader:
    with torch.autocast("cuda", dtype=torch.float16):
        loss = model(**batch).loss
    scaler.scale(loss).backward()            #Make the loss bigger and backward
    scaler.unscale_(optimizer)               #to the actual value before clipping
    torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
    scaler.step(optimizer)                   #If inf/NaN, skip this step
    scaler.update()                          #Decreases/increases the scale
    optimizer.zero_grad()
#If BF16: dtype=torch.bfloat16, GradScaler is usually not needed`,
      },
      keyPoints: [
        'Mixed precision = 16-bit math + FP32 master weights.',
        'FP16: 5 exp / 10 mantissa, max ~65,504 → underflow → loss scaling. BF16: 8 exp / 7 mantissa → no scaling required.',
        'FP16 NaN/overflow on A100 → Switch to BF16.',
        'GradScaler: unscale_ before clipping. inf/NaN → step skip + scale down.',
        'FP8 (Transformer Engine): forward E4M3, gradients E5M2. Delayed scaling = amax history.',
      ],
      terms: [
        { en: 'Loss Scaling', si: 'Multiplying the loss by a large number before the backprop to prevent FP16 underflow.' },
        { en: 'GradScaler', si: 'The dynamic loss scaling class in PyTorch AMP.' },
        { en: 'Master Weights', si: 'FP32 weights copy that optimizer updates.' },
        { en: 'BF16 (bfloat16)', si: 'FP32 range (8 exponent bits), less precision 16-bit format.' },
        { en: 'E4M3 / E5M2', si: 'Two FP8 formats: E4M3 = precision (max 448), E5M2 = range (max 57,344).' },
        { en: 'Transformer Engine', si: 'NVIDIA library for FP8 training on Hopper GPUs, with automatic scaling.' },
        { en: 'amax', si: 'The absolute maximum value of a tensor. FP8 is used to calculate the scale factor.' },
      ],
    },

    // 15
    {
      id: 'batch-accumulation-recompute',
      si: 'ඔයාට එකවර බඩු දෙකක් විතරක් ගෙනියන්න පුළුවන් නම් වාර 8කින් බඩු එකතු කරලා අවසානයේ එකම බිල් එක ගෙවනවා වගේ gradient accumulation එකෙන් effective batch එක ලොකු කළ හැකියි. Micro-batch 4, accumulation 8 සහ GPU 8ක් නම් 4 × 8 × 8 = 256 sequences. Activation checkpointing memory ඉතිරි කිරීමට අතරමැදි අගයන් නැවත ගණනය කරන නිසා වැඩි compute යනවා. Loss එක මුළු token ගණනට සාමාන්‍යකරණය කිරීමත් වැදගත්.',
      title: 'Effective Batch Size, Gradient Accumulation, Loss Normalization & Activation Checkpointing',
      examRefs: ['TRN-036', 'TRN-037', 'TRN-058', 'TRN-059', 'TRN-066', 'TRN-089', 'TRN-129', 'TRN-146'],
      body: [
        'Gradient accumulation: Only 2 micro-batches are suitable for the GPU, but the recipe calls for a large batch. Solution: run several forward/backward passes, sum the gradients in .grad, and finally take one optimizer step. A large batch is simulated without increasing the memory. Effective (global) batch = micro-batch × accumulation steps × data-parallel GPUs. LLM batch sizes are often expressed in tokens: tokens per step = global batch × sequence length.',
        'Why is loss divided by accum_steps in accumulation? loss.backward() gradients are added to .grad. If not divided, the accumulated gradient is not an average, but a sum that increases with accum_steps. Then the effective LR also increases by that factor. After dividing, summed gradients = the average gradient of the big batch. This does not reduce memory, does not warmup, and does not help with FP16 underflow (the underflow may be a little worse because the values ​​are crushed). Token-level normalization bug: If an SFT trainer averages the per-token loss within each micro-batch, and then averages again through the accumulation steps, when the number of non-padded response tokens in the micro-batches changes, the "mean of means" is not the same as the global token mean. Unfair weighting of tokens in short micro-batches. The correct method: adding the token losses of all the accumulated micro-batches and dividing by the total number of tokens. This bug was found and fixed in popular trainers in 2024.',
        'Gradient (activation) checkpointing: Backward pass requires activations of forward pass. Usually all of them are kept in memory. During checkpointing, only some activations (eg layer boundaries) are saved, and others are recomputed when needed during backward. Activation memory is low, but compute is high. The results are mathematically the same, accuracy is not affected. Batch size is not changed either (it is accumulation). When model.gradient_checkpointing_enable() is done, steps are slowed down by about 20-35%. It\'s a memory-for-compute trade, never faster.',
        'Selective activation recomputation (Megatron-LM): Full checkpointing recomputes all layers. Selective recompute takes a lot of memory, but calculates only cheap attention parts (softmax outputs, attention dropout masks, attention scores). Attention score tensors increase with the square of the sequence length (seq²), but it takes a few FLOPs to rebuild them. Therefore, a lot of memory is saved and the compute overhead is small. Not NVMe offload or FP8 storage.',
      ],
      analogy:
        'Gradient accumulation = Because the trolley at Keells is small, the goods are taken 4 times, but the bill is paid only once at the end. Divide the loss by accum_steps = add the scores of 4 groups in the class and divide by 4 to get the average, or the "average" will be 4 times bigger. Activation checkpointing = not writing down all the notes for the exam, but writing only the chapter headings and recalculating from the book whenever needed. The bag is light, but takes a while.',
      example:
        'Effective batch: GPUs 8, micro-batch 4, gradient_accumulation_steps 8 → 4 × 8 × 8 = 256 sequences per optimizer step. (32 = only two factors.) Tokens: 256 × 4,096 = 1,048,576 ≈ 1.05M tokens per step. (4.2M requires seq 16K or batch 1,024.) Checkpointing cost: forward = 1 unit, backward ≈ 2 units → step = 3. Recompute = more forward 1 → 4. 4 ÷ 3 ≈ 1.33, which means ~33% slower. Normalization bug: micro-batch A response tokens 10, avg loss 2.0. B tokens 100, avg loss 1.0. Mean of means = (2.0 + 1.0) ÷ 2 = 1.5. Correct token mean = (10×2.0 + 100×1.0) ÷ 110 = 120 ÷ 110 ≈ 1.09. A\'s 10 tokens have got the same weight as B\'s 100 tokens.',
      code: {
        lang: 'python',
        src: `accum_steps = 8
for i, batch in enumerate(loader):
    loss = model(**batch).loss / accum_steps  #Make the sum an average
    loss.backward()                           #gradients are added to .grad
    if (i + 1) % accum_steps == 0:
        optimizer.step()                      #One update per 8 micro-batches
        optimizer.zero_grad()                 #.grad will be cleared for the next round`,
      },
      keyPoints: [
        'Global batch = micro-batch × accumulation steps × DP GPUs. Tokens/step = batch × seq len.',
        'Accumulation = large batch without memory. Loss ÷ accumulate_steps = average gradient.',
        'Variable token counts → token losses sum ÷ total tokens (mean of means is wrong).',
        'Activation checkpointing = activation memory ↓, compute ↑ (~33%, 20-35% slower). Accuracy is the same.',
        'Selective recompute = attention softmax/dropout only recompute → a lot of memory left, overhead is small.',
      ],
      terms: [
        { en: 'Micro-Batch', si: 'Number of examples per GPU per forward/backward pass.' },
        { en: 'Gradient Accumulation', si: 'Adding gradients of several micro-batches and taking one optimizer step.' },
        { en: 'Global / Effective Batch Size', si: 'The total number of examples contributing to one optimizer step.' },
        { en: 'Activation (Gradient) Checkpointing', si: 'Save only some of the activations and recompute the others in the backward.' },
        { en: 'Selective Activation Recomputation', si: 'Take a lot of memory and recompute only attention activations that can be calculated profitably.' },
      ],
    },

    // 16
    {
      id: 'memory-zero-data-parallel',
      si: 'ඔයාට GPUs කිහිපයක data කොටස් බෙදා දුන්නොත් data parallelism මගින් එකම model එක සමාන්තරව train කර gradients එකතු කරනවා. GPU memory යන්නේ weights, gradients, optimizer states සහ activations වලටයි. ZeRO optimizer state, gradients සහ parameters GPUs අතර shard කර memory අඩු කරයි. ඒත් පියවර අනුව communication වැඩි විය හැකි අතර model weights/activations වලට ඉඩ තවම අවශ්‍යයි.',
      title: 'Training Memory (16 Bytes/Param), Data Parallelism, All-Reduce, NCCL, ZeRO Stages & FSDP',
      examRefs: ['TRN-041', 'TRN-044', 'TRN-045', 'TRN-060', 'TRN-062', 'TRN-063', 'TRN-064', 'TRN-065', 'TRN-087', 'TRN-120', 'TRN-121', 'TRN-122', 'TRN-128'],
      body: [
        '16 bytes per parameter rule (mixed precision + Adam, without activations): BF16/FP16 weights 2 + 16-bit gradients 2 + FP32 master weights 4 + Adam first moment m 4 + second moment v 4 = 16 bytes. 12 bytes of that (master + m + v) FP32 optimizer part. These 12 bytes make ZeRO stage 1 shard. Adam states (m, v) alone are 8 bytes per parameter, often more than weights. Activations are not included in this rule, KV cache is an inference structure (not training memory).',
        'Data parallelism (DDP): A complete replica of the model on each GPU, a separate slice of the batch. Each GPU calculates gradients from its own data and averages the gradients with an all-reduce, so every copy is identical after the same update. PyTorch DDP overlaps this all-reduce with backward buckets. Broadcasting loss, activations all-to-all (that\'s MoE routing), gathering optimizer states to rank 0 are not relevant to this. NCCL (NVIDIA Collective Communications Library): The library that provides collectives such as topology-aware all-reduce, all-gather, reduce-scatter, broadcast via NVLink, PCIe, InfiniBand. The default GPU backend in PyTorch distributed. (Inference engines are compiled by TensorRT, jobs are scheduled by Kubernetes/Slurm.)',
        'Ring all-reduce: N number of GPUs in a ring. A reduce-scatter (each GPU sums a 1/N part of the buffer) + an all-gather (those parts are distributed to everyone). In each phase, a GPU sends (N−1)/N × S data. Therefore total = 2 × (N−1)/N × S. Even if N increases, the amount of data sent to a GPU remains constant at ~2S. (S × log₂N is a step count idea in tree algorithms.)',
        'ZeRO / FSDP: A full copy (redundancy) of weights, gradients, Adam states on all GPUs in Plain DP. ZeRO shards them between DP ranks and gathers the parts at the right moment. Stage 1 = optimizer states shard. Stage 2 = + gradients shard (reduce-scatter instead of all-reduce, communication volume same as normal DP). Stage 3 = + parameters shard. ZeRO-Offload = sending states to CPU memory (not a stage). PyTorch FSDP: FULL_SHARD ≈ ZeRO-3 (params, grads, optimizer states are sharded, just-in-time gathering of params forward/backward in each unit), SHARD_GRAD_OP ≈ ZeRO-2, NO_SHARD ≈ DDP. Activation recomputation is a separate technique that can be used in addition to ZeRO. ZeRO-3 communication: DP all-reduce ≈ 2Ψ (Ψ = model size) per GPU. ZeRO-3 = forward all-gather Ψ + backward all-gather Ψ + gradients reduce-scatter Ψ = 3Ψ, which means ~1.5×. It does not increase linearly with the number of GPUs.',
      ],
      analogy:
        'Data parallelism = 8 teachers to mark 8,000 exam papers, same marking scheme (model replica) for all, 1,000 papers each. At the end of the day, everyone suggests "let\'s change this place in the marking scheme" and generalize (all-reduce) and update in the same way. ZeRO = 8 pages of marking scheme are distributed to everyone, only one page for one person. When needed, he asks others and gives back. Ring all-reduce = sitting at a round table and everyone gives their share to the person on the right.',
      example:
        '7B full fine-tuning: 7B × 16 = 112 GB (14 GB is only BF16 weights, enough for inference). Adam states: 7B × 8 = 56 GB (28 GB = one moment). 7B, 8 GPUs: Stage 1 = weights 14 + grads 14 + (84 ÷ 8 = 10.5) = 38.5 GB/GPU. Stage 2 = 14 + (14 ÷ 8 = 1.75) + 10.5 = 26.25 GB. Stage 3 = 112 ÷ 8 = 14 GB. 70B ZeRO-3 on 64 GPUs: 70B × 16 = 1,120 GB ÷ 64 = 17.5 GB/GPU (140 GB is unsharded BF16 weights). Ring all-reduce: S = 1 GB, N = 8 → 2 × 7/8 × 1 = 1.75 GB is sent. N = 64 → 2 × 63/64 ≈ 1.97 GB.',
      keyPoints: [
        '16 B/param = 2 (weights) + 2 (grads) + 4 (master) + 4 (m) + 4 (v). Adam states = 8 B.',
        'DP = full replica + batch slice + gradients all-reduce (DDP).',
        'NCCL = GPU collectives (all-reduce, all-gather) over NVLink/IB.',
        'ZeRO-1 optimizer, ZeRO-2 + grads, ZeRO-3 + params. FSDP FULL_SHARD ≈ ZeRO-3, SHARD_GRAD_OP ≈ ZeRO-2.',
        'Ring all-reduce = 2(N−1)/N × S. ZeRO-3 comm ≈ 1.5× DP.',
      ],
      terms: [
        { en: 'All-Reduce', si: 'The collective that adds/averages the tensors of every GPU and gives the result to everyone.' },
        { en: 'Reduce-Scatter', si: 'The collective that collects Tensors and gives a separate part of the result to each GPU.' },
        { en: 'All-Gather', si: 'The collective that collects the parts of every GPU and gives the whole tensor to everyone.' },
        { en: 'NCCL', si: 'NVIDIA Collective Communications Library. The heart of multi-GPU communication.' },
        { en: 'ZeRO Stages 1/2/3', si: 'DeepSpeed ​​levels that shard optimizer states / + gradients / + parameters.' },
        { en: 'FSDP ShardingStrategy', si: 'FULL_SHARD (≈ZeRO-3), SHARD_GRAD_OP (≈ZeRO-2), NO_SHARD (≈DDP).' },
      ],
    },

    // 17
    {
      id: 'model-parallelism',
      si: 'ඔයාට විශාල කණ්ඩායම් වැඩක් බෙදනවා වගේ tensor parallelism එක layer එකක් GPUs අතර බෙදයි, pipeline parallelism layers වෙන්ව බෙදයි. Pipeline එකේ micro-batches ප්‍රමාණය අඩු නම් සමහර GPUs හිස්ව සිටින bubble එක ලොකු වෙනවා. Context parallelism දිග sequence එක බෙදයි, expert parallelism MoE experts බෙදයි. 64 GPUs, TP 8 සහ PP 2 නම් DP = 64 ÷ (8 × 2) = 4.',
      title: 'Tensor, Pipeline, Sequence, Context & Expert Parallelism: Megatron, Bubbles, 3D Arithmetic',
      examRefs: ['TRN-042', 'TRN-043', 'TRN-083', 'TRN-084', 'TRN-085', 'TRN-086', 'TRN-088', 'TRN-123', 'TRN-124', 'TRN-125', 'TRN-126', 'TRN-127', 'TRN-132'],
      body: [
        'Tensor parallelism (TP, intra-layer): The same weight matrix (e.g. columns of an MLP projection) is divided between GPUs, each GPU calculates a part of the same layer, and exchanges partial results collectives. Megatron-LM made this practical. Megatron MLP: Y = GeLU(X·A)·B. Cutting from A columns: Each GPU gets a full slice of hidden units, so GeLU can be applied locally (no sync needed). Cut from B rows: each GPU makes a partial sum, MLP adds them with an all-reduce at the end. We need an all-reduce that matches the input gradients of the backward pass. Because latency-sensitive collectives are performed several times per TP layer (both forward and backward), a very fast NVLink/NVSwitch is kept inside one node (eg 8 GPUs in DGX). Better on InfiniBand between nodes because Pipeline and data parallelism communicate less (IB fully supports NCCL collectives).',
        'Pipeline parallelism (PP, inter-layer): 80 layers are divided into stages like GPU 0 = 1-20, GPU 1 = 21-40 and flow micro-batches. GPUs idle at the beginning (fill) and at the end (drain) of a batch: this is bubble. Bubble fraction ≈ (p − 1) / (m + p − 1), p = stages, m = micro-batches. As m increases, the bubble shrinks. Increasing p increases the bubble. (p − 1)/m is the ratio of the bubble time to the ideal compute time, not the fraction of the total time. Interleaved 1F1B (Megatron): v number of non-contiguous layer chunks (virtual stages) for each GPU. The bubble decreases by ~v times, but the activations device boundaries jump v times more, so the point-to-point communication is more. Scheduling is just a difference, accuracy is not affected.',
        'Sequence & context parallelism: Megatron "sequence parallelism" (with TP): LayerNorm outside of TP split attention/MLP blocks, dropout activations are duplicated at every TP rank. Sequence parallelism is sharded by the sequence (token) dimension, all-reduce is replaced by reduce-scatter + all-gather, the communication volume is the same. Attention is exact, not approximation. Context parallelism: Even with 128K-token sequences, checkpointing, if the activations of one sequence do not fit on one GPU, the sequence dimension is divided between the same GPUs. Because data parallelism divides the batch, each GPU still has to keep one long sequence in its entirety. Ring attention: key/value blocks GPUs are sent around a ring, each GPU accumulates attention for its queries with online softmax, communication overlaps with compute. After N − 1 exchanges every query block has seen every K/V block, so exact. No GPU has K/V at the same time in the entire sequence.',
        'Expert parallelism (MoE): different experts on different GPUs. Tokens are sent by an all-to-all collective to the GPU with the expert selected by the router, and the results are returned. Cutting the matrices of a single expert is TP, both can be used together. MoE load-balancing loss: If the router sends too many tokens to several experts (routing collapse), other experts are undertrained, capacity overflow. The auxiliary loss encourages an equal distribution of tokens among experts, but does not equalize experts (specialization is the goal of MoE). 3D parallelism: Total GPUs = TP × PP × DP.',
      ],
      analogy:
        'A shop that makes 1,000 packets of rice and curry. Tensor parallelism = one rice in the same packet, curry another, often talking from the same table (NVLink). Pipeline = One divides rice, next one puts curry, next one packs. In the morning, until the first packet is finished, the person who packs is there (bubble). When a lot of packets come to the line, the idle time is relatively short. Expert parallelism = special orders: Kottu order to Kottu bass, Hopper order to Hopper sister (all-to-all). Load balancing = Stopping orders from piling up only for Kottu Bass.',
      example:
        '3D: 64 GPUs, TP = 8, PP = 2 → DP = 64 ÷ (8 × 2) = 4 replicas. (8 is the wrong answer if you divide only TP.) Bubble: p = 4, m = 12 → (4 − 1) ÷ (12 + 4 − 1) = 3 ÷ 15 = 20%. (3 ÷ 12 = 25% wrong formula.) If m = 48 then 3 ÷ 51 ≈ 6%. Interleaved v = 2: bubble-to-compute ratio from (p − 1)/m = 25% to approximately (p − 1)/(v·m) = 12.5%. Megatron MLP on TP = 4: A (4,096 × 16,384) columns 4,096 each per 4 GPUs, B (16,384 × 4,096) rows 4,096 each. Forward: One GPU X·A_i → GeLU → ·B_i, finally one all-reduce.',
      keyPoints: [
        'TP = cutting matrices, often collectives per layer → NVLink inside the node.',
        'Megatron MLP: A column-split (GeLU local), B row-split → one all-reduce in forward.',
        'Bubble = (p−1)/(m+p−1). m ↑ = bubble ↓. Interleaved = bubble ↓, P2P comm ↑.',
        'Sequence parallelism = shard from LayerNorm/dropout activations token dim. Context parallelism / ring attention = long sequences, exact.',
        'EP = between experts GPUs, all-to-all. Prevents load-balancing loss = routing collapse. GPUs = TP × PP × DP.',
      ],
      terms: [
        { en: 'Tensor Parallelism', si: 'Calculating the weight matrices of a single layer between GPUs.' },
        { en: 'Pipeline Bubble', si: 'During pipeline fill/drain, the stages are idle and wasted time.' },
        { en: '1F1B / Interleaved Schedule', si: 'A pipeline schedule that alternates between one forward and one backward. Multiple chunks per GPU in interleaved.' },
        { en: 'Sequence Parallelism (Megatron)', si: 'Sharding of activations in regions without TP by sequence dimension.' },
        { en: 'Context Parallelism / Ring Attention', si: 'Calculating exact attention by dividing the tokens of a long sequence between GPUs and sending them around a K/V ring.' },
        { en: 'Expert Parallelism', si: 'Placing MoE experts in different GPUs and routing tokens all-to-all.' },
        { en: 'Load-Balancing Loss', si: 'The auxiliary loss that encourages the router to divide the tokens equally among the experts.' },
      ],
    },

    // 18
    {
      id: 'scaling-compute-mfu',
      si: 'ඔයාගේ කණ්ඩායමට වැඩි orders ලැබුණොත් කාර්යය වේගවත් කරන්න වැඩි සේවකයන් පමණක් ප්‍රමාණවත් නැහැ; ඔවුන් අතර සම්බන්ධතාවත් බලපානවා. Model FLOPs utilization (MFU) මගින් throughput එක hardware peak එකට සාපේක්ෂව මනිනවා. 7B model එකක් token එකකට 6N FLOPs, ඒ කියන්නේ 42 billion FLOPs භාවිතා කරනවා. 10,000 tokens/s නම් 420 TFLOP/s; 989 TFLOP/s peak සමඟ MFU ≈ 42%.',
      title: 'Scaling Laws & Compute Math: Chinchilla, 6ND, MFU, Critical Batch Size',
      examRefs: ['TRN-052', 'TRN-133', 'TRN-134', 'TRN-147'],
      body: [
        'Chinchilla (Hoffmann et al.): Model size (parameters) and training tokens should be scaled together to get the best results for a fixed compute budget. Compute-optimal rule of thumb: ~20 tokens per parameter. Eg: 70B params → 1.4T tokens. Many modern models like Llama are trained with much more tokens, because inference is cheap when a small model is trained for a long time. But the "compute-optimal" answer is 20.',
        'Training compute: C ≈ 6 · N · D FLOPs. N = parameters, D = training tokens. why 6 Forward pass takes ~2 FLOPs per parameter per token (multiplication + addition), backward pass is twice as much as forward (~4). 2 + 4 = 6. If only 2ND is taken then only forward pass.',
        'MFU (Model FLOPs Utilization): The percentage of the GPU\'s peak FLOPS that your training is actually doing "useful" model FLOPs. Achieved FLOPS = 6 × N × tokens per second. MFU = achieved ÷ peak. MFU of 35-55% is normal in well-tuned big runs. (Additional work like Recompute is not counted towards MFU.)',
        'Critical batch size: If the number of optimizer steps is not reduced, the batch is larger than the critical batch size. After that point, increasing the samples per batch will only reduce the gradient noise, but the noise is no longer the bottleneck. When the batch is doubled below the critical size, the steps are reduced to half. At the top, returns are low, extra compute is wasted. That is not the reason because gradient accumulation creates a mathematically similar large batch.',
      ],
      analogy:
        'Chinchilla = A child preparing for A/L has a big brain (parameters), but if he doesn\'t read books (tokens), it doesn\'t matter. Even if you read a lot of books, if your brain is small, you cannot remember everything. Both should be balanced. Critical batch size = Faster when 2 people wash 10 cups in the kitchen. Even if it takes 20 people, it\'s not too fast, just a jam at the sink.',
      example:
        'Compute: 7B model, 2T tokens → 6 × 7×10⁹ × 2×10¹² = 84 × 10²¹ = 8.4 × 10²² FLOPs. (2ND = 2.8 × 10²².) MFU: 7B, H100 one tokens 10,000/s. Achieved = 6 × 7×10⁹ × 10⁴ = 4.2 × 10¹⁴ = 420 TFLOPS. Peak BF16 dense ≈ 989 TFLOPS. MFU = 420 ÷ 989 ≈ 42%. (21% wrong if 3N is taken.) Time: 1,000 H100 at 420 TFLOPS each → 4.2 × 10¹⁷ FLOP/s. 8.4 × 10²² ÷ 4.2 × 10¹⁷ = 2 × 10⁵ s ≈ 2.3 days. Chinchilla: 7B × 20 = 140B tokens compute-optimal. 2T means ~286 per parameter, "over-trained" to gain inference.',
      keyPoints: [
        'Chinchilla compute-optimal ≈ 20 tokens/param (70B ↔ 1.4T).',
        'C ≈ 6ND (forward 2ND + backward 4ND).',
        'MFU = 6 × N × tokens/s ÷ peak FLOPS. 35-55% is good.',
        'After the critical batch size is exceeded, increasing the batch does not reduce the steps.',
      ],
      terms: [
        { en: 'Chinchilla Scaling', si: 'Finding that params and tokens should be scaled together if Compute is fixed (≈20 tokens/param).' },
        { en: 'FLOPs', si: 'Floating-point operations. The unit of measurement of training compute.' },
        { en: 'MFU', si: 'Model FLOPs Utilization: The percentage of peak hardware FLOPS actually spent on the model.' },
        { en: 'Critical Batch Size', si: 'The limit where the training steps do not decrease significantly even if the batch is increased.' },
        { en: 'Gradient Noise', si: 'How much the gradient calculated in a small batch differs from the actual gradient.' },
      ],
    },

    // 19
    {
      id: 'nvidia-training-stack',
      si: 'ඔයාට training project එකක data cleaning සිට distributed run දක්වා විවිධ මෙවලම් ඕනේ. NeMo Curator data curation සඳහා, NeMo Framework training සහ scaling සඳහා, Transformer Engine supported hardware මත mixed precision සඳහා භාවිතා වේ. Megatron-LM විශාල transformer training සඳහා parallelism සපයයි. කාර්යයට ගැළපෙන NVIDIA documentation සහ නිශ්චිත software version බලලා තෝරන්න.',
      title: 'NVIDIA Training Stack: NeMo, Megatron-LM/Core, Curator, Aligner, Transformer Engine, NCCL',
      examRefs: ['TRN-046', 'TRN-047', 'TRN-006', 'TRN-035', 'TRN-045', 'TRN-048'],
      body: [
        'Exam "Which NVIDIA tool for this work?" Many questions like It\'s easy when you remember which phase of the LLM life cycle each tool belongs to: data → train → align → serve → guard.',
        'Data stage: NeMo Curator (data curation like dedup, filtering, language ID, PII redaction, on GPU). Train phase: NeMo framework = end-to-end generative AI framework covering pretraining, SFT, PEFT (LoRA, p-tuning), alignment, with Megatron-based distributed training. Megatron-LM / Megatron-Core = famous for tensor, pipeline, sequence parallelism, the library that can train hundreds of billions of params. NeMo is built on the Megatron-Core. Transformer Engine = FP8 training on Hopper/Blackwell GPUs. NCCL = collectives between GPUs.',
        'Align phase: NeMo-Aligner = reward model training, PPO RLHF, DPO, SteerLM. Serve phase: TensorRT-LLM (inference optimization), Triton Inference Server, NIM. Guard phase: NeMo Guardrails = runtime rules for conversations in a deployed model. Training data or weights are not changed. RAPIDS cuDF = GPU data frames (ETL), not Megatron. DALI = data loading/augmentation (mostly images).',
      ],
      analogy:
        'Like a hotel kitchen: NeMo Curator = the person who washes and cuts vegetables. NeMo + Megatron = main chefs and big stoves (GPU cluster). NeMo-Aligner = The one who tastes and prepares the recipe. TensorRT-LLM / Triton = waiters who bring food to the table quickly. NeMo Guardrails = security at the door, checking what comes in and what goes out, but doesn\'t cook.',
      example:
        'Scenario: "Dedupe a multi-terabyte web corpus on a GPU" → NeMo Curator. "Pretrain + LoRA + DPO in one framework" → NeMo framework. "Tensor/pipeline parallelism library" → Megatron-LM. "PPO in RLHF and SteerLM scale" → NeMo-Aligner. "H100 FP8 training" → Transformer Engine. "All-reduce over InfiniBand" → NCCL. "Topic restrictions for production chatbot" → NeMo Guardrails. "Reduce the inference latency of the model after training" → TensorRT-LLM.',
      keyPoints: [
        'NeMo Curator = data. NeMo framework = train/customize. Megatron-Core = parallelism engine.',
        'NeMo-Aligner = RLHF/DPO/SteerLM. Transformer Engine = FP8.',
        'NCCL = collectives. TensorRT-LLM / Triton / NIM = inference.',
        'NeMo Guardrails = runtime, weights are not changed.',
      ],
      terms: [
        { en: 'NeMo Framework', si: 'The NVIDIA end-to-end framework that pretrains, fine-tunes and aligns Generative AI models.' },
        { en: 'Megatron-Core', si: 'Megatron-LM\'s parallelism techniques as a reusable library. NeMo uses this.' },
        { en: 'NeMo Guardrails', si: 'The toolkit that adds runtime safety/topic rules to the conversations of a deployed LLM.' },
        { en: 'TensorRT-LLM', si: 'The inference library that optimizes trained LLMs to run faster on NVIDIA GPUs.' },
      ],
    },

    // 20
    {
      id: 'colab-lora-handson',
      si: 'ඔයාට Sinhala customer support bot එකක් හදන්න examples 500ක් තියෙනවා කියලා හිතන්න. 0.5B model එක 4-bit කළාම base weights 0.25 GBක් පමණ වන නිසා T4 GPU එකේ fine-tuning සඳහා ඉඩ ඉතුරු වෙනවා. Batch 16 නම් epoch එකකට 500 ÷ 16 ≈ 32 steps, epochs 2කදී steps 64ක් පමණ. Validation loss සහ සාමාන්‍ය ප්‍රශ්නවලට පිළිතුරු පරීක්ෂා කර overfitting සහ forgetting දෙකම බලන්න.',
      title: 'Hands-On (Beyond Exam): Let\'s fine-tune a small open model in Google Colab with QLoRA',
      examRefs: ['TRN-056', 'TRN-058', 'TRN-102', 'TRN-105'],
      body: [
        'Now you know the theory well. When you actually do it, the meaning deepens. A small open model (e.g. a 0.5B-1.5B model like Qwen2.5-0.5B-Instruct) can be fine-tuned by QLoRA with a free T4 GPU (16 GB) from Google Colab. Steps: (1) Runtime → Change runtime type → T4 GPU. (2) Install transformers, peft, trl, datasets, bitsandbytes, accelerate. (3) Create your data as a JSONL file: {"messages": [{"role": "user", ...}, {"role": "assistant", ...}]} in each line. Even 200-1,000 examples will teach format/style (remember LIMA?).',
        '(4) Load the model with 4-bit NF4. T4 (Turing) GPU does not have BF16 native support, so set the compute dtype to FP16. BF16 if A100/H100/L4. (5) LoraConfig: r = 16, alpha = 32, target_modules = "all-linear" (found in the QLoRA paper). (6) Train with SFTTrainer: micro-batch 2 × accumulation 8 = effective batch 16. LoRA LR 2e-4. TRL uses the chat template in the model, use the same template in inference. (7) Save the adapter, test it, and merge_and_unload() with a full-precision base if needed.',
        'Be careful: the transformers / trl / peft APIs change a bit between versions (eg the name of the argument given by the tokenizer). If an error occurs, see the docs related to the version of the library. Keep a validation set and look at the validation loss: if it starts to increase, it is overfitting. When the training is over, ask the model some "new" questions and see if there is any forgetting.',
      ],
      analogy:
        'Even if you pass the theory exam for driving license, you don\'t really understand driving until you drive the car on the road. Colab = a free practice field. A small model = a small car to practice, not a lorry.',
      example:
        'A Sinhala customer support bot: 500 examples (user question + good Sinhala answer). The 0.5B model is only 4-bit ≈ 0.25 GB, T4 has plenty of space. Effective batch 16 → 500 steps per epoch ÷ 16 ≈ 32. Epochs 2 → steps ~64. LoRA params (all-linear, r = 16) are about 2% of the total model. Finished in minutes at T4. Adapter folder is not hundreds of MB, but only tens of MB.',
      code: {
        lang: 'python',
        src: `# !pip install -q transformers peft trl datasets bitsandbytes accelerate
import torch
from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
from peft import LoraConfig
from trl import SFTTrainer, SFTConfig

name = "Qwen/Qwen2.5-0.5B-Instruct"   #A small open model
bnb = BitsAndBytesConfig(load_in_4bit=True, bnb_4bit_quant_type="nf4",
                         bnb_4bit_compute_dtype=torch.float16)  #FP16 due to T4
model = AutoModelForCausalLM.from_pretrained(name, quantization_config=bnb, device_map="auto")
tok = AutoTokenizer.from_pretrained(name)
data = load_dataset("json", data_files="my_data.jsonl")["train"]  #The "messages" field
lora = LoraConfig(r=16, lora_alpha=32, target_modules="all-linear", task_type="CAUSAL_LM")
args = SFTConfig(output_dir="out", per_device_train_batch_size=2, gradient_accumulation_steps=8,
                 learning_rate=2e-4, num_train_epochs=2, fp16=True, logging_steps=10)
trainer = SFTTrainer(model=model, args=args, train_dataset=data, peft_config=lora, processing_class=tok)
trainer.train()
trainer.save_model("my-lora")   #Only the adapter is saved.`,
      },
      keyPoints: [
        'Colab T4 + 4-bit NF4 + LoRA = small models can be fine-tuned for free.',
        'No BF16 in T4 → FP16 compute dtype. BF16 if A100/H100/L4.',
        'Data = chat "messages" JSONL. Training and inference are the same chat template.',
        'See validation loss (overfitting), ask general questions (forgetting).',
      ],
      terms: [
        { en: 'Google Colab', si: 'Google service that allows you to run Python notebooks with GPU for free from the browser.' },
        { en: 'TRL SFTTrainer', si: 'Hugging Face is a class in the TRL library that makes SFT (and PEFT) training easy.' },
        { en: 'JSONL', si: 'The file format where each line has a separate JSON object.' },
        { en: 'all-linear', si: 'The PEFT shortcut to put LoRA on every linear layer of transformer blocks.' },
      ],
    },
  ],

  quiz: [
    {
      q: 'With 8 data-parallel GPUs, a per-GPU micro-batch of 4, and 8 gradient accumulation steps, what is the effective global batch size?',
      options: ['32', '64', '128', '256'],
      answer: 3,
      why: 'Global batch = micro-batch × accumulation steps × DP GPUs = 4 × 8 × 8 = 256. 32 multiplies only two of the factors.',
    },
    {
      q: 'For LoRA rank r = 8 on one 4,096 × 4,096 matrix, how many parameters are trainable?',
      options: ['32,768', '65,536', '131,072', '16,777,216'],
      answer: 1,
      why: 'r × (d + k) = 8 × (4,096 + 4,096) = 65,536. 32,768 counts only A or B; 16,777,216 is the frozen W matrix.',
    },
    {
      q: 'With 4 pipeline stages and 12 micro-batches, what is the bubble fraction using (p − 1)/(m + p − 1)?',
      options: ['8%', '20%', '25%', '33%'],
      answer: 1,
      why: '(4 − 1) ÷ (12 + 4 − 1) = 3 ÷ 15 = 20%. The incorrect formula (p − 1)/m gives 25%.',
    },
    {
      q: 'An FP16 fine-tuning run on an A100 repeatedly reports loss = nan and overflow warnings. What is the best fix?',
      options: ['Increase the learning rate', 'Switch to BF16 mixed precision', 'Remove gradient clipping', 'Increase the LoRA rank'],
      answer: 1,
      why: 'BF16 has an 8-bit exponent range like FP32 and can represent values beyond FP16’s ~65,504 limit. The A100 natively supports BF16.',
    },
    {
      q: 'During PPO training, the reward-model score keeps rising, but answers become long, repetitive, and sycophantic. What is happening?',
      options: ['The SFT model is undertrained', 'The KL coefficient is too large', 'The policy is exploiting reward-model bias (reward hacking)', 'The tokenizer is truncating outputs'],
      answer: 2,
      why: 'A reward model is an imperfect proxy. Over-optimization can exploit quirks such as answer length. A larger KL penalty keeps the policy closer to the SFT model and reduces this drift.',
    },
    {
      q: 'A job uses 64 GPUs, TP = 8, and PP = 2. What is the data-parallel size?',
      options: ['2', '4', '8', '16'],
      answer: 1,
      why: 'GPUs = TP × PP × DP, so DP = 64 ÷ (8 × 2) = 4.',
    },
    {
      q: 'Exact SHA-256 hashing misses documents that differ only by a timestamp. What is commonly used to find near-duplicates at scale?',
      options: ['MinHash + LSH', 'Byte-pair encoding', 'TF-IDF keyword extraction', 'Hash the document twice with SHA-256'],
      answer: 0,
      why: 'MinHash estimates Jaccard similarity between n-gram sets, and LSH places similar signatures in the same bucket. NeMo Curator can perform this on GPUs.',
    },
    {
      q: 'During continued pretraining, loss on the original distribution rises (forgetting). What do studies recommend?',
      options: ['Keep the old minimum learning rate and use only new data', 'Reset the optimizer and use 10× the peak learning rate', 'Re-warm and re-decay, while replaying a small share of original pretraining data', 'Freeze all attention layers'],
      answer: 2,
      why: 'Re-warming helps the model learn the new domain but can cause forgetting. Replaying a few percent of the original data reduces it (Ibrahim et al., 2024).',
    },
    {
      q: 'When using an FP16 GradScaler, what must be done before calling clip_grad_norm_?',
      options: ['scaler.update()', 'optimizer.zero_grad()', 'scaler.unscale_(optimizer)', 'Convert the model to FP32'],
      answer: 2,
      why: 'After backward, gradients are still multiplied by the loss scale. Clipping before unscaling applies the threshold to inflated values. zero_grad() clears gradients.',
    },
    {
      q: 'A 7B model processes 10,000 tokens/s on an H100. With 6N FLOPs/token and ~989 TFLOPS peak, what is the approximate MFU?',
      options: ['7%', '21%', '42%', '85%'],
      answer: 2,
      why: '6 × 7×10⁹ × 10⁴ = 4.2 × 10¹⁴ FLOP/s = 420 TFLOPS. 420 ÷ 989 ≈ 42%. Using 3N instead would give 21%.',
    },
  ],
}
