export default {
  id: 'ml-deep-dive',
  number: 17,
  title: 'ML & Deep Learning Fundamentals: Deep Dive',
  titleSi: 'ML සහ Deep Learning මූලික කරුණු: ගැඹුරටම, exam ගණන් එක්කම',
  summary: 'Phase 2 සහ 3 වල ඔයා ඉගෙන ගත්තු ML / Deep Learning මූලික අදහස් මෙතනදී ගැඹුරටම හාරලා බලනවා. Exam එකේ එන හැම ගණනක්ම (precision, F1, softmax, cross-entropy, KL, label smoothing, clipping, warmup, Adam bias correction) පියවරෙන් පියවර, පොඩි අංක වලින් කරලා පෙන්නනවා. අන්තිමට ලංකාවේ customer churn project එකක් raw CSV එකේ ඉඳන් evaluate කරපු model එක දක්වා කරලා බලනවා.',
  duration: 'සති 3-4',
  topics: [
    {
      id: 'ml-big-picture',
      title: 'The Big Picture: AI vs ML vs DL, Learning Paradigms, Parameters vs Hyperparameters',
      examRefs: ['FUN-001', 'FUN-002', 'FUN-003', 'FUN-004', 'FUN-005', 'FUN-049', 'FUN-052', 'FUN-110'],
      body: [
        'මුලින්ම සිතියම හරියට ඔළුවට දාගමු. AI කියන්නේ ලොකුම රවුම: බුද්ධිය ඕනේ වැඩ කරන ඕනෑම system එකක්. ඒක ඇතුළේ ML තියෙනවා: rules අතින් ලියන්නේ නැතුව data වලින් ඉගෙන ගන්න කොටස. ML ඇතුළේ DL තියෙනවා: layers ගොඩක් තියෙන neural networks පාවිච්චි කරන කොටස. ඉතින් DL ⊂ ML ⊂ AI. හැම DL එකක්ම ML, ඒත් හැම ML එකක්ම DL නෙවෙයි. Decision tree එකක් ML, ඒත් DL නෙවෙයි.',
        'Learning paradigms හතරක් exam එකේ නිතරම එනවා. Supervised = labels තියෙනවා (ගෙදර මිල, spam ද නැද්ද). Unsupervised = labels නෑ, data එකේම තියෙන රටා හොයනවා (customer segments 2 million කට clustering). Reinforcement learning = agent කෙනෙක් environment එකක actions කරලා, reward එක උපරිම කරන policy එකක් ඉගෙන ගන්නවා. ඒකට "හරි action එක" කියලා label එකක් කවදාවත් ලැබෙන්නේ නෑ, reward විතරයි, ඒකත් සමහර වෙලාවට පරක්කු වෙලා. Self-supervised = labels data එකෙන්ම ස්වයංක්‍රීයව හදාගන්නවා. ඊළඟ වචනය predict කරන LLM pretraining එක හොඳම උදාහරණය. Mechanically supervised වගේ, ඒත් මිනිස්සු label කරන්නේ නැති නිසා web එක තරම් data වලට scale වෙනවා.',
        'Task වර්ගය හඳුනාගන්න සරල ප්‍රශ්නයක් අහන්න: "Output එක අංකයක්ද, නැත්නම් කාණ්ඩයක්ද?" Parcel එකක් එන්න යන මිනිත්තු ගණන = අංකයක් = regression. "වෙලාවට එනවද / පරක්කුද" = කාණ්ඩ = classification. Labels නැතුව කණ්ඩායම් හොයනවා නම් = clustering.',
        'Parameters සහ hyperparameters පටලවගන්න එපා. Parameters = training එකේදී data වලින් model එක තනියම ඉගෙන ගන්න දේවල්: weights, biases, decision tree එකේ split thresholds. Hyperparameters = training එකට කලින් ඔයා තෝරන settings: learning rate, batch size, layers ගණන, trees ගණන, k. Deep learning ගේ ලොකුම වාසිය: images, audio, text වගේ unstructured data වලින් features තනියම ඉගෙන ගන්නවා (edges → shapes → objects). ඒත් ඒකට data සහ compute (GPU) වැඩියෙන් ඕනේ. Data අඩු නම් (උදා: images 800යි) transfer learning තමයි හොඳම විසඳුම: ලොකු dataset එකක pretrain කරපු model එකක් අරන් අලුත් task එකට adapt කරනවා.',
      ],
      analogy: 'ලංකාව (AI) ඇතුළේ බස්නාහිර පළාත (ML) තියෙනවා, ඒක ඇතුළේ කොළඹ දිස්ත්‍රික්කය (DL) තියෙනවා. කොළඹ ඉන්න හැමෝම බස්නාහිර පළාතේ, ඒත් බස්නාහිර පළාතේ ඉන්න හැමෝම කොළඹ නෙවෙයි (ගම්පහ ඉන්න අයත් ඉන්නවා = decision trees). Learning paradigms: ගුරුවරයා උත්තර දීලා උගන්නනවා = supervised. උත්තර නැතුව ළමයි තනියම කණ්ඩායම් හොයනවා = unsupervised. Cricket batsman කෙනෙක් පිටියේ ගහලා බලලා runs (reward) වලින් ඉගෙන ගන්නවා = RL. පොතක වාක්‍යයක අන්තිම වචනය වහලා අනුමාන කරනවා = self-supervised.',
      example: 'Exam ප්‍රශ්නයක් හඳුනාගන්න හැටි: (1) "Customers 2 million, labels නෑ, segments හොයන්න" → unsupervised clustering (k-means). (2) "Delivery time මිනිත්තු වලින්" → regression. (3) "Agent, actions, cumulative reward" → RL. (4) "Raw web text එකේ ඊළඟ වචනය" → self-supervised. (5) "Learning rate එක parameter එකක්ද?" → නෑ, hyperparameter එකක්. (6) "Defect images 800යි" → pretrained CNN එකකින් transfer learning. Scratch එකෙන් epochs 1,000ක් train කළොත් images 800 කටපාඩම් කරනවා විතරයි.',
      keyPoints: [
        'DL ⊂ ML ⊂ AI. Decision trees ML, ඒත් DL නෙවෙයි.',
        'Labels නෑ → unsupervised. Reward විතරයි → RL. Labels data එකෙන්ම → self-supervised.',
        'අංකයක් predict කරනවා → regression. කාණ්ඩයක් → classification.',
        'Parameters ඉගෙන ගන්නවා (weights, thresholds). Hyperparameters ඔයා තෝරනවා (learning rate).',
        'DL = raw data වලින් features තනියම ඉගෙන ගන්නවා, ඒත් data සහ GPU වැඩියෙන් ඕනේ. Data අඩු නම් transfer learning.',
      ],
      terms: [
        { en: 'Self-Supervised Learning', si: 'Labels මිනිස්සු දාන්නේ නැතුව data එකෙන්ම හදාගන්න ක්‍රමය. උදා: ඊළඟ වචනය predict කිරීම.' },
        { en: 'Reinforcement Learning', si: 'Agent කෙනෙක් actions කරලා cumulative reward එක උපරිම කරන policy එකක් ඉගෙන ගන්න ක්‍රමය.' },
        { en: 'Policy', si: 'RL වලදී "මේ තත්ත්වයේදී මොන action එකද කරන්නේ" කියලා තීරණය කරන rule එක.' },
        { en: 'Hyperparameter', si: 'Training එකට කලින් තෝරන setting එකක්. Data වලින් ඉගෙන ගන්නේ නෑ.' },
        { en: 'Transfer Learning', si: 'ලොකු data එකක pretrain කරපු model එකක දැනුම අලුත්, පොඩි task එකකට ගෙනියන එක.' },
        { en: 'Representation Learning', si: 'Raw data වලින් ප්‍රයෝජනවත් features model එකම ඉගෙන ගන්න එක. DL ගේ ප්‍රධාන ශක්තිය.' },
      ],
    },
    {
      id: 'splits-leakage-cv',
      title: 'Honest Evaluation: Splits, Leakage, Stratified / Group / Time Splits, Nested CV',
      examRefs: ['FUN-006', 'FUN-007', 'FUN-016', 'FUN-050', 'FUN-053', 'FUN-054', 'FUN-055', 'FUN-093', 'FUN-094', 'FUN-095', 'FUN-136', 'FUN-137'],
      body: [
        'Data තුන් කොටසකට බෙදනවා. Training set = model එක ඉගෙන ගන්නවා. Validation set = hyperparameters තෝරන්න, models අතරින් හොඳම එක තෝරන්න, කවදා නවත්තන්නද කියලා තීරණය කරන්න. Test set = අන්තිමට, එක පාරක් විතරක්, "ඇත්ත ලෝකයේ කොච්චර හොඳද" කියලා අපක්ෂපාතීව මනින්න. Validation set එකට අපි තීරණ fit කරන නිසා ඒක තවදුරටත් අපක්ෂපාතී නෑ. Test set එක හැම hyperparameter වෙනසකටම බලලා හොඳම එක තෝරනවා නම්, test set එකත් selection loop එකේ කොටසක් වෙනවා. එතකොට ඒ ලකුණ optimistic (බොරු ලෙස හොඳ). Weights වෙනස් වෙන්නේ නෑ, leakage වෙන්නේ මිනිස් තේරීම හරහා.',
        'Leakage කියන්නේ prediction වෙලාවේ තියෙන්න බැරි තොරතුරු training එකට රිංගන එක. වර්ග: (1) Preprocessing leakage: මුළු dataset එකේම mean / std අරන් standardize කරලා ඊට පස්සේ split කරනවා. හරි ක්‍රමය: train එකේ විතරක් fit කරලා, val / test වලට apply කරනවා. (2) Target leakage: "account_closed_date" වගේ churn වුණාට පස්සේ විතරක් පිරෙන feature එකක්. Validation accuracy 99% වගේ සැක හිතෙන තරම් හොඳ ලකුණක් leakage ගේ සලකුණක්. (3) Target encoding leakage: merchant_id එක ඒ merchant ගේ fraud rate එකෙන් replace කරනවා, ඒත් row එකේම label එක ඒ average එකට ඇතුළත් වෙනවා. Transactions 1යි තියෙන merchant කෙනෙක් නම් encoded අගය = label එකමයි! විසඳුම: out-of-fold encoding + global mean එක දිහාට smoothing.',
        'Split ක්‍රමය data එකේ හැඩයට ගැළපෙන්න ඕනේ. Stratified split: positives 3%යි නම්, හැම split එකකම (සහ CV fold එකකම) 3% ක් තියෙන්න බලාගන්නවා. නැත්නම් validation එකේ positives නැතුව යන්න පුළුවන්. Time-based split: forecasting නම් පරණ කාලෙන් train කරලා අලුත් කාලෙන් validate කරනවා. Random shuffle කළොත් model එක "අනාගතය" දැකලා train වෙනවා. Group split: එක patient කෙනෙක්ගේ X-rays කීපයක් තියෙනවා නම්, ඒ patient ගේ ඔක්කොම images එකම පැත්තට (GroupKFold). නැත්නම් model එක ලෙඩේ නෙවෙයි, patient ව අඳුනගන්නවා.',
        'k-fold CV: data k කොටසකට කඩලා, k පාරක් train කරනවා. හැම පාරම එක fold එකක් validate කරලා අනිත් ඒවායින් train කරනවා, අන්තිමට සාමාන්‍යය. LOOCV = k = n (examples ගණන). පොඩි data වලට හොඳයි, ඒත් training runs n ක්. Nested CV: inner loop එක tuning කරනවා, outer loop එක ඒ මුළු tuning ක්‍රියාවලියම කවදාවත් නොදැකපු data වලින් evaluate කරනවා. Configs 50ක හොඳම CV ලකුණ report කළොත්, ඒක ඒ folds වල වාසනාවන්ත noise එකත් අහුලගන්නවා, ඒ නිසා optimistic. Random search vs grid search: වැදගත් hyperparameters ටිකයි නම්, 5×5 grid එකක් වැදගත් එකේ අගයන් 5ක් විතරයි බලන්නේ. Random trials 25ක් ඒකේම වෙනස් අගයන් 25ක් දක්වා බලනවා.',
      ],
      analogy: 'A/L විභාගය හිතන්න. Past papers = training set. ගුරුතුමා දෙන model papers = validation set (ඔයා ඒවා බලලා පාඩම් කරන විදිහ වෙනස් කරනවා). ඇත්ත A/L paper එක = test set, එක පාරයි. Paper එක leak වෙලා කලින් බැලුවොත් (leakage) ලකුණු හොඳයි, ඒත් ඔයාට ඇත්තටම විෂය තේරෙනවා කියලා ඒකෙන් කියවෙන්නේ නෑ. Group leakage = එකම ගුරුවරයාගේ paper එකේ ප්‍රශ්න tutory එකේදීත් exam එකේදීත් එනවා. ඔයා ඉගෙන ගත්තේ විෂය නෙවෙයි, ගුරුවරයාගේ style එක.',
      example: 'Medical dataset: rows 1,000, positives 30 (3%). Random 80/20 split එකකින් validation rows 200 ට positives 6ක් එන්න ඕනේ, ඒත් වාසනාව අනුව 1ක් හෝ 2ක් විතරක් එන්න පුළුවන්. Stratified split එක හරියටම 6ක් දානවා. Nested CV: outer folds 5 × inner folds 5 = tuning runs 25ක් × configs ගණන. ගොඩක් වැඩ, ඒත් report කරන ලකුණ අවංකයි. Target encoding: merchant "Kandy Spices" ට transactions 1යි, ඒක fraud. සාමාන්‍ය encoding = 1.0 (label එකමයි!). Smoothing (global fraud rate 2%, weight 10): (1 + 10 × 0.02) / (1 + 10) = 1.2 / 11 ≈ 0.11.',
      code: {
        lang: 'python',
        src: `from sklearn.model_selection import (train_test_split, StratifiedKFold,
    GroupKFold, TimeSeriesSplit, GridSearchCV, cross_val_score)
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

# stratify=y: හැම කොටසකම class ratio එක එකයි
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y)
# Pipeline: scaler එක fit වෙන්නේ හැම fold එකකම train කොටසට විතරයි (leakage නෑ)
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
inner = GridSearchCV(pipe, {"logisticregression__C": [0.1, 1, 10]}, cv=StratifiedKFold(5))
outer = cross_val_score(inner, X_tr, y_tr, cv=StratifiedKFold(5))  # nested CV
print(outer.mean())
# Patients නම්: GroupKFold(5) + groups=patient_id. Time series නම්: TimeSeriesSplit(5)`,
      },
      keyPoints: [
        'Validation = tuning සහ තේරීම. Test = අන්තිමට එක පාරයි. Test එකෙන් tune කළොත් ලකුණ optimistic.',
        'Preprocessing statistics train එකෙන් විතරයි. Pipeline එකක් පාවිච්චි කරන්න.',
        'සැක හිතෙන තරම් හොඳ ලකුණක් = leakage ගැන හොයන්න.',
        'දුර්ලභ class → stratified. කාලය → time split. එකම කෙනාගේ rows කීපයක් → group split.',
        'Best CV score එක report කරනවා නම් optimistic. Nested CV හෝ අල්ලපු නැති test set එකක් පාවිච්චි කරන්න.',
      ],
      terms: [
        { en: 'Data Leakage', si: 'Prediction වෙලාවේ නොලැබෙන තොරතුරු training එකට රිංගලා ලකුණු බොරුවට වැඩි කරන එක.' },
        { en: 'Target Leakage', si: 'Label එක ආපහු කියවෙන, outcome එකට පස්සේ විතරක් පිරෙන feature එකක්.' },
        { en: 'Stratified Split', si: 'හැම split / fold එකකම class ratio එක මුල් data එකේ වගේම තියාගන්නා split එක.' },
        { en: 'GroupKFold', si: 'එකම group එකේ (patient, customer) rows ඔක්කොම එකම fold එකට දාන CV ක්‍රමය.' },
        { en: 'LOOCV', si: 'Leave-One-Out CV. k = n වෙන k-fold. Example එකක් බැගින් validate කරනවා.' },
        { en: 'Nested Cross-Validation', si: 'Inner loop එක tune කරනවා, outer loop එක ඒ මුළු tuning ක්‍රියාවලියම evaluate කරනවා.' },
        { en: 'Target Encoding', si: 'Category එකක් ඒකේ target සාමාන්‍යයෙන් replace කරන එක. Out-of-fold සහ smoothing එක්ක කරන්න ඕනේ.' },
      ],
    },
    {
      id: 'preprocessing-deep-dive',
      title: 'Preprocessing Deep Dive: Scaling Maths, Encoding, Imputation, Curse of Dimensionality',
      examRefs: ['FUN-021', 'FUN-022', 'FUN-079', 'FUN-080', 'FUN-081', 'FUN-082'],
      body: [
        'Scaling ක්‍රම දෙකක් මතක තියාගන්න. Standardization (z-score) = (x − mean) ÷ std. ප්‍රතිඵලය: mean 0, standard deviation 1. Min-max normalization = (x − min) ÷ (max − min). ප්‍රතිඵලය: 0 සිට 1 දක්වා. Exam trap එක: min-max වලදී උඩ කොටසෙන් (numerator) min එක අඩු කරන්න අමතක කරන එක.',
        'Scaling වැදගත් වෙන්නේ කොයි algorithms වලටද? Distance එකක් හරි gradient descent එකක් හරි පාවිච්චි කරන ඒවාට: kNN, k-means, RBF kernel SVM, PCA, neural networks. "Salary (රුපියල් 50,000)" සහ "වයස (30)" එකට දැම්මොත් distance එක salary එකෙන්ම තීරණය වෙනවා. Random forest, decision trees වලට scaling වැඩක් නෑ. Tree split එකක් කියන්නේ "එක feature එකක් threshold එකකට වඩා ලොකුද?" කියන ප්‍රශ්නයක් විතරයි. Feature එක 1000න් ගුණ කළත් ඒ split එකම කරන්න පුළුවන් (threshold එකත් 1000න් ගුණ වෙනවා).',
        'Categorical features: පිළිවෙළක් නැති ඒවා (card, cash, transfer) one-hot encode කරන්න. Label encoding (0, 1, 2) කළොත් linear model එක හිතනවා transfer = 2 × cash කියලා. ඒක බොරු පිළිවෙළක්. පිළිවෙළක් තියෙන ඒවාට (S, M, L) ordinal encoding හරි. Missing values: ලොකු outliers තියෙන income වගේ feature එකකට median imputation එක ආරක්ෂිතයි. Mean එක කෝටිපතියෝ කීපදෙනෙක් නිසා උඩට ඇදෙනවා. 0 දැම්මොත් බොරු cluster එකක් හැදෙනවා.',
        'Curse of dimensionality: features ගණන ගොඩක් වැඩි වුණාම (උදා: 10 → 2,000) points ඔක්කොම එකිනෙකට "දුරින්" වගේ වෙනවා. ළඟම අසල්වැසියා සහ දුරම අසල්වැසියා අතර වෙනස අඩු වෙනවා. ඉතින් kNN වගේ distance-based ක්‍රමවලට "nearest" කියන එකේ තේරුම නැති වෙනවා. විසඳුම: PCA වගේ dimensionality reduction, නැත්නම් feature selection. kNN ට learning rate එකක් නෑ, ඉතින් ඒ ගැන උත්තර බොරු.',
      ],
      analogy: 'Kottu කඩේක ලකුණු දෙන්න හිතන්න: මිල රුපියල් 800, රස ලකුණු 1-10. "සමාන කඩ" හොයන්න distance ගත්තොත් රුපියල් 50ක මිල වෙනස රස ලකුණු 5ක වෙනසට වඩා ලොකු වෙනවා. ඒක අසාධාරණයි. Scaling කියන්නේ දෙකම එකම මිනුම් පරිමාණයට ගේන එක. Median imputation: ගමක ගෙවල් 5ක ආදායම් දන්නවා, එක ගෙදරක ඉන්නේ ව්‍යාපාරිකයෙක්. "සාමාන්‍ය ආදායම" mean එකෙන් ගත්තොත් ගමම පොහොසත් වගේ පේනවා. Median එක ඇත්ත තත්ත්වය කියනවා.',
      example: 'Min-max: feature එක 10 සිට 60 දක්වා. 30 → (30 − 10) ÷ (60 − 10) = 20 ÷ 50 = 0.40. (Trap: 30 ÷ 50 = 0.60.) Z-score: mean 50, std 10 නම් 70 → (70 − 50) ÷ 10 = 2. ඒ කියන්නේ "mean එකට වඩා std 2ක් උඩින්". Median: ආදායම් Rs. 50,000, 60,000, 70,000, 80,000, 10,000,000. Mean = 10,260,000 ÷ 5 = Rs. 2,052,000 (කිසිම සාමාන්‍ය ගෙදරකට ගැළපෙන්නේ නෑ). Median = Rs. 70,000 (මැද අගය).',
      keyPoints: [
        'Z-score → mean 0, std 1. Min-max → 0 සිට 1. Min එක අඩු කරන්න අමතක කරන්න එපා.',
        'Distance / gradient පාවිච්චි කරන algorithms වලට scaling ඕනේ. Trees වලට ඕනේ නෑ.',
        'පිළිවෙළක් නැති categories → one-hot. Label encoding බොරු පිළිවෙළක් දානවා.',
        'Outliers තියෙන feature එකකට median imputation.',
        'Dimensions ගොඩක් වැඩි වුණාම distances අර්ථය නැති වෙනවා → PCA / feature selection.',
      ],
      terms: [
        { en: 'Standardization (Z-score)', si: '(x − mean) ÷ std. Mean 0, std 1 කරනවා.' },
        { en: 'Min-Max Normalization', si: '(x − min) ÷ (max − min). 0 සිට 1 පරාසයට ගේනවා.' },
        { en: 'One-Hot Encoding', si: 'හැම category එකකටම වෙනම 0/1 column එකක්. පිළිවෙළක් උපකල්පනය කරන්නේ නෑ.' },
        { en: 'Median Imputation', si: 'නැති අගයන් median එකෙන් පුරවන එක. Outliers වලට ඔරොත්තු දෙනවා.' },
        { en: 'Curse of Dimensionality', si: 'Dimensions වැඩි වුණාම data විසිරිලා, distances හැමතැනම සමාන වගේ වෙන ප්‍රශ්නය.' },
        { en: 'Scale Invariance', si: 'Feature එකක ඒකකය වෙනස් කළත් ප්‍රතිඵලය වෙනස් නොවීම. Trees වල තියෙනවා.' },
      ],
    },
    {
      id: 'learning-curves-bias-variance',
      title: 'Reading Loss Curves: Overfitting, Underfitting, Early Stopping, Bias-Variance, Double Descent',
      examRefs: ['FUN-008', 'FUN-009', 'FUN-020', 'FUN-051', 'FUN-070', 'FUN-115', 'FUN-150'],
      body: [
        'Exam එකේ curves කියවන්න රටා 5ක් ඔළුවේ තියාගන්න. (1) Overfitting: training loss දිගටම අඩු වෙනවා, validation loss යම් epoch එකකින් පස්සේ වැඩි වෙනවා. පරතරය (gap) ලොකු වෙනවා. Model එක training data කටපාඩම් කරනවා. (2) Underfitting: training loss සහ validation loss දෙකම ඉහළ, දෙකම එකට ළඟ. Model එකට රටාව අල්ලගන්න බෑ. (3) Good fit: දෙකම අඩු, දෙකම ළඟ. (4) Learning rate ගොඩක් ලොකු: loss එක පනිනවා, NaN වෙනවා. (5) Model එක ඉගෙන ගන්නේම නෑ: loss එක මුල ඉඳන්ම ln(K) අගයේ හිරවෙලා (exam calculations topic එකේ බලන්න).',
        'Underfitting (high bias) හදන්නේ capacity වැඩි කරලා: වඩා expressive model එකක් (linear → trees / neural net), හොඳ features එකතු කරලා, regularization අඩු කරලා, වැඩි කාලයක් train කරලා. Regularization වැඩි කිරීම, dropout වැඩි කිරීම, data අඩු කිරීම underfitting තවත් නරක් කරනවා. Overfitting (high variance) හදන්නේ අනිත් පැත්තට: data වැඩි කරලා, regularization, dropout, augmentation, early stopping, සරල model එකක්.',
        'Early stopping: validation metric එක බලාගෙන ඉන්නවා. Patience = "හොඳ නොවී කොච්චර epochs ඉවසනවද". Validation loss හොඳම වුණේ epoch 8 දී, patience 3 නම්: epochs 9, 10, 11 හොඳ වෙන්නේ නෑ, ඉතින් epoch 11 දී නවත්තනවා. ඒත් තියාගන්නේ epoch 8 checkpoint එක (best weights restore කරනවා). Training loss 0 වෙනකම් ඉන්න එක කටපාඩම් කිරීම දිරිමත් කරනවා.',
        'Bias-variance decomposition (squared error වලට): Expected test error = Bias² + Variance + Irreducible noise. Bias = ක්‍රමානුකූල වැරැද්ද (model එක ගොඩක් සරලයි). Variance = training set එක පොඩ්ඩක් වෙනස් කළාම predictions කොච්චර වෙනස් වෙනවද. Noise = කිසිම model එකකට අයින් කරන්න බැරි, data එකේම තියෙන අවිනිශ්චිතතාව. High bias + low variance = underfitting: training error ඉහළ, test error එයට සමාන. Double descent: model size එක training data හරියටම fit කරන තැන (interpolation threshold) පහු කරලා තවත් ලොකු කළාම, test error එක ඉහළ ගිහින් ආයෙත් අඩු වෙනවා. ලොකු over-parameterized models (LLMs) වලදී පරණ U-shape curve එක හැමවිටම වලංගු නෑ.',
      ],
      analogy: 'Dartboard එකකට ඊතල ගහනවා හිතන්න. High bias = ඔක්කොම ඊතල එකට එකතු වෙලා, ඒත් මැදට නෙවෙයි, එක පැත්තකට (ක්‍රමානුකූල වැරැද්ද). High variance = ඊතල මැද වටේ, ඒත් හැම පැත්තටම විසිරිලා. Noise = සුළඟ. ඔයා කොච්චර දක්ෂ වුණත් සුළඟ නවත්තන්න බෑ. Overfitting = A/L ළමයෙක් past paper උත්තර කටපාඩම් කරනවා. ඒ papers වලට 100%, අලුත් paper එකට අසමත්.',
      example: 'Training log එක: epoch 1-8 දී val loss 1.20 → 0.40 දක්වා අඩු වෙනවා. Epoch 9 = 0.42, epoch 10 = 0.45, epoch 11 = 0.47. Training loss දිගටම 0.38 → 0.20. මේ overfitting. Patience 3 → epoch 11 දී නවත්තනවා, epoch 8 weights restore කරනවා. Underfitting උදාහරණය: linear model එකක train error 35%, val error 37%. Gap එක පොඩියි, දෙකම ඉහළ. L2 වැඩි කරන එක වැරදියි. Gradient boosted trees වලට මාරු වෙලා features එකතු කළාම train 8%, val 11%.',
      keyPoints: [
        'Train ↓ val ↑ = overfitting. දෙකම ඉහළ, ළඟ = underfitting.',
        'Underfitting fix = capacity / features වැඩි කරන්න, regularization අඩු කරන්න.',
        'Early stopping නවත්තන්නේ patience ඉවර වුණාම, තියාගන්නේ best epoch එක.',
        'Error = Bias² + Variance + Noise. Noise එක අයින් කරන්න බෑ.',
        'Double descent: interpolation threshold එකෙන් පස්සේ test error ආයෙත් අඩු වෙන්න පුළුවන්.',
      ],
      terms: [
        { en: 'Overfitting', si: 'Training data කටපාඩම් කරලා අලුත් data වලට අසමත් වෙන එක (high variance).' },
        { en: 'Underfitting', si: 'Training data වල රටාවත් අල්ලගන්න බැරි තරම් model එක සරල වීම (high bias).' },
        { en: 'Patience', si: 'Early stopping වලදී හොඳ නොවී ඉවසන epochs ගණන.' },
        { en: 'Irreducible Error', si: 'Data එකේම තියෙන noise. කිසිම model එකකට අඩු කරන්න බෑ.' },
        { en: 'Double Descent', si: 'Model size එක interpolation threshold එක පහු කළාම test error එක ආයෙත් අඩු වෙන සංසිද්ධිය.' },
        { en: 'Interpolation Threshold', si: 'Model එකට training data හරියටම (error 0) fit කරන්න පුළුවන් වෙන size එක.' },
      ],
    },
    {
      id: 'regularization-deep-dive',
      title: 'Regularization Deep Dive: L1 Sparsity, L2, Elastic Net, Strength λ, Priors, Ridge',
      examRefs: ['FUN-017', 'FUN-018', 'FUN-019', 'FUN-091', 'FUN-092', 'FUN-127', 'FUN-128'],
      body: [
        'Regularization කියන්නේ loss එකට "weights ලොකු වුණොත් දඬුවමක්" එකතු කරන එක. L2 (Ridge, weight decay): λ × Σw², ඒ කියන්නේ weights වල වර්ග වල එකතුව λ (lambda) කියන අංකයකින් ගුණ කරලා. L1 (Lasso): λ × Σ|w|, weights වල absolute අගයන්ගේ එකතුව. λ = දඬුවම කොච්චර තදද කියන knob එක.',
        'L1 weights හරියටම 0 කරන්නේ ඇයි? L2 දඬුවමේ "තල්ලුව" (gradient) 2λw. Weight එක පොඩි වෙන්න වෙන්න තල්ලුවත් පොඩි වෙනවා. ඉතින් weight එක 0 ට ළං වෙනවා, ඒත් හරියටම 0 වෙන්නේ කලාතුරකින්. L1 තල්ලුව weight එක කොච්චර පොඩි වුණත් එකම ප්‍රමාණයක් (λ). ඉතින් වැඩක් නැති features වල weights හරියටම 0 ට තල්ලු වෙනවා. ප්‍රතිඵලය sparse model එකක්, ඒ කියන්නේ built-in feature selection. Features 5,000ක් තියෙද්දී වැඩක් නැති ඒවා අයින් කරන්න ඕනේ නම් L1.',
        'Elastic Net = L1 + L2 එකට. Features එකිනෙකට ගොඩක් correlated නම් Lasso එක group එකෙන් එකක් අහඹු ලෙස තෝරනවා, අස්ථාවරයි. L2 කොටස correlated features අතර බර බෙදනවා, L1 කොටස වැඩක් නැති ඒවා 0 කරනවා. Ridge සහ multicollinearity: features දෙකක් හරියටම collinear නම් XᵀX matrix එක singular (inverse එකක් නෑ), OLS ට unique විසඳුමක් නෑ. Ridge විසඳන්නේ (XᵀX + λI)w = Xᵀy. λI එකතු කළාම හැම eigenvalue එකක්ම λ කින් උඩට යනවා, matrix එක invertible වෙනවා, බර collinear features දෙක අතර බෙදෙනවා. Feature එකක් අයින් කරන්නේ Ridge නෙවෙයි (ඒ Lasso ගේ හැසිරීමට ළඟයි).',
        'λ වැඩි කළාම: weights තදින් සීමා වෙනවා → model එක සරල වෙනවා → variance අඩු, bias වැඩි, training error වැඩි. Bayesian ඇහැකින් (MAP): L2 = weights වලට Gaussian prior එකක්, L1 = Laplace prior එකක්. Laplace prior එකට 0 ළඟ තියුණු උච්චයක් (sharp peak) තියෙනවා, ඒකයි L1 sparsity දෙන්නේ. Dropout neural networks වල regularization ක්‍රමයක්: training වලදී විතරක් අහඹු activations 0 කරනවා. Training එකෙන් පස්සේ පොඩි weights තියෙන neurons ස්ථිරවම අයින් කරන එක dropout නෙවෙයි, ඒ pruning (compression ක්‍රමයක්).',
      ],
      analogy: 'මාසික budget එකක් හිතන්න. L2 = "හැම වියදමකම වර්ගයට බදු". ලොකු වියදම් ගොඩක් අඩු වෙනවා, ඒත් පොඩි වියදම් සම්පූර්ණයෙන් නවතින්නේ නෑ. L1 = "හැම වියදමකටම, පොඩි වුණත්, ස්ථාවර ගාස්තුවක්". එතකොට වැඩක් නැති පොඩි subscriptions (Netflix, gym එක) ඔක්කොම සම්පූර්ණයෙන්ම cancel කරනවා = weights 0. λ = බදු අනුපාතය. වැඩි කරන්න වැඩි කරන්න ජීවිතය සරල වෙනවා, ඒත් ඕනේ දේවලුත් අහිමි වෙන්න පුළුවන් (bias).',
      example: 'Weight w = 0.1, λ = 0.01. L2 තල්ලුව = 2 × 0.01 × 0.1 = 0.002 (ගොඩක් පොඩියි, weight එක 0.1 ළඟ හිරවෙනවා). L1 තල්ලුව = 0.01 (weight එකේ ප්‍රමාණයෙන් ස්වාධීනයි, අවශ්‍ය නම් 0 දක්වාම යනවා). Ridge: XᵀX = [[1, 1], [1, 1]] (collinear, determinant = 0). λ = 0.1 එකතු කළාම [[1.1, 1], [1, 1.1]], determinant = 1.21 − 1 = 0.21 > 0, invertible.',
      code: {
        lang: 'python',
        src: `from sklearn.linear_model import Lasso, Ridge, ElasticNet
import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(200, 50))                 # features 50
y = 3 * X[:, 0] - 2 * X[:, 1] + rng.normal(size=200)  # ඇත්තටම වැදගත් 2යි

for m in [Ridge(alpha=1.0), Lasso(alpha=0.1), ElasticNet(alpha=0.1, l1_ratio=0.5)]:
    m.fit(X, y)
    print(type(m).__name__, "හරියටම 0 weights:", int(np.sum(m.coef_ == 0)))
# Ridge: 0ක් වගේ. Lasso: 40+ ක් 0 (sparse). alpha = λ`,
      },
      keyPoints: [
        'L2 = λΣw² (weights පොඩි කරනවා). L1 = λΣ|w| (weights හරියටම 0, sparse).',
        'Correlated features + sparsity ඕනේ → Elastic Net.',
        'λ ↑ → bias ↑, variance ↓, training error ↑.',
        'L2 ↔ Gaussian prior, L1 ↔ Laplace prior.',
        'Ridge එකේ λI එක singular XᵀX invertible කරනවා.',
      ],
      terms: [
        { en: 'L1 / Lasso', si: 'Absolute weights එකතුවට දඬුවම. Weights හරියටම 0 කරලා feature selection කරනවා.' },
        { en: 'L2 / Ridge / Weight Decay', si: 'Weights වර්ග එකතුවට දඬුවම. Weights පොඩි කරනවා, 0 කරන්නේ කලාතුරකින්.' },
        { en: 'Elastic Net', si: 'L1 සහ L2 දෙකම එකට. Correlated features වලට ස්ථාවරයි.' },
        { en: 'Sparsity', si: 'Weights ගොඩක් හරියටම 0 වීම.' },
        { en: 'MAP Estimation', si: 'Prior එකක් එක්ක likelihood එක උපරිම කරන එක. Regularization = prior.' },
        { en: 'Multicollinearity', si: 'Features එකිනෙකට ගොඩක් සම්බන්ධ වීම. OLS අස්ථාවර කරනවා.' },
        { en: 'Pruning', si: 'Training එකෙන් පස්සේ වැදගත් නැති weights / neurons ස්ථිරවම අයින් කරන compression ක්‍රමය.' },
      ],
    },
    {
      id: 'classical-supervised-deep-dive',
      title: 'Classical Models Under the Hood: Linear & Logistic Regression, SVM & Kernels, kNN, Trees',
      examRefs: ['FUN-036', 'FUN-037', 'FUN-040', 'FUN-041', 'FUN-087', 'FUN-088', 'FUN-089', 'FUN-090'],
      body: [
        'Linear regression (OLS) එකට closed-form විසඳුමක් තියෙනවා: w = (XᵀX)⁻¹Xᵀy. Normal equation එක කියලා කියන්නේ. X කියන්නේ data matrix එක (rows = examples, columns = features). ඒක සාමාන්‍යයෙන් square නෑ, ඉතින් X⁻¹ කියලා දෙයක් නෑ. Square වෙන XᵀX තමයි invert කරන්නේ. Logistic regression නමේ "regression" තිබුණත් කරන්නේ classification. ඒක linear විදිහට model කරන්නේ probability එක නෙවෙයි, log-odds: log(p ÷ (1 − p)) = w·x + b. ඊට පස්සේ sigmoid එකෙන් p ආපහු ගන්නවා. Probability එකම linear කළොත් 0-1 පරාසයෙන් එළියට යන්න පුළුවන්. Logit link එක ඒක වළක්වනවා.',
        'SVM (linear) කරන්නේ classes දෙක වෙන් කරන රේඛාවලින් widest margin එක තියෙන එක තෝරන එක. Boundary එකට ළඟම තියෙන points = support vectors. ඒ ටික විතරයි boundary එක තීරණය කරන්නේ. Kernel trick: RBF, polynomial වගේ kernels, data ඉහළ dimensional අවකාශයකට map කරලා inner products ගණනය කළා වගේ similarity එක ගණනය කරනවා, ඒත් ඒ අවකාශය කවදාවත් හදන්නේ නෑ. ප්‍රතිඵලය non-linear boundary එකක්. SVM ට තාමත් labels සහ C (regularization) parameter එක ඕනේ.',
        'kNN = "lazy learner". Training වලදී data ගබඩා කරනවා විතරයි. Predict කරද්දී ළඟම k points හොයලා majority vote එකක්. Weight vector එකක් ඉගෙන ගන්නේ නෑ, ඒ නිසා dataset එක ලොකු වෙන්න inference slow වෙනවා. k = 1: හැම prediction එකක්ම එක neighbor කෙනෙක්ව copy කරනවා, noisy, jagged boundary (high variance, training accuracy 100%). k වැඩි කළාම boundary එක smooth වෙනවා, variance අඩු, bias ටිකක් වැඩි. ගොඩක් ලොකු k → underfitting. ඉතින් k validation එකෙන් tune කරනවා.',
        'Decision tree classification split තෝරන්නේ child nodes "pure" කරන split එක. Purity මනින්නේ Gini impurity හෝ entropy (information gain). Gini = 1 − Σp². Regression trees වලට variance / MSE අඩු වීම පාවිච්චි කරනවා (target අගය මත, class index එකක් මත නෙවෙයි).',
      ],
      analogy: 'SVM = පාරක් මැද ඉරක් අඳිනවා වගේ. බස් (class A) එක පැත්තක, tuk-tuks (class B) අනිත් පැත්තේ. හොඳම ඉර = දෙපැත්තටම ලොකුම ඉඩ තියෙන එක. පාර අයිනට ළඟම තියෙන වාහන ටික (support vectors) තමයි ඉර කොහෙද කියලා තීරණය කරන්නේ. kNN = අලුත් කෙනෙක් කොයි cricket team එකට support කරනවද අනුමාන කරන්න, ඒ කෙනාට ළඟම ගෙවල් k ක අය අහනවා. k = 1 නම් එක අසල්වැසියෙක්ගේ අදහස (අහඹු). k = 7 නම් වඩා විශ්වාසදායකයි.',
      example: 'Log-odds: w·x + b = 0 → odds = e⁰ = 1 → p = 0.5. w·x + b = ln 3 ≈ 1.1 → odds = 3 → p = 3 ÷ (1 + 3) = 0.75. Gini: node එකක 50 spam, 50 ham → 1 − (0.5² + 0.5²) = 0.5 (ගොඩක් අපිරිසිදුයි). 90 / 10 → 1 − (0.81 + 0.01) = 0.18. 100 / 0 → 0 (pure). Tree එක තෝරන්නේ children වල weighted Gini එක ලොකුවටම අඩු කරන split එක.',
      keyPoints: [
        'OLS: w = (XᵀX)⁻¹Xᵀy. X invert කරන්නේ නෑ, XᵀX invert කරනවා.',
        'Logistic regression = classification. Linear වෙන්නේ log-odds.',
        'SVM = maximum margin. Kernel trick = non-linear boundary, අවකාශය හදන්නේ නැතුව.',
        'kNN: k ↑ → smooth, variance ↓, bias ↑. Weights නෑ (lazy).',
        'Classification tree = Gini / entropy. Regression tree = variance / MSE අඩු වීම.',
      ],
      terms: [
        { en: 'Normal Equation', si: 'OLS linear regression එකේ closed-form විසඳුම: w = (XᵀX)⁻¹Xᵀy.' },
        { en: 'Log-Odds (Logit)', si: 'log(p ÷ (1 − p)). Logistic regression linear ලෙස model කරන අගය.' },
        { en: 'Support Vectors', si: 'Boundary එකට ළඟම තියෙන, margin එක තීරණය කරන training points.' },
        { en: 'Kernel Trick', si: 'ඉහළ dimensional අවකාශයක inner products, ඒ අවකාශය හදන්නේ නැතුව ගණනය කරන උපක්‍රමය.' },
        { en: 'Lazy Learner', si: 'Training වලදී ගබඩා කරනවා විතරයි, වැඩේ කරන්නේ prediction වෙලාවේ (kNN).' },
        { en: 'Gini Impurity', si: '1 − Σp². Node එකක classes කොච්චර මිශ්‍රද කියන මිනුම. 0 = pure.' },
        { en: 'Information Gain', si: 'Split එකකින් entropy එක කොච්චර අඩු වුණාද කියන එක.' },
      ],
    },
    {
      id: 'unsupervised-and-embeddings-plots',
      title: 'Unsupervised Deep Dive: k-means & Elbow, PCA Maths, Reading t-SNE / UMAP Plots',
      examRefs: ['FUN-034', 'FUN-035', 'FUN-083', 'FUN-084', 'FUN-131', 'FUN-132'],
      body: [
        'k-means: k (clusters ගණන) කලින්ම ඔයා තෝරන්න ඕනේ. පියවර දෙකක් මාරුවෙන් මාරුවට: (1) හැම point එකක්ම ළඟම centroid එකට assign කරනවා, (2) centroids ඒ cluster එකේ points වල මැදට ගෙනියනවා. Labels ඕනේ නෑ. ඒත් ඒක global optimum එකම හොයනවා කියලා සහතිකයක් නෑ. ආරම්භක centroids අනුව local optimum එකකට යන්න පුළුවන් (ඒ නිසා k-means++ init සහ restarts කීපයක්). Clusters ගසක් වගේ nested ව හදන්නේ hierarchical clustering.',
        'k තෝරන්නේ කොහොමද? Elbow method: k = 1, 2, 3 ... සඳහා within-cluster sum of squares (inertia) අඳිනවා. Inertia එක k වැඩි වෙන්න හැමවිටම අඩු වෙනවා (k = points ගණන නම් 0). ඉතින් "අඩුම" එක නෙවෙයි, වැඩිදියුණුව හදිසියේම පැතලි වෙන "වැලමිට" (elbow) එක තෝරනවා. Silhouette score එකත් තවත් ක්‍රමයක්. k-means ට learning rate එකක් නෑ.',
        'PCA = unsupervised, linear dimensionality reduction. Variance උපරිම තියෙන, එකිනෙකට ලම්බක (orthogonal) දිශාවන් හොයලා data ඒවා මතට project කරනවා. හැම principal component එකක්ම මුල් features ඔක්කොගෙම එකතුවක් (combination). ඉතින් "top 20 components = original features 20" කියන එක වැරදියි. Labels පාවිච්චි කරන්නේ නෑ, ඉතින් "label එක features 20කින් විතරයි රඳා පවතින්නේ" කියන්නත් බෑ. SVD එකෙන් PCA කරන්න කලින් හැම feature එකක්ම center කරන්න ඕනේ (mean එක අඩු කරනවා). නැත්නම් පළමු component එක mean එක දිහාට point කරනවා. ඒකක වෙනස් නම් standardize කරන එකත් හොඳයි.',
        't-SNE සහ UMAP = non-linear, visualization සඳහා 2D/3D embeddings. ඒවා ප්‍රධාන වශයෙන් ආරක්ෂා කරන්නේ local neighborhoods: ළඟ points ළඟින්ම තියෙනවා. ඒත් clusters අතර දුර සහ clusters වල ප්‍රමාණය (size) විශ්වාස කරන්න බෑ. Plot එකේ clusters දෙකක් ගොඩක් දුරින් තිබුණත් "ඒ දෙක තමයි වැඩියෙන්ම වෙනස්" කියලා අනුපාතිකව කියන්න බෑ. PCA වගේ linear projection එකක් විදිහටත් පාවිච්චි කරන්න බෑ. cuML එකේ GPU-accelerated t-SNE / UMAP තියෙනවා, ලොකු data වල නැවත නැවත run කරනකොට වේගවත්.',
      ],
      analogy: 'k-means = Colombo නගරයේ කඩ k ගණනක් දාන්න තැන් හොයනවා. හැම ගෙදරක්ම ළඟම කඩේට යනවා, ඊට පස්සේ කඩේ තමන්ගේ customers ලගේ මැදට ගෙනියනවා. Elbow = කඩ 4 ඉඳන් 5 ට වැඩි කළාම customers ගමන් කරන දුර ගොඩක් අඩු වෙනවා, 5 සිට 6 ට වැඩි කළාම පොඩ්ඩයි. ඉතින් 5. UMAP plot = ලංකාවේ සිතියමක් කඩදාසියක පැතලි කරලා අඳිනවා වගේ: ගම් ඇතුළේ ගෙවල් ළඟින් තියෙනවා, ඒත් දිස්ත්‍රික්ක අතර දුර සහ ප්‍රමාණ අඹරලා. "කඩදාසියේ මේ දෙක දුරයි" කියලා කිලෝමීටර් කියන්න බෑ.',
      example: 'Inertia: k=1 → 1000, k=2 → 520, k=3 → 260, k=4 → 230, k=5 → 215. 1→2→3 දී ලොකු අඩුවීම්, 3→4 දී පොඩ්ඩයි. Elbow = k = 3. PCA: features 200, පළමු components 20 variance 95% පැහැදිලි කරනවා. ඉතින් components 20 තියාගෙන data 10 ගුණයකින් compress කරනවා, තොරතුරු 95% ක් තියාගෙන. (Components 20 අයින් කරලා 180 තියාගන්න එක හරි අනිත් පැත්ත.)',
      keyPoints: [
        'k-means: k කලින් තෝරනවා, local optimum, labels නෑ.',
        'Elbow = inertia curve එක පැතලි වෙන තැන. Inertia හැමවිටම k එක්ක අඩු වෙනවා.',
        'PCA: center කරලා, max variance orthogonal දිශා. Components = features ඔක්කොගෙම මිශ්‍රණ. Labels නෑ.',
        't-SNE / UMAP: local structure විශ්වාස කරන්න. Cluster අතර දුර සහ size නෑ.',
      ],
      terms: [
        { en: 'Inertia (WCSS)', si: 'Points තමන්ගේ centroid එකට තියෙන දුරවල වර්ග එකතුව.' },
        { en: 'Elbow Method', si: 'Inertia vs k plot එකේ වැඩිදියුණුව පැතලි වෙන තැනින් k තෝරන ක්‍රමය.' },
        { en: 'Silhouette Score', si: 'Point එකක් තමන්ගේ cluster එකට කොච්චර ගැළපෙනවද, අනිත් ඒවාට සාපේක්ෂව. -1 සිට 1.' },
        { en: 'Explained Variance Ratio', si: 'එක principal component එකකින් පැහැදිලි කරන මුළු variance කොටස.' },
        { en: 'Centering', si: 'හැම feature එකකින්ම ඒකේ mean එක අඩු කරන එක. PCA ට අත්‍යවශ්‍යයි.' },
        { en: 't-SNE / UMAP', si: 'Local neighborhoods ආරක්ෂා කරන non-linear 2D/3D visualization ක්‍රම.' },
      ],
    },
    {
      id: 'tree-ensembles-deep-dive',
      title: 'Tree Ensembles Deep Dive: Why Random Forests Work, OOB 36.8%, Boosting & Shrinkage',
      examRefs: ['FUN-038', 'FUN-039', 'FUN-085', 'FUN-086', 'FUN-129', 'FUN-130'],
      body: [
        'තනි ගැඹුරු decision tree එකක් = low bias, high variance. Training accuracy 100%, ඒත් training data පොඩ්ඩක් වෙනස් කළොත් tree එකම වෙනස් වෙනවා, validation අස්ථාවරයි. Random forest = bagging (bootstrap samples) + හැම split එකකදීම features වලින් අහඹු subset එකක් විතරක් බලනවා. ඒකෙන් trees එකිනෙකට වෙනස් (decorrelated) වෙනවා. ඒවායේ votes / average ගත්තම variance එක ගොඩක් අඩු වෙනවා. Bias එක තනි tree එකක තරමටම වගේ තියෙනවා. ඉතින් forest එක උදව් කරන්නේ bias අඩු කරලා නෙවෙයි, variance අඩු කරලා.',
        'Bootstrap sample = rows n ක් replacement එක්ක n පාරක් අහඹු ලෙස තෝරනවා. එක row එකක් කවදාවත් නොතේරෙන්න සම්භාවිතාව (1 − 1/n)ⁿ. n ලොකු වෙන්න වෙන්න ඒක e⁻¹ ≈ 0.368 ට ළං වෙනවා. ඉතින් හැම tree එකකටම rows 36.8% ක් වගේ නොපෙනී යනවා = out-of-bag (OOB) samples. ඒවායින් වෙනම validation set එකක් නැතුවම evaluate කරන්න පුළුවන්. 63.2% = bootstrap එකේ ඇත්තටම තියෙන unique rows.',
        'Gradient boosting (XGBoost, LightGBM, CatBoost) trees එකින් එක, අනුපිළිවෙළට එකතු කරනවා. හැම අලුත් පොඩි tree එකක්ම දැනට තියෙන ensemble එකේ වැරදි (loss එකේ negative gradient, MSE නම් residuals) fit කරනවා. Random forest = trees සමාන්තරව, ස්වාධීනව. Boosting = අනුපිළිවෙළට, කලින් එකේ වැරදි හදනවා. Shrinkage = learning rate (eta): හැම tree එකකම දායකත්වය eta වලින් ගුණ කරනවා. Eta 0.3 → 0.03 කළොත් එකම fit එකට trees ගොඩක් වැඩියෙන් ඕනේ (සාමාන්‍යයෙන් 10 ගුණයක් වගේ), validation early stopping එක්ක. ඒත් සාමාන්‍යයෙන් generalize වෙන්නේ හොඳට. Max depth 50 කරන එක overfitting වැඩි කරනවා.',
        'Structured tabular data (rows 500,000, numeric + categorical) වලට strongest first baseline එක gradient-boosted trees. Mixed features, missing values, non-linear interactions හොඳට handle කරනවා, tabular benchmarks නිතරම දිනනවා. XGBoost GPU එකේත් train කරන්න පුළුවන් (GPU topic එක බලන්න). k-means unsupervised නිසා labeled prediction task එකකට කෙලින්ම බෑ.',
      ],
      analogy: 'Random forest = පොල් ගෙඩියක බර අනුමාන කරන්න එක විශේෂඥයෙක් වෙනුවට ගමේ 100 දෙනෙක්ගෙන් අහලා සාමාන්‍යය ගන්නවා. හැම කෙනාම පොඩ්ඩක් වරදිනවා, ඒත් වැරදි වෙනස් වෙනස් පැතිවලට නිසා average එකේදී කැපිලා යනවා (variance ↓). ඒ අය එකම දේ දැකලා නම් (correlated) වැරදි කැපෙන්නේ නෑ, ඒකයි random features. Boosting = cricket coach කෙනෙක් හැම session එකකම කලින් session එකේ වැරදි (පිටට යන shots) විතරක් හදනවා. Shrinkage = එක session එකකින් සම්පූර්ණ වෙනසක් නෙවෙයි, පොඩි වෙනසක් විතරයි, ඒත් sessions වැඩියෙන්.',
      example: 'OOB: n = 3 නම් (2/3)³ = 8/27 ≈ 0.30. n = 1,000,000 නම් ≈ 0.368. Boosting: ගෙදරක ඇත්ත මිල ලක්ෂ 100. Tree 1 → 80. Residual = 20. Tree 2 residual එක 20 කියලා predict කරනවා, ඒත් eta = 0.1 නිසා එකතු කරන්නේ 2 විතරයි → 82. ඊළඟ residual 18 → +1.8 → 83.8. පොඩි පියවර, ගොඩක් trees. Eta 0.3 සමඟ trees 300කදී val loss හොඳම නම්, eta 0.03 සමඟ trees 3,000ක් වගේ ඕනේ වෙයි.',
      keyPoints: [
        'Random forest = bagging + random features → decorrelated trees → variance ↓ (bias එහෙමමයි).',
        'OOB ≈ 36.8% (e⁻¹). Unique rows in bootstrap ≈ 63.2%.',
        'Boosting = අනුපිළිවෙළට, gradients / residuals fit කරනවා.',
        'Eta ↓ → trees ↑ + early stopping. සාමාන්‍යයෙන් generalization ↑.',
        'Tabular data baseline = XGBoost / LightGBM.',
      ],
      terms: [
        { en: 'Bagging', si: 'Bootstrap samples වල models කීපයක් train කරලා average / vote ගන්න එක.' },
        { en: 'Bootstrap Sample', si: 'Replacement එක්ක n පාරක් අහඹු ලෙස rows තෝරලා හදන sample එක.' },
        { en: 'Out-of-Bag (OOB)', si: 'එක tree එකක bootstrap එකට නොවැටුණු rows (~36.8%). Free validation.' },
        { en: 'Shrinkage (eta)', si: 'Boosting වලදී හැම tree එකකම දායකත්වය අඩු කරන learning rate එක.' },
        { en: 'Residual', si: 'ඇත්ත අගය − දැනට තියෙන prediction එක.' },
        { en: 'Decorrelation', si: 'Models එකිනෙකට සමාන නොවී වෙනස් වැරදි කරන්න සැලැස්වීම.' },
      ],
    },
    {
      id: 'metrics-decisions-deep-dive',
      title: 'Metrics That Drive Decisions: Imbalance, Recall vs Precision, Threshold, ROC-AUC, PR, Calibration, Macro F1',
      examRefs: ['FUN-031', 'FUN-033', 'FUN-056', 'FUN-057', 'FUN-058', 'FUN-059', 'FUN-133', 'FUN-134'],
      body: [
        'Accuracy imbalanced data වලදී බොරු කියනවා. Transactions 99% legitimate නම් "හැමදේම legitimate" කියන model එකට 99% accuracy, ඒත් fraud එකක්වත් අල්ලන්නේ නෑ. ඒ model එක minority class එක නොසලකා හරිනවා (minority එකට overfit වෙනවා නෙවෙයි). විසඳුම් දෙකක් තියෙනවා. Metric එක: recall, precision, F1, PR-AUC බලන්න. Training එක: class weights (fraud වැරැද්දකට loss එකේ වැඩි බරක්), oversampling / SMOTE, majority undersampling. Hidden layers එකතු කිරීම ප්‍රශ්නය විසඳන්නේ නෑ, loss එක තාමත් majority class එකෙන් පාලනය වෙනවා.',
        'කොයි වැරැද්ද වඩා මිලද? Cancer screening, positive එකකට පස්සේ ලාභ confirm test එකක් තියෙනවා: ඇත්ත ලෙඩෙක් මඟ හැරීම (false negative) ගොඩක් භයානකයි → recall උපරිම කරන්න. Positive එකකින් මිල අධික හෝ හානිකර ක්‍රියාවක් වෙනවා නම් (උදා: account එක block කිරීම, ශල්‍යකර්මයක්) → false positives අඩු කරන්න, precision. Threshold එක 0.5 සිට 0.3 ට අඩු කළොත්: වැඩි දේවල් positive කියනවා → recall ↑, precision ↓. ROC-AUC වෙනස් වෙන්නේ නෑ, මොකද ඒක හැම threshold එකක්ම සාරාංශ කරනවා.',
        'ROC-AUC = 0.85 කියන්නේ: අහඹු positive එකක් සහ අහඹු negative එකක් ගත්තොත්, positive එකට වැඩි score එකක් දෙන්නේ 85% ක් වෙලාවට. ඒක ranking ගුණාත්මකභාවය. 0.5 = අහඹු, 1.0 = පරිපූර්ණ. "85% accuracy" හෝ "precision 0.85" නෙවෙයි. Positives ගොඩක් දුර්ලභ නම් (0.1%) ROC curve එක optimistic වෙන්න පුළුවන්: negatives මිලියනයක් නිසා false positives දහස් ගණනක් ආවත් FPR එක පොඩියි. Precision එක ඒ false positives ගංවතුර කෙලින්ම පෙන්නනවා. ඉතින් PR curve එක වඩා තොරතුරු දෙනවා.',
        'Calibration: AUC 0.95 (ranking හොඳයි), ඒත් model එක "0.9" කියන cases වලින් 60% ක් විතරයි ඇත්තටම positive. ඒ කියන්නේ overconfident. Retrain නොකර හදන්න held-out set එකක calibration mapping එකක් fit කරනවා: temperature scaling (logits T වලින් බෙදනවා), Platt scaling (scores මත logistic regression), isotonic regression. මේවා monotonic, ඉතින් ranking (AUC) වෙනස් වෙන්නේ නෑ. Threshold එක වෙනස් කිරීම තීරණ වෙනස් කරනවා, ඒත් "0.9 = 90%" කරන්නේ නෑ. Multi-class F1 averaging: macro = හැම class එකකම F1 ගණනය කරලා බර නැති සාමාන්‍යය (දුර්ලභ class එකකටත් ලොකු class එකක තරම්ම බරයි). Micro = TP, FP, FN ඔක්කොම එකතු කරලා එක F1 (ලොකු classes පාලනය කරනවා). Weighted = support අනුව බර. දුර්ලභ classes වල දුර්වලකම පෙන්නන්න macro-F1.',
      ],
      analogy: 'කොළඹ ගංවතුර alarm system එකක්. Recall = ඇත්ත ගංවතුර වලින් alarm එක ගැහුවේ කීයටද. Precision = alarm ගැහුව වාර වලින් ඇත්තටම ගංවතුර ආවේ කීයටද. මිනිස්සුන්ට ඉවත් වෙන්න ලාභයි, ගිලෙන එක භයානකයි → recall. Calibration = කාලගුණ වාර්තාව "වැස්ස 90%" කියන දවස් වලින් ඇත්තටම වැස්සේ 60% දවස් වල නම් ඒ වාර්තාව overconfident. ලොකු වැස්සද පොඩිද කියලා පිළිවෙළට කියනවා නම් (ranking හොඳ), ඒත් අංකය විශ්වාස කරන්න බෑ.',
      example: 'ROC-AUC අතින්: positives 4, negatives 5 → pairs 4 × 5 = 20. ඒ pairs 17 ක positive එකට වැඩි score එක තියෙනවා නම් AUC = 17 ÷ 20 = 0.85. PR vs ROC: transactions 1,000,000, fraud 1,000. Model එක fraud 900ක් අල්ලනවා (recall 0.9), ඒත් false positives 9,000. FPR = 9,000 ÷ 999,000 ≈ 0.009 (ROC එකේ ලස්සනයි). Precision = 900 ÷ 9,900 ≈ 0.09 (alarm 11න් 10ක්ම බොරු!). Class weights ("balanced"): rows 1,000, fraud 10 → fraud weight = 1,000 ÷ (2 × 10) = 50, legit weight = 1,000 ÷ (2 × 990) ≈ 0.505.',
      code: {
        lang: 'python',
        src: `from sklearn.metrics import roc_auc_score, average_precision_score, f1_score
from sklearn.calibration import CalibratedClassifierCV
from sklearn.linear_model import LogisticRegression

clf = LogisticRegression(class_weight="balanced", max_iter=1000).fit(X_tr, y_tr)
p = clf.predict_proba(X_val)[:, 1]
print("ROC-AUC", roc_auc_score(y_val, p), "PR-AUC", average_precision_score(y_val, p))
pred = (p >= 0.3).astype(int)          # threshold අඩු කළා: recall ↑, precision ↓
# Multi-class: f1_score(y, yhat, average="macro")  vs  average="micro"
cal = CalibratedClassifierCV(clf, method="isotonic", cv=5).fit(X_tr, y_tr)  # calibration`,
      },
      keyPoints: [
        'Imbalanced data → accuracy බලන්න එපා. Class weights / resampling + recall, F1, PR-AUC.',
        'FN මිලද (ලෙඩ මඟ හැරීම) → recall. FP මිලද → precision.',
        'Threshold ↓ → recall ↑, precision ↓. AUC වෙනස් වෙන්නේ නෑ.',
        'AUC = positive එකක් negative එකකට උඩින් rank වෙන සම්භාවිතාව.',
        'Overconfident probabilities → temperature / Platt / isotonic calibration. Rare classes → macro-F1.',
      ],
      terms: [
        { en: 'Class Weights', si: 'දුර්ලභ class එකේ වැරදි වලට loss එකේ වැඩි බරක් දෙන එක.' },
        { en: 'ROC-AUC', si: 'අහඹු positive එකක් අහඹු negative එකකට වඩා ඉහළින් rank වෙන සම්භාවිතාව.' },
        { en: 'PR Curve', si: 'Thresholds හරහා precision vs recall. දුර්ලභ positives වලට වඩා අවංකයි.' },
        { en: 'Calibration', si: 'Model එක කියන probability එක ඇත්ත සංඛ්‍යාතයට ගැළපීම ("0.9" = 90%).' },
        { en: 'Temperature Scaling', si: 'Logits එකම අංකයකින් (T) බෙදලා probabilities මෘදු / තියුණු කරන calibration ක්‍රමය.' },
        { en: 'Platt Scaling / Isotonic Regression', si: 'Scores, probabilities වලට map කරන post-hoc calibration ක්‍රම දෙකක්.' },
        { en: 'Macro vs Micro F1', si: 'Macro = class වලට සමාන බර. Micro = ඔක්කොම counts එකතු කරලා, ලොකු classes පාලනය කරනවා.' },
      ],
    },
    {
      id: 'exam-calculations-counting',
      title: 'Exam Calculations Made Easy (Part 1): Precision, Recall, F1, Macro vs Micro, Bayes, Shapes & Counts',
      examRefs: ['FUN-011', 'FUN-028', 'FUN-029', 'FUN-030', 'FUN-032', 'FUN-074', 'FUN-075', 'FUN-097', 'FUN-109', 'FUN-134', 'FUN-135', 'FUN-139'],
      body: [
        'බය වෙන්න එපා. Exam ගණන් ඔක්කොම වගේ "එකතු කිරීම, බෙදීම, ගුණ කිරීම" විතරයි. උපක්‍රමය: formula එක වචන වලින් මතක තියාගන්න. Precision = "මම positive කිව්ව ඒවායින් කීයක් හරිද?" = TP ÷ (TP + FP). Recall = "ඇත්ත positives වලින් කීයක් අල්ලගත්තද?" = TP ÷ (TP + FN). දෙකේම උඩ TP. වෙනස යට: precision ට FP (මගේ බොරු alarms), recall ට FN (මඟ හැරුණු ඒවා). TN දෙකටම ඕනේ නෑ. Exam trap: ප්‍රශ්නයේ TN දීලා ඔයාව පටලවනවා.',
        'F1 = 2 × P × R ÷ (P + R). මේ harmonic mean එක. Arithmetic mean එකට වඩා පොඩි අගය දිහාට ඇදෙනවා. ඉතින් එකක් විතරක් හොඳ කරලා ලොකු F1 එකක් ගන්න බෑ. P = 0.6, R = 0.9: උඩ 2 × 0.6 × 0.9 = 1.08. යට 0.6 + 0.9 = 1.5. F1 = 1.08 ÷ 1.5 = 0.72. (Trap: arithmetic mean 0.75.) Macro vs micro: classes 3ක් (A rows 90, B 5, C 5). Per-class F1: A = 0.95, B = 0.30, C = 0.40. Macro = (0.95 + 0.30 + 0.40) ÷ 3 = 0.55 (දුර්වලකම පේනවා). Weighted = 0.9 × 0.95 + 0.05 × 0.30 + 0.05 × 0.40 ≈ 0.89. Micro එක (single-label multi-class වලදී accuracy එකට සමානයි) A ගේ ලකුණු වලින් පාලනය වෙලා 0.9 වගේ ලොකු අගයක් පෙන්නනවා.',
        'Counting ගණන්: Steps per epoch = dataset size ÷ batch size. Effective batch = micro-batch × gradient accumulation steps × GPUs ගණන. Linear layer parameters = (inputs × outputs) + outputs (bias එකක් හැම output එකකටම). Matrix multiply (m, n) @ (n, p) = (m, p): ඇතුළේ අංක දෙක සමාන වෙන්න ඕනේ, ඒවා "කැපිලා" යනවා. Dot product = එකම තැන්වල අංක ගුණ කරලා එකතු කරනවා, ඍණ ලකුණු අමතක කරන්න එපා. Training memory (FP32 + Adam, activations නැතුව) = parameter එකකට bytes 16: weight 4 + gradient 4 + Adam moments දෙක 8.',
        'Bayes ගණන (base rate trap): "Test එක positive නම් ලෙඩ තියෙන්න සම්භාවිතාව" = ඇත්ත positives ÷ මුළු positives. මිනිස්සු 10,000ක් හිතලා ගණන් කරන්න, ප්‍රතිශත වලට වඩා ලේසියි.',
      ],
      analogy: 'Precision vs recall = මාළු අල්ලන දැල. Precision = දැලට ආපු දේවල් වලින් මාළු කීයද (බෝතල්, පොලිතීන් නෙවෙයි). Recall = වැවේ තිබුණු මාළු වලින් දැලට ආවේ කීයද. ලොකු දැලක් දැම්මොත් මාළු ඔක්කොම වගේ එනවා (recall ↑), ඒත් කුණුත් එනවා (precision ↓). F1 = මේ දෙකම හොඳ නම් විතරයි ලකුණු. එක subject එකකට A, අනිත් එකට F නම් average එක "C" කියලා පෙන්නන්නේ නැතුව ඇත්ත තත්ත්වය කියනවා.',
      example: 'ගණන් 8ක් පියවරෙන් පියවර: (1) TP 40, FP 10, FN 20, TN 130 → precision = 40 ÷ 50 = 0.80 (TN 130 trap එකක්). (2) TP 45, FN 15, FP 5 → recall = 45 ÷ 60 = 0.75 (45 ÷ 50 = 0.90 precision). (3) Rows 10,000, batch 250 → steps 40. (4) nn.Linear(512, 256) → 512 × 256 = 131,072 + bias 256 = 131,328. (5) [1, 2, 3] · [4, −1, 2] = 4 − 2 + 6 = 8. (6) (32, 128) @ (128, 64) → (32, 64). (7) GPUs 2, micro-batch 8, accumulation 4 → 8 × 4 × 2 = 64. (8) Bayes: මිනිස්සු 10,000. ලෙඩ 1% = 100. ඒ අයගෙන් 90% positive = 90. නීරෝගී 9,900 න් 9% බොරු positive = 891. මුළු positives = 981. P(ලෙඩ | +) = 90 ÷ 981 ≈ 9%. 90% නෙවෙයි! Memory: parameters 1B × 16 bytes = 16 GB (weights විතරක් 4 GB, inference ට ඇති, Adam training ට නෑ).',
      keyPoints: [
        'Precision = TP ÷ (TP + FP). Recall = TP ÷ (TP + FN). TN ගණන් වලට එපා.',
        'F1 = 2PR ÷ (P + R), arithmetic mean එකට වඩා පොඩියි.',
        'Macro = classes වලට සමාන බර (rare දුර්වලකම පේනවා). Micro / weighted = ලොකු classes පාලනය.',
        'Steps = rows ÷ batch. Effective batch = micro × accumulation × GPUs. Linear params = in × out + out.',
        'Bayes: මිනිස්සු 10,000ක් හිතලා ගණන් කරන්න. FP32 + Adam = bytes 16 / param.',
      ],
      terms: [
        { en: 'Harmonic Mean', si: 'පොඩි අගය දිහාට ඇදෙන සාමාන්‍යය. F1 = P සහ R වල harmonic mean.' },
        { en: 'Gradient Accumulation', si: 'Micro-batches කීපයක gradients එකතු කරලා එක optimizer step එකක් ගන්න එක.' },
        { en: 'Effective Batch Size', si: 'එක optimizer step එකකට ඇත්තටම දායක වෙන examples ගණන.' },
        { en: 'Base Rate', si: 'ජනගහනයේ කොන්දේසිය තියෙන ප්‍රතිශතය (prevalence). Bayes වලට අත්‍යවශ්‍යයි.' },
        { en: 'Sensitivity / Specificity', si: 'Sensitivity = recall. Specificity = ඇත්ත negatives වලින් හරියට negative කිව්ව ප්‍රතිශතය.' },
        { en: 'Optimizer States', si: 'Adam වගේ optimizers parameter එකකට තියාගන්න අමතර අගයන් (m සහ v).' },
      ],
    },
    {
      id: 'exam-calculations-softmax-ce',
      title: 'Exam Calculations Made Easy (Part 2): Softmax, Stable Softmax, Cross-Entropy, ln(K), Entropy, KL, Label Smoothing',
      examRefs: ['FUN-071', 'FUN-072', 'FUN-073', 'FUN-076', 'FUN-077', 'FUN-116', 'FUN-118'],
      body: [
        'Softmax පියවර 3යි: (1) හැම logit එකකම e^logit ගන්නවා (ඔක්කොම positive වෙනවා). (2) ඒ ඔක්කොම එකතු කරනවා. (3) හැම එකක්ම එකතුවෙන් බෙදනවා. ප්‍රතිඵලය: ඔක්කොම positive, එකතුව 1. මතක තියාගන්න උපක්‍රම දෙකක්: e^(ln 3) = 3, e⁰ = 1. ඉතින් logits [0, ln 3] → [1, 3] → එකතුව 4 → [0.25, 0.75]. Logits දෙකක වෙනස ln 3 නම් probabilities අනුපාතය 3 : 1. Logits සමාන නම් විතරයි 0.5 : 0.5.',
        'Numerically stable softmax: logits [1000, 1001, 1002] නම් e^1000 FP32 එකේ overflow වෙලා inf, ඊට පස්සේ inf ÷ inf = NaN. උපක්‍රමය: හැම logit එකකින්ම උපරිම අගය (max) අඩු කරනවා → [−2, −1, 0]. Softmax එකට හැම logit එකටම එකම constant එකක් එකතු කළත් අඩු කළත් ප්‍රතිඵලය වෙනස් වෙන්නේ නෑ (උඩත් යටත් එකම ගුණකයකින් කැපෙනවා). Logits වලින් බෙදීම, [0, 1] ට clip කිරීම, absolute value ගැනීම ඒ වෙනස්කම් (gaps) වෙනස් කරනවා, ඉතින් වැරදි උත්තර.',
        'Cross-entropy (එක example එකකට) = −ln(හරි class එකට දුන්න probability). හරි class එකට 1 නම් loss 0. 0.25 නම් −ln(0.25) ≈ 1.386 (nats, natural log). log₂ ගත්තොත් 2 bits (trap option). Loss stuck at ln(K): classes K ට හැම එකටම 1/K දුන්නොත් loss = −ln(1/K) = ln(K). K = 10 → ln 10 ≈ 2.30. ඉතින් 10-class model එකක loss එක මුල ඉඳන්ම 2.30 ළඟ හිරවෙලා නම්, model එක uniform guess කරනවා, ඉගෙන ගන්නේ නෑ (learning rate, labels, gradient flow check කරන්න). Confidently wrong නම් loss 2.30 ට වඩා ගොඩක් ඉහළ. මතක තියාගන්න: ln 2 ≈ 0.69, ln 10 ≈ 2.30, ln 100 ≈ 4.61.',
        'Entropy (bits) = −Σ p log₂ p. සාධාරණ කාසියක් = 1 bit (outcomes 2කට උපරිමය). හැමවිටම heads වැටෙන කාසියක් = 0. KL(P‖Q) ගුණ තුනක්: (1) හැමවිටම ≥ 0 (Gibbs inequality), (2) 0 වෙන්නේ P සහ Q සමාන නම් විතරයි, (3) symmetric නෑ: KL(P‖Q) ≠ KL(Q‖P), triangle inequality එකත් නෑ. ඉතින් ඒක "distance metric" එකක් නෙවෙයි, divergence එකක්. Label smoothing: target = (1 − ε) × one_hot + ε ÷ K. ε = 0.1, K = 5: හැම class එකකටම ε ÷ K = 0.02. හරි class එකට තවත් 1 − ε = 0.90 → 0.92. අනිත් ඒවා 0.02. Check: 0.92 + 4 × 0.02 = 1. (ε එක K − 1 වැරදි classes අතර විතරක් බෙදන variant එකෙන් 0.90 / 0.025 එනවා, ඒත් දීපු formula එක ඒක නෙවෙයි.)',
      ],
      analogy: 'Softmax = තරඟයක ලකුණු (logits) "ජයග්‍රහණ සම්භාවිතා" වලට හරවනවා. e^ කියන එක ලකුණු වල වෙනස විශාල කරනවා. Stable softmax = ලොකු සල්ලි ගණන් කරනකොට "ලක්ෂ 1000, 1001, 1002" වෙනුවට "හොඳම එකට වඩා −2, −1, 0" කියලා ලියනවා. අනුපාත එකමයි, calculator එක පිපිරෙන්නේ නෑ. KL asymmetry = කොළඹ සිට මහනුවර බස් ගාස්තුව සහ මහනුවර සිට කොළඹ ගාස්තුව එකම වෙන්න ඕනේ නෑ වගේ, "P වලින් Q ට" සහ "Q වලින් P ට" වෙනස්.',
      example: 'Softmax [2, 1, 0]: e² ≈ 7.39, e¹ ≈ 2.72, e⁰ = 1. එකතුව ≈ 11.11. Probabilities ≈ [0.665, 0.245, 0.090]. Stable: [1000, 1001, 1002] − 1002 = [−2, −1, 0] → e: [0.135, 0.368, 1] → එකතුව 1.503 → [0.090, 0.245, 0.665]. Cross-entropy: p = 0.9 → 0.105, p = 0.5 → 0.693, p = 0.25 → 1.386, p = 0.01 → 4.61. KL: P = [0.5, 0.5], Q = [0.9, 0.1]. KL(P‖Q) = 0.5 × ln(0.5/0.9) + 0.5 × ln(0.5/0.1) ≈ −0.294 + 0.805 = 0.51. KL(Q‖P) = 0.9 × ln(0.9/0.5) + 0.1 × ln(0.1/0.5) ≈ 0.529 − 0.161 = 0.37. 0.51 ≠ 0.37, ඉතින් symmetric නෑ. Label smoothing ε = 0.1, K = 10 → හරි class 0.91, අනිත් ඒවා 0.01.',
      code: {
        lang: 'python',
        src: `import numpy as np

def stable_softmax(z):
    z = np.asarray(z, dtype=np.float32)
    e = np.exp(z - z.max())          # max එක අඩු කරනවා: overflow නෑ
    return e / e.sum()

print(stable_softmax([1000, 1001, 1002]))   # [0.090 0.245 0.665]
print(stable_softmax([0, np.log(3)]))       # [0.25 0.75]
print(-np.log(0.25), np.log(10))            # 1.386 (CE), 2.303 (ln K, K=10)
eps, K = 0.1, 5
target = (1 - eps) * np.eye(K)[0] + eps / K  # label smoothing
print(target)                                # [0.92 0.02 0.02 0.02 0.02]`,
      },
      keyPoints: [
        'Softmax: e^ → එකතුව → බෙදන්න. e^(ln 3) = 3.',
        'Stable softmax = max එක අඩු කරන්න. ප්‍රතිඵලය වෙනස් වෙන්නේ නෑ.',
        'CE = −ln(p හරි). Loss ≈ ln(K) = uniform guess = ඉගෙන ගන්නේ නෑ.',
        'Fair coin = 1 bit. KL ≥ 0, P = Q නම් විතරක් 0, symmetric නෑ.',
        'Label smoothing: හරි = 1 − ε + ε/K, අනිත් = ε/K.',
      ],
      terms: [
        { en: 'Logits', si: 'Softmax එකට කලින් තියෙන raw scores. ඕනෑම real number එකක්.' },
        { en: 'Overflow / Underflow', si: 'අංකය float format එකට ලොකු වැඩි (inf) හෝ පොඩි වැඩි (0) වීම.' },
        { en: 'Nats vs Bits', si: 'Natural log (ln) එකෙන් = nats. log₂ එකෙන් = bits.' },
        { en: 'Shannon Entropy', si: 'Distribution එකක සාමාන්‍ය අවිනිශ්චිතතාව. −Σ p log p.' },
        { en: 'KL Divergence', si: 'P වෙනුවට Q පාවිච්චි කරාම නැති වෙන තොරතුරු. ≥ 0, asymmetric.' },
        { en: 'Label Smoothing', si: 'One-hot target එක මෘදු කරලා overconfidence අඩු කරන regularization ක්‍රමය.' },
      ],
    },
    {
      id: 'exam-calculations-training-tricks',
      title: 'Exam Calculations Made Easy (Part 3): Gradient Clipping, Warmup, Inverted Dropout, Adam Bias Correction',
      examRefs: ['FUN-113', 'FUN-121', 'FUN-123', 'FUN-147'],
      body: [
        'Gradient clipping (global norm): පියවර 3යි. (1) Norm එක ගණනය කරනවා = √(හැම component එකකම වර්ග එකතුව). (2) Norm එක max_norm ට වඩා පොඩි නම් කිසිම වෙනසක් නෑ. (3) ලොකු නම් හැම component එකක්ම (max_norm ÷ norm) වලින් ගුණ කරනවා. දිශාව එහෙමමයි, දිග විතරක් කපනවා. Per-value clipping (හැම element එකක්ම 1 ට clamp කිරීම) වෙනස්: ඒක දිශාව වෙනස් කරනවා.',
        'Linear warmup: lr = peak × (step ÷ warmup_steps). Step 0 දී 0, warmup අන්තිමට peak. ඊට පස්සේ සාමාන්‍යයෙන් cosine හෝ linear decay. Warmup ඕනේ ඇයි? මුලදී weights අහඹුයි, Adam ගේ statistics තාම හරියට හැදිලා නෑ. එවෙලේ ලොකු පියවර ගත්තොත් training එක අස්ථාවර වෙනවා.',
        'Inverted dropout (PyTorch කරන්නේ මේක): drop probability p. Training වලදී ඉතුරු වෙන activations 1 ÷ (1 − p) වලින් ගුණ කරනවා. එතකොට සාමාන්‍ය (expected) activation එක වෙනස් වෙන්නේ නෑ, ඉතින් inference වලදී කිසිම rescaling එකක් ඕනේ නෑ. p = 0.2 → 1 ÷ 0.8 = 1.25. p = 0.5 → 2. (Training වලදී වෙනසක් නැතුව inference වලදී 0.8 න් ගුණ කරන එක පරණ, non-inverted ක්‍රමය.)',
        'Adam bias correction: Adam ගේ moving averages m (gradient average) සහ v (squared gradient average) 0 න් පටන් ගන්නවා. β₁ = 0.9 නම් පළමු step එකේ m₁ = 0.9 × 0 + 0.1 × g₁ = 0.1 g₁. ඒක ඇත්ත gradient එකට වඩා 10 ගුණයක් පොඩියි, 0 දිහාට bias වෙලා. Correction: m̂ = m ÷ (1 − β₁ᵗ). t = 1: 0.1 g₁ ÷ (1 − 0.9) = 0.1 g₁ ÷ 0.1 = g₁. හරියටම. t ලොකු වෙන්න β₁ᵗ → 0, ඉතින් correction එකේ බලපෑම නැති වෙනවා. Adam මේ correction එක ඇත්තටම කරන නිසා "මුල් පොඩි steps = warmup" කියලා විශ්වාස කරන්න බෑ. ඒකයි explicit warmup තාමත් පාවිච්චි කරන්නේ.',
      ],
      analogy: 'Gradient clipping = tuk-tuk එකකට speed limit එකක්. ඔයා යන දිශාව (Kandy road) එහෙමමයි, වේගය 80 ට වඩා නම් 80 ට අඩු කරනවා. Warmup = උදේ cricket match එකකට කලින් warm-up: මුලින්ම හෙමින් දුවනවා, ඊට පස්සේ full speed. Inverted dropout = team එකේ 20% ක් අද practice වලට නෑ, ඉතින් ඉන්න අය 1.25 ගුණයක් වැඩ කරනවා, මුළු වැඩ ප්‍රමාණය එකමයි. Adam bias correction = අලුත් කඩේක පළමු දවසේ විකුණුම් "මාසික සාමාන්‍යය" විදිහට ගත්තොත් (දවස් 29ක් 0 කියලා) බොරු ලෙස පොඩියි. ඒ නිසා ගත වුණ දවස් ගණනට සකස් කරනවා.',
      example: 'Clipping: gradient [6, 8], max_norm 1.0. Norm = √(36 + 64) = √100 = 10. 10 > 1 → ගුණකය 1 ÷ 10 = 0.1 → [0.6, 0.8]. (Trap [1.0, 1.0] = per-value clipping.) Gradient [3, 4], max_norm 10 → norm 5 < 10 → වෙනසක් නෑ. Warmup: peak 3 × 10⁻⁴, warmup steps 1,000, step 250 → 3 × 10⁻⁴ × 250 ÷ 1,000 = 3 × 10⁻⁴ × 0.25 = 7.5 × 10⁻⁵. Adam step 2 (g₁ = g₂ = g): m₂ = 0.9 × 0.1g + 0.1g = 0.19g. 1 − 0.9² = 0.19. m̂₂ = 0.19g ÷ 0.19 = g. v එකටත් එහෙමමයි (β₂ = 0.999 → v₁ = 0.001 g², ÷ 0.001 = g²).',
      code: {
        lang: 'python',
        src: `import torch

g = torch.tensor([6.0, 8.0])
norm = g.norm()                                  # 10
clipped = g * min(1.0, 1.0 / norm.item())        # [0.6, 0.8]
print(clipped)
# ඇත්ත training එකේදී: torch.nn.utils.clip_grad_norm_(model.parameters(), max_norm=1.0)

peak, warm = 3e-4, 1000
print(peak * 250 / warm)                         # 7.5e-05 (warmup)

drop = torch.nn.Dropout(p=0.2).train()
print(drop(torch.ones(8)))                       # ඉතුරු ඒවා 1.25, අනිත් ඒවා 0
m1 = 0.1 * 5.0; print(m1 / (1 - 0.9 ** 1))       # g=5 → bias correction → 5.0`,
      },
      keyPoints: [
        'Clipping: norm = √Σg². Norm > max නම් × (max ÷ norm). දිශාව එහෙමමයි.',
        'Warmup: lr = peak × step ÷ warmup_steps.',
        'Inverted dropout: ඉතුරු ඒවා × 1 ÷ (1 − p). Inference වලදී කිසිම scaling එකක් නෑ.',
        'Adam: m̂ = m ÷ (1 − βᵗ). Zero init නිසා ඇති වෙන 0-bias එක අයින් කරනවා.',
      ],
      terms: [
        { en: 'Global Norm Clipping', si: 'මුළු gradient vector එකේම දිග සීමා කරන එක. දිශාව ආරක්ෂා වෙනවා.' },
        { en: 'L2 Norm', si: 'Vector එකක දිග: හැම component එකකම වර්ග එකතුවේ වර්ගමූලය.' },
        { en: 'Linear Warmup', si: 'Learning rate එක 0 සිට peak දක්වා රේඛීයව වැඩි කරන training ආරම්භය.' },
        { en: 'Inverted Dropout', si: 'Training වලදී ඉතුරු activations 1/(1−p) න් scale කරන dropout ක්‍රමය.' },
        { en: 'Bias Correction', si: 'Adam ගේ zero-init moving averages, (1 − βᵗ) වලින් බෙදලා නිවැරදි කරන එක.' },
        { en: 'β₁, β₂', si: 'Adam ගේ gradient සහ squared-gradient averages වල decay rates (සාමාන්‍යයෙන් 0.9, 0.999).' },
      ],
    },
    {
      id: 'loss-functions-deep-dive',
      title: 'Choosing the Right Loss: MSE vs CE, Multi-Label, Huber, Focal Loss, Log-Probs, Likelihood View, KL Directions',
      examRefs: ['FUN-014', 'FUN-015', 'FUN-078', 'FUN-111', 'FUN-112', 'FUN-117', 'FUN-119', 'FUN-124', 'FUN-125', 'FUN-126'],
      body: [
        'Loss එක තෝරන්න output එක දිහා බලන්න. Regression (ගෙදර මිල) → MSE. Mutually exclusive classes 12ක් (ticket එකට category එකයි) → softmax + categorical cross-entropy. Class index එකට (0-11) MSE දාන්න එපා: ඒකෙන් කියවෙන්නේ category 11, category 1 ට වඩා 12 ට "ළඟයි" කියලා. Multi-label (article එකකට "politics" සහ "economy" දෙකම) → හැම tag එකකටම වෙනම sigmoid + binary cross-entropy. Softmax දැම්මොත් probabilities එකතුව 1 වෙන්න බල කරනවා, tags එකිනෙකා එක්ක තරඟ කරනවා.',
        'Outliers තියෙන regression (sensor glitches) → MAE හෝ Huber loss. MSE වැරැද්ද වර්ග කරන නිසා එක ලොකු outlier එකක් gradient එකම පාලනය කරනවා. MAE රේඛීයව වැඩි වෙනවා. Huber = පොඩි වැරදි වලට වර්ග (MSE වගේ smooth), ලොකු වැරදි වලට රේඛීය (MAE වගේ robust). RMSE තාමත් squared error මත පදනම් නිසා sensitive. Focal loss: object detector එකක easy background examples ගොඩාක්. Focal loss = cross-entropy × (1 − p_t)^γ. p_t = හරි class එකට දුන්න probability එක. Model එක දැනටමත් හොඳට හරි නම් (p_t ළඟ 1) ගුණකය 0 ට ළං වෙනවා, ඉතින් training අවධානය අමාරු examples වලට යනවා. Negatives ඔක්කොම අයින් කළොත් background එක කොහොමද කියලා ඉගෙන ගන්න බෑ.',
        'Log-probabilities පාවිච්චි කරන්නේ ඇයි? 1 ට අඩු probabilities සිය ගණනක් ගුණ කළොත් float එකේ 0 වෙලා යනවා (underflow). Log එකෙන් ගුණ කිරීම එකතු කිරීමක් වෙනවා, අංකය නිරූපණය කරන්න පුළුවන් පරාසයේ තියෙනවා. Log-probs ≤ 0 (positive නෙවෙයි). Double softmax bug: PyTorch CrossEntropyLoss එක ඇතුළේම log-softmax කරනවා. ඉතින් ඒකට දෙන්න ඕනේ raw logits. Softmax කරපු probs දුන්නොත් softmax දෙපාරක් වෙලා loss surface එක පැතලි වෙනවා, gradients දුර්වලයි, training slow, calibration නරකයි. y එකට integer class indices දෙන්න පුළුවන් (one-hot ඕනේ නෑ).',
        'Likelihood ඇහැකින්: MSE අවම කිරීම = constant variance තියෙන Gaussian noise උපකල්පනය යටතේ maximum likelihood. Laplace noise → MAE. Bernoulli targets → binary cross-entropy. Cross-entropy සහ KL: H(p, q) = H(p) + KL(p‖q). H(p) (data entropy) model එක මත රඳා පවතින්නේ නෑ, ඉතින් cross-entropy අඩු කිරීම = KL අඩු කිරීම = model distribution එක data distribution එකට ගැළපීම. KL දිශා: bimodal P එකකට එක Gaussian Q එකක් fit කරනවා නම්, forward KL(P‖Q) අවම කිරීම mode-covering (Q මුදුන් දෙකම වහන්න පැතිරෙනවා). Reverse KL(Q‖P) mode-seeking (එක මුදුනකට හිර වෙනවා). Exam එකේ මේ දෙක මාරු කරලා දෙනවා, පරිස්සමින්.',
      ],
      analogy: 'Huber loss = පන්ති ගුරුවරයෙක් ලකුණු දානවා. පොඩි වැරදි වලට වැරැද්දේ වර්ගයට දඬුවම් (සියුම්ව හදනවා). ඒත් එක ළමයෙක් paper එකම හිස්ව දුන්නොත් (outlier) මුළු පන්තියේම ඉගැන්වීම ඒ එක්කෙනා වටේට හරවන්නේ නෑ, රේඛීය දඬුවමක් විතරයි. Focal loss = A/L tuition පන්තියක, හැමෝටම දැනටමත් තේරෙන පාඩම් (easy) ට අඩු කාලයක්, අමාරු ප්‍රශ්න වලට වැඩි කාලයක්. Forward vs reverse KL = Q එක එක torch light එකක්. Forward = කාමර දෙකම පොඩ්ඩ පොඩ්ඩ එළිය වෙන්න පළල්ව එල්ලනවා. Reverse = එක කාමරයක් හොඳට එළිය කරනවා, අනික අඳුරේ.',
      example: 'Huber (δ = 1): වැරැද්ද 0.5 → 0.5 × 0.5² = 0.125 (MSE වගේ). වැරැද්ද 10 → 1 × (10 − 0.5) = 9.5. MSE නම් 10² = 100. Outlier එකේ බලපෑම 10 ගුණයකින් වගේ අඩුයි. Focal loss (γ = 2): p_t = 0.9 → (0.1)² = 0.01, CE 0.105 → focal 0.00105 (ගොඩක් අඩු කළා). p_t = 0.5 → (0.5)² = 0.25 → CE 0.693 → 0.173 (බර ටිකක් විතරක් අඩු කළා). Underflow: 0.1 ගුණ කිරීම් 400ක් = 10⁻⁴⁰⁰. FP32 එකට ඒක 0. Log එකෙන්: 400 × ln(0.1) ≈ −921. ලේසියෙන්ම තියාගන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import torch, torch.nn as nn

logits = torch.tensor([[2.0, 0.5, -1.0]])
y = torch.tensor([0])                        # integer class index, one-hot නෑ
good = nn.CrossEntropyLoss()(logits, y)      # හරි: raw logits
bad = nn.CrossEntropyLoss()(torch.softmax(logits, -1), y)  # BUG: double softmax
print(good.item(), bad.item())

multi = nn.BCEWithLogitsLoss()               # multi-label: tag එකකට sigmoid එකක්
print(multi(torch.tensor([[1.2, -0.3]]), torch.tensor([[1.0, 1.0]])))
print(nn.HuberLoss(delta=1.0)(torch.tensor([10.0]), torch.tensor([0.0])))  # 9.5`,
      },
      keyPoints: [
        'Regression → MSE. Exclusive classes → softmax + CE. Multi-label → sigmoid + BCE.',
        'Outliers → MAE / Huber. Easy examples ගොඩයි → focal loss (1 − p_t)^γ.',
        'Log-probs = underflow නැති කරනවා. CrossEntropyLoss එකට raw logits.',
        'MSE ↔ Gaussian, MAE ↔ Laplace, BCE ↔ Bernoulli. H(p,q) = H(p) + KL(p‖q).',
        'Forward KL(P‖Q) = mode-covering. Reverse KL(Q‖P) = mode-seeking.',
      ],
      terms: [
        { en: 'Huber Loss', si: 'පොඩි වැරදි වලට quadratic, ලොකු වැරදි වලට linear. Outliers වලට robust.' },
        { en: 'Focal Loss', si: 'Cross-entropy × (1 − p_t)^γ. පහසු examples වල බර අඩු කරනවා.' },
        { en: 'Multi-Label Classification', si: 'එක example එකකට labels කීපයක් එකවර තියෙන්න පුළුවන් task එක.' },
        { en: 'BCEWithLogitsLoss', si: 'Sigmoid + binary cross-entropy එකට, numerically stable විදිහට.' },
        { en: 'Maximum Likelihood', si: 'Data එක දකින්න සම්භාවිතාව උපරිම කරන parameters හොයන එක.' },
        { en: 'Mode-Covering / Mode-Seeking', si: 'Forward KL මුදුන් ඔක්කොම වහනවා. Reverse KL එක මුදුනකට හිර වෙනවා.' },
      ],
    },
    {
      id: 'nn-training-mechanics',
      title: 'Neural Network Mechanics: Epochs & Steps, Gradient Descent, Backprop, Activations, Initialization, Vanishing / Exploding Gradients, Universal Approximation',
      examRefs: ['FUN-010', 'FUN-012', 'FUN-013', 'FUN-023', 'FUN-024', 'FUN-025', 'FUN-026', 'FUN-027', 'FUN-064', 'FUN-065', 'FUN-100', 'FUN-122', 'FUN-149'],
      body: [
        'වචන තුනක්: Epoch = මුළු training set එකම එක පාරක් බලලා ඉවර වීම. Step / iteration = එක mini-batch එකකින් එක weight update එකක්. Epoch එකක steps ගොඩක් තියෙනවා. Mini-batch gradient descent = පොඩි subset එකක gradients සාමාන්‍යය අරන් update කරනවා. Full-batch (මුළු dataset එකම) ස්ථාවර ඒත් මිලයි. එක example එකකින් (pure SGD) ලාභ ඒත් noisy. Mini-batch මැද, සහ GPU එකට batch එකක් සමාන්තරව process කරන්න ගැළපෙනවා.',
        'Gradient descent: θ ← θ − η∇L. Gradient (∇L) එක loss එක වේගයෙන්ම වැඩි වෙන දිශාව පෙන්නනවා. ඉතින් අපි යන්නේ ඒකට විරුද්ධ පැත්තට. η = learning rate. ලොකු වැඩි නම් minimum එක පැනලා යනවා, loss එක පනිනවා, NaN වෙනවා. Epochs අඩු නම් loss ඉහළයි ඒත් ස්ථාවරයි, පනින්නේ නෑ. Backpropagation කරන්නේ chain rule එකෙන් හැම parameter එකකටම loss එකේ gradient එක ගණනය කරන එක විතරයි. Weights update කරන්නේ optimizer එක (SGD, Adam).',
        'Activations: non-linearity නැත්නම් linear layers ගොඩක් එකට ගැහුවත් ඒක එක linear transformation එකක්ම වෙනවා. Depth එකෙන් බලයක් නෑ. Sigmoid → (0, 1), binary probability. Tanh → (−1, 1). ReLU = max(0, x) → [0, ∞), උඩට සීමාවක් නෑ. Softmax → ඔක්කොම positive, එකතුව 1. Argmax → one-hot (එකක් 1, අනිත් ඒවා 0). Universal approximation theorem: එක hidden layer එකක් සහ සුදුසු non-linearity එකක් තියෙන network එකකට, hidden units ඇති තරම් තියෙනවා නම්, compact domain එකක ඕනෑම continuous function එකක් ඕනෑම නිරවද්‍යතාවයකින් approximate කරන්න පුළුවන්. ඒත් ඒක representational capacity ගැන විතරයි: units කීයක් ඕනෙද, gradient descent එක ඒ weights හොයයිද, generalize වෙයිද කියලා කිසිවක් කියන්නේ නෑ. ප්‍රායෝගිකව deep networks වඩා කාර්යක්ෂමයි.',
        'Initialization: weights ඔක්කොම 0 නම් එකම layer එකේ neurons එකම output, එකම gradient, එකම update. Symmetry එක කවදාවත් කැඩෙන්නේ නෑ, layer එක එක neuron එකක් වගේ. ඉතින් random init (Xavier / He) ඕනේ. ReLU networks වලට He (Kaiming) init: variance = 2 ÷ fan_in. ReLU inputs වලින් බාගයක් වගේ 0 කරන නිසා variance බාගයක් වෙනවා, 2 කින් ඒක වන්දි ගෙවනවා. Xavier tanh වගේ symmetric activations වලට හදපු එකක්. Vanishing gradients: sigmoid derivative එකේ උපරිමය 0.25. Layers 30ක් හරහා ගුණ කළාම early layers වලට gradient එකක්ම එන්නේ නෑ. විසඳුම: ReLU-family (positive inputs වලට derivative 1) + residual connections (gradients වලට කෙලින්ම පාරක්). Batch size වැඩි කිරීම මේ ගුණ කිරීමේ බලපෑම වෙනස් කරන්නේ නෑ. Exploding gradients (RNN වල gradient norms හදිසියේ ලොකු වෙලා NaN) → gradient clipping. Early stopping ඒකට උදව් කරන්නේ නෑ.',
      ],
      analogy: 'Vanishing gradient = "කටකතා game" එක. පන්තියේ 30 දෙනෙක් හරහා පණිවිඩයක් කනට කනට කියනකොට, හැම කෙනාම 25% ක් විතරක් ඇහෙන විදිහට කිව්වොත් අන්තිම කෙනාට කිසිවක් ඇහෙන්නේ නෑ. Residual connection = පණිවිඩය WhatsApp එකෙන් අන්තිම කෙනාටත් කෙලින්ම යවනවා. Zero init = cricket team එකේ 11 දෙනාටම එකම training, එකම position. කවදාවත් bowler, keeper, batsman කියලා වෙනස් වෙන්නේ නෑ.',
      example: 'Sigmoid derivative ≤ 0.25. Layers 10ක් → 0.25¹⁰ ≈ 0.00000095 (මිලියනයෙන් එකක් වගේ). ReLU (positive) → 1¹⁰ = 1. He init: fan_in = 512 → variance = 2 ÷ 512 ≈ 0.0039 → std ≈ 0.0625. Activation check: (x = −3) → ReLU 0, sigmoid ≈ 0.047, tanh ≈ −0.995. GD step: w = 2.0, gradient = 4, η = 0.1 → w = 2.0 − 0.1 × 4 = 1.6. η = 1.0 නම් → 2.0 − 4 = −2.0 (පැනලා අනිත් පැත්තට, overshoot).',
      keyPoints: [
        'Epoch = මුළු data එක එක පාරක්. Step = එක mini-batch update එකක්.',
        'θ ← θ − η∇L (gradient එකට විරුද්ධව). LR ලොකු → පනිනවා / NaN.',
        'Backprop = gradients ගණනය. Optimizer = update.',
        'Non-linearity නැත්නම් depth වැඩක් නෑ. Sigmoid (0,1), tanh (−1,1), ReLU [0,∞).',
        'Zero init = symmetry. ReLU → He init. Vanishing → ReLU + residuals. Exploding → clipping. UAT = capacity විතරයි.',
      ],
      terms: [
        { en: 'Iteration / Step', si: 'එක mini-batch එකකින් කරන එක weight update එකක්.' },
        { en: 'Chain Rule', si: 'Function chain එකක derivative එක, කොටස් වල derivatives ගුණ කරලා ගන්න නීතිය. Backprop ගේ පදනම.' },
        { en: 'Symmetry Breaking', si: 'Random init එකෙන් neurons වෙනස් features ඉගෙන ගන්න සැලැස්වීම.' },
        { en: 'He (Kaiming) Initialization', si: 'ReLU සඳහා variance 2/fan_in සහිත weight init එක.' },
        { en: 'Xavier (Glorot) Initialization', si: 'tanh වගේ symmetric activations සඳහා fan_in සහ fan_out සාමාන්‍යය මත init එක.' },
        { en: 'Residual Connection', si: 'Layer එකක input එක output එකට කෙලින්ම එකතු කරන shortcut එක. Gradients වලට කෙටි පාරක්.' },
        { en: 'Universal Approximation Theorem', si: 'Hidden units ඇති නම් එක hidden layer එකකට ඕනෑම continuous function එකක් approximate කරන්න පුළුවන් කියන theorem එක.' },
      ],
    },
    {
      id: 'optimizers-batch-size-deep-dive',
      title: 'Optimizers & Batch Size Deep Dive: Momentum, Adam, AdamW vs L2, Schedules, Large-Batch Generalization, Memory',
      examRefs: ['FUN-060', 'FUN-061', 'FUN-062', 'FUN-063', 'FUN-096', 'FUN-114', 'FUN-139', 'FUN-140'],
      body: [
        'Momentum: past gradients වල exponentially decaying සාමාන්‍යයක් (velocity) තියාගන්නවා. ලකුණ මාරු වෙන (oscillate වෙන) components එකිනෙකා කපාගෙන යනවා, එකම දිශාවට තියෙන ඒවා එකතු වෙලා වේගය වැඩි වෙනවා. Learning rate එකක් තාමත් ඕනේ. ඒක regularizer එකක් නෙවෙයි, optimization උදව්වක්. Adam = momentum (පළමු moment, m) + RMSProp-style scaling (දෙවන moment, v = squared gradients සාමාන්‍යය). හැම parameter එකකටම තමන්ගේම effective learning rate එකක්. v කියන්නේ Hessian එකේ ලාභ diagonal approximation එකක් වගේ, full Hessian (second derivatives) ගණනය කරන්නේ නෑ.',
        'AdamW: Adam එකට L2 penalty එක loss එකට එකතු කළොත්, ඒ penalty එකේ gradient එකත් Adam ගේ √v එකෙන් බෙදෙනවා. ඉතින් ලොකු gradient ඉතිහාසයක් තියෙන weights අඩුවෙන් decay වෙනවා, regularization අසමානයි. AdamW weight decay එක adaptive update එකෙන් වෙන් කරලා (decoupled) කෙලින්ම weights වලට යොදනවා: θ ← θ − ηλθ. Plain SGD වලදී L2 සහ weight decay එකයි (λ scale එකක් දක්වා). Adaptive optimizers වලදී ඒ සමානකම කැඩෙනවා. AdamW = වෙනස් update rule එකක්, defaults වෙනස් කරපු එකක් නෙවෙයි. Transformers වල default එක.',
        'Schedules: ලොකු networks scratch එකෙන් train කරනකොට සම්මත ක්‍රමය = කෙටි linear warmup එකක් + cosine හෝ linear decay. Warmup = මුල් අස්ථාවර ලොකු updates වළක්වනවා. Decay = අන්තිමට minimum එකට පදිංචි වෙන්න. Constant high LR = අන්තිම දක්වා minimum එක වටේ පනිනවා.',
        'Batch size 64 → 1,024 (16×), epochs එකමයි: epoch එකකට steps 16 ගුණයක් අඩුයි, gradients noise අඩුයි, activations වලට memory වැඩියි (අඩු නෙවෙයි). ඉතින් learning rate එක වැඩි කරන්න ඕනේ වෙනවා (warmup එක්ක). Large-batch generalization gap: noise අඩු සහ updates අඩු නිසා sharp minima වලට යන්න නැඹුරුයි, ඒවා generalize වෙන්නේ නරකට. Small-batch noise එක implicit regularizer එකක්. LR scaling + warmup, LAMB වගේ layer-wise adaptive optimizers මේ පරතරය අඩු කරනවා. Memory: FP32 + Adam = parameter එකකට bytes 16 (weight 4, gradient 4, m 4, v 4). Activations මේකට අමතරයි.',
      ],
      analogy: 'Momentum = බෑවුමක් පහළට පෙරළෙන බෝලයක්. පොඩි ගල් (noise) වලින් දිශාව වෙනස් වෙන්නේ නෑ, ගම්‍යතාවයෙන් දිගටම යනවා. Adam = හැම පාරකටම වෙනම speed limit: කොළඹ ඇතුළේ හෙමින්, highway එකේ වේගයෙන්. Sharp vs flat minimum = ගලක් උඩ තියෙන තියුණු වළක් vs පිට්ටනියක තියෙන පළල් වළක්. Test data කියන්නේ පොඩ්ඩක් පැත්තකට විස්ථාපනය වුණ ලෝකයක්. පළල් වළේ නම් පොඩ්ඩක් පැත්තට ගියත් තාම පහළ. තියුණු වළේ නම් එළියට වැටෙනවා.',
      example: 'Batch 64, rows 64,000 → steps 1,000 / epoch. Batch 1,024 → steps 62.5 (≈ 63). Linear scaling rule එකට අනුව LR 0.1 → 1.6 (16×), warmup එක්ක. Memory: 7B model, FP32 + Adam → 7 × 16 = 112 GB (activations නැතුව). AdamW: λ = 0.01, η = 0.001 → හැම step එකකම weights × (1 − 0.00001) shrink වෙනවා, gradient history එක මොකක් වුණත්.',
      keyPoints: [
        'Momentum = oscillations අඩු, consistent දිශාවට වේගය. LR තාම ඕනේ.',
        'Adam = m (momentum) + v (per-parameter scaling). Hessian නෑ.',
        'AdamW = decoupled weight decay. Adam + L2 ≠ weight decay.',
        'Warmup + cosine decay = සම්මත schedule එක.',
        'Batch ↑ → steps ↓, LR ↑ ඕනේ, memory ↑, sharp minima අවදානම. FP32 Adam = bytes 16 / param.',
      ],
      terms: [
        { en: 'Momentum', si: 'Past gradients වල decaying average එකක් (velocity) පාවිච්චි කරන optimization උපක්‍රමය.' },
        { en: 'Adam', si: 'Gradient සහ squared gradient running averages වලින් per-parameter step sizes හදන optimizer එක.' },
        { en: 'AdamW', si: 'Weight decay එක adaptive update එකෙන් වෙන් කරපු Adam. Transformers වල default.' },
        { en: 'Cosine Decay', si: 'Learning rate එක cosine curve එකක් විදිහට ක්‍රමයෙන් අඩු කරන schedule එක.' },
        { en: 'Sharp vs Flat Minima', si: 'තියුණු වළ (නරක generalization) vs පළල් වළ (හොඳ generalization).' },
        { en: 'LAMB', si: 'Large-batch training සඳහා layer-wise adaptive learning rates දෙන optimizer එක.' },
        { en: 'Linear Scaling Rule', si: 'Batch size එක k ගුණයක් කළාම LR එකත් k ගුණයක් කරන rule of thumb එක (warmup එක්ක).' },
      ],
    },
    {
      id: 'normalization-and-pytorch-modes',
      title: 'BatchNorm vs LayerNorm, and PyTorch Gotchas: zero_grad, eval(), no_grad()',
      examRefs: ['FUN-066', 'FUN-067', 'FUN-068', 'FUN-069', 'FUN-120'],
      body: [
        'BatchNorm (training වලදී): layer එකක activations, දැනට තියෙන mini-batch එකේ mean සහ variance වලින් normalize කරලා, ඊට පස්සේ ඉගෙන ගන්න scale (γ) සහ shift (β) එකක් යොදනවා. Training එක ස්ථාවර සහ වේගවත් කරනවා. Inference වලදී batch statistics නෙවෙයි, training වලදී එකතු කරපු running averages පාවිච්චි කරනවා. Raw inputs එක පාරක් normalize කරන එක (preprocessing) BatchNorm නෙවෙයි.',
        'LayerNorm: statistics ගණනය කරන්නේ එක example එකක් ඇතුළේ, features හරහා. ඉතින් batch size එක මත හෝ batch එකේ අනිත් examples මත රඳා පවතින්නේ නෑ. Batch size 1 හෝ 2 නම් BatchNorm statistics noisy වෙනවා. Variable-length sequences එක්ක BatchNorm අමාරුයි. Train සහ inference හැසිරීමත් වෙනස්. ඒකයි Transformers සහ sequence models LayerNorm පාවිච්චි කරන්නේ. LayerNorm එකටත් ඉගෙන ගන්න scale සහ shift තියෙනවා ("parameters නෑ" කියන option එක වැරදියි). Batch dimension එක හරහා normalize කරන්නේ BatchNorm.',
        'PyTorch gotchas තුනක්: (1) optimizer.zero_grad() අමතක කළොත්: PyTorch default විදිහට gradients .grad එකේ එකතු (accumulate) කරනවා. හැම step එකකම අලුත් gradient එක පරණ ඒවාට එකතු වෙලා updates ලොකු වෙවී ගිහින් training අස්ථාවර වෙනවා. (2) model.eval() අමතක කළොත්: dropout තාම ක්‍රියාත්මකයි, BatchNorm batch statistics පාවිච්චි කරනවා → එකම input එකට වෙනස් predictions. model.train() තමයි default mode එක. Seed එකක් දැම්මොත් ලක්ෂණය හැංගෙනවා විතරයි. (3) torch.no_grad(): autograd එක operations record කරන්නේ නෑ, ඉතින් backprop සඳහා activations තියාගන්නේ නෑ → memory සහ compute ඉතිරියි. ඒත් ඒක dropout / BatchNorm mode එක වෙනස් කරන්නේ නෑ, ඒක eval() ගේ වැඩේ. FP16 බවටත් හරවන්නේ නෑ.',
      ],
      analogy: 'BatchNorm = පන්තියේ ලකුණු, ඒ දවසේ ආපු ළමයින්ගේ සාමාන්‍යයට සාපේක්ෂව මනිනවා. ළමයි 2යි ආවේ නම් ඒ "සාමාන්‍යය" විශ්වාස කරන්න බෑ. LayerNorm = එක ළමයෙක්ගේ විෂයන් ඔක්කොම අතර සාපේක්ෂව බලනවා, කවුරු ආවත් නැතත් වැඩේ එකයි. zero_grad = calculator එකේ "C" බොත්තම. ඔබන්නේ නැත්නම් හැම අලුත් ගණනක්ම පරණ උත්තරයට එකතු වෙනවා. model.eval() = match දවසේ practice drills නවත්තනවා.',
      example: 'Bug එකේ ප්‍රතිඵලය: step 1 gradient = 2, step 2 = 2, step 3 = 2. zero_grad නැත්නම් .grad = 2, 4, 6 ... updates දිගටම ලොකු වෙනවා. BatchNorm batch = 2: activations [1, 3] → mean 2, variance 1 → normalized [−1, 1]. ඊළඟ batch [10, 10.2] → [−1, 1] ම වගේ. ඇත්ත අගයන් ගොඩක් වෙනස් වුණත් statistics noisy නිසා තොරතුරු නැති වෙනවා. LayerNorm එකට batch එක ගැන ගාණක් නෑ.',
      code: {
        lang: 'python',
        src: `model.train()
for x, y in loader:
    optimizer.zero_grad()            # 1. පරණ gradients මකන්න
    loss = criterion(model(x), y)    # 2. forward (raw logits)
    loss.backward()                  # 3. gradients ගණනය (backprop)
    optimizer.step()                 # 4. weights update

model.eval()                         # dropout off, BatchNorm running stats
with torch.no_grad():                # gradient tracking නෑ: memory ඉතිරියි
    preds = model(x_test).argmax(dim=-1)`,
      },
      keyPoints: [
        'BatchNorm = batch එක හරහා, inference වලදී running stats. LayerNorm = එක example එක ඇතුළේ.',
        'පොඩි batches / sequences → LayerNorm. දෙකටම learnable γ, β තියෙනවා.',
        'zero_grad() නැත්නම් gradients එකතු වෙවී යනවා.',
        'eval() = dropout / BatchNorm mode. no_grad() = autograd off (memory). දෙකම inference ට.',
      ],
      terms: [
        { en: 'Running Statistics', si: 'Training අතරතුර BatchNorm එකතු කරන mean / variance averages. Inference වලදී පාවිච්චි කරනවා.' },
        { en: 'γ (scale), β (shift)', si: 'Normalization එකෙන් පස්සේ යොදන, ඉගෙන ගන්නා scale සහ shift parameters.' },
        { en: 'Gradient Accumulation (PyTorch default)', si: '.backward() අලුත් gradients .grad එකට එකතු කරනවා. zero_grad() ඕනේ ඒ නිසා.' },
        { en: 'model.eval()', si: 'Dropout නවත්තලා BatchNorm running stats වලට මාරු කරන mode එක.' },
        { en: 'torch.no_grad()', si: 'Autograd recording නවත්තන context එක. Inference වේගවත්, memory අඩුයි.' },
      ],
    },
    {
      id: 'gans-vaes-flows',
      title: 'Generative Models Deep Dive (1): Generative vs Discriminative, Naive Bayes, GANs, VAEs, Normalizing Flows',
      examRefs: ['FUN-042', 'FUN-043', 'FUN-044', 'FUN-104', 'FUN-105', 'FUN-108', 'FUN-141', 'FUN-142', 'FUN-145'],
      body: [
        'Generative model = data distribution එක P(x) හෝ P(x, y) ඉගෙන ගන්නවා. ඒ නිසා අලුත් samples හදන්න (sample කරන්න) පුළුවන්. Discriminative model = P(y | x) කෙලින්ම ඉගෙන ගන්නවා, decision boundary එක විතරයි. අලුත් data හදන්න බෑ. Classifier එකක් generative ද? Naive Bayes = P(x | y) සහ P(y) model කරලා Bayes rule එකෙන් classify කරනවා → generative. Logistic regression (P(y | x) කෙලින්ම), linear SVM, decision tree → discriminative. Images / text කියන data වර්ගය මේ වෙනස තීරණය කරන්නේ නෑ.',
        'GAN = networks දෙකක්: generator (noise වලින් fake samples හදනවා) සහ discriminator (real ද fake ද කියලා අඳුනගන්නවා). දෙන්නා එකිනෙකාට විරුද්ධව train වෙනවා. Failure 1, mode collapse: generator එක discriminator රවට්ටන outputs කීපයක් හොයාගෙන ඒවා විතරක් හදනවා (digits ඔක්කොම "1"). Failure 2, vanishing generator gradients: discriminator එක මුලදීම පරිපූර්ණ වුණාම, original minimax loss එකේ log(1 − D(G(z))) saturate වෙලා generator එකට gradient එකක් නෑ. විසඳුම: non-saturating loss (log D(G(z)) උපරිම කරනවා) හෝ Wasserstein loss + gradient penalty (WGAN-GP). Discriminator තවත් ශක්තිමත් කිරීම ප්‍රශ්නය නරක් කරනවා.',
        'VAE = encoder එකක් සහ decoder එකක්. Encoder එක input එක latent space එකේ distribution එකකට (mean μ සහ variance σ²) හරවනවා. එතනින් sample කරලා decoder එක reconstruct කරනවා. අලුත් data = prior එකෙන් (සාමාන්‍යයෙන් standard Gaussian) sample කරලා decode කරනවා. Loss = reconstruction loss + KL(encoder distribution ‖ prior). KL කොටස latent space එක prior එකට ළඟින් තියාගන්නවා, එතකොට prior එකෙන් sample කළාම තේරුමක් තියෙන output එකක් එනවා. Posterior collapse = decoder එක latent code එක නොසලකා හරින VAE failure එක. Reparameterization trick: z ~ N(μ, σ²) කෙලින්ම sample කිරීම μ, σ වලට differentiable නෑ. ඉතින් z = μ + σ × ε, ε ~ N(0, I). Randomness එක ε එකට ගෙනියනවා, μ සහ σ හරහා encoder එකට gradients ගලනවා. Sample එක තාම random. KL term එක තාම තියෙනවා.',
        'Normalizing flows: සරල base distribution එකක් (Gaussian) invertible layers පෙළක් හරහා සංකීර්ණ distribution එකකට හරවනවා. හැම layer එකක්ම invertible සහ Jacobian determinant එක ලේසියෙන් ගණනය කරන්න පුළුවන් නිසා, change-of-variables formula එකෙන් exact log-likelihood එක ගන්න පුළුවන්. GANs ට likelihood එකක්ම නෑ. VAEs optimize කරන්නේ lower bound එකක් (ELBO) විතරයි.',
      ],
      analogy: 'GAN = බොරු නෝට්ටු හදන්නෙක් (generator) සහ බැංකු පරීක්ෂකයෙක් (discriminator). පරීක්ෂකයා මුල ඉඳන්ම ගොඩක් දක්ෂ නම් "මේක බොරු" කියනවා විතරයි, "මොකක්ද වැරදි" කියලා ඉඟියක් නෑ (vanishing gradient). Mode collapse = බොරුකාරයා රු. 1000 නෝට්ටුව විතරක් හරියට හදන්න ඉගෙන ගෙන ඒක විතරක් හදනවා. VAE reparameterization = "අහඹු ලෙස කඩෙන් කෑම ගන්න" කියනවා වෙනුවට "ඔයාගේ කැමැත්ත (μ) + දාදු කැටයකින් එන වෙනස (ε) × ඔයාගේ නම්‍යශීලීබව (σ)" කියනවා. දාදු කැටය ඔයාගෙන් පිට, ඉතින් ඔයාගේ කැමැත්ත වෙනස් කරන්න feedback ගන්න පුළුවන්.',
      example: 'Reparameterization: encoder එක μ = 2.0, σ = 0.5 දෙනවා. ε = 1.2 sample වුණා → z = 2.0 + 0.5 × 1.2 = 2.6. ε = −0.4 → z = 1.8. Gradient එක: dz/dμ = 1, dz/dσ = ε. ඉතින් encoder එකට ඉගෙන ගන්න පුළුවන්. Naive Bayes (spam): P(spam) = 0.3, P("free" | spam) = 0.6, P("free" | ham) = 0.05. "free" තියෙන email එකක් → spam ලකුණ = 0.3 × 0.6 = 0.18, ham ලකුණ = 0.7 × 0.05 = 0.035 → spam. මේ class එකකට data "හදන" විදිහ (P(x | y)) model කරලා.',
      keyPoints: [
        'Generative = P(x) / P(x, y), sample කරන්න පුළුවන්. Discriminative = P(y | x). Naive Bayes generative, logistic regression discriminative.',
        'GAN = generator vs discriminator. Mode collapse = diversity නැති වීම.',
        'Perfect discriminator → vanishing gradients → non-saturating loss / WGAN-GP.',
        'VAE loss = reconstruction + KL. z = μ + σε (reparameterization) gradients ගලන්න.',
        'Flows = invertible + exact likelihood. GAN = likelihood නෑ. VAE = ELBO (lower bound).',
      ],
      terms: [
        { en: 'Discriminative Model', si: 'P(y | x) කෙලින්ම ඉගෙන ගන්න model එක. Boundary එක විතරයි.' },
        { en: 'Naive Bayes', si: 'Class එක දන්නකොට features ස්වාධීනයි කියලා උපකල්පනය කරන generative classifier එක.' },
        { en: 'Mode Collapse', si: 'GAN generator එක data එකේ විවිධත්වයෙන් කොටසක් විතරක් හදන failure එක.' },
        { en: 'Non-Saturating GAN Loss', si: 'Generator එකට log D(G(z)) උපරිම කරන්න දෙන, ශක්තිමත් gradients දෙන loss එක.' },
        { en: 'WGAN-GP', si: 'Wasserstein distance + gradient penalty පාවිච්චි කරන ස්ථාවර GAN ක්‍රමය.' },
        { en: 'Reparameterization Trick', si: 'z = μ + σε. Sampling එක differentiable කරන උපක්‍රමය.' },
        { en: 'ELBO', si: 'Evidence Lower Bound. VAE optimize කරන log-likelihood lower bound එක.' },
        { en: 'Posterior Collapse', si: 'VAE decoder එක latent code එක නොසලකා හරින failure එක.' },
        { en: 'Normalizing Flow', si: 'Invertible transformations වලින් exact likelihood ගණනය කරන generative model එක.' },
      ],
    },
    {
      id: 'diffusion-and-autoregressive',
      title: 'Generative Models Deep Dive (2): Diffusion, DDPM Objective, Latent Diffusion, Classifier-Free Guidance, Autoregressive Models, Teacher Forcing',
      examRefs: ['FUN-045', 'FUN-046', 'FUN-106', 'FUN-107', 'FUN-143', 'FUN-144', 'FUN-146'],
      body: [
        'Diffusion models: training වලදී පින්තූර වලට ක්‍රමයෙන් noise එකතු කරලා (forward process), network එකට ඒ noise අයින් කරන්න උගන්නනවා. Generate කරනකොට pure noise එකෙන් පටන් අරන් පියවර ගොඩක් හරහා denoise කරනවා. GANs වගේ discriminator එකක් එක්ක එක forward pass එකකින් නෙවෙයි. DDPM objective: clean image x₀ noise කරන්නේ x_t = √ᾱ_t × x₀ + √(1 − ᾱ_t) × ε. (ᾱ_t = timestep t දී මුල් image එකෙන් කොච්චර ඉතුරුද කියන අංකය, ε = Gaussian noise.) Network එක ε_θ(x_t, t) එකට එකතු කරපු noise ε predict කරනවා, MSE loss එකෙන්: ‖ε − ε_θ‖². Adversary එකක් නෑ.',
        'Latent diffusion (Stable Diffusion): pixel space එකේ diffusion කරනවා වෙනුවට autoencoder එකකින් image එක පොඩි latent tensor එකකට compress කරනවා. Denoising steps ඔක්කොම ඒ පොඩි අවකාශයේ, ඉතින් step එකකට compute ගොඩක් අඩුයි. අන්තිමට decoder එක pixels වලට හරවනවා. Steps තාමත් කීපයක් ඕනේ, ඒවා ලාභයි විතරයි.',
        'Classifier-free guidance (CFG): එකම network එක, training වලදී prompt (condition) එක අහඹු ලෙස අතහරිනවා (drop කරනවා). ඉතින් ඒකට conditional සහ unconditional predictions දෙකම කරන්න පුළුවන්. Sampling: ε̂ = ε_uncond + w × (ε_cond − ε_uncond). w = guidance scale. w වැඩි කළාම prompt එකට වඩා හොඳට කීකරුයි, ඒත් විවිධත්වය අඩුයි, ගොඩක් ලොකු w වලදී artifacts (over-saturated colors). වෙනම classifier එකක් ඕනේ නෑ (පරණ "classifier guidance" එකට ඕනේ වුණා). Steps ගණන අඩු කරන්නේ නෑ.',
        'Autoregressive models (GPT): sequence එකක සම්භාවිතාව chain rule එකෙන් හරියටම කඩනවා: p(x) = Π_t p(x_t | x₁, …, x_{t−1}). ඒ කියන්නේ හැම token එකක්ම කලින් tokens ඔක්කොම දන්නකොට එන සම්භාවිතාවල ගුණිතය. Training objective = ඊළඟ token එක predict කිරීම. Independence (p(x) = Π p(x_t)) උපකල්පනය කළොත් tokens අතර සම්බන්ධය නැති වෙනවා. Teacher forcing: training වලදී input එකට දෙන්නේ ground-truth කලින් tokens (model එකේ outputs නෙවෙයි). ඒකෙන් training ස්ථාවරයි, සහ positions ඔක්කොම සමාන්තරව ගණනය කරන්න පුළුවන්. ප්‍රශ්නය = exposure bias: inference වලදී model එක තමන්ගේම (වැරදි වෙන්න පුළුවන්) outputs මත condition වෙනවා. ඒ distribution එක training වලදී කවදාවත් දැකලා නෑ, ඉතින් මුල් පොඩි වැරදි එකතු වෙනවා. Scheduled sampling සහ sequence-level objectives මේක අඩු කරන්න උත්සාහ කරනවා.',
      ],
      analogy: 'Diffusion = පරණ, මීදුම් වැදුණු ඡායාරූපයක් ටික ටික පිරිසිදු කරන කලාකරුවෙක්. Training = හොඳ ඡායාරූප වලට මීදුම දාලා, "මීදුම කොච්චරද" කියලා අනුමාන කරන්න පුරුදු කරනවා. CFG = tuk-tuk driver ට "Galle Face" කියනවා. w = කොච්චර තදින් කියනවද. පොඩ්ඩක් කිව්වොත් කැමති පාරක යනවා (විවිධ). ගොඩක් තදින් කිව්වොත් හරියටම යනවා, ඒත් අමුතු shortcuts (artifacts). Teacher forcing = learner driver කෙනෙක්ට instructor සුක්කානම හැම වෙලේම හරි පාරට හරවලා දෙනවා. Test එකේදී තනියම. පොඩි වැරැද්දකින් පාරෙන් අයින් වුණාම ඒ තත්ත්වය කවදාවත් පුරුදු වෙලා නෑ = exposure bias.',
      example: 'CFG ගණනක් (එක අගයකට): ε_uncond = 0.2, ε_cond = 0.5. w = 1 → 0.2 + 1 × 0.3 = 0.5 (සාමාන්‍ය conditional). w = 7.5 → 0.2 + 7.5 × 0.3 = 2.45 (prompt දිශාවට ගොඩක් extrapolate). Latent diffusion: 512 × 512 × 3 image = values 786,432. Latent 64 × 64 × 4 = 16,384. 48 ගුණයක් පොඩියි, ඉතින් step එකක් ගොඩක් ලාභයි. Autoregressive: "මම ගෙදර යනවා" → p(මම) × p(ගෙදර | මම) × p(යනවා | මම, ගෙදර) = 0.1 × 0.3 × 0.6 = 0.018.',
      keyPoints: [
        'Diffusion = noising reverse කරලා, noise එකෙන් පටන් අරන් steps ගොඩකින් denoise.',
        'DDPM = එකතු කරපු noise ε, MSE එකෙන් predict කරනවා. Discriminator නෑ.',
        'Latent diffusion = පොඩි latent එකේ denoise, step එකකට compute ↓.',
        'CFG w ↑ → prompt adherence ↑, diversity ↓, ලොකු w → artifacts. Classifier ඕනේ නෑ.',
        'AR = chain rule factorization. Teacher forcing → parallel training, ඒත් exposure bias.',
      ],
      terms: [
        { en: 'Forward / Reverse Process', si: 'Forward = data වලට noise එකතු කිරීම. Reverse = noise අයින් කරලා data හැදීම.' },
        { en: 'DDPM', si: 'Denoising Diffusion Probabilistic Model. Noise ε predict කරන diffusion ක්‍රමය.' },
        { en: 'Latent Diffusion', si: 'Autoencoder latent space එකේ diffusion කරන ක්‍රමය (Stable Diffusion).' },
        { en: 'Classifier-Free Guidance', si: 'Conditional සහ unconditional predictions අතර extrapolate කරලා prompt එකට කීකරු කරන ක්‍රමය.' },
        { en: 'Guidance Scale (w)', si: 'CFG එකේ prompt එකට කොච්චර තදින් කීකරු වෙනවද කියන knob එක.' },
        { en: 'Teacher Forcing', si: 'Training වලදී ground-truth කලින් tokens input ලෙස දෙන එක.' },
        { en: 'Exposure Bias', si: 'Inference වලදී තමන්ගේම outputs මත condition වීමෙන් එන training-inference නොගැළපීම.' },
        { en: 'Scheduled Sampling', si: 'Training අතරතුර ක්‍රමයෙන් model එකේම predictions input ලෙස දෙන ක්‍රමය.' },
      ],
    },
    {
      id: 'gpu-accelerated-ml',
      title: 'GPU Acceleration for Classic ML & Data: Why GPUs, cuDF / cudf.pandas, cuML, GPU XGBoost, Spark, Dask, DLPack, Mixed Precision',
      examRefs: ['FUN-047', 'FUN-048', 'FUN-098', 'FUN-099', 'FUN-101', 'FUN-102', 'FUN-103', 'FUN-148'],
      body: [
        'GPU එකක් ML වේගවත් කරන්නේ ඇයි? CPU එකකට ගොඩක් බුද්ධිමත් cores ටිකයි. GPU එකකට සරල cores දහස් ගණනක්. ML වල ගොඩක් වැඩ (matrix multiply, column එකක හැම row එකකටම එකම operation එක, tree split candidates ගණනය) එකිනෙකින් ස්වාධීන කුඩා ගණන් ලක්ෂ ගණනක්. ඒවා සමාන්තරව කරන්න GPU එක හොඳම තැන. ඒත් data CPU සිට GPU ට යවන්න සහ kernels launch කරන්න overhead එකක් තියෙනවා. ඉතින් rows 2,000ක CSV එකක් වගේ පොඩි, එක පාරක වැඩකට GPU එකෙන් වාසියක් නෑ, CPU එකේ milliseconds වලින් ඉවරයි. ලොකු data (rows මිලියන 50ක random forest), tuning වලදී නැවත නැවත k-means, multi-GB joins / aggregations = ලොකු speedups.',
        'RAPIDS = NVIDIA ගේ GPU data science libraries. cuDF = pandas වගේ API එකක් තියෙන GPU DataFrame. cudf.pandas accelerator mode = තියෙන pandas code එක කිසිම වෙනසක් නැතුව GPU එකේ run කරනවා, support නැති operations ස්වයංක්‍රීයව CPU pandas එකට fallback වෙනවා. Jupyter: %load_ext cudf.pandas. Script: python -m cudf.pandas script.py. cuML = scikit-learn වගේ API එකක් තියෙන GPU ML algorithms (random forest, k-means, UMAP, t-SNE ...). cuML DataFrame manipulation සඳහා නෙවෙයි. cuGraph = graph analytics, gradient boosting නෙවෙයි.',
        'XGBoost GPU: version 2.0 සිට device="cuda" සහ tree_method="hist". (පරණ versions වල tree_method="gpu_hist".) PyTorch වලට rewrite කරන්න ඕනේ නෑ. Spark: RAPIDS Accelerator for Apache Spark = Spark plugin එකක්, supported SQL / DataFrame operations GPU එකේ run කරනවා, job code එක වෙනස් නොකර වගේ. Data එක GPU එකක memory එකට වඩා ලොකු නම්: Dask + dask-cudf. DataFrame එක cuDF partitions ගොඩකට කඩලා GPUs (සහ nodes) කීපයක් පුරා බෙදනවා. Zero-copy interoperability: cuDF එකේ හදපු features PyTorch එකට, GPU → CPU → GPU round trip එකක් නැතුව, DLPack හෝ CUDA Array Interface එකෙන් GPU buffers කෙලින්ම share කරනවා. CSV / pickle / pandas හරහා යන එක host copy එකක්.',
        'Mixed precision training: ගොඩක් operations FP16 / BF16 වලින් (Tensor Cores මත, memory traffic අඩුයි), ඒත් weights වල FP32 master copy එකක් තියාගන්නවා (පොඩි updates නැති නොවෙන්න). FP16 නම් loss scaling එකෙන් gradient underflow වළක්වනවා. INT8 ප්‍රධාන වශයෙන් inference quantization format එකක්. BF16 vs FP16: BF16 = exponent bits 8 (FP32 වගේම පරාසය), mantissa bits 7. FP16 = exponent 5, mantissa 10 (precision වැඩියි, පරාසය අඩුයි). දෙකම bits 16, memory එකමයි. BF16 එකේ overflow / underflow සහ loss scaling ගැන කරදර අඩුයි, ඒකයි ලොකු models වලට කැමති. GPU hardware, Tensor Cores, RAPIDS ගැන තවත් විස්තර Phase 9 (NVIDIA AI Stack) එකේ තියෙනවා.',
      ],
      analogy: 'CPU = දක්ෂ chef ලා 8 දෙනෙක්. GPU = පොල් ගාන අය 5,000ක්. Biriyani එකක් හදන්න chef ලා හොඳයි. පොල් ගෙඩි ලක්ෂයක් ගාන්න 5,000 දෙනා දිනනවා. ඒත් පොල් ගෙඩි 3ක් ගාන්න 5,000 දෙනාව බස් වල ගෙන්නන වියදම (data transfer overhead) වටින්නේ නෑ. cudf.pandas = එකම recipe පොත (pandas code), ඒත් කුස්සිය මාරු කළා. බැරි දෙයක් ආවොත් පරණ කුස්සියට (CPU) යනවා. DLPack = එකම මේසය උඩ තියෙන කෑම පිඟාන අනිත් කෙනාට තල්ලු කරනවා, ගෙදරට අරන් ගිහින් ආපහු ගේන්නේ නෑ.',
      example: 'Bank එකක transactions මිලියන 50ක pandas pipeline එකක් CPU එකේ විනාඩි 20ක් ගන්නවා. python -m cudf.pandas pipeline.py කියලා run කළාම code එකේ පේළියක්වත් වෙනස් නොකර GPU එකේ run වෙනවා (speedup එක workload එක මත රඳා පවතිනවා). ඊට පස්සේ XGBoost(device="cuda", tree_method="hist"). BF16: FP32 වගේම ~3.4 × 10³⁸ දක්වා අගයන්. FP16 උපරිමය 65,504 විතරයි, ඒ නිසා FP16 ලොකු activations / gradients වලදී overflow වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `# Jupyter: %load_ext cudf.pandas   |  Script: python -m cudf.pandas train.py
import pandas as pd                      # cudf.pandas load කරලා නම් මේක GPU එකේ
import xgboost as xgb

df = pd.read_parquet("transactions.parquet")
daily = df.groupby("customer_id")["amount"].agg(["sum", "mean", "count"])

model = xgb.XGBClassifier(device="cuda", tree_method="hist", n_estimators=500)
model.fit(X_train, y_train)              # GPU එකේ boosting

# cuDF → PyTorch, zero-copy (DLPack): import cudf, torch
# t = torch.from_dlpack(cudf_df.to_cupy())`,
      },
      keyPoints: [
        'GPU = ස්වාධීන ගණන් ලක්ෂ ගණනක් සමාන්තරව. පොඩි data වලට overhead නිසා වාසියක් නෑ.',
        'cudf.pandas = code වෙනසක් නෑ + CPU fallback. cuML = sklearn-style GPU ML.',
        'XGBoost 2.x GPU = device="cuda", tree_method="hist". Spark = RAPIDS Accelerator plugin.',
        'GPU එකකට ලොකුයි → Dask-cuDF. Libraries අතර zero-copy → DLPack / CUDA Array Interface.',
        'Mixed precision = FP16/BF16 compute + FP32 master weights. BF16 = FP32 range, අඩු precision.',
      ],
      terms: [
        { en: 'RAPIDS', si: 'cuDF, cuML, cuGraph වගේ NVIDIA GPU data science libraries එකතුව.' },
        { en: 'cuDF / cudf.pandas', si: 'GPU DataFrame library එක. cudf.pandas = pandas code වෙනස් නොකර GPU එකේ run කරන mode එක.' },
        { en: 'cuML', si: 'scikit-learn වගේ API එකක් තියෙන GPU ML algorithms library එක.' },
        { en: 'RAPIDS Accelerator for Apache Spark', si: 'Spark SQL / DataFrame jobs GPU එකේ run කරන plugin එක.' },
        { en: 'Dask-cuDF', si: 'cuDF DataFrames GPUs සහ nodes කීපයක් පුරා බෙදන library එක.' },
        { en: 'DLPack', si: 'Libraries අතර device memory copy නොකර tensors හුවමාරු කරන සම්මත protocol එක.' },
        { en: 'Loss Scaling', si: 'FP16 training වලදී gradients underflow නොවෙන්න loss එක ලොකු අංකයකින් ගුණ කරන එක.' },
        { en: 'BF16', si: 'Exponent bits 8, mantissa 7. FP32 වගේම පරාසය, අඩු precision.' },
      ],
    },
    {
      id: 'end-to-end-churn-project',
      title: 'Beyond the Exam: End-to-End Mini Project, Sri Lankan Telco Customer Churn (CSV → Evaluated Model → Monitoring)',
      examRefs: ['FUN-138', 'FUN-053', 'FUN-055', 'FUN-086', 'FUN-133'],
      body: [
        'දැන් ඔක්කොම එකට. ලංකාවේ mobile operator කෙනෙක්ට ඕනේ ඊළඟ මාසේ connection එක අතහරින (churn) customers ලා කලින් හොයාගන්න, retention offer එකක් දෙන්න. CSV එකේ columns: customer_id, district, plan_type, monthly_bill_rs, data_gb, call_minutes, complaints_90d, tenure_months, reload_count, last_reload_date, disconnect_reason, churned (0/1). Churn rate 8%. පියවර 1 = ප්‍රශ්නය සහ metric එක: offer එකක් ලාභයි, customer කෙනෙක් නැති වීම මිලයි → recall වැදගත්, ඒත් precision එකත් බලනවා (offers වියදම). Report කරන්නේ PR-AUC + තෝරපු threshold එකේ recall / precision.',
        'පියවර 2 = Leakage පරීක්ෂාව. disconnect_reason පිරෙන්නේ churn වුණාට පස්සේ විතරයි → target leakage, අයින් කරන්න. last_reload_date එකෙන් "prediction දවසට කලින්" කොටස විතරක් features වලට (උදා: days_since_reload). පියවර 3 = Split: churn 8% නිසා stratified split. Customer කෙනෙක්ට මාස කීපයක rows තියෙනවා නම් GroupKFold (customer_id). Production එකේදී "අනාගතය predict කරනවා" නිසා අන්තිම test එක time-based (පරණ මාස train, අලුත්ම මාසය test).',
        'පියවර 4 = Pipeline: numeric වලට median imputation + scaling, district / plan_type වලට one-hot. ඔක්කොම scikit-learn Pipeline එකක් ඇතුළේ, එතකොට preprocessing statistics train folds වලින් විතරයි. පියවර 5 = Baselines: (a) "කවුරුත් churn වෙන්නේ නෑ" කියන dummy model එක (accuracy 92%, recall 0, accuracy බොරු කියන හැටි බලන්න). (b) Logistic regression class_weight="balanced". (c) Gradient boosted trees (tabular data වලට හොඳම baseline). පියවර 6 = Threshold සහ calibration: validation එකේ precision-recall curve එකෙන් business එකට ගැළපෙන threshold එක තෝරන්න. Probabilities "churn සම්භාවිතාව 30%" වගේ offers budget කරන්න පාවිච්චි කරනවා නම් calibrate කරන්න.',
        'පියවර 7 = Monitoring. Operator එක අලුත් පළාතකට (උදා: උතුරු පළාත) ව්‍යාප්ත වුණා. Input distribution එක (P(x)) වෙනස්: district, bill amounts වෙනස්. ඒත් "complaints වැඩි, reloads අඩු customer churn වෙනවා" කියන සම්බන්ධය (P(y | x)) එහෙමමයි → covariate shift. අලුත් inputs එක්ක retrain කිරීම හෝ importance weighting උදව් වෙනවා. ඒත් තරඟකාර operator කෙනෙක් ලාභ data packages දැම්මාම, එකම features තියෙන අයත් කලින්ට වඩා churn වෙනවා නම් P(y | x) ම වෙනස් → concept drift. ඒකට අලුත් labels එක්ක retrain කරන්නම ඕනේ.',
      ],
      analogy: 'මේ project එක ගෙයක් හදනවා වගේ. Leakage check = අත්තිවාරම (වැරදුණොත් මුළු ගෙදරම කඩාවැටෙනවා, ලකුණු කොච්චර ලස්සන වුණත්). Pipeline = බිත්ති. Baselines = "මේ ගෙදර, ඉඩම හිස්ව තිබ්බාට වඩා හොඳද?" කියලා බලන එක. Threshold = දොර කොච්චර පළලද (වැඩි අයට ඇතුළු වෙන්න දෙනවද). Monitoring = ගෙදර හදලා ඉවරයි කියලා අමතක කරන්නේ නැතුව හැම වැස්සකටම වහලය බලන එක.',
      example: 'Customers 50,000, churn 4,000 (8%). Dummy model: accuracy 92%, recall 0. Logistic regression (balanced): PR-AUC 0.41, threshold 0.5 දී recall 0.70, precision 0.22. XGBoost: PR-AUC 0.55. Threshold 0.35: recall 0.80, precision 0.30. ඒ කියන්නේ offers 100ක් දුන්නොත් 30ක් ඇත්තටම churn වෙන්න හිටපු අයට යනවා, ඇත්ත churners ලගෙන් 80% ක් අල්ලනවා. Offer එකක් Rs. 300යි, customer කෙනෙක් නැති වීම Rs. 6,000 නම්, ඒක හොඳ ගනුදෙනුවක්. (මේ අංක උදාහරණ විතරයි.)',
      code: {
        lang: 'python',
        src: `import pandas as pd
from sklearn.compose import make_column_transformer; from sklearn.pipeline import make_pipeline
from sklearn.impute import SimpleImputer; from sklearn.preprocessing import OneHotEncoder
from sklearn.model_selection import train_test_split; from sklearn.metrics import average_precision_score
from sklearn.ensemble import HistGradientBoostingClassifier

df = pd.read_csv("telco_churn_lk.csv").drop(
    columns=["customer_id", "disconnect_reason", "last_reload_date"])  # ID, leakage, raw date අයින්
X, y = df.drop(columns="churned"), df["churned"]
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)
prep = make_column_transformer((OneHotEncoder(handle_unknown="ignore", sparse_output=False), ["district", "plan_type"]),
                               remainder=SimpleImputer(strategy="median"))
model = make_pipeline(prep, HistGradientBoostingClassifier()).fit(X_tr, y_tr)
print("PR-AUC:", average_precision_score(y_te, model.predict_proba(X_te)[:, 1]))`,
      },
      keyPoints: [
        'මුලින්ම: business ප්‍රශ්නය සහ metric එක (recall / precision / PR-AUC).',
        'Leakage features අයින් කරන්න. Stratified / group / time split.',
        'Preprocessing Pipeline එකක් ඇතුළේ. Dummy baseline එකකින් පටන් ගන්න.',
        'Threshold එක business වියදම් අනුව. අවශ්‍ය නම් calibrate කරන්න.',
        'P(x) වෙනස් = covariate shift. P(y | x) වෙනස් = concept drift.',
      ],
      terms: [
        { en: 'Churn', si: 'Customer කෙනෙක් සේවාව අතහැරලා යන එක.' },
        { en: 'Baseline Model', si: 'සසඳන්න පාවිච්චි කරන සරලම model එක (dummy, logistic regression).' },
        { en: 'Covariate Shift', si: 'Inputs වල distribution P(x) වෙනස් වෙනවා, P(y | x) එහෙමමයි.' },
        { en: 'Concept Drift', si: 'Features සහ target අතර සම්බන්ධය P(y | x) ම වෙනස් වෙන එක.' },
        { en: 'Importance Weighting', si: 'Training examples, අලුත් input distribution එකට ගැළපෙන්න බර කරන covariate shift විසඳුමක්.' },
        { en: 'ColumnTransformer', si: 'Column වර්ග වලට වෙනස් preprocessing යොදන scikit-learn tool එක.' },
      ],
    },
  ],
  quiz: [
    {
      q: '10-class classifier එකක cross-entropy loss එක පළමු step එකේ ඉඳන්ම 2.30 ළඟ හිරවෙලා. මේකෙන් කියවෙන්නේ මොකක්ද?',
      options: ['Model එක පරිපූර්ණයි', 'Model එක classes 10ටම 0.1 බැගින් දෙනවා, ඉගෙන ගන්නේ නෑ', 'Model එක විශ්වාසයෙන් වැරදි class එක කියනවා', 'Dataset එකේ classes 2යි'],
      answer: 1,
      why: '−ln(1/10) = ln 10 ≈ 2.30. ඒක uniform guess එකක loss එක. Learning rate, labels, gradient flow check කරන්න. Confidently wrong නම් loss එක 2.30 ට වඩා ගොඩක් ඉහළයි.',
    },
    {
      q: 'Precision 0.6, recall 0.9. F1 කීයද?',
      options: ['0.75', '0.72', '0.54', '0.80'],
      answer: 1,
      why: 'F1 = 2 × 0.6 × 0.9 ÷ (0.6 + 0.9) = 1.08 ÷ 1.5 = 0.72. 0.75 කියන්නේ arithmetic mean එක (trap එක).',
    },
    {
      q: 'Gradient [6, 8], max_norm = 1.0 සමඟ global-norm clipping කළාම ලැබෙන්නේ?',
      options: ['[1.0, 1.0]', '[0.6, 0.8]', '[6, 8]', '[0.75, 1.0]'],
      answer: 1,
      why: 'Norm = √(36 + 64) = 10. 10 > 1 නිසා හැම component එකක්ම 1/10 න් ගුණ කරනවා → [0.6, 0.8]. [1, 1] = per-value clipping, ඒක දිශාව වෙනස් කරනවා.',
    },
    {
      q: 'Label smoothing ε = 0.1, classes K = 5, target = (1 − ε)·one_hot + ε/K. හරි class එකේ සහ අනිත් class එකක target අගයන්?',
      options: ['0.90 සහ 0.025', '1.00 සහ 0.02', '0.92 සහ 0.02', '0.90 සහ 0.02'],
      answer: 2,
      why: 'හැම class එකකටම ε/K = 0.02. හරි class එකට අමතරව 1 − ε = 0.90 → 0.92. Check: 0.92 + 4 × 0.02 = 1.',
    },
    {
      q: 'PyTorch inverted dropout p = 0.2. Training වලදී ඉතුරු වෙන activations වලට මොකද වෙන්නේ?',
      options: ['0.8 න් ගුණ වෙනවා', '1.25 න් ගුණ වෙනවා', 'වෙනසක් නෑ, inference වලදී 0.8 න් ගුණ කරනවා', '0.2 න් ගුණ වෙනවා'],
      answer: 1,
      why: '1 ÷ (1 − 0.2) = 1.25. Expected activation එක එකම තියාගන්නවා, ඉතින් inference වලදී scaling ඕනේ නෑ. තුන්වෙනි option එක පරණ non-inverted ක්‍රමය.',
    },
    {
      q: 'Adam β₁ = 0.9, m₀ = 0. පළමු step එකෙන් පස්සේ m₁ = 0.1·g₁. Bias correction එකෙන් ලැබෙන්නේ?',
      options: ['m̂₁ = 0.9·m₁', 'm̂₁ = m₁ ÷ (1 − 0.9) = g₁', 'm̂₁ = m₁ ÷ 1.9', 'Correction එකක් නෑ'],
      answer: 1,
      why: 'Zero init නිසා m එක 0 දිහාට bias වෙලා. (1 − β₁ᵗ) = 0.1 න් බෙදුවාම හරියටම g₁. t ලොකු වෙන්න මේ බලපෑම නැති වෙනවා.',
    },
    {
      q: 'Single deep decision tree එකකට training accuracy 100%, ඒත් validation අස්ථාවරයි. Random forest එකක් උදව් කරන්නේ ඇයි?',
      options: ['හැම tree එකක්ම ගැඹුරු කරලා bias අඩු කරනවා', 'Decorrelated trees ගොඩක average එකෙන් variance අඩු කරනවා', 'ප්‍රශ්නය regression එකකට හරවනවා', 'Training data ඕනේ නෑ'],
      answer: 1,
      why: 'Bootstrap samples + random feature subsets → එකිනෙකට වෙනස් trees. ඒවායේ වැරදි average එකේදී කැපෙනවා. Bias තනි tree එකක තරමටම වගේ.',
    },
    {
      q: 'ROC-AUC = 0.85 කියන්නේ මොකක්ද?',
      options: ['Predictions වලින් 85% ක් හරි', 'Default threshold එකේ precision 0.85', 'අහඹු positive එකක් අහඹු negative එකකට වඩා ඉහළින් rank වෙන්නේ 85% ක් වෙලාවට', 'Positives වලින් 15% ක් වැරදියි'],
      answer: 2,
      why: 'AUC = ranking ගුණාත්මකභාවය, හැම threshold එකක්ම හරහා. Accuracy, precision එක threshold එකක් මත රඳා පවතිනවා.',
    },
    {
      q: 'Text-to-image diffusion model එකක classifier-free guidance scale එක වැඩි කළාම සාමාන්‍යයෙන් වෙන්නේ?',
      options: ['විවිධත්වය වැඩි, prompt adherence අඩු', 'Denoising steps අඩුවෙන් ඕනේ', 'Prompt adherence වැඩි, විවිධත්වය අඩු, ගොඩක් ලොකු scale වලදී artifacts', 'වෙනම classifier එකක් train කරන්නේ නැත්නම් වෙනසක් නෑ'],
      answer: 2,
      why: 'ε̂ = ε_uncond + w(ε_cond − ε_uncond). w වැඩි කළාම prompt දිශාවට extrapolate වෙනවා. එකම network එක condition drop කරලා train කරන නිසා classifier එකක් ඕනේ නෑ.',
    },
    {
      q: 'Rows 2,000ක CSV එකක එක පාරක model එකක් train කරනවා. RAPIDS / GPU වලට මාරු කිරීම ගැන හරි කතාව මොකක්ද?',
      options: ['GPU එක හැමවිටම 50× වේගවත්', 'Data transfer සහ kernel launch overhead නිසා වාසියක් වෙන්න ඉඩ අඩුයි, CPU එකේ milliseconds වලින් ඉවරයි', 'cuML ට rows 10,000 ට අඩු data දාන්න බෑ', 'cudf.pandas පාවිච්චි කරන්න code එක සම්පූර්ණයෙන් rewrite කරන්න ඕනේ'],
      answer: 1,
      why: 'GPU acceleration එකට overhead එක වහගන්න තරම් සමාන්තර වැඩ ඕනේ. ලොකු data, නැවත නැවත tuning, ලොකු joins තමයි ලොකු speedups දෙන්නේ. cudf.pandas වලට code වෙනසක් ඕනේ නෑ.',
    },
  ],
}
