export default {
  id: 'math',
  number: 0,
  title: 'Maths You Actually Need',
  titleSi: 'AI වලට ඇත්තටම ඕනේ කරන Maths: බය නැතුව, intuition එකෙන්',
  summary: 'AI කියන්නේ ඇතුළෙන් බැලුවොත් අංක ගොඩක් එක්ක කරන සරල වැඩ ටිකක්. මේ phase එකේදී formulas කටපාඩම් කරන්නේ නෑ. හැම concept එකක්ම මොකක්ද, ඇයි AI වලට ඕනේ කියන එක එදිනෙදා උදාහරණ වලින් තේරුම් ගන්නවා. හැම topic එකකම "අත්‍යවශ්‍යයි" සහ "දැන්ම ඕනේ නෑ, පස්සේ බලමු" කියලා කොටස් වෙන් කරලා තියෙනවා.',
  duration: 'සති 3-5',
  topics: [
    {
      id: 'scalars-vectors-tensors',
      title: 'Scalars, Vectors, Matrices, Tensors',
      body: [
        '[අත්‍යවශ්‍යයි] Model එකකට text හෝ පින්තූර සෘජුවම input කරන්න බෑ. ඒවා මුලින් අංක වලින් නිරූපණය කරනවා. ඒකෙන් model එකට මනුෂ්‍යයෙක් වගේ ඒ දේ "තේරෙනවා" කියන අදහස අදහස් වෙන්නේ නෑ; අංක අතර රටා ඉගෙන ගන්නවා කියන එකයි. ඒ අංක සකස් කරන්නේ scalar, vector, matrix සහ tensor වගේ ආකාර වලට.',
        'Scalar කියන්නේ තනි අංකයක්. උදාහරණ: උෂ්ණත්වය 31, කොත්තු එකක මිල Rs. 900. Vector කියන්නේ අංක පේළියක්. උදාහරණ: ගෙයක් ගැන [බිම් ප්‍රමාණය, කාමර ගණන, Colombo ඉඳන් km] = [1200, 3, 15]. Vector එකක අගයන් ගණන එහි length එක හෝ feature dimensions ගණන කියලා කියනවා.',
        'Matrix කියන්නේ අංක table එකක්, පේළි (rows) සහ තීරු (columns) තියෙන. Excel sheet එකක් හිතන්න. ගෙවල් 100ක data තියෙනවා නම්, rows 100යි columns 3යි තියෙන matrix එකක්. Tensor කියන්නේ axes ඕනෑම ගණනක් ඇති අංක දත්ත. Color පින්තූරයක් = උස x පළල x colors 3 (Red, Green, Blue). ඒක 3D tensor එකක්. පින්තූර 32ක batch එකක් = 4D tensor එකක්. Tensor එකක shape එකෙන් එක් එක් axis එකේ අගයන් ගණන කියවන්න පුළුවන්; rank එක කියන්නේ axes ගණනයි. ඒ නිසා shape (32, 224, 224, 3) ඇති tensor එක rank 4යි.',
        'PyTorch, TensorFlow වගේ libraries වල tensor කියන්නේ මේ අංක දත්ත ගබඩා කරන object එක. Deep learning වලදී tensor operations මඟින් model parameters සහ data එකට ගණනය කරලා prediction හදනවා. ඒ ගණනයෙන් ඉගෙන ගන්නා රටා, මනුෂ්‍ය අවබෝධයට සමානයි කියලා අදහස් වෙන්නේ නෑ.',
      ],
      analogy: 'Scalar = එක කඩේක එක බඩුවක මිල. Vector = Keells bill එකක එක පේළියක් (බඩුවේ මිල, ප්‍රමාණය, discount). Matrix = මුළු bill එකම, පේළි ගොඩක් එක්ක. Tensor = මාසෙම bills ගොඩ එකට ගහපු file එක.',
      example: 'Cricket player කෙනෙක්ව vector එකකින් ලියමු: [average 45.2, strike rate 88, matches 120]. මේක dimensions 3ක vector එකක්. Team එකේ players 11ගේම data එකට දැම්මොත් rows 11 x columns 3 matrix එකක්. Seasons 5ක data එකට දැම්මොත් 5 x 11 x 3 tensor එකක්.',
      code: {
        lang: 'python',
        src: `import numpy as np

s = 900                          # scalar: තනි අංකයක්
v = np.array([1200, 3, 15])      # vector: අංක පේළියක්
M = np.array([[1200, 3, 15],
              [800, 2, 5]])      # matrix: ගෙවල් 2ක data
T = np.zeros((32, 224, 224, 3))  # tensor: පින්තූර 32ක batch එකක්

print(v.shape)  # (3,)
print(M.shape)  # (2, 3)  -> rows 2, columns 3
print(T.ndim)   # 4  -> dimensions 4යි`,
      },
      keyPoints: [
        'Model-ට data text/image ලෙස සෘජුවම නොදෙයි; input එක අංක වලින් represent කරනවා. ඒක model එකට මනුෂ්‍ය අවබෝධයක් තියෙනවා කියන එක නෙවෙයි.',
        'Scalar = තනි අංකය, vector = අංක අනුපිළිවෙළක්, matrix = 2D වගුවක්, tensor = axes ඕනෑම ගණනක් ඇති අංක දත්ත.',
        'Shape එක axis එකකට ඇති අගයන් ගණන කියනවා; rank එක axes ගණන කියනවා. ඒ දෙක පටලවා ගන්න එපා.',
      ],
      terms: [
        { en: 'Scalar', si: 'තනි අංකයක්. උදා: 5, -2.3.' },
        { en: 'Vector', si: 'පිළිවෙළකට තියෙන අංක පේළියක්. Embedding එකක් කියන්නේත් vector එකක්.' },
        { en: 'Matrix', si: 'Rows සහ columns තියෙන අංක table එකක්.' },
        { en: 'Tensor', si: 'Axes ඕනෑම ගණනක් ඇති අංක දත්ත. Scalar = rank 0, vector = rank 1, matrix = rank 2.' },
        { en: 'Shape', si: 'එක් එක් axis එකේ අගයන් ගණන. උදා: (2, 3) = පේළි 2, තීරු 3.' },
        { en: 'Rank', si: 'Tensor එකේ axes ගණන. Shape එකේ අගයන් කීයක් තියෙනවද කියන එකට සමානයි.' },
      ],
    },
    {
      id: 'dot-product-matmul',
      title: 'Dot Product, Matrix Multiplication, Transpose, Norms, Projections',
      body: [
        '[අත්‍යවශ්‍යයි] Dot product කියන්නේ vectors දෙකක ගැළපෙන තැන්වල අගයන් ගුණ කරලා එකතු කරන එක. Neuron එකක inputs සහ weights අතර ගණනයටත්, attention scores හදන්නත් මේක යොදා ගන්නවා. Dot product එක ලොකුයි කියලා විතරක් vectors දෙක සමාන දිශාවට හෝ සමානයි කියලා කියන්න බෑ: vector දෙකේ ප්‍රමාණය (norm) වැඩි වුණාමත් dot product එක වැඩි වෙන්න පුළුවන්. Cosine similarity එක dot product එක vectors දෙකේ දිගෙන් බෙදලා normalize කරන නිසා දිශාව පමණක් සසඳනවා.',
        '[අත්‍යවශ්‍යයි] Matrix multiplication කියන්නේ dot products ගොඩක් එකපාර කරන එක. පළවෙනි matrix එකේ හැම row එකක්ම, දෙවෙනි matrix එකේ හැම column එකක් එක්කම dot product කරනවා. නීතියක් තියෙනවා: පළවෙනි එකේ columns ගණන දෙවෙනි එකේ rows ගණනට සමාන වෙන්න ඕනේ. (2x3) ගුණ (3x4) = (2x4). තව දෙයක්: A ගුණ B, B ගුණ A ට සාමාන්‍යයෙන් සමාන නෑ. පිළිවෙළ වැදගත්.',
        '[අත්‍යවශ්‍යයි] Transpose කියන්නේ matrix එකේ rows, columns බවට හරවන එක. (2x3) matrix එකක් transpose කළාම (3x2) වෙනවා. Shapes ගලපගන්න මේක නිතරම ඕනේ වෙනවා. Norm කියන්නේ vector එකක "දිග" හෝ "ප්‍රමාණය". L2 norm = සාමාන්‍ය සරල රේඛා දුර (අංක වර්ග කරලා, එකතු කරලා, වර්ගමූලය). L1 norm = අංක වල ධන අගයන් එකතු කරපු එක (Manhattan / grid දුර). Regularization වලදී L1, L2 දෙකම පාවිච්චි වෙනවා.',
        '[ටිකක් දැනගත්තාම හොඳයි] Projection කියන්නේ එක vector එකක "සෙවනැල්ල" තව vector එකක් උඩට වැටෙන එක. එක vector එකකින් කොච්චර කොටසක් තව දිශාවකට යනවද කියලා හොයන්න මේක පාවිච්චි කරනවා. PCA වගේ ක්‍රම වල මූලික අදහස මේක.',
      ],
      analogy: 'Cargills එකට ගිහින් පාන් 2ක්, කිරි පැකට් 3ක් ගත්තා කියමු. පාන් එකක් Rs. 150, කිරි එකක් Rs. 120. Bill එක = (2 x 150) + (3 x 120) = 660. ඔන්න ඒක තමයි dot product එක: quantities vector එක [2, 3] සහ prices vector එක [150, 120]. Matrix multiplication කියන්නේ පවුල් 100කගේ bills එකපාර හදන එක.',
      example: 'a = [3, 4], b = [6, 8] ගනිමු. Dot product = 3×6 + 4×8 = 50. b කියන්නේ a එකේ දෙගුණයක් නිසා දිශාව එකයි, නමුත් dot product එකේ අගය දිගත් එක්ක වැඩි වෙනවා. Cosine similarity = 50 ÷ (5×10) = 1; vectors දෙකේ දිශාව එකමයි. a = [0, 2] නම් dot product = 8, නමුත් cosine similarity = 0. දිශා දෙක 90°කින් වෙනස්. a = [3, 4] සඳහා L2 norm = 5 සහ L1 norm = 7.',
      code: {
        lang: 'python',
        src: `import numpy as np

qty = np.array([2, 3])         # පාන් 2, කිරි 3
price = np.array([150, 120])   # එකක මිල
print(qty @ price)             # dot product = 660

A = np.ones((2, 3))
B = np.ones((3, 4))
print((A @ B).shape)           # (2, 4)
print(A.T.shape)               # transpose -> (3, 2)

a = np.array([3, 4])
print(np.linalg.norm(a))       # L2 norm = 5.0
print(np.abs(a).sum())         # L1 norm = 7`,
      },
      keyPoints: [
        'Dot product = ගුණ කරලා එකතු කිරීම. අගය vector දිග අනුවත් өөрчлөгдөх тул ඒක පමණක් similarity ලෙස නොගන්න.',
        'Cosine similarity vectors වල දිග normalize කර දිශාව සසඳනවා; 1 = එකම දිශාව, 0 = ලම්බක දිශා.',
        'Matrix multiplication = dot products ගොඩක් එකපාර. ඇතුළු dimensions ගැලපෙන්න ඕනේ.',
        'Transpose = rows සහ columns මාරු කිරීම.',
        'L2 norm = සරල රේඛා දිග. L1 norm = ධන අගයන්ගේ එකතුව.',
        'Projection = එක vector එකක සෙවනැල්ල තව එකක් උඩ.',
      ],
      terms: [
        { en: 'Dot Product', si: 'Vectors දෙකක ගැලපෙන අංක ගුණ කරලා එකතු කිරීම. අගයට vectors දෙකේ දිග සහ ඒවා අතර කෝණය යන දෙකම බලපානවා.' },
        { en: 'Cosine Similarity', si: 'Dot product එක vectors දෙකේ දිගෙන් normalize කර දිශා සසඳන අගය. දිග වෙනස් වුණත් එකම දිශාව නම් 1ට ආසන්නයි.' },
        { en: 'Matrix Multiplication', si: 'Rows සහ columns අතර dot products ගොඩක්. (m x n) ගුණ (n x p) = (m x p).' },
        { en: 'Transpose', si: 'Rows columns බවටත්, columns rows බවටත් හැරවීම.' },
        { en: 'L1 Norm', si: 'Vector එකේ අංක වල ධන අගයන්ගේ එකතුව.' },
        { en: 'L2 Norm', si: 'අංක වර්ග කරලා, එකතු කරලා, වර්ගමූලය ගත්තාම එන සාමාන්‍ය දිග.' },
        { en: 'Projection', si: 'එක vector එකක් තව vector එකක දිශාවට වැටෙන සෙවනැල්ල.' },
      ],
    },
    {
      id: 'matrix-deeper',
      title: 'Inverse, Determinant, Rank, Eigenvalues, SVD',
      body: [
        '[දැන්ම ඕනේ නෑ, පස්සේ බලමු] මේ topic එකේ තියෙන්නේ ටිකක් advanced linear algebra. ML වැඩ පටන් ගන්න මේවා ගැඹුරින් දන්න ඕනේ නෑ. ඒත් නම් ඇහුණාම "අහ්, ඒක මේකනේ" කියලා හිතෙන්න අදහස විතරක් ගන්න.',
        'Matrix එකක් කියන්නේ space එක වෙනස් කරන machine එකක් කියලා හිතන්න. ඒක points අරගෙන ඇදලා, කරකවලා, හකුළලා අලුත් තැන් වලට දානවා. Determinant කියන්නේ ඒ machine එක area (හෝ volume) එක කී ගුණයකින් ලොකු කරනවද කියන අංකය. Determinant = 0 නම්, machine එක space එක තැලුවා. උදාහරණ: 2D තලයක් රේඛාවකට හකුළලා දැම්මා. එහෙම වුණාම ආපහු ගන්න බෑ.',
        'Inverse කියන්නේ machine එකේ වැඩේ undo කරන machine එක. A ගුණ A inverse = identity (කිසිම වෙනසක් නොකරන matrix එක). Determinant 0 නම් inverse එකක් නෑ. Rank කියන්නේ matrix එකේ ඇත්තටම අලුත් තොරතුරු දෙන (linearly independent) rows හෝ columns ගණන. එක column එකක් තව column එකක දෙගුණය නම්, ඒකෙන් අලුත් දෙයක් කියන්නේ නෑ. Rank අඩු වෙනවා.',
        'Eigenvector කියන්නේ matrix machine එකට දැම්මාම දිශාව වෙනස් නොවී දිගින් විතරක් වෙනස් වෙන විශේෂ vector එකක්. Eigenvalue කියන්නේ ඒ දිග කී ගුණයකින් වෙනස් වුණාද කියන අංකය. SVD (Singular Value Decomposition) කියන්නේ ඕනෑම matrix එකක් "කරකවන්න, ඇදන්න, ආයෙත් කරකවන්න" කියන සරල පියවර තුනකට කඩන ක්‍රමය. PCA, image compression, LoRA වගේ fine-tuning ක්‍රම වල low-rank අදහස මේවා මත හැදිලා තියෙන්නේ.',
      ],
      analogy: 'Photocopy machine එකක zoom button එක හිතන්න. 200% දැම්මාම area එක 4 ගුණයක් වෙනවා: ඒක determinant එක වගේ. 50% දැම්මාම ආපහු original size එකට එනවා: ඒක inverse එක. කොළේ තද කරලා රේඛාවක් වෙනකම් තැලුවොත්, ආයෙත් ලස්සනට දිගඅරින්න බෑ: determinant = 0, inverse නෑ.',
      example: 'Matrix [[2, 0], [0, 3]] කියන්නේ x දිශාවට 2 ගුණයක්, y දිශාවට 3 ගුණයක් අදින machine එකක්. Determinant = 2 x 3 = 6, ඒ කියන්නේ 1x1 කොටුවක් area 6ක කොටුවක් වෙනවා. [1, 0] vector එක [2, 0] වෙනවා: දිශාව එකමයි, දිග 2 ගුණයි. ඉතින් [1, 0] eigenvector එකක්, eigenvalue = 2. Inverse = [[0.5, 0], [0, 1/3]].',
      code: {
        lang: 'python',
        src: `import numpy as np

A = np.array([[2, 0], [0, 3]])
print(np.linalg.det(A))         # determinant = 6.0
print(np.linalg.inv(A))         # inverse
print(np.linalg.matrix_rank(A)) # rank = 2

vals, vecs = np.linalg.eig(A)
print(vals)                     # eigenvalues: [2. 3.]

U, S, Vt = np.linalg.svd(A)     # SVD: කරකවන්න, අදින්න, කරකවන්න
print(S)                        # singular values: [3. 2.]`,
      },
      keyPoints: [
        'මේ topic එක දැන්ම ඕනේ නෑ, පස්සේ බලමු. අදහස විතරක් මතක තියාගන්න.',
        'Matrix = space එක වෙනස් කරන machine එකක්.',
        'Determinant = area එක කී ගුණයක් වෙනස් වෙනවද. 0 නම් inverse නෑ.',
        'Eigenvector = දිශාව වෙනස් නොවෙන vector එක. Eigenvalue = ඒක අදින ප්‍රමාණය.',
        'SVD සහ rank අදහස් PCA, compression, LoRA වල පාවිච්චි වෙනවා.',
      ],
      terms: [
        { en: 'Inverse', si: 'Matrix එකක වැඩේ undo කරන matrix එක. හැම matrix එකකටම නෑ.' },
        { en: 'Determinant', si: 'Matrix එක area / volume කී ගුණයක් වෙනස් කරනවද කියන අංකය.' },
        { en: 'Rank', si: 'ඇත්තටම අලුත් තොරතුරු දෙන (linearly independent) rows හෝ columns ගණන.' },
        { en: 'Eigenvalue', si: 'Eigenvector එකක් කී ගුණයකින් ඇදෙනවද (හෝ හැකිලෙනවද) කියන අංකය.' },
        { en: 'Eigenvector', si: 'Matrix එක හරහා ගියාම දිශාව වෙනස් නොවී දිග විතරක් වෙනස් වෙන vector එක.' },
        { en: 'SVD (Singular Value Decomposition)', si: 'ඕනෑම matrix එකක් කරකවීම, ඇදීම, කරකවීම කියන කොටස් තුනකට කැඩීම.' },
        { en: 'Identity Matrix', si: 'කිසිම වෙනසක් නොකරන matrix එක. අංක වල 1 වගේ.' },
      ],
    },
    {
      id: 'derivatives-gradients',
      title: 'Derivatives, Partial Derivatives, Gradients',
      body: [
        '[අත්‍යවශ්‍යයි] Derivative කියන්නේ "එක දෙයක් පොඩ්ඩක් වෙනස් කළාම, තව දෙයක් කොච්චර වෙනස් වෙනවද" කියන එක. ඒ කියන්නේ වෙනස් වීමේ වේගය, නැත්නම් බෑවුම (slope). Car එකක speedometer එක පෙන්නන්නේ දුර කාලයත් එක්ක වෙනස් වෙන වේගය. ඒක derivative එකක්.',
        '[අත්‍යවශ්‍යයි] ඇත්ත ලෝකයේ result එකක් එක දෙයක් මත විතරක් රඳා පවතින්නේ නෑ. කොත්තු එකක රසය මිරිස්, ලුණු, තෙල් ගොඩක් දේවල් මත රඳා පවතිනවා. Partial derivative කියන්නේ අනිත් ඔක්කොම එහෙමම තියලා, එක දෙයක් විතරක් පොඩ්ඩක් වෙනස් කළාම result එක කොච්චර වෙනස් වෙනවද කියන එක.',
        '[අත්‍යවශ්‍යයි] Gradient කියන්නේ හැම input එකකටම partial derivatives ටික එකට දාපු vector එක. ඒක පෙන්නන්නේ result එක වේගයෙන්ම වැඩි වෙන දිශාව. Model එකක loss එක අඩු කරන්න ඕනේ නිසා, අපි gradient එකට විරුද්ධ පැත්තට යනවා. ඒක තමයි Gradient Descent. Model එකක weights මිලියන ගණනක් තිබුණත්, gradient එක කියනවා හැම weight එකක්ම මොන පැත්තට කොච්චර හරවන්න ඕනෙද කියලා.',
      ],
      analogy: 'කොත්තු කඩේ අයියා ලුණු හැන්දක් වැඩිපුර දැම්මාම රසය කොච්චර වෙනස් වෙනවද: ඒක ලුණු වලට partial derivative එක. මිරිස් වලටත්, තෙල් වලටත් එහෙම බලලා ඔක්කොම එකට ලිස්ට් එකක් හැදුවොත්, "රසය වැඩි කරන්න මොනවා කොච්චර වෙනස් කරන්න ඕනෙද" කියන ලිස්ට් එක තමයි gradient එක.',
      example: 'y = x x x (x වර්ගය) කියමු. x = 3 නම් y = 9. x එක 3.01 කළොත් y = 9.0601. වෙනස 0.0601ක්, x වෙනස් වුණේ 0.01යි. 0.0601 / 0.01 = 6.01, ඒ කියන්නේ ආසන්න වශයෙන් 6. x = 3 දී derivative එක 6 (නීතිය: x වර්ගයේ derivative = 2x = 6). දැන් loss = w1 වර්ගය + w2 වර්ගය, w1 = 3, w2 = 1 නම්, gradient = [6, 2]. ඒ කියන්නේ w1 වෙනස් කිරීම loss එකට 3 ගුණයක් බලපානවා.',
      code: {
        lang: 'python',
        src: `# derivative එක අතින් ආසන්නව හොයමු
def f(x):
    return x * x

x = 3
h = 0.0001                       # පොඩි වෙනසක්
slope = (f(x + h) - f(x)) / h
print(round(slope, 2))           # ~6.0

# loss = w1^2 + w2^2 -> gradient = [2*w1, 2*w2]
w1, w2 = 3, 1
print([2 * w1, 2 * w2])          # [6, 2]`,
      },
      keyPoints: [
        'Derivative = වෙනස් වීමේ වේගය / බෑවුම.',
        'Partial derivative = අනිත් ඒවා එහෙමම තියලා එක input එකක් විතරක් වෙනස් කිරීම.',
        'Gradient = හැම partial derivative එකක්ම එකට තියෙන vector එක. වේගයෙන්ම වැඩි වෙන දිශාව.',
        'Training = gradient එකට විරුද්ධ පැත්තට පියවර තියලා loss අඩු කිරීම.',
      ],
      terms: [
        { en: 'Derivative', si: 'Input එක පොඩ්ඩක් වෙනස් කළාම output එක වෙනස් වෙන වේගය.' },
        { en: 'Partial Derivative', si: 'Inputs ගොඩක් තියෙද්දී, එකක් විතරක් වෙනස් කරලා බලන derivative එක.' },
        { en: 'Gradient', si: 'Partial derivatives ඔක්කොම එකට තියෙන vector එක. ඉහළට බෑවුම වැඩිම දිශාව පෙන්නනවා.' },
        { en: 'Slope', si: 'බෑවුම. රේඛාවක් කොච්චර දැඩිව නගිනවද.' },
      ],
    },
    {
      id: 'chain-rule',
      title: 'Chain Rule, Jacobian, Hessian, Integrals, Taylor Series',
      body: [
        '[අත්‍යවශ්‍යයි] Chain rule කියන්නේ දේවල් දාමයක් විදිහට එකිනෙකට සම්බන්ධ වෙලා තියෙද්දී, මුල වෙනස් කළාම අගට වෙන බලපෑම හොයන ක්‍රමය. A වෙනස් වුණාම B වෙනස් වෙනවා, B වෙනස් වුණාම C වෙනස් වෙනවා. එතකොට A ගෙන් C ට බලපෑම = (A ගෙන් B ට බලපෑම) ගුණ (B ගෙන් C ට බලපෑම). පියවරෙන් පියවර ගුණ කරනවා, එච්චරයි.',
        '[අත්‍යවශ්‍යයි] Neural network එකක් කියන්නේ layers දාමයක්. Input එක layer 1 → layer 2 → ... → loss එක දක්වා යනවා. Backpropagation කියන්නේ chain rule එක loss එකේ ඉඳන් ආපස්සට, layer එකෙන් layer එකට යොදලා, හැම weight එකකටම gradient එක හොයන ක්‍රමය. PyTorch වල loss.backward() කියලා ගැහුවාම වෙන්නේ මේක. ඔයාට අතින් කරන්න ඕනේ නෑ, ඒත් මොකක්ද වෙන්නේ කියලා දැනගන්න එක ගොඩක් වටිනවා.',
        '[දැන්ම ඕනේ නෑ, පස්සේ බලමු] Jacobian කියන්නේ inputs ගොඩක් සහ outputs ගොඩක් තියෙද්දී, හැම output එකක්ම හැම input එකකටම අදාළව කොච්චර වෙනස් වෙනවද කියන partial derivatives table එක (matrix එක). Hessian කියන්නේ second derivatives වල matrix එක. ඒක කියන්නේ බෑවුම කොහොමද වෙනස් වෙන්නේ, ඒ කියන්නේ loss කන්දේ වක්‍රතාවය (curvature).',
        '[දැන්ම ඕනේ නෑ, පස්සේ බලමු] Integral කියන්නේ derivative එකේ ප්‍රතිවිරුද්ධය. පොඩි පොඩි කෑලි ගොඩක් එකතු කරලා මුළු එකම හොයන එක: curve එකක් යට තියෙන area එක. Probability වලදී "අගය 1 සහ 2 අතර වෙන්න තියෙන සම්භාවිතාව" = ඒ curve එක යට ඒ කොටසේ area එක. Taylor series කියන්නේ සංකීර්ණ function එකක්, එක තැනක් ළඟ, සරල polynomial එකකින් (සරල රේඛාව, ඊට පස්සේ වක්‍රය...) ආසන්නව ලියන ක්‍රමය. Gradient descent වැඩ කරන්නේ ඇයි කියලා තේරුම් ගන්න මේ අදහස උදව් වෙනවා.',
      ],
      analogy: 'Chain rule: ඩොලරය Rs. 300යි කියමු. Online එකේ බඩුවක මිල ඩොලර් 1කින් වැඩි වුණාම, රුපියල් වලින් 300ක් වැඩි වෙනවා. ඒ රුපියල් 300ට tax 10%ක් එකතු වුණොත් ඔයාගේ අන්තිම bill එක Rs. 330කින් වැඩි වෙනවා. ඩොලර් → රුපියල් → tax සමග bill: 300 x 1.1 = 330. දාමයේ හැම පියවරකම බලපෑම ගුණ කළා.',
      example: 'y = 3x, z = 2y කියමු. x එක 1කින් වැඩි කළොත් y 3කින් වැඩි වෙනවා. y 1කින් වැඩි වුණොත් z 2කින් වැඩි වෙනවා. ඉතින් x එක 1කින් වැඩි කළොත් z = 3 x 2 = 6කින් වැඩි වෙනවා. x = 1 → y = 3 → z = 6. x = 2 → y = 6 → z = 12. ඇත්තටම 6කින් වැඩි වුණා. Taylor උදාහරණයක්: x පොඩි නම් sin(x) ≈ x. sin(0.1) = 0.0998, ඒක 0.1 ට ගොඩක් ළඟයි.',
      code: {
        lang: 'python',
        src: `import torch

x = torch.tensor(1.0, requires_grad=True)
y = 3 * x        # පළවෙනි පියවර
z = 2 * y        # දෙවෙනි පියවර
z.backward()     # chain rule එක ආපස්සට (backpropagation)
print(x.grad)    # tensor(6.) -> 3 x 2`,
      },
      keyPoints: [
        'Chain rule = දාමයක හැම පියවරකම බලපෑම ගුණ කිරීම.',
        'Backpropagation = chain rule එක loss එකේ ඉඳන් ආපස්සට යෙදීම.',
        'Jacobian = පළවෙනි derivatives matrix එක. Hessian = දෙවෙනි derivatives matrix එක (curvature). දැන්ම ඕනේ නෑ, පස්සේ බලමු.',
        'Integral = curve එක යට area එක. Probability වලදී ඕනේ වෙනවා.',
        'Taylor series = එක තැනක් ළඟ function එකක් සරල polynomial එකකින් ආසන්න කිරීම.',
      ],
      terms: [
        { en: 'Chain Rule', si: 'එකිනෙකට සම්බන්ධ functions දාමයක derivatives ගුණ කරලා මුළු derivative එක හොයන නීතිය.' },
        { en: 'Backpropagation', si: 'Neural network එකක හැම weight එකකටම gradient එක chain rule එකෙන් ආපස්සට ගණනය කිරීම.' },
        { en: 'Jacobian', si: 'Outputs ගොඩක හැම එකකම, inputs ගොඩක හැම එකකටම අදාළ partial derivatives matrix එක.' },
        { en: 'Hessian', si: 'Second partial derivatives matrix එක. Loss surface එකේ වක්‍රතාවය කියනවා.' },
        { en: 'Integral', si: 'පොඩි කෑලි ගොඩක් එකතු කරලා මුළු එක හොයන එක. Curve එක යට area එක.' },
        { en: 'Taylor Series', si: 'Function එකක්, එක point එකක් ළඟ, සරල polynomial terms එකතුවකින් ආසන්න කිරීම.' },
      ],
    },
    {
      id: 'probability-basics',
      title: 'Probability: Random Variables, Conditional Probability, Bayes Theorem',
      body: [
        '[අත්‍යවශ්‍යයි] AI කවදාවත් 100% ස්ථිරව කියන්නේ නෑ. ChatGPT ඊළඟ වචනය තෝරන්නේ probabilities වලින්. Spam filter එක කියන්නේ "මේක spam වෙන්න 97% ඉඩ තියෙනවා" කියලා. ඉතින් probability කියන්නේ AI වල භාෂාව. Probability = 0 (කවදාවත් වෙන්නේ නෑ) ඉඳන් 1 (අනිවාර්යයෙන් වෙනවා) දක්වා අංකයක්.',
        '[අත්‍යවශ්‍යයි] Random variable කියන්නේ අහඹු සිදුවීමක ප්‍රතිඵලය අංකයකින් කියන එක. දාදු කැටයක් දැම්මාම එන අංකය (1-6), හෙට වහින mm ප්‍රමාණය. Discrete = ගණන් කරන්න පුළුවන් අගයන් (1, 2, 3). Continuous = ඕනෑම අගයක් (31.25°C). Joint probability = දේවල් දෙකක් එකටම වෙන්න තියෙන ඉඩ. Marginal probability = එක දෙයක් විතරක් ගැන, අනිත් එක ගණන් නොගෙන (joint table එකේ row එකක් එකතු කළාම එනවා).',
        '[අත්‍යවශ්‍යයි] Conditional probability කියන්නේ "B වුණා කියලා දන්නවා නම්, A වෙන්න තියෙන ඉඩ" කියන එක. ලියන්නේ P(A | B) කියලා: | ලකුණ කියවන්නේ "දන්නවා නම්" කියලා. කළු වලාකුළු තියෙනවා කියලා දන්නවා නම්, වහින්න තියෙන ඉඩ වැඩියි. Independence කියන්නේ එකක් දැනගත්තට අනිත් එකේ probability එක වෙනස් වෙන්නේ නෑ කියන එක. Coin දෙකක් දැම්මාම පළවෙනි එක head වුණාට දෙවෙනි එකට බලපෑමක් නෑ. එතකොට P(A සහ B) = P(A) x P(B).',
        '[අත්‍යවශ්‍යයි] Bayes Theorem කියන්නේ අලුත් සාක්ෂියක් ආවාම අපේ විශ්වාසය update කරන ක්‍රමය. P(A | B) = P(B | A) x P(A) / P(B). වචන වලින්: (A ඇත්ත නම් මේ සාක්ෂිය දකින්න තියෙන ඉඩ) x (සාක්ෂියට කලින් A ගැන විශ්වාසය) ÷ (සාක්ෂිය දකින්න තියෙන මුළු ඉඩ). කලින් විශ්වාසයට prior කියනවා. Update කරාට පස්සේ එකට posterior කියනවා.',
      ],
      analogy: 'Colombo traffic: සාමාන්‍ය දවසක office එකට late වෙන්න 10%ක ඉඩ තියෙනවා. ඒත් "අද හොඳටම වහිනවා" කියලා දන්නවා නම්, late වෙන්න ඉඩ 50% වෙන්න පුළුවන්. ඒ "වහිනවා නම් late වීම" තමයි conditional probability. වැස්ස නිසා ඔයාගේ විශ්වාසය update කරේ Bayes thinking.',
      example: 'රෝගයක් මිනිස්සු 1%කට තියෙනවා. Test එක රෝගය තියෙන අයගෙන් 90%ක් අල්ලනවා, ඒත් නිරෝගී අයගෙන් 5%කට වැරදියට positive පෙන්නනවා. ඔයාට positive ආවා. රෝගය තියෙන්න ඉඩ කීයද? මිනිස්සු 10,000ක් ගමු: රෝගීන් 100යි, එයින් 90ක් positive. නිරෝගී 9,900යි, එයින් 495ක් වැරදියට positive. මුළු positive = 585. ඇත්ත රෝගීන් = 90. 90 / 585 ≈ 15%යි! 90% නෙවෙයි. Prior එක (1%) ගොඩක් පොඩි නිසා.',
      code: {
        lang: 'python',
        src: `# Bayes: positive test එකකට පස්සේ රෝගය තියෙන්න ඉඩ
p_sick = 0.01              # prior: 1%
p_pos_if_sick = 0.90       # රෝගීන් අල්ලන ප්‍රමාණය
p_pos_if_healthy = 0.05    # වැරදි positive ප්‍රමාණය

p_pos = p_pos_if_sick * p_sick + p_pos_if_healthy * (1 - p_sick)
p_sick_if_pos = p_pos_if_sick * p_sick / p_pos
print(round(p_sick_if_pos, 3))   # 0.154 -> ~15%`,
      },
      keyPoints: [
        'Probability = 0 ඉඳන් 1 දක්වා අංකයක්. AI හැමදාම probabilities වලින් කතා කරනවා.',
        'Conditional probability P(A | B) = B දන්නවා නම් A වෙන්න ඉඩ.',
        'Independent නම් P(A සහ B) = P(A) x P(B).',
        'Bayes = prior විශ්වාසය + අලුත් සාක්ෂිය = posterior විශ්වාසය.',
        'Prior එක ගොඩක් පොඩි නම්, හොඳ test එකකුත් වැරදි positives ගොඩක් දෙනවා.',
      ],
      terms: [
        { en: 'Random Variable', si: 'අහඹු සිදුවීමක ප්‍රතිඵලය අංකයකින් ලියන එක.' },
        { en: 'Conditional Probability', si: 'වෙන දෙයක් වුණා කියලා දන්නවා නම්, යම් දෙයක් වෙන්න තියෙන ඉඩ. P(A | B).' },
        { en: 'Bayes Theorem', si: 'අලුත් සාක්ෂියක් එක්ක prior විශ්වාසය posterior එකකට update කරන නීතිය.' },
        { en: 'Independence', si: 'එක දෙයක් දැනගැනීමෙන් අනිත් එකේ probability එක වෙනස් නොවීම.' },
        { en: 'Joint Probability', si: 'දේවල් දෙකක් එකටම වෙන්න තියෙන ඉඩ. P(A සහ B).' },
        { en: 'Marginal Probability', si: 'අනිත් variable එක ගැන නොසලකා (ඒකේ හැම අගයක් හරහාම එකතු කරලා) එක variable එකක probability එක.' },
        { en: 'Prior / Posterior', si: 'Prior = සාක්ෂියට කලින් විශ්වාසය. Posterior = සාක්ෂියට පස්සේ update වුණ විශ්වාසය.' },
      ],
    },
    {
      id: 'distributions',
      title: 'Probability Distributions (Normal Distribution සහ යාළුවෝ)',
      lab: 'normal-dist',
      body: [
        '[අත්‍යවශ්‍යයි] Distribution එකක් කියන්නේ random variable එකකට එන්න පුළුවන් හැම අගයකටම, ඒ අගය එන්න තියෙන ඉඩ කොච්චරද කියලා පෙන්නන "සිතියම". Data එකක හැඩය දන්නවා නම්, ඒ ගැන ගොඩක් දේවල් අනුමාන කරන්න පුළුවන්.',
        '[අත්‍යවශ්‍යයි] Normal distribution (Gaussian, bell curve) තමයි වැදගත්ම එක. මැද උස, දෙපැත්තට සමමිතිකව අඩු වෙන සීනුවක හැඩය. මිනිස්සුන්ගේ උස, exam marks වගේ ගොඩක් දේවල් මේ හැඩයට ළඟයි. ඒක විස්තර කරන්න අංක දෙකයි ඕනේ: mean (මැද තැන) සහ standard deviation (කොච්චර පැතිරිලාද). නීතිය 68-95-99.7: data වලින් 68%ක් mean එකේ සිට standard deviation 1ක් ඇතුළේ, 95%ක් 2ක් ඇතුළේ, 99.7%ක් 3ක් ඇතුළේ. පහළ lab එකේ sliders හොලවලා බලන්න.',
        '[අත්‍යවශ්‍යයි] Discrete (ගණන් කරන) distributions: Bernoulli = එක පාරක් ඔව් / නෑ (coin එකක් එක පාරක්, customer කෙනෙක් click කළාද නැද්ද). Binomial = Bernoulli n පාරක් කළාම සාර්ථක වුණ ගණන (coin 10 පාරක් දැම්මාම heads කීයද). Poisson = නියමිත කාලයක් ඇතුළත, සාමාන්‍ය අනුපාතයක් තියෙද්දී, සිද්ධි කීයක් වෙනවද (පැයකට call center එකට එන calls). Poisson එකේ mean එකයි variance එකයි දෙකම එකම අගයයි.',
        '[ටිකක් දැනගත්තාම හොඳයි] Continuous distributions: Uniform = හැම අගයක්ම සමාන ඉඩකින් (random number generator එකක් 0-1 අතර). Normal = bell curve. Exponential = ඊළඟ සිද්ධියට කොච්චර වෙලා බලන් ඉන්න වෙනවද (ඊළඟ bus එකට විනාඩි කීයද). Exponential එක "memoryless": දැනටමත් විනාඩි 10ක් බලන් හිටියා කියලා ඉතුරු බලන් ඉන්න කාලයේ distribution එක වෙනස් වෙන්නේ නෑ.',
      ],
      analogy: 'A/L Combined Maths marks ගොඩක් ළමයින්ගේ ගත්තොත්, ගොඩක් දෙනා මැද marks වටේ. ඉතා ඉහළ marks සහ ඉතා පහළ marks ගන්නේ ටික දෙනයි. Graph එකක ඇන්දොත් සීනුවක් වගේ: ඒක normal distribution එක. Galle Road එකේ bus stop එකකට පැයකට bus කීයක් එනවද කියන එක Poisson. ඊළඟ bus එකට බලන් ඉන්න කාලය Exponential.',
      example: 'Class එකක marks වල mean = 60, standard deviation = 10 කියමු. එතකොට ආසන්න වශයෙන් ළමයින්ගෙන් 68%ක් 50-70 අතර, 95%ක් 40-80 අතර, 99.7%ක් 30-90 අතර. 90ට වඩා ගන්නේ 0.15%ක් විතර විතරයි. Binomial උදාහරණය: online ad එකක් 100 දෙනෙක්ට පෙන්නුවා, හැම කෙනෙක්ම click කරන්න ඉඩ 3%යි. සාමාන්‍යයෙන් clicks 100 x 0.03 = 3ක් බලාපොරොත්තු වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import numpy as np
rng = np.random.default_rng(0)

marks = rng.normal(loc=60, scale=10, size=10000)  # Normal
print(np.mean((marks > 50) & (marks < 70)))       # ~0.68

clicks = rng.binomial(n=100, p=0.03, size=5)      # Binomial
calls = rng.poisson(lam=4, size=5)                # Poisson: පැයකට calls ~4
wait = rng.exponential(scale=10, size=5)          # Exponential: bus wait, සාමාන්‍ය විනාඩි 10
coin = rng.integers(0, 2, size=5)                 # Bernoulli (p=0.5)
u = rng.uniform(0, 1, size=5)                     # Uniform
print(clicks, calls)`,
      },
      keyPoints: [
        'Distribution = හැම අගයකටම එන්න තියෙන ඉඩ පෙන්නන සිතියම.',
        'Normal = bell curve. Mean (මැද) සහ standard deviation (පැතිරීම) දෙකෙන් සම්පූර්ණයෙන් විස්තර වෙනවා.',
        '68-95-99.7 නීතිය මතක තියාගන්න.',
        'Bernoulli = එක ඔව් / නෑ, Binomial = ඔව් ගණන, Poisson = කාලයක් ඇතුළත සිද්ධි ගණන.',
        'Uniform = හැම අගයක්ම සමානයි, Exponential = ඊළඟ සිද්ධියට බලන් ඉන්න කාලය.',
      ],
      terms: [
        { en: 'Probability Distribution', si: 'Random variable එකක හැම අගයකටම තියෙන probability එක පෙන්නන විස්තරය.' },
        { en: 'Bernoulli Distribution', si: 'එක පාරක් කරන ඔව් / නෑ test එකක්. p = ඔව් වෙන්න ඉඩ.' },
        { en: 'Binomial Distribution', si: 'Bernoulli trials n ගණනකදී සාර්ථක වෙන ගණන.' },
        { en: 'Poisson Distribution', si: 'නියමිත කාලයක / ඉඩක, සාමාන්‍ය අනුපාතයක් එක්ක, සිද්ධි වෙන ගණන. Mean = variance.' },
        { en: 'Uniform Distribution', si: 'නියමිත පරාසයක් ඇතුළේ හැම අගයකටම සමාන ඉඩක්.' },
        { en: 'Normal (Gaussian) Distribution', si: 'Mean එක වටේ සමමිතික bell curve එක.' },
        { en: 'Exponential Distribution', si: 'Poisson සිද්ධි අතර බලන් ඉන්න කාලය. Memoryless.' },
        { en: 'PDF / PMF', si: 'PDF = continuous variable එකක density curve එක (area = probability). PMF = discrete variable එකක හැම අගයකම probability එක.' },
      ],
    },
    {
      id: 'expectation-variance',
      title: 'Expectation, Variance, Covariance, LLN, CLT',
      body: [
        '[අත්‍යවශ්‍යයි] Expectation (expected value) කියන්නේ දිගු කාලයක් පුරා බලාපොරොත්තු වෙන්න පුළුවන් සාමාන්‍ය අගය. හැම අගයක්ම ඒකේ probability එකෙන් ගුණ කරලා එකතු කරනවා. සාධාරණ දාදු කැටයක expected value = (1+2+3+4+5+6) / 6 = 3.5. 3.5 කවදාවත් එන්නේ නෑ. ඒත් ගොඩක් වතාවක් දැම්මාම සාමාන්‍යය 3.5 ට ළං වෙනවා.',
        '[අත්‍යවශ්‍යයි] Variance කියන්නේ අගයන් සාමාන්‍යයේ සිට කොච්චර විසිරිලාද කියන එක. හැම අගයකම සාමාන්‍යයෙන් තියෙන දුර වර්ග කරලා, ඒවයේ සාමාන්‍යය ගන්නවා. Variance එකේ වර්ගමූලය තමයි standard deviation. Covariance කියන්නේ variables දෙකක් එකට වෙනස් වෙනවද කියන එක. ධන නම්: එකක් වැඩි වෙද්දී අනිත් එකත් වැඩි වෙනවා (උෂ්ණත්වය සහ ice cream විකුණුම්). ඍණ නම්: එකක් වැඩි වෙද්දී අනිත් එක අඩු වෙනවා.',
        '[අත්‍යවශ්‍යයි] Law of Large Numbers (LLN): samples ගොඩක් ගන්න ගන්න, ඒවයේ සාමාන්‍යය ඇත්ත expected value එකට ළං වෙනවා. ඒ නිසයි data වැඩි වෙන්න වෙන්න estimates විශ්වාසදායක වෙන්නේ. Central Limit Theorem (CLT): Original data එකේ හැඩය මොකක් වුණත් (finite variance තියෙනවා නම්), independent samples ගොඩක සාමාන්‍යය normal distribution එකකට ආසන්නව යනවා. Normal distribution එක හැම තැනම පේන්නේ ඇයි කියන එකට වැදගත් හේතුවක් මේක. Hypothesis tests ගොඩක් මේක මත රඳා පවතිනවා.',
      ],
      analogy: 'කඩේකට දවසකට එන ආදායම: සමහර දවස් Rs. 5,000යි, සමහර දවස් Rs. 25,000යි. Expected value එක කියන්නේ "සාමාන්‍යයෙන් දවසකට කීයක් එනවද". Variance කියන්නේ "ආදායම කොච්චර උඩ පහළ යනවද". කඩේ එක දවසක් බලලා තීරණ ගන්නේ නෑ. මාස ගාණක් බැලුවාම ඇත්ත සාමාන්‍යය පේනවා: ඒක LLN.',
      example: 'Lottery ticket එකක් Rs. 100යි. Rs. 10,000ක් දිනන්න 0.5%ක ඉඩ තියෙනවා, එහෙම නැත්නම් කිසිවක් නෑ. Expected winnings = 10,000 x 0.005 = Rs. 50. ඉතින් ticket එකකට සාමාන්‍යයෙන් Rs. 50ක් පාඩුයි. CLT: දාදු කැටයක් එක පාරක් දැම්මාම distribution එක පැතලියි (uniform). ඒත් කැට 30ක් දාලා සාමාන්‍යය ගන්න එක 1000 පාරක් කළොත්, ඒ සාමාන්‍යයන් වල histogram එක 3.5 වටේ bell curve එකක් වෙනවා.',
      code: {
        lang: 'python',
        src: `import numpy as np
rng = np.random.default_rng(1)

rolls = rng.integers(1, 7, size=100000)
print(rolls.mean())          # LLN: ~3.5
print(rolls.var())           # variance: ~2.92

# CLT: කැට 30ක සාමාන්‍යය 1000 පාරක්
means = rng.integers(1, 7, size=(1000, 30)).mean(axis=1)
print(means.mean(), means.std())   # ~3.5, ~0.31 (bell curve එකක්)

temp = np.array([28, 30, 32, 34])
icecream = np.array([50, 65, 80, 95])
print(np.cov(temp, icecream)[0, 1])  # ධන covariance`,
      },
      keyPoints: [
        'Expectation = දිගු කාලීන සාමාන්‍යය (probability එකෙන් බර කරපු average එක).',
        'Variance = විසිරීම. Standard deviation = variance එකේ වර්ගමූලය.',
        'Covariance ධන නම් එකට වැඩි වෙනවා, ඍණ නම් විරුද්ධ පැතිවලට යනවා.',
        'LLN = data වැඩි වෙද්දී sample average එක ඇත්ත අගයට ළං වෙනවා.',
        'CLT = samples ගොඩක සාමාන්‍යය normal distribution එකකට ළං වෙනවා.',
      ],
      terms: [
        { en: 'Expectation (Expected Value)', si: 'හැම අගයක්ම ඒකේ probability එකෙන් ගුණ කරලා එකතු කළාම එන දිගු කාලීන සාමාන්‍යය.' },
        { en: 'Variance', si: 'අගයන් mean එකේ සිට තියෙන දුර වර්ග කරලා ගත්තු සාමාන්‍යය. විසිරීමේ මිනුම.' },
        { en: 'Covariance', si: 'Variables දෙකක් එකට වෙනස් වෙන ආකාරය. ධන, ඍණ, හෝ ආසන්න වශයෙන් 0.' },
        { en: 'Law of Large Numbers', si: 'Samples ගණන වැඩි වෙද්දී sample mean එක expected value එකට ළං වීම.' },
        { en: 'Central Limit Theorem', si: 'Independent samples ගොඩක mean එකේ distribution එක normal එකකට ආසන්න වීම.' },
      ],
    },
    {
      id: 'descriptive-stats',
      title: 'Descriptive Statistics සහ Sampling',
      body: [
        '[අත්‍යවශ්‍යයි] Data ගොඩක් තියෙද්දී ඒක අංක කිහිපයකින් සාරාංශ කරන්න ඕනේ. Mean = සාමාන්‍යය (ඔක්කොම එකතු කරලා ගණනින් බෙදන එක). Median = පිළිවෙළට තිබ්බාම හරි මැද අගය. Mode = වැඩිපුරම එන අගය. Outliers (අමුතු ලොකු / පොඩි අගයන්) තියෙද්දී mean එක ඇදිලා යනවා, ඒත් median එක එච්චර වෙනස් වෙන්නේ නෑ.',
        '[අත්‍යවශ්‍යයි] Standard deviation කියන්නේ data සාමාන්‍යයෙන් mean එකේ සිට කොච්චර ඈතින්ද තියෙන්නේ කියන එක. ඒක data එකේම units වලින් එනවා (marks, රුපියල්). Percentile කියන්නේ යම් අගයකට වඩා පහළින් data වලින් කීයක් තියෙනවද කියන එක. 90th percentile එකේ ඉන්නවා කියන්නේ 90%කට වඩා හොඳින් කළා කියන එක. Median = 50th percentile. API latency මනිද්දී "p99 latency" කියන්නේ 99th percentile එක.',
        '[අත්‍යවශ්‍යයි] Sampling කියන්නේ මුළු ජනගහනයම (population) බලන්න බැරි නිසා, ඉන් කොටසක් (sample) අරගෙන ඒ ගැන නිගමනය කරන එක. Sample එක random සහ නියෝජනාත්මක (representative) වෙන්න ඕනේ. Colombo 7 විතරක් survey කරලා මුළු ලංකාවේම ආදායම ගැන කියන්න බෑ: ඒක sampling bias. AI වලදීත් training data එකේ bias තිබුණොත් model එකත් bias වෙනවා.',
      ],
      analogy: 'බත් හැලියක් හරියට ලුණුද කියලා බලන්න මුළු හැලියම කන්නේ නෑ. හොඳට කලවම් කරලා හැන්දක් රස බලනවා. ඒක sampling. හැලියේ උඩ විතරක් ලුණු තිබුණොත්, කලවම් නොකර උඩින් ගත්තු හැන්ද වැරදි පිළිතුරක් දෙනවා: ඒක biased sample එකක්.',
      example: 'Office එකක 5 දෙනෙකුගේ මාසික පඩි (දහස් වලින්): 50, 60, 70, 80, 1000 (boss). Mean = 1260 / 5 = 252k. Median = 70k. Boss ගේ පඩිය නිසා mean එක ගොඩක් ඉහළ ගියා, ඒත් සාමාන්‍ය සේවකයෙක්ට ලැබෙන්නේ 70k වගේ. ඉතින් ආදායම, ගෙවල් මිල වගේ දේවල් වලට median එක හොඳ මිනුමක්. Marks 40, 50, 50, 60, 70 නම් mode = 50.',
      code: {
        lang: 'python',
        src: `import numpy as np
from statistics import mode

salary = np.array([50, 60, 70, 80, 1000])  # දහස් වලින්
print(np.mean(salary))          # 252.0  (boss නිසා ඇදිලා)
print(np.median(salary))        # 70.0
print(mode([40, 50, 50, 60, 70]))  # 50
print(np.std(salary))           # standard deviation
print(np.percentile(salary, 90))  # 90th percentile`,
      },
      keyPoints: [
        'Mean = සාමාන්‍යය, Median = මැද අගය, Mode = වැඩිපුරම එන අගය.',
        'Outliers තියෙද්දී median එක mean එකට වඩා විශ්වාසදායකයි.',
        'Standard deviation = විසිරීම, data එකේම units වලින්.',
        'Percentile = ඒ අගයට පහළින් data වලින් කී %ක් තියෙනවද.',
        'Sample එක random සහ representative නැත්නම් නිගමන වැරදියි.',
      ],
      terms: [
        { en: 'Mean', si: 'අගයන් ඔක්කොම එකතු කරලා ගණනින් බෙදූ සාමාන්‍යය.' },
        { en: 'Median', si: 'පිළිවෙළට තිබ්බාම මැද තියෙන අගය.' },
        { en: 'Mode', si: 'වැඩිපුරම වතාවක් එන අගය.' },
        { en: 'Standard Deviation', si: 'Variance එකේ වර්ගමූලය. Data mean එකෙන් සාමාන්‍යයෙන් කොච්චර ඈතද.' },
        { en: 'Percentile', si: 'යම් අගයකට පහළින් data වලින් කී %ක් තියෙනවද කියන එක.' },
        { en: 'Sampling', si: 'Population එකෙන් කොටසක් අරගෙන මුළු එක ගැන අනුමාන කිරීම.' },
        { en: 'Sampling Bias', si: 'Sample එක population එක හරියට නියෝජනය නොකිරීම.' },
        { en: 'Outlier', si: 'අනිත් data වලට වඩා ගොඩක් වෙනස් අමුතු අගයක්.' },
      ],
    },
    {
      id: 'hypothesis-testing',
      title: 'Hypothesis Testing, p-value, A/B Testing, Correlation vs Causation',
      body: [
        '[අත්‍යවශ්‍යයි] Hypothesis testing කියන්නේ "මේ දැකපු වෙනස ඇත්තද, නැත්නම් වාසනාවෙන් / අහඹුවට වුණාද" කියලා තීරණය කරන ක්‍රමය. මුලින්ම null hypothesis එකක් හිතනවා: "කිසිම වෙනසක් නෑ". ඊට පස්සේ බලනවා data එක ඒ උපකල්පනයත් එක්ක කොච්චර අමුතුද කියලා.',
        '[අත්‍යවශ්‍යයි] p-value කියන්නේ: null hypothesis එක සහ test එකේ උපකල්පන ඇත්ත නම්, දැකපු තරම් හෝ ඊට වඩා අන්ත ප්‍රතිඵලයක් ලැබෙන්න තියෙන probability එක. p-value එක පොඩි නම් (උදා: කලින් තෝරාගත් 0.05 සීමාවට අඩු), මේ data එක null hypothesis එකට එරෙහි සාක්ෂියක්. ඒක "වෙනස අහඹුවට වුණා" කියන probability එකවත්, null hypothesis එක ඇත්ත වීමේ probability එකවත් නෙවෙයි. p < 0.05 වුණත් effect එක කුඩා හෝ ප්‍රායෝගිකව වැදගත් නැති එකක් වෙන්න පුළුවන්; effect size එක සහ confidence interval එකත් බලන්න. 95% confidence interval ක්‍රමය එකම ආකාරයෙන් නැවත නැවත භාවිතා කළොත්, එයින් 95%ක් දිගුකාලීනව ඇත්ත අගය අඩංගු කරයි.',
        '[ටිකක් දැනගත්තාම හොඳයි] Tests වර්ග: t-test = groups දෙකක mean අගයන් වෙනස්ද කියලා බලනවා (උදා: පන්ති දෙකක සාමාන්‍ය marks). Chi-square test = categories වල counts සම්බන්ධද කියලා බලනවා (උදා: දිස්ත්‍රික්කය සහ කැමති phone brand එක). ANOVA = groups තුනක් හෝ වැඩි ගණනක mean අගයන් එකපාර සසඳනවා. A/B testing කියන්නේ මේ tests ඇත්ත product එකක පාවිච්චි කරන එක: users ලාව අහඹු ලෙස groups දෙකකට බෙදලා, A version එක සහ B version එක පෙන්නලා, වෙනස statistically significant ද කියලා බලනවා.',
        '[අත්‍යවශ්‍යයි] Correlation vs causation: දේවල් දෙකක් එකට වෙනස් වෙනවා (correlation) කියලා, එකක් අනිත් එකට හේතුව (causation) කියලා අදහස් වෙන්නේ නෑ. Ice cream විකුණුම් වැඩි වෙන කාලෙම මුහුදේ ගිලෙන සිදුවීමුත් වැඩියි. Ice cream නිසා ගිලෙන්නේ නෑ. දෙකටම හේතුව රස්නෙ කාලය (confounder එකක්). Causation ඔප්පු කරන්න random experiment එකක් (A/B test වගේ) හොඳම ක්‍රමයයි.',
      ],
      analogy: 'නඩුවක් වගේ: null hypothesis = "විත්තිකරු නිවැරදිකරු". Prosecution එක සාක්ෂි ඉදිරිපත් කරනවා. සාක්ෂි ගොඩක් ප්‍රබල නම් (p-value පොඩි), "නිවැරදිකරු නම් මේ සාක්ෂි තියෙන්න ඉඩ ඉතා අඩුයි" කියලා වරදකරු කරනවා. සාක්ෂි මදි නම් නිදහස් කරනවා. ඒත් නිදහස් කළා කියලා 100% නිවැරදිකරු කියලා ඔප්පු වුණා නෙවෙයි.',
      example: 'Online කඩේක "Buy Now" button එක කොළ (A) සහ රතු (B). Users 10,000ක් අහඹු ලෙස බෙදුවා. A: 5,000න් 250ක් ගත්තා (5.0%). B: 5,000න් 300ක් ගත්තා (6.0%). නිවැරදිව සැලසුම් කළ test එකකින් p-value ≈ 0.03 ආවා කියමු. මේකෙන් "button දෙක අතර ඇත්තට වෙනසක් නෑ" යන උපකල්පනය යටතේ මේ වගේ හෝ ඊටත් අන්ත ප්‍රතිඵලයක් සාපේක්ෂව දුර්ලභ බව පේනවා. රතු button එක ගැන සාක්ෂි ලැබෙනවා; ඒත් එය හොඳ වීමේ probability එක 97%ක් හෝ වෙනස ව්‍යාපාරයට වැදගත් තරම් ලොකුයි කියන එක ඔප්පු වෙන්නේ නෑ. දක්නට ලැබුණු වෙනස percentage point 1යි. Confidence interval එකත් බලන්න. Test එක අතරතුර ප්‍රතිඵල නිතර බලලා කලින් නවත්වන එක හෝ එකම ප්‍රශ්නයට tests ගොඩක් කරන එක false positive අවදානම වැඩි කළ හැකි නිසා stopping rule එක කලින් තීරණය කරන්න.',
      code: {
        lang: 'python',
        src: `from scipy import stats

# t-test: පන්ති දෙකක marks
class_a = [65, 70, 72, 68, 75, 71]
class_b = [60, 62, 66, 58, 64, 61]
t, p = stats.ttest_ind(class_a, class_b)
print(round(p, 4))   # p < 0.05 නම් වෙනස significant

# chi-square: A/B test එකේ ගත්තා / නොගත්තා counts
table = [[250, 4750], [300, 4700]]
chi2, p2, dof, _ = stats.chi2_contingency(table)
print(round(p2, 3))

# ANOVA: groups 3ක්
print(stats.f_oneway([1, 2, 3], [2, 3, 4], [5, 6, 7]).pvalue)`,
      },
      keyPoints: [
        'Null hypothesis = "වෙනසක් නෑ" කියන මූලික උපකල්පනය.',
        'p-value = වෙනසක් නැත්නම් මේ තරම් අන්ත data අහඹුවට එන්න තියෙන ඉඩ. Null එක ඇත්ත වෙන්න තියෙන ඉඩ නෙවෙයි.',
        'p-value එකෙන් effect එකේ ප්‍රමාණය හෝ ප්‍රායෝගික වැදගත්කම කියවෙන්නේ නෑ; effect size සහ confidence interval එකත් පරීක්ෂා කරන්න.',
        't-test = groups 2ක mean, ANOVA = groups 3+ mean, Chi-square = category counts.',
        'A/B testing = random groups දෙකකට versions දෙකක් පෙන්නලා significant වෙනසක් තියෙනවද බැලීම.',
        'Test අතරතුර නැවත නැවත p-value බලලා නවත්වන එක හෝ tests ගොඩක් කරන එක false positive වැඩි කළ හැකියි.',
        'Correlation කියන්නේ causation නෙවෙයි.',
      ],
      terms: [
        { en: 'Hypothesis Testing', si: 'දැකපු වෙනසක් අහඹුවට වුණාද නැද්ද කියලා data වලින් තීරණය කරන ක්‍රමය.' },
        { en: 'Null Hypothesis', si: '"වෙනසක් / බලපෑමක් නෑ" කියන මූලික උපකල්පනය.' },
        { en: 'p-value', si: 'Null hypothesis ඇත්ත නම්, දැකපු තරම් හෝ ඊට වඩා අන්ත ප්‍රතිඵලයක් ලැබෙන්න තියෙන probability එක.' },
        { en: 'Confidence Interval', si: 'ඇත්ත අගය තියෙන්න පුළුවන් පරාසයක්. 95% CI ක්‍රමය නැවත නැවත කළොත් 95%ක් වාරවලදී ඇත්ත අගය අල්ලනවා.' },
        { en: 't-test', si: 'Groups දෙකක (හෝ group එකක් සහ දන්න අගයක) mean අගයන් සැසඳීම.' },
        { en: 'Chi-square Test', si: 'Categorical counts අතර සම්බන්ධයක් තියෙනවද, නැත්නම් බලාපොරොත්තු වෙන counts වලට ගැලපෙනවද බැලීම.' },
        { en: 'ANOVA', si: 'Groups තුනක් හෝ වැඩි ගණනක mean අගයන් එකපාර සැසඳීම.' },
        { en: 'A/B Testing', si: 'Users අහඹු ලෙස බෙදලා versions දෙකක් සසඳන experiment එක.' },
        { en: 'Correlation vs Causation', si: 'එකට වෙනස් වීම (correlation) හේතුඵල සම්බන්ධයක් (causation) ඔප්පු කරන්නේ නෑ.' },
        { en: 'Confounder', si: 'Variables දෙකටම බලපාන, පේන්නේ නැති තුන්වෙනි හේතුවක්.' },
      ],
    },
    {
      id: 'mle-map-optimization',
      title: 'MLE, MAP සහ Optimization (Convex, Minima, Lagrange)',
      body: [
        '[අත්‍යවශ්‍යයි] MLE (Maximum Likelihood Estimation) කියන්නේ: "අපි දැකපු data එක දකින්න වැඩිම ඉඩක් ලැබෙන parameter අගය මොකක්ද?" කියලා අහන එක. Coin එකක් 10 පාරක් දාලා heads 7ක් ආවොත්, MLE estimate එක p = 0.7. Neural networks train කරද්දී cross-entropy loss එක අඩු කරනවා කියන්නේ ඇත්තටම MLE කරන එක.',
        '[ටිකක් දැනගත්තාම හොඳයි] MAP (Maximum A Posteriori) කියන්නේ MLE එකට prior විශ්වාසයකුත් එකතු කරන එක (Bayes වගේ). "Coins ගොඩක් සාධාරණයි" කියලා අපි කලින් දන්නවා නම්, 10 න් 7 ආවට MAP estimate එක 0.7 ට වඩා 0.5 ට ටිකක් ළං වෙනවා. Data අඩු වෙලාවට මේක overfitting අඩු කරනවා. L2 regularization (weight decay) කියන්නේ weights වලට Gaussian prior එකක් දාපු MAP එකක් කියලා තේරුම් ගන්න පුළුවන්.',
        '[අත්‍යවශ්‍යයි] Optimization කියන්නේ loss එක අඩුම තැන හොයන එක. Convex function එකක් බඳුනක් වගේ: පහළම තැන එකයි. ඕනෑම local minimum එකක් global minimum එකමයි. Linear regression loss එක convex. Neural network loss එක non-convex: කඳු, නිම්න, වළවල් ගොඩක්. Local minimum = අවට පහළම තැන. Global minimum = මුළු එකේම පහළම තැන. ප්‍රායෝගිකව, ලොකු networks වලදී හොයාගන්න හොඳ local minima බොහෝ විට ප්‍රමාණවත්.',
        '[දැන්ම ඕනේ නෑ, පස්සේ බලමු] Lagrange multipliers කියන්නේ සීමාවක් (constraint) තියෙද්දී හොඳම අගය හොයන ක්‍රමයක්. උදා: "Budget එක Rs. 10,000ට සීමා වෙලා, ඒ ඇතුළේ හොඳම ප්‍රතිඵලය මොකක්ද?". SVM වගේ algorithms වල ගණිතය තේරුම් ගන්න පස්සේ ඕනේ වෙනවා.',
      ],
      analogy: 'MLE: කොත්තු කඩේකට ගිහින් 10 පාරකින් 7 පාරක්ම රසයි. "මේ කඩේ 70%ක් රසයි" කියලා හිතනවා. MAP: ඔයාගේ යාළුවෝ කලින්ම කිව්වා "ඔය කඩේ සාමාන්‍යයි" කියලා. ඒ prior එකත් එක්ක ඔයා 60% වගේ කියනවා. Convex: එක වළක් තියෙන බඳුනක බෝලයක් දැම්මාම අනිවාර්යයෙන්ම පහළටම යනවා. Non-convex: වළවල් ගොඩක් තියෙන කඳුකරයක, බෝලය පොඩි වළක හිරවෙන්න පුළුවන්.',
      example: 'Coin එක 10 පාරක්: heads 7. MLE: p = 7 / 10 = 0.7. MAP ("coin එක සාධාරණ වෙන්න ඉඩ වැඩියි" කියන Beta(5, 5) prior එකක් එක්ක): p = (7 + 5 - 1) / (10 + 10 - 2) = 11 / 18 ≈ 0.61. Prior එක estimate එක 0.5 දෙසට ඇද්දා. Data 1000ක් (heads 700) තිබුණොත් MAP ≈ 0.698, ඒ කියන්නේ data ගොඩක් තියෙද්දී prior එකේ බලපෑම අඩුයි.',
      code: {
        lang: 'python',
        src: `heads, n = 7, 10

mle = heads / n
print(mle)                       # 0.7

# MAP: Beta(5, 5) prior එකක් එක්ක ("coin එක සාධාරණයි" කියන විශ්වාසය)
a, b = 5, 5
map_est = (heads + a - 1) / (n + a + b - 2)
print(round(map_est, 3))         # 0.611 -> 0.5 දෙසට ඇදුණා`,
      },
      keyPoints: [
        'MLE = data එක දකින්න වැඩිම ඉඩ දෙන parameters තෝරනවා.',
        'MAP = MLE + prior විශ්වාසය. Regularization එකට සම්බන්ධයි.',
        'Convex = එක පහළම තැනයි, local minimum = global minimum.',
        'Neural networks non-convex. Local minima තියෙනවා, ඒත් ප්‍රායෝගිකව හොඳට වැඩ කරනවා.',
        'Lagrange multipliers = constraint එකක් එක්ක optimize කිරීම. දැන්ම ඕනේ නෑ, පස්සේ බලමු.',
      ],
      terms: [
        { en: 'MLE (Maximum Likelihood Estimation)', si: 'දැකපු data එකට වැඩිම likelihood එක දෙන parameter අගය තෝරන ක්‍රමය.' },
        { en: 'MAP (Maximum A Posteriori)', si: 'Likelihood එක prior එකෙනුත් ගුණ කරලා, posterior එක උපරිම කරන parameter අගය තෝරන ක්‍රමය.' },
        { en: 'Likelihood', si: 'යම් parameter අගයක් තිබුණොත් අපි දැකපු data එක ලැබෙන්න තියෙන ඉඩ.' },
        { en: 'Convex Function', si: 'බඳුනක හැඩය තියෙන function එකක්. ඕනෑම local minimum එකක් global minimum එකයි.' },
        { en: 'Non-convex Function', si: 'වළවල් සහ කඳු ගොඩක් තියෙන function එකක්. Neural network loss වගේ.' },
        { en: 'Local Minimum', si: 'අවට පහළම තැන, ඒත් මුළු එකේම පහළම තැන නොවෙන්න පුළුවන්.' },
        { en: 'Global Minimum', si: 'මුළු function එකේම පහළම අගය.' },
        { en: 'Lagrange Multipliers', si: 'Constraint එකක් යටතේ උපරිම / අවම අගය හොයන ගණිත ක්‍රමයක්.' },
      ],
    },
    {
      id: 'information-theory',
      title: 'Entropy, Cross-Entropy, KL Divergence, Mutual Information',
      body: [
        '[අත්‍යවශ්‍යයි] Entropy කියන්නේ අවිනිශ්චිතතාවය, නැත්නම් සාමාන්‍යයෙන් අපිට දැනෙන "පුදුමය" කොච්චරද කියන එක. සාධාරණ coin එකක් (50/50) උපරිම අවිනිශ්චිතයි: entropy = 1 bit. Coin එක හැමදාම head එනවා නම්, පුදුමයක් නෑ: entropy = 0. අවිනිශ්චිතතාවය වැඩි වෙන්න වෙන්න entropy වැඩියි.',
        '[අත්‍යවශ්‍යයි] Cross-entropy කියන්නේ classification models train කරන්න පාවිච්චි කරන ප්‍රධාන loss එක. ChatGPT train කරන්නෙත් මේකෙන්. සරලව: model එක හරි උත්තරයට දුන්න probability එක ලොකු නම් loss එක පොඩියි. හරි උත්තරයට පොඩි probability එකක් දුන්නොත් (විශ්වාසයෙන් වැරදුනොත්) loss එක ගොඩක් ලොකුයි. ගණිතයෙන්: loss = -log(හරි class එකට දුන්න probability එක).',
        '[ටිකක් දැනගත්තාම හොඳයි] KL divergence කියන්නේ distributions දෙකක් කොච්චර වෙනස්ද කියන මිනුමක්. ඇත්ත distribution එක P වෙද්දී, අපි Q කියලා හිතුවොත් අපිට වෙන "අමතර පාඩුව". ඒක හැමදාම 0 හෝ ධනයි, දෙක සමාන නම් විතරක් 0. ඒත් දිශාව වැදගත්: P ගෙන් Q ට KL, Q ගෙන් P ට KL එකට සමාන නෑ, ඒ නිසා ඒක ඇත්ත "දුරක්" නෙවෙයි. Cross-entropy = entropy + KL divergence. VAEs, RLHF, knowledge distillation වල KL නිතර එනවා.',
        '[දැන්ම ඕනේ නෑ, පස්සේ බලමු] Mutual information කියන්නේ එක variable එකක් දැනගත්තාම, අනිත් එක ගැන අවිනිශ්චිතතාවය කොච්චර අඩු වෙනවද කියන එක. Independent නම් mutual information = 0. Feature selection වලදී (target එක ගැන වැඩිපුරම කියන features තෝරන්න) පාවිච්චි වෙනවා.',
      ],
      analogy: 'Weather forecast: Colombo වල සැප්තැම්බර් මාසේ වහිනවද කියන එක ගැන ගොඩක් අවිනිශ්චිතයි (entropy වැඩියි). යාපනයේ ජූලි මාසේ දවල් රස්නෙද කියන එක ගැන අවිනිශ්චිතතාවය අඩුයි (entropy අඩුයි). Cross-entropy: ඔයා "අද වහින්නේ නෑ 99%" කියලා විශ්වාසයෙන් කිව්වා, ඒත් හොඳටම වැස්සා. ඔයාට ලොකු දඬුවමක් (loss) ලැබෙනවා.',
      example: 'පින්තූරයක් පූසෙක්ද බල්ලෙක්ද කියලා model එකක් කියනවා. ඇත්තටම පූසෙක්. Model A: පූසා 0.9 → loss = -ln(0.9) ≈ 0.105 (පොඩියි, හොඳයි). Model B: පූසා 0.1 → loss = -ln(0.1) ≈ 2.303 (ලොකුයි). Model B විශ්වාසයෙන් වැරදුනා, ඒ නිසා දඬුවම 20 ගුණයකට වඩා වැඩියි. Entropy: සාධාරණ coin = 1 bit, 90/10 coin ≈ 0.47 bits.',
      code: {
        lang: 'python',
        src: `import numpy as np

def entropy(p):  # bits වලින්
    p = np.array(p)
    return -np.sum(p * np.log2(p))

print(entropy([0.5, 0.5]))   # 1.0 bit (සාධාරණ coin)
print(entropy([0.9, 0.1]))   # ~0.47 bits

# cross-entropy loss: හරි class එකට දුන්න probability එක
print(-np.log(0.9))          # ~0.105 (හොඳයි)
print(-np.log(0.1))          # ~2.303 (විශ්වාසයෙන් වැරදුනා)

P, Q = np.array([0.5, 0.5]), np.array([0.9, 0.1])
print(np.sum(P * np.log(P / Q)))   # KL(P || Q) > 0`,
      },
      keyPoints: [
        'Entropy = අවිනිශ්චිතතාවය / සාමාන්‍ය පුදුමය.',
        'Cross-entropy = classification සහ LLM training වල ප්‍රධාන loss එක.',
        'විශ්වාසයෙන් වැරදුනොත් cross-entropy loss එක ගොඩක් ලොකුයි.',
        'KL divergence = distributions දෙකක වෙනස. හැමදාම 0 හෝ ධනයි, symmetric නෑ.',
        'Mutual information = එකක් දැනගත්තාම අනිත් එක ගැන අවිනිශ්චිතතාවය අඩු වෙන ප්‍රමාණය.',
      ],
      terms: [
        { en: 'Entropy', si: 'Distribution එකක අවිනිශ්චිතතාවය. සාමාන්‍ය "පුදුමය".' },
        { en: 'Cross-Entropy', si: 'ඇත්ත distribution එකට, model එකේ predicted distribution එක පාවිච්චි කළාම එන සාමාන්‍ය පුදුමය. Classification loss එක.' },
        { en: 'KL Divergence', si: 'Distributions දෙකක් කොච්චර වෙනස්ද කියන මිනුම. Symmetric නෑ.' },
        { en: 'Mutual Information', si: 'Variables දෙකක් එකිනෙක ගැන දෙන තොරතුරු ප්‍රමාණය. Independent නම් 0.' },
        { en: 'Bit', si: 'තොරතුරු වල ඒකකය. සාධාරණ coin flip එකක තොරතුරු ප්‍රමාණය.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Color පින්තූර 32ක batch එකක් (උස x පළල x colors 3) කොයි වර්ගයේ data structure එකක්ද?',
      options: ['Scalar එකක්', 'Vector එකක්', '4D tensor එකක්'],
      answer: 2,
      why: 'Batch, උස, පළල, colors කියලා dimensions 4ක් තියෙනවා. ඉතින් ඒක 4D tensor එකක්.',
    },
    {
      q: 'Quantities [2, 3] සහ prices [150, 120] වල dot product එක කීයද?',
      options: ['660', '270', '450'],
      answer: 0,
      why: '(2 x 150) + (3 x 120) = 300 + 360 = 660. ගුණ කරලා එකතු කරනවා.',
    },
    {
      q: 'Neural network එකක backpropagation වැඩ කරන්නේ මොන ගණිත අදහස මතද?',
      options: ['Bayes Theorem', 'Chain rule', 'Central Limit Theorem'],
      answer: 1,
      why: 'Backpropagation කියන්නේ chain rule එක loss එකේ ඉඳන් ආපස්සට, layer එකෙන් layer එකට යොදලා gradients හොයන එක.',
    },
    {
      q: 'Office එකක පඩි: 50k, 60k, 70k, 80k, 1000k. "සාමාන්‍ය සේවකයාගේ" පඩිය හොඳින්ම පෙන්නන්නේ මොකක්ද?',
      options: ['Mean (252k)', 'Median (70k)', 'Maximum (1000k)'],
      answer: 1,
      why: 'Boss ගේ පඩිය වගේ outlier එකක් mean එක ඉහළට අදිනවා. Median එකට ඒ බලපෑම එච්චර නෑ.',
    },
    {
      q: 'p-value = 0.02 කියන්නේ මොකක්ද?',
      options: [
        'Null hypothesis එක ඇත්ත වෙන්න 2%ක ඉඩක් තියෙනවා',
        'වෙනසක් නැත්නම්, මේ තරම් හෝ ඊට වඩා අන්ත ප්‍රතිඵලයක් අහඹුවට එන්න 2%ක ඉඩක් තියෙනවා',
        'අපේ model එක 98% නිවැරදියි',
      ],
      answer: 1,
      why: 'p-value එක ගණනය කරන්නේ null hypothesis එක ඇත්ත කියලා උපකල්පනය කරලා. ඒක null එක ඇත්ත වෙන්න තියෙන probability එක නෙවෙයි.',
    },
    {
      q: 'Ice cream විකුණුම් වැඩි වෙන කාලෙම ගිලෙන සිදුවීම් වැඩියි. මේකෙන් කියවෙන්නේ?',
      options: [
        'Ice cream නිසා මිනිස්සු ගිලෙනවා',
        'Correlation එකක් තියෙනවා, ඒත් causation ඔප්පු වෙන්නේ නෑ (රස්නෙ කාලය confounder එකක්)',
        'Variables දෙක independent',
      ],
      answer: 1,
      why: 'දෙකම රස්නෙ කාලයේදී වැඩි වෙනවා. Correlation කියන්නේ causation නෙවෙයි.',
    },
    {
      q: 'Model එක හරි class එකට probability 0.1ක් විතරක් දුන්නා. Cross-entropy loss එක?',
      options: ['ගොඩක් පොඩියි', 'ගොඩක් ලොකුයි', 'හරියටම 0'],
      answer: 1,
      why: 'Loss = -log(0.1) ≈ 2.3. හරි උත්තරයට පොඩි probability එකක් දුන්නොත් loss එක ලොකුයි.',
    },
    {
      q: 'රෝගයක් 1%කට තියෙනවා, test එක 90%ක් නිවැරදිව අල්ලනවා, නිරෝගී අයගෙන් 5%කට වැරදි positive. Positive ආවොත් රෝගය තියෙන්න ඉඩ ආසන්න වශයෙන්?',
      options: ['90%', '50%', '15%'],
      answer: 2,
      why: '10,000න්: ඇත්ත positive 90, වැරදි positive 495. 90 / 585 ≈ 15%. Prior එක පොඩි නිසා Bayes අනුව probability එක අඩුයි.',
    },
  ],
}
