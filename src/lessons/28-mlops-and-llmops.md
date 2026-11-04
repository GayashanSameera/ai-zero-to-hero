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

**Why it exists:** training a good model in a notebook is the easy part. Keeping it running for real customers, month after month, while the world changes around it, is what breaks most projects. MLOps is the set of habits that stops that.

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

### Worked example: where the effort really goes

Imagine a Colombo bank builds a loan-default model. Rough share of the team's time over a year (illustrative, typical of what practitioners report):

| Activity | Share of effort |
|---|---|
| Getting and cleaning data, building pipelines | 35% |
| Serving, packaging, infrastructure | 20% |
| Monitoring, alerts, retraining | 20% |
| Testing, documentation, compliance | 15% |
| Writing the model code itself | 10% |

The model code is the smallest slice. That is the whole message of the box diagram above.

### Where you'll meet it in real work

A telecom (Dialog, Mobitel or SLT style) runs a churn model that scores millions of SIMs. Someone has to make sure the score is refreshed, the API stays up, and the model is retrained when customers change behaviour. That "someone" does MLOps.

### Common mistakes

- Treating deployment as the finish line. It is the starting line of operations.
- Thinking MLOps means "buy one tool". It is a set of practices; tools come second.
- Skipping monitoring because "the model was 92% accurate in the notebook".

**Exam angle:** NCA-GENL-style questions ask you to match a problem (silent degradation, "works on my machine", unknown model lineage) to the MLOps practice that fixes it (monitoring, containers, a registry).

> **සිංහලෙන්:** MLOps කියන්නේ model එකක් හදලා නවත්තන එක නෙවෙයි, ඒක production එකේ දිගටම හරියට වැඩ කරවන එක. Restaurant එකක recipe එක හොඳ වුණාට, හැමදාම බඩු ගේන එක, කෑම හදන එක, පාරිභෝගිකයෝ සේවය කරන එක නැතුව restaurant එක දුවන්නේ නෑ නේ. Model code එක මුළු වැඩේ ඉතා කුඩා කොටසක් විතරයි, ඉතිරි ඔක්කොම data pipelines, serving, monitoring වගේ දේවල්. ඒ නිසා Dialog වගේ සමාගමක churn model එකක් ඇත්තටම පාවිච්චි කරනවා නම්, ඔයාට ඕනේ model එක විතරක් නෙවෙයි, ඒක බලාගන්න පද්ධතියත් ඕනේ.

---

## 2. The ML lifecycle

**Why it exists:** a model is trained on yesterday's data but used on tomorrow's customers. The lifecycle is drawn as a loop so that nobody forgets the "retrain" arrow at the end.

```
   ┌─────────► Data ingestion & validation ──► Feature engineering ──► Training ──┐
   │                                                                              ▼
Retrain ◄── Monitoring (drift, performance) ◄── Deployment ◄── Model registry ◄── Evaluation
```

It's a **loop** (like CRISP-DM, [file 10](10-data-science-workflow.md#1-the-workflow-crisp-dm)): the world changes, models degrade, and you retrain.

**Key principle: reproducibility.** Anyone (including you in six months) should be able to recreate any model exactly: same code (Git), same data (data versioning), same environment (Docker/requirements), same hyperparameters and seeds (experiment tracking).

### Worked example: why reproducibility matters

In March your churn model has AUC 0.86. In September someone retrains and gets 0.81. Is the new model worse, or is the data different, or the library version, or the random seed? If you recorded these four things for the March run, you can rerun it exactly and compare fairly:

| Thing to pin | How |
|---|---|
| Code | Git commit hash, for example `a3f9c21` |
| Data | DVC or table version, for example `train_v7` |
| Environment | `requirements.txt` with pinned versions, Docker image tag |
| Randomness | `random_state=42`, framework seeds |

If any one of the four is missing, you can only say "something changed".

### Text picture: the loop in time

```
Week 0:  train v1 -> deploy
Week 6:  monitoring shows drift -> retrain v2 -> shadow test -> deploy
Week 14: concept drift alert -> retrain v3 -> canary -> deploy
```

### Where you'll meet it in real work

An auditor at a bank asks "which data and code produced the model that rejected this customer in May?" With a full lifecycle record you answer in minutes. Without it you cannot answer at all.

### Common mistakes

- Drawing the lifecycle as a straight line and never building the retrain path.
- Retraining without recording what changed.

**Exam angle:** know the stages (ingest, validate, features, train, evaluate, register, deploy, monitor, retrain) and that reproducibility needs code, data, environment and seeds.

> **සිංහලෙන්:** ML lifecycle එක කියන්නේ කවදාවත් අවසන් නොවෙන රවුමක්. Data ගන්නවා, train කරනවා, deploy කරනවා, monitor කරනවා, ඊට පස්සේ ලෝකය වෙනස් වුණාම ආයෙත් retrain කරනවා. Reproducibility කියන්නේ මාස හයකට පස්සේ වුණත් ඒ model එකම හරියටම හදන්න පුළුවන් වීම. ඒකට code එකේ Git commit එක, data version එක, library versions සහ random seed එක හතරම ලියලා තියාගන්න ඕනේ. එක එකක් වැරදුණොත් "මොකක්දෝ වෙනස් වුණා" කියලා විතරයි කියන්න පුළුවන්.

---

## 3. Serialisation

**Why it exists:** a trained model lives only in the memory of your running program. To use it on another machine, tomorrow, you must write it to a file and read it back.

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

### Worked example: how big is the file?

A model file is mostly its weights. Size = number of parameters × bytes per parameter.

- A 7-billion-parameter LLM stored in 16-bit (2 bytes each): 7,000,000,000 × 2 = 14,000,000,000 bytes = **14 GB**
- The same model quantised to 4-bit (0.5 byte each): 7,000,000,000 × 0.5 = 3,500,000,000 bytes = **3.5 GB**
- A small churn model with 10 million parameters in 32-bit (4 bytes): 10,000,000 × 4 = 40 MB

This is why format choice and quantisation matter for download time and for fitting on a GPU ([file 27](27-inference-and-serving.md)).

### Where you'll meet it in real work

You download a model from Hugging Face. The repository holds `model.safetensors` files. That format was designed so that opening the file cannot run code, unlike a pickle.

### Common mistakes

- Loading a `.pkl` or `.pt` file from a random website. Loading it can execute code.
- Saving only the model and forgetting the preprocessing steps.
- Not recording the scikit-learn or PyTorch version: a file saved with one version may fail on another.

**Exam angle:** typical questions ask which format is safe (safetensors), which is portable across frameworks (ONNX), and which is for local LLMs (GGUF).

> **සිංහලෙන්:** Serialisation කියන්නේ memory එකේ තියෙන trained model එක file එකකට save කරන එක, ඒක වෙන තැනක load කරන්න. Pickle file එකක් load කරද්දී ඒක ඇතුළේ හංගපු code එකත් run වෙන්න පුළුවන්, ඒ නිසා නොදන්න තැනකින් ආපු .pkl file එකක් කවදාවත් load කරන්න එපා. Weights වලට safetensors පාවිච්චි කරන එක ආරක්ෂිතයි. Parameters බිලියන 7ක model එකක් 16-bit වලින් බයිට් 2ක් බැගින් ගත්තොත් 14 GB ක් වෙනවා. ඒ නිසා file format එකයි quantisation එකයි download කාලයටත් GPU එකේ ඉඩටත් බලපානවා.

---

## 4. FastAPI

**Why it exists:** other programs (a website, a mobile app) cannot call your Python function directly. An API gives them a simple web address to send data to and get a prediction back.

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

### Worked example: how many requests per second?

Suppose one `/predict` call takes 50 ms (0.05 s) of work on one worker.

- One worker handles 1 / 0.05 = **20 requests per second**
- With `--workers 2`: 2 × 20 = **40 requests per second**
- If peak traffic is 100 requests per second, you need at least 100 / 20 = **5 workers** (more for safety)

That is the first step of capacity planning ([file 27](27-inference-and-serving.md#15-cost-and-capacity)).

### Text picture: one request

```
Client ──JSON──► uvicorn ──► FastAPI validates (Pydantic) ──► model.predict_proba
   ▲                                                                │
   └────────────── JSON {churn_probability, will_churn} ◄───────────┘
```

### Where you'll meet it in real work

A bank's mobile app calls a fraud-scoring API during every card payment. The API must answer within a few hundred milliseconds or the payment feels slow.

### Common mistakes

- Loading the model inside the `predict` function, so every request pays the loading cost.
- No `/health` endpoint, so Kubernetes cannot tell if the service is alive.
- Returning raw Python exceptions to users instead of clean error codes.

**Exam angle:** know that FastAPI uses Pydantic for validation (HTTP 422 for bad input) and that you load the model once at startup.

> **සිංහලෙන්:** API එකක් කියන්නේ ඔයාගේ model එකට අනිත් programs කතා කරන්න දෙන web address එකක්. FastAPI එකෙන් JSON එකක් අරගෙන model එකෙන් prediction එකක් දෙන්න පුළුවන්. Request එකකට 50 ms යනවා නම් එක worker කෙනෙකුට තත්පරයට requests 20ක් දරන්න පුළුවන්, workers දෙන්නෙක් ඉන්නකොට 40ක්. Model එක load කරන්නේ server එක start වෙද්දී එක පාරයි, හැම request එකටම නෙවෙයි. Input එක වැරදි නම් Pydantic එක නිකම්ම 422 error එකක් දෙනවා.

---

## 5. Streamlit and Gradio

**Why it exists:** a model that only data scientists can run in a terminal convinces nobody. A quick UI lets managers and users try it and give feedback in days, not months.

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

### Streamlit or Gradio?

| | Streamlit | Gradio |
|---|---|---|
| Best for | Dashboards and data apps | ML model and chatbot demos |
| Style | Script re-runs top to bottom on each interaction | Function in, function out |
| Easy sharing | Streamlit Community Cloud | Hugging Face Spaces, temporary public link |

### Where you'll meet it in real work

A data scientist at a hospital builds a Gradio page where a doctor uploads a chest X-ray and sees the model's guess, so the doctor can say "this is useful" or "this is wrong" before any serious engineering starts.

### Common mistakes

- Shipping the demo as the production system. Demos have no authentication, scaling or monitoring.
- Putting API keys directly in the demo code that you publish.

> **සිංහලෙන්:** Streamlit සහ Gradio කියන්නේ Python විතරෙන් විනාඩි කීපයකින් web UI එකක් හදන්න පුළුවන් tools. Manager කෙනෙකුට terminal එකේ model run කරලා පෙන්නලා වැඩක් නෑ, button එකක් එබුවාම උත්තරේ එන page එකක් පෙන්නුවාම ඉක්මනින් feedback ලැබෙනවා. Gradio එක chatbot demos වලට හොඳයි, Streamlit එක dashboards වලට. හැබැයි demo එකක් production system එකක් විදිහට දාන්න එපා, මොකද ඒකේ login, scaling, monitoring නෑ.

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

### Worked example: layer caching saves time

Suppose installing dependencies takes 4 minutes and copying code takes 2 seconds.

- **Bad order** (copy code first, then install): every small code edit invalidates the cache, so each build costs about 4 minutes.
- **Good order** (copy `requirements.txt`, install, then copy code): after the first build, an edit rebuilds only the last layer, about **2 seconds**.

Ten edits in an afternoon: 40 minutes against well under a minute.

### Text picture: Image, container, registry

```
Dockerfile ──build──► Image ──push──► Registry (Docker Hub / ECR / NGC)
                        │
                        └─run──► Container A, Container B, Container C
```

### Where you'll meet it in real work

The data scientist hands the platform team a Docker image. It runs the same on a laptop, on a company server and in the cloud, so "it works on my machine" stops being an excuse.

### Common mistakes

- Using the `latest` tag in production, so builds change without warning. Pin versions.
- Copying huge datasets or secrets into the image.
- Running everything as root inside the container.

**Exam angle:** know image versus container, and that GPU containers need the NVIDIA Container Toolkit and NGC base images.

> **සිංහලෙන්:** Docker කියන්නේ ඔයාගේ app එකයි ඒකට ඕනේ හැම දේමයි (Python version, libraries, model file) එක container එකකට දාන එක. Shipping container එකක් වගේ, ඇතුළේ මොකක් තිබුණත් ඕනෑම නැවකට ලොරියකට එකම විදිහට හසුරුවන්න පුළුවන්. Image එක කියන්නේ blueprint එක, container එක ඒකෙන් run වෙන ජීවමාන එක. Dockerfile එකේ ඔයා dependencies කලින් දාලා code පස්සේ දැම්මොත්, code එක පොඩ්ඩක් වෙනස් කරද්දී විනාඩි 4ක install එක ආයෙත් කරන්න ඕනේ නෑ.

---

## 7. Kubernetes

**Why it exists:** one container on one machine is easy. Fifty containers on twenty machines, some of which crash at 3 a.m., need software that keeps everything running without a human.

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

### Worked example: how the HPA decides

The HPA uses this rule: desired replicas = ceil( current replicas × current metric ÷ target metric ).

- Now: 4 pods, average CPU 90%, target 60%
- 4 × 90 / 60 = 4 × 1.5 = 6 → **6 pods**
- Later: 6 pods, CPU 20%, target 60%: 6 × 20 / 60 = 2 → **2 pods**

So load goes up, pods go up; load drops, pods come down and you stop paying for idle machines.

### Text picture

```
Cluster
 ├─ Node 1 (GPU)  ── Pod: churn-api ── Pod: churn-api
 ├─ Node 2 (GPU)  ── Pod: churn-api
 └─ Node 3        ── Pod: postgres
            ▲
 Service (one stable address, spreads requests over pods)
            ▲
 Ingress (the public door: https://api.company.lk)
```

### Where you'll meet it in real work

During a Poya-day sale, a Daraz-like shop's recommender gets five times normal traffic. Kubernetes adds pods automatically, then removes them at night.

### Common mistakes

- Setting no resource limits, so one pod uses all the memory of a node.
- No readiness probe, so traffic reaches a pod that is still loading the model.

**Exam angle:** match Pod, Deployment, Service, Ingress and HPA to their jobs. GPU requests use `nvidia.com/gpu`.

> **සිංහලෙන්:** Containers ගොඩක් machines ගොඩක් උඩ දුවනකොට ඒවා අතින් බලාගන්න බෑ, ඒකට Kubernetes කියන orchestrator එක තියෙනවා. ඔයා YAML එකේ "මේ app එකේ replicas 3ක් ඕනේ" කියලා ලියනවා, Kubernetes එක ඒක හැමවෙලේම ඒ විදිහට තියාගන්නවා, pod එකක් කැඩුණොත් අලුත් එකක් හදනවා. HPA එක load එක වැඩි වුණාම pods 4ක් 6ක් කරනවා, අඩු වුණාම ආපහු අඩු කරනවා. ඒ නිසා පෝය දවසේ sale එකකදී traffic වැඩි වුණත් පද්ධතිය නැවතෙන්නේ නෑ.

---

## 8. Cloud ML platforms

**Why it exists:** building GPUs, clusters and pipelines yourself takes months. Cloud platforms rent them to you, ready to use, so a small team can start in a day.

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

### How to choose

| Situation | Sensible choice |
|---|---|
| Company already uses AWS everywhere | SageMaker for your own models, Bedrock for hosted foundation models |
| Company is on Google Cloud / BigQuery | Vertex AI |
| Company is a Microsoft shop (Office 365, Azure AD) | Azure ML / Azure AI Foundry |
| Heavy Spark and data engineering | Databricks |
| Need NVIDIA-optimised LLM serving | NVIDIA NIM containers on any cloud |
| Just want to try open models | Hugging Face Hub and Spaces |

### Managed API versus self-hosting

- **Managed API (Bedrock, Azure OpenAI, Vertex):** no GPUs to manage, pay per token, quick start, but your data goes to the provider's service and you depend on them.
- **Self-hosting (vLLM or NIM on your GPUs):** full control and privacy, lower cost at very high volume, but you run the infrastructure.

### Common mistakes

- Choosing a platform for its brand rather than for where your data already lives (moving data between clouds costs money and time).
- Ignoring vendor lock-in until the bill arrives.

**Exam angle:** know the main platforms, that Bedrock offers foundation models as a service, and that NVIDIA NIM packages optimised inference microservices.

> **සිංහලෙන්:** SageMaker, Vertex AI, Azure ML වගේ cloud platforms වලින් GPUs, notebooks, deployment ඔක්කොම කුලියට ගන්න පුළුවන්, ඒ නිසා පොඩි team එකකටත් දවසකින් පටන් ගන්න පුළුවන්. Bedrock වගේ එකකින් Claude, Llama වගේ models API එකෙන් පාවිච්චි කරනවා, ඔයාට GPU බලාගන්න ඕනේ නෑ. හැබැයි ඒකෙන් ගාස්තු වැඩියි, එක vendor කෙනෙක්ට බැඳෙන්නත් පුළුවන්. ඔයාගේ company එකේ data දැනටමත් තියෙන cloud එකම තෝරගන්න එක සාමාන්‍යයෙන් වඩා සුදුසුයි.

---

## 9. Experiment tracking

**Why it exists:** after 100 training runs, nobody remembers which learning rate gave the best result. A tracker writes it all down automatically.

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

### Worked example: choosing the best run

| Run | learning_rate | num_leaves | val_auc |
|---|---|---|---|
| lgbm_v1 | 0.10 | 15 | 0.842 |
| lgbm_v2 | 0.05 | 31 | 0.861 |
| lgbm_v3 | 0.05 | 63 | 0.858 |

Best by validation AUC: **lgbm_v2** (0.861). The tracker also stores its Git commit, its data version and its model file, so you can rebuild or deploy exactly that run. Without a tracker this table lives in someone's memory.

Note: pick using the **validation** set. Report the final number on the untouched **test** set, otherwise your estimate is optimistic ([file 13](13-evaluation-metrics-and-tuning.md)).

### Where you'll meet it in real work

A team fine-tuning an LLM watches live loss curves in Weights & Biases. When the loss spikes, they stop the run early instead of wasting a day of GPU time.

### Common mistakes

- Logging metrics but not the data version, so the result cannot be reproduced.
- Comparing runs that used different validation sets.

**Exam angle:** know what to log (params, metrics, artefacts, code and data versions) and that MLflow and W&B are the usual tools.

> **සිංහලෙන්:** Experiment tracking කියන්නේ හැම training run එකකම learning rate, metrics, code version, model file වගේ දේවල් ස්වයංක්‍රීයව ලියලා තියන එක. Runs 100ක් කළාම "හොඳම එක මොන learning rate එකෙන්ද?" කියලා මතක තියාගන්න බෑ නේ. MLflow හෝ Weights & Biases වගේ tool එකකින් val_auc 0.861 හම්බවුණ run එක ඒ parameters එක්කම ආපහු හොයාගන්න පුළුවන්. හැබැයි හොඳම run එක තෝරන්නේ validation set එකෙන්, අවසාන ප්‍රතිඵලය කියන්නේ test set එකෙන්.

---

## 10. Versioning and registry

**Why it exists:** a model is a product of code, data and training. Git tracks code well but not 20 GB datasets, and a folder called `final_v2_REAL.pkl` is not a version system.

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

### Worked example: rollback in one step

```
Registry:   churn-model
  v1  archived
  v2  production   <-- serving 100% of traffic
  v3  staging      <-- candidate
```

1. v3 passes tests, so you move the `production` alias to v3.
2. An hour later error rates rise. You move the alias back to v2.
3. Total rollback time: seconds, because nothing was rebuilt.

### Where you'll meet it in real work

A bank must show regulators which model version made a decision on a given date. The registry's lineage (code commit, data version, approver, date) is the evidence.

### Common mistakes

- Overwriting the production model file in place, with no previous version to return to.
- Versioning the model but not the data it was trained on.

**Exam angle:** DVC versions data (pointer files in Git), a registry versions models with stages and lineage.

> **සිංහලෙන්:** Git එකට පොඩි code files හොඳට හසුරුවන්න පුළුවන්, ඒත් GB 20ක data files බෑ. ඒකට DVC වගේ tool එකකින් ලොකු files cloud එකේ තියලා Git එකේ පොඩි pointer file එකක් විතරක් තියනවා. Model registry එක කියන්නේ models v1, v2, v3 විදිහට, staging, production වගේ tags එක්ක තියන catalogue එකක්. අලුත් model එකේ වැරැද්දක් ආවොත් production tag එක කලින් version එකට ආපහු දැම්මම තත්පර කීපයකින් rollback වෙනවා.

---

## 11. Pipelines and orchestration

**Why it exists:** a notebook that someone runs by hand every Monday will eventually be forgotten, run in the wrong order, or run by the wrong person. A pipeline runs the same steps, in the same order, every time.

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

### Text picture: a DAG

```
extract ──► validate ──► features ──► train ──► evaluate ──► register
                │                                   │
                └── fail? stop and alert            └── worse than production? do not register
```

"Directed" means each arrow has a direction. "Acyclic" means you can never follow arrows and come back to the start, so the order is always clear.

### Worked example: a validation gate

Last week the `age` column had a maximum of 87 and 0.2% missing values. Today's file has a maximum of 1,987 and 14% missing. The Pandera or Great Expectations check "age between 0 and 120, missing under 2%" fails, the pipeline stops, and an alert goes out. No model is trained on broken data.

### Where you'll meet it in real work

A retail chain's Airflow job pulls yesterday's sales at 2 a.m., validates them, rebuilds features and refreshes demand forecasts before the stores open.

### Common mistakes

- Skipping validation because "the data was fine last time".
- Pipelines that are not idempotent (running twice gives a different or duplicated result).

**Exam angle:** an orchestrator schedules a DAG of steps and handles retries; data validation happens before training.

> **සිංහලෙන්:** Production එකේ ML වැඩ notebook එකක අතින් run කරන්නේ නෑ, automated pipeline එකක් විදිහට run කරනවා. Pipeline එක කියන්නේ data ගන්න, validate කරන, features හදන, train කරන, evaluate කරන පියවර පිළිවෙලට දුවන DAG එකක්. Airflow වගේ orchestrator එකක් මේවා schedule කරනවා, fail වුණොත් retry කරනවා. උදාහරණයක් විදිහට age එකේ max එක 87 ඉඳන් 1,987 වුණොත් validation එක fail වෙලා pipeline එක නතර වෙනවා, නරක data වලින් model එක හදන්නේ නෑ.

---

## 12. Feature stores

**Why it exists:** if training code and production code each compute a feature their own way, the model sees different numbers in production than it learned from, and nobody gets an error message.

### Training-serving skew

**Training-serving skew** = features computed differently in training vs in production. Example: in training, `avg_spend_30d` was computed in SQL from a clean warehouse; in production, an engineer re-implemented it in Java with a subtle difference (e.g. including today's purchases). The model receives different inputs than it learned from and performs worse, **silently**.

### Feature stores

A **feature store** is a central system to define, compute, store and serve features consistently:
- **One definition** of each feature, used for both training and serving
- **Offline store:** historical feature values for training (with **point-in-time correctness**: values as they were **at the time** of each training example, to avoid leakage, [file 10](10-data-science-workflow.md#13-data-leakage-preview))
- **Online store:** low-latency latest values for real-time predictions (e.g. Redis)
- Feature reuse across teams and models

Tools: **Feast** (open source), Tecton, Databricks/SageMaker/Vertex feature stores.

### Worked example: skew in numbers

Feature: average daily spend in the last 30 days.

- Training (SQL, clean history): total Rs. 90,000 over 30 days, so 90,000 / 30 = **Rs. 3,000**
- Production (re-implemented in code that also counts today's Rs. 12,000 purchase over 31 days): (90,000 + 12,000) / 31 = **Rs. 3,290**

A difference of Rs. 290 for the same customer. Multiply by thousands of customers and the model's score distribution shifts, with no crash and no error.

### Text picture

```
            ┌──────── one feature definition ────────┐
            ▼                                        ▼
   Offline store (history)                  Online store (latest, e.g. Redis)
   used for TRAINING                        used for SERVING (milliseconds)
```

### Where you'll meet it in real work

A bank's fraud, credit and marketing teams all need "transactions in the last 7 days". A feature store means they compute it once and reuse it.

### Common mistakes

- Using today's information when building a training row for last month (leakage). Point-in-time correctness prevents this.
- Building a feature store for a single small model. It pays off with many models and teams.

**Exam angle:** define training-serving skew and explain that a feature store gives one definition for offline and online use.

> **සිංහලෙන්:** Training වලදී feature එකක් එක විදිහට ගණනය කරලා, production එකේ වෙන code එකකින් ටිකක් වෙනස් විදිහට ගණනය කළොත් model එකට ලැබෙන data වෙනස් වෙනවා, ඒත් error එකක් එන්නේ නෑ. උදාහරණයක්: දවසකට සාමාන්‍ය වියදම training එකේදී රු. 3,000, production එකේදී අද දවසත් ගත්තම රු. 3,290. Feature store එකෙන් feature එකකට definition එකක් විතරයි, training සහ serving දෙකටම එකම අගය දෙනවා. එතකොට මේ නිහඬ වැරැද්ද නවතිනවා.

---

## 13. CI/CD for ML

**Why it exists:** in ordinary software a bug often crashes the program. In ML a bad change can still run perfectly while the predictions quietly get worse, so you need tests that check quality, not only that the code runs.

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

### Worked example: a quality gate

Rules the pipeline enforces before a new model may be deployed:

1. Validation AUC must be at least 0.80 (absolute floor).
2. Validation AUC must be at least the production model's AUC minus 0.005.
3. No customer segment may lose more than 3 points of recall.

| | Production | Candidate |
|---|---|---|
| AUC | 0.861 | 0.866 |
| Recall, Colombo | 0.74 | 0.75 |
| Recall, Jaffna | 0.70 | 0.65 |

Rules 1 and 2 pass. Rule 3 fails: Jaffna dropped 5 points. The candidate is **blocked** even though overall AUC went up. This is why slice checks matter.

### Where you'll meet it in real work

For an LLM app, the same idea: a prompt change triggers the golden test set in CI. If answer quality drops, the merge is blocked ([file 26](26-evaluating-llms.md#17-eval-pipeline)).

### Common mistakes

- Testing only the code and not the data or model quality.
- Setting the gate so loose that nothing is ever blocked, or so tight that nothing is ever shipped.

**Exam angle:** CI = automatic testing of every change, CD = automatic delivery, CT = automatic retraining; ML adds data and model-quality tests.

> **සිංහලෙන්:** සාමාන්‍ය software එකක bug එකක් ආවොත් program එක කැඩෙනවා, ඒත් ML එකේ code එක හරියට run වෙවී predictions නරක් වෙන්න පුළුවන්. ඒකයි CI/CD එකේදී code tests වගේම data tests සහ model quality gates දාන්නේ. උදාහරණයක්: අලුත් model එකේ AUC එක 0.861 ඉඳන් 0.866 වුණත්, යාපනයේ customers ලාගේ recall එක 0.70 ඉඳන් 0.65 වුණොත් gate එක ඒක නවත්තනවා. CI කියන්නේ හැම වෙනසක්ම ස්වයංක්‍රීයව test කිරීම, CD කියන්නේ ස්වයංක්‍රීයව deploy කිරීම.

---

## 14. Deployment patterns

**Why it exists:** not every prediction has to be instant. Picking the right pattern can cut cost and complexity by a large factor.

| Pattern | How | Example | Latency need |
|---|---|---|---|
| **Batch (offline) prediction** | Score all records on a schedule; save results to a table | Nightly churn scores for all customers; weekly demand forecasts | Hours OK |
| **Online (real-time) prediction** | API responds per request | Fraud check during payment; product recommendations on page load | Milliseconds to seconds |
| **Streaming** | Score events as they flow through a stream (Kafka, Kinesis) | Real-time anomaly detection on sensor data | Seconds |
| **Edge / on-device** | Model runs on phones, cameras, IoT devices | Face unlock; offline crop-disease detection app | Instant; offline |
| **Embedded in a database/BI tool** | SQL calling a model | Analysts scoring in the warehouse | Varies |

**Start with batch** if the business allows it: it's simpler, cheaper and easier to monitor.

### Worked example: batch or online?

A telecom wants churn scores for 2,00,000 (two lakh) customers.

- **Batch:** run once each night. One job scores all 200,000 rows, saves them to a table, and the call-centre team reads the table in the morning. One cheap job, easy to monitor.
- **Online:** a call-centre agent opens a customer and the app calls the API. Needed only if the score must reflect what happened five minutes ago.

If the answer to "does the score need to be fresher than a day?" is no, choose batch.

### Quick chooser

| Question | If yes |
|---|---|
| Result needed within milliseconds, per user action? | Online |
| Events arrive continuously and need action in seconds? | Streaming |
| No reliable internet, or privacy requires data to stay on the device? | Edge |
| Result only needed daily or weekly? | Batch |

### Common mistakes

- Building a real-time system when a nightly job would satisfy the business.
- Forgetting that edge models must be small (quantised, pruned).

**Exam angle:** match the scenario (fraud at payment time, nightly scores, phone face unlock) to the pattern.

> **සිංහලෙන්:** හැම prediction එකක්ම ක්ෂණිකව ඕනේ නෑ. Telecom එකකට customers ලක්ෂ 2ක් ගැන churn scores දවසකට එක පාරක් රාත්‍රියේ එක job එකකින් හදලා table එකකට දාන්න පුළුවන්, ඒක batch. Payment එකක් කරද්දී fraud check කරන්න නම් online API එකක් ඕනේ. Phone එකේ face unlock වගේ internet නැතිවත් වැඩ කරන්න ඕනේ දේවල් edge. බිස්නස් එකට දවසකට එක පාරක් ඇති නම් batch තෝරගන්න, ඒක ලාභයි, සරලයි.

---

## 15. Safe rollouts

**Why it exists:** a model that looked great in testing can still misbehave on real traffic. Rolling out gradually limits the damage to a few users and lets you retreat quickly.

Never switch 100% of traffic to a new model at once.

| Strategy | How |
|---|---|
| **Shadow deployment** | New model receives copies of real requests and makes predictions, but **its outputs aren't used**. Compare with the current model safely. |
| **Canary release** | Send a small % of traffic (e.g. 5%) to the new model; watch metrics; gradually increase |
| **Blue-green deployment** | Two identical environments; switch traffic from blue (old) to green (new) at once, and switch back instantly if problems appear |
| **A/B test** | Randomly split users between models and measure **business** impact with statistics ([file 07](07-math-probability-statistics.md#20-ab-testing)) |
| **Multi-armed bandits** | Adaptively send more traffic to the better-performing variant during the test |

**Always have a rollback plan:** keep the previous model version ready in the registry (section 10).

### Worked example: a canary

You send 5% of 10,000 hourly requests to the new model.

- 5% of 10,000 = **500 requests** to the new model, 9,500 to the old one.
- Old model: 95 errors out of 9,500 = **1.0%** error rate.
- New model: 20 errors out of 500 = **4.0%** error rate.

4% is four times worse. You stop the canary. Only 500 requests were affected instead of 10,000.

### Text picture

```
Shadow:      users ─► old model ─► answer
                  └─► new model ─► logged only (nobody sees it)

Canary:      users ─┬─95%─► old model
                    └─ 5%─► new model

Blue-green:  [blue = old]  <-- router -->  [green = new]   (flip the switch, flip back if bad)
```

### Where you'll meet it in real work

An e-commerce site tests a new recommendation model with an A/B test and compares revenue per visitor, not just model accuracy.

### Common mistakes

- Running an A/B test for too short a time or with too few users to be meaningful.
- Judging the new model only on accuracy when the business cares about money.
- Having no rollback plan.

**Exam angle:** shadow = outputs unused; canary = small real share; blue-green = instant switch; A/B = statistical comparison of business impact.

> **සිංහලෙන්:** අලුත් model එක එකපාරටම 100% traffic එකට දෙන්න එපා. Canary release එකේදී ඉල්ලීම් 10,000න් 5%ක්, එනම් 500ක් විතරක් අලුත් model එකට යවනවා. පරණ එකේ error rate එක 1%ක්, අලුත් එකේ 4%ක් නම් ඒක නවත්තලා අලුත් එක වැරදියි කියලා දැනගන්නවා, හානිය 500කට විතරයි. Shadow deployment එකේදී අලුත් model එකත් එකම requests වලට උත්තර හදනවා, ඒත් user ට පෙන්නන්නේ නෑ. කොහොමත් rollback plan එකක් තියාගන්න.

---

## 16. Monitoring

**Why it exists:** a deployed model fails silently. The API still returns a number, so without monitoring you learn about problems from angry customers.

Once deployed, things go wrong in three layers:

| Layer | What to watch | Examples |
|---|---|---|
| **System / operational** | Is the service healthy? | Latency (p50/p95/p99), throughput, error rates (HTTP 5xx), CPU/GPU/memory use, uptime |
| **Data** | Are inputs as expected? | Missing values, schema changes, out-of-range values, **feature distribution drift** |
| **Model / business** | Are predictions still good? | Prediction distribution, accuracy/precision/recall **when labels arrive**, business KPIs (conversion, fraud losses) |

**The ground truth delay problem:** you often don't know if a prediction was right until much later (did the customer churn? It takes 30 days to find out; was the loan repaid? Months). So monitor **proxies** meanwhile: input drift, prediction drift, user feedback.

**Tools:** Prometheus + Grafana (system metrics, dashboards), cloud monitoring, Evidently AI / WhyLabs / Arize / Fiddler (data and model drift), logging stacks (ELK, OpenTelemetry, [file 24](24-ai-agents.md#14-evaluating-agents)).

**Alerts:** define thresholds that trigger alerts (e.g. error rate > 1%, p95 latency > 800 ms, a key feature's drift score above a limit), routed to an on-call person with a **runbook** (what to check and do).

### Worked example: reading latency percentiles

Ten requests take (in ms): 40, 42, 45, 47, 50, 52, 55, 60, 90, 1200.

- Average = (40+42+45+47+50+52+55+60+90+1200) / 10 = 1,681 / 10 = **168 ms**
- Median (p50) = middle of the sorted list = (50 + 52) / 2 = **51 ms**
- p90 = about the 9th value = **90 ms**; the slowest request is 1,200 ms

The average (168 ms) hides the fact that most users wait about 50 ms and one waits over a second. This is why teams alert on p95 and p99, not the average.

Error rate example: 30 HTTP 5xx errors out of 4,000 requests = 30 / 4,000 = 0.75%. With an alert at 1%, no alert yet; at 1.2% the on-call person is paged.

### Where you'll meet it in real work

A bank dashboard in Grafana shows API latency, error rate, the share of customers with a missing `income` field, and the average predicted fraud score. A sudden jump in missing `income` points to a broken upstream feed, long before any labels arrive.

### Common mistakes

- Monitoring only servers (CPU, memory) and not data or predictions.
- Alerts with no runbook, so the person paged does not know what to do.
- Too many noisy alerts, which people learn to ignore.

**Exam angle:** know the three layers (system, data, model/business) and the ground-truth delay problem.

> **සිංහලෙන්:** Deploy කරපු model එක නිහඬව නරක් වෙන්න පුළුවන්, API එක තාම අංකයක් දෙනවා නේ. ඒ නිසා monitoring ස්ථර තුනක් ඕනේ: system (latency, errors), data (missing values, drift), model (predictions සහ business results). Requests දහයක් ms 40 ඉඳන් 1200 දක්වා ගියොත් සාමාන්‍යය 168 ms, ඒත් median එක 51 ms. ඒ නිසා average එක වෙනුවට p95, p99 වලට alert දාන්නේ. Labels ලැබෙන්න දවස් 30ක් යනවා නම්, ඒ අතරේ input සහ prediction distribution බලන්න.

---

## 17. Drift

**Why it exists:** a model is a snapshot of the past. When customers, prices, fraudsters or language change, the snapshot goes out of date, so you need ways to notice.

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

### Second worked PSI example (3 bins)

Customer age groups: expected (training) [20%, 50%, 30%], actual (this month) [10%, 40%, 50%].

| Bin | Expected | Actual | (A − E) | ln(A/E) | (A − E) × ln(A/E) |
|---|---|---|---|---|---|
| Young | 0.20 | 0.10 | −0.10 | ln(0.5) = −0.693 | 0.069 |
| Middle | 0.50 | 0.40 | −0.10 | ln(0.8) = −0.223 | 0.022 |
| Older | 0.30 | 0.50 | +0.20 | ln(1.667) = 0.511 | 0.102 |
| **PSI** | | | | | **0.194** |

0.194 lies between 0.1 and 0.25, so this is a **moderate shift**: investigate, check performance, but do not panic.

### Data drift or concept drift? A quick test

| What changed? | Type |
|---|---|
| The mix of customers (more students) but the rule "late payer = risky" still holds | Data drift |
| Same customers, but late payment now means something different because of a new policy | Concept drift |
| The share of fraud cases moves from 1% to 3% | Label (prior) drift |
| A column's unit changes from cm to m | Upstream data change |

### Where you'll meet it in real work

During a crisis such as a fuel shortage or a sudden rule change, shopping and travel patterns change within weeks. Demand forecasters trained earlier become wrong until retrained. That is concept and data drift together.

### Common mistakes

- Waiting for accuracy to drop before checking, when labels arrive weeks late.
- Treating every statistically significant difference as important when the sample is huge.

**Exam angle:** definitions of data drift (P(X) changes) and concept drift (P(y|X) changes), and PSI thresholds 0.1 and 0.25.

> **සිංහලෙන්:** Model එකක් කියන්නේ අතීතයේ ඡායාරූපයක් වගේ, ලෝකය වෙනස් වුණාම ඒක පරණ වෙනවා. Data drift කියන්නේ inputs වල විස්තරය වෙනස් වීම, උදාහරණයක් විදිහට bank එකට තරුණ customers වැඩිවීම. Concept drift කියන්නේ inputs සහ උත්තරය අතර සම්බන්ධයම වෙනස් වීම, වංචාකාරයෝ අලුත් ක්‍රම පාවිච්චි කරන්න පටන් ගැනීම වගේ. PSI එක 0.1ට අඩු නම් ස්ථායියි, 0.1 ඉඳන් 0.25 දක්වා මධ්‍යස්ථ වෙනසක්, 0.25ට වැඩි නම් ලොකු වෙනසක්. උඩ උදාහරණයේ 0.194 නිසා හොයලා බලන්න ඕනේ, හැබැයි බය වෙන්න එපා.

---

## 18. Retraining

**Why it exists:** once drift is detected, someone must decide when and how to refresh the model. A clear policy beats ad-hoc panic.

| Strategy | When |
|---|---|
| **Scheduled** (daily/weekly/monthly) | Steady, predictable change; simple to run |
| **Triggered** | When drift or performance drops cross a threshold |
| **Continuous / online learning** | Model updates incrementally with each new batch of data (fast-changing domains); riskier |

**Retraining choices:**
- **Data window:** all history, or only recent data (sliding window), or weighted toward recent
- **Same model vs re-tuning** hyperparameters/features
- **Always evaluate** the new model against the current one on recent held-out data before promoting (section 13's quality gates), and roll out safely (section 15)

### Worked example: which window?

Demand model for a supermarket. Last 3 years of data, but buying habits changed 6 months ago.

| Window | Pros | Cons |
|---|---|---|
| All 3 years (1,095 days) | More data, sees every season | Old habits dilute the new pattern |
| Last 6 months (about 180 days) | Matches current behaviour | Misses the yearly seasons (Avurudu, December) |
| All data, recent days weighted more | A balance | One more setting to tune |

A common answer: use a long window plus a seasonal feature (month, holiday flag), and weight recent data higher. Test each choice on the **most recent** held-out period.

### Text picture: triggered retraining

```
monitor ─ PSI > 0.25 or AUC drops 3 points ─► retrain job ─► quality gate ─► canary ─► promote
```

### Where you'll meet it in real work

A bank retrains its fraud model weekly on a schedule, and also has a trigger that retrains immediately if the fraud-catch rate falls below a limit.

### Common mistakes

- Retraining on a schedule and deploying automatically without a quality gate. A bad day of data could ship a bad model.
- Evaluating the new model on old data instead of recent data.

**Exam angle:** know scheduled versus triggered versus continuous retraining, and that every new model passes the same gates before promotion.

> **සිංහලෙන්:** Drift එකක් අහු වුණාම model එක අලුත් කරන්නේ කොහොමද කියලා ක්‍රමයක් තියෙන්න ඕනේ. Schedule එකකට (සතියකට එක පාරක්) retrain කරන්න පුළුවන්, නැත්නම් PSI එක 0.25 ඉක්මවුණාම trigger වෙන්න දාන්න පුළුවන්. Supermarket demand model එකක් අවුරුදු 3ක data සේරම ගත්තොත් පරණ පුරුදු වැඩියි, මාස 6ක් විතරක් ගත්තොත් අවුරුදු සෘතු නැතිවෙනවා. ඒකට හොඳම දේ දිගු window එකක් එක්ක මෑත data වලට වැඩි බර දීම. අලුත් model එක කොහොමත් quality gate එකෙන් යවලා ඊට පස්සේ තමයි promote කරන්නේ.

---

## 19. LLMOps

**Why it exists:** LLM apps look like normal MLOps but break the usual assumptions: you often do not own the model, the "code" is partly a prompt, and the bill grows with every token.

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

### Worked example: a token budget

Assume (illustrative prices only, check your provider) $1 per million input tokens and $4 per million output tokens. A support bot handles 10,000 requests a day, each with 800 input tokens and 200 output tokens.

- Input: 10,000 × 800 = 8,000,000 tokens = 8 million → 8 × $1 = **$8**
- Output: 10,000 × 200 = 2,000,000 tokens = 2 million → 2 × $4 = **$8**
- Per day: $16. Per 30 days: 16 × 30 = **$480**

Now a developer adds a 2,000-token policy text to every prompt. Input becomes 2,800 per request: 10,000 × 2,800 = 28 million tokens → $28 per day, so the daily bill goes from $16 to $36. One prompt edit more than doubled the cost. That is why cost is monitored per feature and why caching matters.

### Text picture: a trace

```
request ─► guardrail(in) ─► retrieve 4 chunks ─► LLM call (820 tokens, 1.9 s) ─► guardrail(out) ─► reply
  every box above is logged with its inputs, outputs, tokens, latency and cost
```

### Where you'll meet it in real work

A bank's customer chatbot sits behind a gateway that applies rate limits, redacts NIC and phone numbers from logs, falls back to a second provider if the first is down, and shows cost per team.

### Common mistakes

- Using a model name without a version, so a silent provider update changes behaviour.
- Editing prompts directly in production with no tests or history.
- Logging full conversations with personal data and no retention limit.

**Exam angle:** LLMOps adds prompt versioning, evals in CI, tracing, guardrails, gateways and token-cost control ([file 29](29-responsible-ai.md#14-guardrails) covers guardrails in depth).

> **සිංහලෙන්:** LLMOps කියන්නේ LLM apps වලට MLOps ගැලපෙන්න හදපු ක්‍රම. මෙහිදී බොහෝ වෙලාවට model එක ඔයාගේ නෙවෙයි, ඒක API එකකින් ගන්නවා. ඒ නිසා prompts version කරන්න ඕනේ, model version එක pin කරන්න ඕනේ, හැම request එකකම tokens සහ cost trace කරන්න ඕනේ. දවසකට requests 10,000ක් ඇති bot එකකට prompt එකට tokens 2,000ක policy text එකක් එකතු කළොත් දවසේ ගාස්තුව $16 ඉඳන් $36 වෙනවා. ඒ නිසා cost එක feature එකෙන් feature එකට බලාගෙන, guardrails සහ kill switch එකක් තියාගන්න.

---

## 20. Maturity and architecture

**Why it exists:** teams either under-build (everything manual) or over-build (a huge platform for a prototype). Maturity levels help you pick the right amount.

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

### Worked example: which level do I need?

| Project | Right level |
|---|---|
| University final-year project, one demo | Level 0 is fine |
| A startup's recommender serving real users, retrained monthly | Level 1: tracking, registry, a retraining pipeline |
| A bank's credit model audited by regulators, retrained weekly | Level 2: CI/CD, monitoring with triggers, canaries |

A useful rule: add a tool only when you feel a specific pain it removes (lost experiments, risky deploys, silent degradation).

### Reading the reference architecture

Follow one piece of data from left to right: it is ingested, validated, turned into features, used to train, the model is registered, packaged in a Docker image, rolled out as a canary, served via an API, and logged. Monitoring watches the end and feeds a retrain trigger back to the start. That feedback arrow is the "loop" from section 2.

### Common mistakes

- Copying a big-tech architecture for a small project.
- Having a platform but no owner for monitoring alerts.

**Exam angle:** know the three maturity levels and name which tool plays which role (Airflow orchestrates, MLflow tracks, Feast serves features, Prometheus monitors).

> **සිංහලෙන්:** හැම project එකකටම විශාල MLOps platform එකක් ඕනේ නෑ. විශ්වවිද්‍යාලයේ final-year demo එකකට අතින් කරන Level 0 ඇති. Real users ඉන්න startup එකකට experiment tracking, registry, retraining pipeline එකක් (Level 1) ඕනේ. නියාමකයෝ audit කරන bank එකක credit model එකකට full CI/CD, monitoring, canary rollouts (Level 2) ඕනේ. නීතිය සරලයි: ඇත්තටම වේදනාවක් දැනුණාම විතරක් අදාළ tool එක එකතු කරන්න. Airflow එක orchestrate කරනවා, MLflow එක track කරනවා, Prometheus එක monitor කරනවා.

```quiz
[
{"q": "A colleague sends you a model.pkl file from an unknown website. What is the main risk of loading it?", "options": ["It will make training slower", "Loading it can run hidden malicious code", "It will lower the model's accuracy", "It can only be read by Windows"], "answer": 1, "why": "Unpickling can execute arbitrary Python code. Slower loading or lower accuracy are not the danger. For weights, prefer safetensors, which cannot run code."},
{"q": "One /predict call takes 50 ms on one worker. How many requests per second can 2 such workers handle at best?", "options": ["20", "40", "100", "2"], "answer": 1, "why": "One worker: 1 / 0.05 = 20 requests per second; two workers: 40. 20 is the answer for only one worker, a tempting mistake."},
{"q": "4 pods run at 90% average CPU and the HPA target is 60%. How many pods does the HPA ask for?", "options": ["4", "5", "6", "9"], "answer": 2, "why": "desired = ceil(4 x 90 / 60) = ceil(6) = 6. Choosing 5 comes from adding half of the gap, but the HPA formula scales proportionally."},
{"q": "A fraud model fails because criminals invented a new scam. Customers and inputs look the same, but the same pattern now means fraud. Which drift is this?", "options": ["Data drift", "Concept drift", "Upstream schema change", "Latency drift"], "answer": 1, "why": "The relationship between inputs and the label changed, which is concept drift. Data drift would be the inputs themselves shifting."},
{"q": "Training distribution of a feature is [0.4, 0.6] and production is [0.5, 0.5]. PSI is about 0.041. What does that mean?", "options": ["Significant shift, retrain now", "Moderate shift, investigate", "Stable, no action needed", "The test is invalid with 2 bins"], "answer": 2, "why": "PSI under 0.1 is considered stable. 0.1 to 0.25 would be moderate. Two bins are fine for a simple example."},
{"q": "Which release strategy lets a new model see real traffic while its answers are never shown to users?", "options": ["Canary", "Blue-green", "Shadow deployment", "A/B test"], "answer": 2, "why": "Shadow runs the new model on copies of requests and only logs outputs. A canary does serve a small share of real users."},
{"q": "Training computed avg_spend_30d in SQL, while production code computes it slightly differently. What problem is this and what fixes it?", "options": ["Concept drift; retrain more often", "Training-serving skew; a feature store with one shared definition", "Overfitting; add regularisation", "Data leakage; shuffle the rows"], "answer": 1, "why": "Features differing between training and serving is training-serving skew. A feature store gives one definition for both. It is not concept drift because the world did not change."},
{"q": "A support bot uses 800 input and 200 output tokens per request. A developer adds a 2,000-token policy text to every prompt. What happens to cost?", "options": ["Nothing, only latency changes", "Input tokens per request rise from 800 to 2,800, so cost rises a lot", "Output cost rises 3.5 times", "Cost falls because of caching"], "answer": 1, "why": "Input tokens are billed on every request, 800 + 2,000 = 2,800. Output tokens are unchanged. Caching can reduce but does not automatically make it cheaper."}
]
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

**Q14.** Ten requests have latencies 40, 42, 45, 47, 50, 52, 55, 60, 90 and 1200 ms. Why is the average (168 ms) a poor summary?
<details><summary>Answer</summary>One slow outlier pulls the average far above what most users see (the median is about 51 ms). Teams use p95/p99 percentiles to see tail latency.</details>

**Q15.** A canary sends 5% of 10,000 requests to a new model, and it makes 20 errors. What is its error rate, and is it comparable to the old model's 1%?
<details><summary>Answer</summary>5% of 10,000 = 500 requests; 20 / 500 = 4%. That is four times the old 1% rate, so stop the rollout.</details>

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
| Quality gate, golden set | Pass/fail rule before deployment / fixed test questions |
| p50, p95, p99 | Latency percentiles (median, 95th, 99th) |
| Idempotent pipeline | Running it twice gives the same result |
| Token budget | Planned token usage and its cost |

**Next:** [29-responsible-ai.md](29-responsible-ai.md)
