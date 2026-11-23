import { ArrowLeft, Compass, FlaskConical, FolderGit2, Mail, ShieldCheck } from 'lucide-react';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { DESIGN_TOKENS } from '../styles/designSystem';
import { LinkButton } from '../components/ui/Button';
import { SurfaceCard } from '../components/ui/SurfaceCard';

export function NotFoundPage() {
  usePageMetadata({
    title: '404 — Route Not Found',
    description: 'The requested portfolio address could not be found.',
    path: '/404',
    noIndex: true,
  });

  return (
    <section className="relative overflow-hidden bg-slate-50 dark:bg-[#050914] bg-blueprint-grid py-20 sm:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-hero-light"
      />
      <div className={`relative ${DESIGN_TOKENS.spacing.container}`}>
        <SurfaceCard variant="accent" className="mx-auto max-w-2xl p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              404 · Route Not Found
            </p>
            <h1 className={DESIGN_TOKENS.typography.pageTitle}>
              This portfolio path does not exist.
            </h1>
            <p className={DESIGN_TOKENS.typography.body}>
              The requested address could not be matched to any project case study, research manuscript, leadership dossier, or portfolio section.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-5">
            <LinkButton to="/" variant="primary" size="md">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              <span>Return to Overview</span>
            </LinkButton>
            <LinkButton to="/projects" variant="secondary" size="md">
              <FolderGit2 className="h-4 w-4" aria-hidden="true" />
              <span>Project Lab</span>
            </LinkButton>
          </div>

          <div className="grid gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-5 sm:grid-cols-2">
            <LinkButton to="/research" variant="ghost" size="sm" className="justify-start">
              <FlaskConical className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              <span>Research &amp; Manuscripts</span>
            </LinkButton>
            <LinkButton to="/experience" variant="ghost" size="sm" className="justify-start">
              <ShieldCheck className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              <span>Experience &amp; Leadership</span>
            </LinkButton>
            <LinkButton to="/innovation" variant="ghost" size="sm" className="justify-start">
              <Compass className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              <span>Innovation &amp; Prototypes</span>
            </LinkButton>
            <LinkButton to="/contact" variant="ghost" size="sm" className="justify-start">
              <Mail className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
              <span>Get in Touch</span>
            </LinkButton>
          </div>
        </SurfaceCard>
      </div>
    </section>
  );
}
