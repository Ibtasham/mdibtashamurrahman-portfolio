import { Link } from 'react-router-dom';
import { ArrowUpRight, Download } from 'lucide-react';
import { PROFILE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';

export function Footer() {
  return (
    <footer className="border-t border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914] bg-ipe-machinery pt-12 pb-20 md:pb-16">
      <div className={DESIGN_TOKENS.spacing.container}>
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5 space-y-3">
            <Link
              to="/"
              className="font-display text-lg font-semibold tracking-tight text-wood-ink dark:text-slate-50 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
            >
              {PROFILE.name}
            </Link>
            <p className={`${DESIGN_TOKENS.typography.bodyMuted} max-w-md`}>
              {PROFILE.headline} · {PROFILE.university}. Focusing on smart manufacturing, operations optimization, predictive maintenance, and student leadership.
            </p>
            <p className={DESIGN_TOKENS.typography.monoMicro}>
              {PROFILE.academicBase} · {PROFILE.publicLocation}
            </p>
          </div>

          <div className="md:col-span-3 space-y-3">
            <h2 className="text-xs font-semibold tracking-wide text-wood-walnut dark:text-slate-300">
              Portfolio Sections
            </h2>
            <ul className="space-y-0.5 md:space-y-2 text-sm text-wood-muted dark:text-slate-400">
              <li>
                <Link to="/about" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  About &amp; Academics
                </Link>
              </li>
              <li>
                <Link to="/studio" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  3D Engineering Studio
                </Link>
              </li>
              <li>
                <Link to="/projects" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Engineering Projects
                </Link>
              </li>
              <li>
                <Link to="/research" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Research Manuscripts
                </Link>
              </li>
              <li>
                <Link to="/innovation" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Innovation &amp; Entrepreneurship
                </Link>
              </li>
              <li>
                <Link to="/experience" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Leadership &amp; Outreach
                </Link>
              </li>
              <li>
                <Link to="/awards" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Achievements &amp; Awards
                </Link>
              </li>
              <li>
                <Link to="/archive" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Visual Achievement Archive
                </Link>
              </li>
              <li>
                <Link to="/skills" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Skills &amp; Certificates
                </Link>
              </li>
              <li>
                <Link to="/contact" className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300">
                  Contact &amp; Inquiries
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h2 className="text-xs font-semibold tracking-wide text-wood-walnut dark:text-slate-300">
              Connect &amp; Verification
            </h2>
            <ul className="space-y-0.5 md:space-y-2 text-sm text-wood-muted dark:text-slate-400">
              <li>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="inline-flex min-h-[36px] md:min-h-0 items-center py-1 md:py-0 break-all transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  {PROFILE.email}
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.links.cvPdf}
                  download="MD_Ibtashamur_Rahman_CV.pdf"
                  className="inline-flex min-h-[36px] md:min-h-0 items-center gap-1.5 py-1 md:py-0 font-medium text-blue-700 dark:text-cyan-300 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-200"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Download CV (PDF)</span>
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] md:min-h-0 items-center gap-1 py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <span>LinkedIn Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] md:min-h-0 items-center gap-1 py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <span>GitHub Profile</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.links.factoryMind}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] md:min-h-0 items-center gap-1 py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <span>FactoryMind on GitHub</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
              <li>
                <a
                  href={PROFILE.links.researchOdysseyCertificate}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-[36px] md:min-h-0 items-center gap-1 py-1 md:py-0 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300"
                >
                  <span>Research Odyssey 2.0 Certificate</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-wood-subtle dark:border-slate-800/70 pt-6 text-xs text-wood-muted dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {PROFILE.name}. All rights reserved.</p>
          <p className="font-mono text-wood-muted dark:text-slate-400">
            B.Sc. IPE (2024–25) · Sylhet, Bangladesh
          </p>
        </div>
      </div>
    </footer>
  );
}
