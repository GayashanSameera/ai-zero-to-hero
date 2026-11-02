export default {
  id: 'nlp',
  number: 4,
  title: 'Natural Language Processing',
  titleSi: 'Natural Language Processing: මිනිස් භාෂාව තේරුම් ගන්න computer',
  summary: 'NLP කියන්නේ computers වලට මිනිස් භාෂාව කියවන්න, තේරුම් ගන්න සහ ලියන්න උගන්වන AI ක්ෂේත්‍රය. Text එක අංක බවට හරවන හැටි, වචන වල තේරුම vectors වලින් අල්ලගන්න හැටි, සහ sentiment analysis, translation වගේ වැඩ කරන හැටි මේ phase එකෙන් ඉගෙන ගන්නවා. LLMs තේරුම් ගන්න කලින් ඕනේ පදනම මේකයි.',
  duration: 'සති 4-5',
  topics: [
    {
      id: 'what-is-nlp',
      title: 'What is NLP?',
      body: [
        'NLP (Natural Language Processing) කියන්නේ computers වලට මිනිස්සු කතා කරන, ලියන භාෂාව (natural language) එක්ක වැඩ කරන්න උගන්වන එක. Python, Java වගේ programming languages වල නීති පැහැදිලියි. ඒත් සිංහල, ඉංග්‍රීසි වගේ භාෂා අපැහැදිලි, නීති කැඩෙනවා, එකම වචනයට තේරුම් කීපයක් තියෙනවා.',
        'Computer එකකට තේරෙන්නේ අංක විතරයි. ඉතින් NLP වල මූලික අභියෝගය text එක තේරුම නැති නොවෙන විදිහට අංක බවට හරවන එක. මුලදී මේකට වචන ගණන් කරන සරල ක්‍රම (Bag of Words, TF-IDF) පාවිච්චි කළා. ඊට පස්සේ word embeddings ආවා. අද Transformers සහ LLMs තියෙනවා.',
        'NLP අපි හැමදාම පාවිච්චි කරනවා: Google Translate, Gmail එකේ spam filter එක, phone keyboard එකේ ඊළඟ වචනය යෝජනා කරන එක, Siri / Google Assistant, ChatGPT සහ Claude. Customer reviews කියවලා සතුටුද නැද්ද කියලා හොයන එකත් NLP.',
      ],
      analogy: 'NLP හිතන්න ලංකාවට අලුතින් ආපු විදේශිකයෙක් සිංහල ඉගෙන ගන්නවා වගේ. "කෑවද?" කියලා ඇහුවාම ඒක ඇත්තටම කෑම ගැන ප්‍රශ්නයක් නෙවෙයි, ආචාරයක් කියලා තේරුම් ගන්න වචන දැනගත්තාට මදි. Context එක, සංස්කෘතිය, කියන විදිහ තේරෙන්න ඕනේ. Computer එකටත් ඒ ප්‍රශ්නයමයි.',
      example: '"මම bank එකට ගියා" සහ "ගඟේ bank එක ළඟ වාඩි වුණා" කියන වාක්‍ය දෙකේම "bank" කියන වචනය තියෙනවා. පළමු එකේ තේරුම මුදල් බැංකුව, දෙවෙනි එකේ ගං ඉවුර. හොඳ NLP system එකකට වටේ තියෙන වචන (context) බලලා මේ වෙනස තේරුම් ගන්න ඕනේ.',
      keyPoints: [
        'NLP = computers වලට මිනිස් භාෂාව එක්ක වැඩ කරන්න උගන්වන ක්ෂේත්‍රය.',
        'ප්‍රධාන අභියෝගය: text එක තේරුම නැති නොවී අංක බවට හරවන එක.',
        'මිනිස් භාෂාව අපැහැදිලියි (ambiguous). Context එක ගොඩක් වැදගත්.',
        'ගණන් කිරීම් → embeddings → Transformers / LLMs කියන ගමන තමයි NLP ඉතිහාසය.',
      ],
      terms: [
        { en: 'NLP (Natural Language Processing)', si: 'Computers වලට මිනිස් භාෂාව කියවන්න, තේරුම් ගන්න, නිර්මාණය කරන්න උගන්වන AI ක්ෂේත්‍රය.' },
        { en: 'Natural Language', si: 'සිංහල, ඉංග්‍රීසි වගේ මිනිස්සු ස්වභාවිකව පාවිච්චි කරන භාෂා.' },
        { en: 'Corpus', si: 'NLP model එකක් train කරන්න පාවිච්චි කරන ලොකු text එකතුව.' },
        { en: 'Ambiguity', si: 'එකම වචනයකට හෝ වාක්‍යයකට තේරුම් කීපයක් තිබීම.' },
      ],
    },
    {
      id: 'text-preprocessing',
      title: 'Text Preprocessing: Tokenization, Stemming, Lemmatization & Stopwords',
      body: [
        'Text එකක් model එකකට දෙන්න කලින් ඒක පිරිසිදු කරලා සකස් කරනවා. මේකට කියන්නේ preprocessing කියලා. සාමාන්‍ය පියවර: අකුරු lowercase කරනවා, විරාම ලකුණු අයින් කරනවා, tokenize කරනවා, stopwords අයින් කරනවා, වචන මූල ස්වරූපයට ගේනවා.',
        'Tokenization කියන්නේ text එක පොඩි කොටස් (tokens) වලට කඩන එක. සරලම ක්‍රමය හිස්තැන් (spaces) අනුව වචන වලට කඩන එක. "I love kottu!" → ["I", "love", "kottu", "!"]. නවීන LLMs පාවිච්චි කරන්නේ subword tokenization: "unhappiness" → ["un", "happi", "ness"] වගේ කොටස් වලට කඩනවා. ඒ නිසා කලින් දැකලා නැති වචනත් හසුරවන්න පුළුවන්.',
        'Stopwords කියන්නේ "the", "is", "a", "and" වගේ ගොඩක් පාරක් එන, ඒත් තනියම වැඩි තේරුමක් නැති වචන. සමහර වැඩ වලදී ඒවා අයින් කරනවා. ඒත් ප්‍රවේශම් වෙන්න: "not" අයින් කළොත් "not good" කියන එක "good" වෙනවා, sentiment එකම පෙරළෙනවා.',
        'Stemming සහ lemmatization දෙකම වචනයක විවිධ ස්වරූප එකම මූලයකට ගේනවා. Stemming එක නීති වලින් වචනයේ අගින් කොටස් කපනවා. වේගවත්, ඒත් සමහර වෙලාවට ඇත්ත වචනයක් නොවන දෙයක් එනවා: "studies" → "studi". Lemmatization එක dictionary එකක් සහ grammar එක පාවිච්චි කරලා නිවැරදි මූල වචනය (lemma) දෙනවා: "studies" → "study", "better" → "good" (adjective එකක් කියලා දුන්නොත්). හෙමින්, ඒත් නිවැරදියි.',
      ],
      analogy: 'කොත්තු එකක් හදන්න කලින් එළවළු සෝදලා, පොතු අරිනවා, කපනවා. කෙළින්ම ගෙනාපු කැරට් එකක් තාච්චියට දාන්නේ නෑ. Preprocessing කියන්නේ text එකට කරන ඒ "සෝදලා කපන" වැඩේ. Tokenization = කපන එක. Stopwords අයින් කිරීම = අනවශ්‍ය පොතු අයින් කිරීම. Lemmatization = එක එක හැඩේට කපපු කැරට් කෑලි ඔක්කොම "කැරට්" කියලා හඳුනගැනීම.',
      example: 'Review එක: "The rooms were amazing and the staff were helping us!" Lowercase සහ tokenize: ["the", "rooms", "were", "amazing", "and", "the", "staff", "were", "helping", "us"]. Stopwords අයින් කළාම: ["rooms", "amazing", "staff", "helping"]. Lemmatize කළාම: ["room", "amazing", "staff", "help"]. Tokens 10ක් 4ක් වුණා, ඒත් ප්‍රධාන තේරුම තියෙනවා.',
      code: {
        lang: 'python',
        src: `from nltk.stem import PorterStemmer, WordNetLemmatizer
# පළමු වතාවට: import nltk; nltk.download('wordnet')
stem = PorterStemmer()
lem = WordNetLemmatizer()
for w in ['studies', 'running', 'better']:
    print(w, '->', stem.stem(w), '|', lem.lemmatize(w, pos='v'))
# studies -> studi | study      (stemmer එක අග කපනවා)
# running -> run   | run
print(lem.lemmatize('better', pos='a'))  # good  (adjective කියලා කිව්වාම)`,
      },
      keyPoints: [
        'Tokenization = text එක tokens වලට කැඩීම. LLMs subword tokens පාවිච්චි කරනවා.',
        'Stopwords = තේරුම අඩු පොදු වචන. ඒත් "not" වගේ වචන අයින් කරනකොට ප්‍රවේශම් වෙන්න.',
        'Stemming = නීති වලින් අග කපනවා, වේගවත් ඒත් රළුයි.',
        'Lemmatization = dictionary එකෙන් නිවැරදි මූල වචනය දෙනවා.',
      ],
      terms: [
        { en: 'Tokenization', si: 'Text එක වචන, subwords හෝ අකුරු වගේ tokens වලට කැඩීම.' },
        { en: 'Token', si: 'Model එක දකින text එකේ පොඩිම කොටස.' },
        { en: 'Subword Tokenization', si: 'වචන නිතර එන කොටස් වලට කඩන ක්‍රමය (උදා: BPE). නොදන්න වචනත් හසුරවන්න පුළුවන්.' },
        { en: 'Stopwords', si: '"the", "is", "and" වගේ නිතර එන, තනියම වැඩි තේරුමක් නැති වචන.' },
        { en: 'Stemming', si: 'නීති වලින් වචනයේ අග කපලා මූලයක් හදන රළු ක්‍රමය.' },
        { en: 'Lemmatization', si: 'Dictionary සහ grammar පාවිච්චි කරලා වචනයේ නිවැරදි මූල ස්වරූපය (lemma) හොයන ක්‍රමය.' },
        { en: 'Normalization (Text)', si: 'Lowercase කිරීම, විරාම ලකුණු අයින් කිරීම වගේ text එක සම්මත කරන පියවර.' },
      ],
    },
    {
      id: 'bow-tfidf',
      title: 'Bag of Words, TF-IDF & N-grams',
      body: [
        'Bag of Words (BoW) කියන්නේ text එකක් අංක බවට හරවන සරලම ක්‍රමය. මුලින්ම මුළු dataset එකේම තියෙන හැම වචනයකම ලැයිස්තුවක් (vocabulary) හදනවා. ඊට පස්සේ හැම document එකකටම, ඒ හැම වචනයක්ම කී පාරක් ආවද කියලා ගණන් කරනවා. වචන වල අනුපිළිවෙළ සම්පූර්ණයෙන්ම නැති වෙනවා, බෑගයකට දාලා සොලවලා වගේ.',
        'BoW එකේ ප්‍රශ්නය "the", "is" වගේ හැම තැනම එන වචන වලට ලොකු ගණනක් එන එක. TF-IDF (Term Frequency - Inverse Document Frequency) එක මේක විසඳනවා. TF කියන්නේ මේ document එකේ වචනය කොච්චර නිතර එනවාද කියන එක. IDF කියන්නේ මුළු documents අතරින් ඒ වචනය කොච්චර දුර්ලභද කියන එක. හැම document එකකම එන වචනයකට IDF එක 0ට ළඟයි. ටික documents වල විතරක් එන වචනයකට IDF එක වැඩියි. TF × IDF = ඒ document එකට විශේෂ, වැදගත් වචන වලට ලොකු ලකුණක්.',
        'N-grams කියන්නේ එකට එන වචන n ගාණක කණ්ඩායම්. Unigram = එක වචනයක් ("good"). Bigram = වචන දෙකක් ("not good"). Trigram = වචන තුනක් ("New York City"). BoW එකට bigrams එකතු කළාම "not good" සහ "good" වෙන් කරලා හඳුනගන්න පුළුවන්, ඒ නිසා අනුපිළිවෙළෙන් පොඩි කොටසක් ආයෙත් ලැබෙනවා.',
        'මේ ක්‍රම වල අඩුපාඩුව: "හොඳ" සහ "නියමයි" කියන වචන දෙක තේරුමෙන් ළඟ වුණත්, BoW / TF-IDF වලට ඒ දෙක සම්පූර්ණයෙන්ම වෙනස් columns දෙකක්. වචන වල තේරුම අල්ලගන්න බෑ. ඒත් spam filters, search, සරල text classification වලට තාමත් වේගවත් සහ හොඳ baseline එකක්.',
      ],
      analogy: 'TF-IDF හිතන්න Cargills එකක bill එකක් වගේ. හැම bill එකකම "carrier bag" තියෙනවා, ඒ නිසා ඒකෙන් customer ගැන මුකුත් කියවෙන්නේ නෑ (IDF අඩුයි). ඒත් bill එකක "baby diapers" 5ක් තියෙනවා නම්, ඒ customer ගැන ගොඩක් දේ කියවෙනවා: ගෙදර පොඩි බබෙක් ඉන්නවා. ඒ අයිතමය මේ bill එකේ ගොඩක් තියෙනවා (TF වැඩියි), අනිත් bills වල දුර්ලභයි (IDF වැඩියි).',
      example: 'Documents 1,000ක් තියෙනවා. එක food review එකක වචන 100ක් තියෙනවා, ඒකේ "kottu" 5 පාරක් එනවා. TF = 5 ÷ 100 = 0.05. "kottu" documents 10ක විතරක් එනවා: IDF = log₁₀(1,000 ÷ 10) = log₁₀(100) = 2. TF-IDF = 0.05 × 2 = 0.1. "the" documents 1,000ම එනවා: IDF = log₁₀(1,000 ÷ 1,000) = log₁₀(1) = 0. ඉතින් "the" කී පාරක් ආවත් TF-IDF = 0. (log₁₀ කියන්නේ "10 කී පාරක් ගුණ කළාම මේ අංකය එනවාද" කියන එක. 100 = 10 × 10, ඒ නිසා 2.)',
      code: {
        lang: 'python',
        src: `from sklearn.feature_extraction.text import TfidfVectorizer
docs = ['kottu is good', 'kottu is not good', 'rice and curry is good']
vec = TfidfVectorizer(ngram_range=(1, 2))   # unigrams සහ bigrams දෙකම
X = vec.fit_transform(docs)                 # හැම document එකක්ම අංක පේළියක්
print(vec.get_feature_names_out())          # vocabulary එක: 'not good' එකත් තියෙනවා
print(X.shape)                              # (documents 3, features ගාණ)`,
      },
      keyPoints: [
        'BoW = වචන ගණන් කරනවා. අනුපිළිවෙළ සහ තේරුම නැති වෙනවා.',
        'TF-IDF = document එකේ නිතර එන, ඒත් වෙන තැන් වල දුර්ලභ වචන වලට වැඩි බරක්.',
        'N-grams = වචන කණ්ඩායම්. "not good" වගේ phrases අල්ලගන්න උදව් වෙනවා.',
        'සරල, වේගවත් baseline එකක්. ඒත් synonyms තේරෙන්නේ නෑ.',
      ],
      terms: [
        { en: 'Bag of Words (BoW)', si: 'අනුපිළිවෙළ නොසලකා හැම වචනයක්ම කී පාරක් ආවද කියලා ගණන් කරලා text එක අංක කරන ක්‍රමය.' },
        { en: 'Vocabulary', si: 'Model එක දන්න සියලුම වචන (හෝ tokens) ලැයිස්තුව.' },
        { en: 'TF (Term Frequency)', si: 'එක document එකක වචනයක් කොච්චර නිතර එනවාද.' },
        { en: 'IDF (Inverse Document Frequency)', si: 'මුළු documents අතරින් වචනයක් කොච්චර දුර්ලභද. දුර්ලභ නම් අගය වැඩියි.' },
        { en: 'TF-IDF', si: 'TF × IDF. Document එකකට විශේෂ වචන වලට ලොකු ලකුණක් දෙන ක්‍රමය.' },
        { en: 'N-gram', si: 'එක දිගට එන වචන n ගාණක කණ්ඩායම (unigram, bigram, trigram).' },
      ],
    },
    {
      id: 'word-embeddings',
      title: 'Word Embeddings: Word2Vec, GloVe & FastText',
      lab: 'embeddings',
      body: [
        'Word embedding එකක් කියන්නේ වචනයක් අංක ලැයිස්තුවකින් (vector එකකින්) නිරූපණය කරන එක, උදාහරණයකට අංක 100ක් හෝ 300ක්. වැදගත්ම දේ: තේරුමෙන් සමාන වචන වල vectors එකිනෙකාට ළඟයි. "cat" සහ "dog" ළඟයි, "cat" සහ "car" දුරයි. TF-IDF වලට කරන්න බැරි වුණ දේ මේකෙන් පුළුවන්.',
        'මේ vectors ඉගෙන ගන්නේ කොහොමද? අදහස සරලයි: "වචනයක් හඳුනගන්න, ඒක එක්ක එන යාළුවෝ බලන්න." "මම උදේට ___ බිව්වා" කියන තැන "තේ", "කෝපි", "කිරි" එන්න පුළුවන්. එකම වගේ වටපිටාවල එන වචන තේරුමෙනුත් ළඟයි. Word2Vec (Google, 2013) මේක ක්‍රම දෙකකින් කරනවා. CBOW (Continuous Bag of Words) එක වටේ තියෙන වචන වලින් මැද වචනය අනුමාන කරනවා. Skip-gram එක මැද වචනයෙන් වටේ තියෙන වචන අනුමාන කරනවා. Skip-gram එක දුර්ලභ වචන වලට හොඳයි, CBOW එක වේගවත්.',
        'GloVe (Stanford, 2014) වෙනස් විදිහකට යනවා. මුළු corpus එකේම කුමන වචන කුමන වචන එක්ක කී පාරක් එකට එනවාද (co-occurrence counts) කියන ලොකු table එකක් හදලා, ඒකෙන් vectors ඉගෙන ගන්නවා. FastText (Facebook, 2016) හැම වචනයක්ම character n-grams වලට කඩනවා: "where" → "<wh", "whe", "her", "ere", "re>". ඒ නිසා කවදාවත් දැකලා නැති වචනයකටත් (out-of-vocabulary) vector එකක් හදන්න පුළුවන්. සිංහල වගේ එකම මූලයෙන් වචන ස්වරූප ගොඩක් හැදෙන භාෂා වලට මේක ගොඩක් ප්‍රයෝජනවත්.',
        'මේ vectors වල පුදුම ලක්ෂණයක් තියෙනවා: king - man + woman ≈ queen. "king" vector එකෙන් "man" අඩු කරලා "woman" එකතු කළාම ලැබෙන vector එකට ළඟම වචනය "queen". ඒ කියන්නේ "පිරිමි → ගැහැණු" කියන අදහස vector space එකේ එක දිශාවක් විදිහට ඉගෙන ගෙන තියෙනවා. Paris - France + Japan ≈ Tokyo වගේ ඒවත් වැඩ කරනවා. වචන දෙකක් කොච්චර ළඟද කියලා මනින්නේ cosine similarity එකෙන්: vectors දෙක එකම දිශාවට නම් 1ට ළඟයි. මේ embeddings වල එක සීමාවක්: එක වචනයකට තියෙන්නේ එක vector එකයි, ඉතින් "bank" එකේ තේරුම් දෙකම එකට මිශ්‍ර වෙනවා. BERT, GPT වගේ models වල contextual embeddings මේක විසඳනවා.',
      ],
      analogy: 'කොළඹ සිතියමක හැම කඩයක්ම තිතකින් ලකුණු කරනවා කියලා හිතන්න. බත් කඩ ඔක්කොම එක ප්‍රදේශයක, කොත්තු කඩ ඒ ළඟ, phone කඩ වෙනම ප්‍රදේශයක. "Pettah සිට Bambalapitiya දක්වා යන දිශාව" වගේ, සිතියමේ දිශාවලටත් තේරුමක් තියෙනවා. Word embeddings කියන්නේ වචන වලට හදපු එවැනි සිතියමක්, ඒත් දිශා 2ක් වෙනුවට 300ක් තියෙනවා.',
      example: 'Dimensions 2ක සරල උදාහරණයක් (ඇත්ත embeddings වල සිය ගණනක් තියෙනවා): king = [0.9, 0.8], man = [0.5, 0.1], woman = [0.5, 0.9], queen = [0.9, 1.6]. king - man = [0.4, 0.7]. ඊට woman එකතු කළාම = [0.9, 1.6]. ඒක හරියටම queen. ඇත්ත Word2Vec / GloVe models වල මේක හරියටම සමාන වෙන්නේ නෑ, ඒත් ළඟම වචනය (input වචන අයින් කළාම) සාමාන්‍යයෙන් "queen".',
      code: {
        lang: 'python',
        src: `import gensim.downloader as api
wv = api.load('glove-wiki-gigaword-100')    # pretrained GloVe vectors (100 dims)
print(wv['king'][:5])                        # king vector එකේ මුල් අංක 5
print(wv.similarity('cat', 'dog'))           # cosine similarity: ළඟයි
print(wv.similarity('cat', 'car'))           # පොඩි අගයක්: දුරයි
# king - man + woman = ?
print(wv.most_similar(positive=['king', 'woman'], negative=['man'], topn=1))
# [('queen', 0.77...)] වගේ උත්තරයක්`,
      },
      keyPoints: [
        'Embedding = වචනයක තේරුම නිරූපණය කරන vector එක. සමාන වචන ළඟින්.',
        'Word2Vec: CBOW = වටේ වචන වලින් මැද එක. Skip-gram = මැද එකෙන් වටේ වචන.',
        'GloVe = global co-occurrence counts. FastText = character n-grams, නොදන්න වචනත් හසුරවනවා.',
        'king - man + woman ≈ queen: තේරුම් සම්බන්ධතා vector දිශා විදිහට ඉගෙන ගන්නවා.',
        'සම්භාව්‍ය embeddings = වචනයකට එක vector එකයි. Context අනුව වෙනස් වෙන්නේ නෑ.',
      ],
      terms: [
        { en: 'Word Embedding', si: 'වචනයක් එහි තේරුම අල්ලගන්නා dense vector එකක් විදිහට නිරූපණය කිරීම.' },
        { en: 'Word2Vec', si: '2013 දී Google හදපු, CBOW හෝ Skip-gram වලින් embeddings ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'CBOW', si: 'වටේ තියෙන context වචන වලින් මැද වචනය අනුමාන කරන Word2Vec ක්‍රමය.' },
        { en: 'Skip-gram', si: 'මැද වචනයෙන් වටේ තියෙන context වචන අනුමාන කරන Word2Vec ක්‍රමය.' },
        { en: 'GloVe', si: 'Corpus එකේ වචන එකට එන වාර ගණන් (co-occurrence) වලින් embeddings ඉගෙන ගන්න Stanford ක්‍රමය.' },
        { en: 'FastText', si: 'වචන character n-grams වලට කඩලා embeddings හදන Facebook ක්‍රමය. නොදන්න වචන වලටත් vectors දෙනවා.' },
        { en: 'Cosine Similarity', si: 'Vectors දෙකක් එකම දිශාවට කොච්චර යොමු වෙලාද කියලා මනින මිනුම (-1 සිට 1).' },
        { en: 'Out-of-Vocabulary (OOV)', si: 'Training වලදී model එක දැකලා නැති වචන.' },
        { en: 'Contextual Embeddings', si: 'වාක්‍යයේ context එක අනුව එකම වචනයට වෙනස් vectors දෙන embeddings (BERT, GPT).' },
      ],
    },
    {
      id: 'nlp-understanding-tasks',
      title: 'Understanding Tasks: Sentiment, Classification, NER & POS',
      body: [
        'Text classification කියන්නේ text එකකට category එකක් දෙන එක. Email එකක් spam ද නැද්ද, news article එකක් ක්‍රීඩාද දේශපාලනද ව්‍යාපාරද, customer message එකක් පැමිණිල්ලක්ද ප්‍රශ්නයක්ද. NLP වල ගොඩක්ම පාවිච්චි වෙන වැඩේ මේකයි.',
        'Sentiment analysis කියන්නේ text classification එකේ විශේෂ වර්ගයක්: text එකේ හැඟීම positive ද, negative ද, neutral ද කියලා හොයන එක. Companies මේක පාවිච්චි කරනවා reviews දහස් ගණනක් කියවලා customers සතුටුද කියලා බලන්න. උපහාසය (sarcasm) නම් තාමත් අමාරුයි: "නියමයි, bus එක පැය දෙකක් පරක්කුයි" කියන එක negative.',
        'NER (Named Entity Recognition) කියන්නේ text එකේ තියෙන නම් වර්ග සහිතව හොයන එක: පුද්ගලයන් (PERSON), ස්ථාන (LOCATION / GPE), සංවිධාන (ORG), දින (DATE), මුදල් (MONEY). Contracts, news, medical records වලින් තොරතුරු ස්වයංක්‍රීයව උකහා ගන්න මේක ගොඩක් ප්‍රයෝජනවත්.',
        'POS (Part-of-Speech) tagging කියන්නේ හැම වචනයකටම grammar භූමිකාව දෙන එක: noun (නාම පදය), verb (ක්‍රියා පදය), adjective (නාම විශේෂණය) වගේ. "Book a ticket" එකේ "book" verb එකක්, "Read a book" එකේ "book" noun එකක්. Lemmatization වලට, grammar check කරන්න, සහ වාක්‍ය ව්‍යුහය තේරුම් ගන්න POS tags ඕනේ.',
      ],
      analogy: 'NER හිතන්න පත්තරයක් කියවන ගමන් highlighters 4ක් පාවිච්චි කරනවා වගේ: කහ පාටින් මිනිස්සුන්ගේ නම්, කොළ පාටින් ස්ථාන, රෝස පාටින් ආයතන, නිල් පාටින් දින. POS tagging කියන්නේ පාසලේ සිංහල පාඩමේදී වාක්‍යයක හැම පදයටම යටින් "නාම පදය", "ක්‍රියා පදය" කියලා ලියන එක.',
      example: 'වාක්‍යය: "Kumar Sangakkara visited Colombo on 5 March with Rs. 50,000." NER output එක: Kumar Sangakkara → PERSON, Colombo → GPE (ස්ථානය), 5 March → DATE, Rs. 50,000 → MONEY. POS tags: "visited" → VERB, "Colombo" → PROPN (විශේෂ නාම පදය), "with" → ADP (preposition). Sentiment model එකකට "The service was slow but the food was excellent" දුන්නොත් ඒක mixed / සාමාන්‍යයෙන් positive පැත්තට වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import spacy
# පළමු වතාවට: python -m spacy download en_core_web_sm
nlp = spacy.load('en_core_web_sm')
doc = nlp('Kumar Sangakkara visited Colombo on 5 March.')
for ent in doc.ents:
    print(ent.text, '->', ent.label_)   # NER: PERSON, GPE, DATE
for tok in doc:
    print(tok.text, tok.pos_, tok.lemma_)  # POS tag සහ lemma එක`,
      },
      keyPoints: [
        'Text classification = text එකට category එකක් (spam / not spam වගේ).',
        'Sentiment analysis = positive / negative / neutral හැඟීම. Sarcasm තාමත් අමාරුයි.',
        'NER = නම්, ස්ථාන, ආයතන, දින, මුදල් හොයනවා.',
        'POS tagging = හැම වචනයකටම noun, verb වගේ grammar භූමිකාව.',
      ],
      terms: [
        { en: 'Text Classification', si: 'Text එකකට කලින් තීරණය කරපු categories වලින් එකක් දෙන වැඩේ.' },
        { en: 'Sentiment Analysis', si: 'Text එකේ හැඟීම positive, negative හෝ neutral ද කියලා හොයන වැඩේ.' },
        { en: 'NER (Named Entity Recognition)', si: 'Text එකේ පුද්ගල, ස්ථාන, ආයතන, දින වගේ නම් හඳුනගෙන වර්ග කරන වැඩේ.' },
        { en: 'POS Tagging (Part-of-Speech)', si: 'හැම වචනයකටම noun, verb, adjective වගේ grammar tag එකක් දෙන වැඩේ.' },
        { en: 'Sarcasm', si: 'කියන වචන වලට විරුද්ධ තේරුමක් අදහස් කරන උපහාසය. Sentiment models වලට අමාරුයි.' },
      ],
    },
    {
      id: 'nlp-generation-tasks',
      title: 'Generation Tasks: Summarization, Translation & Question Answering',
      body: [
        'Summarization කියන්නේ දිගු text එකක් කෙටි කරලා ප්‍රධාන අදහස් ටික දෙන එක. ක්‍රම දෙකක් තියෙනවා. Extractive summarization එක මුල් text එකෙන්ම වැදගත්ම වාක්‍ය ටික තෝරලා අරගන්නවා, highlighter එකෙන් ලකුණු කරනවා වගේ. Abstractive summarization එක අලුත් වාක්‍ය වලින්, තමන්ගේම වචන වලින් සාරාංශය ලියනවා. LLMs කරන්නේ abstractive summarization.',
        'Machine translation කියන්නේ එක භාෂාවකින් තව භාෂාවකට text හරවන එක. මුලදී නීති සහ dictionaries වලින් කළා. ඊට පස්සේ statistical ක්‍රම ආවා. 2016 දී විතර Google Translate neural machine translation වලට මාරු වුණා, encoder-decoder සහ attention පාවිච්චි කරලා. අද Transformers තමයි සම්මතය. Translation එක හොඳද කියලා මනින්න BLEU score එක වගේ මිනුම් පාවිච්චි කරනවා.',
        'Question answering (QA) කියන්නේ ප්‍රශ්නයකට උත්තරයක් දෙන එක. Extractive QA එකේදී paragraph එකක් සහ ප්‍රශ්නයක් දුන්නාම, model එක paragraph එක ඇතුළෙන්ම උත්තරය තියෙන කොටස පෙන්නනවා. Generative QA එකේදී model එක තමන්ගේම වචන වලින් උත්තරය ලියනවා. ChatGPT, Claude වගේ chatbots, සහ ඊළඟ phases වල එන RAG systems මේ අදහස උඩ තමයි හැදිලා තියෙන්නේ.',
      ],
      analogy: 'Extractive summarization කියන්නේ A/L exam එකට කලින් පොතේ වැදගත් වාක්‍ය highlighter එකෙන් ලකුණු කරනවා වගේ. Abstractive summarization කියන්නේ පාඩම කියවලා, පොත වහලා, ඔයාගේම වචන වලින් කෙටි සටහනක් ලියනවා වගේ. Extractive QA කියන්නේ "open book" exam එකක පොතේ උත්තරය තියෙන පේළිය පෙන්නනවා වගේ.',
      example: 'Paragraph එක: "Sri Lanka won the Cricket World Cup in 1996, beating Australia in the final in Lahore." ප්‍රශ්නය: "Where was the final played?" Extractive QA model එක paragraph එකෙන් "Lahore" කියන කොටස පෙන්නනවා. Summarization එකට වාක්‍ය 20ක news article එකක් දුන්නොත්, extractive model එක ඒකෙන්ම හොඳම වාක්‍ය 3ක් තෝරනවා. Abstractive model එක "1996 දී ශ්‍රී ලංකාව Australia පරාජය කරලා World Cup එක දිනුවා" වගේ අලුත් වාක්‍යයක් ලියනවා.',
      code: {
        lang: 'python',
        src: `from transformers import pipeline
qa = pipeline('question-answering')         # pretrained QA model එකක් download වෙනවා
ctx = 'Sri Lanka won the Cricket World Cup in 1996, beating Australia in Lahore.'
print(qa(question='Who did Sri Lanka beat?', context=ctx))
# {'answer': 'Australia', 'score': 0.9..., ...}  -> context එකෙන්ම උත්තරය
summarizer = pipeline('summarization')      # abstractive summary model එකක්
# summarizer(long_text, max_length=60)      # දිගු text එකක් කෙටි කරනවා`,
      },
      keyPoints: [
        'Extractive = මුල් text එකෙන්ම කොටස් තෝරනවා. Abstractive = අලුත් වචන වලින් ලියනවා.',
        'Machine translation = rules → statistics → neural (encoder-decoder + attention) → Transformers.',
        'QA = extractive (context එකෙන් උත්තරය හොයනවා) හෝ generative (උත්තරය ලියනවා).',
        'මේ වැඩ ඔක්කොම අද LLMs වලින් එකම model එකකින් කරන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Text Summarization', si: 'දිගු text එකක ප්‍රධාන අදහස් කෙටි ස්වරූපයකට ගේන වැඩේ.' },
        { en: 'Extractive Summarization', si: 'මුල් text එකෙන්ම වැදගත් වාක්‍ය තෝරලා සාරාංශය හදන ක්‍රමය.' },
        { en: 'Abstractive Summarization', si: 'අලුත් වාක්‍ය වලින් තමන්ගේම වචන වලින් සාරාංශය ලියන ක්‍රමය.' },
        { en: 'Machine Translation', si: 'Computer එකකින් එක භාෂාවක text වෙනත් භාෂාවකට හැරවීම.' },
        { en: 'BLEU Score', si: 'Machine translation එකක් මිනිස් පරිවර්තනයකට කොච්චර සමානද කියලා මනින මිනුම.' },
        { en: 'Question Answering (QA)', si: 'දෙන ලද context එකකින් හෝ model එකේ දැනුමෙන් ප්‍රශ්න වලට උත්තර දෙන වැඩේ.' },
      ],
    },
    {
      id: 'nlp-libraries',
      title: 'NLP Libraries: NLTK, spaCy & Hugging Face',
      body: [
        'NLTK (Natural Language Toolkit) කියන්නේ NLP ඉගෙන ගන්න අයට හදපු පරණම සහ ප්‍රසිද්ධම Python library එකක්. Tokenizers, stemmers, lemmatizers, corpora, grammar tools ගොඩක් තියෙනවා. ඉගෙන ගන්නත් research වලටත් හොඳයි, ඒත් ලොකු production systems වලට එච්චර වේගවත් නෑ.',
        'spaCy කියන්නේ production වලට හදපු, වේගවත්, පිළිවෙළට හදපු library එකක්. එක පේළියකින් tokenization, POS tagging, lemmatization, NER, dependency parsing ඔක්කොම කරනවා. Pretrained pipelines භාෂා ගොඩකට තියෙනවා. Companies වල text processing pipelines හදන්න ගොඩක් පාවිච්චි වෙනවා.',
        'Hugging Face කියන්නේ නවීන NLP වල මධ්‍යස්ථානය. Hugging Face Hub එකේ pretrained models ලක්ෂ ගණනක් සහ datasets තියෙනවා. transformers library එකෙන් BERT, GPT-2, T5, Llama වගේ models කීප පේළියකින් load කරලා පාවිච්චි කරන්න පුළුවන්. pipeline() function එකෙන් sentiment analysis, translation, summarization, QA වගේ වැඩ එක පේළියකින් කරන්න පුළුවන්. datasets සහ tokenizers වගේ libraries ත් ඔවුන් හදලා තියෙනවා.',
        'සරල නීතිය: NLP මූලික සංකල්ප ඉගෙන ගන්න NLTK. වේගවත්, විශ්වාසදායී text pipelines වලට spaCy. Pretrained Transformer models සහ fine-tuning වලට Hugging Face. ඇත්ත projects වල මේවා එකට පාවිච්චි කරන එකත් සාමාන්‍යයි.',
      ],
      analogy: 'NLTK කියන්නේ පාසලේ විද්‍යාගාරය වගේ: හැම උපකරණයක්ම තියෙනවා, ඉගෙන ගන්න හොඳයි. spaCy කියන්නේ කර්මාන්තශාලාවක assembly line එකක් වගේ: වේගවත්, පිළිවෙළයි, එකම වැඩේ දවස පුරා කරනවා. Hugging Face කියන්නේ ලෝකේ හැම රටකම chefs ලා හදපු recipes තියෙන ලොකු library එකක් වගේ: ඔයාට ඕනේ recipe එක අරගෙන ඔයාගේ කුස්සියේම උයන්න පුළුවන්.',
      example: 'Hotel එකකට reviews 5,000ක් තියෙනවා. Hugging Face sentiment pipeline එකෙන් ඒ ඔක්කොම විනාඩි කීපයකින් වර්ග කරනවා: 3,600 positive (72%), 1,400 negative (28%). ඊට පස්සේ spaCy එකෙන් negative reviews වල නිතර එන nouns හොයනවා: "Wi-Fi" 410 පාරක්, "parking" 260 පාරක්. Hotel එකට දැන් හරියටම දන්නවා මොනවා හදන්නද කියලා.',
      code: {
        lang: 'python',
        src: `from transformers import pipeline
clf = pipeline('sentiment-analysis')        # default English sentiment model එක
reviews = ['The kottu was amazing!', 'Room was dirty and the AC was broken.']
for r, out in zip(reviews, clf(reviews)):
    print(out['label'], round(out['score'], 2), '|', r)
# POSITIVE 1.0 | The kottu was amazing!
# NEGATIVE 1.0 | Room was dirty and the AC was broken.`,
      },
      keyPoints: [
        'NLTK = ඉගෙන ගන්න සහ research වලට. Tools ගොඩක්.',
        'spaCy = production වලට වේගවත් pipelines (NER, POS, lemmas).',
        'Hugging Face = pretrained Transformer models, datasets, pipeline() function එක.',
        'Projects වල මේවා එකට පාවිච්චි කරන එක සාමාන්‍යයි.',
      ],
      terms: [
        { en: 'NLTK', si: 'NLP ඉගෙනීමට සහ research වලට පාවිච්චි කරන, tools ගොඩක් තියෙන පරණ Python library එක.' },
        { en: 'spaCy', si: 'Tokenization, POS, NER වගේ වැඩ වලට production වලට හදපු වේගවත් Python library එක.' },
        { en: 'Hugging Face', si: 'Pretrained models සහ datasets බෙදාගන්න Hub එක සහ transformers library එක හදපු සමාගම / platform එක.' },
        { en: 'Transformers (library)', si: 'Hugging Face එකේ, BERT, GPT වගේ models load කරලා පාවිච්චි කරන්න තියෙන Python library එක.' },
        { en: 'Pipeline', si: 'Preprocessing, model එක, postprocessing එක එකට ඔතලා එක පේළියකින් වැඩේ කරන්න දෙන පහසුකම.' },
        { en: 'Pretrained Model', si: 'කවුරු හරි කලින්ම ලොකු data වලින් train කරලා තියෙන, කෙළින්ම හෝ fine-tune කරලා පාවිච්චි කරන්න පුළුවන් model එකක්.' },
      ],
    },
    {
      id: 'sinhala-nlp',
      title: 'Case Study: NLP for Sinhala',
      body: [
        'ඉංග්‍රීසි වලට text data බිලියන ගණනක් තියෙනවා. සිංහල කතා කරන්නේ මිලියන 17-20ක් විතර විතරයි, online තියෙන text ප්‍රමාණයත් ගොඩක් අඩුයි. මේ වගේ භාෂා වලට කියන්නේ low-resource languages කියලා. Labelled datasets (NER, sentiment වගේ වැඩ වලට) ඊටත් වඩා අඩුයි. ඒ නිසා සිංහල NLP models හදන එක අභියෝගයක්.',
        'සිංහල morphologically rich භාෂාවක්. එකම මූලයෙන් වචන ස්වරූප ගොඩක් හැදෙනවා: ගෙදර, ගෙදරට, ගෙදරින්, ගෙදරදී, ගෙදරක, ගෙවල්. ඉංග්‍රීසි වල "to the house", "from the house" කියලා වචන වෙන් වෙලා එනවා, සිංහලේ ඒ තේරුම වචනයටම ඇලිලා. ඒ නිසා vocabulary එක ලොකු වෙනවා, stemming සහ lemmatization අමාරුයි. FastText වගේ subword ක්‍රම මෙතනදී උදව් වෙනවා.',
        'තවත් අභියෝග: ලියන සිංහල සහ කතා කරන සිංහල වෙනස් (diglossia): "ඔහු පාසල් යයි" සහ "එයා ඉස්කෝලෙ යනවා". Social media වල Singlish සහ code-mixing ගොඩක්: "mama heta office yanawa" හෝ "Meeting එක cancel වුණා". පරණ websites වල FM Abhaya වගේ Unicode නොවන fonts පාවිච්චි කරලා, ඒ text computer එකට කියවන්න බෑ. Unicode වලත් ZWJ (Zero Width Joiner) අකුරක් නැති වුණොත් "ප්‍ර" එක වෙනස් විදිහට පෙනෙනවා.',
        'Tokenization ප්‍රශ්නයකුත් තියෙනවා. ගොඩක් LLM tokenizers ප්‍රධාන වශයෙන් ඉංග්‍රීසි data වලින් හදපු නිසා, එකම තේරුම තියෙන සිංහල වාක්‍යයකට ඉංග්‍රීසි වාක්‍යයකට වඩා tokens ගොඩක් වැඩි වෙන්න පුළුවන්. ඒ කියන්නේ සිංහල text process කරන්න වැඩි ගාස්තුවක්, context window එකේ අඩු ඉඩක්. ඒත් multilingual models (උදා: XLM-R, mBERT) සහ ලංකාවේ විශ්වවිද්‍යාල වල research නිසා සිංහල NLP වේගයෙන් දියුණු වෙනවා. ඔයාටත් මේ ක්ෂේත්‍රයට දායක වෙන්න ලොකු ඉඩක් තියෙනවා.',
      ],
      analogy: 'ඉංග්‍රීසි NLP කියන්නේ Keells super එකක බඩු ගන්නවා වගේ: හැම දෙයක්ම label කරලා, පිළිවෙළට රාක්ක වල. සිංහල NLP කියන්නේ ගමේ පොළට ගිහින් බඩු ගන්නවා වගේ: බඩු තියෙනවා, ඒත් labels නෑ, එක එක්කෙනා එක එක නම් වලින් කියනවා, සමහරු Singlish වලින් ගණුදෙනු කරනවා. ඒ හැම දෙයක්ම තේරුම් ගන්න වැඩි මහන්සියක් ඕනේ.',
      example: '"I am going home" කියන ඉංග්‍රීසි වාක්‍යය English-focused tokenizer එකකින් tokens 4ක් වගේ වෙනවා. "මම ගෙදර යනවා" කියන සිංහල වාක්‍යය එවැනි tokenizer එකකින් byte-level කොටස් වලට කැඩිලා tokens 10කට වඩා වැඩි වෙන්න පුළුවන්. Tokens වලට ගෙවන API එකක, එකම තේරුමට සිංහලෙන් කීප ගුණයක් වැඩි ගාස්තුවක් වෙන්න පුළුවන් කියන එක මෙයින් පේනවා. (නිශ්චිත ගණන tokenizer එක අනුව වෙනස් වෙනවා.)',
      keyPoints: [
        'සිංහල low-resource භාෂාවක්: data සහ labelled datasets අඩුයි.',
        'Morphology පොහොසත් නිසා වචන ස්වරූප ගොඩක්. Subword ක්‍රම උදව් වෙනවා.',
        'Diglossia, Singlish / code-mixing, non-Unicode fonts කියන්නේ විශේෂ අභියෝග.',
        'ඉංග්‍රීසි-කේන්ද්‍රීය tokenizers වල සිංහලට tokens වැඩියි, ඒ නිසා ගාස්තුවත් වැඩියි.',
      ],
      terms: [
        { en: 'Low-resource Language', si: 'NLP models train කරන්න text data සහ tools අඩුවෙන් තියෙන භාෂාවක්.' },
        { en: 'Morphology', si: 'වචන කොටස් එකතු වෙලා වචන ස්වරූප හැදෙන විදිහ (ගෙදර → ගෙදරට, ගෙදරින්).' },
        { en: 'Code-mixing', si: 'එකම වාක්‍යයේ භාෂා දෙකක් මිශ්‍ර කරලා පාවිච්චි කිරීම (සිංහල + English).' },
        { en: 'Diglossia', si: 'එකම භාෂාවේ ලිඛිත සහ කථන ස්වරූප දෙක ගොඩක් වෙනස් වීම.' },
        { en: 'Unicode / ZWJ', si: 'අකුරු සම්මත විදිහට ගබඩා කරන ක්‍රමය. ZWJ එක ප්‍ර, ව්‍ය වගේ බැඳි අකුරු හදන්න ඕනේ.' },
        { en: 'Multilingual Model', si: 'භාෂා ගොඩක data වලින් එකට train කරපු model එකක් (උදා: XLM-R, mBERT).' },
      ],
    },
  ],
  quiz: [
    {
      q: '"studies" කියන වචනය "study" බවට හරවන්නේ dictionary එකක් පාවිච්චි කරලා. මේ ක්‍රමය මොකක්ද?',
      options: ['Stemming', 'Lemmatization', 'Tokenization'],
      answer: 1,
      why: 'Lemmatization එක dictionary සහ grammar පාවිච්චි කරලා නිවැරදි මූල වචනය දෙනවා. Stemming එක "studi" වගේ රළු ප්‍රතිඵලයක් දෙනවා.',
    },
    {
      q: 'හැම document එකකම එන "the" වගේ වචනයකට TF-IDF score එක සාමාන්‍යයෙන් මොකක් වෙනවාද?',
      options: ['ගොඩක් ලොකුයි', '0ට ළඟයි', 'හැම වෙලේම 1යි'],
      answer: 1,
      why: 'හැම document එකකම එන වචනයක IDF = log(N ÷ N) = log(1) = 0. ඒ නිසා TF-IDF එකත් 0ට ළඟයි.',
    },
    {
      q: 'Word2Vec වල Skip-gram ක්‍රමය කරන්නේ මොකක්ද?',
      options: [
        'වටේ තියෙන වචන වලින් මැද වචනය අනුමාන කරනවා',
        'මැද වචනයෙන් වටේ තියෙන වචන අනුමාන කරනවා',
        'වචන ගණන් කරලා table එකක් හදනවා',
      ],
      answer: 1,
      why: 'Skip-gram එක මැද වචනයෙන් context වචන අනුමාන කරනවා. වටේ වචන වලින් මැද එක අනුමාන කරන්නේ CBOW.',
    },
    {
      q: 'Training වලදී නොදැක්ක වචනයකටත් vector එකක් හදන්න පුළුවන් embedding ක්‍රමය කොයිකද?',
      options: ['FastText', 'Bag of Words', 'One-hot encoding'],
      answer: 0,
      why: 'FastText වචන character n-grams වලට කඩන නිසා, අලුත් වචනයක කොටස් වල vectors එකතු කරලා ඒකට vector එකක් හදන්න පුළුවන්.',
    },
    {
      q: '"Kumar visited Colombo on Monday" වාක්‍යයේ Kumar → PERSON, Colombo → LOCATION කියලා හොයන වැඩේ මොකක්ද?',
      options: ['POS Tagging', 'Sentiment Analysis', 'Named Entity Recognition (NER)'],
      answer: 2,
      why: 'NER එක text එකේ තියෙන පුද්ගල, ස්ථාන, ආයතන, දින වගේ නම් හොයලා වර්ග කරනවා.',
    },
    {
      q: 'Sentiment analysis කරනකොට "not" කියන stopword එක අයින් කිරීම ප්‍රශ්නයක් වෙන්නේ ඇයි?',
      options: [
        'ඒක හරිම දිගු වචනයක් නිසා',
        '"not good" එක "good" වෙලා තේරුම පෙරළෙන නිසා',
        'Stopwords අයින් කරන්න බැරි නිසා',
      ],
      answer: 1,
      why: '"not" අයින් කළොත් negative වාක්‍යයක් positive වගේ පේනවා. Stopwords අයින් කරනකොට වැඩේට ගැළපෙනවාද කියලා බලන්න ඕනේ.',
    },
    {
      q: 'Model එක මුල් text එකෙන්ම වැදගත් වාක්‍ය තෝරලා සාරාංශයක් හදනවා. මේ මොන වර්ගයද?',
      options: ['Abstractive Summarization', 'Extractive Summarization', 'Machine Translation'],
      answer: 1,
      why: 'Extractive summarization එක මුල් text එකේම තියෙන වාක්‍ය තෝරනවා. Abstractive එක අලුත් වාක්‍ය ලියනවා.',
    },
  ],
}
