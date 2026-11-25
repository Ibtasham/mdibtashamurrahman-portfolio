interface OrganizationMarkProps {
  code: string;
  organization: string;
  logoUrl?: string;
  active?: boolean;
  size?: 'sm' | 'md';
}

export function OrganizationMark({
  code,
  organization,
  logoUrl,
  active = false,
  size = 'md',
}: OrganizationMarkProps) {
  const dimensions = size === 'sm' ? 'h-9 w-9 rounded-[9px]' : 'h-10 w-10 rounded-[10px]';
  const textScale =
    code.length >= 6
      ? 'text-[9px] tracking-tight'
      : code.length >= 4
        ? 'text-[10px] tracking-tight'
        : 'text-[11px] tracking-wider';

  if (logoUrl) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center overflow-hidden border bg-wood-inset dark:bg-[#060b16] p-1 ${dimensions} ${
          active ? 'border-cyan-600/45 dark:border-cyan-500/45' : 'border-wood-subtle dark:border-slate-800/90'
        }`}
        title={organization}
      >
        <img
          src={logoUrl}
          alt={`${organization} emblem`}
          width={36}
          height={36}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-contain"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      title={organization}
      className={`flex shrink-0 select-none items-center justify-center border bg-wood-inset dark:bg-[#060b16] font-mono font-semibold uppercase ${dimensions} ${textScale} ${
        active
          ? 'border-cyan-600/45 dark:border-cyan-500/45 text-cyan-800 dark:text-cyan-300 dark:shadow-[inset_0_1px_0_rgba(34,211,238,0.08)]'
          : 'border-wood-subtle dark:border-slate-800 text-wood-muted dark:text-slate-400'
      }`}
    >
      {code}
    </div>
  );
}
