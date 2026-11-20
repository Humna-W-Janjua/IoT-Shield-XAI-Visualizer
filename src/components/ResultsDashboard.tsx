import { useMemo, useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Info,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  MODEL_RESULTS,
  BASE_PAPERS_CONTEXT,
  type ModelResult,
} from '../data/researchData';

type ViewMode = 'all' | 'accuracy_fpr' | 'latency';
type SortKey = 'model' | 'macroF1' | 'rocAuc' | 'fpr' | 'inferenceMs';

const SHORT_MODEL_LABELS: Record<string, string> = {
  logreg: 'LogReg (42)',
  rf: 'Random Forest',
  xgb: 'XGBoost',
  lgbm: 'LightGBM',
  mlp42: 'MLP (42 feat.)',
  mlp3: 'MLP (Top-3)',
};

export function ResultsDashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [sortKey, setSortKey] = useState<SortKey>('macroF1');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [basePapersOpen, setBasePapersOpen] = useState<boolean>(false);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir(key === 'fpr' || key === 'inferenceMs' || key === 'model' ? 'asc' : 'desc');
    }
  };

  const sortedResults = useMemo(() => {
    return [...MODEL_RESULTS].sort((a, b) => {
      if (sortKey === 'model') {
        return sortDir === 'asc'
          ? a.model.localeCompare(b.model)
          : b.model.localeCompare(a.model);
      }
      const valA = a[sortKey] ?? 0.00005;
      const valB = b[sortKey] ?? 0.00005;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
  }, [sortKey, sortDir]);

  const chartData = useMemo(
    () =>
      MODEL_RESULTS.map((item) => ({
        id: item.id,
        shortName: SHORT_MODEL_LABELS[item.id] ?? item.model,
        fullName: item.model,
        macroF1: item.macroF1,
        rocAuc: item.rocAuc,
        fpr: item.fpr,
        // Plot <res. (<0.0001 ms) as a tiny visible baseline 0.00008 ms with custom tooltip
        inferencePlot: item.inferenceMs ?? 0.00008,
        inferenceDisplay: item.inferenceDisplay,
      })),
    []
  );

  return (
    <section id="results" className="py-14 sm:py-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header + View Toggles */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold text-[#00809D] tracking-wide mb-1.5">
              02. Empirical Evaluation
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2537] tracking-tight">
              Experimental Results &amp; Model Comparison
            </h2>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              Evaluated on the held-out <span className="font-mono font-semibold text-[#0F2537]">15,000-flow</span>{' '}
              test split (seed <span className="font-mono">42</span>) preserving realistic{' '}
              <span className="font-mono font-semibold text-[#0F2537]">11.5%</span> benign traffic skew.
            </p>
          </div>

          {/* Segmented View Toggle */}
          <div
            role="group"
            aria-label="Results view mode"
            className="inline-flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg self-start lg:self-auto"
          >
            {(
              [
                { id: 'all', label: 'All Metrics' },
                { id: 'accuracy_fpr', label: 'Accuracy vs. False Alarms' },
                { id: 'latency', label: 'Inference Latency' },
              ] as const
            ).map((tab) => {
              const active = viewMode === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setViewMode(tab.id)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D] ${
                    active
                      ? 'bg-[#00809D] text-white'
                      : 'text-slate-600 hover:text-[#0F2537] hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Charts Grid */}
        <div
          className={`grid gap-6 mb-8 ${
            viewMode === 'all'
              ? 'grid-cols-1 lg:grid-cols-3'
              : viewMode === 'accuracy_fpr'
                ? 'grid-cols-1 lg:grid-cols-2'
                : 'grid-cols-1'
          }`}
        >
          {/* Chart 1: Macro-F1 & ROC-AUC */}
          {(viewMode === 'all' || viewMode === 'accuracy_fpr') && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-[#0F2537]">
                  Macro-F1 &amp; ROC-AUC Score
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Higher is better · LightGBM leads Macro-F1 (0.9106)
                </p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -12, bottom: 28 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="shortName"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={56}
                      tick={{ fontSize: 11, fill: '#334155' }}
                    />
                    <YAxis domain={[0.5, 1.0]} tick={{ fontSize: 11, fill: '#334155' }} />
                    <Tooltip
                      formatter={(val) => Number(val ?? 0).toFixed(4)}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
                    <Bar dataKey="macroF1" name="Macro-F1" fill="#00809D" radius={[3, 3, 0, 0]} />
                    <Bar dataKey="rocAuc" name="ROC-AUC" fill="#0F2537" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Chart 2: False-Positive Rate (FPR) */}
          {(viewMode === 'all' || viewMode === 'accuracy_fpr') && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="mb-3">
                <h3 className="text-sm font-bold text-[#0F2537]">
                  False-Positive Rate (FPR)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lower is better · Random Forest achieves lowest FPR (0.2015)
                </p>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -12, bottom: 28 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="shortName"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={56}
                      tick={{ fontSize: 11, fill: '#334155' }}
                    />
                    <YAxis domain={[0, 0.75]} tick={{ fontSize: 11, fill: '#334155' }} />
                    <Tooltip
                      formatter={(val) => [
                        `${(Number(val ?? 0) * 100).toFixed(2)}% (${Number(val ?? 0).toFixed(4)})`,
                        'False-Positive Rate',
                      ]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="fpr" name="FPR" radius={[3, 3, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          fill={entry.fpr < 0.3 ? '#00809D' : '#D93848'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Chart 3: Inference Latency */}
          {(viewMode === 'all' || viewMode === 'latency') && (
            <div className="bg-white rounded-lg border border-slate-200 p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-sm font-bold text-[#0F2537]">
                    Inference Time (ms / sample)
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Lower is faster · Compact MLP (0.0006 ms) is 28× faster than LightGBM
                  </p>
                </div>
                {viewMode === 'latency' && (
                  <span className="text-xs font-mono font-semibold text-[#00809D]">
                    Batch wall-clock across 15,000 test flows
                  </span>
                )}
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: -4, bottom: 28 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis
                      dataKey="shortName"
                      interval={0}
                      angle={-25}
                      textAnchor="end"
                      height={56}
                      tick={{ fontSize: 11, fill: '#334155' }}
                    />
                    <YAxis
                      domain={[0, 0.02]}
                      tickFormatter={(v: number) => `${v.toFixed(3)}`}
                      tick={{ fontSize: 11, fill: '#334155' }}
                    />
                    <Tooltip
                      formatter={(_val, _name, props) => [
                        (props as { payload?: { inferenceDisplay?: string } } | undefined)?.payload
                          ?.inferenceDisplay ?? '',
                        'Latency / Sample',
                      ]}
                      contentStyle={{
                        backgroundColor: '#FFFFFF',
                        borderColor: '#CBD5E1',
                        fontSize: '12px',
                      }}
                    />
                    <Bar dataKey="inferencePlot" name="ms / sample" radius={[3, 3, 0, 0]}>
                      {chartData.map((entry) => (
                        <Cell
                          key={entry.id}
                          fill={
                            entry.id === 'mlp42' || entry.id === 'mlp3' || entry.id === 'logreg'
                              ? '#00809D'
                              : '#0F2537'
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-1 text-[11px] font-mono text-slate-500">
                Note: &lt;res. denotes wall-clock batch inference below timer resolution (&lt;0.0001 ms/sample).
              </p>
            </div>
          )}
        </div>

        {/* Sortable Comparison Table */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden mb-8">
          <div className="px-5 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-[#0F2537]">
                Held-Out Test Benchmark Table (15,000 Flows)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Click any metric column header to sort models ascending or descending.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 tabular-nums">
              Seed: 42 · Benign Skew: 11.5%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0F2537] text-white text-xs font-semibold">
                  <th className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleSort('model')}
                      className="inline-flex items-center gap-1.5 hover:text-[#5BC4DC] cursor-pointer whitespace-nowrap"
                    >
                      <span>Model</span>
                      <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3 px-4 whitespace-nowrap">Family</th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('macroF1')}
                      className="inline-flex items-center justify-end gap-1.5 hover:text-[#5BC4DC] cursor-pointer whitespace-nowrap ml-auto"
                    >
                      <span>Macro-F1</span>
                      <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('rocAuc')}
                      className="inline-flex items-center justify-end gap-1.5 hover:text-[#5BC4DC] cursor-pointer whitespace-nowrap ml-auto"
                    >
                      <span>ROC-AUC</span>
                      <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('fpr')}
                      className="inline-flex items-center justify-end gap-1.5 hover:text-[#5BC4DC] cursor-pointer whitespace-nowrap ml-auto"
                    >
                      <span>FPR</span>
                      <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </th>
                  <th className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => handleSort('inferenceMs')}
                      className="inline-flex items-center justify-end gap-1.5 hover:text-[#5BC4DC] cursor-pointer whitespace-nowrap ml-auto"
                    >
                      <span>Inference Time</span>
                      <ArrowUpDown className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-sm">
                {sortedResults.map((row: ModelResult) => {
                  const highlightRow =
                    (viewMode === 'latency' && row.id === 'mlp42') ||
                    (viewMode !== 'latency' && row.id === 'lgbm');

                  return (
                    <tr
                      key={row.id}
                      className={`transition-colors hover:bg-slate-50 ${
                        highlightRow ? 'bg-[#00809D]/[0.04]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-semibold text-[#0F2537] whitespace-nowrap">
                        {row.model}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-slate-600 whitespace-nowrap">
                        {row.family} · {row.features} feat.
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            row.bestF1 ? 'font-bold text-[#00809D]' : 'text-slate-700'
                          }
                        >
                          {row.macroF1.toFixed(4)}
                        </span>
                        {row.bestF1 && (
                          <span className="ml-1.5 text-[11px] font-sans font-semibold text-[#00809D]">
                            (Best)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            row.bestAuc ? 'font-bold text-[#00809D]' : 'text-slate-700'
                          }
                        >
                          {row.rocAuc.toFixed(4)}
                        </span>
                        {row.bestAuc && (
                          <span className="ml-1.5 text-[11px] font-sans font-semibold text-[#00809D]">
                            (Best)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums whitespace-nowrap">
                        <span
                          className={
                            row.bestFpr
                              ? 'font-bold text-[#00809D]'
                              : row.fpr > 0.5
                                ? 'text-[#D93848] font-medium'
                                : 'text-slate-700'
                          }
                        >
                          {row.fpr.toFixed(4)}
                        </span>
                        {row.bestFpr && (
                          <span className="ml-1.5 text-[11px] font-sans font-semibold text-[#00809D]">
                            (Best)
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-700 whitespace-nowrap">
                        {row.inferenceDisplay}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Collapsible Base Papers Context Card */}
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <button
            type="button"
            onClick={() => setBasePapersOpen((prev) => !prev)}
            aria-expanded={basePapersOpen}
            className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-slate-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D]"
          >
            <div className="flex items-start sm:items-center gap-3">
              <Info className="w-5 h-5 text-[#00809D] shrink-0 mt-0.5 sm:mt-0" aria-hidden="true" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-[#0F2537]">
                  Base Papers Context: Skewed IoT-23 vs. Balanced-Benchmark Studies
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Why natural 11.5% benign skew and multi-scenario IoT-23 traffic yield lower, more realistic scores than 99%+ balanced benchmarks.
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00809D] whitespace-nowrap shrink-0">
              <span>{basePapersOpen ? 'Hide Comparison' : 'Inspect Studies'}</span>
              {basePapersOpen ? (
                <ChevronUp className="w-4 h-4" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-4 h-4" aria-hidden="true" />
              )}
            </span>
          </button>

          {basePapersOpen && (
            <div className="px-5 pb-5 pt-2 border-t border-slate-200 bg-[#F8FAFC]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                {BASE_PAPERS_CONTEXT.map((paper) => (
                  <div
                    key={paper.study}
                    className="bg-white p-4 rounded-md border border-slate-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <h4 className="text-sm font-bold text-[#0F2537]">{paper.study}</h4>
                        <span className="text-xs font-mono font-bold text-[#00809D] tabular-nums">
                          {paper.reportedScore}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {paper.dataset} · {paper.protocol}
                      </p>
                      <p className="mt-3 text-xs text-slate-700 leading-relaxed">
                        {paper.contrastNote}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3.5 rounded-md bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="text-[#0F2537]">Methodological Contrast:</strong> Unlike studies
                reporting 98–99.9% on balanced or homogeneous captures, our held-out IoT-23 test set
                retains the natural <span className="font-mono font-semibold">88.5% / 11.5%</span>{' '}
                attack-to-benign skew without test resampling, making Macro-F1 (
                <span className="font-mono font-semibold text-[#00809D]">0.9106</span>) and FPR (
                <span className="font-mono font-semibold text-[#00809D]">0.2015</span>) far more
                diagnostic of real deployment false-alarm risk.
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
