export default {
  id: 'claude-code-reliability',
  number: 24,
  title: 'Claude Architect: Claude Code, Prompts & Reliability (Domains 3–5)',
  titleSi: 'Claude Code, Prompts, and Reliability (Domains 3–5)',
  summary: 'This phase covers the three CCAR-F domains that make up 55% of the exam: Domain 3 (20%), Domain 4 (20%), and Domain 5 (15%). Learn how to configure Claude Code with CLAUDE.md, rules, skills, plan mode, and CI/CD; make prompts and structured output more reliable with explicit criteria, few-shot examples, tool-use schemas, validation and retries, and the Message Batches API; and preserve context, report errors, and escalate to people at the right time. Topics also explain tempting exam distractors and why they are wrong.',
  duration: '4–5 weeks (the final topic includes a 12-week plan for full CCAR-F preparation)',
  topics: [
    // 1
    {
      id: 'claude-md-hierarchy',
      plain: "CLAUDE.md files provide project instructions that Claude Code loads according to location and hierarchy. Put stable, repository-relevant guidance near the code it governs.",
      internGuide: ["CLAUDE.md files provide project instructions that Claude Code loads according to location and hierarchy. Put stable, repository-relevant guidance near the code it governs.","Keep instructions short and testable: build/test commands, architecture constraints, naming rules, generated files, and safety boundaries. Do not store credentials or frequently changing status.","Imports, `.claude/rules/`, and memory commands are Claude Code features whose syntax and precedence can evolve. Verify the installed-version docs and inspect loaded context when behavior surprises you.","Review instruction files like code: avoid contradictions, assign one source of truth, test from repository and subdirectories, and remove stale rules that waste context."],
      examRefs: ['CCAR-011', 'CCAR-029'],
      title: 'CLAUDE.md Hierarchy, @import, .claude/rules/ and /memory (Task 3.1)',
      body: [
        'CLAUDE.md is a file of working instructions Claude Code reads, such as coding standards, test commands, and a rule not to commit secrets. Instructions can be at three levels: user (~/.claude/CLAUDE.md, private and not shared through Git), project (CLAUDE.md or .claude/CLAUDE.md in the repository, shareable through Git), and directory (a CLAUDE.md in a subfolder, relevant when working with that folder’s files).',
        'These instruction files add to one another rather than overriding one another. Split a large CLAUDE.md with @import (for example, @docs/api-standards.md) or organize topic-specific files such as testing.md, api-conventions.md, and deployment.md in .claude/rules/. Use /memory to inspect what is loaded.',
        'A common exam scenario is that a new teammate does not follow team conventions because the instructions exist only in someone’s ~/.claude/CLAUDE.md. Move shared instructions to the project-level CLAUDE.md and commit them to Git.',
        'Tempting wrong answers include keeping every team rule in a user-level file or putting everything into one 900-line CLAUDE.md. User-level instructions are private and are not shared through Git; a 900-line file is difficult to maintain. Prefer project-level standards plus topic files in .claude/rules/.',
      ],
      analogy: 'Think of user-level rules as home rules, project-level rules as school rules, and directory rules as laboratory rules that apply only in the lab. A new student needs the school rulebook, not your personal home rules.',
      example: 'Nimali’s ~/.claude/CLAUDE.md says to use pytest and type hints. Kasun joins on Monday, but his Claude Code writes unittest tests because those rules exist only on Nimali’s machine. Move the shared rules into the repository CLAUDE.md and commit them so Kasun receives them when he pulls. If that file grows to 900 lines, split it into testing.md, api-conventions.md, and deployment.md under .claude/rules/.',
      code: {
        lang: 'markdown',
        src: `# Project standards (repo root: CLAUDE.md, committed to Git)
- Python 3.12, type hints everywhere, pytest for tests.
- Never commit secrets; read them from environment variables.

# Split larger documents into separate files (@import)
@docs/api-conventions.md
@docs/testing-standards.md

# Personal only (not in Git): ./CLAUDE.local.md or ~/.claude/CLAUDE.md
# Inspect loaded instructions: /memory`,
      },
      keyPoints: [
        'Three levels: user (~/.claude/CLAUDE.md, private), project (repository root, shared with the team through Git), and directory (applies while working in a subfolder).',
        'Files add instructions rather than overriding one another; use @import and .claude/rules/ to organize them.',
        '/memory shows what is loaded. If a teammate lacks instructions, check whether they exist only at user level.',
        'Put team standards at project scope and personal preferences at user scope.',
      ],
      terms: [
        { en: '@import', si: 'Syntax that includes another file from CLAUDE.md, for example @docs/api-standards.md.' },
        { en: '/memory', si: 'Command that shows which memory files (CLAUDE.md and rules) are currently loaded; useful for diagnosing missing instructions.' },
        { en: 'CLAUDE.local.md', si: 'A Git-ignored file for settings that apply only to you in this project.' },
      ],
      si: 'ඔයාගේ ගෙදර නීති ඔයාට විතරයි, පාසලේ නීති හැමෝටමයි. Team එකම pytest භාවිතා කරන්න ඕනේ නම් ඒ නීතිය repo එකේ CLAUDE.md එකට දාන්න. දිග නීති පොත කොටස් තුනකට බෙදුවා වගේ .claude/rules/ වලට බෙදන්න පුළුවන්. /memory කියන්නේ Claude දැන් කියවපු නීති බලන ක්‍රමය.',
    },
    // 2
    {
      id: 'path-specific-rules',
      plain: "Path-specific rules attach instructions to matching files so frontend, infrastructure, tests, or generated code can follow different conventions without loading every rule everywhere.",
      internGuide: ["Path-specific rules attach instructions to matching files so frontend, infrastructure, tests, or generated code can follow different conventions without loading every rule everywhere.","A `paths` glob describes applicability; glob semantics and frontmatter syntax are product/version details. Test representative matching and non-matching paths, including nested directories.","Keep shared rules global and specialized rules local. Overlapping rules need compatible language because a file may match several patterns.","Add an example and validation command to each important rule. Avoid broad globs that accidentally govern vendor, build, or generated files."],
      examRefs: ['CCAR-030'],
      title: 'Path-Specific Rules with paths Globs (Task 3.3)',
      body: [
        'A rule file in .claude/rules/ can use paths: glob patterns in YAML frontmatter. The rule loads when Claude works with a matching file, keeping unrelated instructions out of context and saving tokens.',
        'This is useful when the same convention applies to files scattered across a codebase, such as Button.test.tsx and Card.test.tsx in many component folders. Rather than copying CLAUDE.md into every folder, one rule file can use paths: ["**/*.test.tsx"].',
        'For example, paths: ["terraform/**/*"] loads Terraform conventions when working with Terraform files. A directory-level CLAUDE.md, by contrast, is tied to that directory.',
        'Tempting wrong answers include relying on inference from the root CLAUDE.md, creating a manually invoked skill, or adding a CLAUDE.md to every subdirectory. Use .claude/rules/ with a paths glob.',
      ],
      analogy: 'If CCTV rules apply only to one shop in Colombo Fort, post them at that shop rather than handing a separate rulebook to every shop. A glob rule says to load instructions only when a matching kind of file is in scope.',
      example: 'Suppose a repository has 60 React component folders, each with *.test.tsx files, and 40 lines of shared test conventions. Instead of copying a CLAUDE.md into all 60 folders, create .claude/rules/testing.md with paths: ["**/*.test.tsx"]. Those rules stay out of context while editing component code and load for a test file.',
      code: {
        lang: 'markdown',
        src: `---
# .claude/rules/testing.md
paths:
  - "**/*.test.tsx"      # Load only when editing these files
  - "**/test_*.py"
---
Check one behavior per test.
Use fixtures in tests/fixtures/. Do not use sleep.`,
      },
      keyPoints: [
        'A paths glob loads a rule only when editing a matching file.',
        'Glob rules work well for files scattered across a codebase, such as test files or terraform/**.',
        'A subdirectory CLAUDE.md is tied to that folder; skills are manual; the root CLAUDE.md is always loaded.',
        'Scoped rules save tokens and keep unrelated instructions out of context.',
      ],
      terms: [
        { en: 'Glob pattern', si: 'A file-name pattern: ** matches any number of folders, while * matches a sequence of characters.' },
        { en: 'YAML frontmatter', si: 'The settings section between the opening --- lines at the top of a Markdown file.' },
      ],
      si: 'ඔයාගේ Colombo office එකේ test files හැම folder එකකම තිබුණත් එකම testing නීති තියෙන්න පුළුවන්. "**/*.test.tsx" වගේ glob එකක් ඒ files විතරක් තෝරනවා. ඒ නිසා test file එක edit කරනකොට විතරක් testing rules load වෙනවා. හැම folder එකටම වෙනම copy එකක් හදන්න ඕනේ නෑ.',
    },
    // 3
    {
      id: 'slash-commands-and-skills',
      plain: "A slash command is an invocation surface; a skill packages reusable instructions and optional supporting files. Use them for repeatable workflows, not as hidden policy enforcement.",
      internGuide: ["A slash command is an invocation surface; a skill packages reusable instructions and optional supporting files. Use them for repeatable workflows, not as hidden policy enforcement.","A SKILL.md should state when the skill applies, inputs, steps, safety constraints, expected output, and referenced assets/scripts. Keep instructions scoped and version-controlled.","Fields such as `context: fork`, `allowed-tools`, and `argument-hint` are Claude Code metadata whose availability and exact meaning can change. Verify current docs before relying on them.","Test invocation with normal, missing, and hostile arguments; enforce real permissions outside the prompt; and keep skill context small enough to be understandable and maintainable."],
      examRefs: ['CCAR-012', 'CCAR-031'],
      title: 'Slash Commands & Skills: SKILL.md, context: fork, allowed-tools, argument-hint (Task 3.2)',
      body: [
        'A slash command is a shortcut prompt that you run by typing something like /review. Shared commands live in .claude/commands/ and can be committed to Git; personal commands live in ~/.claude/commands/. A skill is more substantial: a team skill is in .claude/skills/<name>/SKILL.md and a personal skill in ~/.claude/skills/<name>/SKILL.md.',
        'Three useful SKILL.md frontmatter fields are context: fork, allowed-tools, and argument-hint. context: fork runs the skill in a separate sub-agent context so long output does not clutter the main conversation. allowed-tools limits which tools the skill can use (least privilege), including avoiding destructive actions. argument-hint requests a needed parameter if none was supplied.',
        'CLAUDE.md contains general standards that are always loaded; a skill is an on-demand task workflow. If you want to customize a team skill only for yourself, do not edit the shared copy. Create a personal variant with a different name under ~/.claude/skills/.',
        'Tempting wrong answers include editing a shared project skill (which affects teammates), putting a team command in ~/.claude/commands/, putting an on-demand workflow in always-loaded CLAUDE.md, or using a nonexistent commands array in .claude/config.json.',
      ],
      analogy: 'CLAUDE.md is the shop’s rule sign that everyone sees all the time. A skill is like a kottu recipe card used only when a kottu order arrives. With context: fork, the recipe is prepared in a side kitchen and only the result returns, keeping the main kitchen uncluttered.',
      example: 'When /map-codebase reads 300 files, context: fork lets a sub-agent do the work and return a 20-line summary instead of filling the main chat with all its output. allowed-tools: Read, Grep, Glob means the skill cannot delete files or run Bash. If you want a 50-line personal version of a team skill, create ~/.claude/skills/map-codebase-long/ rather than changing the shared one.',
      code: {
        lang: 'markdown',
        src: `---
# .claude/skills/map-codebase/SKILL.md
name: map-codebase
description: Map an unfamiliar folder and summarize its modules and entry points.
context: fork            # Run in a separate sub-agent context
allowed-tools: Read, Grep, Glob   # No destructive tools
argument-hint: <folder>  # Request this if no argument is supplied
---
Explore $ARGUMENTS. Return no more than 20 lines:
list modules, entry points, and key dependencies.`,
      },
      keyPoints: [
        'Team commands and skills live in .claude/commands/ and .claude/skills/<name>/SKILL.md (Git); personal ones live under ~/.claude/ (not Git).',
        'context: fork separates long output; allowed-tools limits tools; argument-hint requests a parameter.',
        'Skills are on-demand workflows; CLAUDE.md contains always-loaded standards.',
        'To customize a team skill only for yourself, create a personal variant with a different name.',
      ],
      terms: [
        { en: 'context: fork', si: 'Runs a skill in a separate sub-agent context and returns only a summary to the main chat.' },
        { en: 'allowed-tools', si: 'The list of tools a skill may use (least privilege).' },
        { en: 'argument-hint', si: 'A hint that requests a missing parameter when the skill is invoked.' },
        { en: 'Personal variant', si: 'Your own copy of a team skill under a different name in ~/.claude/skills/.' },
      ],
      si: 'කඩේ නීති පුවරුව හැම වෙලාවෙම පේනවා, කොත්තු recipe එක ඕඩරයක් ආවම විතරක් බලනවා. CLAUDE.md එකත් එහෙමයි: සාමාන්‍ය නීති නිතර load වෙනවා, skill එක අවශ්‍ය වැඩකට විතරයි. Files 300ක් සොයන skill එක වෙනම context එකක කරලා පේළි 20ක summary එකක් දෙන්න පුළුවන්. Team skill එක වෙනස් නොකර ඔයාට වෙනම personal variant එකක් තියාගන්න.',
    },
    // 4
    {
      id: 'plan-mode-vs-direct',
      plain: "Use direct execution for small, reversible, well-understood changes. Use plan mode when scope, architecture, dependencies, or risk must be inspected and agreed before edits.",
      internGuide: ["Use direct execution for small, reversible, well-understood changes. Use plan mode when scope, architecture, dependencies, or risk must be inspected and agreed before edits.","Exploration should gather evidence: repository instructions, relevant files, call paths, tests, and constraints. A plan lists intended changes and validation, not speculative implementation detail.","An Explore subagent or read-only investigation can reduce context pressure, but its findings still require verification and may miss cross-cutting behavior.","Switch from planning to implementation only when the requested outcome and boundaries are clear. Re-plan when evidence contradicts assumptions rather than forcing the original plan."],
      examRefs: ['CCAR-013'],
      title: 'Plan Mode vs Direct Execution and the Explore Subagent (Task 3.4)',
      body: [
        'Plan mode lets Claude investigate and design before changing code; direct execution makes changes immediately. Choose based on scope: multi-file architecture decisions with several options (such as converting a monolith to microservices or a migration across 45+ files) call for plan mode. A single-file bug with a stack trace or validation in one function is suited to direct execution.',
        'The two approaches can be combined: investigate and design in plan mode, then implement through direct execution.',
        'An Explore subagent handles longer discovery work, such as reading many files, in a separate context and returns only a summary to the main session. This helps preserve the main context window.',
        'A tempting wrong answer is to start with direct execution and switch to plan mode only if needed. If the requirement already shows high complexity, this can change dozens of files incorrectly and cause avoidable rework.',
      ],
      analogy: 'Sewing one button is like direct execution: take a needle and fix it. Adding an upper floor is like plan mode: an engineer designs the changes before walls are moved. An Explore subagent is like a surveyor who returns a report rather than asking you to walk the entire site.',
      example: 'Task A: split a monolith into five services across 120 files, with several possible boundaries. Use plan mode to map dependencies, propose two boundaries, get approval, and then implement. Task B: fix a ZeroDivisionError at payment.py:88 with a stack trace. One file and one location make direct execution appropriate; a separate plan would add unnecessary work.',
      keyPoints: [
        'Plan mode suits large, multi-file architecture decisions, such as migrations across 45+ files; direct execution suits small, clear scopes.',
        'Combine them: investigate and design first, then implement directly.',
        'An Explore subagent keeps discovery work separate and returns a summary.',
        'When complexity is already clear, do not start with direct execution and plan later.',
      ],
      terms: [
        { en: 'Plan mode', si: 'A mode for investigating and designing before changing code.' },
        { en: 'Explore subagent', si: 'A subagent that reads many files in a separate context and returns a summary.' },
      ],
      si: 'බොත්තමක් මහන්න නම් ඉක්මනින් ඉඳිකටුව ගන්න පුළුවන්; ගෙදර තට්ටුවක් එකතු කරන්න නම් මුලින් සැලසුමක් ඕනේ. Files 120ක් වෙනස් වෙන වැඩකට dependencies බලලා plan එකක් හදන්න. payment.py එකේ එක bug එකක් නම් කෙලින්ම fix කරන්න. Files ගොඩක් කියවීම Explore subagent එකකට දුන්නොත් ඔයාට summary එක විතරක් ලැබෙනවා.',
    },
    // 5
    {
      id: 'iterative-refinement',
      plain: "Give concrete input/output examples to expose ambiguity. Include normal, boundary, invalid, and counterexamples; explain which properties matter rather than inviting superficial copying.",
      internGuide: ["Give concrete input/output examples to expose ambiguity. Include normal, boundary, invalid, and counterexamples; explain which properties matter rather than inviting superficial copying.","Test-driven iteration defines observable behavior first, implements the smallest change, runs tests, then refactors while keeping behavior green. It is not a substitute for understanding requirements.","The interview pattern asks focused questions when a missing decision would materially change the solution. Do not interrogate users about choices that can be inferred safely from the repository.","After each iteration inspect the diff and failures, update assumptions, and stop when acceptance criteria pass—not when the response merely sounds complete."],
      examRefs: ['CCAR-032'],
      title: 'Iterative Refinement: I/O Examples, Test-Driven, Interview Pattern (Task 3.5)',
      body: [
        'If results remain inconsistent after a prose explanation, do not just write a longer description. Give two or three concrete input/output examples: “Here is the input and the output I expect.” Examples can be less ambiguous than prose.',
        'In test-driven iteration, write tests for the expected behavior first, let Claude write code, and give it failing test results as feedback. In an interview pattern, ask Claude to question you before designing in a domain you do not know well, such as cache invalidation or failure modes.',
        'Give related, interacting issues together in one message; address independent issues one at a time.',
        'Tempting wrong answers include adding more lengthy prose or setting temperature to 0. Neither addresses the root cause when the specification is unclear.',
      ],
      analogy: 'If you ask a child to buy “bread,” they may choose many kinds. Showing the white loaf you bought last week makes the request clearer. Examples show the intended result instead of only describing it.',
      example: 'Date inputs vary: “03/04/2026” (dd/mm), “April 3, 2026,” and “3rd of April 26.” Give three examples mapping each to “2026-04-03” rather than a ten-line prose description. Turn those examples into three tests and give Claude any failures; this can make output more consistent.',
      keyPoints: [
        'For inconsistent results, give two or three input/output examples instead of more prose.',
        'Test-driven iteration: write tests first and feed failures back.',
        'Interview pattern: ask Claude to question you in an unfamiliar domain.',
        'Give interacting issues together and independent issues one at a time.',
      ],
      terms: [
        { en: 'Interview pattern', si: 'Ask Claude to question you so that design concerns in an unfamiliar area become clear.' },
        { en: 'Test-driven iteration', si: 'Write tests first, then give Claude failing tests to guide improvements to the code.' },
      ],
      si: 'Date එක 03/04/2026 කියලා දුන්නම ඔයාට ඕන format එක පැහැදිලි වෙන්න උදාහරණ දාන්න. 03/04/2026 → 2026-04-03 කියන එක වාක්‍ය ගොඩකට වඩා පැහැදිලියි. මුලින් tests 3ක් ලියලා fail වෙන ඒවා Claudeට දෙන්නත් පුළුවන්. Design එක නොදන්නවා නම් Claudeට මුලින් ප්‍රශ්න අහන්න කියන්න.',
    },
    // 6
    {
      id: 'cicd-claude-p',
      plain: "Non-interactive `claude -p` can support automation, but CLI flags, output schemas, permissions, and authentication are version-specific. Pin and test the CLI used by CI.",
      internGuide: ["Non-interactive `claude -p` can support automation, but CLI flags, output schemas, permissions, and authentication are version-specific. Pin and test the CLI used by CI.","Provide a narrow task, explicit repository context, machine-readable output where supported, bounded tools/time/cost, and a nonzero exit/failure path. Never give CI an unrestricted production credential.","Treat generated findings as untrusted. Validate JSON/schema, preserve logs and diffs, and require deterministic linters/tests or human approval before merge/deploy.","Independent review should use the original requirements and changed artifacts, not only the first agent’s explanation. Measure false positives, missed defects, runtime, and cost."],
      examRefs: ['CCAR-014', 'CCAR-033'],
      title: 'CI/CD Integration: claude -p, JSON Output, Independent Review (Task 3.6)',
      body: [
        'A CI/CD pipeline runs without someone waiting to answer prompts. Run Claude Code with -p (--print) for non-interactive operation; otherwise Claude may wait for input and the job can hang. Add --output-format json and --json-schema to make findings machine-readable for inline PR comments.',
        'Give Claude testing standards, fixtures, and review criteria through CLAUDE.md. Do not have the same session that wrote the code review it: it retains its reasoning and may not question its decisions. Use a separate, independent claude -p run.',
        'When a PR receives a new commit, provide prior-findings.json and ask for only new or still-unaddressed findings to avoid duplicate comments. For test generation, provide the existing tests so Claude does not suggest duplicates.',
        'Tempting wrong answers include a CLAUDE_HEADLESS=true environment variable, a --batch flag, or redirecting stdin to /dev/null. These are not the solution; use claude -p.',
      ],
      analogy: 'A CI job is a guard working alone at 2 a.m. If told to ask questions when needed, nobody is there to answer and the job waits. -p means “do the work without asking and return a report.” Independent review is like using a different auditor instead of asking the person who wrote the accounts to audit them.',
      example: 'PR #212 has six findings: a developer fixes four and leaves two unresolved. If the next review does not receive prior-findings.json, it may post all six comments again. With that file, it can report the two remaining findings and any new ones. For test generation, provide the 85 existing tests so 12 suggested tests are genuinely new.',
      code: {
        lang: 'yaml',
        src: `# .github/workflows/review.yml (step එක)
- name: Claude review
  env:
    ANTHROPIC_API_KEY: \${{ secrets.ANTHROPIC_API_KEY }}   # secret එක repo secrets වලින්
  run: |
    claude -p "Review this PR diff. Report only bugs and security issues.
    Previous findings are in prior-findings.json; report only new or
    still-unaddressed issues." \\
      --output-format json \\
      --json-schema "$(cat .github/review-schema.json)" > findings.json
# -p = non-interactive (නැත්නම් job එක hang). json + schema = machine-parseable.
# මේක code ලියපු session එකෙන් වෙනම run එකක් (independent review).`,
      },
      keyPoints: [
        'Use claude -p (--print) in CI for non-interactive operation; otherwise a job may hang.',
        '--output-format json and --json-schema produce machine-readable findings for inline PR comments.',
        'Review in a separate independent session, not the session that wrote the code.',
        'For new commits, provide prior findings and request only new or unresolved issues; provide existing tests during test generation.',
        'CLAUDE_HEADLESS, --batch, and config.json commands are distractors, not available features.',
      ],
      terms: [
        { en: '-p / --print', si: 'Non-interactive mode එක: prompt එක දීලා result එක print කරලා ඉවර වෙනවා.' },
        { en: '--json-schema', si: 'Output එකේ හැඩය schema file එකකින් බලෙන් ගන්න flag එක.' },
        { en: 'Independent review instance', si: 'Generator ගේ context නැති වෙනම Claude run එකක්.' },
      ],
      si: 'CI එකේ වැඩ කරන robot එකට prompt එකක් එනකම් ඉන්න බැහැ, ඒ නිසා claude -p දාන්න. PR review එක code ලියපු Claude session එකෙන් වෙනම කරවන්න. කලින් findings 6ක් තිබුණා නම් ඒවායේ ගොනුව යවලා අලුත් හෝ ඉතුරු 2ක් විතරක් කියන්න. Test 85ක් දැනටමත් තියෙනවා නම් ඒවාත් දෙන්න, නැවත එකම tests හදන්නේ නැති වෙන්න.',
    },
    // 7
    {
      id: 'explicit-criteria-few-shot',
      plain: "Write criteria as observable checks with severity, scope, examples, and exclusions. “Find bad code” is vague; “report SQL built from untrusted input without parameterization” is testable.",
      internGuide: ["Write criteria as observable checks with severity, scope, examples, and exclusions. “Find bad code” is vague; “report SQL built from untrusted input without parameterization” is testable.","False positives consume reviewer trust. Require file/line evidence, explain the violated criterion, and permit “uncertain” when context is insufficient.","Few-shot examples teach decision boundaries. Include positive, negative, and near-miss examples; avoid examples whose labels depend on hidden knowledge.","Evaluate on a held-out labeled set by category and repository. Tune criteria/examples against errors, then recheck old cases to prevent regressions."],
      examRefs: ['CCAR-015'],
      title: 'Explicit Criteria, False Positives and Few-Shot Prompting (Tasks 4.1, 4.2)',
      body: [
        'Vague phrases such as “be careful,” “be conservative,” or “only report high-confidence findings” do not define what the model should do. Give explicit criteria instead: flag a comment only when it contradicts the code’s actual behavior; report bugs and security issues while skipping minor style issues and local patterns. Give concrete code examples for severity levels.',
        'If one category produces many false positives, developers may lose trust in all findings, not just that category. Temporarily disable the category, improve the prompt, and then enable it again.',
        'If detailed instructions still produce inconsistent output, add two to four targeted few-shot examples for ambiguous cases, with a reason for each decision. Show the output format (location, issue, severity, suggested fix), both acceptable code and real problems, and varied document formats such as inline citations and bibliographies. This helps the model generalize judgments to new patterns. See the ICL and clear-instructions topics in phase 12.',
        'Tempting wrong answers include adding “be careful” or “only high-confidence findings,” adding more prose rules, or training a classifier model when that would be over-engineering.',
      ],
      analogy: 'If an A/L examiner is told only to “give marks for a good answer,” two examiners may score differently. Clear criteria and three marked sample answers help them apply the same standard.',
      example: 'A code review bot reports 100 findings per week; developers dismiss 40 stale-comment findings (40% false positives) and begin ignoring all findings. Temporarily disable comment-accuracy checks, specify that a comment is flagged only when it contradicts code behavior, add one acceptable example and two real mismatches, then re-enable the category.',
      keyPoints: [
        '“Be careful” and “high-confidence only” are vague; specify categorical criteria.',
        'Too many false positives in one category can destroy trust. Disable it temporarily and improve the prompt.',
        'Use two to four reasoned few-shot examples for ambiguous cases, showing acceptable and problematic cases.',
        'When output stays inconsistent despite clear instructions, targeted few-shot examples can help.',
      ],
      terms: [
        { en: 'False positive', si: 'ගැටලුවක් නැති දේ ගැටලුවක් කියලා flag කරන එක.' },
        { en: 'Explicit criteria', si: 'හරියටම මොනවා report කරන්නද, මොනවා skip කරන්නද කියන පැහැදිලි නීති.' },
        { en: 'Severity levels', si: 'ගැටලුවේ බරපතලකම ශ්‍රේණි; හැම එකකටම code උදාහරණයක් දිය යුතුයි.' },
      ],
      si: '"Be careful" කියන එකට වඩා මොන bug report කරන්නද කියලා නීති පැහැදිලිව දාන්න. A/L answer එකකට ලකුණු දෙන විදිහට, හොඳ සහ නරක උදාහරණ 2ක් හෝ 3ක් පෙන්වන්න. Findings 100න් 40ක් වැරදි නම් ඒ category එක ටිකකට නවත්තලා prompt එක හදාගන්න. එහෙම කළාම developers ට හරි warnings විශ්වාස කරන්න ලේසියි.',
    },
    // 8
    {
      id: 'tool-use-json-schema',
      plain: "Use a JSON Schema to constrain tool inputs: object properties, required fields, types, enums, formats, and `additionalProperties` where supported. Application code still validates business rules and authorization.",
      internGuide: ["Use a JSON Schema to constrain tool inputs: object properties, required fields, types, enums, formats, and `additionalProperties` where supported. Application code still validates business rules and authorization.","Optional and nullable differ: optional may be absent; nullable may be present with null. In JSON Schema, nullable commonly uses a type union or `anyOf`, subject to the API’s supported subset.","Enums reduce ambiguity but values and casing need careful handling. Current Claude structured-output docs note a possible enum-casing exception, so compare safely and avoid case-only variants.","Strict tool use or structured outputs can improve schema conformance, but refusals, token limits, unsupported schema complexity, or model/tool-choice restrictions still need explicit handling."],
      examRefs: ['CCAR-016', 'CCAR-034', 'CCAR-035'],
      title: 'tool_use + JSON Schema: Nullable Fields, Enums, tool_choice (Task 4.3)',
      body: [
        'The most reliable way to require output that matches a schema is to define a tool with a JSON Schema input_schema and have Claude call it. This prevents JSON syntax errors, but not semantic errors such as a total that does not match line items or a value placed in the wrong field. Validate those separately.',
        'If a field that may be absent from a document is required, the model may fabricate a value. Make it nullable, such as "type": ["string", "null"]. For enums, include "unclear" for ambiguous cases and "other" plus a detail string when new categories may appear. Put date and number normalization rules in the prompt.',
        'The API defines `tool_choice` modes including `auto`, `none`, `any`, and a named `tool`. Support is model- and thinking-mode-specific: current Claude Opus 5.5, Sonnet 5.5, Fable 5.1, and Mythos 5.1 reject `any` and named forced-tool choices. Where forced choice is unsupported, use `auto` with strict tools for schema-valid calls, or `output_config.format` when the response itself must match a JSON schema. Always check the selected model’s compatibility table.',
        'Tempting wrong answers include making every field required (which can encourage fabricated values), assuming schema validity means factual correctness, or forcing a tool without checking model compatibility. Structured outputs constrain shape, not evidence or truth.',
      ],
      analogy: 'Application form එකක "NIC අංකය" අනිවාර්‍ය (required) කරලා, NIC නැති කෙනෙකුට දුන්නොත් ඔහු අහවල් අංකයක් ලියනවා. "නැත්නම් හිස්ව තියන්න" කිව්වොත් (nullable) ඇත්ත විතරයි එන්නේ. Dropdown එකේ "Other (විස්තර කරන්න)" තිබුණොත් වෙනස් වර්ග එද්දී form එක කැඩෙන්නේ නෑ.',
      example: 'Invoice එකක due_date එක නැහැ. Required කරපු schema එකේ model එක "2026-12-31" කියලා හදනවා (fabricated). Nullable schema එකේ due_date: null. Category එක "goods"/"services" විතරක් තිබුණාම "ගුවන් ටිකට් ගාස්තුවක්" ට නිවැරදි අගයක් නෑ. "other" + category_detail: "airfare" දැමීමෙන් එය හසුරුවා ගන්න පුළුවන්. Invoice, receipt, contract කියලා schemas 3ක් තියෙන්න, document එක මොකක්ද කියලා නොදන්නවා නම් tool_choice: any.',
      code: {
        lang: 'json',
        src: `{ "name": "extract_invoice",
  "input_schema": { "type": "object",
    "properties": {
      "invoice_number": {"type": "string"},
      "due_date": {"type": ["string", "null"]},   // නැත්නම් null (fabricate නෑ)
      "category": {"type": "string",
                   "enum": ["goods", "services", "unclear", "other"]},
      "category_detail": {"type": ["string", "null"]},  // other නම් විස්තරය
      "stated_total": {"type": "number"},      // document එකේ ලියපු එකතුව
      "calculated_total": {"type": "number"}   // line items වලින් අපි ගණන් කළ එකතුව
    },
    "required": ["invoice_number", "category", "stated_total", "calculated_total"]
  } }`,
      },
      keyPoints: [
        'Strict tool use හෝ structured outputs schema errors අඩු කරයි; refusals, max-token truncation සහ documented exceptions තවම handle කළ යුතු අතර semantic errors තවම ඇති විය හැකියි.',
        'නැති වෙන්න පුළුවන් fields = nullable (["string","null"]); required කළොත් model එක fabricate කරනවා.',
        'Enum: "unclear" + "other" සහ detail string. Date/number normalization rules prompt එකේ.',
        '`tool_choice` support depends on the selected model; current 5.5 models reject `any` and named forced-tool modes, so check compatibility and use strict tools or structured outputs as appropriate.',
      ],
      terms: [
        { en: 'Nullable field', si: 'අගය නැති විට null දෙන්න පුළුවන් field එක; fabrication වළක්වයි.' },
        { en: 'tool_choice: any', si: 'Supported model එකක tool call එකක් අනිවාර්‍ය කරලා කුමන tool එකද Claudeට තෝරන්න දෙන mode එක; සමහර current models මෙය reject කරයි.' },
        { en: 'Semantic error', si: 'Syntax හරි, නමුත් අර්ථය වැරදි (totals නොගැලපීම, වැරදි field එක).' },
      ],
      si: 'Form එකේ due date එක නැත්නම් අහඹු දවසක් ලියනවා වෙනුවට null දෙන්න කියන්න. Schema එකේ enum එකට unclear සහ other දාන්න, අලුත් category එකක් ආවොත් විස්තරයත් ගන්න. Line items එකතුව Rs. 5,500 නම් stated total එකත් ඒකට ගැලපෙනවද වෙනම validate කරන්න. Schema එක හැඩය පාලනය කරනවා, අර්ථය හරිද කියලා පරීක්ෂා කරන්න ඕනේ.',
    },
    // 9
    {
      id: 'validation-retry-loop',
      plain: "Validate syntax/schema, types, cross-field rules, permissions, external state, and domain invariants before using model output. Return specific safe feedback for correctable failures.",
      internGuide: ["Validate syntax/schema, types, cross-field rules, permissions, external state, and domain invariants before using model output. Return specific safe feedback for correctable failures.","Retry only when a new attempt can succeed: transient service error, truncated output with a larger limit, or a clearly correctable field. Use bounded attempts and backoff.","Retry cannot fix missing authorization, impossible requirements, unsupported features, absent source evidence, or a deterministic schema contradiction. Escalate or change the workflow.","Track retry reason and success rate. Preserve the original input and validation evidence, prevent duplicate side effects, and stop loops that repeatedly make the same error."],
      examRefs: ['CCAR-017', 'CCAR-037'],
      title: 'Validation, Retry & Feedback Loops: When Retry Cannot Work (Task 4.4)',
      body: [
        'Extraction එකක් validate කරනවා (Pydantic, JSON Schema, business rules). අසාර්ථක වුණොත් follow-up request එකක යවන්නේ: original document, අසාර්ථක extraction එක, සහ නිශ්චිත validation errors. එවිට model එක තමන්ම වැරදි හදාගන්නවා (self-correction). "ආයෙත් try කරන්න" කියන එක නෙවෙයි, හරියටම මොකද වැරදුණේ කියලා කියන එකයි වැදගත්.',
        'Retry වැඩ කරන්නේ format mismatches සහ structural errors වලට. වැඩ නොකරන්නේ තොරතුරු document එකේම නැති විටයි (ඒක තියෙන්නේ වෙනත් document එකක). එහෙම වෙලාවක කොච්චර retry කළත් model එකට හොයාගන්න දෙයක් නෑ; නිවැරදි පිළිතුර null දීලා human review එකට යැවීමයි. Loop එකට max retries සීමාවක් තියෙන්න ඕනේ.',
        'Self-check fields: calculated_total (line items වලින් model ගණන් කළ එකතුව) සහ stated_total (document එකේ ලියපු එකතුව) දෙකම extract කරලා සසඳන්න; conflict_detected boolean එකකුත් දාන්න පුළුවන්. Review findings වලට detected_pattern field එකක් තිබුණොත්, මොන code construct එක නිසාද finding එක ආවේ කියලා ලියවෙනවා; developers නිතර dismiss කරන patterns විශ්ලේෂණය කරලා prompt එක හදන්න පුළුවන්.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): තොරතුරු document එකේ නැති විට retry කරන එක, "temperature අඩු කරන්න" කියන එක, සහ validation errors නැතිව මහ පුදුම "ආයෙත් try කරන්න" කියන එක.',
      ],
      analogy: 'Bank එකේ cheque එකක ඉලක්කමෙන් Rs. 25,000 සහ අකුරෙන් "විසිපන් දහස" තියෙනවා නම් ගැටලුවක් නෑ. ඉලක්කමෙන් 25,000, අකුරෙන් "තිස් දහස" නම් teller ඒක ආපහු එවනවා "මෙන්න මේ දෙක නොගැලපෙනවා" කියලා. ඒ specific feedback එක තමයි retry එකේ ශක්තිය. ඒත් cheque එකේ ගිණුම් අංකය ලියලා නැත්නම් ආයෙත් එවපු එකෙන් වැඩක් නෑ; පාරිභෝගිකයාගෙන් අහන්න ඕනේ.',
      example: 'Invoice එකේ line items: 1,200 + 3,450 + 850 = 5,500. Model එක stated_total = 5,900 කියලා ගත්තා (document එකේ ලියලා තිබුණෙ 5,500; model එක අංකයක් වැරදියට කියෙව්වා). Validation: |5,900 − 5,500| > 0.01, අසාර්ථකයි. Retry එකට දෙන්නේ "stated_total (5,900) line items එකතුව (5,500) එක්ක නොගැලපෙනවා; document එක ආපහු කියවලා ඒ field එක විතරක් හදන්න". Attempt 2 එකේ හරි. නමුත් PO number එක document එකේ නැත්නම් (වෙනම email එකක) attempts 3ක් කළත් වෙනසක් නෑ, null + human review.',
      code: {
        lang: 'python',
        src: `def extract(document, max_retries=2):
    messages = [{"role": "user", "content": document}]
    for _ in range(max_retries + 1):   # retries සීමාවක්; FORCED = forced tool_choice
        resp = client.messages.create(model="claude-sonnet-5-5", max_tokens=1024,
            tools=[EXTRACT_TOOL], messages=messages, tool_choice=FORCED)
        block = next(b for b in resp.content if b.type == "tool_use")
        try:
            inv = Invoice(**block.input)         # Pydantic validation
            if abs(inv.stated_total - inv.calculated_total) > 0.01:
                raise ValueError("totals mismatch")
            return inv
        except (ValidationError, ValueError) as err:   # නිශ්චිත error එක feed back
            messages += [{"role": "assistant", "content": resp.content},
                {"role": "user", "content": [{"type": "tool_result", "is_error": True, "tool_use_id": block.id, "content": f"Validation failed: {err}"}]}]
    return None   # තවමත් අසාර්ථකයි: human review`,
      },
      keyPoints: [
        'Retry එකට දෙන්න: original document + අසාර්ථක extraction + නිශ්චිත validation errors.',
        'Retry වැඩ: format/structure errors. Retry වැඩ නෑ: තොරතුරු document එකේ නැති විට.',
        'calculated_total vs stated_total (+ conflict_detected) = semantic self-check.',
        'detected_pattern field = developers dismiss කරන patterns විශ්ලේෂණයට.',
      ],
      terms: [
        { en: 'Self-correction', si: 'Error එක දැක model එකම output එක හදාගැනීම.' },
        { en: 'conflict_detected', si: 'Extract කළ අගයන් එකිනෙකට පරස්පර නම් true වන boolean එක.' },
        { en: 'detected_pattern', si: 'Finding එක ඇති වුණේ කුමන code construct එකෙන්ද කියා සටහන් කරන field එක.' },
      ],
      si: 'Invoice එකේ 1,200 + 3,450 + 850 = 5,500 කියලා ගණන් බලන්න. Model එක 5,900 කිව්වොත් ඒ වැරැද්ද සහ නිශ්චිත error එක නැවත යවලා හදන්න කියන්න. Invoice එකේ PO number එකම නැත්නම් retries තුනක් කරලා වැඩක් නෑ; null දීලා කෙනෙකුට බලන්න යවන්න. Retry ගණනටත් සීමාවක් තියාගන්න.',
    },
    // 10
    {
      id: 'message-batches-api',
      plain: "The Message Batches API processes independent Messages requests asynchronously at a 50% token-cost discount relative to standard API pricing. It is for work that does not require an immediate response.",
      internGuide: ["The Message Batches API processes independent Messages requests asynchronously at a 50% token-cost discount relative to standard API pricing. It is for work that does not require an immediate response.","A batch can take up to 24 hours; most may finish sooner, but 24 hours is an expiration window, not a latency SLA for each request. Results can arrive out of order and are matched by custom ID.","As of current documentation, limits include up to 100,000 requests or 256 MB, results available for 29 days, and per-item succeeded/errored/canceled/expired outcomes. Recheck before designing.","Do not use batches for interactive paths. Poll or retrieve robustly, handle partial failures, protect stored input/output, calculate deadline capacity, and compare batch savings with operational delay."],
      examRefs: ['CCAR-018', 'CCAR-036'],
      title: 'Message Batches API: 50% Cost, 24h Window, SLA Math (Task 4.5)',
      body: [
        'Message Batches API එක requests ගොඩක් එකවර submit කරලා පස්සේ ප්‍රතිඵල ගන්න ක්‍රමය. වාසි: standard මිලෙන් 50% අඩුයි. අවාසි: batch එක පැය 24 දක්වා process විය හැකි අතර interactive client-tool loop එකක් මැද නව request එකක් යවා result දෙන්න බැහැ. Supported server-side features වෙනස් විය හැකි නිසා current compatibility list එක බලන්න. Requests සහ responses `custom_id` එකෙන් ගැලපෙන අතර output order එක මත විශ්වාස නොකරන්න.',
        'හොඳ use cases: overnight reports, weekly audits, nightly test generation (කවුරුත් බලාගෙන නැති වැඩ). නරක use case: blocking pre-merge check (developers බලාගෙන ඉන්න වැඩ); ඒවා synchronous API එකෙන්. Latency ඉවසිය හැකි + වියදම අඩු කරන්න ඕනේ = Batches.',
        'SLA ගණනය: ප්‍රතිඵල පැය 30ක් ඇතුළත ලැබෙන්න ඕනේ නම් සහ batch එකක් පැය 24ක් ගත වෙනවා නම්, submit කිරීමට අතර පරතරය උපරිම පැය 6ක් විය හැකි, ඒත් collection කාලයටත් ඉඩ තියන්න පැය 4න් 4ට submit කරනවා (document එකක් submit window එක මඟහැරියොත් උපරිම 4 + 24 = පැය 28 ≤ 30). පැය 12න් 12ට නම් 36 > 30 වැරදියි.',
        'Failures: custom_id අනුව අසාර්ථක වුණු ඒවා විතරක් resubmit කරන්න (උදා: ලොකු documents chunk කරලා). විශාල batch එකකට කලින් කුඩා sample එකක prompt එක refine කරන්න. Exam උගුල: batch එක pre-merge check එකට පාවිච්චි කරන එක, SLA එකක් තියෙනවා කියන එක, --batch flag (නෑ), හෝ ordering ගැටලු (custom_id නිසා නෑ).',
      ],
      analogy: 'Colombo → Kandy bus එකයි (synchronous, ඉක්මන්, මිල වැඩියි) lorry එකෙන් බඩු යවන එකයි (batch, ලාභයි, ආවොත් එනවා, පැය 24ක් වෙන්නත් පුළුවන්). අද රාත්‍රියේ අවශ්‍ය නැති stock report එක lorry එකෙන්. මේ වෙලාවේ අවශ්‍ය medicine එක bus එකෙන්.',
      example: 'Nightly: invoices 10,000ක් extract කරනවා. Standard cost $100 නම් Batch එකෙන් $50. SLA: ලැබුණු දවසෙන්ම පැය 30 ඇතුළත ප්‍රතිඵල. පැය 4න් 4ට submit කළොත් worst case: submit window එක අහිමි වුණු document එක පැය 4 රැඳිලා (4), batch එක පැය 24ක් (24) = 28 ≤ 30. දිනකට එක වරක් submit කළොත් 24 + 24 = 48 > 30. Batch එකේ 37ක් අසාර්ථකයි නම්, ඒවායේ custom_id (doc-1042 ...) විතරක් ආපහු දානවා.',
      code: {
        lang: 'python',
        src: `batch = client.messages.batches.create(requests=[
    {"custom_id": f"doc-{doc.id}",                   # results ගැලපෙන්නේ මෙයින්
     "params": {"model": "claude-sonnet-5-5", "max_tokens": 1024,
                "tools": [EXTRACT_TOOL],
                "tool_choice": {"type": "tool", "name": "extract_invoice"},
                "messages": [{"role": "user", "content": doc.text}]}}
    for doc in documents])

# status == "ended" වෙනකම් poll (පැය 24 දක්වා)
failed = []
for item in client.messages.batches.results(batch.id):
    if item.result.type == "succeeded":
        save(item.custom_id, item.result.message)
    else:
        failed.append(item.custom_id)                # මේවා විතරක් resubmit`,
      },
      keyPoints: [
        'Batches: 50% ලාභයි, පැය 24 expiration window එකක්, interactive client-tool round trips සඳහා නොවේ, සහ `custom_id` වලින් results ගැලපිය යුතුයි.',
        'හොඳ: overnight/weekly/nightly. නරක: blocking pre-merge check.',
        'SLA පැය 30 + batch පැය 24 → පැය 4න් 4ට submit (4 + 24 = 28 ≤ 30).',
        'අසාර්ථක ඒවා විතරක් custom_id වලින් resubmit; කලින් sample එකක prompt refine කරන්න.',
      ],
      terms: [
        { en: 'custom_id', si: 'Batch එකේ හැම request එකකටම දෙන ID එක; results ගැලපීමට සහ failures resubmit කිරීමට.' },
        { en: 'Blocking check', si: 'Developer ඒක ඉවර වෙනකම් බලාගෙන ඉන්න check එකක් (pre-merge). Batch වලට නුසුදුසුයි.' },
      ],
      si: 'Colombo ඉඳන් Kandy යන bus එක වගේ ඉක්මන් response එකක් ඕනේ නම් synchronous API භාවිතා කරන්න. රෑට invoices 10,000ක් බලන වැඩක් නම් Batch එකෙන් 50% අඩු වියදමකට කරන්න පුළුවන්, නමුත් පැය 24ක් යන්න පුළුවන්. පැය 30ක deadline එකට පැය 4න් 4ට submit කළොත් 4 + 24 = 28 පැය. custom_id එකෙන් response එක හරි request එකට ගලපන්න.',
    },
    // 11
    {
      id: 'independent-multi-pass-review',
      plain: "An independent reviewer receives requirements, code/artifact, and evaluation criteria without being anchored to the first reviewer’s conclusions. Independence reduces correlated confirmation bias.",
      internGuide: ["An independent reviewer receives requirements, code/artifact, and evaluation criteria without being anchored to the first reviewer’s conclusions. Independence reduces correlated confirmation bias.","Multi-pass review can separate correctness, security, tests, performance, and maintainability. Each pass needs a narrow rubric and evidence format.","More model calls do not guarantee truth; agents may share the same blind spots. Use static analysis, tests, primary documentation, and human expertise for high-risk decisions.","Deduplicate findings by root cause, resolve disagreements explicitly, measure precision/recall on labeled cases, and stop when added passes no longer justify cost and latency."],
      title: 'Independent Review Instances and Multi-Pass Review (Task 4.6)',
      body: [
        'Self-review දුර්වලයි, මොකද code එක ලියපු session එකට තමන්ගේ reasoning මතකයි; "මම මේක මෙහෙම කළේ හේතුවක් නිසා" කියලා ඒ තීරණ ප්‍රශ්න කරන්නේ අඩුවෙන්. වෙනම Claude instance එකක් (generator ගේ context නැතිව) review කරන එක self-review වලටත්, extended thinking දාලා ඒ session එකම review කරන එකටත් වඩා හොඳයි.',
        'ෆයිල් ගොඩක් ඇති PR එකක් එකම pass එකකින් review කළොත් attention එක තුනී වෙනවා (attention dilution): සමහර files ගැන ගැඹුරින් බලලා, අනිත් ඒවා ගැන නොගැඹුරු comments, එකිනෙකට පරස්පර findings. විසඳුම: multi-pass. File එක බැගින් local passes, ඊටපස්සේ වෙනම cross-file integration pass එකක් (interfaces, data flow). විශාල context window එකක් මේක විසඳන්නේ නෑ.',
        'Findings එක්ක confidence value එකකුත් report කරවලා, review routing (මොනවා human කෙනෙකුට, මොනවා auto) calibrate කරන්න පුළුවන්. phase 11 හි calibration සහ LLM-as-a-judge topics මතක් කරගන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "ඒ session එකටම තමන්ගේ output review කරන්න කියන්න", "extended thinking දාන්න", "ලොකු context window එකක් ඇති model එකක්", "PR කුඩා කරන්න developers ට කියන්න" (developers ට බර පටවනවා), "runs 3ක consensus ගන්න" (සැබෑ bugs සඟවනවා).',
      ],
      analogy: 'ඔයා ලියපු පෝස්ට් එකේ spelling mistakes ඔයාටම පේන්නේ නෑ, මොකද ඔයා ලියන්න හිතපු එක ඔයාගේ මොළය කියවනවා. වෙන කෙනෙක් කියවද්දී එකවරම පේනවා. ඒ වගේම පිටු 14ක් එක්වර බලන proof-reader ට අන්තිම පිටු ටික බලන්න වෙහෙස වෙනවා; පිටුවෙන් පිටුව බලලා, ඊටපස්සේ සම්බන්ධතා ගැන වෙනම බැලීමක් කරන එක හොඳයි.',
      example: 'PR එකේ files 14ක්. එක pass එකකින් review කළාම file 3ක ගැඹුරු comments, file 8ක කිසිවක් නෑ, සහ එකම pattern එක file A එකේ bug කියලා file B එකේ හරි කියලා කියනවා. ඒ වෙනුවට: pass 1-14 (file එකකට එක බැගින් local), pass 15 (cross-file: A එකේ function signature එක වෙනස් කළා, B,C,D හි calls update වුණාද?). හැම finding එකකටම confidence 0-1 වාර්තා කරවලා 0.8ට වැඩි ඒවා auto comment, ඊට අඩු ඒවා human triage.',
      keyPoints: [
        'Independent instance (generator ගේ context නැති) > self-review > extended thinking.',
        'Multi-pass: per-file local passes + වෙනම cross-file integration pass.',
        'ලොකු context window එක attention dilution විසඳන්නේ නෑ.',
        'Finding එකකට confidence report කරවලා review routing calibrate කරන්න.',
      ],
      terms: [
        { en: 'Attention dilution', si: 'Files ගොඩක් එකවර බලද්දී අවධානය තුනී වී ගැඹුර අඩුවීම.' },
        { en: 'Integration pass', si: 'Files අතර සම්බන්ධතා (interfaces, data flow) පමණක් බලන වෙනම review එක.' },
      ],
      si: 'ඔයා ලියපු essay එකේ වැරදි ඔයාටම නොපෙනෙන්න පුළුවන්; වෙන කෙනෙක් බලනකොට පේනවා. ඒ නිසා code ලියපු session එකෙන් වෙනම Claude instance එකක් review කරවන්න. Files 14ක් තිබුණොත් එකින් එක review කරලා, අන්තිමට ඒවා අතර function calls සහ data flow බලන්න. විශාල context එකක් තිබුණා කියලා අවධානය බෙදෙන ගැටලුව නැති වෙන්නේ නෑ.',
    },
    // 12
    {
      id: 'case-facts-and-context-management',
      plain: "Maintain a compact case-facts record containing verified entities, dates, constraints, decisions, sources, and open questions. Separate facts from model inference and user allegations.",
      internGuide: ["Maintain a compact case-facts record containing verified entities, dates, constraints, decisions, sources, and open questions. Separate facts from model inference and user allegations.","Long contexts can bury relevant information and increase cost. Retrieve relevant evidence, place critical instructions/facts clearly, and trim redundant tool logs or superseded drafts.","Summaries are lossy. Preserve links to original evidence and mark unresolved conflicts; never let a summary silently turn uncertainty into fact.","Before consequential action, re-read the authoritative source and validate current state. Test long conversations for fact retention, cross-user isolation, and stale-context errors."],
      examRefs: ['CCAR-019', 'CCAR-038'],
      title: 'Context in Long Conversations: Case Facts, Lost in the Middle, Trimming (Task 5.1)',
      body: [
        'Claude API එක stateless. ඒකට කලින් request මතක නෑ. ඒ නිසා හැම request එකකම සම්පූර්ණ conversation history එක යවන්න ඕනේ. Chat එක දිගු වෙද්දී ඒක progressive summarization කරන්න සිද්ධ වෙනවා. ඒත් summary එකෙන් නිශ්චිත අංක, දින, % අපැහැදිලි වෙනවා ("refund එක ඩොලර් 89.40" → "කිසියම් refund එකක්"). විසඳුම: ගනුදෙනු කරුණු (amount, dates, order IDs, status) "case facts" block එකක තියලා හැම prompt එකකම ඉහළින් summarize නොකර යවනවා.',
        'Lost in the middle: දිගු input එකක මැද කොටස model එක අඩුවෙන් සලකනවා. විසඳුම: key findings summary එක ආරම්භයේ දාන්න, ඉතිරි විස්තර section headers සමඟ සංවිධානය කරන්න. (phase 12 හි context-window-behavior topic එකත් බලන්න.)',
        'Tool results context එක පුරවනවා: order lookup එකෙන් fields 40ක් ආවත් ඔයාට ඕනේ 5යි. Context එකට දාන්න කලින් අදාළ fields විතරක් trim කරන්න. Multi-agent වලදී downstream agent ට upstream agent ගේ verbose reasoning වෙනුවට structured data (key facts, citations, relevance scores) යවන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "ලොකු context window එකක් ඇති model එකක් පාවිච්චි කරන්න", "සම්පූර්ණ chat එක ක්‍රමයෙන් summarize කරන්න" (අංක අහිමි), සහ "reports අහඹු ලෙස පෙළගස්වන්න".',
      ],
      analogy: 'Keells එකේ බිල්පත දිගු ලැයිස්තුවක්. ඔයා "ගොඩක් බඩු ගත්තා, බිල්පත ගාන ඉහළයි" කියලා සාරාංශ කරාම Rs. 4,350.75 අහිමි වෙනවා. Case facts block එක කියන්නේ බිල්පතේ මුළු එකතුව සහ අංක ටික වෙනම කඩදාසියක ලියලා හැමවෙලේම ඔයාගේ ඉදිරිපිටම තියාගන්න එක.',
      example: 'Chat එක පණිවිඩ 60ක් දිගයි. Summarize කළාම "customer refund ඉල්ලුවා" විතරයි ඉතුරු වුණේ; $89.40 අහිමි, 2026-10-14 delivery date අහිමි. Case facts block එක (පේළි 5ක්) හැම request එකකම මුලට දානවා. Order lookup tool එකෙන් fields 40ක් ආවා, අවශ්‍ය 5ක් (id, status, total, delivery_date, items) විතරක් trim කරලා context එකට දානවා. ඒකෙන් fields 35ක් (~87%) context එකට යන්නේ නෑ.',
      code: {
        lang: 'text',
        src: `<case_facts>
customer_id: C-88421 (verified)
order: A12345, delivered 2026-10-14, status: damaged
customer_request: refund of $89.40 to original card
policy_check: damage photo received; within 30-day window
</case_facts>
<!-- මේක summarize කරන්නේ නෑ. හැම request එකකම මුලට දානවා.
     ඒකෙන් අංක/දින වෙනස් වෙන්නේ නෑ, lost-in-the-middle ගැටලුවත් නෑ. -->`,
      },
      keyPoints: [
        'API stateless: හැම request එකකම සම්පූර්ණ history එක යවන්න.',
        'අංක/දින/IDs = case facts block (summarize නොකර, හැම prompt එකකම).',
        'Lost in the middle: key findings මුලට + section headers.',
        'Tool results trim කරන්න (fields 40න් 5ක්); downstream agents ට structured data යවන්න.',
      ],
      terms: [
        { en: 'Progressive summarization', si: 'දිගු chat එක ක්‍රමයෙන් සාරාංශ කරන එක; අංක/දින අපැහැදිලි වෙන අවදානමක්.' },
        { en: 'Lost in the middle', si: 'දිගු input එකක මැද කොටස model එක අඩුවෙන් සලකන ගැටලුව.' },
        { en: 'Stateless API', si: 'Server එක කලින් requests මතක තබා ගන්නේ නැති නිසා history යැවිය යුතුයි.' },
      ],
      si: 'ඔයාගේ Keells බිලේ මුළු ගණන Rs. 4,350.75 නම්, chat එක කෙටි කරනකොට ඒ අංකය නැති කරන්න එපා. Amount, date, order ID සහ status වගේ වැදගත් facts වෙනම තියා හැම prompt එකකම මුලට දෙන්න. දිග විස්තරයක මැද තියෙන දේ අඩුවෙන් පෙනෙන්න පුළුවන්. Tool එක fields 40ක් දුන්නොත් අවශ්‍ය fields 5ක් විතරක් තෝරලා ඉදිරියට යවන්න.',
    },
    // 13
    {
      id: 'escalation-triggers',
      plain: "Escalate on explicit policy conditions: high impact, low/uncalibrated confidence, conflicting evidence, repeated failure, missing authorization, out-of-scope request, or user request for a human.",
      internGuide: ["Escalate on explicit policy conditions: high impact, low/uncalibrated confidence, conflicting evidence, repeated failure, missing authorization, out-of-scope request, or user request for a human.","Confidence wording, response length, sentiment, or “sounds uncertain” are weak proxies unless calibrated against real outcomes. Do not use model self-confidence alone.","The handoff includes verified facts, sources, attempted actions, failure reason, risk, and requested human decision—without flooding the reviewer with raw context.","Measure escalation precision, missed-risk rate, wait time, reviewer load, and outcomes. Tune thresholds by risk tier and provide a safe default while waiting."],
      examRefs: ['CCAR-020', 'CCAR-039'],
      title: 'Escalation: Triggers and Untrustworthy Proxies (Task 5.2)',
      body: [
        'Agent එක human කෙනෙකුට escalate කළ යුත්තේ කවදාද? (1) Customer පැහැදිලිවම human කෙනෙකු ඉල්ලුවොත්: ඉක්මනින්, "මුලින් මම බලන්නම්" කියලා විමර්ශනය කරන්නෙ නැතිව. (2) Policy එක අපැහැදිලි හෝ නිහ්ශබ්ද නම් (උදා: competitor price match, policy එකේ කිසිවක් නෑ). (3) Progress එකක් කරන්න බැරි නම්.',
        'Escalate නොකළ යුතු: සරල standard cases (photo එක්ක damaged item replacement), සහ customer කෝපයෙන් ඉන්නවා කියලා පමණක්. ඔහුගේ ගැටලුව විසඳන්න පුළුවන් නම් පළමුව විසඳුම offer කරන්න. Tool එකෙන් එකම නමින් customers කිහිප දෙනෙක් ආවොත් අනුමානයෙන් එකක් තෝරන්න එපා; email/phone වැනි අමතර identifier එකක් ඉල්ලන්න.',
        'විශ්වාස නොකළ යුතු proxies දෙකක්: sentiment analysis (කෝපය ≠ ගැටලුවේ සංකීර්ණත්වය) සහ model එක තමන්ම දෙන confidence score එක (1-10), එය calibrate වෙලා නෑ. නිවැරදි විසඳුම: system prompt එකේ explicit escalation criteria + few-shot examples (phase 12 හි system-prompt-craft බලන්න).',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "sentiment score එකක් -0.5ට අඩු නම් escalate", "confidence 7ට අඩු නම් escalate", "escalation classifier එකක් train කරන්න" (over-engineering), "නවතම account එක තෝරන්න" (අනුමාන).',
      ],
      analogy: 'බැංකුවේ counter officer ට "මැනේජර් කෙනෙක් ඕනේ" කියලා customer කිව්වොත් ඔහු "මම බලන්නම්" කියලා විනාඩි 20ක් නාස්ති කරන්නේ නෑ, කෙලින්ම manager ළඟට යවනවා. ඒත් "කාඩ් එක ගිලිලා" කියලා කෝපයෙන් කතා කරන customer ගේ ගැටලුව counter එකෙන්ම විසඳන්න පුළුවන් නම් manager ට යවන්නේ නෑ.',
      example: 'Scenario: FCR (first-contact resolution) 55%, ඉලක්කය 80%. Logs: සරල "damaged blender + photo" cases escalate වෙනවා, ඒත් "Store X ගේ මිලට price match කරන්න" (policy නෑ) cases agent එක තනියම උත්සාහ කරනවා. Root cause: criteria නෑ. Fix: system prompt එකට 3 triggers + examples: "Cracked blender, photo → resolve: replacement", "Match Store X ගේ මිල → escalate: policy අපේ මිල වලට විතරයි", "මට මනුස්සයෙක් දෙන්න → දැන්ම escalate". Self-confidence threshold එකකින් මේක විසඳෙන්නේ නෑ.',
      keyPoints: [
        'Escalate: පැහැදිලි human ඉල්ලීම (දැන්ම), policy නිහ්ශබ්ද/අපැහැදිලි, progress කරන්න බැරි.',
        'Escalate නොකරන්න: සරල standard cases; කෝපය පමණක්. මුලින් විසඳුම offer කරන්න.',
        'අවිශ්වාසී proxies: sentiment සහ self-reported confidence (1-10).',
        'Matches කිහිපයක් = අමතර identifier ඉල්ලන්න (අනුමාන නෑ). Fix = explicit criteria + few-shot.',
      ],
      terms: [
        { en: 'First-contact resolution (FCR)', si: 'පළමු සම්බන්ධතාවයේදීම ගැටලුව විසඳෙන අනුපාතය.' },
        { en: 'Policy gap', si: 'Policy එක කිසිවක් නොකියන තත්ත්වය; escalate කළ යුතුයි.' },
      ],
      si: 'Customer කෙනෙක් "මට මනුස්සයෙක් එක්ක කතා කරන්න ඕනේ" කිව්වොත් වහාම human කෙනෙකුට යවන්න. Policy එක competitor price match ගැන නිහඬ නම් අනුමාන නොකර escalate කරන්න. නමුත් කැඩුණු blender එකට photo එකක් තියෙන සරල case එකක් නම් agentටම විසඳන්න පුළුවන්. එකම නමින් customers දෙන්නෙක් ඉන්නවා නම් email හෝ phone එක අහන්න.',
    },
    // 14
    {
      id: 'error-propagation-coverage',
      plain: "Represent errors with origin, category/code, safe message, retryability policy, affected fields/items, and provenance. Preserve the root cause through layers instead of replacing it with “failed.”",
      internGuide: ["Represent errors with origin, category/code, safe message, retryability policy, affected fields/items, and provenance. Preserve the root cause through layers instead of replacing it with “failed.”","For partial extraction or analysis, attach coverage: which pages, files, fields, or records were processed, skipped, uncertain, or inaccessible. Success plus missing coverage is not complete success.","Aggregate errors without leaking secrets or duplicating noise. Distinguish empty, not-found, forbidden, corrupt, timeout, and unsupported so downstream logic chooses correctly.","Test failure at each boundary and ensure UI/API/audit views agree. A final response must disclose material gaps and must not calculate conclusions from unprocessed data as though coverage were complete."],
      title: 'Structured Error Propagation and Coverage Annotations (Task 5.3)',
      body: [
        'Multi-agent system එකක subagent කෙනෙකුට fail වෙද්දී ඒ ගැන කියන විදිහ තමයි තීරණාත්මක. හොඳ එක: structured error context: failure type, උත්සාහ කළ query එක, අහුවුණු partial results, සහ විකල්ප. එවිට coordinator ට ඒකෙන් recover වෙන්න (වෙනත් source එකක්, partial result එකෙන් ඉදිරියට) පුළුවන්.',
        'නරක ක්‍රම: "search unavailable" වගේ generic status (වටිනා context සැඟවෙනවා); timeout එකක් empty success එකක් විදිහට යැවීම (error එක සැඟවෙනවා, report එක අසම්පූර්ණයි, කෙනෙක් දන්නෙත් නෑ); එක failure එකකට මුළු workflow එකම නැවැත්වීම. Access failure ≠ empty result.',
        'Subagent එක transient failures (timeout) එතනම retry කරලා විසඳනවා; විසඳන්න බැරි ඒවා විතරක් partial results සහ කළ උත්සාහයන් සමඟ coordinator ට යවනවා. අවසාන report එකේ coverage annotations තියෙන්න ඕනේ: හොඳින් සනාථ කළ findings මොනවාද, සහ sources නොලැබුණු නිසා gaps තියෙන topics මොනවාද.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): error එක "no results found" ලෙස සාර්ථක ලෙස යැවීම, generic error message එකක්, සහ වැඩේ සම්පූර්ණයෙන් නවත්වීම.',
      ],
      analogy: 'Courier එකක පාර්සලය බෙදන්න බැරි වුණාම "ගෙදර කවුරුත් නෑ, රෑ 7ට නැවත එන්නම්, ඔබට ගන්න පුළුවන් ළඟම outlet එක Kollupitiya" කියලා slip එකක් දානවා (structured). "Failed" කියලා විතරක් දැම්මොත් නැත්නම් "delivered" කියලා බොරුවට දැම්මොත් ඊට වඩා නරකයි.',
      example: 'Research report: topics 5යි. Search subagent එකට topic 3 සඳහා timeout වුණා. නරක: "no results for topic 3" (empty success). Report එක topic 3 ගැන කිසිවක් නැතුව නිකම්ම හොඳ report එකක් කියලා පේනවා. හොඳ: {"failure_type": "timeout", "query": "AI adoption in Sri Lankan banks 2025", "partial_results": [2 items], "alternatives": ["try news sources", "narrow to 2025"]}. Coordinator ඒක දැකලා වෙනත් source එකක් try කරනවා. අවසාන report එකේ "Topic 3: partial coverage, ප්‍රධාන source එකක් unavailable" කියලා annotation එකක් තියෙනවා.',
      keyPoints: [
        'Structured error: failure type, attempted query, partial results, alternatives.',
        'Timeout එක empty success කරන්න එපා. Access failure ≠ empty result.',
        'Subagent එක transient errors තනියම විසඳයි; අනිත් ඒවා විතරක් ඉහළට.',
        'Final report එකේ coverage annotations: සනාථ කළ vs gaps ඇති topics.',
      ],
      terms: [
        { en: 'Coverage annotation', si: 'Report එකේ හොඳින් cover වුණු සහ sources නැති නිසා gaps ඇති කොටස් සටහන් කිරීම.' },
        { en: 'Transient failure', si: 'නැවත try කළොත් හරි යන තාවකාලික අසාර්ථකත්වය (timeout).' },
      ],
      si: 'Courier කෙනෙකුට ගෙදර කවුරුත් නැති නිසා parcel එක දෙන්න බැරි වුණොත්, ආයෙත් එන වෙලාව සහ ගන්න පුළුවන් outlet එක කියන slip එකක් දෙනවා. Subagent එක timeout වුණොත් query එක, partial results සහ වෙනත් විකල්ප coordinatorට කියන්න. Timeout එක "results නෑ" කියලා සඟවන්න එපා. Report එකේ topic එකකට partial coverage තිබුණොත් ඒක පැහැදිලිව ලියන්න.',
    },
    // 15
    {
      id: 'large-codebase-context',
      plain: "Start with repository instructions and a map: top-level directories, build files, entry points, ownership, tests, and relevant dependency/call paths. Search before opening many files.",
      internGuide: ["Start with repository instructions and a map: top-level directories, build files, entry points, ownership, tests, and relevant dependency/call paths. Search before opening many files.","Use focused subagents or scratch notes for separate investigations, but require file/line evidence and keep one owner for synthesis and edits. A manifest can track reviewed and pending areas.","Compaction or summaries reduce context size but are lossy. Preserve exact requirements, decisions, failing commands, and authoritative references outside disposable narrative.","Make small diffs, run targeted tests then broader checks, and revisit the map when behavior crosses boundaries. Do not claim whole-codebase coverage from a few sampled files."],
      title: 'Context for Large Codebases: Scratchpads, Subagents, Manifests, /compact (Task 5.4)',
      body: [
        'දිගු exploration session එකක context degradation වෙනවා: Claude කලින් සොයාගත් නිශ්චිත classes වෙනුවට "typical patterns" ගැන සාමාන්‍ය විදිහට කතා කරන්න පටන් ගන්නවා. හේතුව context එක පිරිලා ඇති නිසා පරණ නිශ්චිත විස්තර බොඳ වීම.',
        'මේකට පාවිච්චි කරන මෙවලම් හතරක්: (1) Scratchpad files: key findings file එකකට ලියලා පස්සේ ආපහු කියවන එක. (2) Subagent delegation: "tests files ඔක්කොම හොයන්න", "refund flow trace කරන්න" වගේ ප්‍රශ්න subagents ට; main agent high-level coordination විතරක් කරනවා. (3) Phase summaries: phase එකක් ඉවර වුණාම summary එකක් හදලා ඊළඟ phase එකේ subagents ට දෙනවා. (4) /compact: දිගු session එකක context එක ඔබාගන්න command එක.',
        'Crash recovery: හැම agent එකක්ම තමන්ගේ state එක දන්නා ස්ථානයකට (state files) export කරනවා. Coordinator එක resume වෙද්දී manifest එකක් load කරනවා (මොනවා ඉවරයි, මොනවා in-progress, state files කොහෙද).',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "එකම දිගු session එකේ ඔක්කොම තියාගන්න", "ලොකු context window එකක්", සහ session එක නැවත ආරම්භ කරලා කිසිවක් save නොකිරීම.',
      ],
      analogy: 'විභාගයට පාඩම් කරද්දී ලොකු පොත ඇතුළත ඔක්කොම මතක තියාගන්නේ නෑ; notebook එකක (scratchpad) වැදගත් points ලියනවා, යාළුවෙක්ට (subagent) chapter එකක් කියවලා සාරාංශයක් දෙන්න කියනවා, සහ chapter එකක් ඉවර වුණාම one-page summary එකක් හදනවා. Power cut එකක් වුණොත් "කොහෙන් ඉවරද" කියලා checklist (manifest) එකෙන් බලනවා.',
      example: 'Billing module එකට tests එකතු කරන්න ඕනේ. Main agent subagent 2කට යවනවා: A "billing/ ඇතුළේ test files ඔක්කොම සොයා ලැයිස්තු කරන්න", B "refund flow trace කරන්න". ඒ දෙකෙන්ම summary පේළි 15 බැගින් ලැබෙනවා. Main agent state/findings.md එකේ ඒවා ලියනවා. Session එක කඩා වැටුණොත් manifest එකෙන් කියවෙනවා: completed = [map-structure, tests-for-invoice.py], in_progress = tests-for-refund.py. එතනින්ම ආයෙත් පටන් ගන්නවා.',
      code: {
        lang: 'json',
        src: `{
  "task": "Add tests to the billing module",
  "completed": ["map-structure", "tests-for-invoice.py"],
  "in_progress": "tests-for-refund.py",
  "state_files": ["state/structure.md", "state/findings.md"]
}`,
      },
      keyPoints: [
        'දිගු session = context degradation ("typical patterns" ගැන කතා කිරීම).',
        'Scratchpad files, subagent delegation, phase summaries, /compact.',
        'Crash recovery: agents state export කරයි; coordinator manifest load කරයි.',
        'ලොකු context window එකක් හෝ එකම දිගු session එක පිළිතුරු නෙවෙයි.',
      ],
      terms: [
        { en: 'Scratchpad file', si: 'Key findings ලියා තබන file එක; පසුව ආපහු කියවයි.' },
        { en: '/compact', si: 'දිගු session එකක context එක ඔබා කුඩා කරන command එක.' },
        { en: 'Manifest', si: 'Resume කරද්දී ඉවර/ඉතිරි වැඩ සහ state files පෙන්වන JSON file එක.' },
      ],
      si: 'Codebase එක දිගට බලද්දී කලින් හොයාගත් class names අමතක වෙන්න පුළුවන්. වැදගත් findings scratchpad එකක ලියා, files සොයන වැඩ subagentලාට බෙදා දෙන්න. අදියරක් ඉවර වුණාම summary එකක් සහ state files තියාගන්න, coordinator එක නැවත පටන් ගන්න පුළුවන්. Manifest එකෙන් ඉවර වැඩ, ඉතිරි වැඩ සහ state file තැන් සටහන් කරන්න.',
    },
    // 16
    {
      id: 'calibration-stratified-sampling',
      plain: "Confidence is calibrated when items assigned probability p are correct about p of the time. Raw model scores or verbal certainty are not automatically calibrated.",
      internGuide: ["Confidence is calibrated when items assigned probability p are correct about p of the time. Raw model scores or verbal certainty are not automatically calibrated.","Evaluate at field or decision level because a document can have a correct name and an incorrect amount. Record correctness, abstention, and coverage separately.","Stratified sampling deliberately includes languages, document types, risk tiers, rare classes, confidence bands, and known failure modes instead of only random easy cases.","Use human review to build labels and reliability diagrams, choose thresholds from error costs, oversample risky strata, and periodically refresh calibration as data/models change."],
      examRefs: ['CCAR-040'],
      title: 'Human Review, Stratified Sampling & Field-Level Confidence (Task 5.5)',
      body: [
        '97% overall accuracy කියන්නේ හොඳ ප්‍රතිඵලයක් නෙවෙයි; එයින් නිශ්චිත document types හෝ fields වල දුර්වල ප්‍රතිඵල සැඟවිය හැකියි. ඒ නිසා accuracy බලන්න document type එක අනුව සහ field එක අනුව වෙන වෙනම.',
        'Stratified random sampling: documents වර්ග (strata) වලට බෙදලා හැම එකකින්ම අහඹු ලෙස sample ගන්නවා, high-confidence extractions වලිනුත්. එවිට සැබෑ error rate එක මැනිය හැකියි, සහ ඔබ නොසිතු අලුත් error patterns හොයාගන්න පුළුවන්. High-confidence ඒවා check නොකරන්න ගියොත් ඒවායේ තියෙන වැරදි කවදාවත් පේන්නේ නෑ.',
        'Field-level confidence scores ගන්න, ඒවායේ thresholds labeled validation set එකකින් calibrate කරන්න (calibrate නොකළ self-reported confidence විශ්වාස කරන්න බෑ; phase 11 හි calibration topic එක බලන්න). Low confidence හෝ ප්‍රතිවිරුද්ධ sources සහිත items human review වලට යවන්න; reviewers සීමිත නිසා ප්‍රමුඛතා අනුව (වඩාත්ම අවදානම් ඒවා මුලින්).',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "97% නිසා review දැන්ම නවත්වන්න", "calibrate නොකළ self-reported confidence පමණක් බලන්න", "sentiment analysis".',
      ],
      analogy: 'ඉස්කෝලේ සම්පූර්ණ ශ්‍රේණියේ සාමාන්‍ය ලකුණු 97ක් වුණාට, ගණිතයට විතරක් 60ක් තියෙනවා නම් ගැටලුව පේන්නේ විෂය අනුව බැලුවාම විතරයි. Stratified sampling කියන්නේ හැම පන්තියකින්ම ළමයි කීපදෙනෙක් අහඹුවෙන් තෝරලා බලන එක.',
      example: 'Documents 1,000: typed invoices 800 (99.5% හරි = 796), handwritten receipts 200 (85% හරි = 170). Overall = (796 + 170) / 1000 = 96.6% ≈ 97%. හොඳයි වගේ. ඒත් handwritten receipts වල 15% (අයිතම 30ක) වැරදියි. Type අනුව බැලුවොත් ගැටලුව පේනවා. ඊටපස්සේ ඒ type එකෙන් තවත් sample එකක් ගන්නවා, high-confidence ඒවායිනුත්. Field-level: total field එක 99%, date field එක 88%; date field එකට විතරක් threshold එක ඉහළ දාලා low-confidence ඒවා human review වලට.',
      keyPoints: [
        '97% overall accuracy = segments සඟවයි. Document type සහ field අනුව බලන්න.',
        'Stratified random sampling (high-confidence ඒවායිනුත්) = error rate මනින්න සහ අලුත් patterns සොයන්න.',
        'Field-level confidence + labeled validation set එකෙන් thresholds calibrate කරන්න.',
        'Low confidence / conflicting sources → human review, ප්‍රමුඛතා අනුව.',
      ],
      terms: [
        { en: 'Stratified sampling', si: 'වර්ග (strata) අනුව බෙදා හැම වර්ගයෙන්ම අහඹු sample ගැනීම.' },
        { en: 'Field-level confidence', si: 'Extract කළ හැම field එකටම වෙන වෙනම confidence අගයක්.' },
        { en: 'Labeled validation set', si: 'ඇත්ත පිළිතුරු දන්නා data set එක; thresholds calibrate කිරීමට.' },
      ],
      si: 'සාමාන්‍ය accuracy 97% වුණත් handwritten receipts වල 85% විතරක් හරි වෙන්න පුළුවන්. Invoices, receipts වගේ වර්ග වෙන වෙනම බලලා හැම වර්ගයෙන්ම sample එකක් ගන්න. High-confidence කියපු දේවල්වලින්වත් ටිකක් අහඹුවෙන් පරීක්ෂා කරන්න. Date field එක 88% හරි නම් ඒක වෙනම සලකා low-confidence dates human කෙනෙකුට යවන්න.',
    },
    // 17
    {
      id: 'provenance-conflicting-sources',
      plain: "Store provenance per claim or field: source URI/document, location, publication/effective date, retrieval time, extraction method, and transformation/version.",
      internGuide: ["Store provenance per claim or field: source URI/document, location, publication/effective date, retrieval time, extraction method, and transformation/version.","When sources conflict, do not silently average or choose the most fluent. Compare authority, scope, effective date, directness, and whether they describe different entities or time periods.","Report the conflict and selected resolution rule; preserve both values when unresolved and escalate material decisions. Distinguish publication date from event or effective date.","Use primary/current sources for changing facts, cite near each claim, and test that later summaries retain provenance rather than producing unsupported certainty."],
      examRefs: ['CCAR-024'],
      title: 'Provenance, Conflicting Sources and Dates (Task 5.6)',
      body: [
        'Summarize කරද්දී claim එකයි ඒකේ source එකයි අතර සම්බන්ධය නැති වෙනවා. ඒ නිසා subagents ගෙන් structured claim–source mapping ඉල්ලන්න: claim, source_url හෝ document, excerpt, published_date, සහ conflicts_with (වෙනත් claim එකක් එක්ක ගැටෙනවා නම්). එවිට synthesis agent ට හැම අංකයකටම source එකක් පෙන්වන්න පුළුවන්.',
        'විශ්වාසනීය sources දෙකක් වෙනස් අංක දෙනවා නම් එකක් තෝරන්න එපා; දෙකම ඒවායේ source එක්ක annotate කරන්න. Publication/collection dates ඉල්ලන්න, මොකද වෙනස් කාල වල දත්ත (2023 vs 2025) නිසා ඇති වෙන වෙනස contradiction එකක් නෙවෙයි.',
        'Report එකේ well-established findings සහ contested findings වෙන් කරන්න. Content එකට අනුව format එක: financial data = tables, news = prose, technical content = lists.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): conflict එකක් තියෙද්දී "වඩාත් ඉහළ අගය" හෝ "වඩාත් නවතම" කියලා නිහඬවම එකක් තෝරන එක, සහ source නැතිව සාරාංශ කරන එක. මේක rule 5 (තොරතුරු අහිමි නොකරන්න) කඩ කිරීමක්.',
      ],
      analogy: 'Newspaper එකක් "ශ්‍රී ලංකාවේ ජනගහනය 2.2 කෝටියක්" කියනවා, වෙන එකක් "2.3 කෝටියක්" කියනවා. දෙකම ඇත්ත වෙන්න පුළුවන්: වසර දෙකක දත්ත. හොඳ පත්තරකාරයා දෙකම ලියනවා, "(2022 සංගණනය) සහ (2024 ඇස්තමේන්තුව)" කියලා. එකක් නිශ්ශබ්දව කපා දාන්නේ නෑ.',
      example: 'Claim: "35% studios used generative AI in 2025". Source A (published 2025-11-03) 35%. Source B (published 2024-06-10, 2023 data) 18%. Silent pick කරනවා වෙනුවට: "2023: 18% (Source B, 2024-06), 2025: 35% (Source A, 2025-11)". Dates නිසා ඒවා contradiction නෙවෙයි, trend එකක්. Sources A සහ C එකම වසරට 35% vs 28% කිව්වොත් ඒක real conflict: report එකේ "contested" කොටසේ දෙකම source සමඟ.',
      code: {
        lang: 'json',
        src: `{
  "claim": "35% of studios used generative AI in 2025",
  "source_url": "https://example.org/report",
  "excerpt": "...35 percent of surveyed studios...",
  "published_date": "2025-11-03",
  "conflicts_with": ["claim-17"]
}`,
      },
      keyPoints: [
        'Subagents ගෙන් claim–source mappings (URL, document, excerpt, date) ඉල්ලන්න.',
        'Conflict: දෙකම source සමඟ annotate කරන්න; එකක් නිහඬව තෝරන්න එපා.',
        'Dates ඉල්ලන්න: කාල වෙනස contradiction නෙවෙයි.',
        'Well-established vs contested වෙන් කරන්න; financial = tables, news = prose, technical = lists.',
      ],
      terms: [
        { en: 'Provenance', si: 'තොරතුරක් ආවේ කොහෙන්ද කියන සම්බන්ධය (claim → source).' },
        { en: 'Claim–source mapping', si: 'Claim එකක් එහි URL, excerpt, date සමඟ බැඳ තබන structured record එක.' },
      ],
      si: 'News දෙකක් එකම දේ ගැන වෙනස් අංක දුන්නොත් එකක් තෝරලා අනෙක මකන්න එපා. Claim එකට source, උපුටාගත් කොටස සහ දිනය ලියා තබන්න. 2023 දත්ත 18%ක් සහ 2025 දත්ත 35%ක් කියනවා නම් ඒක කාලය අනුව වෙනසක් වෙන්න පුළුවන්. එකම වසරට 35% සහ 28% කියනවා නම් දෙකම sources එක්ක contested ලෙස දක්වන්න.',
    },
    // 18
    {
      id: 'scenario-code-generation',
      plain: "Define acceptance criteria, repository boundaries, interfaces, security constraints, and tests before generating code. Inspect existing patterns and dependencies first.",
      internGuide: ["Define acceptance criteria, repository boundaries, interfaces, security constraints, and tests before generating code. Inspect existing patterns and dependencies first.","Ask for a focused implementation, review the diff, and run formatter, type/static checks, unit tests, integration tests, and security checks appropriate to risk.","Use plan/review for cross-cutting changes and independent review for high-risk code. Keep secrets unavailable, sandbox execution, and require approval for destructive or external actions.","Evaluate behavioral correctness and maintainability, not compilation alone. Preserve unrelated changes, document assumptions, and include rollback/migration when state or APIs change."],
      title: 'Scenario Case Study: Code Generation with Claude Code (Domains 3, 5)',
      body: [
        'Scenario: team එකක් Claude Code පාවිච්චි කරලා code generation, refactoring, debugging කරනවා. ඔවුන් CLAUDE.md, slash commands, plan mode පාවිච්චි කරනවා. මේ scenario එකේ ප්‍රශ්න සාමාන්‍යයෙන් "කුමන scope/කුමන file එකද" වගේ configuration තීරණ.',
        'ප්‍රශ්න රටා 5ක්: (1) "/review command එක සියලු developers ට ඕනේ" → .claude/commands/ repo එකේ (Rule 1: root cause = scope; ~/.claude/commands/ පුද්ගලිකයි, .claude/config.json commands array නැති feature එකක්). (2) "Monolith → microservices, files දස් ගණන්" → plan mode පළමුව (Rule 2: proportionate; direct execution = rework). (3) "Test files codebase පුරා විසිරී, conventions එකම" → .claude/rules/ + paths glob (Rule 2: සරලම, directory CLAUDE.md හැම folder එකකම නෙවෙයි). (4) "CLAUDE.md පේළි 900ක්" → .claude/rules/ topic files. (5) "Team skill එක මට විතරක් වෙනස් කරන්න" → ~/.claude/skills/ හි වෙනත් නමකින් personal variant.',
        'Domain 5 කොටස: දිගු refactor session එකක context degrade වෙනවා නම් scratchpad + subagent + /compact. කලින් දවසේ analyze කළ files 40න් 30ක් අද වෙනස් කළා නම් (stale tool results) → පෙර findings වල structured summary එකක් සමඟ නව session එකක් (Rule 5: තොරතුරු structured ලෙස forward කරන්න).',
        'වේගවත් තීරණ ක්‍රමය: ප්‍රශ්නයේ "team / හැමෝටම" වචන දකිනවා නම් project scope (Git); "මට විතරක්" නම් user scope (~). "සමහර files වලට විතරක්" නම් paths glob. "දිගු output" නම් context: fork.',
      ],
      analogy: 'මේක ගෙදර wifi password එක කුස්සියේ ගහපු notice එකක් ද (project) ඔයාගේ දුරකථනයේ සටහනක් ද (user) කියලා තීරණය කරනවා වගේ. අමුත්තෙක් ආවොත් notice එකෙන් තමයි ගන්නේ.',
      example: 'Sample Q: "Team එකේ අලුත් developers ට custom /deploy-check command එක හම්බ වෙන්නේ නෑ. කාගෙත් laptop එකේ ~/.claude/commands/deploy-check.md එකක් තියෙනවා." නිවැරදි: ඒක repo එකේ .claude/commands/deploy-check.md එකට ගෙනිහින් commit කරන්න. වැරදි options: "හැමෝටම ඒ file එක copy කරන්න කියන්න" (manual), "CLAUDE.md එකේ ලියන්න" (command එකක් නෙවෙයි, instructions), ".claude/config.json commands array" (නැති feature එකක්). Rule 1 + least change.',
      keyPoints: [
        'Team = project scope (Git). මට විතරක් = user scope (~).',
        'විසිරුණු files = paths glob rules. දිගු CLAUDE.md = .claude/rules/. දිගු output = context: fork.',
        'විශාල multi-file = plan mode; පැහැදිලි single-file = direct.',
        'සරලම, root cause එකට ගැලපෙන scope එක තෝරන්න (Rules 1 සහ 2).',
      ],
      terms: [
        { en: 'Scope decision', si: 'Instruction එක user/project/directory/path කුමක අයිති කරන්නද කියන තීරණය.' },
      ],
      si: 'අලුත් code generation task එකක මුලින් requirements සහ files බලලා scope එක තේරුම් ගන්න. Files ගොඩක් වෙනස් වෙනවා නම් plan එකක් හදලා අනුමත කරගන්න; එක function එකක පැහැදිලි bug එකක් නම් කෙලින්ම හදන්න. Tests මුලින් ලියා failures Claudeට දෙන්න. Team rules project CLAUDE.md එකේ තබාගන්න.',
    },
    // 19
    {
      id: 'scenario-cicd',
      plain: "Use Claude in CI for bounded analysis or draft remediation, with pinned CLI/API versions, least-privilege credentials, restricted network/tools, timeouts, and cost limits.",
      internGuide: ["Use Claude in CI for bounded analysis or draft remediation, with pinned CLI/API versions, least-privilege credentials, restricted network/tools, timeouts, and cost limits.","Inputs include the exact diff, requirements, relevant files, and rubric. Outputs are schema-validated findings with evidence and severity; untrusted output cannot directly deploy.","Deterministic tests and policy gates remain authoritative. Independent review or a human handles high-severity findings, ambiguous changes, and production promotion.","Track false positives/negatives, flaky output, duration, tokens/cost, and accepted findings. Provide failure-open/closed behavior appropriate to risk and an emergency bypass with audit."],
      title: 'Scenario Case Study: Claude Code for CI/CD (Domains 3, 4)',
      body: [
        'Scenario: automated code review, test generation, PR feedback, සහ false positives අඩු කිරීම. Domain 3 (claude -p, CI config) සහ Domain 4 (prompts, batch, multi-pass) දෙකම මෙහි එනවා.',
        'ප්‍රශ්න රටා 6ක්: (1) "CI job එක input එකකට hang වෙනවා" → claude -p (නැති CLAUDE_HEADLESS, --batch, /dev/null workaround අයින් කරන්න; Rule 2). (2) "Findings machine-readable වෙන්න ඕනේ" → --output-format json + --json-schema. (3) "සමහර findings වැරදියි, developers ignore කරයි" → explicit categorical criteria + few-shot; අවශ්‍ය නම් category එක තාවකාලිකව disable (Rule 4). (4) "Manager කියනවා pre-merge check එකයි overnight report එකයි දෙකම Batch එකට" → overnight report විතරක් batch; pre-merge synchronous (Batches API එකට SLA නෑ; custom_id නිසා ordering ගැටලුවක් නෑ). (5) "Files 14ක review අස්ථාවරයි" → per-file passes + cross-file integration pass (ලොකු context, PR කුඩා කරන්න කියන එක, consensus වැරදියි). (6) "Duplicate comments / duplicate tests" → prior findings / existing tests context එකට දෙන්න (Rule 5).',
        'Review එක code ලියපු session එකෙන්ම කරන්න එපා: වෙනම independent instance. "Findings කොච්චර dismiss වෙනවද" පරීක්ෂා කරන්න detected_pattern field එකක්.',
        'ඉක්මන් නීතිය: developers බලාගෙන ඉන්නවා = synchronous; නැත්නම් + ලාභය ඕනේ = Batches. තීරණය කරන Rules: 2 (සරල), 4 (explicit criteria), 5 (information).',
      ],
      analogy: 'CI review robot එක ඔයාගේ කඩේ stock check කරන auditor කෙනෙක්. හැම බිල්පතකටම කෙලින්ම "වැරදියි" කියලා ගහනවා නම් (false positives) ඔයා ඔහුට සවන් දෙන්නේ නෑ. "මෙන්න කොහොමද වැරදි බිල්පතක් හඳුනාගන්නේ" කියලා නීති + උදාහරණ දුන්නාම විතරයි විශ්වාස කරන්නේ.',
      example: 'Sample Q: "Manager: PR එකේ pre-merge check එකයි, සතිපතා tech-debt report එකයි දෙකම Batch API වලින් 50% ලාභයට කරන්න." නිවැරදි: tech-debt report එක විතරක් batch. Pre-merge check එක developers බලාගෙන ඉන්න නිසා synchronous. Distractors: "Batch API එකට SLA තියෙනවා" (නෑ, පැය 24 දක්වා), "ordering ගැටලු එයි" (custom_id තියෙනවා), "fallback logic එකතු කරන්න" (අනවශ්‍ය සංකීර්ණත්වය, Rule 2).',
      keyPoints: [
        'Hang → claude -p; machine-readable → json + schema; false positives → explicit criteria + few-shot.',
        'Blocking pre-merge = synchronous; overnight/weekly = Batches.',
        'Files ගොඩක් = per-file + integration pass; review = independent instance.',
        'Duplicates → prior findings / existing tests context එකට.',
      ],
      terms: [
        { en: 'Pre-merge check', si: 'Merge කරන්න කලින් run වෙන, developers බලාගෙන ඉන්න check එක.' },
      ],
      si: 'CI job එකට කවුරුත් input දෙන්න ඉන්නෙ නැති නිසා claude -p භාවිතා කරන්න. PR එකට JSON findings ඕනේ නම් output format සහ schema දෙන්න. Pre-merge check එක synchronous වෙන්න ඕනේ, රාත්‍රී report එක Batch වෙන්න පුළුවන්. Files 14ක් තිබුණොත් file-by-file review සහ cross-file review කරන්න. Duplicate commentsээс බේරෙන්න කලින් findings-ийгත් prompt එකට දෙන්න.',
    },
    // 20
    {
      id: 'scenario-structured-extraction',
      plain: "Define a schema with required, optional, and nullable fields plus units/formats and field-level provenance. Include explicit unknown/not-present handling rather than fabricated values.",
      internGuide: ["Define a schema with required, optional, and nullable fields plus units/formats and field-level provenance. Include explicit unknown/not-present handling rather than fabricated values.","Use OCR/document inputs with page boundaries, strict outputs where supported, and validation for dates, totals, identifiers, cross-field arithmetic, and allowed enums.","Retry malformed/correctable output only; missing pages, unreadable scans, conflicts, or absent evidence require abstention or human review, not repeated guessing.","Evaluate exact/normalized field accuracy, coverage, calibration, and high-cost errors by document type/language. Store source regions and review sensitive data handling."],
      title: 'Scenario Case Study: Structured Data Extraction (Domains 4, 5)',
      body: [
        'Scenario: unstructured documents (invoices, contracts) වලින් data extract කරලා JSON schema validate කරලා downstream systems වලට යවනවා. Domain 4 (schema, retry, batch) සහ Domain 5 (confidence, human review) අමුණනවා.',
        'ප්‍රශ්න රටා 6ක්: (1) "Document එකේ නැති fields model එක හදනවා (fabricate)" → nullable fields (required නෙවෙයි). (2) "Category එක සමහරවිට අපැහැදිලියි, අලුත් category එනවා" → enum + "unclear" + "other" + detail string. (3) "Schemas කිහිපයක්, document type නොදනී, structured output අනිවාර්‍යයි" → tool_choice: any. (4) "Totals නොගැලපෙනවා" → calculated_total vs stated_total + validation-retry (error එක්ක). (5) "Retry කරන්න ඕනද?" → තොරතුරු document එකේ නැත්නම් නෑ: null + human review. (6) "Results පැය 30ක් ඇතුළත, batch පැය 24" → පැය 4න් 4ට submit.',
        'Domain 5 එකතුව: "overall accuracy 97%, human review අඩු කරමුද?" → මුලින් type සහ field අනුව accuracy විශ්ලේෂණය + stratified random sampling (high-confidence ඒවායිනුත්); එකම ප්‍රමාණවත් නෑ calibrate නොකළ self-confidence. Conflicting sources → දෙකම annotate. Field-level confidence + labeled validation set.',
        'තීරණය කරන Rules: 4 (explicit schema/criteria), 5 (null/unclear/other සහ errors preserve කරන්න, තොරතුරු අහිමි නොකරන්න), 2 (simple fix: schema change, classifier train කරන්න එපා).',
      ],
      analogy: 'Data entry operator ට form එකේ "NIC අංකය" නැති customer කෙනෙක් ඉන්නවා. "හිස්ව තියන්න" කිව්වොත් හරි. "අනිවාර්‍යයි" කියලා කිව්වොත් අහවල් අංකයක් ලියනවා. Supervisor ගේ අවසාන check එක (human review) හැම form එකක්ම බලන්නේ නෑ, වර්ග අනුව sample බලනවා.',
      example: 'Sample Q: "Extraction pipeline එක ලේඛන වලින් PO number එක නොපෙනෙන විට වැරදි අගයක් දෙනවා. Retries 3ක් කරලත් වෙනස් නෑ. PO number එක තියෙන්නේ වෙනම email එකක." නිවැරදි: PO field එක nullable කරලා null දෙන්න සහ human review/ඒ email එකත් input එකට එකතු කරන එක. වැරදි options: "retry limit වැඩි කරන්න", "temperature අඩු කරන්න", "bigger model". Retry වැඩ කරන්නේ format/structure errors වලට පමණයි.',
      keyPoints: [
        'Nullable (fabrication නෑ), unclear/other + detail, tool_choice any, calculated vs stated total.',
        'Retry = format errors වලට; තොරතුරු නැති විට null + human review.',
        'Batches: ලාභ 50%, පැය 24, SLA 30 → පැය 4න් 4ට. Failures custom_id වලින්.',
        'Overall accuracy එකෙන් රැවටෙන්න එපා: type/field අනුව + stratified sampling.',
      ],
      terms: [
        { en: 'Fabrication', si: 'Document එකේ නැති අගයක් model එක හදා දීම (hallucination).' },
      ],
      si: 'Invoice එකේ due date එක නැත්නම් null දෙන්න, හදලා දාන්න එපා. Category එක නොපැහැදිලි නම් unclear හෝ other භාවිතා කරලා detail එක ගන්න. Rs. 5,500 total එක line items එකතුවට ගැලපෙනවද validate කරන්න. ලේඛනයේ PO number එක නැත්නම් retries නෙවෙයි, null සහ human review යොදන්න. විවිධ ලේඛන වර්ග අනුව accuracy බලන්න.',
    },
    // 21
    {
      id: 'six-rules-mini-exam',
      plain: "Rule 1: fix the root cause and assign responsibility to the component that owns it. Rule 2: make criteria, tool descriptions, schemas, and outputs explicit.",
      internGuide: ["Rule 1: fix the root cause and assign responsibility to the component that owns it. Rule 2: make criteria, tool descriptions, schemas, and outputs explicit.","Rule 3: enforce deterministic or safety-critical constraints in trusted code. Rule 4: keep reviews independent when independence matters.","Rule 5: preserve structured error and coverage information. Rule 6: grant the least privilege that still permits the task.","For every scenario identify owner, evidence, side effect, authority, failure class, and recoverability. Reject attractive answers that invent unsupported features or hide uncertainty."],
      title: 'The 6 Answer-Selection Rules: 6 Mini Exam Questions and Numbers to Remember',
      body: [
        'CCAR-F පිළිතුරු තෝරද්දී නැවත නැවත පෙනෙන නීති 6ක්: (1) Root cause එකට විසඳුම. (2) සරලම, proportionate පළමු පියවර. (3) අනිවාර්‍ය නීති = code (hooks/gates). (4) Explicit criteria + few-shot ("be careful" නෙවෙයි). (5) තොරතුරු අහිමි නොකරන්න (errors, sources, dates, conflicts structured). (6) Least privilege. පහත ප්‍රශ්න 6 තනි තනිව උත්සාහ කරලා, පස්සේ example කොටසේ පිළිතුරු බලන්න.',
        'Q1 (Rule 3). Support agent එක $500ට වැඩි refunds සමහර වෙලාවට manager ගේ අනුමැතියක් නැතිව process කරනවා. System prompt එකේ "$500ට වැඩි නම් අනුමත කරගන්න" කියලා තියෙනවා. හොඳම විසඳුම? A) prompt එකට තව ශක්තිමත් වචන දාන්න B) PreToolUse hook එකකින් $500ට වැඩි refunds block කරලා escalation එකට යවන්න C) few-shot examples 10ක් දාන්න D) refund ඉල්ලන messages classifier එකකින් route කරන්න.',
        'Q2 (Rule 1). Research report එක "visual arts" ගැන විතරයි, නමුත් topic එක "creative industries" (music, film, writing, visual arts). Logs: subagents ඔවුන්ට දුන්න වැඩ හරියට කළා. Root cause? A) Search subagent එක දුර්වලයි B) Synthesis agent එක topics මඟහැරියා C) Coordinator ගේ task decomposition එක ඉතා පටුයි D) Subagents ට වැඩි tokens දෙන්න.',
        'Q3 (Rule 2). Support agent order ප්‍රශ්න වලට වැරදි tool එක තෝරනවා. Tool descriptions වචන කිහිපයක් විතරයි. පළමු පියවර? A) routing classifier එකක් හදන්න B) Tool descriptions වල inputs, උදාහරණ, boundaries විස්තර කරන්න C) Tools ඔක්කොම එකක් කරන්න D) Few-shot 20ක් එකතු කරන්න.',
        'Q4 (Rule 4). CI review bot ගේ findings වලින් 40% developers dismiss කරයි. කුමක්ද? A) "Be conservative, high-confidence findings විතරක් report කරන්න" B) Bigger model C) Explicit categorical criteria ("bugs සහ security විතරක්, minor style skip") + few-shot, ගැටලුකාරී category එක තාවකාලිකව disable D) Developers ට training දෙන්න.',
        'Q5 (Rule 5). Search subagent එකක් timeout වුණා. Subagent එක coordinator ට මොනවා යැවිය යුතුද? A) "No results" (සාර්ථක) B) Generic "search unavailable" C) Failure type, query, partial results, alternatives D) මුළු workflow එකම නවත්වන්න.',
        'Q6 (Rule 6). /map-codebase skill එක ලොකු output එකක් ඇති කරයි සහ destructive tools භාවිතා කළ නොහැකි විය යුතුයි. Frontmatter? A) context: fork සහ allowed-tools: Read, Grep, Glob B) context: main සහ allowed-tools: * C) CLAUDE.md එකට ලියන්න D) argument-hint එකක් විතරක්.',
      ],
      analogy: 'නීති 6ක් කියන්නේ cricket එකේ ඇම්පයර් ගේ මූලික සංඥා 6ක් වගේ. ගැටලුව දැක්ක ගමන් "මෙය කුමන සංඥාවද" කියලා හඳුනාගත්තොත් පිළිතුර තෝරන එක ලේසියි.',
      example: 'පිළිතුරු: Q1 = B (Rule 3: මුදල් නීතිය hook එකකින්; prompt/few-shot probabilistic; classifier එකෙන් tool order ගැටලුව විසඳෙන්නේ නෑ). Q2 = C (Rule 1: subagents හරියට වැඩ කළා; root cause coordinator ගේ decomposition). Q3 = B (Rule 2: කුඩාම පළමු පියවර; classifier/routing/merge over-engineering; few-shot tokens වැඩි, root cause විසඳෙන්නේ නෑ). Q4 = C (Rule 4: "be conservative" අපැහැදිලි). Q5 = C (Rule 5: A error සඟවයි, B context නැති, D අනවශ්‍ය). Q6 = A (Rule 6: least privilege + fork).',
      keyPoints: [
        'අංක: ප්‍රශ්න 60 / මිනිත්තු 120 / pass score 720 (1,000න්). Scenarios 6න් 4ක් random.',
        'Domain weights: D1 27%, D3 20%, D4 20%, D2 18%, D5 15%.',
        'Batches: 50% ලාභ / පැය 24. Tools: agent එකකට 4-5. I/O examples 2-3; few-shot 2-4.',
        'Retake: දින 14 / 30 / 90. Credential වලංගු මාස 12.',
        'වහාම ඉවත් කරන්න: "classifier train", "ලොකු model/context", "be careful", self-confidence/sentiment, error සඟවන, developers ට බර, නැති flags (CLAUDE_HEADLESS, --batch, config.json commands).',
        'Exam guide එකේ "Task tool" = වත්මන් docs වල "Agent tool". tool_choice "any" අර්ථය එකම.',
      ],
      terms: [
        { en: 'Pass score 720 / 1,000', si: 'Exam එක pass වෙන්න ඕනේ scaled score එක; domain % වලින් නෙවෙයි, මුළු score එකෙන් තීරණය වෙනවා.' },
        { en: 'Distractor', si: 'ඇත්තක් වගේ පෙනුනාට වැරදි පිළිතුර; බොහෝවිට නැති feature එකක් නම් කරයි.' },
      ],
      si: 'පිළිතුර තෝරද්දී root cause එකට යන්න, සරල පළමු පියවර තෝරන්න, මුදල් වගේ hard rule එකක් code gate එකකින් enforce කරන්න, vague prompt වෙනුවට criteria සහ examples දෙන්න, error/source/date සඟවන්න එපා, සහ අවශ්‍ය tools විතරක් දෙන්න. Batch එක 50% අඩු වියදමක් නමුත් පැය 24ක් ගත විය හැකියි. Exam ප්‍රශ්න ගණන, කාලය සහ pass score public page එකෙන් හෝ Partner Academy booking page එකෙන් නැවත තහවුරු කරන්න.',
    },
    // 21b
    {
      id: 'official-sample-question-patterns',
      plain: "Treat official sample questions as examples of reasoning patterns, not a complete question bank or guarantee of live-exam wording. Verify that the source is actually official and current.",
      internGuide: ["Treat official sample questions as examples of reasoning patterns, not a complete question bank or guarantee of live-exam wording. Verify that the source is actually official and current.","Extract the tested distinction: prompt versus code enforcement, root cause versus symptom, independent review, structured error, context management, or least privilege.","For each option explain why it succeeds or fails under the stated constraints. Watch for absolute claims, renamed features, plausible-but-unsupported fields, and answers solving a different problem.","Create new scenarios with changed numbers and domains, then answer without memorizing letters. Recheck product-specific facts in current docs because certification content and APIs evolve."],
      title: 'Official Sample Questions: 12 Scenarios and the Patterns Behind Them',
      body: [
        'Exam guide එකේ සාම්පල ප්‍රශ්න 12ක් තියෙනවා. Study PDF එකේ තියෙන්නේ ඒවායේ සාරාංශයක් පමණයි: scenario එක, ගැටලුව, නිවැරදි පිළිතුර, සහ අනෙක් පිළිතුරු වැරදි ඇයි කියන එක. සම්පූර්ණ ප්‍රශ්න සහ විකල්ප කියවන්න official exam guide PDF එක බලන්න. මෙතන තියෙන්නේ ඒවායින් ඉගෙනගන්න පුළුවන් රටා.',
        'ප්‍රශ්න 12ම බැලුවාම එකම අදහස් ටික නැවත නැවත එනවා. "පළමු පියවර" අහන විට වඩාත්ම අඩු වෑයමකින් root cause එක විසඳන පිළිතුර. මුදල්, identity, security නීති නම් hooks හෝ programmatic gates. අපැහැදිලි තීරණ නම් explicit criteria සහ few-shot. Logs වල root cause එක පේන විට, වෙනත් කොටස් වෙනස් කරන පිළිතුරු අත්හරින්න. අන්තිමට, නොපවතින flags, files, env vars තියෙන පිළිතුරු වහාම ඉවත් කරන්න.',
        'පහළ terms වල 12 ප්‍රශ්නයම තියෙනවා. එකින් එක කියවලා, පිළිතුර බලන්න කලින් ඔයාම root cause එක සහ නිවැරදි විසඳුම කියන්න පුළුවන්ද කියලා බලන්න. ඊට පස්සේ Exam Practice එකේ CCAR-F ප්‍රශ්න 40 කරන්න.',
      ],
      analogy: 'Cricket coach කෙනෙක් පරණ match videos 12ක් බලලා "හැම පාරම අපි පරදින්නේ එකම වැරැද්දකින්" කියලා හොයාගන්නවා වගේ. මේ සාම්පල ප්‍රශ්න 12 බලලා, exam එකේ නැවත නැවත එන රටා 5ක් හොයාගන්න පුළුවන්.',
      example: 'Sample 10 බලන්න: CI job එක input එකක් බලාගෙන hang වෙනවා. විසඳුම claude -p (non-interactive mode). CLAUDE_HEADLESS කියන environment variable එකක් හෝ --batch කියන flag එකක් තියෙන පිළිතුරු දැක්කොත්, ඒවා නැති features නිසා ඒ වහාම වැරදියි. /dev/null වලට input redirect කරන එක workaround එකක් පමණයි.',
      keyPoints: [
        '"පළමු පියවර" = වඩාත්ම අඩු වෑයමකින් root cause එක විසඳන පිළිතුර.',
        'මුදල් / identity / security නීති = hooks හෝ programmatic gates, prompts නෙවෙයි.',
        'අපැහැදිලි තීරණ = explicit criteria + few-shot examples.',
        'Logs වල root cause එක පේන විට වෙනත් කොටස් වෙනස් කරන පිළිතුරු අත්හරින්න.',
        'නොපවතින flags / files / env vars තියෙන පිළිතුරු වහාම ඉවත් කරන්න.',
      ],
      terms: [
        { en: 'Sample 1 · Support', si: 'ගැටලුව: agent එක 12% අවස්ථාවල get_customer මඟහරිමින් වැරදි refunds කරනවා. නිවැරදි: verified customer ID එකක් ලැබෙන තුරු lookup_order සහ process_refund block කරන programmatic prerequisite. වැරදි ඇයි: prompt සහ few-shot probabilistic (මුදල් අවදානමට ප්‍රමාණවත් නැහැ); routing classifier එකෙන් tool order ගැටලුව විසඳෙන්නේ නැහැ.' },
        { en: 'Sample 2 · Support', si: 'ගැටලුව: order ප්‍රශ්න වලට වැරදි tool එක තෝරනවා; descriptions ගොඩක් කෙටියි. නිවැරදි: tool descriptions විස්තර කරන්න (inputs, උදාහරණ, boundaries). වැරදි ඇයි: few-shot = tokens වැඩියි, root cause විසඳෙන්නේ නැහැ; routing layer = over-engineering; tools එකක් කිරීම "පළමු පියවර" එකට වඩා විශාලයි.' },
        { en: 'Sample 3 · Support', si: 'ගැටලුව: first-contact resolution 55%; සරල cases escalate වෙනවා, සංකීර්ණ cases agent තනියම අල්ලනවා. නිවැරදි: explicit escalation criteria + few-shot examples. වැරදි ඇයි: self-reported confidence විශ්වාසනීය නැහැ; classifier = over-engineering; sentiment ≠ complexity.' },
        { en: 'Sample 4 · Claude Code', si: 'ගැටලුව: /review command එක repo එකේ සියලු developers ට ඕනේ. නිවැරදි: .claude/commands/ (repo එකේ). වැරදි ඇයි: ~/.claude/commands/ පුද්ගලිකයි; CLAUDE.md = instructions; .claude/config.json commands array කියලා දෙයක් නැහැ.' },
        { en: 'Sample 5 · Claude Code', si: 'ගැටලුව: monolith එකක් microservices වලට, files දස ගණනක්. නිවැරදි: plan mode පළමුව. වැරදි ඇයි: direct execution වලින් rework වෙනවා; complexity එක දැනටමත් පැහැදිලියි.' },
        { en: 'Sample 6 · Claude Code', si: 'ගැටලුව: codebase එක පුරා විසිරුණු test files වලට එකම conventions. නිවැරදි: .claude/rules/ + paths glob. වැරදි ඇයි: root CLAUDE.md = inference; skills = manual හෝ අනිශ්චිත; subdirectory CLAUDE.md = directory වලට බැඳිලා.' },
        { en: 'Sample 7 · Research', si: 'ගැටලුව: report එක visual arts ගැන පමණයි. නිවැරදි: coordinator ගේ decomposition එක ඉතා පටුයි. වැරදි ඇයි: subagents හරියට වැඩ කළා; ගැටලුව ඒවාට දීපු වැඩයි.' },
        { en: 'Sample 8 · Research', si: 'ගැටලුව: search subagent එක timeout වුණා. නිවැරදි: structured error context (failure type, query, partial results, alternatives). වැරදි ඇයි: generic status = context නැහැ; empty success = error suppression; මුළු workflow එකම නවත්වීම අනවශ්‍යයි.' },
        { en: 'Sample 9 · Research', si: 'ගැටලුව: synthesis agent ට verification round trips ගොඩක්; 85% ක්ම සරල checks. නිවැරදි: synthesis agent ට scoped verify_fact tool එකක්; සංකීර්ණ ඒවා coordinator හරහා. වැරදි ඇයි: batching = blocking dependencies; සියලු tools දීම = least privilege උල්ලංඝනය; caching = අනුමානයක්.' },
        { en: 'Sample 10 · CI/CD', si: 'ගැටලුව: CI job එක input එකක් බලාගෙන hang වෙනවා. නිවැරදි: claude -p. වැරදි ඇයි: CLAUDE_HEADLESS සහ --batch කියලා දේවල් නැහැ; /dev/null = workaround එකක්.' },
        { en: 'Sample 11 · CI/CD', si: 'ගැටලුව: manager කියනවා pre-merge check එකයි overnight report එකයි දෙකම batch එකට දාන්න කියලා. නිවැරදි: overnight report එක විතරක් batch; pre-merge check එක synchronous. වැරදි ඇයි: batch එකට latency SLA නැහැ (පැය 24 දක්වා); custom_id නිසා ordering ගැටලුවක් නැහැ; fallback එකක් අනවශ්‍ය සංකීර්ණතාවයි.' },
        { en: 'Sample 12 · CI/CD', si: 'ගැටලුව: files 14ක review එකක් අස්ථාවරයි. නිවැරදි: per-file passes + cross-file integration pass. වැරදි ඇයි: PR එක split කිරීම developers ට බරයි; විශාල context window එකෙන් attention ගැටලුව විසඳෙන්නේ නැහැ; consensus = සැබෑ bugs සඟවනවා.' },
      ],
      si: 'Sample questions 12ක් කියවද්දී root cause එක හඳුනාගෙන අවම වැඩෙන් විසඳන පිළිතුර තෝරන්න. Money, identity හෝ security නීති prompt එකකට පමණක් නොතබා code gate එකකින් enforce කරන්න. Logs වල හේතුව පේනවා නම් වෙනත් පද්ධතියක් අලුතින් හදන්න එපා. නැති flags සහ config files තියෙන පිළිතුරු තෝරන්න එපා.',
    },
    // 22
    {
      id: 'ccar-f-study-plan-12-weeks',
      plain: "Start from the current official blueprint and a diagnostic. A 12-week schedule is a template; allocate time by domain weight, weakness, and hands-on evidence rather than equal chapters.",
      internGuide: ["Start from the current official blueprint and a diagnostic. A 12-week schedule is a template; allocate time by domain weight, weakness, and hands-on evidence rather than equal chapters.","Cycle each week through learn, implement, break/test, explain, and spaced review. Build small artifacts for instructions/rules, skills, agent loops, tools/MCP, structured extraction, and CI review.","Maintain an error log by misconception, not just question. Revisit official docs and run mixed timed scenarios in later weeks; include unknown-feature and conflicting-source traps.","Finish with two full reviews, weak-area repair, and exam-system preparation. A study plan cannot replace required production experience or guarantee a pass."],
      title: 'AND MORE: 12-Week CCAR-F Study and Practice Plan (for an AWS Tech Lead)',
      body: [
        'ඔයා AWS-focused full-stack tech lead කෙනෙක්, ඒ නිසා Claude වල ඔයාට හුරු AWS සමානකම් තියෙනවා: Hooks/gates = IAM/SCP guardrails (prompt = "කරුණාකර" email එකක් වගේ, guardrail = ඇත්ත permission). Batches API ≈ SQS + batch jobs (ලාභයි, latency ඉවසනවා). User/project scope ≈ IAM user policy vs account-level policy. Validation-retry ≈ schema validation Lambda + DLQ. Escalation ≈ DLQ → human on-call. Least privilege ≈ IAM least privilege. (Bedrock, PrivateLink වගේ AWS දේවල් CCAR-F scope එකෙන් පිටත, optional.)',
        'සති 1: Partner Academy හි current exam format සහ blueprint තහවුරු කරලා 6 reasoning rules සහ phases 10-12 revise කරන්න. සති 2-3: Domain 1: stop_reason loop එක ලියන්න, coordinator + subagents 2ක්, tool-policy gate එකක්. සති 4: Domain 2: tool descriptions, error types, model-compatible tool choice, MCP configuration. සති 5-6: Domain 3 hands-on: project CLAUDE.md + @import, .claude/rules/ paths, skill, GitHub Action එකේ pinned `claude -p`. සති 7: Domain 4: nullable schema + validation/retry + කුඩා Batches job එක + independent review. සති 8: Domain 5: case facts block, escalation criteria, structured errors, context compaction.',
        'සති 9: Scenarios 6 ම; එකක් දිනපතා: ඉලක්කය underline කරලා rule හඳුනාගන්න. සති 10: PDF එකේ practice sets (20 + 12 + 20 ප්‍රශ්න) කාල සීමාවකින් (ප්‍රශ්නයකට මිනිත්තු 2). සති 11: දුර්වල domain එකට ආපහු; වැරදි පිළිතුරු "මොන rule එකද මම කඩ කළේ" කියලා ලොගය තියන්න. සති 12: cheat sheet දිනපතා, scenario ඉලක්ක ගැන, "most effective / first step / root cause" යටි ඉරි, flag-and-move පුරුද්ද. කාල කළමනාකරණය: scenario එකකට ප්‍රශ්න ~15 ක්, මිනිත්තු ~30 ක්; ප්‍රශ්නයකට මිනිත්තු 2කට වැඩි නම් flag කරලා ඉදිරියට; හිස් පිළිතුරක් තියන්න එපා.',
        'දෛනික රිද්මය: දවසකට පැය 1-1.5 (සතියකට ~8-10). සතියකට එක පාර ඇත්ත Claude Code / API එකෙන් ප්‍රායෝගික lab එකක් (අවම වශයෙන් Domain 3-5 සඳහා ඉහත snippets 8 ලියා run කරන්න). Exam එක නොපවතින features distractors ලෙස දාන නිසා ඇත්තටම පාවිච්චි කරලා තියෙන එක විශාල වාසියක්. Exam එක NDA යටතේ, ප්‍රශ්න කිසිවෙකු සමඟ බෙදා ගන්න එපා. Fail වුණොත් retake කරන්න ඉන්න ඕනේ දින 14 / 30 / 90 (verify in current exam guide).',
      ],
      analogy: 'මේක A/L ගිණුම්කරණ විභාගයට සූදානම් වෙනවා වගේ: පළමු මාස කීපය පාඩම් (domains), ඊළඟට past papers (practice sets), අන්තිම සතියේ short notes (cheat sheet). Past paper එකක වැරදුණු හැම ප්‍රශ්නයකටම "මම මොන නීතිය අමතක කළාද" කියලා ලියාගන්න.',
      example: 'ඔයාගේ සතිය 6: සඳුදා project CLAUDE.md + @docs/api.md (පැය 1). අඟහරුවාදා .claude/rules/testing.md paths glob (පැය 1). බදාදා SKILL.md context: fork (පැය 1.5). බ්‍රහස්පතින්දා GitHub Action එකේ claude -p --output-format json --json-schema (පැය 1.5). සිකුරාදා /memory වලින් check කරලා Domain 3 ප්‍රශ්න 10ක් (මිනිත්තු 20). සති අන්තයේ වැරදි පිළිතුරු "rule #" ලොගය. මෙහෙම ගත්තාම සති 12 අවසානයේ ප්‍රශ්න 60 ම හුරු රටාවක් වෙනවා.',
      keyPoints: [
        'සති 1: format + rules; 2-3: D1; 4: D2; 5-6: D3 hands-on; 7: D4; 8: D5.',
        'සති 9: scenarios 6ම; 10: practice sets (ප්‍රශ්නයකට මිනිත්තු 2); 11: දුර්වල domain; 12: cheat sheet + exam strategy.',
        'ඇත්ත Claude Code / API වලින් ප්‍රායෝගිකව කරන්න: distractors නැති features නම් කරයි.',
        'AWS සමානකම්: hooks=guardrails, Batches=SQS/batch, scopes=IAM, escalation=DLQ.',
      ],
      terms: [
        { en: 'Practice sets', si: 'PDF එකේ practice exam 1, official 12 samples, practice exam 2 (20 + 12 + 20).' },
        { en: 'Flag and move', si: 'මිනිත්තු 2කට වඩා ගියොත් flag කරලා ඉදිරියට යාම.' },
      ],
      si: 'සති 12ක සැලැස්මට සෑම සතියකම පාඩමක් සහ පුහුණුවක් බෙදාගන්න. මුලින් exam domains සහ මුල් concepts ඉගෙනගෙන, පසුව Claude Code, prompting සහ reliability වැඩ කරන්න. සතියෙන් සතිය practice questions කරන්න, වැරදි පිළිතුරු සටහන් කර නැවත බලන්න. අවසාන සතියේ mock exam එකක් කරලා දුර්වල කොටස් නැවත අධ්‍යයනය කරන්න.',
    },
  ],
  quiz: [
    {
      q: 'අලුතින් join වුණු developer ට Claude Code එක team ගේ testing conventions අනුගමනය කරන්නේ නෑ. conventions තියෙන්නේ senior developer කෙනෙකුගේ ~/.claude/CLAUDE.md එකේ. හොඳම විසඳුම?',
      options: [
        'අලුත් developer ට ඒ file එක email කරන්න',
        'Conventions project-level CLAUDE.md (හෝ .claude/rules/) එකට ගෙනිහින් Git එකට commit කරන්න',
        '~/.claude/CLAUDE.md එක ලොකු කරන්න',
        '.claude/config.json එකේ commands array එකක් හදන්න',
      ],
      answer: 1,
      why: 'User-level file එක ඔහුට පමණයි, Git වලට යන්නේ නෑ. Team standards project scope එකට. .claude/config.json commands array කියන්නේ නැති feature එකක්.',
    },
    {
      q: 'Terraform conventions Claude Terraform files edit කරද්දී විතරක් load වෙන්න ඕනේ. හොඳම ක්‍රමය?',
      options: [
        'Root CLAUDE.md එකේ Terraform section එකක්',
        'හැම folder එකකම CLAUDE.md එකක්',
        '.claude/rules/terraform.md එකේ paths: ["terraform/**/*"]',
        'Skill එකක් හදන්න',
      ],
      answer: 2,
      why: 'Path-specific rule (paths glob) ගැලපෙන files edit කරද්දී විතරක් load වෙනවා, tokens ඉතිරි වෙනවා. Root CLAUDE.md හැමවෙලේම load වෙනවා; skills manual/අනිශ්චිතයි.',
    },
    {
      q: 'CI/CD pipeline එකේ Claude Code run කරද්දී job එක input එකක් එනතුරු hang වෙනවා. නිවැරදි විසඳුම?',
      options: [
        'CLAUDE_HEADLESS=true environment variable එක දාන්න',
        'claude -p (--print) flag එක පාවිච්චි කරන්න',
        '--batch flag එක දාන්න',
        'stdin එක /dev/null වලට redirect කරන්න',
      ],
      answer: 1,
      why: '-p / --print යනු non-interactive mode එකයි. CLAUDE_HEADLESS සහ --batch නැති features; /dev/null workaround එකක්, නිවැරදි විසඳුම නෙවෙයි.',
    },
    {
      q: 'Invoice extraction එකේ සමහර invoices වල due_date නැහැ, නමුත් model එක අගයක් හදනවා (fabricate). ප්‍රධාන විසඳුම?',
      options: [
        'due_date field එක required කරන්න',
        'Temperature 0 කරන්න',
        'due_date field එක nullable කරන්න (["string","null"]) සහ නැත්නම් null දෙන්න කියන්න',
        'Retry loop එක 5 ගුණයක් කරන්න',
      ],
      answer: 2,
      why: 'Required field එකක් document එකේ නැති විට model එක fabricate කරයි. Nullable කරන එක root cause විසඳයි.',
    },
    {
      q: 'Documents 5,000ක් රාත්‍රියේ extract කරන්න ඕනේ; ප්‍රතිඵල පැය 30ක් ඇතුළත ලැබිය යුතුයි, Batches API එක පැය 24 දක්වා ගනී. Batches submit කළ යුත්තේ?',
      options: [
        'දිනකට එක වරක්',
        'පැය 12න් 12ට',
        'පැය 4න් 4ට',
        'සතියකට එක වරක්',
      ],
      answer: 2,
      why: 'Worst case 4 + 24 = පැය 28 ≤ 30. පැය 12න් 12ට 36 වැඩියි; දිනකට එක වරක් 48 වැඩියි.',
    },
    {
      q: 'Batches API 50% ලාභයි කියලා manager කියනවා pre-merge code check එක සහ overnight tech-debt report එක දෙකම batch එකට දාන්න. හොඳම පිළිතුර?',
      options: [
        'දෙකම batch එකට දාන්න, fallback logic එකක් එක්ක',
        'Overnight report එක විතරක් batch; pre-merge check synchronous',
        'දෙකම synchronous වලින්',
        'Pre-merge එක batch, report එක synchronous',
      ],
      answer: 1,
      why: 'Developers බලාගෙන ඉන්නා blocking check එකට batch නුසුදුසුයි (SLA නෑ, පැය 24 දක්වා). Overnight report latency ඉවසන නිසා batch හොඳයි.',
    },
    {
      q: 'Files 14ක PR එකක් එක pass එකකින් review කරද්දී ප්‍රතිඵල අස්ථාවරයි, සමහර files ගැඹුරට, සමහර ඒවා නැහැ, findings ප්‍රතිවිරුද්ධයි. හොඳම විසඳුම?',
      options: [
        'වඩා විශාල context window එකක් ඇති model එකක්',
        'PR කුඩා කරන්න කියා developers ට කියන්න',
        'Per-file local passes + වෙනම cross-file integration pass',
        'Runs 3ක consensus ගන්න',
      ],
      answer: 2,
      why: 'Attention dilution නිසා multi-pass. ලොකු context එක මෙය විසඳන්නේ නෑ; PR කුඩා කිරීම developers ට බර; consensus සැබෑ bugs සඟවයි.',
    },
    {
      q: 'දිගු support chat එක summarize කළාම customer ගේ $89.40 refund ඉල්ලීම සහ delivery date එක අහිමි වුණා. නිවැරදි ප්‍රවේශය?',
      options: [
        'Summary එක තව සංක්ෂිප්ත කරන්න',
        'Case facts block එකක (amount, dates, IDs, status) summarize නොකර හැම prompt එකකම මුලට යවන්න',
        'ලොකු context window එකක් ඇති model එකක්',
        'Conversation history එක යවන්න එපා (API එක stateful)',
      ],
      answer: 1,
      why: 'Progressive summarization අංක/දින අපැහැදිලි කරයි. API එක stateless, ඒ නිසා history යැවිය යුතුයි, case facts block එකත් එක්ක.',
    },
    {
      q: 'Research agent එකක subagent කෙනෙකුට ප්‍රධාන source එකට timeout වුණා. Coordinator ට හොඳම report එක?',
      options: [
        '"No results found" (empty success)',
        '"Search unavailable" (generic)',
        'Failure type, attempted query, partial results, alternatives (structured error)',
        'මුළු workflow එකම නවත්වා ආපහු පටන් ගන්න',
      ],
      answer: 2,
      why: 'Structured error context coordinator ට recover වෙන්න ඉඩ දෙයි. Empty success error එක සඟවයි; generic context නැති; workflow නැවැත්වීම අනවශ්‍යයි.',
    },
    {
      q: 'Extraction pipeline එකේ overall accuracy 97%. Human review අඩු කරන්න කලින් කළ යුතු හොඳම පළමු පියවර?',
      options: [
        'Review දැන්ම නවත්වන්න',
        'Calibrate නොකළ self-reported confidence පමණක් පාවිච්චි කරන්න',
        'Document type සහ field අනුව accuracy විශ්ලේෂණය කර, high-confidence ඒවායිනුත් stratified random sample කරන්න',
        'Sentiment analysis එකතු කරන්න',
      ],
      answer: 2,
      why: '97% overall එකෙන් handwritten receipts වැනි දුර්වල segments සැඟවිය හැකියි. Type/field අනුව බැලීම සහ stratified sampling (high-confidence ඒවායිනුත්) තමයි නිවැරදි පියවර.',
    },
  ],
}
