# Brief for lesson-enrichment agents

Repo: /home/aux-217/Documents/AI-learning/ai-zero-to-hero (React/Vite AI learning site, branch `english-content`).

**Audience:** beginners in Sri Lanka who are weak at maths and learning AI from zero, and who are preparing for the NVIDIA NCA-GENL exam. English is the main language. Sinhala helper boxes are a learning aid.

**Gold standard:** read `src/lessons/11-ml-fundamentals.md` in full before you start. Compare it with the owner's original at `../AI-Zero-to-Hero-English/11-ml-fundamentals.md` to see exactly what kind and amount of material was added. Match that quality, tone and density. The owner approved it ("this is fine").

## Your job, per lesson file

1. **Keep every detail.** Never delete, shorten or reword existing lines. A checker verifies that every original line is still present. Add new material between existing lines. Code blocks, tables and diagrams stay byte-identical.
2. **Absorb the old Sinhala course.** Read the matching file(s) in `docs/sinhala-source/`. The JS has topics with `body`, `analogy`, `example`, `keyPoints`, `terms` and `quiz`. Bring anything useful the English lesson lacks into the right section, written in English: analogies, Sri Lankan examples, worked numbers, terms, explanations.
3. **Go beyond.** For every concept section (`## N. ...`), add whatever it lacks from this list:
   - **Why it exists:** 1–2 plain sentences before the definition, saying what problem the idea solves.
   - **A worked example with every arithmetic step shown**, using small numbers (Rs., lakhs, kg, marks, km are welcome).
   - **A text picture:** an ASCII diagram or table when the idea has a shape.
   - **Where you'll meet it in real work:** one concrete use (a bank, telecom, Daraz, a hospital, a chatbot, etc.).
   - **Common mistakes:** 1–3, if the section has none.
   - **Exam angle:** one line on how NCA-GENL-style exams test it. Only add this for topics in the exam domains: ML fundamentals, neural networks/transformers, tokenization/inference, prompting/agents, embeddings/RAG, training/fine-tuning, evaluation, NVIDIA stack/deployment, trustworthy AI.
   - Code only when running it teaches something, with every line commented.

   All facts must be correct. Don't invent statistics or present made-up numbers as real. Don't pad. Aim for roughly +60–120% length; lesson 11 went from 35 KB to 77 KB.
4. **Sinhala box.** In every concept section, put exactly one box at the END of the section (after the English additions, before the `---` separator), in this form:
   ```
   > **සිංහලෙන්:** <3–6 sentences>
   ```
   - A single blockquote paragraph.
   - Natural **spoken** Sri Lankan Sinhala, addressing the reader as ඔයා.
   - English technical terms stay in Latin script inside the Sinhala sentences ("Model එක train කරද්දී loss එක අඩු වෙනවා").
   - It re-explains the idea simply, with a Sri Lankan everyday example and real numbers where possible.
   - Use correct Unicode, including ZWJ forms such as ප්‍ර, ක්‍ර, ව්‍ය, ශ්‍රී.
   - Sinhala may appear **only** inside these boxes.

   Exceptions:
   - The "Table of contents", "Check yourself" and "New words in this file" sections get no box.
   - Lessons 00 (Start Here) and 31 (Glossary) are exempt from the box requirement. Still add a few boxes to 00 where they help a beginner.
5. **Quiz.** At the end of the last concept section (just before `## N. Check yourself`), add a fenced block:
   ````
   ```quiz
   [{"q": "...", "options": ["...", "...", "...", "..."], "answer": 1, "why": "..."}]
   ```
   ````
   - 6–8 English multiple-choice questions, as valid JSON.
   - Exactly 4 options each, with `answer` as a 0-based index.
   - `why` explains the right answer and why the most tempting wrong one is wrong.
   - Mix concept questions and small calculations. Reuse or translate the source phase's quiz where it fits.
   - Vary the correct index; don't make it always 1.
   - Not needed for 00 or 31.
6. Optionally, add 1–3 extra "Check yourself" questions in the existing `**QN.** ... <details><summary>Answer</summary>...</details>` style. Also add rows to "New words in this file" for any genuinely new term you introduced.

## Rules

- Edit **only** your assigned `src/lessons/NN-*.md` files. Do not touch `../AI-Zero-to-Hero-English/` (read-only source), app code, other lessons, or `docs/sinhala-source/`.
- Keep `## N. Heading` lines exactly as they are. Topic ids and links depend on them. Use `###` for new sub-headings.
- Links to other lessons use the existing style `[file 06](06-math-calculus.md#7-the-learning-rate)`. Only link to headings that exist (GitHub-style slug of a `## ` heading).
- Do NOT git commit. The coordinator commits.

## Verify before you report

```bash
node scripts/check-content.mjs --only <lesson-id-1>,<lesson-id-2>
```
The lesson id is the file name without `NN-` and `.md`, e.g. `ml-fundamentals`. It must print `OK: no problems`. It checks:
- parsing and quiz JSON;
- 5+ quiz questions;
- a Sinhala box in every topic;
- no Sinhala outside the boxes;
- 97%+ of the original lines kept.

Fix anything it reports and re-run.

## Report back (short)

- For each lesson: the original and new size in KB, and the number of Sinhala boxes and quiz questions.
- The checker output.
- Anything you were unsure about.
