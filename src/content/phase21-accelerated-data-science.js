export default {
  id: 'accelerated-data-science',
  number: 21,
  title: 'Accelerated Data Science with RAPIDS (NCA-ADS)',
  titleSi: 'RAPIDS එක්ක GPU මත Data Science: pandas වැඩ විනාඩි වලින් තත්පර වලට',
  summary: 'මේ phase එක NVIDIA NCA-ADS (Accelerated Data Science) certification එකට ඕනේ හැමදේම එක තැනකට ගේනවා. Phase 1 එකේ ඉගෙන ගත්ත pandas, EDA, feature engineering, Phase 17 එකේ කෙටියෙන් දැක්ක cuDF / cuML ගැන මෙතන ගැඹුරටම යනවා: GPU එක ඇත්තටම උදව් වෙන්නේ කවදාද, data GPU එකට ගෙනියන වියදම, Dask / Spark වලින් ලොකු data, cuML සහ XGBoost, reproducible pipelines, MLOps, time series, graphs, environment management. අන්තිමට ලංකාවේ supermarket sales pipeline එකක් පියවරෙන් පියවර GPU එකට ගෙනියනවා.',
  duration: 'සති 4-6',
  topics: [
    {
      id: 'ads-foundations-cpu-vs-gpu',
      title: 'Foundations: NumPy, pandas, Jupyter, and CPU vs GPU Workloads',
      body: [
        'Phase 1 එකේ ඔයා NumPy (අංක arrays) සහ pandas (DataFrame වගු) ඉගෙන ගත්තා. Accelerated data science කියන්නේ ඒ එකම අදහස් GPU එකක run කරන එක. ඉතින් මුලින්ම මතක් කරගන්න: pandas operations ඇතුළෙන් vectorized. ඒ කියන්නේ "මුළු column එකටම එකම වැඩේ" කියන හැඩය. GPU එකට ගැළපෙන්නේත් හරියටම මේ හැඩයමයි.',
        'Jupyter notebook එක data scientist ලාගේ වැඩ මේසය. Cells එකින් එක run කරලා ප්‍රතිඵල බලන්න පුළුවන්. Magic commands වැදගත්: %time එකක් cell එකක් එක පාරක් run වෙන්න ගිය වෙලාව, %timeit කීප පාරක් run කරලා සාමාන්‍ය වෙලාව. GPU code එක time කරද්දී පළවෙනි run එක හැමවිටම හෙමින් (CUDA context එක හදන්න, kernels load කරන්න වෙලා යනවා). ඒ නිසා warm-up run එකකට පස්සේ මනින්න.',
        'CPU එකට ගොඩක් දක්ෂ cores ටිකයි (උදා: 8-64). GPU එකට සරල cores දහස් ගණනක්. GPU එක දිනන්නේ: data ලොකුයි (rows මිලියන ගණන්), එකම operation එක හැම row එකටම (filter, groupby, join, sort, matrix math), data එක දිගටම GPU එකේම තියෙනවා. GPU එක පරදින්නේ: data පොඩියි (rows දහස් ගණන්), Python loops / row-by-row apply එකක්, branches ගොඩක් තියෙන ලොජික්, හැම පියවරකටම CPU-GPU අතර data එහාට මෙහාට යවනවා.',
        'මේ phase එකේ හැම topic එකකම ප්‍රශ්නය එකයි: "මේ workload එක parallel ද? Data GPU එකේ තියාගන්න පුළුවන්ද?" ඒ ප්‍රශ්න දෙකට ඔව් නම් RAPIDS ලොකු speedup එකක් දෙනවා. නැත්නම් CPU pandas එකම හොඳයි. GPU hardware ගැන විස්තර Phase 9 එකේ, කෙටි හැඳින්වීම Phase 17 (GPU Acceleration for Classic ML) එකේ තියෙනවා.',
      ],
      analogy: 'CPU එක කියන්නේ විශේෂඥ වෛද්‍යවරු 8 දෙනෙක්. GPU එක කියන්නේ vaccination කඳවුරක හෙදියෝ 5,000ක්. එක අමාරු රෝගියෙක්ට වෛද්‍යවරු හොඳයි. ළමයි ලක්ෂයකට එකම එන්නත දෙන්න හෙදියෝ 5,000 දිනනවා. ඒත් ළමයි 10කට එන්නත දෙන්න කඳවුරක් හදන එක (setup overhead) වටින්නේ නෑ.',
      example: 'Rows 5,000ක Excel file එකක groupby එකක් CPU pandas එකේ milliseconds 2ක් ගන්නවා. GPU එකේ කළත් ඒ වගේමයි, සමහරවිට data copy කරන වෙලාව නිසා හෙමින්. ඒත් rows මිලියන 100ක sales data එකක groupby + join pipeline එකක් CPU එකේ විනාඩි ගණනක් ගන්නවා නම්, GPU එකේ තත්පර කීපයකින් ඉවර වෙන්න පුළුවන් (ඇත්ත speedup එක hardware සහ operation එක අනුව වෙනස්).',
      code: {
        lang: 'python',
        src: `import numpy as np, pandas as pd

df = pd.DataFrame({"shop": np.random.randint(0, 500, 10_000_000),
                   "amount": np.random.rand(10_000_000) * 5000})

# හොඳයි: vectorized, GPU එකටත් ගැළපෙනවා
%time totals = df.groupby("shop")["amount"].sum()

# නරකයි: row එකින් row Python function එකක් (CPU / GPU දෙකේම හෙමින්)
# df["tax"] = df.apply(lambda r: r["amount"] * 0.18, axis=1)
df["tax"] = df["amount"] * 0.18   # මේ විදිහට vectorized ලියන්න`,
      },
      keyPoints: [
        'GPU = ලොකු data + එකම operation එක rows ගොඩකට + data GPU එකේම තියාගැනීම.',
        'පොඩි data, Python loops, row-by-row apply = GPU එකෙන් වාසියක් නෑ.',
        'Jupyter එකේ %time / %timeit. GPU timing වලට warm-up run එකකට පස්සේ මනින්න.',
        'Vectorized pandas code ලියන්න පුරුදු වුණොත් GPU එකට මාරු වෙන්න ලේසියි.',
      ],
      terms: [
        { en: 'Jupyter Notebook', si: 'Code, ප්‍රතිඵල, charts, සටහන් එකම පිටුවක cells විදිහට තියෙන interactive පරිසරය.' },
        { en: 'Magic Command', si: '% හෝ %% වලින් පටන් ගන්න Jupyter විශේෂ විධාන. උදා: %time, %timeit, %load_ext.' },
        { en: 'Workload', si: 'Computer එකට කරන්න දෙන වැඩ කොටස. උදා: groupby එකක්, model training එකක්.' },
        { en: 'Warm-up Run', si: 'පළවෙනි වතාවට run කරන එක. Setup වෙලාව ඇතුළත් නිසා timing වලට ගන්නේ නෑ.' },
        { en: 'Data Parallelism (data level)', si: 'Data එකේ හැම කොටසකටම එකම වැඩේ එකවර කරන එක. GPU එකේ ශක්තිය.' },
      ],
    },
    {
      id: 'host-device-data-movement',
      title: 'Host vs Device Memory: The Cost of Moving Data over PCIe',
      body: [
        'Computer එකේ memory දෙකක් තියෙනවා. Host memory = CPU එකේ RAM. Device memory = GPU එකේම තියෙන memory එක (VRAM, උදා: 16 GB, 24 GB, 80 GB). GPU එකට වැඩ කරන්න පුළුවන් device memory එකේ තියෙන data එක්ක විතරයි. ඉතින් pandas DataFrame එකක් GPU එකේ ගණනය කරන්න නම් මුලින්ම ඒක host සිට device එකට copy කරන්න ඕනේ. ඒ copy එක යන්නේ PCIe කියන පාර (bus) එක දිගේ.',
        'ප්‍රශ්නය මේකයි: GPU memory එක ඇතුළේ data කියවන වේගය PCIe පාරේ වේගයට වඩා ගොඩක් වැඩියි (බොහෝ data center GPUs වල දස ගුණයකටත් වඩා). ඉතින් GPU එකේ තත්පර 0.1කින් ඉවර වෙන ගණනයකට data copy කරන්න තත්පර 1ක් ගියොත්, මුළු වෙලාවෙන් වැඩි කොටස ගියේ ගමනට. මේකයි "data movement cost" කියන්නේ.',
        'ඒ නිසා රන් නීතිය: data එක එක පාරක් GPU එකට ගෙනියන්න, ඊට පස්සේ load කිරීම, clean කිරීම, features, training, prediction ඔක්කොම GPU එකේම කරන්න. අන්තිම ප්‍රතිඵලය (පොඩි summary එකක් හෝ predictions) විතරක් CPU එකට ගේන්න. හොඳම විදිහ: cudf.read_parquet() වගේ එකකින් file එක කෙලින්ම GPU එකට කියවන එක. සමහර systems වල GPUDirect Storage එකෙන් disk සිට GPU එකට CPU RAM එක මඟහරිමින් කියවන්නත් පුළුවන්.',
        'Data සැඟවිලා CPU එකට යන තැන් ගැන ප්‍රවේසම් වෙන්න: print කරන එක පොඩි කොටසකට කමක් නෑ, ඒත් .to_pandas(), .values (NumPy), matplotlib එකට මුළු column එකම දෙන එක, cuDF support නැති library එකකට data දෙන එක, ඒ හැම එකක්ම host copy එකක්. Loop එකක් ඇතුළේ එහාට මෙහාට යවන එක තමයි GPU code හෙමින් වෙන්න ප්‍රධානම හේතුව.',
      ],
      analogy: 'කොළඹ (CPU RAM) ඉඳන් මහනුවර (GPU) ට lorry එකකින් බඩු ගෙනියනවා කියලා හිතන්න. මහනුවර ගබඩාව ඇතුළේ බඩු අස්කරන එක ඉක්මනින් වෙනවා. ඒත් කඩුගන්නාව පාර (PCIe) දිගේ ගමන තමයි කාලය කන්නේ. එක පාරක් ලොකු lorry එකකින් ඔක්කොම ගෙනිහින් මහනුවරම වැඩ ඉවර කරන එක හොඳයි. හැම පැකට් එකක්ම වෙන වෙනම එහාට මෙහාට ගෙනියනවා නම් දවස ඉවරයි.',
      example: 'GB 8ක DataFrame එකක් PCIe 4.0 x16 පාරක් දිගේ (න්‍යායාත්මකව එක පැත්තකට තත්පරයට GB 30ක් පමණ) යවන්න ඇත්තටම තත්පර 0.3-0.5ක් වගේ යනවා. GPU එකේ groupby එක තත්පර 0.2යි. එක පාරක් ගෙනිහින් operations 20ක් කළොත් copy වෙලාව නොසලකා හරින්න පුළුවන්. හැම operation එකකටම පස්සේ .to_pandas() කරලා ආයෙත් GPU එකට යැව්වොත් copy වෙලාව තත්පර 10කට වඩා, GPU වාසිය නැති වෙලා.',
      code: {
        lang: 'python',
        src: `import cudf

# හොඳයි: file එක කෙලින්ම GPU memory එකට
gdf = cudf.read_parquet("sales_2025.parquet")
gdf = gdf[gdf["amount"] > 0]                      # GPU එකේ
summary = gdf.groupby("district")["amount"].sum()  # GPU එකේ
print(summary.to_pandas())   # පොඩි ප්‍රතිඵලය විතරක් CPU එකට

# නරකයි: loop එකක් ඇතුළේ එහාට මෙහාට
# for d in districts:
#     pdf = gdf.to_pandas()        # හැම පාරම GB ගණනක් CPU එකට
#     gdf = cudf.from_pandas(pdf)  # ආයෙත් GPU එකට`,
      },
      keyPoints: [
        'GPU එකට වැඩ කරන්න පුළුවන් device memory එකේ data එක්ක විතරයි.',
        'PCIe copy එක GPU memory bandwidth එකට වඩා ගොඩක් හෙමින්.',
        'එක පාරක් GPU එකට ගෙනියන්න, හැමදේම එතනම කරන්න, පොඩි ප්‍රතිඵලය විතරක් ආපහු ගේන්න.',
        '.to_pandas(), .values, support නැති libraries = සැඟවුණු host copies.',
      ],
      terms: [
        { en: 'Host Memory', si: 'CPU එකට අයිති RAM එක.' },
        { en: 'Device Memory (VRAM)', si: 'GPU card එකේම තියෙන memory එක. GPU එක ගණනය කරන්නේ මේකේ data වලින්.' },
        { en: 'PCIe', si: 'CPU සහ GPU සම්බන්ධ කරන bus එක. Host-device copies යන්නේ මේකෙන්.' },
        { en: 'Memory Bandwidth', si: 'තත්පරයකට memory එකෙන් කියවන්න / ලියන්න පුළුවන් data ප්‍රමාණය.' },
        { en: 'Pinned Memory', si: 'OS එක එහාට මෙහාට නොකරන විදිහට lock කරපු host memory. GPU copies වේගවත්.' },
        { en: 'GPUDirect Storage', si: 'Storage සිට GPU memory එකට CPU RAM හරහා නොගිහින් data කියවන NVIDIA technology එක.' },
      ],
    },
    {
      id: 'cudf-and-cupy',
      title: 'cuDF (GPU DataFrames) and CuPy (GPU NumPy)',
      body: [
        'cuDF කියන්නේ RAPIDS එකේ GPU DataFrame library එක. API එක හිතාමතාම pandas වගේ හදලා තියෙනවා: read_csv, read_parquet, filter, groupby, merge, sort_values, string operations (.str), datetime operations (.dt). ඒ නිසා pandas දන්න ඔයාට import pandas as pd වෙනුවට import cudf ලියලා ගොඩක් code එකම පාවිච්චි කරන්න පුළුවන්.',
        'ඒත් cuDF හරියටම pandas නෙවෙයි. සමහර වෙනස්කම්: row එකින් row iterate කරන එක (iterrows) GPU එකට හරියන්නේ නෑ, සමහර operations වල output order එක pandas වලට වෙනස් වෙන්න පුළුවන් (උදා: groupby result එක sort නොකර එන්න පුළුවන්, sort=True දෙන්න), සමහර pandas features තාම support නෑ. Versions අනුව API වෙනස් වෙන නිසා docs බලන්න.',
        'CuPy කියන්නේ GPU එකේ NumPy. cp.array, cp.sum, cp.dot, random numbers, linear algebra, NumPy වගේම syntax එක. cp.asarray(numpy_array) = CPU සිට GPU. cp.asnumpy(gpu_array) = GPU සිට CPU. cuDF column එකක් .to_cupy() / .values වලින් CuPy array එකක් විදිහට ගන්න පුළුවන්, ඒක GPU එකේම තියෙනවා.',
        'cuDF, CuPy, cuML, PyTorch වගේ GPU libraries එකිනෙකට data දෙන්නේ GPU memory එක ඇතුළේම. CUDA Array Interface සහ DLPack කියන සම්මත වලින් copy නොකර (zero-copy) buffer එකම share කරනවා (Phase 17 බලන්න). ඒ නිසා cuDF වලින් features හදලා, CuPy වලින් ගණනයක් කරලා, cuML එකට දෙන එක CPU එකට නොගිහින්ම කරන්න පුළුවන්.',
      ],
      analogy: 'pandas සහ cuDF කියන්නේ එකම Toyota model එකේ petrol සහ hybrid versions දෙක වගේ. Steering, gear, pedals එකම තැන (API එක). Engine එක වෙනස් (CPU vs GPU). ඒත් hybrid එකේ සමහර buttons ටිකක් වෙනස් තැන්වල, ඒ නිසා manual එක බලන්න ඕනේ.',
      example: 'Dialog / Mobitel වගේ operator කෙනෙක්ගේ call records මිලියන 200ක්. cudf.read_parquet() එකෙන් load කරලා, gdf["duration_min"] = gdf["seconds"] / 60, gdf.groupby("tower_id").agg({"duration_min": "sum"}). pandas code එකට අකුරු ටිකක් විතරයි වෙනස්. CuPy එකෙන් distance matrix එකක් වගේ math ගණනයක් GPU එකේම කරන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import cudf, cupy as cp

gdf = cudf.read_csv("calls.csv")                 # GPU DataFrame
gdf["minutes"] = gdf["seconds"] / 60              # pandas වගේමයි
top = gdf.groupby("tower_id", sort=True)["minutes"].sum().nlargest(5)

x = gdf["minutes"].to_cupy()                      # GPU එකේම CuPy array එකක්
z = (x - x.mean()) / x.std()                      # z-score, GPU එකේ
print(float(z.max()))                             # එක අංකයක් විතරක් CPU එකට

a = cp.random.rand(4000, 4000)                    # CuPy = GPU NumPy
b = cp.asnumpy(a @ a)                             # ප්‍රතිඵලය CPU එකට (NumPy)`,
      },
      keyPoints: [
        'cuDF = pandas වගේ API එකක් තියෙන GPU DataFrame.',
        'CuPy = NumPy වගේ API එකක් තියෙන GPU arrays.',
        'cuDF ≠ 100% pandas: order, iterrows, සමහර features වෙනස්.',
        'GPU libraries අතර zero-copy (CUDA Array Interface / DLPack).',
      ],
      terms: [
        { en: 'cuDF', si: 'RAPIDS GPU DataFrame library එක. pandas-like API.' },
        { en: 'CuPy', si: 'NumPy-compatible GPU array library එක.' },
        { en: 'cp.asarray / cp.asnumpy', si: 'NumPy → GPU, GPU → NumPy copy කරන functions.' },
        { en: 'CUDA Array Interface', si: 'Python GPU libraries අතර GPU memory buffer share කරන සම්මතය.' },
        { en: 'Zero-copy', si: 'Data copy නොකර, එකම memory එකට වෙනත් library එකකට "බලන්න" දෙන එක.' },
      ],
    },
    {
      id: 'cudf-pandas-accelerator',
      title: 'cudf.pandas: Zero-Code-Change Acceleration and CPU Fallback',
      body: [
        'Company එකක දැනටමත් pandas code පේළි දහස් ගණනක් තියෙනවා නම්, ඔක්කොම cuDF වලට rewrite කරන්න අමාරුයි. cudf.pandas mode එක ඒ ප්‍රශ්නය විසඳනවා. ඔයාගේ code එකේ import pandas as pd එහෙමම තියෙනවා. ඔයා කරන්නේ pandas import කරන්න කලින් accelerator එක load කරන එක විතරයි. Jupyter එකේ %load_ext cudf.pandas. Script එකක් නම් python -m cudf.pandas my_script.py.',
        'ඇතුළෙන් වෙන්නේ මෙහෙමයි: pd.DataFrame එක ඇත්තටම "proxy" object එකක්. ඔයා operation එකක් කළාම, ඒක cuDF එකේ GPU එකෙන් කරන්න බලනවා. cuDF එකේ ඒ operation එක support නැත්නම් හෝ GPU එකේ fail වුණොත්, ස්වයංක්‍රීයව data CPU එකට අරන් සාමාන්‍ය pandas එකෙන් කරනවා. මේකට කියන්නේ fallback කියලා. ප්‍රතිඵලය හැමවිටම pandas වලින් ලැබෙන එකමයි, වේගය විතරයි වෙනස්.',
        'Fallback එක ආරක්ෂිතයි, ඒත් නොමිලේ නෙවෙයි. CPU එකට fallback වෙන හැම පාරකම data GPU සිට CPU එකට (සහ සමහරවිට ආපහු) copy වෙනවා. ඉතින් fallbacks ගොඩක් තියෙන code එකක speedup එක අඩුයි, සමහරවිට pandas එකට වඩා හෙමින් වෙන්නත් පුළුවන්. මොන operations GPU එකේද, මොනවද CPU එකට ගියේ කියලා බලන්න profiler එකක් තියෙනවා (Jupyter එකේ %%cudf.pandas.profile cell magic එක; හරියට නම සහ options version අනුව බලන්න).',
        'cudf.pandas පාවිච්චි කරන්න ඕනේ කවදාද? තියෙන pandas code එක ඉක්මනින් වේගවත් කරන්න, third-party libraries pandas DataFrames බලාපොරොත්තු වෙනකොට. cuDF කෙලින්ම පාවිච්චි කරන්න ඕනේ කවදාද? අලුත් GPU-first code එකක් ලියනකොට, සහ හැම operation එකක්ම GPU එකේ වෙනවා කියලා සහතික කරගන්න ඕනේ නම්.',
      ],
      analogy: 'ඔයා Uber Eats වලින් කෑම order කරනවා. App එක (pandas API) එකමයි. App එක මුලින්ම ළඟම තියෙන ඉක්මන් කඩෙන් (GPU) ගේන්න බලනවා. ඒ කඩේ ඒ කෑම නැත්නම් ස්වයංක්‍රීයව ඈත කඩෙන් (CPU) ගේනවා. කෑම එකමයි, ඒත් ඈත කඩේට යන්න delivery වෙලාව වැඩියි. ඒක හැම order එකකටම වුණොත් වේගවත් සේවාව කියන එකේ තේරුම නැති වෙනවා.',
      example: 'Notebook එකක cells 30ක pandas pipeline එකක් CPU එකේ විනාඩි 12ක් ගන්නවා. පළවෙනි cell එකට %load_ext cudf.pandas දාලා restart කරලා run කළා. Profiler එකෙන් පේනවා operations 95%ක් GPU එකේ, එක custom .apply() එකක් විතරක් CPU fallback. මුළු වෙලාව විනාඩි 1කට අඩු වුණා කියමු. ඊළඟට ඒ .apply() එක vectorized කරලා fallback එකත් අයින් කළා.',
      code: {
        lang: 'python',
        src: `# Jupyter: පළවෙනි cell එකේ, pandas import කරන්න කලින්
%load_ext cudf.pandas
import pandas as pd            # දැන් මේක GPU-accelerated proxy එකක්

df = pd.read_csv("keells_bills.csv")
by_cat = df.groupby("category")["amount"].sum()   # GPU එකේ (support නම්)

# Script එකක් නම්, code වෙනස් නොකර:
#   python -m cudf.pandas etl.py
# Fallback: support නැති operation එකක් ආවොත් CPU pandas එකෙන් කරනවා,
#           ප්‍රතිඵලය එකමයි, ඒත් copy වියදම නිසා හෙමින්.`,
      },
      keyPoints: [
        'cudf.pandas = pandas code වෙනස් නොකර GPU එකේ run කිරීම.',
        'pandas import කරන්න කලින් load කරන්න (%load_ext cudf.pandas / python -m cudf.pandas).',
        'Support නැති operations = CPU pandas fallback, ප්‍රතිඵලය එකමයි.',
        'Fallbacks ගොඩක් නම් copies නිසා speedup අඩුයි. Profiler එකෙන් හොයන්න.',
      ],
      terms: [
        { en: 'cudf.pandas', si: 'pandas API එක තියාගෙනම GPU එකේ run කරන cuDF accelerator mode එක.' },
        { en: 'Fallback', si: 'GPU එකේ කරන්න බැරි වුණාම ස්වයංක්‍රීයව CPU pandas එකෙන් කරන එක.' },
        { en: 'Proxy Object', si: 'ඇතුළෙන් GPU හෝ CPU object එකක් තියාගෙන, pandas object එකක් වගේ හැසිරෙන wrapper එක.' },
        { en: 'Profiler', si: 'කොයි operation එක කොහේ (GPU/CPU) run වුණාද, කොච්චර වෙලා ගියාද කියලා පෙන්නන tool එක.' },
        { en: 'cuml.accel', si: 'scikit-learn code වෙනස් නොකර cuML එකෙන් accelerate කරන, cudf.pandas වගේ mode එක (අලුත් cuML versions වල).' },
      ],
    },
    {
      id: 'file-formats-parquet-arrow',
      title: 'File Formats: CSV vs Parquet, ORC, and Apache Arrow',
      body: [
        'CSV කියන්නේ සරල text file එකක්. කියවන්න ලේසියි, ඕනෙම tool එකකට විවෘත කරන්න පුළුවන්. ඒත් ලොකු data වලට ප්‍රශ්න ගොඩයි: හැම අංකයක්ම text විදිහට ගබඩා කරලා (ලොකුයි), types නෑ (date එකක්ද string එකක්ද කියලා කියවන කෙනා අනුමාන කරන්න ඕනේ), එක column එකක් විතරක් ඕනේ වුණත් මුළු file එකම කියවන්න ඕනේ.',
        'Parquet කියන්නේ columnar format එකක්. Data ගබඩා කරන්නේ row එකින් row නෙවෙයි, column එකින් column. ඒ නිසා: (1) Column pruning: "amount" සහ "district" විතරක් ඕනේ නම් ඒ columns දෙක විතරයි disk එකෙන් කියවන්නේ. (2) Compression: එකම වර්ගයේ අගයන් ළඟින් තියෙන නිසා snappy, zstd වගේ compression හොඳට වැඩ කරනවා, file එක CSV එකට වඩා ගොඩක් පොඩියි. (3) Types (schema) file එක ඇතුළේම තියෙනවා.',
        '(4) Predicate pushdown: Parquet file එක row groups වලට කඩලා, හැම row group එකකම හැම column එකේම min / max වගේ statistics ගබඩා කරලා තියෙනවා. ඔයා "year == 2025 rows විතරක්" කියලා filter එක read එකටම දුන්නොත්, min/max බලලා 2025 නැති row groups මුළුමනින්ම මඟහරිනවා. Filter එක කියවන තැනටම "තල්ලු කරනවා" (push down). ORC කියන්නේ Hadoop / Hive ලෝකයෙන් ආපු ඒ වගේම columnar format එකක්, cuDF එකට කියවන්න පුළුවන්.',
        'Apache Arrow කියන්නේ disk format එකක් නෙවෙයි, memory එක ඇතුළේ columnar data තියාගන්න සම්මතයක්. pandas (pyarrow backend), Polars, Spark, cuDF වගේ tools Arrow-style layout එකක් පාවිච්චි කරන නිසා, ඒ අතර data එක rows වලට convert නොකර, බොහෝ විට copy නොකර (zero-copy) දෙන්න පුළුවන්. cuDF එකේ GPU memory layout එකත් Arrow columnar format එකට ගැළපෙන විදිහට හදලා තියෙනවා. cudf.DataFrame.from_arrow() / .to_arrow() වලින් Arrow tables එක්ක වැඩ කරන්න පුළුවන් (මේක CPU-GPU copy එකක්).',
      ],
      analogy: 'CSV කියන්නේ A/L results ලියපු ලොකු රෙජිස්ටරයක්. "ගණිතය ලකුණු විතරක්" ඕනේ වුණත් හැම පිටුවක්ම පෙරළන්න ඕනේ. Parquet කියන්නේ විෂයයට වෙන වෙනම file. ගණිතය file එක විතරක් ගන්නවා (column pruning). File එකේ කවරේ "මේකේ ලකුණු 40-75 අතර" කියලා ලියලා තියෙනවා, ඔයා හොයන්නේ 90ට වැඩි අය නම් ඒ file එක ඇරලාවත් බලන්නේ නෑ (predicate pushdown).',
      example: 'Sales rows මිලියන 50ක් (columns 20). CSV = GB 6ක් පමණ. එකම data එක Parquet (snappy) = GB 1-1.5ක් වගේ (data එක අනුව වෙනස්). "2025 Colombo district amount එකතුව" query එකට CSV එකෙන් GB 6ම කියවලා parse කරන්න ඕනේ. Parquet එකෙන් columns 3ක් විතරක්, ඒකෙත් 2025 row groups විතරක්. ඒ නිසා කියවන data ප්‍රමාණය දස ගුණයකටත් වඩා අඩු වෙන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `import cudf

# CSV එක එක පාරක් Parquet වලට convert කරලා තියාගන්න
gdf = cudf.read_csv("sales.csv", parse_dates=["date"])
gdf.to_parquet("sales.parquet", compression="snappy")

# කියවද්දී: ඕනේ columns විතරයි + filter එක read එකටම (pushdown)
gdf = cudf.read_parquet(
    "sales.parquet",
    columns=["date", "district", "amount"],
    filters=[("district", "==", "Colombo")],
)
tbl = gdf.to_arrow()   # Arrow table එකක් (GPU → CPU copy එකක්)`,
      },
      keyPoints: [
        'CSV = text, types නෑ, මුළු file එකම කියවන්න ඕනේ.',
        'Parquet = columnar + compression + schema + predicate pushdown.',
        'ORC = Hive ලෝකයේ columnar format එක. Arrow = memory එක ඇතුළේ columnar සම්මතය.',
        'GPU pipelines වලට Parquet හොඳම default එක.',
      ],
      terms: [
        { en: 'Columnar Format', si: 'Data column එකින් column ගබඩා කරන ක්‍රමය. Analytics වලට වේගවත්.' },
        { en: 'Column Pruning', si: 'ඕනේ columns විතරක් කියවලා අනිත් ඒවා මඟහරින එක.' },
        { en: 'Predicate Pushdown', si: 'Filter එක file කියවන තැනටම යවලා, ගැළපෙන්නේ නැති කොටස් කියවන්නේ නැතුව ඉන්න එක.' },
        { en: 'Row Group', si: 'Parquet file එකක rows කොටසක්. ඒකට min/max statistics තියෙනවා.' },
        { en: 'ORC', si: 'Optimized Row Columnar. Hadoop / Hive වල ජනප්‍රිය columnar file format එක.' },
        { en: 'Apache Arrow', si: 'Memory එක ඇතුළේ columnar data සඳහා language-independent සම්මතය.' },
      ],
    },
    {
      id: 'dask-multi-gpu-etl',
      title: 'GPU ETL with Dask: dask-cudf, Partitions, Lazy Evaluation, LocalCUDACluster',
      body: [
        'ETL කියන්නේ Extract (data ගන්න), Transform (clean කරන්න, join කරන්න, features හදන්න), Load (ප්‍රතිඵලය ගබඩා කරන්න). Data එක එක GPU එකක memory එකට වඩා ලොකු නම්, හෝ GPUs කීපයක් තියෙනවා නම්, Dask පාවිච්චි කරනවා. Dask කියන්නේ Python වැඩ කොටස් වලට කඩලා workers ගොඩක් අතර බෙදන library එකක්.',
        'Dask DataFrame එකක් කියන්නේ පොඩි DataFrames (partitions) ගොඩක එකතුවක්. dask-cudf එකේදී හැම partition එකක්ම cuDF DataFrame එකක්. ඒ නිසා partition එකක් GPU memory එකට ඇතුළු වෙන්න පුළුවන් ප්‍රමාණයක් වෙන්න ඕනේ. Partitions ගොඩක් පොඩි නම් scheduling overhead වැඩියි, ගොඩක් ලොකු නම් memory එක පිරෙනවා. groupby එකක් හෝ join එකක් වගේ, partitions අතර data මාරු කරන්න ඕනේ "shuffle" operations තමයි මිලම.',
        'Dask lazy. ඔයා ddf[ddf.amount > 0].groupby(...).sum() ලිව්වාම කිසිම ගණනයක් වෙන්නේ නෑ. Dask කරන්නේ "task graph" එකක් (කරන්න ඕනේ වැඩ ලැයිස්තුවක්) හදන එක විතරයි. .compute() කිව්වාම තමයි ඇත්තටම run වෙලා ප්‍රතිඵලය (cuDF object එකක් විදිහට) එන්නේ. .persist() කිව්වොත් ප්‍රතිඵලය workers ලාගේ GPU memory එකේම තියාගන්නවා, ආයෙත් ආයෙත් පාවිච්චි කරන්න. Lazy නිසා Dask එකට මුළු plan එකම බලලා optimize කරන්න පුළුවන් (උදා: ඕනේ columns විතරක් කියවන එක).',
        'GPUs කීපයක් තියෙන machine එකක: dask_cuda එකේ LocalCUDACluster() එකෙන් GPU එකකට worker කෙනෙක් ගානේ හදනවා. ඊට පස්සේ Client(cluster). Nodes කීපයක් නම් dask-scheduler / dask-cuda-worker වගේ විධාන වලින් cluster එකක් හදනවා. Dask dashboard එකෙන් (සාමාන්‍යයෙන් port 8787) workers වැඩ කරන හැටි live බලන්න පුළුවන්. සටහන: අලුත් Dask versions වල dask.dataframe එකට cuDF "backend" එකක් විදිහටත් පාවිච්චි කරන්න පුළුවන්. APIs versions අනුව වෙනස් වෙන නිසා docs බලන්න.',
      ],
      analogy: 'Vesak dansal එකකට බත් පැකට් 40,000ක් හදන්න ඕනේ. එක කුස්සියකට (එක GPU) බෑ. Dask කියන්නේ සංවිධායකයා. වැඩේ කොටස් (partitions) වලට කඩලා කුස්සි හතරකට (GPUs 4) බෙදනවා. මුලින්ම ඔහු ලියාගන්නේ සැලැස්ම විතරයි (lazy task graph). "හරි, පටන් ගන්න" (compute) කිව්වාම තමයි ඔක්කොම උයන්න පටන් ගන්නේ. කුස්සි අතර බඩු හුවමාරු කරන එක (shuffle) තමයි වැඩිපුරම කාලය කන්නේ.',
      example: 'Sri Lanka Railway ticket data GB 100ක් Parquet files 400ක. GPUs 4ක් (හැම එකකටම GB 24). dask_cudf.read_parquet("tickets/*.parquet") = partitions 400ක්. ddf.groupby("station")["fare"].sum() ලිව්වාම මුකුත් run වෙන්නේ නෑ. .compute() කිව්වාම GPU 4ම එකවර partitions 100 ගානේ කියවලා partial sums හදලා, අන්තිමට එකතු කරනවා. ප්‍රතිඵලය = stations 400ක පොඩි cuDF DataFrame එකක්.',
      code: {
        lang: 'python',
        src: `from dask_cuda import LocalCUDACluster
from dask.distributed import Client
import dask_cudf

cluster = LocalCUDACluster()          # GPU එකකට worker කෙනෙක්
client = Client(cluster)               # dashboard: client.dashboard_link

ddf = dask_cudf.read_parquet("tickets/*.parquet")   # lazy, partitions ගොඩක්
print(ddf.npartitions)

clean = ddf[ddf["fare"] > 0].persist()               # GPU memory එකේ තියාගන්න
totals = clean.groupby("station")["fare"].sum()      # තාම lazy (task graph)
result = totals.compute()                            # දැන් තමයි run වෙන්නේ`,
      },
      keyPoints: [
        'Dask = වැඩ partitions වලට කඩලා workers / GPUs අතර බෙදනවා.',
        'dask-cudf partition එකක් = cuDF DataFrame එකක්.',
        'Lazy: task graph එක හැදෙනවා, .compute() / .persist() වලදී run වෙනවා.',
        'LocalCUDACluster = එක machine එකේ GPU එකකට worker කෙනෙක්. Shuffles මිලයි.',
      ],
      terms: [
        { en: 'ETL', si: 'Extract, Transform, Load. Data ගන්න, හදන්න, ගබඩා කරන්න කියන pipeline එක.' },
        { en: 'Dask', si: 'Python වැඩ cores, GPUs, machines ගොඩක් අතර බෙදන parallel computing library එක.' },
        { en: 'dask-cudf', si: 'Partitions cuDF DataFrames වෙන Dask DataFrame එක.' },
        { en: 'Partition', si: 'ලොකු DataFrame එකක පොඩි කොටසක්. Worker කෙනෙක් එක පාරකට වැඩ කරන්නේ එකක් එක්ක.' },
        { en: 'Lazy Evaluation', si: 'ප්‍රතිඵලය ඉල්ලන තුරු ගණනය නොකර සැලැස්ම විතරක් හදාගන්න එක.' },
        { en: 'Task Graph', si: 'කරන්න ඕනේ පියවර සහ ඒවා අතර සම්බන්ධතා පෙන්නන Dask සැලැස්ම.' },
        { en: 'LocalCUDACluster', si: 'dask-cuda වලින්, එක machine එකක හැම GPU එකකටම Dask worker කෙනෙක් හදන class එක.' },
        { en: 'Shuffle', si: 'Partitions අතර data නැවත බෙදීම (groupby, join, sort වලදී). Network / memory වියදම වැඩියි.' },
      ],
    },
    {
      id: 'spark-rapids-accelerator',
      title: 'GPU ETL with Apache Spark: RAPIDS Accelerator for Apache Spark',
      body: [
        'ලොකු බැංකු, telcos, e-commerce companies බොහොමයක් දැනටමත් Apache Spark පාවිච්චි කරනවා. Spark කියන්නේ machines සිය ගණනක cluster එකක් පුරා SQL සහ DataFrame jobs run කරන platform එකක් (PySpark, Scala, SQL). එයාලට Python Dask එකට මාරු වෙන්න ඕනේ නෑ.',
        'RAPIDS Accelerator for Apache Spark කියන්නේ Spark plugin එකක්. Configuration එකට plugin එක දාලා (spark.plugins=com.nvidia.spark.SQLPlugin) GPUs තියෙන cluster එකක run කළාම, Spark එකේ query plan එකේ GPU එකේ කරන්න පුළුවන් කොටස් (scans, filters, joins, aggregations, sorts) GPU එකට මාරු කරනවා. Support නැති කොටස් සාමාන්‍ය විදිහට CPU එකේ run වෙනවා. Job code එක වෙනස් කරන්න ඕනේ නෑ වගේ.',
        'Spark එකේ shuffle (machines අතර data මාරු කිරීම) ලොකු වියදමක්. RAPIDS Accelerator එකට වේගවත් shuffle විකල්ප තියෙනවා. Plan එකේ කොයි කොටස් GPU එකේද කියලා බලන්න explain output එක සහ plugin එකේ "explain" configuration එක පාවිච්චි කරන්න පුළුවන්. Python UDFs (ඔයාම ලියන functions) සාමාන්‍යයෙන් GPU එකට යන්නේ නෑ, ඒ නිසා built-in Spark functions පාවිච්චි කරන්න.',
        'Dask vs Spark තෝරන්නේ කොහොමද? Python team එකක්, pandas / cuDF / cuML ecosystem එක, එක machine එකක් හෝ පොඩි cluster එකක් = Dask. දැනටමත් Spark / Databricks / Hadoop data lake එකක්, SQL ගොඩක්, ලොකු JVM-based cluster = RAPIDS Accelerator for Spark. Speedup එක workload එක මත රඳා පවතිනවා: joins / aggregations වැඩි jobs වලට හොඳයි, පොඩි jobs වලට එච්චර වාසියක් නෑ.',
      ],
      analogy: 'ලොකු ඇඟලුම් කම්හලක (Spark cluster) මැෂින් සිය ගණනක් තියෙනවා. RAPIDS Accelerator කියන්නේ ඒ මැෂින් වලට සවි කරන turbo motor එකක් වගේ. සේවකයෝ (code) පුරුදු විදිහටම වැඩ කරනවා. Motor එක ගැළපෙන වැඩ (කැපීම, මැසීම) වේගවත් වෙනවා. ගැළපෙන්නේ නැති අතින් කරන වැඩ (UDFs) පරණ වේගයෙන්ම යනවා.',
      example: 'Card transactions බිලියන 2ක Spark ETL job එකක් CPU nodes 20ක පැය 3ක් ගන්නවා. GPU nodes වල plugin එක on කරලා run කළාම query plan එකේ joins සහ aggregations GPU එකට ගියා. Job එක වේගවත් වෙනවා, සමහරවිට cluster එකේ මිලත් අඩු වෙනවා. ඒත් එක custom Python UDF එකක් CPU එකේ තිබ්බ නිසා ඒ කොටස bottleneck එකක් වුණා. ඒක built-in functions වලින් ලිව්වාම ඒ කොටසත් GPU එකට ගියා.',
      code: {
        lang: 'python',
        src: `from pyspark.sql import SparkSession, functions as F

# RAPIDS Accelerator plugin jar එක cluster එකේ install කරලා තියෙන්න ඕනේ
spark = (SparkSession.builder
         .config("spark.plugins", "com.nvidia.spark.SQLPlugin")
         .config("spark.rapids.sql.enabled", "true")   # GPU SQL on
         .getOrCreate())

df = spark.read.parquet("s3://bank/txns/")          # job code එක සාමාන්‍ය Spark
daily = df.groupBy("branch", "date").agg(F.sum("amount").alias("total"))
daily.explain()          # plan එකේ GPU operators (Gpu...) පේනවද බලන්න
daily.write.parquet("s3://bank/daily/")`,
      },
      keyPoints: [
        'RAPIDS Accelerator for Apache Spark = Spark plugin එකක්, code වෙනස් කරන්න ඕනේ නැති තරම්.',
        'Support කරන SQL / DataFrame operations GPU එකේ, අනිත් ඒවා CPU එකේ.',
        'Python UDFs සාමාන්‍යයෙන් GPU එකට යන්නේ නෑ, built-in functions පාවිච්චි කරන්න.',
        'Python ecosystem = Dask. දැනටමත් Spark / data lake = Spark plugin.',
      ],
      terms: [
        { en: 'Apache Spark', si: 'Machines ගොඩක cluster එකක ලොකු data SQL / DataFrame jobs run කරන platform එක.' },
        { en: 'RAPIDS Accelerator for Apache Spark', si: 'Spark SQL / DataFrame operations GPU එකේ run කරන NVIDIA plugin එක.' },
        { en: 'Query Plan', si: 'Spark එක query එකක් run කරන්න හදන පියවර සැලැස්ම. explain() එකෙන් බලන්න පුළුවන්.' },
        { en: 'UDF', si: 'User Defined Function. ඔයාම ලියන function එකක්. Optimize කරන්න අමාරුයි.' },
      ],
    },
    {
      id: 'gpu-feature-engineering-imbalance',
      title: 'Feature Engineering on GPU and Handling Class Imbalance',
      body: [
        'Feature engineering කියන්නේ raw data වලින් model එකට තේරෙන, ප්‍රයෝජනවත් columns හදන එක (Phase 1 encoding / scaling topics මතක් කරගන්න). GPU එකේදී මේවා හැම එකක්ම cuDF එකේ vectorized operations: datetime වලින් hour, day of week, month (.dt); groupby aggregations (customer එකකගේ සාමාන්‍ය බිල, transactions ගණන) හදලා merge කරන එක; lag features (groupby + shift); one-hot encoding (cudf.get_dummies); string cleaning (.str.lower, .str.contains). cuML එකේ scalers, encoders, TargetEncoder වගේ preprocessing tools තියෙනවා.',
        'Target encoding (category එකක් ඒ category එකේ target සාමාන්‍යයෙන් replace කරන එක) බලවත්, ඒත් leakage අවදානම වැඩියි. Train folds වලින් විතරක් ගණනය කරන්න, test data එකේ target එක කවදාවත් ඇතුළු වෙන්න දෙන්න එපා. Time-based features වලදීත් prediction එක කරන මොහොතට පස්සේ data පාවිච්චි කරන්න එපා.',
        'Class imbalance කියන්නේ එක class එකක් ගොඩක් දුර්ලභ වෙන එක. උදා: fraud transactions 0.5%. Model එකට "හැමදේම fraud නෑ" කිව්වාම 99.5% accuracy! ඒත් එක fraud එකක්වත් අල්ලන්නේ නෑ. විසඳුම්: (1) Stratified split / CV (හැම fold එකකම එකම අනුපාතය). (2) Class weights: දුර්ලභ class එකේ වැරදි වලට ලොකු දඬුවමක්. XGBoost එකේ scale_pos_weight, සාමාන්‍යයෙන් negatives ගණන ÷ positives ගණන වගේ අගයකින් පටන් ගන්නවා. (3) Resampling: majority class එක undersample, minority එක oversample, හෝ SMOTE වගේ synthetic samples. Resampling කරන්නේ training data එකට විතරයි.',
        '(4) හරි metrics: accuracy වෙනුවට precision, recall, F1, PR-AUC. (5) Threshold tuning: 0.5 default එක වෙනුවට business එකට ගැළපෙන threshold එකක් validation data එකෙන් තෝරන්න. GPU එකේ වාසිය: features දහස් ගණනක්, combinations ගොඩක් ඉක්මනින් try කරන්න පුළුවන්. ඒක තමයි ඇත්ත කාර්යක්ෂමතාව, data scientist ගේ iteration speed එක.',
      ],
      analogy: 'Class imbalance = Cricket match එකක balls 600න් wickets 3යි. "හැම ball එකකම wicket එකක් නෑ" කියලා අනාවැකි කියන කෙනාට 99.5% හරි. ඒත් එයා කිසිම wicket එකක් අනාවැකි කිව්වේ නෑ. Selector කෙනෙක්ට ඕනේ wickets අල්ලන bowler ව හොයන්න. ඒ නිසා බලන්නේ wickets කීයක් ගත්තද (recall), ගත්ත ඒවා ඇත්තද (precision) කියන එක.',
      example: 'බැංකුවක transactions මිලියන 10ක්, fraud 50,000 (0.5%). Negatives 9,950,000 ÷ positives 50,000 = 199. ඉතින් XGBoost scale_pos_weight=199 කින් පටන් අරන් tune කරනවා. Features: customer එකකගේ පැය 24 transactions ගණන (groupby + rolling), සාමාන්‍ය amount එකෙන් දැන් amount එක කී ගුණයක්ද, රෑ 12-4 අතරද. Recall 0.85 සහ precision 0.40 ලැබෙන threshold එක තෝරනවා (අංක උදාහරණ විතරයි).',
      code: {
        lang: 'python',
        src: `import cudf

tx = cudf.read_parquet("txns.parquet")
tx["hour"] = tx["ts"].dt.hour                          # datetime feature
tx["is_night"] = (tx["hour"] < 5).astype("int8")
stats = tx.groupby("card_id").agg({"amount": ["mean", "count"]})
stats.columns = ["card_avg", "card_cnt"]               # customer aggregates
tx = tx.merge(stats, left_on="card_id", right_index=True, how="left")
tx["amt_ratio"] = tx["amount"] / tx["card_avg"]        # සාමාන්‍යයට වඩා කී ගුණයක්ද
tx = tx.sort_values(["card_id", "ts"])
tx["prev_amt"] = tx.groupby("card_id")["amount"].shift(1)  # lag feature

pos = int(tx["is_fraud"].sum()); neg = len(tx) - pos
print("scale_pos_weight ආරම්භක අගය:", neg / pos)`,
      },
      keyPoints: [
        'GPU feature engineering = cuDF vectorized ops: .dt, groupby + merge, shift, get_dummies, .str.',
        'Target encoding / time features වලදී leakage ගැන ප්‍රවේසම් වෙන්න.',
        'Imbalance: stratified split, class weights (scale_pos_weight), resampling (train එකට විතරයි).',
        'Accuracy වෙනුවට precision / recall / F1 / PR-AUC, සහ threshold tuning.',
      ],
      terms: [
        { en: 'Feature Engineering', si: 'Raw data වලින් model එකට ප්‍රයෝජනවත් අලුත් columns හදන එක.' },
        { en: 'Target Encoding', si: 'Category එකක් ඒ category එකේ target සාමාන්‍යයෙන් replace කරන එක. Leakage අවදානම.' },
        { en: 'Class Imbalance', si: 'එක class එකක samples අනිත් ඒවාට වඩා ගොඩක් අඩු වීම.' },
        { en: 'scale_pos_weight', si: 'XGBoost එකේ positive class එකට දෙන බර. Imbalance වලට.' },
        { en: 'SMOTE', si: 'Minority class එකේ samples අතර අලුත් synthetic samples හදන oversampling ක්‍රමය.' },
        { en: 'Undersampling / Oversampling', si: 'Majority class එක අඩු කරන එක / minority class එක වැඩි කරන එක.' },
      ],
    },
    {
      id: 'cuml-and-gpu-xgboost',
      title: 'Machine Learning with RAPIDS: cuML Estimators and XGBoost on GPU',
      body: [
        'cuML කියන්නේ RAPIDS එකේ GPU machine learning library එක. API එක scikit-learn වගේමයි: estimator එකක් හදනවා, .fit(X, y), .predict(X), .predict_proba(X), .transform(X). cuML එකේ තියෙන algorithms අතරින් සමහරක්: LinearRegression, LogisticRegression, Ridge, Lasso, RandomForestClassifier / Regressor, KMeans, DBSCAN, HDBSCAN, NearestNeighbors, PCA, TruncatedSVD, UMAP, t-SNE, SVC. Inputs විදිහට cuDF, CuPy, NumPy, pandas පිළිගන්නවා (NumPy / pandas දුන්නොත් GPU එකට copy වෙනවා).',
        'Output type එක ගැන සැලකිලිමත් වෙන්න: cuML සාමාන්‍යයෙන් input එකේ වර්ගයටම ගැළපෙන output එකක් දෙනවා (cuDF දුන්නොත් cuDF). Accuracy වගේ results scikit-learn එකට හරියටම bit-for-bit සමාන නොවෙන්න පුළුවන්, algorithm implementations ටිකක් වෙනස් නිසා (උදා: cuML random forest එක splits හොයන්නේ histogram / bins වලින්). ඒත් ගුණාත්මක භාවය සමානයි. ලොකු data වලදී training එක දස ගුණයකටත් වඩා වේගවත් වෙන්න පුළුවන්.',
        'Tabular data වලට ගොඩක් වෙලාවට හොඳම model එක gradient boosted trees. XGBoost GPU එකේ run කරන්න XGBoost 2.0 සිට device="cuda" දෙනවා, tree_method="hist" (පරණ versions වල tree_method="gpu_hist"). XGBoost එකට cuDF DataFrames කෙලින්ම දෙන්න පුළුවන්, data GPU එකේම තියෙනවා. LightGBM, CatBoost වලටත් GPU modes තියෙනවා. XGBoost එක Dask එක්ක multi-GPU training වලටත් පාවිච්චි කරන්න පුළුවන්.',
        'Training වලින් පස්සේ ලොකු tree models GPU එකේ ඉක්මනින් predict කරන්න cuML Forest Inference Library (FIL) එක තියෙනවා. Triton Inference Server එකේ FIL backend එකෙන් XGBoost / LightGBM / random forest models serve කරන්නත් පුළුවන් (Phase 9). Scikit-learn code එක වෙනස් නොකර accelerate කරන්න අලුත් cuML versions වල cuml.accel mode එකකුත් තියෙනවා (cudf.pandas වගේ, support නැති දේට CPU fallback).',
      ],
      analogy: 'scikit-learn සහ cuML කියන්නේ එකම menu එක තියෙන කඩ දෙකක් වගේ. "Random forest එකක් දෙන්න" කිව්වාම දෙකෙන්ම ලැබෙනවා. ඒත් cuML කඩේ කුස්සියේ උයන අය 5,000ක් ඉන්නවා, ලොකු order එකක් ඉක්මනින් එනවා. රසය පොඩ්ඩක් වෙනස් වෙන්න පුළුවන් (bit-for-bit එකම නෑ), ඒත් කෑම එකම වර්ගයයි.',
      example: 'Rows මිලියන 20ක, features 40ක loan default dataset එකක්. scikit-learn RandomForest CPU එකේ (cores 16) විනාඩි 30ක් ගත්තොත්, cuML RandomForest GPU එකේ විනාඩි 1-2ක් ගන්න පුළුවන් (hardware අනුව වෙනස්). XGBoost device="cuda" එකත් CPU hist එකට වඩා කිහිප ගුණයකින් වේගවත් වෙන්න පුළුවන්. ඒ ඉතුරු වෙන කාලය තමයි ඔයාට experiments 10ක් වෙනුවට 100ක් කරන්න දෙන්නේ.',
      code: {
        lang: 'python',
        src: `import cudf, xgboost as xgb
from cuml.model_selection import train_test_split
from cuml.ensemble import RandomForestClassifier
from cuml.metrics import accuracy_score

df = cudf.read_parquet("loans.parquet")
X, y = df.drop(columns="default").astype("float32"), df["default"].astype("int32")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=200, max_depth=12)   # sklearn වගේමයි
rf.fit(X_tr, y_tr)
print("RF acc:", accuracy_score(y_te, rf.predict(X_te)))

xgbm = xgb.XGBClassifier(device="cuda", tree_method="hist", n_estimators=500)
xgbm.fit(X_tr, y_tr)                 # cuDF data කෙලින්ම, GPU එකේ boosting`,
      },
      keyPoints: [
        'cuML = scikit-learn වගේ API (fit / predict / transform), GPU එකේ.',
        'Results sklearn එකට bit-for-bit සමාන නොවෙන්න පුළුවන්, ගුණාත්මක භාවය සමානයි.',
        'XGBoost GPU: device="cuda", tree_method="hist" (2.0+). cuDF කෙලින්ම දෙන්න පුළුවන්.',
        'FIL = tree models වේගවත් inference. cuml.accel = sklearn zero-code-change.',
      ],
      terms: [
        { en: 'cuML', si: 'scikit-learn වගේ API එකක් තියෙන RAPIDS GPU ML library එක.' },
        { en: 'Estimator', si: 'fit() එකෙන් data වලින් ඉගෙන ගන්න object එක (model එකක් හෝ transformer එකක්).' },
        { en: 'XGBoost', si: 'ජනප්‍රිය gradient boosted trees library එක. device="cuda" එකෙන් GPU training.' },
        { en: 'FIL (Forest Inference Library)', si: 'Tree ensemble models GPU එකේ වේගයෙන් predict කරන cuML component එක.' },
        { en: 'UMAP / t-SNE', si: 'High-dimensional data 2D / 3D වලට අඩු කරලා පෙන්නන ක්‍රම. cuML එකේ GPU versions තියෙනවා.' },
      ],
    },
    {
      id: 'hpo-cross-validation-metrics',
      title: 'Hyperparameter Tuning (Optuna / HPO on GPU), Cross-Validation, and Evaluation Metrics',
      body: [
        'Hyperparameters කියන්නේ training එකට කලින් ඔයා තෝරන settings: trees ගණන, max_depth, learning_rate වගේ. හොඳම combination එක හොයන්න: grid search (හැම combination එකක්ම, ලොකු ගණනක්), random search (random combinations, බොහෝ විට ඉක්මනින් හොඳ ප්‍රතිඵල), Bayesian / TPE වගේ smart search (කලින් trials වලින් ඉගෙන අරන් ඊළඟට try කරන්න හොඳ තැන අනුමාන කරනවා). Optuna කියන්නේ මේ smart search එක ලේසියෙන් කරන ජනප්‍රිය library එකක්. Hopeless trials ඉක්මනින් නවත්තන (pruning) පහසුකමත් තියෙනවා.',
        'HPO (hyperparameter optimization) එකට GPU එක ලොකු වාසියක්. Trial එකක් CPU එකේ විනාඩි 10ක් නම් trials 100ක් = පැය 16ක් වගේ. GPU එකේ trial එකක් විනාඩි 1ක් නම් පැය 2යි. GPUs කීපයක් තියෙනවා නම් Dask හෝ Ray Tune වගේ tools වලින් trials parallel කරන්නත් පුළුවන්. Data එක එක පාරක් GPU එකට load කරලා හැම trial එකකම ඒකම පාවිච්චි කරන්න.',
        'Cross-validation (k-fold) කියන්නේ data එක කොටස් k වලට (උදා: 5) කඩලා, එක පාරකට එක කොටසක් validation, අනිත් ඒවා training, එහෙම k පාරක් කරලා සාමාන්‍ය score එක ගන්න එක. එක split එකකට වඩා විශ්වාසදායකයි. Imbalanced data = StratifiedKFold. Time series = TimeSeriesSplit වගේ (අනාගතයෙන් train කරන්නේ නෑ). එකම customer ගේ rows ගොඩක් = GroupKFold. HPO එක කරන්නේ validation / CV score එකට. අන්තිම test set එක ඔක්කොම ඉවර වෙලා එක පාරක් විතරයි.',
        'Metrics: Classification = accuracy (balanced data වලට විතරක්), precision (මම "ඔව්" කිව්ව ඒවායින් කීයක් ඇත්තද), recall (ඇත්ත "ඔව්" වලින් කීයක් මම අල්ලගත්තද), F1 (දෙකේ සමතුලිතය), ROC-AUC, PR-AUC (imbalance වලට හොඳයි), log loss. Regression = MAE (සාමාන්‍ය වැරැද්ද, තේරුම් ගන්න ලේසියි), RMSE (ලොකු වැරදි වලට වැඩි දඬුවමක්), R² (variance එකෙන් කොච්චර පැහැදිලි කරනවද). Clustering = silhouette score වගේ. cuML.metrics එකේ මේවායින් ගොඩක් GPU එකේ ගණනය කරන්න පුළුවන්.',
      ],
      analogy: 'Hyperparameter tuning = කොත්තු රසම කරන්න recipe එක tune කරනවා වගේ. මිරිස් කොච්චරද, ලුණු කොච්චරද, ගිනි කොච්චරද. හැම combination එකක්ම උයලා බලනවා නම් (grid) දවස් ගණනක් යනවා. Optuna = පළපුරුදු කෝකියෙක්: "කලින් පාර මිරිස් වැඩියි වගේ, ඊළඟට අඩු කරලා බලමු." Cross-validation = එක කෙනෙක්ට විතරක් නෙවෙයි, පස් දෙනෙක්ට කන්න දීලා සාමාන්‍ය අදහස ගන්න එක.',
      example: 'XGBoost එකට max_depth (3-12), learning_rate (0.01-0.3), n_estimators (100-1000) Optuna trials 60ක් 5-fold CV එක්ක. CPU එකේ හැම trial එකක්ම folds 5 × විනාඩි 2 = විනාඩි 10, ඔක්කොම පැය 10ක්. GPU එකේ fold එකක් තත්පර 15ක් නම් trial එකක් විනාඩි 1.25, ඔක්කොම පැයකට වඩා අඩුයි. හොඳම trial එක: max_depth 7, learning_rate 0.05, CV PR-AUC 0.61. ඊට පස්සේ test set එකේ එක පාරක්: 0.59.',
      code: {
        lang: 'python',
        src: `import optuna, xgboost as xgb
from sklearn.model_selection import StratifiedKFold, cross_val_score

def objective(trial):
    params = dict(
        max_depth=trial.suggest_int("max_depth", 3, 12),
        learning_rate=trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        n_estimators=trial.suggest_int("n_estimators", 100, 1000),
        device="cuda", tree_method="hist")          # හැම trial එකක්ම GPU එකේ
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    return cross_val_score(xgb.XGBClassifier(**params), X_tr, y_tr,
                           cv=cv, scoring="average_precision").mean()  # PR-AUC

study = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=42))
study.optimize(objective, n_trials=60)
print(study.best_params)   # test set එක අන්තිමට එක පාරක් විතරයි`,
      },
      keyPoints: [
        'Grid = හැමදේම, Random = ඉක්මන්, Optuna / TPE = කලින් trials වලින් ඉගෙන ගන්නවා.',
        'GPU එක HPO වල trials ගණන කිහිප ගුණයකින් වැඩි කරන්න ඉඩ දෙනවා.',
        'k-fold CV: imbalance = stratified, time = time-based, groups = GroupKFold.',
        'Metric එක ප්‍රශ්නයට ගැළපෙන්න ඕනේ: imbalance වලට PR-AUC / F1, regression වලට MAE / RMSE.',
      ],
      terms: [
        { en: 'Hyperparameter', si: 'Training එකට කලින් ඔයා තෝරන setting එකක් (data වලින් ඉගෙන ගන්නේ නෑ).' },
        { en: 'HPO', si: 'Hyperparameter Optimization. හොඳම hyperparameters ස්වයංක්‍රීයව හොයන එක.' },
        { en: 'Optuna', si: 'TPE වගේ smart search සහ pruning තියෙන Python HPO library එක.' },
        { en: 'k-fold Cross-Validation', si: 'Data k කොටසකට කඩලා k පාරක් train / validate කරලා සාමාන්‍ය score එක ගන්න ක්‍රමය.' },
        { en: 'Precision / Recall', si: '"ඔව්" කිව්ව ඒවායින් ඇත්ත ප්‍රමාණය / ඇත්ත "ඔව්" වලින් අල්ලගත්ත ප්‍රමාණය.' },
        { en: 'PR-AUC', si: 'Precision-Recall curve එක යට වර්ගඵලය. Imbalanced data වලට හොඳ metric එකක්.' },
        { en: 'MAE / RMSE', si: 'Regression වැරදි වල සාමාන්‍යය / ලොකු වැරදි වලට වැඩි බරක් දෙන වැරදි මිනුම.' },
      ],
    },
    {
      id: 'eda-hypothesis-visualization',
      title: 'Descriptive Analysis: EDA, Hypothesis Testing Basics, and Choosing the Right Plot',
      body: [
        'EDA (Exploratory Data Analysis) කියන්නේ model එකක් හදන්න කලින් data එක එක්ක "අඳුනගන්න" කරන වැඩේ (Phase 1 EDA topic එකේ මූලික දේ තියෙනවා). describe() (mean, median, min, max, std), missing values ගණන, unique values, value_counts, correlations, outliers. GPU එකේ cuDF වලින් මේ හැමදේම rows මිලියන ගණනක් මත තත්පර වලින් කරන්න පුළුවන්. ඒ නිසා sample එකක් නෙවෙයි, මුළු data එකම බලන්න පුළුවන්.',
        'Hypothesis testing කියන්නේ "මේ වෙනස ඇත්තද, නැත්නම් අහම්බෙන්ද?" කියලා අහන ක්‍රමය. Null hypothesis (H0) = "වෙනසක් නෑ". p-value = H0 ඇත්ත නම්, අපි දැක්ක තරම් හෝ ඊට වඩා ලොකු වෙනසක් අහම්බෙන් දකින්න තියෙන සම්භාවිතාව. p-value එක 0.05ට අඩු නම් සාමාන්‍යයෙන් "statistically significant" කියනවා. වැදගත්: p-value එක "H0 ඇත්ත වෙන්න තියෙන සම්භාවිතාව" නෙවෙයි. Significant කියන්නේ ලොකු / වැදගත් කියන එකත් නෙවෙයි. Data ගොඩක් තියෙනකොට ඉතාම පොඩි වෙනස්කම් පවා significant වෙනවා, ඒ නිසා effect size එකත් බලන්න.',
        'පොදු tests: t-test = කණ්ඩායම් දෙකක සාමාන්‍ය අගයන් සසඳන්න (උදා: A/B test එකක අලුත් page එකේ සාමාන්‍ය බිල). Chi-square test = categories දෙකක් අතර සම්බන්ධයක් තියෙනවද (උදා: district සහ payment method). Correlation test = numeric දෙකක් එකට වෙනස් වෙනවද. Correlation ≠ causation: අයිස්ක්‍රීම් විකුණුම් සහ ගංවතුර දෙකම වැඩි වෙන්නේ වැසි / කාලගුණය නිසා වෙන්න පුළුවන්.',
        'Plot එක තෝරන්නේ ප්‍රශ්නයට අනුවයි: කාලයත් එක්ක වෙනස = line chart. Categories සසඳන්න = bar chart. එක numeric එකක distribution එක = histogram හෝ box plot. Numeric දෙකක් අතර සම්බන්ධය = scatter plot (points මිලියන ගණනක් නම් hexbin / density). Variables ගොඩක correlations = heatmap. කොටස් වලින් මුළුවට = stacked bar (pie chart කොටස් 2-3කට විතරයි). GPU-accelerated viz: rows මිලියන ගණනක් browser එකට යවන්න බෑ. Datashader (data එක pixels වලට aggregate කරනවා, cuDF support), hvPlot / HoloViews, RAPIDS cuxfilter (GPU එකේ cross-filtering dashboards), Plotly Dash. මූලික අදහස: GPU එකේ aggregate කරලා පොඩි ප්‍රතිඵලය විතරක් අඳින්න.',
      ],
      analogy: 'Hypothesis testing = උසාවියක නඩුවක් වගේ. H0 = "චූදිතයා නිර්දෝෂී." සාක්ෂි (data) ගොඩක් ප්‍රබල නම් (p-value පොඩි නම්) H0 ප්‍රතික්ෂේප කරනවා. සාක්ෂි මදි නම් "නිර්දෝෂීයි" කියලා ඔප්පු වුණා නෙවෙයි, "වැරදිකරු බව ඔප්පු කරන්න බැරි වුණා" විතරයි. Plot තෝරන එක = Google Maps එකේ route එකට map view, traffic view, satellite view තෝරනවා වගේ, ප්‍රශ්නය අනුව.',
      example: 'Cargills outlet 200ක A/B test එකක්: outlet 100ක අලුත් shelf layout එක. පරණ layout සාමාන්‍ය බිල Rs. 2,450, අලුත් එක Rs. 2,530. t-test p-value = 0.01 → අහම්බයක් වෙන්න අඩු ඉඩක්. ඒත් effect size එක Rs. 80 (3%ක් වගේ), layout එක මාරු කරන වියදමට වටිනවද කියලා business එක තීරණය කරන්න ඕනේ. EDA එකට: බිල් වල distribution එක = histogram, දවසේ පැය අනුව විකුණුම් = line chart, outlets 200ක සාමාන්‍යය සසඳන්න = sorted bar chart.',
      code: {
        lang: 'python',
        src: `import cudf
from scipy import stats

gdf = cudf.read_parquet("bills.parquet")
print(gdf.describe())                         # EDA, GPU එකේ
print(gdf.isna().sum())                       # missing values
print(gdf["payment"].value_counts())

# A/B test: GPU එකේ filter කරලා, CPU එකට එන්නේ amounts දෙක විතරයි
a = gdf[gdf["layout"] == "old"]["amount"].to_numpy()
b = gdf[gdf["layout"] == "new"]["amount"].to_numpy()
t, p = stats.ttest_ind(a, b, equal_var=False)  # Welch t-test
print(f"p-value = {p:.4f}, වෙනස = {b.mean() - a.mean():.0f} රු.")`,
      },
      keyPoints: [
        'EDA = describe, missing, value_counts, correlations, outliers. GPU එකෙන් මුළු data එකම බලන්න පුළුවන්.',
        'p-value පොඩියි = අහම්බයක් වෙන්න අඩු ඉඩක්. Significant ≠ වැදගත්, effect size බලන්න.',
        't-test = සාමාන්‍ය දෙකක්, chi-square = categories දෙකක්. Correlation ≠ causation.',
        'Plot එක ප්‍රශ්නයට අනුව. ලොකු data = GPU එකේ aggregate කරලා අඳින්න (Datashader, cuxfilter).',
      ],
      terms: [
        { en: 'EDA', si: 'Exploratory Data Analysis. Model එකට කලින් data එක තේරුම් ගන්න කරන විශ්ලේෂණය.' },
        { en: 'Null Hypothesis (H0)', si: '"වෙනසක් / සම්බන්ධයක් නෑ" කියන ආරම්භක උපකල්පනය.' },
        { en: 'p-value', si: 'H0 ඇත්ත නම්, දැක්ක තරම් අන්ත ප්‍රතිඵලයක් අහම්බෙන් ලැබෙන්න තියෙන සම්භාවිතාව.' },
        { en: 'Effect Size', si: 'වෙනස ඇත්තටම කොච්චර ලොකුද කියන එක (significant ද කියන එකට වඩා වෙනස්).' },
        { en: 't-test / Chi-square test', si: 'සාමාන්‍ය දෙකක් සසඳන test එක / categories අතර සම්බන්ධය බලන test එක.' },
        { en: 'Datashader', si: 'මිලියන ගණනක points pixels වලට aggregate කරලා අඳින library එක. cuDF support තියෙනවා.' },
        { en: 'cuxfilter', si: 'GPU එකේ cross-filtering interactive dashboards හදන RAPIDS library එක.' },
      ],
    },
    {
      id: 'time-series-on-gpu',
      title: 'Advanced Data Structures I: Time Series on GPU',
      body: [
        'Time series data කියන්නේ කාලය අනුව පිළිවෙළට තියෙන data (Phase 1 Time Series Basics: trend, seasonality, resample, rolling, shift). ඇත්ත ලෝකයේ ප්‍රශ්නය වෙන්නේ series එකක් නෙවෙයි, series දහස් ගණනක්. උදා: supermarket branches 300 × items 5,000 = series මිලියන 1.5ක්. ඒ හැම එකකටම lag features, rolling averages, forecasts. මෙතන තමයි GPU එක වටින්නේ.',
        'cuDF එකෙන් time series operations: datetime columns (.dt.year, .dt.dayofweek), sort කරලා groupby("series_id") + shift එකෙන් lags, groupby + rolling එකෙන් moving averages, resample එකෙන් පැය data දවසට එකතු කරන එක (resample / rolling support versions අනුව ටිකක් වෙනස්, docs බලන්න). හැම series එකක්ම වෙන වෙනම loop කරන්නේ නැතුව, groupby එකෙන් එකපාර ඔක්කොටම කරන එක තමයි GPU-friendly ක්‍රමය.',
        'Forecasting models: cuML එකේ ARIMA (cuml.tsa) එකට series ගොඩක් එකපාර (batched) fit කරන්න පුළුවන්. ප්‍රායෝගිකව ගොඩක් teams කරන්නේ time series එක tabular ප්‍රශ්නයක් කරලා (lags, rolling stats, calendar features: පෝය දවස්, අවුරුදු, සිංහල හින්දු අලුත් අවුරුද්ද) GPU XGBoost එකකට දෙන එක. Validation එක හැමවිටම කාලය අනුව: පරණ කාලයෙන් train කරලා අලුත් කාලයෙන් test කරන්න. Shuffle කරන්න එපා, නැත්නම් අනාගතය "හොරෙන් බලනවා" (leakage).',
        'Time series වල anomaly detection එකත් ප්‍රයෝජනවත්: rolling mean සහ rolling std එකෙන් අද අගය සාමාන්‍යයෙන් කොච්චර දුරද (z-score) කියලා බලන එක. Sensor data, ATM withdrawals, website traffic වගේ දේවල් වලට.',
      ],
      analogy: 'එක පොල් ගහක අස්වැන්න මාසෙන් මාසෙට ලියන එක එක time series එකක්. කුරුණෑගල පොල් වතු 2,000ක ගස් ලක්ෂ ගණනකට ඒකම කරන්න ඕනේ නම්, එක කෙනෙක් ගහෙන් ගහට යන එක (loop) අවුරුදු ගණනක වැඩක්. GPU groupby = හැම වත්තකටම එකම වෙලාවේ ගණන් කාරයෙක්.',
      example: 'Branches 300, items 2,000, දින 730ක දෛනික sales = rows මිලියන 438ක්. cuDF වලින් (branch, item) අනුව sort කරලා lag_7, lag_14, rolling_28_mean features හදනවා. CPU pandas එකේ විනාඩි ගණනක් ගන්න groupby-rolling එක GPU එකේ ගොඩක් වේගවත් වෙන්න පුළුවන්. ඊට පස්සේ 2025 දෙසැම්බර් දක්වා train, 2026 ජනවාරි test. අවුරුදු සතියේ කැවිලි items වලට විශේෂ "is_avurudu_week" feature එකක්.',
      code: {
        lang: 'python',
        src: `import cudf

s = cudf.read_parquet("daily_sales.parquet")        # branch, item, date, qty
s = s.sort_values(["branch", "item", "date"])
g = s.groupby(["branch", "item"])["qty"]
s["lag_7"] = g.shift(7)                              # සතියකට කලින් අගය
s["dow"] = s["date"].dt.dayofweek                    # සතියේ දවස
s["month"] = s["date"].dt.month

cut = cudf.to_datetime("2026-01-01")                 # කාලය අනුව split, shuffle නෑ
train, test = s[s["date"] < cut], s[s["date"] >= cut]
print(len(train), len(test))`,
      },
      keyPoints: [
        'ඇත්ත ප්‍රශ්නය = series දහස් / මිලියන ගණනක්. GPU groupby එකෙන් එකපාර.',
        'Lags (shift), rolling stats, calendar features (පෝය, අවුරුදු) = tabular forecasting.',
        'cuML ARIMA = series ගොඩක් batched. GPU XGBoost = ප්‍රායෝගික ජනප්‍රිය ක්‍රමය.',
        'Validation හැමවිටම කාලය අනුව. Shuffle = leakage.',
      ],
      terms: [
        { en: 'Time Series', si: 'කාලය අනුව පිළිවෙළට තියෙන data.' },
        { en: 'Lag Feature', si: 'කලින් කාල පරිච්ඡේදයක අගය (උදා: සතියකට කලින් විකුණුම).' },
        { en: 'Rolling Window', si: 'අන්තිම N කාල පරිච්ඡේදයේ සාමාන්‍යය / එකතුව වගේ චලනය වන ගණනය.' },
        { en: 'ARIMA', si: 'කලින් අගයන් සහ කලින් වැරදි වලින් අනාගතය predict කරන සම්ප්‍රදායික time series model එක.' },
        { en: 'Time-based Split', si: 'පරණ data train, අලුත් data test විදිහට කාලය අනුව බෙදන එක.' },
      ],
    },
    {
      id: 'graph-analytics-cugraph',
      title: 'Advanced Data Structures II: Graph Analytics with cuGraph (PageRank, Communities, Shortest Path)',
      body: [
        'Graph එකක් කියන්නේ nodes (vertices) සහ ඒවා අතර සම්බන්ධතා (edges). උදා: Facebook එකේ මිනිස්සු සහ friendships, බැංකු accounts සහ money transfers, bus stops සහ routes, web pages සහ links. Edge එකකට weight එකක් තියෙන්න පුළුවන් (දුර, මුදල). Data එක සාමාන්‍යයෙන් "edge list" එකක් විදිහට එනවා: src, dst, weight columns තියෙන DataFrame එකක්.',
        'cuGraph කියන්නේ RAPIDS graph analytics library එක. cuDF edge list එකකින් graph එක හදලා algorithms GPU එකේ run කරනවා. NetworkX code එක තියෙනවා නම්, nx-cugraph කියන NetworkX backend එකෙන් code වෙනස් නොකර වගේ GPU එකේ run කරන්නත් පුළුවන් (support කරන algorithms වලට). Edges බිලියන ගණනක ලොකු graphs වලට cuGraph multi-GPU (Dask) mode එකකුත් තියෙනවා.',
        'Algorithms තුනක් සරලව: (1) PageRank = node එකක "වැදගත්කම". වැදගත් nodes ගොඩකින් links එන node එක වැදගත්. Google search එකේ ආරම්භය මේකයි. (2) Community detection (Louvain, Leiden) = එකිනෙකට ගොඩක් සම්බන්ධ, පිටතට අඩුවෙන් සම්බන්ධ කණ්ඩායම් හොයනවා. Modularity කියන අංකයෙන් කණ්ඩායම් කොච්චර හොඳට වෙන් වෙලාද කියලා මනිනවා. (3) Shortest path (SSSP, BFS) = node එකක ඉඳන් අනිත් හැම node එකකටම අඩුම දුර / අඩුම පියවර ගණන.',
        'Fraud detection එකට graphs ගොඩක් ප්‍රයෝජනවත්: fraud accounts එකට කණ්ඩායම් හදනවා (community), mule accounts මැද තියෙනවා (centrality / PageRank). Graph features (node එකක PageRank, එයාගේ community එකේ ප්‍රමාණය) හදලා XGBoost එකට දෙන එක ජනප්‍රිය ක්‍රමයක්. Graph neural networks (GNNs) ඊළඟ මට්ටම, ඒක මේ exam එකට ගැඹුරින් ඕනේ නෑ.',
      ],
      analogy: 'කොළඹ bus network එක හිතන්න. Bus stops = nodes, routes = edges. PageRank = Pettah වගේ, ගොඩක් වැදගත් stops වලින් buses එන තැන ඉහළ ලකුණු. Community detection = එකිනෙකට ගොඩක් buses තියෙන ප්‍රදේශ කණ්ඩායම් (දෙහිවල-ගල්කිස්ස-රත්මලාන එක කණ්ඩායමක්, කඩුවෙල-මාලබේ තව එකක්). Shortest path = Google Maps එකේ මහරගම ඉඳන් කොටුවට අඩුම දුර පාර.',
      example: 'Mobile money transfers මිලියන 50ක් (accounts මිලියන 5). cuGraph PageRank එකෙන් ඉහළම accounts 100 හොයනවා. Louvain එකෙන් communities 12,000ක් හම්බුණා. ඒවායින් එකක accounts 40ක් දින 3ක් ඇතුළත හැදුණු, එකිනෙකාට විතරක් සල්ලි යවන කණ්ඩායමක්. Investigation team එකට ඒක යවනවා. Shortest path එකෙන් දන්නා fraud account එකක ඉඳන් අලුත් account එකකට පියවර කීයක්ද කියලා feature එකක් හදනවා.',
      code: {
        lang: 'python',
        src: `import cudf, cugraph

edges = cudf.read_parquet("transfers.parquet")       # src, dst, amount
G = cugraph.Graph(directed=True)
G.from_cudf_edgelist(edges, source="src", destination="dst", edge_attr="amount")

pr = cugraph.pagerank(G)                              # vertex, pagerank
print(pr.nlargest(5, "pagerank"))                     # වැදගත්ම accounts

Gu = cugraph.Graph()                                  # Louvain = undirected graph
Gu.from_cudf_edgelist(edges, source="src", destination="dst")
parts, modularity = cugraph.louvain(Gu)               # vertex, partition
dist = cugraph.sssp(G, source=12345)                  # account 12345 සිට අඩුම දුර`,
      },
      keyPoints: [
        'Graph = nodes + edges. Data එක සාමාන්‍යයෙන් src / dst edge list එකක්.',
        'cuGraph = GPU graph analytics. nx-cugraph = NetworkX backend එක.',
        'PageRank = වැදගත්කම, Louvain / Leiden = communities, SSSP / BFS = shortest path.',
        'Graph features + XGBoost = fraud detection වල ජනප්‍රිය ක්‍රමයක්.',
      ],
      terms: [
        { en: 'Graph (Node / Edge)', si: 'දේවල් (nodes) සහ ඒවා අතර සම්බන්ධතා (edges) තියෙන data structure එක.' },
        { en: 'Edge List', si: 'හැම පේළියකම src, dst (සහ weight) තියෙන graph data වගුව.' },
        { en: 'cuGraph', si: 'RAPIDS GPU graph analytics library එක.' },
        { en: 'PageRank', si: 'වැදගත් nodes වලින් ලැබෙන links අනුව node එකක වැදගත්කම මනින algorithm එක.' },
        { en: 'Community Detection (Louvain)', si: 'ඇතුළත ගොඩක් සම්බන්ධ, පිටතට අඩුවෙන් සම්බන්ධ node කණ්ඩායම් හොයන එක.' },
        { en: 'Modularity', si: 'Communities කොච්චර හොඳට වෙන් වෙලාද කියන මිනුම.' },
        { en: 'SSSP', si: 'Single Source Shortest Path. එක node එකක ඉඳන් අනිත් හැමතැනටම අඩුම දුර.' },
      ],
    },
    {
      id: 'data-prep-inference-quality',
      title: 'Data Workflows: Collection, Labeling, Image / Text / Tabular Prep, Offline vs Online Inference, Quality Checks',
      body: [
        'හැම ML project එකක්ම data එකතු කිරීමෙන් පටන් ගන්නවා: databases, logs, APIs, sensors, surveys, web data (නීතිය සහ privacy / consent ගැන සැලකිලිමත් වෙලා). Supervised learning වලට labels ඕනේ. Labeling කියන්නේ මිනිස්සු (හෝ model එකක් උදව් කරලා) හැම example එකකටම හරි උත්තරය දාන එක. Label Studio, CVAT වගේ tools. හොඳ labeling guidelines, labelers දෙන්නෙක් එකම example එකට එකම label එක දෙනවද (agreement) කියලා බලන එක, label quality එකට අත්‍යවශ්‍යයි.',
        'Data වර්ගය අනුව preprocessing වෙනස්: Tabular = missing values, types, outliers, encoding, scaling (cuDF / cuML). Image = resize, normalize (pixel අගයන් 0-1 හෝ mean/std), augmentation (flip, crop, rotate), corrupt files අයින් කිරීම. NVIDIA DALI එකෙන් image decode සහ augmentation GPU එකේ කරලා training එකට data දෙන එක වේගවත් කරන්න පුළුවන්. Text = clean කිරීම (HTML, අමතර spaces), duplicates අයින් කිරීම, tokenization, Sinhala / Tamil / English මිශ්‍ර text වගේ දේවල් වලට encoding (Unicode) ප්‍රශ්න. cuDF .str operations වලින් text cleaning GPU එකේ කරන්න පුළුවන්.',
        'Inference ක්‍රම දෙකක්: Offline (batch) inference = data ගොඩක් එකපාර, නියමිත වෙලාවට (උදා: හැම රෑකම customers මිලියන 5කට churn scores හදලා table එකක ලියනවා). මෙතන throughput එක වැදගත්, GPU + cuDF / FIL එකට ගොඩක් ගැළපෙනවා. Online (real-time) inference = request එකක් ආපු ගමන් milliseconds වලින් උත්තරය (උදා: card swipe එකක fraud check එක). මෙතන latency එක වැදගත්, model එක API එකක් / Triton Inference Server එකක් පිටුපස. Training සහ online inference දෙකේම features එකම විදිහට හදන්න ඕනේ (training-serving skew නැති වෙන්න).',
        'Quality checks deploy කරන්න කලින්: schema checks (columns, types), ranges (වයස 0-120), missing rates, duplicates, label distribution, leakage checks, held-out test set එකේ metrics, slices අනුව (district, gender) performance. Deploy කළාට පස්සේ: input data එකේ schema / ranges දිගටම බලන එක, prediction distribution එක, latency, errors, labels ආවාම ඇත්ත accuracy එක, drift (ඊළඟ topic). Great Expectations, pandera වගේ libraries වලින් data checks automate කරන්න පුළුවන්.',
      ],
      analogy: 'Offline inference = අම්මා ඉරිදා සතියටම කෑම උයලා fridge එකේ තියනවා වගේ (batch, ලොකු ප්‍රමාණයක් එකපාර). Online inference = කඩේ order එකක් ආපු ගමන් කොත්තු එකක් කොටනවා වගේ (ඉක්මනින්, එකින් එක). Quality checks = රජයේ ආහාර පරීක්ෂකවරයා: කුස්සිය විවෘත කරන්න කලින් එක පාරක් (pre-deployment), ඊට පස්සේ නිතර (post-deployment).',
      example: 'Dialog / SLT වගේ ISP එකක් customer complaints SMS 2 මිලියනයක් categories 8කට classify කරනවා. Labelers 3 දෙනෙක් SMS 10,000කට labels දැම්මා, agreement 85%. GPU එකේ text clean කරලා duplicates 12% අයින් කළා. Offline: හැම රෑකම දවසේ complaints ඔක්කොම batch එකක් විදිහට classify කරනවා. Online: chatbot එකේ message එකක් ආපු ගමන් ms 50ක් ඇතුළත category එක. Deploy කළාට පස්සේ "Other" category එකේ ප්‍රමාණය 5% සිට 18% ට ගියා → අලුත් ප්‍රශ්නයක් (උදා: fiber outage එකක්), retrain කරන්න සලකුණක්.',
      code: {
        lang: 'python',
        src: `import cudf

df = cudf.read_parquet("complaints.parquet")          # text, label
df["text"] = (df["text"].str.lower()
                         .str.replace(r"<[^>]+>", "", regex=True)   # HTML අයින්
                         .str.strip())
df = df.drop_duplicates(subset="text")                 # duplicates අයින්

# සරල quality checks (deploy කරන්න කලින් සහ පස්සේ දෙකේම)
assert set(df.columns) >= {"text", "label"}, "schema වැරදියි"
assert df["text"].isna().mean() < 0.01, "missing text වැඩියි"
print(df["label"].value_counts(normalize=True))        # label distribution එක`,
      },
      keyPoints: [
        'Data collection (privacy / consent) → labeling (guidelines + agreement) → preprocessing.',
        'Tabular / image / text prep වෙනස්. DALI = GPU image pipelines, cuDF .str = GPU text cleaning.',
        'Offline (batch) = throughput. Online (real-time) = latency.',
        'Quality checks deploy කරන්න කලින් සහ පස්සේ දෙකේම: schema, ranges, metrics, drift.',
      ],
      terms: [
        { en: 'Data Labeling', si: 'Training examples වලට හරි උත්තරය (label) දාන එක.' },
        { en: 'Inter-annotator Agreement', si: 'Labelers දෙන්නෙක් එකම example එකට එකම label දෙන ප්‍රමාණය.' },
        { en: 'Data Augmentation', si: 'Flip, crop වගේ වෙනස්කම් වලින් training images වැඩි කරන එක.' },
        { en: 'NVIDIA DALI', si: 'Image / video / audio data loading සහ preprocessing GPU එකේ කරන library එක.' },
        { en: 'Offline (Batch) Inference', si: 'Data ගොඩක් එකපාර, නියමිත වෙලාවට predict කරන එක.' },
        { en: 'Online (Real-time) Inference', si: 'Request එකක් ආපු ගමන් අඩු latency එකකින් predict කරන එක.' },
        { en: 'Training-Serving Skew', si: 'Training එකේදී සහ production එකේදී features වෙනස් විදිහට හැදීම.' },
      ],
    },
    {
      id: 'reproducible-pipelines',
      title: 'End-to-End Pipelines and Reproducible Workflows with RAPIDS and Dask',
      body: [
        'End-to-end pipeline එකක් කියන්නේ raw data සිට evaluated model එක දක්වා හැම පියවරක්ම එක පිළිවෙළකට, නැවත run කරන්න පුළුවන් විදිහට: load (Parquet) → clean → features → split → train → evaluate → save artifacts. GPU එකේ හොඳම pipeline එක මුල සිට අග දක්වා data GPU එකේම තියාගන්න එකක් (cuDF → cuML / XGBoost). Data ලොකු නම් ඒ පියවරම dask-cudf සහ Dask-enabled XGBoost / cuML එක්ක.',
        'Reproducible කියන්නේ මාස 6කට පස්සේ වෙන කෙනෙක්ට, වෙන machine එකක, එකම ප්‍රතිඵලය (හෝ ඉතා ළඟ ප්‍රතිඵලයක්) ලබාගන්න පුළුවන් වීම. ඒකට: (1) Environment pinning: Python, RAPIDS, CUDA, XGBoost versions හරියටම ලියලා තියාගන්න (conda environment.yml, requirements.txt with ==, නැත්නම් Docker image tag එක). (2) Seeds: random_state / seed parameters හැම තැනකටම. (3) Config files: hyperparameters, file paths, dates code එකේ hard-code නොකර YAML / JSON config එකක.',
        '(4) Data versioning: train කරපු data එක මොකක්ද කියලා හරියටම දැනගන්න (dated Parquet snapshots, DVC, lakeFS, හෝ data file එකේ hash එක). (5) Artifacts: trained model file, preprocessing objects (encoders, scalers), metrics, plots, config එක, Git commit hash එක එකට save කරන්න. (6) Code එක Git එකේ. Notebook එකේ hidden state ප්‍රශ්න නැති වෙන්න, අන්තිම pipeline එක script එකක් / functions විදිහට.',
        'GPU වල reproducibility ගැන අවංක සටහනක්: සමහර GPU algorithms parallel විදිහට අංක එකතු කරන පිළිවෙළ වෙනස් වෙන්න පුළුවන් නිසා, එකම seed එක දුන්නත් අන්තිම decimal ස්ථාන ටිකක් වෙනස් වෙන්න පුළුවන්. ඒ නිසා "හරියටම එකම bits" වෙනුවට "metrics ඉතා ළඟයි" කියන එක ඉලක්කය කරගන්න. Deterministic options තියෙනවා නම් docs එකේ බලන්න. CPU vs GPU results ත් ටිකක් වෙනස් වෙන්න පුළුවන්.',
      ],
      analogy: 'Reproducible pipeline එකක් කියන්නේ ආච්චිගේ කැවුම් recipe එක ලියලා තියන එක වගේ. "පිටි ටිකක්, පැණි ටිකක්" කිව්වොත් කවදාවත් එකම රසය එන්නේ නෑ. "කිතුල් පැණි 250ml, කැකුළු පිටි 500g, ලිප රත් වෙලා විනාඩි 5" කියලා ලිව්වොත් (versions, config, seed) ඕනෙම කෙනෙක්ට, ඕනෙම දවසක එකම කැවුම් හදන්න පුළුවන්.',
      example: 'Data team එකේ Nimal 2026 මාර්තු model එකක් හැදුවා, PR-AUC 0.62. Ruwani ජූලි වල ඒක ආයෙත් run කළාම 0.55යි. හේතු: RAPIDS version එක update වෙලා, data file එක overwrite වෙලා, seed එකක් නෑ. නිවැරදි ක්‍රමය: environment.yml එකේ versions pin කරලා, data/2026-03-01/ snapshot එක, config.yaml (seed: 42, max_depth: 7), Git commit a1b2c3d, MLflow run එකේ ඔක්කොම artifacts. දැන් ඕනෙම කෙනෙක්ට 0.62 ට ඉතා ළඟ ප්‍රතිඵලය ලැබෙනවා.',
      code: {
        lang: 'python',
        src: `import yaml, random, numpy as np, cupy as cp, cudf, xgboost as xgb

cfg = yaml.safe_load(open("config.yaml"))     # paths, seed, params එක තැනක
seed = cfg["seed"]
random.seed(seed); np.random.seed(seed); cp.random.seed(seed)   # seeds හැම තැනටම

df = cudf.read_parquet(cfg["data_path"])      # data/2026-03-01/sales.parquet (snapshot)
X, y = df.drop(columns=cfg["target"]), df[cfg["target"]]
model = xgb.XGBClassifier(**cfg["xgb_params"], random_state=seed,
                          device="cuda", tree_method="hist").fit(X, y)
model.save_model("artifacts/model.json")      # artifact එක
# environment.yml: rapids, cuda-version, xgboost versions pin කරලා`,
      },
      keyPoints: [
        'Pipeline = load → clean → features → train → evaluate → save, data GPU එකේම.',
        'Reproducible = versions pin + seeds + config files + data snapshots + Git + artifacts.',
        'Notebook එකෙන් පටන් අරන්, අන්තිම pipeline එක script / functions විදිහට.',
        'GPU parallel ගණන් නිසා bit-for-bit වෙනස්කම් පොඩ්ඩක් තියෙන්න පුළුවන්. Metrics ළඟයි ද බලන්න.',
      ],
      terms: [
        { en: 'End-to-End Pipeline', si: 'Raw data සිට model / ප්‍රතිඵල දක්වා හැම පියවරම එක පිළිවෙළකට.' },
        { en: 'Environment Pinning', si: 'Libraries වල versions හරියටම සටහන් කරලා lock කරන එක.' },
        { en: 'Random Seed', si: 'Random numbers හැම පාරම එකම පිළිවෙළට එන්න දෙන ආරම්භක අංකය.' },
        { en: 'Config File', si: 'Parameters, paths code එකෙන් පිට YAML / JSON file එකක තියාගන්න එක.' },
        { en: 'Artifact', si: 'Run එකකින් හැදෙන model files, encoders, metrics, plots වගේ outputs.' },
        { en: 'DVC', si: 'Data Version Control. Git එක්ක ලොකු data files සහ models version කරන tool එක.' },
      ],
    },
    {
      id: 'intro-mlops-tracking-drift',
      title: 'Introductory MLOps: Experiment Tracking (MLflow / W&B), Versioning, Data Drift and Concept Drift',
      body: [
        'GPU එක නිසා ඔයාට දවසකට experiments සිය ගණනක් කරන්න පුළුවන්. ඒත් ඒවා ලියාගන්නේ නැත්නම් "අර හොඳ model එක හැදුවේ කොහොමද?" කියලා අමතක වෙනවා. Experiment tracking කියන්නේ හැම run එකකම parameters, metrics, artifacts, code version එක ස්වයංක්‍රීයව ලියාගන්න එක (Phase 7 MLOps එකේ විස්තර තියෙනවා). MLflow = open-source, ඔයාගේම server එකේ: mlflow.log_param, log_metric, log_artifact, model registry. සමහර libraries වලට autolog (උදා: mlflow.xgboost.autolog()). Weights & Biases (W&B) = cloud service: wandb.init(config=...), wandb.log(...), sweeps (HPO) සහ team dashboards.',
        'Versioning තුනක්: code (Git), data (snapshots / DVC), models (MLflow model registry එකේ version 1, 2, 3 සහ aliases / stages). Production model එකට ප්‍රශ්නයක් ආවොත් කලින් version එකට ඉක්මනින් ආපහු යන්න (rollback) පුළුවන් වෙන්නේ මේ නිසා.',
        'Deploy කළාට පස්සේ ලෝකය වෙනස් වෙනවා. Data drift (covariate shift) = model එකට එන inputs වල distribution එක වෙනස් වීම. උදා: train කරද්දී සාමාන්‍ය බිල Rs. 2,500, දැන් inflation නිසා Rs. 4,000. Concept drift = inputs සහ output අතර සම්බන්ධයම වෙනස් වීම. උදා: කලින් "රෑ 2ට online purchase = fraud ඉඩ වැඩියි" කියන රටාව, දැන් night shift BPO සේවකයෝ වැඩි නිසා සාමාන්‍ය දෙයක්. Data drift එක labels නැතුවම හොයන්න පුළුවන්. Concept drift එක හරියටම දැනගන්න සාමාන්‍යයෙන් අලුත් labels ඕනේ (accuracy අඩු වීම).',
        'Drift හොයන ක්‍රම: numeric features වලට Kolmogorov-Smirnov (KS) test (distributions දෙකක් එකමද), PSI (Population Stability Index, bins අනුව distribution එක කොච්චර වෙනස් වුණාද, ගොඩක් teams 0.1 / 0.25 වගේ thresholds rule of thumb විදිහට පාවිච්චි කරනවා), categories වලට chi-square, prediction distribution එකේ වෙනස, labels ආවාම ඇත්ත metrics. Evidently, NannyML වගේ tools මේවා automate කරනවා. ලොකු data නම් histograms / stats cuDF එකෙන් GPU එකේ ගණනය කරන්න පුළුවන්. Drift එකක් දැක්කාම: හේතුව හොයන්න, අවශ්‍ය නම් අලුත් data එක්ක retrain කරන්න.',
      ],
      analogy: 'Data drift = ඔයාගේ කොත්තු කඩේට කලින් ආවේ කාර්යාල සේවකයෝ, දැන් university ළමයි (customers වෙනස්). Concept drift = එකම customers, ඒත් දැන් එයාලා කැමති cheese කොත්තුවලට, සාමාන්‍ය කොත්තුවලට නෙවෙයි (රුචිය / සම්බන්ධය වෙනස්). Experiment tracking = කඩේ recipe පොත: හැම අලුත් recipe එකක්ම, ලුණු ප්‍රමාණය, customers ලාගේ ලකුණු එක්ක ලියනවා.',
      example: 'Loan default model එක 2025 data එකෙන්. 2026 මැද වෙද්දී monthly_income feature එකේ PSI = 0.31 (විශාල වෙනසක් කියලා සලකන මට්ටමක්), KS test p-value < 0.001. Labels මාස 3කට පස්සේ ආවාම recall 0.78 සිට 0.61 ට වැටිලා. Data drift සහ concept drift දෙකම වගේ. MLflow එකෙන් පරණ run එකේ config එක අරන්, අලුත් මාස 6ක data එක එකතු කරලා retrain කළා, registry එකේ version 4 විදිහට register කළා, A/B test කරලා production alias එක දැම්මා.',
      code: {
        lang: 'python',
        src: `import mlflow, numpy as np
from scipy.stats import ks_2samp

with mlflow.start_run(run_name="xgb-gpu-v4"):
    mlflow.log_params({"max_depth": 7, "learning_rate": 0.05, "device": "cuda"})
    mlflow.log_metric("pr_auc", 0.62)
    mlflow.log_artifact("config.yaml")          # config එකත් එකට save

# Data drift: train කාලයේ income vs මේ මාසේ income
train_inc = np.load("train_income.npy"); live_inc = np.load("live_income.npy")
stat, p = ks_2samp(train_inc, live_inc)
if p < 0.01:
    print("Data drift අනතුරු ඇඟවීම: income distribution එක වෙනස් වෙලා")`,
      },
      keyPoints: [
        'Experiment tracking = params, metrics, artifacts, code version හැම run එකකටම (MLflow / W&B).',
        'Code = Git, data = snapshots / DVC, models = registry (rollback පුළුවන්).',
        'Data drift = inputs වෙනස් (labels නැතුව හොයන්න පුළුවන්). Concept drift = input-output සම්බන්ධය වෙනස්.',
        'KS test, PSI, chi-square, prediction distribution, ඇත්ත metrics වලින් drift හොයන්න.',
      ],
      terms: [
        { en: 'Experiment Tracking', si: 'හැම training run එකකම settings, ප්‍රතිඵල, files ස්වයංක්‍රීයව ලියාගන්න එක.' },
        { en: 'MLflow', si: 'Tracking, model registry වගේ කොටස් තියෙන open-source MLOps platform එක.' },
        { en: 'Weights & Biases (W&B)', si: 'Experiment tracking, sweeps, dashboards තියෙන cloud service එක.' },
        { en: 'Model Registry', si: 'Models versions, aliases / stages එක්ක ගබඩා කරන තැන.' },
        { en: 'Data Drift', si: 'Model එකට එන input data distribution එක කාලයත් එක්ක වෙනස් වීම.' },
        { en: 'Concept Drift', si: 'Inputs සහ target අතර සම්බන්ධතාවය වෙනස් වීම.' },
        { en: 'PSI / KS Test', si: 'Distributions දෙකක් කොච්චර වෙනස්ද කියලා මනින ක්‍රම දෙකක්.' },
      ],
    },
    {
      id: 'environment-management',
      title: 'Software and Environment Management: Conda, pip, Docker / NGC, CUDA Driver Compatibility, nvidia-smi, Git',
      body: [
        'RAPIDS වැඩ කරන්න NVIDIA GPU එකක්, Linux (Windows නම් WSL2 හරහා), ගැළපෙන NVIDIA driver එකක් ඕනේ. Install කරන්න ක්‍රම තුනක්: (1) Conda: rapidsai, conda-forge, nvidia channels වලින්. Conda එක Python packages විතරක් නෙවෙයි, CUDA libraries වගේ non-Python dependencies පවා environment එක ඇතුළේ manage කරනවා. (2) pip: CUDA version එකට ගැළපෙන wheels (උදා: cudf-cu12 වගේ නම් තියෙන packages). (3) Docker containers: NGC catalog එකේ (සහ Docker Hub එකේ) RAPIDS images, හැමදේම කලින්ම install කරලා. Install command එක හරියටම හදාගන්න RAPIDS website එකේ install selector එක පාවිච්චි කරන්න, versions නිතර වෙනස් වෙනවා.',
        'Conda vs pip: pip = Python Package Index එකෙන් Python packages. Conda = packages + Python එකම + system libraries, environments (conda create -n rapids ...). Conda environment එකක් ඇතුළේ pip සහ conda දෙකම අවුල් විදිහට මිශ්‍ර කරන එක dependency ප්‍රශ්න ඇති කරනවා. පුළුවන් තරම් එකකින් ඔක්කොම. Docker = මුළු OS userspace එකම image එකක. GPU එකට access දෙන්න NVIDIA Container Toolkit එක සහ docker run --gpus all ඕනේ. Host එකේ ඕනේ NVIDIA driver එක විතරයි, CUDA toolkit එක container එක ඇතුළේ.',
        'CUDA driver vs toolkit: Driver = OS එකට install කරන, GPU hardware එක්ක කතා කරන කොටස. CUDA toolkit / runtime = applications build / run කරන්න libraries (RAPIDS packages ඇතුළේ ගොඩක් වෙලාවට එනවා). රන් නීතිය: අලුත් driver එකකට පරණ toolkit එකකින් හදපු apps run කරන්න පුළුවන් (backward compatibility). එකම major version එක ඇතුළේ (උදා: CUDA 12.x) minor version compatibility නිසා සාමාන්‍යයෙන් ඒ major එකේ අවම driver එක තිබ්බොත් ඇති (සමහර features වලට අලුත් driver ඕනේ වෙන්න පුළුවන්). Driver එකට වඩා අලුත් CUDA major එකක් ඕනේ නම්: driver update කරන්න, නැත්නම් සමහර data center GPUs වල "forward compatibility" package එක (cuda-compat) පාවිච්චි කරන්න පුළුවන්.',
        'nvidia-smi command එකෙන්: GPU නම, driver version එක, "CUDA Version" (මේක driver එකට support කරන්න පුළුවන් උපරිම CUDA version එක, install කරපු toolkit එක නෙවෙයි!), memory usage, GPU utilization %, temperature, run වෙන processes. nvcc --version = install කරපු CUDA toolkit compiler version එක. Git basics: git init, git add, git commit -m, git branch, git checkout / switch, git push / pull. .gitignore එකට data files, model files, .env secrets දාන්න, ලොකු data Git එකේ තියන්න එපා (DVC / Git LFS).',
      ],
      analogy: 'Driver = පාර. CUDA toolkit = වාහනය. අලුත් expressway එකක (අලුත් driver) පරණ වාහනයක් යන්න පුළුවන්. ඒත් පරණ ගුරු පාරක (පරණ driver) අලුත්ම super car එකක් (අලුත් CUDA major) යන්න බෑ. Conda environment = එක් එක් project එකට වෙනම බඩු පෙට්ටියක්. Docker = මුළු කුස්සියම container එකක දාලා ඕනෙම තැනකට ගෙනියන එක.',
      example: 'nvidia-smi output එකේ "Driver Version: 550.xx, CUDA Version: 12.4" පෙන්නනවා කියමු. ඒ කියන්නේ මේ driver එකට CUDA 12.4 දක්වා apps run කරන්න පුළුවන්. CUDA 12 builds තියෙන RAPIDS package එකක් (pip cudf-cu12 හෝ conda cuda-version=12) හරි. CUDA 13 build එකක් ඕනේ නම් driver එක update කරන්න ඕනේ. Memory-Usage 23000MiB / 24576MiB නම් GPU memory එක පිරෙන්න ළඟයි, partition size එක අඩු කරන්න හෝ Dask workers ලා බලන්න.',
      code: {
        lang: 'bash',
        src: `nvidia-smi                       # driver, max CUDA version, memory, util %
nvcc --version                   # install කරපු CUDA toolkit (තියෙනවා නම්)

# Conda env එකක් (හරියටම command එක RAPIDS install selector එකෙන් ගන්න)
conda create -n rapids -c rapidsai -c conda-forge -c nvidia rapids python=3.11 cuda-version=12
conda env export > environment.yml          # versions pin කරලා save

# Docker: host එකේ driver + NVIDIA Container Toolkit විතරයි ඕනේ
docker run --gpus all -it --rm -p 8888:8888 <ngc-rapids-image>:<tag>

git init && git add src/ config.yaml && git commit -m "GPU pipeline v1"
echo "data/" >> .gitignore                  # ලොකු data Git එකට එපා`,
      },
      keyPoints: [
        'RAPIDS install = conda / pip / Docker (NGC). Command එක install selector එකෙන්.',
        'Conda = Python + system libraries + environments. pip = Python packages. මිශ්‍ර කරන්නේ පරිස්සමෙන්.',
        'අලුත් driver + පරණ toolkit = OK. පරණ driver + අලුත් CUDA major = driver update / forward compat.',
        'nvidia-smi "CUDA Version" = driver එකේ උපරිම support, toolkit එක නෙවෙයි.',
        'Git: code සහ configs. Data / secrets .gitignore එකට.',
      ],
      terms: [
        { en: 'Conda', si: 'Packages සහ isolated environments manage කරන tool එක. Non-Python libraries ත් handle කරනවා.' },
        { en: 'pip', si: 'Python packages PyPI එකෙන් install කරන standard tool එක.' },
        { en: 'NGC', si: 'NVIDIA GPU Cloud catalog එක. GPU-optimized containers, models, resources.' },
        { en: 'NVIDIA Container Toolkit', si: 'Docker containers වලට GPU access දෙන tool එක (--gpus all).' },
        { en: 'CUDA Driver vs Toolkit', si: 'Driver = OS එකේ GPU කතා කරන කොටස. Toolkit = apps හදන / run කරන CUDA libraries.' },
        { en: 'Forward Compatibility', si: 'පරණ driver එකක අලුත් CUDA toolkit apps run කරන්න දෙන compat package එක (සහාය දක්වන data center GPUs වල).' },
        { en: 'nvidia-smi', si: 'GPU තත්ත්වය, driver version, memory, utilization, processes පෙන්නන command එක.' },
        { en: 'Git', si: 'Code වෙනස්කම් version කරන, team එකක් එක්ක වැඩ කරන්න පුළුවන් version control system එක.' },
      ],
    },
    {
      id: 'hands-on-sri-lankan-retail-gpu',
      title: 'And More: Hands-on, Accelerating a Sri Lankan Retail Sales Workflow with cudf.pandas and cuML',
      body: [
        'දැන් ඔක්කොම එකට. Supermarket chain එකක (branches 250ක්, ලංකාව පුරා) අවුරුදු 3ක bill line items rows මිලියන 150ක් තියෙනවා: date, branch, district, item, category, qty, unit_price_rs, payment_method, loyalty_id. ප්‍රශ්න දෙකක්: (1) Branch / category අනුව දෛනික විකුණුම් සහ මාසික trends (ETL + EDA). (2) Loyalty customers ලා segments වලට බෙදලා (k-means), ඊළඟ මාසේ වැඩිපුර වියදම් කරන අය predict කරන එක.',
        'පියවර 1 (before): දැනට තියෙන pandas notebook එක CPU එකේ run කරලා %time එකෙන් හැම පියවරකටම යන වෙලාව ලියාගන්න. මේක baseline එක. පියවර 2: CSV එක එක පාරක් Parquet කරන්න. පියවර 3: notebook එකේ මුලටම %load_ext cudf.pandas දාලා, kernel එක restart කරලා, code එක වෙනස් නොකර run කරන්න. Profiler එකෙන් CPU fallbacks හොයලා (බොහෝ විට row-wise .apply() හෝ Python loops) ඒවා vectorized කරන්න. පියවර 4: ML කොටසට sklearn KMeans / RandomForest වෙනුවට cuML (නැත්නම් cuml.accel), XGBoost device="cuda".',
        'බලාපොරොත්තු වෙන්න පුළුවන් දේ (ගුණාත්මකව): Parquet කියවීම, groupby, merge, sort වගේ ලොකු operations සාමාන්‍යයෙන් කිහිප ගුණයක සිට දස ගුණ ගණනකට වඩා වේගවත් වෙන්න පුළුවන්. Fallback වෙන operations, පොඩි DataFrames, Python loops වලට වාසියක් නෑ, සමහරවිට ටිකක් හෙමින්. ML training (k-means, random forest, XGBoost) ලොකු data වලදී සැලකිය යුතු ලෙස වේගවත්. මුළු notebook එකේ speedup එක තීරණය වෙන්නේ හෙමින්ම කොටසෙන් (Amdahl\'s law අදහස). ඔයාගේ GPU, CPU, data එක අනුව අංක වෙනස් නිසා, හැමවිටම ඔයාම මනින්න.',
        'පියවර 5: reproducibility සහ MLOps එකතු කරන්න: config.yaml, seeds, MLflow run එකක, environment.yml එක, Git commit එක. පියවර 6: nightly batch scoring (offline inference) එකක් විදිහට script එක python -m cudf.pandas score.py කියලා schedule කරන්න, data quality checks සහ drift checks එක්ක. මේ project එක ඔයාගේ GitHub portfolio එකට සහ NCA-ADS exam එකට දෙකටම හොඳ පුහුණුවක්.',
      ],
      analogy: 'මේක හරියට පරණ ලොරියක් (CPU pandas) ඇතුළට අලුත් engine එකක් (GPU) දානවා වගේ. Body එක, steering එක (pandas code) එහෙමමයි. මුලින්ම පරණ ලොරියේ කොළඹ-ගාල්ල ගමනට යන වෙලාව මනිනවා (baseline). Engine එක මාරු කරලා ආයෙත් මනිනවා. Traffic lights (fallbacks, loops) තියෙන තැන් වල අලුත් engine එකෙන් වාසියක් නෑ, ඒ නිසා ඒ තැන් expressway (vectorized code) කරනවා.',
      example: 'උදාහරණ මිනුම් (ඔයාගේ machine එකේ වෙනස් වෙයි, මේවා නිදර්ශන පමණයි): CPU pandas: CSV load විනාඩි 4, groupby + merge විනාඩි 6, features විනාඩි 5, sklearn KMeans + RandomForest විනාඩි 25. ඔක්කොම විනාඩි 40ක් පමණ. GPU: Parquet load + cudf.pandas ETL විනාඩි 1කට අඩු, cuML KMeans + RandomForest විනාඩි 1-2ක්. එක .apply() fallback එකක් vectorized කරාට පස්සේ මුළු pipeline එක විනාඩි කීපයක්. ඉතුරු වෙන කාලයෙන් ඔයාට features සහ hyperparameters ගොඩක් වැඩියෙන් try කරන්න පුළුවන්.',
      code: {
        lang: 'python',
        src: `%load_ext cudf.pandas
import pandas as pd                                   # BEFORE / AFTER code එක එකමයි!
from cuml.cluster import KMeans                       # AFTER: sklearn.cluster වෙනුවට cuML

df = pd.read_parquet("lk_retail.parquet")             # CSV වෙනුවට Parquet
df["revenue"] = df["qty"] * df["unit_price_rs"]       # vectorized (.apply එපා)
daily = df.groupby(["date", "district"])["revenue"].sum().reset_index()

cust = df.groupby("loyalty_id").agg(spend=("revenue", "sum"),
                                    visits=("date", "nunique"),
                                    items=("qty", "sum")).reset_index()
X = cust[["spend", "visits", "items"]].astype("float32")
X = (X - X.mean()) / X.std()                          # scaling (k-means වලට අවශ්‍යයි)
cust["segment"] = KMeans(n_clusters=5, random_state=42).fit_predict(X)
print(cust.groupby("segment")["spend"].mean())         # segment එකකට සාමාන්‍ය වියදම`,
      },
      keyPoints: [
        'මුලින්ම CPU baseline එක මනින්න (%time). මනින්නේ නැති speedup එකක් නෑ.',
        'CSV → Parquet, %load_ext cudf.pandas, fallbacks හොයලා vectorize කරන්න.',
        'ML: cuML / cuml.accel, XGBoost device="cuda". Data GPU එකේම තියාගන්න.',
        'Speedup එක workload / hardware අනුව වෙනස්. හෙමින්ම කොටස තමයි සීමාව.',
        'Config + seeds + MLflow + Git එකතු කරලා portfolio project එකක් කරගන්න.',
      ],
      terms: [
        { en: 'Baseline Measurement', si: 'වෙනසක් කරන්න කලින් පරණ ක්‍රමයේ වෙලාව / ප්‍රතිඵලය මනින එක.' },
        { en: 'Customer Segmentation', si: 'සමාන හැසිරීම් තියෙන customers කණ්ඩායම් වලට බෙදන එක (උදා: k-means).' },
        { en: 'Amdahl\'s Law (අදහස)', si: 'කොටසක් විතරක් වේගවත් කළොත්, මුළු වේගය සීමා වෙන්නේ වේගවත් නොකළ කොටසෙන්.' },
        { en: 'Batch Scoring', si: 'නියමිත වෙලාවට data ගොඩකට එකපාර predictions හදන එක (offline inference).' },
      ],
    },
  ],
  quiz: [
    {
      q: 'Rows 3,000ක CSV එකක් එක පාරක් groupby කරනවා. GPU එකෙන් ලොකු speedup එකක් නොලැබෙන්නේ ඇයි?',
      options: [
        'GPU එකට groupby කරන්න බැරි නිසා',
        'Data පොඩියි, data copy සහ setup overhead එක ගණනයට වඩා වැඩි නිසා',
        'CSV files GPU එකට කියවන්න බැරි නිසා',
      ],
      answer: 1,
      why: 'GPU එක දිනන්නේ ලොකු, parallel workloads වලදී. පොඩි data වලට PCIe copy සහ kernel launch overhead එකම ගණනයට වඩා වැඩියි.',
    },
    {
      q: 'GPU pipeline එකක් හෙමින් වෙන්න වැඩිපුරම ඉඩ තියෙන හේතුව මොකක්ද?',
      options: [
        'Loop එකක් ඇතුළේ data GPU සහ CPU අතර නැවත නැවත copy කිරීම',
        'Parquet files පාවිච්චි කිරීම',
        'groupby එකක් පාවිච්චි කිරීම',
      ],
      answer: 0,
      why: 'PCIe copy එක GPU memory bandwidth එකට වඩා ගොඩක් හෙමින්. Data එක එක පාරක් GPU එකට ගෙනිහින් එතනම තියාගන්න ඕනේ.',
    },
    {
      q: 'cudf.pandas mode එකේදී cuDF එක support නොකරන operation එකක් ආවොත් මොකද වෙන්නේ?',
      options: [
        'Program එක error එකක් දීලා නවතිනවා',
        'Operation එක මඟහරිනවා',
        'ස්වයංක්‍රීයව CPU pandas එකෙන් කරනවා (fallback), ප්‍රතිඵලය එකමයි ඒත් copy වියදම නිසා හෙමින් වෙන්න පුළුවන්',
      ],
      answer: 2,
      why: 'cudf.pandas proxy objects GPU එකේ බැරි දේ CPU pandas එකට fallback කරනවා. Fallbacks ගොඩක් නම් speedup අඩුයි.',
    },
    {
      q: 'Parquet එකේ "predicate pushdown" කියන්නේ මොකක්ද?',
      options: [
        'File එක compress කරන ක්‍රමයක්',
        'Row groups වල min/max statistics බලලා filter එකට නොගැළපෙන කොටස් කියවන්නේ නැතුව ඉන්න එක',
        'Columns rows වලට convert කරන එක',
      ],
      answer: 1,
      why: 'Filter එක read එකටම යවලා, statistics වලින් ගැළපෙන්නේ නැති row groups මුළුමනින්ම skip කරනවා. ඒ නිසා කියවන data අඩුයි.',
    },
    {
      q: 'dask_cudf එකේ ddf.groupby("station")["fare"].sum() ලිව්වාම, ඇත්තටම ගණනය වෙන්නේ කවදාද?',
      options: [
        'ඒ පේළිය run කරපු ගමන්',
        '.compute() (හෝ .persist()) කියනකොට',
        'Notebook එක save කරනකොට',
      ],
      answer: 1,
      why: 'Dask lazy. මුලින් task graph එක විතරයි හැදෙන්නේ. compute() / persist() වලදී run වෙනවා.',
    },
    {
      q: 'XGBoost 2.x එකේ GPU එකේ train කරන්න නිවැරදි settings මොනවාද?',
      options: [
        'device="cuda", tree_method="hist"',
        'gpu=True, tree_method="exact"',
        'device="cpu", n_jobs=-1',
      ],
      answer: 0,
      why: 'XGBoost 2.0 සිට device="cuda" සහ tree_method="hist". පරණ versions වල tree_method="gpu_hist" පාවිච්චි කළා.',
    },
    {
      q: 'Fraud 0.5%ක් තියෙන dataset එකක model එකක් 99.5% accuracy දෙනවා. හොඳම ඊළඟ පියවර මොකක්ද?',
      options: [
        'Model එක production එකට දාන්න',
        'Recall, precision, PR-AUC බලන්න, stratified CV සහ class weights (උදා: scale_pos_weight) පාවිච්චි කරන්න',
        'Test set එකෙන් fraud rows අයින් කරන්න',
      ],
      answer: 1,
      why: '"හැමදේම fraud නෑ" කියන model එකටත් 99.5% accuracy. Imbalance වලට ගැළපෙන metrics සහ ක්‍රම ඕනේ.',
    },
    {
      q: 'nvidia-smi එකේ "CUDA Version: 12.4" කියලා පෙන්නන්නේ මොකක්ද?',
      options: [
        'Install කරපු CUDA toolkit version එක',
        'Driver එකට support කරන්න පුළුවන් උපරිම CUDA version එක',
        'GPU එකේ hardware generation එක',
      ],
      answer: 1,
      why: 'nvidia-smi එකේ CUDA Version එක driver එකේ උපරිම support එක. Install කරපු toolkit එක බලන්න nvcc --version.',
    },
    {
      q: 'Inputs වල distribution එක එහෙමමයි, ඒත් එකම features තියෙන customers දැන් වෙනස් විදිහට හැසිරෙනවා (target එක වෙනස්). මේ මොකක්ද?',
      options: ['Data drift', 'Concept drift', 'Class imbalance'],
      answer: 1,
      why: 'Concept drift = inputs සහ target අතර සම්බන්ධයම වෙනස් වීම. Data drift = inputs distribution එක වෙනස් වීම.',
    },
    {
      q: 'Money transfer graph එකක, එකිනෙකාට විතරක් සල්ලි යවන accounts කණ්ඩායම් හොයන්න cuGraph එකේ ගැළපෙන algorithm එක මොකක්ද?',
      options: [
        'Louvain (community detection)',
        'SSSP (shortest path)',
        'ARIMA',
      ],
      answer: 0,
      why: 'Louvain / Leiden ඇතුළත ගොඩක් සම්බන්ධ, පිටතට අඩුවෙන් සම්බන්ධ කණ්ඩායම් (communities) හොයනවා. SSSP = අඩුම දුර, ARIMA = time series.',
    },
  ],
}
