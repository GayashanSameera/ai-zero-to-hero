# 29: Responsible AI: Fairness, Privacy, Security, Safety and Governance

> **Before you start:** [07](07-math-probability-statistics.md) (conditional probability, base rates, sampling bias, confounders), [13](13-evaluation-metrics-and-tuning.md) (confusion matrix, TPR, FPR, precision, calibration), [14](14-unsupervised-learning-and-more.md#14-explainability) (SHAP, LIME), [18](18-nlp-fundamentals.md#12-word2vec-glove-fasttext) (bias in embeddings), [20](20-how-llms-work.md) (hallucination, sycophancy), [21](21-training-finetuning-alignment.md) (alignment, RLHF, Constitutional AI, red-teaming, data curation), [22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks) (prompt injection, jailbreaks), [24](24-ai-agents.md#15-safety-and-security) (agent security), [25](25-generative-models-and-multimodal.md#17-applications-and-risks) (deepfakes, watermarking), [28](28-mlops-and-llmops.md) (monitoring, guardrails, logging).
>
> **After this file you can:** identify where bias comes from and measure fairness with standard metrics; protect personal data (anonymisation, differential privacy, federated learning); defend AI systems against attacks (OWASP LLM Top 10, prompt injection, poisoning, model theft); set up guardrails and red-teaming; document models properly; and understand key regulations (EU AI Act, GDPR, Sri Lanka's PDPA).

> Building AI that works is not enough. It must also be **fair, safe, private, secure, transparent and accountable**. These are now legal requirements in many places, and they're always ethical ones.

---

## Table of contents

1. [Principles of trustworthy AI](#1-principles)
2. [Where bias comes from](#2-sources-of-bias)
3. [Measuring fairness](#3-fairness-metrics)
4. [The fairness impossibility and trade-offs](#4-fairness-trade-offs)
5. [Mitigating bias](#5-mitigating-bias)
6. [Bias and toxicity in LLMs](#6-bias-in-llms)
7. [Transparency and explainability](#7-transparency-and-explainability)
8. [Privacy: personal data handling](#8-privacy)
9. [Differential privacy](#9-differential-privacy)
10. [Privacy attacks and privacy-preserving techniques](#10-privacy-attacks-and-defences)
11. [Security threats to AI systems](#11-security-threats)
12. [OWASP Top 10 for LLM applications](#12-owasp-llm-top-10)
13. [Red-teaming](#13-red-teaming)
14. [Guardrails](#14-guardrails)
15. [Hallucination and overreliance as safety issues](#15-hallucination-and-overreliance)
16. [Documentation: model cards, datasheets, licences](#16-documentation-and-licences)
17. [Regulation and governance](#17-regulation-and-governance)
18. [Content provenance and deepfakes](#18-content-provenance)
19. [Human oversight, accessibility and environmental impact](#19-human-oversight-and-wider-impacts)
20. [A practical responsible-AI checklist](#20-checklist)
21. [Check yourself](#21-check-yourself)
22. [New words in this file](#22-new-words-in-this-file)

---

## 1. Principles

Most organisations' AI principles (NVIDIA, Google, Microsoft, Anthropic, OECD, UNESCO) cover similar ground:

| Principle | Meaning |
|---|---|
| **Fairness / non-discrimination** | Don't treat people unfairly based on protected attributes (gender, race, religion, age, disability, ethnicity, caste...) |
| **Privacy** | Protect personal data; collect only what's needed; respect consent |
| **Safety and security** | Prevent harm; resist attacks and misuse |
| **Transparency and explainability** | Be open about when AI is used and how it works; explain decisions where it matters |
| **Accountability** | Clear human responsibility for AI systems and their outcomes |
| **Reliability and robustness** | Work consistently, including in unusual conditions |
| **Human oversight** | Humans can understand, supervise and override AI where needed |
| **Societal and environmental well-being** | Consider wider impacts: jobs, misinformation, energy use |

**Responsible AI is not a final checklist step.** It's built into every stage: problem framing, data collection, modelling, evaluation, deployment and monitoring.

---

## 2. Sources of bias

**Bias** here means systematic unfairness toward certain groups (different from statistical bias in [file 11](11-ml-fundamentals.md#12-bias-variance-trade-off)).

| Type | Description | Example |
|---|---|---|
| **Historical bias** | The data reflects past discrimination, even if perfectly collected | A hiring model trained on past hires (mostly men) learns to prefer men |
| **Representation / sampling bias** | Some groups are under-represented ([file 07](07-math-probability-statistics.md#1-population-vs-sample)) | Face recognition trained mostly on lighter skin performs worse on darker skin |
| **Measurement bias** | Features or labels measured differently across groups, or are poor proxies | Using "arrests" as a proxy for "crime" (some areas are policed more heavily) |
| **Label bias** | Human labellers' judgements are biased | Annotators rating dialect speech as more "toxic" |
| **Aggregation bias** | One model for groups with genuinely different patterns | A diabetes model ignoring that indicators differ across ethnicities |
| **Proxy discrimination** | Removing a protected attribute doesn't help if other features correlate with it | Postcode as a proxy for ethnicity; name as a proxy for gender |
| **Evaluation bias** | Test data doesn't represent all users | Benchmark only in English; a Sinhala speaker gets much worse service |
| **Deployment bias** | Used in a context different from what it was built for | A model built for one country used in another |
| **Feedback loops / amplification** | Model decisions shape future data, reinforcing bias ([file 28](28-mlops-and-llmops.md#17-drift)) | Predictive policing sends more police to an area → more arrests recorded → the model predicts more crime there |
| **Automation bias** | People over-trust machine output (section 19) | A loan officer rubber-stamps every AI decision |

**Key insight:** a model can be **highly accurate overall and still very unfair** to a subgroup. Always evaluate **per group** ([slice-based evaluation, file 26](26-evaluating-llms.md#16-statistics-for-evals)).

---

## 3. Fairness metrics

Running example: a loan approval model, two groups A and B. "Positive" = approved. "Qualified" = would actually repay (the true label).

| | Group A | Group B |
|---|---|---|
| Applicants | 1,000 | 1,000 |
| Actually qualified | 600 | 400 |
| Approved | 500 | 250 |
| Approved AND qualified (TP) | 450 | 200 |
| Approved but NOT qualified (FP) | 50 | 50 |

### Demographic (statistical) parity

**Equal approval rates** across groups: P(approved | A) = P(approved | B).
- A: 500/1000 = **50%**; B: 250/1000 = **25%** ✗

### Disparate impact ratio and the four-fifths rule

```
disparate impact = approval rate (unprivileged group) / approval rate (privileged group)
```
= 25% / 50% = **0.50**.

The **four-fifths (80%) rule** (from US employment guidelines): a ratio below **0.8** suggests possible adverse impact. Here 0.50 → **flag**.

### Equal opportunity

**Equal true positive rates** (recall, [file 13](13-evaluation-metrics-and-tuning.md#3-precision-and-recall)) among **qualified** people: qualified people should be approved at the same rate regardless of group.
- TPR_A = 450/600 = **75%**; TPR_B = 200/400 = **50%** ✗: qualified people in group B are much more often rejected.

### Equalised odds

**Equal TPR and equal FPR** across groups.
- FPR_A = 50/400 = **12.5%** (400 unqualified in A); FPR_B = 50/600 = **8.3%** ✗

### Predictive parity / calibration within groups

Among approved people, the same fraction actually qualify (equal **precision**); or more generally, a score of 0.7 means the same probability of repayment in each group.
- Precision_A = 450/500 = **90%**; Precision_B = 200/250 = **80%** ✗

### Individual fairness

Similar individuals should get similar outcomes. Hard to define "similar" in practice.

**Which metric?** It depends on context and values:
- Demographic parity: when you believe outcomes should be equal, or historical labels are untrustworthy
- Equal opportunity: when the main harm is denying qualified people (hiring, loans, admissions)
- Equalised odds: when both false accusations and missed cases matter (e.g. risk assessments)
- Calibration: when decisions rely on probabilities being equally meaningful for all groups

**Intersectionality:** check combinations of attributes (e.g. older women, young men from a particular region), not just one at a time. Bias can hide at intersections.

```python
# pip install fairlearn
from fairlearn.metrics import MetricFrame, selection_rate, true_positive_rate, false_positive_rate
mf = MetricFrame(metrics={"selection_rate": selection_rate, "tpr": true_positive_rate,
                          "fpr": false_positive_rate},
                 y_true=y_test, y_pred=y_pred, sensitive_features=group_test)
print(mf.by_group); print(mf.difference())
```

---

## 4. Fairness trade-offs

**Impossibility theorems:** when groups have **different base rates** (here 60% vs 40% qualified), it is mathematically **impossible** (except for a perfect model) to satisfy calibration, equal TPR and equal FPR **all at once**. You **must choose** which fairness definition matters most for your context, and document why.

There's often also a trade-off between fairness and overall accuracy, though it's frequently smaller than people expect.

**Fairness through unawareness** (simply removing protected attributes) **doesn't work** because of proxies (section 2). In fact you often **need** the protected attribute (securely, with consent and legal basis) to **measure** fairness.

---

## 5. Mitigating bias

| Stage | Techniques |
|---|---|
| **Pre-processing (data)** | Collect more representative data; re-sample or **re-weight** under-represented groups ([class weights idea, file 13](13-evaluation-metrics-and-tuning.md#14-imbalanced-data)); fix biased labels; remove proxy features carefully; data augmentation; counterfactual data (swap gender words in text) |
| **In-processing (training)** | Add fairness **constraints** or penalties to the loss; adversarial debiasing (a second network tries to predict the group from the model's representations, and the main model learns to prevent it) |
| **Post-processing (outputs)** | Group-specific **thresholds** to equalise TPR/FPR ([thresholds, file 13](13-evaluation-metrics-and-tuning.md#6-thresholds-and-the-trade-off)); reject-option classification (send uncertain cases near the boundary to humans) |
| **Process** | Diverse teams; stakeholder and community consultation; impact assessments; human review; appeal mechanisms for affected people |

**Legal caution:** some fixes (like explicitly different thresholds per protected group) may themselves be restricted by law in some jurisdictions. Involve legal and compliance teams.

---

## 6. Bias in LLMs

LLMs absorb societal stereotypes from internet text ([file 18](18-nlp-fundamentals.md#12-word2vec-glove-fasttext)).

**Examples:**
- Associating professions with genders ("the nurse... she", "the engineer... he")
- Lower-quality answers in low-resource languages or dialects
- Different tone or refusals depending on names suggesting ethnicity or religion
- Image generators showing stereotyped people for "CEO" or "criminal" ([file 25](25-generative-models-and-multimodal.md#17-applications-and-risks))

**Measuring:**
- **Benchmarks:** **BBQ** (bias in question answering), **CrowS-Pairs** and **StereoSet** (stereotypical vs anti-stereotypical sentence preference), **WinoBias**/WinoGender (coreference with occupations), **WEAT** (association tests on embeddings)
- **Counterfactual testing:** identical prompts differing only in a name/gender/ethnicity → compare outputs ([file 26](26-evaluating-llms.md#15-safety-evaluation))
- **Toxicity:** classifiers (e.g. Perspective API, Detoxify) on outputs to prompts like RealToxicityPrompts
- **Per-language/per-dialect evaluation** of quality

**Mitigating:** curated/filtered training data; alignment (RLHF/Constitutional AI) with fairness principles; system prompts; output filters; evaluation in CI; human review for sensitive uses.

---

## 7. Transparency and explainability

**Transparency:** people should know **when** they're interacting with AI (many laws now require disclosure for chatbots and AI-generated content) and have access to information about how a system works and its limitations.

**Explainability methods** ([file 14](14-unsupervised-learning-and-more.md#14-explainability)):
- Interpretable models where stakes are high (logistic regression, small trees)
- SHAP, LIME, permutation importance, partial dependence for black-box models
- **For deep learning/vision:** saliency maps, **Integrated Gradients** (attributing a prediction to input features by accumulating gradients along a path from a baseline input), Grad-CAM (highlighting image regions)
- **For LLMs:** citing sources (RAG, [file 23](23-embeddings-vector-databases-rag.md)); chain-of-thought (but it **may not be faithful** to the real computation, [file 22](22-prompt-engineering.md#10-chain-of-thought)); attention maps (suggestive, not proof of reasoning)
- **Mechanistic interpretability:** reverse-engineering what neurons and circuits inside models compute, e.g. **probes** (small classifiers that test whether a concept is encoded in hidden states) and **sparse autoencoders (SAEs)** that decompose activations into interpretable features ([file 30](30-advanced-topics-and-career.md))

**Right to explanation:** in many jurisdictions, people affected by automated decisions (credit, employment) have rights to meaningful information and to contest the decision.

---

## 8. Privacy

### Personal data

**PII (Personally Identifiable Information)** = information identifying a person, directly or indirectly:
- **Direct identifiers:** name, national ID (NIC) number, passport number, phone, email, address, photo of face
- **Quasi-identifiers:** individually not identifying, but combined they can be: birth date + gender + postcode identifies a large share of people in some studies
- **Sensitive data:** health, biometrics, religion, political opinions, sexual orientation, financial details, children's data: extra protection required

### Principles (common to GDPR, Sri Lanka's PDPA, and others)

- **Lawful basis and consent:** a legal reason to process personal data
- **Purpose limitation:** use data only for the purposes stated
- **Data minimisation:** collect only what's needed
- **Storage limitation:** delete when no longer needed
- **Accuracy**, **security**, and **accountability**
- **Data subject rights:** access, correction, deletion ("right to be forgotten"), objection to automated decisions

### Techniques

| Technique | Meaning | Reversible? |
|---|---|---|
| **Redaction / masking** | Remove or replace PII: "Call Nisha on 077-1234567" → "Call [NAME] on [PHONE]" | No |
| **Pseudonymisation** | Replace identifiers with consistent codes (customer_8f3a2); the key is stored separately | **Yes** (with the key) → still counts as personal data legally |
| **Anonymisation** | Irreversibly remove the ability to identify anyone | No (if done properly; truly anonymised data is often outside data-protection law) |
| **Generalisation** | Age 34 → "30 to 39"; full postcode → district | |
| **k-anonymity** | Each record is indistinguishable from at least k − 1 others on the quasi-identifiers | |
| **Aggregation** | Report only group statistics, with minimum group sizes | |

**k-anonymity example (k = 3):** every combination of (age range, gender, district) must appear for at least 3 people, so nobody can be singled out by those attributes. Weakness: if all 3 people in a group share the same diagnosis, the diagnosis is still revealed (the **homogeneity attack**).

**Re-identification risk:** "anonymised" datasets have repeatedly been re-identified by linking them with other data (famous cases involved movie ratings and search logs). Be very careful with releasing "anonymised" data.

### PII in AI systems

- **Training data:** filter PII ([file 21](21-training-finetuning-alignment.md#2-pretraining-data)); models can **memorise** and regurgitate it
- **Prompts and logs:** users paste personal data into chatbots → redact before logging; set retention limits; check whether your LLM provider stores or trains on data (enterprise agreements usually exclude training)
- **RAG:** permission-aware retrieval ([file 23](23-embeddings-vector-databases-rag.md#20-production-concerns)); deleting documents must remove their chunks/embeddings
- **Agent memory:** let users view and delete memories ([file 24](24-ai-agents.md#8-memory))
- Tools: Microsoft **Presidio** (PII detection/anonymisation), spaCy NER ([file 18](18-nlp-fundamentals.md#16-nlp-libraries)), regex patterns, guardrail PII filters

---

## 9. Differential privacy

**Differential privacy (DP)** gives a **mathematical guarantee**: the output of an analysis (or a trained model) is almost the same whether or not **any one person's** data is included. So nobody can learn much about any individual from the output.

**How:** add carefully calibrated **random noise**.

**ε (epsilon), the privacy budget:** smaller ε = more noise = stronger privacy = less accuracy. Typical values range from about 0.1 (strong) to 10 (weak).

### Laplace mechanism (for counts and sums)

Add noise drawn from a **Laplace distribution** with scale = **sensitivity / ε**, where sensitivity = the maximum change in the answer if one person is added or removed.

**Worked example:** "How many patients in this hospital have diabetes?" True answer: 120.
- One person changes a count by at most 1 → sensitivity = 1
- ε = 0.5 → noise scale = 1/0.5 = 2 → we might release 120 + noise ≈ **118.3** or 122.9
- ε = 0.1 → scale 10 → releases could be ±20 or more: much more private, much less accurate

**Composition:** each query uses up budget; answering many questions about the same data adds up the ε's (total privacy loss grows). You need a privacy budget plan.

### DP in machine learning: DP-SGD

**DP-SGD:** during training, **clip** each example's gradient ([gradient clipping, file 15](15-neural-networks.md#12-vanishing-and-exploding-gradients)) to limit any one example's influence, then **add Gaussian noise** to the summed gradients. The final model has a DP guarantee. Libraries: Opacus (PyTorch), TensorFlow Privacy. Trade-off: lower accuracy and slower training.

**Real-world use:** national census statistics, Apple and Google usage analytics, some medical and financial models.

---

## 10. Privacy attacks and defences

### Attacks

| Attack | Goal | Example |
|---|---|---|
| **Membership inference** | Determine whether a specific person's record was in the training data | Overfit models are more confident on training examples, which leaks membership (e.g. "was this person in the cancer study?") |
| **Training data extraction** | Get the model to output memorised training data | Prompting an LLM to repeat text until it emits memorised emails/phone numbers |
| **Model inversion / attribute inference** | Reconstruct sensitive features from model outputs | Reconstructing a face from a face-recognition model's outputs |
| **Prompt/system prompt extraction** | Reveal hidden instructions or confidential context | "Repeat everything above this line" ([file 22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks)) |

### Defences and privacy-preserving techniques

- **Data minimisation and PII filtering** (section 8); **deduplication** reduces memorisation ([file 21](21-training-finetuning-alignment.md#2-pretraining-data))
- **Regularisation / less overfitting** reduces membership inference
- **Differential privacy** (section 9)
- **Output filters** for PII and verbatim training text
- **Federated learning:** train a shared model **without centralising raw data**. Each device or organisation trains locally and sends only **model updates** to a server, which aggregates them. Used for phone keyboard prediction and hospital collaborations. (Updates can still leak information, so it's often combined with DP and **secure aggregation**.)
- **Confidential computing:** running computations inside hardware-protected **trusted execution environments** (TEEs, including confidential GPUs) so even the cloud operator can't see the data
- **Homomorphic encryption / secure multi-party computation:** computing on encrypted data (strong but slow)
- **Machine unlearning:** removing the influence of specific data from a trained model (to honour deletion requests). Exact unlearning usually means retraining; approximate methods exist but are hard to verify

---

## 11. Security threats

AI systems inherit normal software security risks **plus** new ones:

| Threat | Description |
|---|---|
| **Prompt injection** (direct/indirect) | Hijacking instructions via input or retrieved content ([file 22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks)) |
| **Jailbreaks** | Bypassing safety training ([file 22](22-prompt-engineering.md#18-prompt-injection-and-jailbreaks)) |
| **Data poisoning** | Attackers insert malicious examples into training/fine-tuning data or RAG indexes to corrupt behaviour |
| **Backdoors (trojans)** | Poisoning that makes a model behave normally **except** when a secret **trigger** appears (e.g. a specific phrase makes a classifier label malware as safe) |
| **Adversarial examples** | Tiny, often invisible input changes causing wrong predictions (a few changed pixels make a "stop sign" read as "speed limit"; adding a phrase flips a sentiment classifier) |
| **Model theft / extraction** | Copying a model's behaviour by querying it many times and training an imitation (distillation from outputs, [file 21](21-training-finetuning-alignment.md#19-distillation-quantisation-pruning)); or stealing weight files |
| **Supply chain attacks** | Malicious pretrained models (e.g. pickle files that run code when loaded, [file 28](28-mlops-and-llmops.md#3-serialisation)), compromised packages, poisoned datasets, untrusted MCP servers ([file 24](24-ai-agents.md#9-mcp)) |
| **Denial of service / denial of wallet** | Flooding a model with expensive requests (huge prompts, long generations, agent loops) to cause outages or huge bills |
| **Insecure output handling** | Model output passed unchecked into a browser (XSS), shell, SQL or another system ([SQL injection, file 03](03-developer-tools.md#10-sql-from-python)) |

**Defensive basics:** treat models and their outputs as **untrusted**; validate inputs and outputs; least privilege; use safe formats (safetensors); verify sources and checksums of models/datasets; rate limits and spend caps; monitoring and anomaly detection; data provenance tracking; regular security reviews.

---

## 12. OWASP LLM Top 10

**OWASP** (Open Worldwide Application Security Project) publishes a widely used list of the top security risks for LLM applications. The 2025 version:

| # | Risk | One-line explanation |
|---|---|---|
| LLM01 | **Prompt Injection** | Malicious input or content manipulates the model's behaviour |
| LLM02 | **Sensitive Information Disclosure** | The model or app leaks PII, secrets, proprietary data |
| LLM03 | **Supply Chain** | Compromised models, datasets, plugins, dependencies |
| LLM04 | **Data and Model Poisoning** | Tampered training/fine-tuning/embedding data introduces vulnerabilities or backdoors |
| LLM05 | **Improper Output Handling** | Unvalidated model output passed to other systems (XSS, code execution, SQL injection) |
| LLM06 | **Excessive Agency** | The LLM has too many permissions, tools or autonomy ([file 24](24-ai-agents.md#15-safety-and-security)) |
| LLM07 | **System Prompt Leakage** | Secrets or sensitive logic in system prompts get exposed |
| LLM08 | **Vector and Embedding Weaknesses** | RAG risks: access-control failures, poisoned documents, embedding inversion |
| LLM09 | **Misinformation** | Hallucinated or misleading outputs, plus users' **overreliance** on them |
| LLM10 | **Unbounded Consumption** | Uncontrolled resource use: denial of service, runaway costs, model extraction via mass querying |

Use it as a checklist when designing and reviewing any LLM application.

---

## 13. Red-teaming

**Red-teaming** = deliberately attacking your own AI system (like an adversary would) to find weaknesses **before** real attackers or users do.

### Workflow

1. **Define scope and harms:** what must the system never do? (Leak data, give dangerous instructions, defame people, take unauthorised actions, show bias...)
2. **Assemble a diverse team:** security experts, domain experts, people from different backgrounds and languages
3. **Attack:** manual creative probing + automated tools
   - Jailbreak families: role-play, hypotheticals, obfuscation (encodings, other languages, typos), many-shot, multi-turn escalation, payload splitting
   - Prompt injection via documents, web pages, tool outputs
   - Privacy probes (system prompt extraction, PII extraction)
   - Bias probes (counterfactual prompts)
4. **Measure:** **attack success rate (ASR)** per category ([file 26](26-evaluating-llms.md#15-safety-evaluation))
5. **Fix:** prompts, guardrails, permissions, model choice, fine-tuning
6. **Retest** and add successful attacks to the regression test suite

**Tools:** **garak** (NVIDIA's open-source LLM vulnerability scanner), PyRIT (Microsoft), promptfoo red-teaming, plus public jailbreak datasets.

---

## 14. Guardrails

**Guardrails** are programmable checks around an LLM that enforce policies on inputs and outputs.

```
User input ──► [Input rails] ──► [Retrieval rails] ──► LLM ──► [Output rails] ──► User
                  │                                    │            │
          block injection,                    [Execution rails:  block toxic content,
          off-topic, PII,                      validate tool     PII leaks, hallucinated
          abuse                                calls/actions]    claims, wrong format
```

| Rail type | Examples |
|---|---|
| **Input rails** | Jailbreak/injection detection; topic restrictions (a banking bot refuses medical advice); PII masking; language detection; abuse filtering |
| **Dialog rails** | Steer conversation flows (e.g. require identity verification before account questions) |
| **Retrieval rails** | Filter retrieved chunks (remove injected instructions, enforce permissions) |
| **Execution rails** | Check tool calls/arguments before running them ([file 24](24-ai-agents.md#15-safety-and-security)) |
| **Output rails** | Toxicity/safety classification; PII leakage checks; **fact-checking / groundedness** against sources; format validation |

### Tools

- **NVIDIA NeMo Guardrails:** open-source toolkit; rails defined in configuration and a dialogue language called **Colang**; integrates safety models
- **Safety classifier models:** **Llama Guard** (Meta), NVIDIA **NemoGuard** safety/topic-control/jailbreak-detection models, ShieldGemma, provider **moderation APIs**
- Cloud guardrail services (e.g. Amazon Bedrock Guardrails, Azure AI Content Safety)
- Simple code checks (regex for PII, allow-lists, JSON schema validation)

**Trade-offs:** each rail adds latency and cost, and can produce **false positives** (blocking legitimate requests, i.e. over-refusal). Evaluate guardrails like any classifier (precision/recall, [file 13](13-evaluation-metrics-and-tuning.md)).

---

## 15. Hallucination and overreliance

From [file 20](20-how-llms-work.md#17-hallucinations): hallucinations become **safety** issues when people act on them (medical advice, legal citations, financial figures). Lawyers have been sanctioned for submitting AI-invented case citations.

**Overreliance / automation bias:** users trusting AI output without checking, especially when it sounds confident.

**Mitigations:**
- Grounding (RAG) with **citations users can check**; faithfulness checks ([file 26](26-evaluating-llms.md#14-faithfulness-evaluation))
- Clear **communication of uncertainty and limitations** in the UI ("AI-generated, may contain errors; verify important information")
- **Human review** for high-stakes outputs
- **Sycophancy** awareness: design prompts and evaluations that check the model corrects wrong user claims ([file 22](22-prompt-engineering.md#14-reducing-hallucinations-and-sycophancy))
- Don't deploy LLMs as sole decision-makers in high-risk domains

---

## 16. Documentation and licences

### Documentation

| Document | Describes |
|---|---|
| **Model card** | A model's intended uses and out-of-scope uses, training data summary, evaluation results (including **per-group** results), limitations, ethical considerations, licence ([file 18](18-nlp-fundamentals.md#16-nlp-libraries)) |
| **Datasheet for datasets** | Why and how the data was collected, what it contains, who's represented, consent, preprocessing, recommended uses, maintenance |
| **System card** | Safety evaluation and mitigations for a whole AI system or major model release (common for frontier LLMs) |
| **AI impact assessment** | Risks to people and society for a specific deployment, and how they're addressed |
| **Data lineage / provenance records** | Where each dataset came from and how it was transformed |

### Licences

Before using a model or dataset, **read its licence**:

| Licence type | Examples | Commercial use? |
|---|---|---|
| **Permissive open-source** | Apache 2.0, MIT | Yes (keep notices; Apache 2.0 also grants patent rights) |
| **Copyleft** | GPL | Yes, but derivative software must be released under the same licence |
| **Creative Commons** | CC BY (attribution), CC BY-SA (share-alike), **CC BY-NC (non-commercial only)** | Depends: **NC = no commercial use** |
| **Custom model licences** | Llama community licence, Gemma terms, various "open-weight" licences | Usually yes with conditions (acceptable-use policies, user-count thresholds, naming requirements) |
| **Responsible AI licences (RAIL)** | OpenRAIL | Use restrictions on harmful applications |
| **API terms of service** | Commercial LLM providers | Restrictions (e.g. on using outputs to train competing models, on certain use cases) |

**"Open-weight" ≠ "open-source"** ([file 20](20-how-llms-work.md#20-open-vs-closed-models)). Also consider **copyright** of training data and generated outputs, an evolving legal area. Ask your legal team.

---

## 17. Regulation and governance

### EU AI Act (adopted 2024, phased application from 2025 onward)

A **risk-based** framework:

| Tier | Examples | Obligations |
|---|---|---|
| **Unacceptable risk: banned** | Social scoring by authorities; manipulative techniques exploiting vulnerabilities; untargeted scraping of facial images; emotion recognition in workplaces/schools (with exceptions); most real-time remote biometric identification in public by police | Prohibited |
| **High risk** | AI in hiring, education/exams, credit scoring, critical infrastructure, medical devices, law enforcement, migration, justice | Risk management, data governance, documentation, logging, transparency, **human oversight**, accuracy/robustness/cybersecurity, conformity assessment, registration |
| **Limited risk (transparency)** | Chatbots, deepfakes, AI-generated content | Tell people they're interacting with AI; label AI-generated/manipulated content |
| **Minimal risk** | Spam filters, video game AI | No new obligations (voluntary codes) |

**General-purpose AI (GPAI) models** (like LLMs) have their own obligations: technical documentation, copyright policy, training-data summaries; models with **systemic risk** (very large training compute) face extra evaluation, red-teaming, incident reporting and cybersecurity duties.

It applies to companies **outside the EU** too, if their AI systems are used in the EU.

### Other frameworks

- **GDPR** (EU data protection law): personal data rules; rights related to automated decisions; large fines
- **Sri Lanka Personal Data Protection Act No. 9 of 2022 (PDPA):** Sri Lanka's data protection law, modelled on similar principles: lawful processing, purpose limitation, data minimisation, accuracy, storage limitation, security; data subject rights (access, correction, erasure, objection, including regarding automated decisions); obligations for controllers and processors; a Data Protection Authority; rules on cross-border transfers. Check the current implementation status and guidance from the Data Protection Authority when building products for Sri Lankan users.
- **NIST AI Risk Management Framework (AI RMF)** (US, voluntary): four functions: **Govern, Map, Measure, Manage** AI risks
- **ISO/IEC 42001:** international standard for an **AI management system** (organisational governance, certifiable)
- **Sector rules:** finance (model risk management), healthcare (medical device regulation), employment law, consumer protection
- Many countries are developing AI laws and guidelines; stay current

### Organisational AI governance

- An AI policy and a clear **owner** for each AI system
- **Risk classification** of use cases; stricter review for higher risk
- Inventory of models and AI systems in use
- Review boards; impact assessments; incident response plans
- Training staff on responsible AI and approved tools ("**shadow AI**", meaning employees pasting confidential data into unapproved chatbots, is a real risk)

---

## 18. Content provenance

Generative AI makes realistic fake text, images, audio and video easy ([file 25](25-generative-models-and-multimodal.md#17-applications-and-risks)).

| Approach | How | Limits |
|---|---|---|
| **Watermarking text** | During generation, subtly bias token choices (e.g. favour a pseudo-random "**green list**" of tokens at each step); a detector with the key checks whether green tokens are over-represented | Weakened by paraphrasing/editing; needs the generator's cooperation |
| **Watermarking images/audio/video** | Invisible signals embedded in pixels or audio (e.g. Google's SynthID) | Can degrade with heavy edits; not universal |
| **Content provenance (C2PA)** | Cryptographically signed **metadata** ("content credentials") recording how content was created/edited, attached by cameras, editing tools and AI generators | Metadata can be stripped; requires ecosystem adoption. **Soft binding** (linking via watermark or fingerprint) helps recover stripped credentials |
| **AI-text detectors** | Classifiers guessing whether text is AI-written | **Unreliable**; high false-positive rates, especially for non-native English writers. Don't use them alone to accuse students or employees |
| **Deepfake detectors** | Classifiers for manipulated media | Arms race; generalise poorly to new generators |
| **Process defences** | Verify through trusted channels (call back on a known number); codewords for financial approvals; media literacy | Human-centred, often most effective |

---

## 19. Human oversight and wider impacts

### Human oversight

- **Human-in-the-loop:** a human approves each decision (high-stakes)
- **Human-on-the-loop:** humans monitor and can intervene (medium-stakes)
- **Human-out-of-the-loop:** fully automated (low-stakes only)

**Make oversight meaningful:** humans need time, training, authority to override, and understandable information. Otherwise **automation bias** turns them into rubber stamps.

**Contestability:** affected people should be able to appeal decisions and reach a human.

**Safety monitoring and incident response:** log and review incidents (harmful outputs, wrong decisions); have a kill switch ([file 28](28-mlops-and-llmops.md#19-llmops)); report serious incidents where required.

### Accessibility and inclusion

- Support multiple languages (Sinhala, Tamil, English for Sri Lankan users), simple language, voice interfaces, screen-reader compatibility
- Test with diverse users, including people with disabilities and low digital literacy
- Make sure AI doesn't become a barrier to essential services (always offer a human alternative)

### Environmental impact

Training and serving large models uses significant **energy** and **water** (for cooling data centres), with carbon emissions depending on the energy source.

**Reduce it:** use the smallest adequate model; quantise and distil ([file 21](21-training-finetuning-alignment.md#19-distillation-quantisation-pruning)); efficient serving and batching ([file 27](27-inference-and-serving.md)); cache results; avoid unnecessary retraining; choose regions/providers with cleaner energy; measure and report (tools like CodeCarbon).

### Labour and society

Consider effects on workers (job changes, the conditions of data labellers), misinformation, concentration of power, and access gaps between rich and poor regions.

---

## 20. Checklist

Use this for every AI project (scale effort to the risk level):

**Problem framing**
- [ ] Is AI the right tool? What could go wrong, and for whom? Who is affected but not in the room?
- [ ] Risk level (e.g. EU AI Act tier / internal classification)? Legal basis for using personal data?

**Data**
- [ ] Datasheet: sources, consent, licences, representativeness
- [ ] PII minimised, protected, redacted where possible; retention plan
- [ ] Checked for historical/representation/label bias; train/test reflect real users and languages

**Model and evaluation**
- [ ] Baseline and per-group (slice) evaluation; chosen fairness metric(s) with justification
- [ ] Explainability appropriate to stakes
- [ ] Robustness, safety and red-team testing (OWASP LLM Top 10 for LLM apps)
- [ ] Model card written

**Deployment**
- [ ] Guardrails on inputs/outputs/tools; least privilege; human approval for high-impact actions
- [ ] Users told they're interacting with AI; limitations communicated; human escalation path
- [ ] Logging with privacy protection; monitoring for drift, bias and safety incidents
- [ ] Incident response plan and kill switch; appeal/contest mechanism

**Ongoing**
- [ ] Periodic re-evaluation (fairness, performance, safety); documentation updated; regulations tracked

---

## 21. Check yourself

**Q1.** A hiring model is trained on 10 years of past hiring decisions, mostly men. Which kind of bias is this?
<details><summary>Answer</summary>Historical bias (also possibly representation bias): the data reflects past discrimination.</details>

**Q2.** Group A approval rate 60%, group B 42%. Disparate impact ratio? Does it pass the four-fifths rule?
<details><summary>Answer</summary>42/60 = **0.70** < 0.8 → fails (possible adverse impact).</details>

**Q3.** Qualified applicants approved: group A 180 of 200, group B 120 of 200. Which fairness criterion is violated and by how much?
<details><summary>Answer</summary>Equal opportunity: TPR_A = 90%, TPR_B = 60% (a 30-point gap).</details>

**Q4.** Why doesn't removing the "gender" column make a model fair?
<details><summary>Answer</summary>Other features act as proxies (names, hobbies, certain job titles); and you lose the ability to measure fairness.</details>

**Q5.** Pseudonymisation vs anonymisation?
<details><summary>Answer</summary>Pseudonymisation replaces identifiers with codes but is reversible with a key (still personal data). Anonymisation irreversibly prevents identification.</details>

**Q6.** In differential privacy, what happens when ε gets smaller?
<details><summary>Answer</summary>More noise is added: stronger privacy, lower accuracy.</details>

**Q7.** A count query has sensitivity 1 and ε = 0.25. What's the Laplace noise scale?
<details><summary>Answer</summary>1/0.25 = **4**.</details>

**Q8.** What is federated learning and what does it protect?
<details><summary>Answer</summary>Training a shared model across devices/organisations by sending model updates instead of raw data; raw data stays local (often combined with DP/secure aggregation since updates can leak).</details>

**Q9.** Name three OWASP LLM Top 10 risks relevant to a RAG chatbot with tools.
<details><summary>Answer</summary>Prompt injection (LLM01), sensitive information disclosure (LLM02), improper output handling (LLM05), excessive agency (LLM06), vector and embedding weaknesses (LLM08), unbounded consumption (LLM10).</details>

**Q10.** What is a backdoor attack?
<details><summary>Answer</summary>Poisoning that makes a model behave normally except when a secret trigger appears, causing attacker-chosen behaviour.</details>

**Q11.** Under the EU AI Act, which tier is an AI system that screens job applicants, and give two obligations.
<details><summary>Answer</summary>High risk. Obligations include risk management, data governance, technical documentation, logging, transparency, human oversight, accuracy/robustness, conformity assessment.</details>

**Q12.** Why shouldn't a teacher rely on an AI-text detector to accuse a student of cheating?
<details><summary>Answer</summary>Detectors are unreliable with significant false positives (especially for non-native writers) and are easily fooled by editing.</details>

**Q13.** What makes human oversight "meaningful" rather than a rubber stamp?
<details><summary>Answer</summary>Humans with enough time, training, understandable information and real authority to override, plus awareness of automation bias.</details>

---

## 22. New words in this file

| Word | Meaning |
|---|---|
| Trustworthy / responsible AI | AI that is fair, safe, private, transparent, accountable |
| Protected attribute | Characteristic protected from discrimination (gender, race, religion...) |
| Historical, representation, measurement, label, aggregation, evaluation, deployment bias | Sources of unfairness |
| Proxy discrimination | Bias via features correlated with protected attributes |
| Feedback loop / amplification | Model decisions reinforcing bias |
| Demographic (statistical) parity | Equal positive rates across groups |
| Disparate impact ratio, four-fifths rule | Ratio of positive rates; flag if < 0.8 |
| Equal opportunity | Equal true positive rates |
| Equalised odds | Equal TPR and FPR |
| Predictive parity / calibration within groups | Equal precision / equally meaningful scores |
| Individual fairness | Similar people treated similarly |
| Intersectionality | Combinations of attributes |
| Impossibility theorem (fairness) | Can't satisfy all fairness criteria with different base rates |
| Fairness through unawareness | Removing protected attributes (insufficient) |
| Pre-/in-/post-processing mitigation, re-weighting, adversarial debiasing, reject-option | Bias mitigation techniques |
| Fairlearn | Fairness metrics/mitigation library |
| BBQ, CrowS-Pairs, StereoSet, WinoBias, WEAT, RealToxicityPrompts | LLM bias/toxicity benchmarks |
| Integrated Gradients, Grad-CAM, saliency map | Attribution/explanation methods |
| Probes, sparse autoencoders (SAEs), mechanistic interpretability | Looking inside models |
| Right to explanation | Legal right to information about automated decisions |
| PII, direct identifier, quasi-identifier, sensitive data | Kinds of personal data |
| Purpose limitation, data minimisation, storage limitation | Data protection principles |
| Data subject rights, right to be forgotten | Individuals' rights over their data |
| Redaction, pseudonymisation, anonymisation, generalisation, aggregation | Privacy techniques |
| k-anonymity, homogeneity attack | Indistinguishability in groups of k / its weakness |
| Re-identification | Linking "anonymous" data back to people |
| Presidio | PII detection/anonymisation tool |
| Differential privacy, ε (privacy budget), sensitivity | Mathematical privacy guarantee and its parameters |
| Laplace mechanism, composition | Adding Laplace noise / privacy loss adding up |
| DP-SGD, Opacus | Differentially private training |
| Membership inference, training data extraction, model inversion | Privacy attacks |
| Federated learning, secure aggregation | Training without centralising data |
| Confidential computing, TEE | Hardware-protected computation |
| Homomorphic encryption, secure multi-party computation | Computing on encrypted data |
| Machine unlearning | Removing data influence from a model |
| Data poisoning, backdoor/trojan, trigger | Corrupting training data / hidden malicious behaviour |
| Adversarial example | Tiny input change causing wrong output |
| Model theft / extraction | Copying a model via queries or stolen weights |
| Supply chain attack | Compromised models, data or dependencies |
| Denial of wallet | Attack causing huge usage costs |
| Insecure / improper output handling, XSS | Unvalidated outputs into other systems |
| OWASP, OWASP Top 10 for LLM Applications | Security organisation / LLM risk list |
| System prompt leakage, excessive agency, unbounded consumption | OWASP LLM risks |
| Red-teaming, attack success rate | Adversarial testing / its metric |
| garak, PyRIT | Red-teaming tools |
| Guardrails: input, dialog, retrieval, execution, output rails | Policy checks around LLMs |
| NeMo Guardrails, Colang, Llama Guard, NemoGuard, moderation API | Guardrail tools/models |
| Over-refusal | Blocking legitimate requests |
| Overreliance, automation bias | Over-trusting AI output |
| Model card, datasheet, system card, impact assessment | AI documentation |
| Apache 2.0, MIT, GPL, CC BY / BY-SA / BY-NC, RAIL, custom model licences | Licence types |
| EU AI Act tiers (unacceptable, high, limited, minimal), GPAI, systemic risk | EU risk-based regulation |
| GDPR | EU data protection law |
| Sri Lanka PDPA No. 9 of 2022, Data Protection Authority | Sri Lanka's data protection law and regulator |
| NIST AI RMF (Govern, Map, Measure, Manage) | US AI risk framework |
| ISO/IEC 42001 | AI management system standard |
| Shadow AI | Unapproved AI tool use in organisations |
| Text watermarking, green list | Statistical marks in generated text |
| C2PA, content credentials, soft binding | Provenance metadata standard |
| AI-text detector, deepfake detector | Classifiers for AI content (unreliable) |
| Human-in/on/out-of-the-loop | Levels of human oversight |
| Contestability | Ability to appeal AI decisions |
| CodeCarbon | Measuring ML carbon emissions |

**🎉 You've almost finished!** One more content file.

**Next:** [30-advanced-topics-and-career.md](30-advanced-topics-and-career.md)
