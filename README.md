# AI Zero to Hero

සිංහලෙන් (English technical terms එක්ක) Data Science, Machine Learning, Deep Learning, LLMs සහ GenAI ඉගෙන ගන්න interactive website එකක්.

## Run කරන හැටි

```bash
cd ai-zero-to-hero
npm install      # පළමු වතාවට විතරයි
npm run dev
```

Terminal එකේ පෙන්නන link එක (සාමාන්‍යයෙන් http://localhost:5173) browser එකේ open කරන්න.

## Structure

| Path | මොකක්ද |
|---|---|
| `src/content/phase*.js` | හැම phase එකකම lessons (සිංහල content). අලුත් file එකක් දැම්මොත් ඉබේම site එකට එනවා. |
| `src/labs/<id>.jsx` | Interactive labs. Topic එකක `lab: '<id>'` දැම්මාම ඒ topic page එකේ පෙන්නනවා. |
| `src/labs/draw.js` | Labs වලට පොදු canvas helpers. |
| `src/App.jsx` | Pages, navigation, progress. |
| `CONTENT_GUIDE.md` | Content ලියන format එක සහ tone එක. |

## NCA-GENL Exam Practice

`src/exam/*.json` හදන්නේ ඔයාගේ Question Bank v2 එකෙන්. Question bank එක වෙනස් කළොත් ආයෙත් import කරන්න:

```bash
node scripts/import-nca.mjs ../NCA-GENL-Question-Bank-v2
```

## CCAR-F Practice Exams

`src/exam-ccar/ccar-f-practice.json` හදන්නේ Claude Certified Architect study PDF එකේ Practice Exam 1 සහ 2 (ප්‍රශ්න 40, එයින් 3ක් "2ක් තෝරන්න" වර්ගයේ) වලින්. `pdftotext` (poppler-utils) ඕනේ:

```bash
node scripts/import-ccar.mjs ../Claude-Certified-Architect-Foundations-Zero-to-Hero.pdf
```

හැම ප්‍රශ්නයක්ම `examRefs` හරහා `phase23` / `phase24` lessons වලට සම්බන්ධයි (topic title වල "Task X.Y" අනුව). PDF එකේ සාම්පල ප්‍රශ්න 12 ට විකල්ප නැති නිසා ඒවා phase 24 හි "Official Sample Questions" topic එකේ තියෙනවා.

ඔයාගේ progress ("ඉගෙන ගත්තා" marks, quiz ලකුණු) browser එකේ localStorage එකේ save වෙනවා.
