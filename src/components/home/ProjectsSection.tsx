import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight, Cpu, Layers, Search } from 'lucide-react';
import { PROJECTS } from '../../data/portfolio';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import {
  PROJECT_CATEGORIES,
  countProjectsByCategory,
  filterProjects,
  type ProjectCategoryFilter,
} from '../../utils/portfolioFilters';
import { ProjectPreviewImage } from '../projects/ProjectPreviewImage';
import { ExternalLinkButton, LinkButton } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { ScrollRevealItem } from '../ui/ScrollRevealItem';
import { SectionHeading } from '../ui/SectionHeading';
import { SurfaceCard } from '../ui/SurfaceCard';

interface ProjectsSectionProps {
  expanded?: boolean;
}

const FILTER_OPTIONS: ProjectCategoryFilter[] = ['All', ...PROJECT_CATEGORIES];

function getStageStatusMeta(stage: (typeof PROJECTS)[number]['developmentStage']) {
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
        className: 'text-slate-600 dark:text-slate-400',
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

  const factoryMind = PROJECTS.find((p) => p.id === 'factorymind');
  const [activeModuleId, setActiveModuleId] = useState(
    factoryMind?.modules[0]?.id ?? 'scheduling',
  );
  const activeModule =
    factoryMind?.modules.find((m) => m.id === activeModuleId) ??
    factoryMind?.modules[0];

  return (
    <section
      id="projects"
      className={`border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] ${
        expanded ? 'py-10 sm:py-14' : DESIGN_TOKENS.spacing.sectionY
      }`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-10`}>
        {!expanded && (
          <SectionHeading
            index="02"
            eyebrow="Featured Projects"
            title="Engineering, Research & Software Case Studies"
            description="Evidence-driven engineering documentation spanning open-source manufacturing optimization, C-MAPSS prognostics research, and concept-stage software tracking."
            actionLabel="Open Full Laboratory"
            actionTo="/projects"
          />
        )}

        {/* Category Filter Controls + Project Search */}
        <div className="space-y-3 border-b border-slate-200 dark:border-slate-800/80 pb-5">
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
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
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
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
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
                  className="h-[38px] w-full rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] pr-3 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                />
              </div>
              <p className={`${DESIGN_TOKENS.typography.monoMicro} shrink-0`}>
                Showing {visibleProjects.length} of {PROJECTS.length} Projects
              </p>
            </div>
          </div>
        </div>

        {/* Project Cards Grid */}
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
          <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} lg:grid-cols-3 md:grid-cols-2`}>
            {visibleProjects.map((project, idx) => {
              const stageMeta = getStageStatusMeta(project.developmentStage);
              return (
                <ScrollRevealItem
                  key={project.id}
                  index={idx}
                  className="flex min-w-0"
                >
                  <SurfaceCard
                    as="article"
                    variant="interactive"
                    className="group flex w-full min-w-0 flex-col justify-between p-5"
                  >
                  <div className="space-y-4">
                    {/* Header Metadata (Zero-Pill Unboxed) */}
                    <div className="space-y-1.5 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 font-mono text-[11px]">
                        <span className="text-cyan-700 dark:text-cyan-400">
                          {project.categoryLabel}
                        </span>
                        <span className={`font-medium ${stageMeta.className}`}>
                          {stageMeta.glyph} {project.status}
                        </span>
                      </div>

                      <h3 className="font-display text-xl font-bold tracking-tight text-slate-950 dark:text-slate-50">
                        {project.title}
                      </h3>
                      <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                        {project.tagline}
                      </p>
                    </div>

                    <ProjectPreviewImage
                      projectId={project.id}
                      title={project.title}
                      alt={project.previewAlt}
                      customUrl={project.previewImageUrl}
                      kindLabel={project.previewKindLabel}
                    />

                    {/* One-Sentence Problem Statement + Main Technical Contribution */}
                    <dl className="space-y-2.5 text-xs leading-relaxed">
                      <div>
                        <dt className="font-mono text-[10.5px] text-slate-500">
                          Problem Statement
                        </dt>
                        <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
                          {project.oneSentenceProblem}
                        </dd>
                      </div>

                      <div>
                        <dt className="font-mono text-[10.5px] text-slate-500">
                          Main Technical Contribution
                        </dt>
                        <dd className="mt-0.5 text-slate-700 dark:text-slate-300">
                          {project.mainContribution}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  <div className="mt-5 space-y-4 border-t border-slate-200 dark:border-slate-800/80 pt-4">
                    <div>
                      <p className="font-mono text-[10.5px] text-slate-500 mb-1">
                        Technology Stack
                      </p>
                      <p className="font-mono text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                        {project.stack.join(' · ')}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <LinkButton
                        to={`/projects/${project.id}`}
                        variant="primary"
                        size="sm"
                      >
                        <span>View Case Study</span>
                        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                      </LinkButton>

                      {(project.id === 'factorymind' || project.id === 'forgemind-ai') && (
                        <LinkButton
                          to={`/studio?model=${
                            project.id === 'factorymind'
                              ? 'factorymind-cell'
                              : 'forgemind-turbofan'
                          }`}
                          variant="secondary"
                          size="sm"
                        >
                          <span>3D Rig</span>
                        </LinkButton>
                      )}

                      {project.githubUrl && (
                        <ExternalLinkButton
                          href={project.githubUrl}
                          variant="secondary"
                          size="sm"
                        >
                          <span>GitHub</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </ExternalLinkButton>
                      )}

                      {project.liveDemoUrl && (
                        <ExternalLinkButton
                          href={project.liveDemoUrl}
                          variant="secondary"
                          size="sm"
                        >
                          <span>Live Demo</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </ExternalLinkButton>
                      )}

                      {project.id === 'forgemind-ai' && (
                        <LinkButton
                          to="/research/decision-aware-prognostics"
                          variant="ghost"
                          size="sm"
                        >
                          <span>Study</span>
                        </LinkButton>
                      )}
                    </div>

                    {!project.githubUrl && (
                      <p className="font-mono text-[11px] text-slate-500">
                        {project.sourceNote}
                      </p>
                    )}
                  </div>
                </SurfaceCard>
                </ScrollRevealItem>
              );
            })}
          </div>
        )}

        {/* Interactive FactoryMind Module Workbench (Expanded Laboratory View) */}
        {expanded && factoryMind && activeModule && (
          <SurfaceCard className="p-6 sm:p-8">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-4">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800 dark:text-slate-200">
                  <Layers className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                  <span>
                    Interactive Module Workbench · FactoryMind ({factoryMind.modules.length} Implemented Engines)
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  ● Implemented in Python &amp; Streamlit · Bangladesh RMG Scenario
                </span>
              </div>

              <div
                role="tablist"
                aria-label="FactoryMind modules"
                className="flex flex-wrap gap-2"
              >
                {factoryMind.modules.map((mod, idx) => {
                  const active = mod.id === activeModule.id;
                  return (
                    <button
                      key={mod.id}
                      id={`fm-tab-${mod.id}`}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      aria-controls="factorymind-workbench-panel"
                      tabIndex={active ? 0 : -1}
                      onClick={() => setActiveModuleId(mod.id)}
                      onKeyDown={(e) => {
                        let nextIdx: number | null = null;
                        if (e.key === 'ArrowRight') {
                          nextIdx = (idx + 1) % factoryMind.modules.length;
                        } else if (e.key === 'ArrowLeft') {
                          nextIdx = (idx - 1 + factoryMind.modules.length) % factoryMind.modules.length;
                        } else if (e.key === 'Home') {
                          nextIdx = 0;
                        } else if (e.key === 'End') {
                          nextIdx = factoryMind.modules.length - 1;
                        }
                        if (nextIdx !== null) {
                          e.preventDefault();
                          const target = factoryMind.modules[nextIdx];
                          if (target) {
                            setActiveModuleId(target.id);
                            document.getElementById(`fm-tab-${target.id}`)?.focus();
                          }
                        }
                      }}
                      className={`min-h-[38px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600/80 dark:border-blue-500/80 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {mod.name}
                    </button>
                  );
                })}
              </div>

              <motion.div
                key={activeModule.id}
                id="factorymind-workbench-panel"
                role="tabpanel"
                aria-labelledby={`fm-tab-${activeModule.id}`}
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

                <div className="grid gap-4 border-t border-slate-200 dark:border-slate-800/80 pt-4 sm:grid-cols-2">
                  <div>
                    <p className="font-mono text-[11px] text-slate-500 mb-1">
                      Techniques Implemented
                    </p>
                    <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                      {activeModule.methods.map((method) => (
                        <li key={method}>• {method}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-mono text-[11px] text-slate-500 mb-1">
                      Industrial Application
                    </p>
                    <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
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
