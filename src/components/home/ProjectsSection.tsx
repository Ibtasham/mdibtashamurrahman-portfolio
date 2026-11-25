import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Cpu,
  ExternalLink,
  Layers,
  Search,
} from 'lucide-react';
import { PROJECTS } from '../../data/portfolio';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { ProjectEntry } from '../../types/portfolio';
import {
  PROJECT_CATEGORIES,
  countProjectsByCategory,
  filterProjects,
  type ProjectCategoryFilter,
} from '../../utils/portfolioFilters';
import { FeaturedProjectVisual } from '../projects/FeaturedProjectVisual';
import { ExternalLinkButton, LinkButton } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ScrollRevealItem } from '../ui/ScrollRevealItem';
import { SectionHeading } from '../ui/SectionHeading';
import { SurfaceCard } from '../ui/SurfaceCard';

interface ProjectsSectionProps {
  expanded?: boolean;
}

const FILTER_OPTIONS: ProjectCategoryFilter[] = ['All', ...PROJECT_CATEGORIES];

function getStageStatusMeta(stage: ProjectEntry['developmentStage']) {
  switch (stage) {
    case 'Active Prototype':
      return {
        glyph: '●',
        className: 'text-emerald-700 dark:text-emerald-300',
      };
    case 'Research Prototype':
      return {
        glyph: '◐',
        className: 'text-cyan-700 dark:text-cyan-300',
      };
    default:
      return {
        glyph: '◌',
        className: 'text-wood-muted dark:text-slate-400',
      };
  }
}

export function ProjectsSection({ expanded = false }: ProjectsSectionProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProjectCategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { shouldReduceMotion } = useMotionPreference();

  const categoryCounts = useMemo(() => countProjectsByCategory(PROJECTS), []);
  const visibleProjects = useMemo(
    () => filterProjects(PROJECTS, selectedCategory, searchQuery),
    [selectedCategory, searchQuery],
  );

  const workbenchProjects = useMemo(
    () => PROJECTS.filter((p) => p.modules.length > 0),
    [],
  );
  const [workbenchProjectId, setWorkbenchProjectId] = useState(
    workbenchProjects[0]?.id ?? 'factorymind',
  );
  const activeWorkbenchProject =
    workbenchProjects.find((p) => p.id === workbenchProjectId) ??
    workbenchProjects[0];

  const [activeModuleId, setActiveModuleId] = useState(
    activeWorkbenchProject?.modules[0]?.id ?? 'inventory-eoq',
  );
  const activeModule =
    activeWorkbenchProject?.modules.find((m) => m.id === activeModuleId) ??
    activeWorkbenchProject?.modules[0];

  const handleSelectWorkbenchProject = (projectId: string) => {
    setWorkbenchProjectId(projectId);
    const target = workbenchProjects.find((p) => p.id === projectId);
    if (target?.modules[0]) {
      setActiveModuleId(target.modules[0].id);
    }
  };

  return (
    <section
      id="projects"
      className={`border-b border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914] ${
        expanded ? 'py-10 sm:py-14' : DESIGN_TOKENS.spacing.sectionY
      }`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-10`}>
        {!expanded && (
          <SectionHeading
            index="02"
            eyebrow="Featured Projects"
            title="Engineering, Research & Software Showcase"
            description="Verified engineering software builds and prognostics research—featuring the FactoryMind industrial engineering workbench, the TikaTrack bilingual immunization PWA, and ForgeMind AI reliability studies."
            actionLabel="Open Full Laboratory"
            actionTo="/projects"
          />
        )}

        {/* Category Filter Controls + Project Search */}
        <div className="space-y-3 border-b border-wood-subtle dark:border-slate-800/80 pb-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div
              role="group"
              aria-label="Filter projects by category"
              className="flex flex-wrap gap-2"
            >
              {FILTER_OPTIONS.map((category) => {
                const active = selectedCategory === category;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedCategory(category)}
                    className={`min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                      active
                        ? 'border-blue-600/80 dark:border-blue-500/80 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                        : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] text-wood-muted dark:text-slate-400 hover:border-wood-default dark:hover:border-slate-700 hover:text-wood-ink dark:hover:text-slate-200'
                    }`}
                  >
                    {category} ({categoryCounts[category]})
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative w-full sm:w-64">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-wood-muted dark:text-slate-500"
                  aria-hidden="true"
                />
                <label htmlFor="projects-search" className="sr-only">
                  Search projects by name, domain, or stack
                </label>
                <input
                  id="projects-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects or stack..."
                  className="h-[38px] w-full rounded-[10px] border border-wood-default dark:border-slate-800 bg-wood-input dark:bg-[#0b1222] pr-3 pl-9 text-xs text-wood-ink dark:text-slate-100 placeholder:text-wood-muted/70 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                />
              </div>
              <p className={`${DESIGN_TOKENS.typography.monoMicro} shrink-0`}>
                Showing {visibleProjects.length} of {PROJECTS.length} Projects
              </p>
            </div>
          </div>
        </div>

        {/* Showcase Project Cards */}
        {visibleProjects.length === 0 ? (
          <EmptyState
            title="No Matching Projects"
            message="No projects match the active category and search filter."
            actionLabel="Reset Project Filters"
            onAction={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
          />
        ) : (
          <div className="space-y-8">
            {visibleProjects.map((project, idx) => {
              const stageMeta = getStageStatusMeta(project.developmentStage);

              if (
                project.id === 'factorymind' ||
                project.id === 'forgemind-ai' ||
                project.id === 'tikatrack'
              ) {
                const isFactoryMind = project.id === 'factorymind';
                const isForgeMind = project.id === 'forgemind-ai';
                const visualOnLeft = !isForgeMind;

                const cardFrameClasses = isFactoryMind
                  ? 'border border-emerald-700/25 dark:border-emerald-500/30 bg-wood-surface dark:bg-[#070f15] shadow-sm hover:border-emerald-700/45 dark:hover:border-emerald-400/45'
                  : isForgeMind
                    ? 'border border-cyan-700/25 dark:border-cyan-400/30 bg-gradient-to-br from-[#e7eef3] via-[#f4ebe0] to-[#ece6da] dark:from-[#061020] dark:via-[#081529] dark:to-[#070d19] shadow-sm hover:border-cyan-700/45 dark:hover:border-cyan-400/50'
                    : 'border border-teal-700/25 dark:border-emerald-400/25 bg-gradient-to-br from-[#e6ede0] via-[#f4ebe0] to-[#e1ece7] dark:from-[#051414] dark:via-[#071a19] dark:to-[#061118] shadow-sm hover:border-teal-700/45 dark:hover:border-emerald-400/45';

                const taglineColor = isFactoryMind
                  ? 'text-emerald-700 dark:text-emerald-300'
                  : isForgeMind
                    ? 'text-cyan-800 dark:text-cyan-300'
                    : 'text-teal-700 dark:text-emerald-300';

                const liveDemoBtnClass = isFactoryMind
                  ? '!bg-emerald-600 !border-emerald-600 hover:!bg-emerald-700 !text-white dark:!bg-emerald-500 dark:!border-emerald-500 dark:hover:!bg-emerald-400 dark:!text-slate-950'
                  : isForgeMind
                    ? '!bg-cyan-700 !border-cyan-700 hover:!bg-cyan-800 !text-white dark:!bg-cyan-400 dark:!border-cyan-400 dark:hover:!bg-cyan-300 dark:!text-slate-950'
                    : '!bg-teal-700 !border-teal-700 hover:!bg-teal-800 !text-white dark:!bg-emerald-400 dark:!border-emerald-400 dark:hover:!bg-emerald-300 dark:!text-slate-950';

                const bulletIconColor = isFactoryMind
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : isForgeMind
                    ? 'text-cyan-700 dark:text-cyan-400'
                    : 'text-teal-700 dark:text-emerald-400';

                const scopeBannerLabel = isForgeMind
                  ? 'Simulation Scope & Integrity:'
                  : 'Demo vs. Optional Backend:';

                return (
                  <ScrollRevealItem
                    key={project.id}
                    index={idx}
                    className="min-w-0"
                  >
                    <article
                      className={`group rounded-[16px] p-5 sm:p-6 transition-colors duration-200 ${cardFrameClasses}`}
                    >
                      <div className="grid items-start gap-6 lg:grid-cols-12 lg:gap-7">
                        {/* Interactive Project-Themed Visual */}
                        <div
                          className={`min-w-0 lg:col-span-6 ${
                            visualOnLeft ? 'lg:order-1' : 'lg:order-2'
                          }`}
                        >
                          <FeaturedProjectVisual
                            projectId={project.id}
                            title={project.title}
                            previewAlt={project.previewAlt}
                          />
                        </div>

                        {/* Project Dossier & Verifiable Technical Copy */}
                        <div
                          className={`min-w-0 flex flex-col justify-between space-y-3.5 lg:col-span-6 ${
                            visualOnLeft ? 'lg:order-2' : 'lg:order-1'
                          }`}
                        >
                          <div className="space-y-3">
                            <div className="space-y-1 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                              <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 font-mono text-[11px]">
                                <span className="text-wood-muted dark:text-slate-400">
                                  {project.categoryLabel}
                                </span>
                                <span className={`font-medium ${stageMeta.className}`}>
                                  {stageMeta.glyph} {project.status}
                                </span>
                              </div>

                              <h3 className="font-display text-2xl font-bold tracking-tight text-wood-ink dark:text-slate-50">
                                {project.title}
                              </h3>
                              <p className={`text-xs sm:text-sm font-medium ${taglineColor}`}>
                                {project.tagline}
                              </p>
                            </div>

                            <p className="text-xs sm:text-[13px] leading-relaxed text-wood-walnut dark:text-slate-300">
                              {project.summary}
                            </p>

                            <div className="space-y-0.5">
                              <p className="font-mono text-[10.5px] text-wood-muted">
                                Problem Addressed
                              </p>
                              <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                                {project.oneSentenceProblem}
                              </p>
                            </div>

                            {project.implementedHighlights &&
                              project.implementedHighlights.length > 0 && (
                                <div className="space-y-1.5">
                                  <p className="font-mono text-[10.5px] text-wood-muted">
                                    Key Implemented Features
                                  </p>
                                  <ul className="space-y-1 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                                    {project.implementedHighlights.map((highlight) => (
                                      <li key={highlight} className="flex items-start gap-2">
                                        <Check
                                          className={`mt-0.5 h-3.5 w-3.5 shrink-0 ${bulletIconColor}`}
                                          aria-hidden="true"
                                        />
                                        <span>{highlight}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                            {project.roleAndContribution && (
                              <div className="space-y-0.5">
                                <p className="font-mono text-[10.5px] text-wood-muted">
                                  Role &amp; Contribution
                                </p>
                                <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                                  {project.roleAndContribution}
                                </p>
                              </div>
                            )}

                            {project.scopeDistinctionNote && (
                              <p className="rounded-[10px] border border-wood-subtle dark:border-slate-800/80 bg-wood-inset/80 dark:bg-[#050b13]/80 px-3 py-2 text-[11px] leading-relaxed text-wood-muted dark:text-slate-400">
                                <span className="font-mono font-semibold text-wood-walnut dark:text-slate-300">
                                  {scopeBannerLabel}{' '}
                                </span>
                                {project.scopeDistinctionNote}
                              </p>
                            )}
                          </div>

                          <div className="space-y-3 border-t border-wood-subtle dark:border-slate-800/80 pt-3">
                            <div>
                              <p className="font-mono text-[10.5px] text-wood-muted mb-1">
                                Technologies &amp; Architecture
                              </p>
                              <p className="font-mono text-[11px] leading-relaxed text-wood-walnut dark:text-slate-300">
                                {project.stack.join(' · ')}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2.5">
                              {project.liveDemoUrl && (
                                <ExternalLinkButton
                                  href={project.liveDemoUrl}
                                  variant="primary"
                                  size="sm"
                                  className={liveDemoBtnClass}
                                >
                                  <span>Live Demo</span>
                                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                                </ExternalLinkButton>
                              )}

                              {project.githubUrl && (
                                <ExternalLinkButton
                                  href={project.githubUrl}
                                  variant="secondary"
                                  size="sm"
                                >
                                  <span>GitHub Source</span>
                                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                                </ExternalLinkButton>
                              )}

                              <LinkButton
                                to={`/projects/${project.id}`}
                                variant="secondary"
                                size="sm"
                              >
                                <span>Case Study</span>
                                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                              </LinkButton>

                              {(isFactoryMind || isForgeMind) && (
                                <LinkButton
                                  to={`/studio?model=${
                                    isFactoryMind ? 'factorymind-cell' : 'forgemind-turbofan'
                                  }`}
                                  variant="secondary"
                                  size="sm"
                                >
                                  <span>3D Rig</span>
                                </LinkButton>
                              )}

                              {isForgeMind && (
                                <LinkButton
                                  to="/research/decision-aware-prognostics"
                                  variant="secondary"
                                  size="sm"
                                >
                                  <span>Linked Study</span>
                                </LinkButton>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  </ScrollRevealItem>
                );
              }

              return null;
            })}
          </div>
        )}

        {/* Interactive Multi-Project Module Workbench (Expanded Laboratory View) */}
        {expanded && activeWorkbenchProject && activeModule && (
          <SurfaceCard className="p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-wood-ink dark:text-slate-200">
                  <Layers className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                  <span>
                    Interactive Module Workbench · {activeWorkbenchProject.title} (
                    {activeWorkbenchProject.modules.length} Verified Modules)
                  </span>
                </div>

                <div
                  role="group"
                  aria-label="Switch active workbench project"
                  className="inline-flex rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-0.5"
                >
                  {workbenchProjects.map((wp) => {
                    const isCurrent = wp.id === activeWorkbenchProject.id;
                    return (
                      <button
                        key={wp.id}
                        type="button"
                        aria-pressed={isCurrent}
                        onClick={() => handleSelectWorkbenchProject(wp.id)}
                        className={`rounded-[6px] px-3 py-1 font-mono text-[11px] transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                          isCurrent
                            ? 'bg-blue-600 text-white font-semibold'
                            : 'text-wood-muted dark:text-slate-400 hover:text-wood-ink dark:hover:text-slate-200'
                        }`}
                      >
                        {wp.title} ({wp.modules.length})
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-wood-muted dark:text-slate-400">
                <span>
                  ●{' '}
                  {activeWorkbenchProject.id === 'factorymind'
                    ? 'Pure TypeScript & React 19 Workbench · 12 Test Suites'
                    : activeWorkbenchProject.id === 'forgemind-ai'
                      ? 'Conformal Prognostics & D3 3D Workbench · 32 Engine Tests'
                      : 'Offline Bilingual Clinical PWA v12.0.0 · 46 Vitest Suites'}
                </span>
                {activeWorkbenchProject.liveDemoUrl && (
                  <a
                    href={activeWorkbenchProject.liveDemoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-blue-700 dark:text-cyan-300 hover:underline"
                  >
                    <span>Open {activeWorkbenchProject.title} Live Demo</span>
                    <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                  </a>
                )}
              </div>

              <div
                role="tablist"
                aria-label={`${activeWorkbenchProject.title} modules`}
                className="flex flex-wrap gap-2"
              >
                {activeWorkbenchProject.modules.map((mod, idx) => {
                  const active = mod.id === activeModule.id;
                  return (
                    <button
                      key={mod.id}
                      id={`wb-tab-${mod.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="project-workbench-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveModuleId(mod.id)}
                      onKeyDown={(e) => {
                        let nextIdx: number | null = null;
                        if (e.key === 'ArrowRight') {
                          nextIdx = (idx + 1) % activeWorkbenchProject.modules.length;
                        } else if (e.key === 'ArrowLeft') {
                          nextIdx =
                            (idx - 1 + activeWorkbenchProject.modules.length) %
                            activeWorkbenchProject.modules.length;
                        } else if (e.key === 'Home') {
                          nextIdx = 0;
                        } else if (e.key === 'End') {
                          nextIdx = activeWorkbenchProject.modules.length - 1;
                        }
                        if (nextIdx !== null) {
                          e.preventDefault();
                          const target = activeWorkbenchProject.modules[nextIdx];
                          if (target) {
                            setActiveModuleId(target.id);
                            document.getElementById(`wb-tab-${target.id}`)?.focus();
                          }
                        }
                      }}
                      className={`min-h-[38px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600/80 dark:border-blue-500/80 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                          : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#060b16] text-wood-muted dark:text-slate-400 hover:border-wood-default dark:hover:border-slate-700 hover:text-wood-ink dark:hover:text-slate-200'
                      }`}
                    >
                      {mod.name}
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={activeModule.id}
                id="project-workbench-panel"
                role="tabpanel"
                aria-labelledby={`wb-tab-${activeModule.id}`}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : DESIGN_TOKENS.motion.durationFast,
                  ease: DESIGN_TOKENS.motion.ease,
                }}
                className="space-y-4 pt-1"
              >
                <div className="flex items-start gap-3">
                  <Cpu className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <div className="space-y-1.5">
                    <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                      {activeModule.name}
                    </h4>
                    <p className={DESIGN_TOKENS.typography.body}>
                      {activeModule.description}
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 border-t border-wood-subtle dark:border-slate-800/80 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[11px] text-wood-muted mb-1">
                      Techniques Implemented
                    </p>
                    <ul className="space-y-1 text-xs text-wood-walnut dark:text-slate-300">
                      {activeModule.methods.map((method) => (
                        <li key={method}>• {method}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-wood-muted mb-1">
                      Applied Domain Scope
                    </p>
                    <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                      {activeModule.domainContext}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </SurfaceCard>
        )}
      </div>
    </section>
  );
}

