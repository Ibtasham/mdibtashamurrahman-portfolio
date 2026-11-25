import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowUpRight,
  Award,
  ChevronDown,
  ChevronUp,
  Expand,
  FileCheck2,
  FileClock,
  FileText,
  Images,
} from 'lucide-react';
import { ACHIEVEMENTS, CERTIFICATES, VISUAL_ARCHIVE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type {
  AchievementEntry,
  CertificateAttachment,
  VisualArchiveItem,
} from '../../types/portfolio';
import {
  countAchievementsByCategory,
  filterAchievements,
  getVisualArchiveForAchievement,
  type AchievementFilter,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { Badge } from '../ui/Badge';
import { Button, LinkButton } from '../ui/Button';
import { CertificateModal } from '../ui/CertificateModal';
import { EmptyState } from '../ui/EmptyState';
import { OrganizationMark } from '../ui/OrganizationMark';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';
import { VisualArchiveHighlightSection } from './VisualArchiveHighlightSection';

interface AchievementsSectionProps {
  expanded?: boolean;
}

const ACHIEVEMENT_CATEGORIES: AchievementFilter[] = [
  'All',
  'Competition',
  'Academic',
  'Public Speaking',
  'Recognition & Volunteering',
];

export function AchievementsSection({ expanded = false }: AchievementsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<AchievementFilter>('All');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateAttachment | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    item: VisualArchiveItem;
    items: VisualArchiveItem[];
  } | null>(null);

  const items = useMemo(
    () => filterAchievements(ACHIEVEMENTS, selectedCategory),
    [selectedCategory],
  );

  const categoryCounts = useMemo(
    () => countAchievementsByCategory(ACHIEVEMENTS),
    [],
  );

  const certificateMap = useMemo(() => {
    const map = new Map<string, CertificateAttachment>();
    for (const cert of CERTIFICATES) {
      map.set(cert.id, cert);
    }
    return map;
  }, []);

  const verifiedCertCount = CERTIFICATES.filter(
    (c) => c.status === 'Verified Attachment',
  ).length;
  const pendingCertCount = CERTIFICATES.length - verifiedCertCount;

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCert = (award: AchievementEntry) => {
    if (!award.certificateId) return;
    const cert = certificateMap.get(award.certificateId);
    if (cert) {
      setActiveCertificate(cert);
    }
  };

  return (
    <section
      id="awards"
      className={`relative border-b border-wood-subtle dark:border-slate-800/80 ${
        expanded
          ? 'bg-wood-alt dark:bg-[#080e1c] py-10 sm:py-14'
          : `bg-wood-canvas dark:bg-[#050914] ${DESIGN_TOKENS.spacing.sectionY}`
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-section-light"
      />
      <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-12`}>
        {!expanded && (
          <SectionHeading
            index="06"
            eyebrow="Achievements & Honors"
            title="Awards, Competitions & Visual Proof"
            description="Verified academic scholarships, IT Olympiad championship, business case competitions, public speaking distinctions, and recognition certificates with interactive proof inspection."
            actionLabel="All Awards & Certificates"
            actionTo="/awards"
          />
        )}

        {/* Category Filter Group */}
        <div
          role="group"
          aria-label="Filter achievements by category"
          className="flex flex-wrap gap-2"
        >
          {ACHIEVEMENT_CATEGORIES.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(cat)}
                className={`min-h-[40px] sm:min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                    : 'border-wood-subtle bg-wood-surface text-wood-muted hover:border-wood-default hover:text-wood-ink dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                }`}
              >
                {cat} ({categoryCounts[cat]})
              </button>
            );
          })}
        </div>

        {/* Achievement Showcase Cards */}
        <SectionReveal>
          {items.length === 0 ? (
            <EmptyState
              title="No Achievements in Category"
              message="Reset to All to inspect academic honors, competition finishes, public speaking records, and recognition certificates."
              actionLabel="Show All Achievements"
              onAction={() => setSelectedCategory('All')}
            />
          ) : (
            <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
              {items.map((award) => {
                const isOpen = Boolean(expandedIds[award.id]);
                const cert = award.certificateId
                  ? certificateMap.get(award.certificateId)
                  : undefined;
                const isAttached = cert?.status === 'Verified Attachment';
                const linkedPhotos = getVisualArchiveForAchievement(
                  VISUAL_ARCHIVE,
                  award.id,
                );
                const hasImageCert =
                  isAttached && cert?.fileType === 'Image' && Boolean(cert.fileUrl);
                const hasPdfCert =
                  isAttached && cert?.fileType === 'PDF' && Boolean(cert.fileUrl);

                return (
                  <SurfaceCard
                    key={award.id}
                    variant={isAttached ? 'accent' : 'interactive'}
                    as="article"
                    className="flex min-w-0 flex-col justify-between p-5"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-start gap-3">
                        <OrganizationMark
                          code={award.organizationCode}
                          organization={award.organization}
                          logoUrl={award.organizationLogoUrl}
                          active={
                            award.placement.includes('1st') ||
                            award.placement.includes('GPA 5.00') ||
                            award.placement.includes('Top 3')
                          }
                        />
                        <div className="min-w-0 flex-1 space-y-0.5">
                          <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-xs">
                            <span className="font-semibold text-cyan-700 dark:text-cyan-300">
                              {award.placement}
                            </span>
                            <span className="shrink-0 text-wood-muted dark:text-slate-500 tabular-nums">
                              {award.year}
                            </span>
                          </div>
                          <p className="font-mono text-[10px] text-wood-muted dark:text-slate-400">
                            {award.category}
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                          {award.title}
                        </h3>
                        <p className="mt-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
                          {award.organization}
                        </p>
                      </div>

                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {award.details}
                      </p>

                      {/* Aligned Visual Proof Slot */}
                      {hasImageCert && cert?.fileUrl ? (
                        <button
                          type="button"
                          onClick={() => setActiveCertificate(cert)}
                          aria-label={`Inspect verified certificate scan for ${award.title}`}
                          className="group relative block w-full overflow-hidden rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                          <ArchiveMediaFrame
                            src={cert.fileUrl}
                            alt={`${award.title} certificate scan`}
                            kind="Certificate"
                            rotateDeg={cert.rotateDeg}
                            mode="thumbnail"
                          />
                          <div className="flex items-center justify-between gap-2 border-t border-wood-subtle dark:border-slate-800/80 bg-wood-surface/95 dark:bg-[#080e1d] px-3 py-1.5">
                            <span className="font-mono text-[10px] text-cyan-700 dark:text-cyan-300">
                              Verified Certificate Scan
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-wood-muted dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                              <Expand className="h-3 w-3" aria-hidden="true" />
                              <span>Zoom</span>
                            </span>
                          </div>
                        </button>
                      ) : linkedPhotos.length > 0 ? (
                        <button
                          type="button"
                          onClick={() =>
                            setLightboxState({
                              item: linkedPhotos[0],
                              items: linkedPhotos,
                            })
                          }
                          aria-label={`Inspect ceremony photograph for ${award.title}`}
                          className="group relative block w-full overflow-hidden rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                          <ArchiveMediaFrame
                            src={linkedPhotos[0].src}
                            alt={linkedPhotos[0].alt}
                            kind={linkedPhotos[0].kind}
                            rotateDeg={linkedPhotos[0].rotateDeg}
                            focalPosition={linkedPhotos[0].focalPosition}
                            mode="thumbnail"
                          />
                          <div className="flex items-center justify-between gap-2 border-t border-wood-subtle dark:border-slate-800/80 bg-wood-surface/95 dark:bg-[#080e1d] px-3 py-1.5">
                            <span className="font-mono text-[10px] text-blue-700 dark:text-cyan-300">
                              Visual Archive ({linkedPhotos.length})
                            </span>
                            <span className="inline-flex items-center gap-1 font-mono text-[10px] text-wood-muted dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-cyan-300">
                              <Expand className="h-3 w-3" aria-hidden="true" />
                              <span>Inspect</span>
                            </span>
                          </div>
                        </button>
                      ) : hasPdfCert && cert ? (
                        <button
                          type="button"
                          onClick={() => setActiveCertificate(cert)}
                          aria-label={`Inspect signed digital PDF certificate for ${award.title}`}
                          className="group flex w-full items-center justify-between gap-3 rounded-[10px] border border-blue-500/35 bg-wood-inset dark:bg-[#060b16] p-3 text-left transition-colors hover:border-cyan-500/50 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] border border-cyan-600/30 dark:border-cyan-500/40 bg-wood-surface dark:bg-[#0b1222] text-cyan-700 dark:text-cyan-300">
                              <FileText className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300">
                                Signed Digital PDF Certificate
                              </p>
                              <p className="truncate text-[11px] text-wood-muted dark:text-slate-400">
                                {cert.issuer}
                              </p>
                            </div>
                          </div>
                          <Expand
                            className="h-3.5 w-3.5 shrink-0 text-wood-muted dark:text-slate-500 group-hover:text-cyan-600 dark:group-hover:text-cyan-300"
                            aria-hidden="true"
                          />
                        </button>
                      ) : null}

                      {isOpen && award.missingInfo && award.missingInfo.length > 0 && (
                        <div className="rounded-[8px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] p-2.5 space-y-1">
                          <p className="flex items-center gap-1.5 font-mono text-[10px] text-blue-700 dark:text-blue-300">
                            <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                            <span>Marked for Manual Completion</span>
                          </p>
                          <ul className="space-y-0.5 text-[11px] text-wood-muted dark:text-slate-400">
                            {award.missingInfo.map((note) => (
                              <li key={note}>– {note}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 space-y-2.5 border-t border-wood-subtle dark:border-slate-800/70 pt-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                          {cert && (
                            <button
                              type="button"
                              onClick={() => handleOpenCert(award)}
                              className={`inline-flex min-h-[40px] sm:min-h-[34px] items-center gap-1.5 text-xs font-medium transition-colors cursor-pointer ${
                                isAttached
                                  ? 'text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200'
                                  : 'text-wood-muted hover:text-wood-ink dark:text-slate-400 dark:hover:text-slate-200'
                              }`}
                            >
                              {isAttached ? (
                                <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                              ) : (
                                <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
                              )}
                              <span>
                                {isAttached
                                  ? 'Inspect Certificate'
                                  : 'Certificate Slot (Pending Upload)'}
                              </span>
                            </button>
                          )}

                          {linkedPhotos.length > 0 && (
                            <button
                              type="button"
                              onClick={() =>
                                setLightboxState({
                                  item: linkedPhotos[0],
                                  items: linkedPhotos,
                                })
                              }
                              className="inline-flex min-h-[40px] sm:min-h-[34px] items-center gap-1.5 text-xs font-medium text-blue-700 transition-colors hover:text-cyan-700 dark:text-blue-300 dark:hover:text-cyan-300 cursor-pointer"
                            >
                              <Images className="h-3.5 w-3.5" aria-hidden="true" />
                              <span>Photos ({linkedPhotos.length})</span>
                            </button>
                          )}
                        </div>

                        {award.missingInfo && award.missingInfo.length > 0 && (
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleExpand(award.id)}
                            className="inline-flex min-h-[40px] sm:min-h-[34px] items-center gap-1 text-xs font-medium text-wood-muted dark:text-slate-400 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer"
                          >
                            <span>{isOpen ? 'Hide Notes' : 'Completion Notes'}</span>
                            {isOpen ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          )}
        </SectionReveal>

        {/* Certificate Attachment Support Registry */}
        {expanded ? (
          <SectionReveal delay={0.05}>
            <div className="space-y-5 border-t border-wood-subtle dark:border-slate-800/80 pt-10">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-wood-ink dark:text-slate-100">
                  <Award
                    className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Certificates &amp; Supporting Documents</span>
                </div>
                <span className={DESIGN_TOKENS.typography.monoMicro}>
                  {verifiedCertCount} Verified Attached · {pendingCertCount} Pending Upload
                </span>
              </div>

              <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
                {CERTIFICATES.map((cert) => {
                  const isVerified = cert.status === 'Verified Attachment';
                  return (
                    <SurfaceCard
                      key={cert.id}
                      variant={isVerified ? 'accent' : 'default'}
                      as="article"
                      className="flex min-w-0 flex-col justify-between p-5"
                    >
                      <div className="space-y-3">
                        {isVerified && cert.fileType === 'Image' && cert.fileUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveCertificate(cert)}
                            aria-label={`Preview certificate image: ${cert.title}`}
                            className="block w-full overflow-hidden rounded-[10px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] cursor-pointer"
                          >
                            <ArchiveMediaFrame
                              src={cert.fileUrl}
                              alt={cert.title}
                              kind="Certificate"
                              rotateDeg={cert.rotateDeg}
                              mode="thumbnail"
                            />
                          </button>
                        )}

                        {isVerified && cert.fileType === 'PDF' && cert.fileUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveCertificate(cert)}
                            aria-label={`Preview digital PDF certificate: ${cert.title}`}
                            className="flex w-full items-center gap-3 rounded-[10px] border border-blue-500/30 bg-wood-inset dark:bg-[#060b16] p-3 text-left transition-colors hover:border-cyan-500/50 cursor-pointer"
                          >
                            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[8px] border border-cyan-600/30 dark:border-cyan-500/40 bg-wood-surface dark:bg-[#0b1222] text-cyan-700 dark:text-cyan-300">
                              <FileText className="h-4 w-4" aria-hidden="true" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300">
                                Signed PDF Certificate
                              </p>
                              <p className="truncate font-mono text-[10px] text-wood-muted dark:text-slate-400">
                                Click to inspect or download
                              </p>
                            </div>
                          </button>
                        )}

                        <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                          <Badge tone={isVerified ? 'cyan' : 'neutral'} wrap>
                            {isVerified ? (
                              <FileCheck2 className="h-3 w-3" aria-hidden="true" />
                            ) : (
                              <FileClock className="h-3 w-3" aria-hidden="true" />
                            )}
                            <span>{cert.status}</span>
                          </Badge>
                          <span className="text-wood-muted dark:text-slate-400 tabular-nums">{cert.date}</span>
                        </div>

                        <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                          {cert.title}
                        </h3>

                        <p className="text-xs font-medium text-blue-700 dark:text-blue-300">
                          {cert.issuer}
                        </p>

                        <p className={DESIGN_TOKENS.typography.bodyMuted}>
                          {cert.notes}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-wood-subtle dark:border-slate-800/70 pt-3">
                        <Button
                          type="button"
                          variant={isVerified ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveCertificate(cert)}
                          className="!min-h-[40px] sm:!min-h-[36px] !px-3"
                        >
                          <span>
                            {isVerified ? 'Preview Certificate' : 'View Record Details'}
                          </span>
                        </Button>

                        {cert.fileUrl && (
                          <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex min-h-[40px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 font-mono text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 transition-colors dark:hover:text-cyan-200"
                          >
                            <span>Open {cert.fileType ?? 'PDF'}</span>
                            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </SurfaceCard>
                  );
                })}
              </div>
            </div>
          </SectionReveal>
        ) : (
          <div className="space-y-10">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-wood-subtle dark:border-slate-800/80 pt-6">
              <div className="flex items-center gap-2 text-xs text-wood-muted dark:text-slate-400">
                <Award
                  className="h-4 w-4 text-cyan-700 dark:text-cyan-400 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  {verifiedCertCount} Verified Attachments · {pendingCertCount} Archival Slots in the Full Certificate Gallery.
                </span>
              </div>
              <LinkButton to="/awards" variant="secondary" size="sm">
                <span>Browse All Certificates &amp; Awards</span>
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </LinkButton>
            </div>

            <VisualArchiveHighlightSection integrated />
          </div>
        )}
      </div>

      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />

      <ArchiveLightboxModal
        item={lightboxState?.item ?? null}
        items={lightboxState?.items ?? []}
        onSelect={(next) =>
          setLightboxState((prev) => (prev ? { ...prev, item: next } : null))
        }
        onClose={() => setLightboxState(null)}
      />
    </section>
  );
}
