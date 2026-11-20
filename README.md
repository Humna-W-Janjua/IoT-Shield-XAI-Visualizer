# IoT-Shield XAI: Interactive Botnet Detection Research Visualizer

An interactive web application built to visually communicate the experimental workflow, empirical benchmarks, SHAP feature attributions, and methodological audit from our IEEE research paper:  
**"Lightweight and Explainable IoT Botnet Detection on IoT-23: An Empirical Comparison of Tree Ensembles and a Compact MLP with SHAP-Guided Feature Reduction."**

> **Main Codebase, Jupyter Notebook & IEEE Paper:**  
> [Humna-W-Janjua/IoT-Botnet-Detection_Computer-Networking](https://github.com/Humna-W-Janjua/IoT-Botnet-Detection_Computer-Networking)

---

## Interactive Modules Included

### 1. End-to-End Experimental Workflow Explorer
* Walks through the 6-stage pipeline from the **6,046,623-row IoT-23 Zeek corpus** down to a **50,000-flow stratified sample** (`seed = 42`).
* Visualizes spoofable identifier removal, one-hot categorical encoding (**42 features**), stratified **55% / 15% / 30%** splitting, and **train-only SMOTE** balancing (`48,702` balanced training flows vs. a naturally skewed `11.5%` benign test set).

### 2. Held-Out Test Benchmark Dashboard (15,000 Flows)
* Sortable comparison table and multi-panel charts contrasting **Logistic Regression**, **Random Forest**, **XGBoost**, **LightGBM**, and our custom **4,865-parameter PyTorch Compact MLP** (`42 → 64 → 32 → 1`).
* Highlights the core empirical trade-off: **LightGBM** leads detection quality (**0.9106 Macro-F1**, **0.9467 ROC-AUC**), whereas the **Compact MLP** achieves **28× faster inference** (**0.0006 ms/sample**) but cannot match tree-ensemble accuracy on skewed tabular flows.

### 3. SHAP Explainability & Interactive Ablation Switcher
* Displays global `TreeExplainer` mean `|SHAP|` rankings (`orig_ip_bytes`, `duration`, `orig_pkts`) while flagging the residual `Unnamed0` row-index column.
* Includes an interactive toggle comparing the **Full 42-Feature MLP** against the **Top-3 SHAP Feature MLP**, visualizing the **-51.3% parameter reduction** (`4,865 → 2,369`) alongside the resulting **-0.0734 ROC-AUC** drop (`0.7135 → 0.6401`).

### 4. Base-Paper Context & Threats to Validity Audit
* Contrasts our naturally skewed IoT-23 benchmark against balanced-sampling literature (`N-BaIoT`, `BoT-IoT`, `ICU-IoT`).
* Summarizes five documented threats to validity: the residual `Unnamed0` column, flow-level random splitting, test-set SHAP selection, single-seed evaluation, and coarse wall-clock batch timing.

---

## Authors
* **Aima Naveed** (`24I-2550`) — BS Artificial Intelligence, FAST-NUCES Islamabad
* **Humna Wasim Janjua** (`24I-0048`) — BS Artificial Intelligence, FAST-NUCES Islamabad
