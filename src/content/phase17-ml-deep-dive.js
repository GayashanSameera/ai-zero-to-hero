export default {
  "id": "ml-deep-dive",
  "number": 17,
  "title": "ML & Deep Learning Fundamentals: Deep Dive",
  "titleSi": "A deeper look at machine learning and deep learning, with worked exam calculations",
  "summary": "Build a deeper understanding of machine learning and deep learning, with step-by-step calculations for precision, F1, softmax, cross-entropy, KL divergence, label smoothing, gradient clipping, warmup, and Adam bias correction. Finish with a Sri Lankan customer-churn project, from raw CSV data through model evaluation.",
  "duration": "3–4 weeks",
  "topics": [
    {
      "id": "ml-big-picture",
      "title": "The Big Picture: AI vs ML vs DL, Learning Paradigms, Parameters vs Hyperparameters",
      "plain": "Start by learning the map: AI is the broad field, ML is AI that learns patterns from data, and deep learning is ML built with multi-layer neural networks. This topic also separates the main ways models learn and the values a model learns from the settings an engineer chooses.",
      "internGuide": ["AI contains ML, and ML contains deep learning; they are not three unrelated technologies.", "Supervised learning uses labeled targets, unsupervised learning finds structure without labels, self-supervised learning creates targets from raw data, and reinforcement learning learns from rewards.", "Parameters such as weights are learned during training. Hyperparameters such as learning rate and tree depth are chosen or tuned outside the training update.", "Exam focus: identify the learning paradigm from the available data and goal, then distinguish learned parameters from configured hyperparameters."],
      "examRefs": [
        "FUN-001",
        "FUN-002",
        "FUN-003",
        "FUN-004",
        "FUN-005",
        "FUN-049",
        "FUN-052",
        "FUN-110"
      ],
      "body": [
        "AI is the broad field of systems that perform tasks requiring intelligence. Machine learning (ML) is a subset that learns patterns from data rather than relying only on hand-written rules; deep learning (DL) is a subset of ML based on neural networks with many layers. Thus DL ⊂ ML ⊂ AI: a decision tree is ML but not DL.",
        "Supervised learning uses labelled examples; unsupervised learning finds structure without labels; reinforcement learning learns actions from rewards, which may arrive late; self-supervised learning creates its training targets from the data itself, as next-token prediction does during language-model pretraining. Self-supervised targets can be generated at scale without people labelling every example.",
        "Choose a task by its output: predicting a number such as delivery minutes is regression; predicting a category such as on-time or late is classification; finding groups without labels is clustering. Model parameters (weights, biases, split thresholds) are learned from training data; hyperparameters (learning rate, batch size, layer count, k) are chosen before or around training.",
        "Deep networks can learn features from unstructured images, audio, and text, but usually need more data and compute. With only 800 defect images, adapting a pretrained model through transfer learning is generally more suitable than training a large model from scratch, which can memorize the small dataset."
      ],
      "analogy": "Think of Sri Lanka as AI, the Western Province as ML, and Colombo District as DL: every Colombo resident is in the Western Province, but not every Western Province resident is in Colombo. A teacher giving answers resembles supervised learning; grouping classmates without answers resembles unsupervised learning; a batter learning from runs resembles reinforcement learning.",
      "example": "A dataset of 2 million unlabelled customers grouped into segments suggests clustering. Delivery time in minutes is regression; late/on-time is classification. Next-word prediction is self-supervised learning. Learning rate is a hyperparameter, not a learned parameter. For 800 defect images, start from a pretrained image model and adapt it.",
      "keyPoints": [
        "DL ⊂ ML ⊂ AI; decision trees are ML but not DL.",
        "Labels → supervised; no labels → unsupervised; rewards → reinforcement; data-generated targets → self-supervised.",
        "Numbers → regression; categories → classification.",
        "Parameters are learned; hyperparameters are selected.",
        "Deep learning learns representations but needs compute and data; transfer learning helps when data is limited."
      ],
      "terms": [
        {
          "en": "Self-Supervised Learning",
          "si": "Learning by creating training targets from the input data itself, such as predicting a hidden word."
        },
        {
          "en": "Reinforcement Learning",
          "si": "Learning a policy by taking actions and maximizing rewards from an environment."
        },
        {
          "en": "Policy",
          "si": "A rule mapping a state to an action in reinforcement learning."
        },
        {
          "en": "Hyperparameter",
          "si": "A setting selected for training rather than learned as a model weight."
        },
        {
          "en": "Transfer Learning",
          "si": "Adapting a model pretrained on one task or dataset to a new task."
        },
        {
          "en": "Representation Learning",
          "si": "Learning useful features or representations from raw data."
        }
      ],
      "si": "ඔයා AI කියන ලොකු කුඩය යට MLත්, ML යට deep learningත් තියෙනවා කියලා හිතන්න. A/L පන්තියක උත්තර දීලා උගන්වන එක supervised, උත්තර නැතුව ළමයි කණ්ඩායම් හදාගන්න එක unsupervised වගේ. Cricket batsman කෙනෙක් runs බලලා හොඳ shot ඉගෙන ගන්න එක reinforcement learning. ඔයාට defect photos 800ක් විතරක් තියෙනවා නම්, කලින් ඉගෙනගත් model එකක් අලුත් වැඩේට හුරු කරන transfer learning එක ප්‍රයෝජනවත්."
    },
    {
      "id": "splits-leakage-cv",
      "title": "Honest Evaluation: Splits, Leakage, Stratified / Group / Time Splits, Nested CV",
      "plain": "Evaluation is honest only when the model is tested on information that played no part in training or model selection. The correct split depends on how future production data will arrive.",
      "internGuide": ["Use training data to fit weights, validation data to choose settings, and an untouched test set for the final estimate.", "Fit preprocessing only on training data. Computing scaling, imputation, feature selection, or target encoding before the split leaks information.", "Use stratified splits for class balance, group splits when related rows must stay together, and time splits when the future must be predicted from the past.", "Exam focus: repeated tuning on the test set makes it a validation set. Nested cross-validation separates tuning from evaluation when data is limited."],
      "examRefs": [
        "FUN-006",
        "FUN-007",
        "FUN-016",
        "FUN-050",
        "FUN-053",
        "FUN-054",
        "FUN-055",
        "FUN-093",
        "FUN-094",
        "FUN-095",
        "FUN-136",
        "FUN-137"
      ],
      "body": [
        "Split data before fitting preprocessing or model choices. Train data fits the model, validation data selects settings and thresholds, and a final test set estimates performance on unseen data; do not repeatedly tune against the test set. For independent examples, a common split is 70/15/15. Stratify classification splits when class proportions should be preserved.",
        "Leakage happens when training receives information unavailable at prediction time, including target-derived columns, future data, or preprocessing statistics computed using validation/test data. Fit imputers, scalers, encoders, and feature selection inside each training fold using a pipeline. For repeated records per person, split by person; for forecasting, split chronologically.",
        "K-fold cross-validation rotates the held-out fold: with five folds, train on four and validate on the fifth, repeat five times, and average the scores. Grouped and time-based splits must respect the real deployment setting. Test performance is a final report, not a tuning signal."
      ],
      "analogy": "Do not let a student see the answer key before a practice test. A pipeline is like preparing each practice paper using only the study material available at that point; a future month must not leak into a past-month prediction.",
      "example": "If a customer has records from January through June, do not put January in training and June for that same customer in test when the intended task is new-customer prediction; use customer groups. For future prediction, train on earlier months and test on later months. Fit a scaler on training rows only.",
      "code": {
        "lang": "python",
        "src": "from sklearn.model_selection import (train_test_split, StratifiedKFold,\n    GroupKFold, TimeSeriesSplit, GridSearchCV, cross_val_score)\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n\n\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y)  # Preserve class proportions in each split.\n\npipe = make_pipeline(StandardScaler(), LogisticRegression(max_iter=1000))  # The scaler fits only on each fold’s training rows, preventing leakage.\ninner = GridSearchCV(pipe, {\"logisticregression__C\": [0.1, 1, 10]}, cv=StratifiedKFold(5))\nouter = cross_val_score(inner, X_tr, y_tr, cv=StratifiedKFold(5))  # Nested cross-validation estimates the full model-selection procedure.\nprint(outer.mean())\n# For patients, use GroupKFold with patient_id; for time series, use TimeSeriesSplit.\n"
      },
      "keyPoints": [
        "Train fits; validation selects; test is reserved for final evaluation.",
        "Leakage inflates scores by exposing information unavailable in production.",
        "Fit preprocessing within each training fold.",
        "Use group splits for repeated entities and time splits for future prediction.",
        "Cross-validation averages held-out-fold results."
      ],
      "terms": [
        {
          "en": "Data Leakage",
          "si": "Using information during training that would not be available at prediction time."
        },
        {
          "en": "Target Leakage",
          "si": "A feature that reveals the target directly or indirectly, often because it is recorded after the outcome."
        },
        {
          "en": "Stratified Split",
          "si": "A split that preserves class proportions in each subset."
        },
        {
          "en": "GroupKFold",
          "si": "Cross-validation that keeps all examples from a group in one fold."
        },
        {
          "en": "LOOCV",
          "si": "Leave-one-out cross-validation: hold out one example at a time."
        },
        {
          "en": "Nested Cross-Validation",
          "si": "An outer validation loop estimates performance while an inner loop selects hyperparameters."
        },
        {
          "en": "Target Encoding",
          "si": "Representing categories using statistics of the target, computed without leakage."
        }
      ],
      "si": "ඔයා exam එකකට practice කරනවා නම් answer key එක කලින් බලන්න හොඳ නෑ; ඒක data leakage වගේ. Customers කෙනෙක්ගේ මාස කිහිපයක records තියෙනවා නම් ඒවා train සහ test දෙකට බෙදලා දැම්මොත් model එකට ඒ customerව කලින්ම හඳුනාගන්න පුළුවන්. අනාගත මාසයක් predict කරනවා නම් පරණ මාස වලින් train කරලා පස්සේ එන මාසය test කරන්න. Scaler එකත් train data එකෙන් විතරක් fit කරන්න."
    },
    {
      "id": "preprocessing-deep-dive",
      "title": "Preprocessing Deep Dive: Scaling Maths, Encoding, Imputation, Curse of Dimensionality",
      "plain": "Preprocessing converts raw columns into values a model can use without leaking future information or creating false relationships. Different model families need different preprocessing choices.",
      "internGuide": ["Standardization centers a numeric feature and scales it by its standard deviation; min-max scaling maps it to a chosen range.", "One-hot encoding is suitable for unordered categories. Giving categories arbitrary numbers can incorrectly suggest an order to linear and distance-based models.", "Imputation fills missing values using rules learned from training data. Add a missing-value indicator when the fact that a value is absent may carry information.", "Exam focus: scaling matters strongly for distance and gradient-based models, while decision trees usually do not require it. High-dimensional sparse data can make distances less useful."],
      "examRefs": [
        "FUN-021",
        "FUN-022",
        "FUN-079",
        "FUN-080",
        "FUN-081",
        "FUN-082"
      ],
      "body": [
        "Scale numerical features when the model depends on distances, dot products, or gradient sizes. Standardization subtracts the training mean and divides by its standard deviation; min-max scaling maps a feature using its training minimum and maximum. Fit either transformation on training data only. Trees generally do not need feature scaling because threshold splits depend on order, not units.",
        "One-hot encoding represents categories with separate indicator columns, without inventing an order. Impute missing numeric values using a statistic such as the training median, which is less affected by outliers than the mean. Put imputation, encoding, and scaling in a pipeline so cross-validation does not leak information.",
        "High-dimensional spaces make data sparse and distances less informative, a problem known as the curse of dimensionality. Scaling is important for kNN, SVMs, and many neural networks; it is usually unnecessary for decision trees and tree ensembles."
      ],
      "analogy": "Comparing a person’s height in centimetres with their bank balance in rupees is like comparing distances on a Colombo map drawn with mismatched units. Scaling puts measurements on comparable scales; one-hot encoding gives each bus route its own yes/no marker.",
      "example": "For x = 70, mean = 50, standard deviation = 10, z = (70−50)/10 = 2. For min 10 and max 110, min-max value = (70−10)/(110−10) = 0.6. If a training-fold column has values 2, 4, 100, its median is 4, which is less distorted by 100 than the mean.",
      "keyPoints": [
        "Standardization: (x−mean)/standard deviation; min-max: (x−min)/(max−min).",
        "Fit preprocessing using training data only.",
        "One-hot encoding avoids false category ordering.",
        "Median imputation is robust to outliers.",
        "Distance-based models need scaling more often than trees."
      ],
      "terms": [
        {
          "en": "Standardization (Z-score)",
          "si": "Subtract the training mean and divide by the training standard deviation."
        },
        {
          "en": "Min-Max Normalization",
          "si": "Scale a feature to a range, commonly [0,1], using its minimum and maximum."
        },
        {
          "en": "One-Hot Encoding",
          "si": "Create a binary indicator column for each category."
        },
        {
          "en": "Median Imputation",
          "si": "Fill missing numeric values with the median estimated from training data."
        },
        {
          "en": "Curse of Dimensionality",
          "si": "As dimensions grow, data becomes sparse and distances become less informative."
        },
        {
          "en": "Scale Invariance",
          "si": "A model’s predictions are unchanged by changing a feature’s units; tree splits are generally scale-invariant."
        }
      ],
      "si": "ඔයා Rs. වල bill එකත් centimeters වල උසත් එකට compare කළොත් එකක අංක ලොකු නිසා model එක ඒකට වැඩි අවධානය දෙන්න පුළුවන්. Standardization එකෙන් ඒවා සමාන scale එකකට ගේනවා. Colombo බස් route එක A, B, C කියලා තියෙනවා නම් one-hot encoding එක route එකකටම වෙනම yes/no column එකක් හදනවා. Missing bill එකක් තිබුණොත් training data එකේ median එකෙන් පුරවන්න පුළුවන්."
    },
    {
      "id": "learning-curves-bias-variance",
      "title": "Reading Loss Curves: Overfitting, Underfitting, Early Stopping, Bias-Variance, Double Descent",
      "plain": "Training and validation curves tell you whether a model is learning useful patterns, failing to learn, or memorizing its training data. Diagnose the curve before changing random hyperparameters.",
      "internGuide": ["Underfitting means both training and validation performance are poor; the model or features are not expressive enough.", "Overfitting means training performance improves while validation performance stops improving or worsens.", "Early stopping keeps the checkpoint with the best validation result rather than the final training step.", "Exam focus: high bias points to underfitting; high variance points to sensitivity and overfitting. More regularization does not fix an already underfit model."],
      "examRefs": [
        "FUN-008",
        "FUN-009",
        "FUN-020",
        "FUN-051",
        "FUN-070",
        "FUN-115",
        "FUN-150"
      ],
      "body": [
        "Training loss falling while validation loss rises is a classic overfitting pattern: the model increasingly memorizes training examples. If both losses remain high and close, the model is underfitting. Low, close training and validation losses indicate a better fit. A very large learning rate can cause oscillation, divergence, or NaN values; a classifier stuck near ln(K) cross-entropy may be making uniform guesses across K classes.",
        "Address underfitting by increasing model capacity, improving features, reducing excessive regularization, or training longer. Address overfitting with more data, regularization, augmentation, dropout, a simpler model, or early stopping. Early stopping monitors validation performance; with patience 3 and the best validation loss at epoch 8, stop after three non-improving epochs and restore the epoch-8 weights.",
        "For squared error, expected test error can be decomposed into bias squared, variance, and irreducible noise. Bias reflects systematic error from an overly simple model; variance reflects sensitivity to the training sample; noise cannot be removed by choosing a model. In double descent, test error may rise near the interpolation threshold and decrease again for larger overparameterized models."
      ],
      "analogy": "A/L students who memorize past-paper answers may score well on the same paper but fail on new questions: that is overfitting. Darts clustered away from the bullseye suggest bias; widely scattered darts suggest variance. Wind is irreducible noise.",
      "example": "Validation loss falls from 1.20 to 0.40 by epoch 8, then becomes 0.42, 0.45, and 0.47 at epochs 9–11 while training loss keeps falling. With patience 3, stop at epoch 11 and restore epoch 8. Train error 35% and validation error 37% instead suggest underfitting, not a need for more L2 penalty.",
      "keyPoints": [
        "Train loss down, validation loss up → overfitting; both high and close → underfitting.",
        "Fix underfitting with capacity/features; fix overfitting with data or regularization.",
        "Early stopping restores the best validation checkpoint.",
        "Error = bias² + variance + irreducible noise.",
        "Double descent can lower test error again beyond interpolation."
      ],
      "terms": [
        {
          "en": "Overfitting",
          "si": "Fitting training-specific patterns or noise, causing worse performance on new data."
        },
        {
          "en": "Underfitting",
          "si": "A model too simple to capture important patterns even in its training data."
        },
        {
          "en": "Patience",
          "si": "The number of validation epochs without improvement allowed before early stopping."
        },
        {
          "en": "Irreducible Error",
          "si": "Uncertainty inherent in the data that cannot be eliminated by model choice."
        },
        {
          "en": "Double Descent",
          "si": "Test error can fall again after rising near the interpolation threshold as model size increases."
        },
        {
          "en": "Interpolation Threshold",
          "si": "The capacity at which a model can fit its training examples exactly."
        }
      ],
      "si": "ඔයා past papers උත්තර කටපාඩම් කරලා ඒ paper එකටම ලකුණු ගන්නවා, අලුත් ප්‍රශ්නවලට බැරි වෙනවා නම් ඒක overfitting වගේ. Training loss අඩු වෙද්දී validation loss වැඩි වෙනවා නම් model එක training examples මතම රැඳෙනවා. Validation loss හොඳම වුණේ epoch 8දී, ඊළඟ epochs තුනම නරක නම් epoch 8 weights තියාගෙන නවත්තන්න. Dart එක හැමදාම එක පැත්තකට වැදෙන එක bias, හැමතැනම විසිරෙන එක variance."
    },
    {
      "id": "regularization-deep-dive",
      "title": "Regularization Deep Dive: L1 Sparsity, L2, Elastic Net, Strength λ, Priors, Ridge",
      "plain": "Regularization discourages a model from depending too strongly on particular weights. It trades a little training fit for better behavior on unseen data.",
      "internGuide": ["L2 adds a squared-weight penalty and smoothly shrinks weights; it is also called ridge regularization in linear models.", "L1 adds an absolute-weight penalty and can drive some coefficients exactly to zero, producing sparsity.", "Elastic Net combines L1 and L2. Increasing the strength lambda increases the penalty and can eventually cause underfitting.", "Exam focus: L1 corresponds to a Laplace prior and promotes sparsity; L2 corresponds to a Gaussian prior and stabilizes solutions with correlated features."],
      "examRefs": [
        "FUN-017",
        "FUN-018",
        "FUN-019",
        "FUN-091",
        "FUN-092",
        "FUN-127",
        "FUN-128"
      ],
      "body": [
        "Regularization adds a penalty to the training objective to discourage overly complex parameter values. L2 (Ridge/weight decay) adds λΣw² and shrinks weights, usually without making them exactly zero. L1 (Lasso) adds λΣ|w| and can set weights exactly to zero, producing sparse models and feature selection. Elastic Net combines L1 and L2, which can be useful when features are correlated.",
        "Increasing λ strengthens the penalty: variance often falls, bias and training error often rise. This is a trade-off, not a guarantee of better test performance. In a Bayesian interpretation, L2 corresponds to a Gaussian prior and L1 to a Laplace prior; regularized maximum likelihood is a form of maximum a posteriori estimation.",
        "Ridge regression adds λI to XᵀX, improving conditioning and making inversion possible when the unregularized matrix is singular. Pruning removes selected model weights or structures after training to reduce model size; it is distinct from training-time L1/L2 penalties."
      ],
      "analogy": "Regularization is like asking a cricket batter to avoid wildly changing the swing for every ball: a modest constraint can improve consistency, but too much constraint prevents adapting to the pitch.",
      "example": "With λ = 0.1, L2 adds 0.1Σw² while L1 adds 0.1Σ|w|. If λ is increased, coefficients are penalized more. When many features are correlated and a sparse selection is desired, Elastic Net can combine the shrinkage of L2 with L1 sparsity.",
      "code": {
        "lang": "python",
        "src": "from sklearn.linear_model import Lasso, Ridge, ElasticNet\nimport numpy as np\n\nrng = np.random.default_rng(0)\nX = rng.normal(size=(200, 50))  # 50 input features.\ny = 3 * X[:, 0] - 2 * X[:, 1] + rng.normal(size=200)  # Only two features carry signal, plus noise.\n\nfor m in [Ridge(alpha=1.0), Lasso(alpha=0.1), ElasticNet(alpha=0.1, l1_ratio=0.5)]:\n    m.fit(X, y)\n    print(type(m).__name__, \"exactly zero weights:\", int(np.sum(m.coef_ == 0)))  # Ridge usually keeps weights nonzero; Lasso can set many to zero. alpha is λ.\n"
      },
      "keyPoints": [
        "L1 may make weights zero; L2 shrinks weights toward zero.",
        "Elastic Net combines L1 and L2.",
        "Larger λ trades higher bias for lower variance.",
        "L2 relates to a Gaussian prior; L1 to a Laplace prior.",
        "Ridge adds λI to stabilize XᵀX; pruning is a separate compression step."
      ],
      "terms": [
        {
          "en": "L1 / Lasso",
          "si": "A penalty on absolute weights that can set some coefficients exactly to zero."
        },
        {
          "en": "L2 / Ridge / Weight Decay",
          "si": "A squared-weight penalty that shrinks coefficients toward zero."
        },
        {
          "en": "Elastic Net",
          "si": "A regularizer combining L1 sparsity with L2 shrinkage."
        },
        {
          "en": "Sparsity",
          "si": "Having many model weights or coefficients equal to zero."
        },
        {
          "en": "MAP Estimation",
          "si": "Maximum a posteriori estimation: maximizing likelihood together with a prior."
        },
        {
          "en": "Multicollinearity",
          "si": "Strong correlation among input features, which can destabilize coefficient estimates."
        },
        {
          "en": "Pruning",
          "si": "Removing selected model weights or structures to reduce model size."
        }
      ],
      "si": "ඔයා cricket team එකේ එකම වගේ batting කරන ක්‍රීඩකයන් ගොඩක් තියෙනවා гэж හිත. L1 penalty එකෙන් model එක සමහර weights හරියටම zero කරලා features цනීපයක් තෝරන්න පුළුවන්. L2 නම් weights පොඩි කරනවා, බොහෝවිට zero කරන්නේ නෑ. λ වැඩි කළොත් model එක සරල වෙන්න පුළුවන්, හැබැයි වැඩියෙන් දැම්මොත් pattern එක ඉගෙනගන්නත් බැරි වෙයි."
    },
    {
      "id": "classical-supervised-deep-dive",
      "title": "Classical Models Under the Hood: Linear & Logistic Regression, SVM & Kernels, kNN, Trees",
      "plain": "Classical models solve different kinds of decision boundaries. Learn the assumption each model makes instead of memorizing a list of algorithm names.",
      "internGuide": ["Linear regression predicts a number from a weighted sum. Logistic regression applies a sigmoid to a weighted sum to estimate a binary-class probability.", "kNN predicts from nearby training examples and therefore depends on meaningful feature scales and a useful distance metric.", "Decision trees split features into regions; SVMs maximize a separating margin and kernels allow nonlinear boundaries without explicitly creating every transformed feature.", "Exam focus: choose regression for continuous targets and classification for categories. Trees usually do not need scaling; kNN and SVM usually benefit from it."],
      "examRefs": [
        "FUN-036",
        "FUN-037",
        "FUN-040",
        "FUN-041",
        "FUN-087",
        "FUN-088",
        "FUN-089",
        "FUN-090"
      ],
      "body": [
        "Ordinary least squares linear regression has the normal-equation solution w=(XᵀX)⁻¹Xᵀy when the inverse exists. X is generally rectangular, so the expression inverts XᵀX, not X. Logistic regression is a classifier: it models log-odds linearly, log(p/(1−p))=w·x+b, then uses the sigmoid to obtain a probability between zero and one.",
        "A linear SVM selects a separating boundary with the widest margin; the closest training points are support vectors. Kernel methods such as RBF compute similarities equivalent to an implicit higher-dimensional representation, allowing nonlinear boundaries without explicitly building that space. kNN stores examples and predicts from nearby points; larger k smooths the boundary, usually lowering variance while raising bias.",
        "Classification trees choose splits that reduce impurity, often Gini (1−Σp²) or entropy. Regression trees reduce target variance or mean squared error. A split is evaluated by the weighted impurity of its child nodes."
      ],
      "analogy": "An SVM draws a road line with the widest possible buffer between buses and tuk-tuks; the vehicles nearest the line determine its position. kNN predicts a new neighbour’s cricket team from the nearby homes, and asking more neighbours smooths the vote.",
      "example": "At logit 0, odds=e⁰=1 and p=0.5. At logit ln 3, odds=3 and p=3/(1+3)=0.75. A tree node with 50 spam and 50 ham has Gini 1−(0.5²+0.5²)=0.5; a pure 100/0 node has Gini 0.",
      "keyPoints": [
        "OLS uses XᵀX, not an inverse of rectangular X.",
        "Logistic regression models log-odds for classification.",
        "SVM maximizes margin; kernels enable nonlinear boundaries.",
        "kNN is a lazy learner; larger k smooths predictions.",
        "Classification trees use impurity; regression trees reduce target variance/MSE."
      ],
      "terms": [
        {
          "en": "Normal Equation",
          "si": "The closed-form OLS solution w=(XᵀX)⁻¹Xᵀy when the inverse exists."
        },
        {
          "en": "Log-Odds (Logit)",
          "si": "The value log(p/(1−p)) modeled linearly by logistic regression."
        },
        {
          "en": "Support Vectors",
          "si": "Training points nearest the SVM boundary that determine its margin."
        },
        {
          "en": "Kernel Trick",
          "si": "Computing implicit high-dimensional similarities without building that space."
        },
        {
          "en": "Lazy Learner",
          "si": "A method such as kNN that stores examples and delays most computation until prediction."
        },
        {
          "en": "Gini Impurity",
          "si": "1−Σp², a measure of class mixing in a tree node; zero is pure."
        },
        {
          "en": "Information Gain",
          "si": "The reduction in entropy produced by a split."
        }
      ],
      "si": "ඔයා Colombo පාරක buses එක පැත්තකත් tuk-tuks අනිත් පැත්තකත් තියෙනවා කියලා හිතන්න; SVM එක ඒ දෙක අතර වැඩිම ඉඩ තියෙන ඉර හොයනවා. ඉරට ළඟම වාහන තමයි support vectors. අලුත් ගෙදරක cricket team එක guess කරනකොට ළඟම ගෙවල් 5ක අයගෙන් අහන එක kNN වගේ. Tree එකේ 50 spam, 50 ham තියෙන node එකේ Gini 0.5යි; හැමෝම එකම class නම් 0යි."
    },
    {
      "id": "unsupervised-and-embeddings-plots",
      "title": "Unsupervised Deep Dive: k-means & Elbow, PCA Maths, Reading t-SNE / UMAP Plots",
      "plain": "Unsupervised methods explore data without target labels. Clustering groups examples, while dimensionality reduction creates smaller representations for compression, modeling, or visualization.",
      "internGuide": ["k-means alternates between assigning points to the closest centroid and moving each centroid to its assigned mean. You must choose k.", "PCA finds orthogonal directions that explain the most variance after the data is centered; standardize first when feature units are very different.", "t-SNE and UMAP are mainly neighborhood visualizations. The apparent distance and size of separated clusters may be distorted.", "Exam focus: inertia always falls as k increases, so choose an elbow rather than the smallest inertia. Do not interpret a 2D nonlinear plot as exact global geometry."],
      "examRefs": [
        "FUN-034",
        "FUN-035",
        "FUN-083",
        "FUN-084",
        "FUN-131",
        "FUN-132"
      ],
      "body": [
        "k-means alternates between assigning each point to its nearest centroid and moving each centroid to its cluster mean. Choose k in advance; initial centroids can lead to local optima, so k-means++ initialization and multiple restarts help. Inertia (within-cluster sum of squares) never increases as k grows, so the elbow method looks for where improvement becomes small rather than simply choosing the minimum.",
        "PCA is an unsupervised linear dimensionality-reduction method. It finds orthogonal directions of high variance, and each component is a combination of original features. Center features before PCA; standardize too when their units differ. Components do not use labels, so they do not guarantee retention of label-relevant information.",
        "t-SNE and UMAP produce nonlinear low-dimensional visualizations, primarily preserving local neighbourhoods. Do not interpret distances between separated clusters or their sizes as faithful global distances. They are not substitutes for a linear projection such as PCA."
      ],
      "analogy": "Imagine locating k shops around Colombo: households use the nearest shop, then each shop moves toward the middle of its customers. A UMAP plot is like flattening a Sri Lankan map onto paper: nearby houses may stay nearby, but district sizes and distances can be distorted.",
      "example": "If inertia for k=1..5 is 1000, 520, 260, 230, 215, improvement slows after k=3, suggesting an elbow near 3. If 20 PCA components retain 95% of variance from 200 features, keep 20 components—not the other 180—to represent the data compactly.",
      "keyPoints": [
        "k-means requires k and can reach a local optimum.",
        "Elbow selects where added clusters give diminishing inertia improvement.",
        "PCA centers data; components mix original features and ignore labels.",
        "t-SNE/UMAP are mainly for local visual structure.",
        "Cluster distances and sizes in nonlinear plots may mislead."
      ],
      "terms": [
        {
          "en": "Inertia (WCSS)",
          "si": "The sum of squared distances from points to their assigned centroids."
        },
        {
          "en": "Elbow Method",
          "si": "Choosing k where additional clusters yield diminishing inertia improvement."
        },
        {
          "en": "Silhouette Score",
          "si": "A measure comparing a point’s fit to its own cluster and other clusters."
        },
        {
          "en": "Explained Variance Ratio",
          "si": "The fraction of total variance represented by a principal component."
        },
        {
          "en": "Centering",
          "si": "Subtracting each feature’s mean; required before PCA."
        },
        {
          "en": "t-SNE / UMAP",
          "si": "Nonlinear methods for visualizing local structure in two or three dimensions."
        }
      ],
      "si": "ඔයා Colombo වල කඩ 4ක් තෝරලා හැම ගෙදරකටම ළඟම කඩේ assign කරනවා, පස්සේ කඩේ customers මැදට ගෙනියනවා කියලා k-means හිතන්න. k වැඩි කළාම inertia අඩුවෙනවා, ඒ නිසා elbow එකේ වැඩිදියුණුව අඩුවෙන තැන බලන්න. PCA එක features ගොඩක් එකතු කරලා variance වැඩි දිශා හොයනවා. UMAP map එකේ ළඟ points ළඟින් පෙනුණත් දුරින් තියෙන clusters දෙකේ සැබෑ දුර කියන්න බෑ."
    },
    {
      "id": "tree-ensembles-deep-dive",
      "title": "Tree Ensembles Deep Dive: Why Random Forests Work, OOB 36.8%, Boosting & Shrinkage",
      "plain": "Tree ensembles combine many imperfect trees. Random forests reduce variance by averaging diverse trees, while boosting builds trees sequentially to correct earlier errors.",
      "internGuide": ["A random forest trains trees on bootstrap samples and random feature subsets so their errors are less correlated.", "For a large bootstrap sample, about 63.2% of rows appear at least once and about 36.8% are out-of-bag for that tree.", "Gradient boosting adds small trees that follow the current loss gradient. A smaller learning rate usually requires more trees and should be paired with validation-based early stopping.", "Exam focus: bagging trains trees independently and averages them; boosting is sequential. OOB rows provide an internal validation estimate for random forests."],
      "examRefs": [
        "FUN-038",
        "FUN-039",
        "FUN-085",
        "FUN-086",
        "FUN-129",
        "FUN-130"
      ],
      "body": [
        "A deep decision tree can fit training data closely and have high variance. A random forest trains trees on bootstrap samples and considers random feature subsets at splits. Averaging many sufficiently decorrelated trees reduces variance; for a bootstrap sample, an example is omitted with probability approximately (1−1/n)^n≈e⁻¹≈36.8%, so those out-of-bag examples can estimate performance.",
        "Boosting builds trees sequentially, with later trees correcting errors made by earlier ones. Gradient boosting follows gradients of a loss; shrinkage (a smaller learning rate) limits each tree’s contribution, often requiring more trees. Random forests primarily reduce variance by averaging; boosting can reduce bias by sequentially fitting residual structure.",
        "Ensembles are powerful tabular baselines, but depth, number of trees, learning rate, and validation strategy still matter. Avoid fitting hyperparameters against the test set."
      ],
      "analogy": "A random forest is like asking many cricket umpires who saw slightly different views and averaging their decisions. Boosting is like a coach reviewing the previous over’s mistakes and adjusting the next practice step by step.",
      "example": "For n=1000 training rows, bootstrap omission probability is approximately (1−1/1000)^1000≈0.368, so about 368 rows are out-of-bag for a given tree. Lowering a boosting learning rate to 0.05 makes each tree contribute less than at 0.1.",
      "keyPoints": [
        "Random forests bootstrap rows and randomize features to decorrelate trees.",
        "Averaging decorrelated trees reduces variance.",
        "OOB rows provide an internal estimate for each bootstrap tree.",
        "Boosting adds trees sequentially to correct prior errors.",
        "Shrinkage reduces each boosting step and usually calls for more trees."
      ],
      "terms": [
        {
          "en": "Bagging",
          "si": "Training models on bootstrap samples and combining their predictions."
        },
        {
          "en": "Bootstrap Sample",
          "si": "A sample drawn with replacement from the original dataset."
        },
        {
          "en": "Out-of-Bag (OOB)",
          "si": "Examples omitted from a tree’s bootstrap sample, usable for an internal evaluation."
        },
        {
          "en": "Shrinkage (eta)",
          "si": "A boosting learning rate that scales down each added tree’s contribution."
        },
        {
          "en": "Residual",
          "si": "The difference between an observed target and a model prediction."
        },
        {
          "en": "Decorrelation",
          "si": "Reducing similarity between model errors so averaging can reduce variance."
        }
      ],
      "si": "ඔයා cricket match එකක් ගැන එකම commentatorගෙන් විතරක් නොඅහලා වෙනස් අයගෙන් අහලා average කරනවා නම් random forest වගේ අදහසක්. හැම tree එකකටම data sample එකක් සහ feature ටිකක් වෙනස් නිසා trees ටික එකිනෙකින් වෙනස් වෙනවා. Bootstrap sample එකක rows 1000ක් තිබුණොත් row එකක් මඟහැරෙන්න සම්භාවිතාව ආසන්නව 36.8%යි. Boosting නම් කලින් වැරදි හදාගෙන ඊළඟ tree එක හදනවා."
    },
    {
      "id": "metrics-decisions-deep-dive",
      "title": "Metrics That Drive Decisions: Imbalance, Recall vs Precision, Threshold, ROC-AUC, PR, Calibration, Macro F1",
      "plain": "A metric is useful only when it matches the cost of mistakes. Accuracy can hide failure when one class is rare, so choose metrics and thresholds from the real decision problem.",
      "internGuide": ["Precision asks how many predicted positives were correct; recall asks how many actual positives were found.", "Changing the decision threshold trades false positives against false negatives. It does not retrain the model.", "ROC-AUC measures ranking across thresholds, while precision-recall curves are often more informative for rare positive classes.", "Exam focus: macro F1 weights every class equally; micro F1 pools decisions and is dominated by common classes. Calibration asks whether predicted probabilities match observed frequencies."],
      "examRefs": [
        "FUN-031",
        "FUN-033",
        "FUN-056",
        "FUN-057",
        "FUN-058",
        "FUN-059",
        "FUN-133",
        "FUN-134"
      ],
      "body": [
        "Accuracy is correct predictions divided by all predictions and can be misleading with imbalanced classes. Precision=TP/(TP+FP) answers how many predicted positives were truly positive; recall=TP/(TP+FN) measures how many actual positives were found. F1=2PR/(P+R) balances them. Choose a threshold based on the relative cost of false positives and false negatives.",
        "ROC-AUC measures ranking across thresholds; PR curves show precision versus recall and are often more informative when positives are rare. Macro averages weight classes equally, while micro aggregates counts and is dominated more by common classes; weighted averages weight each class by its support. Calibration asks whether predicted probabilities match observed frequencies.",
        "For decisions, a high-recall threshold may be appropriate when missing a positive is costly; a high-precision threshold may be appropriate when false alarms are costly. Calibration methods include temperature scaling, Platt scaling, and isotonic regression; fit calibration on held-out data."
      ],
      "analogy": "For a Colombo bus delay alert, recall asks how many real delays were caught; precision asks how many alerts were truly delays. A very wide net catches more fish but also more plastic, so the useful threshold depends on the cost of each mistake.",
      "example": "With TP=40, FP=10, FN=20, precision=40/50=0.80 and recall=40/60≈0.67; TN does not enter either formula. A calibrated forecast of 0.9 should be correct about 90% of the time over comparable cases.",
      "code": {
        "lang": "python",
        "src": "from sklearn.metrics import roc_auc_score, average_precision_score, f1_score\nfrom sklearn.calibration import CalibratedClassifierCV\nfrom sklearn.linear_model import LogisticRegression\n\nclf = LogisticRegression(class_weight=\"balanced\", max_iter=1000).fit(X_tr, y_tr)\np = clf.predict_proba(X_val)[:, 1]\nprint(\"ROC-AUC\", roc_auc_score(y_val, p), \"PR-AUC\", average_precision_score(y_val, p))\npred = (p >= 0.3).astype(int)  # Lower threshold: recall rises, precision may fall.\n\ncal = CalibratedClassifierCV(clf, method=\"isotonic\", cv=5).fit(X_tr, y_tr)  # Fit calibration using held-out folds."
      },
      "keyPoints": [
        "Accuracy can hide poor rare-class performance.",
        "Precision uses TP and FP; recall uses TP and FN.",
        "F1 is the harmonic mean of precision and recall.",
        "Macro gives equal class weight; micro aggregates counts.",
        "ROC/PR curves assess rankings across thresholds; calibration assesses probability quality."
      ],
      "terms": [
        {
          "en": "Class Weights",
          "si": "Weights that change the contribution of classes to a training loss."
        },
        {
          "en": "ROC-AUC",
          "si": "Area under the ROC curve, measuring positive-versus-negative ranking across thresholds."
        },
        {
          "en": "PR Curve",
          "si": "Precision plotted against recall across decision thresholds."
        },
        {
          "en": "Calibration",
          "si": "Agreement between predicted probabilities and observed event frequencies."
        },
        {
          "en": "Temperature Scaling",
          "si": "Calibration by dividing logits by a learned scalar temperature before softmax."
        },
        {
          "en": "Platt Scaling / Isotonic Regression",
          "si": "Post-hoc methods mapping model scores to probabilities, using a sigmoid or a monotonic fit."
        },
        {
          "en": "Macro vs Micro F1",
          "si": "Macro averages per-class F1 equally; micro computes F1 from pooled counts."
        }
      ],
      "si": "ඔයා Colombo traffic app එකක delay alert එකක් බලනවා නම් recall කියන්නේ ඇත්ත delay වලින් කීයක් අල්ලගත්තද කියන එක. Precision කියන්නේ alert 10ක් දුන්නොත් කීයක් ඇත්තටම delay ද කියන එක. වැරදි alert එකක් මිල අධික නම් precision වැදගත්, delay එකක් මඟහැරීම නරක නම් recall වැදගත්. Model එක 0.9 probability කියන අවස්ථා 100කින් 90ක් විතර හරි නම් calibration හොඳයි."
    },
    {
      "id": "exam-calculations-counting",
      "title": "Exam Calculations Made Easy (Part 1): Precision, Recall, F1, Macro vs Micro, Bayes, Shapes & Counts",
      "plain": "This topic turns common exam formulas into a repeatable process: write the quantities, substitute the numbers, and check what the result means before choosing an answer.",
      "internGuide": ["Precision = TP/(TP+FP), recall = TP/(TP+FN), and F1 = 2PR/(P+R). Label the confusion-matrix cells before calculating.", "Macro averaging calculates a metric per class and averages the classes. Micro averaging first totals the decisions across classes.", "Bayes' rule updates a prior probability using how likely the evidence is under each case.", "Exam focus: track tensor dimensions and bias terms carefully. Many distractors use the correct formula with the wrong denominator or forget a bias vector."],
      "examRefs": [
        "FUN-011",
        "FUN-028",
        "FUN-029",
        "FUN-030",
        "FUN-032",
        "FUN-074",
        "FUN-075",
        "FUN-097",
        "FUN-109",
        "FUN-134",
        "FUN-135",
        "FUN-139"
      ],
      "body": [
        "Precision=TP/(TP+FP); recall=TP/(TP+FN). True negatives do not appear in either denominator. F1=2PR/(P+R), the harmonic mean, which is pulled toward the smaller score. Macro F1 averages class F1 scores equally; weighted F1 weights by class support; micro F1 aggregates TP/FP/FN and in single-label multiclass classification equals accuracy.",
        "Steps per epoch are dataset rows divided by batch size (round up when the final batch is retained). Effective batch size is micro-batch × accumulation steps × number of data-parallel GPUs. A linear layer with in inputs and out outputs has in×out+out parameters when it has a bias. Matrix dimensions (m,n)@(n,p) produce (m,p); dot products multiply matching entries and sum them.",
        "For Bayes base-rate questions, count people rather than percentages. In FP32 Adam training, parameters, gradients, and two Adam moments use roughly 16 bytes per parameter before activations and other overhead."
      ],
      "analogy": "Precision and recall are like a fishing net: precision is the share of the catch that is fish, and recall is the share of all fish caught. A large net improves recall but also catches rubbish. For Bayes, imagine a crowd of 10,000 instead of juggling percentages.",
      "example": "TP=40, FP=10 gives precision=40/50=0.80; TP=45, FN=15 gives recall=45/60=0.75. Then F1=2×0.8×0.75/(0.8+0.75)≈0.774. For 10,000 people, 1% prevalence means 100 cases; with 90% sensitivity there are 90 true positives. A 9% false-positive rate among 9,900 others gives 891 false positives, so P(disease|positive)=90/981≈9.2%, not 90%.",
      "keyPoints": [
        "Precision=TP/(TP+FP); recall=TP/(TP+FN).",
        "F1=2PR/(P+R); macro, micro, and weighted averages differ.",
        "Steps=rows/batch; effective batch=micro×accumulation×GPUs.",
        "Linear parameters=in×out+out; (m,n)@(n,p)=(m,p).",
        "Bayes requires prevalence; FP32 plus Adam is about 16 bytes per parameter."
      ],
      "terms": [
        {
          "en": "Harmonic Mean",
          "si": "A mean pulled toward smaller values; F1 is the harmonic mean of precision and recall."
        },
        {
          "en": "Gradient Accumulation",
          "si": "Adding gradients across micro-batches before one optimizer update."
        },
        {
          "en": "Effective Batch Size",
          "si": "The examples contributing to one optimizer step."
        },
        {
          "en": "Base Rate",
          "si": "The prevalence of a condition in the population."
        },
        {
          "en": "Sensitivity / Specificity",
          "si": "Sensitivity is recall; specificity is the fraction of true negatives correctly identified."
        },
        {
          "en": "Optimizer States",
          "si": "Additional values maintained by an optimizer, such as Adam moments m and v."
        }
      ],
      "si": "ඔයා මාළු දැලක් දානවා කියලා හිතන්න: අල්ලපු දේවල් අතර මාළු කොච්චරද කියන්නේ precision, වැවේ මාළු අතරින් කීයක් අල්ලගත්තද කියන්නේ recall. TP 40, FP 10 නම් precision 40÷50=0.8. TP 45, FN 15 නම් recall 45÷60=0.75. ලෙඩ prevalence 1% නම් මිනිස්සු 10,000කින් ලෙඩ 100ක් විතරයි, ඒ නිසා positive test එකක් ලැබුණා කියලා 90% ලෙඩ කියලා හිතන්න එපා."
    },
    {
      "id": "exam-calculations-softmax-ce",
      "title": "Exam Calculations Made Easy (Part 2): Softmax, Stable Softmax, Cross-Entropy, ln(K), Entropy, KL, Label Smoothing",
      "plain": "These calculations describe how class scores become probabilities and how training penalizes confident mistakes. The safest method is to calculate one step at a time.",
      "internGuide": ["Softmax exponentiates logits and divides by their sum. Subtract the largest logit first to avoid numerical overflow without changing the probabilities.", "For a one-hot target, cross-entropy is the negative natural log of the probability assigned to the correct class.", "Entropy measures uncertainty in one distribution; KL divergence measures how one distribution differs from another and is not symmetric.", "Exam focus: uniform prediction over K classes has cross-entropy ln(K). Label smoothing moves a small amount of target mass away from the correct class."],
      "examRefs": [
        "FUN-071",
        "FUN-072",
        "FUN-073",
        "FUN-076",
        "FUN-077",
        "FUN-116",
        "FUN-118"
      ],
      "body": [
        "Softmax exponentiates each logit, sums the exponentials, and divides each by that sum; probabilities are positive and total 1. Since exponentials of very large logits can overflow, subtract the maximum logit first. Adding or subtracting the same constant from every logit leaves softmax unchanged.",
        "For a correct-class probability p, cross-entropy is −ln(p). A uniform K-class prediction has loss ln(K); for K=10 this is about 2.30, which can indicate the model is still guessing uniformly. Entropy in bits uses log₂; a fair coin has one bit of entropy. KL divergence is nonnegative, zero only for equal distributions, and asymmetric, so it is not a distance metric.",
        "With target=(1−ε)one_hot+ε/K, the correct class receives 1−ε+ε/K and each other class receives ε/K. Keep this formula distinct from variants that distribute ε only across incorrect classes."
      ],
      "analogy": "Softmax turns cricket scores into shares of a probability total. Stable softmax is like subtracting the top score from every score before calculating: the gaps remain the same but huge exponentials are avoided. KL(P‖Q) and KL(Q‖P) can differ, just as a trip fare need not be symmetric in practice.",
      "example": "For logits [0, ln3], exponentials are [1,3], sum 4, probabilities [0.25,0.75]. For [1000,1001,1002], subtract 1002 to get [−2,−1,0]. Cross-entropy for p=0.25 is −ln(0.25)≈1.386. With ε=0.1 and K=5, correct target=0.92 and each other target=0.02; total=0.92+4×0.02=1.",
      "code": {
        "lang": "python",
        "src": "import numpy as np\n\ndef stable_softmax(z):\n    z = np.asarray(z, dtype=np.float32)\n    e = np.exp(z - z.max())  # Subtracting the maximum prevents overflow.\n    return e / e.sum()\n\nprint(stable_softmax([1000, 1001, 1002]))  # [0.090 0.245 0.665]\nprint(stable_softmax([0, np.log(3)]))  # [0.25 0.75]\nprint(-np.log(0.25), np.log(10))  # 1.386 (cross-entropy), 2.303 (ln K for K=10)\neps, K = 0.1, 5\ntarget = (1 - eps) * np.eye(K)[0] + eps / K  # Apply label smoothing.\nprint(target)  # [0.92 0.02 0.02 0.02 0.02]"
      },
      "keyPoints": [
        "Softmax: exponentiate, sum, divide; equal logit shifts do not change output.",
        "Subtract max(logits) for numerical stability.",
        "Cross-entropy=−ln(correct-class probability); uniform K-way loss=ln(K).",
        "Entropy uses log base; fair coin entropy is 1 bit.",
        "KL is nonnegative but asymmetric; label smoothing depends on the stated formula."
      ],
      "terms": [
        {
          "en": "Logits",
          "si": "Raw model scores before a probability transformation such as softmax."
        },
        {
          "en": "Overflow / Underflow",
          "si": "Numerical values exceeding the representable range or becoming too small to represent."
        },
        {
          "en": "Nats vs Bits",
          "si": "Units of information: natural logarithms give nats; base-2 logarithms give bits."
        },
        {
          "en": "Shannon Entropy",
          "si": "Uncertainty of a distribution, −Σp log p, with units determined by the log base."
        },
        {
          "en": "KL Divergence",
          "si": "A nonnegative, generally asymmetric measure of how one probability distribution differs from another."
        },
        {
          "en": "Label Smoothing",
          "si": "Replace a one-hot target with a softer distribution to avoid assigning all target mass to one class."
        }
      ],
      "si": "ඔයා cricket තරග ලකුණු probability වලට හරවනවා කියලා softmax හිතන්න; logits [0, ln 3] නම් e අගයන් 1 සහ 3, එකතුව 4, probabilities 0.25 සහ 0.75. ලොකු අගයන් 1000, 1001, 1002 නම් හැම එකෙන්ම 1002 අඩු කරලා ගණන් කළොත් overflow වෙන්නේ නෑ. හරි class probability 0.25 නම් loss −ln(0.25) ආසන්නව 1.386. ε 0.1 සහ classes 5 නම් target එක 0.92, අනෙක් ඒවා 0.02යි."
    },
    {
      "id": "exam-calculations-training-tricks",
      "title": "Exam Calculations Made Easy (Part 3): Gradient Clipping, Warmup, Inverted Dropout, Adam Bias Correction",
      "plain": "These training calculations are small but easy to confuse. Each technique solves a different problem: unstable gradients, risky early updates, regularization, or biased optimizer statistics.",
      "internGuide": ["Global-norm clipping rescales the entire gradient vector only when its norm exceeds the limit, preserving its direction.", "Linear warmup increases the learning rate from a small value to its target during early steps.", "Inverted dropout scales surviving activations during training by 1/(1-p), so no extra scaling is needed at inference.", "Exam focus: Adam's moving averages start near zero and need bias correction early in training. Do not confuse norm clipping with clamping each gradient element."],
      "examRefs": [
        "FUN-113",
        "FUN-121",
        "FUN-123",
        "FUN-147"
      ],
      "body": [
        "Global-norm clipping limits the length of the full gradient vector. If its norm exceeds the maximum, multiply every component by max_norm/norm; this preserves direction. Linear warmup increases learning rate from zero to a peak: lr=peak×step/warmup_steps.",
        "Inverted dropout randomly zeros activations during training and scales surviving activations by 1/(1−p), so no dropout scaling is needed at inference. Adam uses moving averages m and v; because these start at zero, bias correction divides by (1−βᵗ) to counter early underestimation."
      ],
      "analogy": "Gradient clipping is like reducing the volume of every instrument equally when the whole band is too loud; the balance and direction stay the same. Warmup starts the learning rate gently before reaching its full pace.",
      "example": "For gradient [6,8], norm=√(36+64)=10. With max_norm=1, scale by 1/10 to get [0.6,0.8]. With dropout p=0.2, surviving values are multiplied by 1/0.8=1.25. For Adam β₁=0.9 at step 1, m₁=0.1g₁ and m̂₁=m₁/(1−0.9)=g₁.",
      "code": {
        "lang": "python",
        "src": "import torch\n\ng = torch.tensor([6.0, 8.0])\nnorm = g.norm()  # 10\nclipped = g * min(1.0, 1.0 / norm.item())  # [0.6, 0.8]\nprint(clipped)\n\n\npeak, warm = 3e-4, 1000\nprint(peak * 250 / warm)  # 7.5e-05 after warmup.\n\ndrop = torch.nn.Dropout(p=0.2).train()\nprint(drop(torch.ones(8)))  # Retained values are 1.25; the rest are zero.\nm1 = 0.1 * 5.0; print(m1 / (1 - 0.9 ** 1))  # g=5; bias correction returns 5.0."
      },
      "keyPoints": [
        "Global clipping scales all gradients by max_norm/norm when necessary.",
        "Warmup lr=peak×step/warmup_steps.",
        "Inverted dropout scales survivors by 1/(1−p) during training.",
        "Adam bias correction divides moments by 1−βᵗ."
      ],
      "terms": [
        {
          "en": "Global Norm Clipping",
          "si": "Scale the full gradient vector when its L2 norm exceeds a chosen maximum."
        },
        {
          "en": "L2 Norm",
          "si": "The square root of the sum of squared vector components."
        },
        {
          "en": "Linear Warmup",
          "si": "Increase the learning rate linearly from a low value to a target value at training start."
        },
        {
          "en": "Inverted Dropout",
          "si": "Drop activations during training and scale survivors by 1/(1−p), requiring no inference scaling."
        },
        {
          "en": "Bias Correction",
          "si": "Correct Adam’s zero-initialized moment averages by dividing by 1−βᵗ."
        },
        {
          "en": "β₁, β₂",
          "si": "Adam decay coefficients for the first- and second-moment averages."
        }
      ],
      "si": "ඔයා cricket team එකේ හැමෝම එකවර අධික හයියෙන් කෑගහනවා නම් හැමෝගෙම volume එක සමානව අඩු කරනවා වගේ gradient clipping වැඩ කරනවා. [6,8] vector එකේ norm 10යි, max 1 නම් 0.1කින් scale කරලා [0.6,0.8] ලැබнэ. Dropout p=0.2 නම් ඉතුරු activation 1.25කින් ගුණ කරනවා. Adam මුල් පියවරේ average එක අඩුවෙන් පෙනෙන නිසා bias correction එක යොදනවා."
    },
    {
      "id": "loss-functions-deep-dive",
      "title": "Choosing the Right Loss: MSE vs CE, Multi-Label, Huber, Focal Loss, Log-Probs, Likelihood View, KL Directions",
      "plain": "The loss function defines what kind of mistake the model should reduce. Choose it from the target type and error cost, not from the model name alone.",
      "internGuide": ["Use MSE or related regression losses for continuous targets. Huber is less sensitive than MSE to large outliers.", "Use categorical cross-entropy for one mutually exclusive class and binary cross-entropy per class for independent multi-label targets.", "Focal loss reduces the weight of easy examples so training can focus on difficult or rare cases.", "Exam focus: forward KL is generally mode-covering and reverse KL mode-seeking. Many loss APIs expect logits and apply sigmoid, softmax, or log-softmax internally."],
      "examRefs": [
        "FUN-014",
        "FUN-015",
        "FUN-078",
        "FUN-111",
        "FUN-112",
        "FUN-117",
        "FUN-119",
        "FUN-124",
        "FUN-125",
        "FUN-126"
      ],
      "body": [
        "Choose a loss that matches the target. Regression commonly uses MSE; mutually exclusive classes use softmax with categorical cross-entropy; multi-label tasks use an independent sigmoid and binary cross-entropy for each label. Using MSE on class indices falsely treats category numbers as ordered distances.",
        "MSE strongly penalizes large residuals; MAE grows linearly; Huber is quadratic for small errors and linear for large ones. Focal loss multiplies cross-entropy by (1−p_t)^γ to reduce the contribution of easy examples, useful in heavily imbalanced detection tasks. Log probabilities avoid underflow when multiplying many small probabilities.",
        "PyTorch CrossEntropyLoss expects raw logits and performs log-softmax internally; passing already-softmaxed values applies the operation twice and can weaken learning. MSE corresponds to Gaussian-noise maximum likelihood, MAE to Laplace-noise likelihood, and binary cross-entropy to Bernoulli targets. H(p,q)=H(p)+KL(p‖q); forward KL tends to cover modes while reverse KL tends to select a mode."
      ],
      "analogy": "Huber loss is like a teacher who corrects small mistakes carefully but does not let one extreme outlier dominate the whole class. Focal loss spends less effort on easy questions and more on difficult ones.",
      "example": "With Huber δ=1, error 0.5 gives 0.5×0.5²=0.125; error 10 gives 10−0.5=9.5 instead of MSE’s 100. For p_t=0.9 and γ=2, focal multiplier=(0.1)²=0.01. In PyTorch, pass logits such as [2.0,0.5,−1.0] directly to CrossEntropyLoss, not softmax(logits).",
      "code": {
        "lang": "python",
        "src": "import torch, torch.nn as nn\n\nlogits = torch.tensor([[2.0, 0.5, -1.0]])\ny = torch.tensor([0])  # Integer class index; no one-hot encoding required.\ngood = nn.CrossEntropyLoss()(logits, y)  # Correct: pass raw logits.\nbad = nn.CrossEntropyLoss()(torch.softmax(logits, -1), y)  # Bug: applying softmax twice.\nprint(good.item(), bad.item())\n\nmulti = nn.BCEWithLogitsLoss()  # Multi-label: independent sigmoid per tag.\nprint(multi(torch.tensor([[1.2, -0.3]]), torch.tensor([[1.0, 1.0]])))\nprint(nn.HuberLoss(delta=1.0)(torch.tensor([10.0]), torch.tensor([0.0])))  # The result is 9.5."
      },
      "keyPoints": [
        "Regression→MSE/MAE/Huber; exclusive classes→softmax CE; multi-label→sigmoid BCE.",
        "Huber limits outlier influence; focal loss downweights easy examples.",
        "Use log probabilities to prevent underflow.",
        "PyTorch CrossEntropyLoss takes raw logits.",
        "Cross-entropy=entropy+KL; forward and reverse KL behave differently."
      ],
      "terms": [
        {
          "en": "Huber Loss",
          "si": "A regression loss that is quadratic for small residuals and linear for large residuals."
        },
        {
          "en": "Focal Loss",
          "si": "Cross-entropy weighted to reduce contributions from easy examples."
        },
        {
          "en": "Multi-Label Classification",
          "si": "Predicting multiple independently applicable labels for each example."
        },
        {
          "en": "BCEWithLogitsLoss",
          "si": "Binary cross-entropy combined with sigmoid in a numerically stable operation."
        },
        {
          "en": "Maximum Likelihood",
          "si": "Choose parameters that make the observed data most probable under the model."
        },
        {
          "en": "Mode-Covering / Mode-Seeking",
          "si": "Forward KL tends to cover modes; reverse KL tends to concentrate on a mode."
        }
      ],
      "si": "ඔයාට එක ticket එකකට category එකක් විතරක් නම් softmax සහ cross-entropy ගන්න, article එකකට politicsත් economyත් දෙකම තිබුණොත් එක් label එකකට sigmoid ගන්න. Sensor එකක අසාමාන්‍ය 10ක error එකක් තිබුණොත් MSE 100 දක්වා දඬුවම් කරනවා, Huber δ=1 නම් 9.5යි. PyTorch CrossEntropyLoss එකට raw logits දෙන්න; softmax කලින් දාන්න එපා. Focal loss එක ලේසි examples වල බර අඩු කරලා අමාරු ඒවාට අවධානය දෙනවා."
    },
    {
      "id": "nn-training-mechanics",
      "title": "Neural Network Mechanics: Epochs & Steps, Gradient Descent, Backprop, Activations, Initialization, Vanishing / Exploding Gradients, Universal Approximation",
      "plain": "A neural network learns by making a prediction, measuring its error, calculating how each parameter affected that error, and updating the parameters repeatedly.",
      "internGuide": ["One epoch processes the full training set; one optimizer step normally processes one mini-batch. Steps per epoch are approximately dataset size divided by batch size.", "The forward pass creates predictions and loss. Backpropagation uses the chain rule to calculate gradients; the optimizer applies the update.", "Nonlinear activations let stacked layers represent nonlinear functions. Initialization and residual connections help signals and gradients remain usable in deep networks.", "Exam focus: the universal approximation theorem describes representational capacity, not whether gradient descent will find a good solution or whether it will generalize."],
      "examRefs": [
        "FUN-010",
        "FUN-012",
        "FUN-013",
        "FUN-023",
        "FUN-024",
        "FUN-025",
        "FUN-026",
        "FUN-027",
        "FUN-064",
        "FUN-065",
        "FUN-100",
        "FUN-122",
        "FUN-149"
      ],
      "body": [
        "A neural network composes linear transformations and nonlinear activations. Without nonlinearities, multiple layers collapse into one linear transformation, so depth adds no expressive power. Backpropagation applies the chain rule to compute gradients; the optimizer then updates parameters. A training step commonly uses one mini-batch.",
        "Zero-initializing all units gives them identical gradients and preserves symmetry, preventing them from learning different features. Random initialization breaks symmetry. He initialization is suited to ReLU networks; Xavier/Glorot is commonly used for tanh-like activations. ReLU outputs [0,∞), sigmoid (0,1), and tanh (−1,1).",
        "Vanishing gradients impede early layers; ReLU activations and residual connections can help. Exploding gradients can be controlled with clipping. The universal approximation theorem describes representational capacity under assumptions, but does not guarantee efficient training or generalization."
      ],
      "analogy": "A relay team needs each runner to contribute a distinct leg: identical starting weights can make neural units learn the same role. Random initialization gives units different starting points, while residual connections provide a shortcut for the learning signal.",
      "example": "For ReLU with fan_in=100, He initialization uses weight variance 2/100=0.02. If a network has only linear layers, multiplying their matrices still produces one linear map; adding a nonlinear activation is what makes the composition nonlinear.",
      "keyPoints": [
        "Backprop computes gradients; an optimizer applies updates.",
        "Nonlinear activation is necessary for deep nonlinear functions.",
        "Random initialization breaks symmetry; use He for ReLU, Xavier often for tanh.",
        "Residual connections can improve gradient flow; clipping controls exploding gradients.",
        "Universal approximation is about capacity, not guaranteed learning."
      ],
      "terms": [
        {
          "en": "Iteration / Step",
          "si": "One parameter update, commonly computed from a mini-batch."
        },
        {
          "en": "Chain Rule",
          "si": "The derivative rule for a composition of functions, used by backpropagation."
        },
        {
          "en": "Symmetry Breaking",
          "si": "Different initial weights let otherwise identical neurons learn different features."
        },
        {
          "en": "He (Kaiming) Initialization",
          "si": "A weight initialization scaled for ReLU activations, commonly with variance 2/fan_in."
        },
        {
          "en": "Xavier (Glorot) Initialization",
          "si": "An initialization scaled using fan-in and fan-out, often used with tanh-like activations."
        },
        {
          "en": "Residual Connection",
          "si": "A shortcut that adds a layer’s input to its output, helping information and gradients flow."
        },
        {
          "en": "Universal Approximation Theorem",
          "si": "Under conditions, a sufficiently wide network can approximate continuous functions; it does not ensure easy training."
        }
      ],
      "si": "ඔයා පාසල් relay team එකක හැම runnerම එකම leg එක දුවනවා නම් කණ්ඩායමට වෙනස් දක්ෂතා ලැබෙන්නේ නෑ; neural network එකේ හැම weight එකම zero දැම්මොත් units එකම දේ ඉගෙන ගන්නවා. Random initialization එකෙන් ඒවා වෙනස් වෙන්න පටන් ගන්නවා. ReLUට He initialization ප්‍රයෝජනවත්. Layer අතර nonlinear activation නැත්නම් layers ගොඩක් තිබුණත් එක linear map එකක් වගේමයි."
    },
    {
      "id": "optimizers-batch-size-deep-dive",
      "title": "Optimizers & Batch Size Deep Dive: Momentum, Adam, AdamW vs L2, Schedules, Large-Batch Generalization, Memory",
      "plain": "Optimizers decide how gradients change parameters. Batch size and learning-rate schedules change both the noise of those gradients and the hardware efficiency of training.",
      "internGuide": ["Momentum smooths updates using a running direction. Adam also adapts the step size using running first and second moments.", "AdamW applies decoupled weight decay rather than adding L2 directly to Adam's gradient; the two are not generally equivalent for adaptive optimizers.", "Larger batches reduce gradient noise and use more activation memory. After a critical size, adding samples gives diminishing reductions in training steps.", "Exam focus: warmup protects early large-batch updates, while decay lowers the learning rate later. Training memory includes weights, gradients, optimizer states, and activations."],
      "examRefs": [
        "FUN-060",
        "FUN-061",
        "FUN-062",
        "FUN-063",
        "FUN-096",
        "FUN-114",
        "FUN-139",
        "FUN-140"
      ],
      "body": [
        "Momentum maintains an exponentially decaying average of gradients, reducing oscillation and reinforcing consistent directions; it still needs a learning rate and is not itself regularization. Adam combines a first-moment average m with a second-moment average v to adapt updates per parameter, without computing the full Hessian.",
        "With adaptive optimizers, adding L2 to the loss is not generally equivalent to decoupled weight decay. AdamW applies decay separately as θ←θ−ηλθ. Training schedules often use a brief warmup followed by cosine or linear decay; warmup avoids unstable early updates and decay helps settle late in training.",
        "Increasing batch size from 64 to 1024 reduces steps per epoch by 16 and usually reduces gradient noise while increasing activation memory. Linear learning-rate scaling is a rule of thumb, commonly paired with warmup, not a universal guarantee. FP32 weights, gradients, and Adam m/v use about 16 bytes per parameter before activations. Large-batch training can affect generalization; layer-wise methods such as LAMB are used for some large-batch settings."
      ],
      "analogy": "Momentum is a ball rolling downhill: small bumps do not immediately reverse its direction. Adam gives each parameter an adaptive step size. A broad valley is less sensitive to small changes than a sharp valley, although this analogy does not guarantee generalization.",
      "example": "For 64,000 rows, batch 64 gives 1,000 steps per epoch; batch 1,024 gives 62.5, about 63. A 16× batch increase would scale LR 0.1 to 1.6 under the linear-scaling rule, usually with warmup. A 7-billion-parameter FP32 Adam model needs roughly 7×16=112 GB for parameters, gradients, and moments, excluding activations.",
      "keyPoints": [
        "Momentum averages gradients; Adam uses first and second moments.",
        "AdamW decouples weight decay from adaptive updates.",
        "Warmup plus decay is a common schedule, not a guarantee.",
        "Larger batches mean fewer steps and more activation memory.",
        "FP32 plus Adam uses roughly 16 bytes/parameter before activations."
      ],
      "terms": [
        {
          "en": "Momentum",
          "si": "An exponentially decaying average of past gradients used for optimization."
        },
        {
          "en": "Adam",
          "si": "An optimizer using moving averages of gradients and squared gradients."
        },
        {
          "en": "AdamW",
          "si": "Adam with weight decay decoupled from its adaptive gradient update."
        },
        {
          "en": "Cosine Decay",
          "si": "A learning-rate schedule that decreases along a cosine curve."
        },
        {
          "en": "Sharp vs Flat Minima",
          "si": "Narrow versus broad low-loss regions; their generalization behavior can differ."
        },
        {
          "en": "LAMB",
          "si": "A layer-wise adaptive optimizer used in some large-batch training settings."
        },
        {
          "en": "Linear Scaling Rule",
          "si": "A rule of thumb that scales learning rate with batch size, usually with warmup."
        }
      ],
      "si": "ඔයා බෑවුමක පෙරළөх බෝලයක් හිතන්න; පොඩි ගල් байсанත් momentum නිසා දිශාව දිගටම යනවා. Adam හැම parameter එකකටම වෙනස් step size එකක් හදාගන්නවා. Rows 64,000කට batch 64 නම් epoch එකකට steps 1000යි; batch 1024 නම් 62.5ක්. Batch එක 16 ගුණයක් වැඩි කරනකොට memoryත් බලන්න, 7B model එකකට FP32 Adam states විතරක් 112 GB පමණ වෙන්න පුළුවන්."
    },
    {
      "id": "normalization-and-pytorch-modes",
      "title": "BatchNorm vs LayerNorm, and PyTorch Gotchas: zero_grad, eval(), no_grad()",
      "plain": "Normalization layers and PyTorch modes solve different problems. Understanding exactly what each switch changes prevents silent training and inference bugs.",
      "internGuide": ["BatchNorm uses batch statistics during training and stored running statistics during evaluation; its behavior depends on train or eval mode.", "LayerNorm normalizes features within each example and behaves the same way during training and inference, apart from learned parameters.", "optimizer.zero_grad() clears accumulated gradients. model.eval() changes layer behavior. no_grad() or inference_mode() disables gradient recording.", "Exam focus: eval() does not disable autograd, and no_grad() does not disable dropout by itself. Inference commonly needs both behaviors."],
      "examRefs": [
        "FUN-066",
        "FUN-067",
        "FUN-068",
        "FUN-069",
        "FUN-120"
      ],
      "body": [
        "BatchNorm normalizes activations using mini-batch statistics during training and running averages during inference, then applies learned scale γ and shift β. LayerNorm computes statistics within each example across its features, so it does not depend on other examples in the batch; this is useful for small batches and sequence models. LayerNorm also has learned scale and shift parameters.",
        "PyTorch accumulates gradients in .grad by default, so call optimizer.zero_grad() before the next update unless accumulation is intentional. Call model.eval() for inference to disable dropout and use BatchNorm running statistics. torch.no_grad() disables gradient recording and saves memory/compute, but does not change train/eval behavior or convert precision."
      ],
      "analogy": "BatchNorm is like grading students relative to the current classroom batch; LayerNorm is like normalizing each student’s marks within that student’s subjects. In PyTorch, eval() changes dropout/BatchNorm behavior, while no_grad() only stops gradient recording.",
      "example": "For batch size 2, BatchNorm statistics may be noisy; LayerNorm uses each example’s feature values. If two batch gradients are accumulated intentionally, skip zero_grad between them; otherwise clear gradients each step. During inference, use both model.eval() and torch.no_grad() for their separate purposes.",
      "code": {
        "lang": "python",
        "src": "model.train()\nfor x, y in loader:\n    optimizer.zero_grad()  # 1. Clear previous gradients.\n    loss = criterion(model(x), y)  # 2. Forward pass using raw logits.\n    loss.backward()  # 3. Compute gradients by backpropagation.\n    optimizer.step()  # 4. Update weights.\n\nmodel.eval()  # Disable dropout; use BatchNorm running statistics.\nwith torch.no_grad():  # Disable gradient tracking to save memory.\n    preds = model(x_test).argmax(dim=-1)"
      },
      "keyPoints": [
        "BatchNorm uses batch statistics in training and running averages at inference.",
        "LayerNorm normalizes each example across features and has learnable γ/β.",
        "zero_grad prevents unintended gradient accumulation.",
        "eval() changes dropout/BatchNorm behavior.",
        "no_grad() saves autograd memory; it does not call eval() or change precision."
      ],
      "terms": [
        {
          "en": "Running Statistics",
          "si": "Moving estimates of activation means and variances used by BatchNorm during inference."
        },
        {
          "en": "γ (scale), β (shift)",
          "si": "Learned parameters that scale and shift normalized activations."
        },
        {
          "en": "Gradient Accumulation (PyTorch default)",
          "si": "PyTorch adds new gradients to .grad until they are explicitly cleared."
        },
        {
          "en": "model.eval()",
          "si": "Set a PyTorch model to evaluation behavior, including disabling dropout and using BatchNorm running statistics."
        },
        {
          "en": "torch.no_grad()",
          "si": "Disable autograd recording to reduce inference memory and computation."
        }
      ],
      "si": "ඔයා පන්තියේ ළමයින්ගේ ලකුණු batch එකට සාපේක්ෂව normalize කරනවා නම් BatchNorm වගේ; එක් ළමයෙකුගේ subjects අතරම normalize කරනවා නම් LayerNorm වගේ. Batch size 2 වගේ පොඩි නම් BatchNorm statistics අස්ථාවර වෙන්න පුළුවන්. PyTorch වල zero_grad() අමතක වුණොත් gradients එකතු වෙනවා. eval() dropout වෙනස් කරනවා, no_grad() gradients ගණන් නොකර memory ඉතිරි කරනවා."
    },
    {
      "id": "gans-vaes-flows",
      "title": "Generative Models Deep Dive (1): Generative vs Discriminative, Naive Bayes, GANs, VAEs, Normalizing Flows",
      "plain": "Generative models learn enough about a data distribution to create or score examples, while discriminative models focus on predicting targets from inputs. Different generative families trade likelihood, sample quality, and training stability.",
      "internGuide": ["Naive Bayes models class-conditional feature probabilities with a conditional-independence assumption and uses Bayes' rule for classification.", "A GAN trains a generator against a discriminator. It can produce sharp samples but may be unstable or collapse to limited modes.", "A VAE optimizes reconstruction plus a KL regularizer and samples through the reparameterization trick. Its likelihood is a lower bound rather than exact.", "Exam focus: normalizing flows use invertible transformations and tractable Jacobians for exact likelihood; GANs do not provide explicit likelihoods."],
      "examRefs": [
        "FUN-042",
        "FUN-043",
        "FUN-044",
        "FUN-104",
        "FUN-105",
        "FUN-108",
        "FUN-141",
        "FUN-142",
        "FUN-145"
      ],
      "body": [
        "Generative models learn a data distribution so they can produce new samples. A GAN trains a generator to fool a discriminator; their competing objectives can produce sharp samples but training may be unstable and mode collapse can omit parts of the distribution. A VAE uses an encoder distribution and decoder, trained with reconstruction loss plus a KL regularizer on the latent representation.",
        "A VAE’s latent variable is sampled from a distribution, commonly using the reparameterization trick so gradients can pass through sampling. The KL term encourages a structured latent space and trades off reconstruction fidelity against regularization. Normalizing flows use invertible transformations and account for the Jacobian determinant to compute exact density changes.",
        "These approaches have different objectives: GANs focus on adversarial sample quality, VAEs on a tractable probabilistic latent model, and flows on exact likelihood through invertible mappings."
      ],
      "analogy": "A GAN is like an art student (generator) trying to fool an examiner (discriminator). A VAE is like compressing a drawing into a small sketch code and reconstructing it. A flow is like a reversible sequence of transformations where each change can be tracked.",
      "example": "A VAE objective can be written as reconstruction loss plus β·KL(q(z|x)‖p(z)); increasing β strengthens latent regularization but may reduce reconstruction detail. A flow transformation must be invertible so the input density can be adjusted by its Jacobian determinant.",
      "keyPoints": [
        "GAN generator and discriminator train adversarially; mode collapse is a risk.",
        "VAE combines reconstruction and latent KL regularization.",
        "Reparameterization enables gradients through latent sampling.",
        "Normalizing flows use invertible maps and Jacobian determinants."
      ],
      "terms": [
        {
          "en": "Discriminative Model",
          "si": "A model that estimates labels or conditional probabilities from input features."
        },
        {
          "en": "Naive Bayes",
          "si": "A probabilistic classifier using Bayes’ rule and conditional feature independence."
        },
        {
          "en": "Mode Collapse",
          "si": "A GAN failure where the generator produces limited varieties of samples."
        },
        {
          "en": "Non-Saturating GAN Loss",
          "si": "A generator objective that avoids weak gradients from the saturating minimax objective."
        },
        {
          "en": "WGAN-GP",
          "si": "Wasserstein GAN with a gradient penalty to encourage a 1-Lipschitz critic."
        },
        {
          "en": "Reparameterization Trick",
          "si": "Express a random sample as a differentiable transform of noise and distribution parameters."
        },
        {
          "en": "ELBO",
          "si": "Evidence lower bound, optimized in variational inference to balance fit and latent regularization."
        },
        {
          "en": "Posterior Collapse",
          "si": "A VAE decoder ignores its latent variable and the learned posterior approaches the prior."
        },
        {
          "en": "Normalizing Flow",
          "si": "An invertible transformation model that computes density changes using Jacobian determinants."
        }
      ],
      "si": "ඔයා චිත්‍රයක් හදдаг ළමයෙක් සහ ඒක හඳුනාගන්න ගුරුවරයෙක් හිතන්න; GAN එකේ generator ගුරුවරයාව රවට්ටන්න උත්සාහ කරනවා. VAE එකක් චිත්‍රය පොඩි code එකකට compress කරලා ආපහු හදනවා, ඒ අතර latent distribution එකට KL penalty එකක් දානවා. Normalizing flow එකේ පියවර ආපස්සටත් හරවන්න පුළුවන්. GAN එකකට සමහර වර්ග අමතක වෙලා mode collapse වෙන්නත් පුළුවන්."
    },
    {
      "id": "diffusion-and-autoregressive",
      "title": "Generative Models Deep Dive (2): Diffusion, DDPM Objective, Latent Diffusion, Classifier-Free Guidance, Autoregressive Models, Teacher Forcing",
      "plain": "Diffusion and autoregressive models generate data in repeated steps. Diffusion removes noise gradually; autoregressive models predict the next item from earlier items.",
      "internGuide": ["A DDPM training example adds a known amount of noise at a selected timestep, and the network commonly learns to predict that noise.", "Latent diffusion performs denoising in a compressed latent space, reducing computation compared with operating on full-resolution pixels.", "Classifier-free guidance combines conditional and unconditional predictions to strengthen prompt adherence, usually at a cost to diversity when made too strong.", "Exam focus: teacher forcing uses true previous tokens during training, but generation uses the model's own outputs; this mismatch can create exposure bias."],
      "examRefs": [
        "FUN-045",
        "FUN-046",
        "FUN-106",
        "FUN-107",
        "FUN-143",
        "FUN-144",
        "FUN-146"
      ],
      "body": [
        "Diffusion models learn to reverse a gradual noising process. Training commonly predicts the noise ε added to data and minimizes a denoising objective; generation starts from noise and iteratively denoises. Latent diffusion performs this work in a lower-dimensional autoencoder latent space to reduce computation.",
        "Classifier-free guidance combines conditional and unconditional predictions, ε̂=ε_uncond+w(ε_cond−ε_uncond). Larger w generally increases prompt adherence and can reduce diversity or introduce artifacts at high values; it does not require a separate classifier.",
        "Autoregressive models factorize a sequence using the chain rule, predicting each token from prior tokens. Teacher forcing trains with ground-truth previous tokens and allows parallel computation across positions, but at inference the model conditions on its own outputs, creating exposure bias."
      ],
      "analogy": "Diffusion is like gradually cleaning fog from a photo, starting with noise. Guidance is like giving a tuk-tuk driver a clearer destination; too forceful a direction can lead to odd shortcuts. Teacher forcing is an instructor correcting every driving turn during practice, while the learner must drive alone on the road.",
      "example": "For ε_uncond=0.2 and ε_cond=0.5, w=1 gives 0.2+1×0.3=0.5; w=7.5 gives 0.2+7.5×0.3=2.45. A 512×512×3 image has 786,432 values; a 64×64×4 latent has 16,384, 48 times fewer. For tokens, p(x)=p(x₁)p(x₂|x₁)p(x₃|x₁,x₂).",
      "keyPoints": [
        "Diffusion reverses noising through iterative denoising.",
        "DDPM commonly predicts added noise; it does not need a discriminator.",
        "Latent diffusion denoises a smaller representation.",
        "Higher classifier-free guidance can trade diversity for prompt adherence.",
        "Autoregressive chain rule enables next-token prediction; teacher forcing creates exposure bias."
      ],
      "terms": [
        {
          "en": "Forward / Reverse Process",
          "si": "Forward diffusion adds noise; reverse diffusion iteratively denoises to generate data."
        },
        {
          "en": "DDPM",
          "si": "Denoising Diffusion Probabilistic Model, a diffusion approach that learns to predict noise."
        },
        {
          "en": "Latent Diffusion",
          "si": "Run diffusion in a compressed representation rather than directly in pixel space."
        },
        {
          "en": "Classifier-Free Guidance",
          "si": "Guide generation by combining conditional and unconditional predictions without a separate classifier."
        },
        {
          "en": "Guidance Scale (w)",
          "si": "The multiplier controlling the strength of classifier-free guidance."
        },
        {
          "en": "Teacher Forcing",
          "si": "Train a sequence model using ground-truth previous tokens as context."
        },
        {
          "en": "Exposure Bias",
          "si": "The mismatch caused when inference uses model-generated histories unlike training histories."
        },
        {
          "en": "Scheduled Sampling",
          "si": "Gradually mix model-generated tokens with ground-truth tokens during sequence training."
        }
      ],
      "si": "ඔයා පරණ, මීදුම වැදුණු photo එකක් ටික ටික පිරිසිදු කරනවා වගේ diffusion එක noise වලින් image එක හදනවා. Latent diffusion පොඩි 64×64×4 representation එකක වැඩ කරන නිසා 512×512×3 image එකට වඩා 48 ගුණයක් අඩු values තියෙනවා. Guidance වැඩි කළොත් prompt එකට ළඟ වෙන්න පුළුවන්, හැබැයි diversity අඩු වෙන්නත් artifacts එන්නත් පුළුවන්. Language model එක ඊළඟ token එක කලින් tokens මත පදනම්ව predict කරනවා."
    },
    {
      "id": "gpu-accelerated-ml",
      "title": "GPU Acceleration for Classic ML & Data: Why GPUs, cuDF / cudf.pandas, cuML, GPU XGBoost, Spark, Dask, DLPack, Mixed Precision",
      "plain": "GPU acceleration helps when a workload contains enough parallel numerical work to offset data-transfer and startup costs. Choose the tool that matches the data-processing or modeling layer.",
      "internGuide": ["cuDF provides GPU dataframes and cudf.pandas can accelerate supported pandas operations. cuML provides GPU versions of many familiar ML algorithms.", "Current XGBoost uses device='cuda' with tree_method='hist' for GPU training. RAPIDS Accelerator can move supported Spark SQL and dataframe work to GPUs.", "Dask distributes larger workflows across workers. DLPack and the CUDA Array Interface can share device buffers between compatible libraries without a CPU round trip.", "Exam focus: a GPU is not automatically faster for tiny, serial, unsupported, or transfer-heavy workloads. Benchmark the full pipeline rather than one kernel."],
      "examRefs": [
        "FUN-047",
        "FUN-048",
        "FUN-098",
        "FUN-099",
        "FUN-101",
        "FUN-102",
        "FUN-103",
        "FUN-148"
      ],
      "body": [
        "GPUs accelerate workloads with many independent operations such as matrix multiplication, column transformations, and candidate split calculations. Data transfer and kernel-launch overhead mean small one-off jobs may run faster on a CPU; large datasets, repeated tuning, and large joins/aggregations can benefit more.",
        "RAPIDS is NVIDIA’s GPU data-science ecosystem. cuDF provides GPU DataFrames; cudf.pandas can accelerate supported pandas code and fall back for unsupported operations. cuML provides GPU machine-learning algorithms with familiar APIs. XGBoost 2.x GPU configuration uses device=\"cuda\" and tree_method=\"hist\". RAPIDS Accelerator for Apache Spark runs supported Spark operations on GPUs.",
        "When data exceeds a GPU’s memory, Dask-cuDF can partition work across GPUs and nodes. DLPack and the CUDA Array Interface can share device buffers between compatible libraries without a CPU round trip. Mixed precision uses lower-precision compute such as FP16/BF16; BF16 has a range similar to FP32 but less mantissa precision. FP32 master weights and loss scaling may be used depending on the training setup."
      ],
      "analogy": "A GPU is like thousands of workers each doing a small arithmetic task at once; a CPU has fewer workers suited to varied tasks. Moving a small Colombo delivery list to a distant warehouse can cost more than processing it locally, but a very large shipment benefits from parallel workers.",
      "example": "For only 2,000 CSV rows and one model fit, transfer and launch overhead can outweigh GPU gains. XGBoost 2.x uses device=\"cuda\", tree_method=\"hist\". If an operation runs on GPU memory, DLPack can pass a compatible tensor without copying through CPU memory.",
      "code": {
        "lang": "python",
        "src": "\nimport pandas as pd  # After loading cudf.pandas, supported pandas code can run on GPU.\nimport xgboost as xgb\n\ndf = pd.read_parquet(\"transactions.parquet\")\ndaily = df.groupby(\"customer_id\")[\"amount\"].agg([\"sum\", \"mean\", \"count\"])\n\nmodel = xgb.XGBClassifier(device=\"cuda\", tree_method=\"hist\", n_estimators=500)\nmodel.fit(X_train, y_train)  # GPU-accelerated boosting.\n\n\n"
      },
      "keyPoints": [
        "GPUs suit large parallel workloads; overhead can dominate small jobs.",
        "cuDF/cuML provide GPU dataframes and ML; cudf.pandas can accelerate compatible pandas code.",
        "XGBoost 2.x GPU uses device=\"cuda\", tree_method=\"hist\".",
        "Dask-cuDF distributes data; DLPack supports device-buffer interoperability.",
        "BF16 has FP32-like range and lower precision; mixed precision reduces compute/memory needs."
      ],
      "terms": [
        {
          "en": "RAPIDS",
          "si": "NVIDIA GPU-accelerated data science libraries, including cuDF and cuML."
        },
        {
          "en": "cuDF / cudf.pandas",
          "si": "GPU DataFrame tools; cudf.pandas can accelerate compatible pandas workloads."
        },
        {
          "en": "cuML",
          "si": "GPU machine-learning algorithms with APIs familiar to scikit-learn users."
        },
        {
          "en": "RAPIDS Accelerator for Apache Spark",
          "si": "A Spark plugin that accelerates supported operations on NVIDIA GPUs."
        },
        {
          "en": "Dask-cuDF",
          "si": "Distributed GPU DataFrame processing across partitions, GPUs, and nodes."
        },
        {
          "en": "DLPack",
          "si": "A standard for sharing tensor memory between compatible libraries."
        },
        {
          "en": "Loss Scaling",
          "si": "Multiply a loss to keep small FP16 gradients representable, then unscale gradients before updating."
        },
        {
          "en": "BF16",
          "si": "A 16-bit format with FP32-like exponent range and fewer mantissa bits."
        }
      ],
      "si": "ඔයාට CSV rows 2000ක් විතරක් තියෙනවා නම් GPU එකට data යවන වියදමෙන් CPU එකේම ඉවර කරන්න පුළුවන්. Rows මිලියන ගණනක් එකවර process කරනකොට GPU workers ගොඩක් සමාන්තරව වැඩ කරන නිසා වාසිය වැඩියි. cuDF GPU DataFrame එකක්, cuML GPU machine learning tools. XGBoost 2.x වල device=\"cuda\" සහ tree_method=\"hist\" යොදාගන්නවා. BF16ට FP32 වගේ range එකක් තිබුණත් precision අඩුයි."
    },
    {
      "id": "end-to-end-churn-project",
      "title": "Beyond the Exam: End-to-End Mini Project, Sri Lankan Telco Customer Churn (CSV → Evaluated Model → Monitoring)",
      "plain": "This project connects the separate ML concepts into one reproducible workflow. The goal is not merely to train a classifier but to build an honest, deployable decision system.",
      "internGuide": ["Define churn, the prediction time, available features, and the business cost of false positives and false negatives before opening the CSV.", "Split data before fitting preprocessing. Build a pipeline, establish a simple baseline, tune on validation data, and evaluate once on the untouched test set.", "Choose a threshold from business costs and capacity, not automatically 0.5. Check calibration and subgroup performance before deployment.", "Production work includes versioning data and code, monitoring drift and outcomes, and deciding when to retrain or roll back."],
      "examRefs": [
        "FUN-138",
        "FUN-053",
        "FUN-055",
        "FUN-086",
        "FUN-133"
      ],
      "body": [
        "Build a churn model from a Sri Lankan telco CSV containing customer, plan, billing, usage, complaint, tenure, reload, and churn fields. If churn prevalence is 8%, accuracy alone can mislead: a model predicting no churn for everyone scores 92% accuracy but has zero recall. Report PR-AUC and precision/recall at a business-selected threshold.",
        "Remove post-outcome fields such as disconnect_reason because they leak the target. Derive time-valid features such as days since the last reload. Use stratified splits for imbalanced labels, group by customer when records repeat, and use time-based final tests when predicting future months. Put median imputation, scaling, and one-hot encoding in a training-fold pipeline.",
        "Compare a dummy baseline, balanced logistic regression, and a boosted-tree baseline. Select a threshold on validation data using the business cost of offers and missed churners; calibrate probabilities if budget decisions rely on them. Monitor inputs and outcomes: a change in P(x) with stable P(y|x) is covariate shift, while a changed relationship P(y|x) is concept drift and may require retraining with new labels."
      ],
      "analogy": "Leakage is like building a house on a cracked foundation: later polish cannot fix it. A pipeline is the construction process, a baseline checks that the finished house improves on an empty lot, and monitoring is inspecting the roof after storms.",
      "example": "For 50,000 customers and 8% churn, there are 4,000 churners. A dummy model has 92% accuracy but zero recall. If an illustrative model at a chosen threshold has recall 0.80 and precision 0.30, 100 offers reach about 30 likely churners while catching 80% of churners. If an offer costs Rs. 300 and a lost customer costs Rs. 6,000, compare those business values; these figures are illustrative, not measured results.",
      "code": {
        "lang": "python",
        "src": "import pandas as pd\nfrom sklearn.compose import make_column_transformer; from sklearn.pipeline import make_pipeline\nfrom sklearn.impute import SimpleImputer; from sklearn.preprocessing import OneHotEncoder\nfrom sklearn.model_selection import train_test_split; from sklearn.metrics import average_precision_score\nfrom sklearn.ensemble import HistGradientBoostingClassifier\n\ndf = pd.read_csv(\"telco_churn_lk.csv\").drop(\n    columns=[\"customer_id\", \"disconnect_reason\", \"last_reload_date\"])  # Remove the ID, a leakage field, and the raw date.\nX, y = df.drop(columns=\"churned\"), df[\"churned\"]\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, stratify=y, random_state=0)\nprep = make_column_transformer((OneHotEncoder(handle_unknown=\"ignore\", sparse_output=False), [\"district\", \"plan_type\"]),\n                               remainder=SimpleImputer(strategy=\"median\"))\nmodel = make_pipeline(prep, HistGradientBoostingClassifier()).fit(X_tr, y_tr)\nprint(\"PR-AUC:\", average_precision_score(y_te, model.predict_proba(X_te)[:, 1]))"
      },
      "keyPoints": [
        "Define business costs and report PR-AUC plus threshold-specific precision/recall.",
        "Remove future/post-outcome leakage; make features valid at prediction time.",
        "Use stratified, grouped, or time-based splits to reflect deployment.",
        "Fit preprocessing in a pipeline and compare against simple baselines.",
        "Covariate shift changes P(x); concept drift changes P(y|x)."
      ],
      "terms": [
        {
          "en": "Churn",
          "si": "A customer ending or leaving a service."
        },
        {
          "en": "Baseline Model",
          "si": "A simple reference model used to compare more complex approaches."
        },
        {
          "en": "Covariate Shift",
          "si": "A change in input distribution P(x) while P(y|x) remains stable."
        },
        {
          "en": "Concept Drift",
          "si": "A change in the relationship between features and target, P(y|x)."
        },
        {
          "en": "Importance Weighting",
          "si": "Reweighting training examples to account for a changed input distribution."
        },
        {
          "en": "ColumnTransformer",
          "si": "A scikit-learn utility applying different transformations to selected columns."
        }
      ],
      "si": "ඔයාගේ mobile operator එකේ customers 50,000ක් අතර 8% churn වෙනවා නම් churners 4,000යි. හැමෝම ඉන්නවා කියන dummy model එක 92% accuracy ගත්තත් එක් churnerවත් අල්ලන්නේ නෑ. disconnect_reason එක churn පස්සේ පිරෙන නිසා model එකට දෙන්න එපා; ඒක leakage. Offer එක Rs. 300යි, customer නැතිවීම Rs. 6,000යි කියලා උදාහරණයක් ගෙන threshold එකේ precision හා recall දෙකම බලන්න. Colombo වලින් වෙනත් පළාතකට expand කළාම inputs වෙනස් වෙයිද, customer හැසිරීමම වෙනස් වෙයිද කියලා monitor කරන්න."
    }
  ],
  "quiz": [
    {
      "q": "A 10-class classifier has cross-entropy loss near 2.30 from its first step. What does this suggest?",
      "options": [
        "The model is perfect",
        "It assigns about 0.1 to each class and is guessing uniformly",
        "It is confidently wrong",
        "The dataset has only two classes"
      ],
      "answer": 1,
      "why": "−ln(1/10)=ln(10)≈2.30, the loss for a uniform guess. Check learning rate, labels, and gradient flow."
    },
    {
      "q": "Precision is 0.6 and recall is 0.9. What is F1?",
      "options": [
        "0.75",
        "0.72",
        "0.54",
        "0.80"
      ],
      "answer": 1,
      "why": "F1=2×0.6×0.9/(0.6+0.9)=1.08/1.5=0.72; 0.75 is the arithmetic mean."
    },
    {
      "q": "What is the result of global-norm clipping gradient [6,8] to max_norm=1?",
      "options": [
        "[1,1]",
        "[0.6,0.8]",
        "[6,8]",
        "[0.75,1]"
      ],
      "answer": 1,
      "why": "Its norm is √(36+64)=10; scale both components by 1/10 to preserve direction."
    },
    {
      "q": "For label smoothing ε=0.1, K=5, target=(1−ε)one_hot+ε/K, what are the correct and other-class targets?",
      "options": [
        "0.90 and 0.025",
        "1.00 and 0.02",
        "0.92 and 0.02",
        "0.90 and 0.02"
      ],
      "answer": 2,
      "why": "Each class gets 0.1/5=0.02; the correct class also gets 0.90, for 0.92 total."
    },
    {
      "q": "With inverted dropout p=0.2, how are retained activations scaled during training?",
      "options": [
        "By 0.8",
        "By 1.25",
        "Not scaled; multiply by 0.8 at inference",
        "By 0.2"
      ],
      "answer": 1,
      "why": "1/(1−0.2)=1.25 preserves the expected activation, so no dropout scaling is needed at inference."
    },
    {
      "q": "Adam has β₁=0.9, m₀=0, and m₁=0.1g₁. What is the corrected first moment?",
      "options": [
        "0.9m₁",
        "m₁/(1−0.9)=g₁",
        "m₁/1.9",
        "No correction"
      ],
      "answer": 1,
      "why": "At t=1, divide by 1−β₁=0.1, giving m̂₁=g₁."
    },
    {
      "q": "Why can a random forest improve on a deep tree with unstable validation results?",
      "options": [
        "It makes every tree deeper",
        "It averages decorrelated trees to reduce variance",
        "It changes classification to regression",
        "It needs no training data"
      ],
      "answer": 1,
      "why": "Bootstrap rows and random feature subsets produce diverse trees whose errors can average out."
    },
    {
      "q": "What does ROC-AUC=0.85 mean?",
      "options": [
        "85% of predictions are correct",
        "Precision is 0.85 at the default threshold",
        "A random positive ranks above a random negative about 85% of the time",
        "15% of positives are wrong"
      ],
      "answer": 2,
      "why": "ROC-AUC measures ranking across thresholds, not accuracy or precision at one threshold."
    },
    {
      "q": "What usually happens when classifier-free guidance is increased?",
      "options": [
        "Diversity rises and prompt adherence falls",
        "Fewer denoising steps are needed",
        "Prompt adherence rises, diversity can fall, and very high values can add artifacts",
        "A separate classifier becomes necessary"
      ],
      "answer": 2,
      "why": "Larger guidance extrapolates further toward the conditional prediction; classifier-free guidance does not require a separate classifier."
    },
    {
      "q": "For a one-off model fit on 2,000 CSV rows, what is a reasonable GPU expectation?",
      "options": [
        "GPU is always 50 times faster",
        "Transfer and launch overhead may outweigh GPU gains",
        "cuML cannot use fewer than 10,000 rows",
        "cudf.pandas requires rewriting all code"
      ],
      "answer": 1,
      "why": "Small workloads may finish faster on a CPU; larger parallel workloads and repeated operations can benefit more from GPUs."
    }
  ]
};
