# Brief for certification-guide agents

Repo: /home/aux-217/Documents/AI-learning/ai-zero-to-hero (React/Vite AI learning site, branch `english-content`).

**Audience:** beginners in Sri Lanka preparing for NVIDIA and Claude certification exams. English is the main language. Sinhala helper boxes are a learning aid.

**Gold standard (read first):**
- `src/lessons/11-ml-fundamentals.md`: the English course lesson the owner approved. Match its clarity, structure and density in English.
- Your phase file's current Sinhala content is the source of truth for *what to cover*. Nothing may be lost.

## Your job: one phase file `src/content/phaseNN-*.js`

The file default-exports one object (see `CONTENT_GUIDE.md` for the shape). Convert it from Sinhala to English:

1. **Translate every Sinhala string** into clear, friendly, beginner-level English. This covers:
   - phase `title` (keep it if already English), `titleSi` (make it an English subtitle), `summary`, `duration` (e.g. 'සති 4-6' → '4-6 weeks');
   - each topic's `title`, `body` paragraphs, `analogy`, `example`, `keyPoints`;
   - code comments inside `code.src`;
   - `terms[].si` (keep the key name `si`, but the value becomes the English meaning; the term itself is in `en`);
   - `quiz`, `englishQuiz`, `domainChecklist` text, `resources` descriptions, and any other string with Sinhala.

   Faithful: same facts, same terms. Fix obvious errors, but don't drop content.
2. **Go beyond translation** where a topic is thin. In English, inside the existing fields (extra `body` paragraphs are fine), add:
   - why the idea exists / what problem it solves;
   - a worked example with every arithmetic step shown;
   - where you meet it in real work;
   - a common mistake;
   - an exam angle (how NCA-GENL or the relevant exam tests it).

   Facts must be correct and current as of 2026. Don't invent product names, API parameters or statistics. For NVIDIA products use the names NVIDIA's docs use. For Claude/Anthropic features, only state what the official docs support; where unsure, stay general.
3. **Add a new string field `si` to EVERY topic**: 3–6 sentences of natural **spoken Sri Lankan Sinhala** that re-explain the topic simply, with an everyday Sri Lankan example (Rs., Colombo, kottu, cricket, tuk-tuk, A/L exams, Keells, bus routes) and real numbers where possible.
   - Address the reader as ඔයා.
   - Keep English technical terms in Latin script inside the Sinhala sentences ("Model එක train කරද්දී loss එක අඩු වෙනවා").
   - Use correct Unicode, including ZWJ forms ප්‍ර, ක්‍ර, ව්‍ය, ශ්‍රී.
   - Sinhala may appear **only** in these `si` fields.
4. **NEVER change:** phase `id`, `number`, topic `id`s, topic order, `examRefs`, `lab` values, `domainChecklist` link targets (`phase`/`topic` ids), resource URLs, or the number of topics.
5. Large file: don't try to rewrite it in one shot by hand. Work topic by topic. A node script in your private scratchpad subfolder that loads the module and rewrites fields, then writes the file back out as formatted JS (`export default { ... }`, 2-space indent, keeping template-literal code blocks readable), is fine. Whatever you do, the final file must stay valid JS and keep the same overall shape.

## Verify before you report

```bash
node scripts/check-content.mjs --only <phase-id>
npm run build
```
The checker must print `OK: no problems`. It checks that:
- ids, numbers and examRefs are unchanged;
- every topic has a Sinhala `si`;
- no Sinhala appears anywhere else in the file;
- quiz JSON is valid (3–5 options, valid answer index, non-empty `why`).

## Rules

- Edit **only** your assigned phase file. Do not touch other files.
- The scratchpad is shared with other agents. Use your own private subfolder for helper scripts and never overwrite files outside it.
- Do NOT git commit. The coordinator commits.

## Report back (short)

The checker and build output, the number of topics, the old and new file size, anything you were unsure about (facts you could not verify), and one complete sample topic.
