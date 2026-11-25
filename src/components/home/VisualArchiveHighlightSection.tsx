import { useMemo, useState } from 'react';
import { ArrowRight, Expand, Images } from 'lucide-react';
import { Link } from 'react-router-dom';
import { VISUAL_ARCHIVE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { VisualArchiveItem } from '../../types/portfolio';
import {
  countVisualArchiveByCategory,
  getHomepageArchiveHighlights,
  VISUAL_ARCHIVE_CATEGORIES,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { LinkButton } from '../ui/Button';
import { SectionHeading } from '../ui/SectionHeading';
import { SectionReveal } from '../ui/SectionReveal';
import { SurfaceCard } from '../ui/SurfaceCard';

interface VisualArchiveHighlightSectionProps {
  integrated?: boolean;
}

export function VisualArchiveHighlightSection({
  integrated = false,
}: VisualArchiveHighlightSectionProps) {
  const [activeItem, setActiveItem] = useState<VisualArchiveItem | null>(null);

  const highlights = useMemo(
    () => getHomepageArchiveHighlights(VISUAL_ARCHIVE),
    [],
  );
  const categoryCounts = useMemo(
    () => countVisualArchiveByCategory(VISUAL_ARCHIVE),
    [],
  );

  const innerContent = (
    <>
      {integrated ? (
        <div className="flex flex-col gap-3 border-b border-wood-subtle dark:border-slate-800/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-1 max-w-2xl">
            <p className="font-mono text-xs text-cyan-700 dark:text-cyan-400">
              Verified Event &amp; Award Photography
            </p>
            <h3 className={DESIGN_TOKENS.typography.cardTitleLg}>
              Visual Achievement Archive Highlights
            </h3>
            <p className="text-xs leading-relaxed text-wood-muted dark:text-slate-400">
              Selected real-world highlights from podium finishes, public speaking events, and executive committee induction. All {VISUAL_ARCHIVE.length} indexed assets live in the dedicated gallery.
            </p>
          </div>
          <Link
            to="/archive"
            className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 self-start py-1.5 sm:py-0 font-mono text-xs font-medium text-blue-700 dark:text-cyan-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200 shrink-0 sm:self-auto"
          >
            <span>Open Full Archive ({VISUAL_ARCHIVE.length})</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      ) : (
        <SectionHeading
          index="06"
          eyebrow="Verified Event & Award Photography"
          title="Visual Achievement Archive"
          description={`Selected highlights from podium finishes, public speaking events, and executive committee induction. All ${VISUAL_ARCHIVE.length} uploaded photographs, certificates, appointment letters, and posters live in the dedicated archive gallery.`}
          actionLabel={`Open Full Archive (${VISUAL_ARCHIVE.length})`}
          actionTo="/archive"
        />
      )}

        <SectionReveal>
          <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} sm:grid-cols-2 lg:grid-cols-4`}>
            {highlights.map((item) => (
              <SurfaceCard
                key={item.id}
                variant="interactive"
                as="article"
                className="group flex min-w-0 flex-col overflow-hidden p-0"
              >
                <button
                  type="button"
                  onClick={() => setActiveItem(item)}
                  aria-label={`Inspect photograph: ${item.associatedRecord}`}
                  className="flex flex-1 flex-col text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
                >
                  <div className="relative w-full border-b border-wood-subtle dark:border-slate-800/80">
                    <ArchiveMediaFrame
                      src={item.src}
                      alt={item.alt}
                      kind={item.kind}
                      rotateDeg={item.rotateDeg}
                      focalPosition={item.focalPosition}
                      mode="thumbnail"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute right-2.5 bottom-2.5 inline-flex h-7 w-7 items-center justify-center rounded-[7px] border border-wood-default/80 dark:border-slate-700/80 bg-wood-surface/92 dark:bg-[#050914]/90 text-wood-ink dark:text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                    >
                      <Expand className="h-3.5 w-3.5" />
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div className="space-y-1.5">
                      <p className="font-mono text-[11px] text-cyan-700 dark:text-cyan-400">
                        {item.category} · {item.date}
                      </p>
                      <h3 className={DESIGN_TOKENS.typography.cardTitle}>
                        {item.associatedRecord}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-wood-muted dark:text-slate-400">
                        {item.caption}
                      </p>
                    </div>

                    <span className="inline-flex items-center gap-1 font-mono text-[11px] font-medium text-blue-700 dark:text-blue-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                      <span>Open in Lightbox</span>
                      <ArrowRight className="h-3 w-3" aria-hidden="true" />
                    </span>
                  </div>
                </button>
              </SurfaceCard>
            ))}
          </div>
        </SectionReveal>

        {/* Interactive Archive Category & Certificate Summary Bar */}
        <div className="flex flex-col gap-4 rounded-[14px] border border-wood-subtle dark:border-slate-800/80 bg-wood-surface dark:bg-[#0b1222] p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2.5 min-w-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-wood-ink dark:text-slate-100">
              <Images
                className="h-4 w-4 text-cyan-700 dark:text-cyan-400 shrink-0"
                aria-hidden="true"
              />
              <span>Complete Visual Archive Coverage ({VISUAL_ARCHIVE.length} Verified Assets)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {VISUAL_ARCHIVE_CATEGORIES.filter((cat) => categoryCounts[cat] > 0).map((cat) => (
                <Link
                  key={cat}
                  to={`/archive?category=${encodeURIComponent(cat)}`}
                  className="inline-flex items-center gap-1 rounded-[7px] border border-wood-subtle dark:border-slate-800 bg-wood-inset dark:bg-[#060b16] px-2.5 py-1 font-mono text-[11px] text-wood-walnut dark:text-slate-300 transition-colors hover:border-blue-500/60 hover:text-blue-700 dark:hover:text-cyan-300"
                >
                  <span>{cat}</span>
                  <span className="text-wood-muted dark:text-slate-500 tabular-nums">
                    ({categoryCounts[cat]})
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-3">
            <Link
              to="/archive?kind=Certificate"
              className="inline-flex min-h-[38px] sm:min-h-0 items-center py-1.5 sm:py-0 font-mono text-xs font-medium text-blue-700 dark:text-blue-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-200"
            >
              View Certificates Only
            </Link>
            <Link
              to="/awards"
              className="inline-flex min-h-[38px] sm:min-h-0 items-center py-1.5 sm:py-0 text-xs font-medium text-wood-muted dark:text-slate-300 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
            >
              Awards &amp; Honors
            </Link>
            <LinkButton to="/archive" variant="secondary" size="sm">
              <span>Explore Full Visual Archive</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </LinkButton>
          </div>
        </div>
    </>
  );

  return (
    <>
      {integrated ? (
        <div
          id="archive"
          className="space-y-8 border-t border-wood-subtle dark:border-slate-800/80 pt-10"
        >
          {innerContent}
        </div>
      ) : (
        <section
          id="archive"
          className={`border-b border-wood-subtle dark:border-slate-800/80 bg-wood-alt dark:bg-[#050914] ${DESIGN_TOKENS.spacing.sectionY}`}
        >
          <div className={`${DESIGN_TOKENS.spacing.container} space-y-10`}>
            {innerContent}
          </div>
        </section>
      )}

      <ArchiveLightboxModal
        item={activeItem}
        items={highlights}
        onSelect={setActiveItem}
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}
