# English content with Sinhala helper boxes: design

Date: 2026-11-03

## Why

The site teaches AI from zero, but every lesson is in Sinhala. The owner wants English to be the main language, so the content matches the exams and the industry. Sinhala stays only as a learning aid: under each concept, a short spoken-style Sinhala explanation with an example (English technical terms kept inline), shown in an always-visible orange box ("option A" in the mockup).

It is the same application. Routing, labs, login, Supabase sync, exams and styling stay. Only the content and the UI text change.

## Goals

1. **Course lessons** come from the English markdown course in `../AI-Zero-to-Hero-English/` (files 00–31: 01–29 exist now, 30–31 are being written). They replace the old Sinhala course phases (`phase0-math`, `phase0-programming`, `phase1-data-science` … `phase8-advanced`).
2. Each course lesson gets **more detail** where the old Sinhala phases had analogies, examples, terms or explanations the English file lacks. These are added in English.
3. Every concept section gets a **Sinhala helper box**.
4. **Certification guide phases** stay as their own sections, with the same ids, topic ids and `examRefs`, translated to English. Each topic gets a Sinhala helper box. These are phases 9–24: nvidia, trustworthy, evaluation, prompting-agents, rag-deep-dive, inference, training, architecture, ml-deep-dive, ai-infrastructure, agentic-ai, multimodal, accelerated-data-science, cert-practical, claude-agents-tools and claude-code-reliability.
5. **Exams:** the NCA-GENL bank (`src/exam/*.json`) is already English and stays unchanged. The CCAR-F practice exam (`src/exam-ccar/ccar-f-practice.json`) is restored to the PDF's original English wording.
6. **UI text** in `App.jsx`, `Exam.jsx` and `Common.jsx` becomes English.

## Non-goals

- No new features, redesign or new labs.
- No rewording of exam questions or answers.

## Anti-goals

- Sinhala that is broken Unicode, formal or bookish. It must sound the way Sri Lankan engineers talk (see the tone rules in `CONTENT_GUIDE.md`).
- Losing a cert-phase topic id or `examRefs`. That breaks the links between exams and lessons.
- English that is harder to follow than the source. The audience is beginners who are weak at maths.

## Design decisions

All of these are my calls unless marked otherwise.

- **Course lessons stay markdown.** They are copied into `src/lessons/NN-*.md` and loaded with `import.meta.glob('?raw')`. A small parser turns each file into the phase shape the app already uses:
  - each `## N. Heading` becomes a topic whose body is markdown;
  - "Table of contents" is dropped;
  - "Check yourself" becomes the phase's self-check;
  - "New words in this file" becomes the terms list.
  Markdown is rendered with `marked`, a new dependency.
- **Sinhala box markup in markdown:** a blockquote that starts with `> **සිංහලෙන්:**`. The renderer gives it the orange `si-box` style.
- **Sinhala box in cert-phase JS:** a new optional `si` string field on each topic, rendered as the same box after the body.
- **Lab placement:** a small map in the lesson loader from `lessonId/topicId` to lab id, reusing the labs' current concept matches.
- **Progress:** course-lesson topic keys change, so old "learned" ticks for those lessons won't match. This is acceptable because the owner said it is the same app with updated content. Cert-phase keys are unchanged.
- **Exam `related` links** that pointed at removed course phases (`ml`, `deep-dive` siblings, etc.) are re-pointed to the matching new English lessons.
- **Home page:** the course path lists lessons 01–30 in order, following the parts A–G from 00-START-HERE. The NCA-GENL and certification paths stay.
- **Glossary (31):** rendered as a lesson page when it exists.
- **Source files:** the English folder stays the owner's source. Additions and Sinhala boxes are written into the copies in `src/lessons/`.

## Constraints

- Vite 5, React 18, no backend changes.
- `npm run build` must pass, and the site must deploy to GitHub Pages as it does today.
