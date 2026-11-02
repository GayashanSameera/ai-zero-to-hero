export default {
  id: 'ml',
  number: 2,
  title: 'Machine Learning',
  titleSi: 'Machine Learning: උදාහරණ වලින් ඉගෙන ගන්න computer',
  summary: 'Machine Learning කියන්නේ rules අතින් ලියනවා වෙනුවට, උදාහරණ (data) වලින් computer එකටම rules හොයාගන්න දෙන ක්‍රමය. මේ phase එකේදී ඔයා model එකක් train කරන හැටි, ඒක හරිද කියලා මනින හැටි, සහ ජනප්‍රිය algorithms වැඩ කරන හැටි ඉගෙන ගන්නවා. Deep Learning, LLMs වගේ හැමදේකම පදනම මේකයි.',
  duration: 'සති 6-8',
  topics: [
    {
      id: 'what-is-ml',
      title: 'Machine Learning කියන්නේ මොකක්ද?',
      body: [
        'සාමාන්‍ය programming වලදී මිනිහෙක් rules ලියනවා. Computer එක ඒ rules data වලට යොදලා answers දෙනවා. Rules + Data → Answers. උදාහරණයක්: "Email එකේ FREE MONEY කියලා තියෙනවා නම් spam." ඒත් spam කරන අය වචන වෙනස් කරනවා. හැම rule එකක්ම අතින් ලියන්න බෑ.',
        'Machine Learning වලදී අපි data සහ answers දෙකම දෙනවා. Computer එක ඒ දෙකෙන් rules හොයාගන්නවා. Data + Answers → Rules. Emails 10,000ක් සහ "spam ද නැද්ද" කියන උත්තර දුන්නාම, computer එක තනියම spam වල රටා ඉගෙන ගන්නවා. ඒ ඉගෙන ගත්තු rules වලට කියන්නේ model එක කියලා.',
        'Features කියන්නේ model එකට දෙන input තොරතුරු. ගෙයක් නම් size එක, කාමර ගණන, location එක. Label එක (target එක) කියන්නේ අපිට අනුමාන කරන්න ඕනේ උත්තරය, උදා: ගෙදර මිල. Training කියන්නේ model එකට features සහ labels පෙන්නලා ඒකේ ඇතුළත අංක (parameters / weights) හරියට සකස් කරන ක්‍රියාවලිය.',
        'Prediction (inference) කියන්නේ train කරපු model එකට කවදාවත් දැකලා නැති අලුත් data දීලා උත්තරයක් ගන්න එක. Python වල ML කරන්න පාවිච්චි කරන ප්‍රධාන library එක scikit-learn. ඒකේ හැම model එකකම වගේ එකම රටාව තියෙනවා: fit() වලින් train කරනවා, predict() වලින් අනුමාන කරනවා.',
      ],
      analogy: 'කුඩා ළමයෙක්ට "බළලා" කියන්නේ මොකක්ද කියලා rules වලින් කියලා දෙන්නේ නෑ ("කන් දෙකක්, වලිගයක්..."). අපි බළල්ලු ගොඩක් පෙන්නලා "මේ බළලා" කියනවා. ටික කාලෙකින් ළමයා තනියම අලුත් බළලෙක්ව අඳුනගන්නවා. Features = කන්, ඇස්, ලොම්. Label = "බළලා". Training = පෙන්නන කාලය. Prediction = අලුත් සතෙක් දැක්කාම කියන උත්තරය.',
      example: 'ගෙවල් 1,000ක data: size (sqft), කාමර ගණන, Colombo සිට දුර (features), සහ විකුණපු මිල (label). Model එක train කළාට පස්සේ අලුත් ගෙයක් දෙනවා: 1,500 sqft, කාමර 3, කිලෝමීටර් 12. Model එක කියනවා "ආසන්න වශයෙන් ලක්ෂ 320යි" කියලා. මේ ගෙදර මිල model එක කවදාවත් දැකලා නෑ, ඒත් ඉගෙන ගත්තු රටාවෙන් අනුමාන කරනවා.',
      code: {
        lang: 'python',
        src: `from sklearn.linear_model import LinearRegression

# Features: [sqft, කාමර ගණන]   Label: මිල (ලක්ෂ)
X = [[1000, 2], [1500, 3], [2000, 3], [2500, 4]]
y = [200, 290, 370, 460]

model = LinearRegression()
model.fit(X, y)                       # Training: data වලින් rules ඉගෙන ගන්නවා
print(model.predict([[1800, 3]]))     # Prediction: අලුත් ගෙයක මිල`,
      },
      keyPoints: [
        'සාමාන්‍ය programming: Rules + Data → Answers.',
        'Machine Learning: Data + Answers → Rules (model එක).',
        'Features = inputs, Label = අනුමාන කරන්න ඕනේ උත්තරය.',
        'Training = fit(), Prediction = predict().',
      ],
      terms: [
        { en: 'Artificial Intelligence (AI)', si: 'මිනිස් බුද්ධිය ඕනේ වෙන වැඩ (තර්ක කිරීම, දැකීම, ඉගෙන ගැනීම, භාෂාව, අලුත් දේ හැදීම) කරන systems හදන මුළු ක්ෂේත්‍රයම. Machine Learning කියන්නේ AI එකේ කොටසක්. Deep Learning කියන්නේ ML එකේ කොටසක්.' },
        { en: 'Model', si: 'Data වලින් ඉගෙන ගත්තු rules / රටාව. Input එකක් දුන්නාම output එකක් දෙනවා.' },
        { en: 'Training', si: 'Model එකේ parameters, data වලට ගැළපෙන්න සකස් කරන ක්‍රියාවලිය.' },
        { en: 'Prediction / Inference', si: 'Train කරපු model එකෙන් අලුත් data වලට උත්තර ගන්න එක.' },
        { en: 'Features', si: 'Model එකට දෙන input columns.' },
        { en: 'Label / Target', si: 'Model එක අනුමාන කරන්න ඕනේ උත්තරය.' },
        { en: 'Parameters', si: 'Training වලදී model එක තනියම ඉගෙන ගන්න ඇතුළත අංක (weights).' },
        { en: 'scikit-learn', si: 'Classical ML වලට Python වල ප්‍රධානම library එක. fit / predict රටාව පාවිච්චි කරනවා.' },
      ],
    },
    {
      id: 'learning-types',
      title: 'Learning වර්ග',
      body: [
        'Supervised learning වලදී හැම උදාහරණයකටම නිවැරදි උත්තරය (label) තියෙනවා. Model එක input සහ output අතර සම්බන්ධය ඉගෙන ගන්නවා. උත්තරය අංකයක් නම් (මිල, උෂ්ණත්වය) ඒක regression. උත්තරය කාණ්ඩයක් නම් (spam / not spam) ඒක classification.',
        'Unsupervised learning වලදී labels නෑ. Model එක data ඇතුළේ තියෙන ව්‍යුහය තනියම හොයනවා. Customers සමාන කණ්ඩායම් වලට බෙදන clustering, columns ගණන අඩු කරන dimensionality reduction, අමුතු දේ හොයන anomaly detection වගේ ඒවා මෙතනට අයිතියි.',
        'Semi-supervised learning වලදී label තියෙන data ටිකක් සහ label නැති data ගොඩක් එකට පාවිච්චි කරනවා. Labels හදන්න මිනිස්සු ඕනේ නිසා ඒවා මිල අධිකයි, ඒ නිසා මේක ප්‍රායෝගිකයි. Self-supervised learning වලදී labels data එකෙන්ම හදාගන්නවා. උදාහරණයක්: වාක්‍යයක ඊළඟ වචනය අනුමාන කරන්න කියනවා. ඒ "ඊළඟ වචනය" කියන label එක text එකේම තියෙනවා. ChatGPT වගේ LLMs pre-train කරන්නේ මේ විදිහට.',
        'Reinforcement learning (RL) වලදී agent කෙනෙක් environment එකක actions කරලා rewards (ත්‍යාග) හෝ penalties (දඬුවම්) ලබනවා. කාලයත් එක්ක මුළු reward එක උපරිම වෙන විදිහට actions තෝරන්න ඉගෙන ගන්නවා. Games, robots, LLMs මිනිස් කැමැත්තට ගැළපෙන්න සකස් කිරීම (RLHF) වගේ තැන් වල පාවිච්චි වෙනවා.',
      ],
      analogy: 'Supervised = ගුරුවරයා උත්තර එක්ක past papers දෙනවා. Unsupervised = උත්තර නැති ප්‍රශ්න ගොඩක් දීලා "සමාන ඒවා එකට දාන්න" කියනවා. Semi-supervised = ප්‍රශ්න 1,000න් 50කට විතරක් උත්තර තියෙනවා. Self-supervised = පොතක වචන වහලා, ඒ වචනය මොකක්ද කියලා අනුමාන කරනවා. Reinforcement = බල්ලෙක්ව හික්මවනවා වගේ, හොඳ දෙයක් කළාම biscuit එකක්.',
      example: 'Bank එකක: ණය ගෙවයිද නැද්ද කියලා අනුමාන කරන එක supervised classification (පරණ ණය 50,000ක ප්‍රතිඵල තියෙනවා). Customers කණ්ඩායම් 4කට බෙදන එක unsupervised clustering. අමුතු card transactions හොයන එක anomaly detection. Chess වලින් ජයගන්න game ලක්ෂ ගණනක් සෙල්ලම් කරලා ඉගෙන ගන්න එක reinforcement learning.',
      keyPoints: [
        'Supervised = labels තියෙනවා (regression, classification).',
        'Unsupervised = labels නෑ, ව්‍යුහය හොයනවා.',
        'Semi-supervised = labels ටිකයි, unlabeled ගොඩයි.',
        'Self-supervised = labels data එකෙන්ම. Reinforcement = rewards වලින්.',
      ],
      terms: [
        { en: 'Supervised Learning', si: 'Label තියෙන data වලින් input සිට output දක්වා සම්බන්ධය ඉගෙන ගන්න එක.' },
        { en: 'Unsupervised Learning', si: 'Labels නැතුව data වල සැඟවුණු ව්‍යුහය හොයන එක.' },
        { en: 'Semi-Supervised Learning', si: 'Label තියෙන data ටිකක් සහ label නැති data ගොඩක් එකට පාවිච්චි කරන එක.' },
        { en: 'Self-Supervised Learning', si: 'Data එකෙන්ම labels හදාගෙන ඉගෙන ගන්න එක (උදා: ඊළඟ වචනය අනුමාන කිරීම).' },
        { en: 'Reinforcement Learning', si: 'Actions කරලා rewards වලින් හොඳම හැසිරීම ඉගෙන ගන්න එක.' },
        { en: 'Regression vs Classification', si: 'Regression = අංකයක් අනුමාන කරනවා. Classification = කාණ්ඩයක් අනුමාන කරනවා.' },
      ],
    },
    {
      id: 'data-splits',
      title: 'Train / Validation / Test, Cross-Validation සහ Pipelines',
      body: [
        'Model එක හොඳද කියලා බලන්න, ඒක train කරපු data වලින්ම test කරන්න බෑ. ඒක exam එකට කලින් ප්‍රශ්න පත්‍රයම දීලා පස්සේ ලකුණු දෙනවා වගේ. ඒ නිසා data කොටස් තුනකට බෙදනවා. Training set (උදා: 70%) එකෙන් model එක ඉගෙන ගන්නවා. Validation set (15%) එකෙන් settings තෝරනවා, models සසඳනවා. Test set (15%) එක අන්තිමට එක පාරක් විතරක් පාවිච්චි කරලා අවසාන ලකුණ ගන්නවා.',
        'Data ටිකයි නම් එක split එකක ප්‍රතිඵලය වාසනාව මත රඳා පවතින්න පුළුවන්. K-fold cross-validation වලදී data එක සමාන කොටස් k (උදා: 5) කට බෙදනවා. හැම පාරම එක කොටසක් validation වලට තියලා අනිත් 4න් train කරනවා. පාර 5ම කරලා සාමාන්‍ය ලකුණ ගන්නවා. Stratified k-fold එකේදී හැම fold එකකම class ප්‍රතිශත මුළු data එකේ වගේම තියෙන්න බලාගන්නවා. Classes අසමබර නම් මේක වැදගත්.',
        'Data leakage කියන්නේ training වලදී model එකට, ඇත්ත ලෝකයේ prediction කරන වෙලාවට ලැබෙන්නේ නැති තොරතුරක් අහම්බෙන් ලැබෙන එක. උදා: මුළු data එකෙන්ම scaler එක fit කරලා පස්සේ split කරන එක, නැත්නම් "refund_issued" වගේ ප්‍රතිඵලයෙන් පස්සේ හැදෙන column එකක් feature එකක් විදිහට දාන එක. Leakage තිබුණොත් test ලකුණු ගොඩක් හොඳට පේනවා, ඒත් ඇත්ත ලෝකයේ model එක අසාර්ථකයි.',
        'Pipeline එකක් කියන්නේ preprocessing (scaling, encoding) සහ model එක එක දාමයකට එකතු කරන එක. Cross-validation ඇතුළේ pipeline එකක් පාවිච්චි කළාම හැම fold එකකම preprocessing එක fit වෙන්නේ ඒ fold එකේ training කොටසින් විතරයි. ඒ නිසා leakage වළක්වනවා, code එකත් පිළිවෙළයි.',
      ],
      analogy: 'A/L ශිෂ්‍යයෙක්. Textbook එක = training set. Model papers = validation set (පාඩම් කරන ක්‍රමය හදාගන්න). ඇත්ත A/L exam එක = test set (එක පාරයි). Data leakage කියන්නේ exam එකට කලින් ප්‍රශ්න පත්‍රය leak වෙන එක. ලකුණු හොඳයි, ඒත් ඇත්ත දැනුම නෑ.',
      example: 'Rows 1,000ක්, ඒකෙන් fraud 50යි (5%). සාමාන්‍ය random split එකකින් test set එකේ fraud 4ක් හරි 14ක් හරි වැටෙන්න පුළුවන්. Stratified split එකකින් rows 200ක test set එකේ හරියටම වගේ fraud 10ක් (5%) තියෙනවා. 5-fold CV ලකුණු 0.81, 0.84, 0.79, 0.83, 0.83 නම් සාමාන්‍යය 0.82යි.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split, cross_val_score, StratifiedKFold
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression

X, y = load_breast_cancer(return_X_y=True)
# Test set එක වෙනම තියනවා (stratify = class ප්‍රතිශත එකම විදිහට)
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42)

# Pipeline: scaler + model. CV ඇතුළේ leakage නෑ
pipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
print(cross_val_score(pipe, X_train, y_train, cv=cv).mean())`,
      },
      keyPoints: [
        'Train = ඉගෙන ගන්න, Validation = තෝරන්න, Test = අවසාන ලකුණ.',
        'K-fold CV = කොටස් k ක් මාරුවෙන් මාරුවට validation කරනවා.',
        'Stratified = class ප්‍රතිශත හැම fold එකකම එකයි.',
        'Pipelines පාවිච්චි කරලා data leakage වළක්වන්න.',
      ],
      terms: [
        { en: 'Train / Validation / Test Split', si: 'Data එක ඉගෙනීමට, settings තේරීමට, අවසාන පරීක්ෂාවට කොටස් තුනකට බෙදීම.' },
        { en: 'Cross-Validation', si: 'Data එක විවිධ විදිහට බෙදලා කිහිප පාරක් train / validate කරලා සාමාන්‍ය ලකුණ ගැනීම.' },
        { en: 'K-Fold', si: 'Data එක කොටස් k කට බෙදලා, එක එක කොටස මාරුවෙන් validation වලට ගැනීම.' },
        { en: 'Stratified K-Fold', si: 'හැම fold එකකම class අනුපාතය මුළු data එකේ වගේම තියාගන්න k-fold.' },
        { en: 'Data Leakage', si: 'Prediction වෙලාවට නොලැබෙන තොරතුරු training වලට රිංගන එක. ලකුණු බොරුවට හොඳ වෙනවා.' },
        { en: 'Pipeline', si: 'Preprocessing පියවර සහ model එක එක object එකකට එකතු කරන එක.' },
      ],
    },
    {
      id: 'overfitting',
      title: 'Overfitting, Underfitting, Bias-Variance සහ Regularization',
      lab: 'overfitting',
      body: [
        'Underfitting කියන්නේ model එක ගොඩක් සරල නිසා data වල ඇත්ත රටාවවත් අල්ලගන්න බැරි වෙන එක. Training ලකුණුත් අඩුයි, test ලකුණුත් අඩුයි. Overfitting කියන්නේ model එක ගොඩක් සංකීර්ණ නිසා training data වල noise එකත් කටපාඩම් කරන එක. Training ලකුණු ගොඩක් හොඳයි, ඒත් අලුත් (test) data වල ලකුණු නරකයි.',
        'Bias කියන්නේ model එකේ සරල උපකල්පන නිසා එන ක්‍රමානුකූල වැරැද්ද. Bias වැඩි නම් underfit වෙනවා. Variance කියන්නේ training data ටිකක් වෙනස් කළාම model එක කොච්චර වෙනස් වෙනවද කියන එක. Variance වැඩි නම් overfit වෙනවා. Model එක සංකීර්ණ කරද්දී bias අඩු වෙනවා, ඒත් variance වැඩි වෙනවා. මේ දෙක අතර හොඳම සමබරතාව හොයන එකට කියන්නේ bias-variance tradeoff කියලා.',
        'Regularization කියන්නේ model එක ගොඩක් සංකීර්ණ වෙන එකට දඬුවමක් දාන එක. Loss එකට weights වල ප්‍රමාණය මත penalty එකක් එකතු කරනවා. L1 (Lasso) penalty එක weights වල absolute අගයන්ගේ එකතුව. ඒකෙන් සමහර weights හරියටම 0 වෙනවා, ඒ නිසා feature selection එකකුත් වෙනවා. L2 (Ridge) penalty එක weights වල වර්ග (squares) එකතුව. ඒකෙන් weights හැමෝම පොඩි කරනවා, ඒත් සාමාන්‍යයෙන් 0 කරන්නේ නෑ. ElasticNet කියන්නේ L1 සහ L2 දෙකේම මිශ්‍රණයක්.',
        'Overfitting අඩු කරන්න තවත් ක්‍රම: data වැඩිපුර එකතු කරන එක, features අඩු කරන එක, සරල model එකක් ගන්න එක, cross-validation වලින් model එක තෝරන එක, trees වල max_depth සීමා කරන එක.',
      ],
      analogy: 'Exam එකකට පාඩම් කරන ශිෂ්‍යයෝ තුන් දෙනෙක්. පළවෙනියා කිසිම දෙයක් පාඩම් කළේ නෑ (underfitting). දෙවෙනියා past paper උත්තර වචනයෙන් වචනය කටපාඩම් කළා. ප්‍රශ්නය ටිකක් වෙනස් කළාම බෑ (overfitting). තුන්වෙනියා concept එක තේරුම් ගත්තා, අලුත් ප්‍රශ්නත් කරන්න පුළුවන් (හොඳ fit එක). Regularization කියන්නේ "කටපාඩම් කරන්න එපා, සරලව තේරුම් ගන්න" කියලා ගුරුවරයා දාන නීතිය.',
      example: 'ගෙවල් 20ක data වලට model තුනක්. සරල ඉරක්: train error ලක්ෂ 40, test error ලක්ෂ 42 (underfit). Degree 2 curve එකක්: train 15, test 18 (හොඳයි). Degree 15 රැලි curve එකක්: train 0.5, test 95 (overfit, train ලකුණ හොඳ වුණාට test එක විනාශයි). Degree 15 එකට Ridge (L2) දැම්මාම test error එක 25 ට අඩු වෙනවා.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import make_regression
from sklearn.linear_model import Lasso, Ridge, ElasticNet
from sklearn.model_selection import train_test_split

X, y = make_regression(n_samples=100, n_features=20, n_informative=5,
                       noise=10, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

for model in [Lasso(alpha=1.0), Ridge(alpha=1.0), ElasticNet(alpha=1.0, l1_ratio=0.5)]:
    model.fit(X_tr, y_tr)
    zeros = (model.coef_ == 0).sum()   # 0 වුණු weights ගණන
    # Train සහ test R² දෙක ළඟ නම් overfit වෙලා නෑ
    print(type(model).__name__, zeros, model.score(X_tr, y_tr), model.score(X_te, y_te))`,
      },
      keyPoints: [
        'Underfitting = train සහ test දෙකම නරකයි (bias වැඩි).',
        'Overfitting = train හොඳයි, test නරකයි (variance වැඩි).',
        'L1 / Lasso = සමහර weights 0 කරනවා. L2 / Ridge = weights පොඩි කරනවා.',
        'ElasticNet = L1 + L2. alpha වැඩි කරන තරමට penalty එක වැඩියි.',
      ],
      terms: [
        { en: 'Overfitting', si: 'Training data වල noise එකත් කටපාඩම් කරලා අලුත් data වල අසාර්ථක වෙන එක.' },
        { en: 'Underfitting', si: 'Model එක ගොඩක් සරල නිසා ඇත්ත රටාවවත් අල්ලගන්න බැරි වෙන එක.' },
        { en: 'Bias', si: 'වැරදි හෝ ගොඩක් සරල උපකල්පන නිසා එන ක්‍රමානුකූල වැරැද්ද.' },
        { en: 'Variance', si: 'Training data වෙනස් වෙද්දී model එක කොච්චර වෙනස් වෙනවද කියන එක.' },
        { en: 'Bias-Variance Tradeoff', si: 'Bias අඩු කරද්දී variance වැඩි වෙන නිසා, දෙක අතර හොඳම සමබරතාව හොයන එක.' },
        { en: 'Regularization', si: 'Weights ලොකු වෙන එකට penalty එකක් දාලා overfitting අඩු කරන ක්‍රමය.' },
        { en: 'L1 / Lasso', si: 'Absolute weights එකතුව penalty එක. සමහර weights හරියටම 0 කරනවා.' },
        { en: 'L2 / Ridge', si: 'Weights වල වර්ග එකතුව penalty එක. Weights හැමෝම පොඩි කරනවා.' },
        { en: 'ElasticNet', si: 'L1 සහ L2 penalties දෙකම මිශ්‍ර කරන regularization එක.' },
      ],
    },
    {
      id: 'gradient-descent',
      title: 'Loss Functions සහ Gradient Descent',
      lab: 'learning-rate',
      body: [
        'Model එකක් ඉගෙන ගන්න නම් ඒක කොච්චර වැරදිද කියලා මනින්න අංකයක් ඕනේ. ඒකට කියන්නේ loss function කියලා. සාමාන්‍යයෙන් loss එක කියන්නේ එක උදාහරණයක වැරැද්ද. Cost function එක කියන්නේ මුළු training data එකේම සාමාන්‍ය වැරැද්ද. (සමහර අය මේ වචන දෙක එකම තේරුමට පාවිච්චි කරනවා.) Regression වලට MSE (වැරදි වල වර්ග වල සාමාන්‍යය) පොදුයි. Classification වලට log loss (cross-entropy) පොදුයි, ඒක වැරදි උත්තරයකට ලොකු විශ්වාසයක් තිබ්බොත් ලොකු දඬුවමක් දෙනවා.',
        'Model එකක් train කරනවා කියන්නේ ඒකේ knobs (weights) ටිකක් ටික ටික වෙනස් කරලා, loss අඩුම තැනක් හොයන එක. ඒ හොයන ක්‍රමයට කියන්නේ Gradient Descent කියලා.',
        'හිතන්න loss එක කන්දක උස කියලා. අපිට ඕනේ කන්දේ පහළම තැනට යන්න. Gradient කියන්නේ කන්ද උඩට බෑවුම් වෙලා තියෙන දිශාව. Gradient Descent කියන්නේ ඒ බෑවුමට විරුද්ධ පැත්තට, ඒ කියන්නේ පහළට, පොඩි පියවරක් තියන එක. ඊට පස්සේ ආයෙත් බෑවුම බලනවා, ආයෙත් පියවරක් තියනවා. පියවරේ ප්‍රමාණයට කියන්නේ learning rate කියලා.',
        'මුළු data එකම පාවිච්චි කරලා එක පියවරක් තියනවා නම් ඒක batch gradient descent. එක උදාහරණයකින් පියවරක් නම් stochastic gradient descent (SGD). පොඩි කණ්ඩායමකින් (උදා: 32) නම් mini-batch. ChatGPT, Claude වගේ ලොකු models පවා train කරන්නේ මේ අදහසින්මයි. වෙනස එකයි: knobs දෙකක් වෙනුවට බිලියන ගණනක් තියෙනවා.',
      ],
      analogy: 'ඝන මීදුමක් තියෙන කන්දක ඇස් බැඳගෙන ඉන්නවා කියලා හිතන්න. පාර පේන්නේ නෑ. ඒත් කකුල් වලට දැනෙනවා බිම බෑවුම් වෙලා තියෙන්නේ කොයි පැත්තටද කියලා. ඔයා ඒ පැත්තට පොඩි පියවරක් තියනවා. ආයෙත් දැනගන්නවා, ආයෙත් පියවරක්. අන්තිමට ඔයා නිම්නයේ පහළටම යනවා. ලොකු පියවර (learning rate වැඩි) තිබ්බොත් නිම්නය පනිනවා. පොඩි පියවර (learning rate අඩු) නම් එහාට යන්න පැය ගණන් යනවා.',
      example: 'Model එක ගෙයක මිල ලක්ෂ 200ක් කියලා අනුමාන කරනවා, ඒත් ඇත්ත මිල ලක්ෂ 150යි. වැරැද්ද ලක්ෂ 50යි. Squared error එක 50 × 50 = 2,500. Gradient එක කියනවා "price per sqft knob එක ටිකක් අඩු කරන්න" කියලා. Knob එක පොඩ්ඩක් අඩු කළාම ඊළඟ අනුමානය ලක්ෂ 185යි. වැරැද්ද 35යි, squared error 1,225ට අඩු වුණා. මෙහෙම සිය ගණනක් පාරක් කළාම වැරැද්ද ගොඩක් අඩු වෙනවා.',
      code: {
        lang: 'python',
        src: `import numpy as np

# Data: sqft (දහස් වලින්) සහ මිල (ලක්ෂ). ඇත්ත සම්බන්ධය: මිල = 150 * sqft
x = np.array([1.0, 1.5, 2.0, 2.5])
y = np.array([150, 225, 300, 375])

w = 0.0           # knob එක (weight)
lr = 0.1          # learning rate = පියවරේ ප්‍රමාණය
for step in range(50):
    pred = w * x
    loss = np.mean((pred - y) ** 2)          # MSE loss
    grad = np.mean(2 * (pred - y) * x)       # බෑවුම (gradient)
    w = w - lr * grad                        # බෑවුමට විරුද්ධව පියවරක්
print(round(w, 2), round(loss, 4))           # w ආසන්න වශයෙන් 150`,
      },
      keyPoints: [
        'Loss / cost = model එක කොච්චර වැරදිද කියන අංකය.',
        'Gradient = loss එක වැඩි වෙන දිශාව. අපි යන්නේ ඒකට විරුද්ධ පැත්තට.',
        'Learning rate = එක පියවරක ප්‍රමාණය.',
        'හැම neural network එකක්ම වගේ ඉගෙන ගන්නේ මේ ක්‍රමයට.',
      ],
      terms: [
        { en: 'Loss Function', si: 'එක උදාහරණයක prediction එක කොච්චර වැරදිද කියලා මනින function එක.' },
        { en: 'Cost Function', si: 'මුළු dataset එකේම සාමාන්‍ය loss එක.' },
        { en: 'Gradient', si: 'Loss එක වේගයෙන්ම වැඩි වෙන දිශාව සහ බෑවුමේ ප්‍රමාණය.' },
        { en: 'Learning Rate', si: 'එක පියවරක් කොච්චර ලොකුද. ගොඩක් පොඩි නම් හෙමින්, ගොඩක් ලොකු නම් පහළට යන්නේ නැතුව පනිනවා.' },
        { en: 'Local Minimum', si: 'පොඩි වළක්. අවට පහළම තැන, ඒත් මුළු කන්දේම පහළම තැන නෙවෙයි.' },
        { en: 'SGD / Mini-batch', si: 'එක උදාහරණයකින් (SGD) හෝ පොඩි කණ්ඩායමකින් (mini-batch) gradient ගණනය කරන එක.' },
      ],
    },
    {
      id: 'regression-models',
      title: 'Linear Regression, Polynomial Regression සහ SVR',
      lab: 'fit-line',
      body: [
        'Linear regression කියන්නේ data වලට හොඳටම ගැළපෙන සරල රේඛාවක් අඳින එක. Feature එකක් තියෙනවා නම්: මිල = w × size + b. මෙතන w (weight / slope) කියන්නේ size එක 1කින් වැඩි වෙද්දී මිල කොච්චර වැඩි වෙනවද කියන එක. b (bias / intercept) කියන්නේ ආරම්භක අගය. Features ගොඩක් තියෙනවා නම් හැම feature එකකටම තමන්ගේම w එකක් තියෙනවා.',
        '"හොඳටම ගැළපෙන" කියන්නේ මොකක්ද? හැම point එකකම ඇත්ත අගය සහ රේඛාවේ අගය අතර වැරැද්ද (residual) ගන්නවා. ඒ වැරදි වල වර්ග එකතුව අඩුම වෙන w සහ b හොයනවා. ඒකට කියන්නේ least squares (ordinary least squares) කියලා. Coefficients බැලුවාම model එක තේරුම් ගන්න ලේසි නිසා linear regression තවමත් ගොඩක් පාවිච්චි වෙනවා.',
        'Data වල සම්බන්ධය curve එකක් නම් polynomial regression පාවිච්චි කරනවා. size², size³ වගේ අලුත් features එකතු කරලා ඒ උඩ linear regression එකම කරනවා. Weights අනුව තවමත් linear, ඒත් input එකට සාපේක්ෂව curve එකක්. Degree එක ගොඩක් වැඩි කළොත් overfit වෙනවා.',
        'SVR (Support Vector Regression) වලදී රේඛාව වටේ epsilon පළලින් යුත් "නළයක්" (tube) හිතනවා. ඒ නළය ඇතුළේ වැටෙන වැරදි නොසලකා හරිනවා. නළයෙන් එළියට යන points වලට විතරක් දඬුවම් දෙනවා. Kernels පාවිච්චි කරලා non-linear සම්බන්ධතාත් model කරන්න පුළුවන්. Features scale කරන එක SVR වලට වැදගත්.',
      ],
      analogy: 'Three-wheeler ගාස්තුව හිතන්න. පළවෙනි කිලෝමීටරයට Rs. 100 (b, intercept). ඊට පස්සේ හැම කිලෝමීටරයකටම Rs. 80ක් (w, slope). ගාස්තුව = 80 × km + 100. Linear regression කරන්නේ පරණ trips ගොඩක ගාස්තු බලලා මේ 80 සහ 100 හොයාගන්න එක.',
      example: 'ගෙවල් 4ක්: 1,000 sqft = ලක්ෂ 200, 1,500 = 250, 2,000 = 300, 2,500 = 350. Linear regression හොයාගන්නවා: මිල = 0.1 × sqft + 100. ඒ කියන්නේ හැම අමතර sqft 100කටම ලක්ෂ 10ක් වැඩියි, පදනම ලක්ෂ 100යි. 1,800 sqft ගෙයක් = 0.1 × 1800 + 100 = ලක්ෂ 280.',
      code: {
        lang: 'python',
        src: `import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.pipeline import make_pipeline
from sklearn.svm import SVR

X = np.array([[1000], [1500], [2000], [2500]])
y = np.array([200, 250, 300, 350])

lin = LinearRegression().fit(X, y)
print(lin.coef_, lin.intercept_)            # slope (w) සහ intercept (b)

# Polynomial: sqft² feature එකත් එකතු කරලා linear regression
poly = make_pipeline(PolynomialFeatures(degree=2), LinearRegression()).fit(X, y)
# SVR: scale කරලා RBF kernel එකෙන්
svr = make_pipeline(StandardScaler(), SVR(kernel="rbf", C=100, epsilon=5)).fit(X, y)
print(lin.predict([[1800]]), poly.predict([[1800]]), svr.predict([[1800]]))`,
      },
      keyPoints: [
        'Linear regression = හොඳටම ගැළපෙන රේඛාව (w සහ b).',
        'Least squares = වැරදි වල වර්ග එකතුව අඩුම කරනවා.',
        'Polynomial regression = curve, ඒත් degree වැඩි නම් overfit.',
        'SVR = epsilon නළයෙන් එළියට යන වැරදි වලට විතරක් දඬුවම්.',
      ],
      terms: [
        { en: 'Linear Regression', si: 'Features සහ target අතර සරල රේඛීය සම්බන්ධයක් ඉගෙන ගන්න model එක.' },
        { en: 'Slope / Coefficient', si: 'Feature එක 1කින් වැඩි වෙද්දී prediction එක වෙනස් වෙන ප්‍රමාණය.' },
        { en: 'Intercept', si: 'හැම feature එකක්ම 0 වෙද්දී prediction එක.' },
        { en: 'Residual', si: 'ඇත්ත අගය සහ prediction එක අතර වෙනස.' },
        { en: 'Polynomial Regression', si: 'x², x³ වගේ features එකතු කරලා curve එකක් fit කරන එක.' },
        { en: 'SVR', si: 'Support Vector Regression. Epsilon නළයක් ඇතුළේ වැරදි නොසලකා හරින regression එක.' },
      ],
    },
    {
      id: 'classification-models',
      title: 'Classification Models',
      body: [
        'Logistic regression නමේ "regression" තිබුණත් ඇත්තටම classification model එකක්. Features වල weighted එකතුව sigmoid function එකකට දාලා 0 සිට 1 අතර probability එකක් දෙනවා. උදා: "මේ email එක spam වෙන්න සම්භාවිතාව 0.92". සාමාන්‍යයෙන් 0.5ට වඩා වැඩි නම් spam කියලා තීරණය කරනවා. KNN (K-Nearest Neighbors) කියන්නේ අලුත් point එකකට ළඟම තියෙන k (උදා: 5) දෙනා බලලා, බහුතරය අයිති class එක දෙන එක. Training එකක් ඇත්තටම නෑ, data මතක තියාගන්නවා විතරයි. Scaling අත්‍යවශ්‍යයි.',
        'Naive Bayes, Bayes theorem එක පාවිච්චි කරලා probability ගණනය කරනවා. "Naive" කියන්නේ class එක දන්නවා නම් හැම feature එකක්ම අනිත් ඒවායින් ස්වාධීනයි කියලා සරල උපකල්පනයක් කරන නිසා. ඇත්තටම එහෙම නොවුණත් text classification (spam filters) වලට පුදුම විදිහට හොඳට, වේගයෙන් වැඩ කරනවා.',
        'SVM (Support Vector Machine) classes දෙක අතර පුළුල්ම "පාර" (margin) තියෙන විදිහට බෙදන රේඛාව (hyperplane) හොයනවා. Margin එකට ළඟම තියෙන points වලට support vectors කියනවා. Data රේඛාවකින් බෙදන්න බැරි නම් kernel trick එක පාවිච්චි කරනවා: data ඉහළ මාන අවකාශයකට ගෙනිච්චා වගේ ගණනය කරලා එතන බෙදනවා. පොදු kernels: linear, polynomial, RBF.',
        'Decision tree එකක් කියන්නේ ඔව් / නැහැ ප්‍රශ්න දාමයක්. "ආදායම Rs. 100,000ට වැඩිද?" "වයස 30ට අඩුද?" හැම පියවරකම classes හොඳටම වෙන් කරන ප්‍රශ්නය තෝරනවා. ඒක මනින්නේ Gini impurity හෝ entropy වලින්. තේරුම් ගන්න ලේසියි, scaling ඕනේ නෑ. ඒත් ගැඹුරු tree එකක් ලේසියෙන් overfit වෙනවා, ඒ නිසා max_depth වගේ සීමා දානවා.',
      ],
      analogy: 'අලුත් ගමකට ගියාම "මේ කෙනා cricket ද football ද කැමති?" කියලා අනුමාන කරන්න. KNN = එයාගේ ළඟම යාළුවෝ 5 දෙනා බලනවා. Decision tree = ප්‍රශ්න අහනවා: "ගම කොහෙද? වයස කීයද?" Naive Bayes = හැම ලක්ෂණයක්ම වෙන වෙනම probability එකක් දෙනවා කියලා හිතලා ගුණ කරනවා. SVM = cricket පිටිය සහ football පිටිය අතර පුළුල්ම වැට ගහනවා.',
      example: 'ණය අයදුම්කරුවෙක්: ආදායම Rs. 85,000, වයස 28, පරණ ණය 1. Decision tree එක: "ආදායම > 75,000?" ඔව්. "පරණ ණය > 2?" නෑ. ඒ නිසා "අනුමතයි". Logistic regression එකෙන් ගෙවන්න probability 0.78 කියලා එනවා. 0.5ට වැඩි නිසා අනුමතයි. KNN (k=5) එකේ ළඟම 5 දෙනාගෙන් 4 දෙනෙක් ණය ගෙව්වා, ඒ නිසා අනුමතයි.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import GaussianNB
from sklearn.svm import SVC
from sklearn.tree import DecisionTreeClassifier

X, y = load_iris(return_X_y=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, stratify=y, random_state=0)
models = [LogisticRegression(max_iter=500), KNeighborsClassifier(n_neighbors=5),
          GaussianNB(), SVC(kernel="rbf"), DecisionTreeClassifier(max_depth=3)]
for m in models:
    m.fit(X_tr, y_tr)                           # හැම model එකම එකම විදිහට train
    print(type(m).__name__, m.score(X_te, y_te))  # test accuracy`,
      },
      keyPoints: [
        'Logistic regression = probability දෙන classification model එක.',
        'KNN = ළඟම අසල්වැසියන්ගේ ඡන්දය. Scaling අත්‍යවශ්‍යයි.',
        'Naive Bayes = වේගවත්, text වලට හොඳයි.',
        'SVM = පුළුල්ම margin එක. Kernels = non-linear data වලට.',
        'Decision tree = ඔව් / නැහැ ප්‍රශ්න. තේරුම් ගන්න ලේසි, overfit වෙන්න ලේසි.',
      ],
      terms: [
        { en: 'Logistic Regression', si: 'Sigmoid එකෙන් 0-1 probability එකක් දෙන classification model එක.' },
        { en: 'Sigmoid', si: 'ඕනෙම අංකයක් 0 සහ 1 අතරට හකුළන S හැඩයේ function එක.' },
        { en: 'KNN', si: 'K-Nearest Neighbors. ළඟම k points වල බහුතර class එක දෙන model එක.' },
        { en: 'Naive Bayes', si: 'Features ස්වාධීනයි කියලා උපකල්පනය කරලා Bayes theorem එකෙන් class probability ගණනය කරන model එක.' },
        { en: 'SVM', si: 'Support Vector Machine. Classes අතර උපරිම margin එකක් තියෙන hyperplane එක හොයන model එක.' },
        { en: 'Kernel Trick', si: 'Data ඉහළ මාන අවකාශයකට ගෙනිච්චා වගේ ගණනය කරලා non-linear බෙදීම් කරන ක්‍රමය (linear, polynomial, RBF).' },
        { en: 'Decision Tree', si: 'ඔව් / නැහැ ප්‍රශ්න ගසකින් තීරණයකට එන model එක.' },
        { en: 'Gini / Entropy', si: 'Node එකක classes කොච්චර මිශ්‍රද කියලා මනින මිනුම්. අඩු නම් පිරිසිදුයි.' },
      ],
    },
    {
      id: 'ensembles',
      title: 'Ensemble Methods: Bagging, Boosting, Stacking',
      body: [
        'Ensemble එකක් කියන්නේ models ගොඩක් එකතු කරලා එක තීරණයක් ගන්න එක. එක model එකකට වඩා කණ්ඩායමක් සාමාන්‍යයෙන් වඩා හොඳයි. Bagging (Bootstrap Aggregating) වලදී training data එකෙන් replacement සහිතව අහඹු samples (bootstrap samples) ගොඩක් අරන්, හැම එකකටම වෙනම model එකක් train කරනවා. අන්තිමට ඡන්දයෙන් හෝ සාමාන්‍යයෙන් තීරණය කරනවා. Bagging ප්‍රධාන වශයෙන් variance අඩු කරනවා.',
        'Random Forest කියන්නේ decision trees වලට bagging කරන එක, ඒත් එක අමතර දෙයක් එක්ක: හැම split එකකදීම features වලින් අහඹු කොටසක් විතරක් බලනවා. ඒ නිසා trees එකිනෙකට වෙනස් වෙනවා, කණ්ඩායමේ තීරණය ශක්තිමත් වෙනවා. Tabular data වලට ගොඩක් හොඳ, පටන් ගන්න ලේසි model එකක්.',
        'Boosting වලදී models එකකට පස්සේ එකක් (sequential) train කරනවා. හැම අලුත් model එකක්ම කලින් ඒවා කරපු වැරදි නිවැරදි කරන්න උත්සාහ කරනවා. Boosting ප්‍රධාන වශයෙන් bias අඩු කරනවා. AdaBoost වැරදුණු samples වල බර වැඩි කරලා ඊළඟ model එක ඒවට අවධානය දෙන්න සලස්වනවා. Gradient Boosting හැම අලුත් tree එකක්ම කලින් prediction වල residuals (loss එකේ negative gradient) වලට fit කරනවා. XGBoost, LightGBM, CatBoost කියන්නේ gradient boosting වල වේගවත්, optimized libraries. XGBoost regularization එකතු කරනවා. LightGBM histogram ක්‍රම සහ leaf-wise growth වලින් ලොකු data වලට ගොඩක් වේගවත්. CatBoost categorical features තනියම හොඳට හසුරුවනවා. Tabular data competitions ගොඩක් දිනන්නේ මේවා.',
        'Voting ensemble එකකදී විවිධ models (උදා: logistic regression, SVM, random forest) ගොඩක predictions එකතු කරනවා. Hard voting = බහුතර ඡන්දය. Soft voting = probabilities වල සාමාන්‍යය. Stacking වලදී base models වල predictions input විදිහට අරන් meta-model එකක් train කරනවා, ඒ meta-model එක ඉගෙන ගන්නවා කාව කොච්චර විශ්වාස කරන්න ඕනෙද කියලා.',
      ],
      analogy: 'Bagging / Random Forest = ගමේ අය 100 දෙනෙක්ගෙන් වෙන වෙනම අහලා බහුතරය ගන්නවා වගේ. Boosting = cricket coach කෙනෙක් හැම practice එකකටම පස්සේ කලින් දවසේ වැරදුණු shots වලට විතරක් අවධානය දෙනවා වගේ. Stacking = විශේෂඥ වෛද්‍යවරුන් කිහිප දෙනෙක්ගේ මත අහලා, ප්‍රධාන වෛද්‍යවරයා කාගේ මතයට කොච්චර බරක් දෙනවද කියලා අවසාන තීරණය ගන්නවා.',
      example: 'Customer churn අනුමාන කරන්න: එක decision tree එකක් = test accuracy 78%. Random Forest (trees 300) = 85%. XGBoost = 87%. Logistic regression, Random Forest, XGBoost තුනේ soft voting එකක් = 88%. Trees 300ක Random Forest එකේ එක tree එකක් වැරදුණත්, අනිත් trees බහුතරය හරි නම් අවසාන උත්තරය හරි.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import cross_val_score
from sklearn.ensemble import (RandomForestClassifier, AdaBoostClassifier,
    GradientBoostingClassifier, VotingClassifier, StackingClassifier)
from sklearn.linear_model import LogisticRegression

X, y = load_breast_cancer(return_X_y=True)
rf = RandomForestClassifier(n_estimators=300, random_state=0)  # bagging + අහඹු features
ada = AdaBoostClassifier(random_state=0)                     # වැරදි වලට බර වැඩි කරනවා
gb = GradientBoostingClassifier(random_state=0)              # residuals වලට fit
vote = VotingClassifier([("rf", rf), ("gb", gb)], voting="soft")
stack = StackingClassifier([("rf", rf), ("ada", ada)],
                           final_estimator=LogisticRegression(max_iter=1000))  # meta-model
for m in [rf, ada, gb, vote, stack]:
    print(type(m).__name__, cross_val_score(m, X, y, cv=5).mean())
# XGBoost / LightGBM / CatBoost: pip install කරලා XGBClassifier වගේ එකම විදිහට`,
      },
      keyPoints: [
        'Bagging = parallel models, variance අඩු කරනවා.',
        'Random Forest = bagging + අහඹු feature subsets.',
        'Boosting = sequential, කලින් වැරදි නිවැරදි කරනවා, bias අඩු කරනවා.',
        'XGBoost / LightGBM / CatBoost = tabular data වලට ගොඩක් ප්‍රබලයි.',
        'Voting = ඡන්දය. Stacking = meta-model එකක් ඉගෙන ගන්නවා.',
      ],
      terms: [
        { en: 'Bagging', si: 'Bootstrap samples වලින් models ගොඩක් parallel train කරලා ප්‍රතිඵල එකතු කරන එක.' },
        { en: 'Random Forest', si: 'අහඹු samples සහ අහඹු features පාවිච්චි කරන decision trees කැලයක්.' },
        { en: 'Boosting', si: 'කලින් models වල වැරදි නිවැරදි කරන්න models එකින් එක train කරන එක.' },
        { en: 'AdaBoost', si: 'වැරදුණු samples වල බර වැඩි කරමින් දුර්වල models එකතු කරන boosting ක්‍රමය.' },
        { en: 'Gradient Boosting', si: 'හැම අලුත් tree එකක්ම කලින් prediction වල residuals වලට fit කරන boosting ක්‍රමය.' },
        { en: 'XGBoost', si: 'Regularization සහිත, වේගවත් gradient boosting library එක.' },
        { en: 'LightGBM', si: 'Histogram සහ leaf-wise growth පාවිච්චි කරන, ලොකු data වලට වේගවත් gradient boosting library එක.' },
        { en: 'CatBoost', si: 'Categorical features හොඳින් හසුරුවන gradient boosting library එක.' },
        { en: 'Voting', si: 'Models කිහිපයක predictions ඡන්දයෙන් (hard) හෝ probability සාමාන්‍යයෙන් (soft) එකතු කරන එක.' },
        { en: 'Stacking', si: 'Base models වල outputs උඩ meta-model එකක් train කරන ensemble ක්‍රමය.' },
      ],
    },
    {
      id: 'clustering',
      title: 'Clustering: K-Means, Hierarchical, DBSCAN, GMM',
      lab: 'kmeans',
      body: [
        'Clustering කියන්නේ labels නැතුව, එකිනෙකට සමාන data points කණ්ඩායම් (clusters) වලට එකතු කරන unsupervised ක්‍රමය. Customer segmentation, ලේඛන කාණ්ඩ කිරීම වගේ දේවල් වලට පාවිච්චි කරනවා.',
        'K-Means වලදී මුලින්ම clusters ගණන k තෝරනවා. ඊට පස්සේ: (1) අහඹු ලෙස මධ්‍ය ලක්ෂ්‍ය (centroids) k ක් තියනවා. (2) හැම point එකක්ම ළඟම centroid එකට අයිති කරනවා. (3) හැම centroid එකක්ම තමන්ට අයිති points වල මැදට (සාමාන්‍යයට) ගෙනියනවා. (4) වෙනසක් නැති වෙනකම් 2 සහ 3 නැවත කරනවා. හොඳ k එකක් තෝරන්න elbow method එක හෝ silhouette score එක පාවිච්චි කරනවා. K-Means රවුම් හැඩ clusters වලට හොඳයි, scaling අවශ්‍යයි.',
        'Hierarchical (agglomerative) clustering වලදී හැම point එකක්ම තනි cluster එකක් විදිහට පටන් අරන්, ළඟම clusters දෙක නැවත නැවත එකතු කරනවා. ප්‍රතිඵලය dendrogram කියන ගස් රූපයක්. ඕනේ උසකින් කපලා clusters ගණන තීරණය කරන්න පුළුවන්. DBSCAN වලදී ඝනත්වය (density) පාවිච්චි කරනවා. eps දුර ඇතුළේ min_samples ප්‍රමාණයක් points තියෙන තැන් cluster එකක් වෙනවා. k ඉස්සරහින් දෙන්න ඕනේ නෑ, ඕනෙම හැඩයක clusters හොයනවා, ඈතින් තනිවම තියෙන points "noise" කියලා ලකුණු කරනවා.',
        'GMM (Gaussian Mixture Model) හිතන්නේ data එක bell curves (Gaussian distributions) කිහිපයක මිශ්‍රණයක් කියලා. K-Means වගේ "මේ point එක cluster 2" කියලා දැඩි තීරණයක් වෙනුවට "cluster 1ට 70%, cluster 2ට 30%" කියලා soft probabilities දෙනවා. Ellipse හැඩ clusters වලටත් ගැළපෙනවා. EM algorithm එකෙන් train කරනවා.',
      ],
      analogy: 'කොළඹ පිටකොටුවේ බස් නැවතුම් 3ක් දාන්න ඕනේ, මගීන්ට ළඟම වෙන විදිහට. K-Means = නැවතුම් 3ක් අහඹු තැන් වල දාලා, හැම මගියාම ළඟම නැවතුමට යවලා, ඊට පස්සේ නැවතුම ඒ මගීන්ගේ මැදට ගෙනියනවා. නැවත නැවත. DBSCAN = සෙනඟ ගොඩ ගැහිලා ඉන්න තැන් හොයනවා, තනිවම ඉන්න කෙනා "noise".',
      example: 'Cargills customers 2,000ක මාසික වියදම සහ ගමන් ගණන. K-Means (k=3) එකෙන් කණ්ඩායම් 3ක්: (1) සතියකට පාරක් ඇවිත් Rs. 25,000 වියදම් කරන පවුල්. (2) දවසටම ඇවිත් Rs. 6,000 වියදම් කරන තනි අය. (3) මාසෙකට පාරක් විතරක් Rs. 3,000. Marketing team එක හැම කණ්ඩායමකටම වෙනම offers යවනවා.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import make_blobs
from sklearn.preprocessing import StandardScaler
from sklearn.cluster import KMeans, AgglomerativeClustering, DBSCAN
from sklearn.mixture import GaussianMixture
from sklearn.metrics import silhouette_score

X, _ = make_blobs(n_samples=300, centers=3, random_state=0)
X = StandardScaler().fit_transform(X)              # scale කරනවා

km = KMeans(n_clusters=3, n_init=10, random_state=0).fit(X)
print(km.cluster_centers_, silhouette_score(X, km.labels_))  # centroids සහ ගුණාත්මකභාවය
agg = AgglomerativeClustering(n_clusters=3).fit_predict(X)   # hierarchical
db = DBSCAN(eps=0.3, min_samples=5).fit_predict(X)  # -1 = noise points
gmm = GaussianMixture(n_components=3, random_state=0).fit(X)
print(gmm.predict_proba(X[:2]))                     # soft probabilities`,
      },
      keyPoints: [
        'Clustering = labels නැතුව සමාන ඒවා එකට එකතු කරනවා.',
        'K-Means = k ඉස්සරහින් දෙනවා, centroids මැදට යනවා.',
        'Hierarchical = dendrogram එකක්, ඕනේ තැනකින් කපනවා.',
        'DBSCAN = density, ඕනෙම හැඩයක්, noise හොයනවා.',
        'GMM = soft probabilities, ellipse හැඩ.',
      ],
      terms: [
        { en: 'K-Means', si: 'Points ළඟම centroid එකට අයිති කරමින්, centroids නැවත නැවත මැදට ගෙනියන clustering ක්‍රමය.' },
        { en: 'Centroid', si: 'Cluster එකක මධ්‍ය ලක්ෂ්‍යය (points වල සාමාන්‍යය).' },
        { en: 'Elbow Method', si: 'k වෙනස් කරද්දී error එක අඩු වීම මන්දගාමී වෙන "වැලමිට" තැනින් k තෝරන ක්‍රමය.' },
        { en: 'Hierarchical Clustering', si: 'Clusters පියවරෙන් පියවර එකතු කරලා dendrogram එකක් හදන ක්‍රමය.' },
        { en: 'DBSCAN', si: 'Density-based clustering. ඝන ප්‍රදේශ clusters, තනි points noise.' },
        { en: 'GMM', si: 'Gaussian Mixture Model. Data bell curves කිහිපයක මිශ්‍රණයක් ලෙස model කරලා soft cluster probabilities දෙනවා.' },
        { en: 'Silhouette Score', si: 'Clusters කොච්චර හොඳට වෙන් වෙලාද කියන -1 සිට 1 දක්වා මිනුම.' },
      ],
    },
    {
      id: 'dimensionality-reduction',
      title: 'Dimensionality Reduction: PCA, t-SNE, UMAP, LDA',
      body: [
        'Dimensions කියන්නේ features ගණන. Features 100ක් තිබුණොත් data එක මාන 100ක අවකාශයක. මිනිස්සුන්ට පේන්නේ මාන 2 හෝ 3 විතරයි. Features ගොඩක් තියෙද්දී models slow වෙනවා, overfit වෙනවා (curse of dimensionality). Dimensionality reduction කියන්නේ වැදගත්ම තොරතුරු ටික තියාගෙන features ගණන අඩු කරන එක.',
        'PCA (Principal Component Analysis) කියන්නේ data එකේ වැඩිම පැතිරීම (variance) තියෙන දිශාවන් හොයන linear ක්‍රමයක්. පළවෙනි principal component එක වැඩිම variance තියෙන දිශාව. දෙවෙනි එක ඊළඟට වැඩිම, පළවෙනි එකට සෘජුකෝණීව. ගොඩක් වෙලාවට components ටිකකින් මුළු variance එකෙන් 90%ක් විතර අල්ලගන්න පුළුවන්. PCA කරන්න කලින් scale කරන්න ඕනේ.',
        't-SNE සහ UMAP කියන්නේ non-linear ක්‍රම. ප්‍රධාන වශයෙන් ඉහළ මාන data 2D චිත්‍රයකින් visualize කරන්න පාවිච්චි කරනවා. දෙකම ළඟ තිබුණු points 2D එකේත් ළඟ තියෙන්න බලනවා (local structure). t-SNE එකේ clusters අතර දුර සහ cluster වල ප්‍රමාණය ගොඩක් විශ්වාස කරන්න බෑ. UMAP සාමාන්‍යයෙන් වේගවත්, ලොකු ව්‍යුහය (global structure) ටිකක් හොඳට තියාගන්නවා.',
        'LDA (Linear Discriminant Analysis) PCA වගේම linear, ඒත් supervised. PCA labels ගණන් ගන්නේ නෑ, variance විතරයි බලන්නේ. LDA labels පාවිච්චි කරලා classes හොඳටම වෙන් වෙන දිශාවන් හොයනවා. LDA වලින් ලැබෙන උපරිම components ගණන classes ගණන අඩු 1යි. (Text වල topic modeling වලට පාවිච්චි කරන Latent Dirichlet Allocation කියන්නේ වෙනම දෙයක්.)',
      ],
      analogy: 'ගෙයක් ඉදිරියේ ඉඳන් ඡායාරූපයක් ගන්නවා. 3D ගෙය 2D පින්තූරයකට එනවා. හොඳ කෝණයකින් ගත්තොත් (PCA) ගෙදර හැඩය හොඳට පේනවා. වහලය උඩ ඉඳන් ගත්තොත් වහලය විතරයි පේන්නේ. PCA කරන්නේ වැඩිම තොරතුරු පේන කෝණය හොයන එක.',
      example: 'අත් අකුරු ඉලක්කම් පින්තූර (8×8 pixels = features 64). PCA components 10කින් variance එකෙන් ආසන්න වශයෙන් 70%ක් විතර තියාගන්නවා. ඒකෙන් model එක ගොඩක් වේගවත්. t-SNE එකෙන් 2D කරලා plot කළාම 0 සිට 9 දක්වා ඉලක්කම් වෙන වෙනම කණ්ඩායම් 10ක් විදිහට පේනවා.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import load_digits
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
from sklearn.manifold import TSNE
from sklearn.discriminant_analysis import LinearDiscriminantAnalysis

X, y = load_digits(return_X_y=True)          # features 64
X = StandardScaler().fit_transform(X)

pca = PCA(n_components=10).fit(X)
print(pca.explained_variance_ratio_.sum())    # components 10කින් අල්ලගත්තු variance
X_tsne = TSNE(n_components=2, random_state=0).fit_transform(X)  # 2D visualize
X_lda = LinearDiscriminantAnalysis(n_components=2).fit_transform(X, y)  # labels පාවිච්චි කරනවා
# UMAP: pip install umap-learn  ->  umap.UMAP(n_components=2).fit_transform(X)`,
      },
      keyPoints: [
        'Features ගොඩක් = slow, overfit (curse of dimensionality).',
        'PCA = linear, unsupervised, වැඩිම variance දිශාවන්.',
        't-SNE, UMAP = non-linear, ප්‍රධාන වශයෙන් visualization.',
        'LDA = linear, supervised, classes වෙන් කරන දිශාවන්.',
      ],
      terms: [
        { en: 'Curse of Dimensionality', si: 'Features ගණන වැඩි වෙද්දී data විරල වෙලා models වලට ඉගෙන ගන්න අමාරු වෙන එක.' },
        { en: 'PCA', si: 'Principal Component Analysis. වැඩිම variance තියෙන දිශාවන්ට data ප්‍රක්ෂේපණය කරන linear ක්‍රමය.' },
        { en: 'Explained Variance', si: 'Component එකකින් මුළු variance එකෙන් කොච්චර ප්‍රතිශතයක් අල්ලගන්නවද කියන එක.' },
        { en: 't-SNE', si: 'ළඟ points ළඟම තියාගෙන data 2D/3D කරන non-linear visualization ක්‍රමය.' },
        { en: 'UMAP', si: 't-SNE වගේ, සාමාන්‍යයෙන් වේගවත් සහ global ව්‍යුහය වඩා හොඳින් තියාගන්න non-linear ක්‍රමය.' },
        { en: 'LDA', si: 'Linear Discriminant Analysis. Labels පාවිච්චි කරලා classes හොඳටම වෙන් වෙන දිශාවන් හොයන ක්‍රමය.' },
      ],
    },
    {
      id: 'anomaly-association',
      title: 'Anomaly Detection සහ Association Rules',
      body: [
        'Anomaly detection කියන්නේ සාමාන්‍ය රටාවට නොගැළපෙන අමුතු data points හොයන එක. Credit card වංචා, යන්ත්‍ර කැඩීමට කලින් එන අමුතු sensor readings, network එකට අනවසර ඇතුළු වීම් වගේ දේවල් වලට පාවිච්චි කරනවා. ගොඩක් වෙලාවට anomalies ගොඩක් දුර්ලභයි, labels නෑ, ඒ නිසා unsupervised ක්‍රම පාවිච්චි කරනවා.',
        'Isolation Forest එකේ අදහස සරලයි: අමුතු points "හුදකලා කරන්න" ලේසියි. Data එක අහඹු ලෙස නැවත නැවත කපනවා (random splits). සාමාන්‍ය point එකක් තනි කරන්න කැපීම් ගොඩක් ඕනේ, මොකද ඒක සෙනඟ මැද. Anomaly එකක් කැපීම් කිහිපයකින්ම තනි වෙනවා. අඩු කැපීම් ගණනක් = anomaly score එක වැඩියි. One-Class SVM සාමාන්‍ය data වටේ මායිමක් ඉගෙන ගන්නවා. ඒ මායිමෙන් එළියට වැටෙන points anomalies.',
        'Association rule mining කියන්නේ "X ගත්තොත් Y ත් ගන්නවා" වගේ නීති transactions වලින් හොයන එක. Market basket analysis කියලත් කියනවා. Support = items ඒ එකතුව තියෙන transactions ප්‍රතිශතය. Confidence = X ගත්ත අයගෙන් Y ත් ගත්ත ප්‍රතිශතය. Lift = Confidence ÷ Y තනියම ගන්න ප්‍රතිශතය. Lift 1ට වැඩි නම් X සහ Y එකට යන ප්‍රවණතාවක් ඇත්තටම තියෙනවා.',
        'Apriori algorithm එක මේ නීති හොයන සම්භාව්‍ය ක්‍රමය. ඒකේ ප්‍රධාන අදහස: item එකතුවක් දුර්ලභ නම් (support අඩු නම්), ඒක ඇතුළත් ලොකු එකතුවකුත් දුර්ලභයි. ඒ නිසා ඒවා පරීක්ෂා නොකර අතහරිනවා, වැඩේ ගොඩක් ඉක්මන් වෙනවා.',
      ],
      analogy: 'Isolation Forest = පන්තියක ළමයි 40න් වෙනස්ම කෙනා හොයනවා. "උස 6ft ට වැඩිද?" කියලා ඇහුවම එකපාරටම අර උසම ළමයා තනි වෙනවා. සාමාන්‍ය ළමයෙක් තනි කරන්න ප්‍රශ්න ගොඩක් ඕනේ. Association rules = කඩේ මුදලාලි දන්නවා පාන් ගන්න අය ගොඩක් වෙලාවට පොල් සම්බෝලයට ලුණු මිරිසුත් ගන්නවා කියලා.',
      example: 'Supermarket බිල්පත් 1,000ක්. පාන් තියෙන බිල් 200 (20%). පාන් සහ බටර් දෙකම 80 (support = 8%). Confidence(පාන් → බටර්) = 80 / 200 = 40%. බටර් තනියම ගන්නේ බිල් 100කින් (10%). Lift = 40% ÷ 10% = 4. ඒ කියන්නේ පාන් ගන්න කෙනෙක් බටර් ගන්න ඉඩ සාමාන්‍ය කෙනෙක්ට වඩා 4 ගුණයක් වැඩියි. බටර් පාන් ළඟ තියන්න!',
      code: {
        lang: 'python',
        src: `import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.svm import OneClassSVM

# Transactions (Rs. දහස්): සාමාන්‍ය ඒවා සහ අමුතු 2ක්
X = np.array([[2], [3], [2.5], [3.2], [2.8], [50], [0.01]])

iso = IsolationForest(contamination=0.3, random_state=0).fit(X)
print(iso.predict(X))         # 1 = සාමාන්‍ය, -1 = anomaly
oc = OneClassSVM(nu=0.3, gamma="scale").fit(X)
print(oc.predict(X))

# Apriori: pip install mlxtend
# from mlxtend.frequent_patterns import apriori, association_rules
# items = apriori(basket_df, min_support=0.05, use_colnames=True)
# rules = association_rules(items, metric="lift", min_threshold=1.0)`,
      },
      keyPoints: [
        'Anomaly detection = දුර්ලභ, අමුතු points හොයනවා.',
        'Isolation Forest = අමුතු points කැපීම් ටිකකින් තනි වෙනවා.',
        'One-Class SVM = සාමාන්‍ය data වටේ මායිමක්.',
        'Association rules: support, confidence, lift. Apriori එකෙන් හොයනවා.',
      ],
      terms: [
        { en: 'Anomaly Detection', si: 'සාමාන්‍ය රටාවට නොගැළපෙන දුර්ලභ points හොයන එක.' },
        { en: 'Isolation Forest', si: 'අහඹු splits වලින් ඉක්මනින් හුදකලා වෙන points anomalies ලෙස හඳුනාගන්න ක්‍රමය.' },
        { en: 'One-Class SVM', si: 'සාමාන්‍ය data විතරක් බලලා ඒ වටේ මායිමක් ඉගෙන ගෙන, එළියට වැටෙන ඒවා anomalies කියන model එක.' },
        { en: 'Association Rules', si: '"X ගත්තොත් Y ත්" වගේ transactions වල නීති.' },
        { en: 'Apriori', si: 'දුර්ලභ item එකතු අතහරිමින් නිතර එකට එන items හොයන algorithm එක.' },
        { en: 'Support / Confidence / Lift', si: 'Rule එකක් කොච්චර පොදුද, කොච්චර විශ්වාසදායකද, අහම්බයට වඩා කොච්චර ශක්තිමත්ද කියන මිනුම්.' },
      ],
    },
    {
      id: 'metrics',
      title: 'Evaluation Metrics',
      lab: 'confusion-matrix',
      body: [
        'Regression metrics: MAE (Mean Absolute Error) = වැරදි වල absolute අගයන්ගේ සාමාන්‍යය. තේරුම් ගන්න ලේසි, "සාමාන්‍යයෙන් ලක්ෂ 3ක් වරදිනවා". MSE (Mean Squared Error) = වැරදි වල වර්ග වල සාමාන්‍යය. ලොකු වැරදි වලට ලොකු දඬුවමක්. RMSE = MSE එකේ වර්ගමූලය, ආයෙත් මුල් ඒකකයටම එනවා. R² = model එක target එකේ variance එකෙන් කොච්චර කොටසක් පැහැදිලි කරනවද කියන එක. 1 = සම්පූර්ණයි, 0 = හැමවෙලේම සාමාන්‍යය කියනවා වගේ. Adjusted R² = features ගණන අනුව R² එක සකස් කරනවා. සාමාන්‍ය R² එක feature එකක් එකතු කළාම කවදාවත් අඩු වෙන්නේ නෑ (training data වල). Adjusted R² වැඩක් නැති feature එකක් එකතු කළොත් අඩු වෙන්න පුළුවන්.',
        'Classification වලදී confusion matrix එක පදනමයි. True Positive (TP) = positive එකක් positive කියලා හරියට අල්ලගත්තා. False Positive (FP) = negative එකක් වැරදියට positive කිව්වා. False Negative (FN) = positive එකක් මඟ හැරුණා. True Negative (TN) = negative එකක් හරියට negative කිව්වා. Accuracy = හරි උත්තර ÷ මුළු ගණන. ඒත් classes අසමබර නම් accuracy එක රවට්ටනවා. Fraud 1% ක් තියෙද්දී "හැමදේම fraud නෑ" කියන model එකට 99% accuracy!',
        'Precision = positive කිව්ව ඒවායින් ඇත්තටම positive ප්‍රතිශතය: TP ÷ (TP + FP). "මම alarm ගැහුවාම කොච්චර වාරයක් හරිද?" Recall = ඇත්ත positives වලින් අල්ලගත්තු ප්‍රතිශතය: TP ÷ (TP + FN). "ඇත්ත ලෙඩ්ඩු ගෙන් කී දෙනෙක්ව හොයාගත්තද?" F1 = precision සහ recall වල harmonic mean එක, දෙකම සමබර කරනවා. Threshold එක වෙනස් කළාම precision සහ recall එකිනෙකට විරුද්ධව වෙනස් වෙනවා.',
        'ROC curve එක හැම threshold එකකම True Positive Rate (recall) සහ False Positive Rate අඳිනවා. ROC-AUC = ඒ curve එක යට ප්‍රදේශය. 0.5 = අහඹු අනුමාන, 1.0 = පරිපූර්ණයි. PR-AUC = precision-recall curve එක යට ප්‍රදේශය. Positives ගොඩක් දුර්ලභ නම් PR-AUC වඩා හොඳ කතාවක් කියනවා. Log loss = model එකේ probabilities කොච්චර හොඳද කියන එක. වැරදි උත්තරයකට ලොකු විශ්වාසයක් දුන්නොත් ලොකු දඬුවමක්. අඩු නම් හොඳයි.',
      ],
      analogy: 'Airport එකක security scanner එක. Precision = scanner එක alarm ගැහුව බෑග් වලින් ඇත්තටම භයානක දේ තිබුණු ප්‍රතිශතය. Recall = ඇත්තටම භයානක දේ තිබුණු බෑග් වලින් scanner එක අල්ලගත්තු ප්‍රතිශතය. Airport එකකට recall වැදගත්ම (එකක්වත් මඟ හැරෙන්න බෑ). Spam filter එකකට precision වැදගත් (වැදගත් email එකක් spam එකට යන්න බෑ).',
      example: 'Emails 100ක්. Model එක 50ක් spam කිව්වා: ඇත්තටම spam 40 (TP), වැරදියට 10 (FP). Spam නෑ කිව්ව 50න් 5ක් ඇත්තටම spam (FN), 45ක් හරි (TN). Accuracy = (40+45)/100 = 85%. Precision = 40/50 = 80%. Recall = 40/45 = 88.9%. F1 = 2 × 0.8 × 0.889 ÷ (0.8 + 0.889) = 84.2%. Regression: වැරදි ලක්ෂ 2, -4, 3 නම් MAE = 3, MSE = (4+16+9)/3 = 9.67, RMSE = 3.11.',
      code: {
        lang: 'python',
        src: `from sklearn.metrics import (mean_absolute_error, mean_squared_error, r2_score,
    accuracy_score, precision_score, recall_score, f1_score, confusion_matrix,
    roc_auc_score, average_precision_score, log_loss)

# Regression: ඇත්ත සහ අනුමාන මිල (ලක්ෂ)
y_true, y_pred = [150, 200, 300], [152, 196, 303]
mse = mean_squared_error(y_true, y_pred)
print(mean_absolute_error(y_true, y_pred), mse, mse ** 0.5, r2_score(y_true, y_pred))

# Classification: 1 = spam
y, p = [1, 1, 0, 0, 1, 0], [0.9, 0.4, 0.2, 0.6, 0.8, 0.1]   # p = probability
pred = [1 if x >= 0.5 else 0 for x in p]                     # threshold 0.5
print(confusion_matrix(y, pred))                             # [[TN, FP], [FN, TP]]
print(accuracy_score(y, pred), precision_score(y, pred), recall_score(y, pred), f1_score(y, pred))
print(roc_auc_score(y, p), average_precision_score(y, p), log_loss(y, p))  # PR-AUC ~ average precision`,
      },
      keyPoints: [
        'Regression: MAE, MSE, RMSE, R², adjusted R².',
        'Confusion matrix: TP, FP, FN, TN.',
        'Accuracy අසමබර data වලදී රවට්ටනවා.',
        'Precision = alarm හරිද? Recall = කීයක් අල්ලගත්තද? F1 = දෙකේ සමබරතාව.',
        'ROC-AUC, PR-AUC = threshold නැතුව ranking ගුණාත්මකභාවය. Log loss = probability ගුණාත්මකභාවය.',
      ],
      terms: [
        { en: 'MAE', si: 'Mean Absolute Error. වැරදි වල absolute අගයන්ගේ සාමාන්‍යය.' },
        { en: 'MSE', si: 'Mean Squared Error. වැරදි වල වර්ග වල සාමාන්‍යය.' },
        { en: 'RMSE', si: 'MSE එකේ වර්ගමූලය. Target එකේ ඒකකයෙන්ම වැරැද්ද.' },
        { en: 'R²', si: 'Target එකේ variance එකෙන් model එක පැහැදිලි කරන කොටස.' },
        { en: 'Adjusted R²', si: 'Features ගණනට දඬුවමක් දාලා සකස් කරපු R².' },
        { en: 'Confusion Matrix', si: 'TP, FP, FN, TN ගණන් පෙන්නන වගුව.' },
        { en: 'Accuracy', si: 'මුළු predictions වලින් හරි ඒවායේ ප්‍රතිශතය.' },
        { en: 'Precision', si: 'Positive කිව්ව ඒවායින් ඇත්තටම positive ප්‍රතිශතය.' },
        { en: 'Recall', si: 'ඇත්ත positives වලින් model එක අල්ලගත්තු ප්‍රතිශතය.' },
        { en: 'F1 Score', si: 'Precision සහ recall වල harmonic mean එක.' },
        { en: 'ROC-AUC', si: 'ROC curve එක යට ප්‍රදේශය. 0.5 = අහඹු, 1 = පරිපූර්ණ.' },
        { en: 'PR-AUC', si: 'Precision-Recall curve එක යට ප්‍රදේශය. දුර්ලභ positives වලට වඩා සුදුසුයි.' },
        { en: 'Log Loss', si: 'Predicted probabilities ඇත්ත labels වලට කොච්චර ගැළපෙනවද කියන මිනුම. අඩු නම් හොඳයි.' },
      ],
    },
    {
      id: 'tuning-imbalanced',
      title: 'Hyperparameter Tuning සහ Imbalanced Data',
      body: [
        'Parameters (weights) model එක training වලදී තනියම ඉගෙන ගන්නවා. Hyperparameters කියන්නේ training එකට කලින් අපි තෝරන settings. උදා: Random Forest එකේ trees ගණන, tree එකක max_depth, learning rate, KNN වල k, regularization alpha. Hyperparameter tuning කියන්නේ validation ලකුණ හොඳම වෙන settings හොයන එක.',
        'Grid search වලදී අපි දෙන හැම අගය එකතුවක්ම පරීක්ෂා කරනවා. Settings 3ක් සහ එකකට අගයන් 5 බැගින් නම් 5 × 5 × 5 = 125 combinations. සම්පූර්ණයි, ඒත් slow. Random search වලදී අහඹු combinations නිශ්චිත ගණනක් (උදා: 30) විතරක් පරීක්ෂා කරනවා. ගොඩක් වෙලාවට grid එකට ළඟ ප්‍රතිඵලයක් ගොඩක් අඩු වෙලාවකින්. Bayesian optimization කලින් උත්සාහයන් වලින් ඉගෙන ගෙන, ඊළඟට හොඳ වෙන්න ඉඩ වැඩි settings තෝරනවා. Optuna කියන්නේ මේ වගේ smart search (සාමාන්‍යයෙන් TPE algorithm එක) කරන ජනප්‍රිය Python library එකක්, හොඳ නැති trials මැදදී නවත්වන්නත් (pruning) පුළුවන්.',
        'Imbalanced data කියන්නේ එක class එකක් අනිකට වඩා ගොඩක් දුර්ලභ වෙන එක. උදා: transactions 1,000න් fraud 10යි. Model එක "හැමදේම සාමාන්‍යයි" කිව්වත් 99% accuracy. විසඳුම්: (1) Class weights: දුර්ලභ class එකේ වැරදි වලට loss එකේ වැඩි බරක් දෙනවා (scikit-learn වල class_weight="balanced"). (2) Resampling: බහුතර class එක අඩු කරනවා (undersampling) හෝ දුර්ලභ class එක වැඩි කරනවා (oversampling). (3) SMOTE: දුර්ලභ class එකේ point එකක් සහ ඒකේ ළඟම අසල්වැසියෙක් අතර රේඛාවේ අලුත් කෘත්‍රිම points හදනවා.',
        'වැදගත්: SMOTE සහ ඕනෙම resampling එකක් training data වලට විතරක් කරන්න. Test data වලට කළොත් ලකුණු බොරු. Imblearn pipeline එකක් ඇතුළේ CV කළාම මේක ස්වයංක්‍රීයව නිවැරදිව වෙනවා. Accuracy වෙනුවට precision, recall, F1, PR-AUC බලන්න, threshold එකත් සකස් කරන්න.',
      ],
      analogy: 'Hyperparameter tuning = කොත්තු එකක් හදද්දී මිරිස් ප්‍රමාණය, ලුණු, පිහිනකන කාලය වෙනස් කරලා රස බලනවා. Grid = හැම එකතුවක්ම උයලා බලනවා. Random = අහඹු එකතු 10ක්. Bayesian / Optuna = කලින් එකේ රස අනුව "තව ටිකක් මිරිස්" කියලා බුද්ධිමත්ව ඊළඟ එක තෝරනවා. Imbalanced data = cricket team එකක ඉන්නේ batsmen 10යි, bowler එක්කෙනයි. Coach bowler ට අමතර අවධානයක් (class weight) දෙන්න ඕනේ.',
      example: 'Random Forest: n_estimators [100, 200, 300] සහ max_depth [5, 10, None]. Grid search + 5-fold CV = combinations 9 × folds 5 = models 45ක් train කරනවා. හොඳම: 300, depth 10, CV F1 0.86. Fraud data (1%): class_weight නැතුව recall 20%. class_weight="balanced" එක්ක recall 70%, precision ටිකක් අඩු වුණා. SMOTE එකෙන් fraud samples 10 සිට 990 දක්වා කෘත්‍රිමව වැඩි කළා (training data වල විතරක්).',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import make_classification
from sklearn.model_selection import GridSearchCV, RandomizedSearchCV
from sklearn.ensemble import RandomForestClassifier
from imblearn.pipeline import make_pipeline        # pip install imbalanced-learn
from imblearn.over_sampling import SMOTE

X, y = make_classification(n_samples=2000, weights=[0.95], random_state=0)  # 5% දුර්ලභ class
rf = RandomForestClassifier(class_weight="balanced", random_state=0)  # class weights
grid = GridSearchCV(rf, {"n_estimators": [100, 300], "max_depth": [5, None]},
                    scoring="f1", cv=5).fit(X, y)
print(grid.best_params_, grid.best_score_)

# SMOTE pipeline එකක් ඇතුළේ: හැම fold එකකම training කොටසට විතරයි
pipe = make_pipeline(SMOTE(random_state=0), RandomForestClassifier(random_state=0))
rand = RandomizedSearchCV(pipe, {"randomforestclassifier__max_depth": [3, 5, 10, None]},
                          n_iter=4, scoring="f1", cv=5, random_state=0).fit(X, y)
# Optuna: study.optimize(objective, n_trials=50) වගේ smart search එකක්`,
      },
      keyPoints: [
        'Parameters = ඉගෙන ගන්නවා. Hyperparameters = අපි තෝරනවා.',
        'Grid = හැම එකතුවක්ම. Random = අහඹු ටිකක්. Bayesian / Optuna = බුද්ධිමත් search.',
        'Imbalanced data: class weights, resampling, SMOTE.',
        'Resampling training data වලට විතරයි. Accuracy වෙනුවට F1 / recall / PR-AUC.',
      ],
      terms: [
        { en: 'Hyperparameter', si: 'Training එකට කලින් අපි තෝරන model settings (උදා: max_depth, learning rate).' },
        { en: 'Grid Search', si: 'දීපු hyperparameter අගයන්ගේ හැම එකතුවක්ම පරීක්ෂා කරන ක්‍රමය.' },
        { en: 'Random Search', si: 'Hyperparameter අවකාශයෙන් අහඹු combinations ටිකක් පරීක්ෂා කරන ක්‍රමය.' },
        { en: 'Bayesian Optimization', si: 'කලින් ප්‍රතිඵල වලින් ඉගෙන ගෙන ඊළඟට පරීක්ෂා කරන්න හොඳම settings තෝරන ක්‍රමය.' },
        { en: 'Optuna', si: 'Smart (TPE වගේ) search සහ pruning එක්ක hyperparameter tuning කරන Python library එක.' },
        { en: 'Imbalanced Data', si: 'එක class එකක් අනිත් ඒවාට වඩා ගොඩක් දුර්ලභ dataset එකක්.' },
        { en: 'SMOTE', si: 'දුර්ලභ class එකේ ළඟ points අතර කෘත්‍රිම අලුත් samples හදන oversampling ක්‍රමය.' },
        { en: 'Class Weights', si: 'දුර්ලභ class එකේ වැරදි වලට loss එකේ වැඩි බරක් දෙන එක.' },
      ],
    },
    {
      id: 'time-series-forecasting',
      title: 'Time Series Forecasting: ARIMA, SARIMA, Prophet',
      body: [
        'Time series forecasting කියන්නේ පරණ අගයන් බලලා අනාගත අගයන් අනුමාන කරන එක. ලබන මාසේ විදුලි ඉල්ලුම, ලබන සතියේ කඩේ විකුණුම් වගේ. මෙතන වැදගත්ම නීතිය: අනාගතය පාවිච්චි කරලා අතීතය අනුමාන කරන්න බෑ. ඒ නිසා random split එකක් නෙවෙයි, කාලය අනුව split කරනවා (පරණ ටික train, අලුත් ටික test). Cross-validation වලටත් TimeSeriesSplit වගේ ක්‍රම පාවිච්චි කරනවා.',
        'Stationarity කියන්නේ time series එකේ mean එක, variance එක වගේ ලක්ෂණ කාලයත් එක්ක වෙනස් නොවී තියෙන එක. Trend එකක් තියෙනවා නම් mean එක වෙනස් වෙන නිසා stationary නෑ. ARIMA වගේ ගොඩක් සම්භාව්‍ය models වලට stationary data ඕනේ. Differencing (අද අගය - ඊයේ අගය) කරලා trend එක අයින් කරනවා. ADF test එකෙන් stationary ද කියලා පරීක්ෂා කරනවා. Seasonality කියන්නේ නියමිත කාලයකට පස්සේ නැවත එන රටාව (සතිපතා, වාර්ෂික).',
        'ARIMA(p, d, q) කොටස් තුනකින් හැදිලා තියෙනවා. AR (p) = පරණ අගයන් p ගණනක් පාවිච්චි කරනවා. I (d) = stationary කරන්න differencing කරපු වාර ගණන. MA (q) = පරණ forecast වැරදි q ගණනක් පාවිච්චි කරනවා. SARIMA කියන්නේ seasonal කොටසකුත් එකතු කරපු ARIMA. උදා: මාසික data වල වාර්ෂික රටාවට seasonal period එක 12යි.',
        'Prophet කියන්නේ Meta (Facebook) හදපු forecasting library එකක්. Trend, seasonality (සතිපතා, වාර්ෂික) සහ holidays වෙන වෙනම model කරනවා. Data වල හිස් තැන් සහ outliers වලට සාපේක්ෂව ඔරොත්තු දෙනවා, ලේසියෙන් පාවිච්චි කරන්න පුළුවන්. ශ්‍රී ලංකාවේ පෝය දින, අවුරුද්ද වගේ holidays එකතු කරන්නත් පුළුවන්.',
      ],
      analogy: 'කාලගුණ අනාවැකිය වගේ. ඊයේ සහ පෙරේදා වැස්ස නම් අදත් වහින්න ඉඩ වැඩියි (AR). මෝසම් කාලය හැම අවුරුද්දෙම එකම කාලයට එනවා (seasonality). ARIMA කියන්නේ මෑත දවස් බලලා අනාවැකි කියන කෙනා. SARIMA කියන්නේ ඒ වගේම "දැන් මෝසම් කාලේ" කියලාත් දන්න කෙනා.',
      example: 'Restaurant එකක මාසික kottu විකුණුම් අවුරුදු 3ක් (මාස 36). හැම මාසෙකම 2%ක් වගේ වැඩි වෙනවා (trend), දෙසැම්බර් සහ අප්‍රේල් වල ඉහළ යනවා (seasonality). එක පාරක් difference කරලා trend එක අයින් කළාම ADF test p-value 0.01 (stationary). SARIMA(1,1,1)(1,1,1,12) model එක ලබන මාස 6ට forecast කරනවා. ඊළඟ දෙසැම්බර්ට kottu 4,800ක් විතර අනුමාන කරනවා.',
      code: {
        lang: 'python',
        src: `import pandas as pd
from statsmodels.tsa.stattools import adfuller
from statsmodels.tsa.statespace.sarimax import SARIMAX

s = pd.read_csv("kottu_sales.csv", parse_dates=["month"], index_col="month")["sales"]

print(adfuller(s.diff().dropna())[1])     # ADF p-value < 0.05 නම් stationary
train, test = s[:-6], s[-6:]              # කාලය අනුව split (අන්තිම මාස 6 test)

model = SARIMAX(train, order=(1, 1, 1), seasonal_order=(1, 1, 1, 12)).fit(disp=False)
print(model.forecast(steps=6))            # ලබන මාස 6 forecast

# Prophet: from prophet import Prophet
# m = Prophet().fit(df)   # df columns: ds (date), y (අගය)`,
      },
      keyPoints: [
        'Time series වල random split කරන්න එපා, කාලය අනුව split කරන්න.',
        'Stationary = mean, variance කාලයත් එක්ක වෙනස් නෑ. Differencing එකෙන් trend අයින් කරනවා.',
        'ARIMA(p, d, q) = AR + differencing + MA.',
        'SARIMA = seasonal ARIMA. Prophet = trend + seasonality + holidays, ලේසියි.',
      ],
      terms: [
        { en: 'Stationarity', si: 'Mean, variance වගේ ලක්ෂණ කාලයත් එක්ක වෙනස් නොවී තියෙන ගතිය.' },
        { en: 'Differencing', si: 'දැන් අගයෙන් කලින් අගය අඩු කරලා trend අයින් කරන එක.' },
        { en: 'Seasonality', si: 'නියමිත කාලයකට පස්සේ නැවත නැවත එන රටාව.' },
        { en: 'ARIMA', si: 'AutoRegressive Integrated Moving Average. පරණ අගයන් සහ පරණ වැරදි වලින් forecast කරන model එක.' },
        { en: 'SARIMA', si: 'Seasonal රටාවලට අමතර කොටසක් එකතු කරපු ARIMA.' },
        { en: 'Prophet', si: 'Trend, seasonality, holidays වෙන වෙනම model කරන Meta හදපු forecasting library එක.' },
        { en: 'ADF Test', si: 'Augmented Dickey-Fuller test. Time series එකක් stationary ද කියලා පරීක්ෂා කරන test එක.' },
      ],
    },
    {
      id: 'recommender-systems',
      title: 'Recommender Systems',
      body: [
        'Recommender system එකක් කියන්නේ user කෙනෙක්ට කැමති වෙන්න ඉඩ තියෙන items යෝජනා කරන system එක. YouTube වීඩියෝ, Daraz products, Netflix films, Spotify songs හැමදේම මේවා. ප්‍රධාන ක්‍රම තුනක් තියෙනවා.',
        'Content-based filtering වලදී item වල ලක්ෂණ (genre, නළුවා, category) බලනවා. ඔයා action films බැලුවා නම් තවත් action films යෝජනා කරනවා. අලුත් items වලට හොඳයි (ඒවා කාටවත් rate කරලා නැතත් ලක්ෂණ දන්නවා). ඒත් ඔයා කලින් බලපු දේට සමාන දේ විතරක් යෝජනා කරන නිසා අලුත් දේවල් හොයාගන්න අමාරුයි.',
        'Collaborative filtering වලදී item වල ලක්ෂණ බලන්නේ නෑ. "ඔයා වගේ රුචිකත්ව තියෙන අය කැමති වුණු දේ" බලනවා. User-based: ඔයාට සමාන users හොයලා එයාලා කැමති දේ. Item-based: ඔයා කැමති item එකට සමාන විදිහට rate කරලා තියෙන items. ප්‍රශ්නය: cold start. අලුත් user කෙනෙක් හරි අලුත් item එකක් හරි ආවාම data නෑ.',
        'Matrix factorization කියන්නේ users × items ratings වගුව (ගොඩක් cells හිස්) කුඩා matrices දෙකක ගුණිතයක් විදිහට කඩන එක. හැම user කෙනෙක්ටම සහ හැම item එකකටම සැඟවුණු ලක්ෂණ (latent factors) අංක ටිකක් ලැබෙනවා. උදා: "action කැමැත්ත", "ආදර කතා කැමැත්ත" වගේ (ඒත් model එක මේවා තනියම හොයාගන්නේ, නම් දාන්නේ නෑ). User ගේ සහ item එකේ factors ගුණ කරලා එකතු කළාම හිස් cell එකේ rating එක අනුමාන කරනවා. Netflix Prize එකෙන් මේ ක්‍රමය ජනප්‍රිය වුණා.',
      ],
      analogy: 'Content-based = පොත් සාප්පුවේ කෙනා "ඔයා මාර්ටින් වික්‍රමසිංහගේ පොතක් කැමතියි, එයාගේ තව පොතක් බලන්න" කියනවා. Collaborative = ඔයාගේ යාළුවා "මටයි ඔයාටයි එකම films කැමතියි, මම මේක බැලුවා, ඔයත් කැමති වෙයි" කියනවා. Matrix factorization = මිනිස්සුන්ගේ රුචිකත්ව ලක්ෂණ කිහිපයකට සාරාංශ කරනවා.',
      example: 'Users 3ක් films 4කට 1-5 ratings. Kasun: Film A=5, B=4, C=1. Nimali: A=5, B=5, C=1, D=4. Ruwan: A=1, C=5, D=2. Kasun ගේ ratings Nimali ට ගොඩක් සමානයි. Nimali D ට 4ක් දුන්නා. ඒ නිසා collaborative filtering කියනවා Kasun ත් D ට ආසන්න වශයෙන් 4ක් දෙයි, ඒ නිසා D යෝජනා කරන්න.',
      code: {
        lang: 'python',
        src: `import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF

# Rows = users (Kasun, Nimali, Ruwan), columns = films A-D, 0 = rate කරලා නෑ
R = np.array([[5, 4, 1, 0],
              [5, 5, 1, 4],
              [1, 0, 5, 2]])

sim = cosine_similarity(R)       # users අතර සමානකම
print(sim[0])                    # Kasun ට වැඩියෙන්ම සමාන Nimali

# Matrix factorization: latent factors 2කට කඩනවා
# (සරල demo එකක්: මෙතන 0 සැබෑ "හිස්" ලෙස නොව 0 rating ලෙස සලකනවා)
nmf = NMF(n_components=2, init="random", random_state=0, max_iter=1000)
U = nmf.fit_transform(R)         # user factors
V = nmf.components_              # item factors
print(np.round(U @ V, 1))        # නැවත හදපු ratings වගුව`,
      },
      keyPoints: [
        'Content-based = item ලක්ෂණ අනුව සමාන දේ.',
        'Collaborative = සමාන users / items වල හැසිරීම අනුව.',
        'Matrix factorization = users සහ items latent factors වලට කඩනවා.',
        'Cold start = අලුත් users / items වලට data නැති ප්‍රශ්නය.',
      ],
      terms: [
        { en: 'Recommender System', si: 'User කෙනෙක්ට කැමති වෙන්න ඉඩ ඇති items යෝජනා කරන system එක.' },
        { en: 'Content-Based Filtering', si: 'Item ලක්ෂණ සහ user ගේ කලින් කැමැත්ත අනුව සමාන items යෝජනා කරන ක්‍රමය.' },
        { en: 'Collaborative Filtering', si: 'සමාන රුචිකත්ව ඇති users ගේ හැසිරීමෙන් යෝජනා කරන ක්‍රමය.' },
        { en: 'Matrix Factorization', si: 'Ratings වගුව user සහ item latent factor matrices දෙකකට කඩලා හිස් ratings අනුමාන කරන ක්‍රමය.' },
        { en: 'Latent Factors', si: 'Data වලින් model එක තනියම හොයාගන්න සැඟවුණු ලක්ෂණ.' },
        { en: 'Cold Start', si: 'අලුත් user හෝ item එකකට කලින් data නැති නිසා යෝජනා කරන්න අමාරු වෙන ප්‍රශ්නය.' },
      ],
    },
    {
      id: 'explainability',
      title: 'Explainability: Feature Importance, SHAP, LIME',
      body: [
        'Random Forest, XGBoost වගේ ප්‍රබල models වලට හොඳ ලකුණු ලැබුණත් "ඇයි මේ තීරණය?" කියලා කෙලින්ම කියන්න අමාරුයි. ඒවට කියන්නේ black box models කියලා. ණය ප්‍රතික්ෂේප කරන එකක් හරි රෝගයක් හඳුනාගන්න එකක් හරි නම් හේතුව දැනගන්න ඕනේ. නීතිමය අවශ්‍යතා, විශ්වාසය, bugs සහ bias හොයාගන්න explainability වැදගත්.',
        'Feature importance එකෙන් මුළු model එකටම කොයි features වැදගත්ද කියලා පෙන්නනවා (global). Tree models වල impurity-based importance එක ඉක්මනින් ලැබෙනවා, ඒත් unique අගයන් ගොඩක් තියෙන features වලට පක්ෂපාතී වෙන්න පුළුවන්. Permutation importance එකේදී එක feature එකක අගයන් අහඹු ලෙස අවුල් කරලා model එකේ ලකුණ කොච්චර අඩු වෙනවද බලනවා. ගොඩක් අඩු වුණොත් ඒ feature එක වැදගත්.',
        'SHAP (SHapley Additive exPlanations) game theory එකේ Shapley values පාවිච්චි කරනවා. එක prediction එකක් සඳහා හැම feature එකක්ම "සාමාන්‍ය prediction එකේ සිට මේ prediction එකට" කොච්චර දායක වුණාද කියලා සාධාරණව බෙදනවා. හැම feature එකකම SHAP values එකතු කරලා base value එකට එකතු කළාම හරියටම prediction එක ලැබෙනවා. එක prediction එකකට (local) සහ මුළු model එකටම (global) දෙකටම පාවිච්චි කරන්න පුළුවන්.',
        'LIME (Local Interpretable Model-agnostic Explanations) එක prediction එකක් වටේ input එක පොඩ්ඩ පොඩ්ඩ වෙනස් කරපු samples ගොඩක් හදලා, ඒවට black box එකේ උත්තර ගන්නවා. ඊට පස්සේ ඒ කුඩා ප්‍රදේශයේ විතරක් වැඩ කරන සරල linear model එකක් fit කරලා ඒකෙන් පැහැදිලි කරනවා. ඕනෙම model එකකට පාවිච්චි කරන්න පුළුවන් (model-agnostic).',
      ],
      analogy: 'Cricket match එකක් දිනුවාම "කාගේ දායකත්වය කොච්චරද?" කියලා අහනවා. SHAP කියන්නේ ජයග්‍රහණයේ ලකුණු ක්‍රීඩකයන් අතර සාධාරණව බෙදනවා වගේ. හැමෝගේම දායකත්වය එකතු කළාම මුළු ජයග්‍රහණයම ලැබෙනවා. LIME කියන්නේ එක over එකක් විතරක් ගත්තාම මොකද වුණේ කියලා සරලව පැහැදිලි කරන commentator වගේ.',
      example: 'Bank model එක Nimal ගේ ණය ප්‍රතික්ෂේප කළා. සාමාන්‍ය approval probability (base value) 0.60. SHAP: පරණ ණය ගෙවීම් ප්‍රමාද 3ක් = -0.30, ආදායම Rs. 45,000 = -0.10, රැකියාවේ අවුරුදු 8 = +0.08, වයස 35 = +0.02. එකතුව 0.60 - 0.30 - 0.10 + 0.08 + 0.02 = 0.30. 0.5ට අඩු නිසා ප්‍රතික්ෂේපයි. ප්‍රධාන හේතුව ප්‍රමාද ගෙවීම්.',
      code: {
        lang: 'python',
        src: `from sklearn.datasets import load_breast_cancer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.inspection import permutation_importance

X, y = load_breast_cancer(return_X_y=True, as_frame=True)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)
rf = RandomForestClassifier(random_state=0).fit(X_tr, y_tr)

print(rf.feature_importances_[:5])                     # impurity-based importance
perm = permutation_importance(rf, X_te, y_te, n_repeats=10, random_state=0)
print(perm.importances_mean[:5])                       # permutation importance

import shap                                            # pip install shap
explainer = shap.TreeExplainer(rf)
shap_values = explainer(X_te.iloc[:1])                  # එක prediction එකක SHAP values
# LIME: from lime.lime_tabular import LimeTabularExplainer`,
      },
      keyPoints: [
        'Black box models වල තීරණ පැහැදිලි කරන්න explainability ඕනේ.',
        'Feature importance = මුළු model එකටම වැදගත් features (global).',
        'SHAP = Shapley values, දායකත්වයන් එකතු කළාම prediction එක.',
        'LIME = එක prediction එකක් වටේ සරල local model එකක්.',
      ],
      terms: [
        { en: 'Explainability', si: 'Model එක තීරණයක් ගත්තේ ඇයි කියලා මිනිසුන්ට තේරෙන විදිහට පැහැදිලි කිරීම.' },
        { en: 'Black Box Model', si: 'ඇතුළත ක්‍රියාව පහසුවෙන් තේරුම් ගන්න බැරි සංකීර්ණ model එකක්.' },
        { en: 'Feature Importance', si: 'Model එකේ predictions වලට එක එක feature එක කොච්චර වැදගත්ද කියන මිනුම.' },
        { en: 'Permutation Importance', si: 'Feature එකක අගයන් අවුල් කළාම model ලකුණ අඩු වෙන ප්‍රමාණයෙන් වැදගත්කම මැනීම.' },
        { en: 'SHAP', si: 'Shapley values පාවිච්චි කරලා හැම feature එකකම prediction එකට දායකත්වය සාධාරණව බෙදන ක්‍රමය.' },
        { en: 'LIME', si: 'එක prediction එකක් වටේ සරල surrogate model එකක් fit කරලා පැහැදිලි කරන model-agnostic ක්‍රමය.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'සාමාන්‍ය programming සහ Machine Learning අතර ප්‍රධාන වෙනස මොකක්ද?',
      options: [
        'ML වලදී rules අතින් ලියනවා',
        'ML වලදී data සහ answers දීලා computer එක rules හොයාගන්නවා',
        'ML වලට data ඕනේ නෑ',
      ],
      answer: 1,
      why: 'සාමාන්‍ය programming: Rules + Data → Answers. ML: Data + Answers → Rules (model එක).',
    },
    {
      q: 'Model එකේ training accuracy 99%යි, ඒත් test accuracy 65%යි. මේ මොකක්ද?',
      options: ['Underfitting', 'Overfitting', 'හොඳ fit එකක්'],
      answer: 1,
      why: 'Training data කටපාඩම් කරලා අලුත් data වලට generalize වෙන්නේ නැති නිසා overfitting. Variance වැඩියි.',
    },
    {
      q: 'සමහර features වල weights හරියටම 0 කරලා feature selection එකකුත් කරන regularization එක මොකක්ද?',
      options: ['L1 (Lasso)', 'L2 (Ridge)', 'Dropout'],
      answer: 0,
      why: 'L1 penalty එක (absolute weights එකතුව) නිසා සමහර weights හරියටම 0 වෙනවා. L2 weights පොඩි කරනවා, ඒත් සාමාන්‍යයෙන් 0 කරන්නේ නෑ.',
    },
    {
      q: 'Gradient descent වල learning rate එක ගොඩක් ලොකු නම් මොකද වෙන්නේ?',
      options: ['ගොඩක් හෙමින් ඉගෙන ගන්නවා', 'පහළම තැන පැනලා loss එක උඩ පහළ යනවා හෝ වැඩි වෙනවා', 'කිසි වෙනසක් නෑ'],
      answer: 1,
      why: 'පියවර ලොකු වැඩි නිසා නිම්නය පැනලා අනිත් පැත්තට යනවා. සමහර වෙලාවට loss එක diverge වෙනවා.',
    },
    {
      q: 'Training data වලින් replacement සහිතව samples අරන් trees ගොඩක් parallel train කරලා ඡන්දයෙන් තීරණය කරන්නේ මොන ක්‍රමයද?',
      options: ['Boosting', 'Bagging (Random Forest)', 'Stacking'],
      answer: 1,
      why: 'Bagging = bootstrap samples + parallel models + ඡන්දය / සාමාන්‍යය. Boosting නම් models එකින් එක (sequential) train කරනවා.',
    },
    {
      q: 'Fraud transactions 1% විතරයි. "හැමදේම fraud නෑ" කියන model එකට 99% accuracy. වඩා හොඳ මිනුම මොකක්ද?',
      options: ['Accuracy ම ඇති', 'Recall, precision, F1 හෝ PR-AUC', 'R²'],
      answer: 1,
      why: 'අසමබර data වලදී accuracy රවට්ටනවා. මේ model එකේ recall = 0, ඒ කියන්නේ එක fraud එකක්වත් අල්ලගන්නේ නෑ. R² regression metric එකක්.',
    },
    {
      q: 'Clusters ගණන ඉස්සරහින් නොදී, ඕනෙම හැඩයක clusters හොයලා, තනිවම තියෙන points noise ලෙස ලකුණු කරන algorithm එක මොකක්ද?',
      options: ['K-Means', 'DBSCAN', 'PCA'],
      answer: 1,
      why: 'DBSCAN density පාවිච්චි කරනවා. K-Means ට k දෙන්න ඕනේ. PCA clustering නෙවෙයි, dimensionality reduction.',
    },
    {
      q: 'SMOTE පාවිච්චි කරන්න ඕනේ කොහෙටද?',
      options: ['මුළු dataset එකටම, split කරන්න කලින්', 'Training data වලට විතරයි', 'Test data වලට විතරයි'],
      answer: 1,
      why: 'Split කරන්න කලින් SMOTE කළොත් කෘත්‍රිම samples test set එකටත් යනවා, ඒක data leakage. Training data (හෝ CV fold එකේ training කොටස) වලට විතරක් කරන්න.',
    },
  ],
}
