import { ExternalLink, ShieldCheck } from 'lucide-react';
import { PAPER_META } from '../data/researchData';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#0F2537] text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element wordmark */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00809D] rounded"
        >
          <ShieldCheck className="w-5 h-5 text-[#00809D]" aria-hidden="true" />
          <span>{PAPER_META.shortName}</span>
        </a>

        {/* Zone 2: Clean single-line text nav links */}
        <nav
          aria-label="Primary sections"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300"
        >
          <a
            href="#pipeline"
            className="hover:text-white hover:underline underline-offset-4 decoration-[#00809D] decoration-2 transition-colors whitespace-nowrap shrink-0"
          >
            Pipeline
          </a>
          <a
            href="#results"
            className="hover:text-white hover:underline underline-offset-4 decoration-[#00809D] decoration-2 transition-colors whitespace-nowrap shrink-0"
          >
            Results
          </a>
          <a
            href="#explainability"
            className="hover:text-white hover:underline underline-offset-4 decoration-[#00809D] decoration-2 transition-colors whitespace-nowrap shrink-0"
          >
            SHAP &amp; Ablation
          </a>
          <a
            href="#validity"
            className="hover:text-white hover:underline underline-offset-4 decoration-[#00809D] decoration-2 transition-colors whitespace-nowrap shrink-0"
          >
            Validity
          </a>
        </nav>

        {/* Zone 3: Single primary action */}
        <div className="shrink-0">
          <a
            href={PAPER_META.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#00809D] hover:bg-[#006D87] rounded-md transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            <span>GitHub Repo</span>
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
