import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { Compass, Images } from 'lucide-react';
import { ABOUT_STORY, JOURNEY_MILESTONES, VISUAL_ARCHIVE } from '../../data/portfolio';
import { useMotionPreference } from '../../hooks/useMotionPreference';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { VisualArchiveItem } from '../../types/portfolio';
import {
  countJourneyByCategory,
  filterJourneyMilestones,
  getVisualArchiveForJourney,
  type JourneyFilter,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { Badge } from '../ui/Badge';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';

const JOURNEY_TABS: { id: JourneyFilter; label: string }[] = [
  { id: 'All', label: 'All Milestones' },
  { id: 'Academic Foundation', label: 'Academics' },
  { id: 'Engineering & Research', label: 'Engineering & Research' },
  { id: 'Competitions & Voice', label: 'Competitions & Voice' },
  { id: 'Leadership & Outreach', label: 'Leadership & Outreach' },
];

export function JourneyPreview() {
  const [selectedCategory, setSelectedCategory] = useState<JourneyFilter>('All');
  const [lightboxState, setLightboxState] = useState<{
    item: VisualArchiveItem;
    items: VisualArchiveItem[];
  } | null>(null);
  const { shouldReduceMotion } = useMotionPreference();

  const counts = useMemo(
    () => countJourneyByCategory(JOURNEY_MILESTONES),
    [],
  );

  const visibleMilestones = useMemo(
    () => filterJourneyMilestones(JOURNEY_MILESTONES, selectedCategory),
    [selectedCategory],
  );

  return (
    <section
      id="journey"
      className={`relative border-b border-slate-200 dark:border-slate-800/80 bg-slate-100 dark:bg-[#080e1c] ${DESIGN_TOKENS.spacing.sectionY}`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ambient-section-light"
      />
      <div className={`relative ${DESIGN_TOKENS.spacing.container} space-y-10`}>
        <SectionHeading
          index="02"
          eyebrow="Personal Development & Chronology"
          title="Professional & Academic Journey"
          description="Chronological evolution across Chattogram, Notre Dame College Dhaka, and SUST—tracing academic rigor, engineering software creation, competitive speaking, and organizational leadership."
          actionLabel="Explore Full Experience"
          actionTo="/experience"
        />

        {/* Personal Development Narrative Banner */}
        <SectionReveal>
          <SurfaceCard variant="accent" className="p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
              <div className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-blue-500/35 dark:border-blue-500/40 bg-slate-50 dark:bg-[#060b16] text-cyan-700 dark:text-cyan-400">
                <Compass className="h-4 w-4" aria-hidden="true" />
              </div>
              <div className="space-y-1.5">
                <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
                  Personal Development Journey
                </p>
                <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">
                  {ABOUT_STORY.personalDevelopmentNarrative}
                </p>
              </div>
            </div>
          </SurfaceCard>
        </SectionReveal>

        {/* Phase Filter Group */}
        <div
          role="group"
          aria-label="Filter journey milestones by track"
          className="flex flex-wrap gap-2"
        >
          {JOURNEY_TABS.map((tab) => {
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                aria-pressed={active}
                onClick={() => setSelectedCategory(tab.id)}
                className={`min-h-[38px] rounded-[10px] border px-3.5 py-2 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer ${
                  active
                    ? 'border-blue-600/80 dark:border-blue-500/80 bg-blue-50 dark:bg-blue-600/20 text-blue-900 dark:text-cyan-200'
                    : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.label} ({counts[tab.id]})
              </button>
            );
          })}
        </div>

        {/* Sophisticated Architectural Vertical Timeline */}
        <SectionReveal delay={0.05}>
          <motion.div
            key={selectedCategory}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: shouldReduceMotion ? 0 : DESIGN_TOKENS.motion.durationBase,
              ease: DESIGN_TOKENS.motion.ease,
            }}
            className="relative pl-6 space-y-6 before:absolute before:top-2 before:bottom-2 before:left-[7px] before:w-px before:bg-gradient-to-b before:from-cyan-600/60 dark:before:from-cyan-400/60 before:via-blue-500/40 before:to-slate-300 dark:before:to-slate-800 md:pl-0 md:before:left-[186px]"
          >
            {visibleMilestones.map((milestone, idx) => {
              const milestonePhotos = getVisualArchiveForJourney(
                VISUAL_ARCHIVE,
                milestone.id,
              );
              return (
                <div
                  key={milestone.id}
                  className="relative grid gap-3 md:grid-cols-[170px_1fr] md:gap-10"
                >
                  {/* Structural Rail Marker */}
                  <span
                    aria-hidden="true"
                    className={`absolute top-2 -left-6 h-3.5 w-3.5 rounded-[3px] border md:top-5 md:left-[179.5px] ${
                      idx === visibleMilestones.length - 1 ||
                      milestone.year.includes('Present')
                        ? 'border-cyan-600 dark:border-cyan-300 bg-white dark:bg-[#080e1c] shadow-[0_0_0_3px_rgba(14,116,144,0.16)] dark:shadow-[0_0_0_3px_rgba(34,211,238,0.16)]'
                        : 'border-blue-600/75 dark:border-blue-500/75 bg-white dark:bg-[#0b1222]'
                    }`}
                  />

                  {/* Left Chronological Metadata Column */}
                  <div className="min-w-0 space-y-1.5 pt-0.5 md:text-right">
                    <div>
                      <Badge tone="cyan">{milestone.year}</Badge>
                    </div>
                    <p className="font-mono text-[11px] text-blue-700 dark:text-blue-300">
                      {milestone.category}
                    </p>
                    <p className="text-xs leading-snug text-slate-600 dark:text-slate-400">
                      {milestone.institution}
                    </p>
                  </div>

                  {/* Right Milestone Content Card */}
                  <SurfaceCard
                    variant="interactive"
                    as="article"
                    className="p-5 sm:p-6 space-y-3"
                  >
                    <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
                      {milestone.title}
                    </h3>

                    <p className={DESIGN_TOKENS.typography.body}>
                      {milestone.detail}
                    </p>

                    <ul className="space-y-1.5 border-t border-slate-200 dark:border-slate-800/70 pt-3 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                      {milestone.highlights.map((item) => (
                        <li key={item}>• {item}</li>
                      ))}
                    </ul>

                    {milestonePhotos.length > 0 && (
                      <div className="space-y-2 border-t border-slate-200/80 dark:border-slate-800/60 pt-3">
                        <p className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                          <Images className="h-3.5 w-3.5" aria-hidden="true" />
                          <span>Milestone Visual Evidence ({milestonePhotos.length})</span>
                        </p>
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-5">
                          {milestonePhotos.map((photo) => (
                            <button
                              key={photo.id}
                              type="button"
                              onClick={() =>
                                setLightboxState({
                                  item: photo,
                                  items: milestonePhotos,
                                })
                              }
                              aria-label={`Inspect milestone photograph: ${photo.associatedRecord}`}
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

                    <p className="border-t border-slate-200 dark:border-slate-800/60 pt-2.5 font-mono text-[11px] text-cyan-800 dark:text-cyan-300/90">
                      Takeaway: {milestone.takeaway}
                    </p>
                  </SurfaceCard>
                </div>
              );
            })}
          </motion.div>
        </SectionReveal>
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
