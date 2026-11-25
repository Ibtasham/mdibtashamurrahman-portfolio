import { useEffect, useState } from 'react';
import {
  ArrowUpRight,
  Download,
  ExternalLink,
  FileCheck2,
  FileClock,
  FileText,
  Link2,
  RotateCcw,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CertificateAttachment } from '../../types/portfolio';
import { ArchiveMediaFrame } from './ArchiveMediaFrame';
import { Badge } from './Badge';
import { Modal } from './Modal';
import { OrganizationMark } from './OrganizationMark';

interface CertificateModalProps {
  certificate: CertificateAttachment | null;
  onClose: () => void;
}

const ZOOM_LEVELS: readonly (1 | 1.5 | 2)[] = [1, 1.5, 2];

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const [zoom, setZoom] = useState<1 | 1.5 | 2>(1);

  useEffect(() => {
    setZoom(1);
  }, [certificate?.id]);

  const widthStyle = zoom === 1 ? '100%' : zoom === 1.5 ? '150%' : '200%';

  return (
    <Modal
      open={certificate !== null}
      onClose={onClose}
      title={certificate?.title ?? ''}
      subtitle={
        certificate
          ? `${certificate.issuer} · ${certificate.date}`
          : undefined
      }
    >
      {certificate && (
        <div className="space-y-5 text-sm text-wood-walnut dark:text-slate-300">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <OrganizationMark
                code={certificate.organizationCode}
                organization={certificate.issuer}
                logoUrl={certificate.organizationLogoUrl}
                active={certificate.status === 'Verified Attachment'}
                size="sm"
              />
              <Badge
                tone={
                  certificate.status === 'Verified Attachment' ? 'cyan' : 'neutral'
                }
              >
                {certificate.status === 'Verified Attachment' ? (
                  <FileCheck2 className="h-3 w-3" aria-hidden="true" />
                ) : (
                  <FileClock className="h-3 w-3" aria-hidden="true" />
                )}
                <span>{certificate.status}</span>
              </Badge>
              <span className="font-mono text-xs text-wood-muted dark:text-slate-400">
                {certificate.category}
              </span>
            </div>

            {certificate.linkedRoute && (
              <Link
                to={certificate.linkedRoute}
                onClick={onClose}
                className="inline-flex min-h-[40px] sm:min-h-[36px] items-center gap-1 font-mono text-xs text-wood-muted dark:text-slate-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                <Link2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Linked Record</span>
              </Link>
            )}
          </div>

          <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300 sm:text-sm">
            {certificate.notes}
          </p>

          {/* Credential & Issuer Verification Grid */}
          <div className="grid gap-3 rounded-[12px] border border-wood-subtle dark:border-slate-800/80 bg-wood-inset/60 dark:bg-[#060b16] p-4 text-xs sm:grid-cols-2">
            <div>
              <p className="font-mono text-[11px] text-wood-muted">
                Issuing Organization
              </p>
              <p className="mt-0.5 text-wood-ink dark:text-slate-200">{certificate.issuer}</p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-wood-muted">Issue Date</p>
              <p className="mt-0.5 font-mono text-wood-ink dark:text-slate-200 tabular-nums">
                {certificate.date}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-wood-muted">
                Credential ID
              </p>
              <p className="mt-0.5 font-mono text-wood-walnut dark:text-slate-300">
                {certificate.credentialId ?? 'Not supplied'}
              </p>
            </div>
            <div>
              <p className="font-mono text-[11px] text-wood-muted">
                Credential Verification URL
              </p>
              {certificate.verificationUrl ? (
                <a
                  href={certificate.verificationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-0.5 inline-flex items-center gap-1 font-mono text-cyan-700 dark:text-cyan-300 hover:text-cyan-600 dark:hover:text-cyan-200"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              ) : (
                <p className="mt-0.5 font-mono text-wood-muted dark:text-slate-400">
                  Not supplied
                </p>
              )}
            </div>
          </div>

          {certificate.status === 'Verified Attachment' && certificate.fileUrl ? (
            certificate.fileType === 'Image' ? (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset/60 dark:bg-[#060b16] px-3 py-2">
                  <span className="font-mono text-[11px] text-wood-muted dark:text-slate-400 tabular-nums">
                    Inspect Zoom · {Math.round(zoom * 100)}%
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Certificate preview zoom controls">
                    <button
                      type="button"
                      disabled={zoom === 1}
                      onClick={() => setZoom((z) => (z === 2 ? 1.5 : 1))}
                      aria-label="Zoom out certificate"
                      className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-wood-ink dark:text-slate-200 transition-colors hover:border-blue-500/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
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
                            : 'border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] text-wood-muted dark:text-slate-300 hover:border-blue-500/50'
                        }`}
                      >
                        {Math.round(level * 100)}%
                      </button>
                    ))}
                    <button
                      type="button"
                      disabled={zoom === 2}
                      onClick={() => setZoom((z) => (z === 1 ? 1.5 : 2))}
                      aria-label="Zoom in certificate"
                      className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-wood-ink dark:text-slate-200 transition-colors hover:border-blue-500/60 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap shrink-0"
                    >
                      <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    {zoom > 1 && (
                      <button
                        type="button"
                        onClick={() => setZoom(1)}
                        className="inline-flex min-h-[38px] sm:min-h-[34px] items-center gap-1 rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-surface dark:bg-[#0b1222] px-2.5 py-1 text-xs font-medium text-wood-ink dark:text-slate-200 transition-colors hover:border-blue-500/60 cursor-pointer whitespace-nowrap shrink-0"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        <span>Reset</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-[56vh] sm:max-h-[62vh] overflow-auto touch-pan-x touch-pan-y rounded-[12px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-2">
                  <div
                    style={{ width: widthStyle }}
                    className="mx-auto min-w-full transition-[width] duration-200"
                  >
                    <ArchiveMediaFrame
                      src={certificate.fileUrl}
                      alt={certificate.title}
                      kind="Certificate"
                      rotateDeg={certificate.rotateDeg}
                      mode="lightbox"
                      className="rounded-[8px]"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={certificate.fileUrl}
                    download
                    className="inline-flex min-h-[42px] sm:min-h-[40px] items-center justify-center gap-2 rounded-[10px] border border-wood-default dark:border-slate-700 bg-wood-surface dark:bg-[#0b1222] px-4 py-2 text-xs font-medium text-wood-ink dark:text-slate-100 transition-colors hover:border-blue-500/60 hover:bg-wood-hover dark:hover:bg-[#101a30]"
                  >
                    <Download className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>Download Image</span>
                  </a>
                  <a
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[42px] sm:min-h-[40px] items-center gap-1 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200"
                  >
                    <span>Open Original File</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ) : (
              <div className="rounded-[12px] border border-blue-500/35 bg-wood-inset/60 dark:bg-[#060b16] p-5 space-y-4">
                <div className="flex items-start gap-3.5">
                  <div className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-cyan-600/30 dark:border-cyan-500/40 bg-wood-surface dark:bg-[#0b1222] text-cyan-700 dark:text-cyan-300">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0 space-y-1">
                    <p className="font-display text-sm font-semibold text-wood-ink dark:text-slate-100">
                      Signed Digital Certificate Attached ({certificate.fileType ?? 'PDF'})
                    </p>
                    <p className="break-all font-mono text-[11px] text-wood-muted dark:text-slate-400">
                      {certificate.fileUrl}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={certificate.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[10px] bg-[#2563eb] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1d4ed8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <span>Open Signed PDF</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>

                  <a
                    href={certificate.fileUrl}
                    download
                    className="inline-flex min-h-[40px] items-center justify-center gap-2 rounded-[10px] border border-wood-default dark:border-slate-700 bg-wood-surface dark:bg-[#0b1222] px-4 py-2 text-xs font-medium text-wood-ink dark:text-slate-100 transition-colors hover:border-blue-500/60 hover:bg-wood-hover dark:hover:bg-[#101a30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                  >
                    <Download className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>Download Attachment</span>
                  </a>
                </div>
              </div>
            )
          ) : (
            <div className="rounded-[12px] border border-dashed border-wood-default dark:border-slate-700 bg-wood-inset/50 dark:bg-[#060b16] p-5 space-y-2">
              <p className="font-mono text-xs font-medium text-wood-ink dark:text-slate-200">
                Verification Copy Pending Archival Upload
              </p>
              <p className="text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                A digitized scan or third-party credential URL for this record has not been attached to the public gallery yet and can be provided upon direct academic or professional inquiry.
              </p>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
