/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PipelineExplorer } from './components/PipelineExplorer';
import { ResultsDashboard } from './components/ResultsDashboard';
import { ExplainabilityAblation } from './components/ExplainabilityAblation';
import { TakeawaysValidity } from './components/TakeawaysValidity';
import { PAPER_META } from './data/researchData';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F2F6FA] text-[#1E293B]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <PipelineExplorer />
        <ResultsDashboard />
        <ExplainabilityAblation />
        <TakeawaysValidity />
      </main>
      <footer className="bg-[#0F2537] text-slate-300 border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
          <div>
            <p className="font-semibold text-white">{PAPER_META.shortName}</p>
            <p className="mt-1 text-slate-400">
              {PAPER_META.authors} · {PAPER_META.affiliation}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <a href="#pipeline" className="hover:text-white transition-colors">
              Pipeline
            </a>
            <a href="#results" className="hover:text-white transition-colors">
              Results
            </a>
            <a href="#explainability" className="hover:text-white transition-colors">
              SHAP &amp; Ablation
            </a>
            <a href="#validity" className="hover:text-white transition-colors">
              Validity
            </a>
            <a
              href={PAPER_META.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#5BC4DC] hover:text-white font-semibold transition-colors"
            >
              GitHub &amp; LaTeX
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
