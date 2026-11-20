import { ExternalLink, BookOpen } from 'lucide-react';
import { KPI_METRICS, PAPER_META } from '../data/researchData';

export function HeroSection() {
  return (
    <section id="top" className="relative">
      {/* Deep Cyber Navy Hero Banner */}
      <div className="bg-[#0F2537] text-white pt-12 pb-16 sm:pt-14 sm:pb-20 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <p className="text-xs sm:text-sm font-medium text-[#5BC4DC] tracking-wide mb-3">
              IEEE Research Showcase · IoT-23 Empirical Benchmark · Explainable AI
            </p>
            <h1 className="text-2xl sm:text-3xl lg:text-[2.25rem] font-bold leading-tight tracking-tight text-white [text-wrap:balance]">
              {PAPER_META.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-300">
              <span className="font-semibold text-white">{PAPER_META.authors}</span>
              <span aria-hidden="true" className="text-slate-500">
                ·
              </span>
              <span>{PAPER_META.affiliation}</span>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href={PAPER_META.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-5 py-2.5 text-sm font-semibold text-white bg-[#00809D] hover:bg-[#006D87] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                <BookOpen className="w-4 h-4" aria-hidden="true" />
                <span>View Code &amp; LaTeX on GitHub</span>
                <ExternalLink className="w-4 h-4" aria-hidden="true" />
              </a>
              <a
                href="#pipeline"
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-200 hover:text-white border border-white/20 hover:border-white/40 rounded-md transition-colors whitespace-nowrap shrink-0"
              >
                Explore 6-Stage Methodology
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 4 High-Impact KPI Summary Cards directly below header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {KPI_METRICS.map((kpi) => {
            const topBarColor =
              kpi.accent === 'coral'
                ? 'bg-[#D93848]'
                : kpi.accent === 'teal'
                  ? 'bg-[#00809D]'
                  : 'bg-[#0F2537]';

            const valueColor =
              kpi.accent === 'coral'
                ? 'text-[#D93848]'
                : kpi.accent === 'teal'
                  ? 'text-[#00809D]'
                  : 'text-[#0F2537]';

            return (
              <div
                key={kpi.id}
                className="bg-white rounded-lg border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div className={`h-1 w-full ${topBarColor}`} aria-hidden="true" />
                <div className="p-5">
                  <p className="text-xs font-semibold text-slate-500 tracking-wide">
                    {kpi.label}
                  </p>
                  <p
                    className={`mt-2 text-2xl sm:text-3xl font-bold font-mono tabular-nums tracking-tight ${valueColor}`}
                  >
                    {kpi.value}
                  </p>
                  <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                    {kpi.context}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
