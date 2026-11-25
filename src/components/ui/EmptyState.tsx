import { SearchX } from 'lucide-react';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { Button } from './Button';
import { SurfaceCard } from './SurfaceCard';

interface EmptyStateProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title = 'No Matching Records',
  message,
  actionLabel,
  onAction,
  className = '',
}: EmptyStateProps) {
  return (
    <SurfaceCard className={`p-8 text-center space-y-3 ${className}`}>
      <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] text-cyan-700 dark:text-cyan-400">
        <SearchX className="h-4 w-4" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <h3 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
          {title}
        </h3>
        <p className={`${DESIGN_TOKENS.typography.bodyMuted} mx-auto max-w-md`}>
          {message}
        </p>
      </div>
      {actionLabel && onAction && (
        <div className="pt-1">
          <Button type="button" variant="secondary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </SurfaceCard>
  );
}
