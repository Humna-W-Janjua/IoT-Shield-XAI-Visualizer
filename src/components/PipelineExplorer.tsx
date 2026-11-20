import { useState } from 'react';
import {
  ArrowRight,
  Database,
  Filter,
  Split,
  Cpu,
  BarChart3,
  Scissors,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  PIPELINE_STAGES,
  ZEEK_CORPUS_BREAKDOWN,
  SPLIT_SMOTE_DATA,
  type PipelineStage,
} from '../data/researchData';

const STAGE_ICONS = [Database, Filter, Split, Cpu, BarChart3, Scissors];

export function PipelineExplorer() {
  const [activeStageId, setActiveStageId] = useState<number>(1);
  const activeStage: PipelineStage =
    PIPELINE_STAGES.find((s) => s.id === activeStageId) ?? PIPELINE_STAGES[0];

  return (
    <section id="pipeline" className="py-14 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold text-[#00809D] tracking-wide mb-1.5">
            01. Experimental Methodology
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2537] tracking-tight">
            Interactive End-to-End Research Workflow
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Select any stage across our six-step IoT-23 pipeline to inspect exact tensor
            dimensions, leakage safeguards, and model configurations.
          </p>
        </div>

        {/* 6-Stage Horizontal Flowchart */}
        <div
          role="tablist"
          aria-label="Research pipeline stages"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 mb-6"
        >
          {PIPELINE_STAGES.map((stage, idx) => {
            const Icon = STAGE_ICONS[idx];
            const isActive = stage.id === activeStageId;

            return (
              <div key={stage.id} className="relative flex items-stretch">
                <button
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`stage-panel-${stage.id}`}
                  onClick={() => setActiveStageId(stage.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D] flex flex-col justify-between ${
                    isActive
                      ? 'bg-[#00809D] text-white border-[#00809D] shadow-sm'
                      : 'bg-white text-[#1E293B] border-slate-200 hover:border-[#00809D]/60 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-mono font-semibold tabular-nums ${
                        isActive ? 'text-white/90' : 'text-[#00809D]'
                      }`}
                    >
                      Stage 0{stage.id}
                    </span>
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive ? 'text-white' : 'text-slate-400'
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold leading-snug">
                      {stage.shortTitle}
                    </h3>
                    <p
                      className={`mt-1.5 text-[11px] font-mono tabular-nums truncate ${
                        isActive ? 'text-white/85' : 'text-slate-500'
                      }`}
                    >
                      {stage.outputShape}
                    </p>
                  </div>
                </button>

                {idx < PIPELINE_STAGES.length - 1 && (
                  <div
                    className="hidden lg:flex items-center justify-center -mr-2.5 z-10 pointer-events-none"
                    aria-hidden="true"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#F2F6FA] border border-[#00809D]/40 flex items-center justify-center text-[#00809D]">
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Inspection Card */}
        <div
          id={`stage-panel-${activeStage.id}`}
          role="tabpanel"
          className="bg-white rounded-lg border border-slate-200 p-6 sm:p-8"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Details Column */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-2 text-xs font-mono text-[#00809D] font-semibold mb-2">
                <span>Stage 0{activeStage.id} of 06</span>
                <span aria-hidden="true">·</span>
                <span>Inspection View</span>
              </div>
              <h3 className="text-xl font-bold text-[#0F2537]">{activeStage.title}</h3>
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {activeStage.summary}
              </p>

              {/* Input -> Output Shape Strip */}
              <div className="mt-5 grid grid-cols-2 gap-3 p-3.5 rounded-md bg-[#F2F6FA] border border-slate-200">
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Input Shape</p>
                  <p className="mt-1 text-xs font-mono font-semibold text-[#0F2537] tabular-nums">
                    {activeStage.inputShape}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-500">Output Shape</p>
                  <p className="mt-1 text-xs font-mono font-semibold text-[#00809D] tabular-nums">
                    {activeStage.outputShape}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-2.5">
                {activeStage.keyConfig.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <CheckCircle2
                      className="w-4 h-4 text-[#00809D] shrink-0 mt-0.5"
                      aria-hidden="true"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Interactive Visual Column */}
            <div className="lg:col-span-7 bg-[#F8FAFC] rounded-lg border border-slate-200 p-5">
              {activeStage.id === 1 && <Stage1CorpusVisual />}
              {activeStage.id === 2 && <Stage2PreprocessingVisual />}
              {activeStage.id === 3 && <Stage3SplitSmoteVisual />}
              {activeStage.id === 4 && <Stage4TrainingVisual />}
              {activeStage.id === 5 && <Stage5ShapVisual />}
              {activeStage.id === 6 && <Stage6AblationVisual />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Stage1CorpusVisual() {
  const maxCount = ZEEK_CORPUS_BREAKDOWN[0].count;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
        <h4 className="text-sm font-bold text-[#0F2537]">
          IoT-23 Raw Zeek Corpus Composition (6,046,623 Records)
        </h4>
        <span className="text-xs font-mono tabular-nums text-[#D93848] font-semibold">
          88.6% Non-Benign / 11.4% Benign
        </span>
      </div>

      <div className="space-y-2.5">
        {ZEEK_CORPUS_BREAKDOWN.map((row) => {
          const widthPct = Math.max((row.count / maxCount) * 100, 1.2);
          const isBenign = row.category === 'Benign';
          return (
            <div key={row.label} className="grid grid-cols-12 items-center gap-2 text-xs">
              <div className="col-span-5 sm:col-span-4 font-mono text-slate-700 truncate">
                {row.label}
              </div>
              <div className="col-span-4 sm:col-span-5 h-3.5 bg-slate-200/80 rounded-xs overflow-hidden">
                <div
                  className={`h-full rounded-xs ${
                    isBenign ? 'bg-[#00809D]' : 'bg-[#D93848]'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
              </div>
              <div className="col-span-3 text-right font-mono tabular-nums text-slate-700">
                {row.count.toLocaleString()}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
        <span>
          Stratified Sampling (<span className="font-mono">0.83%</span>, seed{' '}
          <span className="font-mono">42</span>) →{' '}
          <strong className="text-[#0F2537] font-mono tabular-nums">50,000</strong> flows
        </span>
        <span className="font-mono text-[#0F2537]">0 = Benign · 1 = Botnet</span>
      </div>
    </div>
  );
}

function Stage2PreprocessingVisual() {
  const dropped = ['ts (timestamp)', 'uid', 'id.orig_h', 'id.resp_h', 'id.orig_p', 'id.resp_p'];
  const encoded = ['proto', 'service', 'conn_state', 'history'];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-[#0F2537]">
        Schema Sanitization &amp; 42-Feature Matrix Construction
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs font-semibold text-[#D93848] mb-2">
            Dropped Spoofable Identifiers (6 fields)
          </p>
          <div className="flex flex-wrap gap-1.5">
            {dropped.map((col) => (
              <code
                key={col}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#D93848]/10 text-[#D93848]"
              >
                {col}
              </code>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-slate-600">
            Prevents classifiers from memorizing lab IP addresses, ephemeral ports, or capture timestamps.
          </p>
        </div>

        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs font-semibold text-[#00809D] mb-2">
            Placeholder Cast &amp; One-Hot Encoding
          </p>
          <div className="flex flex-wrap gap-1.5">
            {encoded.map((col) => (
              <code
                key={col}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#00809D]/10 text-[#00809D]"
              >
                {col}
              </code>
            ))}
          </div>
          <p className="mt-2.5 text-xs text-slate-600">
            Zeek missing placeholders (<span className="font-mono">"-"</span>) converted to{' '}
            <span className="font-mono">0</span>; categorical descriptors expanded to{' '}
            <strong className="font-mono text-[#0F2537]">42 numeric features</strong>.
          </p>
        </div>
      </div>

      <div className="p-3 bg-white rounded-md border border-slate-200 flex items-center gap-2.5 text-xs text-slate-700">
        <AlertTriangle className="w-4 h-4 text-[#D93848] shrink-0" aria-hidden="true" />
        <span>
          <strong>Methodological note:</strong> A residual <span className="font-mono">Unnamed0</span>{' '}
          row-index column persisted in the 42-feature matrix and was later caught via SHAP audit.
        </span>
      </div>
    </div>
  );
}

function Stage3SplitSmoteVisual() {
  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
        <h4 className="text-sm font-bold text-[#0F2537]">
          55% / 15% / 30% Split &amp; Train-Only SMOTE Balancing
        </h4>
        <span className="text-xs font-mono text-[#00809D] font-semibold">
          StandardScaler fit strictly on Train
        </span>
      </div>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={SPLIT_SMOTE_DATA}
            margin={{ top: 10, right: 12, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="split"
              tick={{ fontSize: 11, fill: '#334155' }}
              interval={0}
              angle={-12}
              textAnchor="end"
              height={46}
            />
            <YAxis tick={{ fontSize: 11, fill: '#334155' }} />
            <Tooltip
              formatter={(value) => Number(value ?? 0).toLocaleString()}
              contentStyle={{
                backgroundColor: '#FFFFFF',
                borderColor: '#CBD5E1',
                fontSize: '12px',
              }}
            />
            <Legend wrapperStyle={{ fontSize: '12px' }} />
            <Bar dataKey="botnet" name="Botnet Flows (1)" stackId="a" fill="#D93848" />
            <Bar dataKey="benign" name="Benign Flows (0)" stackId="a" fill="#00809D" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        {SPLIT_SMOTE_DATA.map((item) => (
          <div key={item.split} className="bg-white p-2.5 rounded border border-slate-200">
            <p className="font-semibold text-[#0F2537] truncate">{item.split}</p>
            <p className="font-mono tabular-nums text-[#00809D] mt-0.5">
              {item.total.toLocaleString()} flows
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">Benign: {item.benignShare}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stage4TrainingVisual() {
  const baselines = [
    { name: 'Logistic Regression', spec: 'L2-regularized linear baseline' },
    { name: 'Random Forest', spec: '100 decision trees (bagged ensemble)' },
    { name: 'XGBoost', spec: 'Depth-wise gradient boosted trees' },
    { name: 'LightGBM', spec: 'Leaf-wise histogram gradient boosting' },
  ];

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-[#0F2537]">
        Parallel Benchmark: Classical &amp; Tree Baselines vs. Compact PyTorch MLP
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs font-semibold text-slate-500 mb-2.5">
            4 Tabular Baseline Classifiers
          </p>
          <div className="space-y-2">
            {baselines.map((b) => (
              <div
                key={b.name}
                className="p-2.5 rounded bg-[#F2F6FA] border border-slate-200 flex flex-col"
              >
                <span className="text-xs font-bold text-[#0F2537]">{b.name}</span>
                <span className="text-[11px] text-slate-600">{b.spec}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0F2537] text-white p-4 rounded-md border border-[#0F2537] flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-[#5BC4DC] mb-2">
              Custom Compact PyTorch MLP
            </p>
            <div className="font-mono text-sm font-bold text-white bg-white/10 px-3 py-2 rounded">
              42 → 64 → 32 → 1
            </div>
            <ul className="mt-3 space-y-1.5 text-xs text-slate-200">
              <li>Activation: ReLU hidden layers</li>
              <li>Regularization: Dropout (p = 0.2)</li>
              <li>Optimizer: Adam (lr = 1e-3), 20 epochs</li>
              <li>Loss: Binary Cross-Entropy with Logits</li>
            </ul>
          </div>
          <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
            <span className="text-slate-300">Trainable Parameters</span>
            <span className="font-mono font-bold text-[#5BC4DC] tabular-nums">4,865</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stage5ShapVisual() {
  const topFour = [
    { name: 'orig_ip_bytes', val: 0.19, artifact: false },
    { name: 'duration', val: 0.145, artifact: false },
    { name: 'orig_pkts', val: 0.098, artifact: false },
    { name: 'Unnamed0', val: 0.082, artifact: true },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h4 className="text-sm font-bold text-[#0F2537]">
          TreeExplainer Attribution Audit (1,000 Held-Out Flows)
        </h4>
        <span className="text-xs font-mono text-slate-500">Random Forest (100 trees)</span>
      </div>

      <div className="space-y-2.5 bg-white p-4 rounded-md border border-slate-200">
        {topFour.map((item) => (
          <div key={item.name} className="grid grid-cols-12 items-center gap-2 text-xs">
            <span
              className={`col-span-4 font-mono font-semibold truncate ${
                item.artifact ? 'text-[#D93848]' : 'text-[#0F2537]'
              }`}
            >
              {item.name}
            </span>
            <div className="col-span-6 h-4 bg-slate-100 rounded-xs overflow-hidden">
              <div
                className={`h-full rounded-xs ${
                  item.artifact ? 'bg-[#D93848]' : 'bg-[#00809D]'
                }`}
                style={{ width: `${(item.val / 0.2) * 100}%` }}
              />
            </div>
            <span className="col-span-2 text-right font-mono tabular-nums font-semibold text-slate-700">
              {item.val.toFixed(3)}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        SHAP isolates three genuine behavioral packet/byte descriptors (
        <span className="font-mono">orig_ip_bytes</span>,{' '}
        <span className="font-mono">duration</span>,{' '}
        <span className="font-mono">orig_pkts</span>) while exposing{' '}
        <span className="font-mono text-[#D93848] font-semibold">Unnamed0</span> as a
        corpus-index artifact to strip before ablation.
      </p>
    </div>
  );
}

function Stage6AblationVisual() {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-bold text-[#0F2537]">
        3-Feature Ablation Compression vs. Detection Trade-Off
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Parameter Count</p>
          <p className="mt-1 text-lg font-mono font-bold text-[#00809D] tabular-nums">
            4,865 → 2,369
          </p>
          <p className="mt-1 text-xs font-mono text-[#00809D]">-51.3% footprint</p>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">Macro-F1 Delta</p>
          <p className="mt-1 text-lg font-mono font-bold text-[#0F2537] tabular-nums">
            0.6904 → 0.6796
          </p>
          <p className="mt-1 text-xs font-mono text-slate-600">-0.0108 shift</p>
        </div>
        <div className="bg-white p-4 rounded-md border border-slate-200">
          <p className="text-xs text-slate-500 font-medium">ROC-AUC Delta</p>
          <p className="mt-1 text-lg font-mono font-bold text-[#D93848] tabular-nums">
            0.7135 → 0.6401
          </p>
          <p className="mt-1 text-xs font-mono text-[#D93848]">-0.0734 ranking drop</p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed">
        Retraining solely on <span className="font-mono">orig_ip_bytes</span>,{' '}
        <span className="font-mono">duration</span>, and{' '}
        <span className="font-mono">orig_pkts</span> halves MLP memory footprint, yet removes
        critical protocol/state context (<span className="font-mono">conn_state_S0</span>,{' '}
        <span className="font-mono">history_C</span>) needed to separate scan bursts from
        short benign sessions.
      </p>
    </div>
  );
}
