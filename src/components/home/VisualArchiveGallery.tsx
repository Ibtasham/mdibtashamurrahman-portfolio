import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircle,
  ArrowUpRight,
  Calendar,
  Expand,
  FolderKanban,
  LayoutGrid,
  Search,
} from 'lucide-react';
import { VISUAL_ARCHIVE } from '../../data/portfolio';
import { DESIGN_TOKENS } from '../../styles/designSystem';
import type { VisualArchiveItem } from '../../types/portfolio';
import {
  countVisualArchiveByCategory,
  filterVisualArchive,
  groupVisualArchiveByEvent,
  VISUAL_ARCHIVE_CATEGORIES,
  VISUAL_ARCHIVE_KINDS,
  type VisualArchiveCategoryFilter,
  type VisualArchiveKindFilter,
} from '../../utils/portfolioFilters';
import { ArchiveLightboxModal } from '../ui/ArchiveLightboxModal';
import { ArchiveMediaFrame } from '../ui/ArchiveMediaFrame';
import { EmptyState } from '../ui/EmptyState';
import { SurfaceCard } from '../ui/SurfaceCard';

const CATEGORY_TABS: VisualArchiveCategoryFilter[] = [
  'All',
  ...VISUAL_ARCHIVE_CATEGORIES,
];

const KIND_TABS: VisualArchiveKindFilter[] = [
  'All',
  ...VISUAL_ARCHIVE_KINDS,
];

export function VisualArchiveGallery() {
  const [selectedCategory, setSelectedCategory] =
    useState<VisualArchiveCategoryFilter>('All');
  const [selectedKind, setSelectedKind] =
    useState<VisualArchiveKindFilter>('All');
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'events'>('grid');
  const [activeItem, setActiveItem] = useState<VisualArchiveItem | null>(null);

  const categoryCounts = useMemo(
    () => countVisualArchiveByCategory(VISUAL_ARCHIVE),
    [],
  );

  const filteredItems = useMemo(
    () => filterVisualArchive(VISUAL_ARCHIVE, selectedCategory, selectedKind, query),
    [selectedCategory, selectedKind, query],
  );

  const eventGroups = useMemo(
    () => groupVisualArchiveByEvent(filteredItems),
    [filteredItems],
  );

  const pendingConfirmationCount = useMemo(
    () => filteredItems.filter((item) => Boolean(item.needsConfirmation)).length,
    [filteredItems],
  );

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedKind('All');
    setQuery('');
  };

  return (
    <section
      aria-label="Visual Achievement Archive Gallery"
      className={`border-b border-slate-200 dark:border-slate-800/80 bg-slate-50 dark:bg-[#050914] py-10 sm:py-14`}
    >
      <div className={`${DESIGN_TOKENS.spacing.container} space-y-8`}>
        {/* Controls Toolbar */}
        <div className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* Gallery Grid vs Event Groupings Switcher */}
            <div className="flex flex-wrap items-center gap-3">
              <div
                role="group"
                aria-label="Archive display layout"
                className="flex items-center rounded-[10px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] p-1"
              >
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    viewMode === 'grid'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Gallery Grid</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('events')}
                  aria-pressed={viewMode === 'events'}
                  className={`inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 rounded-[7px] px-3 py-2 sm:py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                    viewMode === 'events'
                      ? 'bg-[#2563eb] text-white'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200'
                  }`}
                >
                  <FolderKanban className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Event Groupings</span>
                </button>
              </div>

              <span className={DESIGN_TOKENS.typography.monoMicro}>
                Showing {filteredItems.length} of {VISUAL_ARCHIVE.length} Assets
              </span>
            </div>

            {/* Kind Selector & Search */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="archive-kind-filter"
                  className="font-mono text-[11px] text-slate-600 dark:text-slate-400 whitespace-nowrap"
                >
                  Media Type:
                </label>
                <select
                  id="archive-kind-filter"
                  value={selectedKind}
                  onChange={(e) =>
                    setSelectedKind(e.target.value as VisualArchiveKindFilter)
                  }
                  className="h-9 rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#060b16] px-3 text-xs text-slate-900 dark:text-slate-100 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                >
                  {KIND_TABS.map((kind) => (
                    <option key={kind} value={kind}>
                      {kind === 'All' ? 'All Media Types' : kind}
                    </option>
                  ))}
                </select>
              </div>

              <div className="relative w-full sm:w-72">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-slate-500"
                  aria-hidden="true"
                />
                <label htmlFor="archive-search" className="sr-only">
                  Search photographs, certificates, events, or filenames
                </label>
                <input
                  id="archive-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search event, caption, or filename..."
                  className="h-9 w-full rounded-[10px] border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#060b16] pr-3 pl-9 text-xs text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150 focus:border-blue-600 dark:focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400"
                />
              </div>
            </div>
          </div>

          {/* Populated Category Filter Pills */}
          <div
            role="group"
            aria-label="Filter visual archive by category"
            className="flex flex-wrap gap-2"
          >
            {CATEGORY_TABS.filter(
              (cat) => cat === 'All' || categoryCounts[cat] > 0,
            ).map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSelectedCategory(cat)}
                  className={`min-h-[40px] sm:min-h-[36px] shrink-0 rounded-[10px] border px-3 py-1.5 text-xs font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 whitespace-nowrap cursor-pointer ${
                    active
                      ? 'border-blue-600 bg-blue-50 text-blue-700 dark:border-blue-500/80 dark:bg-blue-600/20 dark:text-cyan-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-[#0b1222] dark:text-slate-400 dark:hover:border-slate-700 dark:hover:text-slate-200'
                  }`}
                >
                  {cat} ({categoryCounts[cat]})
                </button>
              );
            })}
          </div>
        </div>

        {/* Manual Confirmation Transparency Banner */}
        {pendingConfirmationCount > 0 && (
          <div className="flex items-start gap-2.5 rounded-[12px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0b1222] px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
            <AlertCircle
              className="mt-0.5 h-4 w-4 shrink-0 text-blue-700 dark:text-blue-400"
              aria-hidden="true"
            />
            <p className="leading-relaxed">
              <strong className="font-semibold text-slate-900 dark:text-slate-200">
                Verification Integrity:
              </strong>{' '}
              {pendingConfirmationCount} item{pendingConfirmationCount === 1 ? '' : 's'} in the current view carry a manual confirmation note where an exact event name, tenure confirmation, or certificate date was not asserted without source proof.
            </p>
          </div>
        )}

        {/* Archive Content View */}
        {filteredItems.length === 0 ? (
          <EmptyState
            title={
              selectedCategory !== 'All' && categoryCounts[selectedCategory] === 0
                ? `No Media Published Yet in "${selectedCategory}"`
                : 'No Matching Archive Items'
            }
            message={
              selectedCategory !== 'All' && categoryCounts[selectedCategory] === 0
                ? `No photographs or certificates have been published under "${selectedCategory}" yet.`
                : 'No photographs, certificates, or posters match your active filter combination.'
            }
            actionLabel="Show All Archive Items"
            onAction={resetFilters}
          />
        ) : viewMode === 'grid' ? (
          <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} sm:grid-cols-2 lg:grid-cols-3`}>
            {filteredItems.map((item) => (
              <ArchiveItemCard
                key={item.id}
                item={item}
                onOpen={() => setActiveItem(item)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-10">
            {eventGroups.map((group) => (
              <div key={group.eventGroup} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800/80 pb-2.5">
                  <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100 sm:text-lg">
                    {group.eventGroup}
                  </h2>
                  <span className={DESIGN_TOKENS.typography.monoMicro}>
                    {group.items.length} {group.items.length === 1 ? 'Asset' : 'Assets'}
                  </span>
                </div>

                <div className={`grid ${DESIGN_TOKENS.spacing.gridGap} sm:grid-cols-2 lg:grid-cols-3`}>
                  {group.items.map((item) => (
                    <ArchiveItemCard
                      key={item.id}
                      item={item}
                      onOpen={() => setActiveItem(item)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ArchiveLightboxModal
        item={activeItem}
        items={filteredItems}
        onSelect={setActiveItem}
        onClose={() => setActiveItem(null)}
      />
    </section>
  );
}

function ArchiveItemCard({
  item,
  onOpen,
}: {
  item: VisualArchiveItem;
  onOpen: () => void;
}) {
  return (
    <SurfaceCard
      variant="interactive"
      as="article"
      className="group flex min-w-0 flex-col justify-between overflow-hidden p-0"
    >
      <div>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Open lightbox for ${item.associatedRecord}`}
          className="relative block w-full border-b border-slate-200 dark:border-slate-800/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-cyan-600 dark:focus-visible:ring-cyan-400 cursor-pointer"
        >
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
            className="absolute right-2.5 bottom-2.5 inline-flex h-8 w-8 items-center justify-center rounded-[8px] border border-slate-300/80 dark:border-slate-700/80 bg-white/92 dark:bg-[#050914]/92 text-slate-700 dark:text-slate-200 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
          >
            <Expand className="h-3.5 w-3.5" />
          </span>
        </button>

        <div className="p-5 space-y-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-[11px]">
            <span className="text-cyan-700 dark:text-cyan-400">{item.kind}</span>
            <span className="inline-flex items-center gap-1 text-slate-500 tabular-nums">
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span>{item.date}</span>
            </span>
          </div>

          <h3 className={DESIGN_TOKENS.typography.cardTitle}>
            {item.associatedRecord}
          </h3>

          <p className="font-mono text-[11px] text-blue-700 dark:text-blue-300">
            {item.category}
          </p>

          <p className={DESIGN_TOKENS.typography.bodyMuted}>{item.caption}</p>

          {item.needsConfirmation && (
            <p className="flex items-start gap-1.5 rounded-[8px] border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-[#060b16] p-2.5 text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 shrink-0 text-blue-700 dark:text-blue-400"
                aria-hidden="true"
              />
              <span>Confirmation note: {item.needsConfirmation}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 dark:border-slate-800/70 px-5 py-2.5 sm:py-3">
        <button
          type="button"
          onClick={onOpen}
          className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1.5 py-1.5 sm:py-0 text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer"
        >
          <Expand className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Inspect Metadata</span>
        </button>

        {item.linkedRoute && (
          <Link
            to={item.linkedRoute}
            className="inline-flex min-h-[38px] sm:min-h-0 items-center gap-1 py-1.5 sm:py-0 font-mono text-xs font-medium text-blue-700 dark:text-blue-400 transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
          >
            <span>Linked Record</span>
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        )}
      </div>
    </SurfaceCard>
  );
}
