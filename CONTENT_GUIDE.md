# Content guide (for writing phase files)

Each phase lives in `src/content/<file>.js` and default-exports one object.
The site renders it automatically. Plain JS data only, no JSX, no imports.

## Language and tone

- Write in **simple, friendly spoken-style Sinhala** for a learner who is NOT good at maths.
- Keep **technical terms in English** (Latin script), mixed naturally into Sinhala sentences,
  the way Sri Lankan engineers actually talk:
  "Model එක train කරද්දී loss එක අඩු වෙනවා."
- Address the reader as **ඔයා**.
- No formulas unless unavoidable; if you show one, explain every symbol in words right after.
- Every concept needs an everyday analogy, preferably Sri Lankan (Rs., Colombo, kottu, cricket,
  tuk-tuk, exam results, Keells / Cargills shopping, rice and curry, A/L exam, bus routes).
- Short sentences. One idea per sentence.
- Use correct Unicode Sinhala. Double-check ZWJ forms like ්‍ර (ප්‍ර, ක්‍ර) and ්‍ය (ව්‍ය).

## Shape

```js
export default {
  id: 'ml',                       // url slug, kebab-case, unique
  number: 2,                      // phase number shown in UI (0 allowed)
  title: 'Machine Learning',      // English title
  titleSi: 'Machine Learning: උදාහරණ වලින් ඉගෙන ගන්න computer',
  summary: 'Sinhala, 2-3 sentences: what this phase is and why it matters.',
  duration: 'සති 6-8',            // rough study time
  topics: [
    {
      id: 'gradient-descent',     // unique within file, kebab-case
      title: 'Gradient Descent',  // English concept name
      lab: 'learning-rate',       // OPTIONAL: only ids from the lab list below
      body: [                     // 2-4 Sinhala paragraphs explaining deeply but simply
        '...',
      ],
      analogy: '...',             // one everyday analogy (Sinhala)
      example: '...',             // one concrete worked example with real numbers (Sinhala)
      code: {                     // OPTIONAL: short runnable Python (<= 15 lines), comments in Sinhala
        lang: 'python',
        src: `...`,
      },
      keyPoints: ['...', '...'],  // 3-5 Sinhala bullet takeaways
      terms: [                    // related sub-terms: every roadmap term must appear somewhere
        { en: 'Learning Rate', si: 'එක පියවරක් කොච්චර ලොකුද කියන එක.' },
      ],
    },
  ],
  quiz: [                         // 5-8 questions per phase, Sinhala
    { q: '...', options: ['...', '...', '...'], answer: 1, why: '...' },
  ],
}
```

A topic groups several related concepts. Aim for 6-12 topics per phase, and make sure
**every term listed for your phase** is covered, either as a topic or inside `terms`.

## Lab ids (interactive widgets that already exist)

| id | What it shows |
|---|---|
| `fit-line` | Drag sliders to fit a line to house prices; loss shown |
| `learning-rate` | Ball rolling down a loss curve with adjustable learning rate |
| `overfitting` | Straight line vs wiggly curve, reveal test data |
| `normal-dist` | Bell curve with mean / standard deviation sliders |
| `kmeans` | K-Means clustering step by step |
| `confusion-matrix` | Threshold slider updating precision / recall / F1 |
| `neuron` | One neuron: inputs, weights, bias, activation function |
| `tokenizer` | Type text, see it split into tokens with counts |
| `temperature` | Next-token probabilities reshaped by temperature / top-k |
| `attention` | Click a word, see attention weights to other words |
| `embeddings` | Words as points in 2D; cosine similarity between them |
| `rag` | Step through a RAG pipeline: chunk, embed, retrieve, generate |

Use each lab at most once across the whole site; the assignment per phase is given in your task.

## Example topic (match this quality and tone)

```js
{
  id: 'gradient-descent',
  title: 'Gradient Descent',
  lab: 'learning-rate',
  body: [
    'Model එකක් train කරනවා කියන්නේ ඒකේ knobs (weights) ටිකක් ටික ටික වෙනස් කරලා, වැරදි (loss) අඩුම තැනක් හොයන එක. ඒ හොයන ක්‍රමයට කියන්නේ Gradient Descent කියලා.',
    'හිතන්න loss එක කන්දක උස කියලා. අපිට ඕනේ කන්දේ පහළම තැනට යන්න. Gradient කියන්නේ කන්ද බෑවුම් වෙලා තියෙන දිශාව. Gradient Descent කියන්නේ ඒ බෑවුමට විරුද්ධ පැත්තට, ඒ කියන්නේ පහළට, පොඩි පියවරක් තියන එක. ඊට පස්සේ ආයෙත් බෑවුම බලනවා, ආයෙත් පියවරක් තියනවා.',
    'ChatGPT, Claude වගේ ලොකු models පවා train කරන්නේ මේ විදිහටමයි. වෙනස එකයි: knobs දෙකක් වෙනුවට බිලියන ගණනක් තියෙනවා.',
  ],
  analogy: 'ඝන මීදුමක් තියෙන කන්දක ඇස් බැඳගෙන ඉන්නවා කියලා හිතන්න. පාර පේන්නේ නෑ. ඒත් කකුල් වලට දැනෙනවා බිම බෑවුම් වෙලා තියෙන්නේ කොයි පැත්තටද කියලා. ඔයා ඒ පැත්තට පොඩි පියවරක් තියනවා. ආයෙත් දැනගන්නවා, ආයෙත් පියවරක්. අන්තිමට ඔයා නිම්නයේ පහළටම යනවා.',
  example: 'Model එක ගෙයක මිල ලක්ෂ 200ක් කියලා අනුමාන කරනවා, ඒත් ඇත්ත මිල ලක්ෂ 150යි. වැරැද්ද ලක්ෂ 50යි. Gradient එක කියනවා "price per m² knob එක ටිකක් අඩු කරන්න" කියලා. Knob එක පොඩ්ඩක් අඩු කළාම ඊළඟ අනුමානය ලක්ෂ 185යි. වැරැද්ද ලක්ෂ 35ට අඩු වුණා. මෙහෙම සිය ගණනක් පාරක් කරාම වැරැද්ද ගොඩක් අඩු වෙනවා.',
  keyPoints: [
    'Loss = model එක කොච්චර වැරදිද කියන අංකය.',
    'Gradient = loss එක වැඩි වෙන දිශාව. අපි යන්නේ ඒකට විරුද්ධ පැත්තට.',
    'Learning rate = එක පියවරක ප්‍රමාණය.',
    'හැම AI model එකක්ම වගේ ඉගෙන ගන්නේ මේ ක්‍රමයට.',
  ],
  terms: [
    { en: 'Learning Rate', si: 'එක පියවරක් කොච්චර ලොකුද. ගොඩක් පොඩි නම් හෙමින්, ගොඩක් ලොකු නම් පහළට යන්නේ නැතුව පනිනවා.' },
    { en: 'Local Minimum', si: 'පොඩි වළක්. අවට පහළම තැන, ඒත් මුළු කන්දේම පහළම තැන නෙවෙයි.' },
  ],
}
```
