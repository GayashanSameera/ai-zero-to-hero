export default {
  id: 'agentic-ai',
  number: 19,
  title: 'Agentic AI in Production (NCP-AAI)',
  titleSi: 'Production එකේ Agentic AI: NCP-AAI විභාගයට architect කෙනෙක් වගේ',
  summary: 'Phase 6 සහ Phase 12 එකේදී ඔයා agent loop එක, ReAct, memory, MCP වගේ මූලික දේවල් ඉගෙන ගත්තා. මේ phase එක ඒ දැනුම production එකට ගෙනියනවා: multi-agent patterns, frameworks තෝරන හැටි, agents evaluate කරන හැටි, scale කරන හැටි, NVIDIA NIM / NeMo / Blueprints, observability, safety සහ human oversight. NCP-AAI (Agentic AI Professional) exam එකේ domains 10ම exam weight එකට අනුව මෙතන තියෙනවා, AWS එකේ ඒවා හදන හැටිත් එක්කම.',
  duration: 'සති 6-8',
  topics: [
    // 1 ---------------------------------------------------------------- Architecture
    {
      id: 'ncp-aai-map-agent-vs-workflow',
      title: 'NCP-AAI Map, Agent vs Workflow and the Autonomy Spectrum',
      body: [
        'NCP-AAI කියන්නේ "agent එකක් හදන්න පුළුවන්ද" කියලා බලන exam එකක් නෙවෙයි. "Production එකේ ගොඩක් users ලා එක්ක, සල්ලි වියදම් පාලනය කරගෙන, ආරක්ෂිතව agent system එකක් design කරන්න පුළුවන්ද" කියලා බලන exam එකක්. Weight එක බැලුවොත්: architecture and design 15%, development 15%, evaluation and tuning 13%, deployment and scaling 13%, cognition/planning/memory 10%, knowledge integration 10%, NVIDIA platform 7%, run/monitor 5%, safety 5%, human oversight 5%. ඒ කියන්නේ marks වලින් බාගයක් විතර architecture, deployment, evaluation වලින්. ඔයා AWS architect කෙනෙක් නිසා ඔයාට තියෙන ලොකුම වාසිය එතන.',
        'පළමු design තීරණය: ඇත්තටම agent එකක් ඕනේද, නැත්නම් workflow එකක් ඇතිද? Workflow එකක් කියන්නේ LLM calls සහ tools පාවිච්චි වෙන පාර (code path) developer කලින්ම ලියලා තියෙන system එකක්. උදා: "classify → retrieve → answer" කියන fixed chain එක. Agent එකක් කියන්නේ ඊළඟට මොන tool එකද, කී පාරක්ද, කවදා නවත්තන්නද කියලා LLM එකම runtime එකේදී තීරණය කරන system එකක්. Workflow එක predictable, ලාභයි, test කරන්න ලේසියි. Agent එක flexible, ඒත් cost සහ latency අනිශ්චිතයි, errors compound වෙනවා (Phase 12 එකේ 0.95¹⁰ ගණන මතක් කරගන්න).',
        'මේක on/off switch එකක් නෙවෙයි, autonomy spectrum එකක්. පහළම තැන single LLM call එක. ඊට පස්සේ prompt chaining සහ routing (Phase 12 බලන්න). ඊට පස්සේ "tool calling loop එකක් තියෙන single agent". ඉහළම තැන තමන්ගේම sub-agents හදන, දවස් ගණන් run වෙන autonomous agents. Production rule එක: ප්‍රශ්නය විසඳන අඩුම autonomy level එක තෝරන්න. Steps කලින් දන්නවා නම් workflow. Steps input එක අනුව වෙනස් වෙනවා නම්, සහ වැරදීමක වියදම අඩු නම් හෝ human check එකක් තියෙනවා නම් විතරක් agent.',
        'Exam එකේ scenario ප්‍රශ්න වලදී මේ ප්‍රශ්න තුන අහගන්න: (1) Task එකේ steps කලින් කියන්න පුළුවන්ද? (2) වැරදි action එකක වියදම කීයද (reversible ද)? (3) Latency budget එක කීයද? "Invoice එකකින් fields 6ක් extract කරන්න" වගේ එකකට agent එකක් ඕනේ නෑ. "Customer ගේ network ප්‍රශ්නය diagnose කරලා විසඳන්න" වගේ open-ended එකකට agent එකක් ගැළපෙනවා.',
      ],
      analogy: 'Workflow එක කියන්නේ Colombo-Kandy route bus එක වගේ. Route එක, stops ටික කලින්ම තීරණය කරලා. ලාභයි, කවදාද එන්නේ කියලා අනුමාන කරන්න පුළුවන්. Agent එක කියන්නේ tuk-tuk driver කෙනෙක් වගේ. ඔයා "Pettah එකට ඉක්මනට" කිව්වාම traffic බලලා පාර එයාම තෝරනවා. Flexible, ඒත් ගාස්තුවත් වෙලාවත් කලින් හරියටම කියන්න බෑ. හැම ගමනකටම tuk-tuk ගන්න ඕනේ නෑ.',
      example: 'Telco එකක "SIM එක activate වුණාද?" ප්‍රශ්නය: workflow එකකින් check_sim_status(msisdn) call එකයි template answer එකයි. LLM call 1යි, තත්පර 1.2යි, Rs. 0.40යි. "මගේ data ඉක්මනට ඉවර වෙනවා, ඇයි?" ප්‍රශ්නය: agent එකක් usage history බලනවා, background apps ගැන අහනවා, package compare කරනවා, plan එකක් යෝජනා කරනවා. LLM calls 5-9යි, තත්පර 8-20යි, Rs. 3-6යි. දෙකම එකම system එකේ තියෙන්න පුළුවන්: router එකක් සරල ඒවා workflow එකට, සංකීර්ණ ඒවා agent එකට යවනවා.',
      keyPoints: [
        'NCP-AAI marks වලින් ~50%ක් architecture, development, evaluation, deployment.',
        'Workflow = developer ලියපු code path. Agent = LLM එක runtime එකේදී path එක තීරණය කරනවා.',
        'Autonomy spectrum: single call → chain/router → tool-calling agent → multi-agent → long-running autonomous.',
        'ප්‍රශ්නය විසඳන අඩුම autonomy level එක තෝරන්න.',
        'Steps කලින් දන්නවාද, වැරැද්දක වියදම, latency budget: මේ තුන design එක තීරණය කරනවා.',
      ],
      terms: [
        { en: 'Agentic Workflow', si: 'LLM calls සහ tools තියෙන, ඒත් path එක developer කලින් ලියපු pipeline එක.' },
        { en: 'Autonomous Agent', si: 'ඊළඟ action එක, නවත්තන වෙලාව LLM එකම තීරණය කරන system එක.' },
        { en: 'Autonomy Spectrum', si: 'Single call එකේ ඉඳන් සම්පූර්ණ autonomous agents දක්වා තියෙන පඩි පෙළ.' },
        { en: 'Reversibility', si: 'වැරදි action එකක් ආපහු හරවන්න පුළුවන්ද කියන එක. Design එකේ වැදගත්ම risk factor එක.' },
      ],
    },
    // 2 ---------------------------------------------------------------- Architecture
    {
      id: 'multi-agent-orchestration-patterns',
      title: 'Single vs Multi-Agent: Orchestrator-Worker, Router, Supervisor and Hierarchical Teams',
      body: [
        'Single agent එකක් කියන්නේ එක system prompt එකක්, එක tool list එකක්, එක loop එකක්. Tools 10-15ක් දක්වා, එක domain එකක වැඩ වලට ඒක ප්‍රමාණවත්. Multi-agent වලට යන්න හේතු තුනයි: (1) tools ගොඩක් වැඩි වෙලා model එක වැරදි tool තෝරනවා, (2) domains වෙනස් නිසා system prompts ගැටෙනවා (billing නීති vs technical troubleshooting නීති), (3) parallel වැඩ කරලා latency අඩු කරන්න ඕනේ. මේ හේතු නැත්නම් single agent එකෙන් පටන් ගන්න. Phase 12 එකේ "multi-agent drawbacks" කොටස මතක් කරගන්න: වැඩි cost, වැඩි latency, errors propagate වෙනවා.',
        'Router pattern: මුලින්ම පොඩි, ලාභ model එකක් (හෝ classifier එකක්) request එක classify කරලා හරියට ගැළපෙන specialist agent හෝ workflow එකට යවනවා. Router එක වැඩේ කරන්නේ නෑ, බෙදනවා විතරයි. එක hop එකයි, ඒ නිසා latency අඩුයි. Orchestrator-worker pattern: orchestrator LLM එක runtime එකේදී task එක subtasks වලට කඩනවා (කීයක්ද කියලා කලින් දන්නේ නෑ), workers ලාට දෙනවා, results එකතු කරලා synthesize කරනවා. Research, code changes වගේ වැඩ වලට ගැළපෙනවා.',
        'Supervisor pattern එක orchestrator-worker එකට ගොඩක් සමානයි, ඒත් supervisor එක loop එකක ඉන්නවා: worker කෙනෙක් ඉවර වුණාම control එක ආපහු supervisor ට එනවා, ඊළඟට කාටද දෙන්නේ කියලා ආයෙත් තීරණය කරනවා. Hierarchical teams කියන්නේ supervisors ලාටත් supervisor කෙනෙක් ඉන්න එක: උදා: top supervisor → "billing team supervisor" → billing workers. ලොකු organizations වල වගේ. Levels වැඩි වෙන්න වැඩි වෙන්න හැම level එකකම LLM call එකක් එකතු වෙනවා, ඒ නිසා levels 2කට වඩා යන්නේ අපූරුවෙන්.',
        'Architect කෙනෙක් විදිහට බලන්න ඕනේ trade-off: centralized control (supervisor) = debug කරන්න ලේසි, policies එක තැනකින් enforce කරන්න පුළුවන්, ඒත් supervisor එක bottleneck එකක් සහ single point of failure එකක්. හැම worker result එකක්ම supervisor ගේ context එකට එන නිසා context එක ලොකු වෙනවා. ඒ නිසා workers ලාට full transcript එක නෙවෙයි, කෙටි structured summary එකක් return කරන්න කියන්න (Phase 12 එකේ "sub-agent context isolation").',
      ],
      analogy: 'Router එක hospital එකේ OPD reception එක වගේ. "බඩේ කැක්කුමද? Room 5. ඇසේ ප්‍රශ්නයක්ද? Room 9." ඒ අය ප්‍රතිකාර කරන්නේ නෑ. Supervisor කියන්නේ ward එකේ consultant වගේ: house officers ලාට tests බෙදලා දීලා, results ආවම ඊළඟට මොකද කරන්නේ කියලා තීරණය කරනවා. Hierarchical කියන්නේ hospital director → consultants → house officers.',
      example: 'Telco support: Router (8B model, ~150ms) request 1,000කින් 55% "billing", 30% "technical", 10% "sales", 5% "other" කියලා බෙදනවා. Billing agent ට tools 6යි, technical agent ට tools 9යි. එකම agent එකකට tools 15ම දුන්නාම tool selection accuracy 81%යි. Router + specialists වලින් 94%යි. Router එකේ වැරදි classification 3%ක්: ඒවා specialist එක "මේක මගේ domain එක නෙවෙයි" කියලා router එකට ආපහු යවනවා.',
      keyPoints: [
        'Single agent එකෙන් පටන් ගන්න. Tools ගොඩක්, prompts ගැටීම, parallelism ඕනේ වුණාම multi-agent.',
        'Router = classify කරලා බෙදනවා, වැඩ කරන්නේ නෑ. ලාභයි, වේගවත්.',
        'Orchestrator-worker = runtime එකේ subtasks හදලා බෙදලා synthesize කරනවා.',
        'Supervisor = loop එකක control එක ආපහු ගන්නවා. Hierarchical = supervisors ලාගේ supervisor.',
        'Workers summary එකක් return කරන්න ඕනේ, full transcript නෙවෙයි.',
      ],
      terms: [
        { en: 'Router Pattern', si: 'Input එක classify කරලා ගැළපෙන agent/workflow එකට යවන pattern එක.' },
        { en: 'Orchestrator-Worker', si: 'Orchestrator dynamic subtasks හදලා workers ලාට දීලා results එකතු කරන pattern එක.' },
        { en: 'Supervisor Pattern', si: 'හැම worker step එකකටම පස්සේ control එක supervisor ට ආපහු එන centralized pattern එක.' },
        { en: 'Hierarchical Agents', si: 'Supervisors කිහිප level එකක්. ලොකු systems වලට, ඒත් හැම level එකකම latency එකතු වෙනවා.' },
        { en: 'Single Point of Failure', si: 'ඒක වැටුණොත් මුළු system එකම වැටෙන component එක.' },
      ],
    },
    // 3 ---------------------------------------------------------------- Architecture
    {
      id: 'swarm-handoff-blackboard',
      title: 'Decentralized Patterns: Swarm / Handoff, Blackboard, Sequential and Parallel Pipelines',
      body: [
        'Handoff (swarm) pattern එකේ central supervisor කෙනෙක් නෑ. දැනට active agent එකම "මේක මට නෙවෙයි, billing agent ට දෙන්න" කියලා control එක කෙලින්ම වෙන agent කෙනෙකුට pass කරනවා. ඊට පස්සේ user එක්ක කතා කරන්නේ ඒ අලුත් agent. OpenAI Agents SDK එකේ handoffs, LangGraph එකේ swarm style graphs මේකට උදාහරණ. Handoff එක සාමාන්‍යයෙන් tool call එකක් විදිහටම implement කරනවා (උදා: transfer_to_billing). වාසිය: supervisor hop එකක් නැති නිසා latency අඩුයි, conversation එක ස්වභාවිකයි. අවාසිය: agents අතර "ping-pong" (A → B → A → B) loops වෙන්න පුළුවන්. ඒ නිසා max handoffs limit එකක් සහ handoff history එක state එකේ තියාගන්න.',
        'Blackboard pattern: agents එකිනෙකාට කෙලින්ම කතා කරන්නේ නෑ. හැමෝම shared "blackboard" එකකට (shared state / database එකක්) ලියනවා, ඒකෙන් කියවනවා. Control component එකක් blackboard එකේ තත්ත්වය බලලා ඊළඟට කාටද වැඩ කරන්න දෙන්නේ කියලා තීරණය කරනවා. කලින් ඉඳන් AI වල තිබුණු pattern එකක්. වාසිය: agents loosely coupled, අලුත් specialist කෙනෙක් එකතු කරන්න ලේසියි. අවාසිය: concurrent writes, conflicts, "කවුද මේ field එක වෙනස් කළේ" කියන ප්‍රශ්න. ඒ නිසා versioned writes, field ownership එක පැහැදිලි කරන්න ඕනේ.',
        'සරලම patterns දෙකත් අමතක කරන්න එපා. Sequential pipeline: agent A ගේ output එක agent B ගේ input එක (researcher → writer → reviewer). Parallel (fan-out / fan-in): independent subtasks එකවර run කරලා අන්තිමට aggregate කරනවා. Latency = සියල්ලේ එකතුව නෙවෙයි, slowest branch එක. ඒවගේම voting/ensemble: agents කිහිපයක් එකම ප්‍රශ්නයට උත්තර දීලා majority එක ගන්නවා (Phase 12 එකේ debate සහ self-consistency).',
        'Pattern තෝරන හැටි, exam එකට කෙටියෙන්: steps fixed සහ පිළිවෙළට → sequential. Independent subtasks → parallel. Input type අනුව එක specialist කෙනෙක් → router. Subtasks runtime එකේ තීරණය වෙනවා → orchestrator-worker / supervisor. Conversation එක domain එකෙන් domain එකට ගලා යනවා → handoff. ගොඩක් specialists ලා shared problem එකකට කොටස් එකතු කරනවා → blackboard.',
      ],
      analogy: 'Handoff කියන්නේ bank එකක counter එකෙන් counter එකට යවනවා වගේ: "Loan ගැනද? අර counter 4 එකට යන්න." Counter 4 එකේ කෙනා ඊට පස්සේ ඔයා එක්ක කතා කරනවා. ඒත් counter 4 ආයෙත් counter 1ට, counter 1 ආයෙත් 4ට යැව්වොත් ඔයා දවස පුරාම ඇවිදිනවා (ping-pong). Blackboard කියන්නේ police station එකක case board එක වගේ: detectives ලා තමන් හොයාගත්ත දේ board එකේ අලවනවා, එකිනෙකාට කෙලින්ම කියන්නේ නෑ.',
      example: 'Handoff loop guard එකක්: state = {"active_agent": "billing", "handoffs": ["triage→billing", "billing→tech"]}. Rule: handoffs ≥ 3 නම් හෝ එකම යුගලය දෙපාරක් ආවොත් human agent ට escalate. Parallel example: travel agent එක flights (තත්පර 4), hotels (තත්පර 6), weather (තත්පර 1) එකවර call කරනවා. Sequential නම් තත්පර 11යි, parallel නම් තත්පර 6යි (slowest branch).',
      keyPoints: [
        'Handoff/swarm = central supervisor නෑ, active agent control එක කෙලින්ම pass කරනවා. Loop guards ඕනේ.',
        'Blackboard = shared state එක හරහා communicate කරනවා. Loosely coupled, ඒත් write conflicts.',
        'Sequential = A → B → C. Parallel = fan-out/fan-in, latency = slowest branch.',
        'Pattern එක task structure එක අනුව තෝරන්න, fashion එක අනුව නෙවෙයි.',
      ],
      terms: [
        { en: 'Handoff', si: 'දැනට active agent එක conversation control එක වෙන agent කෙනෙකුට දෙන එක.' },
        { en: 'Swarm', si: 'Central boss කෙනෙක් නැතුව agents handoffs වලින් එකට වැඩ කරන decentralized pattern එක.' },
        { en: 'Blackboard Architecture', si: 'Agents shared workspace එකකට ලියලා කියවලා coordinate වෙන pattern එක.' },
        { en: 'Fan-out / Fan-in', si: 'වැඩ parallel බෙදලා (fan-out) අන්තිමට results එකතු කරන (fan-in) එක.' },
        { en: 'Ping-pong Loop', si: 'Agents දෙන්නෙක් එකිනෙකාට නැවත නැවත handoff කරන failure එක.' },
      ],
    },
    // 4 ---------------------------------------------------------------- Architecture
    {
      id: 'agent-communication-mcp-a2a',
      title: 'How Agents Communicate: Messages, Shared State, MCP and the A2A Protocol',
      body: [
        'Agents අතර තොරතුරු යන්නේ ප්‍රධාන ක්‍රම දෙකකින්. (1) Message passing: agent කෙනෙක් අනිත් agent ට message එකක් (natural language හෝ structured JSON) යවනවා. Conversation-style frameworks (AutoGen වගේ) මේකට කැමතියි. (2) Shared state: හැම agent කෙනෙක්ම typed state object එකක් කියවලා update කරනවා. LangGraph එකේ state graph එක මේකට හොඳම උදාහරණය: හැම node එකක්ම state එකේ කොටසක් return කරනවා, reducer එකක් ඒක merge කරනවා. Production එකේදී free text messages වලට වඩා schema එකක් තියෙන structured messages හොඳයි: validate කරන්න, log කරන්න, test කරන්න පුළුවන්.',
        'MCP (Model Context Protocol) ගැන Phase 6 සහ Phase 12 එකේ කතා කළා: ඒක agent එකක් සහ tools/data අතර protocol එක. Host app එකේ MCP client එකක් MCP servers වලට JSON-RPC හරහා connect වෙලා tools, resources, prompts ගන්නවා. කෙටියෙන් මතක තියාගන්න: MCP = "agent-to-tool" (vertical). Agent එකට අලුත් හැකියාවන් plug කරන්න.',
        'A2A (Agent2Agent) protocol එක Google 2025 දී හඳුන්වා දුන්න open protocol එකක්. දැන් ඒක Linux Foundation යටතේ තියෙනවා. මේක "agent-to-agent" (horizontal): වෙනස් vendors, වෙනස් frameworks වලින් හදපු agents එකිනෙකා එක්ක වැඩ කරන්න. ප්‍රධාන අදහස්: Agent Card (agent එකේ නම, skills, endpoint URL, authentication requirements තියෙන JSON document එකක්, ඒකෙන් අනිත් agents ට ඒක discover කරන්න පුළුවන්), Task (lifecycle states තියෙන වැඩ unit එකක්: submitted, working, input-required, completed, failed වගේ), Messages සහ Artifacts (task එකේ output). Transport එක HTTP(S) උඩ JSON-RPC, දිග වැඩ වලට streaming (SSE) සහ push notifications. Remote agent එක "opaque": ඒකේ ඇතුළේ prompts, tools, memory අනිත් පැත්තට පේන්නේ නෑ.',
        'MCP සහ A2A එකිනෙකාට විරුද්ධ නෑ, එකට වැඩ කරනවා. උදා: ඔයාගේ telco support agent එක bank එකේ payment agent එකට A2A හරහා "මේ customer ගේ Rs. 2,500 bill එක ගෙවන්න පුළුවන්ද" කියලා task එකක් දෙනවා. Bank agent එක ඇතුළේ තමන්ගේ core banking system එකට MCP server එකක් හරහා යනවා. Architect කෙනෙක් විදිහට: org එක ඇතුළේ agents අතර shared state හෝ framework-native messaging; org boundaries හරහා, වෙනස් teams/vendors අතර A2A වගේ standard protocol එකක්; tools/data වලට MCP.',
      ],
      analogy: 'MCP කියන්නේ කඩේ cashier ට barcode scanner, card machine, cash drawer සම්බන්ධ කරන standard plugs වගේ (agent → tools). A2A කියන්නේ කඩ දෙකක් අතර purchase order format එකක් වගේ. Keells එක supplier ගේ ගබඩාව ඇතුළේ මොකද වෙන්නේ කියලා දන්නේ නෑ. "Order එක submitted, packing, delivered" කියන status එක විතරක් දකිනවා (opaque agent, task states).',
      example: 'A2A Agent Card එකක සරල අදහස: {"name": "LankaPay Bill Agent", "description": "Utility සහ telco bills ගෙවනවා", "url": "https://agents.example.lk/a2a", "skills": [{"id": "pay_bill", "description": "Bill එකක් ගෙවනවා"}], "capabilities": {"streaming": true}}. Telco agent එක task එකක් යවනවා → state "working" → bank agent ට OTP එකක් ඕනේ නිසා "input-required" → customer OTP දෙනවා → "completed", artifact එක: {"receipt_no": "R-77812", "amount_rs": 2500}.',
      keyPoints: [
        'Communication = message passing හෝ shared state. Production එකේ structured schemas.',
        'MCP = agent ↔ tools/data (vertical). Tools, resources, prompts.',
        'A2A = agent ↔ agent (horizontal), vendors/frameworks හරහා. Agent Card, Task lifecycle, Messages, Artifacts.',
        'A2A remote agent එක opaque: internals share කරන්නේ නෑ.',
        'MCP සහ A2A එකට පාවිච්චි කරන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Message Passing', si: 'Agents එකිනෙකාට messages යවලා communicate කරන ක්‍රමය.' },
        { en: 'Shared State', si: 'හැම agent කෙනෙක්ම කියවන, update කරන පොදු state object එක.' },
        { en: 'State Reducer', si: 'Nodes කිහිපයක updates එකම state field එකකට merge කරන rule එක (උදා: list එකට append).' },
        { en: 'A2A (Agent2Agent) Protocol', si: 'වෙනස් vendors ලාගේ agents එකිනෙකා එක්ක tasks හුවමාරු කරගන්න open protocol එක.' },
        { en: 'Agent Card', si: 'Agent එකේ skills, endpoint, auth විස්තර කරන JSON document එක. Discovery වලට.' },
        { en: 'Artifact (A2A)', si: 'Task එකක ප්‍රතිඵලයක් විදිහට remote agent එක දෙන output එක.' },
      ],
    },
    // 5 ---------------------------------------------------------------- Development
    {
      id: 'tool-calling-production',
      title: 'Tool and Function Calling for Production: Schemas, Tool Design, Parallel Calls, NIM and OpenAI-Compatible APIs',
      body: [
        'Phase 12 එකේ function calling sequence එක ඉගෙන ගත්තා: model එක tool call එකක් ඉල්ලනවා, ඔයාගේ code එක run කරනවා, result එක ආපහු දෙනවා. Production එකේදී වැදගත් වෙන්නේ tool design එක. හොඳ tool එකක: (1) පැහැදිලි, verb එකකින් පටන් ගන්න නමක් (get_bill, issue_refund), (2) "කවදා පාවිච්චි කරන්නද, කවදා නොකරන්නද" කියන description එකක්, (3) JSON Schema එකක් types, enums, required fields, patterns එක්ක, (4) read-only ද side effects තියෙනවාද කියලා පැහැදිලිව. Tool descriptions කියන්නේ prompt එකේ කොටසක්. ඒවා prompt engineering එකක්ම වගේ version කරලා test කරන්න.',
        'Tool granularity: ගොඩක් පොඩි tools (get_customer_name, get_customer_address, ...) = calls වැඩියි, latency වැඩියි. ගොඩක් ලොකු "do_everything(query)" tool එකක් = model එකට පාලනය නෑ, validate කරන්න බෑ. මැද තැනක් තෝරන්න: user ගේ එක intent එකකට ගැළපෙන tools. Tool output එකත් design කරන්න: අවශ්‍ය fields විතරක්, කෙටියෙන්, errors structured විදිහට ("retryable": true). Raw 5MB JSON එකක් context එකට දාන්න එපා.',
        'Parallel tool calls: අලුත් APIs වලට එක turn එකකදී tool calls කිහිපයක් ඉල්ලන්න පුළුවන් (උදා: Colombo සහ Kandy weather එකවර). ඔයාගේ executor එක ඒවා concurrently run කරලා හැම result එකක්ම අදාළ tool_call_id එක්ක ආපහු දෙන්න ඕනේ. tool_choice parameter එකෙන් "auto" (model තීරණය කරනවා), "required"/"any" (අනිවාර්යයෙන් tool එකක්), නිශ්චිත tool එකක්, හෝ "none" කියලා පාලනය කරන්න පුළුවන්. Strict/structured output modes සහ constrained decoding (Phase 14) වලින් arguments schema එකට ගැළපෙන බව සහතික කරන්න පුළුවන්, ඒත් values ඇත්ත බව නෙවෙයි. ඒ නිසා server side validation අනිවාර්යයි.',
        'Models integrate කරන එක: NVIDIA NIM LLM microservices OpenAI-compatible API එකක් (/v1/chat/completions) expose කරනවා. ඒ කියන්නේ OpenAI SDK එකේ base_url එක NIM endpoint එකට මාරු කළාම ඒ code එකම වැඩ කරනවා: build.nvidia.com එකේ hosted API catalog එක, නැත්නම් ඔයාගේම GPU එකක self-hosted NIM container එක. Tool calling support එක model එක අනුව වෙනස්, ඒ නිසා docs වලින් check කරන්න. මේ abstraction එක නිසා එකම agent code එකෙන් models මාරු කරන්න පුළුවන්: dev එකේ hosted endpoint, prod එකේ ඔයාගේ VPC එකේ NIM. Amazon Bedrock වලට Converse API එකේ toolConfig එක ඒ වගේම වැඩ කරනවා.',
      ],
      analogy: 'Tool description එක කියන්නේ අලුත් employee කෙනෙකුට දෙන "කාටද call කරන්නේ" list එක වගේ. "Ravi - accounts" කියලා විතරක් ලිව්වොත් refund එකකටත් salary ප්‍රශ්නයකටත් Ravi ට call කරනවා. "Ravi - Rs. 5,000ට අඩු refunds විතරයි. Salary ප්‍රශ්න වලට Nimali." කියලා ලිව්වොත් හරියට යනවා.',
      example: 'get_balance tool එකේ msisdn field එකට pattern "^07[0-9]{8}$" දැම්මා. Model එක "+94771234567" දුන්නාම validation fail වෙනවා, tool result එක: {"error": "invalid_msisdn", "hint": "07XXXXXXXX format එකෙන් දෙන්න", "retryable": true}. Model එක "0771234567" එක්ක retry කරනවා. Result: {"balance_rs": 342.50, "expires": "2026-11-15"}. Context එකට යන්නේ tokens ~30යි.',
      code: {
        lang: 'python',
        src: `import os, json
from openai import OpenAI
# NIM එක OpenAI-compatible, base_url එක විතරක් මාරු කරනවා
client = OpenAI(base_url="https://integrate.api.nvidia.com/v1",
                api_key=os.environ["NVIDIA_API_KEY"])
tools = [{"type": "function", "function": {
    "name": "get_balance",
    "description": "Prepaid balance එක (Rs.) දෙනවා. Read-only. Bill ප්‍රශ්න වලට නෙවෙයි.",
    "parameters": {"type": "object", "required": ["msisdn"],
        "properties": {"msisdn": {"type": "string", "pattern": "^07[0-9]{8}$"}}}}}]
r = client.chat.completions.create(model="meta/llama-3.1-70b-instruct", tools=tools,
    messages=[{"role": "user", "content": "0771234567 balance එක කීයද?"}])
call = r.choices[0].message.tool_calls[0]   # model එක run කරන්නේ නෑ, ඉල්ලනවා විතරයි
print(call.function.name, json.loads(call.function.arguments))`,
      },
      keyPoints: [
        'හොඳ tool = පැහැදිලි නම + "කවදාද" description + strict JSON Schema + side effects පැහැදිලි.',
        'Granularity: එක user intent එකකට එක tool. Outputs කෙටියෙන්, errors structured.',
        'Parallel tool calls = concurrent execute කරලා tool_call_id එක්ක ආපහු දෙන්න. tool_choice = auto/required/none/specific.',
        'Constrained decoding = schema valid, values හරි බවට නෙවෙයි. Server-side validation අනිවාර්යයි.',
        'NIM = OpenAI-compatible API. base_url මාරු කරලා hosted ↔ self-hosted යන්න පුළුවන්.',
      ],
      terms: [
        { en: 'JSON Schema', si: 'Tool arguments වල types, required fields, enums, patterns විස්තර කරන standard එක.' },
        { en: 'tool_choice', si: 'Model එක tool එකක් පාවිච්චි කරන්න ඕනෙද නැද්ද කියලා පාලනය කරන API parameter එක.' },
        { en: 'Parallel Tool Calls', si: 'එක model turn එකකදී independent tool calls කිහිපයක් ඉල්ලන එක.' },
        { en: 'OpenAI-Compatible API', si: 'OpenAI request/response format එකම පාවිච්චි කරන API එකක්. NIM, vLLM වගේ ඒවා.' },
        { en: 'Bedrock Converse API', si: 'Bedrock models වලට එකම format එකකින් chat සහ tool use (toolConfig) කරන AWS API එක.' },
      ],
    },
    // 6 ---------------------------------------------------------------- Development
    {
      id: 'agent-frameworks-when-to-use',
      title: 'Agent Frameworks Compared: LangGraph, CrewAI, AutoGen, LlamaIndex, NeMo Agent Toolkit, Claude Agent SDK, OpenAI Agents SDK',
      body: [
        'Phase 6 එකේ හැම framework එකකම එක පේළියේ විස්තරයක් තිබුණා. මෙතන අපි බලන්නේ architect ප්‍රශ්නය: "මගේ use case එකට මොකක්ද?" LangGraph: agent එක nodes, edges, typed state එකක් තියෙන graph එකක් විදිහට. Cycles, conditional edges, checkpointers (හැම step එකකටම පස්සේ state save), interrupt() වලින් human-in-the-loop, durable execution. Control flow එක ඔයාට හරියටම පාලනය කරන්න ඕනේ, long-running/stateful, production-grade agents වලට හොඳම තේරීම. Learning curve එක ටිකක් වැඩියි.',
        'CrewAI: agents ලාට role, goal, backstory දීලා, tasks දීලා, "crew" එකක් sequential හෝ hierarchical process එකකින් run කරනවා. Role-based multi-agent prototypes ඉක්මනට හදන්න ලේසියි. Fine-grained control flow එක LangGraph තරම් නෑ (deterministic orchestration වලට CrewAI Flows තියෙනවා). AutoGen (Microsoft): agents conversation එකක් විදිහට එකිනෙකා එක්ක කතා කරලා වැඩ කරනවා. Research සහ multi-agent conversation experiments වලට ප්‍රසිද්ධයි. Microsoft දැන් අලුත් වැඩ Microsoft Agent Framework එක දෙසට යොමු කරනවා, ඒ නිසා අලුත් production project එකක් පටන් ගන්න කලින් project status එක check කරන්න. LlamaIndex: data connectors, indexing, query engines වල ශක්තිමත්. "Documents ගොඩක් උඩ agentic RAG" වගේ data-heavy agents වලට ගැළපෙනවා. Event-driven Workflows සහ agent abstractions තියෙනවා.',
        'NVIDIA NeMo Agent Toolkit (කලින් නම AgentIQ): open-source, framework-agnostic library එකක්. ඒක LangGraph/CrewAI replace කරන්නේ නෑ. ඒවා උඩින් එනවා: වෙනස් frameworks වලින් හදපු agents සහ tools එක YAML config එකකින් එකට wire කරන්න, reusable functions විදිහට, සහ profiling (හැම step එකකම tokens, latency, bottlenecks), evaluation, observability (OpenTelemetry exporters) එක්ක. MCP support එකත් තියෙනවා. NVIDIA stack එකේ (NIM, Blueprints) agents optimize කරන්න සහ measure කරන්න මේක තමයි NVIDIA ගේ answer එක. Exam එකට: "Framework එකක් replace නොකර agent workflow එක profile/evaluate කරන්න NVIDIA tool එක?" → NeMo Agent Toolkit.',
        'Provider SDKs: Claude Agent SDK (Anthropic) කියන්නේ Claude Code එකට බලය දෙන agent harness එකමයි: built-in file/shell/web tools, permissions modes, hooks, subagents, MCP, context compaction. Coding/computer-use වගේ "tools ගොඩක් එක්ක ගොඩ වෙලාවක් වැඩ කරන" agents වලට. OpenAI Agents SDK: සරල primitives ටිකක්: Agents, handoffs, guardrails (input/output checks), sessions, built-in tracing. Handoff-style multi-agent apps ඉක්මනට. Architect rule: (1) Framework එකක් නැතුව direct API loop එකකින් පටන් ගන්න පුළුවන්ද බලන්න, (2) control flow සහ durability ඕනේ නම් LangGraph, (3) data/RAG heavy නම් LlamaIndex, (4) role-based crew prototype නම් CrewAI, (5) NVIDIA stack එකේ profiling/eval නම් NeMo Agent Toolkit, (6) provider ගේ harness එකම ඕනේ නම් ඒ SDK. Lock-in අඩු කරන්න tools MCP servers විදිහට හදන්න.',
      ],
      analogy: 'Frameworks කියන්නේ ගෙයක් හදන ක්‍රම වගේ. LangGraph = architect ගේ plan එකක් එක්ක block by block බඳින එක (හැම බිත්තියක්ම ඔයාගේ පාලනයේ). CrewAI = prefab house එකක් (ඉක්මන්, ඒත් design එක සීමිතයි). LlamaIndex = library එකක් හදන්න specialize වුණු contractor. NeMo Agent Toolkit = ගේ හදලා ඉවර වුණාම electricity, water meters සවි කරලා කොහෙද නාස්ති වෙන්නේ කියලා මනින inspector. Provider SDKs = brand එකේම "ready-to-move-in" apartment.',
      example: 'Decision table එකක්: (a) "Bank KYC process එක, steps 7ක්, human approval 2ක්, දවස් 3ක් ගතවෙන්න පුළුවන්" → LangGraph + Postgres checkpointer. (b) "Marketing team එකට blog post researcher + writer + editor demo එකක්, සති 1යි" → CrewAI. (c) "Policy PDFs 40,000ක් උඩ ප්‍රශ්න අහන agent" → LlamaIndex. (d) "ඉහත (a) එකේ latency 40% වැඩි, කොහෙද කියලා හොයන්න" → NeMo Agent Toolkit profiler. (e) "Repo එකක bugs fix කරන coding agent" → Claude Agent SDK.',
      keyPoints: [
        'LangGraph = graph + typed state + checkpointers + interrupts. Control සහ durability.',
        'CrewAI = role-based crews, ඉක්මන් prototypes. AutoGen = conversational multi-agent (Microsoft).',
        'LlamaIndex = data/RAG-heavy agents.',
        'NeMo Agent Toolkit (කලින් AgentIQ) = framework-agnostic wiring + profiling + evaluation + observability.',
        'Claude Agent SDK / OpenAI Agents SDK = provider harnesses. Framework එකක් නැතුව පටන් ගන්න පුළුවන්ද කියලත් බලන්න.',
      ],
      terms: [
        { en: 'Checkpointer (LangGraph)', si: 'හැම super-step එකකටම පස්සේ graph state එක save කරන component එක. Resume, time travel, HITL වලට.' },
        { en: 'CrewAI Process', si: 'Crew එකේ tasks run වෙන විදිහ: sequential හෝ hierarchical (manager agent එක්ක).' },
        { en: 'NeMo Agent Toolkit', si: 'Agents/tools YAML එකෙන් wire කරලා profile, evaluate, observe කරන NVIDIA open-source toolkit එක (කලින් AgentIQ).' },
        { en: 'Agent Harness', si: 'Model එක වටේ loop, tools, permissions, context management දෙන runtime එක.' },
        { en: 'Vendor Lock-in', si: 'එක framework/provider එකකට බැඳිලා ලේසියෙන් මාරු වෙන්න බැරි තත්ත්වය.' },
      ],
    },
    // 7 ---------------------------------------------------------------- Cognition
    {
      id: 'reasoning-planning-strategies',
      title: 'Cognition and Planning in Production: ReAct vs Plan-and-Execute vs Reflection, Replanning and Reasoning Models',
      body: [
        'Phase 12 එකේ ReAct, plan-and-execute, ReWOO, LLMCompiler, Reflexion ගැඹුරින් ඉගෙන ගත්තා. මෙතන අපි බලන්නේ production එකේ මේවා අතරින් තෝරන හැටි. ReAct (Thought → Action → Observation loop) හැම observation එකකටම පස්සේ adapt වෙනවා. Environment එක අනිශ්චිත, tool results ඊළඟ step එක තීරණය කරන වැඩ වලට (debugging, troubleshooting) හොඳයි. අවාසිය: step එකකට ලොකු model call එකක්, history එක දිග වෙනවා, plan එකක් නැති නිසා "අතරමං" වෙන්න පුළුවන්.',
        'Plan-and-execute: planner (ලොකු model) මුලින්ම steps list එකක් හදනවා. Executor (පොඩි model හෝ code) step by step run කරනවා. අවශ්‍ය වුණොත් විතරක් replanner එක plan එක update කරනවා. වාසි: ලාභයි (ලොකු model call ටිකයි), plan එක user ට පෙන්නලා approve කරගන්න පුළුවන් (HITL), progress track කරන්න ලේසියි. අවාසිය: plan එක වැරදි assumptions උඩ හැදුවොත් replan triggers හොඳට design කරන්න ඕනේ (step fail වුණාම, අනපේක්ෂිත result එකක් ආවම).',
        'Reflection / self-critique: agent එක තමන්ගේ output එක (හෝ trajectory එක) critique කරලා improve කරනවා. Phase 12 එකේ වැදගත්ම පාඩම: external signal එකක් (tests fail, tool error, validator, judge score) තිබුණොත් reflection වැඩ කරනවා. Signal එකක් නැතුව "ඔයාගේ උත්තරය හරිද ආයෙ බලන්න" කියන එක බොහෝ විට උදව් නෑ, සමහර විට හරි උත්තර වැරදි කරනවා. ඒ නිසා production එකේ reflection = generator + verifier (unit tests, schema check, policy check, judge) loop එකක්, max rounds එකක් එක්ක.',
        'Reasoning models (thinking tokens තියෙන models) ආවට පස්සේ design එක ටිකක් වෙනස් වුණා: model එක ඇතුළෙම planning සහ self-check කරන නිසා prompt එකේ "step by step හිතන්න" වගේ scaffolding අඩුවෙන් ඕනේ. ඒත් thinking tokens වලට ගෙවන්න ඕනේ, latency වැඩියි. Pattern එක: planning සහ hard decisions වලට reasoning model, simple tool execution සහ formatting වලට පොඩි වේගවත් model (model routing). Thinking budget එක (effort level) task එක අනුව set කරන්න. NVIDIA Llama Nemotron reasoning models වල reasoning on/off කරන්න system prompt එකෙන් පුළුවන් විදිහට හදලා තියෙනවා.',
      ],
      analogy: 'ReAct කියන්නේ කලින් නොදන්න ගමක ලිපිනයක් හොයන එක වගේ: හැම හන්දියකම නවතිලා කෙනෙක්ගෙන් අහලා ඊළඟට හැරෙනවා. Plan-and-execute කියන්නේ Google Maps එකේ route එක මුලින්ම හදලා යන එක: පාර වහලා නම් විතරක් re-route. Reflection කියන්නේ A/L paper එක ලියලා ඉවර වුණාම marking scheme එකක් (external signal) එක්ක check කරන එක. Marking scheme එකක් නැතුව "හරිද දන්නේ නෑ" කියලා උත්තර වෙනස් කළොත් හරි ඒවත් වැරදි වෙන්න පුළුවන්.',
      example: 'Network fault agent: ReAct එකෙන් avg steps 7යි, ලොකු model calls 7යි, Rs. 9යි, task success 82%යි. Plan-and-execute (70B planner + 8B executor): ලොකු model calls 2යි (plan + 1 replan avg), Rs. 3.50යි, success 79%යි. Hybrid එකක්: plan එක ලොකු model එකෙන්, හැම step එකකටම පස්සේ "plan එක තාම valid ද" කියන check එක පොඩි model එකෙන්. Success 84%යි, Rs. 4.20යි. Reflection: config change එකකට පස්සේ ping test එක fail නම් (external signal) agent එක reflect කරලා rollback කරනවා.',
      keyPoints: [
        'ReAct = adaptive, ඒත් step එකකට ලොකු model call. අනිශ්චිත environments වලට.',
        'Plan-and-execute = ලාභයි, plan එක HITL වලට පෙන්නන්න පුළුවන්. Replan triggers design කරන්න.',
        'Reflection වැඩ කරන්නේ external signal (tests, validators, judges) එකක් එක්ක.',
        'Reasoning models = scaffolding අඩුයි, thinking tokens වලට ගෙවන්න ඕනේ. Model routing.',
      ],
      terms: [
        { en: 'Replanning', si: 'Step එකක් fail වුණාම හෝ අලුත් තොරතුරු ආවම plan එක update කරන එක.' },
        { en: 'Verifier', si: 'Output එක හරිද කියලා check කරන code, test, හෝ model එක.' },
        { en: 'Reasoning Model', si: 'උත්තරය දෙන්න කලින් thinking tokens generate කරලා හිතන්න train කරපු model එක.' },
        { en: 'Thinking Budget', si: 'Reasoning model එකකට හිතන්න දෙන tokens/effort සීමාව.' },
        { en: 'Model Routing', si: 'Step එකේ අමාරුව අනුව ලොකු හෝ පොඩි model එකට යවන එක.' },
      ],
    },
    // 8 ---------------------------------------------------------------- Memory
    {
      id: 'memory-architecture-production',
      title: 'Memory Architecture: Thread State vs Long-Term Stores, Episodic / Semantic / Procedural, Summarization and Memory Hygiene',
      body: [
        'Phase 12 එකේ memory taxonomy එක ඉගෙන ගත්තා (short-term vs long-term, semantic = facts, episodic = අතීත සිදුවීම්, procedural = how-to skills, MemGPT paging). Production architecture එකේදී මේවා map වෙන්නේ මෙහෙමයි. Short-term / thread memory = එක conversation එකේ (thread එකේ) state එක: messages, tool results, plan progress. LangGraph එකේ මේක checkpointer එකේ thread_id එකක් යටතේ save වෙනවා. Long-term memory = threads සහ sessions අතර: user preferences, අතීත tickets, ඉගෙන ගත්ත procedures. LangGraph එකේ මේකට Store එක (namespaces එක්ක). AWS එකේ Bedrock AgentCore Memory වගේ managed services මේ දෙකම (short-term + long-term) දෙනවා.',
        'Memory stores තෝරන හැටි: thread state වලට වේගවත් key-value (Redis/ElastiCache, DynamoDB) හෝ Postgres. Semantic search ඕනේ long-term memories වලට vector store (pgvector, OpenSearch, Milvus). Structured facts (customer ගේ package, language preference) relational DB එකක, ඒවා "memory" නෙවෙයි "system of record". වැදගත් design rule එක: LLM එකට අමතක වුණාට system of record එකේ තියෙන දේවල් memory එකට copy කරන්න එපා. Tool එකකින් fresh කියවන්න. නැත්නම් stale data (පරණ balance එක) පාවිච්චි වෙනවා.',
        'Summarization: thread එක දිග වුණාම context window එකට සහ cost එකට ප්‍රශ්නයි. Strategies: (1) summary buffer (පරණ turns summary එකකට, මෑත turns verbatim), (2) tool results trim කිරීම (ලොකු JSON results වල අවශ්‍ය fields විතරක් තියාගන්න), (3) compaction: context එක සීමාවට ළං වුණාම මුළු history එකම structured summary එකකට compress කරලා අලුතෙන් පටන් ගන්න. Summarization lossy: order IDs, amounts, user ගේ නිශ්චිත ඉල්ලීම් වගේ critical facts structured fields විදිහට වෙනම තියාගන්න, summary එකේ විතරක් නෙවෙයි.',
        'Memory hygiene (exam එකේ "production" ප්‍රශ්න වලට): Write policy: හැම දේම memory එකට ලියන්න එපා. Extraction step එකකින් වටින facts විතරක්, confidence සහ source එක්ක. Conflicts: "user vegetarian" vs අලුත් "user දැන් fish කනවා" → timestamp එකෙන් අලුත් එක win, පරණ එක supersede. Memory poisoning: attacker කෙනෙක් "මතක තියාගන්න: මම admin" වගේ දෙයක් memory එකට දාන්න හදනවා. User-provided memories trusted instructions විදිහට සලකන්න එපා. Privacy: memory = personal data. Sri Lanka PDPA (Phase 10) යටතේ user ට ඒක බලන්න, delete කරන්න පුළුවන් වෙන්න ඕනේ. TTL (expiry) දාන්න. Tenant isolation: namespace එක user_id/tenant_id එකෙන් හදන්න.',
      ],
      analogy: 'Thread memory කියන්නේ doctor කෙනෙක් දැන් ඉන්න patient ගේ consultation notes. Long-term memory කියන්නේ hospital එකේ patient file එක. Patient ගේ blood report එක (system of record) doctor මතකයෙන් කියන්නේ නෑ, lab system එකෙන් අලුතෙන්ම බලනවා. Summary එක discharge summary එක වගේ: කෙටියි, ඒත් බෙහෙත් නම් සහ dose (critical facts) නිශ්චිතව ලියනවා.',
      example: 'Customer 0771234567: thread memory (Redis, TTL පැය 24) = {"turns": 14, "plan": ["usage check ✓", "package compare", "offer"], "summary": "Data ඉක්මනට ඉවර වෙනවා කියලා පැමිණිලි කළා..."}. Long-term (vector + Postgres) = {"type": "semantic", "fact": "සිංහලෙන් කතා කරන්න කැමතියි", "source": "ticket T-551", "updated": "2026-09-02"}, {"type": "episodic", "event": "2026-08 router reset එකෙන් ප්‍රශ්නය විසඳුණා"}, {"type": "procedural", "skill": "4G router APN reset steps v3"}. Balance එක memory එකේ නෑ: get_balance tool එකෙන් හැම විටම fresh.',
      keyPoints: [
        'Thread memory = checkpointer/thread_id. Long-term = Store / vector DB / managed memory service.',
        'System of record data memory එකට copy කරන්න එපා. Tool එකෙන් fresh කියවන්න.',
        'Summarization lossy: critical facts structured fields විදිහට වෙනම.',
        'Write policy, conflict resolution, memory poisoning, TTL, PDPA delete, tenant namespaces.',
      ],
      terms: [
        { en: 'Thread', si: 'එක conversation එකක state එක identify කරන ID එක (thread_id).' },
        { en: 'Long-term Memory Store', si: 'Sessions අතර facts, episodes, procedures තියාගන්න external storage එක.' },
        { en: 'Context Compaction', si: 'Context window එක පිරෙන්න ළං වුණාම history එක summary එකකට compress කරන එක.' },
        { en: 'Memory Poisoning', si: 'Malicious content memory එකට දාලා පස්සේ agent ගේ හැසිරීම වෙනස් කරන attack එක.' },
        { en: 'TTL (Time To Live)', si: 'Data එකක් automatically delete වෙන්න කලින් තියෙන කාලය.' },
        { en: 'System of Record', si: 'යම් data එකක නිල, නිවැරදිම source එක (billing DB වගේ).' },
      ],
    },
    // 9 ---------------------------------------------------------------- Knowledge
    {
      id: 'knowledge-integration-agentic-rag-sql',
      title: 'Knowledge Integration: Agentic RAG, External APIs, SQL Agents and Multimodal Data',
      body: [
        'Classic RAG (Phase 6, Phase 13) එක fixed pipeline එකක්: retrieve → generate. Agentic RAG එකේ retrieval එක agent එකේ tool එකක්: agent එක තීරණය කරනවා retrieve කරන්න ඕනෙද, කොහෙන්ද (policy docs, FAQ, ticket history, web), query එක rewrite කරන්න ඕනෙද, results මදිද (ආයෙත් search කරන්න), multi-hop ද. Phase 13 එකේ "Agentic RAG සහ GraphRAG" topic එකේ CRAG, self-RAG අදහස් තියෙනවා. Production trade-off: quality වැඩියි, ඒත් retrieval calls වැඩි නිසා latency සහ cost අනිශ්චිතයි. Max retrieval rounds එකක් දාන්න, සහ "search කරලා හම්බුණේ නෑ, මම දන්නේ නෑ" කියන්න ඉඩ දෙන්න.',
        'External APIs: agent එකක් REST APIs call කරද්දී: (1) API එක wrapper tool එකක් පිටිපස්සේ තියන්න, raw HTTP access දෙන්න එපා, (2) auth secrets model එකට කවදාවත් පෙන්නන්න එපා, tool layer එකේ inject කරන්න, (3) user ගේ identity එකෙන් call කරන්න (delegated auth / OAuth on-behalf-of), agent එකට "super user" key එකක් දෙන්න එපා, (4) API responses untrusted data (indirect prompt injection, Phase 12). MCP servers මේ wrapper layer එක standard විදිහට හදන්න හොඳ ක්‍රමයක්.',
        'Structured data / SQL agents (text-to-SQL): LLM එක natural language ප්‍රශ්නයක් SQL query එකකට හරවලා database එකේ run කරනවා. Production rules: read-only DB user එකක් (හෝ read replica එකක්), allow-list කරපු tables/views විතරක්, row-level security එකෙන් tenant data වෙන් කරන්න, query එක run කරන්න කලින් parse කරලා validate කරන්න (SELECT විතරක්, LIMIT අනිවාර්යයි), timeout, schema එකේ column descriptions සහ example queries prompt එකට දෙන්න. Error එකක් ආවොත් error message එක agent ට දීලා fix කරන්න ඉඩ දෙන්න (self-correction with an external signal). Aggregations සහ ගණන් වලට SQL, unstructured text වලට RAG: hybrid agent එකක් දෙකම tools විදිහට.',
        'Multimodal data: agents ට screenshots, scanned bills, router photos, voice notes එනවා. Options: vision-language model (VLM) එකකට image එක කෙලින්ම දෙන එක, නැත්නම් ingestion එකේදීම OCR/table extraction කරලා text විදිහට index කරන එක (Phase 13 "Ingestion සහ Parsing"; NVIDIA NeMo Retriever extraction වගේ tools PDF වල tables, charts extract කරනවා). Voice: ASR (speech-to-text, NVIDIA Riva වගේ) → agent → TTS. සිංහල/Singlish audio වල ASR quality එක test කරන්න, ඒක bottleneck එක වෙන්න පුළුවන්.',
      ],
      analogy: 'Classic RAG කියන්නේ library එකේ "එක පොතක් ගෙනත් දෙන" assistant කෙනෙක්. Agentic RAG කියන්නේ researcher කෙනෙක්: පොත කියවලා "මේකේ මදි, අර journal එකත් බලන්න ඕනේ" කියලා ආයෙත් යනවා. SQL agent එකට read-only access දෙන එක bank teller ට balance බලන්න පුළුවන් screen එක දීලා, vault එකේ යතුර නොදෙන එක වගේ.',
      example: 'ප්‍රශ්නය: "ගිය මාසේ Kandy district එකේ fiber complaints කීයද, ප්‍රධාන හේතුව මොකක්ද?" Agent: (1) sql_query tool: SELECT root_cause, COUNT(*) FROM v_complaints WHERE district=\'Kandy\' AND month=\'2026-10\' AND product=\'fiber\' GROUP BY root_cause ORDER BY 2 DESC LIMIT 5 → [("cable cut", 312), ("ONT fault", 141)]. (2) rag_search tool: "Kandy fiber cable cut October" → network incident report එක. (3) Answer: "Complaints 520යි. 60%ක් cable cuts, Peradeniya road works නිසා (incident NI-2210)." SQL user එකට v_complaints view එක විතරක් SELECT කරන්න අවසර.',
      keyPoints: [
        'Agentic RAG = retrieval එක tool එකක්. කවදාද, කොහෙන්ද, ආයෙත්ද කියලා agent තීරණය කරනවා. Max rounds + "දන්නේ නෑ".',
        'External APIs = wrapper tools, secrets model එකට නෑ, user identity එකෙන් call, responses untrusted.',
        'SQL agents = read-only, allow-listed views, RLS, validate + LIMIT + timeout, schema descriptions.',
        'Multimodal = VLM direct හෝ ingestion එකේ OCR/extraction. Voice = ASR → agent → TTS.',
      ],
      terms: [
        { en: 'Agentic RAG', si: 'Retrieval එක agent එක තීරණ ගන්න tool එකක් වෙන RAG ක්‍රමය.' },
        { en: 'Text-to-SQL', si: 'Natural language ප්‍රශ්නයක් SQL query එකකට හරවන එක.' },
        { en: 'Row-Level Security (RLS)', si: 'User/tenant අනුව DB rows සීමා කරන database feature එක.' },
        { en: 'Delegated Authorization', si: 'Agent එක user ගේ අවසර වලින් පමණක් API call කරන ක්‍රමය (OAuth on-behalf-of).' },
        { en: 'Vision-Language Model (VLM)', si: 'Images සහ text දෙකම තේරුම් ගන්න model එක.' },
        { en: 'ASR / TTS', si: 'Speech-to-text සහ text-to-speech. Voice agents වල දෙපැත්ත.' },
      ],
    },
    // 10 --------------------------------------------------------------- Evaluation
    {
      id: 'agent-evaluation-metrics',
      title: 'Evaluating Agents: Task Success, Trajectory Eval, Tool-Call Accuracy, LLM-as-Judge, Cost and Latency per Task, pass^k',
      body: [
        'Chatbot එකක් evaluate කරන එකට වඩා agent එකක් evaluate කරන එක අමාරුයි, මොකද output එක එක text එකක් නෙවෙයි, actions පෙළක් සහ ලෝකයේ වෙනස් වුණු state එකක්. Levels තුනක් මනින්න: (1) Final outcome / task success: වැඩේ ඇත්තටම ඉවරද? හොඳම ක්‍රමය environment state එක check කරන එක (DB එකේ refund record එක හරියට හැදුණාද), උත්තරයේ text එක විතරක් නෙවෙයි. (2) Trajectory: ගිය පාර හරිද? අවශ්‍ය tools ගත්තාද, අනවශ්‍ය/අනතුරුදායක actions කළාද, steps කීයද. (3) Step / component level: හැම tool call එකම, retrieval එකම, router decision එකම වෙනවෙනම.',
        'Tool-call accuracy metrics: tool selection accuracy (හරි tool එක තෝරපු %), argument accuracy (arguments schema-valid සහ semantically හරිද), unnecessary call rate, invalid call rate. Trajectory match: reference trajectory එකක් එක්ක exact match (strict), in-order match (අවශ්‍ය steps පිළිවෙළට තියෙනවාද, අමතර ඒවා ok), any-order match. Strict match ගොඩක් වෙලාවට ඕනෑවට වඩා දැඩියි, මොකද හරි පාරවල් කිහිපයක් තියෙන්න පුළුවන්. ඒ නිසා trajectory එක rubric එකකින් judge කරන එකත් පොදුයි.',
        'LLM-as-judge for agents (Phase 11 එකේ judge biases මතක් කරගන්න): judge ට final answer එක විතරක් නෙවෙයි, trajectory එක (tool calls + results) සහ rubric එක දෙන්න: "Policy එක follow කළාද? Refund amount එක tool result එකට ගැළපෙනවාද? User ට බොරු promise දුන්නාද?" Judge එක human labels set එකකට එරෙහිව validate කරන්න (agreement). Simulated users: user persona එකක් තියෙන LLM එකක් agent එක්ක multi-turn conversation එකක් කරනවා (tau-bench වගේ benchmarks වල pattern එක). Efficiency metrics: cost per task (Rs.), tokens per task, latency per task (p50/p95), steps per task. "Success rate 90%යි" කියන එක Rs. 40 per task නම් business case එකක් නැති වෙන්න පුළුවන්.',
        'Reliability: LLM agents non-deterministic. pass@k = k පාරකින් එක පාරක් හරි ගියාද (code gen වලට). pass^k = k පාරම හරි ගියාද (consistency). Customer-facing agent එකකට වැදගත් pass^k. p = 0.9 නම් pass^1 = 90%, pass^4 ≈ 0.9⁴ ≈ 66% විතර. ඒ කියන්නේ එකම customer ප්‍රශ්නය 4 දෙනෙක් ඇහුවොත් හතරටම හරි උත්තරය යන්නේ 66%කදී විතරයි. Regression suite: golden tasks set එකක් (සාමාන්‍ය cases, edge cases, adversarial/injection cases, අතීත production failures) හැම prompt/model/tool change එකකටම CI එකේ run කරනවා, baseline එකට වඩා අඩු වුණොත් release block. Tuning loop: failures cluster කරන්න → prompt/tool description/routing/model change → regression suite → A/B (Phase 11).',
      ],
      analogy: 'Driving test එකක් හිතන්න. Outcome eval = "ඔයා destination එකට ආවාද?" Trajectory eval = "Red light එකක් පැන්නාද, wrong side එකෙන් ගියාද?" Destination එකට ආවට red light 3ක් පැන්නා නම් license එක දෙන්නේ නෑ. pass^k = එක පාරක් හොඳට drive කළා මදි, හැම දවසෙම හොඳට drive කරන්න ඕනේ.',
      example: 'Golden set: tasks 200 (billing 80, technical 70, sales 30, injection attacks 20), හැම එකක්ම 4 පාරක්. Results: task success (DB state check) 88%, pass^4 61%, tool selection accuracy 95%, argument accuracy 91%, unnecessary calls 0.8 per task, avg cost Rs. 4.10, p95 latency තත්පර 14. Injection tasks 20න් 2ක refund tool එක call කරන්න හැදුවා → approval gate එක block කළා, ඒත් ඒ 2 regression suite එකේ "must fix" විදිහට mark කළා. Prompt v7 → v8 එකෙන් success 88 → 91, cost Rs. 4.10 → 4.60: tradeoff එක product owner එක්ක තීරණය කරනවා.',
      code: {
        lang: 'python',
        src: `def evaluate(agent, tasks, k=4):
    report = []
    for t in tasks:
        runs = [agent.run(t.input, sandbox=t.make_env()) for _ in range(k)]
        ok = [t.check_env_state(r.env) for r in runs]       # outcome: env state check
        tools_ok = [t.expected_tools <= set(r.tools_called) for r in runs]  # trajectory
        report.append({"id": t.id,
            "pass_1": sum(ok) / k,                 # සාමාන්‍ය success
            "pass_hat_k": all(ok),                 # pass^k: k පාරම හරි ද
            "tools_ok": sum(tools_ok) / k,
            "cost_rs": sum(r.cost_rs for r in runs) / k})
    return report  # CI එකේ baseline එකට වඩා අඩු නම් release block`,
      },
      keyPoints: [
        'Levels: outcome (env state), trajectory (පාර), step/component.',
        'Tool metrics: selection accuracy, argument accuracy, unnecessary/invalid calls. Trajectory match: strict / in-order / any-order.',
        'Agent judge ට trajectory + rubric දෙන්න, human labels වලට validate කරන්න. Simulated users multi-turn වලට.',
        'Cost, tokens, latency, steps per task අනිවාර්ය metrics.',
        'pass^k = consistency (p^k). Regression suite = CI gate.',
      ],
      terms: [
        { en: 'Task Success Rate', si: 'Agent එක වැඩේ ඇත්තටම සම්පූර්ණ කරපු tasks ප්‍රතිශතය.' },
        { en: 'Trajectory Evaluation', si: 'Agent ගත්ත actions පෙළ (tools, arguments, order) evaluate කරන එක.' },
        { en: 'Tool Selection Accuracy', si: 'හරි tool එක තෝරපු tool calls ප්‍රතිශතය.' },
        { en: 'pass^k', si: 'එකම task එක k පාරක් run කළාම k පාරම සාර්ථක වෙන සම්භාවිතාව. Consistency මිනුම.' },
        { en: 'User Simulator', si: 'Agent test කරන්න customer කෙනෙක් වගේ කතා කරන LLM එක.' },
        { en: 'Regression Suite', si: 'හැම change එකකටම run කරන golden tasks set එක. පරණ හරි දේවල් කැඩුණාද බලන්න.' },
      ],
    },
    // 11 --------------------------------------------------------------- Deployment
    {
      id: 'deployment-state-durability',
      title: 'Deploying Agents: Stateless vs Stateful, Durable Execution, Queues, Timeouts, Retries and Idempotency',
      body: [
        'Agent service එකක් deploy කරද්දී පළමු ප්‍රශ්නය: state එක කොහෙද? Stateless agent server: හැම request එකකම state එක external store එකකින් (Redis, DynamoDB, Postgres) load කරලා, වැඩේ කරලා, ආපහු save කරනවා. Server instance එකේ memory එකේ මුකුත් තියාගන්නේ නෑ. වාසිය: ඕනෑම instance එකකට request එක යන්න පුළුවන්, horizontally scale කරන්න ලේසියි, pod එකක් මැරුණත් data නැති වෙන්නේ නෑ. Stateful (in-memory) agents = sticky sessions ඕනේ, pod restart එකකදී conversation එක නැති වෙනවා. Production default එක: stateless compute + externalized state.',
        'Durable execution: agent task එකක් විනාඩි ගණන්, පැය ගණන්, human approval එකක් නිසා දවස් ගණන් යන්න පුළුවන්. ඒ අතරේ deploy එකක්, crash එකක් වුණොත්? Durable execution කියන්නේ හැම step එකකටම පස්සේ progress එක persist කරලා, failure එකකට පස්සේ අන්තිම checkpoint එකේ ඉඳන් resume කරන එක (මුල ඉඳන් නෙවෙයි). විකල්ප: LangGraph checkpointers (Postgres), Temporal වගේ durable workflow engines, AWS Step Functions (agent loop එක state machine එකක් විදිහට, human approval වලට callback task tokens). වැදගත්: resume වුණාම step එකක් දෙපාරක් run වෙන්න පුළුවන්. ඒ නිසා side effects idempotent වෙන්න ඕනේ.',
        'Queues සහ async: chat UI එකට ඉක්මන් response ඕනේ, ඒත් "මගේ last 6 months bills analyze කරලා report එකක් දෙන්න" වගේ වැඩ තත්පර 60+. Pattern එක: API එක request එක queue එකකට (SQS, Kafka) දාලා task_id එකක් ආපහු දෙනවා (HTTP 202), workers queue එකෙන් අරන් process කරනවා, UI එක streaming/websocket/polling වලින් progress පෙන්නනවා. Queue එකෙන් load spikes absorb වෙනවා, LLM provider rate limits වලට backpressure ලැබෙනවා. Dead-letter queue (DLQ) එකක් failed tasks වලට. SQS visibility timeout එක task එකේ max duration එකට වඩා වැඩි වෙන්න ඕනේ, නැත්නම් task එක දෙපාරක් process වෙනවා.',
        'Timeouts, retries, idempotency (Phase 12 එකේ මූලික අදහස production depth එකට): හැම layer එකකම timeout (LLM call, tool call, මුළු task එක), timeout hierarchy එක ඇතුළේ ඉඳන් පිටට වැඩි වෙන්න ඕනේ. Retries: transient errors (429, 503, timeouts) වලට විතරක්, exponential backoff + jitter එක්ක, max attempts එකක් එක්ක. 400 validation error එකක් retry කරලා වැඩක් නෑ. Idempotency: side-effect tools වලට idempotency key එකක් (task_id + step_id), server එක එකම key එක දෙපාරක් ආවොත් පළමු result එකම දෙනවා. LLM call එක retry කළොත් model එක වෙනස් decision එකක් ගන්න පුළුවන්: ඒ නිසා tool call decision එක checkpoint කරලා, retry කරන්නේ tool execution එක විතරක්.',
      ],
      analogy: 'Stateless server කියන්නේ bank එකේ ඕනෑම teller කෙනෙක් වගේ: ඔයාගේ account එක central system එකේ තියෙන නිසා කවුරු ළඟට ගියත් වැඩේ කරනවා. Durable execution කියන්නේ passport application එකක් වගේ: officer කෙනෙක් නිවාඩු ගියත් file එකේ "stage 3 ඉවරයි" කියලා ලියලා තියෙන නිසා ඊළඟ කෙනා stage 4 ඉඳන් පටන් ගන්නවා. Idempotency key එක කියන්නේ cheque number එක වගේ: එකම cheque එක දෙපාරක් deposit කරන්න බෑ.',
      example: 'Bill analysis task: POST /tasks → 202 {"task_id": "T-9001"}. SQS visibility timeout = විනාඩි 15, task max = විනාඩි 10. Worker pod එක step 4 දී crash වෙනවා → message එක ආයෙත් visible → වෙන worker කෙනෙක් checkpoint එකෙන් step 4 ඉඳන් resume. Step 4 = send_sms(idem_key="T-9001-s4"): SMS gateway එක "already sent" කියනවා, customer ට SMS දෙකක් යන්නේ නෑ. Bedrock/NIM call එක 429 → 1s, 2s, 4s (+jitter) retries, attempts 3න් පස්සේ DLQ + alert.',
      keyPoints: [
        'Production default = stateless compute + externalized state (Redis/DynamoDB/Postgres).',
        'Durable execution = step එකකට පස්සේ persist, crash එකෙන් පස්සේ checkpoint එකෙන් resume. LangGraph checkpointer, Temporal, Step Functions.',
        'Long tasks = queue + 202 + task_id + workers + DLQ. Visibility timeout > max task time.',
        'Timeouts හැම layer එකකම. Retries transient errors වලට විතරක්, backoff + jitter.',
        'Side effects = idempotency keys. Decision එක checkpoint කරලා execution එක retry කරන්න.',
      ],
      terms: [
        { en: 'Stateless Service', si: 'Request අතර memory එකේ data නොතියාගන්න service එක. State එක external store එකක.' },
        { en: 'Durable Execution', si: 'Failures වලින් පස්සේ අන්තිම persisted step එකේ ඉඳන් workflow එක resume කරන හැකියාව.' },
        { en: 'Dead-Letter Queue (DLQ)', si: 'Retries කිහිපයකට පස්සේත් fail වුණු messages යවන වෙනම queue එක.' },
        { en: 'Exponential Backoff + Jitter', si: 'Retry අතර කාලය දෙගුණ කරමින්, random පරතරයකුත් එකතු කරන එක.' },
        { en: 'Idempotency Key', si: 'එකම operation එක දෙපාරක් execute වෙන එක වළක්වන unique key එක.' },
        { en: 'Visibility Timeout (SQS)', si: 'Worker කෙනෙක් message එකක් ගත්තාම අනිත් අයට ඒක නොපෙනී තියෙන කාලය.' },
      ],
    },
    // 12 --------------------------------------------------------------- Deployment
    {
      id: 'scaling-cost-control',
      title: 'Scaling and Cost Control: Rate Limits, Concurrency, Caching, Model Routing, Autoscaling on EKS and Serverless',
      body: [
        'Agent එකක් scale කරද්දී bottleneck එක සාමාන්‍යයෙන් ඔයාගේ API server එක නෙවෙයි, LLM එක. Hosted APIs (Bedrock, build.nvidia.com) වලට requests per minute සහ tokens per minute limits තියෙනවා. Self-hosted NIM එකකට GPU capacity එක තමයි සීමාව (Phase 9, Phase 14: KV cache, max concurrency). Agent task එකක් LLM calls 5-10ක් කරන නිසා users 100ක් = LLM calls 500-1000ක්. Controls: global rate limiter එකක් (token bucket), per-tenant/per-user quotas, concurrency limit එකක් (semaphore), queue එකෙන් backpressure. 429 ආවම retry storms වළක්වන්න backoff සහ circuit breaker.',
        'Caching layers: (1) Prompt/prefix caching: system prompt + tool definitions වගේ stable prefix එක provider/serving engine එකේ cache වෙනවා, input token cost සහ TTFT අඩු වෙනවා (Phase 12 "cache-friendly context" සහ Phase 14 prefix caching). Prefix එක stable තියාගන්න. (2) Tool result caching: get_package_catalog වගේ කලාතුරකින් වෙනස් වෙන data TTL එකක් එක්ක cache කරන්න. User-specific, ඉක්මනට වෙනස් වෙන data (balance) cache කරන්න එපා. (3) Semantic cache: කලින් ඇහුව ප්‍රශ්නයකට embedding එකෙන් ගොඩක් සමාන ප්‍රශ්නයක් ආවොත් cached answer එක. FAQ වලට හොඳයි, ඒත් personalized/agentic answers වලට අනතුරුදායකයි (වෙන customer කෙනෙක්ගේ answer එක).',
        'Cost control: cost per task එක මනින්න සහ සීමා කරන්න. ක්‍රම: model routing/cascades (සරල steps පොඩි model එකට), max steps සහ token budget per task, tool outputs trim කිරීම, context compaction, batch වැඩ (nightly reports) වලට batch APIs, self-hosted NIM එකක් utilization ඉහළ නම් per-token API එකට වඩා ලාභ වෙන්න පුළුවන් (GPU-hour cost ÷ tokens per hour). Per-tenant cost dashboards සහ alerts: "මේ customer ගේ tasks එක පාරටම Rs. 200ට ගියා" → runaway loop එකක් වෙන්න පුළුවන්.',
        'Autoscaling: EKS එකේ agent API/worker pods (CPU-bound, I/O wait ගොඩක්) HPA එකෙන් CPU/requests අනුව, නැත්නම් KEDA එකෙන් SQS queue depth අනුව scale කරන්න. GPU nodes (NIM/Triton pods) වලට Karpenter හෝ Cluster Autoscaler, NVIDIA GPU Operator. GPU pods scale කරන්න metrics: GPU utilization වලට වඩා queue depth, KV cache usage, request latency හොඳ signals (Phase 9 "Scaling LLM Serving"). GPU node එකක් ready වෙන්න සහ model weights load වෙන්න විනාඩි කිහිපයක් යන නිසා minimum replicas සහ warm capacity තියාගන්න. Serverless: AWS Lambda agent loop එකකට හොඳයි, ඒත් max විනාඩි 15යි, ඒ නිසා දිග tasks වලට Step Functions හෝ containers. Amazon Bedrock AgentCore Runtime වගේ managed agent runtimes session isolation එක්ක agents host කරනවා. Architect තීරණය: traffic spiky සහ අඩු නම් serverless/hosted APIs, steady සහ ඉහළ නම් EKS + self-hosted NIM.',
      ],
      analogy: 'Rate limit කියන්නේ Galle Face එකේ kottu කඩේ එකවර plates 20ක් විතරක් කොටන්න පුළුවන් එක වගේ. Order 100ක් එකවර ආවොත් ටොකන් (queue) දීලා පිළිවෙළට. Prefix cache කියන්නේ kottu එකට කලින්ම කපලා තියන එළවළු. Semantic cache කියන්නේ "plain kottu එකක්" ඉල්ලන හැමෝටම එකම plate එක දෙන එක: හොඳයි, ඒත් "මගේ cheese kottu එක, කලින් order කරපු" කියන කෙනාට වෙන කෙනෙක්ගේ plate එක දෙන්න බෑ.',
      example: 'Peak: tasks 50 per second, task එකකට LLM calls 6යි = calls 300 per second. NIM replica එකක් stable latency එකකින් concurrent requests ~64ක් handle කරනවා, avg call තත්පර 2යි → replica එකකට calls ~32 per second (Little\'s Law: 64 ÷ 2). Replicas ≈ 300 ÷ 32 ≈ 10, headroom එක්ක 12. Router + simple steps 8B model එකට යැව්වාම 70B calls 300 → 110 per second, 70B replicas 4-5යි. Prefix caching එකෙන් input tokens 60%ක් cached. Cost per task Rs. 6.20 → Rs. 2.90.',
      keyPoints: [
        'Bottleneck = LLM. Rate limiter, quotas, concurrency limit, queue backpressure, circuit breaker.',
        'Caching: prefix cache (stable prefix), tool result cache (TTL), semantic cache (FAQ විතරක්).',
        'Cost per task මනින්න: routing, step/token budgets, trimming, batch APIs, per-tenant alerts.',
        'EKS: HPA/KEDA (queue depth) agent pods වලට, Karpenter + GPU Operator GPU nodes වලට. Warm capacity.',
        'Lambda = max විනාඩි 15. දිග tasks = Step Functions / containers / managed agent runtimes.',
      ],
      terms: [
        { en: 'Token Bucket', si: 'නියමිත වේගයකින් tokens පිරෙන, request එකකට token එකක් වැය වෙන rate limiting algorithm එක.' },
        { en: 'Circuit Breaker', si: 'Downstream service එක fail වෙනකොට calls ටික වෙලාවකට නවත්තලා cascade failure වළක්වන pattern එක.' },
        { en: 'Semantic Cache', si: 'Embedding similarity එකෙන් සමාන ප්‍රශ්න වලට cached answers දෙන cache එක.' },
        { en: 'KEDA', si: 'Queue depth වගේ external metrics අනුව Kubernetes pods scale කරන autoscaler එක.' },
        { en: 'Karpenter', si: 'Pending pods අනුව ගැළපෙන EC2 nodes (GPU ඇතුළුව) ඉක්මනට provision කරන Kubernetes node autoscaler එක.' },
        { en: 'Cost per Task', si: 'එක user task එකක් සම්පූර්ණ කරන්න යන මුළු LLM + tool වියදම.' },
      ],
    },
    // 13 --------------------------------------------------------------- NVIDIA
    {
      id: 'nvidia-agentic-platform',
      title: 'NVIDIA Platform for Agents: NIM, NeMo Microservices, NeMo Guardrails, Nemotron and AI Blueprints (RAG, AI-Q)',
      body: [
        'Phase 9 එකේ NIM ගැඹුරින් ඉගෙන ගත්තා: optimized inference engine (TensorRT-LLM, vLLM, SGLang වගේ backends) + model + standard API එකක් එක container එකක, NVIDIA AI Enterprise license එක යටතේ production support එක්ක. Agent architecture එකකදී NIM වර්ග කිහිපයක් පාවිච්චි වෙනවා: LLM NIMs (reasoning/chat, Llama Nemotron වගේ), NeMo Retriever NIMs (embedding, reranking, document extraction), safety NIMs (NemoGuard content safety, topic control, jailbreak detection), speech (Riva). හැම එකක්ම microservice එකක් නිසා වෙනවෙනම scale කරන්න පුළුවන්: embedding NIM එකට GPU එකක කොටසක්, LLM NIM එකට GPUs කිහිපයක්.',
        'NeMo microservices: agent එකක් කාලයත් එක්ක දියුණු කරන්න (data flywheel) පාවිච්චි කරන Kubernetes-native services. NeMo Customizer (LoRA වගේ ක්‍රම වලින් fine-tuning), NeMo Evaluator (models සහ pipelines evaluate කිරීම, LLM-as-judge ඇතුළුව), NeMo Guardrails (rails service එකක් විදිහට), NeMo Retriever (RAG pipelines). අදහස: production logs → curate → පොඩි model එකක් customize කරලා → evaluate කරලා → ලොකු model එකට සමාන quality එකක් අඩු cost එකකින් ගන්න පුළුවන්ද බලන එක. NVIDIA ට මේකටම "Data Flywheel" blueprint එකකුත් තියෙනවා.',
        'NeMo Guardrails (Phase 10 එකේ rails වර්ග, Colang ගැඹුරින් තියෙනවා): open-source toolkit එකක් සහ microservice එකක්. Agents වලට වැදගත් rails: input rails (jailbreak, PII, off-topic), retrieval rails (retrieved chunks filter කිරීම), execution rails (tool/action calls වටේ checks), output rails (safety, grounding/hallucination checks), dialog rails (Colang flows වලින් conversation path පාලනය). LLM provider-agnostic: NIM, OpenAI-compatible, වෙනත් providers එක්ක වැඩ කරනවා.',
        'NVIDIA AI Blueprints: common use cases වලට reference architectures (code, Helm charts/Docker Compose, docs) එක්ක ලැබෙන "start from here" examples. RAG Blueprint: NeMo Retriever extraction වලින් PDFs (text, tables, charts) ingest කරලා, embedding + reranking NIMs, vector DB (Milvus වගේ), LLM NIM එක්ක enterprise RAG pipeline එකක්. AI-Q Research Assistant blueprint: RAG blueprint එක උඩ හදපු, reasoning models සහ NeMo Agent Toolkit පාවිච්චි කරන "deep research" agent එකක්: ප්‍රශ්නයක් plan කරලා, ඔයාගේ enterprise data සහ (අවශ්‍ය නම්) web search හරහා research කරලා, citations එක්ක report එකක් ලියනවා. Exam පාඩම: Blueprints production-ready reference architectures, ඒවා customize කරලා ඔයාගේ data සහ infrastructure එකට ගැළපෙන්න deploy කරනවා. Blueprints build.nvidia.com එකෙන් try කරන්නත්, GitHub එකෙන් ගන්නත් පුළුවන්.',
      ],
      analogy: 'NIM කියන්නේ "ready-to-cook" kottu kits වගේ: බඩු, recipe, පිහිය ඔක්කොම එක පෙට්ටියක. Blueprint කියන්නේ මුළු kottu කඩේම setup කරන plan එක: stove එක කොහෙද, cashier කොහෙද, order queue එක කොහොමද. NeMo microservices කියන්නේ customer feedback අරන් recipe එක සතියෙන් සතිය හොඳ කරන kitchen team එක. NeMo Guardrails කියන්නේ කඩේ security guard සහ food safety inspector.',
      example: 'Telco knowledge agent එකක් RAG Blueprint එකෙන් පටන් ගන්නවා: package brochures PDFs 2,300ක් NeMo Retriever extraction එකෙන් ingest (tables ඇතුළුව), embedding NIM → Milvus, query එකේදී top-50 → reranking NIM → top-5 → Llama Nemotron LLM NIM. NeMo Guardrails: input rail එකෙන් competitor comparisons/off-topic block, output rail එකෙන් grounding check. ඊට පස්සේ "ලොකු report" ප්‍රශ්න (උදා: "Q3 complaints analysis") AI-Q style research agent එකට. මාස 3කට පස්සේ logs වලින් NeMo Customizer එකෙන් 8B model එකක් fine-tune කරලා NeMo Evaluator එකෙන් compare කරනවා.',
      keyPoints: [
        'NIM වර්ග: LLM, NeMo Retriever (embed/rerank/extract), NemoGuard safety, speech. හැම එකක්ම වෙනම scale.',
        'NeMo microservices: Customizer, Evaluator, Guardrails, Retriever. Data flywheel = logs → customize → evaluate.',
        'NeMo Guardrails rails: input, retrieval, execution (tools), output, dialog (Colang).',
        'Blueprints = deploy කරන්න පුළුවන් reference architectures. RAG Blueprint, AI-Q Research Assistant.',
        'NeMo Agent Toolkit = Blueprints වල agents wire/profile/evaluate කරන toolkit එක.',
      ],
      terms: [
        { en: 'NVIDIA NIM', si: 'Optimized model + inference engine + standard API එක තියෙන deploy කරන්න ready container එක.' },
        { en: 'NeMo Retriever', si: 'Extraction, embedding, reranking NIMs තියෙන NVIDIA RAG components set එක.' },
        { en: 'NemoGuard NIMs', si: 'Content safety, topic control, jailbreak detection වගේ safety models NIMs විදිහට.' },
        { en: 'NVIDIA AI Blueprint', si: 'Use case එකකට sample code, deployment files, docs එක්ක reference architecture එක.' },
        { en: 'AI-Q Research Assistant', si: 'Enterprise data සහ web උඩ research කරලා report ලියන NVIDIA agent blueprint එක.' },
        { en: 'Data Flywheel', si: 'Production data වලින් models නිතර improve කරලා cost/quality හොඳ කරන චක්‍රය.' },
      ],
    },
    // 14 --------------------------------------------------------------- AWS mapping
    {
      id: 'aws-nvidia-agent-stack',
      title: 'On AWS: RAG Agent with Tools on NIM or Bedrock, NIM / Triton on SageMaker AI or EKS, NeMo Guardrails vs Bedrock Guardrails',
      body: [
        'Option A, fully managed: Amazon Bedrock models + Converse API toolConfig (tools) + Bedrock Knowledge Bases (RAG) + Bedrock Guardrails. Agent loop එක ඔයාගේ code එකේ (Lambda/ECS/EKS, LangGraph වගේ framework එකක් එක්ක), නැත්නම් Bedrock Agents (action groups = tools, knowledge bases, return of control) හෝ Bedrock AgentCore (Runtime, Memory, Gateway, Identity, Observability වගේ building blocks) වලින් managed විදිහට. GPU manage කරන්න ඕනේ නෑ, per-token ගෙවනවා. Option B, NVIDIA on AWS: NIM containers ඔයාගේ VPC එකේ, data AWS account එකෙන් පිට යන්නේ නෑ, model choice සහ optimization ඔයාගේ පාලනයේ, ඉහළ steady traffic වලට ලාභ වෙන්න පුළුවන්. Hybrid එකකුත් පොදුයි: LLM එක Bedrock, embedding/rerank NIMs EKS එකේ, නැත්නම් අනිත් පැත්ත.',
        'NIM/Triton deploy කරන හැටි: SageMaker AI: NIM (AWS Marketplace හරහා) හෝ Triton (SageMaker Triton container) real-time endpoint එකක් විදිහට. Autoscaling, monitoring, IAM SageMaker එකෙන් managed. Kubernetes දන්නේ නැති teams වලට ලේසියි. EKS: GPU node group (G5/G6 inference වලට, ලොකු models වලට P4d/P5), NVIDIA GPU Operator (drivers, device plugin, DCGM exporter), NIM Helm chart හෝ NIM Operator, model cache එකට persistent volume (EFS/FSx) නිසා හැම pod එකකටම weights download වෙන්නේ නෑ, Karpenter GPU nodes වලට, Prometheus + DCGM metrics. Fine-grained control, multi-model, GPU sharing (MIG) ඕනේ නම් EKS. NIM එක OpenAI-compatible නිසා agent code එකේ base_url එක internal service URL එකට දානවා විතරයි.',
        'NeMo Guardrails vs Amazon Bedrock Guardrails: Bedrock Guardrails = AWS managed policy service එකක්: content filters (hate, insults, sexual, violence, misconduct, prompt attacks), denied topics, word filters, sensitive information filters (PII mask/block, custom regex), contextual grounding checks (RAG answers source එකට ground වෙලාද), Automated Reasoning checks. Bedrock models එක්ක කෙලින්ම, නැත්නම් ApplyGuardrail API එකෙන් ඕනෑම model එකක (NIM ඇතුළුව) input/output check කරන්න පුළුවන්. Config-driven, code ලියන්න ඕනේ නෑ. NeMo Guardrails = open-source, programmable: Colang වලින් dialog flows, custom actions (Python), execution rails, tool call checks, self-hosted NemoGuard models, ඕනෑම cloud එකක/on-prem. Trade-off: Bedrock = ලේසි, managed, AWS-native compliance, configure කරන්න පුළුවන් දේ සීමිතයි. NeMo = flexible, conversation logic සහ custom checks, ඒත් host කරලා maintain කරන්න ඕනේ. දෙකම layer කරන්නත් පුළුවන්.',
        'RAG agent with tools reference (AWS): API Gateway → agent service (EKS pods, LangGraph) → LLM (Bedrock Converse හෝ NIM on EKS) + tools (rag_search: OpenSearch Serverless/Knowledge Base හෝ Milvus + NeMo Retriever NIMs; get_bill/get_usage: internal APIs MCP servers පිටිපස්සේ) + state (DynamoDB/ElastiCache checkpoints) + guardrails (Bedrock ApplyGuardrail හෝ NeMo Guardrails sidecar) + observability (OpenTelemetry → CloudWatch/X-Ray හෝ Langfuse). IAM roles for service accounts (IRSA / EKS Pod Identity) වලින් හැම tool එකකටම least privilege. Secrets Manager එකේ API keys.',
      ],
      analogy: 'Bedrock කියන්නේ hotel buffet එක වගේ: කෑම හදලා ready, plate එකට ගෙවනවා, kitchen එක ගැන හිතන්න ඕනේ නෑ. EKS එකේ NIM කියන්නේ ඔයාගේම kitchen එකක් ready-made recipe kits (NIM) එක්ක: ආරම්භක වැඩ වැඩියි, ඒත් හැමදාම 500 දෙනෙකුට උයනවා නම් ලාභයි, recipes ඔයාගේ පාලනයේ. Bedrock Guardrails = hotel එකේ standard security. NeMo Guardrails = ඔයාගේ ගෙදරට ඔයාම design කරපු security system එක.',
      example: 'තීරණයක්: Traffic දවසට tasks 20,000යි, LLM calls 120,000යි, avg tokens 3,000යි = tokens මිලියන 360 per day. Bedrock per-token cost එක සහ EKS එකේ g6 GPU nodes 4ක (24x7) cost එක compare කරනවා. Utilization 60%+ තියෙනවා නම් self-hosted NIM ලාභ වෙන්න පුළුවන්, ඒත් ops team cost එකත් එකතු කරන්න. Pilot එකට Bedrock + Bedrock Guardrails (සති 2කින් live), scale වුණාම embedding/rerank NIMs EKS එකට, NeMo Guardrails dialog rails "refund flow" එකට. (Prices නිතර වෙනස් වෙන නිසා AWS pricing calculator එකෙන් අලුත් අගයන් ගන්න.)',
      keyPoints: [
        'Managed: Bedrock + Converse toolConfig + Knowledge Bases + Guardrails + Agents/AgentCore.',
        'NIM on AWS: SageMaker AI endpoint (ලේසි) හෝ EKS (GPU Operator, Helm/NIM Operator, Karpenter, model cache).',
        'Bedrock Guardrails = managed policies (content, topics, PII, grounding, automated reasoning). ApplyGuardrail = ඕනෑම model එකකට.',
        'NeMo Guardrails = open-source, Colang dialog flows, custom actions, execution rails, portable.',
        'IRSA/Pod Identity least privilege, Secrets Manager, OpenTelemetry.',
      ],
      terms: [
        { en: 'Bedrock Knowledge Bases', si: 'Documents ingest කරලා embed කරලා retrieve කරන managed RAG feature එක.' },
        { en: 'Bedrock Agents / AgentCore', si: 'Bedrock එකේ managed agent features. AgentCore = runtime, memory, gateway, identity, observability building blocks.' },
        { en: 'ApplyGuardrail API', si: 'Model එක call නොකර ඕනෑම text එකක් Bedrock Guardrail එකකින් check කරන API එක.' },
        { en: 'Contextual Grounding Check', si: 'RAG answer එක retrieved source එකට ගැළපෙනවාද සහ query එකට අදාළද කියලා check කරන Bedrock filter එක.' },
        { en: 'NVIDIA GPU Operator', si: 'Kubernetes එකේ GPU drivers, device plugin, monitoring auto install/manage කරන operator එක.' },
        { en: 'IRSA / EKS Pod Identity', si: 'EKS pods වලට වෙනම IAM roles දෙන ක්‍රම. Least privilege වලට.' },
      ],
    },
    // 15 --------------------------------------------------------------- Run/monitor
    {
      id: 'agent-observability-maintenance',
      title: 'Run, Monitor and Maintain: Traces and Spans, OpenTelemetry, LangSmith / Langfuse, Drift, Prompt and Version Management',
      body: [
        'Agent එකක් production එකේ "වැරදි උත්තරයක් දුන්නා" කියලා complaint එකක් ආවම, ඔයාට ඕනේ හරියටම මොකද වුණේ කියලා replay කරන්න. ඒකට traces ඕනේ. Trace එකක් = එක user task එකක මුළු ගමන. Span එකක් = ඒ ඇතුළේ එක operation එකක් (LLM call, tool call, retrieval, guardrail check, sub-agent), parent-child tree එකක් විදිහට. හැම span එකකම: inputs/outputs (PII redact කරලා), model name/version, prompt version, tokens, cost, latency, errors. Logs ("මොකද වුණේ") + metrics ("කොච්චර, කොච්චර වේගයෙන්") + traces ("කොහෙද") = observability කුලුනු තුන.',
        'OpenTelemetry (OTel) කියන්නේ vendor-neutral standard එක: SDKs, collector එක, OTLP protocol එක. OTel GenAI semantic conventions වලින් LLM spans වලට standard attribute names (gen_ai.* attributes: model, token usage වගේ) define කරනවා, ඒ නිසා backend එක මාරු කරන්න ලේසියි. Backends: LangSmith (LangChain team එකේ, LangGraph එක්ක ගැඹුරු integration, datasets සහ evals), Langfuse (open-source, self-host කරන්න පුළුවන්, tracing + prompt management + evals), Arize Phoenix, ඒවගේම CloudWatch/X-Ray, Datadog. NeMo Agent Toolkit එකටත් OTel exporters සහ profiler එක තියෙනවා. Data residency ඕනේ නම් self-hosted Langfuse හෝ OTel → ඔයාගේ AWS account එකේ backend.',
        'Monitoring dashboards: task success (online proxy: user thumbs, escalation rate, re-contact within 24h), latency p50/p95/p99, cost per task, tool error rates, guardrail trigger rates, loop/step-limit hits, LLM 429 rate. Online evaluation: production traces වලින් sample එකක් LLM judge එකකින් score කරන්න, අඩු scores human review queue එකට. Drift: user ප්‍රශ්න වෙනස් වෙනවා (අලුත් package එකක් launch වුණාම), tool APIs වෙනස් වෙනවා, provider model එක update වෙනවා (silent model updates). Input topic distribution, judge scores, escalation rate වල වෙනස්කම් alert කරන්න.',
        'Version management: production agent එකක behavior එක තීරණය වෙන්නේ code + prompt version + tool descriptions + model ID/version + guardrail config + retrieval index version එකතුවෙන්. මේ හැම එකක්ම version කරලා එක "agent release" එකක් විදිහට tag කරන්න, trace එකේ release ID එක දාන්න. Model aliases ("latest") නෙවෙයි pinned model versions. Prompt registry එකක (Langfuse/LangSmith prompts හෝ Git) prompts තියාගෙන, regression suite එක pass වුණාම විතරක් promote. Rollout: shadow mode → canary 5% → 25% → 100%, metrics බලලා. Rollback = පරණ release tag එකට මාරු වීම විනාඩියෙන්.',
      ],
      analogy: 'Trace එක කියන්නේ courier parcel tracking එක වගේ: "Colombo hub එකට ආවා 9:02 → Kandy van එකට 11:40 → delivery 15:10". Parcel එක පරක්කු වුණොත් කොහෙද හිර වුණේ කියලා span එකෙන් පේනවා. Version management කියන්නේ කඩේ recipe book එකට edition number එකක් දාන එක: "ඊයේ kottu එක රසයි, අද නරකයි" කිව්වොත් recipe v12 ද v13 ද කියලා දන්නවා.',
      example: 'Trace T-77: span "agent.run" (තත්පර 11.2, Rs. 5.40, release agent-2026.10.3) → "router.llm" (0.2s, 8B) → "billing.agent.llm" ×3 (6.1s, 70B, 9,800 input tokens, 61% cached) → "tool.get_bill" (0.4s) → "tool.rag_search" (1.1s, 5 chunks) → "guardrail.output" (0.3s, pass). Problem එක: rag_search එක පරණ index version එකක් (idx-v41) return කළා, අලුත් tariff එක idx-v42 එකේ. Fix: index alias එක update, regression test එකක් එකතු කළා.',
      keyPoints: [
        'Trace = එක task එක. Span = LLM/tool/retrieval/guardrail operation, parent-child tree.',
        'OpenTelemetry + GenAI semantic conventions = vendor-neutral. LangSmith, Langfuse, Phoenix, CloudWatch.',
        'Online metrics: escalation rate, re-contact, judge scores, cost, latency, tool errors, guardrail triggers.',
        'Drift: inputs, tools, silent model updates. Pinned model versions.',
        'Release = code + prompt + tools + model + guardrails + index versions. Shadow → canary → full, fast rollback.',
      ],
      terms: [
        { en: 'Trace / Span', si: 'Trace = request එකක මුළු ගමන. Span = ඒ ඇතුළේ timed operation එකක්.' },
        { en: 'OpenTelemetry (OTel)', si: 'Traces, metrics, logs එකතු කරන්න vendor-neutral open standard එක.' },
        { en: 'LangSmith / Langfuse', si: 'LLM apps වලට tracing, evals, prompt management දෙන platforms. Langfuse open-source.' },
        { en: 'Online Evaluation', si: 'Production traffic එකෙන් sample කරලා live quality මනින එක.' },
        { en: 'Prompt Registry', si: 'Prompts versions එක්ක තියාගෙන promote/rollback කරන තැන.' },
        { en: 'Shadow Mode / Canary', si: 'Shadow = users ට නොපෙන්නා අලුත් version එක run කිරීම. Canary = traffic පොඩි කොටසකට විතරක් release කිරීම.' },
      ],
    },
    // 16 --------------------------------------------------------------- Safety
    {
      id: 'agent-safety-compliance',
      title: 'Safety, Ethics and Compliance for Agents: Tool Guardrails, Permissioning, Sandboxing, Audit Logs, EU AI Act',
      body: [
        'Chatbot එකක වැරැද්දක් = වැරදි වාක්‍යයක්. Agent එකක වැරැද්දක් = වැරදි action එකක් (සල්ලි refund, data delete, email යවපු). OWASP LLM Top 10 එකේ "Excessive Agency" (Phase 10) මේකයි: excessive functionality (අවශ්‍ය නැති tools), excessive permissions (tools වලට ඕනෑවට වඩා access), excessive autonomy (approval නැතුව high-impact actions). Defense in depth: (1) least-privilege tools, (2) tool-level guardrails, (3) human approval gates, (4) sandboxing, (5) audit logs, (6) monitoring. Prompt එකේ "refund කරන්න එපා" කියලා ලියන එක control එකක් නෙවෙයි, policy එක code එකේ enforce කරන්න ඕනේ.',
        'Tool guardrails සහ permissioning: tools risk tiers වලට බෙදන්න: read-only (get_bill) → low-risk write (create_ticket) → high-risk (issue_refund, change_package, delete). Tier එක අනුව: rate limits, amount limits (refund ≤ Rs. 2,000 auto, ඊට වැඩි නම් approval), argument validation (refund amount ≤ bill amount), pre-conditions (customer verified ද). Authorization එක model එකට නෙවෙයි, tool layer එකට: tool එක call වෙන්නේ user ගේ identity/token එකෙන්, agent ට user ට නැති අවසරයක් නෑ. "Lethal trifecta" (Phase 10): private data + untrusted content + external communication එකම agent එකක තිබුණොත් data exfiltration අවදානම ලොකුයි, ඒ නිසා එකක් හරි කපන්න.',
        'Sandboxing: code execute කරන, browse කරන, files හසුරුවන agents isolated environments වල run කරන්න: containers/microVMs (Firecracker වගේ), network egress allow-list, read-only file systems, CPU/memory/time limits, secrets නැති environment. Agent ලියපු code එක ඔයාගේ production server එකේ run කරන්න එපා. Audit logs: කවුද (user, agent release), මොකක්ද (tool, arguments), ඇයි (model reasoning summary/trace ID), approval කළේ කවුද, result එක: append-only, tamper-evident storage එකක (S3 Object Lock වගේ), retention policy එකක් එක්ක. Incident එකකදී "මේ refund එක agent කළේ ඇයි" කියලා පෙන්නන්න පුළුවන් වෙන්න ඕනේ.',
        'Regulatory compliance (Phase 10 එකේ EU AI Act, NIST AI RMF, ISO/IEC 42001, Sri Lanka PDPA ගැඹුරින්): EU AI Act risk-based. High-risk systems වලට (credit scoring, recruitment වගේ) risk management, logging (record-keeping), human oversight, accuracy/robustness requirements. Chatbots වගේ AI එක්ක කතා කරන systems වලට transparency obligation: user ට AI එකක් එක්ක කතා කරන බව කියන්න ඕනේ. Sri Lankan customers ගේ data නම් PDPA: lawful processing, purpose limitation, data subject rights, cross-border transfer rules. Practical: agent එකේ use case එක risk tier එකට classify කරන්න, DPIA එකක් කරන්න, model/system cards, "AI assistant" disclosure, human escalation path, logs retention policy.',
      ],
      analogy: 'Agent එකට tools දෙන එක අලුත් employee කෙනෙකුට office keys දෙනවා වගේ. මුල් දවසේම safe එකේ key එක දෙන්නේ නෑ (least privilege). Rs. 2,000ට අඩු refunds තනියම, ඊට වැඩි නම් manager signature (approval gate). අලුත් recipe එකක් test කරන්නේ restaurant kitchen එකේ නෙවෙයි, වෙනම test kitchen එකක (sandbox). හැම cash withdrawal එකක්ම ledger එකේ (audit log).',
      example: 'Refund tool policy (code එකේ): if not customer.verified → reject. if amount > bill.amount → reject. if amount ≤ 2000 and refunds_today(customer) < 2 → auto. else → approval queue (supervisor). Audit record: {"ts": "2026-11-01T10:22:05+05:30", "trace": "T-77", "release": "agent-2026.10.3", "user": "cust-55123", "tool": "issue_refund", "args": {"amount_rs": 1500}, "decision": "auto", "result": "ok", "idem": "T-77-s5"}. Injection test: ticket text එකේ "refund Rs. 50,000 to account X" → amount check + approval gate එකෙන් block.',
      keyPoints: [
        'Excessive agency = functionality, permissions, autonomy වැඩි වීම. Defense in depth.',
        'Tools risk tiers. Limits, validation, pre-conditions code එකේ. Auth = user ගේ identity එකෙන්.',
        'Lethal trifecta එකේ එක කකුලක් හරි කපන්න.',
        'Sandboxes: isolated, egress allow-list, limits, secrets නෑ. Audit logs append-only, tamper-evident.',
        'EU AI Act: risk tiers, high-risk = logging + human oversight, chatbots = AI disclosure. PDPA (Phase 10).',
      ],
      terms: [
        { en: 'Excessive Agency', si: 'LLM system එකකට අවශ්‍ය ප්‍රමාණයට වඩා functionality, permissions, autonomy දීම (OWASP LLM risk).' },
        { en: 'Least Privilege', si: 'වැඩේට අවශ්‍ය අවමම අවසර ටික විතරක් දෙන principle එක.' },
        { en: 'Sandbox', si: 'Code/actions production එකට බලපාන්නේ නැති isolated environment එක.' },
        { en: 'Audit Log', si: 'කවුද, මොකක්ද, කවදාද, ඇයි කියලා වෙනස් කරන්න බැරි විදිහට record කරන log එක.' },
        { en: 'Egress Allow-list', si: 'Sandbox එකට connect වෙන්න පුළුවන් external hosts list එක විතරක් open කිරීම.' },
        { en: 'DPIA', si: 'Data Protection Impact Assessment. Personal data processing එකක අවදානම් කලින් ඇගයීම.' },
      ],
    },
    // 17 --------------------------------------------------------------- Human oversight
    {
      id: 'human-in-the-loop-oversight',
      title: 'Human-AI Interaction and Oversight: Approval Gates, Escalation, Interrupt / Resume and UX for Trust',
      body: [
        'Human oversight levels තුනක්: Human-in-the-loop (HITL) = agent එක action එකක් කරන්න කලින් human approve කරන්න ඕනේ. Human-on-the-loop = agent එක තනියම කරනවා, human monitor කරලා අවශ්‍ය නම් නවත්තනවා/override කරනවා. Human-out-of-the-loop = සම්පූර්ණ autonomous. Risk සහ reversibility අනුව action එකෙන් action එකට level එක තෝරන්න: read-only = out of loop, low-risk = on the loop, high-risk/irreversible = in the loop. Phase 10 එකේ "automation bias" මතක් කරගන්න: approver හැම එකටම "approve" ඔබනවා නම් gate එකේ වටිනාකමක් නෑ. ඒ නිසා gates ගොඩක් දාන්න එපා, වැදගත් ඒවාට විතරක්, සහ approver ට තීරණය කරන්න අවශ්‍ය context එක දෙන්න.',
        'Approval gates implement කරන හැටි: agent එක high-risk tool call එකක් ඉල්ලුවාම execution එක pause කරනවා, state එක persist කරනවා (durable), approval request එක (action, arguments, හේතුව, risk) queue/UI එකකට යවනවා. Human approve/edit/reject කරනවා. ඊට පස්සේ resume. Edit එකත් වැදගත්: "Rs. 2,500 refund" → supervisor "Rs. 1,500" කියලා වෙනස් කරලා approve. Reject එකකදී හේතුව agent ට දෙන්න, එතකොට ඒකට වෙන පාරක් ගන්න පුළුවන්. LangGraph එකේ interrupt() function එක සහ Command(resume=...) මේකටම හදපු එකක්. Pause එක දවස් ගණන් යන්න පුළුවන් නිසා checkpointer එක durable (Postgres) වෙන්න ඕනේ, approval එකට timeout/expiry එකකුත් ඕනේ.',
        'Escalation: agent එක human agent කෙනෙකුට handoff කරන්න ඕනේ වෙලාවල්: user ඉල්ලුවාම ("මට මිනිහෙක් එක්ක කතා කරන්න ඕනේ"), confidence අඩු වුණාම, step/cost budget ඉවර වුණාම, sentiment එක නරක අතට ගියාම, policy එකෙන් ඉඩ නැති ඉල්ලීම්, vulnerable users. හොඳ escalation එකක් = warm handoff: human ට summary එක, කරපු දේවල්, verify කරපු දේවල් දෙනවා, customer ට ආයෙත් මුල ඉඳන් කියන්න ඕනේ නෑ. Interrupt/resume user පැත්තෙනුත්: user ට agent එක මැදින් නවත්තන්න ("stop"), plan එක වෙනස් කරන්න පුළුවන් වෙන්න ඕනේ.',
        'UX for trust: (1) Transparency: AI එකක් බව කියන්න, මොකද කරන්නේ කියලා පෙන්නන්න ("ඔයාගේ last 3 bills බලනවා..."), (2) Plan preview: action එකට කලින් plan එක පෙන්නලා confirm, (3) Sources/citations, (4) Uncertainty: "මට විශ්වාස නෑ, human කෙනෙක්ට යවන්නද?" කියන්න ඉඩ දෙන්න, (5) Undo: reversible actions වලට undo window එකක්, (6) Feedback: thumbs up/down + හේතුව, ඒ data eval suite එකට. Trust calibration ඉලක්කය: user agent ව ඕනෑවට වඩාත් අඩුවෙනුත් නොව, හරියටම ඕනේ තරමට විශ්වාස කරන එක.',
      ],
      analogy: 'Junior doctor කෙනෙක් (agent) blood test එකක් තනියම order කරනවා (out of loop). බෙහෙත් dose එකක් දෙනවා, nurse බලාගෙන ඉන්නවා (on the loop). Surgery එකක් නම් consultant ගේ signature එක අනිවාර්යයි (in the loop). Consultant ට "ඔව්" කියන්න කලින් file එක, reports, හේතුව පෙන්නනවා. Consultant leave නම් request එක ward book එකේ (durable state) ඉතුරු වෙනවා, ආවම එතන ඉඳන් ඉස්සරහට.',
      example: 'Package change flow: Agent: "ඔයාගේ data usage එක මාසෙට 38GBයි. Rs. 1,490 package එකෙන් (40GB) Rs. 2,190 package එකට වඩා Rs. 700ක් ඉතුරු වෙනවා. මාරු කරන්නද? [ඔව්] [නෑ] [human කෙනෙක්]" (customer confirmation = HITL). Customer "ඔව්" → change_package tool. Refund Rs. 4,500 (> Rs. 2,000) → supervisor queue: "Customer cust-55123, double charge Oct bill, evidence: 2 transactions ref P-881/P-882, proposed Rs. 4,500." Supervisor approve → graph resume → refund (idempotent) → customer ට SMS.',
      code: {
        lang: 'python',
        src: `from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import MemorySaver

def refund_node(state):
    # Graph එක මෙතන pause වෙනවා, state එක checkpointer එකේ save වෙනවා
    decision = interrupt({"action": "issue_refund", "amount_rs": state["amount"]})
    # Resume වුණාම node එක මුල ඉඳන් ආයෙත් run වෙනවා: side effects interrupt එකට පස්සේ
    if decision["approved"] is not True:
        return {"status": "rejected", "reason": decision.get("reason")}
    return {"status": issue_refund(state["order_id"], decision.get("amount_rs", state["amount"]))}

graph = builder.compile(checkpointer=MemorySaver())   # prod: Postgres checkpointer
cfg = {"configurable": {"thread_id": "ticket-8812"}}
graph.invoke({"order_id": "A55", "amount": 4500}, cfg)            # interrupt එකේ නවතිනවා
graph.invoke(Command(resume={"approved": True, "amount_rs": 1500}), cfg)  # supervisor edit + approve`,
      },
      keyPoints: [
        'In-the-loop (approve කලින්), on-the-loop (monitor/override), out-of-the-loop. Risk/reversibility අනුව.',
        'Gates ගොඩක් = automation bias. වැදගත් actions වලට විතරක්, context එක්ක.',
        'Approval = pause + persist + approve/edit/reject + resume. LangGraph interrupt() + Command(resume).',
        'Resume එකේදී node එක re-run වෙනවා: side effects interrupt එකට පස්සේ, idempotent.',
        'Escalation = warm handoff. Trust UX: transparency, plan preview, citations, uncertainty, undo, feedback.',
      ],
      terms: [
        { en: 'Human-in-the-Loop (HITL)', si: 'Agent action එකකට කලින් human approval අනිවාර්ය design එක.' },
        { en: 'Human-on-the-Loop', si: 'Agent තනියම වැඩ කරද්දී human monitor කරලා අවශ්‍ය නම් මැදිහත් වෙන design එක.' },
        { en: 'Approval Gate', si: 'High-risk action එකකට කලින් execution එක pause කරලා human තීරණය බලාපොරොත්තු වෙන point එක.' },
        { en: 'Interrupt / Resume', si: 'Execution එක state එක්ක නවත්තලා, පස්සේ human input එක්ක එතන ඉඳන් පටන් ගන්න එක.' },
        { en: 'Warm Handoff', si: 'Human agent ට සම්පූර්ණ context summary එක්ක conversation එක භාර දීම.' },
        { en: 'Trust Calibration', si: 'User AI එක ඇත්ත හැකියාවට ගැළපෙන තරමට විතරක් විශ්වාස කරන තත්ත්වය.' },
      ],
    },
    // 18 --------------------------------------------------------------- Case study
    {
      id: 'case-study-telco-support-agent',
      title: 'Beyond the Exam: Designing a Production Customer-Support Agent for a Sri Lankan Telco, End to End',
      body: [
        'Requirements (fictional "LankaConnect" telco): customers මිලියන 8ක්, දවසට chats/WhatsApp messages 60,000ක්, සිංහල, දෙමළ, English, Singlish. Use cases: bill/balance ප්‍රශ්න, package recommendations සහ changes, data/network troubleshooting, refunds (double charge), complaints. SLAs: first response තත්පර 3 ඇතුළත (streaming), p95 task එක තත්පර 20 ඇතුළත, containment rate (human නැතුව විසඳුණු %) ඉලක්කය 60%, cost per conversation Rs. 8ට අඩු. Compliance: PDPA, AI disclosure, audit logs වසර 2ක්.',
        'Architecture (වචන වලින් diagram එක): Channels (web chat, app, WhatsApp) → API Gateway + WAF → Conversation service (EKS, stateless) → Input guardrails (PII detection, jailbreak, language detection) → Router (8B NIM, intents: billing / technical / sales / complaint / human) → Specialist agents (LangGraph graph එකක subgraphs: Billing agent, Tech-support agent, Sales agent) → Tools MCP servers පිටිපස්සේ: get_balance, get_bill, get_usage (read-only), create_ticket (low risk), change_package (customer confirm), issue_refund (Rs. 2,000 > supervisor approval), network_status, rag_search (RAG Blueprint style: NeMo Retriever embed/rerank NIMs + Milvus, tariff PDFs සහ troubleshooting guides) → Output guardrails (grounding check, policy, tone) → Channel. State: Postgres checkpointer (threads), Redis (session cache), long-term memory (language preference, past resolutions). LLMs: 70B-class NIM on EKS (g6/p-class GPU nodes, Karpenter) primary, Bedrock model එකක් fallback (provider failover). Async: refunds approvals සහ reports SQS + workers. Human: Supervisor console (approval queue) + contact-center escalation with warm handoff. Observability: OTel → Langfuse (self-hosted, ලංකාවේ data residency අවශ්‍ය නම්) + CloudWatch. Audit: S3 Object Lock.',
        'Failure handling: LLM NIM down/429 → circuit breaker → Bedrock fallback model → ඒකත් fail නම් "අපිට දැන් පොඩි ප්‍රශ්නයක්, ඔයාව agent කෙනෙකුට යවනවා" + human queue. Billing API timeout → structured error → agent "bill system එක දැන් slow, SMS එකකින් පස්සේ දැනුම් දෙන්නද?" → async task. Step limit 10 / cost cap Rs. 15 → escalate. Handoff loop (≥3) → human. Low ASR/language confidence (Singlish voice note) → clarify question. Pod crash → checkpoint resume. Duplicate refunds → idempotency keys. Prompt injection in ticket text → tool output untrusted + amount limits + approval. Network outage storm (Kandy fiber cut, එකවර chats 5,000ක්) → network_status tool එක outage එක detect කරලා, ලොකු model එකට නොයවා workflow template answer (cost සහ load අඩු කරන්න).',
        'Eval plan සහ rollout: Offline: golden set tasks 500 (production-like transcripts, PII නැති), languages තුනම, 10%ක් adversarial. Metrics: task success (sandbox env state), pass^3, tool accuracy, grounding, policy compliance (LLM judge + human calibration on 100 samples), cost/latency per task. CI regression gate. Online: containment, escalation, re-contact 24h, CSAT, judge scores on 5% sample, cost dashboards per intent. Rollout: Phase 0 shadow mode (agent එක draft කරනවා, human agents යවනවා, drafts compare) සති 2. Phase 1 read-only intents (balance/bill) 10% traffic. Phase 2 package changes (customer confirmation). Phase 3 refunds supervisor approval එක්ක. හැම phase එකකම exit criteria (success ≥ 85%, pass^3 ≥ 70%, complaint rate baseline එකට වඩා වැඩි නෑ) සහ kill switch එකක් (feature flag එකකින් සම්පූර්ණයෙන් human වලට). මාස 3කට පස්සේ data flywheel: logs → NeMo Customizer → 8B model එකට billing intents → NeMo Evaluator → cost අඩු කිරීම.',
      ],
      analogy: 'මේක ලොකු hospital එකක් design කරනවා වගේ: OPD reception (router), wards (specialist agents), lab සහ pharmacy (tools), consultants ලාගේ signatures (approval gates), emergency generator (fallback model), patient files (memory/state), CCTV සහ registers (observability/audit). අලුත් hospital එකක් එකපාරටම මුළු නගරයටම open කරන්නේ නෑ: මුලින් OPD එක විතරක්, පස්සේ wards, අන්තිමට surgery.',
      example: 'Cost estimate (per conversation, ආසන්න): router 8B (tokens 800) + specialist 70B avg calls 3 (tokens 9,000, 60% cached) + rag 1 + guardrail checks 2 + embedding/rerank. Self-hosted NIM GPU cost conversations 60,000ට බෙදුවාම conversation එකකට Rs. 4-6 විතර, Bedrock fallback traffic 5%. Containment 60% නම් human agents ලාගේ chats 60,000 → 24,000. Agent සල්ලි ඉතුරු කරන්නේ ඒ chats 36,000න්. ඒත් pass^3 70% නම් 30%ක inconsistency: ඒ නිසා high-risk intents human approval එක්කම.',
      keyPoints: [
        'Requirements මුලින්: volume, languages, SLAs, containment, cost per conversation, compliance.',
        'Architecture: gateway → guardrails → router → specialist subgraphs → MCP tools → output guardrails, durable state, fallback LLM.',
        'Failure handling හැම layer එකකටම: circuit breaker, structured errors, budgets, loop guards, idempotency, outage mode.',
        'Eval: offline golden set + CI gate + online metrics + judge sampling.',
        'Rollout: shadow → read-only → confirmed writes → approved high-risk. Exit criteria + kill switch.',
      ],
      terms: [
        { en: 'Containment Rate', si: 'Human agent කෙනෙක් නැතුව AI එකෙන්ම විසඳුණු conversations ප්‍රතිශතය.' },
        { en: 'Provider Failover', si: 'Primary LLM endpoint fail වුණාම වෙනත් provider/model එකකට auto මාරු වීම.' },
        { en: 'Kill Switch', si: 'AI feature එක ක්ෂණිකව නවත්තලා manual process එකට යන්න පුළුවන් control එක.' },
        { en: 'Exit Criteria', si: 'Rollout එකේ ඊළඟ phase එකට යන්න කලින් සපුරන්න ඕනේ metrics.' },
        { en: 'CSAT', si: 'Customer Satisfaction score. Conversation එකෙන් පස්සේ customer දෙන rating එක.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Invoice එකකින් නිශ්චිත fields 6ක් extract කරලා ERP එකට දාන system එකක් design කරනවා. Steps හැම විටම එකයි. හොඳම design එක මොකක්ද?',
      options: [
        'Supervisor එකක් සහ workers 6ක් තියෙන multi-agent system එකක්',
        'Fixed workflow එකක් (LLM extraction + schema validation + ERP API call)',
        'ReAct agent එකක්, tools 15ක් එක්ක',
        'Swarm pattern එකක්, agents handoffs එක්ක',
      ],
      answer: 1,
      why: 'Steps කලින් දන්නවා නම් අඩුම autonomy level එක තෝරන්න. Workflow එක ලාභයි, predictable, test කරන්න ලේසියි. Agents/multi-agent මෙතන cost, latency, errors විතරක් එකතු කරනවා.',
    },
    {
      q: 'වෙනස් companies දෙකක, වෙනස් frameworks වලින් හදපු agents දෙකකට එකිනෙකා discover කරලා tasks හුවමාරු කරගන්න ඕනේ. ගැළපෙන protocol එක?',
      options: [
        'MCP, මොකද ඒක agent එකක් tools වලට connect කරනවා',
        'A2A, Agent Cards සහ task lifecycle එක්ක agent-to-agent communication',
        'OpenTelemetry',
        'JSON Schema',
      ],
      answer: 1,
      why: 'A2A = agent ↔ agent (horizontal), opaque remote agents, Agent Card discovery, tasks. MCP = agent ↔ tools/data. OTel = observability. JSON Schema = data structure විස්තර කරන්න.',
    },
    {
      q: 'Customer-facing agent එකක task එකක success rate p = 0.9යි. එකම task එක 3 පාරක් run කළාම 3 පාරම සාර්ථක වෙන සම්භාවිතාව (pass^3) ආසන්න වශයෙන් කීයද?',
      options: ['99.9%', '90%', '73%', '27%'],
      answer: 2,
      why: 'pass^k = p^k = 0.9 × 0.9 × 0.9 = 0.729 ≈ 73%. 99.9% කියන්නේ pass@3 (අඩුම එක පාරක් හරි) = 1 − 0.1³. Customer-facing agents වලට consistency (pass^k) වැදගත්.',
    },
    {
      q: 'Agent eval එකක final answers 95%ක් හරි. ඒත් logs වල සමහර runs අනවශ්‍ය refund API calls කරලා. මේක අල්ලගන්න ඕනේ evaluation එක?',
      options: [
        'BLEU score',
        'Perplexity',
        'Trajectory evaluation (tool calls, arguments, unsafe/unnecessary actions)',
        'Final answer exact match විතරක්',
      ],
      answer: 2,
      why: 'Outcome-only metrics වලින් ගිය පාර පේන්නේ නෑ. Trajectory evaluation එකෙන් tool selection, arguments, අනවශ්‍ය හෝ අනතුරුදායක actions check කරනවා.',
    },
    {
      q: 'Human approval එකක් බලාපොරොත්තුවෙන් දවස් 2ක් pause වෙන්න පුළුවන් agent task එකක් Kubernetes එකේ run කරනවා. Pod restarts වලින් බේරෙන්න අත්‍යවශ්‍ය දේ?',
      options: [
        'Pod එකේ memory එකේ state තියාගෙන sticky sessions',
        'Durable execution: හැම step එකකටම පස්සේ state එක Postgres වගේ external store එකක checkpoint කරලා resume කිරීම',
        'Temperature 0 දාන එක',
        'Bigger GPU එකක්',
      ],
      answer: 1,
      why: 'Long-running/HITL agents වලට state එක externalize කරලා checkpoint කරන්න ඕනේ. Pod එකේ memory එක restart එකකදී නැති වෙනවා. Temperature, GPU size මේ ප්‍රශ්නයට අදාළ නෑ.',
    },
    {
      q: 'Refund tool call එක timeout වුණා, refund එක වුණාද නැද්ද දන්නේ නෑ. Customer ට දෙපාරක් refund නොවී retry කරන්න හොඳම ක්‍රමය?',
      options: [
        'Retry කරන්න එපා, customer ට කියන්න ආයෙත් ඉල්ලන්න',
        'LLM එකෙන් අලුතෙන් decision එකක් ගන්න',
        'එකම idempotency key එකෙන් retry කරන්න, server එක duplicate එක හඳුනාගෙන පළමු result එක දෙනවා',
        'Timeout එක තත්පර 300ට වැඩි කරන්න',
      ],
      answer: 2,
      why: 'Timeout එකක් අපැහැදිලියි. Idempotency key එකෙන් එකම operation එක දෙපාරක් execute වෙන්නේ නැති බව සහතිකයි. LLM decision එක checkpoint කරලා tool execution එක විතරක් retry කරන්න.',
    },
    {
      q: 'LangGraph, CrewAI වගේ frameworks replace නොකර ඒවායින් හදපු agent workflow එකක් profile කරලා (tokens, latency per step) evaluate කරන්න NVIDIA tool එක?',
      options: ['NeMo Agent Toolkit', 'TensorRT-LLM', 'NCCL', 'cuDF'],
      answer: 0,
      why: 'NeMo Agent Toolkit (කලින් AgentIQ) framework-agnostic: වෙනස් frameworks වල agents wire කරලා profiling, evaluation, observability දෙනවා. TensorRT-LLM = inference engine, NCCL = GPU communication, cuDF = GPU dataframes.',
    },
    {
      q: 'Team එකක් AWS එකේ, code ලියන්නේ නැතුව PII masking, denied topics, RAG contextual grounding checks ඕනේ, ඒත් LLM එක EKS එකේ self-hosted NIM එකක්. හොඳම option එක?',
      options: [
        'Bedrock Guardrails පාවිච්චි කරන්න බෑ, මොකද ඒක Bedrock models වලට විතරයි',
        'ApplyGuardrail API එකෙන් NIM එකේ inputs/outputs Bedrock Guardrails වලින් check කරන්න',
        'Prompt එකේ "PII කියන්න එපා" කියලා ලියන්න',
        'Temperature අඩු කරන්න',
      ],
      answer: 1,
      why: 'ApplyGuardrail API එකෙන් ඕනෑම model එකක text එක Bedrock Guardrails වලින් evaluate කරන්න පුළුවන්. Custom dialog flows, execution rails, portability ඕනේ නම් NeMo Guardrails හොඳ විකල්පයක්.',
    },
    {
      q: 'Agent එකකට private customer data කියවන්න, web pages කියවන්න, emails යවන්න පුළුවන්. මේකේ ප්‍රධාන අවදානම සහ හොඳම architectural fix එක?',
      options: [
        'Hallucination. Bigger model එකක් ගන්න.',
        'Lethal trifecta නිසා indirect injection එකෙන් data exfiltration. එක හැකියාවක් ඉවත් කරන්න හෝ email යැවීමට human approval + recipient allow-list.',
        'Latency. Cache එකක් දාන්න.',
        'Bias. Fairness metrics මනින්න.',
      ],
      answer: 1,
      why: 'Private data + untrusted content + external communication එකට තිබුණොත් attacker ගේ web page එකකින් data පිටට යවන්න පුළුවන්. Prompt wording එකෙන් විසඳෙන්නේ නෑ. Capability එකක් කපන්න හෝ approval gates/allow-lists.',
    },
    {
      q: 'LangGraph එකේ interrupt() එකක් තියෙන node එකක් resume වුණාම ඒ node එකේ interrupt() එකට කලින් තියෙන code එකට මොකද වෙන්නේ, ඒකේ design බලපෑම මොකක්ද?',
      options: [
        'Node එක interrupt line එකේ ඉඳන්ම continue වෙනවා. Side effects ඕනෑම තැනක දාන්න පුළුවන්.',
        'Node එක මුල ඉඳන් re-run වෙනවා. ඒ නිසා side effects interrupt() එකට පස්සේ තියන්න, idempotent කරන්න.',
        'Graph එක මුළුමනින්ම මුල ඉඳන් run වෙනවා.',
        'Resume කරන්න බෑ, අලුත් thread එකක් ඕනේ.',
      ],
      answer: 1,
      why: 'LangGraph resume එකේදී interrupt වුණු node එක මුල ඉඳන් ආයෙත් execute වෙනවා (resume value එක interrupt() එකෙන් return වෙනවා). Interrupt එකට කලින් side effects තිබුණොත් ඒවා දෙපාරක් වෙනවා.',
    },
  ],
}
