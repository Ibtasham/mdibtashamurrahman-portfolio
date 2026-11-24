import { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  ImageIcon,
  RotateCcw,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { ProjectScreenshotEntry } from '../../types/portfolio';
import {
  resolveConceptualPreviewImage,
  resolveProjectPreviewImage,
} from '../../utils/projectMedia';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import { SurfaceCard } from '../ui/SurfaceCard';
import { ProjectPreviewImage } from './ProjectPreviewImage';

interface ProjectZoomGalleryProps {
  projectId: string;
  projectTitle: string;
  screenshots: ProjectScreenshotEntry[];
}

const ZOOM_PRESETS = [1, 1.5, 2] as const;

export function ProjectZoomGallery({
  projectId,
  projectTitle,
  screenshots,
}: ProjectZoomGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState<number>(1);
  const headingId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  const activeShot =
    activeIndex !== null ? (screenshots[activeIndex] ?? null) : null;

  const openAt = useCallback((index: number) => {
    setActiveIndex(index);
    setZoomScale(1);
  }, []);

  const closeViewer = useCallback(() => {
    setActiveIndex(null);
    setZoomScale(1);
  }, []);

  const stepPrev = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || screenshots.length <= 1) return current;
      return (current - 1 + screenshots.length) % screenshots.length;
    });
    setZoomScale(1);
  }, [screenshots.length]);

  const stepNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null || screenshots.length <= 1) return current;
      return (current + 1) % screenshots.length;
    });
    setZoomScale(1);
  }, [screenshots.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    prevFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const focusTimer = window.requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        closeViewer();
      } else if (e.key === 'Tab' && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) {
          e.preventDefault();
          dialogRef.current.focus();
          return;
        }
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last?.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first?.focus();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        stepPrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        stepNext();
      } else if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        setZoomScale((z) => Math.min(2.5, Number((z + 0.25).toFixed(2))));
      } else if (e.key === '-') {
        e.preventDefault();
        setZoomScale((z) => Math.max(1, Number((z - 0.25).toFixed(2))));
      } else if (e.key === '0') {
        e.preventDefault();
        setZoomScale(1);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = prevOverflow;
      if (prevFocusRef.current && document.contains(prevFocusRef.current)) {
        prevFocusRef.current.focus();
      }
    };
  }, [activeIndex, closeViewer, stepNext, stepPrev]);

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        {screenshots.map((shot, idx) => {
          const hasMedia = Boolean(shot.useGeneratedPreview || shot.imageUrl);
          return (
            <SurfaceCard key={shot.id} className="flex flex-col justify-between p-5 space-y-4">
              <div className="space-y-4">
                {hasMedia ? (
                  <ProjectPreviewImage
                    projectId={projectId}
                    title={shot.title}
                    alt={`${projectTitle}: ${shot.title}`}
                    customUrl={
                      shot.imageUrl ??
                      (shot.previewSource === 'conceptual'
                        ? resolveConceptualPreviewImage(projectId)
                        : undefined)
                    }
                    kindLabel={shot.kind}
                    onZoom={() => openAt(idx)}
                  />
                ) : (
                  <div className="overflow-hidden rounded-[10px] border border-dashed border-slate-300 dark:border-slate-700/80 bg-slate-100 dark:bg-[#060b16]">
                    <div className="flex aspect-video w-full flex-col items-center justify-center gap-2 p-6 text-center">
                      <ImageIcon className="h-6 w-6 text-slate-500" aria-hidden="true" />
                      <span className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300">
                        {shot.kind}
                      </span>
                      <span className="max-w-sm text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                        {shot.requirements ??
                          'Reserved for verified application screenshots or empirical benchmark figures.'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] px-3 py-1.5 font-mono text-[10.5px] text-slate-600 dark:text-slate-400">
                      <span>◌ Pending Capture Attachment</span>
                      <button
                        type="button"
                        onClick={() => openAt(idx)}
                        className="inline-flex items-center gap-1 text-blue-700 dark:text-cyan-300 hover:text-cyan-700 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] cursor-pointer"
                      >
                        <Expand className="h-3 w-3" aria-hidden="true" />
                        <span>Inspect Spec</span>
                      </button>
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                    {shot.kind}
                  </p>
                  <h3 className={DESIGN_TOKENS.typography.cardTitle}>{shot.title}</h3>
                  <p className={DESIGN_TOKENS.typography.bodyMuted}>{shot.caption}</p>
                </div>
              </div>
            </SurfaceCard>
          );
        })}
      </div>

      {/* Interactive Zoom Lightbox Modal */}
      {activeShot && activeIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={headingId}
          onClick={closeViewer}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 dark:bg-[#02050c]/90 p-3 sm:p-6 backdrop-blur-sm"
        >
          <div
            ref={dialogRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[16px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] shadow-2xl focus:outline-none"
          >
            {/* Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 px-5 py-3.5">
              <div className="min-w-0 space-y-0.5">
                <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                  {projectTitle} · {activeShot.kind} ({activeIndex + 1}/{screenshots.length})
                </p>
                <h3
                  id={headingId}
                  className="font-display text-base font-semibold text-slate-950 dark:text-slate-50 truncate"
                >
                  {activeShot.title}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(activeShot.useGeneratedPreview || activeShot.imageUrl) && (
                  <div
                    role="group"
                    aria-label="Image zoom controls"
                    className="flex items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] p-1"
                  >
                    <button
                      type="button"
                      aria-label="Zoom out"
                      disabled={zoomScale <= 1}
                      onClick={() =>
                        setZoomScale((z) => Math.max(1, Number((z - 0.5).toFixed(2))))
                      }
                      className="inline-flex min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px] items-center justify-center rounded-[6px] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    {ZOOM_PRESETS.map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        aria-pressed={zoomScale === preset}
                        onClick={() => setZoomScale(preset)}
                        className={`min-h-[36px] sm:min-h-[32px] rounded-[6px] px-2.5 py-1 font-mono text-[11px] tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer ${
                          zoomScale === preset
                            ? 'bg-blue-600 text-white'
                            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {Math.round(preset * 100)}%
                      </button>
                    ))}

                    <button
                      type="button"
                      aria-label="Zoom in"
                      disabled={zoomScale >= 2.5}
                      onClick={() =>
                        setZoomScale((z) => Math.min(2.5, Number((z + 0.5).toFixed(2))))
                      }
                      className="inline-flex min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px] items-center justify-center rounded-[6px] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>

                    <button
                      type="button"
                      aria-label="Reset zoom"
                      onClick={() => setZoomScale(1)}
                      className="inline-flex min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px] items-center justify-center rounded-[6px] text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={closeViewer}
                  aria-label="Close zoom viewer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] text-slate-700 dark:text-slate-300 hover:border-blue-500/60 hover:text-slate-950 dark:hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Viewport Stage */}
            <div className="relative flex-1 overflow-auto bg-slate-100 dark:bg-[#050914] p-4 sm:p-6">
              {activeShot.useGeneratedPreview || activeShot.imageUrl ? (
                <div className="min-h-[300px] w-full overflow-auto">
                  <img
                    src={
                      activeShot.imageUrl ??
                      (activeShot.previewSource === 'conceptual'
                        ? resolveConceptualPreviewImage(projectId)
                        : resolveProjectPreviewImage(projectId, activeShot.imageUrl))
                    }
                    alt={`${projectTitle}: ${activeShot.title}`}
                    width={1280}
                    height={720}
                    decoding="async"
                    referrerPolicy="no-referrer"
                    style={
                      zoomScale === 1
                        ? undefined
                        : {
                            width: `${Math.round(zoomScale * 760)}px`,
                            maxWidth: 'none',
                            maxHeight: 'none',
                          }
                    }
                    className={`mx-auto block rounded-[8px] border border-slate-200 dark:border-slate-800 transition-all duration-200 ease-out ${
                      zoomScale === 1 ? 'max-h-[58vh] w-auto max-w-full' : ''
                    }`}
                  />
                </div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-[10px] border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-[#060b16] p-8 text-center">
                  <ImageIcon className="h-8 w-8 text-slate-500" aria-hidden="true" />
                  <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                    {activeShot.kind}
                  </p>
                  <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {activeShot.caption}
                  </p>
                  {activeShot.requirements && (
                    <p className="max-w-md font-mono text-xs text-cyan-700 dark:text-cyan-400">
                      Capture Requirement: {activeShot.requirements}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer Caption & Gallery Nav */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 px-5 py-3.5">
              <p className="max-w-3xl text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {activeShot.caption}
              </p>

              {screenshots.length > 1 && (
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={stepPrev}
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 hover:border-blue-500/60 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={stepNext}
                    className="inline-flex min-h-[34px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] px-3 py-1.5 font-mono text-xs text-slate-700 dark:text-slate-300 hover:border-blue-500/60 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
