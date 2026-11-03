export default {
  id: 'data-science',
  number: 1,
  title: 'Data Science',
  titleSi: 'Data Science: data වලින් කතාවක් හොයාගන්න',
  summary: 'AI model එකක් හොඳ වෙන්නේ ඒකට දෙන data හොඳ නම් විතරයි. මේ phase එකේදී ඔයා data එකතු කරන්න, පිරිසිදු කරන්න, තේරුම් ගන්න, චිත්‍ර වලින් පෙන්නන්න ඉගෙන ගන්නවා. Machine Learning පටන් ගන්න කලින් ඕනෙම කෙනෙක්ට තියෙන්න ඕනේ මූලික හැකියාව මේකයි.',
  duration: 'සති 4-6',
  topics: [
    {
      id: 'numpy-pandas-polars',
      title: 'NumPy, Pandas සහ Polars',
      body: [
        'Python වල data එක්ක වැඩ කරන්න ප්‍රධාන tools තුනක් තියෙනවා. NumPy කියන්නේ අංක ගොඩක් එකපාර ගණනය කරන්න හදපු library එකක්. ඒකේ මූලික දේ array එක. Array එකක් කියන්නේ එකම වර්ගයේ අංක පේළියක් හරි වගුවක් හරි.',
        'Pandas කියන්නේ Excel sheet එකක් වගේ data එක්ක වැඩ කරන්න පුළුවන් library එක. Pandas වල වගුවකට කියන්නේ DataFrame කියලා. එක column එකකට කියන්නේ Series කියලා. Rows filter කරන්න, group කරන්න, එකතු කරන්න, files කියවන්න වගේ හැමදේම Pandas වලින් ලේසියෙන් කරන්න පුළුවන්.',
        'Polars කියන්නේ Pandas වගේම වැඩ කරන අලුත් library එකක්. ඒක Rust කියන language එකෙන් ලියලා තියෙන්නේ. CPU cores කිහිපයක් එකවර පාවිච්චි කරන නිසා ලොකු data වලදී ගොඩක් වෙලාවට Pandas වලට වඩා වේගවත්. Lazy mode එකේදී query එක මුලින්ම optimize කරලා පස්සේ run කරනවා.',
        'ඇයි loop එකක් ලියන්නේ නැත්තේ? NumPy සහ Pandas වල operations ඇතුළෙන් C වගේ වේගවත් code වලින් run වෙනවා. මේකට කියන්නේ vectorization කියලා. ලක්ෂ ගණනක rows වලට Python loop එකකට වඩා ගොඩක් ඉක්මනින් වැඩේ ඉවර වෙනවා.',
      ],
      analogy: 'NumPy කියන්නේ calculator එකක් වගේ. අංක ගණනය කරන්න විතරයි. Pandas කියන්නේ කඩේ මුදලාලිගේ ගිණුම් පොත වගේ. නම්, දින, මිල, ප්‍රමාණ එක වගුවක තියෙනවා. Polars කියන්නේ ඒ ගිණුම් පොතම, ඒත් කැෂියර්ලා හතර දෙනෙක් එකවර වැඩ කරනවා වගේ.',
      example: 'Keells එකක දවසේ බිල්පත් 50,000ක් තියෙනවා කියමු. "Category එක අනුව මුළු විකුණුම කීයද?" කියලා දැනගන්න Pandas වල එක පේළියක් ඇති: df.groupby("category")["amount"].sum(). ප්‍රතිඵලය වගේ: එළවළු Rs. 1,250,000, කිරි නිෂ්පාදන Rs. 830,000, බිස්කට් Rs. 410,000.',
      code: {
        lang: 'python',
        src: `import numpy as np
import pandas as pd

# NumPy array එකක් - හැම අංකයක්ම එකපාර 2න් වැඩි කරනවා
prices = np.array([100, 250, 400])
print(prices * 2)  # [200 500 800]

# Pandas DataFrame එකක් හදනවා
df = pd.DataFrame({
    "item": ["kottu", "rice", "kottu"],
    "price": [800, 450, 900],
})
# item එක අනුව සාමාන්‍ය මිල
print(df.groupby("item")["price"].mean())`,
      },
      keyPoints: [
        'NumPy = වේගවත් අංක ගණනය (arrays).',
        'Pandas = වගු (DataFrame) එක්ක වැඩ කරන ප්‍රධාන tool එක.',
        'Polars = ලොකු data වලට වේගවත් විකල්පයක්.',
        'Loop වෙනුවට vectorized operations පාවිච්චි කරන්න.',
      ],
      terms: [
        { en: 'NumPy', si: 'Python වල අංක arrays එක්ක වේගයෙන් ගණනය කරන library එක.' },
        { en: 'Pandas', si: 'DataFrame කියන වගු එක්ක data කියවන්න, හසුරුවන්න පාවිච්චි කරන library එක.' },
        { en: 'Polars', si: 'Rust වලින් හදපු, multi-core පාවිච්චි කරන වේගවත් DataFrame library එක.' },
        { en: 'DataFrame', si: 'Rows සහ columns තියෙන වගුවක්. Excel sheet එකක් වගේ.' },
        { en: 'Vectorization', si: 'Loop නැතුව මුළු array එකටම එකපාර operation එකක් කරන එක.' },
      ],
    },
    {
      id: 'viz-libraries',
      title: 'Matplotlib, Seaborn සහ Plotly',
      body: [
        'අංක වගුවක් බලලා pattern එකක් අල්ලගන්න අමාරුයි. Chart එකක් බැලුවොත් තත්පරෙන් පේනවා. Python වල chart අඳින්න ප්‍රධාන libraries තුනක් තියෙනවා.',
        'Matplotlib තමයි පරණම සහ මූලිකම library එක. Line chart, bar chart, scatter plot, histogram වගේ ඕනෙම දෙයක් අඳින්න පුළුවන්. හැම පොඩි දෙයක්ම control කරන්න පුළුවන්, ඒත් code ටිකක් වැඩියි.',
        'Seaborn හදලා තියෙන්නේ Matplotlib උඩ. Pandas DataFrame එකක් කෙලින්ම දීලා ලස්සන statistical charts එක පේළියකින් අඳින්න පුළුවන්. Heatmap, box plot, pair plot වගේ ඒවට ගොඩක් පහසුයි.',
        'Plotly වලින් හදන්නේ interactive charts. Mouse එක තියපුවාම අගය පේනවා, zoom කරන්න පුළුවන්. Web page එකක හරි dashboard එකක හරි දාන්න හොඳයි.',
      ],
      analogy: 'Matplotlib කියන්නේ පැන්සලක් සහ කොළයක් වගේ. ඕනෙම දෙයක් අඳින්න පුළුවන්, ඒත් හැම ඉරක්ම ඔයාම අඳින්න ඕනේ. Seaborn කියන්නේ ලස්සන template පොතක් වගේ. Plotly කියන්නේ phone එකේ Google Maps වගේ, ඇඟිල්ලෙන් zoom කරලා විස්තර බලන්න පුළුවන්.',
      example: 'මාස 12ක විකුණුම් තියෙනවා කියමු. Matplotlib line chart එකකින් බැලුවාම දෙසැම්බර් සහ අප්‍රේල් (අලුත් අවුරුද්ද) වල ලොකු උඩ යාමක් පේනවා. වගුවේ අංක 12 බලලා ඒක එච්චර ඉක්මනට තේරෙන්නේ නෑ.',
      code: {
        lang: 'python',
        src: `import matplotlib.pyplot as plt
import seaborn as sns
import plotly.express as px

tips = sns.load_dataset("tips")  # උදාහරණ dataset එකක්

# Matplotlib - සරල histogram එකක්
plt.hist(tips["total_bill"], bins=20)
plt.show()

# Seaborn - දවස අනුව bill එකේ box plot එක
sns.boxplot(data=tips, x="day", y="total_bill")

# Plotly - mouse එකෙන් බලන්න පුළුවන් scatter plot
px.scatter(tips, x="total_bill", y="tip").show()`,
      },
      keyPoints: [
        'Matplotlib = මූලික, සම්පූර්ණ control.',
        'Seaborn = statistical charts ලේසියෙන්.',
        'Plotly = interactive, web වලට හොඳයි.',
        'ප්‍රශ්නයට ගැළපෙන chart එක තෝරන්න.',
      ],
      terms: [
        { en: 'Matplotlib', si: 'Python වල මූලිකම plotting library එක.' },
        { en: 'Seaborn', si: 'Matplotlib උඩ හදපු, statistical charts ලේසියෙන් අඳින library එක.' },
        { en: 'Plotly', si: 'Zoom, hover කරන්න පුළුවන් interactive charts හදන library එක.' },
        { en: 'Histogram', si: 'අගයන් පරාස (bins) වලට බෙදලා එක එක පරාසයේ කීයක් තියෙනවද පෙන්නන chart එක.' },
        { en: 'Scatter Plot', si: 'Variables දෙකක් තිත් වලින් පෙන්නන chart එක. සම්බන්ධයක් තියෙනවද බලන්න හොඳයි.' },
      ],
    },
    {
      id: 'data-collection',
      title: 'Data Collection',
      body: [
        'Data science වැඩේ පටන් ගන්නේ data එකතු කරගැනීමෙන්. Data එන්න පුළුවන් තැන් ගොඩක් තියෙනවා. ලේසිම එක CSV හරි Excel file එකක්. Pandas වලින් pd.read_csv() හරි pd.read_excel() හරි පාවිච්චි කරලා කෙලින්ම කියවන්න පුළුවන්.',
        'API එකක් කියන්නේ වෙනත් system එකකින් data ඉල්ලන්න හදපු නිල දොරටුවක්. උදාහරණයක් විදිහට weather API එකකට request එකක් යැව්වාම කොළඹ අද උෂ්ණත්වය JSON format එකෙන් එවනවා. Python වල requests library එක මේකට පාවිච්චි කරනවා.',
        'Web scraping කියන්නේ website එකක HTML එකෙන් data උකහගන්න එක. BeautifulSoup පොඩි වැඩ වලට හොඳයි, HTML parse කරලා ඕනේ කොටස හොයාගන්න. Scrapy කියන්නේ pages දහස් ගණනක් crawl කරන්න හදපු සම්පූර්ණ framework එකක්. Scrape කරන්න කලින් site එකේ terms of service සහ robots.txt බලන්න ඕනේ.',
        'සමාගම් වල ගොඩක් data තියෙන්නේ databases වල. MySQL, PostgreSQL වගේ SQL databases වලින් SQL query එකක් ලියලා data ගන්නවා. Pandas වල pd.read_sql() වලින් query result එක කෙලින්ම DataFrame එකකට ගන්න පුළුවන්.',
      ],
      analogy: 'කෑම උයන්න බඩු ගන්නවා වගේ. CSV file එක කියන්නේ ගෙදර තියෙන අල්මාරියේ බඩු. API එක කියන්නේ කඩේට phone කරලා order කරනවා වගේ, එයාලා හරි format එකෙන් එවනවා. Web scraping කියන්නේ පොළට ගිහින් ඔයාම තෝරගන්නවා වගේ. Database එක කියන්නේ ලොකු ගබඩාවක්, ඇතුළට යන්න අවසර (password) ඕනේ.',
      example: 'ikman.lk වගේ site එකක vehicle ads 2,000ක මිල, අවුරුද්ද, mileage එකතු කරන්න BeautifulSoup script එකක් ලියනවා කියමු. එක page එකක ads 25ක් තියෙනවා නම් pages 80ක් කියවන්න ඕනේ. ඒ data CSV එකකට save කරලා පස්සේ Pandas වලින් analyse කරනවා. (ඇත්ත site එකක මෙහෙම කරන්න කලින් ඒකේ නීති බලන්න.)',
      code: {
        lang: 'python',
        src: `import pandas as pd
import requests
from bs4 import BeautifulSoup

# CSV file එකක් කියවනවා
df = pd.read_csv("sales.csv")

# API එකකින් JSON data ගන්නවා
data = requests.get("https://api.example.com/rates").json()

# Web page එකක මාතෘකා (h2) ටික ගන්නවා
html = requests.get("https://example.com").text
soup = BeautifulSoup(html, "html.parser")
titles = [h.text for h in soup.find_all("h2")]`,
      },
      keyPoints: [
        'CSV / Excel = ලේසිම data source එක.',
        'API = නිල, structured විදිහට data ගන්න ක්‍රමය.',
        'Web scraping = BeautifulSoup (පොඩි) හෝ Scrapy (ලොකු).',
        'Databases වලින් data ගන්න SQL දැනගන්න ඕනේ.',
      ],
      terms: [
        { en: 'CSV / Excel', si: 'වගු data save කරන සාමාන්‍ය file formats.' },
        { en: 'API', si: 'වෙනත් system එකකින් data ඉල්ලන්න හදපු නිල interface එක.' },
        { en: 'JSON', si: 'API වලින් ගොඩක් වෙලාවට එවන, key-value විදිහට data ලියන format එක.' },
        { en: 'Web Scraping', si: 'Website වල HTML එකෙන් data උකහගැනීම.' },
        { en: 'BeautifulSoup', si: 'HTML parse කරලා ඕනේ කොටස් හොයාගන්න Python library එක.' },
        { en: 'Scrapy', si: 'Pages ගොඩක් crawl කරන්න හදපු Python scraping framework එක.' },
        { en: 'Database / SQL', si: 'Data ගබඩා කරන system එක සහ ඒකෙන් data ඉල්ලන language එක.' },
      ],
    },
    {
      id: 'data-cleaning',
      title: 'Data Cleaning',
      body: [
        'ඇත්ත ලෝකයේ data කවදාවත් පිරිසිදු නෑ. සමහර cells හිස්. සමහර rows දෙපාරක් තියෙනවා. සමහර අගයන් අමුතු විදිහට ලොකුයි. Data scientist කෙනෙක්ගේ වෙලාවෙන් ලොකු කොටසක් යන්නේ data cleaning වලට කියලා කියනවා.',
        'Missing values (හිස් තැන්) වලට ක්‍රම කිහිපයක් තියෙනවා. ඒ row එක අයින් කරන්න පුළුවන් (drop). නැත්නම් column එකේ mean, median, හරි mode එකෙන් පුරවන්න පුළුවන් (imputation). Outliers තියෙනවා නම් median එක mean එකට වඩා ආරක්ෂිතයි.',
        'Outliers කියන්නේ අනිත් ඒවට වඩා ගොඩක් වෙනස් අගයන්. සමහර වෙලාවට ඒවා typing වැරදි (වයස 250). සමහර වෙලාවට ඇත්ත (ලොකු ව්‍යාපාරිකයෙක්ගේ ආදායම). IQR ක්‍රමය වගේ ක්‍රම වලින් හොයාගෙන, ඒවා වැරදිද ඇත්තද කියලා තීරණය කරන්න ඕනේ.',
        'Duplicates (එකම row දෙපාරක්) අයින් කරන්න ඕනේ. Data types හරිද බලන්න ඕනේ, උදාහරණයක් විදිහට මිල text විදිහට save වෙලා නම් අංක බවට හරවන්න ඕනේ. Inconsistent formats කියන්නේ "Colombo", "colombo", "CMB" වගේ එකම දේ විවිධ විදිහට ලියලා තියෙන එක. ඒවා එක format එකකට ගේන්න ඕනේ.',
      ],
      analogy: 'කඩෙන් ගෙනාපු හාල් උයන්න කලින් ගල් අහුලනවා, හෝදනවා වගේ. ගල් (outliers), වී ඇට (duplicates), කුණු (missing values) අයින් කළේ නැත්නම් බත් එක කොච්චර හොඳට ඉව්වත් කන්න බෑ. Data වලත් එහෙමයි. "Garbage in, garbage out."',
      example: 'Customers 1,000ක වගුවක age column එකේ හිස් 80ක් තියෙනවා. ඉතිරි 920 දෙනාගේ median වයස 34යි. ඒ හිස් 80ට 34 දානවා. ඊට පස්සේ duplicate rows 15ක් හොයාගෙන අයින් කරනවා. අන්තිමට rows 985ක් ඉතුරු වෙනවා, හිස් තැන් නෑ.',
      code: {
        lang: 'python',
        src: `import pandas as pd
df = pd.read_csv("customers.csv")

print(df.isna().sum())                 # column එකකට හිස් තැන් කීයද
df["age"] = df["age"].fillna(df["age"].median())  # median එකෙන් පුරවනවා
df = df.drop_duplicates()               # duplicate rows අයින් කරනවා
df["price"] = pd.to_numeric(df["price"], errors="coerce")  # text -> අංක
df["city"] = df["city"].str.strip().str.title()  # "colombo " -> "Colombo"

# IQR ක්‍රමයෙන් outliers හොයනවා
q1, q3 = df["income"].quantile([0.25, 0.75])
iqr = q3 - q1
outliers = df[(df["income"] < q1 - 1.5*iqr) | (df["income"] > q3 + 1.5*iqr)]`,
      },
      keyPoints: [
        'Missing values: drop කරන්න හෝ impute කරන්න.',
        'Outliers: හොයාගෙන, වැරැද්දක්ද ඇත්තද කියලා තීරණය කරන්න.',
        'Duplicates අයින් කරන්න, data types හරිද බලන්න.',
        'එකම දේ එකම format එකෙන් ලියන්න.',
      ],
      terms: [
        { en: 'Missing Values', si: 'Data නැති හිස් cells. Pandas වල NaN කියලා පේනවා.' },
        { en: 'Imputation', si: 'හිස් තැන් mean, median, mode වගේ අගයකින් පුරවන එක.' },
        { en: 'Outliers', si: 'අනිත් අගයන් වලට වඩා ගොඩක් දුරින් තියෙන අගයන්.' },
        { en: 'IQR', si: 'Interquartile Range. Data එකේ මැද 50% පැතිරිලා තියෙන පරාසය (Q3 - Q1).' },
        { en: 'Duplicates', si: 'එකම data row එක කිහිප පාරක් තියෙන එක.' },
        { en: 'Data Types', si: 'අංකයක්ද, text එකක්ද, දිනයක්ද වගේ column එකේ වර්ගය.' },
        { en: 'Inconsistent Formats', si: 'එකම දේ විවිධ විදිහට ලියලා තියෙන එක. උදා: "Colombo" සහ "CMB".' },
      ],
    },
    {
      id: 'eda',
      title: 'Exploratory Data Analysis (EDA)',
      body: [
        'EDA කියන්නේ model එකක් හදන්න කලින් data එක එක්ක "අඳුනගන්න" කරන වැඩේ. මොන වගේ අගයන් තියෙනවද, කොහොමද පැතිරිලා තියෙන්නේ, මොන columns අතර සම්බන්ධයක් තියෙනවද කියලා බලනවා.',
        'Univariate analysis කියන්නේ එක column එකක් විතරක් බලන එක. Mean, median, min, max, histogram එකක් බලනවා. Distribution එක කියන්නේ අගයන් පැතිරිලා තියෙන හැඩය. සමහර ඒවා සීනුවක් වගේ (normal distribution). සමහර ඒවා එක පැත්තකට ඇදිලා (skewed). උදාහරණයක් විදිහට ආදායම සාමාන්‍යයෙන් දකුණට skewed, ගොඩක් අයට අඩු ආදායම්, ටික දෙනෙක්ට ගොඩක් වැඩි.',
        'Bivariate analysis කියන්නේ columns දෙකක් අතර සම්බන්ධය බලන එක. උදාහරණ: ගෙදර ප්‍රමාණය සහ මිල අතර scatter plot එකක්. Multivariate analysis කියන්නේ columns තුනක් හෝ වැඩි ගණනක් එකවර බලන එක, උදාහරණයක් විදිහට pair plot එකක් හරි පාට වලින් තුන්වෙනි variable එකක් පෙන්නන scatter plot එකක්.',
        'Correlation කියන්නේ variables දෙකක් එකට වැඩි අඩු වෙනවද කියන එක -1 සිට +1 දක්වා අංකයකින් පෙන්නන එක. +1 කියන්නේ එකක් වැඩි වෙද්දී අනිකත් වැඩි වෙනවා. -1 කියන්නේ එකක් වැඩි වෙද්දී අනික අඩු වෙනවා. 0 කියන්නේ සරල රේඛීය සම්බන්ධයක් නෑ. Correlation heatmap එකකින් හැම column යුගලයකම correlation එක පාට වලින් එකපාර පේනවා. මතක තියාගන්න: correlation කියන්නේ causation (හේතුව) නෙවෙයි.',
      ],
      analogy: 'අලුත් පන්තියකට ගිය ගුරුවරයෙක් මුල් සතියේ ළමයි ගැන දැනගන්නවා වගේ. එක එක ළමයාගේ ලකුණු බලනවා (univariate). පාඩම් කරන පැය සහ ලකුණු අතර සම්බන්ධය බලනවා (bivariate). පැය, ටියුෂන් යනවද, ගෙදර දුර, ලකුණු එකට බලනවා (multivariate). ඊට පස්සේ තමයි උගන්නන සැලැස්ම හදන්නේ.',
      example: 'Colombo ගෙවල් 500ක data බලද්දී size_sqft සහ price අතර correlation එක 0.82යි. ඒ කියන්නේ ලොකු ගෙවල් වල මිල වැඩි වෙන ප්‍රවණතාවක් ශක්තිමත්ව තියෙනවා. ඒත් distance_to_city සහ price අතර -0.45යි. නගරයෙන් ඈත් වෙද්දී මිල අඩු වෙන ප්‍රවණතාවක් තියෙනවා.',
      code: {
        lang: 'python',
        src: `import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

df = pd.read_csv("houses.csv")
print(df.describe())               # mean, std, min, max සාරාංශය

sns.histplot(df["price"])           # univariate: මිල distribution එක
plt.show()
sns.scatterplot(data=df, x="size_sqft", y="price")  # bivariate
plt.show()

corr = df.select_dtypes("number").corr()   # අංක columns අතර correlation
sns.heatmap(corr, annot=True, cmap="coolwarm")
plt.show()`,
      },
      keyPoints: [
        'Univariate = එක column, bivariate = දෙකක්, multivariate = ගොඩක්.',
        'Distribution එකේ හැඩය (normal, skewed) බලන්න.',
        'Correlation heatmap එකෙන් සම්බන්ධතා එකපාර පේනවා.',
        'Correlation කියන්නේ causation නෙවෙයි.',
      ],
      terms: [
        { en: 'Univariate Analysis', si: 'එක variable එකක් තනියම විශ්ලේෂණය කරන එක.' },
        { en: 'Bivariate Analysis', si: 'Variables දෙකක් අතර සම්බන්ධය බලන එක.' },
        { en: 'Multivariate Analysis', si: 'Variables තුනක් හෝ වැඩි ගණනක් එකවර බලන එක.' },
        { en: 'Distribution', si: 'අගයන් පැතිරිලා තියෙන හැඩය.' },
        { en: 'Skewness', si: 'Distribution එක එක පැත්තකට ඇදිලා තියෙන ප්‍රමාණය.' },
        { en: 'Correlation Heatmap', si: 'හැම column යුගලයකම correlation එක පාට වලින් පෙන්නන වගුව.' },
      ],
    },
    {
      id: 'encoding',
      title: 'Feature Engineering 1: Categorical Encoding',
      body: [
        'Feature engineering කියන්නේ raw data වලින් model එකට තේරෙන, ප්‍රයෝජනවත් columns (features) හදන එක. ගොඩක් වෙලාවට හොඳ features හදන එක අලුත් algorithm එකකට වඩා ප්‍රතිඵලය වැඩි දියුණු කරනවා.',
        'Models වලට අංක input ඕනේ. "Colombo", "Kandy", "Galle" වගේ text categories අංක වලට හරවන එක encoding. Ordinal encoding එකේ small=0, medium=1, large=2 වගේ ස්වභාවික පිළිවෙළක් අංක වලින් නිරූපණය කරනවා. පිළිවෙළක් නැති city වගේ categories වලට 0, 1, 2 දුන්නොත් ඒ අංක අතර ප්‍රමාණයක හෝ අනුපිළිවෙළක සම්බන්ධයක් තියෙනවා කියන අර්ථයක් model එක වැරදියට ගන්න පුළුවන්. Tree model එකක් වුණත් අංක අනුව split කරන්නේ නිසා අහඹු අංකකරණය category group කිරීමට බාධා වෙන්න පුළුවන්; tree එකකට label encoding හැමවිටම ආරක්ෂිතයි කියලා නීතියක් නෑ. One-hot encoding හෝ model එකේ native categorical support එක සලකා බලන්න.',
        'One-hot encoding වලදී හැම category එකකටම වෙනම column එකක් හදලා 0 හරි 1 දානවා. is_Colombo, is_Kandy, is_Galle. පිළිවෙළක් නැති categories වලට මේක ආරක්ෂිතයි. ඒත් categories දහස් ගණනක් තියෙනවා නම් columns ගොඩක් හැදෙනවා.',
        'Target encoding වලදී category එක වෙනුවට ඒ category එකේ target එකේ සාමාන්‍යය වැනි අගයක් දානවා. උදාහරණයක් විදිහට Colombo ගෙවල් වල සාමාන්‍ය මිල. Categories ගොඩක් තියෙනකොට ප්‍රයෝජනවත් වුණත්, එක training row එක encode කරන්න එම row එකේ target එකත් ඇතුළත් සාමාන්‍යය භාවිතා කළොත් target එක ආපහු feature එකට කාන්දු වෙනවා. Training rows සඳහා out-of-fold encoding භාවිතා කරන්න: එක් එක් fold එකේ rows encode කරන්නේ අනෙක් folds වලින් පමණක් ගණනය කළ category statistics වලින්. Validation සහ test rows encode කරන්නේ training කොටසෙන් ගණනය කළ statistics වලින් පමණයි. නොදුටු category එකකට global training mean එක වැනි fallback එකක් යොදන්න.',
      ],
      analogy: 'School එකේ houses හතරක් තියෙනවා කියමු: Vijaya, Gemunu, Tissa, Parakrama. ඒවට අහඹුවෙන් 1, 2, 3, 4 කියලා අංක දුන්නා කියලා Parakrama (4) Vijaya (1) ට වඩා හතර ගුණයක් හොඳයි කියන අදහසක් නෑ. One-hot කියන්නේ හැම ළමයෙක්ටම badges හතරක් දීලා, එයාගේ house එකේ badge එක විතරක් දාගන්න කියනවා වගේ.',
      example: 'City අගයන් Colombo, Kandy, Colombo නම් one-hot columns [is_Colombo, is_Kandy] යටතේ rows [1, 0], [0, 1], [1, 0] වෙනවා. Training fold එකක වෙනත් Colombo ගෙවල් දෙකක මිල ලක්ෂ 400 සහ 500 නම්, ඒ fold එකෙන් පිටත Colombo row එකක target encoding ලක්ෂ 450 වෙන්න පුළුවන්. නමුත් එම row එකේ මිල ලක්ෂ 900 නම්, එම row එකත් සාමාන්‍යයට ඇතුළත් කරලා encode කිරීම target leakage එකක්. ඒ නිසා එහි training encoding එක හදන්න එම row එක නොදැකපු වෙනත් folds වල statistics පාවිච්චි කරන්න.',
      code: {
        lang: 'python',
        src: `import pandas as pd

df = pd.DataFrame({"city": ["Colombo", "Kandy", "Galle", "Colombo"],
                   "size": ["small", "large", "medium", "small"],
                   "price": [450, 280, 300, 500]})

# One-hot: හැම city එකකටම 0/1 column එකක්
onehot = pd.get_dummies(df["city"], prefix="city")

# Ordinal encoding: පිළිවෙළක් තියෙන size එකට අංක
df["size_num"] = df["size"].map({"small": 0, "medium": 1, "large": 2})

# Target encoding එකක් භාවිතා කරනවා නම්, training rows සඳහා
# out-of-fold values හදන encoder එකක් CV pipeline එක ඇතුළේ fit කරන්න.
# Validation/test rows සඳහා training fold එකේ statistics පමණක් භාවිතා කරන්න.`,
      },
      keyPoints: [
        'Models වලට අංක ඕනේ, text categories encode කරන්න ඕනේ.',
        'Ordinal encoding = ස්වභාවික පිළිවෙළක් තියෙන categories වලට. Nominal categories වලට අහඹු label numbers දැමීම tree models වලටත් අවදානම්.',
        'One-hot = පිළිවෙළක් නැති categories වලට ආරක්ෂිතයි.',
        'Target encoding = category එකේ target statistics භාවිතා කරනවා; training values out-of-fold හදලා leakage වළක්වන්න.',
      ],
      terms: [
        { en: 'Feature Engineering', si: 'Raw data වලින් model එකට ප්‍රයෝජනවත් අලුත් features හදන එක.' },
        { en: 'One-Hot Encoding', si: 'හැම category එකකටම 0/1 වෙනම column එකක් හදන එක.' },
        { en: 'Ordinal Encoding', si: 'ස්වභාවික පිළිවෙළක් ඇති categories ඒ පිළිවෙළ රැකෙන අංක වලට හැරවීම.' },
        { en: 'Target Encoding', si: 'Category එකේ target statistics භාවිතා කරන encoding එක. Training row එකක් encode කරන්න එම row එකේ target එක නොදැකපු statistics අවශ්‍යයි.' },
      ],
    },
    {
      id: 'scaling-transforms',
      title: 'Feature Engineering 2: Scaling සහ අලුත් Features',
      body: [
        'Features වල scales ගොඩක් වෙනස් වෙන්න පුළුවන්. වයස 20-60 අතර. ආදායම Rs. 30,000 - 500,000 අතර. KNN, SVM, linear models වගේ ඒවා දුර හරි gradient හරි පාවිච්චි කරන නිසා ලොකු අංක තියෙන feature එක අනිත් ඒවා යටපත් කරනවා. ඒ නිසා scaling කරනවා. (Tree models වලට scaling සාමාන්‍යයෙන් අවශ්‍ය නෑ.)',
        'Standardization (z-score) වලදී හැම අගයකින්ම mean එක අඩු කරලා standard deviation එකෙන් බෙදනවා. ප්‍රතිඵලයේ mean = 0, standard deviation = 1. Normalization (min-max scaling) වලදී අගයන් 0 සිට 1 දක්වා පරාසයකට ගේනවා: (x - min) / (max - min). මෙතන x කියන්නේ අගය, min කියන්නේ column එකේ කුඩාම අගය, max කියන්නේ ලොකුම අගය.',
        'Binning කියන්නේ අඛණ්ඩ අංක කාණ්ඩ වලට බෙදන එක, උදා: වයස 0-17 "child", 18-59 "adult", 60+ "senior". Log transform එක ගොඩක් skewed data (ආදායම, මිල) සමබර කරනවා. Log එකෙන් ලොකු අගයන් හකුළනවා, 10, 100, 1000 වගේ ඒවා log10 වලින් 1, 2, 3 වෙනවා.',
        'Interaction features කියන්නේ features දෙකක් එකතු කරලා අලුත් එකක් හදන එක, උදා: price_per_sqft = price / size. Date/time features වලදී එක date එකකින් year, month, day of week, weekend ද, poya day ද, hour වගේ features ගොඩක් හදන්න පුළුවන්. කඩේක විකුණුම් වලට "සෙනසුරාදාද" කියන එක ගොඩක් වැදගත් වෙන්න පුළුවන්.',
      ],
      analogy: 'Cricket වල batsman කෙනෙක්ව සසඳන්න runs විතරක් බැලුවොත් අසාධාරණයි. Matches 200ක් ගහපු කෙනාට runs වැඩියි. Average එක (runs / outs) කියන්නේ interaction feature එකක්. Strike rate එකත් එහෙමයි. Raw අංක වලින් වඩා හොඳ කතාවක් කියන අලුත් අංකයක් හදනවා.',
      example: 'වයස් 20, 40, 60. Min-max normalization: (20-20)/(60-20)=0, (40-20)/40=0.5, (60-20)/40=1. ඉතින් [0, 0.5, 1]. Standardization: mean 40, standard deviation (population) ආසන්න වශයෙන් 16.33. (20-40)/16.33 = -1.22, 0, +1.22.',
      code: {
        lang: 'python',
        src: `import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler, MinMaxScaler

df = pd.DataFrame({"age": [20, 40, 60], "income": [30000, 80000, 900000],
                   "date": pd.to_datetime(["2024-04-13", "2024-04-14", "2024-12-25"])})

df["age_std"] = StandardScaler().fit_transform(df[["age"]]).ravel()  # mean 0, std 1
df["age_norm"] = MinMaxScaler().fit_transform(df[["age"]]).ravel()   # 0 - 1
df["log_income"] = np.log1p(df["income"])          # skewed ආදායම හකුළනවා
df["age_group"] = pd.cut(df["age"], bins=[0, 17, 59, 120],
                         labels=["child", "adult", "senior"])  # binning
df["month"] = df["date"].dt.month                   # date වලින් features
df["is_weekend"] = df["date"].dt.dayofweek >= 5`,
      },
      keyPoints: [
        'Standardization = mean 0, std 1. Normalization = 0 සිට 1.',
        'Scaler එක train data වලින් විතරක් fit කරන්න.',
        'Log transform = skewed data සමබර කරනවා.',
        'Binning, interaction, date features වලින් අලුත් තොරතුරු හොයාගන්න.',
      ],
      terms: [
        { en: 'Standardization', si: 'Mean අඩු කරලා std එකෙන් බෙදීම. ප්‍රතිඵලය mean 0, std 1.' },
        { en: 'Normalization (Min-Max)', si: 'අගයන් 0 සිට 1 දක්වා පරාසයකට ගේන එක.' },
        { en: 'Binning', si: 'අඛණ්ඩ අංක කාණ්ඩ (bins) වලට බෙදීම.' },
        { en: 'Log Transform', si: 'Log එක ගන්න එක. ලොකු අගයන් හකුළලා skewed data සමබර කරනවා.' },
        { en: 'Interaction Features', si: 'Features දෙකක් ගුණ කරලා, බෙදලා වගේ හදන අලුත් feature එක.' },
        { en: 'Date/Time Features', si: 'Date එකකින් month, weekday, hour, holiday වගේ features හදන එක.' },
      ],
    },
    {
      id: 'feature-selection',
      title: 'Feature Selection',
      body: [
        'Features ගොඩක් තිබුණා කියලා model එක හොඳ වෙන්නේ නෑ. අදාළ නැති features noise එකතු කරනවා, training slow කරනවා, overfitting වැඩි කරනවා. Feature selection කියන්නේ වැදගත්ම features ටික විතරක් තෝරගන්න එක.',
        'Filter methods වලදී model එකක් නැතුව statistical test එකකින් feature එකේ වැදගත්කම මනිනවා. Correlation, chi-square, mutual information වගේ දේවල්. වේගවත්, ඒත් features අතර එකට වැඩ කරන විදිහ බලන්නේ නෑ. Wrapper methods වලදී features වල විවිධ කට්ටල වලින් model එක ඇත්තටම train කරලා හොඳම කට්ටලය හොයනවා. Recursive Feature Elimination (RFE) එක උදාහරණයක්. නිවැරදියි, ඒත් slow.',
        'Embedded methods වලදී model එක train වෙද්දීම feature selection වෙනවා. Lasso (L1) regression එක අවශ්‍ය නැති features වල weight එක හරියටම 0 කරනවා. Tree models වල feature importance එකත් මේ වර්ගයට අයිතියි.',
        'Multicollinearity කියන්නේ features දෙකක් හෝ කිහිපයක් එකිනෙකට ගොඩක් සම්බන්ධ වෙන එක, උදා: size_sqft සහ size_sqm. Linear models වලට මේක ප්‍රශ්නයක්, coefficients අස්ථාවර වෙනවා. VIF (Variance Inflation Factor) එකෙන් මේක මනිනවා. VIF 1 කියන්නේ කිසි ප්‍රශ්නයක් නෑ. සාමාන්‍ය නීතියක් විදිහට VIF 5ට හරි 10ට වඩා වැඩි නම් ඒ feature එක අනිත් ඒවා වලින් ගොඩක් දුරට පුරෝකථනය කරන්න පුළුවන් කියන එක.',
      ],
      analogy: 'Cricket team එකක් තෝරනවා වගේ. Filter method = හැම කෙනාගෙම average එක බලලා තෝරනවා. Wrapper method = විවිධ කණ්ඩායම් එකතු කරලා practice matches ගහලා බලනවා. Embedded method = season එක ගහද්දීම දුර්වල අයව ක්‍රමයෙන් අයින් කරනවා. Multicollinearity = එකම විදිහට ගහන batsmen දෙන්නෙක් ඉන්නවා නම් එක්කෙනෙක් ඇති.',
      example: 'Features 50ක් තියෙන dataset එකක Lasso පාවිච්චි කළාම features 38ක coefficient එක 0 වෙනවා. ඉතුරු 12 විතරක් පාවිච්චි කරලා model එක train කළාම test accuracy එක 84% සිට 86% ට වැඩි වෙනවා, training එක 4 ගුණයක් වේගවත් වෙනවා.',
      code: {
        lang: 'python',
        src: `import pandas as pd
from sklearn.feature_selection import SelectKBest, f_regression, RFE
from sklearn.linear_model import LinearRegression
from statsmodels.stats.outliers_influence import variance_inflation_factor

df = pd.read_csv("houses.csv")
X, y = df.drop(columns="price"), df["price"]

# Filter: statistical test එකෙන් හොඳම features 5
X_filter = SelectKBest(f_regression, k=5).fit_transform(X, y)
# Wrapper: RFE එකෙන් features 5ක් තෝරනවා
rfe = RFE(LinearRegression(), n_features_to_select=5).fit(X, y)
print(X.columns[rfe.support_])
# VIF: හැම feature එකකම multicollinearity
print([variance_inflation_factor(X.values, i) for i in range(X.shape[1])])`,
      },
      keyPoints: [
        'Filter = statistics වලින්, වේගවත්.',
        'Wrapper = model එක train කරලා බලනවා, නිවැරදි ඒත් slow.',
        'Embedded = training එක ඇතුළේම (Lasso, tree importance).',
        'VIF වැඩි නම් multicollinearity තියෙනවා.',
      ],
      terms: [
        { en: 'Filter Methods', si: 'Model එකක් නැතුව statistical score එකකින් features තෝරන එක.' },
        { en: 'Wrapper Methods', si: 'Feature කට්ටල වලින් model train කරලා හොඳම කට්ටලය හොයන එක (උදා: RFE).' },
        { en: 'Embedded Methods', si: 'Model එක train වෙද්දීම features තෝරන එක (උදා: Lasso).' },
        { en: 'Multicollinearity', si: 'Features එකිනෙකට ගොඩක් සම්බන්ධ වෙලා තියෙන එක.' },
        { en: 'VIF', si: 'Variance Inflation Factor. Feature එකක් අනිත් features වලින් කොච්චර පුරෝකථනය කරන්න පුළුවන්ද කියන මිනුම.' },
      ],
    },
    {
      id: 'storytelling-dashboards',
      title: 'Data Visualization, Storytelling සහ Dashboards',
      body: [
        'Analysis එකක් කොච්චර හොඳ වුණත්, ඒක අනිත් අයට තේරෙන විදිහට කියන්න බැරි නම් වැඩක් නෑ. Data storytelling කියන්නේ data, charts, සහ සරල කතාවක් එකතු කරලා තීරණයක් ගන්න උදව් කරන එක.',
        'හරි chart එක තෝරන්න: කාලයත් එක්ක වෙනස් වීම = line chart. Categories සසඳන්න = bar chart. Variables දෙකක සම්බන්ධය = scatter plot. Distribution = histogram හෝ box plot. 3D charts සහ ගොඩක් slices තියෙන pie charts වලින් වළකින්න. වැදගත් දේ පාටකින් highlight කරලා, අනිත් ඒවා අළු පාට කරන්න.',
        'හොඳ කතාවක ව්‍යුහය: (1) ප්‍රශ්නය මොකක්ද, (2) data එකෙන් හොයාගත්තේ මොකක්ද, (3) ඉතින් මොකද කරන්න ඕනේ. Chart එකේ title එකේම ප්‍රධාන අදහස ලියන්න, උදා: "Sales" වෙනුවට "අප්‍රේල් මාසයේ විකුණුම් 40% කින් වැඩි වුණා".',
        'Dashboard එකක් කියන්නේ වැදගත් අංක සහ charts එක තැනක, ගොඩක් වෙලාවට auto-update වෙන විදිහට පෙන්නන තිරයක්. Power BI (Microsoft) සහ Tableau කියන්නේ code නැතුව drag and drop කරලා dashboards හදන්න පුළුවන් ජනප්‍රිය business tools. Streamlit කියන්නේ Python script එකක් ලියලා ඉක්මනින් web dashboard හරි ML demo app එකක් හරි හදන්න පුළුවන් library එකක්.',
      ],
      analogy: 'Car එකක dashboard එක වගේ. Engine එක ඇතුළේ සිද්ධ වෙන දේවල් දහස් ගණනක් තියෙනවා. ඒත් driver ට පෙන්නන්නේ speed, fuel, temperature වගේ වැදගත්ම දේවල් ටික විතරයි. Business dashboard එකකත් කළමනාකරුට ඕනේ වැදගත්ම අංක ටික විතරයි.',
      example: 'Restaurant chain එකක ශාඛා 10ක දත්ත. Streamlit app එකක ශාඛාව තෝරන dropdown එකක්, දවසේ ආදායම පෙන්නන line chart එකක්, ඉහළම කෑම 5 පෙන්නන bar chart එකක් දානවා. කළමනාකරුට පේනවා Kandy ශාඛාවේ kottu විකුණුම් සඳුදා දවස් වල 30% කින් අඩුයි කියලා. ඒ දවස් වලට offer එකක් දාන්න තීරණය කරනවා.',
      code: {
        lang: 'python',
        src: `# app.py  -  run කරන්න: streamlit run app.py
import pandas as pd
import streamlit as st

df = pd.read_csv("sales.csv", parse_dates=["date"])
st.title("ශාඛා විකුණුම් Dashboard")

branch = st.selectbox("ශාඛාව තෝරන්න", df["branch"].unique())
data = df[df["branch"] == branch]

st.metric("මුළු ආදායම (Rs.)", f"{data['amount'].sum():,.0f}")
st.line_chart(data.groupby("date")["amount"].sum())  # දවසින් දවස ආදායම`,
      },
      keyPoints: [
        'ප්‍රශ්නයට ගැළපෙන chart එක තෝරන්න.',
        'Title එකේම ප්‍රධාන පණිවිඩය ලියන්න.',
        'Power BI, Tableau = code නැති business dashboards.',
        'Streamlit = Python වලින් ඉක්මන් dashboards සහ apps.',
      ],
      terms: [
        { en: 'Data Storytelling', si: 'Data, charts සහ කතාවක් එකතු කරලා තීරණයකට මඟ පෙන්නන එක.' },
        { en: 'Dashboard', si: 'වැදගත් අංක සහ charts එක තිරයක පෙන්නන එක.' },
        { en: 'Power BI', si: 'Microsoft හදපු business dashboard සහ report tool එක.' },
        { en: 'Tableau', si: 'Drag and drop කරලා visualizations හදන ජනප්‍රිය BI tool එක.' },
        { en: 'Streamlit', si: 'Python වලින් ඉක්මනින් data web apps හදන library එක.' },
      ],
    },
    {
      id: 'time-series-basics',
      title: 'Time Series Basics',
      body: [
        'Time series data කියන්නේ කාලයත් එක්ක පිළිවෙළට එකතු කරපු data. දවසේ විකුණුම්, පැයෙන් පැයට විදුලි භාවිතය, සතියෙන් සතියට ඩොලර් රේට් එක වගේ. මෙතන පිළිවෙළ ගොඩක් වැදගත්. Rows shuffle කළොත් තේරුම නැති වෙනවා.',
        'Time series එකක කොටස් තුනක් බලන්න පුළුවන්. Trend කියන්නේ දිගු කාලීනව උඩට හරි පහළට හරි යන ප්‍රවණතාව. Seasonality කියන්නේ නියමිත කාලයකට පස්සේ නැවත නැවත එන රටාව, උදා: හැම අප්‍රේල් සහ දෙසැම්බර් එකේම විකුණුම් වැඩි වෙන එක. ඉතුරු අහඹු වෙනස්කම් වලට residual හරි noise හරි කියනවා.',
        'Pandas වල time series එක්ක වැඩ කරන්න හොඳ tools තියෙනවා. resample() එකෙන් දවසේ data මාසයට එකතු කරන්න පුළුවන්. rolling() එකෙන් moving average එකක් ගණනය කරලා noise අඩු කරලා trend එක පැහැදිලි කරන්න පුළුවන්. shift() එකෙන් "ඊයේ අගය" වගේ lag features හදන්න පුළුවන්.',
      ],
      analogy: 'කොළඹ පාරේ traffic ගැන හිතන්න. අවුරුද්දෙන් අවුරුද්දට වාහන වැඩි වෙනවා (trend). හැම දවසකම උදේ 8ට සහ හවස 5ට traffic වැඩියි, ඉරිදට අඩුයි (seasonality). අද හදිසි අනතුරක් නිසා අමුතු traffic එකක් (noise).',
      example: 'බේකරියක දවසේ පාන් විකුණුම් දින 90ක්. දවසින් දවස අංක ගොඩක් උඩ පහළ යනවා (180, 240, 150...). දින 7 moving average එක ගත්තාම සුමට රේඛාවක් එනවා, ඒකේ පේනවා මාසෙකට පාන් 10ක් විතර වැඩි වෙන trend එකක්. සෙනසුරාදා දවස් වල නිතරම 50ක් විතර වැඩියි, ඒක සතිපතා seasonality එක.',
      code: {
        lang: 'python',
        src: `import pandas as pd

df = pd.read_csv("bakery.csv", parse_dates=["date"], index_col="date")

monthly = df["loaves"].resample("MS").sum()        # මාසෙන් මාසෙට එකතුව
df["ma7"] = df["loaves"].rolling(window=7).mean()  # දින 7 moving average
df["yesterday"] = df["loaves"].shift(1)            # ඊයේ අගය (lag feature)
df["weekday"] = df.index.dayofweek                 # සතියේ දවස

print(df.groupby("weekday")["loaves"].mean())       # දවස අනුව සාමාන්‍යය`,
      },
      keyPoints: [
        'Time series වල පිළිවෙළ වැදගත්, shuffle කරන්න එපා.',
        'Trend + Seasonality + Noise.',
        'resample, rolling, shift කියන්නේ ප්‍රධාන Pandas tools.',
        'Forecasting models ගැන ML phase එකේ ඉගෙන ගන්නවා.',
      ],
      terms: [
        { en: 'Time Series', si: 'කාලය අනුව පිළිවෙළට එකතු කරපු data.' },
        { en: 'Trend', si: 'දිගු කාලීනව උඩට හෝ පහළට යන ප්‍රවණතාව.' },
        { en: 'Seasonality', si: 'නියමිත කාලයකට පස්සේ නැවත එන රටාව.' },
        { en: 'Moving Average', si: 'අන්තිම දින N ක සාමාන්‍යය. Noise අඩු කරලා trend එක පෙන්නනවා.' },
        { en: 'Lag Feature', si: 'කලින් කාල පරිච්ඡේදයක අගය feature එකක් විදිහට ගන්න එක.' },
      ],
    },
    {
      id: 'business-metrics',
      title: 'Business Metrics සහ KPIs',
      body: [
        'Data science කරන්නේ ව්‍යාපාරයකට තීරණ ගන්න උදව් කරන්න. ඒ නිසා ව්‍යාපාරය සාර්ථකද කියලා මනින අංක තේරුම් ගන්න ඕනේ. KPI (Key Performance Indicator) කියන්නේ ඉලක්කයකට කොච්චර ළඟද කියලා පෙන්නන වැදගත්ම මිනුම්.',
        'පොදු metrics කිහිපයක්: Revenue (මුළු ආදායම), Conversion Rate (site එකට ආපු අයගෙන් කී දෙනෙක් ඇත්තටම මිලදී ගත්තද), Churn Rate (කාලයක් තුළ සේවාව නවත්වපු customers ප්‍රතිශතය), Customer Lifetime Value (CLV, එක customer කෙනෙක්ගෙන් මුළු කාලය පුරාම ලැබෙන ආදායම), Customer Acquisition Cost (CAC, අලුත් customer කෙනෙක් ගන්න යන වියදම), Average Order Value (AOV, එක order එකක සාමාන්‍ය වටිනාකම).',
        'හොඳ KPI එකක් පැහැදිලියි, මනින්න පුළුවන්, ව්‍යාපාරයේ ඉලක්කයට සම්බන්ධයි. "Likes ගණන" වගේ හොඳට පේන ඒත් තීරණ වලට උදව් නොවෙන අංක වලට vanity metrics කියනවා. ML model එකක් හදද්දීත් accuracy එකට වඩා "මේකෙන් ව්‍යාපාරයට කොච්චර ලාභයක්ද" කියන එක අවසානයේ වැදගත්.',
      ],
      analogy: 'A/L ශිෂ්‍යයෙක්ගේ KPIs: හැම subject එකකම model paper ලකුණු, දවසට පාඩම් කරන පැය, ඉවර කරපු past papers ගණන. Instagram followers ගණන vanity metric එකක්, ඒකෙන් Z-score එක වැඩි වෙන්නේ නෑ.',
      example: 'Online කඩයක මාසෙකට visitors 20,000ක්. Orders 600ක්. Conversion rate = 600 / 20,000 = 3%. මුළු ආදායම Rs. 1,800,000 නම් AOV = Rs. 3,000. Ads වලට Rs. 300,000ක් වියදම් කරලා අලුත් customers 400ක් ආවා නම් CAC = Rs. 750. Customer කෙනෙක්ගෙන් මුළු කාලයටම CLV Rs. 9,000ක් ලැබෙනවා නම්, CLV / CAC = 12. ඒ කියන්නේ ads වියදම හොඳ ආයෝජනයක්.',
      code: {
        lang: 'python',
        src: `import pandas as pd

orders = pd.read_csv("orders.csv", parse_dates=["date"])
visitors = 20000

revenue = orders["amount"].sum()                 # මුළු ආදායම
aov = orders["amount"].mean()                    # සාමාන්‍ය order වටිනාකම
conversion = orders["order_id"].nunique() / visitors  # conversion rate

# මාසෙන් මාසෙට ආදායම සහ වර්ධන ප්‍රතිශතය
monthly = orders.set_index("date")["amount"].resample("MS").sum()
growth = monthly.pct_change() * 100
print(revenue, aov, f"{conversion:.1%}")`,
      },
      keyPoints: [
        'KPI = ඉලක්කයට කොච්චර ළඟද කියන වැදගත්ම මිනුම.',
        'Conversion, churn, CLV, CAC, AOV කියන්නේ පොදු metrics.',
        'Vanity metrics වලින් පරිස්සම් වෙන්න.',
        'Data science අවසානයේ මනින්නේ ව්‍යාපාරයට ලැබෙන වටිනාකමෙන්.',
      ],
      terms: [
        { en: 'KPI', si: 'Key Performance Indicator. ඉලක්කයක් කරා ප්‍රගතිය මනින ප්‍රධාන මිනුම.' },
        { en: 'Conversion Rate', si: 'බැලුව අයගෙන් ඇත්තටම action එක (මිලදී ගැනීම) කරපු ප්‍රතිශතය.' },
        { en: 'Churn Rate', si: 'කාලයක් තුළ සේවාව අත්හැරපු customers ප්‍රතිශතය.' },
        { en: 'CLV', si: 'Customer Lifetime Value. එක customer කෙනෙක්ගෙන් මුළු කාලයටම ලැබෙන ආදායම.' },
        { en: 'CAC', si: 'Customer Acquisition Cost. අලුත් customer කෙනෙක් ගන්න යන සාමාන්‍ය වියදම.' },
        { en: 'Vanity Metrics', si: 'හොඳට පේන ඒත් තීරණ වලට උදව් නොවෙන අංක.' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Rows ලක්ෂ ගණනක් තියෙන වගුවක් group කරලා එකතු කරන්න ලේසිම සහ සාමාන්‍ය Python tool එක මොකක්ද?',
      options: ['Matplotlib', 'Pandas', 'BeautifulSoup'],
      answer: 1,
      why: 'Pandas DataFrame එකේ groupby() වලින් ලේසියෙන් group කරලා එකතු කරන්න පුළුවන්. Matplotlib charts වලට, BeautifulSoup HTML parse කරන්න.',
    },
    {
      q: 'ආදායම column එකේ outliers ගොඩක් තියෙනවා. හිස් තැන් පුරවන්න වඩා ආරක්ෂිත අගය මොකක්ද?',
      options: ['Mean', 'Median', 'Maximum'],
      answer: 1,
      why: 'Median එක මැද අගය නිසා ලොකු outliers වලින් එච්චර බලපෑමක් වෙන්නේ නෑ. Mean එක outliers දිහාට ඇදෙනවා.',
    },
    {
      q: '"Colombo", "Kandy", "Galle" වගේ පිළිවෙළක් නැති categories linear model එකකට දෙන්න හොඳම encoding එක මොකක්ද?',
      options: ['Label encoding', 'One-hot encoding', 'Log transform'],
      answer: 1,
      why: 'Label encoding වලින් නැති පිළිවෙළක් (Galle > Colombo) model එකට ඇඟවෙනවා. One-hot එකෙන් හැම city එකකටම වෙනම 0/1 column එකක් ලැබෙනවා.',
    },
    {
      q: 'Variables දෙකක correlation එක 0.9යි. මේකෙන් අනිවාර්යයෙන්ම කියවෙන්නේ මොකක්ද?',
      options: ['එකක් අනිකට හේතුවයි', 'ඒවා එකට වැඩි වෙන ශක්තිමත් රේඛීය ප්‍රවණතාවක් තියෙනවා', 'ඒවා දෙකම එකම column එකයි'],
      answer: 1,
      why: 'Correlation එකෙන් පෙන්නන්නේ එකට වෙනස් වෙන ප්‍රවණතාව විතරයි. ඒක causation (හේතුව) ඔප්පු කරන්නේ නෑ.',
    },
    {
      q: 'Min-max normalization වලින් අගයන් 10, 20, 30 මොනවා බවට පත් වෙනවද?',
      options: ['0, 0.5, 1', '-1, 0, 1', '1, 2, 3'],
      answer: 0,
      why: '(x - min) / (max - min). (10-10)/20 = 0, (20-10)/20 = 0.5, (30-10)/20 = 1.',
    },
    {
      q: 'Training එක ඇතුළේම අවශ්‍ය නැති features වල weight එක 0 කරන Lasso, feature selection වල මොන වර්ගයටද අයිති?',
      options: ['Filter method', 'Wrapper method', 'Embedded method'],
      answer: 2,
      why: 'Model එක train වෙද්දීම features තෝරන නිසා Lasso embedded method එකක්.',
    },
    {
      q: 'හැම දෙසැම්බර් මාසෙකම විකුණුම් වැඩි වෙනවා. Time series වල මේකට කියන්නේ මොකක්ද?',
      options: ['Trend', 'Seasonality', 'Outlier'],
      answer: 1,
      why: 'නියමිත කාලයකට පස්සේ නැවත නැවත එන රටාවට seasonality කියනවා. Trend කියන්නේ දිගු කාලීන උඩ හෝ පහළ යාම.',
    },
    {
      q: 'Visitors 10,000ක් ඇවිත් orders 250ක් ආවා නම් conversion rate එක කීයද?',
      options: ['2.5%', '25%', '0.25%'],
      answer: 0,
      why: '250 / 10,000 = 0.025 = 2.5%.',
    },
  ],
}
