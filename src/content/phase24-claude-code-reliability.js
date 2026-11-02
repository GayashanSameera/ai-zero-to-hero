export default {
  id: 'claude-code-reliability',
  number: 24,
  title: 'Claude Architect: Claude Code, Prompts & Reliability (Domains 3–5)',
  titleSi: 'Claude Architect: Claude Code, Prompts සහ Reliability (Domains 3–5)',
  summary: 'CCAR-F exam එකේ බර 55%ක් (Domain 3 = 20%, Domain 4 = 20%, Domain 5 = 15%) තියෙන කොටස් තුන මෙතන තියෙනවා: Claude Code configure කරන හැටි (CLAUDE.md, rules, skills, plan mode, CI/CD), prompt සහ structured output විශ්වාසනීය කරන හැටි (explicit criteria, few-shot, tool_use schema, validation-retry, Batches API), සහ context එක නැති නොවී, error එක සඟවන්නේ නැතුව, හරි වෙලාවට human කෙනෙකුට යවන හැටි. හැම topic එකකම exam එක ඔයාට දාන වැරදි පිළිතුර (tempting wrong answer) සහ ඒක වැරදි ඇයි කියලත් තියෙනවා.',
  duration: 'සති 4-5 (මුළු CCAR-F සූදානමට සති 12ක plan එක අන්තිම topic එකේ)',
  topics: [
    // 1
    {
      id: 'claude-md-hierarchy',
      examRefs: ['CCAR-011', 'CCAR-029'],
      title: 'CLAUDE.md Hierarchy, @import, .claude/rules/ and /memory (Task 3.1)',
      body: [
        'CLAUDE.md කියන්නේ Claude Code එකට හැමවෙලාවෙම කියවන්න දෙන "වැඩ කරන රීති" file එක. Coding standards, test commands, "secrets commit කරන්න එපා" වගේ දේවල් මෙතන තියෙනවා. ඒක තියෙන්න පුළුවන් තැන් තුනක: User level (~/.claude/CLAUDE.md, ඔයාට විතරයි, Git එකට යන්නේ නෑ), Project level (repo root එකේ CLAUDE.md හෝ .claude/CLAUDE.md, Git හරහා මුළු team එකටම), සහ Directory level (subfolder එකක CLAUDE.md, ඒ folder එකේ file එකක් කියවද්දී/edit කරද්දී විතරක් load වෙනවා).',
        'Files එකිනෙක override කරන්නේ නෑ, එකතු වෙනවා. CLAUDE.md එක ලොකු වුණාම @import වලින් (උදා: @docs/api-standards.md) වෙන file වලට කඩන්න පුළුවන්. නැත්නම් .claude/rules/ folder එකේ testing.md, api-conventions.md, deployment.md වගේ topic files විදිහට කඩන්න පුළුවන්. මොනවා load වෙලාද කියලා හොයාගන්න /memory command එක පාවිච්චි කරනවා.',
        'Exam එකේ සුපිරි classic ගැටලුව: අලුතින් join වුණු teammate ට Claude Code එක team conventions අනුගමනය කරන්නේ නෑ. හේතුව: ඒ instructions ඉන්නේ කාගේ හරි ~/.claude/CLAUDE.md (user level) එකේ. විසඳුම: project-level CLAUDE.md එකට ගෙනිහින් Git එකට commit කරන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "Team rules ඔක්කොම user-level file එකේ තියන්න" හෝ "පේළි 900ක එක CLAUDE.md එකක්" වැනි දේවල්. User level එක පුද්ගලික; Git එකට යන්නේ නෑ. 900 පේළි file එක maintain කරන්නත් බෑ. නිවැරදි එක: project level + .claude/rules/ topic files.',
      ],
      analogy: 'CLAUDE.md levels කියන්නේ ගෙදර, පාසලේ, පන්තියේ නීති වගේ. ගෙදර නීති (user level) ඔයාට විතරයි. පාසලේ නීති (project level) හැම ළමයාටම ඒ පාසලේ ඉන්න තාක් කල් වලංගුයි. විද්‍යාගාරයේ නීති (directory level) විද්‍යාගාරයට ඇතුල් වුණාම විතරයි. අලුත් ළමයෙක් ආවම පාසලේ නීති පොත දෙන්නේ, ඔයාගේ ගෙදර නීති නෙවෙයි.',
      example: 'Nimali ගේ ~/.claude/CLAUDE.md එකේ "pytest පාවිච්චි කරන්න, type hints අනිවාර්‍යයි" කියලා තියෙනවා. Kasun සඳුදා join වෙනවා, ඒත් ඔහුගේ Claude Code unittest වලින් tests ලියනවා. Root cause: rules ඉන්නේ Nimali ගේ machine එකේ විතරයි. Fix: ඒ පේළි ටික repo එකේ CLAUDE.md එකට දාලා commit කරනවා. දැන් Kasun pull කරපු ගමන් Claude එක නීති දන්නවා. පේළි 900ක CLAUDE.md එකක් නම්: testing.md (300), api-conventions.md (300), deployment.md (300) කියලා .claude/rules/ වලට කඩනවා.',
      code: {
        lang: 'markdown',
        src: `# Project standards  (repo root: CLAUDE.md, Git එකට commit කරනවා)
- Python 3.12, type hints හැම තැනම, tests සඳහා pytest.
- Secrets කවදාවත් commit කරන්න එපා; environment variables වලින් කියවන්න.

# ලොකු docs වෙනම files වලට (@import)
@docs/api-conventions.md
@docs/testing-standards.md

# ඔයාට විතරක් (Git වලට නෑ): ./CLAUDE.local.md  හෝ  ~/.claude/CLAUDE.md
# මොනවා load වුණාද බලන්න: /memory`,
      },
      keyPoints: [
        'Levels තුන: User (~/.claude/CLAUDE.md, පුද්ගලික), Project (repo root, Git හරහා team එකට), Directory (subfolder එකේ වැඩ කරද්දී).',
        'Files override නොවී එකතු වෙනවා. @import සහ .claude/rules/ වලින් modular කරනවා.',
        '/memory = මොනවා load වෙලාද බලන්න. "Teammate ට instructions ලැබෙන්නේ නෑ" = user level එකේ තියෙන නිසා.',
        'Team standards = project scope. පුද්ගලික preferences = user scope.',
      ],
      terms: [
        { en: '@import', si: 'CLAUDE.md එක ඇතුලෙන් වෙන file එකක් ඇතුළත් කරන syntax එක (@docs/api-standards.md).' },
        { en: '/memory', si: 'දැන් load වෙලා තියෙන memory files (CLAUDE.md, rules) පෙන්වන command එක; instructions නොපෙනෙන ගැටලු හොයන්න.' },
        { en: 'CLAUDE.local.md', si: 'මේ project එකට ඔයාට විතරක් අදාළ, Git එකට යන්නේ නැති (.gitignore) file එක.' },
      ],
    },
    // 2
    {
      id: 'path-specific-rules',
      examRefs: ['CCAR-030'],
      title: 'Path-Specific Rules with paths Globs (Task 3.3)',
      body: [
        '.claude/rules/ ඇතුළේ තියෙන rule file එකකට YAML frontmatter එකේ paths: කියලා glob patterns දාන්න පුළුවන්. ඒ pattern එකට ගැලපෙන file එකක් Claude edit කරද්දී විතරයි ඒ rule එක load වෙන්නේ. ඒ නිසා tokens ඉතිරි වෙනවා, අදාළ නැති rules context එක පුරවන්නේ නෑ.',
        'මේක වටින්නේ conventions අදාළ වෙන files codebase එක පුරාම විසිරිලා තියෙද්දී. උදාහරණයක් විදිහට Button.test.tsx, Card.test.tsx වගේ test files හැම component folder එකකම තියෙනවා. හැම folder එකකටම CLAUDE.md එකක් දාන්න ගියොත් පිස්සුවක්. එක rule file එකක් paths: ["**/*.test.tsx"] එක්ක ඇති.',
        'තව උදාහරණ: paths: ["terraform/**/*"] දැම්මොත් Terraform files edit කරද්දී විතරක් Terraform conventions load වෙනවා. Directory-level CLAUDE.md වැඩ කරන්නේ ඒ එක folder එකට bound වෙලා විතරයි.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "Root CLAUDE.md එකේ section එකක් දාන්න, Claude අනුමාන කරයි (inference)", "skill එකක් හදන්න" (skills manual/අනිශ්චිතයි), "හැම subdirectory එකකටම CLAUDE.md". මේවා ඔක්කොම වැරදියි. නිවැරදි එක: .claude/rules/ + paths glob.',
      ],
      analogy: 'Colombo Fort එකේ CCTV rules එක කඩේකට විතරක් අදාළ නම්, ඒක දාන්නේ ඒ කඩේ දොරේ. හැම කඩේකටම පොත් කිහිපයක් බෙදන්නේ නෑ. Glob rule එක කියන්නේ "මේ වර්ගයේ file එකක් ළඟට ආවොත් විතරක් මේ නීති කියවන්න" කියන එක.',
      example: 'ඔයාගේ repo එකේ React component folders 60ක් තියෙනවා, හැම එකකම *.test.tsx files. Test conventions පේළි 40ක් තියෙනවා. Subdirectory CLAUDE.md 60ක් දාන්න ගියොත් 60 පාරක් copy-paste කරන්න වෙනවා. ඒ වෙනුවට .claude/rules/testing.md එකක් paths: ["**/*.test.tsx"] සහිතව. Claude component code edit කරද්දී ඒ පේළි 40 load වෙන්නේ නෑ. Test file එකක් edit කරද්දී විතරයි load වෙන්නේ.',
      code: {
        lang: 'markdown',
        src: `---
# .claude/rules/testing.md
paths:
  - "**/*.test.tsx"      # මේ files edit කරද්දී විතරක් load වෙනවා
  - "**/test_*.py"
---
හැම test එකක්ම behavior එකක් විතරක් check කරන්න.
tests/fixtures/ හි fixtures පාවිච්චි කරන්න. sleep දාන්න එපා.`,
      },
      keyPoints: [
        'paths: glob = ගැලපෙන file edit කරද්දී විතරක් rule එක load වෙනවා.',
        'Codebase පුරා විසිරුණු files (test files, terraform/**) සඳහා glob rules හොඳම විසඳුම.',
        'Subdirectory CLAUDE.md = ඒ එක folder එකට bound; skills = manual; root CLAUDE.md = හැමවෙලේම load.',
        'Tokens ඉතිරි වෙනවා. Context එක පිරෙන්නේ නෑ.',
      ],
      terms: [
        { en: 'Glob pattern', si: 'File names ගැලපෙන ආකාරය: ** = ඕනෑම folder ගණනක්, * = ඕනෑම අකුරු.' },
        { en: 'YAML frontmatter', si: 'Markdown file එකේ ඉහළින් --- දෙකක් අතර තියෙන settings කොටස.' },
      ],
    },
    // 3
    {
      id: 'slash-commands-and-skills',
      examRefs: ['CCAR-012', 'CCAR-031'],
      title: 'Slash Commands & Skills: SKILL.md, context: fork, allowed-tools, argument-hint (Task 3.2)',
      body: [
        'Slash command එකක් කියන්නේ /review වගේ ටයිප් කරලා run කරන ඔයාගේම shortcut prompt එකක්. Team එක share කරන ඒවා .claude/commands/ ඇතුළේ (Git එකට commit), පුද්ගලික ඒවා ~/.claude/commands/ ඇතුළේ. Skill එකක් ඊට වඩා ලොකුයි: .claude/skills/<නම>/SKILL.md (team) හෝ ~/.claude/skills/<නම>/SKILL.md (පුද්ගලික).',
        'SKILL.md එකේ frontmatter එකේ වැදගත් fields තුනක් තියෙනවා. context: fork කියන්නේ skill එක වෙනම sub-agent context එකක run වෙනවා; ඒ නිසා දිගු output එක ඔයාගේ ප්‍රධාන conversation එක අපිරිසිදු කරන්නේ නෑ. allowed-tools කියන්නේ skill එකට පාවිච්චි කරන්න පුළුවන් tools සීමා කරනවා (destructive actions වළක්වනවා; least privilege). argument-hint කියන්නේ argument එකක් නැතුව invoke කළොත් අවශ්‍ය parameter එක ඉල්ලන hint එක.',
        'Skill vs CLAUDE.md: CLAUDE.md = හැමවෙලේම load වෙන සාමාන්‍ය standards. Skill = අවශ්‍ය වුණාම විතරක් run වෙන task workflow එකක්. Team skill එකක් ඔයාට විතරක් වෙනස් කරගන්න ඕනේ නම්, ඒක edit කරන්න එපා. ~/.claude/skills/ ඇතුළේ වෙනත් නමකින් personal variant එකක් හදාගන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "Shared project skill එක කෙලින්ම edit කරන්න" (teammates ට බලපානවා), ~/.claude/commands/ එකේ දාන්න (team එකට නෑ), "workflow එක CLAUDE.md එකේ දාන්න" (හැමවෙලේම load වෙනවා), හෝ .claude/config.json commands array (මේක නැත්තටම නැති feature එකක්).',
      ],
      analogy: 'CLAUDE.md කියන්නේ කඩේ බිත්තියේ ගහපු "කඩේ නීති" පුවරුව; හැමෝම හැමවෙලේම දකිනවා. Skill එක කියන්නේ කුස්සියේ තියෙන "කොත්තු හදන විදිය" recipe card එක; කොත්තු ඕඩර් එකක් ආවොත් විතරයි ගන්නේ. context: fork කියන්නේ recipe එක අතුරු කුස්සියක කරලා අන්තිම ප්‍රතිඵලය විතරක් ගේන එක, ප්‍රධාන කුස්සිය අවුල් නොවී.',
      example: '/map-codebase skill එක run කරද්දී Claude files 300ක් කියවනවා. context: fork නැතුව ඒ output ඔක්කොම ඔයාගේ main chat එකට එනවා, ඊටපස්සේ context එක පිරෙනවා. context: fork එක්ක sub-agent එක ඒක කරලා පේළි 20ක summary එකක් විතරක් ආපහු දෙනවා. allowed-tools: Read, Grep, Glob නිසා skill එකට file මකන්න හෝ Bash run කරන්න බෑ. Team skill එකේ output පේළි 20ක් වෙනුවට ඔයාට 50ක් ඕනේ නම්: ~/.claude/skills/map-codebase-long/ හදාගන්න, original එක නොඑල්ලා.',
      code: {
        lang: 'markdown',
        src: `---
# .claude/skills/map-codebase/SKILL.md
name: map-codebase
description: නොදන්නා folder එකක් map කරලා modules සහ entry points summarize කරන්න.
context: fork            # වෙනම sub-agent context එකක run වෙනවා
allowed-tools: Read, Grep, Glob   # විනාශකාරී tools නෑ
argument-hint: <folder>  # argument නැත්නම් මේක ඉල්ලනවා
---
$ARGUMENTS ගැන explore කරන්න. පේළි 20කට වඩා නැතුව:
modules, entry points, key dependencies දෙන්න.`,
      },
      keyPoints: [
        'Team = .claude/commands/ සහ .claude/skills/<name>/SKILL.md (Git). පුද්ගලික = ~/.claude/... (Git වලට නෑ).',
        'context: fork = දිගු output ප්‍රධාන conversation එකෙන් ඉවත්. allowed-tools = tools සීමා කිරීම. argument-hint = parameter ඉල්ලීම.',
        'Skills = on-demand workflows; CLAUDE.md = always-loaded standards.',
        'Team skill එක ඔයාට විතරක් වෙනස් කරන්න: වෙනත් නමකින් personal variant එකක්.',
      ],
      terms: [
        { en: 'context: fork', si: 'Skill එක වෙනම sub-agent context එකක run කරනවා; ප්‍රධාන chat එකට summary විතරක් එනවා.' },
        { en: 'allowed-tools', si: 'Skill එකට පාවිච්චි කළ හැකි tools ලැයිස්තුව (least privilege).' },
        { en: 'argument-hint', si: 'Parameter එක නැතිව invoke කළොත් ඉල්ලන hint text එක.' },
        { en: 'Personal variant', si: 'Team skill එකේ ඔයාගේම පිටපතක්, වෙනත් නමකින්, ~/.claude/skills/ ඇතුළේ.' },
      ],
    },
    // 4
    {
      id: 'plan-mode-vs-direct',
      examRefs: ['CCAR-013'],
      title: 'Plan Mode vs Direct Execution and the Explore Subagent (Task 3.4)',
      body: [
        'Plan mode කියන්නේ Claude කෙලින්ම code වෙනස් නොකර, මුලින් investigate කරලා design එකක් (plan) හදන mode එක. Direct execution කියන්නේ කෙලින්ම වෙනස් කරන එක. තෝරන්නේ වැඩේ ප්‍රමාණය අනුව: files ගොඩක් වෙනස් වෙන, විකල්ප කිහිපයක් තියෙන architecture තීරණ (monolith එක microservices කරන එක, library migration එකක් files 45+ ක්) = plan mode. Stack trace එකක් තියෙන single-file bug, එක function එකකට validation එකක් = direct execution.',
        'දෙකම එකතු කරන්නත් පුළුවන්: plan mode එකෙන් investigate කරලා design කරනවා, ඊටපස්සේ direct execution එකෙන් implement කරනවා.',
        'Explore subagent එක කියන්නේ දිගු discovery වැඩ (files ගොඩක් කියවන එක) වෙනම context එකක කරලා, summary එකක් විතරක් main session එකට දෙන subagent එක. ඒකෙන් main context window එක ආරක්ෂා වෙනවා.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "Direct execution වලින් පටන් ගන්න, අවශ්‍ය වුණොත් plan mode එකට මාරු වෙන්න". Complexity එක requirement එකේම පැහැදිලිව පේනවා නම් මේක වැරදියි, මොකද files දුසිම් ගණනක් වැරදි විදිහට වෙනස් කරලා rework කරන්න වෙනවා.',
      ],
      analogy: 'ගෙදර ඇඳුමක බොත්තමක් පටවන්න නම් කෙලින්ම ඉඳිකටුව ගන්නවා (direct execution). ගෙදර එක කාමරයක් උඩ මහලට දාන්න නම් මුලින් ඉංජිනේරුවා plan එකක් අඳිනවා, ඊටපස්සේ විතරයි බිත්ති කඩන්නේ (plan mode). Explore subagent කියන්නේ ඉඩම මැනලා report එකක් විතරක් දෙන මනින්නා; ඔයා ඉඩම පුරාම ඇවිදින්නේ නෑ.',
      example: 'Task A: "Monolith එක services 5කට කඩන්න", files 120ක් බලපානවා, boundaries කීපයක් තියෙන්න පුළුවන්. Plan mode: පළමුව dependencies map කරනවා, boundaries 2ක් propose කරනවා, ඔයා එකක් අනුමත කරනවා, ඊටපස්සේ implement. Task B: "payment.py:88 හි ZeroDivisionError, stack trace මෙන්න". එක file එකක්, එක තැනක් විතරයි. Direct execution. Plan හදන එක කාලය නාස්ති කිරීමක්.',
      keyPoints: [
        'Plan mode = විශාල, multi-file, architecture තීරණ (උදා: files 45+ migration). Direct = කුඩා, පැහැදිලි scope.',
        'Plan කරලා investigate/design, ඊට පස්සේ direct execution: දෙක එකතු කරන්න පුළුවන්.',
        'Explore subagent = discovery output වෙනම තබලා summary විතරක් ආපහු දෙනවා.',
        'Complexity දැනටමත් පැහැදිලි නම් "direct වලින් පටන් ගෙන පස්සේ plan" වැරදියි.',
      ],
      terms: [
        { en: 'Plan mode', si: 'Code වෙනස් කරන්න කලින් investigate කරලා design එකක් හදන mode එක.' },
        { en: 'Explore subagent', si: 'දිගු files-කියවීම වෙනම context එකක කරලා summary එකක් දෙන subagent.' },
      ],
    },
    // 5
    {
      id: 'iterative-refinement',
      examRefs: ['CCAR-032'],
      title: 'Iterative Refinement: I/O Examples, Test-Driven, Interview Pattern (Task 3.5)',
      body: [
        'Claude ට වැඩේ prose වලින් පැහැදිලි කරලත් ප්‍රතිඵල අස්ථාවරයි නම්, දිගු විස්තරයක් ලියන්නේ නෑ. Concrete input/output උදාහරණ 2-3ක් දෙනවා. "මෙන්න input, මෙන්න ඒකට ඕනේ output" කියන එක prose එකට වඩා අපැහැදිලි කමක් නැති එකක්.',
        'Test-driven iteration: පළමුව tests ලියනවා (අපේක්ෂිත behavior), Claude code ලියනවා, tests fail වුණොත් ඒ failures Claude ට ආපහු දෙනවා. Interview pattern: ඔයා හොඳට නොදන්න domain එකක (cache invalidation, failure modes වගේ) Claude ට කියනවා "මට ප්‍රශ්න අහන්න, design එකට පෙර", ඒකෙන් ඔයා නොහිතපු කාරණා එළියට එනවා.',
        'Feedback දෙන විදිහත් වැදගත්: එකිනෙකට බලපාන (interacting) ගැටලු එක message එකක සියල්ල කියන්න, ස්වාධීන (independent) ගැටලු එකින් එක විසඳන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "තව දිගු, තව සවිස්තරාත්මක prose විස්තරයක් ලියන්න", "temperature 0 කරන්න". දෙකම root cause එක (අපැහැදිලි spec එක) විසඳන්නේ නෑ.',
      ],
      analogy: 'තාත්තා දරුවාට "පාන් ගන්න එනවා" කියන්නේ කීයටවත් එකම පාන් වර්ගයක් නෙවෙයි. ඒත් "පහුගිය සතියේ ගත්ත සුදු පාන් එකක්, ඒ වගේ" කියලා පාන් කෑල්ලක් පෙන්නුවොත් වැරදෙන්නේ නෑ. උදාහරණය කියන්නේ පෙන්නලා දෙන එක.',
      example: 'Date format එක එකක් "03/04/2026" (dd/mm), "April 3, 2026" වගේ විවිධ විදිහට එනවා. පේළි 10ක විස්තරයකින් තත්ත්වය හොඳ වුණේ නෑ. උදාහරණ 3ක් දුන්නා: "03/04/2026 → 2026-04-03", "April 3, 2026 → 2026-04-03", "3rd of April 26 → 2026-04-03". ඊළඟ run එකේ output ස්ථාවරයි. Tests විදිහට නම්: මේ උදාහරණ 3ම test cases 3ක් කරලා, fail වෙන ඒවා Claude ට දෙනවා.',
      keyPoints: [
        'ප්‍රතිඵල අස්ථාවර නම් I/O උදාහරණ 2-3ක් (prose වැඩි කිරීම නෙවෙයි).',
        'Test-driven: tests පළමුව, failures feed back කරනවා.',
        'Interview pattern: නොදන්න domain එකක Claude ට ඔයාගෙන් ප්‍රශ්න අහන්න සලස්වනවා.',
        'බලපාන ගැටලු එකට, ස්වාධීන ගැටලු එකින් එක.',
      ],
      terms: [
        { en: 'Interview pattern', si: 'Claude ට ප්‍රශ්න අහන්න කියලා, ඔයා නොදන්න design කාරණා එළියට ගන්න ක්‍රමය.' },
        { en: 'Test-driven iteration', si: 'Tests මුලින් ලියලා, fail වන ඒවා Claude ට දීලා code හොඳ කරන ක්‍රමය.' },
      ],
    },
    // 6
    {
      id: 'cicd-claude-p',
      examRefs: ['CCAR-014', 'CCAR-033'],
      title: 'CI/CD Integration: claude -p, JSON Output, Independent Review (Task 3.6)',
      body: [
        'CI/CD pipeline එකක් කියන්නේ කවුරුත් බලාගෙන නැති robot එකක්. ඒකේ Claude Code run කරද්දී -p (--print) flag එක අනිවාර්‍යයි. එයින් non-interactive mode එකට යනවා. නැතිනම් Claude input එකක් එනතුරු බලාගෙන ඉඳලා CI job එක hang වෙනවා. ඊට අමතරව --output-format json සහ --json-schema දුන්නොත් findings machine-parseable වෙනවා, ඒවා PR එකේ inline comments විදිහට දාන්න පුළුවන්.',
        'CI එකේ Claude ට testing standards, fixtures, review criteria දෙන්නේ CLAUDE.md හරහා. Review එක code ලියපු session එකෙන්ම කරන්න එපා; එයා තමන්ගේ reasoning මතක තියාගෙන ඉන්න නිසා තමන්ගේ තීරණ ප්‍රශ්න කරන්නේ නෑ. වෙනම, ස්වාධීන claude -p run එකක් (independent instance) පාවිච්චි කරන්න.',
        'PR එකට අලුත් commit එකක් ආවම නැවත review කරද්දී: පරණ findings (prior-findings.json) context එකට දීලා "අලුත් හෝ තවමත් විසඳලා නැති ඒවා විතරක් report කරන්න" කියන්න; නැත්නම් එකම comments නැවත නැවත post වෙනවා. Test generation වලදී දැනට තියෙන tests Claude ට දෙන්න; එවිට duplicate tests යෝජනා කරන්නේ නෑ.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): CLAUDE_HEADLESS=true වැනි environment variable, --batch flag, හෝ /dev/null වලට stdin redirect කිරීම (workaround). මේ features නැත්තටම නැහැ. නිවැරදි එක: claude -p.',
      ],
      analogy: 'CI job එක කියන්නේ රෑ 2ට තනියම වැඩ කරන මුරකාරයා. ඔහුට "ඔයාට ඕනේ නම් මගෙන් අහන්න" කිව්වොත් කවුරුත් නැති නිසා උදේ වෙනකම් බලාගෙන ඉන්නවා (hang). -p කියන්නේ "අහන්න එපා, කරලා report එකක් දෙන්න" කියන එක. Independent review කියන්නේ ඇකවුන්ට් ලියපු කෙනාම audit කරන්නේ නැතුව වෙන auditor කෙනෙක් බලන එක.',
      example: 'PR #212: Claude findings 6ක් post කළා. Developer 4ක් fix කළා, 2ක් ඉතුරුයි. ඊළඟ commit එකට නැවත review run කරද්දී prior-findings.json (findings 6) දුන්නේ නැත්නම් comments 6ම නැවත එනවා (duplicates). දුන්නොත් නැවත එන්නේ ඉතුරු 2ක් සහ අලුත් ඒවා විතරයි. Test generation: tests/ folder එකේ දැනට tests 85ක් context එකට දෙනවා, එවිට අලුත් tests 12 ම ඇත්තටම අලුත්.',
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
        'CI එකේ claude -p (--print) = non-interactive; නැත්නම් job එක hang.',
        '--output-format json + --json-schema = inline PR comments සඳහා machine-parseable findings.',
        'Review = ස්වාධීන වෙනම session; code ලියපු session එකම නෙවෙයි.',
        'නව commits: prior findings දී අලුත්/නොවිසඳුණු ඒවා විතරක්. Test gen: existing tests context එකට.',
        'CLAUDE_HEADLESS, --batch, config.json commands = නැති features (distractors).',
      ],
      terms: [
        { en: '-p / --print', si: 'Non-interactive mode එක: prompt එක දීලා result එක print කරලා ඉවර වෙනවා.' },
        { en: '--json-schema', si: 'Output එකේ හැඩය schema file එකකින් බලෙන් ගන්න flag එක.' },
        { en: 'Independent review instance', si: 'Generator ගේ context නැති වෙනම Claude run එකක්.' },
      ],
    },
    // 7
    {
      id: 'explicit-criteria-few-shot',
      examRefs: ['CCAR-015'],
      title: 'Explicit Criteria, False Positives and Few-Shot Prompting (Tasks 4.1, 4.2)',
      body: [
        'Review/classification prompt එකක අපැහැදිලි වචන ("be careful", "be conservative", "high-confidence findings විතරක්") model එකට වැඩක් නෑ, මොකද "careful" කියන්නේ මොකක්ද කියලා model එක දන්නේ නෑ. ඒ වෙනුවට හරියටම දෙන්න ඕනේ explicit criteria. "Comments accurate ද බලන්න" වෙනුවට "Comment එක කියන behavior එක code එකේ සැබෑ behavior එකට විරුද්ධ නම් විතරක් flag කරන්න". "Be conservative" වෙනුවට "Bugs සහ security issues report කරන්න. Minor style සහ local patterns skip කරන්න." Severity levels වලටත් concrete code උදාහරණ දෙන්න.',
        'False positives ගැන: එක category එකක findings වැඩිපුර වැරදි නම් developers ඒ category එක විතරක් නෙවෙයි, ඔක්කොම findings වලට විශ්වාසය නැති කරගන්නවා. ඒ නිසා ඒ category එක තාවකාලිකව disable කරලා, prompt එක හොඳ කරලා, ආපහු on කරනවා.',
        'උපදෙස් විස්තරාත්මකව තියෙද්දීත් output අස්ථාවරයි නම් ඊළඟ තේරීම few-shot examples: අපැහැදිලි cases සඳහා ඉලක්කගත උදාහරණ 2-4ක්, හැම එකකම ඒ action එක තෝරපු හේතුව සමඟ. Output format එක (location, issue, severity, suggested fix) පෙන්වන්න. පිළිගත හැකි code සහ සැබෑ ගැටලු එකට පෙන්වන්න (false positives අඩු වෙනවා). Extraction වලදී විවිධ document formats (inline citations vs bibliography) පෙන්වන්න. Model එක ඒ judgment එක අලුත් patterns වලටත් generalize කරනවා. මේ ගැන phase 12 හි ICL සහ clear-instructions topics වල පාඩම් මතක් කරගන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): "prompt එකට \'be careful\' / \'only high-confidence findings\' කියලා දාන්න", "තව prose rules එකතු කරන්න", "classifier model එකක් train කරන්න" (over-engineering).',
      ],
      analogy: 'A/L ලකුණු දැමීමේදී "හොඳ පිළිතුරකට ලකුණු දෙන්න" කිව්වොත් examiner දෙන්නා වෙනස් ලකුණු දානවා. "මේ 3 කරුණු තියෙනවා නම් 5ක් දෙන්න" (explicit criteria) සහ ලකුණු දාපු නිදර්ශන පිළිතුරු පත්‍ර 3ක් (few-shot) දුන්නාම ඔක්කොම එකම විදිහට ලකුණු දානවා.',
      example: 'Code review bot එක week එකකට findings 100ක් දැම්මා. ඒවායින් "comment එක පරණයි" වර්ගයේ 40ක් developers dismiss කළා (40% false positives). Team එක ඔක්කොම findings ignore කරන්න පටන් ගත්තා. පියවර: (1) "comment accuracy" category එක disable කරනවා, (2) prompt එක "comment එක කියන behavior එක code එකට විරුද්ධ නම් විතරක්" කියලා explicit කරනවා, (3) පිළිගත හැකි comment 1ක් සහ සැබෑ mismatch 2ක් few-shot ලෙස දානවා, (4) ඊටපස්සේ ආපහු on කරනවා.',
      keyPoints: [
        '"Be careful" / "high-confidence විතරක්" = අපැහැදිලි, වැරදි පිළිතුරු. Explicit categorical criteria දෙන්න.',
        'එක category එකක false positives වැඩි නම් trust එක මුළුමනින්ම යනවා: ඒක තාවකාලිකව disable කරලා prompt එක හදන්න.',
        'Few-shot: 2-4 උදාහරණ, හේතු සහිතව, අපැහැදිලි cases වලට, පිළිගත හැකි vs සැබෑ ගැටලු දෙකම.',
        'උපදෙස් තිබියදී අස්ථාවර නම් few-shot තමයි වඩාත්ම effective.',
      ],
      terms: [
        { en: 'False positive', si: 'ගැටලුවක් නැති දේ ගැටලුවක් කියලා flag කරන එක.' },
        { en: 'Explicit criteria', si: 'හරියටම මොනවා report කරන්නද, මොනවා skip කරන්නද කියන පැහැදිලි නීති.' },
        { en: 'Severity levels', si: 'ගැටලුවේ බරපතලකම ශ්‍රේණි; හැම එකකටම code උදාහරණයක් දිය යුතුයි.' },
      ],
    },
    // 8
    {
      id: 'tool-use-json-schema',
      examRefs: ['CCAR-016', 'CCAR-034', 'CCAR-035'],
      title: 'tool_use + JSON Schema: Nullable Fields, Enums, tool_choice (Task 4.3)',
      body: [
        'Claude ගෙන් schema එකකට ගැලපෙන output එකක් අනිවාර්‍යයෙන් ගන්න වඩාත්ම විශ්වාසනීය ක්‍රමය: tool එකක් define කරලා (input_schema එක JSON Schema) Claude ට ඒ tool එක call කරවීම. එවිට JSON syntax errors වෙන්නේ නෑ. හැබැයි semantic errors (line items එකතුව total එකට නොගැලපීම, අගයක් වැරදි field එකක දැමීම) schema එකෙන් වළක්වන්නේ නෑ. ඒකට validation ඕනේ (ඊළඟ topic එක).',
        'Document එකේ නැති වෙන්න පුළුවන් field එකක් required කළොත්, model එක අගයක් fabricate (සාදනවා). ඒ නිසා ඒවා nullable කරන්න: "type": ["string", "null"]. Enums වලදී අපැහැදිලි cases සඳහා "unclear" අගයක්, අලුත් categories එන්න පුළුවන් නම් "other" + detail string field එකක් තියන්න. Date/number formats වෙනස් නම් format normalization rules prompt එකේ දෙන්න.',
        'tool_choice තුනක්: "auto" = Claude තීරණය කරනවා (tool එකක් call නොකරන්නත් පුළුවන්). "any" = අනිවාර්‍යයෙන් යම් tool එකක් call කළ යුතුයි; schemas කිහිපයක් ඇති, document type එක නොදන්න විට. {"type": "tool", "name": "extract_metadata"} = නිශ්චිත tool එක අනිවාර්‍යයි; නිශ්චිත extraction එකක් පළමුව run කරන්න.',
        'Exam එකේ උගුල (වැරදි පිළිතුර): fields ඔක්කොම required කරන එක (fabrication ඇති කරයි), "schema එක valid නිසා values හරි" කියන එක, සහ unknown document type එකට tool_choice: auto දාන එක (text එකක් එන්නත් පුළුවන්).',
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
        'tool_use + JSON schema = schema-compliant output සඳහා වඩාත්ම විශ්වාසනීය; syntax errors නෑ, semantic errors තියෙනවා.',
        'නැති වෙන්න පුළුවන් fields = nullable (["string","null"]); required කළොත් model එක fabricate කරනවා.',
        'Enum: "unclear" + "other" සහ detail string. Date/number normalization rules prompt එකේ.',
        'tool_choice: auto (ඕනෑ දෙයක්), any (tool එකක් අනිවාර්‍ය, එක කුමක්ද Claude තෝරයි), forced {"type":"tool","name":...} (නිශ්චිත එකක්).',
      ],
      terms: [
        { en: 'Nullable field', si: 'අගය නැති විට null දෙන්න පුළුවන් field එක; fabrication වළක්වයි.' },
        { en: 'tool_choice: any', si: 'Tool එකක් අනිවාර්‍යයෙන් call කළ යුතුයි; කුමක්ද කියලා Claude තෝරයි.' },
        { en: 'Semantic error', si: 'Syntax හරි, නමුත් අර්ථය වැරදි (totals නොගැලපීම, වැරදි field එක).' },
      ],
    },
    // 9
    {
      id: 'validation-retry-loop',
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
    },
    // 10
    {
      id: 'message-batches-api',
      examRefs: ['CCAR-018', 'CCAR-036'],
      title: 'Message Batches API: 50% Cost, 24h Window, SLA Math (Task 4.5)',
      body: [
        'Message Batches API එක requests ගොඩක් එකවර submit කරලා පස්සේ ප්‍රතිඵල ගන්න ක්‍රමය. වාසි: standard මිලෙන් 50% අඩුයි. අවාසි: ප්‍රතිඵල ලැබෙන්න පැය 24 දක්වා ගත වෙන්න පුළුවන් (latency SLA එකක් නෑ), සහ multi-turn tool calling support නෑ (request එක අතරතුර tool run කරලා result එක ආපහු දෙන්න බෑ). Requests සහ responses ගැලපෙන්නේ custom_id එකෙන්; ඒ නිසා results order එක ගැන කරදර වෙන්න ඕනේ නෑ.',
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
        'Batches: 50% ලාභයි, පැය 24 දක්වා, latency SLA නෑ, multi-turn tool calling නෑ, custom_id වලින් ගැලපීම.',
        'හොඳ: overnight/weekly/nightly. නරක: blocking pre-merge check.',
        'SLA පැය 30 + batch පැය 24 → පැය 4න් 4ට submit (4 + 24 = 28 ≤ 30).',
        'අසාර්ථක ඒවා විතරක් custom_id වලින් resubmit; කලින් sample එකක prompt refine කරන්න.',
      ],
      terms: [
        { en: 'custom_id', si: 'Batch එකේ හැම request එකකටම දෙන ID එක; results ගැලපීමට සහ failures resubmit කිරීමට.' },
        { en: 'Blocking check', si: 'Developer ඒක ඉවර වෙනකම් බලාගෙන ඉන්න check එකක් (pre-merge). Batch වලට නුසුදුසුයි.' },
      ],
    },
    // 11
    {
      id: 'independent-multi-pass-review',
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
    },
    // 12
    {
      id: 'case-facts-and-context-management',
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
    },
    // 13
    {
      id: 'escalation-triggers',
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
    },
    // 14
    {
      id: 'error-propagation-coverage',
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
    },
    // 15
    {
      id: 'large-codebase-context',
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
    },
    // 16
    {
      id: 'calibration-stratified-sampling',
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
    },
    // 17
    {
      id: 'provenance-conflicting-sources',
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
    },
    // 18
    {
      id: 'scenario-code-generation',
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
    },
    // 19
    {
      id: 'scenario-cicd',
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
    },
    // 20
    {
      id: 'scenario-structured-extraction',
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
    },
    // 21
    {
      id: 'six-rules-mini-exam',
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
    },
    // 21b
    {
      id: 'official-sample-question-patterns',
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
    },
    // 22
    {
      id: 'ccar-f-study-plan-12-weeks',
      title: 'AND MORE: 12-Week CCAR-F Study and Practice Plan (for an AWS Tech Lead)',
      body: [
        'ඔයා AWS-focused full-stack tech lead කෙනෙක්, ඒ නිසා Claude වල ඔයාට හුරු AWS සමානකම් තියෙනවා: Hooks/gates = IAM/SCP guardrails (prompt = "කරුණාකර" email එකක් වගේ, guardrail = ඇත්ත permission). Batches API ≈ SQS + batch jobs (ලාභයි, latency ඉවසනවා). User/project scope ≈ IAM user policy vs account-level policy. Validation-retry ≈ schema validation Lambda + DLQ. Escalation ≈ DLQ → human on-call. Least privilege ≈ IAM least privilege. (Bedrock, PrivateLink වගේ AWS දේවල් CCAR-F scope එකෙන් පිටත, optional.)',
        'සති 1: Exam format (60 ප්‍රශ්න, 120 මිනිත්තු, scenarios 6න් 4ක්), 6 rules, phases 10-12 revision. සති 2-3: Domain 1 (27%): stop_reason loop එක මතකයෙන් ලියන්න, coordinator + subagents 2ක්, PreToolUse hook එකක්. සති 4: Domain 2 (18%): tool descriptions, 4 error types, tool_choice 3, .mcp.json vs ~/.claude.json. සති 5-6: Domain 3 (20%) hands-on: project CLAUDE.md + @import, .claude/rules/ paths, skill (context: fork), GitHub Action එකේ claude -p. සති 7: Domain 4 (20%): nullable schema + validation-retry + Batches job එක කුඩා ලෙස + independent review. සති 8: Domain 5 (15%): case facts block, escalation criteria, structured errors, /compact.',
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
