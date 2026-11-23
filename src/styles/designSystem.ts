export const DESIGN_TOKENS = {
  colors: {
    canvas: '#050914',
    canvasAlt: '#080e1c',
    surface1: '#0b1222',
    surface2: '#101a30',
    surfaceInset: '#060b16',
    borderSubtle: 'rgba(148, 163, 184, 0.14)',
    borderAccent: 'rgba(59, 130, 246, 0.45)',
    electricBlue: '#2563eb',
    cyanHighlight: '#22d3ee',
  },
  typography: {
    heroDisplay:
      'font-display text-4xl font-bold tracking-[-0.03em] text-slate-950 dark:text-slate-50 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.06] text-balance',
    pageTitle:
      'font-display text-3xl font-bold tracking-[-0.025em] text-slate-950 dark:text-slate-50 sm:text-4xl text-balance',
    sectionTitle:
      'font-display text-2xl font-semibold tracking-[-0.02em] text-slate-950 dark:text-slate-50 sm:text-3xl text-balance',
    cardTitle:
      'font-display text-base font-semibold leading-snug text-slate-900 dark:text-slate-50',
    cardTitleLg:
      'font-display text-lg font-semibold leading-snug text-slate-900 dark:text-slate-50',
    editorialLead:
      'font-editorial text-lg leading-relaxed text-slate-800 dark:text-slate-200 sm:text-xl',
    editorialAbstract:
      'font-editorial text-[15px] leading-[1.68] text-slate-700 dark:text-slate-300',
    bodyLead: 'text-base leading-relaxed text-slate-700 dark:text-slate-300 sm:text-lg',
    body: 'text-sm leading-relaxed text-slate-700 dark:text-slate-300',
    bodyMuted: 'text-xs leading-relaxed text-slate-600 dark:text-slate-400 sm:text-[13px]',
    monoMeta: 'font-mono text-xs text-slate-600 dark:text-slate-400 tabular-nums',
    monoMicro: 'font-mono text-[11px] text-slate-600 dark:text-slate-400 tabular-nums',
  },
  spacing: {
    container: 'mx-auto max-w-6xl px-6',
    sectionY: 'py-16 sm:py-20',
    sectionStack: 'space-y-10 sm:space-y-12',
    gridGap: 'gap-5 sm:gap-6',
  },
  radii: {
    sm: 'rounded-[6px]',
    md: 'rounded-[10px]',
    lg: 'rounded-[14px]',
    xl: 'rounded-[18px]',
  },
  motion: {
    ease: [0.16, 1, 0.3, 1] as const,
    durationFast: 0.16,
    durationBase: 0.28,
    durationReveal: 0.42,
    viewport: { once: true, amount: 0.1 } as const,
  },
} as const;
