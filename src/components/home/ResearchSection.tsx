import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Box,
  Check,
  CheckCircle2,
  Copy,
  Database,
  FileText,
  FlaskConical,
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

const EXPERIMENT_STAGE_TABS: { id: ExperimentStageFilter; label: string }[] = [
  { id: 'all', label: 'All Experiments' },
  { id: 'completed', label: 'Completed' },
  { id: 'ongoing', label: 'Ongoing' },
  { id: 'proposed', label: 'Proposed' },
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
      className="h-3.5 w-3.5 text-slate-600 dark:text-slate-400"
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
  const [copiedBibtexId, setCopiedBibtexId] = useState<string | null>(null);

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
      className={`relative border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/70 dark:bg-[#080e1c] ${
        expanded ? 'py-10 sm:py-14' : DESIGN_TOKENS.spacing.sectionY
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-section-light"
      />

      <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-12`}>
        {!expanded && (
          <SectionHeading
            index="03"
            eyebrow="Research Highlights"
            title="Prognostics, Optimization & Industrial Analytics"
            description={RESEARCH_PROFILE_META.positioningSummary}
            actionLabel="Full Research Profile"
            actionTo="/research"
          />
        )}

        {/* Five-Bucket Factual Output Taxonomy (Clear Separation of Prep vs Published vs Proposed) */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            {
              label: 'Manuscripts in Preparation',
              value: String(RESEARCH_MANUSCRIPTS.length),
              note: 'Not yet published',
            },
            {
              label: 'Completed Experiments',
              value: String(experimentCounts.completed),
              note: 'Baselines finished',
            },
            {
              label: 'Ongoing Experiments',
              value: String(experimentCounts.ongoing),
              note: 'Active evaluation',
            },
            {
              label: 'Proposed Experiments',
              value: String(experimentCounts.proposed),
              note: 'Planned next-stage',
            },
            {
              label: 'Published Research',
              value: String(RESEARCH_PUBLISHED_RECORDS.length),
              note: 'Zero DOIs claimed',
            },
          ].map((item, idx) => (
            <div
              key={item.label}
              className={`rounded-[12px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] p-4 space-y-1 ${
                idx === 4 ? 'col-span-2 sm:col-span-1' : ''
              }`}
            >
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                {item.label}
              </p>
              <p className="font-mono text-2xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {item.value}
              </p>
              <p className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                {item.note}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Research Direction: NASA C-MAPSS Uncertainty-Aware Prognostics */}
        <SurfaceCard variant="accent" className="p-6 sm:p-8">
          <div className="grid gap-6 lg:grid-cols-12 lg:items-center">
            <div className="space-y-3 lg:col-span-8">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                {RESEARCH_PROFILE_META.featuredDirection.subtitle}
              </p>
              <h3 className="font-display text-xl font-bold text-slate-900 dark:text-slate-50 sm:text-2xl text-balance">
                {RESEARCH_PROFILE_META.featuredDirection.title}
              </h3>
              <p className={DESIGN_TOKENS.typography.body}>
                {RESEARCH_PROFILE_META.featuredDirection.summary}
              </p>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                Primary Benchmark: {RESEARCH_PROFILE_META.featuredDirection.datasetHighlight}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 lg:col-span-4 lg:justify-end">
              <LinkButton
                to="/research/decision-aware-prognostics"
                variant="primary"
                size="sm"
              >
                <span>Inspect Featured Study</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
              <LinkButton
                to={`/projects/${RESEARCH_PROFILE_META.featuredDirection.relatedProjectId}`}
                variant="secondary"
                size="sm"
              >
                <span>ForgeMind AI Platform</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            </div>
          </div>
        </SurfaceCard>

        {/* Interactive Research Methodology Flowchart (Macro Pipeline + Per-Study Switcher) */}
        <ResearchPipelineDiagram />

        {/* 1. Research Interests (Expanded View) */}
        {expanded && (
          <div className="space-y-5 border-t border-slate-200 dark:border-slate-800/80 pt-10">
            <div className="space-y-1">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                01 · Research Positioning &amp; Interests
              </p>
              <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                Core Inquiry Tracks
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-3xl">
                {RESEARCH_PROFILE_META.positioningTitle} — {RESEARCH_PROFILE_META.positioningSummary}
              </p>
            </div>

            <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2`}>
              {ACADEMIC_INTERESTS.map((interest) => (
                <SurfaceCard key={interest.id} className="min-w-0 p-6 space-y-3">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
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
                  <p className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                    {interest.topics.join(' · ')}
                  </p>
                </SurfaceCard>
              ))}
            </div>
          </div>
        )}

        {/* 2. Manuscripts in Preparation & Published Research Distinction */}
        <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-1">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                {expanded ? '02 · Manuscripts in Preparation' : 'Manuscripts in Preparation'}
              </p>
              <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                Manuscripts Under Development ({RESEARCH_MANUSCRIPTS.length})
              </h3>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                Published Research: {RESEARCH_PUBLISHED_RECORDS.length} · Completed experiments are separated from working manuscript drafts and proposed future tests.
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
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
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
              title="No Manuscripts in Domain"
              message="No manuscripts under development match the selected domain filter."
              actionLabel="Show All Domains"
              onAction={() => setSelectedDomain('All')}
            />
          ) : (
            <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2`}>
              {visibleManuscripts.map((paper, idx) => {
                const showFullNineSpecs = expanded || Boolean(expandedStudySpecs[paper.id]);

                return (
                  <SurfaceCard
                    key={paper.id}
                    variant={paper.featuredDirection ? 'accent' : 'interactive'}
                    as="article"
                    className="flex min-w-0 flex-col justify-between p-6"
                  >
                    <div className="space-y-4">
                      {/* 1. Title & Unboxed Status Metadata */}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
                          <span className="text-cyan-700 dark:text-cyan-400">
                            0{idx + 1} · {paper.domain}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {paper.status} · Unpublished
                          </span>
                        </div>

                        <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                          {paper.title}
                        </h4>
                      </div>

                      {/* Core Structured Fields: Question, Motivation, Dataset, Methodology */}
                      <dl className="divide-y divide-slate-200 dark:divide-slate-800/70 border-y border-slate-200 dark:border-slate-800/70 text-xs">
                        <div className="py-2.5 space-y-1">
                          <dt className="font-mono text-[11px] text-slate-500">
                            Research Question
                          </dt>
                          <dd className="leading-relaxed text-slate-800 dark:text-slate-200">
                            {paper.researchQuestions?.[0] ?? paper.keyFocus}
                          </dd>
                        </div>

                        <div className="py-2.5 space-y-1">
                          <dt className="font-mono text-[11px] text-slate-500">
                            Research Motivation
                          </dt>
                          <dd className="leading-relaxed text-slate-700 dark:text-slate-300">
                            {paper.motivation}
                          </dd>
                        </div>

                        <div className="py-2.5 grid gap-3 sm:grid-cols-2">
                          <div className="space-y-1">
                            <dt className="font-mono text-[11px] text-slate-500">
                              Dataset
                            </dt>
                            <dd className="font-mono text-[11px] text-slate-800 dark:text-slate-200">
                              {paper.datasetsOrBenchmarks}
                            </dd>
                          </div>
                          <div className="space-y-1">
                            <dt className="font-mono text-[11px] text-slate-500">
                              Methodology
                            </dt>
                            <dd className="font-mono text-[11px] text-cyan-700 dark:text-cyan-300">
                              {paper.methods.join(' · ')}
                            </dd>
                          </div>
                        </div>

                        {showFullNineSpecs && (
                          <>
                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                                Completed Work
                              </dt>
                              <dd className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.completedWork ?? ['Baseline experiment framing documented.']).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>

                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[11px] text-blue-700 dark:text-blue-400">
                                Ongoing Work
                              </dt>
                              <dd className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.ongoingWork ?? ['Active evaluation and manuscript drafting.']).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>

                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[11px] text-slate-500">
                                Proposed Experiments
                              </dt>
                              <dd className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                <ul className="space-y-1">
                                  {(paper.proposedWork ?? ['Next-phase validation checks planned.']).map((item) => (
                                    <li key={item}>• {item}</li>
                                  ))}
                                </ul>
                              </dd>
                            </div>

                            <div className="py-2.5 space-y-1">
                              <dt className="font-mono text-[11px] text-slate-500">
                                Expected Contribution
                              </dt>
                              <dd className="leading-relaxed text-slate-800 dark:text-slate-200">
                                {paper.expectedContribution}
                              </dd>
                            </div>
                          </>
                        )}
                      </dl>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <LinkButton
                          to={`/research/${paper.id}`}
                          variant="primary"
                          size="sm"
                          className="!min-h-[40px] sm:!min-h-[34px] !px-3.5"
                        >
                          <span>Open Study Page</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </LinkButton>

                        <LinkButton
                          to={`/studio?model=${resolveStudioModelId(paper.id)}`}
                          variant="secondary"
                          size="sm"
                          className="!min-h-[40px] sm:!min-h-[34px] !px-2.5"
                        >
                          <Box className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>3D Rig</span>
                        </LinkButton>
                      </div>

                      <div className="flex items-center gap-2">
                        {!expanded && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-expanded={showFullNineSpecs}
                            onClick={() => toggleStudySpecs(paper.id)}
                            className="!px-2.5 !min-h-[40px] sm:!min-h-[34px] text-slate-700 dark:text-slate-300"
                          >
                            <span>
                              {showFullNineSpecs ? 'Hide Stages' : 'Work & Contribution'}
                            </span>
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setActivePaper(paper)}
                          className="!px-2.5 !min-h-[40px] sm:!min-h-[34px] text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                          <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Abstract</span>
                        </Button>
                      </div>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          )}

          {/* Published Research Section (Explicitly 0 Records, Zero Fabricated Claims) */}
          <SurfaceCard className="p-5 flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <p className="font-mono text-xs text-slate-800 dark:text-slate-200">
                Published Research ({RESEARCH_PUBLISHED_RECORDS.length} · Peer-Reviewed / Preprints)
              </p>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                No peer-reviewed journal articles, conference proceedings, or DOIs are currently published. Manuscripts in preparation and completed baseline experiments are listed separately above without claiming acceptance.
              </p>
            </div>
            <span className="font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums shrink-0">
              {RESEARCH_PUBLISHED_RECORDS.length} Published Records
            </span>
          </SurfaceCard>
        </div>

        {/* 3. Experimental Pipeline Tracker + Verified Charts (Completed / Ongoing / Proposed) */}
        {expanded && (
          <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-1">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  03 · Experimental Pipeline Tracker
                </p>
                <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                  Completed, Ongoing &amp; Proposed Experiments
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                  Explicit separation of completed baseline runs, ongoing evaluations, and proposed experiments—using strictly source-verified portfolio counts.
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
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label} ({experimentCounts[tab.id]})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Source-Verified Experiment Stage Distribution Charts */}
            <ResearchMetricsPanel />

            {visibleExperiments.length === 0 ? (
              <EmptyState
                title="No Matching Experiments"
                message="Switch to All Experiments to inspect completed baselines, ongoing evaluations, and proposed work."
                actionLabel="Show All Experiments"
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
                        <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
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

                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/80 pt-3 font-mono text-[11px]">
                      <span className="text-slate-600 dark:text-slate-400">
                        {exp.dataset}
                      </span>
                      {exp.relatedStudyId && (
                        <Link
                          to={`/research/${exp.relatedStudyId}`}
                          className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                        >
                          <span>Study Details</span>
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

        {/* 4 & 5. Datasets + Methodology (Expanded View) */}
        {expanded && (
          <div className="grid gap-10 border-t border-slate-200 dark:border-slate-800/80 pt-10 lg:grid-cols-12">
            <div className="min-w-0 space-y-5 lg:col-span-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <Database className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>04 · Datasets &amp; Benchmarks</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Public Experimental Testbeds
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
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {ds.name}
                      </h4>
                      <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {ds.featured ? 'Featured Dataset' : ds.domain}
                      </span>
                    </div>
                    <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                      {ds.scope}
                    </p>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
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
                  <span>05 · Research Methodology</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Decision-Centric Evaluation Protocol
                </h3>
              </div>

              <div className="space-y-3">
                {RESEARCH_METHODOLOGY.map((step) => (
                  <SurfaceCard key={step.step} className="p-4 space-y-1.5">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                        {step.step}
                      </span>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
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

        {/* 6 & 7. Research Tools + Working Research Notes (Expanded View) */}
        {expanded && (
          <div className="space-y-10 border-t border-slate-200 dark:border-slate-800/80 pt-10">
            <div className="space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  <Wrench className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>06 · Research Tools &amp; Technical Capabilities</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Computational &amp; Analytical Stack
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {RESEARCH_TOOL_GROUPS.map((group) => (
                  <SurfaceCard key={group.category} className="p-5 space-y-2.5">
                    <h4 className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {group.category}
                    </h4>
                    <p className="font-mono text-xs leading-relaxed text-slate-600 dark:text-slate-400">
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
                  <span>07 · Research Notes &amp; Technical Working Memos</span>
                </div>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Technical Observations Under Study
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
                        <span>Linked Study</span>
                        <ArrowRight className="h-3 w-3" aria-hidden="true" />
                      </Link>
                    )}
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8 & 9. Collaboration Interests + Future Directions (Expanded View) */}
        {expanded && (
          <div className="grid gap-6 border-t border-slate-200 dark:border-slate-800/80 pt-10 lg:grid-cols-2">
            <SurfaceCard className="p-6 space-y-5">
              <div className="space-y-1.5">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  08 · Collaboration Interests
                </p>
                <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                  Openness to Academic &amp; International Research Collaboration
                </h3>
                <p className={DESIGN_TOKENS.typography.bodyMuted}>
                  {RESEARCH_PROFILE_META.collaborationSummary}
                </p>
              </div>

              <ul className="divide-y divide-slate-200 dark:divide-slate-800/70 border-t border-slate-200 dark:border-slate-800/70">
                {RESEARCH_PROFILE_META.collaborationTracks.map((track) => (
                  <li key={track.title} className="py-3 space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                      {track.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
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
                  Next-Stage Methodological Roadmap
                </h3>
                <p className={DESIGN_TOKENS.typography.bodyMuted}>
                  Planned extensions building directly upon current C-MAPSS prognostics, carbon-aware scheduling, and inventory simulation work.
                </p>
              </div>

              <ul className="divide-y divide-slate-200 dark:divide-slate-800/70 border-t border-slate-200 dark:border-slate-800/70">
                {RESEARCH_PROFILE_META.futureDirections.map((dir) => (
                  <li key={dir.title} className="py-3 space-y-1">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                      {dir.title}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {dir.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </SurfaceCard>
          </div>
        )}
      </div>

      <Modal
        open={activePaper !== null}
        onClose={() => setActivePaper(null)}
        title={activePaper?.title ?? ''}
        subtitle={
          activePaper
            ? `${activePaper.domain} · ${activePaper.status}`
            : undefined
        }
      >
        {activePaper && (
          <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
            <div className="space-y-2">
              <h4 className="font-mono text-xs text-blue-700 dark:text-blue-400">
                Abstract Summary
              </h4>
              <p className={DESIGN_TOKENS.typography.editorialAbstract}>
                {activePaper.abstract}
              </p>
            </div>

            <div className="grid gap-4 border-y border-slate-200 dark:border-slate-800/80 py-4 sm:grid-cols-2">
              <div>
                <p className="font-mono text-[11px] text-slate-500">
                  Datasets / Benchmarks
                </p>
                <p className="mt-1 font-mono text-xs text-slate-800 dark:text-slate-200">
                  {activePaper.datasetsOrBenchmarks}
                </p>
              </div>
              <div>
                <p className="font-mono text-[11px] text-slate-500">
                  Key Research Focus
                </p>
                <p className="mt-1 text-xs text-slate-800 dark:text-slate-200">
                  {activePaper.keyFocus}
                </p>
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-blue-700 dark:text-blue-400 mb-2">
                Methodology &amp; Techniques
              </p>
              <p className="font-mono text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {activePaper.methods.join(' · ')}
              </p>
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex flex-wrap items-center gap-3">
                <span>Status: {activePaper.status}</span>
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
