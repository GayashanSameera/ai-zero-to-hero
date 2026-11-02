export default {
  id: 'claude-agents-tools',
  number: 23,
  title: 'Claude Architect: Agents, Tools & MCP (Domains 1–2)',
  titleSi: 'Claude Architect: Agents, Tools සහ MCP (Domain 1 සහ 2)',
  summary:
    'CCAR-F exam එකේ බරම domain දෙක: Agentic Architecture (27%) සහ Tool Design & MCP (18%). stop_reason loop එක, coordinator–subagent, hooks, sessions, tool descriptions, structured errors, tool_choice, MCP scopes සහ built-in tools. හැම concept එකකටම exam එක අහන වැරදි පිළිතුරත් ඒක වැරදි ඇයිද කියලත් මෙතන තියෙනවා.',
  duration: 'සති 2-3',
  topics: [
    {
      id: 'agentic-loop-stop-reason',
      examRefs: ['CCAR-001'],
      title: 'Agentic Loop: stop_reason (Task 1.1)',
      body: [
        'Agent එකක හදවත තියෙන්නේ පොඩි loop එකක. ඔයා Claude ට messages සහ tools යවනවා. Claude උත්තර දෙනවා. ඒ response එකේ stop_reason කියලා field එකක් තියෙනවා. ඒක තමයි loop එක පාලනය කරන්නේ.',
        'stop_reason == "tool_use" නම්, Claude කියන්නේ "මට tool එකක් run කරන්න ඕනේ" කියලා. එතකොට ඔයාගේ code එක ඒ tool එක run කරනවා (Claude run කරන්නේ නෑ, ඔයාගේ code එකයි run කරන්නේ). ඊට පස්සේ ප්‍රතිඵලය tool_result එකක් විදිහට, ඒ tool_use එකේ id එකම (tool_use_id) දාලා, user message එකක් ලෙස history එකට එකතු කරලා ආයෙත් request එකක් යවනවා. stop_reason == "end_turn" නම් Claude වැඩේ ඉවරයි, loop එක නවත්තනවා.',
        'ඊළඟට මොන tool එකද කියලා තීරණය කරන්නේ Claude (model-driven). ඔයා කලින්ම tool sequence එකක් hard-code කරන්නේ නෑ. Iteration cap එකක් (උදා: 20 වතාවක් උපරිම) තියාගන්න එක හොඳයි, ඒත් ඒක safety backup එකක් විතරයි, ප්‍රධාන නවත්වන ක්‍රමය නෙවෙයි.',
        'Agent loop එකේ සාමාන්‍ය අදහස Phase 12 සහ Phase 19 වල තියෙනවා (Phase 12 බලන්න). මෙතන අවධානය Claude API එකේ නිශ්චිත mechanics වලට, මොකද exam එක අහන්නේ ඒවා.',
      ],
      analogy:
        'Kottu කඩේ කෙනෙක් order එක ගන්නවා වගේ. වෙන්නේ "ඔයා tool එකක් ඉල්ලුවා, මම ගෙනත් දෙනවා" කියලා. වේටර් (ඔයාගේ code) කුස්සියෙන් දේවල් අරන් එනවා, chef (Claude) ඊළඟට මොනවද ඕනේ කියලා තීරණය කරනවා. "ඉවරයි, බිල දෙන්න" කියලා chef කිව්වම (end_turn) විතරයි වේටර් නවතින්නේ. "Chef ඔළුව වනපු නිසා ඉවරයි" කියලා අනුමාන කරන්නේ නෑ.',
      example:
        'User: "මගේ order #A12345 කොහෙද?" Turn 1: Claude stop_reason = tool_use, lookup_order(order_id="A12345") ඉල්ලනවා. ඔයාගේ code run කරලා {status: "shipped"} ගන්නවා, tool_result (tool_use_id එක සමඟ) එකතු කරලා යවනවා. Turn 2: Claude stop_reason = end_turn, "ඔයාගේ order එක shipped" කියලා text දෙනවා. Loop එක ඉවරයි. Request 2යි, tool run 1යි.',
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
        'Loop එක පාලනය කරන්නේ stop_reason: tool_use = tool run කරලා දිගටම, end_turn = නවත්තන්න.',
        'tool_result එක user message එකක් ලෙස, tool_use_id සමඟ history එකට එකතු කරනවා.',
        'ඊළඟ tool එක තීරණය කරන්නේ Claude (model-driven), කලින් සැකසූ sequence එකක් නෙවෙයි.',
        'Iteration cap = safety backup විතරයි.',
      ],
      terms: [
        { en: 'Wrong answer: text එකේ "done" සොයා නවත්වීම', si: 'Natural language parse කිරීම අනුමානයක්. Claude "done" කියන්නේ නැතුව වෙනත් වචනයකින් කියන්න පුළුවන්. stop_reason structured field එකයි.' },
        { en: 'Wrong answer: assistant text එකක් ආවාද කියා බලා ඉවරයි කියීම', si: 'Claude tool call එකක් එක්කම පැහැදිලි text එකකුත් දෙන්න පුළුවන්. Text එකක් තිබීම ≠ වැඩේ ඉවර.' },
        { en: 'Wrong answer: iteration cap එක ප්‍රධාන නවත්වන ක්‍රමය', si: 'Cap එක backup එකක් ලෙස හොඳයි. ඒත් ඉවර වුණාද කියලා තීරණය කරන්නේ end_turn.' },
        { en: 'Wrong answer: fixed tool sequence', si: 'ඒකෙන් agent එකේ වටිනාකම (model-driven තේරීම) නැති වෙනවා. Fixed pipeline ඕනේ නම් ඒක prompt chaining (Task 1.6).' },
        { en: 'tool_use_id', si: 'Claude ඉල්ලපු tool call එකයි ඔයා දෙන result එකයි ගැලපෙන්න යොදන id එක.' },
      ],
    },
    {
      id: 'coordinator-subagent-hub-spoke',
      title: 'Coordinator–Subagent: Hub-and-Spoke (Task 1.2)',
      body: [
        'වැඩේ ලොකු නම් එක agent එකක් වෙනුවට coordinator එකක් සහ subagents ගණනක් භාවිතා කරනවා. Coordinator එක වැඩේ කොටස් වලට කඩනවා, ඒ query එකට අවශ්‍ය subagents ම තෝරනවා, ප්‍රතිඵල එකතු කරනවා (aggregate), errors හසුරුවනවා.',
        'හැම සන්නිවේදනයක්ම coordinator හරහා යනවා. ඒකට කියන්නේ hub-and-spoke කියලා. වාසිය: එක තැනකින් observability (මොකද වුණේ කියලා බලන්න), එකම විදිහේ error handling. Subagents එකිනෙකා එක්ක කෙලින්ම කතා කරන්නේ නෑ.',
        'Subagent එකක් වෙනම context එකක (isolated) වැඩ කරනවා. Coordinator ගේ conversation එක ඒවාට ස්වයංක්‍රීයව නොලැබෙනවා (ඊළඟ topic එක බලන්න).',
        'Coordinator එක සෑම විටම මුළු pipeline එකම run කරන්න ඕනේ නෑ. Query එක සරල නම් අවශ්‍ය subagent එක විතරක් call කරන්න. Subagents අතර scope එක බෙදන්න (වෙනම subtopics හෝ source types), එතකොට duplicate වැඩ අඩු වෙනවා. Synthesis එකේ gaps තිබුණොත් ඉලක්කගත queries දීලා ආයෙත් delegate කරන්න.',
      ],
      analogy:
        'Wedding එකක catering manager (coordinator) වගේ. එයා රයිස් කුක්, කරි කුක්, අච්චාරු කෙනා, අතුරුපස කෙනා කියලා වැඩ බෙදනවා. කුක්ලා එකිනෙකාට කෙලින්ම බනින්නේ නෑ, හැම දෙයක්ම manager හරහා. Manager "කරි ටික මදි" කියලා දැක්කම ඒ කෙනාට විතරක් ආයෙත් කියනවා.',
      example:
        'Query: "AI බලපෑම creative industries වලට". Coordinator subtopics 1ක් විතරක් (visual arts) subagents ට දුන්නා කියලා හිතන්න. Report එක visual arts ගැන විතරයි. Subagents හරියටම වැඩ කළා, ගැටලුව coordinator ගේ decomposition එකේ. හරි විසඳුම: coordinator ගේ decomposition එක පුළුල් කරන්න (visual arts, music, writing, film).',
      keyPoints: [
        'Coordinator = කඩනවා, subagents තෝරනවා, aggregate කරනවා, errors handle කරනවා.',
        'සියලු traffic coordinator හරහා (observability + consistent errors).',
        'Query එකට අවශ්‍ය subagents පමණක් run කරන්න.',
        'Report එකේ topics මඟ හැරුණොත් root cause එක බොහෝ විට coordinator ගේ decomposition එක.',
      ],
      terms: [
        { en: 'Wrong answer: subagents ට වරද පැටවීම', si: 'Subagent එක එයාට දුන්න scope එකට හොඳට වැඩ කළා නම් root cause එක coordinator එක. (Rule 1: root cause එකට විසඳුම)' },
        { en: 'Wrong answer: හැම query එකටම full pipeline', si: 'ඒක අපතේ යෑමක්. අවශ්‍ය subagents පමණක් තෝරන එක coordinator ගේ වැඩේ.' },
        { en: 'Iterative refinement', si: 'Synthesis එකේ gaps බලලා ඉලක්කගත queries සමඟ ආයෙත් delegate කරන එක.' },
      ],
    },
    {
      id: 'subagent-spawning-context-passing',
      examRefs: ['CCAR-002', 'CCAR-003', 'CCAR-024'],
      title: 'Subagents හදන ආකාරය, AgentDefinition සහ Context Passing (Task 1.3)',
      body: [
        'Subagent එකක් හදන්නේ Task tool එකෙන්. අලුත් docs වල ඒකේ නම Agent tool (exam guide එකේ Task කියලා තියෙනවා; exam එකේදී "Task" කියලා සිතන්න). Coordinator ට subagents හදන්න පුළුවන් වෙන්න ඒ tool එක ඔයාගේ tools ලැයිස්තුවට (exam wording: allowedTools) තියෙන්න ඕනේ.',
        'AgentDefinition එකෙන් subagent වර්ගයක් විස්තර කරනවා: description (කවදා මේක භාවිතා කරන්නද කියලා coordinator ට කියන්න, required), prompt (subagent ගේ system prompt, required), සහ optional දේවල් (tools, model, maxTurns වගේ). Subagent එකට අවශ්‍ය tools මෙතන සීමා කරනවා. වැදගත්: SDK එකේ allowed_tools කරන්නේ tools auto-approve කිරීම. Tools සීමා කරන්න subagent එකේ tools field එක හෝ disallowed_tools භාවිතා කරන්න (verify in current docs).',
        'ලොකුම උගුල: Subagent එකට coordinator ගේ conversation එක නොලැබෙනවා. Subagent එකට ලැබෙන්නේ එයාගේ prompt, coordinator එක Agent tool එකට දෙන prompt string එක, project CLAUDE.md සහ tool definitions. ඒ නිසා ඊට අවශ්‍ය හැම දෙයක්ම (පෙර agents ගේ findings පවා) prompt එක තුළම දෙන්න.',
        'Findings යවද්දී content එක සහ metadata (URL, document නම, page) structured format එකකින් යවන්න, එතකොට attribution (මේක ආවේ කොහෙන්ද) නැති වෙන්නේ නෑ.',
        'Parallel subagents: එකම coordinator response එකක Agent/Task tool calls කිහිපයක් emit කරන්න. Turns කිහිපයකට දාන්න එපා, එතකොට sequential වෙලා හෙමින් වෙනවා. තවත් දෙයක්: coordinator prompt එකේ පියවරෙන් පියවර නියෝග වෙනුවට goals සහ quality criteria දෙන්න.',
      ],
      analogy:
        'ඔයා කඩේ අලුත් කොල්ලෙක්ට "ඔය ඇණවුම් ඒක යවන්න" කියලා කිව්වොත් එයා දන්නේ නෑ මොන ඇණවුම්ද කියලා, මොකද ඔයාගේ කලින් කතාබහට එයා හිටියේ නෑ. හරි ක්‍රමය: කුරුටු කෑල්ලක ඇණවුම් අංකය, ලිපිනය, සහ ඔයාට ඕනේ දේ ලියලා දෙන එක.',
      example:
        'Coordinator "web-searcher" subagent තුනක් එකම response එකේ spawn කරනවා: visual arts, music, film. එකිනෙකාට දෙන prompt එකේ: "Subtopic: music. දැනට අපි දන්නා sources: [url1, url2]. Return JSON: claim, excerpt, url, published_date." Subagent තුනම එකවර දුවනවා.',
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
        'Subagents හදන්නේ Task tool (අලුත් නම Agent). Coordinator ට ඒක තිබිය යුතුයි.',
        'AgentDefinition: description + prompt (required), tools/model/maxTurns (optional).',
        'Subagent parent conversation එක inherit කරන්නේ නෑ. ඕනෑම දෙයක් prompt එකේ දෙන්න.',
        'Parallel = එකම response එකක tool calls කිහිපයක්. Metadata සමඟ structured findings යවන්න.',
      ],
      terms: [
        { en: 'Wrong answer: subagents coordinator ගේ context බලනවා කියලා හිතීම', si: 'නැහැ. Isolated context. ඒ නිසා "Subagent එකට info නැත" ගැටලුවට විසඳුම prompt එකට දීම.' },
        { en: 'Wrong answer: parallel වැඩ turns කිහිපයකට දැමීම', si: 'එකම response එකේ Task calls කිහිපයක් තමයි parallel.' },
        { en: 'Wrong answer: coordinator ට step-by-step ලොකු script එකක් දීම', si: 'Goals සහ quality criteria දෙන්න. Rigid steps adaptive වැඩේ බිඳිනවා.' },
        { en: 'allowed_tools vs tools', si: 'allowed_tools = auto-approve. සීමා කිරීමට subagent tools field හෝ disallowed_tools. Exam guide එකේ පිළිතුර (Task allowedTools තුළ) අනුගමනය කරන්න.' },
      ],
    },
    {
      id: 'workflow-enforcement-handoff',
      title: 'Workflow Enforcement සහ Human Handoff (Task 1.4)',
      body: [
        'Prompt එකක උපදෙසක් Claude හැමවිටම පිළිපදින්නේ නෑ. ඒකට සැමවිටම ශුන්‍ය නොවන failure rate එකක් තියෙනවා (උදා: 12% වරක්). ඒ නිසා මුදල්, identity, compliance වගේ අනිවාර්ය නීති prompt එකෙන් නෙවෙයි, code එකෙන් (hooks, prerequisite gates) බලාත්මක කරන්න.',
        'Support agent උදාහරණය: get_customer එකෙන් verified customer ID එකක් ලැබෙනකම් lookup_order සහ process_refund tool calls code එකෙන් block කරනවා. එතකොට Claude ට මේ පියවර මඟ හරින්න බෑ.',
        'Request එකේ ගැටලු කිහිපයක් තියෙනවා නම් (refund + address change) ඒවා වෙන් කරලා parallel විමර්ශනය කරලා එක පිළිතුරක් විදිහට එකතු කරන්න.',
        'Human එකකට escalate කරද්දී structured handoff summary එකක් දෙන්න: customer ID, root cause, refund amount, recommended action. Human agent ට transcript එක පේන්නේ නෑ, ඒ නිසා summary එක තමයි එයාට තියෙන සියල්ල.',
      ],
      analogy:
        'බැංකුවේ ලොකු ගනුදෙනුවකට manager ගේ අත්සන ඕනේ. "කරුණාකර අත්සන් ගන්න" කියලා notice එකක් ගහනවා නෙවෙයි, ඒක system එකේම අනිවාර්ය step එකක්. Prompt = notice, hook/gate = system එකේ lock එක.',
      example:
        'Production logs: agent 12%ක් වාරවල get_customer මඟ හැරලා order එක ඇහැට පේන නමින් lookup කරලා වැරදි refund කරනවා. හරි විසඳුම: process_refund සහ lookup_order, session එකේ verified customer ID එකක් තියෙනකම් deny කරන programmatic gate එකක්. වැරදි විසඳුම්: system prompt එක තවත් ශක්තිමත් කිරීම, few-shot examples, routing classifier.',
      keyPoints: [
        'අනිවාර්ය නීතිය = code (hook / prerequisite gate). Prompt = probabilistic.',
        'Gate: get_customer verified ID එකක් නැත්නම් lookup_order, process_refund block.',
        'Multi-issue request: කඩලා parallel විමර්ශනය, එකතු කර පිළිතුරක්.',
        'Handoff = structured summary (ID, root cause, amount, recommended action).',
      ],
      terms: [
        { en: 'Wrong answer: stronger system prompt / few-shot', si: 'මුදල් අවදානම ඇති තැන probabilistic විසඳුම් ප්‍රමාණවත් නෑ. (Rule 3)' },
        { en: 'Wrong answer: routing classifier හදන්න', si: 'ගැටලුව tool order එක, intent routing නෙවෙයි. Classifier එක over-engineering. (Rule 2)' },
        { en: 'Wrong answer: handoff එකේ transcript එකම යවන්න', si: 'Human ට transcript බලන්න බෑ/වෙලාවක් නෑ. Structured summary අවශ්‍යයි.' },
      ],
    },
    {
      id: 'hooks-pretooluse-posttooluse',
      examRefs: ['CCAR-004'],
      title: 'Agent SDK Hooks: PreToolUse සහ PostToolUse (Task 1.5)',
      body: [
        'Hook කියන්නේ agent loop එකේ නිශ්චිත ස්ථානයක ඔයාගේ code එක run වෙන callback එකක්. Hook එක ඔයාගේ code, ඒ නිසා deterministic. මේක තමයි "අනිවාර්ය නීතිය code එකේ" කියන ක්‍රමය.',
        'PreToolUse (tool call interception): tool එක run වෙන්න කලින් call එක පරීක්ෂා කරනවා. allow, deny, ask, defer decisions දෙන්න පුළුවන්. Hooks කිහිපයක් එකිනෙකට විරුද්ධ නම් deny ජයග්‍රහණය කරනවා. උදා: $500 ට වැඩි refund එක deny කරලා escalate_to_human කියලා Claude ට reason එකක් දෙනවා.',
        'PostToolUse: tool result එක Claude ට යන්න කලින් වෙනස් කරනවා. උදා: Unix timestamp, ISO 8601, numeric status codes එක format එකකට normalize කිරීම. updatedToolOutput දුන්නොත් Claude දකින්නේ cleaned output එක. additionalContext වලින් තොරතුරු එකතු කරන්නත් පුළුවන්.',
        'MCP tool නම format එක mcp__<server>__<tool>. Hook එකේ matcher එකට ඒ නම භාවිතා කරන්න. නීතිය: guaranteed compliance ඕනේ නම් hook; නම්‍යශීලී මඟ පෙන්වීම් වලට prompt.',
      ],
      analogy:
        'PreToolUse = ගේට්ටුවේ security guard (ඇතුල් වෙන්න කලින් පරීක්ෂා කරනවා). PostToolUse = කඩෙන් ගත්ත බඩු ගෙදර දෙන්න කලින් ඒවා නියම බෑග් එකකට සකස් කරන කෙනා.',
      example:
        'Refund $740 ඉල්ලලා. PreToolUse hook එක amount > 500 දැක deny කරලා "Human ඕනේ, escalate_to_human call කරන්න" කියනවා. Claude ඊළඟ turn එකේ escalate කරනවා. තවත් තැනක, 3 වෙනි system එක timestamp එක "1735689600" ලෙස යවනවා. PostToolUse hook එක ඒක "2025-01-01T00:00:00Z" කරනවා, Claude ට එකම format එකක් පේනවා.',
      code: {
        lang: 'python',
        src: `async def block_large_refunds(input_data, tool_use_id, context):
    amount = input_data["tool_input"].get("amount", 0)
    if amount > 500:                      # $500 ට වැඩි නම් block
        return {"hookSpecificOutput": {
            "hookEventName": input_data["hook_event_name"],
            "permissionDecision": "deny",
            "permissionDecisionReason":
                "Refunds over $500 need a human. Call escalate_to_human."}}
    return {}                             # {} = allow

options = ClaudeAgentOptions(hooks={"PreToolUse": [
    HookMatcher(matcher="mcp__support__process_refund",
                hooks=[block_large_refunds])]})`,
      },
      keyPoints: [
        'PreToolUse = run වෙන්න කලින් check/block (allow, deny, ask, defer). Deny ජයග්‍රහණය කරයි.',
        'PostToolUse = result Claude ට යන්න කලින් වෙනස් කිරීම (normalize, updatedToolOutput).',
        'Hook = deterministic code; Prompt = probabilistic.',
        'MCP tool නම: mcp__<server>__<tool>.',
      ],
      terms: [
        { en: 'Wrong answer: refund limit එක prompt එකේ ලියන්න', si: 'Prompt failure rate ශුන්‍ය නෑ. මුදල් නීතියට hook. (Rule 3)' },
        { en: 'Wrong answer: PostToolUse වලින් refund block කිරීම', si: 'PostToolUse run වෙන්නේ tool එක run වුණාට පස්සේ. Block කරන්න PreToolUse.' },
        { en: 'Wrong answer: normalization කරන්න system prompt', si: 'Data format කෙලින්ම code එකෙන් PostToolUse hook එකේ නිවැරදිව කරන්න.' },
      ],
    },
    {
      id: 'task-decomposition-chaining-dynamic',
      examRefs: ['CCAR-021'],
      title: 'Task Decomposition: Prompt Chaining vs Dynamic (Task 1.6)',
      body: [
        'වැඩක් කොටස් වලට කඩන විදි දෙකක් තියෙනවා. Prompt chaining: පියවර කලින් දන්නවා, ස්ථාවර pipeline එකක්. Dynamic decomposition: වැඩේ open-ended, ඊළඟ පියවර කලින් දන්නේ නෑ, agent එක සොයාගෙන ගිහින් plan එක adapt කරනවා.',
        'Prompt chaining උදාහරණය: PR එකේ files 14ක් review. පියවර 1: file එකින් එක local review. පියවර 2: වෙනම cross-file integration pass. එක ලොකු prompt එකක files 14 ම දැම්මොත් අවධානය විසිරිලා findings අස්ථාවර වෙනවා.',
        'Dynamic උදාහරණය: "Legacy codebase එකට tests එකතු කරන්න". පළමුව structure එක map කරනවා, high-impact areas හොයනවා, ඊට පස්සේ සොයාගත් දේ අනුව adaptive plan එකක් හදනවා.',
        'තීරණය: පියවර පුරෝකථනය කළ හැකිද? ඔව් නම් chaining. නැත්නම් dynamic. Plan-and-execute ගැන Phase 12 බලන්න.',
      ],
      analogy:
        'Chaining = බස් එකේ route 138 වගේ, නැවතුම් ස්ථාවරයි. Dynamic = ඔයා නොදන්න ගමක තරග ගමනක්, හැම හන්දියකදීම ඊළඟට කොහෙටද කියලා බලනවා.',
      example:
        'PR එකේ files 14: chain එකක් (14 local passes + 1 integration pass). "මේ පරණ system එකට tests දාන්න": dynamic (map → high-impact → plan → ඒ plan එක update කරමින් execute).',
      keyPoints: [
        'Prompt chaining = ස්ථාවර, පුරෝකථනය කළ හැකි පියවර (per-file + cross-file pass).',
        'Dynamic decomposition = open-ended, discovery එක plan එක හදනවා.',
        'එක ලොකු prompt එකක් multi-file review එකට නරකයි.',
      ],
      terms: [
        { en: 'Wrong answer: එක prompt එකකින් files 14 ම', si: 'Attention dilution. Per-file passes + integration pass.' },
        { en: 'Wrong answer: විශාල context window එක මේක විසඳයි', si: 'Context ලොකු වුණාට attention ගැටලුව නැති වෙන්නේ නෑ.' },
        { en: 'Wrong answer: open-ended වැඩට fixed chain', si: 'ඉක්මනින් නොගැලපෙනවා. Dynamic භාවිතා කරන්න.' },
      ],
    },
    {
      id: 'sessions-resume-fork-fresh',
      examRefs: ['CCAR-005', 'CCAR-022', 'CCAR-023'],
      title: 'Sessions: Resume, Fork සහ Fresh Start (Task 1.7)',
      body: [
        'Session එකක් කියන්නේ conversation එකේ saved history එක. Resume: නම් කළ පෙර session එකක් දිගටම කරගෙන යනවා (--resume <session-name>). SDK එකේ resume=session_id.',
        'fork_session: එකම analysis එකකින් branches දෙකක් හදනවා, මුල් session එක වෙනස් නොවී. උදා: testing strategy දෙකක් සසඳන්න. Fork වෙන්නේ conversation එක පමණයි, files නෙවෙයි. Fork එකේදී files වෙනස් කළොත් ඒවා සැබෑ වෙනස්කම්.',
        'Code වෙනස් වුණාට පස්සේ resume කරනවා නම්, වෙනස් වුණු files ගැන agent ට කියන්න. පරණ tool results බොහොමයක් stale (එතකොට files වෙනස් වෙලා) නම් resume කරන්න එපා. ඒ වෙනුවට structured summary එකක් එක්ක අලුත් session එකක් පටන් ගන්න (fresh start with summary).',
      ],
      analogy:
        'Resume = කතන්දරේ කියවපු පිටුවෙන් පටන් ගන්න එක. Fork = පොතේ පිටපතක් අරන් වෙනස් අවසානයක් ලියන එක. Fresh start with summary = පරණ පොත් ඔක්කොම නැති වෙලා, අධිකරණ සටහන් එක් පිටුවක් අරන් අලුත් පොතක් පටන් ගන්න එක.',
      example:
        'Monday: "refund-investigation" session එකේ auth module විශ්ලේෂණය. Tuesday: කණ්ඩායම files 10ක් වෙනස් කළා. Resume කරද්දී "මේ files 10 වෙනස් වුණා, ආයෙත් කියවන්න" කියලා කියනවා. Files ගොඩක් වෙනස් වෙලා නම් summary එකක් එක්ක අලුත් session එකක්.',
      code: {
        lang: 'bash',
        src: `claude -n "refund-investigation"            # session එකට නමක් දෙනවා
claude --resume refund-investigation        # නම ඇතිව දිගටම කරනවා
claude --resume refund-investigation --fork-session  # branch එකක් හදනවා`,
      },
      keyPoints: [
        'Resume = දිගටම; වෙනස් වුණු files ගැන agent ට කියන්න.',
        'fork_session = එකම මූලයෙන් branches (conversation පමණක්, files නෙවෙයි).',
        'Tool results බොහොමයක් stale නම් = structured summary සමඟ fresh session.',
      ],
      terms: [
        { en: 'Wrong answer: stale tool results ඇති session එක resume කිරීම', si: 'Agent පරණ දත්ත විශ්වාස කරලා වැරදි පිළිතුරු දෙයි. Fresh + summary.' },
        { en: 'Wrong answer: fork එක files ද වෙනම copy කරනවා කියා හිතීම', si: 'Fork කරන්නේ conversation පමණයි.' },
      ],
    },
    {
      id: 'tool-descriptions-naming-splitting',
      examRefs: ['CCAR-006'],
      title: 'Tool Descriptions, Naming සහ Splitting (Task 2.1)',
      body: [
        'Claude tool එකක් තෝරන්නේ ඒකේ description එක කියවලා. Description එක "Retrieves customer information" වගේ අවම නම්, "check my order #12345" ට Claude වැරදි tool එක (get_customer) තෝරන්න පුළුවන්.',
        'හොඳ description එකේ තියෙන්න ඕනේ: tool එක කරන්නේ මොකක්ද සහ මොන output එකද ලැබෙන්නේ; input format එක (උදා: "order ID එක, # සමඟ අංක 5ක්"); උදාහරණ queries; boundaries (සමාන tool එකෙන් වෙනස මොකක්ද, කවදා භාවිතා නොකළ යුතුද).',
        'විසඳුම් අනුපිළිවෙල (පළමු පියවර සිට): (1) description එක වැඩිදියුණු කරන්න. (2) අතිපිහිත tools rename කරන්න (analyze_content → extract_web_results). (3) Generic tool එකක් අරමුණු ඇති tools කිහිපයකට කඩන්න (analyze_document → extract_data_points, summarize_content, verify_claim_against_source).',
        'අවවාදය: system prompt එකේ keyword-sensitive නීති ("customer ගැන ඕනෑම දෙයකට get_customer භාවිතා කරන්න") හොඳ descriptions බිඳ දැමිය හැක.',
      ],
      analogy:
        'Keells එකේ බඩු රාක්ක වල ලේබල් වගේ. "ආහාර" කියලා විතරක් ලියලා තිබුණොත් ඔයා වැරදි තැනට යනවා. "සහල් - කිලෝ 5 බෑග්, පිසින් කාලෙට" කියලා ලිව්වොත් පැහැදිලියි. එක ලේබලයකින් වැඩේ නොහැරෙනවා නම් තමයි රාක්කය වෙනස් කරන්නේ (rename/split).',
      example:
        'Before: lookup_order — "Retrieves order details". After: "Get one order status, items and dates by order ID (format: A12345). Use for questions about a specific order. Do NOT use for customer profile questions; use get_customer for those." මේ වෙනස පමණයි, ඊළඟ turn එකෙන්ම tool selection නිවැරදි වෙනවා.',
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
        'Description එක තමයි tool selection එකේ ප්‍රධානම signal එක.',
        'Fix order: description → rename → split.',
        'Boundaries වලින් සමාන tools දෙකක් වෙන් කරන්න (Do NOT use for ...).',
        'System prompt keyword rules වලින් පරෙස්සම් වෙන්න.',
      ],
      terms: [
        { en: 'Wrong answer: system prompt එකට keyword නීති', si: 'ඒවා හොඳ descriptions override කරන්න පුළුවන්. පළමුව description එක හදන්න. (Rule 2)' },
        { en: 'Wrong answer: routing layer / classifier train කිරීම', si: 'Over-engineering. පළමු පියවර = descriptions. (Rule 2)' },
        { en: 'Wrong answer: few-shot examples එකතු කිරීම', si: 'Tokens වැඩියි, root cause (අවම descriptions) විසඳෙන්නේ නෑ.' },
        { en: 'Wrong answer: tools එකක් කරලා merge කිරීම', si: '"පළමු පියවර" එකට වඩා විශාල වෙනසක්. කඩන්නේ අන්තිමට.' },
      ],
    },
    {
      id: 'structured-error-responses',
      examRefs: ['CCAR-028'],
      title: 'Structured Error Responses: isError සහ isRetryable (Task 2.2)',
      body: [
        'Tool එකක් අසාර්ථක වුණාම "Operation failed" කියලා generic error එකක් දුන්නොත් agent ට කරන්න දෙයක් නෑ. ඒ නිසා errors ව්‍යුහගතව (structured) දෙන්න. MCP හි isError: true flag එකෙන් tool අසාර්ථක බව කියනවා. ඒක සමඟ errorCategory, isRetryable සහ පැහැදිලි message එකක් දෙනවා.',
        'Error වර්ග 4: (1) Transient: timeout, service unavailable. Retry කරනවා ඔව්, backoff සමඟ. (2) Validation: වැරදි input format. Input හරිගස්සලා නැවත උත්සාහ කරනවා. (3) Business: policy උල්ලංඝනය (refund limit). Retry නැහැ. Customer ට පැහැදිලි කරනවා හෝ escalate. (4) Permission: අවසර නැත. Retry නැහැ. Escalate.',
        'තීරණය සරලයි: isRetryable true නම් retry (transient/validation fix), false නම් retry කරන්න එපා (business/permission), explain හෝ escalate.',
      ],
      analogy:
        'ATM එකේ "Error" කියලා විතරක් ලිව්වොත් ඔයා අන්දමන්දයි. "කාඩ් එක ඉවර වෙලා (permission)", "PIN වැරදියි (validation)", "දිනක සීමාව ඉක්මවා (business)", "ජාලය බිඳ වැටුණා, නැවත උත්සාහ කරන්න (transient)" කියලා කිව්වොත් ඔයා හරි දේ කරනවා.',
      example:
        'process_refund($800) → {errorCategory: "business", isRetryable: false, message: "Refunds over $500 need manager approval."}. Agent එක ආයෙත් ඉල්ලන්නේ නෑ, escalate_to_human call කරනවා. lookup_order timeout → {errorCategory: "transient", isRetryable: true} → agent කෙටි වෙලාවකට පසු retry කරනවා.',
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
        'Error වර්ග 4: transient, validation, business, permission.',
        'isError: true + errorCategory + isRetryable + message.',
        'Transient/validation = retry (fix); business/permission = retry නැහැ.',
        'Generic "Operation failed" agent ව අන්ධ කරනවා.',
      ],
      terms: [
        { en: 'Wrong answer: generic "Operation failed"', si: 'Agent ට නිවැරදි recovery තීරණයක් ගන්න බෑ. (Rule 5)' },
        { en: 'Wrong answer: business error එක retry කරන්න', si: 'Policy එක වෙනස් වෙන්නේ නෑ, retry වලින් වැඩක් නැහැ.' },
        { en: 'Wrong answer: permission error එකට backoff retry', si: 'අවසර retry වලින් එන්නේ නෑ. Escalate.' },
      ],
    },
    {
      id: 'access-failure-vs-empty-result',
      examRefs: ['CCAR-007'],
      title: 'Access Failure ≠ Empty Result සහ Local Recovery (Task 2.2)',
      body: [
        'Database timeout එකක් සහ "ඒ නමින් order එකක් නැහැ" කියන එක සම්පූර්ණයෙන්ම වෙනස්. පළමුවැන්න access failure (දැනගන්න බැරි වුණා), දෙවැන්න valid empty result (ඇත්තටම නැහැ).',
        'Timeout එකක් [] (හිස් list එකක්) ලෙස ආපසු දුන්නොත් agent එක "customer ගේ orders නැහැ" කියලා ඇත්තක් කියනවා. ඒක වැරදියි, ඒ වගේම භයානකයි. Timeout = isError: true + transient. Order නැති වීම = සාමාන්‍ය result එකක් ({"found": false}), isError නෑ.',
        'Multi-agent පද්ධතියක subagent එක transient errors එතනම විසඳන්න (local recovery, retry). විසඳිය නොහැකි ඒවා පමණක් coordinator ට යවන්න, සමඟ partial results සහ කළ උත්සාහයන් (failure type, query, partial results, alternatives).',
        'Coordinator ට මුළු workflow එකම එක error එකකට නවත්තන්න එපා. Final report එකේ coverage annotations දාන්න: හොඳින් support කළ findings සහ sources නැති වුණ නිසා gaps ඇති topics.',
      ],
      analogy:
        'කඩේ "අල තියෙනවාද?" කියලා ඇහුවම. "නෑ, ඉවරයි" (empty result) සහ කඩේ ගේට්ටුව වැහිලා ඇරලා නෑ (access failure). දෙක එකක් කරගත්තොත් ඔයා වෙන කඩයක් හොයනවා, ඇත්තටම කඩය ඇරෙනකම් ඉන්න ඕනේ වෙලාවක.',
      example:
        'Search subagent timeout වෙනවා. වැරදි: [] යවලා "ප්‍රතිඵල නැහැ" කියලා report එක ලියනවා. හරි: subagent එක ඉක්මනින් එකම වතාවක් retry කරනවා. තවමත් අසාර්ථක නම් coordinator ට: {failureType: transient, query: "AI music 2025", partialResults: [...], alternatives: ["වෙනත් search source"]}.',
      keyPoints: [
        'Timeout (access failure) = error. "Match නැහැ" = valid empty result. කවදාවත් මිශ්‍ර නොකරන්න.',
        'Transient errors subagent එකම විසඳන්න (local recovery).',
        'විසඳිය නොහැකි ඒවා structured context සමඟ coordinator ට: type, query, partial results, alternatives.',
        'එක error එකකට මුළු workflow නවත්තන්න එපා; coverage annotations දාන්න.',
      ],
      terms: [
        { en: 'Wrong answer: timeout එක empty success ලෙස යැවීම', si: 'Error එක සඟවනවා (suppression). Agent වැරදි නිගමනයකට යයි. (Rule 5)' },
        { en: 'Wrong answer: generic status ("search unavailable") යැවීම', si: 'Coordinator ට recover කරන්න context නැහැ.' },
        { en: 'Wrong answer: එක subagent අසාර්ථක වුණාම workflow එකම නවත්වීම', si: 'අනවශ්‍යයි. Partial results සමඟ ඉදිරියට යන්න.' },
      ],
    },
    {
      id: 'tool-distribution-least-privilege',
      examRefs: ['CCAR-008'],
      title: 'Tool Distribution සහ Least Privilege (Task 2.3)',
      body: [
        'Agent එකකට tools 18ක් දුන්නොත් Claude ගේ tool selection වැරදීම වැඩි වෙනවා. Agent එකකට tools 4–5ක් පමණ දෙන්න, ඒ role එකට අදාළ ඒවා විතරක්. Role එකෙන් පිටත tools තිබුණොත් agent එක ඒවා අවභාවිතා කරනවා (උදා: synthesis agent web search කරන්න පටන් ගන්නවා).',
        'Scoped cross-role tool: Synthesis agent එක සරල fact-checks (≈85%) වලට coordinator ට ගිහින් එන එක අනවශ්‍ය round trips වැඩි කරනවා. විසඳුම: ඒ agent ට සීමිත verify_fact tool එකක් දෙන්න. සංකීර්ණ (≈15%) ඒවා තවමත් coordinator හරහා. මුළු web search tools දෙන්නේ නෑ.',
        'Constrained tools: Generic fetch_url වෙනුවට URL validate කරන load_document වගේ constrained tool එකක් දෙන්න. Tool එක කරන්න පුළුවන් දේ ප්‍රමාණවත් තරම් පටුයි නම් අවභාවිතයට ඉඩ අඩුයි.',
        'මේක Rule 6 (least privilege). Phase 19 හි agent safety ගැනත් බලන්න.',
      ],
      analogy:
        'Tuk-tuk ඩ්‍රයිවර් කෙනාට ගමන් ගාස්තුව ගන්න සල්ලි පෙට්ටියේ යතුර දෙනවා, බැංකුවේ vault යතුරු නෙවෙයි. Synthesis agent ට "සරල fact check" එකට පුංචි යතුරක් (verify_fact), ඒත් මුළු ගමන් බලපත්‍රය (සියලු search tools) නෙවෙයි.',
      example:
        'Research system: web-searcher: WebSearch, WebFetch. document-analyzer: Read, extract_data_points. synthesizer: Read, verify_fact (scoped). හැම agent ටම tools 2–3යි. Synthesis round trips අඩු වුණා, සංකීර්ණ verification තවමත් coordinator හරහා.',
      keyPoints: [
        'Agent එකකට tools 4–5ක් පමණ; 18ක් selection වැරදි වැඩි කරයි.',
        'Role එකෙන් පිටත tools = අවභාවිතය.',
        'Scoped cross-role tool (verify_fact) සරල 85% සඳහා; සංකීර්ණ 15% coordinator හරහා.',
        'Constrained tool (load_document) > raw fetch_url.',
      ],
      terms: [
        { en: 'Wrong answer: සියලු agents ට සියලු tools දීම', si: 'Least privilege උල්ලංඝනය. Selection වැරදි වැඩි වෙනවා. (Rule 6)' },
        { en: 'Wrong answer: requests batch කිරීම', si: 'Dependencies block වෙනවා. Round trips ගැටලුව ඒකෙන් විසඳෙන්නේ නෑ.' },
        { en: 'Wrong answer: caching / speculative caching', si: 'ගැටලුව tool access design එක. Caching අනුමානයක්.' },
      ],
    },
    {
      id: 'tool-choice-auto-any-forced',
      title: 'tool_choice: auto, any, forced (Task 2.3)',
      body: [
        'tool_choice කියන්නේ API request එකේ parameter එකක්, Claude tool එකක් call කළ යුතුද කියලා පාලනය කරන්න. තෝරාගැනීම් 3 (සහ none):',
        '{"type": "auto"}: Claude තීරණය කරනවා, tool එකක් call කරනවාද text එකකින් පිළිතුරු දෙනවාද. සාමාන්‍ය chat + tools.',
        '{"type": "any"}: Claude යම් tool එකක් අනිවාර්යයෙන් call කළ යුතුයි (text පිළිතුරක් නැහැ). Structured output අනිවාර්ය වෙද්දී, හෝ document type එක නොදන්න වෙද්දී (schemas කිහිපයක් අතරින් Claude තෝරයි).',
        '{"type": "tool", "name": "extract_metadata"}: ඒ නිශ්චිත tool එකම call කළ යුතුයි. නිශ්චිත පියවරක් (උදා: metadata extraction) පළමුව run කරන්න. {"type": "none"} = මේ turn එකට tools නැහැ.',
      ],
      analogy:
        'auto = "කැමති නම් මොනවා හරි ගෙන්නගන්න" (menu එක හෝ සුළු කතාවක්). any = "ඕනෑම එකක් ඇණවුම් කරන්නම ඕනේ" (මෙනුවෙන් එකක් විතරයි). forced = "අද විශේෂය කොත්තු එකම ඇණවුම් කරන්න". none = "අද මෙනුව නෑ, කතා කරමු".',
      example:
        'Invoice, receipt, contract කියලා extraction schemas 3ක් තියෙනවා, ලැබෙන document එකේ type එක නොදනී. tool_choice "any" දෙනවා: Claude text එකකින් පිළිතුරු දෙන්නේ නැතුව ගැළපෙන schema tool එක call කරනවා. Metadata එකම පළමුව ගන්න ඕනේ නම් forced extract_metadata.',
      code: {
        lang: 'python',
        src: `tool_choice={"type": "auto"}   # Claude තීරණය කරයි, text වුණත් හරි
tool_choice={"type": "any"}    # යම් tool එකක් call කළම ඕනේ
tool_choice={"type": "tool",   # මේ tool එකම call කළ යුතුයි
             "name": "extract_metadata"}
tool_choice={"type": "none"}   # මේ turn එකට tools නැහැ`,
      },
      keyPoints: [
        'auto = Claude තීරණය කරයි (text වෙන්න පුළුවන්).',
        'any = අනිවාර්යයෙන් යම් tool එකක් (document type නොදන්නා, structured output).',
        'forced tool = ඒ tool එක පළමුව.',
        'Exam "any" = වත්මන් docs හි {"type": "any"} (එකම අර්ථය).',
      ],
      terms: [
        { en: 'Wrong answer: auto භාවිතා කර schema output ඒකාන්ත ලෙස බලාපොරොත්තු වීම', si: 'auto සමඟ Claude text එකකින් පිළිතුරු දෙන්නත් පුළුවන්.' },
        { en: 'Wrong answer: forced tool එක document type නොදන්නා විටත් භාවිතා කිරීම', si: 'වැරදි schema එකක් බල කරයි. නොදන්නා නම් any.' },
      ],
    },
    {
      id: 'mcp-servers-scopes-env',
      examRefs: ['CCAR-009', 'CCAR-025', 'CCAR-027'],
      title: 'MCP Servers: Scopes සහ Env Expansion (Task 2.4)',
      body: [
        'MCP server එකක් Claude Code ට සම්බන්ධ කරන්නේ configuration file එකකින්. Scope දෙකක් තියෙනවා. Project scope: repo එකේ .mcp.json, Git හරහා සමස්ත team එකටම share වෙනවා (team ට අවශ්‍ය servers). User scope: ~/.claude.json, ඔයාට පමණක් (පුද්ගලික හෝ අත්හදා බලන servers).',
        'Secrets (tokens) config file එකේ කෙලින්ම ලියන්න එපා, ඒක Git එකට commit වෙනවා. ඒ වෙනුවට environment variable expansion භාවිතා කරන්න: "GITHUB_TOKEN": "${GITHUB_TOKEN}". එකිනෙක developer ගේ machine එකේ env var එකෙන් අගය ගන්නවා.',
        'Configure කළ සියලු servers වල tools connection වෙලාවේ discover වෙලා එකවර භාවිතා කරන්න පුළුවන්. Agent එක MCP tool එකකට වඩා Grep වගේ built-in tool එකකට කැමති නම්, MCP tool එකේ description එක වැඩිදියුණු කරන්න (Task 2.1 නැවත).',
      ],
      analogy:
        'ගෙදර wifi password එක ශීතකරණයේ පෝස්ටර් එකක ඇලවුවොත් ගෙදරට එන හැමෝම දකිනවා. ඒක තමයි token එක Git එකට commit කරන එක. ${GITHUB_TOKEN} කියන්නේ "password එක ඔයාගේ ෆෝන් එකේ තියෙනවා, මෙතන ලියන්නේ නෑ" කියලා.',
      example:
        'Team එක GitHub MCP server එක පාවිච්චි කරනවා. .mcp.json එක repo එකේ commit කරනවා (token එක නැතුව ${GITHUB_TOKEN}). අලුත් developer එක repo එක clone කරලා තමන්ගේ GITHUB_TOKEN env var එක set කළම server එක වැඩ. ඔයා තනියම උත්සාහ කරන experimental server එක ~/.claude.json හි.',
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
        'Project scope = .mcp.json (Git, team). User scope = ~/.claude.json (personal).',
        'Secrets: ${ENV_VAR} expansion; token commit කරන්න එපා.',
        'සියලු servers වල tools connection වෙලාවේ discover වී එකවර use කළ හැක.',
        'Agent MCP tool නොසලකනවා නම් description එක හදන්න.',
      ],
      terms: [
        { en: 'Wrong answer: token එක .mcp.json එකේම ලියන්න', si: 'Git history එකේ secret එක ඉතිරි වෙනවා.' },
        { en: 'Wrong answer: team server එක ~/.claude.json (user scope) හි තැබීම', si: 'Teammates ලට ලැබෙන්නේ නෑ. Team එකට = .mcp.json.' },
        { en: 'Wrong answer: ".claude/config.json" වැනි ෆයිල් එකක server දැමීම', si: 'එවැනි config file එකක් exam එකේ distractor එකක්. .mcp.json සහ ~/.claude.json විතරයි.' },
      ],
    },
    {
      id: 'mcp-resources-community-custom',
      title: 'MCP Resources vs Tools, Community vs Custom Servers (Task 2.4)',
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
      examRefs: ['CCAR-010', 'CCAR-026'],
      title: 'Built-in Tools සහ Codebase Exploration (Task 2.5)',
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
      title: 'Scenario: Customer Support Resolution Agent',
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
      title: 'Scenario: Multi-Agent Research System',
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
      title: 'Scenario: Developer Productivity with Claude',
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
      title: 'පිළිතුරු තෝරන නීති 6 සහ නැති Features වලට අවවාද',
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
      title: 'AWS Architect ගේ ඇස: මේ ideas AWS design එකකට map කරන ආකාරය',
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
      q: 'Agent loop එකක් නවත්වන්න නිවැරදිම ක්‍රමය?',
      options: [
        'Claude ගේ text එකේ "done" වචනය සොයා නවත්වීම',
        'stop_reason == "end_turn" වූ විට නවත්වීම; "tool_use" වූ විට tool run කර tool_result යවා දිගටම',
        'නියත iteration 5ක් run කර නවත්වීම',
      ],
      answer: 1,
      why: 'stop_reason structured field එකයි. Text parse කිරීම සහ iteration cap එක (backup විතරයි) වැරදි ප්‍රධාන ක්‍රම.',
    },
    {
      q: 'Research report එක topic 4න් 1ක් (visual arts) විතරයි; subagents හරියටම වැඩ කළා. Root cause?',
      options: [
        'Subagents වල prompts දුර්වලයි',
        'Coordinator ගේ decomposition එක ඉතා පටුයි',
        'Synthesis agent ට web search නැහැ',
      ],
      answer: 1,
      why: 'Rule 1: root cause එකට විසඳුම. Subagents ලැබුණු scope එකට හොඳට වැඩ කළා; coordinator topic එක පටුවට කැඩුවා.',
    },
    {
      q: 'Parallel subagents 3ක් run කරන නිවැරදි ක්‍රමය?',
      options: [
        'එකම coordinator response එකක Task/Agent tool calls 3ක් emit කිරීම',
        'Turns 3කින් එකින් එක spawn කිරීම',
        'Subagents ට coordinator ගේ conversation එක ස්වයංක්‍රීයව ලැබෙන නිසා ඒවා එකිනෙකා හමුවෙයි',
      ],
      answer: 0,
      why: 'එකම response එකක tool calls කිහිපයක් = parallel. Subagents parent conversation එක inherit නොකරයි, ඒ නිසා context එක prompt එකේ දිය යුතුයි.',
    },
    {
      q: 'Agent 12%ක් වාරවල get_customer මඟ හැර වැරදි refunds කරයි. හොඳම පළමු පියවර?',
      options: [
        'System prompt එක තවත් ශක්තිමත් කිරීම',
        'Few-shot examples එකතු කිරීම',
        'Verified customer ID එක ලැබෙනකම් lookup_order සහ process_refund block කරන programmatic prerequisite එකක්',
      ],
      answer: 2,
      why: 'Rule 3: මුදල්/identity නීතිය code එකෙන්. Prompt සහ few-shot probabilistic (ශුන්‍ය නොවන failure rate).',
    },
    {
      q: '$500 ට වැඩි refunds human escalation වෙත යවන්න නිවැරදි mechanism එක?',
      options: [
        'PostToolUse hook එකකින් refund එක block කිරීම',
        'PreToolUse hook එකකින් amount > 500 deny කර escalate_to_human කියා reason එකක් දීම',
        'System prompt එකේ "500 ට වැඩි refund කරන්න එපා" කියා ලිවීම',
      ],
      answer: 1,
      why: 'PreToolUse tool එක run වෙන්න කලින් block කරයි. PostToolUse run වුණාට පසුවයි. Prompt නීතියට failure rate එකක් තියෙනවා.',
    },
    {
      q: 'Tool timeout එකක් සහ "order එකක් නැහැ" යන දෙක agent ට වෙන් කර දැනුම් දෙන්නේ කෙසේද?',
      options: [
        'දෙකටම හිස් list එකක් ([]) දීම',
        'Timeout = isError: true + transient + isRetryable: true; order නැහැ = සාමාන්‍ය result එකක් ({"found": false})',
        'දෙකටම "Operation failed" යවීම',
      ],
      answer: 1,
      why: 'Access failure ≠ empty result. Timeout empty success ලෙස දුන්නොත් agent වැරදි නිගමනයකට යයි (Rule 5).',
    },
    {
      q: 'Tool selection වැරදෙයි; tool descriptions අවමයි ("Retrieves order details"). හොඳම පළමු පියවර?',
      options: [
        'Intent routing classifier එකක් train කිරීම',
        'Descriptions විස්තර කිරීම: inputs, උදාහරණ, boundaries',
        'Tools එකතු කර එක tool එකක් කිරීම',
      ],
      answer: 1,
      why: 'Root cause = අවම descriptions. Fix order: description → rename → split. Classifier සහ merge over-engineering/විශාල වෙනස්.',
    },
    {
      q: 'Synthesis agent ට සරල fact-checks (≈85%) සඳහා coordinator ට round trips බොහෝයි. හොඳම විසඳුම?',
      options: [
        'Synthesis agent ට සියලු web search tools දීම',
        'සීමිත verify_fact tool එකක් දීම; සංකීර්ණ 15% coordinator හරහා',
        'Requests batch කිරීම',
      ],
      answer: 1,
      why: 'Scoped cross-role tool (Rule 6 least privilege). සියලු tools = out-of-role අවභාවිතය; batching dependencies block කරයි.',
    },
    {
      q: 'Document type එක නොදන්නා, schemas කිහිපයක් තියෙනවා; Claude text වෙනුවට යම් extraction tool එකක් අනිවාර්යයෙන් call කළ යුතුයි. tool_choice?',
      options: [
        '{"type": "auto"}',
        '{"type": "any"}',
        '{"type": "tool", "name": "extract_metadata"}',
      ],
      answer: 1,
      why: 'any = ඕනෑම tool එකක් අනිවාර්යයි. auto සමඟ text එන්න පුළුවන්. Forced tool එක නිශ්චිත tool එකක් පළමුව run කරන්න; නොදන්නා type එකකට වැරදි schema එකක් බල කරයි.',
    },
    {
      q: 'Team එකටම GitHub MCP server එක ඕනේ; token එක commit නොවිය යුතුයි. නිවැරදි සැකසුම?',
      options: [
        '~/.claude.json හි server එක දමා token එක ඒකේම ලිවීම',
        'Repo එකේ .mcp.json හි server එක දමා "GITHUB_TOKEN": "${GITHUB_TOKEN}" ලෙස env expansion භාවිතා කිරීම',
        '.mcp.json හි token එක කෙලින්ම ලියා Git එකට commit කිරීම',
      ],
      answer: 1,
      why: 'Project scope .mcp.json Git හරහා team එක share කරයි; ${ENV} expansion secrets commit නොවී වළක්වයි. ~/.claude.json = ඔයාට පමණක්.',
    },
  ],
}
