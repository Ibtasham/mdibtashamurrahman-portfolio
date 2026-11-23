import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Award,
  BarChart3,
  BookOpen,
  Code2,
  Cog,
  Download,
  ExternalLink,
  Eye,
  FileCheck2,
  FileClock,
  Search,
  Sigma,
  Users,
} from 'lucide-react';
import { CERTIFICATES, SKILL_CATEGORIES } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { CertificateAttachment, SkillCategoryId } from '../../types/portfolio';
import {
  countCertificatesByCategory,
  filterCertificates,
  filterSkillCategories,
  type CertificateCategoryFilter,
  type CertificateStatusFilter,
  type SkillFilter,
} from '../../utils/portfolioFilters';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { Badge } from '../ui/Badge';
import { Button, LinkButton } from '../ui/Button';
import { CertificateModal } from '../ui/CertificateModal';
import { EmptyState } from '../ui/EmptyState';
import { OrganizationMark } from '../ui/OrganizationMark';
import { SectionHeading } from '../ui/SectionHeading';
import { SurfaceCard } from '../ui/SurfaceCard';

interface SkillsCertificatesSectionProps {
  expanded?: boolean;
}

const SKILL_CATEGORY_TABS: { id: SkillFilter; label: string }[] = [
  { id: 'all', label: 'All Tracks' },
  { id: 'industrial-engineering', label: 'Industrial Engineering' },
  { id: 'programming-software', label: 'Programming & Software' },
  { id: 'data-ml', label: 'Data & ML' },
  { id: 'operations-research', label: 'Operations Research' },
  { id: 'research-methods', label: 'Research Methods' },
  { id: 'communication-leadership', label: 'Communication & Leadership' },
];

const CATEGORY_ICONS: Record<SkillCategoryId, typeof Cog> = {
  'industrial-engineering': Cog,
  'programming-software': Code2,
  'data-ml': BarChart3,
  'operations-research': Sigma,
  'research-methods': BookOpen,
  'communication-leadership': Users,
};

const CERT_CATEGORY_TABS: CertificateCategoryFilter[] = [
  'All',
  'Experience & Outreach',
  'Competition',
  'Volunteering',
  'Academic',
];

export function SkillsCertificatesSection({
  expanded = false,
}: SkillsCertificatesSectionProps) {
  const [skillFilter, setSkillFilter] = useState<SkillFilter>('all');
  const [skillQuery, setSkillQuery] = useState('');

  const [certCategory, setCertCategory] =
    useState<CertificateCategoryFilter>('All');
  const [certStatus, setCertStatus] = useState<CertificateStatusFilter>('all');
  const [certQuery, setCertQuery] = useState('');
  const [activeCertificate, setActiveCertificate] =
    useState<CertificateAttachment | null>(null);

  const visibleSkillGroups = useMemo(
    () => filterSkillCategories(SKILL_CATEGORIES, skillFilter, skillQuery),
    [skillFilter, skillQuery],
  );

  const certCounts = useMemo(
    () => countCertificatesByCategory(CERTIFICATES),
    [],
  );

  const visibleCertificates = useMemo(
    () => filterCertificates(CERTIFICATES, certCategory, certStatus, certQuery),
    [certCategory, certStatus, certQuery],
  );

  const verifiedCount = CERTIFICATES.filter(
    (c) => c.status === 'Verified Attachment',
  ).length;
  const pendingCount = CERTIFICATES.length - verifiedCount;

  return (
    <section
      id="skills"
      className={`border-b border-slate-200 dark:border-slate-800/80 ${
        expanded
          ? 'bg-slate-50 dark:bg-[#050914] py-10 sm:py-14'
          : `bg-slate-100/70 dark:bg-[#080e1c] ${DESIGN_TOKENS.spacing.sectionY}`
      }`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-12`}>
        {!expanded && (
          <SectionHeading
            index="07"
            eyebrow="Skills & Verification"
            title="Engineering, Computing, OR & Research Matrix"
            description="Evidence-linked capability matrix across Industrial Engineering, Software, Machine Learning, Operations Research, Research Methods, and Leadership alongside the searchable certificate gallery."
            actionLabel="Full Skills & Certificate Gallery"
            actionTo="/skills"
          />
        )}

        {/* Part A: Evidence-Linked Skill Categories */}
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <div className="space-y-0.5">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Core Technical &amp; Professional Capabilities
              </h3>
              <p className="font-mono text-[11px] text-slate-600 dark:text-slate-500">
                Zero arbitrary numeric percentages — every skill traces directly to projects, manuscripts, coursework, or verified roles
              </p>
            </div>
            <span className={DESIGN_TOKENS.typography.monoMicro}>
              6 Core Tracks · Evidence-Linked Matrix
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div
                role="group"
                aria-label="Filter skill categories"
                className="flex flex-wrap gap-1.5"
              >
                {SKILL_CATEGORY_TABS.map((tab) => {
                  const active = skillFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setSkillFilter(tab.id)}
                      className={`min-h-[40px] sm:min-h-[36px] rounded-[10px] border px-2.5 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap shrink-0 cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full sm:w-64 shrink-0">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <label htmlFor="skills-search" className="sr-only">
                  Search skills, methods, tools, or evidence links
                </label>
                <input
                  id="skills-search"
                  type="search"
                  value={skillQuery}
                  onChange={(e) => setSkillQuery(e.target.value)}
                  placeholder="Search (e.g., OR-Tools, SPC)..."
                  className="h-9 w-full rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#060b16] pr-3 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {visibleSkillGroups.length === 0 ? (
            <EmptyState
              title="No Matching Skills"
              message="No skills or linked evidence match the active search keywords or category tab."
              actionLabel="Reset Skill Filters"
              onAction={() => {
                setSkillFilter('all');
                setSkillQuery('');
              }}
            />
          ) : (
            <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2`}>
              {visibleSkillGroups.map((group) => {
                const Icon = CATEGORY_ICONS[group.id];
                const trackIndex =
                  SKILL_CATEGORIES.findIndex((g) => g.id === group.id) + 1;
                return (
                  <SurfaceCard
                    key={group.id}
                    as="article"
                    className="flex min-w-0 flex-col justify-between p-6 space-y-5"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3.5">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-500/40 bg-blue-50 dark:bg-[#060b16] text-cyan-700 dark:text-cyan-400">
                            <Icon className="h-4 w-4" aria-hidden="true" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400 tabular-nums">
                              0{trackIndex} · {group.subtitle}
                            </span>
                            <h4 className={DESIGN_TOKENS.typography.cardTitleLg}>
                              {group.title}
                            </h4>
                          </div>
                        </div>
                        <span className="shrink-0 font-mono text-[11px] text-slate-500 tabular-nums">
                          {group.items.length} items
                        </span>
                      </div>

                      <p className={DESIGN_TOKENS.typography.bodyMuted}>
                        {group.summary}
                      </p>

                      <ul className="divide-y divide-slate-200 dark:divide-slate-800/60 border-t border-slate-200 dark:border-slate-800/70">
                        {group.items.map((skill) => (
                          <li key={skill.name} className="py-3 space-y-1.5">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 sm:text-sm">
                                {skill.name}
                              </span>
                              {skill.proficiency && (
                                <span className="font-mono text-[11px] font-medium text-cyan-700 dark:text-cyan-300">
                                  {skill.proficiency}
                                </span>
                              )}
                            </div>
                            {skill.detail && (
                              <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                                {skill.detail}
                              </p>
                            )}
                            {skill.evidenceLinks && skill.evidenceLinks.length > 0 && (
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-0.5">
                                {skill.evidenceLinks.map((ev) => (
                                  <Link
                                    key={`${skill.name}-${ev.to}-${ev.label}`}
                                    to={ev.to}
                                    className="inline-flex items-center gap-1 font-mono text-[11px] text-blue-700 dark:text-cyan-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 rounded-[4px]"
                                  >
                                    <span className="text-slate-500 dark:text-slate-400">
                                      {ev.kind}:
                                    </span>
                                    <span>{ev.label}</span>
                                    <ArrowUpRight className="h-3 w-3 shrink-0" aria-hidden="true" />
                                  </Link>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </SurfaceCard>
                );
              })}
            </div>
          )}
        </div>

        {/* Part B: Searchable Certificate Gallery (Full on /skills, Compact Link Strip on Homepage) */}
        {expanded ? (
          <div
            id="certificates-gallery"
            className="space-y-6 border-t border-slate-200 dark:border-slate-800/80 pt-10"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <Award
                  className="h-4 w-4 text-cyan-700 dark:text-cyan-400"
                  aria-hidden="true"
                />
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Certificate Gallery &amp; Credential Records
                </h3>
              </div>
              <span className={DESIGN_TOKENS.typography.monoMicro}>
                {verifiedCount} Verified Attached · {pendingCount} Pending Upload
              </span>
            </div>

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div
                role="group"
                aria-label="Browse certificates by category"
                className="flex flex-wrap gap-2"
              >
                {CERT_CATEGORY_TABS.map((cat) => {
                  const active = certCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCertCategory(cat)}
                      className={`min-h-[40px] sm:min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer ${
                        active
                          ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                      }`}
                    >
                      {cat} ({certCounts[cat]})
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div
                  role="group"
                  aria-label="Filter certificates by verification status"
                  className="flex items-center rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] p-1"
                >
                  {(
                    [
                      { id: 'all', label: 'All' },
                      { id: 'verified', label: 'Verified' },
                      { id: 'pending', label: 'Pending' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      aria-pressed={certStatus === item.id}
                      onClick={() => setCertStatus(item.id)}
                      className={`min-h-[38px] sm:min-h-0 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap cursor-pointer ${
                        certStatus === item.id
                          ? 'bg-[#2563eb] text-white'
                          : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                    aria-hidden="true"
                  />
                  <label htmlFor="certificates-search" className="sr-only">
                    Search certificates by title or issuer
                  </label>
                  <input
                    id="certificates-search"
                    type="search"
                    value={certQuery}
                    onChange={(e) => setCertQuery(e.target.value)}
                    placeholder="Search certificates or issuers..."
                    className="h-9 w-full rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#060b16] pr-3 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                  />
                </div>
              </div>
            </div>

            {visibleCertificates.length === 0 ? (
              <EmptyState
                title="No Matching Certificates"
                message="No certificates match the selected category, verification status, or search keywords."
                actionLabel="Reset Certificate Filters"
                onAction={() => {
                  setCertCategory('All');
                  setCertStatus('all');
                  setCertQuery('');
                }}
              />
            ) : (
              <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-2 lg:grid-cols-3`}>
                {visibleCertificates.map((cert) => {
                  const isVerified = cert.status === 'Verified Attachment';
                  return (
                    <SurfaceCard
                      key={cert.id}
                      variant={isVerified ? 'accent' : 'interactive'}
                      as="article"
                      className="flex min-w-0 flex-col justify-between p-5"
                    >
                      <div className="space-y-3">
                        {isVerified && cert.fileType === 'Image' && cert.fileUrl && (
                          <button
                            type="button"
                            onClick={() => setActiveCertificate(cert)}
                            aria-label={`Preview certificate scan: ${cert.title}`}
                            className="block w-full overflow-hidden rounded-[10px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] cursor-pointer"
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

                        <div className="flex items-start gap-3">
                          <OrganizationMark
                            code={cert.organizationCode}
                            organization={cert.issuer}
                            logoUrl={cert.organizationLogoUrl}
                            active={isVerified}
                          />
                          <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <Badge tone={isVerified ? 'cyan' : 'neutral'} wrap>
                                {isVerified ? (
                                  <FileCheck2 className="h-3 w-3" aria-hidden="true" />
                                ) : (
                                  <FileClock className="h-3 w-3" aria-hidden="true" />
                                )}
                                <span>{cert.status}</span>
                              </Badge>
                              <Badge tone="blue">{cert.category}</Badge>
                            </div>
                          </div>
                        </div>

                        <h4 className={DESIGN_TOKENS.typography.cardTitle}>
                          {cert.title}
                        </h4>

                        <div className="space-y-1.5 rounded-[10px] border border-slate-200 dark:border-slate-800/70 bg-slate-100 dark:bg-[#060b16] p-3 text-xs">
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-500">
                              Issuer
                            </span>
                            <span className="text-right font-medium text-blue-700 dark:text-blue-300">
                              {cert.issuer}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-500">
                              Issue Date
                            </span>
                            <span className="font-mono text-slate-800 dark:text-slate-200 tabular-nums">
                              {cert.date}
                            </span>
                          </div>
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="font-mono text-[10px] text-slate-500">
                              Verify URL
                            </span>
                            {cert.verificationUrl ? (
                              <a
                                href={cert.verificationUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 font-mono text-[11px] text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 dark:hover:text-cyan-200"
                              >
                                <span>Verify</span>
                                <ExternalLink className="h-3 w-3" aria-hidden="true" />
                              </a>
                            ) : (
                              <span className="font-mono text-[11px] text-slate-500">
                                Not supplied
                              </span>
                            )}
                          </div>
                          {cert.credentialId && (
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-mono text-[10px] text-slate-500">
                                Credential ID
                              </span>
                              <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300">
                                {cert.credentialId}
                              </span>
                            </div>
                          )}
                        </div>

                        <p className={DESIGN_TOKENS.typography.bodyMuted}>
                          {cert.notes}
                        </p>
                      </div>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2.5 border-t border-slate-200 dark:border-slate-800/70 pt-3">
                        <Button
                          type="button"
                          variant={isVerified ? 'secondary' : 'ghost'}
                          size="sm"
                          onClick={() => setActiveCertificate(cert)}
                          className="!min-h-[40px] sm:!min-h-[34px] !px-3"
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>
                            {isVerified ? 'Preview Certificate' : 'Record Details'}
                          </span>
                        </Button>

                        {cert.fileUrl && (
                          <a
                            href={cert.fileUrl}
                            download
                            className="inline-flex min-h-[40px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 font-mono text-xs font-semibold text-cyan-700 hover:text-cyan-800 dark:text-cyan-300 transition-colors dark:hover:text-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px]"
                          >
                            <Download className="h-3.5 w-3.5" aria-hidden="true" />
                            <span>Download</span>
                          </a>
                        )}
                      </div>
                    </SurfaceCard>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[14px] border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0b1222] px-5 py-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-400">
              <Award
                className="h-4 w-4 text-cyan-700 dark:text-cyan-400 shrink-0"
                aria-hidden="true"
              />
              <span>
                Searchable Certificate Gallery &amp; Credential Records ({verifiedCount} Verified Attached · {pendingCount} Archival Slots)
              </span>
            </div>
            <LinkButton to="/skills#certificates-gallery" variant="secondary" size="sm">
              <span>Search Certificate Gallery</span>
              <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            </LinkButton>
          </div>
        )}
      </div>

      <CertificateModal
        certificate={activeCertificate}
        onClose={() => setActiveCertificate(null)}
      />
    </section>
  );
}
