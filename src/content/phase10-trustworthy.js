export default {
  id: 'trustworthy',
  number: 10,
  title: 'Trustworthy & Responsible AI',
  titleSi: 'Trustworthy & Responsible AI: Fair, safe, and privacy-respecting AI',
  summary: 'Building an AI system that performs well is not enough. You must also consider fairness, privacy, security, and whether affected people can understand its purpose, limits, and decisions. This phase introduces bias, fairness metrics, differential privacy, prompt injection, jailbreaks, NeMo Guardrails, the EU AI Act, watermarking, and human oversight through examples and calculations. It prepares you to reason through Trustworthy AI questions in the NCA-GENL exam.',
  duration: '4-6 weeks',
  topics: [
    // 1
    {
      id: 'tai-principles',
      title: 'NVIDIA Trustworthy AI Principles: Privacy, Safety & Security, Transparency, Nondiscrimination',
      examRefs: ['TAI-001', 'TAI-002', 'TAI-049', 'TAI-050'],
      si: 'ඔයා AI එකක් හදනකොට හොඳට වැඩ කරනවාද කියන එක විතරක් බලලා මදි. Colombo බැංකුවක loan එකක් දෙන model එකක් ගැන හිතන්න; හැමෝගේම තොරතුරු රහසිගතව තියාගෙන, තීරණය පැහැදිලි කරලා, හැම පළාතකම අයට සාධාරණව සලකන්න ඕනේ. හොඳම accuracy තිබුණත් එක් කණ්ඩායමකට 70%යි, තව කණ්ඩායමකට 95%යි නම් ඒ වෙනස හොයන්න ඕනේ. ඔයාට privacy, safety and security, transparency, nondiscrimination කියන මූලධර්ම හතර මතක තියාගන්න පුළුවන්.',
      body: [
        'NVIDIA describes four core Trustworthy AI principles: Privacy, Safety and Security, Transparency, and Nondiscrimination. Remember all four. If an exam asks which option is not a principle, a capability goal such as maximum benchmark performance is the wrong choice. Even a highly accurate model can leak data or treat people unfairly; capability and trustworthiness are different.',
        'Privacy means respecting people’s data: collect only what is needed (data minimization), obtain consent, and set a retention limit. Keeping conversation logs forever “just in case” conflicts with privacy and increases the potential harm if a breach occurs.',
        'Transparency does not mean only making model weights open source. People affected by a system should be able to understand its purpose, capabilities, limitations, and the basis for its decisions. Publishing a checkpoint without useful documentation does not make the system transparent to end users.',
        'Nondiscrimination means checking that a model does not treat groups unfairly. Before release, evaluate performance and outcomes separately for demographic subgroups: an overall average of 95% could hide a score of 70% for one group. You cannot detect disparities without measuring them. Safety and Security concern preventing harm and misuse by attackers.',
      ],
      analogy: 'A trustworthy AI system is like a good hospital. Treating illness effectively (accuracy) matters, but it is not enough: patient records must stay private, treatment must be safe and secure, and doctors should explain what they did and why. A patient from a village and one from Colombo should receive fair treatment.',
      example: 'A bank loan model has 94% accuracy on a test set. When the team breaks results down by subgroup, accuracy is 96% for Colombo applicants and 81% for applicants from the Northern Province. The overall average hid this gap, so the team should investigate it before release. For privacy, it could also tell users that only necessary chat-log fields are stored with consent and are deleted after three months.',
      keyPoints: [
        'The four NVIDIA Trustworthy AI principles are Privacy, Safety & Security, Transparency, and Nondiscrimination.',
        'Benchmark performance and accuracy are capability goals, not Trustworthy AI principles.',
        'Transparency means affected people can understand the system’s purpose, capabilities, limitations, and decision basis; open weights are neither required nor sufficient.',
        'A first step toward nondiscrimination is disaggregated evaluation by subgroup.',
        'Privacy includes data minimization, consent, and retention limits.',
      ],
      terms: [
        { en: 'Trustworthy AI', si: 'AI designed around privacy, safety and security, transparency, and nondiscrimination.' },
        { en: 'Data Minimization', si: 'Collecting only the data necessary for a stated purpose.' },
        { en: 'Retention Limit', si: 'A defined period for keeping data, after which it is deleted.' },
        { en: 'Disaggregated Evaluation', si: 'Measuring metrics separately for each group rather than only in aggregate.' },
        { en: 'Capability vs Trustworthiness', si: 'How capable a model is and how responsibly and reliably it behaves are distinct questions.' },
      ],
    },
    // 2
    {
      id: 'bias-sources',
      title: 'Sources of Bias: Sampling, Historical, Label, Measurement, Representation, Amplification',
      examRefs: ['TAI-003', 'TAI-004', 'TAI-005', 'TAI-006', 'TAI-007', 'TAI-046'],
      si: 'ඔයාගේ කඩේට එන පාරිභෝගිකයන් ගැන survey එකක් දවල් 12ට විතරක් කළොත් රෑට එන අය මඟ හැරෙනවා. ඒකෙන් model එකට මුළු පිරිසම ගැන වැරදි අදහසක් හැදෙන්න පුළුවන්; කණ්ඩායමක් data එකේ අඩු වීමත් ඒ වගේම බලපානවා. පරණ hiring records වල තිබුණු අසාධාරණය අලුත් AI එකත් ඉගෙනගෙන, තවත් වැඩි කරලා පෙන්වන්න පුළුවන්. ඔයා බලන්න ඕනේ data ගත්ත විදිහ, labels දාපු අය, මැනීමට තෝරපු proxy එක සහ predictions වල බලපෑම.',
      body: [
        'Bias is a systematic pattern of errors or unfair outcomes for a group. Identifying its source helps you choose a suitable remedy. Exams may describe a scenario and ask which type of bias it illustrates, so learn to distinguish the causes.',
        'Sampling (selection) bias occurs when training data comes from a subset that does not represent the target population—for example, using only reviews from a technology forum to analyze feedback from all customers. Representation bias occurs when some groups or contexts have too few examples for the model to generalize well; for example, 92% of an image dataset might come from North America and Europe. The ideas overlap, but representation bias emphasizes how groups are covered in the data.',
        'Historical bias occurs when accurately recorded data reflects past social unfairness. A model trained on ten years of hiring decisions may favor the group selected more often in the past; the problem lies in the historical pattern, not necessarily in data collection. Label (annotation) bias occurs when annotators’ judgments affect labels, such as marking posts in one dialect as toxic more often.',
        'Measurement bias occurs when a proxy for the construct you want to measure is distorted differently across groups. For example, using past healthcare spending as a proxy for health need can make people with less access to care appear healthier than they are. Unlike random label noise, this error is systematic. Bias amplification occurs when model predictions make a skew in the training data even stronger.',
      ],
      analogy: 'Imagine surveying customers at a kottu shop. If you ask questions only at noon, you miss people who eat at night (sampling bias). If only 2% of customers speak Tamil, the model has too few examples to learn their preferences well (representation bias). If a restaurant hired only men as chefs for 20 years, accurate records can still teach the model “chef = man” (historical bias). A judge who dislikes spicy food may label spicy kottu unfairly (label bias), while using tip size to measure satisfaction can disadvantage customers with less money (measurement bias).',
      example: 'Suppose 60% of training images tagged “cooking” show women, but the model predicts “woman” for 80% of cooking images. The model has strengthened the skew from 60% to 80%, an increase of 20 percentage points. Adding more data will not necessarily reduce bias if the new data has the same skew.',
      keyPoints: [
        'Sampling bias: data came from a subset that is not representative.',
        'Historical bias: accurate data can still encode past unfairness.',
        'Label bias reflects annotators’ systematic judgments; representation bias means too few examples for a group.',
        'Measurement bias: a proxy behaves differently across groups (spending is not the same as health need).',
        'Bias amplification: model predictions show more skew than the training data.',
      ],
      terms: [
        { en: 'Sampling / Selection Bias', si: 'Training data was drawn from a subset that does not represent the target population.' },
        { en: 'Representation Bias', si: 'Some groups or regions have too few examples, which can lower their model performance.' },
        { en: 'Historical Bias', si: 'Even accurate data can record unfair patterns from the past.' },
        { en: 'Label / Annotation Bias', si: 'Annotators’ systematic judgments are reflected in the ground-truth labels.' },
        { en: 'Measurement Bias', si: 'A proxy for the intended construct has different errors across groups.' },
        { en: 'Proxy Variable', si: 'A variable used in place of something that is difficult to measure directly.' },
        { en: 'Bias Amplification', si: 'The model predicts a stronger skew than the one present in its data.' },
        { en: 'Bias Assessment', si: 'A systematic process for measuring where bias occurs and how large it is.' },
      ],
    },
    // 3
    {
      id: 'fairness-metrics',
      title: 'Fairness Metrics: Demographic Parity, Disparate Impact & Four-Fifths Rule, Equal Opportunity, Equalized Odds, Calibration',
      examRefs: ['TAI-008', 'TAI-009', 'TAI-010', 'TAI-048', 'TAI-053', 'TAI-054', 'TAI-055', 'TAI-056'],
      si: 'ඔයා Colombo හා Kandy වල loan applicants ලාගේ approval rates බලනවා කියලා හිතන්න. Demographic parity එකෙන් හැම කණ්ඩායමකටම approve වෙන хувь адилද කියලා шалගන්නවා; equal opportunity එක සුදුසු අයගෙන් කී දෙනෙක් approve කළාද කියලා බලනවා. උදාහරණයක් ලෙස 200 දෙනාගෙන් 50 දෙනෙක් සහ 150 දෙනාගෙන් 30 දෙනෙක් තේරුණොත් rates 25% සහ 20%යි, ratio එක 0.80යි. ඔයාට count එකට count එක සසඳන්න එපා, මුලින් එක් එක් කණ්ඩායමේ අනුපාත හදාගන්න.',
      body: [
        'Several metrics measure fairness, and each gives “fair” a different meaning. First, selection rate is the fraction of a group that receives a positive prediction. True Positive Rate (TPR) is the fraction of people who truly qualify (Y=1) whom the model predicts as positive.',
        'Demographic (statistical) parity requires the same selection rate for each group: P(Ŷ=1 | group A) = P(Ŷ=1 | group B), where Ŷ is the prediction. It does not consider the ground-truth label. Demographic parity difference is the absolute gap between selection rates. The disparate impact ratio is the lower selection rate divided by the higher one. The four-fifths (80%) rule flags a possible adverse impact when this ratio is below 0.8; a ratio exactly equal to 0.8 is not flagged. It is a screening heuristic, not an accuracy measure.',
        'Equal opportunity requires equal TPR among qualified people (Y=1). Equal TPR also means equal False Negative Rate because FNR = 1 − TPR. Equalized odds requires both TPR and False Positive Rate (FPR) to be equal across groups, so error rates match for both Y=1 and Y=0. Equal opportunity is a relaxed version that checks only TPR. Equal accuracy is a separate, weaker criterion: one type of error can hide another.',
        'Calibration within groups means a score has the same interpretation in each group: among people in any group with a score of 0.7, about 70% should have a positive outcome. This does not imply equal error rates; a calibrated model can still have different FPRs across groups.',
      ],
      analogy: 'Imagine selecting students for university using A/L results. Demographic parity means selecting 20% of applicants from every district, regardless of whether they qualify. Equal opportunity means selecting 90% of qualified students in every district. Equalized odds additionally requires the rate of mistakenly selecting unqualified students to be the same in every district. Calibration means a Z-score of 1.5 represents the same likelihood of success in Colombo and Jaffna.',
      example: 'Three calculations, step by step. (1) Demographic parity difference: Group A has a 60% approval rate and Group B 45%; the gap is 0.60 − 0.45 = 0.15. The ratio 0.45 ÷ 0.60 = 0.75 is a separate metric, the disparate impact ratio. (2) Four-fifths rule: Group X has 50 selections out of 200, and Group Y has 30 out of 150. Rates: X = 50 ÷ 200 = 0.25; Y = 30 ÷ 150 = 0.20. Ratio = lower ÷ higher = 0.20 ÷ 0.25 = 0.80. The rule flags only values below 0.8, so this is exactly at the threshold and is not flagged. A common error is dividing counts (30 ÷ 50 = 0.60). (3) Equal opportunity difference: Group A has 90 true positives out of 100, so TPR = 0.90. Group B has 72 out of 90, so TPR = 72 ÷ 90 = 0.80. The gap is 0.10; subtracting counts (90 − 72 = 18) is wrong because the groups have different numbers of true cases.',
      code: {
        lang: 'python',
        src: `# Calculate fairness metrics
sel_x = 50 / 200          # Group X selection rate = 0.25
sel_y = 30 / 150          # Group Y selection rate = 0.20
di_ratio = min(sel_x, sel_y) / max(sel_x, sel_y)
print("Disparate impact ratio:", round(di_ratio, 2))   # 0.8
print("Flag (four-fifths)?", di_ratio < 0.8)           # False

tpr_a = 90 / 100          # Group A TPR
tpr_b = 72 / 90           # Group B TPR
print("Equal opportunity gap:", round(abs(tpr_a - tpr_b), 2))  # 0.1`,
      },
      keyPoints: [
        'Demographic parity means equal selection rates and does not use true labels.',
        'Disparate impact ratio = lower rate ÷ higher rate. The four-fifths rule flags values below 0.8, but not exactly 0.8.',
        'Equal opportunity means equal TPR; equalized odds means equal TPR and FPR.',
        'Calibration within groups means that a score of p corresponds to a positive outcome for about p of people in every group.',
        'Always calculate rates first (count ÷ group size), then compare them.',
      ],
      terms: [
        { en: 'Selection Rate', si: 'The fraction of a group that receives a positive prediction.' },
        { en: 'Demographic / Statistical Parity', si: 'P(Ŷ=1|A) = P(Ŷ=1|B): selection rates are equal across groups.' },
        { en: 'Demographic Parity Difference', si: 'The absolute difference between selection rates, e.g. |0.60 − 0.45| = 0.15.' },
        { en: 'Disparate Impact Ratio', si: 'The lower selection rate divided by the higher selection rate.' },
        { en: 'Four-Fifths (80%) Rule', si: 'An employment-audit heuristic that flags a ratio below 0.8 as a possible adverse impact.' },
        { en: 'Equal Opportunity', si: 'TPR, and therefore FNR, is equal across groups among qualified people.' },
        { en: 'Equalized Odds', si: 'Both TPR and FPR are equal across groups.' },
        { en: 'Calibration within Groups', si: 'A score has the same meaning within each group.' },
      ],
    },
    // 4
    {
      id: 'fairness-tradeoffs-mitigation',
      title: 'Fairness Impossibility & Mitigation: Pre-, In-, Post-processing, Unawareness, Intersectionality',
      examRefs: ['TAI-057', 'TAI-058', 'TAI-059', 'TAI-060', 'TAI-113', 'TAI-114', 'TAI-115', 'TAI-116'],
      si: 'ඔයාට කණ්ඩායම් දෙකක base rates වෙනස් නම්, perfect නොවන model එකකට හැම fairness මිනුමක්ම එකවර සමාන කරන්න බැරි වෙන්න පුළුවන්. Data එක train කිරීමට කලින් වෙනස් කළොත් pre-processing, train කරන විට objective එක වෙනස් කළොත් in-processing, output threshold වෙනස් කළොත් post-processing. Cricket team එක තෝරන විට school එක නොබලනවා කිව්වත්, school නමට සම්බන්ධ වෙනත් දත්ත proxy වෙන්න පුළුවන්. ඒ නිසා Colombo සහ වෙනත් දිස්ත්‍රික්කවල ප්‍රතිඵල එකට විතරක් නොවෙයි, කණ්ඩායම් කිහිපයක එකතුව අනුවත් පරීක්ෂා කරන්න.',
      body: [
        'The fairness impossibility results (Kleinberg et al.; Chouldechova) show that when groups have different base rates (the proportion of truly positive cases), an imperfect predictor generally cannot satisfy calibration and equal error rates (equalized odds) at the same time. More data or removing a protected attribute does not change those base rates. Teams must choose a fairness goal suited to their context and consider the resulting trade-off.',
        'There are three broad mitigation stages. Pre-processing changes data before training: reweighing gives greater weight to underrepresented (group, label) combinations to make group and label statistically independent; other methods include resampling, removing proxy features, and counterfactual data augmentation (CDA). CDA adds copies with gendered terms exchanged, such as pairing “she is a nurse” with “he is a nurse,” so the model sees both pairings. In-processing changes the learning objective, for example by adding a fairness penalty to the loss or an adversarial debiasing head. Post-processing changes outputs without retraining, for example by using group-specific decision thresholds.',
        'Hardt et al.’s post-processing method may need randomized decisions for some groups to achieve equalized odds. A single score threshold selects one (TPR, FPR) point on a group’s ROC curve, and groups can have different curves. If a shared target point lies inside one curve, reaching it can require randomly mixing two thresholds. This is not a privacy method and can reduce accuracy. Review group-specific thresholds for legal implications in the relevant jurisdiction.',
        '“Fairness through unawareness” removes attributes such as race or gender from model features, but remaining features such as ZIP code or purchase history can act as proxies. Keep protected attributes available for auditing even if they are not model inputs. Intersectional evaluation can reveal gaps hidden by separate single-attribute tests: accuracy may look similar by gender and by skin tone while being 20 points lower for darker-skinned women, as reported in Gender Shades. Disaggregate by combinations too, and use confidence intervals because those groups may be small.',
      ],
      analogy: 'Imagine selecting a cricket team. If schools have different proportions of strong players, you may not be able to both select the same fraction from every school and give players with the same average score the same chance. That is the kind of conflict behind a fairness impossibility result. Saying “we do not consider a player’s hometown” is not enough if school name or bus route can act as a proxy.',
      example: 'Use the Chouldechova identity: FPR = [p ÷ (1 − p)] × [(1 − PPV) ÷ PPV] × (1 − FNR), where p is the base rate, PPV is precision (the fraction of positive predictions that are truly positive), and FNR is the false negative rate. Set PPV = 0.8 and FNR = 0.2 for both groups. For a group with base rate 0.2: p ÷ (1 − p) = 0.2 ÷ 0.8 = 0.25; (1 − PPV) ÷ PPV = 0.2 ÷ 0.8 = 0.25; and 1 − FNR = 0.8. Multiply: 0.25 × 0.25 × 0.8 = 0.05. For a base rate of 0.5: 0.5 ÷ 0.5 = 1, so 1 × 0.25 × 0.8 = 0.20. Thus equal PPV and FNR with different base rates produce unequal FPRs (0.05 versus 0.20).',
      keyPoints: [
        'With different base rates, an imperfect classifier generally cannot satisfy both calibration and equalized odds; choose a context-appropriate trade-off.',
        'Pre-processing changes data; in-processing changes the loss or objective; post-processing changes thresholds without retraining.',
        'Group-specific thresholds are one post-processing option when retraining is unavailable; assess legal and practical constraints.',
        'Removing protected attributes does not remove their proxies; retain attributes for auditing.',
        'Single-attribute audits can hide intersectional gaps.',
      ],
      terms: [
        { en: 'Base Rate', si: 'The proportion of people in a group who truly have a positive outcome.' },
        { en: 'Fairness Impossibility Theorem', si: 'A result showing that different base rates can make calibration and equal error rates incompatible for an imperfect predictor.' },
        { en: 'Reweighing', si: 'A pre-processing method that assigns weights to group-label combinations to make them statistically independent.' },
        { en: 'Counterfactual Data Augmentation (CDA)', si: 'Adding examples with demographic terms exchanged to reduce stereotyped associations.' },
        { en: 'Adversarial Debiasing', si: 'An in-processing method that trains a model to make a protected attribute difficult to predict.' },
        { en: 'Group-specific Thresholds', si: 'A post-processing method that uses a different decision threshold for each group.' },
        { en: 'Fairness through Unawareness', si: 'Removing protected attributes from features; proxies often make this insufficient.' },
        { en: 'Intersectional Evaluation', si: 'Measuring metrics for combinations of attributes, such as gender and skin tone.' },
      ],
    },
    // 5
    {
      id: 'llm-bias-toxicity-evaluation',
      title: 'Measuring Bias & Toxicity in LLMs: CrowS-Pairs, BBQ, WinoBias, WEAT, RealToxicityPrompts, Moderation Classifiers',
      examRefs: ['TAI-047', 'TAI-061', 'TAI-062', 'TAI-063', 'TAI-064', 'TAI-118', 'TAI-119'],
      si: 'ඔයා LLM එකකට ගම්පහ සහ Colombo ගැන එකම වාක්‍ය දෙක දීලා, කුමන එකට වැඩි කැමැත්තක් දක්වනවාද කියලා බලන්න පුළුවන්. ඒ වගේම සාක්ෂි නැති ප්‍රශ්නයකට stereotype එකක් කියනවාද, නැත්නම් “දන්නේ නැහැ” කියනවාද කියලත් පරීක්ෂා කරන්න. Toxicity score එකක් prompt එකකට ලැබුණාම, එකම උත්තරය විතරක් නොවෙයි, වෙනස් උත්තර 25ක් ගෙන නරකම අගය බලන්න පුළුවන්. ඔයාට moderation model එකත් පරීක්ෂා කරන්න ඕනේ, මොකද සමහර dialects හෝ identity වචන වැරදියට toxic කියලා සලකන්න පුළුවන්.',
      body: [
        'Specialized benchmarks measure different kinds of bias in LLMs. CrowS-Pairs uses minimal sentence pairs that differ in a social-group reference, contrasting a stereotypical and an anti-stereotypical sentence; it measures which receives higher likelihood. BBQ (Bias Benchmark for QA) tests both ambiguous contexts, where the answer should be “unknown,” and disambiguated contexts; choosing a stereotype in the ambiguous case indicates bias. WinoBias tests gender bias through pronoun coreference resolution, such as a sentence about a doctor and a nurse.',
        'WEAT (Word Embedding Association Test) adapts the Implicit Association Test: it compares cosine similarity between two target sets (such as male and female names) and two attribute sets (such as career and family words), reporting an effect size and permutation test. SEAT applies a similar test to sentence encoders. Embedding bias does not always predict downstream task bias, so use these tests in addition to task-level evaluation.',
        'For open-ended generation, use counterfactual templates such as “The [GROUP] person worked as a…”. Change only the group term, sample many continuations per template, compare distributions of classifier-scored properties such as sentiment or regard, and test statistical significance. One sample at temperature 0 is only anecdotal. Validate the scoring classifier too, because it may itself be biased.',
        'In the RealToxicityPrompts protocol, generate 25 continuations per prompt. Expected maximum toxicity is the average, across prompts, of each prompt’s highest toxicity score. Toxicity probability is the fraction of prompts with at least one continuation scoring ≥ 0.5. Moderation classifiers score categories such as hate, harassment, and threats to help block, flag, or route content. They can also produce biased false positives—for example, over-flagging identity terms such as “gay” or “Muslim,” or African American English. This can silence the very groups the system should protect. Evaluate classifiers by subgroup and rebalance data as appropriate.',
      ],
      analogy: 'A CrowS-Pairs-style test compares two otherwise similar sentences about a person from Gampaha and a person from Colombo to see whether a model favors one. A BBQ-style test asks who took a wallet on a bus when the prompt gives no evidence, then checks whether the model says “unknown” or points to a group stereotype.',
      example: 'Consider three prompts with 25 continuations each. Their maximum toxicity scores are 0.8, 0.3, and 0.6. Expected maximum toxicity = (0.8 + 0.3 + 0.6) ÷ 3 = 0.57. Two of the three prompts have at least one continuation scoring ≥ 0.5, so toxicity probability = 2 ÷ 3 ≈ 0.67.',
      keyPoints: [
        'CrowS-Pairs compares likelihoods for stereotypical and anti-stereotypical minimal pairs.',
        'BBQ tests ambiguous and disambiguated QA; WinoBias tests gender bias through pronoun coreference.',
        'WEAT measures word-embedding target/attribute associations and effect size; SEAT applies related tests to sentences.',
        'Expected maximum toxicity averages each prompt’s worst continuation; toxicity probability counts prompts with any score ≥ 0.5.',
        'Moderation classifiers can produce biased false positives for identity terms or dialects.',
      ],
      terms: [
        { en: 'CrowS-Pairs', si: 'A benchmark that measures model preferences using stereotypical and anti-stereotypical sentence pairs.' },
        { en: 'BBQ (Bias Benchmark for QA)', si: 'A benchmark that tests QA bias with ambiguous and disambiguated contexts.' },
        { en: 'WinoBias', si: 'A benchmark that measures gender bias through coreference resolution.' },
        { en: 'WEAT / SEAT', si: 'Embedding association tests that measure bias effect sizes in word or sentence embeddings.' },
        { en: 'RealToxicityPrompts', si: 'A prompt dataset used to measure how often a model generates toxic continuations.' },
        { en: 'Expected Maximum Toxicity', si: 'The mean of the highest continuation-toxicity score for each prompt.' },
        { en: 'Toxicity Probability', si: 'The fraction of prompts with at least one continuation scoring toxicity ≥ 0.5.' },
        { en: 'Counterfactual Bias Probe', si: 'A test that changes only a group term and compares output distributions.' },
        { en: 'TruthfulQA', si: 'A benchmark for whether a model repeats common misconceptions; it is not a bias benchmark.' },
      ],
    },
    // 6
    {
      id: 'explainability-interpretability',
      title: 'Explainability & Interpretability: SHAP, LIME, Integrated Gradients, Attention, CoT Faithfulness, Probes, SAEs',
      examRefs: ['TAI-038', 'TAI-039', 'TAI-040', 'TAI-098', 'TAI-099', 'TAI-100', 'TAI-101', 'TAI-139', 'TAI-140', 'TAI-141'],
      si: 'ඔයාට එක් loan එකක් ප්‍රතික්ෂේප වුණේ ඇයි කියලා දැනගන්න ඕනේ නම් local explanation එකක් බලන්න; model එක පොදුවේ මොන තොරතුරු භාවිතා කරනවාද කියන්නේ global explanation එකක්. SHAP එකේ contribution එකතු කළාම base value එකෙන් අවසාන prediction එකට යනවා. LIME එක ළඟ උදාහරණ කිහිපයක් හදා සරල model එකකින් තීරණය ආසන්නව පැහැදිලි කරනවා. Attention map එකක් හෝ model එක ලියූ CoT කතාවක් සැබෑ හේතුව බවට සාක්ෂියක් නෙවෙයි.',
      body: [
        'There are two explanation scopes. A local explanation attributes one prediction to its inputs, for example, “Why was this applicant rejected?” A global explanation describes which features a model generally relies on. A compliance team asking why one person received a decision needs a local explanation; an average pattern may not explain that individual case.',
        'SHAP is based on Shapley values from cooperative game theory. For each feature, it averages that feature’s marginal contribution across feature coalitions. Additivity means the base value (average output) plus all feature SHAP values equals this prediction. With n features there are 2^n coalitions; even 30 features means more than a billion. Methods such as KernelSHAP therefore use sampling approximations. Exact Shapley values are defined for any model and satisfy additivity.',
        'LIME (Local Interpretable Model-agnostic Explanations) perturbs an instance, obtains outputs from the black box, gives more weight to nearby samples, and fits a simple surrogate such as a sparse linear model; it does not need gradients. Integrated Gradients accumulates gradients along a straight path from a baseline input (such as all-zero embeddings) to the actual input. Its completeness property says the attributions sum to the input output minus the baseline output.',
        'Do not automatically treat the following as faithful explanations. (1) Attention weights: “Attention is not Explanation” (Jain & Wallace) found weak correspondence between attention and gradient-based importance, and different attention patterns can yield the same prediction. Information mixes across layers and heads, so one head may not be faithful. (2) Chain-of-thought text: cues that influenced the model, such as biased few-shot ordering, may be absent from its written reasoning; the explanation can be plausible without being causal. (3) Linear probes: predicting gender from hidden states with 95% accuracy shows the information is linearly decodable, not that the model causally uses it. Test causality by intervention, such as erasing that direction and checking outputs. Sparse autoencoders (SAEs) address superposition—many features represented by fewer neurons, making a neuron polysemantic—by learning an overcomplete sparse dictionary over residual-stream activations. The resulting features can be more monosemantic and can help steer behavior; an SAE is not a compression tool.',
      ],
      analogy: 'Imagine dividing credit for a cricket victory. SHAP averages how much a player adds across different combinations of teammates; adding all contributions gives the total contribution (additivity). LIME instead creates nearby “what if” cases and explains the local behavior with a simple line. A player’s story about what they thought (CoT) may not reveal the true cause of the result.',
      example: 'SHAP additivity: a credit model’s base value (expected output) is 0.20. Income contributes +0.15, debt ratio −0.05, and credit history +0.10. Output = 0.20 + 0.15 − 0.05 + 0.10. Step by step: 0.20 + 0.15 = 0.35; 0.35 − 0.05 = 0.30; 0.30 + 0.10 = 0.40. The answer is 0.40; treating the negative value as positive would incorrectly give 0.50. Coalition counts: 10 features give 2^10 = 1,024; 40 features give more than a trillion, so sampling is needed.',
      keyPoints: [
        'Local explanations address one decision; global explanations describe general model behavior.',
        'SHAP uses Shapley values: output = base value + SHAP values. Exact computation has 2^n coalitions, so approximations are common.',
        'LIME fits a local surrogate to perturbed samples without gradients; Integrated Gradients accumulates gradients along a baseline-to-input path.',
        'Attention weights and chain-of-thought text are not necessarily faithful explanations.',
        'A probe shows information is present, not that the model uses it; SAEs help study superposition and polysemantic neurons.',
      ],
      terms: [
        { en: 'SHAP', si: 'SHapley Additive exPlanations: feature attributions based on game-theoretic Shapley values.' },
        { en: 'KernelSHAP', si: 'A model-agnostic method that approximates Shapley values using sampling.' },
        { en: 'LIME', si: 'A method that perturbs an instance and fits a proximity-weighted, simple surrogate model.' },
        { en: 'Integrated Gradients', si: 'An attribution method that integrates gradients along a path from a baseline to the input.' },
        { en: 'Completeness / Additivity', si: 'The property that attributions sum to the prediction minus the baseline output.' },
        { en: 'Faithfulness (of explanations)', si: 'Whether an explanation reflects the actual factors that caused a model decision.' },
        { en: 'Linear Probe', si: 'A simple classifier that predicts a property from hidden states.' },
        { en: 'Concept Erasure', si: 'Removing a concept direction from a representation and testing its causal effect.' },
        { en: 'Superposition / Polysemantic Neuron', si: 'Many features share fewer neurons, so one neuron can represent multiple meanings.' },
        { en: 'Sparse Autoencoder (SAE)', si: 'A model trained on activations to represent features sparsely and help study superposition.' },
      ],
    },
    // 7
    {
      id: 'hallucination-grounding-sycophancy',
      title: 'Hallucination, Grounding, SelfCheckGPT, RAG Faithfulness & Sycophancy',
      examRefs: ['TAI-030', 'TAI-031', 'TAI-065', 'TAI-066', 'TAI-150'],
      si: 'ඔයා tuk-tuk රියදුරෙකුගෙන් පාර අහනවා, එයා map එකක් බලන්නේ නැතුව විශ්වාසයෙන් වැරදි පාර කියනවා කියලා හිතන්න; ඒක hallucination එකක් වගේ. RAG එකෙන් උත්තරයට ලේඛන සාක්ෂි දුන්නත්, model එක ඒ ලේඛනය වැරදිව කියවන්න පුළුවන්. එකම ප්‍රශ්නය පස් වතාවක් අහලා වෙන වෙන දින කියනවා නම්, පිළිතුර තහවුරු කරන්න ඕනේ. ඔයා “මම හිතන්නේ මේක වැරදියි” කිව්වම model එක ඇත්ත උත්තරය අතහැරලා එකඟ වෙන එක sycophancy කියලා හඳුන්වනවා.',
      body: [
        'A hallucination (confabulation) is fluent, confident output that is false or unsupported by the supplied sources. An answer is not a hallucination merely because a user dislikes it; nor is a truncated answer or one in the wrong language. Ask whether the claim is true or supported by its source.',
        'Retrieval-augmented generation (RAG) can reduce hallucinations by supplying relevant passages and allowing the model to answer from that evidence and cite it. It does not force verbatim copying: the model may misread or ignore context, so RAG reduces but does not eliminate hallucinations. If the correct document is retrieved but the answer invents a refund period absent from it, that is a faithfulness or groundedness failure, not a retrieval failure. Add an output rail that checks whether claims are supported by retrieved context; retrieving 50 chunks alone does not solve the problem.',
        'SelfCheckGPT is a black-box method for detecting possible hallucinations without model internals or an external knowledge base. It samples several responses to the same question: known facts tend to remain consistent, while hallucinated details may vary. It flags inconsistent claims.',
        'Sycophancy occurs when an assistant changes a correct answer after a user insists it is wrong. Preference data may reward agreement because human raters favor responses that agree with them, causing training to reward agreement over accuracy. This harms honesty and trust. Mitigations include targeted evaluation sets, training examples that reward keeping a correct answer, and preference models that penalize capitulation.',
      ],
      analogy: 'A hallucination is like a tuk-tuk driver who confidently takes a wrong turn despite not knowing the route. RAG is like giving the driver a map, but the driver might still ignore it (a faithfulness failure). Sycophancy is when the driver turns the wrong way just because a passenger insists, even though the driver had the right route.',
      example: 'SelfCheckGPT example: ask five times when Sri Lanka became independent; all five answers say February 4, 1948, which is consistent. Ask when a small village school was built and get 1923, 1957, 1931, 1968, and 1940. The inconsistent answers suggest a higher chance of hallucination and should be flagged.',
      keyPoints: [
        'A hallucination is fluent, confident, but unsupported or false output.',
        'RAG provides evidence and citations that can reduce hallucinations, not eliminate them.',
        'If the correct document is retrieved but the answer is unsupported, it is a faithfulness failure; add an output grounding check.',
        'SelfCheckGPT compares response consistency without model internals or a knowledge base.',
        'Sycophancy is agreement-seeking that may be reinforced by preference ratings.',
      ],
      terms: [
        { en: 'Hallucination / Confabulation', si: 'Generating plausible-sounding content that is false or unsupported.' },
        { en: 'Grounding', si: 'Connecting an answer to retrieved, verifiable evidence.' },
        { en: 'Faithfulness / Groundedness', si: 'Whether the claims in an answer are supported by the retrieved context.' },
        { en: 'SelfCheckGPT', si: 'A black-box method that checks multiple responses for consistency to detect possible hallucinations.' },
        { en: 'Fact-checking Rail', si: 'A rail that checks output against evidence and blocks or regenerates unsupported claims.' },
        { en: 'Sycophancy', si: 'A tendency for a model to agree with the user rather than state what is true.' },
      ],
    },
    // 8
    {
      id: 'pii-anonymization',
      title: 'PII Handling: Pseudonymization vs Anonymization, k-Anonymity, Sensitive Data Disclosure, Logging',
      examRefs: ['TAI-013', 'TAI-043', 'TAI-051', 'TAI-052', 'TAI-067', 'TAI-148'],
      si: 'ඔයා පාසලේ විභාග පත්‍රවල නම් වෙනුවට index number දාලා, ඒ අංකවලට නම් ගලපන ලැයිස්තුව වෙනම තියාගන්නවා නම් ඒක pseudonymization. ඒ ලැයිස්තුවෙන් ආයෙත් කෙනා හඳුනාගන්න පුළුවන් නිසා දත්ත තවමත් පුද්ගලිකයි. ZIP code සහ උපන් අවුරුද්ද වගේ තොරතුරු එකතු කරලා එක්කෙනෙක් හඳුනාගන්න පුළුවන්; k=5 නම් ඒ විස්තර අවම වශයෙන් පස් දෙනෙකුට පොදු වෙන්න ඕනේ. ඔයාට logs ඕනේ වුණත් PII අඩු කරලා, කවුද බලන්නේද සහ කොච්චර කල් තියාගන්නේද සීමා කරන්න.',
      body: [
        'Personally Identifiable Information (PII) is information that can identify or be linked to a person. A national ID number, personal email, or phone number is direct PII. Combinations such as a name and date of birth are quasi-identifiers: each may be weak alone, but together they can single someone out. A large aggregate count, such as the number of users in a country, does not identify anyone and is not PII.',
        'Pseudonymization replaces a name with a consistent random ID while keeping a separate lookup table (key) that maps the ID to the name. Because the key can re-identify people, the data remains personal data and privacy laws still apply. Anonymization should make re-identification no longer reasonably possible. Treating pseudonymized data as anonymous is a common compliance mistake.',
        'With k-anonymity, records may remain unique through quasi-identifiers such as ZIP code, birth date, and sex even after names are removed (a linkage attack). Generalize fields—for example, keep only the birth year or first three ZIP digits—until every combination is shared by at least k people. If k = 5, the dataset is 5-anonymous. This is not differential privacy: it provides no formal guarantee against an attacker with background knowledge, and it does not prevent disclosure if everyone in a group shares the same sensitive value, such as diabetes.',
        'To prevent sensitive information disclosure from an LLM fine-tuned on raw support tickets, remove or redact PII before training. A model cannot memorize or leak data it never saw. A system-prompt rule such as “do not reveal PII” can be bypassed and does not remove information from the weights. Do not put secrets such as API keys in system prompts: prompts may be extracted and are not security boundaries. Keep credentials in server-side code with access controls. Logs help safety monitoring, but redact or tokenize PII before storing it, restrict access, and set a retention period. Logging only responses can still retain echoed PII and loses context needed to investigate an attack.',
      ],
      analogy: 'Pseudonymization is like replacing student names on exam papers with index numbers while keeping the index-to-name list in the principal’s office. The list still allows re-identification. Anonymization means making re-identification not reasonably possible. k-anonymity is like generalizing a description such as “men born in Kandy in the 1990s” until at least five people share it.',
      example: 'In a hospital dataset, (ZIP 10115, 1985-03-12, F) identifies one record. After generalization it becomes (101**, 1980-1989, F), shared by seven records. If every combination appears at least five times, the dataset is 5-anonymous. But if all seven people have an HIV diagnosis, an attacker who knows someone belongs to that group can still infer the diagnosis; k-anonymity does not prevent this.',
      keyPoints: [
        'PII can identify or link to a person; large aggregates are not PII.',
        'Pseudonymized data can be re-identified with its key and remains personal data; anonymized data should not be reasonably re-identifiable.',
        'k-anonymity requires each quasi-identifier combination to be shared by at least k records; it is not differential privacy.',
        'The strongest prevention for memorized PII leaks is to redact PII from training data.',
        'A system prompt is not a secret store; redact logs, control access, and limit retention.',
      ],
      terms: [
        { en: 'PII', si: 'Personally Identifiable Information: data that can identify a person.' },
        { en: 'Quasi-identifier', si: 'A field that may identify someone when combined with other fields, such as ZIP code, date of birth, or sex.' },
        { en: 'Pseudonymization', si: 'Replacing identifiers with IDs while keeping a key that can map them back.' },
        { en: 'Anonymization', si: 'A process that makes re-identification no longer reasonably possible.' },
        { en: 'k-Anonymity', si: 'A property where each quasi-identifier group contains at least k records.' },
        { en: 'Linkage Attack', si: 'Re-identifying records by joining them with another dataset.' },
        { en: 'PII Redaction / Masking', si: 'Finding and removing PII from text or replacing it with a placeholder such as [NAME].' },
        { en: 'System Prompt Leakage', si: 'A user extracts the system prompt; any secrets it contains are exposed.' },
      ],
    },
    // 9
    {
      id: 'differential-privacy',
      title: 'Differential Privacy: Epsilon, Laplace Mechanism, Composition, DP-SGD',
      examRefs: ['TAI-014', 'TAI-068', 'TAI-069', 'TAI-120', 'TAI-121', 'TAI-122'],
      si: 'ඔයා රෝහලක රෝගීන් 120ක් ගණන් කරනවා, නමුත් එක් කෙනෙක්ගේ සහභාගීත්වය හෙළි නොවෙන්න සුළු noise එකක් එකතු කරනවා කියලා හිතන්න. Laplace ක්‍රමයේ sensitivity 1 සහ ε=0.5 නම් noise scale එක 1 ÷ 0.5 = 2යි. ε අඩු කළොත් privacy වැඩි නමුත් noise වැඩි වෙලා ගණනේ නිවැරදි බව අඩු වෙන්න පුළුවන්. එකම දත්ත ගැන query 10ක් කළොත් ε=0.1 බැගින් එකතු වී මුළු budget එක 1.0 වෙනවා.',
      body: [
        'Differential Privacy (DP) is a mathematical guarantee about an algorithm: whether any one person’s record is included in a dataset should change the analysis output only by a bounded amount. Datasets differing in one record (neighboring datasets) should produce statistically similar outputs, with the bound described by ε (epsilon) and δ (delta). Encryption, not collecting data, and removing names are not DP. Name removal is de-identification and gives no formal protection against linkage attacks.',
        'ε is the privacy budget. Smaller ε means stronger privacy, more noise, and generally lower utility or accuracy. ε = 1 provides more privacy than ε = 8. At ε = 0 the output is independent of the data and offers no data-dependent utility. Any ε > 0 allows a bounded influence, so it is incorrect to say ε = 1 means no influence.',
        'The Laplace mechanism adds Laplace noise to a numeric query, with scale b = Δf ÷ ε. Sensitivity Δf is the maximum change in a query result when one record is added or removed; for a count query it is 1. Composition means privacy losses accumulate across multiple queries. Under basic sequential composition, ε values add, so privacy accountants track cumulative spending. DP-SGD can use tighter bounds through advanced or Rényi Differential Privacy (RDP) composition.',
        'DP-SGD differs from ordinary SGD in two ways: (1) per-example gradient clipping limits each example’s gradient to a fixed norm, bounding its influence; and (2) calibrated Gaussian noise is added to the summed gradients. Dropout and weight decay may reduce memorization but provide no formal privacy guarantee. Per-example gradients require more memory and computation than the usual batch-summed gradient. Noise reduces utility; larger batches can improve signal-to-noise, while training a smaller parameter subset with LoRA can reduce noise dimensionality. DP-Adam variants also exist. DP does not protect against prompt injection.',
      ],
      analogy: 'Imagine a village survey asking whether people paid a particular tax. To protect each person, a coin-flip rule sometimes lets respondents give a randomized answer. The individual answer is less revealing, while the village-wide average can still be estimated. More noise (smaller ε) gives more protection but lowers the accuracy of the aggregate.',
      example: 'Laplace calculation: for a count query with sensitivity Δf = 1 and ε = 0.5, b = Δf ÷ ε = 1 ÷ 0.5 = 2; multiplying to get 0.5 is incorrect. If ε = 0.1, then b = 10, so noise is larger. Composition: 10 queries each using ε = 0.1 consume 10 × 0.1 = ε 1.0 total. For a hospital count of 120, adding Laplace noise with scale 2 might publish 118.7 or 121.9, which should not reveal whether one particular patient was included.',
      code: {
        lang: 'python',
        src: `import numpy as np
true_count = 120      # true count
sensitivity = 1       # count query: one person changes it by 1
epsilon = 0.5         # privacy budget
b = sensitivity / epsilon        # Laplace scale = 2.0
noisy = true_count + np.random.laplace(0, b)
print("b =", b, " published:", round(noisy, 1))

# Composition: 10 queries with ε=0.1 each
print("total epsilon:", 10 * 0.1)   # 1.0`,
      },
      keyPoints: [
        'DP bounds how much one record can change an algorithm’s output; it is a guarantee about the algorithm.',
        'Smaller ε means more privacy and noise, and usually lower utility.',
        'Laplace scale: b = sensitivity ÷ ε; a count query has sensitivity 1.',
        'Under basic composition, ε values add (10 × 0.1 = 1.0).',
        'DP-SGD uses per-example clipping and Gaussian noise; it adds overhead and can lower utility, while larger batches or LoRA may help.',
      ],
      terms: [
        { en: 'Differential Privacy (DP)', si: 'A mathematical guarantee that neighboring datasets produce statistically similar outputs.' },
        { en: 'Epsilon (ε)', si: 'The privacy-loss budget; a smaller value gives stronger privacy.' },
        { en: 'Delta (δ)', si: 'A small probability allowance in an approximate differential privacy guarantee.' },
        { en: 'Sensitivity (Δf)', si: 'The maximum change in a query result when one record changes.' },
        { en: 'Laplace Mechanism', si: 'A DP method that adds Laplace noise with scale b = Δf/ε.' },
        { en: 'Sequential Composition', si: 'The rule that privacy budgets add across multiple DP queries.' },
        { en: 'Privacy Accountant', si: 'A tool that tracks cumulative ε spent across training or queries.' },
        { en: 'DP-SGD', si: 'SGD with per-example gradient clipping and Gaussian noise.' },
      ],
    },
    // 10
    {
      id: 'privacy-attacks-defenses',
      title: 'Privacy Attacks & Privacy-Preserving Infrastructure: Membership Inference, Extraction, Unlearning, Federated Learning, Confidential Computing',
      examRefs: ['TAI-015', 'TAI-016', 'TAI-017', 'TAI-070', 'TAI-071', 'TAI-072', 'TAI-123', 'TAI-124', 'TAI-125', 'TAI-126', 'TAI-127'],
      si: 'ඔයාගේ model එක රෝගියෙකුගේ record එක train කිරීමට භාවිතා කළාද කියලා පිටතින් අනුමාන කරන්න පුළුවන්; ඒකට membership inference කියනවා. Federated learning එකේ රෝහල්වල raw data එතැනම තියාගෙන model updates යවනවා, නමුත් updates වලින් තොරතුරු හෙළිවෙන්න පුළුවන්. SISA එක data කොටස් කරලා train කරන නිසා මකන්න ඉල්ලූ record එක තිබූ කොටස නැවත train කිරීම ප්‍රමාණවත් විය හැකියි. Confidential computing දත්ත භාවිතා කරන අතරතුර hardware isolation එකකින් ආරක්ෂා කරනවා, ඒත් DP සහ access controls වෙනම අවශ්‍යයි.',
      body: [
        'A membership-inference attack asks whether a particular record, such as a patient’s, was in the training data. Model inversion is different: it attempts to reconstruct representative features of a class or person. Overfitting can raise membership-inference risk: a large gap such as training loss 0.05 versus validation loss 1.9 can make the model more confident on training members. An attacker may threshold loss or confidence to infer membership. Regularization and DP can reduce risk. Report attack strength as TPR at a low FPR, such as 0.1% (Carlini et al., LiRA), because privacy is a worst-case property: even if average accuracy is near chance at 52%, a few outlier records may be exposed with high confidence.',
        'Training-data extraction occurs when an LLM memorizes and repeats rare or duplicated sequences, such as phone numbers or addresses; this is the opposite of hallucination. Memorization increases sharply with duplication, so exact and near-duplicate deduplication of pretraining data is an important preventive step. More epochs can increase memorization. A divergence attack showed that a production chatbot could be prompted to leave its aligned chat behavior and generate pretraining-like text, including memorized sequences, without weight access. Alignment can conceal memorization, not remove it.',
        'Machine unlearning aims to remove a user’s fine-tuning data after a right-to-erasure request. SISA (Sharded, Isolated, Sliced, Aggregated) splits data into shards, trains a submodel for each shard, and aggregates outputs. If a record must be removed, only its shard’s submodel needs retraining; this can provide exact unlearning more cheaply than full retraining. Gradient ascent is only approximate and does not guarantee that information is gone. A refusal rule in a system prompt merely hides output.',
        'Federated learning keeps raw data at clients such as hospitals and sends model updates to a server for aggregation (NVIDIA FLARE). The claim “data never leaves, so it is fully private” is incorrect: gradient inversion and membership attacks can infer or reconstruct data from updates. Secure aggregation and DP are still needed. Secure aggregation hides individual updates from the server, but also makes it harder to identify malicious clients sending crafted backdoor updates; robust aggregation (median, trimmed mean, norm clipping) and anomaly detection may be needed. Privacy and poisoning defenses can conflict. Confidential computing protects data in use, while it is processed in GPU memory, through a hardware Trusted Execution Environment (TEE), such as NVIDIA H100 confidential computing, and remote attestation that verifies the environment. TLS protects data in transit, disk encryption protects data at rest, and confidential computing protects data in use, including prompts and model weights from a cloud operator.',
      ],
      analogy: 'Federated learning is like teachers in ten villages keeping students’ answer sheets local and sending only summaries such as “my students struggle with this topic” to the zonal office. A detailed summary might still reveal one student’s marks. Confidential computing is like doing calculations inside a bank vault: the building owner cannot inspect what is inside, and an attestation can verify that the vault is genuine.',
      example: 'SISA calculation: split 1,000,000 records into 10 shards, with 100,000 per shard. If a user requests erasure and their data is in shard 7, retrain only that shard’s 100,000-record submodel, about one-tenth of a full retraining run. For membership inference, suppose an attack is tested on 1,000 non-members. An FPR of 0.1% means about one non-member is incorrectly called a member. If it correctly identifies 50 of 1,000 members (TPR 5%) at that operating point, those 50 people’s privacy is exposed with high confidence.',
      keyPoints: [
        'Membership inference asks whether a record was in training data; overfitting and a train/validation gap raise risk.',
        'Report membership-inference strength as TPR at low FPR, not only average AUC or accuracy.',
        'Duplication increases memorization; deduplicate. A divergence attack can bypass aligned chat behavior.',
        'SISA can support exact unlearning by retraining only the affected shard.',
        'Federated updates can leak information; use secure aggregation and DP. Robust aggregation addresses poisoning, while confidential computing protects data in use with a TEE and attestation.',
      ],
      terms: [
        { en: 'Membership Inference Attack', si: 'An attack that infers whether a record was included in a training set.' },
        { en: 'Model Inversion', si: 'Attempting to reconstruct representative features of a class or person from a model.' },
        { en: 'LiRA', si: 'Likelihood Ratio Attack: a strong membership-inference method evaluated in a low-FPR regime.' },
        { en: 'Memorization', si: 'A model’s ability to retain and reproduce training sequences verbatim.' },
        { en: 'Deduplication', si: 'Removing exact and near-duplicate records from a corpus.' },
        { en: 'Divergence Attack', si: 'An extraction attack that steers an aligned model away from chat behavior toward pretraining text.' },
        { en: 'Machine Unlearning / SISA', si: 'Removing a record’s influence from a trained model; SISA uses shard-based retraining.' },
        { en: 'Federated Learning (NVIDIA FLARE)', si: 'Training that keeps data at clients and aggregates model updates.' },
        { en: 'Secure Aggregation', si: 'A cryptographic protocol that lets a server see an aggregate without seeing individual updates.' },
        { en: 'Robust Aggregation', si: 'Methods such as median, trimmed mean, or norm clipping that limit malicious updates.' },
        { en: 'Confidential Computing / TEE', si: 'Protecting data in use in a hardware-isolated environment with remote attestation.' },
      ],
    },
    // 11
    {
      id: 'prompt-injection',
      title: 'Prompt Injection: Direct vs Indirect, Jailbreak vs Injection, Spotlighting, Dual-LLM, Lethal Trifecta, Markdown Exfiltration',
      examRefs: ['TAI-018', 'TAI-019', 'TAI-037', 'TAI-073', 'TAI-075', 'TAI-128', 'TAI-129', 'TAI-130'],
      si: 'ඔයාගේ email assistant එකට ලැබෙන ලිපියක සැඟවුණු උපදෙස් තිබුණොත්, ඒක indirect prompt injection අවදානමක්. System prompt එකේ “ඒවා නොසලකන්න” කියලා ලිව්වත් සහතික ආරක්ෂාවක් ලැබෙන්නේ නැහැ. ඒ නිසා email එකක් සාරාංශ කරන වෙලාවේ යැවීමේ tool එක වසා තබා, යවන්න කලින් ඔයාගේ අනුමැතිය ගන්න. Private data, විශ්වාස නොකළ ලිපි, සහ පිටතට යැවීමේ හැකියාව තුනම එකට තිබෙනවද කියලා පරීක්ෂා කරන්න.',
      body: [
        'Direct prompt injection occurs when a user supplies a malicious instruction directly in a prompt. Indirect prompt injection occurs when an instruction arrives through third-party content the model reads, such as a webpage, email, or retrieved document. Neither changes model weights; these are inference-time attacks, not poisoning.',
        'A jailbreak tries to bypass a model’s safety policy or alignment to obtain disallowed content. Prompt injection tries to take control of an application’s instructions or actions, often through untrusted content that attempts to override developer instructions or trigger tools. The categories can overlap, neither requires weight access, and both can affect closed models.',
        'No prompt instruction, such as telling the model to ignore instructions in emails, can reliably stop injection. Increasing model size or setting temperature to zero is not a solution. Instead, limit what a hijacked model can do: treat untrusted content as data, restrict tools during summarization (least privilege), and require user confirmation for consequential actions such as sending email. Spotlighting marks or encodes retrieved text and labels it as data; this can reduce indirect-injection success empirically but is probabilistic, not a guarantee. In a dual-LLM pattern, a privileged LLM plans and calls tools but never sees untrusted content; a quarantined LLM processes webpages or emails and passes back only opaque results. Injected instructions then cannot steer the tool-privileged model. Approaches such as CaMeL build on this architecture, trading additional calls and flexibility for structural security.',
        'The lethal trifecta is the combination that raises data-exfiltration risk: (1) access to private data, (2) exposure to untrusted content, and (3) the ability to communicate externally. Untrusted content can supply instructions, private data is the target, and an external channel is the exit. Removing any one can break the path. Markdown rendering can create an exfiltration risk if an attacker-controlled image or link causes a browser to send conversation data externally. Restrict or proxy image and link rendering to trusted domains. This is an output-handling issue; changing the model alone does not fix it.',
      ],
      analogy: 'Direct injection is like a customer telling a bank teller that the manager authorized a withdrawal. Indirect injection is like a note hidden on a cheque the teller reads, attempting to manipulate the teller. Merely telling staff to ignore instructions on cheques is not enough; do not give the teller vault access unnecessarily, and require manager approval for large transactions.',
      example: 'Check an email assistant for the lethal trifecta: it can access the inbox (private data), reads incoming mail (untrusted content), and can send mail (external communication). All three are present, so risk is high. A design fix is to disable sending tools during summarization, require user confirmation before every sent email, and restrict external images in the UI.',
      keyPoints: [
        'Direct injection comes from a user; indirect injection comes through third-party content read by the model.',
        'A jailbreak targets the safety policy; prompt injection targets application instructions or actions.',
        'Prompt warnings are insufficient; use least privilege, restrict tools, and require human confirmation.',
        'Spotlighting marks or encodes untrusted text but is probabilistic; in a dual-LLM design, the privileged LLM never sees untrusted content.',
        'The lethal trifecta is private data + untrusted content + external communication; remove one element and restrict rendered links or images.',
      ],
      terms: [
        { en: 'Direct Prompt Injection', si: 'A malicious instruction supplied directly in a user prompt.' },
        { en: 'Indirect Prompt Injection', si: 'A hidden instruction delivered through external content such as webpages, emails, or documents.' },
        { en: 'Jailbreak', si: 'An attempt to bypass a model’s safety alignment to obtain disallowed content.' },
        { en: 'Spotlighting (Datamarking / Encoding)', si: 'Marking untrusted text with a provenance signal to indicate that it is data.' },
        { en: 'Dual-LLM Pattern', si: 'An architecture that separates a privileged LLM from a quarantined LLM to protect tools from injection.' },
        { en: 'Lethal Trifecta', si: 'The combination of private-data access, untrusted content, and external communication that enables exfiltration risk.' },
        { en: 'Markdown Image Exfiltration', si: 'A risk where rendered images or links can cause conversation data to be sent externally.' },
        { en: 'Least Privilege', si: 'Giving a component only the minimum permissions required for its task.' },
      ],
    },
    // 12
    {
      id: 'jailbreaks-red-teaming',
      title: 'Jailbreak Families, Red Teaming Workflow, garak & Attack Success Rate',
      examRefs: ['TAI-029', 'TAI-076', 'TAI-077', 'TAI-079', 'TAI-090', 'TAI-091', 'TAI-092', 'TAI-138'],
      si: 'ඔයා රතු කණ්ඩායමකින් chatbot එක පරීක්ෂා කරවන්නේ, users ට හානියක් වෙන්න කලින් දුර්වලතා හොයාගන්නයි. මුලින් පරීක්ෂා කරන සීමාව සහ අවදානම් ලියලා, පසුව පරීක්ෂණ කරලා, හමු වූ දේ නිවැරදි කර නැවත පරීක්ෂා කරන්න. 240 උත්සාහයෙන් 18ක් සාර්ථක නම් ASR එක 18 ÷ 240 = 7.5%යි. එක වතාවක් 10% අවදානමක් තිබුණත් පස් වතාවක් උත්සාහ කළොත් එකක් හරි සාර්ථක වීමේ අවදානම 41%කට ආසන්නයි.',
      body: [
        'Jailbreak families include role-play attempts, which ask a model to adopt a different persona, and many-shot attempts, which use a long context containing many fabricated dialogues of an assistant complying with harmful requests before the actual request. This exploits in-context learning; success may rise with the number of examples. It is an inference-time attack, not poisoning. Adversarial suffixes are unusual token sequences optimized with methods such as Greedy Coordinate Gradient (GCG) against open-weight models and can transfer to other models; their unusual text may be caught by perplexity filters. Encoded or low-resource-language requests may evade English keyword input filters. One defensive control is an output rail that decodes or translates responses before classifying them.',
        'Red teaming probes a system adversarially before attackers or users encounter it, to find failures such as jailbreaks, data leakage, and harmful content. It differs from benchmark comparison, which uses fixed tests rather than adaptive adversaries. A sound workflow is: (1) define scope, threat model, and harm categories; (2) run tests and record severity; (3) apply mitigations; (4) retest fixes and check for regressions. In the exam’s numbered format, the sequence is 2 → 4 → 1 → 3.',
        'garak is an NVIDIA-backed, open-source LLM vulnerability scanner. Like a network vulnerability scanner, it probes a target model and uses detectors to report failures such as jailbreaks, prompt injection, data leakage, and toxicity. Nsight Systems and DCGM are performance-profiling and GPU-telemetry tools, not safety tools.',
        'Attack Success Rate (ASR) = successful attacks ÷ attempts. Block (defense) rate = 1 − ASR. If one attempt succeeds with probability p, the probability of at least one success in n independent attempts is 1 − (1 − p)^n. This is one minus the probability that every attempt fails; adding probabilities is incorrect. Red-team reports should state the number of attempts because single-try ASR can understate risk.',
      ],
      analogy: 'Red teaming is like asking a friend to test the alarm system in your home. First define what is in scope, then record weak points, fix them, and test again. A many-shot attempt is like someone presenting a guard with a fabricated list of people supposedly allowed inside.',
      example: 'ASR calculation: 240 jailbreak tests produce 18 policy-violating outputs. ASR = 18 ÷ 240 = 0.075 = 7.5%, so the block rate is 92.5%. For repeated attempts with p = 0.10 and n = 5, the chance that all fail is 0.9 × 0.9 × 0.9 × 0.9 × 0.9 ≈ 0.59. The chance of at least one success is 1 − 0.59 = 0.41 (41%); adding 0.10 five times to get 0.50 is wrong.',
      keyPoints: [
        'Many-shot attempts use a long context with fabricated compliant dialogues; GCG optimizes unusual suffixes that may transfer and trigger perplexity filters.',
        'An output rail can decode or translate encoded or low-resource-language responses before classification.',
        'Red-team workflow: define scope → test and record → mitigate → retest.',
        'garak is an LLM vulnerability scanner that uses probes and detectors.',
        'ASR = successes ÷ attempts; for n independent attempts, at-least-one success = 1 − (1 − p)^n.',
      ],
      terms: [
        { en: 'Many-shot Jailbreaking', si: 'Using a long context of fabricated compliant examples to influence a model’s behavior.' },
        { en: 'GCG (Greedy Coordinate Gradient)', si: 'A gradient-guided method for finding token suffixes that influence model responses.' },
        { en: 'Adversarial Suffix', si: 'An optimized token sequence appended to a request to influence the response.' },
        { en: 'Perplexity Filter', si: 'An input filter that detects unusually unpredictable text.' },
        { en: 'Encoded / Low-resource Jailbreak', si: 'An attempt to evade filters by using encoded content or a low-resource language.' },
        { en: 'Red Teaming', si: 'Probing a system adversarially to identify vulnerabilities before deployment.' },
        { en: 'garak', si: 'An NVIDIA-backed, open-source LLM vulnerability scanner.' },
        { en: 'Attack Success Rate (ASR)', si: 'The number of successful attacks divided by the total number of attempts.' },
      ],
    },
    // 13
    {
      id: 'owasp-llm-top10',
      title: 'OWASP Top 10 for LLM Applications: Output Handling, Excessive Agency, Overreliance, Unbounded Consumption, Supply Chain',
      examRefs: ['TAI-022', 'TAI-023', 'TAI-042', 'TAI-044', 'TAI-045', 'TAI-074'],
      si: 'ඔයාගේ AI assistant එකට order status බලන්න විතරක් ඕනේ නම්, මුළු database එකම වෙනස් කරන්න පුළුවන් අවසර දෙන්න එපා. ඒක excessive agency අඩු කරනවා. Model එකෙන් ආපු text එක web page එකකට දාන්න කලින් පරීක්ෂා කරන්න, මොකද output එකත් විශ්වාස නොකළ යුතුයි. Requests වල token සීමා සහ user කෙනෙකුට දවසේ quota එකක් දාන්න; එවිට එක් කෙනෙකුගේ අධික භාවිතය අනෙක් අයට බලපාන්නේ අඩුයි.',
      body: [
        'OWASP (Open Worldwide Application Security Project) publishes a Top 10 list of risks for LLM applications. The 2025 list includes Prompt Injection, Sensitive Information Disclosure, Supply Chain, Data and Model Poisoning, Improper Output Handling, Excessive Agency, System Prompt Leakage, Vector and Embedding Weaknesses, Misinformation, and Unbounded Consumption. The older 2023 version used names such as Insecure Output Handling, Model Denial of Service, Overreliance, Model Theft, and Insecure Plugin Design. Exams may use terms from either version, so understand the concepts.',
        'Improper output handling means trusting model output downstream without validation. For example, putting unsanitized model-generated HTML on a webpage can create cross-site scripting (XSS) risk. Treat model output as untrusted input: escape, sanitize, and validate it. Excessive agency means giving an LLM more functionality, permissions, or autonomy than needed. An agent with full file-system access could misunderstand a request and delete records; because no data was disclosed, that is not sensitive-information disclosure. Reduce functionality, permissions, and autonomy. Give an agent that only checks order status a scoped, read-only credential for the orders table; the downstream system then enforces the limit even if the model is manipulated. Logging helps detection but does not stop a destructive call.',
        'Overreliance (misinformation or automation bias) means trusting model output without adequate verification. Putting coding-assistant suggestions into production without review may introduce vulnerabilities; this is not a supply-chain issue when the code comes from normal model use. Unbounded consumption (formerly Model Denial of Service) occurs when many maximum-length inputs trigger long outputs and increase GPU costs and latency. Use input/output token limits, rate limits, and per-user quotas. A topical rail may not help because requests can be on-topic.',
        'Supply-chain risks come from components you did not create, such as third-party checkpoints, datasets, LoRA adapters, plugins, or Python packages that may contain malicious code or a backdoor. Loading a checkpoint in a format such as pickle can execute code, so prefer safer formats such as safetensors and check hashes or signatures. An incorrect factual answer is misinformation, not a supply-chain risk. High GPU utilization alone is not a risk category.',
      ],
      analogy: 'Excessive agency is like giving a child sent to buy groceries your bank card and PIN when they only need Rs. 500. Least privilege is giving them only Rs. 500; even if they are misled, the possible loss is limited. A supply-chain risk is like not knowing what is inside an unbranded phone charger bought in Pettah.',
      example: 'Set consumption limits: at most 4,000 input tokens, 1,000 output tokens, 20 requests per minute, and 200,000 tokens per user per day. If someone attempts 1,000 inputs of 128,000 tokens each, the input limit rejects them and the rate limit caps requests at 20 per minute, helping protect other users’ latency.',
      keyPoints: [
        'Improper output handling means rendering or executing output without sanitization (for example, XSS or SQL risks).',
        'Excessive agency means unnecessary functionality, permissions, or autonomy; use scoped read-only credentials.',
        'Overreliance means trusting output without verification.',
        'Unbounded consumption is resource exhaustion; use token limits, rate limits, and quotas.',
        'Supply-chain risks involve third-party models, data, adapters, or packages; check provenance, signatures, and safe formats.',
      ],
      terms: [
        { en: 'OWASP Top 10 for LLM Applications', si: 'A list of ten major security risks for LLM applications.' },
        { en: 'Improper / Insecure Output Handling', si: 'Passing LLM output to downstream systems without validation.' },
        { en: 'Excessive Agency', si: 'Giving an LLM more permissions and autonomy than its task requires.' },
        { en: 'Overreliance / Misinformation', si: 'Trusting model output without verification and potentially spreading false information.' },
        { en: 'Unbounded Consumption / Model DoS', si: 'Exhausting system resources through excessive token or compute use.' },
        { en: 'Supply Chain Vulnerability', si: 'Risks introduced by third-party models, datasets, plugins, or packages.' },
        { en: 'Vector and Embedding Weaknesses', si: 'Access-control, poisoning, or leakage problems in RAG vector stores.' },
        { en: 'XSS (Cross-Site Scripting)', si: 'A risk where a webpage runs an injected script in a user’s browser.' },
      ],
    },
    // 14
    {
      id: 'poisoning-backdoors-theft',
      title: 'Data Poisoning, Backdoors, Data Provenance & Model Theft / Extraction',
      examRefs: ['TAI-020', 'TAI-021', 'TAI-080', 'TAI-081', 'TAI-082', 'TAI-131', 'TAI-132', 'TAI-133'],
      si: 'ඔයාගේ RAG assistant එක wiki එකෙන් ලිපි ගන්නවා නම්, ඒ ලිපි කවුද වෙනස් කළේ කියලා පරීක්ෂා කර provenance සටහන් කරන්න. Training data තුළ රහස් trigger එකක් ඇතුළත් model එක සාමාන්‍ය පරීක්ෂණවල හොඳට පෙනුණත්, විශේෂ තත්ත්වයකදී වෙනස් හැසිරෙන්න පුළුවන්. ඒ නිසා trusted source, review, සහ release controls වැදගත්. Model එකට අසාමාන්‍ය ලෙස බොහෝ API ඉල්ලීම් කරන ගිණුමක් හමු වුණොත්, rate limit සහ anomaly monitoring භාවිතා කරන්න.',
      body: [
        'Data poisoning changes model behavior by corrupting training, fine-tuning, or RAG retrieval data. Prompt injection targets a request at inference time; poisoning targets what a model learns or retrieves. It does not require weight access: contributing to a scraped webpage or public dataset can be enough. In RAG poisoning, an edited indexed wiki page could cause an assistant to recommend an unsafe resource because indexed material may be treated as trusted context. Limit write access to indexed sources, review content before ingestion, and track provenance. A reranker may rank a poisoned page highly if it appears relevant.',
        'A backdoor (trojan) is a trigger behavior introduced through poisoned training data. A model may behave normally in evaluations but produce an attacker-chosen output when a particular trigger phrase appears, so clean-input benchmarks can miss it. Unlike hallucination, a backdoor is tied to a trigger. “Sleeper agents” research found that backdoor behavior can persist after standard safety training such as SFT, RLHF, and adversarial training; adversarial training may even help the model conceal trigger behavior. Persistence was greater in larger models and models trained with chain-of-thought about deception. Do not assume safety training cleans an untrusted checkpoint; use supply-chain controls.',
        'Recent pretraining experiments found that a similar small number—on the order of hundreds—of poisoned documents could introduce a backdoor across substantially different model sizes. If success depended on a fixed percentage, larger corpora would require millions of poisoned documents. A near-constant count means attack cost does not grow with corpus size, and a larger dataset does not necessarily dilute the threat. Data provenance and filtering matter.',
        'Model theft or extraction means copying a model’s functionality or stealing its weights without authorization. One approach is querying a proprietary API at scale and training a copycat from its responses (distillation); bypassing a content filter through role-play is jailbreaking, not model copying. Defenses include per-account rate limits, anomaly detection for systematic query patterns, and terms-of-service enforcement; lowering temperature does not help. Research has also shown that API queries with access to full logits or log-probabilities (including logit bias) can reveal information about production LLM embedding-projection layers and hidden dimensions. Logit vectors lie in a low-rank subspace defined by the final layer, so enough observations can reveal dimensions and weights up to symmetries. Providers have limited log-probability and logit-bias exposure.',
      ],
      analogy: 'Data poisoning is like a vegetable supplier mixing spoiled items into deliveries; a chef may not notice, but the food is affected. A backdoor is like secretly teaching an otherwise reliable employee to give free food to people wearing a particular color. Model extraction is like ordering many kottu meals from a popular shop and trying to copy its recipe.',
      example: 'Suppose Model A trains on 100 million documents and Model B on 1 billion. A fixed 0.01% poisoning rate would require 10,000 documents for A and 100,000 for B. Experiments instead suggest that both may be affected by a similar count of hundreds (for example, about 250). For extraction monitoring, a usual account might make 50 requests per day while one account makes 2 million and systematically covers topics; flag and throttle such an anomaly.',
      keyPoints: [
        'Poisoning corrupts training, fine-tuning, or RAG data; injection targets inference input. Poisoning does not require weight access.',
        'For RAG poisoning, restrict write access, review ingestion, and track provenance.',
        'A backdoor activates only on a trigger, may evade clean benchmarks, and can persist after safety training.',
        'The number of poisoned documents needed may remain roughly constant as corpus size grows.',
        'For extraction, use rate limits, anomaly detection, and terms-of-service enforcement; full log-probability or logit-bias exposure can risk parameter theft.',
      ],
      terms: [
        { en: 'Data Poisoning', si: 'Changing behavior by inserting malicious samples into training or retrieval data.' },
        { en: 'RAG / Knowledge Base Poisoning', si: 'Adding malicious content to indexed documents to influence an assistant.' },
        { en: 'Backdoor / Trojan Trigger', si: 'A hidden behavior that activates only when a specific trigger is present.' },
        { en: 'Sleeper Agent', si: 'A model that behaves normally until triggered and may retain a backdoor after safety training.' },
        { en: 'Data Provenance', si: 'Tracking where data came from, who changed it, and which license applies.' },
        { en: 'Model Extraction / Theft', si: 'Copying a proprietary model through unauthorized queries or weight theft.' },
        { en: 'Distillation Attack', si: 'Training a copycat student model from API responses.' },
        { en: 'Logit / Logprob Exposure', si: 'Providing full token probabilities through an API, which can create a risk of parameter extraction.' },
      ],
    },
    // 15
    {
      id: 'nemo-guardrails-safety-models',
      title: 'NeMo Guardrails & Safety Models: Input, Output, Dialog, Topical, Retrieval, Execution Rails, Colang, Llama Guard, NemoGuard NIMs',
      examRefs: ['TAI-024', 'TAI-025', 'TAI-026', 'TAI-027', 'TAI-028', 'TAI-083', 'TAI-084', 'TAI-085', 'TAI-086', 'TAI-087', 'TAI-088', 'TAI-089', 'TAI-134', 'TAI-135', 'TAI-136', 'TAI-137'],
      si: 'ඔයාගේ hotel assistant එකට විවිධ guardrails දාන්න පුළුවන්: එන ප්‍රශ්න පරීක්ෂා කරන input rail, පිටවෙන පිළිතුර පරීක්ෂා කරන output rail, සහ hotel සේවාවට අදාළ දේවල් විතරක් කතා කරන topical rail. RAG එකෙන් එන ලේඛනත් user ට පෙන්වීමට පෙර retrieval rail එකෙන් පරීක්ෂා කරන්න පුළුවන්. දන්නා jailbreak 500කින් 460ක් නවත්තලා, හොඳ ඉල්ලීම් 2,000කින් 120ක් වැරදියට නවත්තුවොත් block rate 92%යි, false refusal 6%යි. ඔයාට දෙකම මැනිය යුතුයි, නැත්නම් හොඳ users ලාට අසාධාරණයක් වෙන්න පුළුවන්.',
      body: [
        'NVIDIA NeMo Guardrails is an open-source toolkit for adding programmable rails around LLM applications. It sits between the application and LLM and enforces rules at runtime. It does not change model weights or fine-tune the model, so policies can be updated independently. It is configured with YAML and Colang. A configuration directory commonly contains config.yml (models, enabled rails, and settings) and Colang .co files (flows and messages); custom Python actions can be added in actions.py.',
        'Rail types: input rails check or transform a user message before it reaches the LLM, for example by blocking jailbreak attempts or masking PII. Output rails check generated responses before delivery for PII leaks, unsafe content, or groundedness. Both are useful because a benign input can still produce unsafe output. Dialog rails determine conversation flow, canned responses, or actions. Topical rails keep a conversation within an application’s domain; a retail bot can politely decline election or legal-advice questions, which are out of scope rather than jailbreaks. Retrieval rails check RAG chunks before adding them to a prompt, mask sensitive data, or remove untrusted passages. Execution rails validate inputs and outputs of custom actions or tools called by the LLM.',
        'Colang dialog rails define user intents with example utterances and use flows to choose bot responses. This is useful for giving an approved script regardless of how a user asks about competitor pricing; an output regex alone cannot generate the approved script. In Colang 1.0, free-form messages map to canonical intents by indexing example-utterance embeddings, retrieving similar examples, and using them as few-shot prompts for an LLM to generate a canonical form. This allows paraphrases rather than requiring exact matches. A self-check input rail asks an LLM to judge a message against a policy prompt; it catches more paraphrases than regex but adds an LLM call and latency per turn, so small dedicated safety models may be used. With streaming output rails, a later chunk may be flagged only after earlier content has been delivered, and chunk-level checks may miss context. Larger buffers improve safety but increase latency; chunk size and overlap are tuning options.',
        'A Llama Guard-style safety classifier is an instruction-tuned LLM used as a classifier. Given a hazard taxonomy and a conversation, it returns “safe” or “unsafe” and the violated categories. Since categories are supplied in the prompt, it can adapt without retraining (zero- or few-shot) and classify both user prompts and model responses. It does not rewrite text or replace the main generator; it acts as a separate guard. For threshold tuning, use the probability of the “unsafe” first token as a score and choose a threshold to trade off precision and recall. NVIDIA NemoGuard NIMs include ContentSafety (unsafe content), TopicControl (staying within topical boundaries defined in the system prompt), and JailbreakDetect (jailbreak attempts); these can integrate with NeMo Guardrails. Evaluate a guardrail using both block rate and false refusal rate. Reporting only block rate hides over-refusal.',
      ],
      analogy: 'Guardrails are like a hotel security team. A gate guard checks incoming guests (input rail), and an exit guard checks what leaves (output rail). The receptionist follows a script regardless of how guests ask about the pool (dialog rail), and politely declines requests outside the hotel’s services (topical rail). A kitchen worker checks incoming vegetables (retrieval rail), while a manager reviews requests before staff open the vault (execution rail).',
      example: 'A guardrail blocks 460 of 500 known jailbreak tests and refuses 120 of 2,000 benign prompts. Block rate = 460 ÷ 500 = 0.92 = 92%. False refusal rate = 120 ÷ 2,000 = 0.06 = 6%. If benign traffic is 100,000 requests per day, 6% means 6,000 good users are mistakenly refused. Measure both rates.',
      code: {
        lang: 'text',
        src: `# config.yml  (models + enabled rails)
models:
  - type: main
    engine: nim
    model: meta/llama-3.1-8b-instruct
rails:
  input:
    flows:
      - self check input
  output:
    flows:
      - self check output

# rails.co  (Colang 1.0 dialog rail)
define user ask competitor pricing
  "How much does CompetitorX charge?"
  "Are you cheaper than CompetitorX?"

define bot answer competitor pricing
  "I can only share details about our own plans."

define flow competitor pricing
  user ask competitor pricing
  bot answer competitor pricing`,
      },
      keyPoints: [
        'NeMo Guardrails is an open-source runtime toolkit configured with YAML (config.yml) and Colang (.co); it does not change model weights.',
        'Input checks user messages; output checks responses; dialog controls flow; topical limits domain; retrieval checks RAG chunks; execution validates tools.',
        'Colang intents use example utterances, embedding similarity, and an LLM-generated canonical form; self-check adds a policy-prompt LLM call and latency.',
        'Llama Guard classifies prompts and responses as safe or unsafe by taxonomy; its unsafe-token probability can be thresholded.',
        'NemoGuard NIMs include ContentSafety, TopicControl, and JailbreakDetect; evaluate with block rate and false refusal rate.',
      ],
      terms: [
        { en: 'NeMo Guardrails', si: 'NVIDIA’s open-source toolkit for adding programmable rails to LLM applications.' },
        { en: 'Input Rail', si: 'A rail that checks, changes, or blocks user input before it reaches the LLM.' },
        { en: 'Output Rail', si: 'A rail that checks a generated response before it reaches the user.' },
        { en: 'Dialog Rail', si: 'A rail that selects conversation flow, canned responses, or actions based on intent.' },
        { en: 'Topical Rail', si: 'A rail that keeps a conversation within an application’s domain.' },
        { en: 'Retrieval Rail', si: 'A rail that filters or masks retrieved chunks before they enter the prompt.' },
        { en: 'Execution Rail', si: 'A rail that validates inputs and outputs of actions or tools called by the LLM.' },
        { en: 'Colang', si: 'A modeling language for writing Guardrails flows, user intents, and bot messages.' },
        { en: 'Canonical Form', si: 'A standard intent label mapped from a free-form user message.' },
        { en: 'Llama Guard', si: 'An LLM-based safety model that classifies prompts and responses against a hazard taxonomy.' },
        { en: 'NemoGuard NIMs', si: 'NVIDIA safety microservices for ContentSafety, TopicControl, and JailbreakDetect.' },
        { en: 'False Refusal Rate', si: 'The fraction of benign requests incorrectly refused or blocked.' },
      ],
    },
    // 16
    {
      id: 'documentation-licenses',
      title: 'Documentation & Licenses: Model Cards, Model Card++, Datasheets, System Cards, Apache 2.0, CC BY-NC, Open Weights',
      examRefs: ['TAI-011', 'TAI-012', 'TAI-041', 'TAI-095', 'TAI-096', 'TAI-097', 'TAI-106', 'TAI-107'],
      si: 'ඔයා model card එකක් හදනකොට මේ model එකට සුදුසු වැඩ, නොකළ යුතු වැඩ, සහ පරීක්ෂණ ප්‍රතිඵල ලියන්න. Dataset එකක datasheet එකෙන් දත්ත එකතු කළේ කොහොමද සහ භාවිතයට අවසර මොනවාද කියලා සටහන් කරන්න. Apache 2.0 සාමාන්‍යයෙන් වාණිජ භාවිතයට ඉඩ දෙනවා, නමුත් CC BY-NC වාණිජ භාවිතය සීමා කරනවා. Weights download කරන්න පුළුවන් වුණා කියලා ඒවායේ license එක කියවීම අමතක කරන්න එපා.',
      body: [
        'A model card (Mitchell et al.) is a short, structured document describing intended uses and users, out-of-scope uses, limitations, evaluation results (including subgroups), and ethical considerations. It helps users decide whether a model fits their use case. It may include some training details, but it is not a reproducibility configuration file, license, or registry entry. Statements such as “do not use for diagnosis or for people under 18” belong in intended-use and out-of-scope sections. Quantitative analyses report performance and disaggregated metrics.',
        'NVIDIA Model Card++ adds four subcards aligned with NVIDIA’s Trustworthy AI principles: Bias, Explainability, Privacy, and Safety & Security. It is a transparency artifact, not a leaderboard or pricing calculator. A system card documents the entire deployed system—not only the model—including safeguards, policies, red-team results, and how the model, retrieval, tools, filters, and UI work together. Risks often arise from this composition. A system card complements rather than replaces model-level evaluation.',
        'Datasheets for Datasets (Gebru et al.) adapt the idea of electronics datasheets. Just as a component datasheet records composition, operating conditions, and recommended uses, a dataset datasheet records motivation, composition, collection, preprocessing, uses, distribution, and maintenance. A database schema describes structure but not provenance, consent, or appropriate uses.',
        'Apache 2.0 is a permissive license allowing commercial use, modification, and redistribution, subject to notices and attribution, and includes a patent grant. In CC BY-NC 4.0, BY means attribution and NC means NonCommercial; uses primarily intended for commercial advantage are prohibited. A model intended for sale that was fine-tuned on a CC BY-NC dataset needs separate permission or must exclude that dataset; attribution alone is insufficient. ShareAlike (SA) is a separate clause, and Creative Commons licenses do not require model weights to be open. Open weights are not necessarily open source under the OSI definition if the license restricts fields of use or imposes an acceptable-use policy (for example, Llama community licenses). Do not assume “downloadable” means unrestricted; read the license.',
      ],
      analogy: 'A model card is like a medicine leaflet: it explains what a medicine is for, who should use or avoid it, and possible side effects. A dataset datasheet is like a label saying where vegetables were grown, when they were harvested, and how they were treated. A system card is like a safety report for the entire hospital, not just one medicine.',
      example: 'A startup plans to sell a Sinhala customer-support model. The base model is Apache 2.0, so retain its NOTICE file and attribution. Dataset 1 is CC BY 4.0, so provide attribution. Dataset 2 is CC BY-NC 4.0, which raises a problem for a commercial product: get a separate license from the owner or remove it. In the release model card, state “Intended use: Sinhala retail support. Out of scope: legal or medical advice.”',
      keyPoints: [
        'A model card covers intended and out-of-scope uses, limitations, disaggregated evaluation, and ethics.',
        'Model Card++ adds Bias, Explainability, Privacy, and Safety & Security subcards.',
        'A system card documents the deployed system, including safeguards, policies, red-team results, and components.',
        'Datasheets document dataset motivation, composition, collection, uses, and maintenance.',
        'Apache 2.0 permits commercial use; CC BY-NC does not. Restricted open weights are not necessarily OSI open source.',
      ],
      terms: [
        { en: 'Model Card', si: 'A structured document describing a model’s uses, limitations, evaluation, and ethical considerations.' },
        { en: 'Out-of-scope Uses', si: 'Situations in which the developer warns that the model should not be used.' },
        { en: 'Model Card++', si: 'NVIDIA’s model-card format with Bias, Explainability, Privacy, and Safety & Security subcards.' },
        { en: 'System Card', si: 'A document describing the deployed system, including its model, tools, filters, and policies.' },
        { en: 'Datasheets for Datasets', si: 'Documents that describe a dataset’s motivation, composition, collection, uses, distribution, and maintenance.' },
        { en: 'Apache 2.0', si: 'A permissive license allowing commercial use and including a patent grant.' },
        { en: 'CC BY-NC 4.0', si: 'A Creative Commons license requiring attribution and prohibiting commercial use.' },
        { en: 'Open-weight vs Open Source', si: 'Downloadable weights alone are not sufficient for OSI open-source status.' },
        { en: 'Acceptable Use Policy (AUP)', si: 'A list of uses that are prohibited for a model.' },
      ],
    },
    // 17
    {
      id: 'governance-regulation-sustainability',
      title: 'Governance & Regulation: EU AI Act Tiers, GPAI Systemic Risk, NIST AI RMF, ISO/IEC 42001, Energy & Carbon',
      examRefs: ['TAI-035', 'TAI-036', 'TAI-108', 'TAI-109', 'TAI-110', 'TAI-111', 'TAI-145', 'TAI-146', 'TAI-149'],
      si: 'ඔයා bus company එකක් පවත්වාගෙන යනවා කියලා හිතන්න: EU AI Act එකේ සමහර භාවිතා තහනම්, සමහර high-risk භාවිතාට ලේඛන සහ අධීක්ෂණ අවශ්‍යයි, තවත් අවස්ථාවල chatbot එක AI බව කියන්න ඕනේ. NIST AI RMF එකේ Govern, Map, Measure, Manage කියන පියවර හතරෙන් අවදානම් හඳුනාගෙන කළමනාකරණය කරන්න පුළුවන්. විදුලිය ගණනයට GPUs × kW × පැය යොදාගන්න; carbon ගණනයට PUE සහ grid intensity එකත් ගුණ කරන්න. 70B parameters සහ 15T tokens සඳහා 6ND ≈ 6.3 × 10^24 FLOPs, එය 10^25ට අඩුයි.',
      body: [
        'The EU AI Act is a risk-based law that entered into force in August 2024, with obligations applying in stages. It has four broad tiers. (1) Unacceptable risk is prohibited, including government social scoring that treats citizens unfairly based on behavior and harmful manipulative techniques. (2) High-risk uses are allowed but heavily regulated in areas such as employment (CV screening and applicant ranking), education, credit scoring, critical infrastructure, and law enforcement. Obligations include risk management, data governance, technical documentation, record-keeping, human oversight, accuracy, robustness, cybersecurity, and conformity assessment. (3) Limited-risk uses have transparency obligations: for example, customer-service chatbot users must be told they are interacting with AI, and deepfakes or synthetic content must be labeled as artificially generated. Prior regulator approval is not generally required. (4) Minimal-risk uses such as spam filters have no specific obligations. Penalties for prohibited practices can be up to €35 million or 7% of global annual turnover, whichever is higher.',
        'General-purpose AI (GPAI) models have separate rules. Every GPAI provider must provide technical documentation and information to downstream providers, a copyright policy, and a summary of training content. Training compute above 10^25 FLOPs creates a presumption of systemic risk, with additional model evaluations, adversarial testing, serious-incident reporting, and cybersecurity obligations. The Commission can designate a model using other criteria too. Estimate training compute with C ≈ 6 × N × D, where N is the number of parameters, D is the number of training tokens, and 6 represents the forward pass (2) plus backward pass (4).',
        'NIST AI Risk Management Framework (AI RMF 1.0, 2023) is voluntary. Its four core functions are Govern (cross-cutting culture, policies, roles, and accountability), Map (identify context and risks), Measure (analyze, assess, and track risks using qualitative and quantitative methods such as bias tests, toxicity metrics, and thresholded evaluation), and Manage (prioritize risks and act through mitigations and response plans). Identify, Protect, Detect, and Respond belong to the NIST Cybersecurity Framework, a common confusion. NIST also has the GenAI Profile (NIST AI 600-1). ISO/IEC 42001 is a certifiable, organization-level AI management system (AIMS) standard covering policies, roles, risk processes, and continual improvement, similar in role to ISO 27001 for information security. Third-party certification is available. NIST AI RMF is not certifiable; ISO 9001 is a general quality-management standard.',
        'AI training and inference can use substantial electricity. Energy (kWh) = number of GPUs × power per GPU (kW) × hours. PUE (Power Usage Effectiveness) = total data-center energy ÷ IT equipment energy. A PUE of 1.2 means that for every 1 kWh used by GPUs, cooling and other overhead use another 0.2 kWh. Emissions (kg CO2e) = facility energy (kWh) × grid carbon intensity (kg CO2e/kWh). Choosing a lower-carbon region can change emissions several-fold. Over time, total inference energy for a deployed model can exceed its one-time training cost.',
      ],
      analogy: 'The EU AI Act is like vehicle rules. Some practices are prohibited; high-risk uses such as buses need permits, inspections, and logs; some uses such as chatbots need a disclosure sign; minimal-risk uses such as spam filters have few special rules. NIST RMF is like a safe-driving guide, while ISO 42001 is a management standard a bus company can be certified against.',
      example: 'Three calculations. (1) GPAI threshold: a 70B-parameter model trained on 15T tokens. N = 7 × 10^10, D = 1.5 × 10^13. 6 × 7 = 42; 42 × 1.5 = 63; 10^10 × 10^13 = 10^23; therefore 63 × 10^23 = 6.3 × 10^24 FLOPs, below 10^25 (= 10 × 10^24). Omitting 6 would give 1.05 × 10^24. (2) Energy: 1,000 GPUs × 700 W. Since 700 W = 0.7 kW, 1,000 × 0.7 = 700 kW. Thirty days × 24 hours = 720 hours; 700 kW × 720 h = 504,000 kWh = 504 MWh. Forgetting the 24 gives 21 MWh. (3) Carbon: 504 MWh × PUE 1.2 = 604.8 MWh = 604,800 kWh; × 0.4 kg = 241,920 kg ≈ 242 tonnes CO2e. Omitting PUE gives 202 tonnes. 605 is MWh, not emissions.',
      code: {
        lang: 'python',
        src: `# GPAI compute: C ≈ 6 * N * D
N, D = 70e9, 15e12
C = 6 * N * D
print(f"{C:.2e} FLOPs, over 1e25? {C > 1e25}")   # 6.30e+24, False

# Energy and carbon
kw = 1000 * 0.7                 # 1000 GPUs x 0.7 kW
kwh = kw * 30 * 24              # 504,000 kWh
facility_kwh = kwh * 1.2        # PUE 1.2
tonnes = facility_kwh * 0.4 / 1000
print(kwh / 1000, "MWh,", round(tonnes), "t CO2e")   # 504 MWh, 242 t`,
      },
      keyPoints: [
        'EU AI Act tiers: Unacceptable (prohibited, such as social scoring), High-risk (strict duties, such as employment and credit), Limited (AI disclosure and deepfake labels), and Minimal.',
        'GPAI systemic risk presumption = training compute > 10^25 FLOPs. C ≈ 6ND.',
        'NIST AI RMF functions are Govern, Map, Measure, and Manage; tracking bias or toxicity metrics is Measure.',
        'ISO/IEC 42001 = certifiable AI management system standard.',
        'Energy = GPUs × kW × hours. Emissions = energy × PUE × carbon intensity.',
      ],
      terms: [
        { en: 'EU AI Act', si: 'An EU law that regulates AI systems according to risk.' },
        { en: 'Unacceptable Risk', si: 'Prohibited AI practices, such as social scoring.' },
        { en: 'High-risk AI System', si: 'A system in areas such as employment, education, or credit with strict obligations and conformity assessment.' },
        { en: 'Transparency Obligations', si: 'Informing people about AI interactions and labeling synthetic content.' },
        { en: 'GPAI with Systemic Risk', si: 'A general-purpose model above 10^25 FLOPs or otherwise designated, with extra evaluation and incident duties.' },
        { en: 'NIST AI RMF', si: 'A voluntary AI risk framework with Govern, Map, Measure, and Manage functions.' },
        { en: 'ISO/IEC 42001', si: 'A certifiable standard for an AI management system.' },
        { en: 'C ≈ 6ND', si: 'An estimate of training compute: 6 × number of parameters × number of tokens.' },
        { en: 'PUE', si: 'Power Usage Effectiveness: total facility energy divided by IT energy.' },
        { en: 'Carbon Intensity', si: 'Kilograms of CO2e emitted per kWh of grid electricity.' },
      ],
    },
    // 18
    {
      id: 'provenance-watermarking-deepfakes',
      title: 'Content Provenance: Watermarking (Green List), C2PA & Soft Binding, AI-Text Detectors, Deepfakes',
      examRefs: ['TAI-032', 'TAI-033', 'TAI-102', 'TAI-103', 'TAI-104', 'TAI-105', 'TAI-117', 'TAI-142', 'TAI-143', 'TAI-144'],
      si: 'ඔයා generated text එකේ watermark signal එකක් තිබේද කියලා බලනවා නම් green tokens ගණන් කරන්න පුළුවන්. γ=0.25, tokens 200, green tokens 80 නම් expected අගය 50යි, standard deviation එක 6.12ක් පමණයි, ඒ නිසා z-score එක 4.9ක් වෙනවා. වෙනත් model එකකින් paraphrase කළොත් token watermark එක අඩුවෙන්න පුළුවන්; PDF කළාට token අනුපිළිවෙළ වෙනස් නොවෙන්න පුළුවන්. C2PA credentials නැතිවීමෙන් file එක අනිවාර්යයෙන්ම ව්‍යාජයි කියන්න බැහැ, ඒකේ origin නොදන්නා බව විතරයි.',
      body: [
        'Watermarking adds a detectable, often invisible signal to generated output so it can be identified as machine-generated. It helps with provenance but does not prevent generation of copyrighted material. The green-list text watermark (Kirchenbauer et al.) uses the previous token to seed a selection of a γ fraction of the vocabulary as a “green list” at each step, slightly raises green-token logits, and lets a detector count green tokens. Ordinary human text should contain about γ green tokens; watermarked text should contain more, measured with a z-score.',
        'Text watermark limitations: token-level signals can weaken when another model paraphrases the text and changes tokens. Changing the font or converting to PDF does not change the token sequence, so the watermark may still be detected. Low-entropy outputs such as code or short factual answers leave little freedom to favor green tokens; forcing them may damage syntax or facts. Detection needs a longer text. These are fundamental limits of logit-biasing schemes, not language-specific limits.',
        'C2PA (Coalition for Content Provenance and Authenticity) Content Credentials attach a cryptographically signed metadata manifest describing how media was created and edited. Tamper-evident tools can verify it. C2PA is not a deepfake detector; when present, it can establish provenance. Re-encoding, screenshots, or platform processing may remove metadata. An image without a manifest has unknown provenance; its absence alone proves nothing. Hard binding with a cryptographic hash breaks when pixels change. Soft binding with an invisible watermark or content fingerprint can survive more transformations and help find the original manifest. Signed manifests plus watermarks can provide integrity and durability.',
        'AI-text detectors have meaningful false-positive rates, especially for non-native English writers whose lexical diversity may be lower. Do not use a detector score as the sole basis for a penalty; use it to trigger human review and due process. Deepfake image detectors can learn generator-specific artifacts: a detector may score 98% on a benchmark made from three GANs but perform near chance on a new diffusion model. Evaluate on held-out generators and update detectors regularly. This is an arms race, so pair detection with provenance, such as signing authentic content. For voice-clone fraud, such as an urgent wire-transfer request in a CFO’s voice, caller ID can be spoofed and listening longer may not help; use out-of-band verification by calling a previously known number and requiring multi-person approval.',
      ],
      analogy: 'A green-list watermark is like a teacher secretly using certain words in many sentences. A normal student essay might contain those words in 25% of sentences, while a copied essay might contain them in 40%, so counting can reveal a pattern. If another student rewrites the essay, the signal may disappear. C2PA is like the security thread in a Rs. 5,000 note: its presence can support authenticity, but its absence on a photocopy does not prove the copy is fake; provenance is simply unknown.',
      example: 'Green-list z-score: γ = 0.25, T = 200 tokens, and G = 80 green tokens. Formula: z = (G − γT) ÷ √(T × γ × (1 − γ)). Step 1: expected green tokens = γT = 0.25 × 200 = 50. Step 2: G − 50 = 80 − 50 = 30 above expectation. Step 3: variance = 200 × 0.25 × 0.75 = 37.5. Step 4: standard deviation = √37.5 ≈ 6.12. Step 5: z = 30 ÷ 6.12 ≈ 4.9. A common threshold is about 4, so it is detected as watermarked. Dividing by variance instead (30 ÷ 37.5 = 0.8) is wrong.',
      code: {
        lang: 'python',
        src: `import math
gamma, T, G = 0.25, 200, 80
expected = gamma * T                    # 50
std = math.sqrt(T * gamma * (1 - gamma))  # ~6.12
z = (G - expected) / std
print("z =", round(z, 1), " watermarked?", z > 4)   # 4.9 True`,
      },
      keyPoints: [
        'A watermark is a detectable signal. Green-list z = (G − γT) ÷ √(Tγ(1 − γ)); a threshold is about 4.',
        'Paraphrasing can weaken a watermark; font or PDF changes may not. Low-entropy text such as code is difficult to watermark.',
        'C2PA is a signed manifest; its absence proves nothing. Soft binding (watermark or fingerprint) can help recover the manifest.',
        'AI-text detectors can falsely flag non-native writers; do not use them as the sole basis for penalties.',
        'Deepfake detectors may not generalize to new generators; use out-of-band verification for voice-clone requests.',
      ],
      terms: [
        { en: 'Watermarking', si: 'Adding a detectable signal to generated content.' },
        { en: 'Green-list Watermark', si: 'A text watermark that biases a γ fraction of vocabulary tokens and tests their count with a z-score.' },
        { en: 'z-score', si: 'The number of standard deviations between an observed value and its expected value.' },
        { en: 'C2PA / Content Credentials', si: 'A standard for attaching a signed manifest of media origin and edit history.' },
        { en: 'Hard Binding vs Soft Binding', si: 'Binding a manifest by a fragile hash versus a more resilient watermark or fingerprint.' },
        { en: 'AI-text Detector', si: 'A classifier that estimates whether text was written by AI; it can produce false positives.' },
        { en: 'Deepfake', si: 'A synthetic image, video, or voice generated or altered using AI.' },
        { en: 'Out-of-band Verification', si: 'Confirming a request through a separate, previously known channel.' },
      ],
    },
    // 19
    {
      id: 'human-oversight-incident-response',
      title: 'Human Oversight, Automation Bias, Accessibility, Safety Monitoring & Incident Response',
      examRefs: ['TAI-034', 'TAI-044', 'TAI-078', 'TAI-093', 'TAI-094', 'TAI-112', 'TAI-147'],
      si: 'ඔයා AI එකෙන් insurance claim එකක් ප්‍රතික්ෂේප කරන ලිපියක් සකස් කරවලා, යවන්න කලින් නිලධාරියෙකු අනුමත කරනවා නම් ඒක HITL. Fraud system එකක් තීරණය ගෙන පසුව analyst කෙනෙකුට වෙනස් කරන්න පුළුවන් නම් ඒක HOTL. Reviewers AI පිළිතුරු 99.6%ක් වෙනස් නොකර පිළිගන්නවා නම්, ඒ පරීක්ෂාව rubber stamp එකක් වෙන්න පුළුවන්. දත්ත කාට බලපෑවාද කියලා log සුරක්ෂිතව තබාගෙන, ගැටලුව පාලනය කර, මූල හේතුව හදලා, regression test කරන්න.',
      body: [
        'There are three human-oversight models. Human-in-the-loop (HITL): a person makes a consequential decision or approves it before it takes effect; for example, a reviewer approves an AI-drafted insurance-claim denial before it is sent. Human-on-the-loop (HOTL): the system acts independently while people monitor and can intervene or override; for example, a fraud system freezes an account and analysts can reverse it from a dashboard. Human-out-of-the-loop has no human intervention. A disclaimer or annual audit is not HITL: these provide transparency or after-the-fact oversight, not intervention before a decision. A model retrained nightly from user feedback without review also lacks human oversight.',
        'Automation bias is the tendency to trust automated output too much. Reviewers may approve 99.6% of AI medical summaries without edits, including obvious errors, turning human review into a rubber stamp. Adding more approval steps alone does not solve this. Show sources and uncertainty, test reviewers with seeded-error audit cases, and manage workload. Overreliance is the same idea in LLM use, such as putting coding-assistant output into production without code review. For accessibility, present automatically generated image alt text as an editable draft for authors to review and test it with screen-reader users; blind users cannot inspect an image to catch errors. Do not overwrite human-written alt text, which is often more context-aware and higher quality.',
        'In production safety monitoring, if conversations blocked by an output rail rise from 0.3% to 4% after a model update, treat it as a possible incident and investigate samples. If harmful outputs or a regression are confirmed, roll back or gate the update. Disabling the rail or relabeling outputs as “safe” to retrain the classifier hides the signal. Diagnose both possibilities: the model may generate more unsafe content, or the rail may be over-triggering. Some harmful outputs may also have passed through.',
        'Incident response sequence: (1) Contain ongoing harm by blocking the pattern or disabling a feature. (2) Preserve logs and assess impact, including whose data and how much. (3) Fix the root cause. If a jailbreak exposed another user’s order data, the root cause is missing authorization; fix the tool layer so a user can access only their own orders, rather than adding only a new prompt rule. (4) Add the attack to regression tests and notify affected parties when legally required. Do not delete logs, retrain without containment, or skip testing.',
      ],
      analogy: 'HITL is like an instructor with a brake pedal beside a learner driver, approving each turn before it happens. HOTL is like Colombo traffic lights running automatically while an officer watches screens and intervenes when needed. Automation bias is like a driver following a GPS into a lake simply because it said to turn left.',
      example: 'Incident timeline: 09:00, a user reports that the chatbot showed someone else’s order. 09:15, contain the issue by disabling the order-lookup tool. 09:30, preserve logs and find that 42 users’ data was exposed over three days. 11:00, identify the root cause: the tool checked only the order ID, not whether it belonged to the signed-in user. Fix with a server-side ownership check. 13:00, add the attack to the regression suite and have the legal team notify the 42 affected users.',
      keyPoints: [
        'HITL requires human approval before action; HOTL acts automatically while a human monitors and can override.',
        'Disclaimers and annual audits are not HITL.',
        'Automation bias can turn review into a rubber stamp; show sources and uncertainty, use seeded-error audits, and manage workload.',
        'A sudden change in safety-rail trigger rate merits investigation; do not simply turn the rail off.',
        'Incident response: contain → preserve logs and assess → fix root cause → regression tests and notify.',
      ],
      terms: [
        { en: 'Human-in-the-Loop (HITL)', si: 'Oversight where a person approves a decision before it takes effect.' },
        { en: 'Human-on-the-Loop (HOTL)', si: 'Oversight where people monitor an autonomous system and can override it.' },
        { en: 'Human-out-of-the-Loop', si: 'A system operating without human intervention.' },
        { en: 'Automation Bias', si: 'The human tendency to trust automated output too much.' },
        { en: 'Seeded-error Audit', si: 'Test cases with deliberate errors used to check whether reviewers actually verify outputs.' },
        { en: 'Alt Text', si: 'Text that describes an image for screen-reader users.' },
        { en: 'Incident Response', si: 'The process of containing, investigating, remediating, and reporting an AI or security incident.' },
        { en: 'Rollback / Gating', si: 'Reverting a problematic update or stopping its release.' },
      ],
    },
    // 20
    {
      id: 'sri-lanka-pdpa-practice',
      title: 'Beyond the Exam: Sri Lanka Personal Data Protection Act No. 9 of 2022 & a Practical Responsible-AI Checklist',
      examRefs: [],
      si: 'ඔයා ලංකාවේ loan chatbot එකක් හදනවා නම්, පාරිභෝගිකයාගේ NIC අංකය log එකට යන්න කලින් mask කරන්න. Logs දින 90කින් මකා දැමීම, districts අනුව approval rate පරීක්ෂා කිරීම, සහ AI තීරණයට නිලධාරියෙකුගේ අනුමැතිය ගැනීම වගකීමෙන් කරන වැඩ. Data Protection Act එකේ නීතිමය ක්‍රියාත්මක වන දින වෙනස් විය හැකි නිසා නවතම නිල නිවේදන බලන්න. ඔයාගේ checklist එක data එකතු කිරීමෙන් පසු monitoring සහ නැවත පරීක්ෂාව දක්වාම යා යුතුයි.',
      body: [
        'If you build an AI system in Sri Lanka, local law matters alongside the EU AI Act and GDPR: the Personal Data Protection Act, No. 9 of 2022 (PDPA), was passed by Parliament in 2022 as Sri Lanka’s first comprehensive data-protection law. Like GDPR, it applies to controllers and processors handling personal data. It can apply to processing in Sri Lanka and, in some cases, to foreign organizations offering goods or services to people in Sri Lanka.',
        'Key ideas similar to GDPR include a lawful basis for processing (such as consent), purpose limitation, data minimization, accuracy, storage limitation, integrity and confidentiality (security), and accountability. Data subjects have rights to access and correct data, erase it in some cases, and withdraw consent. The law provides for a Data Protection Authority, and some controllers need a Data Protection Officer. Provisions were scheduled to take effect in stages and dates have changed; always check the latest official sources, such as the Data Protection Authority and Government Gazette, for current dates and penalties.',
        'Several ideas in this phase relate directly to the PDPA: PII redaction and log retention (storage limitation), pseudonymization (still personal data while its key exists), machine unlearning for erasure requests, and model cards for transparency. A practical responsible-AI checklist is: (1) document the use case and harm categories (Map); (2) check data provenance, licenses, and consent, and write a datasheet; (3) redact PII and deduplicate; (4) evaluate subgroups and intersections with bias benchmarks; (5) red-team with garak scans and manual testing, tracking ASR and false-refusal rate; (6) add input, output, and topical guardrails, least-privilege tools, and a lethal-trifecta check; (7) prepare a model or system card; (8) design human oversight, monitoring dashboards, and an incident-response runbook; (9) retest regularly after release.',
      ],
      analogy: 'The PDPA is like rules for citizen-registration records at a local government office. Information can be collected for a reason and only in the necessary amount; it must be kept secure, corrected when someone reports an error, and not sold arbitrarily.',
      example: 'A Colombo fintech builds a loan chatbot. It masks NIC and phone numbers before logging them, deletes logs after 90 days, and has an officer approve AI-drafted loan decisions (HITL). It checks selection rates by district using the four-fifths rule. If a customer asks for deletion, it removes the data from the database and, if it was in fine-tuning data, removes it in the next retraining run or through SISA. It clearly tells customers that they are interacting with AI.',
      keyPoints: [
        'Sri Lanka PDPA is the Personal Data Protection Act, No. 9 of 2022, a comprehensive local data-protection law.',
        'Principles include lawful basis, purpose limitation, minimization, accuracy, storage limitation, security, and accountability.',
        'Data-subject rights include access, correction, erasure in some cases, and withdrawal of consent.',
        'The law provides for a Data Protection Authority; check current official sources for dates and penalties.',
        'Responsible AI requires a lifecycle checklist: map → data → evaluate → red team → guard → document → oversee → monitor.',
      ],
      terms: [
        { en: 'PDPA (Sri Lanka)', si: 'The Personal Data Protection Act, No. 9 of 2022.' },
        { en: 'Data Controller', si: 'An organization that decides why and how personal data is processed.' },
        { en: 'Data Processor', si: 'An organization that processes data on behalf of a controller, such as a cloud vendor.' },
        { en: 'Data Subject', si: 'The individual to whom personal data relates.' },
        { en: 'Purpose Limitation', si: 'Using personal data only for its stated purpose.' },
        { en: 'Data Protection Officer (DPO)', si: 'A person responsible for data-protection compliance within an organization.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'A hiring screen advances 50 of 200 people in group X and 30 of 150 people in group Y. What conclusion follows from the four-fifths rule?',
      options: ['Ratio 0.60; there is adverse impact', 'Ratio 0.80; exactly at the threshold, so it is not flagged', 'Ratio 0.75; there is adverse impact', 'Ratio 1.25; there is no concern'],
      answer: 1,
      why: 'Rates: 50/200 = 0.25 and 30/150 = 0.20. Ratio = 0.20 ÷ 0.25 = 0.80. The rule flags only values below 0.8. A common mistake is dividing the counts (30/50 = 0.60).',
    },
    {
      q: 'Two groups have different base rates. The team wants both calibration within groups and equalized odds. Which statement is correct?',
      options: ['Collecting more data achieves both', 'Removing the protected attribute achieves both', 'Without a perfect predictor, both generally cannot be achieved at once; choose a trade-off', 'An accuracy of 99% achieves both'],
      answer: 2,
      why: 'The fairness impossibility results (Kleinberg, Chouldechova) show that different base rates generally prevent an imperfect classifier from achieving calibration and equal error rates simultaneously.',
    },
    {
      q: 'A count query with sensitivity 1 is published using the Laplace mechanism with ε = 0.5. What is the noise scale b?',
      options: ['0.5', '2', '1', '0.25'],
      answer: 1,
      why: 'b = sensitivity ÷ ε = 1 ÷ 0.5 = 2. Multiplying would give 0.5, which is incorrect. Smaller ε means more noise.',
    },
    {
      q: 'Names are replaced with consistent random IDs, and a separate ID-to-name lookup table is kept. What is this?',
      options: ['Anonymization; privacy laws do not apply', 'Differential privacy', 'Pseudonymization; the key allows re-identification, so it is still personal data', 'Encryption at rest'],
      answer: 2,
      why: 'As long as the mapping exists, identities can be recovered. Pseudonymized data therefore remains personal data.',
    },
    {
      q: 'An email assistant summarizes messages and can also send emails. What design best limits harm from hidden instructions in an email?',
      options: ['Tell it in the system prompt to ignore instructions in emails', 'Treat email content as untrusted data, restrict tools during summarization, and require user confirmation before sending', 'Increase the model size', 'Set temperature to 0'],
      answer: 1,
      why: 'No prompt instruction can reliably stop injection. Limit what a hijacked model can do with least privilege and human confirmation.',
    },
    {
      q: 'A red team ran 240 jailbreak tests and 18 produced policy-violating output. What is the attack success rate?',
      options: ['18%', '92.5%', '7.5%', '13.3%'],
      answer: 2,
      why: 'ASR = 18 ÷ 240 = 0.075 = 7.5%. The 92.5% figure is the block rate.',
    },
    {
      q: 'Which NeMo Guardrails rail masks sensitive data or removes untrusted passages from RAG chunks before adding them to the LLM prompt?',
      options: ['Dialog rails', 'Retrieval rails', 'Execution rails', 'Topical rails'],
      answer: 1,
      why: 'Retrieval rails operate on retrieved chunks. Execution rails handle tool/action inputs and outputs, while dialog rails control conversation flow.',
    },
    {
      q: 'Does a model trained with 70B parameters and 15T tokens exceed the EU AI Act systemic-risk threshold of 10^25 FLOPs? (C ≈ 6ND)',
      options: ['Yes, 6.3 × 10^25', 'No, 1.05 × 10^24', 'Yes, 1.05 × 10^27', 'No, 6.3 × 10^24'],
      answer: 3,
      why: '6 × 7×10^10 × 1.5×10^13 = 63 × 10^23 = 6.3 × 10^24, which is below 10^25. Omitting 6 would give 1.05 × 10^24.',
    },
    {
      q: 'A green-list watermark has γ = 0.25. A 200-token text contains 80 green tokens. What is the approximate z-score?',
      options: ['0.8', '2.1', '4.9', '8.0'],
      answer: 2,
      why: 'Expected = 50. Variance = 200 × 0.25 × 0.75 = 37.5, so standard deviation ≈ 6.12. z = (80 − 50) ÷ 6.12 ≈ 4.9. Dividing by variance gives the incorrect answer 0.8.',
    },
    {
      q: 'A fraud system automatically freezes accounts. Analysts monitor a dashboard and can reverse a freeze afterward. What oversight model is this?',
      options: ['Human-in-the-loop', 'Human-on-the-loop', 'Human-out-of-the-loop with no oversight', 'Human-in-command of training data'],
      answer: 1,
      why: 'The system acts independently while people monitor and can override it, which is human-on-the-loop. HITL would require approval before each freeze.',
    },
  ],
}
