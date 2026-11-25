import { Play } from 'lucide-react';
import type { VisualArchiveKind } from '../../types/portfolio';
import { resolvePublicAssetUrl } from '../../utils/virtualGuide';

interface ArchiveMediaFrameProps {
  src: string;
  alt: string;
  kind?: VisualArchiveKind;
  mediaType?: 'image' | 'video';
  rotateDeg?: 90 | 180 | 270;
  extraRotateDeg?: 0 | 90 | 180 | 270;
  focalPosition?: 'top' | 'upper' | 'center' | 'bottom' | 'lower';
  mode?: 'thumbnail' | 'lightbox';
  className?: string;
}

const FOCAL_POSITION_CLASSES: Record<
  'top' | 'upper' | 'center' | 'bottom' | 'lower',
  string
> = {
  top: 'object-top',
  upper: 'object-[50%_22%]',
  center: 'object-center',
  bottom: 'object-bottom',
  lower: 'object-[50%_74%]',
};

export function isArchiveVideoAsset(
  src: string,
  kind?: VisualArchiveKind,
  mediaType?: 'image' | 'video',
): boolean {
  return (
    mediaType === 'video' ||
    kind === 'Video Submission' ||
    /\.(mp4|webm|mov)(\?.*)?$/i.test(src)
  );
}

export function ArchiveMediaFrame({
  src,
  alt,
  kind = 'Event Photograph',
  mediaType,
  rotateDeg,
  extraRotateDeg = 0,
  focalPosition,
  mode = 'thumbnail',
  className = '',
}: ArchiveMediaFrameProps) {
  const resolvedSrc = resolvePublicAssetUrl(src);
  const isVideo = isArchiveVideoAsset(src, kind, mediaType);

  if (isVideo) {
    if (mode === 'lightbox') {
      return (
        <div
          className={`relative flex aspect-video max-h-[56vh] w-full items-center justify-center overflow-hidden rounded-[8px] bg-slate-950 ${className}`}
        >
          <video
            key={resolvedSrc}
            src={resolvedSrc}
            controls
            playsInline
            preload="metadata"
            aria-label={alt}
            className="h-full max-h-[56vh] w-full object-contain"
          >
            Your browser does not support embedded video playback.
          </video>
        </div>
      );
    }

    return (
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-950 ${className}`}
      >
        <video
          src={`${resolvedSrc}#t=1.8`}
          muted
          playsInline
          preload="metadata"
          aria-label={alt}
          className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute top-2.5 left-2.5 inline-flex items-center gap-1 rounded-[6px] border border-cyan-400/50 bg-[#050914]/85 px-2 py-0.5 font-mono text-[10px] font-semibold text-cyan-300 backdrop-blur-sm"
        >
          <Play className="h-2.5 w-2.5 fill-current" />
          <span>VIDEO</span>
        </span>
      </div>
    );
  }

  const effectiveRotate = (((rotateDeg ?? 0) + extraRotateDeg) % 360) as
    | 0
    | 90
    | 180
    | 270;
  const isRotatedQuarter = effectiveRotate === 90 || effectiveRotate === 270;
  const rotationClass =
    effectiveRotate === 90
      ? 'rotate-90'
      : effectiveRotate === 180
        ? 'rotate-180'
        : effectiveRotate === 270
          ? '-rotate-90'
          : '';

  const isDocument =
    kind === 'Certificate' ||
    kind === 'Appointment Letter' ||
    kind === 'Official Poster';

  const useContain = mode === 'lightbox' || isDocument || isRotatedQuarter;
  const docPaddingClass =
    mode === 'thumbnail' && (kind === 'Certificate' || kind === 'Appointment Letter')
      ? 'p-2'
      : '';

  const resolvedFocal =
    focalPosition ?? (kind === 'Portrait' ? 'top' : 'center');
  const objectPositionClass = FOCAL_POSITION_CLASSES[resolvedFocal];

  if (isRotatedQuarter) {
    return (
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-wood-inset dark:bg-[#060b16] ${docPaddingClass} ${className}`}
      >
        <img
          src={resolvedSrc}
          alt={alt}
          width={1200}
          height={900}
          loading={mode === 'lightbox' ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`h-[126%] w-auto max-w-none object-contain transition-transform duration-300 motion-reduce:transition-none ${rotationClass}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-wood-inset dark:bg-[#060b16] ${docPaddingClass} ${className}`}
    >
      <img
        src={resolvedSrc}
        alt={alt}
        width={1200}
        height={900}
        loading={mode === 'lightbox' ? 'eager' : 'lazy'}
        decoding="async"
        referrerPolicy="no-referrer"
        className={
          useContain
            ? `h-full w-full object-contain ${rotationClass}`
            : `h-full w-full object-cover ${objectPositionClass} transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100 ${rotationClass}`
        }
      />
    </div>
  );
}
