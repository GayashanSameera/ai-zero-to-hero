export default {
  id: 'programming',
  number: 0,
  title: 'Programming Foundations',
  titleSi: 'Programming මූලික කරුණු: AI හදන්න ඕනේ කරන ආයුධ පෙට්ටිය',
  summary: 'AI ඉගෙන ගන්න කලින් computer එකට උපදෙස් දෙන්න දැනගන්න ඕනේ. මේ phase එකේදී Python, Git, Linux command line, SQL, data structures, algorithms සහ APIs ගැන ප්‍රායෝගිකව ඉගෙන ගන්නවා. මේවා තමයි හැම AI engineer කෙනෙක්ම දවස ගානේ පාවිච්චි කරන ආයුධ.',
  duration: 'සති 4-6',
  topics: [
    {
      id: 'python-basics',
      title: 'Python: Data Types සහ Control Flow',
      body: [
        'Python කියන්නේ AI ලෝකයේ ප්‍රධාන භාෂාව. PyTorch, TensorFlow, scikit-learn, Hugging Face ඔක්කොම Python. ඒකේ syntax එක ඉංග්‍රීසි වාක්‍ය වගේ කියවන්න පුළුවන් නිසා අලුතින් පටන් ගන්න අයට ලේසියි.',
        'Data types කියන්නේ data වර්ග. int = පූර්ණ සංඛ්‍යා (5), float = දශම සංඛ්‍යා (3.14), str = text ("Kandy"), bool = True / False. එකතු (collections): list = පිළිවෙළට තියෙන, වෙනස් කරන්න පුළුවන් ලිස්ට් එකක් [1, 2, 3]. tuple = වෙනස් කරන්න බැරි ලිස්ට් එකක් (1, 2). dict = key එකකින් value එකක් හොයන "dictionary" එකක් {"name": "Nimal"}. set = duplicate නැති එකතුවක් {1, 2, 3}.',
        'Control flow කියන්නේ code එක දුවන පිළිවෙළ පාලනය කරන එක. if / elif / else = තීරණ ගන්න. for loop = ලිස්ට් එකක හැම item එකක් හරහාම යන්න. while loop = condition එකක් ඇත්ත වෙනකම් නැවත නැවත කරන්න. Python වල code blocks වෙන් කරන්නේ indentation (spaces 4) වලින්, brackets වලින් නෙවෙයි. Indentation වැරදුනොත් error එනවා.',
      ],
      analogy: 'Data types කියන්නේ කුස්සියේ භාජන වගේ. බත් දාන්නේ බත් හැලියේ, හොදි දාන්නේ හොදි කෝප්පයේ. වැරදි භාජනයේ දැම්මොත් ප්‍රශ්න. Control flow කියන්නේ recipe එක: "ලූනු රතු වෙනකම් බදින්න (while), හැම එළවළුවක්ම කපන්න (for), සැර නම් මිරිස් අඩු කරන්න (if)".',
      example: 'A/L results පද්ධතියක්: marks 75ට වැඩි නම් "A", 65ට වැඩි නම් "B", 55ට වැඩි නම් "C", 40ට වැඩි නම් "S", නැත්නම් "F". ළමයි 3ක marks [82, 58, 35] තියෙනවා නම්, for loop එකකින් හැම එකක්ම අරගෙන if / elif වලින් grade එක දෙනවා: A, C, F.',
      code: {
        lang: 'python',
        src: `student = {"name": "Nimal", "marks": [82, 58, 35]}  # dict එකක්

for m in student["marks"]:        # හැම mark එකක් හරහාම යනවා
    if m >= 75:
        grade = "A"
    elif m >= 65:
        grade = "B"
    elif m >= 55:
        grade = "C"
    elif m >= 40:
        grade = "S"
    else:
        grade = "F"
    print(m, grade)               # 82 A, 58 C, 35 F`,
      },
      keyPoints: [
        'Python = AI වල ප්‍රධාන භාෂාව.',
        'මූලික types: int, float, str, bool. Collections: list, tuple, dict, set.',
        'if / elif / else = තීරණ, for / while = නැවත නැවත කිරීම.',
        'Python වල indentation එක syntax එකේම කොටසක්.',
      ],
      terms: [
        { en: 'Data Types', si: 'Data වර්ග: int, float, str, bool වගේ.' },
        { en: 'List', si: 'පිළිවෙළට තියෙන, වෙනස් කරන්න පුළුවන් items එකතුවක්.' },
        { en: 'Tuple', si: 'පිළිවෙළට තියෙන, වෙනස් කරන්න බැරි (immutable) items එකතුවක්.' },
        { en: 'Dictionary (dict)', si: 'Key එකකින් value එකක් ඉක්මනින් හොයන්න පුළුවන් එකතුවක්.' },
        { en: 'Set', si: 'Duplicate නැති, පිළිවෙළක් සහතික නොවන items එකතුවක්.' },
        { en: 'Control Flow', si: 'if, for, while වලින් code එක දුවන පිළිවෙළ පාලනය කිරීම.' },
      ],
    },
    {
      id: 'functions-oop',
      title: 'Functions සහ Object-Oriented Programming (OOP)',
      body: [
        'Function එකක් කියන්නේ නමක් දාපු, නැවත නැවත පාවිච්චි කරන්න පුළුවන් code කෑල්ලක්. Inputs (parameters) ගන්නවා, වැඩක් කරනවා, output එකක් return කරනවා. එකම code එක 10 පාරක් copy-paste කරනවා වෙනුවට function එකක් හදලා 10 පාරක් call කරනවා. Default values, keyword arguments වගේ දේවල් function එක පාවිච්චි කරන්න ලේසි කරනවා.',
        'OOP (Object-Oriented Programming) කියන්නේ data එකයි, ඒ data එක එක්ක වැඩ කරන functions (methods) එකයි එකට බැඳලා "objects" හදන ක්‍රමයක්. Class එකක් කියන්නේ සැලැස්මක් (blueprint). Object එකක් කියන්නේ ඒ සැලැස්මෙන් හදපු ඇත්ත දෙයක්. __init__ method එක object එක හදද්දී මුලින්ම දුවනවා. self කියන්නේ "මේ object එකම" කියන එක.',
        'Inheritance කියන්නේ තියෙන class එකක ගුණාංග අරගෙන අලුත් class එකක් හදන එක. PyTorch වල model එකක් හදද්දී ඔයා nn.Module class එකෙන් inherit කරනවා. ඉතින් OOP තේරුම් ගැනීම AI code කියවන්න අත්‍යවශ්‍යයි.',
      ],
      analogy: 'Class එක tuk-tuk factory එකේ design drawing එක වගේ. ඒ drawing එකෙන් tuk-tuks දහස් ගණනක් (objects) හදනවා. හැම එකටම තමන්ගේම number plate එකක්, color එකක් (attributes) තියෙනවා. හැම එකටම "start", "horn" (methods) කරන්න පුළුවන්. Electric tuk-tuk එකක් හදද්දී මුල ඉඳන් design කරන්නේ නෑ: පරණ design එක inherit කරලා engine එක විතරක් වෙනස් කරනවා.',
      example: 'Bank account class එකක්: owner = "Kamala", balance = 5,000. deposit(2000) කළාම balance = 7,000. withdraw(10000) කළොත් "ශේෂය මදි" කියලා error එකක් දෙනවා. Data (balance) සහ ඒක වෙනස් කරන නීති (methods) එකම තැනක තියෙන නිසා වැරදි වෙන්න ඉඩ අඩුයි.',
      code: {
        lang: 'python',
        src: `def add_tax(price, rate=0.18):     # default value එකක් තියෙන function
    return price * (1 + rate)

class Account:                      # class = සැලැස්ම
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):      # method එකක්
        self.balance += amount

class SavingsAccount(Account):      # inheritance
    def add_interest(self):
        self.balance *= 1.05

acc = SavingsAccount("Kamala", 5000)  # object එකක්
acc.deposit(2000)
print(acc.balance)                    # 7000`,
      },
      keyPoints: [
        'Function = නැවත පාවිච්චි කරන්න පුළුවන් නම් දාපු code කෑල්ල.',
        'Class = සැලැස්ම, Object = ඒකෙන් හදපු ඇත්ත දේ.',
        'Methods = class එක ඇතුළේ තියෙන functions. self = ඒ object එකම.',
        'Inheritance = තියෙන class එකක් මත අලුත් එකක් හදන එක. PyTorch models හදන්නේ මෙහෙම.',
      ],
      terms: [
        { en: 'Function', si: 'Inputs අරගෙන වැඩක් කරලා output එකක් return කරන, නැවත පාවිච්චි කරන code කෑල්ල.' },
        { en: 'OOP (Object-Oriented Programming)', si: 'Data සහ methods එකට බැඳපු objects වලින් program හදන ක්‍රමය.' },
        { en: 'Class', si: 'Objects හදන සැලැස්ම (blueprint).' },
        { en: 'Object', si: 'Class එකකින් හදපු එක් ඇත්ත instance එකක්.' },
        { en: 'Inheritance', si: 'පරණ class එකක ගුණාංග අලුත් class එකකට ලබා ගැනීම.' },
        { en: 'Method', si: 'Class එකකට අයිති function එකක්.' },
      ],
    },
    {
      id: 'pythonic-features',
      title: 'List Comprehensions, Generators, Decorators, Type Hints',
      body: [
        'List comprehension කියන්නේ loop එකක් ලියලා ලිස්ට් එකක් හදන එක එක පේළියකින් කරන ලස්සන ක්‍රමයක්. [x * 2 for x in nums if x > 0] කියවන්නේ "nums වල ධන හැම x එකක්ම දෙගුණ කරලා ලිස්ට් එකක් හදන්න" කියලා. Data cleaning වලදී නිතරම පාවිච්චි වෙනවා.',
        'Generator කියන්නේ හැම අගයක්ම එකපාර memory එකේ හදලා තියාගන්නේ නැතුව, ඉල්ලන ඉල්ලන වෙලාවට එකින් එක හදන function එකක්. return වෙනුවට yield පාවිච්චි කරනවා. GB ගණන් ලොකු dataset එකක පේළි එකින් එක කියවන්න මේක ගොඩක් වැදගත්: memory එක පිරෙන්නේ නෑ.',
        'Decorator කියන්නේ function එකක code එක වෙනස් නොකර, ඒකට අමතර හැසිරීමක් එකතු කරන ක්‍රමයක්. @ ලකුණෙන් ලියනවා. උදා: function එකක් දුවන්න ගත්ත කාලය මනින්න, log කරන්න. FastAPI වල @app.get("/"), PyTorch වල @torch.no_grad() වගේ ඔයාට නිතරම දකින්න ලැබෙනවා.',
        'Type hints කියන්නේ variable එකක හෝ function එකක input / output එක මොන type එකද කියලා ලියලා තියන එක: def area(r: float) -> float. Python එක run කරද්දී මේවා enforce කරන්නේ නෑ, ඒත් VS Code, mypy වගේ tools වලට වැරදි කලින්ම අල්ලන්න උදව් වෙනවා. Code එක කියවන කෙනාටත් පැහැදිලියි.',
      ],
      analogy: 'Generator එක කොත්තු කඩේ වගේ: order එක ආවාම විතරක් කොත්තු එක කොටලා දෙනවා. කොත්තු 1000ක් කලින්ම හදලා මේසේ ගොඩ ගහන්නේ නෑ (ඒක list එකක් වගේ). Decorator එක gift wrap එකක් වගේ: ඇතුළේ තියෙන තෑග්ග (function එක) වෙනස් වෙන්නේ නෑ, ඒත් පිටින් අමතර දෙයක් එකතු වෙනවා.',
      example: 'Prices ලිස්ට් එකක් [100, -5, 250, 0, 80] තියෙනවා. වැරදි (ධන නොවන) අගයන් අයින් කරලා 10% discount එක දාන්න: [p * 0.9 for p in prices if p > 0] = [90.0, 225.0, 72.0]. Loop එකකින් පේළි 4ක් ලියන එක පේළි 1කින් ඉවරයි.',
      code: {
        lang: 'python',
        src: `import time

prices = [100, -5, 250, 0, 80]
clean: list[float] = [p * 0.9 for p in prices if p > 0]  # comprehension + type hint

def read_rows(n: int):              # generator: එකින් එක දෙනවා
    for i in range(n):
        yield f"row {i}"

def timer(func):                    # decorator එකක්
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        print("ගත්ත කාලය:", time.time() - start)
        return result
    return wrapper

@timer
def total(xs: list[float]) -> float:
    return sum(xs)

print(total(clean))                 # 387.0`,
      },
      keyPoints: [
        'List comprehension = loop එකක් එක පේළියකින්.',
        'Generator (yield) = අගයන් අවශ්‍ය වෙලාවට එකින් එක හදනවා, memory ඉතුරු කරනවා.',
        'Decorator (@) = function එක වෙනස් නොකර අමතර හැසිරීමක් එකතු කරනවා.',
        'Type hints = types ලියලා තියනවා. Run කරද්දී enforce වෙන්නේ නෑ, ඒත් tools වලට උදව්.',
      ],
      terms: [
        { en: 'List Comprehension', si: 'ලිස්ට් එකක් එක පේළියකින් හදන Python syntax එක.' },
        { en: 'Generator', si: 'yield පාවිච්චි කරලා අගයන් එකින් එක, lazy විදිහට දෙන function එකක්.' },
        { en: 'Decorator', si: 'වෙන function එකක් අරගෙන, ඒකට හැසිරීමක් එකතු කරපු අලුත් function එකක් දෙන function එකක්.' },
        { en: 'Type Hints', si: 'Variables සහ functions වල බලාපොරොත්තු වෙන types ලියන ක්‍රමය. උදා: x: int.' },
      ],
    },
    {
      id: 'environments-packages',
      title: 'Virtual Environments, pip, conda, uv',
      body: [
        'Python projects වලට libraries (packages) ඕනේ: numpy, pandas, torch. Project A එකට torch 2.1 ඕනේ, Project B එකට torch 2.4 ඕනේ නම් මොකද කරන්නේ? දෙකම එකම තැනක install කළොත් එකිනෙක ගැටෙනවා. ඒකට විසඳුම virtual environment එක: හැම project එකකටම වෙනම, හුදකලා Python "කාමරයක්".',
        'pip කියන්නේ Python වල සාමාන්‍ය package installer එක. pip install pandas කියලා ගැහුවාම PyPI එකෙන් download කරලා install කරනවා. requirements.txt file එකක project එකට ඕනේ packages ලිස්ට් එක ලියලා තියනවා, එතකොට වෙන කෙනෙක්ට එකම environment එක ආයෙත් හදාගන්න පුළුවන්.',
        'conda කියන්නේ package manager එකකුයි environment manager එකකුයි දෙකම. Python නොවන දේවල් (උදා: C libraries, සමහර CUDA toolkit packages) install කරන්නත් පුළුවන් නිසා data science ලෝකයේ ජනප්‍රියයි. uv කියන්නේ Rust වලින් ලියපු, ගොඩක් වේගවත් අලුත් tool එකක්. pip සහ venv කරන වැඩ (සහ තවත් ගොඩක්) වේගයෙන් කරනවා. අලුත් project එකක් පටන් ගන්නවා නම් uv හොඳ තේරීමක්.',
      ],
      analogy: 'Virtual environment එක හැම project එකකටම වෙනම කුස්සියක් දෙනවා වගේ. එක කුස්සියක කිරිබත් හදනවා, අනිත් එකේ මාළු ව්‍යංජන. එකම කුස්සියේ කළොත් කිරිබත් එකට මාළු ගඳ යනවා. requirements.txt කියන්නේ කුස්සියට ඕනේ බඩු ලිස්ට් එක: ඒක දුන්නාම ඕනෙම කෙනෙක්ට එකම කුස්සිය හදාගන්න පුළුවන්.',
      example: 'ඔයා chatbot project එකක් පටන් ගන්නවා. Folder එක ඇතුළේ python -m venv .venv කියලා environment එකක් හදනවා, activate කරනවා, pip install openai fastapi කරනවා, pip freeze > requirements.txt කරලා ලිස්ට් එක save කරනවා. යාළුවා repo එක clone කරලා pip install -r requirements.txt ගැහුවාම එයාටත් හරියටම එකම packages ලැබෙනවා.',
      code: {
        lang: 'bash',
        src: `# venv + pip
python -m venv .venv            # environment එක හදනවා
source .venv/bin/activate       # activate (Windows: .venv\\Scripts\\activate)
pip install numpy pandas
pip freeze > requirements.txt   # packages ලිස්ට් එක save කරනවා

# conda
conda create -n ai python=3.11
conda activate ai

# uv (වේගවත්)
uv venv
uv pip install torch`,
      },
      keyPoints: [
        'Virtual environment = project එකකට වෙනම, හුදකලා Python එකක්.',
        'pip = සාමාන්‍ය package installer. requirements.txt = packages ලිස්ට් එක.',
        'conda = Python නොවන dependencies එක්කත් වැඩ කරන package + environment manager.',
        'uv = ගොඩක් වේගවත් අලුත් tool එක.',
      ],
      terms: [
        { en: 'Virtual Environment', si: 'Project එකකට වෙනම packages තියෙන හුදකලා Python environment එකක්.' },
        { en: 'pip', si: 'PyPI එකෙන් Python packages install කරන tool එක.' },
        { en: 'conda', si: 'Packages සහ environments දෙකම manage කරන tool එක. Python නොවන libraries වලටත් පුළුවන්.' },
        { en: 'uv', si: 'Rust වලින් ලියපු, ගොඩක් වේගවත් Python package සහ project manager එකක්.' },
        { en: 'requirements.txt', si: 'Project එකට ඕනේ packages සහ versions ලියපු file එක.' },
      ],
    },
    {
      id: 'dev-tools',
      title: 'Jupyter Notebooks සහ VS Code',
      body: [
        'Jupyter Notebook කියන්නේ code, output, graphs, notes එකම document එකක, cells වලට කඩලා ලියන්න පුළුවන් tool එකක්. Cell එකක් run කළාම result එක එතනම පේනවා. Data එක explore කරන්න, graphs අඳින්න, experiments කරන්න ගොඩක් හොඳයි. Google Colab කියන්නේ cloud එකේ, නොමිලේ GPU එකක් එක්ක දුවන Jupyter වගේ එකක්.',
        'පරිස්සම් වෙන්න ඕනේ දෙයක්: notebook එකේ cells ඕනෑම පිළිවෙළකට run කරන්න පුළුවන් නිසා, variables වල state එක අවුල් වෙන්න පුළුවන්. "Restart and Run All" කරලා උඩ ඉඳන් පහළටම වැඩ කරනවද කියලා බලන්න පුරුදු වෙන්න.',
        'VS Code කියන්නේ නොමිලේ ලැබෙන, ගොඩක් ජනප්‍රිය code editor එකක්. Python extension, Jupyter support, Git integration, debugger, terminal ඔක්කොම එක තැන. Notebook එකක experiment කරලා, හරි ගියාම ඒ code එක VS Code වල .py files වලට හරි project එකක් විදිහට ගෙනියන එක සාමාන්‍ය වැඩ පිළිවෙළ.',
      ],
      analogy: 'Jupyter කියන්නේ රසායන විද්‍යා lab එකේ practical book එක වගේ: පියවරක් කරනවා, ප්‍රතිඵලය ලියනවා, ඊළඟ පියවර. VS Code කියන්නේ සම්පූර්ණ කර්මාන්තශාලාව: ඇත්ත product එක හදන්නේ එතන.',
      example: 'ඔයාට Colombo ගෙවල් මිල CSV එකක් ලැබුණා. Jupyter එකේ cell 1: file එක load කරනවා. Cell 2: මුල් පේළි 5 බලනවා. Cell 3: මිල histogram එකක් අඳිනවා. Cell 4: missing values හොයනවා. හැම පියවරකම output එක එතනම පේන නිසා data එක ඉක්මනින් තේරුම් ගන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `# Jupyter cell එකක
import pandas as pd

df = pd.read_csv("houses.csv")   # data load කරනවා
df.head()                        # අන්තිම පේළිය output එක විදිහට පේනවා

# ඊළඟ cell එකේ
df["price"].hist()               # graph එක notebook එක ඇතුළේම`,
      },
      keyPoints: [
        'Jupyter = cells වලින් code + output + notes. Explore කරන්න හොඳයි.',
        'Google Colab = cloud එකේ නොමිලේ GPU එක්ක Jupyter.',
        'Notebook එකේ cell පිළිවෙළ අවුල් වෙන්න පුළුවන්. "Restart and Run All" කරලා බලන්න.',
        'VS Code = editor, debugger, terminal, Git ඔක්කොම එක තැන.',
      ],
      terms: [
        { en: 'Jupyter Notebook', si: 'Code, output, graphs, notes cells වලින් එකට තියෙන interactive document එකක්.' },
        { en: 'Google Colab', si: 'Browser එකෙන් පාවිච්චි කරන්න පුළුවන්, GPU එක්ක cloud Jupyter environment එකක්.' },
        { en: 'VS Code', si: 'Microsoft හදපු නොමිලේ, extensions ගොඩක් තියෙන code editor එක.' },
        { en: 'Debugger', si: 'Code එක පේළියෙන් පේළිය නවත්වලා variables බලන්න පුළුවන් tool එක.' },
      ],
    },
    {
      id: 'linux-cli',
      title: 'Linux Command Line',
      body: [
        'AI models train කරන servers, cloud GPUs ගොඩක්ම දුවන්නේ Linux මත. ඒවට mouse එකකින් click කරන්න window එකක් නෑ. Terminal එකේ commands ගහලා තමයි වැඩ කරන්නේ. ඉතින් command line එක AI engineer කෙනෙක්ට අත්‍යවශ්‍යයි.',
        'මූලික commands: pwd = මම දැන් ඉන්නේ කොයි folder එකේද. ls = folder එකේ තියෙන දේවල් පෙන්නන්න. cd = folder මාරු කරන්න. mkdir = අලුත් folder එකක්. cp / mv / rm = copy, move, delete. cat / head / tail = file එකක් කියවන්න. grep = file වල text හොයන්න. Pipe (|) එකෙන් එක command එකක output එක ඊළඟ එකට දෙන්න පුළුවන්.',
        'තවත් ප්‍රයෝජනවත් ඒවා: nvidia-smi = GPU එකේ තත්වය බලන්න. ssh = දුර තියෙන server එකකට log වෙන්න. chmod = file permissions වෙනස් කරන්න. rm -rf ගොඩක් පරිස්සමෙන් පාවිච්චි කරන්න: recycle bin එකක් නෑ, මැකුවොත් ඉවරයි.',
      ],
      analogy: 'Command line එක tuk-tuk driver කෙනෙක්ට පාර කියනවා වගේ. GUI එක (mouse) කියන්නේ map එකේ තැනක් පෙන්නන එක. Terminal එක කියන්නේ "Galle Road එකේ කෙළින්ම ගිහින්, දෙවෙනි හැරවුමෙන් වමට" කියලා නිවැරදිව කියන එක. මුලින් අමාරුයි, ඒත් පුරුදු වුණාම ගොඩක් වේගවත්.',
      example: 'ඔයාගේ training log file එකේ (පේළි 50,000) error තියෙන පේළි කීයක් තියෙනවද බලන්න ඕනේ. File එක open කරලා කියවන්නේ නැතුව: grep "ERROR" train.log | wc -l. Output එක 12 නම්, errors 12ක් තියෙනවා. තත්පරයකින් වැඩේ ඉවරයි.',
      code: {
        lang: 'bash',
        src: `pwd                      # දැන් ඉන්න තැන
ls -la                   # files ඔක්කොම විස්තර එක්ක
mkdir project && cd project
head -n 5 data.csv       # මුල් පේළි 5
grep "ERROR" train.log | wc -l   # error පේළි ගණන
nvidia-smi               # GPU එකේ memory, usage
ssh user@my-server       # remote server එකකට`,
      },
      keyPoints: [
        'AI servers සහ cloud GPUs ගොඩක් Linux, terminal එකෙන් වැඩ කරන්නේ.',
        'pwd, ls, cd, mkdir, cp, mv, rm, cat, head, grep මූලිකම commands.',
        'Pipe (|) = එක command එකක output එක ඊළඟ එකට.',
        'rm -rf එකේ undo එකක් නෑ. පරිස්සමෙන්.',
      ],
      terms: [
        { en: 'Linux Command Line (Terminal / Shell)', si: 'Text commands ගහලා computer එක පාලනය කරන interface එක.' },
        { en: 'Pipe (|)', si: 'එක command එකක output එක තව command එකක input එක කරන ලකුණ.' },
        { en: 'grep', si: 'Files ඇතුළේ text pattern එකක් හොයන command එක.' },
        { en: 'ssh', si: 'දුර තියෙන server එකකට ආරක්ෂිතව log වෙන command එක.' },
        { en: 'nvidia-smi', si: 'NVIDIA GPU එකේ memory, usage, processes පෙන්නන command එක.' },
      ],
    },
    {
      id: 'git-github',
      title: 'Git සහ GitHub',
      body: [
        'Git කියන්නේ version control system එකක්. ඔයාගේ code එකේ හැම වෙනසක්ම "snapshot" (commit) එකක් විදිහට save කරනවා. වැරැද්දක් වුණොත් පරණ version එකකට ආපහු යන්න පුළුවන්. "final_v2_REAL_final.py" වගේ files හදන්න ඕනේ නෑ.',
        'මූලික workflow එක: git add = save කරන්න ඕනේ වෙනස්කම් තෝරනවා (staging). git commit = snapshot එක message එකක් එක්ක save කරනවා. git push = GitHub (online) එකට යවනවා. git pull = අනිත් අයගේ වෙනස්කම් ගන්නවා. Branch එකක් කියන්නේ ප්‍රධාන code එකට බලපෑමක් නැතුව අලුත් feature එකක් ගැන වැඩ කරන වෙනම පාරක්. වැඩේ හරි ගියාම merge කරනවා.',
        'GitHub කියන්නේ Git repositories online තියාගන්න, අනිත් අය එක්ක එකට වැඩ කරන්න තියෙන website එක. Pull Request (PR) එකකින් "මගේ වෙනස්කම් ප්‍රධාන code එකට එකතු කරන්න" කියලා ඉල්ලනවා, අනිත් අය review කරනවා. Hugging Face, PyTorch වගේ AI projects ගොඩක් GitHub එකේ open source. ඔයාගේ AI projects GitHub එකේ දාන එක හොඳ portfolio එකක්.',
      ],
      analogy: 'Git එක video game එකක save points වගේ. Boss fight එකකට කලින් save කරනවා. මැරුණොත් ආයෙත් ඒ තැනින් පටන් ගන්නවා. Branch එකක් කියන්නේ "මේ පාර වෙන පාරකින් ගිහින් බලමු" කියලා අලුත් save slot එකක පටන් ගන්න එක. GitHub කියන්නේ ඒ save files cloud එකේ තියලා යාළුවෝ එක්ක share කරන එක.',
      example: 'ඔයා sentiment analysis project එකක් කරනවා. Model එක 85% accuracy එකකින් වැඩ කරනවා: commit කරනවා. අලුත් ක්‍රමයක් try කරන්න "experiment-bert" branch එකක් හදනවා. ඒකෙන් accuracy 70% වුණා. කිසි ප්‍රශ්නයක් නෑ: main branch එකට ආපහු මාරු වෙනවා, 85% code එක එහෙමම තියෙනවා.',
      code: {
        lang: 'bash',
        src: `git init                          # අලුත් repo එකක්
git add train.py                  # වෙනස්කම් stage කරනවා
git commit -m "Add training loop" # snapshot එක save
git switch -c experiment-bert     # අලුත් branch එකක්
git switch main                   # ආපහු main එකට
git log --oneline                 # commits ඉතිහාසය
git push origin main              # GitHub එකට යවනවා`,
      },
      keyPoints: [
        'Git = code එකේ හැම වෙනසක්ම track කරන version control system එක.',
        'add → commit → push කියන්නේ මූලික workflow එක.',
        'Branch = ප්‍රධාන code එකට බලපෑමක් නැතුව experiment කරන්න වෙනම පාරක්.',
        'GitHub = repos online තියාගන්න, Pull Requests වලින් එකට වැඩ කරන්න.',
      ],
      terms: [
        { en: 'Git', si: 'Code එකේ වෙනස්කම් ඉතිහාසය තියාගන්න distributed version control system එක.' },
        { en: 'GitHub', si: 'Git repositories online host කරන, collaboration වලට platform එක.' },
        { en: 'Commit', si: 'Code එකේ එක් අවස්ථාවක snapshot එකක්, message එකක් එක්ක.' },
        { en: 'Branch', si: 'වෙනම development පාරක්. පස්සේ merge කරන්න පුළුවන්.' },
        { en: 'Pull Request', si: 'Branch එකක වෙනස්කම් review කරලා ප්‍රධාන branch එකට එකතු කරන්න කරන ඉල්ලීම.' },
        { en: 'Merge', si: 'Branches දෙකක වෙනස්කම් එකට එකතු කිරීම.' },
      ],
    },
    {
      id: 'sql-basics',
      title: 'SQL: SELECT, JOIN, GROUP BY',
      body: [
        'ලෝකයේ company data ගොඩක් තියෙන්නේ databases වල tables විදිහට. SQL (Structured Query Language) කියන්නේ ඒ data එකෙන් ප්‍රශ්න අහන භාෂාව. AI model එකක් train කරන්න කලින් data එක ගන්න, පිරිසිදු කරන්න SQL නැතුවම බෑ.',
        'SELECT = මොන columns ඕනෙද. FROM = මොන table එකෙන්ද. WHERE = මොන rows ඕනෙද (filter). ORDER BY = පිළිවෙළට තියන්න. LIMIT = rows කීයක් ඕනෙද. JOIN = tables දෙකක් පොදු column එකකින් (උදා: customer_id) සම්බන්ධ කරන එක. INNER JOIN = දෙපැත්තෙම ගැලපෙන rows විතරයි. LEFT JOIN = වම් table එකේ හැම row එකක්ම, දකුණු පැත්තේ ගැලපීමක් නැත්නම් NULL.',
        'GROUP BY = rows කණ්ඩායම් වලට බෙදලා, හැම කණ්ඩායමකටම COUNT, SUM, AVG වගේ සාරාංශයක් ගණනය කරනවා. HAVING = groups හැදුවට පස්සේ filter කරනවා (WHERE වැඩ කරන්නේ grouping එකට කලින්).',
      ],
      analogy: 'Database එක ලොකු පුස්තකාලයක් වගේ. SQL query එක පුස්තකාලයාට දෙන ඉල්ලීම: "2020න් පස්සේ (WHERE) ප්‍රකාශිත, Sinhala novels වල (FROM) නම් සහ කතෘ (SELECT), කතෘ අනුව කණ්ඩායම් කරලා (GROUP BY) ගණන දෙන්න". JOIN කියන්නේ පොත් ලිස්ට් එකයි කතෘ ලිස්ට් එකයි එකට ගලපන එක.',
      example: 'orders table එකේ: (customer_id, amount). customers table එකේ: (id, name, city). "හැම නගරයකම මුළු විකුණුම්" ඕනේ නම්: customers සහ orders JOIN කරලා, city එකෙන් GROUP BY කරලා, SUM(amount) ගන්නවා. ප්‍රතිඵලය: Colombo Rs. 450,000, Kandy Rs. 210,000, Galle Rs. 95,000.',
      code: {
        lang: 'sql',
        src: `-- නගරය අනුව මුළු විකුණුම්
SELECT c.city,
       COUNT(*)      AS order_count,   -- orders ගණන
       SUM(o.amount) AS total_sales    -- මුළු මුදල
FROM orders o
JOIN customers c ON o.customer_id = c.id   -- tables දෙක ගලපනවා
WHERE o.amount > 0                          -- grouping එකට කලින් filter
GROUP BY c.city
HAVING SUM(o.amount) > 100000               -- grouping එකට පස්සේ filter
ORDER BY total_sales DESC;`,
      },
      keyPoints: [
        'SQL = database tables වලින් data ගන්න භාෂාව.',
        'SELECT columns, FROM table, WHERE row filter, ORDER BY පිළිවෙළ.',
        'JOIN = tables පොදු column එකකින් සම්බන්ධ කිරීම. INNER vs LEFT වෙනස මතක තියාගන්න.',
        'GROUP BY + COUNT / SUM / AVG = කණ්ඩායම් වලට සාරාංශ. HAVING = groups filter කිරීම.',
      ],
      terms: [
        { en: 'SQL', si: 'Relational databases වල data query කරන්න, වෙනස් කරන්න පාවිච්චි කරන භාෂාව.' },
        { en: 'SELECT', si: 'ඕනේ columns තෝරන්න.' },
        { en: 'WHERE', si: 'Conditions අනුව rows filter කරන්න.' },
        { en: 'JOIN', si: 'පොදු column එකක් හරහා tables දෙකක් එකට සම්බන්ධ කිරීම.' },
        { en: 'GROUP BY', si: 'එකම අගය තියෙන rows කණ්ඩායම් කරලා aggregate ගණනය කිරීම.' },
        { en: 'HAVING', si: 'GROUP BY එකෙන් පස්සේ groups filter කරන condition එක.' },
      ],
    },
    {
      id: 'sql-advanced',
      title: 'SQL: Subqueries, CTEs, Window Functions',
      body: [
        'Subquery කියන්නේ query එකක් ඇතුළේ තියෙන තව query එකක්. උදා: "සාමාන්‍ය order එකට වඩා ලොකු orders" ඕනේ නම්, මුලින් සාමාන්‍යය හොයන query එකක් වරහන් ඇතුළේ ලියලා, ඒක WHERE එකේ පාවිච්චි කරනවා.',
        'CTE (Common Table Expression) කියන්නේ WITH keyword එකෙන් පටන් ගන්න, නමක් දාපු තාවකාලික result එකක්. සංකීර්ණ query එකක් පියවරෙන් පියවර, කියවන්න ලේසි විදිහට ලියන්න පුළුවන්. Subqueries ගොඩක් එක ඇතුළේ එක දාලා අවුල් කරනවා වෙනුවට CTE පාවිච්චි කරන්න.',
        'Window functions කියන්නේ rows ගොඩක් එක row එකකට හකුළන්නේ නැතුව (GROUP BY වගේ නොවෙයි), හැම row එකකටම එයාගේ "අසල්වැසි" rows ගැන ගණනයක් එකතු කරන ක්‍රමය. OVER (PARTITION BY ... ORDER BY ...) කියලා ලියනවා. ROW_NUMBER(), RANK() = ශ්‍රේණිගත කිරීම. SUM() OVER = running total. LAG() = පෙර row එකේ අගය. "හැම නගරයකම top 3 customers", "මාසෙන් මාසෙට වර්ධනය" වගේ ප්‍රශ්න වලට මේවා ගොඩක් වැදගත්. Data science interviews වලත් නිතරම අහනවා.',
      ],
      analogy: 'GROUP BY එක පන්තියේ ළමයි හැමෝගෙම marks එකතු කරලා "පන්තියේ සාමාන්‍යය 62" කියලා එක අංකයක් දෙනවා වගේ. Window function එක හැම ළමයෙක්ගේම report card එකේ එයාගේ marks එකත් එක්කම "පන්තියේ ස්ථානය 5" කියලා ලියනවා වගේ: හැම ළමයෙක්ම (row) තවමත් ඉන්නවා, ඒත් අමතර තොරතුරක් එකතු වුණා.',
      example: 'sales table එකේ: (city, customer, amount). හැම නගරයකම වැඩිපුරම වියදම් කරපු customers 2 දෙනා ඕනේ. RANK() OVER (PARTITION BY city ORDER BY amount DESC) එකෙන් හැම නගරයක් ඇතුළෙම 1, 2, 3 ... ස්ථාන දෙනවා. ඊට පස්සේ CTE එකක් හරහා rank <= 2 rows විතරක් ගන්නවා.',
      code: {
        lang: 'sql',
        src: `-- CTE: හැම නගරයකම customer ස්ථානය
WITH ranked AS (
  SELECT city, customer, amount,
         RANK() OVER (PARTITION BY city ORDER BY amount DESC) AS rnk
  FROM sales
)
SELECT * FROM ranked WHERE rnk <= 2;   -- නගරයකට top 2

-- Subquery: සාමාන්‍යයට වඩා ලොකු orders
SELECT * FROM sales
WHERE amount > (SELECT AVG(amount) FROM sales);

-- Running total සහ පෙර මාසය (LAG)
SELECT month, revenue,
       SUM(revenue) OVER (ORDER BY month) AS running_total,
       LAG(revenue) OVER (ORDER BY month) AS prev_month
FROM monthly;`,
      },
      keyPoints: [
        'Subquery = query එකක් ඇතුළේ query එකක්.',
        'CTE (WITH) = නමක් දාපු තාවකාලික result එකක්. Query එක කියවන්න ලේසි කරනවා.',
        'Window functions = rows හකුළන්නේ නැතුව හැම row එකකටම ගණනයක් එකතු කරනවා.',
        'PARTITION BY = කණ්ඩායම් බෙදීම, ORDER BY (OVER ඇතුළේ) = ඒ ඇතුළේ පිළිවෙළ.',
      ],
      terms: [
        { en: 'Subquery', si: 'වෙන query එකක් ඇතුළේ ලියපු query එකක්.' },
        { en: 'CTE (Common Table Expression)', si: 'WITH එකෙන් හදන, query එක ඇතුළේ විතරක් පවතින නමක් දාපු result set එකක්.' },
        { en: 'Window Functions', si: 'OVER clause එක එක්ක, rows group නොකර අසල් rows ගැන ගණනය කරන functions.' },
        { en: 'PARTITION BY', si: 'Window function එකක් ගණනය කරන rows කණ්ඩායම් වලට බෙදන කොටස.' },
        { en: 'ROW_NUMBER / RANK', si: 'Partition එකක් ඇතුළේ rows වලට අංක / ස්ථාන දෙන window functions.' },
        { en: 'LAG', si: 'පෙර row එකේ අගය ගන්න window function එක.' },
      ],
    },
    {
      id: 'data-structures',
      title: 'Data Structures',
      body: [
        'Data structure එකක් කියන්නේ data memory එකේ සංවිධානය කරලා තියන ක්‍රමයක්. හරි structure එක තෝරගත්තොත් program එක ගොඩක් වේගවත් වෙනවා. වැරදි එක තෝරගත්තොත්, එකම වැඩේට තත්පර වෙනුවට පැය ගණන් යන්න පුළුවන්.',
        'Array / list = පිළිවෙළට පේළියට. Index එකෙන් (list[5]) ඉක්මනින් ගන්න පුළුවන්. ඒත් item එකක් තියෙනවද කියලා හොයන්න මුළු ලිස්ට් එකම බලන්න වෙනවා. Hash map (Python dict) = key එකෙන් සාමාන්‍යයෙන් ක්ෂණිකව value එක හොයනවා. Set = item එකක් තියෙනවද කියලා ඉක්මනින් බලන්න. Stack = අන්තිමට දාපු එක මුලින්ම එළියට (LIFO). Queue = මුලින්ම දාපු එක මුලින්ම එළියට (FIFO).',
        'Tree = මුල (root) එකක ඉඳන් අතු විහිදෙන hierarchy එකක් (folders, decision trees). Graph = nodes සහ ඒවා අතර සම්බන්ධතා (edges): Google Maps පාරවල්, Facebook යාළුවෝ, knowledge graphs. Heap = කුඩාම (හෝ ලොකුම) item එක ඉක්මනින් ගන්න පුළුවන් structure එකක්: priority queues වලට.',
      ],
      analogy: 'Stack = කෑම පිඟන් ගොඩ: අන්තිමට තිබ්බ පිඟාන තමයි මුලින්ම ගන්නේ. Queue = බැංකුවේ පෝලිම: මුලින්ම ආව කෙනාට මුලින්ම සේවය. Hash map = ගමේ ගෙවල් අංක: "අංක 42" කිව්වාම කෙළින්ම ඒ ගෙදරට යනවා, හැම ගෙදරකටම තට්ටු කරන්නේ නෑ. Graph = ලංකාවේ bus route සිතියම.',
      example: 'NIC numbers මිලියනයක් තියෙනවා. "200012345678 තියෙනවද?" කියලා බලන්න ඕනේ. List එකක නම් worst case එකේදී මිලියනයම බලන්න වෙනවා. Set එකක නම් සාමාන්‍යයෙන් එක පාරකින් වගේ hash එකෙන් කෙළින්ම යනවා. මේ වගේ පරීක්ෂා දහස් ගණනක් කරනවා නම් වෙනස ඉතා විශාලයි.',
      code: {
        lang: 'python',
        src: `from collections import deque

nics = set(["200012345678", "199587654321"])
print("200012345678" in nics)    # set: ඉක්මන් පරීක්ෂාව

stack = [1, 2, 3]
stack.append(4); print(stack.pop())   # 4 (LIFO)

queue = deque(["Amal", "Bimal"])
queue.append("Chamal"); print(queue.popleft())  # Amal (FIFO)

graph = {"Colombo": ["Kandy", "Galle"], "Kandy": ["Jaffna"]}  # graph එකක්
print(graph["Colombo"])`,
      },
      keyPoints: [
        'හරි data structure එක = වේගවත් program එක.',
        'List = index එකෙන් ඉක්මන්. dict / set = key එකෙන් හෝ "තියෙනවද" කියලා ඉක්මනින් හොයන්න.',
        'Stack = LIFO, Queue = FIFO.',
        'Tree = hierarchy, Graph = network එකක්, Heap = priority queue.',
      ],
      terms: [
        { en: 'Data Structures', si: 'Data memory එකේ සංවිධානය කරන ක්‍රම: array, hash map, tree, graph වගේ.' },
        { en: 'Array / List', si: 'Index එකකින් access කරන පිළිවෙළට තියෙන items.' },
        { en: 'Hash Map', si: 'Hash function එකක් පාවිච්චි කරලා key එකකින් සාමාන්‍යයෙන් O(1) කාලයේ value හොයන structure එක.' },
        { en: 'Stack', si: 'අන්තිමට දාපු එක මුලින්ම ගන්න (LIFO) structure එක.' },
        { en: 'Queue', si: 'මුලින්ම දාපු එක මුලින්ම ගන්න (FIFO) structure එක.' },
        { en: 'Tree', si: 'Root එකක ඉඳන් අතු විහිදෙන, cycles නැති hierarchy structure එක.' },
        { en: 'Graph', si: 'Nodes සහ edges වලින් හැදුණු network එකක්.' },
        { en: 'Heap', si: 'කුඩාම / ලොකුම item එක ඉක්මනින් දෙන tree-based structure එක.' },
      ],
    },
    {
      id: 'algorithms-big-o',
      title: 'Algorithms සහ Big-O Notation',
      body: [
        'Algorithm එකක් කියන්නේ ප්‍රශ්නයක් විසඳන්න පියවරෙන් පියවර උපදෙස් ලිස්ට් එකක්. Sorting (පිළිවෙළට තැබීම), searching (හෙවීම), recursion (තමන්වම call කරන function), dynamic programming වගේ ඒවා මූලික ඒවා. Binary search එක හොඳ උදාහරණයක්: sort කරපු ලිස්ට් එකක මැද බලලා, ඕනේ අගය වම් පැත්තේද දකුණු පැත්තේද කියලා තීරණය කරලා, හැම පියවරකදීම භාගයක් අයින් කරනවා.',
        'Big-O notation කියන්නේ input එක ලොකු වෙද්දී algorithm එකට යන කාලය (හෝ memory) කොහොමද වැඩි වෙන්නේ කියලා කියන ක්‍රමය. නිශ්චිත තත්පර ගණන නෙවෙයි, වර්ධන හැඩය. O(1) = input එක කොච්චර ලොකු වුණත් එකම කාලය. O(log n) = ගොඩක් හෙමින් වැඩි වෙනවා (binary search). O(n) = input එකට සමානුපාතිකව. O(n log n) = හොඳ sorting algorithms. O(n²) = input එක දෙගුණ වුණාම කාලය 4 ගුණයි (loop ඇතුළේ loop).',
        'AI වලදී මේක ඇයි වැදගත්? Transformer එකක attention එක sequence length එකට O(n²). ඒ කියන්නේ context එක දෙගුණ කළාම attention ගණනය 4 ගුණයක් වෙනවා. ලොකු context windows හදන එක අමාරු වෙන්න එක හේතුවක් ඒක. Big-O තේරුම් ගත්තාම මේ වගේ trade-offs තේරෙනවා.',
      ],
      analogy: 'ටෙලිෆෝන් නාමාවලියක (අකාරාදී පිළිවෙළට) "Perera" හොයන්න. මුල් පිටුවේ ඉඳන් එකින් එක බලනවා නම් O(n). මැදින් අරින්න, "P" ඊට පස්සේද කලින්ද බලලා භාගයක් අයින් කරන්න, නැවත නැවත: ඒ binary search, O(log n). පිටු 1000ක පොතක පියවර 10ක් විතර ඇති.',
      example: 'Items මිලියනයක් (n = 1,000,000). O(n) algorithm එක පියවර මිලියනයක් විතර. O(log n) binary search එක පියවර 20ක් විතර (2 ට 20 බලය ≈ මිලියනයක්). O(n²) algorithm එක පියවර ට්‍රිලියනයක් (1,000,000,000,000): සාමාන්‍ය computer එකක පැය ගණන් හෝ ඊට වැඩි. Algorithm තේරීම hardware එකට වඩා වැදගත් වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `def binary_search(arr, target):   # O(log n), arr sort කරලා තියෙන්න ඕනේ
    lo, hi = 0, len(arr) - 1
    while lo <= hi:
        mid = (lo + hi) // 2          # මැද බලනවා
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            lo = mid + 1              # වම් භාගය අයින්
        else:
            hi = mid - 1              # දකුණු භාගය අයින්
    return -1

nums = list(range(0, 1_000_000, 2))
print(binary_search(nums, 777776))    # 388888`,
      },
      keyPoints: [
        'Algorithm = ප්‍රශ්නයක් විසඳන පියවර ලිස්ට් එක.',
        'Big-O = input එක ලොකු වෙද්දී කාලය / memory වැඩි වෙන හැඩය.',
        'O(1) < O(log n) < O(n) < O(n log n) < O(n²): වමේ ඒවා වේගවත්.',
        'Transformer attention O(n²) නිසා ලොකු context windows මිල අධිකයි.',
      ],
      terms: [
        { en: 'Algorithm', si: 'ප්‍රශ්නයක් විසඳන නිශ්චිත පියවර මාලාවක්.' },
        { en: 'Big-O Notation', si: 'Input size එක වැඩි වෙද්දී algorithm එකක කාලය හෝ memory වැඩි වෙන හැඩය (සාමාන්‍යයෙන් worst case).' },
        { en: 'Binary Search', si: 'Sort කරපු data වල හැම පියවරකම භාගයක් අයින් කරලා O(log n) කාලයේ හොයන ක්‍රමය.' },
        { en: 'Sorting', si: 'Items පිළිවෙළකට තැබීම. හොඳ algorithms O(n log n).' },
        { en: 'Recursion', si: 'Function එකක් කුඩා ප්‍රශ්නයක් සඳහා තමන්වම call කිරීම.' },
        { en: 'Time Complexity / Space Complexity', si: 'Algorithm එකකට ඕනේ කාලය / memory input size එකත් එක්ක වැඩි වෙන ආකාරය.' },
      ],
    },
    {
      id: 'apis-json-rest',
      title: 'APIs, JSON, REST',
      body: [
        'API (Application Programming Interface) කියන්නේ programs දෙකකට එකිනෙක එක්ක කතා කරන්න තියෙන එකඟ වුණු ක්‍රමය. ඔයාගේ app එකෙන් OpenAI හෝ Anthropic API එකට ප්‍රශ්නයක් යවනවා, ඒකෙන් පිළිතුර එවනවා. ඔයාට model එක ඇතුළේ වෙන දේ දැනගන්න ඕනේ නෑ: හරි format එකෙන් ඉල්ලන්න දැනගත්තාම ඇති.',
        'JSON (JavaScript Object Notation) කියන්නේ APIs data යවන්න ගොඩක්ම පාවිච්චි කරන text format එක. Python dict එකකට ගොඩක් සමානයි: {"name": "Nimal", "age": 25, "skills": ["Python", "SQL"]}. Keys හැමදාම double quotes ඇතුළේ. Python වල json module එකෙන් dict ↔ JSON string මාරු කරනවා.',
        'REST කියන්නේ web APIs හදන ජනප්‍රිය style එකක්. හැම දෙයක්ම resource එකක් (URL එකක්) ලෙස සලකනවා: /users/42. HTTP methods වලින් මොකද කරන්නේ කියලා කියනවා: GET = data ගන්න, POST = අලුත් දෙයක් හදන්න / යවන්න, PUT / PATCH = update කරන්න, DELETE = මකන්න. Status codes වලින් ප්‍රතිඵලය කියනවා: 200 = OK, 201 = හැදුවා, 400 = ඔයාගේ request එක වැරදියි, 401 = log වෙලා නෑ / API key වැරදියි, 404 = හම්බවුණේ නෑ, 429 = requests වැඩියි (rate limit), 500 = server එකේ වැරැද්දක්.',
      ],
      analogy: 'API එක restaurant එකක waiter වගේ. ඔයා (client) කුස්සියට (server) කෙළින්ම යන්නේ නෑ. Menu එක (API documentation) බලලා waiter ට order එක දෙනවා (request). Waiter කෑම ගෙනත් දෙනවා (response). JSON කියන්නේ order slip එක ලියන නියමිත format එක. "Kottu 1, Cheese, සැර අඩුයි" වගේ.',
      example: 'Weather API එකකට GET request එකක් යවනවා: https://api.example.com/weather?city=Kandy. Response එක status 200 එක්ක JSON: {"city": "Kandy", "temp": 24, "rain": true}. ඔයාගේ Python code එක ඒක dict එකක් කරලා data["temp"] = 24 ගන්නවා. API key එක වැරදි නම් 401 එනවා.',
      code: {
        lang: 'python',
        src: `import json
import requests

# GET: data ගන්නවා
r = requests.get("https://api.example.com/weather", params={"city": "Kandy"})
print(r.status_code)          # 200 නම් හරි
data = r.json()               # JSON -> Python dict

# POST: data යවනවා
r = requests.post("https://api.example.com/notes",
                  json={"title": "AI notes", "tags": ["ml"]})

text = json.dumps({"name": "Nimal"})   # dict -> JSON string
print(json.loads(text)["name"])        # JSON string -> dict`,
      },
      keyPoints: [
        'API = programs දෙකක් එකිනෙක එක්ක කතා කරන නියමිත ක්‍රමය.',
        'JSON = APIs වල ප්‍රධාන data format එක. Python dict එකට සමානයි.',
        'REST: GET ගන්න, POST යවන්න / හදන්න, PUT / PATCH update, DELETE මකන්න.',
        'Status codes: 2xx හරි, 4xx ඔයාගේ පැත්තේ වැරැද්ද, 5xx server එකේ වැරැද්ද.',
        'LLM APIs (OpenAI, Anthropic) පාවිච්චි කරන්නෙත් මේ විදිහටම.',
      ],
      terms: [
        { en: 'API', si: 'Software කොටස් දෙකක් අතර සන්නිවේදනයට නිර්වචනය කරපු interface එක.' },
        { en: 'JSON', si: 'Key-value pairs සහ lists වලින් data ලියන, මිනිස්සුන්ටත් කියවන්න පුළුවන් text format එක.' },
        { en: 'REST', si: 'URLs (resources) සහ HTTP methods පාවිච්චි කරලා web APIs හදන architectural style එක.' },
        { en: 'HTTP Methods', si: 'GET, POST, PUT, PATCH, DELETE: request එකෙන් කරන්න ඕනේ ක්‍රියාව.' },
        { en: 'Status Code', si: 'Request එකේ ප්‍රතිඵලය කියන අංකය. 200 OK, 404 Not Found, 500 Server Error.' },
        { en: 'API Key', si: 'API එක පාවිච්චි කරන්න ඔයාව හඳුනාගන්න රහස් key එක. කවදාවත් GitHub එකට push කරන්න එපා.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Python වල වෙනස් කරන්න බැරි (immutable) ලිස්ට් එකක් වගේ collection එක මොකක්ද?',
      options: ['list', 'tuple', 'dict'],
      answer: 1,
      why: 'Tuple එකක් හැදුවට පස්සේ items වෙනස් කරන්න බෑ. List එක වෙනස් කරන්න පුළුවන්.',
    },
    {
      q: 'GB 50ක log file එකක පේළි එකින් එක process කරන්න memory එක පිරෙන්නේ නැතුව හොඳම ක්‍රමය?',
      options: ['මුළු file එකම list එකකට කියවන එක', 'Generator (yield) එකක් පාවිච්චි කරන එක', 'Decorator එකක් පාවිච්චි කරන එක'],
      answer: 1,
      why: 'Generator එක අගයන් එකින් එක, අවශ්‍ය වෙලාවට විතරක් හදන නිසා මුළු data එකම memory එකේ තියාගන්න ඕනේ නෑ.',
    },
    {
      q: 'Project දෙකකට එකම library එකේ වෙනස් versions ඕනේ නම් මොකද කරන්න ඕනේ?',
      options: ['Computer දෙකක් ගන්න', 'හැම project එකකටම වෙනම virtual environment එකක් හදන්න', 'Library එක uninstall කරලා ආයෙත් install කරන්න'],
      answer: 1,
      why: 'Virtual environment එක හැම project එකකටම වෙනම, හුදකලා packages ලබා දෙනවා.',
    },
    {
      q: 'Main code එකට බලපෑමක් නැතුව අලුත් idea එකක් try කරන්න Git වල හොඳම ක්‍රමය?',
      options: ['අලුත් branch එකක් හදන එක', 'Folder එක copy කරන එක', 'git push --force කරන එක'],
      answer: 0,
      why: 'Branch එකක් වෙනම development පාරක්. වැඩ කළොත් merge කරනවා, නැත්නම් අයින් කරනවා.',
    },
    {
      q: 'SQL වල GROUP BY එකෙන් පස්සේ groups filter කරන්න පාවිච්චි කරන්නේ?',
      options: ['WHERE', 'HAVING', 'ORDER BY'],
      answer: 1,
      why: 'WHERE වැඩ කරන්නේ grouping එකට කලින්, rows මත. HAVING වැඩ කරන්නේ groups හැදුවට පස්සේ.',
    },
    {
      q: '"හැම නගරයකම top 3 customers" rows හකුළන්නේ නැතුව හොයන්න හොඳම SQL ක්‍රමය?',
      options: ['RANK() OVER (PARTITION BY city ...) වගේ window function එකක්', 'SELECT DISTINCT', 'DELETE'],
      answer: 0,
      why: 'Window functions හැම row එකම තියාගෙන, partition එකක් ඇතුළේ ස්ථානය ගණනය කරනවා.',
    },
    {
      q: 'Input එක දෙගුණ කළාම O(n²) algorithm එකක කාලය ආසන්න වශයෙන් කී ගුණයක් වැඩි වෙනවද?',
      options: ['2 ගුණයක්', '4 ගුණයක්', 'වෙනසක් නෑ'],
      answer: 1,
      why: '(2n)² = 4n². ඒ නිසා කාලය ආසන්න වශයෙන් 4 ගුණයක් වෙනවා.',
    },
    {
      q: 'API එකකින් 401 status code එක ආවොත් වැඩිපුරම ඉඩ තියෙන හේතුව?',
      options: ['Server එක crash වුණා', 'API key එක වැරදියි හෝ නෑ (authentication ප්‍රශ්නයක්)', 'හැම දෙයක්ම හරි'],
      answer: 1,
      why: '401 Unauthorized කියන්නේ authentication ප්‍රශ්නයක්. 500 තමයි server error එක, 200 තමයි OK.',
    },
  ],
}
