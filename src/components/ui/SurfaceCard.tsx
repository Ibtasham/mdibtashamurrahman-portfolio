import type { ReactNode } from 'react';

type SurfaceVariant = 'default' | 'interactive' | 'accent';

interface SurfaceCardProps {
  variant?: SurfaceVariant;
  className?: string;
  children: ReactNode;
  as?: 'div' | 'article';
}

export function SurfaceCard({
  variant = 'default',
  className = '',
  children,
  as: Component = 'div',
}: SurfaceCardProps) {
  const variantClass =
    variant === 'interactive'
      ? 'ds-surface-card ds-surface-card-interactive'
      : variant === 'accent'
        ? 'ds-surface-card !border-blue-500/45 dark:!border-blue-500/40'
        : 'ds-surface-card';

  return (
    <Component className={`min-w-0 rounded-[14px] ${variantClass} ${className}`}>
      {children}
    </Component>
  );
}
