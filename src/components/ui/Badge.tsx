import type { ReactNode } from 'react';

type BadgeTone = 'neutral' | 'blue' | 'cyan';

const TONE_CLASSES: Record<BadgeTone, string> = {
  neutral:
    'border-wood-default dark:border-slate-700/70 bg-wood-inset/80 dark:bg-[#060b16] text-wood-walnut dark:text-slate-300',
  blue:
    'border-blue-700/25 dark:border-blue-500/35 bg-blue-100/70 dark:bg-blue-500/10 text-blue-800 dark:text-blue-300',
  cyan:
    'border-cyan-800/25 dark:border-cyan-400/35 bg-cyan-100/65 dark:bg-cyan-400/10 text-cyan-900 dark:text-cyan-300',
};

interface BadgeProps {
  tone?: BadgeTone;
  wrap?: boolean;
  children: ReactNode;
  className?: string;
}

export function Badge({
  tone = 'neutral',
  wrap = false,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-[6px] border px-2 py-0.5 font-mono text-[11px] font-medium ${
        wrap ? 'whitespace-normal leading-snug' : 'whitespace-nowrap'
      } ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
