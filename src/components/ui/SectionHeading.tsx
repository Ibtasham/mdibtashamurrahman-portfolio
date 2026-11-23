import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { DESIGN_TOKENS } from '../../styles/designSystem';

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  actionLabel,
  actionTo,
}: SectionHeadingProps) {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6 md:flex-row md:items-end md:justify-between">
      <div className="space-y-2.5 max-w-2xl">
        <div className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
          <span>{index}.</span>
          <span aria-hidden="true" className="text-slate-400 dark:text-slate-600">/</span>
          <span className="text-slate-600 dark:text-slate-400">{eyebrow}</span>
        </div>
        <h2 className={DESIGN_TOKENS.typography.sectionTitle}>
          {title}
        </h2>
        {description && (
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="group inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-2 self-start py-1.5 sm:py-1 text-sm font-medium text-blue-700 dark:text-blue-400 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] whitespace-nowrap shrink-0 md:self-auto"
        >
          <span>{actionLabel}</span>
          <ArrowRight
            className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
