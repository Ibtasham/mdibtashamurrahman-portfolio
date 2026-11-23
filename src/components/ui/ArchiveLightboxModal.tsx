import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download,
  FileImage,
  FolderOpen,
  Link2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import type { VisualArchiveItem } from '../../types/portfolio';
import { ArchiveMediaFrame } from './ArchiveMediaFrame';
import { Modal } from './Modal';

interface ArchiveLightboxModalProps {
  item: VisualArchiveItem | null;
  items: VisualArchiveItem[];
  onSelect: (item: VisualArchiveItem) => void;
  onClose: () => void;
}

const ZOOM_LEVELS: readonly (1 | 1.5 | 2)[] = [1, 1.5, 2];

export function ArchiveLightboxModal({
  item,
  items,
  onSelect,
  onClose,
}: ArchiveLightboxModalProps) {
  const [zoom, setZoom] = useState<1 | 1.5 | 2>(1);

  const currentIndex = item
    ? items.findIndex((candidate) => candidate.id === item.id)
    : -1;
  const previousItem = currentIndex > 0 ? items[currentIndex - 1] : null;
  const nextItem =
    currentIndex !== -1 && currentIndex < items.length - 1
      ? items[currentIndex + 1]
      : null;

  useEffect(() => {
    setZoom(1);
  }, [item?.id]);

  useEffect(() => {
    if (!item) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft' && previousItem) {
        event.preventDefault();
        onSelect(previousItem);
      } else if (event.key === 'ArrowRight' && nextItem) {
        event.preventDefault();
        onSelect(nextItem);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [item, previousItem, nextItem, onSelect]);

  const widthStyle = zoom === 1 ? '100%' : zoom === 1.5 ? '150%' : '200%';

  return (
    <Modal
      open={item !== null}
      onClose={onClose}
      title={item?.associatedRecord ?? ''}
      subtitle={item ? `${item.category} · ${item.kind}` : undefined}
    >
      {item && (
        <div className="space-y-5 text-sm text-slate-700 dark:text-slate-300">
          {/* Zoom Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] px-3 py-2">
            <span className="font-mono text-[11px] text-slate-600 dark:text-slate-400 tabular-nums">
              Evidence Zoom · {Math.round(zoom * 100)}%
            </span>
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Image zoom controls">
              <button
                type="button"
                disabled={zoom === 1}
                onClick={() => setZoom((z) => (z === 2 ? 1.5 : 1))}
                aria-label="Zoom out image"
                className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:border-blue-500/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomOut className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {ZOOM_LEVELS.map((level) => (
                <button
                  key={level}
                  type="button"
                  aria-pressed={zoom === level}
                  onClick={() => setZoom(level)}
                  className={`min-h-[38px] sm:min-h-[34px] rounded-[8px] border px-2.5 py-1 font-mono text-xs font-medium transition-colors cursor-pointer whitespace-nowrap shrink-0 tabular-nums ${
                    zoom === level
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                      : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-300 hover:border-blue-500/50'
                  }`}
                >
                  {Math.round(level * 100)}%
                </button>
              ))}
              <button
                type="button"
                disabled={zoom === 2}
                onClick={() => setZoom((z) => (z === 1 ? 1.5 : 2))}
                aria-label="Zoom in image"
                className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:border-blue-500/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
              >
                <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
              {zoom > 1 && (
                <button
                  type="button"
                  onClick={() => setZoom(1)}
                  className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:border-blue-500/60 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <RotateCcw className="h-3 w-3" aria-hidden="true" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* High-Resolution Lightbox Stage */}
          <div className="relative overflow-hidden rounded-[12px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] p-2">
            <div className="max-h-[54vh] sm:max-h-[60vh] overflow-auto touch-pan-x touch-pan-y rounded-[8px]">
              <div
                style={{ width: widthStyle }}
                className="mx-auto min-w-full transition-[width] duration-200"
              >
                <ArchiveMediaFrame
                  src={item.src}
                  alt={item.alt}
                  kind={item.kind}
                  rotateDeg={item.rotateDeg}
                  mode="lightbox"
                  className="rounded-[8px]"
                />
              </div>
            </div>

            {items.length > 1 && (
              <div className="mt-2.5 flex items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-2.5 px-1">
                <button
                  type="button"
                  disabled={!previousItem}
                  onClick={() => previousItem && onSelect(previousItem)}
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Previous</span>
                </button>

                <span className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {currentIndex + 1} / {items.length}
                </span>

                <button
                  type="button"
                  disabled={!nextItem}
                  onClick={() => nextItem && onSelect(nextItem)}
                  className="inline-flex min-h-[38px] items-center gap-1 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-cyan-300 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                >
                  <span>Next</span>
                  <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            )}
          </div>

          {/* Caption & Typographic Classification */}
          <div className="space-y-2">
            <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
              {item.category} · {item.kind}
            </p>
            <p className="text-xs leading-relaxed text-slate-800 dark:text-slate-200 sm:text-sm">
              {item.caption}
            </p>
          </div>

          {item.needsConfirmation && (
            <div className="rounded-[10px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] p-3.5 space-y-1">
              <p className="flex items-center gap-1.5 font-mono text-[11px] text-blue-700 dark:text-blue-300">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>Marked for Manual Confirmation</span>
              </p>
              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                {item.needsConfirmation}
              </p>
            </div>
          )}

          {/* Editable Metadata Record Grid */}
          <div className="grid gap-3 rounded-[12px] border border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#060b16] p-4 text-xs sm:grid-cols-2">
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <FileImage className="h-3 w-3" aria-hidden="true" />
                <span>Filename</span>
              </p>
              <p className="break-all font-mono text-[11px] text-slate-800 dark:text-slate-200">
                {item.filename}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <Calendar className="h-3 w-3" aria-hidden="true" />
                <span>Verified Date</span>
              </p>
              <p className="font-mono text-slate-900 dark:text-slate-200 tabular-nums">
                {item.date}
              </p>
            </div>
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <FolderOpen className="h-3 w-3" aria-hidden="true" />
                <span>Event Group</span>
              </p>
              <p className="text-slate-800 dark:text-slate-200">{item.eventGroup}</p>
            </div>
            <div className="space-y-0.5">
              <p className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500">
                <Link2 className="h-3 w-3" aria-hidden="true" />
                <span>Associated Record</span>
              </p>
              <p className="text-slate-800 dark:text-slate-200">{item.associatedRecord}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 dark:border-slate-800/80 pt-4">
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={item.src}
                download={item.filename}
                className="inline-flex min-h-[38px] items-center justify-center gap-1.5 rounded-[10px] border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#0b1222] px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 transition-colors hover:border-blue-500/60 hover:bg-slate-100 dark:hover:bg-[#101a30]"
              >
                <Download
                  className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
                  aria-hidden="true"
                />
                <span>Download Original</span>
              </a>

              <a
                href={item.src}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[40px] sm:min-h-[38px] items-center gap-1 font-mono text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                <span>Open Full File</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>

            {item.linkedRoute && (
              <Link
                to={item.linkedRoute}
                onClick={onClose}
                className="inline-flex min-h-[38px] items-center gap-1.5 rounded-[10px] bg-[#2563eb] px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8]"
              >
                <span>Open Linked Profile Entry</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
