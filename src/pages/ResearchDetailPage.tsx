import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  CheckCircle2,
  Compass,
  Copy,
  FileCode2,
  FlaskConical,
  ShieldCheck,
} from 'lucide-react';
import { PROFILE, RESEARCH_MANUSCRIPTS } from '../data/portfolio';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { DESIGN_TOKENS } from '../styles/designSystem';
import { resolveStudioModelId } from '../three/studioConfig';
import { buildManuscriptBibTeX, getResearchNavigation } from '../utils/portfolioFilters';
import { ResearchPipelineDiagram } from '../components/research/ResearchPipelineDiagram';
import { LinkButton } from '../components/ui/Button';
import { SurfaceCard } from '../components/ui/SurfaceCard';

export function ResearchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { study, previous, next } = getResearchNavigation(RESEARCH_MANUSCRIPTS, id);
  const [showBibtex, setShowBibtex] = useState(false);
  const [copiedBibtex, setCopiedBibtex] = useState(false);

  usePageMetadata({
    title: study ? `${study.cardTitle ?? study.title} — Research Study` : 'Research Study Not Found',
    description: study
      ? study.abstract
      : 'Unpublished research study details in Industrial & Production Engineering.',
    path: study ? `/research/${study.id}` : '/research',
    schemaType: 'ScholarlyArticle',
  });

  const handleCopyBibtex = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedBibtex(true);
      window.setTimeout(() => setCopiedBibtex(false), 2000);
    } catch {
      setCopiedBibtex(false);
    }
  };

  if (!study) {
    return (
      <section className="mx-auto max-w-4xl px-6 py-24 text-center space-y-5">
        <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
          Research Study Not Found
        </p>
        <h1 className={DESIGN_TOKENS.typography.pageTitle}>
          This research study entry could not be located.
        </h1>
        <p className={DESIGN_TOKENS.typography.body}>
          Return to Research &amp; Ongoing Work to inspect the three active unpublished studies.
        </p>
        <LinkButton to="/research" variant="primary" size="md">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Back to Research &amp; Ongoing Work</span>
        </LinkButton>
      </section>
    );
  }

  return (
    <article className="bg-wood-canvas dark:bg-[#050914]">
      <header className="relative overflow-hidden border-b border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914] bg-blueprint-grid py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ambient-hero-light"
        />

        <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-6`}>
          <Link
            to="/research"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-wood-muted dark:text-slate-400 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Research &amp; Ongoing Work</span>
          </Link>

          <div className="space-y-4 max-w-4xl">
            <div className="space-y-1 font-mono text-xs">
              <p className="text-cyan-700 dark:text-cyan-400">
                {study.researchArea ?? study.domain}
              </p>
              <p className="text-wood-muted dark:text-slate-400">
                Status: {study.status} (Benchmark &amp; Simulation Study · No DOI Assigned)
              </p>
            </div>

            <h1 className={`${DESIGN_TOKENS.typography.pageTitle} text-balance`}>{study.title}</h1>

            {study.workingTitle && (
              <p className="font-mono text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                Working manuscript title: {study.workingTitle}
              </p>
            )}

            <p className={DESIGN_TOKENS.typography.editorialLead}>{study.abstract}</p>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {study.methods.map((tag) => (
                <span
                  key={tag}
                  className="rounded-[6px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-2.5 py-1 font-mono text-[11px] text-wood-walnut dark:text-slate-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {study.relatedProjectId && (
                <LinkButton
                  to={`/projects/${study.relatedProjectId}`}
                  variant="primary"
                  size="sm"
                >
                  <span>Inspect Associated System</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </LinkButton>
              )}

              <LinkButton
                to={`/studio?model=${resolveStudioModelId(study.id)}`}
                variant="secondary"
                size="sm"
              >
                <Box className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Inspect 3D Testbed</span>
              </LinkButton>

              <button
                type="button"
                onClick={() => setShowBibtex((prev) => !prev)}
                aria-expanded={showBibtex}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-[10px] border border-wood-default dark:border-slate-700/80 bg-wood-surface dark:bg-[#0b1222] px-3.5 py-2 text-xs font-medium text-wood-ink dark:text-slate-200 transition-colors hover:border-blue-500/60 hover:bg-wood-hover hover:text-blue-700 dark:hover:text-white cursor-pointer"
              >
                <FileCode2 className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                <span>{showBibtex ? 'Hide BibTeX Reference' : 'Unpublished BibTeX'}</span>
              </button>

              <a
                href={`mailto:${PROFILE.email}?subject=${encodeURIComponent(
                  `Research Inquiry: ${study.title}`,
                )}`}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-[10px] border border-wood-default dark:border-slate-700/80 bg-wood-surface dark:bg-[#0b1222] px-4 py-2 text-xs font-semibold text-wood-ink dark:text-slate-200 transition-colors hover:border-blue-500/60 hover:bg-wood-hover hover:text-blue-700 dark:hover:text-white"
              >
                <span>Research Inquiry</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {showBibtex && (
              <SurfaceCard className="p-4 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                    Working Reference (@unpublished · No DOI Assigned)
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      void handleCopyBibtex(buildManuscriptBibTeX(study, PROFILE.name))
                    }
                    className="inline-flex items-center gap-1.5 rounded-[7px] border border-wood-default dark:border-slate-700 px-2.5 py-1 font-mono text-[11px] text-wood-walnut dark:text-slate-200 hover:border-blue-500 cursor-pointer"
                  >
                    {copiedBibtex ? (
                      <>
                        <Check className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copy BibTeX</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre-wrap break-words rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#050914] p-3 font-mono text-[11px] leading-relaxed text-wood-walnut dark:text-slate-300">
                  {buildManuscriptBibTeX(study, PROFILE.name)}
                </pre>
              </SurfaceCard>
            )}
          </div>
        </div>
      </header>

      <div className={`${DESIGN_TOKENS.spacing.container} divide-y divide-wood-subtle dark:divide-slate-800/80`}>
        {/* Academic Integrity & Confidentiality Note */}
        <section className="py-6">
          <div className="flex items-start gap-2.5 rounded-[12px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-4 py-3 text-xs text-wood-muted dark:text-slate-400">
            <ShieldCheck
              className="mt-0.5 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-400"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong className="font-semibold text-wood-ink dark:text-slate-100">
                Confidentiality &amp; Benchmark Scope:
              </strong>{' '}
              This study is {study.status} conducted on benchmark and simulation environments. Complete manuscript files, unpublished numerical result tables, and unapproved figures remain private and are not published here.
            </p>
          </div>
        </section>

        {/* Conceptual Study Methodology Visualization */}
        <section className="py-10">
          <ResearchPipelineDiagram studyId={study.id} />
        </section>

        {/* Scope, Motivation, Research Questions, Methodology & Contribution Areas */}
        <section className="py-12 grid gap-8 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-5">
            <div className="space-y-2">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                Problem, Motivation &amp; Contributions
              </p>
              <h2 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Study Overview Parameters
              </h2>
            </div>

            <SurfaceCard className="p-5 space-y-4">
              <div>
                <p className="font-mono text-[11px] text-wood-muted">
                  Datasets &amp; Benchmark Scope
                </p>
                <p className="mt-1 font-mono text-xs text-wood-ink dark:text-slate-200">
                  {study.datasetsOrBenchmarks}
                </p>
              </div>
              <div className="border-t border-wood-subtle dark:border-slate-800/80 pt-3">
                <p className="font-mono text-[11px] text-wood-muted">
                  Research Problem &amp; Motivation
                </p>
                <p className="mt-1 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                  {study.motivation}
                </p>
              </div>
              <div className="border-t border-wood-subtle dark:border-slate-800/80 pt-3">
                <p className="font-mono text-[11px] text-wood-muted">
                  Technical Approaches
                </p>
                <p className="mt-1 font-mono text-xs leading-relaxed text-cyan-700 dark:text-cyan-300">
                  {study.methods.join(' · ')}
                </p>
              </div>
              <div className="border-t border-wood-subtle dark:border-slate-800/80 pt-3">
                <p className="font-mono text-[11px] text-wood-muted">
                  Contribution Areas to Communicate
                </p>
                <ul className="mt-1.5 space-y-1.5 text-xs leading-relaxed text-wood-ink dark:text-slate-200">
                  {(study.contributionAreas ?? [study.expectedContribution]).map((area) => (
                    <li key={area}>• {area}</li>
                  ))}
                </ul>
              </div>
            </SurfaceCard>
          </div>

          <div className="space-y-5 lg:col-span-7">
            <div className="space-y-2">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                Research Design
              </p>
              <h2 className={DESIGN_TOKENS.typography.cardTitleLg}>
                Research Questions &amp; Methodology Scope
              </h2>
            </div>

            {study.researchQuestions && study.researchQuestions.length > 0 && (
              <SurfaceCard className="p-5 space-y-2.5">
                <h3 className="font-mono text-xs font-semibold text-wood-ink dark:text-slate-200">
                  Central Research Questions
                </h3>
                <ul className="space-y-2 text-sm text-wood-walnut dark:text-slate-300">
                  {study.researchQuestions.map((q) => (
                    <li key={q}>• {q}</li>
                  ))}
                </ul>
              </SurfaceCard>
            )}

            {study.methodologySteps && study.methodologySteps.length > 0 && (
              <SurfaceCard className="p-5 space-y-2.5">
                <h3 className="font-mono text-xs font-semibold text-wood-ink dark:text-slate-200">
                  Study Scope &amp; Methodology Sequence
                </h3>
                <ol className="space-y-2.5 text-sm text-wood-walnut dark:text-slate-300">
                  {study.methodologySteps.map((step, index) => (
                    <li key={step}>
                      <span className="font-mono text-xs text-cyan-700 dark:text-cyan-400 mr-2">
                        0{index + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </SurfaceCard>
            )}
          </div>
        </section>

        {/* Limitations & Future Research Directions */}
        <section className="py-12 space-y-6">
          <div className="space-y-1">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              Scope Boundaries &amp; Next Steps
            </p>
            <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
              Limitations &amp; Future Research Directions
            </h2>
            <p className="text-xs text-wood-muted dark:text-slate-400 sm:text-sm">
              Explicit boundary conditions identified in the study alongside planned next-stage research extensions.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <SurfaceCard className="p-6 space-y-3 border-amber-500/25">
              <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                <AlertTriangle
                  className="h-4 w-4 text-amber-700 dark:text-amber-400"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  Study Limitations
                </h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300 sm:text-sm">
                {(study.limitations ?? ['Scope restricted to benchmark and simulation evaluation.']).map(
                  (item) => (
                    <li key={item}>• {item}</li>
                  ),
                )}
              </ul>
            </SurfaceCard>

            <SurfaceCard variant="accent" className="p-6 space-y-3">
              <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                <Compass
                  className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  Future Research Directions
                </h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300 sm:text-sm">
                {(study.futureDirections ?? ['Planned validation beyond initial benchmark constraints.']).map(
                  (dir) => (
                    <li key={dir}>• {dir}</li>
                  ),
                )}
              </ul>
            </SurfaceCard>
          </div>

          {/* Explicit Separation: Completed vs Ongoing vs Proposed Work */}
          <div className="grid gap-5 md:grid-cols-3 pt-2">
            <SurfaceCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                <CheckCircle2
                  className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  Completed Setups
                </h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                {(study.completedWork ?? ['Baseline experiment framing documented.']).map(
                  (item) => (
                    <li key={item}>• {item}</li>
                  ),
                )}
              </ul>
            </SurfaceCard>

            <SurfaceCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                <Activity
                  className="h-4 w-4 text-blue-700 dark:text-blue-400"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  Ongoing Synthesis
                </h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                {(study.ongoingWork ?? ['Active evaluation and manuscript refinement.']).map(
                  (item) => (
                    <li key={item}>• {item}</li>
                  ),
                )}
              </ul>
            </SurfaceCard>

            <SurfaceCard className="p-5 space-y-3">
              <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-2.5">
                <FlaskConical
                  className="h-4 w-4 text-wood-muted dark:text-slate-400"
                  aria-hidden="true"
                />
                <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                  Proposed Next Steps
                </h3>
              </div>
              <ul className="space-y-2 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                {(study.proposedWork ?? ['Next-phase robustness and policy checks planned.']).map(
                  (item) => (
                    <li key={item}>• {item}</li>
                  ),
                )}
              </ul>
            </SurfaceCard>
          </div>
        </section>

        {/* Previous / Next Study Navigation */}
        <section className="py-8">
          <nav
            aria-label="Navigate between research studies"
            className="flex flex-wrap items-center justify-between gap-4"
          >
            {previous ? (
              <LinkButton to={`/research/${previous.id}`} variant="secondary" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Previous Study</span>
              </LinkButton>
            ) : (
              <LinkButton to="/research" variant="ghost" size="sm">
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span>All 3 Research Studies</span>
              </LinkButton>
            )}

            {next ? (
              <LinkButton to={`/research/${next.id}`} variant="secondary" size="sm">
                <span>Next Study</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            ) : (
              <LinkButton to="/research" variant="ghost" size="sm">
                <span>Back to Research &amp; Ongoing Work</span>
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            )}
          </nav>
        </section>
      </div>
    </article>
  );
}
