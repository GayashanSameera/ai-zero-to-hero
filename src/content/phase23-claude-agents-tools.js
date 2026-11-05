export default {
  id: 'claude-agents-tools',
  number: 23,
  title: 'Claude Architect: Agents, Tools & MCP (Domains 1–2)',
  titleSi: 'Claude Architect: Agents, Tools and MCP (Domains 1 and 2)',
  summary:
    'The two largest CCAR-F domains are Agentic Architecture (27%) and Tool Design & MCP (18%). Learn the stop_reason loop, coordinator–subagent patterns, hooks, sessions, tool descriptions, structured errors, tool_choice, MCP scopes, and built-in tools. Each concept also explains a common exam distractor and why it is wrong.',
  duration: '2–3 weeks',
  topics: [
    {
      id: 'agentic-loop-stop-reason',
      plain: "An agent loop sends messages to a model, inspects the response, executes requested client tools, returns matching tool results, and repeats until a terminal condition.",
      internGuide: ["An agent loop sends messages to a model, inspects the response, executes requested client tools, returns matching tool results, and repeats until a terminal condition.","For the Messages API, `stop_reason: tool_use` means your application must handle one or more tool-use blocks; `end_turn` normally means Claude finished that turn. Other reasons need explicit handling.","Match every tool result to its tool-use ID, preserve the assistant response in history, and do not assume the last content block is plain text. Server tools may be executed by Anthropic instead.","Set maximum turns, tokens, elapsed time, cost, and tool retries. Log stop reasons and fail safely on unknown values so an API addition does not create an infinite loop."],
      examRefs: ['CCAR-001'],
      title: 'Agentic Loop: stop_reason (Task 1.1)',
      si: 'ඔයාගේ agent එක Claude එක්ක කතා කරන්නේ වටෙන් වටේ යන loop එකකින්. Colombo වල order එකක් බලන්න Claude tool එකක් ඉල්ලුවොත්, ඔයාගේ code එක ඒ tool එක run කරලා result එක ආපහු යවනවා. stop_reason එක end_turn වුණාම Claude ඉවරයි කියලා loop එක නවත්වන්න. Request දෙකකින් order එකේ තත්ත්වය දැනගන්න පුළුවන්.',
      body: [
        'An agent is driven by a small loop: your application sends Claude messages and available tools, then receives a response with a stop_reason field. Your code uses this structured field to decide what to do next.',
        'When stop_reason is "tool_use", Claude is requesting a tool; Claude does not execute it. Your application runs the requested tool, then sends its result in a user message with the matching tool_use_id and requests another response. When stop_reason is "end_turn", Claude has finished and the loop can stop.',
        'Claude chooses the next tool based on the conversation; do not hard-code a fixed tool sequence. An iteration cap such as 20 turns is a useful safety limit, but it is a backup rather than the normal completion signal.',
        'Phase 12 and Phase 19 introduce the general agent loop. Here, focus on the specific Claude API mechanics because those details are tested.',
      ],
      analogy:
        'Think of a kottu shop: the chef (Claude) decides what ingredient or action is needed next, while the waiter (your code) takes the request to the kitchen and brings back the result. The waiter stops only when the chef says the order is complete (end_turn), not by guessing from a nod.',
      example:
        'User: "Where is my order #A12345?" On turn 1, Claude requests lookup_order(order_id="A12345") with stop_reason = tool_use. Your code runs it, gets {status: "shipped"}, and sends that result with the matching tool_use_id. On turn 2, Claude returns a text answer with stop_reason = end_turn. The loop used two requests and one tool call.',
      code: {
        lang: 'python',
        src: `messages = [{"role": "user", "content": user_question}]
while True:
    resp = client.messages.create(
        model=MODEL, max_tokens=2048, tools=TOOLS, messages=messages)
    messages.append({"role": "assistant", "content": resp.content})
    if resp.stop_reason == "end_turn":
        break                          # Claude ඉවරයි
    if resp.stop_reason == "tool_use":
        results = []
        for b in resp.content:
            if b.type == "tool_use":
                out = run_tool(b.name, b.input)   # ඔයාගේ code run කරනවා
                results.append({"type": "tool_result",
                                "tool_use_id": b.id, "content": out})
        messages.append({"role": "user", "content": results})`,
      },
      keyPoints: [
        'Use stop_reason to control the loop: run tools and continue for tool_use; stop for end_turn.',
        'Add tool results to the conversation as a user message with the matching tool_use_id.',
        'Claude chooses tools dynamically; do not assume a fixed sequence.',
        'An iteration cap is a safety backup, not the primary stop condition.',
      ],
      terms: [
        { en: 'Wrong answer: stop when the text says "done"', si: 'Parsing natural language is unreliable; stop_reason is the structured field.' },
        { en: 'Wrong answer: stop whenever assistant text appears', si: 'Claude can return explanatory text alongside a tool request; text alone does not mean the task is done.' },
        { en: 'Wrong answer: use the iteration cap as the main stop condition', si: 'The cap is a backup. end_turn signals normal completion.' },
        { en: 'Wrong answer: use a fixed tool sequence', si: 'This removes model-driven tool selection. Use prompt chaining only when a fixed pipeline is intended.' },
        { en: 'tool_use_id', si: 'The identifier that links Claude’s tool request to the result your application returns.' },
      ],
    },
    {
      id: 'coordinator-subagent-hub-spoke',
      plain: "In hub-and-spoke, a coordinator owns the user goal and delegates bounded tasks to specialists. Specialists report evidence/results back; they should not silently redefine the goal.",
      internGuide: ["In hub-and-spoke, a coordinator owns the user goal and delegates bounded tasks to specialists. Specialists report evidence/results back; they should not silently redefine the goal.","Use this pattern for separable expertise, parallel research, or permission isolation. A single agent is simpler when tasks share heavy context or require tight sequential reasoning.","Give each subagent a contract: objective, inputs, allowed tools, output schema, budget, deadline, and what to do when uncertain. The coordinator resolves conflicts and synthesizes.","Guard against duplicated work, excessive fan-out, lost provenance, conflicting edits, and coordinator overload. Evaluate final task success, not the number of agents used."],
      title: 'Coordinator–Subagent: Hub-and-Spoke (Task 1.2)',
      si: 'ලොකු research වැඩක් කොටස් කරලා subagents කිහිපයකට දෙන්න coordinator කෙනෙක් යොදාගන්නවා. ක්‍රිකට් කණ්ඩායමක නායකයා වගේ coordinator එක ප්‍රතිඵල එකතු කරලා සාරාංශ කරනවා. හැම subagent එකක්ම coordinator හරහාම කතා කරන නිසා වැඩේ බලන්න ලේසියි. Subagent කෙනෙක්ට අනිත් කෙනාගේ කතාබහ ඉබේම පේන්නේ නැහැ.',
      body: [
        'For a large task, use a coordinator and several subagents rather than one agent doing everything. The coordinator breaks the work into parts, selects only the subagents needed for the query, combines their results, and handles errors.',
        'All communication passes through the coordinator; this is the hub-and-spoke pattern. It provides one place to observe what happened and apply consistent error handling. Subagents do not communicate directly with each other.',
        'Each subagent works in an isolated context and does not automatically receive the coordinator’s conversation; see the next topic.',
        'The coordinator does not need to run the full pipeline for every query. For a simple request, call only the required subagent. Give subagents distinct scopes (different subtopics or source types) to reduce duplicated work. If synthesis reveals gaps, delegate targeted follow-up queries.',
      ],
      analogy:
        'A wedding catering manager (the coordinator) assigns separate jobs to the rice cook, curry cook, pickle maker, and dessert maker. The cooks communicate through the manager, who can ask only the curry cook for more when that dish is running short.',
      example:
        'Query: "AI’s impact on creative industries." Suppose the coordinator assigns only one subtopic (visual arts). The report then covers only visual arts. The subagents did their assigned work, so the root cause is the coordinator’s decomposition. Expand it to include visual arts, music, writing, and film.',
      keyPoints: [
        'The coordinator decomposes work, selects subagents, combines results, and handles errors.',
        'Route all traffic through the coordinator for observability and consistent error handling.',
        'Run only the subagents needed for the query.',
        'If report topics are missing, the coordinator’s decomposition is often the root cause.',
      ],
      terms: [
        { en: 'Wrong answer: blame the subagents', si: 'If a subagent did its assigned scope correctly, the coordinator is the root cause. Fix the root cause (Rule 1).' },
        { en: 'Wrong answer: run the full pipeline for every query', si: 'That wastes work. The coordinator should select only the subagents that are needed.' },
        { en: 'Iterative refinement', si: 'Delegate targeted follow-up queries after checking for gaps in the synthesis.' },
      ],
    },
    {
      id: 'subagent-spawning-context-passing',
      plain: "A subagent needs only the context required for its assignment: goal, relevant facts/files, constraints, and expected output. More context increases cost and may introduce irrelevant instructions.",
      internGuide: ["A subagent needs only the context required for its assignment: goal, relevant facts/files, constraints, and expected output. More context increases cost and may introduce irrelevant instructions.","Agent definitions or SDK APIs are version-specific. Treat agent name, description, tools/permissions, model, and prompt as configuration that must be validated against current docs.","Pass references and provenance, not unverified summaries as fact. Decide whether the child shares state, receives a snapshot, or works independently, and make write ownership explicit.","On return, verify completion and evidence, merge deterministically, and surface uncertainty. Never assume a spawned agent succeeded merely because it stopped."],
      examRefs: ['CCAR-002', 'CCAR-003', 'CCAR-024'],
      title: 'Creating Subagents, AgentDefinition and Context Passing (Task 1.3)',
      si: 'Agent එකකට වැඩ බෙදන්න Task හෝ Agent tool එකෙන් subagent හදන්න පුළුවන්. කොළඹ ගමනකට කෙනෙක්ට බස් මාර්ග බලන්නත් තව කෙනෙක්ට කාලසටහන් බලන්නත් වෙනම වැඩ දෙන්න. ඒ අයට අවශ්‍ය තොරතුරු prompt එකේම දෙන්න, මොකද parent කතාබහ එයාලට ඉබේ ලැබෙන්නේ නැහැ. එක response එකක calls කිහිපයක් දුන්නොත් ඒ වැඩ parallel යනවා.',
      body: [
        'Create subagents with the Task tool, called the Agent tool in newer documentation (the exam guide uses "Task"). The coordinator must have that tool available (the exam wording is allowedTools) to spawn subagents.',
        'AgentDefinition describes a subagent type: description (required; tells the coordinator when to use it), prompt (required; the subagent’s system prompt), and optional settings such as tools, model, and maxTurns. Limit the subagent’s tools here. Note: in the SDK, allowed_tools auto-approves tools; use the subagent tools field or disallowed_tools to restrict them (verify current documentation).',
        'A major trap is assuming that a subagent receives the coordinator’s conversation. It receives its own prompt, the prompt string passed to the Agent tool, project CLAUDE.md, and tool definitions. Include everything it needs—including earlier agents’ findings—in the prompt.',
        'Return findings with content and metadata such as URL, document name, and page so their sources remain clear.',
        'For parallel work, emit multiple Agent/Task calls in the same coordinator response. Calls in separate turns run sequentially and take longer. Give the coordinator goals and quality criteria rather than a rigid step-by-step script.',
      ],
      analogy:
        'If you ask a new shop assistant to "send that order," they will not know which order because they were not part of your earlier conversation. Write the order number, address, and instructions on a note and give it to them.',
      example:
        'The coordinator spawns three web-searcher subagents in one response for visual arts, music, and film. Each prompt specifies its subtopic and known sources, for example: "Subtopic: music. Known sources: [url1, url2]. Return JSON with claim, excerpt, URL, and publication date." All three run in parallel.',
      code: {
        lang: 'python',
        src: `AGENTS = {
    "web-searcher": AgentDefinition(
        description="Searches the web. Use for finding sources.",
        prompt="Find sources. Return JSON: claim, excerpt, url, date.",
        tools=["WebSearch", "WebFetch"],   # තමන්ට අවශ්‍ය tools විතරයි
    ),
}
options = ClaudeAgentOptions(
    allowed_tools=["Agent", "Read"],  # exam wording: "Task" ඕනේ
    agents=AGENTS,
)`,
      },
      keyPoints: [
        'Create subagents with the Task tool (renamed Agent in newer documentation); make it available to the coordinator.',
        'AgentDefinition requires a description and prompt; tools, model, and maxTurns are optional.',
        'A subagent does not inherit the parent conversation. Put needed context in its prompt.',
        'Parallel work uses multiple tool calls in one response. Return structured findings with metadata.',
      ],
      terms: [
        { en: 'Wrong answer: assume subagents can see the coordinator context', si: 'They have isolated contexts. If a subagent lacks information, include it in the prompt.' },
        { en: 'Wrong answer: spread parallel work across multiple turns', si: 'Parallel calls are multiple Task calls in the same response.' },
        { en: 'Wrong answer: give the coordinator a rigid, detailed script', si: 'Specify goals and quality criteria; rigid steps can prevent adaptive work.' },
        { en: 'allowed_tools vs tools', si: 'allowed_tools auto-approves tools. Restrict a subagent with its tools field or disallowed_tools; follow the exam guide’s Task/allowedTools wording.' },
      ],
    },
    {
      id: 'workflow-enforcement-handoff',
      plain: "Enforce deterministic requirements in application code or a workflow graph: required approvals, order constraints, schemas, permissions, and terminal conditions should not rely only on prompting.",
      internGuide: ["Enforce deterministic requirements in application code or a workflow graph: required approvals, order constraints, schemas, permissions, and terminal conditions should not rely only on prompting.","A handoff transfers responsibility to another agent or a human. Include a concise case summary, evidence, actions already taken, open questions, and the requested decision.","Pause before consequential side effects. Persist state so a delayed human response can resume, then revalidate permissions and external facts because the world may have changed.","Provide cancellation, timeout, fallback, and escalation routes. Measure handoff rate, wait time, rework, and whether users can tell who currently owns the task."],
      title: 'Workflow Enforcement and Human Handoff (Task 1.4)',
      si: 'Customer කෙනෙක්ගේ identity එක තහවුරු නොකර refund දෙන්න එපා කියන නීතිය prompt එකට විතරක් බාර දෙන්න එපා. Rs. 50,000 refund එකකට manager අනුමැතිය ඕනේ නම් code එකෙන් gate එකක් දාන්න. Agent එකට විසඳන්න බැරි වුණොත් සිද්ධිය සහ හේතුව කෙටියෙන් human කෙනෙකුට යවන්න. ගැටලු දෙකක් ආවොත් ඒවා වෙන වෙනම බලලා එකට පිළිතුරු දෙන්න.',
      body: [
        'Claude may not always follow a prompt instruction; there is a non-zero failure rate (for example, 12%). Enforce mandatory rules about money, identity, or compliance in code using hooks or prerequisite gates, not only in a prompt.',
        'For a support agent, use code to block lookup_order and process_refund until get_customer returns a verified customer ID. This prevents Claude from skipping that prerequisite.',
        'If a request contains several issues, such as a refund and an address change, investigate them separately (in parallel when appropriate) and combine the results into one answer.',
        'When escalating to a person, provide a structured handoff summary: customer ID, root cause, refund amount, and recommended action. The human agent may not have the transcript, so include the necessary context.',
      ],
      analogy:
        'A large bank transaction requires a manager’s signature as a built-in system step, not just a notice saying "please get approval." A prompt is like the notice; a hook or gate is like the system lock.',
      example:
        'Production logs show that in 12% of cases the agent skips get_customer, looks up an order using an ambiguous name, and issues the wrong refund. The right fix is a programmatic gate that denies lookup_order and process_refund until the session has a verified customer ID. Strengthening the prompt, adding few-shot examples, or building a routing classifier does not address this prerequisite.',
      keyPoints: [
        'Enforce mandatory rules in code with a hook or prerequisite gate; prompts are probabilistic.',
        'Block lookup_order and process_refund until get_customer verifies an ID.',
        'For requests with multiple issues, investigate separately and combine the answers.',
        'A handoff needs a structured summary with ID, root cause, amount, and recommended action.',
      ],
      terms: [
        { en: 'Wrong answer: strengthen the system prompt or add few-shot examples', si: 'Probabilistic solutions are not enough for financial controls. Use code (Rule 3).' },
        { en: 'Wrong answer: build a routing classifier', si: 'The issue is tool order, not intent routing; a classifier is over-engineering (Rule 2).' },
        { en: 'Wrong answer: send only the full transcript in the handoff', si: 'The human may not have access to it or time to review it. Provide a structured summary.' },
      ],
    },
    {
      id: 'hooks-pretooluse-posttooluse',
      plain: "Hooks observe or influence lifecycle events around tool calls, but exact hook names, inputs, and return behavior depend on the Claude Agent SDK version. Verify the reference before coding.",
      internGuide: ["Hooks observe or influence lifecycle events around tool calls, but exact hook names, inputs, and return behavior depend on the Claude Agent SDK version. Verify the reference before coding.","A pre-tool hook can enforce policy, validate/modify input where supported, request approval, or deny execution. Authorization must still exist in the actual tool/service.","A post-tool hook can redact/normalize output, emit audit data, attach context, or flag errors. It cannot undo an irreversible side effect that already happened.","Keep hooks deterministic, fast, and fail-closed for sensitive operations; avoid secrets in logs and test allow, deny, error, timeout, and concurrent calls."],
      examRefs: ['CCAR-004'],
      title: 'Agent SDK Hooks: PreToolUse and PostToolUse (Task 1.5)',
      si: 'PreToolUse hook එක tool එක වැඩ කරන්න කලින් පරීක්ෂා කරන දොරටු ආරක්ෂකයෙක් වගේ. Rs. 500 ට වැඩි refund එකක් නම් ඒක නවත්තලා manager කෙනෙක්ට යවන්න කියන්න පුළුවන්. PostToolUse hook එක result එක ලැබුණාට පස්සේ දින සහ අංක එකම format එකකට හදනවා. අනිවාර්ය නීති code එකේ දාන්න, නම්‍යශීලී උපදෙස් prompt එකේ දෙන්න.',
      body: [
        'A hook is a callback that runs your code at a defined point in the agent loop. Because it is your code, it can enforce deterministic checks—the way to put mandatory rules in code.',
        'A PreToolUse hook runs before a tool and can be used to evaluate policy, reject or redirect a call, or request approval when supported by the installed Claude Agent SDK version. The exact callback input and decision fields have changed across SDK releases, so use the versioned hook reference instead of copying an old return object. For example, block a refund over $500 in trusted code and direct the workflow to human review.',
        'A PostToolUse hook runs after execution and can normalize a result, add audit/context information, or report a policy issue before the next model step. Exact result-replacement fields are SDK-version-specific. A post hook cannot undo an external side effect, so a refund limit belongs before execution and in the refund service’s own authorization logic.',
        'An MCP tool name has the form mcp__<server>__<tool>; use that name in a hook matcher. Use hooks for guaranteed enforcement and prompts for flexible guidance.',
      ],
      analogy:
        'PreToolUse is like a security guard checking people before they enter. PostToolUse is like repacking items from a shop into a consistent bag before handing them over.',
      example:
        'A request arrives for a $740 refund. The PreToolUse hook sees amount > 500, denies it, and tells Claude that human review is needed and to call escalate_to_human. Claude escalates on its next turn. Separately, if another system returns timestamp "1735689600", a PostToolUse hook can convert it to "2025-01-01T00:00:00Z" so Claude sees a consistent format.',
      code: {
        lang: 'python',
        src: `async def block_large_refunds(input_data, tool_use_id, context):
    amount = input_data["tool_input"].get("amount", 0)
    if amount > 500:                      # Block amounts over $500
        return {"hookSpecificOutput": {
            "hookEventName": input_data["hook_event_name"],
            "permissionDecision": "deny",
            "permissionDecisionReason":
                "Refunds over $500 need a human. Call escalate_to_human."}}
    return {}                             # An empty decision allows the call

options = ClaudeAgentOptions(hooks={"PreToolUse": [
    HookMatcher(matcher="mcp__support__process_refund",
                hooks=[block_large_refunds])]})`,
      },
      keyPoints: [
        'PreToolUse applies checks before execution; verify the decision fields supported by the installed SDK version.',
        'PostToolUse observes or normalizes a result after execution; it cannot undo a side effect.',
        'A hook is deterministic code; a prompt is probabilistic.',
        'MCP tool names use the form mcp__<server>__<tool>.',
      ],
      terms: [
        { en: 'Wrong answer: put the refund limit only in the prompt', si: 'Prompts can fail. Enforce financial rules with a hook (Rule 3).' },
        { en: 'Wrong answer: block a refund with PostToolUse', si: 'PostToolUse runs after the tool; use PreToolUse to block it.' },
        { en: 'Wrong answer: use a system prompt to normalize data', si: 'Normalize data formats directly in code with a PostToolUse hook.' },
      ],
    },
    {
      id: 'task-decomposition-chaining-dynamic',
      plain: "Prompt chaining uses a predefined sequence whose intermediate outputs feed later steps. It is understandable and testable when the task structure is stable.",
      internGuide: ["Prompt chaining uses a predefined sequence whose intermediate outputs feed later steps. It is understandable and testable when the task structure is stable.","Dynamic decomposition lets the model choose subtasks as it learns more. It handles uncertainty but adds nondeterminism, cost, duplicate work, and termination risk.","Use code for known dependencies and the model for genuinely ambiguous decisions. Define typed intermediate artifacts so one weak step does not silently contaminate the rest.","Cap depth/fan-out, deduplicate subtasks, record provenance, and test partial failure and replanning. Compare the dynamic design with a simpler fixed baseline."],
      examRefs: ['CCAR-021'],
      title: 'Task Decomposition: Prompt Chaining vs Dynamic (Task 1.6)',
      si: 'වැඩේ පියවර කලින්ම දන්නවා නම් ස්ථාවර prompt chain එකක් යොදාගන්න. PR එකේ files 14ක් බලනවා නම් file එකින් එක පරීක්ෂා කරලා අන්තිමේ එකට බලන්න. පරණ system එකක් ගැන මුලින්ම දන්නේ නැත්නම්, සොයාගන්නා දේ අනුව plan එක වෙනස් කරන dynamic ක්‍රමය තෝරන්න. එක prompt එකකට වැඩියෙන්ම පටවන්න එපා.',
      body: [
        'There are two ways to decompose work. Prompt chaining uses a fixed pipeline when the steps are known in advance. Dynamic decomposition is for open-ended work: the agent discovers what to do next and adapts its plan.',
        'For a pull request with 14 files, a chain can review each file locally, then perform a separate cross-file integration pass. Putting all 14 files in one large prompt can dilute attention and make findings less consistent.',
        'For "add tests to this legacy codebase," first map the structure, identify high-impact areas, and then make an adaptive plan based on what you discover.',
        'Ask whether the steps are predictable. If yes, use chaining; otherwise use dynamic decomposition. See Phase 12 for plan-and-execute.',
      ],
      analogy:
        'Chaining is like Colombo bus route 138, with known stops. Dynamic decomposition is like finding your way in an unfamiliar town and choosing the next turn as you go.',
      example:
        'For 14 pull-request files, use a chain: 14 local review passes plus one integration pass. For "add tests to this old system," use dynamic decomposition: map it, find high-impact areas, plan, and update the plan while executing.',
      keyPoints: [
        'Prompt chaining uses fixed, predictable steps such as per-file review followed by a cross-file pass.',
        'Dynamic decomposition is open-ended; discovery informs the plan.',
        'One large prompt is a poor fit for a multi-file review.',
      ],
      terms: [
        { en: 'Wrong answer: put all 14 files in one prompt', si: 'This dilutes attention. Review files individually, then do an integration pass.' },
        { en: 'Wrong answer: assume a large context window solves this', si: 'More context does not remove the attention problem.' },
        { en: 'Wrong answer: use a fixed chain for open-ended work', si: 'A fixed chain may stop fitting the work as discoveries are made; use a dynamic plan.' },
      ],
    },
    {
      id: 'sessions-resume-fork-fresh',
      plain: "Resume continues an existing session/history; fork copies history into a new branch while preserving the source; fresh start creates a separate context. Exact SDK helpers are version-specific.",
      internGuide: ["Resume continues an existing session/history; fork copies history into a new branch while preserving the source; fresh start creates a separate context. Exact SDK helpers are version-specific.","Resume when prior decisions and state remain valid. Fork to explore an alternative without altering the original. Start fresh when context is contaminated, unrelated, or must not cross users/tasks.","A transcript and a sandbox/filesystem are different state layers; confirm what the selected product persists, checkpoints, retains, and deletes.","Store session IDs with tenant authorization, prevent cross-user access, revalidate stale facts on resume, and test deletion/retention plus behavior after upgrades."],
      examRefs: ['CCAR-005', 'CCAR-022', 'CCAR-023'],
      title: 'Sessions: Resume, Fork and Fresh Start (Task 1.7)',
      si: 'Session එකක් කියන්නේ agent එකේ කලින් කතාබහ සුරැකුණු සටහනක්. ඊයේ වැඩේ අද කරගෙන යන්න resume කරන්න, නැත්නම් එකම තැනින් වෙනස් විසඳුම් දෙකක් බලන්න fork කරන්න. කණ්ඩායම files 10ක් වෙනස් කරලා නම් පරණ results මත විශ්වාස නොකර ඒවා නැවත කියවන්න කියන්න. බොහෝ දේ වෙනස් නම් සාරාංශයක් එක්ක අලුත් session එකක් පටන්ගන්න.',
      body: [
        'A session is saved conversation history. Resume a named earlier session with --resume <session-name>; in the SDK, use resume=session_id.',
        'fork_session creates branches from the same analysis without changing the original, for example to compare two testing strategies. It forks the conversation, not the files. Changes made to files while working in a fork are real file changes.',
        'If code changed before resuming, tell the agent which files changed and ask it to reread them. If many old tool results are stale, start a new session with a structured summary instead.',
      ],
      analogy:
        'Resume is like continuing a book from the page you reached. Fork is like copying the story to explore a different ending. A fresh start with a summary is like beginning a new book with a one-page set of notes.',
      example:
        'On Monday, analyze an auth module in the "refund-investigation" session. On Tuesday, the team changes 10 files. When resuming, tell the agent those 10 files changed and ask it to reread them. If many files changed, start a fresh session with a summary.',
      code: {
        lang: 'bash',
        src: `claude -n "refund-investigation"            # Name the session
claude --resume refund-investigation        # Continue the named session
claude --resume refund-investigation --fork-session  # Create a branch`,
      },
      keyPoints: [
        'Resume continues a session; tell the agent about changed files.',
        'fork_session branches the conversation, not the files.',
        'When many tool results are stale, start a fresh session with a structured summary.',
      ],
      terms: [
        { en: 'Wrong answer: resume a session with stale tool results', si: 'The agent may rely on outdated information and answer incorrectly. Start fresh with a summary.' },
        { en: 'Wrong answer: assume a fork copies files too', si: 'A fork branches the conversation only.' },
      ],
    },
    {
      id: 'tool-descriptions-naming-splitting',
      plain: "A tool description should state what the tool does, when to use it, important exclusions, side effects, and what each parameter means. Use distinct action-oriented names.",
      internGuide: ["A tool description should state what the tool does, when to use it, important exclusions, side effects, and what each parameter means. Use distinct action-oriented names.","Schemas should make invalid calls difficult: required fields, enums, formats, limits, and separate identifiers from free text. Strict schema support is product/model dependent.","Split a broad tool when operations have different permissions, side effects, failure modes, or inputs. Do not split so finely that simple work needs excessive round trips.","Evaluate tool selection and argument accuracy with realistic and confusing requests. Fix overlapping descriptions and expose idempotency/confirmation requirements clearly."],
      examRefs: ['CCAR-006'],
      title: 'Tool Descriptions, Naming and Splitting (Task 2.1)',
      si: 'Tool description එක රාක්කයේ ලේබලයක් වගේ; පැහැදිලි නැත්නම් agent වැ गलत tool එක තෝруулж болно. Order ID A12345 වගේ input, юу ලැබෙනවද, උදාහරණයක් සහ කවදා භාවිතා නොකළ යුතුද කියලා ලියන්න. මුලින් description එක හදන්න, ඉන්පස්සේ අවශ්‍ය නම් නම වෙනස් කරන්න. තවමත් වැඩ නොබෙදෙන්නේ නම් විශේෂිත tools කිහිපයකට කඩන්න.',
      body: [
        'Claude selects tools using their descriptions. If a description is as vague as "Retrieves customer information," Claude might choose get_customer for "check my order #12345."',
        'A good description explains what the tool does and returns, the input format (for example, an order ID with five digits after #), example queries, and boundaries that distinguish it from similar tools.',
        'Use this order of fixes: (1) improve the description; (2) rename overlapping tools (analyze_content → extract_web_results); (3) split a generic tool into focused tools (analyze_document → extract_data_points, summarize_content, verify_claim_against_source).',
        'Be careful with keyword-sensitive system-prompt rules such as "use get_customer for anything about a customer"; they can undermine good descriptions.',
      ],
      analogy:
        'Tool descriptions are like shelf labels at Keells. A label that says only "food" is vague; "rice—5 kg bags" is clearer. Improve the label first, then rename or split a tool if that still does not resolve the confusion.',
      example:
        'Before: lookup_order — "Retrieves order details." After: "Get one order’s status, items, and dates by order ID (format: A12345). Use for questions about a specific order. Do NOT use for customer profile questions; use get_customer." A clear description can help Claude choose the right tool on the next turn.',
      code: {
        lang: 'python',
        src: `TOOL = {
    "name": "lookup_order",
    "description": (
        "Get ONE order's status, items and dates by order ID "
        "(format: A12345). Use for questions about a specific order. "
        "Do NOT use for customer profile questions; use get_customer."),
    "input_schema": {
        "type": "object",
        "properties": {"order_id": {"type": "string",
                                    "description": "e.g. A12345"}},
        "required": ["order_id"]},
}`,
      },
      keyPoints: [
        'The description is the primary signal for tool selection.',
        'Fix in this order: improve the description, rename, then split.',
        'Use boundaries to distinguish similar tools (for example, "Do NOT use for...").',
        'Avoid keyword rules in the system prompt that conflict with tool descriptions.',
      ],
      terms: [
        { en: 'Wrong answer: add keyword rules to the system prompt', si: 'They may override good descriptions. Improve the description first (Rule 2).' },
        { en: 'Wrong answer: train a routing classifier', si: 'This is over-engineering; descriptions are the first fix (Rule 2).' },
        { en: 'Wrong answer: add few-shot examples', si: 'This uses more tokens without fixing the root cause: vague descriptions.' },
        { en: 'Wrong answer: merge the tools', si: 'That is a larger change than the first step. Split or merge only after improving descriptions.' },
      ],
    },
    {
      id: 'structured-error-responses',
      plain: "A successful tool call returns structured data; a recoverable tool failure should be explicitly marked as an error rather than returning error text that looks like success.",
      internGuide: ["A successful tool call returns structured data; a recoverable tool failure should be explicitly marked as an error rather than returning error text that looks like success.","In the Claude API, a `tool_result` can use `is_error`; in MCP, a tool result can use `isError`. These names belong to different wire formats.","`isRetryable` is not a universal standard field. If your application defines retry metadata, document its schema and keep the actual retry policy in trusted code.","Return a safe error code, human/model-readable message, retry guidance, and relevant field—not stack traces or secrets. Distinguish validation, authorization, not-found, conflict, rate-limit, transient, and internal failures."],
      examRefs: ['CCAR-028'],
      title: 'Structured Error Responses: isError and isRetryable (Task 2.2)',
      si: 'ATM එක “Error” කියනවා වෙනුවට PIN එක වැරදිද, ජාලය නැද්ද කියලා පැහැදිලි කරනවා වගේ tool එකත් error එකේ හේතුව කියන්න ඕනේ. Timeout එකක් නම් ටිකක් ඉඳලා නැවත උත්සාහ කරන්න පුළුවන්. Rs. 500 ට වැඩි refund එකකට manager ඕනේ නම් ආයෙත් උත්සාහ කරලා වැඩක් නැහැ. isRetryable සහ පැහැදිලි message එකෙන් agent එකට ඊළඟ පියවර තෝරන්න උදව් වෙනවා.',
      body: [
        'A generic "Operation failed" message gives an agent little guidance. MCP’s standard `isError: true` marks a tool result as failed. Fields such as `errorCategory` and `isRetryable` are useful application-defined metadata, not standard MCP fields; if you put them in structured content or JSON text, document their schema.',
        'There are four useful error categories: (1) Transient, such as a timeout or unavailable service: retry with backoff. (2) Validation, such as invalid input: correct the input and retry. (3) Business, such as a refund limit: do not retry; explain or escalate. (4) Permission: do not retry; escalate.',
        'Trusted application code should classify retry behavior. Retry transient failures with a bounded backoff; correct validation input before a new attempt; do not automatically retry permission or business-policy failures. The model may receive safe guidance, but it should not be the only component enforcing retry limits.',
      ],
      analogy:
        'An ATM that says only "Error" leaves you confused. It is more useful to know whether the card is blocked (permission), the PIN is wrong (validation), a daily limit was reached (business), or the network is down and you should retry (transient).',
      example:
        'process_refund($800) returns {errorCategory: "business", isRetryable: false, message: "Refunds over $500 need manager approval."}. The agent does not retry and instead calls escalate_to_human. If lookup_order times out, it returns a transient, retryable error and the agent tries again after a short delay.',
      code: {
        lang: 'json',
        src: `{
  "isError": true,
  "content": [{
    "type": "text",
    "text": "{\\"errorCategory\\": \\"business\\", \\"isRetryable\\": false, \\"message\\": \\"Refunds over $500 need manager approval.\\"}"
  }]
}`,
      },
      keyPoints: [
        'Use four error categories: transient, validation, business, and permission.',
        '`isError: true` is the MCP failure signal; `errorCategory` and `isRetryable` are optional application-defined fields, not universal protocol fields.',
        'Retry transient failures; correct validation failures before retrying. Do not retry business or permission failures.',
        'A generic "Operation failed" message gives the agent no useful recovery guidance.',
      ],
      terms: [
        { en: 'Wrong answer: return only "Operation failed"', si: 'The agent cannot choose an informed recovery action (Rule 5).' },
        { en: 'Wrong answer: retry a business error', si: 'A retry does not change the policy; it will not help.' },
        { en: 'Wrong answer: retry a permission error with backoff', si: 'Retries do not grant permission. Escalate instead.' },
      ],
    },
    {
      id: 'access-failure-vs-empty-result',
      plain: "An empty result means the authorized query succeeded and found no items. An access failure means the system could not verify or permit the request; treating it as empty hides a security or availability problem.",
      internGuide: ["An empty result means the authorized query succeeded and found no items. An access failure means the system could not verify or permit the request; treating it as empty hides a security or availability problem.","Use distinct statuses such as OK_EMPTY, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, RATE_LIMITED, and UPSTREAM_UNAVAILABLE with carefully chosen user-facing messages.","The agent may recover locally from safe cases by correcting input, asking for missing identity, narrowing a query, or trying an approved alternate source. It must not bypass policy.","Test that denial cannot become “no data,” that absence does not leak resource existence, and that audit logs retain the real cause even when user messages are intentionally vague."],
      examRefs: ['CCAR-007'],
      title: 'Access Failure ≠ Empty Result and Local Recovery (Task 2.2)',
      si: 'කඩේට ගිහින් අල ඉවරයි කියන එකයි කඩේ වහලා නිසා දැනගන්න බැරි එකයි වෙනස්. Database timeout එකක් හිස් list එකක් කරලා යැව්වොත් agent එක orders නැහැ කියලා වැරදියට කියයි. Timeout එක error එකක් ලෙසත්, හොයාගත්තේ නැති එක සාමාන්‍ය result එකක් ලෙසත් යවන්න. Subagent එකට retry කරන්න ඉඩ දෙන්න; බැරි නම් උත්සාහ කළ දේවල් එක්ක coordinator ට කියන්න.',
      body: [
        'A database timeout and "no order exists with that ID" are different. The first is an access failure—you could not find out. The second is a valid empty result—the order truly does not exist.',
        'If a timeout is returned as [] (an empty list), the agent may falsely tell the user that the customer has no orders. A timeout is an error (isError: true, transient); no matching order is a normal result such as {"found": false}.',
        'In a multi-agent system, let a subagent handle transient errors locally by retrying. Send only unresolved errors to the coordinator, with partial results and context about the attempts: failure type, query, partial results, and alternatives.',
        'Do not stop the entire workflow because of one error. Annotate coverage in the final report, distinguishing supported findings from topics with gaps because sources were unavailable.',
      ],
      analogy:
        'If you ask a shop for potatoes, "No, we are out" is an empty result, while a locked shop means you could not check (access failure). Confusing the two could send you to another shop when you only needed to wait for this one to open.',
      example:
        'A search subagent times out. Wrong: return [] and report "no results." Better: retry once after a short delay. If it still fails, tell the coordinator {failureType: transient, query: "AI music 2025", partialResults: [...], alternatives: ["another search source"]}.',
      keyPoints: [
        'A timeout (access failure) is an error; "no match" is a valid empty result. Never confuse them.',
        'Let the subagent handle transient errors locally.',
        'Send unresolved errors to the coordinator with structured context: type, query, partial results, and alternatives.',
        'Do not stop the whole workflow for one error; annotate coverage.',
      ],
      terms: [
        { en: 'Wrong answer: report a timeout as an empty success', si: 'This hides the error and can lead the agent to a false conclusion (Rule 5).' },
        { en: 'Wrong answer: return only a generic status such as "search unavailable"', si: 'The coordinator lacks the context needed to recover.' },
        { en: 'Wrong answer: stop the entire workflow when one subagent fails', si: 'That is unnecessary; continue with partial results.' },
      ],
    },
    {
      id: 'tool-distribution-least-privilege',
      plain: "Give each agent only the tools and scopes required for its role. Tool visibility, tool-call permission, and backend authorization are separate controls.",
      internGuide: ["Give each agent only the tools and scopes required for its role. Tool visibility, tool-call permission, and backend authorization are separate controls.","Prefer read-only lookup tools for research agents and isolate write/payment/deployment tools behind stronger identity, validation, approval, and audit requirements.","Use the end user’s delegated identity where possible; avoid shared superuser credentials. Restrict resource, action, tenant, environment, amount, and time.","Review permissions as tools and roles change, revoke unused access, and test confused-deputy, prompt-injection, cross-tenant, and indirect-tool-call attacks."],
      examRefs: ['CCAR-008'],
      title: 'Tool Distribution and Least Privilege (Task 2.3)',
      si: 'Agent එකකට අවශ්‍ය tools විතරක් දෙන්න; synthesis agent ට සම්පූර්ණ web search එක අවශ්‍ය නැහැ. Tuk-tuk රියදුරාට ගාස්තු පෙට්ටියේ යතුර දෙනවා මිස බැංකුවේ සේප්පුවේ යතුර දෙන්නේ නැහැ වගේ. සරල fact-check සඳහා සීමිත verify_fact tool එකක් දෙන්න. සංකීර්ණ ප්‍රශ්න coordinator හරහා යවන්න.',
      body: [
        'Giving an agent 18 tools can make Claude’s tool selection less reliable. Provide about 4–5 tools that fit its role. Tools outside the role can be misused—for example, a synthesis agent may start doing web searches.',
        'A synthesis agent that must ask the coordinator for every simple fact check (about 85%) creates unnecessary round trips. Give it a scoped verify_fact tool for those checks; send the more complex 15% through the coordinator. Do not give it every web-search tool.',
        'Prefer constrained tools such as load_document, which validates a URL, over a generic fetch_url tool. A tool with a narrow purpose has less room for misuse.',
        'This is Rule 6 (least privilege). See Phase 19 for more about agent safety.',
      ],
      analogy:
        'A tuk-tuk driver needs the key to the fare box, not the bank vault. Give a synthesis agent a small key (a scoped verify_fact tool) for simple checks, not access to every search tool.',
      example:
        'In a research system, the web-searcher gets WebSearch and WebFetch; the document-analyzer gets Read and extract_data_points; and the synthesizer gets Read and scoped verify_fact. Each has only 2–3 tools, reducing simple synthesis round trips while leaving complex checks with the coordinator.',
      keyPoints: [
        'Give each agent about 4–5 tools; 18 can increase selection errors.',
        'Tools outside an agent’s role create opportunities for misuse.',
        'Use scoped verify_fact for the simple 85%; route the complex 15% through the coordinator.',
        'Prefer a constrained load_document tool to an unrestricted fetch_url.',
      ],
      terms: [
        { en: 'Wrong answer: give every agent every tool', si: 'This violates least privilege and can increase selection errors (Rule 6).' },
        { en: 'Wrong answer: batch the requests', si: 'Dependencies may prevent batching, and it does not fix the round-trip design.' },
        { en: 'Wrong answer: use caching or speculative caching', si: 'The issue is tool-access design; caching does not address it.' },
      ],
    },
    {
      id: 'tool-choice-auto-any-forced',
      plain: "`auto` lets Claude decide whether to answer or use a tool. `any` requires some offered tool. A forced choice selects one named tool; use the exact current API structure.",
      internGuide: ["`auto` lets Claude decide whether to answer or use a tool. `any` requires some offered tool. A forced choice selects one named tool; use the exact current API structure.","Requiring a call can improve structured extraction or ensure a lookup, but forcing the wrong tool produces fabricated arguments or unnecessary side effects.","Tool choice controls model selection behavior, not authorization. The application must still validate schemas, permissions, state, and confirmations.","Use normal language plus `auto` by default; require/force only for a tested contract. Handle missing required parameters and multiple/parallel calls explicitly."],
      title: 'tool_choice: auto, any, forced (Task 2.3)',
      si: 'ඔයාට tool එකක් අනිවාර්ය කරන්නේද කියලා tool_choice තීරණය කරනවා. auto නම් Claude text එකක් දෙන්නත් tool එකක් අමතන්නත් තෝරනවා. any නම් යම් tool එකක් අනිවාර්යයි, නමුත් කුමන එකද කියලා Claude තෝරනවා. නිශ්චිත tool එකක් බලෙන් තෝරන එක නොදන්නා document වර්ගයකට වැරදි schema එකක් යොදන්න පුළුවන්.',
      body: [
        'tool_choice is a request parameter that controls whether Claude must call a tool. There are three choices, plus none:',
        '{"type": "auto"}: Claude decides whether to call a tool or answer with text. Use for ordinary chat with tools.',
        '{"type": "any"}: Claude must call some tool rather than answer with text. Use when structured output is required or the document type is unknown and Claude must choose among several schemas.',
        '{"type": "tool", "name": "extract_metadata"}: Claude must call that specific tool, for example to run metadata extraction first. {"type": "none"} means no tools are available for this turn.',
      ],
      analogy:
        'In a kottu shop, auto is "order something if you like"; any is "you must order one item from the menu"; forced is "order today’s special kottu"; and none is "there is no menu this turn, so just talk."',
      example:
        'Suppose there are extraction schemas for invoices, receipts, and contracts, but you do not know the incoming document type. Set tool_choice to "any" so Claude must call a tool and can choose the matching schema. If metadata must always be extracted first, force extract_metadata.',
      code: {
        lang: 'python',
        src: `tool_choice={"type": "auto"}   # Claude chooses; text is allowed
tool_choice={"type": "any"}    # A tool call is required
tool_choice={"type": "tool",   # This specific tool is required
             "name": "extract_metadata"}
tool_choice={"type": "none"}   # No tools for this turn`,
      },
      keyPoints: [
        'auto lets Claude decide; it may return text.',
        'any requires a tool call, useful when the document type is unknown or structured output is required.',
        'A forced tool requires that specific tool to run.',
        'For the exam’s "any," current documentation uses {"type": "any"} with the same meaning.',
      ],
      terms: [
        { en: 'Wrong answer: expect schema output while using auto', si: 'With auto, Claude may answer with text instead of calling a tool.' },
        { en: 'Wrong answer: force a tool when the document type is unknown', si: 'This could force the wrong schema. Use any when the correct tool is not known in advance.' },
      ],
    },
    {
      id: 'mcp-servers-scopes-env',
      plain: "An MCP host connects clients to servers that expose capabilities. Configuration scope may be project, user, or managed/product-specific; names and precedence are implementation details, not core MCP semantics.",
      internGuide: ["An MCP host connects clients to servers that expose capabilities. Configuration scope may be project, user, or managed/product-specific; names and precedence are implementation details, not core MCP semantics.","Environment variables can inject non-secret configuration or secret references, but expansion syntax differs by launcher. Never place resolved secrets into prompts, logs, or committed configuration.","Pin or review server code, command, package/version, transport, working directory, environment allowlist, and permissions. A community server executes with the authority you give it.","Test startup failure, capability discovery, auth expiry, cancellation, and cleanup. Use the narrowest scope so one project or user cannot unexpectedly affect another."],
      examRefs: ['CCAR-009', 'CCAR-025', 'CCAR-027'],
      title: 'MCP Servers: Scopes and Environment Expansion (Task 2.4)',
      si: 'Project එකටම ඕනේ MCP server එක repo එකේ .mcp.json තුළ දාන්න, එතකොට කණ්ඩායමට එකම සැකසුම ලැබෙනවා. පුද්ගලික අත්හදාබැලීම් ~/.claude.json තුළ තියාගන්න. GitHub token එක ගොනුවට කෙලින්ම ලියන්න එපා; GITHUB_TOKEN වගේ environment variable එකකින් ගන්න. Colombo office එකේ කණ්ඩායමට එකම server එක share කරද්දී රහස් token එක තමන්ගේ machine එකේ තියාගන්න.',
      body: [
        'Connect an MCP server to Claude Code through a configuration file. There are two scopes: project scope uses .mcp.json in the repository and can be shared with the team through Git; user scope uses ~/.claude.json and is personal, for example for experimental servers.',
        'Do not write secrets such as tokens directly in a config file that will be committed to Git. Use environment-variable expansion instead, such as "GITHUB_TOKEN": "${GITHUB_TOKEN}", so each developer’s machine provides the value.',
        'Tools from configured servers are discovered when connecting and can be used together. If the agent prefers a built-in tool such as Grep over an MCP tool, improve the MCP tool’s description (see Task 2.1).',
      ],
      analogy:
        'Posting your home Wi-Fi password on the refrigerator lets every visitor see it—like committing a token to Git. ${GITHUB_TOKEN} means the secret stays on your device instead of being written in the shared file.',
      example:
        'A team shares a GitHub MCP server by committing .mcp.json without the token, using ${GITHUB_TOKEN} as a reference. A new developer clones the repository, sets GITHUB_TOKEN in their environment, and can use the server. Keep an experimental server in your personal ~/.claude.json.',
      code: {
        lang: 'json',
        src: `{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "\${GITHUB_TOKEN}" }
    }
  }
}`,
      },
      keyPoints: [
        'Project scope uses .mcp.json and can be shared with the team through Git; user scope uses personal ~/.claude.json.',
        'Use ${ENV_VAR} expansion for secrets; never commit a token.',
        'Tools from configured servers are discovered at connection time and can be used together.',
        'If the agent ignores an MCP tool, improve its description.',
      ],
      terms: [
        { en: 'Wrong answer: write the token directly in .mcp.json', si: 'The secret would remain in the Git history.' },
        { en: 'Wrong answer: put the shared team server in user-scoped ~/.claude.json', si: 'Teammates would not receive it. Use .mcp.json for team configuration.' },
        { en: 'Wrong answer: put the server in a file such as .claude/config.json', si: 'That filename is an exam distractor here; use .mcp.json or ~/.claude.json.' },
      ],
    },
    {
      id: 'mcp-resources-community-custom',
      plain: "MCP resources are application-controlled contextual data addressed by URIs; tools are model-invoked actions. Prompts are reusable templates. Choose the primitive by who initiates and whether side effects occur.",
      internGuide: ["MCP resources are application-controlled contextual data addressed by URIs; tools are model-invoked actions. Prompts are reusable templates. Choose the primitive by who initiates and whether side effects occur.","A resource read is not a substitute for an action tool, and a read-only tool is still a tool. Errors for tool calls versus resource reads use different protocol paths.","Community servers speed integration but require provenance, maintenance, license, dependency, permission, and security review. Custom servers offer control but create ownership and support work.","Expose minimal data and actions, validate URIs/inputs, enforce backend authorization, sanitize untrusted content, and version schemas so clients can evolve safely."],
      title: 'MCP Resources vs Tools, Community vs Custom Servers (Task 2.4)',
      si: 'MCP Resource එකක් කියන්නේ කියවන්න පුළුවන් ලේඛනයක් වගේ, Tool එකක් කියන්නේ ක්‍රියාවක් කරන උපකරණයක් වගේ. උදාහරණයට policy එකක් කියවීම resource එකක්, refund එකක් ඉල්ලීම tool එකක්. Community server එකක් තෝරද්දී කවුද හදලා තියෙන්නේ සහ එය කරන දේ පරීක්ෂා කරන්න. අවශ්‍ය කාර්යය නොමැති නම් තමන්ට ගැළපෙන server එකක් හදන්න පුළුවන්.',
      body: [
        'MCP server එකකින් ප්‍රධාන දේවල් 2ක් ඉදිරිපත් කළ හැකියි. Tools = actions (lookup_order, process_refund; ක්‍රියාවන් කරනවා). Resources = කියවිය හැකි content catalogs (issue summaries, documentation hierarchy, database schema).',
        'Resources වලින් agent ට "මෙතන මොනවා තියෙනවාද" කියලා ඉක්මනින් දැනගන්න පුළුවන්, ඒ නිසා exploratory tool calls අඩු වෙනවා. උදා: refund policy documents වල index එක resource එකක් ලෙස, agent එක ඒක බලලා අදාළ document එක කෙලින්ම ගන්නවා.',
        'Community vs custom: Jira වගේ සාමාන්‍ය integrations වලට ඒ සඳහාම හදපු community MCP server එකක් භාවිතා කරන්න (අලුතෙන් හදන්න එපා). Team එකටම ආවේණික workflows වලට (අභ්‍යන්තර ක්‍රියාවලි) custom server එකක් හදන්න.',
        'Custom server එකේ tool එකක් ලියද්දී docstring එකම tool description එක වෙනවා: අරමුණ, input format, කවදා භාවිතා නොකළ යුතුද. Timeout එක isError + transient, order නැති වීම සාමාන්‍ය result. Tool result එකේ fields 40 නොයවා අවශ්‍ය ඒවා පමණක් දෙන්න (Domain 5.1).',
      ],
      analogy:
        'Library එකක catalog (resources) සහ වාර්තා ගන්න කවුන්ටරය (tools). Catalog එක බලලා ඔයාට හරියටම කුමන පොතද ඕනේ කියලා දැනගන්න පුළුවන්; ඒ නිසා අලමාරි 20ක් ඇවිදින්න ඕනේ නෑ. Jira වගේ සාමාන්‍ය දේට ඉස්සෙල්ලා හදපු කඩේ (community), ඔයාගේ පවුලේ විශේෂ වට්ටෝරුවට තමයි ඔයාම හදන දේ (custom).',
      example:
        'Support MCP server: tool lookup_order, tool process_refund, resource catalog://refund-policies (policy documents වල index එක). Agent එක පළමුව resource එක කියවලා අදාළ policy එක හොයාගන්නවා. Jira tickets ගැනත් අවශ්‍ය නම් community Jira server එකක් එකතු කරනවා.',
      code: {
        lang: 'python',
        src: `mcp = FastMCP("support")

@mcp.tool()
def lookup_order(order_id: str) -> CallToolResult:
    """Get one order by ID (format: A12345). Not for customer profiles."""
    try:
        order = db.find_order(order_id)
    except TimeoutError:               # access failure = error
        return CallToolResult(isError=True, content=[TextContent(
            type="text", text=json.dumps({"errorCategory": "transient",
            "isRetryable": True, "message": "DB timed out. Retry."}))])
    if order is None:                  # valid empty result, error නෙවෙයි
        return CallToolResult(content=[TextContent(
            type="text", text='{"found": false}')])
    return CallToolResult(content=[TextContent(
        type="text", text=json.dumps(order.relevant_fields()))])`,
      },
      keyPoints: [
        'Tools = actions; Resources = කියවිය හැකි content catalogs (exploratory calls අඩු).',
        'Community server = සාමාන්‍ය integrations (Jira); custom = team-specific workflows.',
        'Docstring = tool description. Timeout = isError; "නැහැ" = normal result.',
      ],
      terms: [
        { en: 'Wrong answer: Jira සඳහා custom server එකක් අලුතෙන් ලිවීම', si: 'Community server එක ඇති නම් ඒක භාවිතා කරන්න. අනවශ්‍ය වැඩ.' },
        { en: 'Wrong answer: schema/docs catalog එකත් tool එකක් ලෙස', si: 'කියවිය හැකි catalogs වලට resources. ඒකෙන් exploratory tool calls අඩු වෙනවා.' },
        { en: 'Wrong answer: agent Grep භාවිතා කරනවා නිසා MCP tool ඉවත් කිරීම', si: 'MCP tool එකේ description එක වැඩිදියුණු කරන්න.' },
      ],
    },
    {
      id: 'builtin-tools-exploration',
      plain: "Built-in or Anthropic-defined tools vary by product and model. Confirm whether a tool runs on Anthropic infrastructure, in your client, or in an agent sandbox before designing controls.",
      internGuide: ["Built-in or Anthropic-defined tools vary by product and model. Confirm whether a tool runs on Anthropic infrastructure, in your client, or in an agent sandbox before designing controls.","Explore a codebase by reading project instructions, listing/searching files, inspecting entry points and tests, then forming a hypothesis before editing. Search is cheaper and safer than opening everything.","Shell and file tools can have powerful side effects. Use permission policies, sandboxing, path restrictions, command validation, and human approval for consequential operations.","Require evidence: cited files/lines, test output, diffs, and unresolved risks. Tool activity is not proof that the task was correctly completed."],
      examRefs: ['CCAR-010', 'CCAR-026'],
      title: 'Built-in Tools and Codebase Exploration (Task 2.5)',
      si: 'Project එකක test files හොයන්න Glob භාවිතා කරන්න, code ඇතුළේ function එකක් හොයන්න Grep භාවිතා කරන්න. Read එකෙන් ගොනුව බලන්න, Edit එකෙන් තෝරාගත් කොටස වෙනස් කරන්න. ලොකු repo එකක මුලින්ම සියලු ගොනු කියවන්න එපා; entry point එක හොයාගෙන අදාළ imports ටික බලන්න. Edit එක අසාර්ථක වුණොත් නැවත Read කරලා ඉලක්කගත Write එකක් කරන්න.',
      body: [
        'Claude Code එකේ built-in tools: Grep = file අන්තර්ගතය තුළ pattern සෙවීම (function එකක callers, error message එකක්). Glob = file නම්/path pattern එකකින් සෙවීම (**/*.test.tsx). Read = සම්පූර්ණ file එකක් කියවීම. Write = සම්පූර්ණ file එකක් ලිවීම. Edit = unique text එකක් සොයා ඉලක්කගත වෙනස් කිරීමක්. Bash = shell commands (tests run කිරීම).',
        'Grep vs Glob: Grep අන්තර්ගතය (content) තුළ සොයනවා. Glob නම/path එකෙන් සොයනවා. "*.spec.ts files හොයන්න" = Glob. "මේ function එක call කරන තැන්" = Grep.',
        'Edit එකට unique text එකක් හමු නොවුණොත් (එකම text කිහිප තැනක, හෝ කොහෙත්ම නැහැ) fallback: Read එකෙන් file එක ගෙන Write එකෙන් සම්පූර්ණ file එක ලියන්න.',
        'නොදන්න codebase එකක් ක්‍රමයෙන් ඉගෙන ගන්න: Grep එකෙන් entry points හොයා, Read එකෙන් imports follow කරන්න. සියලු files එකවර කියවන්න එපා (context පිරෙනවා). Wrapper modules හරහා trace කරද්දී පළමුව exported names සොයා, එක් එක් නම Grep කරන්න.',
      ],
      analogy:
        'අලුත් ගමක පාර හොයන්න: Grep = "ගඟ" කියන වචනය ඇති සියලු පුවරු සොයනවා (අන්තර්ගතය). Glob = "ප්‍රධාන පාර" නමින් ඇති හැම පුවරුවම (නම). Read = ඒ පුවරුව සම්පූර්ණයෙන් කියවනවා. ගම මුළුමනින් එකවර ඇවිද්දොත් මහන්සියි, හන්දියෙන් හන්දියට යනවා.',
      example:
        'Task: "refund flow එක trace කරන්න". Grep "process_refund" → entry point file. Read ඒ file → imports දකිනවා. Read ඒවා ක්‍රමයෙන්. Tests file කොහෙද? Glob "**/*refund*.test.*". Variable එක වෙනස් කරන්න Edit; Edit අසාර්ථක (text කිහිප තැනක) නම් Read + Write.',
      keyPoints: [
        'Grep = අන්තර්ගතය; Glob = file නම/path pattern.',
        'Read/Write = සම්පූර්ණ file; Edit = unique text එකෙන් ඉලක්කගත.',
        'Edit අසාර්ථක = Read + Write fallback.',
        'ක්‍රමයෙන් explore: Grep entry points → Read imports. සියල්ල එකවර නොකියවන්න.',
      ],
      terms: [
        { en: 'Wrong answer: *.spec.ts files හොයන්න Grep', si: 'ඒක file නම්. Glob භාවිතා කරන්න.' },
        { en: 'Wrong answer: සියලු files කියවා පටන් ගැනීම', si: 'Context පුරවයි. Incremental exploration.' },
        { en: 'Wrong answer: Edit අසාර්ථක වුණාම හැර දැමීම / sed හෝ Bash', si: 'Read + Write fallback ය නිර්දේශිත.' },
        { en: 'Bash', si: 'Shell commands (tests run කිරීම). අන්තර්ගත සෙවීමට Grep වඩා ගැළපෙනවා.' },
      ],
    },
    {
      id: 'scenario-customer-support-agent',
      plain: "Start with supported intents, identity requirements, knowledge sources, allowed actions, SLA, escalation, and success metrics. Keep account data isolated by customer.",
      internGuide: ["Start with supported intents, identity requirements, knowledge sources, allowed actions, SLA, escalation, and success metrics. Keep account data isolated by customer.","Use retrieval for policy answers and narrow tools for account lookup, ticket creation, or changes. Separate read from write and require confirmation/approval for sensitive actions.","Represent case state explicitly, make write calls idempotent, distinguish empty data from access failure, cite evidence, and hand off with a useful summary.","Evaluate task resolution, policy correctness, tool arguments, containment, re-contact, latency, cost, injection resistance, and human override before expanding autonomy."],
      title: 'Scenario: Customer Support Resolution Agent',
      si: 'Support agent එකට get_customer, lookup_order, process_refund සහ escalate_to_human tools තියෙනවා කියලා හිතන්න. Customer ID එක තහවුරු නොකර refund දෙන්න බැරි gate එක code එකෙන් දාන්න. Order ගැන ප්‍රශ්නයකට වැරදි tool එක යනවා නම් descriptions පැහැදිලි කරන්න. Customer මනුස්සයෙක් ඉල්ලුවොත් හෝ match කිහිපයක් තිබුණොත් ඒ තොරතුරු ඉල්ලා human කෙනෙකුට යොමු කරන්න.',
      body: [
        'Setup: Agent SDK එකෙන් support agent එකක්. MCP tools: get_customer, lookup_order, process_refund, escalate_to_human. ඉලක්කය 80%+ first-contact resolution. Domains 1, 2, 5. Exam එකේ "80% FCR" වගේ ඉලක්කයට යටි ඉරක් ඇඳලා පිළිතුර ඒකට ගැළපෙනවාද බලන්න.',
        'රටා 1 (tool order ගැටලුව): "12% වරක get_customer මඟ හැරලා වැරදි refunds". පිළිතුර: verified customer ID එක ලැබෙනකම් lookup_order/process_refund block කරන programmatic prerequisite. Rule 3 (අනිවාර්ය නීතිය = code). Prompt/few-shot probabilistic; routing classifier ගැටලුවට අදාළ නෑ.',
        'රටා 2 (වැරදි tool තේරීම): "Order ප්‍රශ්න වලට get_customer call කරයි; descriptions අවමයි". පිළිතුර: tool descriptions විස්තර කරන්න (inputs, උදාහරණ, boundaries). Rule 2 (සරල පළමු පියවර) සහ Rule 1 (root cause = descriptions).',
        'රටා 3 (Escalation, Domain 5): සරල cases escalate, සංකීර්ණ ඒවා තමන්ම කරයි. පිළිතුර: explicit escalation criteria + few-shot (Rule 4). Self-reported confidence සහ sentiment විශ්වාසනීය නැහැ. Customer මනුස්සයෙක් ඉල්ලුවොත් වහාම escalate. Customers කිහිපයක් ගැළපුණොත් අමතර identifier එකක් ඉල්ලන්න. ($500 refund hook ගැන Task 1.5.)',
      ],
      analogy:
        'Bank branch එකක counter එක: ගනුදෙනුකරුවා ID පෙන්වනකම් system එක ගිණුම open කරන්නේ නෑ (gate = code). Staff ට "ආරක්ෂාව ගැන පරෙස්සම් වෙන්න" කියලා කියනවා විතරක් ප්‍රමාණවත් නෑ.',
      example:
        'Question: "agent 12% වාරවල identity verify නොකර refund කරනවා. හොඳම පළමු පියවර?" Options: (A) system prompt strengthen, (B) few-shot examples, (C) intent routing classifier, (D) verified ID නැත්නම් process_refund/lookup_order block කරන programmatic gate. පිළිතුර D. A, B probabilistic; C ගැටලුව විසඳන්නේ නෑ.',
      keyPoints: [
        'ID/මුදල් නීති = hook/gate (Rule 3).',
        'වැරදි tool = descriptions (Rule 2 + 1).',
        'Escalation = explicit criteria + few-shot, sentiment/confidence නෙවෙයි (Rule 4).',
        'Human ඉල්ලුවොත් ඉක්මනින්; policy නිහඬ නම් escalate; matches කිහිපයක් නම් identifier එකක් ඉල්ලන්න.',
      ],
      terms: [
        { en: 'Rule 3 trap', si: 'තවත් ශක්තිමත් prompt එක exam එකේ ප්‍රියතම distractor එක.' },
        { en: 'Rule 2 trap', si: 'Routing layer / classifier / tools merge, "පළමු පියවර" ට වැඩි වැඩ.' },
        { en: 'Rule 4 trap', si: 'Sentiment analysis, self-reported 1–10 confidence.' },
      ],
    },
    {
      id: 'scenario-multi-agent-research',
      plain: "A coordinator should decompose a question into non-overlapping evidence tasks, assign source constraints, and define the final synthesis schema.",
      internGuide: ["A coordinator should decompose a question into non-overlapping evidence tasks, assign source constraints, and define the final synthesis schema.","Researchers return claims with source, date, quote/paraphrase boundaries, and uncertainty. A verifier checks primary evidence and conflicts rather than merely rewriting.","Parallelize independent branches, but cap agents and searches. Deduplicate sources, distinguish publication date from event date, and never treat consensus among copied sources as independent confirmation.","The final report maps claims to evidence, states inference, includes disagreements/limitations, and passes citation checks. Evaluate factual precision and coverage, not prose fluency alone."],
      title: 'Scenario: Multi-Agent Research System',
      si: 'Research report එකේ මාතෘකා හතරෙන් එකක් විතරක් තිබුණොත්, subagents හොඳට වැඩ කළත් coordinator ගේ සැලැස්ම පටු වෙන්න පුළුවන්. එක subagent එක timeout වුණා කියලා මුළු report එක නවත්වන්න එපා; ලැබුණු කරුණු සහ අඩුපාඩු සටහන් කරන්න. සරල කරුණු පරීක්ෂාවට synthesis agent ට සීමිත tool එකක් දෙන්න. Subagent එකට අවශ්‍ය background එක prompt එකේ දාන්න.',
      body: [
        'Setup: Coordinator එක search, document-analysis, synthesis subagents ට වැඩ බෙදයි; cited reports. Domains 1, 2, 5.',
        'රටා 1 (අසම්පූර්ණ report): "Creative industries" report එක visual arts විතරයි, subagents හොඳින් වැඩ කළා. පිළිතුර: coordinator ගේ decomposition පටුයි. Rule 1 (root cause). වැරදි: subagents වලට වරද පැටවීම.',
        'රටා 2 (subagent timeout): පිළිතුර: structured error context (failure type, attempted query, partial results, alternatives). Rule 5. වැරදි: generic status, හිස් success, මුළු workflow නවත්වීම.',
        'රටා 3 (synthesis verification round trips): synthesis agent ට scoped verify_fact tool එකක් (සරල 85%), සංකීර්ණ 15% coordinator හරහා. Rule 6 (least privilege) නමුත් පුළුල් නොවන ආකාරයට. වැරදි: සියලු tools දීම, batching, caching.',
        'රටා 4: subagent එකට info නැත → ඔයාම prompt එකට දෙන්න (inherit නොවේ). Subagents හෙමින් → එක response එකක Task/Agent calls කිහිපයක් (parallel).',
      ],
      analogy:
        'Newsroom එකක editor (coordinator) වාර්තාකරුවන්ට සාරාංශ බෙදනවා. Editor "සංස්කෘතිය" කියලා කොටස විතරක් දුන්නොත් ලේඛකයන් වරදක් නැතුව ලිව්වත් පත්තරේ කොටස් අඩුයි. වරද editor ගේ කොටස් බෙදීමේ.',
      example:
        'Question: "report එක topic 4න් 1ක් විතරයි. subagent logs හරි." පිළිතුර: coordinator decomposition එක පුළුල් කරන්න. වැරදි: "search subagent prompt එක දීර්ඝ කරන්න", "synthesis agent වෙනස් කරන්න" (root cause එකේ නැති කොටස්).',
      keyPoints: [
        'Logs වල root cause එක coordinator නම් අනෙක් කොටස් වෙනස් කරන පිළිතුරු නොසලකන්න (Rule 1).',
        'Errors ව්‍යුහගතව ඉදිරියට (Rule 5).',
        'Synthesis ට scoped verify_fact (Rule 6).',
        'Parallel = එකම response එකක tool calls කිහිපයක්.',
      ],
      terms: [
        { en: 'Rule 1 trap', si: 'Root cause එක නොවන කොටස් වෙනස් කරන පිළිතුරු.' },
        { en: 'Rule 5 trap', si: 'Error suppress කිරීම / empty success.' },
        { en: 'Rule 6 trap', si: 'සියලු tools දීම, නැත්නම් සම්පූර්ණයෙන් tool නැතිව coordinator හරහා.' },
      ],
    },
    {
      id: 'scenario-developer-productivity',
      plain: "Define the coding agent’s boundary: repository paths, commands, network, secrets, branch/write permissions, and whether it may commit or open changes.",
      internGuide: ["Define the coding agent’s boundary: repository paths, commands, network, secrets, branch/write permissions, and whether it may commit or open changes.","Require it to inspect instructions and current tests first, make focused changes, preserve unrelated work, and explain the evidence for the diagnosis.","Run formatting, static checks, targeted tests, and an appropriate broader suite. Review the diff for generated junk, dependency changes, security issues, and hidden behavior.","Use approval for destructive commands, deployments, credential access, or external messages. Track acceptance, regressions, time saved, and incidents rather than lines generated."],
      title: 'Scenario: Developer Productivity with Claude',
      si: 'නොදන්නා codebase එකක test files හොයද්දී Glob යොදාගන්න; function එකක් භාවිතා කරන තැන් හොයද්දී Grep යොදාගන්න. Files 14ක් review කරනවා නම් එක විශාල prompt එකකට දාන්නේ නැතුව file එකින් එක බලලා අන්තිමේ එකට සසඳන්න. Tool එකක් හරියට වැඩ නොකළොත් එහි output සහ error එක පරීක්ෂා කරලා ඉදිරියට යන්න. ඔයාට අවශ්‍ය tool එකට විතරක් agent එකට අවසර දෙන්න.',
      body: [
        'Setup: නොදන්න codebases තේරුම් ගන්න agent එකක්. Built-in tools (Read, Write, Bash, Grep, Glob) සහ MCP. Domains 2, 3, 1.',
        'රටා 1 (ෆයිල් සෙවීම): "සියලු test files හොයන්න" → Glob. "මේ function call කරන තැන්" → Grep. Exam එක Grep/Glob මාරු කරලා පිළිතුරක් ඉදිරිපත් කරයි. Rule: නම/path = Glob, අන්තර්ගතය = Grep.',
        'රටා 2 (Edit අසාර්ථක): unique text නැත → Read + Write. රටා 3 (විශාල codebase): ක්‍රමයෙන් explore (Grep entry points → Read imports), සියල්ල එකවර කියවන්න එපා. Long session එකේ "typical patterns" ගැන කතා කරනවා නම් scratchpad files/subagents (Domain 5, Task 5.4).',
        'රටා 4 (MCP tool නොසලකයි): Agent Grep භාවිතා කරන්නේ MCP tool එකේ description එක දුර්වල නිසා. පිළිතුර: MCP tool description එක වැඩිදියුණු කිරීම (Rule 2). රටා 5: Team එකටම server එක → .mcp.json; ඔයාට පමණක් → ~/.claude.json; token → ${ENV}.',
      ],
      analogy:
        'අලුත් ගෙයකට ගිහින් ඉඳුල හොයනවා: Glob = "මුළුතැන්ගෙය" කියන කාමරය නමින් හොයනවා. Grep = කාමර ඇතුළේ "කතුර" කියලා ලිව්ව දේ හොයනවා. හැම කාමරයටම එකවර බලන්න යන්නේ නෑ.',
      example:
        'Question: "Repo එකේ *.test.tsx files ඔක්කොම සොයන්න. Tool?" පිළිතුර Glob "**/*.test.tsx". Grep (content search) සහ Bash find වැරදි නැහැ, ඒත් built-in අරමුණට ගැළපෙන්නේ Glob. "Auth module එක කොහෙන් පටන් ගන්නවාද?" Grep entry point → Read imports.',
      keyPoints: [
        'Glob = නම/path; Grep = අන්තර්ගතය.',
        'Edit අසාර්ථක → Read + Write.',
        'Incremental exploration; සියල්ල එකවර කියවන්න එපා.',
        'MCP tool පාවිච්චි නොවෙයි → description හදන්න.',
        'Team = .mcp.json; personal = ~/.claude.json; secrets = ${ENV}.',
      ],
      terms: [
        { en: 'Grep/Glob swap trap', si: 'Exam එක ඉලක්කය තුළ ම මාරු කරයි. නම ද අන්තර්ගතය ද කියා පළමුව ප්‍රශ්නය බලන්න.' },
        { en: 'Read-everything trap', si: '"සියලු files කියවන්න" යනු context පුරවන වැරදි පිළිතුරක්.' },
      ],
    },
    {
      id: 'six-answer-rules-fake-features',
      plain: "Anchor answers to the named product and current official documentation. Similar concepts across Messages API, Agent SDK, Managed Agents, Claude Code, and MCP may use different fields.",
      internGuide: ["Anchor answers to the named product and current official documentation. Similar concepts across Messages API, Agent SDK, Managed Agents, Claude Code, and MCP may use different fields.","Prefer the option that preserves error semantics, least privilege, explicit state, human approval, and verifiable evidence over one relying on prompt obedience.","Reject invented universal fields or hooks. `isRetryable`, configuration scopes, session behavior, and tool names may be application- or version-specific even when plausible.","For exam scenarios, identify actor, authority, state, side effect, failure type, and recovery. If two answers sound reasonable, select the one enforcing the requirement in trusted code."],
      title: 'Six Answer-Selection Rules and Warnings About Unsupported Features',
      si: 'Exam ප්‍රශ්නයක මුලින්ම ඇහුවේ මොකක්ද කියලා හොඳට බලන්න. මුදල් හෝ identity නීතියක් නම් code එකෙන් enforce කරන්න; tool තේරීම වැරදි නම් description එක හදන්න. Subagent එකට context නැත්නම් prompt එකට දාන්න, timeout එකක් නම් error විස්තර කරන්න. Docs වල නැති feature එකක් හිතලා උත්තරයට දාන්න එපා.',
      body: [
        'CCAR-F ප්‍රශ්න scenario එකක් තුළ "වඩාත්ම effective", "පළමු පියවර", "root cause" අහනවා. නීති 6ක් නැවත නැවත එනවා:',
        '1. Root cause එකට විසඳුම. ගැටලුව වෙනත් agent/tool එකක නම්, ඉතිරි කොටස් වෙනස් කිරීම වැරදියි. 2. සරලම, proportionate පළමු පියවර. "Classifier train කරන්න", "routing layer හදන්න" සාමාන්‍යයෙන් වැරදියි. 3. අනිවාර්ය නීති = code (hooks, gates). 4. Explicit criteria + few-shot ("be careful" / "high confidence පමණක්" නොවේ). 5. තොරතුරු අහිමි නොකරන්න: errors, partial results, sources, dates, conflicting values structured ලෙස ඉදිරියට. 6. Least privilege.',
        'ඉවත දමන්න ඕනේ පිළිතුරු: ලොකු model/context window එකක්; "be careful"; calibrate නොකළ self-reported confidence හෝ sentiment; errors සඟවන හෝ එක error එකකට workflow නවත්වන; developers ට බර පටවන දේ.',
        'ඇත්තටම නැති features (distractors): CLAUDE_HEADLESS environment variable, --batch flag, .claude/config.json commands array. ඒ වගේ දෙයක් දැක්කොත් එක්ක ඒක වැරදියි කියලා සැලකීම හොඳයි, ඒත් අවිනිශ්චිත නම් Claude Code සහ API එක ඇත්තටම පාවිච්චි කරලා පුහුණු වෙන්න.',
        'මෙම domains වල සිදුවන්නේ: Task 1.1 (stop_reason), 1.4/1.5 (hook = Rule 3), 2.1 (descriptions = Rule 2), 2.2 (structured errors = Rule 5), 2.3 (least privilege = Rule 6), 1.2 (coordinator = Rule 1).',
      ],
      analogy:
        'A/L paper එකේ MCQ වගේ: "සියල්ල ඉහත" කියන පිළිතුරු සැක සහිතයි. නිවැරදි පිළිතුර සාමාන්‍යයෙන් කෙලින්ම ගැටලුවට කතා කරන සරලම එක.',
      example:
        'Question: "CI job එක input එකකට බලාගෙන hang වෙනවා." Options: CLAUDE_HEADLESS=true, --batch flag, claude -p, stdin /dev/null redirect. නැති features දෙකක් (CLAUDE_HEADLESS, --batch) ඉවත් කරනවා. නිවැරදි: claude -p (non-interactive). (Domain 3 විස්තර වෙනම phase එකක.)',
      keyPoints: [
        '6 rules: root cause, simple first step, code for mandatory rules, explicit criteria, no info loss, least privilege.',
        'Over-engineered (classifier, routing layer), විශාල model, "be careful" = ඉවත් කරන්න.',
        'CLAUDE_HEADLESS, --batch, .claude/config.json commands array = නැති features.',
        'මිනිත්තු 2/ප්‍රශ්නය: scenario goal එකට යටි ඉරක් ඇඳ keywords (first step, root cause) සලකුණු කරන්න.',
      ],
      terms: [
        { en: 'Rule 1: Root cause', si: 'ලොග් වල තියෙන්නේ coordinator එකේ වරද නම් subagents වෙනස් නොකරන්න.' },
        { en: 'Rule 2: Proportionate first step', si: 'කුඩාම වෙනස. Descriptions → rename → split.' },
        { en: 'Rule 3: Code for mandatory rules', si: 'Hook/gate. මුදල්, identity, compliance.' },
        { en: 'Rule 4: Explicit criteria + few-shot', si: 'අපැහැදිලි උපදෙස් නොවේ.' },
        { en: 'Rule 5: Preserve information', si: 'Structured errors, sources, partial results.' },
        { en: 'Rule 6: Least privilege', si: 'Agent එකට තමන්ට අවශ්‍ය tools පමණයි.' },
      ],
    },
    {
      id: 'aws-architect-mapping',
      plain: "Map concepts by responsibility: API Gateway/ALB for ingress, Cognito/IAM for identity, Lambda/ECS/EKS for orchestration, Step Functions for explicit workflows, and SQS/EventBridge for asynchronous work.",
      internGuide: ["Map concepts by responsibility: API Gateway/ALB for ingress, Cognito/IAM for identity, Lambda/ECS/EKS for orchestration, Step Functions for explicit workflows, and SQS/EventBridge for asynchronous work.","Use Bedrock or an external Claude API for models as required; MCP servers and tools can run behind private services. Secrets Manager and KMS protect credentials/data, but applications still enforce tenant permissions.","Store durable state in DynamoDB/Aurora/S3 as appropriate, make side effects idempotent, and trace model/tool/workflow calls with CloudWatch/OpenTelemetry while redacting sensitive content.","Choose managed services from workload and governance needs, not name matching. Design private networking, egress controls, retries/DLQs, approval, budgets, multi-AZ recovery, and teardown from the start."],
      title: 'An AWS Architect’s View: Mapping These Ideas to an AWS Design',
      si: 'Agent loop එක ඔයාගේ application code එකේ ධාවනය වෙනවා; Lambda, ECS/Fargate හෝ EKS එකක host කරන්න පුළුවන්. Hook එක tool එකට කලින් හෝ පස්සේ පරීක්ෂා කරන code එකක්. MCP server එක tools ලබාදෙන service boundary එකක්. Secrets ගොනුවට දාන්නේ නැතුව environment හෝ secret store එකෙන් ලබාගන්න.',
      body: [
        'ඔයා AWS tech lead කෙනෙක් නිසා මේ ideas ඔයාගේ architecture එකට map කරලා බලමු. පහත සඳහන් ඒවා ඔයාට පරිකල්පනයට මඟ පෙන්වන mapping එකක්; exam එකේ AWS specifics නෑ (CCAR-F ට අදාළ නැහැ), ඒත් ඔයාගේ design වලට උදව්වෙනවා. නිශ්චිත service features සඳහා වත්මන් AWS docs verify කරන්න.',
        'Agent loop එක (stop_reason loop) ඔයාගේ code එකක්. ඒක Lambda, ECS/Fargate හෝ EKS service එකක run කරන්න පුළුවන්. Model call එක Claude API එකෙන් හෝ Bedrock හරහා Claude මොඩල් වලින් (Bedrock Converse API එකේත් tool use තියෙනවා, ඒත් නිශ්චිත field නම් verify in current docs). Loop එක ඔයාගේ service එකේ බව වැදගත්: stop_reason බලන්නේ ඔයාගේ code.',
        'Hooks (PreToolUse/PostToolUse) = ඔයාගේ service එකේ in-process policy layer: refund limit, identity gate. ඒක API Gateway authorizer එකකට සමානයි, නමුත් agent tool call එකට ළඟින්. හැම ගැටලුවකටම IAM/policy වෙනුවට business-rule hooks. Least privilege (Rule 6) = IAM least privilege වගේම: agent එකකට tools 4–5, හැම tool එකක්ම scoped credentials වලින්.',
        'MCP servers = ඔයාගේ tools හෙළිදරව් කරන service boundary. Secrets .mcp.json හි නොලියා ${ENV} (production වල Secrets Manager/Parameter Store වලින් inject කරනවා වගේ). Structured errors (isError + isRetryable) = ඔයා දන්න API error design (retry-able 5xx vs 4xx). Sessions = state store එකක් (DynamoDB වගේ) හි conversation/summary save කිරීමේ අදහස (Phase 19 deployment-state-durability බලන්න).',
        'Observability: coordinator හරහා සියලු traffic යාම = CloudWatch/X-Ray වගේ tracing එක තැනකින් කරන්න පහසුයි. Phase 19 හි agent observability බලන්න. හොස්ට් කරන්නේ කොහෙද (Bedrock, API, self-host) කියන තීරණය CCAR-F scope එකෙන් පිටත, ඒත් architect කෙනෙක් ලෙස ඔයාට වැදගත්.',
      ],
      analogy:
        'ඔයා දැනට microservices වලට API Gateway + IAM + retries දානවා. Agent එකත් ඒ වගේම service එකක්: loop එක = orchestrator, hooks = policy/authorizer, MCP = service interfaces, structured errors = error contract.',
      example:
        'Support agent: ECS service එකේ coordinator loop. process_refund MCP server එක internal service එකක්; PreToolUse hook එක ($500 limit) ඔයාගේ service එක තුළ. Tool credentials least privilege. Timeouts structured transient errors ලෙස. Session summary DynamoDB එකේ (design අදහසක්, exam අංශයක් නෙවෙයි).',
      keyPoints: [
        'Loop + hooks ඔයාගේ service code එකේ; Claude ගේ model call එක පමණක් API/Bedrock හරහා.',
        'Hooks = policy layer; IAM-style least privilege = tools 4–5.',
        'Structured errors = ඔයා දන්න retryable/non-retryable API contract.',
        'AWS service specifics exam scope නෙවෙයි; docs verify කරන්න.',
      ],
      terms: [
        { en: 'Where does the loop run?', si: 'ඔයාගේ compute (Lambda/ECS/EKS) එකේ. Claude tool run කරන්නේ නෑ, request කරනවා විතරයි.' },
        { en: 'Where do hooks sit?', si: 'ඔයාගේ agent process එක තුළ, tool call එකට කලින්/පසුව.' },
        { en: 'Where do MCP servers sit?', si: 'ඔයාගේ tools හෙළිදරව් කරන service boundary එක; secrets env/secret store හරහා.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'What is the correct way to stop an agent loop?',
      options: [
        'Stop when Claude’s text contains the word "done".',
        'Stop when stop_reason is "end_turn"; for "tool_use", run the tool, send its result, and continue.',
        'Stop after exactly five iterations.',
      ],
      answer: 1,
      why: 'stop_reason is the structured completion signal. Text parsing and an iteration cap (which is only a backup) are not the normal stop condition.',
    },
    {
      q: 'A research report covers only one of four topics (visual arts), although the subagents worked correctly. What is the root cause?',
      options: [
        'The subagents have weak prompts.',
        'The coordinator decomposed the task too narrowly.',
        'The synthesis agent does not have web search.',
      ],
      answer: 1,
      why: 'Rule 1: address the root cause. The subagents handled their assigned scope; the coordinator defined that scope too narrowly.',
    },
    {
      q: 'How should you run three subagents in parallel?',
      options: [
        'Emit three Task/Agent tool calls in the same coordinator response.',
        'Spawn them one at a time across three turns.',
        'Let them communicate directly because they automatically receive the coordinator’s conversation.',
      ],
      answer: 0,
      why: 'Multiple tool calls in one response can run in parallel. Subagents do not inherit the parent conversation, so include needed context in each prompt.',
    },
    {
      q: 'An agent skips get_customer and issues an incorrect refund in 12% of cases. What is the best first step?',
      options: [
        'Strengthen the system prompt.',
        'Add few-shot examples.',
        'Add a programmatic prerequisite that blocks lookup_order and process_refund until a customer ID is verified.',
      ],
      answer: 2,
      why: 'Rule 3: enforce financial and identity requirements in code. Prompts and examples remain probabilistic and can fail.',
    },
    {
      q: 'Which mechanism should send refunds over $500 for human review?',
      options: [
        'Block the refund with a PostToolUse hook.',
        'Use a PreToolUse hook to deny amounts over 500 and give Claude a reason to call escalate_to_human.',
        'Write "Do not refund over 500" in the system prompt.',
      ],
      answer: 1,
      why: 'PreToolUse can block a call before it runs. PostToolUse runs afterward, and a prompt-based rule can still be missed.',
    },
    {
      q: 'How should the agent distinguish a tool timeout from "no order found"?',
      options: [
        'Return an empty list ([]) for both.',
        'For a timeout, return isError: true with a transient, retryable error; for no order, return a normal result such as {"found": false}.',
        'Return "Operation failed" for both.',
      ],
      answer: 1,
      why: 'An access failure is not an empty result. Reporting a timeout as an empty success can lead the agent to a false conclusion (Rule 5).',
    },
    {
      q: 'Tool selection is incorrect and descriptions are minimal ("Retrieves order details"). What is the best first step?',
      options: [
        'Train an intent-routing classifier.',
        'Improve descriptions with inputs, examples, and boundaries.',
        'Combine the tools into one tool.',
      ],
      answer: 1,
      why: 'The root cause is insufficient descriptions. Improve the description first, then consider renaming or splitting; a classifier or merge is a larger change.',
    },
    {
      q: 'The synthesis agent makes many coordinator round trips for simple fact checks (about 85% of cases). What is the best solution?',
      options: [
        'Give the synthesis agent every web-search tool.',
        'Give it a scoped verify_fact tool and route the more complex 15% through the coordinator.',
        'Batch the requests.',
      ],
      answer: 1,
      why: 'A scoped cross-role tool follows least privilege (Rule 6). All tools allow out-of-role use, while batching does not remove dependencies.',
    },
    {
      q: 'The document type is unknown and several schemas are available. Claude must call an extraction tool rather than return text. Which tool_choice should you use?',
      options: [
        '{"type": "auto"}',
        '{"type": "any"}',
        '{"type": "tool", "name": "extract_metadata"}',
      ],
      answer: 1,
      why: 'any requires a tool call but lets Claude choose which tool. auto can return text. Forcing one named tool could impose the wrong schema when the type is unknown.',
    },
    {
      q: 'The whole team needs a GitHub MCP server, but its token must not be committed. What is the correct setup?',
      options: [
        'Put the server and token directly in ~/.claude.json.',
        'Put the server in the repository’s .mcp.json and use environment expansion such as "GITHUB_TOKEN": "${GITHUB_TOKEN}".',
        'Write the token directly in .mcp.json and commit it.',
      ],
      answer: 1,
      why: 'The team can share project-scoped .mcp.json through Git; ${ENV} expansion keeps the secret out of the file. ~/.claude.json is user-scoped.',
    },
  ],
}
