# English Content with Sinhala Helper Boxes: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the Sinhala course with the English markdown course, translate the certification guide phases and the CCAR practice exam into English, and add an always-visible Sinhala helper box to every concept.

**Architecture:**
- The course lessons become markdown files in `src/lessons/`. A pure parser (`src/lessons/parse.js`) turns each file into the phase object the app already renders, and the app renders topic markdown with `marked`.
- The certification phases stay as JS in `src/content/` with the same ids. They gain an optional `si` field per topic.
- A node checker script (`scripts/check-content.mjs`) is the test for every content task.

**Tech Stack:** Vite 5, React 18, `marked` (new), `node:test` (no new test dependency).

**Spec:** `docs/superpowers/specs/2026-11-03-english-content-design.md`

## Global Constraints

- All English and visible UI text is English. Sinhala appears only inside:
  - a markdown blockquote that starts with `> **සිංහලෙන්:**`, or
  - a cert-topic `si` field.
- Sinhala tone follows `CONTENT_GUIDE.md`:
  - spoken style, addressing the reader as ඔයා;
  - English technical terms in Latin script;
  - Sri Lankan analogies;
  - correct ZWJ forms (ප්‍ර, ව්‍ය).
- Cert phases:
  - Never change `id`, topic `id`, `number` or `examRefs`.
  - Never drop a topic.
- `src/exam/*.json` question text is never changed. Only the `related` arrays change.
- The CCAR exam is a faithful English translation of the Sinhala PDF text. Never change `id`, `answer`, `answers`, `level` or the option order.
- The source folder `../AI-Zero-to-Hero-English/` is read-only. All edits go to copies in `src/lessons/`.
- `npm run build` passes after every task.

## Review Focus

1. **Cross-lesson links** such as `[file 10](10-data-science-workflow.md#13-data-leakage-preview)` must open the right page in the app, not a 404. Task 1 test `rewrites lesson links`.
2. **A `### ` subsection anchor** that is not a topic must fall back to its lesson page. Task 1 test `unknown anchor falls back to lesson`.
3. **Code blocks containing `## `** (Python comments, markdown inside code) must not split topics. Task 1 test `ignores headings inside code fences`.
4. **The glossary (31) and Start Here (00)** use un-numbered `## ` headings and must still parse. Task 1 test `parses un-numbered headings`.
5. **A malformed ```` ```quiz ```` block** must fail the checker loudly, not crash the page. Task 2 checker rule `quiz-json`.

---

### Task 1: Lesson parser

**Files:**
- Create: `src/lessons/parse.js`
- Test: `src/lessons/parse.test.js`
- Modify: `package.json` (add script `"test": "node --test src/"`)

**Interfaces:**
- Produces:
  - `slugify(heading: string) -> string`: GitHub-style. Lowercase, drop everything except letters, digits, spaces and `-`, then spaces become `-`. Example: `"13. Data leakage (preview)"` → `"13-data-leakage-preview"`.
  - `parseLesson(md: string, fileName: string) -> Lesson`, where `Lesson` is:
    `{ id, number, track: 'course', label, title, summary, prereq, topics: [{ id, title, md }], checkYourself, newWords, quiz }`
  - `rewriteLinks(md: string, resolve: (lessonId, anchor) => string) -> string`

The fields of `Lesson` are:
- `id`: the file name without its `NN-` prefix and `.md`, e.g. `ml-fundamentals`.
- `number`: the `NN` prefix as an integer.
- `label`: `"Lesson NN"`.
- `title`: the `# NN: Title` heading with the `NN: ` part stripped.
- `summary`: the text after `**After this file you can:**`.
- `prereq`: the markdown of the `**Before you start:**` line.
- Each `## ` section becomes a topic, except three special ones:
  - "Table of contents" is dropped.
  - "Check yourself…" becomes `checkYourself` (a markdown string).
  - "New words…" becomes `newWords` (a markdown string).
- Topic fields:
  - `id`: `slugify` of the full heading.
  - `title`: the heading without its leading `N. `.
  - `md`: the section body.
- `quiz`: the parsed JSON of a fenced ```` ```quiz ```` block, or `[]` if there is none. The block is removed from the topic `md`. Each item has the shape `{q, options, answer, why}`.

- [ ] **Step 1: Write the failing tests.** Cover:
  - `slugify` on the example above;
  - a small fixture lesson with title, summary, prereq, TOC, two topics, Check yourself, New words and a quiz block;
  - `ignores headings inside code fences`;
  - `parses un-numbered headings` (`## A` / `## B`);
  - `rewrites lesson links`: `[x](10-data-science-workflow.md#13-data-leakage-preview)` with a resolver returning `#/p/data-science-workflow/13-data-leakage-preview`;
  - `unknown anchor falls back to lesson`: the resolver returns `#/p/<id>`, and the test asserts that output.
- [ ] **Step 2:** Run `npm test`. Expected: the tests FAIL because the module is missing.
- [ ] **Step 3:** Implement `parse.js` as a line scanner that tracks whether it is inside a code fence. No dependencies.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit `feat: markdown lesson parser`.

### Task 2: Wire lessons into the app, drop the old course, add the checker

**Files:**
- Create:
  - `src/lessons/*.md`: copy `../AI-Zero-to-Hero-English/*.md` verbatim (00–31, whichever exist).
  - `src/lessons/index.js`: loader and `LAB_MAP`.
  - `src/components/Markdown.jsx`
  - `scripts/check-content.mjs`
- Modify:
  - `src/content/index.js`: merge lessons and cert phases.
  - `src/App.jsx`: rendering.
  - `src/styles.css`: `.si-box`.
  - `scripts/import-nca.mjs` RELATED, `src/exam/index.json` and `src/exam/*.json`: `related` only.
  - `package.json`: add `marked`.
- Delete: the course phase files `phase0-math.js`, `phase0-programming.js`, `phase1-data-science.js`, `phase2-ml.js`, `phase3-deep-learning.js`, `phase4-nlp.js`, `phase5-llm.js`, `phase6-genai.js`, `phase7-mlops.js` and `phase8-advanced.js`. Before deleting, copy them to `docs/sinhala-source/` (not imported) so the content agents can still read them.

**Interfaces:**
- Consumes: `parseLesson`, `rewriteLinks` from Task 1.
- Produces:
  - `phases` (lessons sorted by number, then cert phases sorted by number). Each phase has `track` ∈ {`course`, `cert`} and `label`. Cert labels are `"Exam guide N"`, numbered 1–16 in sort order.
  - `<Markdown src={string} />`
  - Each cert topic renders `topic.si` as a `.si-box`.
  - `node scripts/check-content.mjs [--only <id>]` exits 1 and prints `file: rule: detail` lines on failure.

What the app does:
- `LAB_MAP` maps topic keys `lessonId/topicId` to lab ids:

  | Lab | Lesson section |
  |---|---|
  | fit-line | 11 "training is optimisation" |
  | overfitting | 11 "underfitting and overfitting" |
  | learning-rate | 06 gradient descent |
  | normal-dist | 07 normal distribution |
  | confusion-matrix | 13 |
  | kmeans | 14 |
  | neuron | 15 |
  | attention | 19 |
  | tokenizer | 20 |
  | temperature | 20 |
  | embeddings | 23 |
  | rag | 23 |

  Use the exact topic ids from the headings.
- A course topic page renders `topic.md`, then the lab.
- A course phase page renders:
  - `prereq` and `summary`;
  - the topic list;
  - `checkYourself` as markdown (the `<details>` blocks stay clickable);
  - `newWords`;
  - `quiz` through the existing `<Quiz>`.
- A blockquote whose first strong text is `සිංහලෙන්:` gets class `si-box`. Style it as an orange left border with a tinted background, matching the `sinhala-layout` mockup option A.
- Exam `related` remap:

  | Domain | Points to |
  |---|---|
  | 01 | ml-deep-dive, ml-fundamentals |
  | 02 | architecture, neural-networks |
  | 03 | inference, how-llms-work |
  | 04 | prompting-agents, prompt-engineering |
  | 05 | rag-deep-dive, embeddings-vector-databases-rag |
  | 06 | training, training-finetuning-alignment |
  | 07 | evaluation, evaluating-llms |
  | 08 | nvidia, inference-and-serving |
  | 09 | trustworthy, responsible-ai |

Checker rules (each rule is a test):

| Rule | What it checks |
|---|---|
| `lesson-parse` | Every md file parses. |
| `quiz-json` | The quiz block is valid JSON with 4 options, an `answer` within range, and a `why`. |
| `si-box` | Every course topic has at least one `> **සිංහලෙන්:**` block. Exempt: lessons 00 and 31, and topics under 40 words. |
| `si-leak` | No Sinhala characters (U+0D80–U+0DFF) outside si-boxes in lessons, or outside `si` fields in cert phases. |
| `cert-ids` | Cert phase id, topic ids and `examRefs` equal the versions in `git show HEAD~N:<file>`. Compare against the baseline commit hash saved in `scripts/cert-baseline.txt` by this task. |
| `cert-si` | Every cert topic has a non-empty `si`. |

Rules `si-box`, `si-leak` and `cert-si` are expected to fail until the content tasks run. Use `--only` to scope them.

- [ ] **Step 1:** Write `check-content.mjs`. Run it. Expected: `lesson-parse`, `quiz-json` and `cert-ids` pass; `si-*` fail.
- [ ] **Step 2:** Implement the loader, `Markdown.jsx`, the App changes and the CSS. Delete the course phases, after copying them to `docs/sinhala-source/`.
- [ ] **Step 3:** Run `npm test && npm run build`. Expected: PASS. Run `npm run dev` and check:
  - lesson 11 renders, with links between lessons working and the fit-line lab showing;
  - an exam page's "related" links open.
- [ ] **Step 4:** Commit `feat: English markdown lessons replace Sinhala course`.

### Task 3: English UI text and docs

**Files:**
- Modify:
  - `src/App.jsx`: the `PATH` becomes the course lessons in order, grouped by Parts A–G from `00-START-HERE.md`; `EXAM_PATH` and `CERT_PATH` text goes to English; all other strings too.
  - `src/components/Exam.jsx`: `LEVEL_SI` becomes the English level names, plus all strings.
  - `src/components/Common.jsx`
  - `README.md`
  - `CONTENT_GUIDE.md`: rewrite it for the new format (English body, Sinhala box rules, quiz block, cert `si` field).

- [ ] **Step 1:** Run `grep -nP '[\x{0D80}-\x{0DFF}]' src/App.jsx src/components/*.jsx`. Expected: matches (the current state).
- [ ] **Step 2:** Translate every match. Keep meaning and keep the tone short and friendly.
- [ ] **Step 3:** Re-run the grep. Expected: no output. Run `npm run build`. Expected: PASS.
- [ ] **Step 4:** Commit `feat: English UI text`.

### Task 4: CCAR practice exam in English

**Files:** Modify `src/exam-ccar/ccar-f-practice.json`. Add a header note to `scripts/import-ccar.mjs` saying the JSON is now a hand-translated English version and that re-running the import produces Sinhala.

- [ ] **Step 1:** Translate `q`, `options`, `why` and `topic` faithfully. Keep the same meaning and the same technical terms. Do not improve the questions.
- [ ] **Step 2:** Verify with node:
  - same question count;
  - per-question `id`, `answer`, `answers`, `level` and options length unchanged against `git show HEAD:src/exam-ccar/ccar-f-practice.json`;
  - no Sinhala characters.

  Expected: prints `OK 40`.
- [ ] **Step 3:** Commit `content: CCAR practice exam in English`.

### Task 5: Pilot content (owner reviews before the batches)

**Files:**
- Modify `src/lessons/11-ml-fundamentals.md`, using `docs/sinhala-source/phase2-ml.js` as a source.
- Modify `src/content/phase17-ml-deep-dive.js`.

Content recipe for course lessons. This applies to every lesson task.
1. Read the lesson and the matching Sinhala source phase(s) (mapping table below).
2. Add, in English and in the lesson's own voice, anything the source has that the lesson lacks: analogies, worked examples, terms, explanations. Put each addition in the right section, not appended at the end.
3. In each concept section, after the first explanation, add one `> **සිංහලෙන්:** …` box. It holds 3–6 sentences of spoken Sinhala: the idea, then a Sri Lankan everyday example with real numbers where possible.
4. Add a ```` ```quiz ```` block before "Check yourself". It holds 5–8 English MCQs, reusing and translating the source phase's quiz where it fits.
5. Never delete or shorten existing English content. Every detail in the .md stays.
6. **Go beyond the sources (owner: "I expect more").** For each concept section, the bar is that a beginner who is weak at maths could explain it to a friend afterwards. Where the section falls short, add:
   - **Intuition first:** one or two plain sentences on *why this exists / what problem it solves* before any definition.
   - **A step-by-step worked example** with small real numbers, every arithmetic step shown (not just the result).
   - **A picture in text:** an ASCII diagram or table when the idea has a shape (flows, matrices, architectures, curves).
   - **Where you'll meet it in real work:** one concrete industry use (e.g. bank fraud model, Daraz search, call-centre chatbot).
   - **Common mistakes:** 1–3 traps, if the section has none.
   - **Exam angle:** for topics in the NCA-GENL domains, one line on what exams typically ask about it.
   - Short code only when running it teaches something; comment every line.
   Additions must be correct (no invented numbers presented as facts), in the lesson's voice, and placed where they belong. Aim for roughly +30–60% length per lesson, not padding.

Content recipe for cert phases.
1. Translate every Sinhala string to clear English: `title`, `titleSi` (make it an English subtitle), `summary`, `duration`, `body`, `analogy`, `example`, code comments, `keyPoints`, `terms[].si` (renamed meaning, still under the key `si`), `quiz` and any other fields.
2. Add a topic-level `si`: 3–6 sentences of spoken Sinhala, with the idea plus a Sri Lankan example.
3. Keep ids, `examRefs` and the structure.
4. Apply the same "go beyond" bar as course lessons: where a body is thin, add intuition, a worked example with every step shown, a real-world use and an exam angle (in English, inside the existing fields).

Source mapping (lesson → Sinhala source in `docs/sinhala-source/`):

| Lessons | Source phase |
|---|---|
| 02 | phase0-programming |
| 03 | phase0-programming |
| 04–07 | phase0-math |
| 01 | phase1-data-science, phase0-programming |
| 08–10 | phase1-data-science |
| 11–14 | phase2-ml |
| 15–17 | phase3-deep-learning |
| 18 | phase4-nlp |
| 19–21 | phase5-llm |
| 22–25 | phase6-genai |
| 26–28 | phase7-mlops |
| 29–30 | phase8-advanced |

- [ ] **Step 1:** Apply the recipes to lesson 11 and to phase17.
- [ ] **Step 2:** Run `node scripts/check-content.mjs --only ml-fundamentals,ml-deep-dive` and `npm run build`. Expected: PASS.
- [ ] **Step 3:** Commit `content: pilot lesson 11 and ml-deep-dive`. **Stop and show the owner both pages** before Task 6.

### Task 6: Content batches (parallel agents)

Each batch follows the Task 5 recipes, then runs `check-content.mjs --only <its ids>` and `npm run build`, then commits on its own.

| Batch | Covers |
|---|---|
| 6a | Lessons 00–05 |
| 6b | Lessons 06–10 |
| 6c | Lessons 12–17 |
| 6d | Lessons 18–23 |
| 6e | Lessons 24–31 |
| 6f | Cert: nvidia, trustworthy, evaluation |
| 6g | Cert: prompting-agents, rag-deep-dive |
| 6h | Cert: inference, training |
| 6i | Cert: architecture, ai-infrastructure |
| 6j | Cert: agentic-ai, multimodal |
| 6k | Cert: accelerated-data-science, cert-practical |
| 6l | Cert: claude-agents-tools, claude-code-reliability |

Batches touch disjoint files. Agents must not edit shared files (App.jsx, the loader, CSS).

- [ ] **Step 1:** Dispatch the batches.
- [ ] **Step 2:** When all are done, run `node scripts/check-content.mjs` (all rules), `npm test` and `npm run build`. Expected: all PASS, no Sinhala leaks.
- [ ] **Step 3:** Spot-check 3 random lessons and 2 cert phases in `npm run dev`.

### Task 7: Finish

- [ ] Delete `docs/sinhala-source/` (the content is absorbed; git history keeps it).
- [ ] Add `.superpowers/` to `.gitignore`.
- [ ] Run a final build.
- [ ] Commit.
