import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Cpu,
  FileSearch,
  Lightbulb,
  Rocket,
  Search,
  Users,
} from 'lucide-react';
import {
  FUTURE_INNOVATION_PLANS,
  INNOVATION_COMPETITIONS,
  INNOVATION_ENTRIES,
  INNOVATION_PROFILE_META,
  INNOVATION_TIMELINE,
  PROBLEM_SOLVING_FRAMEWORK,
  TEAM_COLLABORATION_HIGHLIGHTS,
} from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { InnovationEntry, InnovationStage } from '../../types/portfolio';
import {
  countInnovationByStage,
  filterInnovationEntries,
  filterInnovationTimeline,
  type InnovationStageFilter,
} from '../../utils/portfolioFilters';
import { InnovationPipelineDiagram } from '../innovation/InnovationPipelineDiagram';
import { StudioPreviewSection } from './StudioPreviewSection';
import { Button, LinkButton } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Modal } from '../ui/Modal';
import { SectionHeading } from '../ui/SectionHeading';
import { SurfaceCard } from '../ui/SurfaceCard';

interface InnovationSectionProps {
  expanded?: boolean;
}

const STAGE_TABS: { id: InnovationStageFilter; label: string }[] = [
  { id: 'all', label: 'All Stages' },
  { id: 'idea', label: 'Ideas & Concepts' },
  { id: 'prototype', label: 'Working Prototypes' },
  { id: 'validated', label: 'Validated Solutions' },
  { id: 'launched', label: 'Launched Products' },
];

function StageIcon({ stage }: { stage: InnovationStage }) {
  if (stage === 'prototype') {
    return (
      <Cpu
        className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400"
        aria-hidden="true"
      />
    );
  }
  if (stage === 'validated') {
    return (
      <CheckCircle2
        className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
        aria-hidden="true"
      />
    );
  }
  if (stage === 'launched') {
    return (
      <Rocket
        className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400"
        aria-hidden="true"
      />
    );
  }
  return (
    <Lightbulb
      className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
      aria-hidden="true"
    />
  );
}

export function InnovationSection({ expanded = false }: InnovationSectionProps) {
  const [selectedStage, setSelectedStage] = useState<InnovationStageFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [timelineStage, setTimelineStage] = useState<InnovationStageFilter>('all');
  const [selectedTimelineId, setSelectedTimelineId] = useState<string>(
    INNOVATION_TIMELINE[1]?.id ?? INNOVATION_TIMELINE[0]?.id ?? '',
  );
  const [activeDossier, setActiveDossier] = useState<InnovationEntry | null>(null);

  const stageCounts = useMemo(
    () => countInnovationByStage(INNOVATION_ENTRIES),
    [],
  );

  const visibleEntries = useMemo(
    () =>
      filterInnovationEntries(
        INNOVATION_ENTRIES,
        selectedStage,
        expanded ? searchQuery : '',
      ),
    [selectedStage, searchQuery, expanded],
  );

  const displayEntries = expanded
    ? visibleEntries
    : visibleEntries.slice(0, 4);

  const visibleTimeline = useMemo(
    () => filterInnovationTimeline(INNOVATION_TIMELINE, timelineStage),
    [timelineStage],
  );

  const activeTimelineItem =
    visibleTimeline.find((item) => item.id === selectedTimelineId) ??
    visibleTimeline[0] ??
    INNOVATION_TIMELINE[0];

  const handleOpenLinkedEntry = (linkedId?: string) => {
    if (!linkedId) return;
    const match = INNOVATION_ENTRIES.find((item) => item.id === linkedId);
    if (match) {
      setActiveDossier(match);
    }
  };

  return (
    <section
      id="innovation"
      className={`relative border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] ${
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
            index="04"
            eyebrow="Engineering & Innovation"
            title="From Problem Framing to Working Prototypes & 3D Systems"
            description={INNOVATION_PROFILE_META.positioningSummary}
            actionLabel="Full Innovation Hub"
            actionTo="/innovation"
          />
        )}

        {/* 4-Stage Maturity Strip — Strict Distinction Between Ideas, Prototypes, Validated Solutions & Launched Products */}
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              stage: 'idea' as const,
              label: 'Ideas & Concepts',
              value: String(stageCounts.idea),
              note: 'Case pitches & early concepts',
            },
            {
              stage: 'prototype' as const,
              label: 'Working Prototypes',
              value: String(stageCounts.prototype),
              note: 'FactoryMind & ForgeMind AI',
            },
            {
              stage: 'validated' as const,
              label: 'Validated Solutions',
              value: String(stageCounts.validated),
              note: 'Pending external pilots',
            },
            {
              stage: 'launched' as const,
              label: 'Launched Products',
              value: String(stageCounts.launched),
              note: 'No live market launch yet',
            },
          ].map((item) => (
            <div
              key={item.stage}
              className="rounded-[12px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] p-4 space-y-1"
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

        {/* Interactive Maturity Pipeline Diagram */}
        <InnovationPipelineDiagram
          activeStage={selectedStage}
          onSelectStage={setSelectedStage}
          counts={stageCounts}
        />

        {/* Band 01 / Main Entries: 7-Point Innovation & Prototype Dossiers */}
        <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                {expanded
                  ? '01 · Venture Concepts & Prototypes'
                  : 'Prototypes, Concepts & Competition Cases'}
              </p>
              <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                Structured Problem-to-Solution Entries
              </h3>
              <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                {INNOVATION_PROFILE_META.ventureReadinessNote}
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="group"
                aria-label="Filter innovation entries by maturity stage"
                className="flex flex-wrap gap-2 shrink-0"
              >
                {STAGE_TABS.map((tab) => {
                  const active = selectedStage === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSelectedStage(tab.id)}
                      className={`min-h-[40px] sm:min-h-[38px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label} ({stageCounts[tab.id]})
                    </button>
                  );
                })}
              </div>

              {expanded && (
                <div className="relative w-full lg:max-w-xs">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <label htmlFor="innovation-search" className="sr-only">
                    Search innovation entries
                  </label>
                  <input
                    id="innovation-search"
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Filter ideas, users, prototypes..."
                    className="h-[38px] w-full rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0b1222] pl-9 pr-3 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-600 dark:focus:border-blue-500/70 focus:outline-none focus:ring-2 focus:ring-cyan-600/30 dark:focus:ring-cyan-400/40"
                  />
                </div>
              )}
            </div>
          </div>

          <div
            id="innovation-entries-panel"
            className={`grid ${DESIGN_TOKENS.spacing.gridGap} lg:grid-cols-2`}
          >
            {displayEntries.length > 0 ? (
              displayEntries.map((entry) => (
                <SurfaceCard
                  key={entry.id}
                  as="article"
                  variant={entry.stage === 'prototype' ? 'accent' : 'interactive'}
                  className="flex min-w-0 flex-col justify-between p-6 space-y-5"
                >
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                      <span className="inline-flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
                        <StageIcon stage={entry.stage} />
                        <span>{entry.stageLabel}</span>
                      </span>
                      <span className="text-cyan-700 dark:text-cyan-400">
                        {entry.category}
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                        {entry.title}
                      </h4>
                      <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {entry.period} · {entry.teamContext}
                      </p>
                    </div>

                    <dl className="space-y-3 border-t border-slate-200 dark:border-slate-800/80 pt-3 text-xs leading-relaxed">
                      <div className="space-y-0.5">
                        <dt className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                          1. Problem Identified
                        </dt>
                        <dd className="text-slate-700 dark:text-slate-300">
                          {entry.problemIdentified}
                        </dd>
                      </div>
                      <div className="space-y-0.5">
                        <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          2. Target Users
                        </dt>
                        <dd className="text-slate-700 dark:text-slate-300">
                          {entry.targetUsers}
                        </dd>
                      </div>
                      <div className="space-y-0.5">
                        <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                          3. Proposed Solution
                        </dt>
                        <dd className="text-slate-700 dark:text-slate-300">
                          {entry.proposedSolution}
                        </dd>
                      </div>
                      <div className="grid gap-3 pt-1 sm:grid-cols-2">
                        <div className="space-y-0.5">
                          <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            4. Innovation Approach
                          </dt>
                          <dd className="text-slate-600 dark:text-slate-400">
                            {entry.innovationApproach}
                          </dd>
                        </div>
                        <div className="space-y-0.5">
                          <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            5. Current Development Stage
                          </dt>
                          <dd className="text-slate-600 dark:text-slate-400">
                            {entry.currentDevelopmentStage}
                          </dd>
                        </div>
                        <div className="space-y-0.5">
                          <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            6. Validation Status
                          </dt>
                          <dd className="text-slate-600 dark:text-slate-400">
                            {entry.validationStatus}
                          </dd>
                        </div>
                        <div className="space-y-0.5">
                          <dt className="font-mono text-[11px] text-slate-500 dark:text-slate-400">
                            7. Future Roadmap
                          </dt>
                          <dd className="text-slate-600 dark:text-slate-400">
                            {entry.futureRoadmap}
                          </dd>
                        </div>
                      </div>
                    </dl>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      onClick={() => setActiveDossier(entry)}
                      className="!min-h-[40px] sm:!min-h-[34px] !px-3.5"
                    >
                      <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Inspect 7-Point Dossier</span>
                    </Button>

                    {entry.relatedProjectId ? (
                      <LinkButton
                        to={`/projects/${entry.relatedProjectId}`}
                        variant="ghost"
                        size="sm"
                        className="!min-h-[40px] sm:!min-h-[34px] !px-2.5 text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                      >
                        <span>Project Case Study</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </LinkButton>
                    ) : (
                      <span className="font-mono text-[11px] text-slate-500">
                        Stage: {entry.stageLabel}
                      </span>
                    )}
                  </div>
                </SurfaceCard>
              ))
            ) : (
              <EmptyState
                className="lg:col-span-2"
                title={
                  selectedStage === 'validated'
                    ? '0 Validated Solutions Recorded'
                    : selectedStage === 'launched'
                      ? '0 Launched Products Recorded'
                      : 'No Matching Innovation Entries'
                }
                message={
                  selectedStage === 'validated' || selectedStage === 'launched'
                    ? INNOVATION_PROFILE_META.transparencyStatement
                    : 'Clear the search filter or switch back to All Stages to inspect active ideas and working prototypes.'
                }
                actionLabel="Reset Stage Filter"
                onAction={() => {
                  setSelectedStage('all');
                  setSearchQuery('');
                }}
              />
            )}
          </div>

          {!expanded && (
            <div className="space-y-12">
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] px-5 py-4">
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Explore the interactive innovation timeline, 5-step problem-solving framework, competition records, team collaborations, and future startup hypotheses.
                </p>
                <LinkButton to="/innovation" variant="secondary" size="sm">
                  <span>Open Full Innovation Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
              </div>

              <StudioPreviewSection integrated />
            </div>
          )}
        </div>

        {/* Expanded Sections Rendered on /innovation */}
        {expanded && (
          <>
            {/* Band 02: Interactive Innovation Timeline */}
            <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    02 · Interactive Innovation Timeline
                  </p>
                  <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                    Progression From Competitions to Prototypes &amp; Discovery
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm">
                    Select any chronological milestone to inspect its context, validation state, and linked prototype or case entry.
                  </p>
                </div>

                <div
                  role="group"
                  aria-label="Filter innovation timeline by stage"
                  className="flex flex-wrap gap-2 shrink-0"
                >
                  {[
                    { id: 'all' as const, label: 'All Milestones' },
                    { id: 'idea' as const, label: 'Ideas & Competitions' },
                    { id: 'prototype' as const, label: 'Prototypes' },
                  ].map((tab) => {
                    const active = timelineStage === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setTimelineStage(tab.id);
                          const nextList = filterInnovationTimeline(
                            INNOVATION_TIMELINE,
                            tab.id,
                          );
                          if (nextList[0]) {
                            setSelectedTimelineId(nextList[0].id);
                          }
                        }}
                        className={`min-h-[40px] sm:min-h-[36px] rounded-[10px] border px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                          active
                            ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
                {/* Timeline selector rail */}
                <div className="space-y-2.5 lg:col-span-5">
                  {visibleTimeline.map((item) => {
                    const isActive = activeTimelineItem?.id === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedTimelineId(item.id)}
                        aria-pressed={isActive}
                        className={`w-full rounded-[12px] border p-4 text-left transition-all duration-150 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                          isActive
                            ? 'border-blue-600/75 bg-blue-50 dark:border-blue-500/75 dark:bg-[#101a30]'
                            : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800/80 dark:bg-[#0b1222] dark:hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2 font-mono text-[11px]">
                          <span className="text-cyan-700 dark:text-cyan-400 tabular-nums">
                            {item.period}
                          </span>
                          <span className="text-slate-600 dark:text-slate-400">
                            {item.kind}
                          </span>
                        </div>
                        <p className="mt-1.5 font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {item.title}
                        </p>
                      </button>
                    );
                  })}
                </div>

                {/* Focused Timeline Milestone Detail */}
                {activeTimelineItem && (
                  <SurfaceCard
                    variant="accent"
                    className="p-6 sm:p-8 lg:col-span-7 space-y-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-4 font-mono text-xs">
                      <span className="text-cyan-700 dark:text-cyan-400">
                        {activeTimelineItem.period} · {activeTimelineItem.kind}
                      </span>
                      <span className="text-slate-700 dark:text-slate-300">
                        {activeTimelineItem.statusNote}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-50">
                        {activeTimelineItem.title}
                      </h4>
                      <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                        {activeTimelineItem.organizationOrContext}
                      </p>
                    </div>

                    <p className={DESIGN_TOKENS.typography.body}>
                      {activeTimelineItem.summary}
                    </p>

                    {activeTimelineItem.linkedInnovationId && (
                      <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4">
                        <Button
                          type="button"
                          variant="primary"
                          size="sm"
                          onClick={() =>
                            handleOpenLinkedEntry(activeTimelineItem.linkedInnovationId)
                          }
                        >
                          <FileSearch className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Inspect Linked 7-Point Dossier</span>
                        </Button>
                      </div>
                    )}
                  </SurfaceCard>
                )}
              </div>
            </div>

            {/* Band 03: Problem-Solving Framework */}
            <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
              <div className="space-y-1">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  03 · Problem-Solving Framework
                </p>
                <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                  Five-Step Engineering &amp; Venture Execution Loop
                </h3>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                {PROBLEM_SOLVING_FRAMEWORK.map((step) => (
                  <SurfaceCard
                    key={step.step}
                    className="flex flex-col justify-between p-5 space-y-4"
                  >
                    <div className="space-y-2">
                      <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400 tabular-nums">
                        Step {step.step}
                      </p>
                      <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-50">
                        {step.title}
                      </h4>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {step.question}
                      </p>
                    </div>

                    <div className="space-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-3">
                      <p className="font-mono text-[10.5px] text-slate-700 dark:text-slate-300">
                        {step.methods.join(' · ')}
                      </p>
                      <p className="text-[11px] leading-relaxed text-slate-500">
                        {step.appliedTo}
                      </p>
                    </div>
                  </SurfaceCard>
                ))}
              </div>
            </div>

            {/* Band 04: Innovation Competitions & Team Collaboration */}
            <div className="grid gap-8 border-t border-slate-200 dark:border-slate-800/80 pt-10 lg:grid-cols-12">
              <div className="space-y-5 lg:col-span-7">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    04 · Innovation &amp; Case Competitions
                  </p>
                  <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                    Verified Competition Placements
                  </h3>
                </div>

                <div className="space-y-3">
                  {INNOVATION_COMPETITIONS.map((comp) => (
                    <SurfaceCard key={comp.id} className="p-5 space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                          {comp.title}
                        </h4>
                        <span className="font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300">
                          {comp.placement}
                        </span>
                      </div>

                      <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {comp.organizer} · {comp.year}
                        {comp.teamName ? ` · ${comp.teamName}` : ''}
                      </p>

                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {comp.problemSolvingFocus}
                      </p>

                      {comp.missingInfo && (
                        <p className="font-mono text-[11px] text-slate-500">
                          Pending Note: {comp.missingInfo}
                        </p>
                      )}
                    </SurfaceCard>
                  ))}
                </div>
              </div>

              <div className="space-y-5 lg:col-span-5">
                <div className="space-y-1">
                  <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    05 · Team Collaboration &amp; Ecosystems
                  </p>
                  <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                    Cross-Functional Execution
                  </h3>
                </div>

                <div className="space-y-3">
                  {TEAM_COLLABORATION_HIGHLIGHTS.map((collab) => (
                    <SurfaceCard key={collab.id} className="p-5 space-y-2.5">
                      <div className="flex items-start gap-2.5">
                        <Users
                          className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-400"
                          aria-hidden="true"
                        />
                        <div className="space-y-0.5">
                          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-50">
                            {collab.context}
                          </h4>
                          <p className="font-mono text-[11px] text-blue-700 dark:text-blue-300">
                            {collab.role}
                          </p>
                        </div>
                      </div>
                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {collab.focus}
                      </p>
                      <p className="font-mono text-[11px] text-slate-500">
                        Collaborators: {collab.collaborators}
                      </p>
                    </SurfaceCard>
                  ))}
                </div>
              </div>
            </div>

            {/* Band 05: Future Innovation Plans & Pre-Validation Roadmap */}
            <div className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10">
              <div className="space-y-1">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  06 · Future Innovation Plans
                </p>
                <h3 className={DESIGN_TOKENS.typography.sectionTitle}>
                  Next-Stage Prototyping &amp; Discovery Roadmap
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 sm:text-sm max-w-3xl">
                  {INNOVATION_PROFILE_META.transparencyStatement}
                </p>
              </div>

              <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-3`}>
                {FUTURE_INNOVATION_PLANS.map((plan) => (
                  <SurfaceCard
                    key={plan.id}
                    className="flex flex-col justify-between p-6 space-y-4"
                  >
                    <div className="space-y-2.5">
                      <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {plan.horizon}
                      </p>
                      <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                        {plan.title}
                      </h4>
                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {plan.hypothesis}
                      </p>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-800/80 pt-3">
                      <p className="font-mono text-[10.5px] text-slate-500">
                        Next Concrete Milestone
                      </p>
                      <p className="mt-1 text-xs text-slate-700 dark:text-slate-300">
                        {plan.nextMilestone}
                      </p>
                    </div>
                  </SurfaceCard>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 7-Point Innovation Entry Dossier Modal */}
      <Modal
        open={Boolean(activeDossier)}
        onClose={() => setActiveDossier(null)}
        title={activeDossier?.title ?? ''}
        subtitle={
          activeDossier
            ? `${activeDossier.stageLabel} · ${activeDossier.category} · ${activeDossier.period}`
            : ''
        }
      >
        {activeDossier && (
          <div className="space-y-4 text-sm">
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Team / Context: {activeDossier.teamContext}
            </p>

            <div className="space-y-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
              {[
                { num: '1', label: 'Problem Identified', value: activeDossier.problemIdentified },
                { num: '2', label: 'Target Users', value: activeDossier.targetUsers },
                { num: '3', label: 'Proposed Solution', value: activeDossier.proposedSolution },
                { num: '4', label: 'Innovation Approach', value: activeDossier.innovationApproach },
                {
                  num: '5',
                  label: 'Current Development Stage',
                  value: `${activeDossier.stageLabel} — ${activeDossier.currentDevelopmentStage}`,
                },
                { num: '6', label: 'Validation Status', value: activeDossier.validationStatus },
                { num: '7', label: 'Future Roadmap', value: activeDossier.futureRoadmap },
              ].map((field) => (
                <div
                  key={field.num}
                  className="rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-100/80 dark:bg-[#080e1c] p-3.5 space-y-1"
                >
                  <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                    {field.num}. {field.label}
                  </p>
                  <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>

            {activeDossier.missingInfo && activeDossier.missingInfo.length > 0 && (
              <div className="rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#060b16] p-3.5 space-y-1">
                <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  Records Ready for Manual Completion
                </p>
                <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-400">
                  {activeDossier.missingInfo.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
              {activeDossier.relatedProjectId ? (
                <LinkButton
                  to={`/projects/${activeDossier.relatedProjectId}`}
                  variant="primary"
                  size="sm"
                  onClick={() => setActiveDossier(null)}
                >
                  <span>Open Full Project Case Study</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
              ) : (
                <LinkButton
                  to="/contact"
                  variant="secondary"
                  size="sm"
                  onClick={() => setActiveDossier(null)}
                >
                  <span>Discuss Collaboration</span>
                </LinkButton>
              )}

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setActiveDossier(null)}
              >
                Close Dossier
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
