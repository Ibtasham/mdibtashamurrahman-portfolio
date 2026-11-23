import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FlaskConical } from 'lucide-react';
import type {
  ExperimentStage,
  ProjectEntry,
  ResearchDatasetEntry,
  ResearchExperiment,
  ResearchManuscript,
} from '../../types/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  getProjectLinkedExperiments,
  getProjectLinkedStudies,
} from '../../utils/portfolioFilters';
import { SurfaceCard } from '../ui/SurfaceCard';

interface ProjectValidationSectionProps {
  project: ProjectEntry;
  experiments: ResearchExperiment[];
  manuscripts: ResearchManuscript[];
  datasets: ResearchDatasetEntry[];
}

type StageFilter = 'all' | ExperimentStage;

export function ProjectValidationSection({
  project,
  experiments,
  manuscripts,
  datasets,
}: ProjectValidationSectionProps) {
  const [stageFilter, setStageFilter] = useState<StageFilter>('all');

  const linkedExperiments = useMemo(
    () => getProjectLinkedExperiments(project.id, experiments),
    [project.id, experiments],
  );
  const linkedStudies = useMemo(
    () => getProjectLinkedStudies(project.id, manuscripts),
    [project.id, manuscripts],
  );

  const visibleExperiments = useMemo(
    () =>
      stageFilter === 'all'
        ? linkedExperiments
        : linkedExperiments.filter((exp) => exp.stage === stageFilter),
    [linkedExperiments, stageFilter],
  );

  const relevantDatasets = useMemo(() => {
    if (project.id === 'forgemind-ai') {
      return datasets.filter((d) => d.id === 'ds-cmapss' || d.id === 'ds-femto');
    }
    if (project.id === 'factorymind') {
      return datasets.filter((d) => d.id === 'ds-grids' || d.id === 'ds-m5');
    }
    return [];
  }, [datasets, project.id]);

  return (
    <div className="space-y-6">
      <p className={DESIGN_TOKENS.typography.body}>
        {project.caseStudy.testingValidationSummary}
      </p>

      {/* Structured Validation Audit Table */}
      <SurfaceCard className="overflow-hidden p-0">
        <div className="border-b border-slate-200 dark:border-slate-800/80 px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
          <h3 className={DESIGN_TOKENS.typography.cardTitle}>
            Verification &amp; Validation Ledger
          </h3>
          <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
            Evidence-Bounded Record ({project.caseStudy.validationRecords.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060b16] font-mono text-[11px] text-slate-600 dark:text-slate-400">
                <th scope="col" className="px-5 py-3 font-medium">
                  Method / Protocol
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Evaluation Scope
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Status
                </th>
                <th scope="col" className="px-5 py-3 font-medium">
                  Recorded Evidence
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800/80">
              {project.caseStudy.validationRecords.map((rec) => {
                const glyph =
                  rec.status === 'Verified'
                    ? '●'
                    : rec.status === 'Active Experiment'
                      ? '◐'
                      : rec.status === 'Planned'
                        ? '○'
                        : '◌';
                const statusColor =
                  rec.status === 'Verified'
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : rec.status === 'Active Experiment'
                      ? 'text-cyan-700 dark:text-cyan-300'
                      : 'text-slate-600 dark:text-slate-400';

                return (
                  <tr
                    key={rec.id}
                    className="align-top text-slate-700 dark:text-slate-300"
                  >
                    <td className="px-5 py-3.5 font-medium text-slate-900 dark:text-slate-100">
                      {rec.method}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">
                      {rec.scope}
                    </td>
                    <td className={`px-5 py-3.5 font-mono text-[11px] whitespace-nowrap ${statusColor}`}>
                      {glyph} {rec.status}
                    </td>
                    <td className="px-5 py-3.5 leading-relaxed">
                      {rec.evidenceSummary}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </SurfaceCard>

      {/* Empirical Research Experiments & Public Benchmarks (e.g., ForgeMind AI C-MAPSS / FactoryMind Optimization) */}
      {linkedExperiments.length > 0 && (
        <SurfaceCard className="p-5 sm:p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                <FlaskConical className="h-4 w-4" aria-hidden="true" />
                <span>
                  {project.id === 'forgemind-ai'
                    ? 'Verified Prognostic Benchmark Matrix (Zero Synthetic Charts)'
                    : 'Connected Research Benchmark Matrix'}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Empirical tracks grounded strictly in verified project &amp; manuscript records. Quantitative RMSE and cost-sensitivity tables will publish once companion manuscripts complete review.
              </p>
            </div>

            <div
              role="group"
              aria-label="Filter connected experiments by stage"
              className="flex flex-wrap gap-1.5"
            >
              {(
                [
                  { id: 'all', label: `All (${linkedExperiments.length})` },
                  {
                    id: 'completed',
                    label: `Completed (${linkedExperiments.filter((e) => e.stage === 'completed').length})`,
                  },
                  {
                    id: 'ongoing',
                    label: `Ongoing (${linkedExperiments.filter((e) => e.stage === 'ongoing').length})`,
                  },
                  {
                    id: 'proposed',
                    label: `Proposed (${linkedExperiments.filter((e) => e.stage === 'proposed').length})`,
                  },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={stageFilter === item.id}
                  onClick={() => setStageFilter(item.id)}
                  className={`min-h-[32px] rounded-[8px] border px-2.5 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    stageFilter === item.id
                      ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#060b16] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {visibleExperiments.map((exp) => {
              const glyph =
                exp.stage === 'completed'
                  ? '●'
                  : exp.stage === 'ongoing'
                    ? '◐'
                    : '○';
              return (
                <div
                  key={exp.id}
                  className="rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-50/70 dark:bg-[#060b16] p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                    <span className="text-cyan-700 dark:text-cyan-400">
                      {glyph} {exp.stageLabel}
                    </span>
                    <span className="text-slate-500">{exp.dataset}</span>
                  </div>
                  <h4 className="font-display text-sm font-semibold text-slate-950 dark:text-slate-50">
                    {exp.title}
                  </h4>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                    {exp.summary}
                  </p>
                  {exp.relatedStudyId && (
                    <Link
                      to={`/research/${exp.relatedStudyId}`}
                      className="inline-flex items-center gap-1 pt-1 font-mono text-[11px] text-blue-700 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200"
                    >
                      <span>Inspect Companion Study</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {relevantDatasets.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 space-y-2.5">
              <p className="font-mono text-[11px] text-slate-500">
                Public Benchmark Datasets Used
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {relevantDatasets.map((ds) => (
                  <div
                    key={ds.id}
                    className="rounded-[8px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] p-3 space-y-1"
                  >
                    <p className="font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                      {ds.name}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {ds.scope} — {ds.usage}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {linkedStudies.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs">
              <span className="font-mono text-[11px] text-slate-500">
                Manuscripts in Preparation:
              </span>
              {linkedStudies.map((study) => (
                <Link
                  key={study.id}
                  to={`/research/${study.id}`}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-700 dark:text-cyan-300 hover:underline"
                >
                  <span>{study.datasetsOrBenchmarks} Study</span>
                  <ArrowRight className="h-3 w-3" aria-hidden="true" />
                </Link>
              ))}
            </div>
          )}
        </SurfaceCard>
      )}
    </div>
  );
}
