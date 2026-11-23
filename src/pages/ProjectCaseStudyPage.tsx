import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  FlaskConical,
  Layers,
} from 'lucide-react';
import {
  PROJECTS,
  RESEARCH_DATASETS,
  RESEARCH_EXPERIMENTS,
  RESEARCH_MANUSCRIPTS,
} from '../data/portfolio';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { DESIGN_TOKENS } from '../styles/designSystem';
import type { ProjectMaturityState } from '../types/portfolio';
import {
  getProjectNavigation,
  summarizeProjectMaturity,
} from '../utils/portfolioFilters';
import { ProjectArchitectureDiagram } from '../components/projects/ProjectArchitectureDiagram';
import { ProjectPreviewImage } from '../components/projects/ProjectPreviewImage';
import { ProjectValidationSection } from '../components/projects/ProjectValidationSection';
import { ProjectZoomGallery } from '../components/projects/ProjectZoomGallery';
import { resolveStudioModelId } from '../three/studioConfig';
import { ExternalLinkButton, LinkButton } from '../components/ui/Button';
import { SurfaceCard } from '../components/ui/SurfaceCard';

const LazyCaseStudyStudioViewport = lazy(() =>
  import('../components/three/IndustrialStudioViewport').then((m) => ({
    default: m.IndustrialStudioViewport,
  })),
);

const CASE_STUDY_ANCHORS = [
  { id: 'cs-overview', label: '01. Overview' },
  { id: 'cs-problem', label: '02–04. Problem & Solution' },
  { id: 'cs-architecture', label: '05. Architecture' },
  { id: 'cs-implementation', label: '06. Implementation' },
  { id: 'cs-features', label: '07. Core Features' },
  { id: 'cs-screenshots', label: '08. Screenshots' },
  { id: 'cs-decisions', label: '09. Decisions' },
  { id: 'cs-validation', label: '10. Validation' },
  { id: 'cs-limitations', label: '11. Limitations' },
  { id: 'cs-future', label: '12. Future' },
] as const;

type FeatureFilter = 'all' | 'implemented' | 'experimental' | 'planned';

function formatMaturityLabel(state: ProjectMaturityState) {
  switch (state) {
    case 'Implemented':
      return {
        glyph: '●',
        className: 'text-emerald-700 dark:text-emerald-300',
      };
    case 'Experimental':
    case 'Proposed':
      return {
        glyph: '◐',
        className: 'text-cyan-700 dark:text-cyan-300',
      };
    case 'Planned':
      return {
        glyph: '○',
        className: 'text-blue-700 dark:text-blue-300',
      };
    default:
      return {
        glyph: '◌',
        className: 'text-slate-600 dark:text-slate-400',
      };
  }
}

export function ProjectCaseStudyPage() {
  const { id } = useParams<{ id: string }>();
  const { project, previous, next } = getProjectNavigation(PROJECTS, id);
  const [activeModuleId, setActiveModuleId] = useState(
    project?.modules[0]?.id ?? 'scheduling',
  );
  const [activeAnchor, setActiveAnchor] = useState<string>('cs-overview');
  const [heroViewMode, setHeroViewMode] = useState<'blueprint' | '3d'>('blueprint');
  const [featureFilter, setFeatureFilter] = useState<FeatureFilter>('all');

  usePageMetadata({
    title: project ? `${project.title} — Technical Case Study` : 'Case Study Not Found',
    description: project
      ? `${project.tagline}. ${project.summary}`
      : 'Project case study directory in Industrial & Production Engineering.',
    path: project ? `/projects/${project.id}` : '/projects',
    schemaType: 'CreativeWork',
  });

  useEffect(() => {
    setActiveModuleId(project?.modules[0]?.id ?? 'scheduling');
    setHeroViewMode('blueprint');
    setFeatureFilter('all');
  }, [project]);

  useEffect(() => {
    const updateAnchor = () => {
      const offset = 150;
      let current: string = CASE_STUDY_ANCHORS[0].id;
      for (const anchor of CASE_STUDY_ANCHORS) {
        const el = document.getElementById(anchor.id);
        if (el && el.getBoundingClientRect().top - offset <= 0) {
          current = anchor.id;
        }
      }
      setActiveAnchor(current);
    };

    updateAnchor();
    window.addEventListener('scroll', updateAnchor, { passive: true });
    return () => window.removeEventListener('scroll', updateAnchor);
  }, [id]);

  const maturitySummary = useMemo(
    () => (project ? summarizeProjectMaturity(project) : null),
    [project],
  );

  const filteredFeatures = useMemo(() => {
    if (!project) return [];
    return project.caseStudy.coreFeatures.filter((feature) => {
      if (featureFilter === 'all') return true;
      if (featureFilter === 'implemented') return feature.maturity === 'Implemented';
      if (featureFilter === 'experimental') {
        return feature.maturity === 'Experimental' || feature.maturity === 'Proposed';
      }
      return feature.maturity === 'Planned' || feature.maturity === 'Awaiting Source';
    });
  }, [featureFilter, project]);

  if (!project) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24 text-center space-y-5">
        <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
          Case Study Not Found
        </p>
        <h1 className={DESIGN_TOKENS.typography.pageTitle}>
          This project record could not be located.
        </h1>
        <p className={DESIGN_TOKENS.typography.body}>
          Return to the Project Laboratory to explore FactoryMind, ForgeMind AI, or TikaTrack.
        </p>
        <LinkButton to="/projects" variant="primary" size="md">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Project Laboratory</span>
        </LinkButton>
      </section>
    );
  }

  const { caseStudy } = project;
  const activeModule =
    project.modules.find((m) => m.id === activeModuleId) ?? project.modules[0];

  const isSourcePending = project.developmentStage === 'Developing Concept';

  return (
    <article className="bg-slate-50 dark:bg-[#050914]">
      {/* Hero Banner */}
      <header className="relative overflow-hidden border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] bg-blueprint-grid py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ambient-hero-light"
        />

        <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-8`}>
          <Link
            to="/projects"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-600 dark:text-slate-400 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Project Laboratory</span>
          </Link>

          <div className="grid items-center gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-6">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-xs">
                <span className="text-cyan-700 dark:text-cyan-400">
                  {project.categoryLabel}
                </span>
                <span aria-hidden="true" className="text-slate-400">·</span>
                <span
                  className={
                    isSourcePending
                      ? 'text-slate-600 dark:text-slate-400'
                      : project.developmentStage === 'Active Prototype'
                        ? 'text-emerald-700 dark:text-emerald-300'
                        : 'text-cyan-700 dark:text-cyan-300'
                  }
                >
                  {isSourcePending
                    ? '◌ '
                    : project.developmentStage === 'Active Prototype'
                      ? '● '
                      : '◐ '}
                  {project.status}
                </span>
              </div>

              <h1 className={DESIGN_TOKENS.typography.pageTitle}>
                {project.title}
              </h1>
              <p className="text-base font-medium text-blue-700 dark:text-blue-300">
                {project.tagline}
              </p>
              <p className={DESIGN_TOKENS.typography.bodyLead}>
                {project.summary}
              </p>

              <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
                {project.context} · {project.sourceNote}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                {project.githubUrl && (
                  <ExternalLinkButton
                    href={project.githubUrl}
                    variant="primary"
                    size="sm"
                  >
                    <span>View Public Source Code</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </ExternalLinkButton>
                )}

                {project.liveDemoUrl && (
                  <ExternalLinkButton
                    href={project.liveDemoUrl}
                    variant="secondary"
                    size="sm"
                  >
                    <span>Live Demo</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </ExternalLinkButton>
                )}

                {(project.id === 'factorymind' || project.id === 'forgemind-ai') && (
                  <LinkButton
                    to={`/studio?model=${
                      project.id === 'factorymind'
                        ? 'factorymind-cell'
                        : 'forgemind-turbofan'
                    }`}
                    variant={project.githubUrl ? 'secondary' : 'primary'}
                    size="sm"
                  >
                    <span>Inspect 3D Assembly</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </LinkButton>
                )}

                {project.id === 'forgemind-ai' && (
                  <LinkButton
                    to="/research/decision-aware-prognostics"
                    variant="secondary"
                    size="sm"
                  >
                    <span>Linked C-MAPSS Study</span>
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </LinkButton>
                )}

                {!project.githubUrl && (
                  <p className="font-mono text-xs text-slate-500">
                    {isSourcePending
                      ? 'Complete source code & UI captures pending supply.'
                      : 'Source repository currently private.'}
                  </p>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              {(project.id === 'factorymind' || project.id === 'forgemind-ai') && (
                <div
                  role="group"
                  aria-label="Case study hero visualization mode"
                  className="inline-flex rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] p-1"
                >
                  <button
                    type="button"
                    aria-pressed={heroViewMode === 'blueprint'}
                    onClick={() => setHeroViewMode('blueprint')}
                    className={`rounded-[7px] px-3 py-1.5 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                      heroViewMode === 'blueprint'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Conceptual Preview
                  </button>
                  <button
                    type="button"
                    aria-pressed={heroViewMode === '3d'}
                    onClick={() => setHeroViewMode('3d')}
                    className={`rounded-[7px] px-3 py-1.5 font-mono text-[11px] font-medium transition-colors cursor-pointer ${
                      heroViewMode === '3d'
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    Interactive 3D Rig
                  </button>
                </div>
              )}

              {heroViewMode === '3d' &&
              (project.id === 'factorymind' || project.id === 'forgemind-ai') ? (
                <Suspense
                  fallback={
                    <div className="flex h-[390px] sm:h-[430px] w-full items-center justify-center rounded-[16px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#050914] font-mono text-xs text-slate-500">
                      Loading interactive 3D engineering rig...
                    </div>
                  }
                >
                  <LazyCaseStudyStudioViewport
                    mode="embedded"
                    initialModel={resolveStudioModelId(project.id)}
                    heightClassName="h-[390px] sm:h-[430px]"
                  />
                </Suspense>
              ) : (
                <ProjectPreviewImage
                  projectId={project.id}
                  title={project.title}
                  alt={project.previewAlt}
                  customUrl={project.previewImageUrl}
                  kindLabel={project.previewKindLabel}
                />
              )}
            </div>
          </div>

          {/* 12-Section Quick Jump Bar */}
          <nav
            aria-label="Case study sections"
            className="flex flex-wrap gap-x-4 gap-y-2 border-t border-slate-200 dark:border-slate-800/80 pt-5 font-mono text-xs"
          >
            {CASE_STUDY_ANCHORS.map((anchor) => {
              const active = activeAnchor === anchor.id;
              return (
                <a
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  onClick={() => setActiveAnchor(anchor.id)}
                  aria-current={active ? 'location' : undefined}
                  className={`whitespace-nowrap transition-colors ${
                    active
                      ? 'font-semibold text-cyan-700 dark:text-cyan-300 underline decoration-cyan-600/50 dark:decoration-cyan-400/50 underline-offset-4'
                      : 'text-slate-600 dark:text-slate-400 hover:text-cyan-700 dark:hover:text-cyan-300'
                  }`}
                >
                  {anchor.label}
                </a>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main 12-Section Case Study Dossier */}
      <div className={`${DESIGN_TOKENS.spacing.container} divide-y divide-slate-200 dark:divide-slate-800/80`}>
        {/* 01. Overview */}
        <section id="cs-overview" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              01 · Overview
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Executive Technical Summary &amp; Maturity Ledger
            </h2>
            <p className={DESIGN_TOKENS.typography.body}>
              {caseStudy.overviewSummary}
            </p>
          </div>

          {maturitySummary && (
            <div className="grid gap-4 sm:grid-cols-3">
              <SurfaceCard className="p-5 space-y-1">
                <p className="font-mono text-[11px] text-emerald-700 dark:text-emerald-300">
                  ● Implemented Capabilities
                </p>
                <p className="font-mono text-2xl font-bold text-slate-950 dark:text-slate-50 tabular-nums">
                  {maturitySummary.implemented}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Built features verified inside current scope
                </p>
              </SurfaceCard>

              <SurfaceCard className="p-5 space-y-1">
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-300">
                  ◐ Experimental / Proposed
                </p>
                <p className="font-mono text-2xl font-bold text-slate-950 dark:text-slate-50 tabular-nums">
                  {maturitySummary.experimentalOrProposed}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Active research tracks or queued experiments
                </p>
              </SurfaceCard>

              <SurfaceCard className="p-5 space-y-1">
                <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  ○ Planned / Awaiting Source
                </p>
                <p className="font-mono text-2xl font-bold text-slate-950 dark:text-slate-50 tabular-nums">
                  {maturitySummary.plannedOrPending}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Roadmap items or unpopulated source records
                </p>
              </SurfaceCard>
            </div>
          )}
        </section>

        {/* 02. Problem Statement, 03. Motivation, 04. Proposed Solution */}
        <section id="cs-problem" className="scroll-mt-24 py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-3">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                02 · Problem Statement
              </p>
              <h2 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Core Operational or Product Gap
              </h2>
              <p className={DESIGN_TOKENS.typography.body}>
                {caseStudy.problemStatement}
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-200 dark:border-slate-800/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                03 · Motivation
              </p>
              <h2 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Engineering &amp; Research Drivers
              </h2>
              <p className={DESIGN_TOKENS.typography.body}>
                {caseStudy.motivation}
              </p>
            </div>

            <div className="space-y-3 border-t border-slate-200 dark:border-slate-800/80 pt-6 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                04 · Proposed Solution
              </p>
              <h2 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Structured Design Approach
              </h2>
              <p className={DESIGN_TOKENS.typography.body}>
                {caseStudy.proposedSolution}
              </p>
            </div>
          </div>
        </section>

        {/* 05. System Architecture (Interactive Diagram + Layers) */}
        <section id="cs-architecture" className="scroll-mt-24 py-12 sm:py-16 space-y-8">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              05 · System Architecture
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Interactive Component Topology &amp; Data Contracts
            </h2>
            <p className={DESIGN_TOKENS.typography.body}>
              {caseStudy.architectureOverview}
            </p>
          </div>

          <ProjectArchitectureDiagram
            projectId={project.id}
            layers={caseStudy.architectureLayers}
          />
        </section>

        {/* 06. Technical Implementation + Stack */}
        <section id="cs-implementation" className="scroll-mt-24 py-12 sm:py-16 space-y-10">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              06 · Technical Implementation
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Implemented Capabilities vs. Experimental / Pending Scope
            </h2>
            <p className={DESIGN_TOKENS.typography.body}>
              {caseStudy.implementationSummary}
            </p>
          </div>

          <div
            className={`grid gap-6 ${
              caseStudy.secondaryItems ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
            }`}
          >
            <SurfaceCard variant="accent" className="p-6 space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <CheckCircle2
                  className="h-4 w-4 text-emerald-700 dark:text-emerald-300"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  {caseStudy.implementedHeading}
                </h3>
              </div>
              <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {caseStudy.implementedItems.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </SurfaceCard>

            {caseStudy.secondaryItems && (
              <SurfaceCard className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  {caseStudy.secondaryKind === 'proposed' ? (
                    <FlaskConical
                      className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                      aria-hidden="true"
                    />
                  ) : (
                    <Clock
                      className="h-4 w-4 text-slate-600 dark:text-slate-400"
                      aria-hidden="true"
                    />
                  )}
                  <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                    {caseStudy.secondaryHeading}
                  </h3>
                </div>
                <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {caseStudy.secondaryItems.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </SurfaceCard>
            )}
          </div>

          {/* Interactive Module Breakdown (FactoryMind) */}
          {project.modules.length > 0 && activeModule && (
            <SurfaceCard className="p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Layers
                    className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Implemented Engine Specification ({project.modules.length})</span>
                </div>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  Interactive Module Explorer
                </span>
              </div>

              <div
                role="tablist"
                aria-label="Case study module details"
                className="flex flex-wrap gap-2"
              >
                {project.modules.map((mod, idx) => {
                  const active = mod.id === activeModule.id;
                  return (
                    <button
                      key={mod.id}
                      id={`cs-tab-${mod.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="cs-module-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveModuleId(mod.id)}
                      onKeyDown={(e) => {
                        let nextIdx: number | null = null;
                        if (e.key === 'ArrowRight') {
                          nextIdx = (idx + 1) % project.modules.length;
                        } else if (e.key === 'ArrowLeft') {
                          nextIdx = (idx - 1 + project.modules.length) % project.modules.length;
                        } else if (e.key === 'Home') {
                          nextIdx = 0;
                        } else if (e.key === 'End') {
                          nextIdx = project.modules.length - 1;
                        }
                        if (nextIdx !== null) {
                          e.preventDefault();
                          const target = project.modules[nextIdx];
                          if (target) {
                            setActiveModuleId(target.id);
                            document.getElementById(`cs-tab-${target.id}`)?.focus();
                          }
                        }
                      }}
                      className={`min-h-[38px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#060b16] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {mod.name}
                    </button>
                  );
                })}
              </div>

              <div
                id="cs-module-panel"
                role="tabpanel"
                aria-labelledby={`cs-tab-${activeModule.id}`}
                className="grid gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-4 sm:grid-cols-2"
              >
                <div className="space-y-1.5">
                  <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                    {activeModule.name}
                  </h4>
                  <p className={DESIGN_TOKENS.typography.body}>
                    {activeModule.description}
                  </p>
                </div>
                <div className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                  <p className="font-mono text-[11px] text-slate-500">
                    Methods &amp; Domain Context
                  </p>
                  <p>{activeModule.methods.join(' · ')}</p>
                  <p className="text-slate-600 dark:text-slate-400">
                    {activeModule.domainContext}
                  </p>
                </div>
              </div>
            </SurfaceCard>
          )}

          {/* Grouped Technology Stack */}
          <div className="space-y-4 pt-2">
            <p className="font-mono text-xs text-slate-600 dark:text-slate-400">
              Technology Stack Breakdown
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              {caseStudy.technologyStackGroups.map((group) => (
                <SurfaceCard key={group.group} className="p-5 space-y-2.5">
                  <h3 className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {group.group}
                  </h3>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {group.items.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </SurfaceCard>
              ))}
            </div>
          </div>
        </section>

        {/* 07. Core Features */}
        <section id="cs-features" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                07 · Core Features
              </p>
              <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
                Feature Matrix by Implementation State
              </h2>
            </div>

            {caseStudy.coreFeatures.length > 1 && (
              <div
                role="group"
                aria-label="Filter core features by maturity state"
                className="flex flex-wrap gap-1.5"
              >
                {(
                  [
                    { id: 'all', label: 'All' },
                    { id: 'implemented', label: 'Implemented' },
                    { id: 'experimental', label: 'Experimental / Proposed' },
                    { id: 'planned', label: 'Planned / Pending' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={featureFilter === item.id}
                    onClick={() => setFeatureFilter(item.id)}
                    className={`min-h-[34px] rounded-[8px] border px-3 py-1 font-mono text-[11px] transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                      featureFilter === item.id
                        ? 'border-blue-600/80 dark:border-cyan-400/70 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredFeatures.length === 0 ? (
              <SurfaceCard className="p-6 md:col-span-2 text-center space-y-2">
                <p className={DESIGN_TOKENS.typography.bodyMuted}>
                  No core features recorded under this maturity filter for {project.title}.
                </p>
                <button
                  type="button"
                  onClick={() => setFeatureFilter('all')}
                  className="font-mono text-xs text-blue-700 dark:text-cyan-300 underline cursor-pointer"
                >
                  Show All Features
                </button>
              </SurfaceCard>
            ) : (
              filteredFeatures.map((feature) => {
                const stateMeta = formatMaturityLabel(feature.maturity);
                return (
                  <SurfaceCard key={feature.id} className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
                      <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                        {feature.name}
                      </h3>
                      <span className={`font-mono text-[11px] font-medium ${stateMeta.className}`}>
                        {stateMeta.glyph} {feature.maturity}
                      </span>
                    </div>
                    <p className={DESIGN_TOKENS.typography.body}>
                      {feature.description}
                    </p>
                    <p className="font-mono text-[11px] text-slate-500">
                      Basis: {feature.technicalBasis}
                    </p>
                  </SurfaceCard>
                );
              })
            )}
          </div>
        </section>

        {/* 08. Screenshots and Demonstrations (With Zoom Gallery) */}
        <section id="cs-screenshots" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              08 · Screenshots and Demonstrations
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Zoomable Media Gallery &amp; Capture Transparency
            </h2>
            <p className={DESIGN_TOKENS.typography.body}>
              Click any visual panel to inspect at up to 200% zoom. Conceptual illustrations and blueprints are separated from verified UI screen captures so nothing is presented misleadingly.
            </p>
          </div>

          <ProjectZoomGallery
            projectId={project.id}
            projectTitle={project.title}
            screenshots={caseStudy.screenshots}
          />
        </section>

        {/* 09. Challenges and Engineering Decisions */}
        <section id="cs-decisions" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              09 · Challenges and Engineering Decisions
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Technical Constraints, Architectural Choices &amp; Trade-Offs
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2">
            {caseStudy.engineeringDecisions.map((entry, idx) => (
              <SurfaceCard key={entry.id} className="p-5 space-y-3">
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 tabular-nums">
                  Decision {String(idx + 1).padStart(2, '0')}
                </p>
                <div className="space-y-1">
                  <p className="font-mono text-[10.5px] text-slate-500">Challenge</p>
                  <p className="text-xs font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
                    {entry.challenge}
                  </p>
                </div>
                <div className="space-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2.5">
                  <p className="font-mono text-[10.5px] text-slate-500">Decision &amp; Rationale</p>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {entry.decision} {entry.rationale}
                  </p>
                </div>
                <div className="space-y-1 border-t border-slate-200 dark:border-slate-800/80 pt-2.5">
                  <p className="font-mono text-[10.5px] text-slate-500">Known Trade-Off</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {entry.tradeoff}
                  </p>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </section>

        {/* 10. Testing and Validation */}
        <section id="cs-validation" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              10 · Testing and Validation
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Verification Methods &amp; Empirical Benchmark Scope
            </h2>
          </div>

          <ProjectValidationSection
            project={project}
            experiments={RESEARCH_EXPERIMENTS}
            manuscripts={RESEARCH_MANUSCRIPTS}
            datasets={RESEARCH_DATASETS}
          />
        </section>

        {/* 11. Current Limitations */}
        <section id="cs-limitations" className="scroll-mt-24 py-12 sm:py-16 space-y-6">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              11 · Current Limitations
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Explicit Scope Boundaries &amp; Missing Evidence
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SurfaceCard className="p-6 space-y-3">
              <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Technical &amp; Empirical Constraints
              </h3>
              <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {caseStudy.currentLimitations.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </SurfaceCard>

            <SurfaceCard className="p-6 space-y-3">
              <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Present Milestone State
              </h3>
              <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {caseStudy.currentProgress.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </SurfaceCard>
          </div>
        </section>

        {/* 12. Future Development */}
        <section id="cs-future" className="scroll-mt-24 py-12 sm:py-16 space-y-8">
          <div className="space-y-2 max-w-3xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              12 · Future Development
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Planned Roadmap &amp; Grounded Contribution
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SurfaceCard className="p-6 space-y-3">
              <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Planned Engineering &amp; Research Roadmap
              </h3>
              <ul className="space-y-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {caseStudy.futureDevelopment.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </SurfaceCard>

            <SurfaceCard variant="accent" className="p-6 space-y-3">
              <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Grounded Contribution Summary
              </h3>
              <p className={DESIGN_TOKENS.typography.body}>{caseStudy.impact}</p>
            </SurfaceCard>
          </div>

          {/* Previous / Next Case Study Navigation */}
          <nav
            aria-label="Navigate between project case studies"
            className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-8"
          >
            {previous ? (
              <LinkButton
                to={`/projects/${previous.id}`}
                variant="secondary"
                size="sm"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous: {previous.title}</span>
              </LinkButton>
            ) : (
              <LinkButton to="/projects" variant="ghost" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>All Projects</span>
              </LinkButton>
            )}

            {next ? (
              <LinkButton
                to={`/projects/${next.id}`}
                variant="secondary"
                size="sm"
              >
                <span>Next: {next.title}</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            ) : (
              <LinkButton to="/projects" variant="ghost" size="sm">
                <span>Back to Project Laboratory</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            )}
          </nav>
        </section>
      </div>
    </article>
  );
}
