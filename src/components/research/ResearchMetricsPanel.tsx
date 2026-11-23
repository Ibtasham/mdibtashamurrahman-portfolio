import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import {
  RESEARCH_EXPERIMENTS,
  RESEARCH_MANUSCRIPTS,
  RESEARCH_PUBLISHED_RECORDS,
} from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { summarizeResearchPortfolio } from '../../utils/portfolioFilters';
import { SurfaceCard } from '../ui/SurfaceCard';

export function ResearchMetricsPanel() {
  const summary = useMemo(
    () =>
      summarizeResearchPortfolio(
        RESEARCH_MANUSCRIPTS,
        RESEARCH_EXPERIMENTS,
        RESEARCH_PUBLISHED_RECORDS.length,
      ),
    [],
  );

  const totalExperiments =
    summary.totals.completedExperiments +
    summary.totals.ongoingExperiments +
    summary.totals.proposedExperiments;

  const experimentDistribution = [
    {
      label: 'Completed Experiments',
      count: summary.totals.completedExperiments,
      colorClass: 'bg-cyan-600 dark:bg-cyan-400',
      note: 'Baselines & simulations structured',
    },
    {
      label: 'Ongoing Experiments',
      count: summary.totals.ongoingExperiments,
      colorClass: 'bg-blue-600 dark:bg-blue-400',
      note: 'Active evaluation & manuscript prep',
    },
    {
      label: 'Proposed Experiments',
      count: summary.totals.proposedExperiments,
      colorClass: 'bg-slate-400 dark:bg-slate-600',
      note: 'Planned robustness & policy sweeps',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left: Verified Experimental Pipeline Distribution Chart */}
        <SurfaceCard className="p-5 sm:p-6 space-y-5 lg:col-span-5">
          <div className="space-y-1 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
              Source-Verified Experimental Registry
            </p>
            <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
              Execution Stage Distribution ({totalExperiments} Studies)
            </h4>
          </div>

          <div className="space-y-4">
            {experimentDistribution.map((row) => {
              const pct =
                totalExperiments > 0 ? Math.round((row.count / totalExperiments) * 100) : 0;
              return (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-medium text-slate-900 dark:text-slate-100">
                      {row.label}
                    </span>
                    <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
                      {row.count} / {totalExperiments} ({pct}%)
                    </span>
                  </div>
                  <div
                    className="h-2.5 w-full overflow-hidden rounded-[4px] bg-slate-100 dark:bg-[#060b16]"
                    role="progressbar"
                    aria-valuenow={pct}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`${row.label}: ${row.count} of ${totalExperiments}`}
                  >
                    <div
                      className={`h-full rounded-[4px] ${row.colorClass}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="font-mono text-[10px] text-slate-500">{row.note}</p>
                </div>
              );
            })}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 flex items-center justify-between text-xs">
            <span className="text-slate-600 dark:text-slate-400">
              Manuscripts in Preparation: {summary.totals.manuscriptsInPrep}
            </span>
            <span className="font-mono text-slate-700 dark:text-slate-300 tabular-nums">
              Published Papers: {summary.totals.publishedResearch}
            </span>
          </div>
        </SurfaceCard>

        {/* Right: Per-Manuscript Experimental Stage Coverage */}
        <SurfaceCard className="p-5 sm:p-6 space-y-5 lg:col-span-7">
          <div className="space-y-1 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
              Per-Manuscript Stage Tracking
            </p>
            <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
              Completed vs. Ongoing vs. Proposed Tracks by Manuscript
            </h4>
          </div>

          <div className="space-y-4">
            {summary.studyRows.map((row) => {
              const sum = Math.max(
                1,
                row.completedCount + row.ongoingCount + row.proposedCount,
              );
              const compPct = (row.completedCount / sum) * 100;
              const ongPct = (row.ongoingCount / sum) * 100;
              const propPct = (row.proposedCount / sum) * 100;

              return (
                <div key={row.id} className="space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                    <Link
                      to={`/research/${row.id}`}
                      className="inline-flex items-center gap-1 font-semibold text-slate-900 dark:text-slate-100 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      <span>{row.shortTitle}</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                    <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
                      {row.completedCount} Done · {row.ongoingCount} Ongoing ·{' '}
                      {row.proposedCount} Proposed
                    </span>
                  </div>

                  <div className="flex h-2.5 w-full overflow-hidden rounded-[4px] bg-slate-100 dark:bg-[#060b16] gap-px">
                    {row.completedCount > 0 && (
                      <div
                        className="h-full bg-cyan-600 dark:bg-cyan-400"
                        style={{ width: `${compPct}%` }}
                        title={`Completed: ${row.completedCount}`}
                      />
                    )}
                    {row.ongoingCount > 0 && (
                      <div
                        className="h-full bg-blue-600 dark:bg-blue-400"
                        style={{ width: `${ongPct}%` }}
                        title={`Ongoing: ${row.ongoingCount}`}
                      />
                    )}
                    {row.proposedCount > 0 && (
                      <div
                        className="h-full bg-slate-400 dark:bg-slate-600"
                        style={{ width: `${propPct}%` }}
                        title={`Proposed: ${row.proposedCount}`}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-start gap-2.5 rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060b16] p-3 text-xs text-slate-600 dark:text-slate-400">
            <Info
              className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-400"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              Charts above reflect strictly verified pipeline counts from portfolio records. Quantitative accuracy/cost plots (NASA C-MAPSS RMSE, carbon savings deltas, M5 cost rankings) are withheld until empirical result tables are cleared for publication.
            </p>
          </div>
        </SurfaceCard>
      </div>
    </div>
  );
}
