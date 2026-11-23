import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Cpu,
  Download,
  GraduationCap,
  Images,
  Layers,
  Target,
} from 'lucide-react';
import {
  ABOUT_STORY,
  ACADEMIC_INTERESTS,
  DIMENSIONS,
  EDUCATION,
  FUTURE_ASPIRATIONS,
  PROFILE,
  SKILL_GROUPS,
  VISUAL_ARCHIVE,
} from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { VisualArchiveItem } from '../../types/portfolio';
import {
  filterEducationEntries,
  getVisualArchiveForEducation,
  type EducationFilter,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { Badge } from '../ui/Badge';
import { ExternalLinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';

interface AboutPreviewProps {
  expanded?: boolean;
}

const EDUCATION_TABS: { id: EducationFilter; label: string }[] = [
  { id: 'all', label: 'All Stages' },
  { id: 'university', label: 'University (SUST)' },
  { id: 'secondary', label: 'College & School' },
];

export function AboutPreview({ expanded = false }: AboutPreviewProps) {
  const [eduFilter, setEduFilter] = useState<EducationFilter>('all');
  const [expandedEduIds, setExpandedEduIds] = useState<Record<string, boolean>>({
    'sust-ipe': true,
    'ndc-hsc': true,
  });
  const [lightboxState, setLightboxState] = useState<{
    item: VisualArchiveItem;
    items: VisualArchiveItem[];
  } | null>(null);

  const visibleEducation = useMemo(
    () => filterEducationEntries(EDUCATION, eduFilter),
    [eduFilter],
  );

  const toggleEducationDetails = (id: string) => {
    setExpandedEduIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section
      id="about"
      className={`border-b border-slate-200 dark:border-slate-800/80 ${
        expanded ? 'bg-slate-50 dark:bg-[#050914]' : 'bg-white dark:bg-[#080e1c]'
      } ${DESIGN_TOKENS.spacing.sectionY}`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} ${DESIGN_TOKENS.spacing.sectionStack}`}>
        <SectionHeading
          index="01"
          eyebrow="Introduction & Academic Foundation"
          title={ABOUT_STORY.headline}
          description={PROFILE.extendedBio}
          actionLabel={expanded ? undefined : 'Dedicated About Page'}
          actionTo={expanded ? undefined : '/about'}
        />

        {/* Editorial Portrait (Full /about page) + Key Standing & Personal Introduction */}
        <SectionReveal>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-start">
            {/* Left Column: Full Portrait Plate on /about; Academic Profile & Credentials Summary on Homepage */}
            <div className="min-w-0 space-y-4 lg:col-span-5">
              {expanded && (
                <SurfaceCard className="overflow-hidden p-2.5">
                  <figure className="space-y-3">
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-[10px] border border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#060b16]">
                      <img
                        src={ABOUT_STORY.portrait.src}
                        alt={ABOUT_STORY.portrait.alt}
                        width={960}
                        height={1200}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <figcaption className="space-y-1 border-t border-slate-200 dark:border-slate-800/70 px-1.5 pt-2.5 pb-1">
                      <p className="font-mono text-xs font-medium text-cyan-700 dark:text-cyan-400">
                        {ABOUT_STORY.portrait.caption}
                      </p>
                      <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        {ABOUT_STORY.portrait.context}
                      </p>
                    </figcaption>
                  </figure>
                </SurfaceCard>
              )}

              <SurfaceCard className="grid grid-cols-2 gap-px overflow-hidden bg-slate-200 dark:bg-slate-800/60">
                <div className="bg-white dark:bg-[#0b1222] p-3.5">
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Standing</p>
                  <p className="mt-1 text-xs font-medium text-slate-900 dark:text-slate-100">
                    {PROFILE.academicStanding}
                  </p>
                </div>
                <div className="bg-white dark:bg-[#0b1222] p-3.5">
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Session</p>
                  <p className="mt-1 font-mono text-xs font-medium text-cyan-700 dark:text-cyan-300 tabular-nums">
                    {PROFILE.session} · B.Sc. IPE
                  </p>
                </div>
                <div className="bg-white dark:bg-[#0b1222] p-3.5">
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Origin</p>
                  <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                    Begumganj, Noakhali
                  </p>
                </div>
                <div className="bg-white dark:bg-[#0b1222] p-3.5">
                  <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">Languages</p>
                  <p className="mt-1 text-xs font-medium text-slate-800 dark:text-slate-200">
                    Bengali · English
                  </p>
                </div>
              </SurfaceCard>

              <div className="flex flex-wrap gap-3">
                <ExternalLinkButton
                  href={PROFILE.links.cvPdf}
                  download="MD_Ibtashamur_Rahman_CV.pdf"
                  variant="secondary"
                  size="sm"
                  className="w-full"
                >
                  <Download className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                  <span>Download Verified CV (PDF)</span>
                </ExternalLinkButton>
              </div>
            </div>

            {/* Introduction, Biography & Four Dimensions */}
            <div className="min-w-0 space-y-6 lg:col-span-7">
              <SurfaceCard variant="accent" className="p-6 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
                  <span className="text-cyan-700 dark:text-cyan-400">
                    Personal Introduction
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    Emerging IPE Professional
                  </span>
                </div>
                <p className={DESIGN_TOKENS.typography.editorialLead}>
                  {ABOUT_STORY.personalIntroduction}
                </p>
              </SurfaceCard>

              <SurfaceCard className="p-6 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <Layers className="h-4 w-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Professional Biography
                  </h3>
                </div>
                <div className="space-y-3.5">
                  {ABOUT_STORY.biographyParagraphs.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-relaxed text-slate-700 dark:text-slate-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </SurfaceCard>

              {expanded && (
                <div className="grid gap-3.5 sm:grid-cols-2">
                  {DIMENSIONS.map((dim, idx) => (
                    <Link
                      key={dim.id}
                      to={dim.route}
                      className="group block rounded-[14px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                    >
                      <SurfaceCard
                        variant="interactive"
                        className="flex h-full flex-col justify-between p-4"
                      >
                        <div className="space-y-1.5">
                          <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                            0{idx + 1} · {dim.title}
                          </span>
                          <h4 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-50 transition-colors duration-150 group-hover:text-blue-700 dark:group-hover:text-cyan-200">
                            {dim.subtitle}
                          </h4>
                          <p className={DESIGN_TOKENS.typography.bodyMuted}>
                            {dim.summary}
                          </p>
                        </div>
                        <div className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-blue-700 dark:text-blue-400 transition-colors duration-150 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                          <span>Explore</span>
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform duration-150 group-hover:translate-x-0.5"
                            aria-hidden="true"
                          />
                        </div>
                      </SurfaceCard>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </SectionReveal>

        {/* Interactive Education Timeline & Capabilities Split */}
        <SectionReveal delay={0.04}>
          <div className="grid gap-8 lg:grid-cols-12">
            {/* Interactive Formal Education Timeline */}
            <div className="min-w-0 space-y-5 lg:col-span-7">
              <div className="flex flex-col gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <GraduationCap className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                  <span>Interactive Education Timeline</span>
                </div>

                <div
                  role="group"
                  aria-label="Filter education timeline"
                  className="flex flex-wrap gap-1.5"
                >
                  {EDUCATION_TABS.map((tab) => {
                    const active = eduFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setEduFilter(tab.id)}
                        className={`min-h-[40px] sm:min-h-[34px] rounded-[8px] border px-3 sm:px-2.5 py-1.5 sm:py-1 text-xs sm:text-[11px] font-medium transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 ${
                          active
                            ? 'border-blue-600/80 dark:border-blue-500/80 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                            : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative pl-6 space-y-5 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-slate-200 dark:before:bg-slate-800">
                {visibleEducation.map((edu) => {
                  const isOpen = expandedEduIds[edu.id] ?? false;
                  const eduPhotos = getVisualArchiveForEducation(VISUAL_ARCHIVE, edu.id);
                  return (
                    <div key={edu.id} className="relative">
                      <span
                        aria-hidden="true"
                        className={`absolute top-5 -left-6 h-3.5 w-3.5 rounded-[3px] border ${
                          edu.status === 'Current'
                            ? 'border-cyan-600 dark:border-cyan-300 bg-white dark:bg-[#050914] shadow-[0_0_0_3px_rgba(14,116,144,0.14)] dark:shadow-[0_0_0_3px_rgba(34,211,238,0.14)]'
                            : 'border-blue-600/70 dark:border-blue-500/70 bg-white dark:bg-[#0b1222]'
                        }`}
                      />
                      <SurfaceCard className="p-5 space-y-2.5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <Badge tone={edu.status === 'Current' ? 'cyan' : 'neutral'}>
                            {edu.period}
                          </Badge>
                          <span className={DESIGN_TOKENS.typography.monoMicro}>
                            {edu.location}
                          </span>
                        </div>

                        <div>
                          <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                            {edu.institution}
                          </h3>
                          <p className="mt-0.5 text-sm text-slate-800 dark:text-slate-200">
                            {edu.degree} — {edu.field}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="font-mono text-xs text-blue-700 dark:text-blue-300">
                            {edu.grade}
                          </p>
                          <button
                            type="button"
                            aria-expanded={isOpen}
                            onClick={() => toggleEducationDetails(edu.id)}
                            className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors hover:text-blue-700 dark:hover:text-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 rounded-[4px] cursor-pointer"
                          >
                            <span>{isOpen ? 'Hide Coursework & Highlights' : 'Show Highlights'}</span>
                            {isOpen ? (
                              <ChevronUp className="h-3.5 w-3.5" aria-hidden="true" />
                            ) : (
                              <ChevronDown className="h-3.5 w-3.5" aria-hidden="true" />
                            )}
                          </button>
                        </div>

                        {isOpen && (
                          <div className="space-y-3 border-t border-slate-200 dark:border-slate-800/70 pt-2.5">
                            <ul className="space-y-1 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                              {edu.details.map((line) => (
                                <li key={line}>• {line}</li>
                              ))}
                            </ul>

                            {eduPhotos.length > 0 && (
                              <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/60 pt-2.5">
                                <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                                  <Images className="h-3.5 w-3.5" aria-hidden="true" />
                                  <span>Campus &amp; Academic Photographs ({eduPhotos.length})</span>
                                </p>
                                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                                  {eduPhotos.map((photo) => (
                                    <button
                                      key={photo.id}
                                      type="button"
                                      onClick={() =>
                                        setLightboxState({ item: photo, items: eduPhotos })
                                      }
                                      aria-label={`Inspect photograph: ${photo.associatedRecord}`}
                                      className="group overflow-hidden rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] text-left transition-colors hover:border-blue-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                                    >
                                      <ArchiveMediaFrame
                                        src={photo.src}
                                        alt={photo.alt}
                                        kind={photo.kind}
                                        rotateDeg={photo.rotateDeg}
                                        focalPosition={photo.focalPosition}
                                        mode="thumbnail"
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </SurfaceCard>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technical Capabilities, Core Interests & Memberships */}
            <div className="min-w-0 space-y-5 lg:col-span-5">
              {expanded ? (
                <>
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                      Technical &amp; Operational Capabilities
                    </h3>
                    <span className={DESIGN_TOKENS.typography.monoMicro}>
                      Verified Toolkit
                    </span>
                  </div>

                  <SurfaceCard className="space-y-4 p-5">
                    {SKILL_GROUPS.map((group) => (
                      <div
                        key={group.id}
                        className="space-y-1.5 border-b border-slate-200 dark:border-slate-800/70 pb-3.5 last:border-b-0 last:pb-0"
                      >
                        <h4 className="font-mono text-xs text-blue-700 dark:text-blue-400">
                          {group.category}
                        </h4>
                        <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                          {group.items.join(' · ')}
                        </p>
                      </div>
                    ))}
                  </SurfaceCard>
                </>
              ) : (
                <SurfaceCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
                    <h3 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                      Academic &amp; Technical Tracks
                    </h3>
                    <Link
                      to="/about"
                      className="inline-flex min-h-[38px] sm:min-h-0 items-center py-1.5 sm:py-0 font-mono text-[11px] font-medium text-blue-700 dark:text-blue-400 hover:text-cyan-700 dark:hover:text-cyan-300"
                    >
                      Full Chronology →
                    </Link>
                  </div>
                  <ul className="space-y-2.5 text-xs">
                    {ACADEMIC_INTERESTS.map((interest) => (
                      <li
                        key={interest.id}
                        className="border-b border-slate-200/70 dark:border-slate-800/60 pb-2 last:border-b-0 last:pb-0"
                      >
                        <p className="font-medium text-slate-900 dark:text-slate-100">
                          {interest.title}
                        </p>
                        <p className="font-mono text-[11px] text-slate-600 dark:text-slate-400">
                          {interest.topics.join(' · ')}
                        </p>
                      </li>
                    ))}
                  </ul>
                </SurfaceCard>
              )}

              <SurfaceCard className="p-5 space-y-3">
                <h4 className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  Campus Clubs &amp; Alumni Communities
                </h4>
                <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                  {PROFILE.memberships.join(' · ')}
                </p>
                <div className="border-t border-slate-200 dark:border-slate-800/70 pt-3 space-y-1.5">
                  {PROFILE.interests.map((interest) => (
                    <p key={interest.title} className="text-xs text-slate-600 dark:text-slate-400">
                      <span className="font-medium text-slate-900 dark:text-slate-200">
                        {interest.title}:
                      </span>{' '}
                      {interest.detail}
                    </p>
                  ))}
                </div>
              </SurfaceCard>
            </div>
          </div>
        </SectionReveal>

        {/* Academic & Research Interests + Future Aspirations (Full Detail on /about) */}
        {expanded && (
          <>
            <SectionReveal delay={0.05}>
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Cpu className="h-4 w-4 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>Academic &amp; Technical Interests</span>
                  </div>
                  <span className={DESIGN_TOKENS.typography.monoMicro}>
                    IPE Systems · Optimization · ML · Supply Chains
                  </span>
                </div>

                <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} sm:grid-cols-2 lg:grid-cols-4`}>
                  {ACADEMIC_INTERESTS.map((interest) => (
                    <SurfaceCard
                      key={interest.id}
                      as="article"
                      className="flex flex-col justify-between p-5"
                    >
                      <div className="space-y-2.5">
                        <span className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                          {interest.domain}
                        </span>
                        <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                          {interest.title}
                        </h3>
                        <p className={DESIGN_TOKENS.typography.bodyMuted}>
                          {interest.summary}
                        </p>
                      </div>
                      <ul className="mt-4 space-y-1 border-t border-slate-200 dark:border-slate-800/70 pt-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {interest.topics.map((topic) => (
                          <li key={topic}>· {topic}</li>
                        ))}
                      </ul>
                    </SurfaceCard>
                  ))}
                </div>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.06}>
              <div className="space-y-5">
                <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 dark:border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <Target className="h-4 w-4 text-blue-700 dark:text-blue-400" aria-hidden="true" />
                    <span>Future Aspirations &amp; Direction</span>
                  </div>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                    <Compass className="h-3.5 w-3.5 text-cyan-700 dark:text-cyan-400" aria-hidden="true" />
                    <span>Long-Term Engineering &amp; Leadership Outlook</span>
                  </span>
                </div>

                <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} md:grid-cols-3`}>
                  {FUTURE_ASPIRATIONS.map((goal) => (
                    <SurfaceCard
                      key={goal.id}
                      as="article"
                      className="flex flex-col justify-between p-5"
                    >
                      <div className="space-y-2.5">
                        <p className="font-mono text-[11px] font-medium text-blue-700 dark:text-blue-300">
                          {goal.horizon}
                        </p>
                        <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                          {goal.title}
                        </h3>
                        <p className={DESIGN_TOKENS.typography.bodyMuted}>
                          {goal.description}
                        </p>
                      </div>
                      <p className="mt-4 border-t border-slate-200 dark:border-slate-800/70 pt-3 font-mono text-[11px] text-slate-600 dark:text-slate-400">
                        {goal.pillars.join(' · ')}
                      </p>
                    </SurfaceCard>
                  ))}
                </div>
              </div>
            </SectionReveal>
          </>
        )}
      </div>

      <ArchiveLightboxModal
        item={lightboxState?.item ?? null}
        items={lightboxState?.items ?? []}
        onSelect={(item) =>
          setLightboxState((prev) => (prev ? { ...prev, item } : null))
        }
        onClose={() => setLightboxState(null)}
      />
    </section>
  );
}
