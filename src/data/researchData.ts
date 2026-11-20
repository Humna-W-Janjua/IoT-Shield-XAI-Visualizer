export interface KpiMetric {
  id: string;
  value: string;
  label: string;
  context: string;
  accent: 'teal' | 'navy' | 'coral';
}

export interface ZeekClassBreakdown {
  label: string;
  count: number;
  percentage: number;
  category: 'Botnet' | 'Benign';
}

export interface PipelineStage {
  id: number;
  shortTitle: string;
  title: string;
  summary: string;
  inputShape: string;
  outputShape: string;
  keyConfig: string[];
}

export interface SplitStageMetric {
  split: string;
  benign: number;
  botnet: number;
  total: number;
  benignShare: string;
  note: string;
}

export interface ModelResult {
  id: string;
  model: string;
  family: 'Linear' | 'Tree Ensemble' | 'Neural Network';
  features: number;
  macroF1: number;
  rocAuc: number;
  fpr: number;
  inferenceMs: number | null; // null means <res. (<0.0001 ms)
  inferenceDisplay: string;
  bestF1?: boolean;
  bestAuc?: boolean;
  bestFpr?: boolean;
  fastest?: boolean;
  notes: string;
}

export interface BasePaperComparison {
  study: string;
  dataset: string;
  protocol: string;
  reportedScore: string;
  contrastNote: string;
}

export interface ShapFeature {
  rank: number;
  feature: string;
  meanAbsShap: number;
  origin: string;
  isArtifact?: boolean;
  warningText?: string;
}

export interface AblationVariant {
  key: 'full' | 'top3';
  label: string;
  inputDim: number;
  architecture: string;
  params: number;
  macroF1: number;
  rocAuc: number;
  fpr: number;
  epoch20Loss: number;
  inferenceDisplay: string;
  featuresList: string[];
}

export interface ThreatItem {
  id: number;
  title: string;
  scope: string;
  detail: string;
  mitigation: string;
}

export const PAPER_META = {
  shortName: 'IoT-Shield XAI',
  title:
    'Lightweight and Explainable IoT Botnet Detection on IoT-23: An Empirical Comparison of Tree Ensembles and a Compact MLP with SHAP-Guided Feature Reduction',
  authors: 'Aima Naveed & Humna Wasim Janjua',
  affiliation: 'BS Artificial Intelligence, FAST-NUCES Islamabad, Pakistan',
  githubUrl: 'https://github.com/Humna-W-Janjua/IoT-Botnet-Detection_Computer-Networking',
};

export const KPI_METRICS: KpiMetric[] = [
  {
    id: 'roc-auc',
    value: '0.9467',
    label: 'Peak ROC-AUC',
    context: 'LightGBM & XGBoost on 15,000 held-out flows',
    accent: 'teal',
  },
  {
    id: 'macro-f1',
    value: '0.9106',
    label: 'Peak Macro-F1',
    context: 'LightGBM across 11.5% skewed benign test traffic',
    accent: 'teal',
  },
  {
    id: 'speedup',
    value: '28× Faster',
    label: 'Compact MLP Inference',
    context: '0.0006 ms/sample vs. 0.0182 ms for LightGBM',
    accent: 'navy',
  },
  {
    id: 'param-cut',
    value: '-51.3% Params',
    label: '3-Feature Ablation Compression',
    context: '4,865 → 2,369 trainable parameters (Top-3 SHAP)',
    accent: 'coral',
  },
];

export const ZEEK_CORPUS_BREAKDOWN: ZeekClassBreakdown[] = [
  { label: 'PartOfAHorizontalPortScan', count: 3389036, percentage: 56.05, category: 'Botnet' },
  { label: 'Okiru', count: 1313012, percentage: 21.71, category: 'Botnet' },
  { label: 'Benign', count: 688812, percentage: 11.39, category: 'Benign' },
  { label: 'DDoS', count: 638506, percentage: 10.56, category: 'Botnet' },
  { label: 'C&C', count: 15286, percentage: 0.25, category: 'Botnet' },
  { label: 'C&C-HeartBeat', count: 1332, percentage: 0.02, category: 'Botnet' },
  { label: 'Attack', count: 538, percentage: 0.01, category: 'Botnet' },
  { label: 'Other', count: 101, percentage: 0.002, category: 'Botnet' },
];

export const SPLIT_SMOTE_DATA: SplitStageMetric[] = [
  {
    split: 'Train (Raw 55%)',
    benign: 3159,
    botnet: 24351,
    total: 27510,
    benignShare: '11.48%',
    note: 'Pre-SMOTE stratified training partition',
  },
  {
    split: 'Train (Post-SMOTE)',
    benign: 24351,
    botnet: 24351,
    total: 48702,
    benignShare: '50.00%',
    note: 'SMOTE oversampling applied strictly to Train',
  },
  {
    split: 'Validation (15%)',
    benign: 860,
    botnet: 6630,
    total: 7490,
    benignShare: '11.48%',
    note: 'Untouched skewed holdout for early/model checks',
  },
  {
    split: 'Test (30%)',
    benign: 1720,
    botnet: 13280,
    total: 15000,
    benignShare: '11.47%',
    note: 'Realistic 11.5% benign skew preserved for evaluation',
  },
];

export const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: 1,
    shortTitle: 'IoT-23 Corpus',
    title: 'Stage 1: IoT-23 Corpus & Stratified Sampling',
    summary:
      'Aggregates 6,046,623 raw Zeek connection records across multi-scenario IoT captures (88.6% non-benign) and extracts a 50,000-flow stratified sample (0.83%, seed 42) mapped to binary labels (0 = Benign, 1 = Botnet).',
    inputShape: '6,046,623 raw Zeek flows',
    outputShape: '50,000 × binary labeled flows',
    keyConfig: [
      'Sampling fraction: 0.83% stratified (random_state = 42)',
      'Class composition: 88.6% Botnet / 11.4% Benign preserved',
      'Binary target mapping: Benign → 0; all 7 attack families → 1',
    ],
  },
  {
    id: 2,
    shortTitle: 'Preprocessing',
    title: 'Stage 2: Preprocessing & Feature Engineering',
    summary:
      'Removes spoofable network identifiers to avoid IP/port memorization, normalizes missing Zeek placeholders ("-" → 0), and one-hot encodes categorical protocol and connection descriptors into 42 numeric features.',
    inputShape: 'Raw Zeek conn.log schema',
    outputShape: '50,000 × 42 numeric matrix',
    keyConfig: [
      'Dropped identifiers: timestamp (ts), uid, id.orig_h, id.resp_h, id.orig_p, id.resp_p',
      'Placeholder normalization: Zeek "-" tokens cast to numeric 0',
      'One-hot encoded categoricals: proto, service, conn_state, history',
    ],
  },
  {
    id: 3,
    shortTitle: 'Split & SMOTE',
    title: 'Stage 3: Leakage-Free Split & Train-Only SMOTE',
    summary:
      'Partitions flows into 55% Train (27,510), 15% Validation (7,490), and 30% Test (15,000) before any resampling or scaling. Applies SMOTE strictly to Train (24,351 vs. 3,159 → 48,702 balanced flows) and fits StandardScaler solely on Train.',
    inputShape: '50,000 × 42 stratified flows',
    outputShape: 'Train: 48,702 | Val: 7,490 | Test: 15,000',
    keyConfig: [
      'Train-only SMOTE: balances minority benign flows (3,159 → 24,351)',
      'Test skew preserved: 15,000 flows retain realistic ~11.5% benign (~1,720 flows)',
      'Zero scaling leakage: StandardScaler fit strictly on post-SMOTE training fold',
    ],
  },
  {
    id: 4,
    shortTitle: 'Model Training',
    title: 'Stage 4: Parallel Model Training (Baselines vs. Compact MLP)',
    summary:
      'Benchmarks four classical & ensemble baselines (Logistic Regression, Random Forest [100 trees], XGBoost, LightGBM) in parallel against a custom PyTorch Compact MLP (42 → 64 → 32 → 1, 4,865 parameters).',
    inputShape: '48,702 × 42 standardized train matrix',
    outputShape: '5 trained classifiers benchmarked on Test',
    keyConfig: [
      'Compact MLP: Linear(42,64) → ReLU → Dropout(0.2) → Linear(64,32) → ReLU → Dropout(0.2) → Linear(32,1)',
      'Optimizer & schedule: Adam (lr = 1e-3), BCEWithLogitsLoss, 20 training epochs',
      'Tree ensemble baselines: Random Forest (100 trees), XGBoost, LightGBM',
    ],
  },
  {
    id: 5,
    shortTitle: 'SHAP Ranking',
    title: 'Stage 5: SHAP Global Feature Ranking',
    summary:
      'Applies SHAP TreeExplainer to the trained Random Forest classifier across 1,000 held-out test flows to compute global mean |SHAP| attributions and isolate the dominant traffic discriminators.',
    inputShape: 'Random Forest + 1,000 test flows',
    outputShape: 'Global mean |SHAP| ranking (42 features)',
    keyConfig: [
      'Explainer: shap.TreeExplainer on 100-tree Random Forest',
      'Top-3 genuine traffic drivers: orig_ip_bytes (0.190), duration (0.145), orig_pkts (0.098)',
      'Audit discovery: Unnamed0 (0.082) flagged as residual CSV index artifact',
    ],
  },
  {
    id: 6,
    shortTitle: 'Top-3 Ablation',
    title: 'Stage 6: 3-Feature Ablation Study',
    summary:
      'Retrains the Compact MLP exclusively on the top 3 genuine behavioral traffic features (orig_ip_bytes, duration, orig_pkts) — excluding Unnamed0 — to quantify parameter compression vs. detection trade-offs.',
    inputShape: '48,702 × 3 standardized train matrix',
    outputShape: 'Compact MLP (3 → 64 → 32 → 1 · 2,369 params)',
    keyConfig: [
      'Selected features: orig_ip_bytes, duration, orig_pkts',
      'Parameter reduction: 4,865 → 2,369 (-51.3%)',
      'Empirical cost: ROC-AUC drops 0.7135 → 0.6401; FPR rises 0.6115 → 0.6330',
    ],
  },
];

export const MODEL_RESULTS: ModelResult[] = [
  {
    id: 'logreg',
    model: 'Logistic Regression',
    family: 'Linear',
    features: 42,
    macroF1: 0.6905,
    rocAuc: 0.6937,
    fpr: 0.6109,
    inferenceMs: 0.00005,
    inferenceDisplay: '<res. (<0.0001 ms)',
    fastest: true,
    notes: 'Linear decision boundary fails on non-linear botnet scan bursts; high benign false alarms.',
  },
  {
    id: 'rf',
    model: 'Random Forest (100 trees)',
    family: 'Tree Ensemble',
    features: 42,
    macroF1: 0.8562,
    rocAuc: 0.9274,
    fpr: 0.2015,
    inferenceMs: 0.0156,
    inferenceDisplay: '0.0156 ms',
    bestFpr: true,
    notes: 'Lowest False-Positive Rate (20.15%) across all evaluated models; strong ROC-AUC.',
  },
  {
    id: 'xgb',
    model: 'XGBoost',
    family: 'Tree Ensemble',
    features: 42,
    macroF1: 0.8975,
    rocAuc: 0.9467,
    fpr: 0.2375,
    inferenceMs: 0.0019,
    inferenceDisplay: '0.0019 ms',
    bestAuc: true,
    notes: 'Tied for highest ROC-AUC (0.9467) while running 8× faster than Random Forest.',
  },
  {
    id: 'lgbm',
    model: 'LightGBM',
    family: 'Tree Ensemble',
    features: 42,
    macroF1: 0.9106,
    rocAuc: 0.9467,
    fpr: 0.2526,
    inferenceMs: 0.0182,
    inferenceDisplay: '0.0182 ms',
    bestF1: true,
    bestAuc: true,
    notes: 'Highest overall Macro-F1 (0.9106) and tied peak ROC-AUC (0.9467) on skewed test flows.',
  },
  {
    id: 'mlp42',
    model: 'Compact MLP (42 feat.)',
    family: 'Neural Network',
    features: 42,
    macroF1: 0.6904,
    rocAuc: 0.7135,
    fpr: 0.6115,
    inferenceMs: 0.0006,
    inferenceDisplay: '0.0006 ms',
    notes: '28× faster inference than LightGBM (0.0006 ms/sample) but lags trees on skewed tabular distributions.',
  },
  {
    id: 'mlp3',
    model: 'Compact MLP (Top-3 feat.)',
    family: 'Neural Network',
    features: 3,
    macroF1: 0.6796,
    rocAuc: 0.6401,
    fpr: 0.6330,
    inferenceMs: 0.00005,
    inferenceDisplay: '<res. (<0.0001 ms)',
    notes: 'Cuts parameters by 51.3% (2,369 params), at the cost of -0.0734 ROC-AUC degradation.',
  },
];

export const BASE_PAPERS_CONTEXT: BasePaperComparison[] = [
  {
    study: 'Babenko et al. [8]*',
    dataset: 'N-BaIoT',
    protocol: 'Balanced / per-device multi-class captures',
    reportedScore: '99.88% F1',
    contrastNote:
      'N-BaIoT lacks IoT-23 multi-scenario Zeek flow heterogeneity and extreme 88.6% attack skew.',
  },
  {
    study: "Alja'afreh et al. [9]*",
    dataset: 'IoT Botnet Benchmark',
    protocol: 'Balanced / resampled evaluation subsets',
    reportedScore: '98.27% Macro-F1',
    contrastNote:
      'Evaluating on resampled or balanced splits masks minority-benign false-positive amplification.',
  },
  {
    study: 'Hua et al. [11]*',
    dataset: 'IoT Traffic Corpus',
    protocol: 'Accuracy-centric balanced evaluation',
    reportedScore: '0.9994 Accuracy',
    contrastNote:
      'Raw accuracy inflates apparent skill under majority-attack distributions; Macro-F1 and FPR expose true error.',
  },
];

export const SHAP_TOP_10: ShapFeature[] = [
  {
    rank: 1,
    feature: 'orig_ip_bytes',
    meanAbsShap: 0.190,
    origin: 'Numeric flow volume (originator IP bytes)',
  },
  {
    rank: 2,
    feature: 'duration',
    meanAbsShap: 0.145,
    origin: 'Numeric flow duration (seconds)',
  },
  {
    rank: 3,
    feature: 'orig_pkts',
    meanAbsShap: 0.098,
    origin: 'Numeric packet count (originator)',
  },
  {
    rank: 4,
    feature: 'Unnamed0',
    meanAbsShap: 0.082,
    origin: 'Residual CSV row index artifact',
    isArtifact: true,
    warningText: 'Residual Row Index Flagged in Threats to Validity',
  },
  {
    rank: 5,
    feature: 'history_C',
    meanAbsShap: 0.015,
    origin: 'One-hot encoded Zeek connection history',
  },
  {
    rank: 6,
    feature: 'conn_state_S0',
    meanAbsShap: 0.013,
    origin: 'One-hot encoded SYN-only unanswered attempt',
  },
  {
    rank: 7,
    feature: 'conn_state_OTH',
    meanAbsShap: 0.004,
    origin: 'One-hot encoded mid-stream / other state',
  },
  {
    rank: 8,
    feature: 'proto_udp',
    meanAbsShap: 0.002,
    origin: 'One-hot encoded transport protocol (UDP)',
  },
  {
    rank: 9,
    feature: 'history_S',
    meanAbsShap: 0.002,
    origin: 'One-hot encoded SYN flag history',
  },
  {
    rank: 10,
    feature: 'orig_bytes',
    meanAbsShap: 0.001,
    origin: 'Numeric payload bytes (originator)',
  },
];

export const ABLATION_VARIANTS: Record<'full' | 'top3', AblationVariant> = {
  full: {
    key: 'full',
    label: 'Full 42 Features',
    inputDim: 42,
    architecture: '42 → 64 → 32 → 1',
    params: 4865,
    macroF1: 0.6904,
    rocAuc: 0.7135,
    fpr: 0.6115,
    epoch20Loss: 0.4868,
    inferenceDisplay: '0.0006 ms',
    featuresList: [
      'All numeric Zeek byte/packet/duration counters',
      'One-hot encoded proto, service, conn_state, history',
      'Includes residual Unnamed0 column in full baseline matrix',
    ],
  },
  top3: {
    key: 'top3',
    label: 'Top-3 SHAP Features',
    inputDim: 3,
    architecture: '3 → 64 → 32 → 1',
    params: 2369,
    macroF1: 0.6796,
    rocAuc: 0.6401,
    fpr: 0.6330,
    epoch20Loss: 0.5218,
    inferenceDisplay: '<res. (<0.0001 ms)',
    featuresList: [
      'orig_ip_bytes (mean |SHAP| = 0.190)',
      'duration (mean |SHAP| = 0.145)',
      'orig_pkts (mean |SHAP| = 0.098)',
    ],
  },
};

export const THREATS_TO_VALIDITY: ThreatItem[] = [
  {
    id: 1,
    title: 'Residual Unnamed0 Index Column',
    scope: 'Feature Integrity',
    detail:
      'An unstripped CSV row-index column (Unnamed0) survived preprocessing and ranked #4 in Random Forest SHAP attributions (0.082), meaning 42-feature models partially exploited corpus ordering artifacts.',
    mitigation:
      'Explicitly excluded Unnamed0 from the Top-3 SHAP ablation subset; future runs must drop all unnamed index columns prior to splitting.',
  },
  {
    id: 2,
    title: 'Flow-Level Random Split (55/15/30)',
    scope: 'Scenario Generalization',
    detail:
      'Stratified random splitting at the individual flow level allows flows from the same IoT-23 capture scenario or host burst to appear in both train and test folds.',
    mitigation:
      'Scenario-grouped or capture-disjoint splits are required to certify cross-deployment generalization to unseen botnet campaigns.',
  },
  {
    id: 3,
    title: 'SHAP Computed on Test Sample',
    scope: 'Selection Bias',
    detail:
      'Global TreeExplainer attributions were computed on 1,000 flows drawn from the test partition rather than strictly from the validation fold.',
    mitigation:
      'Although the Top-3 features reflect physical traffic volume/duration, feature-selection attribution must run on validation flows in strict protocols.',
  },
  {
    id: 4,
    title: 'Single Seed (42) on 50k Sample',
    scope: 'Statistical Variance',
    detail:
      'All metrics come from a single 0.83% stratified subsample (50,000 of 6,046,623 flows) with fixed random seed 42, without multi-seed confidence intervals.',
    mitigation:
      'Multi-seed cross-validation across larger corpus fractions is needed to bound variance on rare attack sub-families (Attack, Other).',
  },
  {
    id: 5,
    title: 'Coarse Wall-Clock Batch Timing',
    scope: 'Latency Measurement',
    detail:
      'Per-sample latency is derived by dividing batch prediction wall-clock time across 15,000 flows, causing sub-microsecond models (LogReg, 3-feat MLP) to fall below timer resolution (<res.).',
    mitigation:
      'Single-flow streaming inference on constrained edge hardware (e.g., Raspberry Pi / ARM Cortex) with warm-up iterations is needed for microsecond profiling.',
  },
];
