import { useState } from 'react';
import { Expand, Layers } from 'lucide-react';
import { resolveProjectPreviewImage } from '../../utils/projectMedia';

interface ProjectPreviewImageProps {
  projectId: string;
  title: string;
  alt: string;
  customUrl?: string;
  kindLabel?: string;
  onZoom?: () => void;
  className?: string;
}

export function ProjectPreviewImage({
  projectId,
  title,
  alt,
  customUrl,
  kindLabel,
  onZoom,
  className = '',
}: ProjectPreviewImageProps) {
  const [failed, setFailed] = useState(false);
  const src = resolveProjectPreviewImage(projectId, customUrl);
  const mediaLabel =
    kindLabel ??
    (customUrl ? 'Verified Product Screenshot' : 'Conceptual Illustration');
  const isVerifiedScreenshot = mediaLabel === 'Verified Product Screenshot' || mediaLabel === 'Verified Screenshot';

  const mediaContent = src && !failed ? (
    <img
      src={src}
      alt={alt}
      width={1280}
      height={720}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
    />
  ) : (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-[radial-gradient(circle_at_top,rgba(37,99,235,0.12),transparent_70%)] p-6 text-center">
      <Layers className="h-6 w-6 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
      <span className="font-mono text-xs font-medium text-wood-ink dark:text-slate-200">
        {title}
      </span>
      <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
        Architectural Preview
      </span>
    </div>
  );

  return (
    <div
      className={`overflow-hidden rounded-[10px] border border-wood-subtle dark:border-slate-800/80 bg-wood-inset dark:bg-[#060b16] ${className}`}
    >
      {onZoom ? (
        <button
          type="button"
          onClick={onZoom}
          aria-label={`Zoom preview image: ${title}`}
          className="group relative block aspect-video w-full overflow-hidden text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-zoom-in"
        >
          {mediaContent}
          <span className="sr-only">Open zoom viewer</span>
        </button>
      ) : (
        <div className="relative aspect-video w-full overflow-hidden">
          {mediaContent}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 border-t border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#060b16] px-3 py-1.5 font-mono text-[10.5px]">
        <span
          className={`whitespace-nowrap truncate ${
            isVerifiedScreenshot
              ? 'text-emerald-700 dark:text-emerald-300 font-medium'
              : 'text-wood-muted dark:text-slate-400'
          }`}
        >
          {isVerifiedScreenshot ? '● ' : '◐ '}
          {mediaLabel}
        </span>

        {onZoom ? (
          <button
            type="button"
            onClick={onZoom}
            className="inline-flex items-center gap-1 text-blue-700 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] cursor-pointer whitespace-nowrap shrink-0"
          >
            <Expand className="h-3 w-3" aria-hidden="true" />
            <span>Zoom</span>
          </button>
        ) : (
          <span className="text-wood-muted dark:text-slate-400 whitespace-nowrap shrink-0">
            {isVerifiedScreenshot ? 'UI Capture' : 'Conceptual'}
          </span>
        )}
      </div>
    </div>
  );
}
