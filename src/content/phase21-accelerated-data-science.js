export default {
  id: 'accelerated-data-science',
  number: 21,
  title: 'Accelerated Data Science with RAPIDS (NCA-ADS)',
  titleSi: 'GPU-accelerated data science with RAPIDS: turning pandas workloads from minutes into seconds',
  summary: 'Prepare for NVIDIA NCA-ADS certification by building on pandas, EDA, and feature engineering from Phase 1 and cuDF / cuML from Phase 17. Learn when a GPU helps, how data-transfer costs affect speed, how Dask and Spark handle larger datasets, and how to use cuML, XGBoost, reproducible pipelines, MLOps, time series, graph analytics, and environment management. Finish by moving a Sri Lankan supermarket sales workflow onto the GPU step by step.',
  duration: '4-6 weeks',
  topics: [
    {
      id: 'ads-foundations-cpu-vs-gpu',
      plain: "NumPy provides CPU arrays, pandas provides tabular DataFrames, and Jupyter is an interactive environment. GPU libraries accelerate suitable operations but do not change the need for correct analysis.",
      internGuide: ["NumPy provides CPU arrays, pandas provides tabular DataFrames, and Jupyter is an interactive environment. GPU libraries accelerate suitable operations but do not change the need for correct analysis.","GPUs help when a workload has enough parallel numeric work—large joins, group-bys, vector operations, or model training—to repay setup and data-transfer costs.","Small datasets, Python loops, branch-heavy logic, unsupported dtypes, and frequent CPU/GPU switching can make a CPU faster or simpler.","Benchmark the complete workflow on representative data after a warm-up. Compare correctness, elapsed time, memory, transfer time, and development/operations cost."],
      title: 'Foundations: NumPy, pandas, Jupyter, and CPU vs GPU Workloads',
      body: [
        'In Phase 1, you learned NumPy arrays and pandas DataFrames. Accelerated data science runs those same kinds of operations on a GPU. pandas operations are often vectorized: one operation is applied to an entire column. GPUs are well suited to this pattern.',
        'A Jupyter notebook is a data scientist’s workbench: run cells one at a time and inspect the results. The %time magic measures one run; %timeit repeats a cell and reports an average. The first GPU run is often slower because it initializes the CUDA context and loads kernels, so measure after a warm-up run.',
        'A CPU has a smaller number of powerful cores (for example, 8–64), while a GPU has thousands of simpler cores. GPUs can win on large datasets (millions of rows) when the same operation—such as filtering, grouping, joining, sorting, or matrix math—can run across many rows and the data stays on the GPU. They may lose on small datasets (thousands of rows), Python loops or row-by-row apply, branch-heavy logic, or workflows that repeatedly move data between CPU and GPU.',
        'For every workload in this phase, ask: “Can this work run in parallel, and can the data stay on the GPU?” If both answers are yes, RAPIDS may provide a large speedup; otherwise, CPU pandas may be the better choice. Phase 9 covers GPU hardware, and Phase 17 gives a short introduction to GPU acceleration for classic ML.',
      ],
      analogy: 'Think of a CPU as 8 specialist doctors and a GPU as 5,000 nurses at a vaccination camp. Doctors are better for one complicated patient; the large team can vaccinate 100,000 children in parallel. Setting up the camp for only 10 children would not be worth the overhead.',
      example: 'A groupby on a 5,000-row spreadsheet may take 2 milliseconds with CPU pandas; the GPU may be just as fast or slower after copying the data. A groupby-and-join pipeline over 100 million sales rows might take minutes on a CPU and seconds on a GPU, although the actual speedup depends on the hardware and operation.',
      code: {
        lang: 'python',
        src: `import numpy as np, pandas as pd

df = pd.DataFrame({"shop": np.random.randint(0, 500, 10_000_000),
                   "amount": np.random.rand(10_000_000) * 5000})

# Good: vectorized and suitable for GPU execution
%time totals = df.groupby("shop")["amount"].sum()

# Avoid: a Python function for each row is slow on both CPU and GPU
# df["tax"] = df.apply(lambda r: r["amount"] * 0.18, axis=1)
df["tax"] = df["amount"] * 0.18   # Write it in this vectorized form`,
      },
      keyPoints: [
        'GPUs suit large datasets, one operation across many rows, and workflows that keep data on the GPU.',
        'Small datasets, Python loops, and row-by-row apply may not benefit from a GPU.',
        'Use %time / %timeit in Jupyter; time GPU work after a warm-up run.',
        'Writing vectorized pandas code makes it easier to move workloads to a GPU.',
      ],
      terms: [
        { en: 'Jupyter Notebook', si: 'An interactive environment that keeps code, results, charts, and notes together in cells.' },
        { en: 'Magic Command', si: 'A special Jupyter command beginning with % or %%, such as %time, %timeit, or %load_ext.' },
        { en: 'Workload', si: 'A unit of work given to a computer, such as a groupby operation or model training.' },
        { en: 'Warm-up Run', si: 'An initial run that includes setup time and is excluded from representative timing.' },
        { en: 'Data Parallelism (data level)', si: 'Applying the same operation to many parts of the data at the same time; a GPU strength.' },
      ],
      si: 'ඔයාට rows ලක්ෂයක් තියෙන Keells sales file එකක හැම row එකටම tax ගණනය කරන්න ඕනේ කියලා හිතන්න. Vectorized code එකෙන් එකම ගණනය rows ඔක්කොටම කරන නිසා GPU එකට ඒවා parallel වැඩ කරන්න පුළුවන්. Rows 10ක file එකකට GPU එක සූදානම් කරන වෙලාවම වැඩි වෙන්න පුළුවන්. Jupyter එකේ %timeit දාලා කිහිප වතාවක් මැනලා, මුල් GPU run එක warm-up එකක් විදිහට අතහරින්න.',
    },
    {
      id: 'host-device-data-movement',
      plain: "Host memory is CPU RAM; device memory is GPU memory. Discrete GPUs usually exchange data with the host across PCIe, which is much slower than on-device memory access.",
      internGuide: ["Host memory is CPU RAM; device memory is GPU memory. Discrete GPUs usually exchange data with the host across PCIe, which is much slower than on-device memory access.","A conversion from pandas/NumPy to cuDF/CuPy may copy data to the GPU; converting back copies it again. Hidden fallback can create repeated round trips.","Keep related transformations on the GPU, transfer columns in batches, avoid unnecessary format conversions, and return only the final result when practical.","Profile transfers and synchronization, not only kernels. Unified or managed memory simplifies addressing but does not eliminate migration cost or capacity limits."],
      title: 'Host vs Device Memory: The Cost of Moving Data over PCIe',
      body: [
        'A computer has host memory (CPU RAM) and device memory (the GPU’s VRAM, for example 16 GB, 24 GB, or 80 GB). GPU operations work on data in device memory, so a pandas DataFrame must first be copied from host to device over the PCIe bus.',
        'GPU memory can read data much faster than PCIe can transfer it (often more than ten times faster on data-center GPUs). If a calculation takes 0.1 seconds on the GPU but copying the data takes 1 second, most of the time is spent moving data. This is the data movement cost.',
        'A useful rule is to transfer data to the GPU once, then load, clean, create features, train, and predict there. Copy only a small summary or predictions back to the CPU. Reading files directly with a function such as cudf.read_parquet() can help; on some systems, GPUDirect Storage can transfer data from storage to GPU memory without passing through CPU RAM.',
        'Watch for hidden transfers to the CPU. Printing a small result is fine, but .to_pandas(), .values (NumPy), sending an entire column to matplotlib, or passing data to a library without cuDF support can copy data to host memory. Repeated transfers inside a loop are a common reason GPU code becomes slow.',
      ],
      analogy: 'Imagine hauling goods from Colombo (CPU RAM) to Kandy (the GPU). Unpacking goods in the Kandy warehouse is fast, but the trip over the Kadugannawa road (PCIe) takes time. Carry everything in one large lorry, finish the work in Kandy, and return only what you need; carrying each package back and forth can take all day.',
      example: 'Transferring an 8 GB DataFrame over PCIe 4.0 x16 may take about 0.3–0.5 seconds in practice (the theoretical one-way rate is about 30 GB/s). A GPU groupby may take 0.2 seconds. If you transfer once and run 20 operations, the copy cost can be small relative to the work. Converting to pandas after each operation and copying back could add more than 10 seconds of transfers and erase the GPU advantage.',
      code: {
        lang: 'python',
        src: `import cudf

# Good: read the file directly into GPU memory
gdf = cudf.read_parquet("sales_2025.parquet")
gdf = gdf[gdf["amount"] > 0]                      # stays on the GPU
summary = gdf.groupby("district")["amount"].sum()  # stays on the GPU
print(summary.to_pandas())   # copy only the small result to the CPU

# Avoid: repeated transfers inside a loop
# for d in districts:
#     pdf = gdf.to_pandas()        # copy gigabytes to the CPU each time
#     gdf = cudf.from_pandas(pdf)  # then copy back to the GPU`,
      },
      keyPoints: [
        'GPU operations use data in device memory.',
        'PCIe copies are much slower than GPU memory bandwidth.',
        'Transfer once, do the work on the GPU, and copy back only small results.',
        '.to_pandas(), .values, and unsupported libraries can cause hidden host copies.',
      ],
      terms: [
        { en: 'Host Memory', si: 'RAM available to the CPU.' },
        { en: 'Device Memory (VRAM)', si: 'Memory on the GPU card; GPU computations use data stored here.' },
        { en: 'PCIe', si: 'The bus connecting the CPU and GPU; host-device copies travel over it.' },
        { en: 'Memory Bandwidth', si: 'The amount of data that can be read from or written to memory per second.' },
        { en: 'Pinned Memory', si: 'Host memory locked so the operating system does not move it; this can speed up GPU transfers.' },
        { en: 'GPUDirect Storage', si: 'NVIDIA technology that can read data from storage to GPU memory without routing it through CPU RAM.' },
      ],
      si: 'ඔයාගේ computer එකේ CPU එකට RAM තියෙනවා, GPU එකට VRAM තියෙනවා. කොළඹින් මහනුවරට බඩු ගෙනියනවා වගේ data එක PCIe හරහා GPU එකට යවන්න වෙලාව යනවා. 8 GB data එක එක පාරක් යවලා GPU එකේ operations 20ක් කළොත් නැවත නැවත ගෙනියන වියදම අඩුයි. .to_pandas() වගේ එකකින් ලොකු data ආයෙත් CPU එකට ගෙනියන එකෙන් වේග වාසිය නැති වෙන්න පුළුවන්.',
    },
    {
      id: 'cudf-and-cupy',
      plain: "cuDF provides GPU DataFrames with a pandas-like API; CuPy provides GPU n-dimensional arrays with a NumPy-like API. Similar syntax does not mean complete behavioral identity.",
      internGuide: ["cuDF provides GPU DataFrames with a pandas-like API; CuPy provides GPU n-dimensional arrays with a NumPy-like API. Similar syntax does not mean complete behavioral identity.","Use cuDF for columnar parsing, filtering, joins, grouping, and strings; use CuPy for dense numerical array operations. Interchange through supported device protocols can avoid host copies.","Check dtypes, null semantics, ordering, random behavior, and unsupported operations. A result can differ slightly because algorithms and floating-point reduction order differ.","Start with a large hot section, keep its data on device, test equivalence, then benchmark. Do not convert every small helper operation merely because a GPU library exists."],
      title: 'cuDF (GPU DataFrames) and CuPy (GPU NumPy)',
      body: [
        'cuDF is the RAPIDS GPU DataFrame library. Its API is designed to resemble pandas: it supports operations such as read_csv, read_parquet, filtering, groupby, merge, sort_values, string methods (.str), and datetime methods (.dt). If you know pandas, replacing import pandas as pd with import cudf lets you reuse much of your code.',
        'cuDF is not identical to pandas. Row-by-row iteration such as iterrows is not a good fit for a GPU, some operations may return results in a different order (for example, groupby results may not be sorted unless you request sort=True), and some pandas features may not be supported. Check the documentation for your installed version.',
        'CuPy is NumPy for the GPU. It uses familiar syntax such as cp.array, cp.sum, cp.dot, random-number generation, and linear algebra. cp.asarray(numpy_array) copies from CPU to GPU; cp.asnumpy(gpu_array) copies from GPU to CPU. You can convert a cuDF column to a CuPy array with .to_cupy() or .values while keeping it on the GPU.',
        'GPU libraries such as cuDF, CuPy, cuML, and PyTorch can share data in GPU memory. Standards such as the CUDA Array Interface and DLPack allow them to share the same buffer without a copy (see Phase 17). This lets you create features in cuDF, calculate with CuPy, and pass the result to cuML without moving it to the CPU.',
      ],
      analogy: 'pandas and cuDF are like petrol and hybrid versions of the same Toyota model: the steering wheel, gear, and pedals (the API) are in familiar places, but the engine (CPU or GPU) differs. Some hybrid controls may still be different, so check the manual.',
      example: 'Suppose a Dialog- or Mobitel-like operator has 200 million call records. Read them with cudf.read_parquet(), calculate gdf["duration_min"] = gdf["seconds"] / 60, then group and sum by tower_id. Only a few characters differ from pandas code. CuPy can also perform math such as a distance-matrix calculation on the GPU.',
      code: {
        lang: 'python',
        src: `import cudf, cupy as cp

gdf = cudf.read_csv("calls.csv")                 # GPU DataFrame
gdf["minutes"] = gdf["seconds"] / 60              # same style as pandas
top = gdf.groupby("tower_id", sort=True)["minutes"].sum().nlargest(5)

x = gdf["minutes"].to_cupy()                      # CuPy array remains on GPU
z = (x - x.mean()) / x.std()                      # z-score, calculated on GPU
print(float(z.max()))                             # copy only one number to CPU

a = cp.random.rand(4000, 4000)                    # CuPy = NumPy on the GPU
b = cp.asnumpy(a @ a)                             # copy the result to CPU (NumPy)`,
      },
      keyPoints: [
        'cuDF is a GPU DataFrame with a pandas-like API.',
        'CuPy provides GPU arrays with a NumPy-like API.',
        'cuDF is not identical to pandas: ordering, iterrows, and some features differ.',
        'GPU libraries can share data without copying via CUDA Array Interface / DLPack.',
      ],
      terms: [
        { en: 'cuDF', si: 'The RAPIDS GPU DataFrame library, with a pandas-like API.' },
        { en: 'CuPy', si: 'A GPU array library compatible with NumPy-style operations.' },
        { en: 'cp.asarray / cp.asnumpy', si: 'Functions that copy arrays from NumPy to GPU or from GPU to NumPy.' },
        { en: 'CUDA Array Interface', si: 'A standard for sharing GPU memory buffers between Python GPU libraries.' },
        { en: 'Zero-copy', si: 'Sharing access to the same memory with another library instead of copying the data.' },
      ],
      si: 'ඔයා pandas දන්නවා නම් cuDF එකේ read_csv, groupby, merge වගේ වැඩ හුරුපුරුදුයි, හැබැයි GPU එකේ ධාවනය වෙනවා. Dialog වගේ දුරකථන ජාලයක call records මිලියන 200ක් tower එක අනුව එකතු කරන්න පුළුවන්. CuPy එක NumPy වගේ GPU arrays එක්ක වැඩ කරනවා. cuDF සහ CuPy අතර data share කළාම CPU එකට හැමවිටම ආපහු යවන්න අවශ්‍ය නැහැ.',
    },
    {
      id: 'cudf-pandas-accelerator',
      plain: "cudf.pandas intercepts pandas operations, runs supported work with cuDF, and falls back to pandas for unsupported work. It must be enabled before pandas is imported.",
      internGuide: ["cudf.pandas intercepts pandas operations, runs supported work with cuDF, and falls back to pandas for unsupported work. It must be enabled before pandas is imported.","Fallback preserves broader API coverage but may move data and hide a performance cliff. Zero code change means API convenience, not guaranteed GPU execution or speedup.","Use the cudf.pandas profiler to see GPU versus CPU operations; rewrite costly fallback sections or intentionally keep the workflow on CPU.","Validate outputs and benchmark end to end. Unsupported custom Python functions, small inputs, or frequent fallback may erase acceleration."],
      title: 'cudf.pandas: Zero-Code-Change Acceleration and CPU Fallback',
      body: [
        'A company may have thousands of lines of pandas code that would be difficult to rewrite for cuDF. cudf.pandas addresses this: leave import pandas as pd in your code and load the accelerator before importing pandas. In Jupyter, use %load_ext cudf.pandas; for a script, use python -m cudf.pandas my_script.py.',
        'Internally, a pd.DataFrame is a proxy object. For each operation, cudf.pandas tries to run it with cuDF on the GPU. If cuDF does not support the operation or it fails on the GPU, the data is moved to the CPU and ordinary pandas handles it; this is called a fallback. The result remains pandas-compatible, but the speed can differ.',
        'Fallbacks are safe but not free: each one may copy data from GPU to CPU and sometimes back again. Many fallbacks can reduce the speedup or make the workflow slower than pandas. Use a profiler to see which operations ran on the GPU and which fell back to the CPU (for example, the %%cudf.pandas.profile cell magic in Jupyter; check the exact name and options for your version).',
        'Use cudf.pandas to accelerate existing pandas code quickly, especially when third-party libraries expect pandas DataFrames. Use cuDF directly for new GPU-first code when you want to ensure each operation runs on the GPU.',
      ],
      analogy: 'Imagine ordering food through Uber Eats: the app (pandas API) is unchanged and first tries the nearby fast shop (GPU). If that shop cannot make the dish, the order goes to a farther shop (CPU). You get the same food, but delivery takes longer; if every order takes the slower route, the service is no longer fast.',
      example: 'A 30-cell pandas pipeline takes 12 minutes on the CPU. Load %load_ext cudf.pandas in the first Jupyter cell, restart, and run it again. Suppose the profiler shows 95% of operations on the GPU and one custom .apply() falling back to CPU, with total time under one minute. You could then vectorize that .apply() and remove the remaining fallback.',
      code: {
        lang: 'python',
        src: `        # Jupyter: run in the first cell, before importing pandas
%load_ext cudf.pandas
        import pandas as pd            # now a GPU-accelerated proxy

df = pd.read_csv("keells_bills.csv")
        by_cat = df.groupby("category")["amount"].sum()   # on GPU when supported

        # For a script, without changing its code:
#   python -m cudf.pandas etl.py
        # Fallback: unsupported operations run with CPU pandas;
        #           the result is the same, but transfers can make it slower.`,
      },
      keyPoints: [
                'cudf.pandas runs pandas code on a GPU without requiring code changes.',
                'Load it before importing pandas (%load_ext cudf.pandas / python -m cudf.pandas).',
                'Unsupported operations fall back to CPU pandas and preserve the result.',
                'Many fallbacks and copies can reduce speedup; inspect them with a profiler.',
      ],
      terms: [
                { en: 'cudf.pandas', si: 'A cuDF accelerator mode that runs code through the pandas API on a GPU.' },
                { en: 'Fallback', si: 'Automatically running an operation with CPU pandas when it cannot run on the GPU.' },
                { en: 'Proxy Object', si: 'A wrapper that behaves like a pandas object while routing work to a GPU or CPU object internally.' },
                { en: 'Profiler', si: 'A tool that shows where operations ran (GPU or CPU) and how long they took.' },
                { en: 'cuml.accel', si: 'A cuML mode, available in newer cuML versions, that can accelerate scikit-learn code without changing it.' },
      ],
              si: 'ඔයාට cells 30ක pandas notebook එකක් තියෙනවා නම් cudf.pandas දාලා මුල් code එකම GPU එකේ උත්සාහ කරලා බලන්න පුළුවන්. කොළඹ supermarket bill එකේ category අනුව එකතුව ගන්න groupby එක support නම් GPU එකේ ධාවනය වෙනවා. සමහර custom operation එකක් support නැත්නම් CPU pandas එකට fallback වෙනවා. Profiler එකෙන් ඒක හොයාගෙන fallback අඩු කරගන්න.',
            },
    {
      id: 'file-formats-parquet-arrow',
      plain: "CSV is human-readable text with weak type information and expensive parsing. Parquet and ORC are compressed columnar file formats designed for analytical scans.",
      internGuide: ["CSV is human-readable text with weak type information and expensive parsing. Parquet and ORC are compressed columnar file formats designed for analytical scans.","Columnar formats support reading selected columns and, with suitable metadata, skipping row groups that cannot match filters. File layout and partitioning determine whether this helps.","Apache Arrow defines an in-memory columnar format and interchange interfaces; it is not simply another disk file format, although Arrow IPC/Feather can persist Arrow data.","Prefer Parquet/ORC for repeated analytics, choose practical file sizes, preserve schema/nulls/timezones, and measure compression, scan speed, and downstream compatibility."],
      title: 'File Formats: CSV vs Parquet, ORC, and Apache Arrow',
      body: [
        'CSV is a simple text file: it is easy to read and supported by many tools. For large datasets, it has drawbacks: numbers are stored as text (which takes space), there are no built-in types (the reader must infer whether a value is a date or string), and the whole file may need to be read even when you need only one column.',
        'Parquet is a columnar format: it stores data column by column rather than row by row. This enables column pruning (read only “amount” and “district” if those are all you need), compression (values of the same type are stored together, so Snappy or Zstandard can work well and make files smaller than CSV), and a schema that records the data types.',
        'Parquet also supports predicate pushdown. Files are divided into row groups with statistics such as each column’s minimum and maximum. If you ask for only rows where year == 2025, the reader can skip row groups that cannot contain 2025. ORC is another columnar format from the Hadoop / Hive ecosystem, and cuDF can read it.',
        'Apache Arrow is not a disk format; it is a standard in-memory columnar representation. Tools such as pandas (with a pyarrow backend), Polars, Spark, and cuDF use Arrow-style layouts, which can let them exchange data without converting it to rows and often without copying. cuDF can work with Arrow tables through cudf.DataFrame.from_arrow() and .to_arrow(); this conversion can involve a CPU-GPU copy.',
      ],
      analogy: 'CSV is like a large A/L results register: even if you need only mathematics marks, you may have to scan every page. Parquet is like keeping a separate file for each subject, so you read only the mathematics column. If a file’s cover says its marks range from 40 to 75, you can skip it when searching for marks above 90—this is predicate pushdown.',
      example: 'Consider 50 million sales rows and 20 columns. CSV might take about 6 GB; the same data in Snappy-compressed Parquet might take about 1–1.5 GB, depending on the data. A query for the 2025 Colombo sales total may have to read and parse all 6 GB from CSV. Parquet may read only 3 columns and only row groups that could include 2025, reducing the data read by more than ten times.',
      code: {
        lang: 'python',
        src: `import cudf

# Convert the CSV to Parquet once and keep it for later use
gdf = cudf.read_csv("sales.csv", parse_dates=["date"])
gdf.to_parquet("sales.parquet", compression="snappy")

# On read: select only needed columns and push the filter into the reader
gdf = cudf.read_parquet(
    "sales.parquet",
    columns=["date", "district", "amount"],
    filters=[("district", "==", "Colombo")],
)
tbl = gdf.to_arrow()   # Arrow table (may copy data from GPU to CPU)`,
      },
      keyPoints: [
        'CSV is text, has no built-in types, and may require reading the whole file.',
        'Parquet provides columns, compression, a schema, and predicate pushdown.',
        'ORC is a columnar format from the Hive ecosystem; Arrow is an in-memory columnar standard.',
        'Parquet is a strong default for GPU analytics pipelines.',
      ],
      terms: [
        { en: 'Columnar Format', si: 'A way to store data column by column, which is useful for analytics.' },
        { en: 'Column Pruning', si: 'Reading only the required columns and skipping the others.' },
        { en: 'Predicate Pushdown', si: 'Passing a filter to the file reader so it can skip data that does not match.' },
        { en: 'Row Group', si: 'A group of rows in a Parquet file, with statistics such as minimum and maximum values.' },
        { en: 'ORC', si: 'Optimized Row Columnar, a columnar file format used in Hadoop and Hive ecosystems.' },
        { en: 'Apache Arrow', si: 'A language-independent standard for in-memory columnar data.' },
      ],
      si: 'ඔයාට Colombo supermarket එකේ 2025 sales විතරක් хараන්න ඕනේ නම් CSV එක බොහෝ විට මුළු file එකම කියවයි. Parquet එකේ columns වෙන වෙනම නිසා date, district, amount විතරක් කියවන්න පුළුවන්. 50 million rows තියෙන file එකක් 6 GB CSV වෙනුවට 1–1.5 GB Parquet වෙන්න පුළුවන්, data එක අනුව. Parquet row group එකක year 2025 නැත්නම් ඒ කොටස අතහරින්න reader එකට පුළුවන්.',
    },
    {
      id: 'dask-multi-gpu-etl',
      plain: "Dask represents a lazy task graph; dask-cuDF partitions a DataFrame so cuDF work can run across workers. LocalCUDACluster commonly creates one worker per visible GPU.",
      internGuide: ["Dask represents a lazy task graph; dask-cuDF partitions a DataFrame so cuDF work can run across workers. LocalCUDACluster commonly creates one worker per visible GPU.","Nothing substantial runs until compute or persist is called. Inspect the graph and avoid repeated computation; persist reused intermediate data only when memory allows.","Partitions must be large enough for efficient GPU work but small enough to fit with temporary allocations. Shuffles and skew can dominate joins and group-bys.","Use the dashboard to inspect task time, transfers, spilling, and worker balance. Configure memory limits/spilling deliberately and benchmark against single-GPU cuDF first."],
      title: 'GPU ETL with Dask: dask-cudf, Partitions, Lazy Evaluation, LocalCUDACluster',
      body: [
        'ETL means Extract (get data), Transform (clean, join, and create features), and Load (store the result). Use Dask when the data is larger than one GPU’s memory or when you have multiple GPUs. Dask is a Python library that splits work into tasks and distributes them among workers.',
        'A Dask DataFrame is a collection of smaller DataFrames called partitions. With dask-cudf, each partition is a cuDF DataFrame, so it must fit in GPU memory. Tiny partitions add scheduling overhead; partitions that are too large can fill memory. Operations such as groupby and join may require a costly shuffle that moves data between partitions.',
        'Dask is lazy. Writing ddf[ddf.amount > 0].groupby(...).sum() builds a task graph (a list of planned work) but does not calculate the result yet. .compute() runs the graph and returns the result, while .persist() keeps the result in workers’ GPU memory for reuse. Because execution is delayed, Dask can inspect and optimize the full plan, for example by reading only required columns.',
        'On a machine with multiple GPUs, dask_cuda.LocalCUDACluster() creates one worker per GPU; then connect with Client(cluster). For multiple nodes, commands such as dask-scheduler and dask-cuda-worker can form a cluster. The Dask dashboard (often on port 8787) shows worker activity. Recent Dask versions can also use cuDF as a dask.dataframe backend; check documentation because APIs change across versions.',
      ],
      analogy: 'A Vesak dansal needs 40,000 rice packets, too many for one kitchen (one GPU). Dask is the coordinator: it splits the work into partitions and assigns them to four kitchens (four GPUs). It first writes the plan (a lazy task graph); cooking starts only when you say “go” (.compute()). Moving ingredients between kitchens (a shuffle) takes extra time.',
      example: 'Suppose Sri Lanka Railway ticket data totals 100 GB in 400 Parquet files, and you have four GPUs with 24 GB each. dask_cudf.read_parquet("tickets/*.parquet") creates 400 partitions. Defining ddf.groupby("station")["fare"].sum() does not run it; .compute() reads about 100 partitions per GPU, calculates partial sums, and combines them into a small cuDF DataFrame for 400 stations.',
      code: {
        lang: 'python',
        src: `from dask_cuda import LocalCUDACluster
from dask.distributed import Client
import dask_cudf

cluster = LocalCUDACluster()          # one worker per GPU
client = Client(cluster)               # dashboard: client.dashboard_link

ddf = dask_cudf.read_parquet("tickets/*.parquet")   # lazy, many partitions
print(ddf.npartitions)

clean = ddf[ddf["fare"] > 0].persist()               # keep in GPU memory
totals = clean.groupby("station")["fare"].sum()      # still lazy (task graph)
result = totals.compute()                            # now it runs`,
      },
      keyPoints: [
        'Dask splits work into partitions and distributes them across workers / GPUs.',
        'A dask-cudf partition is a cuDF DataFrame.',
        'Lazy evaluation builds a task graph; .compute() runs it and .persist() stores results.',
        'LocalCUDACluster creates a worker per GPU on one machine; shuffles are costly.',
      ],
      terms: [
        { en: 'ETL', si: 'A pipeline that extracts data, transforms it, and loads or stores the result.' },
        { en: 'Dask', si: 'A Python parallel-computing library that distributes work across cores, GPUs, and machines.' },
        { en: 'dask-cudf', si: 'A Dask DataFrame implementation whose partitions are cuDF DataFrames.' },
        { en: 'Partition', si: 'A smaller piece of a large DataFrame that a worker processes.' },
        { en: 'Lazy Evaluation', si: 'Building a plan first and delaying the calculation until a result is requested.' },
        { en: 'Task Graph', si: 'A Dask plan that shows tasks and the dependencies between them.' },
        { en: 'LocalCUDACluster', si: 'A dask-cuda class that creates a Dask worker for each GPU on one machine.' },
        { en: 'Shuffle', si: 'Redistributing data among partitions, often for groupby, join, or sort; it can use substantial network and memory resources.' },
      ],
      si: 'ඔයාට railway ticket data 100 GBක් GPUs 4කින් හසුරුවන්න ඕනේ කියලා හිතන්න. Dask එක ඒක partitions 400කට බෙදලා වැඩ බෙදා දෙයි. .groupby() ලියනකොට task plan එක විතරයි හැදෙන්නේ; .compute() කිව්වම තමයි වැඩ පටන් ගන්නේ. Vesak dansal kitchens හතරක් අතර ingredients බෙදනවා වගේ, shuffle එකකදී partitions අතර data යැවීම කාලය ගන්නවා.',
    },
    {
      id: 'spark-rapids-accelerator',
      plain: "The NVIDIA cuDF plugin for Apache Spark can replace supported Spark SQL/DataFrame operators with GPU implementations while keeping Spark’s execution model.",
      internGuide: ["The NVIDIA cuDF plugin for Apache Spark can replace supported Spark SQL/DataFrame operators with GPU implementations while keeping Spark’s execution model.","Support is operation-, type-, and configuration-specific. Unsupported parts remain on CPU, and transitions can reduce gains. Python UDFs commonly prevent useful acceleration.","Inspect the physical plan and enable the plugin’s explain output to learn which operators run on GPU and why others do not.","Tune partition sizes, shuffle, file format, executor GPU allocation, and concurrent tasks from measurements. Validate result compatibility before using accelerated production plans."],
      title: 'GPU ETL with Apache Spark: RAPIDS Accelerator for Apache Spark',
      body: [
        'Many large banks, telecom companies, and e-commerce businesses already use Apache Spark. Spark runs SQL and DataFrame jobs across clusters of many machines using PySpark, Scala, or SQL, so these teams may not need to switch to Python Dask.',
        'RAPIDS Accelerator for Apache Spark is a Spark plugin. Add the plugin to the configuration (spark.plugins=com.nvidia.spark.SQLPlugin) and run on a GPU-equipped cluster; it can move supported query-plan operations—such as scans, filters, joins, aggregations, and sorts—to GPUs. Unsupported operations continue to run on CPUs, so job code may need few or no changes.',
        'A Spark shuffle, which moves data between machines, can be expensive. The RAPIDS Accelerator offers faster shuffle options. Use explain output and the plugin’s explain configuration to inspect which plan operations run on GPUs. Python UDFs (functions you write yourself) generally do not run on GPUs, so prefer built-in Spark functions when they meet your needs.',
        'Choose Dask for a Python team using pandas / cuDF / cuML on one machine or a small cluster. Choose the RAPIDS Accelerator for Spark when you already use Spark, Databricks, a Hadoop data lake, substantial SQL, or a large JVM-based cluster. Speedup depends on the workload: jobs with many joins or aggregations may benefit, while small jobs may not.',
      ],
      analogy: 'A large garment factory (a Spark cluster) has hundreds of machines. The RAPIDS Accelerator is like a turbo motor added to suitable machines: workers (your code) keep working as before, while supported jobs such as cutting and sewing run faster. Manual jobs that do not fit the motor (UDFs) continue at the old speed.',
      example: 'A Spark ETL job over 2 billion card transactions takes 3 hours on 20 CPU nodes. With the plugin enabled on GPU nodes, joins and aggregations in the query plan move to GPUs, which may speed up the job and reduce cluster cost. One custom Python UDF remains a CPU bottleneck; rewriting it with built-in functions may let that part run on GPUs too.',
      code: {
        lang: 'python',
        src: `from pyspark.sql import SparkSession, functions as F

# The RAPIDS Accelerator plugin JAR must be installed on the cluster
spark = (SparkSession.builder
         .config("spark.plugins", "com.nvidia.spark.SQLPlugin")
         .config("spark.rapids.sql.enabled", "true")   # enable GPU SQL
         .getOrCreate())

df = spark.read.parquet("s3://bank/txns/")          # ordinary Spark job code
daily = df.groupBy("branch", "date").agg(F.sum("amount").alias("total"))
daily.explain()          # check for GPU operators (Gpu...) in the plan
daily.write.parquet("s3://bank/daily/")`,
      },
      keyPoints: [
        'The RAPIDS Accelerator for Apache Spark is a plugin that may require few or no job-code changes.',
        'Supported SQL / DataFrame operations run on GPUs; unsupported ones run on CPUs.',
        'Python UDFs generally do not run on GPUs; use built-in functions when possible.',
        'Use Dask for a Python ecosystem; use the Spark plugin when Spark / a data lake is already in place.',
      ],
      terms: [
        { en: 'Apache Spark', si: 'A platform for running large-data SQL / DataFrame jobs across a cluster of machines.' },
        { en: 'RAPIDS Accelerator for Apache Spark', si: 'An NVIDIA plugin that runs supported Spark SQL / DataFrame operations on GPUs.' },
        { en: 'Query Plan', si: 'The steps Spark plans to use for a query; inspect it with explain().' },
        { en: 'UDF', si: 'A User Defined Function: a function you write yourself, which may be harder for Spark to optimize.' },
      ],
      si: 'ඔයාගේ bank එක Spark cluster එකක card transactions බිලියන 2ක් process කරනවා කියලා හිතන්න. RAPIDS plugin එක දාද්දී support කරන joins සහ aggregations GPU එකට යන්න පුළුවන්, නමුත් හැම operation එකක්ම GPU එකට යන්නේ නැහැ. Python UDF එකක් CPU එකේම ඉන්න ඉඩ තියෙන නිසා built-in Spark functions බලන්න. Explain plan එකෙන් GPU operators තියෙනවද පරීක්ෂා කරන්න.',
    },
    {
      id: 'gpu-feature-engineering-imbalance',
      plain: "Feature engineering converts raw columns into signals a model can use: cleaned categories, scaled numbers, time features, aggregates, and domain-specific interactions. Fit transformations only on training data.",
      internGuide: ["Feature engineering converts raw columns into signals a model can use: cleaned categories, scaled numbers, time features, aggregates, and domain-specific interactions. Fit transformations only on training data.","GPU DataFrames can accelerate large joins, windows, encoders, and aggregations, but high-cardinality expansions may exhaust memory. Use pipelines so training and inference apply identical logic.","For class imbalance, begin with stratified splits and suitable metrics. Options include class/sample weights, resampling, threshold tuning, and anomaly approaches; each changes the learning problem.","Never balance the validation/test set to look artificial. Evaluate calibration and business costs, and inspect performance across meaningful subgroups."],
      title: 'Feature Engineering on GPU and Handling Class Imbalance',
      body: [
        'Feature engineering creates useful columns from raw data that a model can learn from (review encoding and scaling in Phase 1). On a GPU, cuDF can use vectorized operations to extract hour, weekday, or month from datetimes (.dt); calculate customer aggregates such as average bill and transaction count and merge them; create lag features with groupby + shift; one-hot encode with cudf.get_dummies; and clean strings with methods such as .str.lower and .str.contains. cuML also provides preprocessing tools such as scalers, encoders, and TargetEncoder.',
        'Target encoding replaces a category with the average target for that category. It can be useful but risks leakage: calculate it only within training folds and never include test targets. For time-based features, do not use information that would become available only after the prediction time.',
        'Class imbalance means one class is rare, such as fraud making up 0.5% of transactions. A model that always predicts “not fraud” gets 99.5% accuracy but catches no fraud. Options include (1) stratified splits / CV to preserve the class ratio in each fold; (2) class weights that penalize rare-class errors more, such as starting XGBoost scale_pos_weight near the number of negatives divided by positives; and (3) resampling by undersampling the majority class, oversampling the minority, or generating synthetic samples such as SMOTE. Resample training data only.',
        'Also choose suitable metrics: precision, recall, F1, or PR-AUC instead of accuracy alone, and tune the decision threshold on validation data rather than assuming the default 0.5 fits the business need. GPUs can make it practical to try many features and combinations quickly, improving a data scientist’s iteration speed.',
      ],
      analogy: 'In a 600-ball cricket match with only 3 wickets, someone who predicts “no wicket on every ball” is right on 99.5% of balls but predicts no wickets. A selector wants to find a bowler who takes wickets, so they check how many wickets were caught (recall) and how many predicted wickets were real (precision).',
      example: 'A bank has 10 million transactions, including 50,000 fraud cases (0.5%). There are 9,950,000 negatives; 9,950,000 ÷ 50,000 = 199, so you might start tuning XGBoost with scale_pos_weight=199. Possible features include each customer’s transaction count over 24 hours (groupby + rolling), the current amount divided by their average, and whether the time is between midnight and 4 a.m. A threshold with recall 0.85 and precision 0.40 is an illustrative example, not a promised result.',
      code: {
        lang: 'python',
        src: `import cudf

tx = cudf.read_parquet("txns.parquet")
tx["hour"] = tx["ts"].dt.hour                          # datetime feature
tx["is_night"] = (tx["hour"] < 5).astype("int8")
stats = tx.groupby("card_id").agg({"amount": ["mean", "count"]})
stats.columns = ["card_avg", "card_cnt"]               # customer aggregates
tx = tx.merge(stats, left_on="card_id", right_index=True, how="left")
tx["amt_ratio"] = tx["amount"] / tx["card_avg"]        # amount relative to the average
tx = tx.sort_values(["card_id", "ts"])
tx["prev_amt"] = tx.groupby("card_id")["amount"].shift(1)  # lag feature

pos = int(tx["is_fraud"].sum()); neg = len(tx) - pos
print("Suggested starting scale_pos_weight:", neg / pos)`,
      },
      keyPoints: [
        'GPU feature engineering uses cuDF vectorized operations: .dt, groupby + merge, shift, get_dummies, and .str.',
        'Watch for leakage in target encoding and time-based features.',
        'For imbalance, use stratified splits, class weights (scale_pos_weight), or resampling on training data only.',
        'Use precision / recall / F1 / PR-AUC instead of accuracy alone, and tune the threshold.',
      ],
      terms: [
        { en: 'Feature Engineering', si: 'Creating useful new columns from raw data for a model.' },
        { en: 'Target Encoding', si: 'Replacing a category with its average target value; it can introduce leakage.' },
        { en: 'Class Imbalance', si: 'One class having far fewer samples than the other classes.' },
        { en: 'scale_pos_weight', si: 'An XGBoost weight for the positive class, used to address imbalance.' },
        { en: 'SMOTE', si: 'An oversampling method that creates synthetic samples between minority-class examples.' },
        { en: 'Undersampling / Oversampling', si: 'Reducing majority-class samples / increasing minority-class samples.' },
      ],
      si: 'ඔයාගේ bank එකේ transactions මිලියන 10කින් 50,000ක් විතරක් fraud නම්, හැම එකක්ම “fraud නෑ” කියන model එකට 99.5% accuracy ලැබෙයි, නමුත් fraud එකක්වත් අල්ලන්නේ නැහැ. XGBoost එකේ negatives 9,950,000 ÷ positives 50,000 = 199 නිසා scale_pos_weight 199කින් පටන්ගෙන පරීක්ෂා කළ හැකියි. Cricket balls 600ක wickets 3ක් විතරක් තියෙනවා නම් wickets අල්ලන එක වැදගත්, ඒ නිසා recall සහ precision බලන්න. Training data එකට විතරක් resampling කරන්න.',
    },
    {
      id: 'cuml-and-gpu-xgboost',
      plain: "cuML provides GPU implementations of many familiar estimators; XGBoost has GPU training options. Supported parameters, algorithms, and output details can differ from CPU libraries.",
      internGuide: ["cuML provides GPU implementations of many familiar estimators; XGBoost has GPU training options. Supported parameters, algorithms, and output details can differ from CPU libraries.","GPU speedups are most useful for sufficiently large data or repeated training. Data preparation and cross-validation may become the bottleneck after training accelerates.","Use device-resident inputs where possible, set reproducible seeds, monitor GPU memory, and compare predictive quality—not bit-for-bit model identity.","cuml.accel can accelerate supported scikit-learn calls and fall back for others. Profile fallback, pin library versions, and test serialization/inference in the target environment."],
      title: 'Machine Learning with RAPIDS: cuML Estimators and XGBoost on GPU',
      body: [
        'cuML is RAPIDS’ GPU machine-learning library, with a scikit-learn-like API: create an estimator, then call .fit(X, y), .predict(X), .predict_proba(X), or .transform(X). Algorithms include LinearRegression, LogisticRegression, Ridge, Lasso, RandomForestClassifier / Regressor, KMeans, DBSCAN, HDBSCAN, NearestNeighbors, PCA, TruncatedSVD, UMAP, t-SNE, and SVC. It accepts cuDF, CuPy, NumPy, and pandas inputs; NumPy and pandas data must be copied to the GPU.',
        'Check the output type: cuML generally returns a type compatible with its input (for example, cuDF for cuDF input). Results such as accuracy may not be bit-for-bit identical to scikit-learn because implementations can differ; for example, cuML random forests use histograms / bins to find splits. Similar quality is possible, and training on large datasets may be more than ten times faster, depending on the workload and hardware.',
        'Gradient-boosted trees are often strong models for tabular data. With XGBoost 2.0 and later, use device="cuda" and tree_method="hist" to run on a GPU; older versions used tree_method="gpu_hist". XGBoost can accept cuDF DataFrames directly, keeping data on the GPU. LightGBM and CatBoost also have GPU modes. XGBoost can also be used for multi-GPU training with Dask.',
        'After training, cuML’s Forest Inference Library (FIL) can accelerate prediction for large tree models on a GPU. The FIL backend in Triton Inference Server can serve XGBoost, LightGBM, and random-forest models (see Phase 9). Newer cuML versions also provide cuml.accel, a mode for accelerating scikit-learn code without changing it, with CPU fallback for unsupported operations, similar to cudf.pandas.',
      ],
      analogy: 'scikit-learn and cuML are like two restaurants with the same menu: both can serve a random forest. The cuML kitchen has thousands of cooks (GPU cores), so a large order may arrive faster. The flavor may differ slightly (results are not bit-for-bit identical), but it is the same kind of dish.',
      example: 'Consider a loan-default dataset with 20 million rows and 40 features. If scikit-learn RandomForest takes 30 minutes on a 16-core CPU, cuML RandomForest might take 1–2 minutes on a GPU, depending on hardware. XGBoost with device="cuda" may also be several times faster than CPU hist. Time saved could let you run 100 experiments instead of 10.',
      code: {
        lang: 'python',
        src: `import cudf, xgboost as xgb
from cuml.model_selection import train_test_split
from cuml.ensemble import RandomForestClassifier
from cuml.metrics import accuracy_score

df = cudf.read_parquet("loans.parquet")
X, y = df.drop(columns="default").astype("float32"), df["default"].astype("int32")
X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=42)

rf = RandomForestClassifier(n_estimators=200, max_depth=12)   # similar to sklearn
rf.fit(X_tr, y_tr)
print("RF acc:", accuracy_score(y_te, rf.predict(X_te)))

xgbm = xgb.XGBClassifier(device="cuda", tree_method="hist", n_estimators=500)
xgbm.fit(X_tr, y_tr)                 # cuDF input directly, boosting on GPU`,
      },
      keyPoints: [
        'cuML has a scikit-learn-like fit / predict / transform API and runs algorithms on GPUs.',
        'Results may not be bit-for-bit identical to scikit-learn even when model quality is similar.',
        'For XGBoost GPU use, set device="cuda" and tree_method="hist" (version 2.0+); cuDF can be passed directly.',
        'FIL accelerates tree-model inference; cuml.accel can run supported scikit-learn code without code changes.',
      ],
      terms: [
        { en: 'cuML', si: 'The RAPIDS GPU machine-learning library with a scikit-learn-like API.' },
        { en: 'Estimator', si: 'An object, such as a model or transformer, that learns from data through fit().' },
        { en: 'XGBoost', si: 'A popular gradient-boosted tree library; device="cuda" enables GPU training in supported versions.' },
        { en: 'FIL (Forest Inference Library)', si: 'A cuML component for fast GPU prediction with tree-ensemble models.' },
        { en: 'UMAP / t-SNE', si: 'Methods that reduce high-dimensional data to 2D or 3D for visualization; cuML has GPU versions.' },
      ],
      si: 'ඔයාට loan default data rows මිලියන 20ක් සහ features 40ක් තියෙනවා කියලා හිතන්න. cuML ရဲ့ RandomForestClassifier එක .fit() සහ .predict() වගේ scikit-learn API භාවිතා කරලා GPU එකේ model එකක් හදන්න පුළුවන්. XGBoost 2.0+ වල device="cuda" දාද්දී GPU භාවිතා කරනවා. ප්‍රතිඵල scikit-learn එකට හැම bit එකකින්ම සමාන නොවුණත්, වේගය සහ model quality වෙන වෙනම මැනලා බලන්න.',
    },
    {
      id: 'hpo-cross-validation-metrics',
      plain: "Hyperparameter optimization repeatedly trains and evaluates configurations. Define the search space, objective, budget, pruning rule, and reproducible split before launching GPU trials.",
      internGuide: ["Hyperparameter optimization repeatedly trains and evaluates configurations. Define the search space, objective, budget, pruning rule, and reproducible split before launching GPU trials.","Cross-validation estimates variation across folds, but time series, groups, customers, or locations require splitters that respect dependence and prevent leakage.","Parallel trials compete for GPU memory and can be slower than scheduled sequentially. Assign resources per trial and record failures, seeds, versions, and total compute.","Choose metrics from the decision: precision/recall, PR-AUC for rare positives, ROC-AUC for ranking, calibration for probabilities, and cost-weighted thresholds for operations."],
      title: 'Hyperparameter Tuning (Optuna / HPO on GPU), Cross-Validation, and Evaluation Metrics',
      body: [
        'Hyperparameters are settings you choose before training, such as the number of trees, max_depth, and learning_rate. Search options include grid search (try every combination, which can be many), random search (try random combinations and often find good results sooner), and Bayesian / TPE search (learn from earlier trials to choose promising next trials). Optuna is a popular library for this smart search and can prune unpromising trials early.',
        'A GPU can help with hyperparameter optimization (HPO). If one CPU trial takes 10 minutes, 100 trials take about 16 hours; if one GPU trial takes 1 minute, 100 trials take about 2 hours. With several GPUs, Dask or Ray Tune can run trials in parallel. Load data onto the GPU once and reuse it across trials when possible.',
        'In k-fold cross-validation, split data into k parts (for example, 5), validate on one part and train on the rest, then repeat k times and average the scores. This is often more reliable than one split. Use StratifiedKFold for imbalanced data, TimeSeriesSplit for time series (do not train on the future), and GroupKFold when many rows belong to the same customer. Do HPO using validation / CV scores and evaluate the final test set only once after choices are complete.',
        'Metrics: classification can use accuracy (mainly for balanced data), precision (among predicted positives, how many are correct), recall (among actual positives, how many were found), F1 (a balance of precision and recall), ROC-AUC, PR-AUC (useful for imbalance), and log loss. Regression can use MAE (average error, easy to interpret), RMSE (penalizes larger errors more), and R² (variance explained). Clustering can use silhouette score. cuML.metrics can compute many of these on GPUs.',
      ],
      analogy: 'Hyperparameter tuning is like adjusting a kottu recipe: choose the amount of chilli, salt, and heat. Trying every combination (grid search) may take days. Optuna is like an experienced cook who learns from earlier attempts—“that was too spicy, so use less chilli next time.” Cross-validation is like asking five people to taste it and averaging their feedback.',
      example: 'Run 60 Optuna trials for XGBoost with max_depth 3–12, learning_rate 0.01–0.3, and n_estimators 100–1000, using 5-fold CV. On CPU, if each of five folds takes 2 minutes, one trial takes 10 minutes and all trials take 10 hours. If each GPU fold takes 15 seconds, a trial takes 1.25 minutes and all trials take under an hour. An illustrative best trial has max_depth 7, learning_rate 0.05, and CV PR-AUC 0.61; the one-time test score is 0.59.',
      code: {
        lang: 'python',
        src: `import optuna, xgboost as xgb
from sklearn.model_selection import StratifiedKFold, cross_val_score

def objective(trial):
    params = dict(
        max_depth=trial.suggest_int("max_depth", 3, 12),
        learning_rate=trial.suggest_float("learning_rate", 0.01, 0.3, log=True),
        n_estimators=trial.suggest_int("n_estimators", 100, 1000),
        device="cuda", tree_method="hist")          # run each trial on GPU
    cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    return cross_val_score(xgb.XGBClassifier(**params), X_tr, y_tr,
                           cv=cv, scoring="average_precision").mean()  # PR-AUC

study = optuna.create_study(direction="maximize", sampler=optuna.samplers.TPESampler(seed=42))
study.optimize(objective, n_trials=60)
print(study.best_params)   # evaluate on the test set only once at the end`,
      },
      keyPoints: [
        'Grid search tries every combination, random search samples combinations, and Optuna / TPE learns from previous trials.',
        'A GPU can let you run more HPO trials in the same amount of time.',
        'Choose CV for the data: stratified for imbalance, time-based for time series, and GroupKFold for groups.',
        'Match the metric to the problem: PR-AUC / F1 for imbalance and MAE / RMSE for regression.',
      ],
      terms: [
        { en: 'Hyperparameter', si: 'A setting chosen before training that the model does not learn from the data.' },
        { en: 'HPO', si: 'Hyperparameter optimization: automatically searching for useful hyperparameter settings.' },
        { en: 'Optuna', si: 'A Python HPO library with smart search methods such as TPE and trial pruning.' },
        { en: 'k-fold Cross-Validation', si: 'Splitting data into k parts and training / validating k times to average the score.' },
        { en: 'Precision / Recall', si: 'The fraction of predicted positives that are correct / the fraction of actual positives found.' },
        { en: 'PR-AUC', si: 'The area under the precision-recall curve, a useful metric for imbalanced data.' },
        { en: 'MAE / RMSE', si: 'Regression error metrics: average absolute error / a metric that penalizes larger errors more.' },
      ],
      si: 'ඔයා Colombo shop එකේ fraud model එක tune කරන්න settings 60ක් try කරනවා කියලා හිතන්න. 5-fold CV නම් data කොටස් 5කට බෙදා, එක් වරකට කොටසක් validation කරලා ඉතිරි 4 train කරනවා. Optuna කලින් trials බලලා ඊළඟ settings තෝරන්න උදව් කරනවා. Kottu එකේ මිරිස් සහ ලුණු වෙනස් කරලා පස් දෙනෙක්ට රස බලන්න දෙනවා වගේ, CV score එක සාමාන්‍ය කරලා බලන්න; test set එක අන්තිමට එක පාරක් විතරක් පාවිච්චි කරන්න.',
    },
    {
      id: 'eda-hypothesis-visualization',
      plain: "EDA checks schema, missingness, ranges, distributions, duplicates, relationships, time patterns, and suspicious leakage before modeling. Summaries should lead to testable questions.",
      internGuide: ["EDA checks schema, missingness, ranges, distributions, duplicates, relationships, time patterns, and suspicious leakage before modeling. Summaries should lead to testable questions.","A hypothesis test quantifies compatibility with a null model under assumptions; a p-value is not the probability the hypothesis is true or a measure of practical importance.","Report effect size and uncertainty, account for multiple comparisons, and check independence/distribution assumptions. Large datasets can make trivial effects statistically significant.","Choose plots by question: histogram/ECDF for distributions, scatter/hexbin for two numeric variables, box/violin for grouped distributions, and line plots for ordered time."],
      title: 'Descriptive Analysis: EDA, Hypothesis Testing Basics, and Choosing the Right Plot',
      body: [
        'EDA (Exploratory Data Analysis) is how you get to know data before building a model (see the Phase 1 EDA topic for the basics). Inspect describe() statistics (mean, median, min, max, std), missing and unique values, value_counts, correlations, and outliers. cuDF can calculate these across millions of rows on a GPU in seconds, making it possible to inspect the full dataset rather than only a sample.',
        'Hypothesis testing asks whether an observed difference is real or could be due to chance. The null hypothesis (H0) says “there is no difference.” A p-value is the probability, assuming H0 is true, of seeing a result at least as extreme as the one observed. A p-value below 0.05 is often called statistically significant. It is not the probability that H0 is true, and “significant” does not mean large or important. With a lot of data, tiny differences can be significant, so also examine effect size.',
        'Common tests include a t-test for comparing two group means (such as average bills in an A/B test), a chi-square test for association between categories (such as district and payment method), and correlation tests for how two numeric values vary together. Correlation does not prove causation: ice-cream sales and floods might both increase because of weather.',
        'Choose a plot for the question: a line chart for change over time, a bar chart to compare categories, a histogram or box plot for one numeric distribution, and a scatter plot for a relationship between two numbers (use hexbin / density for millions of points). Use a heatmap for many correlations and a stacked bar for parts of a whole; reserve pie charts for only a few categories. For GPU-accelerated visualization, avoid sending millions of rows to the browser. Datashader aggregates data into pixels and supports cuDF; other options include hvPlot / HoloViews, RAPIDS cuxfilter for GPU cross-filtering dashboards, and Plotly Dash. Aggregate on the GPU and plot the smaller result.',
      ],
      analogy: 'Hypothesis testing is like a court case. H0 says “the accused is innocent.” Strong evidence (a small p-value) can lead you to reject H0. If evidence is insufficient, that does not prove innocence; it only means guilt was not established. Choosing a plot is like choosing a map, traffic, or satellite view in Google Maps based on the question.',
      example: 'In an A/B test across 200 Cargills outlets, 100 use a new shelf layout. The average bill is Rs. 2,450 with the old layout and Rs. 2,530 with the new one. A t-test p-value of 0.01 suggests the difference is unlikely under the no-difference assumption, but the effect size is Rs. 80 (about 3%); the business must decide whether that is worth the cost of changing layouts. For EDA, use a histogram for bill amounts, a line chart for sales by hour, and a sorted bar chart to compare averages across 200 outlets.',
      code: {
        lang: 'python',
        src: `import cudf
from scipy import stats

gdf = cudf.read_parquet("bills.parquet")
print(gdf.describe())                         # EDA on the GPU
print(gdf.isna().sum())                       # missing values
print(gdf["payment"].value_counts())

# A/B test: filter on GPU; copy only the two amount arrays to CPU
a = gdf[gdf["layout"] == "old"]["amount"].to_numpy()
b = gdf[gdf["layout"] == "new"]["amount"].to_numpy()
t, p = stats.ttest_ind(a, b, equal_var=False)  # Welch t-test
print(f"p-value = {p:.4f}, difference = Rs. {b.mean() - a.mean():.0f}")`,
      },
      keyPoints: [
        'EDA includes describe, missing values, value_counts, correlations, and outliers; a GPU can help inspect the full dataset.',
        'A small p-value means the result is less likely under H0; significance is not importance, so check effect size.',
        'Use a t-test to compare two means and chi-square to test categorical association; correlation is not causation.',
        'Choose plots for the question; aggregate large datasets on a GPU before plotting (Datashader, cuxfilter).',
      ],
      terms: [
        { en: 'EDA', si: 'Exploratory Data Analysis: examining data to understand it before modeling.' },
        { en: 'Null Hypothesis (H0)', si: 'The starting assumption that there is no difference or association.' },
        { en: 'p-value', si: 'Assuming H0 is true, the probability of observing a result at least as extreme as the one found.' },
        { en: 'Effect Size', si: 'How large a difference is in practice, which is distinct from whether it is statistically significant.' },
        { en: 't-test / Chi-square test', si: 'A test for comparing two means / a test of association between categories.' },
        { en: 'Datashader', si: 'A library that aggregates large point datasets into pixels for plotting; it supports cuDF.' },
        { en: 'cuxfilter', si: 'A RAPIDS library for building interactive dashboards with GPU cross-filtering.' },
      ],
      si: 'ඔයා Cargills outlets 200ක shelf layout A/B test එකක් කරනවා කියලා හිතන්න. පරණ layout එකේ සාමාන්‍ය බිල Rs. 2,450යි, අලුත් එක Rs. 2,530යි; p-value 0.01 වුණත් Rs. 80 වෙනස වියදමට වටිනවද කියලා බලන්න ඕනේ. Bills වල හැඩය බලන්න histogram එකක්, පැය අනුව sales බලන්න line chart එකක් තෝරන්න. ලොකු data එකක් නම් GPU එකේ summarize කරලා පොඩි ප්‍රතිඵලය විතරක් chart කරන්න.',
    },
    {
      id: 'time-series-on-gpu',
      plain: "Time-series rows have order. Sort by entity and timestamp, define frequency and timezone, detect gaps/duplicates, and distinguish event time from ingestion time.",
      internGuide: ["Time-series rows have order. Sort by entity and timestamp, define frequency and timezone, detect gaps/duplicates, and distinguish event time from ingestion time.","Lag, rolling, and expanding features must use only information available at prediction time. Random row splits cause future leakage; use walk-forward or blocked evaluation.","GPU DataFrames can accelerate parsing, grouping, windows, and resampling at scale, but partition boundaries must include the history needed for correct windows.","Evaluate by forecast horizon and time period, compare a simple seasonal/last-value baseline, and monitor drift, missing intervals, and late-arriving data."],
      title: 'Advanced Data Structures I: Time Series on GPU',
      body: [
        'Time-series data is ordered over time (see Phase 1 for trend, seasonality, resampling, rolling, and shift). Real-world workloads often contain thousands of series, not just one. For example, 300 supermarket branches × 5,000 items = 1.5 million series, each needing lag features, rolling averages, and forecasts. This is where a GPU can help.',
        'With cuDF, use datetime columns (.dt.year, .dt.dayofweek), sort then groupby("series_id") + shift for lags, groupby + rolling for moving averages, and resample to combine hourly data into daily data. Support for resample / rolling varies by version, so check the documentation. A GPU-friendly approach is to process all series with groupby rather than loop over them one by one.',
        'For forecasting, cuML ARIMA (cuml.tsa) can fit many series in batches. In practice, teams often turn each time series into a tabular problem with lags, rolling statistics, and calendar features (Poya days, holidays, Sinhala and Hindu New Year), then use GPU XGBoost. Always validate by time: train on the past and test on the future. Do not shuffle, or future information can leak into training.',
        'Time-series anomaly detection is also useful: compare today’s value with a rolling mean and standard deviation to calculate how unusual it is (a z-score). This can be used for sensor data, ATM withdrawals, or website traffic.',
      ],
      analogy: 'Recording the monthly harvest from one coconut tree is one time series. Doing the same for hundreds of thousands of trees across 2,000 Kurunegala farms would take one person years if they visited each tree in turn. A GPU groupby is like assigning a recorder to every farm at the same time.',
      example: 'With 300 branches, 2,000 items, and 730 days of sales, the dataset has 438 million rows. In cuDF, sort by (branch, item) and create lag_7, lag_14, and rolling_28_mean features. A groupby-rolling operation that takes minutes with CPU pandas may be much faster on a GPU. Train through December 2025 and test on January 2026. Add an "is_avurudu_week" feature for seasonal sweets.',
      code: {
        lang: 'python',
        src: `import cudf

s = cudf.read_parquet("daily_sales.parquet")        # branch, item, date, qty
s = s.sort_values(["branch", "item", "date"])
g = s.groupby(["branch", "item"])["qty"]
s["lag_7"] = g.shift(7)                              # value from one week earlier
s["dow"] = s["date"].dt.dayofweek                    # day of the week
s["month"] = s["date"].dt.month

cut = cudf.to_datetime("2026-01-01")                 # time-based split, no shuffle
train, test = s[s["date"] < cut], s[s["date"] >= cut]
print(len(train), len(test))`,
      },
      keyPoints: [
        'The real workload is often thousands or millions of series; a GPU groupby can process them together.',
        'Lags (shift), rolling statistics, and calendar features (Poya days, New Year) support tabular forecasting.',
        'cuML ARIMA can batch many series; GPU XGBoost is another practical approach.',
        'Always validate by time; shuffling can leak future information.',
      ],
      terms: [
        { en: 'Time Series', si: 'Data ordered according to time.' },
        { en: 'Lag Feature', si: 'A value from an earlier time period, such as sales from one week ago.' },
        { en: 'Rolling Window', si: 'A moving calculation, such as an average or total over the last N time periods.' },
        { en: 'ARIMA', si: 'A traditional time-series model that forecasts using previous values and errors.' },
        { en: 'Time-based Split', si: 'Dividing data by time, using older data for training and newer data for testing.' },
      ],
      si: 'ඔයාගේ shop එකේ branches 300ක items 2,000ක දවස් 730ක sales තියෙනවා නම් rows මිලියන 438ක් වෙනවා. cuDF එකෙන් branch සහ item අනුව sort කරලා සතියකට කලින් sales (lag_7) හදන්න පුළුවන්. Sinhala හා Hindu අලුත් අවුරුදු සතියට වෙනම calendar feature එකක් දාන්නත් පුළුවන්. 2025 දෙසැම්බර් දක්වා train කරලා 2026 ජනවාරි test කරන්න; අනාගත දත්ත කලින් train එකට මිශ්‍ර කරන්න එපා.',
    },
    {
      id: 'graph-analytics-cugraph',
      plain: "A graph contains vertices and edges; direction, weight, multiplicity, and identifiers define its meaning. Convert business data carefully before selecting an algorithm.",
      internGuide: ["A graph contains vertices and edges; direction, weight, multiplicity, and identifiers define its meaning. Convert business data carefully before selecting an algorithm.","PageRank estimates importance from incoming links; community methods find densely connected groups; shortest path minimizes a chosen edge cost. These answer different questions.","cuGraph accelerates supported graph algorithms on GPU; multi-GPU execution adds partitioning and communication concerns. Renumbered internal vertex IDs must be mapped back correctly.","Validate graph assumptions, connected components, negative/invalid weights, and result stability. Fast computation does not make an inappropriate graph model valid."],
      title: 'Advanced Data Structures II: Graph Analytics with cuGraph (PageRank, Communities, Shortest Path)',
      body: [
        'A graph has nodes (vertices) and connections (edges) between them. Examples include people and friendships on Facebook, bank accounts and money transfers, bus stops and routes, or web pages and links. Edges can have weights such as distance or amount. Graph data often arrives as an edge list: a DataFrame with src, dst, and weight columns.',
        'cuGraph is RAPIDS’ graph-analytics library. Build a graph from a cuDF edge list and run algorithms on a GPU. If you already have NetworkX code, the nx-cugraph NetworkX backend can run supported algorithms on GPUs with little or no code change. cuGraph also supports multi-GPU execution with Dask for large graphs.',
        'Three algorithms in simple terms: (1) PageRank measures a node’s importance; a node linked to by many important nodes receives a higher rank, an idea that helped shape Google Search. (2) Community detection (Louvain, Leiden) finds groups with many internal connections and fewer external ones; modularity measures how well groups are separated. (3) Shortest path (SSSP, BFS) finds the smallest distance or fewest steps from a node to others.',
        'Graphs can help with fraud detection: fraudulent accounts may form communities, and mule accounts may appear centrally (centrality / PageRank). A common approach is to create graph features, such as a node’s PageRank or community size, and pass them to XGBoost. Graph neural networks (GNNs) are a further step and are not required in depth for this exam.',
      ],
      analogy: 'Think of Colombo’s bus network: stops are nodes and routes are edges. PageRank gives a high score to a stop such as Pettah that receives connections from important stops. Community detection groups areas with many routes between them, such as Dehiwala–Mount Lavinia–Ratmalana or Kaduwela–Malabe. Shortest path is like finding the shortest route from Maharagama to Fort in Google Maps.',
      example: 'Suppose there are 50 million mobile-money transfers between 5 million accounts. Use cuGraph PageRank to find the top 100 accounts and Louvain to find 12,000 communities. One community contains 40 accounts created within three days that send money only to one another; send it for investigation. Shortest path can also create a feature measuring the number of steps from a known fraud account to a new account.',
      code: {
        lang: 'python',
        src: `import cudf, cugraph

edges = cudf.read_parquet("transfers.parquet")       # src, dst, amount
G = cugraph.Graph(directed=True)
G.from_cudf_edgelist(edges, source="src", destination="dst", edge_attr="amount")

pr = cugraph.pagerank(G)                              # vertex, pagerank
print(pr.nlargest(5, "pagerank"))                     # most important accounts

Gu = cugraph.Graph()                                  # Louvain uses an undirected graph
Gu.from_cudf_edgelist(edges, source="src", destination="dst")
parts, modularity = cugraph.louvain(Gu)               # vertex, partition
dist = cugraph.sssp(G, source=12345)                  # shortest distances from account 12345`,
      },
      keyPoints: [
        'A graph is nodes plus edges; data often arrives as an src / dst edge list.',
        'cuGraph provides GPU graph analytics; nx-cugraph is a NetworkX backend.',
        'PageRank measures importance, Louvain / Leiden find communities, and SSSP / BFS find shortest paths.',
        'Graph features with XGBoost are a common approach to fraud detection.',
      ],
      terms: [
        { en: 'Graph (Node / Edge)', si: 'A data structure containing entities (nodes) and connections between them (edges).' },
        { en: 'Edge List', si: 'A graph-data table whose rows contain src, dst, and optionally a weight.' },
        { en: 'cuGraph', si: 'The RAPIDS library for GPU graph analytics.' },
        { en: 'PageRank', si: 'An algorithm that scores node importance based on links from other important nodes.' },
        { en: 'Community Detection (Louvain)', si: 'Finding groups of nodes with many connections inside the group and fewer outside.' },
        { en: 'Modularity', si: 'A measure of how well a graph’s communities are separated.' },
        { en: 'SSSP', si: 'Single Source Shortest Path: the shortest distances from one node to the others.' },
      ],
      si: 'ඔයා Colombo bus map එකක් බලනවා කියලා හිතන්න: bus stop එකක් node, ඒ දෙක සම්බන්ධ කරන route එක edge. Pettah වගේ ගොඩක් routes එකතු වෙන තැනකට PageRank ලකුණ ඉහළ යන්න පුළුවන්. Mobile money accounts මිලියන 5ක් අතර transfers මිලියන 50ක් තියෙනවා නම්, cuGraph එකෙන් communities හොයාගෙන සැක සහිත කණ්ඩායම් පරීක්ෂා කරන්න පුළුවන්. SSSP එකෙන් එක account එකකින් තවත් එකකට යන අඩුම පියවර ගණන හොයනවා.',
    },
    {
      id: 'data-prep-inference-quality',
      plain: "Data work starts with collection purpose, permissions, sampling, schema, lineage, and quality rules. Labels need clear instructions, adjudication, and agreement checks.",
      internGuide: ["Data work starts with collection purpose, permissions, sampling, schema, lineage, and quality rules. Labels need clear instructions, adjudication, and agreement checks.","Images need decode/orientation/size handling; text needs encoding/language/PII and tokenization checks; tabular data needs types, units, missingness, categories, and time consistency.","Offline inference processes stored batches and optimizes throughput; online inference handles individual/live requests and prioritizes latency and availability. Both must reuse compatible preprocessing.","Create automated checks for schema, ranges, duplicates, leakage, label balance, corrupt files, drift, and train-serving skew, with quarantine rather than silent repair where appropriate."],
      title: 'Data Workflows: Collection, Labeling, Image / Text / Tabular Prep, Offline vs Online Inference, Quality Checks',
      body: [
        'Every ML project starts by collecting data from databases, logs, APIs, sensors, surveys, or the web, while following applicable law and privacy / consent requirements. Supervised learning needs labels: people (sometimes assisted by models) assign the correct answer to each example. Tools include Label Studio and CVAT. Clear labeling guidelines and measuring whether two labelers agree on the same examples are essential for label quality.',
        'Preprocessing depends on the data type. Tabular data may need missing-value handling, type fixes, outlier checks, encoding, and scaling (cuDF / cuML). Images may need resizing, normalization (pixel values to 0–1 or mean / standard deviation), augmentation (flip, crop, rotate), and removal of corrupt files. NVIDIA DALI can accelerate image decoding and augmentation on a GPU. Text preparation includes cleaning HTML and extra spaces, removing duplicates, and tokenizing; mixed Sinhala / Tamil / English text can raise Unicode encoding issues. cuDF .str operations can clean text on a GPU.',
        'There are two inference patterns. Offline (batch) inference processes many records on a schedule, such as calculating churn scores for 5 million customers each night and writing them to a table; throughput matters, and GPUs with cuDF / FIL may fit well. Online (real-time) inference responds within milliseconds, such as checking a card swipe for fraud; latency matters, and the model may sit behind an API or Triton Inference Server. Build features consistently in training and online inference to avoid training-serving skew.',
        'Before deployment, check the schema (columns and types), ranges (age 0–120), missing rates, duplicates, label distribution, leakage, held-out test metrics, and performance slices such as district or gender. After deployment, keep checking input schemas / ranges, prediction distributions, latency, errors, metrics when labels arrive, and drift (the next topic). Libraries such as Great Expectations and pandera can automate data checks.',
      ],
      analogy: 'Offline inference is like cooking the week’s meals on Sunday and storing them in the fridge: process a large batch at once. Online inference is like making a kottu as each shop order arrives: respond quickly, one request at a time. Quality checks are like a food inspector checking the kitchen before opening and returning regularly after it opens.',
      example: 'An ISP such as Dialog or SLT classifies 2 million customer-complaint SMS messages into 8 categories. Three labelers labeled 10,000 messages with 85% agreement. Clean the text on a GPU and remove 12% duplicates. Offline, classify all of the day’s complaints each night; online, classify a chatbot message within 50 ms. After deployment, if “Other” rises from 5% to 18%, perhaps because of a new issue such as a fiber outage, investigate and consider retraining.',
      code: {
        lang: 'python',
        src: `import cudf

df = cudf.read_parquet("complaints.parquet")          # text, label
df["text"] = (df["text"].str.lower()
                         .str.replace(r"<[^>]+>", "", regex=True)   # remove HTML
                         .str.strip())
df = df.drop_duplicates(subset="text")                 # remove duplicates

# Basic quality checks (before and after deployment)
assert set(df.columns) >= {"text", "label"}, "invalid schema"
assert df["text"].isna().mean() < 0.01, "too much missing text"
print(df["label"].value_counts(normalize=True))        # label distribution`,
      },
      keyPoints: [
        'Data collection (privacy / consent) → labeling (guidelines + agreement) → preprocessing.',
        'Tabular / image / text preparation differs; DALI accelerates image pipelines and cuDF .str can clean text on GPUs.',
        'Offline (batch) inference emphasizes throughput; online (real-time) inference emphasizes latency.',
        'Check schemas, ranges, metrics, and drift both before and after deployment.',
      ],
      terms: [
        { en: 'Data Labeling', si: 'Assigning the correct answer (label) to each training example.' },
        { en: 'Inter-annotator Agreement', si: 'How often two labelers give the same label to the same example.' },
        { en: 'Data Augmentation', si: 'Increasing training images by making changes such as flips and crops.' },
        { en: 'NVIDIA DALI', si: 'A library for loading and preprocessing image / video / audio data on GPUs.' },
        { en: 'Offline (Batch) Inference', si: 'Making predictions for many records at once on a schedule.' },
        { en: 'Online (Real-time) Inference', si: 'Making a prediction soon after a request arrives, with low latency.' },
        { en: 'Training-Serving Skew', si: 'A difference in how features are created during training and in production.' },
      ],
      si: 'ඔයාගේ ISP එකට දවසකට complaints SMS 2 millionක් එනවා කියලා හිතන්න. Labelers තුන්දෙනෙක් SMS 10,000කට labels දාලා 85%ක් එකඟ වුණා; හොඳ guidelines තිබීම වැදගත්. හැම රෑකම messages ඔක්කොම වර්ග කරන එක offline batch inference, chatbot එකකට ආපු message එක 50 ms ඇතුළත වර්ග කරන එක online inference. “Other” category එක 5% සිට 18%ට ගියොත් අලුත් fiber outage එකක් වගේ හේතුවක් පරීක්ෂා කරන්න.',
    },
    {
      id: 'reproducible-pipelines',
      plain: "A pipeline turns ingestion, validation, transformation, training, evaluation, and export into explicit versioned steps with declared inputs and outputs.",
      internGuide: ["A pipeline turns ingestion, validation, transformation, training, evaluation, and export into explicit versioned steps with declared inputs and outputs.","Reproducibility needs code, configuration, data snapshot/lineage, environment, random seeds, hardware/library versions, and recorded artifacts—not only a notebook.","With Dask/RAPIDS, capture cluster settings, partitioning, spill configuration, and nondeterministic algorithm details. Floating-point parallel reductions may not be bitwise identical.","Make steps idempotent, cache only content-addressed/versioned outputs, test small fixtures in CI, and rerun a known experiment before promoting a model."],
      title: 'End-to-End Pipelines and Reproducible Workflows with RAPIDS and Dask',
      body: [
        'An end-to-end pipeline runs every step from raw data to an evaluated model in a repeatable order: load (Parquet) → clean → create features → split → train → evaluate → save artifacts. A good GPU pipeline keeps data on the GPU from start to finish (cuDF → cuML / XGBoost). For larger data, use the same steps with dask-cudf and Dask-enabled XGBoost / cuML.',
        'Reproducibility means another person can get the same or very similar result on another machine six months later. (1) Pin environment versions for Python, RAPIDS, CUDA, and XGBoost in conda environment.yml, requirements.txt with ==, or a Docker image tag. (2) Set random_state / seed parameters consistently. (3) Put hyperparameters, paths, and dates in YAML / JSON config files instead of hard-coding them.',
        '(4) Version the data so you know exactly what was used for training: dated Parquet snapshots, DVC, lakeFS, or a data-file hash. (5) Save artifacts together: the trained model, preprocessing objects (encoders, scalers), metrics, plots, config, and Git commit hash. (6) Keep code in Git. To avoid hidden notebook state, turn the final workflow into a script or functions.',
        'An honest note about GPU reproducibility: some parallel GPU algorithms may add numbers in a different order, so a few final decimal places can vary even with the same seed. Aim for very similar metrics rather than bit-for-bit identity, and check documentation for deterministic options. CPU and GPU results can also differ slightly.',
      ],
      analogy: 'A reproducible pipeline is like writing down your grandmother’s kavum recipe. “A little flour, a little treacle” will not produce the same taste each time. Write “250 ml kithul treacle, 500 g rice flour, heat the stove for 5 minutes,” along with versions, config, and seed, and someone else can follow the same recipe later.',
      example: 'Nimal’s team trains a model in March 2026 with PR-AUC 0.62. When Ruwani reruns it in July, the score is 0.55 because RAPIDS was updated, the data file was overwritten, and no seed was recorded. Instead, pin versions in environment.yml, keep the data/2026-03-01 snapshot, record config.yaml (seed: 42, max_depth: 7), Git commit a1b2c3d, and all artifacts in the MLflow run. Another person can then reproduce a result close to 0.62.',
      code: {
        lang: 'python',
        src: `import yaml, random, numpy as np, cupy as cp, cudf, xgboost as xgb

cfg = yaml.safe_load(open("config.yaml"))     # paths, seed, and parameters in one place
seed = cfg["seed"]
random.seed(seed); np.random.seed(seed); cp.random.seed(seed)   # set seeds consistently

df = cudf.read_parquet(cfg["data_path"])      # data/2026-03-01/sales.parquet snapshot
X, y = df.drop(columns=cfg["target"]), df[cfg["target"]]
model = xgb.XGBClassifier(**cfg["xgb_params"], random_state=seed,
                          device="cuda", tree_method="hist").fit(X, y)
model.save_model("artifacts/model.json")      # save the model artifact
# environment.yml: pin rapids, cuda-version, and xgboost versions`,
      },
      keyPoints: [
        'A pipeline loads → cleans → creates features → trains → evaluates → saves, keeping data on the GPU when possible.',
        'Reproducibility needs pinned versions, seeds, config files, data snapshots, Git, and saved artifacts.',
        'You can start in a notebook and turn the final workflow into a script / functions.',
        'GPU parallel calculations may differ slightly bit-for-bit; compare whether metrics remain close.',
      ],
      terms: [
        { en: 'End-to-End Pipeline', si: 'An ordered workflow covering every step from raw data to a model or result.' },
        { en: 'Environment Pinning', si: 'Recording and locking exact versions of libraries and other dependencies.' },
        { en: 'Random Seed', si: 'A starting number that makes random-number sequences repeatable.' },
        { en: 'Config File', si: 'A YAML / JSON file that stores parameters and paths outside the code.' },
        { en: 'Artifact', si: 'An output from a run, such as model files, encoders, metrics, or plots.' },
        { en: 'DVC', si: 'Data Version Control, a tool for versioning large data files and models alongside Git.' },
      ],
      si: 'ඔයා 2026 මාර්තු sales data එකෙන් model එකක් train කරලා PR-AUC 0.62 ගත්තා කියලා හිතන්න. ජූලි මාසෙදී ඒක 0.55 වුණොත් RAPIDS version එක, data snapshot එක, seed එක වෙනස්ද බලන්න. environment.yml, config.yaml (seed: 42), Git commit සහ data snapshot එක save කළොත් Ruwaniටත් ඒ run එක ආයෙත් කරන්න පුළුවන්. GPU ගණනයෙන් අවසාන decimal ටික වෙනස් වෙන්න පුළුවන්, ඒ නිසා metrics ළඟද බලන්න.',
    },
    {
      id: 'intro-mlops-tracking-drift',
      plain: "Experiment tracking records parameters, metrics, artifacts, code/environment, and dataset identity so results can be compared and reproduced. A registry manages model versions and stages.",
      internGuide: ["Experiment tracking records parameters, metrics, artifacts, code/environment, and dataset identity so results can be compared and reproduced. A registry manages model versions and stages.","Data drift means input distributions changed; concept drift means the relationship between inputs and target changed. Input drift alone does not prove model quality fell.","Monitor schema, missingness, ranges, categorical frequencies, prediction distribution, latency, and—when labels arrive—performance and calibration by segment.","Define alert thresholds, ownership, investigation playbooks, retraining criteria, approval, and rollback. Logging a dashboard without a response process is not MLOps."],
      title: 'Introductory MLOps: Experiment Tracking (MLflow / W&B), Versioning, Data Drift and Concept Drift',
      body: [
        'A GPU can let you run hundreds of experiments per day, but without records you may forget how the best model was built. Experiment tracking automatically records each run’s parameters, metrics, artifacts, and code version (see Phase 7 for MLOps details). MLflow is open source and can run on your own server, with methods such as mlflow.log_param, log_metric, and log_artifact, a model registry, and autologging for some libraries (for example, mlflow.xgboost.autolog()). Weights & Biases (W&B) is a cloud service with wandb.init(config=...), wandb.log(...), sweeps for HPO, and team dashboards.',
        'Track three kinds of versions: code in Git, data in snapshots / DVC, and models in a registry (for example, versions 1, 2, and 3 with aliases / stages in the MLflow model registry). If a production model has a problem, versioning makes it possible to roll back to an earlier version.',
        'The world can change after deployment. Data drift (covariate shift) means the distribution of model inputs changes—for example, average bills rise from Rs. 2,500 during training to Rs. 4,000 with inflation. Concept drift means the relationship between inputs and outcomes changes—for example, a 2 a.m. online purchase once suggested fraud, but becomes normal as more night-shift BPO workers shop then. You can detect data drift without labels; confirming concept drift usually requires new labels or a drop in measured accuracy.',
        'Drift checks include the Kolmogorov–Smirnov (KS) test for numeric distributions, PSI (Population Stability Index) for changes across bins (many teams use 0.1 / 0.25 as rules of thumb, not universal cutoffs), chi-square for categories, changes in prediction distributions, and actual metrics when labels arrive. Tools such as Evidently and NannyML can automate checks. For large data, calculate histograms / statistics with cuDF on a GPU. When you detect drift, investigate the cause and retrain with newer data if appropriate.',
      ],
      analogy: 'Data drift is like a kottu shop that used to serve office workers but now serves university students: the customers have changed. Concept drift is like the same customers now preferring cheese kottu instead of ordinary kottu: their preferences or the relationship has changed. Experiment tracking is the shop’s recipe book, recording each recipe, salt amount, and customer rating.',
      example: 'A loan-default model is trained on 2025 data. By mid-2026, monthly_income has PSI = 0.31 (a level many teams consider a large change) and the KS-test p-value is < 0.001. When labels arrive three months later, recall has fallen from 0.78 to 0.61, suggesting both data and concept drift. Use MLflow to recover the earlier configuration, retrain with six newer months of data, register version 4, run an A/B test, and assign the production alias if it performs well.',
      code: {
        lang: 'python',
        src: `import mlflow, numpy as np
from scipy.stats import ks_2samp

with mlflow.start_run(run_name="xgb-gpu-v4"):
    mlflow.log_params({"max_depth": 7, "learning_rate": 0.05, "device": "cuda"})
    mlflow.log_metric("pr_auc", 0.62)
    mlflow.log_artifact("config.yaml")          # save the config with the run

# Data drift: income during training vs income this month
train_inc = np.load("train_income.npy"); live_inc = np.load("live_income.npy")
stat, p = ks_2samp(train_inc, live_inc)
if p < 0.01:
    print("Data drift warning: income distribution changed")`,
      },
      keyPoints: [
        'Track parameters, metrics, artifacts, and code version for every run (MLflow / W&B).',
        'Version code with Git, data with snapshots / DVC, and models with a registry to support rollback.',
        'Data drift changes inputs and can be found without labels; concept drift changes the input-output relationship.',
        'Monitor drift with KS test, PSI, chi-square, prediction distributions, and actual metrics.',
      ],
      terms: [
        { en: 'Experiment Tracking', si: 'Automatically recording settings, results, and files for every training run.' },
        { en: 'MLflow', si: 'An open-source MLOps platform with experiment tracking and a model registry.' },
        { en: 'Weights & Biases (W&B)', si: 'A cloud service for experiment tracking, sweeps, and dashboards.' },
        { en: 'Model Registry', si: 'A place to store model versions with aliases / stages.' },
        { en: 'Data Drift', si: 'A change over time in the distribution of inputs received by a model.' },
        { en: 'Concept Drift', si: 'A change over time in the relationship between inputs and the target.' },
        { en: 'PSI / KS Test', si: 'Two methods for measuring how distributions differ.' },
      ],
      si: 'ඔයාගේ loan model එක 2025 data එකෙන් train කළා, එතකොට සාමාන්‍ය income එක Rs. 2,500යි. 2026දී ඒක Rs. 4,000 වෙලා නම් input data drift එකක් තියෙන්න පුළුවන්. නමුත් එකම customer රටාවකට default සම්බන්ධය වෙනස් වුණොත් ඒ concept drift. MLflow එකේ run එකේ settings, metrics සහ files save කරලා, Git code එකත් version කරන්න. අලුත් labels ආවම recall 0.78 සිට 0.61ට බැස්සද බලන්න.',
    },
    {
      id: 'environment-management',
      plain: "Conda and pip manage packages; containers package user-space dependencies. The host NVIDIA driver provides kernel support and must be compatible with the CUDA runtime used by the application.",
      internGuide: ["Conda and pip manage packages; containers package user-space dependencies. The host NVIDIA driver provides kernel support and must be compatible with the CUDA runtime used by the application.","nvidia-smi reports driver/GPU state; its displayed CUDA capability is not proof that a matching toolkit compiler or every library is installed.","Use supported RAPIDS installation matrices or NGC containers, pin versions and image digests, keep lock files, and avoid mixing package channels casually.","Record Git commit and environment, scan images, run a GPU smoke test, and verify imports plus a small computation before long jobs. Never “fix” compatibility by random upgrades."],
      title: 'Software and Environment Management: Conda, pip, Docker / NGC, CUDA Driver Compatibility, nvidia-smi, Git',
      body: [
        'RAPIDS requires an NVIDIA GPU, Linux (or WSL2 on Windows), and a compatible NVIDIA driver. Common installation options are (1) Conda, using rapidsai, conda-forge, and nvidia channels; Conda manages Python packages and non-Python dependencies such as CUDA libraries. (2) pip, using wheels that match the CUDA version (for example, packages named cudf-cu12). (3) Docker containers, including preconfigured RAPIDS images in the NGC catalog and Docker Hub. Use the RAPIDS website’s install selector for the exact command because versions change often.',
        'pip installs Python packages from the Python Package Index. Conda manages packages, Python itself, system libraries, and isolated environments (conda create -n rapids ...). Mixing pip and conda carelessly in one environment can cause dependency problems, so use one consistently when possible. Docker packages the operating-system userspace in an image. GPU access requires the NVIDIA Container Toolkit and docker run --gpus all. The host needs the NVIDIA driver; the CUDA toolkit can be inside the container.',
        'CUDA driver vs toolkit: the driver is installed in the operating system and communicates with the GPU; the CUDA toolkit / runtime provides libraries for building and running applications and often comes with RAPIDS packages. Newer drivers can generally run applications built with older toolkits (backward compatibility). Within a major version such as CUDA 12.x, minor-version compatibility usually allows use of the minimum driver for that major version, though some features may need a newer driver. If a CUDA major version is newer than the driver supports, update the driver or, on some data-center GPUs, use the forward-compatibility package (cuda-compat).',
        'nvidia-smi shows the GPU name, driver version, “CUDA Version” (the highest CUDA version supported by the driver, not the installed toolkit), memory use, GPU utilization, temperature, and running processes. nvcc --version shows the installed CUDA toolkit compiler version. Git basics include git init, git add, git commit -m, git branch, git checkout / switch, and git push / pull. Put data files, model files, and .env secrets in .gitignore; keep large data out of Git and consider DVC / Git LFS.',
      ],
      analogy: 'The driver is the road and the CUDA toolkit is the vehicle. An older vehicle can use a new expressway (new driver), but a new supercar (new CUDA major version) may not run on an old rural road (old driver). A Conda environment is a separate box of supplies for each project; Docker packs the whole kitchen into a container you can carry elsewhere.',
      example: 'Suppose nvidia-smi shows “Driver Version: 550.xx, CUDA Version: 12.4.” The driver supports applications up to CUDA 12.4, so a RAPIDS package built for CUDA 12 (pip cudf-cu12 or conda cuda-version=12) is a match. If you need a CUDA 13 build, update the driver. If Memory-Usage is 23000 MiB / 24576 MiB, GPU memory is nearly full; reduce partition size or inspect Dask workers.',
      code: {
        lang: 'bash',
        src: `nvidia-smi                       # driver, max CUDA version, memory, utilization
nvcc --version                   # installed CUDA toolkit, if available

# Create a Conda environment (get the exact command from the RAPIDS install selector)
conda create -n rapids -c rapidsai -c conda-forge -c nvidia rapids python=3.11 cuda-version=12
conda env export > environment.yml          # save pinned versions

# Docker: the host needs only the driver and NVIDIA Container Toolkit
docker run --gpus all -it --rm -p 8888:8888 <ngc-rapids-image>:<tag>

git init && git add src/ config.yaml && git commit -m "GPU pipeline v1"
echo "data/" >> .gitignore                  # keep large data out of Git`,
      },
      keyPoints: [
        'Install RAPIDS with Conda, pip, or Docker (NGC); use the official install selector for the command.',
        'Conda manages Python, system libraries, and environments; pip installs Python packages. Mix them carefully.',
        'A newer driver can run older-toolkit apps; an older driver may need updating for a newer CUDA major / forward compatibility.',
        'nvidia-smi “CUDA Version” is the driver’s maximum supported version, not the installed toolkit version.',
        'Use Git for code and configs; put data and secrets in .gitignore.',
      ],
      terms: [
        { en: 'Conda', si: 'A tool for managing packages and isolated environments, including non-Python libraries.' },
        { en: 'pip', si: 'The standard tool for installing Python packages from PyPI.' },
        { en: 'NGC', si: 'NVIDIA GPU Cloud catalog of GPU-optimized containers, models, and resources.' },
        { en: 'NVIDIA Container Toolkit', si: 'A tool that gives Docker containers access to GPUs (--gpus all).' },
        { en: 'CUDA Driver vs Toolkit', si: 'The driver lets the operating system communicate with the GPU; the toolkit provides CUDA libraries for building / running applications.' },
        { en: 'Forward Compatibility', si: 'A compatibility package that can let applications built with a newer CUDA toolkit run on an older driver on supported data-center GPUs.' },
        { en: 'nvidia-smi', si: 'A command that displays GPU status, driver version, memory, utilization, and processes.' },
        { en: 'Git', si: 'A version-control system for tracking code changes and collaborating with a team.' },
      ],
      si: 'ඔයාගේ computer එකේ nvidia-smi “CUDA Version: 12.4” කියලා පෙන්වනවා නම් ඒක driver එක support කරන උපරිම CUDA version එකයි, install කරපු toolkit එක නෙවෙයි. Toolkit එක බලන්න nvcc --version දාන්න. RAPIDS install කරන්න Conda, pip හෝ Docker තෝරලා official install selector එකේ command එක භාවිතා කරන්න. GPU memory 23,000 MiB / 24,576 MiB නම් ඉඩ අඩුයි; Dask partition size අඩු කරලා බලන්න.',
    },
    {
      id: 'hands-on-sri-lankan-retail-gpu',
      plain: "Define a measurable task such as daily store-product demand prediction, then establish a correct pandas/scikit-learn CPU baseline before acceleration.",
      internGuide: ["Define a measurable task such as daily store-product demand prediction, then establish a correct pandas/scikit-learn CPU baseline before acceleration.","Profile ingestion, joins, features, training, and evaluation. Enable cudf.pandas or explicit cuDF for large tabular stages and use a supported cuML/XGBoost estimator where beneficial.","Split by time and store/product boundaries, prevent future sales or promotion leakage, preserve currency/timezone semantics, and evaluate seasonal and low-volume segments.","Compare end-to-end runtime, peak memory, metric quality, and cost on the same data. Package the pipeline with pinned versions, quality checks, drift monitoring, and a CPU fallback plan."],
      title: 'And More: Hands-on, Accelerating a Sri Lankan Retail Sales Workflow with cudf.pandas and cuML',
      body: [
        'Now combine the ideas. A supermarket chain with 250 branches across Sri Lanka has 150 million bill-line rows over three years: date, branch, district, item, category, qty, unit_price_rs, payment_method, and loyalty_id. Answer two questions: (1) daily sales and monthly trends by branch / category (ETL + EDA); (2) group loyalty customers into segments with k-means and predict who will spend more next month.',
        'Step 1 (before): run the existing pandas notebook on CPU and use %time to record each step; this is your baseline. Step 2: convert the CSV to Parquet once. Step 3: add %load_ext cudf.pandas at the start of the notebook, restart the kernel, and rerun without changing the code. Use the profiler to find CPU fallbacks (often row-wise .apply() or Python loops) and vectorize them. Step 4: for ML, replace sklearn KMeans / RandomForest with cuML (or cuml.accel) and use XGBoost with device="cuda".',
        'Expected behavior, qualitatively: large operations such as Parquet reads, groupby, merge, and sort may be several times to more than ten times faster. Fallback operations, small DataFrames, and Python loops may not benefit and can be a little slower. ML training (k-means, random forest, XGBoost) can be substantially faster on large data. Overall notebook speedup is limited by the slowest part (the idea behind Amdahl’s law). Results vary by GPU, CPU, and data, so always measure on your own system.',
        'Step 5: add reproducibility and MLOps: config.yaml, seeds, an MLflow run, environment.yml, and a Git commit. Step 6: schedule the script with python -m cudf.pandas score.py for nightly batch scoring (offline inference), with data-quality and drift checks. This project is useful practice for both a GitHub portfolio and the NCA-ADS exam.',
      ],
      analogy: 'This is like replacing the engine in an old lorry (CPU pandas) with a new one (GPU) while keeping the body and steering (pandas code). First measure the Colombo–Galle trip time as a baseline, then replace the engine and measure again. Traffic lights (fallbacks, loops) still slow you down, so turn those sections into an expressway with vectorized code.',
      example: 'Illustrative timings only; your machine will differ. CPU pandas: CSV load 4 minutes, groupby + merge 6 minutes, features 5 minutes, sklearn KMeans + RandomForest 25 minutes—about 40 minutes total. GPU: Parquet load + cudf.pandas ETL under 1 minute, cuML KMeans + RandomForest 1–2 minutes. After vectorizing one .apply() fallback, the full pipeline takes a few minutes. The saved time lets you try more features and hyperparameters.',
      code: {
        lang: 'python',
        src: `%load_ext cudf.pandas
import pandas as pd                                   # same code before and after
from cuml.cluster import KMeans                       # use cuML instead of sklearn.cluster

df = pd.read_parquet("lk_retail.parquet")             # Parquet instead of CSV
df["revenue"] = df["qty"] * df["unit_price_rs"]       # vectorized; avoid .apply
daily = df.groupby(["date", "district"])["revenue"].sum().reset_index()

cust = df.groupby("loyalty_id").agg(spend=("revenue", "sum"),
                                    visits=("date", "nunique"),
                                    items=("qty", "sum")).reset_index()
X = cust[["spend", "visits", "items"]].astype("float32")
X = (X - X.mean()) / X.std()                          # scaling (needed for k-means)
cust["segment"] = KMeans(n_clusters=5, random_state=42).fit_predict(X)
print(cust.groupby("segment")["spend"].mean())         # average spend per segment`,
      },
      keyPoints: [
        'Measure the CPU baseline first (%time); you cannot claim a speedup without measuring.',
        'Convert CSV → Parquet, use %load_ext cudf.pandas, find fallbacks, and vectorize them.',
        'For ML, use cuML / cuml.accel and XGBoost device="cuda"; keep data on the GPU.',
        'Speedup depends on workload / hardware; the slowest part limits overall performance.',
        'Add config, seeds, MLflow, and Git to make a portfolio project.',
      ],
      terms: [
        { en: 'Baseline Measurement', si: 'Measuring the time / result of the original approach before making a change.' },
        { en: 'Customer Segmentation', si: 'Grouping customers with similar behavior, for example with k-means.' },
        { en: 'Amdahl\'s Law (idea)', si: 'When only part of a workflow is accelerated, the unaccelerated part limits total speedup.' },
        { en: 'Batch Scoring', si: 'Making predictions for many records at a scheduled time (offline inference).' },
      ],
      si: 'ඔයාගේ supermarket chain එකට branches 250ක වසර 3ක bills rows මිලියන 150ක් තියෙනවා. මුලින් CPU pandas notebook එකේ හැම පියවරකම වෙලාව මැනලා baseline එක ලියන්න; පස්සේ CSV එක Parquet කරලා cudf.pandas සහ cuML උත්සාහ කරන්න. Fallback එකක් හෝ Python loop එකක් ඉතිරි නම් ඒක මුළු speedup එක සීමා කරන්න පුළුවන්. GPU, CPU, data අනුව ප්‍රතිඵල වෙනස් නිසා ඔයාගේ machine එකේම මැනලා බලන්න.',
    },
  ],
  quiz: [
    {
      q: 'You run one groupby on a 3,000-row CSV. Why might the GPU not provide a large speedup?',
      options: [
        'Because GPUs cannot perform groupby operations',
        'The dataset is small, so data-copy and setup overhead may exceed the calculation time',
        'Because GPUs cannot read CSV files',
      ],
      answer: 1,
      why: 'GPUs are most useful for large, parallel workloads. With small data, PCIe transfer and kernel-launch overhead can take longer than the calculation.',
    },
    {
      q: 'What is a common reason for a GPU pipeline to run slowly?',
      options: [
        'Repeatedly copying data between GPU and CPU inside a loop',
        'Using Parquet files',
        'Using a groupby operation',
      ],
      answer: 0,
      why: 'PCIe transfers are much slower than GPU memory bandwidth. Transfer data to the GPU once and keep it there when possible.',
    },
    {
      q: 'What happens when cudf.pandas encounters an operation that cuDF does not support?',
      options: [
        'The program stops with an error',
        'The operation is skipped',
        'It automatically falls back to CPU pandas; the result is the same, but copying may make it slower',
      ],
      answer: 2,
      why: 'cudf.pandas proxy objects fall back to CPU pandas for operations that cannot run on the GPU. Many fallbacks can reduce speedup.',
    },
    {
      q: 'What does “predicate pushdown” mean in Parquet?',
      options: [
        'A method for compressing a file',
        'Using row-group min / max statistics to skip parts that cannot match a filter',
        'Converting columns into rows',
      ],
      answer: 1,
      why: 'The filter is passed to the reader, which uses statistics to skip row groups that cannot match. This reduces the amount of data read.',
    },
    {
      q: 'In dask_cudf, when does ddf.groupby("station")["fare"].sum() actually calculate the result?',
      options: [
        'As soon as that line runs',
        'When you call .compute() (or .persist())',
        'When you save the notebook',
      ],
      answer: 1,
      why: 'Dask is lazy: it first creates a task graph. The work runs when you call .compute() or .persist().',
    },
    {
      q: 'Which settings enable GPU training in XGBoost 2.x?',
      options: [
        'device="cuda", tree_method="hist"',
        'gpu=True, tree_method="exact"',
        'device="cpu", n_jobs=-1',
      ],
      answer: 0,
      why: 'Starting with XGBoost 2.0, use device="cuda" and tree_method="hist". Older versions used tree_method="gpu_hist".',
    },
    {
      q: 'A model gets 99.5% accuracy on a dataset where only 0.5% of cases are fraud. What is the best next step?',
      options: [
        'Put the model into production',
        'Check recall, precision, and PR-AUC; use stratified CV and class weights such as scale_pos_weight',
        'Remove fraud rows from the test set',
      ],
      answer: 1,
      why: 'A model that always predicts “not fraud” can still get 99.5% accuracy. Imbalanced data needs suitable metrics and methods.',
    },
    {
      q: 'What does “CUDA Version: 12.4” in nvidia-smi indicate?',
      options: [
        'The installed CUDA toolkit version',
        'The highest CUDA version supported by the driver',
        'The GPU hardware generation',
      ],
      answer: 1,
      why: 'The CUDA Version shown by nvidia-smi is the driver’s maximum supported version. Use nvcc --version to check the installed toolkit.',
    },
    {
      q: 'The input distribution stays the same, but customers with the same features now behave differently and the target changes. What is this?',
      options: ['Data drift', 'Concept drift', 'Class imbalance'],
      answer: 1,
      why: 'Concept drift is a change in the relationship between inputs and the target. Data drift is a change in the input distribution.',
    },
    {
      q: 'Which cuGraph algorithm is suitable for finding groups of accounts that mostly transfer money to one another?',
      options: [
        'Louvain (community detection)',
        'SSSP (shortest path)',
        'ARIMA',
      ],
      answer: 0,
      why: 'Louvain / Leiden find communities with many internal connections and fewer external ones. SSSP finds shortest distances; ARIMA is for time series.',
    },
  ],
}
