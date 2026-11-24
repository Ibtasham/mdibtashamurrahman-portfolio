import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  FileCheck2,
  FileClock,
  Images,
  Layers,
  LayoutGrid,
  ListTree,
  Search,
  ShieldCheck,
} from 'lucide-react';
import { CERTIFICATES, EXPERIENCES, VISUAL_ARCHIVE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type {
  CertificateAttachment,
  ExperienceEntry,
  VisualArchiveItem,
} from '../../types/portfolio';
import {
  countExperiencesByCategory,
  countExperiencesByStatus,
  filterExperiences,
  getLeadershipEntries,
  getVisualArchiveForExperience,
  groupExperiencesByDimension,
  type ExperienceFilter,
  type ExperienceStatusFilter,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { LinkButton } from '../ui/Button';
import { CertificateModal } from '../ui/CertificateModal';
import { EmptyState } from '../ui/EmptyState';
import { OrganizationMark } from '../ui/OrganizationMark';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';

interface ExperienceSectionProps {
  expanded?: boolean;
}

const CATEGORY_TABS: { id: ExperienceFilter; label: string }[] = [
  { id: 'all', label: 'All Roles' },
  { id: 'executive', label: 'Executive Committee' },
  { id: 'ambassador', label: 'Campus Ambassador' },
  { id: 'event_organization', label: 'Event Organization' },
  { id: 'volunteering', label: 'Volunteering' },
];

export function ExperienceSection({ expanded = false }: ExperienceSectionProps) {
  const [category, setCategory] = useState<ExperienceFilter>(
    expanded ? 'all' : 'executive',
  );
  const [status, setStatus] = useState<ExperienceStatusFilter>('all');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grouped' | 'timeline' | 'grid'>(
    expanded ? 'grouped' : 'timeline',
  );
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateAttachment | null>(null);
  const [lightboxState, setLightboxState] = useState<{
    item: VisualArchiveItem;
    items: VisualArchiveItem[];
  } | null>(null);

  const counts = useMemo(() => countExperiencesByCategory(EXPERIENCES), []);
  const statusCounts = useMemo(() => countExperiencesByStatus(EXPERIENCES), []);
  const dimensionGroups = useMemo(() => groupExperiencesByDimension(EXPERIENCES), []);
  const leadershipRoles = useMemo(() => getLeadershipEntries(EXPERIENCES), []);

  const certificateMap = useMemo(() => {
    const map = new Map<string, CertificateAttachment>();
    for (const cert of CERTIFICATES) {
      map.set(cert.id, cert);
    }
    return map;
  }, []);

  const filtered = useMemo(
    () => filterExperiences(EXPERIENCES, category, status, query),
    [category, status, query],
  );

  const filteredGroupedSections = useMemo(() => {
    const groups = groupExperiencesByDimension(filtered);
    return [
      {
        id: 'executive',
        title: 'Executive Committee & Governance Responsibilities',
        subtitle:
          'Elected departmental, academic, and student association committee mandates.',
        items: groups.executiveCommittee,
      },
      {
        id: 'ambassador',
        title: 'Campus Ambassador & Director Roles',
        subtitle:
          'Multi-campus competition outreach, technical community building, and delegate coordination.',
        items: groups.campusAmbassador,
      },
      {
        id: 'event_organization',
        title: 'Event Organization',
        subtitle:
          'Coordinating science festivals, olympiads, case competitions, and logistics.',
        items: groups.eventOrganization,
      },
      {
        id: 'volunteering',
        title: 'Volunteering',
        subtitle: 'Registered field and inter-college technical event volunteering.',
        items: groups.volunteering,
      },
    ].filter((section) => section.items.length > 0);
  }, [filtered]);

  const visibleLeadership = expanded
    ? leadershipRoles
    : leadershipRoles.filter((e) => e.isCurrent).slice(0, 3);
  const visibleItems = expanded ? filtered : filtered.slice(0, 4);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleOpenCertificate = (entry: ExperienceEntry) => {
    if (!entry.certificateId) return;
    const cert = certificateMap.get(entry.certificateId);
    if (cert) {
      setActiveCertificate(cert);
    }
  };

  const renderRoleCard = (item: ExperienceEntry, keyPrefix: string) => {
    const expandKey = `${keyPrefix}-${item.id}`;
    const isOpen = Boolean(expandedIds[expandKey]);
    const cert = item.certificateId ? certificateMap.get(item.certificateId) : undefined;
    const hasVerifiedCert = cert?.status === 'Verified Attachment';
    const roleMedia = getVisualArchiveForExperience(VISUAL_ARCHIVE, item.id);
    const primaryPhoto = roleMedia[0];

    return (
      <SurfaceCard
        key={expandKey}
        variant="interactive"
        as="article"
        className="flex min-w-0 flex-col justify-between p-5"
      >
        <div className="space-y-3.5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <OrganizationMark
                code={item.organizationCode}
                organization={item.organization}
                logoUrl={item.organizationLogoUrl}
                active={item.isCurrent}
              />
              <div className="min-w-0 space-y-1">
                <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                  <span
                    className={
                      item.isCurrent
                        ? 'font-semibold text-cyan-700 dark:text-cyan-400'
                        : 'text-slate-600 dark:text-slate-400'
                    }
                  >
                    {item.isCurrent ? 'Current Position' : 'Former Position'}
                  </span>
                  {item.subCategory && (
                    <>
                      <span aria-hidden="true"> · </span>
                      <span>{item.subCategory}</span>
                    </>
                  )}
                </p>
                <p className="font-mono text-[11px] text-slate-500 tabular-nums">
                  {item.period} · {item.location}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className={DESIGN_TOKENS.typography.cardTitle}>{item.role}</h4>
            <p className="mt-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              {item.organization}
            </p>
          </div>

          <dl className="divide-y divide-slate-200 dark:divide-slate-800/70 border-y border-slate-200 dark:border-slate-800/70 text-xs">
            <div className="py-2.5 space-y-1">
              <dt className="font-mono text-[10px] text-slate-500">Responsibility</dt>
              <dd className="leading-relaxed text-slate-700 dark:text-slate-300">
                {item.responsibility}
              </dd>
            </div>
            <div className="py-2.5 space-y-1">
              <dt className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                Actual Contribution
              </dt>
              <dd className="leading-relaxed text-slate-800 dark:text-slate-200">
                {item.actualContribution}
              </dd>
            </div>
          </dl>

          {primaryPhoto && (
            <button
              type="button"
              onClick={() =>
                setLightboxState({
                  item: primaryPhoto,
                  items: roleMedia,
                })
              }
              aria-label={`Inspect photographic evidence for ${item.organization}`}
              className="group flex w-full items-center gap-3 overflow-hidden rounded-[10px] border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#060b16] p-2 text-left transition-colors hover:border-blue-500/60 cursor-pointer"
            >
              <div className="h-14 w-20 shrink-0 overflow-hidden rounded-[6px] border border-slate-200 dark:border-slate-800">
                <ArchiveMediaFrame
                  src={primaryPhoto.src}
                  alt={primaryPhoto.alt}
                  kind={primaryPhoto.kind}
                  mediaType={primaryPhoto.mediaType}
                  rotateDeg={primaryPhoto.rotateDeg}
                  focalPosition={primaryPhoto.focalPosition}
                  mode="thumbnail"
                />
              </div>
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="font-mono text-[10px] text-cyan-700 dark:text-cyan-400">
                  Evidence · {primaryPhoto.kind} ({roleMedia.length})
                </p>
                <p className="line-clamp-2 text-[11px] leading-snug text-slate-700 dark:text-slate-300">
                  {primaryPhoto.caption}
                </p>
              </div>
            </button>
          )}

          {isOpen && (
            <div className="space-y-2.5 pt-1">
              <p className="font-mono text-[11px] text-slate-500">
                Additional Scope &amp; Record Details
              </p>
              <ul className="space-y-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {item.highlights.map((h) => (
                  <li key={h}>• {h}</li>
                ))}
              </ul>
              {item.missingInfo && item.missingInfo.length > 0 && (
                <div className="rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] p-2.5 space-y-1">
                  <p className="flex items-center gap-1.5 font-mono text-[10px] text-blue-700 dark:text-blue-400">
                    <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
                    <span>Pending Manual Completion</span>
                  </p>
                  <ul className="space-y-0.5 text-[11px] text-slate-600 dark:text-slate-400">
                    {item.missingInfo.map((note) => (
                      <li key={note}>– {note}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/70 pt-3">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => toggleExpand(expandKey)}
              className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] cursor-pointer"
            >
              <span>{isOpen ? 'Less' : 'Highlights'}</span>
              {isOpen ? (
                <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
              )}
            </button>

            {cert && (
              <button
                type="button"
                onClick={() => handleOpenCertificate(item)}
                className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-xs font-medium transition-colors rounded-[4px] cursor-pointer ${
                  hasVerifiedCert
                    ? 'text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {hasVerifiedCert ? (
                  <FileCheck2 className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <FileClock className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                <span>{hasVerifiedCert ? 'Certificate' : 'Cert Slot'}</span>
              </button>
            )}

            {roleMedia.length > 0 && (
              <button
                type="button"
                onClick={() =>
                  setLightboxState({
                    item: roleMedia[0],
                    items: roleMedia,
                  })
                }
                className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-xs font-medium text-blue-700 transition-colors hover:text-cyan-700 dark:text-blue-300 dark:hover:text-cyan-300 rounded-[4px] cursor-pointer"
              >
                <Images className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Media ({roleMedia.length})</span>
              </button>
            )}

            {item.evidenceUrl && (
              <a
                href={item.evidenceUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-xs font-medium text-cyan-700 dark:text-cyan-300 hover:text-cyan-800 dark:hover:text-cyan-200"
              >
                <span>Document</span>
                <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
              </a>
            )}
          </div>

          <Link
            to={`/experience/${item.id}`}
            className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300 transition-colors hover:text-cyan-800 dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
          >
            <span>Role Page</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </SurfaceCard>
    );
  };

  return (
    <section
      id="experience"
      className={`border-b border-slate-200 dark:border-slate-800/80 ${
        expanded
          ? 'bg-slate-50 dark:bg-[#050914] py-10 sm:py-14'
          : `bg-slate-100/70 dark:bg-[#080e1c] ${DESIGN_TOKENS.spacing.sectionY}`
      }`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-12`}>
        {!expanded && (
          <SectionHeading
            index="05"
            eyebrow="Leadership & Experience"
            title="Executive Governance, Ambassador Outreach & Service"
            description="Structured timeline separating current positions, former tenures, executive committee mandates, campus ambassador outreach, event organization, and volunteering—paired with verified responsibilities, actual contributions, and documentary evidence."
            actionLabel={`View All ${EXPERIENCES.length} Roles`}
            actionTo="/experience"
          />
        )}

        {/* Six-Dimension Quick Overview & Filter Strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              label: 'Current Positions',
              value: dimensionGroups.currentPositions.length,
              onClick: () => {
                setCategory('all');
                setStatus('current');
              },
              active: status === 'current' && category === 'all',
            },
            {
              label: 'Former Positions',
              value: dimensionGroups.formerPositions.length,
              onClick: () => {
                setCategory('all');
                setStatus('former');
              },
              active: status === 'former' && category === 'all',
            },
            {
              label: 'Executive Committee',
              value: dimensionGroups.executiveCommittee.length,
              onClick: () => {
                setCategory('executive');
                setStatus('all');
              },
              active: category === 'executive',
            },
            {
              label: 'Campus Ambassador',
              value: dimensionGroups.campusAmbassador.length,
              onClick: () => {
                setCategory('ambassador');
                setStatus('all');
              },
              active: category === 'ambassador',
            },
            {
              label: 'Event Organization',
              value: dimensionGroups.eventOrganization.length,
              onClick: () => {
                setCategory('event_organization');
                setStatus('all');
              },
              active: category === 'event_organization',
            },
            {
              label: 'Volunteering',
              value: dimensionGroups.volunteering.length,
              onClick: () => {
                setCategory('volunteering');
                setStatus('all');
              },
              active: category === 'volunteering',
            },
          ].map((bucket) => (
            <button
              key={bucket.label}
              type="button"
              onClick={bucket.onClick}
              aria-pressed={bucket.active}
              className={`rounded-[12px] border p-3.5 text-left transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                bucket.active
                  ? 'border-blue-600 bg-blue-50/70 dark:border-cyan-400/70 dark:bg-blue-600/15'
                  : 'border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] hover:border-blue-400/60'
              }`}
            >
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400 truncate">
                {bucket.label}
              </p>
              <p className="mt-1 font-mono text-xl font-bold text-slate-900 dark:text-slate-50 tabular-nums">
                {bucket.value}
              </p>
            </button>
          ))}
        </div>

        {/* Highlighted Executive Leadership Sub-Band on Homepage */}
        {!expanded && (
          <SectionReveal>
            <div className="space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <ShieldCheck
                    className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                    aria-hidden="true"
                  />
                  <span>Active Executive Committee &amp; Departmental Governance</span>
                </div>
                <span className={DESIGN_TOKENS.typography.monoMicro}>
                  {statusCounts.current} Current · {statusCounts.former} Former
                </span>
              </div>

              <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
                {visibleLeadership.map((item) => renderRoleCard(item, 'lead'))}
              </div>
            </div>
          </SectionReveal>
        )}

        {/* Filterable Directory & Timeline */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {expanded
                  ? 'Full Role Registry by Dimension & Timeline'
                  : 'Experience Explorer · Filter by Track or Tenure'}
              </h3>
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                Showing {visibleItems.length} of {filtered.length} matching entries ({EXPERIENCES.length} total documented roles)
              </p>
            </div>

            {expanded && (
              <div
                role="group"
                aria-label="Experience layout switcher"
                className="flex items-center rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] p-1"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grouped')}
                  aria-pressed={viewMode === 'grouped'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'grouped'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Grouped</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('timeline')}
                  aria-pressed={viewMode === 'timeline'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'timeline'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <ListTree className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Timeline</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Grid</span>
                </button>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Filter experience by category"
                className="flex flex-wrap gap-2"
              >
                {CATEGORY_TABS.map((tab) => {
                  const active = category === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCategory(tab.id)}
                      className={`min-h-[40px] sm:min-h-[38px] rounded-[10px] border px-3 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label} ({counts[tab.id]})
                    </button>
                  );
                })}
              </div>

              <div
                role="group"
                aria-label="Filter experience by current or former status"
                className="flex items-center rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] p-1"
              >
                {(
                  [
                    { id: 'all', label: `All (${statusCounts.all})` },
                    { id: 'current', label: `Current (${statusCounts.current})` },
                    { id: 'former', label: `Former (${statusCounts.former})` },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={status === item.id}
                    onClick={() => setStatus(item.id)}
                    className={`min-h-[38px] sm:min-h-0 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer ${
                      status === item.id
                        ? 'bg-[#2563eb] text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {expanded && (
              <div className="relative w-full sm:max-w-sm">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <label htmlFor="experience-search" className="sr-only">
                  Search roles, organizations, responsibilities, or contributions
                </label>
                <input
                  id="experience-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search roles, organizations, or contributions..."
                  className="h-9 w-full rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#060b16] pr-3 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                />
              </div>
            )}
          </div>

          {visibleItems.length === 0 ? (
              <EmptyState
                title="No Matching Experience Records"
                message="No roles match the selected category, tenure status, or search keywords."
                actionLabel="Reset Experience Filters"
                onAction={() => {
                  setCategory('all');
                  setStatus('all');
                  setQuery('');
                }}
              />
            ) : expanded && viewMode === 'grouped' ? (
              <div className="space-y-12">
                {filteredGroupedSections.map((group) => (
                  <div key={group.id} className="space-y-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
                      <div>
                        <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                          {group.title} ({group.items.length})
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {group.subtitle}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 tabular-nums">
                        {group.items.filter((i) => i.isCurrent).length} Current ·{' '}
                        {group.items.filter((i) => !i.isCurrent).length} Former
                      </span>
                    </div>

                    <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
                      {group.items.map((item) => renderRoleCard(item, `grp-${group.id}`))}
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'timeline' ? (
              <div className="relative pl-6 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-cyan-600/45 dark:before:from-cyan-400/55 before:via-blue-500/35 before:to-slate-200 dark:before:to-slate-800 md:pl-0 md:before:left-[186px]">
                {visibleItems.map((item) => (
                  <div
                    key={item.id}
                    className="relative grid gap-3 md:grid-cols-[170px_1fr] md:gap-10"
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute top-2 -left-6 h-3.5 w-3.5 rounded-[3px] border md:top-5 md:left-[179.5px] ${
                        item.isCurrent
                          ? 'border-cyan-600 dark:border-cyan-300 bg-slate-50 dark:bg-[#050914] shadow-[0_0_0_3px_rgba(14,116,144,0.16)] dark:shadow-[0_0_0_3px_rgba(34,211,238,0.16)]'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-[#0b1222]'
                      }`}
                    />

                    <div className="min-w-0 space-y-1 pt-0.5 md:text-right">
                      <p
                        className={`font-mono text-xs font-medium ${
                          item.isCurrent
                            ? 'text-cyan-700 dark:text-cyan-400'
                            : 'text-slate-600 dark:text-slate-400'
                        }`}
                      >
                        {item.isCurrent ? 'Current' : 'Former'}
                      </p>
                      <p className="font-mono text-xs text-slate-800 dark:text-slate-200 tabular-nums">
                        {item.period}
                      </p>
                      {item.subCategory && (
                        <p className="font-mono text-[11px] text-slate-500">
                          {item.subCategory}
                        </p>
                      )}
                    </div>

                    {renderRoleCard(item, 'tl')}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
                {visibleItems.map((item) => renderRoleCard(item, 'grid'))}
              </div>
            )}

          {!expanded && filtered.length > visibleItems.length && (
            <div className="flex justify-center pt-2">
              <LinkButton
                to="/experience"
                variant="secondary"
                size="md"
                className="max-w-full !whitespace-normal text-center"
              >
                <span>
                  Explore Full Experience Directory ({EXPERIENCES.length} Documented Roles)
                </span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              </LinkButton>
            </div>
          )}
        </div>
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
