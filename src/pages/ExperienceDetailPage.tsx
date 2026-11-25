import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Expand,
  FileCheck2,
  FileClock,
  Images,
  MapPin,
} from 'lucide-react';
import { CERTIFICATES, EXPERIENCES, VISUAL_ARCHIVE } from '../data/portfolio';
import { usePageMetadata } from '../hooks/usePageMetadata';
import { DESIGN_TOKENS } from '../styles/designSystem';
import type { CertificateAttachment, VisualArchiveItem } from '../types/portfolio';
import {
  getExperienceNavigation,
  getVisualArchiveForExperience,
} from '../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../components/ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../components/ui/ArchiveMediaFrame';
import { Badge } from '../components/ui/Badge';
import { Button, LinkButton } from '../components/ui/Button';
import { CertificateModal } from '../components/ui/CertificateModal';
import { OrganizationMark } from '../components/ui/OrganizationMark';
import { SurfaceCard } from '../components/ui/SurfaceCard';

const CATEGORY_LABELS: Record<string, string> = {
  executive: 'Leadership & Executive Governance',
  ambassador: 'Campus Ambassador, Director & Outreach',
  events_volunteering: 'Event Organization & Volunteering',
};

export function ExperienceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateAttachment | null>(null);
  const [activeMedia, setActiveMedia] = useState<VisualArchiveItem | null>(null);

  const { entry, previous, next } = useMemo(
    () => getExperienceNavigation(EXPERIENCES, id),
    [id],
  );

  usePageMetadata({
    title: entry ? `${entry.role} — ${entry.organization}` : 'Role Not Found',
    description: entry
      ? `${entry.period} · ${entry.summary}`
      : 'Experience and leadership dossier.',
    path: entry ? `/experience/${entry.id}` : '/experience',
    schemaType: 'WebPage',
  });

  const linkedCertificate = useMemo(() => {
    if (!entry?.certificateId) return undefined;
    return CERTIFICATES.find((c) => c.id === entry.certificateId);
  }, [entry]);

  const roleMedia = useMemo(() => {
    if (!entry) return [];
    return getVisualArchiveForExperience(VISUAL_ARCHIVE, entry.id);
  }, [entry]);

  if (!entry) {
    return (
      <section className={`bg-wood-canvas dark:bg-[#050914] ${DESIGN_TOKENS.spacing.sectionY}`}>
        <div className={DESIGN_TOKENS.spacing.container}>
          <SurfaceCard className="mx-auto max-w-xl p-8 text-center space-y-4">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              Experience Dossier
            </p>
            <h1 className={DESIGN_TOKENS.typography.pageTitle}>
              Role Entry Not Found
            </h1>
            <p className={DESIGN_TOKENS.typography.bodyMuted}>
              The requested experience record could not be located in the centralized portfolio dataset.
            </p>
            <div className="pt-2">
              <LinkButton to="/experience" variant="primary" size="md">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                <span>Back to Experience Directory</span>
              </LinkButton>
            </div>
          </SurfaceCard>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="relative overflow-hidden border-b border-wood-subtle dark:border-slate-800/80 bg-wood-canvas dark:bg-[#050914] bg-blueprint-grid py-12 sm:py-16">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 ambient-hero-light"
        />
        <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-6`}>
          <Link
            to="/experience"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-wood-muted dark:text-slate-400 transition-colors duration-150 hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Back to Experience &amp; Leadership</span>
          </Link>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            <OrganizationMark
              code={entry.organizationCode}
              organization={entry.organization}
              logoUrl={entry.organizationLogoUrl}
              active={entry.isCurrent}
            />

            <div className="min-w-0 space-y-3">
              <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                {entry.isCurrent ? 'Current Position' : 'Former Position'}
                {entry.subCategory && ` · ${entry.subCategory}`}
              </p>

              <h1 className={DESIGN_TOKENS.typography.pageTitle}>
                {entry.role}
              </h1>

              <p className="text-base font-medium text-blue-700 dark:text-blue-300 sm:text-lg">
                {entry.organization}
              </p>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-wood-muted dark:text-slate-400">
                <span className="inline-flex items-center gap-1.5 tabular-nums">
                  <Calendar
                    className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>{entry.period}</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin
                    className="h-3.5 w-3.5 text-blue-700 dark:text-blue-400"
                    aria-hidden="true"
                  />
                  <span>{entry.location}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section
        className={`border-b border-wood-subtle dark:border-slate-800/80 bg-wood-alt dark:bg-[#080e1c] ${DESIGN_TOKENS.spacing.sectionY}`}
      >
        <div className={`${DESIGN_TOKENS.spacing.container} space-y-10`}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Main Dossier Column */}
            <div className="min-w-0 space-y-6 lg:col-span-8">
              <SurfaceCard className="p-6 space-y-4">
                <h2 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  Role Overview, Responsibility &amp; Contribution
                </h2>
                <p className="text-sm leading-relaxed text-wood-ink dark:text-slate-200 sm:text-base">
                  {entry.summary}
                </p>

                <dl className="grid gap-4 border-t border-wood-subtle dark:border-slate-800/80 pt-4 sm:grid-cols-2 text-xs">
                  <div className="space-y-1">
                    <dt className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                      Primary Responsibility
                    </dt>
                    <dd className="leading-relaxed text-wood-walnut dark:text-slate-300">
                      {entry.responsibility}
                    </dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                      Actual Documented Contribution
                    </dt>
                    <dd className="leading-relaxed text-wood-ink dark:text-slate-200">
                      {entry.actualContribution}
                    </dd>
                  </div>
                </dl>
              </SurfaceCard>

              <SurfaceCard className="p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-wood-subtle dark:border-slate-800/80 pb-3">
                  <h2 className="font-mono text-xs text-blue-700 dark:text-blue-400">
                    Verified Responsibilities &amp; Scope
                  </h2>
                  <span className={DESIGN_TOKENS.typography.monoMicro}>
                    CV &amp; LinkedIn Verified
                  </span>
                </div>
                <ul className="space-y-2.5">
                  {entry.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-sm leading-relaxed text-wood-walnut dark:text-slate-300"
                    >
                      <CheckCircle2
                        className="mt-1 h-4 w-4 shrink-0 text-cyan-700 dark:text-cyan-400"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </SurfaceCard>

              {/* Certificate Attachment Support Card */}
              <SurfaceCard variant="accent" className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
                  <h2 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                    Certificate &amp; Evidence Support
                  </h2>
                  <Badge
                    tone={
                      linkedCertificate?.status === 'Verified Attachment' ||
                      entry.evidenceUrl
                        ? 'cyan'
                        : 'neutral'
                    }
                  >
                    {linkedCertificate?.status ??
                      (entry.evidenceUrl ? 'Verified Attachment' : 'Pending Upload')}
                  </Badge>
                </div>

                {linkedCertificate ? (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-wood-ink dark:text-slate-100">
                      {linkedCertificate.title}
                    </p>
                    <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                      {linkedCertificate.notes}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveCertificate(linkedCertificate)}
                      >
                        {linkedCertificate.status === 'Verified Attachment' ? (
                          <FileCheck2
                            className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400"
                            aria-hidden="true"
                          />
                        ) : (
                          <FileClock
                            className="h-3.5 w-3.5 text-wood-muted dark:text-slate-400"
                            aria-hidden="true"
                          />
                        )}
                        <span>
                          {linkedCertificate.status === 'Verified Attachment'
                            ? 'Inspect Certificate Preview'
                            : 'View Attachment Slot Info'}
                        </span>
                      </Button>

                      {linkedCertificate.fileUrl && (
                        <a
                          href={linkedCertificate.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300 transition-colors hover:text-cyan-800 dark:hover:text-cyan-200"
                        >
                          <span>Open Signed {linkedCertificate.fileType ?? 'PDF'}</span>
                          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  </div>
                ) : entry.evidenceUrl ? (
                  <a
                    href={entry.evidenceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200"
                  >
                    <span>{entry.evidenceLabel ?? 'Open Verification Document'}</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : (
                  <p className="text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                    No certificate or appointment scan has been published for this tenure yet. Verification details can be provided upon direct inquiry.
                  </p>
                )}
              </SurfaceCard>

              {/* Visual Evidence, Posters & Event Photographs */}
              {roleMedia.length > 0 && (
                <SurfaceCard className="p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
                    <h2 className="flex items-center gap-2 font-mono text-xs text-cyan-700 dark:text-cyan-400">
                      <Images className="h-3.5 w-3.5" aria-hidden="true" />
                      <span>Visual Evidence, Posters &amp; Letters ({roleMedia.length})</span>
                    </h2>
                    <Link
                      to="/archive"
                      className="font-mono text-[11px] font-medium text-blue-700 dark:text-blue-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      Open Full Archive →
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    {roleMedia.map((media) => (
                      <button
                        key={media.id}
                        type="button"
                        onClick={() => setActiveMedia(media)}
                        className="group flex flex-col overflow-hidden rounded-[12px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] text-left transition-colors hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                      >
                        <div className="relative w-full border-b border-wood-subtle dark:border-slate-800">
                          <ArchiveMediaFrame
                            src={media.src}
                            alt={media.alt}
                            kind={media.kind}
                            mediaType={media.mediaType}
                            rotateDeg={media.rotateDeg}
                            focalPosition={media.focalPosition}
                            mode="thumbnail"
                          />
                          <span
                            aria-hidden="true"
                            className="absolute right-2 bottom-2 inline-flex h-7 w-7 items-center justify-center rounded-[7px] border border-wood-default/80 dark:border-slate-700/80 bg-wood-surface/90 dark:bg-[#050914]/90 text-wood-walnut dark:text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                          >
                            <Expand className="h-3.5 w-3.5" />
                          </span>
                        </div>
                        <div className="p-3.5 space-y-1">
                          <p className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                            {media.kind} · {media.date}
                          </p>
                          <p className="text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                            {media.caption}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </SurfaceCard>
              )}

              {/* Manual Completion Flag Card */}
              {entry.missingInfo && entry.missingInfo.length > 0 && (
                <SurfaceCard className="p-6 space-y-3">
                  <div className="flex items-center gap-2 border-b border-wood-subtle dark:border-slate-800/80 pb-3">
                    <AlertCircle
                      className="h-4 w-4 text-blue-700 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <h2 className="font-mono text-xs text-blue-700 dark:text-blue-300">
                      Items Marked for Manual Completion
                    </h2>
                  </div>
                  <p className="text-xs text-wood-muted dark:text-slate-400">
                    To keep all records strictly factual without invented dates or metrics, the following items await manual entry when available:
                  </p>
                  <ul className="space-y-1.5 text-xs leading-relaxed text-wood-walnut dark:text-slate-300">
                    {entry.missingInfo.map((note) => (
                      <li key={note}>– {note}</li>
                    ))}
                  </ul>
                </SurfaceCard>
              )}
            </div>

            {/* Metadata Sidebar */}
            <aside className="min-w-0 space-y-5 lg:col-span-4">
              <SurfaceCard className="p-5 space-y-4">
                <h2 className="border-b border-wood-subtle dark:border-slate-800/80 pb-2.5 font-mono text-xs text-wood-muted dark:text-slate-400">
                  Structured Record Metadata
                </h2>

                <div className="space-y-3 text-xs">
                  <div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">Tenure Status</p>
                    <p className="mt-0.5 font-medium text-wood-ink dark:text-slate-100">
                      {entry.isCurrent
                        ? 'Current Active Position'
                        : 'Former / Completed Position'}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">Timeframe</p>
                    <p className="mt-0.5 font-mono text-wood-ink dark:text-slate-200 tabular-nums">
                      {entry.period}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">Track</p>
                    <p className="mt-0.5 text-wood-ink dark:text-slate-200">
                      {CATEGORY_LABELS[entry.category] ?? entry.category}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                      Location &amp; Mode
                    </p>
                    <p className="mt-0.5 text-wood-ink dark:text-slate-200">
                      {entry.location}
                    </p>
                  </div>

                  <div>
                    <p className="font-mono text-[11px] text-wood-muted dark:text-slate-400">
                      Organization Emblem Code
                    </p>
                    <p className="mt-0.5 font-mono text-cyan-700 dark:text-cyan-300">
                      {entry.organizationCode}{' '}
                      {entry.organizationLogoUrl
                        ? '(Custom emblem)'
                        : '(Organization monogram)'}
                    </p>
                  </div>
                </div>
              </SurfaceCard>

              <SurfaceCard className="p-5 space-y-3">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  Related Portfolio Sections
                </p>
                <div className="flex flex-col gap-2">
                  <LinkButton
                    to="/awards"
                    variant="secondary"
                    size="sm"
                    className="justify-between"
                  >
                    <span>Achievements &amp; Certificates</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </LinkButton>
                  <LinkButton
                    to="/experience"
                    variant="ghost"
                    size="sm"
                    className="justify-between text-wood-walnut dark:text-slate-300"
                  >
                    <span>All {EXPERIENCES.length} Roles</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </LinkButton>
                </div>
              </SurfaceCard>
            </aside>
          </div>

          {/* Previous / Next Entry Navigation */}
          <div className="grid grid-cols-1 gap-4 border-t border-wood-subtle dark:border-slate-800/80 pt-8 sm:grid-cols-2">
            {previous ? (
              <Link
                to={`/experience/${previous.id}`}
                className="group block min-w-0 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
              >
                <SurfaceCard variant="interactive" className="p-4 space-y-1">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-wood-muted dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400">
                    <ArrowLeft className="h-3 w-3" aria-hidden="true" />
                    <span>Previous Role</span>
                  </span>
                  <p className="font-display text-sm font-semibold text-wood-ink dark:text-slate-100">
                    {previous.role}
                  </p>
                  <p className="truncate text-xs text-wood-muted dark:text-slate-400">
                    {previous.organization}
                  </p>
                </SurfaceCard>
              </Link>
            ) : (
              <div />
            )}

            {next ? (
              <Link
                to={`/experience/${next.id}`}
                className="group block min-w-0 rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 sm:text-right"
              >
                <SurfaceCard variant="interactive" className="p-4 space-y-1">
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] text-wood-muted dark:text-slate-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-400 sm:justify-end">
                    <span>Next Role</span>
                    <ArrowRight className="h-3 w-3" aria-hidden="true" />
                  </span>
                  <p className="font-display text-sm font-semibold text-wood-ink dark:text-slate-100">
                    {next.role}
                  </p>
                  <p className="truncate text-xs text-wood-muted dark:text-slate-400">
                    {next.organization}
                  </p>
                </SurfaceCard>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>

      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />

      <ArchiveLightboxModal
        item={activeMedia}
        items={roleMedia}
        onSelect={setActiveMedia}
        onClose={() => setActiveMedia(null)}
      />
    </>
  );
}
