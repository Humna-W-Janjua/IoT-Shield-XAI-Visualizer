import { useState } from 'react';
import { AlertTriangle, Cpu, Layers } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  SHAP_TOP_10,
  ABLATION_VARIANTS,
  type ShapFeature,
} from '../data/researchData';

export function ExplainabilityAblation() {
  const [ablationKey, setAblationKey] = useState<'full' | 'top3'>('full');
  const activeVariant = ABLATION_VARIANTS[ablationKey];
  const isTop3 = ablationKey === 'top3';

  return (
    <section
      id="explainability"
      className="py-14 sm:py-16 border-t border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold text-[#00809D] tracking-wide mb-1.5">
            03. Explainability &amp; Compression
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2537] tracking-tight">
            SHAP Explainability &amp; Interactive Ablation Analysis
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            Global <span className="font-mono">TreeExplainer</span> attributions across 1,000 test
            flows reveal both the physical packet drivers of botnet detection and a residual index
            leakage column, guiding our 3-feature Compact MLP ablation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Top-10 SHAP Feature Importance Chart */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                <h3 className="text-base font-bold text-[#0F2537]">
                  Top-10 SHAP Feature Importance
                </h3>
                <span className="text-xs font-mono text-slate-500">
                  Mean |SHAP| (Random Forest, n = 1,000)
                </span>
              </div>
              <p className="text-xs text-slate-600 mb-4">
                Physical flow counters dominate predictions, while{' '}
                <span className="font-mono font-semibold text-[#D93848]">Unnamed0</span> is
                flagged in Crimson Coral and excluded from the Top-3 ablation.
              </p>

              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={SHAP_TOP_10}
                    layout="vertical"
                    margin={{ top: 4, right: 24, left: 16, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                    <XAxis
                      type="number"
                      domain={[0, 0.21]}
                      tickFormatter={(v: number) => v.toFixed(2)}
                      tick={{ fontSize: 11, fill: '#334155' }}
                    />
                    <YAxis
                      type="category"
                      dataKey="feature"
                      width={118}
                      tick={{ fontSize: 11, fill: '#0F2537', fontFamily: 'JetBrains Mono' }}
                    />
                    <Tooltip
                      formatter={(val, _name, props) => {
                        const row = (props as { payload?: ShapFeature } | undefined)?.payload;
                        return [
                          `${Number(val ?? 0).toFixed(3)}${row?.isArtifact ? ' (Artifact Flagged)' : ''}`,
                          row?.origin ?? 'Mean |SHAP|',
                        ];
                      }}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="meanAbsShap" name="Mean |SHAP|" radius={[0, 3, 3, 0]}>
                      {SHAP_TOP_10.map((item) => (
                        <Cell
                          key={item.feature}
                          fill={
                            item.isArtifact
                              ? '#D93848'
                              : item.rank <= 3
                                ? '#00809D'
                                : '#64748B'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Warning callout for Unnamed0 */}
            <div className="mt-4 p-3.5 rounded-md bg-[#D93848]/[0.07] border border-[#D93848]/30 flex items-start gap-2.5">
              <AlertTriangle
                className="w-4 h-4 text-[#D93848] shrink-0 mt-0.5"
                aria-hidden="true"
              />
              <div className="text-xs text-[#1E293B] leading-relaxed">
                <strong className="font-mono text-[#D93848]">Unnamed0 (0.082)</strong>:{' '}
                <span>Residual Row Index Flagged in Threats to Validity.</span> Excluded when
                constructing the clean Top-3 feature set (<span className="font-mono">orig_ip_bytes</span>,{' '}
                <span className="font-mono">duration</span>,{' '}
                <span className="font-mono">orig_pkts</span>).
              </div>
            </div>
          </div>

          {/* Right: Interactive Ablation Switcher */}
          <div className="lg:col-span-6 bg-white rounded-lg border border-slate-200 p-6 flex flex-col justify-between">
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <div>
                  <h3 className="text-base font-bold text-[#0F2537]">
                    Interactive Compact MLP Ablation Switcher
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Toggle input dimensionality to inspect architecture and empirical trade-offs
                  </p>
                </div>

                {/* Toggle Switch */}
                <div
                  role="group"
                  aria-label="Ablation feature count selector"
                  className="inline-flex items-center gap-1 p-1 bg-[#F2F6FA] border border-slate-200 rounded-lg self-start"
                >
                  <button
                    type="button"
                    onClick={() => setAblationKey('full')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D] ${
                      !isTop3
                        ? 'bg-[#0F2537] text-white'
                        : 'text-slate-600 hover:text-[#0F2537]'
                    }`}
                  >
                    Full 42 Features
                  </button>
                  <button
                    type="button"
                    onClick={() => setAblationKey('top3')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D] ${
                      isTop3
                        ? 'bg-[#00809D] text-white'
                        : 'text-slate-600 hover:text-[#0F2537]'
                    }`}
                  >
                    Top-3 SHAP Features
                  </button>
                </div>
              </div>

              {/* Animated Neural Network Diagram */}
              <div className="bg-[#0F2537] rounded-lg p-4 sm:p-5 text-white mb-5">
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[#5BC4DC] font-semibold">
                    <Layers className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{activeVariant.architecture}</span>
                  </span>
                  <span className="font-mono tabular-nums text-slate-300">
                    {activeVariant.params.toLocaleString()} params
                    {isTop3 && (
                      <span className="ml-1.5 text-[#5BC4DC] font-semibold">(-51.3%)</span>
                    )}
                  </span>
                </div>

                <NeuralNetworkDiagram inputCount={activeVariant.inputDim} />

                <div className="mt-3 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-300">
                  <span>Hidden: ReLU + Dropout(0.2)</span>
                  <span>Adam lr=1e-3 · 20 epochs</span>
                </div>
              </div>

              {/* Side-by-Side Comparison Gauges */}
              <div className="space-y-3">
                <MetricComparisonBar
                  label="Trainable Parameters"
                  fullDisplay="4,865"
                  top3Display="2,369"
                  delta="-51.3%"
                  activeKey={ablationKey}
                  fullPct={100}
                  top3Pct={(2369 / 4865) * 100}
                  deltaTone="positive"
                />
                <MetricComparisonBar
                  label="Macro-F1 Score"
                  fullDisplay="0.6904"
                  top3Display="0.6796"
                  delta="-0.0108"
                  activeKey={ablationKey}
                  fullPct={69.04}
                  top3Pct={67.96}
                  deltaTone="neutral"
                />
                <MetricComparisonBar
                  label="ROC-AUC Score"
                  fullDisplay="0.7135"
                  top3Display="0.6401"
                  delta="-0.0734"
                  activeKey={ablationKey}
                  fullPct={71.35}
                  top3Pct={64.01}
                  deltaTone="warning"
                />
                <MetricComparisonBar
                  label="False-Positive Rate (FPR)"
                  fullDisplay="0.6115"
                  top3Display="0.6330"
                  delta="+0.0215"
                  activeKey={ablationKey}
                  fullPct={61.15}
                  top3Pct={63.3}
                  deltaTone="warning"
                />
                <MetricComparisonBar
                  label="Final Training Loss (Epoch 20)"
                  fullDisplay="0.4868"
                  top3Display="0.5218"
                  delta="+0.0350"
                  activeKey={ablationKey}
                  fullPct={48.68}
                  top3Pct={52.18}
                  deltaTone="warning"
                />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex items-start gap-2 text-xs text-slate-600">
              <Cpu className="w-4 h-4 text-[#00809D] shrink-0 mt-0.5" aria-hidden="true" />
              <span>
                <strong>Active input scope:</strong> {activeVariant.featuresList.join(' · ')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NeuralNetworkDiagram({ inputCount }: { inputCount: number }) {
  // Visual node positions for SVG diagram
  const inputNodes = inputCount === 42 ? [18, 40, 62, 84, 106, 128] : [45, 73, 101];
  const hidden1Nodes = [16, 38, 60, 82, 104, 126];
  const hidden2Nodes = [32, 58, 84, 110];
  const outputNode = [71];

  const xInput = 48;
  const xH1 = 165;
  const xH2 = 285;
  const xOut = 392;

  return (
    <svg
      viewBox="0 0 440 152"
      className="w-full h-36 select-none"
      role="img"
      aria-label={`Neural network architecture diagram with ${inputCount} input features, 64 and 32 hidden units, and 1 output logit`}
    >
      {/* Edges Input -> H1 */}
      {inputNodes.map((y1, i) =>
        hidden1Nodes.map((y2, j) => (
          <line
            key={`in-h1-${i}-${j}`}
            x1={xInput}
            y1={y1}
            x2={xH1}
            y2={y2}
            stroke="#00809D"
            strokeOpacity={inputCount === 42 ? 0.28 : 0.55}
            strokeWidth={inputCount === 42 ? 1 : 1.3}
            className="transition-all duration-300"
          />
        ))
      )}

      {/* Edges H1 -> H2 */}
      {hidden1Nodes.map((y1, i) =>
        hidden2Nodes.map((y2, j) => (
          <line
            key={`h1-h2-${i}-${j}`}
            x1={xH1}
            y1={y1}
            x2={xH2}
            y2={y2}
            stroke="#5BC4DC"
            strokeOpacity={0.28}
            strokeWidth={1}
          />
        ))
      )}

      {/* Edges H2 -> Out */}
      {hidden2Nodes.map((y1, i) =>
        outputNode.map((y2, j) => (
          <line
            key={`h2-out-${i}-${j}`}
            x1={xH2}
            y1={y1}
            x2={xOut}
            y2={y2}
            stroke="#5BC4DC"
            strokeOpacity={0.55}
            strokeWidth={1.3}
          />
        ))
      )}

      {/* Nodes */}
      {inputNodes.map((y, idx) => (
        <circle
          key={`in-${idx}`}
          cx={xInput}
          cy={y}
          r={inputCount === 42 ? 5.5 : 7}
          fill={inputCount === 3 ? '#00809D' : '#FFFFFF'}
          stroke="#5BC4DC"
          strokeWidth={1.5}
          className="transition-all duration-300"
        />
      ))}

      {hidden1Nodes.map((y, idx) => (
        <circle
          key={`h1-${idx}`}
          cx={xH1}
          cy={y}
          r={5.5}
          fill="#16354E"
          stroke="#5BC4DC"
          strokeWidth={1.5}
        />
      ))}

      {hidden2Nodes.map((y, idx) => (
        <circle
          key={`h2-${idx}`}
          cx={xH2}
          cy={y}
          r={5.5}
          fill="#16354E"
          stroke="#5BC4DC"
          strokeWidth={1.5}
        />
      ))}

      <circle
        cx={xOut}
        cy={outputNode[0]}
        r={8}
        fill="#D93848"
        stroke="#FFFFFF"
        strokeWidth={1.5}
      />

      {/* Layer captions */}
      <text x={xInput} y={146} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
        Input ({inputCount})
      </text>
      <text x={xH1} y={146} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
        Dense (64)
      </text>
      <text x={xH2} y={146} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
        Dense (32)
      </text>
      <text x={xOut} y={146} textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="JetBrains Mono">
        Logit (1)
      </text>
    </svg>
  );
}

interface MetricComparisonBarProps {
  label: string;
  fullDisplay: string;
  top3Display: string;
  delta: string;
  activeKey: 'full' | 'top3';
  fullPct: number;
  top3Pct: number;
  deltaTone: 'positive' | 'warning' | 'neutral';
}

function MetricComparisonBar({
  label,
  fullDisplay,
  top3Display,
  delta,
  activeKey,
  fullPct,
  top3Pct,
  deltaTone,
}: MetricComparisonBarProps) {
  const activePct = activeKey === 'full' ? fullPct : top3Pct;
  const activeVal = activeKey === 'full' ? fullDisplay : top3Display;

  const deltaColor =
    deltaTone === 'positive'
      ? 'text-[#00809D]'
      : deltaTone === 'warning'
        ? 'text-[#D93848]'
        : 'text-slate-600';

  return (
    <div className="p-3 rounded-md bg-[#F8FAFC] border border-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs mb-1.5">
        <span className="font-semibold text-[#0F2537]">{label}</span>
        <div className="flex items-center gap-2 font-mono tabular-nums">
          <span className="text-slate-500">
            {fullDisplay} → <strong className="text-[#0F2537]">{top3Display}</strong>
          </span>
          <span className={`font-semibold ${deltaColor}`}>({delta})</span>
        </div>
      </div>

      <div className="h-2.5 w-full bg-slate-200 rounded-xs overflow-hidden">
        <div
          className={`h-full rounded-xs transition-all duration-300 ${
            activeKey === 'top3' && deltaTone === 'warning'
              ? 'bg-[#D93848]'
              : activeKey === 'top3'
                ? 'bg-[#00809D]'
                : 'bg-[#0F2537]'
          }`}
          style={{ width: `${Math.min(100, Math.max(4, activePct))}%` }}
        />
      </div>

      <div className="mt-1 flex justify-between text-[11px] font-mono text-slate-500">
        <span>Active ({activeKey === 'full' ? '42 feat.' : 'Top-3'}): {activeVal}</span>
      </div>
    </div>
  );
}
