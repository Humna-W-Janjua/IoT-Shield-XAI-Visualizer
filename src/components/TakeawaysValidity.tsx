import { ShieldAlert, Compass, ExternalLink } from 'lucide-react';
import { PAPER_META, THREATS_TO_VALIDITY } from '../data/researchData';

export function TakeawaysValidity() {
  return (
    <section id="validity" className="py-14 sm:py-16 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-8">
          <p className="text-xs font-semibold text-[#00809D] tracking-wide mb-1.5">
            04. Critical Synthesis &amp; Audit
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#0F2537] tracking-tight">
            Key Takeaways &amp; Threats to Validity
          </h2>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            An honest scientific accounting of why gradient-boosted ensembles outperform our
            untuned Compact MLP on skewed Zeek flows, paired with five methodological boundaries.
          </p>
        </div>

        {/* Honest Scientific Conclusion Card */}
        <div className="bg-[#0F2537] text-white rounded-lg p-6 sm:p-8 mb-8 border border-[#0F2537]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-8">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#5BC4DC] mb-2">
                <Compass className="w-4 h-4" aria-hidden="true" />
                <span>Empirical Conclusion</span>
              </div>
              <h3 className="text-xl font-bold text-white leading-snug">
                Tree Ensembles Dominate Skewed Tabular IoT Flows; Aggressive 3-Feature Pruning Hurts Neural Separation
              </h3>
              <p className="mt-3 text-sm text-slate-200 leading-relaxed">
                On the realistic, heavy-tailed IoT-23 Zeek distribution (88.5% botnet / 11.5% benign),
                gradient-boosted decision trees (<strong className="text-white">LightGBM</strong>{' '}
                with Macro-F1 <span className="font-mono">0.9106</span> and{' '}
                <strong className="text-white">XGBoost</strong> with ROC-AUC{' '}
                <span className="font-mono">0.9467</span>) decisively outperform the untuned
                20-epoch Compact MLP (<span className="font-mono">0.6904</span> Macro-F1,{' '}
                <span className="font-mono">0.6115</span> FPR). Axis-aligned split thresholds
                naturally isolate extreme packet-byte bursts and rare benign combinations without
                requiring extensive epoch budgets or threshold calibration.
              </p>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">
                While the Compact MLP executes <strong className="text-white">28× faster</strong>{' '}
                than LightGBM (<span className="font-mono">0.0006 ms</span> vs.{' '}
                <span className="font-mono">0.0182 ms</span>) and SHAP-guided pruning to{' '}
                <span className="font-mono">orig_ip_bytes</span>,{' '}
                <span className="font-mono">duration</span>, and{' '}
                <span className="font-mono">orig_pkts</span> cuts parameters by{' '}
                <span className="font-mono">51.3%</span> (<span className="font-mono">4,865 → 2,369</span>),
                discarding protocol and connection-state indicators degrades ROC-AUC by{' '}
                <span className="font-mono text-[#FF8A95]">-0.0734</span> and raises false alarms
                to <span className="font-mono text-[#FF8A95]">63.30%</span>.
              </p>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/15 rounded-md p-5 space-y-3">
              <p className="text-xs font-semibold text-[#5BC4DC]">
                Recommended Deployment Guidance
              </p>
              <div className="text-xs text-slate-200 space-y-2.5 leading-relaxed">
                <p>
                  <strong className="text-white">Accuracy &amp; Low FPR:</strong> Deploy{' '}
                  <span className="font-mono">XGBoost</span> (0.0019 ms, 0.9467 AUC) or{' '}
                  <span className="font-mono">Random Forest</span> (0.2015 lowest FPR).
                </p>
                <p>
                  <strong className="text-white">Lightweight Neural Path:</strong> Retain state/history
                  encodings alongside top numeric counters and tune class-weighted thresholds before
                  edge rollout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 5-Card Threats to Validity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {THREATS_TO_VALIDITY.map((threat) => (
            <article
              key={threat.id}
              className="bg-white rounded-lg border border-slate-200 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-mono font-bold text-[#D93848] tabular-nums">
                    Threat 0{threat.id} · {threat.scope}
                  </span>
                  <ShieldAlert
                    className="w-4 h-4 text-[#D93848] shrink-0"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-base font-bold text-[#0F2537]">{threat.title}</h3>
                <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                  {threat.detail}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-[#00809D] mb-1">
                  Audit Response
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {threat.mitigation}
                </p>
              </div>
            </article>
          ))}

          {/* 6th Grid Slot: Reproducibility & Artifact Access */}
          <div className="bg-[#F8FAFC] rounded-lg border border-slate-200 p-5 flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono font-semibold text-[#00809D] mb-2">
                Reproducibility Package
              </p>
              <h3 className="text-base font-bold text-[#0F2537]">
                Open-Source Notebooks, LaTeX &amp; Seed Artifacts
              </h3>
              <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                Complete preprocessing scripts, PyTorch Compact MLP definitions, SHAP computation
                code, and IEEE paper LaTeX sources are publicly archived for independent verification.
              </p>
            </div>
            <div className="mt-5">
              <a
                href={PAPER_META.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0F2537] hover:bg-[#00809D] rounded-md transition-colors whitespace-nowrap"
              >
                <span>Inspect Repository on GitHub</span>
                <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
