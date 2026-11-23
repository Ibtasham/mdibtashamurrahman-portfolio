import type { VisualArchiveKind } from '../../types/portfolio';

interface ArchiveMediaFrameProps {
  src: string;
  alt: string;
  kind?: VisualArchiveKind;
  rotateDeg?: 90 | 180 | 270;
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

export function ArchiveMediaFrame({
  src,
  alt,
  kind = 'Event Photograph',
  rotateDeg,
  focalPosition,
  mode = 'thumbnail',
  className = '',
}: ArchiveMediaFrameProps) {
  const isRotatedQuarter = rotateDeg === 90 || rotateDeg === 270;
  const rotationClass =
    rotateDeg === 90
      ? 'rotate-90'
      : rotateDeg === 180
        ? 'rotate-180'
        : rotateDeg === 270
          ? '-rotate-90'
          : '';

  const useContain =
    mode === 'lightbox' ||
    kind === 'Certificate' ||
    kind === 'Appointment Letter' ||
    kind === 'Official Poster' ||
    isRotatedQuarter;

  const resolvedFocal =
    focalPosition ?? (kind === 'Portrait' ? 'top' : 'center');
  const objectPositionClass = FOCAL_POSITION_CLASSES[resolvedFocal];

  if (isRotatedQuarter) {
    return (
      <div
        className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#060b16] ${className}`}
      >
        <img
          src={src}
          alt={alt}
          width={1200}
          height={900}
          loading={mode === 'lightbox' ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          className={`h-[120%] w-auto max-w-none object-contain transition-transform duration-300 motion-reduce:transition-none ${rotationClass}`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-slate-100 dark:bg-[#060b16] ${className}`}
    >
      <img
        src={src}
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
