# 28: MLOps and LLMOps: Deploying, Monitoring and Maintaining Models

> **Before you start:** [02](02-python-programming.md) (Python, decorators, virtual environments, requirements.txt), [03](03-developer-tools.md) (terminal, Git, GitHub Actions, REST APIs, HTTP status codes, environment variables), [10](10-data-science-workflow.md) (CRISP-DM, data pipelines), [11](11-ml-fundamentals.md#17-pipelines) (scikit-learn pipelines), [13](13-evaluation-metrics-and-tuning.md) (metrics), [15](15-neural-networks.md#19-a-complete-training-loop) (checkpoints, state_dict), [22](22-prompt-engineering.md) (LLM APIs, prompt versioning), [26](26-evaluating-llms.md) (eval pipelines), [27](27-inference-and-serving.md) (serving engines, latency, autoscaling).
>
> **After this file you can:** save and load models; wrap a model in a web API with FastAPI; build a quick demo UI; package it with Docker; understand Kubernetes and cloud ML platforms; track experiments; version data and models; set up CI/CD for ML; monitor models for drift; and apply all of this to LLM applications (LLMOps).

---

## Table of contents

1. [What is MLOps and why does it matter?](#1-what-is-mlops)
2. [The ML lifecycle in production](#2-the-ml-lifecycle)
3. [Saving and loading models (serialisation)](#3-serialisation)
4. [Serving a model as an API with FastAPI](#4-fastapi)
5. [Quick demo UIs: Streamlit and Gradio](#5-streamlit-and-gradio)
6. [Docker: packaging everything together](#6-docker)
7. [Kubernetes basics](#7-kubernetes)
8. [Cloud ML platforms](#8-cloud-ml-platforms)
9. [Experiment tracking](#9-experiment-tracking)
10. [Data and model versioning; model registry](#10-versioning-and-registry)
11. [Pipelines and orchestration](#11-pipelines-and-orchestration)
12. [Feature stores](#12-feature-stores)
13. [CI/CD for ML](#13-cicd-for-ml)
14. [Deployment patterns: batch, online, streaming, edge](#14-deployment-patterns)
15. [Safe rollouts: shadow, canary, blue-green, A/B](#15-safe-rollouts)
16. [Monitoring: system, data and model](#16-monitoring)
17. [Data drift and concept drift](#17-drift)
18. [Retraining strategies](#18-retraining)
19. [LLMOps: what's different for LLM applications](#19-llmops)
20. [MLOps maturity and a reference architecture](#20-maturity-and-architecture)
21. [Check yourself](#21-check-yourself)
22. [New words in this file](#22-new-words-in-this-file)

---

## 1. What is MLOps?

**MLOps** (Machine Learning Operations) = practices and tools for reliably **deploying, running, monitoring and improving** ML models in production. It combines ML, software engineering (DevOps) and data engineering.

**Why it matters:** a famous observation is that most ML projects never reach production, and many that do quietly degrade. The model code is a **small part** of a real ML system; the rest is data pipelines, serving infrastructure, monitoring, configuration and testing.

```
┌──────────────────────────────────────────────────────────────────┐
│ Data collection │ Data validation │ Feature engineering │ Config  │
├─────────────────┼─────────────────┼──────────┬──────────┼─────────┤
│ Serving infra   │  Monitoring     │ ML CODE  │ Testing  │ Resource│
│                 │                 │ (small!) │          │ mgmt    │
└──────────────────────────────────────────────────────────────────┘
```

**Analogy:** building a great recipe (the model) vs running a restaurant (MLOps): sourcing ingredients daily, consistent cooking, serving thousands of customers, health inspections, and adapting when tastes change.

**DevOps** = practices that let software teams ship changes quickly and safely (automation, CI/CD, monitoring). MLOps adds **data** and **models**, which change over time and can silently go wrong.

---

## 2. The ML lifecycle

```
   ┌─────────► Data ingestion & validation ──► Feature engineering ──► Training ──┐
   │                                                                              ▼
Retrain ◄── Monitoring (drift, performance) ◄── Deployment ◄── Model registry ◄── Evaluation
```

It's a **loop** (like CRISP-DM, [file 10](10-data-science-workflow.md#1-the-workflow-crisp-dm)): the world changes, models degrade, and you retrain.

**Key principle: reproducibility.** Anyone (including you in six months) should be able to recreate any model exactly: same code (Git), same data (data versioning), same environment (Docker/requirements), same hyperparameters and seeds (experiment tracking).

---

## 3. Serialisation

**Serialisation** = saving a trained model (an object in memory) to a file, so it can be loaded elsewhere.

| Format | For | Notes |
|---|---|---|
| **pickle** | Any Python object | ⚠️ Loading a pickle can **run arbitrary code**. Never load pickles from untrusted sources |
| **joblib** | scikit-learn models/pipelines | Efficient for large NumPy arrays; same security caveat as pickle |
| **PyTorch `state_dict`** (`.pt`/`.pth`) | PyTorch weights | Save weights, rebuild the model class, then load ([file 15](15-neural-networks.md#19-a-complete-training-loop)) |
| **safetensors** | Neural network weights | **Safe** (no code execution), fast; the standard on Hugging Face |
| **ONNX** | Portable models across frameworks/runtimes | Run with ONNX Runtime; good for production and edge ([file 27](27-inference-and-serving.md#18-classic-ml-inference)) |
| **GGUF** | Local LLMs (llama.cpp) | [file 27](27-inference-and-serving.md#16-running-locally) |
| **XGBoost/LightGBM native** (`.json`/`.ubj`/`.txt`) | Boosted trees | Stable across versions |

```python
import joblib
joblib.dump(pipeline, "churn_pipeline_v3.joblib")     # save the WHOLE pipeline (preprocessing + model)
pipeline = joblib.load("churn_pipeline_v3.joblib")

import torch
torch.save(model.state_dict(), "model.pt")
model = MyNet(); model.load_state_dict(torch.load("model.pt")); model.eval()
```

**Save the whole pipeline**, not just the model. Otherwise production preprocessing may differ from training (**training-serving skew**, section 12). Also save the **library versions** used.

---

## 4. FastAPI

**FastAPI** is a modern Python web framework for building REST APIs ([file 03](03-developer-tools.md#12-apis-and-rest)). It uses type hints and **Pydantic** ([file 22](22-prompt-engineering.md#9-structured-output-json)) to validate requests automatically, and generates interactive documentation.

```python
# app.py      pip install fastapi uvicorn joblib scikit-learn pandas
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
import joblib, pandas as pd

app = FastAPI(title="Churn Prediction API", version="3.0")
model = joblib.load("churn_pipeline_v3.joblib")        # load ONCE at startup, not per request

class Customer(BaseModel):                             # request schema with validation
    tenure: int = Field(ge=0, le=600)
    monthly_charges: float = Field(gt=0)
    contract: str                                      # e.g. "month-to-month"
    city: str

class Prediction(BaseModel):
    churn_probability: float
    will_churn: bool
    model_version: str

@app.get("/health")                                    # used by load balancers/Kubernetes
def health():
    return {"status": "ok"}

@app.post("/predict", response_model=Prediction)
def predict(c: Customer):
    try:
        X = pd.DataFrame([c.model_dump()])
        p = float(model.predict_proba(X)[0, 1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return Prediction(churn_probability=p, will_churn=p >= 0.35, model_version="3.0")
```

```bash
uvicorn app:app --host 0.0.0.0 --port 8000 --workers 2
# Interactive docs: http://localhost:8000/docs
curl -X POST localhost:8000/predict -H "Content-Type: application/json" \
     -d '{"tenure": 3, "monthly_charges": 95.5, "contract": "month-to-month", "city": "Kandy"}'
```

Notes:
- Invalid input (e.g. negative tenure) automatically returns a **422** error with a clear message
- `@app.post(...)` is a **decorator** ([file 02](02-python-programming.md#21-generators-decorators-type-hints))
- Use `async def` endpoints for I/O-heavy work (like calling LLM APIs) so the server handles many requests concurrently
- **Flask** is an older, simpler alternative; **BentoML**, **Ray Serve**, **Triton** ([file 27](27-inference-and-serving.md#13-serving-engines)) are specialised model-serving frameworks

---

## 5. Streamlit and Gradio

For **demos, prototypes, internal tools**: build a web UI in pure Python in minutes.

```python
# demo.py      pip install streamlit      run: streamlit run demo.py
import streamlit as st, joblib, pandas as pd
model = joblib.load("churn_pipeline_v3.joblib")
st.title("Customer Churn Predictor")
tenure = st.slider("Tenure (months)", 0, 72, 12)
charges = st.number_input("Monthly charges", 10.0, 200.0, 70.0)
contract = st.selectbox("Contract", ["month-to-month", "one-year", "two-year"])
if st.button("Predict"):
    p = model.predict_proba(pd.DataFrame([{"tenure": tenure, "monthly_charges": charges,
                                           "contract": contract, "city": "Colombo"}]))[0, 1]
    st.metric("Churn probability", f"{p:.0%}")
```

```python
# Gradio: popular for ML/LLM demos; easy to share and host on Hugging Face Spaces
import gradio as gr
def chat(message, history):
    return "You said: " + message          # replace with an LLM call (file 22)
gr.ChatInterface(chat).launch()
```

Great for showing stakeholders early and getting feedback. For production user-facing apps, teams usually build a separate frontend that calls your API.

---

## 6. Docker

**The problem:** "It works on my machine!" Different Python versions, libraries, OS packages and CUDA versions break deployments.

**Docker** packages your app **and everything it needs** (OS libraries, Python, packages, model files, code) into a **container**: a lightweight, isolated, portable unit that runs the same way everywhere.

**Analogy:** a shipping container. Whatever's inside, every ship, crane and truck in the world can handle it the same way.

- **Image:** the packaged blueprint (read-only), built from a **Dockerfile**
- **Container:** a running instance of an image
- **Registry:** where images are stored and shared (Docker Hub, AWS ECR, Google Artifact Registry, NVIDIA NGC)

```dockerfile
# Dockerfile
FROM python:3.11-slim                      # base image
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # install dependencies (cached layer)
COPY app.py churn_pipeline_v3.joblib ./
EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
```

```bash
docker build -t churn-api:3.0 .            # build the image
docker run -p 8000:8000 churn-api:3.0      # run a container, mapping port 8000
docker ps                                  # list running containers
docker push myregistry/churn-api:3.0       # share the image
```

**Tips:**
- Pin package versions in `requirements.txt` for reproducibility
- Order Dockerfile steps so things that change rarely (dependencies) come before things that change often (code); Docker caches unchanged layers
- Keep images small (slim base images; don't copy datasets in)
- **Never bake secrets** (API keys) into images; pass them as environment variables at runtime ([file 03](03-developer-tools.md#3-environment-variables-and-secrets))
- **GPU containers:** use NVIDIA CUDA base images (or NGC containers) and the NVIDIA Container Toolkit (`docker run --gpus all ...`)
- **docker compose** runs multi-container apps (API + database + vector DB) with one file

---

## 7. Kubernetes

When you have many containers across many machines, you need an **orchestrator**. **Kubernetes (K8s)** automatically deploys, scales, heals and networks containers.

| Concept | Meaning |
|---|---|
| **Cluster** | A group of machines (**nodes**) managed together |
| **Pod** | The smallest unit: one or more containers running together |
| **Deployment** | Declares "run N replicas of this pod"; handles rolling updates and restarts crashed pods |
| **Service** | A stable network address that load-balances across pods |
| **Ingress** | Routes external HTTP traffic into services |
| **HPA (Horizontal Pod Autoscaler)** | Adds/removes pods based on CPU, memory or custom metrics (e.g. requests/s, GPU utilisation) |
| **ConfigMap / Secret** | Configuration and secrets injected into pods |
| **Resource requests/limits** | CPU, memory, **GPUs** each pod needs (`nvidia.com/gpu: 1`) |
| **Liveness/readiness probes** | Health checks (e.g. our `/health` endpoint) |

**You declare the desired state** in YAML ("3 replicas of churn-api:3.0, each with 1 CPU"), and Kubernetes keeps reality matching it.

Managed versions: **EKS** (AWS), **GKE** (Google), **AKS** (Azure). ML-focused layers on top: **KServe**, **Kubeflow**, **Ray**. For LLM serving, the NVIDIA GPU Operator, NIM Operator and inference servers integrate with Kubernetes.

As an intern you'll mostly **use** Kubernetes set up by platform engineers. Understand the concepts.

**Serverless** alternatives (AWS Lambda, Google Cloud Run, serverless GPU providers): you deploy a container/function and the platform scales it (even to zero). Simpler, but with cold starts and limits.

---

## 8. Cloud ML platforms

| Platform | Provider | Offers |
|---|---|---|
| **Amazon SageMaker** | AWS | Notebooks, training jobs, hyperparameter tuning, model registry, endpoints, pipelines, monitoring |
| **Amazon Bedrock** | AWS | Managed access to foundation models (Claude, Llama, Mistral, etc.), knowledge bases (RAG), agents, guardrails |
| **Vertex AI** | Google Cloud | Similar end-to-end ML platform + Gemini models |
| **Azure Machine Learning / Azure AI Foundry** | Microsoft | Similar; OpenAI models via Azure |
| **Databricks** | Multi-cloud | Data + ML platform (Spark, MLflow, feature store, model serving) |
| **NVIDIA AI Enterprise / DGX Cloud / NIM** | NVIDIA | GPU-optimised software stack, models and infrastructure |
| **Hugging Face** | | Model/dataset hub, Inference Endpoints, Spaces |

**Trade-off:** managed platforms save setup time and integrate everything, but cost more and can lock you into one vendor.

---

## 9. Experiment tracking

You'll train dozens or hundreds of models with different data, features and hyperparameters. Without tracking, you'll forget which run produced the best model and how.

**Track for every run:** code version (Git commit), data version, hyperparameters, metrics (and curves), environment, artefacts (model files, plots), notes.

**MLflow** (open source, very common):

```python
import mlflow, mlflow.sklearn
from sklearn.metrics import roc_auc_score

mlflow.set_experiment("churn")
with mlflow.start_run(run_name="lgbm_v3"):
    params = {"n_estimators": 800, "learning_rate": 0.05, "num_leaves": 31}
    mlflow.log_params(params)
    model = LGBMClassifier(**params).fit(X_train, y_train)
    auc = roc_auc_score(y_val, model.predict_proba(X_val)[:, 1])
    mlflow.log_metric("val_auc", auc)
    mlflow.sklearn.log_model(model, "model")          # saves the model as an artefact
# view: run `mlflow ui` and open http://localhost:5000
```

**Weights & Biases (W&B):** popular hosted tracking with great dashboards for deep learning (live loss curves, GPU usage, comparisons, sweeps). Others: Neptune, Comet, TensorBoard ([file 15](15-neural-networks.md#21-debugging-neural-networks)), ClearML.

---

## 10. Versioning and registry

### Data versioning

Git isn't designed for large files ([file 03](03-developer-tools.md#4-git-version-control)). **DVC (Data Version Control)** stores large data/model files in cloud storage while Git tracks small pointer files, so a Git commit points to the **exact** data version used. Alternatives: LakeFS, Delta Lake/Iceberg table versioning ("time travel"), Hugging Face Datasets versions.

```bash
dvc init
dvc add data/train.parquet          # creates data/train.parquet.dvc (a small pointer file)
git add data/train.parquet.dvc .gitignore && git commit -m "Track training data v1"
dvc push                            # uploads the actual data to remote storage (S3, GCS...)
```

### Model registry

A **model registry** is a central catalogue of trained models with:
- **Versions** (v1, v2, v3...)
- **Stages/aliases** (e.g. `staging`, `production`, `archived`)
- **Lineage:** which code, data, and run produced it; its metrics
- Approval workflows (who promoted it to production and when)
- **Model cards** documenting intended use and limitations (file 29)

Examples: MLflow Model Registry, SageMaker/Vertex registries, W&B Registry, Hugging Face Hub.

The deployment system loads "the model tagged `production`", so promoting or rolling back is just moving a tag.

---

## 11. Pipelines and orchestration

Production ML runs as **automated pipelines** rather than notebooks run by hand:

```
[Extract data] → [Validate data] → [Build features] → [Train] → [Evaluate] → [Register if better] → [Deploy]
```

**Orchestrators** schedule and run these steps (as a **DAG**, a Directed Acyclic Graph: steps with dependencies and no cycles), retry failures, and log everything:
- **Apache Airflow** (most common for data pipelines), **Prefect**, **Dagster**
- ML-focused: **Kubeflow Pipelines**, **SageMaker Pipelines**, **Vertex Pipelines**, **ZenML**, **Metaflow**

### Data validation

Check data **before** training or predicting, so bad data doesn't silently produce bad models:
- **Schema checks:** expected columns and types
- **Value checks:** ranges (age 0 to 120), allowed categories, missing-value rates, uniqueness
- **Distribution checks:** has a feature's distribution shifted? (section 17)

Tools: **Great Expectations**, **Pandera**, TFX Data Validation, plain `assert` statements ([file 10](10-data-science-workflow.md#5-clean-data)).

### Big data processing

**Apache Spark** (PySpark) processes data too big for one machine across a cluster; **Dask**, **Ray**, **Polars** ([file 08](08-numpy-and-pandas.md#22-polars-and-big-data)) and **RAPIDS cuDF** (GPU DataFrames) are other options.

---

## 12. Feature stores

### Training-serving skew

**Training-serving skew** = features computed differently in training vs in production. Example: in training, `avg_spend_30d` was computed in SQL from a clean warehouse; in production, an engineer re-implemented it in Java with a subtle difference (e.g. including today's purchases). The model receives different inputs than it learned from and performs worse, **silently**.

### Feature stores

A **feature store** is a central system to define, compute, store and serve features consistently:
- **One definition** of each feature, used for both training and serving
- **Offline store:** historical feature values for training (with **point-in-time correctness**: values as they were **at the time** of each training example, to avoid leakage, [file 10](10-data-science-workflow.md#13-data-leakage-preview))
- **Online store:** low-latency latest values for real-time predictions (e.g. Redis)
- Feature reuse across teams and models

Tools: **Feast** (open source), Tecton, Databricks/SageMaker/Vertex feature stores.

---

## 13. CI/CD for ML

**CI (Continuous Integration):** every code change is automatically tested.
**CD (Continuous Delivery/Deployment):** changes that pass tests are automatically packaged and deployed (or made ready to deploy).

**For ML, test more than code:**

| Test type | Example |
|---|---|
| **Unit tests** for code | Feature function returns correct values; preprocessing handles missing values (`pytest`) |
| **Data tests** | Schema and range checks on new data |
| **Model quality gates** | New model's validation AUC ≥ current production model's (and ≥ an absolute minimum); no slice drops by more than X ([file 26](26-evaluating-llms.md#16-statistics-for-evals)) |
| **Behavioural tests** | Invariance (changing a customer's name shouldn't change the prediction), directional expectations (more late payments → higher risk) |
| **Fairness checks** | Metrics across groups within limits (file 29) |
| **Integration tests** | The API container starts, `/health` returns 200, `/predict` returns valid output |
| **Performance tests** | Latency p95 under the SLO at expected load ([file 27](27-inference-and-serving.md#4-latency-and-throughput-metrics)) |

```yaml
# .github/workflows/ci.yml  (GitHub Actions, file 03)
name: ci
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: "3.11" }
      - run: pip install -r requirements.txt
      - run: pytest tests/                       # code + data + model quality tests
      - run: docker build -t churn-api:${{ github.sha }} .
```

**Continuous Training (CT):** pipelines that automatically retrain models on new data, evaluate them, and promote them if they pass the gates (section 18).

---

## 14. Deployment patterns

| Pattern | How | Example | Latency need |
|---|---|---|---|
| **Batch (offline) prediction** | Score all records on a schedule; save results to a table | Nightly churn scores for all customers; weekly demand forecasts | Hours OK |
| **Online (real-time) prediction** | API responds per request | Fraud check during payment; product recommendations on page load | Milliseconds to seconds |
| **Streaming** | Score events as they flow through a stream (Kafka, Kinesis) | Real-time anomaly detection on sensor data | Seconds |
| **Edge / on-device** | Model runs on phones, cameras, IoT devices | Face unlock; offline crop-disease detection app | Instant; offline |
| **Embedded in a database/BI tool** | SQL calling a model | Analysts scoring in the warehouse | Varies |

**Start with batch** if the business allows it: it's simpler, cheaper and easier to monitor.

---

## 15. Safe rollouts

Never switch 100% of traffic to a new model at once.

| Strategy | How |
|---|---|
| **Shadow deployment** | New model receives copies of real requests and makes predictions, but **its outputs aren't used**. Compare with the current model safely. |
| **Canary release** | Send a small % of traffic (e.g. 5%) to the new model; watch metrics; gradually increase |
| **Blue-green deployment** | Two identical environments; switch traffic from blue (old) to green (new) at once, and switch back instantly if problems appear |
| **A/B test** | Randomly split users between models and measure **business** impact with statistics ([file 07](07-math-probability-statistics.md#20-ab-testing)) |
| **Multi-armed bandits** | Adaptively send more traffic to the better-performing variant during the test |

**Always have a rollback plan:** keep the previous model version ready in the registry (section 10).

---

## 16. Monitoring

Once deployed, things go wrong in three layers:

| Layer | What to watch | Examples |
|---|---|---|
| **System / operational** | Is the service healthy? | Latency (p50/p95/p99), throughput, error rates (HTTP 5xx), CPU/GPU/memory use, uptime |
| **Data** | Are inputs as expected? | Missing values, schema changes, out-of-range values, **feature distribution drift** |
| **Model / business** | Are predictions still good? | Prediction distribution, accuracy/precision/recall **when labels arrive**, business KPIs (conversion, fraud losses) |

**The ground truth delay problem:** you often don't know if a prediction was right until much later (did the customer churn? It takes 30 days to find out; was the loan repaid? Months). So monitor **proxies** meanwhile: input drift, prediction drift, user feedback.

**Tools:** Prometheus + Grafana (system metrics, dashboards), cloud monitoring, Evidently AI / WhyLabs / Arize / Fiddler (data and model drift), logging stacks (ELK, OpenTelemetry, [file 24](24-ai-agents.md#14-evaluating-agents)).

**Alerts:** define thresholds that trigger alerts (e.g. error rate > 1%, p95 latency > 800 ms, a key feature's drift score above a limit), routed to an on-call person with a **runbook** (what to check and do).

---

## 17. Drift

Models learn patterns from the past. When the world changes, performance decays. This is called **model decay** or **model staleness**.

### Data drift (covariate shift)

The **input distribution** changes: P(X) shifts.
- A bank's customer base gets younger after launching a mobile app
- A new phone model produces brighter photos for an image classifier
- Users start asking a chatbot about a new product

### Concept drift

The **relationship between inputs and the target** changes: P(y | X) shifts. The same inputs now mean something different.
- Fraudsters change tactics: patterns that used to be "safe" are now fraud
- During COVID-19, buying patterns changed overnight; demand forecasting models broke
- After an interest-rate change, the same income/debt profile has a different default risk

**Types by speed:** **sudden** (a policy change), **gradual** (slowly changing tastes), **seasonal/recurring** (holidays; [seasonality, file 10](10-data-science-workflow.md#14-time-series-basics)).

### Other changes

- **Label drift (prior shift):** P(y) changes (fraud rate rises from 1% to 3%)
- **Upstream data changes:** a data team renames a column or changes units (cm → m). Not drift in the world, but equally harmful. Data validation catches these.
- **Feedback loops:** the model's own decisions change future data (a recommender only shows certain items, so it only gets clicks on those)

### Detecting drift

Compare **recent production data** with a **reference** (usually the training data):

| Method | For |
|---|---|
| **PSI (Population Stability Index)** | Binned numeric/categorical features; rule of thumb: < 0.1 stable, 0.1 to 0.25 moderate shift, > 0.25 significant shift |
| **Kolmogorov-Smirnov (KS) test** | Numeric features ([hypothesis tests, file 07](07-math-probability-statistics.md#18-hypothesis-testing-and-p-values)) |
| **Chi-square test** | Categorical features |
| **KL / Jensen-Shannon divergence, Wasserstein distance** | Distribution distances ([KL, file 07](07-math-probability-statistics.md#24-kl-divergence)) |
| **Embedding drift** | For text/images: compare distributions of embeddings (e.g. distance between mean embeddings, or a classifier trained to tell old from new data) |
| **Performance monitoring** | The real test, once labels arrive |

**PSI formula:** PSI = Σ (actual% − expected%) × ln(actual% / expected%) over bins.

**Worked example (2 bins):** training: 50% / 50%; production: 70% / 30%
PSI = (0.7 − 0.5)·ln(0.7/0.5) + (0.3 − 0.5)·ln(0.3/0.5) = 0.2 × 0.336 + (−0.2) × (−0.511) = 0.067 + 0.102 = **0.169** → moderate shift; investigate.

⚠️ With big data, statistical tests flag tiny, harmless differences as "significant" ([effect size, file 07](07-math-probability-statistics.md#18-hypothesis-testing-and-p-values)). Focus on drift in **important features** and on actual performance.

---

## 18. Retraining

| Strategy | When |
|---|---|
| **Scheduled** (daily/weekly/monthly) | Steady, predictable change; simple to run |
| **Triggered** | When drift or performance drops cross a threshold |
| **Continuous / online learning** | Model updates incrementally with each new batch of data (fast-changing domains); riskier |

**Retraining choices:**
- **Data window:** all history, or only recent data (sliding window), or weighted toward recent
- **Same model vs re-tuning** hyperparameters/features
- **Always evaluate** the new model against the current one on recent held-out data before promoting (section 13's quality gates), and roll out safely (section 15)

---

## 19. LLMOps

**LLMOps** = MLOps adapted for applications built on LLMs. Many principles carry over; key differences:

| Aspect | Classic MLOps | LLMOps |
|---|---|---|
| Model | Usually trained in-house | Often a **third-party API** or open model; sometimes fine-tuned ([file 21](21-training-finetuning-alignment.md)) |
| Main artefacts to version | Code, data, model | **Prompts**, model name/version, retrieval index & embedding model, tool definitions, decoding settings, guardrail configs |
| Evaluation | Accuracy, AUC... | Eval suites with LLM judges, faithfulness, safety ([file 26](26-evaluating-llms.md)) |
| Cost | Mostly fixed infrastructure | **Per-token** usage; can spike unexpectedly |
| Failure modes | Wrong predictions | Hallucinations, prompt injection, unsafe content, format errors, provider outages, silent model updates |
| Monitoring | Drift in features | Drift in **user queries/topics**, quality scores, refusal rates, token usage, latency (TTFT) |

### LLMOps practices

- **Prompt management:** prompts in version control or a prompt registry, with change history, linked to eval results ([file 22](22-prompt-engineering.md#19-prompts-are-code))
- **Model version pinning:** use dated/specific model versions; re-run evals before upgrading
- **Gateway / router:** a central layer for all LLM calls: authentication, rate limits, retries, **fallback providers**, caching, cost tracking per team/feature, model routing (e.g. LiteLLM, cloud AI gateways)
- **Tracing and observability:** log each request's prompt, retrieved documents, tool calls, outputs, tokens, latency and cost as traces ([file 24](24-ai-agents.md#14-evaluating-agents)) (LangSmith, Langfuse, Arize Phoenix, W&B Weave, OpenTelemetry). **Mind privacy:** redact PII in logs (file 29).
- **Guardrails:** input and output checks (prompt injection detection, PII filtering, topic restrictions, toxicity, output format validation): NeMo Guardrails, Llama Guard, provider moderation endpoints, custom classifiers (file 29)
- **Evaluation in CI:** run the golden set on every prompt/model/retrieval change; block regressions ([file 26](26-evaluating-llms.md#17-eval-pipeline))
- **Online evaluation and feedback loops:** sample production traffic for judge scoring; collect thumbs up/down; turn failures into new test cases
- **Cost controls:** budgets and alerts per feature; caching; smaller models where possible ([file 27](27-inference-and-serving.md#15-cost-and-capacity))
- **RAG index operations:** scheduled ingestion, incremental updates, deletions, re-embedding on model change ([file 23](23-embeddings-vector-databases-rag.md#20-production-concerns))
- **Incident response:** what to do if the bot starts giving harmful or wrong answers: a kill switch, fallback to a safe canned response or human agents

---

## 20. Maturity and architecture

### MLOps maturity levels (simplified)

| Level | Description |
|---|---|
| **0: Manual** | Notebooks, manual training and deployment, no monitoring |
| **1: Pipeline automation** | Automated training pipelines, experiment tracking, model registry, continuous training |
| **2: Full CI/CD** | Automated testing and deployment of pipelines and models, monitoring with triggered retraining, safe rollouts |

Most teams are somewhere between 0 and 1. Don't build level 2 for a prototype; grow the tooling as the system's importance grows.

### Reference architecture (a typical setup)

```
Data sources ──► Ingestion (Airflow) ──► Data lake/warehouse ──► Validation (Great Expectations)
                                                   │
                                   Feature store (offline/online)
                                                   │
                      Training pipeline (Kubeflow/SageMaker) + experiment tracking (MLflow/W&B)
                                                   │
                                    Model registry (versions, approvals)
                                                   │
                      CI/CD (GitHub Actions) ──► Docker image ──► Kubernetes / managed endpoint
                                                   │                  (canary rollout)
                                                   ▼
                         Users/apps ◄── FastAPI / Triton / vLLM ──► Logs & traces
                                                                        │
                                Monitoring (Prometheus/Grafana, drift tools) ──► Alerts ──► Retrain trigger
```

---

## 21. Check yourself

**Q1.** Why should you save the full preprocessing + model pipeline rather than only the model?
<details><summary>Answer</summary>So production applies exactly the same preprocessing as training, avoiding training-serving skew.</details>

**Q2.** Why is loading an untrusted pickle file dangerous, and what's a safe alternative for neural network weights?
<details><summary>Answer</summary>Unpickling can execute arbitrary code. Use safetensors.</details>

**Q3.** What does Pydantic do in a FastAPI app?
<details><summary>Answer</summary>Defines request/response schemas and validates input automatically (returning 422 errors for invalid data), plus powers the auto-generated docs.</details>

**Q4.** Image vs container in Docker?
<details><summary>Answer</summary>An image is the packaged, read-only blueprint built from a Dockerfile; a container is a running instance of an image.</details>

**Q5.** What do a Kubernetes Deployment and an HPA do?
<details><summary>Answer</summary>A Deployment keeps N replicas of a pod running and handles updates/restarts; the HPA automatically changes the replica count based on load metrics.</details>

**Q6.** What should be tracked for every experiment run?
<details><summary>Answer</summary>Code version, data version, hyperparameters, metrics, environment, artefacts (model, plots), and notes.</details>

**Q7.** What is a model registry used for?
<details><summary>Answer</summary>Storing versioned models with stages (staging/production), lineage and metrics, approvals, and enabling promotion/rollback.</details>

**Q8.** Give an example of training-serving skew and how a feature store prevents it.
<details><summary>Answer</summary>A feature computed one way in training SQL and another way in production code. A feature store provides one shared definition and serves the same computed values for training (point-in-time) and serving.</details>

**Q9.** Data drift vs concept drift, with an example each.
<details><summary>Answer</summary>Data drift: inputs change (customers get younger). Concept drift: the input→output relationship changes (fraudsters change tactics, so the same transaction patterns now mean fraud).</details>

**Q10.** Compute PSI for bins: expected [0.4, 0.6], actual [0.5, 0.5].
<details><summary>Answer</summary>(0.1)·ln(1.25) + (−0.1)·ln(0.833) = 0.1×0.223 + 0.1×0.182 = **0.041**: stable.</details>

**Q11.** Shadow vs canary deployment?
<details><summary>Answer</summary>Shadow: the new model sees real traffic but its outputs aren't used. Canary: the new model serves a small real percentage of users, increased gradually.</details>

**Q12.** Name four artefacts you must version in an LLM application besides code.
<details><summary>Answer</summary>Prompts, model name/version, embedding model + retrieval index, tool definitions, decoding settings, guardrail configs, eval datasets.</details>

**Q13.** Your churn labels arrive 30 days late. What can you monitor in the meantime?
<details><summary>Answer</summary>Input data quality and drift, prediction distribution drift, system metrics, business proxies and user feedback.</details>

---

## 22. New words in this file

| Word | Meaning |
|---|---|
| MLOps, DevOps | Operating ML systems reliably / software delivery practices |
| Reproducibility | Ability to recreate a result exactly |
| Serialisation | Saving an in-memory object to a file |
| pickle, joblib, safetensors, ONNX | Model file formats |
| Training-serving skew | Features differ between training and production |
| FastAPI, Flask, uvicorn | Python web frameworks / server |
| Endpoint, `/health`, 422 error | API route / health check / validation error |
| BentoML, Ray Serve | Model serving frameworks |
| Streamlit, Gradio, Hugging Face Spaces | Quick demo UIs / hosting |
| Docker, image, container, Dockerfile, registry, layer | Packaging and running apps in containers |
| docker compose | Multi-container setup |
| NVIDIA Container Toolkit, NGC | GPU containers / NVIDIA's container registry |
| Kubernetes, cluster, node, pod, Deployment, Service, Ingress | Container orchestration concepts |
| HPA, ConfigMap, Secret, probes, resource requests | Scaling, config and health in K8s |
| EKS, GKE, AKS, KServe, Kubeflow, Ray | Managed Kubernetes / ML on K8s |
| Serverless, cold start | Platform-managed scaling / startup delay |
| SageMaker, Bedrock, Vertex AI, Azure ML, Databricks | Cloud ML platforms |
| Vendor lock-in | Dependence on one provider |
| Experiment tracking, MLflow, W&B, artefact | Recording runs and outputs |
| DVC, LakeFS, Delta Lake time travel | Data versioning tools |
| Model registry, stage/alias, lineage | Model catalogue / production tag / provenance |
| Pipeline, orchestrator, DAG | Automated steps / scheduler / dependency graph |
| Airflow, Prefect, Dagster, Kubeflow Pipelines, ZenML, Metaflow | Orchestrators |
| Data validation, Great Expectations, Pandera | Checking data quality automatically |
| Spark, Dask, Ray, cuDF | Large-scale data processing |
| Feature store, offline/online store, point-in-time correctness, Feast | Consistent feature management |
| CI, CD, Continuous Training (CT) | Automated testing / deployment / retraining |
| Unit, data, behavioural, integration, performance tests, quality gates | ML test types |
| pytest, GitHub Actions | Testing / CI tools |
| Batch, online, streaming, edge deployment | Ways to serve predictions |
| Kafka, Kinesis | Event streaming platforms |
| Shadow, canary, blue-green deployment, rollback | Safe release strategies |
| Multi-armed bandit | Adaptive traffic allocation |
| System, data, model monitoring | Monitoring layers |
| Ground truth delay | Labels arriving late |
| Prometheus, Grafana, Evidently, Arize, WhyLabs | Monitoring tools |
| Alert, runbook, on-call | Incident handling |
| Model decay / staleness | Performance dropping over time |
| Data drift (covariate shift), concept drift, label drift | Kinds of change |
| Sudden, gradual, seasonal drift | Drift speeds/patterns |
| Feedback loop | Model decisions shaping future data |
| PSI, KS test, Jensen-Shannon, Wasserstein | Drift measures |
| Embedding drift | Shift in text/image embedding distributions |
| Scheduled, triggered, online retraining; sliding window | Retraining strategies |
| LLMOps | MLOps for LLM applications |
| Prompt registry, model version pinning | Versioning prompts / fixing model versions |
| LLM gateway / router, LiteLLM | Central layer for LLM calls |
| Kill switch | Emergency off for a feature |
| MLOps maturity levels | Manual → automated pipelines → full CI/CD |

**Next:** [29-responsible-ai.md](29-responsible-ai.md)
