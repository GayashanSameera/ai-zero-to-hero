export default {
  id: 'agentic-ai',
  number: 19,
  title: 'Agentic AI in Production (NCP-AAI)',
  titleSi: 'Designing and Operating Production Agentic AI for the NCP-AAI Exam',
  summary: 'Build on the agent loops, ReAct, memory, and MCP introduced in Phases 6 and 12. This phase covers production multi-agent patterns, framework selection, evaluation, scaling, NVIDIA NIM / NeMo / Blueprints, observability, safety, and human oversight. It follows the ten NCP-AAI (Agentic AI Professional) exam domains and maps the ideas to AWS.',
  duration: '6-8 weeks',
  topics: [
    // 1 ---------------------------------------------------------------- Architecture
    {
      id: 'ncp-aai-map-agent-vs-workflow',
      plain: "A workflow follows a developer-defined path; an agent lets a model choose some next actions. Both can call models and tools, so the difference is decision freedom, not whether an LLM appears.",
      internGuide: ["A workflow follows a developer-defined path; an agent lets a model choose some next actions. Both can call models and tools, so the difference is decision freedom, not whether an LLM appears.","Think of autonomy as a spectrum: fixed pipeline, conditional routing, model-selected tools, multi-step planning, and long-running goal pursuit. More autonomy increases flexibility and failure modes.","Use the least autonomy that meets the need. Stable business rules belong in code; uncertain language decisions may benefit from a model; irreversible actions need policy checks or approval.","Exam check: identify who chooses the next step, what state persists, which tools are permitted, and how the run stops or escalates."],
      si: 'ඔයාට කරන්න තියෙන වැඩේ හැම පාරම එකම පියවර නම් workflow එකක් හොඳයි. උදාහරණයක්ට, Colombo බස් ටිකට් එකක් බලන්න එකම පාරක් අනුගමනය කරනවා වගේ. පාර තෝරන්න ඕනේ වෙන්නේ customer ගේ ප්‍රශ්නය අනුව නම් agent එකක් ප්‍රයෝජනවත්. Rs. 100ක සරල වැඩකට Rs. 1,000ක් යන සංකීර්ණ agent එකක් හදන්න එපා.',
      title: 'NCP-AAI Map, Agent vs Workflow and the Autonomy Spectrum',
      body: [
        'NCP-AAI tests whether you can design an agent system that operates safely and cost-effectively for many production users, not simply whether you can build one. The exam weights are architecture and design 15%, development 15%, evaluation and tuning 13%, deployment and scaling 13%, cognition/planning/memory 10%, knowledge integration 10%, NVIDIA platform 7%, run/monitor 5%, safety 5%, and human oversight 5%. Architecture, development, evaluation, and deployment together account for about half of the marks. An AWS architect can connect these design concerns to familiar production systems.',
        'First ask whether the task needs an agent or a workflow. A workflow is a developer-defined path through LLM calls and tools, such as classify → retrieve → answer. An agent uses the LLM at runtime to choose which tool to call, how often, and when to stop. Workflows are more predictable, cheaper, and easier to test. Agents are more flexible, but their cost and latency are less predictable, and errors can compound; for example, ten steps that are each 95% reliable have a combined success probability of 0.95¹⁰.',
        'This is an autonomy spectrum, not an on/off choice: a single LLM call, then prompt chains and routing, then a single tool-calling agent, then multi-agent systems and long-running autonomous agents. In production, choose the lowest autonomy level that solves the problem. Use a workflow when the steps are known. Consider an agent when the steps depend on the input and the cost of a wrong action is low or a human check is available.',
        'For exam scenarios, ask three questions: Can you specify the task steps in advance? What would a wrong action cost, and can it be reversed? What is the latency budget? Extracting six fields from an invoice does not need an agent. Diagnosing and resolving an open-ended customer network problem may benefit from one.',
      ],
      analogy: 'A workflow is like a Colombo–Kandy bus: its route and stops are fixed, so the trip is relatively cheap and predictable. An agent is like a tuk-tuk driver who chooses a route after hearing “get me to Pettah quickly” and checking traffic. The tuk-tuk is flexible, but its fare and arrival time are less certain; not every trip needs one.',
      example: 'For “Is my SIM activated?” a telco can use a workflow: call check_sim_status(msisdn), then return a template answer. That is one LLM call, about 1.2 seconds, and Rs. 0.40. For “Why is my data running out quickly?”, an agent can inspect usage history, ask about background apps, compare packages, and suggest a plan: 5–9 LLM calls, 8–20 seconds, and Rs. 3–6. One system can use a router to send simple requests to workflows and complex requests to agents.',
      keyPoints: [
        'About half of NCP-AAI marks cover architecture, development, evaluation, and deployment.',
        'Workflow = developer-defined code path. Agent = the LLM chooses the path at runtime.',
        'Autonomy spectrum: single call → chain/router → tool-calling agent → multi-agent → long-running autonomous.',
        'Choose the lowest autonomy level that solves the problem.',
        'Known steps, the cost of an error, and the latency budget guide the design.',
      ],
      terms: [
        { en: 'Agentic Workflow', si: 'A pipeline with LLM calls and tools whose path is defined by the developer in advance.' },
        { en: 'Autonomous Agent', si: 'A system in which the LLM chooses the next action and when to stop.' },
        { en: 'Autonomy Spectrum', si: 'A range from a single model call to fully autonomous agents.' },
        { en: 'Reversibility', si: 'Whether an incorrect action can be undone; an important design risk factor.' },
      ],
    },
    // 2 ---------------------------------------------------------------- Architecture
    {
      id: 'multi-agent-orchestration-patterns',
      plain: "Start with one capable agent. Split into multiple agents only when specialization, isolation, parallel work, or independent ownership gives a measurable benefit.",
      internGuide: ["Start with one capable agent. Split into multiple agents only when specialization, isolation, parallel work, or independent ownership gives a measurable benefit.","A router selects one specialist. An orchestrator decomposes work and combines worker results. A supervisor observes workers and can redirect them. Hierarchies repeat these roles at several levels.","Define contracts for each role: allowed inputs, expected output schema, tools, time/cost budget, and failure behavior. Without contracts, extra agents often add latency and ambiguity.","Reliability check: trace delegation, cap fan-out and recursion, detect duplicate work, and evaluate the final task—not just whether agents produced fluent messages."],
      si: 'Single agent එකකට tools 10ක් වගේ තියෙද්දී එක domain එකක වැඩ හොඳට කරන්න පුළුවන්. වැඩේ වෙනස් specialistලාට බෙදන්න හෝ එකවර වැඩ කරන්න ඕනේ වුණොත් multi-agent බලන්න. Hospital එකක reception එක රෝගියා හරි කාමරයට යවනවා වගේ router එක වැඩ බෙදනවා. Supervisor කෙනෙක් test results බලලා ඊළඟ පියවර තීරණය කරනවා; එයාට summary එකක් දෙන්න, මුළු කතාවම නෙවෙයි.',
      title: 'Single vs Multi-Agent: Orchestrator-Worker, Router, Supervisor and Hierarchical Teams',
      body: [
        'A single agent has one system prompt, one tool list, and one loop. It is often enough for one domain with roughly 10–15 tools. Consider multiple agents when the tool set becomes too large and selection suffers, when different domains have conflicting instructions (such as billing and technical support), or when independent work can run in parallel to reduce latency. Otherwise, start with one agent: multiple agents add cost and latency, and errors can propagate.',
        'In the router pattern, a small, inexpensive model or classifier labels the request and sends it to the relevant specialist agent or workflow. The router dispatches; it does not do the task, so this is usually one extra hop. In the orchestrator-worker pattern, an LLM orchestrator breaks a task into runtime-selected subtasks, sends them to workers, and combines their results. This can suit research or code-change tasks.',
        'A supervisor resembles an orchestrator, but it stays in a loop: after a worker finishes, control returns to the supervisor, which chooses the next worker or step. Hierarchical teams add supervisors above other supervisors, such as a top-level supervisor delegating to a billing supervisor and then billing workers. Every level adds an LLM call and latency, so keep the hierarchy shallow unless it is justified.',
        'Centralized supervision makes debugging and policy enforcement easier, but the supervisor can become a bottleneck and a single point of failure. Its context can also grow as worker results arrive. Ask workers to return short, structured summaries rather than full transcripts to limit context growth and isolate sub-agent context.',
      ],
      analogy: 'A hospital OPD reception desk routes a patient with stomach pain to room 5 and an eye problem to room 9; it does not treat them. A supervisor is like a ward consultant who assigns tests to house officers and decides what to do when results arrive. A hierarchy is like a hospital director, then consultants, then house officers.',
      example: 'In telco support, an 8B router taking about 150 ms classifies 1,000 requests: 55% billing, 30% technical, 10% sales, and 5% other. The billing agent has six tools and the technical agent has nine. A single agent given all 15 tools has 81% tool-selection accuracy; a router with specialists reaches 94%. About 3% of requests are misclassified, so a specialist can return a request to the router when it is outside its domain.',
      keyPoints: [
        'Start with one agent; add agents for tool overload, conflicting domains, or useful parallelism.',
        'A router classifies and dispatches; it does not perform the task.',
        'An orchestrator creates runtime subtasks, delegates them, and synthesizes results.',
        'A supervisor regains control after each worker; a hierarchy adds supervisors at multiple levels.',
        'Workers should return concise summaries rather than full transcripts.',
      ],
      terms: [
        { en: 'Router Pattern', si: 'A pattern that classifies an input and sends it to a suitable agent or workflow.' },
        { en: 'Orchestrator-Worker', si: 'A pattern where an orchestrator creates dynamic subtasks, assigns workers, and combines their results.' },
        { en: 'Supervisor Pattern', si: 'A centralized pattern where control returns to the supervisor after each worker step.' },
        { en: 'Hierarchical Agents', si: 'Several supervisor levels for larger systems; each level adds latency.' },
        { en: 'Single Point of Failure', si: 'A component whose failure can bring down the whole system.' },
      ],
    },
    // 3 ---------------------------------------------------------------- Architecture
    {
      id: 'swarm-handoff-blackboard',
      plain: "In a handoff or swarm pattern, the active agent transfers control and relevant context to another specialist. Ownership must be explicit so two agents do not act at once.",
      internGuide: ["In a handoff or swarm pattern, the active agent transfers control and relevant context to another specialist. Ownership must be explicit so two agents do not act at once.","A blackboard pattern uses a shared store where agents post facts or partial results. It needs schemas, provenance, concurrency control, and rules for accepting or replacing entries.","Sequential pipelines make dependencies clear; parallel pipelines reduce elapsed time only for independent branches and require a deterministic merge step.","Choose from data dependencies and control needs. Add termination conditions, budgets, idempotent actions, and conflict handling before adding more agents."],
      si: 'Handoff pattern එකේ active agent එකම වැඩේ ඊළඟ specialist ට දෙන්න පුළුවන්. එකම agents දෙන්නා තුන් පාරක් එහාට මෙහාට යනවා නම් loop limit එකක් දාන්න. Blackboard එක කියන්නේ හැම specialist කෙනෙක්ම update දාන පොදු board එකක් වගේ. Colombo, Kandy, Galle weather එක එකවර බලනවා නම් parallel ක්‍රමයේ ගතවෙන්නේ වැඩිම කාලය වන තත්පර 6යි.',
      title: 'Decentralized Patterns: Swarm / Handoff, Blackboard, Sequential and Parallel Pipelines',
      body: [
        'In a handoff (swarm) pattern there is no central supervisor: the active agent passes control directly to another agent, for example by calling transfer_to_billing. The new agent then talks to the user. OpenAI Agents SDK handoffs and swarm-style LangGraph graphs are examples. Direct transfer can reduce latency and make a conversation feel natural, but agents can ping-pong; set a handoff limit and keep handoff history in state.',
        'With a blackboard pattern, agents do not message one another directly. They read and write a shared workspace, such as shared state or a database, while a control component decides who acts next. This loosely couples agents and makes it easier to add specialists, but concurrent writes can conflict. Use versioned writes and clearly assign ownership of fields.',
        'Two basic patterns are sequential pipelines and parallel fan-out/fan-in. In a sequential pipeline, agent A’s output becomes agent B’s input, such as researcher → writer → reviewer. In parallel work, independent subtasks run together and their results are aggregated; total latency is close to the slowest branch, not the sum. An ensemble can also ask several agents for answers and choose a majority, as in debate or self-consistency approaches.',
        'Choose by task structure: fixed ordered steps → sequential; independent subtasks → parallel; one specialist selected by input → router; runtime-selected subtasks → orchestrator-worker or supervisor; work passed between domains → handoff; many specialists contributing to shared work → blackboard.',
      ],
      analogy: 'A handoff is like sending a bank customer from one counter to another: “For a loan, go to counter 4.” The counter 4 staff member takes over the conversation. If counters keep sending the customer back and forth, that is a ping-pong loop. A blackboard is like a police case board where detectives post findings for everyone to read instead of speaking directly to one another.',
      example: 'A handoff guard can store active_agent = "billing" and handoff history such as ["triage→billing", "billing→tech"]. Escalate to a human after three handoffs or when the same pair occurs twice. In a travel agent, flight search takes 4 seconds, hotel search 6, and weather 1. Running sequentially takes 11 seconds; running in parallel takes 6 seconds, the slowest branch.',
      keyPoints: [
        'Handoff/swarm has no central supervisor; the active agent passes control directly. Add loop guards.',
        'Blackboard communication uses shared state: loosely coupled, but concurrent writes can conflict.',
        'Sequential = A → B → C. Parallel = fan-out/fan-in; latency follows the slowest branch.',
        'Choose a pattern for the task structure, not because it is fashionable.',
      ],
      terms: [
        { en: 'Handoff', si: 'The active agent gives conversation control to another agent.' },
        { en: 'Swarm', si: 'A decentralized pattern where agents work through handoffs without a central supervisor.' },
        { en: 'Blackboard Architecture', si: 'A pattern where agents coordinate by reading and writing to a shared workspace.' },
        { en: 'Fan-out / Fan-in', si: 'Splitting work into parallel tasks and then collecting their results.' },
        { en: 'Ping-pong Loop', si: 'A failure where two agents repeatedly hand work back and forth.' },
      ],
    },
    // 4 ---------------------------------------------------------------- Architecture
    {
      id: 'agent-communication-mcp-a2a',
      plain: "Ordinary in-process agents can exchange typed messages or shared state. Across systems, protocols provide discovery and interoperability but do not replace authorization or business logic.",
      internGuide: ["Ordinary in-process agents can exchange typed messages or shared state. Across systems, protocols provide discovery and interoperability but do not replace authorization or business logic.","MCP uses a host-client-server architecture to expose tools, resources, and prompts. It mainly connects an AI application to capabilities and context.","A2A lets independent agents advertise capabilities with an Agent Card and exchange messages, tasks, status, and artifacts. It is aimed at agent-to-agent delegation.","Security check: authenticate peers, authorize each capability, validate content, keep secrets out of messages/cards, log provenance, and treat remote output as untrusted."],
      si: 'Agents එකිනෙකාට message යවන්නත්, එකම shared state එක කියවලා ලියන්නත් පුළුවන්. MCP කියන්නේ agent එකට tools සහ data සම්බන්ධ කරන protocol එකක්. A2A කියන්නේ වෙනස් ආයතනවල agents එකිනෙකාට task දෙන්න භාවිතා කරන protocol එකක්. උදාහරණයක්ට, Colombo telco agent එකක් bank agent එකෙන් Rs. 2,500 bill එකක් ගෙවන්න ඉල්ලනවා; bank agent එකට අවශ්‍ය නම් තමන්ගේ MCP tool එකෙන් payment කරයි.',
      title: 'How Agents Communicate: Messages, Shared State, MCP and the A2A Protocol',
      body: [
        'Agents exchange information through message passing or shared state. Messages can be natural language or structured JSON; conversation-oriented frameworks such as AutoGen use messages. With shared state, agents read and update a typed object; for example, LangGraph nodes return state updates that a reducer merges. In production, schema-validated structured messages are easier to validate, log, and test than free text.',
        'MCP (Model Context Protocol), introduced in Phases 6 and 12, connects an agent to tools and data. An MCP client in the host application connects to MCP servers over JSON-RPC to access tools, resources, and prompts. Remember MCP as the agent-to-tool, or vertical, connection.',
        'A2A (Agent2Agent) is an open protocol introduced by Google in 2025 and now under the Linux Foundation. It lets agents built with different vendors and frameworks collaborate across an agent-to-agent, or horizontal, connection. An Agent Card describes an agent, its skills, endpoint URL, and authentication requirements so others can discover it. A Task has lifecycle states such as submitted, working, input-required, completed, and failed; Messages and Artifacts carry task communication and output. A2A uses JSON-RPC over HTTP(S), with streaming (SSE) and push notifications for longer tasks. A remote agent is opaque: its prompts, tools, and memory are not exposed.',
        'MCP and A2A complement each other. For example, a telco support agent can ask a bank payment agent through A2A to pay a customer’s Rs. 2,500 bill; the bank agent can use an MCP server internally to access its banking system. Within an organization, shared state or framework-native messaging may fit. Across organizational or vendor boundaries, consider a standard protocol such as A2A; use MCP to connect agents to tools and data.',
      ],
      analogy: 'MCP is like standard plugs connecting a shop cashier to a barcode scanner, card terminal, and cash drawer: agent to tools. A2A is like a standard purchase-order format between two shops. Keells need not know what happens inside its supplier’s warehouse; it can track statuses such as submitted, packing, and delivered.',
      example: 'An A2A Agent Card might describe a LankaPay Bill Agent, its bill-payment skill, an endpoint URL, and streaming support. A telco agent submits a task; it becomes “working,” then “input-required” when the bank agent needs an OTP. After the customer supplies it, the task completes with an artifact such as receipt R-77812 for Rs. 2,500.',
      keyPoints: [
        'Agents communicate through messages or shared state; use structured schemas in production.',
        'MCP connects an agent to tools and data (vertical): tools, resources, and prompts.',
        'A2A connects agents across vendors and frameworks (horizontal): Agent Cards, task lifecycle, messages, and artifacts.',
        'An A2A remote agent is opaque; its internals are not shared.',
        'MCP and A2A can be used together.',
      ],
      terms: [
        { en: 'Message Passing', si: 'A communication method where agents send messages to one another.' },
        { en: 'Shared State', si: 'A common state object that every agent can read and update.' },
        { en: 'State Reducer', si: 'A rule for merging updates from multiple nodes to one state field, such as appending to a list.' },
        { en: 'A2A (Agent2Agent) Protocol', si: 'An open protocol for agents from different vendors to exchange tasks.' },
        { en: 'Agent Card', si: 'A JSON document describing an agent’s skills, endpoint, and authentication for discovery.' },
        { en: 'Artifact (A2A)', si: 'An output returned by a remote agent as the result of a task.' },
      ],
    },
    // 5 ---------------------------------------------------------------- Development
    {
      id: 'tool-calling-production',
      plain: "A tool is a controlled application operation described to the model with a clear name, purpose, and strict input schema. The model proposes a call; application code validates and executes it.",
      internGuide: ["A tool is a controlled application operation described to the model with a clear name, purpose, and strict input schema. The model proposes a call; application code validates and executes it.","Design narrow tools around user intentions. Use enums and required fields, distinguish read from write, return structured errors, and avoid one all-powerful execute-anything tool.","Parallel calls are safe only when independent. State-changing calls need ordering, idempotency keys, timeouts, retries that understand side effects, and confirmation for high-impact actions.","Test argument accuracy, permission enforcement, malformed output, prompt injection, duplicate calls, partial failure, and whether the final response faithfully reflects tool results."],
      si: 'Tool එකකට පැහැදිලි නමක්, කවදා භාවිතා කරන විස්තරයක්, සහ නිවැරදි JSON Schema එකක් දෙන්න. Colombo weather සහ Kandy weather එකටම බලන්න පුළුවන් නම් calls දෙක parallel කරන්න. Schema එකෙන් msisdn අංකයේ හැඩය හරිද බලන්න පුළුවන්, නමුත් අංකය ඇත්තද කියලා server එකෙන් තහවුරු කරන්න ඕනේ. NIM API එකට යන්න base_url එක වෙනස් කළත් tool execution එක තවම ඔයාගේ code එකේ වගකීමයි.',
      title: 'Tool and Function Calling for Production: Schemas, Tool Design, Parallel Calls, NIM and OpenAI-Compatible APIs',
      body: [
        'Phase 12 covered the function-calling sequence: the model requests a tool call, your code runs it, and you return the result. In production, design each tool with a clear verb-led name (get_bill, issue_refund), guidance on when to use it, a JSON Schema for types, enums, required fields, and patterns, and a clear statement about whether it is read-only or has side effects. Tool descriptions are part of the prompt, so version and test them like prompts.',
        'Choose useful tool granularity. Many tiny tools such as get_customer_name and get_customer_address increase calls and latency; one broad do_everything(query) tool makes behavior difficult to control and validate. Prefer tools that match one user intent. Return only necessary fields, keep results concise, and represent errors in a structured way such as {"retryable": true}; do not put a raw 5 MB JSON response into model context.',
        'Some APIs allow several tool calls in one turn, such as checking weather in Colombo and Kandy. The executor should run independent calls concurrently and return every result with its matching tool_call_id. The tool_choice parameter can allow the model to choose (auto), require a call (required/any), select a particular tool, or disable tools (none). Strict output modes and constrained decoding can help arguments match a schema, but they do not prove values are true; server-side validation is still required.',
        'NVIDIA NIM LLM microservices expose an OpenAI-compatible API such as /v1/chat/completions, so an OpenAI SDK client can use a NIM endpoint by changing base_url. Options include the hosted API catalog at build.nvidia.com and a self-hosted NIM container on your GPU. Tool-calling support varies by model, so check the model documentation. This can let the same agent code use a hosted endpoint in development and a NIM in your VPC in production. Amazon Bedrock offers a similar tool-use flow through toolConfig in its Converse API.',
      ],
      analogy: 'A tool description is like a call directory for a new employee. “Ravi — accounts” could send both refund and salary questions to Ravi. “Ravi handles refunds under Rs. 5,000; ask Nimali about salaries” makes the choice clearer.',
      example: 'A get_balance tool can require msisdn to match ^07[0-9]{8}$. If the model sends +94771234567, validation fails and the tool returns a structured invalid_msisdn error with a retryable hint. The model retries with 0771234567 and receives a balance of Rs. 342.50 expiring on 2026-11-15. Only about 30 tokens of result context are needed.',
      code: {
        lang: 'python',
        src: `import os, json
from openai import OpenAI
# NIM is OpenAI-compatible; only the base URL changes.
client = OpenAI(base_url="https://integrate.api.nvidia.com/v1",
                api_key=os.environ["NVIDIA_API_KEY"])
tools = [{"type": "function", "function": {
    "name": "get_balance",
    "description": "Returns prepaid balance in Rs. Read-only. Not for bill questions.",
    "parameters": {"type": "object", "required": ["msisdn"],
        "properties": {"msisdn": {"type": "string", "pattern": "^07[0-9]{8}$"}}}}}]
r = client.chat.completions.create(model="meta/llama-3.1-70b-instruct", tools=tools,
    messages=[{"role": "user", "content": "What is the balance for 0771234567?"}])
call = r.choices[0].message.tool_calls[0]   # The model requests the tool; it does not run it.
print(call.function.name, json.loads(call.function.arguments))`,
      },
      keyPoints: [
        'A good tool has a clear name, usage description, strict JSON Schema, and declared side effects.',
        'Match tool granularity to one user intent; return concise outputs and structured errors.',
        'Run independent parallel tool calls concurrently and return results with tool_call_id; tool_choice can be auto, required, none, or specific.',
        'Constrained decoding can make arguments schema-valid, not factually correct; validate server-side.',
        'NIM provides an OpenAI-compatible API; changing base_url can switch between hosted and self-hosted endpoints.',
      ],
      terms: [
        { en: 'JSON Schema', si: 'A standard for describing tool argument types, required fields, enums, and patterns.' },
        { en: 'tool_choice', si: 'An API parameter that controls whether and which tool the model may use.' },
        { en: 'Parallel Tool Calls', si: 'Requesting several independent tool calls in one model turn.' },
        { en: 'OpenAI-Compatible API', si: 'An API using the same request and response format as OpenAI, such as NIM or vLLM.' },
        { en: 'Bedrock Converse API', si: 'An AWS API for chatting with Bedrock models and using tools through toolConfig.' },
      ],
    },
    // 6 ---------------------------------------------------------------- Development
    {
      id: 'agent-frameworks-when-to-use',
      plain: "Frameworks provide different combinations of graphs, state, tools, memory, multi-agent patterns, evaluation, and deployment helpers. They do not make an unreliable design reliable automatically.",
      internGuide: ["Frameworks provide different combinations of graphs, state, tools, memory, multi-agent patterns, evaluation, and deployment helpers. They do not make an unreliable design reliable automatically.","Choose from requirements: durable graph execution, team-style collaboration, document/RAG integration, vendor SDK features, observability, supported models, and operating environment.","Build a small representative workflow before committing. Measure debugging clarity, checkpointing, cancellation, version stability, security controls, latency, and ease of testing.","Keep business tools and schemas framework-neutral where practical. This reduces migration cost as APIs and framework names evolve."],
      si: 'LangGraph හොඳට පාලනය කරන්න ඕනේ, දිගටම පවතින agent workflows වලට ගැළපෙනවා. LlamaIndex documents සහ RAG වැඩ වලට විශේෂයෙන් ප්‍රයෝජනවත්. CrewAI role තියෙන කණ්ඩායමක් ඉක්මනට demo කරන්න ලේසියි. NeMo Agent Toolkit එක framework එකක් මාරු නොකර profiling සහ evaluation කරයි; ඔයාගේ අවශ්‍යතාවයට ගැළපෙන tool එක තෝරන්න.',
      title: 'Agent Frameworks Compared: LangGraph, CrewAI, AutoGen, LlamaIndex, NeMo Agent Toolkit, Claude Agent SDK, OpenAI Agents SDK',
      body: [
        'Phase 6 introduced the frameworks; here the architect’s question is which one fits the use case. LangGraph represents an agent as a graph of nodes and edges with typed state. It supports cycles, conditional edges, checkpointers that save state after steps, interrupts for human review, and durable execution. It suits long-running, stateful production agents that need precise control flow, though it has a steeper learning curve.',
        'CrewAI assigns agents roles, goals, backstories, and tasks, then runs a crew sequentially or hierarchically. It is convenient for role-based multi-agent prototypes, while LangGraph offers finer control (CrewAI Flows support deterministic orchestration). Microsoft AutoGen uses agent conversations and is known for research and multi-agent experiments; Microsoft is directing new work toward Microsoft Agent Framework, so check project status before choosing it for a new production system. LlamaIndex is strong in data connectors, indexing, and query engines, making it suitable for data-heavy agents and agentic RAG over many documents; it also offers event-driven Workflows and agent abstractions.',
        'NVIDIA NeMo Agent Toolkit, formerly AgentIQ, is an open-source, framework-agnostic library; it complements rather than replaces LangGraph or CrewAI. It can connect agents and tools from different frameworks through YAML configuration and reusable functions, and provides profiling of tokens, latency, and bottlenecks, evaluation, and observability with OpenTelemetry exporters. It also supports MCP. In NVIDIA stacks such as NIM and Blueprints, it helps measure and optimize agents. For the exam, choose NeMo Agent Toolkit when asked to profile or evaluate workflows without replacing their framework.',
        'Provider SDKs offer their providers’ agent harnesses. Anthropic’s Claude Agent SDK powers Claude Code and includes file, shell, and web tools, permission modes, hooks, subagents, MCP, and context compaction; it can suit coding or computer-use agents that work with many tools over time. OpenAI Agents SDK provides agents, handoffs, input/output guardrails, sessions, and built-in tracing for handoff-style applications. First consider a direct API loop without a framework. Then choose LangGraph for control and durability, LlamaIndex for data/RAG, CrewAI for role-based prototypes, NeMo Agent Toolkit for NVIDIA-stack profiling/evaluation, or a provider SDK when its harness is desired. MCP servers can reduce tool lock-in.',
      ],
      analogy: 'Agent frameworks are ways to build a house. LangGraph is like following an architect’s plan block by block, with control over each wall. CrewAI is like a prefabricated house: quick to assemble, with more constrained design. LlamaIndex is a contractor specializing in libraries. NeMo Agent Toolkit is an inspector measuring where electricity and water are being wasted. Provider SDKs are a provider’s ready-to-move-in apartment.',
      example: 'For a seven-step bank KYC process with two human approvals that may take three days, consider LangGraph with a Postgres checkpointer. For a one-week researcher/writer/editor marketing demo, consider CrewAI. For questions over 40,000 policy PDFs, consider LlamaIndex. To find the source of a 40% latency increase in the KYC workflow, profile it with NeMo Agent Toolkit. For a coding agent that fixes repository bugs, consider Claude Agent SDK.',
      keyPoints: [
        'LangGraph = graph + typed state + checkpointers + interrupts for control and durability.',
        'CrewAI supports role-based crews and quick prototypes; AutoGen is a conversational multi-agent framework from Microsoft.',
        'LlamaIndex suits data- and RAG-heavy agents.',
        'NeMo Agent Toolkit, formerly AgentIQ, provides framework-agnostic wiring, profiling, evaluation, and observability.',
        'Claude Agent SDK and OpenAI Agents SDK are provider harnesses; first consider whether a framework is needed.',
      ],
      terms: [
        { en: 'Checkpointer (LangGraph)', si: 'A component that saves graph state after each super-step for resume, time travel, and human review.' },
        { en: 'CrewAI Process', si: 'How a crew runs tasks: sequentially or hierarchically with a manager agent.' },
        { en: 'NeMo Agent Toolkit', si: 'NVIDIA’s open-source toolkit, formerly AgentIQ, for connecting, profiling, evaluating, and observing agents and tools through YAML.' },
        { en: 'Agent Harness', si: 'A runtime that provides the loop, tools, permissions, and context management around a model.' },
        { en: 'Vendor Lock-in', si: 'A situation where dependence on one framework or provider makes switching difficult.' },
      ],
    },
    // 7 ---------------------------------------------------------------- Cognition
    {
      id: 'reasoning-planning-strategies',
      plain: "ReAct alternates model reasoning and tool observations. Plan-and-execute creates a plan then performs steps. Reflection critiques an attempt. Replanning updates the path after new evidence.",
      internGuide: ["ReAct alternates model reasoning and tool observations. Plan-and-execute creates a plan then performs steps. Reflection critiques an attempt. Replanning updates the path after new evidence.","Use planning when tasks have real dependencies; use direct execution for simple requests. Extra reasoning calls consume time and money and may amplify an incorrect assumption.","Keep hidden model reasoning separate from auditable execution state. Store the plan, chosen actions, evidence, and results without requiring private chain-of-thought.","Set limits on steps, tokens, tools, retries, and elapsed time. Evaluate task success and recovery on difficult cases rather than assuming a reasoning label guarantees quality."],
      si: 'ReAct එකේදී agent එක හැම tool result එකකට පස්සේ ඊළඟ පියවර තීරණය කරනවා; නොදන්නා network fault එකක් හොයද්දී ඒක වටිනවා. Plan-and-execute එකේ මුලින් route එක හදලා, පාර වැහුණොත් විතරක් වෙනස් කරනවා වගේ. A/L paper එකක් marking scheme එකෙන් බලනවා වගේ reflection එකටත් test එකක් හෝ validator එකක් ඕනේ. ලොකු model එක plan කරන්නත්, පොඩි model එක සරල පියවර කරන්නත් යොදාගෙන cost සසඳන්න.',
      title: 'Cognition and Planning in Production: ReAct vs Plan-and-Execute vs Reflection, Replanning and Reasoning Models',
      body: [
        'Phase 12 covered ReAct, plan-and-execute, ReWOO, LLMCompiler, and Reflexion. In production, ReAct’s Thought → Action → Observation loop adapts after every observation, which suits uncertain environments such as debugging where tool results determine the next step. It can require a large model call at each step, grow the history, and lose direction without an explicit plan.',
        'In plan-and-execute, a planner (often a larger model) first creates a step list and an executor (a smaller model or code) runs it. A replanner updates the plan when needed. This can reduce large-model calls, make progress easier to track, and allow a user to review the plan. If the plan relies on bad assumptions, define replanning triggers such as failed steps or unexpected results.',
        'Reflection or self-critique asks an agent to critique and improve its output or trajectory. It works best with an external signal such as failing tests, a tool error, a validator, or a judge score. Without a signal, asking the model to reconsider may not help and can change a correct answer into a wrong one. In production, use a generator-verifier loop (unit tests, schema or policy checks, or a judge) with a maximum number of rounds.',
        'Reasoning models can plan and check internally, so they may need less prompt scaffolding such as “think step by step,” but thinking tokens can add cost and latency. One pattern is to use a reasoning model for planning and difficult decisions and a smaller, faster model for simple tool execution and formatting. Set the thinking budget or effort for the task. NVIDIA Llama Nemotron reasoning models can be configured for reasoning through the system prompt.',
      ],
      analogy: 'ReAct is like finding an address in an unfamiliar town by asking at each junction and then choosing the next turn. Plan-and-execute is like following a route planned in advance and rerouting only when a road is closed. Reflection is like checking an A/L paper against a marking scheme; without an external standard, changing an answer because you are unsure can make it wrong.',
      example: 'In a network-fault test, ReAct averages seven steps and seven large-model calls, costs Rs. 9, and succeeds 82% of the time. A 70B planner with an 8B executor averages two large-model calls (a plan and one replan), costs Rs. 3.50, and succeeds 79%. A hybrid that checks plan validity after each step with a smaller model succeeds 84% at Rs. 4.20. Reflection can also trigger a rollback when a ping test fails after a configuration change.',
      keyPoints: [
        'ReAct adapts to uncertain environments but can require a large model call per step.',
        'Plan-and-execute can cost less and expose its plan for human review; define replanning triggers.',
        'Reflection is most useful with an external signal such as tests, validators, or judges.',
        'Reasoning models may need less scaffolding but incur thinking-token cost; route models by task.',
      ],
      terms: [
        { en: 'Replanning', si: 'Updating a plan when a step fails or new information arrives.' },
        { en: 'Verifier', si: 'Code, a test, or a model that checks whether an output is correct.' },
        { en: 'Reasoning Model', si: 'A model trained to generate thinking tokens before providing an answer.' },
        { en: 'Thinking Budget', si: 'The token or effort limit allocated to a reasoning model.' },
        { en: 'Model Routing', si: 'Sending a step to a larger or smaller model based on its difficulty.' },
      ],
    },
    // 8 ---------------------------------------------------------------- Memory
    {
      id: 'memory-architecture-production',
      plain: "Thread state is the information needed during one run or conversation. Long-term memory survives across threads and therefore needs stronger consent, access, retention, and deletion controls.",
      internGuide: ["Thread state is the information needed during one run or conversation. Long-term memory survives across threads and therefore needs stronger consent, access, retention, and deletion controls.","Episodic memory records events, semantic memory stores facts, and procedural memory captures reusable instructions. These labels help design stores but may overlap in real systems.","Do not append everything to the prompt. Retrieve only relevant, authorized items; summarize old context with provenance; resolve contradictions; and expire low-value information.","Test memory for precision, privacy, stale facts, cross-user leakage, prompt injection, deletion, and its effect on task success and token cost."],
      si: 'එක conversation එකේ messages සහ plan එක thread memory එකේ තියන්න; user කැමති භාෂාව වගේ දිගුකාලීන දේ වෙනම store කරන්න. Customer ගේ balance එක memory එකෙන් නෙවෙයි, account system එකෙන් අලුතින්ම බලන්න. Summary එකක් හදද්දී Rs. 2,500 වගේ වැදගත් මුදලක් අහිමි වෙන්න පුළුවන්, ඒ නිසා critical facts වෙනම field එකක තියාගන්න. ඔයාගේ memory එකට TTL, user delete කිරීම, සහ tenant වෙන්කිරීමත් සැලසුම් කරන්න.',
      title: 'Memory Architecture: Thread State vs Long-Term Stores, Episodic / Semantic / Procedural, Summarization and Memory Hygiene',
      body: [
        'Phase 12 introduced short- and long-term memory, semantic facts, episodic events, procedural skills, and MemGPT paging. In production, short-term or thread memory holds one conversation’s messages, tool results, and plan progress; LangGraph can save it under a thread_id with a checkpointer. Long-term memory spans threads and sessions and can hold preferences, past tickets, or learned procedures; LangGraph provides a Store with namespaces. Managed services such as AWS Bedrock AgentCore Memory can provide short- and long-term memory.',
        'For thread state, consider fast key-value stores such as Redis/ElastiCache or DynamoDB, or Postgres. For semantic search over long-term memories, consider vector stores such as pgvector, OpenSearch, or Milvus. Structured facts such as a package or language preference belong in a relational database as a system of record. Do not copy data that is already authoritative into memory; read it freshly through a tool to avoid stale balances.',
        'Long threads increase context-window pressure and cost. Options include a summary buffer (summarize older turns and keep recent turns verbatim), trimming tool results to needed fields, or compacting the full history into a structured summary when context approaches its limit. Summaries are lossy: preserve critical order IDs, amounts, and exact user requests in separate structured fields rather than only in prose.',
        'For production memory hygiene, do not write everything to memory. Extract useful facts with confidence and source information. Resolve conflicts using timestamps, for example when a newer dietary preference supersedes an older one. Guard against memory poisoning: do not treat user-provided claims such as “remember that I am an admin” as trusted instructions. Memory is personal data; provide access and deletion controls under applicable privacy requirements, set TTLs, and isolate tenants with user_id or tenant_id namespaces.',
      ],
      analogy: 'Thread memory is like a doctor’s notes for the current consultation; long-term memory is the patient’s hospital file. The doctor checks the lab system for the latest blood report instead of relying on memory. A summary is like a discharge note: concise, but precise about critical details such as medicine names and doses.',
      example: 'For customer 0771234567, a Redis thread record with a 24-hour TTL can hold 14 turns, a plan to check usage and compare packages, and a short summary of the complaint. Long-term storage can keep a semantic preference to speak Sinhala (source ticket T-551, updated 2026-09-02), an episodic router reset that resolved an issue in August 2026, and a procedural 4G router APN reset guide v3. Do not store the account balance there; fetch it fresh with get_balance.',
      keyPoints: [
        'Thread memory uses a checkpointer and thread_id; long-term memory can use a Store, vector DB, or managed service.',
        'Do not copy system-of-record data into memory; read it freshly through a tool.',
        'Summaries are lossy; keep critical facts in separate structured fields.',
        'Define write and conflict policies, defend against memory poisoning, set TTLs, support deletion, and isolate tenant namespaces.',
      ],
      terms: [
        { en: 'Thread', si: 'An identifier (thread_id) for the state of one conversation.' },
        { en: 'Long-term Memory Store', si: 'External storage for facts, episodes, and procedures across sessions.' },
        { en: 'Context Compaction', si: 'Compressing conversation history into a summary as the context window fills.' },
        { en: 'Memory Poisoning', si: 'An attack that places malicious content in memory to alter later agent behavior.' },
        { en: 'TTL (Time To Live)', si: 'The period before data expires or is automatically deleted.' },
        { en: 'System of Record', si: 'The authoritative, most accurate source for a piece of data, such as a billing database.' },
      ],
    },
    // 9 ---------------------------------------------------------------- Knowledge
    {
      id: 'knowledge-integration-agentic-rag-sql',
      plain: "Agentic RAG lets the system decide whether, where, and how to retrieve, but retrieval still needs query controls, citations, and evidence checks.",
      internGuide: ["Agentic RAG lets the system decide whether, where, and how to retrieve, but retrieval still needs query controls, citations, and evidence checks.","External APIs require typed adapters, authentication, rate-limit handling, and validation. SQL agents should prefer read-only credentials, approved schemas/views, query limits, and a safe execution layer.","For images, audio, or documents, preserve modality metadata and provenance; extraction errors can become confident downstream answers.","A reliable answer distinguishes retrieved evidence from model inference, cites the supporting source, and abstains or escalates when evidence is missing or conflicting."],
      si: 'සාමාන්‍ය RAG එක නියමිත search එකක් කරලා පිළිතුරු දෙයි; agentic RAG එකට තව සෙවිය යුතුද කියලා තීරණය කළ හැකියි. SQL agent එකකට database එක කියවන්න විතරක් දෙන්න, SELECT සහ LIMIT වගේ නීති පරීක්ෂා කරන්න. Colombo invoice එකක balance වගේ සංවේදී දත්ත ගැන model එකට තනියම විශ්වාස නොකර source tool එකෙන් බලන්න. Sinhala voice notes යොදාගන්නවා නම් ASR එකේ ගුණාත්මකභාවය සැබෑ audio වලින් පරීක්ෂා කරන්න.',
      title: 'Knowledge Integration: Agentic RAG, External APIs, SQL Agents and Multimodal Data',
      body: [
        'Classic RAG (Phases 6 and 13) follows a fixed retrieve → generate pipeline. In agentic RAG, retrieval is a tool: the agent decides whether to search, where to search (policy documents, FAQs, ticket history, or the web), whether to rewrite the query, whether results require another search, and whether to use multiple hops. Phase 13 also covers CRAG and self-RAG ideas in its Agentic RAG and GraphRAG topic. This can improve quality but adds retrieval calls, cost, and latency variability. Set a maximum number of rounds and allow the agent to say it could not find an answer.',
        'For external REST APIs, put a wrapper tool in front rather than exposing raw HTTP access. Keep authentication secrets out of model context and inject them in the tool layer. Make calls with the user’s delegated identity or OAuth on-behalf-of rather than a superuser key. Treat API responses as untrusted data because they may carry indirect prompt injection. MCP servers can provide a standard wrapper layer.',
        'A text-to-SQL agent converts natural-language questions into SQL. Use a read-only database user or replica, allow-list tables and views, isolate tenants with row-level security, parse and validate queries before running them (SELECT only, mandatory LIMIT), and set timeouts. Provide schema descriptions and example queries. An error can be returned as an external signal for correction. SQL suits aggregation and counting; RAG suits unstructured text, so a hybrid agent can offer both as tools.',
        'Agents may receive screenshots, scanned bills, router photos, or voice notes. Send images directly to a vision-language model, or use OCR and table extraction during ingestion and index the text; NeMo Retriever extraction tools can extract PDF tables and charts. For voice, use ASR (speech-to-text, such as NVIDIA Riva) → agent → TTS. Test ASR quality on real Sinhala and Singlish audio because it may be a bottleneck.',
      ],
      analogy: 'Classic RAG is like a library assistant who brings one book. Agentic RAG is like a researcher who reads it, notices a gap, and searches for another journal. Giving an SQL agent read-only access is like giving a bank teller a screen to check balances but not a key to the vault.',
      example: 'Ask how many fiber complaints Kandy district had last month and the main cause. A read-only SQL tool counts 520 complaints and finds 312 cable cuts and 141 ONT faults. A RAG search finds incident NI-2210, which links many cable cuts to Peradeniya road works. The agent reports that 60% were cable-cut complaints; the SQL user can query only the v_complaints view.',
      keyPoints: [
        'Agentic RAG makes retrieval a tool; the agent chooses when and where to search. Set a round limit and permit “I don’t know.”',
        'For external APIs, use wrapper tools, hide secrets from the model, delegate user identity, and treat responses as untrusted.',
        'SQL agents need read-only access, allow-listed views, RLS, query validation, LIMIT, timeouts, and schema descriptions.',
        'For multimodal data, use a VLM directly or OCR/extraction at ingestion; voice flow is ASR → agent → TTS.',
      ],
      terms: [
        { en: 'Agentic RAG', si: 'A RAG method where retrieval is a tool the agent can choose to use.' },
        { en: 'Text-to-SQL', si: 'Converting a natural-language question into a SQL query.' },
        { en: 'Row-Level Security (RLS)', si: 'A database feature that limits rows by user or tenant.' },
        { en: 'Delegated Authorization', si: 'Making API calls only with the user’s permissions, such as OAuth on-behalf-of.' },
        { en: 'Vision-Language Model (VLM)', si: 'A model that can understand both images and text.' },
        { en: 'ASR / TTS', si: 'Speech-to-text and text-to-speech, the two sides of voice agents.' },
      ],
    },
    // 10 --------------------------------------------------------------- Evaluation
    {
      id: 'agent-evaluation-metrics',
      plain: "Begin with end-to-end task success on a representative dataset. A correct-looking final answer is insufficient if the agent used an unsafe action or unsupported evidence.",
      internGuide: ["Begin with end-to-end task success on a representative dataset. A correct-looking final answer is insufficient if the agent used an unsafe action or unsupported evidence.","Evaluate the trajectory too: tool choice, arguments, ordering, recovery, citations, policy compliance, and unnecessary steps. Use deterministic checks where possible.","LLM judges can scale rubric scoring but have bias and variance. Calibrate them against human labels, hide irrelevant identity/order signals, and retain spot checks.","Report quality with latency, tokens, tool/API cost, failure categories, and repeated-run metrics such as pass@k or pass^k—whose meanings differ and must be stated."],
      si: 'Agent එකේ අවසාන පිළිතුර විතරක් නොබලා, database එකේ Rs. 2,500 refund එක ඇත්තටම වුණාද කියලාත් බලන්න. එතනට ගෙනා tool calls සහ arguments පරීක්ෂා කිරීම trajectory evaluation එකයි. 90% success කියලා පමණක් මදි; එක් task එකට Rs. 40 යනවා නම් ඒ වියදමත් මනින්න. p = 0.9 නම් එකම වැඩය හතරම වරක් හරියන pass^4 අගය 0.9⁴ ≈ 66%යි.',
      title: 'Evaluating Agents: Task Success, Trajectory Eval, Tool-Call Accuracy, LLM-as-Judge, Cost and Latency per Task, pass^k',
      body: [
        'Evaluating an agent is harder than evaluating a chatbot because an agent produces a sequence of actions and changes world state, not just text. Measure three levels: (1) final outcome or task success, ideally by checking environment state (such as whether the refund record exists in the database), not just the answer; (2) trajectory, including needed tools, unnecessary or unsafe actions, and step count; and (3) individual components such as tool calls, retrieval, and routing.',
        'Tool-call metrics include tool-selection accuracy, argument accuracy (schema-valid and semantically correct), unnecessary-call rate, and invalid-call rate. Trajectory matching may be exact, in-order, or any-order. Exact matching can be too strict when several paths are valid, so rubric-based trajectory evaluation is also common.',
        'For LLM-as-judge, provide the trajectory and a rubric as well as the final answer: Did the agent follow policy? Did the refund amount match the tool result? Did it make a false promise? Validate judge agreement against human labels. Simulated users use an LLM persona for multi-turn conversations, as in benchmark patterns such as tau-bench. Measure cost per task in Rs., tokens, p50/p95 latency, and steps; a 90% success rate may not be viable at Rs. 40 per task.',
        'LLM agents are nondeterministic. pass@k asks whether at least one of k runs succeeds, often for code generation. pass^k asks whether all k runs succeed, measuring consistency and important for customer-facing agents. If p = 0.9, pass^1 is 90% and pass^4 ≈ 0.9⁴ ≈ 66%. Run a regression suite of golden tasks—normal, edge, adversarial/injection, and past production failures—in CI for every prompt, model, or tool change; block releases that fall below baseline. Tune by clustering failures, changing prompts/tools/routing/models, running regression tests, then A/B testing.',
      ],
      analogy: 'Think of a driving test. Outcome evaluation asks whether you reached the destination; trajectory evaluation asks whether you ran red lights or drove on the wrong side. Reaching the destination does not excuse unsafe driving. pass^k asks for reliable driving across repeated attempts, not just one good trip.',
      example: 'A golden set has 200 tasks—80 billing, 70 technical, 30 sales, and 20 injection tests—each run four times. Results: 88% task success by database state, 61% pass^4, 95% tool-selection accuracy, 91% argument accuracy, 0.8 unnecessary calls per task, Rs. 4.10 average cost, and 14-second p95 latency. Two injection cases attempted a refund call; an approval gate blocked them, and both were marked must-fix regression cases. Prompt v8 improves success from 88% to 91% but raises cost from Rs. 4.10 to Rs. 4.60, a trade-off for the product owner.',
      code: {
        lang: 'python',
        src: `def evaluate(agent, tasks, k=4):
    report = []
    for t in tasks:
        runs = [agent.run(t.input, sandbox=t.make_env()) for _ in range(k)]
        ok = [t.check_env_state(r.env) for r in runs]       # outcome: env state check
        tools_ok = [t.expected_tools <= set(r.tools_called) for r in runs]  # trajectory
        report.append({"id": t.id,
            "pass_1": sum(ok) / k,                 # Mean success across runs.
            "pass_hat_k": all(ok),                 # pass^k: all k runs succeed.
            "tools_ok": sum(tools_ok) / k,
            "cost_rs": sum(r.cost_rs for r in runs) / k})
    return report  # Block the release in CI if it falls below baseline.`,
      },
      keyPoints: [
        'Measure outcome (environment state), trajectory (action path), and steps/components.',
        'Track tool selection and argument accuracy, unnecessary/invalid calls, and strict/in-order/any-order trajectory matches.',
        'Give judges the trajectory and a rubric; validate against human labels. Use simulated users for multi-turn tests.',
        'Measure cost, tokens, latency, and steps per task.',
        'pass^k measures consistency (p^k); use a regression suite as a CI gate.',
      ],
      terms: [
        { en: 'Task Success Rate', si: 'The percentage of tasks that the agent actually completes.' },
        { en: 'Trajectory Evaluation', si: 'Evaluating the sequence of agent actions, tools, arguments, and their order.' },
        { en: 'Tool Selection Accuracy', si: 'The percentage of tool calls that select the correct tool.' },
        { en: 'pass^k', si: 'The probability that all k runs of the same task succeed; a consistency measure.' },
        { en: 'User Simulator', si: 'An LLM that behaves like a customer in agent tests.' },
        { en: 'Regression Suite', si: 'A set of golden tasks run for every change to check that previously correct behavior still works.' },
      ],
    },
    // 11 --------------------------------------------------------------- Deployment
    {
      id: 'deployment-state-durability',
      plain: "A stateless request can be retried independently; a stateful agent carries checkpoints, messages, approvals, and tool results across time. Long tasks need durable state outside one process.",
      internGuide: ["A stateless request can be retried independently; a stateful agent carries checkpoints, messages, approvals, and tool results across time. Long tasks need durable state outside one process.","Represent a run as explicit states and events. Persist before and after side effects so a worker restart can resume without repeating a payment, email, or ticket creation.","Queues absorb bursts; leases prevent two workers owning one step; timeouts stop hangs; dead-letter handling isolates repeated failures; cancellation must propagate.","Retries require idempotency keys and classified errors. Test crashes at every boundary, delayed approvals, duplicate delivery, version upgrades, and replay."],
      si: 'Agent service එකේ state එක pod memory එකේ නොතියා Redis හෝ Postgres වගේ external store එකක තියාගන්න. දවස් දෙකක් approval එකක් බලා ඉන්න task එක crash වුණත් checkpoint එකෙන් ආයෙත් පටන් ගන්න පුළුවන්. Rs. 1,500 refund එකක් retry වුණත් දෙවරක් නොයන්න idempotency key එකක් භාවිතා කරන්න. දිග වැඩ SQS queue එකකින් workerට දෙන්න; timeout සහ retry limit එකත් සැලසුул.',
      title: 'Deploying Agents: Stateless vs Stateful, Durable Execution, Queues, Timeouts, Retries and Idempotency',
      body: [
        'When deploying an agent service, first decide where state lives. A stateless server loads state from an external store such as Redis, DynamoDB, or Postgres, handles the request, and saves updates without relying on instance memory. Any instance can serve a request, horizontal scaling is easier, and a pod failure does not erase the state. In-memory stateful agents need sticky sessions and can lose conversations on pod restart. A common production default is stateless compute with externalized state.',
        'Agent tasks may take minutes or hours, or days while awaiting human approval. Durable execution persists progress after steps and resumes from the latest checkpoint after failure, rather than starting over. Options include LangGraph checkpointers (for example, Postgres), durable workflow engines such as Temporal, and AWS Step Functions with callback task tokens for human approvals. A resumed step may run again, so side effects need idempotency.',
        'For work longer than a quick chat response, such as analyzing six months of bills, put the request on a queue such as SQS or Kafka and return an HTTP 202 response with a task_id. Workers process it; the UI can show progress through streaming, WebSockets, or polling. Queues absorb load spikes and provide backpressure for LLM rate limits. Send failed tasks to a dead-letter queue. Set the SQS visibility timeout longer than the maximum task duration to avoid duplicate processing.',
        'Set timeouts at every layer (LLM, tool, and whole task), with outer limits longer than inner limits. Retry only transient failures such as 429, 503, or timeouts, using exponential backoff with jitter and a maximum attempt count; retrying a 400 validation error will not help. Give side-effect tools an idempotency key such as task_id + step_id, and have the server return the original result for a duplicate key. Since retrying an LLM call may produce a different decision, checkpoint the tool-call decision and retry only tool execution.',
      ],
      analogy: 'A stateless server is like any bank teller who can help because the account is in a central system. Durable execution is like a passport application file marked “stage 3 complete,” so the next officer can begin at stage 4. An idempotency key is like a cheque number that prevents the same cheque from being deposited twice.',
      example: 'A bill-analysis request returns HTTP 202 with task_id T-9001. SQS visibility timeout is 15 minutes and the task maximum is 10 minutes. A worker crashes at step 4; another worker receives the message and resumes from the checkpoint. If step 4 retries send_sms with idempotency key T-9001-s4, the gateway recognizes the message was already sent, so the customer does not receive two SMS messages. A 429 from Bedrock/NIM is retried after 1, 2, and 4 seconds plus jitter; after three attempts, send it to the DLQ and alert.',
      keyPoints: [
        'Production default: stateless compute with external state in Redis, DynamoDB, or Postgres.',
        'Durable execution persists each step and resumes after a crash from a checkpoint; options include LangGraph, Temporal, and Step Functions.',
        'Long tasks use a queue, HTTP 202, task_id, workers, and a DLQ; visibility timeout must exceed the task maximum.',
        'Set timeouts at each layer; retry transient errors only, with backoff and jitter.',
        'Protect side effects with idempotency keys; checkpoint decisions and retry execution.',
      ],
      terms: [
        { en: 'Stateless Service', si: 'A service that keeps no request data in instance memory and stores state externally.' },
        { en: 'Durable Execution', si: 'The ability to resume a workflow from its last persisted step after a failure.' },
        { en: 'Dead-Letter Queue (DLQ)', si: 'A separate queue for messages that still fail after retries.' },
        { en: 'Exponential Backoff + Jitter', si: 'Increasing retry delays exponentially and adding a random interval.' },
        { en: 'Idempotency Key', si: 'A unique key that prevents the same operation from taking effect twice.' },
        { en: 'Visibility Timeout (SQS)', si: 'The period when a received SQS message is hidden from other workers.' },
      ],
    },
    // 12 --------------------------------------------------------------- Deployment
    {
      id: 'scaling-cost-control',
      plain: "Measure demand as tasks, model calls, tokens, and tool calls—not merely HTTP requests. One agent task may fan out into many expensive operations.",
      internGuide: ["Measure demand as tasks, model calls, tokens, and tool calls—not merely HTTP requests. One agent task may fan out into many expensive operations.","Control concurrency per tenant and dependency, honor provider rate limits, apply backoff with jitter, and use queues for bursts. Autoscale on backlog and service latency where useful.","Reduce cost with prompt/context trimming, safe caching, smaller-model routing, batching where supported, and early stopping. Cache keys must include permissions and relevant versions.","Set per-run and per-tenant budgets, expose cost and latency in traces, and degrade gracefully when a model, tool, or quota is unavailable."],
      si: 'Agent task එකකට LLM calls 6ක් නම්, users 100ක් කියන්නේ calls 600ක් විය හැකියි; rate limit සහ queue එකක් දාන්න. Package catalog වගේ ස්ථාවර දත්ත cache කරන්න, නමුත් customer balance එක cache කරලා පරණ තොරතුරු දෙන්න එපා. 50 tasks/sec × calls 6 = 300 calls/sec; replica එකක් 32 calls/sec කළොත් 300 ÷ 32 ≈ 10 replicas, buffer එකක් එක්ක 12ක්. Traffic කඩින් කඩ නම් serverless, නිතර ඉහළ නම් EKS/NIM සසඳන්න.',
      title: 'Scaling and Cost Control: Rate Limits, Concurrency, Caching, Model Routing, Autoscaling on EKS and Serverless',
      body: [
        'When scaling agents, the bottleneck is often the LLM rather than your API server. Hosted APIs such as Bedrock and build.nvidia.com have requests-per-minute and tokens-per-minute limits. Self-hosted NIM is constrained by GPU capacity, including KV cache and maximum concurrency. If each task makes 5–10 LLM calls, 100 users can generate 500–1,000 calls. Use a global token-bucket rate limiter, per-tenant/user quotas, a semaphore for concurrency, and queues for backpressure. Use backoff and a circuit breaker to avoid retry storms after 429 responses.',
        'Caching options include (1) prompt/prefix caching for stable system prompts and tool definitions to reduce input-token cost and TTFT, (2) TTL-based tool-result caching for infrequently changing data such as get_package_catalog, and (3) semantic caching that reuses answers for similar questions, which may suit FAQs but can leak one customer’s answer into another personalized response. Keep prefixes stable. Do not cache user-specific, fast-changing data such as balances.',
        'Measure and cap cost per task. Route simple steps to smaller models, set step and token budgets, trim tool outputs, compact context, and use batch APIs for scheduled work such as nightly reports. A well-utilized self-hosted NIM may cost less than per-token APIs; compare GPU-hour cost with tokens served per hour. Use per-tenant dashboards and alerts—a sudden rise to Rs. 200 for one customer’s tasks may indicate a runaway loop.',
        'On EKS, scale agent API and worker pods with HPA based on CPU/requests or KEDA based on SQS queue depth. For GPU nodes running NIM/Triton, consider Karpenter or Cluster Autoscaler and NVIDIA GPU Operator. Queue depth, KV-cache use, and request latency can be more useful scaling signals than GPU utilization alone. Nodes and model weights can take minutes to become ready, so keep minimum replicas and warm capacity. AWS Lambda has a 15-minute maximum execution time; use Step Functions or containers for longer tasks. Managed agent runtimes such as Amazon Bedrock AgentCore Runtime can host agents with session isolation. Spiky, low traffic may favor serverless and hosted APIs; steady, high traffic may favor EKS and self-hosted NIM.',
      ],
      analogy: 'A rate limit is like a Galle Face kottu stall that can cook only 20 plates at once. If 100 orders arrive, give queue tokens and serve them in order. Prefix caching is like chopping vegetables in advance. Semantic caching is like giving everyone who asks for plain kottu the same plate; it is unsafe to give one customer another customer’s personalized cheese kottu.',
      example: 'At peak, 50 tasks per second × 6 LLM calls = 300 calls per second. A NIM replica handles about 64 concurrent requests with a two-second average call, or about 32 calls per second by Little’s Law (64 ÷ 2). That suggests about 10 replicas (300 ÷ 32), or 12 with headroom. Routing simple steps to an 8B model reduces 70B calls from 300 to 110 per second, requiring about 4–5 70B replicas. Prefix caching saves 60% of input tokens; estimated cost per task falls from Rs. 6.20 to Rs. 2.90.',
      keyPoints: [
        'The LLM is often the bottleneck; use rate limits, quotas, concurrency limits, queue backpressure, and a circuit breaker.',
        'Cache stable prefixes and TTL-based tool results; use semantic caching cautiously, mainly for FAQs.',
        'Measure cost per task; use routing, step/token budgets, trimming, batch APIs, and per-tenant alerts.',
        'On EKS, use HPA/KEDA for agent pods and Karpenter plus GPU Operator for GPU nodes; keep warm capacity.',
        'Lambda runs for at most 15 minutes; use Step Functions, containers, or managed agent runtimes for longer tasks.',
      ],
      terms: [
        { en: 'Token Bucket', si: 'A rate-limiting algorithm that adds tokens at a set rate and spends a token for each request.' },
        { en: 'Circuit Breaker', si: 'A pattern that pauses calls to a failing downstream service to prevent cascading failures.' },
        { en: 'Semantic Cache', si: 'A cache that returns answers to similar questions based on embedding similarity.' },
        { en: 'KEDA', si: 'A Kubernetes autoscaler that scales pods using external metrics such as queue depth.' },
        { en: 'Karpenter', si: 'A Kubernetes node autoscaler that provisions suitable EC2 nodes, including GPUs, for pending pods.' },
        { en: 'Cost per Task', si: 'The total LLM and tool cost of completing one user task.' },
      ],
    },
    // 13 --------------------------------------------------------------- NVIDIA
    {
      id: 'nvidia-agentic-platform',
      plain: "NIM packages supported model inference behind standard APIs. It is a serving building block, not the agent planner or business workflow itself.",
      internGuide: ["NIM packages supported model inference behind standard APIs. It is a serving building block, not the agent planner or business workflow itself.","NeMo Agent Toolkit provides composable tools, agents, workflows, profiling, and evaluation integration; NeMo Guardrails applies conversational and action policies.","Nemotron refers to NVIDIA model families, while AI Blueprints are reference workflows/architectures. Product roles can overlap and evolve, so verify the versioned documentation.","Architecture check: label inference, orchestration, retrieval, guardrails, observability, and deployment separately instead of calling the entire application “NIM” or “NeMo.”"],
      si: 'NIM කියන්නේ model එකක් සහ inference engine එකක් API එකක් සමඟ container එකක deploy කරන ක්‍රමයක්. RAG agent එකකට NeMo Retriever embed/rerank, Milvus, සහ LLM NIM එකක් එකට යොදාගන්න පුළුවන්. Guardrails වලින් input, retrieved text, tool calls, output වෙන්ව පරීක්ෂා කරන්න. Blueprint එකක් Keells වගේ ව්‍යාපාරයකට ආරම්භක සැලැස්මක් දෙයි, ඒත් ඔයාගේ data සහ infrastructure අනුව වෙනස් කරලා deploy කරන්න.',
      title: 'NVIDIA Platform for Agents: NIM, NeMo Microservices, NeMo Guardrails, Nemotron and AI Blueprints (RAG, AI-Q)',
      body: [
        'Phase 9 introduced NIM: a container combining a model, an optimized inference engine such as TensorRT-LLM, vLLM, or SGLang, and a standard API, with production support under the NVIDIA AI Enterprise license. Agent architectures can use LLM NIMs for reasoning or chat (such as Llama Nemotron), NeMo Retriever NIMs for embeddings, reranking, and document extraction, safety NIMs for content safety, topic control, and jailbreak detection, and Riva for speech. As microservices, they can scale separately; for example, an embedding NIM may use part of a GPU while an LLM NIM uses several GPUs.',
        'NeMo microservices are Kubernetes-native services for improving agents over time through a data flywheel. NeMo Customizer supports fine-tuning methods such as LoRA; NeMo Evaluator evaluates models and pipelines, including LLM-as-judge; NeMo Guardrails can run as a service; and NeMo Retriever provides RAG pipelines. The approach is to curate production logs, customize a smaller model, and evaluate whether it can approach a larger model’s quality at lower cost. NVIDIA also provides a Data Flywheel blueprint.',
        'NeMo Guardrails, covered in Phase 10, is an open-source toolkit and microservice. Useful rails include input checks for jailbreaks, PII, and off-topic requests; retrieval checks to filter retrieved chunks; execution checks around tool/action calls; output checks for safety and grounding; and dialog rails that control conversation paths with Colang flows. It is LLM-provider-agnostic and can work with NIM, OpenAI-compatible APIs, and other providers.',
        'NVIDIA AI Blueprints are starting-point reference architectures for common use cases, with code, Helm charts or Docker Compose files, and documentation. The RAG Blueprint ingests PDFs—including text, tables, and charts—using NeMo Retriever extraction, embedding and reranking NIMs, a vector database such as Milvus, and an LLM NIM. The AI-Q Research Assistant blueprint builds on RAG with reasoning models and NeMo Agent Toolkit to plan research across enterprise data and, if needed, web search, then write a cited report. For the exam, remember that Blueprints are reference architectures to customize for your data and infrastructure, not finished universal deployments. They can be tried at build.nvidia.com or obtained from GitHub.',
      ],
      analogy: 'A NIM is like a ready-to-cook kottu kit with ingredients and a recipe in one box. A Blueprint is a plan for setting up the whole kottu shop, including the stove, cashier, and order queue. NeMo microservices are the kitchen team improving recipes from customer feedback. NeMo Guardrails are the shop’s security guard and food-safety inspector.',
      example: 'A telco knowledge agent starts from the RAG Blueprint and ingests 2,300 package-brochure PDFs, including tables, with NeMo Retriever. It embeds them into Milvus; at query time it retrieves 50 candidates, reranks them to five, and sends them to a Llama Nemotron LLM NIM. NeMo Guardrails block competitor comparisons or off-topic input and check output grounding. Large report requests such as Q3 complaint analysis go to an AI-Q-style research agent. After three months, the team fine-tunes an 8B model with NeMo Customizer and compares it with NeMo Evaluator.',
      keyPoints: [
        'NIM types include LLM, NeMo Retriever (embed/rerank/extract), NemoGuard safety, and speech; scale them independently.',
        'NeMo microservices include Customizer, Evaluator, Guardrails, and Retriever; the data flywheel is logs → customize → evaluate.',
        'NeMo Guardrails rails cover input, retrieval, execution (tools), output, and dialog (Colang).',
        'Blueprints are deployable reference architectures, including RAG Blueprint and AI-Q Research Assistant.',
        'NeMo Agent Toolkit can wire, profile, and evaluate agents in Blueprints.',
      ],
      terms: [
        { en: 'NVIDIA NIM', si: 'A deployable container with an optimized model, inference engine, and standard API.' },
        { en: 'NeMo Retriever', si: 'NVIDIA RAG components that include extraction, embedding, and reranking NIMs.' },
        { en: 'NemoGuard NIMs', si: 'Safety models packaged as NIMs for content safety, topic control, and jailbreak detection.' },
        { en: 'NVIDIA AI Blueprint', si: 'A use-case reference architecture with sample code, deployment files, and documentation.' },
        { en: 'AI-Q Research Assistant', si: 'An NVIDIA agent blueprint that researches enterprise data and the web and writes reports.' },
        { en: 'Data Flywheel', si: 'A cycle that uses production data to improve models and balance cost and quality.' },
      ],
    },
    // 14 --------------------------------------------------------------- AWS mapping
    {
      id: 'aws-nvidia-agent-stack',
      plain: "On AWS, separate choices by layer: model/inference service, agent orchestration, retrieval/data, guardrails, and compute platform. Bedrock and NVIDIA containers are alternatives at some layers, not one inseparable stack.",
      internGuide: ["On AWS, separate choices by layer: model/inference service, agent orchestration, retrieval/data, guardrails, and compute platform. Bedrock and NVIDIA containers are alternatives at some layers, not one inseparable stack.","NIM or Triton can run on supported SageMaker AI endpoints or GPU nodes in EKS; Bedrock supplies managed model and agent capabilities. Validate Region, model, container, and license availability.","NeMo Guardrails is application policy middleware; Bedrock Guardrails is an AWS-managed guardrail service. Compare supported checks, integration point, latency, logging, and portability.","Production check: use private networking and workload identity, protect secrets, trace cross-service calls, benchmark total task cost, and define fallback behavior."],
      si: 'AWS වල Bedrock යොදාගත්තොත් GPU පාලනය අවශ්‍ය නැහැ; model usage අනුව ගෙවයි. NIM on EKS නම් GPU nodes, drivers, model cache, scaling ඔයා කළමනාකරණය කරනවා, එනිසා steady traffic වල මිල සසඳන්න. Bedrock Guardrails ApplyGuardrail API එකෙන් NIM වගේ වෙනත් model එකක text එකත් පරීක්ෂා කළ හැකියි. Pilot එකට managed සේවාවෙන් පටන් ගෙන, usage වැඩිවුණාම වියදම සහ operations දෙකම ගණනය කරලා hybrid සැලැස්මක් බලන්න.',
      title: 'On AWS: RAG Agent with Tools on NIM or Bedrock, NIM / Triton on SageMaker AI or EKS, NeMo Guardrails vs Bedrock Guardrails',
      body: [
        'Option A is fully managed: Amazon Bedrock models, Converse API toolConfig, Bedrock Knowledge Bases for RAG, and Bedrock Guardrails. Run the agent loop in your own code on Lambda/ECS/EKS with a framework such as LangGraph, or use managed features such as Bedrock Agents (action groups, knowledge bases, and return of control) or Bedrock AgentCore building blocks (Runtime, Memory, Gateway, Identity, and Observability). You do not manage GPUs and pay per token. Option B runs NVIDIA NIM containers in your AWS VPC, giving you control over model choice and optimization; depending on traffic and operations costs, it may suit high, steady workloads. A hybrid is also common: Bedrock for the LLM and NIM embedding/reranking on EKS, or vice versa.',
        'For NIM/Triton deployment, SageMaker AI can host NIM through AWS Marketplace or a Triton container as a real-time endpoint, with SageMaker-managed autoscaling, monitoring, and IAM; this can be simpler for teams without Kubernetes experience. On EKS, use GPU node groups (G5/G6 for inference and P4d/P5 for larger models), NVIDIA GPU Operator for drivers, device plugin, and DCGM exporter, a NIM Helm chart or NIM Operator, and persistent model cache storage such as EFS/FSx to avoid downloading weights for every pod. Karpenter can manage GPU nodes; Prometheus and DCGM provide metrics. Choose EKS for finer control, multiple models, or GPU sharing (MIG). Since NIM is OpenAI-compatible, the agent can use an internal service URL as base_url.',
        'Amazon Bedrock Guardrails is an AWS-managed policy service with content filters (hate, insults, sexual content, violence, misconduct, and prompt attacks), denied topics, word filters, sensitive-information filters (PII masking/blocking and custom regex), contextual grounding checks for RAG, and Automated Reasoning checks. It works directly with Bedrock models or through ApplyGuardrail to check input/output text from any model, including NIM. It is configuration-driven and does not require writing guardrail code. NeMo Guardrails is open-source and programmable, with Colang dialog flows, Python custom actions, execution rails, tool-call checks, self-hosted NemoGuard models, and cloud/on-prem deployment. Bedrock is managed and AWS-native but has more limited configuration; NeMo is flexible but must be hosted and maintained. They can also be layered.',
        'A reference AWS RAG agent can use API Gateway → an EKS agent service (such as LangGraph) → an LLM through Bedrock Converse or NIM on EKS. Tools can include rag_search with OpenSearch Serverless/Knowledge Bases or Milvus plus NeMo Retriever NIMs, and get_bill/get_usage through internal APIs behind MCP servers. Store checkpoints in DynamoDB/ElastiCache, use Bedrock ApplyGuardrail or a NeMo Guardrails sidecar, and send OpenTelemetry to CloudWatch/X-Ray or Langfuse. Grant least-privilege tool access with IRSA/EKS Pod Identity and keep API keys in Secrets Manager.',
      ],
      analogy: 'Bedrock is like a hotel buffet: prepared food is ready and you pay per plate without running the kitchen. NIM on EKS is like your own kitchen with ready-made recipe kits: more setup, but you control the recipes and may lower costs when serving 500 people every day. Bedrock Guardrails are the hotel’s standard security; NeMo Guardrails are a security system you design and operate yourself.',
      example: 'Suppose traffic is 20,000 tasks per day, with 120,000 LLM calls and 3,000 average tokens per task: 360 million tokens daily. Compare Bedrock’s per-token cost with four g6 GPU nodes on EKS running 24/7, including operations-team costs. Self-hosted NIM may be cheaper at sustained utilization above 60%, but verify with current pricing. A pilot could launch with Bedrock and Bedrock Guardrails in two weeks, then move embedding/reranking NIMs to EKS as usage grows and add NeMo dialog rails for refund flows. Use the AWS pricing calculator because prices change.',
      keyPoints: [
        'Managed: Bedrock + Converse toolConfig + Knowledge Bases + Guardrails + Agents/AgentCore.',
        'Run NIM on AWS through a SageMaker AI endpoint or EKS with GPU Operator, Helm/NIM Operator, Karpenter, and model cache.',
        'Bedrock Guardrails provides managed content, topic, PII, grounding, and reasoning policies; ApplyGuardrail supports any model.',
        'NeMo Guardrails is open-source and portable, with Colang dialog flows, custom actions, and execution rails.',
        'Use least-privilege IRSA/Pod Identity, Secrets Manager, and OpenTelemetry.',
      ],
      terms: [
        { en: 'Bedrock Knowledge Bases', si: 'A managed RAG feature for ingesting, embedding, and retrieving documents.' },
        { en: 'Bedrock Agents / AgentCore', si: 'Managed Bedrock agent features; AgentCore provides runtime, memory, gateway, identity, and observability building blocks.' },
        { en: 'ApplyGuardrail API', si: 'An API that checks text with Bedrock Guardrails without calling a model.' },
        { en: 'Contextual Grounding Check', si: 'A Bedrock filter that checks whether a RAG answer is grounded in retrieved sources and relevant to the query.' },
        { en: 'NVIDIA GPU Operator', si: 'A Kubernetes operator that installs and manages GPU drivers, device plugins, and monitoring.' },
        { en: 'IRSA / EKS Pod Identity', si: 'Ways to assign separate IAM roles to EKS pods for least-privilege access.' },
      ],
    },
    // 15 --------------------------------------------------------------- Run/monitor
    {
      id: 'agent-observability-maintenance',
      plain: "Give every user task a trace ID. Model calls, retrievals, tool calls, handoffs, approvals, and retries become spans with timing and status.",
      internGuide: ["Give every user task a trace ID. Model calls, retrievals, tool calls, handoffs, approvals, and retries become spans with timing and status.","Record useful metadata—versions, token usage, cost, tool names, error classes, and evidence IDs—while redacting secrets, personal data, and unnecessary prompt content.","Dashboards show aggregates; traces explain individual failures. Alerts should connect technical signals to user impact such as task success, queue delay, or unsafe-action blocks.","Version prompts, tools, models, policies, and datasets together. Use canaries, regression evaluations, drift review, and rollback rather than editing production prompts invisibly."],
      si: 'Customer කෙනෙක් “බිල් වැරදියි” කිව්වොත් trace එකෙන් agent එකේ සම්පූර්ණ ගමන බලන්න; span එකෙන් එක LLM call එක හෝ tool call එක පෙන්වයි. Logs, metrics, traces එකතු කරලා PII වැනි දත්ත mask කරන්න. Colombo package එකක් වෙනස් වුණාම හෝ model version එක update වුණාම input සහ success metrics බලලා drift හඳුනාගන්න. Code, prompt, tools, model සහ retrieval index එක එක release එකකට version කරලා, 5% canary එකකින් පටන් ගන්න.',
      title: 'Run, Monitor and Maintain: Traces and Spans, OpenTelemetry, LangSmith / Langfuse, Drift, Prompt and Version Management',
      body: [
        'When a production user reports a wrong answer, traces let you replay what happened. A trace is the full journey for one user task; a span is one operation inside it, such as an LLM call, tool call, retrieval, guardrail check, or sub-agent, arranged as a parent-child tree. Each span can record inputs/outputs (with PII redacted), model and prompt versions, tokens, cost, latency, and errors. The three observability pillars are logs (what happened), metrics (how much/how fast), and traces (where).',
        'OpenTelemetry (OTel) is a vendor-neutral standard with SDKs, a collector, and the OTLP protocol. OTel GenAI semantic conventions define standard attribute names such as gen_ai.* for model and token usage, making it easier to change backends. Options include LangSmith (deep LangGraph integration, datasets, and evals), self-hostable open-source Langfuse (tracing, prompt management, and evals), Arize Phoenix, CloudWatch/X-Ray, and Datadog. NeMo Agent Toolkit also has OTel exporters and a profiler. For data residency, consider self-hosted Langfuse or an OTel backend in your AWS account.',
        'Dashboards can track task success proxies (user feedback, escalation, and re-contact within 24 hours), p50/p95/p99 latency, cost per task, tool errors, guardrail triggers, step-limit hits, and LLM 429 rates. Sample production traces for LLM-judge scoring and send low scores to human review. Drift can follow changes in user questions (such as a new package launch), tool APIs, or provider models. Alert on changes in input-topic distribution, judge scores, and escalation rates.',
        'Production behavior depends on code, prompt version, tool descriptions, model ID/version, guardrail configuration, and retrieval-index version. Version them together as an agent release and record the release ID in traces. Pin model versions rather than using aliases such as “latest.” Store prompts in a registry such as Langfuse/LangSmith or Git, and promote only after regression tests pass. Roll out in shadow mode, then to 5%, 25%, and 100% of traffic while checking metrics. Roll back quickly by restoring the previous release tag.',
      ],
      analogy: 'A trace is like courier parcel tracking: arrived at the Colombo hub at 9:02, boarded a Kandy van at 11:40, and delivered at 15:10. If the parcel is late, spans show where it was delayed. Version management is like numbering a shop’s recipe book editions: if today’s kottu tastes different from yesterday’s, you can check whether recipe v12 or v13 was used.',
      example: 'Trace T-77 records an 11.2-second agent run costing Rs. 5.40 on release agent-2026.10.3: a 0.2-second 8B router call, three 70B billing calls taking 6.1 seconds and using 9,800 input tokens with 61% cached, a 0.4-second get_bill call, a 1.1-second rag_search returning five chunks, and a passing 0.3-second output guardrail. The search used old index idx-v41 while the current tariff was in idx-v42. The team updates the index alias and adds a regression test.',
      keyPoints: [
        'A trace covers one task; spans are its LLM/tool/retrieval/guardrail operations in a parent-child tree.',
        'OpenTelemetry and GenAI semantic conventions are vendor-neutral; backends include LangSmith, Langfuse, Phoenix, and CloudWatch.',
        'Track escalations, re-contact, judge scores, cost, latency, tool errors, and guardrail triggers online.',
        'Watch for drift in inputs, tools, and silent model updates; pin model versions.',
        'Version code, prompts, tools, model, guardrails, and index together; shadow, canary, then full rollout with fast rollback.',
      ],
      terms: [
        { en: 'Trace / Span', si: 'A trace is the full journey of one request; a span is a timed operation inside it.' },
        { en: 'OpenTelemetry (OTel)', si: 'An open, vendor-neutral standard for collecting traces, metrics, and logs.' },
        { en: 'LangSmith / Langfuse', si: 'Platforms for LLM tracing, evaluation, and prompt management; Langfuse is open-source.' },
        { en: 'Online Evaluation', si: 'Measuring live quality by sampling production traffic.' },
        { en: 'Prompt Registry', si: 'A place to store prompt versions and promote or roll them back.' },
        { en: 'Shadow Mode / Canary', si: 'Shadow runs a new version unseen by users; a canary releases it to a small share of traffic.' },
      ],
    },
    // 16 --------------------------------------------------------------- Safety
    {
      id: 'agent-safety-compliance',
      plain: "Treat model output as untrusted input. Validate tool arguments, restrict permissions and destinations, sandbox risky execution, and separate data from instructions.",
      internGuide: ["Treat model output as untrusted input. Validate tool arguments, restrict permissions and destinations, sandbox risky execution, and separate data from instructions.","Use layered controls: input screening, retrieval/tool authorization, runtime policy checks, output validation, rate/budget limits, and approval for consequential actions.","Audit logs should capture actor, delegated identity, policy decision, tool action, result, and version without leaking secrets. Preserve evidence needed for incident investigation.","Compliance depends on role, jurisdiction, and use case. Perform risk assessment, data governance, transparency, human oversight, monitoring, and legal review rather than relying on one guardrail product."],
      si: 'Agent එකකට refund හෝ email යවන්න පුළුවන් නම්, “කරන්න එපා” කියලා prompt එකේ ලියන එක පමණක් ආරක්ෂාවක් නොවේ. Rs. 2,000ට වැඩි refund එකකට approval, customer verification, සහ amount validation code එකේ enforce කරන්න. Web page එකකින් ආපු අවිශ්වාසදායක text එකට private data සහ email tool එක එකතු වුණොත් leak අවදානමක් තියෙනවා. Code sandbox කරන්න, audit log තබන්න, userට AI බව දන්වා human escalation දෙන්න.',
      title: 'Safety, Ethics and Compliance for Agents: Tool Guardrails, Permissioning, Sandboxing, Audit Logs, EU AI Act',
      body: [
        'A chatbot error may be a wrong sentence; an agent error can cause an action such as a refund, data deletion, or email. OWASP LLM Top 10 “Excessive Agency” includes excessive functionality (unneeded tools), excessive permissions, and excessive autonomy for high-impact actions without approval. Use defense in depth: least-privilege tools, tool-level guardrails, human approval gates, sandboxing, audit logs, and monitoring. A prompt saying “do not refund” is not an enforcement control; enforce policy in code.',
        'Divide tools into risk tiers: read-only (get_bill), low-risk writes (create_ticket), and high-risk actions (issue_refund, change_package, delete). Apply tier-specific rate and amount limits (for example, auto-refund up to Rs. 2,000 and require approval above that), argument validation (refund ≤ bill amount), and preconditions such as customer verification. Enforce authorization in the tool layer using the user’s identity/token; do not grant the agent permissions the user lacks. The “lethal trifecta” is private data, untrusted content, and external communication in one agent; remove at least one capability or add strong controls to reduce exfiltration risk.',
        'Run agents that execute code, browse, or handle files in isolated environments such as containers or microVMs (for example, Firecracker), with network egress allow-lists, read-only file systems, CPU/memory/time limits, and no secrets. Do not run agent-written code on a production server. Record who acted (user and agent release), what tool and arguments were used, why (reasoning summary or trace ID), who approved, and the result in append-only, tamper-evident storage such as S3 Object Lock with a retention policy. During an incident, you should be able to explain why an agent issued a refund.',
        'Regulatory compliance, discussed in Phase 10 with EU AI Act, NIST AI RMF, ISO/IEC 42001, and Sri Lanka PDPA, depends on risk and use case. The EU AI Act sets requirements for high-risk systems such as credit scoring or recruitment, including risk management, record-keeping, human oversight, accuracy, and robustness; systems such as chatbots must disclose AI interaction. For Sri Lankan customers’ data, consider PDPA requirements such as lawful processing, purpose limitation, data-subject rights, and cross-border transfer rules. In practice, classify the use case by risk, conduct a DPIA, maintain model/system cards, disclose the AI assistant, provide human escalation, and define log retention.',
      ],
      analogy: 'Giving an agent tools is like giving keys to a new employee. Do not hand over the safe key on the first day; use least privilege. Allow refunds under Rs. 2,000 automatically and require a manager’s signature above that. Test a new recipe in a separate test kitchen, not the restaurant kitchen, and record every withdrawal in a ledger.',
      example: 'A refund tool rejects unverified customers and amounts above the bill. It can automatically refund up to Rs. 2,000 when the customer has had fewer than two refunds that day; otherwise it sends the case to a supervisor. An append-only audit record stores timestamp, trace T-77, release agent-2026.10.3, customer, issue_refund arguments for Rs. 1,500, decision, result, and idempotency key. An injection test asking for Rs. 50,000 to account X is blocked by amount validation and the approval gate.',
      keyPoints: [
        'Excessive agency means too much functionality, permission, or autonomy; use defense in depth.',
        'Tier tools by risk and enforce limits, validation, and preconditions in code using the user’s identity.',
        'Reduce the lethal trifecta by removing at least one of its capabilities or adding controls.',
        'Use isolated sandboxes with egress allow-lists, resource limits, and no secrets; keep append-only, tamper-evident audit logs.',
        'EU AI Act uses risk tiers; high-risk systems need logging and oversight, and chatbots need AI disclosure. Also consider PDPA.',
      ],
      terms: [
        { en: 'Excessive Agency', si: 'Giving an LLM system more functionality, permissions, or autonomy than needed (an OWASP LLM risk).' },
        { en: 'Least Privilege', si: 'Giving only the minimum permissions required for the task.' },
        { en: 'Sandbox', si: 'An isolated environment where code or actions cannot affect production.' },
        { en: 'Audit Log', si: 'A record of who did what, when, and why, stored so it cannot be changed unnoticed.' },
        { en: 'Egress Allow-list', si: 'A list of external hosts that a sandbox is permitted to connect to.' },
        { en: 'DPIA', si: 'Data Protection Impact Assessment: an advance review of risks from processing personal data.' },
      ],
    },
    // 17 --------------------------------------------------------------- Human oversight
    {
      id: 'human-in-the-loop-oversight',
      plain: "Place approval before the consequential side effect, not after it. Show the proposed action, target, evidence, uncertainty, cost, and what approval will authorize.",
      internGuide: ["Place approval before the consequential side effect, not after it. Show the proposed action, target, evidence, uncertainty, cost, and what approval will authorize.","Use escalation when confidence is low, evidence conflicts, policy requires a person, or the request exceeds permissions. Provide a safe fallback if no reviewer responds.","Interrupt/resume requires a durable checkpoint and protection against stale approvals: revalidate permissions, inputs, prices, and external state before executing.","Measure reviewer workload, override rate, wait time, and caught errors. Too many low-value prompts cause approval fatigue and weaken real oversight."],
      si: 'Read-only bill එකක් බැලීමට human approval අවශ්‍ය නොවෙන්න පුළුවන්; Rs. 4,500 refund එකක් නම් supervisor අනුමැතිය ඉල්ලන්න. Approval request එකේ හේතුව සහ evidence පෙන්නලා, customerට approve, edit, reject කරන්න දෙන්න. Agent එක දවස් දෙකක් pause වුණත් Postgres checkpointer එකෙන් state එක තබාගෙන පසුව resume කරන්න. Userට stop කරන්නත්, අවශ්‍ය නම් human කෙනෙක්ට warm handoff කරන්නත් ඉඩ දෙන්න.',
      title: 'Human-AI Interaction and Oversight: Approval Gates, Escalation, Interrupt / Resume and UX for Trust',
      body: [
        'There are three human-oversight levels. Human-in-the-loop (HITL) requires approval before an action. Human-on-the-loop lets the agent act while a human monitors and can stop or override it. Human-out-of-the-loop is fully autonomous. Choose per action based on risk and reversibility: read-only can be out of loop, low-risk actions on the loop, and high-risk or irreversible actions in the loop. Beware automation bias: if approvers click “approve” every time, the gate has little value. Use gates for important actions and provide the context needed to decide.',
        'For a high-risk tool call, pause execution, persist state, and send an approval request with the action, arguments, reason, and risk to a queue or UI. A human can approve, edit, or reject it; then resume. For example, a supervisor can change a Rs. 2,500 refund to Rs. 1,500 before approval. Give a rejection reason to the agent so it can choose another path. LangGraph interrupt() and Command(resume=...) support this pattern. Since pauses may last days, use a durable checkpointer such as Postgres and set approval timeouts or expiry.',
        'Escalate to a human when the user asks, confidence is low, step/cost budgets are exhausted, sentiment worsens, policy disallows a request, or a user is vulnerable. A warm handoff gives the human a summary, completed actions, and verified facts so the customer does not repeat the story. Let users also stop an agent mid-task or change its plan.',
        'Trust-oriented UX includes transparency (identify the AI and show what it is doing), a plan preview and confirmation before actions, sources/citations, a way to express uncertainty and request a human, undo windows for reversible actions, and feedback with a reason that can enter the evaluation suite. The goal is calibrated trust: users trust the agent neither too much nor too little, but in line with its actual capabilities.',
      ],
      analogy: 'A junior doctor (agent) may order a blood test without oversight, while a nurse monitors a medication dose and a consultant must sign off on surgery. Before approval, the consultant sees the file, reports, and reason. If the consultant is away, the request remains in the ward log as durable state and can continue later.',
      example: 'For a package change, the agent says monthly data use is 38 GB and compares a Rs. 1,490 package with 40 GB to a Rs. 2,190 package, showing Rs. 700 savings and asking for confirmation. The customer’s approval triggers change_package. A Rs. 4,500 refund, above the Rs. 2,000 limit, goes to a supervisor with the customer, October double-charge evidence from transactions P-881/P-882, and proposed amount. Approval resumes the graph, executes an idempotent refund, and sends an SMS.',
      code: {
        lang: 'python',
        src: `from langgraph.types import interrupt, Command
from langgraph.checkpoint.memory import MemorySaver

def refund_node(state):
    # Pause here and save the graph state in the checkpointer.
    decision = interrupt({"action": "issue_refund", "amount_rs": state["amount"]})
    # On resume, this node runs from the beginning; put side effects after interrupt.
    if decision["approved"] is not True:
        return {"status": "rejected", "reason": decision.get("reason")}
    return {"status": issue_refund(state["order_id"], decision.get("amount_rs", state["amount"]))}

graph = builder.compile(checkpointer=MemorySaver())   # Use a Postgres checkpointer in production.
cfg = {"configurable": {"thread_id": "ticket-8812"}}
graph.invoke({"order_id": "A55", "amount": 4500}, cfg)            # Pauses at the interrupt.
graph.invoke(Command(resume={"approved": True, "amount_rs": 1500}), cfg)  # Supervisor edits and approves.`,
      },
      keyPoints: [
        'In-the-loop means approve first; on-the-loop means monitor/override; out-of-the-loop means autonomous. Match to risk and reversibility.',
        'Too many gates encourage automation bias; gate only important actions and show context.',
        'Approval flow: pause, persist, approve/edit/reject, and resume with LangGraph interrupt() and Command(resume).',
        'On resume, the node runs again from the beginning; put side effects after interrupt and make them idempotent.',
        'Escalation should be a warm handoff. Trust UX includes transparency, plan preview, citations, uncertainty, undo, and feedback.',
      ],
      terms: [
        { en: 'Human-in-the-Loop (HITL)', si: 'A design that requires human approval before an agent action.' },
        { en: 'Human-on-the-Loop', si: 'A design where the agent acts while a human monitors and can intervene.' },
        { en: 'Approval Gate', si: 'A point that pauses execution for a human decision before a high-risk action.' },
        { en: 'Interrupt / Resume', si: 'Pausing execution with state and continuing later with human input.' },
        { en: 'Warm Handoff', si: 'Transferring a conversation to a human agent with a complete context summary.' },
        { en: 'Trust Calibration', si: 'A user trusting AI in proportion to its actual capabilities.' },
      ],
    },
    // 18 --------------------------------------------------------------- Case study
    {
      id: 'case-study-telco-support-agent',
      plain: "Define scope and success first: supported intents, languages, resolution rate, response time, escalation rules, privacy, and prohibited account actions.",
      internGuide: ["Define scope and success first: supported intents, languages, resolution rate, response time, escalation rules, privacy, and prohibited account actions.","Use a router for simple FAQ/RAG versus authenticated account tools. Give tools narrow scopes, validate customer identity, cite policy sources, and require approval for sensitive changes.","Persist a typed case state, make ticket and plan-change calls idempotent, trace every handoff/tool call, and isolate each customer’s memory and retrieved data.","Launch with offline evaluations and adversarial tests, then a limited pilot. Monitor quality, safety, cost, latency, and agent-to-human escalation; roll back on defined thresholds."],
      si: 'මේ LankaConnect telco එක කල්පිත උදාහරණයක්: දවසකට chats 60,000ක්, භාෂා 4ක්, සහ Rs. 8ට අඩු conversation cost එකක් ඉලක්ක කරයි. Router එක billing, tech, sales වගේ specialistලාට යවනවා; refund Rs. 2,000ට වැඩි නම් supervisor අනුමැතියට යවන්න. දෝෂයක් ආවොත් checkpoint එකෙන් resume කර, duplicate refund වළක්වා, අවශ්‍ය නම් human කෙනෙක්ට දෙන්න. Shadow mode එකෙන් පටන්ගෙන read-only, customer-confirmed changes, approved refunds ලෙස පියවරෙන් පියවර rollout කරන්න.',
      title: 'Beyond the Exam: Designing a Production Customer-Support Agent for a Sri Lankan Telco, End to End',
      body: [
        'Requirements for the fictional LankaConnect telco: 8 million customers, 60,000 daily chat/WhatsApp messages, and Sinhala, Tamil, English, and Singlish. Use cases include bill/balance questions, package recommendations and changes, data/network troubleshooting, double-charge refunds, and complaints. SLAs: first response within 3 seconds using streaming, p95 task time under 20 seconds, a target 60% containment rate (resolved without a human), and under Rs. 8 per conversation. Compliance needs include PDPA, AI disclosure, and two-year audit-log retention.',
        'Architecture: web chat, app, and WhatsApp → API Gateway + WAF → stateless EKS conversation service → input guardrails for PII, jailbreaks, and language → 8B NIM router for billing/technical/sales/complaint/human intents → LangGraph specialist subgraphs for billing, tech support, and sales → MCP-backed tools: read-only get_balance/get_bill/get_usage, low-risk create_ticket, customer-confirmed change_package, issue_refund requiring supervisor approval above Rs. 2,000, network_status, and rag_search over tariff PDFs and troubleshooting guides with NeMo Retriever embedding/reranking NIMs and Milvus → output grounding, policy, and tone checks → channel. Store threads in a Postgres checkpointer, sessions in Redis, and long-term language preference/past resolutions separately. Use a 70B-class NIM on EKS (g6 or p-class GPU nodes managed with Karpenter) as primary and a Bedrock model as provider failover. Handle refund approvals and reports asynchronously with SQS/workers. Provide a supervisor approval console and contact-center warm handoff. Send OTel to self-hosted Langfuse (if local data residency is needed) and CloudWatch; store audit data with S3 Object Lock.',
        'Failure handling: when LLM NIM is down or returns 429, use a circuit breaker and Bedrock fallback; if that also fails, explain the issue and send the user to a human queue. For billing API timeouts, return a structured error and offer an SMS update through an async task. Escalate after a 10-step limit or Rs. 15 cost cap; send handoff loops of three or more to a human. Clarify low-confidence ASR/language, such as a Singlish voice note. Resume after pod crashes from a checkpoint; prevent duplicate refunds with idempotency keys. Treat ticket text as untrusted and enforce amount limits and approvals against prompt injection. During an outage such as a Kandy fiber cut with 5,000 simultaneous chats, let network_status detect the outage and return a workflow template rather than invoking a larger model, reducing cost and load.',
        'Evaluation and rollout: use an offline golden set of 500 production-like transcripts without PII, covering all three main languages and 10% adversarial cases. Measure sandbox task success, pass^3, tool accuracy, grounding, policy compliance (LLM judge calibrated with 100 human samples), and cost/latency per task; gate releases on CI regression tests. Online, track containment, escalation, 24-hour re-contact, CSAT, judge scores on a 5% sample, and per-intent cost. Phase 0 runs in shadow mode for two weeks and compares agent drafts with human responses. Phase 1 serves read-only balance/bill intents to 10% of traffic. Phase 2 adds customer-confirmed package changes. Phase 3 adds refunds with supervisor approval. Each phase has exit criteria (success ≥ 85%, pass^3 ≥ 70%, and no increase above baseline complaint rate) and a feature-flag kill switch back to fully human handling. After three months, use logs in a data flywheel: NeMo Customizer tunes an 8B model for billing intents, and NeMo Evaluator checks whether cost can be reduced.',
      ],
      analogy: 'Designing this system is like planning a large hospital: OPD reception is the router, wards are specialist agents, labs and pharmacies are tools, consultants’ signatures are approval gates, a generator is a fallback model, patient files are memory/state, and cameras/registers are observability and audit. You would not open a new hospital to the whole city at once: start with the OPD, then wards, and surgery last.',
      example: 'Approximate per-conversation cost includes an 8B router (800 tokens), three 70B specialist calls on average (9,000 tokens, 60% cached), one RAG call, two guardrail checks, and embedding/reranking. If self-hosted NIM GPU costs are divided across 60,000 conversations, the estimate is Rs. 4–6 per conversation, with 5% of traffic using Bedrock fallback. At 60% containment, human-handled chats fall from 60,000 to 24,000, leaving 36,000 handled by the agent. But pass^3 of 70% means inconsistent outcomes remain, so keep human approval for high-risk intents.',
      keyPoints: [
        'Start with requirements: volume, languages, SLAs, containment, cost per conversation, and compliance.',
        'Architecture: gateway → guardrails → router → specialist subgraphs → MCP tools → output checks, durable state, and fallback LLM.',
        'Handle failures at every layer with circuit breakers, structured errors, budgets, loop guards, idempotency, and outage mode.',
        'Evaluate with an offline golden set, CI gate, online metrics, and sampled judge reviews.',
        'Roll out from shadow to read-only, then confirmed writes, then approved high-risk actions; define exit criteria and a kill switch.',
      ],
      terms: [
        { en: 'Containment Rate', si: 'The percentage of conversations resolved by AI without a human agent.' },
        { en: 'Provider Failover', si: 'Automatically switching to another provider or model when the primary LLM endpoint fails.' },
        { en: 'Kill Switch', si: 'A control that quickly disables an AI feature and returns to a manual process.' },
        { en: 'Exit Criteria', si: 'Metrics that must be met before advancing to the next rollout phase.' },
        { en: 'CSAT', si: 'Customer Satisfaction score: a rating the customer gives after a conversation.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'You are designing a system that extracts six specific fields from an invoice and sends them to an ERP. The steps are always the same. What is the best design?',
      options: [
        'A multi-agent system with one supervisor and six workers',
        'A fixed workflow (LLM extraction + schema validation + ERP API call)',
        'A ReAct agent with 15 tools',
        'A swarm pattern with agent handoffs',
      ],
      answer: 1,
      why: 'When the steps are known in advance, choose the lowest autonomy level that solves the task. A workflow is cheaper, more predictable, and easier to test. Agents or multiple agents would only add cost, latency, and error paths here.',
    },
    {
      q: 'Agents built by two different companies with different frameworks need to discover each other and exchange tasks. Which protocol fits?',
      options: [
        'MCP, because it connects an agent to tools',
        'A2A, for agent-to-agent communication with Agent Cards and a task lifecycle',
        'OpenTelemetry',
        'JSON Schema',
      ],
      answer: 1,
      why: 'A2A connects agents horizontally across boundaries, with opaque remote agents, Agent Card discovery, and tasks. MCP connects an agent to tools/data. OTel is for observability, and JSON Schema describes data structures.',
    },
    {
      q: 'A customer-facing agent succeeds on a task with probability p = 0.9. Approximately what is the probability that all three runs succeed (pass^3)?',
      options: ['99.9%', '90%', '73%', '27%'],
      answer: 2,
      why: 'pass^k = p^k = 0.9 × 0.9 × 0.9 = 0.729 ≈ 73%. 99.9% is pass@3, the chance of at least one success (1 − 0.1³). Consistency (pass^k) matters for customer-facing agents.',
    },
    {
      q: 'An agent evaluation shows that 95% of final answers are correct, but logs show some runs making unnecessary refund API calls. Which evaluation catches this?',
      options: [
        'BLEU score',
        'Perplexity',
        'Trajectory evaluation (tool calls, arguments, unsafe/unnecessary actions)',
        'Final-answer exact match only',
      ],
      answer: 2,
      why: 'Outcome-only metrics do not show the path taken. Trajectory evaluation checks tool selection, arguments, and unnecessary or unsafe actions.',
    },
    {
      q: 'An agent task running on Kubernetes may pause for two days while waiting for human approval. What is essential to survive pod restarts?',
      options: [
        'Keep state in pod memory and use sticky sessions',
        'Durable execution: checkpoint state in an external store such as Postgres after every step and resume from it',
        'Set temperature to 0',
        'Use a bigger GPU',
      ],
      answer: 1,
      why: 'Long-running and HITL agents need externalized, checkpointed state. Pod memory is lost on restart. Temperature and GPU size do not solve this problem.',
    },
    {
      q: 'A refund tool call timed out, so it is unclear whether the refund happened. What is the best way to retry without refunding the customer twice?',
      options: [
        'Do not retry; tell the customer to ask again',
        'Ask the LLM to make a new decision',
        'Retry with the same idempotency key so the server recognizes the duplicate and returns the original result',
        'Increase the timeout to 300 seconds',
      ],
      answer: 2,
      why: 'A timeout leaves the outcome uncertain. An idempotency key prevents the same operation from taking effect twice. Checkpoint the LLM decision and retry only tool execution.',
    },
    {
      q: 'Which NVIDIA tool can profile an agent workflow built with frameworks such as LangGraph or CrewAI (tokens and latency per step) and evaluate it without replacing the frameworks?',
      options: ['NeMo Agent Toolkit', 'TensorRT-LLM', 'NCCL', 'cuDF'],
      answer: 0,
      why: 'NeMo Agent Toolkit, formerly AgentIQ, is framework-agnostic and connects agents from different frameworks while providing profiling, evaluation, and observability. TensorRT-LLM is an inference engine, NCCL handles GPU communication, and cuDF provides GPU dataframes.',
    },
    {
      q: 'An AWS team wants PII masking, denied topics, and RAG contextual-grounding checks without writing code, but its LLM is a self-hosted NIM on EKS. What is the best option?',
      options: [
        'Bedrock Guardrails cannot be used because they work only with Bedrock models',
        'Check NIM inputs and outputs with Bedrock Guardrails through the ApplyGuardrail API',
        'Add “do not mention PII” to the prompt',
        'Lower the temperature',
      ],
      answer: 1,
      why: 'The ApplyGuardrail API can evaluate text from any model with Bedrock Guardrails. NeMo Guardrails is a good alternative when custom dialog flows, execution rails, or portability are needed.',
    },
    {
      q: 'An agent can read private customer data and web pages, and send emails. What is the main risk and best architectural fix?',
      options: [
        'Hallucination. Use a larger model.',
        'Data exfiltration through indirect injection due to the lethal trifecta. Remove one capability, or require human approval and a recipient allow-list for email',
        'Latency. Add a cache',
        'Bias. Measure fairness metrics',
      ],
      answer: 1,
      why: 'Private data, untrusted content, and external communication together can let an attacker’s web page exfiltrate data. Prompt wording does not solve this. Remove a capability or add approval gates and allow-lists.',
    },
    {
      q: 'When a LangGraph node containing interrupt() resumes, what happens to the code before interrupt(), and what design consequence follows?',
      options: [
        'The node continues from the interrupt line, so side effects can be placed anywhere.',
        'The node runs again from the beginning, so place side effects after interrupt() and make them idempotent.',
        'The entire graph runs again from the beginning.',
        'It cannot resume; a new thread is required.',
      ],
      answer: 1,
      why: 'On resume, LangGraph executes the interrupted node again from the beginning, and the resume value is returned by interrupt(). Side effects before interrupt() may therefore happen twice.',
    },
  ],
}
