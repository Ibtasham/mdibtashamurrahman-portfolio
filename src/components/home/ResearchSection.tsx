import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  Database,
  FileText,
  FlaskConical,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import {
  ACADEMIC_INTERESTS,
  PROFILE,
  RESEARCH_DATASETS,
  RESEARCH_EXPERIMENTS,
  RESEARCH_MANUSCRIPTS,
  RESEARCH_METHODOLOGY,
  RESEARCH_NOTES,
  RESEARCH_PROFILE_META,
  RESEARCH_PUBLISHED_RECORDS,
  RESEARCH_TOOL_GROUPS,
} from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { resolveStudioModelId } from '../../three/studioConfig';
import type { ExperimentStage, ResearchManuscript } from '../../types/portfolio';
import {
  buildManuscriptBibTeX,
  countResearchExperimentsByStage,
  filterResearchByDomain,
  filterResearchExperiments,
  type ExperimentStageFilter,
} from '../../utils/portfolioFilters';
import { ResearchMetricsPanel } from '../research/ResearchMetricsPanel';
import { ResearchPipelineDiagram } from '../research/ResearchPipelineDiagram';
import { Button, LinkButton } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { SectionHeading } from '../ui/SectionHeading';
import { SurfaceCard } from '../ui/SurfaceCard';

interface ResearchSectionProps {
  expanded?: boolean;
}

type OverviewTabId = 'summary' | 'methodology' | 'limitations';

const EXPERIMENT_STAGE_TABS: { id: ExperimentStageFilter; label: string }[] = [
  { id: 'all', label: 'All Tracks' },
  { id: 'completed', label: 'Completed Setups' },
  { id: 'ongoing', label: 'Ongoing Work' },
  { id: 'proposed', label: 'Proposed Extensions' },
];

function StageIcon({ stage }: { stage: ExperimentStage }) {
  if (stage === 'completed') {
    return (
      <CheckCircle2
        className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
        aria-hidden="true"
      />
    );
  }
  if (stage === 'ongoing') {
    return (
      <Activity
        className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400"
        aria-hidden="true"
      />
    );
  }
  return (
    <FlaskConical
      className="h-3.5 w-3.5 text-wood-muted dark:text-slate-400"
      aria-hidden="true"
    />
  );
}

export function ResearchSection({ expanded = false }: ResearchSectionProps) {
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [experimentStage, setExperimentStage] =
    useState<ExperimentStageFilter>('all');
  const [expandedStudySpecs, setExpandedStudySpecs] = useState<Record<string, boolean>>({});
  const [activePaper, setActivePaper] = useState<ResearchManuscript | null>(null);
  const [overviewTab, setOverviewTab] = useState<OverviewTabId>('summary');
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

  const handleOpenOverview = (paper: ResearchManuscript, tab: OverviewTabId = 'summary') => {
    setOverviewTab(tab);
    setActivePaper(paper);
  };

  const handleCopyBibtex = async (paper: ResearchManuscript) => {
    try {
      await navigator.clipboard.writeText(buildManuscriptBibTeX(paper, PROFILE.name));
      setCopiedBibtexId(paper.id);
      window.setTimeout(() => setCopiedBibtexId(null), 2000);
    } catch {
      setCopiedBibtexId(null);
    }
  };

  const toggleStudySpecs = (id: string) => {
    setExpandedStudySpecs((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const domains = useMemo(
    () => ['All', ...Array.from(new Set(RESEARCH_MANUSCRIPTS.map((r) => r.domain)))],
    [],
  );

  const visibleManuscripts = useMemo(
    () => filterResearchByDomain(RESEARCH_MANUSCRIPTS, selectedDomain),
    [selectedDomain],
  );

  const experimentCounts = useMemo(
    () => countResearchExperimentsByStage(RESEARCH_EXPERIMENTS),
    [],
  );

  const visibleExperiments = useMemo(
    () => filterResearchExperiments(RESEARCH_EXPERIMENTS, experimentStage),
    [experimentStage],
  );

  return (
    <section
      id="research"
      className={`relative border-b border-wood-subtle dark:border-slate-800/80 bg-wood-alt dark:bg-[#080e1c] ${
        expanded ? 'py-10 sm:py-14' : DESIGN_TOKENS.spacing.sectionY
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-section-light"
      />

      <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-10`}>
        {!expanded && (
          <SectionHeading
            index="03"
            eyebrow="Research & Ongoing Work"
            title="Predictive Maintenance, Uncertainty & Inventory Decisions"
            description={RESEARCH_PROFILE_META.positioningSummary}
            actionLabel="Full Research Profile"
            actionTo="/research"
          />
        )}

        {/* Academic Integrity & Unpublished Scope Notice */}
        <div className="flex items-start gap-3 rounded-[12px] border border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#0b1222] px-4 py-3.5 text-xs text-wood-muted dark:text-slate-400">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-400"
            aria-hidden="true"
          />
          <p className="leading-relaxed">
            <strong className="font-semibold text-wood-ink dark:text-slate-100">
              Unpublished Benchmark &amp; Simulation Scope:
            </strong>{' '}
            {RESEARCH_PROFILE_META.integrityNotice}
          </p>
        </div>

        {/* Research Profile at a Glance (3 Connected Threads) */}
        <SurfaceCard className="overflow-hidden p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 bg-wood-inset dark:bg-[#060b16] px-5 py-3">
            <span className="font-mono text-xs font-semibold text-wood-ink dark:text-slate-100">
              Research Profile at a Glance · Three Connected Threads
            </span>
            <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
              {RESEARCH_MANUSCRIPTS.length} Unpublished Studies · {RESEARCH_PUBLISHED_RECORDS.length} Published Papers
            </span>
          </div>
          <div className="divide-y divide-wood-subtle dark:divide-slate-800/70">
            {RESEARCH_MANUSCRIPTS.map((study, idx) => (
              <div
                key={study.id}
                className="grid gap-3 px-5 py-3.5 md:grid-cols-12 md:items-center"
              >
                <div className="md:col-span-3 space-y-0.5">
                  <p className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                    THREAD 0{idx + 1} · {study.status.toUpperCase()}
                  </p>
                  <p className="text-xs font-semibold text-wood-ink dark:text-slate-100">
                    {study.domain}
                  </p>
                </div>
                <p className="text-xs text-wood-walnut dark:text-slate-300 md:col-span-5">
                  {study.centralQuestion ?? study.researchQuestions?.[0]}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 md:col-span-4 md:justify-end">
                  <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                    {study.methods.slice(0, 4).join(' · ')}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleOpenOverview(study, 'summary')}
                    className="font-mono text-[11px] font-medium text-blue-700 dark:text-cyan-300 hover:underline cursor-pointer"
                  >
                    Overview →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </SurfaceCard>

        {/* Three Individual Research Cards */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                {expanded ? '01 · Unpublished Research Portfolio' : 'Three Unpublished Research Manuscripts'}
              </p>
              <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                Research Studies &amp; Detailed Overview Panels ({RESEARCH_MANUSCRIPTS.length})
              </h3>
              <p className="font-mono text-xs text-wood-muted dark:text-slate-400">
                Each study preserves its distinct methods, benchmark scope, contribution areas, limitations, and next research steps.
              </p>
            </div>

            {expanded && (
              <div
                role="group"
                aria-label="Filter research by domain"
                className="flex flex-wrap gap-2"
              >
                {domains.map((domain) => {
                  const active = selectedDomain === domain;
                  return (
                    <button
                      key={domain}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedDomain(domain)}
                      className={`min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-wood-subtle bg-wood-surface text-wood-muted hover:border-wood-default hover:text-wood-ink dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {domain}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {visibleManuscripts.length === 0 ? (
            <EmptyState
              title="No Studies in Domain"
              message="No unpublished research studies match the selected filter."
              actionLabel="Show All Three Studies"
              onAction={() => setSelectedDomain('All')}
            />
          ) : (
            <div
              className={`grid ${DESIGN_TOKENS.spacing.gridGap} ${
                visibleManuscripts.length === 3 ? 'lg:grid-cols-3' : 'md:grid-cols-2'
              }`}
            >
              {visibleManuscripts.map((paper, idx) => {
                const isExpanded = expanded || Boolean(expandedStudySpecs[paper.id]);

                return (
                  <SurfaceCard
                    key={paper.id}
                    variant={paper.featuredDirection ? 'accent' : 'interactive'}
                    as="article"
                    className="flex min-w-0 flex-col justify-between p-6"
                  >
                    <div className="space-y-4">
                      {/* Card Index, Status Label & Research Area */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                          <span className="text-cyan-700 dark:text-cyan-400 font-semibold">
                            STUDY 0{idx + 1} · {paper.domain}
                          </span>
                          <span className="rounded-[6px] border border-wood-default dark:border-slate-700/80 bg-wood-inset dark:bg-[#060b16] px-2 py-0.5 text-[10px] font-semibold text-wood-walnut dark:text-slate-300">
                            {paper.status}
                          </span>
                        </div>

                        <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                          {paper.cardTitle ?? paper.title}
                        </h4>

                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {paper.researchArea ?? paper.domain}
                        </p>
                      </div>

                      {/* Public-Facing Summary */}
                      <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                        {paper.abstract}
                      </p>

                      {/* Technical Approach Tags */}
                      <div className="space-y-1.5">
                        <p className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                          TECHNICAL APPROACH &amp; BENCHMARKS
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {paper.methods.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-[6px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] px-2 py-0.5 font-mono text-[10px] text-wood-walnut dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Structured Quick-View Details + Expandable Limitations/Directions */}
                      <dl className="divide-y divide-wood-subtle dark:divide-slate-800/70 border-y border-wood-subtle dark:border-slate-800/70 text-xs">
                        <div className="py-2.5 space-y-1">
                          <dt className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                            RESEARCH PROBLEM
                          </dt>
                          <dd className="leading-relaxed text-wood-walnut dark:text-slate-300">
                            {paper.motivation}
                          </dd>
                        </div>

                        <div className="py-2.5 space-y-1">
                          <dt className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                            BENCHMARK SCOPE
                          </dt>
                          <dd className="font-mono text-[11px] text-wood-ink dark:text-slate-200">
                            {paper.datasetsOrBenchmarks}
                          </dd>
                        </div>

                        {isExpanded && (
                          <>
                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                                CONTRIBUTION AREAS
                              </dt>
                              <dd className="text-wood-walnut dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.contributionAreas ?? [paper.expectedContribution]).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>

                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
                                LIMITATIONS
                              </dt>
                              <dd className="text-wood-walnut dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.limitations ?? []).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>

                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[10px] text-blue-700 dark:text-blue-400">
                                FUTURE RESEARCH DIRECTIONS
                              </dt>
                              <dd className="text-wood-walnut dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.futureDirections ?? []).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() => handleOpenOverview(paper, 'summary')}
                          className="!min-h-[38px] sm:!min-h-[34px] !px-3"
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Overview Panel</span>
                        </Button>

                        <LinkButton
                          to={`/research/${paper.id}`}
                          variant="secondary"
                          size="sm"
                          className="!min-h-[38px] sm:!min-h-[34px] !px-2.5"
                        >
                          <span>Full Study</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </LinkButton>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {!expanded && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-expanded={isExpanded}
                            onClick={() => toggleStudySpecs(paper.id)}
                            className="!px-2 !min-h-[38px] sm:!min-h-[34px] text-wood-walnut dark:text-slate-300"
                          >
                            <span>{isExpanded ? 'Compact' : 'Limits & Next'}</span>
                          </Button>
                        )}
                        <LinkButton
                          to={`/studio?model=${resolveStudioModelId(paper.id)}`}
                          variant="ghost"
                          size="sm"
                          className="!min-h-[38px] sm:!min-h-[34px] !px-2 text-cyan-700 dark:text-cyan-300"
                        >
                          <Box className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>3D</span>
                        </LinkButton>
                      </div>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          )}

          {/* Published Research Disclosure (Zero Fabricated Claims) */}
          <SurfaceCard className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-mono text-xs text-wood-ink dark:text-slate-200">
                Published Research ({RESEARCH_PUBLISHED_RECORDS.length} · Peer-Reviewed / Preprints)
              </p>
              <p className="text-xs text-wood-muted dark:text-slate-400">
                No peer-reviewed journal articles, conference proceedings, DOIs, or acceptance claims are published. All three studies above remain Unpublished Research based on benchmark and simulation experiments.
              </p>
            </div>
            <span className="font-mono text-xs text-wood-muted dark:text-slate-400 tabular-nums shrink-0">
              {RESEARCH_PUBLISHED_RECORDS.length} Published Records
            </span>
          </SurfaceCard>
        </div>

        {/* Conceptual Methodology Visualization */}
        <ResearchPipelineDiagram />

        {/* Expanded Research Profile Sections (/research route) */}
        {expanded && (
          <div className="space-y-5 border-t border-wood-subtle dark:border-slate-800/80 pt-10">
            <div className="space-y-1">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                02 · Research Positioning &amp; Core Inquiry Tracks
              </p>
              <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                Research Focus Areas
              </h3>
              <p className="text-sm text-wood-muted dark:text-slate-400 max-w-3xl">
                {RESEARCH_PROFILE_META.positioningTitle} — {RESEARCH_PROFILE_META.positioningSummary}
              </p>
            </div>

            <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-3`}>
              {ACADEMIC_INTERESTS.map((interest) => (
                <SurfaceCard key={interest.id} className="min-w-0 p-6 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                    <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                      {interest.title}
                    </h4>
                    <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                      {interest.domain}
                    </span>
                  </div>
                  <p className={DESIGN_TOKENS.typography.bodyMuted}>
                    {interest.summary}
                  </p>
                  <p className="font-mono text-[11px] text-wood-walnut dark:text-slate-300">
                    {interest.topics.join(' · ')}
                  </p>
                </SurfaceCard>
              ))}
            </div>
          </div>
        )}

        {/* Experimental Pipeline Tracker + Stage Counts */}
        {expanded && (
          <div className="space-y-6 border-t border-wood-subtle dark:border-slate-800/80 pt-10">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-1">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  03 · Experimental &amp; Ongoing Work Tracker
                </p>
                <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                  Completed Setups, Ongoing Evaluations &amp; Future Extensions
                </h3>
                <p className="text-xs text-wood-muted dark:text-slate-400 sm:text-sm">
                  Separating benchmark setups from ongoing analysis and proposed future extensions—keeping confidential numerical findings unpublished.
                </p>
              </div>

              <div
                role="group"
                aria-label="Filter experiments by execution stage"
                className="flex flex-wrap gap-2"
              >
                {EXPERIMENT_STAGE_TABS.map((tab) => {
                  const active = experimentStage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setExperimentStage(tab.id)}
                      className={`min-h-[40px] sm:min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-wood-subtle bg-wood-surface text-wood-muted hover:border-wood-default hover:text-wood-ink dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label} ({experimentCounts[tab.id]})
                    </button>
                  );
                })}
              </div>
            </div>

            <ResearchMetricsPanel />

            {visibleExperiments.length === 0 ? (
              <EmptyState
                title="No Matching Tracks"
                message="Switch to All Tracks to inspect completed setups, ongoing work, and proposed extensions."
                actionLabel="Show All Tracks"
                onAction={() => setExperimentStage('all')}
              />
            ) : (
              <div
                id="research-experiments-panel"
                className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2`}
              >
                {visibleExperiments.map((exp) => (
                  <SurfaceCard
                    key={exp.id}
                    as="article"
                    variant={exp.stage === 'completed' ? 'accent' : 'interactive'}
                    className="flex min-w-0 flex-col justify-between p-5 space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
                        <span className="inline-flex items-center gap-1.5 text-wood-ink dark:text-slate-200">
                          <StageIcon stage={exp.stage} />
                          <span>{exp.stageLabel}</span>
                        </span>
                        <span className="text-cyan-700 dark:text-cyan-400">
                          {exp.domain}
                        </span>
                      </div>

                      <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                        {exp.title}
                      </h4>

                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {exp.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-wood-subtle dark:border-slate-800/80 pt-3 font-mono text-[11px]">
                      <span className="text-wood-muted dark:text-slate-400">
                        {exp.dataset}
                      </span>
                      {exp.relatedStudyId && (
                        <Link
                          to={`/research/${exp.relatedStudyId}`}
                          className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                          <span>Study Overview</span>
                          <ArrowRight className="h-3 w-3" aria-hidden="true" />
                        </Link>
                      )}
                    </div>
                  </SurfaceCard>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Datasets + Methodology Protocol */}
        {expanded && (
          <div className="grid gap-10 border-t border-wood-subtle dark:border-slate-800/80 pt-10 lg:grid-cols-12">
            <div className="min-w-0 space-y-5 lg:col-span-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <Database className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>04 · Public Benchmarks &amp; Simulation Panels</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Datasets Evaluated Across Studies
                </h3>
              </div>

              <div className="space-y-3">
                {RESEARCH_DATASETS.map((ds) => (
                  <SurfaceCard
                    key={ds.id}
                    variant={ds.featured ? 'accent' : 'default'}
                    className="p-4 space-y-1.5"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h4 className="text-sm font-semibold text-wood-ink dark:text-slate-100">
                        {ds.name}
                      </h4>
                      <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {ds.featured ? 'Primary Prognostics Benchmark' : ds.domain}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                      {ds.scope}
                    </p>
                    <p className="text-xs text-wood-walnut dark:text-slate-300">
                      {ds.usage}
                    </p>
                  </SurfaceCard>
                ))}
              </div>
            </div>

            <div className="min-w-0 space-y-5 lg:col-span-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <FlaskConical className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>05 · Shared Evaluation Protocol</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Decision-Centric Methodology Principles
                </h3>
              </div>

              <div className="space-y-3">
                {RESEARCH_METHODOLOGY.map((step) => (
                  <SurfaceCard key={step.step} className="p-4 space-y-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                        {step.step}
                      </span>
                      <h4 className="text-sm font-semibold text-wood-ink dark:text-slate-100">
                        {step.title}
                      </h4>
                    </div>
                    <p className={DESIGN_TOKENS.typography.bodyMuted}>
                      {step.description}
                    </p>
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Research Tools + Research Thread Notes */}
        {expanded && (
          <div className="space-y-10 border-t border-wood-subtle dark:border-slate-800/80 pt-10">
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>06 · Technical Approaches &amp; Analytical Stack</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Methods Across the Three Studies
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {RESEARCH_TOOL_GROUPS.map((group) => (
                  <SurfaceCard key={group.category} className="p-5 space-y-2.5">
                    <h4 className="font-mono text-xs font-semibold text-wood-ink dark:text-slate-200">
                      {group.category}
                    </h4>
                    <p className="font-mono text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                      {group.tools.join(' · ')}
                    </p>
                  </SurfaceCard>
                ))}
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>07 · Key Motivations Across Research Threads</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Central Analytical Questions
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {RESEARCH_NOTES.map((note) => (
                  <SurfaceCard
                    key={note.id}
                    variant="interactive"
                    className="flex flex-col justify-between p-5 space-y-3"
                  >
                    <div className="space-y-2">
                      <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {note.dateLabel}
                      </p>
                      <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                        {note.title}
                      </h4>
                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {note.summary}
                      </p>
                    </div>
                    {note.relatedStudyId && (
                      <Link
                        to={`/research/${note.relatedStudyId}`}
                        className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 sm:pt-2 font-mono text-xs text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                      >
                        <span>Open Study Page</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collaboration Interests + Future Directions */}
        {expanded && (
          <div className="grid gap-6 border-t border-wood-subtle dark:border-slate-800/80 pt-10 lg:grid-cols-2">
            <SurfaceCard className="p-6 space-y-5">
              <div className="space-y-1.5">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  08 · Collaboration Interests
                </p>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Openness to Mentored &amp; Benchmark Research Collaboration
                </h3>
                <p className={DESIGN_TOKENS.typography.bodyMuted}>
                  {RESEARCH_PROFILE_META.collaborationSummary}
                </p>
              </div>

              <ul className="divide-y divide-wood-subtle dark:divide-slate-800/70 border-t border-wood-subtle dark:border-slate-800/70">
                {RESEARCH_PROFILE_META.collaborationTracks.map((track) => (
                  <li key={track.title} className="py-3 space-y-1">
                    <p className="text-xs font-semibold text-wood-ink dark:text-slate-100 sm:text-sm">
                      {track.title}
                    </p>
                    <p className="text-xs text-wood-muted dark:text-slate-400">
                      {track.detail}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="pt-1">
                <a
                  href={`mailto:${PROFILE.email}?subject=Research%20Collaboration%20Inquiry`}
                  className="inline-flex min-h-[38px] items-center gap-2 rounded-[10px] bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#3b82f6]"
                >
                  <span>Initiate Research Correspondence</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-6 space-y-5">
              <div className="space-y-1.5">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  09 · Future Research Directions
                </p>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Next-Stage Methodological &amp; Validation Roadmap
                </h3>
                <p className={DESIGN_TOKENS.typography.bodyMuted}>
                  Planned extensions identified directly from the limitations of the three unpublished studies.
                </p>
              </div>

              <ul className="divide-y divide-wood-subtle dark:divide-slate-800/70 border-t border-wood-subtle dark:border-slate-800/70">
                {RESEARCH_PROFILE_META.futureDirections.map((dir) => (
                  <li key={dir.title} className="py-3 space-y-1">
                    <p className="text-xs font-semibold text-wood-ink dark:text-slate-100 sm:text-sm">
                      {dir.title}
                    </p>
                    <p className="text-xs text-wood-muted dark:text-slate-400">
                      {dir.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </div>
        )}
      </div>

      {/* Detailed Research Overview Panel Modal */}
      <Modal
        open={activePaper !== null}
        onClose={() => setActivePaper(null)}
        title={activePaper?.cardTitle ?? activePaper?.title ?? ''}
        subtitle={
          activePaper
            ? `${activePaper.researchArea ?? activePaper.domain} · ${activePaper.status}`
            : undefined
        }
      >
        {activePaper && (
          <div className="space-y-5 text-sm text-wood-walnut dark:text-slate-300">
            {/* Overview Panel Navigation Tabs */}
            <div
              role="tablist"
              aria-label="Detailed research overview sections"
              className="flex flex-wrap gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3"
            >
              {(
                [
                  { id: 'summary', label: 'Summary & Problem' },
                  { id: 'methodology', label: 'Methodology & Approaches' },
                  { id: 'limitations', label: 'Contributions, Limits & Future' },
                ] as const
              ).map((tab) => {
                const active = overviewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setOverviewTab(tab.id)}
                    className={`min-h-[36px] rounded-[8px] border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-cyan-400/70 dark:bg-blue-600/20 dark:text-cyan-200'
                        : 'border-wood-subtle bg-wood-inset text-wood-muted hover:text-wood-ink dark:border-slate-800 dark:bg-[#060b16] dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {overviewTab === 'summary' && (
              <div className="space-y-4">
                {activePaper.workingTitle && (
                  <div className="rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-3.5 space-y-1">
                    <p className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                      WORKING MANUSCRIPT TITLE · {activePaper.status.toUpperCase()}
                    </p>
                    <p className="text-xs font-semibold leading-relaxed text-wood-ink dark:text-slate-100">
                      {activePaper.workingTitle}
                    </p>
                  </div>
                )}

                <div className="space-y-1.5">
                  <h4 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Public-Facing Summary
                  </h4>
                  <p className={DESIGN_TOKENS.typography.editorialAbstract}>
                    {activePaper.abstract}
                  </p>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-mono text-xs text-blue-700 dark:text-blue-400">
                    Research Problem &amp; Motivation
                  </h4>
                  <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {activePaper.motivation}
                  </p>
                </div>

                <div className="grid gap-4 border-y border-wood-subtle dark:border-slate-800/80 py-3.5 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                      CENTRAL RESEARCH QUESTION
                    </p>
                    <p className="mt-1 text-xs font-medium text-wood-ink dark:text-slate-200">
                      {activePaper.centralQuestion ?? activePaper.researchQuestions?.[0]}
                    </p>
                  </div>
                  <div>
                    <p className="font-mono text-[10px] text-wood-muted dark:text-slate-500">
                      DATASETS &amp; BENCHMARKS
                    </p>
                    <p className="mt-1 font-mono text-xs text-wood-ink dark:text-slate-200">
                      {activePaper.datasetsOrBenchmarks}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {overviewTab === 'methodology' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Technical Approaches &amp; Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activePaper.methods.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-[6px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] px-2.5 py-1 font-mono text-[11px] text-wood-walnut dark:text-slate-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="font-mono text-xs text-blue-700 dark:text-blue-400">
                    Study Scope &amp; Methodology Steps
                  </p>
                  <ol className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {(activePaper.methodologySteps ?? []).map((step, i) => (
                      <li
                        key={step}
                        className="rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-3"
                      >
                        <span className="font-mono text-[11px] font-semibold text-cyan-700 dark:text-cyan-400 mr-2">
                          0{i + 1}.
                        </span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>

                <ResearchPipelineDiagram studyId={activePaper.id} />
              </div>
            )}

            {overviewTab === 'limitations' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Contribution Areas to Communicate
                  </p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {(activePaper.contributionAreas ?? [activePaper.expectedContribution]).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[10px] border border-amber-500/35 bg-amber-100/55 dark:bg-amber-950/15 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-amber-800 dark:text-amber-300">
                    <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Declared Limitations &amp; Scope Boundaries</span>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {(activePaper.limitations ?? []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[10px] border border-blue-500/35 bg-blue-100/45 dark:bg-blue-950/15 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs text-blue-800 dark:text-blue-300">
                    <Compass className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span>Future Research Directions</span>
                  </div>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {(activePaper.futureDirections ?? []).map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="border-t border-wood-subtle dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-wood-muted dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <span>Status: {activePaper.status} (Benchmark / Simulation Study)</span>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => void handleCopyBibtex(activePaper)}
                  className="!min-h-[38px] sm:!min-h-[32px] !px-2.5 !py-1"
                >
                  {copiedBibtexId === activePaper.id ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                      <span>Copied @unpublished BibTeX</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Copy Working BibTeX</span>
                    </>
                  )}
                </Button>
              </div>
              <LinkButton
                to={`/research/${activePaper.id}`}
                variant="primary"
                size="sm"
                onClick={() => setActivePaper(null)}
              >
                <span>Open Full Research Page</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
